"use client";

import { motion } from "framer-motion";
import { Leaf, Clock, Star, HeartHandshake, Truck, ShieldCheck } from "lucide-react";

const reasons = [
  {
    icon: Leaf,
    title: "Only the Best Ingredients",
    description: "We use only the finest, naturally sourced ingredients for our bakes.",
  },
  {
    icon: Clock,
    title: "Handcrafted with Care",
    description: "Every item is baked fresh daily in our local kitchen.",
  },
  {
    icon: Star,
    title: "Premium Quality",
    description: "Uncompromising standards in taste, texture, and presentation.",
  },
  {
    icon: HeartHandshake,
    title: "Custom Designs",
    description: "Personalized creations tailored specifically to your celebrations.",
  },
  {
    icon: Truck,
    title: "Fresh to Your Door",
    description: "Reliable and careful delivery right to your doorstep.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted locally",
    description: "Loved by hundreds of customers across Wah Cantt.",
  },
];

export function WhyCakoo() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Arch */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-secondary/5 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-fredoka text-[40px] md:text-[50px] font-semibold mb-6 text-text-primary"
          >
            The Cakoo Difference
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[16px] md:text-[19px] font-normal leading-[1.8] text-text-secondary"
          >
            Every bite is handcrafted with premium ingredients, baked fresh daily, and made to turn your celebrations into unforgettable moments.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-bg-light rounded-3xl p-8 border border-border-light hover:border-gold/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-secondary transition-colors duration-300">
                  <Icon className="w-6 h-6 text-gold group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-fredoka text-[20px] md:text-[22px] font-semibold mb-3">{reason.title}</h3>
                <p className="text-[16px] leading-[1.8] text-text-secondary">
                  {reason.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
