"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStore } from "../../store/useStore";

export default function Checkout() {
  const router = useRouter();
  const { user, cart, getCartTotal, clearCart } = useStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  // Redirect if empty or not logged in
  if (!user) {
    if (typeof window !== 'undefined') router.push('/login');
    return null;
  }
  if (cart.length === 0 && !success) {
    if (typeof window !== 'undefined') router.push('/');
    return null;
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify({ 
          products: cart.map(c => ({ productId: c.productId, name: c.name, quantity: c.quantity, price: c.price })),
          totalAmount: getCartTotal()
        })
      });

      if (res.ok) {
        setSuccess(true);
        clearCart();
        setTimeout(() => router.push('/'), 4000);
      } else {
        alert("Payment failed. Please try again.");
        setIsProcessing(false);
      }
    } catch (err) {
      alert("Server error during checkout.");
      setIsProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center border border-green-100">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Order Confirmed!</h2>
          <p className="text-gray-600 mb-8">Thank you for shopping with GrocerCart. Your fresh groceries will arrive in 10 minutes!</p>
          <p className="text-sm font-medium text-green-600">Redirecting to home page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-12">
      <nav className="bg-white shadow-sm py-4">
        <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">G</div>
            <span className="font-bold text-xl text-green-700">GrocerCart</span>
          </Link>
          <h1 className="text-xl font-bold text-gray-800">Secure Checkout</h1>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Payment Form */}
        <div className="md:col-span-2">
          <form onSubmit={handlePayment} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Address</h2>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" required defaultValue={user.name} className="w-full border-gray-300 rounded-lg p-2.5 bg-gray-50 border focus:ring-green-500 focus:border-green-500 outline-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input type="text" required placeholder="123 Main St, Apt 4B" className="w-full border-gray-300 rounded-lg p-2.5 bg-gray-50 border focus:ring-green-500 focus:border-green-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input type="text" required placeholder="Mumbai" className="w-full border-gray-300 rounded-lg p-2.5 bg-gray-50 border focus:ring-green-500 focus:border-green-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                <input type="text" required placeholder="400001" className="w-full border-gray-300 rounded-lg p-2.5 bg-gray-50 border focus:ring-green-500 focus:border-green-500 outline-none" />
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>
            <div className="space-y-3 mb-8">
              <label className="flex items-center p-4 border border-green-600 rounded-lg bg-green-50 cursor-pointer">
                <input type="radio" name="payment" defaultChecked className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300" />
                <span className="ml-3 font-medium text-gray-900">Credit / Debit Card</span>
              </label>
              <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input type="radio" name="payment" className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300" />
                <span className="ml-3 font-medium text-gray-900">UPI (Google Pay, PhonePe)</span>
              </label>
              <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input type="radio" name="payment" className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300" />
                <span className="ml-3 font-medium text-gray-900">Cash on Delivery</span>
              </label>
            </div>

            <button disabled={isProcessing} type="submit" className="w-full bg-green-600 text-white font-bold text-lg py-4 rounded-xl hover:bg-green-700 transition-colors shadow-md disabled:bg-green-400">
              {isProcessing ? 'Processing Payment...' : `Pay ₹${getCartTotal()}`}
            </button>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
          <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
            {cart.map((item, idx) => (
              <div key={idx} className="flex gap-4 items-center border-b border-gray-100 pb-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-800 text-sm truncate">{item.name}</h4>
                  <p className="text-gray-500 text-xs mt-1">Qty: {item.quantity}</p>
                </div>
                <div className="font-bold text-gray-900">
                  ₹{item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3 text-sm text-gray-600 border-t border-gray-200 pt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">₹{getCartTotal()}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="text-green-600 font-medium">FREE</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-3 mt-3 text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>₹{getCartTotal()}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
