import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Search, Heart, Home as HomeIcon, ArrowRight, Sparkles, Users, PawPrint } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../components/supabase';
import PetCard from '../components/PetCard';

export default function Home() {
  const [featuredPets, setFeaturedPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalPets: 0, totalShelters: 0, totalAdoptions: 0 });

  useEffect(() => {
    async function fetchData() {
      // Fetch featured pets
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .limit(4);
      
      if (!error && data) {
        setFeaturedPets(data);
      } else {
        // Fallback mock data
        setFeaturedPets([
          { id: '1', name: 'Buddy', breed: 'Golden Retriever', photo_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=600', location: 'Happy Tails Shelter' },
          { id: '2', name: 'Luna', breed: 'Siamese Cat', photo_url: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&q=80&w=600', location: 'City Animal Care' },
          { id: '3', name: 'Max', breed: 'Beagle', photo_url: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=600', location: 'Rescue Me' },
          { id: '4', name: 'Bella', breed: 'Tabby Cat', photo_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600', location: 'Happy Tails Shelter' },
        ]);
      }

      // Fetch global stats from our new backend API
      try {
        const response = await fetch('/api/admin/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }

      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-purple-100/50 via-transparent to-transparent -z-10" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-purple-100 text-primary px-4 py-2 rounded-full text-sm font-bold mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Over 500+ pets found homes this month</span>
            </div>
            <h1 className="text-6xl lg:text-7xl font-display font-black text-warm-text leading-[1.1] mb-8">
              Find Your Furry <span className="text-primary">Best Friend</span> at Paws & Home.
            </h1>
            <p className="text-xl text-warm-muted mb-10 leading-relaxed max-w-lg">
              We connect loving families with pets in need of a forever home. Browse our adorable residents and start your adoption journey today.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/pets" className="btn-primary text-lg px-10 py-4 flex items-center gap-2">
                Browse Pets
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/contact" className="btn-outline text-lg px-10 py-4">
                Learn More
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white">
              <img 
                src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&q=80&w=1200" 
                alt="Happy dog and cat"
                className="w-full h-[500px] object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary rounded-full -z-10 blur-3xl opacity-20" />
            <div className="absolute -top-10 -right-10 w-60 h-60 bg-purple-300 rounded-full -z-10 blur-3xl opacity-20" />
          </motion.div>
        </div>
      </section>

      {/* Featured Pets */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {[
              { label: 'Pets Available', value: stats.totalPets || 120, icon: PawPrint },
              { label: 'Partner Shelters', value: stats.totalShelters || 45, icon: HomeIcon },
              { label: 'Happy Adoptions', value: stats.totalAdoptions || 850, icon: Heart }
            ].map((stat, i) => (
              <div key={i} className="bg-purple-50/50 p-8 rounded-[2rem] flex items-center gap-6 border border-purple-100">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="text-4xl font-display font-black text-warm-text">{stat.value}+</p>
                  <p className="text-warm-muted font-bold uppercase tracking-wider text-xs">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-display font-bold text-warm-text mb-4">Meet Our Residents</h2>
              <p className="text-warm-muted">These adorable friends are waiting for a loving home.</p>
            </div>
            <Link to="/pets" className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all">
              View All Pets <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              [1, 2, 3, 4].map(i => (
                <div key={i} className="h-96 bg-purple-50 rounded-2xl animate-pulse" />
              ))
            ) : (
              featuredPets.map((pet, index) => (
                <motion.div
                  key={pet.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PetCard pet={pet} />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-warm-bg relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-display font-bold text-warm-text mb-6">How It Works</h2>
            <p className="text-warm-muted">Adopting a pet is a journey of love. We make it simple and transparent for everyone involved.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Search, title: 'Browse & Find', desc: 'Search through our database of pets to find your perfect match.' },
              { icon: Heart, title: 'Meet & Greet', desc: 'Schedule a visit to meet your potential new family member.' },
              { icon: HomeIcon, title: 'Adopt & Home', desc: 'Complete the paperwork and take your new best friend home!' }
            ].map((step, i) => (
              <div key={i} className="text-center group">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-300 group-hover:-translate-y-2">
                  <step.icon className="w-10 h-10 text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl font-display font-bold text-warm-text mb-4">{step.title}</h3>
                <p className="text-warm-muted leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto bg-warm-text rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl -ml-32 -mb-32" />
          
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-8 relative z-10">
            Ready to change a life?
          </h2>
          <p className="text-purple-100/70 text-xl mb-12 max-w-xl mx-auto relative z-10">
            Join thousands of happy families who found their best friends through Paws & Home.
          </p>
          <Link to="/pets" className="btn-primary text-lg px-12 py-4 relative z-10">
            Start Browsing Now
          </Link>
        </div>
      </section>
    </div>
  );
}
