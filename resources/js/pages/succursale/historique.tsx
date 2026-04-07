import { Head, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { dashboard } from '@/routes';
import { History, TrendingUp, FileText } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface Donnee {
    id: number;
    periode: string;
    total_actif: number;
    depots_collectes: number;
    credits_accordes: number;
    resultat_net: number;
    statut: string;
    kpi?: {
        score_performance: number;
        roe: number;
    };
}

interface PageProps {
    succursale: {
        id: number;
        nom: string;
        code: string;
    };
    donnees: {
        data: Donnee[];
        current_page: number;
        last_page: number;
    };
}

export default function Historique() {
    const { succursale, donnees } = usePage<PageProps>().props;

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    };

    const getStatutBadge = (statut: string) => {
        switch (statut) {
            case 'valide':
                return <Badge className="bg-emerald-500/10 text-emerald-600">Validé</Badge>;
            case 'soumis':
                return <Badge className="bg-blue-500/10 text-blue-600">Soumis</Badge>;
            case 'brouillon':
                return <Badge className="bg-amber-500/10 text-amber-600">Brouillon</Badge>;
            default:
                return <Badge variant="outline">{statut}</Badge>;
        }
    };

    return (
        <div className="p-6 flex flex-col gap-6">
            <Head title="Historique — KPIbank" />

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Historique des saisies
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Succursale: <span className="font-medium text-foreground">{succursale.nom}</span>
                    </p>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                <Card className="border-emerald-500/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-emerald-700">Données validées</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">
                            {donnees.data.filter(d => d.statut === 'valide').length}
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-blue-500/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-blue-700">Données soumises</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">
                            {donnees.data.filter(d => d.statut === 'soumis').length}
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-amber-500/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-amber-700">Brouillons</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">
                            {donnees.data.filter(d => d.statut === 'brouillon').length}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <History className="size-4" />
                        Toutes les saisies
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Période</TableHead>
                                <TableHead>Total Actif</TableHead>
                                <TableHead>Dépôts</TableHead>
                                <TableHead>Crédits</TableHead>
                                <TableHead>Résultat Net</TableHead>
                                <TableHead>Score</TableHead>
                                <TableHead>Statut</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {donnees.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                        <FileText className="size-8 mx-auto mb-2 opacity-50" />
                                        Aucune donnée saisie pour le moment
                                    </TableCell>
                                </TableRow>
                            ) : (
                                donnees.data.map((donnee) => (
                                    <TableRow key={donnee.id}>
                                        <TableCell className="font-medium">
                                            {formatDate(donnee.periode)}
                                        </TableCell>
                                        <TableCell>
                                            {donnee.total_actif?.toLocaleString()} USD
                                        </TableCell>
                                        <TableCell>
                                            {donnee.depots_collectes?.toLocaleString()} USD
                                        </TableCell>
                                        <TableCell>
                                            {donnee.credits_accordes?.toLocaleString()} USD
                                        </TableCell>
                                        <TableCell className={donnee.resultat_net >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                                            {donnee.resultat_net?.toLocaleString()} USD
                                        </TableCell>
                                        <TableCell>
                                            {donnee.kpi ? (
                                                <div className="flex items-center gap-1">
                                                    <TrendingUp className="size-3 text-emerald-500" />
                                                    {donnee.kpi.score_performance?.toFixed(1)}%
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground text-xs">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {getStatutBadge(donnee.statut)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

Historique.layout = {
    breadcrumbs: [
        { title: 'Tableau de bord', href: dashboard() },
        { title: 'Historique', href: '/succursale/historique' },
    ],
};
