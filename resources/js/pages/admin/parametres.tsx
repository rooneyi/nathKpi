import { Head } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { dashboard } from '@/routes';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Bell, Shield, Mail, Database, Save } from 'lucide-react';
import { useForm } from '@inertiajs/react';

export default function AdminParametres() {
    const { data, setData, post, processing } = useForm({
        seuil_alerte_score: 70,
        seuil_alerte_roe: 10,
        email_notifications: true,
        validation_auto: false,
        frequence_rapports: 'mensuel',
        devise_par_defaut: 'USD',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/parametres', {
            preserveScroll: true,
        });
    };

    return (
        <div className="p-6 flex flex-col gap-6">
            <Head title="Paramètres — Administration" />
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <Settings className="size-6 text-primary" />
                    Paramètres du Système
                </h1>
                <p className="text-sm text-muted-foreground">Configurez les paramètres globaux de l'application.</p>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
                <Card className="shadow-none">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2"><Bell className="size-4" /> Alertes & Seuils</CardTitle>
                        <CardDescription>Configurez les seuils de déclenchement des alertes.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="seuil_alerte_score">Seuil d'alerte Score Performance (%)</Label>
                            <Input id="seuil_alerte_score" type="number" value={data.seuil_alerte_score} onChange={e => setData('seuil_alerte_score', parseInt(e.target.value))} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="seuil_alerte_roe">Seuil d'alerte ROE (%)</Label>
                            <Input id="seuil_alerte_roe" type="number" value={data.seuil_alerte_roe} onChange={e => setData('seuil_alerte_roe', parseInt(e.target.value))} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-none">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2"><Mail className="size-4" /> Notifications</CardTitle>
                        <CardDescription>Configurez les notifications par email.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div><Label>Notifications email</Label><p className="text-xs text-muted-foreground">Envoyer des emails lors des validations/rejets</p></div>
                            <Switch checked={data.email_notifications} onCheckedChange={v => setData('email_notifications', v)} />
                        </div>
                        <div className="flex items-center justify-between">
                            <div><Label>Validation automatique</Label><p className="text-xs text-muted-foreground">Valider automatiquement les rapports sans erreur</p></div>
                            <Switch checked={data.validation_auto} onCheckedChange={v => setData('validation_auto', v)} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-none">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2"><Database className="size-4" /> Général</CardTitle>
                        <CardDescription>Paramètres généraux du système.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Fréquence des rapports</Label>
                            <Select value={data.frequence_rapports} onValueChange={v => setData('frequence_rapports', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="mensuel">Mensuel</SelectItem>
                                    <SelectItem value="trimestriel">Trimestriel</SelectItem>
                                    <SelectItem value="annuel">Annuel</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Devise par défaut</Label>
                            <Select value={data.devise_par_defaut} onValueChange={v => setData('devise_par_defaut', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="USD">USD ($)</SelectItem>
                                    <SelectItem value="CDF">CDF (FC)</SelectItem>
                                    <SelectItem value="EUR">EUR (€)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-none">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2"><Shield className="size-4" /> Sécurité</CardTitle>
                        <CardDescription>Paramètres de sécurité du système.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 rounded-lg border bg-muted/30">
                            <p className="text-sm font-medium">Version: <Badge variant="outline">v1.0.0</Badge></p>
                            <p className="text-xs text-muted-foreground mt-1">Dernière mise à jour: 04/04/2026</p>
                        </div>
                        <div className="p-4 rounded-lg border bg-muted/30">
                            <p className="text-sm font-medium">Base de données: <Badge variant="outline">SQLite</Badge></p>
                            <p className="text-xs text-muted-foreground mt-1">Mode: Production</p>
                        </div>
                    </CardContent>
                </Card>

                <div className="md:col-span-2 flex justify-end">
                    <Button type="submit" disabled={processing} className="gap-2">
                        <Save className="size-4" /> Enregistrer les modifications
                    </Button>
                </div>
            </form>
        </div>
    );
}

AdminParametres.layout = {
    breadcrumbs: [{ title: 'Tableau de bord', href: dashboard() }, { title: 'Paramètres', href: '/admin/parametres' }],
};
