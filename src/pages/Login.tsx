import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight, PawPrint, AlertCircle } from 'lucide-react';
import { supabase } from '../components/supabase';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Check your email for the confirmation link!');
      }
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-bg flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="bg-primary p-3 rounded-2xl group-hover:rotate-12 transition-transform shadow-lg shadow-primary/20">
              <PawPrint className="text-white w-8 h-8" />
            </div>
            <span className="text-3xl font-display font-black text-warm-text tracking-tight">Paws & Home</span>
          </Link>
          <h2 className="text-3xl font-display font-bold text-warm-text">
            {isLogin ? 'Welcome Back!' : 'Join the Family'}
          </h2>
          <p className="text-warm-muted mt-2">
            {isLogin ? 'Login to manage your adoptions' : 'Create an account to start adopting'}
          </p>
        </div>

        <div className="glass-card p-8 md:p-10">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-3 text-sm font-medium border border-red-100">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-warm-muted uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-muted/40" />
                <input 
                  required
                  type="email" 
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-4 bg-warm-bg border border-purple-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-warm-muted uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-muted/40" />
                <input 
                  required
                  type="password" 
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-warm-bg border border-purple-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full btn-primary py-5 text-xl flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Login' : 'Sign Up'}
                  <ArrowRight className="w-6 h-6" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-purple-100 text-center">
            <p className="text-warm-muted">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-primary font-bold hover:underline"
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </div>
        </div>
        
        <p className="text-center mt-8 text-sm text-warm-muted/60">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
