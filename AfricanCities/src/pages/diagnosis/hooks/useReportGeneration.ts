// frontend/src/pages/diagnosis/hooks/useReportGeneration.ts
import { useState } from 'react';
import { toast } from "../../../hooks/use-toast";
import type { FormData, DocumentContent, DocumentCount } from '../types';
import { sdgData } from '../constants';
import { enrichDiagnostic } from '../../../services/api';

export function useReportGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [reportData, setReportData] = useState<any>(null);

  const calculateDimensionScore = (data: FormData, dimension: string): number => {
    const values: number[] = [];
    
    switch(dimension) {
      case 'society':
        ['primary_school_enrollment', 'secondary_school_enrollment', 'tertiary_enrollment', 
         'adult_literacy_rate', 'youth_literacy_rate', 'gender_parity_index',
         'crime_rate', 'safety_perception', 'healthcare_access', 'doctors_per_10000',
         'hospital_beds_per_10000', 'life_expectancy', 'infant_mortality', 
         'maternal_mortality', 'vaccination_rate', 'malnutrition_rate',
         'urban_poverty_rate', 'social_inclusion_index', 'community_participation_rate',
         'social_protection_coverage'].forEach(key => {
          if (data[key as keyof FormData]) {
            const val = Number(data[key as keyof FormData]);
            if (!isNaN(val)) values.push(val);
          }
        });
        break;
      case 'habitat':
        ['water_access', 'water_quality', 'electricity_access', 'clean_cooking_fuels',
         'housing_overcrowding', 'informal_housing_percentage', 'housing_cost_per_m2',
         'home_ownership_rate', 'sanitation_access', 'wastewater_treatment',
         'homelessness_rate', 'housing_satisfaction_rate', 'housing_affordability_index',
         'slum_population_percentage'].forEach(key => {
          if (data[key as keyof FormData]) {
            const val = Number(data[key as keyof FormData]);
            if (!isNaN(val)) values.push(val);
          }
        });
        break;
      case 'spatial':
        ['urban_density', 'green_space_per_capita', 'public_transport_access',
         'home_work_distance', 'urbanization_rate', 'planned_vs_informal_ratio',
         'functional_mix_index', 'sports_cultural_access', 'walkability_score',
         'bike_lane_density', 'public_space_access'].forEach(key => {
          if (data[key as keyof FormData]) {
            const val = Number(data[key as keyof FormData]);
            if (!isNaN(val)) values.push(val);
          }
        });
        break;
      case 'infrastructure':
        ['road_quality_percentage', 'road_length_per_capita', 'internet_access',
         'broadband_speed', 'mobile_penetration', 'water_reliability',
         'electricity_reliability', 'public_transport_capacity', 'motorization_rate',
         'accessibility_pmr', 'drainage_coverage', 'street_lighting_coverage',
         'digital_services_index'].forEach(key => {
          if (data[key as keyof FormData]) {
            const val = Number(data[key as keyof FormData]);
            if (!isNaN(val)) values.push(val);
          }
        });
        break;
      case 'environment':
        ['air_quality_pm25', 'air_quality_pm10', 'waste_collection_rate',
         'waste_recycling_rate', 'waste_to_energy_rate', 'sanitation_coverage',
         'climate_vulnerability_index', 'heatwave_days_per_year', 'flood_risk_areas',
         'renewable_energy_share', 'urban_deforestation_rate', 'biodiversity_index',
         'carbon_footprint_per_capita'].forEach(key => {
          if (data[key as keyof FormData]) {
            const val = Number(data[key as keyof FormData]);
            if (!isNaN(val)) values.push(val);
          }
        });
        if (data.climate_adaptation_plan) values.push(50); // Valeur par défaut pour les textes
        break;
      case 'governance':
        ['corruption_index', 'voter_turnout', 'women_in_council', 'youth_in_council',
         'public_service_satisfaction', 'open_data_access', 'political_stability_index',
         'citizen_initiatives_supported', 'budget_transparency', 'digital_governance_index'
        ].forEach(key => {
          if (data[key as keyof FormData]) {
            const val = Number(data[key as keyof FormData]);
            if (!isNaN(val)) values.push(val);
          }
        });
        if (data.elected_council_exists === 'Oui') values.push(100);
        if (data.elected_council_exists === 'Non') values.push(0);
        if (data.elected_council_exists === 'En partie') values.push(50);
        if (data.participatory_budgeting === 'Oui') values.push(100);
        if (data.participatory_budgeting === 'Non') values.push(0);
        if (data.participatory_budgeting === 'En test') values.push(50);
        break;
      case 'economy':
        ['unemployment_rate', 'youth_unemployment', 'female_labor_participation',
         'formal_employment_rate', 'gdp_per_capita', 'gdp_growth_rate',
         'fdi_attractiveness', 'business_creation_rate', 'income_per_capita',
         'microcredit_access_rate', 'cost_of_living_index', 'monetary_poverty_rate',
         'green_digital_economy_share', 'informal_economy_share', 'tourism_revenue'
        ].forEach(key => {
          if (data[key as keyof FormData]) {
            const val = Number(data[key as keyof FormData]);
            if (!isNaN(val)) values.push(val);
          }
        });
        break;
      default:
        return 50;
    }
    
    return values.length > 0 
      ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) 
      : 50;
  };

  // Fonction pour générer le rapport avec les vraies données du backend
  const generateReportContent = async (
    data: FormData,
    documents: DocumentContent[],
    webData: any,
    enableWorldBank: boolean,
    enableSDG: boolean
  ) => {
    console.log('🚀 DÉBUT GÉNÉRATION RAPPORT');
    console.log('📝 Données reçues du formulaire:', data);
    setIsGenerating(true);
    
    try {
      // 1. Préparer les données pour l'enrichissement
      const diagnosticData = {
        city: data.city,
        country: data.country,
        population_total: data.population_total,
        area_km2: data.area_km2,
        primary_school_enrollment: data.primary_school_enrollment,
        secondary_school_enrollment: data.secondary_school_enrollment,
        adult_literacy_rate: data.adult_literacy_rate,
        water_access: data.water_access,
        electricity_access: data.electricity_access,
        unemployment_rate: data.unemployment_rate,
        air_quality_pm25: data.air_quality_pm25,
        women_in_council: data.women_in_council,
        gdp_per_capita: data.gdp_per_capita,
        // Ajout d'autres indicateurs pour les ODD
        sanitation_access: data.sanitation_access,
        renewable_energy_share: data.renewable_energy_share,
        corruption_index: data.corruption_index,
        gdp_growth_rate: data.gdp_growth_rate
      };

      console.log('📦 Données de diagnostic pour enrichissement:', diagnosticData);

      // 2. Appeler l'API d'enrichissement si activée
      let enrichmentData = null;
      if (enableWorldBank || enableSDG) {
        console.log('🌍 Appel API enrichissement...');
        const response = await enrichDiagnostic(
          data.city || '',
          data.country || '',
          enableSDG ? diagnosticData : null
        );
        
        if (response.success) {
          enrichmentData = response.data;
          console.log('✅ Données enrichies reçues:', enrichmentData);
        }
      }

      // 3. Générer le rapport avec les vraies données
      const reportHTML = generateReportHTML(
        data,
        documents,
        enrichmentData,
        enableWorldBank,
        enableSDG
      );
      
      setGeneratedContent(reportHTML);
      setReportData({ form: data, documents, enrichment: enrichmentData });
      
      toast({
        title: "✅ Succès !",
        description: `Rapport complet généré avec ${documents.length} documents analysés.`,
      });

    } catch (error) {
      console.error('❌ Erreur lors de la génération:', error);
      toast({
        title: "❌ Erreur",
        description: "Impossible de générer le rapport.",
        variant: "destructive",
      });
      
      // Fallback : générer le rapport mock en cas d'erreur
      const mockReport = generateMockReport(data, documents);
      setGeneratedContent(mockReport);
      
    } finally {
      setIsGenerating(false);
    }
  };

  // Fonction pour générer le HTML du rapport avec TOUS les indicateurs
  const generateReportHTML = (
    data: FormData,
    documents: DocumentContent[],
    enrichmentData: any,
    enableWorldBank: boolean,
    enableSDG: boolean
  ): string => {
    const formatValue = (value: string | undefined): string => {
      if (!value || value === '') return 'Non spécifié';
      const num = Number(value);
      return !isNaN(num) ? num.toLocaleString('fr-FR') : value;
    };

    const formatPercent = (num: string | undefined): string => {
      if (!num || num === '') return 'Non spécifié';
      const val = Number(num);
      return !isNaN(val) ? `${val.toFixed(1)}%` : 'Non spécifié';
    };

    const formatNumber = (num: string | undefined): string => {
      if (!num || num === '') return 'Non spécifié';
      const val = Number(num);
      return !isNaN(val) ? val.toLocaleString('fr-FR') : 'Non spécifié';
    };

    const formatCurrency = (num: string | undefined): string => {
      if (!num || num === '') return 'Non spécifié';
      const val = Number(num);
      return !isNaN(val) ? `${val.toLocaleString('fr-FR')} USD` : 'Non spécifié';
    };

    const formatYesNo = (value: string | undefined): string => {
      if (!value) return 'Non spécifié';
      return value;
    };

    const docCount: DocumentCount = {
      pdf: documents.filter(d => d.type === 'pdf').length,
      image: documents.filter(d => d.type === 'image').length,
      excel: documents.filter(d => d.type === 'excel').length,
      geojson: documents.filter(d => d.type === 'geojson').length,
      manual: documents.filter(d => d.type === 'manual').length,
      total: documents.length
    };

    const currentYear = new Date().getFullYear();
    const hasEnrichment = enrichmentData && (enrichmentData.wikipedia || enrichmentData.world_bank);

    return `
      <div class="report-container" style="font-family: system-ui, -apple-system, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px;">
        <!-- PAGE DE GARDE -->
        <div class="cover-page" style="text-align: center; background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%); border-radius: 20px; padding: 40px 20px; margin-bottom: 30px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);">
          <h1 style="font-size: 2.5rem; color: #1e3a5f; margin: 20px 0;">RAPPORT DE DIAGNOSTIC URBAIN COMPLET</h1>
          <div style="font-size: 3rem; font-weight: 800; color: #fbbf24; margin: 20px 0;">${data.city?.toUpperCase() || 'VILLE'}</div>
          <div style="font-size: 1.5rem; color: #4a5568; margin: 10px 0;">${data.country || 'PAYS'}</div>
          
          <div style="display: flex; justify-content: center; gap: 30px; margin: 30px 0;">
            <div style="text-align: center;">
              <div style="font-size: 2rem; font-weight: 700; color: #1e3a5f;">${formatNumber(data.population_total)}</div>
              <div style="color: #64748b;">Habitants</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 2rem; font-weight: 700; color: #1e3a5f;">${data.area_km2 ? data.area_km2 + ' km²' : 'N/A km²'}</div>
              <div style="color: #64748b;">Superficie</div>
            </div>
          </div>
          
          ${hasEnrichment ? '<div style="background: #10b981; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; margin-bottom: 20px;">✓ Données enrichies</div>' : ''}
          
          <div style="margin: 20px 0;">
            📅 ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          
          <div style="margin-top: 30px; padding: 15px 30px; background: rgba(255,255,255,0.9); border-radius: 15px; display: inline-block;">
            <strong>Centre of Urban Systems - UM6P</strong><br>
            <span style="color: #fbbf24;">AfricanCities IA Services</span>
          </div>
        </div>

        <!-- SECTION WIKIPEDIA (si disponible) -->
        ${enrichmentData?.wikipedia?.found ? `
          <div style="background: white; border-radius: 16px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin: 30px 0;">
            <h2 style="font-size: 1.8rem; color: #1e3a5f; margin-bottom: 20px;">📖 À propos de ${data.city}</h2>
            <p style="font-size: 1.1rem; line-height: 1.6;">${enrichmentData.wikipedia.summary}</p>
            ${enrichmentData.wikipedia.demographics?.population ? `
              <p style="margin-top: 15px;"><strong>Population:</strong> ${enrichmentData.wikipedia.demographics.population.toLocaleString('fr-FR')} habitants</p>
            ` : ''}
            ${enrichmentData.wikipedia.geography?.area_km2 ? `
              <p><strong>Superficie:</strong> ${enrichmentData.wikipedia.geography.area_km2} km²</p>
            ` : ''}
            <a href="${enrichmentData.wikipedia.url}" target="_blank" style="color: #1e3a5f; text-decoration: underline; margin-top: 15px; display: inline-block;">En savoir plus sur Wikipedia →</a>
          </div>
        ` : ''}

        <!-- SECTION WORLD BANK (si disponible) -->
        ${enrichmentData?.world_bank?.indicators ? `
          <div style="background: white; border-radius: 16px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin: 30px 0;">
            <h2 style="font-size: 1.8rem; color: #1e3a5f; margin-bottom: 20px;">🏦 Indicateurs Banque Mondiale</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
              ${Object.entries(enrichmentData.world_bank.indicators || {}).map(([key, value]: any) => `
                <div style="background: #f8fafc; padding: 15px; border-radius: 8px;">
                  <div style="font-weight: bold; color: #1e3a5f;">${value.indicator_name || key}</div>
                  <div style="font-size: 1.8rem;">${value.recent?.value?.toLocaleString('fr-FR') || 'N/A'}</div>
                  <div style="color: #64748b;">${value.recent?.date || ''}</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- RÉSUMÉ EXÉCUTIF -->
        <h2 style="font-size: 2rem; color: #1e3a5f; border-left: 6px solid #fbbf24; padding-left: 1.5rem; margin: 2rem 0;">RÉSUMÉ EXÉCUTIF</h2>
        
        <div style="background: white; border-radius: 16px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin: 20px 0;">
          <p style="font-size: 1.1rem; line-height: 1.8;">
            Le diagnostic urbain complet de <strong>${data.city}</strong> a été réalisé sur la base de <strong>plus de 80 indicateurs</strong> répartis en 7 dimensions clés du développement urbain durable. Cette analyse a été enrichie par <strong>${documents.length} documents</strong>.
          </p>
          
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 20px 0;">
            <div style="background: white; border-radius: 8px; padding: 15px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
              <div style="font-size: 1.8rem; font-weight: 700; color: #1e3a5f;">${calculateDimensionScore(data, 'society')}</div>
              <div style="color: #64748b;">Société</div>
            </div>
            <div style="background: white; border-radius: 8px; padding: 15px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
              <div style="font-size: 1.8rem; font-weight: 700; color: #1e3a5f;">${calculateDimensionScore(data, 'habitat')}</div>
              <div style="color: #64748b;">Habitat</div>
            </div>
            <div style="background: white; border-radius: 8px; padding: 15px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
              <div style="font-size: 1.8rem; font-weight: 700; color: #1e3a5f;">${calculateDimensionScore(data, 'spatial')}</div>
              <div style="color: #64748b;">Spatial</div>
            </div>
            <div style="background: white; border-radius: 8px; padding: 15px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
              <div style="font-size: 1.8rem; font-weight: 700; color: #1e3a5f;">${calculateDimensionScore(data, 'infrastructure')}</div>
              <div style="color: #64748b;">Infrastructure</div>
            </div>
            <div style="background: white; border-radius: 8px; padding: 15px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
              <div style="font-size: 1.8rem; font-weight: 700; color: #1e3a5f;">${calculateDimensionScore(data, 'environment')}</div>
              <div style="color: #64748b;">Environnement</div>
            </div>
            <div style="background: white; border-radius: 8px; padding: 15px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
              <div style="font-size: 1.8rem; font-weight: 700; color: #1e3a5f;">${calculateDimensionScore(data, 'governance')}</div>
              <div style="color: #64748b;">Gouvernance</div>
            </div>
            <div style="background: white; border-radius: 8px; padding: 15px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
              <div style="font-size: 1.8rem; font-weight: 700; color: #1e3a5f;">${calculateDimensionScore(data, 'economy')}</div>
              <div style="color: #64748b;">Économie</div>
            </div>
          </div>
        </div>

        <div style="page-break-after: always; margin: 40px 0;"></div>

        <!-- ANALYSE PAR DIMENSION - TOUS LES 80+ INDICATEURS -->
        <h2 style="font-size: 2rem; color: #1e3a5f; border-left: 6px solid #fbbf24; padding-left: 1.5rem; margin: 2rem 0;">ANALYSE PAR DIMENSION</h2>

        <!-- SOCIÉTÉ - 20 indicateurs -->
        <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); margin: 30px 0;">
          <div style="padding: 20px; background: linear-gradient(135deg, #2563eb, #1e40af); color: white;">
            <h3 style="color: white; margin: 0; font-size: 1.4rem;">👥 SOCIÉTÉ (20 indicateurs)</h3>
          </div>
          <div style="padding: 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 10px;">
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Scolarisation primaire</span>
              <span style="font-weight: 600;">${formatPercent(data.primary_school_enrollment)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Scolarisation secondaire</span>
              <span style="font-weight: 600;">${formatPercent(data.secondary_school_enrollment)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Scolarisation supérieure</span>
              <span style="font-weight: 600;">${formatPercent(data.tertiary_enrollment)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Alphabétisation adultes</span>
              <span style="font-weight: 600;">${formatPercent(data.adult_literacy_rate)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Alphabétisation jeunes</span>
              <span style="font-weight: 600;">${formatPercent(data.youth_literacy_rate)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Indice parité des genres</span>
              <span style="font-weight: 600;">${formatValue(data.gender_parity_index)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Taux de criminalité</span>
              <span style="font-weight: 600;">${formatValue(data.crime_rate)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Perception sécurité</span>
              <span style="font-weight: 600;">${formatPercent(data.safety_perception)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Accès aux soins</span>
              <span style="font-weight: 600;">${formatPercent(data.healthcare_access)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Médecins pour 10k hab.</span>
              <span style="font-weight: 600;">${formatValue(data.doctors_per_10000)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Lits d'hôpital pour 10k</span>
              <span style="font-weight: 600;">${formatValue(data.hospital_beds_per_10000)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Espérance de vie</span>
              <span style="font-weight: 600;">${data.life_expectancy ? data.life_expectancy + ' ans' : 'Non spécifié'}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Mortalité infantile</span>
              <span style="font-weight: 600;">${formatValue(data.infant_mortality)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Mortalité maternelle</span>
              <span style="font-weight: 600;">${formatValue(data.maternal_mortality)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Taux vaccination</span>
              <span style="font-weight: 600;">${formatPercent(data.vaccination_rate)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Malnutrition infantile</span>
              <span style="font-weight: 600;">${formatPercent(data.malnutrition_rate)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Taux pauvreté urbaine</span>
              <span style="font-weight: 600;">${formatPercent(data.urban_poverty_rate)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Indice inclusion sociale</span>
              <span style="font-weight: 600;">${formatPercent(data.social_inclusion_index)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Participation communautaire</span>
              <span style="font-weight: 600;">${formatPercent(data.community_participation_rate)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Protection sociale</span>
              <span style="font-weight: 600;">${formatPercent(data.social_protection_coverage)}</span>
            </div>
          </div>
        </div>

        <!-- HABITAT - 14 indicateurs -->
        <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); margin: 30px 0;">
          <div style="padding: 20px; background: linear-gradient(135deg, #059669, #047857); color: white;">
            <h3 style="color: white; margin: 0; font-size: 1.4rem;">🏠 HABITAT (14 indicateurs)</h3>
          </div>
          <div style="padding: 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 10px;">
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Accès eau potable</span>
              <span style="font-weight: 600;">${formatPercent(data.water_access)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Qualité de l'eau</span>
              <span style="font-weight: 600;">${formatPercent(data.water_quality)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Accès électricité</span>
              <span style="font-weight: 600;">${formatPercent(data.electricity_access)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Combustibles propres</span>
              <span style="font-weight: 600;">${formatPercent(data.clean_cooking_fuels)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Surpeuplement</span>
              <span style="font-weight: 600;">${formatValue(data.housing_overcrowding)} pers/pièce</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Habitat informel</span>
              <span style="font-weight: 600;">${formatPercent(data.informal_housing_percentage)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Coût logement (USD/m²)</span>
              <span style="font-weight: 600;">${formatCurrency(data.housing_cost_per_m2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Accès propriété</span>
              <span style="font-weight: 600;">${formatPercent(data.home_ownership_rate)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Assainissement amélioré</span>
              <span style="font-weight: 600;">${formatPercent(data.sanitation_access)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Traitement eaux usées</span>
              <span style="font-weight: 600;">${formatPercent(data.wastewater_treatment)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Taux sans-abrisme</span>
              <span style="font-weight: 600;">${formatPercent(data.homelessness_rate)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Satisfaction logement</span>
              <span style="font-weight: 600;">${formatPercent(data.housing_satisfaction_rate)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Abordabilité logement</span>
              <span style="font-weight: 600;">${formatValue(data.housing_affordability_index)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Population en bidonville</span>
              <span style="font-weight: 600;">${formatPercent(data.slum_population_percentage)}</span>
            </div>
          </div>
        </div>

        <!-- SPATIAL - 11 indicateurs -->
        <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); margin: 30px 0;">
          <div style="padding: 20px; background: linear-gradient(135deg, #8b5cf6, #6d28d9); color: white;">
            <h3 style="color: white; margin: 0; font-size: 1.4rem;">🗺️ DÉVELOPPEMENT SPATIAL (11 indicateurs)</h3>
          </div>
          <div style="padding: 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 10px;">
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Densité urbaine</span>
              <span style="font-weight: 600;">${formatValue(data.urban_density)} hab/km²</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Espaces verts</span>
              <span style="font-weight: 600;">${formatValue(data.green_space_per_capita)} m²/hab</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Accès transport public</span>
              <span style="font-weight: 600;">${formatPercent(data.public_transport_access)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Distance domicile-travail</span>
              <span style="font-weight: 600;">${formatValue(data.home_work_distance)} km</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Taux d'urbanisation</span>
              <span style="font-weight: 600;">${formatPercent(data.urbanization_rate)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Quartiers planifiés</span>
              <span style="font-weight: 600;">${formatPercent(data.planned_vs_informal_ratio)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Indice mixité fonctionnelle</span>
              <span style="font-weight: 600;">${formatPercent(data.functional_mix_index)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Accès équipements sportifs/culturels</span>
              <span style="font-weight: 600;">${formatPercent(data.sports_cultural_access)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Score de marchabilité</span>
              <span style="font-weight: 600;">${formatValue(data.walkability_score)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Densité pistes cyclables</span>
              <span style="font-weight: 600;">${formatValue(data.bike_lane_density)} km/km²</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Accès espaces publics</span>
              <span style="font-weight: 600;">${formatPercent(data.public_space_access)}</span>
            </div>
          </div>
        </div>

        <!-- INFRASTRUCTURE - 13 indicateurs -->
        <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); margin: 30px 0;">
          <div style="padding: 20px; background: linear-gradient(135deg, #f59e0b, #b45309); color: white;">
            <h3 style="color: white; margin: 0; font-size: 1.4rem;">⚡ INFRASTRUCTURES (13 indicateurs)</h3>
          </div>
          <div style="padding: 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 10px;">
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Qualité des routes</span>
              <span style="font-weight: 600;">${formatPercent(data.road_quality_percentage)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Longueur routes par habitant</span>
              <span style="font-weight: 600;">${formatValue(data.road_length_per_capita)} km/1000 hab.</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Accès Internet</span>
              <span style="font-weight: 600;">${formatPercent(data.internet_access)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Vitesse Internet moyenne</span>
              <span style="font-weight: 600;">${formatValue(data.broadband_speed)} Mbps</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Taux pénétration mobile</span>
              <span style="font-weight: 600;">${formatPercent(data.mobile_penetration)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Fiabilité eau</span>
              <span style="font-weight: 600;">${data.water_reliability || 'Non spécifié'} h/sem</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Fiabilité électricité</span>
              <span style="font-weight: 600;">${data.electricity_reliability || 'Non spécifié'} h/sem</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Capacité transport public</span>
              <span style="font-weight: 600;">${formatValue(data.public_transport_capacity)} places/km/jour</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Taux motorisation</span>
              <span style="font-weight: 600;">${formatValue(data.motorization_rate)} véh/1000 hab.</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Accessibilité PMR</span>
              <span style="font-weight: 600;">${formatPercent(data.accessibility_pmr)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Couverture drainage</span>
              <span style="font-weight: 600;">${formatPercent(data.drainage_coverage)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Éclairage public</span>
              <span style="font-weight: 600;">${formatPercent(data.street_lighting_coverage)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Indice services numériques</span>
              <span style="font-weight: 600;">${formatValue(data.digital_services_index)}</span>
            </div>
          </div>
        </div>

        <!-- ENVIRONNEMENT - 14 indicateurs -->
        <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); margin: 30px 0;">
          <div style="padding: 20px; background: linear-gradient(135deg, #10b981, #047857); color: white;">
            <h3 style="color: white; margin: 0; font-size: 1.4rem;">🌳 ENVIRONNEMENT (14 indicateurs)</h3>
          </div>
          <div style="padding: 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 10px;">
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Qualité de l'air (PM2.5)</span>
              <span style="font-weight: 600;">${data.air_quality_pm25 || 'N/A'}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Qualité de l'air (PM10)</span>
              <span style="font-weight: 600;">${data.air_quality_pm10 || 'N/A'}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Collecte des déchets</span>
              <span style="font-weight: 600;">${formatPercent(data.waste_collection_rate)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Taux de recyclage</span>
              <span style="font-weight: 600;">${formatPercent(data.waste_recycling_rate)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Valorisation énergétique</span>
              <span style="font-weight: 600;">${formatPercent(data.waste_to_energy_rate)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Couverture assainissement</span>
              <span style="font-weight: 600;">${formatPercent(data.sanitation_coverage)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Indice vulnérabilité climatique</span>
              <span style="font-weight: 600;">${formatValue(data.climate_vulnerability_index)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Jours de canicule/an</span>
              <span style="font-weight: 600;">${formatValue(data.heatwave_days_per_year)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Zones inondables</span>
              <span style="font-weight: 600;">${formatPercent(data.flood_risk_areas)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Énergies renouvelables</span>
              <span style="font-weight: 600;">${formatPercent(data.renewable_energy_share)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Déforestation urbaine</span>
              <span style="font-weight: 600;">${formatPercent(data.urban_deforestation_rate)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Plan d'adaptation climatique</span>
              <span style="font-weight: 600;">${formatYesNo(data.climate_adaptation_plan)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Indice biodiversité</span>
              <span style="font-weight: 600;">${formatValue(data.biodiversity_index)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Empreinte carbone</span>
              <span style="font-weight: 600;">${formatValue(data.carbon_footprint_per_capita)} tCO2/hab</span>
            </div>
          </div>
        </div>

        <!-- GOUVERNANCE - 12 indicateurs -->
        <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); margin: 30px 0;">
          <div style="padding: 20px; background: linear-gradient(135deg, #6366f1, #4f46e5); color: white;">
            <h3 style="color: white; margin: 0; font-size: 1.4rem;">⚖️ GOUVERNANCE (12 indicateurs)</h3>
          </div>
          <div style="padding: 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 10px;">
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Indice corruption</span>
              <span style="font-weight: 600;">${formatValue(data.corruption_index)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Participation électorale</span>
              <span style="font-weight: 600;">${formatPercent(data.voter_turnout)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Femmes au conseil</span>
              <span style="font-weight: 600;">${formatPercent(data.women_in_council)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Jeunes au conseil</span>
              <span style="font-weight: 600;">${formatPercent(data.youth_in_council)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Conseil municipal élu</span>
              <span style="font-weight: 600;">${formatYesNo(data.elected_council_exists)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Satisfaction services publics</span>
              <span style="font-weight: 600;">${formatPercent(data.public_service_satisfaction)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Accès données ouvertes</span>
              <span style="font-weight: 600;">${formatPercent(data.open_data_access)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Indice stabilité politique</span>
              <span style="font-weight: 600;">${formatValue(data.political_stability_index)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Initiatives citoyennes</span>
              <span style="font-weight: 600;">${formatValue(data.citizen_initiatives_supported)}/an</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Transparence budgétaire</span>
              <span style="font-weight: 600;">${formatPercent(data.budget_transparency)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Budget participatif</span>
              <span style="font-weight: 600;">${formatYesNo(data.participatory_budgeting)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Indice gouvernance numérique</span>
              <span style="font-weight: 600;">${formatValue(data.digital_governance_index)}</span>
            </div>
          </div>
        </div>

        <!-- ÉCONOMIE - 15 indicateurs -->
        <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); margin: 30px 0;">
          <div style="padding: 20px; background: linear-gradient(135deg, #ec4899, #db2777); color: white;">
            <h3 style="color: white; margin: 0; font-size: 1.4rem;">📈 ÉCONOMIE (15 indicateurs)</h3>
          </div>
          <div style="padding: 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 10px;">
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Taux chômage urbain</span>
              <span style="font-weight: 600;">${formatPercent(data.unemployment_rate)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Chômage jeunes</span>
              <span style="font-weight: 600;">${formatPercent(data.youth_unemployment)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Participation féminine</span>
              <span style="font-weight: 600;">${formatPercent(data.female_labor_participation)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Emploi formel</span>
              <span style="font-weight: 600;">${formatPercent(data.formal_employment_rate)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>PIB par habitant</span>
              <span style="font-weight: 600;">${formatCurrency(data.gdp_per_capita)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Croissance PIB</span>
              <span style="font-weight: 600;">${formatPercent(data.gdp_growth_rate)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Attractivité FDI</span>
              <span style="font-weight: 600;">${formatValue(data.fdi_attractiveness)} projets</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Création d'entreprises</span>
              <span style="font-weight: 600;">${formatValue(data.business_creation_rate)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Revenu moyen</span>
              <span style="font-weight: 600;">${formatCurrency(data.income_per_capita)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Accès microcrédit</span>
              <span style="font-weight: 600;">${formatPercent(data.microcredit_access_rate)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Indice coût de la vie</span>
              <span style="font-weight: 600;">${formatValue(data.cost_of_living_index)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Taux pauvreté monétaire</span>
              <span style="font-weight: 600;">${formatPercent(data.monetary_poverty_rate)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Économie verte/digitale</span>
              <span style="font-weight: 600;">${formatPercent(data.green_digital_economy_share)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Économie informelle</span>
              <span style="font-weight: 600;">${formatPercent(data.informal_economy_share)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 4px;">
              <span>Revenus touristiques</span>
              <span style="font-weight: 600;">${formatCurrency(data.tourism_revenue)} millions</span>
            </div>
          </div>
        </div>

        <!-- SECTION SDG (Objectifs de Développement Durable) -->
        ${enableSDG && enrichmentData?.sdg_mapping ? `
          <div style="margin-top: 40px;">
            <h2 style="font-size: 2rem; color: #1e3a5f; border-left: 6px solid #fbbf24; padding-left: 1.5rem; margin: 2rem 0;">OBJECTIFS DE DÉVELOPPEMENT DURABLE</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px;">
              ${Object.entries(enrichmentData.sdg_mapping)
                .filter(([_, d]: any) => d.indicators?.length > 0)
                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                .map(([goal, data]: any) => {
                  // Couleurs officielles des ODD
                  const colors = [
                    '#e5243b', '#DDA63A', '#4C9F38', '#C5192D', '#FF3A21', '#26BDE2',
                    '#FCC30B', '#A21942', '#FD6925', '#DD1367', '#FD9D24', '#BF8B2E',
                    '#3F7E44', '#0A97D9', '#56C02B', '#00689D', '#19486A'
                  ];
                  const color = colors[parseInt(goal) - 1] || '#1e3a5f';
                  
                  return `
                    <div style="background: white; border-radius: 8px; padding: 15px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border-top: 4px solid ${color};">
                      <div style="font-weight: 700; color: #1e3a5f;">ODD ${goal}</div>
                      <div style="font-size: 2rem; color: ${color};">${data.score}%</div>
                      <div style="font-size: 0.9rem; color: #64748b; margin-top: 5px;">${data.indicators.length} indicateur(s)</div>
                    </div>
                  `;
                }).join('')}
            </div>
          </div>
        ` : enableSDG ? `
          <div style="margin-top: 40px; text-align: center; padding: 30px; background: #f8fafc; border-radius: 16px;">
            <h2 style="font-size: 2rem; color: #1e3a5f; margin-bottom: 15px;">🎯 OBJECTIFS DE DÉVELOPPEMENT DURABLE</h2>
            <p>Aucune donnée SDG disponible pour cette ville.</p>
          </div>
        ` : ''}

        <!-- DOCUMENTS ANALYSÉS -->
        ${documents.length > 0 ? `
          <h2 style="font-size: 2rem; color: #1e3a5f; border-left: 6px solid #fbbf24; padding-left: 1.5rem; margin: 2rem 0;">DOCUMENTS ANALYSÉS</h2>
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
          <p style="font-size: 1.3rem; margin-bottom: 20px;"><strong>Rapport généré par AfricanCities IA Services</strong></p>
          <p>Centre of Urban Systems - UM6P</p>
          <p style="margin-top: 20px;">80+ indicateurs · 7 dimensions · 17 SDG · ${documents.length} documents analysés</p>
          <p style="opacity: 0.7; margin-top: 20px;">© ${currentYear} - Tous droits réservés</p>
        </div>
      </div>
    `;
  };

  // Fallback : générer le rapport mock en cas d'erreur
  const generateMockReport = (data: FormData, documents: DocumentContent[]): string => {
    const docCount: DocumentCount = {
      pdf: documents.filter(d => d.type === 'pdf').length,
      image: documents.filter(d => d.type === 'image').length,
      excel: documents.filter(d => d.type === 'excel').length,
      geojson: documents.filter(d => d.type === 'geojson').length,
      manual: documents.filter(d => d.type === 'manual').length,
      total: documents.length
    };

    const currentYear = new Date().getFullYear();

    return `
      <div class="report-container" style="font-family: system-ui, -apple-system, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; padding: 40px; background: #f8fafc; border-radius: 16px;">
          <h1 style="color: #1e3a5f;">Rapport pour ${data.city || 'Ville'}</h1>
          <p>Généré le ${new Date().toLocaleDateString('fr-FR')}</p>
          <p>${docCount.total} documents analysés</p>
          <p style="color: #ef4444;">Mode dégradé - API d'enrichissement indisponible</p>
        </div>
      </div>
    `;
  };

  return {
    isGenerating,
    generatedContent,
    reportData,
    setGeneratedContent,
    generateReportContent
  };
}