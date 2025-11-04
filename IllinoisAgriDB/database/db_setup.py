import pandas as pd
from sqlalchemy import create_engine, text, inspect
from dotenv import load_dotenv
import os
import pymysql

# Load environment variables
load_dotenv()

class DatabaseConnection:
    def __init__(self):
        self.user = os.getenv("DB_USER")
        self.password = os.getenv("DB_PASSWORD")
        self.host = os.getenv("DB_HOST")
        self.port = os.getenv("DB_PORT")
        self.database = os.getenv("DB_NAME")
        self.engine = None
        
    def create_database(self):
        """Create the database if it doesn't exist"""
        try:
            # Connect without specifying a database
            conn = pymysql.connect(
                host=self.host,
                user=self.user,
                password=self.password,
                port=int(self.port)
            )
            
            with conn.cursor() as cursor:
                # Create the database if it doesn't exist
                cursor.execute(f"CREATE DATABASE IF NOT EXISTS {self.database}")
                print(f"Database '{self.database}' created or already exists.")
            
            conn.close()
            return True
        except Exception as e:
            print(f"Error creating database: {str(e)}")
            return False

    def connect(self):
        """Create database connection"""
        if not self.engine:
            # First ensure the database exists
            self.create_database()
            
            connection_string = f"mysql+pymysql://{self.user}:{self.password}@{self.host}:{self.port}/{self.database}"
            self.engine = create_engine(connection_string)
            
            # Check if tables exist and have data
            try:
                inspector = inspect(self.engine)
                if "stations" not in inspector.get_table_names():
                    print("Tables not found. Loading data...")
                    self.load_data()
                else:
                    # Check if stations table has data
                    with self.engine.connect() as conn:
                        result = conn.execute(text("SELECT COUNT(*) FROM stations"))
                        count = result.scalar()
                        if count == 0:
                            print("Tables exist but no data found. Loading data...")
                            self.load_data()
            except Exception as e:
                print(f"Error checking tables: {str(e)}")
                
        return self.engine

    def load_data(self):
        """Load CSV data into MySQL database"""
        base_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "project_data")
        
        # Map CSV files to table names
        csv_table_map = {
            "user.csv": "users",
            "crop_and_planning.csv": "crops_planning",
            "station.csv": "stations",
            "weather.csv": "weather",
            "soil_condition.csv": "soil"
        }

        try:
            engine = self.connect()
            
            for filename, table_name in csv_table_map.items():
                full_path = os.path.join(base_path, filename)
                print(f"Loading {filename} into table '{table_name}'")
                
                if os.path.exists(full_path):
                    df = pd.read_csv(full_path)
                    df.to_sql(table_name, con=engine, if_exists="replace", index=False)
                else:
                    print(f"Warning: File {filename} not found in {base_path}")

            print("All tables loaded into MySQL database!")
            
            # Preview the loaded data
            self.preview_tables(csv_table_map.values())
            
        except Exception as e:
            print(f"Error loading data: {str(e)}")

    def preview_tables(self, table_names):
        """Preview the first 3 rows of each table"""
        try:
            with self.engine.connect() as conn:
                for table_name in table_names:
                    print(f"\nPreview of '{table_name}':")
                    preview_df = pd.read_sql(f"SELECT * FROM {table_name} LIMIT 3;", conn)
                    print(preview_df)
        except Exception as e:
            print(f"Error previewing tables: {str(e)}")

    def execute_query(self, query, params=None):
        """Execute a SQL query and return results as a DataFrame"""
        try:
            with self.engine.connect() as conn:
                if params:
                    result = pd.read_sql(text(query), conn, params=params)
                else:
                    result = pd.read_sql(text(query), conn)
                return result
        except Exception as e:
            print(f"Error executing query: {str(e)}")
            return None

# Example usage
if __name__ == "__main__":
    # Initialize database connection
    db = DatabaseConnection()
    
    # Connect will create the database and load data if needed
    db.connect()
    
    # Example query execution
    example_query = """
    SELECT 
        s.station_name,
        s.location,
        COUNT(w.day) as weather_records,
        AVG(w.avg_air_temperature) as avg_temp
    FROM 
        stations s
    JOIN 
        weather w ON s.station_name = w.station_name
    GROUP BY 
        s.station_name, s.location
    LIMIT 5;
    """
    
    result = db.execute_query(example_query)
    if result is not None:
        print("\nExample Query Result:")
        print(result)
