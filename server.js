const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const axios = require('axios');
const cron = require('node-cron');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static('frontend/build'));

// Carbon emission factors (kg CO2 per kWh by energy source)
const EMISSION_FACTORS = {
  coal: 0.82,
  natural_gas: 0.35,
  nuclear: 0.012,
  solar: 0.041,
  wind: 0.011,
  hydro: 0.024
};

// Simulate real-time energy data
let currentMetrics = {
  electricity: 150, // kWh
  heating: 85,
  cooling: 120,
  equipment: 95,
  lighting: 45,
  total_consumption: 495,
  carbon_emissions: 0,
  cost_per_hour: 0,
  efficiency_score: 75
};

// Real-time data generation
function generateRealtimeData() {
  const baseLoad = 400;
  const variation = Math.sin(Date.now() / 60000) * 100; // Hourly pattern
  const randomSpike = Math.random() * 50;
  
  currentMetrics.electricity = Math.max(50, baseLoad + variation + randomSpike);
  currentMetrics.heating = Math.max(20, 85 + Math.random() * 40 - 20);
  currentMetrics.cooling = Math.max(30, 120 + Math.random() * 50 - 25);
  currentMetrics.equipment = Math.max(40, 95 + Math.random() * 30 - 15);
  currentMetrics.lighting = Math.max(20, 45 + Math.random() * 20 - 10);
  
  currentMetrics.total_consumption = currentMetrics.electricity + 
    currentMetrics.heating + currentMetrics.cooling + 
    currentMetrics.equipment + currentMetrics.lighting;
  
  // Calculate carbon emissions (assuming mixed grid)
  const avgEmissionFactor = 0.45; // kg CO2 per kWh (mixed grid)
  currentMetrics.carbon_emissions = (currentMetrics.total_consumption * avgEmissionFactor).toFixed(2);
  
  // Calculate cost ($0.12 per kWh average)
  currentMetrics.cost_per_hour = (currentMetrics.total_consumption * 0.12).toFixed(2);
  
  // Calculate efficiency score
  currentMetrics.efficiency_score = Math.max(30, 100 - (currentMetrics.total_consumption - 400) / 10);
  
  return currentMetrics;
}

// AI Optimization suggestions
function getOptimizationSuggestions(metrics) {
  const suggestions = [];
  
  if (metrics.heating > 100) {
    suggestions.push({
      type: 'heating',
      message: 'Heating usage is high. Consider reducing temperature by 2°C to save 15% energy.',
      potential_savings: '$12/day',
      carbon_reduction: '8.5 kg CO2/day'
    });
  }
  
  if (metrics.lighting > 55) {
    suggestions.push({
      type: 'lighting',
      message: 'Switch to LED lighting in unused areas. Motion sensors can reduce consumption by 30%.',
      potential_savings: '$8/day',
      carbon_reduction: '5.2 kg CO2/day'
    });
  }
  
  if (metrics.equipment > 110) {
    suggestions.push({
      type: 'equipment',
      message: 'Some equipment may be running idle. Power management can save 20% energy.',
      potential_savings: '$15/day',
      carbon_reduction: '10.1 kg CO2/day'
    });
  }
  
  return suggestions;
}

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected');
  
  // Send initial data
  socket.emit('metrics_update', currentMetrics);
  socket.emit('optimization_suggestions', getOptimizationSuggestions(currentMetrics));
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Update data every 5 seconds
setInterval(() => {
  const newMetrics = generateRealtimeData();
  const suggestions = getOptimizationSuggestions(newMetrics);
  
  io.emit('metrics_update', newMetrics);
  io.emit('optimization_suggestions', suggestions);
}, 5000);

// API endpoints
app.get('/api/metrics', (req, res) => {
  res.json(currentMetrics);
});

app.get('/api/historical', (req, res) => {
  // Generate mock historical data for the last 24 hours
  const historical = [];
  const now = Date.now();
  
  for (let i = 24; i >= 0; i--) {
    const timestamp = new Date(now - i * 60 * 60 * 1000);
    const baseConsumption = 400 + Math.sin(i / 4) * 100;
    
    historical.push({
      timestamp: timestamp.toISOString(),
      consumption: Math.max(200, baseConsumption + Math.random() * 50),
      carbon_emissions: (baseConsumption * 0.45).toFixed(2),
      cost: (baseConsumption * 0.12).toFixed(2)
    });
  }
  
  res.json(historical);
});

const PORT = process.env.PORT || 3001;

// For Vercel deployment
if (process.env.NODE_ENV !== 'production') {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`CarbonLive server running on port ${PORT}`);
    console.log(`Backend accessible at: http://localhost:${PORT}`);
    console.log(`Network access: http://[YOUR-IP]:${PORT}`);
  });
}

// Export for Vercel
module.exports = app;