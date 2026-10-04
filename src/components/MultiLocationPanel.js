import React, { useState, useEffect } from 'react';
import './MultiLocationPanel.css';

function MultiLocationPanel({ currentMetrics }) {
  const [locations, setLocations] = useState([
    {
      id: 1,
      name: "Headquarters - NYC",
      type: "office",
      consumption: currentMetrics?.total_consumption || 859,
      emissions: parseFloat(currentMetrics?.carbon_emissions) || 386,
      cost: parseFloat(currentMetrics?.cost_per_hour) || 103,
      efficiency: currentMetrics?.efficiency_score || 54,
      status: "active",
      alerts: 3
    },
    {
      id: 2,
      name: "Manufacturing - Detroit",
      type: "factory",
      consumption: 1240,
      emissions: 558,
      cost: 148,
      efficiency: 68,
      status: "active",
      alerts: 1
    },
    {
      id: 3,
      name: "Retail Store - LA",
      type: "retail",
      consumption: 420,
      emissions: 189,
      cost: 63,
      efficiency: 72,
      status: "active",
      alerts: 0
    },
    {
      id: 4,
      name: "Data Center - Austin",
      type: "datacenter",
      consumption: 2100,
      emissions: 945,
      cost: 252,
      efficiency: 45,
      status: "maintenance",
      alerts: 5
    }
  ]);

  const [selectedLocation, setSelectedLocation] = useState(1);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [newLocation, setNewLocation] = useState({
    name: '',
    type: 'office',
    city: ''
  });

  useEffect(() => {
    // Update HQ location with current metrics
    if (currentMetrics) {
      setLocations(prev => prev.map(loc => 
        loc.id === 1 ? {
          ...loc,
          consumption: currentMetrics.total_consumption,
          emissions: parseFloat(currentMetrics.carbon_emissions),
          cost: parseFloat(currentMetrics.cost_per_hour),
          efficiency: currentMetrics.efficiency_score
        } : loc
      ));
    }

    // Simulate other locations updating
    const interval = setInterval(() => {
      setLocations(prev => prev.map(loc => 
        loc.id !== 1 ? {
          ...loc,
          consumption: loc.consumption + (Math.random() - 0.5) * 20,
          emissions: loc.emissions + (Math.random() - 0.5) * 10,
          cost: loc.cost + (Math.random() - 0.5) * 5,
          efficiency: Math.max(30, Math.min(90, loc.efficiency + (Math.random() - 0.5) * 5))
        } : loc
      ));
    }, 10000);

    return () => clearInterval(interval);
  }, [currentMetrics]);

  const getTotalConsumption = () => {
    return locations.reduce((sum, loc) => sum + loc.consumption, 0);
  };

  const getTotalEmissions = () => {
    return locations.reduce((sum, loc) => sum + loc.emissions, 0);
  };

  const getTotalCost = () => {
    return locations.reduce((sum, loc) => sum + loc.cost, 0);
  };

  const getAverageEfficiency = () => {
    return locations.reduce((sum, loc) => sum + loc.efficiency, 0) / locations.length;
  };

  const getTotalAlerts = () => {
    return locations.reduce((sum, loc) => sum + loc.alerts, 0);
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'active': return '🟢';
      case 'warning': return '🟡';
      case 'maintenance': return '🔴';
      default: return '⚪';
    }
  };

  const getEfficiencyColor = (efficiency) => {
    if (efficiency >= 70) return '#22c55e';
    if (efficiency >= 50) return '#eab308';
    return '#ef4444';
  };

  const getLocationTypeIcon = (type) => {
    switch(type) {
      case 'office': return '🏢';
      case 'factory': return '🏭';
      case 'retail': return '🏪';
      case 'datacenter': return '🖥️';
      case 'warehouse': return '🏬';
      case 'hospital': return '🏥';
      case 'school': return '🏫';
      case 'hotel': return '🏨';
      default: return '🏢';
    }
  };

  const addNewLocation = () => {
    if (newLocation.name.trim() && newLocation.city.trim()) {
      const location = {
        id: Date.now(),
        name: `${newLocation.name} - ${newLocation.city}`,
        type: newLocation.type,
        consumption: Math.floor(Math.random() * 800) + 200,
        emissions: Math.floor(Math.random() * 400) + 100,
        cost: Math.floor(Math.random() * 120) + 40,
        efficiency: Math.floor(Math.random() * 40) + 50,
        status: "active",
        alerts: Math.floor(Math.random() * 3)
      };
      
      setLocations(prev => [...prev, location]);
      setNewLocation({ name: '', type: 'office', city: '' });
      setShowAddLocation(false);
    }
  };

  const removeLocation = (locationId) => {
    if (locations.length > 1) { // Keep at least one location
      setLocations(prev => prev.filter(loc => loc.id !== locationId));
      if (selectedLocation === locationId) {
        setSelectedLocation(locations[0].id);
      }
    }
  };

  return (
    <div className="multi-location-panel">
      <div className="panel-header">
        <h3>🌍 Enterprise Dashboard</h3>
        <div className="header-actions">
          <div className="global-stats">
            <span className="global-stat">
              <span className="stat-value">{locations.length}</span>
              <span className="stat-label">Locations</span>
            </span>
            <span className="global-stat">
              <span className="stat-value">{getTotalAlerts()}</span>
              <span className="stat-label">Alerts</span>
            </span>
          </div>
          <button 
            className="add-location-btn"
            onClick={() => setShowAddLocation(true)}
          >
            + Add Location
          </button>
        </div>
      </div>

      <div className="enterprise-overview">
        <div className="overview-metrics">
          <div className="overview-metric">
            <div className="metric-icon">⚡</div>
            <div className="metric-content">
              <h4>Total Energy</h4>
              <div className="metric-value">{getTotalConsumption().toFixed(0)} <span>kWh/hr</span></div>
            </div>
          </div>
          
          <div className="overview-metric">
            <div className="metric-icon">🌍</div>
            <div className="metric-content">
              <h4>Total Emissions</h4>
              <div className="metric-value">{getTotalEmissions().toFixed(0)} <span>kg CO₂/hr</span></div>
            </div>
          </div>
          
          <div className="overview-metric">
            <div className="metric-icon">💰</div>
            <div className="metric-content">
              <h4>Total Cost</h4>
              <div className="metric-value">${getTotalCost().toFixed(0)} <span>/hr</span></div>
            </div>
          </div>
          
          <div className="overview-metric">
            <div className="metric-icon">📊</div>
            <div className="metric-content">
              <h4>Avg Efficiency</h4>
              <div className="metric-value" style={{ color: getEfficiencyColor(getAverageEfficiency()) }}>
                {getAverageEfficiency().toFixed(0)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Location Modal */}
      {showAddLocation && (
        <div className="add-location-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h4>Add New Location</h4>
              <button 
                className="close-modal"
                onClick={() => setShowAddLocation(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="input-group">
                <label>Location Name</label>
                <input
                  type="text"
                  placeholder="e.g., Regional Office, Branch Store"
                  value={newLocation.name}
                  onChange={(e) => setNewLocation(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="input-group">
                <label>City</label>
                <input
                  type="text"
                  placeholder="e.g., Mumbai, Delhi, Bangalore"
                  value={newLocation.city}
                  onChange={(e) => setNewLocation(prev => ({ ...prev, city: e.target.value }))}
                />
              </div>
              <div className="input-group">
                <label>Type</label>
                <select
                  value={newLocation.type}
                  onChange={(e) => setNewLocation(prev => ({ ...prev, type: e.target.value }))}
                >
                  <option value="office">🏢 Office</option>
                  <option value="factory">🏭 Factory</option>
                  <option value="retail">🏪 Retail Store</option>
                  <option value="datacenter">🖥️ Data Center</option>
                  <option value="warehouse">🏬 Warehouse</option>
                  <option value="hospital">🏥 Hospital</option>
                  <option value="school">🏫 School</option>
                  <option value="hotel">🏨 Hotel</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="cancel-btn"
                onClick={() => setShowAddLocation(false)}
              >
                Cancel
              </button>
              <button 
                className="add-btn"
                onClick={addNewLocation}
                disabled={!newLocation.name.trim() || !newLocation.city.trim()}
              >
                Add Location
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="locations-grid">
        {locations.map(location => (
          <div 
            key={location.id} 
            className={`location-card ${selectedLocation === location.id ? 'selected' : ''} ${location.status}`}
            onClick={() => setSelectedLocation(location.id)}
          >
            <div className="location-header">
              <div className="location-info">
                <span className="location-icon">{getLocationTypeIcon(location.type)}</span>
                <div className="location-details">
                  <h4>{location.name}</h4>
                  <span className="location-type">{location.type}</span>
                </div>
              </div>
              <div className="location-actions">
                <div className="location-status">
                  <span className="status-icon">{getStatusIcon(location.status)}</span>
                  {location.alerts > 0 && (
                    <span className="alert-badge">{location.alerts}</span>
                  )}
                </div>
                {locations.length > 4 && (
                  <button 
                    className="remove-location-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeLocation(location.id);
                    }}
                    title="Remove Location"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
            
            <div className="location-metrics">
              <div className="location-metric">
                <span className="metric-label">Energy</span>
                <span className="metric-value">{location.consumption.toFixed(0)} kWh</span>
              </div>
              <div className="location-metric">
                <span className="metric-label">Cost</span>
                <span className="metric-value">${location.cost.toFixed(0)}/hr</span>
              </div>
              <div className="location-metric">
                <span className="metric-label">Efficiency</span>
                <span className="metric-value" style={{ color: getEfficiencyColor(location.efficiency) }}>
                  {location.efficiency.toFixed(0)}%
                </span>
              </div>
            </div>
            
            <div className="location-quick-stats">
              <span className="quick-stat">
                🌍 {location.emissions.toFixed(0)} kg CO₂
              </span>
              <span className="quick-stat">
                💡 {location.status === 'active' ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="enterprise-insights">
        <h4>🎯 Enterprise Insights</h4>
        <div className="insights-grid">
          <div className="insight-card">
            <span className="insight-icon">🏆</span>
            <div className="insight-content">
              <h5>Best Performer</h5>
              <p>{locations.reduce((best, loc) => loc.efficiency > best.efficiency ? loc : best).name}</p>
            </div>
          </div>
          <div className="insight-card">
            <span className="insight-icon">⚠️</span>
            <div className="insight-content">
              <h5>Needs Attention</h5>
              <p>{locations.find(loc => loc.alerts > 0)?.name || 'All systems optimal'}</p>
            </div>
          </div>
          <div className="insight-card">
            <span className="insight-icon">💰</span>
            <div className="insight-content">
              <h5>Daily Cost</h5>
              <p>${(getTotalCost() * 24).toFixed(0)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MultiLocationPanel;