# SOLARIS Setup Script - Windows
Write-Host "🌍 SOLARIS - Setup Wizard" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Python
Write-Host "📦 Verificando Python..." -ForegroundColor Yellow
try {
    $pythonVersion = py --version 2>&1
    Write-Host "✅ Python encontrado: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python não encontrado!" -ForegroundColor Red
    Write-Host "💡 Instale Python 3.11+ de: https://www.python.org/downloads/" -ForegroundColor Yellow
    exit 1
}

# Verificar Node.js
Write-Host "📦 Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>&1
    Write-Host "✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js não encontrado!" -ForegroundColor Red
    Write-Host "💡 Instale Node.js 18+ de: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🔧 Instalando dependências do Backend..." -ForegroundColor Yellow
Set-Location backend
py -m pip install --upgrade pip
py -m pip install -r requirements.txt

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backend configurado com sucesso!" -ForegroundColor Green
} else {
    Write-Host "❌ Erro ao instalar dependências do backend" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🔧 Instalando dependências do Frontend..." -ForegroundColor Yellow
Set-Location ../client
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend configurado com sucesso!" -ForegroundColor Green
} else {
    Write-Host "❌ Erro ao instalar dependências do frontend" -ForegroundColor Red
    exit 1
}

Set-Location ..

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "✅ SOLARIS configurado com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Próximos passos:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Autenticar Google Earth Engine:" -ForegroundColor White
Write-Host "   earthengine authenticate" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Iniciar o Backend:" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Cyan
Write-Host "   py -m uvicorn app.main:app --reload" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Iniciar o Frontend (novo terminal):" -ForegroundColor White
Write-Host "   cd client" -ForegroundColor Cyan
Write-Host "   npm start" -ForegroundColor Cyan
Write-Host ""
Write-Host "4. Acessar a aplicação:" -ForegroundColor White
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "   Backend API: http://localhost:8000/api/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌍 Tornando visível o calor invisível!" -ForegroundColor Green

