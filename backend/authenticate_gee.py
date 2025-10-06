"""
Script para autenticar Google Earth Engine
Execute este script para autenticar sua conta GEE
"""
import ee

print("=" * 60)
print("🌍 SOLARIS - Autenticação Google Earth Engine")
print("=" * 60)
print()

try:
    # Tentar autenticação
    print("1️⃣ Tentando autenticar...")
    ee.Authenticate()
    
    print("2️⃣ Inicializando Earth Engine...")
    ee.Initialize()
    
    print()
    print("✅ SUCESSO! Google Earth Engine autenticado!")
    print()
    print("Testando acesso...")
    
    # Teste simples
    image = ee.Image('MODIS/006/MOD11A2/2023_01_01')
    info = image.getInfo()
    
    print(f"✅ Acesso ao GEE confirmado!")
    print(f"📊 Dataset de teste: {info['id']}")
    print()
    print("=" * 60)
    print("🎉 Você está pronto para usar o SOLARIS!")
    print("=" * 60)
    
except Exception as e:
    print(f"❌ Erro na autenticação: {str(e)}")
    print()
    print("💡 Siga estes passos:")
    print("1. Crie uma conta em: https://earthengine.google.com/")
    print("2. Execute: earthengine authenticate")
    print("3. Siga as instruções no navegador")
    print("4. Execute este script novamente")
    print()

