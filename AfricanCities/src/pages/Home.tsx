import React from 'react';
import { Building2 } from 'lucide-react'; // Assurez-vous d'avoir installé lucide-react

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 font-sans">
      {/* Navigation */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo avec style demandé */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">AfricanCities AI Services</h1>
                <p className="text-sm text-gray-500 tracking-wide">CENTER OF URBAN SYSTEMS</p>
              </div>
            </div>
w
            {/* Menu de navigation */}
            <ul className="flex space-x-8">
              <li className="font-medium text-gray-700 hover:text-cyan-600 cursor-pointer transition-colors">
                HOME
              </li>
              <li className="font-medium text-gray-700 hover:text-cyan-600 cursor-pointer transition-colors">
                ABOUT
              </li>
              <li className="font-medium text-gray-700 hover:text-cyan-600 cursor-pointer transition-colors">
                DIAGNOSTIC
              </li>
              <li className="font-medium text-gray-700 hover:text-cyan-600 cursor-pointer transition-colors">
                CONTACT
              </li>
            </ul>
          </div>
        </nav>
      </header>

      {/* Contenu principal */}
      <main>
        {/* Section Hero */}
        <section className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-4">
            Live the Future
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Center of Urban Systems | AfricanCities AI Services | UM6P
          </p>
          <div className="mt-10">
            <button className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition duration-300">
              Get Started
            </button>
          </div>
        </section>

        {/* Section explicative */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Gérez vos investissements et diagnostics
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Vous avez besoin de gérer votre investissement, votre diagnostic,
                et trouver les bureaux d'études et cautèles ? Notre solution{' '}
                <span className="font-semibold text-cyan-600">
                  AfricanCities AI Services
                </span>{' '}
                est faite pour vous. Bienvenue dans le futur de la gestion urbaine.
              </p>
              <p className="mt-6 text-gray-500">
                Si vous avez besoin de plus d'informations, allez dans la section{' '}
                <a href="#" className="text-cyan-600 hover:underline">
                  About
                </a>
                .
              </p>
            </div>
            <div className="flex justify-center">
              {/* Image placeholder */}
              <div className="w-full h-64 bg-gradient-to-r from-cyan-200 to-blue-200 rounded-2xl shadow-xl flex items-center justify-center text-gray-500">
                <span className="text-lg">Image explicative</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer avec appel à l'action */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200">
        <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-xl font-semibold text-gray-700">
            Nos sponsors & clients
          </span>
          <button className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium px-6 py-2 rounded-full shadow transition duration-300">
            CONTACT
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Home;