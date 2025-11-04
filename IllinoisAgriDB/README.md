# Agricultural Data Dashboard

A web application that connects to a database of agricultural stations and displays weather and soil data for different regions in Illinois.

## Overview

This application allows users to:
- Select a region from a dropdown menu
- View a randomly selected agricultural station from that region
- See the latest weather and soil data for that station

The application demonstrates database connectivity by fetching and displaying real data from a MySQL database.

## Project Structure

```
├── app.py                 # Main Flask application
├── database/              # Database connection and setup code
│   ├── __init__.py
│   ├── db_setup.py        # Database configuration and connection
│   ├── load_data.py       # Data loading utilities
│   └── query_examples.py  # Example queries
├── project_data/          # CSV data files
│   ├── crop_and_planning.csv
│   ├── soil_condition.csv
│   ├── station.csv
│   ├── user.csv
│   └── weather.csv
├── templates/             # HTML templates
│   └── index.html         # Main interface
├── .env                   # Database configuration (not in repository)
├── requirements.txt       # Python dependencies
├── README.md              # This file
└── .gitignore             # Git ignore file
```

## Prerequisites

- Python 3.x
- MySQL database
- pip (Python package installer)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/agricultural-data-dashboard.git
cd agricultural-data-dashboard
```

2. Create and activate a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install the required packages:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the root directory with your database configuration:
```
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cs411_farm_data
```

## Database Setup

The application needs a MySQL database to store agricultural data. The database will be created automatically if it doesn't exist when you run the application.

To manually setup the database and load data:

```python
from database.db_setup import DatabaseConnection
db = DatabaseConnection()
db.create_database()  # Create the database if it doesn't exist
db.connect()          # Connect to the database
db.load_data()        # Load data from CSV files
```

## Running the Application

Start the Flask application:

```bash
python app.py
```

Then open your browser and navigate to http://127.0.0.1:5000/

## API Endpoints

- `GET /`: Serves the main web interface
- `POST /get_random_station`: Returns data for a random station in the selected region

## Technologies Used

- **Backend**: Flask, SQLAlchemy
- **Database**: MySQL
- **Frontend**: HTML, CSS, JavaScript, Bootstrap
- **Data Processing**: Pandas

## Screenshots

[Screenshots will be added here]

## Contributors

- Team 044 - ILL

## License

This project is part of CS411 course at the University of Illinois.
