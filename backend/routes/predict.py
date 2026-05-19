from fastapi import APIRouter, HTTPException
import joblib
import numpy as np
import pandas as pd
import shap
from models.schemas import BasicForm, AdvancedForm
from lib.supabase import supabase
import os

router = APIRouter()

# Load models and scalers
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ML_DIR = os.path.join(BASE_DIR, "ml")

try:
    basic_model = joblib.load(os.path.join(ML_DIR, "basic_model.pkl"))
    basic_scaler = joblib.load(os.path.join(ML_DIR, "basic_scaler.pkl"))
    advanced_model = joblib.load(os.path.join(ML_DIR, "advanced_model.pkl"))
    advanced_scaler = joblib.load(os.path.join(ML_DIR, "advanced_scaler.pkl"))
    
    # Feature names for reference
    ADVANCED_FEATURES = ['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal']
    BASIC_FEATURES = ['age', 'gender', 'height_cm', 'weight_kg', 'smoking', 'alcohol', 'exercise', 'sleep_hours', 'stress_level', 'family_history', 'chest_pain_freq', 'palpitations', 'daily_activity']
    
    # Initialize SHAP explainer for advanced model (using a sample of training data or just the model)
    # For RF, TreeExplainer is best
    explainer = shap.TreeExplainer(advanced_model)
except Exception as e:
    print(f"Error loading models: {e}")
    basic_model = basic_scaler = advanced_model = advanced_scaler = explainer = None

@router.post("/predict/basic")
async def predict_basic(form: BasicForm):
    if basic_model is None:
        raise HTTPException(status_code=500, detail="Basic model not loaded")
    
    data = [[form.age, form.gender, form.height_cm, form.weight_kg, form.smoking, 
             form.alcohol, form.exercise, form.sleep_hours, form.stress_level, 
             form.family_history, form.chest_pain_freq, form.palpitations, form.daily_activity]]
    
    scaled_data = basic_scaler.transform(data)
    prob = basic_model.predict_proba(scaled_data)[0]
    prediction = int(np.argmax(prob))
    risk_percentage = float(np.max(prob) * 100)
    
    results = ["Low Risk", "Medium Risk", "High Risk"]
    
    # Simple logic for "Main Possible Causes"
    causes = []
    if form.smoking > 0: causes.append("Smoking habit")
    if form.stress_level > 1: causes.append("High stress levels")
    if form.family_history == 1: causes.append("Family history of heart disease")
    if form.chest_pain_freq > 0: causes.append("Frequent chest pain")
    
    recommendations = [
        "Maintain a balanced diet and regular exercise.",
        "Consult a doctor for a check-up and monitor your lifestyle.",
        "Urgent: Please visit a cardiologist for a thorough examination."
    ]
    
    result_data = {
        "risk_percentage": round(risk_percentage, 2),
        "prediction_result": results[prediction],
        "causes": causes if causes else ["General lifestyle factors"],
        "recommendations": [recommendations[prediction]],
        "disclaimer": "This system estimates heart disease risk and provides preventive insights. It is not a replacement for professional medical diagnosis."
    }

    # Save to Supabase if available
    if supabase and form.user_id:
        try:
            prediction_record = {
                "user_id": form.user_id,
                "prediction_mode": "Basic",
                "risk_percentage": result_data["risk_percentage"],
                "prediction_result": result_data["prediction_result"],
                "input_data": form.dict()
            }
            res = supabase.table("predictions").insert(prediction_record).execute()
            
            if res.data:
                pred_id = res.data[0]["id"]
                report_record = {
                    "prediction_id": pred_id,
                    "recommendation": result_data["recommendations"][0],
                    "causes": result_data["causes"]
                }
                supabase.table("health_reports").insert(report_record).execute()
        except Exception as e:
            print(f"Failed to save prediction: {e}")

    return result_data

@router.post("/predict/advanced")
async def predict_advanced(form: AdvancedForm):
    if advanced_model is None:
        raise HTTPException(status_code=500, detail="Advanced model not loaded")
    
    data = [[form.age, form.sex, form.cp, form.trestbps, form.chol, form.fbs, 
             form.restecg, form.thalach, form.exang, form.oldpeak, form.slope, form.ca, form.thal]]
    
    scaled_data = advanced_scaler.transform(data)
    prob = advanced_model.predict_proba(scaled_data)[0]
    prediction = int(np.argmax(prob))
    risk_percentage = float(prob[1] * 100) # Prob of class 1
    
    # SHAP Explanation
    shap_values = explainer.shap_values(scaled_data)
    
    # Handle different SHAP output formats (list of arrays vs single array)
    if isinstance(shap_values, list):
        importances = shap_values[1][0] if len(shap_values) > 1 else shap_values[0][0]
    else:
        # For numpy arrays, check the shape
        if len(shap_values.shape) == 3:
            # Case 1: (classes, samples, features)
            if shap_values.shape[0] > 1:
                importances = shap_values[1][0]
            # Case 2: (samples, features, classes)
            elif shap_values.shape[2] > 1:
                importances = shap_values[0, :, 1]
            # Fallback
            else:
                importances = shap_values[0, :, 0]
        else: # (samples, features)
            importances = shap_values[0]
            
    feature_importance = []
    for i, val in enumerate(importances):
        feature_importance.append({"feature": ADVANCED_FEATURES[i], "importance": float(val)})
    
    # Sort by absolute importance
    feature_importance.sort(key=lambda x: abs(x["importance"]), reverse=True)
    
    result_data = {
        "risk_percentage": round(risk_percentage, 2),
        "prediction_result": "Heart Disease Likely" if prediction == 1 else "No Heart Disease Detected",
        "feature_importance": feature_importance[:5], # Top 5 factors
        "recommendations": ["Consult with a medical professional to discuss these clinical results."],
        "disclaimer": "This system estimates heart disease risk and provides preventive insights. It is not a replacement for professional medical diagnosis."
    }

    # Save to Supabase if available
    if supabase and form.user_id:
        try:
            prediction_record = {
                "user_id": form.user_id,
                "prediction_mode": "Advanced",
                "risk_percentage": result_data["risk_percentage"],
                "prediction_result": result_data["prediction_result"],
                "input_data": form.dict()
            }
            res = supabase.table("predictions").insert(prediction_record).execute()
            
            if res.data:
                pred_id = res.data[0]["id"]
                report_record = {
                    "prediction_id": pred_id,
                    "recommendation": result_data["recommendations"][0],
                    "causes": [f["feature"] for f in result_data["feature_importance"] if f["importance"] > 0]
                }
                supabase.table("health_reports").insert(report_record).execute()
        except Exception as e:
            print(f"Failed to save prediction: {e}")

    return result_data
