import { Head } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { dashboard } from '@/routes';
import { Badge } from '@/components/ui/badge';
import {
    ShieldCheck,
    Server,
    Database,
    Cpu,
    RefreshCw,
    AlertTriangle,
    CheckCircle2,
    Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Supervision() {
    return (
        <div className="p-6 flex flex-col gap-6">
            <Head title="Supervision Technique — Administration" />

            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    <ShieldCheck className="size-6 text-primary" />
                    Administration & Supervision Système
                </h1>
                <p className="text-sm text-muted-foreground italic">Contrôle de l'infrastructure et de l'intégrité des données.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: 'Serveur Web', value: '100%', status: 'Stable', icon: Server, color: 'text-emerald-500' },
                    { label: 'Base de données', value: '0.4ms', status: 'Optimal', icon: Database, color: 'text-emerald-500' },
                    { label: 'Utilisation CPU', value: '12%', status: 'Normal', icon: Cpu, color: 'text-blue-500' },
                    { label: 'Backup Quotidien', value: '04:00', status: 'Réussi', icon: Lock, color: 'text-emerald-500' },
                ].map((s, i) => (
                    <Card key={i} className="shadow-none border-muted">
                        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-xs font-bold text-muted-foreground uppercase">{s.label}</CardTitle>
                            <s.icon className={`h-4 w-4 ${s.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{s.value}</div>
                            <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                                <span className={`size-1.5 rounded-full ${s.color.replace('text', 'bg')} animate-pulse`} />
                                {s.status}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Health Checks */}
                <Card className="shadow-none border-muted">
                    <CardHeader>
                        <CardTitle className="text-base font-bold">État des Services & Jobs</CardTitle>
                        <CardDescription>File d'attente et traitements d'arrière-plan.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { name: 'Email Notifications (Postmark)', status: 'Opérationnel', check: true },
                            { name: 'Génération PDF Service', status: 'Opérationnel', check: true },
                            { name: 'Indexation Wayfinder', status: 'Synchronisé', check: true },
                            { name: 'Nettoyage Caches', status: 'En attente', check: false },
                        ].map((srv, i) => (
                            <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                                <span className="text-sm font-medium">{srv.name}</span>
                                <Badge variant="outline" className={srv.check ? "bg-emerald-500/10 text-emerald-600 border-none px-3" : "bg-muted text-muted-foreground border-none px-3"}>
                                    {srv.check && <CheckCircle2 className="size-3 mr-1.5" />}
                                    {srv.status}
                                </Badge>
                            </div>
                        ))}
                        <Button className="w-full gap-2 mt-2" variant="outline">
                            <RefreshCw className="size-4" /> Relancer les Services
                        </Button>
                    </CardContent>
                </Card>

                {/* Resource Usage */}
                <Card className="shadow-none border-muted">
                    <CardHeader>
                        <CardTitle className="text-base font-bold">Allocation des Ressources</CardTitle>
                        <CardDescription>Capacité de stockage et utilisation mémoire.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-medium">
                                <span>Espace Disque (Amazon S3)</span>
                                <span>42.5 GB / 50 GB</span>
                            </div>
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: '85%' }} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-medium">
                                <span>Mémoire Redis (Cache)</span>
                                <span>128 MB / 1024 MB</span>
                            </div>
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full" style={{ width: '12%' }} />
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl mt-4">
                            <AlertTriangle className="size-5 text-amber-600 shrink-0" />
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-amber-700 uppercase">Attention Stockage</p>
                                <p className="text-[11px] text-amber-800/80 leading-relaxed">
                                    L'espace disque pour les archives rapports dépasse 80%. Pensez à purger les logs ou augmenter le quota S3.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

Supervision.layout = {
    breadcrumbs: [
        { title: 'Tableau de bord', href: dashboard() },
        { title: 'Supervision technique', href: '/admin/supervision' },
    ],
};
