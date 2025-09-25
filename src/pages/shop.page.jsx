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
  const { data: productsData, isLoading, isError, error } = useGetAllProductsQuery({
    categoryId: selectedCategoryId || undefined,
    colorId: selectedColorId || undefined,
    sortBy,
    sortOrder,
    page: currentPage,
    limit: 20
  }, {
    // Add polling to refresh data if needed
    pollingInterval: 30000, // 30 seconds
    refetchOnMountOrArgChange: true
  });

  // Debug logging
  useEffect(() => {
    console.log(' API Debug:', {
      selectedCategoryId,
      productsData: productsData ? {
        productsCount: productsData.products?.length || 0,
        pagination: productsData.pagination,
        hasProducts: productsData.products && productsData.products.length > 0
      } : null,
      isLoading,
      isError,
      error: error ? {
        status: error.status,
        data: error.data,
        message: error.message
      } : null,
      queryParams: {
        categoryId: selectedCategoryId || undefined,
        colorId: selectedColorId || undefined,
        sortBy,
        sortOrder,
        page: currentPage,
        limit: 20
      }
    });
  }, [selectedCategoryId, productsData, isLoading, isError, error, selectedColorId, sortBy, sortOrder, currentPage]);

  const { data: categories } = useGetAllCategoriesQuery();
  const { data: colors } = useGetAllColorsQuery();



  // Handle category filter from URL parameter
  useEffect(() => {
    if (category && categories) {
      console.log('🔍 Category Debug:', {
        categoryFromURL: category,
        availableCategories: categories.map(c => ({ name: c.name, id: c._id })),
        selectedCategoryId
      });
      
      const categoryObj = categories.find(cat => {
        const categoryNameSlug = cat.name.toLowerCase().replace(/\s+/g, '-');
        const urlCategory = category.toLowerCase();
        
        // Handle different variations
        if (categoryNameSlug === urlCategory) return true;
        if (cat.name.toLowerCase() === urlCategory) return true;
        if (categoryNameSlug === urlCategory.replace('-', '')) return true; // Handle t-shirts vs tshirts
        
        return false;
      });
      
      console.log(' Found category object:', categoryObj);
      
      if (categoryObj && categoryObj._id !== selectedCategoryId) {
        console.log(' Setting category ID:', categoryObj._id);
        setSelectedCategoryId(categoryObj._id);
        // Update URL params
        const params = new URLSearchParams(searchParams);
        params.set('categoryId', categoryObj._id);
        setSearchParams(params);
      } else if (!categoryObj) {
        console.log(' No category found for:', category);
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
    
    // Reset to page 1 when filters change, but keep current page if only page changes
    const shouldResetPage = selectedCategoryId !== currentCategoryId || 
                           selectedColorId !== currentColorId || 
                           sortBy !== currentSortBy || 
                           sortOrder !== currentSortOrder;
    
    if (shouldResetPage) {
      params.set('page', '1');
    } else if (currentPage > 1) {
      params.set('page', currentPage.toString());
    }
    
    setSearchParams(params);
  }, [selectedCategoryId, selectedColorId, sortBy, sortOrder, currentPage, setSearchParams, 
      currentCategoryId, currentColorId, currentSortBy, currentSortOrder]);

  // Handle filter changes
  const handleCategoryChange = (categoryId) => {
    const newCategoryId = categoryId === 'all' ? '' : categoryId;
    setSelectedCategoryId(newCategoryId);
    // Don't call setSearchParams here - let the useEffect handle it
  };

  const handleColorChange = (colorId) => {
    const newColorId = colorId === 'all' ? '' : colorId;
    setSelectedColorId(newColorId);
    // Don't call setSearchParams here - let the useEffect handle it
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    // Don't call setSearchParams here - let the useEffect handle it
  };

  const handleSortOrderChange = (newSortOrder) => {
    setSortOrder(newSortOrder);
    // Don't call setSearchParams here - let the useEffect handle it
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
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading products...</p>
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="px-4 sm:px-6 lg:px-16 min-h-screen py-4 sm:py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load products</h3>
            <p className="text-gray-600 mb-4">There was an issue loading the products. Please try again.</p>
            <Button 
              onClick={() => window.location.reload()}
              className="px-6"
            >
              Try Again
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const { products = [], pagination = { total: 0, pages: 0 } } = productsData || {};
  
  // Check if there are no products in the database at all
  const hasNoProductsInDatabase = !isLoading && !isError && products.length === 0 && pagination.total === 0;
  
  // Check if there are no products with current filters
  const hasNoProductsWithFilters = !isLoading && !isError && products.length === 0 && pagination.total === 0 && (selectedCategoryId || selectedColorId);
  
  console.log('🔍 Empty State Debug:', {
    hasNoProductsInDatabase,
    hasNoProductsWithFilters,
    productsLength: products.length,
    paginationTotal: pagination.total,
    selectedCategoryId,
    selectedColorId,
    isLoading,
    isError
  });

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
        <div className="lg:w-80 flex-shrink-0 order-2 lg:order-1">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100 lg:sticky lg:top-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Filters</h2>
              {(selectedCategoryId || selectedColorId || sortBy !== 'name' || sortOrder !== 'asc') && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={clearFilters}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear All
                </Button>
              )}
            </div>
            
            {/* Category Filter */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                Category
              </label>
              <Select value={selectedCategoryId || 'all'} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-full h-10 sm:h-12 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm px-3 sm:px-4">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="border-gray-200 max-h-60 w-full min-w-[200px]">
                  <SelectItem value="all" className="hover:bg-gray-50 py-3 px-4">All Categories</SelectItem>
                  {categories?.map((category) => (
                    <SelectItem key={category._id} value={category._id} className="hover:bg-gray-50 py-3 px-4">
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Color Filter */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                Color
              </label>
              <Select value={selectedColorId || 'all'} onValueChange={handleColorChange}>
                <SelectTrigger className="w-full h-10 sm:h-12 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm px-3 sm:px-4">
                  <SelectValue placeholder="All Colors" />
                </SelectTrigger>
                <SelectContent className="border-gray-200 max-h-60 w-full min-w-[200px]">
                  <SelectItem value="all" className="hover:bg-gray-50 py-3 px-4">All Colors</SelectItem>
                  {colors?.map((color) => (
                    <SelectItem key={color._id} value={color._id} className="hover:bg-gray-50 py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full border-2 border-white shadow-sm" 
                          style={{ backgroundColor: color.hexCode }}
                        />
                        <span className="text-sm font-medium">{color.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                Sort By
              </label>
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-full h-10 sm:h-12 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm px-3 sm:px-4">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-gray-200 max-h-60 w-full min-w-[200px]">
                  <SelectItem value="name" className="hover:bg-gray-50 py-3 px-4">Name</SelectItem>
                  <SelectItem value="price" className="hover:bg-gray-50 py-3 px-4">Price</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Order */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                Order
              </label>
              <Select value={sortOrder} onValueChange={handleSortOrderChange}>
                <SelectTrigger className="w-full h-10 sm:h-12 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm px-3 sm:px-4">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-gray-200 max-h-60 w-full min-w-[200px]">
                  <SelectItem value="asc" className="hover:bg-gray-50 py-3 px-4">Ascending</SelectItem>
                  <SelectItem value="desc" className="hover:bg-gray-50 py-3 px-4">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active Filters Display */}
            {(selectedCategoryId || selectedColorId || sortBy !== 'name' || sortOrder !== 'asc') && (
              <div className="pt-3 sm:pt-4 border-t border-gray-200">
                <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                  {selectedCategoryId && categories && (
                    <div className="inline-flex items-center gap-2 px-2 sm:px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs sm:text-sm font-medium">
                      <span>Category: {categories.find(c => c._id === selectedCategoryId)?.name}</span>
                    </div>
                  )}
                  {selectedColorId && colors && (
                    <div className="inline-flex items-center gap-2 px-2 sm:px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs sm:text-sm font-medium">
                      <div 
                        className="w-3 h-3 rounded-full border border-white" 
                        style={{ backgroundColor: colors.find(c => c._id === selectedColorId)?.hexCode }}
                      />
                      <span>Color: {colors.find(c => c._id === selectedColorId)?.name}</span>
                    </div>
                  )}
                  {sortBy !== 'name' && (
                    <div className="inline-flex items-center gap-2 px-2 sm:px-3 py-1 bg-gray-50 text-gray-700 rounded-full text-xs sm:text-sm font-medium">
                      <span>Sort: {sortBy}</span>
                    </div>
                  )}
                  {sortOrder !== 'asc' && (
                    <div className="inline-flex items-center gap-2 px-2 sm:px-3 py-1 bg-gray-50 text-gray-700 rounded-full text-xs sm:text-sm font-medium">
                      <span>Order: {sortOrder}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Products */}
        <div className="flex-1 order-1 lg:order-2">
          {/* Products Grid */}
          {hasNoProductsInDatabase ? (
            <div className="text-center py-8 sm:py-12">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Package className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">No products available yet</h3>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
                  Products will appear here once they are added to our collection.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    onClick={() => window.location.reload()}
                    className="px-6"
                  >
                    Refresh Page
                  </Button>
                </div>
              </div>
            </div>
          ) : hasNoProductsWithFilters ? (
            <div className="text-center py-8 sm:py-12">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Package className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">No products found</h3>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
                  No products match your current filters. Try adjusting your selection.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    variant="outline" 
                    onClick={clearFilters}
                    className="px-6"
                  >
                    Clear All Filters
                  </Button>
                  <Button 
                    onClick={() => window.location.reload()}
                    className="px-6"
                  >
                    Refresh Page
                  </Button>
                </div>
              </div>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {products.map((product) => (
                <SimpleProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Package className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">No products available yet</h3>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
                  Products will appear here once they are added to our collection.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    variant="outline" 
                    onClick={clearFilters}
                    className="px-6"
                  >
                    Clear All Filters
                  </Button>
                  <Button 
                    onClick={() => window.location.reload()}
                    className="px-6"
                  >
                    Refresh Page
                  </Button>
                </div>
              </div>
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
