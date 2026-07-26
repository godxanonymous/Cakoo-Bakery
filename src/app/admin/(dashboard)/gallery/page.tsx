"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image as ImageIcon, Loader2, Trash2, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const CATEGORIES = ["Cake", "Desserts", "Interior", "Events", "Wedding", "Custom Cakes"];

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  category: string;
  type: string;
  createdAt: number;
}

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Cake");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "gallery"), (snapshot) => {
      const imgs: GalleryImage[] = [];
      snapshot.forEach((doc) => {
        imgs.push({ id: doc.id, ...doc.data() } as GalleryImage);
      });
      imgs.sort((a, b) => b.createdAt - a.createdAt);
      setImages(imgs);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching gallery:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return toast.error("Please select an image");
    if (!file.type.startsWith("image/")) {
      return toast.error("Currently, only image files are supported via ImgBB.");
    }

    setIsUploading(true);
    try {
      setUploadProgress(30);
      const formData = new FormData();
      formData.append("image", file);
      
      const imgbbApiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
      if (!imgbbApiKey) throw new Error("ImgBB API key is missing");

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      
      if (!data.success) {
        throw new Error(data.error?.message || "Failed to upload image");
      }
      
      setUploadProgress(100);
      const url = data.data.url;
      const id = Date.now().toString();

      await setDoc(doc(db, "gallery", id), {
        id,
        url,
        title: title || file.name,
        category,
        type: "image",
        createdAt: Date.now()
      });

      toast.success("Image uploaded to gallery");
      setIsUploadOpen(false);
      setFile(null);
      setTitle("");
      setCategory("Cake");
      setUploadProgress(0);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (image: GalleryImage) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    
    setIsDeleting(image.id);
    try {
      await deleteDoc(doc(db, "gallery", image.id));
      toast.success("Image deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete image");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Gallery Manager</h1>
          <p className="text-slate-500 mt-2">Manage the images showcased on your public website.</p>
        </div>
        <Button onClick={() => setIsUploadOpen(true)} className="bg-primary hover:bg-primary/90 text-white shadow-sm">
          <Plus className="w-4 h-4 mr-2" /> Upload Image
        </Button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 flex justify-center items-center bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-6 h-6 animate-spin mr-2 text-primary" /> Loading gallery...
        </div>
      ) : images.length === 0 ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
          Your gallery is empty. Upload some images to showcase your bakery!
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {images.map((img) => (
            <div key={img.id} className="group relative aspect-square bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <img src={img.url} alt={img.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                <div className="flex justify-between items-start">
                  <span className="bg-primary/90 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                    {img.category}
                  </span>
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="h-8 w-8 rounded-full"
                    onClick={() => handleDelete(img)}
                    disabled={isDeleting === img.id}
                  >
                    {isDeleting === img.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </Button>
                </div>
                <div className="bg-black/60 rounded-md p-2 backdrop-blur-sm">
                  <p className="text-white text-sm font-medium truncate">{img.title}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      <Dialog open={isUploadOpen} onOpenChange={(open) => !isUploading && setIsUploadOpen(open)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload Image</DialogTitle>
            <DialogDescription>
              Add a new image to your public gallery and select its category.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpload}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select 
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Image Title / Description (Optional)</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Custom Wedding Cake" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="file">Select Image</Label>
                <Input 
                  id="file" 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)} 
                  required 
                />
              </div>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="w-full bg-slate-100 rounded-full h-2.5 mt-2 overflow-hidden">
                  <div className="bg-primary h-2.5 rounded-full transition-all" style={{ width: `${uploadProgress}%` }}></div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsUploadOpen(false)} disabled={isUploading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isUploading} className="bg-primary hover:bg-primary/90 text-white">
                {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Upload to Gallery
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
