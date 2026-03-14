import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Phone, Mail, Globe, Info, PawPrint, Plus, Upload, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '../components/supabase';
import PetCard from '../components/PetCard';

export default function Shelter() {
  const { id } = useParams();
  const [shelter, setShelter] = useState<any>(null);
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [newPet, setNewPet] = useState({
    name: '',
    species: 'Dog',
    breed: '',
    age: '',
    size: 'Medium',
    gender: 'Male',
    description: ''
  });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);

      const { data: shelterData, error: shelterError } = await supabase
        .from('shelters')
        .select('*')
        .eq('id', id)
        .single();

      if (!shelterError && shelterData) {
        setShelter(shelterData);
        
        const { data: petsData } = await supabase
          .from('pets')
          .select('*')
          .eq('shelter_id', id)
          .order('created_at', { ascending: false });
        
        if (petsData) setPets(petsData);
      } else {
        // Fallback mock data
        const mockShelter = {
          id: id,
          name: 'Happy Tails Shelter',
          description: 'Happy Tails Shelter is dedicated to rescuing, rehabilitating, and rehoming animals in need. We believe that every pet deserves a second chance at a happy life. Our facility provides a safe and loving environment for dogs, cats, and small animals until they find their forever families.',
          phone: '(555) 987-6543',
          email: 'contact@happytails.org',
          address: '456 Rescue Road, Animal City',
          website: 'www.happytails.org',
          photo_url: 'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?auto=format&fit=crop&q=80&w=1200'
        };
        const mockPets = [
          { id: '1', name: 'Buddy', breed: 'Golden Retriever', photo_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=600' },
          { id: '4', name: 'Bella', breed: 'Tabby Cat', photo_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600' },
        ];
        setShelter(mockShelter);
        setPets(mockPets);
      }
      setLoading(false);
    }
    fetchData();
  }, [id]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const handleSubmitPet = async (e: FormEvent) => {
    e.preventDefault();
    if (!photoFile) {
      setSubmitError('Please select a photo for the pet.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      // 1. Upload photo to storage
      const fileExt = photoFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('pet-photos')
        .upload(filePath, photoFile);

      if (uploadError) throw uploadError;

      // 2. Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('pet-photos')
        .getPublicUrl(filePath);

      // 3. Save pet record
      const { data: petData, error: insertError } = await supabase
        .from('pets')
        .insert([
          {
            ...newPet,
            shelter_id: id,
            photo_url: publicUrl,
            status: 'available'
          }
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      // Update local state
      setPets([petData, ...pets]);
      setSubmitSuccess(true);
      
      // Reset form after delay
      setTimeout(() => {
        setShowAddForm(false);
        setSubmitSuccess(false);
        setNewPet({
          name: '',
          species: 'Dog',
          breed: '',
          age: '',
          size: 'Medium',
          gender: 'Male',
          description: ''
        });
        setPhotoFile(null);
      }, 2000);

    } catch (err: any) {
      console.error('Error adding pet:', err);
      setSubmitError(err.message || 'Failed to add pet. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const isOwner = currentUser && shelter && currentUser.id === shelter.user_id;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!shelter) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Shelter not found</h2>
        <Link to="/" className="btn-primary">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="bg-warm-bg min-h-screen pb-24">
      {/* Header / Cover */}
      <div className="relative h-80 overflow-hidden">
        <img 
          src={shelter.photo_url || 'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?auto=format&fit=crop&q=80&w=1200'} 
          alt={shelter.name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-warm-text/80 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl md:text-6xl font-display font-black text-white mb-4">{shelter.name}</h1>
              <div className="flex flex-wrap gap-6 text-purple-100/90 font-medium">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>{shelter.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <PawPrint className="w-5 h-5 text-primary" />
                  <span>{pets.length} Pets Available</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Sidebar Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="glass-card p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Info className="w-6 h-6 text-primary" />
                Contact Details
              </h3>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="bg-purple-50 p-3 rounded-xl">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-warm-muted uppercase tracking-wider mb-1">Phone</p>
                    <p className="font-bold text-warm-text">{shelter.phone}</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-purple-50 p-3 rounded-xl">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-warm-muted uppercase tracking-wider mb-1">Email</p>
                    <p className="font-bold text-warm-text">{shelter.email}</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-purple-50 p-3 rounded-xl">
                    <Globe className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-warm-muted uppercase tracking-wider mb-1">Website</p>
                    <a href={`https://${shelter.website}`} target="_blank" rel="noopener noreferrer" className="font-bold text-primary hover:underline">
                      {shelter.website}
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-primary p-8 rounded-[2rem] text-white shadow-lg shadow-primary/20">
              <h3 className="text-xl font-bold mb-4">Support This Shelter</h3>
              <p className="text-purple-50 mb-6 leading-relaxed">
                Your donations help us provide food, medical care, and shelter for animals in need.
              </p>
              <button className="w-full bg-white text-primary font-bold py-4 rounded-2xl hover:bg-purple-50 transition-colors">
                Donate Now
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-3xl font-display font-bold text-warm-text mb-6">About Us</h2>
              <div className="glass-card p-8">
                <p className="text-warm-muted text-lg leading-relaxed">
                  {shelter.description}
                </p>
              </div>
            </section>

            <section>
              <div className="flex justify-between items-end mb-8">
                <h2 className="text-3xl font-display font-bold text-warm-text">Available Pets</h2>
                <div className="flex items-center gap-4">
                  <span className="text-warm-muted font-medium hidden sm:inline">{pets.length} furry friends</span>
                  {isOwner && (
                    <button 
                      onClick={() => setShowAddForm(true)}
                      className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                    >
                      <Plus className="w-5 h-5" />
                      Add Pet
                    </button>
                  )}
                </div>
              </div>

              <AnimatePresence>
                {showAddForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mb-12"
                  >
                    <div className="glass-card p-8 relative">
                      <button 
                        onClick={() => setShowAddForm(false)}
                        className="absolute top-6 right-6 p-2 hover:bg-purple-50 rounded-xl transition-colors"
                      >
                        <X className="w-6 h-6 text-warm-muted" />
                      </button>

                      <h3 className="text-2xl font-display font-bold text-warm-text mb-8">Add a New Pet</h3>

                      {submitSuccess ? (
                        <div className="bg-green-50 text-green-700 p-8 rounded-3xl flex flex-col items-center text-center gap-4 animate-in zoom-in duration-300">
                          <CheckCircle2 className="w-16 h-16" />
                          <div>
                            <p className="text-xl font-bold">Pet Added Successfully!</p>
                            <p className="opacity-80">Your new friend is now listed for adoption.</p>
                          </div>
                        </div>
                      ) : (
                        <form onSubmit={handleSubmitPet} className="space-y-6">
                          {submitError && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm font-medium border border-red-100">
                              <AlertCircle className="w-5 h-5 shrink-0" />
                              {submitError}
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-warm-muted uppercase tracking-wider">Pet Name</label>
                              <input 
                                type="text"
                                required
                                value={newPet.name}
                                onChange={(e) => setNewPet({...newPet, name: e.target.value})}
                                className="w-full px-5 py-4 bg-white border border-purple-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                placeholder="e.g. Buddy"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-warm-muted uppercase tracking-wider">Species</label>
                              <select 
                                value={newPet.species}
                                onChange={(e) => setNewPet({...newPet, species: e.target.value})}
                                className="w-full px-5 py-4 bg-white border border-purple-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                              >
                                <option>Dog</option>
                                <option>Cat</option>
                                <option>Rabbit</option>
                                <option>Other</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-warm-muted uppercase tracking-wider">Breed</label>
                              <input 
                                type="text"
                                required
                                value={newPet.breed}
                                onChange={(e) => setNewPet({...newPet, breed: e.target.value})}
                                className="w-full px-5 py-4 bg-white border border-purple-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                placeholder="e.g. Golden Retriever"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-warm-muted uppercase tracking-wider">Age</label>
                              <input 
                                type="text"
                                required
                                value={newPet.age}
                                onChange={(e) => setNewPet({...newPet, age: e.target.value})}
                                className="w-full px-5 py-4 bg-white border border-purple-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                placeholder="e.g. 2 years"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-warm-muted uppercase tracking-wider">Size</label>
                              <select 
                                value={newPet.size}
                                onChange={(e) => setNewPet({...newPet, size: e.target.value})}
                                className="w-full px-5 py-4 bg-white border border-purple-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                              >
                                <option>Small</option>
                                <option>Medium</option>
                                <option>Large</option>
                                <option>Extra Large</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-warm-muted uppercase tracking-wider">Gender</label>
                              <select 
                                value={newPet.gender}
                                onChange={(e) => setNewPet({...newPet, gender: e.target.value})}
                                className="w-full px-5 py-4 bg-white border border-purple-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                              >
                                <option>Male</option>
                                <option>Female</option>
                              </select>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-bold text-warm-muted uppercase tracking-wider">Description</label>
                            <textarea 
                              required
                              rows={4}
                              value={newPet.description}
                              onChange={(e) => setNewPet({...newPet, description: e.target.value})}
                              className="w-full px-5 py-4 bg-white border border-purple-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                              placeholder="Tell us about this pet's personality..."
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-bold text-warm-muted uppercase tracking-wider">Pet Photo</label>
                            <div className="relative group">
                              <input 
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                              />
                              <div className={`w-full px-5 py-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 transition-all ${photoFile ? 'border-primary bg-purple-50' : 'border-purple-100 hover:border-primary/50'}`}>
                                <div className={`p-3 rounded-xl ${photoFile ? 'bg-primary text-white' : 'bg-purple-50 text-primary'}`}>
                                  <Upload className="w-6 h-6" />
                                </div>
                                <div className="text-center">
                                  <p className="font-bold text-warm-text">
                                    {photoFile ? photoFile.name : 'Click or drag to upload photo'}
                                  </p>
                                  <p className="text-xs text-warm-muted mt-1">PNG, JPG or WEBP (Max 5MB)</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <button 
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-primary text-white font-bold py-4 rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            {submitting ? (
                              <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Adding Pet...
                              </>
                            ) : (
                              'Add Pet Listing'
                            )}
                          </button>
                        </form>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {pets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pets.map((pet, index) => (
                    <motion.div
                      key={pet.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <PetCard pet={pet} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 glass-card">
                  <p className="text-warm-muted italic">No pets currently listed for adoption.</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
