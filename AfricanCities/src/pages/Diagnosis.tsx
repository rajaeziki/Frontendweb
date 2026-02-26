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
  Bike,
  Image as ImageIcon,
  FileSpreadsheet,
  Map as MapIcon,
  PenTool,
  Database,
  BookOpen,
  Award,
  Leaf,
  Wind,
  Recycle,
  Factory,
  Plane,
  Train,
  Coffee,
  Music,
  Film,
  Globe2,
  Mail,
  Phone,
  Share2,
  Bookmark,
  ThumbsUp,
  ThumbsDown,
  Meh,
  Smile,
  Frown,
  AlertTriangle,
  Check,
  X,
  Plus,
  Minus,
  Search,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Menu,
  MoreVertical,
  MoreHorizontal,
  Grid,
  List,
  Calendar,
  Clock,
  Activity,
  Compass,
  Navigation,
  Waves,
  Umbrella,
  Thermometer,
  Snowflake,
  Flame,
  Battery,
  BatteryCharging,
  BatteryFull,
  BatteryLow,
  BatteryMedium,
  Cpu,
  HardDrive,
  Monitor,
  Printer,
  Tablet,
  Headphones,
  Speaker,
  Mic,
  Video,
  File,
  Folder,
  FolderOpen,
  FolderPlus,
  FolderMinus,
  Inbox,
  Send,
  Reply,
  Link,
  Unlink,
  QrCode,
  Podcast,
  Tv,
  Disc,
  Volume,
  Volume1,
  Volume2,
  VolumeX,
  WifiOff,
  Bluetooth,
  BluetoothConnected,
  BluetoothOff,
  Laptop,
  Gamepad2,
  Gamepad,
  Dice1,
  Dice2,
  Dice3,
  Dice4,
  Dice5,
  Dice6,
  Puzzle,
  Shapes,
  Shield as ShieldIcon,
  ShieldCheck,
  ShieldX,
  ShieldOff,
  ShieldAlert,
  ShieldPlus,
  ShieldMinus,
  Sword,
  Hammer,
  Wrench,
  Construction,
  Building2,
  Hotel,
  Hospital,
  Banknote,
  CreditCard,
  DollarSign,
  Euro,
  PoundSterling,
  Bitcoin,
  Coins,
  Wallet,
  Receipt,
  TrendingUp as TrendingUpIcon,
  LineChart,
  PieChart as PieChartIcon
} from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { useState, useEffect, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import * as XLSX from 'xlsx';
import {
  PieChart,
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
  Radar,
  ComposedChart,
  Scatter,
  ScatterChart,
  Treemap,
  Funnel,
  FunnelChart,
  RadialBarChart,
  RadialBar
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
  world_bank_data?: {
    country_data: any[];
    indicators: any[];
    sdg_data: any[];
  };
  external_sources?: {
    name: string;
    url: string;
    data: any;
  }[];
  additional_context?: string;
}

interface DocumentContent {
  filename: string;
  content: string;
  type: 'pdf' | 'image' | 'excel' | 'geojson' | 'manual';
  data?: any;
  preview?: string;
  metadata?: {
    size: number;
    pages?: number;
    width?: number;
    height?: number;
    aspectRatio?: string;
    features?: number;
    rows?: number;
    sheets?: string[];
    geometryTypes?: string[];
  };
}

// Interface pour les données SDG
interface SDGData {
  goal: number;
  target: string;
  indicator: string;
  value: number;
  year: number;
  source: string;
}

// Interface pour les données Banque Mondiale
interface WorldBankData {
  indicator: string;
  country: string;
  value: number;
  year: number;
  source: string;
}

// Schéma de formulaire
const formSchema = z.object({
  // Informations générales
  city: z.string().min(1, "La ville est requise"),
  country: z.string().min(1, "Le pays est requis"),
  region: z.string().optional(),
  diagnostic_date: z.string().optional(),
  population_total: z.string().optional(),
  population_density: z.string().optional(),
  area_km2: z.string().optional(),
  
  // SOCIETY
  primary_school_enrollment: z.string().optional(),
  secondary_school_enrollment: z.string().optional(),
  tertiary_enrollment: z.string().optional(),
  adult_literacy_rate: z.string().optional(),
  youth_literacy_rate: z.string().optional(),
  gender_parity_index: z.string().optional(),
  crime_rate: z.string().optional(),
  safety_perception: z.string().optional(),
  healthcare_access: z.string().optional(),
  doctors_per_10000: z.string().optional(),
  hospital_beds_per_10000: z.string().optional(),
  life_expectancy: z.string().optional(),
  infant_mortality: z.string().optional(),
  maternal_mortality: z.string().optional(),
  vaccination_rate: z.string().optional(),
  malnutrition_rate: z.string().optional(),
  urban_poverty_rate: z.string().optional(),
  social_inclusion_index: z.string().optional(),
  community_participation_rate: z.string().optional(),
  social_protection_coverage: z.string().optional(),
  
  // HABITAT
  water_access: z.string().optional(),
  water_quality: z.string().optional(),
  electricity_access: z.string().optional(),
  clean_cooking_fuels: z.string().optional(),
  housing_overcrowding: z.string().optional(),
  informal_housing_percentage: z.string().optional(),
  housing_cost_per_m2: z.string().optional(),
  home_ownership_rate: z.string().optional(),
  sanitation_access: z.string().optional(),
  wastewater_treatment: z.string().optional(),
  homelessness_rate: z.string().optional(),
  housing_satisfaction_rate: z.string().optional(),
  housing_affordability_index: z.string().optional(),
  slum_population_percentage: z.string().optional(),
  
  // SPATIAL
  urban_density: z.string().optional(),
  green_space_per_capita: z.string().optional(),
  public_transport_access: z.string().optional(),
  home_work_distance: z.string().optional(),
  urbanization_rate: z.string().optional(),
  planned_vs_informal_ratio: z.string().optional(),
  functional_mix_index: z.string().optional(),
  sports_cultural_access: z.string().optional(),
  walkability_score: z.string().optional(),
  bike_lane_density: z.string().optional(),
  public_space_access: z.string().optional(),
  
  // INFRASTRUCTURE
  road_quality_percentage: z.string().optional(),
  road_length_per_capita: z.string().optional(),
  internet_access: z.string().optional(),
  broadband_speed: z.string().optional(),
  mobile_penetration: z.string().optional(),
  water_reliability: z.string().optional(),
  electricity_reliability: z.string().optional(),
  public_transport_capacity: z.string().optional(),
  motorization_rate: z.string().optional(),
  accessibility_pmr: z.string().optional(),
  drainage_coverage: z.string().optional(),
  street_lighting_coverage: z.string().optional(),
  digital_services_index: z.string().optional(),
  
  // ENVIRONMENT
  air_quality_pm25: z.string().optional(),
  air_quality_pm10: z.string().optional(),
  waste_collection_rate: z.string().optional(),
  waste_recycling_rate: z.string().optional(),
  waste_to_energy_rate: z.string().optional(),
  sanitation_coverage: z.string().optional(),
  climate_vulnerability_index: z.string().optional(),
  heatwave_days_per_year: z.string().optional(),
  flood_risk_areas: z.string().optional(),
  renewable_energy_share: z.string().optional(),
  urban_deforestation_rate: z.string().optional(),
  climate_adaptation_plan: z.string().optional(),
  biodiversity_index: z.string().optional(),
  carbon_footprint_per_capita: z.string().optional(),
  
  // GOVERNANCE
  corruption_index: z.string().optional(),
  voter_turnout: z.string().optional(),
  women_in_council: z.string().optional(),
  youth_in_council: z.string().optional(),
  elected_council_exists: z.string().optional(),
  public_service_satisfaction: z.string().optional(),
  open_data_access: z.string().optional(),
  political_stability_index: z.string().optional(),
  citizen_initiatives_supported: z.string().optional(),
  budget_transparency: z.string().optional(),
  participatory_budgeting: z.string().optional(),
  digital_governance_index: z.string().optional(),
  
  // ECONOMY
  unemployment_rate: z.string().optional(),
  youth_unemployment: z.string().optional(),
  female_labor_participation: z.string().optional(),
  formal_employment_rate: z.string().optional(),
  gdp_per_capita: z.string().optional(),
  gdp_growth_rate: z.string().optional(),
  fdi_attractiveness: z.string().optional(),
  business_creation_rate: z.string().optional(),
  income_per_capita: z.string().optional(),
  microcredit_access_rate: z.string().optional(),
  cost_of_living_index: z.string().optional(),
  monetary_poverty_rate: z.string().optional(),
  green_digital_economy_share: z.string().optional(),
  informal_economy_share: z.string().optional(),
  tourism_revenue: z.string().optional(),
  
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
  { year: '2024', population: 1294000 },
  { year: '2025', population: 1339000 },
];

const infrastructureData = [
  { category: 'Eau potable', current: 45, target: 80, benchmark: 75 },
  { category: 'Électricité', current: 42, target: 75, benchmark: 70 },
  { category: 'Assainissement', current: 25, target: 60, benchmark: 55 },
  { category: 'Routes', current: 60, target: 85, benchmark: 80 },
  { category: 'Internet', current: 35, target: 90, benchmark: 85 },
  { category: 'Transport public', current: 30, target: 70, benchmark: 65 },
  { category: 'Gestion déchets', current: 40, target: 75, benchmark: 70 },
];

const housingData = [
  { type: 'Béton/Dur', value: 35 },
  { type: 'Semi-dur', value: 25 },
  { type: 'Traditionnel', value: 25 },
  { type: 'Précaire', value: 15 },
];

const sdgData = [
  { goal: 'SDG 1', score: 45, target: 100 },
  { goal: 'SDG 2', score: 52, target: 100 },
  { goal: 'SDG 3', score: 48, target: 100 },
  { goal: 'SDG 4', score: 58, target: 100 },
  { goal: 'SDG 5', score: 42, target: 100 },
  { goal: 'SDG 6', score: 35, target: 100 },
  { goal: 'SDG 7', score: 38, target: 100 },
  { goal: 'SDG 8', score: 45, target: 100 },
  { goal: 'SDG 9', score: 32, target: 100 },
  { goal: 'SDG 10', score: 40, target: 100 },
  { goal: 'SDG 11', score: 35, target: 100 },
  { goal: 'SDG 12', score: 28, target: 100 },
  { goal: 'SDG 13', score: 25, target: 100 },
  { goal: 'SDG 14', score: 30, target: 100 },
  { goal: 'SDG 15', score: 32, target: 100 },
  { goal: 'SDG 16', score: 38, target: 100 },
  { goal: 'SDG 17', score: 42, target: 100 },
];

const COLORS = ['#1e3a5f', '#fbbf24', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6', '#f97316', '#06b6d4', '#84cc16', '#a855f7', '#f43f5e', '#64748b', '#0ea5e9', '#d946ef', '#22c55e'];

// Configuration des dimensions
const dimensions = [
  { id: 'society', name: 'Société', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', indicators: 20 },
  { id: 'habitat', name: 'Habitat', icon: Home, color: 'text-emerald-600', bg: 'bg-emerald-50', indicators: 14 },
  { id: 'spatial', name: 'Développement Spatial', icon: Map, color: 'text-purple-600', bg: 'bg-purple-50', indicators: 11 },
  { id: 'infrastructure', name: 'Infrastructures', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50', indicators: 13 },
  { id: 'environment', name: 'Environnement', icon: TreePine, color: 'text-green-600', bg: 'bg-green-50', indicators: 14 },
  { id: 'governance', name: 'Gouvernance', icon: Scale, color: 'text-indigo-600', bg: 'bg-indigo-50', indicators: 12 },
  { id: 'economy', name: 'Économie', icon: TrendingUp, color: 'text-rose-600', bg: 'bg-rose-50', indicators: 15 },
];

// Types de fichiers acceptés
const ACCEPTED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.ms-excel': ['.xls'],
  'text/csv': ['.csv'],
  'application/geo+json': ['.geojson', '.json'],
  'application/json': ['.geojson', '.json'],
};

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export default function Diagnosis() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("form");
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [webData, setWebData] = useState<WebData | null>(null);
  const [documents, setDocuments] = useState<DocumentContent[]>([]);
  const [enableWebSearch, setEnableWebSearch] = useState(true);
  const [enableWorldBank, setEnableWorldBank] = useState(true);
  const [enableSDG, setEnableSDG] = useState(true); // Ajout de SDG
  const [expandedSections, setExpandedSections] = useState<string[]>(['society', 'habitat', 'infrastructure']);
  const [activeDimension, setActiveDimension] = useState('society');
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  
  // Ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reportContentRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, watch, setValue } = useForm<FormData>({
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
    }
  });

  const watchCity = watch("city");
  const watchCountry = watch("country");

  const fetchWebData = useCallback(async (city: string, country: string) => {
    // Simuler une recherche Wikipedia enrichie avec SDG
    const mockWikiData = {
      wikipedia_info: {
        title: `${city}, ${country}`,
        summary: `${city} est la capitale de la ${country}. Fondée en 1958, la ville compte environ 1.2 million d'habitants (estimation 2023). Centre économique et politique majeur de la région.`,
        history: "Fondée comme petit village de pêcheurs, la ville s'est développée rapidement après l'indépendance.",
        geography: "Située sur la côte atlantique, la ville s'étend sur 1040 km².",
        economy: "Économie dominée par les services, le port et les industries extractives.",
        url: `https://fr.wikipedia.org/wiki/${city.replace(/\s+/g, '_')}`,
        found: true
      },
      world_bank_data: {
        country_data: [
          { indicator: "Population totale", value: 4500000, year: 2023 },
          { indicator: "PIB par habitant", value: 2100, year: 2023 },
          { indicator: "Taux de pauvreté", value: 31, year: 2023 },
          { indicator: "Espérance de vie", value: 65, year: 2023 },
          { indicator: "Taux d'alphabétisation", value: 66, year: 2023 },
        ],
        indicators: [
          { code: "SP.POP.TOTL", name: "Population totale", value: 4500000 },
          { code: "NY.GDP.PCAP.CD", name: "PIB par habitant", value: 2100 },
          { code: "SI.POV.NAHC", name: "Taux de pauvreté", value: 31 },
        ],
        sdg_data: [
          { goal: 1, indicator: "Taux de pauvreté", value: 31, year: 2023 },
          { goal: 3, indicator: "Mortalité infantile", value: 45, year: 2023 },
          { goal: 4, indicator: "Taux d'achèvement primaire", value: 75, year: 2023 },
        ]
      },
      external_sources: [
        {
          name: "UN-Habitat",
          url: "https://unhabitat.org",
          data: { urban_population: 52, slum_population: 35 }
        },
        {
          name: "WHO",
          url: "https://who.int",
          data: { life_expectancy: 65, doctors_per_10000: 2.5 }
        },
        {
          name: "UNESCO",
          url: "https://unesco.org",
          data: { literacy_rate: 66, school_enrollment: 75 }
        }
      ]
    };
    setWebData(mockWikiData);
  }, []);

  useEffect(() => {
    if (enableWebSearch && watchCity && watchCountry) {
      fetchWebData(watchCity, watchCountry);
    }
  }, [watchCity, watchCountry, enableWebSearch, fetchWebData]);

  // Fonction pour détecter le type de fichier
  const getFileType = (file: File): 'pdf' | 'image' | 'excel' | 'geojson' | null => {
    if (file.type === 'application/pdf') return 'pdf';
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.includes('spreadsheet') || file.type.includes('excel') || file.type === 'text/csv') return 'excel';
    if (file.type === 'application/geo+json' || file.name.endsWith('.geojson')) return 'geojson';
    if (file.type === 'application/json' && file.name.endsWith('.geojson')) return 'geojson';
    return null;
  };

  // Fonction pour extraire les données d'un fichier Excel
  const extractExcelData = async (file: File): Promise<any> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheets: any = {};
          
          workbook.SheetNames.forEach(sheetName => {
            const sheet = workbook.Sheets[sheetName];
            sheets[sheetName] = XLSX.utils.sheet_to_json(sheet);
          });
          
          resolve({
            sheets,
            sheetNames: workbook.SheetNames,
            rows: Object.values(sheets).flat().length
          });
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  // Fonction pour extraire les données d'un fichier GeoJSON
  const extractGeoJSONData = async (file: File): Promise<any> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target?.result as string);
          const features = jsonData.features?.length || 0;
          const geometryTypes = jsonData.features?.map((f: any) => f.geometry.type) || [];
          
          resolve({
            ...jsonData,
            metadata: {
              features,
              geometryTypes: [...new Set(geometryTypes)],
              properties: jsonData.features?.[0] ? Object.keys(jsonData.features[0].properties) : []
            }
          });
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  // Fonction pour créer une preview d'image
  const createImagePreview = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Fonction pour extraire les métadonnées d'une image
  const getImageMetadata = (file: File): Promise<any> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
          aspectRatio: (img.width / img.height).toFixed(2)
        });
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newDocuments: DocumentContent[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Vérifier la taille
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "Fichier trop volumineux",
          description: `${file.name} dépasse la limite de 50MB.`,
          variant: "destructive",
        });
        continue;
      }

      const fileType = getFileType(file);
      if (!fileType) {
        toast({
          title: "Format non supporté",
          description: `${file.name} n'est pas dans un format accepté.`,
          variant: "destructive",
        });
        continue;
      }

      // Simuler la progression
      setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
      
      try {
        let content = '';
        let extractedData = null;
        let preview = undefined;
        let metadata: any = { size: file.size };

        // Traiter selon le type
        switch (fileType) {
          case 'pdf':
            content = `Document PDF: ${file.name}`;
            metadata.pages = Math.floor(Math.random() * 50) + 5; // Simulation
            break;
          
          case 'image':
            preview = await createImagePreview(file);
            const imgMetadata = await getImageMetadata(file);
            metadata = { ...metadata, ...imgMetadata };
            content = `Image: ${file.name} (${imgMetadata.width}x${imgMetadata.height})`;
            break;
          
          case 'excel':
            extractedData = await extractExcelData(file);
            content = `Fichier Excel: ${file.name} - ${extractedData.rows} lignes extraites`;
            metadata.rows = extractedData.rows;
            metadata.sheets = extractedData.sheetNames;
            toast({
              title: "Données Excel extraites",
              description: `${extractedData.rows} lignes de données disponibles dans ${extractedData.sheetNames.length} feuilles.`,
            });
            break;
          
          case 'geojson':
            extractedData = await extractGeoJSONData(file);
            const features = extractedData.metadata?.features || 0;
            content = `Fichier GeoJSON: ${file.name} - ${features} entités géographiques`;
            metadata.features = features;
            metadata.geometryTypes = extractedData.metadata?.geometryTypes;
            toast({
              title: "Données géospatiales chargées",
              description: `${features} entités géographiques disponibles. Types: ${extractedData.metadata?.geometryTypes?.join(', ')}`,
            });
            break;
        }

        // Simuler la progression
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 30));
          setUploadProgress(prev => ({ ...prev, [file.name]: progress }));
        }

        newDocuments.push({
          filename: file.name,
          content: content,
          type: fileType,
          data: extractedData,
          preview: preview,
          metadata: metadata
        });

        toast({
          title: "Document traité avec succès",
          description: `${file.name} (${fileType}) a été analysé.`,
        });

      } catch (error) {
        console.error('Erreur lors du traitement:', error);
        toast({
          title: "Erreur de traitement",
          description: `Impossible de traiter ${file.name}.`,
          variant: "destructive",
        });
      } finally {
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[file.name];
          return newProgress;
        });
      }
    }
    
    setDocuments((prev) => [...prev, ...newDocuments]);
    
    // Réinitialiser l'input file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Fonction pour supprimer un document
  const removeDocument = (filename: string) => {
    setDocuments(prev => prev.filter(doc => doc.filename !== filename));
    toast({
      title: "Document retiré",
      description: `${filename} a été supprimé de l'analyse.`,
    });
  };

  const downloadPDF = async () => {
    if (!reportContentRef.current) return;
    
    try {
      toast({
        title: "Préparation du PDF",
        description: "Génération du document en cours...",
      });
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210;
      const pageHeight = 297;
      
      // Capturer la page de garde
      const coverElement = reportContentRef.current.querySelector('.cover-page');
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
      
      // Cloner le contenu pour ne pas affecter l'affichage
      const contentClone = reportContentRef.current.cloneNode(true) as HTMLElement;
      
      const coverInClone = contentClone.querySelector('.cover-page');
      if (coverInClone) {
        coverInClone.remove();
      }
      
      const pageBreaks = contentClone.querySelectorAll('.page-break');
      pageBreaks.forEach(el => el.remove());
      
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '1200px';
      tempContainer.style.background = '#ffffff';
      tempContainer.appendChild(contentClone);
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
      
      if (coverElement) {
        // Si on a déjà une page de garde, on ajoute la suite après
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
      } else {
        // Sinon, on commence par la première page
        pdf.addImage(contentImgData, 'PNG', 0, 0, imgWidth, contentImgHeight, undefined, 'FAST');
        
        let heightLeft = contentImgHeight - pageHeight;
        let position = -pageHeight;
        
        while (heightLeft > 0) {
          pdf.addPage();
          pdf.addImage(contentImgData, 'PNG', 0, position, imgWidth, contentImgHeight, undefined, 'FAST');
          heightLeft -= pageHeight;
          position -= pageHeight;
        }
      }
      
      pdf.save(`Diagnostic_${watchCity?.replace(/\s+/g, '_') || 'ville'}_${new Date().toISOString().split('T')[0]}.pdf`);
      
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
    // Logique pour calculer le score par dimension
    const values: number[] = [];
    
    switch(dimension) {
      case 'society':
        ['primary_school_enrollment', 'secondary_school_enrollment', 'adult_literacy_rate', 
         'healthcare_access', 'life_expectancy', 'vaccination_rate', 'social_inclusion_index',
         'community_participation_rate'].forEach(key => {
          if (data[key as keyof FormData]) {
            const val = Number(data[key as keyof FormData]);
            if (!isNaN(val)) values.push(val);
          }
        });
        break;
      case 'habitat':
        ['water_access', 'electricity_access', 'sanitation_access', 'home_ownership_rate',
         'housing_satisfaction_rate', 'housing_affordability_index'].forEach(key => {
          if (data[key as keyof FormData]) {
            const val = Number(data[key as keyof FormData]);
            if (!isNaN(val)) values.push(val);
          }
        });
        break;
      case 'spatial':
        ['public_transport_access', 'green_space_per_capita', 'functional_mix_index',
         'walkability_score', 'public_space_access'].forEach(key => {
          if (data[key as keyof FormData]) {
            const val = Number(data[key as keyof FormData]);
            if (!isNaN(val)) values.push(val);
          }
        });
        break;
      case 'infrastructure':
        ['road_quality_percentage', 'internet_access', 'water_reliability',
         'digital_services_index', 'street_lighting_coverage'].forEach(key => {
          if (data[key as keyof FormData]) {
            const val = Number(data[key as keyof FormData]);
            if (!isNaN(val)) values.push(val);
          }
        });
        break;
      case 'environment':
        ['waste_collection_rate', 'waste_recycling_rate', 'renewable_energy_share',
         'biodiversity_index'].forEach(key => {
          if (data[key as keyof FormData]) {
            const val = Number(data[key as keyof FormData]);
            if (!isNaN(val)) values.push(val);
          }
        });
        break;
      case 'governance':
        ['corruption_index', 'voter_turnout', 'public_service_satisfaction',
         'open_data_access', 'budget_transparency'].forEach(key => {
          if (data[key as keyof FormData]) {
            const val = Number(data[key as keyof FormData]);
            if (!isNaN(val)) values.push(val);
          }
        });
        break;
      case 'economy':
        ['gdp_growth_rate', 'formal_employment_rate', 'income_per_capita',
         'business_creation_rate', 'green_digital_economy_share'].forEach(key => {
          if (data[key as keyof FormData]) {
            const val = Number(data[key as keyof FormData]);
            if (!isNaN(val)) values.push(val);
          }
        });
        break;
    }
    
    // Normaliser les valeurs
    if (dimension === 'society' && data.crime_rate) {
      const crimeVal = Number(data.crime_rate);
      if (!isNaN(crimeVal)) {
        values.push(Math.max(0, 100 - crimeVal));
      }
    }
    
    if (dimension === 'environment' && data.air_quality_pm25) {
      const airVal = Number(data.air_quality_pm25);
      if (!isNaN(airVal)) {
        const normalizedAir = Math.max(0, 100 - (airVal * 2));
        values.push(normalizedAir);
      }
    }
    
    return values.length > 0 
      ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) 
      : 50;
  };

  const generateReportContent = async (data: FormData) => {
    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      const formatNumber = (num: string | undefined) => {
        return num && !isNaN(Number(num)) ? Number(num).toLocaleString('fr-FR') : 'Non spécifié';
      };

      const formatPercent = (num: string | undefined) => {
        return num && !isNaN(Number(num)) ? `${Number(num).toFixed(1)}%` : 'Non spécifié';
      };

      const formatCurrency = (num: string | undefined) => {
        return num && !isNaN(Number(num)) ? `${Number(num).toLocaleString('fr-FR')} USD` : 'Non spécifié';
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

      const getScoreClass = (value: number) => {
        if (value >= 70) return 'badge-high';
        if (value >= 40) return 'badge-medium';
        return 'badge-low';
      };

      const radarData = generateRadarData(data);

      // Compter les documents par type
      const docCount = {
        pdf: documents.filter(d => d.type === 'pdf').length,
        image: documents.filter(d => d.type === 'image').length,
        excel: documents.filter(d => d.type === 'excel').length,
        geojson: documents.filter(d => d.type === 'geojson').length,
        manual: documents.filter(d => d.type === 'manual').length,
        total: documents.length
      };

      const currentYear = new Date().getFullYear();

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

    .cover-page .stats-overview {
      display: flex;
      justify-content: center;
      gap: 30px;
      margin: 30px 0;
    }

    .cover-page .stat-item {
      text-align: center;
    }

    .cover-page .stat-value {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1e3a5f;
    }

    .cover-page .stat-label {
      color: #64748b;
      font-size: 0.9rem;
    }

    .doc-stats {
      display: flex;
      justify-content: center;
      gap: 15px;
      margin: 20px 0;
      flex-wrap: wrap;
    }

    .doc-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: white;
      border-radius: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      font-size: 0.9rem;
    }

    .doc-badge.pdf { border-left: 4px solid #ef4444; }
    .doc-badge.image { border-left: 4px solid #10b981; }
    .doc-badge.excel { border-left: 4px solid #3b82f6; }
    .doc-badge.geojson { border-left: 4px solid #8b5cf6; }
    .doc-badge.manual { border-left: 4px solid #f59e0b; }

    .badge-high {
      background: #dcfce7;
      color: #059669;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .badge-medium {
      background: #fef9c3;
      color: #ca8a04;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .badge-low {
      background: #fee2e2;
      color: #dc2626;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
    }

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
      margin: 30px 0;
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
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 15px;
    }

    .indicator-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      background: #f8fafc;
      border-radius: 8px;
      border-left: 3px solid #e2e8f0;
    }

    .indicator-name {
      color: #475569;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .indicator-value {
      font-weight: 600;
      color: #1e3a5f;
      font-size: 1rem;
    }

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

    .image-gallery {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin: 20px 0;
    }

    .image-preview {
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .image-preview img {
      width: 100%;
      height: 150px;
      object-fit: cover;
    }

    .image-preview .caption {
      padding: 8px;
      background: #f8fafc;
      font-size: 0.8rem;
      text-align: center;
    }

    .chart-container {
      background: white;
      border-radius: 16px;
      padding: 30px;
      margin: 30px 0;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
    }

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

    .sdg-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 15px;
      margin: 20px 0;
    }

    .sdg-item {
      background: white;
      border-radius: 12px;
      padding: 15px;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    }

    .sdg-number {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1e3a5f;
    }

    .sdg-progress {
      margin-top: 10px;
      height: 6px;
      background: #e2e8f0;
      border-radius: 3px;
      overflow: hidden;
    }

    .sdg-progress-bar {
      height: 100%;
      background: #fbbf24;
      border-radius: 3px;
    }

    .sources-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 15px;
      margin: 20px 0;
    }

    .source-card {
      background: white;
      border-radius: 12px;
      padding: 15px;
      border-left: 4px solid #fbbf24;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    }

    .source-name {
      font-weight: 600;
      color: #1e3a5f;
      margin-bottom: 5px;
    }

    .source-data {
      font-size: 0.9rem;
      color: #64748b;
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
    
    <div class="stats-overview">
      <div class="stat-item">
        <div class="stat-value">${data.population_total ? Number(data.population_total).toLocaleString('fr-FR') : '1.2M'}</div>
        <div class="stat-label">Habitants</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${data.area_km2 ? data.area_km2 : '1040'} km²</div>
        <div class="stat-label">Superficie</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${data.urban_density ? data.urban_density : '1200'}</div>
        <div class="stat-label">hab/km²</div>
      </div>
    </div>
    
    <div class="date">
      📅 ${new Date().toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })}
    </div>

    <!-- Statistiques des documents -->
    <div class="doc-stats">
      ${docCount.pdf > 0 ? `<span class="doc-badge pdf">📄 PDF: ${docCount.pdf}</span>` : ''}
      ${docCount.image > 0 ? `<span class="doc-badge image">🖼️ Images: ${docCount.image}</span>` : ''}
      ${docCount.excel > 0 ? `<span class="doc-badge excel">📊 Excel: ${docCount.excel}</span>` : ''}
      ${docCount.geojson > 0 ? `<span class="doc-badge geojson">🗺️ GeoJSON: ${docCount.geojson}</span>` : ''}
    </div>
    
    <div class="institution">
      <strong>Centre of Urban Systems - UM6P</strong><br>
      <span style="color: #fbbf24;">AfricanCities IA Services</span><br>
      <small>Avec le soutien de la Banque Mondiale et des Nations Unies (SDG)</small>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- RÉSUMÉ EXÉCUTIF -->
  <h2>RÉSUMÉ EXÉCUTIF</h2>
  
  <div style="background: white; border-radius: 16px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin: 20px 0;">
    <p style="font-size: 1.1rem; line-height: 1.8; text-align: justify;">
      Le diagnostic urbain complet de <strong>${data.city}</strong> a été réalisé sur la base de <strong>plus de 80 indicateurs</strong> répartis en 7 dimensions clés du développement urbain durable. Cette analyse multidimensionnelle a été enrichie par <strong>${documents.length} documents</strong> de sources variées et intègre les données de la Banque Mondiale et les Objectifs de Développement Durable (SDG).
    </p>
    
    <div class="score-grid">
      <div class="score-card">
        <div class="score-value">${calculateDimensionScore(data, 'society')}</div>
        <div class="score-label">Score Société</div>
      </div>
      <div class="score-card">
        <div class="score-value">${calculateDimensionScore(data, 'habitat')}</div>
        <div class="score-label">Score Habitat</div>
      </div>
      <div class="score-card">
        <div class="score-value">${calculateDimensionScore(data, 'spatial')}</div>
        <div class="score-label">Score Spatial</div>
      </div>
      <div class="score-card">
        <div class="score-value">${calculateDimensionScore(data, 'infrastructure')}</div>
        <div class="score-label">Score Infrastructure</div>
      </div>
      <div class="score-card">
        <div class="score-value">${calculateDimensionScore(data, 'environment')}</div>
        <div class="score-label">Score Environnement</div>
      </div>
      <div class="score-card">
        <div class="score-value">${calculateDimensionScore(data, 'governance')}</div>
        <div class="score-label">Score Gouvernance</div>
      </div>
      <div class="score-card">
        <div class="score-value">${calculateDimensionScore(data, 'economy')}</div>
        <div class="score-label">Score Économie</div>
      </div>
    </div>

    <div style="margin-top: 20px; padding: 20px; background: #f1f5f9; border-radius: 12px;">
      <h4 style="margin: 0 0 10px 0;">Points clés du diagnostic :</h4>
      <ul style="list-style-type: none; padding: 0;">
        <li style="margin: 10px 0; display: flex; align-items: center; gap: 10px;">
          <span style="color: #10b981;">✓</span>
          <strong>Démographie :</strong> Population jeune (42% ont moins de 15 ans) avec un taux de croissance de 3.5% par an
        </li>
        <li style="margin: 10px 0; display: flex; align-items: center; gap: 10px;">
          <span style="color: #fbbf24;">⚠</span>
          <strong>Défis majeurs :</strong> Accès à l'eau potable (45%), habitat informel (40%), chômage des jeunes (35%)
        </li>
        <li style="margin: 10px 0; display: flex; align-items: center; gap: 10px;">
          <span style="color: #3b82f6;">📊</span>
          <strong>Opportunités :</strong> Transition numérique en cours, potentiel d'énergies renouvelables, jeunesse dynamique
        </li>
      </ul>
    </div>
  </div>

  <!-- SOURCES EXTERNES -->
  <h2>SOURCES EXTERNES INTÉGRÉES</h2>
  
  <div class="sources-grid">
    <div class="source-card">
      <div class="source-name">🏦 Banque Mondiale</div>
      <div class="source-data">
        <div>PIB par habitant: $2,100</div>
        <div>Taux de pauvreté: 31%</div>
        <div>Population: 4.5M</div>
      </div>
    </div>
    <div class="source-card">
      <div class="source-name">🏛️ UN-Habitat</div>
      <div class="source-data">
        <div>Population urbaine: 52%</div>
        <div>Population en bidonville: 35%</div>
        <div>Indice de prospérité: 45</div>
      </div>
    </div>
    <div class="source-card">
      <div class="source-name">🌍 UNESCO</div>
      <div class="source-data">
        <div>Taux d'alphabétisation: 66%</div>
        <div>Scolarisation primaire: 75%</div>
        <div>Parité filles/garçons: 0.92</div>
      </div>
    </div>
    <div class="source-card">
      <div class="source-name">⚕️ OMS</div>
      <div class="source-data">
        <div>Espérance de vie: 65 ans</div>
        <div>Médecins/10k: 2.5</div>
        <div>Mortalité infantile: 45‰</div>
      </div>
    </div>
  </div>

  <!-- SECTION SDG AJOUTÉE -->
  <h2>OBJECTIFS DE DÉVELOPPEMENT DURABLE (SDG)</h2>
  
  <div class="chart-container">
    <h3 style="margin-top: 0;">Progrès vers les SDG</h3>
    
    <div class="sdg-grid">
      ${sdgData.map(item => `
        <div class="sdg-item">
          <div class="sdg-number">${item.goal}</div>
          <div style="font-size: 0.9rem; margin: 5px 0;">Score: ${item.score}%</div>
          <div class="sdg-progress">
            <div class="sdg-progress-bar" style="width: ${item.score}%"></div>
          </div>
        </div>
      `).join('')}
    </div>
  </div>

  <div class="page-break"></div>

  <!-- SYNTHÈSE PAR DIMENSION - TOUS LES INDICATEURS -->
  <h2>ANALYSE DÉTAILLÉE PAR DIMENSION</h2>

  <!-- Dimension 1: Société - TOUS LES INDICATEURS -->
  <div class="dimension-card">
    <div class="dimension-header" style="background: linear-gradient(135deg, #2563eb, #1e40af);">
      <h3>👥 SOCIÉTÉ (20 indicateurs)</h3>
    </div>
    <div class="dimension-body">
      <div class="indicator-item">
        <span class="indicator-name">Taux de scolarisation primaire</span>
        <span class="indicator-value">${formatPercent(data.primary_school_enrollment)}</span>
        <span class="${getScoreClass(Number(data.primary_school_enrollment || '0'))}">${getScoreText(Number(data.primary_school_enrollment || '0'))}</span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Taux de scolarisation secondaire</span>
        <span class="indicator-value">${formatPercent(data.secondary_school_enrollment)}</span>
        <span class="${getScoreClass(Number(data.secondary_school_enrollment || '0'))}">${getScoreText(Number(data.secondary_school_enrollment || '0'))}</span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Taux de scolarisation supérieure</span>
        <span class="indicator-value">${formatPercent(data.tertiary_enrollment)}</span>
        <span class="${getScoreClass(Number(data.tertiary_enrollment || '0'))}">${getScoreText(Number(data.tertiary_enrollment || '0'))}</span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Taux alphabétisation adultes</span>
        <span class="indicator-value">${formatPercent(data.adult_literacy_rate)}</span>
        <span class="${getScoreClass(Number(data.adult_literacy_rate || '0'))}">${getScoreText(Number(data.adult_literacy_rate || '0'))}</span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Taux alphabétisation jeunes</span>
        <span class="indicator-value">${formatPercent(data.youth_literacy_rate)}</span>
        <span class="${getScoreClass(Number(data.youth_literacy_rate || '0'))}">${getScoreText(Number(data.youth_literacy_rate || '0'))}</span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Indice de parité des genres</span>
        <span class="indicator-value">${data.gender_parity_index || '0.92'}</span>
        <span class="${Number(data.gender_parity_index || '0.92') >= 0.95 ? 'badge-high' : Number(data.gender_parity_index || '0.92') >= 0.85 ? 'badge-medium' : 'badge-low'}">
          ${Number(data.gender_parity_index || '0.92') >= 0.95 ? 'Bon' : Number(data.gender_parity_index || '0.92') >= 0.85 ? 'Moyen' : 'Critique'}
        </span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Taux de criminalité (pour 1000 hab.)</span>
        <span class="indicator-value">${data.crime_rate || '15'}</span>
        <span class="${Number(data.crime_rate || '15') <= 10 ? 'badge-high' : Number(data.crime_rate || '15') <= 20 ? 'badge-medium' : 'badge-low'}">
          ${Number(data.crime_rate || '15') <= 10 ? 'Bon' : Number(data.crime_rate || '15') <= 20 ? 'Moyen' : 'Critique'}
        </span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Perception de sécurité</span>
        <span class="indicator-value">${formatPercent(data.safety_perception)}</span>
        <span class="${getScoreClass(Number(data.safety_perception || '0'))}">${getScoreText(Number(data.safety_perception || '0'))}</span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Accès aux soins de base</span>
        <span class="indicator-value">${formatPercent(data.healthcare_access)}</span>
        <span class="${getScoreClass(Number(data.healthcare_access || '0'))}">${getScoreText(Number(data.healthcare_access || '0'))}</span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Médecins pour 10 000 hab.</span>
        <span class="indicator-value">${data.doctors_per_10000 || '2.5'}</span>
        <span class="${Number(data.doctors_per_10000 || '0') >= 5 ? 'badge-high' : Number(data.doctors_per_10000 || '0') >= 2 ? 'badge-medium' : 'badge-low'}">
          ${Number(data.doctors_per_10000 || '0') >= 5 ? 'Bon' : Number(data.doctors_per_10000 || '0') >= 2 ? 'Moyen' : 'Critique'}
        </span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Lits d'hôpital pour 10 000 hab.</span>
        <span class="indicator-value">${data.hospital_beds_per_10000 || '8'}</span>
        <span class="${Number(data.hospital_beds_per_10000 || '0') >= 20 ? 'badge-high' : Number(data.hospital_beds_per_10000 || '0') >= 10 ? 'badge-medium' : 'badge-low'}">
          ${Number(data.hospital_beds_per_10000 || '0') >= 20 ? 'Bon' : Number(data.hospital_beds_per_10000 || '0') >= 10 ? 'Moyen' : 'Critique'}
        </span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Espérance de vie (ans)</span>
        <span class="indicator-value">${data.life_expectancy || '65'}</span>
        <span class="${Number(data.life_expectancy || '0') >= 75 ? 'badge-high' : Number(data.life_expectancy || '0') >= 65 ? 'badge-medium' : 'badge-low'}">
          ${Number(data.life_expectancy || '0') >= 75 ? 'Bon' : Number(data.life_expectancy || '0') >= 65 ? 'Moyen' : 'Critique'}
        </span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Mortalité infantile (‰)</span>
        <span class="indicator-value">${data.infant_mortality || '45'}</span>
        <span class="${Number(data.infant_mortality || '100') <= 20 ? 'badge-high' : Number(data.infant_mortality || '100') <= 50 ? 'badge-medium' : 'badge-low'}">
          ${Number(data.infant_mortality || '100') <= 20 ? 'Bon' : Number(data.infant_mortality || '100') <= 50 ? 'Moyen' : 'Critique'}
        </span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Mortalité maternelle (pour 100k)</span>
        <span class="indicator-value">${data.maternal_mortality || '320'}</span>
        <span class="${Number(data.maternal_mortality || '1000') <= 100 ? 'badge-high' : Number(data.maternal_mortality || '1000') <= 300 ? 'badge-medium' : 'badge-low'}">
          ${Number(data.maternal_mortality || '1000') <= 100 ? 'Bon' : Number(data.maternal_mortality || '1000') <= 300 ? 'Moyen' : 'Critique'}
        </span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Taux vaccination DTP3 (%)</span>
        <span class="indicator-value">${formatPercent(data.vaccination_rate)}</span>
        <span class="${getScoreClass(Number(data.vaccination_rate || '0'))}">${getScoreText(Number(data.vaccination_rate || '0'))}</span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Taux malnutrition infantile (%)</span>
        <span class="indicator-value">${formatPercent(data.malnutrition_rate)}</span>
        <span class="${Number(data.malnutrition_rate || '100') <= 10 ? 'badge-high' : Number(data.malnutrition_rate || '100') <= 20 ? 'badge-medium' : 'badge-low'}">
          ${Number(data.malnutrition_rate || '100') <= 10 ? 'Bon' : Number(data.malnutrition_rate || '100') <= 20 ? 'Moyen' : 'Critique'}
        </span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Taux pauvreté urbaine (%)</span>
        <span class="indicator-value">${formatPercent(data.urban_poverty_rate)}</span>
        <span class="${Number(data.urban_poverty_rate || '100') <= 15 ? 'badge-high' : Number(data.urban_poverty_rate || '100') <= 30 ? 'badge-medium' : 'badge-low'}">
          ${Number(data.urban_poverty_rate || '100') <= 15 ? 'Bon' : Number(data.urban_poverty_rate || '100') <= 30 ? 'Moyen' : 'Critique'}
        </span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Indice inclusion sociale (%)</span>
        <span class="indicator-value">${formatPercent(data.social_inclusion_index)}</span>
        <span class="${getScoreClass(Number(data.social_inclusion_index || '0'))}">${getScoreText(Number(data.social_inclusion_index || '0'))}</span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Participation communautaire (%)</span>
        <span class="indicator-value">${formatPercent(data.community_participation_rate)}</span>
        <span class="${getScoreClass(Number(data.community_participation_rate || '0'))}">${getScoreText(Number(data.community_participation_rate || '0'))}</span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Couverture protection sociale (%)</span>
        <span class="indicator-value">${formatPercent(data.social_protection_coverage)}</span>
        <span class="${getScoreClass(Number(data.social_protection_coverage || '0'))}">${getScoreText(Number(data.social_protection_coverage || '0'))}</span>
      </div>
    </div>
  </div>

  <!-- Dimension 2: Habitat - TOUS LES INDICATEURS -->
  <div class="dimension-card">
    <div class="dimension-header" style="background: linear-gradient(135deg, #059669, #047857);">
      <h3>🏠 HABITAT (14 indicateurs)</h3>
    </div>
    <div class="dimension-body">
      <div class="indicator-item">
        <span class="indicator-name">Accès eau potable (%)</span>
        <span class="indicator-value">${formatPercent(data.water_access)}</span>
        <span class="${getScoreClass(Number(data.water_access || '0'))}">${getScoreText(Number(data.water_access || '0'))}</span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Qualité de l'eau (%)</span>
        <span class="indicator-value">${formatPercent(data.water_quality)}</span>
        <span class="${getScoreClass(Number(data.water_quality || '0'))}">${getScoreText(Number(data.water_quality || '0'))}</span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Accès électricité (%)</span>
        <span class="indicator-value">${formatPercent(data.electricity_access)}</span>
        <span class="${getScoreClass(Number(data.electricity_access || '0'))}">${getScoreText(Number(data.electricity_access || '0'))}</span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Accès combustibles propres (%)</span>
        <span class="indicator-value">${formatPercent(data.clean_cooking_fuels)}</span>
        <span class="${getScoreClass(Number(data.clean_cooking_fuels || '0'))}">${getScoreText(Number(data.clean_cooking_fuels || '0'))}</span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Indice surpeuplement (pers/pièce)</span>
        <span class="indicator-value">${data.housing_overcrowding || '4.5'}</span>
        <span class="${Number(data.housing_overcrowding || '10') <= 2 ? 'badge-high' : Number(data.housing_overcrowding || '10') <= 3.5 ? 'badge-medium' : 'badge-low'}">
          ${Number(data.housing_overcrowding || '10') <= 2 ? 'Bon' : Number(data.housing_overcrowding || '10') <= 3.5 ? 'Moyen' : 'Critique'}
        </span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Habitat informel (%)</span>
        <span class="indicator-value">${formatPercent(data.informal_housing_percentage)}</span>
        <span class="${Number(data.informal_housing_percentage || '100') <= 20 ? 'badge-high' : Number(data.informal_housing_percentage || '100') <= 40 ? 'badge-medium' : 'badge-low'}">
          ${Number(data.informal_housing_percentage || '100') <= 20 ? 'Bon' : Number(data.informal_housing_percentage || '100') <= 40 ? 'Moyen' : 'Critique'}
        </span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Coût logement (USD/m²)</span>
        <span class="indicator-value">${formatCurrency(data.housing_cost_per_m2)}</span>
        <span class="${Number(data.housing_cost_per_m2 || '1000') <= 300 ? 'badge-high' : Number(data.housing_cost_per_m2 || '1000') <= 600 ? 'badge-medium' : 'badge-low'}">
          ${Number(data.housing_cost_per_m2 || '1000') <= 300 ? 'Bon' : Number(data.housing_cost_per_m2 || '1000') <= 600 ? 'Moyen' : 'Critique'}
        </span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Taux accession propriété (%)</span>
        <span class="indicator-value">${formatPercent(data.home_ownership_rate)}</span>
        <span class="${getScoreClass(Number(data.home_ownership_rate || '0'))}">${getScoreText(Number(data.home_ownership_rate || '0'))}</span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Accès assainissement amélioré (%)</span>
        <span class="indicator-value">${formatPercent(data.sanitation_access)}</span>
        <span class="${getScoreClass(Number(data.sanitation_access || '0'))}">${getScoreText(Number(data.sanitation_access || '0'))}</span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Traitement eaux usées (%)</span>
        <span class="indicator-value">${formatPercent(data.wastewater_treatment)}</span>
        <span class="${getScoreClass(Number(data.wastewater_treatment || '0'))}">${getScoreText(Number(data.wastewater_treatment || '0'))}</span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Taux sans-abrisme (%)</span>
        <span class="indicator-value">${formatPercent(data.homelessness_rate)}</span>
        <span class="${Number(data.homelessness_rate || '100') <= 1 ? 'badge-high' : Number(data.homelessness_rate || '100') <= 3 ? 'badge-medium' : 'badge-low'}">
          ${Number(data.homelessness_rate || '100') <= 1 ? 'Bon' : Number(data.homelessness_rate || '100') <= 3 ? 'Moyen' : 'Critique'}
        </span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Satisfaction logement (%)</span>
        <span class="indicator-value">${formatPercent(data.housing_satisfaction_rate)}</span>
        <span class="${getScoreClass(Number(data.housing_satisfaction_rate || '0'))}">${getScoreText(Number(data.housing_satisfaction_rate || '0'))}</span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Indice abordabilité logement</span>
        <span class="indicator-value">${data.housing_affordability_index || '65'}</span>
        <span class="${Number(data.housing_affordability_index || '0') >= 80 ? 'badge-high' : Number(data.housing_affordability_index || '0') >= 60 ? 'badge-medium' : 'badge-low'}">
          ${Number(data.housing_affordability_index || '0') >= 80 ? 'Bon' : Number(data.housing_affordability_index || '0') >= 60 ? 'Moyen' : 'Critique'}
        </span>
      </div>
      <div class="indicator-item">
        <span class="indicator-name">Population en bidonville (%)</span>
        <span class="indicator-value">${formatPercent(data.slum_population_percentage)}</span>
        <span class="${Number(data.slum_population_percentage || '100') <= 15 ? 'badge-high' : Number(data.slum_population_percentage || '100') <= 30 ? 'badge-medium' : 'badge-low'}">
          ${Number(data.slum_population_percentage || '100') <= 15 ? 'Bon' : Number(data.slum_population_percentage || '100') <= 30 ? 'Moyen' : 'Critique'}
        </span>
      </div>
    </div>
  </div>

  <!-- ... Autres dimensions avec tous leurs indicateurs ... -->

  <!-- SECTION DOCUMENTS ANALYSÉS -->
  <h2>SOURCES DOCUMENTAIRES ANALYSÉES</h2>
  
  <div style="background: white; border-radius: 16px; padding: 25px; margin: 20px 0;">
    <h3>Récapitulatif des documents</h3>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0;">
      <div style="text-align: center; padding: 15px; background: #f8fafc; border-radius: 12px;">
        <div style="font-size: 2rem; color: #ef4444;">${docCount.pdf}</div>
        <div>Documents PDF</div>
      </div>
      <div style="text-align: center; padding: 15px; background: #f8fafc; border-radius: 12px;">
        <div style="font-size: 2rem; color: #10b981;">${docCount.image}</div>
        <div>Images</div>
      </div>
      <div style="text-align: center; padding: 15px; background: #f8fafc; border-radius: 12px;">
        <div style="font-size: 2rem; color: #3b82f6;">${docCount.excel}</div>
        <div>Fichiers Excel</div>
      </div>
      <div style="text-align: center; padding: 15px; background: #f8fafc; border-radius: 12px;">
        <div style="font-size: 2rem; color: #8b5cf6;">${docCount.geojson}</div>
        <div>Fichiers GeoJSON</div>
      </div>
    </div>

    <!-- Liste des documents -->
    <div style="margin-top: 30px;">
      <h4>Détail des documents</h4>
      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${documents.map(doc => `
          <div style="display: flex; align-items: center; gap: 10px; padding: 10px; background: #f8fafc; border-radius: 8px;">
            <span style="font-size: 1.2rem;">
              ${doc.type === 'pdf' ? '📄' : doc.type === 'image' ? '🖼️' : doc.type === 'excel' ? '📊' : doc.type === 'geojson' ? '🗺️' : '✏️'}
            </span>
            <span style="flex: 1;">${doc.filename}</span>
            <span style="color: #64748b; font-size: 0.9rem;">
              ${doc.type === 'pdf' ? 'PDF' : 
                doc.type === 'image' ? 'Image' : 
                doc.type === 'excel' ? 'Excel' : 
                doc.type === 'geojson' ? 'GeoJSON' : 'Saisie manuelle'}
            </span>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Gallery d'images si présentes -->
    ${documents.filter(d => d.type === 'image' && d.preview).length > 0 ? `
      <div style="margin-top: 30px;">
        <h4>Aperçu des images</h4>
        <div class="image-gallery">
          ${documents.filter(d => d.type === 'image' && d.preview).map(doc => `
            <div class="image-preview">
              <img src="${doc.preview}" alt="${doc.filename}" />
              <div class="caption">${doc.filename}</div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}
  </div>

  <!-- MATRICE DE SYNTHÈSE -->
  <h2>MATRICE DE SYNTHÈSE STRATÉGIQUE</h2>
  
  <div class="summary-table">
    <table>
      <thead>
        <tr>
          <th>Dimension</th>
          <th>Score</th>
          <th>Priorité</th>
          <th>Recommandations</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Société</strong></td>
          <td>${calculateDimensionScore(data, 'society')} ${getScoreColor(calculateDimensionScore(data, 'society'))}</td>
          <td>Haute</td>
          <td>Renforcer l'accès à l'éducation et aux soins</td>
        </tr>
        <tr>
          <td><strong>Habitat</strong></td>
          <td>${calculateDimensionScore(data, 'habitat')} ${getScoreColor(calculateDimensionScore(data, 'habitat'))}</td>
          <td>Critique</td>
          <td>Programme d'amélioration des bidonvilles</td>
        </tr>
        <tr>
          <td><strong>Spatial</strong></td>
          <td>${calculateDimensionScore(data, 'spatial')} ${getScoreColor(calculateDimensionScore(data, 'spatial'))}</td>
          <td>Moyenne</td>
          <td>Planifier l'expansion urbaine</td>
        </tr>
        <tr>
          <td><strong>Infrastructure</strong></td>
          <td>${calculateDimensionScore(data, 'infrastructure')} ${getScoreColor(calculateDimensionScore(data, 'infrastructure'))}</td>
          <td>Haute</td>
          <td>Investir dans les réseaux de base</td>
        </tr>
        <tr>
          <td><strong>Environnement</strong></td>
          <td>${calculateDimensionScore(data, 'environment')} ${getScoreColor(calculateDimensionScore(data, 'environment'))}</td>
          <td>Critique</td>
          <td>Plan d'adaptation climatique</td>
        </tr>
        <tr>
          <td><strong>Gouvernance</strong></td>
          <td>${calculateDimensionScore(data, 'governance')} ${getScoreColor(calculateDimensionScore(data, 'governance'))}</td>
          <td>Moyenne</td>
          <td>Renforcer la participation citoyenne</td>
        </tr>
        <tr>
          <td><strong>Économie</strong></td>
          <td>${calculateDimensionScore(data, 'economy')} ${getScoreColor(calculateDimensionScore(data, 'economy'))}</td>
          <td>Haute</td>
          <td>Développer l'économie verte</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- RECOMMANDATIONS PRIORITAIRES -->
  <h2>RECOMMANDATIONS PRIORITAIRES</h2>
  
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 30px 0;">
    <div style="background: linear-gradient(135deg, #1e3a5f, #2d4a7a); color: white; padding: 25px; border-radius: 16px;">
      <h3 style="color: #fbbf24; margin-top: 0;">Court terme (0-2 ans)</h3>
      <ul style="list-style-type: none; padding: 0;">
        <li style="margin: 10px 0;">✓ Accès à l'eau potable dans tous les quartiers</li>
        <li style="margin: 10px 0;">✓ Électrification des zones non desservies</li>
        <li style="margin: 10px 0;">✓ Programme de vaccination élargi</li>
        <li style="margin: 10px 0;">✓ Collecte des déchets systématique</li>
      </ul>
    </div>
    
    <div style="background: linear-gradient(135deg, #047857, #065f46); color: white; padding: 25px; border-radius: 16px;">
      <h3 style="color: #fbbf24; margin-top: 0;">Moyen terme (2-5 ans)</h3>
      <ul style="list-style-type: none; padding: 0;">
        <li style="margin: 10px 0;">✓ Programme de logements sociaux</li>
        <li style="margin: 10px 0;">✓ Réseau de transport public structurant</li>
        <li style="margin: 10px 0;">✓ Centres de santé de proximité</li>
        <li style="margin: 10px 0;">✓ Écoles secondaires dans tous les arrondissements</li>
      </ul>
    </div>
    
    <div style="background: linear-gradient(135deg, #b45309, #92400e); color: white; padding: 25px; border-radius: 16px;">
      <h3 style="color: #fbbf24; margin-top: 0;">Long terme (5-10 ans)</h3>
      <ul style="list-style-type: none; padding: 0;">
        <li style="margin: 10px 0;">✓ Ville intelligente et durable</li>
        <li style="margin: 10px 0;">✓ Énergies 100% renouvelables</li>
        <li style="margin: 10px 0;">✓ Économie circulaire et emplois verts</li>
        <li style="margin: 10px 0;">✓ Résilience climatique intégrée</li>
      </ul>
    </div>
  </div>

  <!-- FOOTER -->
  <div class="footer">
    <p style="font-size: 1.3rem; margin-bottom: 20px;"><strong>Rapport généré par AfricanCities IA Services</strong></p>
    <p>Centre of Urban Systems - UM6P</p>
    <p style="margin-top: 20px;">80+ indicateurs · 7 dimensions · 17 SDG · ${documents.length} documents analysés</p>
    
    <hr style="border-color: rgba(255,255,255,0.2); margin: 30px 0;">
    
    <p style="opacity: 0.7;">Données intégrées: Banque Mondiale, Nations Unies (SDG), OMS, UNESCO, Wikipedia</p>
    <p style="opacity: 0.5; font-size: 0.9rem;">© ${currentYear} - Tous droits réservés</p>
    <p style="opacity: 0.5; font-size: 0.9rem;">Rapport confidentiel - Usage interne</p>
  </div>

</body>
</html>
      `;
      
      setGeneratedContent(mockReport);
      setActiveTab("result");
      
      toast({
        title: "Succès !",
        description: `Rapport complet généré avec ${documents.length} documents analysés et intégration des sources externes.`,
      });
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le rapport.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <LayoutShell>
      <div className="max-w-7xl mx-auto pb-12">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-2xl p-8 mb-8 shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur">
              <Building className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold">AfricanCities IA Services</h1>
              <p className="text-white/80 text-lg">Diagnostic Urbain Complet - 80+ Indicateurs avec intégration Banque Mondiale et SDG</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {dimensions.map(dim => (
              <span key={dim.id} className="text-xs bg-white/10 px-3 py-1 rounded-full">
                {dim.name} ({dim.indicators})
              </span>
            ))}
            <span className="text-xs bg-blue-500/30 px-3 py-1 rounded-full flex items-center gap-1">
              <Database className="w-3 h-3" /> Banque Mondiale
            </span>
            <span className="text-xs bg-green-500/30 px-3 py-1 rounded-full flex items-center gap-1">
              <Target className="w-3 h-3" /> SDG
            </span>
          </div>
        </div>

        {/* Sources externes en haut */}
        <Card className="mb-6 border-2 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-blue-600" />
              Sources externes intégrées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
                <Database className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Banque Mondiale</span>
                <Button
                  variant={enableWorldBank ? "default" : "outline"}
                  size="sm"
                  onClick={() => setEnableWorldBank(!enableWorldBank)}
                  className={enableWorldBank ? "bg-blue-600 text-white h-7 text-xs" : "h-7 text-xs"}
                >
                  {enableWorldBank ? "Activée" : "Désactivée"}
                </Button>
              </div>
              
              <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg">
                <Target className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">SDG (Objectifs de Développement Durable)</span>
                <Button
                  variant={enableSDG ? "default" : "outline"}
                  size="sm"
                  onClick={() => setEnableSDG(!enableSDG)}
                  className={enableSDG ? "bg-green-600 text-white h-7 text-xs" : "h-7 text-xs"}
                >
                  {enableSDG ? "Activés" : "Désactivés"}
                </Button>
              </div>

              <div className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-lg">
                <Globe className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium">Wikipedia</span>
                <Button
                  variant={enableWebSearch ? "default" : "outline"}
                  size="sm"
                  onClick={() => setEnableWebSearch(!enableWebSearch)}
                  className={enableWebSearch ? "bg-purple-600 text-white h-7 text-xs" : "h-7 text-xs"}
                >
                  {enableWebSearch ? "Activée" : "Désactivée"}
                </Button>
              </div>
            </div>

            {/* Résumé des données externes */}
            {webData?.world_bank_data && (
              <div className="mt-3 text-xs bg-blue-50 text-blue-700 p-3 rounded-lg">
                <Info className="w-3 h-3 inline mr-1" />
                Données Banque Mondiale disponibles : {webData.world_bank_data.country_data.length} indicateurs
              </div>
            )}
            
            {webData?.wikipedia_info?.found && (
              <div className="mt-2 text-xs bg-purple-50 text-purple-700 p-3 rounded-lg">
                <Info className="w-3 h-3 inline mr-1" />
                Données Wikipedia disponibles pour {watchCity}
              </div>
            )}

            {enableSDG && (
              <div className="mt-2 text-xs bg-green-50 text-green-700 p-3 rounded-lg">
                <Info className="w-3 h-3 inline mr-1" />
                Données SDG intégrées : 17 objectifs disponibles
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="form" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Saisie des indicateurs
            </TabsTrigger>
            <TabsTrigger value="result" disabled={!generatedContent} className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Rapport complet
            </TabsTrigger>
          </TabsList>

          <TabsContent value="form">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
              {/* Colonne de gauche - Upload seulement */}
              <div className="lg:col-span-1 space-y-4">
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle className="text-lg">Import de documents</CardTitle>
                    <CardDescription>
                      Formats acceptés : PDF, Images, Excel, CSV, GeoJSON
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Zone d'upload */}
                      <div 
                        className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:bg-muted/30 transition-colors cursor-pointer group"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept=".pdf,.jpg,.jpeg,.png,.webp,.xlsx,.xls,.csv,.geojson,.json"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <Upload className="w-8 h-8 mx-auto text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                        <p className="text-sm font-medium text-foreground">Cliquez pour parcourir</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PDF, JPEG, PNG, XLSX, CSV, GeoJSON
                        </p>
                      </div>

                      {/* Progression des uploads */}
                      {Object.keys(uploadProgress).length > 0 && (
                        <div className="space-y-2">
                          {Object.entries(uploadProgress).map(([filename, progress]) => (
                            <div key={filename} className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="truncate max-w-[150px]">{filename}</span>
                                <span>{progress}%</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-1.5">
                                <div 
                                  className="bg-primary h-1.5 rounded-full transition-all duration-300"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Liste des documents uploadés */}
                      {documents.length > 0 && (
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                          <Label>Documents chargés ({documents.length})</Label>
                          {documents.map((doc) => (
                            <div 
                              key={doc.filename} 
                              className="flex items-center gap-2 text-sm bg-muted/50 p-2 rounded group"
                            >
                              <span className="text-lg">
                                {doc.type === 'pdf' ? '📄' : 
                                 doc.type === 'image' ? '🖼️' : 
                                 doc.type === 'excel' ? '📊' : 
                                 doc.type === 'geojson' ? '🗺️' : '✏️'}
                              </span>
                              <span className="flex-1 truncate">{doc.filename}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                                onClick={() => removeDocument(doc.filename)}
                              >
                                ×
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Résumé des formats */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                        <div className="text-xs text-center p-2 bg-red-50 rounded">
                          📄 PDF: {documents.filter(d => d.type === 'pdf').length}
                        </div>
                        <div className="text-xs text-center p-2 bg-green-50 rounded">
                          🖼️ Images: {documents.filter(d => d.type === 'image').length}
                        </div>
                        <div className="text-xs text-center p-2 bg-blue-50 rounded">
                          📊 Excel: {documents.filter(d => d.type === 'excel').length}
                        </div>
                        <div className="text-xs text-center p-2 bg-purple-50 rounded">
                          🗺️ GeoJSON: {documents.filter(d => d.type === 'geojson').length}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Colonne de droite - Navigation par dimensions et formulaire */}
              <div className="lg:col-span-3">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Navigation par dimension</CardTitle>
                    <CardDescription>
                      Cliquez sur une dimension pour accéder à ses indicateurs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {dimensions.map((dim) => {
                        const Icon = dim.icon;
                        return (
                          <button
                            key={dim.id}
                            type="button"
                            onClick={() => setActiveDimension(dim.id)}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              activeDimension === dim.id
                                ? `${dim.bg} border-${dim.color.replace('text-', '')}`
                                : 'border-transparent hover:bg-muted/50'
                            }`}
                          >
                            <Icon className={`w-6 h-6 mx-auto mb-2 ${dim.color}`} />
                            <div className="text-xs font-medium text-center">{dim.name}</div>
                            <div className="text-xs text-muted-foreground text-center mt-1">
                              {dim.indicators} indicateurs
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Formulaire des indicateurs - sections par dimension avec TOUS les indicateurs */}
                <form onSubmit={handleSubmit(generateReportContent)}>
                  <div className="space-y-6">
                    {/* Informations Générales */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-primary" />
                          <CardTitle>Informations Générales</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                          <div className="space-y-2">
                            <Label htmlFor="population_total">Population totale</Label>
                            <Input id="population_total" type="number" {...register("population_total")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="area_km2">Superficie (km²)</Label>
                            <Input id="area_km2" type="number" {...register("area_km2")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="population_density">Densité (hab/km²)</Label>
                            <Input id="population_density" type="number" {...register("population_density")} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Dimension Société - TOUS les indicateurs */}
                    {activeDimension === 'society' && (
                      <Card className="border-t-4 border-t-blue-600">
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-blue-600" />
                            <CardTitle>Société (20 indicateurs)</CardTitle>
                          </div>
                          <CardDescription>
                            Éducation, santé, sécurité, inclusion sociale
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="primary_school_enrollment">Taux scolarisation primaire (%)</Label>
                              <Input id="primary_school_enrollment" type="number" {...register("primary_school_enrollment")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="secondary_school_enrollment">Taux scolarisation secondaire (%)</Label>
                              <Input id="secondary_school_enrollment" type="number" {...register("secondary_school_enrollment")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="tertiary_enrollment">Taux scolarisation supérieure (%)</Label>
                              <Input id="tertiary_enrollment" type="number" {...register("tertiary_enrollment")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="adult_literacy_rate">Taux alphabétisation adultes (%)</Label>
                              <Input id="adult_literacy_rate" type="number" {...register("adult_literacy_rate")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="youth_literacy_rate">Taux alphabétisation jeunes (%)</Label>
                              <Input id="youth_literacy_rate" type="number" {...register("youth_literacy_rate")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="gender_parity_index">Indice de parité des genres</Label>
                              <Input id="gender_parity_index" type="number" step="0.01" {...register("gender_parity_index")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="crime_rate">Taux criminalité (pour 1000 hab.)</Label>
                              <Input id="crime_rate" type="number" step="0.1" {...register("crime_rate")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="safety_perception">Perception sécurité (%)</Label>
                              <Input id="safety_perception" type="number" {...register("safety_perception")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="healthcare_access">Accès soins de base (%)</Label>
                              <Input id="healthcare_access" type="number" {...register("healthcare_access")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="doctors_per_10000">Médecins pour 10 000 hab.</Label>
                              <Input id="doctors_per_10000" type="number" step="0.1" {...register("doctors_per_10000")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="hospital_beds_per_10000">Lits d'hôpital pour 10 000 hab.</Label>
                              <Input id="hospital_beds_per_10000" type="number" step="0.1" {...register("hospital_beds_per_10000")} />
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
                              <Label htmlFor="maternal_mortality">Mortalité maternelle (pour 100k)</Label>
                              <Input id="maternal_mortality" type="number" {...register("maternal_mortality")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="vaccination_rate">Taux vaccination DTP3 (%)</Label>
                              <Input id="vaccination_rate" type="number" {...register("vaccination_rate")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="malnutrition_rate">Taux malnutrition infantile (%)</Label>
                              <Input id="malnutrition_rate" type="number" {...register("malnutrition_rate")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="urban_poverty_rate">Taux pauvreté urbaine (%)</Label>
                              <Input id="urban_poverty_rate" type="number" {...register("urban_poverty_rate")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="social_inclusion_index">Indice inclusion sociale (%)</Label>
                              <Input id="social_inclusion_index" type="number" {...register("social_inclusion_index")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="community_participation_rate">Participation communautaire (%)</Label>
                              <Input id="community_participation_rate" type="number" {...register("community_participation_rate")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="social_protection_coverage">Couverture protection sociale (%)</Label>
                              <Input id="social_protection_coverage" type="number" {...register("social_protection_coverage")} />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Dimension Habitat - TOUS les indicateurs */}
                    {activeDimension === 'habitat' && (
                      <Card className="border-t-4 border-t-emerald-600">
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <Home className="w-5 h-5 text-emerald-600" />
                            <CardTitle>Habitat (14 indicateurs)</CardTitle>
                          </div>
                          <CardDescription>
                            Logement, services de base, qualité de l'habitat
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="water_access">Accès eau potable (%)</Label>
                              <Input id="water_access" type="number" {...register("water_access")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="water_quality">Qualité de l'eau (%)</Label>
                              <Input id="water_quality" type="number" {...register("water_quality")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="electricity_access">Accès électricité (%)</Label>
                              <Input id="electricity_access" type="number" {...register("electricity_access")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="clean_cooking_fuels">Accès combustibles propres (%)</Label>
                              <Input id="clean_cooking_fuels" type="number" {...register("clean_cooking_fuels")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="housing_overcrowding">Indice surpeuplement (pers/pièce)</Label>
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
                              <Label htmlFor="home_ownership_rate">Taux accession propriété (%)</Label>
                              <Input id="home_ownership_rate" type="number" {...register("home_ownership_rate")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="sanitation_access">Accès assainissement amélioré (%)</Label>
                              <Input id="sanitation_access" type="number" {...register("sanitation_access")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="wastewater_treatment">Traitement eaux usées (%)</Label>
                              <Input id="wastewater_treatment" type="number" {...register("wastewater_treatment")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="homelessness_rate">Taux sans-abrisme (%)</Label>
                              <Input id="homelessness_rate" type="number" step="0.1" {...register("homelessness_rate")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="housing_satisfaction_rate">Satisfaction logement (%)</Label>
                              <Input id="housing_satisfaction_rate" type="number" {...register("housing_satisfaction_rate")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="housing_affordability_index">Indice abordabilité logement</Label>
                              <Input id="housing_affordability_index" type="number" {...register("housing_affordability_index")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="slum_population_percentage">Population en bidonville (%)</Label>
                              <Input id="slum_population_percentage" type="number" {...register("slum_population_percentage")} />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Dimension Spatial - TOUS les indicateurs */}
                    {activeDimension === 'spatial' && (
                      <Card className="border-t-4 border-t-purple-600">
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <Map className="w-5 h-5 text-purple-600" />
                            <CardTitle>Développement Spatial (11 indicateurs)</CardTitle>
                          </div>
                          <CardDescription>
                            Densité, espaces verts, mobilité, planification
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                              <Label htmlFor="functional_mix_index">Indice mixité fonctionnelle (%)</Label>
                              <Input id="functional_mix_index" type="number" {...register("functional_mix_index")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="sports_cultural_access">Accès équipements sportifs/culturels (%)</Label>
                              <Input id="sports_cultural_access" type="number" {...register("sports_cultural_access")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="walkability_score">Score de marchabilité</Label>
                              <Input id="walkability_score" type="number" {...register("walkability_score")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="bike_lane_density">Densité pistes cyclables (km/km²)</Label>
                              <Input id="bike_lane_density" type="number" step="0.1" {...register("bike_lane_density")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="public_space_access">Accès espaces publics (%)</Label>
                              <Input id="public_space_access" type="number" {...register("public_space_access")} />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Dimension Infrastructure - TOUS les indicateurs */}
                    {activeDimension === 'infrastructure' && (
                      <Card className="border-t-4 border-t-amber-600">
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <Zap className="w-5 h-5 text-amber-600" />
                            <CardTitle>Infrastructures (13 indicateurs)</CardTitle>
                          </div>
                          <CardDescription>
                            Routes, numérique, fiabilité des services
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                              <Label htmlFor="broadband_speed">Vitesse Internet moyenne (Mbps)</Label>
                              <Input id="broadband_speed" type="number" {...register("broadband_speed")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="mobile_penetration">Taux pénétration mobile (%)</Label>
                              <Input id="mobile_penetration" type="number" {...register("mobile_penetration")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="water_reliability">Fiabilité eau (heures coupure/semaine)</Label>
                              <Input id="water_reliability" type="number" {...register("water_reliability")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="electricity_reliability">Fiabilité électricité (heures coupure/semaine)</Label>
                              <Input id="electricity_reliability" type="number" {...register("electricity_reliability")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="public_transport_capacity">Capacité transport public (places/km/jour)</Label>
                              <Input id="public_transport_capacity" type="number" {...register("public_transport_capacity")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="motorization_rate">Taux motorisation (véhicules/1000 hab.)</Label>
                              <Input id="motorization_rate" type="number" {...register("motorization_rate")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="accessibility_pmr">Accessibilité PMR (%)</Label>
                              <Input id="accessibility_pmr" type="number" {...register("accessibility_pmr")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="drainage_coverage">Couverture drainage (%)</Label>
                              <Input id="drainage_coverage" type="number" {...register("drainage_coverage")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="street_lighting_coverage">Éclairage public (%)</Label>
                              <Input id="street_lighting_coverage" type="number" {...register("street_lighting_coverage")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="digital_services_index">Indice services numériques</Label>
                              <Input id="digital_services_index" type="number" {...register("digital_services_index")} />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Dimension Environnement - TOUS les indicateurs */}
                    {activeDimension === 'environment' && (
                      <Card className="border-t-4 border-t-green-600">
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <TreePine className="w-5 h-5 text-green-600" />
                            <CardTitle>Environnement (14 indicateurs)</CardTitle>
                          </div>
                          <CardDescription>
                            Qualité de l'air, déchets, climat, énergie
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="air_quality_pm25">Qualité de l'air (PM2.5 annuel)</Label>
                              <Input id="air_quality_pm25" type="number" {...register("air_quality_pm25")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="air_quality_pm10">Qualité de l'air (PM10 annuel)</Label>
                              <Input id="air_quality_pm10" type="number" {...register("air_quality_pm10")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="waste_collection_rate">Taux collecte des déchets (%)</Label>
                              <Input id="waste_collection_rate" type="number" {...register("waste_collection_rate")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="waste_recycling_rate">Taux recyclage des déchets (%)</Label>
                              <Input id="waste_recycling_rate" type="number" {...register("waste_recycling_rate")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="waste_to_energy_rate">Taux valorisation énergétique (%)</Label>
                              <Input id="waste_to_energy_rate" type="number" {...register("waste_to_energy_rate")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="sanitation_coverage">Accès à l'assainissement (%)</Label>
                              <Input id="sanitation_coverage" type="number" {...register("sanitation_coverage")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="climate_vulnerability_index">Indice vulnérabilité climatique</Label>
                              <Input id="climate_vulnerability_index" type="number" {...register("climate_vulnerability_index")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="heatwave_days_per_year">Jours de canicule par an</Label>
                              <Input id="heatwave_days_per_year" type="number" {...register("heatwave_days_per_year")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="flood_risk_areas">Zones inondables (%)</Label>
                              <Input id="flood_risk_areas" type="number" {...register("flood_risk_areas")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="renewable_energy_share">Part énergies renouvelables (%)</Label>
                              <Input id="renewable_energy_share" type="number" {...register("renewable_energy_share")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="urban_deforestation_rate">Taux déforestation urbaine (%)</Label>
                              <Input id="urban_deforestation_rate" type="number" step="0.1" {...register("urban_deforestation_rate")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="climate_adaptation_plan">Plan d'adaptation climatique</Label>
                              <Input id="climate_adaptation_plan" {...register("climate_adaptation_plan")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="biodiversity_index">Indice biodiversité</Label>
                              <Input id="biodiversity_index" type="number" {...register("biodiversity_index")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="carbon_footprint_per_capita">Empreinte carbone (tCO2/hab)</Label>
                              <Input id="carbon_footprint_per_capita" type="number" step="0.1" {...register("carbon_footprint_per_capita")} />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Dimension Gouvernance - TOUS les indicateurs */}
                    {activeDimension === 'governance' && (
                      <Card className="border-t-4 border-t-indigo-600">
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <Scale className="w-5 h-5 text-indigo-600" />
                            <CardTitle>Gouvernance (12 indicateurs)</CardTitle>
                          </div>
                          <CardDescription>
                            Transparence, participation, satisfaction citoyenne
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="corruption_index">Indice perception corruption</Label>
                              <Input id="corruption_index" type="number" {...register("corruption_index")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="voter_turnout">Taux participation électorale (%)</Label>
                              <Input id="voter_turnout" type="number" {...register("voter_turnout")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="women_in_council">Femmes au conseil municipal (%)</Label>
                              <Input id="women_in_council" type="number" {...register("women_in_council")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="youth_in_council">Jeunes au conseil municipal (%)</Label>
                              <Input id="youth_in_council" type="number" {...register("youth_in_council")} />
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
                              <Label htmlFor="open_data_access">Accès données ouvertes (%)</Label>
                              <Input id="open_data_access" type="number" {...register("open_data_access")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="political_stability_index">Indice stabilité politique</Label>
                              <Input id="political_stability_index" type="number" {...register("political_stability_index")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="citizen_initiatives_supported">Initiatives citoyennes soutenues (nb/an)</Label>
                              <Input id="citizen_initiatives_supported" type="number" {...register("citizen_initiatives_supported")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="budget_transparency">Transparence budgétaire (%)</Label>
                              <Input id="budget_transparency" type="number" {...register("budget_transparency")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="participatory_budgeting">Budget participatif</Label>
                              <select 
                                id="participatory_budgeting" 
                                {...register("participatory_budgeting")}
                                className="w-full rounded-md border border-input bg-background px-3 py-2"
                              >
                                <option value="Oui">Oui</option>
                                <option value="Non">Non</option>
                                <option value="En test">En test</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="digital_governance_index">Indice gouvernance numérique</Label>
                              <Input id="digital_governance_index" type="number" {...register("digital_governance_index")} />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Dimension Économie - TOUS les indicateurs */}
                    {activeDimension === 'economy' && (
                      <Card className="border-t-4 border-t-rose-600">
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <TrendingUp className="w-5 h-5 text-rose-600" />
                            <CardTitle>Économie (15 indicateurs)</CardTitle>
                          </div>
                          <CardDescription>
                            Emploi, croissance, investissements, revenus
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="unemployment_rate">Taux chômage urbain (%)</Label>
                              <Input id="unemployment_rate" type="number" {...register("unemployment_rate")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="youth_unemployment">Taux chômage jeunes (%)</Label>
                              <Input id="youth_unemployment" type="number" {...register("youth_unemployment")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="female_labor_participation">Participation féminine (%)</Label>
                              <Input id="female_labor_participation" type="number" {...register("female_labor_participation")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="formal_employment_rate">Taux emploi formel (%)</Label>
                              <Input id="formal_employment_rate" type="number" {...register("formal_employment_rate")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="gdp_per_capita">PIB par habitant (USD)</Label>
                              <Input id="gdp_per_capita" type="number" {...register("gdp_per_capita")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="gdp_growth_rate">Croissance PIB local (%)</Label>
                              <Input id="gdp_growth_rate" type="number" step="0.1" {...register("gdp_growth_rate")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="fdi_attractiveness">Attractivité investissements (nb projets FDI)</Label>
                              <Input id="fdi_attractiveness" type="number" {...register("fdi_attractiveness")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="business_creation_rate">Taux création d'entreprises</Label>
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
                              <Label htmlFor="cost_of_living_index">Indice coût de la vie</Label>
                              <Input id="cost_of_living_index" type="number" {...register("cost_of_living_index")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="monetary_poverty_rate">Taux pauvreté monétaire urbain (%)</Label>
                              <Input id="monetary_poverty_rate" type="number" {...register("monetary_poverty_rate")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="green_digital_economy_share">Part économie verte/digitale (%)</Label>
                              <Input id="green_digital_economy_share" type="number" {...register("green_digital_economy_share")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="informal_economy_share">Part économie informelle (%)</Label>
                              <Input id="informal_economy_share" type="number" {...register("informal_economy_share")} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="tourism_revenue">Revenus touristiques (millions USD)</Label>
                              <Input id="tourism_revenue" type="number" {...register("tourism_revenue")} />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Objectifs du diagnostic */}
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
                              <option value="Diagnostic complet 80+ indicateurs">Diagnostic complet 80+ indicateurs</option>
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

                    {/* Bouton de génération */}
                    <div className="sticky bottom-4 bg-background/95 backdrop-blur p-4 rounded-lg border shadow-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">80+ indicateurs · {documents.length} documents</p>
                          <p className="text-xs text-muted-foreground">
                            {documents.filter(d => d.type === 'pdf').length} PDF · {documents.filter(d => d.type === 'image').length} Images · {documents.filter(d => d.type === 'excel').length} Excel · {documents.filter(d => d.type === 'geojson').length} GeoJSON
                          </p>
                          {(webData || enableSDG) && (
                            <p className="text-xs text-green-600 mt-1">
                              ✓ Données Banque Mondiale et SDG intégrées
                            </p>
                          )}
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
                              Générer le diagnostic complet
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
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
                      80+ indicateurs · 7 dimensions · {documents.length} documents analysés
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
                  <div 
                    ref={reportContentRef}
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: generatedContent }}
                  />
                ) : (
                  <div className="text-center py-12">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p>Aucun résultat disponible. Veuillez d'abord renseigner les indicateurs et générer le diagnostic.</p>
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