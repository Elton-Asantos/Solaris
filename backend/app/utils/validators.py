"""
Validadores de entrada
"""
from datetime import datetime
from fastapi import HTTPException


def validate_coordinates(lat: float, lng: float):
    """Validar coordenadas geográficas"""
    if not (-90 <= lat <= 90):
        raise HTTPException(status_code=400, detail="Latitude inválida. Deve estar entre -90 e 90")
    
    if not (-180 <= lng <= 180):
        raise HTTPException(status_code=400, detail="Longitude inválida. Deve estar entre -180 e 180")
    
    return True


def validate_date_range(start_date: str, end_date: str):
    """Validar range de datas"""
    try:
        start = datetime.strptime(start_date, '%Y-%m-%d')
        end = datetime.strptime(end_date, '%Y-%m-%d')
        
        if start > end:
            raise HTTPException(status_code=400, detail="Data inicial não pode ser posterior à data final")
        
        if (end - start).days > 365:
            raise HTTPException(status_code=400, detail="Período máximo de 1 ano")
        
        return True
        
    except ValueError:
        raise HTTPException(status_code=400, detail="Formato de data inválido. Use YYYY-MM-DD")

