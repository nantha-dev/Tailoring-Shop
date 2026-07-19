import { useState } from 'react';
import { reportService } from '../services/reportService';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { formatDate } from '../utils/formatDate';
import toast from 'react-hot-toast';

export default function Reports() {
  const [orders, setOrders] = useState([]);
  const [revenue, setRevenue] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await reportService.getOrders({});
      setOrders(res.orders);
    } catch (err) { toast.error(err.message); }
  };

  const fetchRevenue = async () => {
    try {
      const res = await reportService.getRevenue({});
      setRevenue(res);
    } catch (err) { toast.error(err.message); }
  };

  const exportPDF = async () => {
    try {
      const res = await reportService.exportOrdersPDF();
      const url = window.URL.createObjectURL(new Blob([res]));
      const a = document.createElement('a');
      a.href = url; a.download = 'orders-report.pdf'; a.click();
    } catch (err) { toast.error(err.message); }
  };

  const exportExcel = async () => {
    try {
      const res = await reportService.exportOrdersExcel();
      const url = window.URL.createObjectURL(new Blob([res]));
      const a = document.createElement('a');
      a.href = url; a.download = 'orders-report.xlsx'; a.click();
    } catch (err) { toast.error(err.message); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Reports</h1>
      <div className="flex gap-4 flex-wrap">
        <Button onClick={fetchOrders}>Load Orders</Button>
        <Button onClick={fetchRevenue}>Load Revenue</Button>
        <Button variant="outline" onClick={exportPDF}>Export PDF</Button>
        <Button variant="outline" onClick={exportExcel}>Export Excel</Button>
      </div>

      {revenue && (
        <Card>
          <CardHeader><CardTitle>Revenue Report</CardTitle></CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">Total: ₹{revenue.totalRevenue.toLocaleString()}</p>
            <Table>
              <TableHeader><TableRow><TableHead>Invoice</TableHead><TableHead>Customer</TableHead><TableHead>Total</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>
                {revenue.invoices.slice(0, 10).map(inv => (
                  <TableRow key={inv._id}>
                    <TableCell>{inv.invoiceNumber}</TableCell>
                    <TableCell>{inv.customer?.name}</TableCell>
                    <TableCell>₹{inv.grandTotal}</TableCell>
                    <TableCell>{inv.paymentStatus}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {orders.length > 0 && (
        <Table>
          <TableHeader><TableRow><TableHead>Order No</TableHead><TableHead>Customer</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
          <TableBody>
            {orders.slice(0, 20).map(o => (
              <TableRow key={o._id}><TableCell>{o.orderNumber}</TableCell><TableCell>{o.customer?.name}</TableCell><TableCell>{formatDate(o.orderDate)}</TableCell><TableCell>{o.status}</TableCell></TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}