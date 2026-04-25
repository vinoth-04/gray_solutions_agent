import React, { useState } from 'react';
import { Building2, Eye, EyeOff, Loader2 } from 'lucide-react';
import ResetPasswordModal from './ResetPasswordModal';

const Login = ({ onLogin, type = "Vendor" }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await onLogin(email, password);
    } catch (err) {
      setError(err.message === 'Invalid credentials' ? 'Invalid email or password' : 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]">
      <div className="w-full max-w-[440px] bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-10">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gray-900 p-3.5 rounded-2xl mb-6 shadow-lg shadow-gray-200">
            <Building2 size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{type} Dashboard</h1>
          <p className="text-gray-500 text-sm">Sign in to manage your clinic</p>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input 
              type="email" 
              required
              disabled={isLoading}
              placeholder="your.email@clinic.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:border-gray-400 focus:ring-0 transition-colors disabled:opacity-50"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-gray-700">Password</label>
            </div>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                required
                disabled={isLoading}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:border-gray-400 focus:ring-0 transition-colors disabled:opacity-50"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-sm shadow-lg shadow-gray-200 hover:bg-gray-800 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Signing in...
              </>
            ) : (
              'Login'
            )}
          </button>

          <div className="text-center pt-2">
            <button 
              type="button"
              onClick={() => setIsResetModalOpen(true)}
              className="text-sm font-semibold text-gray-400 hover:text-gray-900 underline underline-offset-4 transition-colors"
            >
              Forgot password?
            </button>
          </div>
        </form>

        <div className="mt-10 pt-8 border-t border-gray-100">
          <p className="text-center text-[11px] text-gray-400 font-medium tracking-wide flex items-center justify-center gap-2 uppercase">
            Accounts are created by Super Admin only
          </p>
        </div>
      </div>

      {isResetModalOpen && (
        <ResetPasswordModal onClose={() => setIsResetModalOpen(false)} />
      )}
    </div>
  );
};

export default Login;
