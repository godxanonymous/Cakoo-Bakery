"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useProductStore } from "@/store/productStore";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star, Minus, Plus, Heart, Share2, Truck, Store, Info, ChevronRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { toast } from "sonner";
import { ProductCard } from "@/components/ui/ProductCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function ProductDetailsPage() {
  const params = useParams();
  const { products, fetchProducts, isLoading } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const product = products.find(p => p.id === params.id);
  const [quantity, setQuantity] = useState(1);
  const [flavor, setFlavor] = useState(product?.flavorOptions?.[0] || "");
  const [weight, setWeight] = useState(product?.weightOptions?.[0] || "");
  const [size, setSize] = useState(product?.sizeOptions?.[0]?.name || "");
  const [deliveryType, setDeliveryType] = useState("delivery");
  const [message, setMessage] = useState("");
  const addItem = useCartStore(state => state.addItem);
  
  const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist, hasItem: isWishlisted } = useWishlistStore();
  const isFavorite = product ? isWishlisted(product.id) : false;

  const toggleWishlist = () => {
    if (!product) return;
    if (isFavorite) {
      removeFromWishlist(product.id);
      toast(`${product.name} removed from wishlist`);
    } else {
      addToWishlist(product);
      toast.success(`${product.name} added to wishlist`);
    }
  };

  if (isLoading && !product) return <div className="pt-32 text-center pb-24 h-screen">Loading product...</div>;
  if (!product) return <div className="pt-32 text-center pb-24 h-screen">Product not found</div>;

  // Use the actual product image
  const imageSrc = product.images?.[0] || "/images/hero_bakery_1783112143212.png";

  const currentPrice = product?.sizeOptions?.find(s => s.name === size)?.price || product.price;

  const handleAddToCart = () => {
    addItem({
      ...product,
      price: currentPrice,
      quantity,
      selectedFlavor: flavor,
      selectedWeight: weight,
      selectedSize: size,
      message
    });
    toast.success(`${product.name} added to cart`);
  };

  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="bg-white min-h-screen pt-24 pb-24">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center text-sm text-muted-foreground gap-2">
          <span className="hover:text-text-primary cursor-pointer">Home</span>
          <ChevronRight className="w-3 h-3" />
          <span className="hover:text-text-primary cursor-pointer">{product.category}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-text-primary font-medium">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-12 mb-20">
          
          {/* Gallery Area */}
          <div className="lg:w-1/2 space-y-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square rounded-3xl overflow-hidden bg-muted relative group"
            >
              <img 
                src={imageSrc} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => { (e.target as HTMLImageElement).src = "/images/hero_bakery_1783112143212.png" }}
              />
              {/* 360 preview placeholder badge */}
              <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 shadow-sm cursor-pointer hover:bg-white transition-colors">
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse" /> 360° Preview Available
              </div>
            </motion.div>
            
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className={`aspect-square rounded-xl overflow-hidden bg-muted cursor-pointer border-2 ${i === 0 ? 'border-gold' : 'border-transparent'}`}>
                  <img src={imageSrc} alt="" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details Area */}
          <div className="lg:w-1/2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="sticky top-24"
            >
              <div className="flex justify-between items-start mb-2">
                <h1 className="font-fredoka text-3xl md:text-4xl font-bold text-text-primary">{product.name}</h1>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="rounded-full bg-bg-light hover:bg-secondary/30"><Share2 className="w-4 h-4" /></Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleWishlist}
                    className={`rounded-full transition-colors ${isFavorite ? 'bg-destructive/10 text-destructive' : 'bg-bg-light hover:bg-secondary/30 text-destructive'}`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-destructive' : ''}`} />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-gold text-gold" />
                  <span className="font-semibold text-sm">{product.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground underline cursor-pointer">{product.reviews} Reviews</span>
              </div>

              <p className="text-2xl font-poppins font-bold text-text-primary mb-6">
                Rs. {currentPrice.toLocaleString()}
              </p>

              <p className="text-muted-foreground mb-8 leading-relaxed">
                {product.description}
              </p>

              {/* Options */}
              <div className="space-y-6 mb-8">
                {product.flavorOptions && (
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Select Flavor</Label>
                    <div className="flex flex-wrap gap-3">
                      {product.flavorOptions.map(opt => (
                        <button
                          key={opt}
                          onClick={() => setFlavor(opt)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${flavor === opt ? 'bg-secondary text-primary-foreground border-secondary' : 'bg-white border-border-light text-muted-foreground hover:border-gold'}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {product.weightOptions && (
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Select Weight</Label>
                    <div className="flex flex-wrap gap-3">
                      {product.weightOptions.map(opt => (
                        <button
                          key={opt}
                          onClick={() => setWeight(opt)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${weight === opt ? 'bg-secondary text-primary-foreground border-secondary' : 'bg-white border-border-light text-muted-foreground hover:border-gold'}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {product.sizeOptions && (
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Select Size</Label>
                    <div className="flex flex-wrap gap-3">
                      {product.sizeOptions.map(opt => (
                        <button
                          key={opt.name}
                          onClick={() => setSize(opt.name)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${size === opt.name ? 'bg-secondary text-primary-foreground border-secondary' : 'bg-white border-border-light text-muted-foreground hover:border-gold'}`}
                        >
                          {opt.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <Label className="text-base font-semibold">Message on Cake (Optional)</Label>
                  <Input 
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Happy Birthday!" 
                    className="rounded-xl border-border-light focus-visible:ring-gold"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-semibold">Delivery Method</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div 
                      onClick={() => setDeliveryType('delivery')}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-colors ${deliveryType === 'delivery' ? 'border-gold bg-gold/5 text-gold' : 'border-border-light text-muted-foreground hover:border-gold/50'}`}
                    >
                      <Truck className="w-6 h-6 mb-2" />
                      <span className="font-medium text-sm">Delivery</span>
                    </div>
                    <div 
                      onClick={() => setDeliveryType('pickup')}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-colors ${deliveryType === 'pickup' ? 'border-gold bg-gold/5 text-gold' : 'border-border-light text-muted-foreground hover:border-gold/50'}`}
                    >
                      <Store className="w-6 h-6 mb-2" />
                      <span className="font-medium text-sm">Store Pickup</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add to Cart Sticky-like behavior */}
              <div className="flex items-center gap-4 py-6 border-t border-b border-border-light mb-8">
                <div className="flex items-center border border-border-light rounded-full p-1 bg-bg-light">
                  <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-10 text-center font-medium">{quantity}</span>
                  <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full" onClick={() => setQuantity(quantity + 1)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <Button 
                  onClick={handleAddToCart}
                  className="flex-1 rounded-full py-6 text-[17px] md:text-[18px] font-semibold bg-text-primary text-primary-foreground hover:bg-text-primary/90"
                >
                  Add to My Box — Rs. {(currentPrice * quantity).toLocaleString()}
                </Button>
              </div>

              <div className="flex items-start gap-4 text-sm text-muted-foreground bg-bg-light p-4 rounded-xl border border-border-light">
                <Info className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <p>Order now to receive by tomorrow. Freshly baked upon order confirmation. 100% vegetarian ingredients available upon request.</p>
              </div>

            </motion.div>
          </div>
        </div>

        {/* Tabs section for Description, Ingredients, Reviews */}
        <div className="mb-20">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="w-full flex flex-wrap justify-start border-b border-border-light rounded-none bg-transparent h-auto p-0 gap-6 md:gap-8 mb-8">
              <TabsTrigger value="details" className="whitespace-nowrap rounded-none border-b-2 border-transparent data-[state=active]:border-gold data-[state=active]:bg-transparent data-[state=active]:shadow-none py-4 text-sm md:text-base font-semibold data-[state=active]:text-text-primary px-0">Product Details</TabsTrigger>
              <TabsTrigger value="ingredients" className="whitespace-nowrap rounded-none border-b-2 border-transparent data-[state=active]:border-gold data-[state=active]:bg-transparent data-[state=active]:shadow-none py-4 text-sm md:text-base font-semibold data-[state=active]:text-text-primary px-0">Ingredients & Nutrition</TabsTrigger>
              <TabsTrigger value="reviews" className="whitespace-nowrap rounded-none border-b-2 border-transparent data-[state=active]:border-gold data-[state=active]:bg-transparent data-[state=active]:shadow-none py-4 text-sm md:text-base font-semibold data-[state=active]:text-text-primary px-0">Reviews ({product.reviews})</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="text-muted-foreground leading-relaxed">
              <p className="mb-4">Our {product.name} is a testament to our commitment to quality. Handcrafted by our master bakers, this cake features multiple layers of delicate sponge, perfectly balanced with our signature fillings and frostings. Every element is made from scratch using traditional recipes and premium imported ingredients.</p>
              <p>Storage Instructions: Keep refrigerated. Consume within 3 days for the best experience. Serve at room temperature.</p>
            </TabsContent>
            <TabsContent value="ingredients" className="text-muted-foreground leading-relaxed">
              <p className="mb-4"><strong>Ingredients:</strong> Premium wheat flour, free-range eggs, pure butter, refined sugar, Madagascar vanilla extract, baking powder, sea salt, full-cream milk.</p>
              <p><strong>Allergen Information:</strong> Contains gluten, dairy, and eggs. May contain traces of nuts as it is prepared in a facility that handles tree nuts.</p>
            </TabsContent>
            <TabsContent value="reviews">
              <div className="space-y-6">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="bg-bg-light p-6 rounded-2xl border border-border-light">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary-foreground font-bold">
                          {String.fromCharCode(65 + i)}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">Customer {i + 1}</p>
                          <div className="flex gap-1 mt-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} className="w-3 h-3 fill-gold text-gold" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">1 week ago</span>
                    </div>
                    <p className="text-muted-foreground text-sm italic">"Absolutely delicious! The presentation was impeccable and the taste was even better. Will definitely order again."</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="font-fredoka text-3xl font-bold mb-8 text-center md:text-left">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
