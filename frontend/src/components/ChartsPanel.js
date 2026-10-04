import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './ChartsPanel.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function ChartsPanel({ historicalData, currentMetrics }) {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Real-Time Energy & Carbon Tracking'
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    animation: {
      duration: 0 // Disable animation for real-time updates
    }
  };

  const chartData = {
    labels: historicalData.map(point => 
      point.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    ),
    datasets: [
      {
        label: 'Energy Consumption (kWh)',
        data: historicalData.map(point => point.consumption),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        yAxisID: 'y',
      },
      {
        label: 'Carbon Emissions (kg CO₂)',
        data: historicalData.map(point => point.emissions),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        yAxisID: 'y',
      },
    ],
  };

  return (
    <div className="charts-panel">
      <div className="panel-header">
        <h3>📈 Real-Time Trends</h3>
        <div className="chart-controls">
          <span className="data-points">Last {historicalData.length} readings</span>
        </div>
      </div>
      
      <div className="chart-container">
        {historicalData.length > 0 ? (
          <Line options={chartOptions} data={chartData} />
        ) : (
          <div className="chart-loading">
            <div className="chart-placeholder">
              📊 Collecting real-time data...
            </div>
          </div>
        )}
      </div>
      
      <div className="chart-summary">
        <div className="summary-item">
          <span className="summary-label">Current Trend</span>
          <span className="summary-value trending-up">📈 Increasing</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Avg Last Hour</span>
          <span className="summary-value">
            {historicalData.length > 0 ? 
              (historicalData.reduce((sum, point) => sum + point.consumption, 0) / historicalData.length).toFixed(1) 
              : '0'} kWh
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Peak Today</span>
          <span className="summary-value">
            {historicalData.length > 0 ? 
              Math.max(...historicalData.map(point => point.consumption)).toFixed(1) 
              : '0'} kWh
          </span>
        </div>
      </div>
    </div>
  );
}

export default ChartsPanel;