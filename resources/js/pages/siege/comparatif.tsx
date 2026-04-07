import { Head, usePage } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { dashboard } from '@/routes';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GitCompare, Calendar, Download, TrendingUp, Target, AlertTriangle } from 'lucide-react';
import { router } from '@inertiajs/react';

interface Succursale {
    id: number;
    nom: string;
    code: string;
    score: number;
    roe: number;
    ratio_credits_depots: number;
    ratio_creances_douteuses: number;
    ratio_produit_total: number;
    ratio_fonds_propres: number;
    alertes: string[];
}

interface PageProps {
    succursales: Succursale[];
    moyennes: { score: number; roe: number; ratio_credits_depots: number; ratio_creances_douteuses: number };
    periode: string;
    periodesDisponibles: { value: string; label: string }[];
}

export default function Comparatif() {
    const { succursales, moyennes, periode, periodesDisponibles } = usePage<PageProps>().props;

    const handlePeriodeChange = (value: string) => {
        router.get('/siege/comparatif', { periode: value }, { preserveState: true });
    };

    const getScoreColor = (score: number) => {
        if (score >= 85) return 'text-emerald-600 bg-emerald-50';
        if (score >= 70) return 'text-amber-600 bg-amber-50';
        return 'text-red-600 bg-red-50';
    };

    return (
        <div className="p-6 flex flex-col gap-6">
            <Head title="Analyse Comparative — Siège Central" />

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-1 text-foreground">
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <GitCompare className="size-6 text-primary" />
                        Analyse Comparative Inter-Succursales
                    </h1>
                    <p className="text-sm text-muted-foreground">Comparez la performance relative des agences du réseau.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Select value={periode} onValueChange={handlePeriodeChange}>
                        <SelectTrigger className="w-[180px]">
                            <Calendar className="size-4 mr-2" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {periodesDisponibles.map((p) => (
                                <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button size="sm" className="gap-2"><Download className="size-4" /> Exporter</Button>
                </div>
            </div>

            {/* Moyennes globales */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="shadow-none"><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-2xl font-bold">{moyennes.score?.toFixed(1) || 0}%</p><p className="text-xs text-muted-foreground">Score Moyen</p></div><div className="size-10 rounded-lg bg-blue-100 flex items-center justify-center"><Target className="size-5 text-blue-600" /></div></div></CardContent></Card>
                <Card className="shadow-none"><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-2xl font-bold">{moyennes.roe?.toFixed(1) || 0}%</p><p className="text-xs text-muted-foreground">ROE Moyen</p></div><div className="size-10 rounded-lg bg-emerald-100 flex items-center justify-center"><TrendingUp className="size-5 text-emerald-600" /></div></div></CardContent></Card>
                <Card className="shadow-none"><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-2xl font-bold">{moyennes.ratio_credits_depots?.toFixed(1) || 0}%</p><p className="text-xs text-muted-foreground">Crédits/Dépôts</p></div><div className="size-10 rounded-lg bg-amber-100 flex items-center justify-center"><GitCompare className="size-5 text-amber-600" /></div></div></CardContent></Card>
                <Card className="shadow-none"><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-2xl font-bold">{moyennes.ratio_creances_douteuses?.toFixed(1) || 0}%</p><p className="text-xs text-muted-foreground">Créances Douteuses</p></div><div className="size-10 rounded-lg bg-red-100 flex items-center justify-center"><AlertTriangle className="size-5 text-red-600" /></div></div></CardContent></Card>
            </div>

            {/* Tableau comparatif */}
            <Card className="shadow-none border-muted">
                <CardHeader className="pb-2 border-b bg-muted/5"><CardTitle className="text-base">Tableau Comparatif — {periode}</CardTitle></CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead><tr className="border-b bg-muted/30">
                                <th className="px-4 py-3 text-left font-semibold text-muted-foreground text-[10px] uppercase">Succursale</th>
                                <th className="px-4 py-3 text-center font-semibold text-muted-foreground text-[10px] uppercase">Score</th>
                                <th className="px-4 py-3 text-center font-semibold text-muted-foreground text-[10px] uppercase">ROE</th>
                                <th className="px-4 py-3 text-center font-semibold text-muted-foreground text-[10px] uppercase">Crédits/Dépôts</th>
                                <th className="px-4 py-3 text-center font-semibold text-muted-foreground text-[10px] uppercase">Créances Douteuses</th>
                                <th className="px-4 py-3 text-center font-semibold text-muted-foreground text-[10px] uppercase">Alertes</th>
                            </tr></thead>
                            <tbody className="divide-y divide-muted/50">
                                {succursales.map((s) => (
                                    <tr key={s.id} className="hover:bg-muted/10">
                                        <td className="px-4 py-3"><div><p className="font-medium">{s.nom}</p><p className="text-xs text-muted-foreground">{s.code}</p></div></td>
                                        <td className="px-4 py-3 text-center"><span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold ${getScoreColor(s.score)}`}>{s.score.toFixed(1)}%</span></td>
                                        <td className="px-4 py-3 text-center font-medium">{s.roe.toFixed(1)}%</td>
                                        <td className="px-4 py-3 text-center font-medium">{s.ratio_credits_depots.toFixed(1)}%</td>
                                        <td className="px-4 py-3 text-center font-medium">{s.ratio_creances_douteuses.toFixed(1)}%</td>
                                        <td className="px-4 py-3 text-center">{s.alertes.length > 0 ? <Badge variant="destructive" className="text-[10px]">{s.alertes.length}</Badge> : <span className="text-muted-foreground">-</span>}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

Comparatif.layout = {
    breadcrumbs: [{ title: 'Tableau de bord', href: dashboard() }, { title: 'Analyse Comparative', href: '/siege/comparatif' }],
};
