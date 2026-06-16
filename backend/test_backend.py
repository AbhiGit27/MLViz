import sys
from pydantic import ValidationError

# Import the backend app components
from app import train_model, decision_boundary, TrainRequest, Point

def test_health():
    from app import health
    res = health()
    assert res == {"status": "ok"}
    print("Health check endpoint: PASS")

def test_linear_regression():
    # 2D points for linear regression
    points = [
        Point(x=1.0, y=2.0),
        Point(x=2.0, y=4.1),
        Point(x=3.0, y=5.9),
        Point(x=4.0, y=8.0)
    ]
    req = TrainRequest(
        algorithm="linear_regression",
        points=points,
        params={"learning_rate": 0.1, "iterations": 50}
    )
    res = train_model(req)
    assert "history" in res
    assert "cost_history" in res
    assert "line_info" in res
    assert len(res["cost_history"]) == 51
    assert "w" in res["metadata"]
    print("Linear Regression training: PASS")

def test_decision_tree():
    # Classification points
    points = [
        Point(x=1.0, y=1.0, label=0),
        Point(x=1.5, y=1.5, label=0),
        Point(x=5.0, y=5.0, label=1),
        Point(x=5.5, y=5.5, label=1)
    ]
    req = TrainRequest(
        algorithm="decision_tree",
        points=points,
        params={"max_depth": 3, "criterion": "gini"}
    )
    res = train_model(req)
    assert "history" in res
    assert "cost_history" in res
    assert "boundary_info" in res
    assert "xx" in res["boundary_info"]
    assert "yy" in res["boundary_info"]
    assert "Z" in res["boundary_info"]
    print("Decision Tree training: PASS")

def test_knn():
    points = [
        Point(x=1.0, y=1.0, label=0),
        Point(x=1.5, y=1.5, label=0),
        Point(x=5.0, y=5.0, label=1),
        Point(x=5.5, y=5.5, label=1)
    ]
    req = TrainRequest(
        algorithm="knn",
        points=points,
        params={"k": 2, "metric": "euclidean"}
    )
    res = train_model(req)
    assert "history" in res
    assert "boundary_info" in res
    print("KNN training & boundary: PASS")

def test_svm():
    points = [
        Point(x=1.0, y=1.0, label=0),
        Point(x=1.5, y=1.5, label=0),
        Point(x=5.0, y=5.0, label=1),
        Point(x=5.5, y=5.5, label=1)
    ]
    req = TrainRequest(
        algorithm="svm",
        points=points,
        params={"C": 1.0, "kernel": "rbf", "gamma": "scale"}
    )
    res = train_model(req)
    assert "history" in res
    assert "boundary_info" in res
    assert "Z_dec" in res["boundary_info"]
    assert "support_vectors" in res["metadata"]
    print("SVM training & support vectors: PASS")

if __name__ == "__main__":
    try:
        test_health()
        test_linear_regression()
        test_decision_tree()
        test_knn()
        test_svm()
        print("\nALL BACKEND TESTS PASSED SUCCESSFULLY!")
    except Exception as e:
        print(f"\nTEST RUN FAILED: {e}")
        sys.exit(1)
