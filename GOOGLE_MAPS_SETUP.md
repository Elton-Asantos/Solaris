# 🌍 Configuração do Google Maps - SOLARIS

## ✅ STATUS: Componente ativo e aguardando API Key

---

## 📋 PASSO A PASSO COMPLETO

### **PASSO 1: Acessar Google Cloud Console**

🔗 **Link direto:** https://console.cloud.google.com/google/maps-apis/start

1. Faça login com sua conta Google
2. Se não tiver projeto, clique em "Criar projeto"
   - Nome sugerido: `SOLARIS` ou `solaris-climate`
   - Clique em "Criar"

---

### **PASSO 2: Ativar a Maps JavaScript API**

1. No console, clique em **"Ativar APIs e serviços"**
2. Na barra de pesquisa, digite: **"Maps JavaScript API"**
3. Clique na API encontrada
4. Clique no botão **"Ativar"**
5. Aguarde alguns segundos

---

### **PASSO 3: Criar API Key**

1. No menu lateral esquerdo, vá em:
   ```
   APIs e serviços → Credenciais
   ```

2. No topo da página, clique em:
   ```
   + Criar credenciais → Chave de API
   ```

3. Uma janela popup aparecerá mostrando sua chave:
   ```
   AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```

4. **COPIE A CHAVE** (clique no ícone de copiar)

---

### **PASSO 4: (OPCIONAL) Restringir a chave**

**⚠️ Recomendado para segurança:**

1. Ainda na janela da chave, clique em **"Restringir chave"**
2. Em "Restrições de aplicativo", selecione:
   ```
   Referenciadores HTTP (sites da Web)
   ```
3. Clique em **"Adicionar item"** e adicione:
   ```
   http://localhost:3000/*
   http://localhost:3000
   ```
4. Se for fazer deploy, adicione também:
   ```
   https://seu-dominio.com/*
   ```
5. Clique em **"Salvar"**

---

### **PASSO 5: Configurar no SOLARIS**

#### **Opção A: Editar arquivo de configuração (RECOMENDADO)**

1. Abra o arquivo:
   ```
   client/src/config/maps.config.ts
   ```

2. Na linha 13, substitua `YOUR_GOOGLE_MAPS_API_KEY` pela sua chave:
   ```typescript
   export const GOOGLE_MAPS_API_KEY = 'AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
   ```

3. Salve o arquivo (Ctrl+S ou Cmd+S)

#### **Opção B: Me enviar a chave**

Se preferir, me envie a chave assim:
```
minha api key: AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

E eu configuro para você!

---

### **PASSO 6: Verificar funcionamento**

1. O frontend vai recompilar automaticamente
2. Acesse: http://localhost:3000
3. Você verá o **Google Maps** com:
   - ✅ Mapa híbrido (satélite + ruas)
   - ✅ Controles de tipo de mapa
   - ✅ Ferramentas de desenho
   - ✅ Marcador no centro do Brasil
   - ✅ Zoom e navegação

---

## 🎯 O QUE VOCÊ VAI VER

### **SEM API Key (estado atual):**
```
┌─────────────────────────────────────┐
│ 🔑 API Key do Google Maps não       │
│    configurada                      │
│                                     │
│ Para usar o Google Maps, você      │
│ precisa configurar uma API Key.    │
│                                     │
│ Passo a passo:                     │
│ 1. Acesse: Google Cloud Console    │
│ 2. Ative a Maps JavaScript API     │
│ 3. Crie uma Chave de API           │
│ 4. Cole em: maps.config.ts         │
│                                     │
│ 💡 Plano gratuito: $200/mês        │
└─────────────────────────────────────┘
```

### **COM API Key configurada:**
```
┌─────────────────────────────────────┐
│ 🗺️ Google Maps - SOLARIS            │
│ ✅ Mapa criado                       │
│ ✅ Tile layer adicionado            │
│ ✅ Ferramentas de desenho           │
│                                     │
│  [Mapa interativo do Google Maps]  │
│  - Vista híbrida (satélite+ruas)   │
│  - Controles de zoom               │
│  - Ferramentas de seleção          │
│  - Marcador no centro do Brasil    │
└─────────────────────────────────────┘
```

---

## 💰 LIMITES E PREÇOS

### **Plano Gratuito (sempre gratuito):**
- ✅ **$200 em créditos por mês**
- ✅ Aproximadamente **28.000 carregamentos de mapa/mês**
- ✅ Sem necessidade de cartão de crédito para começar
- ✅ Suficiente para desenvolvimento e projetos pequenos

### **Cálculo:**
- 1 carregamento de mapa = $0.007
- $200 ÷ $0.007 = ~28.571 carregamentos
- **Mais do que suficiente para SOLARIS!**

---

## 🔒 SEGURANÇA

### **Restrições recomendadas:**

1. **Referenciadores HTTP:**
   ```
   http://localhost:3000/*
   https://seu-dominio.com/*
   ```

2. **Restrição de API:**
   - Apenas "Maps JavaScript API"
   - Não deixe "Nenhuma restrição"

### **⚠️ IMPORTANTE:**
- Nunca compartilhe sua API Key publicamente
- Não faça commit da key no GitHub (use .gitignore)
- Se expor por acidente, revogue e crie uma nova

---

## 🚀 VANTAGENS DO GOOGLE MAPS PARA SOLARIS

✅ **Integração perfeita com Google Earth Engine**
- Mesma plataforma, mesma API
- Facilita visualização de dados do GEE
- Autenticação unificada

✅ **APIs ricas:**
- Drawing Manager para seleção de áreas
- Heatmap Layer nativo
- Múltiplos tipos de mapa (roadmap, satellite, hybrid, terrain)
- Places API (opcional)

✅ **Confiabilidade:**
- Infraestrutura do Google
- Uptime excelente
- Suporte enterprise

---

## 🔄 VOLTAR PARA LEAFLET

Se quiser voltar para o Leaflet Debug:

1. Abra: `client/src/App.tsx`
2. Linha 27, mude para:
   ```typescript
   const MAP_LIBRARY = 'leaflet-debug';
   ```
3. Salve e pronto!

---

## 📞 PROBLEMAS COMUNS

### **Erro: "This page can't load Google Maps correctly"**
- ✅ Verifique se a API Key está correta
- ✅ Verifique se a Maps JavaScript API está ativada
- ✅ Aguarde alguns minutos (propagação das configurações)

### **Mapa aparece cinza:**
- ✅ Verifique as restrições da API Key
- ✅ Certifique-se de que `localhost:3000` está nas restrições
- ✅ Limpe o cache do navegador (Ctrl+Shift+Delete)

### **Erro de billing:**
- ✅ Google pode pedir para ativar faturamento
- ✅ Não se preocupe: $200 gratuitos por mês
- ✅ Não será cobrado a menos que ultrapasse

---

## ✨ PRÓXIMOS PASSOS

Depois de configurar o Google Maps:

1. ✅ Testar seleção de áreas (retângulo, círculo, polígono)
2. ✅ Integrar com backend FastAPI
3. ✅ Visualizar dados do Google Earth Engine no mapa
4. ✅ Adicionar heatmaps de dados climáticos
5. ✅ Implementar análise preditiva

---

**🌍 Configuração do Google Maps concluída!**

Acesse agora: http://localhost:3000

Se tiver dúvidas ou precisar de ajuda, me avise! 🚀


