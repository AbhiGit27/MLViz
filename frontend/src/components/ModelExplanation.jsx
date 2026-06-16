import React from 'react';
import { BookOpen, HelpCircle } from 'lucide-react';

export default function ModelExplanation({ algorithm }) {
  const content = {
    linear_regression: {
      title: 'Linear Regression Mechanics',
      tagline: 'Fitting continuous values using iterative Gradient Descent',
      desc: 'Linear Regression models the relationship between a dependent variable y and independent variable x by fitting a linear equation. We optimize weights (w) and bias (b) using gradient descent to find the parameters that minimize the overall Mean Squared Error (MSE).',
      maths: [
        { label: 'Hypothesis Function', formula: 'h(x) = w * x + b' },
        { label: 'Cost Function (MSE)', formula: 'J(w, b) = 1/(2n) * sum((h(x_i) - y_i)^2)' },
        { label: 'Weight Gradient Update', formula: 'w = w - alpha * (2/n) * sum(x_i * (y_pred - y_i))' },
        { label: 'Bias Gradient Update', formula: 'b = b - alpha * (2/n) * sum(y_pred - y_i)' }
      ]
    },
    decision_tree: {
      title: 'Decision Tree Mechanics',
      tagline: 'Axis-aligned recursive spatial partition splits',
      desc: 'Decision Trees split the feature space into orthogonal blocks. At each node, the model scans every coordinate value to find the partition that maximizes Information Gain (i.e., reduces Gini Impurity or Entropy maximumly).',
      maths: [
        { label: 'Gini Impurity Metric', formula: 'I_G(t) = 1 - sum(p_i^2)' },
        { label: 'Entropy (Information)', formula: 'H(t) = - sum(p_i * log2(p_i))' },
        { label: 'Information Gain', formula: 'Gain(Split) = Impurity(Parent) - sum(Weights * Impurity(Child))' }
      ]
    },
    knn: {
      title: 'K-Nearest Neighbors Mechanics',
      tagline: 'Instance-based classification via feature space distance',
      desc: 'KNN is a non-parametric, lazy learner. It stores all training coordinates. During inference on a coordinate query, it calculates distance vectors to all data points, extracts the k closest instances, and assigns the class with the majority vote.',
      maths: [
        { label: 'Euclidean Distance (L2)', formula: 'd(u, v) = sqrt((u_x - v_x)^2 + (u_y - v_y)^2)' },
        { label: 'Manhattan Distance (L1)', formula: 'd(u, v) = |u_x - v_x| + |u_y - v_y|' },
        { label: 'Prediction Rule', formula: 'y_query = mode(y_1, y_2, ..., y_k)' }
      ]
    },
    svm: {
      title: 'Support Vector Machine Mechanics',
      tagline: 'Separating boundary margin maximization',
      desc: 'SVM finds the optimal separating hyperplane that maximizes the geometric distance (margin) between the boundary and nearest training coordinates (support vectors). Using kernels, it implicitly maps 2D inputs to high dimensions to build circular or non-linear decision boundaries.',
      maths: [
        { label: 'Primal Constraint Rule', formula: 'y_i * (w * Phi(x_i) + b) >= 1 - xi_i' },
        { label: 'Objective Cost Min', formula: 'Min: 1/2 * ||w||^2 + C * sum(xi_i)' },
        { label: 'RBF Kernel Function', formula: 'K(u, v) = exp(-gamma * ||u - v||^2)' }
      ]
    }
  }[algorithm];

  if (!content) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col gap-5 mt-6">
      <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
        <BookOpen className="w-5 h-5 text-blue-600" />
        <div>
          <h4 className="text-md font-bold text-gray-950">{content.title}</h4>
          <p className="text-xs text-gray-400 font-semibold">{content.tagline}</p>
        </div>
      </div>

      <p className="text-xs text-gray-600 leading-relaxed">{content.desc}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        {content.maths.map((math, idx) => (
          <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{math.label}</span>
            <code className="text-blue-600 font-mono text-xs font-semibold select-all p-1 bg-white rounded border border-gray-100/50 block overflow-x-auto whitespace-nowrap">
              {math.formula}
            </code>
          </div>
        ))}
      </div>
    </div>
  );
}
