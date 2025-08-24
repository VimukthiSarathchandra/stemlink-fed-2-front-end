import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { addToCart } from "@/lib/features/cartSlice";
import { useState } from "react";
import { getImageUrl } from "@/lib/product";
import { Package, PackageX, ShoppingCart } from "lucide-react";
import { Link } from "react-router";

function SimpleProductCard(props) {
  const dispatch = useDispatch();
  const [selectedColor, setSelectedColor] = useState(null);
  const [showColorSelector, setShowColorSelector] = useState(false);
  const isOutOfStock = props.product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    
    // Check if color selection is required
    if (props.product.colorIds && props.product.colorIds.length > 0 && !selectedColor) {
      setShowColorSelector(true);
      return;
    }
    
    dispatch(addToCart({
      _id: props.product._id,
      name: props.product.name,
      price: props.product.price,
      image: props.product.image,
      stock: props.product.stock,
      selectedColor: selectedColor,
    }));
    
    // Reset color selection after adding to cart
    setSelectedColor(null);
    setShowColorSelector(false);
  };

  const handleCartIconClick = () => {
    if (isOutOfStock) return;
    
    // Check if color selection is required
    if (props.product.colorIds && props.product.colorIds.length > 0 && !selectedColor) {
      setShowColorSelector(true);
      return;
    }
    
    // If no colors or color already selected, add to cart directly
    handleAddToCart();
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    // Don't close the modal - keep it open for user to see selection
  };

  return (
    <div key={props.product._id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative group">
      {/* Image Container with Cart Icon Overlay */}
      <div className="aspect-square relative">
        <Link to={`/shop/products/${props.product._id}`}>
          <img
            src={getImageUrl(props.product.image)}
            alt={props.product.name}
            className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2Qjc0ODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBOb3QgRm91bmQ8L3RleHQ+Cjwvc3ZnPg==';
            }}
          />
        </Link>
        
        {/* Cart Icon Overlay - Always visible */}
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
          <button
            onClick={handleCartIconClick}
            disabled={isOutOfStock}
            className={`p-1.5 sm:p-2 rounded-full transition-all duration-200 ${
              isOutOfStock 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-white/90 text-gray-700 hover:bg-blue-500 hover:text-white shadow-md hover:shadow-lg transform hover:scale-110'
            }`}
            title={isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          >
            <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
        </div>
        
        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-white text-center">
              <PackageX className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2" />
              <p className="text-xs sm:text-sm font-semibold">Out of Stock</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="p-3 sm:p-4 md:p-5">
        <Link to={`/shop/products/${props.product._id}`}>
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3 line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer leading-tight">
            {props.product.name}
          </h3>
        </Link>
        
        <p className="text-base sm:text-lg md:text-xl font-bold text-blue-600 mb-3 sm:mb-4">
          ${props.product.price}
        </p>
        
        {/* Stock Status */}
        {/* <div className="mb-2 sm:mb-3">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-gray-500" />
            <span className={`text-xs sm:text-sm font-medium ${
              isOutOfStock ? 'text-red-600' : 'text-green-600'
            }`}>
              {isOutOfStock ? 'Out of Stock' : `${props.product.stock} in stock`}
            </span>
          </div>
        </div> */}
        
        {/* Display multiple colors if available */}
        {props.product.colorIds && props.product.colorIds.length > 0 && (
          <div className="mb-3 sm:mb-4">
            <p className="text-xs sm:text-sm text-gray-600 mb-2">Available Colors:</p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {props.product.colorIds.map((color) => (
                <div
                  key={color._id}
                  className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform cursor-pointer"
                  style={{ backgroundColor: color.hexCode }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        )}

        {/* Color Selection Modal */}
        {showColorSelector && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
            <div className="bg-white rounded-xl p-4 sm:p-6 mx-4 max-w-sm w-full shadow-2xl">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 text-center">Select Color</h3>
              
              {/* Selected Color Display */}
              {selectedColor && (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-600 mb-2">Selected Color:</p>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white shadow-md"
                      style={{ backgroundColor: selectedColor.hexCode }}
                    />
                    <span className="font-medium text-gray-900 text-sm sm:text-base">{selectedColor.name}</span>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
                {props.product.colorIds.map((color) => (
                  <button
                    key={color._id}
                    className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 border rounded-lg transition-all duration-200 ${
                      selectedColor && selectedColor._id === color._id
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                    }`}
                    onClick={() => handleColorSelect(color)}
                  >
                    <div
                      className="w-4 h-4 sm:w-6 sm:h-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: color.hexCode }}
                    />
                    <span className="text-xs sm:text-sm text-gray-700">{color.name}</span>
                  </button>
                ))}
              </div>
              
              <div className="flex gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  className="flex-1 text-sm"
                  onClick={() => {
                    setShowColorSelector(false);
                    setSelectedColor(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 text-sm"
                  disabled={!selectedColor}
                  onClick={() => {
                    if (selectedColor) {
                      dispatch(addToCart({
                        _id: props.product._id,
                        name: props.product.name,
                        price: props.product.price,
                        image: props.product.image,
                        stock: props.product.stock,
                        selectedColor: selectedColor,
                      }));
                      setShowColorSelector(false);
                      setSelectedColor(null);
                    }
                  }}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SimpleProductCard;
