import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const DiagnosticsWrapper = styled.div`
  position: fixed;
  top: 80px;
  right: 20px;
  background: rgba(0, 0, 0, 0.95);
  color: #fff;
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  z-index: 10000;
  font-family: 'Courier New', monospace;
  font-size: 11px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
`;

const Title = styled.div`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #ff6b6b;
  border-bottom: 1px solid #333;
  padding-bottom: 10px;
`;

const Section = styled.div`
  margin: 10px 0;
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
`;

const Label = styled.div`
  color: #4ecdc4;
  margin-bottom: 5px;
  font-weight: bold;
`;

const Value = styled.div<{ $status?: 'ok' | 'error' | 'warning' }>`
  color: ${props => 
    props.$status === 'ok' ? '#51cf66' :
    props.$status === 'error' ? '#ff6b6b' :
    props.$status === 'warning' ? '#ffd43b' :
    '#fff'
  };
  margin-left: 10px;
`;

const MapDiagnostics: React.FC = () => {
  const [diagnostics, setDiagnostics] = useState<any>({});

  useEffect(() => {
    const runDiagnostics = () => {
      const results: any = {
        timestamp: new Date().toLocaleTimeString(),
        checks: []
      };

      // 1. Verificar Window
      results.checks.push({
        name: 'Window Object',
        status: typeof window !== 'undefined' ? 'ok' : 'error',
        value: typeof window !== 'undefined' ? 'Disponível' : 'Não encontrado'
      });

      // 2. Verificar Document
      results.checks.push({
        name: 'Document',
        status: typeof document !== 'undefined' ? 'ok' : 'error',
        value: typeof document !== 'undefined' ? 'Disponível' : 'Não encontrado'
      });

      // 3. Verificar Leaflet
      const L = (window as any).L;
      results.checks.push({
        name: 'Leaflet (window.L)',
        status: L ? 'ok' : 'warning',
        value: L ? `Versão ${L.version || 'desconhecida'}` : 'Não carregado'
      });

      // 4. Verificar Google Maps
      const google = (window as any).google;
      results.checks.push({
        name: 'Google Maps (window.google)',
        status: google?.maps ? 'ok' : 'warning',
        value: google?.maps ? 'Carregado' : 'Não carregado'
      });

      // 5. Verificar MapSection
      const mapSection = document.querySelector('[class*="MapSection"]');
      results.checks.push({
        name: 'MapSection Element',
        status: mapSection ? 'ok' : 'error',
        value: mapSection ? `Encontrado (${mapSection.clientWidth}x${mapSection.clientHeight}px)` : 'Não encontrado no DOM'
      });

      // 6. Verificar CSS Variables
      const root = document.documentElement;
      const bgColor = getComputedStyle(root).getPropertyValue('--background-color');
      results.checks.push({
        name: 'CSS Variables',
        status: bgColor ? 'ok' : 'warning',
        value: bgColor ? 'Carregadas' : 'Não encontradas'
      });

      // 7. Verificar React
      results.checks.push({
        name: 'React',
        status: 'ok',
        value: 'Renderizando'
      });

      // 8. Verificar Erros no Console
      const errors = (window as any).__errors || [];
      results.checks.push({
        name: 'Erros no Console',
        status: errors.length > 0 ? 'error' : 'ok',
        value: errors.length > 0 ? `${errors.length} erros` : 'Nenhum erro'
      });

      // 9. Viewport
      results.checks.push({
        name: 'Viewport',
        status: 'ok',
        value: `${window.innerWidth}x${window.innerHeight}px`
      });

      // 10. URL
      results.checks.push({
        name: 'URL',
        status: 'ok',
        value: window.location.pathname
      });

      setDiagnostics(results);
    };

    runDiagnostics();
    const interval = setInterval(runDiagnostics, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <DiagnosticsWrapper>
      <Title>🔍 DIAGNÓSTICO DO MAPA SOLARIS</Title>
      
      <div style={{ marginBottom: '10px', fontSize: '10px', opacity: 0.7 }}>
        Última atualização: {diagnostics.timestamp}
      </div>

      {diagnostics.checks?.map((check: any, index: number) => (
        <Section key={index}>
          <Label>{check.name}</Label>
          <Value $status={check.status}>
            {check.status === 'ok' && '✅ '}
            {check.status === 'error' && '❌ '}
            {check.status === 'warning' && '⚠️ '}
            {check.value}
          </Value>
        </Section>
      ))}

      <div style={{ marginTop: '15px', padding: '10px', background: 'rgba(255, 107, 107, 0.1)', borderRadius: '4px', fontSize: '10px' }}>
        <strong>💡 Dica:</strong> Abra o Console (F12) para mais detalhes!
      </div>
    </DiagnosticsWrapper>
  );
};

export default MapDiagnostics;

