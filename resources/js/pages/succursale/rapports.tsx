import { Head, usePage } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { dashboard } from '@/routes';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Download, Calendar, CheckCircle2, Clock, FileBarChart2, TrendingUp } from 'lucide-react';

interface PageProps {
    succursale: { nom: string };
    periodesDisponibles: { value: string; label: string }[];
}

export default function Rapports() {
    const { succursale, periodesDisponibles } = usePage<PageProps>().props;

    return (
        <div className="p-6 flex flex-col gap-6">
            <Head title="Rapports Financiers — KPIbank" />
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <FileBarChart2 className="size-6 text-primary" />
                    Rapports Financiers
                </h1>
                <p className="text-sm text-muted-foreground">Générez et consultez vos rapports pour {succursale?.nom || 'votre succursale'}.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="shadow-none">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2"><TrendingUp className="size-4" /> Rapport Mensuel</CardTitle>
                        <CardDescription>Générez votre rapport mensuel au format PDF.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 rounded-lg border bg-muted/30">
                            <p className="text-sm font-medium">Dernière génération:</p>
                            <p className="text-xs text-muted-foreground">Mars 2026 — Généré le 04/04/2026</p>
                        </div>
                        <Button className="w-full gap-2" onClick={() => window.open('/reports/generate-pdf', '_blank')}>
                            <Download className="size-4" /> Télécharger le dernier rapport
                        </Button>
                    </CardContent>
                </Card>

                <Card className="shadow-none">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2"><Calendar className="size-4" /> Historique des Rapports</CardTitle>
                        <CardDescription>Consultez l'historique de vos rapports générés.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                                <div className="flex items-center gap-3">
                                    <FileText className="size-5 text-blue-500" />
                                    <div>
                                        <p className="text-sm font-medium">Rapport_Mars_2026.pdf</p>
                                        <p className="text-xs text-muted-foreground">Soumis le 04/04/2026</p>
                                    </div>
                                </div>
                                <Badge className="bg-emerald-500/10 text-emerald-600"><CheckCircle2 className="size-3 mr-1" />Validé</Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                                <div className="flex items-center gap-3">
                                    <FileText className="size-5 text-blue-500" />
                                    <div>
                                        <p className="text-sm font-medium">Rapport_Fevrier_2026.pdf</p>
                                        <p className="text-xs text-muted-foreground">Soumis le 01/03/2026</p>
                                    </div>
                                </div>
                                <Badge className="bg-emerald-500/10 text-emerald-600"><CheckCircle2 className="size-3 mr-1" />Validé</Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                                <div className="flex items-center gap-3">
                                    <FileText className="size-5 text-blue-500" />
                                    <div>
                                        <p className="text-sm font-medium">Rapport_Janvier_2026.pdf</p>
                                        <p className="text-xs text-muted-foreground">Soumis le 01/02/2026</p>
                                    </div>
                                </div>
                                <Badge className="bg-emerald-500/10 text-emerald-600"><CheckCircle2 className="size-3 mr-1" />Validé</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

Rapports.layout = {
    breadcrumbs: [
        { title: 'Tableau de bord', href: dashboard() },
        { title: 'Rapports', href: '/succursale/rapports' },
    ],
};
