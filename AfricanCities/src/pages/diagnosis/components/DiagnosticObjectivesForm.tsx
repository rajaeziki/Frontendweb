import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "../../../component/ui/card";
import { Textarea } from "../../../component/ui/textarea";
import { Label } from "../../../component/ui/label";
import type { UseFormRegister } from "react-hook-form";
import type { FormData } from "../types";

interface DiagnosticObjectivesFormProps {
  register: UseFormRegister<FormData>;
}

export function DiagnosticObjectivesForm({ register }: DiagnosticObjectivesFormProps) {
  const { t } = useTranslation();
  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-medium text-gray-800">
          {t('diagnostic.objectives.title', 'Objectifs du diagnostic')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="diagnostic_type" className="text-xs text-gray-600">
              {t('diagnostic.objectives.type', 'Type de diagnostic')}
            </Label>
            <select
              id="diagnostic_type"
              {...register("diagnostic_type")}
              className="w-full h-9 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Diagnostic complet 80+ indicateurs">
                {t('diagnostic.objectives.options.complete', 'Diagnostic complet 80+ indicateurs')}
              </option>
              <option value="Diagnostic accéléré">
                {t('diagnostic.objectives.options.accelerated', 'Diagnostic accéléré')}
              </option>
              <option value="Diagnostic thématique">
                {t('diagnostic.objectives.options.thematic', 'Diagnostic thématique')}
              </option>
              <option value="Mise à jour diagnostique">
                {t('diagnostic.objectives.options.update', 'Mise à jour diagnostique')}
              </option>
            </select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="diagnostic_objective" className="text-xs text-gray-600">
              {t('diagnostic.objectives.specific', 'Objectif spécifique')}
            </Label>
            <Textarea
              id="diagnostic_objective"
              {...register("diagnostic_objective")}
              className="min-h-[80px] text-sm border-gray-300"
              placeholder={t('diagnostic.objectives.specific_placeholder', 'Objectifs poursuivis, utilisations prévues du diagnostic...')}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="additional_comments" className="text-xs text-gray-600">
              {t('diagnostic.objectives.comments', 'Commentaires additionnels')}
            </Label>
            <Textarea
              id="additional_comments"
              {...register("additional_comments")}
              className="min-h-[80px] text-sm border-gray-300"
              placeholder={t('diagnostic.objectives.comments_placeholder', 'Contexte particulier, défis spécifiques, projets en cours...')}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}