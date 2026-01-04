import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Home, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const UserNotRegisteredError = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full p-8 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 text-center"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-red-500/20 border border-red-500/50">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>

        <h1 className="text-3xl font-black text-white mb-4">Kirish Cheklangan</h1>
        
        <p className="text-slate-300 mb-8">
          Siz ushbu ilovadan foydalanish uchun ro'yxatdan o'tmagansiz yoki ruxsatingiz yo'q.
        </p>

        <div className="space-y-3">
          <Button 
            onClick={() => navigate('/')}
            className="w-full bg-white text-purple-900 font-bold hover:bg-slate-100 rounded-xl py-6"
          >
            <Home className="w-5 h-5 mr-2" /> Bosh sahifaga qaytish
          </Button>
          
          <div className="p-4 bg-black/20 rounded-2xl text-sm text-slate-400 text-left">
            <p className="font-bold text-slate-200 mb-2">Nima qilish mumkin?</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5" />
                Hisobingiz to'g'riligini tekshiring
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5" />
                Administratorga murojaat qiling
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5" />
                Qaytadan tizimga kiring
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserNotRegisteredError;