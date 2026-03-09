import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useTranslation, Trans } from 'react-i18next';
import { Menu, X } from 'lucide-react';
import logo from "../assets/logo.jpeg";
import LanguageSwitcher from '../component/LanguageSwitcher';

const About: React.FC = () => {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Ferme le menu mobile si redimensionnement au-dessus de md
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Détection du scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 font-sans text-gray-800">
      {/* Header responsive */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-lg py-2' 
          : 'bg-transparent py-4'
      }`}>
        <nav className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
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
        {/* Hero Section */}
        <section className="relative h-[70vh] flex items-center justify-center overflow-hidden -mt-20">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-black/50 z-10"></div>
            <img 
              src="/Kinshasa.jpg" 
              alt={t('about.hero.mission')}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-20 text-center text-white max-w-4xl mx-auto px-6">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-amber-400 font-bold mb-12">
                {t('about.hero.mission')}
              </span>
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-white font-normal">
              {t('about.hero.subtitle')}
            </p>
          </div>
        </section>

        {/* Notre parcours */}
        <section className="py-20 bg-gradient-to-br from-amber-50/30 to-purple-50/30">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                {t('about.parcours.title')} <span className="text-amber-500">{t('about.parcours.highlight')}</span>
              </h2>
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                <p>
                  <Trans i18nKey="about.parcours.p1" components={{ 0: <span className="font-semibold text-amber-600" /> }} />
                </p>
                <p>{t('about.parcours.p2')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section Expertise */}
        <section className="bg-white py-16 px-4 md:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('about.expertise.title')}
            </h2>
            <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
              {t('about.expertise.description')}
            </p>

            {/* Image de l'équipe */}
            <div className="relative w-full h-64 md:h-96 mb-12 rounded-2xl overflow-hidden shadow-2xl bg-gray-100">
              <img 
                src="/CUS_teams.jpeg"
                alt={t('about.expertise.title')}
                className="w-full h-full object-contain"
              />
            </div>

            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              {t('about.expertise.pillars_title')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm text-left">
                <h4 className="text-xl font-bold text-amber-600 mb-2">{t('about.expertise.pillar1.title')}</h4>
                <p className="text-gray-700">{t('about.expertise.pillar1.desc')}</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm text-left">
                <h4 className="text-xl font-bold text-amber-600 mb-2">{t('about.expertise.pillar2.title')}</h4>
                <p className="text-gray-700">{t('about.expertise.pillar2.desc')}</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm text-left">
                <h4 className="text-xl font-bold text-amber-600 mb-2">{t('about.expertise.pillar3.title')}</h4>
                <p className="text-gray-700">{t('about.expertise.pillar3.desc')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Project Summary */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                {t('about.summary.title')} <span className="text-amber-500">{t('about.summary.highlight')}</span>
              </h2>
              <p className="text-2xl font-light text-amber-600 mb-8">
                {t('about.summary.subtitle')}
              </p>
              <div className="prose prose-lg text-gray-600 space-y-6 text-left">
                <p>{t('about.summary.p1')}</p>
                <p>{t('about.summary.p2')}</p>
                <p>{t('about.summary.p3')}</p>
                <p>{t('about.summary.p4')}</p>
                <p className="font-semibold text-gray-800">{t('about.summary.p5')}</p>
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
            alt={t('common.footer.location')}
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
                className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-8 py-3 rounded-full shadow-md hover:shadow-lg transition duration-300 inline-block"
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

export default About;