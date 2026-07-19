import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { customerService } from '../../services/customerService';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Pagination } from '../../components/ui/pagination';
import { useDebounce } from '../../hooks/useDebounce';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Plus, Search } from 'lucide-react';
import { EmptyState } from '../../components/common/EmptyState';

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const debouncedSearch = useDebounce(search);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await customerService.getAll({ search: debouncedSearch, page, limit: 10 });
      setCustomers(res.customers);
      setTotalPages(res.pagination.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, [debouncedSearch, page]);

  const handleCreated = () => {
    setDialogOpen(false);
    fetchCustomers();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Customers</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" /> Add Customer</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Customer</DialogTitle></DialogHeader>
            <CustomerForm onSuccess={handleCreated} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex items-center gap-2 max-w-sm">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search name, mobile..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      {loading ? <p>Loading...</p> : customers.length === 0 ? <EmptyState message="No customers found" /> : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map(c => (
                <TableRow key={c._id}>
                  <TableCell>{c.customerId}</TableCell>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.mobile}</TableCell>
                  <TableCell>{c.city}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/customers/${c._id}`}>View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}

function CustomerForm({ onSuccess, defaultValues }) {
  const [form, setForm] = useState(defaultValues || { name: '', mobile: '', email: '', city: '', address: '', notes: '' });
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (defaultValues?._id) {
        await customerService.update(defaultValues._id, form);
      } else {
        await customerService.create(form);
      }
      onSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input name="name" placeholder="Name" required value={form.name} onChange={handleChange} />
      <Input name="mobile" placeholder="Mobile" required value={form.mobile} onChange={handleChange} />
      <Input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
      <Input name="city" placeholder="City" value={form.city} onChange={handleChange} />
      <Input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
      <textarea name="notes" placeholder="Notes" className="w-full border rounded p-2" value={form.notes} onChange={handleChange} />
      <Button type="submit">{defaultValues ? 'Update' : 'Create'}</Button>
    </form>
  );
}