import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from './components/supabase';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Pets from './pages/Pets';
import PetDetail from './pages/PetDetail';
import Shelter from './pages/Shelter';
import Contact from './pages/Contact';
import Login from './pages/Login';

export default function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pets" element={<Pets />} />
            <Route path="/pet/:id" element={<PetDetail user={user} />} />
            <Route path="/shelter/:id" element={<Shelter />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
