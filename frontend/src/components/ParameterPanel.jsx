import React from 'react';
import { Play, Trash2, Shield, Settings } from 'lucide-react';

export default function ParameterPanel({
  currentAlgo,
  parameters,
  setParameters,
  onTrain,
  onClear,
  isLoading,
  currentClass,
  setCurrentClass,
  hasPoints
}) {
  const handleParamChange = (key, val) => {
    setParameters(prev => ({
      ...prev,
      [currentAlgo]: {
        ...prev[currentAlgo],
        [key]: val
      }
    }));
  };

  const algoParams = parameters[currentAlgo] || {};

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col gap-6">
      {/* Parameter Title */}
      <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
        <Settings className="w-5 h-5 text-blue-500" />
        <h2 className="text-md font-bold text-gray-900">Algorithm Control</h2>
      </div>

      {/* Class Selector Toggle (Only show for classification algos) */}
      {currentAlgo !== 'linear_regression' && (
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Placement Class Color
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setCurrentClass(0)}
              className={`py-2.5 px-4 rounded-xl font-semibold text-xs border transition-all ${
                currentClass === 0
                  ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-500/20 shadow-sm'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Class 0 (Blue)
            </button>
            <button
              onClick={() => setCurrentClass(1)}
              className={`py-2.5 px-4 rounded-xl font-semibold text-xs border transition-all ${
                currentClass === 1
                  ? 'bg-red-50 border-red-500 text-red-700 ring-2 ring-red-500/20 shadow-sm'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Class 1 (Red)
            </button>
          </div>
        </div>
      )}

      {/* Dynamic Sliders and Dropdowns */}
      <div className="flex flex-col gap-4 flex-1">
        {currentAlgo === 'linear_regression' && (
          <>
            {/* Learning Rate */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-gray-700">Learning Rate (Alpha)</span>
                <span className="font-mono text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-bold">
                  {algoParams.learning_rate}
                </span>
              </div>
              <input
                type="range"
                min="0.001"
                max="1.0"
                step="0.001"
                value={algoParams.learning_rate || 0.01}
                onChange={(e) => handleParamChange('learning_rate', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                <span>0.001 (Slow)</span>
                <span>1.0 (Fast)</span>
              </div>
            </div>

            {/* Iterations */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-gray-700">Iterations (Epochs)</span>
                <span className="font-mono text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-bold">
                  {algoParams.iterations}
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={algoParams.iterations || 100}
                onChange={(e) => handleParamChange('iterations', parseInt(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                <span>10</span>
                <span>500 (Thorough)</span>
              </div>
            </div>
          </>
        )}

        {currentAlgo === 'decision_tree' && (
          <>
            {/* Max Depth */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-gray-700">Max Depth</span>
                <span className="font-mono text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-bold">
                  {algoParams.max_depth}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                step="1"
                value={algoParams.max_depth || 5}
                onChange={(e) => handleParamChange('max_depth', parseInt(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                <span>1 (Stump)</span>
                <span>15 (Complex)</span>
              </div>
            </div>

            {/* Split Criterion */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Split Criterion</label>
              <select
                value={algoParams.criterion || 'gini'}
                onChange={(e) => handleParamChange('criterion', e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              >
                <option value="gini">Gini Impurity</option>
                <option value="entropy">Entropy (Information Gain)</option>
              </select>
            </div>
          </>
        )}

        {currentAlgo === 'knn' && (
          <>
            {/* Number of Neighbors (K) */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-gray-700">Number of Neighbors (k)</span>
                <span className="font-mono text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-bold">
                  {algoParams.k}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={algoParams.k || 5}
                onChange={(e) => handleParamChange('k', parseInt(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                <span>1 neighbor</span>
                <span>20 neighbors</span>
              </div>
            </div>

            {/* Metric */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Distance Metric</label>
              <select
                value={algoParams.metric || 'euclidean'}
                onChange={(e) => handleParamChange('metric', e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              >
                <option value="euclidean">Euclidean (L2 distance)</option>
                <option value="manhattan">Manhattan (L1 distance)</option>
              </select>
            </div>
          </>
        )}

        {currentAlgo === 'svm' && (
          <>
            {/* Regularization C */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-gray-700">Regularization (C)</span>
                <span className="font-mono text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-bold">
                  {algoParams.C}
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="100"
                step="0.1"
                value={algoParams.C || 1.0}
                onChange={(e) => handleParamChange('C', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                <span>0.1 (Soft margin)</span>
                <span>100.0 (Hard margin)</span>
              </div>
            </div>

            {/* Kernel */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Kernel Type</label>
              <select
                value={algoParams.kernel || 'rbf'}
                onChange={(e) => handleParamChange('kernel', e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              >
                <option value="rbf">RBF (Radial Basis Function)</option>
                <option value="linear">Linear</option>
              </select>
            </div>

            {/* Gamma (Only for RBF Kernel) */}
            {algoParams.kernel === 'rbf' && (
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-gray-700">Gamma (Spread)</span>
                  <span className="font-mono text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-bold">
                    {algoParams.gamma}
                  </span>
                </div>
                <select
                  value={['scale', 'auto'].includes(algoParams.gamma) ? algoParams.gamma : 'custom'}
                  onChange={(e) => {
                    const val = e.target.value;
                    handleParamChange('gamma', val === 'custom' ? 0.5 : val);
                  }}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all mb-2"
                >
                  <option value="scale">Scale (Default)</option>
                  <option value="auto">Auto</option>
                  <option value="custom">Custom Value Slider</option>
                </select>
                
                {!['scale', 'auto'].includes(algoParams.gamma) && (
                  <>
                    <input
                      type="range"
                      min="0.001"
                      max="10.0"
                      step="0.001"
                      value={typeof algoParams.gamma === 'number' ? algoParams.gamma : 0.5}
                      onChange={(e) => handleParamChange('gamma', parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                      <span>0.001 (Wide influence)</span>
                      <span>10.0 (Local influence)</span>
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Primary Actions */}
      <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
        <button
          onClick={onTrain}
          disabled={isLoading || !hasPoints}
          className={`flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-sm font-bold text-white transition-all shadow-md ${
            isLoading || !hasPoints
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
              : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20 active:ring-2 active:ring-blue-500/20 hover:scale-[1.02]'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Training Model...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>Train Visualizer</span>
            </>
          )}
        </button>

        <button
          onClick={onClear}
          disabled={!hasPoints}
          className={`flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-sm font-semibold border transition-all ${
            !hasPoints
              ? 'border-gray-100 text-gray-300 cursor-not-allowed'
              : 'border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700'
          }`}
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear Canvas</span>
        </button>
      </div>
    </div>
  );
}
