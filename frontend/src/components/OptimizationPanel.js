import React, { useState } from 'react';
import './OptimizationPanel.css';

function OptimizationPanel({ suggestions, metrics }) {
  const [appliedSuggestions, setAppliedSuggestions] = useState(new Set());

  const applySuggestion = (index) => {
    setAppliedSuggestions(prev => new Set([...prev, index]));
    // In a real app, this would trigger an API call to implement the optimization
  };

  const getTotalPotentialSavings = () => {
    return suggestions.reduce((total, suggestion) => {
      const savings = parseFloat(suggestion.potential_savings.replace('$', '').replace('/day', ''));
      return total + savings;
    }, 0);
  };

  const getTotalCarbonReduction = () => {
    return suggestions.reduce((total, suggestion) => {
      const reduction = parseFloat(suggestion.carbon_reduction.replace(' kg CO2/day', ''));
      return total + reduction;
    }, 0);
  };

  return (
    <div className="optimization-panel">
      <div className="panel-header">
        <h3>🤖 AI Optimization Suggestions</h3>
        <div className="summary-stats">
          <span className="stat">💰 ${getTotalPotentialSavings().toFixed(0)}/day potential</span>
          <span className="stat">🌱 {getTotalCarbonReduction().toFixed(1)} kg CO₂ reduction</span>
        </div>
      </div>
      
      <div className="suggestions-container">
        {suggestions.length > 0 ? (
          suggestions.map((suggestion, index) => (
            <div key={index} className={`suggestion-card ${appliedSuggestions.has(index) ? 'applied' : ''}`}>
              <div className="suggestion-header">
                <span className="suggestion-type">{suggestion.type}</span>
                <span className="suggestion-impact">
                  {suggestion.potential_savings} • {suggestion.carbon_reduction}
                </span>
              </div>
              
              <p className="suggestion-message">{suggestion.message}</p>
              
              <div className="suggestion-actions">
                {!appliedSuggestions.has(index) ? (
                  <button 
                    className="apply-btn"
                    onClick={() => applySuggestion(index)}
                  >
                    Apply Optimization
                  </button>
                ) : (
                  <span className="applied-badge">✅ Applied</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-suggestions">
            <div className="no-suggestions-icon">🎯</div>
            <h4>Optimal Performance</h4>
            <p>Your energy usage is currently optimized. Great work!</p>
          </div>
        )}
      </div>
      
      <div className="optimization-insights">
        <h4>💡 Smart Insights</h4>
        <div className="insights-grid">
          <div className="insight-item">
            <span className="insight-label">Potential Monthly Savings</span>
            <span className="insight-value">${(getTotalPotentialSavings() * 30).toFixed(0)}</span>
          </div>
          <div className="insight-item">
            <span className="insight-label">Annual CO₂ Reduction</span>
            <span className="insight-value">{(getTotalCarbonReduction() * 365 / 1000).toFixed(1)} tons</span>
          </div>
          <div className="insight-item">
            <span className="insight-label">ROI Timeline</span>
            <span className="insight-value">3-6 months payback</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OptimizationPanel;