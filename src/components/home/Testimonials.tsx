"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

const testimonials = [
  {
    name: "Ayesha K.",
    role: "Regular Customer",
    content: "The Lotus Biscoff cake from Cakoo is literally the best cake I've had in Wah Cantt. It looks so premium and tastes even better. Their packaging is gorgeous too!",
    rating: 5,
  },
  {
    name: "Usman A.",
    role: "Event Planner",
    content: "I always recommend Cakoo Bakery to my clients for their weddings. The custom cakes are a work of art, and they are incredibly professional to work with.",
    rating: 5,
  },
  {
    name: "Fatima M.",
    role: "Birthday Celebration",
    content: "Ordered the Ferrero Rocher cake for my husband's birthday. Not only did it look absolutely stunning, but the taste was out of this world. Highly recommend!",
    rating: 5,
  },
  {
    name: "Zainab R.",
    role: "Dessert Lover",
    content: "Their brownies and premium dessert boxes are my go-to gift for any occasion. Always fresh, perfectly sweet, and visually so pleasing.",
    rating: 5,
  },
];

export function Testimonials() {
  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  return (
    <section className="py-24 bg-secondary/10 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-16">
          <Quote className="w-12 h-12 text-gold/30 mb-6" />
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-fredoka text-[40px] md:text-[50px] font-semibold mb-4 text-text-primary"
          >
            Sweet Words from Sweet People
          </motion.h2>
          <p className="text-[16px] md:text-[19px] font-normal leading-[1.8] text-text-secondary max-w-2xl mx-auto">
            Don't just take our word for it. Here is what our bakery family has to say.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto"
        >
          <Carousel
            plugins={[plugin.current]}
            className="w-full"
            opts={{
              align: "center",
              loop: true,
            }}
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/1 lg:basis-1/2 pl-4">
                  <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-border-light h-full flex flex-col">
                    <div className="flex gap-1 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                      ))}
                    </div>
                    <p className="text-[16px] md:text-[19px] font-normal leading-[1.8] text-text-primary italic mb-8 flex-grow">
                      "{testimonial.content}"
                    </p>
                    <div className="mt-auto">
                      <p className="font-poppins font-semibold text-[17px] md:text-[18px] text-text-primary">{testimonial.name}</p>
                      <p className="text-[14px] md:text-[15px] text-text-secondary">{testimonial.role}</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-4 mt-8">
              <CarouselPrevious className="static translate-y-0 hover:bg-gold hover:text-white border-border-light" />
              <CarouselNext className="static translate-y-0 hover:bg-gold hover:text-white border-border-light" />
            </div>
          </Carousel>
        </motion.div>
      </div>
    </section>
  );
}
