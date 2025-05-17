import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation, useRoute, Link } from 'wouter';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { LocationMap } from '@/components/LocationMap';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LatLngTuple } from 'leaflet';
import { formatDistanceToNow, categoryConfig } from '@/lib/utils';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Request } from '@shared/schema';

export default function RequestDetail() {
  const [, navigate] = useLocation();
  const [, params] = useRoute('/request/:id');
  const requestId = params?.id ? parseInt(params.id) : null;
  
  const [userLocation, setUserLocation] = useState<LatLngTuple>([37.7749, -122.4194]); // Default to San Francisco
  
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
  
  const { data: request, isLoading, isError } = useQuery<Request>({
    queryKey: ['/api/requests', requestId],
    queryFn: async ({ queryKey }) => {
      const [_, id] = queryKey;
      const res = await fetch(`/api/requests/${id}`);
      if (!res.ok) throw new Error('Failed to fetch request');
      return res.json();
    },
    enabled: requestId !== null
  });
  
  const offerHelpMutation = useMutation({
    mutationFn: async () => {
      if (!requestId) throw new Error('No request ID provided');
      return await apiRequest('POST', `/api/requests/${requestId}/offers`, {
        message: 'I would like to help with your request!'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/requests', requestId] });
    }
  });
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow py-10 bg-slate-50 flex items-center justify-center">
          <div className="text-center">
            <i className="fas fa-spinner fa-spin text-primary text-3xl"></i>
            <p className="mt-4 text-slate-600">Loading request details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (isError || !request) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow py-10 bg-slate-50 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="text-center">
                <i className="fas fa-exclamation-circle text-red-500 text-3xl"></i>
                <h1 className="mt-4 text-xl font-semibold text-slate-800">Request Not Found</h1>
                <p className="mt-2 text-slate-600">The request you're looking for doesn't exist or has been removed.</p>
                <Button className="mt-6" onClick={() => navigate('/')}>
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }
  
  const categoryInfo = categoryConfig[request.category];
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  const formattedDate = formatDistanceToNow(new Date(request.createdAt));
  const requestLocation: LatLngTuple = [request.location.lat, request.location.lng];
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow py-10 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link href="/">
              <a className="text-primary hover:text-indigo-700 flex items-center">
                <i className="fas fa-arrow-left mr-2"></i> Back to all requests
              </a>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className={`${categoryInfo.bgColor} ${categoryInfo.textColor}`}>
                      <i className={`${categoryInfo.icon} mr-2`}></i> {categoryInfo.label}
                    </Badge>
                    <span className="text-sm text-slate-500">Posted {formattedDate}</span>
                  </div>
                  <CardTitle className="text-2xl font-bold text-slate-800">{request.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none mb-8">
                    <p className="text-slate-600">{request.description}</p>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold mb-4">Location</h3>
                    <div className="h-64 bg-slate-100 rounded-xl overflow-hidden mb-3">
                      <LocationMap 
                        requests={[]}
                        userLocation={userLocation}
                        selectedLocation={requestLocation}
                        height="100%"
                      />
                    </div>
                    <div className="flex items-center text-sm text-slate-500">
                      <i className="fas fa-map-marker-alt text-secondary mr-2"></i>
                      {request.location.neighborhood && request.location.city 
                        ? `${request.location.neighborhood}, ${request.location.city}`
                        : 'Location set by requester'}
                      <span className="ml-auto">{request.distance} miles away</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-1">
              <Card className="shadow-md mb-6">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">About the requester</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-4">
                    <Avatar className="h-16 w-16 mr-4">
                      <AvatarFallback 
                        bgColor={categoryInfo.bgColor} 
                        textColor={categoryInfo.textColor}
                        className="text-lg"
                      >
                        {getInitials(request.user.username)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{request.user.username}</h3>
                      <p className="text-sm text-slate-500">{request.location.neighborhood || 'Local area'}</p>
                      <div className="text-sm text-slate-500 mt-1">Member since 2023</div>
                    </div>
                  </div>
                  
                  <Button className="w-full mb-3" onClick={() => offerHelpMutation.mutate()}>
                    {offerHelpMutation.isPending ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i> Sending...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-handshake mr-2"></i> Offer Help
                      </>
                    )}
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <i className="fas fa-comment mr-2"></i> Message
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Safety Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-slate-600">
                    <li className="flex">
                      <i className="fas fa-check-circle text-secondary mt-1 mr-2"></i>
                      <span>Meet in public places whenever possible</span>
                    </li>
                    <li className="flex">
                      <i className="fas fa-check-circle text-secondary mt-1 mr-2"></i>
                      <span>Let someone know your plans</span>
                    </li>
                    <li className="flex">
                      <i className="fas fa-check-circle text-secondary mt-1 mr-2"></i>
                      <span>Trust your instincts</span>
                    </li>
                    <li className="flex">
                      <i className="fas fa-check-circle text-secondary mt-1 mr-2"></i>
                      <span>Review profiles and ratings</span>
                    </li>
                  </ul>
                  <Button variant="link" className="px-0 mt-2 text-primary">
                    Read our full safety guidelines
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
