import React from 'react';
import Plotly from 'plotly.js-dist-min';
import createPlotlyComponent from 'react-plotly.js/factory';
const Plot = (createPlotlyComponent.default || createPlotlyComponent)(Plotly);
import { TrendingDown } from 'lucide-react';

export default function Visualization({ costHistory, currentAlgo }) {
  const isKnn = currentAlgo === 'knn';

  // Determine X axis label and title based on algorithm
  const xTitle = {
    linear_regression: 'Iterations',
    decision_tree: 'Tree Depth',
    knn: 'Complexity',
    svm: 'Training Snapshots'
  }[currentAlgo] || 'Training Progress';

  const yTitle = {
    linear_regression: 'MSE Cost',
    decision_tree: 'Classification Error (1 - Acc)',
    knn: 'Error',
    svm: 'Hinge Loss Proxy'
  }[currentAlgo] || 'Loss';

  // Generate X axis indices (1-based or iteration keys)
  const xData = costHistory.map((_, idx) => {
    if (currentAlgo === 'decision_tree') return idx + 1; // depths start at 1
    if (currentAlgo === 'linear_regression') return idx; // iteration count
    if (currentAlgo === 'svm') {
      const svmIters = [1, 2, 5, 10, 15, 20, 30, 40, 50, 75, 100];
      return svmIters[idx] || idx;
    }
    return idx;
  });

  const trace = {
    x: xData,
    y: costHistory,
    type: 'scatter',
    mode: isKnn ? 'markers' : 'lines+markers',
    marker: { color: '#3B82F6', size: 6 },
    line: { color: '#3B82F6', width: 2 },
  };

  const layout = {
    autosize: true,
    margin: { l: 45, r: 15, t: 10, b: 35 },
    xaxis: {
      title: { text: xTitle, font: { size: 10, color: '#9ca3af' } },
      gridcolor: '#f3f4f6',
      zeroline: false,
    },
    yaxis: {
      title: { text: yTitle, font: { size: 10, color: '#9ca3af' } },
      gridcolor: '#f3f4f6',
      zeroline: false,
    },
    plot_bgcolor: '#ffffff',
    paper_bgcolor: '#ffffff',
    showlegend: false,
    height: 180,
  };

  const currentLoss = costHistory.length > 0 ? costHistory[costHistory.length - 1].toFixed(4) : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-gray-50 pb-2">
        <div className="flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-blue-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Learning Curve</h3>
        </div>
        {currentLoss !== null && (
          <span className="text-[10px] font-semibold font-mono text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
            Current loss: <span className="font-bold text-blue-600">{currentLoss}</span>
          </span>
        )}
      </div>

      <div className="relative w-full h-[180px]">
        {costHistory.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            <span className="text-xs text-gray-400">No training history yet.</span>
            <span className="text-[10px] text-gray-300">Click Train Visualizer above to generate values.</span>
          </div>
        ) : (
          <Plot
            data={[trace]}
            layout={layout}
            config={{ displayModeBar: false, responsive: true }}
            style={{ width: '100%', height: '100%' }}
            className="w-full h-full"
          />
        )}
      </div>
    </div>
  );
}
