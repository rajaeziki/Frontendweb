import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../component/ui/card";
import { Input } from "../../../component/ui/input";
import { Label } from "../../../component/ui/label";
import { TreePine } from "lucide-react";
import type { UseFormRegister } from "react-hook-form";
import type { FormData } from "../types";

interface EnvironmentFormProps {
  register: UseFormRegister<FormData>;
}

export function EnvironmentForm({ register }: EnvironmentFormProps) {
  const { t } = useTranslation();
  return (
    <Card className="border-t-4 border-t-green-600">
      <CardHeader>
        <div className="flex items-center gap-3">
          <TreePine className="w-5 h-5 text-green-600" />
          <CardTitle>{t('dimensions.environment.title', 'Environnement')} (14 indicateurs)</CardTitle>
        </div>
        <CardDescription>
          {t('dimensions.environment.description', 'Qualité de l\'air, déchets, climat, énergie')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="air_quality_pm25">{t('dimensions.environment.fields.air_quality_pm25', 'Qualité de l\'air (PM2.5 annuel)')}</Label>
            <Input id="air_quality_pm25" type="number" {...register("air_quality_pm25")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="air_quality_pm10">{t('dimensions.environment.fields.air_quality_pm10', 'Qualité de l\'air (PM10 annuel)')}</Label>
            <Input id="air_quality_pm10" type="number" {...register("air_quality_pm10")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="waste_collection_rate">{t('dimensions.environment.fields.waste_collection_rate', 'Taux collecte des déchets (%)')}</Label>
            <Input id="waste_collection_rate" type="number" {...register("waste_collection_rate")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="waste_recycling_rate">{t('dimensions.environment.fields.waste_recycling_rate', 'Taux recyclage des déchets (%)')}</Label>
            <Input id="waste_recycling_rate" type="number" {...register("waste_recycling_rate")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="waste_to_energy_rate">{t('dimensions.environment.fields.waste_to_energy_rate', 'Taux valorisation énergétique (%)')}</Label>
            <Input id="waste_to_energy_rate" type="number" {...register("waste_to_energy_rate")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sanitation_coverage">{t('dimensions.environment.fields.sanitation_coverage', 'Accès à l\'assainissement (%)')}</Label>
            <Input id="sanitation_coverage" type="number" {...register("sanitation_coverage")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="climate_vulnerability_index">{t('dimensions.environment.fields.climate_vulnerability_index', 'Indice vulnérabilité climatique')}</Label>
            <Input id="climate_vulnerability_index" type="number" {...register("climate_vulnerability_index")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="heatwave_days_per_year">{t('dimensions.environment.fields.heatwave_days_per_year', 'Jours de canicule par an')}</Label>
            <Input id="heatwave_days_per_year" type="number" {...register("heatwave_days_per_year")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="flood_risk_areas">{t('dimensions.environment.fields.flood_risk_areas', 'Zones inondables (%)')}</Label>
            <Input id="flood_risk_areas" type="number" {...register("flood_risk_areas")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="renewable_energy_share">{t('dimensions.environment.fields.renewable_energy_share', 'Part énergies renouvelables (%)')}</Label>
            <Input id="renewable_energy_share" type="number" {...register("renewable_energy_share")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="urban_deforestation_rate">{t('dimensions.environment.fields.urban_deforestation_rate', 'Taux déforestation urbaine (%)')}</Label>
            <Input id="urban_deforestation_rate" type="number" step="0.1" {...register("urban_deforestation_rate")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="climate_adaptation_plan">{t('dimensions.environment.fields.climate_adaptation_plan', 'Plan d\'adaptation climatique')}</Label>
            <Input id="climate_adaptation_plan" {...register("climate_adaptation_plan")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="biodiversity_index">{t('dimensions.environment.fields.biodiversity_index', 'Indice biodiversité')}</Label>
            <Input id="biodiversity_index" type="number" {...register("biodiversity_index")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="carbon_footprint_per_capita">{t('dimensions.environment.fields.carbon_footprint_per_capita', 'Empreinte carbone (tCO2/hab)')}</Label>
            <Input id="carbon_footprint_per_capita" type="number" step="0.1" {...register("carbon_footprint_per_capita")} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}