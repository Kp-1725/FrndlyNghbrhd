import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { LocationMap } from '@/components/LocationMap';
import { CategoryList } from '@/components/CategoryList';
import { Button } from '@/components/ui/button';
import { CategoryType } from '@/lib/utils';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { LatLngTuple } from 'leaflet';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { insertRequestSchema } from '@shared/schema';

// Extend the schema with client-side validation
const createRequestSchema = insertRequestSchema.extend({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }).max(100),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }).max(500),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
  }),
  category: z.string(),
});

type FormValues = z.infer<typeof createRequestSchema>;

export default function CreateRequest() {
  const [, navigate] = useLocation();
  const [userLocation, setUserLocation] = useState<LatLngTuple>([37.7749, -122.4194]); // Default to San Francisco
  const [selectedLocation, setSelectedLocation] = useState<LatLngTuple | null>(null);

  // Get user's geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setSelectedLocation([latitude, longitude]);
          
          // Update the form with the location
          form.setValue('location', {
            lat: latitude,
            lng: longitude,
            neighborhood: 'Your neighborhood', // This would be from reverse geocoding in a real app
            city: 'Your city'
          });
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    }
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(createRequestSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'groceries',
      location: {
        lat: userLocation[0],
        lng: userLocation[1],
        neighborhood: 'Downtown',
        city: 'San Francisco'
      }
    }
  });

  const createRequestMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      return await apiRequest('POST', '/api/requests', values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/requests'] });
      navigate('/');
    }
  });

  function onSubmit(values: FormValues) {
    createRequestMutation.mutate(values);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow py-10 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-slate-800">Create a New Request</CardTitle>
              <CardDescription>
                Let your neighbors know what you need help with. Be specific and clear about your request.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Need help with grocery shopping" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Please describe what you need help with in detail..." 
                            className="min-h-32"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-3">
                    <FormLabel>Category</FormLabel>
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="w-full">
                              <CategoryList 
                                selectedCategory={field.value as CategoryType} 
                                onCategorySelect={(category) => {
                                  field.onChange(category);
                                }}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <FormLabel>Location</FormLabel>
                    <p className="text-sm text-slate-500 mb-2">
                      Click on the map to set the location for your request, or use your current location.
                    </p>
                    
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="w-full h-80 bg-slate-100 rounded-xl overflow-hidden">
                              <LocationMap 
                                requests={[]}
                                userLocation={userLocation}
                                selectable={true}
                                selectedLocation={selectedLocation || undefined}
                                onSelectLocation={(location) => {
                                  setSelectedLocation(location);
                                  field.onChange({
                                    lat: location[0],
                                    lng: location[1],
                                    neighborhood: field.value.neighborhood,
                                    city: field.value.city
                                  });
                                }}
                                height="100%"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        onClick={(e) => {
                          e.preventDefault();
                          if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(
                              (position) => {
                                const { latitude, longitude } = position.coords;
                                setUserLocation([latitude, longitude]);
                                setSelectedLocation([latitude, longitude]);
                                
                                form.setValue('location', {
                                  lat: latitude,
                                  lng: longitude,
                                  neighborhood: form.getValues().location.neighborhood,
                                  city: form.getValues().location.city
                                });
                              }
                            );
                          }
                        }}
                      >
                        <i className="fas fa-location-arrow mr-2"></i> Use My Location
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-4 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={createRequestMutation.isPending}
                    >
                      {createRequestMutation.isPending ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i> Creating...
                        </>
                      ) : (
                        'Create Request'
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
