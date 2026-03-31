import { Head } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { dashboard } from '@/routes';

export default function SiegeRapports() {
    return (
        <div className="p-6 flex flex-col gap-6">
            <Head title="Générer Rapport Synthèse — KPIbank" />
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold tracking-tight">Rapports de synthèse globale</h1>
                <p className="text-sm text-muted-foreground">Format pour présentation en réunion de direction.</p>
            </div>
            <Card className="p-12 text-center text-muted-foreground border-dashed hover:bg-muted/30 hover:text-foreground transition-all cursor-pointer" asChild>
                <a href="/reports/generate-pdf" target="_blank" rel="noopener noreferrer">
                    Générer Rapport de Synthèse Globale (PDF)
                </a>
            </Card>
        </div>
    );
}

SiegeRapports.layout = {
    breadcrumbs: [
        { title: 'Tableau de bord', href: dashboard() },
        { title: 'Générer rapport', href: '/siege/rapports' },
    ],
};
