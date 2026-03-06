// pages/About.tsx
import React, { useState, useEffect } from 'react'; // ← ajout des hooks
import { Link } from 'wouter';
import { Users, Globe, Sparkles, Instagram, Clock, Building, CheckCircle } from 'lucide-react';
import logo from "../assets/logo.jpeg";

// ... (partners, inchangé)

const About: React.FC = () => {
  // 1. État pour détecter le scroll
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 font-sans text-gray-800">
      {/* 2. Header identique à celui de Home */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-lg py-2' 
          : 'bg-transparent py-4'
      }`}>
        <nav className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-200/50 to-amber-200/50 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-amber-100/30 to-amber-100/30 rounded-2xl blur-md" />
              <div className={`relative p-3 rounded-2xl shadow-xl border transition-all duration-300 ${
                isScrolled 
                  ? 'bg-white border-gray-200' 
                  : 'bg-white/90 backdrop-blur-sm border-white/60'
              } group-hover:shadow-2xl`}>
                <img
                  src={logo}
                  alt="AfricanCities AI Logo"
                  className="h-12 w-auto object-contain drop-shadow-md"
                />
              </div>
            </Link>

            <ul className="flex space-x-8 text-sm font-medium tracking-wider">
              <li>
                <Link 
                  href="/" 
                  className={`transition-colors ${
                    isScrolled ? 'text-gray-800 hover:text-amber-500' : 'text-white hover:text-amber-400'
                  }`}
                >
                  HOME
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className={`transition-colors ${
                    isScrolled ? 'text-gray-800 hover:text-amber-500' : 'text-white hover:text-amber-400'
                  }`}
                >
                  ABOUT
                </Link>
              </li>
              <li>
                <Link 
                  href="/diagnosis" 
                  className={`transition-colors ${
                    isScrolled ? 'text-gray-800 hover:text-amber-500' : 'text-white hover:text-amber-400'
                  }`}
                >
                  DIAGNOSTIC
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className={`transition-colors ${
                    isScrolled ? 'text-gray-800 hover:text-amber-500' : 'text-white hover:text-amber-400'
                  }`}
                >
                  CONTACT
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      {/* 3. Main avec padding-top pour compenser le header fixe */}
      <main className="pt-20">
        {/* Hero Section avec -mt-20 pour remonter sous le header */}
        <section className="relative h-[60vh] flex items-center justify-center overflow-hidden -mt-20">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-black/50 z-10"></div>
            <img 
              src="/Kinshasa.jpg" 
              alt="Futuristic African city"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-20 text-center text-white max-w-4xl mx-auto px-6">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <p className="text-amber-400 font-light mb-12">
                NOTRE MISSION
              </p>
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-white font-normal">
              Jouer la ville. Transformer les infrastructures urbaines en plateformes interactives.
            </p>
          </div>
        </section>
        

        {/* Notre parcours */}
        <section className="py-20 bg-gradient-to-br from-amber-50/30 to-purple-50/30">
          <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                Notre <span className="text-amber-500">parcours</span>
              </h2>
              <div className="space-y-4 text-gray-600 text-lg">
                <p>
                  <span className="font-semibold text-amber-600">AfricanCities AI</span> vise à faire revivre et à faire évoluer la culture urbaine : 
                  concevoir des expériences engageantes centrées sur l'humain grâce à la technologie, l'empathie et la créativité.
                </p>
                <p>
                  En tant que design thinkers, nous croyons au mantra de la création d'interactions humaines 
                  sans friction et joyeuses pour le public. En tant qu'humains, nous croyons aussi à la construction 
                  d'un monde durable pour les générations futures.
                </p>
                <p>
                  En 2016, les Nations Unies rapportaient que plus de la moitié de la population mondiale vivait 
                  dans des villes, et ce chiffre ne cesse de croître. La densité humaine croissante dans les zones 
                  urbaines entraîne une utilisation plus fréquente des services et produits urbains publics et 
                  davantage d'interactions avec les infrastructures urbaines.
                </p>
                <p>
                  L'équipe multidisciplinaire d'AfricanCities AI travaille dur pour atténuer les problèmes 
                  d'urbanisation massive, renforçant le rôle crucial des technologies embarquées et des infrastructures 
                  intelligentes dans la construction de nos vies dans les villes du futur.
                </p>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 group">
  <img 
    src="/MrSayed.png" 
    alt="Dr. Seyid Abdellahi EBNOU ABDEM"
    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
  />
  {/* Overlay gradient */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
  {/* Contenu texte */}
  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
    <h3 className="text-2xl font-bold mb-1">Dr. Seyid Abdellahi EBNOU ABDEM</h3>
    <p className="text-amber-300 font-medium text-sm mb-2">PhD in Statistics</p>
    <p className="text-sm text-white/90 leading-tight">
      Spécialisé en statistique appliquée, data science, probabilités et villes intelligentes
    </p>
    <p className="text-xs text-white/70 mt-2"> Chef de projet AfricanCities Ai Services ,Research Scientist</p>
  </div>
</div>
          </div>
        </section>

        {/* NOUVELLE SECTION : Project Summary */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                Project <span className="text-amber-500">Summary</span>
              </h2>
              <p className="text-2xl font-light text-amber-600 mb-8">
                AfricanCities IA Services : L'IA au service du diagnostic urbain pour les villes africaines
              </p>
              <div className="prose prose-lg text-gray-600 space-y-6">
                <p>
                  L'urbanisation rapide de l'Afrique exige des solutions intelligentes. De nombreuses villes sont confrontées à des défis majeurs en matière de logement, d'infrastructures et de climat, et manquent d'outils accessibles pour planifier efficacement.
                </p>
                <p>
                  AfricanCities IA Services propose un assistant IA innovant qui fournit des diagnostics urbains rapides et confidentiels. En seulement 5 minutes, les villes peuvent évaluer leur potentiel "smart city", recevoir des recommandations personnalisées axées sur l'impact et se comparer à des villes similaires. Notre plateforme comprend un tableau de bord interactif, des rapports PDF détaillés et un chatbot IA urbain pour des analyses stratégiques et des scénarios "what-if".
                </p>
                <p>
                  Cet outil offre aux municipalités des données rapides, abordables et fiables, les aidant à prioriser les investissements dans le logement, l'eau, les transports et l'énergie. Il renforce les capacités locales, améliore leur visibilité pour le financement et permet de suivre les progrès au fil du temps.
                </p>
                <p>
                  Notre vision est de nous étendre sur tout le continent, en créant une base de données unique de villes africaines intelligentes et en contribuant à un indice continental du développement urbain durable et inclusif.
                </p>
                <p className="font-semibold text-gray-800">
                  AfricanCities IA Services transforme la manière dont les villes africaines planifient et se développent, en favorisant des décisions basées sur les données pour un avenir urbain meilleur.
                </p>
              </div>

              {/* Metadata (Duration, Partners, Status) */}
              
            
              
              
            </div>
          </div>
        </section>

        
        
      </main>

      {/* Footer avec navigation */}
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
              Can't wait? to set up a pilot program.
            </p>
            <div className="flex items-center justify-center gap-4 mt-2 text-sm text-white/80">
              <span>Benguerir</span>
              <span>|</span>
              <span>contact.cus@um6p.ma</span>
              <span>|</span>
              <Link href="/privacy" className="hover:text-amber-300 transition-colors">
                Privacy Policy
              </Link>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <Link
                href="/contact"
                className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-8 py-3 rounded-full shadow-md hover:shadow-lg transition duration-300 inline-block"
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

export default About;