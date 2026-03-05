import { z } from "zod";
import { formSchema } from "./schemas";

// Types pour les données
export interface WebData {  
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

export interface DocumentContent {
  filename: string;
  content: string;
  type: 'pdf' | 'image' | 'excel' | 'geojson' | 'manual' | 'unknown';
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
export interface SDGData {
  goal: number;
  target: string;
  indicator: string;
  value: number;
  year: number;
  source: string;
}

// Interface pour les données Banque Mondiale
export interface WorldBankData {
  indicator: string;
  country: string;
  value: number;
  year: number;
  source: string;
}

export interface Dimension {
  id: string;
  name: string;
  icon: any; // Lucide icon type
  color: string;
  bg: string;
  indicators: number;
}

export type FormData = z.infer<typeof formSchema>;

export interface DocumentCount {
  pdf: number;
  image: number;
  excel: number;
  geojson: number;
  manual: number;
  total: number;
}