import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart, MapPin, Phone, Mail, Calendar, Info, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '../components/supabase';

interface PetDetailProps {
  user: any;
}

export default function PetDetail({ user }: PetDetailProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState<any>(null);
  const [shelter, setShelter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [adopting, setAdopting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPetDetails() {
      setLoading(true);
      const { data: petData, error: petError } = await supabase
        .from('pets')
        .select('*')
        .eq('id', id)
        .single();

      if (!petError && petData) {
        setPet(petData);
        
        // Fetch shelter info
        const { data: shelterData } = await supabase
          .from('shelters')
          .select('*')
          .eq('id', petData.shelter_id)
          .single();
        
        if (shelterData) setShelter(shelterData);
      } else {
        // Fallback mock data
        const mockPet = {
          id: id,
          name: 'Buddy',
          breed: 'Golden Retriever',
          species: 'Dog',
          age: '2 years',
          gender: 'Male',
          size: 'Large',
          description: 'Buddy is a friendly and energetic Golden Retriever who loves to play fetch and go for long walks. He is great with children and other dogs. Buddy is looking for a loving home where he can get plenty of attention and exercise.',
          photo_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=1200',
          shelter_id: 's1'
        };
        const mockShelter = {
          id: 's1',
          name: 'Happy Tails Shelter',
          phone: '(555) 987-6543',
          email: 'contact@happytails.org',
          address: '456 Rescue Road, Animal City'
        };
        setPet(mockPet);
        setShelter(mockShelter);
      }
      setLoading(false);
    }
    fetchPetDetails();
  }, [id]);

  const handleAdopt = async () => {
    setAdopting(true);
    setError(null);

    try {
      // 1. Check if user is logged in
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        // 2. Redirect to login if not authenticated
        navigate('/login', { state: { from: `/pet/${id}` } });
        return;
      }

      // 3. Perform insert into adoption_requests
      const { error: insertError } = await supabase
        .from('adoption_requests')
        .insert([
          { 
            pet_id: id, 
            user_id: user.id, 
            shelter_id: pet.shelter_id, 
            status: 'pending',
            requested_at: new Date().toISOString()
          }
        ]);

      if (insertError) throw insertError;

      // 4. Show success message
      setSuccess(true);
    } catch (err: any) {
      console.error('Adoption error:', err);
      setError('Failed to submit adoption request. Please try again.');
    } finally {
      setAdopting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Pet not found</h2>
        <Link to="/pets" className="btn-primary">Back to Browse</Link>
      </div>
    );
  }

  return (
    <div className="bg-warm-bg min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-warm-muted hover:text-primary transition-colors mb-8 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Results
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="rounded-[2.5rem] overflow-hidden shadow-xl border-8 border-white aspect-square">
              <img 
                src={pet.photo_url} 
                alt={pet.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="rounded-2xl overflow-hidden border-4 border-white shadow-sm aspect-square opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                  <img src={pet.photo_url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Info Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-orange-100 text-primary px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
                  {pet.species}
                </span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
                  Available
                </span>
              </div>
              <h1 className="text-5xl font-display font-black text-warm-text mb-2">{pet.name}</h1>
              <p className="text-2xl text-warm-muted font-medium">{pet.breed}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Age', value: pet.age, icon: Calendar },
                { label: 'Gender', value: pet.gender, icon: Heart },
                { label: 'Size', value: pet.size, icon: Info },
                { label: 'Location', value: 'Animal City', icon: MapPin }
              ].map((item, i) => (
                <div key={i} className="bg-white p-4 rounded-2xl border border-orange-100 shadow-sm text-center">
                  <item.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-xs text-warm-muted/60 font-bold uppercase tracking-tighter mb-1">{item.label}</p>
                  <p className="font-bold text-warm-text">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="glass-card p-8">
              <h3 className="text-xl font-bold mb-4">About {pet.name}</h3>
              <p className="text-warm-muted leading-relaxed text-lg">
                {pet.description}
              </p>
            </div>

            <div className="glass-card p-8 bg-orange-50/50">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <HomeIcon className="w-6 h-6 text-primary" />
                Shelter Information
              </h3>
              <div className="space-y-4">
                <Link to={`/shelter/${shelter?.id}`} className="text-lg font-bold text-warm-text hover:text-primary transition-colors block">
                  {shelter?.name}
                </Link>
                <div className="flex flex-wrap gap-6 text-warm-muted">
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-primary" />
                    <span>{shelter?.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary" />
                    <span>{shelter?.email}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-4 flex items-center gap-3 text-sm font-medium border border-red-100">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  {error}
                </div>
              )}
              {success ? (
                <div className="bg-green-100 text-green-700 p-6 rounded-2xl flex items-center gap-4 animate-in zoom-in duration-300">
                  <CheckCircle2 className="w-10 h-10" />
                  <div>
                    <h4 className="font-bold text-lg">Application Sent!</h4>
                    <p>The shelter will review your request and contact you soon.</p>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={handleAdopt}
                  disabled={adopting}
                  className="w-full btn-primary py-5 text-xl flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {adopting ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Heart className="w-6 h-6 fill-current" />
                      Adopt {pet.name}
                    </>
                  )}
                </button>
              )}
              {!user && !success && (
                <p className="text-center text-sm text-warm-muted mt-4">
                  You'll need to <Link to="/login" className="text-primary font-bold hover:underline">login</Link> to submit an adoption request.
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function HomeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}
