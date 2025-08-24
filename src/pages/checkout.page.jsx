import CartItem from "@/components/CartItem";
import ShippingAddressForm from "@/components/ShippingAddressForm";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

function CheckoutPage() {
  const cart = useSelector((state) => state.cart.cartItems);
  const formRef = useRef();

  if (cart.length === 0) {
    return <Navigate to="/shop/cart" />;
  }

  // Calculate cart totals
  const subtotal = cart.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);

  const shipping = 5.99;
  const total = subtotal + shipping;

  const handleProceedToPayment = () => {
    // Trigger the form submission
    if (formRef.current) {
      formRef.current.submit();
    }
  };

  return (
    <main className="px-4 sm:px-6 lg:px-16 min-h-screen py-4 sm:py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Checkout</h1>
        <Button variant="outline" asChild className="text-sm">
          <Link to="/shop/cart">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Link>
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Left Side - Order Details & Shipping */}
        <div className="flex-1 space-y-6">
          {/* Order Details */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Order Details</h2>
            <div className="space-y-3">
              {cart.map((item, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity} × ${item.product.price}
                    </p>
                  </div>
                  <div className="text-sm sm:text-base font-semibold">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Shipping Address</h2>
            <ShippingAddressForm ref={formRef} />
          </div>
        </div>

        {/* Right Side - Order Summary */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border lg:sticky lg:top-8">
            <h3 className="text-lg sm:text-xl font-semibold mb-4">Order Summary</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal ({cart.length} items)</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">${shipping.toFixed(2)}</span>
              </div>
              
              <div className="border-t pt-3">
                <div className="flex justify-between text-base sm:text-lg font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Button 
              className="w-full" 
              size="lg"
              onClick={handleProceedToPayment}
            >
              Proceed to Payment
            </Button>

            <div className="mt-4 text-center">
              <Button variant="outline" asChild className="w-full text-sm">
                <Link to="/shop/cart">
                  Back to Cart
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default CheckoutPage;
