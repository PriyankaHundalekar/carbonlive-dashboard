import React from 'react';
import './MetricsPanel.css';

function MetricsPanel({ metrics, isConnected }) {
  const getEfficiencyColor = (score) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#eab308';
    return '#ef4444';
  };

  const formatNumber = (num) => {
    return typeof num === 'number' ? num.toFixed(1) : num;
  };

  return (
    <div className="metrics-panel">
      <div className="panel-header">
        <h3>🔋 Live Energy Metrics</h3>
        <div className={`live-indicator ${isConnected ? 'active' : ''}`}>
          <span className="pulse"></span>
          LIVE
        </div>
      </div>
      
      <div className="metrics-grid">
        <div className="metric-card primary">
          <div className="metric-icon">⚡</div>
          <div className="metric-content">
            <h4>Total Consumption</h4>
            <div className="metric-value">{formatNumber(metrics.total_consumption)} <span>kWh</span></div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">🌍</div>
          <div className="metric-content">
            <h4>Carbon Emissions</h4>
            <div className="metric-value">{metrics.carbon_emissions} <span>kg CO₂</span></div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <h4>Hourly Cost</h4>
            <div className="metric-value">${metrics.cost_per_hour}</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">📊</div>
          <div className="metric-content">
            <h4>Efficiency Score</h4>
            <div className="metric-value" style={{ color: getEfficiencyColor(metrics.efficiency_score) }}>
              {formatNumber(metrics.efficiency_score)}%
            </div>
          </div>
        </div>
      </div>
      
      <div className="carbon-comparison">
        <h4>🌍 Carbon Impact</h4>
        <div className="comparison-grid">
          <div className="comparison-item">
            <span className="comparison-label">Equivalent to:</span>
            <span className="comparison-value">{(metrics.carbon_emissions / 4.6).toFixed(1)} cars driven for 1 hour</span>
          </div>
          <div className="comparison-item">
            <span className="comparison-label">Tree offset needed:</span>
            <span className="comparison-value">{(metrics.carbon_emissions / 21.8).toFixed(1)} trees planted</span>
          </div>
        </div>
      </div>

      <div className="breakdown-section">
        <h4>Energy Breakdown</h4>
        <div className="breakdown-grid">
          <div className="breakdown-item">
            <span className="breakdown-label">🏠 Electricity</span>
            <span className="breakdown-value">{formatNumber(metrics.electricity)} kWh</span>
          </div>
          <div className="breakdown-item">
            <span className="breakdown-label">🔥 Heating</span>
            <span className="breakdown-value">{formatNumber(metrics.heating)} kWh</span>
          </div>
          <div className="breakdown-item">
            <span className="breakdown-label">❄️ Cooling</span>
            <span className="breakdown-value">{formatNumber(metrics.cooling)} kWh</span>
          </div>
          <div className="breakdown-item">
            <span className="breakdown-label">🖥️ Equipment</span>
            <span className="breakdown-value">{formatNumber(metrics.equipment)} kWh</span>
          </div>
          <div className="breakdown-item">
            <span className="breakdown-label">💡 Lighting</span>
            <span className="breakdown-value">{formatNumber(metrics.lighting)} kWh</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MetricsPanel;