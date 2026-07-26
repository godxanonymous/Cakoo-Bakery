"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { Loader2 } from "lucide-react";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  PackageSearch, 
  Boxes, 
  Tags, 
  Cake, 
  MapPin, 
  Truck, 
  Ticket, 
  LineChart, 
  Megaphone, 
  Image as ImageIcon, 
  Settings,
  Search,
  Bell,
  Menu,
  ChevronLeft,
  LogOut
} from "lucide-react";
import { useBranchStore, BRANCHES } from "@/lib/store/branchStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signOut } from "firebase/auth";

const SIDEBAR_ITEMS = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Products", href: "/admin/products", icon: PackageSearch },
  { name: "Categories", href: "/admin/categories", icon: Tags },
  { name: "Custom Cake Orders", href: "/admin/custom-orders", icon: Cake },
  { name: "Branches", href: "/admin/branches", icon: MapPin },
  { name: "Coupons", href: "/admin/coupons", icon: Ticket },
  { name: "Analytics", href: "/admin/analytics", icon: LineChart },
  { name: "Gallery", href: "/admin/gallery", icon: ImageIcon },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  
  const [adminBranchFilter, setAdminBranchFilter] = useState("ALL");
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (!currentUser) {
        router.push("/admin/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-poppins text-slate-900">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: isSidebarOpen ? 260 : 72 }}
        className="bg-white border-r border-slate-200 fixed top-0 left-0 bottom-0 z-50 flex flex-col transition-all overflow-hidden"
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 shrink-0">
          {isSidebarOpen && (
            <Link href="/admin" className="font-fredoka text-xl font-bold tracking-tight text-slate-900 truncate">
              CAKOO <span className="font-poppins text-xs font-medium text-slate-500 ml-1 uppercase tracking-widest">Admin</span>
            </Link>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="shrink-0 rounded-lg hover:bg-slate-100 text-slate-600"
          >
            {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 scrollbar-thin">
          <nav className="space-y-1 px-3">
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors group relative ${
                    isActive 
                      ? "bg-secondary/20 text-slate-900 font-medium" 
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                  title={!isSidebarOpen ? item.name : undefined}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-primary" : "text-slate-500 group-hover:text-slate-700"}`} />
                  {isSidebarOpen && (
                    <span className="text-sm truncate">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
        
        {isSidebarOpen && (
          <div className="p-4 border-t border-slate-200 shrink-0">
            <div className="bg-slate-100 p-3 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 shrink-0 rounded-full bg-secondary/40 flex items-center justify-center text-primary font-bold">
                  SA
                </div>
                <div className="overflow-hidden flex-1">
                  <p className="text-sm font-semibold truncate text-slate-900">System Admin</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="shrink-0 text-slate-500 hover:text-red-600">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </motion.aside>

      {/* Main Content Area */}
      <div 
        className="flex-1 flex flex-col min-h-screen transition-all"
        style={{ paddingLeft: isSidebarOpen ? 260 : 72 }}
      >
        {/* Sticky Header */}
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-40 flex items-center justify-between px-6">
          
          {/* Global Search */}
          <div className="flex-1 max-w-md relative hidden md:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input 
              type="text"
              placeholder="Search orders, customers, or products..."
              className="w-full pl-9 bg-slate-50 border-slate-200 rounded-lg text-sm focus-visible:ring-primary focus-visible:ring-1"
            />
          </div>

          <div className="flex items-center space-x-4 ml-auto">
            {/* Branch Selector Filter */}
            <div className="flex items-center">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mr-3 hidden sm:block">Filter Dashboard:</span>
              <Select value={adminBranchFilter} onValueChange={(val) => setAdminBranchFilter(val || '')}>
                <SelectTrigger className="w-[180px] h-9 bg-slate-50 border-slate-200 rounded-lg text-sm font-medium">
                  <SelectValue placeholder="All Branches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Branches</SelectItem>
                  {Object.values(BRANCHES).map((b) => (
                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative hover:bg-slate-100 rounded-lg text-slate-600">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </Button>
            
            {/* Settings Quick Link */}
            <Button variant="ghost" size="icon" className="hover:bg-slate-100 rounded-lg text-slate-600 hidden sm:flex">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 p-6 md:p-8 bg-slate-50 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
