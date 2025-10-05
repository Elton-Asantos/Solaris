#!/bin/bash

echo "🚀 SOLARIS Platform Setup Script"
echo "================================="

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale Node.js 18+ primeiro."
    exit 1
fi

# Verificar versão do Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js versão 18+ é necessária. Versão atual: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) encontrado"

# Instalar dependências
echo "📦 Instalando dependências..."
npm run install-all

if [ $? -eq 0 ]; then
    echo "✅ Dependências instaladas com sucesso!"
else
    echo "❌ Erro ao instalar dependências"
    exit 1
fi

# Copiar arquivo de ambiente
if [ ! -f ".env.local" ]; then
    echo "📝 Criando arquivo de ambiente..."
    cat > .env.local << EOF
VISUAL_CROSSING_API_KEY=sua_chave_aqui
GEE_API_KEY=sua_chave_aqui
NODE_ENV=development
EOF
    echo "✅ Arquivo .env.local criado. Configure suas chaves de API."
else
    echo "✅ Arquivo .env.local já existe"
fi

echo ""
echo "🎉 Setup concluído com sucesso!"
echo ""
echo "Próximos passos:"
echo "1. Configure suas chaves de API no arquivo .env.local"
echo "2. Execute 'npm run dev' para iniciar o desenvolvimento"
echo "3. Acesse http://localhost:3000"
echo ""
echo "Para deploy:"
echo "1. Configure as variáveis de ambiente no Vercel"
echo "2. Execute 'vercel --prod'"
