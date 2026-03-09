import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../component/ui/card";
import { Button } from "../../../component/ui/button";
import { Download, AlertCircle } from "lucide-react";
import { useRef } from "react";
import { toast } from "../../../hooks/use-toast";
import html2pdf from 'html2pdf.js';

interface ReportViewerProps {
  readonly generatedContent: string | null;  // marqué read-only pour SonarLint
  readonly city: string;
}

export function ReportViewer({ generatedContent, city }: ReportViewerProps) {
  const { t } = useTranslation();
  const reportContentRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    if (!reportContentRef.current) return;

    toast({
      title: t('diagnostic.report.preparing', 'Préparation du PDF'),
      description: t('diagnostic.report.generating', 'Génération du document en cours...'),
    });

    try {
      // Définition des options avec 'as const' pour obtenir des types littéraux stricts
      const opt = {
        margin: 0.5,
        filename: `Diagnostic_${city?.replace(/\s+/g, '_') || 'ville'}_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: true },
        jsPDF: { unit: 'in' as const, format: 'a4' as const, orientation: 'portrait' as const }
      } as const;  // rend toutes les propriétés en lecture seule avec types littéraux

      await html2pdf().set(opt).from(reportContentRef.current).save();

      toast({
        title: t('common.success', 'Succès !'),
        description: t('diagnostic.report.success', 'Le PDF a été généré avec succès.'),
      });
    } catch (error) {
      console.error('Erreur complète :', error);
      // Gestion robuste du message d'erreur (car error est de type 'unknown')
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Erreur inconnue lors de la génération du PDF.';
      toast({
        title: t('common.error', 'Erreur'),
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border-t-4 border-t-secondary">
      <CardHeader className="bg-slate-50 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-serif text-2xl text-primary">
              {t('diagnostic.report.title', 'Diagnostic Urbain Complet')}: {city}
            </CardTitle>
            <CardDescription>
              {t('diagnostic.report.subtitle', '80+ indicateurs · 7 dimensions')}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={downloadPDF}>
              <Download className="w-4 h-4 mr-2" />
              {t('diagnostic.results.download', 'Télécharger le rapport PDF')}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        {generatedContent ? (
          <div 
            ref={reportContentRef}
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: generatedContent }}
          />
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p>{t('diagnostic.report.noResults', 'Aucun résultat disponible. Veuillez d\'abord renseigner les indicateurs et générer le diagnostic.')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}