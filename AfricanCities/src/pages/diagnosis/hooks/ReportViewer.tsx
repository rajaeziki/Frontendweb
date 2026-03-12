import React, { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist';
import type { ChartData } from './useReportGeneration';

interface ReportViewerProps {
  reportHTML: string;
  chartData?: ChartData;
}

// Layout de base amélioré
const baseLayout = {
  font: {
    family: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    size: 12,
    color: '#334155' // slate-700
  },
  paper_bgcolor: 'rgba(255,255,255,0)',
  plot_bgcolor: 'rgba(255,255,255,0)',
  margin: { t: 60, b: 60, l: 70, r: 40 },
  hovermode: 'closest' as const,
  hoverlabel: {
    bgcolor: '#1e293b', // slate-800
    font: { color: 'white', size: 11 },
    bordercolor: '#475569' // slate-600
  }
};

const ReportViewer: React.FC<ReportViewerProps> = ({ reportHTML, chartData }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartData) {
      console.log('⏳ En attente des données de graphiques...');
      return;
    }

    const timer = setTimeout(() => {
      const ageDiv = document.getElementById('plotly-age');
      const infraDiv = document.getElementById('plotly-infra');
      const housingDiv = document.getElementById('plotly-housing');
      const economyDiv = document.getElementById('plotly-economy');

      if (!ageDiv || !infraDiv || !housingDiv || !economyDiv) {
        console.error('❌ Conteneurs Plotly introuvables');
        return;
      }

      console.log('✅ Création des graphiques...');

      // Nettoyage
      Plotly.purge('plotly-age');
      Plotly.purge('plotly-infra');
      Plotly.purge('plotly-housing');
      Plotly.purge('plotly-economy');

      // ========== GRAPHIQUE DÉMOGRAPHIQUE ==========
      Plotly.newPlot('plotly-age', [{
        x: chartData.demographic.ageGroups,
        y: chartData.demographic.values,
        type: 'bar',
        marker: {
          color: ['#3b82f6', '#10b981', '#f59e0b'],
          line: { color: '#ffffff', width: 1 }
        },
        text: chartData.demographic.values.map(v => v + '%'),
        textposition: 'outside',
        textfont: { size: 10, color: '#1e293b' },
        hovertemplate: '<b>%{x}</b><br>%{y}%<extra></extra>',
      }], {
        ...baseLayout,
        title: {
          text: '📊 Répartition par âge',
          font: { size: 16, color: '#0f172a', family: 'Inter, sans-serif' }
        },
        xaxis: {
          title: { text: "Groupe d'âge", font: { size: 12 } },
          tickfont: { size: 11 },
          gridcolor: '#e2e8f0',
          gridwidth: 1
        },
        yaxis: {
          title: { text: 'Pourcentage (%)', font: { size: 12 } },
          tickfont: { size: 11 },
          gridcolor: '#e2e8f0',
          gridwidth: 1,
          zeroline: false
        },
        bargap: 0.3,
        hoverlabel: baseLayout.hoverlabel
      });

      // ========== GRAPHIQUE INFRASTRUCTURES ==========
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
        title: {
          text: '🏗️ Accès aux infrastructures',
          font: { size: 16, color: '#0f172a' }
        },
        xaxis: {
          title: { text: 'Services', font: { size: 12 } },
          tickfont: { size: 11 },
          tickangle: -15,
          gridcolor: '#e2e8f0'
        },
        yaxis: {
          title: { text: 'Taux (%)', font: { size: 12 } },
          tickfont: { size: 11 },
          range: [0, 100],
          gridcolor: '#e2e8f0',
          zeroline: false
        },
        barmode: 'group',
        bargap: 0.2,
        bargroupgap: 0.1,
        legend: {
          orientation: 'h',
          y: 1.15,
          x: 0.5,
          xanchor: 'center',
          font: { size: 11 },
          bgcolor: 'rgba(255,255,255,0.8)',
          bordercolor: '#e2e8f0',
          borderwidth: 1
        },
        hoverlabel: baseLayout.hoverlabel
      });

      // ========== GRAPHIQUE LOGEMENT (camembert) ==========
      Plotly.newPlot('plotly-housing', [{
        labels: chartData.housing.types,
        values: chartData.housing.percentages,
        type: 'pie',
        marker: {
          colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
          line: { color: '#ffffff', width: 2 }
        },
        textinfo: 'label+percent',
        textposition: 'inside',
        insidetextorientation: 'radial',
        insidetextfont: { size: 11, color: '#ffffff', weight: 'bold' },
        outsidetextfont: { size: 10, color: '#334155' },
        hoverinfo: 'label+percent',
        hovertemplate: '<b>%{label}</b><br>%{percent}<extra></extra>',
        hole: 0.4,
        pull: [0, 0, 0, 0.05] // léger détachement pour le dernier segment (précaire)
      }], {
        ...baseLayout,
        title: {
          text: '🏠 Typologie des logements',
          font: { size: 16, color: '#0f172a' }
        },
        showlegend: true,
        legend: {
          orientation: 'h',
          y: -0.2,
          x: 0.5,
          xanchor: 'center',
          font: { size: 10 },
          bgcolor: 'rgba(255,255,255,0.8)',
          bordercolor: '#e2e8f0',
          borderwidth: 1
        },
        margin: { t: 60, b: 80, l: 40, r: 40 },
        hoverlabel: baseLayout.hoverlabel
      });

      // ========== GRAPHIQUE ÉCONOMIE (camembert) ==========
      Plotly.newPlot('plotly-economy', [{
        labels: chartData.economy.labels,
        values: chartData.economy.data,
        type: 'pie',
        marker: {
          colors: ['#10b981', '#ef4444'],
          line: { color: '#ffffff', width: 2 }
        },
        textinfo: 'label+percent',
        textposition: 'inside',
        insidetextorientation: 'radial',
        insidetextfont: { size: 12, color: '#ffffff', weight: 'bold' },
        outsidetextfont: { size: 10, color: '#334155' },
        hoverinfo: 'label+percent',
        hovertemplate: '<b>%{label}</b><br>%{percent}<extra></extra>',
        hole: 0.5,
      }], {
        ...baseLayout,
        title: {
          text: '💼 Économie formelle vs informelle',
          font: { size: 16, color: '#0f172a' }
        },
        showlegend: true,
        legend: {
          orientation: 'h',
          y: -0.2,
          x: 0.5,
          xanchor: 'center',
          font: { size: 10 },
          bgcolor: 'rgba(255,255,255,0.8)',
          bordercolor: '#e2e8f0',
          borderwidth: 1
        },
        margin: { t: 60, b: 80, l: 40, r: 40 },
        hoverlabel: baseLayout.hoverlabel
      });

      // Gestion responsive
      const handleResize = () => {
        const ids = ['plotly-age', 'plotly-infra', 'plotly-housing', 'plotly-economy'];
        ids.forEach(id => {
          Plotly.relayout(id, {
            width: undefined,
            height: undefined,
            'xaxis.automargin': true,
            'yaxis.automargin': true
          });
        });
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, 150); // léger délai pour assurer que le DOM est prêt

    return () => clearTimeout(timer);
  }, [chartData]);

  return <div ref={containerRef} dangerouslySetInnerHTML={{ __html: reportHTML }} />;
};

export default ReportViewer;