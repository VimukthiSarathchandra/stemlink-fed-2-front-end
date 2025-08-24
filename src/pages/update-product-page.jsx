import { useState, useEffect } from "react";
import { 
  useGetAllProductsQuery, 
  useGetAllCategoriesQuery, 
  useGetAllColorsQuery,
  useUpdateProductMutation,
  useSearchProductsQuery
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getImageUrl } from "@/lib/product";
import { Search } from "lucide-react";

export default function UpdateProductPage() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [updateData, setUpdateData] = useState({
    price: "",
    stock: "",
    colorIds: []
  });
  const [selectedColors, setSelectedColors] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");

  // Use search query for database-wide search
  const { data: searchResults, isLoading: searchLoading } = useSearchProductsQuery(productSearch, {
    skip: !productSearch || productSearch.length < 2
  });

  // Fallback to all products when no search
  const { data: productsData, isLoading: productsLoading } = useGetAllProductsQuery();
  const { data: categoriesData } = useGetAllCategoriesQuery();
  const { data: colorsData } = useGetAllColorsQuery();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  // Use search results if available, otherwise use all products
  const products = productSearch && productSearch.length >= 2 ? (searchResults || []) : (productsData?.products || []);
  const categories = categoriesData || [];
  const colors = colorsData || [];

  // Debug: Log products to see their structure
  useEffect(() => {
    if (products.length > 0) {
      
    }
  }, [products]);

  // Show loading state for either search or products loading
  const isLoading = searchLoading || productsLoading;

  useEffect(() => {
    if (selectedProduct) {
      setUpdateData({
        price: selectedProduct.price?.toString() || "",
        stock: selectedProduct.stock?.toString() || "",
        colorIds: selectedProduct.colorIds?.map(c => c._id) || []
      });
      setSelectedColors(selectedProduct.colorIds || []);
    }
  }, [selectedProduct]);

  const handleColorToggle = (color) => {
    setSelectedColors(prev => {
      const isSelected = prev.find(c => c._id === color._id);
      if (isSelected) {
        return prev.filter(c => c._id !== color._id);
      } else {
        return [...prev, color];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedProduct) {
      setUpdateMessage("Please select a product first");
      return;
    }

    try {
      const updatePayload = {
        productId: selectedProduct._id,
        ...updateData,
        colorIds: selectedColors.map(c => c._id)
      };

  

      const result = await updateProduct(updatePayload).unwrap();
      console.log('Update successful:', result);
      
      setUpdateMessage("Product updated successfully!");
      
      // Reset form after a short delay
      setTimeout(() => {
        setSelectedProduct(null);
        setUpdateData({ price: "", stock: "", colorIds: [] });
        setSelectedColors([]);
        setProductSearch("");
        setUpdateMessage("");
      }, 2000);
    } catch (error) {
      console.error("Update failed:", error);
      setUpdateMessage("Failed to update product. Please try again.");
    }
  };

  // Debug image URLs
  const debugImageUrl = (imageUrl) => {
    if (!imageUrl) {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9Ijc1IiB5PSI3NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjNkI3NDgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPg==';
    }
    
    // If it's already a full URL, use it directly
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    // Otherwise, use the getImageUrl function
    return getImageUrl(imageUrl);
  };

  const handleImageError = (e, imageUrl) => {
    console.error('Image failed to load for imageUrl:', imageUrl);
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9Ijc1IiB5PSI3NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjNkI3NDgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgRXJyb3I8L3RleHQ+Cjwvc3ZnPg==';
    e.target.onerror = null; // Prevent infinite loop
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">
            {productSearch && productSearch.length >= 2 ? "Searching products..." : "Loading products..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Update Product</h1>
          <p className="mt-2 text-gray-600">Select a product and update its details</p>
        </div>

        {/* Update Message */}
        {updateMessage && (
          <div className={`mb-4 p-4 rounded-md ${
            updateMessage.includes('successfully') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {updateMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Product</CardTitle>
              <CardDescription>Search and choose a product to update</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Product Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search products by name or category... (min 2 characters)"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Search Status */}
                {productSearch && productSearch.length >= 2 && (
                  <div className="text-sm text-gray-600">
                    Searching for: "{productSearch}"
                  </div>
                )}

                {/* Product List */}
                <div className="max-h-64 overflow-y-auto border rounded-md">
                  {products.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      {productSearch && productSearch.length >= 2 
                        ? `No products found for "${productSearch}"` 
                        : "No products available"
                      }
                    </div>
                  ) : (
                    <div className="divide-y">
                      {products.map((product) => (
                        <button
                          key={product._id}
                          onClick={() => setSelectedProduct(product)}
                          className={`w-full p-3 text-left hover:bg-gray-50 transition-colors ${
                            selectedProduct?._id === product._id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <img
                              src={debugImageUrl(product.image)}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-md"
                              onError={(e) => handleImageError(e, product.image)}
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                              <p className="text-sm text-gray-500">
                                {product.categoryId?.name} • ${product.price} • Stock: {product.stock}
                              </p>
                            </div>
                            {selectedProduct?._id === product._id && (
                              <div className="text-blue-500">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Results Count */}
                {products.length > 0 && (
                  <div className="text-sm text-gray-500">
                    {productSearch && productSearch.length >= 2 
                      ? `Found ${products.length} product(s) for "${productSearch}"`
                      : `Showing ${products.length} product(s)`
                    }
                  </div>
                )}

                {/* Selected Product Preview */}
                {selectedProduct && (
                  <div className="border rounded-lg p-4 bg-blue-50">
                    <h3 className="font-semibold text-blue-900 mb-2">Selected Product:</h3>
                    <div className="flex items-center space-x-4">
                      <img
                        src={debugImageUrl(selectedProduct.image)}
                        alt={selectedProduct.name}
                        className="w-16 h-16 object-cover rounded-md"
                        onError={(e) => handleImageError(e, selectedProduct.image)}
                      />
                      <div>
                        <h3 className="font-semibold">{selectedProduct.name}</h3>
                        <p className="text-sm text-gray-600">
                          Category: {selectedProduct.categoryId?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Current Price: ${selectedProduct.price}
                        </p>
                        <p className="text-sm text-gray-600">
                          Current Stock: {selectedProduct.stock}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Update Form */}
          <Card>
            <CardHeader>
              <CardTitle>Update Details</CardTitle>
              <CardDescription>Modify product information</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedProduct ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Price */}
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={updateData.price}
                      onChange={(e) => setUpdateData(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="Enter new price"
                    />
                  </div>

                  {/* Stock */}
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                      id="stock"
                      type="number"
                      min="0"
                      value={updateData.stock}
                      onChange={(e) => setUpdateData(prev => ({ ...prev, stock: e.target.value }))}
                      placeholder="Enter new stock quantity"
                    />
                  </div>

                  {/* Colors */}
                  <div className="space-y-2">
                    <Label>Colors</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {colors.map((color) => (
                        <button
                          key={color._id}
                          type="button"
                          onClick={() => handleColorToggle(color)}
                          className={`p-2 rounded-md border-2 transition-colors ${
                            selectedColors.find(c => c._id === color._id)
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: color.hexCode }}
                            />
                            <span className="text-sm">{color.name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Updating..." : "Update Product"}
                  </Button>
                </form>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Please select a product to update</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
