import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { formatDate } from '../../utils/formatDate';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ORDER_STATUS } from '../../utils/constants';
import toast from 'react-hot-toast';

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    orderService.getById(id).then(res => {
      setOrder(res.order);
      setStatus(res.order.status);
    });
  }, [id]);

  const handleStatusUpdate = async () => {
    try {
      await orderService.update(id, { status });
      toast.success('Status updated');
      setOrder(prev => ({ ...prev, status }));
    } catch (err) { toast.error(err.message); }
  };

  if (!order) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={() => navigate('/orders')}>Back</Button>
      <Card>
        <CardHeader><CardTitle>Order #{order.orderNumber}</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div><span className="font-semibold">Customer:</span> {order.customer?.name}</div>
          <div><span className="font-semibold">Garment:</span> {order.garmentType}</div>
          <div><span className="font-semibold">Order Date:</span> {formatDate(order.orderDate)}</div>
          <div><span className="font-semibold">Delivery Date:</span> {formatDate(order.deliveryDate)}</div>
          <div><span className="font-semibold">Status:</span> <Badge>{order.status}</Badge></div>
          <div><span className="font-semibold">Priority:</span> {order.priority}</div>
        </CardContent>
      </Card>

      <Dialog>
        <DialogTrigger asChild><Button>Update Status</Button></DialogTrigger>
        <DialogContent>
          <DialogHeader><DialogTitle>Update Order Status</DialogTitle></DialogHeader>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              {ORDER_STATUS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={handleStatusUpdate}>Save</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}