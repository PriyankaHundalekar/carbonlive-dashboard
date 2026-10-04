import React from 'react';
import './AlertsPanel.css';

function AlertsPanel({ alerts }) {
  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical': return '🚨';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📋';
    }
  };

  return (
    <div className="alerts-panel">
      <div className="panel-header">
        <h3>🔔 Real-Time Alerts</h3>
        <div className="alerts-count">
          {alerts.length} active
        </div>
      </div>
      
      <div className="alerts-container">
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <div key={alert.id} className={`alert-item ${alert.type}`}>
              <div className="alert-icon">{getAlertIcon(alert.type)}</div>
              <div className="alert-content">
                <p className="alert-message">{alert.message}</p>
                <span className="alert-timestamp">{alert.timestamp}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="no-alerts">
            <div className="no-alerts-icon">✅</div>
            <h4>All Clear</h4>
            <p>No alerts at this time. Systems running optimally.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AlertsPanel;