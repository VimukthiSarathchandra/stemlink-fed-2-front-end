import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-lg sm:text-xl font-bold text-white">Mebius</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your premier destination for high-quality fashion and lifestyle products. 
              Discover the latest trends and timeless classics.
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 text-center md:text-left">
            <h4 className="text-base sm:text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Home
                </a>
              </li>
              <li>
                <a href="/shop" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Shop
                </a>
              </li>
              <li>
                <a href="/cart" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Cart
                </a>
              </li>
              <li>
                <a href="/my-orders" className="text-gray-300 hover:text-white transition-colors text-sm">
                  My Orders
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4 text-center md:text-left">
            <h4 className="text-base sm:text-lg font-semibold text-white">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Size Guide
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 text-center md:text-left">
            <h4 className="text-base sm:text-lg font-semibold text-white">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <Mail size={16} className="text-gray-400" />
                <span className="text-gray-300 text-sm">support@Mebius.com</span>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <Phone size={16} className="text-gray-400" />
                <span className="text-gray-300 text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <MapPin size={16} className="text-gray-400" />
                <span className="text-gray-300 text-sm">123 Fashion St, Style City, SC 12345</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} Mebius. All rights reserved.
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="text-gray-500 text-xs flex items-center justify-center space-x-1">
              <span>Made by</span>
              <span> <a href="https://vimukthi.dev/" className="text-white hover:text-gray-300 transition-colors">Vimukthi Sarathchandra</a></span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
