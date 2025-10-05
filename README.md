# SOLARIS

Plataforma de análise climática e predição de ilhas de calor urbano.

## 🚀 Funcionalidades

- **Análise de Dados Climáticos**: Visualização de dados de satélite em tempo real
- **Predição de Ilhas de Calor**: Algoritmos de machine learning para análise preditiva
- **Dashboard Interativo**: Interface moderna e responsiva
- **Seleção de Áreas**: Suporte a pontos, círculos e retângulos
- **Temas**: Modo claro e escuro
- **Exportação de Dados**: Download em CSV e JSON

## 🛠️ Tecnologias

- **Frontend**: React, TypeScript, Leaflet, Styled Components
- **Backend**: Node.js, Express
- **Deploy**: Vercel
- **APIs**: Visual Crossing, Google Earth Engine

## 📦 Instalação

```bash
# Clonar repositório
git clone https://github.com/seu-usuario/solaris.git
cd solaris

# Instalar dependências
npm run install-all

# Configurar variáveis de ambiente
cp .env.example .env.local
# Editar .env.local com suas chaves de API

# Executar em desenvolvimento
npm run dev
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Executa em modo desenvolvimento
- `npm run build` - Gera build de produção
- `npm run install-all` - Instala todas as dependências
- `npm run build:all` - Build completo do projeto

## 🌍 Variáveis de Ambiente

```env
VISUAL_CROSSING_API_KEY=sua_chave_aqui
GEE_API_KEY=sua_chave_aqui
NODE_ENV=production
```

## 📱 Uso

1. **Selecionar Área**: Use as ferramentas de seleção no mapa
2. **Configurar Parâmetros**: Defina período e variáveis
3. **Analisar Dados**: Clique em "Analisar Área"
4. **Visualizar Resultados**: Explore o dashboard de análise
5. **Exportar Dados**: Baixe os resultados em CSV/JSON

## 🎨 Temas

- **Modo Escuro**: Interface otimizada para análise noturna
- **Modo Claro**: Interface clara para uso diurno
- **Alternância**: Botão no header para trocar temas

## 📊 Tipos de Análise

### Seleção de Área
- **Ponto**: Análise em coordenada específica
- **Círculo**: Análise em raio definido
- **Retângulo**: Análise em área retangular

### Variáveis Climáticas
- **LST**: Temperatura da Superfície Terrestre
- **NDVI**: Índice de Vegetação
- **Albedo**: Refletividade da superfície
- **Umidade**: Conteúdo de umidade

## 🔮 Análise Preditiva

- **Vulnerabilidade Atual**: Risco presente de ilha de calor
- **Projeção Futura**: Tendências para próximos anos
- **Fatores de Risco**: Temperatura, vegetação, construção, população
- **Recomendações**: Sugestões baseadas em dados

## 📈 Dashboard

- **Métricas Principais**: Indicadores-chave de risco
- **Análise Temporal**: Evolução ao longo do tempo
- **Fatores de Influência**: Contribuição de cada variável
- **Recomendações Inteligentes**: Sugestões personalizadas

## 🚀 Deploy

### Vercel
```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Configurar variáveis
vercel env add VISUAL_CROSSING_API_KEY
vercel env add GEE_API_KEY
vercel env add NODE_ENV

# Deploy
vercel --prod
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Contato

- **Email**: suporte@solaris.com
- **GitHub**: [@solaris-team](https://github.com/solaris-team)

---

**SOLARIS** - Transformando dados climáticos em insights acionáveis 🌍📊
