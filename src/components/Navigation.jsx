import { useState } from "react";
import { Link } from "react-router";
import { Menu, X, ShoppingBag, Search, User, Package, Plus, Edit, BarChart3 } from "lucide-react";
import { useSelector } from "react-redux";
// import { useSelector } from "react-redux";
import { SignedIn, UserButton, SignedOut } from "@clerk/clerk-react";
import ProductSearchForm from "./ProductSearchForm";
import { useAdmin } from "@/lib/hooks/useAdmin";
import AdminDropdown from "./AdminDropdown";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { isAdmin } = useAdmin();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const cartItems = useSelector((state) => state.cart.value);

  // Calculate total quantity of items in cart
  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // const calculateCartItems = () => {
  //   const total = 0;
  //   for (let i = 0; i < array.length; i++) {
  //     const item = array[i];
  //     total = total + item.quantity;
  //   }
  // };

  // Function href close mobile menu
  const closeMobileMenu = () => setIsMenuOpen(false);

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-16 relative z-50">
      <div>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="font-bold text-xl sm:text-2xl">
            Mebius
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {[
              {
                path: "/shop/shoes",
                label: "Shoes",
              },
              {
                path: "/shop/t-shirts",
                label: "T-Shirts",
              },
              {
                path: "/shop/shorts",
                label: "Shorts",
              },
              {
                path: "/shop/pants",
                label: "Pants",
              },
              {
                path: "/shop/socks",
                label: "Socks",
              },
            ].map((item) => {
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="font-medium hover:text-gray-600"
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Admin Dropdown */}
          {isAdmin && (
            <div className="hidden md:block">
              <AdminDropdown />
            </div>
          )}

          {/* Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search - Hidden on mobile, shown on desktop */}
            <div className="hidden sm:block">
              <ProductSearchForm />
            </div>
            
            <Link
              to="/shop/cart"
              aria-label="Shopping Bag"
              className="p-1 relative"
            >
              <ShoppingBag size={20} />
              <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {cartItemCount}
              </span>
            </Link>
            
            <SignedIn>
              <div className="flex items-center space-x-2">
                {/* My Orders Link for Regular Users */}
                {!isAdmin && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="hidden md:flex items-center gap-2"
                  >
                    <Link to="/my-orders" title="My Orders">
                      <Package size={16} />
                      <span className="hidden lg:inline">My Orders</span>
                    </Link>
                  </Button>
                )}
                <UserButton />
              </div>
            </SignedIn>
            <div className="hidden md:block">
              <SignedOut>
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/sign-in">Sign In</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link to="/sign-up">Sign Up</Link>
                  </Button>
                </div>
              </SignedOut>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-1"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <div className="mb-4">
              <ProductSearchForm />
            </div>
            
            {/* Navigation Links */}
            <div className="space-y-2">
              {[
                { path: "/shop/shoes", label: "Shoes" },
                { path: "/shop/t-shirts", label: "T-Shirts" },
                { path: "/shop/shorts", label: "Shorts" },
                { path: "/shop/pants", label: "Pants" },
                { path: "/shop/socks", label: "Socks" },
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="block px-3 py-3 text-base font-medium hover:bg-gray-100 rounded-md transition-colors"
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            
            {/* User Orders Link for Mobile */}
            {!isAdmin && (
              <div className="pt-2 border-t border-gray-200">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="w-full justify-start"
                  onClick={closeMobileMenu}
                >
                  <Link to="/my-orders" className="flex items-center gap-2">
                    <Package size={16} />
                    My Orders
                  </Link>
                </Button>
              </div>
            )}
            
            {/* Admin Links for Mobile */}
            {isAdmin && (
              <div className="pt-2 border-t border-gray-200 space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="w-full justify-start"
                  onClick={closeMobileMenu}
                >
                  <Link to="/admin/products/create" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create Product
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="w-full justify-start"
                  onClick={closeMobileMenu}
                >
                  <Link to="/admin/products/update" className="flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    Update Product
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="w-full justify-start"
                  onClick={closeMobileMenu}
                >
                  <Link to="/admin/orders" className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Admin Orders
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="w-full justify-start"
                  onClick={closeMobileMenu}
                >
                  <Link to="/admin/sales" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Sales Dashboard
                  </Link>
                </Button>
              </div>
            )}
            
            {/* Sign In/Sign Up for Mobile */}
            <div className="pt-2 border-t border-gray-200">
              <SignedOut>
                <div className="flex flex-col gap-2">
                  <Button variant="ghost" size="sm" asChild className="w-full justify-start">
                    <Link to="/sign-in">Sign In</Link>
                  </Button>
                  <Button size="sm" asChild className="w-full">
                    <Link to="/sign-up">Sign Up</Link>
                  </Button>
                </div>
              </SignedOut>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
