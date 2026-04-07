import { Head, usePage } from '@inertiajs/react';
import {
    TrendingUp,
    TrendingDown,
    Building2,
    BarChart3,
    Activity,
    DollarSign,
    Users,
    FileBarChart2,
    AlertCircle,
    CheckCircle2,
    Clock,
    Check,
    X,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import { valider as siegeValider, rejeter as siegeRejeter } from '@/routes/siege';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface Succursale {
    id: number;
    nom: string;
    code: string;
    ville: string;
    score: number;
    alertes: string[];
    statut: string;
}

interface RapportEnAttente {
    id: number;
    succursale: string;
    periode: string;
    date: string;
    statut: string;
}

interface StatsGlobales {
    resultat_net_total: number;
    depots_total: number;
    credits_total: number;
    nombre_succursales: number;
}

interface ComparatifMensuel {
    score_moyen_actuel: number;
    score_moyen_precedent: number;
    nb_alertes_actuel: number;
    nb_alertes_precedent: number;
}

interface PageProps {
    auth: { user: { id: number; name: string; role: string } };
    succursales: Succursale[];
    rapportsEnAttente: RapportEnAttente[];
    statsGlobales: StatsGlobales;
    comparatifMensuel: ComparatifMensuel;
    moisActuel: string;
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

export default function DashboardSiege() {
    const { auth, succursales, rapportsEnAttente, statsGlobales, comparatifMensuel, moisActuel } = usePage<PageProps>().props;
    const userName = auth?.user?.name ?? 'Utilisateur';

    const [isRejectOpen, setIsRejectOpen] = useState(false);
    const [selectedRapport, setSelectedRapport] = useState<RapportEnAttente | null>(null);
    const [motifRejet, setMotifRejet] = useState('');

    const { post, processing, setData } = useForm({
        motif: '',
    });

    const handleValider = (rapportId: number) => {
        post(siegeValider(rapportId).url, {
            preserveScroll: true,
        });
    };

    const openRejectDialog = (rapport: RapportEnAttente) => {
        setSelectedRapport(rapport);
        setMotifRejet('');
        setIsRejectOpen(true);
    };

    const handleRejeter = () => {
        if (selectedRapport && motifRejet.trim()) {
            post(siegeRejeter(selectedRapport.id).url, {
                data: { motif: motifRejet },
                preserveScroll: true,
                onSuccess: () => {
                    setIsRejectOpen(false);
                    setSelectedRapport(null);
                    setMotifRejet('');
                },
            });
        }
    };

    const kpiCards = [
        {
            title: 'Résultat Net Total',
            value: (statsGlobales.resultat_net_total / 1000000).toFixed(2) + 'M',
            currency: 'USD',
            icon: DollarSign,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20',
        },
        {
            title: 'Dépôts Total',
            value: (statsGlobales.depots_total / 1000000).toFixed(1) + 'M',
            currency: 'USD',
            icon: Users,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20',
        },
        {
            title: 'Crédits Total',
            value: (statsGlobales.credits_total / 1000000).toFixed(1) + 'M',
            currency: 'USD',
            icon: BarChart3,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/20',
        },
        {
            title: 'Succursales Actives',
            value: statsGlobales.nombre_succursales.toString(),
            currency: '',
            icon: Building2,
            color: 'text-violet-500',
            bg: 'bg-violet-500/10',
            border: 'border-violet-500/20',
        },
    ];

    const getStatutBadge = (statut: string) => {
        switch (statut) {
            case 'Conforme':
                return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">{statut}</Badge>;
            case 'En attente':
                return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">{statut}</Badge>;
            case 'Non conforme':
                return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">{statut}</Badge>;
            default:
                return <Badge variant="outline">{statut}</Badge>;
        }
    };

    return (
        <>
            <Head title="Tableau de bord Siège — KPIbank" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Bonjour, {userName.split(' ')[0]} 👋
                        </h1>
                        <p className="text-sm text-muted-foreground">Vue consolidée du réseau - {moisActuel}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="gap-1.5 border-emerald-500/40 bg-emerald-500/10 text-emerald-600">
                            <CheckCircle2 className="size-3" />
                            Siège Central
                        </Badge>
                        {rapportsEnAttente.length > 0 && (
                            <Badge variant="outline" className="gap-1.5 border-amber-500/40 bg-amber-500/10 text-amber-600">
                                <Clock className="size-3" />
                                {rapportsEnAttente.length} en attente
                            </Badge>
                        )}
                    </div>
                </div>

                {/* KPI Cards */}
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

                {/* Comparatif mensuel */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="shadow-none">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">Score moyen</CardTitle>
                            <CardDescription>Comparatif avec le mois précédent</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <div className="text-center">
                                    <p className="text-3xl font-bold">{comparatifMensuel.score_moyen_actuel.toFixed(1)}%</p>
                                    <p className="text-xs text-muted-foreground">{moisActuel}</p>
                                </div>
                                <div className="flex-1 h-px bg-border" />
                                <div className="text-center">
                                    <p className="text-2xl font-medium text-muted-foreground">{comparatifMensuel.score_moyen_precedent.toFixed(1)}%</p>
                                    <p className="text-xs text-muted-foreground">Mois précédent</p>
                                </div>
                                <div className={`flex items-center ${comparatifMensuel.score_moyen_actuel >= comparatifMensuel.score_moyen_precedent ? 'text-emerald-600' : 'text-red-600'}`}>
                                    {comparatifMensuel.score_moyen_actuel >= comparatifMensuel.score_moyen_precedent ? <TrendingUp className="size-5" /> : <TrendingDown className="size-5" />}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-none">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">Alertes</CardTitle>
                            <CardDescription>Nombre d'alertes ce mois</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <div className="text-center">
                                    <p className={`text-3xl font-bold ${comparatifMensuel.nb_alertes_actuel > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                                        {comparatifMensuel.nb_alertes_actuel}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{moisActuel}</p>
                                </div>
                                <div className="flex-1 h-px bg-border" />
                                <div className="text-center">
                                    <p className="text-2xl font-medium text-muted-foreground">{comparatifMensuel.nb_alertes_precedent}</p>
                                    <p className="text-xs text-muted-foreground">Mois précédent</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    {/* Succursales */}
                    <Card className="shadow-none">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Building2 className="size-4 text-muted-foreground" />
                                    Performance des succursales
                                </CardTitle>
                            </div>
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
                                                {getStatutBadge(branch.statut)}
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

                    {/* Rapports en attente */}
                    <Card className="shadow-none">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <FileBarChart2 className="size-4 text-muted-foreground" />
                                    Rapports en attente
                                </CardTitle>
                                <span className="text-xs text-muted-foreground">{rapportsEnAttente.length} à valider</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {rapportsEnAttente.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <CheckCircle2 className="size-10 text-emerald-500 mb-2" />
                                    <p className="text-sm text-muted-foreground">Tous les rapports sont validés</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {rapportsEnAttente.map((rapport) => (
                                        <div key={rapport.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                                            <div>
                                                <p className="text-sm font-medium">{rapport.succursale}</p>
                                                <p className="text-xs text-muted-foreground">{rapport.periode} • {rapport.date}</p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Badge className="bg-blue-500/10 text-blue-600">Soumis</Badge>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="size-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                                    onClick={() => handleValider(rapport.id)}
                                                    disabled={processing}
                                                    title="Valider"
                                                >
                                                    <Check className="size-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="size-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => openRejectDialog(rapport)}
                                                    disabled={processing}
                                                    title="Rejeter"
                                                >
                                                    <X className="size-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Dialogue de rejet */}
            <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Rejeter le rapport</DialogTitle>
                        <DialogDescription>
                            {selectedRapport && (
                                <>
                                    <strong>{selectedRapport.succursale}</strong> — {selectedRapport.periode}
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="motif">Motif du rejet</Label>
                            <Textarea
                                id="motif"
                                placeholder="Indiquez la raison du rejet..."
                                value={motifRejet}
                                onChange={(e) => setMotifRejet(e.target.value)}
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRejectOpen(false)}>
                            Annuler
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleRejeter}
                            disabled={processing || !motifRejet.trim()}
                        >
                            Rejeter
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

DashboardSiege.layout = {
    breadcrumbs: [{ title: 'Tableau de bord', href: dashboard() }],
};
