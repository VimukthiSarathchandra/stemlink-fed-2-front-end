import { useGetUserOrdersQuery } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/lib/product";
import { Calendar, Package, MapPin, CreditCard, Clock } from "lucide-react";
import { format, isValid } from "date-fns";

// Helper function to safely format dates
const formatDate = (dateValue, formatString) => {
  if (!dateValue) return 'Date not available';
  
  try {
    const date = new Date(dateValue);
    if (isValid(date)) {
      return format(date, formatString);
    }
    return 'Invalid date';
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Date not available';
  }
};

export default function MyOrdersPage() {
  const { data: orders, isLoading, error } = useGetUserOrdersQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600">Loading your orders...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-lg text-red-600 mb-4">Error loading orders</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="mt-2 text-gray-600">View your order history and track your purchases</p>
        </div>

        {/* Orders List */}
        {orders && Array.isArray(orders) && orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order._id} className="overflow-hidden">
                <CardHeader className="bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg">Order #{order._id.slice(-8).toUpperCase()}</CardTitle>
                                             <CardDescription className="flex items-center gap-2 mt-1">
                         <Calendar className="h-4 w-4" />
                         {formatDate(order.createdAt, 'PPP')}
                       </CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge 
                        variant={order.orderStatus === 'CONFIRMED' ? 'default' : 
                                order.orderStatus === 'SHIPPED' ? 'secondary' : 
                                order.orderStatus === 'FULFILLED' ? 'default' : 'outline'}
                        className="capitalize"
                      >
                        <Package className="h-3 w-3 mr-1" />
                        {order.orderStatus.toLowerCase()}
                      </Badge>
                      <Badge 
                        variant={order.paymentStatus === 'PAID' ? 'default' : 'outline'}
                        className="capitalize"
                      >
                        <CreditCard className="h-3 w-3 mr-1" />
                        {order.paymentStatus.toLowerCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  {/* Order Items */}
                  <div className="space-y-4 mb-6">
                    <h3 className="font-semibold text-gray-900">Items</h3>
                                         <div className="space-y-3">
                       {order.items.map((item, index) => (
                         <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                           <img
                             src={item.productId?.image ? getImageUrl(item.productId.image) : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjMyIiB5PSIzMiIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjNkI3NDgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2U8L3RleHQ+Cjwvc3ZnPg=='}
                             alt={item.productId?.name || 'Product'}
                             className="w-16 h-16 object-cover rounded-md"
                             onError={(e) => {
                               e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjMyIiB5PSIzMiIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjNkI3NDgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2U8L3RleHQ+Cjwvc3ZnPg==';
                             }}
                           />
                           <div className="flex-1 min-w-0">
                             <h4 className="font-medium text-gray-900 truncate">
                               {item.productId?.name || 'Product Not Found'}
                             </h4>
                             <p className="text-sm text-gray-500">
                               {item.productId?.categoryId?.name || 'Unknown Category'} • Qty: {item.quantity}
                             </p>
                             {item.selectedColor && (
                               <div className="flex items-center gap-2 mt-1">
                                 <div
                                   className="w-4 h-4 rounded-full border border-gray-300"
                                   style={{ backgroundColor: item.selectedColor.hexCode }}
                                 />
                                 <span className="text-sm text-gray-600">{item.selectedColor.name}</span>
                               </div>
                             )}
                           </div>
                           <div className="text-right">
                             <p className="font-semibold text-gray-900">
                               ${((item.productId?.price || 0) * item.quantity).toFixed(2)}
                             </p>
                             <p className="text-sm text-gray-500">
                               ${(item.productId?.price || 0).toFixed(2)} each
                             </p>
                           </div>
                         </div>
                       ))}
                     </div>
                  </div>

                  {/* Shipping Address */}
                  {order.addressId && (
                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Shipping Address
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-700">
                          {order.addressId.streetAddress}<br />
                          {order.addressId.city}, {order.addressId.state} {order.addressId.zipCode}<br />
                          {order.addressId.country}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Order Summary */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        <p>Total Items: {order.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
                                                 <p>Order Date: {formatDate(order.createdAt, 'PPp')}</p>
                      </div>
                                             <div className="text-right">
                         <p className="text-lg font-semibold text-gray-900">
                           Total: ${order.items.reduce((sum, item) => sum + ((item.productId?.price || 0) * item.quantity), 0).toFixed(2)}
                         </p>
                       </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-500 mb-6">
                You haven't placed any orders yet. Start shopping to see your order history here.
              </p>
              <Button asChild>
                <a href="/shop">Start Shopping</a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
