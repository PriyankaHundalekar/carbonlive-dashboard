import React, { useState, useEffect } from 'react';
import MetricsPanel from './MetricsPanel';
import ChartsPanel from './ChartsPanel';
import OptimizationPanel from './OptimizationPanel';
import AlertsPanel from './AlertsPanel';
import ExportPanel from './ExportPanel';
import WeatherPanel from './WeatherPanel';
import BenchmarkPanel from './BenchmarkPanel';
import MultiLocationPanel from './MultiLocationPanel';
import SettingsPanel from './SettingsPanel';
import './Dashboard.css';

function Dashboard({ metrics, suggestions, isConnected }) {
  const [alerts, setAlerts] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [settings] = useState({
    energyCostPerKwh: 0.12,
    carbonTarget: 300,
    alertThreshold: 600
  });

  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings);
    // In a real app, this would update the backend calculations
  };

  useEffect(() => {
    // Generate alerts based on metrics
    const newAlerts = [];
    
    if (metrics.total_consumption > 600) {
      newAlerts.push({
        id: Date.now(),
        type: 'warning',
        message: `High energy consumption detected: ${metrics.total_consumption} kWh`,
        timestamp: new Date().toLocaleTimeString()
      });
    }
    
    if (metrics.carbon_emissions > 300) {
      newAlerts.push({
        id: Date.now() + 1,
        type: 'critical',
        message: `Carbon emissions exceed target: ${metrics.carbon_emissions} kg CO2`,
        timestamp: new Date().toLocaleTimeString()
      });
    }
    
    if (metrics.efficiency_score < 50) {
      newAlerts.push({
        id: Date.now() + 2,
        type: 'info',
        message: `Energy efficiency below optimal: ${metrics.efficiency_score}%`,
        timestamp: new Date().toLocaleTimeString()
      });
    }
    
    setAlerts(prev => [...newAlerts, ...prev].slice(0, 10));
  }, [metrics]);

  useEffect(() => {
    // Update historical data for charts
    setHistoricalData(prev => {
      const newData = [...prev, {
        timestamp: new Date(),
        consumption: metrics.total_consumption,
        emissions: parseFloat(metrics.carbon_emissions),
        cost: parseFloat(metrics.cost_per_hour)
      }];
      return newData.slice(-50); // Keep last 50 data points
    });
  }, [metrics]);

  return (
    <div className="dashboard">
      <SettingsPanel onSettingsChange={handleSettingsChange} />
      
      <div className="dashboard-grid">
        {/* Core metrics and alerts - essential info */}
        <div className="panel-row main-metrics">
          <MetricsPanel metrics={metrics} isConnected={isConnected} />
          <AlertsPanel alerts={alerts} />
        </div>
        
        {/* Enterprise Dashboard - Multi-location overview */}
        <div className="panel-row enterprise-section">
          <MultiLocationPanel currentMetrics={metrics} />
        </div>
        
        {/* Real-Time Trends - Charts and data visualization */}
        <div className="panel-row charts-section">
          <ChartsPanel 
            historicalData={historicalData} 
            currentMetrics={metrics}
          />
        </div>
        
        {/* AI Optimization Suggestions - Smart recommendations */}
        <div className="panel-row optimization-section">
          <OptimizationPanel suggestions={suggestions} metrics={metrics} />
        </div>
        
        {/* Secondary panels - Supporting information */}
        <div className="panel-row secondary-panels">
          <WeatherPanel metrics={metrics} />
          <BenchmarkPanel metrics={metrics} />
        </div>
        
        {/* Export functionality */}
        <div className="panel-row export-section">
          <ExportPanel 
            metrics={metrics} 
            suggestions={suggestions} 
            alerts={alerts} 
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;