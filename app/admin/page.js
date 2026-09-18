'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { formatINR } from '@/lib/utils';
import { IndianRupee, ShoppingCart, Package, AlertTriangle } from 'lucide-react';

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="card-soft p-4 flex items-center gap-3">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <p className="text-xs text-black/50">{label}</p>
        <p className="font-bold text-lg text-black">{value}</p>
        {sub && <p className="text-xs text-black/40">{sub}</p>}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/admin/dashboard')
      .then(async (r) => {
        if (!r.ok) {
          const body = await r.json().catch(() => ({}));
          throw new Error(body.error || `Request failed with status ${r.status}`);
        }
        return r.json();
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load dashboard');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <p className="text-black/50">Loading dashboard...</p>;
  }

  if (error) {
    return (
      <div className="card-soft p-5 border border-red-200 bg-red-50">
        <p className="text-red-600 font-medium mb-1">Failed to load dashboard</p>
        <p className="text-sm text-red-500">{error}</p>
        <p className="text-xs text-black/40 mt-2">
          If this says "Unauthorized", your admin session may have expired — try logging in again.
        </p>
      </div>
    );
  }

  if (!data) {
    return <p className="text-black/50">No dashboard data available.</p>;
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-black mb-5">Dashboard</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={IndianRupee}
          label="Today's Sales"
          value={formatINR(data.today?.sales ?? 0)}
          sub={`${data.today?.orders ?? 0} orders`}
          color="bg-[#C8102E]"
        />
        <StatCard
          icon={IndianRupee}
          label="Weekly Sales"
          value={formatINR(data.week?.sales ?? 0)}
          sub={`${data.week?.orders ?? 0} orders`}
          color="bg-black"
        />
        <StatCard
          icon={IndianRupee}
          label="Monthly Sales"
          value={formatINR(data.month?.sales ?? 0)}
          sub={`${data.month?.orders ?? 0} orders`}
          color="bg-[#7A0C1E]"
        />
        <StatCard
          icon={ShoppingCart}
          label="Pending Orders"
          value={data.pendingOrders ?? 0}
          sub="Need action"
          color="bg-[#6E6E6E]"
        />
      </div>

      <div className="card-soft p-5 mb-6">
        <h2 className="font-semibold mb-4 text-black">Sales Trend (Last 14 Days)</h2>
        {data.trend?.length ? (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data.trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
              <XAxis dataKey="date" fontSize={12} stroke="#000000" opacity={0.5} />
              <YAxis fontSize={12} stroke="#000000" opacity={0.5} />
              <Tooltip formatter={(v) => formatINR(v)} />
              <Line type="monotone" dataKey="sales" stroke="#C8102E" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-black/50">No trend data available.</p>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="card-soft p-5">
          <h2 className="font-semibold mb-3 flex items-center gap-2 text-black">
            <Package size={18} className="text-[#C8102E]" /> Top Selling Products
          </h2>
          {data.topProducts?.length ? (
            <ul className="space-y-2">
              {data.topProducts.map((p) => (
                <li key={p._id} className="flex justify-between text-sm">
                  <span>{p.name}</span>
                  <span className="text-[#C8102E] font-medium">{p.soldCount} sold</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-black/50">No product data yet.</p>
          )}
        </div>

        <div className="card-soft p-5">
          <h2 className="font-semibold mb-3 flex items-center gap-2 text-black">
            <AlertTriangle size={18} className="text-[#7A0C1E]" /> Low Stock Alert
          </h2>
          {!data.lowStock || data.lowStock.length === 0 ? (
            <p className="text-sm text-black/50">All good — no low stock items.</p>
          ) : (
            <ul className="space-y-2">
              {data.lowStock.map((p) => (
                <li key={p._id} className="text-sm">{p.name}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}