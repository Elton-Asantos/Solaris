const axios = require('axios');

module.exports = async (req, res) => {
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
};
