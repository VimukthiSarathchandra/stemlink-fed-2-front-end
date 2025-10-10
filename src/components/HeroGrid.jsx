"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link } from "react-router";

const images = [
  "/assets/images/729091cd0452fb9d0b89106ceec16368.png",
  "/assets/images/29a85f64d93c41afa6b64d31b3a88038.png",
  "/assets/images/0233936f837e7b69d6a545511b1ba132.png",
];

function HeroGrid() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative flex flex-col items-center justify-center min-h-[70vh] overflow-hidden rounded-3xl mx-4 lg:mx-16 mt-6 shadow-sm bg-gradient-to-br from-zinc-50 via-white to-stone-50">
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={index}
            src={images[index]}
            alt="Hero carousel"
            className="absolute inset-0 w-full h-full object-cover rounded-3xl"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          />
        </AnimatePresence>
      </div>

      <div className="absolute inset-0 bg-gradient-to-tr from-black/65 via-black/35 to-black/10 rounded-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative text-center text-white px-4 z-10"
      >
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
          Discover Your Style
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-gray-100 mb-6">
          Find the perfect outfit for every moment this season
        </p>
        <Button
          size="lg"
          asChild
          className="bg-white text-black font-semibold hover:bg-black hover:text-white transition-all duration-300"
        >
          <Link to="/shop">Shop Now</Link>
        </Button>
      </motion.div>

      <div className="absolute bottom-4 flex space-x-2 z-10">
        {images.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === index ? "bg-white" : "bg-white/50 hover:bg-white/80"}`}
          />
        ))}
      </div>
    </section>
  );
}

export default HeroGrid;
