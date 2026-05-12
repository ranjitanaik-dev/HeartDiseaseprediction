from fastapi import APIRouter, HTTPException
from backend.models.schemas import SymptomRequest
from backend.lib.supabase import supabase
from typing import List, Dict
import os

router = APIRouter()

@router.post("/analyze/symptoms")
async def analyze_symptoms(request: SymptomRequest):
    text = request.symptoms.lower()
    
    risk_score = 0
    detected_symptoms = []
    
    symptom_keywords = {
        "chest pain": 3,
        "shortness of breath": 2,
        "palpitations": 2,
        "dizziness": 1,
        "fatigue": 1,
        "swelling": 1,
        "nausea": 1,
        "sweating": 2,
        "arm pain": 2,
        "jaw pain": 2
    }
    
    for symptom, score in symptom_keywords.items():
        if symptom in text:
            risk_score += score
            detected_symptoms.append(symptom)
            
    risk_level = "Low"
    if risk_score >= 5:
        risk_level = "High"
    elif risk_score >= 2:
        risk_level = "Medium"
        
    next_steps = [
        "Monitor your symptoms and keep a log.",
        "Schedule an appointment with your primary care physician.",
        "Seek immediate medical attention if symptoms worsen or include severe chest pain."
    ]
    
    return {
        "detected_symptoms": detected_symptoms,
        "estimated_risk_level": risk_level,
        "next_steps": next_steps if risk_level != "High" else [next_steps[2]],
        "disclaimer": "This analysis is for informational purposes only and is not a medical diagnosis."
    }

@router.get("/history/{user_id}")
async def get_history(user_id: str):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not connected")
    
    try:
        res = supabase.table("predictions").select("*, health_reports(*)").eq("user_id", user_id).order("created_at", desc=True).execute()
        return {
            "user_id": user_id,
            "history": res.data
        }
    except Exception as e:
        print(f"Error fetching history: {e}")
        return {"user_id": user_id, "history": [], "error": str(e)}

