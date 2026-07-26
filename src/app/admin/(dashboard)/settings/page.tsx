"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Store, Mail, Phone, Lock, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Settings saved successfully");
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-2">Manage your store preferences, contact details, and admin account.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Store Details */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex items-center gap-2">
            <Store className="w-5 h-5 text-slate-500" />
            <h2 className="text-lg font-semibold text-slate-900">Store Details</h2>
          </div>
          <div className="p-6 grid gap-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input id="storeName" defaultValue="Cakoo Bakery" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <select id="currency" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" defaultValue="PKR">
                  <option value="PKR">Pakistani Rupee (Rs.)</option>
                  <option value="USD">US Dollar ($)</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">Primary WhatsApp Number (For Orders)</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input id="whatsapp" defaultValue="+923001234567" className="pl-9" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Global Configuration */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex items-center gap-2">
            <Globe className="w-5 h-5 text-slate-500" />
            <h2 className="text-lg font-semibold text-slate-900">Store Status</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
              <div>
                <p className="font-medium text-slate-900">Accepting Orders</p>
                <p className="text-sm text-slate-500">Temporarily disable checkout if the bakery is closed.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Admin Account */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex items-center gap-2">
            <Lock className="w-5 h-5 text-slate-500" />
            <h2 className="text-lg font-semibold text-slate-900">Admin Account</h2>
          </div>
          <div className="p-6 grid gap-6">
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input id="email" type="email" defaultValue="admin@cakoo.pk" className="pl-9 bg-slate-50" readOnly />
              </div>
              <p className="text-xs text-slate-500">Contact support to change your admin email.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Change Password</Label>
              <Input id="password" type="password" placeholder="Enter new password" />
            </div>
          </div>
        </motion.div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSaving} className="bg-primary hover:bg-primary/90 text-white shadow-sm px-8">
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
