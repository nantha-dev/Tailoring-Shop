import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import { authService } from '../services/authService';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const update = async () => {
    try {
      const res = await authService.updateProfile({ name, email });
      setUser(res.user);
      toast.success('Profile updated');
    } catch (err) { toast.error(err.message); }
  };

  return (
    <div className="max-w-md">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <Card>
        <CardHeader><CardTitle>Personal Info</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
          <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
          <Button onClick={update}>Update</Button>
        </CardContent>
      </Card>
    </div>
  );
}