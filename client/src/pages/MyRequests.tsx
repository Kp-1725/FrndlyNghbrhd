import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { RequestCard } from '@/components/RequestCard';
import { Button } from '@/components/ui/button';
import { Tab, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Request } from '@shared/schema';
import { Link } from 'wouter';

export default function MyRequests() {
  const { data: myRequests = [], isLoading: isLoadingMyRequests } = useQuery<Request[]>({
    queryKey: ['/api/my-requests'],
  });
  
  const { data: myOffers = [], isLoading: isLoadingMyOffers } = useQuery<Request[]>({
    queryKey: ['/api/my-offers'],
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow py-10 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800">My Requests</h1>
            <Link href="/create-request">
              <Button className="flex items-center">
                <i className="fas fa-plus mr-2"></i> New Request
              </Button>
            </Link>
          </div>
          
          <Tabs defaultValue="my-requests" className="mb-10">
            <TabsList className="mb-6">
              <TabsTrigger value="my-requests" className="px-6">
                <i className="fas fa-list-ul mr-2"></i> My Requests
              </TabsTrigger>
              <TabsTrigger value="my-offers" className="px-6">
                <i className="fas fa-hand-holding-heart mr-2"></i> My Offers
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="my-requests">
              {isLoadingMyRequests ? (
                <div className="text-center py-12">
                  <i className="fas fa-spinner fa-spin text-primary text-3xl"></i>
                  <p className="mt-4 text-slate-600">Loading your requests...</p>
                </div>
              ) : myRequests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myRequests.map(request => (
                    <RequestCard key={request.id} request={request} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-clipboard-list text-slate-400 text-xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">No requests yet</h3>
                  <p className="text-slate-600 mb-6">You haven't created any help requests yet.</p>
                  <Link href="/create-request">
                    <Button>
                      <i className="fas fa-plus mr-2"></i> Create a Request
                    </Button>
                  </Link>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="my-offers">
              {isLoadingMyOffers ? (
                <div className="text-center py-12">
                  <i className="fas fa-spinner fa-spin text-primary text-3xl"></i>
                  <p className="mt-4 text-slate-600">Loading your offers...</p>
                </div>
              ) : myOffers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myOffers.map(request => (
                    <RequestCard key={request.id} request={request} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-hand-holding-heart text-slate-400 text-xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">No offers yet</h3>
                  <p className="text-slate-600 mb-6">You haven't offered help on any requests yet.</p>
                  <Link href="/">
                    <Button>
                      <i className="fas fa-search mr-2"></i> Browse Requests
                    </Button>
                  </Link>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
