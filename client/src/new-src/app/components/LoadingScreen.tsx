import { motion } from 'motion/react';

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
          className="w-16 h-16 mx-auto mb-4 flex items-center justify-center"
        >
          <img
            src="/logo.png"
            alt="Real Estate Pro logo"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/logo.svg';
            }}
            className="w-16 h-16 object-contain rounded-full"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl tracking-tight">Real Estate Pro</h2>
          <p className="text-sm opacity-60 mt-1">Loading...</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
