import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Flame, Moon, Sun } from "lucide-react";

export function AppHeader() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-tinder-dark/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-tinder-primary to-tinder-secondary rounded-xl flex items-center justify-center">
              <Flame className="text-white text-lg" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Tinder Optimizer</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Profile Enhancement Suite</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <button className="text-tinder-primary font-medium">Dashboard</button>
            <button className="text-gray-600 dark:text-gray-400 hover:text-tinder-primary transition-colors">Analytics</button>
            <button className="text-gray-600 dark:text-gray-400 hover:text-tinder-primary transition-colors">Optimizer</button>
            <button className="text-gray-600 dark:text-gray-400 hover:text-tinder-primary transition-colors">Settings</button>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 hover:scale-105 transition-transform"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gradient-to-r from-tinder-primary to-tinder-secondary">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100" 
                alt="User Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
