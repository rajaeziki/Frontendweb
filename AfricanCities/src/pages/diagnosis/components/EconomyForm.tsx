import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../component/ui/card";
import { Input } from "../../../component/ui/input";
import { Label } from "../../../component/ui/label";
import { TrendingUp } from "lucide-react";
import type { UseFormRegister } from "react-hook-form";
import type { FormData } from "../types";

interface EconomyFormProps {
  register: UseFormRegister<FormData>;
}

export function EconomyForm({ register }: EconomyFormProps) {
  const { t } = useTranslation();
  return (
    <Card className="border-t-4 border-t-rose-600">
      <CardHeader>
        <div className="flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-rose-600" />
          <CardTitle>{t('dimensions.economy.title', 'Économie')} (15 indicateurs)</CardTitle>
        </div>
        <CardDescription>
          {t('dimensions.economy.description', 'Emploi, croissance, investissements, revenus')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="unemployment_rate">{t('dimensions.economy.fields.unemployment_rate', 'Taux chômage urbain (%)')}</Label>
            <Input id="unemployment_rate" type="number" {...register("unemployment_rate")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="youth_unemployment">{t('dimensions.economy.fields.youth_unemployment', 'Taux chômage jeunes (%)')}</Label>
            <Input id="youth_unemployment" type="number" {...register("youth_unemployment")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="female_labor_participation">{t('dimensions.economy.fields.female_labor_participation', 'Participation féminine (%)')}</Label>
            <Input id="female_labor_participation" type="number" {...register("female_labor_participation")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="formal_employment_rate">{t('dimensions.economy.fields.formal_employment_rate', 'Taux emploi formel (%)')}</Label>
            <Input id="formal_employment_rate" type="number" {...register("formal_employment_rate")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gdp_per_capita">{t('dimensions.economy.fields.gdp_per_capita', 'PIB par habitant (USD)')}</Label>
            <Input id="gdp_per_capita" type="number" {...register("gdp_per_capita")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gdp_growth_rate">{t('dimensions.economy.fields.gdp_growth_rate', 'Croissance PIB local (%)')}</Label>
            <Input id="gdp_growth_rate" type="number" step="0.1" {...register("gdp_growth_rate")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fdi_attractiveness">{t('dimensions.economy.fields.fdi_attractiveness', 'Attractivité investissements (nb projets FDI)')}</Label>
            <Input id="fdi_attractiveness" type="number" {...register("fdi_attractiveness")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="business_creation_rate">{t('dimensions.economy.fields.business_creation_rate', 'Taux création d\'entreprises')}</Label>
            <Input id="business_creation_rate" type="number" {...register("business_creation_rate")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="income_per_capita">{t('dimensions.economy.fields.income_per_capita', 'Revenu moyen par habitant (USD)')}</Label>
            <Input id="income_per_capita" type="number" {...register("income_per_capita")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="microcredit_access_rate">{t('dimensions.economy.fields.microcredit_access_rate', 'Accès au microcrédit (%)')}</Label>
            <Input id="microcredit_access_rate" type="number" {...register("microcredit_access_rate")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cost_of_living_index">{t('dimensions.economy.fields.cost_of_living_index', 'Indice coût de la vie')}</Label>
            <Input id="cost_of_living_index" type="number" {...register("cost_of_living_index")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="monetary_poverty_rate">{t('dimensions.economy.fields.monetary_poverty_rate', 'Taux pauvreté monétaire urbain (%)')}</Label>
            <Input id="monetary_poverty_rate" type="number" {...register("monetary_poverty_rate")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="green_digital_economy_share">{t('dimensions.economy.fields.green_digital_economy_share', 'Part économie verte/digitale (%)')}</Label>
            <Input id="green_digital_economy_share" type="number" {...register("green_digital_economy_share")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="informal_economy_share">{t('dimensions.economy.fields.informal_economy_share', 'Part économie informelle (%)')}</Label>
            <Input id="informal_economy_share" type="number" {...register("informal_economy_share")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tourism_revenue">{t('dimensions.economy.fields.tourism_revenue', 'Revenus touristiques (millions USD)')}</Label>
            <Input id="tourism_revenue" type="number" {...register("tourism_revenue")} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}