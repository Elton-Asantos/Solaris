# 🌍 SOLARIS - Plataforma de Inteligência Climática

<div align="center">

**Tornando visível o calor invisível**

[![Python](https://img.shields.io/badge/Python-3.11-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-green.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Google Earth Engine](https://img.shields.io/badge/Google%20Earth%20Engine-Integrated-orange.svg)](https://earthengine.google.com/)

</div>

---

## 📖 Sobre o Projeto

**SOLARIS** é uma plataforma de Inteligência Artificial climática capaz de mapear e prever ilhas de calor urbanas a partir de dados de satélite processados pelo **Google Earth Engine (GEE)**.

### 🎯 Objetivo

Unir **ciência de dados**, **sensoriamento remoto** e **justiça climática** para tornar dados complexos em insights estratégicos acessíveis via dashboards, mapas interativos e exportações.

### 🔬 Variáveis Analisadas

- **LST** - Land Surface Temperature (Temperatura da Superfície)
- **NDVI** - Normalized Difference Vegetation Index (Índice de Vegetação)
- **NDBI** - Normalized Difference Built-up Index (Índice de Áreas Construídas)
- **NDWI** - Normalized Difference Water Index (Índice de Água)
- **POP_DENS** - População Densidade
- **NIGHT_LIGHTS** - Luzes Noturnas (proxy de urbanização)

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                     Frontend (React + TypeScript)               │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                │
│  │ Map Viewer │  │ Dashboard  │  │  Exports   │                │
│  └────────────┘  └────────────┘  └────────────┘                │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ REST API
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend (FastAPI + Python)                   │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                │
│  │ API Gateway│  │    Cache   │  │  AI Model  │                │
│  └────────────┘  └────────────┘  └────────────┘                │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ GEE SDK
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│              Microsserviço Google Earth Engine                  │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                │
│  │   OAuth2   │  │  Satellite │  │  GeoJSON   │                │
│  └────────────┘  └────────────┘  └────────────┘                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Pré-requisitos

- Python 3.11+
- Node.js 18+
- Google Earth Engine Account ([Registrar aqui](https://earthengine.google.com/))

### 1. Clonar Repositório

```bash
git clone https://github.com/seu-usuario/solaris.git
cd solaris
```

### 2. Configurar Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Autenticar Google Earth Engine

```bash
earthengine authenticate
```

### 4. Configurar Frontend

```bash
cd client
npm install
```

### 5. Iniciar Aplicação

**Terminal 1 - Backend:**
```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

**Acesse:** http://localhost:3000

---

## 📁 Estrutura do Projeto

```
solaris/
├── backend/                    # Backend FastAPI
│   ├── app/
│   │   ├── main.py            # Aplicação principal
│   │   ├── routes/            # Endpoints da API
│   │   ├── services/          # Lógica de negócio
│   │   │   ├── gee_client.py  # Cliente GEE
│   │   │   ├── ai_model.py    # Modelo de IA
│   │   │   └── export_service.py
│   │   └── utils/             # Utilitários
│   │       ├── cache.py       # Sistema de cache
│   │       └── validators.py  # Validadores
│   └── requirements.txt
│
├── services/                   # Microsserviços
│   └── gee/                   # Google Earth Engine
│       └── gee_connector.py
│
├── client/                     # Frontend React
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.tsx
│   └── package.json
│
├── docs/                       # Documentação
└── README.md
```

---

## 🔌 API Endpoints

### 📊 Buscar Dados de Satélite

```http
POST /api/solaris/fetchData
Content-Type: application/json

{
  "coords": {"lat": -15.7801, "lng": -47.9292},
  "variables": ["LST", "NDVI", "NDBI"],
  "startDate": "2024-01-01",
  "endDate": "2024-12-31"
}
```

### 🤖 Prever Ilhas de Calor

```http
POST /api/solaris/predict
Content-Type: application/json

{
  "data": { ... },
  "years": 5
}
```

### 📥 Exportar Dados

```http
POST /api/solaris/export
Content-Type: application/json

{
  "data": { ... },
  "format": "pdf",
  "filename": "relatorio_solaris.pdf"
}
```

---

## 🧪 Desenvolvimento

### Testes

```bash
# Backend
cd backend
pytest

# Frontend
cd client
npm test
```

### Linting

```bash
# Backend
cd backend
flake8 app/
black app/

# Frontend
cd client
npm run lint
```

---

## 🌟 Features

- ✅ Mapa interativo com Leaflet
- ✅ Seleção de área (ponto, retângulo, círculo)
- ✅ Visualização de heatmaps por variável
- ✅ Integração real com Google Earth Engine
- ✅ Modelo de IA para previsão de ilhas de calor
- ✅ Cálculo de vulnerabilidade socioambiental
- ✅ Exportação em CSV, JSON e PDF
- ✅ Cache inteligente para performance
- ✅ Dashboard com estatísticas
- ✅ API REST completa e documentada

---

## 📈 Performance

- **Cache Redis** para evitar requisições repetidas
- **Debounce** em seleções no mapa
- **Lazy loading** de heatmaps
- **Compressão gzip** para respostas grandes
- **Background tasks** com Celery

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, leia o [CONTRIBUTING.md](CONTRIBUTING.md) para detalhes.

---

## 📄 Licença

Este projeto está licenciado sob a MIT License - veja [LICENSE](LICENSE) para detalhes.

---

## 👥 Autores

- **Equipe SOLARIS** - [GitHub](https://github.com/solaris-team)

---

## 🙏 Agradecimentos

- Google Earth Engine pela infraestrutura de dados de satélite
- FastAPI pela excelente framework
- React pela biblioteca frontend
- Comunidade open source

---

<div align="center">

**🌍 SOLARIS - Tornando visível o calor invisível**

Made with ❤️ for a cooler planet

</div>
