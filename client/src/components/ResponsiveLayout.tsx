import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Menu, X } from 'lucide-react';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  isMobile: boolean;
}

const LayoutContainer = styled.div<{ $isMobile: boolean }>`
  display: flex;
  height: 100%;
  width: 100%;
  
  ${props => props.$isMobile ? `
    flex-direction: column;
  ` : `
    flex-direction: row;
  `}
`;

const MobileHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: var(--card-background);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow);
`;

const MobileToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--color-max);
    transform: translateY(-1px);
  }
`;

const SidebarOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
`;

const SidebarContainer = styled.div<{ $isOpen: boolean; $isMobile: boolean }>`
  background: var(--card-background);
  height: 100%;
  overflow-y: auto;
  transition: transform 0.3s ease;
  
  ${props => props.$isMobile ? `
    position: fixed;
    top: 0;
    right: 0;
    width: 100%;
    max-width: 400px;
    z-index: 1000;
    transform: ${props.$isOpen ? 'translateX(0)' : 'translateX(100%)'};
    box-shadow: -4px 0 20px rgba(0, 0, 0, 0.3);
  ` : `
    width: 420px;
    min-width: 420px;
    max-width: 420px;
    border-left: 1px solid var(--border-color);
    box-shadow: var(--shadow);
    flex-shrink: 0;
  `}
  
  /* Tablet médio (769px - 1024px) - sidebar menor */
  @media (min-width: 769px) and (max-width: 1024px) {
    ${props => !props.$isMobile && `
      width: 360px;
      min-width: 360px;
      max-width: 360px;
    `}
  }
  
  /* Desktop grande (> 1400px) - sidebar pode ser maior */
  @media (min-width: 1401px) {
    ${props => !props.$isMobile && `
      width: 450px;
      min-width: 450px;
      max-width: 450px;
    `}
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  transition: background 0.2s ease;
  
  &:hover {
    background: #dc2626;
  }
`;

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ children, sidebar, isMobile }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isMobile) {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (isMobile) {
    return (
      <LayoutContainer $isMobile={isMobile}>
        {children}
        <MobileHeader>
          <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-color)' }}>
            Controles
          </h2>
          <MobileToggle onClick={toggleSidebar}>
            <Menu size={16} />
            Abrir Painel
          </MobileToggle>
        </MobileHeader>
        
        <SidebarOverlay $isOpen={sidebarOpen} onClick={toggleSidebar} />
        
        <SidebarContainer $isOpen={sidebarOpen} $isMobile={isMobile}>
          <CloseButton onClick={toggleSidebar}>
            <X size={16} />
          </CloseButton>
          {sidebar}
        </SidebarContainer>
      </LayoutContainer>
    );
  }

  return (
    <LayoutContainer $isMobile={isMobile}>
      {children}
      <SidebarContainer $isOpen={sidebarOpen} $isMobile={isMobile}>
        {sidebar}
      </SidebarContainer>
    </LayoutContainer>
  );
};

export default ResponsiveLayout;