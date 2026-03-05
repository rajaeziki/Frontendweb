import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../component/ui/card";
import type { Dimension } from "../types";

interface DimensionNavigationProps {
  dimensions: Dimension[];
  activeDimension: string;
  onDimensionChange: (dimensionId: string) => void;
}

export function DimensionNavigation({
  dimensions,
  activeDimension,
  onDimensionChange
}: DimensionNavigationProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Navigation par dimension</CardTitle>
        <CardDescription>
          Cliquez sur une dimension pour accéder à ses indicateurs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {dimensions.map((dim) => {
            const Icon = dim.icon;
            return (
              <button
                key={dim.id}
                type="button"
                onClick={() => onDimensionChange(dim.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  activeDimension === dim.id
                    ? `${dim.bg} border-${dim.color.replace('text-', '')}`
                    : 'border-transparent hover:bg-muted/50'
                }`}
              >
                <Icon className={`w-6 h-6 mx-auto mb-2 ${dim.color}`} />
                <div className="text-xs font-medium text-center">{dim.name}</div>
                <div className="text-xs text-muted-foreground text-center mt-1">
                  {dim.indicators} indicateurs
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}