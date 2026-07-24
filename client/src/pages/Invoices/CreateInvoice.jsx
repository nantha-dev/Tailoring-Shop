import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { invoiceService } from '../../services/invoiceService';
import { orderService } from '../../services/orderService';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreateInvoice() {
  const navigate = useNavigate();
  const { register, handleSubmit, control, setValue, getValues, watch, formState: { errors } } = useForm({
    defaultValues: {
      order: '',
      customer: '',
      items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
      discount: 0,
      tax: 0,
      grandTotal: 0,
    },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Fetch ready/delivered orders
  useEffect(() => {
    orderService.getAll({ limit: 100 })
      .then(res => {
        const readyOrDelivered = res.orders.filter(
          o => o.status === 'ready' || o.status === 'delivered'
        );
        setOrders(readyOrDelivered);
        setLoadingOrders(false);
      })
      .catch(err => toast.error('Failed to load orders'));
  }, []);

  // When order is selected, auto-set customer
  const selectedOrderId = watch('order');
  useEffect(() => {
    if (selectedOrderId) {
      const order = orders.find(o => o._id === selectedOrderId);
      if (order) {
        setSelectedOrder(order);
        setValue('customer', order.customer?._id || '');
      }
    } else {
      setSelectedOrder(null);
      setValue('customer', '');
    }
  }, [selectedOrderId, orders, setValue]);

  // Calculate item amount when quantity or rate changes
  const handleItemChange = useCallback(
    (index, fieldName) => (e) => {
      // First, update the form field with react-hook-form's onChange
      const { onChange } = register(`items.${index}.${fieldName}`);
      onChange(e);

      // Now read the updated values and compute amount
      const qty = Number(getValues(`items.${index}.quantity`) || 0);
      const rate = Number(getValues(`items.${index}.rate`) || 0);
      setValue(`items.${index}.amount`, qty * rate);
    },
    [register, getValues, setValue]
  );

  // Compute subtotal, discount, tax, grand total
  const items = watch('items');
  const discount = Number(watch('discount') || 0);
  const tax = Number(watch('tax') || 0);
  const subtotal = items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const grandTotal = subtotal - discount + tax;

  // Keep the grandTotal field in sync
  useEffect(() => {
    setValue('grandTotal', grandTotal);
  }, [grandTotal, setValue]);

  // Form submission
  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        items: data.items.map(item => ({
          ...item,
          quantity: Number(item.quantity),
          rate: Number(item.rate),
          amount: Number(item.amount),
        })),
        discount: Number(data.discount),
        tax: Number(data.tax),
        grandTotal: Number(data.grandTotal),
      };
      await invoiceService.create(payload);
      toast.success('Invoice created!');
      navigate('/invoices');
    } catch (err) {
      toast.error(err.message || 'Failed to create invoice');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Create Invoice</h1>
        <Button variant="outline" onClick={() => navigate('/invoices')}>← Back to Invoices</Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Order Selection */}
        <Card>
          <CardHeader><CardTitle>Order</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Select onValueChange={(val) => setValue('order', val)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select an order" />
              </SelectTrigger>
              <SelectContent>
                {loadingOrders ? (
                  <SelectItem value="loading" disabled>Loading...</SelectItem>
                ) : orders.length === 0 ? (
                  <SelectItem value="none" disabled>No orders available</SelectItem>
                ) : (
                  orders.map(order => (
                    <SelectItem key={order._id} value={order._id}>
                      {order.orderNumber} - {order.customer?.name} ({order.garmentType})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {selectedOrder && (
              <div className="text-sm text-muted-foreground">
                Customer: {selectedOrder.customer?.name} | Garment: {selectedOrder.garmentType} | Date: {new Date(selectedOrder.orderDate).toLocaleDateString()}
              </div>
            )}
            <input type="hidden" {...register('customer')} />
          </CardContent>
        </Card>

        {/* Items */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Items</CardTitle>
            <Button type="button" size="sm" variant="outline" onClick={() => append({ description: '', quantity: 1, rate: 0, amount: 0 })}>
              <Plus className="h-4 w-4 mr-1" /> Add Item
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-12 gap-2 items-end border-b pb-2">
                <div className="col-span-4">
                  <label className="text-xs">Description</label>
                  <Input {...register(`items.${index}.description`, { required: true })} placeholder="Item name" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs">Qty</label>
                  <Input
                    type="number"
                    {...register(`items.${index}.quantity`, { valueAsNumber: true, min: 1 })}
                    onChange={handleItemChange(index, 'quantity')}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs">Rate</label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register(`items.${index}.rate`, { valueAsNumber: true })}
                    onChange={handleItemChange(index, 'rate')}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs">Amount</label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register(`items.${index}.amount`, { valueAsNumber: true })}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <div className="col-span-1 flex items-end pb-2">
                  {fields.length > 1 && (
                    <Button variant="ghost" size="icon" type="button" onClick={() => remove(index)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Totals */}
        <Card>
          <CardHeader><CardTitle>Total</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm">Discount (₹)</label>
                <Input type="number" step="0.01" {...register('discount', { valueAsNumber: true })} />
              </div>
              <div>
                <label className="text-sm">Tax (₹)</label>
                <Input type="number" step="0.01" {...register('tax', { valueAsNumber: true })} />
              </div>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Grand Total</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>
            <input type="hidden" {...register('grandTotal')} />
          </CardContent>
        </Card>

        <Button type="submit" className="w-full">Create Invoice</Button>
      </form>
    </div>
  );
}