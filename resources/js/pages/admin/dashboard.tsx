import { Head, usePage } from '@inertiajs/react';
import {
    Users,
    Building2,
    Database,
    CheckCircle2,
    AlertCircle,
    Activity,
    Settings,
    Shield,
    Clock,
    Plus,
    UserPlus,
    Trash2,
    Edit3,
    AlertTriangle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';

interface StatsSysteme {
    total_succursales: number;
    succursales_actives: number;
    total_utilisateurs: number;
    donnees_mois: number;
    donnees_validees: number;
}

interface Utilisateur {
    id: number;
    name: string;
    email: string;
    role: string;
    succursale: string | null;
}

interface Activite {
    type: string;
    succursale: string;
    utilisateur: string;
    date: string;
}

interface AlerteCritique {
    succursale: string;
    score: number;
    alertes: string[];
}

interface PageProps {
    auth: { user: { id: number; name: string; role: string } };
    statsSysteme: StatsSysteme;
    derniersUtilisateurs: Utilisateur[];
    activitesRecentes: Activite[];
    alertesCritiques: AlerteCritique[];
    moisActuel: string;
}

export default function DashboardAdmin() {
    const { auth, statsSysteme, derniersUtilisateurs, activitesRecentes, alertesCritiques, moisActuel } = usePage<PageProps>().props;
    const userName = auth?.user?.name ?? 'Administrateur';

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin':
                return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Admin</Badge>;
            case 'siege':
                return <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20">Siège</Badge>;
            case 'succursale':
                return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">Succursale</Badge>;
            default:
                return <Badge variant="outline">{role}</Badge>;
        }
    };

    const getActiviteIcon = (type: string) => {
        if (type.includes('valide')) return <CheckCircle2 className="size-4 text-emerald-500" />;
        if (type.includes('soumis')) return <Clock className="size-4 text-blue-500" />;
        if (type.includes('brouillon')) return <Edit3 className="size-4 text-amber-500" />;
        return <Activity className="size-4 text-muted-foreground" />;
    };

    return (
        <>
            <Head title="Tableau de bord Admin — KPIbank" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Bonjour, {userName.split(' ')[0]} 👋
                        </h1>
                        <p className="text-sm text-muted-foreground">Panneau d'administration - {moisActuel}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="gap-1.5 border-red-500/40 bg-red-500/10 text-red-600">
                            <Shield className="size-3" />
                            Administrateur
                        </Badge>
                    </div>
                </div>

                {/* Stats système */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <Card className="shadow-none">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-xs font-medium uppercase">Succursales</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <span className="text-2xl font-bold">{statsSysteme.total_succursales}</span>
                                <Building2 className="size-5 text-muted-foreground" />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {statsSysteme.succursales_actives} actives
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-none">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-xs font-medium uppercase">Utilisateurs</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <span className="text-2xl font-bold">{statsSysteme.total_utilisateurs}</span>
                                <Users className="size-5 text-muted-foreground" />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                dans le système
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-none">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-xs font-medium uppercase">Données ce mois</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <span className="text-2xl font-bold">{statsSysteme.donnees_mois}</span>
                                <Database className="size-5 text-muted-foreground" />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {statsSysteme.donnees_validees} validées
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-none col-span-2">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-xs font-medium uppercase">Taux de validation</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                        style={{ width: `${statsSysteme.donnees_mois > 0 ? (statsSysteme.donnees_validees / statsSysteme.donnees_mois) * 100 : 0}%` }}
                                    />
                                </div>
                                <span className="text-sm font-medium">
                                    {statsSysteme.donnees_mois > 0 ? ((statsSysteme.donnees_validees / statsSysteme.donnees_mois) * 100).toFixed(0) : 0}%
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Alertes critiques */}
                {alertesCritiques.length > 0 && (
                    <Card className="border-red-200 bg-red-50 shadow-none">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2 text-red-700">
                                <AlertTriangle className="size-4" />
                                Alertes critiques ({alertesCritiques.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {alertesCritiques.map((alerte, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
                                        <div>
                                            <p className="font-medium text-red-700">{alerte.succursale}</p>
                                            <p className="text-xs text-red-600">
                                                Score: {alerte.score.toFixed(1)}% • {alerte.alertes.join(', ')}
                                            </p>
                                        </div>
                                        <Badge className="bg-red-100 text-red-700 border-red-200">
                                            Critique
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="grid gap-4 lg:grid-cols-2">
                    {/* Derniers utilisateurs */}
                    <Card className="shadow-none">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Users className="size-4 text-muted-foreground" />
                                    Derniers utilisateurs
                                </CardTitle>
                                <Button size="sm" variant="ghost" className="gap-1">
                                    <Plus className="size-4" />
                                    Ajouter
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {derniersUtilisateurs.map((user) => (
                                    <div key={user.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                                        <div>
                                            <p className="text-sm font-medium">{user.name}</p>
                                            <p className="text-xs text-muted-foreground">{user.email}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {getRoleBadge(user.role)}
                                            {user.succursale && (
                                                <span className="text-xs text-muted-foreground">• {user.succursale}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Activités récentes */}
                    <Card className="shadow-none">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Activity className="size-4 text-muted-foreground" />
                                Activités récentes
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {activitesRecentes.map((activite, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                                        {getActiviteIcon(activite.type)}
                                        <div className="flex-1">
                                            <p className="text-sm">
                                                <span className="font-medium">{activite.succursale}</span>
                                                {' '}• {activite.utilisateur}
                                            </p>
                                            <p className="text-xs text-muted-foreground">{activite.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Actions rapides */}
                <Card className="shadow-none">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Actions rapides</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            <Button variant="outline" className="gap-2">
                                <UserPlus className="size-4" />
                                Créer un utilisateur
                            </Button>
                            <Button variant="outline" className="gap-2">
                                <Building2 className="size-4" />
                                Gérer les succursales
                            </Button>
                            <Button variant="outline" className="gap-2">
                                <Settings className="size-4" />
                                Paramètres système
                            </Button>
                            <Button variant="outline" className="gap-2">
                                <Database className="size-4" />
                                Export données
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

DashboardAdmin.layout = {
    breadcrumbs: [{ title: 'Tableau de bord', href: dashboard() }],
};
