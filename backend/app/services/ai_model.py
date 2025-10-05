"""
Modelo de IA para previsão de ilhas de calor
"""
import numpy as np
from typing import Dict, List


def calculate_vulnerability(data: Dict) -> Dict:
    """
    Calcular vulnerabilidade atual a ilhas de calor
    
    Baseado em:
    - Temperatura alta (LST)
    - Baixa vegetação (NDVI)
    - Alta construção (NDBI)
    - Baixa água (NDWI)
    - Alta densidade populacional
    """
    factors = {}
    
    # LST: temperatura alta = maior risco
    if 'lst' in data:
        lst_values = [p['value'] for p in data['lst']]
        lst_avg = np.mean(lst_values)
        factors['temperature'] = min(100, (lst_avg / 45) * 100)
    
    # NDVI: vegetação baixa = maior risco
    if 'ndvi' in data:
        ndvi_values = [p['value'] for p in data['ndvi']]
        ndvi_avg = np.mean(ndvi_values)
        factors['vegetation'] = (1 - ndvi_avg) * 100
    
    # NDBI: construção alta = maior risco
    if 'ndbi' in data:
        ndbi_values = [p['value'] for p in data['ndbi']]
        ndbi_avg = np.mean(ndbi_values)
        factors['construction'] = (ndbi_avg + 0.2) / 1.0 * 100
    
    # NDWI: água baixa = maior risco
    if 'ndwi' in data:
        ndwi_values = [p['value'] for p in data['ndwi']]
        ndwi_avg = np.mean(ndwi_values)
        factors['water'] = (1 - ((ndwi_avg + 0.5) / 1.0)) * 100
    
    # População: densidade alta = maior risco
    if 'popDens' in data:
        pop_values = [p['value'] for p in data['popDens']]
        pop_avg = np.mean(pop_values)
        factors['population'] = min(100, (pop_avg / 10000) * 100)
    
    # Calcular risco total (média ponderada)
    weights = {
        'temperature': 0.30,
        'vegetation': 0.25,
        'construction': 0.20,
        'water': 0.15,
        'population': 0.10
    }
    
    current_risk = sum(
        factors.get(key, 0) * weight
        for key, weight in weights.items()
    )
    
    return {
        'currentRisk': round(current_risk, 2),
        'factors': {k: round(v, 2) for k, v in factors.items()},
        'level': 'high' if current_risk > 70 else 'medium' if current_risk > 40 else 'low'
    }


async def predict_heat_islands(data: Dict, years: int = 5) -> List[Dict]:
    """
    Prever ilhas de calor futuras
    
    Modelo simplificado que considera tendências de:
    - Aumento de temperatura (LST)
    - Redução de vegetação (NDVI)
    - Aumento de construção (NDBI)
    """
    predictions = []
    
    # Calcular vulnerabilidade atual
    current = calculate_vulnerability(data)
    base_risk = current['currentRisk']
    
    # Projetar anos futuros
    for i in range(1, years + 1):
        # Tendência de aumento: ~2% ao ano
        future_risk = base_risk * (1 + 0.02 * i)
        
        # Limitar a 100
        future_risk = min(100, future_risk)
        
        predictions.append({
            'year': 2024 + i,
            'risk': round(future_risk, 2),
            'timeframe': f'Ano {2024 + i}',
            'value': round(future_risk, 2)
        })
    
    return predictions


async def generate_recommendations(vulnerability: Dict) -> List[str]:
    """Gerar recomendações baseadas na vulnerabilidade"""
    recommendations = []
    
    factors = vulnerability.get('factors', {})
    
    if factors.get('temperature', 0) > 70:
        recommendations.append("🌡️ Implementar corredores verdes para reduzir temperatura")
    
    if factors.get('vegetation', 0) > 70:
        recommendations.append("🌳 Aumentar cobertura vegetal urbana (parques, arborização)")
    
    if factors.get('construction', 0) > 70:
        recommendations.append("🏗️ Promover telhados verdes e pavimentos permeáveis")
    
    if factors.get('water', 0) > 70:
        recommendations.append("💧 Criar áreas de retenção de água e espelhos d'água")
    
    if factors.get('population', 0) > 70:
        recommendations.append("👥 Priorizar áreas de alta densidade para intervenções")
    
    return recommendations

