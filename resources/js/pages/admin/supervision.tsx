import { Head } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { dashboard } from '@/routes';

export default function Supervision() {
    return (
        <div className="p-6 flex flex-col gap-6">
            <Head title="Supervision Système — Administration" />
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold tracking-tight">Administration & Supervision Système</h1>
                <p className="text-sm text-muted-foreground italic">Module de contrôle technique global.</p>
            </div>
            <Card className="p-12 text-center text-muted-foreground border-dashed">
                 Accès aux logs, gestion des caches et état des services.
            </Card>
        </div>
    );
}

Supervision.layout = {
    breadcrumbs: [
        { title: 'Tableau de bord', href: dashboard() },
        { title: 'Supervision système', href: '/admin/supervision' },
    ],
};
