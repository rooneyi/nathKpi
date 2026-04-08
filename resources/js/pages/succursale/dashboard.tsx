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
    AlertCircle,
    CheckCircle2,
    Clock,
    FileText,
    History,
    Edit3,
    AlertTriangle,
    Info,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import { saisie, historique } from '@/routes/succursale';

interface Succursale {
    id: number;
    nom: string;
    code: string;
    ville: string;
}

interface MesDonnees {
    resultat_net: number;
    depots: number;
    credits: number;
    liquidites: number;
    ratio_recouvrement: number;
    roe: number;
    kpi: {
        score_performance: number;
        roe: number;
        ratio_credits_depots: number;
        ratio_creances_douteuses: number;
    };
    statut: string;
}

interface HistoriqueItem {
    periode: string;
    resultat_net: number;
    depots: number;
    credits: number;
    score: number;
    statut: string;
}

interface Attention {
    type: 'info' | 'warning' | 'danger';
    message: string;
}

interface PageProps {
    auth: { user: { id: number; name: string; role: string } };
    succursale: Succursale | null;
    mesDonnees: MesDonnees | null;
    historique: HistoriqueItem[];
    attentions?: Attention[];
    moisActuel: string;
}

function ScoreRing({ score }: { score: number }) {
    const radius = 36;
    const circ = 2 * Math.PI * radius;
    const offset = circ - (score / 100) * circ;
    const color = score >= 85 ? '#10b981' : score >= 70 ? '#f59e0b' : '#ef4444';

    return (
        <svg width="80" height="80" className="transform -rotate-90">
            <circle cx="40" cy="40" r={radius} strokeWidth="6" className="stroke-muted fill-none" />
            <circle
                cx="40"
                cy="40"
                r={radius}
                strokeWidth="6"
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

export default function DashboardSuccursale() {
    const { auth, succursale, mesDonnees, historique: historiqueDonnees, attentions: rawAttentions, moisActuel } = usePage<PageProps>().props;
    const attentions = rawAttentions ?? [];
    const userName = auth?.user?.name ?? 'Utilisateur';

    // Normalisation des valeurs numériques pour éviter les erreurs runtime (toFixed sur string/null)
    const resultatNet = Number(mesDonnees?.resultat_net ?? 0) || 0;
    const depots = Number(mesDonnees?.depots ?? 0) || 0;
    const credits = Number(mesDonnees?.credits ?? 0) || 0;
    const ratioRecouvrement = Number(mesDonnees?.ratio_recouvrement ?? 0) || 0;

    const historiqueListe: HistoriqueItem[] = (historiqueDonnees ?? []).map((item) => ({
        ...item,
        resultat_net: Number(item.resultat_net ?? 0) || 0,
        score: Number(item.score ?? 0) || 0,
    }));

    const kpi = mesDonnees?.kpi
        ? {
            score: Number(mesDonnees.kpi.score_performance) || 0,
            roe: Number(mesDonnees.kpi.roe) || 0,
            ratioCreditsDepots: Number(mesDonnees.kpi.ratio_credits_depots) || 0,
            ratioCreancesDouteuses: Number(mesDonnees.kpi.ratio_creances_douteuses) || 0,
        }
        : null;

    const kpiCards = mesDonnees ? [
        {
            title: 'Résultat Net',
            value: (resultatNet / 1000000).toFixed(2) + 'M',
            currency: 'USD',
            icon: DollarSign,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20',
        },
        {
            title: 'Dépôts Collectés',
            value: (depots / 1000000).toFixed(1) + 'M',
            currency: 'USD',
            icon: Users,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20',
        },
        {
            title: 'Crédits Accordés',
            value: (credits / 1000000).toFixed(1) + 'M',
            currency: 'USD',
            icon: BarChart3,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/20',
        },
        {
            title: 'Ratio Recouvrement',
            value: ratioRecouvrement.toFixed(1),
            currency: '%',
            icon: Activity,
            color: 'text-violet-500',
            bg: 'bg-violet-500/10',
            border: 'border-violet-500/20',
        },
    ] : [];

    const getStatutBadge = (statut: string) => {
        switch (statut) {
            case 'valide':
                return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Validé</Badge>;
            case 'soumis':
                return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">Soumis</Badge>;
            case 'brouillon':
                return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">Brouillon</Badge>;
            default:
                return <Badge variant="outline">{statut}</Badge>;
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
                        <p className="text-sm text-muted-foreground">
                            {succursale ? `${succursale.nom} (${succursale.code})` : 'Succursale non assignée'}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="gap-1.5 border-emerald-500/40 bg-emerald-500/10 text-emerald-600">
                            <CheckCircle2 className="size-3" />
                            {moisActuel}
                        </Badge>
                        {mesDonnees && getStatutBadge(mesDonnees.statut)}
                    </div>
                </div>

                {/* Alertes / Attentions */}
                {attentions.length > 0 && (
                    <div className="grid gap-2">
                        {attentions.map((attention, i) => (
                            <div key={i} className={`flex items-center gap-2 p-3 rounded-lg border ${
                                attention.type === 'danger' ? 'bg-red-50 border-red-200 text-red-700' :
                                attention.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                                'bg-blue-50 border-blue-200 text-blue-700'
                            }`}>
                                {attention.type === 'danger' ? <AlertTriangle className="size-4" /> :
                                 attention.type === 'warning' ? <AlertCircle className="size-4" /> :
                                 <Info className="size-4" />}
                                <span className="text-sm font-medium">{attention.message}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Score de performance */}
                {kpi && (
                    <Card className="border-primary/20 shadow-none">
                        <CardContent className="flex items-center gap-6 py-6">
                            <div className="relative">
                                <ScoreRing score={kpi.score} />
                                <div className="absolute inset-0 flex items-center justify-center flex-col">
                                    <span className="text-xl font-bold">{kpi.score.toFixed(0)}</span>
                                    <span className="text-[10px] text-muted-foreground">/100</span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold">Score de Performance</h3>
                                <p className="text-sm text-muted-foreground">
                                    {kpi.score >= 85 ? 'Performance excellente' :
                                     kpi.score >= 70 ? 'Performance acceptable' :
                                     'Performance à améliorer'}
                                </p>
                                <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                                    <span>ROE: {(kpi.roe * 100).toFixed(1)}%</span>
                                    <span>Crédits/Dépôts: {(kpi.ratioCreditsDepots * 100).toFixed(1)}%</span>
                                    <span>Créances douteuses: {(kpi.ratioCreancesDouteuses * 100).toFixed(1)}%</span>
                                </div>
                            </div>
                            <Button asChild variant="outline" className="gap-2">
                                <a href={saisie().url}>
                                    <Edit3 className="size-4" />
                                    Modifier les données
                                </a>
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* KPI Cards */}
                {mesDonnees ? (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {kpiCards.map((kpi) => {
                            const Icon = kpi.icon;
                            return (
                                <Card key={kpi.title} className={`relative overflow-hidden border ${kpi.border} shadow-none`}>
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
                                            <span className="text-2xl font-bold tabular-nums">{kpi.value}</span>
                                            <span className="mb-0.5 text-sm text-muted-foreground">{kpi.currency}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <Card className="border-dashed border-2 border-muted-foreground/25">
                        <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
                            <FileText className="size-12 text-muted-foreground/50" />
                            <div className="text-center">
                                <h3 className="font-semibold text-lg">Aucune donnée pour {moisActuel}</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Vous n'avez pas encore saisi vos données financières pour ce mois.
                                </p>
                            </div>
                            <Button asChild className="gap-2">
                                <a href={saisie().url}>
                                    <Edit3 className="size-4" />
                                    Saisir les données
                                </a>
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Historique */}
                <Card className="shadow-none">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base flex items-center gap-2">
                                <History className="size-4 text-muted-foreground" />
                                Historique des saisies
                            </CardTitle>
                            <Button asChild variant="ghost" size="sm">
                                <a href={historique().url}>Voir tout</a>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {historiqueListe.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">
                                Aucun historique disponible
                            </p>
                        ) : (
                            <div className="rounded-xl border overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-muted/30">
                                            <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase">Période</th>
                                            <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground uppercase">Résultat Net</th>
                                            <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground uppercase">Score</th>
                                            <th className="px-4 py-2.5 text-center text-xs font-medium text-muted-foreground uppercase">Statut</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {historiqueListe.map((item, i) => (
                                            <tr key={i} className="hover:bg-muted/20">
                                                <td className="px-4 py-3 font-medium">{item.periode}</td>
                                                <td className="px-4 py-3 text-right">{(item.resultat_net / 1000000).toFixed(2)}M USD</td>
                                                <td className="px-4 py-3 text-right">
                                                    <span className={item.score >= 85 ? 'text-emerald-600' : item.score >= 70 ? 'text-amber-600' : 'text-red-600'}>
                                                        {item.score.toFixed(0)}%
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center">{getStatutBadge(item.statut)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

DashboardSuccursale.layout = {
    breadcrumbs: [{ title: 'Tableau de bord', href: dashboard() }],
};
