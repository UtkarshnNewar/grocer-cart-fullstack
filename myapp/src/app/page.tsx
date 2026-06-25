"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "../store/useStore";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const { user, cart, addToCart, getCartTotal, clearCart, logout } = useStore();

  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Use relative path so Nginx reverse proxy handles it seamlessly in production!
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  const handleCheckout = async () => {
    if (!user) return router.push('/login');
    if (cart.length === 0) return alert("Your Cart is empty! 🛒");
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl">G</div>
              <span className="font-bold text-2xl text-green-700 tracking-tight">GrocerCart</span>
            </div>
            
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="w-full relative">
                <input type="text" placeholder="Search for groceries, vegetables..." className="w-full bg-gray-100 border-none rounded-full py-2.5 pl-5 pr-10 focus:ring-2 focus:ring-green-500 outline-none text-gray-700"/>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Conditional Auth Rendering */}
              {!mounted ? (
                <div className="w-24 h-8 bg-gray-200 animate-pulse rounded-full"></div>
              ) : user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-800 bg-green-50 px-3 py-1 rounded-full border border-green-100">Hi, {user.name}</span>
                  <button onClick={logout} className="text-gray-500 hover:text-red-500 text-sm font-medium transition-colors">Logout</button>
                </div>
              ) : (
                <>
                  <Link href="/login" className="text-gray-600 hover:text-green-600 font-medium hidden sm:block">Login</Link>
                  <Link href="/signup" className="bg-green-600 text-white px-5 py-2 rounded-full font-medium hover:bg-green-700 transition-colors shadow-sm">Sign Up</Link>
                </>
              )}
              
              {/* Dynamic Cart Button */}
              <button onClick={handleCheckout} className="relative py-2 text-gray-600 hover:text-green-600 flex items-center gap-2 border border-gray-200 rounded-full pl-3 pr-4 hover:border-green-600 transition-colors bg-white shadow-sm ml-2 group">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="font-bold text-green-700">₹{getCartTotal()}</span>
                {cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-white shadow-sm">{cart.length}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      <div className="bg-green-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10">
          <div className="max-w-2xl text-center sm:text-left">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
              Fresh Groceries Delivered in <span className="text-green-600">10 Minutes</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">Shop from over 5,000+ fresh vegetables, fruits, dairy, and daily essentials.</p>
            <button className="bg-green-600 text-white px-8 py-3.5 rounded-full font-bold text-lg hover:bg-green-700 transition-transform transform hover:scale-105 shadow-lg">
              Start Shopping Now
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Trending Today</h2>
            <p className="text-gray-500 mt-1">Freshly picked from the Database!</p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <h3 className="text-xl font-bold text-gray-700 mb-2">The Database is Empty!</h3>
            <p className="text-gray-500">Run the seed command to populate MongoDB with groceries.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {products.map((product: any) => (
              <div key={product._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 group flex flex-col">
                <div className="relative h-40 w-full overflow-hidden bg-gray-100">
                  <img src={product.imageUrl} alt={product.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
                  {product.discountPercentage > 0 && (
                    <div className="absolute top-2 left-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded-md text-yellow-900 shadow-sm">
                      {product.discountPercentage}% OFF
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2 leading-tight">{product.name}</h3>
                  <div className="flex justify-between items-center mt-auto pt-3">
                    <span className="font-bold text-gray-900">₹{product.price}<span className="text-xs text-gray-500 font-normal">/{product.unit}</span></span>
                    
                    {/* Add to Cart Button */}
                    <button 
                      onClick={() => {
                        if (!user) return router.push('/login');
                        addToCart({ productId: product._id, name: product.name, price: product.price, quantity: 1, imageUrl: product.imageUrl });
                      }} 
                      className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition-colors border border-green-200 active:scale-95"
                      title="Add to Cart"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </button>
                    
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          <p>&copy; 2026 GrocerCart. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
