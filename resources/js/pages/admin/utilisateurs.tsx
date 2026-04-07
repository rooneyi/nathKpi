import { Head, usePage, useForm } from '@inertiajs/react';
import {
    Users,
    Plus,
    Search,
    Edit3,
    Trash2,
    Shield,
    Building2,
    User,
    CheckCircle2,
    XCircle,
    AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { dashboard } from '@/routes';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    succursale?: { id: number; nom: string };
    active: boolean;
    created_at: string;
}

interface Succursale {
    id: number;
    nom: string;
}

interface PageProps {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        total: number;
    };
    succursales: Succursale[];
}

export default function Utilisateurs() {
    const { users, succursales, preselectedSuccursaleId } = usePage<PageProps & { preselectedSuccursaleId?: number | null }>().props;
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'succursale',
        succursale_id: preselectedSuccursaleId ? preselectedSuccursaleId.toString() : '',
    });

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin':
                return <Badge className="bg-red-500/10 text-red-600 border-red-500/20"><Shield className="size-3 mr-1" />Admin</Badge>;
            case 'siege':
                return <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20"><Building2 className="size-3 mr-1" />Siège</Badge>;
            case 'succursale':
                return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20"><User className="size-3 mr-1" />Succursale</Badge>;
            default:
                return <Badge variant="outline">{role}</Badge>;
        }
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.utilisateurs.store'), {
            onSuccess: () => {
                setIsCreateOpen(false);
                reset();
            },
        });
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setData({
            name: user.name,
            email: user.email,
            password: '',
            role: user.role,
            succursale_id: user.succursale?.id?.toString() || '',
        });
        setIsEditOpen(true);
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedUser) {
            put(route('admin.utilisateurs.update', selectedUser.id), {
                onSuccess: () => {
                    setIsEditOpen(false);
                    setSelectedUser(null);
                    reset();
                },
            });
        }
    };

    const handleDelete = () => {
        if (selectedUser) {
            destroy(route('admin.utilisateurs.destroy', selectedUser.id), {
                onSuccess: () => {
                    setIsDeleteOpen(false);
                    setSelectedUser(null);
                },
            });
        }
    };

    const handleToggle = (user: User) => {
        post(route('admin.utilisateurs.toggle', user.id), {
            preserveScroll: true,
        });
    };

    const filteredUsers = users.data.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Head title="Gestion des utilisateurs — KPIbank" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Gestion des utilisateurs</h1>
                        <p className="text-sm text-muted-foreground">{users.total} utilisateurs dans le système</p>
                    </div>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2">
                                <Plus className="size-4" />
                                Créer un utilisateur
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
                                <DialogDescription>Remplissez les informations ci-dessous.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nom complet</Label>
                                    <Input id="name" value={data.name} onChange={e => setData('name', e.target.value)} required />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" value={data.email} onChange={e => setData('email', e.target.value)} required />
                                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Mot de passe</Label>
                                    <Input id="password" type="password" value={data.password} onChange={e => setData('password', e.target.value)} required />
                                    {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role">Rôle</Label>
                                    <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="succursale">Succursale</SelectItem>
                                            <SelectItem value="siege">Siège Central</SelectItem>
                                            <SelectItem value="admin">Administrateur</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {data.role === 'succursale' && (
                                    <div className="space-y-2">
                                        <Label htmlFor="succursale_id">Succursale</Label>
                                        <Select value={data.succursale_id} onValueChange={(value) => setData('succursale_id', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner une succursale" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {succursales.map(s => (
                                                    <SelectItem key={s.id} value={s.id.toString()}>{s.nom}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.succursale_id && <p className="text-sm text-red-500">{errors.succursale_id}</p>}
                                    </div>
                                )}
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Annuler</Button>
                                    <Button type="submit" disabled={processing}>Créer</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                        placeholder="Rechercher un utilisateur..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Users Table */}
                <Card className="shadow-none">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Utilisateur</TableHead>
                                    <TableHead>Rôle</TableHead>
                                    <TableHead>Succursale</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{user.name}</p>
                                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                                        <TableCell>{user.succursale?.nom || '-'}</TableCell>
                                        <TableCell>
                                            {user.active ? (
                                                <Badge className="bg-emerald-500/10 text-emerald-600">Actif</Badge>
                                            ) : (
                                                <Badge variant="secondary">Inactif</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleToggle(user)}
                                                    title={user.active ? 'Désactiver' : 'Activer'}
                                                >
                                                    {user.active ? <XCircle className="size-4 text-amber-500" /> : <CheckCircle2 className="size-4 text-emerald-500" />}
                                                </Button>
                                                <Button size="sm" variant="ghost" onClick={() => handleEdit(user)}>
                                                    <Edit3 className="size-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => { setSelectedUser(user); setIsDeleteOpen(true); }}
                                                    className="text-red-500 hover:text-red-600"
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Edit Dialog */}
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Modifier l'utilisateur</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Nom complet</Label>
                                <Input value={data.name} onChange={e => setData('name', e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input type="email" value={data.email} onChange={e => setData('email', e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Mot de passe (laisser vide pour ne pas changer)</Label>
                                <Input type="password" value={data.password} onChange={e => setData('password', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Rôle</Label>
                                <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="succursale">Succursale</SelectItem>
                                        <SelectItem value="siege">Siège Central</SelectItem>
                                        <SelectItem value="admin">Administrateur</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {data.role === 'succursale' && (
                                <div className="space-y-2">
                                    <Label>Succursale</Label>
                                    <Select value={data.succursale_id} onValueChange={(value) => setData('succursale_id', value)}>
                                        <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                                        <SelectContent>
                                            {succursales.map(s => (
                                                <SelectItem key={s.id} value={s.id.toString()}>{s.nom}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Annuler</Button>
                                <Button type="submit" disabled={processing}>Enregistrer</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete Dialog */}
                <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Confirmer la suppression</DialogTitle>
                            <DialogDescription>
                                Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{selectedUser?.name}</strong> ?
                                Cette action est irréversible.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Annuler</Button>
                            <Button variant="destructive" onClick={handleDelete} disabled={processing}>
                                Supprimer
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}

Utilisateurs.layout = {
    breadcrumbs: [{ title: 'Tableau de bord', href: dashboard() }, { title: 'Utilisateurs', href: '/admin/utilisateurs' }],
};
