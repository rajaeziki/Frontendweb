import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Menu, X } from 'lucide-react'; // Icônes pour le burger
// import logo from "../assets/logo.jpeg";
import UM6PCUS from '../assets/UM6PCUS.svg';
import LanguageSwitcher from '../component/LanguageSwitcher';

// Types pour les images de ville
interface CityImage {
  id: number;
  url: string;
  alt: string;
  city: string;
}

const cityImages: CityImage[] = [
  { id: 1, url: '/dakar.jpg', alt: 'Dakar, Sénégal - Rue animée', city: 'Dakar' },
  { id: 2, url: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=2127', alt: 'Nairobi, Kenya - Quartier urbain', city: 'Nairobi' },
  { id: 3, url: '/Cap.jpg', alt: 'Cape Town, Afrique du Sud - Vue aérienne', city: 'Cape Town' },
  { id: 4, url: '/Morroco.jpg', alt: 'Lagos, Nigeria - Ville animée', city: 'Lagos' },
  { id: 5, url: '/Kinshasa.jpg', alt: 'Marrakech, Maroc - Médina', city: 'Marrakech' },
  { id: 6, url: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=2070', alt: 'Le Caire, Égypte - Pyramides et ville', city: 'Cairo' }
];

const Home: React.FC = () => {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Ferme le menu mobile si on redimensionne au-dessus de md
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Rotation automatique des images de la hero
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % cityImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Détection du scroll pour changer le style du header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Header responsive */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-lg py-2' 
          : 'bg-transparent py-4'
      }`}>
        <nav className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="block">
  <div className="p-3">  {/* transparent by default */}
    <img
      src={UM6PCUS}
      alt="AfricanCities AI Logo"
      className="h-12 w-auto object-contain drop-shadow-md"
    />
  </div>
</Link>

            {/* Partie droite : menu desktop, sélecteur et burger */}
            <div className="flex items-center">
              {/* Menu desktop (visible à partir de md) */}
              <ul className="hidden md:flex space-x-8 text-sm font-medium tracking-wider">
                <li>
                  <Link 
                    href="/" 
                    className={`transition-colors ${
                      isScrolled ? 'text-gray-800 hover:text-amber-500' : 'text-white hover:text-amber-400'
                    }`}
                  >
                    {t('common.header.home')}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/about" 
                    className={`transition-colors ${
                      isScrolled ? 'text-gray-800 hover:text-amber-500' : 'text-white hover:text-amber-400'
                    }`}
                  >
                    {t('common.header.about')}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/diagnosis" 
                    className={`transition-colors ${
                      isScrolled ? 'text-gray-800 hover:text-amber-500' : 'text-white hover:text-amber-400'
                    }`}
                  >
                    {t('common.header.diagnostic')}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/contact" 
                    className={`transition-colors ${
                      isScrolled ? 'text-gray-800 hover:text-amber-500' : 'text-white hover:text-amber-400'
                    }`}
                  >
                    {t('common.header.contact')}
                  </Link>
                </li>
              </ul>

              {/* Sélecteur de langue (toujours visible) */}
              <LanguageSwitcher />

              {/* Bouton burger pour mobile */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden ml-4 p-2 focus:outline-none"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className={`w-6 h-6 ${isScrolled ? 'text-gray-800' : 'text-white'}`} />
                ) : (
                  <Menu className={`w-6 h-6 ${isScrolled ? 'text-gray-800' : 'text-white'}`} />
                )}
              </button>
            </div>
          </div>

          {/* Menu mobile déroulant */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-white/90 backdrop-blur-md shadow-lg py-4 px-6 mt-2">
              <ul className="flex flex-col space-y-4 text-sm font-medium">
                <li>
                  <Link 
                    href="/" 
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-gray-800 hover:text-amber-500 transition-colors"
                  >
                    {t('common.header.home')}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/about" 
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-gray-800 hover:text-amber-500 transition-colors"
                  >
                    {t('common.header.about')}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/diagnosis" 
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-gray-800 hover:text-amber-500 transition-colors"
                  >
                    {t('common.header.diagnostic')}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/contact" 
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-gray-800 hover:text-amber-500 transition-colors"
                  >
                    {t('common.header.contact')}
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </nav>
      </header>

      <main className="pt-20">
        {/* Hero Section (inchangée) */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden -mt-20">
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
              <p className="text-amber-400 font-bold mb-12">
                AfricanCities <span className="font-bold text-white">AI Services</span>
              </p>
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-white font-normal">
              {t('home.hero.subtitle')}
            </p>
            <Link
              href="/diagnosis"
              className="group bg-amber-400 hover:bg-amber-500 text-white font-semibold px-10 py-4 rounded-full shadow-lg hover:shadow-xl transition duration-300 inline-flex items-center gap-2 text-lg"
            >
              {t('home.hero.cta')}
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

        {/* Section 1 : Introduction */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                  AfricanCities <span className="text-amber-400">IA Services</span>
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  {t('home.IntroHome.subtitle')}
                </p>
                <p className="text-gray-600 leading-relaxed">
                  {t('home.IntroHome.description')}
                </p>
              </div>
              <div className="flex-1">
                <img
                  src="/Poverty.jpg"
                  alt={t('home.IntroHome.title')}
                  className="rounded-2xl shadow-xl w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 : Pourquoi */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row-reverse items-center gap-12">
              <div className="flex-1">
                <h2 className="text-4xl font-bold mb-4 text-gray-900">{t('home.why.title')}</h2>
                <p className="text-xl text-gray-600 mb-8">{t('home.why.subtitle')}</p>
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-amber-500 mb-2">60%</div>
                    <p className="text-sm text-gray-600">{t('home.why.stat1')}</p>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-amber-500 mb-2">950M</div>
                    <p className="text-sm text-gray-600">{t('home.why.stat2')}</p>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-amber-500 mb-2">3,5%</div>
                    <p className="text-sm text-gray-600">{t('home.why.stat3')}</p>
                  </div>
                  {/* <div className="text-center">
                    <div className="text-5xl font-bold text-amber-500 mb-2">▲</div>
                    <p className="text-sm text-gray-600">{t('home.why.stat4')}</p>
                  </div> */}
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {t('home.why.description')}
                </p>
              </div>
              <div className="flex-1">
                <img
                  src="/benin.jpg"
                  alt={t('home.why.title')}
                  className="rounded-2xl shadow-xl w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 : Comment ça marche ? */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">{t('home.how.title')}</h2>
            <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
              {t('home.how.subtitle')}
            </p>
            <div className="grid md:grid-cols-4 gap-8">
              {[1,2,3,4].map((num) => (
                <div key={num} className="text-center">
                  <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-amber-600">
                    {num}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{t(`home.how.step${num}.title`)}</h3>
                  <p className="text-gray-600">{t(`home.how.step${num}.desc`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4 : Fonctionnalités clés */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <h2 className="text-4xl font-bold mb-8 text-gray-900">{t('home.features.title')}</h2>
                <p className="text-lg text-gray-600 mb-8">
                  {t('home.features.subtitle')}
                </p>
                <div className="grid grid-cols-2 gap-6">
                  {[0,1,2,3,4,5].map((idx) => (
                    <div 
                      key={idx} 
                      className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-bold text-gray-900">{t(`home.features.items.${idx}.title`)}</h3>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{t(`home.features.items.${idx}.description`)}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <img
                  src="/Morroco.jpg"
                  alt={t('home.features.title')}
                  className="rounded-2xl shadow-xl w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 5 : Bénéfices concrets */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1">
                <img
                  src="/Cap.jpg"
                  alt={t('home.benefits.title')}
                  className="rounded-2xl shadow-xl w-full h-auto object-cover"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  {t('home.benefits.title')} <span className="text-amber-500">{t('home.benefits.highlight')}</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[0,1,2,3].map((idx) => (
                    <div
                      key={idx}
                      className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{t(`home.benefits.items.${idx}.title`)}</h3>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{t(`home.benefits.items.${idx}.desc`)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
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
              {t('common.footer.thank_you')}
            </p>
            <p className="text-lg">
              {t('common.footer.pilot').replace(/<[^>]*>/g, '')}
            </p>
            <div className="flex items-center justify-center gap-4 mt-2 text-sm text-white/80">
              <span>{t('common.footer.location')}</span>
              <span>|</span>
              <span>{t('common.footer.email')}</span>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <Link
                href="/contact"
                className="bg-amber-400 hover:bg-amber-500 text-white font-medium px-8 py-3 rounded-full shadow-md hover:shadow-lg transition duration-300 inline-block"
              >
                {t('common.footer.contact_button')}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;