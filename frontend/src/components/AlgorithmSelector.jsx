import React from 'react';
import { LineChart, Binary, Users, ShieldAlert } from 'lucide-react';

const ALGORITHMS = [
  { id: 'linear_regression', name: 'Linear Regression', icon: LineChart, desc: 'Fitted line + cost history curve' },
  { id: 'decision_tree', name: 'Decision Trees', icon: Binary, desc: 'Decision boundary + splits classification' },
  { id: 'knn', name: 'K-Nearest Neighbors', icon: Users, desc: 'Instant boundary + neighbors highlight' },
  { id: 'svm', name: 'Support Vector Machine', icon: ShieldAlert, desc: 'Boundary margin + support vectors' }
];

export default function AlgorithmSelector({ currentAlgo, onChange }) {
  return (
    <div className="bg-white border-t border-gray-200 px-6 py-4 flex flex-wrap gap-4 items-center justify-between shadow-sm">
      <div className="flex flex-wrap gap-2">
        {ALGORITHMS.map((algo) => {
          const IconComponent = algo.icon;
          const isActive = currentAlgo === algo.id;
          return (
            <button
              key={algo.id}
              onClick={() => onChange(algo.id)}
              className={`flex items-center gap-3 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-105'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900 border border-gray-100'
              }`}
            >
              <IconComponent className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
              <span>{algo.name}</span>
            </button>
          );
        })}
      </div>
      <div className="text-xs text-gray-500 hidden md:block">
        Selected: <span className="font-semibold text-gray-700 font-mono">
          {ALGORITHMS.find(a => a.id === currentAlgo)?.desc}
        </span>
      </div>
    </div>
  );
}
