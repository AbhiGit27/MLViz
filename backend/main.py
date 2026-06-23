import os
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

# Import models
from models import LinearRegressionCustom, DecisionTreeModel, KNNModel, SVMModel

app = FastAPI(title="MLViz Backend API")

# Add middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Point(BaseModel):
    x: float
    y: float
    label: Optional[int] = None

class TrainRequest(BaseModel):
    algorithm: str
    points: List[Point]
    params: Dict[str, Any]

@app.get("/health")
def health():
    return {"status": "ok"}

def get_data_bounds(points: List[Point], padding: float = 0.1):
    if not points:
        return 0.0, 1.0, 0.0, 1.0
    
    xs = [p.x for p in points]
    ys = [p.y for p in points]
    
    xmin, xmax = min(xs), max(xs)
    ymin, ymax = min(ys), max(ys)
    
    x_span = xmax - xmin if xmax != xmin else 1.0
    y_span = ymax - ymin if ymax != ymin else 1.0
    
    return (
        xmin - x_span * padding,
        xmax + x_span * padding,
        ymin - y_span * padding,
        ymax + y_span * padding
    )

@app.post("/train")
def train_model(req: TrainRequest):
    if not req.points:
        raise HTTPException(status_code=400, detail="Data points are required.")

    algo = req.algorithm.lower()
    points_dict = [{"x": p.x, "y": p.y, "label": p.label} for p in req.points]

    if algo == "linear_regression":
        lr = LinearRegressionCustom()
        lr_params = req.params
        learning_rate = float(lr_params.get("learning_rate", 0.01))
        iterations = int(lr_params.get("iterations", 100))
        
        history, cost_history = lr.train(points_dict, learning_rate, iterations)
        
        # Calculate fitted line coordinates
        xmin, xmax, _, _ = get_data_bounds(req.points)
        x_line = np.linspace(xmin, xmax, 100)
        y_line = lr.predict(x_line)
        
        return {
            "history": history,
            "cost_history": cost_history,
            "line_info": {
                "x": x_line.tolist(),
                "y": y_line.tolist()
            },
            "metadata": {
                "w": float(lr.w),
                "b": float(lr.b)
            }
        }

    elif algo == "decision_tree":
        dt = DecisionTreeModel()
        dt_params = req.params
        max_depth = int(dt_params.get("max_depth", 5))
        criterion = str(dt_params.get("criterion", "gini"))
        
        history, cost_history = dt.train(points_dict, max_depth, criterion)
        
        # Generate meshgrid
        xmin, xmax, ymin, ymax = get_data_bounds(req.points)
        xx, yy = np.meshgrid(np.linspace(xmin, xmax, 100), np.linspace(ymin, ymax, 100))
        Z = dt.predict_mesh(xx, yy)
        
        return {
            "history": history,
            "cost_history": cost_history,
            "boundary_info": {
                "xx": xx.tolist(),
                "yy": yy.tolist(),
                "Z": Z.tolist()
            },
            "metadata": dt.get_feature_splits_info()
        }

    elif algo == "knn":
        knn = KNNModel()
        knn_params = req.params
        k = int(knn_params.get("k", 5))
        metric = str(knn_params.get("metric", "euclidean"))
        
        history, cost_history = knn.train(points_dict, k, metric)
        
        # Generate meshgrid
        xmin, xmax, ymin, ymax = get_data_bounds(req.points)
        xx, yy = np.meshgrid(np.linspace(xmin, xmax, 100), np.linspace(ymin, ymax, 100))
        Z = knn.predict_mesh(xx, yy)
        
        return {
            "history": history,
            "cost_history": cost_history,
            "boundary_info": {
                "xx": xx.tolist(),
                "yy": yy.tolist(),
                "Z": Z.tolist()
            },
            "metadata": {
                "k": k,
                "metric": metric
            }
        }

    elif algo == "svm":
        svm = SVMModel()
        svm_params = req.params
        C = float(svm_params.get("C", 1.0))
        kernel = str(svm_params.get("kernel", "rbf"))
        gamma = svm_params.get("gamma", "scale")
        if isinstance(gamma, str) and gamma not in ["scale", "auto"]:
            gamma = float(gamma)
            
        history, cost_history = svm.train(points_dict, C, kernel, gamma)
        
        # Generate meshgrid
        xmin, xmax, ymin, ymax = get_data_bounds(req.points)
        xx, yy = np.meshgrid(np.linspace(xmin, xmax, 100), np.linspace(ymin, ymax, 100))
        Z = svm.predict_mesh(xx, yy)
        Z_dec = svm.predict_decision_function(xx, yy)
        
        return {
            "history": history,
            "cost_history": cost_history,
            "boundary_info": {
                "xx": xx.tolist(),
                "yy": yy.tolist(),
                "Z": Z.tolist(),
                "Z_dec": Z_dec.tolist()
            },
            "metadata": {
                "support_vectors": svm.get_support_vectors()
            }
        }

    else:
        raise HTTPException(status_code=400, detail=f"Algorithm '{req.algorithm}' not supported.")

@app.post("/decision-boundary")
def decision_boundary(req: TrainRequest):
    if not req.points:
        raise HTTPException(status_code=400, detail="Data points are required.")

    algo = req.algorithm.lower()
    points_dict = [{"x": p.x, "y": p.y, "label": p.label} for p in req.points]

    if algo == "linear_regression":
        lr = LinearRegressionCustom()
        lr_params = req.params
        learning_rate = float(lr_params.get("learning_rate", 0.01))
        iterations = int(lr_params.get("iterations", 100))
        lr.train(points_dict, learning_rate, iterations)
        
        xmin, xmax, _, _ = get_data_bounds(req.points)
        x_line = np.linspace(xmin, xmax, 100)
        y_line = lr.predict(x_line)
        return {
            "line_info": {
                "x": x_line.tolist(),
                "y": y_line.tolist()
            }
        }

    elif algo == "decision_tree":
        dt = DecisionTreeModel()
        dt_params = req.params
        max_depth = int(dt_params.get("max_depth", 5))
        criterion = str(dt_params.get("criterion", "gini"))
        dt.train(points_dict, max_depth, criterion)
        
        xmin, xmax, ymin, ymax = get_data_bounds(req.points)
        xx, yy = np.meshgrid(np.linspace(xmin, xmax, 100), np.linspace(ymin, ymax, 100))
        Z = dt.predict_mesh(xx, yy)
        return {
            "xx": xx.tolist(),
            "yy": yy.tolist(),
            "Z": Z.tolist()
        }

    elif algo == "knn":
        knn = KNNModel()
        knn_params = req.params
        k = int(knn_params.get("k", 5))
        metric = str(knn_params.get("metric", "euclidean"))
        knn.train(points_dict, k, metric)
        
        xmin, xmax, ymin, ymax = get_data_bounds(req.points)
        xx, yy = np.meshgrid(np.linspace(xmin, xmax, 100), np.linspace(ymin, ymax, 100))
        Z = knn.predict_mesh(xx, yy)
        return {
            "xx": xx.tolist(),
            "yy": yy.tolist(),
            "Z": Z.tolist()
        }

    elif algo == "svm":
        svm = SVMModel()
        svm_params = req.params
        C = float(svm_params.get("C", 1.0))
        kernel = str(svm_params.get("kernel", "rbf"))
        gamma = svm_params.get("gamma", "scale")
        if isinstance(gamma, str) and gamma not in ["scale", "auto"]:
            gamma = float(gamma)
        svm.train(points_dict, C, kernel, gamma)
        
        xmin, xmax, ymin, ymax = get_data_bounds(req.points)
        xx, yy = np.meshgrid(np.linspace(xmin, xmax, 100), np.linspace(ymin, ymax, 100))
        Z = svm.predict_mesh(xx, yy)
        Z_dec = svm.predict_decision_function(xx, yy)
        return {
            "xx": xx.tolist(),
            "yy": yy.tolist(),
            "Z": Z.tolist(),
            "Z_dec": Z_dec.tolist()
        }

    else:
        raise HTTPException(status_code=400, detail=f"Algorithm '{req.algorithm}' not supported.")

# Extra endpoint for KNN neighbor highlights
class NeighborRequest(BaseModel):
    query: Point
    points: List[Point]
    k: int
    metric: str

@app.post("/knn-neighbors")
def knn_neighbors(req: NeighborRequest):
    if not req.points:
        return {"neighbors": []}
    
    knn = KNNModel()
    points_dict = [{"x": p.x, "y": p.y, "label": p.label} for p in req.points]
    knn.train(points_dict, req.k, req.metric)
    
    neighbors = knn.get_neighbors({"x": req.query.x, "y": req.query.y})
    return {"neighbors": neighbors}

if __name__ == "__main__":
    import uvicorn
    import os
    # Read port from environment variable (default to 8000 locally)
    port = int(os.environ.get("PORT", 8000))
    # Bind to 0.0.0.0 on Railway/production, 127.0.0.1 locally
    host = "0.0.0.0" if os.environ.get("PORT") else "127.0.0.1"
    
    uvicorn.run("main:app", host=host, port=port, reload=True)
