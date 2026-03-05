import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../component/ui/tabs";
import ChatWidget from "../Chat";
import {
  FileText, BarChart3, Users, Home, Map, Building2,
  Trees, Landmark, Briefcase, Sparkles, Instagram
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "./schemas";
import type { FormData } from "./types";
import { Link } from "wouter";
import logo from "../../assets/logo.jpeg";

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

// Types pour les dimensions
type DimensionKey = 'society' | 'habitat' | 'spatial' | 'infrastructure' | 'environment' | 'governance' | 'economy';

// Métadonnées des dimensions
const dimensionMeta: Record<DimensionKey, { label: string; count: number }> = {
  society: { label: 'Société', count: 20 },
  habitat: { label: 'Habitat', count: 14 },
  spatial: { label: 'Développement Spatial', count: 11 },
  infrastructure: { label: 'Infrastructures', count: 13 },
  environment: { label: 'Environnement', count: 14 },
  governance: { label: 'Gouvernance', count: 12 },
  economy: { label: 'Économie', count: 15 },
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
  spatial: "bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100",
  infrastructure: "bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100",
  environment: "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100",
  governance: "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100",
  economy: "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100",
};

export default function Diagnosis() {
  const [activeTab, setActiveTab] = useState("form");
  const [activeDimension, setActiveDimension] = useState<DimensionKey>('society');
  const [enableWebSearch, setEnableWebSearch] = useState(true);
  const [enableWorldBank, setEnableWorldBank] = useState(true);
  const [enableSDG, setEnableSDG] = useState(true);

  const { register, handleSubmit, watch } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {}
  });

  const watchCity = watch("city");
  const watchCountry = watch("country");

  const { webData } = useWebData(enableWebSearch, watchCity, watchCountry);
  const { documents, uploadProgress, fileInputRef, handleFileUpload, removeDocument } = useDocumentUpload();
  const { isGenerating, generatedContent, generateReportContent } = useReportGeneration();

  const onSubmit = async (data: FormData) => {
    console.log("📝 DONNÉES DU FORMULAIRE COMPLÈTES:", data);
    await generateReportContent(data, documents, webData, enableWorldBank, enableSDG);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white font-sans text-gray-800">
      {/* Header absolu avec effet de transparence */}
      <header className="absolute top-0 left-0 right-0 z-20 bg-transparent">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo avec lueur */}
            <Link href="/" className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-200/50 to-orange-200/50 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-amber-100/30 to-orange-100/30 rounded-2xl blur-md" />
              <div className="relative bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-xl border border-white/60 group-hover:shadow-2xl transition-all duration-500">
                <img
                  src={logo}
                  alt="AfricanCities AI Logo"
                  className="h-12 w-auto object-contain drop-shadow-md"
                />
              </div>
            </Link>

            {/* Navigation */}
            <ul className="flex space-x-8 text-sm font-medium tracking-wider">
              <li><Link href="/" className="text-white hover:text-amber-300 cursor-pointer transition-colors">HOME</Link></li>
              <li><Link href="/about" className="text-white hover:text-amber-300 cursor-pointer transition-colors">ABOUT</Link></li>
              <li><Link href="/diagnosis" className="text-white hover:text-amber-300 cursor-pointer transition-colors font-semibold border-b-2 border-amber-300 pb-1">DIAGNOSTIC</Link></li>
              <li><Link href="/contact" className="text-white hover:text-amber-300 cursor-pointer transition-colors">CONTACT</Link></li>
            </ul>
          </div>
        </nav>
      </header>

      {/* Hero section avec image corrigée (Lagos, Nigeria) */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          <img
            src="/Morroco.jpg" // Remplacez par votre image locale de Lagos ou une autre ville africaine dynamique
            alt="Vue de Lagos, Nigeria - Ville africaine dynamique"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-20 text-center text-white max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
             <span className="text-amber-400">Diagnostic</span>
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-white font-normal">
            Diagnostic Urbain Complet  80+ indicateurs avec intégration Banque Mondiale et SDG
          </p>
        </div>
      </section>

      {/* Contenu principal */}
      <main className="py-12">
        <div className="container mx-auto px-6">
          {/* Barre des sources externes */}
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

          {/* Onglets */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <div className="flex justify-center">
              <TabsList className="bg-gray-100 p-1 rounded-full">
                <TabsTrigger
                  value="form"
                  className="flex items-center gap-2 rounded-full px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-amber-600"
                >
                  <FileText className="w-4 h-4" />
                  Saisie des indicateurs
                </TabsTrigger>
                <TabsTrigger
                  value="result"
                  disabled={!generatedContent}
                  className="flex items-center gap-2 rounded-full px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-amber-600 disabled:opacity-50"
                >
                  <BarChart3 className="w-4 h-4" />
                  Rapport complet
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="form">
              {/* Sélection des dimensions */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  Choisissez une dimension à renseigner
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                  {(Object.keys(dimensionMeta) as DimensionKey[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => setActiveDimension(key)}
                      className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                        activeDimension === key
                          ? 'border-amber-500 bg-amber-50 shadow-md'
                          : 'border-gray-200 hover:border-amber-200 hover:bg-amber-50/50'
                      }`}
                    >
                      <div className={`p-3 rounded-full mb-2 ${dimensionColors[key]}`}>
                        {React.createElement(dimensionIcons[key], { className: "w-5 h-5" })}
                      </div>
                      <span className="text-xs font-medium text-gray-700 text-center">
                        {dimensionMeta[key].label}
                      </span>
                      <span className="text-[10px] text-gray-500">{dimensionMeta[key].count} indicateurs</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Grille uploader + formulaire */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Uploader */}
                <div className="lg:col-span-1">
                  <div className="sticky top-24">
                    <DocumentUploader
                      documents={documents}
                      uploadProgress={uploadProgress}
                      fileInputRef={fileInputRef}
                      onFileUpload={handleFileUpload}
                      onRemoveDocument={removeDocument}
                    />
                  </div>
                </div>

                {/* Formulaire */}
                <div className="lg:col-span-3">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Informations générales */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations générales</h3>
                      <GeneralInfoForm register={register} />
                    </div>

                    {/* Formulaire de la dimension active */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center gap-2 mb-4">
                        {React.createElement(dimensionIcons[activeDimension], {
                          className: `w-5 h-5 ${dimensionColors[activeDimension].split(' ')[1]}`
                        })}
                        <h3 className="text-lg font-semibold text-gray-800">
                          {dimensionMeta[activeDimension].label}
                        </h3>
                      </div>
                      {renderDimensionForm()}
                    </div>

                    {/* Objectifs et actions */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <DiagnosticObjectivesForm register={register} />
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

      {/* Footer */}
      <footer className="relative bg-white border-t border-gray-200 py-12 overflow-hidden">
        {/* Image de fond : ville africaine */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=2070" // Exemple (Nairobi) - à remplacer par votre image locale
            alt="African city background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 z-10"></div> {/* Overlay sombre */}
        </div>
      
        {/* Contenu (relatif pour passer au-dessus) */}
        <div className="relative z-20 container mx-auto px-6">
          <div className="flex flex-col items-center text-center gap-4 text-white">
            <p className="text-lg">
              Thank you for your interest in us. Our derivative websites will be launched soon, stay tuned!
            </p>
            <p className="text-lg">
              Can't wait?{' '}
              {/* <Link
                href="/contact"
                className="text-amber-300 hover:text-amber-400 font-semibold underline underline-offset-2"
              >
                Contact us now
              </Link>{' '} */}
              to set up a pilot program.
            </p>
            <div className="flex items-center justify-center gap-4 mt-2 text-sm text-white/80">
              <span>Benguerir</span>
              <span>|</span>
              <span>contact.cus@um6p.ma</span>
              <span>|</span>
              <Link href="/privacy" className="hover:text-amber-300 transition-colors">
                Privacy Policy
              </Link>
            </div>
            <div className="mt-4 flex items-center gap-4">
              {/* <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-amber-300 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a> */}
              <Link
                href="/contact"
                className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-8 py-3 rounded-full shadow-md hover:shadow-lg transition duration-300 inline-block"
              >
                CONTACT
              </Link>
            </div>
          </div>
        </div>
      </footer>
      <ChatWidget />
    </div>
  );
}