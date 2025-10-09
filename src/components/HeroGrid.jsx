import { motion } from "framer-motion";

function HeroGrid() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-4 lg:px-16 min-h-[50vh] sm:min-h-[60vh] md:min-h-[80vh] gap-4 mt-4">
      <motion.div
        className="relative col-span-1 lg:col-span-2 rounded-2xl min-h-[300px] sm:min-h-[400px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <img
          src={"/assets/images/729091cd0452fb9d0b89106ceec16368.png"}
          className="rounded-2xl w-full h-full object-cover"
          alt="hero"
        />
        <div className="absolute top-4 sm:top-8 left-4 sm:left-8 right-4 sm:right-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white font-bold leading-tight">
            Color of <br /> Summer
            <br /> Outfit
          </h1>
          <p className="text-white text-sm sm:text-base md:text-lg lg:text-xl mt-2 sm:mt-4 leading-relaxed">
            100+ Collections for your <br className="hidden sm:block" /> outfit inspirations <br className="hidden sm:block" />
            in this summer
          </p>
        </div>
      </motion.div>
      <div className="col-span-1 grid grid-rows-2 gap-4">
        <motion.div
          className="rounded-2xl relative min-h-[150px] sm:min-h-[200px] md:h-auto"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <img
            src="/assets/images/29a85f64d93c41afa6b64d31b3a88038.png"
            alt="Featured product"
            className="rounded-2xl w-full h-full object-cover"
          />
          <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-black font-bold leading-tight">
              Outdoor <br /> Active
            </h1>
          </div>
        </motion.div>
        <motion.div
          className="rounded-2xl relative min-h-[150px] sm:min-h-[200px] md:h-auto"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <img
            src="/assets/images/0233936f837e7b69d6a545511b1ba132.png"
            alt="Featured product"
            className="rounded-2xl w-full h-full object-cover"
          />
          <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-black font-bold leading-tight">
              Casual <br /> Comfort
            </h1>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroGrid;
