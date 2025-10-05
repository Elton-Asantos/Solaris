"""
SOLARIS - Microsserviço Google Earth Engine
Serviço dedicado para comunicação com GEE
"""
import ee
import json
import logging
from typing import Dict, List, Optional
from datetime import datetime, timedelta

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class GEEConnector:
    """Conector para Google Earth Engine"""
    
    def __init__(self):
        """Inicializar conexão com GEE"""
        self.initialized = False
        self._initialize_gee()
    
    def _initialize_gee(self):
        """Inicializar autenticação GEE"""
        try:
            # Para uso não comercial, usar autenticação padrão
            ee.Initialize()
            self.initialized = True
            logger.info("✅ Google Earth Engine inicializado com sucesso")
        except Exception as e:
            logger.error(f"❌ Erro ao inicializar GEE: {str(e)}")
            logger.info("💡 Execute: earthengine authenticate")
            self.initialized = False
    
    async def get_lst_data(self, bounds: Dict, start_date: str, end_date: str) -> List[Dict]:
        """
        Buscar dados de Land Surface Temperature (LST)
        
        Args:
            bounds: {north, south, east, west}
            start_date: Data inicial (YYYY-MM-DD)
            end_date: Data final (YYYY-MM-DD)
            
        Returns:
            Lista de pontos com lat, lon, value
        """
        if not self.initialized:
            return self._generate_mock_data(bounds, "LST")
        
        try:
            # Definir região de interesse
            roi = ee.Geometry.Rectangle([
                bounds['west'], bounds['south'],
                bounds['east'], bounds['north']
            ])
            
            # Buscar imagens MODIS LST
            modis = ee.ImageCollection('MODIS/006/MOD11A1') \
                .filterDate(start_date, end_date) \
                .filterBounds(roi) \
                .select('LST_Day_1km')
            
            # Calcular média temporal
            lst_mean = modis.mean()
            
            # Converter Kelvin para Celsius
            lst_celsius = lst_mean.multiply(0.02).subtract(273.15)
            
            # Amostrar pontos
            samples = lst_celsius.sample(
                region=roi,
                scale=1000,
                numPixels=100,
                geometries=True
            )
            
            # Converter para lista
            data = []
            features = samples.getInfo()['features']
            
            for feature in features:
                coords = feature['geometry']['coordinates']
                value = feature['properties'].get('LST_Day_1km', 0)
                
                data.append({
                    'lat': coords[1],
                    'lon': coords[0],
                    'value': round(value, 2)
                })
            
            logger.info(f"✅ LST: {len(data)} pontos coletados")
            return data
            
        except Exception as e:
            logger.error(f"❌ Erro ao buscar LST: {str(e)}")
            return self._generate_mock_data(bounds, "LST")
    
    async def get_ndvi_data(self, bounds: Dict, start_date: str, end_date: str) -> List[Dict]:
        """Buscar dados de NDVI"""
        if not self.initialized:
            return self._generate_mock_data(bounds, "NDVI")
        
        try:
            roi = ee.Geometry.Rectangle([
                bounds['west'], bounds['south'],
                bounds['east'], bounds['north']
            ])
            
            # Sentinel-2 para NDVI
            sentinel = ee.ImageCollection('COPERNICUS/S2_SR') \
                .filterDate(start_date, end_date) \
                .filterBounds(roi) \
                .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
            
            # Calcular NDVI
            def calculate_ndvi(image):
                ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI')
                return ndvi
            
            ndvi_collection = sentinel.map(calculate_ndvi)
            ndvi_mean = ndvi_collection.mean()
            
            # Amostrar pontos
            samples = ndvi_mean.sample(
                region=roi,
                scale=100,
                numPixels=100,
                geometries=True
            )
            
            data = []
            features = samples.getInfo()['features']
            
            for feature in features:
                coords = feature['geometry']['coordinates']
                value = feature['properties'].get('NDVI', 0)
                
                data.append({
                    'lat': coords[1],
                    'lon': coords[0],
                    'value': round(value, 3)
                })
            
            logger.info(f"✅ NDVI: {len(data)} pontos coletados")
            return data
            
        except Exception as e:
            logger.error(f"❌ Erro ao buscar NDVI: {str(e)}")
            return self._generate_mock_data(bounds, "NDVI")
    
    async def get_ndbi_data(self, bounds: Dict, start_date: str, end_date: str) -> List[Dict]:
        """Buscar dados de NDBI (Normalized Difference Built-up Index)"""
        if not self.initialized:
            return self._generate_mock_data(bounds, "NDBI")
        
        try:
            roi = ee.Geometry.Rectangle([
                bounds['west'], bounds['south'],
                bounds['east'], bounds['north']
            ])
            
            # Landsat 8 para NDBI
            landsat = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2') \
                .filterDate(start_date, end_date) \
                .filterBounds(roi)
            
            # Calcular NDBI
            def calculate_ndbi(image):
                ndbi = image.normalizedDifference(['SR_B6', 'SR_B5']).rename('NDBI')
                return ndbi
            
            ndbi_collection = landsat.map(calculate_ndbi)
            ndbi_mean = ndbi_collection.mean()
            
            # Amostrar pontos
            samples = ndbi_mean.sample(
                region=roi,
                scale=100,
                numPixels=100,
                geometries=True
            )
            
            data = []
            features = samples.getInfo()['features']
            
            for feature in features:
                coords = feature['geometry']['coordinates']
                value = feature['properties'].get('NDBI', 0)
                
                data.append({
                    'lat': coords[1],
                    'lon': coords[0],
                    'value': round(value, 3)
                })
            
            logger.info(f"✅ NDBI: {len(data)} pontos coletados")
            return data
            
        except Exception as e:
            logger.error(f"❌ Erro ao buscar NDBI: {str(e)}")
            return self._generate_mock_data(bounds, "NDBI")
    
    async def get_ndwi_data(self, bounds: Dict, start_date: str, end_date: str) -> List[Dict]:
        """Buscar dados de NDWI (Normalized Difference Water Index)"""
        if not self.initialized:
            return self._generate_mock_data(bounds, "NDWI")
        
        try:
            roi = ee.Geometry.Rectangle([
                bounds['west'], bounds['south'],
                bounds['east'], bounds['north']
            ])
            
            # Sentinel-2 para NDWI
            sentinel = ee.ImageCollection('COPERNICUS/S2_SR') \
                .filterDate(start_date, end_date) \
                .filterBounds(roi) \
                .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
            
            # Calcular NDWI
            def calculate_ndwi(image):
                ndwi = image.normalizedDifference(['B3', 'B8']).rename('NDWI')
                return ndwi
            
            ndwi_collection = sentinel.map(calculate_ndwi)
            ndwi_mean = ndwi_collection.mean()
            
            # Amostrar pontos
            samples = ndwi_mean.sample(
                region=roi,
                scale=100,
                numPixels=100,
                geometries=True
            )
            
            data = []
            features = samples.getInfo()['features']
            
            for feature in features:
                coords = feature['geometry']['coordinates']
                value = feature['properties'].get('NDWI', 0)
                
                data.append({
                    'lat': coords[1],
                    'lon': coords[0],
                    'value': round(value, 3)
                })
            
            logger.info(f"✅ NDWI: {len(data)} pontos coletados")
            return data
            
        except Exception as e:
            logger.error(f"❌ Erro ao buscar NDWI: {str(e)}")
            return self._generate_mock_data(bounds, "NDWI")
    
    def _generate_mock_data(self, bounds: Dict, variable: str) -> List[Dict]:
        """Gerar dados mock para desenvolvimento"""
        import random
        
        data = []
        num_points = 50
        
        # Definir ranges por variável
        ranges = {
            "LST": (20, 45),
            "NDVI": (0, 1),
            "NDBI": (-0.2, 0.8),
            "NDWI": (-0.5, 0.5),
            "POP_DENS": (0, 10000),
            "NIGHT_LIGHTS": (0, 100)
        }
        
        min_val, max_val = ranges.get(variable, (0, 100))
        
        for _ in range(num_points):
            lat = bounds['south'] + random.random() * (bounds['north'] - bounds['south'])
            lon = bounds['west'] + random.random() * (bounds['east'] - bounds['west'])
            value = min_val + random.random() * (max_val - min_val)
            
            data.append({
                'lat': round(lat, 6),
                'lon': round(lon, 6),
                'value': round(value, 2)
            })
        
        logger.info(f"⚠️  Usando dados mock para {variable}: {len(data)} pontos")
        return data


# Singleton
_gee_connector = None

def get_gee_connector() -> GEEConnector:
    """Obter instância única do conector GEE"""
    global _gee_connector
    if _gee_connector is None:
        _gee_connector = GEEConnector()
    return _gee_connector

