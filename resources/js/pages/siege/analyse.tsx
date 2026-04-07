import { Head, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { dashboard } from '@/routes';
import { Badge } from '@/components/ui/badge';
import { Award, AlertTriangle, Target, PieChart, ArrowDownRight, Calendar, Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageProps {
    evolutionKpis: { periode: string; score_moyen: number; roe_moyen: number; nombre_succursales: number }[];
    scoresDistribution: { excellent: number; bon: number; a_surveiller: number; critique: number };
    top5: { nom: string; score: number }[];
    flop5: { nom: string; score: number }[];
    moisActuel: string;
}

export default function AnalyseKPIs() {
    const { evolutionKpis, scoresDistribution, top5, flop5, moisActuel } = usePage<PageProps>().props;
    const total = scoresDistribution.excellent + scoresDistribution.bon + scoresDistribution.a_surveiller + scoresDistribution.critique || 1;

    return (
        <div className="p-6 flex flex-col gap-6">
            <Head title="Analyse Stratégique — Siège Central" />
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Analyse Stratégique des KPIs</h1>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                        Données consolidées au réseau — {moisActuel}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2"><Calendar className="size-4" /> {moisActuel}</Button>
                    <Button variant="outline" size="sm" className="gap-2"><Filter className="size-4" /> Filtres</Button>
                    <Button size="sm" className="gap-2 bg-primary"><Download className="size-4" /> Exporter PDF</Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card className="shadow-none border-emerald-200 bg-emerald-50/50"><CardContent className="p-4 flex items-center gap-2"><div className="size-8 rounded-lg bg-emerald-500/20 flex items-center justify-center"><Target className="size-4 text-emerald-600" /></div><div><p className="text-2xl font-bold text-emerald-700">{scoresDistribution.excellent}</p><p className="text-xs text-emerald-600">Excellent (≥85%)</p></div></CardContent></Card>
                <Card className="shadow-none border-blue-200 bg-blue-50/50"><CardContent className="p-4 flex items-center gap-2"><div className="size-8 rounded-lg bg-blue-500/20 flex items-center justify-center"><PieChart className="size-4 text-blue-600" /></div><div><p className="text-2xl font-bold text-blue-700">{scoresDistribution.bon}</p><p className="text-xs text-blue-600">Bon (70-84%)</p></div></CardContent></Card>
                <Card className="shadow-none border-amber-200 bg-amber-50/50"><CardContent className="p-4 flex items-center gap-2"><div className="size-8 rounded-lg bg-amber-500/20 flex items-center justify-center"><AlertTriangle className="size-4 text-amber-600" /></div><div><p className="text-2xl font-bold text-amber-700">{scoresDistribution.a_surveiller}</p><p className="text-xs text-amber-600">À surveiller (50-69%)</p></div></CardContent></Card>
                <Card className="shadow-none border-red-200 bg-red-50/50"><CardContent className="p-4 flex items-center gap-2"><div className="size-8 rounded-lg bg-red-500/20 flex items-center justify-center"><ArrowDownRight className="size-4 text-red-600" /></div><div><p className="text-2xl font-bold text-red-700">{scoresDistribution.critique}</p><p className="text-xs text-red-600">Critique (&lt;50%)</p></div></CardContent></Card>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2 shadow-none border-muted overflow-hidden">
                    <CardHeader className="pb-6 border-b bg-muted/10">
                        <div className="flex items-start justify-between">
                            <div><CardTitle className="text-base font-bold">Évolution du Score Moyen</CardTitle><CardDescription>Consolidation mensuelle glissante (6 mois).</CardDescription></div>
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-none">{evolutionKpis[evolutionKpis.length - 1]?.score_moyen.toFixed(1)}%</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-3">
                            {evolutionKpis.map((item, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="w-24 text-sm text-muted-foreground">{item.periode}</div>
                                    <div className="flex-1"><div className="h-2 bg-muted rounded-full overflow-hidden"><div className={`h-full rounded-full ${item.score_moyen >= 85 ? 'bg-emerald-500' : item.score_moyen >= 70 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${Math.min(item.score_moyen, 100)}%` }} /></div></div>
                                    <div className="w-16 text-right text-sm font-bold">{item.score_moyen.toFixed(1)}%</div>
                                    <div className="w-20 text-right text-xs text-muted-foreground">{item.nombre_succursales} succ.</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-none border-muted">
                    <CardHeader><CardTitle className="text-base flex items-center gap-2"><Award className="size-4" /> Classement</CardTitle><CardDescription>Top 5 et à surveiller.</CardDescription></CardHeader>
                    <CardContent className="space-y-6 pt-2">
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-emerald-600 uppercase">Top Performances</p>
                            {top5.slice(0, 3).map((item, i) => (<div key={i} className="flex items-center gap-3"><div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-xs font-bold text-emerald-600">{i + 1}</div><div className="flex-1 text-sm">{item.nom}</div><div className="text-sm font-bold text-emerald-600">{item.score.toFixed(1)}%</div></div>))}
                        </div>
                        <div className="border-t pt-4 space-y-2">
                            <p className="text-xs font-semibold text-red-600 uppercase">À surveiller</p>
                            {flop5.slice(0, 3).map((item, i) => (<div key={i} className="flex items-center gap-3"><div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center text-xs font-bold text-red-600">{i + 1}</div><div className="flex-1 text-sm">{item.nom}</div><div className="text-sm font-bold text-red-600">{item.score.toFixed(1)}%</div></div>))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-none border-muted">
                <CardHeader className="pb-2"><CardTitle className="text-base">Répartition des scores — {moisActuel}</CardTitle></CardHeader>
                <CardContent>
                    <div className="h-8 rounded-lg overflow-hidden flex">
                        {scoresDistribution.excellent > 0 && (<div className="h-full bg-emerald-500 flex items-center justify-center text-xs text-white font-medium" style={{ width: `${(scoresDistribution.excellent / total) * 100}%` }}>{scoresDistribution.excellent}</div>)}
                        {scoresDistribution.bon > 0 && (<div className="h-full bg-blue-500 flex items-center justify-center text-xs text-white font-medium" style={{ width: `${(scoresDistribution.bon / total) * 100}%` }}>{scoresDistribution.bon}</div>)}
                        {scoresDistribution.a_surveiller > 0 && (<div className="h-full bg-amber-500 flex items-center justify-center text-xs text-white font-medium" style={{ width: `${(scoresDistribution.a_surveiller / total) * 100}%` }}>{scoresDistribution.a_surveiller}</div>)}
                        {scoresDistribution.critique > 0 && (<div className="h-full bg-red-500 flex items-center justify-center text-xs text-white font-medium" style={{ width: `${(scoresDistribution.critique / total) * 100}%` }}>{scoresDistribution.critique}</div>)}
                    </div>
                    <div className="flex gap-4 mt-4 text-xs">
                        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-emerald-500" /><span>Excellent</span></div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-blue-500" /><span>Bon</span></div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-amber-500" /><span>À surveiller</span></div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-red-500" /><span>Critique</span></div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

AnalyseKPIs.layout = {
    breadcrumbs: [{ title: 'Tableau de bord', href: dashboard() }, { title: 'Analyse Stratégique', href: '/siege/analyse' }],
};
