"use client";

import Link from "next/link";
import { Camera, Globe, Video, MessageCircle, MapPin, Phone, Mail } from "lucide-react";
import { useBranchStore } from "@/lib/store/branchStore";
import { useEffect, useState } from "react";

export function Footer() {
  const { getCurrentBranch } = useBranchStore();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const branch = getCurrentBranch();

  if (!mounted) return <footer className="bg-white pt-16 pb-8 border-t border-border-light min-h-[400px]"></footer>;

  return (
    <footer className="bg-white pt-16 pb-8 border-t border-border-light">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm">
              <img src="/cakoo-logo-transparent.png" alt="Cakoo Bakery" className="w-[140px] md:w-[160px] h-auto object-contain cursor-pointer" />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mt-2">
              Delicious cakes & desserts made with heart. Joy in every bite.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a href="https://instagram.com/cakoobakery" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="transition-transform hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-full">
                <img src="/images/INSTAGRAM.webp" alt="Instagram" className="w-9 h-9 object-cover rounded-full shadow-sm" />
              </a>
              <a href="https://facebook.com/cakoobakery" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="transition-transform hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-full">
                <img src="/images/FACEBOOK.webp" alt="Facebook" className="w-9 h-9 object-cover rounded-full shadow-sm" />
              </a>
              <a href="https://www.tiktok.com/@cakoobakeshop" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="transition-transform hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-full">
                <img src="/images/TIKTOK.webp" alt="TikTok" className="w-9 h-9 object-cover rounded-full shadow-sm" />
              </a>
              <a href={branch.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="transition-transform hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-full">
                <img src="/images/WHATSAPP.webp" alt="WhatsApp" className="w-9 h-9 object-cover rounded-full shadow-sm" />
              </a>
              <a href={branch.mapUrl} target="_blank" rel="noopener noreferrer" aria-label="Google Maps" className="transition-transform hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-full">
                <img src="/images/MAPS.webp" alt="Google Maps" className="w-9 h-9 object-cover rounded-full shadow-sm" />
              </a>
              <a href={`mailto:${branch.email}`} target="_blank" rel="noopener noreferrer" aria-label="Email" className="transition-transform hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-full">
                <img src="/images/MAIL.webp" alt="Email" className="w-9 h-9 object-cover rounded-full shadow-sm" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-poppins font-semibold mb-5 text-lg">Shop</h3>
            <ul className="space-y-3">
              <li><Link href="/shop" className="text-muted-foreground hover:text-gold transition-colors text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm inline-block">All Cakes</Link></li>
              <li><Link href="/shop?collection=Custom+Cakes" className="text-muted-foreground hover:text-gold transition-colors text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm inline-block">Custom Cakes</Link></li>
              <li><Link href="/shop?collection=Wedding+Cakes" className="text-muted-foreground hover:text-gold transition-colors text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm inline-block">Wedding Cakes</Link></li>
              <li><Link href="/shop?collection=Desserts" className="text-muted-foreground hover:text-gold transition-colors text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm inline-block">Desserts</Link></li>
              <li><Link href="/shop?collection=Gift+Boxes" className="text-muted-foreground hover:text-gold transition-colors text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm inline-block">Gift Boxes</Link></li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="font-poppins font-semibold mb-5 text-lg">Information</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-muted-foreground hover:text-gold transition-colors text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm inline-block">Our Story</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-gold transition-colors text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm inline-block">Contact Us</Link></li>
              <li><Link href="/faq" className="text-muted-foreground hover:text-gold transition-colors text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm inline-block">FAQs</Link></li>
              <li><Link href="/delivery-policy" className="text-muted-foreground hover:text-gold transition-colors text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm inline-block">Delivery Policy</Link></li>
              <li><Link href="/privacy-policy" className="text-muted-foreground hover:text-gold transition-colors text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm inline-block">Privacy Policy</Link></li>
              <li><Link href="/admin" className="text-muted-foreground hover:text-gold transition-colors text-sm flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm w-fit"><span className="w-1.5 h-1.5 rounded-full bg-secondary mr-2" />Admin Portal</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-poppins font-semibold mb-5 text-lg">Contact</h3>
            <ul className="space-y-4 mb-6">
              <li className="flex items-start text-sm text-muted-foreground">
                <a href={branch.mapUrl} target="_blank" rel="noopener noreferrer" className="flex items-start space-x-3 hover:text-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm p-1 -ml-1 text-left">
                  <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <span>{branch.address}</span>
                </a>
              </li>
              <li className="flex items-center text-sm text-muted-foreground">
                <a href={`tel:${branch.phone.replace(/[^0-9+]/g, '')}`} className="flex items-center space-x-3 hover:text-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm p-1 -ml-1">
                  <Phone className="w-5 h-5 text-gold shrink-0" />
                  <span>{branch.phone}</span>
                </a>
              </li>
              <li className="flex items-center text-sm text-muted-foreground">
                <a href={`mailto:${branch.email}`} className="flex items-center space-x-3 hover:text-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm p-1 -ml-1">
                  <Mail className="w-5 h-5 text-gold shrink-0" />
                  <span>{branch.email}</span>
                </a>
              </li>
            </ul>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
              <span className="opacity-70">Currently Viewing</span>
              <MapPin className="w-3 h-3" />
              {branch.name}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border-light flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Cakoo Bakery. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <img src="/images/img1.webp" alt="Payment Methods" className="h-6 object-contain opacity-50 grayscale hover:grayscale-0 transition-all" />
          </div>
        </div>
      </div>
    </footer>
  );
}
