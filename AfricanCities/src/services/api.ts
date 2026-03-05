// frontend/src/services/api.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Pour les requêtes GET simples (Wikipedia, World Bank)
export const getWikipediaInfo = async (city: string, country?: string) => {
  try {
    const response = await api.get('/api/external/wikipedia', {
      params: { city, country }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur Wikipedia:', error);
    throw error;
  }
};

export const getWorldBankCountryCode = async (country: string) => {
  try {
    const response = await api.get('/api/external/worldbank/country', {
      params: { country }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur World Bank:', error);
    throw error;
  }
};

export const getWorldBankIndicators = async (countryCode: string, indicators?: string) => {
  try {
    const response = await api.get('/api/external/worldbank/indicators', {
      params: { country_code: countryCode, indicators }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur indicateurs:', error);
    throw error;
  }
};

export const getSDGGoals = async () => {
  try {
    const response = await api.get('/api/external/sdg/goals');
    return response.data;
  } catch (error) {
    console.error('Erreur SDG:', error);
    throw error;
  }
};

// Pour les requêtes POST avec FormData (enrichissement)
export const enrichDiagnostic = async (city: string, country: string, diagnosticData?: any) => {
  try {
    const formData = new FormData();
    formData.append('city', city);
    formData.append('country', country);
    if (diagnosticData) {
      formData.append('diagnostic_data', JSON.stringify(diagnosticData));
    }
    
    const response = await api.post('/api/diagnostic/enrich', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur enrichissement:', error);
    throw error;
  }
};

// Health check
export const checkHealth = async () => {
  try {
    const response = await api.get('/api/health');
    return response.data;
  } catch (error) {
    console.error('Erreur health check:', error);
    throw error;
  }
};
// frontend/src/services/api.ts

// Upload un seul fichier
export const uploadSingleFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/api/ingest/single', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Upload plusieurs fichiers
export const uploadMultipleFiles = async (files: File[]) => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });
  
  const response = await api.post('/api/ingest', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`📤 Upload progress: ${percentCompleted}%`);
      }
    }
  });
  return response.data;
};
export default api;