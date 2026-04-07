<?php

namespace App\Http\Controllers;

use App\Models\DonneeFinanciere;
use App\Models\Kpi;
use App\Models\Succursale;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Carbon;

class DonneeFinanciereController extends Controller
{
    /**
     * Affiche le formulaire de saisie pour la succursale.
     */
    public function saisie(Request $request)
    {
        $user = $request->user();
        $succursale = $user->succursale;

        if (!$succursale) {
            return redirect()->route('dashboard')->with('error', 'Vous n\'êtes associé à aucune succursale.');
        }

        // Mois actuel par défaut
        $moisActuel = Carbon::now()->format('Y-m-01');

        // Récupérer les données existantes pour ce mois
        $donnee = DonneeFinanciere::where('succursale_id', $succursale->id)
            ->where('periode', $moisActuel)
            ->first();

        // Récupérer l'historique des 6 derniers mois
        $historique = DonneeFinanciere::where('succursale_id', $succursale->id)
            ->where('periode', '<=', $moisActuel)
            ->orderBy('periode', 'desc')
            ->take(6)
            ->with('kpi')
            ->get();

        return Inertia::render('succursale/saisie', [
            'succursale' => $succursale,
            'donnee' => $donnee,
            'moisActuel' => $moisActuel,
            'historique' => $historique,
        ]);
    }

    /**
     * Enregistre ou met à jour les données financières.
     */
    public function store(Request $request)
    {
        $user = $request->user();
        $succursale = $user->succursale;

        if (!$succursale) {
            return redirect()->back()->with('error', 'Vous n\'êtes associé à aucune succursale.');
        }

        $validated = $request->validate([
            'periode' => 'required|date',
            'total_actif' => 'required|numeric|min:0',
            'total_passif' => 'required|numeric|min:0',
            'depots_collectes' => 'required|numeric|min:0',
            'credits_accordes' => 'required|numeric|min:0',
            'liquidites_disponibles' => 'required|numeric|min:0',
            'produits' => 'required|numeric|min:0',
            'charges' => 'required|numeric|min:0',
            'produit_net_bancaire' => 'required|numeric',
            'resultat_net' => 'required|numeric',
            'cout_exploitation' => 'required|numeric|min:0',
            'fonds_propres' => 'required|numeric|min:0',
            'credits_douteux' => 'required|numeric|min:0',
            'total_credits' => 'required|numeric|min:0',
            'respect_instructions' => 'boolean',
            'rapport_audit' => 'nullable|file|mimes:pdf|max:10240',
            'volume_transactions' => 'required|numeric|min:0',
            'situation_liquidite' => 'required|in:faible,moyenne,elevee',
            'impact_politique_monetaire' => 'nullable|string',
            'action' => 'required|in:save,submit',
        ]);

        // Gestion du fichier PDF
        $rapportAuditPath = null;
        if ($request->hasFile('rapport_audit')) {
            $rapportAuditPath = $request->file('rapport_audit')->store('rapports_audit', 'public');
        }

        // Créer ou mettre à jour les données
        $donnee = DonneeFinanciere::updateOrCreate(
            [
                'succursale_id' => $succursale->id,
                'periode' => $validated['periode'],
            ],
            [
                'user_id' => $user->id,
                'total_actif' => $validated['total_actif'],
                'total_passif' => $validated['total_passif'],
                'depots_collectes' => $validated['depots_collectes'],
                'credits_accordes' => $validated['credits_accordes'],
                'liquidites_disponibles' => $validated['liquidites_disponibles'],
                'produits' => $validated['produits'],
                'charges' => $validated['charges'],
                'produit_net_bancaire' => $validated['produit_net_bancaire'],
                'resultat_net' => $validated['resultat_net'],
                'cout_exploitation' => $validated['cout_exploitation'],
                'fonds_propres' => $validated['fonds_propres'],
                'credits_douteux' => $validated['credits_douteux'],
                'total_credits' => $validated['total_credits'],
                'respect_instructions' => $validated['respect_instructions'] ?? false,
                'volume_transactions' => $validated['volume_transactions'],
                'situation_liquidite' => $validated['situation_liquidite'],
                'impact_politique_monetaire' => $validated['impact_politique_monetaire'] ?? null,
                'statut' => $validated['action'] === 'submit' ? 'soumis' : 'brouillon',
            ]
        );

        // Mettre à jour le chemin du rapport si un nouveau fichier a été uploadé
        if ($rapportAuditPath) {
            $donnee->rapport_audit_path = $rapportAuditPath;
            $donnee->save();
        }

        // Calculer automatiquement les KPIs
        $kpi = Kpi::calculerPourDonnee($donnee);

        $message = $validated['action'] === 'submit'
            ? 'Données soumises avec succès. Les KPIs ont été calculés.'
            : 'Données enregistrées en brouillon.';

        return redirect()->back()->with('success', $message);
    }

    /**
     * Affiche l'historique des données de la succursale.
     */
    public function historique(Request $request)
    {
        $user = $request->user();
        $succursale = $user->succursale;

        if (!$succursale) {
            return redirect()->route('dashboard')->with('error', 'Vous n\'êtes associé à aucune succursale.');
        }

        $donnees = DonneeFinanciere::where('succursale_id', $succursale->id)
            ->orderBy('periode', 'desc')
            ->with('kpi')
            ->paginate(12);

        return Inertia::render('succursale/historique', [
            'succursale' => $succursale,
            'donnees' => $donnees,
        ]);
    }

    /**
     * Modification d'une donnée existante (si statut = brouillon).
     */
    public function edit(Request $request, int $id)
    {
        $user = $request->user();
        $succursale = $user->succursale;

        $donnee = DonneeFinanciere::where('id', $id)
            ->where('succursale_id', $succursale?->id)
            ->firstOrFail();

        // Vérifier que la donnée peut être modifiée
        if ($donnee->statut === 'valide') {
            return redirect()->back()->with('error', 'Les données validées ne peuvent pas être modifiées.');
        }

        return Inertia::render('succursale/edit', [
            'succursale' => $succursale,
            'donnee' => $donnee,
        ]);
    }

    /**
     * Liste les données soumises en attente de validation pour le siège.
     */
    public function listeSoumissions(Request $request)
    {
        $query = DonneeFinanciere::with(['succursale', 'user'])
            ->where('statut', 'soumis');

        if ($request->filled('succursale_id')) {
            $query->where('succursale_id', $request->input('succursale_id'));
        }

        if ($request->filled('periode')) {
            $query->where('periode', $request->input('periode'));
        }

        $donnees = $query->orderBy('updated_at', 'desc')->paginate(15)->through(function ($donnee) {
            return [
                'id' => $donnee->id,
                'succursale' => $donnee->succursale?->nom,
                'periode' => $donnee->periode,
                'resultat_net' => $donnee->resultat_net,
                'depots_collectes' => $donnee->depots_collectes,
                'credits_accordes' => $donnee->credits_accordes,
                'statut' => $donnee->statut,
                'updated_at' => $donnee->updated_at?->format('d/m/Y H:i'),
            ];
        });

        return Inertia::render('siege/validation', [
            'donnees' => $donnees,
        ]);
    }

    /**
     * Met à jour une donnée existante (réservé à la succursale propriétaire).
     */
    public function update(Request $request, int $id)
    {
        $user = $request->user();
        $succursale = $user->succursale;

        if (!$succursale) {
            return redirect()->back()->with('error', 'Vous n\'êtes associé à aucune succursale.');
        }

        $donnee = DonneeFinanciere::where('id', $id)
            ->where('succursale_id', $succursale->id)
            ->firstOrFail();

        if ($donnee->statut === 'valide') {
            return redirect()->back()->with('error', 'Les données validées ne peuvent pas être modifiées.');
        }

        $validated = $request->validate([
            'periode' => 'required|date',
            'total_actif' => 'required|numeric|min:0',
            'total_passif' => 'required|numeric|min:0',
            'depots_collectes' => 'required|numeric|min:0',
            'credits_accordes' => 'required|numeric|min:0',
            'liquidites_disponibles' => 'required|numeric|min:0',
            'produits' => 'required|numeric|min:0',
            'charges' => 'required|numeric|min:0',
            'produit_net_bancaire' => 'required|numeric',
            'resultat_net' => 'required|numeric',
            'cout_exploitation' => 'required|numeric|min:0',
            'fonds_propres' => 'required|numeric|min:0',
            'credits_douteux' => 'required|numeric|min:0',
            'total_credits' => 'required|numeric|min:0',
            'respect_instructions' => 'boolean',
            'rapport_audit' => 'nullable|file|mimes:pdf|max:10240',
            'volume_transactions' => 'required|numeric|min:0',
            'situation_liquidite' => 'required|in:faible,moyenne,elevee',
            'impact_politique_monetaire' => 'nullable|string',
            'action' => 'required|in:save,submit',
        ]);

        // Gestion du fichier PDF
        if ($request->hasFile('rapport_audit')) {
            $rapportAuditPath = $request->file('rapport_audit')->store('rapports_audit', 'public');
            $donnee->rapport_audit_path = $rapportAuditPath;
        }

        $donnee->fill([
            'user_id' => $user->id,
            'periode' => $validated['periode'],
            'total_actif' => $validated['total_actif'],
            'total_passif' => $validated['total_passif'],
            'depots_collectes' => $validated['depots_collectes'],
            'credits_accordes' => $validated['credits_accordes'],
            'liquidites_disponibles' => $validated['liquidites_disponibles'],
            'produits' => $validated['produits'],
            'charges' => $validated['charges'],
            'produit_net_bancaire' => $validated['produit_net_bancaire'],
            'resultat_net' => $validated['resultat_net'],
            'cout_exploitation' => $validated['cout_exploitation'],
            'fonds_propres' => $validated['fonds_propres'],
            'credits_douteux' => $validated['credits_douteux'],
            'total_credits' => $validated['total_credits'],
            'respect_instructions' => $validated['respect_instructions'] ?? false,
            'volume_transactions' => $validated['volume_transactions'],
            'situation_liquidite' => $validated['situation_liquidite'],
            'impact_politique_monetaire' => $validated['impact_politique_monetaire'] ?? null,
            'statut' => $validated['action'] === 'submit' ? 'soumis' : 'brouillon',
        ]);

        $donnee->save();

        // Recalculer les KPIs
        $kpi = Kpi::calculerPourDonnee($donnee);

        $message = $validated['action'] === 'submit'
            ? 'Données mises à jour et soumises avec succès. Les KPIs ont été recalculés.'
            : 'Données mises à jour en brouillon.';

        return redirect()->route('succursale.historique')->with('success', $message);
    }

    /**
     * Valider une donnée financière (réservé au siège).
     */
    public function valider(Request $request, int $id)
    {
        $user = $request->user();

        // Vérifier que l'utilisateur a le rôle siège ou admin
        if (!$user->isSiege() && !$user->isAdmin()) {
            return redirect()->back()->with('error', 'Vous n\'avez pas les permissions pour valider des données.');
        }

        $donnee = DonneeFinanciere::findOrFail($id);

        // Vérifier que la donnée est bien soumise
        if ($donnee->statut !== 'soumis') {
            return redirect()->back()->with('error', 'Seules les données soumises peuvent être validées.');
        }

        $donnee->update([
            'statut' => 'valide',
            'validated_by' => $user->id,
            'validated_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Données validées avec succès pour ' . $donnee->succursale->nom . ' (' . Carbon::parse($donnee->periode)->format('F Y') . ').');
    }

    /**
     * Rejeter une donnée financière (réservé au siège).
     */
    public function rejeter(Request $request, int $id)
    {
        $user = $request->user();

        if (!$user->isSiege() && !$user->isAdmin()) {
            return redirect()->back()->with('error', 'Vous n\'avez pas les permissions pour rejeter des données.');
        }

        $donnee = DonneeFinanciere::findOrFail($id);

        if ($donnee->statut !== 'soumis') {
            return redirect()->back()->with('error', 'Seules les données soumises peuvent être rejetées.');
        }

        $request->validate([
            'motif' => 'required|string|max:500',
        ]);

        $donnee->update([
            'statut' => 'brouillon',
            'rejet_motif' => $request->motif,
            'rejet_by' => $user->id,
            'rejet_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Données rejetées. La succursale a été notifiée.');
    }
}
