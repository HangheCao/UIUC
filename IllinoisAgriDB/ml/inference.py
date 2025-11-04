import os
import joblib
import pandas as pd

# Path to your serialized model; adjust if you keep it elsewhere
MODEL_PATH = os.getenv("MODEL_PATH", "ml/model.pkl")

# Load the model once at import time
model = joblib.load(MODEL_PATH)

def predict_one(x: dict) -> float:
    """
    x: a dict of feature_name → value for one sample
    returns: a float prediction
    """
    df = pd.DataFrame([x])
    return float(model.predict(df)[0])

def predict_batch(rows: list[dict]) -> list[float]:
    """
    rows: a list of dicts, each dict is one sample
    returns: a list of float predictions
    """
    df = pd.DataFrame(rows)
    return model.predict(df).tolist()
