"""
SOLARIS - Google Earth Engine Client
Serviço para buscar dados de satélite do GEE
"""
import ee
import logging
from typing import Dict, List, Optional, Union
from datetime import datetime, timedelta
import json

logger = logging.getLogger(__name__)

# Estado de inicialização do GEE
_gee_initialized = False


def initialize_gee():
    """Inicializar Google Earth Engine"""
    global _gee_initialized
    
    if _gee_initialized:
        logger.info("GEE já inicializado")
        return True
    
    try:
        # Tentar autenticação (modo servidor)
        ee.Initialize()
        _gee_initialized = True
        logger.info("✅ Google Earth Engine inicializado com sucesso!")
        return True
    except Exception as e:
        logger.warning(f"⚠️ Falha na inicialização do GEE: {str(e)}")
        logger.info("💡 Usando dados mockados (mock mode)")
        return False


def get_modis_lst(geometry, start_date: str, end_date: str) -> Dict:
    """
    Buscar dados de Land Surface Temperature (LST) do MODIS
    
    Dataset: MODIS/006/MOD11A2 (8-day composite)
    """
    try:
        if not _gee_initialized:
            return generate_mock_data("LST", geometry)
        
        # MODIS Terra LST/Emissivity 8-Day L3 Global 1km
        dataset = ee.ImageCollection('MODIS/006/MOD11A2') \
            .select('LST_Day_1km') \
            .filterDate(start_date, end_date) \
            .filterBounds(geometry)
        
        # Calcular média
        lst_mean = dataset.mean()
        
        # Converter Kelvin para Celsius (MODIS LST vem em Kelvin * 0.02)
        lst_celsius = lst_mean.multiply(0.02).subtract(273.15)
        
        # Amostrar dados
        sample = lst_celsius.sample(
            region=geometry,
            scale=1000,  # 1km resolution
            numPixels=100,
            geometries=True
        )
        
        # Converter para feature collection
        features = sample.getInfo()
        
        return {
            "variable": "LST",
            "unit": "°C",
            "source": "MODIS",
            "features": features,
            "count": len(features.get('features', []))
        }
        
    except Exception as e:
        logger.error(f"Erro ao buscar LST: {str(e)}")
        return generate_mock_data("LST", geometry)


def get_landsat_ndvi(geometry, start_date: str, end_date: str) -> Dict:
    """
    Buscar dados de NDVI do Landsat 8
    
    Dataset: LANDSAT/LC08/C02/T1_L2
    """
    try:
        if not _gee_initialized:
            return generate_mock_data("NDVI", geometry)
        
        # Landsat 8 Collection 2 Tier 1 Level 2
        dataset = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2') \
            .filterDate(start_date, end_date) \
            .filterBounds(geometry)
        
        # Função para calcular NDVI
        def calculate_ndvi(image):
            ndvi = image.normalizedDifference(['SR_B5', 'SR_B4']).rename('NDVI')
            return image.addBands(ndvi)
        
        # Calcular NDVI para todas as imagens
        ndvi_collection = dataset.map(calculate_ndvi)
        
        # Média do NDVI
        ndvi_mean = ndvi_collection.select('NDVI').mean()
        
        # Amostrar dados
        sample = ndvi_mean.sample(
            region=geometry,
            scale=30,  # 30m resolution
            numPixels=100,
            geometries=True
        )
        
        features = sample.getInfo()
        
        return {
            "variable": "NDVI",
            "unit": "0-1",
            "source": "Landsat 8",
            "features": features,
            "count": len(features.get('features', []))
        }
        
    except Exception as e:
        logger.error(f"Erro ao buscar NDVI: {str(e)}")
        return generate_mock_data("NDVI", geometry)


def get_landsat_ndbi(geometry, start_date: str, end_date: str) -> Dict:
    """
    Buscar dados de NDBI (Normalized Difference Built-up Index) do Landsat 8
    """
    try:
        if not _gee_initialized:
            return generate_mock_data("NDBI", geometry)
        
        dataset = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2') \
            .filterDate(start_date, end_date) \
            .filterBounds(geometry)
        
        # NDBI = (SWIR - NIR) / (SWIR + NIR)
        def calculate_ndbi(image):
            ndbi = image.normalizedDifference(['SR_B6', 'SR_B5']).rename('NDBI')
            return image.addBands(ndbi)
        
        ndbi_collection = dataset.map(calculate_ndbi)
        ndbi_mean = ndbi_collection.select('NDBI').mean()
        
        sample = ndbi_mean.sample(
            region=geometry,
            scale=30,
            numPixels=100,
            geometries=True
        )
        
        features = sample.getInfo()
        
        return {
            "variable": "NDBI",
            "unit": "0-1",
            "source": "Landsat 8",
            "features": features,
            "count": len(features.get('features', []))
        }
        
    except Exception as e:
        logger.error(f"Erro ao buscar NDBI: {str(e)}")
        return generate_mock_data("NDBI", geometry)


def get_landsat_ndwi(geometry, start_date: str, end_date: str) -> Dict:
    """
    Buscar dados de NDWI (Normalized Difference Water Index) do Landsat 8
    """
    try:
        if not _gee_initialized:
            return generate_mock_data("NDWI", geometry)
        
        dataset = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2') \
            .filterDate(start_date, end_date) \
            .filterBounds(geometry)
        
        # NDWI = (GREEN - NIR) / (GREEN + NIR)
        def calculate_ndwi(image):
            ndwi = image.normalizedDifference(['SR_B3', 'SR_B5']).rename('NDWI')
            return image.addBands(ndwi)
        
        ndwi_collection = dataset.map(calculate_ndwi)
        ndwi_mean = ndwi_collection.select('NDWI').mean()
        
        sample = ndwi_mean.sample(
            region=geometry,
            scale=30,
            numPixels=100,
            geometries=True
        )
        
        features = sample.getInfo()
        
        return {
            "variable": "NDWI",
            "unit": "0-1",
            "source": "Landsat 8",
            "features": features,
            "count": len(features.get('features', []))
        }
        
    except Exception as e:
        logger.error(f"Erro ao buscar NDWI: {str(e)}")
        return generate_mock_data("NDWI", geometry)


def generate_mock_data(variable: str, geometry) -> Dict:
    """
    Gerar dados mockados para testes (quando GEE não estiver disponível)
    """
    import random
    
    # Valores típicos para cada variável
    ranges = {
        "LST": (25, 45),  # °C
        "NDVI": (0.1, 0.8),
        "NDBI": (-0.5, 0.5),
        "NDWI": (-0.3, 0.3),
        "POP_DENS": (100, 5000),  # pessoas/km²
        "NIGHT_LIGHTS": (0, 100)  # nW/cm²/sr
    }
    
    min_val, max_val = ranges.get(variable, (0, 100))
    
    # Obter bounds da geometria para gerar pontos dentro dela
    try:
        bounds = geometry.bounds().getInfo()
        coordinates = bounds['coordinates'][0]
        
        # Calcular centro e tamanho aproximado
        lngs = [coord[0] for coord in coordinates]
        lats = [coord[1] for coord in coordinates]
        
        center_lat = sum(lats) / len(lats)
        center_lng = sum(lngs) / len(lngs)
        
        # Raio máximo (metade da distância entre pontos extremos)
        delta_lat = (max(lats) - min(lats)) / 2
        delta_lng = (max(lngs) - min(lngs)) / 2
        
    except:
        # Fallback: usar coordenadas de Brasília
        center_lat = -15.7801
        center_lng = -47.9292
        delta_lat = 0.05
        delta_lng = 0.05
    
    # Gerar 50 pontos mockados dentro da geometria
    features = []
    for i in range(50):
        lat = center_lat + (random.random() - 0.5) * delta_lat * 2
        lng = center_lng + (random.random() - 0.5) * delta_lng * 2
        value = random.uniform(min_val, max_val)
        
        features.append({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [lng, lat]
            },
            "properties": {
                variable: round(value, 2)
            }
        })
    
    logger.info(f"📊 Gerando {len(features)} pontos mockados para {variable} em ({center_lat:.4f}, {center_lng:.4f})")
    
    return {
        "variable": variable,
        "unit": get_unit(variable),
        "source": "Mock Data (GEE não disponível)",
        "features": {"type": "FeatureCollection", "features": features},
        "count": len(features),
        "mock": True
    }


def get_unit(variable: str) -> str:
    """Retornar unidade da variável"""
    units = {
        "LST": "°C",
        "NDVI": "0-1",
        "NDBI": "0-1",
        "NDWI": "0-1",
        "POP_DENS": "pessoas/km²",
        "NIGHT_LIGHTS": "nW/cm²/sr"
    }
    return units.get(variable, "")


async def get_satellite_data(coords: Optional[Dict] = None, 
                             bounds: Optional[Dict] = None,
                             radius: Optional[float] = None,
                             variable: str = "LST",
                             start_date: Optional[str] = None,
                             end_date: Optional[str] = None) -> Dict:
    """
    Buscar dados de uma variável específica
    """
    # Inicializar GEE se necessário
    initialize_gee()
    
    # Definir datas padrão (últimos 30 dias)
    if not start_date:
        start_date = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
    if not end_date:
        end_date = datetime.now().strftime('%Y-%m-%d')
    
    # Criar geometria
    if coords:
        # Ponto ou círculo com raio especificado
        buffer_radius = radius if radius else 5000  # Default 5km
        # Limitar raio máximo para evitar timeout
        buffer_radius = min(buffer_radius, 50000)  # Max 50km
        geometry = ee.Geometry.Point([coords['lng'], coords['lat']]).buffer(buffer_radius)
        logger.info(f"Geometria: Ponto com buffer de {buffer_radius}m")
    elif bounds:
        # Retângulo
        geometry = ee.Geometry.Rectangle([
            bounds['west'], bounds['south'],
            bounds['east'], bounds['north']
        ])
        logger.info(f"Geometria: Retângulo")
    else:
        raise ValueError("Forneça coords ou bounds")
    
    # Buscar dados conforme a variável
    if variable == "LST":
        return get_modis_lst(geometry, start_date, end_date)
    elif variable == "NDVI":
        return get_landsat_ndvi(geometry, start_date, end_date)
    elif variable == "NDBI":
        return get_landsat_ndbi(geometry, start_date, end_date)
    elif variable == "NDWI":
        return get_landsat_ndwi(geometry, start_date, end_date)
    else:
        return generate_mock_data(variable, geometry)


async def get_multiple_variables(coords: Optional[Dict] = None,
                                 bounds: Optional[Dict] = None,
                                 radius: Optional[float] = None,
                                 start_date: Optional[str] = None,
                                 end_date: Optional[str] = None,
                                 variables: List[str] = None) -> Dict:
    """
    Buscar dados de múltiplas variáveis
    """
    if not variables:
        variables = ["LST", "NDVI"]
    
    results = {}
    
    for variable in variables:
        logger.info(f"Buscando dados para: {variable}")
        data = await get_satellite_data(
            coords=coords,
            bounds=bounds,
            radius=radius,
            variable=variable,
            start_date=start_date,
            end_date=end_date
        )
        results[variable] = data
    
    return results
