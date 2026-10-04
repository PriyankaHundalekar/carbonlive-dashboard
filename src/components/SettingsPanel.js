import React, { useState } from 'react';
import './SettingsPanel.css';

function SettingsPanel({ onSettingsChange }) {
  const [settings, setSettings] = useState({
    energyCostPerKwh: 0.12,
    carbonTarget: 300,
    alertThreshold: 600,
    currency: 'USD',
    buildingType: 'office',
    timezone: 'EST'
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange && onSettingsChange(newSettings);
  };

  const presetConfigs = {
    office: { energyCostPerKwh: 0.12, carbonTarget: 300, alertThreshold: 600 },
    factory: { energyCostPerKwh: 0.08, carbonTarget: 800, alertThreshold: 1200 },
    retail: { energyCostPerKwh: 0.15, carbonTarget: 200, alertThreshold: 400 },
    datacenter: { energyCostPerKwh: 0.10, carbonTarget: 1000, alertThreshold: 2000 }
  };

  const applyPreset = (preset) => {
    const config = presetConfigs[preset];
    setSettings({ ...settings, ...config, buildingType: preset });
    onSettingsChange && onSettingsChange({ ...settings, ...config, buildingType: preset });
  };

  return (
    <>
      <button className="settings-toggle" onClick={() => setIsOpen(!isOpen)}>
        ⚙️ Settings
      </button>

      {isOpen && (
        <div className="settings-modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
            <div className="settings-header">
              <h3>⚙️ CarbonLive Settings</h3>
              <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
            </div>

            <div className="settings-content">
              <div className="settings-section">
                <h4>💰 Cost Configuration</h4>
                <div className="setting-item">
                  <label>Energy Cost per kWh:</label>
                  <div className="input-group">
                    <span className="input-prefix">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={settings.energyCostPerKwh}
                      onChange={(e) => handleSettingChange('energyCostPerKwh', parseFloat(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              <div className="settings-section">
                <h4>🌍 Environmental Targets</h4>
                <div className="setting-item">
                  <label>Daily Carbon Target (kg CO₂):</label>
                  <input
                    type="number"
                    value={settings.carbonTarget}
                    onChange={(e) => handleSettingChange('carbonTarget', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="settings-section">
                <h4>🔔 Alert Configuration</h4>
                <div className="setting-item">
                  <label>High Usage Alert Threshold (kWh):</label>
                  <input
                    type="number"
                    value={settings.alertThreshold}
                    onChange={(e) => handleSettingChange('alertThreshold', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="settings-section">
                <h4>🏢 Building Profile</h4>
                <div className="setting-item">
                  <label>Building Type:</label>
                  <select
                    value={settings.buildingType}
                    onChange={(e) => handleSettingChange('buildingType', e.target.value)}
                  >
                    <option value="office">Office Building</option>
                    <option value="factory">Manufacturing</option>
                    <option value="retail">Retail Store</option>
                    <option value="datacenter">Data Center</option>
                  </select>
                </div>
              </div>

              <div className="preset-configs">
                <h4>🚀 Quick Presets</h4>
                <div className="preset-buttons">
                  {Object.keys(presetConfigs).map(preset => (
                    <button
                      key={preset}
                      className={`preset-btn ${settings.buildingType === preset ? 'active' : ''}`}
                      onClick={() => applyPreset(preset)}
                    >
                      {preset.charAt(0).toUpperCase() + preset.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="settings-actions">
                <button className="save-btn" onClick={() => setIsOpen(false)}>
                  ✅ Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SettingsPanel;