const express = require('express');
const cors = require('cors');
const axios = require('axios');
const NodeCache = require('node-cache');

const app = express();
const cache = new NodeCache({ stdTTL: 600 }); // Cache por 10 minutos

app.use(cors());
app.use(express.json());

// Função para calcular distância Haversine
function haversineDistance(point1, point2) {
  const [lat1, lon1] = point1;
  const [lat2, lon2] = point2;
  const R = 6371; // Raio da Terra em km
  
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Função para filtrar dados por círculo
function filterDataByCircle(data, center, radiusKm) {
  return data.filter(point => {
    const distance = haversineDistance([point.lat, point.lon], center);
    return distance <= radiusKm;
  });
}

// Rota para dados climáticos
app.get('/api/climate-data', async (req, res) => {
  const { location } = req.query;
  const apiKey = process.env.VISUAL_CROSSING_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=${apiKey}&contentType=json`;

  try {
    const response = await axios.get(url);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching climate data:', error.message);
    res.status(500).json({ error: 'Failed to fetch climate data' });
  }
});

// Rota para dados de satélite
app.post('/api/satellite-data', async (req, res) => {
  const { bounds, startDate, endDate, variables, selectionType, circleParams } = req.body;
  
  try {
    const result = await getSatelliteData(bounds, startDate, endDate, variables, selectionType, circleParams);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching satellite data:', error.message);
    res.status(500).json({ error: 'Failed to fetch satellite data' });
  }
});

// Função para obter dados de satélite
async function getSatelliteData(bounds, startDate, endDate, variables, selectionType, circleParams) {
  const cacheKey = `sat_${JSON.stringify(bounds)}_${startDate}_${endDate}_${variables.join(',')}_${selectionType || 'rectangle'}_${circleParams ? JSON.stringify(circleParams) : 'none'}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  // Gerar dados mock
  const mockData = {};
  variables.forEach(variable => {
    mockData[variable] = Array.from({ length: 100 }, (_, i) => ({
      lat: bounds[0][0] + (Math.random() * (bounds[1][0] - bounds[0][0])),
      lon: bounds[0][1] + (Math.random() * (bounds[1][1] - bounds[0][1])),
      value: Math.random() * 100,
      timestamp: new Date(new Date(startDate).getTime() + i * 86400000).toISOString().split('T')[0],
    }));
  });

  // Aplicar filtro circular se necessário
  if (selectionType === 'circle' && circleParams) {
    const { center, radiusKm } = circleParams;
    Object.keys(mockData).forEach(variable => {
      mockData[variable] = filterDataByCircle(mockData[variable], center, radiusKm);
    });
  }

  // Análise preditiva mock
  const heatIslandVulnerability = {
    currentRisk: Math.random() * 100,
    factors: {
      temperature: Math.random() * 100,
      vegetation: Math.random() * 100,
      construction: Math.random() * 100,
      population: Math.random() * 100,
    },
  };

  const heatIslandPrediction = Array.from({ length: 5 }, (_, i) => ({
    timeframe: `Ano ${new Date().getFullYear() + i}`,
    value: Math.random() * 100,
  }));

  const result = {
    data: mockData,
    heatIslandVulnerability,
    heatIslandPrediction,
    regionStats: {
      LST: { min: 20, max: 45, mean: 30, count: 100 },
      NDVI: { min: 0.3, max: 0.8, mean: 0.5, count: 100 },
    },
  };

  cache.set(cacheKey, result);
  return result;
}

// Rota para estatísticas da região
app.get('/api/region-stats', (req, res) => {
  const mockStats = {
    LST: { min: 20, max: 45, mean: 30, count: 100 },
    NDVI: { min: 0.3, max: 0.8, mean: 0.5, count: 100 },
  };
  res.status(200).json(mockStats);
});

// Rota para download de dados
app.post('/api/download', (req, res) => {
  const { data, format, filename } = req.body;

  if (!data || !format || !filename) {
    return res.status(400).json({ error: 'Missing data, format, or filename' });
  }

  let fileContent;
  let contentType;

  if (format === 'csv') {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(',')).join('\n');
    fileContent = `${headers}\n${rows}`;
    contentType = 'text/csv';
  } else if (format === 'json') {
    fileContent = JSON.stringify(data, null, 2);
    contentType = 'application/json';
  } else {
    return res.status(400).json({ error: 'Unsupported format' });
  }

  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.status(200).send(fileContent);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 SOLARIS Server rodando na porta ${PORT}`);
});
