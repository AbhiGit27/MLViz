import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Dashboard from '../components/Dashboard';
import ModelExplanation from '../components/ModelExplanation';
import ParameterPanel from '../components/ParameterPanel';
import DataCanvas from '../components/DataCanvas';
import Visualization from '../components/Visualization';
import { trainModel, getDecisionBoundary } from '../api/client';
import { Info } from 'lucide-react';

const INITIAL_PARAMETERS = {
  linear_regression: { learning_rate: 0.1, iterations: 100 },
  decision_tree: { max_depth: 5, criterion: 'gini' },
  knn: { k: 5, metric: 'euclidean' },
  svm: { C: 1.0, kernel: 'rbf', gamma: 'scale' }
};

export default function Home() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [points, setPoints] = useState([]);
  const [parameters, setParameters] = useState(INITIAL_PARAMETERS);
  const [currentClass, setCurrentClass] = useState(0);
  
  // Model output states
  const [boundaryInfo, setBoundaryInfo] = useState(null);
  const [lineInfo, setLineInfo] = useState(null);
  const [costHistory, setCostHistory] = useState([]);
  const [svmMetadata, setSvmMetadata] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dtMetadata, setDtMetadata] = useState(null);

  // Clear states
  const handleClear = () => {
    setPoints([]);
    setBoundaryInfo(null);
    setLineInfo(null);
    setCostHistory([]);
    setSvmMetadata(null);
    setDtMetadata(null);
  };

  // Switch page or algorithm
  const handlePageChange = (pageId) => {
    setCurrentPage(pageId);
    handleClear();
  };

  // Instant boundaries updates for KNN when parameters change
  useEffect(() => {
    if (points.length === 0 || currentPage === 'dashboard') return;
    
    const updateInstantBoundary = async () => {
      if (currentPage === 'knn') {
        try {
          const res = await getDecisionBoundary(currentPage, points, parameters[currentPage]);
          setBoundaryInfo(res);
        } catch (err) {
          console.error("Failed to fetch decision boundary:", err);
        }
      }
    };

    updateInstantBoundary();
  }, [parameters, currentPage, points]);

  // Train action
  const handleTrain = async () => {
    if (points.length === 0 || currentPage === 'dashboard') return;
    setIsLoading(true);

    try {
      const activeParams = parameters[currentPage];
      const data = await trainModel(currentPage, points, activeParams);
      
      const { history, cost_history, line_info, boundary_info, metadata } = data;
      
      if (currentPage === 'linear_regression' && history && history.length > 0) {
        let step = 0;
        setCostHistory([]);
        
        const xs = points.map(p => p.x);
        const xmin = Math.min(...xs);
        const xmax = Math.max(...xs);
        const x_span = xmax - xmin || 1.0;
        const x_line = Array.from({ length: 100 }, (_, i) => xmin + (i / 99) * x_span);

        const interval = setInterval(() => {
          if (step >= history.length) {
            clearInterval(interval);
            setLineInfo(line_info);
            setCostHistory(cost_history);
            setIsLoading(false);
            return;
          }
          
          const { w, b } = history[step];
          const y_line = x_line.map(x => w * x + b);
          setLineInfo({ x: x_line, y: y_line });
          setCostHistory(cost_history.slice(0, history[step].iteration + 1));
          step++;
        }, 60);
      } else {
        // Classification (DT, SVM, KNN)
        let step = 0;
        setCostHistory([]);
        setBoundaryInfo(null);
        setSvmMetadata(null);
        setDtMetadata(null);

        const interval = setInterval(() => {
          if (step >= cost_history.length) {
            clearInterval(interval);
            setBoundaryInfo(boundary_info);
            
            if (currentPage === 'svm' && metadata) {
              setSvmMetadata(metadata);
            }
            if (currentPage === 'decision_tree' && metadata) {
              setDtMetadata(metadata);
            }
            
            setIsLoading(false);
            return;
          }
          
          setCostHistory(cost_history.slice(0, step + 1));
          step++;
        }, 60);
      }
    } catch (err) {
      console.error("Training failed:", err);
      setIsLoading(false);
    }
  };

  const hasPoints = points.length > 0;

  return (
    <Layout currentPage={currentPage} setCurrentPage={handlePageChange}>
      {currentPage === 'dashboard' ? (
        <Dashboard onSelect={handlePageChange} />
      ) : (
        <div className="flex flex-col gap-6 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left Workspace columns (Canvas + explanation card + formula box) */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <DataCanvas
                points={points}
                onAddPoint={(x, y) => {
                  if (points.length >= 500) return;
                  const label = currentPage === 'linear_regression' ? null : currentClass;
                  setPoints([...points, { x, y, label }]);
                }}
                currentAlgo={currentPage}
                boundaryInfo={boundaryInfo}
                lineInfo={lineInfo}
                svmMetadata={svmMetadata}
                isLoading={isLoading}
              />
              
              {/* Instructions Panel */}
              <div className="bg-blue-50 border border-blue-100 rounded-3xl p-5 flex gap-3 shadow-sm">
                <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div className="text-xs text-blue-900 flex flex-col gap-1.5">
                  <span className="font-bold text-sm">Workspace Instructions:</span>
                  <p>
                    {currentPage === 'linear_regression'
                      ? 'Click anywhere on the canvas above to place coordinate scatter points. Tune the Learning Rate and Iterations on the right, then click "Train Visualizer" to watch gradient descent fit the line.'
                      : 'Choose Class 0 (Blue) or Class 1 (Red) from the panel, click on the canvas to add labeled points, configure the model params, and click "Train Visualizer" to compute boundary splits.'}
                  </p>
                  {dtMetadata && (
                    <div className="mt-2 pt-2 border-t border-blue-200/50">
                      <span className="font-bold">Tree splits:</span> Depth of {dtMetadata.depth} with {dtMetadata.n_leaves} leaf partitions.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Panel: Settings controls and loss curves */}
            <div className="flex flex-col gap-6">
              <ParameterPanel
                currentAlgo={currentPage}
                parameters={parameters}
                setParameters={setParameters}
                onTrain={handleTrain}
                onClear={handleClear}
                isLoading={isLoading}
                currentClass={currentClass}
                setCurrentClass={setCurrentClass}
                hasPoints={hasPoints}
              />

              <Visualization
                costHistory={costHistory}
                currentAlgo={currentPage}
              />
            </div>
          </div>

          {/* Dedicated Model Math Explanation block at the bottom */}
          <ModelExplanation algorithm={currentPage} />
        </div>
      )}
    </Layout>
  );
}
