from db_setup import DatabaseConnection

def run_advanced_queries():
    # Initialize database connection
    db = DatabaseConnection()
    
    # Query 1: Agricultural Success Prediction by Region
    regional_analysis_query = """
    WITH RegionalSoilStats AS (
        SELECT 
            s.location,
            sc.day,
            AVG(sc.max_4_soil_temperature_under_SOD) AS avg_max_soil_temp,
            AVG(sc.min_4_soil_temperature_under_SOD) AS avg_min_soil_temp,
            AVG(w.total_precipitation) AS avg_precipitation
        FROM 
            soil sc
        JOIN 
            stations s ON sc.station_name = s.station_name
        JOIN 
            weather w ON w.station_name = s.station_name AND w.day = sc.day
        WHERE 
            YEAR(sc.day) >= 2020
        GROUP BY 
            s.location, sc.day
    )
    SELECT 
        cp.crop_type,
        rss.location,
        ROUND(AVG(rss.avg_max_soil_temp), 1) AS avg_max_soil_temp,
        ROUND(AVG(rss.avg_min_soil_temp), 1) AS avg_min_soil_temp,
        ROUND(AVG(rss.avg_precipitation), 2) AS avg_rainfall,
        COUNT(DISTINCT sc.station_name) AS station_count
    FROM 
        RegionalSoilStats rss
    JOIN 
        stations s ON rss.location = s.location
    JOIN 
        soil sc ON s.station_name = sc.station_name AND sc.day = rss.day
    JOIN 
        crops_planning cp
    GROUP BY 
        cp.crop_type, rss.location
    HAVING 
        COUNT(DISTINCT sc.station_name) >= 2
    ORDER BY 
        cp.crop_type;
    """
    
    # Query 2: User Expertise Analysis
    expertise_analysis_query = """
    WITH UserCropExpertise AS (
        SELECT 
            u.user_id,
            u.crop_type AS preferred_crop,
            COUNT(DISTINCT s.station_name) AS managed_stations
        FROM 
            users u
        JOIN 
            stations s
        GROUP BY 
            u.user_id, u.crop_type
        HAVING 
            COUNT(DISTINCT s.station_name) >= 2
    )
    SELECT 
        uce.user_id,
        uce.preferred_crop,
        uce.managed_stations,
        COUNT(w.day) as weather_records
    FROM 
        UserCropExpertise uce
    LEFT JOIN 
        stations s ON s.station_name IN (
            SELECT station_name 
            FROM stations 
            WHERE location IN (
                SELECT location 
                FROM stations 
                WHERE station_name = uce.user_id
            )
        )
    LEFT JOIN 
        weather w ON w.station_name = s.station_name
    GROUP BY 
        uce.user_id, uce.preferred_crop, uce.managed_stations
    ORDER BY 
        uce.managed_stations DESC;
    """
    
    # Query 3: Environmental Anomaly Analysis
    anomaly_analysis_query = """
    WITH EnvironmentalNorms AS (
        SELECT
            w.station_name,
            MONTH(w.day) AS month,
            AVG(w.avg_air_temperature) AS avg_temp_norm,
            STDDEV(w.avg_air_temperature) AS temp_stddev,
            AVG(w.total_precipitation) AS avg_precip_norm,
            STDDEV(w.total_precipitation) AS precip_stddev
        FROM
            weather w
        WHERE
            YEAR(w.day) < YEAR(CURRENT_DATE)
        GROUP BY
            w.station_name, MONTH(w.day)
    )
    SELECT 
        w.station_name,
        s.location,
        DATE_FORMAT(w.day, '%Y-%m') AS month,
        ROUND(AVG(w.avg_air_temperature - en.avg_temp_norm) / en.temp_stddev, 2) AS temp_anomaly,
        ROUND(AVG(w.total_precipitation - en.avg_precip_norm) / en.precip_stddev, 2) AS precip_anomaly,
        COUNT(*) as days_count
    FROM 
        weather w
    JOIN 
        stations s ON w.station_name = s.station_name
    JOIN 
        EnvironmentalNorms en ON w.station_name = en.station_name 
                               AND MONTH(w.day) = en.month
    WHERE 
        YEAR(w.day) = YEAR(CURRENT_DATE) - 1
    GROUP BY 
        w.station_name, s.location, DATE_FORMAT(w.day, '%Y-%m')
    HAVING 
        ABS(temp_anomaly) > 1.5 OR ABS(precip_anomaly) > 1.5
    ORDER BY 
        ABS(temp_anomaly) DESC;
    """
    
    # Query 4: Seasonal Planning Analysis
    seasonal_analysis_query = """
    WITH SeasonalData AS (
        SELECT 
            s.station_name,
            s.location,
            CASE 
                WHEN MONTH(w.day) BETWEEN 3 AND 5 THEN 'Spring'
                WHEN MONTH(w.day) BETWEEN 6 AND 8 THEN 'Summer'
                WHEN MONTH(w.day) BETWEEN 9 AND 11 THEN 'Fall'
                ELSE 'Winter'
            END AS season,
            AVG(w.avg_air_temperature) AS avg_temp,
            AVG(w.total_precipitation) AS avg_precip,
            COUNT(*) as days_count
        FROM 
            stations s
        JOIN 
            weather w ON s.station_name = w.station_name
        GROUP BY 
            s.station_name, s.location,
            CASE 
                WHEN MONTH(w.day) BETWEEN 3 AND 5 THEN 'Spring'
                WHEN MONTH(w.day) BETWEEN 6 AND 8 THEN 'Summer'
                WHEN MONTH(w.day) BETWEEN 9 AND 11 THEN 'Fall'
                ELSE 'Winter'
            END
    )
    SELECT 
        sd.location,
        sd.season,
        ROUND(AVG(sd.avg_temp), 1) AS avg_temperature,
        ROUND(AVG(sd.avg_precip), 2) AS avg_precipitation,
        COUNT(DISTINCT sd.station_name) AS station_count,
        GROUP_CONCAT(DISTINCT cp.crop_type) AS suitable_crops
    FROM 
        SeasonalData sd
    JOIN 
        crops_planning cp
    GROUP BY 
        sd.location, sd.season
    ORDER BY 
        sd.location, 
        CASE sd.season
            WHEN 'Spring' THEN 1
            WHEN 'Summer' THEN 2
            WHEN 'Fall' THEN 3
            WHEN 'Winter' THEN 4
        END;
    """
    
    # Execute queries and print results
    queries = {
        "Regional Analysis": regional_analysis_query,
        "User Expertise Analysis": expertise_analysis_query,
        "Environmental Anomaly Analysis": anomaly_analysis_query,
        "Seasonal Planning Analysis": seasonal_analysis_query
    }
    
    for query_name, query in queries.items():
        print(f"\n=== {query_name} ===")
        result = db.execute_query(query)
        if result is not None:
            print(result)
        else:
            print(f"Error executing {query_name}")
        print("\n" + "="*50)

if __name__ == "__main__":
    run_advanced_queries() 