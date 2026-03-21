import numpy as np
from sklearn.ensemble import RandomForestRegressor


class PovertyPredictor:
    def __init__(self):
        # In a production app, you'd load a .pkl file here.
        # For now, we initialize a model with some base "intelligence".
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)

        # Dummy Training Data: [Teacher-Student Ratio, Infra Score, Dropout Rate]
        # High ratio + Low infra + High dropout = High Poverty Index
        X_train = np.array([
            [40, 0.2, 15], [35, 0.3, 12], [20, 0.8, 2], [15, 0.9, 1],
            [50, 0.1, 25], [25, 0.6, 5], [30, 0.5, 8], [45, 0.15, 20]
        ])
        # Learning Poverty Index (0 to 1)
        y_train = np.array([0.75, 0.65, 0.15, 0.10, 0.90, 0.30, 0.45, 0.85])

        self.model.fit(X_train, y_train)

    def predict(self, ts_ratio, infra, dropout):
        features = np.array([[ts_ratio, infra, dropout]])
        prediction = self.model.predict(features)
        return float(prediction[0])


# Global instance so we don't re-train on every request
predictor = PovertyPredictor()