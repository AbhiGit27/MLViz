import numpy as np
from sklearn.svm import SVC
import warnings

class SVMModel:
    def __init__(self):
        self.model = None
        self.X = None
        self.y = None
        self.single_class_fallback = None

    def train(self, points, C=1.0, kernel="rbf", gamma="scale", max_iter_limit=100):
        """
        points: list of dicts [{'x': float, 'y': float, 'label': int}]
        """
        if not points:
            return [], []

        self.X = np.array([[p['x'], p['y']] for p in points], dtype=np.float32)
        self.y = np.array([p['label'] for p in points], dtype=np.int32)

        unique_classes = np.unique(self.y)
        if len(unique_classes) < 2:
            self.single_class_fallback = int(unique_classes[0]) if len(unique_classes) > 0 else 0
            self.model = None
            
            history = []
            cost_history = []
            iters = [1, 2, 5, 10, 15, 20, 30, 40, 50, 75, 100]
            for it in iters:
                if it > max_iter_limit: break
                history.append({
                    "iteration": it,
                    "accuracy": 1.0,
                    "cost": 0.0
                })
                cost_history.append(0.0)
            return history, cost_history

        self.single_class_fallback = None
        history = []
        cost_history = []
        iters = [1, 2, 5, 10, 15, 20, 30, 40, 50, 75, 100]
        
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            for it in iters:
                if it > max_iter_limit:
                    break
                clf = SVC(C=C, kernel=kernel, gamma=gamma, max_iter=it, random_state=42)
                clf.fit(self.X, self.y)
                
                acc = float(clf.score(self.X, self.y))
                loss = 1.0 - acc
                
                history.append({
                    "iteration": it,
                    "accuracy": acc,
                    "cost": loss
                })
                cost_history.append(loss)

        self.model = SVC(C=C, kernel=kernel, gamma=gamma, random_state=42)
        self.model.fit(self.X, self.y)

        return history, cost_history

    def predict_mesh(self, xx, yy):
        if self.single_class_fallback is not None:
            return np.full_like(xx, self.single_class_fallback)
        if self.model is None or self.X is None:
            return np.zeros_like(xx)
        mesh_points = np.c_[xx.ravel(), yy.ravel()]
        preds = self.model.predict(mesh_points)
        return preds.reshape(xx.shape)

    def predict_decision_function(self, xx, yy):
        if self.single_class_fallback is not None:
            # Constant decision function values (distance values)
            val = 1.0 if self.single_class_fallback == 1 else -1.0
            return np.full_like(xx, val)
        if self.model is None or self.X is None:
            return np.zeros_like(xx)
        mesh_points = np.c_[xx.ravel(), yy.ravel()]
        dec = self.model.decision_function(mesh_points)
        return dec.reshape(xx.shape)

    def get_support_vectors(self):
        if self.single_class_fallback is not None:
            return []
        if self.model is None:
            return []
        return [int(idx) for idx in self.model.support_]
