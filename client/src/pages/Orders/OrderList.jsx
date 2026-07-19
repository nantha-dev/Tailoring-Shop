import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Pagination } from '../../components/ui/pagination';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useDebounce } from '../../hooks/useDebounce';
import { formatDate } from '../../utils/formatDate';
import { Plus, Search } from 'lucide-react';
import { ORDER_STATUS } from '../../utils/constants';

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const debouncedSearch = useDebounce(search);

  const fetchOrders = async () => {
    const res = await orderService.getAll({ search: debouncedSearch, status, page, limit: 10 });
    setOrders(res.orders);
    setTotalPages(res.pagination.pages);
  };

  useEffect(() => { fetchOrders(); }, [debouncedSearch, status, page]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Orders</h1>
        <Button asChild><Link to="/orders/new"><Plus className="h-4 w-4 mr-2" /> New Order</Link></Button>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-2 max-w-sm flex-1">
          <Search className="h-4 w-4" />
          <Input placeholder="Search order or customer" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            {ORDER_STATUS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order No</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Garment</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map(o => (
            <TableRow key={o._id}>
              <TableCell>{o.orderNumber}</TableCell>
              <TableCell>{o.customer?.name}</TableCell>
              <TableCell>{o.garmentType}</TableCell>
              <TableCell>{formatDate(o.orderDate)}</TableCell>
              <TableCell><Badge>{o.status}</Badge></TableCell>
              <TableCell>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/orders/${o._id}`}>View</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}