import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Send, Sparkles, Lightbulb, AlertCircle } from 'lucide-react';

export function ChatInterface() {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      // Logique d'envoi du message
      console.log('Message envoyé:', message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-white to-gray-50">
      {/* En-tête avec icône et titre */}
      <div className="p-4 border-b bg-white shadow-sm">
        <div className="flex items-center gap-3">
          
          <div>
            <h3 className="font-semibold text-gray-900">{t('chat.subtitle')}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{t('chat.welcome_message')}</p>
          </div>
        </div>
      </div>

      {/* Zone des messages (à implémenter si vous avez une liste de messages) */}
      {/* Pour l'instant, on laisse vide ou on met un placeholder */}

      {/* Suggestions avec icônes */}
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span>{t('chat.suggestions_title')}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="group flex items-center gap-1 text-xs bg-white border border-gray-200 hover:border-amber-300 hover:bg-amber-50 px-3 py-1.5 rounded-full shadow-sm transition-all duration-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:bg-amber-500" />
            {t('chat.suggestion_urban_planning')}
          </button>
          <button className="group flex items-center gap-1 text-xs bg-white border border-gray-200 hover:border-amber-300 hover:bg-amber-50 px-3 py-1.5 rounded-full shadow-sm transition-all duration-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:bg-amber-500" />
            {t('chat.suggestion_transport')}
          </button>
          <button className="group flex items-center gap-1 text-xs bg-white border border-gray-200 hover:border-amber-300 hover:bg-amber-50 px-3 py-1.5 rounded-full shadow-sm transition-all duration-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:bg-amber-500" />
            {t('chat.suggestion_waste')}
          </button>
          <button className="group flex items-center gap-1 text-xs bg-white border border-gray-200 hover:border-amber-300 hover:bg-amber-50 px-3 py-1.5 rounded-full shadow-sm transition-all duration-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:bg-amber-500" />
            {t('chat.suggestion_housing')}
          </button>
        </div>
      </div>

      {/* Zone de saisie avec bouton d'envoi */}
      <div className="p-4 border-t bg-white mt-auto">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('chat.input_placeholder')}
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="p-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Avertissement avec icône */}
      <div className="px-4 pb-3 flex items-center justify-center gap-1 text-xs text-gray-400">
        <AlertCircle className="w-3 h-3" />
        <span>{t('chat.disclaimer')}</span>
      </div>
    </div>
  );
}