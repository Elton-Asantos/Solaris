"""
Cliente para comunicação com o microsserviço GEE
"""
import sys
import os

# Adicionar path do microsserviço GEE
sys.path.append(os.path.join(os.path.dirname(__file__), '../../../services/gee'))

from gee_connector import get_gee_connector
from typing import Dict, List


async def get_satellite_data(coords: Dict = None, bounds: Dict = None, start_date: str = None, end_date: str = None, variable: str = "LST") -> List[Dict]:
    """
    Buscar dados de satélite do GEE
    
    Args:
        coords: {lat, lng} - ponto único
        bounds: {north, south, east, west} - região
        start_date: Data inicial
        end_date: Data final
        variable: Variável a buscar
        
    Returns:
        Lista de pontos com dados
    """
    gee = get_gee_connector()
    
    # Converter coords em bounds se necessário
    if coords and not bounds:
        bounds = {
            'north': coords['lat'] + 0.1,
            'south': coords['lat'] - 0.1,
            'east': coords['lng'] + 0.1,
            'west': coords['lng'] - 0.1
        }
    
    # Usar datas padrão se não fornecidas
    if not start_date or not end_date:
        from datetime import datetime, timedelta
        end = datetime.now()
        start = end - timedelta(days=30)
        start_date = start.strftime('%Y-%m-%d')
        end_date = end.strftime('%Y-%m-%d')
    
    # Buscar dados baseado na variável
    if variable == "LST":
        return await gee.get_lst_data(bounds, start_date, end_date)
    elif variable == "NDVI":
        return await gee.get_ndvi_data(bounds, start_date, end_date)
    elif variable == "NDBI":
        return await gee.get_ndbi_data(bounds, start_date, end_date)
    elif variable == "NDWI":
        return await gee.get_ndwi_data(bounds, start_date, end_date)
    elif variable == "POP_DENS":
        return gee._generate_mock_data(bounds, "POP_DENS")
    elif variable == "NIGHT_LIGHTS":
        return gee._generate_mock_data(bounds, "NIGHT_LIGHTS")
    else:
        raise ValueError(f"Variável não suportada: {variable}")


async def get_multiple_variables(coords: Dict = None, bounds: Dict = None, start_date: str = None, end_date: str = None, variables: List[str] = None) -> Dict:
    """
    Buscar múltiplas variáveis de uma vez
    
    Returns:
        Dict com todas as variáveis solicitadas
    """
    if not variables:
        variables = ["LST", "NDVI"]
    
    result = {}
    
    for variable in variables:
        data = await get_satellite_data(
            coords=coords,
            bounds=bounds,
            start_date=start_date,
            end_date=end_date,
            variable=variable
        )
        result[variable.lower()] = data
    
    return result

