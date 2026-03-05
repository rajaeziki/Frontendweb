import { Building } from "lucide-react";
import { DIMENSIONS } from "../constants";

export function DiagnosisHeader() {
  return (
    <div className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-2xl p-8 mb-8 shadow-xl">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-white/20 rounded-xl backdrop-blur">
          <Building className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-serif font-bold">AfricanCities IA Services</h1>
          <p className="text-white/80 text-lg">Diagnostic Urbain Complet - 80+ Indicateurs avec intégration Banque Mondiale et SDG</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {DIMENSIONS.map(dim => (
          <span key={dim.id} className="text-xs bg-white/10 px-3 py-1 rounded-full">
            {dim.name} ({dim.indicators})
          </span>
        ))}
      </div>
    </div>
  );
}