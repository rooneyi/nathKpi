import { Head } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { dashboard } from '@/routes';

export default function Rapports() {
    return (
        <div className="p-6 flex flex-col gap-6">
            <Head title="Rapports Financiers — KPIbank" />
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Génération de rapports financiers</h1>
                <p className="text-sm text-muted-foreground">Consolidez vos données et envoyez-les directement au siège central.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
                <Card className="flex flex-col items-center justify-center p-12 text-center hover:bg-muted/30 transition-colors cursor-pointer group" asChild>
                    <a href="/reports/generate-pdf" target="_blank" rel="noopener noreferrer">
                        <CardTitle className="mb-2 group-hover:text-primary transition-colors">Générer Rapport Mensuel (PDF)</CardTitle>
                        <CardDescription>Format standardisé de reporting financier PDF.</CardDescription>
                    </a>
                </Card>
                <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
                    <CardTitle className="mb-2 text-muted-foreground">Rapport Spécifique</CardTitle>
                    <CardDescription>Option de personnalisation (Trimestriel/Annuel).</CardDescription>
                </Card>
            </div>
        </div>
    );
}

Rapports.layout = {
    breadcrumbs: [
        { title: 'Tableau de bord', href: dashboard() },
        { title: 'Rapports Financiers', href: '/succursale/rapports' },
    ],
};
