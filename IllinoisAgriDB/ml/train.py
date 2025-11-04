# ml/train.py

import os
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression

def load_station_counties(station_name: str, data_dir: str) -> list[str]:
    """
    Read station.csv, look up the row for `station_name`,
    split its 'location' field into a list of counties.
    """
    stations = pd.read_csv(os.path.join(data_dir, "station.csv"))
    row = stations.loc[stations["station_name"] == station_name]
    if row.empty:
        raise ValueError(f"Station '{station_name}' not found in station.csv")
    # e.g. "St.Clair, Monroe, Madison" → ["St.Clair","Monroe","Madison"]
    return [c.strip() for c in row.iloc[0]["location"].split(",")]

def load_and_merge(station_name: str, data_dir: str) -> pd.DataFrame:
    """
    1) Load soil & weather CSVs
    2) Filter both to only the counties in this station
    3) Merge on ['date','county']
    4) Do your date‐indexing, lag features, dropna, etc.
    """
    counties = load_station_counties(station_name, data_dir)

    soil = pd.read_csv(
        os.path.join(data_dir, "soil_condition.csv"),
        parse_dates=["date"]
    )
    weather = pd.read_csv(
        os.path.join(data_dir, "weather.csv"),
        parse_dates=["date"]
    )

    # keep only rows for these counties
    soil    = soil[soil["county"].isin(counties)]
    weather = weather[weather["county"].isin(counties)]

    # inner join on date & county
    df = pd.merge(soil, weather, on=["date", "county"], how="inner")

    # --- now replicate your earlier cleaning (pics 2–3) ---
    # e.g. drop unwanted soil cols, reset index, asfreq, dropna on target, dedupe
    soil_cols    = [c for c in df.columns if "soil" in c]
    drop_soil    = [c for c in soil_cols if c != "avg_soil_temp_8in_sod"]
    df = df.drop(columns=drop_soil + ["station", "year", "month", "day"], errors="ignore")

    df = df.set_index("date").asfreq("D").dropna(subset=["avg_soil_temp_8in_sod"])
    df = df[~df.index.duplicated(keep="first")]

    # lag features
    best_lag = 2
    for lag in range(1, best_lag + 1):
        df[f"Tlag_{lag}"] = df["avg_soil_temp_8in_sod"].shift(lag)
    df = df.dropna()

    return df

def train_model(
    station_name: str,
    data_dir: str = "project_data",      # or wherever you keep your CSVs
    test_size: float = 0.2,
    random_state: int = 42
):
    df = load_and_merge(station_name, data_dir)

    # pick your features & target just as you did before
    X = df[[
        "avg_wind_dir", "precip", "pot_evapot",
        "min_rel_hum", "Tlag_1", "Tlag_2"
    ]]
    y = df["avg_soil_temp_8in_sod"]

    # polynomial transform
    poly = PolynomialFeatures(degree=2, include_bias=False)
    X_poly = poly.fit_transform(X)

    # train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X_poly, y, test_size=test_size, random_state=random_state
    )

    # instantiate & fit your estimator
    model = LinearRegression()
    model.fit(X_train, y_train)

    return model, poly

def save_model(
    station_name: str,
    data_dir: str = "project_data",
    out_path: str = "ml/model.pkl"
):
    """
    Trains + serializes both the transformer and the model
    so inference.py can just load them later.
    """
    model, poly = train_model(station_name, data_dir)
    joblib.dump({"model": model, "poly": poly}, out_path)
    print(f"✅ Saved model + transformer to {out_path}")

if __name__ == "__main__":
    # e.g. run `py -c "import ml.train; ml.train.save_model('St.Louis')"`
    from sys import argv
    if len(argv) < 2:
        raise RuntimeError("Usage: python -m ml.train <STATION_NAME> [DATA_DIR]")
    save_model(argv[1], argv[2] if len(argv) > 2 else "project_data")
