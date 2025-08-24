import { useSearchProductsQuery } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Input } from "./ui/input";
import { Link } from "react-router";

function ProductSearchForm() {
  const [search, setSearch] = useState("");

  const { data: products, isLoading, error } = useSearchProductsQuery(search, {
    skip: !search || search.length < 2, // Skip if search is empty or too short
  });



  return (
    <div className="relative w-full sm:w-64">
      <Input
        type="text"
        placeholder="Search products..."
        className="w-full sm:w-64"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div
        className={cn(
          "hidden absolute top-10 rounded-md left-0 z-10 right-0 w-full sm:w-64 px-2 bg-white border shadow-lg",
          {
            "block": search.length >= 2,
          }
        )}
      >
        <div className="max-h-64 overflow-y-auto">
          {isLoading && (
            <div className="py-2 text-center">
              <p className="text-gray-500">Searching...</p>
            </div>
          )}
          
          {error && (
            <div className="py-2 text-center">
              <p className="text-red-500">Search failed: {error.message}</p>
            </div>
          )}
          
          {!isLoading && !error && products && products.length > 0 && (
            products.map((product) => (
              <Link
                to={`/shop/products/${product._id}`}
                key={product._id}
                className="block py-2 px-2 hover:bg-gray-100 rounded text-sm"
              >
                {product.name}
              </Link>
            ))
          )}
          
          {!isLoading && !error && products && products.length === 0 && search.length >= 2 && (
            <div className="py-2 text-center">
              <p className="text-gray-500">No results found for "{search}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductSearchForm;
