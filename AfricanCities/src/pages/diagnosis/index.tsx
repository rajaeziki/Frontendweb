import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../component/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../component/ui/dialog";
import ChatWidget from "../Chat";
import { useTranslation } from 'react-i18next';
import UM6PCUS from '../../assets/UM6PCUS.svg';
import {
  FileText, BarChart3, Users, Home, Map, Building2,
  Trees, Landmark, Briefcase, Menu, X
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "./schemas";
import type { FormData } from "./types";
import { Link, useRoute } from "wouter";
import logo from "../../assets/logo.jpeg";
import LanguageSwitcher from '../../component/LanguageSwitcher';

// Hooks
import { useWebData } from "./hooks/useWebData";
import { useDocumentUpload } from "./hooks/useDocumentUpload";
import { useReportGeneration } from "./hooks/useReportGeneration";

// Composants
import { ExternalSourcesBar } from "./components/ExternalSourcesBar";
import { DocumentUploader } from "./components/DocumentUploader";
import { GeneralInfoForm } from "./components/GeneralInfoForm";
import { SocietyForm } from "./components/SocietyForm";
import { HabitatForm } from "./components/HabitatForm";
import { SpatialForm } from "./components/SpatialForm";
import { InfrastructureForm } from "./components/InfrastructureForm";
import { EnvironmentForm } from "./components/EnvironmentForm";
import { GovernanceForm } from "./components/GovernanceForm";
import { EconomyForm } from "./components/EconomyForm";
import { DiagnosticObjectivesForm } from "./components/DiagnosticObjectivesForm";
import { FormActions } from "./components/FormActions";
import { ReportViewer } from "./components/ReportViewer";

// Importer le composant AuthModal depuis son fichier
import AuthModal from '../../component/AuthModal';   // <-- AJOUTER CETTE LIGNE

// Types pour les dimensions
type DimensionKey = 'society' | 'habitat' | 'spatial' | 'infrastructure' | 'environment' | 'governance' | 'economy';

// Métadonnées des dimensions (avec clés de traduction)
const dimensionMeta: Record<DimensionKey, { labelKey: string; count: number }> = {
  society: { labelKey: 'dimensions.society.title', count: 20 },
  habitat: { labelKey: 'dimensions.habitat.title', count: 14 },
  spatial: { labelKey: 'dimensions.spatial.title', count: 11 },
  infrastructure: { labelKey: 'dimensions.infrastructure.title', count: 13 },
  environment: { labelKey: 'dimensions.environment.title', count: 14 },
  governance: { labelKey: 'dimensions.governance.title', count: 12 },
  economy: { labelKey: 'dimensions.economy.title', count: 15 },
};

// Icônes pour chaque dimension
const dimensionIcons: Record<DimensionKey, React.ElementType> = {
  society: Users,
  habitat: Home,
  spatial: Map,
  infrastructure: Building2,
  environment: Trees,
  governance: Landmark,
  economy: Briefcase,
};

// Couleurs de fond pour chaque dimension
const dimensionColors: Record<DimensionKey, string> = {
  society: "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100",
  habitat: "bg-green-50 text-green-600 border-green-200 hover:bg-green-100",
  spatial: "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100",
  infrastructure: "bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100",
  environment: "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100",
  governance: "bg-orange-50 text-orange-500 border-orange-200 hover:bg-orange-100",
  economy: "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100",
};

export default function Diagnosis() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("form");
  const [activeDimension, setActiveDimension] = useState<DimensionKey>('society');
  const [enableWebSearch, setEnableWebSearch] = useState(true);
  const [enableWorldBank, setEnableWorldBank] = useState(true);
  const [enableSDG, setEnableSDG] = useState(true);

  // État pour la langue du rapport (indépendant de l'interface)
  const initialReportLang = i18n.language === 'en' ? 'en' : 'fr';
  const [reportLanguage, setReportLanguage] = useState<'fr' | 'en'>(initialReportLang);

  // État pour la détection du scroll
  const [isScrolled, setIsScrolled] = useState(false);
  // État pour le menu mobile
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // --- ÉTATS D'AUTHENTIFICATION ---
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('auth') === 'true';
  });
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Fonction de connexion
  const handleLogin = (email: string, password: string) => {
    // Dans un cas réel, vous valideriez les identifiants
    if (email && password) {
      localStorage.setItem('auth', 'true');
      localStorage.setItem('userEmail', email);
      setIsAuthenticated(true);
      setShowLoginModal(false);
    } else {
      alert(t('login.alert.fill_fields'));
    }
  };

  // Fonction de déconnexion
  const handleLogout = () => {
    localStorage.removeItem('auth');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    setIsAuthenticated(false);
  };

  // Afficher la modale au chargement si non connecté
  useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    }
  }, [isAuthenticated]);

  const requireAuth = (callback?: () => void) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return false;
    }
    callback?.();
    return true;
  };
  // --- FIN AUTH ---

  const [isHome] = useRoute('/');
  const [isAbout] = useRoute('/about');
  const [isDiagnosis] = useRoute('/diagnosis');
  const [isContact] = useRoute('/contact');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { register, handleSubmit, watch } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: "Nouakchott",
      country: "Mauritanie",
      region: "Nouakchott",
      population_total: "1250000",
      population_density: "1200",
      area_km2: "1040",
      // Société
      primary_school_enrollment: "75",
      secondary_school_enrollment: "45",
      tertiary_enrollment: "15",
      adult_literacy_rate: "65",
      youth_literacy_rate: "80",
      gender_parity_index: "0.92",
      crime_rate: "15",
      safety_perception: "60",
      healthcare_access: "55",
      doctors_per_10000: "2.5",
      hospital_beds_per_10000: "8",
      life_expectancy: "65",
      infant_mortality: "45",
      maternal_mortality: "320",
      vaccination_rate: "70",
      malnutrition_rate: "18",
      urban_poverty_rate: "35",
      social_inclusion_index: "50",
      community_participation_rate: "25",
      social_protection_coverage: "22",
      // Habitat
      water_access: "45",
      water_quality: "60",
      electricity_access: "42",
      clean_cooking_fuels: "25",
      housing_overcrowding: "4.5",
      informal_housing_percentage: "40",
      housing_cost_per_m2: "200",
      home_ownership_rate: "55",
      sanitation_access: "25",
      wastewater_treatment: "15",
      homelessness_rate: "2",
      housing_satisfaction_rate: "45",
      housing_affordability_index: "65",
      slum_population_percentage: "35",
      // Spatial
      urban_density: "1200",
      green_space_per_capita: "5",
      public_transport_access: "35",
      home_work_distance: "8",
      urbanization_rate: "3.5",
      planned_vs_informal_ratio: "30",
      functional_mix_index: "40",
      sports_cultural_access: "25",
      walkability_score: "45",
      bike_lane_density: "0.5",
      public_space_access: "20",
      // Infrastructure
      road_quality_percentage: "40",
      road_length_per_capita: "1.2",
      internet_access: "35",
      broadband_speed: "15",
      mobile_penetration: "85",
      water_reliability: "12",
      electricity_reliability: "8",
      public_transport_capacity: "15",
      motorization_rate: "80",
      accessibility_pmr: "15",
      drainage_coverage: "30",
      street_lighting_coverage: "45",
      digital_services_index: "28",
      // Environnement
      air_quality_pm25: "45",
      air_quality_pm10: "85",
      waste_collection_rate: "50",
      waste_recycling_rate: "5",
      waste_to_energy_rate: "0",
      sanitation_coverage: "25",
      climate_vulnerability_index: "75",
      heatwave_days_per_year: "15",
      flood_risk_areas: "12",
      renewable_energy_share: "10",
      urban_deforestation_rate: "2",
      climate_adaptation_plan: "En développement",
      biodiversity_index: "45",
      carbon_footprint_per_capita: "1.8",
      // Gouvernance
      corruption_index: "35",
      voter_turnout: "55",
      women_in_council: "25",
      youth_in_council: "10",
      elected_council_exists: "Oui",
      public_service_satisfaction: "45",
      open_data_access: "20",
      political_stability_index: "60",
      citizen_initiatives_supported: "15",
      budget_transparency: "30",
      participatory_budgeting: "Non",
      digital_governance_index: "25",
      // Économie
      unemployment_rate: "25",
      youth_unemployment: "35",
      female_labor_participation: "28",
      formal_employment_rate: "30",
      gdp_per_capita: "1500",
      gdp_growth_rate: "3.2",
      fdi_attractiveness: "25",
      business_creation_rate: "8",
      income_per_capita: "1500",
      microcredit_access_rate: "12",
      cost_of_living_index: "110",
      monetary_poverty_rate: "35",
      green_digital_economy_share: "8",
      informal_economy_share: "45",
      tourism_revenue: "120",
      // Objectifs
      diagnostic_type: "Diagnostic complet 80+ indicateurs",
      diagnostic_objective: "",
      additional_comments: ""
    }
  });

  const watchCity = watch("city");
  const watchCountry = watch("country");

  const { webData } = useWebData(enableWebSearch, watchCity, watchCountry);
  const { documents, uploadProgress, fileInputRef, handleFileUpload, removeDocument } = useDocumentUpload();
  const { isGenerating, generatedContent, generateReportContent } = useReportGeneration();

  const handleFileUploadWithAuth = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (requireAuth()) handleFileUpload(e);
  };

  const onSubmit = async (data: FormData) => {
    if (!requireAuth()) return;
    // On passe la langue choisie pour le rapport
    await generateReportContent(data, documents, webData, enableWorldBank, enableSDG, reportLanguage);
    setActiveTab("result");
  };

  const renderDimensionForm = () => {
    switch (activeDimension) {
      case 'society': return <SocietyForm register={register} />;
      case 'habitat': return <HabitatForm register={register} />;
      case 'spatial': return <SpatialForm register={register} />;
      case 'infrastructure': return <InfrastructureForm register={register} />;
      case 'environment': return <EnvironmentForm register={register} />;
      case 'governance': return <GovernanceForm register={register} />;
      case 'economy': return <EconomyForm register={register} />;
      default: return <SocietyForm register={register} />;
    }
  };

  const linkClass = (isActive: boolean) => {
    const baseClasses = 'transition-colors';
    const colorClasses = isScrolled ? 'text-gray-800 hover:text-amber-500' : 'text-white hover:text-amber-400';
    const activeClasses = isActive
      ? (isScrolled ? 'text-amber-500 font-semibold border-b-2 border-amber-500 pb-1' : 'text-amber-400 font-semibold border-b-2 border-amber-300 pb-1')
      : '';
    return `${baseClasses} ${colorClasses} ${activeClasses}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white font-sans text-gray-800">
      {/* Modale d'authentification importée */}
      <AuthModal
        key={i18n.language}
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />

      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-4'
      }`}>
        <nav className="container mx-auto px-6">
          <div className="flex items-center justify-between">
             <Link href="/" className="block">
              <div className="p-3">
                <img
                  src={UM6PCUS}
                  alt="AfricanCities AI Logo"
                  className="h-12 w-auto object-contain drop-shadow-md"
                />
              </div>
            </Link>

            <div className="flex items-center">
              <ul className="hidden md:flex space-x-8 text-sm font-medium tracking-wider">
                <li><Link href="/" className={linkClass(isHome)}>{t('common.header.home')}</Link></li>
                <li><Link href="/about" className={linkClass(isAbout)}>{t('common.header.about')}</Link></li>
                <li><Link href="/diagnosis" className={linkClass(isDiagnosis)}>{t('common.header.diagnostic')}</Link></li>
                <li><Link href="/contact" className={linkClass(isContact)}>{t('common.header.contact')}</Link></li>
              </ul>
              <div className="ml-4"><LanguageSwitcher /></div>
              {isAuthenticated && (
                <button onClick={handleLogout} className={`ml-4 text-sm font-medium ${isScrolled ? 'text-gray-800' : 'text-white'} hover:text-amber-400`}>
                  {t('common.logout')}
                </button>
              )}
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden ml-4 p-2 focus:outline-none" aria-label="Toggle menu">
                {isMenuOpen ? <X className={`w-6 h-6 ${isScrolled ? 'text-gray-800' : 'text-white'}`} /> : <Menu className={`w-6 h-6 ${isScrolled ? 'text-gray-800' : 'text-white'}`} />}
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-white/90 backdrop-blur-md shadow-lg py-4 px-6 mt-2">
              <ul className="flex flex-col space-y-4 text-sm font-medium">
                <li><Link href="/" onClick={() => setIsMenuOpen(false)} className={`block transition-colors ${isHome ? 'text-amber-500 font-semibold' : 'text-gray-800'} hover:text-amber-500`}>{t('common.header.home')}</Link></li>
                <li><Link href="/about" onClick={() => setIsMenuOpen(false)} className={`block transition-colors ${isAbout ? 'text-amber-500 font-semibold' : 'text-gray-800'} hover:text-amber-500`}>{t('common.header.about')}</Link></li>
                <li><Link href="/diagnosis" onClick={() => setIsMenuOpen(false)} className={`block transition-colors ${isDiagnosis ? 'text-amber-500 font-semibold' : 'text-gray-800'} hover:text-amber-500`}>{t('common.header.diagnostic')}</Link></li>
                <li><Link href="/contact" onClick={() => setIsMenuOpen(false)} className={`block transition-colors ${isContact ? 'text-amber-500 font-semibold' : 'text-gray-800'} hover:text-amber-500`}>{t('common.header.contact')}</Link></li>
              </ul>
            </div>
          )}
        </nav>
      </header>

      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden -mt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          <img src="/Morroco.jpg" alt="Vue de Lagos, Nigeria - Ville africaine dynamique" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-20 text-white max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center"><span className="text-amber-400">{t('diagnostic.title')}</span></h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-white font-normal text-center">{t('diagnostic.subtitle')}</p>
        </div>
      </section>

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-6">
          <div className="mb-8">
            <ExternalSourcesBar
              enableWorldBank={enableWorldBank}
              setEnableWorldBank={setEnableWorldBank}
              enableSDG={enableSDG}
              setEnableSDG={setEnableSDG}
              enableWebSearch={enableWebSearch}
              setEnableWebSearch={setEnableWebSearch}
              webData={webData}
              city={watchCity}
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <div className="flex justify-center">
              <TabsList className="bg-gray-100 p-1 rounded-full">
                <TabsTrigger value="form" className="flex items-center gap-2 rounded-full px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-amber-600">
                  <FileText className="w-4 h-4" /> {t('diagnostic.tabs.form')}
                </TabsTrigger>
                <TabsTrigger value="result" disabled={!generatedContent} className="flex items-center gap-2 rounded-full px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-amber-600 disabled:opacity-50">
                  <BarChart3 className="w-4 h-4" /> {t('diagnostic.tabs.result')}
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="form">
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">{t('diagnostic.dimensions.choose')}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                  {(Object.keys(dimensionMeta) as DimensionKey[]).map((key) => (
                    <button key={key} onClick={() => setActiveDimension(key)} className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${activeDimension === key ? 'border-amber-500 bg-amber-50 shadow-md' : 'border-gray-200 hover:border-amber-200 hover:bg-amber-50/50'}`}>
                      <div className={`p-3 rounded-full mb-2 ${dimensionColors[key]}`}>{React.createElement(dimensionIcons[key], { className: "w-5 h-5" })}</div>
                      <span className="text-xs font-medium text-gray-700 text-center">{t(dimensionMeta[key].labelKey)}</span>
                      <span className="text-[10px] text-gray-500">{t('diagnostic.indicators', { count: dimensionMeta[key].count })}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                  <div className="sticky top-24">
                    <DocumentUploader documents={documents} uploadProgress={uploadProgress} fileInputRef={fileInputRef} onFileUpload={handleFileUploadWithAuth} onRemoveDocument={removeDocument} />
                  </div>
                </div>

                <div className="lg:col-span-3">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('diagnostic.general.title')}</h3>
                      <GeneralInfoForm register={register} />
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center gap-2 mb-4">
                        {React.createElement(dimensionIcons[activeDimension], { className: `w-5 h-5 ${dimensionColors[activeDimension].split(' ')[1]}` })}
                        <h3 className="text-lg font-semibold text-gray-800">{t(dimensionMeta[activeDimension].labelKey)}</h3>
                      </div>
                      {renderDimensionForm()}
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <DiagnosticObjectivesForm register={register} />
                      
                      {/* Sélecteur de langue pour le rapport */}
                      <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">{t('diagnostic.report_language')}</h4>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="reportLanguage"
                              value="fr"
                              checked={reportLanguage === 'fr'}
                              onChange={() => setReportLanguage('fr')}
                              className="w-4 h-4 text-amber-600"
                            />
                            <span className="text-sm">Français</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="reportLanguage"
                              value="en"
                              checked={reportLanguage === 'en'}
                              onChange={() => setReportLanguage('en')}
                              className="w-4 h-4 text-amber-600"
                            />
                            <span className="text-sm">English</span>
                          </label>
                        </div>
                      </div>

                      <div className="mt-6">
                        <FormActions
                          isGenerating={isGenerating}
                          documents={documents}
                          webData={webData}
                          enableSDG={enableSDG}
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="result">
              <ReportViewer generatedContent={generatedContent} city={watchCity} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="relative bg-white border-t border-gray-200 py-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=2070" alt="African city background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60 z-10"></div>
        </div>
        <div className="relative z-20 container mx-auto px-6">
          <div className="flex flex-col items-center text-center gap-4 text-white">
            <p className="text-lg">{t('common.footer.thank_you')}</p>
            <p className="text-lg">{t('common.footer.pilot')}</p>
            <div className="flex items-center justify-center gap-4 mt-2 text-sm text-white/80">
              <span>{t('common.footer.location')}</span> <span>|</span> <span>{t('common.footer.email')}</span>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <Link href="/contact" className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-8 py-3 rounded-full shadow-md hover:shadow-lg transition duration-300 inline-block">
                {t('common.footer.contact_button')}
              </Link>
            </div>
          </div>
        </div>
      </footer>
      <ChatWidget />
    </div>
  );
}