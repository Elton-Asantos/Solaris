"""
SOLARIS - Backend FastAPI
Plataforma de IA climática para mapeamento e previsão de ilhas de calor urbanas
"""
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Dict, List, Optional
import logging

from app.services.gee_client import get_satellite_data, get_multiple_variables
from app.services.ai_model import predict_heat_islands, calculate_vulnerability
from app.services.export_service import export_to_csv, export_to_json, export_to_pdf
from app.utils.cache import get_cached_data, set_cached_data
from app.utils.validators import validate_coordinates, validate_date_range

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Inicializar FastAPI
app = FastAPI(
    title="SOLARIS API",
    description="API para análise climática e previsão de ilhas de calor urbanas",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Vite e CRA
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "online",
        "service": "SOLARIS API",
        "version": "1.0.0",
        "message": "Tornando visível o calor invisível"
    }


@app.get("/api/health")
async def health_check():
    """Endpoint de health check detalhado"""
    return {
        "status": "healthy",
        "services": {
            "api": "operational",
            "gee": "operational",
            "cache": "operational",
            "ai_model": "operational"
        }
    }


@app.post("/api/solaris/fetchData")
async def fetch_satellite_data(params: Dict = Body(...)):
    """
    Buscar dados de satélite do Google Earth Engine
    
    Parâmetros:
    - coords: {lat, lng} ou bounds: {north, south, east, west}
    - variable: Lista de variáveis (LST, NDVI, NDBI, NDWI, POP_DENS, NIGHT_LIGHTS)
    - startDate: Data inicial (YYYY-MM-DD)
    - endDate: Data final (YYYY-MM-DD)
    """
    try:
        # Validar coordenadas
        coords = params.get("coords")
        bounds = params.get("bounds")
        
        if not coords and not bounds:
            raise HTTPException(status_code=400, detail="Forneça coords ou bounds")
        
        # Validar datas
        start_date = params.get("startDate")
        end_date = params.get("endDate")
        
        if start_date and end_date:
            validate_date_range(start_date, end_date)
        
        # Variáveis solicitadas
        variables = params.get("variables", ["LST", "NDVI"])
        
        # Verificar cache
        cache_key = f"satellite_data_{coords or bounds}_{start_date}_{end_date}_{','.join(variables)}"
        cached_data = await get_cached_data(cache_key)
        
        if cached_data:
            logger.info(f"Cache hit para: {cache_key}")
            return JSONResponse(content={"status": "ok", "data": cached_data, "source": "cache"})
        
        # Buscar dados do GEE
        logger.info(f"Buscando dados do GEE para: {variables}")
        radius = params.get("radius")  # Raio em metros (para círculos)
        
        data = await get_multiple_variables(
            coords=coords,
            bounds=bounds,
            radius=radius,
            start_date=start_date,
            end_date=end_date,
            variables=variables
        )
        
        # Cachear resultado
        await set_cached_data(cache_key, data, ttl=3600)
        
        return JSONResponse(content={
            "status": "ok",
            "data": data,
            "source": "gee",
            "variables": variables
        })
        
    except Exception as e:
        logger.error(f"Erro ao buscar dados: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro ao buscar dados: {str(e)}")


@app.post("/api/solaris/predict")
async def predict_heat_islands_endpoint(params: Dict = Body(...)):
    """
    Prever ilhas de calor futuras usando modelo de IA
    
    Parâmetros:
    - data: Dados históricos das variáveis
    - years: Número de anos para prever (padrão: 5)
    """
    try:
        data = params.get("data")
        years = params.get("years", 5)
        
        if not data:
            raise HTTPException(status_code=400, detail="Forneça dados históricos")
        
        # Calcular vulnerabilidade atual
        vulnerability = calculate_vulnerability(data)
        
        # Prever ilhas de calor futuras
        predictions = await predict_heat_islands(data, years=years)
        
        return JSONResponse(content={
            "status": "ok",
            "vulnerability": vulnerability,
            "predictions": predictions,
            "years": years
        })
        
    except Exception as e:
        logger.error(f"Erro ao prever ilhas de calor: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro na predição: {str(e)}")


@app.post("/api/solaris/export")
async def export_data(params: Dict = Body(...)):
    """
    Exportar dados em diferentes formatos
    
    Parâmetros:
    - data: Dados para exportar
    - format: csv, json ou pdf
    - filename: Nome do arquivo (opcional)
    """
    try:
        data = params.get("data")
        export_format = params.get("format", "csv").lower()
        filename = params.get("filename", f"solaris_export.{export_format}")
        
        if not data:
            raise HTTPException(status_code=400, detail="Forneça dados para exportar")
        
        if export_format == "csv":
            content = export_to_csv(data, filename)
            media_type = "text/csv"
        elif export_format == "json":
            content = export_to_json(data, filename)
            media_type = "application/json"
        elif export_format == "pdf":
            content = export_to_pdf(data, filename)
            media_type = "application/pdf"
        else:
            raise HTTPException(status_code=400, detail="Formato não suportado. Use: csv, json ou pdf")
        
        return JSONResponse(
            content={"status": "ok", "filename": filename, "format": export_format},
            media_type=media_type
        )
        
    except Exception as e:
        logger.error(f"Erro ao exportar dados: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro na exportação: {str(e)}")


@app.get("/api/solaris/variables")
async def get_available_variables():
    """Retornar lista de variáveis disponíveis"""
    return {
        "variables": [
            {
                "id": "LST",
                "name": "Land Surface Temperature",
                "description": "Temperatura da superfície terrestre",
                "unit": "°C",
                "source": "MODIS"
            },
            {
                "id": "NDVI",
                "name": "Normalized Difference Vegetation Index",
                "description": "Índice de vegetação",
                "unit": "0-1",
                "source": "Landsat/Sentinel"
            },
            {
                "id": "NDBI",
                "name": "Normalized Difference Built-up Index",
                "description": "Índice de áreas construídas",
                "unit": "0-1",
                "source": "Landsat/Sentinel"
            },
            {
                "id": "NDWI",
                "name": "Normalized Difference Water Index",
                "description": "Índice de água",
                "unit": "0-1",
                "source": "Landsat/Sentinel"
            },
            {
                "id": "POP_DENS",
                "name": "Population Density",
                "description": "Densidade populacional",
                "unit": "pessoas/km²",
                "source": "WorldPop"
            },
            {
                "id": "NIGHT_LIGHTS",
                "name": "Nighttime Lights",
                "description": "Luzes noturnas (proxy de urbanização)",
                "unit": "nW/cm²/sr",
                "source": "VIIRS"
            }
        ]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")

