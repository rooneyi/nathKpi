import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { dashboard } from '@/routes';

export default function AnalyseKPIs() {
    return (
        <div className="p-6 flex flex-col gap-6">
            <Head title="Analyse des KPIs — Siège Central" />
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Analyse des indicateurs financiers (KPIs)</h1>
                <p className="text-sm text-muted-foreground">Vue d'ensemble et analyse stratégique globale de la banque.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Tendances Trimestrielles</CardTitle>
                        <CardDescription>Visualisation graphique de l'évolution des ressources vs emplois.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-64 flex items-center justify-center bg-muted/20 border border-dashed rounded-lg">
                        <span className="text-muted-foreground">Graphique d'analyse avancée (Trendchart)</span>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Indicateurs de Rentabilité</CardTitle>
                        <CardDescription>Calcul automatique basé sur les données consolidées.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-sm text-muted-foreground">ROA</span>
                            <span className="text-sm font-bold">1.2%</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-sm text-muted-foreground">ROE</span>
                            <span className="text-sm font-bold">8.4%</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-sm text-muted-foreground">Coefficient d'Exploitation</span>
                            <span className="text-sm font-bold">65.2%</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

AnalyseKPIs.layout = {
    breadcrumbs: [
        { title: 'Tableau de bord', href: dashboard() },
        { title: 'Analyse KPIs', href: '/siege/analyse' },
    ],
};
