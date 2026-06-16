# MLViz - Interactive Machine Learning Visualization Platform
MLViz is a real-time, interactive web platform built from scratch to visualize the training dynamics and decision boundaries of machine learning algorithms on 2D datasets. Users can place coordinates directly on a Plotly canvas, adjust hyperparameters via sliders, watch the models optimize in real-time, and study the underlying mathematical foundations.
---
> [!NOTE]
> This platform runs completely locally and utilizes a FastAPI backend running lightweight `scikit-learn` and custom `NumPy` models alongside a modern React + Tailwind CSS + Plotly frontend.
---
## 🚀 Key Features
*   **Interactive 2D Canvas**: Click anywhere on the grid to add data coordinates. Supports continuous regression points and color-coded classification coordinates (Class 0: Blue, Class 1: Red).
*   **4 Core ML Visualizers**:
    1.  **Linear Regression**: Implements custom batch gradient descent, rendering progressive weight-fitting lines and a Mean Squared Error (MSE) cost curve.
    2.  **Decision Trees**: Computes orthogonal binary split boundaries, visualizes tree depth-wise metrics, and displays Gini/Entropy partitions.
    3.  **K-Nearest Neighbors (KNN)**: Non-parametric classification highlighting instant decision surfaces and closest-neighbor lookup.
    4.  **Support Vector Machine (SVM)**: Solves margin constraints, displaying optimal separating hyperplanes, support vectors, and margin bounds.
*   **Step-by-Step Training Animations**: Simulates gradient descent updates and optimization curves progressively over 1-2 seconds.
*   **Mathematical Foundations Card**: Each workspace includes descriptions of cost optimization criteria and equations.
---
## 🛠️ Tech Stack
*   **Frontend**: React (Vite), Plotly.js (`react-plotly.js` + `plotly.js-dist-min`), Tailwind CSS, Lucide Icons, Axios.
*   **Backend**: FastAPI, Uvicorn, scikit-learn, NumPy, Pydantic.
---
## 📁 Repository Structure
```text
mlviz/
├── backend/
│   ├── app.py                       # FastAPI application & routing
│   ├── test_backend.py              # Automated backend test suite
│   ├── requirements.txt             # Backend Python dependencies
│   └── models/
│       ├── __init__.py              # Python models package init
│       ├── linear_regression.py     # Custom Gradient Descent regression model
│       ├── decision_tree.py         # Classifier tree splits solver
│       ├── knn.py                   # Classifier nearest-neighbors solver
│       └── svm.py                   # Support Vector Classifier margins solver
│
└── frontend/
    ├── index.html                   # HTML entry point (SEO title updated)
    ├── package.json                 # Node.js dependencies
    ├── tailwind.config.js           # Tailwind style tokens
    ├── postcss.config.js            # CSS transformation rules
    └── src/
        ├── App.jsx                  # React application entry
        ├── index.css                # CSS tailwind directives
        ├── main.jsx                 # Vite bootstrap script
        ├── api/
        │   └── client.js            # Axios backend API client
        ├── components/
        │   ├── Layout.jsx           # Main sidebar & navbar wrapper
        │   ├── Dashboard.jsx        # Landing page with cheatsheets
        │   ├── DataCanvas.jsx       # Interactive Plotly scatter plot & contours
        │   ├── ParameterPanel.jsx   # Hyperparameters controls panel
        │   ├── Visualization.jsx    # Learning curve line chart
        │   └── ModelExplanation.jsx # LaTeX-style math foundations panel
        └── pages/
            └── Home.jsx             # React global page & state manager
```
---
## ⚡ Setup & Installation
### Prerequisites
*   [Node.js](https://nodejs.org/) (v16+)
*   [Python](https://www.python.org/) (v3.8+)
---
### 1. Backend Setup
1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Create a virtual environment:
    ```bash
    python -m venv venv
    ```
3.  Activate the virtual environment:
    *   **Windows**:
        ```bash
        .\venv\Scripts\activate
        ```
    *   **macOS/Linux**:
        ```bash
        source venv/bin/activate
        ```
4.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
5.  Start the FastAPI server:
    ```bash
    uvicorn app:app --port 8000 --reload
    ```
    The API will be available at `http://localhost:8000`.
---
### 2. Frontend Setup
1.  Navigate to the `frontend` directory:
    ```bash
    cd ../frontend
    ```
2.  Install npm packages:
    ```bash
    npm install
    ```
3.  Start the Vite dev server:
    ```bash
    npm run dev
    ```
    Open your browser and navigate to `http://localhost:5173`.
---
> [!TIP]
> Ensure the backend server is running on port `8000` before clicking **Train Visualizer** in the frontend, as the interface makes direct HTTP calls to process boundary grid vectors.
---
## 🧪 Running Tests
A lightweight test script is included in the backend directory to verify all API routing contracts and visualizer predictions:
```bash
cd backend
.\venv\Scripts\python test_backend.py
```
Expected output:
```text
Health check endpoint: PASS
Linear Regression training: PASS
Decision Tree training: PASS
KNN training & boundary: PASS
SVM training & support vectors: PASS
ALL BACKEND TESTS PASSED SUCCESSFULLY!
```
---
> [!IMPORTANT]
> If you only place data coordinates belonging to **one single class** (e.g., all blue points) for classification models, the backend will automatically bypass scikit-learn fitting checks and safely return a solid boundary contour to prevent server crashes.
---
## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
