import { motion } from 'motion/react';
import { Building2 } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-16 h-16 mx-auto mb-4 bg-black rounded-lg flex items-center justify-center"
        >
          <Building2 className="w-8 h-8 text-white" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl tracking-tight">LUXE</h2>
          <p className="text-sm opacity-60 mt-1">Loading...</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
