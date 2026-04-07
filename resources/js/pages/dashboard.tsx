import { Head, usePage } from '@inertiajs/react';
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

interface Succursale {
    id: number;
    nom: string;
    code: string;
    ville: string;
    score: number;
    alertes: string[];
    statut: string;
}

interface Rapport {
    id: number;
    succursale: string;
    type: string;
    periode: string;
    date: string;
    statut: string;
}

interface Alerte {
    type: string;
    succursale: string;
    score: number;
}

interface PageProps {
    auth: {
        user: {
            id: number;
            name: string;
            role: string;
        };
    };
    kpisGlobaux: {
        resultat_net: number;
        depots_clients: number;
        credits_accordes: number;
        taux_recouvrement: number;
    };
    evolution: {
        resultat_net: number;
        depots: number;
        credits: number;
        recouvrement: number;
    };
    succursales: Succursale[];
    rapportsRecents: Rapport[];
    alertes: Alerte[];
    mesDonnees: {
        resultat_net: number;
        depots: number;
        credits: number;
        ratio_recouvrement: number;
        kpi: {
            score_performance: number;
        };
    } | null;
    moisActuel: string;
}

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

export default function Dashboard() {
    const { auth, kpisGlobaux, evolution, succursales, rapportsRecents, alertes, moisActuel } = usePage<PageProps>().props;
    const userName = auth?.user?.name ?? 'Utilisateur';
    const now = new Date();
    const dateStr = now.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // Données pour le graphique (mockées car on n'a pas l'historique mensuel complet)
    const monthlyData = [
        { month: 'Oct', depot: 32, credit: 18, resultat: 4.2 },
        { month: 'Nov', depot: 34, credit: 19, resultat: 4.0 },
        { month: 'Dec', depot: 35, credit: 20, resultat: 4.5 },
        { month: 'Jan', depot: 36, credit: 20.5, resultat: 4.3 },
        { month: 'Fév', depot: 37, credit: 21, resultat: 4.6 },
        { month: 'Mar', depot: kpisGlobaux.depots_clients / 1000000, credit: kpisGlobaux.credits_accordes / 1000000, resultat: kpisGlobaux.resultat_net / 1000000 },
    ];

    const kpiCards = [
        {
            title: 'Résultat Net',
            value: (kpisGlobaux.resultat_net / 1000000).toFixed(2) + 'M',
            currency: 'USD',
            change: evolution.resultat_net,
            icon: DollarSign,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20',
        },
        {
            title: 'Dépôts Clients',
            value: (kpisGlobaux.depots_clients / 1000000).toFixed(1) + 'M',
            currency: 'USD',
            change: evolution.depots,
            icon: Users,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20',
        },
        {
            title: 'Crédits Accordés',
            value: (kpisGlobaux.credits_accordes / 1000000).toFixed(1) + 'M',
            currency: 'USD',
            change: evolution.credits,
            icon: BarChart3,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/20',
        },
        {
            title: 'Taux de Recouvrement',
            value: kpisGlobaux.taux_recouvrement.toFixed(1),
            currency: '%',
            change: evolution.recouvrement,
            icon: Activity,
            color: 'text-violet-500',
            bg: 'bg-violet-500/10',
            border: 'border-violet-500/20',
        },
    ];

    const getAlerteLabel = (type: string) => {
        switch (type) {
            case 'risque_eleve': return 'Risque élevé';
            case 'liquidite_faible': return 'Liquidité faible';
            case 'rentabilite_negative': return 'Rentabilité négative';
            case 'cout_exploitation_eleve': return 'Coût élevé';
            default: return type;
        }
    };

    return (
        <>
            <Head title="Tableau de bord — KPIbank" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">

                {/* Header */}
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
                        {alertes.length > 0 && (
                            <Badge variant="outline" className="gap-1.5 border-red-500/40 bg-red-500/10 text-red-600">
                                <AlertCircle className="size-3" />
                                {alertes.length} alertes
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Alertes */}
                {alertes.length > 0 && (
                    <div className="grid gap-2">
                        {alertes.map((alerte, i) => (
                            <div key={i} className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <AlertCircle className="size-4 text-red-500" />
                                <span className="text-sm text-red-700">
                                    <strong>{alerte.succursale}</strong>: {getAlerteLabel(alerte.type)} (Score: {alerte.score?.toFixed(1)}%)
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {/* KPI Cards */}
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

                {/* Main row: Chart + Branches */}
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
                                        <p className="text-sm font-semibold tabular-nums">{d.resultat.toFixed(1)}M</p>
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
                            <CardDescription className="text-xs">Score de performance {moisActuel}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {succursales.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-8">
                                    Aucune succursale avec données pour ce mois
                                </p>
                            ) : (
                                succursales.map((branch) => (
                                    <div key={branch.id} className="flex items-center gap-3 group">
                                        <ScoreRing score={branch.score} />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium truncate">{branch.nom}</p>
                                                <span className="text-sm font-bold tabular-nums">{branch.score.toFixed(0)}%</span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded-sm font-medium ${
                                                    branch.statut === 'Conforme' ? 'bg-emerald-500/10 text-emerald-600' :
                                                    branch.statut === 'En attente' ? 'bg-amber-500/10 text-amber-600' :
                                                        'bg-red-500/10 text-red-600'
                                                }`}>
                                                    {branch.statut}
                                                </span>
                                                {branch.alertes?.length > 0 && (
                                                    <AlertCircle className="size-3 text-red-500" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Reports */}
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
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-xl border overflow-hidden">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/30">
                                        <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Succursale</th>
                                        <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                                        <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Période</th>
                                        <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Statut</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {rapportsRecents.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                                                Aucun rapport récent
                                            </td>
                                        </tr>
                                    ) : (
                                        rapportsRecents.map((report, i) => (
                                            <tr key={i} className="hover:bg-muted/20 transition-colors">
                                                <td className="px-4 py-3 font-medium">{report.succursale}</td>
                                                <td className="px-4 py-3 text-muted-foreground">{report.type}</td>
                                                <td className="px-4 py-3 text-muted-foreground">{report.periode}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                                                        report.statut === 'valide' ? 'bg-emerald-500/10 text-emerald-600' :
                                                        report.statut === 'soumis' ? 'bg-blue-500/10 text-blue-600' :
                                                        'bg-amber-500/10 text-amber-600'
                                                    }`}>
                                                        {report.statut}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
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