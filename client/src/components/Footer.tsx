export function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Friendly<span className="text-secondary">Neighbourhood</span></h3>
            <p className="text-slate-400 text-sm">Connecting neighbors, building community, one request at a time.</p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-slate-400 hover:text-white">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="text-slate-400 hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-slate-400 hover:text-white">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Features</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-slate-400 hover:text-white">Post Requests</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white">Browse Map</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white">Community Stories</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white">Help Categories</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-slate-400 hover:text-white">Safety Guidelines</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white">Community Standards</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white">Help Center</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-slate-400 hover:text-white">About Us</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white">Careers</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">© 2023 FriendlyNeighbourhood. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <select className="bg-slate-800 text-slate-300 text-sm rounded-lg px-3 py-1.5 border border-slate-700">
              <option>English (US)</option>
              <option>Español</option>
              <option>Français</option>
              <option>中文</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
}
