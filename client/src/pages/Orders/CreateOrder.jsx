import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { orderService } from '../../services/orderService';
import { customerService } from '../../services/customerService';
import { measurementService } from '../../services/measurementService';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { PRIORITIES } from '../../utils/constants';
import toast from 'react-hot-toast';

export default function CreateOrder() {
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: { fabricProvided: false, priority: 'medium' }
  });
  const [customers, setCustomers] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const selectedCustomer = watch('customer');

  useEffect(() => {
    customerService.getAll({ limit: 100 }).then(res => setCustomers(res.customers));
  }, []);

  useEffect(() => {
    if (selectedCustomer) {
      measurementService.getByCustomer(selectedCustomer).then(res => setMeasurements(res.measurements));
    }
  }, [selectedCustomer]);

  const onSubmit = async (data) => {
    try {
      await orderService.create(data);
      toast.success('Order created');
      navigate('/orders');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">New Order</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Select onValueChange={(val) => setValue('customer', val)}>
          <SelectTrigger><SelectValue placeholder="Select customer" /></SelectTrigger>
          <SelectContent>
            {customers.map(c => <SelectItem key={c._id} value={c._id}>{c.name} ({c.mobile})</SelectItem>)}
          </SelectContent>
        </Select>

        <Input placeholder="Garment type" {...register('garmentType', { required: true })} />
        <Input type="number" placeholder="Quantity" {...register('quantity')} />

        <Select onValueChange={(val) => setValue('measurements', val)}>
          <SelectTrigger><SelectValue placeholder="Select measurements (optional)" /></SelectTrigger>
          <SelectContent>
            {measurements.map(m => <SelectItem key={m._id} value={m._id}>{new Date(m.date).toLocaleDateString()}</SelectItem>)}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <input type="checkbox" {...register('fabricProvided')} id="fabric" />
          <label htmlFor="fabric">Fabric Provided</label>
        </div>

        <Input placeholder="Fabric color" {...register('fabricColor')} />
        <Input placeholder="Stitch type" {...register('stitchType')} />
        <Input type="date" label="Delivery date" {...register('deliveryDate')} />
        <Input type="date" label="Trial date" {...register('trialDate')} />

        <Select onValueChange={(val) => setValue('priority', val)} defaultValue="medium">
          <SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
          <SelectContent>
            {PRIORITIES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>

        <Textarea placeholder="Notes" {...register('notes')} />
        <Button type="submit">Create Order</Button>
      </form>
    </div>
  );
}