import {
  Users,
  Home,
  Map,
  Zap,
  TreePine,
  Scale,
  TrendingUp,
  Target,
  Database,
  Globe,
  Globe2
} from "lucide-react";
import type { Dimension } from "./types";

// Types de fichiers acceptés
export const ACCEPTED_FILE_TYPES = {
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

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

// Configuration des dimensions
export const DIMENSIONS: Dimension[] = [
  { id: 'society', name: 'Société', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', indicators: 20 },
  { id: 'habitat', name: 'Habitat', icon: Home, color: 'text-emerald-600', bg: 'bg-emerald-50', indicators: 14 },
  { id: 'spatial', name: 'Développement Spatial', icon: Map, color: 'text-purple-600', bg: 'bg-purple-50', indicators: 11 },
  { id: 'infrastructure', name: 'Infrastructures', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50', indicators: 13 },
  { id: 'environment', name: 'Environnement', icon: TreePine, color: 'text-green-600', bg: 'bg-green-50', indicators: 14 },
  { id: 'governance', name: 'Gouvernance', icon: Scale, color: 'text-indigo-600', bg: 'bg-indigo-50', indicators: 12 },
  { id: 'economy', name: 'Économie', icon: TrendingUp, color: 'text-rose-600', bg: 'bg-rose-50', indicators: 15 },
];

// Données mock pour les graphiques
export const demographicData = [
  { name: '0-14 ans', value: 42.5 },
  { name: '15-64 ans', value: 54.3 },
  { name: '65+ ans', value: 3.2 },
];

export const populationGrowthData = [
  { year: '2018', population: 1050000 },
  { year: '2019', population: 1087500 },
  { year: '2020', population: 1126250 },
  { year: '2021', population: 1165656 },
  { year: '2022', population: 1206428 },
  { year: '2023', population: 1250000 },
  { year: '2024', population: 1294000 },
  { year: '2025', population: 1339000 },
];

export const infrastructureData = [
  { category: 'Eau potable', current: 45, target: 80, benchmark: 75 },
  { category: 'Électricité', current: 42, target: 75, benchmark: 70 },
  { category: 'Assainissement', current: 25, target: 60, benchmark: 55 },
  { category: 'Routes', current: 60, target: 85, benchmark: 80 },
  { category: 'Internet', current: 35, target: 90, benchmark: 85 },
  { category: 'Transport public', current: 30, target: 70, benchmark: 65 },
  { category: 'Gestion déchets', current: 40, target: 75, benchmark: 70 },
];

export const housingData = [
  { type: 'Béton/Dur', value: 35 },
  { type: 'Semi-dur', value: 25 },
  { type: 'Traditionnel', value: 25 },
  { type: 'Précaire', value: 15 },
];

export const sdgData = [
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

export const COLORS = [
  '#1e3a5f', '#fbbf24', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', 
  '#6366f1', '#14b8a6', '#f97316', '#06b6d4', '#84cc16', '#a855f7', 
  '#f43f5e', '#64748b', '#0ea5e9', '#d946ef', '#22c55e'
];

// Mock data pour les sources externes
export const MOCK_WIKI_DATA = {
  wikipedia_info: {
    title: "Nouakchott, Mauritanie",
    summary: "Nouakchott est la capitale de la Mauritanie. Fondée en 1958, la ville compte environ 1.2 million d'habitants (estimation 2023). Centre économique et politique majeur de la région.",
    url: "https://fr.wikipedia.org/wiki/Nouakchott",
    found: true
  },
  world_bank_data: {
    country_data: [
      { indicator: "Population totale", value: 4500000, year: 2023 },
      { indicator: "PIB par habitant", value: 2100, year: 2023 },
      { indicator: "Taux de pauvreté", value: 31, year: 2023 },
    ],
    indicators: [
      { code: "SP.POP.TOTL", name: "Population totale", value: 4500000 },
      { code: "NY.GDP.PCAP.CD", name: "PIB par habitant", value: 2100 },
    ],
    sdg_data: [
      { goal: 1, indicator: "Taux de pauvreté", value: 31, year: 2023 },
      { goal: 3, indicator: "Mortalité infantile", value: 45, year: 2023 },
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
    }
  ]
};