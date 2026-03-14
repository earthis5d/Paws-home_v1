import { Link } from 'react-router-dom';
import { Heart, MapPin } from 'lucide-react';

interface PetCardProps {
  pet: {
    id: string;
    name: string;
    breed: string;
    photo_url: string;
    location?: string;
    age?: string;
  };
}

export default function PetCard({ pet }: PetCardProps) {
  return (
    <div className="glass-card overflow-hidden group hover:shadow-xl transition-all duration-300">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={pet.photo_url || `https://picsum.photos/seed/${pet.id}/600/400`} 
          alt={pet.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 right-4">
          <button className="bg-white/90 p-2 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-colors shadow-sm">
            <Heart className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-display font-bold text-warm-text">{pet.name}</h3>
          <span className="bg-orange-100 text-primary text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">
            {pet.age || 'Young'}
          </span>
        </div>
        <p className="text-warm-muted mb-4 font-medium">{pet.breed}</p>
        
        <div className="flex items-center gap-2 text-sm text-warm-muted/70 mb-6">
          <MapPin className="w-4 h-4" />
          <span>{pet.location || 'Local Shelter'}</span>
        </div>

        <Link 
          to={`/pet/${pet.id}`} 
          className="block w-full text-center py-3 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-all"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
