"use client";

import { motion } from "framer-motion";
import { Product } from "@/lib/mockData";
import { Heart, ShoppingBag, Eye, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ ...product, quantity: 1 });
    toast.success(`${product.name} added to cart!`);
  };

  const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist, hasItem: isWishlisted } = useWishlistStore();
  const isFavorite = isWishlisted(product.id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite) {
      removeFromWishlist(product.id);
      toast(`${product.name} removed from wishlist`);
    } else {
      addToWishlist(product);
      toast.success(`${product.name} added to wishlist`);
    }
  };

  // Get the actual product image
  const imageSrc = product.images?.[0] || "/images/hero_bakery_1783112143212.png";

  // If mock data doesn't have availability yet, default to true for both to prevent breaking
  const availability = product.availability || { 'rawalpindi': true, 'wah-cantt': true };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: (index % 8) * 0.05 }}
      className="group"
    >
      <Link href={`/product/${product.id}`} className="block h-full">
        <div className="bg-[#FCFBF8] rounded-[2rem] border border-black/5 overflow-hidden hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 h-full flex flex-col group/card">
          {/* Image Container */}
          <div className="relative aspect-[4/5] overflow-hidden bg-black/5">
            {/* Badges */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
              {product.isNew && (
                <span className="bg-text-primary text-white text-[9px] font-semibold px-3 py-1 uppercase tracking-widest rounded-full shadow-md backdrop-blur-md">
                  Fresh Arrival
                </span>
              )}
              {product.isPopular && (
                <span className="bg-white/90 text-text-primary text-[9px] font-semibold px-3 py-1 uppercase tracking-widest rounded-full shadow-md backdrop-blur-md">
                  Customer Favourite
                </span>
              )}
            </div>

            {/* Hover Actions - Wishlist */}
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
              <Button 
                size="icon" 
                variant="ghost" 
                className={`w-9 h-9 rounded-full bg-white/80 backdrop-blur-md shadow-sm border transition-colors ${isFavorite ? 'border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive' : 'border-black/5 text-text-primary hover:bg-white hover:text-primary'}`} 
                onClick={toggleWishlist}
              >
                <Heart className={`w-[18px] h-[18px] ${isFavorite ? 'fill-destructive' : ''}`} />
              </Button>
            </div>

            <img
              src={imageSrc}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
              onError={(e) => { (e.target as HTMLImageElement).src = "/images/hero_bakery_1783112143212.png" }}
            />
            
            {/* Quick Add Button */}
            <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out bg-gradient-to-t from-black/60 via-black/20 to-transparent">
              <Button 
                className="w-full rounded-full bg-white text-text-primary hover:bg-primary hover:text-white transition-colors shadow-xl h-12 text-[14px] font-semibold tracking-wide"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="w-4 h-4 mr-2" /> Add to Box
              </Button>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 flex flex-col flex-grow bg-[#FCFBF8]">
            <div className="flex items-center space-x-1 mb-3">
              <Star className="w-[14px] h-[14px] fill-gold text-gold" />
              <span className="text-xs font-medium text-text-primary">{product.rating}</span>
            </div>
            
            <h3 className="font-fredoka text-[20px] md:text-[22px] font-semibold text-text-primary line-clamp-1 mb-2 group-hover:text-primary transition-colors duration-300">
              {product.name}
            </h3>
            
            {/* Branch Availability */}
            <div className="flex flex-col gap-1.5 mb-4">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Available At</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                  <span className={`w-2 h-2 rounded-full ${availability['wah-cantt'] ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]'}`}></span>
                  Wah Cantt
                </div>
                <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                  <span className={`w-2 h-2 rounded-full ${availability['rawalpindi'] ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]'}`}></span>
                  Rawalpindi
                </div>
              </div>
            </div>

            <p className="font-poppins text-[16px] leading-[1.8] text-text-secondary mb-6 line-clamp-2 flex-grow">
              {product.description}
            </p>
            
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-border-light">
              <span className="font-poppins font-semibold text-[17px] text-text-primary tracking-wide">
                Rs. {product.price.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
