import { Head } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { dashboard } from '@/routes';

export default function Historique() {
    return (
        <div className="p-6 flex flex-col gap-6 text-foreground">
            <Head title="Historique — KPIbank" />
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold tracking-tight">Historique des indicateurs</h1>
                <p className="text-sm text-muted-foreground">Retrouvez toutes les saisies précédentes des indicateurs financiers.</p>
            </div>
            <Card>
                <CardContent className="h-48 flex items-center justify-center text-muted-foreground italic border border-dashed rounded-lg">
                    Aucun historique de saisie trouvé pour l'instant.
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
