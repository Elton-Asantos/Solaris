# SOLARIS Platform Setup Script for Windows
Write-Host "🚀 SOLARIS Platform Setup Script" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Verificar se Node.js está instalado
try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js $nodeVersion encontrado" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js não encontrado. Por favor, instale Node.js 18+ primeiro." -ForegroundColor Red
    exit 1
}

# Verificar versão do Node.js
$version = (node -v).Substring(1).Split('.')[0]
if ([int]$version -lt 18) {
    Write-Host "❌ Node.js versão 18+ é necessária. Versão atual: $(node -v)" -ForegroundColor Red
    exit 1
}

# Instalar dependências
Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
npm run install-all

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependências instaladas com sucesso!" -ForegroundColor Green
} else {
    Write-Host "❌ Erro ao instalar dependências" -ForegroundColor Red
    exit 1
}

# Copiar arquivo de ambiente
if (!(Test-Path ".env.local")) {
    Write-Host "📝 Criando arquivo de ambiente..." -ForegroundColor Yellow
    @"
VISUAL_CROSSING_API_KEY=sua_chave_aqui
GEE_API_KEY=sua_chave_aqui
NODE_ENV=development
"@ | Out-File -FilePath ".env.local" -Encoding UTF8
    Write-Host "✅ Arquivo .env.local criado. Configure suas chaves de API." -ForegroundColor Green
} else {
    Write-Host "✅ Arquivo .env.local já existe" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Setup concluído com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Configure suas chaves de API no arquivo .env.local" -ForegroundColor White
Write-Host "2. Execute 'npm run dev' para iniciar o desenvolvimento" -ForegroundColor White
Write-Host "3. Acesse http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Para deploy:" -ForegroundColor Cyan
Write-Host "1. Configure as variáveis de ambiente no Vercel" -ForegroundColor White
Write-Host "2. Execute 'vercel --prod'" -ForegroundColor White
