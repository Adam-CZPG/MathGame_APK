import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3', '#A8D8EA'];

export default function Confetti({ trigger }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (trigger) {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
        rotation: Math.random() * 360,
        size: Math.random() * 10 + 5,
      }));
      setParticles(newParticles);

      setTimeout(() => setParticles([]), 3000);
    }
  }, [trigger]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ 
            y: -20, 
            x: particle.x,
            rotate: 0,
            opacity: 1 
          }}
          animate={{ 
            y: window.innerHeight + 50,
            rotate: particle.rotation + 720,
            opacity: 0
          }}
          transition={{ 
            duration: 2.5 + Math.random(),
            delay: particle.delay,
            ease: "easeOut"
          }}
          style={{
            position: 'absolute',
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
}