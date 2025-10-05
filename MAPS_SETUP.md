# 🗺️ Guia de Configuração de Mapas - SOLARIS

## 📋 Visão Geral

O SOLARIS suporta **4 bibliotecas de mapas diferentes**. Escolha a que melhor se adequa ao seu projeto!

---

## 🍃 Opção 1: Leaflet Puro (Debug) - **ATIVO AGORA**

### Status: ✅ **PRONTO PARA USO**

**Prós:**
- ✅ Funciona sem configuração adicional
- ✅ Sem necessidade de API keys
- ✅ Logs de debug em tempo real
- ✅ Leve e rápido

**Contras:**
- ⚠️ Visual básico
- ⚠️ Menos recursos visuais

### Como usar:
No arquivo `client/src/App.tsx`, linha 27:
```typescript
const MAP_LIBRARY = 'leaflet-debug';
```

**Nenhuma configuração adicional necessária!**

---

## 🍃 Opção 2: React-Leaflet - **CONFIGURADO**

### Status: ⚠️ **REQUER FIX**

**Prós:**
- ✅ Integração React nativa
- ✅ Sem necessidade de API keys
- ✅ Comunidade grande

**Contras:**
- ⚠️ Alguns problemas de compatibilidade
- ⚠️ Menos recursos visuais que Mapbox

### Como usar:
No arquivo `client/src/App.tsx`, linha 27:
```typescript
const MAP_LIBRARY = 'leaflet-react';
```

---

## 🗺️ Opção 3: Mapbox GL JS - **RECOMENDADO PARA PRODUÇÃO**

### Status: ⚠️ **REQUER TOKEN**

**Prós:**
- ✅ **VISUAL INCRÍVEL** 
- ✅ Mapas 3D e visualizações modernas
- ✅ Heatmaps nativos perfeitos
- ✅ Performance excelente
- ✅ Perfeito para SOLARIS

**Contras:**
- ⚠️ Requer token de acesso (gratuito até 50k carregamentos/mês)

### Como configurar:

1. **Criar conta gratuita em Mapbox:**
   - Acesse: https://account.mapbox.com/auth/signup/
   - Cadastre-se (é gratuito!)

2. **Obter seu token:**
   - Acesse: https://account.mapbox.com/access-tokens/
   - Copie seu **Default public token**

3. **Configurar no SOLARIS:**
   - Abra: `client/src/components/MapboxMap.tsx`
   - Linha 38, substitua:
   ```typescript
   const MAPBOX_TOKEN = 'SEU_TOKEN_AQUI';
   ```

4. **Ativar no App:**
   - Abra: `client/src/App.tsx`
   - Linha 27, mude para:
   ```typescript
   const MAP_LIBRARY = 'mapbox';
   ```

### Limites gratuitos:
- 50.000 carregamentos de mapa/mês
- 100.000 tiles/mês
- **Suficiente para desenvolvimento e pequenos projetos!**

---

## 🌍 Opção 4: Google Maps - **INTEGRAÇÃO PERFEITA COM GEE**

### Status: ⚠️ **REQUER API KEY**

**Prós:**
- ✅ Mesma API do Google Earth Engine
- ✅ Integração perfeita para dados de satélite
- ✅ API rica e madura
- ✅ Suporte para múltiplos tipos de mapa

**Contras:**
- ⚠️ Requer API Key do Google
- ⚠️ Limite de uso gratuito ($200/mês de créditos)

### Como configurar:

1. **Criar/Ativar projeto no Google Cloud:**
   - Acesse: https://console.cloud.google.com/
   - Crie um novo projeto ou use o mesmo do GEE

2. **Ativar APIs necessárias:**
   - Maps JavaScript API
   - Places API (opcional)
   - Geocoding API (opcional)

3. **Criar API Key:**
   - Acesse: https://console.cloud.google.com/apis/credentials
   - Clique em "Criar credenciais" → "Chave de API"
   - Copie a chave criada

4. **Configurar no SOLARIS:**
   - Abra: `client/src/components/GoogleMapComponent.tsx`
   - Linha 35, substitua:
   ```typescript
   const GOOGLE_MAPS_API_KEY = 'SUA_API_KEY_AQUI';
   ```

5. **Ativar no App:**
   - Abra: `client/src/App.tsx`
   - Linha 27, mude para:
   ```typescript
   const MAP_LIBRARY = 'google';
   ```

### Limites gratuitos:
- $200 em créditos gratuitos por mês
- Aproximadamente 28.000 carregamentos de mapa/mês
- **Suficiente para desenvolvimento!**

---

## 🎯 Qual escolher?

### Para **desenvolvimento imediato**:
```typescript
const MAP_LIBRARY = 'leaflet-debug'; // ✅ JÁ FUNCIONA!
```

### Para **produção com visual profissional**:
```typescript
const MAP_LIBRARY = 'mapbox'; // 🎨 Configure o token
```

### Para **integração total com Google Earth Engine**:
```typescript
const MAP_LIBRARY = 'google'; // 🌍 Configure a API Key
```

---

## 🔧 Instalação de Dependências

Todas as dependências já foram instaladas! ✅

```bash
# Leaflet - já instalado
✅ leaflet
✅ react-leaflet

# Mapbox - já instalado
✅ mapbox-gl
✅ react-map-gl

# Google Maps - não requer instalação (CDN)
✅ Carregado dinamicamente
```

---

## 🚀 Próximos Passos

1. **Teste o Leaflet Debug agora:**
   - Abra: http://localhost:3000
   - Veja o painel de debug no canto superior esquerdo
   - O mapa deve aparecer!

2. **Escolha a biblioteca final:**
   - Se Leaflet funcionar: mantenha ou migre para Mapbox
   - Configure tokens/keys se necessário

3. **Implemente funcionalidades:**
   - Seleção de áreas (retângulo, círculo, polígono)
   - Heatmaps de dados climáticos
   - Integração com backend FastAPI
   - Visualização de dados do GEE

---

## 📞 Suporte

- **Leaflet:** https://leafletjs.com/
- **Mapbox:** https://docs.mapbox.com/mapbox-gl-js/
- **Google Maps:** https://developers.google.com/maps/documentation/javascript

---

**🌍 SOLARIS - Tornando visível o calor invisível** ✨

