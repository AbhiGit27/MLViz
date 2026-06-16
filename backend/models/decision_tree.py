import numpy as np
from sklearn.tree import DecisionTreeClassifier

class DecisionTreeModel:
    def __init__(self):
        self.model = None
        self.single_class_fallback = None

    def train(self, points, max_depth=5, criterion="gini"):
        """
        points: list of dicts [{'x': float, 'y': float, 'label': int}]
        max_depth: int
        criterion: str ("gini" or "entropy")
        """
        if not points:
            return [], []

        X = np.array([[p['x'], p['y']] for p in points], dtype=np.float32)
        y = np.array([p['label'] for p in points], dtype=np.int32)

        unique_classes = np.unique(y)
        if len(unique_classes) < 2:
            # Fallback for single class datasets
            self.single_class_fallback = int(unique_classes[0]) if len(unique_classes) > 0 else 0
            self.model = None
            
            history = []
            cost_history = []
            for depth in range(1, max_depth + 1):
                history.append({
                    "iteration": depth,
                    "depth": depth,
                    "accuracy": 1.0,
                    "cost": 0.0
                })
                cost_history.append(0.0)
            return history, cost_history

        self.single_class_fallback = None
        history = []
        cost_history = []

        for depth in range(1, max_depth + 1):
            clf = DecisionTreeClassifier(max_depth=depth, criterion=criterion, random_state=42)
            clf.fit(X, y)
            train_acc = float(clf.score(X, y))
            loss = 1.0 - train_acc
            
            history.append({
                "iteration": depth,
                "depth": depth,
                "accuracy": train_acc,
                "cost": loss
            })
            cost_history.append(loss)

        self.model = DecisionTreeClassifier(max_depth=max_depth, criterion=criterion, random_state=42)
        self.model.fit(X, y)

        return history, cost_history

    def predict_mesh(self, xx, yy):
        if self.single_class_fallback is not None:
            return np.full_like(xx, self.single_class_fallback)
        if self.model is None:
            return np.zeros_like(xx)
        mesh_points = np.c_[xx.ravel(), yy.ravel()]
        preds = self.model.predict(mesh_points)
        return preds.reshape(xx.shape)

    def get_feature_splits_info(self):
        if self.single_class_fallback is not None:
            return {"n_leaves": 1, "depth": 0, "feature_importances": [0.0, 0.0]}
        if self.model is None:
            return {}
        return {
            "n_leaves": int(self.model.get_n_leaves()),
            "depth": int(self.model.get_depth()),
            "feature_importances": [float(val) for val in self.model.feature_importances_]
        }
