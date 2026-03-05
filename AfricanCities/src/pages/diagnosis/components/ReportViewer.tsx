import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../component/ui/card";
import { Button } from "../../../component/ui/button";
import { Download, AlertCircle } from "lucide-react";
import { useRef } from "react";
import { toast } from "../../../hooks/use-toast";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ReportViewerProps {
  generatedContent: string | null;
  city: string;
}

export function ReportViewer({ generatedContent, city }: ReportViewerProps) {
  const reportContentRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    if (!reportContentRef.current) return;
    
    try {
      toast({
        title: "Préparation du PDF",
        description: "Génération du document en cours...",
      });
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210;
      const pageHeight = 297;
      
      const coverElement = reportContentRef.current.querySelector('.cover-page');
      if (coverElement) {
        const coverCanvas = await html2canvas(coverElement as HTMLElement, {
          scale: 2,
          backgroundColor: '#ffffff',
          logging: false,
          useCORS: true,
          allowTaint: false,
        });
        
        const coverImgData = coverCanvas.toDataURL('image/png');
        const coverImgHeight = (coverCanvas.height * imgWidth) / coverCanvas.width;
        
        pdf.addImage(coverImgData, 'PNG', 0, 0, imgWidth, coverImgHeight, undefined, 'FAST');
      }
      
      const contentClone = reportContentRef.current.cloneNode(true) as HTMLElement;
      
      const coverInClone = contentClone.querySelector('.cover-page');
      if (coverInClone) {
        coverInClone.remove();
      }
      
      const pageBreaks = contentClone.querySelectorAll('.page-break');
      pageBreaks.forEach(el => el.remove());
      
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '1200px';
      tempContainer.style.background = '#ffffff';
      tempContainer.appendChild(contentClone);
      document.body.appendChild(tempContainer);
      
      const contentCanvas = await html2canvas(tempContainer, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        allowTaint: false,
        windowWidth: 1200,
      });
      
      document.body.removeChild(tempContainer);
      
      const contentImgData = contentCanvas.toDataURL('image/png');
      const contentImgHeight = (contentCanvas.height * imgWidth) / contentCanvas.width;
      
      if (coverElement) {
        let heightLeft = contentImgHeight;
        let position = 0;
        let firstPage = true;
        
        while (heightLeft > 0) {
          if (!firstPage) {
            pdf.addPage();
          }
          
          pdf.addImage(contentImgData, 'PNG', 0, position, imgWidth, contentImgHeight, undefined, 'FAST');
          
          heightLeft -= pageHeight;
          position -= pageHeight;
          firstPage = false;
        }
      } else {
        pdf.addImage(contentImgData, 'PNG', 0, 0, imgWidth, contentImgHeight, undefined, 'FAST');
        
        let heightLeft = contentImgHeight - pageHeight;
        let position = -pageHeight;
        
        while (heightLeft > 0) {
          pdf.addPage();
          pdf.addImage(contentImgData, 'PNG', 0, position, imgWidth, contentImgHeight, undefined, 'FAST');
          heightLeft -= pageHeight;
          position -= pageHeight;
        }
      }
      
      pdf.save(`Diagnostic_${city?.replace(/\s+/g, '_') || 'ville'}_${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast({
        title: "Succès !",
        description: "Le PDF a été généré avec succès.",
      });
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le PDF.",
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
              Diagnostic Urbain Complet: {city}
            </CardTitle>
            <CardDescription>
              80+ indicateurs · 7 dimensions
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={downloadPDF}>
              <Download className="w-4 h-4 mr-2" />
              Télécharger PDF
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
            <p>Aucun résultat disponible. Veuillez d'abord renseigner les indicateurs et générer le diagnostic.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}