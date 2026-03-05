// frontend/src/pages/diagnosis/hooks/useDocumentUpload.ts
import { useState, useRef } from 'react';
import { toast } from "../../../hooks/use-toast";
import type { DocumentContent } from '../types';
import { MAX_FILE_SIZE } from '../constants'; // ← ACCEPTED_FILE_TYPES enlevé car non utilisé
import { uploadMultipleFiles, uploadSingleFile } from '../../../services/api';

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

  // Fonction pour uploader un seul fichier vers le backend
  const uploadFileToBackend = async (file: File): Promise<DocumentContent | null> => {
    try {
      console.log(`📤 Upload de ${file.name} vers le backend...`);
      
      // Simuler la progression
      for (let progress = 0; progress <= 100; progress += 10) {
        setUploadProgress(prev => ({ ...prev, [file.name]: progress }));
        await new Promise(resolve => setTimeout(resolve, 20));
      }

      // Appel API réel vers ton backend FastAPI
      console.log(`📡 Appel API uploadSingleFile pour ${file.name}`);
      const response = await uploadSingleFile(file);
      console.log(`✅ Réponse reçue pour ${file.name}:`, response);
      
      if (response.success) {
        const fileType = getFileType(file) || 'unknown';
        
        // Construire l'objet DocumentContent à partir de la réponse
        const document: DocumentContent = {
          filename: file.name,
          content: JSON.stringify(response.document),
          type: fileType,
          data: response.document,
          preview: fileType === 'image' ? URL.createObjectURL(file) : undefined,
          metadata: {
            size: file.size,
            ...(response.document.pages && { pages: response.document.pages.length }),
            ...(response.document.images && { images: response.document.images.length }),
            ...(response.document.rows && { rows: response.document.rows }),
            ...(response.document.sheets && { sheets: response.document.sheet_names }),
            ...(response.document.dimensions && { 
              width: response.document.dimensions.width,
              height: response.document.dimensions.height 
            })
          }
        };

        toast({
          title: "✅ Document traité",
          description: `${file.name} analysé avec succès par le serveur`,
        });

        return document;
      }
      
      throw new Error('Échec de l\'upload');
      
    } catch (error) {
      console.error(`❌ Erreur lors du traitement de ${file.name}:`, error);
      toast({
        title: "❌ Erreur de traitement",
        description: `Impossible de traiter ${file.name}.`,
        variant: "destructive",
      });
      return null;
    } finally {
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[file.name];
        return newProgress;
      });
    }
  };

  // Upload multiple fichiers (VERSION AVEC BEAUCOUP DE LOGS)
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) {
      console.log('⚠️ Aucun fichier sélectionné');
      return;
    }

    console.log('📂 Fichiers sélectionnés:', files);
    console.log(`📊 Nombre de fichiers: ${files.length}`);

    setIsUploading(true);
    const fileArray = Array.from(files);
    const newDocuments: DocumentContent[] = [];

    try {
      for (const file of fileArray) {
        console.log(`\n🔍 Traitement de ${file.name}:`);
        console.log(`   - Taille: ${file.size} bytes`);
        console.log(`   - Type: ${file.type}`);

        // Vérification taille
        if (file.size > MAX_FILE_SIZE) {
          console.warn(`   ⚠️ Fichier trop volumineux: ${file.size} > ${MAX_FILE_SIZE}`);
          toast({
            title: "Fichier trop volumineux",
            description: `${file.name} dépasse la limite de 50MB.`,
            variant: "destructive",
          });
          continue;
        }

        // Vérification type
        const fileType = getFileType(file);
        console.log(`   - Type détecté: ${fileType || 'inconnu'}`);

        if (!fileType) {
          console.warn(`   ⚠️ Format non supporté`);
          toast({
            title: "Format non supporté",
            description: `${file.name} n'est pas dans un format accepté.`,
            variant: "destructive",
          });
          continue;
        }

        // Upload vers le backend
        console.log(`   📤 Upload vers backend...`);
        const doc = await uploadFileToBackend(file);
        if (doc) {
          console.log(`   ✅ Upload réussi pour ${file.name}`);
          newDocuments.push(doc);
        } else {
          console.warn(`   ❌ Échec upload pour ${file.name}`);
        }
      }

      console.log(`\n📊 Résultat final: ${newDocuments.length}/${fileArray.length} fichiers uploadés`);

      if (newDocuments.length > 0) {
        setDocuments(prev => [...prev, ...newDocuments]);
        toast({
          title: "🎉 Succès !",
          description: `${newDocuments.length} fichier(s) uploadé(s) avec succès`,
        });
      }

    } catch (error) {
      console.error('❌ Erreur globale upload:', error);
      toast({
        title: "❌ Erreur",
        description: "Impossible d'uploader les fichiers",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  // Upload rapide (version simplifiée avec logs)
  const handleQuickUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      console.log('⚠️ Aucun fichier sélectionné');
      return;
    }

    console.log('🚀 DÉBUT UPLOAD RAPIDE');
    console.log('📂 Fichiers:', Array.from(files).map(f => ({ name: f.name, type: f.type, size: f.size })));

    setIsUploading(true);
    const fileArray = Array.from(files);
    
    try {
      // Filtrer les fichiers non supportés
      console.log('🔍 Filtrage des fichiers...');
      const validFiles = fileArray.filter(file => {
        if (file.size > MAX_FILE_SIZE) {
          console.warn(`⚠️ Fichier trop gros: ${file.name} (${file.size} bytes)`);
          toast({
            title: "Fichier trop volumineux",
            description: `${file.name} dépasse la limite de 50MB.`,
            variant: "destructive",
          });
          return false;
        }
        const fileType = getFileType(file);
        if (!fileType) {
          console.warn(`⚠️ Format non supporté: ${file.name} (${file.type})`);
          toast({
            title: "Format non supporté",
            description: `${file.name} n'est pas dans un format accepté.`,
            variant: "destructive",
          });
          return false;
        }
        return true;
      });

      console.log(`✅ Fichiers valides: ${validFiles.length}/${fileArray.length}`);
      
      if (validFiles.length === 0) {
        console.log('❌ Aucun fichier valide');
        setIsUploading(false);
        return;
      }

      // Upload multiple vers le backend
      console.log('📡 Envoi de la requête uploadMultipleFiles...');
      console.log('📦 URL:', `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/ingest`);
      
      const response = await uploadMultipleFiles(validFiles);
      console.log('✅ Réponse reçue:', response);
      
      if (response.success) {
        console.log(`📊 Traitement de ${response.documents.length} documents...`);
        
        const newDocs: DocumentContent[] = response.documents.map((doc: any, index: number) => {
          console.log(`   Document ${index + 1}:`, doc.filename);
          return {
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
          };
        });
        
        setDocuments(prev => [...prev, ...newDocs]);
        
        toast({
          title: "🎉 Succès !",
          description: `${response.count} fichier(s) uploadé(s) avec succès`,
        });
      }
    } catch (error: any) {
      console.error('❌ ERREUR UPLOAD:');
      console.error('   Message:', error.message);
      console.error('   Status:', error.response?.status);
      console.error('   Data:', error.response?.data);
      console.error('   Config:', error.config);
      
      toast({
        title: "❌ Erreur",
        description: `Impossible d'uploader les fichiers: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeDocument = (filename: string) => {
    setDocuments(prev => prev.filter(doc => doc.filename !== filename));
    toast({
      title: "Document retiré",
      description: `${filename} a été supprimé de l'analyse.`,
    });
  };

  const clearAllDocuments = () => {
    setDocuments([]);
    toast({
      title: "🧹 Liste vidée",
      description: "Tous les documents ont été retirés",
    });
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
    handleFileUpload: handleQuickUpload,
    removeDocument,
    clearAllDocuments,
    getDocumentsSummary
  };
}