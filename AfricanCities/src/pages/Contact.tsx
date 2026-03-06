import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Instagram, Mail, MapPin, Phone, ArrowRight } from 'lucide-react';
import logo from "../assets/logo.jpeg";

interface FormData {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });

  const [isScrolled, setIsScrolled] = useState(false);

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
    alert('Message envoyé avec succès !');
    setFormData({ name: '', firstName: '', lastName: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 font-sans text-gray-800">
      {/* Header sticky avec changement de style au scroll */}
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
        {/* Hero Section avec -mt-20 pour remonter sous le header */}
        <section className="relative h-[50vh] flex items-center justify-center overflow-hidden -mt-20">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-black/50 z-10"></div>
            <img 
              src="/dakar.jpg" 
              alt="Contact"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-20 text-center text-white max-w-4xl mx-auto px-6">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <p className="text-amber-400 font-light mb-12">
                Contact
              </p>
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-white font-normal">
              Opportunities now exist to apply digital technologies into everyday environments and to transform urban infrastructures into interactive platforms.
            </p>
          </div>
        </section>

        {/* Formulaire et coordonnées */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Formulaire */}
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Your message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Your name <span className="text-amber-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name <span className="text-amber-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="Jean"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name <span className="text-amber-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="Dupont"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email address <span className="text-amber-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="jean@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message <span className="text-amber-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Your message..."
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 shadow-md hover:shadow-lg"
                  >
                    Send
                  </button>
                </form>
              </div>

              {/* Coordonnées et adresse */}
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Get in touch</h2>
                <div className="space-y-8">
                  {/* Adresse */}
                  <div className="flex items-start gap-4">
                    <div className="bg-amber-100 p-3 rounded-full">
                      <MapPin className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Our office</h3>
                      <p className="text-gray-600 mt-1">
                        AfricanCities AI<br />
                        Mohammed VI Polytechnic University<br />
                        Benguerir, Morocco
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="bg-amber-100 p-3 rounded-full">
                      <Mail className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Email us</h3>
                      <p className="text-gray-600 mt-1">
                        <a href="mailto:contact.cus@um6p.ma" className="hover:text-amber-600 transition-colors">
                          contact.cus@um6p.ma
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* Téléphone */}
                  

                  {/* Réseaux sociaux */}
                  

                  {/* Lien supplémentaire ou carte statique */}
                  
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Abonnement (optionnel) */}
        
      </main>

      {/* Footer */}
      <footer className="relative bg-white border-t border-gray-200 py-12 overflow-hidden">
        {/* Image de fond : ville africaine */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=2070"
            alt="African city background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 z-10"></div>
        </div>

        {/* Contenu */}
        <div className="relative z-20 container mx-auto px-6">
          <div className="flex flex-col items-center text-center gap-4 text-white">
            <p className="text-lg">
              Thank you for your interest in us. Our derivative websites will be launched soon, stay tuned!
            </p>
            <p className="text-lg">
              Can't wait?  to set up a pilot program.
            </p>
            <div className="flex items-center justify-center gap-4 mt-2 text-sm text-white/80">
              <span>Benguerir</span>
              <span>|</span>
              <a href="mailto:contact.cus@um6p.ma" className="hover:text-amber-300 transition-colors">
                contact.cus@um6p.ma
              </a>
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

export default Contact;