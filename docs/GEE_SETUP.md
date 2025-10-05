# 🌍 Configuração do Google Earth Engine

## 📋 Pré-requisitos

1. **Conta Google** com acesso ao Google Earth Engine
2. **Projeto Google Cloud** (pode ser o mesmo usado para autenticação)
3. **Cliente OAuth2** configurado (já criado)

## 🔑 Configuração da Autenticação

### 1. **Instalar Google Earth Engine CLI**

```bash
# Instalar via pip
pip install earthengine-api

# Ou via conda
conda install -c conda-forge earthengine-api
```

### 2. **Autenticação**

#### **Opção A: Modo Local (Recomendado)**
```bash
# Autenticação local
earthengine authenticate
```

#### **Opção B: Modo Notebook (Para ambientes remotos)**
```bash
# Autenticação via notebook
earthengine authenticate --auth_mode=notebook
```

#### **Opção C: Modo GCloud (Se gcloud estiver instalado)**
```bash
# Autenticação via gcloud
earthengine authenticate --auth_mode=gcloud
```

### 3. **Configurar Projeto**

```bash
# Definir projeto padrão
earthengine set_project SEU_PROJETO_ID

# Ou definir para cada execução
earthengine authenticate --project=SEU_PROJETO_ID
```

## 🔧 Configuração no SOLARIS

### 1. **Variáveis de Ambiente**

Crie um arquivo `.env` na pasta `server/`:

```env
# Google Earth Engine
GEE_ACCESS_TOKEN=seu_token_aqui

# Visual Crossing
VISUAL_CROSSING_API_KEY=sua_chave_aqui

# Configurações do servidor
NODE_ENV=development
PORT=5000
```

### 2. **Obter Token de Acesso**

Após a autenticação, o token será salvo em:
- **Windows**: `%USERPROFILE%\.config\earthengine\credentials`
- **Linux/Mac**: `~/.config/earthengine/credentials`

### 3. **Testar Configuração**

```bash
# Testar autenticação
earthengine authenticate --force

# Verificar projeto
earthengine set_project SEU_PROJETO_ID

# Testar API
python -c "import ee; ee.Initialize(); print('GEE configurado com sucesso!')"
```

## 🚀 Integração com SOLARIS

### **Fluxo de Autenticação:**

1. **Usuário acessa** `/auth/google`
2. **Redirecionamento** para Google OAuth
3. **Callback** em `/auth/google/callback`
4. **Token salvo** no cache do servidor
5. **Dados obtidos** via Google Earth Engine API

### **APIs Disponíveis:**

- **LST**: Temperatura da superfície terrestre
- **NDVI**: Índice de vegetação
- **NDBI**: Índice de construção
- **NDWI**: Índice de água
- **População**: Densidade populacional
- **Luzes noturnas**: Intensidade de luz

## 🔍 Solução de Problemas

### **Erro: "API Earth Engine não ativada"**
```bash
# Ativar API no Google Cloud Console
# Ou usar projeto com API já ativada
earthengine set_project PROJETO_COM_API_ATIVADA
```

### **Erro: "Cliente OAuth2 incompatível"**
- Use um projeto diferente para autenticação
- Ou use modo `gcloud` ou `localhost`

### **Erro: "Token expirado"**
```bash
# Renovar autenticação
earthengine authenticate --force
```

## 📚 Recursos Adicionais

- [Documentação Oficial GEE](https://developers.google.com/earth-engine)
- [Guia de Autenticação](https://developers.google.com/earth-engine/guides/auth)
- [API Reference](https://developers.google.com/earth-engine/apidocs)

## 🎯 Próximos Passos

1. **Configure** a autenticação GEE
2. **Teste** a integração
3. **Configure** as variáveis de ambiente
4. **Execute** `npm run dev`
5. **Teste** a funcionalidade no frontend

**A integração com Google Earth Engine está pronta para uso!** 🚀🌍
