import React, { useRef } from 'react';
import Plotly from 'plotly.js-dist-min';
import createPlotlyComponent from 'react-plotly.js/factory';
const Plot = (createPlotlyComponent.default || createPlotlyComponent)(Plotly);

export default function DataCanvas({
  points,
  onAddPoint,
  currentAlgo,
  boundaryInfo,
  lineInfo,
  svmMetadata,
  isLoading
}) {
  const containerRef = useRef(null);

  // Layout settings
  const layout = {
    autosize: true,
    margin: { l: 40, r: 20, t: 20, b: 40 },
    xaxis: { range: [0, 10], fixedrange: true, gridcolor: '#f3f4f6', zeroline: false },
    yaxis: { range: [0, 10], fixedrange: true, gridcolor: '#f3f4f6', zeroline: false },
    showlegend: false,
    hovermode: 'closest',
    plot_bgcolor: '#ffffff',
    paper_bgcolor: '#ffffff',
  };

  const handleCanvasClick = (e) => {
    if (!containerRef.current) return;
    
    // Ignore clicks on Plotly toolbar/modebar
    if (e.target.closest('.modebar-container')) return;

    const rect = containerRef.current.getBoundingClientRect();
    const marginL = 40;
    const marginR = 20;
    const marginT = 20;
    const marginB = 40;
    
    const plotWidth = rect.width - marginL - marginR;
    const plotHeight = rect.height - marginT - marginB;
    
    const clickX = e.clientX - rect.left - marginL;
    const clickY = e.clientY - rect.top - marginT;

    // Verify click is inside actual plotting area
    if (clickX >= 0 && clickX <= plotWidth && clickY >= 0 && clickY <= plotHeight) {
      const x = (clickX / plotWidth) * 10;
      const y = (1 - (clickY / plotHeight)) * 10;
      onAddPoint(x, y);
    }
  };

  const data = [];

  // 1. Add classification decision boundary contour if present
  if (currentAlgo !== 'linear_regression' && boundaryInfo && boundaryInfo.xx) {
    const { xx, yy, Z, Z_dec } = boundaryInfo;
    
    // Z is a grid of 0 or 1.
    // Z_dec is SVM distance to margin.
    
    // Convert 2D meshes to flat/structured arrays that Plotly expects for contour
    // Plotly contour expects x as 1D array of size N, y as 1D array of size M, Z as 2D array of size MxN
    const x_coords = xx[0];
    const y_coords = yy.map(row => row[0]);

    data.push({
      x: x_coords,
      y: y_coords,
      z: Z,
      type: 'contour',
      showscale: false,
      opacity: 0.25,
      contours: {
        coloring: 'heatmap',
        showlines: false,
      },
      colorscale: [
        [0, '#3B82F6'], // Class 0 Blue
        [1, '#EF4444']  // Class 1 Red
      ],
      hoverinfo: 'skip'
    });

    // If SVM and decision values (Z_dec) exist, overlay margin level curves (-1, 0, 1)
    if (currentAlgo === 'svm' && Z_dec) {
      data.push({
        x: x_coords,
        y: y_coords,
        z: Z_dec,
        type: 'contour',
        showscale: false,
        contours: {
          coloring: 'none',
          showlines: true,
          start: -1,
          end: 1,
          size: 1,
        },
        line: {
          color: '#4b5563',
          width: 1.5,
          dash: 'dash'
        },
        hoverinfo: 'skip'
      });
    }
  }

  // 2. Add linear regression fitted line if present
  if (currentAlgo === 'linear_regression' && lineInfo && lineInfo.x) {
    data.push({
      x: lineInfo.x,
      y: lineInfo.y,
      mode: 'lines',
      type: 'scatter',
      line: {
        color: '#2563eb',
        width: 3,
      },
      name: 'Regression Line',
      hoverinfo: 'y'
    });
  }

  // 3. Highlight Support Vectors if SVM metadata exists
  if (currentAlgo === 'svm' && svmMetadata && svmMetadata.support_vectors) {
    const svIndices = svmMetadata.support_vectors;
    const svPoints = points.filter((_, idx) => svIndices.includes(idx));
    
    if (svPoints.length > 0) {
      data.push({
        x: svPoints.map(p => p.x),
        y: svPoints.map(p => p.y),
        mode: 'markers',
        type: 'scatter',
        marker: {
          size: 16,
          color: 'rgba(0,0,0,0)',
          line: {
            color: '#1f2937',
            width: 2,
          }
        },
        name: 'Support Vectors',
        hoverinfo: 'skip'
      });
    }
  }

  // 4. Add data points
  if (points.length > 0) {
    if (currentAlgo === 'linear_regression') {
      // Regression: Single class points (blue color)
      data.push({
        x: points.map(p => p.x),
        y: points.map(p => p.y),
        mode: 'markers',
        type: 'scatter',
        marker: {
          size: 10,
          color: '#3B82F6',
          line: {
            color: '#1e3a8a',
            width: 1
          }
        },
        name: 'Data Points',
        hoverinfo: 'x+y'
      });
    } else {
      // Classification: Split points by class
      const class0 = points.filter(p => p.label === 0);
      const class1 = points.filter(p => p.label === 1);

      if (class0.length > 0) {
        data.push({
          x: class0.map(p => p.x),
          y: class0.map(p => p.y),
          mode: 'markers',
          type: 'scatter',
          marker: {
            size: 10,
            color: '#3B82F6',
            line: {
              color: '#1e3a8a',
              width: 1
            }
          },
          name: 'Class 0',
          hoverinfo: 'x+y'
        });
      }

      if (class1.length > 0) {
        data.push({
          x: class1.map(p => p.x),
          y: class1.map(p => p.y),
          mode: 'markers',
          type: 'scatter',
          marker: {
            size: 10,
            color: '#EF4444',
            line: {
              color: '#7f1d1d',
              width: 1
            }
          },
          name: 'Class 1',
          hoverinfo: 'x+y'
        });
      }
    }
  }

  return (
    <div
      ref={containerRef}
      onClick={handleCanvasClick}
      className="relative flex-1 min-h-[400px] bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden cursor-crosshair"
    >
      <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
          Interactive Canvas (Click to Add Points)
        </span>
      </div>
      {isLoading && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-20 flex flex-col items-center justify-center gap-3 transition-all duration-300">
          <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin shadow-md shadow-blue-500/10" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-50/80 px-3 py-1 rounded-full border border-blue-100/30 shadow-sm animate-pulse">
            Optimizing Model...
          </span>
        </div>
      )}
      <Plot
        data={data}
        layout={layout}
        config={{ displayModeBar: false, responsive: true }}
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
