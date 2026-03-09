import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../component/ui/card";
import type { Dimension } from "../types";

interface DimensionNavigationProps {
  dimensions: (Dimension & { nameKey: string })[]; // On suppose que chaque dimension a une clé de traduction pour son nom
  activeDimension: string;
  onDimensionChange: (dimensionId: string) => void;
}

export function DimensionNavigation({
  dimensions,
  activeDimension,
  onDimensionChange
}: DimensionNavigationProps) {
  const { t } = useTranslation();

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{t('diagnostic.dimensions.navigation_title')}</CardTitle>
        <CardDescription>
          {t('diagnostic.dimensions.navigation_description')}
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
                <div className="text-xs font-medium text-center">
                  {t(dim.nameKey)}
                </div>
                <div className="text-xs text-muted-foreground text-center mt-1">
                  {t('diagnostic.indicators', { count: dim.indicators })}
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}