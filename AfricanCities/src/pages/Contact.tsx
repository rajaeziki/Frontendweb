import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { Mail, MapPin, Menu, X } from 'lucide-react';
import logo from "../assets/logo.jpeg";
import LanguageSwitcher from '../component/LanguageSwitcher';

interface FormData {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

const Contact: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });
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

  // Détection du scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert(t('contact.form.success'));
    setFormData({ name: '', firstName: '', lastName: '', email: '', message: '' });
  };

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
        <section className="relative h-[50vh] flex items-center justify-center overflow-hidden -mt-20">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-black/50 z-10"></div>
            <img 
              src="/dakar.jpg" 
              alt={t('contact.title')}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-20 text-center text-white max-w-4xl mx-auto px-6">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <p className="text-amber-400 font-bold mb-12">
                {t('contact.title')}
              </p>
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-white font-normal">
              {t('contact.subtitle')}
            </p>
          </div>
        </section>

        {/* Formulaire et coordonnées */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Formulaire */}
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-8">{t('contact.form.title')}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('contact.form.name')} <span className="text-amber-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder={t('contact.form.name_placeholder')}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('contact.form.firstName')} <span className="text-amber-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder={t('contact.form.firstName_placeholder')}
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('contact.form.lastName')} <span className="text-amber-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder={t('contact.form.lastName_placeholder')}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('contact.form.email')} <span className="text-amber-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder={t('contact.form.email_placeholder')}
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('contact.form.message')} <span className="text-amber-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder={t('contact.form.message_placeholder')}
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 shadow-md hover:shadow-lg"
                  >
                    {t('contact.form.send')}
                  </button>
                </form>
              </div>

              {/* Coordonnées */}
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-8">{t('contact.info.title')}</h2>
                <div className="space-y-8">
                  {/* Adresse */}
                  <div className="flex items-start gap-4">
                    <div className="bg-amber-100 p-3 rounded-full">
                      <MapPin className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('contact.info.address_title')}</h3>
                      <p className="text-gray-600 mt-1 whitespace-pre-line">
                        {t('contact.info.address')}
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="bg-amber-100 p-3 rounded-full">
                      <Mail className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('contact.info.email_title')}</h3>
                      <p className="text-gray-600 mt-1">
                        <a href="mailto:contact.cus@um6p.ma" className="hover:text-amber-600 transition-colors">
                          {t('contact.info.email')}
                        </a>
                      </p>
                    </div>
                  </div>
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
              <a href="mailto:contact.cus@um6p.ma" className="hover:text-amber-300 transition-colors">
                {t('common.footer.email')}
              </a>
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

export default Contact;