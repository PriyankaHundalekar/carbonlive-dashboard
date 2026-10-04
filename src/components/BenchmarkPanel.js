import React, { useState, useEffect } from 'react';
import './BenchmarkPanel.css';

function BenchmarkPanel({ metrics }) {
  const [benchmarks, setBenchmarks] = useState({
    industryAverage: {
      consumption: 720,
      emissions: 324,
      cost: 86.4,
      efficiency: 65
    },
    bestInClass: {
      consumption: 480,
      emissions: 216,
      cost: 57.6,
      efficiency: 85
    },
    yourBuilding: {
      consumption: metrics?.total_consumption || 0,
      emissions: parseFloat(metrics?.carbon_emissions) || 0,
      cost: parseFloat(metrics?.cost_per_hour) || 0,
      efficiency: metrics?.efficiency_score || 0
    }
  });

  const [rankings, setRankings] = useState({
    consumptionRank: 'Top 25%',
    emissionsRank: 'Top 15%',
    costRank: 'Top 30%',
    overallScore: 'B+'
  });

  useEffect(() => {
    if (metrics) {
      setBenchmarks(prev => ({
        ...prev,
        yourBuilding: {
          consumption: metrics.total_consumption,
          emissions: parseFloat(metrics.carbon_emissions),
          cost: parseFloat(metrics.cost_per_hour),
          efficiency: metrics.efficiency_score
        }
      }));

      // Calculate rankings based on performance
      const consumptionPerf = (benchmarks.industryAverage.consumption - metrics.total_consumption) / benchmarks.industryAverage.consumption * 100;
      const emissionsPerf = (benchmarks.industryAverage.emissions - parseFloat(metrics.carbon_emissions)) / benchmarks.industryAverage.emissions * 100;
      const costPerf = (benchmarks.industryAverage.cost - parseFloat(metrics.cost_per_hour)) / benchmarks.industryAverage.cost * 100;
      
      let overallScore = 'D';
      let consumptionRank = 'Bottom 50%';
      let emissionsRank = 'Bottom 50%';
      let costRank = 'Bottom 50%';

      if (consumptionPerf > 30) consumptionRank = 'Top 10%';
      else if (consumptionPerf > 15) consumptionRank = 'Top 25%';
      else if (consumptionPerf > 0) consumptionRank = 'Above Average';

      if (emissionsPerf > 30) emissionsRank = 'Top 10%';
      else if (emissionsPerf > 15) emissionsRank = 'Top 25%';
      else if (emissionsPerf > 0) emissionsRank = 'Above Average';

      if (costPerf > 30) costRank = 'Top 10%';
      else if (costPerf > 15) costRank = 'Top 25%';
      else if (costPerf > 0) costRank = 'Above Average';

      const avgPerf = (consumptionPerf + emissionsPerf + costPerf) / 3;
      if (avgPerf > 25) overallScore = 'A';
      else if (avgPerf > 15) overallScore = 'B+';
      else if (avgPerf > 5) overallScore = 'B';
      else if (avgPerf > -5) overallScore = 'C';

      setRankings({
        consumptionRank,
        emissionsRank,
        costRank,
        overallScore
      });
    }
  }, [metrics, benchmarks.industryAverage]);

  const getComparisonPercentage = (your, industry) => {
    return ((industry - your) / industry * 100).toFixed(1);
  };

  const getPerformanceColor = (percentage) => {
    if (percentage > 15) return '#22c55e';
    if (percentage > 0) return '#eab308';
    return '#ef4444';
  };

  const getScoreColor = (score) => {
    if (['A', 'A+'].includes(score)) return '#22c55e';
    if (['B+', 'B'].includes(score)) return '#3b82f6';
    if (['C+', 'C'].includes(score)) return '#eab308';
    return '#ef4444';
  };

  return (
    <div className="benchmark-panel">
      <div className="panel-header">
        <h3>📊 Performance Benchmarks</h3>
        <div className="overall-score">
          <span className="score-label">Overall Grade:</span>
          <span 
            className="score-value"
            style={{ color: getScoreColor(rankings.overallScore) }}
          >
            {rankings.overallScore}
          </span>
        </div>
      </div>

      <div className="benchmark-comparison">
        <div className="comparison-categories">
          <div className="category-header">
            <span>Metric</span>
            <span>Your Building</span>
            <span>Industry Avg</span>
            <span>Performance</span>
          </div>

          <div className="category-row">
            <span className="category-name">⚡ Energy Usage</span>
            <span className="your-value">{benchmarks.yourBuilding.consumption.toFixed(0)} kWh</span>
            <span className="industry-value">{benchmarks.industryAverage.consumption} kWh</span>
            <span 
              className="performance-indicator"
              style={{ color: getPerformanceColor(getComparisonPercentage(benchmarks.yourBuilding.consumption, benchmarks.industryAverage.consumption)) }}
            >
              {getComparisonPercentage(benchmarks.yourBuilding.consumption, benchmarks.industryAverage.consumption) > 0 ? 
                `${getComparisonPercentage(benchmarks.yourBuilding.consumption, benchmarks.industryAverage.consumption)}% better` :
                `${Math.abs(getComparisonPercentage(benchmarks.yourBuilding.consumption, benchmarks.industryAverage.consumption))}% worse`
              }
            </span>
          </div>

          <div className="category-row">
            <span className="category-name">🌍 Carbon Emissions</span>
            <span className="your-value">{benchmarks.yourBuilding.emissions.toFixed(0)} kg CO₂</span>
            <span className="industry-value">{benchmarks.industryAverage.emissions} kg CO₂</span>
            <span 
              className="performance-indicator"
              style={{ color: getPerformanceColor(getComparisonPercentage(benchmarks.yourBuilding.emissions, benchmarks.industryAverage.emissions)) }}
            >
              {getComparisonPercentage(benchmarks.yourBuilding.emissions, benchmarks.industryAverage.emissions) > 0 ? 
                `${getComparisonPercentage(benchmarks.yourBuilding.emissions, benchmarks.industryAverage.emissions)}% better` :
                `${Math.abs(getComparisonPercentage(benchmarks.yourBuilding.emissions, benchmarks.industryAverage.emissions))}% worse`
              }
            </span>
          </div>

          <div className="category-row">
            <span className="category-name">💰 Hourly Cost</span>
            <span className="your-value">${benchmarks.yourBuilding.cost.toFixed(0)}</span>
            <span className="industry-value">${benchmarks.industryAverage.cost}</span>
            <span 
              className="performance-indicator"
              style={{ color: getPerformanceColor(getComparisonPercentage(benchmarks.yourBuilding.cost, benchmarks.industryAverage.cost)) }}
            >
              {getComparisonPercentage(benchmarks.yourBuilding.cost, benchmarks.industryAverage.cost) > 0 ? 
                `${getComparisonPercentage(benchmarks.yourBuilding.cost, benchmarks.industryAverage.cost)}% better` :
                `${Math.abs(getComparisonPercentage(benchmarks.yourBuilding.cost, benchmarks.industryAverage.cost))}% worse`
              }
            </span>
          </div>
        </div>
      </div>

      <div className="ranking-section">
        <h4>🏆 Your Rankings</h4>
        <div className="ranking-grid">
          <div className="ranking-item">
            <span className="ranking-metric">Energy Efficiency</span>
            <span className="ranking-badge">{rankings.consumptionRank}</span>
          </div>
          <div className="ranking-item">
            <span className="ranking-metric">Carbon Performance</span>
            <span className="ranking-badge">{rankings.emissionsRank}</span>
          </div>
          <div className="ranking-item">
            <span className="ranking-metric">Cost Optimization</span>
            <span className="ranking-badge">{rankings.costRank}</span>
          </div>
        </div>
      </div>

      <div className="improvement-targets">
        <h4>🎯 Improvement Targets</h4>
        <div className="targets-grid">
          <div className="target-item">
            <span className="target-label">To reach Best-in-Class:</span>
            <span className="target-value">
              Reduce usage by {((benchmarks.yourBuilding.consumption - benchmarks.bestInClass.consumption) / benchmarks.yourBuilding.consumption * 100).toFixed(0)}%
            </span>
          </div>
          <div className="target-item">
            <span className="target-label">Potential annual savings:</span>
            <span className="target-value">
              ${((benchmarks.yourBuilding.cost - benchmarks.bestInClass.cost) * 24 * 365).toFixed(0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BenchmarkPanel;