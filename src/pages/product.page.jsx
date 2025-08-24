import { useParams, Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/lib/features/cartSlice";
import { getImageUrl } from "@/lib/product";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Package, 
  PackageX, 
  Star, 
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw
} from "lucide-react";
import { useState } from "react";
import { useGetProductByIdQuery } from "@/lib/api";

function ProductPage() {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data: product, isLoading: isProductLoading, error } = useGetProductByIdQuery(productId);

  const isOutOfStock = product?.stock <= 0;
  const averageRating = product?.reviews?.length > 0 
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length 
    : 0;

  const handleAddToCart = () => {
    if (isOutOfStock || !product) return;
    
    // Check if color selection is required
    if (product.colorIds && product.colorIds.length > 0 && !selectedColor) {
      alert('Please select a color before adding to cart');
      return;
    }
    
    setIsLoading(true);
    dispatch(addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock,
      selectedColor: selectedColor,
    }));
    
    // Simulate loading
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 0)) {
      setSelectedQuantity(newQuantity);
    }
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  if (isProductLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <Package className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/shop">Back to Shop</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link to="/shop" className="hover:text-gray-900">Shop</Link>
          <span>/</span>
          <Link to={`/shop/${product.categoryId?.name?.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-gray-900">
            {product.categoryId?.name || 'Category'}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        {/* Back Button */}
        <div className="mb-6">
          <Button variant="outline" asChild className="text-sm">
            <Link to="/shop">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shop
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg shadow-sm border overflow-hidden">
              <img
                src={getImageUrl(product.image)}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {isOutOfStock && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-white text-center">
                    <PackageX className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-lg font-semibold">Out of Stock</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Additional Images Placeholder */}
            {/* <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg border-2 border-gray-300 flex items-center justify-center">
                  <span className="text-gray-500 text-xs">Image {i}</span>
                </div>
              ))}
            </div> */}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Product Title and Rating */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              
              {/* Rating */}
              {product.reviews && product.reviews.length > 0 && (
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= averageRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {averageRating.toFixed(1)} ({product.reviews.length} reviews)
                  </span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="text-3xl sm:text-4xl font-bold text-gray-900">
              ${product.price}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-gray-500" />
              <span className={`text-sm font-medium ${
                isOutOfStock ? 'text-red-600' : 'text-green-600'
              }`}>
                {isOutOfStock ? 'Out of Stock' : `${product.stock} in stock`}
              </span>
            </div>

            {/* Colors */}
            {product.colorIds && product.colorIds.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Select Color:</h3>
                <div className="flex space-x-2">
                  {product.colorIds.map((color) => (
                    <div
                      key={color._id}
                      className={`w-10 h-10 rounded-full border-2 cursor-pointer transition-all ${
                        selectedColor?._id === color._id 
                          ? 'border-blue-600 scale-110' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color.hexCode }}
                      title={color.name}
                      onClick={() => handleColorSelect(color)}
                    />
                  ))}
                </div>
                {selectedColor && (
                  <p className="text-sm text-gray-600 mt-2">
                    Selected: <span className="font-medium">{selectedColor.name}</span>
                  </p>
                )}
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Quantity:</h3>
              <div className="flex items-center space-x-3">
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(selectedQuantity - 1)}
                    disabled={selectedQuantity <= 1}
                    className="h-10 w-10 p-0"
                  >
                    <span className="text-lg">-</span>
                  </Button>
                  <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">
                    {selectedQuantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(selectedQuantity + 1)}
                    disabled={selectedQuantity >= product.stock}
                    className="h-10 w-10 p-0"
                  >
                    <span className="text-lg">+</span>
                  </Button>
                </div>
                <span className="text-sm text-gray-600">
                  {product.stock} available
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="space-y-3">
              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock || isLoading}
                className="w-full h-12 text-lg font-semibold"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <RotateCcw className="h-5 w-5 mr-2 animate-spin" />
                    Adding to Cart...
                  </>
                ) : isOutOfStock ? (
                  <>
                    <PackageX className="h-5 w-5 mr-2" />
                    Out of Stock
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart - ${(product.price * selectedQuantity).toFixed(2)}
                  </>
                )}
              </Button>
              
              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1">
                  <Heart className="h-4 w-4 mr-2" />
                  Wishlist
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Product Description */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </Card>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg border">
                <Truck className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <h4 className="font-medium text-gray-900">Free Shipping</h4>
                <p className="text-sm text-gray-600">On orders over $50</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <Shield className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <h4 className="font-medium text-gray-900">Quality Guarantee</h4>
                <p className="text-sm text-gray-600">30-day return policy</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <RotateCcw className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <h4 className="font-medium text-gray-900">Easy Returns</h4>
                <p className="text-sm text-gray-600">Hassle-free returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {product.reviews && product.reviews.length > 0 && (
          <div className="mt-12">
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Customer Reviews</h3>
              <div className="space-y-6">
                {product.reviews.map((review) => (
                  <div key={review._id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {review.userId?.firstName} {review.userId?.lastName}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductPage;
