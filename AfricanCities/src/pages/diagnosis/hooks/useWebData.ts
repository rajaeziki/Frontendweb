// frontend/src/pages/diagnosis/hooks/useWebData.ts
import { useState, useCallback, useEffect } from 'react';
import { getWikipediaInfo, getWorldBankCountryCode, getWorldBankIndicators } from '../../../services/api';
import type { WebData } from '../types';  // ← Importe le type depuis types.ts

export function useWebData(enableWebSearch: boolean, city: string, country: string) {
  const [webData, setWebData] = useState<WebData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExternalData = useCallback(async () => {
    if (!enableWebSearch || !city) {
      console.log('🔍 Recherche désactivée ou ville manquante');
      setWebData(null);
      return;
    }
    
    console.log(`🌍 Récupération des données pour ${city}, ${country}`);
    setLoading(true);
    setError(null);
    
    try {
      // 1. Récupérer les infos Wikipedia
      console.log('📖 Appel Wikipedia...');
      const wikiResponse = await getWikipediaInfo(city, country);
      console.log('✅ Wikipedia reçu:', wikiResponse);
      
      // 2. Récupérer le code pays pour World Bank
      console.log('🏦 Recherche code pays...');
      const countryCodeResponse = await getWorldBankCountryCode(country);
      console.log('✅ Code pays:', countryCodeResponse);
      
      let worldBankData = null;
      if (countryCodeResponse?.code) {
        // 3. Récupérer les indicateurs World Bank
        console.log('📊 Récupération indicateurs World Bank...');
        worldBankData = await getWorldBankIndicators(
          countryCodeResponse.code,
          'SP.POP.TOTL,NY.GDP.PCAP.CD,SP.URB.TOTL.IN.ZS,EN.POP.DNST,SH.DYN.MORT,SE.ADT.LITR.ZS'
        );
        console.log('✅ Indicateurs reçus:', worldBankData);
      }
      
      // 4. Formater les données pour correspondre au type WebData de types.ts
      const formattedData: WebData = {
        wikipedia_info: wikiResponse?.data?.found ? {
          title: wikiResponse.data.title,
          summary: wikiResponse.data.summary,
          url: wikiResponse.data.url,
          found: true
        } : undefined,
        
        world_bank_data: worldBankData?.data ? {
          country_data: Object.values(worldBankData.data.indicators || {}).map((ind: any) => ({
            indicator: ind.indicator_name,
            value: ind.recent?.value,
            year: ind.recent?.date
          })),
          indicators: worldBankData.data.indicators || {},
          sdg_data: []
        } : undefined,
        
        external_sources: [
          {
            name: "Wikipedia",
            url: wikiResponse?.data?.url || `https://fr.wikipedia.org/wiki/${city}`,
            data: wikiResponse?.data
          },
          {
            name: "World Bank",
            url: `https://data.worldbank.org/country/${countryCodeResponse?.code}`,
            data: worldBankData?.data
          }
        ],
        
        additional_context: `Données récupérées pour ${city}, ${country}`
      };
      
      console.log('📦 Données formatées:', formattedData);
      setWebData(formattedData);
      
    } catch (err) {
      console.error('❌ Erreur lors de la récupération des données externes:', err);
      setError('Impossible de récupérer les données externes');
      setWebData(null);
    } finally {
      setLoading(false);
    }
  }, [city, country, enableWebSearch]);

  useEffect(() => {
    fetchExternalData();
  }, [fetchExternalData]);

  const refresh = useCallback(() => {
    fetchExternalData();
  }, [fetchExternalData]);

  return { 
    webData, 
    loading, 
    error,
    refresh
  };
}