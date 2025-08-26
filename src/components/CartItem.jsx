import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { removeFromCart, updateQuantity, updateColor } from "@/lib/features/cartSlice";
import { getImageUrl } from "@/lib/product";
import { Minus, Plus, Trash2, Package } from "lucide-react";
import { useState } from "react";

function CartItem({ item }) {
  const dispatch = useDispatch();
  const [showColorSelector, setShowColorSelector] = useState(false);
  const isAtStockLimit = item.quantity >= item.product.stock;

  const handleQuantityChange = (newQuantity) => {
    dispatch(updateQuantity({ 
      itemId: item.product._id, 
      quantity: newQuantity 
    }));
  };

  const handleRemove = () => {
    dispatch(removeFromCart(item.product._id));
  };

  const handleColorChange = (color) => {
    dispatch(updateColor({
      itemId: item.product._id,
      color: color
    }));
    setShowColorSelector(false);
  };

  const totalPrice = item.product.price * item.quantity;

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex items-start space-x-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <img
            src={getImageUrl(item.product.image)}
            alt={item.product.name}
            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
            {item.product.name}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            ${item.product.price}
            {item.selectedColor && (
              <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                Color: {item.selectedColor.name}
              </span>
            )}
          </p>

          {/* Stock Information */}
          <div className="flex items-center gap-2 mb-2">
            <Package className="h-3 w-3 text-gray-500" />
            <span className="text-xs text-gray-600">
              {item.product.stock} available
            </span>
          </div>

          {/* Color Selection */}
          {item.product.colorIds && item.product.colorIds.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">Color:</span>
                <div className="relative">
                  <div
                    className="w-6 h-6 rounded-full border-2 border-gray-300 cursor-pointer"
                    style={{ backgroundColor: item.selectedColor?.hexCode || '#ccc' }}
                    onClick={() => setShowColorSelector(!showColorSelector)}
                    title={item.selectedColor?.name || 'Select color'}
                  />
                  
                  {/* Color Selector Dropdown */}
                  {showColorSelector && (
                    <div className="absolute top-8 left-0 z-10 bg-white border rounded-lg shadow-lg p-2 min-w-[120px]">
                      <div className="text-xs font-medium text-gray-700 mb-2">Select Color:</div>
                      <div className="space-y-1">
                        {item.product.colorIds.map((color) => (
                          <div
                            key={color._id}
                            className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded cursor-pointer"
                            onClick={() => handleColorChange(color)}
                          >
                            <div
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: color.hexCode }}
                            />
                            <span className="text-xs text-gray-700">{color.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {item.selectedColor && (
                  <span className="text-xs text-gray-700 font-medium">
                    {item.selectedColor.name}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Note: Different colors create separate cart items
              </p>
            </div>
          )}

          {/* Quantity Controls */}
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-sm text-gray-600">Quantity:</span>
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                {item.quantity}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={isAtStockLimit}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            {isAtStockLimit && (
              <span className="text-xs text-red-600">Max stock reached</span>
            )}
          </div>

          {/* Total Price */}
          <p className="text-sm sm:text-base font-semibold text-gray-900">
            Total: ${totalPrice.toFixed(2)}
          </p>
        </div>

        {/* Remove Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemove}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}

export default CartItem;
