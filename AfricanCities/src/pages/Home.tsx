import { LayoutShell } from "../component/layout-shell";
import { Button } from "../component/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../component/ui/card";
import { useUrbanReports } from "../hooks/use-urban-report";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { 
  MessageSquare, 
  FileText, 
  ArrowRight, 
  Loader2, 
  BarChart3, 
  Plus,
  MapPin,
  Building2,
  Globe2,
  Sparkles,
  Layers
} from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Home() {
  const { data: reports, isLoading } = useUrbanReports();
  const [, setLocation] = useLocation();
  useEffect(() => {
  let userId = localStorage.getItem("urban_user_id");

  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem("urban_user_id", userId);
  }
}, []);
const handleDiagnosisAccess = () => {
  const count = parseInt(localStorage.getItem("diagnosis_count") || "0");

  localStorage.setItem("diagnosis_count", (count + 1).toString());


};
const handleCoachAccess = () => {
  const count = parseInt(localStorage.getItem("coach_count") || "0");

  localStorage.setItem("coach_count", (count + 1).toString());

  
};
  // Helper function to render the reports section content
  const renderReportsContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
        </div>
      );
    }

    if (reports && reports.length > 0) {
      return (
        <div className="grid md:grid-cols-3 gap-4">
          {reports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/diagnosis?id=${report.id}`}>
                <Card className="hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-amber-500 hover:border-l-amber-600 group">
                  <CardHeader className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg font-serif text-gray-800">{report.city}</CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {report.country}
                        </CardDescription>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                        <FileText className="w-4 h-4 text-amber-700" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-xs text-gray-500">
                      Généré le {new Date(report.createdAt!).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      );
    }

    return (
      <div className="text-center py-16 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-dashed border-amber-200">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-amber-200 rounded-full blur-3xl opacity-30"></div>
          <FileText className="w-16 h-16 text-amber-300 mx-auto mb-4 relative z-10" />
        </div>
        <h3 className="text-gray-700 font-medium text-lg mb-2">Aucun rapport généré</h3>
        <p className="text-sm text-gray-500 mb-6">Commencez votre première analyse urbaine.</p>
        <Link href="/diagnosis">
          <Button className="bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/20">
            <Plus className="w-4 h-4 mr-2" />
            Créer un rapport
          </Button>
        </Link>
        
      </div>
    );
  };

  return (
    <LayoutShell>
      <div className="space-y-8">
        {/* Header with Logo Style */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">AfricanCities AI Services</h1>
                <p className="text-sm text-gray-500 tracking-wide">CENTRE OF URBAN SYSTEMS</p>
              </div>
            </div>
          </div>
          
          {/* Stats Badge */}
          <div className="hidden md:flex items-center gap-4">
            
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
              <Globe2 className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Afrique</span>
            </div>
          </div>
        </div>

        {/* Welcome Section - Redesigned */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-8 md:p-10 shadow-2xl">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-medium tracking-wider text-amber-400 uppercase">Tableau de Bord</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              Centre des Systèmes Urbains - UM6P
            </h1>
            
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Accédez à vos outils d'analyse urbaine intelligente et optimisez vos prises de décision.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link href="/diagnosis">
  <Button 
    
    size="lg" 
    className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold shadow-lg shadow-amber-500/30 border-0 px-8"
  >
    <Plus className="w-5 h-5 mr-2" />
    Nouveau Diagnostic
  </Button>
</Link>
              <Link 
  href="/chat"

  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-2 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 backdrop-blur-sm px-8 h-11"
>
  <MessageSquare className="w-5 h-5 mr-2" />
  Ouvrir l'Assistant
</Link>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute bottom-0 right-0 p-8 opacity-20">
            <Layers className="w-32 h-32 text-white" />
          </div>
        </section>

        {/* Modules Grid - Enhanced */}
        <section className="grid md:grid-cols-2 gap-6">
          <motion.div 
            whileHover={{ y: -5, scale: 1.02 }} 
            transition={{ duration: 0.2 }}
            className="relative group"
          >
            <Link href="/chat">
              <Card className="h-full cursor-pointer hover:border-amber-300 transition-all group overflow-hidden relative bg-gradient-to-br from-white to-amber-50/30 border-2 border-transparent hover:border-amber-200">
                {/* Decorative gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Icon background */}
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <MessageSquare className="w-32 h-32 text-amber-600" />
                </div>
                
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="font-bold text-2xl text-gray-800">
                      Assistant Urbain
                    </CardTitle>
                  </div>
                  <CardDescription className="text-base text-gray-600">
                    Chatbot IA spécialisé en développement urbain africain.
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-3 text-gray-600">
                      <span className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      </span>
                      Réponses contextuelles
                    </li>
                    <li className="flex items-center gap-3 text-gray-600">
                      <span className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      </span>
                      Suggestions stratégiques
                    </li>
                    <li className="flex items-center gap-3 text-gray-600">
                      <span className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      </span>
                      Historique des conversations
                    </li>
                  </ul>
                  
                  <div className="mt-6 flex items-center text-amber-600 font-medium text-sm group-hover:translate-x-2 transition-transform">
                    Accéder à l'assistant <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5, scale: 1.02 }} 
            transition={{ duration: 0.2 }}
            className="relative group"
          >
            <Link href="/diagnosis">
              <Card className="h-full cursor-pointer hover:border-amber-300 transition-all group overflow-hidden relative bg-gradient-to-br from-white to-blue-50/30 border-2 border-transparent hover:border-amber-200">
                {/* Decorative gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Icon background */}
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <BarChart3 className="w-32 h-32 text-blue-600" />
                </div>
                
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="font-bold text-2xl text-gray-800">
                      Diagnostic Intelligent
                    </CardTitle>
                  </div>
                  <CardDescription className="text-base text-gray-600">
                    Générez des rapports stratégiques complets.
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-3 text-gray-600">
                      <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      </span>
                      Analyse multi-sectorielle
                    </li>
                    <li className="flex items-center gap-3 text-gray-600">
                      <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      </span>
                      Intégration de documents PDF
                    </li>
                    <li className="flex items-center gap-3 text-gray-600">
                      <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      </span>
                      Génération automatique de rapports
                    </li>
                  </ul>
                  
                  <div className="mt-6 flex items-center text-blue-600 font-medium text-sm group-hover:translate-x-2 transition-transform">
                    Créer un diagnostic <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        </section>

        {/* Recent Reports Section - Enhanced */}
        <section className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Rapports Récents</h2>
            </div>
            <Link href="/diagnosis">
              <Button variant="ghost" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50">
                Voir tout <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          {renderReportsContent()}
        </section>
      </div>
    </LayoutShell>
  );
}