"use client";

import { motion } from "framer-motion";
import { useProductStore } from "@/store/productStore";
import { useEffect } from "react";
import { ProductCard } from "@/components/ui/ProductCard";

export function FeaturedCollection() {
  const { products, fetchProducts } = useProductStore();
  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Get 8 popular products
  const featuredProducts = products.filter(p => p.isPopular).slice(0, 8);

  return (
    <section className="py-24 bg-secondary/5 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[13px] font-semibold uppercase tracking-[0.15em] text-primary mb-3 block"
          >
            Cakoo Signatures
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-fredoka text-[40px] md:text-[50px] font-semibold text-text-primary mb-4"
          >
            Our Bakery Favourites
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[16px] md:text-[19px] font-normal leading-[1.8] text-text-secondary max-w-2xl mx-auto"
          >
            The cakes and desserts our customers fall in love with over and over again.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="w-24 h-1 bg-gold mx-auto mt-6 rounded-full"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {featuredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <a href="/shop" className="inline-flex items-center justify-center rounded-full px-8 py-3.5 text-[17px] md:text-[18px] font-semibold text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-1">
            Shop All Bakes
          </a>
        </motion.div>
      </div>
    </section>
  );
}
