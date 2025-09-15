import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [jsonInput, setJsonInput] = useState(""); // For JSON input
  const [result, setResult] = useState(null); // To display the result
  const [error, setError] = useState(null); // To display errors

  // Handle JSON input changes
  const handleJsonInputChange = (e) => {
    setJsonInput(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset errors
    setResult(null); // Reset results
    try {
      // Parse JSON input
      const parsedInput = JSON.parse(jsonInput);

      // Ensure 'features' is included in the input
      if (!parsedInput.features) {
        throw new Error("'features' key is missing in the input JSON.");
      }

      // Send POST request to Flask backend
      const response = await axios.post("http://127.0.0.1:5000/predict", parsedInput, {
        headers: { "Content-Type": "application/json" }
      });
      setResult(response.data); // Display the result
    } catch (err) {
      // Handle errors
      if (err.response) {
        setError(err.response.data.error || "An error occurred.");
      } else {
        setError(err.message || "Invalid JSON input or server error.");
      }
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>Breast Cancer Prediction</h1>
      </div>
      <div className="form-container">
        <form onSubmit={handleSubmit} className="input-form">
          <label htmlFor="jsonInput">Enter JSON Input:</label>
          <textarea
            id="jsonInput"
            value={jsonInput}
            onChange={handleJsonInputChange}
            rows="10"
            placeholder='{"features": [value1, value2, ..., value30]}'
            required
          ></textarea>
          <button type="submit" className="submit-button">
            Predict
          </button>
        </form>
      </div>
      {result && (
        <div className="result-container">
          <h2>Prediction Result</h2>
          <div className="result-card">
            <p><strong>Diagnosis:</strong> {result.prediction}</p>
            <p><strong>Probabilities:</strong></p>
            <ul>
              <li>Benign: {result.probability.Benign}%</li>
              <li>Malignant: {result.probability.Malignant}%</li>
            </ul>
          </div>
        </div>
      )}
      {error && (
        <div className="error-container">
          <p>Error: {error}</p>
        </div>
      )}
    </div>
  );
}

export default App;
