import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router";
import { useSearchParams } from "react-router";
import PaymentForm from "@/components/PaymentForm";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

function PaymentPage() {
  const cart = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  if (cart.length === 0) {
    return <Navigate to="/shop" />;
  }

  if (!orderId) {
    return <Navigate to="/shop/cart" />;
  }

  return (
    <main className="px-4 sm:px-6 lg:px-16 min-h-screen py-4 sm:py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Payment</h1>
        <Button variant="outline" asChild className="text-sm">
          <Link to="/shop/checkout">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Checkout
          </Link>
        </Button>
      </div>

      {/* Payment Form */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Complete Your Payment</h2>
          <p className="text-gray-600 mb-6">
            Please complete your payment to finalize your order. Your payment information is secure and encrypted.
          </p>
          
          <PaymentForm orderId={orderId} />
        </div>
      </div>
    </main>
  );
}

export default PaymentPage;
