import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../component/ui/card";
import { Input } from "../../../component/ui/input";
import { Label } from "../../../component/ui/label";
import { Home } from "lucide-react";
import type { UseFormRegister } from "react-hook-form";
import type { FormData } from "../types";

interface HabitatFormProps {
  register: UseFormRegister<FormData>;
}

export function HabitatForm({ register }: HabitatFormProps) {
  const { t } = useTranslation();
  return (
    <Card className="border-t-4 border-t-emerald-600">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Home className="w-5 h-5 text-emerald-600" />
          <CardTitle>{t('dimensions.habitat.title', 'Habitat')} (14 indicateurs)</CardTitle>
        </div>
        <CardDescription>
          {t('dimensions.habitat.description', 'Logement, services de base, qualité de l\'habitat')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="water_access">{t('dimensions.habitat.fields.water_access', 'Accès eau potable (%)')}</Label>
            <Input id="water_access" type="number" {...register("water_access")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="water_quality">{t('dimensions.habitat.fields.water_quality', 'Qualité de l\'eau (%)')}</Label>
            <Input id="water_quality" type="number" {...register("water_quality")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="electricity_access">{t('dimensions.habitat.fields.electricity_access', 'Accès électricité (%)')}</Label>
            <Input id="electricity_access" type="number" {...register("electricity_access")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clean_cooking_fuels">{t('dimensions.habitat.fields.clean_cooking_fuels', 'Accès combustibles propres (%)')}</Label>
            <Input id="clean_cooking_fuels" type="number" {...register("clean_cooking_fuels")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="housing_overcrowding">{t('dimensions.habitat.fields.housing_overcrowding', 'Indice surpeuplement (pers/pièce)')}</Label>
            <Input id="housing_overcrowding" type="number" step="0.1" {...register("housing_overcrowding")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="informal_housing_percentage">{t('dimensions.habitat.fields.informal_housing_percentage', 'Habitat informel (%)')}</Label>
            <Input id="informal_housing_percentage" type="number" {...register("informal_housing_percentage")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="housing_cost_per_m2">{t('dimensions.habitat.fields.housing_cost_per_m2', 'Coût logement (USD/m²)')}</Label>
            <Input id="housing_cost_per_m2" type="number" {...register("housing_cost_per_m2")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="home_ownership_rate">{t('dimensions.habitat.fields.home_ownership_rate', 'Taux accession propriété (%)')}</Label>
            <Input id="home_ownership_rate" type="number" {...register("home_ownership_rate")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sanitation_access">{t('dimensions.habitat.fields.sanitation_access', 'Accès assainissement amélioré (%)')}</Label>
            <Input id="sanitation_access" type="number" {...register("sanitation_access")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wastewater_treatment">{t('dimensions.habitat.fields.wastewater_treatment', 'Traitement eaux usées (%)')}</Label>
            <Input id="wastewater_treatment" type="number" {...register("wastewater_treatment")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="homelessness_rate">{t('dimensions.habitat.fields.homelessness_rate', 'Taux sans-abrisme (%)')}</Label>
            <Input id="homelessness_rate" type="number" step="0.1" {...register("homelessness_rate")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="housing_satisfaction_rate">{t('dimensions.habitat.fields.housing_satisfaction_rate', 'Satisfaction logement (%)')}</Label>
            <Input id="housing_satisfaction_rate" type="number" {...register("housing_satisfaction_rate")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="housing_affordability_index">{t('dimensions.habitat.fields.housing_affordability_index', 'Indice abordabilité logement')}</Label>
            <Input id="housing_affordability_index" type="number" {...register("housing_affordability_index")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slum_population_percentage">{t('dimensions.habitat.fields.slum_population_percentage', 'Population en bidonville (%)')}</Label>
            <Input id="slum_population_percentage" type="number" {...register("slum_population_percentage")} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}