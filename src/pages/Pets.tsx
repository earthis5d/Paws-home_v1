import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Filter, Search, X } from 'lucide-react';
import { supabase } from '../components/supabase';
import PetCard from '../components/PetCard';

export default function Pets() {
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    species: '',
    size: '',
    search: ''
  });

  useEffect(() => {
    async function fetchPets() {
      setLoading(true);
      let query = supabase.from('pets').select('*');

      if (filters.species) {
        query = query.eq('species', filters.species);
      }
      if (filters.size) {
        query = query.eq('size', filters.size);
      }
      if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      const { data, error } = await query;
      
      if (!error && data) {
        setPets(data);
      } else {
        // Fallback mock data
        const mockPets = [
          { id: '1', name: 'Buddy', breed: 'Golden Retriever', species: 'Dog', size: 'Large', photo_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=600' },
          { id: '2', name: 'Luna', breed: 'Siamese Cat', species: 'Cat', size: 'Small', photo_url: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&q=80&w=600' },
          { id: '3', name: 'Max', breed: 'Beagle', species: 'Dog', size: 'Medium', photo_url: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=600' },
          { id: '4', name: 'Bella', breed: 'Tabby Cat', species: 'Cat', size: 'Small', photo_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600' },
          { id: '5', name: 'Charlie', breed: 'Poodle', species: 'Dog', size: 'Medium', photo_url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=600' },
          { id: '6', name: 'Oliver', breed: 'Maine Coon', species: 'Cat', size: 'Large', photo_url: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=600' },
        ];
        
        // Apply local filtering for mock data
        let filtered = mockPets;
        if (filters.species) filtered = filtered.filter(p => p.species === filters.species);
        if (filters.size) filtered = filtered.filter(p => p.size === filters.size);
        if (filters.search) filtered = filtered.filter(p => p.name.toLowerCase().includes(filters.search.toLowerCase()));
        
        setPets(filtered);
      }
      setLoading(false);
    }
    fetchPets();
  }, [filters]);

  const clearFilters = () => {
    setFilters({ species: '', size: '', search: '' });
  };

  return (
    <div className="bg-warm-bg min-h-screen pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-5xl font-display font-bold text-warm-text mb-4">Browse Our Pets</h1>
          <p className="text-warm-muted text-lg">Find your perfect companion among our adorable residents.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            <div className="glass-card p-8 sticky top-24">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 font-bold text-warm-text">
                  <Filter className="w-5 h-5 text-primary" />
                  <span>Filters</span>
                </div>
                {(filters.species || filters.size || filters.search) && (
                  <button 
                    onClick={clearFilters}
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    <X className="w-3 h-3" /> Clear
                  </button>
                )}
              </div>

              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-bold text-warm-muted uppercase tracking-wider mb-3">Search Name</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-muted/50" />
                    <input 
                      type="text" 
                      placeholder="Search..."
                      className="w-full pl-10 pr-4 py-3 bg-warm-bg border border-purple-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-warm-muted uppercase tracking-wider mb-3">Species</label>
                  <div className="space-y-2">
                    {['Dog', 'Cat'].map(s => (
                      <button
                        key={s}
                        onClick={() => setFilters({ ...filters, species: filters.species === s ? '' : s })}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                          filters.species === s 
                          ? 'bg-primary text-white shadow-md' 
                          : 'bg-warm-bg text-warm-text hover:bg-purple-50 border border-purple-100'
                        }`}
                      >
                        {s}s
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-warm-muted uppercase tracking-wider mb-3">Size</label>
                  <select 
                    className="w-full px-4 py-3 bg-warm-bg border border-purple-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    value={filters.size}
                    onChange={(e) => setFilters({ ...filters, size: e.target.value })}
                  >
                    <option value="">All Sizes</option>
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                  </select>
                </div>
              </div>
            </div>
          </aside>

          {/* Pet Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-[450px] bg-white rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : pets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {pets.map((pet, index) => (
                  <motion.div
                    key={pet.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <PetCard pet={pet} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 glass-card">
                <div className="bg-purple-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-primary/30" />
                </div>
                <h3 className="text-2xl font-display font-bold text-warm-text mb-2">No pets found</h3>
                <p className="text-warm-muted mb-8">Try adjusting your filters to find more furry friends.</p>
                <button onClick={clearFilters} className="btn-primary">Clear All Filters</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
