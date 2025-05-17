import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function CTASection() {
  return (
    <section className="py-16 bg-primary bg-opacity-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="p-8 md:w-2/3">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">Ready to connect with your neighbors?</h2>
              <p className="text-slate-600 mb-6">Join our growing community and start making a difference in your neighborhood today.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/create-request">
                  <Button size="xl">
                    Get Started
                  </Button>
                </Link>
                <Link href="/map-view">
                  <Button variant="outlinePrimary" size="xl">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/3 relative">
              <img 
                src="https://images.unsplash.com/photo-1560252829-804f1aedf1be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=800" 
                alt="Neighbors helping each other in community" 
                className="h-full w-full object-cover" 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
