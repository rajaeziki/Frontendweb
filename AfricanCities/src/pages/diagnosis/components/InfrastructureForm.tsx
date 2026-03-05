import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../component/ui/card";
import { Input } from "../../../component/ui/input";
import { Label } from "../../../component/ui/label";
import { Zap } from "lucide-react";
import type { UseFormRegister } from "react-hook-form";
import type { FormData } from "../types";

interface InfrastructureFormProps {
  register: UseFormRegister<FormData>;
}

export function InfrastructureForm({ register }: InfrastructureFormProps) {
  return (
    <Card className="border-t-4 border-t-amber-600">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Zap className="w-5 h-5 text-amber-600" />
          <CardTitle>Infrastructures (13 indicateurs)</CardTitle>
        </div>
        <CardDescription>
          Routes, numérique, fiabilité des services
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="road_quality_percentage">Qualité des routes (% pavées)</Label>
            <Input id="road_quality_percentage" type="number" {...register("road_quality_percentage")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="road_length_per_capita">Longueur routes par habitant (km/1000 hab.)</Label>
            <Input id="road_length_per_capita" type="number" step="0.1" {...register("road_length_per_capita")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="internet_access">Accès Internet haut-débit (%)</Label>
            <Input id="internet_access" type="number" {...register("internet_access")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="broadband_speed">Vitesse Internet moyenne (Mbps)</Label>
            <Input id="broadband_speed" type="number" {...register("broadband_speed")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mobile_penetration">Taux pénétration mobile (%)</Label>
            <Input id="mobile_penetration" type="number" {...register("mobile_penetration")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="water_reliability">Fiabilité eau (heures coupure/semaine)</Label>
            <Input id="water_reliability" type="number" {...register("water_reliability")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="electricity_reliability">Fiabilité électricité (heures coupure/semaine)</Label>
            <Input id="electricity_reliability" type="number" {...register("electricity_reliability")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="public_transport_capacity">Capacité transport public (places/km/jour)</Label>
            <Input id="public_transport_capacity" type="number" {...register("public_transport_capacity")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="motorization_rate">Taux motorisation (véhicules/1000 hab.)</Label>
            <Input id="motorization_rate" type="number" {...register("motorization_rate")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accessibility_pmr">Accessibilité PMR (%)</Label>
            <Input id="accessibility_pmr" type="number" {...register("accessibility_pmr")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="drainage_coverage">Couverture drainage (%)</Label>
            <Input id="drainage_coverage" type="number" {...register("drainage_coverage")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="street_lighting_coverage">Éclairage public (%)</Label>
            <Input id="street_lighting_coverage" type="number" {...register("street_lighting_coverage")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="digital_services_index">Indice services numériques</Label>
            <Input id="digital_services_index" type="number" {...register("digital_services_index")} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}