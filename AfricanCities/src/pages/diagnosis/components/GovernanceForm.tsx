import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../component/ui/card";
import { Input } from "../../../component/ui/input";
import { Label } from "../../../component/ui/label";
import { Scale } from "lucide-react";
import type { UseFormRegister } from "react-hook-form";
import type { FormData } from "../types";

interface GovernanceFormProps {
  register: UseFormRegister<FormData>;
}

export function GovernanceForm({ register }: GovernanceFormProps) {
  const { t } = useTranslation();
  return (
    <Card className="border-t-4 border-t-orange-600">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Scale className="w-5 h-5 text-orange-600" />
          <CardTitle>{t('dimensions.governance.title', 'Gouvernance')} (12 indicateurs)</CardTitle>
        </div>
        <CardDescription>
          {t('dimensions.governance.description', 'Transparence, participation, satisfaction citoyenne')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="corruption_index">{t('dimensions.governance.fields.corruption_index', 'Indice perception corruption')}</Label>
            <Input id="corruption_index" type="number" {...register("corruption_index")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="voter_turnout">{t('dimensions.governance.fields.voter_turnout', 'Taux participation électorale (%)')}</Label>
            <Input id="voter_turnout" type="number" {...register("voter_turnout")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="women_in_council">{t('dimensions.governance.fields.women_in_council', 'Femmes au conseil municipal (%)')}</Label>
            <Input id="women_in_council" type="number" {...register("women_in_council")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="youth_in_council">{t('dimensions.governance.fields.youth_in_council', 'Jeunes au conseil municipal (%)')}</Label>
            <Input id="youth_in_council" type="number" {...register("youth_in_council")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="elected_council_exists">{t('dimensions.governance.fields.elected_council_exists', 'Conseil municipal élu')}</Label>
            <select 
              id="elected_council_exists" 
              {...register("elected_council_exists")}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="Oui">{t('common.yes', 'Oui')}</option>
              <option value="Non">{t('common.no', 'Non')}</option>
              <option value="En partie">{t('common.partly', 'En partie')}</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="public_service_satisfaction">{t('dimensions.governance.fields.public_service_satisfaction', 'Satisfaction services publics (%)')}</Label>
            <Input id="public_service_satisfaction" type="number" {...register("public_service_satisfaction")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="open_data_access">{t('dimensions.governance.fields.open_data_access', 'Accès données ouvertes (%)')}</Label>
            <Input id="open_data_access" type="number" {...register("open_data_access")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="political_stability_index">{t('dimensions.governance.fields.political_stability_index', 'Indice stabilité politique')}</Label>
            <Input id="political_stability_index" type="number" {...register("political_stability_index")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="citizen_initiatives_supported">{t('dimensions.governance.fields.citizen_initiatives_supported', 'Initiatives citoyennes soutenues (nb/an)')}</Label>
            <Input id="citizen_initiatives_supported" type="number" {...register("citizen_initiatives_supported")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="budget_transparency">{t('dimensions.governance.fields.budget_transparency', 'Transparence budgétaire (%)')}</Label>
            <Input id="budget_transparency" type="number" {...register("budget_transparency")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="participatory_budgeting">{t('dimensions.governance.fields.participatory_budgeting', 'Budget participatif')}</Label>
            <select 
              id="participatory_budgeting" 
              {...register("participatory_budgeting")}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="Oui">{t('common.yes', 'Oui')}</option>
              <option value="Non">{t('common.no', 'Non')}</option>
              <option value="En test">{t('common.testing', 'En test')}</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="digital_governance_index">{t('dimensions.governance.fields.digital_governance_index', 'Indice gouvernance numérique')}</Label>
            <Input id="digital_governance_index" type="number" {...register("digital_governance_index")} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}