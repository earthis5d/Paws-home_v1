import { PawPrint, Mail, Phone, MapPin, Instagram, Twitter, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-warm-text text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <PawPrint className="text-primary w-8 h-8" />
              <span className="text-2xl font-display font-bold tracking-tight">Paws & Home</span>
            </Link>
            <p className="text-purple-100/70 leading-relaxed">
              Connecting loving families with pets in need. Every tail deserves a happy home.
            </p>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-6 text-primary">Quick Links</h4>
            <ul className="space-y-4 text-purple-100/70">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/pets" className="hover:text-white transition-colors">Browse Pets</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Shelter Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-6 text-primary">Contact Us</h4>
            <ul className="space-y-4 text-purple-100/70">
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <span>hello@pawsandhome.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <span>123 Pet Lane, Animal City</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-6 text-primary">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 text-center text-purple-100/40 text-sm">
          <p>© {new Date().getFullYear()} Paws & Home. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
