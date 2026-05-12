import pandas as pd
import numpy as np
import os

def generate_data(num_samples=2000):
    np.random.seed(42)
    
    # Feature ranges (rough approximations)
    age = np.random.randint(18, 90, num_samples)
    gender = np.random.choice([0, 1], num_samples) # 0: Female, 1: Male
    height_cm = np.random.normal(165, 10, num_samples)
    weight_kg = np.random.normal(70, 15, num_samples)
    
    # Lifestyle factors (0=Low/No, 1=Occasional/Medium, 2=High/Frequent)
    smoking = np.random.choice([0, 1, 2], num_samples, p=[0.6, 0.2, 0.2])
    alcohol = np.random.choice([0, 1, 2], num_samples, p=[0.5, 0.3, 0.2])
    exercise = np.random.choice([0, 1, 2], num_samples, p=[0.4, 0.4, 0.2]) # 0: None, 1: 1-3 times/wk, 2: 4+ times/wk
    sleep_hours = np.random.normal(7, 1.5, num_samples)
    stress_level = np.random.choice([0, 1, 2], num_samples) # 0: Low, 1: Med, 2: High
    
    # Symptoms & History
    family_history = np.random.choice([0, 1], num_samples, p=[0.7, 0.3])
    chest_pain_freq = np.random.choice([0, 1, 2], num_samples, p=[0.8, 0.15, 0.05])
    palpitations = np.random.choice([0, 1], num_samples, p=[0.85, 0.15])
    daily_activity = np.random.choice([0, 1, 2], num_samples) # 0: Sedentary, 1: Active, 2: Very Active

    # Calculate a rough risk score based on features (higher score = higher risk)
    # This is a synthetic target function for the ML model to learn
    risk_score = (
        (age / 90) * 2 + 
        smoking * 1.5 + 
        alcohol * 1.0 - 
        (exercise / 2) * 1.5 - 
        ((sleep_hours - 4) / 6) * 0.5 + 
        stress_level * 1.0 + 
        family_history * 2.0 + 
        chest_pain_freq * 3.0 + 
        palpitations * 1.5 - 
        (daily_activity / 2) * 1.0 +
        ((weight_kg / ((height_cm/100)**2)) > 25) * 1.0 # BMI overweight factor
    )
    
    # Normalize risk score to 0-1 probability
    risk_prob = 1 / (1 + np.exp(-(risk_score - 4))) # Sigmoid centered around 4
    
    # Target: 0 (Low), 1 (Medium), 2 (High) risk
    target = np.zeros(num_samples, dtype=int)
    target[risk_prob > 0.4] = 1
    target[risk_prob > 0.7] = 2

    data = pd.DataFrame({
        "age": age,
        "gender": gender,
        "height_cm": height_cm,
        "weight_kg": weight_kg,
        "smoking": smoking,
        "alcohol": alcohol,
        "exercise": exercise,
        "sleep_hours": sleep_hours,
        "stress_level": stress_level,
        "family_history": family_history,
        "chest_pain_freq": chest_pain_freq,
        "palpitations": palpitations,
        "daily_activity": daily_activity,
        "target": target
    })

    return data

def main():
    os.makedirs("backend/ml", exist_ok=True)
    df = generate_data()
    df.to_csv("backend/ml/basic_lifestyle_data.csv", index=False)
    print("Synthetic basic lifestyle dataset generated at 'backend/ml/basic_lifestyle_data.csv'.")

if __name__ == "__main__":
    main()
