import { Button } from "@/components/ui/button";
import { useGetCheckoutSessionStatusQuery } from "@/lib/api";
import { Link, Navigate, useSearchParams } from "react-router";
import { useDispatch } from "react-redux";
import { clearCart } from "@/lib/features/cartSlice";
import { useEffect, useState } from "react";
import { CheckCircle, Package, Mail, RefreshCw } from "lucide-react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function CompletePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const dispatch = useDispatch();
  const [isUpdating, setIsUpdating] = useState(false);

  const { data, isLoading, isError, refetch } =
    useGetCheckoutSessionStatusQuery(sessionId);

  // Clear cart when payment is successful and automatically update order status
  useEffect(() => {
    if (data?.status === "complete") {
      // Clear cart immediately when payment is complete
      dispatch(clearCart());
      
      // If payment status is still pending, automatically update it
      if (data?.paymentStatus === "PENDING" && data?.orderId) {
        handleManualUpdate();
      }
    }
  }, [data, dispatch]);

  const handleManualUpdate = async () => {
    if (!data?.orderId) return;
    
    setIsUpdating(true);
    try {
      const response = await fetch(`${BASE_URL}/api/payments/manual-update-order/${data.orderId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        // Refetch the session status
        await refetch();
      } else {
        console.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Processing your payment...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <Package className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment Error</h2>
          <p className="text-gray-600 mb-4">There was an issue processing your payment.</p>
          <Button asChild>
            <Link to="/shop/cart">Return to Cart</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (data?.status === "open") {
    return <Navigate to="/shop/checkout" />;
  }

  // Show success page for both complete and pending statuses
  if (data?.status === "complete") {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Payment Successful!
              </h1>
              <p className="text-gray-600">
                Thank you for your order. We've received your payment and are processing your order.
              </p>
            </div>

            {/* Order Details */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Order Details
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium">{data.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Status:</span>
                  <span className="font-medium text-green-600">
                    {data.orderStatus === "PENDING" ? "CONFIRMED" : data.orderStatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status:</span>
                  <span className="font-medium text-green-600">
                    {data.paymentStatus === "PENDING" ? "PAID" : data.paymentStatus}
                  </span>
                </div>
                {data.customer_email && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{data.customer_email}</span>
                  </div>
                )}
              </div>
            </div>

           

            {/* Contact Information */}
            <div className="text-center text-sm text-gray-600 mb-6">
              <p>
                Questions about your order? Contact us at{" "}
                <a href="mailto:support@mebius.com" className="text-blue-600 hover:underline font-medium">
                  support@Mebius.com
                </a>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="flex-1">
                <Link to="/shop">
                  Continue Shopping
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link to="/">
                  Return to Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If payment is not complete or failed
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-yellow-600 mb-4">
          <Package className="h-12 w-12 mx-auto" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment Pending</h2>
        <p className="text-gray-600 mb-4">Your payment is still being processed.</p>
        <Button asChild>
          <Link to="/shop/cart">Return to Cart</Link>
        </Button>
      </div>
    </div>
  );
}

export default CompletePage;
