import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { invoiceService } from '../../services/invoiceService';
import { Input } from '../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Pagination } from '../../components/ui/pagination';
import { Badge } from '../../components/ui/badge';
import { Search } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import { formatDate } from '../../utils/formatDate';

export default function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    invoiceService.getAll({ search: debouncedSearch, page, limit: 10 }).then(res => {
      setInvoices(res.invoices);
      setTotalPages(res.pagination.pages);
    });
  }, [debouncedSearch, page]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Invoices</h1>
      <div className="flex items-center gap-2 max-w-sm">
        <Search className="h-4 w-4" /><Input placeholder="Search invoice..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <Table>
        <TableHeader>
          <TableRow><TableHead>Invoice</TableHead><TableHead>Customer</TableHead><TableHead>Total</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead><TableHead>Action</TableHead></TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map(inv => (
            <TableRow key={inv._id}>
              <TableCell>{inv.invoiceNumber}</TableCell>
              <TableCell>{inv.customer?.name}</TableCell>
              <TableCell>₹{inv.grandTotal}</TableCell>
              <TableCell><Badge variant={inv.paymentStatus === 'paid' ? 'default' : 'secondary'}>{inv.paymentStatus}</Badge></TableCell>
              <TableCell>{formatDate(inv.createdAt)}</TableCell>
              <TableCell><Link to={`/invoices/${inv._id}`} className="text-primary">View</Link></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}