import { useGetAllProductsQuery, useGetAllCategoriesQuery, useGetAllColorsQuery } from "@/lib/api";
import { useParams, useSearchParams } from "react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SimpleProductCard from "@/components/SimpleProductCard";

function ShopPage() {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get filter and sort parameters from URL
  const currentCategoryId = searchParams.get('categoryId') || '';
  const currentColorId = searchParams.get('colorId') || '';
  const currentSortBy = searchParams.get('sortBy') || 'name';
  const currentSortOrder = searchParams.get('sortOrder') || 'asc';
  const currentPage = parseInt(searchParams.get('page') || '1');

  // State for filters
  const [selectedCategoryId, setSelectedCategoryId] = useState(currentCategoryId);
  const [selectedColorId, setSelectedColorId] = useState(currentColorId);
  const [sortBy, setSortBy] = useState(currentSortBy);
  const [sortOrder, setSortOrder] = useState(currentSortOrder);

  // Fetch data
  const { data: productsData, isLoading, isError } = useGetAllProductsQuery({
    categoryId: selectedCategoryId || undefined,
    colorId: selectedColorId || undefined,
    sortBy,
    sortOrder,
    page: currentPage,
    limit: 20
  });

  const { data: categories } = useGetAllCategoriesQuery();
  const { data: colors } = useGetAllColorsQuery();



  // Handle category filter from URL parameter
  useEffect(() => {
    if (category && categories) {
      const categoryObj = categories.find(cat => 
        cat.name.toLowerCase().replace(/\s+/g, '-') === category.toLowerCase()
      );
      if (categoryObj && categoryObj._id !== selectedCategoryId) {
        setSelectedCategoryId(categoryObj._id);
        // Update URL params
        const params = new URLSearchParams(searchParams);
        params.set('categoryId', categoryObj._id);
        setSearchParams(params);
      }
    }
  }, [category, categories, selectedCategoryId, searchParams, setSearchParams]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategoryId) params.set('categoryId', selectedCategoryId);
    if (selectedColorId) params.set('colorId', selectedColorId);
    if (sortBy !== 'name') params.set('sortBy', sortBy);
    if (sortOrder !== 'asc') params.set('sortOrder', sortOrder);
    if (currentPage > 1) params.set('page', currentPage.toString());
    
    setSearchParams(params);
  }, [selectedCategoryId, selectedColorId, sortBy, sortOrder, currentPage, setSearchParams]);

  // Handle filter changes
  const handleCategoryChange = (categoryId) => {
    const newCategoryId = categoryId === 'all' ? '' : categoryId;
    setSelectedCategoryId(newCategoryId);
    setSearchParams({ page: '1' }); // Reset to first page
  };

  const handleColorChange = (colorId) => {
    const newColorId = colorId === 'all' ? '' : colorId;
    setSelectedColorId(newColorId);
    setSearchParams({ page: '1' }); // Reset to first page
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setSearchParams({ page: '1' }); // Reset to first page
  };

  const handleSortOrderChange = (newSortOrder) => {
    setSortOrder(newSortOrder);
    setSearchParams({ page: '1' }); // Reset to first page
  };

  const clearFilters = () => {
    setSelectedCategoryId('');
    setSelectedColorId('');
    setSortBy('name');
    setSortOrder('asc');
    setSearchParams({ page: '1' });
  };

  if (isLoading) {
    return (
      <main className="px-4 sm:px-6 lg:px-16 min-h-screen py-4 sm:py-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg">Loading products...</p>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="px-4 sm:px-6 lg:px-16 min-h-screen py-4 sm:py-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg text-red-600">Error loading products</p>
        </div>
      </main>
    );
  }

  const { products = [], pagination = { total: 0, pages: 0 } } = productsData || {};

  return (
    <main className="px-4 sm:px-6 lg:px-16 min-h-screen py-4 sm:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
          {category ? `${category.charAt(0).toUpperCase() + category.slice(1)}` : 'Shop'}
        </h1>
        
        {/* Results count */}
        <p className="text-sm sm:text-base text-gray-600">
          {pagination.total} {pagination.total === 1 ? 'product' : 'products'} found
        </p>
      </div>

      {/* Main Content - Filters Left, Products Right */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Left Sidebar - Filters */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border lg:sticky lg:top-8">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Filters</h2>
            
            {/* Category Filter */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <Select value={selectedCategoryId || 'all'} onValueChange={handleCategoryChange}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories?.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Color Filter */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <Select value={selectedColorId || 'all'} onValueChange={handleColorChange}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="All Colors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Colors</SelectItem>
                  {colors?.map((color) => (
                    <SelectItem key={color._id} value={color._id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border" 
                          style={{ backgroundColor: color.hexCode }}
                        />
                        <span className="text-sm">{color.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Order */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order
              </label>
              <Select value={sortOrder} onValueChange={handleSortOrderChange}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters Button */}
            {(selectedCategoryId || selectedColorId || sortBy !== 'name' || sortOrder !== 'asc') && (
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="w-full text-sm"
              >
                Clear All Filters
              </Button>
            )}
          </div>
        </div>

        {/* Right Side - Products */}
        <div className="flex-1">
          {/* Products Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {products.map((product) => (
                <SimpleProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <p className="text-base sm:text-lg text-gray-600">No products found with the selected filters.</p>
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="mt-4 text-sm"
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6 sm:mt-8">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setSearchParams({ page: (currentPage - 1).toString() })}
                className="text-sm"
              >
                Previous
              </Button>
              
              <span className="px-3 sm:px-4 py-2 text-sm">
                Page {currentPage} of {pagination.pages}
              </span>
              
              <Button
                variant="outline"
                disabled={currentPage === pagination.pages}
                onClick={() => setSearchParams({ page: (currentPage + 1).toString() })}
                className="text-sm"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default ShopPage;
