"""
Sistema de cache usando Redis
"""
import json
from typing import Any, Optional
import logging

logger = logging.getLogger(__name__)

# Cache simples em memória para desenvolvimento
_memory_cache = {}


async def get_cached_data(key: str) -> Optional[Any]:
    """Buscar dado do cache"""
    try:
        # TODO: Implementar Redis em produção
        # redis_client = get_redis_client()
        # data = await redis_client.get(key)
        
        # Por enquanto, usar cache em memória
        if key in _memory_cache:
            logger.info(f"✅ Cache hit: {key}")
            return _memory_cache[key]
        
        return None
        
    except Exception as e:
        logger.error(f"❌ Erro ao buscar cache: {str(e)}")
        return None


async def set_cached_data(key: str, data: Any, ttl: int = 3600) -> bool:
    """Salvar dado no cache"""
    try:
        # TODO: Implementar Redis em produção
        # redis_client = get_redis_client()
        # await redis_client.setex(key, ttl, json.dumps(data))
        
        # Por enquanto, usar cache em memória
        _memory_cache[key] = data
        logger.info(f"✅ Cache set: {key} (TTL: {ttl}s)")
        return True
        
    except Exception as e:
        logger.error(f"❌ Erro ao salvar cache: {str(e)}")
        return False


async def clear_cache(pattern: str = "*") -> bool:
    """Limpar cache"""
    try:
        # TODO: Implementar Redis em produção
        
        # Por enquanto, limpar cache em memória
        if pattern == "*":
            _memory_cache.clear()
        else:
            keys_to_delete = [k for k in _memory_cache.keys() if pattern in k]
            for key in keys_to_delete:
                del _memory_cache[key]
        
        logger.info(f"✅ Cache limpo: {pattern}")
        return True
        
    except Exception as e:
        logger.error(f"❌ Erro ao limpar cache: {str(e)}")
        return False

