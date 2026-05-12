from pydantic import BaseModel
from typing import Optional, List

class BasicForm(BaseModel):
    user_id: Optional[str] = None
    age: int
    gender: int # 0 Female, 1 Male
    height_cm: float
    weight_kg: float
    smoking: int # 0 None, 1 Occasional, 2 Frequent
    alcohol: int # 0 None, 1 Occasional, 2 Frequent
    exercise: int # 0 None, 1 1-3x/wk, 2 4+x/wk
    sleep_hours: float
    stress_level: int # 0 Low, 1 Med, 2 High
    family_history: int # 0 No, 1 Yes
    chest_pain_freq: int # 0 Never, 1 Sometimes, 2 Frequent
    palpitations: int # 0 No, 1 Yes
    daily_activity: int # 0 Sedentary, 1 Active, 2 Very Active

class AdvancedForm(BaseModel):
    user_id: Optional[str] = None
    age: int
    sex: int # 0 Female, 1 Male
    cp: int # Chest pain type 0-3
    trestbps: float # Resting blood pressure
    chol: float # Cholesterol
    fbs: int # Fasting blood sugar > 120 (0 or 1)
    restecg: int # 0, 1, 2
    thalach: float # Max heart rate
    exang: int # Exercise induced angina (0 or 1)
    oldpeak: float
    slope: int # 0, 1, 2
    ca: int # 0-4
    thal: int # 0-3

class SymptomRequest(BaseModel):
    user_id: Optional[str] = None
    symptoms: str
