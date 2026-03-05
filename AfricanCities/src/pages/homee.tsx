import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';

import {
  ArrowRight, Target, GraduationCap,
  BookOpen, FileText, Map, Droplet, Leaf, Shield,
  Cpu, BarChart, Globe, Users,
  Clock, CheckCircle, Zap, MessageCircle,
  TrendingUp, DollarSign, Download, Eye, Layers,
  Building, Mail, Phone, Database
} from 'lucide-react';
import logo from "../assets/logo.jpeg";

const partners = [
  { id: 1, name: 'BMW Foundation' },
  { id: 2, name: 'SOSV' },
  { id: 3, name: 'National Geographic' },
  { id: 4, name: 'TVBS' },
  { id: 5, name: 'SXSW' },
  { id: 6, name: 'PSFK' },
  { id: 7, name: 'The Sydney Morning Herald' },
  { id: 8, name: 'Carey Institute' },
  { id: 9, name: 'Sencity' },
];

const cityImages = [
  { id: 1, url: '/dakar.jpg', alt: 'Dakar, Sénégal - Rue animée', city: 'Dakar' },
  { id: 2, url: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=2127', alt: 'Nairobi, Kenya - Quartier urbain', city: 'Nairobi' },
  { id: 3, url: '/Cap.jpg', alt: 'Cape Town, Afrique du Sud - Vue aérienne', city: 'Cape Town' },
  { id: 4, url: '/Morroco.jpg', alt: 'Lagos, Nigeria - Ville animée', city: 'Lagos' },
  { id: 5, url: '/Kinshasa.jpg', alt: 'Marrakech, Maroc - Médina', city: 'Marrakech' },
  { id: 6, url: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=2070', alt: 'Le Caire, Égypte - Pyramides et ville', city: 'Cairo' }
];

const projects = [
  { id: 1, icon: Map, title: "Urbain Data Hub" },
  { id: 2, icon: Map, title: "Application Mobilité" },
  { id: 3, icon: Map, title: "Micromobilité des golfettes" },
  { id: 4, icon: Leaf, title: "Grande Muraille Verte au Sénégal" },
  { id: 5, icon: MessageCircle, title: "Application de réclamation - Allo Mouatten" },
  { id: 6, icon: Droplet, title: "Détection et localisation des fuites d'eau" },
  { id: 7, icon: Shield, title: "Gestion des risques naturels" },
  { id: 8, icon: Building, title: "Lab Kinshasa Smart City" },
];

const sectionImages = [
  'https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=2070',
  'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2070',
  'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=2064',
  'https://images.unsplash.com/photo-1565049786474-1dea82a8b995?q=80&w=2070',
  'https://images.unsplash.com/photo-1542744094-3a31f272c2e0?q=80&w=2070',
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1974',
];

const Home: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % cityImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 bg-transparent">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-200/50 to-amber-200/50 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-amber-100/30 to-amber-100/30 rounded-2xl blur-md" />
              <div className="relative bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-xl border border-white/60 group-hover:shadow-2xl transition-all duration-500">
                <img
                  src={logo}
                  alt="AfricanCities AI Logo"
                  className="h-12 w-auto object-contain drop-shadow-md"
                />
              </div>
            </Link>

            <ul className="flex space-x-8 text-sm font-medium tracking-wider">
              <li><Link href="/" className="text-white hover:text-amber-400">HOME</Link></li>
              <li><Link href="/about" className="text-white hover:text-amber-400">ABOUT</Link></li>
              <li><Link href="/diagnosis" className="text-white hover:text-amber-400">DIAGNOSTIC</Link></li>
              <li><Link href="/contact" className="text-white hover:text-amber-400">CONTACT</Link></li>
            </ul>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section (inchangée) */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-black/50 z-10"></div>
            <img
              key={cityImages[currentImageIndex].id}
              src={cityImages[currentImageIndex].url}
              alt={cityImages[currentImageIndex].alt}
              className="w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
            />
          </div>
          <div className="relative z-20 text-center max-w-5xl mx-auto px-6">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <p className="text-amber-400 font-light mb-12">
                AfricanCities <span className="font-bold text-white">AI Services</span>
              </p>
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-white font-normal">
              Diagnostiquer, comprendre, transformer votre ville.
            </p>
            <Link
              href="/contact"
              className="group bg-amber-400 hover:bg-amber-500 text-white font-semibold px-10 py-4 rounded-full shadow-lg hover:shadow-xl transition duration-300 inline-flex items-center gap-2 text-lg"
            >
              Contact us
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
            {cityImages.map((image) => (
              <button
                key={image.id}
                onClick={() => setCurrentImageIndex(cityImages.findIndex(img => img.id === image.id))}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  cityImages[currentImageIndex].id === image.id ? 'w-6 bg-amber-400' : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Voir l'image de ${image.city}`}
              />
            ))}
          </div>
        </section>

        {/* Section 1 : Introduction (image à droite) */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                  AfricanCities <span className="text-amber-400">IA Services</span>
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Un diagnostic urbain complet en moins de 10 minutes.
                </p>
                <p className="text-gray-600 leading-relaxed"> AfricanCities IA Services transforme la manière dont les villes africaines planifient et se développent, en favorisant des décisions basées sur les données pour un avenir urbain meilleur.
                  Grâce à nos algorithmes, les municipalités obtiennent une vision claire de leurs défis et opportunités,
                  et passent rapidement à l'action avec des données probantes.
                </p>
              </div>
              <div className="flex-1">
                <img
                  src="/Picture1.png"
                  alt="Ville intelligente"
                  className="rounded-2xl shadow-xl w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 : Pourquoi (image à gauche) */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row-reverse items-center gap-12">
              <div className="flex-1">
                <h2 className="text-4xl font-bold mb-4 text-gray-900">Pourquoi AfricanCities IA Services ?</h2>
                <p className="text-xl text-gray-600 mb-8">Parce que les villes africaines méritent des diagnostics rapides et actionnables.</p>
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-amber-500 mb-2">60%</div>
                    <p className="text-sm text-gray-600">de la population africaine vivra en ville d'ici 2050</p>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-amber-500 mb-2">950M</div>
                    <p className="text-sm text-gray-600">nouveaux citadins d'ici 2050</p>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-amber-500 mb-2">3,5%</div>
                    <p className="text-sm text-gray-600">croissance urbaine annuelle</p>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-amber-500 mb-2">▲</div>
                    <p className="text-sm text-gray-600">pression sur les infrastructures</p>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Les diagnostics traditionnels sont trop lents et coûteux. Notre IA analyse des centaines de données en quelques minutes pour donner aux décideurs une vision claire et priorisée.
                </p>
              </div>
              <div className="flex-1">
                <img
                  src="/benin.jpg"
                  alt="Défis urbains"
                  className="rounded-2xl shadow-xl w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 : La solution (image à droite) */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <h2 className="text-4xl font-bold mb-4 text-gray-900">La solution : AfricanCities IA Services</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Une plateforme d'IA qui transforme des données brutes en un diagnostic urbain priorisé, prêt à l'emploi.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1">
                    <Zap className="w-4 h-4" /> 5 minutes
                  </span>
                  <span className="bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1">
                    <Database className="w-4 h-4" /> +65 indicateurs
                  </span>
                  <span className="bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" /> Scénarios financiers
                  </span>
                  <span className="bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Recommandations priorisées
                  </span>
                </div>
                <p className="mt-6 text-gray-600">
                  Nos algorithmes de machine learning croisent des données satellitaires, démographiques et économiques pour fournir aux municipalités un plan d'action clair, avec estimation des coûts et opportunités de financement.
                </p>
              </div>
              <div className="flex-1">
                <img
                  src="/dakar.jpg"
                  alt="Solution IA"
                  className="rounded-2xl shadow-xl w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 4 : Fonctionnalités clés (image à gauche) */}
        <section className="py-20 bg-gray-50">
  <div className="container mx-auto px-6">
    <div className="flex flex-col md:flex-row-reverse items-center gap-12">
      <div className="flex-1">
        <h2 className="text-4xl font-bold mb-8 text-gray-900">Fonctionnalités clés</h2>
        <p className="text-lg text-gray-600 mb-8">
          Des outils puissants pour diagnostiquer et planifier l'avenir de votre ville.
        </p>
        <div className="grid grid-cols-2 gap-6">
          {[
            { 
              icon: Clock, 
              label: "Diagnostic express", 
              desc: "Des indicateurs répartis sur toutes les dimensions urbaines." 
            },
            { 
              icon: BarChart, 
              label: "Score Smart City", 
              desc: "Notation de 0 à 100 avec benchmark automatique par rapport à des villes similaires en Afrique. Visualisation claire des forces et marges de progrès." 
            },
            { 
              icon: Download, 
              label: "Rapport PDF", 
              desc: "Interface interactive pour explorer les résultats, plus rapport PDF confidentiel prêt à partager avec les partenaires et bailleurs de fonds." 
            },
            { 
              icon: MessageCircle, 
              label: "Chatbot IA 24/7", 
              desc: "Assistant intelligent disponible 24/7 pour répondre aux questions techniques, proposer des stratégies adaptées et suggérer des exemples de villes similaires." 
            },
            { 
              icon: Zap, 
              label: "Scénarios what-if", 
              desc: "Simulez l'impact de différentes interventions urbaines : avant/après, coûts estimés, populations touchées, variation du score global." 
            },
            { 
              icon: Globe, 
              label: "Benchmarking", 
              desc: "Comparez votre ville à d'autres métropoles africaines et internationales pour identifier les meilleures pratiques et opportunités." 
            }
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
            >
              <div className="flex items-center gap-3 mb-3">
                <item.icon className="w-6 h-6 text-amber-400 flex-shrink-0" />
                <h3 className="font-bold text-gray-900">{item.label}</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1">
        <img
          src="/Morroco.jpg"
          alt="Fonctionnalités"
          className="rounded-2xl shadow-xl w-full h-auto object-cover"
        />
      </div>
    </div>
  </div>
</section>

        {/* Section 5 : Bénéfices concrets (image à droite) */}
       <section className="py-20 bg-gray-50">
  <div className="container mx-auto px-6">
    <div className="flex flex-col lg:flex-row items-center gap-12">
      {/* Colonne image */}
      <div className="flex-1 order-1 lg:order-2">
        <img
          src="/Cap.jpg"
          alt="Fonctionnalités clés"
          className="rounded-2xl shadow-xl w-full h-auto object-cover"
        />
      </div>

      {/* Colonne contenu */}
      <div className="flex-1 order-2 lg:order-1">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Bénéfices <span className="text-amber-500">concrets</span>
        </h2>
        

        {/* Grille 2 colonnes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            { icon: Clock, title: "Rapidité et simplicité", desc: "Fini les études qui prennent 6 mois et coûtent des dizaines de milliers de dollars. Avec AfricanCities IA, obtenez votre diagnostic complet en quelques minutes, pour un coût accessible même aux plus petites municipalités." },
            { icon: BarChart, title: "Préparation de projets financés", desc: "Les bailleurs de fonds exigent des dossiers solides avec indicateurs, scénarios et projections. Notre plateforme génère automatiquement tous les éléments nécessaires pour construire des propositions convaincantes et augmenter vos chances d'obtenir des financements." },
            { icon: Download, title: "Renforcement des capacités", desc: "Plus besoin de faire systématiquement appel à des consultants externes. Votre équipe municipale développe son autonomie et sa compréhension des enjeux urbains grâce aux outils de diagnostic, simulation et formation intégrés." },
            { icon: MessageCircle, title: "Suivi dans le temps", desc: "Comparez l'évolution de votre ville d'année en année. Mesurez l'impact réel de vos investissements. Démontrez les progrès accomplis aux citoyens et aux partenaires. Ajustez votre stratégie en continu." }
            
            
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-2">
                <item.icon className="w-5 h-5 text-amber-500" />
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>

        {/* Section 6 : Maturité et villes pilotes (image à droite) */}
        

        {/* Section 7 : Rejoignez le réseau (image à gauche) */}
    
      </main>

      {/* Footer */}
      <footer className="relative bg-white border-t border-gray-200 py-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=2070"
            alt="African city background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 z-10"></div>
        </div>
        <div className="relative z-20 container mx-auto px-6">
          <div className="flex flex-col items-center text-center gap-4 text-white">
            <p className="text-lg">
              Thank you for your interest in us. Our derivative websites will be launched soon, stay tuned!
            </p>
            <p className="text-lg">
              Can't wait? Set up a pilot program.
            </p>
            <div className="flex items-center justify-center gap-4 mt-2 text-sm text-white/80">
              <span>Benguerir</span>
              <span>|</span>
              <span>contact.cus@um6p.ma</span>
              <span>|</span>
              <Link href="/privacy" className="hover:text-amber-400 transition-colors">
                Privacy Policy
              </Link>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <Link
                href="/contact"
                className="bg-amber-400 hover:bg-amber-500 text-white font-medium px-8 py-3 rounded-full shadow-md hover:shadow-lg transition duration-300 inline-block"
              >
                CONTACT
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;