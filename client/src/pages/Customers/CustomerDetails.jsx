import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { customerService } from '../../services/customerService';
import { measurementService } from '../../services/measurementService';
import { orderService } from '../../services/orderService';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { formatDate } from '../../utils/formatDate';
import MeasurementForm from '../Measurements/MeasurementForm'; // we'll create this next
import { Plus } from 'lucide-react';

export default function CustomerDetails() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [measurements, setMeasurements] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const cust = await customerService.getById(id);
      setCustomer(cust.customer);
      const meas = await measurementService.getByCustomer(id);
      setMeasurements(meas.measurements);
      const ords = await orderService.getHistory({ customerId: id });
      setOrders(ords.orders);
    };
    fetch();
  }, [id]);

  const handleMeasurementAdded = () => {
    measurementService.getByCustomer(id).then(res => setMeasurements(res.measurements));
  };

  if (!customer) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{customer.name}</h1>
        <Button variant="outline" asChild><Link to="/customers">Back</Link></Button>
      </div>
      <Card>
        <CardHeader><CardTitle>Details</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div><span className="font-semibold">Mobile:</span> {customer.mobile}</div>
          <div><span className="font-semibold">Email:</span> {customer.email || '-'}</div>
          <div><span className="font-semibold">City:</span> {customer.city || '-'}</div>
          <div><span className="font-semibold">Address:</span> {customer.address || '-'}</div>
        </CardContent>
      </Card>

      <Tabs defaultValue="measurements">
        <TabsList>
          <TabsTrigger value="measurements">Measurements</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="measurements">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Measurement History</h2>
            <Dialog>
              <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Add Measurement</DialogTitle></DialogHeader>
                <MeasurementForm customerId={id} onSuccess={handleMeasurementAdded} />
              </DialogContent>
            </Dialog>
          </div>
          <Table>
            <TableHeader>
              <TableRow><TableHead>Date</TableHead><TableHead>Chest</TableHead><TableHead>Waist</TableHead><TableHead>Actions</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {measurements.map(m => (
                <TableRow key={m._id}>
                  <TableCell>{formatDate(m.date)}</TableCell>
                  <TableCell>{m.measurements?.chest || '-'}</TableCell>
                  <TableCell>{m.measurements?.waist || '-'}</TableCell>
                  <TableCell><Link to={`/measurements/${m._id}`} className="text-primary">View</Link></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="orders">
          <Table>
            <TableHeader>
              <TableRow><TableHead>Order No</TableHead><TableHead>Garment</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {orders.map(o => (
                <TableRow key={o._id}>
                  <TableCell><Link to={`/orders/${o._id}`}>{o.orderNumber}</Link></TableCell>
                  <TableCell>{o.garmentType}</TableCell>
                  <TableCell>{formatDate(o.orderDate)}</TableCell>
                  <TableCell>{o.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
}