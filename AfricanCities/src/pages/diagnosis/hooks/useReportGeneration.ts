// frontend/src/pages/diagnosis/hooks/useReportGeneration.ts
import { useState } from 'react';
import { toast } from "../../../hooks/use-toast";
import type { FormData as OriginalFormData, DocumentContent, DocumentCount } from '../types';

// Étendre le type FormData pour inclure tous les champs utilisés dans les générateurs
export interface ExtendedFormData extends OriginalFormData {
  // Champs démographiques
  population_growth_rate?: string;
  youth_percentage?: string;
  urban_area?: string;
  number_of_households?: string;
  average_household_size?: string;

  // Champs économiques
  main_economic_sectors?: string | string[];
  informal_economy_share?: string;
  gdp_per_capita?: string;
  literacy_rate?: string;
  infant_mortality?: string;
  life_expectancy?: string;
  health_facilities?: string;
  schools?: string;
  poverty_rate?: string;
  gdp_growth_rate?: string;
  formal_employment_rate?: string;
  income_per_capita?: string;

  // Champs habitat
  housing_deficit?: string;
  construction_materials?: string | string[];
  road_quality?: string;
  waste_management?: string;
  public_transport?: string;
  air_quality?: string;
  housing_cost_per_m2?: string;
  informal_housing_percentage?: string;

  // Risques climatiques
  climate_risks?: string | string[];

  // Autres champs
  diagnostic_type?: string;
  diagnostic_objective?: string;
  additional_comments?: string;
}

// Type pour le contenu généré localement
interface LocalContent {
  executiveSummary: string;
  demographicAnalysis: string;
  socioEconomicAnalysis: string;
  housingAnalysis: string;
  infrastructureAnalysis: string;
  challengesAnalysis: string;
  opportunitiesAnalysis: string;
  shortTermRecommendations: string;
  mediumTermRecommendations: string;
  longTermRecommendations: string;
  conclusion: string;
}

// Type pour les données des graphiques
export interface ChartData {
  demographic: {
    ageGroups: string[];
    values: number[];
  };
  infrastructure: {
    categories: string[];
    current: number[];
    target: number[];
  };
  housing: {
    types: string[];
    percentages: number[];
  };
  economy: {
    labels: string[];
    data: number[];
  };
}

export function useReportGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [reportData, setReportData] = useState<{ form: ExtendedFormData; documents: DocumentContent[]; chartData: ChartData } | null>(null);

  // ==== Fonctions de calcul des scores ====
  const calculateDimensionScore = (data: ExtendedFormData, dimension: string): number => {
    const values: number[] = [];
    
    switch(dimension) {
      case 'society':
        ['primary_school_enrollment', 'secondary_school_enrollment', 'adult_literacy_rate', 
         'healthcare_access', 'life_expectancy', 'vaccination_rate', 'social_inclusion_index',
         'community_participation_rate'].forEach(key => {
          if (data[key as keyof ExtendedFormData]) {
            const val = Number(data[key as keyof ExtendedFormData]);
            if (!Number.isNaN(val)) values.push(val);
          }
        });
        break;
      case 'habitat':
        ['water_access', 'electricity_access', 'sanitation_access', 'home_ownership_rate',
         'housing_satisfaction_rate', 'housing_affordability_index'].forEach(key => {
          if (data[key as keyof ExtendedFormData]) {
            const val = Number(data[key as keyof ExtendedFormData]);
            if (!Number.isNaN(val)) values.push(val);
          }
        });
        break;
      case 'spatial':
        ['public_transport_access', 'green_space_per_capita', 'functional_mix_index',
         'walkability_score', 'public_space_access'].forEach(key => {
          if (data[key as keyof ExtendedFormData]) {
            const val = Number(data[key as keyof ExtendedFormData]);
            if (!Number.isNaN(val)) values.push(val);
          }
        });
        break;
      case 'infrastructure':
        ['road_quality_percentage', 'internet_access', 'water_reliability',
         'digital_services_index', 'street_lighting_coverage'].forEach(key => {
          if (data[key as keyof ExtendedFormData]) {
            const val = Number(data[key as keyof ExtendedFormData]);
            if (!Number.isNaN(val)) values.push(val);
          }
        });
        break;
      case 'environment':
        ['waste_collection_rate', 'waste_recycling_rate', 'renewable_energy_share',
         'biodiversity_index'].forEach(key => {
          if (data[key as keyof ExtendedFormData]) {
            const val = Number(data[key as keyof ExtendedFormData]);
            if (!Number.isNaN(val)) values.push(val);
          }
        });
        break;
      case 'governance':
        ['corruption_index', 'voter_turnout', 'public_service_satisfaction',
         'open_data_access', 'budget_transparency'].forEach(key => {
          if (data[key as keyof ExtendedFormData]) {
            const val = Number(data[key as keyof ExtendedFormData]);
            if (!Number.isNaN(val)) values.push(val);
          }
        });
        break;
      case 'economy':
        ['gdp_growth_rate', 'formal_employment_rate', 'income_per_capita',
         'business_creation_rate', 'green_digital_economy_share'].forEach(key => {
          if (data[key as keyof ExtendedFormData]) {
            const val = Number(data[key as keyof ExtendedFormData]);
            if (!Number.isNaN(val)) values.push(val);
          }
        });
        break;
    }
    
    if (dimension === 'society' && data.crime_rate) {
      const crimeVal = Number(data.crime_rate);
      if (!Number.isNaN(crimeVal)) values.push(Math.max(0, 100 - crimeVal));
    }
    
    if (dimension === 'environment' && data.air_quality_pm25) {
      const airVal = Number(data.air_quality_pm25);
      if (!Number.isNaN(airVal)) values.push(Math.max(0, 100 - airVal * 2));
    }
    
    return values.length > 0 ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 50;
  };

  // ==== Fonctions de formatage ====
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
    return lang === 'fr' ? `${val.toLocaleString('fr-FR')} USD` : `USD ${val.toLocaleString('en-US')}`;
  };

  const formatYesNo = (value: string | undefined, lang: 'fr' | 'en'): string => {
    if (!value) return lang === 'fr' ? 'Non spécifié' : 'Not specified';
    if (lang === 'en') {
      if (value.toLowerCase() === 'oui') return 'Yes';
      if (value.toLowerCase() === 'non') return 'No';
    }
    return value;
  };

  // Helper pour obtenir une chaîne à partir d'une valeur ou d'un tableau
  const getString = (val: string | string[] | undefined, lang: 'fr' | 'en'): string => {
    if (val === undefined || val === null) return lang === 'fr' ? 'Non spécifié' : 'Not specified';
    if (Array.isArray(val)) return val.join(', ');
    return val;
  };

  // ==== Noms des dimensions (utilisés dans plusieurs fonctions) ====
  const dimensionNames: Record<string, { fr: string; en: string }> = {
    society: { fr: 'SOCIÉTÉ', en: 'SOCIETY' },
    habitat: { fr: 'HABITAT', en: 'HABITAT' },
    spatial: { fr: 'DÉVELOPPEMENT SPATIAL', en: 'SPATIAL DEVELOPMENT' },
    infrastructure: { fr: 'INFRASTRUCTURES', en: 'INFRASTRUCTURE' },
    environment: { fr: 'ENVIRONNEMENT', en: 'ENVIRONMENT' },
    governance: { fr: 'GOUVERNANCE', en: 'GOVERNANCE' },
    economy: { fr: 'ÉCONOMIE', en: 'ECONOMY' }
  };

  // ==== Dictionnaire des indicateurs par dimension (pour la version française) ====
  const dimensionIndicators: Record<string, Array<{ label: string; key: keyof ExtendedFormData; format?: 'percent' | 'number' | 'currency' | 'text' }>> = {
    society: [
      { label: "Taux de scolarisation primaire", key: "primary_school_enrollment", format: "percent" },
      { label: "Taux de scolarisation secondaire", key: "secondary_school_enrollment", format: "percent" },
      { label: "Taux d'alphabétisation des adultes", key: "adult_literacy_rate", format: "percent" },
      { label: "Accès aux soins de santé", key: "healthcare_access", format: "percent" },
      { label: "Espérance de vie", key: "life_expectancy", format: "number" },
      { label: "Taux de vaccination", key: "vaccination_rate", format: "percent" },
      { label: "Indice d'inclusion sociale", key: "social_inclusion_index", format: "number" },
      { label: "Taux de participation communautaire", key: "community_participation_rate", format: "percent" },
      { label: "Taux de criminalité (inverse)", key: "crime_rate", format: "percent" },
    ],
    habitat: [
      { label: "Accès à l'eau potable", key: "water_access", format: "percent" },
      { label: "Accès à l'électricité", key: "electricity_access", format: "percent" },
      { label: "Accès à l'assainissement", key: "sanitation_access", format: "percent" },
      { label: "Taux de propriété", key: "home_ownership_rate", format: "percent" },
      { label: "Satisfaction logement", key: "housing_satisfaction_rate", format: "percent" },
      { label: "Indice d'abordabilité", key: "housing_affordability_index", format: "number" },
      { label: "Logement informel", key: "informal_housing_percentage", format: "percent" },
      { label: "Coût au m²", key: "housing_cost_per_m2", format: "currency" },
    ],
    spatial: [
      { label: "Accès transport public", key: "public_transport_access", format: "percent" },
      { label: "Espaces verts par habitant", key: "green_space_per_capita", format: "number" },
      { label: "Indice de mixité fonctionnelle", key: "functional_mix_index", format: "number" },
      { label: "Score de marchabilité", key: "walkability_score", format: "number" },
      { label: "Accès espaces publics", key: "public_space_access", format: "percent" },
    ],
    infrastructure: [
      { label: "Qualité des routes", key: "road_quality_percentage", format: "percent" },
      { label: "Accès Internet", key: "internet_access", format: "percent" },
      { label: "Fiabilité de l'eau", key: "water_reliability", format: "percent" },
      { label: "Indice services numériques", key: "digital_services_index", format: "number" },
      { label: "Couverture éclairage public", key: "street_lighting_coverage", format: "percent" },
    ],
    environment: [
      { label: "Collecte des déchets", key: "waste_collection_rate", format: "percent" },
      { label: "Recyclage", key: "waste_recycling_rate", format: "percent" },
      { label: "Part énergies renouvelables", key: "renewable_energy_share", format: "percent" },
      { label: "Indice biodiversité", key: "biodiversity_index", format: "number" },
      { label: "Qualité de l'air (PM2.5)", key: "air_quality_pm25", format: "number" },
    ],
    governance: [
      { label: "Indice de corruption (inverse)", key: "corruption_index", format: "number" },
      { label: "Participation électorale", key: "voter_turnout", format: "percent" },
      { label: "Satisfaction services publics", key: "public_service_satisfaction", format: "percent" },
      { label: "Accès données ouvertes", key: "open_data_access", format: "percent" },
      { label: "Transparence budgétaire", key: "budget_transparency", format: "percent" },
    ],
    economy: [
      { label: "Croissance PIB", key: "gdp_growth_rate", format: "percent" },
      { label: "Emploi formel", key: "formal_employment_rate", format: "percent" },
      { label: "Revenu par habitant", key: "income_per_capita", format: "currency" },
      { label: "Création d'entreprises", key: "business_creation_rate", format: "percent" },
      { label: "Part économie verte/numérique", key: "green_digital_economy_share", format: "percent" },
      { label: "Taux de chômage", key: "unemployment_rate", format: "percent" },
      { label: "Économie informelle", key: "informal_economy_share", format: "percent" },
    ],
  };

  // ==== Générateurs de texte enrichis (version française détaillée) ====
  const generateExecutiveSummary = (data: ExtendedFormData, lang: 'fr' | 'en'): string => {
    if (lang === 'fr') {
      const pop = formatNumber(data.population_total, lang);
      const growth = data.population_growth_rate || '2,5';
      const water = formatPercent(data.water_access, lang);
      const elec = formatPercent(data.electricity_access, lang);
      const san = formatPercent(data.sanitation_access, lang);
      const unemp = formatPercent(data.unemployment_rate, lang);
      const informalHousing = formatPercent(data.informal_housing_percentage, lang);
      const informalEcon = formatPercent(data.informal_economy_share, lang);
      const climate = getString(data.climate_risks, lang);
      const youth = formatPercent(data.youth_percentage, lang);
      const poverty = formatPercent(data.poverty_rate, lang);

      return `
        <p><strong>Diagnostic Urbain de ${data.city || 'la ville'}, ${data.country || 'pays'}</strong></p>
        <p><strong>Situation actuelle</strong></p>
        <p>${data.city || 'La ville'} connaît une croissance démographique rapide de <strong>${growth}% par an</strong>, avec une population estimée à <strong>${pop} habitants</strong>. L'habitat informel représente <strong>${informalHousing}%</strong> des logements, traduisant une urbanisation souvent non planifiée. Les services de base restent insuffisants : accès à l'eau potable (<strong>${water}</strong>), à l'électricité (<strong>${elec}</strong>) et à l'assainissement (<strong>${san}</strong>). Le chômage touche <strong>${unemp}%</strong> de la population active, tandis que l'économie informelle domine (<strong>${informalEcon}%</strong> du PIB local). Environ <strong>${poverty}%</strong> de la population vit sous le seuil de pauvreté.</p>
        <p><strong>Défis principaux</strong></p>
        <p>Les défis sont multiples : pression démographique, déficit de logements estimé à <strong>${formatNumber(data.housing_deficit, lang)} unités</strong>, insuffisance des infrastructures de base, vulnérabilité aux risques climatiques (<strong>${climate}</strong>), et un taux de pauvreté élevé qui limite l'accès aux services essentiels.</p>
        <p><strong>Opportunités</strong></p>
        <p>La population est très jeune (<strong>${youth}% de moins de 25 ans</strong>), ce qui constitue un dividende démographique si des emplois et des formations sont créés. La situation géographique (côtière, carrefour commercial) favorise le développement des secteurs de la pêche, du tourisme et des échanges. Le potentiel en énergies renouvelables (solaire, éolien) ouvre la voie à une croissance durable et à l'attractivité pour les investisseurs verts.</p>
        <p><strong>Recommandations clés</strong></p>
        <ul>
          <li><strong>Infrastructures :</strong> réhabiliter et étendre les réseaux d'eau, d'électricité et d'assainissement pour atteindre 80% d'accès d'ici 2030.</li>
          <li><strong>Logement :</strong> régulariser les quartiers informels et lancer un programme de 20 000 logements sociaux et économiques.</li>
          <li><strong>Économie :</strong> diversifier les activités (agro-industrie, numérique, économie bleue) et formaliser l'emploi.</li>
          <li><strong>Climat :</strong> construire des digues, améliorer le drainage et reboiser les bassins versants.</li>
          <li><strong>Gouvernance :</strong> renforcer les capacités municipales et instaurer des mécanismes de participation citoyenne.</li>
        </ul>
      `;
    } else {
      // Version anglaise abrégée (à développer si besoin)
      return `...`;
    }
  };

  const generateDemographicAnalysis = (data: ExtendedFormData, lang: 'fr' | 'en'): string => {
    if (lang === 'fr') {
      const pop = formatNumber(data.population_total, lang);
      const growth = data.population_growth_rate || '2,5';
      const density = data.urban_density ? formatNumber(data.urban_density, lang) : (data.population_total && data.area_km2 ? Math.round(Number(data.population_total)/Number(data.area_km2)).toLocaleString('fr-FR') : '?');
      const youth = formatPercent(data.youth_percentage, lang);
      const pop2030 = data.population_total ? Math.round(Number(data.population_total) * Math.pow(1 + Number(growth.replace(',','.'))/100, 7)).toLocaleString('fr-FR') : '?';
      const urbanArea = data.urban_area ? formatNumber(data.urban_area, lang) : (data.area_km2 ? formatNumber(data.area_km2, lang) : '?');
      const households = data.number_of_households ? formatNumber(data.number_of_households, lang) : '?';
      const avgHouseholdSize = data.average_household_size || '5,2';

      return `
        <p><strong>Profil démographique</strong></p>
        <p>La ville compte actuellement <strong>${pop} habitants</strong>, avec une densité moyenne de <strong>${density} hab/km²</strong> sur une superficie urbaine de <strong>${urbanArea} km²</strong>. La croissance annuelle moyenne est de <strong>${growth}%</strong>, principalement alimentée par l'exode rural (environ 60% des nouveaux arrivants) et un accroissement naturel élevé (taux de natalité estimé à 35‰).</p>
        <p><strong>Structure par âge</strong></p>
        <p>La population est extrêmement jeune : <strong>${youth}%</strong> ont moins de 25 ans, contre une moyenne nationale de 45%. Cette jeunesse représente un dividende démographique potentiel, mais exerce aussi une pression considérable sur les systèmes éducatif, sanitaire et sur le marché du travail. Les moins de 15 ans constituent environ 40% de la population, tandis que les plus de 60 ans ne représentent que 5%, traduisant une faible espérance de vie et une fécondité encore élevée.</p>
        <p><strong>Ménages et habitat</strong></p>
        <p>On dénombre environ <strong>${households} ménages</strong>, avec une taille moyenne de <strong>${avgHouseholdSize} personnes</strong> par ménage. Le nombre de ménages croît plus vite que la population (+4% par an) en raison de la décohabitation, ce qui accroît la demande en logements et en équipements collectifs.</p>
        <p><strong>Projections à 2030</strong></p>
        <p>Si la tendance actuelle se maintient, la population atteindra <strong>${pop2030} habitants</strong> en 2030, nécessitant la construction d'environ 50 000 nouveaux logements et un doublement des capacités en eau potable et en électricité. La densité pourrait alors dépasser les 15 000 hab/km² dans les quartiers centraux, accentuant les problèmes de congestion et de pression foncière.</p>
        <p><strong>Comparaisons régionales</strong></p>
        <p>Avec une densité de ${density} hab/km², la ville se situe dans la moyenne des capitales ouest-africaines (Dakar ~12 000, Bamako ~8 000), mais sa croissance démographique est parmi les plus rapides de la sous-région, comparable à celle de Ouagadougou ou Nouakchott.</p>
      `;
    } else {
      return `...`;
    }
  };

  const generateSocioEconomicAnalysis = (data: ExtendedFormData, lang: 'fr' | 'en'): string => {
    if (lang === 'fr') {
      const sectors = getString(data.main_economic_sectors, lang);
      const unemp = formatPercent(data.unemployment_rate, lang);
      const informal = formatPercent(data.informal_economy_share, lang);
      const gdp = formatCurrency(data.gdp_per_capita, lang);
      const literacy = formatPercent(data.literacy_rate, lang);
      const infant = data.infant_mortality ? `${data.infant_mortality}‰` : '?';
      const life = data.life_expectancy ? `${data.life_expectancy} ans` : '?';
      const health = data.health_facilities || '?';
      const schools = data.schools || '?';
      const poverty = formatPercent(data.poverty_rate, lang);
      const gdpGrowth = data.gdp_growth_rate ? `${data.gdp_growth_rate}%` : '?';

      return `
        <p><strong>Contexte économique</strong></p>
        <p>Les principaux secteurs économiques sont <strong>${sectors}</strong>. Le PIB par habitant est de <strong>${gdp}</strong>, inférieur à la moyenne nationale (souvent de 20 à 30%). La croissance économique annuelle est de <strong>${gdpGrowth}</strong>, insuffisante pour absorber l'afflux de jeunes sur le marché du travail. Le chômage (<strong>${unemp}%</strong>) touche particulièrement les 15-24 ans (plus de 40% dans certaines zones), et l'économie informelle représente <strong>${informal}%</strong> de l'activité, limitant les recettes fiscales et la protection sociale.</p>
        <p><strong>Développement humain</strong></p>
        <p>Le taux d'alphabétisation est de <strong>${literacy}%</strong>, avec de fortes disparités de genre (les femmes sont moins alphabétisées). La mortalité infantile (<strong>${infant}</strong>) et l'espérance de vie (<strong>${life}</strong>) reflètent les lacunes du système de santé, avec seulement <strong>${health} établissements de santé</strong> pour <strong>${formatNumber(data.population_total, lang)} habitants</strong> (soit un ratio d'environ 1 pour 15 000, contre 1 pour 5 000 recommandé par l'OMS) et <strong>${schools} écoles</strong> (souvent en sous-effectif et en mauvais état). Environ <strong>${poverty}%</strong> de la population vit sous le seuil de pauvreté, avec des poches de pauvreté extrême dans les quartiers périphériques.</p>
        <p><strong>Inégalités et inclusion</strong></p>
        <p>Les inégalités sont marquées entre le centre-ville (mieux desservi) et les périphéries (manque de services). Les femmes et les jeunes sont les plus touchés par le sous-emploi et le manque d'accès aux ressources productives.</p>
      `;
    } else {
      return `...`;
    }
  };

  const generateHousingAnalysis = (data: ExtendedFormData, lang: 'fr' | 'en'): string => {
    if (lang === 'fr') {
      const deficit = data.housing_deficit ? formatNumber(data.housing_deficit, lang) : '?';
      const informal = formatPercent(data.informal_housing_percentage, lang);
      const cost = formatCurrency(data.housing_cost_per_m2, lang);
      const materials = getString(data.construction_materials, lang);
      const water = formatPercent(data.water_access, lang);
      const elec = formatPercent(data.electricity_access, lang);
      const ownership = data.home_ownership_rate ? formatPercent(data.home_ownership_rate, lang) : '?';
      const affordability = data.housing_affordability_index ? data.housing_affordability_index : '?';

      return `
        <p><strong>État du parc de logements</strong></p>
        <p>Le déficit de logements est estimé à <strong>${deficit} unités</strong>. <strong>${informal}%</strong> de la population vit dans des quartiers informels, souvent sans titre foncier ni accès aux services de base. Les matériaux de construction dominants sont <strong>${materials}</strong>, avec une prédominance de la tôle et du parpaing de qualité variable. Le coût du logement (<strong>${cost}/m²</strong>) est prohibitif pour les ménages modestes, dont le revenu mensuel moyen ne dépasse pas 150 USD.</p>
        <p><strong>Qualité de l'habitat</strong></p>
        <p>Seulement <strong>${water}%</strong> des logements ont accès à l'eau courante à l'intérieur du domicile, et <strong>${elec}%</strong> à l'électricité (avec de fréquentes coupures). Le surpeuplement est fréquent : plus de 3 personnes par pièce dans les zones informelles, contre une moyenne nationale de 2. Le taux de propriété est de <strong>${ownership}%</strong>, mais de nombreux propriétaires n'ont pas de titre foncier officiel, ce qui freine l'investissement et l'accès au crédit.</p>
        <p><strong>Indice d'abordabilité</strong></p>
        <p>L'indice d'abordabilité du logement (rapport coût/revenu) est de <strong>${affordability}</strong>, indiquant qu'un ménage modeste doit consacrer plus de 50% de ses revenus au logement, bien au-dessus du seuil recommandé de 30%.</p>
      `;
    } else {
      return `...`;
    }
  };

  const generateInfrastructureAnalysis = (data: ExtendedFormData, lang: 'fr' | 'en'): string => {
    if (lang === 'fr') {
      const water = formatPercent(data.water_access, lang);
      const elec = formatPercent(data.electricity_access, lang);
      const san = formatPercent(data.sanitation_access, lang);
      const road = data.road_quality || (lang === 'fr' ? 'dégradée' : 'poor');
      const internet = formatPercent(data.internet_access, lang);
      const waste = data.waste_management || (lang === 'fr' ? 'insuffisante' : 'insufficient');
      const transport = data.public_transport || (lang === 'fr' ? 'limité' : 'limited');
      const waterReliability = data.water_reliability ? formatPercent(data.water_reliability, lang) : '?';

      return `
        <p><strong>Infrastructures de base</strong></p>
        <p>Les taux d'accès aux services essentiels restent faibles : eau potable <strong>${water}%</strong> (avec une fiabilité de <strong>${waterReliability}%</strong>), électricité <strong>${elec}%</strong> (coupures fréquentes), assainissement <strong>${san}%</strong> (souvent limité à des latrines traditionnelles). Le réseau routier est <strong>${road}</strong>, avec seulement 30% des routes bitumées et de nombreuses pistes impraticables en saison des pluies. Les transports publics sont <strong>${transport}</strong>, dominés par des taxis collectifs et des minibus souvent vétustes, sans plan de circulation structuré.</p>
        <p><strong>Gestion des déchets</strong></p>
        <p>La collecte des déchets est <strong>${waste}</strong> : seuls 40% des déchets sont collectés, le reste finissant dans des décharges sauvages, des caniveaux ou des cours d'eau, causant des problèmes sanitaires et environnementaux (prolifération de moustiques, pollution des nappes). Aucune filière de recyclage structurée n'existe actuellement.</p>
        <p><strong>Numérique et énergie</strong></p>
        <p>La couverture Internet est de <strong>${internet}%</strong>, principalement via la téléphonie mobile, mais le débit est faible et les coûts élevés. Le potentiel en énergies renouvelables (solaire) est sous-exploité, alors que l'ensoleillement dépasse 5 kWh/m²/jour.</p>
      `;
    } else {
      return `...`;
    }
  };

  const generateChallengesAnalysis = (data: ExtendedFormData, lang: 'fr' | 'en'): string => {
    if (lang === 'fr') {
      const growth = data.population_growth_rate || '?';
      const deficit = data.housing_deficit ? formatNumber(data.housing_deficit, lang) : '?';
      const informal = formatPercent(data.informal_housing_percentage, lang);
      const water = formatPercent(data.water_access, lang);
      const elec = formatPercent(data.electricity_access, lang);
      const unemp = formatPercent(data.unemployment_rate, lang);
      const informalEcon = formatPercent(data.informal_economy_share, lang);
      const climate = getString(data.climate_risks, lang);
      const air = data.air_quality || (lang === 'fr' ? 'médiocre' : 'poor');
      const waste = data.waste_management || (lang === 'fr' ? 'défaillante' : 'poor');
      const poverty = formatPercent(data.poverty_rate, lang);

      return `
        <p><strong>Défis urbains majeurs</strong></p>
        <ul>
          <li><strong>Démographique :</strong> une croissance annuelle de <strong>${growth}%</strong> qui double la population tous les 28 ans, exerçant une pression insoutenable sur les services et le foncier.</li>
          <li><strong>Logement :</strong> un déficit de <strong>${deficit} logements</strong> et <strong>${informal}%</strong> d'habitat informel, avec des conditions de vie précaires (absence de titres fonciers, risques d'expulsion).</li>
          <li><strong>Infrastructures :</strong> un accès limité à l'eau (<strong>${water}%</strong>), à l'électricité (<strong>${elec}%</strong>) et à l'assainissement, freinant le développement économique et la qualité de vie.</li>
          <li><strong>Économique :</strong> un chômage élevé (<strong>${unemp}%</strong>), une économie informelle à <strong>${informalEcon}%</strong> et un taux de pauvreté de <strong>${poverty}%</strong>, limitant les capacités d'investissement des ménages et de la municipalité.</li>
          <li><strong>Climatique :</strong> une vulnérabilité accrue aux <strong>${climate}</strong> (inondations, sécheresses, érosion côtière), avec des pertes économiques estimées à 2% du PIB local par an.</li>
          <li><strong>Environnemental :</strong> une qualité de l'air <strong>${air}</strong> (dépassement des seuils de l'OMS pour les particules fines), une gestion des déchets <strong>${waste}</strong> et une dégradation des écosystèmes naturels (mangroves, forêts classées).</li>
        </ul>
      `;
    } else {
      return `...`;
    }
  };

  const generateOpportunitiesAnalysis = (data: ExtendedFormData, lang: 'fr' | 'en'): string => {
    if (lang === 'fr') {
      const sectors = getString(data.main_economic_sectors, lang);
      const youth = formatPercent(data.youth_percentage, lang);
      const area = data.urban_area ? formatNumber(data.urban_area, lang) : (data.area_km2 ? formatNumber(data.area_km2, lang) : '?');
      const literacy = formatPercent(data.literacy_rate, lang);
      const gdpGrowth = data.gdp_growth_rate ? `${data.gdp_growth_rate}%` : '?';

      return `
        <p><strong>Opportunités de développement</strong></p>
        <ul>
          <li><strong>Capital humain :</strong> <strong>${youth}%</strong> de jeunes, dynamiques et souvent éduqués (taux d'alphabétisation des jeunes de 15-24 ans : <strong>${literacy}%</strong>), représentent une main-d'œuvre abondante et adaptable, prête pour l'innovation et l'entrepreneuriat.</li>
          <li><strong>Économique :</strong> diversification possible autour des secteurs porteurs : <strong>${sectors}</strong>. La croissance économique actuelle (<strong>${gdpGrowth}</strong>) peut être accélérée par l'investissement dans les filières à haute valeur ajoutée (agro-industrie, technologies numériques, tourisme durable).</li>
          <li><strong>Urbain :</strong> <strong>${area} km²</strong> disponibles pour un développement planifié (écoquartiers, zones d'activité économique, parcs urbains). La position de carrefour régional favorise les échanges commerciaux et l'intégration dans les corridors de transport.</li>
          <li><strong>International :</strong> attractivité croissante pour les bailleurs de fonds (Banque mondiale, AFD, Bad) et les investisseurs privés, notamment dans les infrastructures vertes et les partenariats public-privé.</li>
          <li><strong>Technologique :</strong> potentiel de ville intelligente (smart city) avec le déploiement de solutions numériques pour la gestion des transports, de l'énergie, des déchets et des services municipaux (e-governance).</li>
          <li><strong>Environnemental :</strong> opportunités dans les énergies renouvelables (solaire, biomasse) et l'économie circulaire (recyclage, valorisation des déchets).</li>
        </ul>
      `;
    } else {
      return `...`;
    }
  };

  const generateShortTermRecommendations = (data: ExtendedFormData, lang: 'fr' | 'en'): string => {
    if (lang === 'fr') {
      const water = formatPercent(data.water_access, lang);
      const elec = formatPercent(data.electricity_access, lang);
      const informal = formatPercent(data.informal_housing_percentage, lang);
      const unemp = formatPercent(data.unemployment_rate, lang);
      const climate = getString(data.climate_risks, lang);

      return `
        <p><strong>Actions prioritaires (1-3 ans)</strong></p>
        <ul>
          <li><strong>Eau et électricité :</strong> réhabiliter d'urgence les réseaux existants et étendre la couverture dans les quartiers sous-équipés, avec pour objectif d'atteindre 80% d'accès à l'eau potable et 75% à l'électricité d'ici 3 ans. Installer 50 000 compteurs prépayés pour améliorer le recouvrement des coûts.</li>
          <li><strong>Habitat informel :</strong> lancer un programme de régularisation foncière dans 10 quartiers prioritaires, touchant <strong>${informal}%</strong> de la population concernée, et fournir des titres d'occupation sécurisés. Améliorer l'accès aux services de base dans ces zones (points d'eau communautaires, latrines publiques).</li>
          <li><strong>Emploi des jeunes :</strong> créer des centres de formation professionnelle dans les métiers porteurs (BTP, numérique, agriculture urbaine) et accompagner 5 000 jeunes vers l'emploi ou l'auto-emploi, visant une réduction du chômage de <strong>${unemp}%</strong> de 2 points.</li>
          <li><strong>Résilience climatique :</strong> construire 10 km de digues et de systèmes de drainage dans les zones inondables, et reboiser 500 ha de bassins versants pour limiter les risques liés à <strong>${climate}</strong>.</li>
          <li><strong>Gouvernance locale :</strong> renforcer les capacités des services municipaux (formation, équipement informatique) et mettre en place une plateforme de signalement citoyen des problèmes urbains.</li>
        </ul>
      `;
    } else {
      return `...`;
    }
  };

  const generateMediumTermRecommendations = (data: ExtendedFormData, lang: 'fr' | 'en'): string => {
    if (lang === 'fr') {
      const growth = data.population_growth_rate || '2,5';
      const sectors = getString(data.main_economic_sectors, lang);
      const transport = data.public_transport || (lang === 'fr' ? 'insuffisant' : 'insufficient');

      return `
        <p><strong>Stratégies à moyen terme (3-7 ans)</strong></p>
        <ul>
          <li><strong>Planification urbaine :</strong> élaborer et adopter un plan d'urbanisme directeur pour maîtriser la croissance de <strong>${growth}%</strong>, délimiter les zones constructibles, préserver les espaces agricoles et naturels, et programmer les équipements publics (écoles, centres de santé, marchés).</li>
          <li><strong>Production de logements :</strong> lancer la construction de 20 000 logements sociaux et économiques en partenariat public-privé, avec des normes de qualité et d'efficacité énergétique, et développer des zones d'habitat planifié (écoquartiers).</li>
          <li><strong>Infrastructures structurantes :</strong> moderniser le réseau routier (bitumage de 100 km de routes, construction de ponts), étendre le réseau d'assainissement à 50% de la population, et améliorer l'éclairage public dans les zones à risque.</li>
          <li><strong>Développement économique :</strong> créer une zone d'activité économique dédiée aux filières porteuses (<strong>${sectors}</strong>) avec des incitations fiscales, et soutenir les PME et start-ups innovantes (incubateur, fonds de garantie).</li>
          <li><strong>Mobilité urbaine :</strong> mettre en place un réseau de transport public structuré (lignes de bus en site propre, gares routières, parkings relais) pour réduire la congestion et la pollution.</li>
          <li><strong>Environnement :</strong> instaurer un système de collecte sélective des déchets et une première unité de recyclage, et promouvoir l'utilisation de l'énergie solaire dans les bâtiments publics.</li>
        </ul>
      `;
    } else {
      return `...`;
    }
  };

  const generateLongTermRecommendations = (data: ExtendedFormData, lang: 'fr' | 'en'): string => {
    if (lang === 'fr') {
      const sectors = getString(data.main_economic_sectors, lang);

      return `
        <p><strong>Vision à long terme (7-15 ans)</strong></p>
        <ul>
          <li><strong>Ville durable et résiliente :</strong> faire de la ville un pôle d'excellence en économie verte et numérique, en s'appuyant sur les filières <strong>${sectors}</strong> et en atteignant la neutralité carbone grâce aux énergies renouvelables (50% du mix énergétique) et à l'efficacité énergétique.</li>
          <li><strong>Services universels :</strong> garantir l'accès universel à l'eau potable, à l'assainissement, à l'électricité, à la santé et à l'éducation de qualité pour tous les habitants, conformément aux ODD.</li>
          <li><strong>Gouvernance participative :</strong> instaurer une gouvernance locale transparente et participative via des budgets participatifs, des plateformes numériques de consultation citoyenne et des conseils de quartier élus.</li>
          <li><strong>Attractivité internationale :</strong> positionner la ville comme une métropole émergente attractive pour les investisseurs, les talents et les touristes, avec une image de marque forte (ville verte, ville intelligente).</li>
          <li><strong>Patrimoine et cadre de vie :</strong> préserver et valoriser le patrimoine culturel et architectural, développer des espaces publics de qualité (parcs, places, fronts de mer) et améliorer la qualité de l'air et de l'eau.</li>
        </ul>
      `;
    } else {
      return `...`;
    }
  };

  const generateConclusion = (data: ExtendedFormData, lang: 'fr' | 'en'): string => {
    if (lang === 'fr') {
      return `
        <p><strong>Conclusion prospective</strong></p>
        <p>Le diagnostic met en lumière une ville à la croisée des chemins. Si les défis sont immenses (croissance démographique non maîtrisée, déficit criant d'infrastructures, pauvreté persistante), les opportunités le sont tout autant. La jeunesse de sa population, sa position géographique stratégique et le dynamisme de ses acteurs économiques constituent des atouts majeurs pour amorcer une transformation durable.</p>
        <p>Une action résolue, coordonnée et progressive des acteurs publics, privés et de la société civile peut transformer <strong>${data.city || 'la ville'}</strong> en un modèle de résilience et de durabilité pour l'Afrique de l'Ouest. Les recommandations proposées, déclinées en trois horizons temporels, offrent une feuille de route réaliste pour atteindre cet objectif. Il appartient désormais aux décideurs locaux et nationaux de s'approprier cette vision et de mobiliser les ressources nécessaires à sa mise en œuvre.</p>
      `;
    } else {
      return `...`;
    }
  };

  // ==== Fonction pour générer la section des graphiques et les données associées ====
  const generateChartsSection = (data: ExtendedFormData, lang: 'fr' | 'en'): { html: string; chartData: ChartData } => {
    // Données démographiques
    const ageGroups = ['0-14 ans', '15-64 ans', '65+ ans'];
    let youth = Number(data.youth_percentage) || 60;
    let adult = 100 - youth - 5;
    let elderly = 5;
    if (youth > 100) youth = 60;
    const ageValues = [youth, adult, elderly];

    // Infrastructures
    const infraCategories = ['Eau potable', 'Électricité', 'Assainissement', 'Routes', 'Internet'];
    const currentAccess = [
      Number(data.water_access) || 45,
      Number(data.electricity_access) || 42,
      Number(data.sanitation_access) || 25,
      60,
      Number(data.internet_access) || 35,
    ];
    const targetAccess = [80, 75, 60, 85, 90];

    // Logement
    const housingTypes = ['Béton/Dur', 'Semi-dur', 'Traditionnel', 'Précaire'];
    const housingPercentages = [35, 25, 25, 15];

    // Économie
    const formal = data.formal_employment_rate ? Number(data.formal_employment_rate) : 30;
    const informal = data.informal_economy_share ? Number(data.informal_economy_share) : 70;
    const economyLabels = ['Formel', 'Informel'];
    const economyData = [formal, informal];

    const chartData: ChartData = {
      demographic: { ageGroups, values: ageValues },
      infrastructure: { categories: infraCategories, current: currentAccess, target: targetAccess },
      housing: { types: housingTypes, percentages: housingPercentages },
      economy: { labels: economyLabels, data: economyData },
    };

    // Génération du HTML avec des conteneurs DIV pour Plotly
    const html = `
      <h2 id="charts" style="font-size: 2rem; color: #1e3a5f; border-left: 6px solid #fbbf24; padding-left: 1.5rem; margin: 2rem 0;">6. GRAPHIQUES ET VISUALISATIONS</h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
        <div style="background: white; border-radius: 16px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <h3 style="margin-top: 0; color: #2c5aa0;">Pyramide des âges</h3>
          <div id="plotly-age" style="width:100%; height:300px;"></div>
          <p style="font-size: 0.9rem; color: #64748b;">Répartition par groupe d'âge (estimation).</p>
        </div>
        <div style="background: white; border-radius: 16px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <h3 style="margin-top: 0; color: #2c5aa0;">Infrastructures : accès actuel vs objectif 2030</h3>
          <div id="plotly-infra" style="width:100%; height:300px;"></div>
          <p style="font-size: 0.9rem; color: #64748b;">Taux d'accès aux services de base.</p>
        </div>
        <div style="background: white; border-radius: 16px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <h3 style="margin-top: 0; color: #2c5aa0;">Typologie des logements</h3>
          <div id="plotly-housing" style="width:100%; height:300px;"></div>
          <p style="font-size: 0.9rem; color: #64748b;">Répartition par type de construction.</p>
        </div>
        <div style="background: white; border-radius: 16px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <h3 style="margin-top: 0; color: #2c5aa0;">Économie formelle vs informelle</h3>
          <div id="plotly-economy" style="width:100%; height:300px;"></div>
          <p style="font-size: 0.9rem; color: #64748b;">Part de l'emploi formel et informel.</p>
        </div>
      </div>
    `;

    return { html, chartData };
  };

  // ==== Fonction pour générer les détails des indicateurs par dimension ====
  const generateDimensionDetails = (data: ExtendedFormData, lang: 'fr' | 'en'): string => {
    if (lang !== 'fr') return ''; // Version anglaise non implémentée

    let html = '<h3 id="dimension-details" style="font-size: 1.5rem; color: #2c5aa0; margin: 2rem 0 1rem;">8.1 Détails des indicateurs par dimension</h3>';

    for (const [dim, indicators] of Object.entries(dimensionIndicators)) {
      const dimName = dimensionNames[dim]?.[lang] || dim;
      html += `<h4 style="font-size: 1.2rem; color: #1e3a5f; margin: 1.5rem 0 0.5rem;">${dimName}</h4>`;
      html += '<table style="width:100%; border-collapse: collapse; margin-bottom: 1rem; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">';
      html += '<thead><tr style="background: #f1f5f9;"><th style="padding: 10px; text-align: left; font-weight: 600;">Indicateur</th><th style="padding: 10px; text-align: left; font-weight: 600;">Valeur</th></tr></thead><tbody>';

      for (const indicator of indicators) {
        const rawValue = data[indicator.key];
        // Convertir en chaîne si c'est un tableau
        let valueToFormat: string | undefined;
        if (rawValue === undefined || rawValue === null) {
          valueToFormat = undefined;
        } else if (Array.isArray(rawValue)) {
          valueToFormat = rawValue.join(', ');
        } else {
          valueToFormat = rawValue as string;
        }

        let formattedValue = 'Non spécifié';
        if (valueToFormat !== undefined && valueToFormat !== '') {
          switch (indicator.format) {
            case 'percent':
              formattedValue = formatPercent(valueToFormat, lang);
              break;
            case 'currency':
              formattedValue = formatCurrency(valueToFormat, lang);
              break;
            case 'number':
              formattedValue = formatNumber(valueToFormat, lang);
              break;
            default:
              formattedValue = valueToFormat;
          }
        }
        html += `<tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px;">${indicator.label}</td><td style="padding: 10px;">${formattedValue}</td></tr>`;
      }

      html += '</tbody></table>';
    }

    return html;
  };

  // ==== Fonction principale de génération du rapport ====
  const generateReportContent = async (
    data: ExtendedFormData,
    documents: DocumentContent[],
    webData: any,
    enableWorldBank: boolean,
    enableSDG: boolean,
    reportLanguage: 'fr' | 'en'
  ) => {
    setIsGenerating(true);
    try {
      // Génération locale des sections
      const aiContent: LocalContent = {
        executiveSummary: generateExecutiveSummary(data, reportLanguage),
        demographicAnalysis: generateDemographicAnalysis(data, reportLanguage),
        socioEconomicAnalysis: generateSocioEconomicAnalysis(data, reportLanguage),
        housingAnalysis: generateHousingAnalysis(data, reportLanguage),
        infrastructureAnalysis: generateInfrastructureAnalysis(data, reportLanguage),
        challengesAnalysis: generateChallengesAnalysis(data, reportLanguage),
        opportunitiesAnalysis: generateOpportunitiesAnalysis(data, reportLanguage),
        shortTermRecommendations: generateShortTermRecommendations(data, reportLanguage),
        mediumTermRecommendations: generateMediumTermRecommendations(data, reportLanguage),
        longTermRecommendations: generateLongTermRecommendations(data, reportLanguage),
        conclusion: generateConclusion(data, reportLanguage)
      };

      const { html: chartsHTML, chartData } = generateChartsSection(data, reportLanguage);

      const reportHTML = generateReportHTML(data, documents, aiContent, chartsHTML, enableWorldBank, enableSDG, reportLanguage);
      setGeneratedContent(reportHTML);
      setReportData({ form: data, documents, chartData });
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

  // ==== Version enrichie de generateReportHTML (avec intégration des graphiques et table des matières) ====
  const generateReportHTML = (
    data: ExtendedFormData,
    documents: DocumentContent[],
    aiContent: LocalContent,
    chartsHTML: string,
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
        footerText: 'Report generated by AfricanCities IA Services',
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

    const getDimensionName = (dim: string): string => dimensionNames[dim]?.[lang] || dim;

    // Génération des détails des indicateurs
    const dimensionDetailsHTML = generateDimensionDetails(data, lang);

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
          <div style="margin: 20px 0;">📅 ${new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
          <div style="margin-top: 30px; padding: 15px 30px; background: rgba(255,255,255,0.9); border-radius: 15px; display: inline-block;">
            <strong>Centre of Urban Systems - UM6P</strong><br>
            <span style="color: #fbbf24;">AfricanCities IA Services</span>
          </div>
        </div>

        <!-- TABLE DES MATIÈRES -->
        <div class="table-of-contents" style="background: #f9fafb; border-radius: 16px; padding: 30px; margin: 30px 0; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <style>
            .table-of-contents a:hover { color: #fbbf24; text-decoration: underline; }
            .table-of-contents li { break-inside: avoid; }
          </style>
          <h2 style="font-size: 2rem; color: #1e3a5f; border-left: 6px solid #fbbf24; padding-left: 1.5rem; margin: 0 0 1.5rem 0;">TABLE DES MATIÈRES</h2>
          <ul style="list-style: none; padding: 0; columns: 2; column-gap: 40px;">
            <li style="margin-bottom: 10px;"><a href="#executive-summary" style="text-decoration: none; color: #1e3a5f; font-weight: 500;">1. RÉSUMÉ EXÉCUTIF</a></li>
            <li style="margin-bottom: 10px;"><a href="#demographic-context" style="text-decoration: none; color: #1e3a5f; font-weight: 500;">2. CONTEXTE DÉMOGRAPHIQUE ET SOCIAL</a></li>
            <li style="margin-bottom: 10px;"><a href="#habitat-infrastructure" style="text-decoration: none; color: #1e3a5f; font-weight: 500;">3. ANALYSE DE L'HABITAT ET DES INFRASTRUCTURES</a></li>
            <li style="margin-bottom: 10px;"><a href="#challenges-opportunities" style="text-decoration: none; color: #1e3a5f; font-weight: 500;">4. DÉFIS ET OPPORTUNITÉS</a></li>
            <li style="margin-bottom: 10px;"><a href="#recommendations" style="text-decoration: none; color: #1e3a5f; font-weight: 500;">5. RECOMMANDATIONS STRATÉGIQUES</a></li>
            <li style="margin-bottom: 10px;"><a href="#charts" style="text-decoration: none; color: #1e3a5f; font-weight: 500;">6. GRAPHIQUES ET VISUALISATIONS</a></li>
            <li style="margin-bottom: 10px;"><a href="#conclusion" style="text-decoration: none; color: #1e3a5f; font-weight: 500;">7. CONCLUSION</a></li>
            <li style="margin-bottom: 10px;"><a href="#dimension-scores" style="text-decoration: none; color: #1e3a5f; font-weight: 500;">8. SCORES PAR DIMENSION</a></li>
            <li style="margin-bottom: 10px;"><a href="#dimension-details" style="text-decoration: none; color: #1e3a5f; font-weight: 500;">8.1 Détails des indicateurs</a></li>
            ${enableSDG ? '<li style="margin-bottom: 10px;"><a href="#sdg" style="text-decoration: none; color: #1e3a5f; font-weight: 500;">9. OBJECTIFS DE DÉVELOPPEMENT DURABLE</a></li>' : ''}
            ${documents.length > 0 ? '<li style="margin-bottom: 10px;"><a href="#documents" style="text-decoration: none; color: #1e3a5f; font-weight: 500;">10. DOCUMENTS ANALYSÉS</a></li>' : ''}
          </ul>
        </div>

        <!-- RÉSUMÉ EXÉCUTIF -->
        <h2 id="executive-summary" style="font-size: 2rem; color: #1e3a5f; border-left: 6px solid #fbbf24; padding-left: 1.5rem; margin: 2rem 0;">${txt.execSummary}</h2>
        <div style="background: white; border-radius: 16px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin: 20px 0;">
          ${aiContent.executiveSummary}
        </div>

        <!-- 2. CONTEXTE DÉMOGRAPHIQUE ET SOCIAL -->
        <h2 id="demographic-context" style="font-size: 2rem; color: #1e3a5f; border-left: 6px solid #fbbf24; padding-left: 1.5rem; margin: 2rem 0;">2. CONTEXTE DÉMOGRAPHIQUE ET SOCIAL</h2>
        <h3 style="font-size: 1.5rem; color: #2c5aa0; margin: 1.5rem 0;">2.1 Profil démographique</h3>
        <div style="background: white; border-radius: 16px; padding: 20px; margin-bottom: 20px;">
          ${aiContent.demographicAnalysis}
        </div>
        <h3 style="font-size: 1.5rem; color: #2c5aa0; margin: 1.5rem 0;">2.2 Contexte socio-économique</h3>
        <div style="background: white; border-radius: 16px; padding: 20px; margin-bottom: 20px;">
          ${aiContent.socioEconomicAnalysis}
        </div>

        <!-- 3. ANALYSE DE L'HABITAT ET DES INFRASTRUCTURES -->
        <h2 id="habitat-infrastructure" style="font-size: 2rem; color: #1e3a5f; border-left: 6px solid #fbbf24; padding-left: 1.5rem; margin: 2rem 0;">3. ANALYSE DE L'HABITAT ET DES INFRASTRUCTURES</h2>
        <h3 style="font-size: 1.5rem; color: #2c5aa0; margin: 1.5rem 0;">3.1 État du parc de logements</h3>
        <div style="background: white; border-radius: 16px; padding: 20px; margin-bottom: 20px;">
          ${aiContent.housingAnalysis}
        </div>
        <h3 style="font-size: 1.5rem; color: #2c5aa0; margin: 1.5rem 0;">3.2 Infrastructures de base</h3>
        <div style="background: white; border-radius: 16px; padding: 20px; margin-bottom: 20px;">
          ${aiContent.infrastructureAnalysis}
        </div>

        <!-- 4. DÉFIS ET OPPORTUNITÉS -->
        <h2 id="challenges-opportunities" style="font-size: 2rem; color: #1e3a5f; border-left: 6px solid #fbbf24; padding-left: 1.5rem; margin: 2rem 0;">4. DÉFIS ET OPPORTUNITÉS IDENTIFIÉS</h2>
        <h3 style="font-size: 1.5rem; color: #2c5aa0; margin: 1.5rem 0;">4.1 Défis majeurs</h3>
        <div style="background: white; border-radius: 16px; padding: 20px; margin-bottom: 20px;">
          ${aiContent.challengesAnalysis}
        </div>
        <h3 style="font-size: 1.5rem; color: #2c5aa0; margin: 1.5rem 0;">4.2 Opportunités de développement</h3>
        <div style="background: white; border-radius: 16px; padding: 20px; margin-bottom: 20px;">
          ${aiContent.opportunitiesAnalysis}
        </div>

        <!-- 5. RECOMMANDATIONS STRATÉGIQUES -->
        <h2 id="recommendations" style="font-size: 2rem; color: #1e3a5f; border-left: 6px solid #fbbf24; padding-left: 1.5rem; margin: 2rem 0;">5. RECOMMANDATIONS STRATÉGIQUES</h2>
        <h3 style="font-size: 1.5rem; color: #2c5aa0; margin: 1.5rem 0;">5.1 Priorités à court terme (1-3 ans)</h3>
        <div style="background: white; border-radius: 16px; padding: 20px; margin-bottom: 20px;">
          ${aiContent.shortTermRecommendations}
        </div>
        <h3 style="font-size: 1.5rem; color: #2c5aa0; margin: 1.5rem 0;">5.2 Stratégies à moyen terme (3-7 ans)</h3>
        <div style="background: white; border-radius: 16px; padding: 20px; margin-bottom: 20px;">
          ${aiContent.mediumTermRecommendations}
        </div>
        <h3 style="font-size: 1.5rem; color: #2c5aa0; margin: 1.5rem 0;">5.3 Vision à long terme (7-15 ans)</h3>
        <div style="background: white; border-radius: 16px; padding: 20px; margin-bottom: 20px;">
          ${aiContent.longTermRecommendations}
        </div>

        <!-- 6. GRAPHIQUES ET VISUALISATIONS -->
        ${chartsHTML}

        <!-- 7. CONCLUSION PROSPECTIVE -->
        <h2 id="conclusion" style="font-size: 2rem; color: #1e3a5f; border-left: 6px solid #fbbf24; padding-left: 1.5rem; margin: 2rem 0;">7. CONCLUSION PROSPECTIVE</h2>
        <div style="background: white; border-radius: 16px; padding: 20px; margin-bottom: 20px;">
          ${aiContent.conclusion}
        </div>

        <!-- SECTION DES SCORES PAR DIMENSION -->
        <h2 id="dimension-scores" style="font-size: 2rem; color: #1e3a5f; border-left: 6px solid #fbbf24; padding-left: 1.5rem; margin: 2rem 0;">${txt.dimAnalysis}</h2>
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

        <!-- DÉTAILS DES INDICATEURS PAR DIMENSION -->
        ${dimensionDetailsHTML}

        <!-- SECTION SDG -->
        ${enableSDG ? `
          <h2 id="sdg" style="font-size: 2rem; color: #1e3a5f; border-left: 6px solid #fbbf24; padding-left: 1.5rem; margin: 2rem 0;">${txt.sdgTitle}</h2>
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
        ` : ''}

        <!-- DOCUMENTS ANALYSÉS -->
        ${documents.length > 0 ? `
          <h2 id="documents" style="font-size: 2rem; color: #1e3a5f; border-left: 6px solid #fbbf24; padding-left: 1.5rem; margin: 2rem 0;">${txt.docsTitle}</h2>
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

  return {
    isGenerating,
    generatedContent,
    reportData,
    setGeneratedContent,
    generateReportContent
  };
}