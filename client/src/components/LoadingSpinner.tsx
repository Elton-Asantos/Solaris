import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Cloud } from 'lucide-react';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--card-background);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border-color);
`;

const CloudIcon = styled.div`
  width: 64px;
  height: 64px;
  background: linear-gradient(45deg, var(--primary-color), var(--color-max));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 1rem;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid var(--border-color);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 1rem;
`;

const LoadingText = styled.div`
  font-size: 1.125rem;
  font-weight: 500;
  color: var(--text-color);
  text-align: center;
`;

const LoadingSubtext = styled.div`
  font-size: 0.875rem;
  color: var(--text-color);
  text-align: center;
  margin-top: 8px;
  opacity: 0.7;
`;

const ProgressBar = styled.div`
  width: 200px;
  height: 4px;
  background: var(--border-color);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 16px;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color), var(--color-max));
  border-radius: 2px;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const LoadingSpinner: React.FC = () => {
  return (
    <LoadingOverlay>
      <SpinnerContainer>
        <CloudIcon>
          <Cloud size={48} />
        </CloudIcon>
        <Spinner />
        <LoadingText>Processando dados climáticos...</LoadingText>
        <LoadingSubtext>
          Buscando informações de satélite e APIs meteorológicas
        </LoadingSubtext>
        <ProgressBar>
          <ProgressFill />
        </ProgressBar>
      </SpinnerContainer>
    </LoadingOverlay>
  );
};

export default LoadingSpinner;