import { Head } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { dashboard } from '@/routes';

export default function Comparatif() {
    return (
        <div className="p-6 flex flex-col gap-6">
            <Head title="Comparatif — KPIbank" />
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold tracking-tight">Module de comparaison inter-succursales</h1>
                <p className="text-sm text-muted-foreground italic">Sélectionnez les succursales à comparer.</p>
            </div>
            <Card className="h-64 flex items-center justify-center p-12 text-center text-muted-foreground border-dashed">
                <CardDescription>Vue comparative (en cours de développement)</CardDescription>
            </Card>
        </div>
    );
}

Comparatif.layout = {
    breadcrumbs: [
        { title: 'Tableau de bord', href: dashboard() },
        { title: 'Comparatif', href: '/siege/comparatif' },
    ],
};
