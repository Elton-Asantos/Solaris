module.exports = async (req, res) => {
  // Mock endpoint para estatísticas da região
  const mockStats = {
    LST: { min: 20, max: 45, mean: 30, count: 100 },
    NDVI: { min: 0.3, max: 0.8, mean: 0.5, count: 100 },
    // Adicionar outras variáveis conforme necessário
  };
  
  res.status(200).json(mockStats);
};
