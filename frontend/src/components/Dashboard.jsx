import React from 'react';
import { LineChart, Binary, Users, ShieldAlert, GraduationCap } from 'lucide-react';

export default function Dashboard({ onSelect }) {
  const cards = [
    {
      id: 'linear_regression',
      name: 'Linear Regression',
      icon: LineChart,
      desc: 'Predict continuous values using gradient descent. Visualize weights convergence and Cost reduction over iterations.',
      formula: 'y = wx + b',
      badge: 'Regression'
    },
    {
      id: 'decision_tree',
      name: 'Decision Trees',
      icon: Binary,
      desc: 'Explore binary split boundaries based on impurity metrics. Fits step-by-step decision boundaries.',
      formula: 'Gini / Entropy splits',
      badge: 'Classification'
    },
    {
      id: 'knn',
      name: 'K-Nearest Neighbors',
      icon: Users,
      desc: 'Instance-based classification that queries the K closest data points. Updates instantly as parameters tweak.',
      formula: 'd = \\sqrt{\\sum(p_i-q_i)^2}',
      badge: 'Memory-Based'
    },
    {
      id: 'svm',
      name: 'Support Vector Classifier',
      icon: ShieldAlert,
      desc: 'Maximize the separating margin between points. Displays optimal boundaries, level margins, and support vectors.',
      formula: 'Optimal Margin Hyperplane',
      badge: 'Margin-Based'
    }
  ];

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      {/* Welcome Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-8 shadow-lg shadow-blue-500/10">
        <h2 className="text-3xl font-extrabold tracking-tight">Welcome to ML Workspace</h2>
        <p className="mt-2 text-blue-100 max-w-2xl text-sm font-medium">
          Play with interactive datasets, tune hyperparameters, and watch ML algorithms optimize decision surfaces in real-time.
        </p>
      </div>

      {/* Visualizer Cards Grid */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-5">Core Visualizers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-gray-300 transition-all duration-200"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div className="bg-blue-50 text-blue-600 p-3 rounded-xl border border-blue-100/50">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold tracking-wider uppercase bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full text-gray-500">
                      {card.badge}
                    </span>
                  </div>
                  
                  <h4 className="text-md font-extrabold text-gray-950 mt-4">{card.name}</h4>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">{card.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                    Math: {card.formula}
                  </span>
                  <button
                    onClick={() => onSelect(card.id)}
                    className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-all"
                  >
                    Launch Visualizer
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cheatsheet section */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap className="w-5 h-5 text-blue-600" />
          <h4 className="text-sm font-bold text-gray-900">Mathematical Cheatsheet</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
            <span className="font-bold text-gray-700 block mb-1">MSE (Regression)</span>
            <code className="text-blue-600 font-mono">1/2n * sum((y_pred - y)^2)</code>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
            <span className="font-bold text-gray-700 block mb-1">Gini Impurity</span>
            <code className="text-blue-600 font-mono">1 - sum(p_i^2)</code>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
            <span className="font-bold text-gray-700 block mb-1">L2 Distance (KNN)</span>
            <code className="text-blue-600 font-mono">sqrt(sum((p - q)^2))</code>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
            <span className="font-bold text-gray-700 block mb-1">RBF Kernel (SVM)</span>
            <code className="text-blue-600 font-mono">exp(-gamma * ||u - v||^2)</code>
          </div>
        </div>
      </div>
    </div>
  );
}
