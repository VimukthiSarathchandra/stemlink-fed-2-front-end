import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { addToCart } from "@/lib/features/cartSlice";
import { useState } from "react";
import { getImageUrl } from "@/lib/product";
import { Package, PackageX } from "lucide-react";
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

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setShowColorSelector(false);
  };

  return (
    <div key={props.product._id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow relative">
      {/* Image Container - Consistent height across all devices */}
      <div className="aspect-square relative">
        <Link to={`/shop/products/${props.product._id}`}>
          <img
            src={getImageUrl(props.product.image)}
            alt={props.product.name}
            className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onError={(e) => {
          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2Qjc0ODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBOb3QgRm91bmQ8L3RleHQ+Cjwvc3ZnPg==';
        }}
          />
        </Link>
        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-white text-center">
              <PackageX className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm font-semibold">Out of Stock</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="p-3 sm:p-4">
        <Link to={`/shop/products/${props.product._id}`}>
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 sm:mb-2 line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer">
            {props.product.name}
          </h3>
        </Link>
        
        <p className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
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
            <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">Available Colors:</p>
            <div className="flex flex-wrap gap-1">
              {props.product.colorIds.map((color) => (
                <div
                  key={color._id}
                  className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: color.hexCode }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Add to Cart Button */}
        <Button
          className="w-full text-xs sm:text-sm py-2 sm:py-2.5"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
        >
          {isOutOfStock ? 'Out of Stock' : 'Add To Cart'}
        </Button>

        {/* Color Selection Modal */}
        {showColorSelector && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
            <div className="bg-white rounded-lg p-4 mx-4 max-w-sm w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Color</h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {props.product.colorIds.map((color) => (
                  <button
                    key={color._id}
                    className="flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => handleColorSelect(color)}
                  >
                    <div
                      className="w-6 h-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: color.hexCode }}
                    />
                    <span className="text-sm text-gray-700">{color.name}</span>
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowColorSelector(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  disabled={!selectedColor}
                  onClick={handleAddToCart}
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
