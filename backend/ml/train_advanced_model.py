import pandas as pd
import os
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, confusion_matrix
import joblib

def main():
    # Path to the dataset (assuming script is run from project root)
    data_path = "heart.csv"
    if not os.path.exists(data_path):
        print(f"Error: Dataset {data_path} not found.")
        return

    print(f"Loading data from {data_path}...")
    df = pd.read_csv(data_path)

    # Assuming target column is named 'target'
    if 'target' not in df.columns:
        print("Error: 'target' column not found in dataset.")
        return

    X = df.drop("target", axis=1)
    y = df["target"]

    print("Scaling features...")
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

    print("Training Random Forest Classifier...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    cm = confusion_matrix(y_test, y_pred)

    print(f"Model Accuracy: {accuracy * 100:.2f}%")
    print(f"Confusion Matrix:\n{cm}")

    # Ensure output directory exists
    os.makedirs("backend/ml", exist_ok=True)

    # Save the model and scaler
    joblib.dump(model, "backend/ml/advanced_model.pkl")
    joblib.dump(scaler, "backend/ml/advanced_scaler.pkl")
    print("Advanced model and scaler saved successfully.")

    # Print feature names for SHAP compatibility later
    print(f"Feature names: {list(X.columns)}")

if __name__ == "__main__":
    main()
