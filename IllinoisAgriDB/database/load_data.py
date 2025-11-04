import pandas as pd
from sqlalchemy import create_engine
import os

# MySQL login info
user = "root"
password = ""  # Leave blank if you didn't set one yet
host = "localhost"
port = 3306
database = "cs411_farm_data"

# MySQL connection engine
engine = create_engine(f"mysql+pymysql://{user}:{password}@{host}:{port}/{database}")

# Folder with your CSVs - using your project's data directory
base_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "project_data")

# Map of CSV to MySQL table names
csv_table_map = {
    "user.csv": "users",
    "crop_and_planning.csv": "crops_planning",
    "station.csv": "stations",
    "weather.csv": "weather",
    "soil_condition.csv": "soil",
}

# Load each CSV into MySQL
for filename, table_name in csv_table_map.items():
    full_path = os.path.join(base_path, filename)
    print(f"Loading {filename} into table '{table_name}'")
    
    if os.path.exists(full_path):
        df = pd.read_csv(full_path)
        df.to_sql(table_name, con=engine, if_exists="replace", index=False)
    else:
        print(f"Warning: File {filename} not found in {base_path}")

print("All tables loaded into MySQL database!")

# Preview
print("\nPreviewing tables:")
with engine.connect() as conn:
    for table_name in csv_table_map.values():
        print(f"\nPreview of '{table_name}':")
        preview_df = pd.read_sql(f"SELECT * FROM {table_name} LIMIT 3;", conn)
        print(preview_df) 