import React, { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist';
import type { ChartData } from './useReportGeneration';

interface ReportViewerProps {
  reportHTML: string;
  chartData?: ChartData;
}

const baseLayout = {
  font: { family: 'Arial, sans-serif', size: 12, color: '#2c3e50' },
  paper_bgcolor: 'rgba(0,0,0,0)',
  plot_bgcolor: 'rgba(0,0,0,0)',
  margin: { t: 50, b: 50, l: 60, r: 30 },
  hovermode: 'closest' as const,
};

const ReportViewer: React.FC<ReportViewerProps> = ({ reportHTML, chartData }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartData) {
      console.log('⏳ En attente des données de graphiques...');
      return;
    }

    // On attend que le DOM soit complètement mis à jour
    const timer = setTimeout(() => {
      const ageDiv = document.getElementById('plotly-age');
      const infraDiv = document.getElementById('plotly-infra');
      const housingDiv = document.getElementById('plotly-housing');
      const economyDiv = document.getElementById('plotly-economy');

      if (!ageDiv || !infraDiv || !housingDiv || !economyDiv) {
        console.error('❌ Conteneurs Plotly introuvables dans le DOM', {
          age: !!ageDiv,
          infra: !!infraDiv,
          housing: !!housingDiv,
          economy: !!economyDiv,
        });
        return;
      }

      console.log('✅ Conteneurs trouvés, création des graphiques...');

      // Nettoyer les anciens graphiques
      Plotly.purge('plotly-age');
      Plotly.purge('plotly-infra');
      Plotly.purge('plotly-housing');
      Plotly.purge('plotly-economy');

      // Graphique démographique
      Plotly.newPlot('plotly-age', [{
        x: chartData.demographic.ageGroups,
        y: chartData.demographic.values,
        type: 'bar',
        marker: { color: ['#3b82f6', '#10b981', '#f59e0b'] },
        text: chartData.demographic.values.map(v => v + '%'),
        textposition: 'outside',
        hovertemplate: '%{y}%<extra></extra>',
      }], {
        ...baseLayout,
        title: { text: '📊 Répartition par âge', font: { size: 16, color: '#1e3a5f' } },
        xaxis: { title: { text: "Groupe d'âge", font: { size: 13 } } },
        yaxis: { title: { text: 'Pourcentage (%)', font: { size: 13 } }, gridcolor: '#e2e8f0' },
      });

      // Graphique infrastructures
      Plotly.newPlot('plotly-infra', [
        {
          name: 'Actuel',
          x: chartData.infrastructure.categories,
          y: chartData.infrastructure.current,
          type: 'bar',
          marker: { color: '#ef4444' },
          text: chartData.infrastructure.current.map(v => v + '%'),
          textposition: 'outside',
        },
        {
          name: 'Objectif 2030',
          x: chartData.infrastructure.categories,
          y: chartData.infrastructure.target,
          type: 'bar',
          marker: { color: '#3b82f6' },
          text: chartData.infrastructure.target.map(v => v + '%'),
          textposition: 'outside',
        }
      ], {
        ...baseLayout,
        title: { text: '🏗️ Accès aux infrastructures', font: { size: 16, color: '#1e3a5f' } },
        xaxis: { title: { text: 'Services', font: { size: 13 } }, tickangle: -15 },
        yaxis: { title: { text: 'Taux (%)', font: { size: 13 } }, range: [0, 100], gridcolor: '#e2e8f0' },
        barmode: 'group',
        legend: { orientation: 'h', y: 1.12, x: 0.5, xanchor: 'center' },
      });

      // Graphique logement (camembert)
      Plotly.newPlot('plotly-housing', [{
        labels: chartData.housing.types,
        values: chartData.housing.percentages,
        type: 'pie',
        marker: { colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'] },
        textinfo: 'label+percent',
        textposition: 'inside',
        hole: 0.3,
      }], {
        ...baseLayout,
        title: { text: '🏠 Typologie des logements', font: { size: 16, color: '#1e3a5f' } },
        showlegend: true,
        legend: { orientation: 'h', y: -0.2, x: 0.5, xanchor: 'center' },
      });

      // Graphique économie (camembert)
      Plotly.newPlot('plotly-economy', [{
        labels: chartData.economy.labels,
        values: chartData.economy.data,
        type: 'pie',
        marker: { colors: ['#10b981', '#ef4444'] },
        textinfo: 'label+percent',
        textposition: 'inside',
        hole: 0.4,
      }], {
        ...baseLayout,
        title: { text: '💼 Économie formelle vs informelle', font: { size: 16, color: '#1e3a5f' } },
        showlegend: true,
        legend: { orientation: 'h', y: -0.2, x: 0.5, xanchor: 'center' },
      });

      // Gestion du redimensionnement
      const handleResize = () => {
        ['plotly-age', 'plotly-infra', 'plotly-housing', 'plotly-economy'].forEach(id => {
          Plotly.relayout(id, { width: undefined, height: undefined });
        });
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, 100); // Délai réduit à 100 ms, suffisant pour la mise à jour du DOM

    return () => clearTimeout(timer);
  }, [chartData]);

  return <div ref={containerRef} dangerouslySetInnerHTML={{ __html: reportHTML }} />;
};

export default ReportViewer;