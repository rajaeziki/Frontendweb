import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChatInterface } from "./ChatInterface"; // Assurez-vous que le chemin est correct

export default function ChatWidget() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-amber-500 hover:bg-amber-600 text-white p-4 rounded-full shadow-lg transition-colors z-50 focus:outline-none focus:ring-2 focus:ring-amber-400"
        aria-label={t('chat.open_aria')}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25-.825 0-1.624-.1-2.387-.287a.75.75 0 0 0-.622.124l-2.067 1.379a.75.75 0 0 1-1.14-.553l-.21-1.542a.75.75 0 0 0-.279-.51C4.398 18.074 3 15.528 3 12 3 7.444 7.03 3.75 12 3.75s9 3.694 9 8.25z"
          />
        </svg>
      </button>

      {/* Fenêtre du chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[32rem] bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-50 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="font-semibold text-gray-800">{t('chat.title')}</h2>
            <button
              onClick={toggleChat}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label={t('chat.close_aria')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <ChatInterface />
          </div>
        </div>
      )}
    </>
  );
}