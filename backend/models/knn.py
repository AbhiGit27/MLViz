import numpy as np
from sklearn.neighbors import KNeighborsClassifier

class KNNModel:
    def __init__(self):
        self.model = None
        self.X = None
        self.y = None
        self.k = 5
        self.metric = "euclidean"
        self.single_class_fallback = None

    def train(self, points, k=5, metric="euclidean"):
        """
        points: list of dicts [{'x': float, 'y': float, 'label': int}]
        """
        if not points:
            return [], []

        self.k = k
        self.metric = metric
        self.X = np.array([[p['x'], p['y']] for p in points], dtype=np.float32)
        self.y = np.array([p['label'] for p in points], dtype=np.int32)

        unique_classes = np.unique(self.y)
        if len(unique_classes) < 2:
            self.single_class_fallback = int(unique_classes[0]) if len(unique_classes) > 0 else 0
            self.model = None
            return [{"iteration": 1, "accuracy": 1.0, "cost": 0.0}], [0.0]

        self.single_class_fallback = None
        actual_k = min(k, len(self.X))
        self.model = KNeighborsClassifier(n_neighbors=actual_k, metric=metric)
        self.model.fit(self.X, self.y)

        acc = float(self.model.score(self.X, self.y))
        loss = 1.0 - acc
        
        history = [{"iteration": 1, "accuracy": acc, "cost": loss}]
        cost_history = [loss]

        return history, cost_history

    def predict_mesh(self, xx, yy):
        if self.single_class_fallback is not None:
            return np.full_like(xx, self.single_class_fallback)
        if self.model is None or self.X is None:
            return np.zeros_like(xx)
        mesh_points = np.c_[xx.ravel(), yy.ravel()]
        preds = self.model.predict(mesh_points)
        return preds.reshape(xx.shape)

    def get_neighbors(self, query_point):
        if self.single_class_fallback is not None:
            # Return all indices for fallback
            return list(range(len(self.X))) if self.X is not None else []
        if self.model is None or self.X is None:
            return []
        
        actual_k = min(self.k, len(self.X))
        q = np.array([[query_point['x'], query_point['y']]], dtype=np.float32)
        distances, indices = self.model.kneighbors(q, n_neighbors=actual_k)
        return [int(idx) for idx in indices[0]]
