import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../component/ui/card";
import { Input } from "../../../component/ui/input";
import { Label } from "../../../component/ui/label";
import { Map } from "lucide-react";
import type { UseFormRegister } from "react-hook-form";
import type { FormData } from "../types";

interface SpatialFormProps {
  register: UseFormRegister<FormData>;
}

export function SpatialForm({ register }: SpatialFormProps) {
  const { t } = useTranslation();
  return (
    <Card className="border-t-4 border-t-orange-600">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Map className="w-5 h-5 text-orange-600" />
          <CardTitle>{t('dimensions.spatial.title', 'Développement Spatial')} (11 indicateurs)</CardTitle>
        </div>
        <CardDescription>
          {t('dimensions.spatial.description', 'Densité, espaces verts, mobilité, planification')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="urban_density">{t('dimensions.spatial.fields.urban_density', 'Densité urbaine (hab/km²)')}</Label>
            <Input id="urban_density" type="number" {...register("urban_density")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="green_space_per_capita">{t('dimensions.spatial.fields.green_space_per_capita', 'Espaces verts (m²/hab)')}</Label>
            <Input id="green_space_per_capita" type="number" {...register("green_space_per_capita")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="public_transport_access">{t('dimensions.spatial.fields.public_transport_access', 'Accès transport public (%)')}</Label>
            <Input id="public_transport_access" type="number" {...register("public_transport_access")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="home_work_distance">{t('dimensions.spatial.fields.home_work_distance', 'Distance domicile-travail (km)')}</Label>
            <Input id="home_work_distance" type="number" step="0.1" {...register("home_work_distance")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="urbanization_rate">{t('dimensions.spatial.fields.urbanization_rate', 'Taux d\'urbanisation annuel (%)')}</Label>
            <Input id="urbanization_rate" type="number" step="0.1" {...register("urbanization_rate")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="planned_vs_informal_ratio">{t('dimensions.spatial.fields.planned_vs_informal_ratio', 'Quartiers planifiés (%)')}</Label>
            <Input id="planned_vs_informal_ratio" type="number" {...register("planned_vs_informal_ratio")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="functional_mix_index">{t('dimensions.spatial.fields.functional_mix_index', 'Indice mixité fonctionnelle (%)')}</Label>
            <Input id="functional_mix_index" type="number" {...register("functional_mix_index")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sports_cultural_access">{t('dimensions.spatial.fields.sports_cultural_access', 'Accès équipements sportifs/culturels (%)')}</Label>
            <Input id="sports_cultural_access" type="number" {...register("sports_cultural_access")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="walkability_score">{t('dimensions.spatial.fields.walkability_score', 'Score de marchabilité')}</Label>
            <Input id="walkability_score" type="number" {...register("walkability_score")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bike_lane_density">{t('dimensions.spatial.fields.bike_lane_density', 'Densité pistes cyclables (km/km²)')}</Label>
            <Input id="bike_lane_density" type="number" step="0.1" {...register("bike_lane_density")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="public_space_access">{t('dimensions.spatial.fields.public_space_access', 'Accès espaces publics (%)')}</Label>
            <Input id="public_space_access" type="number" {...register("public_space_access")} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}