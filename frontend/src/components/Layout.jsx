import React from 'react';
import { LayoutDashboard, LineChart, Binary, Users, ShieldAlert, Settings, HelpCircle, Code } from 'lucide-react';

export default function Layout({ children, currentPage, setCurrentPage }) {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'linear_regression', name: 'Linear Regression', icon: LineChart },
    { id: 'decision_tree', name: 'Decision Trees', icon: Binary },
    { id: 'knn', name: 'K-Nearest Neighbors', icon: Users },
    { id: 'svm', name: 'SVM Classifier', icon: ShieldAlert },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-800 font-sans">
      {/* Sidebar - Matching ML Workspace style */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-30">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="bg-blue-600 text-white p-2 rounded-xl shadow-md shadow-blue-500/10">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold tracking-tight text-gray-900 leading-none">ML Workspace</h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-wider">Visualizer Platform</p>
          </div>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/15 scale-[1.02]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-950'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Controls */}
        <div className="p-4 border-t border-gray-100 flex flex-col gap-2 bg-gray-50/50">
          <button className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-xs font-semibold text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors">
            <HelpCircle className="w-4 h-4 text-gray-400" />
            <span>Help Center</span>
          </button>
          <button className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-xs font-semibold text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors">
            <Settings className="w-4 h-4 text-gray-400" />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col ml-64 min-h-screen">
        {/* Global Top Navbar */}
        <header className="bg-white border-b border-gray-200 h-16 px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-md font-bold text-gray-900">MLViz Workspace</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 hover:text-gray-900 px-3 py-1.5 rounded-xl border border-gray-200/60 transition-all"
            >
              <Code className="w-3.5 h-3.5" />
              <span>Github Repo</span>
            </a>
          </div>
        </header>

        {/* Dashboard or Page Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
