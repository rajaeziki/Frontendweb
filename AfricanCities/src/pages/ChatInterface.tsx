import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Lightbulb, AlertCircle } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatInterface() {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll automatique vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simuler une réponse de l'assistant
  const getAssistantResponse = (userMessage: string): string => {
    if (userMessage.includes(t('chat.suggestion_urban_planning'))) {
      return t('chat.response_urban_planning');
    }
    if (userMessage.includes(t('chat.suggestion_transport'))) {
      return t('chat.response_transport');
    }
    if (userMessage.includes(t('chat.suggestion_waste'))) {
      return t('chat.response_waste');
    }
    if (userMessage.includes(t('chat.suggestion_housing'))) {
      return t('chat.response_housing');
    }
    return t('chat.response_default');
  };

  const sendMessage = (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      const assistantMessage: Message = {
        role: 'assistant',
        content: getAssistantResponse(content)
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 500);

    setMessage('');
  };

  const handleSend = () => sendMessage(message);
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  const handleSuggestionClick = (suggestion: string) => sendMessage(suggestion);

  return (
    <div className="flex flex-col h-full min-h-[500px] bg-gradient-to-b from-white to-gray-50">
      {/* En-tête */}
      <div className="p-4 border-b bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <div>
            <h3 className="font-semibold text-gray-900">{t('chat.subtitle')}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{t('chat.welcome_message')}</p>
          </div>
        </div>
      </div>

      {/* Zone des messages - prend tout l'espace disponible */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 text-sm mt-8">
            {t('chat.no_messages')}
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                msg.role === 'user'
                  ? 'bg-amber-500 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-800 rounded-bl-none'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions - avec hauteur limitée */}
      <div className="p-4 space-y-3 border-t max-h-32 overflow-y-auto">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span>{t('chat.suggestions_title')}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            'suggestion_urban_planning',
            'suggestion_transport',
            'suggestion_waste',
            'suggestion_housing'
          ].map(key => (
            <button
              key={key}
              onClick={() => handleSuggestionClick(t(`chat.${key}`))}
              className="group flex items-center gap-1 text-xs bg-white border border-gray-200 hover:border-amber-300 hover:bg-amber-50 px-3 py-1.5 rounded-full shadow-sm transition-all duration-200"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:bg-amber-500" />
              {t(`chat.${key}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Zone de saisie */}
      <div className="p-4 border-t bg-white">
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

      {/* Disclaimer */}
      <div className="px-4 pb-3 flex items-center justify-center gap-1 text-xs text-gray-400">
        <AlertCircle className="w-3 h-3" />
        <span>{t('chat.disclaimer')}</span>
      </div>
    </div>
  );
}