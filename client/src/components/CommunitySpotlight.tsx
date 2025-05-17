export function CommunitySpotlight() {
  return (
    <section className="py-12 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Community Spotlight</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">See how neighbors are helping each other every day</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="md:flex">
              <div className="md:w-1/3">
                <img 
                  src="https://images.unsplash.com/photo-1591278169757-deac26e49555?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=800" 
                  alt="Person helping elderly neighbor with groceries" 
                  className="h-full w-full object-cover" 
                />
              </div>
              <div className="p-6 md:w-2/3">
                <div className="flex items-center mb-2">
                  <span className="px-3 py-1 bg-primary bg-opacity-10 text-primary text-xs font-medium rounded-full">Success Story</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">"I couldn't have done it without my neighbor's help"</h3>
                <p className="text-slate-600 text-sm mb-4">After breaking my ankle, I couldn't get groceries. Janet from two blocks over helped me weekly for almost 2 months. We've become great friends!</p>
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-primary text-sm">
                    <i className="fas fa-user"></i>
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-slate-800">Eleanor, 67</div>
                    <div className="text-xs text-slate-500">Marina District</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="md:flex">
              <div className="md:w-1/3">
                <img 
                  src="https://pixabay.com/get/gd53dc0469cdb187d4570b911d2aeebd3bce458dd989631e73e643433e0611988c8e977992e2ac1890cfa2d5aa06d6f0afe0b87d86224c94bd7587a783cef3181_1280.jpg" 
                  alt="Community members working on service project" 
                  className="h-full w-full object-cover" 
                />
              </div>
              <div className="p-6 md:w-2/3">
                <div className="flex items-center mb-2">
                  <span className="px-3 py-1 bg-secondary bg-opacity-10 text-secondary text-xs font-medium rounded-full">Community Project</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">"What started as a small favor became a community event"</h3>
                <p className="text-slate-600 text-sm mb-4">I asked for help planting a garden at our local school. 12 neighbors showed up and we completed it in one day. The kids love it!</p>
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-secondary text-sm">
                    <i className="fas fa-user"></i>
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-slate-800">Marcus, 34</div>
                    <div className="text-xs text-slate-500">Sunset District</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
