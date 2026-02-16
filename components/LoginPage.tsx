import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, User, ArrowRight, Loader2, Sparkles, UserCheck } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login, signup, loginGuest, error, isLoading, setError } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(email, password).catch(err => setError(err.message));
      } else {
        await signup(name, email, password).catch(err => setError(err.message));
      }
    } catch (e) {
      // Error handled in context or catch above
    }
  };
  
  const handleGuestLogin = () => {
    loginGuest();
  };

  const toggleMode = () => {
      setIsLogin(!isLogin);
      setError(null);
  };

  return (
    <div className="min-h-screen w-full flex bg-gray-50">
       {/* Left Hero Section - Modern Gradient & Branding */}
       <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 relative overflow-hidden items-center justify-center p-16 text-white">
          {/* Abstract Background Shapes */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
              <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-400 rounded-full mix-blend-overlay filter blur-3xl opacity-50 animate-pulse"></div>
              <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-indigo-500 rounded-full mix-blend-overlay filter blur-[100px] opacity-40"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-overlay filter blur-3xl opacity-30"></div>
          </div>

          <div className="relative z-10 max-w-xl">
             <div className="flex items-center gap-3 mb-10">
                 <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
                    <Sparkles className="w-8 h-8 text-blue-200" />
                 </div>
                 <h1 className="text-4xl font-bold tracking-tight text-white">SocialConnect</h1>
             </div>
             
             <h2 className="text-5xl font-bold mb-6 leading-tight">
                Connect closer to <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200">the people you love.</span>
             </h2>
             
             <p className="text-blue-100 text-lg mb-10 leading-relaxed opacity-90 max-w-lg">
                Share stories, join communities, and stay in touch in real-time. Experience a social network designed for meaningful connections.
             </p>
             
             <div className="mt-12 flex items-center gap-4 text-sm text-blue-200/60 font-medium">
                <span className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
                <span>•</span>
                <span className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors">Terms of Service</span>
             </div>
          </div>
       </div>

       {/* Right Form Section */}
       <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">
          {/* Mobile Background Elements */}
          <div className="lg:hidden absolute inset-0 z-0 bg-blue-600 opacity-[0.03] pattern-grid-lg"></div>

          <div className="w-full max-w-[440px] z-10">
             {/* Mobile Logo */}
             <div className="lg:hidden flex justify-center mb-8">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                    <Sparkles className="w-6 h-6 text-white" />
                </div>
             </div>

             <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{isLogin ? 'Welcome back' : 'Create an account'}</h2>
                <p className="mt-3 text-gray-500">
                    {isLogin ? 'Enter your credentials to access your account' : 'Start your 30-day free trial. Cancel anytime.'}
                </p>
             </div>
             
             {/* Guest Login Button */}
             <button
                type="button"
                onClick={handleGuestLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-green-50 border border-green-200 hover:bg-green-100 text-green-700 font-bold py-3.5 px-4 rounded-xl focus:outline-none transition-all mb-6 group"
             >
                <UserCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {isLoading ? 'Creating session...' : 'One-Click Guest Login'}
             </button>

             <div className="relative mb-6">
                 <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-200"></div>
                 </div>
                 <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-50 text-gray-400 font-medium">
                        OR
                    </span>
                 </div>
             </div>

             <form className="space-y-5" onSubmit={handleSubmit}>
                {!isLogin && (
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Full Name" 
                            className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                )}
                
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    </div>
                    <input 
                        type="email" 
                        placeholder="Email address" 
                        className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    </div>
                    <input 
                        type="password" 
                        placeholder="Password" 
                        className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                
                {isLogin && (
                    <div className="flex items-center justify-end">
                        <div className="text-sm">
                            <a href="#" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                                Forgot password?
                            </a>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center justify-center font-medium animate-in fade-in slide-in-from-top-2">
                        {error}
                    </div>
                )}

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-600/30"
                >
                  {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                  {isLogin ? 'Sign in to Account' : 'Create Account'}
                  {!isLoading && <ArrowRight className="w-5 h-5" />}
                </button>
             </form>
             
             <div className="mt-8 relative">
                 <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-200"></div>
                 </div>
                 <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">
                        {isLogin ? "New to SocialConnect?" : "Already have an account?"}
                    </span>
                 </div>
             </div>

             <div className="mt-6">
                <button 
                    type="button"
                    onClick={toggleMode}
                    className="w-full flex justify-center py-3 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors"
                >
                    {isLogin ? 'Create an account' : 'Sign in'}
                </button>
             </div>
             
             <p className="mt-8 text-center text-xs text-gray-400">
                © 2024 SocialConnect Inc. All rights reserved.
             </p>
          </div>
       </div>
    </div>
  );
};

export default LoginPage;