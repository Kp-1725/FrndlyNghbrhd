import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { LocationMap } from '@/components/LocationMap';
import { CategoryList } from '@/components/CategoryList';
import { RequestCard } from '@/components/RequestCard';
import { Button } from '@/components/ui/button';
import { useLocation, useRoute } from 'wouter';
import { LatLngTuple } from 'leaflet';
import { CategoryType } from '@/lib/utils';
import { Request } from '@shared/schema';

export default function MapView() {
  const [location, navigate] = useLocation();
  const [, params] = useRoute('/map-view');
  
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const viewParam = searchParams.get('view');
  
  const [view, setView] = useState<'map' | 'list'>(viewParam === 'list' ? 'list' : 'map');
  const [userLocation, setUserLocation] = useState<LatLngTuple>([37.7749, -122.4194]); // Default to San Francisco
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | undefined>();
  
  // Get user's geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    }
  }, []);
  
  const { data: requests = [], isLoading } = useQuery<Request[]>({
    queryKey: ['/api/requests'],
  });
  
  const filteredRequests = selectedCategory 
    ? requests.filter(request => request.category === selectedCategory)
    : requests;
  
  const handleCategorySelect = (category: CategoryType) => {
    setSelectedCategory(category === selectedCategory ? undefined : category);
  };
  
  const toggleView = (newView: 'map' | 'list') => {
    setView(newView);
    const params = new URLSearchParams();
    if (newView === 'list') {
      params.set('view', 'list');
    }
    navigate(`/map-view${newView === 'list' ? '?view=list' : ''}`);
  };
  
  const handleMarkerClick = (requestId: number) => {
    navigate(`/request/${requestId}`);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow py-10 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Browse Nearby Requests</h1>
            
            <div className="mb-8">
              <CategoryList 
                selectedCategory={selectedCategory}
                onCategorySelect={handleCategorySelect}
              />
            </div>
            
            <div className="flex justify-between items-center mb-6">
              <div className="text-slate-600">
                {filteredRequests.length} {filteredRequests.length === 1 ? 'request' : 'requests'} found
                {selectedCategory && ` in ${selectedCategory}`}
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={view === 'list' ? 'default' : 'outline'} 
                  size="sm" 
                  className="text-sm flex items-center"
                  onClick={() => toggleView('list')}
                >
                  <i className="fas fa-list mr-2"></i> List
                </Button>
                <Button 
                  variant={view === 'map' ? 'default' : 'outline'} 
                  size="sm" 
                  className="text-sm flex items-center"
                  onClick={() => toggleView('map')}
                >
                  <i className="fas fa-map-marked-alt mr-2"></i> Map
                </Button>
              </div>
            </div>
          </div>
          
          {view === 'map' ? (
            <div className="map-container rounded-xl shadow-md bg-slate-100 relative">
              {!isLoading && (
                <LocationMap 
                  requests={filteredRequests}
                  userLocation={userLocation}
                  onMarkerClick={handleMarkerClick}
                  height="70vh"
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
          ) : (
            <>
              {isLoading ? (
                <div className="text-center py-12">
                  <i className="fas fa-spinner fa-spin text-primary text-3xl"></i>
                  <p className="mt-4 text-slate-600">Loading requests...</p>
                </div>
              ) : filteredRequests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRequests.map(request => (
                    <RequestCard key={request.id} request={request} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-map-marker-slash text-slate-400 text-xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">No requests found</h3>
                  <p className="text-slate-600 mb-6">
                    {selectedCategory 
                      ? `There are no ${selectedCategory} requests in your area right now.` 
                      : 'There are no requests in your area right now.'}
                  </p>
                  <Button onClick={() => setSelectedCategory(undefined)}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      
      <Footer />
      
      {/* Quick Post Button (Mobile) */}
      <div className="fixed bottom-6 right-6 md:hidden z-30">
        <Button 
          className="h-14 w-14 rounded-full flex items-center justify-center"
          onClick={() => navigate('/create-request')}
        >
          <i className="fas fa-plus text-lg"></i>
        </Button>
      </div>
    </div>
  );
}
