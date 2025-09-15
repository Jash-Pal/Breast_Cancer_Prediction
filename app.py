from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

# Initialize Flask app
app = Flask(__name__)

# Enable Cross-Origin Resource Sharing (CORS)
CORS(app)

# Load the saved model and scaler
model = joblib.load("best_model.pkl")
scaler = joblib.load("scaler.pkl")  

@app.route('/')
def home():
    return "Flask server is running."

# Define a route for predictions
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Parse JSON payload
        data = request.get_json()

        # Ensure 'features' key exists in the input
        if 'features' not in data:
            return jsonify({"error": "'features' key missing from input."}), 400

        # Convert 'features' to a NumPy array
        features = np.array(data['features']).reshape(1, -1)

        # Ensure correct number of features
        if features.shape[1] != 30:  # Ensure the feature count matches your model
            return jsonify({"error": "Invalid number of features. Expected 30 features."}), 400

        # Scale the features using the saved scaler
        features = scaler.transform(features)

        # Predict probabilities and class
        probabilities = model.predict_proba(features)[0]
        prediction = model.predict(features)[0]

        # Log probabilities
        print(f"Probabilities: {probabilities}")

        # Prepare the response
        result = {
            "prediction": "Malignant" if prediction == 1 else "Benign",
            "probability": {
                "Benign": round(probabilities[0] * 100, 2),
                "Malignant": round(probabilities[1] * 100, 2)
            }
        }
        return jsonify(result)

    except Exception as e:
        # Handle unexpected errors
        return jsonify({"error": str(e)}), 500

# Run the app
if __name__ == '__main__':
    app.run(debug=True)
