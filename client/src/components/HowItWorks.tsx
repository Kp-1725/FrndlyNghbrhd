export function HowItWorks() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">How It Works</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">A simple process to connect neighbors and strengthen your community</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-indigo-100 h-16 w-16 rounded-full mx-auto flex items-center justify-center text-primary text-xl mb-4">
              <i className="fas fa-edit"></i>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Post a Request</h3>
            <p className="text-slate-600 text-sm">Describe what you need help with, select a category, and set your location</p>
          </div>
          
          <div className="text-center">
            <div className="bg-emerald-100 h-16 w-16 rounded-full mx-auto flex items-center justify-center text-secondary text-xl mb-4">
              <i className="fas fa-search"></i>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Connect with Neighbors</h3>
            <p className="text-slate-600 text-sm">Browse nearby requests or wait for community members to respond to yours</p>
          </div>
          
          <div className="text-center">
            <div className="bg-amber-100 h-16 w-16 rounded-full mx-auto flex items-center justify-center text-amber-600 text-xl mb-4">
              <i className="fas fa-handshake"></i>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Help Each Other</h3>
            <p className="text-slate-600 text-sm">Meet up safely and solve problems together, building a stronger community</p>
          </div>
        </div>
      </div>
    </section>
  );
}
