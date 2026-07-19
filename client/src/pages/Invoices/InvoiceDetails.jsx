import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { invoiceService } from '../../services/invoiceService';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { formatDate } from '../../utils/formatDate';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { PAYMENT_METHODS } from '../../utils/constants';
import toast from 'react-hot-toast';

export default function InvoiceDetails() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [payments, setPayments] = useState([]);
  const [paymentDialog, setPaymentDialog] = useState(false);

  const fetch = async () => {
    const res = await invoiceService.getById(id);
    setInvoice(res.invoice);
    setPayments(res.payments);
  };

  useEffect(() => { fetch(); }, [id]);

  const handlePayment = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const amount = parseFloat(form.get('amount'));
    const method = form.get('method');
    try {
      await invoiceService.recordPayment(id, { amount, method });
      toast.success('Payment recorded');
      fetch();
      setPaymentDialog(false);
    } catch (err) { toast.error(err.message); }
  };

  if (!invoice) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Invoice {invoice.invoiceNumber}</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div><span className="font-semibold">Customer:</span> {invoice.customer?.name}</div>
          <div><span className="font-semibold">Grand Total:</span> ₹{invoice.grandTotal}</div>
          <div><span className="font-semibold">Paid:</span> ₹{invoice.paidAmount}</div>
          <div><span className="font-semibold">Status:</span> <Badge>{invoice.paymentStatus}</Badge></div>
        </CardContent>
      </Card>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Payments</h2>
        <Dialog open={paymentDialog} onOpenChange={setPaymentDialog}>
          <DialogTrigger asChild><Button>Record Payment</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Payment</DialogTitle></DialogHeader>
            <form onSubmit={handlePayment} className="space-y-4">
              <Input name="amount" type="number" step="0.01" placeholder="Amount" required />
              <Select name="method">
                <SelectTrigger><SelectValue placeholder="Method" /></SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button type="submit">Save</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader><TableRow><TableHead>Amount</TableHead><TableHead>Method</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
        <TableBody>
          {payments.map(p => (
            <TableRow key={p._id}>
              <TableCell>₹{p.amount}</TableCell>
              <TableCell>{p.method}</TableCell>
              <TableCell>{formatDate(p.date)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}