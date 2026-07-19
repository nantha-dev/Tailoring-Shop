import { useEffect, useState } from 'react';
import { dashboardService } from '../services/dashboardervice';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { formatDate } from '../utils/formatDate';
import { Skeleton } from '../components/ui/skeleton';
import {
  ShoppingCart, Clock, CheckCircle2, Truck, Users, DollarSign
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await dashboardService.getStats();
        setStats(res.stats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <StatCard icon={<ShoppingCart />} label="Today Orders" value={stats.todayOrders} />
        <StatCard icon={<Clock />} label="Pending" value={stats.pendingOrders} />
        <StatCard icon={<CheckCircle2 />} label="In Progress" value={stats.inProgressOrders} />
        <StatCard icon={<CheckCircle2 />} label="Ready" value={stats.readyOrders} />
        <StatCard icon={<Truck />} label="Delivered" value={stats.deliveredOrders} />
        <StatCard icon={<Users />} label="Customers" value={stats.totalCustomers} />
        <StatCard icon={<DollarSign />} label="Revenue (Month)" value={`₹${stats.monthlyRevenue.toLocaleString()}`} />
      </div>

      <Tabs defaultValue="recent">
        <TabsList>
          <TabsTrigger value="recent">Recent Orders</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
        </TabsList>
        <TabsContent value="recent">
          <Card>
            <CardHeader><CardTitle>Recent Orders</CardTitle></CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr><th className="text-left">Order</th><th>Customer</th><th>Date</th><th>Status</th></tr></thead>
                <tbody>
                  {stats.recentOrders.map(order => (
                    <tr key={order._id} className="border-t">
                      <td className="py-2">{order.orderNumber}</td>
                      <td>{order.customer?.name}</td>
                      <td>{formatDate(order.orderDate)}</td>
                      <td><Badge>{order.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="charts">
          <p className="text-muted-foreground">Charts coming soon (integrate Recharts if desired).</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <div className="text-2xl text-primary">{icon}</div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}