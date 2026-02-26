import { LayoutShell } from "../component/layout-shell";
import { Button } from "../component/ui/button";
import { Input } from "../component/ui/input";
import { Label } from "../component/ui/label";
import { Textarea } from "../component/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../component/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../component/ui/tabs";
import { 
  Loader2, 
  Upload, 
  FileText, 
  AlertCircle, 
  Download,
  Globe,
  MapPin,
  Users,
  Building,
  Zap,
  TreePine,
  Bus,
  Briefcase,
  Heart,
  CheckCircle2,
  Info,
  ExternalLink,
  BarChart3,
  Target,
  Scale,
  Shield,
  Wifi,
  Droplets,
  Sun,
  Repeat,
  Landmark,
  Gauge,
  Rocket,
  GraduationCap,
  Baby,
  Home,
  Map,
  Fan,
  Trash2,
  CloudRain,
  Sprout,
  Vote,
  TrendingUp,
  PiggyBank,
  Salad,
  Church,
  Bike
} from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { useState, useEffect, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Types pour les données
interface WebData {
  wikipedia_info?: {
    title: string;
    summary: string;
    url: string;
    found: boolean;
  };
  additional_context?: string;
}

interface DocumentContent {
  filename: string;
  content: string;
}

// Schéma de formulaire étendu avec tous les indicateurs
const formSchema = z.object({
  // Informations générales
  city: z.string().min(1, "La ville est requise"),
  country: z.string().min(1, "Le pays est requis"),
  region: z.string().optional(),
  diagnostic_date: z.string().optional(),
  
  // SOCIETY (12 indicateurs)
  primary_school_enrollment: z.string().optional(),
  secondary_school_enrollment: z.string().optional(),
  adult_literacy_rate: z.string().optional(),
  crime_rate: z.string().optional(),
  safety_perception: z.string().optional(),
  healthcare_access: z.string().optional(),
  doctors_per_10000: z.string().optional(),
  life_expectancy: z.string().optional(),
  infant_mortality: z.string().optional(),
  vaccination_rate: z.string().optional(),
  urban_poverty_rate: z.string().optional(),
  social_inclusion_index: z.string().optional(),
  community_participation_rate: z.string().optional(),
  
  // HABITAT (8 indicateurs)
  water_access: z.string().optional(),
  electricity_access: z.string().optional(),
  housing_overcrowding: z.string().optional(),
  informal_housing_percentage: z.string().optional(),
  housing_cost_per_m2: z.string().optional(),
  home_ownership_rate: z.string().optional(),
  sanitation_access: z.string().optional(),
  homelessness_rate: z.string().optional(),
  housing_satisfaction_rate: z.string().optional(),
  
  // SPATIAL DEVELOPMENT (8 indicateurs)
  urban_density: z.string().optional(),
  green_space_per_capita: z.string().optional(),
  public_transport_access: z.string().optional(),
  home_work_distance: z.string().optional(),
  urbanization_rate: z.string().optional(),
  planned_vs_informal_ratio: z.string().optional(),
  functional_mix_index: z.string().optional(),
  sports_cultural_access: z.string().optional(),
  
  // INFRASTRUCTURE (8 indicateurs)
  road_quality_percentage: z.string().optional(),
  road_length_per_capita: z.string().optional(),
  internet_access: z.string().optional(),
  mobile_penetration: z.string().optional(),
  water_reliability: z.string().optional(),
  electricity_reliability: z.string().optional(),
  public_transport_capacity: z.string().optional(),
  motorization_rate: z.string().optional(),
  accessibility_pmr: z.string().optional(),
  
  // ENVIRONMENT (9 indicateurs)
  air_quality_pm25: z.string().optional(),
  waste_collection_rate: z.string().optional(),
  waste_recycling_rate: z.string().optional(),
  sanitation_coverage: z.string().optional(),
  climate_vulnerability_index: z.string().optional(),
  heatwave_days_per_year: z.string().optional(),
  renewable_energy_share: z.string().optional(),
  urban_deforestation_rate: z.string().optional(),
  climate_adaptation_plan: z.string().optional(),
  
  // GOVERNANCE (7 indicateurs)
  corruption_index: z.string().optional(),
  voter_turnout: z.string().optional(),
  elected_council_exists: z.string().optional(),
  public_service_satisfaction: z.string().optional(),
  open_data_access: z.string().optional(),
  political_stability_index: z.string().optional(),
  citizen_initiatives_supported: z.string().optional(),
  
  // ECONOMY (10 indicateurs)
  unemployment_rate: z.string().optional(),
  formal_employment_rate: z.string().optional(),
  gdp_growth_rate: z.string().optional(),
  fdi_attractiveness: z.string().optional(),
  business_creation_rate: z.string().optional(),
  income_per_capita: z.string().optional(),
  microcredit_access_rate: z.string().optional(),
  cost_of_living_index: z.string().optional(),
  monetary_poverty_rate: z.string().optional(),
  green_digital_economy_share: z.string().optional(),
  
  // Objectifs
  diagnostic_type: z.string().optional(),
  diagnostic_objective: z.string().optional(),
  additional_comments: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

// Données mock pour les graphiques
const demographicData = [
  { name: '0-14 ans', value: 42.5 },
  { name: '15-64 ans', value: 54.3 },
  { name: '65+ ans', value: 3.2 },
];

const populationGrowthData = [
  { year: '2018', population: 1050000 },
  { year: '2019', population: 1087500 },
  { year: '2020', population: 1126250 },
  { year: '2021', population: 1165656 },
  { year: '2022', population: 1206428 },
  { year: '2023', population: 1250000 },
];

const infrastructureData = [
  { category: 'Eau potable', current: 45, target: 80 },
  { category: 'Électricité', current: 42, target: 75 },
  { category: 'Assainissement', current: 25, target: 60 },
  { category: 'Routes', current: 60, target: 85 },
  { category: 'Internet', current: 35, target: 90 },
];

const housingData = [
  { type: 'Béton/Dur', value: 35 },
  { type: 'Semi-dur', value: 25 },
  { type: 'Traditionnel', value: 25 },
  { type: 'Précaire', value: 15 },
];

const COLORS = ['#1e3a5f', '#fbbf24', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6'];

// Configuration des dimensions pour l'organisation
const dimensions = [
  { id: 'society', name: 'Société', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', indicators: 12 },
  { id: 'habitat', name: 'Habitat', icon: Home, color: 'text-emerald-600', bg: 'bg-emerald-50', indicators: 9 },
  { id: 'spatial', name: 'Développement Spatial', icon: Map, color: 'text-purple-600', bg: 'bg-purple-50', indicators: 8 },
  { id: 'infrastructure', name: 'Infrastructures', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50', indicators: 9 },
  { id: 'environment', name: 'Environnement', icon: TreePine, color: 'text-green-600', bg: 'bg-green-50', indicators: 9 },
  { id: 'governance', name: 'Gouvernance', icon: Scale, color: 'text-indigo-600', bg: 'bg-indigo-50', indicators: 7 },
  { id: 'economy', name: 'Économie', icon: TrendingUp, color: 'text-rose-600', bg: 'bg-rose-50', indicators: 10 },
];

export default function Diagnosis() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("form");
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [webData, setWebData] = useState<WebData | null>(null);
  const [documents, setDocuments] = useState<DocumentContent[]>([]);
  const [enableWebSearch, setEnableWebSearch] = useState(true);
  const [expandedSections, setExpandedSections] = useState<string[]>(['society', 'habitat', 'infrastructure']);
  const [activeDimension, setActiveDimension] = useState('society');
  
  // Ref pour l'iframe
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const { register, handleSubmit, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: "Nouakchott",
      country: "Mauritanie",
      region: "Nouakchott",
      
      // Société
      primary_school_enrollment: "75",
      secondary_school_enrollment: "45",
      adult_literacy_rate: "65",
      crime_rate: "15",
      safety_perception: "60",
      healthcare_access: "55",
      doctors_per_10000: "2.5",
      life_expectancy: "65",
      infant_mortality: "45",
      vaccination_rate: "70",
      urban_poverty_rate: "35",
      social_inclusion_index: "50",
      community_participation_rate: "25",
      
      // Habitat
      water_access: "45",
      electricity_access: "42",
      housing_overcrowding: "4.5",
      informal_housing_percentage: "40",
      housing_cost_per_m2: "200",
      home_ownership_rate: "55",
      sanitation_access: "25",
      homelessness_rate: "2",
      housing_satisfaction_rate: "45",
      
      // Spatial
      urban_density: "1200",
      green_space_per_capita: "5",
      public_transport_access: "35",
      home_work_distance: "8",
      urbanization_rate: "3.5",
      planned_vs_informal_ratio: "30",
      functional_mix_index: "40",
      sports_cultural_access: "25",
      
      // Infrastructure
      road_quality_percentage: "40",
      road_length_per_capita: "1.2",
      internet_access: "35",
      mobile_penetration: "85",
      water_reliability: "12",
      electricity_reliability: "8",
      public_transport_capacity: "15",
      motorization_rate: "80",
      accessibility_pmr: "15",
      
      // Environnement
      air_quality_pm25: "45",
      waste_collection_rate: "50",
      waste_recycling_rate: "5",
      sanitation_coverage: "25",
      climate_vulnerability_index: "75",
      heatwave_days_per_year: "15",
      renewable_energy_share: "10",
      urban_deforestation_rate: "2",
      climate_adaptation_plan: "En développement",
      
      // Gouvernance
      corruption_index: "35",
      voter_turnout: "55",
      elected_council_exists: "Oui",
      public_service_satisfaction: "45",
      open_data_access: "20",
      political_stability_index: "60",
      citizen_initiatives_supported: "15",
      
      // Économie
      unemployment_rate: "25",
      formal_employment_rate: "30",
      gdp_growth_rate: "3.2",
      fdi_attractiveness: "25",
      business_creation_rate: "8",
      income_per_capita: "1500",
      microcredit_access_rate: "12",
      cost_of_living_index: "110",
      monetary_poverty_rate: "35",
      green_digital_economy_share: "8",
    }
  });

  const watchCity = watch("city");
  const watchCountry = watch("country");

  const fetchWebData = useCallback(async (city: string, country: string) => {
    // Simuler une recherche Wikipedia
    const mockWikiData = {
      wikipedia_info: {
        title: `${city}, ${country}`,
        summary: `${city} est la capitale de la ${country}. Fondée en... Population: environ 1.2 million d'habitants. Centre économique et politique majeur.`,
        url: `https://fr.wikipedia.org/wiki/${city.replace(/\s+/g, '_')}`,
        found: true
      }
    };
    setWebData(mockWikiData);
  }, []);

  useEffect(() => {
    if (enableWebSearch && watchCity && watchCountry) {
      fetchWebData(watchCity, watchCountry);
    }
  }, [watchCity, watchCountry, enableWebSearch, fetchWebData]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newDocuments: DocumentContent[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type === 'application/pdf') {
        // Simuler l'extraction de texte
        const content = `Contenu extrait du document ${file.name}...`;
        newDocuments.push({
          filename: file.name,
          content: content
        });
        toast({
          title: "Document traité",
          description: `${file.name} a été analysé avec succès.`,
        });
      }
    }
    
    setDocuments((prev) => [...prev, ...newDocuments]);
  };

  const downloadPDF = async () => {
    if (!iframeRef.current) return;
    
    try {
      toast({
        title: "Préparation du PDF",
        description: "Génération du document en cours...",
      });
      
      const iframeDocument = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
      if (!iframeDocument) {
        throw new Error("Impossible d'accéder au contenu de l'iframe");
      }
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210;
      const pageHeight = 297;
      
      const coverElement = iframeDocument.querySelector('.cover-page');
      if (coverElement) {
        const coverCanvas = await html2canvas(coverElement as HTMLElement, {
          scale: 2,
          backgroundColor: '#ffffff',
          logging: false,
          useCORS: true,
          allowTaint: false,
        });
        
        const coverImgData = coverCanvas.toDataURL('image/png');
        const coverImgHeight = (coverCanvas.height * imgWidth) / coverCanvas.width;
        
        pdf.addImage(coverImgData, 'PNG', 0, 0, imgWidth, coverImgHeight, undefined, 'FAST');
      }
      
      const bodyClone = iframeDocument.body.cloneNode(true) as HTMLElement;
      
      const coverInClone = bodyClone.querySelector('.cover-page');
      if (coverInClone) {
        coverInClone.remove();
      }
      
      const pageBreaks = bodyClone.querySelectorAll('.page-break');
      pageBreaks.forEach(el => el.remove());
      
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '1200px';
      tempContainer.style.background = '#ffffff';
      tempContainer.appendChild(bodyClone);
      document.body.appendChild(tempContainer);
      
      const contentCanvas = await html2canvas(tempContainer, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        allowTaint: false,
        windowWidth: 1200,
      });
      
      document.body.removeChild(tempContainer);
      
      const contentImgData = contentCanvas.toDataURL('image/png');
      const contentImgHeight = (contentCanvas.height * imgWidth) / contentCanvas.width;
      
      pdf.addPage();
      
      let heightLeft = contentImgHeight;
      let position = 0;
      let firstPage = true;
      
      while (heightLeft > 0) {
        if (!firstPage) {
          pdf.addPage();
        }
        
        pdf.addImage(contentImgData, 'PNG', 0, position, imgWidth, contentImgHeight, undefined, 'FAST');
        
        heightLeft -= pageHeight;
        position -= pageHeight;
        firstPage = false;
      }
      
      pdf.save(`Diagnostic_${watchCity?.replace(/\s+/g, '_') || 'ville'}.pdf`);
      
      toast({
        title: "Succès !",
        description: "Le PDF a été généré avec succès.",
      });
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le PDF.",
        variant: "destructive",
      });
    }
  };

  const generateRadarData = (data: FormData) => {
    return [
      { dimension: 'Société', value: calculateDimensionScore(data, 'society'), fullMark: 100 },
      { dimension: 'Habitat', value: calculateDimensionScore(data, 'habitat'), fullMark: 100 },
      { dimension: 'Spatial', value: calculateDimensionScore(data, 'spatial'), fullMark: 100 },
      { dimension: 'Infrastructure', value: calculateDimensionScore(data, 'infrastructure'), fullMark: 100 },
      { dimension: 'Environnement', value: calculateDimensionScore(data, 'environment'), fullMark: 100 },
      { dimension: 'Gouvernance', value: calculateDimensionScore(data, 'governance'), fullMark: 100 },
      { dimension: 'Économie', value: calculateDimensionScore(data, 'economy'), fullMark: 100 },
    ];
  };

  const calculateDimensionScore = (data: FormData, dimension: string): number => {
    // Logique simplifiée pour calculer le score par dimension
    // À améliorer avec des pondérations réelles
    const values: Record<string, number> = {};
    let total = 0;
    let count = 0;
    
    switch(dimension) {
      case 'society':
        ['primary_school_enrollment', 'secondary_school_enrollment', 'adult_literacy_rate', 
         'healthcare_access', 'life_expectancy', 'vaccination_rate'].forEach(key => {
          if (data[key as keyof FormData]) {
            total += Number(data[key as keyof FormData]);
            count++;
          }
        });
        break;
      case 'habitat':
        ['water_access', 'electricity_access', 'sanitation_access', 'home_ownership_rate'].forEach(key => {
          if (data[key as keyof FormData]) {
            total += Number(data[key as keyof FormData]);
            count++;
          }
        });
        break;
      // Ajouter les autres dimensions...
    }
    
    return count > 0 ? Math.round(total / count) : 50;
  };

  const generateReportContent = async (data: FormData) => {
    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const formatNumber = (num: string | undefined) => {
        return num ? Number.parseFloat(num).toLocaleString('fr-FR') : 'Non spécifié';
      };

      const formatPercent = (num: string | undefined) => {
        return num ? `${num}%` : 'Non spécifié';
      };

      const formatCurrency = (num: string | undefined) => {
        return num ? `${Number.parseFloat(num).toLocaleString('fr-FR')} USD` : 'Non spécifié';
      };

      const getScoreColor = (value: number) => {
        if (value >= 70) return '🟢';
        if (value >= 40) return '🟡';
        return '🔴';
      };

      const getScoreText = (value: number) => {
        if (value >= 70) return 'Bon';
        if (value >= 40) return 'Moyen';
        return 'Critique';
      };

      const radarData = generateRadarData(data);

      const mockReport = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rapport Diagnostic Urbain Complet - ${data.city}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', sans-serif;
      line-height: 1.6;
      color: #1e293b;
      background: #f8fafc;
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    /* Typographie */
    h1, h2, h3, h4 {
      font-family: 'Playfair Display', serif;
      color: #1e3a5f;
      margin-bottom: 1.5rem;
      font-weight: 600;
    }

    h1 {
      font-size: 2.8rem;
      text-align: center;
      color: #1e3a5f;
      border-bottom: 4px solid #fbbf24;
      padding-bottom: 1rem;
      margin-bottom: 2rem;
    }

    h2 {
      font-size: 2.2rem;
      border-left: 6px solid #fbbf24;
      padding-left: 1.5rem;
      margin: 2.5rem 0 1.5rem 0;
      background: linear-gradient(to right, #f8fafc, transparent);
    }

    h3 {
      font-size: 1.6rem;
      color: #2d3e5f;
      margin: 2rem 0 1rem 0;
    }

    h4 {
      font-size: 1.3rem;
      color: #4a5568;
      margin: 1.5rem 0 1rem 0;
    }

    /* PAGE DE GARDE */
    .cover-page {
      text-align: center;
      background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
      border-radius: 20px;
      padding: 40px 20px;
      margin-bottom: 30px;
      box-shadow: 0 20px 30px -10px rgba(0, 0, 0, 0.15);
      position: relative;
      overflow: hidden;
    }

    .cover-page::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 6px;
      background: linear-gradient(90deg, #1e3a5f, #fbbf24, #10b981, #8b5cf6);
    }

    .cover-page h1 {
      font-size: 3rem;
      border: none;
      margin: 20px 0;
      background: linear-gradient(135deg, #1e3a5f, #2d4a7a);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .cover-page .city-name {
      font-size: 4rem;
      font-weight: 800;
      color: #fbbf24;
      margin: 20px 0;
      text-transform: uppercase;
      letter-spacing: 4px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
    }

    .cover-page .country-name {
      font-size: 2rem;
      color: #4a5568;
      margin: 10px 0;
      font-weight: 400;
    }

    .cover-page .date {
      font-size: 1.2rem;
      color: #64748b;
      margin: 20px 0;
      padding: 10px 30px;
      background: white;
      border-radius: 40px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      display: inline-block;
    }

    .cover-page .institution {
      font-size: 1.1rem;
      color: #334155;
      margin-top: 30px;
      padding: 15px 30px;
      background: rgba(255,255,255,0.9);
      border-radius: 15px;
      border: 1px solid #e2e8f0;
    }

    /* Cards pour les indicateurs */
    .dimension-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 25px;
      margin: 30px 0;
    }

    .dimension-card {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
      transition: transform 0.3s;
    }

    .dimension-card:hover {
      transform: translateY(-5px);
    }

    .dimension-header {
      padding: 20px;
      background: linear-gradient(135deg, #1e3a5f, #2d4a7a);
      color: white;
    }

    .dimension-header h3 {
      color: white;
      margin: 0;
      font-size: 1.4rem;
    }

    .dimension-body {
      padding: 20px;
    }

    .indicator-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #e2e8f0;
    }

    .indicator-item:last-child {
      border-bottom: none;
    }

    .indicator-name {
      color: #64748b;
      font-size: 0.9rem;
    }

    .indicator-value {
      font-weight: 600;
      color: #1e3a5f;
    }

    .indicator-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .badge-high {
      background: #dcfce7;
      color: #059669;
    }

    .badge-medium {
      background: #fef9c3;
      color: #ca8a04;
    }

    .badge-low {
      background: #fee2e2;
      color: #dc2626;
    }

    /* Tableaux de synthèse */
    .summary-table {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      margin: 20px 0;
    }

    .summary-table table {
      width: 100%;
      border-collapse: collapse;
    }

    .summary-table th {
      background: #1e3a5f;
      color: white;
      padding: 15px;
      text-align: left;
    }

    .summary-table td {
      padding: 12px 15px;
      border-bottom: 1px solid #e2e8f0;
    }

    .summary-table tr:last-child td {
      border-bottom: none;
    }

    /* Radar Chart placeholder */
    .radar-container {
      background: white;
      border-radius: 16px;
      padding: 30px;
      margin: 30px 0;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
    }

    .radar-placeholder {
      width: 400px;
      height: 400px;
      margin: 0 auto;
      background: conic-gradient(
        from 0deg,
        #1e3a5f 0deg 51deg,
        #fbbf24 51deg 102deg,
        #10b981 102deg 153deg,
        #ef4444 153deg 204deg,
        #8b5cf6 204deg 255deg,
        #ec4899 255deg 306deg,
        #14b8a6 306deg 360deg
      );
      border-radius: 50%;
      position: relative;
      mask: radial-gradient(circle at center, transparent 50%, black 50%);
    }

    /* Score cards */
    .score-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin: 20px 0;
    }

    .score-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    }

    .score-value {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1e3a5f;
    }

    .score-label {
      color: #64748b;
      font-size: 0.9rem;
      margin-top: 5px;
    }

    .footer {
      margin-top: 60px;
      padding: 40px;
      text-align: center;
      background: linear-gradient(135deg, #1e3a5f, #2d4a7a);
      border-radius: 20px;
      color: white;
    }

    .page-break {
      page-break-after: always;
      margin: 40px 0;
    }

    @media print {
      .page-break {
        page-break-after: always;
      }
    }
  </style>
</head>
<body>

  <!-- PAGE DE GARDE -->
  <div class="cover-page">
    <h1>RAPPORT DE DIAGNOSTIC URBAIN</h1>
    <h1>COMPLET</h1>
    
    <div class="city-name">${data.city?.toUpperCase() || 'VILLE'}</div>
    <div class="country-name">${data.country || 'PAYS'}</div>
    
    <div class="date">
      📅 ${new Date().toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })}
    </div>
    
    <div class="institution">
      <strong>Centre of Urban Systems - UM6P</strong><br>
      <span style="color: #fbbf24;">AfricanCities IA Services</span>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- RÉSUMÉ EXÉCUTIF -->
  <h2>RÉSUMÉ EXÉCUTIF</h2>
  
  <div style="background: white; border-radius: 16px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin: 20px 0;">
    <p style="font-size: 1.1rem; line-height: 1.8; text-align: justify;">
      Le diagnostic urbain complet de <strong>${data.city}</strong> a été réalisé sur la base de <strong>65 indicateurs</strong> répartis en 7 dimensions clés du développement urbain durable. Cette analyse multidimensionnelle permet d'obtenir une vision holistique et systémique des défis et opportunités de la ville.
    </p>
    
    <div class="score-grid">
      <div class="score-card">
        <div class="score-value">${Math.round((Number(data.life_expectancy || '65') + Number(data.adult_literacy_rate || '65')) / 2)}</div>
        <div class="score-label">Score Société</div>
      </div>
      <div class="score-card">
        <div class="score-value">${Math.round((Number(data.water_access || '45') + Number(data.electricity_access || '42')) / 2)}</div>
        <div class="score-label">Score Habitat</div>
      </div>
      <div class="score-card">
        <div class="score-value">${Math.round(Number(data.urban_density || '1200') / 100)}</div>
        <div class="score-label">Score Spatial</div>
      </div>
      <div class="score-card">
        <div class="score-value">${Math.round((Number(data.road_quality_percentage || '40') + Number(data.internet_access || '35')) / 2)}</div>
        <div class="score-label">Score Infrastructure</div>
      </div>
    </div>
  </div>

  <!-- SYNTHÈSE PAR DIMENSION -->
  <h2>SYNTHÈSE PAR DIMENSION</h2>

  <!-- Dimension 1: Société -->
  <div class="dimension-card" style="margin: 30px 0;">
    <div class="dimension-header" style="background: linear-gradient(135deg, #2563eb, #1e40af);">
      <h3>👥 SOCIÉTÉ (12 indicateurs)</h3>
    </div>
    <div class="dimension-body">
      <div class="indicator-item">
        <span class="indicator-name">Taux de scolarisation primaire</span>
        <span class="indicator-value">${formatPercent(data.primary_school_enrollment)}</span>
        <span class="indicator-badge ${Number(data.primary_school_enrollment || '0') >= 70 ? 'badge-high' : Number(data.primary_school_enrollment || '0') >= 40 ? 'badge-medium' : 'badge-low'}">${getScoreText(Number(data.primary_school_enrollment || '0'))}</span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Taux de scolarisation secondaire</span>
        <span class="indicator-value">${formatPercent(data.secondary_school_enrollment)}</span>
        <span class="indicator-badge ${Number(data.secondary_school_enrollment || '0') >= 70 ? 'badge-high' : Number(data.secondary_school_enrollment || '0') >= 40 ? 'badge-medium' : 'badge-low'}">${getScoreText(Number(data.secondary_school_enrollment || '0'))}</span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Taux d'alphabétisation adultes</span>
        <span class="indicator-value">${formatPercent(data.adult_literacy_rate)}</span>
        <span class="indicator-badge ${Number(data.adult_literacy_rate || '0') >= 70 ? 'badge-high' : Number(data.adult_literacy_rate || '0') >= 40 ? 'badge-medium' : 'badge-low'}">${getScoreText(Number(data.adult_literacy_rate || '0'))}</span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Taux de criminalité</span>
        <span class="indicator-value">${data.crime_rate} pour 1000 hab.</span>
        <span class="indicator-badge ${Number(data.crime_rate || '15') <= 10 ? 'badge-high' : Number(data.crime_rate || '15') <= 20 ? 'badge-medium' : 'badge-low'}">${Number(data.crime_rate || '15') <= 10 ? 'Faible' : Number(data.crime_rate || '15') <= 20 ? 'Modéré' : 'Élevé'}</span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Perception de sécurité</span>
        <span class="indicator-value">${formatPercent(data.safety_perception)}</span>
        <span class="indicator-badge ${Number(data.safety_perception || '0') >= 70 ? 'badge-high' : Number(data.safety_perception || '0') >= 40 ? 'badge-medium' : 'badge-low'}">${getScoreText(Number(data.safety_perception || '0'))}</span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Accès aux soins de base</span>
        <span class="indicator-value">${formatPercent(data.healthcare_access)}</span>
        <span class="indicator-badge ${Number(data.healthcare_access || '0') >= 70 ? 'badge-high' : Number(data.healthcare_access || '0') >= 40 ? 'badge-medium' : 'badge-low'}">${getScoreText(Number(data.healthcare_access || '0'))}</span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Médecins pour 10 000 hab.</span>
        <span class="indicator-value">${data.doctors_per_10000}</span>
        <span class="indicator-badge ${Number(data.doctors_per_10000 || '2.5') >= 5 ? 'badge-high' : Number(data.doctors_per_10000 || '2.5') >= 2 ? 'badge-medium' : 'badge-low'}">${Number(data.doctors_per_10000 || '2.5') >= 5 ? 'Bon' : Number(data.doctors_per_10000 || '2.5') >= 2 ? 'Moyen' : 'Critique'}</span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Espérance de vie</span>
        <span class="indicator-value">${data.life_expectancy} ans</span>
        <span class="indicator-badge ${Number(data.life_expectancy || '65') >= 75 ? 'badge-high' : Number(data.life_expectancy || '65') >= 65 ? 'badge-medium' : 'badge-low'}">${Number(data.life_expectancy || '65') >= 75 ? 'Bon' : Number(data.life_expectancy || '65') >= 65 ? 'Moyen' : 'Critique'}</span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Mortalité infantile</span>
        <span class="indicator-value">${data.infant_mortality} ‰</span>
        <span class="indicator-badge ${Number(data.infant_mortality || '45') <= 20 ? 'badge-high' : Number(data.infant_mortality || '45') <= 40 ? 'badge-medium' : 'badge-low'}">${Number(data.infant_mortality || '45') <= 20 ? 'Faible' : Number(data.infant_mortality || '45') <= 40 ? 'Modéré' : 'Élevé'}</span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Taux de vaccination</span>
        <span class="indicator-value">${formatPercent(data.vaccination_rate)}</span>
        <span class="indicator-badge ${Number(data.vaccination_rate || '0') >= 90 ? 'badge-high' : Number(data.vaccination_rate || '0') >= 70 ? 'badge-medium' : 'badge-low'}">${getScoreText(Number(data.vaccination_rate || '0'))}</span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Taux de pauvreté urbaine</span>
        <span class="indicator-value">${formatPercent(data.urban_poverty_rate)}</span>
        <span class="indicator-badge ${Number(data.urban_poverty_rate || '35') <= 20 ? 'badge-high' : Number(data.urban_poverty_rate || '35') <= 40 ? 'badge-medium' : 'badge-low'}">${Number(data.urban_poverty_rate || '35') <= 20 ? 'Faible' : Number(data.urban_poverty_rate || '35') <= 40 ? 'Modéré' : 'Élevé'}</span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Indice d'inclusion sociale</span>
        <span class="indicator-value">${formatPercent(data.social_inclusion_index)}</span>
        <span class="indicator-badge ${Number(data.social_inclusion_index || '0') >= 70 ? 'badge-high' : Number(data.social_inclusion_index || '0') >= 40 ? 'badge-medium' : 'badge-low'}">${getScoreText(Number(data.social_inclusion_index || '0'))}</span>
      </div>
    </div>
  </div>

  <!-- Dimension 2: Habitat -->
  <div class="dimension-card" style="margin: 30px 0;">
    <div class="dimension-header" style="background: linear-gradient(135deg, #059669, #047857);">
      <h3>🏠 HABITAT (9 indicateurs)</h3>
    </div>
    <div class="dimension-body">
      <div class="indicator-item">
        <span class="indicator-name">Accès eau potable</span>
        <span class="indicator-value">${formatPercent(data.water_access)}</span>
        <span class="indicator-badge ${Number(data.water_access || '0') >= 70 ? 'badge-high' : Number(data.water_access || '0') >= 40 ? 'badge-medium' : 'badge-low'}">${getScoreText(Number(data.water_access || '0'))}</span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Accès électricité</span>
        <span class="indicator-value">${formatPercent(data.electricity_access)}</span>
        <span class="indicator-badge ${Number(data.electricity_access || '0') >= 70 ? 'badge-high' : Number(data.electricity_access || '0') >= 40 ? 'badge-medium' : 'badge-low'}">${getScoreText(Number(data.electricity_access || '0'))}</span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Indice de surpeuplement</span>
        <span class="indicator-value">${data.housing_overcrowding} pers/pièce</span>
        <span class="indicator-badge ${Number(data.housing_overcrowding || '4.5') <= 2 ? 'badge-high' : Number(data.housing_overcrowding || '4.5') <= 3 ? 'badge-medium' : 'badge-low'}">${Number(data.housing_overcrowding || '4.5') <= 2 ? 'Bon' : Number(data.housing_overcrowding || '4.5') <= 3 ? 'Moyen' : 'Critique'}</span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Habitat informel</span>
        <span class="indicator-value">${formatPercent(data.informal_housing_percentage)}</span>
        <span class="indicator-badge ${Number(data.informal_housing_percentage || '40') <= 20 ? 'badge-high' : Number(data.informal_housing_percentage || '40') <= 40 ? 'badge-medium' : 'badge-low'}">${Number(data.informal_housing_percentage || '40') <= 20 ? 'Faible' : Number(data.informal_housing_percentage || '40') <= 40 ? 'Modéré' : 'Élevé'}</span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Coût logement (USD/m²)</span>
        <span class="indicator-value">${formatCurrency(data.housing_cost_per_m2)}</span>
        <span class="indicator-badge">À contextualiser</span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Taux d'accession à la propriété</span>
        <span class="indicator-value">${formatPercent(data.home_ownership_rate)}</span>
        <span class="indicator-badge ${Number(data.home_ownership_rate || '0') >= 60 ? 'badge-high' : Number(data.home_ownership_rate || '0') >= 40 ? 'badge-medium' : 'badge-low'}">${getScoreText(Number(data.home_ownership_rate || '0'))}</span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Accès assainissement amélioré</span>
        <span class="indicator-value">${formatPercent(data.sanitation_access)}</span>
        <span class="indicator-badge ${Number(data.sanitation_access || '0') >= 70 ? 'badge-high' : Number(data.sanitation_access || '0') >= 40 ? 'badge-medium' : 'badge-low'}">${getScoreText(Number(data.sanitation_access || '0'))}</span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Sans-abrisme</span>
        <span class="indicator-value">${data.homelessness_rate}%</span>
        <span class="indicator-badge ${Number(data.homelessness_rate || '2') <= 0.5 ? 'badge-high' : Number(data.homelessness_rate || '2') <= 1 ? 'badge-medium' : 'badge-low'}">${Number(data.homelessness_rate || '2') <= 0.5 ? 'Faible' : Number(data.homelessness_rate || '2') <= 1 ? 'Modéré' : 'Élevé'}</span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Satisfaction logement</span>
        <span class="indicator-value">${formatPercent(data.housing_satisfaction_rate)}</span>
        <span class="indicator-badge ${Number(data.housing_satisfaction_rate || '0') >= 70 ? 'badge-high' : Number(data.housing_satisfaction_rate || '0') >= 40 ? 'badge-medium' : 'badge-low'}">${getScoreText(Number(data.housing_satisfaction_rate || '0'))}</span>
      </div>
    </div>
  </div>

  <!-- Dimension 3: Développement Spatial -->
  <div class="dimension-card" style="margin: 30px 0;">
    <div class="dimension-header" style="background: linear-gradient(135deg, #7c3aed, #6d28d9);">
      <h3>🗺️ DÉVELOPPEMENT SPATIAL (8 indicateurs)</h3>
    </div>
    <div class="dimension-body">
      <div class="indicator-item">
        <span class="indicator-name">Densité urbaine</span>
        <span class="indicator-value">${Number(data.urban_density || '1200').toLocaleString('fr-FR')} hab/km²</span>
        <span class="indicator-badge">À analyser</span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Espaces verts par habitant</span>
        <span class="indicator-value">${data.green_space_per_capita} m²</span>
        <span class="indicator-badge ${Number(data.green_space_per_capita || '5') >= 10 ? 'badge-high' : Number(data.green_space_per_capita || '5') >= 5 ? 'badge-medium' : 'badge-low'}">${Number(data.green_space_per_capita || '5') >= 10 ? 'Bon' : Number(data.green_space_per_capita || '5') >= 5 ? 'Moyen' : 'Critique'}</span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Accès transport public</span>
        <span class="indicator-value">${formatPercent(data.public_transport_access)}</span>
        <span class="indicator-badge ${Number(data.public_transport_access || '0') >= 70 ? 'badge-high' : Number(data.public_transport_access || '0') >= 40 ? 'badge-medium' : 'badge-low'}">${getScoreText(Number(data.public_transport_access || '0'))}</span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Distance domicile-travail</span>
        <span class="indicator-value">${data.home_work_distance} km</span>
        <span class="indicator-badge ${Number(data.home_work_distance || '8') <= 5 ? 'badge-high' : Number(data.home_work_distance || '8') <= 10 ? 'badge-medium' : 'badge-low'}">${Number(data.home_work_distance || '8') <= 5 ? 'Faible' : Number(data.home_work_distance || '8') <= 10 ? 'Modéré' : 'Élevé'}</span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Taux d'urbanisation annuel</span>
        <span class="indicator-value">${data.urbanization_rate}%</span>
        <span class="indicator-badge">${Number(data.urbanization_rate || '3.5') >= 3 ? 'Croissance rapide' : 'Croissance modérée'}</span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Quartiers planifiés/informels</span>
        <span class="indicator-value">${data.planned_vs_informal_ratio}% planifiés</span>
        <span class="indicator-badge ${Number(data.planned_vs_informal_ratio || '30') >= 60 ? 'badge-high' : Number(data.planned_vs_informal_ratio || '30') >= 30 ? 'badge-medium' : 'badge-low'}">${Number(data.planned_vs_informal_ratio || '30') >= 60 ? 'Bon' : Number(data.planned_vs_informal_ratio || '30') >= 30 ? 'Moyen' : 'Critique'}</span>
      </div>
    </div>
  </div>

  <!-- Suite des dimensions... -->

  <div class="page-break"></div>

  <!-- SYNTHÈSE RADAR -->
  <h2>ANALYSE MULTIDIMENSIONNELLE</h2>
  
  <div class="radar-container">
    <h3 style="text-align: center;">Score par dimension</h3>
    <div style="display: flex; justify-content: center; padding: 20px;">
      <div style="width: 500px; height: 500px; background: #f8fafc; border-radius: 50%; position: relative;">
        <svg viewBox="0 0 100 100" style="width: 100%; height: 100%;">
          <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" fill="none" stroke="#cbd5e1" stroke-width="0.5"/>
          <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" fill="rgba(30,58,95,0.2)" stroke="#1e3a5f" stroke-width="2"/>
          <!-- Ajouter les points pour chaque dimension -->
          <circle cx="50" cy="5" r="3" fill="#2563eb"/>
          <circle cx="95" cy="27.5" r="3" fill="#059669"/>
          <circle cx="95" cy="72.5" r="3" fill="#7c3aed"/>
          <circle cx="50" cy="95" r="3" fill="#fbbf24"/>
          <circle cx="5" cy="72.5" r="3" fill="#ef4444"/>
          <circle cx="5" cy="27.5" r="3" fill="#8b5cf6"/>
        </svg>
      </div>
    </div>
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 20px;">
      <div><span style="color: #2563eb;">●</span> Société: ${calculateDimensionScore(data, 'society')}</div>
      <div><span style="color: #059669;">●</span> Habitat: ${calculateDimensionScore(data, 'habitat')}</div>
      <div><span style="color: #7c3aed;">●</span> Spatial: ${calculateDimensionScore(data, 'spatial')}</div>
      <div><span style="color: #fbbf24;">●</span> Infrastructure: ${calculateDimensionScore(data, 'infrastructure')}</div>
      <div><span style="color: #ef4444;">●</span> Environnement: ${calculateDimensionScore(data, 'environment')}</div>
      <div><span style="color: #8b5cf6;">●</span> Gouvernance: ${calculateDimensionScore(data, 'governance')}</div>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- RECOMMANDATIONS SPÉCIFIQUES -->
  <h2>RECOMMANDATIONS STRATÉGIQUES</h2>
  
  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 25px; margin: 30px 0;">
    <div style="background: white; border-radius: 16px; padding: 25px; border-left: 6px solid #2563eb;">
      <h4 style="margin-top: 0; color: #2563eb;">Priorité 1 - Société</h4>
      <ul style="list-style: none; padding: 0;">
        <li style="margin-bottom: 10px;">✓ Renforcer l'accès à l'éducation secondaire (actuel: ${formatPercent(data.secondary_school_enrollment)})</li>
        <li style="margin-bottom: 10px;">✓ Améliorer la couverture sanitaire (actuel: ${formatPercent(data.healthcare_access)})</li>
        <li style="margin-bottom: 10px;">✓ Développer des programmes d'inclusion sociale</li>
      </ul>
    </div>
    
    <div style="background: white; border-radius: 16px; padding: 25px; border-left: 6px solid #059669;">
      <h4 style="margin-top: 0; color: #059669;">Priorité 2 - Habitat</h4>
      <ul style="list-style: none; padding: 0;">
        <li style="margin-bottom: 10px;">✓ Accélérer l'accès à l'eau potable (actuel: ${formatPercent(data.water_access)})</li>
        <li style="margin-bottom: 10px;">✓ Résorption de l'habitat informel (actuel: ${formatPercent(data.informal_housing_percentage)})</li>
        <li style="margin-bottom: 10px;">✓ Améliorer l'assainissement (actuel: ${formatPercent(data.sanitation_access)})</li>
      </ul>
    </div>
    
    <div style="background: white; border-radius: 16px; padding: 25px; border-left: 6px solid #7c3aed;">
      <h4 style="margin-top: 0; color: #7c3aed;">Priorité 3 - Spatial</h4>
      <ul style="list-style: none; padding: 0;">
        <li style="margin-bottom: 10px;">✓ Augmenter les espaces verts (actuel: ${data.green_space_per_capita} m²/hab)</li>
        <li style="margin-bottom: 10px;">✓ Améliorer l'accès au transport public (actuel: ${formatPercent(data.public_transport_access)})</li>
        <li style="margin-bottom: 10px;">✓ Renforcer la planification urbaine</li>
      </ul>
    </div>
    
    <div style="background: white; border-radius: 16px; padding: 25px; border-left: 6px solid #fbbf24;">
      <h4 style="margin-top: 0; color: #fbbf24;">Priorité 4 - Infrastructures</h4>
      <ul style="list-style: none; padding: 0;">
        <li style="margin-bottom: 10px;">✓ Améliorer la qualité des routes (actuel: ${formatPercent(data.road_quality_percentage)})</li>
        <li style="margin-bottom: 10px;">✓ Développer l'accès Internet (actuel: ${formatPercent(data.internet_access)})</li>
        <li style="margin-bottom: 10px;">✓ Renforcer la fiabilité électrique</li>
      </ul>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- INDICATEURS DE GOUVERNANCE -->
  <h2>ANALYSE DE LA GOUVERNANCE</h2>
  
  <div class="summary-table">
    <table>
      <thead>
        <tr>
          <th>Indicateur</th>
          <th>Valeur</th>
          <th>Évaluation</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Indice de perception corruption</td>
          <td>${data.corruption_index}/100</td>
          <td><span class="indicator-badge ${Number(data.corruption_index || '35') >= 60 ? 'badge-high' : Number(data.corruption_index || '35') >= 40 ? 'badge-medium' : 'badge-low'}">${Number(data.corruption_index || '35') >= 60 ? 'Bon' : Number(data.corruption_index || '35') >= 40 ? 'Moyen' : 'Faible'}</span></td>
        </tr>
        <tr>
          <td>Participation électorale</td>
          <td>${formatPercent(data.voter_turnout)}</td>
          <td><span class="indicator-badge ${Number(data.voter_turnout || '0') >= 60 ? 'badge-high' : Number(data.voter_turnout || '0') >= 40 ? 'badge-medium' : 'badge-low'}">${getScoreText(Number(data.voter_turnout || '0'))}</span></td>
        </tr>
        <tr>
          <td>Conseil municipal élu</td>
          <td>${data.elected_council_exists}</td>
          <td><span class="indicator-badge badge-high">✓ Conforme</span></td>
        </tr>
        <tr>
          <td>Satisfaction services publics</td>
          <td>${formatPercent(data.public_service_satisfaction)}</td>
          <td><span class="indicator-badge ${Number(data.public_service_satisfaction || '0') >= 70 ? 'badge-high' : Number(data.public_service_satisfaction || '0') >= 40 ? 'badge-medium' : 'badge-low'}">${getScoreText(Number(data.public_service_satisfaction || '0'))}</span></td>
        </tr>
        <tr>
          <td>Accès données ouvertes</td>
          <td>${formatPercent(data.open_data_access)}</td>
          <td><span class="indicator-badge ${Number(data.open_data_access || '0') >= 70 ? 'badge-high' : Number(data.open_data_access || '0') >= 40 ? 'badge-medium' : 'badge-low'}">${getScoreText(Number(data.open_data_access || '0'))}</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- INDICATEURS ÉCONOMIQUES -->
  <h2>ANALYSE ÉCONOMIQUE</h2>
  
  <div class="summary-table">
    <table>
      <thead>
        <tr>
          <th>Indicateur</th>
          <th>Valeur</th>
          <th>Tendance</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Taux de chômage</td>
          <td>${formatPercent(data.unemployment_rate)}</td>
          <td><span class="indicator-badge badge-medium">⚠️ Préoccupant</span></td>
        </tr>
        <tr>
          <td>Emploi formel</td>
          <td>${formatPercent(data.formal_employment_rate)}</td>
          <td><span class="indicator-badge badge-low">🔴 Très faible</span></td>
        </tr>
        <tr>
          <td>Croissance PIB</td>
          <td>${data.gdp_growth_rate}%</td>
          <td><span class="indicator-badge badge-high">📈 Positive</span></td>
        </tr>
        <tr>
          <td>Investissements FDI</td>
          <td>${data.fdi_attractiveness}/100</td>
          <td><span class="indicator-badge badge-medium">📊 Modéré</span></td>
        </tr>
        <tr>
          <td>Revenu moyen/hab</td>
          <td>${formatCurrency(data.income_per_capita)}</td>
          <td><span class="indicator-badge">À améliorer</span></td>
        </tr>
        <tr>
          <td>Économie verte/digitale</td>
          <td>${formatPercent(data.green_digital_economy_share)}</td>
          <td><span class="indicator-badge badge-low">🔴 Émergente</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="page-break"></div>

  <!-- CONCLUSION -->
  <h2>CONCLUSION ET PERSPECTIVES</h2>
  
  <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2d4a7a 100%); color: white; padding: 40px; border-radius: 20px; margin: 30px 0;">
    <h3 style="color: #fbbf24; margin-top: 0;">Synthèse du diagnostic 65 indicateurs</h3>
    
    <p style="margin: 20px 0; font-size: 1.1rem;">
      L'analyse complète des 65 indicateurs répartis en 7 dimensions révèle une ville en transition, avec des forces significatives dans certains domaines mais des défis majeurs dans d'autres.
    </p>
    
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 30px 0;">
      <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 12px;">
        <div style="font-size: 2rem; font-weight: bold; color: #fbbf24;">7</div>
        <div>Dimensions analysées</div>
      </div>
      <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 12px;">
        <div style="font-size: 2rem; font-weight: bold; color: #fbbf24;">65</div>
        <div>Indicateurs évalués</div>
      </div>
      <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 12px;">
        <div style="font-size: 2rem; font-weight: bold; color: #fbbf24;">${documents.length}</div>
        <div>Documents analysés</div>
      </div>
    </div>
    
    <p style="text-align: center; font-style: italic; margin-top: 20px;">
      "Un diagnostic complet est la première étape vers une transformation urbaine durable et inclusive."
    </p>
  </div>

  <!-- FOOTER -->
  <div class="footer">
    <p style="font-size: 1.3rem; margin-bottom: 20px;"><strong>Rapport généré par AfricanCities IA Services</strong></p>
    <p>Centre of Urban Systems - UM6P</p>
    <p style="margin-top: 20px;">65 indicateurs · 7 dimensions · Analyse multidimensionnelle</p>
    
    ${documents.length > 0 ? `
    <div style="margin: 30px 0;">
      <p style="font-size: 1.1rem; margin-bottom: 15px;">📄 Documents analysés :</p>
      <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;">
        ${documents.map((d: DocumentContent) => `
          <span style="background: rgba(255,255,255,0.15); padding: 8px 16px; border-radius: 30px; font-size: 0.9rem;">
            ${d.filename}
          </span>
        `).join('')}
      </div>
    </div>` : ''}
    
    <hr style="border-color: rgba(255,255,255,0.2); margin: 30px 0;">
    
    <p style="opacity: 0.7;">© ${new Date().getFullYear()} - Tous droits réservés</p>
    <p style="opacity: 0.5; font-size: 0.9rem;">Rapport confidentiel - Usage interne</p>
  </div>

</body>
</html>
      `;
      
      setGeneratedContent(mockReport);
      setActiveTab("result");
      
      toast({
        title: "Succès !",
        description: "Le rapport complet a été généré avec succès.",
      });
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de générer le rapport.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const getDimensionIcon = (dimensionId: string) => {
    const dimension = dimensions.find(d => d.id === dimensionId);
    return dimension?.icon || MapPin;
  };

  return (
    <LayoutShell>
      <div className="max-w-7xl mx-auto pb-12">
        {/* Header avec style professionnel */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-2xl p-8 mb-8 shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur">
              <Building className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold">AfricanCities IA Services</h1>
              <p className="text-white/80 text-lg">Diagnostic Urbain Complet - 65 Indicateurs</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {dimensions.map(dim => (
              <span key={dim.id} className="text-xs bg-white/10 px-3 py-1 rounded-full">
                {dim.name} ({dim.indicators})
              </span>
            ))}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="form" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Saisie des 65 indicateurs
            </TabsTrigger>
            <TabsTrigger value="result" disabled={!generatedContent} className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Rapport complet
            </TabsTrigger>
          </TabsList>

          <TabsContent value="form">
            {/* Barre de configuration */}
            <Card className="mb-6 border-l-4 border-l-secondary">
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Globe className={`w-5 h-5 ${enableWebSearch ? 'text-secondary' : 'text-muted-foreground'}`} />
                      <span className="text-sm font-medium">Recherche web</span>
                    </div>
                    <Button
                      variant={enableWebSearch ? "default" : "outline"}
                      size="sm"
                      onClick={() => setEnableWebSearch(!enableWebSearch)}
                      className={enableWebSearch ? "bg-secondary text-primary-foreground" : ""}
                    >
                      {enableWebSearch ? "Activée" : "Désactivée"}
                    </Button>
                  </div>
                  
                  {webData?.wikipedia_info?.found && (
                    <div className="flex items-center gap-2 text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                      <Info className="w-4 h-4" />
                      <span>Données Wikipedia disponibles</span>
                      <a 
                        href={webData.wikipedia_info.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <form onSubmit={handleSubmit(generateReportContent)}>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Navigation par dimensions - Colonne de gauche */}
                <div className="lg:col-span-1">
                  <Card className="sticky top-4">
                    <CardHeader>
                      <CardTitle className="text-lg">Dimensions</CardTitle>
                      <CardDescription>7 dimensions · 65 indicateurs</CardDescription>
                    </CardHeader>
                    <CardContent className="p-2">
                      <div className="space-y-1">
                        {dimensions.map((dim) => {
                          const Icon = dim.icon;
                          const isActive = activeDimension === dim.id;
                          return (
                            <button
                              key={dim.id}
                              type="button"
                              onClick={() => setActiveDimension(dim.id)}
                              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                                isActive 
                                  ? `${dim.bg} ${dim.color} font-medium shadow-sm` 
                                  : 'hover:bg-muted/50'
                              }`}
                            >
                              <Icon className={`w-4 h-4 ${isActive ? dim.color : 'text-muted-foreground'}`} />
                              <span className="text-sm flex-1 text-left">{dim.name}</span>
                              <span className="text-xs bg-muted px-2 py-1 rounded-full">
                                {dim.indicators}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Formulaire détaillé - Colonne de droite */}
                <div className="lg:col-span-3 space-y-6">
                  {/* Informations Générales - Toujours visible */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-primary" />
                        <CardTitle>Informations Générales</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">Ville *</Label>
                          <Input id="city" {...register("city")} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">Pays *</Label>
                          <Input id="country" {...register("country")} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="region">Région/Province</Label>
                          <Input id="region" {...register("region")} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="diagnostic_date">Date du diagnostic</Label>
                          <Input id="diagnostic_date" type="date" {...register("diagnostic_date")} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Dimension Société - 12 indicateurs */}
                  {activeDimension === 'society' && (
                    <Card className="border-t-4 border-t-blue-600">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <Users className="w-5 h-5 text-blue-600" />
                          <CardTitle>Société (12 indicateurs)</CardTitle>
                        </div>
                        <CardDescription>
                          Éducation, santé, sécurité, inclusion sociale
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="primary_school_enrollment">Taux de scolarisation primaire (%)</Label>
                            <Input id="primary_school_enrollment" type="number" {...register("primary_school_enrollment")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="secondary_school_enrollment">Taux de scolarisation secondaire (%)</Label>
                            <Input id="secondary_school_enrollment" type="number" {...register("secondary_school_enrollment")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="adult_literacy_rate">Taux d'alphabétisation adultes (%)</Label>
                            <Input id="adult_literacy_rate" type="number" {...register("adult_literacy_rate")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="crime_rate">Taux de criminalité (pour 1000 hab.)</Label>
                            <Input id="crime_rate" type="number" step="0.1" {...register("crime_rate")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="safety_perception">Perception de sécurité (%)</Label>
                            <Input id="safety_perception" type="number" {...register("safety_perception")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="healthcare_access">Accès aux soins de base (%)</Label>
                            <Input id="healthcare_access" type="number" {...register("healthcare_access")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="doctors_per_10000">Médecins pour 10 000 hab.</Label>
                            <Input id="doctors_per_10000" type="number" step="0.1" {...register("doctors_per_10000")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="life_expectancy">Espérance de vie (ans)</Label>
                            <Input id="life_expectancy" type="number" {...register("life_expectancy")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="infant_mortality">Mortalité infantile (‰)</Label>
                            <Input id="infant_mortality" type="number" {...register("infant_mortality")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="vaccination_rate">Taux de vaccination DTP3 (%)</Label>
                            <Input id="vaccination_rate" type="number" {...register("vaccination_rate")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="urban_poverty_rate">Taux de pauvreté urbaine (%)</Label>
                            <Input id="urban_poverty_rate" type="number" {...register("urban_poverty_rate")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="social_inclusion_index">Indice d'inclusion sociale (%)</Label>
                            <Input id="social_inclusion_index" type="number" {...register("social_inclusion_index")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="community_participation_rate">Participation communautaire (%)</Label>
                            <Input id="community_participation_rate" type="number" {...register("community_participation_rate")} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Dimension Habitat - 9 indicateurs */}
                  {activeDimension === 'habitat' && (
                    <Card className="border-t-4 border-t-emerald-600">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <Home className="w-5 h-5 text-emerald-600" />
                          <CardTitle>Habitat (9 indicateurs)</CardTitle>
                        </div>
                        <CardDescription>
                          Logement, services de base, qualité de l'habitat
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="water_access">Accès eau potable (%)</Label>
                            <Input id="water_access" type="number" {...register("water_access")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="electricity_access">Accès électricité (%)</Label>
                            <Input id="electricity_access" type="number" {...register("electricity_access")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="housing_overcrowding">Indice de surpeuplement (pers/pièce)</Label>
                            <Input id="housing_overcrowding" type="number" step="0.1" {...register("housing_overcrowding")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="informal_housing_percentage">Habitat informel (%)</Label>
                            <Input id="informal_housing_percentage" type="number" {...register("informal_housing_percentage")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="housing_cost_per_m2">Coût logement (USD/m²)</Label>
                            <Input id="housing_cost_per_m2" type="number" {...register("housing_cost_per_m2")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="home_ownership_rate">Taux d'accession à la propriété (%)</Label>
                            <Input id="home_ownership_rate" type="number" {...register("home_ownership_rate")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="sanitation_access">Accès assainissement amélioré (%)</Label>
                            <Input id="sanitation_access" type="number" {...register("sanitation_access")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="homelessness_rate">Taux de sans-abrisme (%)</Label>
                            <Input id="homelessness_rate" type="number" step="0.1" {...register("homelessness_rate")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="housing_satisfaction_rate">Satisfaction logement (%)</Label>
                            <Input id="housing_satisfaction_rate" type="number" {...register("housing_satisfaction_rate")} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Dimension Développement Spatial - 8 indicateurs */}
                  {activeDimension === 'spatial' && (
                    <Card className="border-t-4 border-t-purple-600">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <Map className="w-5 h-5 text-purple-600" />
                          <CardTitle>Développement Spatial (8 indicateurs)</CardTitle>
                        </div>
                        <CardDescription>
                          Densité, espaces verts, mobilité, planification
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="urban_density">Densité urbaine (hab/km²)</Label>
                            <Input id="urban_density" type="number" {...register("urban_density")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="green_space_per_capita">Espaces verts (m²/hab)</Label>
                            <Input id="green_space_per_capita" type="number" {...register("green_space_per_capita")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="public_transport_access">Accès transport public (%)</Label>
                            <Input id="public_transport_access" type="number" {...register("public_transport_access")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="home_work_distance">Distance domicile-travail (km)</Label>
                            <Input id="home_work_distance" type="number" step="0.1" {...register("home_work_distance")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="urbanization_rate">Taux d'urbanisation annuel (%)</Label>
                            <Input id="urbanization_rate" type="number" step="0.1" {...register("urbanization_rate")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="planned_vs_informal_ratio">Quartiers planifiés (%)</Label>
                            <Input id="planned_vs_informal_ratio" type="number" {...register("planned_vs_informal_ratio")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="functional_mix_index">Indice de mixité fonctionnelle (%)</Label>
                            <Input id="functional_mix_index" type="number" {...register("functional_mix_index")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="sports_cultural_access">Accès équipements sportifs/culturels (%)</Label>
                            <Input id="sports_cultural_access" type="number" {...register("sports_cultural_access")} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Dimension Infrastructures - 9 indicateurs */}
                  {activeDimension === 'infrastructure' && (
                    <Card className="border-t-4 border-t-amber-600">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <Zap className="w-5 h-5 text-amber-600" />
                          <CardTitle>Infrastructures (9 indicateurs)</CardTitle>
                        </div>
                        <CardDescription>
                          Routes, numérique, fiabilité des services
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="road_quality_percentage">Qualité des routes (% pavées)</Label>
                            <Input id="road_quality_percentage" type="number" {...register("road_quality_percentage")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="road_length_per_capita">Longueur routes par habitant (km/1000 hab.)</Label>
                            <Input id="road_length_per_capita" type="number" step="0.1" {...register("road_length_per_capita")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="internet_access">Accès Internet haut-débit (%)</Label>
                            <Input id="internet_access" type="number" {...register("internet_access")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="mobile_penetration">Taux de pénétration mobile (%)</Label>
                            <Input id="mobile_penetration" type="number" {...register("mobile_penetration")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="water_reliability">Fiabilité eau (heures de coupure/semaine)</Label>
                            <Input id="water_reliability" type="number" {...register("water_reliability")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="electricity_reliability">Fiabilité électricité (heures de coupure/semaine)</Label>
                            <Input id="electricity_reliability" type="number" {...register("electricity_reliability")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="public_transport_capacity">Capacité transport public (places/km/jour)</Label>
                            <Input id="public_transport_capacity" type="number" {...register("public_transport_capacity")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="motorization_rate">Taux de motorisation (véhicules/1000 hab.)</Label>
                            <Input id="motorization_rate" type="number" {...register("motorization_rate")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="accessibility_pmr">Accessibilité PMR (%)</Label>
                            <Input id="accessibility_pmr" type="number" {...register("accessibility_pmr")} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Dimension Environnement - 9 indicateurs */}
                  {activeDimension === 'environment' && (
                    <Card className="border-t-4 border-t-green-600">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <TreePine className="w-5 h-5 text-green-600" />
                          <CardTitle>Environnement (9 indicateurs)</CardTitle>
                        </div>
                        <CardDescription>
                          Qualité de l'air, déchets, climat, énergie
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="air_quality_pm25">Qualité de l'air (PM2.5 annuel)</Label>
                            <Input id="air_quality_pm25" type="number" {...register("air_quality_pm25")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="waste_collection_rate">Taux de collecte des déchets (%)</Label>
                            <Input id="waste_collection_rate" type="number" {...register("waste_collection_rate")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="waste_recycling_rate">Taux de recyclage des déchets (%)</Label>
                            <Input id="waste_recycling_rate" type="number" {...register("waste_recycling_rate")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="sanitation_coverage">Accès à l'assainissement (%)</Label>
                            <Input id="sanitation_coverage" type="number" {...register("sanitation_coverage")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="climate_vulnerability_index">Indice de vulnérabilité climatique</Label>
                            <Input id="climate_vulnerability_index" type="number" {...register("climate_vulnerability_index")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="heatwave_days_per_year">Jours de canicule par an</Label>
                            <Input id="heatwave_days_per_year" type="number" {...register("heatwave_days_per_year")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="renewable_energy_share">Part d'énergies renouvelables (%)</Label>
                            <Input id="renewable_energy_share" type="number" {...register("renewable_energy_share")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="urban_deforestation_rate">Taux de déforestation urbaine (%)</Label>
                            <Input id="urban_deforestation_rate" type="number" step="0.1" {...register("urban_deforestation_rate")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="climate_adaptation_plan">Plan d'adaptation climatique</Label>
                            <Input id="climate_adaptation_plan" {...register("climate_adaptation_plan")} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Dimension Gouvernance - 7 indicateurs */}
                  {activeDimension === 'governance' && (
                    <Card className="border-t-4 border-t-indigo-600">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <Scale className="w-5 h-5 text-indigo-600" />
                          <CardTitle>Gouvernance (7 indicateurs)</CardTitle>
                        </div>
                        <CardDescription>
                          Transparence, participation, satisfaction citoyenne
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="corruption_index">Indice de perception de la corruption</Label>
                            <Input id="corruption_index" type="number" {...register("corruption_index")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="voter_turnout">Taux de participation électorale (%)</Label>
                            <Input id="voter_turnout" type="number" {...register("voter_turnout")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="elected_council_exists">Conseil municipal élu</Label>
                            <select 
                              id="elected_council_exists" 
                              {...register("elected_council_exists")}
                              className="w-full rounded-md border border-input bg-background px-3 py-2"
                            >
                              <option value="Oui">Oui</option>
                              <option value="Non">Non</option>
                              <option value="En partie">En partie</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="public_service_satisfaction">Satisfaction services publics (%)</Label>
                            <Input id="public_service_satisfaction" type="number" {...register("public_service_satisfaction")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="open_data_access">Accès aux données ouvertes (%)</Label>
                            <Input id="open_data_access" type="number" {...register("open_data_access")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="political_stability_index">Indice de stabilité politique</Label>
                            <Input id="political_stability_index" type="number" {...register("political_stability_index")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="citizen_initiatives_supported">Initiatives citoyennes soutenues (nombre/an)</Label>
                            <Input id="citizen_initiatives_supported" type="number" {...register("citizen_initiatives_supported")} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Dimension Économie - 10 indicateurs */}
                  {activeDimension === 'economy' && (
                    <Card className="border-t-4 border-t-rose-600">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <TrendingUp className="w-5 h-5 text-rose-600" />
                          <CardTitle>Économie (10 indicateurs)</CardTitle>
                        </div>
                        <CardDescription>
                          Emploi, croissance, investissements, revenus
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="unemployment_rate">Taux de chômage urbain (%)</Label>
                            <Input id="unemployment_rate" type="number" {...register("unemployment_rate")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="formal_employment_rate">Taux d'emploi formel/informel (%)</Label>
                            <Input id="formal_employment_rate" type="number" {...register("formal_employment_rate")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="gdp_growth_rate">Croissance du PIB local/régional (%)</Label>
                            <Input id="gdp_growth_rate" type="number" step="0.1" {...register("gdp_growth_rate")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="fdi_attractiveness">Attractivité des investissements (nb projets FDI)</Label>
                            <Input id="fdi_attractiveness" type="number" {...register("fdi_attractiveness")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="business_creation_rate">Taux de création d'entreprises</Label>
                            <Input id="business_creation_rate" type="number" {...register("business_creation_rate")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="income_per_capita">Revenu moyen par habitant (USD)</Label>
                            <Input id="income_per_capita" type="number" {...register("income_per_capita")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="microcredit_access_rate">Accès au microcrédit (%)</Label>
                            <Input id="microcredit_access_rate" type="number" {...register("microcredit_access_rate")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cost_of_living_index">Indice du coût de la vie</Label>
                            <Input id="cost_of_living_index" type="number" {...register("cost_of_living_index")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="monetary_poverty_rate">Taux de pauvreté monétaire urbain (%)</Label>
                            <Input id="monetary_poverty_rate" type="number" {...register("monetary_poverty_rate")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="green_digital_economy_share">Part économie verte/digitale (%)</Label>
                            <Input id="green_digital_economy_share" type="number" {...register("green_digital_economy_share")} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Objectifs et commentaires */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Target className="w-5 h-5 text-primary" />
                        <CardTitle>Objectifs du Diagnostic</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="diagnostic_type">Type de diagnostic</Label>
                          <select 
                            id="diagnostic_type" 
                            {...register("diagnostic_type")}
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                          >
                            <option value="Diagnostic complet 65 indicateurs">Diagnostic complet 65 indicateurs</option>
                            <option value="Diagnostic accéléré">Diagnostic accéléré</option>
                            <option value="Diagnostic thématique">Diagnostic thématique</option>
                            <option value="Mise à jour diagnostique">Mise à jour diagnostique</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="diagnostic_objective">Objectif spécifique</Label>
                          <Textarea 
                            id="diagnostic_objective" 
                            {...register("diagnostic_objective")}
                            className="min-h-[100px]"
                            placeholder="Objectifs poursuivis, utilisations prévues du diagnostic..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="additional_comments">Commentaires additionnels</Label>
                          <Textarea 
                            id="additional_comments" 
                            {...register("additional_comments")}
                            className="min-h-[100px]"
                            placeholder="Contexte particulier, défis spécifiques, projets en cours..."
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Upload de documents */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Upload className="w-5 h-5 text-primary" />
                        <CardTitle>Documents Techniques</CardTitle>
                      </div>
                      <CardDescription>
                        Téléchargez des documents PDF pour enrichir l'analyse
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-muted/30 transition-colors cursor-pointer group">
                        <input
                          type="file"
                          multiple
                          accept=".pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <Upload className="w-10 h-10 mx-auto text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                          <p className="text-sm font-medium text-foreground">Cliquez pour parcourir</p>
                          <p className="text-xs text-muted-foreground mt-1">PDF uniquement (Max 10MB)</p>
                        </label>
                      </div>
                      
                      {documents.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <Label>Documents analysés:</Label>
                          {documents.map((doc: DocumentContent) => (
                            <div key={doc.filename} className="flex items-center gap-2 text-sm bg-muted/50 p-2 rounded">
                              <FileText className="w-4 h-4 text-secondary" />
                              <span className="flex-1 truncate">{doc.filename}</span>
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Bouton de génération */}
                  <div className="sticky bottom-4 bg-background/95 backdrop-blur p-4 rounded-lg border shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">65 indicateurs renseignés</p>
                        <p className="text-xs text-muted-foreground">7 dimensions · Analyse multidimensionnelle</p>
                      </div>
                      <Button 
                        type="submit"
                        size="lg" 
                        className="bg-primary text-white hover:bg-primary/90"
                        disabled={isGenerating}
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Génération en cours...
                          </>
                        ) : (
                          <>
                            <FileText className="w-5 h-5 mr-2" />
                            Générer le diagnostic complet (65 indicateurs)
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </TabsContent>

          {/* Résultats */}
          <TabsContent value="result">
            <Card className="border-t-4 border-t-secondary">
              <CardHeader className="bg-slate-50 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-serif text-2xl text-primary">
                      Diagnostic Urbain Complet: {watchCity}
                    </CardTitle>
                    <CardDescription>
                      65 indicateurs · 7 dimensions · Rapport généré le {new Date().toLocaleDateString('fr-FR')}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={downloadPDF}>
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger PDF
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                {generatedContent ? (
                  <div className="prose prose-lg max-w-none">
                    <iframe
                      ref={iframeRef}
                      srcDoc={generatedContent}
                      title="Rapport Diagnostic Complet"
                      className="w-full border-0"
                      style={{ 
                        minHeight: "1200px", 
                        height: "auto",
                        width: "100%"
                      }}
                      sandbox="allow-same-origin allow-forms allow-scripts"
                      onLoad={() => {
                        if (iframeRef.current) {
                          const iframeDoc = iframeRef.current.contentDocument;
                          if (iframeDoc) {
                            const height = iframeDoc.body.scrollHeight;
                            iframeRef.current.style.height = height + 'px';
                          }
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p>Aucun résultat disponible. Veuillez d'abord renseigner les 65 indicateurs et générer le diagnostic.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </LayoutShell>
  );
}