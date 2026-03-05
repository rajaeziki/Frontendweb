import { useState, useEffect, useRef } from "react";
import { Button } from "../component/ui/button";
import { Input } from "../component/ui/input";
import { ScrollArea } from "../component/ui/scroll-area";
import { Avatar, AvatarFallback} from "../component/ui/avatar";
import { Send, Bot, User, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion} from "framer-motion";


interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatInterface() {
  
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      content: "Bonjour. Je suis votre assistant spécialisé en développement urbain africain. Comment puis-je vous aider à analyser vos données ou planifier vos projets aujourd'hui ?" 
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user" as const, content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      // In a real app, this would be a mutation to the backend
      // Here we simulate the AI response for demonstration
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const aiResponse = { 
        role: "assistant" as const, 
        content: `Je comprends votre question concernant **${userMsg.content}**. \n\nDans le contexte des villes africaines, il est crucial de considérer :\n\n1. La démographie galopante\n2. Les infrastructures résilientes\n3. L'intégration des données informelles\n\nSouhaitez-vous générer un rapport de diagnostic complet sur ce sujet ?` 
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error("Chat error", error);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestions = [
    "Planification urbaine durable",
    "Transport informel à Dakar",
    "Gestion des déchets",
    "Logement social abordable"
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-border/50 overflow-hidden">
      {/* Chat Header */}
      <div className="bg-primary/5 p-4 border-b border-border/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-primary">Assistant Urbain</h3>
            <p className="text-xs text-muted-foreground">Expert en développement territorial</p>
          </div>
        </div>
        <div className="flex gap-2">
          {/* Status Indicator */}
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4 bg-slate-50/50">
        <div className="space-y-6 max-w-3xl mx-auto">
          {messages.map((msg, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <Avatar className={`h-8 w-8 border ${msg.role === "assistant" ? "bg-primary text-white" : "bg-white"}`}>
                {msg.role === "assistant" ? (
                  <AvatarFallback className="bg-primary text-white"><Bot className="w-4 h-4" /></AvatarFallback>
                ) : (
                  <>
                  
                    <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                  </>
                )}
              </Avatar>
              
              <div className={`
                flex flex-col gap-1 max-w-[80%] 
                ${msg.role === "user" ? "items-end" : "items-start"}
              `}>
                <div className={`
                  p-4 rounded-2xl text-sm leading-relaxed shadow-sm
                  ${msg.role === "user" 
                    ? "bg-primary text-primary-foreground rounded-tr-sm" 
                    : "bg-white border border-border/50 rounded-tl-sm prose prose-sm max-w-none text-foreground"
                  }
                `}>
                  {msg.role === "assistant" ? (
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  ) : (
                    msg.content
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground px-1 opacity-70">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="flex gap-4"
            >
              <Avatar className="h-8 w-8 bg-primary text-white">
                <AvatarFallback className="bg-primary text-white"><Bot className="w-4 h-4" /></AvatarFallback>
              </Avatar>
              <div className="bg-white border border-border/50 p-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </div>
            </motion.div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-border/50">
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Suggestions chips */}
          {messages.length < 3 && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {suggestions.map((s) => (
                <button 
                  key={s}
                  onClick={() => setInput(s)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 hover:bg-primary/10 text-primary text-xs font-medium rounded-full transition-colors whitespace-nowrap border border-primary/10"
                >
                  <Sparkles className="w-3 h-3 text-secondary" />
                  {s}
                </button>
              ))}
            </div>
          )}
          
          <div className="relative flex items-center gap-2">
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Posez une question sur votre ville..." 
              className="pr-12 py-6 rounded-xl border-border/50 bg-slate-50 focus:bg-white transition-all shadow-inner focus:ring-primary/20"
            />
            <Button 
              size="icon" 
              className="absolute right-1.5 h-9 w-9 rounded-lg bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20 transition-all hover:scale-105 active:scale-95"
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-[10px] text-center text-muted-foreground">
            L'IA peut faire des erreurs. Vérifiez les informations importantes.
          </p>
        </div>
      </div>
    </div>
  );
}
