# Iniciar Backend SOLARIS
Write-Host "🚀 Iniciando SOLARIS Backend..." -ForegroundColor Cyan

# Ir para o diretório do script
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Ir para o diretório backend
Set-Location backend

Write-Host "📁 Diretório: $(Get-Location)" -ForegroundColor Yellow
Write-Host "🌍 Backend rodando em: http://localhost:8000" -ForegroundColor Green
Write-Host "📚 Documentação em: http://localhost:8000/api/docs" -ForegroundColor Green
Write-Host ""

py -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

