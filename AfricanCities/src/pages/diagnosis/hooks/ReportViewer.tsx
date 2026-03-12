import React, { useEffect, useRef, useCallback } from 'react';
import Plotly from 'plotly.js-dist';
import type { ChartData } from './useReportGeneration';

interface ReportViewerProps {
  reportHTML: string;
  chartData?: ChartData;
}

const baseLayout = { /* ... (inchangé) */ };

const ReportViewer: React.FC<ReportViewerProps> = ({ reportHTML, chartData }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const plotsInitialized = useRef(false);
  const observerRef = useRef<MutationObserver | null>(null);
  const [key, setKey] = React.useState(0); // force refresh

  const initPlots = useCallback((): boolean => {
    if (!chartData) return false;

    const ageDiv = document.getElementById('plotly-age');
    const infraDiv = document.getElementById('plotly-infra');
    const housingDiv = document.getElementById('plotly-housing');
    const economyDiv = document.getElementById('plotly-economy');

    if (!ageDiv || !infraDiv || !housingDiv || !economyDiv) {
      console.log('⚠️ Conteneurs non trouvés, attente...');
      return false;
    }

    console.log('✅ Initialisation des graphiques');
    plotsInitialized.current = true;

    try {
      Plotly.purge('plotly-age');
      Plotly.purge('plotly-infra');
      Plotly.purge('plotly-housing');
      Plotly.purge('plotly-economy');

      Plotly.newPlot('plotly-age', [{
        x: chartData.demographic.ageGroups,
        y: chartData.demographic.values,
        type: 'bar',
        marker: { color: ['#3b82f6', '#10b981', '#f59e0b'] },
        text: chartData.demographic.values.map(v => v + '%'),
        textposition: 'outside',
      }], { ...baseLayout, title: '📊 Répartition par âge' });

      Plotly.newPlot('plotly-infra', [
        { name: 'Actuel', x: chartData.infrastructure.categories, y: chartData.infrastructure.current, type: 'bar', marker: { color: '#ef4444' } },
        { name: 'Objectif 2030', x: chartData.infrastructure.categories, y: chartData.infrastructure.target, type: 'bar', marker: { color: '#3b82f6' } }
      ], { ...baseLayout, title: '🏗️ Accès aux infrastructures', barmode: 'group' });

      Plotly.newPlot('plotly-housing', [{
        labels: chartData.housing.types,
        values: chartData.housing.percentages,
        type: 'pie',
        marker: { colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'] },
        hole: 0.4,
      }], { ...baseLayout, title: '🏠 Typologie des logements' });

      Plotly.newPlot('plotly-economy', [{
        labels: chartData.economy.labels,
        values: chartData.economy.data,
        type: 'pie',
        marker: { colors: ['#10b981', '#ef4444'] },
        hole: 0.5,
      }], { ...baseLayout, title: '💼 Économie formelle vs informelle' });

      return true;
    } catch (error) {
      console.error('Erreur Plotly:', error);
      return false;
    }
  }, [chartData]);

  // Effet pour réagir aux changements de chartData ou reportHTML
  useEffect(() => {
    plotsInitialized.current = false; // marque comme non initialisé
    const success = initPlots();

    if (!success && containerRef.current) {
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new MutationObserver(() => {
        const found = initPlots();
        if (found && observerRef.current) {
          observerRef.current.disconnect();
        }
      });

      observerRef.current.observe(containerRef.current, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [chartData, reportHTML, initPlots]);

  // Effet pour surveiller que les graphiques restent présents (en cas de mutation non détectée)
  useEffect(() => {
    if (!chartData) return;

    const checkPresence = () => {
      const ageDiv = document.getElementById('plotly-age');
      if (ageDiv && ageDiv.children.length === 0) {
        console.log('🔄 Graphiques disparus, réinitialisation');
        initPlots();
      }
    };

    const interval = setInterval(checkPresence, 2000); // vérifier toutes les 2 secondes

    return () => clearInterval(interval);
  }, [chartData, initPlots]);

  // Gestion du redimensionnement
  useEffect(() => {
    const handleResize = () => {
      if (!plotsInitialized.current) return;
      ['plotly-age', 'plotly-infra', 'plotly-housing', 'plotly-economy'].forEach(id => {
        Plotly.relayout(id, { width: undefined, height: undefined }).catch(() => {});
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <div ref={containerRef} dangerouslySetInnerHTML={{ __html: reportHTML }} />;
};

export default ReportViewer;