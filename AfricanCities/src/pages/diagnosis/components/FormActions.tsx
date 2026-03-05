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
  return (
    <div className="sticky bottom-4 bg-white border border-gray-200 rounded-lg shadow-md p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-800">
            80+ indicateurs · {documents.length} document{documents.length > 1 ? 's' : ''}
          </p>
          <p className="text-xs text-gray-500">
            {documents.filter(d => d.type === 'pdf').length} PDF · {documents.filter(d => d.type === 'image').length} Images · {documents.filter(d => d.type === 'excel').length} Excel · {documents.filter(d => d.type === 'geojson').length} GeoJSON
          </p>
          {(webData || enableSDG) && (
            <p className="text-xs text-green-600 mt-1">
              ✓ Données Banque Mondiale et SDG intégrées
            </p>
          )}
        </div>
        <Button
          type="submit"
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-sm"
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Génération...
            </>
          ) : (
            "Générer le diagnostic complet"
          )}
        </Button>
      </div>
    </div>
  );
}