import { useTranslation } from 'react-i18next';
import { Button } from "../../../component/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../component/ui/card";
import type { WebData } from "../types";

interface ExternalSourcesBarProps {
  enableWorldBank: boolean;
  setEnableWorldBank: (value: boolean) => void;
  enableSDG: boolean;
  setEnableSDG: (value: boolean) => void;
  enableWebSearch: boolean;
  setEnableWebSearch: (value: boolean) => void;
  webData: WebData | null;
  city: string;
}

export function ExternalSourcesBar({
  enableWorldBank,
  setEnableWorldBank,
  enableSDG,
  setEnableSDG,
  enableWebSearch,
  setEnableWebSearch,
  webData,
  city
}: ExternalSourcesBarProps) {
  const { t } = useTranslation();
  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium text-gray-800">
          {t('diagnostic.sources.title', 'Sources externes intégrées')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          {/* Banque Mondiale */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700">{t('diagnostic.sources.worldBank', 'Banque Mondiale')}</span>
            <Button
              variant={enableWorldBank ? "default" : "outline"}
              size="sm"
              onClick={() => setEnableWorldBank(!enableWorldBank)}
              className={`h-7 px-3 text-xs ${
                enableWorldBank ? "bg-amber-500 text-white hover:bg-amber-600" : ""
              }`}
            >
              {enableWorldBank ? t('common.enabled', 'Activée') : t('common.disabled', 'Désactivée')}
            </Button>
          </div>

          {/* SDG */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700">{t('diagnostic.sources.sdg', 'SDG')}</span>
            <Button
              variant={enableSDG ? "default" : "outline"}
              size="sm"
              onClick={() => setEnableSDG(!enableSDG)}
              className={`h-7 px-3 text-xs ${
                enableSDG ? "bg-amber-500 text-white hover:bg-amber-600" : ""
              }`}
            >
              {enableSDG ? t('common.enabled', 'Activés') : t('common.disabled', 'Désactivés')}
            </Button>
          </div>

          {/* Wikipedia */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700">{t('diagnostic.sources.wikipedia', 'Wikipedia')}</span>
            <Button
              variant={enableWebSearch ? "default" : "outline"}
              size="sm"
              onClick={() => setEnableWebSearch(!enableWebSearch)}
              className={`h-7 px-3 text-xs ${
                enableWebSearch ? "bg-amber-500 text-white hover:bg-amber-600" : ""
              }`}
            >
              {enableWebSearch ? t('common.enabled', 'Activée') : t('common.disabled', 'Désactivée')}
            </Button>
          </div>
        </div>

        {/* Informations supplémentaires */}
        {webData?.world_bank_data && (
          <div className="mt-4 text-xs bg-gray-100 text-gray-700 px-3 py-2 rounded-md">
            {t('diagnostic.sources.worldBankData', { count: webData.world_bank_data.country_data.length })}
          </div>
        )}
        {webData?.wikipedia_info?.found && (
          <div className="mt-2 text-xs bg-gray-100 text-gray-700 px-3 py-2 rounded-md">
            {t('diagnostic.sources.wikipediaData', { city })}
          </div>
        )}
        {enableSDG && (
          <div className="mt-2 text-xs bg-gray-100 text-gray-700 px-3 py-2 rounded-md">
            {t('diagnostic.sources.sdgData')}
          </div>
        )}
      </CardContent>
    </Card>
  );
}