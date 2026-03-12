import React, { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist';
import type { ChartData } from './useReportGeneration';

interface ReportViewerProps {
  reportHTML: string;
  chartData?: ChartData;
}

// Layout de base amélioré (repris de votre seconde version)
const baseLayout = {
  font: {
    family: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    size: 12,
    color: '#334155'
  },
  paper_bgcolor: 'rgba(255,255,255,0)',
  plot_bgcolor: 'rgba(255,255,255,0)',
  margin: { t: 60, b: 60, l: 70, r: 40 },
  hovermode: 'closest' as const,
  hoverlabel: {
    bgcolor: '#1e293b',
    font: { color: 'white', size: 11 },
    bordercolor: '#475569'
  }
};

const ReportViewer: React.FC<ReportViewerProps> = ({ reportHTML, chartData }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const plotsInitialized = useRef(false);
  const observerRef = useRef<MutationObserver | null>(null);

  // Fonction d'initialisation des graphiques
  const initPlots = (): boolean => {
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

    // Nettoyage des anciennes instances
    Plotly.purge('plotly-age');
    Plotly.purge('plotly-infra');
    Plotly.purge('plotly-housing');
    Plotly.purge('plotly-economy');

    // Graphique démographique
    Plotly.newPlot('plotly-age', [{
      x: chartData.demographic.ageGroups,
      y: chartData.demographic.values,
      type: 'bar',
      marker: { color: ['#3b82f6', '#10b981', '#f59e0b'], line: { color: '#ffffff', width: 1 } },
      text: chartData.demographic.values.map(v => v + '%'),
      textposition: 'outside',
      textfont: { size: 10, color: '#1e293b' },
      hovertemplate: '<b>%{x}</b><br>%{y}%<extra></extra>',
    }], {
      ...baseLayout,
      title: { text: '📊 Répartition par âge', font: { size: 16, color: '#0f172a' } },
      xaxis: { title: { text: "Groupe d'âge", font: { size: 12 } }, tickfont: { size: 11 }, gridcolor: '#e2e8f0' },
      yaxis: { title: { text: 'Pourcentage (%)', font: { size: 12 } }, tickfont: { size: 11 }, gridcolor: '#e2e8f0', zeroline: false },
      bargap: 0.3,
    });

    // Graphique infrastructures
    Plotly.newPlot('plotly-infra', [
      {
        name: 'Actuel',
        x: chartData.infrastructure.categories,
        y: chartData.infrastructure.current,
        type: 'bar',
        marker: { color: '#ef4444', line: { color: '#ffffff', width: 1 } },
        text: chartData.infrastructure.current.map(v => v + '%'),
        textposition: 'outside',
        textfont: { size: 10, color: '#1e293b' },
        hovertemplate: '<b>%{x}</b><br>Actuel: %{y}%<extra></extra>',
      },
      {
        name: 'Objectif 2030',
        x: chartData.infrastructure.categories,
        y: chartData.infrastructure.target,
        type: 'bar',
        marker: { color: '#3b82f6', line: { color: '#ffffff', width: 1 } },
        text: chartData.infrastructure.target.map(v => v + '%'),
        textposition: 'outside',
        textfont: { size: 10, color: '#1e293b' },
        hovertemplate: '<b>%{x}</b><br>Objectif 2030: %{y}%<extra></extra>',
      }
    ], {
      ...baseLayout,
      title: { text: '🏗️ Accès aux infrastructures', font: { size: 16, color: '#0f172a' } },
      xaxis: { title: { text: 'Services', font: { size: 12 } }, tickangle: -15, gridcolor: '#e2e8f0' },
      yaxis: { title: { text: 'Taux (%)', font: { size: 12 } }, range: [0, 100], gridcolor: '#e2e8f0', zeroline: false },
      barmode: 'group',
      bargap: 0.2,
      bargroupgap: 0.1,
      legend: { orientation: 'h', y: 1.15, x: 0.5, xanchor: 'center', font: { size: 11 } },
    });

    // Graphique logement
    Plotly.newPlot('plotly-housing', [{
      labels: chartData.housing.types,
      values: chartData.housing.percentages,
      type: 'pie',
      marker: { colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'], line: { color: '#ffffff', width: 2 } },
      textinfo: 'label+percent',
      textposition: 'inside',
      insidetextorientation: 'radial',
      insidetextfont: { size: 11, color: '#ffffff' },
      hole: 0.4,
    }], {
      ...baseLayout,
      title: { text: '🏠 Typologie des logements', font: { size: 16, color: '#0f172a' } },
      showlegend: true,
      legend: { orientation: 'h', y: -0.2, x: 0.5, xanchor: 'center', font: { size: 10 } },
      margin: { t: 60, b: 80, l: 40, r: 40 },
    });

    // Graphique économie
    Plotly.newPlot('plotly-economy', [{
      labels: chartData.economy.labels,
      values: chartData.economy.data,
      type: 'pie',
      marker: { colors: ['#10b981', '#ef4444'], line: { color: '#ffffff', width: 2 } },
      textinfo: 'label+percent',
      textposition: 'inside',
      insidetextorientation: 'radial',
      insidetextfont: { size: 12, color: '#ffffff' },
      hole: 0.5,
    }], {
      ...baseLayout,
      title: { text: '💼 Économie formelle vs informelle', font: { size: 16, color: '#0f172a' } },
      showlegend: true,
      legend: { orientation: 'h', y: -0.2, x: 0.5, xanchor: 'center', font: { size: 10 } },
      margin: { t: 60, b: 80, l: 40, r: 40 },
    });

    return true;
  };

  useEffect(() => {
    if (!chartData) return;

    // Tentative immédiate
    const success = initPlots();

    // Si échec (conteneurs pas encore dans le DOM), on observe le container
    if (!success && containerRef.current) {
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new MutationObserver(() => {
        const found = initPlots();
        if (found) {
          observerRef.current?.disconnect();
        }
      });

      observerRef.current.observe(containerRef.current, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [chartData, reportHTML]); // reportHTML inclus pour réagir aux changements du HTML

  // Gestion du redimensionnement
  useEffect(() => {
    const handleResize = () => {
      if (!plotsInitialized.current) return;
      ['plotly-age', 'plotly-infra', 'plotly-housing', 'plotly-economy'].forEach(id => {
        Plotly.relayout(id, { width: undefined, height: undefined });
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <div ref={containerRef} dangerouslySetInnerHTML={{ __html: reportHTML }} />;
};

export default ReportViewer;