'use client';

import { useState } from 'react';
import { 
  Users, 
  CreditCard, 
  Ticket, 
  Megaphone, 
  Trash2, 
  UserPlus, 
  Shield, 
  ShieldOff,
  Plus,
  RefreshCw,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  deleteUser, 
  updateUserTier, 
  toggleAdminStatus, 
  toggleAdStatus, 
  createAd, 
  generateBulkRedeemCodes 
} from '@/app/actions/admin';
import { Tier } from '@/lib/utils';
import { useLanguage } from '@/lib/contexts';

interface AdminContentProps {
  initialStats: any;
  initialUsers: any[];
  initialTransactions: any[];
  initialAds: any[];
  initialCodes: any[];
}

export default function AdminContent({
  initialStats,
  initialUsers,
  initialTransactions,
  initialAds,
  initialCodes
}: AdminContentProps) {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState(initialUsers);
  const [transactions] = useState(initialTransactions);
  const [ads, setAds] = useState(initialAds);
  const [codes, setCodes] = useState(initialCodes);
  const [stats, setStats] = useState(initialStats);
  const { t } = useLanguage();

  const [search, setSearch] = useState('');

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteUser = async (id: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      const res = await deleteUser(id);
      if (res.success) {
        setUsers(users.filter(u => u.id !== id));
      } else {
        alert(res.error);
      }
    }
  };

  const handleToggleAdmin = async (id: number) => {
    const res = await toggleAdminStatus(id);
    if (res.success) {
      setUsers(users.map(u => u.id === id ? { ...u, is_admin: !u.is_admin } : u));
    } else {
      alert(res.error);
    }
  };

  const handleUpdateTier = async (id: number, tier: Tier) => {
    const res = await updateUserTier(id, tier);
    if (res.success) {
      setUsers(users.map(u => u.id === id ? { ...u, subscription_tier: tier } : u));
    }
  };

  const handleToggleAd = async (id: number) => {
    const res = await toggleAdStatus(id);
    if (res.success) {
      setAds(ads.map(ad => ad.id === id ? { ...ad, active: !ad.active } : ad));
    }
  };

  const [bulkCount, setBulkCount] = useState(5);
  const [bulkType, setBulkType] = useState('tier');
  const [bulkData, setBulkData] = useState('premium');

  const handleGenerateCodes = async () => {
    const res = await generateBulkRedeemCodes(bulkType, bulkData, bulkCount);
    if (res.success) {
      alert(`Generated ${res.codes?.length} codes!`);
      // In a real app we'd refresh the list, but for now we'll just alert
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-4xl font-black tracking-tight">Admin Dashboard</h1>
        <div className="flex gap-2 bg-muted p-1 rounded-xl">
          <Button 
            variant={activeTab === 'users' ? 'default' : 'ghost'} 
            onClick={() => setActiveTab('users')}
            className="rounded-lg h-9"
          >
            <Users className="h-4 w-4 mr-2" /> Users
          </Button>
          <Button 
            variant={activeTab === 'transactions' ? 'default' : 'ghost'} 
            onClick={() => setActiveTab('transactions')}
            className="rounded-lg h-9"
          >
            <CreditCard className="h-4 w-4 mr-2" /> Trans
          </Button>
          <Button 
            variant={activeTab === 'ads' ? 'default' : 'ghost'} 
            onClick={() => setActiveTab('ads')}
            className="rounded-lg h-9"
          >
            <Megaphone className="h-4 w-4 mr-2" /> Ads
          </Button>
          <Button 
            variant={activeTab === 'codes' ? 'default' : 'ghost'} 
            onClick={() => setActiveTab('codes')}
            className="rounded-lg h-9"
          >
            <Ticket className="h-4 w-4 mr-2" /> Codes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-3xl border-none shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{stats.users}</div>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-none shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">₱{Number(stats.revenue).toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-none shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Active Ads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{stats.ads}</div>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-none shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Unused Codes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{stats.unusedCodes}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-3xl border-none shadow-2xl overflow-hidden">
        <CardContent className="p-0">
          {activeTab === 'users' && (
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                 <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search users..." 
                      className="pl-10 rounded-xl" 
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                 </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b text-sm text-muted-foreground">
                      <th className="pb-4 font-bold">User</th>
                      <th className="pb-4 font-bold">Tier</th>
                      <th className="pb-4 font-bold">Role</th>
                      <th className="pb-4 font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="text-sm">
                        <td className="py-4">
                          <div className="font-bold">{user.email}</div>
                          <div className="text-xs text-muted-foreground">ID: {user.id}</div>
                        </td>
                        <td className="py-4">
                          <select 
                            className="bg-muted rounded-lg px-2 py-1 text-xs font-bold uppercase"
                            value={user.subscription_tier}
                            onChange={(e) => handleUpdateTier(user.id, e.target.value as Tier)}
                          >
                            <option value="none">None</option>
                            <option value="starter">Starter</option>
                            <option value="plus">Plus</option>
                            <option value="premium">Premium</option>
                          </select>
                        </td>
                        <td className="py-4">
                          {user.is_admin ? (
                            <span className="bg-primary/20 text-primary text-[10px] font-black px-2 py-1 rounded-md uppercase">Admin</span>
                          ) : (
                            <span className="bg-muted text-muted-foreground text-[10px] font-black px-2 py-1 rounded-md uppercase">User</span>
                          )}
                        </td>
                        <td className="py-4">
                          <div className="flex gap-2">
                            <Button size="icon" variant="outline" className="h-8 w-8 rounded-lg" onClick={() => handleToggleAdmin(user.id)}>
                              {user.is_admin ? <ShieldOff className="h-3 w-3" /> : <Shield className="h-3 w-3" />}
                            </Button>
                            <Button size="icon" variant="destructive" className="h-8 w-8 rounded-lg" onClick={() => handleDeleteUser(user.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="p-6 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b text-sm text-muted-foreground">
                    <th className="pb-4 font-bold">User</th>
                    <th className="pb-4 font-bold">Type</th>
                    <th className="pb-4 font-bold">Description</th>
                    <th className="pb-4 font-bold">Amount</th>
                    <th className="pb-4 font-bold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {transactions.map((t) => (
                    <tr key={t.id} className="text-sm">
                      <td className="py-4 font-bold">{t.user_email}</td>
                      <td className="py-4 uppercase text-[10px] font-black tracking-wider">{t.type}</td>
                      <td className="py-4 text-muted-foreground">{t.description}</td>
                      <td className="py-4 font-black">₱{t.amount}</td>
                      <td className="py-4 text-xs">{new Date(t.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'ads' && (
            <div className="p-6">
              <div className="bg-muted/30 p-6 rounded-3xl mb-8 border border-dashed border-primary/30">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" /> Create New Ad
                </h2>
                <form action={async (formData) => {
                  const res = await createAd(formData);
                  if (res.success) {
                    alert('Ad created successfully!');
                    window.location.reload();
                  } else {
                    alert(res.error);
                  }
                }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Title</label>
                    <Input name="title" required placeholder="Summer Sale" className="rounded-xl" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Link URL</label>
                    <Input name="link_url" required placeholder="/settings" className="rounded-xl" />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Description</label>
                    <Input name="description" required placeholder="Get 50% off on all premium plans!" className="rounded-xl" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Image URL</label>
                    <Input name="image_url" required placeholder="https://..." className="rounded-xl" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Video URL (Optional)</label>
                    <Input name="video_url" placeholder="https://..." className="rounded-xl" />
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                    <Button type="submit" className="rounded-xl">Create Ad Campaign</Button>
                  </div>
                </form>
              </div>

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Active Campaigns</h2>
              </div>
              <div className="grid gap-4">
                {ads.map((ad) => (
                  <div key={ad.id} className="flex items-center gap-4 p-4 bg-muted/30 rounded-2xl border">
                    <img src={ad.image_url} className="h-12 w-20 object-cover rounded-lg" alt="" />
                    <div className="flex-1">
                      <div className="font-bold">{ad.title}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{ad.description}</div>
                    </div>
                    <Button 
                      size="sm" 
                      variant={ad.active ? "default" : "outline"}
                      className="rounded-xl"
                      onClick={() => handleToggleAd(ad.id)}
                    >
                      {ad.active ? 'Active' : 'Disabled'}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'codes' && (
            <div className="p-6">
              <div className="bg-muted/30 p-6 rounded-3xl mb-8 border border-dashed border-primary/30">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" /> Generate Bulk Codes
                </h2>
                <div className="flex flex-wrap gap-4 items-end">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Quantity</label>
                    <Input type="number" value={bulkCount} onChange={(e) => setBulkCount(Number(e.target.value))} className="w-24 rounded-xl" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Type</label>
                    <select className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" value={bulkType} onChange={(e) => setBulkType(e.target.value)}>
                      <option value="tier">Subscription Tier</option>
                      <option value="movie">Specific Movie</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Value (Tier Name or Movie ID)</label>
                    <Input value={bulkData} onChange={(e) => setBulkData(e.target.value)} className="w-40 rounded-xl" />
                  </div>
                  <Button onClick={handleGenerateCodes} className="rounded-xl">Generate Codes</Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b text-sm text-muted-foreground">
                      <th className="pb-4 font-bold">Code</th>
                      <th className="pb-4 font-bold">Benefit</th>
                      <th className="pb-4 font-bold">Status</th>
                      <th className="pb-4 font-bold">Used By</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {codes.map((c) => (
                      <tr key={c.id} className="text-sm">
                        <td className="py-4 font-mono font-bold tracking-widest">{c.code}</td>
                        <td className="py-4">
                           <span className="text-[10px] font-black uppercase bg-secondary px-2 py-0.5 rounded-md mr-2">{c.benefit_type}</span>
                           <span className="font-bold">{c.benefit_data}</span>
                        </td>
                        <td className="py-4">
                          {c.is_used ? (
                            <span className="text-red-500 font-bold">USED</span>
                          ) : (
                            <span className="text-green-500 font-bold">AVAILABLE</span>
                          )}
                        </td>
                        <td className="py-4 text-xs text-muted-foreground">
                          {c.used_by_email || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
