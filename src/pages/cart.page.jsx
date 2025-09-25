import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router";
import CartItem from "@/components/CartItem";
import { clearCart } from "@/lib/features/cartSlice";
import { ShoppingBag, ArrowLeft, Trash2 } from "lucide-react";

function CartPage() {
  const cart = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();

  // Calculate cart totals
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);

  const shipping = subtotal > 0 ? 5.99 : 0; // Free shipping over $50
  const total = subtotal + shipping;

  const handleClearCart = () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
    }
  };

  return (
    <main className="px-4 sm:px-6 lg:px-16 min-h-screen py-4 sm:py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Shopping Cart</h1>
        <Button variant="outline" asChild className="text-sm">
          <Link to="/shop">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
        </Button>
      </div>

      {cart.length === 0 ? (
        /* Empty Cart State */
        <div className="text-center py-12 sm:py-16">
          <div className="mx-auto w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Looks like you haven't added any items to your cart yet. Start shopping to see some great products!
          </p>
          <Button asChild size="lg">
            <Link to="/shop">
              Start Shopping
            </Link>
          </Button>
        </div>
      ) : (
        /* Cart with Items */
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-semibold">
                Cart Items ({totalItems} items)
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearCart}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
            </div>

            <div className="space-y-4">
              {cart.map((item, index) => (
                <CartItem key={index} item={item} />
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border lg:sticky lg:top-8">
              <h3 className="text-lg sm:text-xl font-semibold mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                
                
                
                <div className="border-t pt-3">
                  <div className="flex justify-between text-base sm:text-lg font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button asChild className="w-full" size="lg">
                <Link to="/shop/checkout">
                  Proceed to Checkout
                </Link>
              </Button>

              <div className="mt-4 text-center">
                <Button variant="outline" asChild className="w-full text-sm">
                  <Link to="/shop">
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default CartPage;
