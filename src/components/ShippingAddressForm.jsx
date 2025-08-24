import { Button } from "./ui/button";
import { Input } from "./ui/input";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useCreateOrderMutation } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { z } from "zod";
import { forwardRef, useImperativeHandle } from "react";
import { useUser } from "@clerk/clerk-react";

const shippingAddressFormSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50, "First name must be less than 50 characters"),
  lastName: z.string().min(1, "Last name is required").max(50, "Last name must be less than 50 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number must be less than 15 digits"),
  addressLine1: z.string().min(1, "Address is required").max(100, "Address must be less than 100 characters"),
  addressLine2: z.string().max(100, "Address must be less than 100 characters").optional(),
  city: z.string().min(1, "City is required").max(50, "City must be less than 50 characters"),
  state: z.string().min(1, "State/Province is required").max(50, "State/Province must be less than 50 characters"),
  zipCode: z.string().min(1, "ZIP/Postal code is required").max(10, "ZIP/Postal code must be less than 10 characters"),
  country: z.string().min(1, "Country is required").max(50, "Country must be less than 50 characters"),
});

const ShippingAddressForm = forwardRef((props, ref) => {
  const form = useForm({
    resolver: zodResolver(shippingAddressFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });

  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart.cartItems);
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const { user, isSignedIn } = useUser();

      async function onSubmit(values) {
      try {
      
      // Validate authentication
      if (!isSignedIn || !user?.id) {
        console.error('User not authenticated');
        alert('Please sign in to place an order.');
        return;
      }
      
      // Validate cart
      if (!cart || cart.length === 0) {
        console.error('Cart is empty');
        alert('Your cart is empty. Please add items before proceeding.');
        return;
      }

      const orderData = {
        shippingAddress: {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
          addressLine1: values.addressLine1,
          addressLine2: values.addressLine2 || "",
          city: values.city,
          state: values.state,
          zipCode: values.zipCode,
          country: values.country,
        },
        orderItems: cart.map((item) => {
          if (!item.product || !item.product._id) {
            console.error('Invalid product in cart:', item);
            throw new Error('Invalid product data in cart');
          }
          
          return {
            productId: item.product._id || item.product.id,
            quantity: item.quantity,
            selectedColor: item.selectedColor ? {
              _id: item.selectedColor._id || item.selectedColor.id,
              name: item.selectedColor.name,
              hexCode: item.selectedColor.hexCode
            } : null
          };
        }),
      };
      
              const order = await createOrder(orderData).unwrap();
        navigate(`/shop/payment?orderId=${order._id}`);
      } catch (error) {
        console.error('Order creation error:', error);
      }
  }

  // Expose the submit function to parent component
  useImperativeHandle(ref, () => ({
    submit: () => {
      form.handleSubmit(onSubmit)();
    }
  }));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Personal Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">First Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your first name" className="text-sm" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Last Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your last name" className="text-sm" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Email Address *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email address" type="email" className="text-sm" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Phone Number *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your phone number" type="tel" className="text-sm" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Address Information */}
        <FormField
          control={form.control}
          name="addressLine1"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Street Address *</FormLabel>
              <FormControl>
                <Input placeholder="Enter your street address" className="text-sm" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="addressLine2"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Apartment, suite, etc. (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Apartment, suite, unit, etc." className="text-sm" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">City *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your city" className="text-sm" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">State/Province *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your state or province" className="text-sm" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">ZIP/Postal Code *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your ZIP or postal code" className="text-sm" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Country *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your country" className="text-sm" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Hidden submit button - form will be submitted from parent */}
        <button type="submit" style={{ display: 'none' }} />
      </form>
    </Form>
  );
});

ShippingAddressForm.displayName = 'ShippingAddressForm';

export default ShippingAddressForm;
