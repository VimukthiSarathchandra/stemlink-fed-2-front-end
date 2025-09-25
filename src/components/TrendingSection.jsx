import SimpleProductCard from "./SimpleProductCard";
import CategoryButton from "./CategoryButton";
import { useState, useEffect } from "react";
import { useGetAllCategoriesQuery, useGetAllProductsQuery } from "@/lib/api";

function TrendingSection() {

  const { data: productsData, isLoading } = useGetAllProductsQuery();
  const { data: categories, isLoading: isCategoriesLoading, error: categoriesError } = useGetAllCategoriesQuery();

  // Debug: Log categories data
  useEffect(() => {
    
  }, [categories, isCategoriesLoading, categoriesError]);

  // Extract products from the new API response structure
  const products = productsData?.products || [];

  const [selectedCategoryId, setSelectedCategoryId] = useState("ALL");
  
  // Fix the filtering logic to use categoryId._id for populated category
  const filteredProducts = selectedCategoryId === "ALL"
      ? products
      : products?.filter((product) => 
          product.categoryId?._id === selectedCategoryId || 
          product.categoryId === selectedCategoryId
        );

  if (isLoading || isCategoriesLoading) {
    return (
      <section className="px-4 lg:px-16 py-8">
        <div className="flex items-center justify-center h-32">
          <p>Loading trending products...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 lg:px-16 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Trending</h2>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          {/* All button */}
          <button
            onClick={() => setSelectedCategoryId("ALL")}
            className={`border rounded-full px-3 sm:px-4 py-2 text-sm sm:text-base transition-colors whitespace-nowrap ${
              selectedCategoryId === "ALL"
                ? "bg-black text-white"
                : "bg-white border-black text-black hover:bg-gray-50"
            }`}
          >
            All
          </button>
          
          {/* Category buttons */}
          {categories && categories.length > 0 ? (
            categories.map((category) => (
              <CategoryButton
                key={category._id}
                category={category}
                onClick={() => setSelectedCategoryId(category._id)}
                selectedCategoryId={selectedCategoryId}
              />
            ))
          ) : (
            <p className="text-gray-500">No categories available</p>
          )}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts && filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {filteredProducts.map((product) => {
            return <SimpleProductCard key={product._id} product={product} />;
          })}
        </div>
      ) : (
        <div className="mt-8 text-center py-12">
          <div className="text-gray-500">
            <p className="text-lg mb-2">No products available yet</p>
            <p className="text-sm">Products will appear here once they are added</p>
          </div>
        </div>
      )}
      
      {/* Debug: Show filtered products count */}
      {/* <div className="mt-4 text-sm text-gray-500">
        Showing {filteredProducts?.length || 0} products
        {selectedCategoryId !== "ALL" && ` in selected category`}
      </div> */}
    </section>
  );
}

export default TrendingSection;
