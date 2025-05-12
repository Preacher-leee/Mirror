import { motion } from "framer-motion";

export default function PortalEffect() {
  return (
    <div className="relative w-80 h-80 md:w-96 md:h-96">
      <motion.div
        className="absolute inset-0 bg-deep-purple rounded-full opacity-80 animate-morph"
        animate={{
          boxShadow: ["0 0 50px rgba(187,46,230,0.3)", "0 0 100px rgba(187,46,230,0.8)", "0 0 50px rgba(187,46,230,0.3)"]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      ></motion.div>
      
      <motion.div
        className="absolute inset-4 bg-cosmic-black rounded-full animate-morph"
        style={{ animationDelay: "500ms" }}
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 0.9 }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      ></motion.div>
      
      <motion.div
        className="absolute inset-10 border-2 border-electric-blue rounded-full"
        animate={{
          opacity: [0.5, 1, 0.5],
          scale: [0.95, 1, 0.95]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      ></motion.div>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.h1
          className="font-rajdhani font-bold text-4xl md:text-5xl gradient-text"
          animate={{
            opacity: [0.8, 1, 0.8],
            scale: [0.98, 1, 0.98]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          MIRROR WORLD
        </motion.h1>
      </div>
      
      <motion.div
        className="absolute bottom-16 left-0 right-0 text-center"
        animate={{
          opacity: [0.6, 1, 0.6]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <p className="font-orbitron text-electric-blue text-sm tracking-widest">INITIATING PORTAL SEQUENCE</p>
      </motion.div>
    </div>
  );
}
