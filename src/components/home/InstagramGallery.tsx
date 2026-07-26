"use client";

import { motion } from "framer-motion";
import { Camera } from "lucide-react";

export function InstagramGallery() {
  const images = [
    "/images/gallery_interior_2.jpg",
    "/images/gallery_customcake_2.jpg",
    "/images/gallery_customcake_3.jpg",
    "/images/gallery_event_2.jpg",
    "/images/gallery_dessert_3.jpg",
    "/images/gallery_interior_3.jpg",
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center"
          >
            <Camera className="w-10 h-10 text-muted-foreground mb-4" />
            <h2 className="font-fredoka text-4xl font-bold mb-3">Join Our Community</h2>
            <p className="text-muted-foreground">Follow <a href="#" className="text-text-primary font-semibold hover:text-gold transition-colors">@cakoobakeshop</a> on Instagram</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4">
          {images.map((img, index) => (
            <motion.a
              key={index}
              href="#"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative aspect-square overflow-hidden rounded-xl bg-muted block"
            >
              <div className="absolute inset-0 bg-secondary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
                <Camera className="w-8 h-8 text-primary-foreground" />
              </div>
              <img
                src={img}
                alt="Instagram post"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                onError={(e) => { (e.target as HTMLImageElement).src = "/images/hero_bakery_1783112143212.png" }}
              />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
