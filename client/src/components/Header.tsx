import React from 'react';
import styled from 'styled-components';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  onOpenDataAnalysis?: () => void;
}

const HeaderContainer = styled.header`
  background: var(--card-background);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color);
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: var(--shadow);
  min-height: 70px;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const LogoImage = styled.img`
  height: 50px;
  width: auto;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
  
  @media (max-width: 768px) {
    height: 40px;
  }
`;

const NavItems = styled.nav`
  display: flex;
  gap: 2rem;
  align-items: center;
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const NavItem = styled.a`
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;
  position: relative;
  
  &:hover {
    background: var(--background-color);
    transform: translateY(-2px);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 50%;
    width: 0;
    height: 2px;
    background: var(--primary-color);
    transition: all 0.3s ease;
    transform: translateX(-50%);
  }
  
  &:hover::after {
    width: 100%;
  }
`;

const StatusBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--background-color);
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.875rem;
  color: var(--text-color);
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const StatusDot = styled.div`
  width: 0.5rem;
  height: 0.5rem;
  background: #10b981;
  border-radius: 50%;
  animation: pulse 2s infinite;
`;

const ThemeButton = styled.button`
  background: var(--background-color);
  border: none;
  color: var(--text-color);
  padding: 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: var(--primary-color);
    color: white;
    transform: scale(1.1);
  }
`;

const Header: React.FC<HeaderProps> = ({ onOpenDataAnalysis }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <HeaderContainer>
      <Logo>
        <LogoImage 
          src={theme === 'dark' ? '/solaris-logo-dark.svg' : '/solaris-logo-light.svg'}
          alt="SOLARIS Logo"
        />
      </Logo>
      
      <NavItems>
        <NavItem href="#selecao">Seleção de Área</NavItem>
        <NavItem 
          as="button" 
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer',
            font: 'inherit'
          }}
          onClick={() => onOpenDataAnalysis && onOpenDataAnalysis()}
        >
          Análise de Dados
        </NavItem>
        
        <StatusBadge>
          <StatusDot />
          <span>Online</span>
        </StatusBadge>
        
        <ThemeButton onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </ThemeButton>
      </NavItems>
    </HeaderContainer>
  );
};

export default Header;