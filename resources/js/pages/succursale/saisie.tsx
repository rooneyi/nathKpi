import { Head, useForm, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { dashboard } from '@/routes';
import { AlertCircle, CheckCircle2, History, Save, Send, FileText, TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';

interface Donnee {
    id?: number;
    periode: string;
    total_actif: number;
    total_passif: number;
    depots_collectes: number;
    credits_accordes: number;
    liquidites_disponibles: number;
    produits: number;
    charges: number;
    produit_net_bancaire: number;
    resultat_net: number;
    cout_exploitation: number;
    fonds_propres: number;
    credits_douteux: number;
    total_credits: number;
    respect_instructions: boolean;
    volume_transactions: number;
    situation_liquidite: 'faible' | 'moyenne' | 'elevee';
    impact_politique_monetaire?: string;
    statut: string;
    kpi?: {
        score_performance: number;
        roe: number;
        ratio_credits_depots: number;
        ratio_creances_douteuses: number;
        alertes: string[];
    };
}

interface PageProps {
    succursale: {
        id: number;
        nom: string;
        code: string;
        ville: string;
    };
    donnee: Donnee | null;
    moisActuel: string;
    historique: Donnee[];
}

export default function SaisieDonnees() {
    const { succursale, donnee, moisActuel, historique } = usePage<PageProps>().props;
    const [showKpi, setShowKpi] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        periode: moisActuel,
        total_actif: donnee?.total_actif ?? 0,
        total_passif: donnee?.total_passif ?? 0,
        depots_collectes: donnee?.depots_collectes ?? 0,
        credits_accordes: donnee?.credits_accordes ?? 0,
        liquidites_disponibles: donnee?.liquidites_disponibles ?? 0,
        produits: donnee?.produits ?? 0,
        charges: donnee?.charges ?? 0,
        produit_net_bancaire: donnee?.produit_net_bancaire ?? 0,
        resultat_net: donnee?.resultat_net ?? 0,
        cout_exploitation: donnee?.cout_exploitation ?? 0,
        fonds_propres: donnee?.fonds_propres ?? 0,
        credits_douteux: donnee?.credits_douteux ?? 0,
        total_credits: donnee?.total_credits ?? 0,
        respect_instructions: donnee?.respect_instructions ?? false,
        rapport_audit: null as File | null,
        volume_transactions: donnee?.volume_transactions ?? 0,
        situation_liquidite: donnee?.situation_liquidite ?? 'moyenne',
        impact_politique_monetaire: donnee?.impact_politique_monetaire ?? '',
        action: 'save',
    });

    const handleSubmit = (action: 'save' | 'submit') => {
        setData('action', action);
        post(route('succursale.store'), {
            onSuccess: () => {
                if (action === 'submit') {
                    setShowKpi(true);
                }
            },
        });
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    };

    const getStatutBadge = () => {
        if (!donnee) return <Badge variant="outline" className="bg-gray-500/10 text-gray-600">Non saisi</Badge>;
        switch (donnee.statut) {
            case 'brouillon':
                return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20"><AlertCircle className="size-3 mr-1" /> Brouillon</Badge>;
            case 'soumis':
                return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20"><Send className="size-3 mr-1" /> Soumis</Badge>;
            case 'valide':
                return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20"><CheckCircle2 className="size-3 mr-1" /> Validé</Badge>;
            default:
                return <Badge variant="outline">{donnee.statut}</Badge>;
        }
    };

    return (
        <div className="p-6 flex flex-col gap-6">
            <Head title="Saisie des données — KPIbank" />

            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Saisie des indicateurs financiers
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Succursale: <span className="font-medium text-foreground">{succursale.nom}</span> ({succursale.code})
                    </p>
                    <p className="text-sm text-muted-foreground italic">
                        Période: {formatDate(moisActuel)}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {getStatutBadge()}
                </div>
            </div>

            {/* KPI Preview if submitted */}
            {showKpi && donnee?.kpi && (
                <Card className="border-emerald-500/20 bg-emerald-50/50">
                    <CardHeader>
                        <CardTitle className="text-emerald-700 flex items-center gap-2">
                            <TrendingUp className="size-5" />
                            KPIs calculés automatiquement
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-emerald-600">{donnee.kpi.score_performance?.toFixed(1) ?? 0}%</p>
                                <p className="text-xs text-muted-foreground">Score Performance</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-blue-600">{(donnee.kpi.roe * 100)?.toFixed(1) ?? 0}%</p>
                                <p className="text-xs text-muted-foreground">ROE</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-amber-600">{(donnee.kpi.ratio_credits_depots * 100)?.toFixed(1) ?? 0}%</p>
                                <p className="text-xs text-muted-foreground">Crédits/Dépôts</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-red-600">{(donnee.kpi.ratio_creances_douteuses * 100)?.toFixed(1) ?? 0}%</p>
                                <p className="text-xs text-muted-foreground">Créances douteuses</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Form */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    {/* Bilan */}
                    <Card className="border-blue-500/20 shadow-none">
                        <CardHeader className="bg-blue-500/5 pb-4">
                            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-blue-700">
                                Données de base (Bilan)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="total_actif">Total Actif (USD)</Label>
                                    <Input
                                        id="total_actif"
                                        type="number"
                                        value={data.total_actif}
                                        onChange={e => setData('total_actif', Number(e.target.value))}
                                        className={errors.total_actif ? 'border-red-500' : ''}
                                    />
                                    {errors.total_actif && <p className="text-xs text-red-500">{errors.total_actif}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="total_passif">Total Passif (USD)</Label>
                                    <Input
                                        id="total_passif"
                                        type="number"
                                        value={data.total_passif}
                                        onChange={e => setData('total_passif', Number(e.target.value))}
                                        className={errors.total_passif ? 'border-red-500' : ''}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="depots_collectes">Dépôts Collectés (USD)</Label>
                                    <Input
                                        id="depots_collectes"
                                        type="number"
                                        value={data.depots_collectes}
                                        onChange={e => setData('depots_collectes', Number(e.target.value))}
                                        className={errors.depots_collectes ? 'border-red-500' : ''}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="credits_accordes">Crédits Accordés (USD)</Label>
                                    <Input
                                        id="credits_accordes"
                                        type="number"
                                        value={data.credits_accordes}
                                        onChange={e => setData('credits_accordes', Number(e.target.value))}
                                        className={errors.credits_accordes ? 'border-red-500' : ''}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="liquidites_disponibles">Liquidités Disponibles (USD)</Label>
                                    <Input
                                        id="liquidites_disponibles"
                                        type="number"
                                        value={data.liquidites_disponibles}
                                        onChange={e => setData('liquidites_disponibles', Number(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="fonds_propres">Fonds Propres (USD)</Label>
                                    <Input
                                        id="fonds_propres"
                                        type="number"
                                        value={data.fonds_propres}
                                        onChange={e => setData('fonds_propres', Number(e.target.value))}
                                        className={errors.fonds_propres ? 'border-red-500' : ''}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Compte de résultat */}
                    <Card className="border-emerald-500/20 shadow-none">
                        <CardHeader className="bg-emerald-500/5 pb-4">
                            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
                                Compte de Résultat
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="produits">Produits/Revenus (USD)</Label>
                                    <Input
                                        id="produits"
                                        type="number"
                                        value={data.produits}
                                        onChange={e => setData('produits', Number(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="charges">Charges/Dépenses (USD)</Label>
                                    <Input
                                        id="charges"
                                        type="number"
                                        value={data.charges}
                                        onChange={e => setData('charges', Number(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="produit_net_bancaire">Produit Net Bancaire (USD)</Label>
                                    <Input
                                        id="produit_net_bancaire"
                                        type="number"
                                        value={data.produit_net_bancaire}
                                        onChange={e => setData('produit_net_bancaire', Number(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="resultat_net">Résultat Net (USD)</Label>
                                    <Input
                                        id="resultat_net"
                                        type="number"
                                        value={data.resultat_net}
                                        onChange={e => setData('resultat_net', Number(e.target.value))}
                                        className={errors.resultat_net ? 'border-red-500' : ''}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cout_exploitation">Coût d'Exploitation (USD)</Label>
                                    <Input
                                        id="cout_exploitation"
                                        type="number"
                                        value={data.cout_exploitation}
                                        onChange={e => setData('cout_exploitation', Number(e.target.value))}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Données de risque */}
                    <Card className="border-amber-500/20 shadow-none">
                        <CardHeader className="bg-amber-500/5 pb-4">
                            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-amber-700">
                                Données de Risque
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="credits_douteux">Crédits Douteux (USD)</Label>
                                    <Input
                                        id="credits_douteux"
                                        type="number"
                                        value={data.credits_douteux}
                                        onChange={e => setData('credits_douteux', Number(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="total_credits">Total Crédits (USD)</Label>
                                    <Input
                                        id="total_credits"
                                        type="number"
                                        value={data.total_credits}
                                        onChange={e => setData('total_credits', Number(e.target.value))}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Données complémentaires */}
                    <Card className="border-violet-500/20 shadow-none">
                        <CardHeader className="bg-violet-500/5 pb-4">
                            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-violet-700">
                                Données Complémentaires
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="volume_transactions">Volume Transactions (USD)</Label>
                                    <Input
                                        id="volume_transactions"
                                        type="number"
                                        value={data.volume_transactions}
                                        onChange={e => setData('volume_transactions', Number(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="situation_liquidite">Situation Liquidité</Label>
                                    <Select
                                        value={data.situation_liquidite}
                                        onValueChange={(value: 'faible' | 'moyenne' | 'elevee') => setData('situation_liquidite', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="faible">Faible</SelectItem>
                                            <SelectItem value="moyenne">Moyenne</SelectItem>
                                            <SelectItem value="elevee">Élevée</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="impact_politique_monetaire">Impact Politique Monétaire</Label>
                                <Input
                                    id="impact_politique_monetaire"
                                    value={data.impact_politique_monetaire}
                                    onChange={e => setData('impact_politique_monetaire', e.target.value)}
                                    placeholder="Description de l'impact..."
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="respect_instructions"
                                    checked={data.respect_instructions}
                                    onCheckedChange={(checked) => setData('respect_instructions', checked as boolean)}
                                />
                                <Label htmlFor="respect_instructions" className="text-sm">
                                    Respect des instructions réglementaires
                                </Label>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="rapport_audit">Rapport d'audit (PDF)</Label>
                                <Input
                                    id="rapport_audit"
                                    type="file"
                                    accept=".pdf"
                                    onChange={e => setData('rapport_audit', e.target.files?.[0] ?? null)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <Card className="shadow-none">
                        <Separator />
                        <CardFooter className="flex items-center justify-between pt-4">
                            <p className="text-xs text-muted-foreground max-w-[400px]">
                                En soumettant, vous certifiez l'exactitude des données. Les KPIs seront calculés automatiquement.
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => handleSubmit('save')}
                                    disabled={processing}
                                    className="gap-2"
                                >
                                    <Save className="size-4" />
                                    {processing ? 'Enregistrement...' : 'Enregistrer brouillon'}
                                </Button>
                                <Button
                                    onClick={() => handleSubmit('submit')}
                                    disabled={processing || donnee?.statut === 'valide'}
                                    className="bg-emerald-600 hover:bg-emerald-700 gap-2"
                                >
                                    <Send className="size-4" />
                                    {processing ? 'Soumission...' : 'Soumettre au Siège'}
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="flex flex-col gap-6">
                    <Card className="shadow-none bg-muted/20">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <History className="size-4" />
                                Historique récent
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="flex flex-col divide-y border-t bg-card">
                                {historique.length === 0 ? (
                                    <p className="p-4 text-sm text-muted-foreground text-center">
                                        Aucune donnée saisie précédemment
                                    </p>
                                ) : (
                                    historique.map((item, i) => (
                                        <div key={i} className="flex items-center justify-between px-4 py-3 hover:bg-muted/40 transition-colors cursor-pointer">
                                            <div>
                                                <p className="text-sm font-medium">{formatDate(item.periode)}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Résultat: {item.resultat_net?.toLocaleString()} USD
                                                </p>
                                            </div>
                                            <Badge className={
                                                item.statut === 'valide' ? 'bg-emerald-500/10 text-emerald-600' :
                                                item.statut === 'soumis' ? 'bg-blue-500/10 text-blue-600' :
                                                'bg-amber-500/10 text-amber-600'
                                            }>
                                                {item.statut}
                                            </Badge>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-none border-blue-500/20 bg-blue-500/5">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold flex items-center gap-2 text-blue-700">
                                <FileText className="size-4" /> Rappel
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs text-blue-800/80 leading-relaxed">
                            Les données validées ne peuvent plus être modifiées. Vérifiez attentivement avant de soumettre.
                            Les KPIs seront calculés automatiquement après soumission.
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

SaisieDonnees.layout = {
    breadcrumbs: [
        { title: 'Tableau de bord', href: dashboard() },
        { title: 'Saisie des données', href: '/succursale/saisie' },
    ],
};
