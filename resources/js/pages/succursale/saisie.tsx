import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { dashboard } from '@/routes';

export default function SaisieDonnees() {
    return (
        <div className="p-6 flex flex-col gap-6">
            <Head title="Saisie des données — KPIbank" />
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Saisie des données financières</h1>
                <p className="text-sm text-muted-foreground">Veuillez renseigner les indicateurs pour la période actuelle.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Indicateurs de Dépôts</CardTitle>
                        <CardDescription>Saisie des montants collectés auprès de la clientèle.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="depot_part">Dépôts particuliers (USD)</Label>
                            <Input id="depot_part" type="number" placeholder="0.00" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="depot_entr">Dépôts entreprises (USD)</Label>
                            <Input id="depot_entr" type="number" placeholder="0.00" />
                        </div>
                        <Button className="w-full">Enregistrer les dépôts</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Indicateurs de Crédits</CardTitle>
                        <CardDescription>Saisie des crédits accordés et recouvrements.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="credit_nouv">Nouveaux crédits (USD)</Label>
                            <Input id="credit_nouv" type="number" placeholder="0.00" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="recouv">Recouvrements effectués (USD)</Label>
                            <Input id="recouv" type="number" placeholder="0.00" />
                        </div>
                        <Button className="w-full">Enregistrer les crédits</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

SaisieDonnees.layout = {
    breadcrumbs: [
        { title: 'Tableau de bord', href: dashboard() },
        { title: 'Saisie des données', href: '/succursale/saisie' },
    ],
};
