// frontend/src/pages/diagnosis/hooks/useDocumentUpload.ts
import { useState, useRef } from 'react';
import { toast } from "../../../hooks/use-toast";
import type { DocumentContent } from '../types';
import { MAX_FILE_SIZE } from '../constants';
import { uploadMultipleFiles } from '../../../services/api';
import * as XLSX from 'xlsx'; // Assurez-vous d'avoir installé xlsx

export function useDocumentUpload() {
  const [documents, setDocuments] = useState<DocumentContent[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileType = (file: File): 'pdf' | 'image' | 'excel' | 'geojson' | null => {
    if (file.type === 'application/pdf') return 'pdf';
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.includes('spreadsheet') || file.type.includes('excel') || file.type === 'text/csv') return 'excel';
    if (file.type === 'application/geo+json' || file.name.endsWith('.geojson')) return 'geojson';
    if (file.type === 'application/json' && file.name.endsWith('.geojson')) return 'geojson';
    return null;
  };

  // ---------- Fonctions d'extraction locales (fallback) ----------
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
  // ----------------------------------------------------------------

  // Traitement local d'un fichier (fallback)
  const processFileLocally = async (file: File): Promise<DocumentContent | null> => {
    const fileType = getFileType(file);
    if (!fileType) return null;

    try {
      let content = '';
      let extractedData = null;
      let preview = undefined;
      let metadata: any = { size: file.size };

      switch (fileType) {
        case 'pdf':
          content = `Document PDF: ${file.name}`;
          metadata.pages = Math.floor(Math.random() * 50) + 5; // simulé
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
          break;
        case 'geojson':
          extractedData = await extractGeoJSONData(file);
          const features = extractedData.metadata?.features || 0;
          content = `Fichier GeoJSON: ${file.name} - ${features} entités géographiques`;
          metadata.features = features;
          metadata.geometryTypes = extractedData.metadata?.geometryTypes;
          break;
        default:
          return null;
      }

      return {
        filename: file.name,
        content,
        type: fileType,
        data: extractedData,
        preview,
        metadata
      };
    } catch (error) {
      console.error(`Erreur lors du traitement local de ${file.name}:`, error);
      return null;
    }
  };

  // Upload principal (tente l'API, puis fallback local)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const fileArray = Array.from(files);
    const newDocuments: DocumentContent[] = [];

    // Filtrer les fichiers valides
    const validFiles = fileArray.filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        toast({ title: "Fichier trop volumineux", description: `${file.name} dépasse 50MB.`, variant: "destructive" });
        return false;
      }
      if (!getFileType(file)) {
        toast({ title: "Format non supporté", description: `${file.name} n'est pas accepté.`, variant: "destructive" });
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) {
      setIsUploading(false);
      return;
    }

    // Tentative d'upload via API
    try {
      const response = await uploadMultipleFiles(validFiles);
      if (response.success && response.documents) {
        // Succès API : construire les documents depuis la réponse
        response.documents.forEach((doc: any, index: number) => {
          newDocuments.push({
            filename: doc.filename || validFiles[index].name,
            content: JSON.stringify(doc),
            type: doc.type || getFileType(validFiles[index]) || 'unknown',
            data: doc,
            preview: doc.type === 'image' ? URL.createObjectURL(validFiles[index]) : undefined,
            metadata: {
              size: validFiles[index].size,
              ...(doc.pages && { pages: doc.pages.length }),
              ...(doc.rows && { rows: doc.rows }),
              ...(doc.sheet_names && { sheets: doc.sheet_names })
            }
          });
        });
        toast({ title: "🎉 Succès !", description: `${response.count} fichier(s) uploadé(s) via API.` });
      } else {
        throw new Error('Réponse API invalide');
      }
    } catch (error) {
      console.warn('API d’upload indisponible, traitement local…', error);
      toast({ title: "⚠️ Mode dégradé", description: "Traitement local des fichiers.", variant: "default" });

      // Fallback local : traiter chaque fichier un par un
      for (const file of validFiles) {
        // Simuler progression
        for (let p = 0; p <= 100; p += 25) {
          setUploadProgress(prev => ({ ...prev, [file.name]: p }));
          await new Promise(r => setTimeout(r, 10));
        }
        const doc = await processFileLocally(file);
        if (doc) newDocuments.push(doc);
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[file.name];
          return newProgress;
        });
      }
    } finally {
      if (newDocuments.length > 0) {
        setDocuments(prev => [...prev, ...newDocuments]);
      }
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeDocument = (filename: string) => {
    setDocuments(prev => prev.filter(doc => doc.filename !== filename));
    toast({ title: "Document retiré", description: `${filename} supprimé.` });
  };

  const clearAllDocuments = () => {
    setDocuments([]);
    toast({ title: "🧹 Liste vidée", description: "Tous les documents ont été retirés." });
  };

  const getDocumentsSummary = () => {
    const summary = {
      total: documents.length,
      pdf: documents.filter(d => d.type === 'pdf').length,
      image: documents.filter(d => d.type === 'image').length,
      excel: documents.filter(d => d.type === 'excel').length,
      geojson: documents.filter(d => d.type === 'geojson').length,
      other: documents.filter(d => !['pdf', 'image', 'excel', 'geojson'].includes(d.type)).length
    };
    return summary;
  };

  return {
    documents,
    uploadProgress,
    isUploading,
    fileInputRef,
    handleFileUpload,   // à utiliser dans le composant
    removeDocument,
    clearAllDocuments,
    getDocumentsSummary
  };
}