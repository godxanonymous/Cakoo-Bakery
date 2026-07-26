"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { motion } from "framer-motion";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area 
} from "recharts";
import { 
  ArrowUpRight, ArrowDownRight, Clock, MoreVertical, Plus, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function AdminDashboardPage() {
  const [revenueData, setRevenueData] = useState<any[]>([
    { name: 'Mon', total: 0 }, { name: 'Tue', total: 0 }, { name: 'Wed', total: 0 },
    { name: 'Thu', total: 0 }, { name: 'Fri', total: 0 }, { name: 'Sat', total: 0 }, { name: 'Sun', total: 0 }
  ]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [kpi, setKpi] = useState({
    totalRevenue: 0,
    activeOrders: 0,
    newCustomers: 0,
    avgOrderValue: 0,
    revenueChange: "+0%",
    ordersChange: "+0%",
  });

  const [quickActions, setQuickActions] = useState({
    pendingOrders: 0,
    customOrders: 0,
    outOfStock: 0,
    inactiveBranches: 0,
  });

  useEffect(() => {
    // Live orders listener
    const ordersQuery = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
      let totalRev = 0;
      let active = 0;
      let pending = 0;
      let completedCount = 0;
      const recent: any[] = [];
      
      const dailyRevenue: Record<string, number> = {
        'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0
      };
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      snapshot.forEach((doc) => {
        const order = doc.data();
        const total = Number(order.totalAmount || order.total || 0);
        const status = (order.status || "pending").toLowerCase();
        
        let createdAt = new Date();
        if (order.createdAt?.toDate) {
          createdAt = order.createdAt.toDate();
        } else if (order.createdAt) {
          createdAt = new Date(order.createdAt);
        }
        
        // Active orders (pending or processing)
        if (status === "pending" || status === "processing") {
          active += 1;
        }
        if (status === "pending") {
          pending += 1;
        }

        // Total revenue from delivered orders
        if (status === "delivered") {
          totalRev += total;
          completedCount += 1;
          
          const dayName = daysOfWeek[createdAt.getDay()];
          if (dailyRevenue[dayName] !== undefined) {
             dailyRevenue[dayName] += total;
          }
        }

        // Recent 5 orders list
        if (recent.length < 5) {
          recent.push({
            id: doc.id.slice(0, 8).toUpperCase(),
            customer: order.customerName || order.customer?.name || "Customer",
            product: order.items?.[0]?.name || "Custom Order",
            total: total,
            status: order.status || "Pending",
            time: createdAt.toLocaleDateString()
          });
        }
      });

      const formattedChartData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
        name: day,
        total: dailyRevenue[day]
      }));

      setRevenueData(formattedChartData);
      setRecentOrders(recent);
      
      setKpi(prev => ({
        ...prev,
        totalRevenue: totalRev,
        activeOrders: active,
        avgOrderValue: completedCount > 0 ? Math.round(totalRev / completedCount) : 0
      }));

      setQuickActions(prev => ({ ...prev, pendingOrders: pending }));
    }, (error) => {
      console.error("Error fetching orders for dashboard:", error);
      // Sometimes an index is needed for orderBy, it will log the error here if so
    });

    // Live customers listener
    const unsubscribeCustomers = onSnapshot(collection(db, "customers"), (snapshot) => {
      setKpi(prev => ({
        ...prev,
        newCustomers: snapshot.size
      }));
    });

    // Out of Stock Products
    const unsubscribeProducts = onSnapshot(collection(db, "products"), (snapshot) => {
      let outOfStock = 0;
      snapshot.forEach(doc => {
        if (doc.data().isAvailable === false) outOfStock++;
      });
      setQuickActions(prev => ({ ...prev, outOfStock }));
    });

    // Custom Orders (pending/new)
    const unsubscribeCustomOrders = onSnapshot(collection(db, "custom_orders"), (snapshot) => {
      let customOrders = 0;
      snapshot.forEach(doc => {
        const status = (doc.data().status || "new").toLowerCase();
        if (status === "new" || status === "pending") customOrders++;
      });
      setQuickActions(prev => ({ ...prev, customOrders }));
    });

    // Branches (inactive)
    const unsubscribeBranches = onSnapshot(collection(db, "branches"), (snapshot) => {
      let inactiveBranches = 0;
      snapshot.forEach(doc => {
        if (doc.data().status === "inactive") inactiveBranches++;
      });
      setQuickActions(prev => ({ ...prev, inactiveBranches }));
    });

    return () => {
      unsubscribeOrders();
      unsubscribeCustomers();
      unsubscribeProducts();
      unsubscribeCustomOrders();
      unsubscribeBranches();
    };
  }, []);

  return (
    <>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="font-fredoka text-3xl font-bold text-slate-900">Overview</h1>
          <p className="text-slate-500 mt-1">Welcome back, here is what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="hidden sm:flex border-slate-200 bg-white hover:bg-slate-50 text-slate-700">
            <FileText className="w-4 h-4 mr-2" /> Export
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-white shadow-sm">
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: "Total Revenue", value: `Rs. ${kpi.totalRevenue.toLocaleString()}`, change: kpi.revenueChange, isUp: kpi.revenueChange.startsWith("+") },
          { title: "Active Orders", value: kpi.activeOrders.toString(), change: kpi.ordersChange, isUp: kpi.ordersChange.startsWith("+") },
          { title: "New Customers", value: kpi.newCustomers.toString(), change: "+0%", isUp: true },
          { title: "Avg. Order Value", value: `Rs. ${kpi.avgOrderValue.toLocaleString()}`, change: "+0%", isUp: true },
        ].map((kpiData, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
          >
            <h3 className="text-slate-500 text-sm font-medium mb-2">{kpiData.title}</h3>
            <div className="flex items-end justify-between">
              <span className="font-poppins text-2xl font-bold text-slate-900">{kpiData.value}</span>
              <div className={`flex items-center text-xs font-semibold ${kpiData.isUp ? 'text-emerald-600' : 'text-red-500'}`}>
                {kpiData.isUp ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                {kpiData.change}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        {/* Revenue Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
        >
          <h3 className="font-fredoka text-xl font-bold mb-6 text-slate-900">Revenue This Week</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A8D8B9" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#A8D8B9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} tickFormatter={(value) => `Rs.${value/1000}k`} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => [`Rs. ${Number(value).toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="total" stroke="#5C7A65" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-fredoka text-xl font-bold text-slate-900">Quick Actions</h3>
            <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-slate-100 text-slate-500"><MoreVertical className="w-4 h-4" /></Button>
          </div>
          <div className="space-y-3">
            <Link href="/admin/orders" className="block">
              <div className="flex items-center justify-between p-3 rounded-xl border hover:shadow-sm transition-all border-slate-200">
                <span className="text-sm font-medium text-slate-700">Pending Orders</span>
                {quickActions.pendingOrders > 0 ? (
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full uppercase border bg-red-50 text-red-600 border-red-100">
                    {quickActions.pendingOrders} pending
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full uppercase border bg-green-50 text-green-600 border-green-100">
                    Clear
                  </span>
                )}
              </div>
            </Link>

            <Link href="/admin/custom-orders" className="block">
              <div className="flex items-center justify-between p-3 rounded-xl border hover:shadow-sm transition-all border-slate-200">
                <span className="text-sm font-medium text-slate-700">Custom Cake Requests</span>
                {quickActions.customOrders > 0 ? (
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full uppercase border bg-amber-50 text-amber-600 border-amber-100">
                    {quickActions.customOrders} new
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full uppercase border bg-slate-100 text-slate-600 border-slate-200">
                    None
                  </span>
                )}
              </div>
            </Link>

            <Link href="/admin/products" className="block">
              <div className="flex items-center justify-between p-3 rounded-xl border hover:shadow-sm transition-all border-slate-200">
                <span className="text-sm font-medium text-slate-700">Out of Stock Items</span>
                {quickActions.outOfStock > 0 ? (
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full uppercase border bg-amber-50 text-amber-600 border-amber-100">
                    {quickActions.outOfStock} items
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full uppercase border bg-slate-100 text-slate-600 border-slate-200">
                    Stocked
                  </span>
                )}
              </div>
            </Link>

            <Link href="/admin/branches" className="block">
              <div className="flex items-center justify-between p-3 rounded-xl border hover:shadow-sm transition-all border-slate-200">
                <span className="text-sm font-medium text-slate-700">Inactive Branches</span>
                {quickActions.inactiveBranches > 0 ? (
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full uppercase border bg-red-50 text-red-600 border-red-100">
                    {quickActions.inactiveBranches} inactive
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full uppercase border bg-slate-100 text-slate-600 border-slate-200">
                    All Active
                  </span>
                )}
              </div>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Recent Orders Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-fredoka text-xl font-bold text-slate-900">Recent Orders</h3>
          <Button variant="outline" size="sm" className="border-slate-200 text-slate-600 hover:bg-slate-50">View All</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.map((order, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{order.id}</td>
                  <td className="px-6 py-4 text-slate-700">{order.customer}</td>
                  <td className="px-6 py-4 text-slate-500">{order.product}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900">Rs. {order.total.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${
                      (order.status || '').toLowerCase() === 'delivered' || (order.status || '').toLowerCase() === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      (order.status || '').toLowerCase() === 'processing' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      'bg-red-50 text-red-600 border-red-100'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-slate-500 flex justify-end items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> {order.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </>
  );
}
