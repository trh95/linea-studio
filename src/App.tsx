/**
 * Linea Studio - Main Application Router & Container
 * Language: Hungarian
 * Design: Deep Blue #001D50, Accent Gold #C6A86A, Warm Background #F8F7F2
 * Implements PDF Specification:
 * - Kezdőlap (Hero, USP, Szolgáltatások, Referenciák, Google Vélemények, Szalonbár, Rólam, Pécs, Záró CTA)
 * - Szolgáltatások legördülő menü (4 részletes aloldal képgalériával, árakkal, utóápolással)
 * - Első alkalom útmutató
 * - Házirend
 * - GYIK
 * - Ingyenes Konzultáció (8-kérdéses anamnézis teszt)
 * - Védett Admin Irányítópult & Google Calendar & Portfólió
 * - Backend Kód és Architektúra böngésző
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { PublicLanding } from './components/PublicLanding';
import { ServiceDetail } from './components/ServiceDetail';
import { FirstVisitGuide } from './components/FirstVisitGuide';
import { HouseRules } from './components/HouseRules';
import { FaqView } from './components/FaqView';
import { IntakeForm } from './components/IntakeForm';
import { AdminDashboard } from './components/AdminDashboard';
import { BackendCodeViewer } from './components/BackendCodeViewer';
import { AdminLoginModal } from './components/AdminLoginModal';
import { apiService } from './services/apiService';
import { FormResponseItem, PortfolioItem, CalendarAppointment, ServiceDetailItem } from './types';
import { DETAILED_SERVICES } from './data/mockData';

import { ButtonStyleProvider } from './context/ButtonStyleContext';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('landing');
  const [activeServiceId, setActiveServiceId] = useState<string>('muszempilla');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  const [responses, setResponses] = useState<FormResponseItem[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [appointments, setAppointments] = useState<CalendarAppointment[]>([]);
  const [adminTab, setAdminTab] = useState<'responses' | 'calendar' | 'portfolio'>('responses');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = async () => {
    try {
      const [resList, portList, calList] = await Promise.all([
        apiService.getFormResponses(),
        apiService.getPortfolio(),
        apiService.getCalendarEvents(),
      ]);
      setResponses(resList);
      setPortfolio(portList);
      setAppointments(calList);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const savedToken = localStorage.getItem('linea_admin_token');
    if (savedToken) {
      setIsAdminLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    localStorage.setItem('linea_admin_token', 'demo-valid-jwt-token');
    setCurrentView('admin');
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('linea_admin_token');
    setCurrentView('landing');
  };

  const handleNavigate = (view: string, serviceId?: string) => {
    if (view === 'admin' && !isAdminLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }
    if (serviceId) {
      setActiveServiceId(serviceId);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeService: ServiceDetailItem =
    DETAILED_SERVICES.find((s) => s.id === activeServiceId) || DETAILED_SERVICES[0];

  return (
    <ButtonStyleProvider>
      <div className="min-h-screen bg-warm-bg text-primary-dark font-sans flex flex-col selection:bg-accent-gold/20 selection:text-primary-dark">
        {/* Top Navigation Bar with strict 3-zone contract + Dropdown */}
        <Navbar
          currentView={currentView}
          activeServiceId={activeServiceId}
          onNavigate={handleNavigate}
          isAdminLoggedIn={isAdminLoggedIn}
          onOpenLogin={() => setIsLoginModalOpen(true)}
          onLogout={handleLogout}
          onRefreshAll={loadData}
          adminTab={adminTab}
          onSelectAdminTab={setAdminTab}
          pendingResponsesCount={responses.filter((r) => !r.is_done).length}
          appointmentsCount={appointments.length}
          portfolioCount={portfolio.length}
        />

        {/* Main View Router */}
        <main className="flex-1">
          {/* 1. Kezdőlap */}
          {currentView === 'landing' && (
            <PublicLanding
              portfolio={portfolio}
              onStartIntake={() => handleNavigate('intake')}
              onSelectService={(srvId) => handleNavigate('service-detail', srvId)}
              onNavigatePage={(page) => handleNavigate(page)}
            />
          )}

          {/* 2. Részletes Szolgáltatás Nézet (Galéria sliderrel, utóápolással, árakkal) */}
          {currentView === 'service-detail' && (
            <ServiceDetail
              service={activeService}
              onBack={() => handleNavigate('landing')}
              onStartIntake={() => handleNavigate('intake')}
              onSelectOtherService={(srvId) => handleNavigate('service-detail', srvId)}
            />
          )}

          {/* 3. Első alkalom útmutató */}
          {currentView === 'first-visit' && (
            <FirstVisitGuide onStartIntake={() => handleNavigate('intake')} />
          )}

          {/* 4. Szalon Házirend */}
          {currentView === 'house-rules' && <HouseRules />}

          {/* 5. Gyakran Ismételt Kérdések (GYIK) */}
          {currentView === 'faq' && (
            <FaqView onStartIntake={() => handleNavigate('intake')} />
          )}

          {/* 6. Ingyenes Konzultációs Kérdőív (8-lépéses teszt) */}
          {currentView === 'intake' && (
            <IntakeForm
              onSuccessNavigate={() => handleNavigate('landing')}
              onViewAdmin={() => {
                if (isAdminLoggedIn) {
                  handleNavigate('admin');
                } else {
                  setIsLoginModalOpen(true);
                }
              }}
            />
          )}

          {/* 7. Védett Admin Dashboard */}
          {currentView === 'admin' && (
            <AdminDashboard
              responses={responses}
              portfolio={portfolio}
              appointments={appointments}
              onRefreshAll={loadData}
              onLogout={handleLogout}
              activeTab={adminTab}
              onTabChange={setAdminTab}
            />
          )}

          {/* 8. Backend Kód és Architektúra Ellenőrző */}
          {currentView === 'backend' && <BackendCodeViewer />}
        </main>

        {/* Admin Login Dialog */}
        <AdminLoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    </ButtonStyleProvider>
  );
}
