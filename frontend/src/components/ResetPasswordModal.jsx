import React, { useState } from 'react';
import { Lock, X } from 'lucide-react';

const ResetPasswordModal = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    // Mock sending link
    setTimeout(() => onClose(), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-[2px] p-6">
      <div className="w-full max-w-[440px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-10 animate-in">
        <div className="flex justify-end -mt-4 -mr-4">
           <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
              <X size={20} />
           </button>
        </div>
        
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl mb-6 text-gray-500">
            <Lock size={28} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Reset Password</h2>
          <p className="text-gray-500 text-sm text-center max-w-[280px]">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {sent ? (
          <div className="text-center py-6">
             <div className="text-emerald-600 font-bold mb-2">Reset link sent!</div>
             <p className="text-sm text-gray-500">Please check your inbox.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input 
                type="email" 
                required
                placeholder="your.email@clinic.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:border-gray-400 focus:ring-0 transition-colors"
              />
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-sm shadow-lg shadow-gray-200 hover:bg-gray-800 transition-all active:scale-[0.98]"
            >
              Send Reset Link
            </button>

            <div className="text-center">
              <button 
                type="button"
                onClick={onClose}
                className="text-sm font-semibold text-gray-400 hover:text-gray-900 transition-colors"
              >
                Back to login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordModal;
