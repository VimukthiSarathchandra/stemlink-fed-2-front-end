import { createSlice } from "@reduxjs/toolkit";

// Load cart from localStorage on initialization
const loadCartFromStorage = () => {
  try {
    const cartData = localStorage.getItem('cart');
    return cartData ? JSON.parse(cartData) : [];
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return [];
  }
};

const initialState = {
  cartItems: loadCartFromStorage(),
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const foundItem = state.cartItems.find(
        (item) => item.product._id === newItem._id && item.selectedColor?._id === newItem.selectedColor?._id
      );
      
      // Check if item is in stock
      if (newItem.stock <= 0) {
        console.warn('Cannot add item to cart: Out of stock');
        return;
      }
      
      if (!foundItem) {
        // Add new item to cart with color selection
        state.cartItems.push({ 
          product: newItem, 
          quantity: 1,
          selectedColor: newItem.selectedColor || null
        });
      } else {
        // Check if adding one more would exceed stock
        if (foundItem.quantity >= newItem.stock) {
          console.warn('Cannot add more items: Stock limit reached');
          return;
        }
        foundItem.quantity += 1;
      }
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action) => {
      const itemId = action.payload;
      state.cartItems = state.cartItems.filter(
        (item) => item.product._id !== itemId
      );
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(state.cartItems));
    },
    updateQuantity: (state, action) => {
      const { itemId, quantity } = action.payload;
      const item = state.cartItems.find(
        (item) => item.product._id === itemId
      );
      if (item) {
        // Check stock limit
        if (quantity > item.product.stock) {
          console.warn('Cannot update quantity: Exceeds available stock');
          return;
        }
        
        if (quantity <= 0) {
          state.cartItems = state.cartItems.filter(
            (item) => item.product._id !== itemId
          );
        } else {
          item.quantity = quantity;
        }
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(state.cartItems));
      }
    },
    updateColor: (state, action) => {
      const { itemId, color } = action.payload;
      const item = state.cartItems.find(
        (item) => item.product._id === itemId
      );
      if (item) {
        item.selectedColor = color;
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(state.cartItems));
      }
    },
    clearCart: (state) => {
      state.cartItems = [];
      // Clear from localStorage
      localStorage.removeItem('cart');
    },
  },
});

// Action creators are generated for each case reducer function
export const { addToCart, removeFromCart, updateQuantity, updateColor, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
