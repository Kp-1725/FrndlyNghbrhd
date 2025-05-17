import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export function NavBar() {
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and desktop navigation */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <span className="text-primary font-bold text-xl cursor-pointer">
                  Friendly<span className="text-secondary">Neighbourhood</span>
                </span>
              </Link>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-6">
              <Link href="/">
                <a className={cn(
                  "px-1 pt-2 pb-1 text-sm font-medium border-b-2",
                  isActive("/") 
                    ? "border-primary text-slate-700" 
                    : "border-transparent text-slate-500 hover:border-gray-300 hover:text-slate-700"
                )}>
                  Home
                </a>
              </Link>
              <Link href="/create-request">
                <a className={cn(
                  "px-1 pt-2 pb-1 text-sm font-medium border-b-2",
                  isActive("/create-request") 
                    ? "border-primary text-slate-700" 
                    : "border-transparent text-slate-500 hover:border-gray-300 hover:text-slate-700"
                )}>
                  Create Request
                </a>
              </Link>
              <Link href="/my-requests">
                <a className={cn(
                  "px-1 pt-2 pb-1 text-sm font-medium border-b-2",
                  isActive("/my-requests") 
                    ? "border-primary text-slate-700" 
                    : "border-transparent text-slate-500 hover:border-gray-300 hover:text-slate-700"
                )}>
                  My Requests
                </a>
              </Link>
              <Link href="/map-view">
                <a className={cn(
                  "px-1 pt-2 pb-1 text-sm font-medium border-b-2",
                  isActive("/map-view") 
                    ? "border-primary text-slate-700" 
                    : "border-transparent text-slate-500 hover:border-gray-300 hover:text-slate-700"
                )}>
                  Map View
                </a>
              </Link>
            </div>
          </div>
          
          {/* Right side actions */}
          <div className="flex items-center">
            <Link href="/create-request">
              <button className="bg-primary hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hidden md:flex items-center">
                <i className="fas fa-plus mr-2"></i> New Request
              </button>
            </Link>
            
            <div className="ml-4 flex items-center md:ml-6">
              {/* Profile dropdown */}
              <div className="ml-3 relative">
                <div>
                  <button type="button" className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                    <span className="sr-only">View notifications</span>
                    <i className="fas fa-bell"></i>
                  </button>
                </div>
              </div>
              
              <div className="ml-3 relative">
                <div>
                  <button type="button" className="flex items-center gap-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary" id="user-menu-button">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-indigo-400 flex items-center justify-center text-white font-medium">
                      JD
                    </div>
                    <span className="hidden md:block text-sm text-slate-700">John D.</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="-mr-2 flex md:hidden ml-2">
              <button type="button" className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary" aria-expanded="false">
                <span className="sr-only">Open main menu</span>
                <i className="fas fa-bars"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
