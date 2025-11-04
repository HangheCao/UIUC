from flask import Flask, render_template, request, jsonify
from flask_cors import CORS # Import CORS
import random
from database.db_setup import DatabaseConnection
import datetime
import pandas as pd

app = Flask(__name__)
CORS(app) # Enable CORS for all routes on your app
db = DatabaseConnection()
db.connect() # <-- ADD THIS LINE TO ESTABLISH THE CONNECTION

@app.route('/')
def index():
    # No need to fetch regions/crops if they were only for the old index.html
    return jsonify({"status": "API Running", "message": "Frontend served separately."})

# New endpoint to fetch unique region names
@app.route('/api/regions')
def get_regions():
    location_query = """
    SELECT DISTINCT location FROM stations
    """
    location_result = db.execute_query(location_query)
    all_locations = []
    if location_result is not None and not location_result.empty:
        for loc in location_result['location']:
            # Simple split by comma and strip whitespace
            regions = [region.strip() for region in loc.split(',')]
            all_locations.extend(regions)
    unique_locations = sorted(list(set(all_locations)))
    return jsonify(unique_locations)

# Modified endpoint to fetch ALL unique crop types (no region filter possible with this table)
@app.route('/api/crops')
def get_crops():
    # Region parameter is no longer used here as crops_planning has no station link
    # selected_region = request.args.get('region') 
    
    # Simpler query to get all distinct crops from the planning table
    crop_query = """
    SELECT DISTINCT cp.Crop AS crop_name 
    FROM crops_planning cp
    WHERE cp.Crop IS NOT NULL AND cp.Crop != ''
    ORDER BY cp.Crop;
    """
    
    crop_result = db.execute_query(crop_query) # No params needed now
    
    crop_types = []
    if crop_result is not None and not crop_result.empty:
        crop_types = crop_result['crop_name'].tolist()
        
    return jsonify(crop_types)

@app.route('/get_random_station', methods=['POST'])
def get_random_station():

    selected_region = request.form.get('region')
    selected_crop = request.form.get('crop', '')
    start_date = request.form.get('start_date', '')
    end_date = request.form.get('end_date', '')
    

    date_conditions = ""
    if start_date and end_date:
        date_conditions = f"AND STR_TO_DATE(CONCAT(w.year, '-', LPAD(w.month, 2, '0'), '-', LPAD(w.day, 2, '0')), '%Y-%m-%d') BETWEEN '{start_date}' AND '{end_date}'"
    elif start_date:
        date_conditions = f"AND STR_TO_DATE(CONCAT(w.year, '-', LPAD(w.month, 2, '0'), '-', LPAD(w.day, 2, '0')), '%Y-%m-%d') >= '{start_date}'"
    elif end_date:
        date_conditions = f"AND STR_TO_DATE(CONCAT(w.year, '-', LPAD(w.month, 2, '0'), '-', LPAD(w.day, 2, '0')), '%Y-%m-%d') <= '{end_date}'"
    
    # 1. Get a random station in one query that matches all criteria

    station_query = f"""
    SELECT DISTINCT s.station_name, s.location
    FROM stations s
    JOIN weather w ON s.station_name = w.station
    JOIN soil so ON s.station_name = so.station
    WHERE s.location LIKE '%{selected_region}%'
    {date_conditions}
    """
    
    if selected_crop:
        station_query = f"""
        SELECT DISTINCT s.station_name, s.location
        FROM stations s
        JOIN weather w ON s.station_name = w.station
        JOIN soil so ON s.station_name = so.station
        LEFT JOIN users u ON s.station_name = u.user_id
        WHERE s.location LIKE '%{selected_region}%'
        AND u.crop_type = '{selected_crop}'
        {date_conditions}
        """
    
    station_query += " ORDER BY RAND() LIMIT 1"
    
    print(f"--- Attempting initial station query for region '{selected_region}' and crop '{selected_crop or "(any)"}' ---") # Log initial attempt
    station_result = db.execute_query(station_query)
    
    # If no station found with all criteria, try fallback query without crop filter
    if station_result is None or station_result.empty:
        if selected_crop:
            # Try again without the crop filter
            print(f"--- Initial query failed. Falling back to region '{selected_region}' only (no crop filter) ---") # Log fallback 1
            fallback_query = f"""
            SELECT DISTINCT s.station_name, s.location
            FROM stations s
            JOIN weather w ON s.station_name = w.station
            JOIN soil so ON s.station_name = so.station
            WHERE s.location LIKE '%{selected_region}%'
            {date_conditions}
            ORDER BY RAND() LIMIT 1
            """
            station_result = db.execute_query(fallback_query)
        
        # If still no result, try with just the region
        if station_result is None or station_result.empty:
            # Use a simpler query just filtering by region if others fail
            print(f"--- Fallback 1 failed. Falling back to simplest region '{selected_region}' query ---") # Log fallback 2
            fallback_query = f"""
            SELECT station_name, location
            FROM stations
            WHERE location LIKE '%{selected_region}%'
            ORDER BY RAND() LIMIT 1
            """
            station_result = db.execute_query(fallback_query)
            
            if station_result is None or station_result.empty:
                return jsonify({'error': 'No stations found for the selected region. Try a different region.'})
    
    # Extract the selected station
    station_name = station_result.iloc[0]['station_name']
    station_location = station_result.iloc[0]['location']
    
    # 2. Get a random date for this station that has both weather and soil data
    # Again using ORDER BY RAND() to select directly in the database
    date_query = f"""
    SELECT w.year, w.month, w.day
    FROM weather w
    JOIN soil s ON w.station = s.station AND w.year = s.year AND w.month = s.month AND w.day = s.day
    WHERE w.station = '{station_name}'
    """
    
    # Apply date filters if provided
    if start_date and end_date:
        date_query += f" AND STR_TO_DATE(CONCAT(w.year, '-', LPAD(w.month, 2, '0'), '-', LPAD(w.day, 2, '0')), '%Y-%m-%d') BETWEEN '{start_date}' AND '{end_date}'"
    elif start_date:
        date_query += f" AND STR_TO_DATE(CONCAT(w.year, '-', LPAD(w.month, 2, '0'), '-', LPAD(w.day, 2, '0')), '%Y-%m-%d') >= '{start_date}'"
    elif end_date:
        date_query += f" AND STR_TO_DATE(CONCAT(w.year, '-', LPAD(w.month, 2, '0'), '-', LPAD(w.day, 2, '0')), '%Y-%m-%d') <= '{end_date}'"
    
    # Add random selection and limit
    date_query += " ORDER BY RAND() LIMIT 1"
    
    # Get one random date
    random_date_result = db.execute_query(date_query)
    
    # Initialize response structure
    response = {
        'station': {
            'name': station_name,
            'location': station_location
        },
        'weather': {},
        'soil': {}
    }
    
    # Add crop info if specified
    if selected_crop:
        response['crop'] = selected_crop
    
    # If we found a date with both weather and soil data
    if random_date_result is not None and not random_date_result.empty:
        year = random_date_result.iloc[0]['year']
        month = random_date_result.iloc[0]['month']
        day = random_date_result.iloc[0]['day']
        
        # 3. Get both weather and soil data in a single query

        data_query = f"""
        SELECT 
            w.avg_air_temp, w.precip,
            s.max_soil_temp_2in_bare, s.min_soil_temp_2in_bare
        FROM weather w
        JOIN soil s ON 
            w.station = s.station AND 
            w.year = s.year AND 
            w.month = s.month AND 
            w.day = s.day
        WHERE w.station = '{station_name}'
        AND w.year = {year} AND w.month = {month} AND w.day = {day}
        LIMIT 1
        """
        
        combined_data = db.execute_query(data_query)
        
        if combined_data is not None and not combined_data.empty:
            data_row = combined_data.iloc[0]
            
            # Add weather data
            response['weather'] = {
                'date': f"{year}-{month}-{day}",
                'avg_temp': float(data_row['avg_air_temp']),
                'precipitation': str(data_row['precip']) if 'precip' in data_row else '0.0'
            }
            
            # Add soil data
            response['soil'] = {
                'date': f"{year}-{month}-{day}",
                'max_soil_temp': float(data_row['max_soil_temp_2in_bare']),
                'min_soil_temp': float(data_row['min_soil_temp_2in_bare'])
            }
    else:
        # Fallback if no dates with both weather and soil data:
        
        # Try to get at least some weather data
        weather_query = f"""
        SELECT year, month, day, avg_air_temp, precip
        FROM weather
        WHERE station = '{station_name}'
        ORDER BY RAND() LIMIT 1
        """
        weather_data = db.execute_query(weather_query)
        
        if weather_data is not None and not weather_data.empty:
            weather_row = weather_data.iloc[0]
            year = weather_row['year']
            month = weather_row['month']
            day = weather_row['day']
            
            response['weather'] = {
                'date': f"{year}-{month}-{day}",
                'avg_temp': float(weather_row['avg_air_temp']),
                'precipitation': str(weather_row['precip']) if 'precip' in weather_row else '0.0'
            }
        
        # Try to get at least some soil data
        soil_query = f"""
        SELECT year, month, day, max_soil_temp_2in_bare, min_soil_temp_2in_bare
        FROM soil
        WHERE station = '{station_name}'
        ORDER BY RAND() LIMIT 1
        """
        soil_data = db.execute_query(soil_query)
        
        if soil_data is not None and not soil_data.empty:
            soil_row = soil_data.iloc[0]
            year = soil_row['year']
            month = soil_row['month']
            day = soil_row['day']
            
            response['soil'] = {
                'date': f"{year}-{month}-{day}",
                'max_soil_temp': float(soil_row['max_soil_temp_2in_bare']),
                'min_soil_temp': float(soil_row['min_soil_temp_2in_bare'])
            }
    
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True) 