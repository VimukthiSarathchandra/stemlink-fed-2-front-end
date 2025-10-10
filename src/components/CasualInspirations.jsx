"use client";
import { motion, useAnimation, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";

const inspirations = [
  {
    img: "/assets/images/ca0df25c3d226a223269e70541e09760.png",
    title: "Streetwear Vibes",
  },
  {
    img: "/assets/images/2a24c60e5479cec788203caf906828d8.png",
    title: "Luxury Minimal",
  },
  {
    img: "/assets/images/0233936f837e7b69d6a545511b1ba132.png",
    title: "Daily Comfort",
  },
  {
    img: "/assets/images/29a85f64d93c41afa6b64d31b3a88038.png",
    title: "Urban Casual",
  },
];

 function CasualInspirations() {
   return (
     <section className="w-full px-4 sm:px-6 md:px-10 lg:px-16 mt-12 flex flex-col items-start">
      {/* Heading section */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between w-full mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            Casual Inspirations
          </h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base max-w-md">
            Our favorite outfit ideas — simple, confident, and timeless.
          </p>
        </div>

        <Button
          variant="outline"
          className="mt-4 md:mt-0 rounded-full border-gray-300 hover:bg-black hover:text-white transition-all text-sm sm:text-base"
        >
          View All Inspirations
        </Button>
      </div>

       {/* Scrollable gallery */}
       <div className="relative w-full">
         <motion.div
           drag="x"
           dragConstraints={{ left: -400, right: 0 }}
           className="flex space-x-4 overflow-x-auto snap-x snap-mandatory pb-2 cursor-grab active:cursor-grabbing"
         >
           {inspirations.map((item, i) => (
             <motion.div
               key={i}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true, amount: 0.3 }}
               transition={{ duration: 0.6, delay: i * 0.08 }}
               className="relative flex-shrink-0 w-[80%] sm:w-[48%] md:w-[32%] lg:w-[24%] xl:w-[22%] snap-center rounded-2xl overflow-hidden shadow-md hover:shadow-xl transform hover:scale-[1.03] transition-all duration-500"
             >
               <img
                 src={item.img}
                 alt={item.title}
                 className="w-full h-56 sm:h-64 md:h-72 lg:h-80 object-cover"
               />
               <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-black/50 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                 <h3 className="text-white text-lg sm:text-xl font-semibold text-center px-2">
                   {item.title}
                 </h3>
               </div>
             </motion.div>
           ))}
         </motion.div>
       </div>
    </section>
  );
}

export default CasualInspirations;

// if you want extra polish
