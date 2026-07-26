"use client";

import Link from "next/link";
import { ShoppingBag, Search, Menu, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { BranchSelector } from "@/components/ui/BranchSelector";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ANNOUNCEMENTS = [
  "Freshly Baked Daily • Open 9AM–11PM",
  "Custom Celebration Cakes • Order 48 Hours in Advance",
  "Free Delivery on Orders Above Rs.3000",
  "Seasonal Collection Available Now"
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const cartItems = useCartStore((state) => state.items);
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistItems = useWishlistStore((state) => state.items);
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    
    // Announcement Rotation
    const interval = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4000);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500">
      {/* Top Announcement Bar */}
      <div className="bg-primary text-white/90 text-[10px] sm:text-xs py-2 px-4 md:px-8 flex justify-center items-center w-full font-poppins font-medium tracking-wide overflow-hidden relative h-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={announcementIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute text-center"
          >
            {ANNOUNCEMENTS[announcementIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Main Navbar */}
      <div className={`transition-all duration-500 w-full relative ${isScrolled ? 'px-4 pt-4 pb-0' : 'px-4 pt-6 pb-8'}`}>
        {/* Subtle Dark Gradient to differentiate from bg */}
        <div className={`hidden md:block absolute inset-0 bg-gradient-to-b from-black/20 via-black/5 to-transparent pointer-events-none transition-opacity duration-500 ${isScrolled ? 'opacity-0' : 'opacity-100 -z-10'}`} />
        
        <div className={`mx-auto flex items-center justify-between rounded-full px-6 md:px-8 py-3 transition-all duration-500 relative ${
          isScrolled ? 'bg-white/40 backdrop-blur-2xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.05)] max-w-7xl' : 'bg-white/50 backdrop-blur-md border border-white/60 shadow-md max-w-[1400px]'
        }`}>
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Mobile Menu */}
        <div className="flex md:hidden items-center">
          <Sheet>
            <SheetTrigger className="inline-flex shrink-0 items-center justify-center rounded-lg hover:bg-muted text-muted-foreground w-10 h-10" aria-label="Menu">
                <Menu className="w-6 h-6" />
            </SheetTrigger>
            <SheetContent side="left" className="bg-white">
              <nav className="flex flex-col space-y-6 mt-10">
                <Link href="/" className="text-lg font-medium">Home</Link>
                <Link href="/shop" className="text-lg font-medium">Shop</Link>
                <Link href="/celebrations" className="text-lg font-medium">Celebrations</Link>
                <Link href="/gallery" className="text-lg font-medium">Gallery</Link>
                <Link href="/about" className="text-lg font-medium">About</Link>
                <Link href="/visit" className="text-lg font-medium">Visit</Link>
                <BranchSelector isMobile={true} />
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/shop" className="text-[16px] md:text-[17px] font-medium text-text-primary/90 hover:text-primary transition-colors relative group">
            Shop <span className="inline-block ml-0.5 opacity-50 text-[10px]">v</span>
          </Link>
          <Link href="/celebrations" className="text-[16px] md:text-[17px] font-medium text-text-primary/90 hover:text-primary transition-colors relative group">
            Celebrations
          </Link>
          <Link href="/gallery" className="text-[16px] md:text-[17px] font-medium text-text-primary/90 hover:text-primary transition-colors relative group">
            Gallery
          </Link>
          <Link href="/about" className="text-[16px] md:text-[17px] font-medium text-text-primary/90 hover:text-primary transition-colors relative group">
            About <span className="inline-block ml-0.5 opacity-50 text-[10px]">v</span>
          </Link>
          <Link href="/visit" className="text-[16px] md:text-[17px] font-medium text-text-primary/90 hover:text-primary transition-colors relative group">
            Visit
          </Link>
        </nav>

        {/* Logo */}
        <Link href="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center group flex flex-col items-center p-2 md:p-3">
          <img src="/cakoo-logo-transparent.png" alt="Cakoo Bakery" className="w-[120px] md:w-[160px] h-auto object-contain group-hover:opacity-90 transition-opacity" />
        </Link>

        {/* Actions */}
        <div className="flex items-center space-x-1 md:space-x-3">
          <BranchSelector />
          <Link href="/shop" className="hidden sm:inline-flex shrink-0 items-center justify-center rounded-full hover:bg-cream/20 hover:text-primary transition-colors text-text-primary w-10 h-10" aria-label="Search">
            <Search className="w-[18px] h-[18px]" />
          </Link>
          <Link href="/wishlist" className="relative hidden sm:inline-flex shrink-0 items-center justify-center rounded-full hover:bg-cream/20 hover:text-primary transition-colors text-text-primary w-10 h-10" aria-label="Wishlist">
            <Heart className="w-[18px] h-[18px]" />
            {wishlistCount > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-destructive text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-sm">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link href="/cart" className="relative inline-flex shrink-0 items-center justify-center rounded-full hover:bg-cream/20 hover:text-primary transition-colors text-text-primary w-10 h-10" aria-label="Cart">
              <ShoppingBag className="w-[18px] h-[18px]" />
              {cartItemCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-primary text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-sm">
                  {cartItemCount}
                </span>
              )}
          </Link>
          <Link href="https://wa.me/923299927777?text=Hi!%20I'd%20like%20to%20place%20an%20order." target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-full text-[15px] font-medium transition-all duration-300 shadow-md">
            Order Now <span className="text-white/80">→</span>
          </Link>
        </div>
        </div>
      </div>
      </div>
    </header>
  );
}
