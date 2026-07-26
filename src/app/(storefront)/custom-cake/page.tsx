"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ChevronRight, ChevronLeft, Check, UploadCloud, CheckCircle2, 
  MapPin, Clock, Heart, Sparkles, Cake as CakeIcon, Image as ImageIcon,
  Info, X, Loader2
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useBranchStore, BRANCHES, BranchId } from "@/lib/store/branchStore";
import { submitCustomOrderAction } from "@/app/actions/checkout";

// --- MOCK DATA ---
const OCCASIONS = [
  { id: "birthday", name: "Birthday", icon: CakeIcon },
  { id: "wedding", name: "Wedding", icon: Heart },
  { id: "anniversary", name: "Anniversary", icon: Sparkles },
  { id: "corporate", name: "Corporate", icon: MapPin },
  { id: "other", name: "Other", icon: CheckCircle2 },
];

const FLAVORS = [
  { id: "vanilla", name: "Vanilla Bean", desc: "Classic Madagascar vanilla", price: 0, color: "#FDF5E6", recommendFor: ["wedding", "kids"] },
  { id: "chocolate", name: "Belgian Chocolate", desc: "Rich dark chocolate fudge", price: 500, color: "#3B2F2F", recommendFor: ["birthday", "anniversary"] },
  { id: "redvelvet", name: "Red Velvet", desc: "Signature velvet with cream cheese", price: 300, color: "#8B0000", recommendFor: ["anniversary"] },
  { id: "lotus", name: "Lotus Biscoff", desc: "Caramelized biscuit layers", price: 600, color: "#D4A373", recommendFor: ["corporate", "birthday"] },
];

const WEIGHTS = [
  { id: "2lb", name: "2 lbs", desc: "8-10 servings", price: 3000 },
  { id: "3lb", name: "3 lbs", desc: "12-15 servings", price: 4500 },
  { id: "4lb", name: "4 lbs", desc: "18-22 servings", price: 6000 },
  { id: "5lb", name: "5 lbs", desc: "25-30 servings", price: 7500 },
];

const SHAPES = [
  { id: "round", name: "Classic Round", price: 0 },
  { id: "square", name: "Modern Square", price: 200 },
  { id: "heart", name: "Heart Shape", price: 400 },
  { id: "tiered", name: "Tiered (2+)", price: 1500 },
];

const DECORATIONS = [
  { id: "minimal", name: "Minimalist Elegance", price: 0, recommendFor: ["wedding", "corporate"] },
  { id: "floral", name: "Fresh Floral Array", price: 1200, recommendFor: ["wedding", "anniversary"] },
  { id: "gold", name: "24k Gold Accents", price: 800, recommendFor: ["wedding", "anniversary"] },
  { id: "sprinkles", name: "Joyful Sprinkles", price: 200, recommendFor: ["birthday"] },
  { id: "custom_fondant", name: "Custom Fondant", price: 2000, recommendFor: ["kids", "birthday"] },
];

const STEPS = [
  { id: 'occasion', title: 'Occasion' },
  { id: 'flavor', title: 'Flavor Profile' },
  { id: 'size_shape', title: 'Size & Shape' },
  { id: 'design', title: 'Design & Aesthetics' },
  { id: 'details', title: 'Final Details' }
];

export default function CustomCakeBuilder() {
  const { selectedBranchId } = useBranchStore();
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();
  const addItem = useCartStore(state => state.addItem);
  const scrollRef = useRef<HTMLDivElement>(null);
  const stepContentRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    occasion: "",
    flavor: "",
    weight: "2lb",
    shape: "round",
    decoration: "minimal",
    message: "",
    deliveryDate: "",
    pickupBranch: selectedBranchId,
    instructions: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Auto-save & Restore
  useEffect(() => {
    const saved = localStorage.getItem('cakoo-custom-cake');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.flavor || parsed.occasion) setFormData(prev => ({ ...prev, ...parsed }));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cakoo-custom-cake', JSON.stringify(formData));
  }, [formData]);

  const updateForm = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const calculatePrice = () => {
    let total = 0;
    if (formData.flavor) total += FLAVORS.find(f => f.id === formData.flavor)?.price || 0;
    if (formData.weight) total += WEIGHTS.find(w => w.id === formData.weight)?.price || 0;
    if (formData.shape) total += SHAPES.find(s => s.id === formData.shape)?.price || 0;
    if (formData.decoration) total += DECORATIONS.find(d => d.id === formData.decoration)?.price || 0;
    return total;
  };

  const scrollToStepContent = () => {
    // Small delay to allow Framer Motion to render the new step content
    setTimeout(() => {
      if (stepContentRef.current) {
        const rect = stepContentRef.current.getBoundingClientRect();
        // Check if the top of the step content is significantly above the viewport or below it
        // We account for the sticky navbar (~100px)
        if (rect.top < 120 || rect.bottom > window.innerHeight) {
          const y = rect.top + window.scrollY - 140; // Offset for sticky headers
          window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
        }
      }
    }, 50);
  };

  const handleNext = () => {
    if (currentStep === 0 && !formData.occasion) return toast.error("Please select an occasion.");
    if (currentStep === 1 && !formData.flavor) return toast.error("Please select a flavor profile.");
    if (currentStep === 2 && (!formData.weight || !formData.shape)) return toast.error("Please select size and shape.");
    
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(s => s + 1);
      scrollToStepContent();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(s => s - 1);
      scrollToStepContent();
    }
  };

  const handleSubmitOrder = async () => {
    if (!formData.name || !formData.phone) return toast.error("Please enter your name and phone number.");
    if (!formData.deliveryDate) return toast.error("Please select a fulfillment date.");
    
    setIsSubmitting(true);
    
    const description = `Occasion: ${OCCASIONS.find(o => o.id === formData.occasion)?.name || 'Custom'}. ` +
      `Size: ${WEIGHTS.find(w=>w.id===formData.weight)?.name} ${SHAPES.find(s=>s.id===formData.shape)?.name}. ` +
      `Flavor: ${FLAVORS.find(f=>f.id===formData.flavor)?.name}. ` +
      `Design: ${DECORATIONS.find(d=>d.id===formData.decoration)?.name}. ` +
      `Branch: ${BRANCHES[formData.pickupBranch as BranchId]?.name}. ` +
      `Message: ${formData.message || 'None'}. ` +
      `Special Instructions: ${formData.instructions || 'None'}`;
      
    const res = await submitCustomOrderAction({
      name: formData.name,
      phone: formData.phone,
      description: description,
      configuration: {
        occasion: OCCASIONS.find(o => o.id === formData.occasion)?.name || 'Custom',
        size: `${WEIGHTS.find(w=>w.id===formData.weight)?.name} ${SHAPES.find(s=>s.id===formData.shape)?.name}`,
        flavor: FLAVORS.find(f=>f.id===formData.flavor)?.name,
        design: DECORATIONS.find(d=>d.id===formData.decoration)?.name,
        message: formData.message,
        instructions: formData.instructions
      },
      referenceImage: previewImage || null,
      estimatedPrice: calculatePrice(),
      fulfillmentDate: formData.deliveryDate,
      branchId: formData.pickupBranch,
    });
    
    setIsSubmitting(false);

    if (res.success) {
      localStorage.removeItem('cakoo-custom-cake');
      toast.success("Custom order request submitted successfully! We will contact you soon.");
      router.push("/");
    } else {
      toast.error(res.error || "Failed to submit request.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setTimeout(() => {
        setPreviewImage(URL.createObjectURL(file));
        setIsUploading(false);
        toast.success("Inspiration image attached");
      }, 800);
    }
  };

  // Live Preview Rendering Logic
  const activeFlavor = FLAVORS.find(f => f.id === formData.flavor);
  const activeShape = SHAPES.find(s => s.id === formData.shape);
  const activeDeco = DECORATIONS.find(d => d.id === formData.decoration);

  return (
    <div className="bg-[#FCFBF8] min-h-screen pt-32 pb-32 font-poppins" ref={scrollRef}>
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        
        {/* Header */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <span className="text-primary font-semibold uppercase tracking-widest text-xs mb-4 block">
            Bespoke Creations
          </span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-fredoka text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-text-primary leading-tight"
          >
            Design Your Masterpiece
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary text-lg leading-relaxed"
          >
            A premium guided experience to craft the perfect centerpiece for your celebration. Every layer tailored to perfection.
          </motion.p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* Main Configurator Area */}
          <div className="flex-1 w-full order-2 lg:order-1">
            
            {/* Luxury Stepper */}
            <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/5 mb-8">
              <div className="flex items-center justify-between relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-gray-100 -z-10" />
                <motion.div 
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-gold -z-10"
                  initial={{ width: '0%' }}
                  animate={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
                
                {STEPS.map((step, idx) => {
                  const isCompleted = idx < currentStep;
                  const isCurrent = idx === currentStep;
                  
                  return (
                    <div key={step.id} className="flex flex-col items-center gap-2 relative bg-white px-2">
                      <motion.div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                          isCompleted ? 'bg-gold text-white shadow-md' : 
                          isCurrent ? 'bg-white border-2 border-gold text-gold shadow-sm scale-110' : 
                          'bg-white border-2 border-gray-200 text-gray-400'
                        }`}
                        whileHover={{ scale: isCurrent || isCompleted ? 1.1 : 1 }}
                      >
                        {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
                      </motion.div>
                      <span className={`text-[10px] sm:text-xs font-semibold hidden sm:block absolute -bottom-6 whitespace-nowrap transition-colors ${isCurrent ? 'text-gold' : 'text-gray-400'}`}>
                        {step.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step Content Card */}
            <div ref={stepContentRef} className="bg-white rounded-[2rem] p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/5 min-h-[450px] relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="space-y-8"
                >
                  {/* STEP 0: OCCASION */}
                  {currentStep === 0 && (
                    <>
                      <div>
                        <h2 className="font-fredoka text-3xl font-bold text-text-primary mb-2">What are we celebrating?</h2>
                        <p className="text-text-secondary">This helps us personalize recommendations for you.</p>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {OCCASIONS.map((occ) => {
                          const Icon = occ.icon;
                          const isSelected = formData.occasion === occ.id;
                          return (
                            <div 
                              key={occ.id}
                              onClick={() => updateForm('occasion', occ.id)}
                              className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 group flex flex-col items-center text-center ${
                                isSelected 
                                  ? 'border-gold bg-gold/5 shadow-[0_0_20px_rgba(212,175,55,0.15)] scale-[1.02]' 
                                  : 'border-gray-100 hover:border-gold/30 hover:bg-gray-50'
                              }`}
                            >
                              {isSelected && <CheckCircle2 className="absolute top-3 right-3 w-5 h-5 text-gold" />}
                              <Icon className={`w-8 h-8 mb-4 transition-colors ${isSelected ? 'text-gold' : 'text-gray-400 group-hover:text-gold/60'}`} />
                              <h4 className={`font-semibold ${isSelected ? 'text-text-primary' : 'text-gray-600'}`}>{occ.name}</h4>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {/* STEP 1: FLAVOR */}
                  {currentStep === 1 && (
                    <>
                      <div>
                        <h2 className="font-fredoka text-3xl font-bold text-text-primary mb-2">Select a Flavor Profile</h2>
                        <p className="text-text-secondary">Our premium recipes baked fresh upon order.</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {FLAVORS.map(flavor => {
                          const isSelected = formData.flavor === flavor.id;
                          const isRecommended = flavor.recommendFor.includes(formData.occasion);
                          return (
                            <div 
                              key={flavor.id}
                              onClick={() => updateForm('flavor', flavor.id)}
                              className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex items-center gap-4 ${
                                isSelected 
                                  ? 'border-gold bg-gold/5 shadow-[0_0_20px_rgba(212,175,55,0.15)]' 
                                  : 'border-gray-100 hover:border-gold/30 hover:bg-gray-50'
                              }`}
                            >
                              {isRecommended && !isSelected && (
                                <span className="absolute -top-2.5 right-4 bg-primary text-white text-[9px] uppercase tracking-widest px-2 py-1 rounded-full shadow-sm">
                                  Perfect Match
                                </span>
                              )}
                              {isSelected && <CheckCircle2 className="absolute top-4 right-4 w-5 h-5 text-gold" />}
                              
                              <div className="w-12 h-12 rounded-full border border-black/10 shadow-inner flex-shrink-0" style={{ backgroundColor: flavor.color }} />
                              <div>
                                <h4 className="font-poppins font-semibold text-text-primary text-lg flex items-center gap-2">
                                  {flavor.name}
                                </h4>
                                <p className="text-sm text-text-secondary mt-1">{flavor.desc}</p>
                                {flavor.price > 0 && <p className="text-xs font-semibold text-gold mt-2">+ Rs. {flavor.price}</p>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {/* STEP 2: SIZE & SHAPE */}
                  {currentStep === 2 && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="font-fredoka text-3xl font-bold text-text-primary mb-2">Size & Structure</h2>
                        <p className="text-text-secondary">Determine the foundation of your cake.</p>
                      </div>
                      
                      <div className="space-y-4">
                        <Label className="text-lg font-fredoka font-semibold">Weight & Servings</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {WEIGHTS.map(w => (
                            <div 
                              key={w.id}
                              onClick={() => updateForm('weight', w.id)}
                              className={`p-4 text-center rounded-xl border-2 cursor-pointer transition-all ${
                                formData.weight === w.id 
                                  ? 'border-gold bg-gold/5 shadow-[0_0_15px_rgba(212,175,55,0.1)] scale-[1.02]' 
                                  : 'border-gray-100 hover:border-gold/30'
                              }`}
                            >
                              <h4 className="font-bold text-lg">{w.name}</h4>
                              <p className="text-[10px] uppercase text-gray-500 mt-1">{w.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-gray-100">
                        <Label className="text-lg font-fredoka font-semibold">Cake Shape</Label>
                        <div className="grid grid-cols-2 gap-4">
                          {SHAPES.map(s => (
                            <div 
                              key={s.id}
                              onClick={() => updateForm('shape', s.id)}
                              className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                                formData.shape === s.id 
                                  ? 'border-gold bg-gold/5 shadow-[0_0_15px_rgba(212,175,55,0.1)]' 
                                  : 'border-gray-100 hover:border-gold/30'
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 bg-gray-200 ${
                                  s.id === 'round' ? 'rounded-full' : 
                                  s.id === 'square' ? 'rounded-md' : 
                                  s.id === 'heart' ? 'rounded-t-full rounded-bl-full rotate-45' : 'rounded-t-lg rounded-b-sm'
                                }`} />
                                <span className="font-semibold">{s.name}</span>
                              </div>
                              {formData.shape === s.id && <CheckCircle2 className="w-5 h-5 text-gold" />}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: DESIGN */}
                  {currentStep === 3 && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="font-fredoka text-3xl font-bold text-text-primary mb-2">Aesthetic Details</h2>
                        <p className="text-text-secondary">Personalize the exterior finish and decorations.</p>
                      </div>

                      <div className="space-y-4">
                        <Label className="text-lg font-fredoka font-semibold">Decorative Style</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {DECORATIONS.map(d => {
                            const isSelected = formData.decoration === d.id;
                            const isRecommended = d.recommendFor.includes(formData.occasion);
                            return (
                              <div 
                                key={d.id}
                                onClick={() => updateForm('decoration', d.id)}
                                className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all ${
                                  isSelected ? 'border-gold bg-gold/5 shadow-md' : 'border-gray-100 hover:border-gold/30'
                                }`}
                              >
                                {isRecommended && !isSelected && (
                                  <span className="absolute -top-2.5 right-4 bg-primary text-white text-[9px] uppercase tracking-widest px-2 py-1 rounded-full shadow-sm">
                                    Recommended
                                  </span>
                                )}
                                <div className="flex justify-between items-center">
                                  <span className="font-semibold">{d.name}</span>
                                  {isSelected && <CheckCircle2 className="w-5 h-5 text-gold" />}
                                </div>
                                {d.price > 0 && <p className="text-xs text-gold font-medium mt-2">+ Rs. {d.price}</p>}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-3 pt-4 border-t border-gray-100">
                        <Label className="text-lg font-fredoka font-semibold">
                          Inspiration Upload <span className="text-xs font-normal text-gray-400">Optional</span>
                        </Label>
                        
                        {!previewImage ? (
                          <div className="relative">
                            <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={handleFileUpload} accept="image/*" />
                            <Button variant="outline" className="w-full sm:w-auto rounded-full border-gray-200 text-gray-600 font-medium group relative overflow-hidden" disabled={isUploading}>
                              {isUploading ? (
                                <><div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin mr-2" /> Uploading...</>
                              ) : (
                                <><UploadCloud className="w-4 h-4 mr-2 group-hover:text-gold transition-colors" /> Upload Image</>
                              )}
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-4 bg-gray-50 p-2 pr-4 rounded-full border border-gray-100 w-max">
                            <img src={previewImage} alt="Preview" className="h-10 w-10 object-cover rounded-full" />
                            <div className="flex flex-col">
                              <span className="text-xs font-semibold">Image Attached</span>
                              <span className="text-[10px] text-gray-500 hover:text-red-500 cursor-pointer" onClick={() => setPreviewImage(null)}>Remove image</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* STEP 4: DETAILS */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="font-fredoka text-3xl font-bold text-text-primary mb-2">Final Details</h2>
                        <p className="text-text-secondary">Let us know how to deliver your masterpiece.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                        <div className="space-y-3">
                          <Label className="font-semibold">Full Name <span className="text-red-500">*</span></Label>
                          <Input 
                            placeholder="John Doe" 
                            value={formData.name}
                            onChange={(e) => updateForm('name', e.target.value)}
                            className="py-6 rounded-xl border-gray-200 focus-visible:ring-gold"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label className="font-semibold">Phone Number <span className="text-red-500">*</span></Label>
                          <Input 
                            placeholder="03XXXXXXXXX" 
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => updateForm('phone', e.target.value)}
                            className="py-6 rounded-xl border-gray-200 focus-visible:ring-gold"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="font-semibold">Custom Message on Cake</Label>
                        <Input 
                          placeholder="e.g., Happy 25th Anniversary!" 
                          value={formData.message}
                          onChange={(e) => updateForm('message', e.target.value)}
                          className="py-6 rounded-xl border-gray-200 focus-visible:ring-gold"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <div className="space-y-3">
                          <Label className="font-semibold">Fulfillment Date <span className="text-red-500">*</span></Label>
                          <Input 
                            type="date"
                            value={formData.deliveryDate}
                            onChange={(e) => updateForm('deliveryDate', e.target.value)}
                            className="py-6 rounded-xl border-gray-200 focus-visible:ring-gold"
                          />
                          <p className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" /> Min. 48h notice required</p>
                        </div>
                        
                        <div className="space-y-3">
                          <Label className="font-semibold">Pickup Branch <span className="text-red-500">*</span></Label>
                          <div className="space-y-2">
                            {Object.values(BRANCHES).map(branch => (
                              <div 
                                key={branch.id}
                                onClick={() => updateForm('pickupBranch', branch.id)}
                                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                                  formData.pickupBranch === branch.id ? 'border-gold bg-gold/5 shadow-sm' : 'border-gray-200 hover:border-gold/30'
                                }`}
                              >
                                <span className="text-sm font-medium">{branch.name}</span>
                                {formData.pickupBranch === branch.id && <CheckCircle2 className="w-4 h-4 text-gold" />}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 pt-4">
                        <Label className="font-semibold">Special Instructions</Label>
                        <textarea 
                          placeholder="Allergies, delivery specifics, or specific color hex codes..." 
                          value={formData.instructions}
                          onChange={(e) => updateForm('instructions', e.target.value)}
                          className="w-full min-h-[60px] p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold text-sm"
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-12 pt-6 border-t border-gray-100">
                <Button 
                  variant="ghost" 
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className={`rounded-full px-6 transition-opacity ${currentStep === 0 ? 'opacity-0' : 'opacity-100'}`}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" /> Back
                </Button>

                {currentStep === STEPS.length - 1 ? (
                  <Button 
                    onClick={handleSubmitOrder}
                    disabled={isSubmitting}
                    size="lg"
                    className="rounded-full bg-text-primary text-primary-foreground hover:bg-text-primary/90 px-8 shadow-lg hover:shadow-xl transition-all"
                  >
                    {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</> : <>Submit Request <Check className="w-4 h-4 ml-2" /></>}
                  </Button>
                ) : (
                  <Button 
                    onClick={handleNext}
                    size="lg"
                    className="rounded-full bg-gold text-white hover:bg-gold/90 px-10 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                  >
                    Continue <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Right Sticky Summary Panel */}
          <div className="w-full lg:w-[380px] shrink-0 sticky top-32 z-20">
            <div className="bg-white rounded-[1.5rem] shadow-[0_15px_40px_rgb(0,0,0,0.06)] border border-black/5 overflow-hidden flex flex-col">
              
              {/* Progress Indicator */}
              <div className="bg-[#FCFBF8] px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-gray-400 text-[9px] uppercase tracking-widest font-bold">Progress</span>
                  <div className="font-semibold text-text-primary text-xs mt-0.5">Step {currentStep + 1} of {STEPS.length}</div>
                </div>
                <div className="text-gold font-bold text-sm bg-gold/10 px-2 py-1 rounded-full">{Math.round(((currentStep + 1) / STEPS.length) * 100)}%</div>
              </div>

              <div className="p-6 space-y-6">
                
                {/* 1. Compact Inspiration */}
                <div>
                  <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-gray-50 shadow-inner group">
                    <AnimatePresence mode="popLayout">
                      <motion.img 
                        key={formData.occasion || 'default'}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        src={
                          previewImage ? previewImage :
                          formData.occasion === 'wedding' ? '/images/cat_wedding_1783112161369.png' :
                          formData.occasion === 'birthday' ? '/images/cat_birthday_1783112152320.png' :
                          formData.occasion === 'anniversary' ? '/images/prod_gold_leaf_1783112275495.png' :
                          formData.occasion === 'corporate' ? '/images/cat_gift_boxes_1783112178444.png' :
                          '/images/hero_bakery_1783112143212.png'
                        }
                        alt="Cake Inspiration"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]"
                      />
                    </AnimatePresence>
                    <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-md px-2 py-1 rounded text-[9px] text-white font-medium">Ref Image</div>
                  </div>
                </div>

                {/* 2. Condensed Order Summary */}
                <div>
                  <h3 className="font-fredoka text-lg font-bold mb-3 text-text-primary">
                    Order Details
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600 bg-gray-50/50 p-3 rounded-lg border border-gray-100">
                    
                    {/* Occasion • Weight • Shape */}
                    <div className="font-medium text-text-primary">
                      {formData.occasion ? <span className="capitalize">{formData.occasion}</span> : '—'} 
                      <span className="text-gray-300 mx-1.5">•</span> 
                      {formData.weight ? WEIGHTS.find(w=>w.id===formData.weight)?.name : '—'} 
                      <span className="text-gray-300 mx-1.5">•</span> 
                      {activeShape?.name || '—'}
                    </div>

                    {/* Flavor • Finish */}
                    <div className="text-xs pt-1">
                      <span className="text-gray-400 mr-2">Style:</span>
                      {activeFlavor?.name || '—'} <span className="text-gray-300 mx-1">•</span> {activeDeco?.name || '—'}
                    </div>

                    {formData.message && (
                      <div className="text-xs pt-1 italic text-gray-500">
                        "{formData.message}"
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Compact Badges: Preparation & Branches */}
                <div className="flex flex-wrap gap-2">
                  <div className="bg-primary/10 border border-primary/20 text-primary px-2.5 py-1.5 rounded-md text-[10px] font-bold flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> 
                    Prep: {formData.shape === 'tiered' || formData.decoration === 'custom_fondant' ? '72h' : '48h'}
                  </div>
                  
                  <div className="bg-gray-50 border border-gray-200 text-gray-600 px-2.5 py-1.5 rounded-md text-[10px] font-bold flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    Available: 
                    <span className="flex items-center gap-0.5 ml-0.5 text-green-600"><CheckCircle2 className="w-3 h-3" /> RWP</span>
                    {activeFlavor?.id !== 'lotus' && <span className="flex items-center gap-0.5 ml-1 text-green-600"><CheckCircle2 className="w-3 h-3" /> Wah</span>}
                  </div>
                </div>

                {/* 4. Pricing (Concise) */}
                <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                  <div>
                    <span className="text-gray-400 text-[10px] uppercase tracking-widest font-bold block mb-0.5">Estimated Total</span>
                  </div>
                  <AnimatePresence mode="popLayout">
                    <motion.span 
                      key={calculatePrice()}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="font-poppins font-bold text-xl text-text-primary"
                    >
                      Rs. {calculatePrice().toLocaleString()}
                    </motion.span>
                  </AnimatePresence>
                </div>

                {/* 5. Recommendations */}
                {formData.occasion && (
                  <div className="pt-4 border-t border-gray-100">
                    <h4 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Recommended</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {formData.occasion === 'wedding' && (
                        <><span className="text-[9px] font-bold bg-gold/5 text-gold border border-gold/10 px-2 py-1 rounded">Dessert Table</span> <span className="text-[9px] font-bold bg-gold/5 text-gold border border-gold/10 px-2 py-1 rounded">Flowers</span></>
                      )}
                      {formData.occasion === 'birthday' && (
                        <><span className="text-[9px] font-bold bg-gold/5 text-gold border border-gold/10 px-2 py-1 rounded">Sparkler Candles</span> <span className="text-[9px] font-bold bg-gold/5 text-gold border border-gold/10 px-2 py-1 rounded">Cupcakes</span></>
                      )}
                      {(formData.occasion !== 'wedding' && formData.occasion !== 'birthday') && (
                        <><span className="text-[9px] font-bold bg-gold/5 text-gold border border-gold/10 px-2 py-1 rounded">Premium Box</span> <span className="text-[9px] font-bold bg-gold/5 text-gold border border-gold/10 px-2 py-1 rounded">Gift Card</span></>
                      )}
                    </div>
                  </div>
                )}
                
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
