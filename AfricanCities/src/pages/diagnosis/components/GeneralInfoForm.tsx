import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "../../../component/ui/card";
import { Input } from "../../../component/ui/input";
import { Label } from "../../../component/ui/label";
import type { UseFormRegister } from "react-hook-form";
import type { FormData } from "../types";

interface GeneralInfoFormProps {
  register: UseFormRegister<FormData>;
}

export function GeneralInfoForm({ register }: GeneralInfoFormProps) {
  const { t } = useTranslation();
  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-medium text-gray-800">
          {t('diagnostic.general.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <Label htmlFor="city" className="text-xs text-gray-600">
              {t('diagnostic.form.city_name')} *
            </Label>
            <Input id="city" {...register("city")} className="h-9 text-sm" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="country" className="text-xs text-gray-600">
              {t('diagnostic.form.country')} *
            </Label>
            <Input id="country" {...register("country")} className="h-9 text-sm" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="region" className="text-xs text-gray-600">
              {t('diagnostic.form.region')}
            </Label>
            <Input id="region" {...register("region")} className="h-9 text-sm" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="diagnostic_date" className="text-xs text-gray-600">
              {t('diagnostic.form.diagnostic_date')}
            </Label>
            <Input id="diagnostic_date" type="date" {...register("diagnostic_date")} className="h-9 text-sm" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="population_total" className="text-xs text-gray-600">
              {t('diagnostic.form.population')}
            </Label>
            <Input id="population_total" type="number" {...register("population_total")} className="h-9 text-sm" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="area_km2" className="text-xs text-gray-600">
              {t('diagnostic.form.area')}
            </Label>
            <Input id="area_km2" type="number" {...register("area_km2")} className="h-9 text-sm" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="population_density" className="text-xs text-gray-600">
              {t('diagnostic.form.population_density')}
            </Label>
            <Input id="population_density" type="number" {...register("population_density")} className="h-9 text-sm" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}