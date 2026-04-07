import { Head, useForm, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import { valider as siegeValider, rejeter as siegeRejeter } from '@/routes/siege';
import { Check, X, Filter, CalendarDays } from 'lucide-react';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface Rapport {
    id: number;
    succursale: string | null;
    periode: string;
    resultat_net: number;
    depots_collectes: number;
    credits_accordes: number;
    statut: string;
    updated_at: string | null;
}

interface PaginatedDonnees {
    data: Rapport[];
    current_page: number;
    last_page: number;
    total: number;
}

interface PageProps {
    donnees: PaginatedDonnees;
}

export default function SiegeValidation() {
    const { donnees } = usePage<PageProps>().props;
    const [selectedRapport, setSelectedRapport] = useState<Rapport | null>(null);
    const [motifRejet, setMotifRejet] = useState('');

    const { post, processing } = useForm({ motif: '' });

    const handleValider = (rapportId: number) => {
        post(siegeValider(rapportId).url, { preserveScroll: true });
    };

    const handleRejeter = () => {
        if (!selectedRapport || !motifRejet.trim()) return;

        post(siegeRejeter(selectedRapport.id).url, {
            data: { motif: motifRejet },
            preserveScroll: true,
            onSuccess: () => {
                setSelectedRapport(null);
                setMotifRejet('');
            },
        });
    };

    const formatPeriode = (value: string) => {
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return value;
        return d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    };

    return (
        <div className="p-6 flex flex-col gap-6">
            <Head title="Validation des rapports — KPIbank" />

            <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight">Validation des rapports succursales</h1>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <CalendarDays className="size-4" />
                        {donnees.total} rapport(s) en attente ou récemment traités
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Filter className="size-4" />
                        Filtres à venir
                    </Button>
                </div>
            </div>

            <Card className="shadow-none">
                <CardHeader className="pb-2 border-b bg-muted/5">
                    <CardTitle className="text-base">Rapports soumis par les succursales</CardTitle>
                    <CardDescription>Liste des rapports financiers à valider ou à rejeter.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/30">
                                <th className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Succursale</th>
                                <th className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Période</th>
                                <th className="px-4 py-3 text-right text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Résultat Net</th>
                                <th className="px-4 py-3 text-right text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Dépôts</th>
                                <th className="px-4 py-3 text-right text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Crédits</th>
                                <th className="px-4 py-3 text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Statut</th>
                                <th className="px-4 py-3 text-right text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-muted/50">
                            {donnees.data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                                        Aucun rapport soumis pour le moment.
                                    </td>
                                </tr>
                            ) : (
                                donnees.data.map((rapport) => (
                                    <tr key={rapport.id} className="hover:bg-muted/10">
                                        <td className="px-4 py-3 font-medium">{rapport.succursale ?? '—'}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{formatPeriode(rapport.periode)}</td>
                                        <td className="px-4 py-3 text-right">{rapport.resultat_net.toLocaleString()} USD</td>
                                        <td className="px-4 py-3 text-right">{rapport.depots_collectes.toLocaleString()} USD</td>
                                        <td className="px-4 py-3 text-right">{rapport.credits_accordes.toLocaleString()} USD</td>
                                        <td className="px-4 py-3 text-center">
                                            <Badge className="bg-blue-500/10 text-blue-600">{rapport.statut}</Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-2">
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
                                                    onClick={() => setSelectedRapport(rapport)}
                                                    disabled={processing}
                                                    title="Rejeter"
                                                >
                                                    <X className="size-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            {selectedRapport && (
                <Card className="max-w-xl shadow-none border-destructive/40 bg-destructive/5">
                    <CardHeader>
                        <CardTitle className="text-base">Rejeter le rapport</CardTitle>
                        <CardDescription>
                            {selectedRapport.succursale} — {formatPeriode(selectedRapport.periode)}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="space-y-2">
                            <Label htmlFor="motif">Motif du rejet</Label>
                            <Textarea
                                id="motif"
                                rows={3}
                                value={motifRejet}
                                onChange={(e) => setMotifRejet(e.target.value)}
                                placeholder="Expliquez brièvement la raison du rejet..."
                            />
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <Button variant="outline" size="sm" onClick={() => { setSelectedRapport(null); setMotifRejet(''); }}>
                                Annuler
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleRejeter}
                                disabled={processing || !motifRejet.trim()}
                            >
                                Rejeter le rapport
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

SiegeValidation.layout = {
    breadcrumbs: [
        { title: 'Tableau de bord', href: dashboard() },
        { title: 'Validation des rapports', href: '/siege/validation' },
    ],
};
