import { useTranslation } from 'react-i18next';
import { Button } from "../../../component/ui/button";
import { Loader2 } from "lucide-react";
import type { DocumentContent, WebData } from "../types";

interface FormActionsProps {
  isGenerating: boolean;
  documents: DocumentContent[];
  webData: WebData | null;
  enableSDG: boolean;
}

export function FormActions({ isGenerating, documents, webData, enableSDG }: FormActionsProps) {
  const { t } = useTranslation();

  // Comptage des documents par type
  const pdfCount = documents.filter(d => d.type === 'pdf').length;
  const imageCount = documents.filter(d => d.type === 'image').length;
  const excelCount = documents.filter(d => d.type === 'excel').length;
  const geojsonCount = documents.filter(d => d.type === 'geojson').length;

  return (
    <div className="sticky bottom-4 bg-white border border-gray-200 rounded-lg shadow-md p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          {/* Ligne : 80+ indicateurs · X document(s) */}
          <p className="text-sm font-medium text-gray-800">
            {t('diagnostic.stats.indicators_count')} ·{' '}
            {t('diagnostic.upload.documentsLoaded', { count: documents.length })}
          </p>
          {/* Ligne : compteurs par type */}
          <p className="text-xs text-gray-500">
            {t('diagnostic.upload.pdf', { count: pdfCount })} ·{' '}
            {t('diagnostic.upload.images', { count: imageCount })} ·{' '}
            {t('diagnostic.upload.excel', { count: excelCount })} ·{' '}
            {t('diagnostic.upload.geojson', { count: geojsonCount })}
          </p>
          {/* Message d'intégration des données externes */}
          {(webData || enableSDG) && (
            <p className="text-xs text-green-600 mt-1">
              ✓ {t('diagnostic.sources.integrated_message')}
            </p>
          )}
        </div>
        <Button
          type="submit"
          size="lg"
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 text-sm"
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t('diagnostic.report.generating')}
            </>
          ) : (
            t('diagnostic.report.generate')
          )}
        </Button>
      </div>
    </div>
  );
}