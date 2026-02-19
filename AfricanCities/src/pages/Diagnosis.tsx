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
  Target
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
  ResponsiveContainer
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

// Schéma de formulaire étendu
const formSchema = z.object({
  // Informations générales
  city: z.string().min(1, "La ville est requise"),
  country: z.string().min(1, "Le pays est requis"),
  region: z.string().optional(),
  diagnostic_date: z.string().optional(),
  
  // Données démographiques
  population: z.string().optional(),
  growth_rate: z.string().optional(),
  urban_area: z.string().optional(),
  youth_percentage: z.string().optional(),
  
  // Infrastructures
  water_access: z.string().optional(),
  electricity_access: z.string().optional(),
  sanitation_access: z.string().optional(),
  road_quality: z.string().optional(),
  internet_access: z.string().optional(),
  
  // Logement
  housing_deficit: z.string().optional(),
  informal_settlements: z.string().optional(),
  housing_cost: z.string().optional(),
  
  // Économie
  unemployment_rate: z.string().optional(),
  informal_economy: z.string().optional(),
  gdp_per_capita: z.string().optional(),
  
  // Social
  literacy_rate: z.string().optional(),
  infant_mortality: z.string().optional(),
  life_expectancy: z.string().optional(),
  
  // Environnement
  climate_risks: z.array(z.string()).optional(),
  green_spaces: z.string().optional(),
  
  // Transport
  public_transport: z.string().optional(),
  
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
  { category: 'Télécom', current: 78, target: 90 },
];

const housingData = [
  { type: 'Béton/Dur', value: 35 },
  { type: 'Semi-dur', value: 25 },
  { type: 'Traditionnel', value: 25 },
  { type: 'Précaire', value: 15 },
];

const COLORS = ['#1e3a5f', '#fbbf24', '#10b981', '#ef4444', '#8b5cf6'];

export default function Diagnosis() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("form");
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [webData, setWebData] = useState<WebData | null>(null);
  const [documents, setDocuments] = useState<DocumentContent[]>([]);
  const [enableWebSearch, setEnableWebSearch] = useState(true);
  const [expandedSections, setExpandedSections] = useState<string[]>(['general', 'demographics', 'infrastructure']);
  
  // Ref pour l'iframe
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const { register, handleSubmit, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: "Nouakchott",
      country: "Mauritanie",
      region: "Nouakchott",
      population: "1200000",
      growth_rate: "3.5",
      urban_area: "1000",
      youth_percentage: "60",
      water_access: "45",
      electricity_access: "42",
      sanitation_access: "25",
      road_quality: "Moyenne",
      internet_access: "35",
      housing_deficit: "50000",
      informal_settlements: "40",
      housing_cost: "200",
      unemployment_rate: "25",
      informal_economy: "70",
      gdp_per_capita: "1500",
      literacy_rate: "65",
      infant_mortality: "45",
      life_expectancy: "65",
      climate_risks: ["Inondations", "Sécheresse"],
      green_spaces: "5",
      public_transport: "Limité",
      diagnostic_type: "Diagnostic général",
      diagnostic_objective: "Évaluer l'état actuel du développement urbain et identifier les priorités d'intervention.",
      additional_comments: "",
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

  // Fonction pour télécharger en PDF en capturant l'iframe
  const downloadPDF = async () => {
    if (!iframeRef.current) return;
    
    try {
      toast({
        title: "Préparation du PDF",
        description: "Génération du document en cours...",
      });
      
      // Accéder au contenu de l'iframe
      const iframeDocument = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
      if (!iframeDocument) {
        throw new Error("Impossible d'accéder au contenu de l'iframe");
      }
      
      // Capturer le corps du document de l'iframe
      const iframeBody = iframeDocument.body;
      
      const canvas = await html2canvas(iframeBody, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        windowWidth: 1200,
        onclone: (clonedDoc) => {
          // S'assurer que le fond est blanc
          const body = clonedDoc.querySelector('body');
          if (body) {
            body.style.background = '#ffffff';
          }
        }
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // Créer le PDF en format A4
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210; // Largeur A4 en mm
      const pageHeight = 297; // Hauteur A4 en mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      // Ajouter la première page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
      
      // Ajouter des pages supplémentaires si nécessaire
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }
      
      // Sauvegarder le PDF
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

 const generateReportContent = async (data: FormData) => {
  setIsGenerating(true);
  
  try {
    // Simuler la génération IA
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const formatNumber = (num: string | undefined) => {
      return num ? Number.parseInt(num, 10).toLocaleString('fr-FR') : 'Non spécifié';
    };

    const formatPercent = (num: string | undefined) => {
      return num ? `${num}%` : 'Non spécifié';
    };

    const formatCurrency = (num: string | undefined) => {
      return num ? `${Number.parseInt(num, 10).toLocaleString('fr-FR')} USD` : 'Non spécifié';
    };

    const calculateGap = (current: string | undefined, target: number) => {
      return current ? (target - Number.parseInt(current, 10)).toString() : 'N/A';
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

    const mockReport = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rapport Diagnostic - ${data.city}</title>
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

    /* Page de garde */
    .cover-page {
      text-align: center;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
      border-radius: 30px;
      padding: 60px 40px;
      margin-bottom: 40px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      position: relative;
      overflow: hidden;
    }

    .cover-page::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 10px;
      background: linear-gradient(90deg, #1e3a5f, #fbbf24, #10b981);
    }

    .cover-page h1 {
      font-size: 4rem;
      border: none;
      margin-bottom: 1rem;
      background: linear-gradient(135deg, #1e3a5f, #2d4a7a);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .cover-page .city-name {
      font-size: 4.5rem;
      font-weight: 800;
      color: #fbbf24;
      margin: 20px 0;
      text-transform: uppercase;
      letter-spacing: 8px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
    }

    .cover-page .date {
      font-size: 1.3rem;
      color: #64748b;
      margin: 20px 0;
      padding: 10px 30px;
      background: white;
      border-radius: 50px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    }

    .cover-page .institution {
      font-size: 1.2rem;
      color: #334155;
      margin-top: 40px;
      padding: 20px 40px;
      background: rgba(255,255,255,0.9);
      border-radius: 15px;
      border: 1px solid #e2e8f0;
    }

    .logo-container {
      margin: 30px 0;
      padding: 20px;
      background: white;
      border-radius: 15px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    }

    .logo-container img {
      max-width: 200px;
      height: auto;
    }

    /* Sommaire */
    .toc {
      background: white;
      padding: 40px;
      border-radius: 20px;
      margin: 40px 0;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }

    .toc h2 {
      border: none;
      padding-left: 0;
      margin-top: 0;
      color: #1e3a5f;
    }

    .toc-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-top: 30px;
    }

    .toc-section {
      background: #f8fafc;
      padding: 20px;
      border-radius: 12px;
    }

    .toc-section h3 {
      color: #fbbf24;
      margin-top: 0;
      font-size: 1.2rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .toc-item {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px dashed #cbd5e1;
    }

    .toc-item:last-child {
      border-bottom: none;
    }

    /* Cartes métriques */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 25px;
      margin: 30px 0;
    }

    .metric-card {
      background: white;
      border-radius: 16px;
      padding: 25px;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
      transition: transform 0.3s, box-shadow 0.3s;
      border: 1px solid #e2e8f0;
    }

    .metric-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 30px -10px rgba(30, 58, 95, 0.2);
    }

    .metric-title {
      font-size: 1rem;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 10px;
    }

    .metric-value {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1e3a5f;
      margin: 10px 0;
    }

    .metric-trend {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #10b981;
      font-weight: 500;
    }

    /* Tableaux stylisés */
    .table-container {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
      margin: 30px 0;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th {
      background: #1e3a5f;
      color: white;
      font-weight: 600;
      padding: 15px;
      text-align: left;
      font-size: 1rem;
    }

    td {
      padding: 15px;
      border-bottom: 1px solid #e2e8f0;
    }

    tr:last-child td {
      border-bottom: none;
    }

    tr:hover {
      background: #f8fafc;
    }

    .badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .badge-high {
      background: #fee2e2;
      color: #dc2626;
    }

    .badge-medium {
      background: #fef3c7;
      color: #d97706;
    }

    .badge-low {
      background: #d1fae5;
      color: #059669;
    }

    /* Grille SWOT */
    .swot-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 25px;
      margin: 30px 0;
    }

    .swot-card {
      background: white;
      border-radius: 16px;
      padding: 25px;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
    }

    .swot-card.strengths { border-top: 6px solid #10b981; }
    .swot-card.weaknesses { border-top: 6px solid #ef4444; }
    .swot-card.opportunities { border-top: 6px solid #fbbf24; }
    .swot-card.threats { border-top: 6px solid #8b5cf6; }

    .swot-card h4 {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 1.4rem;
      margin-bottom: 20px;
    }

    .swot-item {
      display: flex;
      align-items: flex-start;
      gap: 15px;
      padding: 15px;
      border-bottom: 1px solid #f1f5f9;
    }

    .swot-number {
      width: 28px;
      height: 28px;
      background: #f1f5f9;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      color: #1e3a5f;
      flex-shrink: 0;
    }

    /* Cartes recommandations */
    .reco-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 25px;
      margin: 30px 0;
    }

    .reco-card {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
    }

    .reco-header {
      background: linear-gradient(135deg, #1e3a5f, #2d4a7a);
      color: white;
      padding: 20px;
      font-size: 1.2rem;
      font-weight: 600;
    }

    .reco-body {
      padding: 20px;
    }

    .reco-item {
      background: #f8fafc;
      border-radius: 12px;
      padding: 15px;
      margin-bottom: 15px;
    }

    .reco-item strong {
      color: #1e3a5f;
      display: block;
      margin-bottom: 8px;
      font-size: 1.1rem;
    }

    .reco-details {
      display: flex;
      justify-content: space-between;
      color: #64748b;
      font-size: 0.95rem;
      margin: 8px 0;
    }

    .reco-impact {
      color: #10b981;
      font-weight: 500;
    }

    /* Graphiques */
    .charts-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 25px;
      margin: 30px 0;
    }

    .chart-card {
      background: white;
      border-radius: 16px;
      padding: 25px;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
    }

    .chart-card h3 {
      margin-top: 0;
      margin-bottom: 20px;
      color: #1e3a5f;
    }

    .pie-chart {
      width: 250px;
      height: 250px;
      margin: 0 auto;
      border-radius: 50%;
      background: conic-gradient(#1e3a5f 0deg 153deg, #fbbf24 153deg 347deg, #10b981 347deg 360deg);
      position: relative;
    }

    .pie-chart::after {
      content: "100%";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 120px;
      height: 120px;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 1.5rem;
      color: #1e3a5f;
    }

    .bar-chart {
      display: flex;
      align-items: flex-end;
      gap: 15px;
      height: 250px;
      padding: 20px 0;
    }

    .bar-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }

    .bar {
      width: 40px;
      background: #1e3a5f;
      border-radius: 8px 8px 0 0;
      transition: height 0.3s;
    }

    .bar.target {
      width: 20px;
      background: #fbbf24;
      opacity: 0.7;
      position: relative;
      left: 10px;
      top: -100%;
    }

    .legend {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-top: 20px;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .legend-color {
      width: 16px;
      height: 16px;
      border-radius: 4px;
    }

    /* Footer */
    .footer {
      margin-top: 60px;
      padding: 40px;
      text-align: center;
      background: linear-gradient(135deg, #1e3a5f, #2d4a7a);
      border-radius: 20px;
      color: white;
    }

    .footer p {
      margin: 10px 0;
      opacity: 0.9;
    }

    .documents-list {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 10px;
      margin: 20px 0;
    }

    .document-tag {
      background: rgba(255,255,255,0.15);
      padding: 8px 16px;
      border-radius: 30px;
      font-size: 0.9rem;
      backdrop-filter: blur(5px);
    }

    hr {
      border: none;
      border-top: 2px solid rgba(255,255,255,0.2);
      margin: 30px 0;
    }

    /* Utilitaires */
    .page-break {
      page-break-after: always;
      margin: 40px 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin: 20px 0;
    }

    .stat-box {
      text-align: center;
      padding: 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    }

    .stat-label {
      color: #64748b;
      font-size: 0.9rem;
      margin-bottom: 8px;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: 700;
      color: #1e3a5f;
    }

    .info-box {
      background: #f0f9ff;
      border-left: 6px solid #0ea5e9;
      padding: 20px;
      border-radius: 12px;
      margin: 20px 0;
    }

    @media print {
      .page-break {
        page-break-after: always;
        margin: 0;
      }
      
      body {
        padding: 0;
        background: white;
      }
    }
  </style>
</head>
<body>

  <!-- PAGE DE GARDE -->
  <div class="cover-page">
    <h1>RAPPORT DE DIAGNOSTIC URBAINT</h1>
    <h1>INTELLIGENT</h1>
    
    <div class="city-name">${data.city?.toUpperCase() || 'VILLE'}</div>
    <div style="font-size: 2rem; color: #4a5568; margin-bottom: 30px;">${data.country || 'PAYS'}</div>
    
    <div class="date">
      📅 Généré le ${new Date().toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })}
    </div>
    
    <div class="logo-container">
      <img src="https://via.placeholder.com/200x80/1e3a5f/ffffff?text=CUS+UM6P" alt="Logo CUS UM6P">
    </div>
    
    <div class="institution">
      <strong>Centre of Urban Systems - UM6P</strong><br>
      <span style="color: #fbbf24;">AfricanCities IA Services</span>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- SOMMAIRE -->
  <div class="toc">
    <h2>📋 SOMMAIRE</h2>
    
    <div class="toc-grid">
      <div class="toc-section">
        <h3>PARTIE 1</h3>
        <div class="toc-item"><span>1. RÉSUMÉ EXÉCUTIF</span> <span>3</span></div>
        <div class="toc-item"><span>2. PROFIL SOCIO-ÉCONOMIQUE</span> <span>4</span></div>
        <div class="toc-item" style="margin-left: 20px;"><span>2.1 Contexte démographique</span> <span>4</span></div>
        <div class="toc-item" style="margin-left: 20px;"><span>2.2 Contexte économique</span> <span>5</span></div>
        <div class="toc-item" style="margin-left: 20px;"><span>2.3 Contexte social</span> <span>5</span></div>
      </div>
      
      <div class="toc-section">
        <h3>PARTIE 2</h3>
        <div class="toc-item"><span>3. DIAGNOSTIC PAR DIMENSION</span> <span>6</span></div>
        <div class="toc-item" style="margin-left: 20px;"><span>3.1 Infrastructures</span> <span>6</span></div>
        <div class="toc-item" style="margin-left: 20px;"><span>3.2 Habitat et logement</span> <span>7</span></div>
        <div class="toc-item" style="margin-left: 20px;"><span>3.3 Environnement</span> <span>7</span></div>
        <div class="toc-item" style="margin-left: 20px;"><span>3.4 Transport</span> <span>8</span></div>
      </div>
      
      <div class="toc-section">
        <h3>PARTIE 3</h3>
        <div class="toc-item"><span>4. ANALYSE SWOT</span> <span>9</span></div>
        <div class="toc-item"><span>5. RECOMMANDATIONS</span> <span>11</span></div>
        <div class="toc-item"><span>6. SCÉNARIOS</span> <span>13</span></div>
        <div class="toc-item"><span>7. CONCLUSION</span> <span>15</span></div>
      </div>
      
      <div class="toc-section">
        <h3>ANNEXES</h3>
        <div class="toc-item"><span>8. VISUALISATIONS</span> <span>16</span></div>
        <div class="toc-item"><span>9. DOCUMENTS</span> <span>18</span></div>
      </div>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- 1. RÉSUMÉ EXÉCUTIF -->
  <h2>1. RÉSUMÉ EXÉCUTIF</h2>

  <div style="font-size: 1.1rem; line-height: 1.8; margin-bottom: 30px; text-align: justify;">
    Le diagnostic urbain de <strong>${data.city}</strong> révèle une métropole en pleine transformation, confrontée à des défis majeurs mais disposant d'atouts considérables. Ce rapport présente une analyse approfondie de la situation actuelle et propose des recommandations stratégiques pour un développement urbain durable et inclusif.
  </div>

  <div class="metrics-grid">
    <div class="metric-card">
      <div class="metric-title">Population totale</div>
      <div class="metric-value">${formatNumber(data.population)}</div>
      <div class="metric-trend">📈 Croissance ${data.growth_rate}% par an</div>
    </div>
    
    <div class="metric-card">
      <div class="metric-title">Densité urbaine</div>
      <div class="metric-value">${data.urban_area ? Math.round(Number.parseInt(data.population || '0') / Number.parseInt(data.urban_area)).toLocaleString('fr-FR') : 'N/A'}</div>
      <div class="metric-trend">🏙️ habitants/km²</div>
    </div>
    
    <div class="metric-card">
      <div class="metric-title">Accès eau potable</div>
      <div class="metric-value">${formatPercent(data.water_access)}</div>
      <div class="metric-trend">${getScoreColor(Number.parseInt(data.water_access || '0'))} ${getScoreText(Number.parseInt(data.water_access || '0'))}</div>
    </div>
    
    <div class="metric-card">
      <div class="metric-title">Accès électricité</div>
      <div class="metric-value">${formatPercent(data.electricity_access)}</div>
      <div class="metric-trend">${getScoreColor(Number.parseInt(data.electricity_access || '0'))} ${getScoreText(Number.parseInt(data.electricity_access || '0'))}</div>
    </div>
    
    <div class="metric-card">
      <div class="metric-title">Habitat informel</div>
      <div class="metric-value">${formatPercent(data.informal_settlements)}</div>
      <div class="metric-trend" style="color: #ef4444;">🔴 Critique</div>
    </div>
    
    <div class="metric-card">
      <div class="metric-title">Taux de chômage</div>
      <div class="metric-value">${formatPercent(data.unemployment_rate)}</div>
      <div class="metric-trend" style="color: #ef4444;">⚠️ Alerte</div>
    </div>
  </div>

  <h3>🎯 Principaux constats</h3>
  
  <div style="background: white; border-radius: 16px; padding: 25px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin: 20px 0;">
    <ul style="list-style: none; padding: 0;">
      <li style="margin-bottom: 15px; padding-left: 30px; position: relative;">
        <span style="position: absolute; left: 0; color: #fbbf24;">📌</span>
        <strong>Croissance démographique rapide</strong> (${data.growth_rate}%/an) non accompagnée par le développement des infrastructures
      </li>
      <li style="margin-bottom: 15px; padding-left: 30px; position: relative;">
        <span style="position: absolute; left: 0; color: #fbbf24;">📌</span>
        <strong>Déficit critique en logements</strong> (${formatNumber(data.housing_deficit)} unités) avec ${data.informal_settlements}% de la population en habitat informel
      </li>
      <li style="margin-bottom: 15px; padding-left: 30px; position: relative;">
        <span style="position: absolute; left: 0; color: #fbbf24;">📌</span>
        <strong>Accès limité aux services de base</strong> : eau (${data.water_access}%), électricité (${data.electricity_access}%), assainissement (${data.sanitation_access}%)
      </li>
      <li style="margin-bottom: 15px; padding-left: 30px; position: relative;">
        <span style="position: absolute; left: 0; color: #fbbf24;">📌</span>
        <strong>Potentiel économique important</strong> avec une population jeune (${data.youth_percentage}% < 25 ans)
      </li>
      <li style="margin-bottom: 15px; padding-left: 30px; position: relative;">
        <span style="position: absolute; left: 0; color: #fbbf24;">📌</span>
        <strong>Vulnérabilité climatique</strong> face à ${data.climate_risks?.join(', ')}
      </li>
    </ul>
  </div>

  ${webData?.wikipedia_info?.summary ? `
  <div class="info-box">
    <strong>🌐 Source Wikipedia:</strong> ${webData.wikipedia_info.summary}
  </div>` : ''}

  <div class="page-break"></div>

  <!-- 2. PROFIL SOCIO-ÉCONOMIQUE -->
  <h2>2. PROFIL SOCIO-ÉCONOMIQUE</h2>

  <h3>2.1 Contexte démographique</h3>
  
  <div style="margin: 20px 0;">
    <p style="text-align: justify; margin-bottom: 20px;">
      La ville de <strong>${data.city}</strong> connaît une dynamique démographique exceptionnelle, caractérisée par une croissance soutenue et une population extrêmement jeune. Cette configuration offre un potentiel de développement considérable mais nécessite des investissements massifs dans les services de base et les infrastructures.
    </p>
  </div>

  <h4>📈 Évolution démographique (2018-2023)</h4>
  
  <div class="table-container">
    <table>
      <thead>
        <tr><th>Année</th><th>Population</th><th>Croissance annuelle</th><th>Évolution</th></tr>
      </thead>
      <tbody>
        <tr><td>2018</td><td>1 050 000</td><td>-</td><td>📊 Base</td></tr>
        <tr><td>2019</td><td>1 087 500</td><td>+3.57%</td><td>📈 Hausse</td></tr>
        <tr><td>2020</td><td>1 126 250</td><td>+3.56%</td><td>📈 Hausse</td></tr>
        <tr><td>2021</td><td>1 165 656</td><td>+3.50%</td><td>📈 Hausse</td></tr>
        <tr><td>2022</td><td>1 206 428</td><td>+3.50%</td><td>📈 Hausse</td></tr>
        <tr><td>2023</td><td>1 250 000</td><td>+3.61%</td><td>📈 Hausse</td></tr>
      </tbody>
    </table>
  </div>

  <h4>👥 Structure par âge</h4>
  
  <div class="stats-grid">
    <div class="stat-box">
      <div class="stat-label">0-14 ans</div>
      <div class="stat-number">42.5%</div>
      <div style="color: #10b981;">Très jeune</div>
    </div>
    <div class="stat-box">
      <div class="stat-label">15-64 ans</div>
      <div class="stat-number">54.3%</div>
      <div style="color: #fbbf24;">Active</div>
    </div>
    <div class="stat-box">
      <div class="stat-label">65+ ans</div>
      <div class="stat-number">3.2%</div>
      <div style="color: #64748b;">Âgée</div>
    </div>
  </div>

  <p style="text-align: justify; margin: 20px 0;">
    La population est extrêmement jeune, avec <strong>${data.youth_percentage}%</strong> de moins de 25 ans. Cette caractéristique représente un atout majeur pour le développement économique futur, à condition de mettre en place des politiques adéquates en matière d'éducation, de formation professionnelle et de création d'emplois.
  </p>

  <h3>2.2 Contexte économique</h3>

  <div class="table-container">
    <table>
      <thead>
        <tr><th>Indicateur</th><th>Valeur</th><th>Tendance</th><th>Analyse</th></tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>PIB par habitant</strong></td>
          <td>${formatCurrency(data.gdp_per_capita)}</td>
          <td>📈 +2.5%</td>
          <td>Croissance modérée</td>
        </tr>
        <tr>
          <td><strong>Taux de chômage</strong></td>
          <td>${formatPercent(data.unemployment_rate)}</td>
          <td>⚠️ Stable</td>
          <td>Niveau préoccupant</td>
        </tr>
        <tr>
          <td><strong>Économie informelle</strong></td>
          <td>${formatPercent(data.informal_economy)}</td>
          <td>📊 Prédominante</td>
          <td>Défi structurel</td>
        </tr>
      </tbody>
    </table>
  </div>

  <h3>2.3 Contexte social</h3>

  <div class="table-container">
    <table>
      <thead>
        <tr><th>Indicateur</th><th>Valeur actuelle</th><th>Objectif 2030</th><th>Écart</th></tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Taux d'alphabétisation</strong></td>
          <td>${formatPercent(data.literacy_rate)}</td>
          <td>85%</td>
          <td>${85 - Number.parseInt(data.literacy_rate || '0')} pts</td>
        </tr>
        <tr>
          <td><strong>Mortalité infantile</strong></td>
          <td>${data.infant_mortality} ‰</td>
          <td>25 ‰</td>
          <td>${Number.parseInt(data.infant_mortality || '0') - 25} pts</td>
        </tr>
        <tr>
          <td><strong>Espérance de vie</strong></td>
          <td>${data.life_expectancy} ans</td>
          <td>72 ans</td>
          <td>${72 - Number.parseInt(data.life_expectancy || '0')} ans</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="page-break"></div>

  <!-- 3. DIAGNOSTIC PAR DIMENSION -->
  <h2>3. DIAGNOSTIC PAR DIMENSION</h2>

  <h3>3.1 Infrastructures et services de base</h3>

  <p style="text-align: justify; margin-bottom: 20px;">
    L'analyse des infrastructures de base révèle des lacunes significatives dans l'accès aux services essentiels, avec des disparités importantes entre les quartiers. Les investissements nécessaires pour atteindre les objectifs de développement durable sont estimés à plusieurs centaines de millions de dollars.
  </p>

  <div class="table-container">
    <table>
      <thead>
        <tr><th>Service</th><th>Taux actuel</th><th>Objectif 2030</th><th>Écart</th><th>Priorité</th></tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Eau potable</strong></td>
          <td>${formatPercent(data.water_access)}</td>
          <td>80%</td>
          <td>${calculateGap(data.water_access, 80)} pts</td>
          <td><span class="badge badge-high">🔴 Urgente</span></td>
        </tr>
        <tr>
          <td><strong>Électricité</strong></td>
          <td>${formatPercent(data.electricity_access)}</td>
          <td>75%</td>
          <td>${calculateGap(data.electricity_access, 75)} pts</td>
          <td><span class="badge badge-high">🔴 Urgente</span></td>
        </tr>
        <tr>
          <td><strong>Assainissement</strong></td>
          <td>${formatPercent(data.sanitation_access)}</td>
          <td>60%</td>
          <td>${calculateGap(data.sanitation_access, 60)} pts</td>
          <td><span class="badge badge-high">🔴 Urgente</span></td>
        </tr>
        <tr>
          <td><strong>Internet</strong></td>
          <td>${formatPercent(data.internet_access)}</td>
          <td>90%</td>
          <td>${calculateGap(data.internet_access, 90)} pts</td>
          <td><span class="badge badge-medium">🟡 Modérée</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <h3>3.2 Habitat et logement</h3>

  <div class="stats-grid">
    <div class="stat-box">
      <div class="stat-label">Déficit logements</div>
      <div class="stat-number">${formatNumber(data.housing_deficit)}</div>
      <div>Unités</div>
    </div>
    <div class="stat-box">
      <div class="stat-label">Habitat informel</div>
      <div class="stat-number">${formatPercent(data.informal_settlements)}</div>
      <div>Population</div>
    </div>
    <div class="stat-box">
      <div class="stat-label">Coût moyen/m²</div>
      <div class="stat-number">${formatCurrency(data.housing_cost)}</div>
      <div>Prix</div>
    </div>
  </div>

  <p style="text-align: justify; margin: 20px 0;">
    Le secteur du logement fait face à une crise sans précédent, avec un déficit estimé à <strong>${formatNumber(data.housing_deficit)} unités</strong> et <strong>${data.informal_settlements}%</strong> de la population vivant dans des quartiers informels. Cette situation engendre des conditions de vie précaires et limite l'accès aux services de base.
  </p>

  <h3>3.3 Environnement et climat</h3>

  <div style="background: white; border-radius: 16px; padding: 25px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin: 20px 0;">
    <h4 style="margin-top: 0;">🌍 Risques climatiques identifiés</h4>
    <div style="display: flex; flex-wrap: wrap; gap: 10px; margin: 15px 0;">
      ${data.climate_risks?.map((risk: string) => `
        <span style="background: #fee2e2; color: #dc2626; padding: 8px 16px; border-radius: 30px; font-size: 0.9rem;">
          ⚠️ ${risk}
        </span>
      `).join('') || 'Aucun risque spécifié'}
    </div>
    
    <h4>🌳 Espaces verts</h4>
    <div style="display: flex; align-items: center; gap: 30px; margin-top: 15px;">
      <div style="flex: 1; text-align: center;">
        <div style="font-size: 2.5rem; color: #1e3a5f;">${data.green_spaces} m²</div>
        <div style="color: #64748b;">Ratio actuel par habitant</div>
      </div>
      <div style="flex: 1; text-align: center;">
        <div style="font-size: 2.5rem; color: #10b981;">10 m²</div>
        <div style="color: #64748b;">Norme OMS recommandée</div>
      </div>
    </div>
  </div>

  <h3>3.4 Transport et mobilité</h3>

  <div style="background: white; border-radius: 16px; padding: 25px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin: 20px 0;">
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
      <div style="text-align: center;">
        <div style="font-size: 2rem; color: #1e3a5f;">${data.public_transport}</div>
        <div style="color: #64748b;">Niveau de service</div>
      </div>
      <div style="text-align: center;">
        <div style="font-size: 2rem; color: #1e3a5f;">80/1000</div>
        <div style="color: #64748b;">Taux de motorisation</div>
      </div>
      <div style="text-align: center;">
        <div style="font-size: 2rem; color: #1e3a5f;">45 min</div>
        <div style="color: #64748b;">Temps de trajet moyen</div>
      </div>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- 4. ANALYSE SWOT -->
  <h2>4. ANALYSE SWOT</h2>

  <div class="swot-grid">
    <div class="swot-card strengths">
      <h4>💪 FORCES</h4>
      <div class="swot-item">
        <span class="swot-number">1</span>
        <span><strong>Population jeune</strong> (${data.youth_percentage}% < 25 ans)</span>
      </div>
      <div class="swot-item">
        <span class="swot-number">2</span>
        <span><strong>Position géostratégique</strong> - Carrefour commercial</span>
      </div>
      <div class="swot-item">
        <span class="swot-number">3</span>
        <span><strong>Taux d'alphabétisation</strong> (${data.literacy_rate}%)</span>
      </div>
    </div>
    
    <div class="swot-card weaknesses">
      <h4>🔻 FAIBLESSES</h4>
      <div class="swot-item">
        <span class="swot-number">1</span>
        <span><strong>Déficit d'infrastructures</strong> (eau: ${data.water_access}%, électricité: ${data.electricity_access}%)</span>
      </div>
      <div class="swot-item">
        <span class="swot-number">2</span>
        <span><strong>Habitat informel</strong> (${data.informal_settlements}%)</span>
      </div>
      <div class="swot-item">
        <span class="swot-number">3</span>
        <span><strong>Chômage élevé</strong> (${data.unemployment_rate}%)</span>
      </div>
    </div>
    
    <div class="swot-card opportunities">
      <h4>🌟 OPPORTUNITÉS</h4>
      <div class="swot-item">
        <span class="swot-number">1</span>
        <span><strong>Financements climatiques</strong> (Fonds Vert, Adaptation Fund)</span>
      </div>
      <div class="swot-item">
        <span class="swot-number">2</span>
        <span><strong>Partenariats public-privé</strong> pour les infrastructures</span>
      </div>
      <div class="swot-item">
        <span class="swot-number">3</span>
        <span><strong>Transition numérique</strong> et smart city</span>
      </div>
    </div>
    
    <div class="swot-card threats">
      <h4>⚠️ MENACES</h4>
      <div class="swot-item">
        <span class="swot-number">1</span>
        <span><strong>Changement climatique</strong> - ${data.climate_risks?.join(', ')}</span>
      </div>
      <div class="swot-item">
        <span class="swot-number">2</span>
        <span><strong>Pression migratoire</strong> et étalement urbain</span>
      </div>
      <div class="swot-item">
        <span class="swot-number">3</span>
        <span><strong>Tensions sociales</strong> liées aux inégalités</span>
      </div>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- 5. RECOMMANDATIONS PRIORITAIRES -->
  <h2>5. RECOMMANDATIONS PRIORITAIRES</h2>

  <div class="reco-grid">
    <div class="reco-card">
      <div class="reco-header">Axe 1 : Accès universel aux services de base</div>
      <div class="reco-body">
        <div class="reco-item">
          <strong>Extension réseau eau potable</strong>
          <div class="reco-details">
            <span>📅 Délai: 2 ans</span>
            <span>💰 Coût: 15 M$</span>
          </div>
          <div class="reco-impact">🎯 Impact: +20% de couverture</div>
        </div>
        <div class="reco-item">
          <strong>Électrification des quartiers</strong>
          <div class="reco-details">
            <span>📅 Délai: 3 ans</span>
            <span>💰 Coût: 25 M$</span>
          </div>
          <div class="reco-impact">🎯 Impact: +25% ménages connectés</div>
        </div>
      </div>
    </div>
    
    <div class="reco-card">
      <div class="reco-header">Axe 2 : Résorption de l'habitat informel</div>
      <div class="reco-body">
        <div class="reco-item">
          <strong>Régularisation foncière</strong>
          <div class="reco-details">
            <span>📅 Délai: 3 ans</span>
            <span>💰 Coût: 5 M$</span>
          </div>
          <div class="reco-impact">🎯 Impact: 25 000 familles sécurisées</div>
        </div>
        <div class="reco-item">
          <strong>Logements sociaux</strong>
          <div class="reco-details">
            <span>📅 Délai: 5 ans</span>
            <span>💰 Coût: 150 M$</span>
          </div>
          <div class="reco-impact">🎯 Impact: 10 000 unités</div>
        </div>
      </div>
    </div>
    
    <div class="reco-card">
      <div class="reco-header">Axe 3 : Développement économique</div>
      <div class="reco-body">
        <div class="reco-item">
          <strong>Zones d'activités économiques</strong>
          <div class="reco-details">
            <span>📅 Délai: 4 ans</span>
            <span>💰 Coût: 20 M$</span>
          </div>
          <div class="reco-impact">🎯 Impact: 5 000 emplois créés</div>
        </div>
        <div class="reco-item">
          <strong>Formation professionnelle</strong>
          <div class="reco-details">
            <span>📅 Délai: 3 ans</span>
            <span>💰 Coût: 8 M$</span>
          </div>
          <div class="reco-impact">🎯 Impact: 15 000 jeunes formés</div>
        </div>
      </div>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- 6. SCÉNARIOS D'INVESTISSEMENT -->
  <h2>6. SCÉNARIOS D'INVESTISSEMENT</h2>

  <div class="table-container">
    <table>
      <thead>
        <tr><th>Indicateur</th><th>Scénario 1 (Statu quo)</th><th>Scénario 2 (Accéléré)</th><th>Scénario 3 (Transformation)</th></tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Population 2030</strong></td>
          <td>1 550 000</td>
          <td style="background: #fef3c7;">1 500 000</td>
          <td>1 450 000</td>
        </tr>
        <tr>
          <td><strong>Accès eau 2030</strong></td>
          <td>50%</td>
          <td style="background: #fef3c7;">75%</td>
          <td>90%</td>
        </tr>
        <tr>
          <td><strong>Investissement total</strong></td>
          <td>50 M$</td>
          <td style="background: #fef3c7; font-weight: bold;">250 M$</td>
          <td>500 M$</td>
        </tr>
        <tr>
          <td><strong>Évaluation</strong></td>
          <td><span class="badge badge-high">Risque de crise</span></td>
          <td style="background: #fef3c7;"><span class="badge badge-medium">Ratio optimal</span></td>
          <td><span class="badge badge-low">Impact maximal</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <div style="background: #fef3c7; padding: 30px; border-radius: 16px; margin: 30px 0;">
    <h3 style="color: #92400e; margin-top: 0;">🎯 Scénario recommandé : Développement accéléré</h3>
    <p style="margin: 15px 0;"><strong>Investissement de 250 M$ sur 7 ans</strong></p>
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
      <div style="background: white; padding: 15px; border-radius: 12px;">
        <strong>40%</strong> Financements publics
      </div>
      <div style="background: white; padding: 15px; border-radius: 12px;">
        <strong>35%</strong> Partenariats public-privé
      </div>
      <div style="background: white; padding: 15px; border-radius: 12px;">
        <strong>15%</strong> Bailleurs internationaux
      </div>
      <div style="background: white; padding: 15px; border-radius: 12px;">
        <strong>10%</strong> Secteur privé local
      </div>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- 7. CONCLUSION PROSPECTIVE -->
  <h2>7. CONCLUSION PROSPECTIVE</h2>

  <div style="background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%); padding: 40px; border-radius: 20px; margin: 30px 0; border: 1px solid #e2e8f0;">
    <p style="font-size: 1.2rem; font-style: italic; color: #334155; margin-bottom: 30px; text-align: center;">
      "${data.city} se trouve à un moment charnière de son développement. Les décisions prises aujourd'hui détermineront sa trajectoire pour les décennies à venir."
    </p>
    
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 30px 0;">
      <div style="background: white; padding: 20px; border-radius: 12px;">
        <h4 style="margin-top: 0; color: #1e3a5f;">Urgence d'agir</h4>
        <p>Chaque année de retard aggrave les déficits et augmente les coûts futurs de 15-20%.</p>
      </div>
      <div style="background: white; padding: 20px; border-radius: 12px;">
        <h4 style="margin-top: 0; color: #1e3a5f;">Approche intégrée</h4>
        <p>Dimensions sociales, économiques et environnementales indissociables.</p>
      </div>
      <div style="background: white; padding: 20px; border-radius: 12px;">
        <h4 style="margin-top: 0; color: #1e3a5f;">Gouvernance participative</h4>
        <p>Impliquer citoyens, société civile et secteur privé.</p>
      </div>
      <div style="background: white; padding: 20px; border-radius: 12px;">
        <h4 style="margin-top: 0; color: #1e3a5f;">Partenariats stratégiques</h4>
        <p>Mobiliser toutes les sources de financement et d'expertise.</p>
      </div>
    </div>
    
    <div style="background: #1e3a5f; color: white; padding: 30px; border-radius: 15px; text-align: center;">
      <h3 style="color: #fbbf24; margin-top: 0;">Vision 2040</h3>
      <p style="font-size: 1.3rem;">"Faire de ${data.city} une métropole durable, inclusive et résiliente, modèle de transition urbaine en Afrique."</p>
    </div>
  </div>

  <!-- VISUALISATIONS DES DONNÉES -->
  <h2 style="margin-top: 60px;">8. VISUALISATIONS DES DONNÉES</h2>

  <div class="charts-grid">
    <!-- Structure par âge -->
    <div class="chart-card">
      <h3>Structure par âge</h3>
      <div style="display: flex; justify-content: center;">
        <div class="pie-chart"></div>
      </div>
      <div class="legend">
        <div class="legend-item"><span class="legend-color" style="background: #1e3a5f;"></span> 0-14 ans (42.5%)</div>
        <div class="legend-item"><span class="legend-color" style="background: #fbbf24;"></span> 15-64 ans (54.3%)</div>
        <div class="legend-item"><span class="legend-color" style="background: #10b981;"></span> 65+ ans (3.2%)</div>
      </div>
    </div>

    <!-- Croissance démographique -->
    <div class="chart-card">
      <h3>Croissance démographique</h3>
      <div class="bar-chart">
        <div class="bar-container"><div class="bar" style="height: 105px;"></div><div>2018</div></div>
        <div class="bar-container"><div class="bar" style="height: 109px;"></div><div>2019</div></div>
        <div class="bar-container"><div class="bar" style="height: 113px;"></div><div>2020</div></div>
        <div class="bar-container"><div class="bar" style="height: 117px;"></div><div>2021</div></div>
        <div class="bar-container"><div class="bar" style="height: 121px;"></div><div>2022</div></div>
        <div class="bar-container"><div class="bar" style="height: 125px; background: #fbbf24;"></div><div>2023</div></div>
      </div>
    </div>
  </div>

  <!-- Accès aux infrastructures -->
  <div class="chart-card" style="margin-top: 25px;">
    <h3>Accès aux infrastructures</h3>
    <div style="display: flex; justify-content: space-around; padding: 20px;">
      <div style="text-align: center;">
        <div style="font-weight: 600;">Eau potable</div>
        <div style="font-size: 1.5rem; color: #1e3a5f;">45%</div>
        <div style="font-size: 1.2rem; color: #fbbf24;">vs 80%</div>
      </div>
      <div style="text-align: center;">
        <div style="font-weight: 600;">Électricité</div>
        <div style="font-size: 1.5rem; color: #1e3a5f;">42%</div>
        <div style="font-size: 1.2rem; color: #fbbf24;">vs 75%</div>
      </div>
      <div style="text-align: center;">
        <div style="font-weight: 600;">Assainissement</div>
        <div style="font-size: 1.5rem; color: #1e3a5f;">25%</div>
        <div style="font-size: 1.2rem; color: #fbbf24;">vs 60%</div>
      </div>
      <div style="text-align: center;">
        <div style="font-weight: 600;">Routes</div>
        <div style="font-size: 1.5rem; color: #1e3a5f;">60%</div>
        <div style="font-size: 1.2rem; color: #fbbf24;">vs 85%</div>
      </div>
      <div style="text-align: center;">
        <div style="font-weight: 600;">Télécom</div>
        <div style="font-size: 1.5rem; color: #1e3a5f;">78%</div>
        <div style="font-size: 1.2rem; color: #fbbf24;">vs 90%</div>
      </div>
    </div>
  </div>

  <!-- Types de logement -->
  <div class="chart-card" style="margin-top: 25px;">
    <h3>Répartition des types de logement</h3>
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; padding: 20px;">
      <div style="text-align: center;">
        <div style="background: #1e3a5f; color: white; padding: 10px; border-radius: 8px; margin-bottom: 10px;">35%</div>
        <div>Béton/Dur</div>
      </div>
      <div style="text-align: center;">
        <div style="background: #fbbf24; color: #1e3a5f; padding: 10px; border-radius: 8px; margin-bottom: 10px;">25%</div>
        <div>Semi-dur</div>
      </div>
      <div style="text-align: center;">
        <div style="background: #10b981; color: white; padding: 10px; border-radius: 8px; margin-bottom: 10px;">25%</div>
        <div>Traditionnel</div>
      </div>
      <div style="text-align: center;">
        <div style="background: #ef4444; color: white; padding: 10px; border-radius: 8px; margin-bottom: 10px;">15%</div>
        <div>Précaire</div>
      </div>
    </div>
  </div>

  <!-- FOOTER -->
  <div class="footer">
    <p style="font-size: 1.3rem; margin-bottom: 20px;"><strong>Rapport généré par AfricanCities IA Services</strong></p>
    <p>Centre of Urban Systems - UM6P</p>
    
    ${documents.length > 0 ? `
    <div style="margin: 30px 0;">
      <p style="font-size: 1.1rem; margin-bottom: 15px;">📄 Documents analysés :</p>
      <div class="documents-list">
        ${documents.map((d: DocumentContent) => `
          <span class="document-tag">${d.filename}</span>
        `).join('')}
      </div>
    </div>` : ''}
    
    <hr>
    
    <p style="opacity: 0.7;">© ${new Date().getFullYear()} - Tous droits réservés</p>
    <p style="opacity: 0.5; font-size: 0.9rem;">Ce rapport est confidentiel et destiné à un usage interne</p>
  </div>

</body>
</html>
      `;
      
      setGeneratedContent(mockReport);
      setActiveTab("result");
      
      toast({
        title: "Succès !",
        description: "Le rapport a été généré avec succès.",
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
              <p className="text-white/80 text-lg">Diagnostiquer, comprendre, transformer votre ville</p>
            </div>
          </div>
          <p className="text-white/90 text-sm bg-white/10 inline-block px-4 py-2 rounded-full backdrop-blur">
            Centre of Urban Systems - UM6P
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="form" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Diagnostic
            </TabsTrigger>
            <TabsTrigger value="result" disabled={!generatedContent} className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Résultats
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
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Colonne de gauche - Formulaire */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Section 1: Informations Générales */}
                  <Card className="border-t-4 border-t-primary">
                    <CardHeader 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => toggleSection('general')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-primary" />
                          <CardTitle>Informations Générales</CardTitle>
                        </div>
                        <span>{expandedSections.includes('general') ? '−' : '+'}</span>
                      </div>
                    </CardHeader>
                    {expandedSections.includes('general') && (
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
                    )}
                  </Card>

                  {/* Section 2: Données Démographiques */}
                  <Card>
                    <CardHeader 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => toggleSection('demographics')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Users className="w-5 h-5 text-primary" />
                          <CardTitle>Données Démographiques</CardTitle>
                        </div>
                        <span>{expandedSections.includes('demographics') ? '−' : '+'}</span>
                      </div>
                    </CardHeader>
                    {expandedSections.includes('demographics') && (
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="population">Population totale</Label>
                            <Input id="population" type="number" {...register("population")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="growth_rate">Taux de croissance (%)</Label>
                            <Input id="growth_rate" type="number" step="0.1" {...register("growth_rate")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="urban_area">Superficie urbaine (km²)</Label>
                            <Input id="urban_area" type="number" {...register("urban_area")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="youth_percentage">Jeunes (0-25 ans) (%)</Label>
                            <Input id="youth_percentage" type="number" {...register("youth_percentage")} />
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>

                  {/* Section 3: Infrastructures */}
                  <Card>
                    <CardHeader 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => toggleSection('infrastructure')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Zap className="w-5 h-5 text-primary" />
                          <CardTitle>Infrastructures de Base</CardTitle>
                        </div>
                        <span>{expandedSections.includes('infrastructure') ? '−' : '+'}</span>
                      </div>
                    </CardHeader>
                    {expandedSections.includes('infrastructure') && (
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
                            <Label htmlFor="sanitation_access">Accès assainissement (%)</Label>
                            <Input id="sanitation_access" type="number" {...register("sanitation_access")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="internet_access">Accès Internet (%)</Label>
                            <Input id="internet_access" type="number" {...register("internet_access")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="road_quality">Qualité des routes</Label>
                            <select 
                              id="road_quality" 
                              {...register("road_quality")}
                              className="w-full rounded-md border border-input bg-background px-3 py-2"
                            >
                              <option value="Très mauvaise">Très mauvaise</option>
                              <option value="Mauvaise">Mauvaise</option>
                              <option value="Moyenne">Moyenne</option>
                              <option value="Bonne">Bonne</option>
                              <option value="Très bonne">Très bonne</option>
                            </select>
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>

                  {/* Section 4: Logement */}
                  <Card>
                    <CardHeader 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => toggleSection('housing')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Building className="w-5 h-5 text-primary" />
                          <CardTitle>Logement et Habitat</CardTitle>
                        </div>
                        <span>{expandedSections.includes('housing') ? '−' : '+'}</span>
                      </div>
                    </CardHeader>
                    {expandedSections.includes('housing') && (
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="housing_deficit">Déficit en logements</Label>
                            <Input id="housing_deficit" type="number" {...register("housing_deficit")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="informal_settlements">Habitat informel (%)</Label>
                            <Input id="informal_settlements" type="number" {...register("informal_settlements")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="housing_cost">Coût logement (USD/m²)</Label>
                            <Input id="housing_cost" type="number" {...register("housing_cost")} />
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>

                  {/* Section 5: Économie */}
                  <Card>
                    <CardHeader 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => toggleSection('economy')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Briefcase className="w-5 h-5 text-primary" />
                          <CardTitle>Économie et Emploi</CardTitle>
                        </div>
                        <span>{expandedSections.includes('economy') ? '−' : '+'}</span>
                      </div>
                    </CardHeader>
                    {expandedSections.includes('economy') && (
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="unemployment_rate">Taux de chômage (%)</Label>
                            <Input id="unemployment_rate" type="number" {...register("unemployment_rate")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="informal_economy">Économie informelle (%)</Label>
                            <Input id="informal_economy" type="number" {...register("informal_economy")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="gdp_per_capita">PIB par habitant (USD)</Label>
                            <Input id="gdp_per_capita" type="number" {...register("gdp_per_capita")} />
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>

                  {/* Section 6: Social */}
                  <Card>
                    <CardHeader 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => toggleSection('social')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Heart className="w-5 h-5 text-primary" />
                          <CardTitle>Services Sociaux</CardTitle>
                        </div>
                        <span>{expandedSections.includes('social') ? '−' : '+'}</span>
                      </div>
                    </CardHeader>
                    {expandedSections.includes('social') && (
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="literacy_rate">Taux d'alphabétisation (%)</Label>
                            <Input id="literacy_rate" type="number" {...register("literacy_rate")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="infant_mortality">Mortalité infantile (‰)</Label>
                            <Input id="infant_mortality" type="number" {...register("infant_mortality")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="life_expectancy">Espérance de vie (ans)</Label>
                            <Input id="life_expectancy" type="number" {...register("life_expectancy")} />
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>

                  {/* Section 7: Environnement */}
                  <Card>
                    <CardHeader 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => toggleSection('environment')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <TreePine className="w-5 h-5 text-primary" />
                          <CardTitle>Environnement et Climat</CardTitle>
                        </div>
                        <span>{expandedSections.includes('environment') ? '−' : '+'}</span>
                      </div>
                    </CardHeader>
                    {expandedSections.includes('environment') && (
                      <CardContent>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Risques climatiques</Label>
                            <div className="grid grid-cols-2 gap-2">
                              {['Inondations', 'Sécheresse', 'Érosion côtière', 'Tempêtes', 'Canicules'].map((risk) => (
                                <label key={risk} className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    value={risk}
                                    onChange={(e) => {
                                      const current = watch("climate_risks") || [];
                                      if (e.target.checked) {
                                        setValue('climate_risks', [...current, risk]);
                                      } else {
                                        setValue('climate_risks', current.filter((r) => r !== risk));
                                      }
                                    }}
                                    className="rounded border-gray-300"
                                  />
                                  <span className="text-sm">{risk}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="green_spaces">Espaces verts (m²/hab)</Label>
                            <Input id="green_spaces" type="number" {...register("green_spaces")} />
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>

                  {/* Section 8: Transport */}
                  <Card>
                    <CardHeader 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => toggleSection('transport')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Bus className="w-5 h-5 text-primary" />
                          <CardTitle>Transport et Mobilité</CardTitle>
                        </div>
                        <span>{expandedSections.includes('transport') ? '−' : '+'}</span>
                      </div>
                    </CardHeader>
                    {expandedSections.includes('transport') && (
                      <CardContent>
                        <div className="space-y-2">
                          <Label htmlFor="public_transport">Transport public</Label>
                          <select 
                            id="public_transport" 
                            {...register("public_transport")}
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                          >
                            <option value="Inexistant">Inexistant</option>
                            <option value="Très limité">Très limité</option>
                            <option value="Limité">Limité</option>
                            <option value="Développé">Développé</option>
                            <option value="Très développé">Très développé</option>
                          </select>
                        </div>
                      </CardContent>
                    )}
                  </Card>

                  {/* Section 9: Objectifs */}
                  <Card>
                    <CardHeader 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => toggleSection('objectives')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Target className="w-5 h-5 text-primary" />
                          <CardTitle>Objectifs du Diagnostic</CardTitle>
                        </div>
                        <span>{expandedSections.includes('objectives') ? '−' : '+'}</span>
                      </div>
                    </CardHeader>
                    {expandedSections.includes('objectives') && (
                      <CardContent>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="diagnostic_type">Type de diagnostic</Label>
                            <select 
                              id="diagnostic_type" 
                              {...register("diagnostic_type")}
                              className="w-full rounded-md border border-input bg-background px-3 py-2"
                            >
                              <option value="Diagnostic général">Diagnostic général</option>
                              <option value="Diagnostic thématique - Logement">Diagnostic thématique - Logement</option>
                              <option value="Diagnostic thématique - Transport">Diagnostic thématique - Transport</option>
                              <option value="Diagnostic thématique - Environnement">Diagnostic thématique - Environnement</option>
                              <option value="Diagnostic thématique - Économie">Diagnostic thématique - Économie</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="diagnostic_objective">Objectif spécifique</Label>
                            <Textarea 
                              id="diagnostic_objective" 
                              {...register("diagnostic_objective")}
                              className="min-h-[100px]"
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
                    )}
                  </Card>

                  {/* Upload de documents */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Upload className="w-5 h-5 text-primary" />
                        <CardTitle>Documents Techniques</CardTitle>
                      </div>
                      <CardDescription>
                        Téléchargez des documents PDF (plans, études, rapports)
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
                </div>

                {/* Colonne de droite - Aperçu et Actions */}
                <div className="space-y-6">
                  {/* Carte de résumé */}
                  <Card className="sticky top-4">
                    <CardHeader>
                      <CardTitle className="text-lg">Résumé de la configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Ville:</span>
                          <span className="font-medium">{watchCity || "Non spécifiée"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Pays:</span>
                          <span className="font-medium">{watchCountry || "Non spécifié"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Population:</span>
                          <span className="font-medium">
                            {watch("population") ? Number.parseInt(watch("population") || "0", 10).toLocaleString() : "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Recherche web:</span>
                          <span className={`font-medium ${enableWebSearch ? 'text-green-600' : 'text-red-600'}`}>
                            {enableWebSearch ? 'Activée' : 'Désactivée'}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Documents:</span>
                          <span className="font-medium">{documents.length}</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border">
                        <div className="text-xs text-muted-foreground mb-2">Sections complétées:</div>
                        <div className="space-y-1">
                          {expandedSections.map((section) => (
                            <div key={section} className="flex items-center gap-2 text-xs">
                              <CheckCircle2 className="w-3 h-3 text-green-500" />
                              <span className="capitalize">{section}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button 
                        type="submit"
                        size="lg" 
                        className="w-full bg-primary text-white hover:bg-primary/90"
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
                            Générer le diagnostic complet
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Aperçu des données web */}
                  {webData?.wikipedia_info && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Globe className="w-5 h-5 text-secondary" />
                          Données Web
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {webData.wikipedia_info.summary.substring(0, 150)}...
                        </p>
                        {webData.wikipedia_info.url && (
                          <a 
                            href={webData.wikipedia_info.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline mt-2 inline-flex items-center gap-1"
                          >
                            Voir sur Wikipedia <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </form>
          </TabsContent>

          {/* SOLUTION FINALE: Iframe avec capture PDF */}
          <TabsContent value="result">
            <Card className="border-t-4 border-t-secondary">
              <CardHeader className="bg-slate-50 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-serif text-2xl text-primary">
                      Diagnostic Urbain: {watchCity}
                    </CardTitle>
                    <CardDescription>
                      Rapport généré le {new Date().toLocaleDateString('fr-FR')}
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
                    {/* Iframe pour l'affichage avec isolation CSS */}
                    <iframe
                      ref={iframeRef}
                      srcDoc={generatedContent}
                      title="Rapport Diagnostic"
                      className="w-full border-0"
                      style={{ 
                        minHeight: "1200px", 
                        height: "auto",
                        width: "100%"
                      }}
                      sandbox="allow-same-origin allow-forms allow-scripts"
                      onLoad={() => {
                        // Optionnel: ajuster la hauteur de l'iframe après chargement
                        if (iframeRef.current) {
                          const iframeDoc = iframeRef.current.contentDocument;
                          if (iframeDoc) {
                            const height = iframeDoc.body.scrollHeight;
                            iframeRef.current.style.height = height + 'px';
                          }
                        }
                      }}
                    />

                    {/* Graphiques interactifs */}
                    <div className="mt-12 space-y-8">
                      <h2>VISUALISATIONS DES DONNÉES</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Graphique démographique */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm">Structure par âge</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-64">
                              <ResponsiveContainer width="100%" height="100%">
                                <RePieChart>
                                  <Pie
                                    data={demographicData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                    label
                                  >
                                    {demographicData.map((entry, index) => (
                                      <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                  </Pie>
                                  <Tooltip />
                                  <Legend />
                                </RePieChart>
                              </ResponsiveContainer>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Croissance démographique */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm">Croissance démographique</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-64">
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={populationGrowthData}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="year" />
                                  <YAxis />
                                  <Tooltip />
                                  <Area type="monotone" dataKey="population" stroke="#1e3a5f" fill="#1e3a5f" fillOpacity={0.3} />
                                </AreaChart>
                              </ResponsiveContainer>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Infrastructures */}
                        <Card className="md:col-span-2">
                          <CardHeader>
                            <CardTitle className="text-sm">Accès aux infrastructures</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-80">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={infrastructureData}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="category" />
                                  <YAxis />
                                  <Tooltip />
                                  <Legend />
                                  <Bar dataKey="current" name="Actuel (%)" fill="#1e3a5f" />
                                  <Bar dataKey="target" name="Objectif 2030 (%)" fill="#fbbf24" />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Types de logement */}
                        <Card className="md:col-span-2">
                          <CardHeader>
                            <CardTitle className="text-sm">Types de logement</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-64">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={housingData} layout="vertical">
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis type="number" />
                                  <YAxis dataKey="type" type="category" />
                                  <Tooltip />
                                  <Bar dataKey="value" fill="#10b981">
                                    {housingData.map((entry, index) => (
                                      <Cell key={`cell-${entry.type}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                  </Bar>
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p>Aucun résultat disponible. Veuillez d'abord générer un diagnostic.</p>
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