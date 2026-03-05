import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../component/ui/card";
import { Input } from "../../../component/ui/input";
import { Label } from "../../../component/ui/label";
import type { UseFormRegister } from "react-hook-form";
import type { FormData } from "../types";

interface SocietyFormProps {
  register: UseFormRegister<FormData>;
}

export function SocietyForm({ register }: SocietyFormProps) {
  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-medium text-gray-800">
          Société
        </CardTitle>
        <CardDescription className="text-xs text-gray-500">
          20 indicateurs · Éducation, santé, sécurité, inclusion sociale
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-1">
            <Label htmlFor="primary_school_enrollment" className="text-xs text-gray-600">Taux scolarisation primaire (%)</Label>
            <Input id="primary_school_enrollment" type="number" {...register("primary_school_enrollment")} className="h-9 text-sm" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="secondary_school_enrollment" className="text-xs text-gray-600">Taux scolarisation secondaire (%)</Label>
            <Input id="secondary_school_enrollment" type="number" {...register("secondary_school_enrollment")} className="h-9 text-sm" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="tertiary_enrollment" className="text-xs text-gray-600">Taux scolarisation supérieure (%)</Label>
            <Input id="tertiary_enrollment" type="number" {...register("tertiary_enrollment")} className="h-9 text-sm" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="adult_literacy_rate" className="text-xs text-gray-600">Taux alphabétisation adultes (%)</Label>
            <Input id="adult_literacy_rate" type="number" {...register("adult_literacy_rate")} className="h-9 text-sm" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="youth_literacy_rate" className="text-xs text-gray-600">Taux alphabétisation jeunes (%)</Label>
            <Input id="youth_literacy_rate" type="number" {...register("youth_literacy_rate")} className="h-9 text-sm" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="gender_parity_index" className="text-xs text-gray-600">Indice de parité des genres</Label>
            <Input id="gender_parity_index" type="number" step="0.01" {...register("gender_parity_index")} className="h-9 text-sm" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="crime_rate" className="text-xs text-gray-600">Taux criminalité (pour 1000 hab.)</Label>
            <Input id="crime_rate" type="number" step="0.1" {...register("crime_rate")} className="h-9 text-sm" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="safety_perception" className="text-xs text-gray-600">Perception sécurité (%)</Label>
            <Input id="safety_perception" type="number" {...register("safety_perception")} className="h-9 text-sm" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="healthcare_access" className="text-xs text-gray-600">Accès soins de base (%)</Label>
            <Input id="healthcare_access" type="number" {...register("healthcare_access")} className="h-9 text-sm" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="doctors_per_10000" className="text-xs text-gray-600">Médecins pour 10 000 hab.</Label>
            <Input id="doctors_per_10000" type="number" step="0.1" {...register("doctors_per_10000")} className="h-9 text-sm" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="hospital_beds_per_10000" className="text-xs text-gray-600">Lits d'hôpital pour 10 000 hab.</Label>
            <Input id="hospital_beds_per_10000" type="number" step="0.1" {...register("hospital_beds_per_10000")} className="h-9 text-sm" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="life_expectancy" className="text-xs text-gray-600">Espérance de vie (ans)</Label>
            <Input id="life_expectancy" type="number" {...register("life_expectancy")} className="h-9 text-sm" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="infant_mortality" className="text-xs text-gray-600">Mortalité infantile (‰)</Label>
            <Input id="infant_mortality" type="number" {...register("infant_mortality")} className="h-9 text-sm" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="maternal_mortality" className="text-xs text-gray-600">Mortalité maternelle (pour 100k)</Label>
            <Input id="maternal_mortality" type="number" {...register("maternal_mortality")} className="h-9 text-sm" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="vaccination_rate" className="text-xs text-gray-600">Taux vaccination DTP3 (%)</Label>
            <Input id="vaccination_rate" type="number" {...register("vaccination_rate")} className="h-9 text-sm" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="malnutrition_rate" className="text-xs text-gray-600">Taux malnutrition infantile (%)</Label>
            <Input id="malnutrition_rate" type="number" {...register("malnutrition_rate")} className="h-9 text-sm" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="urban_poverty_rate" className="text-xs text-gray-600">Taux pauvreté urbaine (%)</Label>
            <Input id="urban_poverty_rate" type="number" {...register("urban_poverty_rate")} className="h-9 text-sm" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="social_inclusion_index" className="text-xs text-gray-600">Indice inclusion sociale (%)</Label>
            <Input id="social_inclusion_index" type="number" {...register("social_inclusion_index")} className="h-9 text-sm" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="community_participation_rate" className="text-xs text-gray-600">Participation communautaire (%)</Label>
            <Input id="community_participation_rate" type="number" {...register("community_participation_rate")} className="h-9 text-sm" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="social_protection_coverage" className="text-xs text-gray-600">Couverture protection sociale (%)</Label>
            <Input id="social_protection_coverage" type="number" {...register("social_protection_coverage")} className="h-9 text-sm" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}