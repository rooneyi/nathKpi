import { Head, usePage } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { dashboard } from '@/routes';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, Calendar, Filter, CheckCircle2, Clock, FileBarChart2 } from 'lucide-react';
import { useState } from 'react';

interface PageProps {
    periodesDisponibles: { value: string; label: string }[];
    succursales: { id: number; nom: string }[];
}

export default function SiegeRapports() {
    const { periodesDisponibles, succursales } = usePage<PageProps>().props;
    const [periode, setPeriode] = useState('');
    const [typeRapport, setTypeRapport] = useState('synthese');

    const handleGeneratePDF = () => {
        const params = new URLSearchParams();
        if (periode) params.append('periode', periode);
        params.append('type', typeRapport);
        window.open(`/reports/generate-pdf?${params.toString()}`, '_blank');
    };

    return (
        <div className="p-6 flex flex-col gap-6">
            <Head title="Générer Rapport — KPIbank" />
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <FileBarChart2 className="size-6 text-primary" />
                    Génération de Rapports
                </h1>
                <p className="text-sm text-muted-foreground">Générez des rapports PDF pour le siège et les réunions de direction.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="shadow-none">
                    <CardHeader>
                        <CardTitle className="text-base">Rapport de Synthèse Globale</CardTitle>
                        <CardDescription>Rapport consolidé de toutes les succursales pour une période donnée.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Période</label>
                            <Select value={periode} onValueChange={setPeriode}>
                                <SelectTrigger><Calendar className="size-4 mr-2" /><SelectValue placeholder="Sélectionner une période" /></SelectTrigger>
                                <SelectContent>{periodesDisponibles?.map((p) => (<SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>))}</SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Type de rapport</label>
                            <Select value={typeRapport} onValueChange={setTypeRapport}>
                                <SelectTrigger><Filter className="size-4 mr-2" /><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="synthese">Synthèse globale</SelectItem>
                                    <SelectItem value="detaille">Rapport détaillé</SelectItem>
                                    <SelectItem value="kpis">KPIs uniquement</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button className="w-full gap-2" onClick={handleGeneratePDF} disabled={!periode}>
                            <Download className="size-4" /> Générer PDF
                        </Button>
                    </CardContent>
                </Card>

                <Card className="shadow-none">
                    <CardHeader>
                        <CardTitle className="text-base">Historique des Rapports Générés</CardTitle>
                        <CardDescription>Liste des derniers rapports générés par le système.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                                <div className="flex items-center gap-3">
                                    <FileText className="size-5 text-blue-500" />
                                    <div>
                                        <p className="text-sm font-medium">Rapport_Synthese_Mars_2026.pdf</p>
                                        <p className="text-xs text-muted-foreground">Généré le 04/04/2026</p>
                                    </div>
                                </div>
                                <Badge className="bg-emerald-500/10 text-emerald-600"><CheckCircle2 className="size-3 mr-1" />Prêt</Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                                <div className="flex items-center gap-3">
                                    <FileText className="size-5 text-blue-500" />
                                    <div>
                                        <p className="text-sm font-medium">Rapport_Detaille_Fevrier_2026.pdf</p>
                                        <p className="text-xs text-muted-foreground">Généré le 01/03/2026</p>
                                    </div>
                                </div>
                                <Badge className="bg-emerald-500/10 text-emerald-600"><CheckCircle2 className="size-3 mr-1" />Prêt</Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg border bg-card opacity-50">
                                <div className="flex items-center gap-3">
                                    <FileText className="size-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Rapport_KPIs_Janvier_2026.pdf</p>
                                        <p className="text-xs text-muted-foreground">En génération...</p>
                                    </div>
                                </div>
                                <Badge variant="secondary"><Clock className="size-3 mr-1" />En cours</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

SiegeRapports.layout = {
    breadcrumbs: [{ title: 'Tableau de bord', href: dashboard() }, { title: 'Rapports', href: '/siege/rapports' }],
};
