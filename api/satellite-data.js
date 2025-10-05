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

module.exports = async (req, res) => {
  const { bounds, startDate, endDate, variables, selectionType, circleParams } = req.body;

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

  res.status(200).json({
    data: mockData,
    heatIslandVulnerability,
    heatIslandPrediction,
    regionStats: {
      LST: { min: 20, max: 45, mean: 30, count: 100 },
      NDVI: { min: 0.3, max: 0.8, mean: 0.5, count: 100 },
    },
  });
};
