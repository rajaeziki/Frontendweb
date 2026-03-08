// pages/About.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Users, Globe, Sparkles, Instagram, Clock, Building, CheckCircle } from 'lucide-react';
import logo from "../assets/logo.jpeg";

const About: React.FC = () => {
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
      {/* Header fixe (inchangé) */}
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

      <main className="pt-20">
        {/* Hero Section (inchangé) */}
        <section className="relative h-[60vh] flex items-center justify-center overflow-hidden -mt-20">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-black/50 z-10"></div>
            <img 
              src="/Kinshasa.jpg" 
              alt="Vue futuriste d'une ville africaine"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-20 text-center text-white max-w-4xl mx-auto px-6">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-amber-400 font-light block mb-12">
                NOTRE MISSION
              </span>
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-white font-normal">
              Jouer la ville. Transformer les infrastructures urbaines en plateformes interactives.
            </p>
          </div>
        </section>

        {/* Notre parcours - centré */}
        <section className="py-20 bg-gradient-to-br from-amber-50/30 to-purple-50/30">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center"> {/* centré + texte centré */}
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                Notre <span className="text-amber-500">parcours</span>
              </h2>
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
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
          </div>
        </section>

        {/* Section Expertise - centrée */}
        <section className="bg-white py-16 px-4 md:px-8">
          <div className="max-w-7xl mx-auto text-center"> {/* centrage du contenu */}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Une expertise multidisciplinaire de classe mondiale
            </h2>
            <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto"> {/* mx-auto pour centrer le paragraphe */}
              AfricanCities IA Services est propulsé par le Centre des Systèmes Urbains (CUS) de l'UM6P, 
              un pôle d'excellence dédié à l'innovation urbaine en Afrique.
            </p>

            {/* Image horizontale */}
            <div className="relative w-full h-64 md:h-99 mb-12 rounded-2xl overflow-hidden shadow-2xl bg-gray-100">
  <img 
    src="/CUS_teams.jpeg"
    alt="Équipe du CUS - AfricanCities IA Services"
    className="w-full h-full object-contain"  // object-contain au lieu de object-cover
  />
</div>

            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Les piliers d'impact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm text-left"> {/* on garde le texte à gauche pour lisibilité */}
                <h4 className="text-xl font-bold text-amber-600 mb-2">+20 experts de haut niveau</h4>
                <p className="text-gray-700">
                  Une équipe multinationale unissant l'IA, les statistiques, la spatial data science, 
                  l'architecture, la mobilité, le digital twin et la géomatique.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm text-left">
                <h4 className="text-xl font-bold text-amber-600 mb-2">Rigueur scientifique</h4>
                <p className="text-gray-700">
                  Plus de 79 publications scientifiques et 32 conférences internationales.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm text-left">
                <h4 className="text-xl font-bold text-amber-600 mb-2">Impact continental</h4>
                <p className="text-gray-700">
                  45 études de cas et plus de 16 projets stratégiques en Afrique menés en collaboration 
                  avec la Banque mondiale, OCP Foundation et l'EPFL.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Project Summary - centré */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center"> {/* centrage */}
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                Project <span className="text-amber-500">Summary</span>
              </h2>
              <p className="text-2xl font-light text-amber-600 mb-8">
                AfricanCities IA Services : L'IA au service du diagnostic urbain pour les villes africaines
              </p>
              <div className="prose prose-lg text-gray-600 space-y-6 text-left"> {/* on garde le texte justifié/aligné à gauche pour lisibilité */}
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
            </div>
          </div>
        </section>
      </main>

      {/* Footer (inchangé) */}
      <footer className="relative bg-white border-t border-gray-200 py-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=2070"
            alt="Fond de ville africaine"
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
              Can't wait? <span className="font-semibold">Set up a pilot program</span>.
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