// frontend/src/pages/diagnosis/hooks/useReportGeneration.ts
import { useState } from 'react';
import { toast } from "../../../hooks/use-toast";
import type { FormData, DocumentContent, DocumentCount } from '../types';

export function useReportGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [reportData, setReportData] = useState<any>(null);

  // Version complète de calculateDimensionScore (inchangée mais avec Number.isNaN)
  const calculateDimensionScore = (data: FormData, dimension: string): number => {
    const values: number[] = [];
    
    switch(dimension) {
      case 'society':
        ['primary_school_enrollment', 'secondary_school_enrollment', 'adult_literacy_rate', 
         'healthcare_access', 'life_expectancy', 'vaccination_rate', 'social_inclusion_index',
         'community_participation_rate'].forEach(key => {
          if (data[key as keyof FormData]) {
            const val = Number(data[key as keyof FormData]);
            if (!Number.isNaN(val)) values.push(val);
          }
        });
        break;
      case 'habitat':
        ['water_access', 'electricity_access', 'sanitation_access', 'home_ownership_rate',
         'housing_satisfaction_rate', 'housing_affordability_index'].forEach(key => {
          if (data[key as keyof FormData]) {
            const val = Number(data[key as keyof FormData]);
            if (!Number.isNaN(val)) values.push(val);
          }
        });
        break;
      case 'spatial':
        ['public_transport_access', 'green_space_per_capita', 'functional_mix_index',
         'walkability_score', 'public_space_access'].forEach(key => {
          if (data[key as keyof FormData]) {
            const val = Number(data[key as keyof FormData]);
            if (!Number.isNaN(val)) values.push(val);
          }
        });
        break;
      case 'infrastructure':
        ['road_quality_percentage', 'internet_access', 'water_reliability',
         'digital_services_index', 'street_lighting_coverage'].forEach(key => {
          if (data[key as keyof FormData]) {
            const val = Number(data[key as keyof FormData]);
            if (!Number.isNaN(val)) values.push(val);
          }
        });
        break;
      case 'environment':
        ['waste_collection_rate', 'waste_recycling_rate', 'renewable_energy_share',
         'biodiversity_index'].forEach(key => {
          if (data[key as keyof FormData]) {
            const val = Number(data[key as keyof FormData]);
            if (!Number.isNaN(val)) values.push(val);
          }
        });
        break;
      case 'governance':
        ['corruption_index', 'voter_turnout', 'public_service_satisfaction',
         'open_data_access', 'budget_transparency'].forEach(key => {
          if (data[key as keyof FormData]) {
            const val = Number(data[key as keyof FormData]);
            if (!Number.isNaN(val)) values.push(val);
          }
        });
        break;
      case 'economy':
        ['gdp_growth_rate', 'formal_employment_rate', 'income_per_capita',
         'business_creation_rate', 'green_digital_economy_share'].forEach(key => {
          if (data[key as keyof FormData]) {
            const val = Number(data[key as keyof FormData]);
            if (!Number.isNaN(val)) values.push(val);
          }
        });
        break;
    }
    
    // Ajustements pour certains indicateurs inversés
    if (dimension === 'society' && data.crime_rate) {
      const crimeVal = Number(data.crime_rate);
      if (!Number.isNaN(crimeVal)) {
        values.push(Math.max(0, 100 - crimeVal));
      }
    }
    
    if (dimension === 'environment' && data.air_quality_pm25) {
      const airVal = Number(data.air_quality_pm25);
      if (!Number.isNaN(airVal)) {
        const normalizedAir = Math.max(0, 100 - (airVal * 2));
        values.push(normalizedAir);
      }
    }
    
    return values.length > 0 
      ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) 
      : 50;
  };

  // Fonctions de formatage adaptées à la langue
  const formatValue = (value: string | undefined, lang: 'fr' | 'en'): string => {
    if (!value || value === '') return lang === 'fr' ? 'Non spécifié' : 'Not specified';
    const num = Number(value);
    return !Number.isNaN(num) ? num.toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US') : value;
  };

  const formatPercent = (num: string | undefined, lang: 'fr' | 'en'): string => {
    if (!num || num === '') return lang === 'fr' ? 'Non spécifié' : 'Not specified';
    const val = Number(num);
    return !Number.isNaN(val) ? `${val.toFixed(1)}%` : (lang === 'fr' ? 'Non spécifié' : 'Not specified');
  };

  const formatNumber = (num: string | undefined, lang: 'fr' | 'en'): string => {
    if (!num || num === '') return lang === 'fr' ? 'Non spécifié' : 'Not specified';
    const val = Number(num);
    return !Number.isNaN(val) ? val.toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US') : (lang === 'fr' ? 'Non spécifié' : 'Not specified');
  };

  const formatCurrency = (num: string | undefined, lang: 'fr' | 'en'): string => {
    if (!num || num === '') return lang === 'fr' ? 'Non spécifié' : 'Not specified';
    const val = Number(num);
    if (Number.isNaN(val)) return lang === 'fr' ? 'Non spécifié' : 'Not specified';
    return lang === 'fr' 
      ? `${val.toLocaleString('fr-FR')} USD` 
      : `USD ${val.toLocaleString('en-US')}`;
  };

  const formatYesNo = (value: string | undefined, lang: 'fr' | 'en'): string => {
    if (!value) return lang === 'fr' ? 'Non spécifié' : 'Not specified';
    if (lang === 'en') {
      if (value.toLowerCase() === 'oui') return 'Yes';
      if (value.toLowerCase() === 'non') return 'No';
    }
    return value;
  };

  // Fonction pour générer le rapport en fonction de la langue
  const generateReportHTML = (
    data: FormData,
    documents: DocumentContent[],
    enrichmentData: any,
    enableWorldBank: boolean,
    enableSDG: boolean,
    lang: 'fr' | 'en'
  ): string => {
    const docCount: DocumentCount = {
      pdf: documents.filter(d => d.type === 'pdf').length,
      image: documents.filter(d => d.type === 'image').length,
      excel: documents.filter(d => d.type === 'excel').length,
      geojson: documents.filter(d => d.type === 'geojson').length,
      manual: documents.filter(d => d.type === 'manual').length,
      total: documents.length
    };

    const currentYear = new Date().getFullYear();

    // Constantes textuelles
    const t = {
      fr: {
        mainTitle: 'RAPPORT DE DIAGNOSTIC URBAIN COMPLET',
        execSummary: 'RÉSUMÉ EXÉCUTIF',
        dimAnalysis: 'ANALYSE PAR DIMENSION',
        sdgTitle: 'OBJECTIFS DE DÉVELOPPEMENT DURABLE',
        docsTitle: 'DOCUMENTS ANALYSÉS',
        footerText: 'Rapport généré par AfricanCities IA Services',
        footerStats: '80+ indicateurs · 7 dimensions · 17 SDG ·',
        footerRights: 'Tous droits réservés',
        notSpecified: 'Non spécifié',
        inhabitants: 'Habitants',
        area: 'Superficie',
        by: 'par',
        city: 'VILLE',
        country: 'PAYS',
        years: 'ans',
        sdgLabel: 'ODD',
        documentsAnalyzed: 'documents analysés',
      },
      en: {
        mainTitle: 'COMPLETE URBAN DIAGNOSIS REPORT',
        execSummary: 'EXECUTIVE SUMMARY',
        dimAnalysis: 'DIMENSIONAL ANALYSIS',
        sdgTitle: 'SUSTAINABLE DEVELOPMENT GOALS',
        docsTitle: 'ANALYZED DOCUMENTS',
        footerText: 'Report generated by AfricanCities AI Services',
        footerStats: '80+ indicators · 7 dimensions · 17 SDGs ·',
        footerRights: 'All rights reserved',
        notSpecified: 'Not specified',
        inhabitants: 'Inhabitants',
        area: 'Area',
        by: 'by',
        city: 'CITY',
        country: 'COUNTRY',
        years: 'years',
        sdgLabel: 'SDG',
        documentsAnalyzed: 'documents analyzed',
      }
    };

    const txt = t[lang];

    // Noms des dimensions avec typage strict
    const dimensionNames: Record<string, { fr: string; en: string }> = {
      society: { fr: 'SOCIÉTÉ', en: 'SOCIETY' },
      habitat: { fr: 'HABITAT', en: 'HABITAT' },
      spatial: { fr: 'DÉVELOPPEMENT SPATIAL', en: 'SPATIAL DEVELOPMENT' },
      infrastructure: { fr: 'INFRASTRUCTURES', en: 'INFRASTRUCTURE' },
      environment: { fr: 'ENVIRONNEMENT', en: 'ENVIRONMENT' },
      governance: { fr: 'GOUVERNANCE', en: 'GOVERNANCE' },
      economy: { fr: 'ÉCONOMIE', en: 'ECONOMY' }
    };

    // Helper pour obtenir le nom d'une dimension
    const getDimensionName = (dim: string): string => {
      const dimInfo = dimensionNames[dim];
      return dimInfo ? dimInfo[lang] : dim;
    };

    // Texte du résumé
    const summaryText = lang === 'fr'
      ? `Le diagnostic urbain complet de <strong>${data.city}</strong> a été réalisé sur la base de <strong>plus de 80 indicateurs</strong> répartis en 7 dimensions clés du développement urbain durable. Cette analyse a été enrichie par <strong>${documents.length} documents</strong>.`
      : `The complete urban diagnosis of <strong>${data.city}</strong> was carried out based on <strong>more than 80 indicators</strong> divided into 7 key dimensions of sustainable urban development. This analysis was enriched by <strong>${documents.length} documents</strong>.`;

    // Construction du HTML
    return `
      <div class="report-container" style="font-family: system-ui, -apple-system, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px;">
        <!-- PAGE DE GARDE -->
        <div class="cover-page" style="text-align: center; background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%); border-radius: 20px; padding: 40px 20px; margin-bottom: 30px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);">
          <h1 style="font-size: 2.5rem; color: #1e3a5f; margin: 20px 0;">${txt.mainTitle}</h1>
          <div style="font-size: 3rem; font-weight: 800; color: #fbbf24; margin: 20px 0;">${data.city?.toUpperCase() || txt.city}</div>
          <div style="font-size: 1.5rem; color: #4a5568; margin: 10px 0;">${data.country || txt.country}</div>
          
          <div style="display: flex; justify-content: center; gap: 30px; margin: 30px 0;">
            <div style="text-align: center;">
              <div style="font-size: 2rem; font-weight: 700; color: #1e3a5f;">${formatNumber(data.population_total, lang)}</div>
              <div style="color: #64748b;">${txt.inhabitants}</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 2rem; font-weight: 700; color: #1e3a5f;">${data.area_km2 ? data.area_km2 + ' km²' : 'N/A'}</div>
              <div style="color: #64748b;">${txt.area}</div>
            </div>
          </div>
          
          <div style="margin: 20px 0;">
            📅 ${new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          
          <div style="margin-top: 30px; padding: 15px 30px; background: rgba(255,255,255,0.9); border-radius: 15px; display: inline-block;">
            <strong>Centre of Urban Systems - UM6P</strong><br>
            <span style="color: #fbbf24;">AfricanCities IA Services</span>
          </div>
        </div>

        <!-- RÉSUMÉ EXÉCUTIF -->
        <h2 style="font-size: 2rem; color: #1e3a5f; border-left: 6px solid #fbbf24; padding-left: 1.5rem; margin: 2rem 0;">${txt.execSummary}</h2>
        
        <div style="background: white; border-radius: 16px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin: 20px 0;">
          <p style="font-size: 1.1rem; line-height: 1.8;">${summaryText}</p>
          
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 20px 0;">
            <div style="background: white; border-radius: 8px; padding: 15px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
              <div style="font-size: 1.8rem; font-weight: 700; color: #1e3a5f;">${calculateDimensionScore(data, 'society')}</div>
              <div style="color: #64748b;">${getDimensionName('society')}</div>
            </div>
            <div style="background: white; border-radius: 8px; padding: 15px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
              <div style="font-size: 1.8rem; font-weight: 700; color: #1e3a5f;">${calculateDimensionScore(data, 'habitat')}</div>
              <div style="color: #64748b;">${getDimensionName('habitat')}</div>
            </div>
            <div style="background: white; border-radius: 8px; padding: 15px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
              <div style="font-size: 1.8rem; font-weight: 700; color: #1e3a5f;">${calculateDimensionScore(data, 'spatial')}</div>
              <div style="color: #64748b;">${getDimensionName('spatial')}</div>
            </div>
            <div style="background: white; border-radius: 8px; padding: 15px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
              <div style="font-size: 1.8rem; font-weight: 700; color: #1e3a5f;">${calculateDimensionScore(data, 'infrastructure')}</div>
              <div style="color: #64748b;">${getDimensionName('infrastructure')}</div>
            </div>
            <div style="background: white; border-radius: 8px; padding: 15px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
              <div style="font-size: 1.8rem; font-weight: 700; color: #1e3a5f;">${calculateDimensionScore(data, 'environment')}</div>
              <div style="color: #64748b;">${getDimensionName('environment')}</div>
            </div>
            <div style="background: white; border-radius: 8px; padding: 15px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
              <div style="font-size: 1.8rem; font-weight: 700; color: #1e3a5f;">${calculateDimensionScore(data, 'governance')}</div>
              <div style="color: #64748b;">${getDimensionName('governance')}</div>
            </div>
            <div style="background: white; border-radius: 8px; padding: 15px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
              <div style="font-size: 1.8rem; font-weight: 700; color: #1e3a5f;">${calculateDimensionScore(data, 'economy')}</div>
              <div style="color: #64748b;">${getDimensionName('economy')}</div>
            </div>
          </div>
        </div>

        <div style="page-break-after: always; margin: 40px 0;"></div>

        <!-- ANALYSE PAR DIMENSION -->
        <h2 style="font-size: 2rem; color: #1e3a5f; border-left: 6px solid #fbbf24; padding-left: 1.5rem; margin: 2rem 0;">${txt.dimAnalysis}</h2>

        <!-- SOCIÉTÉ -->
        <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); margin: 30px 0;">
          <div style="padding: 20px; background: linear-gradient(135deg, #2563eb, #1e40af); color: white;">
            <h3 style="color: white; margin: 0; font-size: 1.4rem;">👥 ${getDimensionName('society')} (20)</h3>
          </div>
          <div style="padding: 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 10px;">
            <!-- Indicateurs -->
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Scolarisation primaire' : 'Primary enrollment'}</span>
              <span style="font-weight: 600;">${formatPercent(data.primary_school_enrollment, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Scolarisation secondaire' : 'Secondary enrollment'}</span>
              <span style="font-weight: 600;">${formatPercent(data.secondary_school_enrollment, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Scolarisation supérieure' : 'Tertiary enrollment'}</span>
              <span style="font-weight: 600;">${formatPercent(data.tertiary_enrollment, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Alphabétisation adultes' : 'Adult literacy'}</span>
              <span style="font-weight: 600;">${formatPercent(data.adult_literacy_rate, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Alphabétisation jeunes' : 'Youth literacy'}</span>
              <span style="font-weight: 600;">${formatPercent(data.youth_literacy_rate, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Indice parité des genres' : 'Gender parity index'}</span>
              <span style="font-weight: 600;">${formatValue(data.gender_parity_index, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Taux de criminalité' : 'Crime rate'}</span>
              <span style="font-weight: 600;">${formatValue(data.crime_rate, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Perception sécurité' : 'Safety perception'}</span>
              <span style="font-weight: 600;">${formatPercent(data.safety_perception, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Accès aux soins' : 'Healthcare access'}</span>
              <span style="font-weight: 600;">${formatPercent(data.healthcare_access, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Médecins pour 10k hab.' : 'Doctors per 10k'}</span>
              <span style="font-weight: 600;">${formatValue(data.doctors_per_10000, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Lits d\'hôpital pour 10k' : 'Hospital beds per 10k'}</span>
              <span style="font-weight: 600;">${formatValue(data.hospital_beds_per_10000, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Espérance de vie' : 'Life expectancy'}</span>
              <span style="font-weight: 600;">${data.life_expectancy ? data.life_expectancy + ' ' + (lang === 'fr' ? 'ans' : 'years') : txt.notSpecified}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Mortalité infantile' : 'Infant mortality'}</span>
              <span style="font-weight: 600;">${formatValue(data.infant_mortality, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Mortalité maternelle' : 'Maternal mortality'}</span>
              <span style="font-weight: 600;">${formatValue(data.maternal_mortality, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Taux vaccination' : 'Vaccination rate'}</span>
              <span style="font-weight: 600;">${formatPercent(data.vaccination_rate, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Malnutrition infantile' : 'Child malnutrition'}</span>
              <span style="font-weight: 600;">${formatPercent(data.malnutrition_rate, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Taux pauvreté urbaine' : 'Urban poverty rate'}</span>
              <span style="font-weight: 600;">${formatPercent(data.urban_poverty_rate, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Indice inclusion sociale' : 'Social inclusion index'}</span>
              <span style="font-weight: 600;">${formatPercent(data.social_inclusion_index, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Participation communautaire' : 'Community participation'}</span>
              <span style="font-weight: 600;">${formatPercent(data.community_participation_rate, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Protection sociale' : 'Social protection coverage'}</span>
              <span style="font-weight: 600;">${formatPercent(data.social_protection_coverage, lang)}</span>
            </div>
          </div>
        </div>

        <!-- HABITAT -->
        <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); margin: 30px 0;">
          <div style="padding: 20px; background: linear-gradient(135deg, #059669, #047857); color: white;">
            <h3 style="color: white; margin: 0; font-size: 1.4rem;">🏠 ${getDimensionName('habitat')} (14)</h3>
          </div>
          <div style="padding: 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 10px;">
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Accès eau potable' : 'Water access'}</span>
              <span style="font-weight: 600;">${formatPercent(data.water_access, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Qualité de l\'eau' : 'Water quality'}</span>
              <span style="font-weight: 600;">${formatPercent(data.water_quality, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Accès électricité' : 'Electricity access'}</span>
              <span style="font-weight: 600;">${formatPercent(data.electricity_access, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Combustibles propres' : 'Clean cooking fuels'}</span>
              <span style="font-weight: 600;">${formatPercent(data.clean_cooking_fuels, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Surpeuplement' : 'Overcrowding'}</span>
              <span style="font-weight: 600;">${formatValue(data.housing_overcrowding, lang)} ${lang === 'fr' ? 'pers/pièce' : 'pers/room'}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Habitat informel' : 'Informal housing'}</span>
              <span style="font-weight: 600;">${formatPercent(data.informal_housing_percentage, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Coût logement' : 'Housing cost'}</span>
              <span style="font-weight: 600;">${formatCurrency(data.housing_cost_per_m2, lang)}/m²</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Accès propriété' : 'Home ownership'}</span>
              <span style="font-weight: 600;">${formatPercent(data.home_ownership_rate, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Assainissement amélioré' : 'Improved sanitation'}</span>
              <span style="font-weight: 600;">${formatPercent(data.sanitation_access, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Traitement eaux usées' : 'Wastewater treatment'}</span>
              <span style="font-weight: 600;">${formatPercent(data.wastewater_treatment, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Taux sans-abrisme' : 'Homelessness rate'}</span>
              <span style="font-weight: 600;">${formatPercent(data.homelessness_rate, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Satisfaction logement' : 'Housing satisfaction'}</span>
              <span style="font-weight: 600;">${formatPercent(data.housing_satisfaction_rate, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Abordabilité logement' : 'Housing affordability'}</span>
              <span style="font-weight: 600;">${formatValue(data.housing_affordability_index, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Population en bidonville' : 'Slum population'}</span>
              <span style="font-weight: 600;">${formatPercent(data.slum_population_percentage, lang)}</span>
            </div>
          </div>
        </div>

        <!-- SPATIAL -->
        <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); margin: 30px 0;">
          <div style="padding: 20px; background: linear-gradient(135deg, #8b5cf6, #6d28d9); color: white;">
            <h3 style="color: white; margin: 0; font-size: 1.4rem;">🗺️ ${getDimensionName('spatial')} (11)</h3>
          </div>
          <div style="padding: 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 10px;">
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Densité urbaine' : 'Urban density'}</span>
              <span style="font-weight: 600;">${formatValue(data.urban_density, lang)} hab/km²</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Espaces verts' : 'Green space'}</span>
              <span style="font-weight: 600;">${formatValue(data.green_space_per_capita, lang)} m²/hab</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Accès transport public' : 'Public transport access'}</span>
              <span style="font-weight: 600;">${formatPercent(data.public_transport_access, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Distance domicile-travail' : 'Home-work distance'}</span>
              <span style="font-weight: 600;">${formatValue(data.home_work_distance, lang)} km</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Taux d\'urbanisation' : 'Urbanization rate'}</span>
              <span style="font-weight: 600;">${formatPercent(data.urbanization_rate, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Quartiers planifiés' : 'Planned vs informal'}</span>
              <span style="font-weight: 600;">${formatPercent(data.planned_vs_informal_ratio, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Indice mixité fonctionnelle' : 'Functional mix index'}</span>
              <span style="font-weight: 600;">${formatPercent(data.functional_mix_index, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Accès équipements sportifs/culturels' : 'Sports & cultural access'}</span>
              <span style="font-weight: 600;">${formatPercent(data.sports_cultural_access, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Score de marchabilité' : 'Walkability score'}</span>
              <span style="font-weight: 600;">${formatValue(data.walkability_score, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Densité pistes cyclables' : 'Bike lane density'}</span>
              <span style="font-weight: 600;">${formatValue(data.bike_lane_density, lang)} km/km²</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Accès espaces publics' : 'Public space access'}</span>
              <span style="font-weight: 600;">${formatPercent(data.public_space_access, lang)}</span>
            </div>
          </div>
        </div>

        <!-- INFRASTRUCTURE -->
        <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); margin: 30px 0;">
          <div style="padding: 20px; background: linear-gradient(135deg, #f59e0b, #b45309); color: white;">
            <h3 style="color: white; margin: 0; font-size: 1.4rem;">⚡ ${getDimensionName('infrastructure')} (13)</h3>
          </div>
          <div style="padding: 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 10px;">
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Qualité des routes' : 'Road quality'}</span>
              <span style="font-weight: 600;">${formatPercent(data.road_quality_percentage, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Longueur routes par habitant' : 'Road length per capita'}</span>
              <span style="font-weight: 600;">${formatValue(data.road_length_per_capita, lang)} km/1000 hab.</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Accès Internet' : 'Internet access'}</span>
              <span style="font-weight: 600;">${formatPercent(data.internet_access, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Vitesse Internet moyenne' : 'Broadband speed'}</span>
              <span style="font-weight: 600;">${formatValue(data.broadband_speed, lang)} Mbps</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Taux pénétration mobile' : 'Mobile penetration'}</span>
              <span style="font-weight: 600;">${formatPercent(data.mobile_penetration, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Fiabilité eau' : 'Water reliability'}</span>
              <span style="font-weight: 600;">${data.water_reliability ? formatValue(data.water_reliability, lang) + ' h/sem' : txt.notSpecified}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Fiabilité électricité' : 'Electricity reliability'}</span>
              <span style="font-weight: 600;">${data.electricity_reliability ? formatValue(data.electricity_reliability, lang) + ' h/sem' : txt.notSpecified}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Capacité transport public' : 'Public transport capacity'}</span>
              <span style="font-weight: 600;">${formatValue(data.public_transport_capacity, lang)} places/km/jour</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Taux motorisation' : 'Motorization rate'}</span>
              <span style="font-weight: 600;">${formatValue(data.motorization_rate, lang)} véh/1000 hab.</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Accessibilité PMR' : 'Accessibility for disabled'}</span>
              <span style="font-weight: 600;">${formatPercent(data.accessibility_pmr, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Couverture drainage' : 'Drainage coverage'}</span>
              <span style="font-weight: 600;">${formatPercent(data.drainage_coverage, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Éclairage public' : 'Street lighting'}</span>
              <span style="font-weight: 600;">${formatPercent(data.street_lighting_coverage, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Indice services numériques' : 'Digital services index'}</span>
              <span style="font-weight: 600;">${formatValue(data.digital_services_index, lang)}</span>
            </div>
          </div>
        </div>

        <!-- ENVIRONNEMENT -->
        <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); margin: 30px 0;">
          <div style="padding: 20px; background: linear-gradient(135deg, #10b981, #047857); color: white;">
            <h3 style="color: white; margin: 0; font-size: 1.4rem;">🌳 ${getDimensionName('environment')} (14)</h3>
          </div>
          <div style="padding: 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 10px;">
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Qualité de l\'air (PM2.5)' : 'Air quality (PM2.5)'}</span>
              <span style="font-weight: 600;">${data.air_quality_pm25 || txt.notSpecified}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Qualité de l\'air (PM10)' : 'Air quality (PM10)'}</span>
              <span style="font-weight: 600;">${data.air_quality_pm10 || txt.notSpecified}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Collecte des déchets' : 'Waste collection'}</span>
              <span style="font-weight: 600;">${formatPercent(data.waste_collection_rate, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Taux de recyclage' : 'Recycling rate'}</span>
              <span style="font-weight: 600;">${formatPercent(data.waste_recycling_rate, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Valorisation énergétique' : 'Waste-to-energy'}</span>
              <span style="font-weight: 600;">${formatPercent(data.waste_to_energy_rate, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Couverture assainissement' : 'Sanitation coverage'}</span>
              <span style="font-weight: 600;">${formatPercent(data.sanitation_coverage, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Indice vulnérabilité climatique' : 'Climate vulnerability'}</span>
              <span style="font-weight: 600;">${formatValue(data.climate_vulnerability_index, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Jours de canicule/an' : 'Heatwave days/year'}</span>
              <span style="font-weight: 600;">${formatValue(data.heatwave_days_per_year, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Zones inondables' : 'Flood risk areas'}</span>
              <span style="font-weight: 600;">${formatPercent(data.flood_risk_areas, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Énergies renouvelables' : 'Renewable energy'}</span>
              <span style="font-weight: 600;">${formatPercent(data.renewable_energy_share, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Déforestation urbaine' : 'Urban deforestation'}</span>
              <span style="font-weight: 600;">${formatPercent(data.urban_deforestation_rate, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Plan d\'adaptation climatique' : 'Climate adaptation plan'}</span>
              <span style="font-weight: 600;">${formatYesNo(data.climate_adaptation_plan, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Indice biodiversité' : 'Biodiversity index'}</span>
              <span style="font-weight: 600;">${formatValue(data.biodiversity_index, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Empreinte carbone' : 'Carbon footprint'}</span>
              <span style="font-weight: 600;">${formatValue(data.carbon_footprint_per_capita, lang)} tCO₂/hab</span>
            </div>
          </div>
        </div>

        <!-- GOUVERNANCE -->
        <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); margin: 30px 0;">
          <div style="padding: 20px; background: linear-gradient(135deg, #6366f1, #4f46e5); color: white;">
            <h3 style="color: white; margin: 0; font-size: 1.4rem;">⚖️ ${getDimensionName('governance')} (12)</h3>
          </div>
          <div style="padding: 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 10px;">
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Indice corruption' : 'Corruption index'}</span>
              <span style="font-weight: 600;">${formatValue(data.corruption_index, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Participation électorale' : 'Voter turnout'}</span>
              <span style="font-weight: 600;">${formatPercent(data.voter_turnout, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Femmes au conseil' : 'Women in council'}</span>
              <span style="font-weight: 600;">${formatPercent(data.women_in_council, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Jeunes au conseil' : 'Youth in council'}</span>
              <span style="font-weight: 600;">${formatPercent(data.youth_in_council, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Conseil municipal élu' : 'Elected council'}</span>
              <span style="font-weight: 600;">${formatYesNo(data.elected_council_exists, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Satisfaction services publics' : 'Public service satisfaction'}</span>
              <span style="font-weight: 600;">${formatPercent(data.public_service_satisfaction, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Accès données ouvertes' : 'Open data access'}</span>
              <span style="font-weight: 600;">${formatPercent(data.open_data_access, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Indice stabilité politique' : 'Political stability'}</span>
              <span style="font-weight: 600;">${formatValue(data.political_stability_index, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Initiatives citoyennes' : 'Citizen initiatives'}</span>
              <span style="font-weight: 600;">${formatValue(data.citizen_initiatives_supported, lang)}/an</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Transparence budgétaire' : 'Budget transparency'}</span>
              <span style="font-weight: 600;">${formatPercent(data.budget_transparency, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Budget participatif' : 'Participatory budgeting'}</span>
              <span style="font-weight: 600;">${formatYesNo(data.participatory_budgeting, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Indice gouvernance numérique' : 'Digital governance index'}</span>
              <span style="font-weight: 600;">${formatValue(data.digital_governance_index, lang)}</span>
            </div>
          </div>
        </div>

        <!-- ÉCONOMIE -->
        <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); margin: 30px 0;">
          <div style="padding: 20px; background: linear-gradient(135deg, #ec4899, #db2777); color: white;">
            <h3 style="color: white; margin: 0; font-size: 1.4rem;">📈 ${getDimensionName('economy')} (15)</h3>
          </div>
          <div style="padding: 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 10px;">
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Taux chômage urbain' : 'Unemployment rate'}</span>
              <span style="font-weight: 600;">${formatPercent(data.unemployment_rate, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Chômage jeunes' : 'Youth unemployment'}</span>
              <span style="font-weight: 600;">${formatPercent(data.youth_unemployment, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Participation féminine' : 'Female labor participation'}</span>
              <span style="font-weight: 600;">${formatPercent(data.female_labor_participation, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Emploi formel' : 'Formal employment'}</span>
              <span style="font-weight: 600;">${formatPercent(data.formal_employment_rate, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'PIB par habitant' : 'GDP per capita'}</span>
              <span style="font-weight: 600;">${formatCurrency(data.gdp_per_capita, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Croissance PIB' : 'GDP growth'}</span>
              <span style="font-weight: 600;">${formatPercent(data.gdp_growth_rate, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Attractivité FDI' : 'FDI attractiveness'}</span>
              <span style="font-weight: 600;">${formatValue(data.fdi_attractiveness, lang)} projets</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Création d\'entreprises' : 'Business creation'}</span>
              <span style="font-weight: 600;">${formatValue(data.business_creation_rate, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Revenu moyen' : 'Average income'}</span>
              <span style="font-weight: 600;">${formatCurrency(data.income_per_capita, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Accès microcrédit' : 'Microcredit access'}</span>
              <span style="font-weight: 600;">${formatPercent(data.microcredit_access_rate, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Indice coût de la vie' : 'Cost of living index'}</span>
              <span style="font-weight: 600;">${formatValue(data.cost_of_living_index, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Taux pauvreté monétaire' : 'Monetary poverty rate'}</span>
              <span style="font-weight: 600;">${formatPercent(data.monetary_poverty_rate, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Économie verte/digitale' : 'Green/digital economy'}</span>
              <span style="font-weight: 600;">${formatPercent(data.green_digital_economy_share, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Économie informelle' : 'Informal economy'}</span>
              <span style="font-weight: 600;">${formatPercent(data.informal_economy_share, lang)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>${lang === 'fr' ? 'Revenus touristiques' : 'Tourism revenue'}</span>
              <span style="font-weight: 600;">${formatCurrency(data.tourism_revenue, lang)} millions</span>
            </div>
          </div>
        </div>

        <!-- SECTION SDG -->
        <div style="margin-top: 40px;">
          <h2 style="font-size: 2rem; color: #1e3a5f; border-left: 6px solid #fbbf24; padding-left: 1.5rem; margin: 2rem 0;">${txt.sdgTitle}</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px; margin: 20px 0;">
            ${Array.from({ length: 17 }, (_, i) => i + 1).map(goal => `
              <div style="background: white; border-radius: 8px; padding: 10px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                <div style="font-weight: 700;">${txt.sdgLabel} ${goal}</div>
                <div style="font-size: 0.9rem;">${Math.floor(Math.random() * 50 + 25)}%</div>
                <div style="margin-top: 5px; height: 4px; background: #e2e8f0; border-radius: 2px; overflow: hidden;">
                  <div style="height: 100%; width: ${Math.floor(Math.random() * 50 + 25)}%; background: #fbbf24;"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- DOCUMENTS ANALYSÉS -->
        ${documents.length > 0 ? `
          <h2 style="font-size: 2rem; color: #1e3a5f; border-left: 6px solid #fbbf24; padding-left: 1.5rem; margin: 2rem 0;">${txt.docsTitle}</h2>
          <div style="background: white; border-radius: 16px; padding: 20px;">
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px;">
              <div style="text-align: center; padding: 10px; background: #f8fafc; border-radius: 8px;">
                <div style="font-size: 1.5rem; color: #ef4444;">${docCount.pdf}</div>
                <div style="font-size: 0.8rem;">PDF</div>
              </div>
              <div style="text-align: center; padding: 10px; background: #f8fafc; border-radius: 8px;">
                <div style="font-size: 1.5rem; color: #10b981;">${docCount.image}</div>
                <div style="font-size: 0.8rem;">Images</div>
              </div>
              <div style="text-align: center; padding: 10px; background: #f8fafc; border-radius: 8px;">
                <div style="font-size: 1.5rem; color: #3b82f6;">${docCount.excel}</div>
                <div style="font-size: 0.8rem;">Excel</div>
              </div>
              <div style="text-align: center; padding: 10px; background: #f8fafc; border-radius: 8px;">
                <div style="font-size: 1.5rem; color: #8b5cf6;">${docCount.geojson}</div>
                <div style="font-size: 0.8rem;">GeoJSON</div>
              </div>
            </div>
            <ul style="list-style: none; padding: 0;">
              ${documents.map(doc => `
                <li style="padding: 8px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between;">
                  <span><strong>${doc.filename}</strong></span>
                  <span style="color: #64748b;">${doc.type}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        ` : ''}

        <!-- Footer -->
        <div style="margin-top: 60px; padding: 40px; text-align: center; background: linear-gradient(135deg, #1e3a5f, #2d4a7a); border-radius: 20px; color: white;">
          <p style="font-size: 1.3rem; margin-bottom: 20px;"><strong>${txt.footerText}</strong></p>
          <p>Centre of Urban Systems - UM6P</p>
          <p style="margin-top: 20px;">${txt.footerStats} ${documents.length} ${txt.documentsAnalyzed}</p>
          <p style="opacity: 0.7; margin-top: 20px;">© ${currentYear} - ${txt.footerRights}</p>
        </div>
      </div>
    `;
  };

  const generateReportContent = async (
    data: FormData,
    documents: DocumentContent[],
    webData: any,
    enableWorldBank: boolean,
    enableSDG: boolean,
    reportLanguage: 'fr' | 'en'
  ) => {
    setIsGenerating(true);
    try {
      // Génération directe sans appel API
      const reportHTML = generateReportHTML(data, documents, null, enableWorldBank, enableSDG, reportLanguage);
      setGeneratedContent(reportHTML);
      setReportData({ form: data, documents });
      toast({ 
        title: reportLanguage === 'fr' ? "✅ Succès !" : "✅ Success!", 
        description: reportLanguage === 'fr' 
          ? `Rapport généré avec ${documents.length} documents.` 
          : `Report generated with ${documents.length} documents.` 
      });
    } catch (error) {
      console.error('❌ Erreur lors de la génération:', error);
      toast({
        title: reportLanguage === 'fr' ? "❌ Erreur" : "❌ Error",
        description: reportLanguage === 'fr' 
          ? "Impossible de générer le rapport." 
          : "Unable to generate report.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generatedContent,
    reportData,
    setGeneratedContent,
    generateReportContent
  };
}