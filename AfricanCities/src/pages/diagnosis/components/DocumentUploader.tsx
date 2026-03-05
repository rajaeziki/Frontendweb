import { Button } from "../../../component/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../component/ui/card";
import { Label } from "../../../component/ui/label";
import type { DocumentContent } from "../types";

interface DocumentUploaderProps {
  documents: DocumentContent[];
  uploadProgress: {[key: string]: number};
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveDocument: (filename: string) => void;
}

export function DocumentUploader({
  documents,
  uploadProgress,
  fileInputRef,
  onFileUpload,
  onRemoveDocument
}: DocumentUploaderProps) {
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="sticky top-4 border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-medium text-gray-800">
          Import de documents
        </CardTitle>
        <CardDescription className="text-xs text-gray-500">
          Formats acceptés : PDF, Images, Excel, CSV, GeoJSON
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div
            className="border border-gray-300 border-dashed rounded-lg p-6 text-center hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={handleClick}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.webp,.xlsx,.xls,.csv,.geojson,.json"
              onChange={onFileUpload}
              className="hidden"
            />
            <p className="text-sm font-medium text-gray-700">Cliquez pour parcourir</p>
            <p className="text-xs text-gray-500 mt-1">
              PDF, JPEG, PNG, XLSX, CSV, GeoJSON
            </p>
          </div>

          {Object.keys(uploadProgress).length > 0 && (
            <div className="space-y-2">
              {Object.entries(uploadProgress).map(([filename, progress]) => (
                <div key={filename} className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span className="truncate max-w-[150px]">{filename}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {documents.length > 0 && (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              <Label className="text-xs font-medium text-gray-700">
                Documents chargés ({documents.length})
              </Label>
              {documents.map((doc) => (
                <div
                  key={doc.filename}
                  className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded group"
                >
                  <span className="text-gray-600 text-xs">
                    {doc.type === 'pdf' ? 'PDF' :
                     doc.type === 'image' ? 'IMG' :
                     doc.type === 'excel' ? 'XLS' :
                     doc.type === 'geojson' ? 'GEO' : 'TXT'}
                  </span>
                  <span className="flex-1 truncate text-xs text-gray-700">{doc.filename}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 text-gray-500 hover:text-red-600"
                    onClick={() => onRemoveDocument(doc.filename)}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200">
            <div className="text-xs text-center p-2 bg-gray-100 rounded text-gray-700">
              PDF: {documents.filter(d => d.type === 'pdf').length}
            </div>
            <div className="text-xs text-center p-2 bg-gray-100 rounded text-gray-700">
              Images: {documents.filter(d => d.type === 'image').length}
            </div>
            <div className="text-xs text-center p-2 bg-gray-100 rounded text-gray-700">
              Excel: {documents.filter(d => d.type === 'excel').length}
            </div>
            <div className="text-xs text-center p-2 bg-gray-100 rounded text-gray-700">
              GeoJSON: {documents.filter(d => d.type === 'geojson').length}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}