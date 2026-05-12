import pandas as pd
import os
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, confusion_matrix
import joblib

def main():
    data_path = "backend/ml/basic_lifestyle_data.csv"
    if not os.path.exists(data_path):
        print(f"Error: Dataset {data_path} not found. Run generate_basic_data.py first.")
        return

    print(f"Loading data from {data_path}...")
    df = pd.read_csv(data_path)

    X = df.drop("target", axis=1)
    y = df["target"]

    print("Scaling features...")
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

    print("Training Random Forest Classifier (Basic Model)...")
    # Use max_depth to prevent overfitting on synthetic data
    model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    cm = confusion_matrix(y_test, y_pred)

    print(f"Model Accuracy: {accuracy * 100:.2f}%")
    print(f"Confusion Matrix:\n{cm}")

    os.makedirs("backend/ml", exist_ok=True)

    # Save the model and scaler
    joblib.dump(model, "backend/ml/basic_model.pkl")
    joblib.dump(scaler, "backend/ml/basic_scaler.pkl")
    print("Basic model and scaler saved successfully.")
    
    print(f"Feature names: {list(X.columns)}")

if __name__ == "__main__":
    main()
