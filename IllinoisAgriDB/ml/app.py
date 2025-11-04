from flask import request, jsonify
from ml.inference import predict_one

@app.route("/api/predict", methods=["POST"])
def api_predict():
    data = request.get_json()
    station = data["station"]         # e.g. "Big Bend"
    record  = data["record"]          # {"avg_wind_dir":…, …}
    # optionally retrain or load per station…
    pred = predict_one(record)
    return jsonify({"prediction": pred})
