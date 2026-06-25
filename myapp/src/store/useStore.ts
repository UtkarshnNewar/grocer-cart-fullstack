import { create } from 'zustand';

export interface User {
  id: string;
  name: string;
  email: string;
  token: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface AppState {
  user: User | null;
  cart: CartItem[];
  login: (user: User) => void;
  logout: () => void;
  addToCart: (item: CartItem) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

export const useStore = create<AppState>((set, get) => ({
  user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null,
  cart: [],
  login: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },
  logout: () => {
    localStorage.removeItem('user');
    set({ user: null });
  },
  addToCart: (item) => {
    const { cart } = get();
    const existing = cart.find(c => c.productId === item.productId);
    if (existing) {
      set({ cart: cart.map(c => c.productId === item.productId ? { ...c, quantity: c.quantity + 1 } : c) });
    } else {
      set({ cart: [...cart, { ...item, quantity: 1 }] });
    }
  },
  clearCart: () => set({ cart: [] }),
  getCartTotal: () => {
    return get().cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}));
