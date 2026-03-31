import { Head } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { dashboard } from '@/routes';

export default function Succursales() {
    return (
        <div className="p-6 flex flex-col gap-6">
            <Head title="Gestion des Succursales — KPIbank" />
            <div className="flex flex-col gap-1 text-foreground">
                <h1 className="text-2xl font-bold tracking-tight">Vue d'ensemble des succursales</h1>
                <p className="text-sm text-muted-foreground">Gérez et suivez le statut de chaque succursale du réseau bancaire.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {['Kinshasa Centre', 'Gombe Succursale', 'Lubumbashi', 'Matadi', 'Kisangani'].map(s => (
                    <Card key={s}>
                        <CardHeader className="p-4">
                            <CardTitle className="text-sm">{s}</CardTitle>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    );
}

Succursales.layout = {
    breadcrumbs: [
        { title: 'Tableau de bord', href: dashboard() },
        { title: 'Succursales', href: '/siege/succursales' },
    ],
};
