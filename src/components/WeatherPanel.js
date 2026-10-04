import React, { useState, useEffect } from 'react';
import './WeatherPanel.css';

function WeatherPanel({ metrics }) {
  const [weather, setWeather] = useState({
    temperature: 22,
    humidity: 65,
    condition: 'partly-cloudy',
    windSpeed: 12,
    forecast: [
      { hour: 'Now', temp: 22, condition: '⛅' },
      { hour: '1PM', temp: 24, condition: '☀️' },
      { hour: '2PM', temp: 26, condition: '☀️' },
      { hour: '3PM', temp: 25, condition: '⛅' },
      { hour: '4PM', temp: 23, condition: '🌧️' }
    ]
  });

  const [energyPrediction, setEnergyPrediction] = useState({
    heatingNeed: 'low',
    coolingNeed: 'medium',
    expectedIncrease: 15,
    recommendation: 'Consider pre-cooling before afternoon peak'
  });

  useEffect(() => {
    // Simulate weather data updates
    const updateWeather = () => {
      const temps = [18, 19, 20, 21, 22, 23, 24, 25, 26, 27];
      const conditions = ['☀️', '⛅', '🌤️', '🌧️', '⛈️'];
      const selectedCondition = conditions[Math.floor(Math.random() * conditions.length)];
      
      setWeather(prev => ({
        ...prev,
        temperature: temps[Math.floor(Math.random() * temps.length)],
        humidity: 40 + Math.random() * 40,
        windSpeed: 5 + Math.random() * 20,
        condition: selectedCondition
      }));

      // Update energy prediction based on weather
      const temp = weather.temperature;
      let heatingNeed = 'none';
      let coolingNeed = 'none';
      let expectedIncrease = 0;
      let recommendation = 'Optimal weather conditions';

      if (temp < 18) {
        heatingNeed = 'high';
        expectedIncrease = 25;
        recommendation = 'High heating demand expected. Consider zone heating.';
      } else if (temp < 20) {
        heatingNeed = 'medium';
        expectedIncrease = 15;
        recommendation = 'Moderate heating needed. Optimize HVAC schedule.';
      } else if (temp > 26) {
        coolingNeed = 'high';
        expectedIncrease = 30;
        recommendation = 'High cooling demand. Pre-cool during off-peak hours.';
      } else if (temp > 24) {
        coolingNeed = 'medium';
        expectedIncrease = 15;
        recommendation = 'Moderate cooling needed. Use natural ventilation when possible.';
      }

      setEnergyPrediction({
        heatingNeed,
        coolingNeed,
        expectedIncrease,
        recommendation
      });
    };

    const interval = setInterval(updateWeather, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [weather.temperature]);

  const getWeatherIcon = () => {
    if (weather.temperature > 25) return '☀️';
    if (weather.temperature < 18) return '❄️';
    if (weather.humidity > 80) return '🌧️';
    return '⛅';
  };

  const getEnergyImpactColor = (increase) => {
    if (increase > 25) return '#ef4444';
    if (increase > 15) return '#f59e0b';
    if (increase > 5) return '#eab308';
    return '#22c55e';
  };

  return (
    <div className="weather-panel">
      <div className="panel-header">
        <h3>🌤️ Weather Impact</h3>
        <div className="weather-status">
          <span className="weather-icon">{getWeatherIcon()}</span>
          <span className="temperature">{weather.temperature}°C</span>
        </div>
      </div>

      <div className="weather-metrics">
        <div className="weather-metric">
          <span className="metric-label">🌡️ Temperature</span>
          <span className="metric-value">{weather.temperature}°C</span>
        </div>
        <div className="weather-metric">
          <span className="metric-label">💧 Humidity</span>
          <span className="metric-value">{weather.humidity.toFixed(0)}%</span>
        </div>
        <div className="weather-metric">
          <span className="metric-label">💨 Wind Speed</span>
          <span className="metric-value">{weather.windSpeed.toFixed(0)} km/h</span>
        </div>
      </div>

      <div className="forecast-section">
        <h4>Hourly Forecast</h4>
        <div className="forecast-grid">
          {weather.forecast.map((hour, index) => (
            <div key={index} className="forecast-item">
              <span className="forecast-time">{hour.hour}</span>
              <span className="forecast-icon">{hour.condition}</span>
              <span className="forecast-temp">{hour.temp}°</span>
            </div>
          ))}
        </div>
      </div>

      <div className="energy-prediction">
        <h4>🔮 Energy Impact Forecast</h4>
        <div className="prediction-content">
          <div className="prediction-metric">
            <span className="prediction-label">Expected Usage Change:</span>
            <span 
              className="prediction-value"
              style={{ color: getEnergyImpactColor(energyPrediction.expectedIncrease) }}
            >
              +{energyPrediction.expectedIncrease}%
            </span>
          </div>
          
          <div className="needs-grid">
            <div className="need-item">
              <span className="need-label">🔥 Heating Need</span>
              <span className={`need-value ${energyPrediction.heatingNeed}`}>
                {energyPrediction.heatingNeed}
              </span>
            </div>
            <div className="need-item">
              <span className="need-label">❄️ Cooling Need</span>
              <span className={`need-value ${energyPrediction.coolingNeed}`}>
                {energyPrediction.coolingNeed}
              </span>
            </div>
          </div>

          <div className="weather-recommendation">
            <p>{energyPrediction.recommendation}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherPanel;