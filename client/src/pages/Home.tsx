import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { NavBar } from '@/components/NavBar';
import { HeroSection } from '@/components/HeroSection';
import { CategoryList } from '@/components/CategoryList';
import { LocationMap } from '@/components/LocationMap';
import { RequestCard } from '@/components/RequestCard';
import { HowItWorks } from '@/components/HowItWorks';
import { CommunitySpotlight } from '@/components/CommunitySpotlight';
import { CTASection } from '@/components/CTASection';
import { Footer } from '@/components/Footer';
import { LatLngTuple } from 'leaflet';
import { Link, useLocation } from 'wouter';
import { calculateDistance, CategoryType } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Request } from '@shared/schema';

export default function Home() {
  const [, navigate] = useLocation();
  const [userLocation, setUserLocation] = useState<LatLngTuple>([37.7749, -122.4194]); // Default to San Francisco
  const [locationName, setLocationName] = useState({ neighborhood: 'Downtown', city: 'San Francisco' });
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | undefined>();

  const { data: requests = [], isLoading } = useQuery<Request[]>({
    queryKey: ['/api/requests'],
  });

  // Get user's geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          
          // In a real app, you would do reverse geocoding here to get the neighborhood and city
          // For now, we'll just use the default values
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    }
  }, []);

  const filteredRequests = selectedCategory 
    ? requests.filter(request => request.category === selectedCategory)
    : requests;

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const recentRequests = sortedRequests.slice(0, 3);

  const handleCategorySelect = (category: CategoryType) => {
    setSelectedCategory(category === selectedCategory ? undefined : category);
  };

  const handleMarkerClick = (requestId: number) => {
    navigate(`/request/${requestId}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow">
        <HeroSection 
          userLocation={locationName}
          onChangeLocation={() => navigate('/map-view')}
        />
        
        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <CategoryList 
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
            />
          </div>
        </section>
        
        <section className="py-8 bg-white border-t border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Nearby Requests</h2>
              <div className="flex gap-2">
                <Link href="/map-view?view=list">
                  <Button variant="outline" size="sm" className="text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 flex items-center">
                    <i className="fas fa-list mr-2"></i> List
                  </Button>
                </Link>
                <Link href="/map-view">
                  <Button variant="default" size="sm" className="text-sm flex items-center">
                    <i className="fas fa-map-marked-alt mr-2"></i> Map
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="map-container rounded-xl shadow-md bg-slate-100 relative">
              {!isLoading && (
                <LocationMap 
                  requests={filteredRequests}
                  userLocation={userLocation}
                  onMarkerClick={handleMarkerClick}
                />
              )}
              
              {/* Map Controls Overlay */}
              <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-2 z-20">
                <button className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-slate-100 rounded">
                  <i className="fas fa-plus"></i>
                </button>
                <button className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-slate-100 rounded mt-1">
                  <i className="fas fa-minus"></i>
                </button>
                <hr className="my-1 border-slate-200" />
                <button
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(
                        (position) => {
                          const { latitude, longitude } = position.coords;
                          setUserLocation([latitude, longitude]);
                        }
                      );
                    }
                  }}
                  className="w-8 h-8 flex items-center justify-center text-primary hover:bg-slate-100 rounded"
                >
                  <i className="fas fa-location-arrow"></i>
                </button>
              </div>
              
              {/* Map Legend */}
              <div className="absolute bottom-4 left-4 bg-white bg-opacity-95 rounded-lg shadow-md p-3 z-20 text-sm">
                <div className="font-medium mb-2">Map Legend</div>
                <div className="flex items-center mb-1.5">
                  <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                  <span>Help Needed</span>
                </div>
                <div className="flex items-center mb-1.5">
                  <div className="w-3 h-3 rounded-full bg-secondary mr-2"></div>
                  <span>Help Offered</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-accent mr-2"></div>
                  <span>Your Location</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-4">
              <span className="text-sm text-slate-500">
                <i className="fas fa-info-circle mr-1"></i> Click on a marker to see request details
              </span>
            </div>
          </div>
        </section>
        
        <section className="py-12 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800">Recent Requests</h2>
              <Link href="/map-view?view=list">
                <button className="text-primary hover:text-indigo-700 text-sm font-medium">
                  View All <i className="fas fa-arrow-right ml-1"></i>
                </button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentRequests.map(request => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          </div>
        </section>
        
        <HowItWorks />
        <CommunitySpotlight />
        <CTASection />
      </main>
      
      <Footer />
      
      {/* Quick Post Button (Mobile) */}
      <div className="fixed bottom-6 right-6 md:hidden z-30">
        <Link href="/create-request">
          <button className="h-14 w-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center">
            <i className="fas fa-plus text-lg"></i>
          </button>
        </Link>
      </div>
    </div>
  );
}
