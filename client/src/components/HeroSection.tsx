import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface HeroSectionProps {
  userLocation?: { 
    neighborhood: string;
    city: string;
  };
  onChangeLocation?: () => void;
}

export function HeroSection({ userLocation, onChangeLocation }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 to-white py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-10">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Strengthen your community, one neighbor at a time</h1>
            <p className="text-lg text-slate-600 mb-6">Connect with people nearby, share resources, and help each other out in your neighborhood.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/map-view">
                <Button size="xl" className="items-center">
                  <i className="fas fa-search mr-2"></i> Browse Requests
                </Button>
              </Link>
              <Link href="/create-request">
                <Button variant="outlinePrimary" size="xl" className="items-center">
                  <i className="fas fa-plus mr-2"></i> Post a Request
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center text-slate-500 text-sm">
              <span className="flex items-center">
                <i className="fas fa-map-marker-alt text-secondary mr-2"></i> 
                Based on your location: {userLocation ? `${userLocation.neighborhood}, ${userLocation.city}` : 'Location not available'}
              </span>
              <button 
                onClick={onChangeLocation}
                className="ml-2 text-primary hover:text-indigo-700 underline underline-offset-2"
              >
                Change
              </button>
            </div>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0">
            <img 
              src="https://pixabay.com/get/g0a1fc5b32e6d86fda9e9cb4849447d08c25389cb1390d1833c6b2e0ea70d782d9037526c3ffef33af41814bcc8fef157591c62f1363e23cf81f63d94612b0561_1280.jpg" 
              alt="Community members helping each other" 
              className="rounded-2xl shadow-lg w-full h-auto object-cover" 
            />
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-50 to-transparent"></div>
    </section>
  );
}
