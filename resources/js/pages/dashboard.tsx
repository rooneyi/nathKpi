import { Head } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import {
    TrendingUp,
    TrendingDown,
    Building2,
    BarChart3,
    ArrowUpRight,
    ArrowDownRight,
    Activity,
    DollarSign,
    Users,
    FileBarChart2,
    AlertCircle,
    CheckCircle2,
    Clock,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { dashboard } from '@/routes';
import type { Auth } from '@/types';

// ─── Mock data KPI ────────────────────────────────────────────────────────────
const kpiCards = [
    {
        title: 'Résultat Net',
        value: '4 825 000',
        currency: 'USD',
        change: +12.4,
        icon: DollarSign,
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
    },
    {
        title: 'Dépôts Clients',
        value: '38 200 000',
        currency: 'USD',
        change: +7.1,
        icon: Users,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
    },
    {
        title: 'Crédits Accordés',
        value: '21 950 000',
        currency: 'USD',
        change: -3.2,
        icon: BarChart3,
        color: 'text-amber-500',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
    },
    {
        title: 'Taux de Recouvrement',
        value: '91.4',
        currency: '%',
        change: +2.1,
        icon: Activity,
        color: 'text-violet-500',
        bg: 'bg-violet-500/10',
        border: 'border-violet-500/20',
    },
];

const branchPerformances = [
    { name: 'Kinshasa Centre', score: 97, trend: 'up', reports: 12, status: 'Conforme' },
    { name: 'Gombe Succursale', score: 84, trend: 'up', reports: 9, status: 'Conforme' },
    { name: 'Lubumbashi', score: 71, trend: 'down', reports: 7, status: 'En attente' },
    { name: 'Matadi', score: 65, trend: 'down', reports: 5, status: 'Non conforme' },
    { name: 'Kisangani', score: 88, trend: 'up', reports: 11, status: 'Conforme' },
];

const recentReports = [
    { branch: 'Kinshasa Centre', type: 'Rapport mensuel', date: '30 Mars 2026', status: 'Validé', statusColor: 'bg-emerald-500/10 text-emerald-600' },
    { branch: 'Gombe Succursale', type: 'Rapport trimestriel', date: '29 Mars 2026', status: 'En cours', statusColor: 'bg-amber-500/10 text-amber-600' },
    { branch: 'Lubumbashi', type: 'Rapport mensuel', date: '28 Mars 2026', status: 'Rejeté', statusColor: 'bg-red-500/10 text-red-600' },
    { branch: 'Kisangani', type: 'Rapport annuel', date: '27 Mars 2026', status: 'Validé', statusColor: 'bg-emerald-500/10 text-emerald-600' },
    { branch: 'Matadi', type: 'Rapport mensuel', date: '26 Mars 2026', status: 'En attente', statusColor: 'bg-blue-500/10 text-blue-600' },
];

const monthlyData = [
    { month: 'Oct', depot: 32, credit: 18, resultat: 4.2 },
    { month: 'Nov', depot: 34, credit: 19, resultat: 4.0 },
    { month: 'Dec', depot: 35, credit: 20, resultat: 4.5 },
    { month: 'Jan', depot: 36, credit: 20.5, resultat: 4.3 },
    { month: 'Fév', depot: 37, credit: 21, resultat: 4.6 },
    { month: 'Mar', depot: 38.2, credit: 21.9, resultat: 4.8 },
];

// ─── Composant barre chart inline SVG ─────────────────────────────────────────
function MiniBarChart({ data }: { data: { month: string; depot: number; credit: number }[] }) {
    const maxVal = Math.max(...data.map((d) => d.depot));
    return (
        <div className="flex items-end gap-2 h-24">
            {data.map((d) => (
                <div key={d.month} className="flex flex-col items-center gap-1 flex-1">
                    <div className="flex items-end gap-0.5 w-full h-20">
                        <div
                            className="flex-1 rounded-t-sm bg-blue-500/70 transition-all duration-500"
                            style={{ height: `${(d.depot / maxVal) * 100}%` }}
                        />
                        <div
                            className="flex-1 rounded-t-sm bg-violet-500/70 transition-all duration-500"
                            style={{ height: `${(d.credit / maxVal) * 100}%` }}
                        />
                    </div>
                    <span className="text-[10px] text-muted-foreground">{d.month}</span>
                </div>
            ))}
        </div>
    );
}

// ─── Score ring ────────────────────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
    const radius = 18;
    const circ = 2 * Math.PI * radius;
    const offset = circ - (score / 100) * circ;
    const color = score >= 85 ? '#10b981' : score >= 70 ? '#f59e0b' : '#ef4444';
    return (
        <svg width="48" height="48" className="transform -rotate-90">
            <circle cx="24" cy="24" r={radius} strokeWidth="4" className="stroke-muted fill-none" />
            <circle
                cx="24"
                cy="24"
                r={radius}
                strokeWidth="4"
                fill="none"
                stroke={color}
                strokeDasharray={circ}
                strokeDashoffset={offset}
                strokeLinecap="round"
                className="transition-all duration-700"
            />
        </svg>
    );
}

// ─── Dashboard page ────────────────────────────────────────────────────────────
export default function Dashboard() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const userName = auth?.user?.name ?? 'Utilisateur';
    const now = new Date();
    const dateStr = now.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <>
            <Head title="Tableau de bord — KPIbank" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">

                {/* ── Header ─────────────────────────────────────── */}
                <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Bonjour, {userName.split(' ')[0]} 👋
                        </h1>
                        <p className="text-sm text-muted-foreground capitalize">{dateStr}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="gap-1.5 border-emerald-500/40 bg-emerald-500/10 text-emerald-600">
                            <CheckCircle2 className="size-3" />
                            Système opérationnel
                        </Badge>
                        <Badge variant="outline" className="gap-1.5 border-amber-500/40 bg-amber-500/10 text-amber-600">
                            <Clock className="size-3" />
                            3 rapports en attente
                        </Badge>
                    </div>
                </div>

                {/* ── KPI Cards ──────────────────────────────────── */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {kpiCards.map((kpi) => {
                        const Icon = kpi.icon;
                        const isPositive = kpi.change >= 0;
                        return (
                            <Card
                                key={kpi.title}
                                className={`relative overflow-hidden border ${kpi.border} shadow-none hover:shadow-md transition-shadow duration-300`}
                            >
                                <div className={`absolute inset-0 opacity-30 ${kpi.bg}`} />
                                <CardHeader className="pb-2 relative">
                                    <div className="flex items-center justify-between">
                                        <CardDescription className="text-xs font-medium uppercase tracking-widest">
                                            {kpi.title}
                                        </CardDescription>
                                        <div className={`flex size-8 items-center justify-center rounded-lg ${kpi.bg}`}>
                                            <Icon className={`size-4 ${kpi.color}`} />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="relative">
                                    <div className="flex items-end gap-1">
                                        <span className="text-2xl font-bold tabular-nums">
                                            {kpi.value}
                                        </span>
                                        <span className="mb-0.5 text-sm text-muted-foreground">{kpi.currency}</span>
                                    </div>
                                    <div className={`mt-1 flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                                        {isPositive ? (
                                            <ArrowUpRight className="size-3.5" />
                                        ) : (
                                            <ArrowDownRight className="size-3.5" />
                                        )}
                                        {isPositive ? '+' : ''}{kpi.change}% vs mois précédent
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* ── Main row: Chart + Branches ─────────────────── */}
                <div className="grid gap-4 lg:grid-cols-5">

                    {/* Mini bar chart */}
                    <Card className="lg:col-span-3 shadow-none">
                        <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-base">Évolution mensuelle</CardTitle>
                                    <CardDescription className="text-xs">Dépôts vs Crédits (M USD) — 6 derniers mois</CardDescription>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-blue-500/70 inline-block" />Dépôts</span>
                                    <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-violet-500/70 inline-block" />Crédits</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <MiniBarChart data={monthlyData} />
                            <div className="mt-4 grid grid-cols-3 gap-2">
                                {monthlyData.slice(-3).map((d) => (
                                    <div key={d.month} className="rounded-lg bg-muted/40 px-3 py-2 text-center">
                                        <p className="text-xs text-muted-foreground">{d.month}</p>
                                        <p className="text-sm font-semibold tabular-nums">{d.resultat}M</p>
                                        <p className="text-[10px] text-muted-foreground">Résultat</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Branches performance */}
                    <Card className="lg:col-span-2 shadow-none">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Building2 className="size-4 text-muted-foreground" />
                                Succursales
                            </CardTitle>
                            <CardDescription className="text-xs">Score de performance Q1 2026</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {branchPerformances.map((branch) => (
                                <div key={branch.name} className="flex items-center gap-3 group">
                                    <ScoreRing score={branch.score} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium truncate">{branch.name}</p>
                                            <span className="text-sm font-bold tabular-nums">{branch.score}%</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded-sm font-medium ${branch.status === 'Conforme' ? 'bg-emerald-500/10 text-emerald-600' :
                                                    branch.status === 'En attente' ? 'bg-amber-500/10 text-amber-600' :
                                                        'bg-red-500/10 text-red-600'
                                                }`}>
                                                {branch.status}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground">{branch.reports} rapports</span>
                                            {branch.trend === 'up' ? (
                                                <TrendingUp className="size-3 text-emerald-500" />
                                            ) : (
                                                <TrendingDown className="size-3 text-red-500" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* ── Recent Reports ─────────────────────────────── */}
                <Card className="shadow-none">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <FileBarChart2 className="size-4 text-muted-foreground" />
                                    Rapports récents
                                </CardTitle>
                                <CardDescription className="text-xs">Derniers rapports soumis par les succursales</CardDescription>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <AlertCircle className="size-3 text-amber-500" />
                                <span>3 nécessitent une action</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-xl border overflow-hidden">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/30">
                                        <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Succursale</th>
                                        <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                                        <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                                        <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Statut</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {recentReports.map((report, i) => (
                                        <tr key={i} className="hover:bg-muted/20 transition-colors">
                                            <td className="px-4 py-3 font-medium">{report.branch}</td>
                                            <td className="px-4 py-3 text-muted-foreground">{report.type}</td>
                                            <td className="px-4 py-3 text-muted-foreground">{report.date}</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${report.statusColor}`}>
                                                    {report.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Tableau de bord',
            href: dashboard(),
        },
    ],
};