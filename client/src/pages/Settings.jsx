import { useEffect, useState } from 'react';
import { settingsService } from '../services/settingsService';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import toast from 'react-hot-toast';

export default function Settings() {
  const [settings, setSettings] = useState({ shopName: '', address: '', phone: '', email: '', gstin: '' });

  useEffect(() => {
    settingsService.get().then(res => setSettings(res.settings));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await settingsService.update(settings);
      toast.success('Settings saved');
    } catch (err) { toast.error(err.message); }
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-bold mb-6">Shop Settings</h1>
      <Card>
        <CardHeader><CardTitle>General</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input placeholder="Shop Name" value={settings.shopName} onChange={e => setSettings({ ...settings, shopName: e.target.value })} />
            <Input placeholder="Address" value={settings.address} onChange={e => setSettings({ ...settings, address: e.target.value })} />
            <Input placeholder="Phone" value={settings.phone} onChange={e => setSettings({ ...settings, phone: e.target.value })} />
            <Input placeholder="Email" value={settings.email} onChange={e => setSettings({ ...settings, email: e.target.value })} />
            <Input placeholder="GSTIN" value={settings.gstin} onChange={e => setSettings({ ...settings, gstin: e.target.value })} />
            <Button type="submit">Save</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}