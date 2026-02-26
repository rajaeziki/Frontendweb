import { Link, useLocation } from "wouter";
import logo from "../assets/logo.jpeg";
import { Button } from "../component/ui/button";
import { v4 as uuidv4 } from "uuid";
import { useEffect } from "react";
import { 
  MessageSquare, 
  FileText, 
  Menu, 
  LayoutDashboard,
  ChevronRight
} from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "../component/ui/sheet";

// Define props type with readonly
interface LayoutShellProps {
  readonly children: React.ReactNode;
}

// Move Sidebar outside of LayoutShell
const Sidebar = ({ location, navItems }: { readonly location: string; readonly navItems: readonly { href: string; label: string; icon: React.ElementType; }[] }) => (
  <div className="flex flex-col h-full bg-gradient-to-b from-white to-gray-50/50 border-r border-gray-200/70 shadow-xl">
    {/* Logo Section */}
    <div className="relative p-6 pb-4">
      <div className="absolute inset-0 bg-linear-to-r from-primary/5 via-transparent to-transparent" />
      <div className="relative flex justify-center">
        <div className="group relative">
          {/* Decorative background effects */}
          <div className="absolute -inset-1 bg-linear-to-r from-primary/20 to-secondary/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
          <div className="absolute inset-0 bg-linear-to-r from-primary/10 to-secondary/10 rounded-2xl blur-md" />
          
          {/* Main logo container */}
          <div className="relative bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-2xl border border-white/50 group-hover:shadow-3xl transition-all duration-500">
            <img
              src={logo}
              alt="AfricanCities AI Logo"
              className="h-16 w-auto object-contain drop-shadow-xl"
            />
          </div>
        </div>
      </div>
      
      {/* Decorative divider */}
      <div className="absolute bottom-0 left-8 right-8 h-px bg-linear-to-r from-transparent via-gray-300 to-transparent" />
    </div>

    {/* Navigation */}
    <nav className="flex-1 px-4 py-6 space-y-2">
      {navItems.map((item) => {
        const isActive = location === item.href;
        const Icon = item.icon;
        return (
          <Link key={item.href} href={item.href}>
            <div className={`
              relative group cursor-pointer
              ${isActive ? "active-nav" : ""}
            `}>
              {/* Active indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full shadow-lg shadow-primary/50" />
              )}
              
              {/* Background glow for active item */}
              {isActive && (
                <div className="absolute inset-0 bg-linear-to-r from-primary/20 via-primary/10 to-transparent rounded-lg blur-md" />
              )}
              
              {/* Main nav item */}
              <div className={`
                relative flex items-center gap-3 px-5 py-3.5 rounded-xl transition-all duration-300
                ${isActive 
                  ? "bg-linear-to-r from-primary to-primary/90 text-white shadow-xl shadow-primary/30 scale-[1.02]" 
                  : "text-gray-600 hover:bg-white hover:shadow-lg hover:scale-[1.01] hover:text-primary"
                }
                group-hover:translate-x-1
              `}>
                {/* Icon with effects */}
                <div className={`
                  relative p-1.5 rounded-lg
                  ${isActive 
                    ? "bg-white/20" 
                    : "bg-gray-100/80 group-hover:bg-primary/10"
                  }
                  transition-all duration-300
                `}>
                  <Icon className={`
                    w-5 h-5 transition-all duration-300
                    ${isActive 
                      ? "text-white" 
                      : "text-gray-500 group-hover:text-primary"
                    }
                  `} />
                </div>
                
                {/* Label */}
                <span className="font-medium flex-1">{item.label}</span>
                
                {/* Chevron for active/hover state */}
                <ChevronRight className={`
                  w-4 h-4 transition-all duration-300
                  ${isActive 
                    ? "opacity-100 translate-x-0" 
                    : "opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0"
                  }
                `} />
              </div>
            </div>
          </Link>
        );
      })}
    </nav>

    {/* Footer with subtle branding */}
    <div className="p-6 pt-0">
      <div className="relative">
        <div className="absolute inset-0 bg-linear-to-t from-gray-200/50 to-transparent rounded-xl" />
        <div className="relative text-xs text-center text-gray-400 py-3 px-4 border-t border-gray-200/50">
          <span className="font-medium">AfricanCities AI</span>
        </div>
      </div>
    </div>
  </div>
);

export function LayoutShell({ children }: Readonly<LayoutShellProps>) {
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
    
  const navItems = [
    { href: "/", label: "Tableau de Bord", icon: LayoutDashboard },
    { href: "/chat", label: "Assistant Urbain", icon: MessageSquare },
    { href: "/diagnosis", label: "Diagnostic", icon: FileText },
  ] as const;
 // ✅ Hooks déplacés à l'intérieur du composant
  useEffect(() => {
    let userId = localStorage.getItem("urban_user_id");

    if (!userId) {
      userId = uuidv4();
      localStorage.setItem("urban_user_id", userId);
    }
  }, []);

  useEffect(() => {
  const incrementCounter = (key: string) => {
    const storedValue = localStorage.getItem(key);
    let count = 1; // Valeur par défaut
    
    if (storedValue !== null) {
      count = parseInt(storedValue) + 1;
    }
    
    localStorage.setItem(key, count.toString());
  };

  if (location === "/diagnosis") {
    incrementCounter("diagnosis_count");
  }

  if (location === "/chat") {
    incrementCounter("coach_count");
  }

}, [location]);
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50/80">
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-72 fixed h-full z-20 animate-slide-in-left">
          <Sidebar location={location} navItems={navItems} />
        </aside>

        {/* Mobile Header - With Logo and Text together */}
        <div className="md:hidden fixed top-0 w-full bg-white/90 backdrop-blur-xl border-b border-gray-200/80 z-30 shadow-lg">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Left side - Menu button */}
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-80 border-r-0">
                <Sidebar location={location} navItems={navItems} />
              </SheetContent>
            </Sheet>

            {/* Center/Left - Logo and Text together */}
            <div className="flex items-center gap-2 flex-1 ml-2">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary to-secondary shadow-md flex items-center justify-center flex-shrink-0">
                <img 
                  src={logo} 
                  alt="Logo" 
                  className="w-6 h-6 object-contain"
                />
              </div>
              <span className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                AfricanCities AI
              </span>
            </div>

            {/* Right side - Empty or could add notification icon later */}
            <div className="w-10" /> {/* Spacer for balance */}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 md:ml-72 p-4 md:p-8 pt-20 md:pt-8 w-full max-w-7xl mx-auto">
          <div className="relative">
            {/* Background decoration for main content */}
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-secondary/5 rounded-3xl blur-3xl opacity-30 pointer-events-none" />
            
            {/* Content container */}
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-gray-200/50 border border-white/50 p-6 md:p-8">
              {/* Animated content */}
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add custom styles using className instead of style jsx */}
      <style>{`
        @keyframes slide-in-left {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 0.5s ease-out;
        }
        
        .active-nav {
          position: relative;
        }
      `}</style>
    </div>
  );
}