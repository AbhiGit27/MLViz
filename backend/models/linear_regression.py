import numpy as np

class LinearRegressionCustom:
    def __init__(self):
        self.w = 0.0
        self.b = 0.0

    def train(self, points, learning_rate=0.01, iterations=100):
        """
        points: list of dicts [{'x': float, 'y': float}]
        learning_rate: float
        iterations: int
        """
        if not points:
            return [], []

        X = np.array([p['x'] for p in points], dtype=np.float32)
        y = np.array([p['y'] for p in points], dtype=np.float32)

        if len(X) < 2:
            # Simple fallback for 1 point
            self.w = 0.0
            self.b = float(y[0]) if len(y) > 0 else 0.0
            return [{"iteration": 0, "w": self.w, "b": self.b, "cost": 0.0}], [0.0]

        # Min-max scaling to prevent gradient explosion
        x_min, x_max = X.min(), X.max()
        y_min, y_max = y.min(), y.max()
        
        x_range = x_max - x_min if x_max != x_min else 1.0
        y_range = y_max - y_min if y_max != y_min else 1.0

        X_scaled = (X - x_min) / x_range
        y_scaled = (y - y_min) / y_range

        w_scaled = 0.0
        b_scaled = 0.0
        n = len(X)
        
        history = []
        cost_history = []

        sample_interval = max(1, iterations // 20)

        for i in range(iterations + 1):
            # Scaled prediction & MSE
            y_pred_scaled = w_scaled * X_scaled + b_scaled
            
            # Map back to compute original scale weights for visual output
            w_orig = (w_scaled * y_range) / x_range
            b_orig = y_min + (y_range * b_scaled) - (w_orig * x_min)
            
            # Compute MSE on original scale
            y_pred_orig = w_orig * X + b_orig
            mse = float(np.mean((y - y_pred_orig) ** 2))
            
            # Sanitize float values to prevent JSON dumps inf/nan issues
            if np.isnan(mse) or np.isinf(mse):
                mse = 99999.0
            if np.isnan(w_orig) or np.isinf(w_orig):
                w_orig = 0.0
            if np.isnan(b_orig) or np.isinf(b_orig):
                b_orig = 0.0

            if i % sample_interval == 0 or i == iterations:
                history.append({
                    "iteration": i,
                    "w": float(w_orig),
                    "b": float(b_orig),
                    "cost": float(mse)
                })
            
            cost_history.append(float(mse))

            if i < iterations:
                # Gradients on scaled data
                dw = -(2/n) * np.sum(X_scaled * (y_scaled - y_pred_scaled))
                db = -(2/n) * np.sum(y_scaled - y_pred_scaled)
                
                # Update scaled params
                w_scaled -= learning_rate * dw
                b_scaled -= learning_rate * db

        # Save final mapped weights
        self.w = (w_scaled * y_range) / x_range
        self.b = y_min + (y_range * b_scaled) - (self.w * x_min)
        
        # Sanitize final states
        if np.isnan(self.w) or np.isinf(self.w): self.w = 0.0
        if np.isnan(self.b) or np.isinf(self.b): self.b = 0.0

        return history, cost_history

    def predict(self, X_val):
        return self.w * np.array(X_val) + self.b
