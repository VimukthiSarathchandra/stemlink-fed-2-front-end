function CasualInspirations() {
  return (
    <section className="px-4 sm:px-6 lg:px-16 xl:px-20 2xl:px-24 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 xl:grid-cols-12 mt-8 md:mt-12 lg:mt-16 gap-4 md:gap-6 lg:gap-8">
      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 mb-6 md:mb-0 flex flex-col justify-center">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight text-gray-900">
          Casual Inspirations
        </h1>
        <p className="mt-3 md:mt-4 lg:mt-6 text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed max-w-md lg:max-w-lg">
          Our favorite combinations for casual outfit that can inspire you to
          apply on your daily activity.
        </p>
        <button className="mt-4 md:mt-6 lg:mt-8 text-center w-full sm:w-auto md:w-full lg:w-auto h-10 md:h-12 px-4 md:px-6 lg:px-8 rounded-full border-2 border-black flex items-center justify-center text-sm sm:text-base font-semibold hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
          BROWSE INSPIRATIONS
        </button>
      </div>
      
      <div className="relative col-span-1 md:col-span-2 lg:col-span-2.5 xl:col-span-4 h-48 sm:h-60 md:h-72 lg:h-80 xl:h-96 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <img
          src="/assets/images/ca0df25c3d226a223269e70541e09760.png"
          alt="Casual inspirations outfit"
          className="rounded-2xl absolute top-0 left-0 w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      <div className="relative col-span-1 md:col-span-2 lg:col-span-2.5 xl:col-span-4 h-48 sm:h-60 md:h-72 lg:h-80 xl:h-96 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <img
          src="/assets/images/2a24c60e5479cec788203caf906828d8.png"
          alt="Casual inspirations outfit"
          className="rounded-2xl w-full absolute top-0 left-0 object-top h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>
    </section>
  );
}

export default CasualInspirations; 