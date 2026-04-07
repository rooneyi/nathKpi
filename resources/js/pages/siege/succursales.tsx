import { Head, usePage, Link } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { dashboard } from '@/routes';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Search,
    MoreHorizontal,
    TrendingUp,
    ArrowUpRight,
    MapPin,
    CalendarCheck,
    ExternalLink,
    Building2,
    Phone,
    Mail,
    AlertCircle,
    CheckCircle2,
    Clock,
    BarChart3,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface Succursale {
    id: number;
    nom: string;
    code: string;
    ville: string;
    adresse: string;
    telephone: string;
    email: string;
    score: number;
    alertes: string[];
    statut: string;
    derniere_saisie: string | null;
    total_donnees: number;
}

interface PageProps {
    succursales: Succursale[];
    moisActuel: string;
}

export default function Succursales() {
    const { succursales, moisActuel } = usePage<PageProps>().props;
    const { auth } = usePage<any>().props;
    const isAdmin = auth?.user?.role === 'admin';
    const [searchTerm, setSearchTerm] = useState('');

    const filteredSuccursales = succursales.filter(s =>
        s.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.ville.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (statut: string) => {
        switch (statut) {
            case 'Conforme': return 'bg-emerald-500';
            case 'En attente': return 'bg-amber-500';
            case 'Non conforme': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const getStatusBadge = (statut: string) => {
        switch (statut) {
            case 'Conforme':
                return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20"><CheckCircle2 className="size-3 mr-1" />{statut}</Badge>;
            case 'En attente':
                return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20"><Clock className="size-3 mr-1" />{statut}</Badge>;
            case 'Non conforme':
                return <Badge className="bg-red-500/10 text-red-600 border-red-500/20"><AlertCircle className="size-3 mr-1" />{statut}</Badge>;
            default:
                return <Badge variant="outline">{statut}</Badge>;
        }
    };

    const bestSuccursale = [...succursales].sort((a, b) => b.score - a.score)[0];
    const scoreMoyen = succursales.length > 0 ? (succursales.reduce((acc, s) => acc + s.score, 0) / succursales.length) : 0;
    const succursalesAvecAlertes = succursales.filter(s => s.alertes.length > 0).length;

    return (
        <div className="p-6 flex flex-col gap-6">
            <Head title="Supervision Réseau — KPIbank" />

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-1 text-foreground">
                    <h1 className="text-2xl font-bold tracking-tight">Supervision du Réseau des Succursales</h1>
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                        <MapPin className="size-3.5" /> {succursales.length} Succursales connectées
                        <span className="mx-2 text-muted-foreground/30">|</span>
                        <CalendarCheck className="size-3.5" /> {moisActuel}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            className="pl-9 w-[250px] shadow-none"
                            placeholder="Rechercher une succursale..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <Card className="shadow-none border-muted">
                <CardHeader className="pb-2 border-b bg-muted/5">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Classement Performance — {moisActuel}</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/30">
                                <th className="px-6 py-4 text-left font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">Succursale</th>
                                <th className="px-4 py-4 text-left font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">Score</th>
                                <th className="px-4 py-4 text-left font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">Ville</th>
                                <th className="px-4 py-4 text-left font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">Contact</th>
                                <th className="px-4 py-4 text-left font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">Statut</th>
                                <th className="px-6 py-4 text-right font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-muted/50">
                            {filteredSuccursales.map((succursale) => (
                                <tr key={succursale.id} className="hover:bg-muted/10 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`size-2 rounded-full ${getStatusColor(succursale.statut)} animate-pulse`} />
                                            <div>
                                                <p className="font-bold text-foreground">{succursale.nom}</p>
                                                <p className="text-xs text-muted-foreground">{succursale.code}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${succursale.score >= 85 ? 'bg-emerald-500' : succursale.score >= 70 ? 'bg-amber-500' : 'bg-red-500'}`}
                                                    style={{ width: `${Math.min(succursale.score, 100)}%` }}
                                                />
                                            </div>
                                            <span className="text-[10px] font-bold">{succursale.score.toFixed(0)}%</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-muted-foreground">{succursale.ville}</td>
                                    <td className="px-4 py-4">
                                        <div className="flex flex-col text-xs text-muted-foreground">
                                            <span>{succursale.telephone}</span>
                                            <span>{succursale.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">{getStatusBadge(succursale.statut)}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {isAdmin && (
                                                <Button asChild variant="outline" size="sm">
                                                    <Link href={route('admin.utilisateurs', { succursale_id: succursale.id })}>
                                                        Créer compte
                                                    </Link>
                                                </Button>
                                            )}
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="size-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-emerald-500/5 border-emerald-500/20 shadow-none p-4 flex items-center gap-4">
                    <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                        <TrendingUp className="size-5" />
                    </div>
                    <div>
                        <p className="text-xs text-emerald-700 font-bold uppercase tracking-wider">Meilleure Performance</p>
                        <p className="text-sm font-semibold">
                            {bestSuccursale?.nom || '-'} ({bestSuccursale?.score.toFixed(0) || 0}%)
                        </p>
                    </div>
                </Card>
                <Card className="bg-amber-500/5 border-amber-500/20 shadow-none p-4 flex items-center gap-4">
                    <div className="size-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                        <AlertCircle className="size-5" />
                    </div>
                    <div>
                        <p className="text-xs text-amber-700 font-bold uppercase tracking-wider">Alertes</p>
                        <p className="text-sm font-semibold">{succursalesAvecAlertes} succursale(s) avec alertes</p>
                    </div>
                </Card>
                <Card className="bg-blue-500/5 border-blue-500/20 shadow-none p-4 flex items-center gap-4">
                    <div className="size-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                        <BarChart3 className="size-5" />
                    </div>
                    <div>
                        <p className="text-xs text-blue-700 font-bold uppercase tracking-wider">Score Moyen</p>
                        <p className="text-sm font-semibold">{scoreMoyen.toFixed(1)}%</p>
                    </div>
                </Card>
            </div>
        </div>
    );
}

Succursales.layout = {
    breadcrumbs: [
        { title: 'Tableau de bord', href: dashboard() },
        { title: 'Supervision Réseau', href: '/siege/succursales' },
    ],
};
