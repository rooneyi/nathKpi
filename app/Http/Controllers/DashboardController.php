<?php

namespace App\Http\Controllers;

use App\Models\DonneeFinanciere;
use App\Models\Kpi;
use App\Models\Succursale;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    public function dashboard(Request $request)
    {
        $user = $request->user();
        $moisActuel = Carbon::now()->format('Y-m-01');
        $moisPrecedent = Carbon::now()->subMonth()->format('Y-m-01');

        // Données communes
        $kpisGlobaux = $this->getKpisGlobaux($moisActuel);
        $evolution = $this->getEvolution($moisActuel, $moisPrecedent);
        $alertes = $this->getAlertes($moisActuel);

        // Données spécifiques selon le rôle
        $data = [
            'auth' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'role' => $user->role,
                ],
            ],
            'kpisGlobaux' => $kpisGlobaux,
            'evolution' => $evolution,
            'alertes' => $alertes,
            'moisActuel' => Carbon::now()->format('F Y'),
        ];

        // Vue spécifique selon le rôle
        if ($user->isSuccursale()) {
            return $this->dashboardSuccursale($request, $data, $moisActuel);
        } elseif ($user->isSiege()) {
            return $this->dashboardSiege($request, $data, $moisActuel, $moisPrecedent);
        } elseif ($user->isAdmin()) {
            return $this->dashboardAdmin($request, $data, $moisActuel);
        }

        return Inertia::render('dashboard', $data);
    }

    private function dashboardSuccursale(Request $request, array $data, string $moisActuel)
    {
        $user = $request->user();
        $succursale = $user->succursale;

        if (!$succursale) {
            return Inertia::render('succursale/dashboard', array_merge($data, [
                'succursale' => null,
                'mesDonnees' => null,
                'historique' => [],
                'attentions' => [],
            ]));
        }

        // Données de la succursale
        $maDonnee = DonneeFinanciere::where('succursale_id', $succursale->id)
            ->where('periode', $moisActuel)
            ->with('kpi')
            ->first();

        $historique = DonneeFinanciere::where('succursale_id', $succursale->id)
            ->with('kpi')
            ->orderBy('periode', 'desc')
            ->take(6)
            ->get()
            ->map(function ($donnee) {
                return [
                    'periode' => Carbon::parse($donnee->periode)->format('F Y'),
                    'resultat_net' => $donnee->resultat_net,
                    'depots' => $donnee->depots_collectes,
                    'credits' => $donnee->credits_accordes,
                    'score' => $donnee->kpi?->score_performance ?? 0,
                    'statut' => $donnee->statut,
                ];
            });

        $mesDonnees = null;
        if ($maDonnee) {
            $mesDonnees = [
                'resultat_net' => $maDonnee->resultat_net,
                'depots' => $maDonnee->depots_collectes,
                'credits' => $maDonnee->credits_accordes,
                'liquidites' => $maDonnee->liquidites_disponibles,
                'ratio_recouvrement' => $maDonnee->total_credits > 0
                    ? (1 - ($maDonnee->credits_douteux / $maDonnee->total_credits)) * 100
                    : 0,
                'roe' => $maDonnee->fonds_propres > 0
                    ? ($maDonnee->resultat_net / $maDonnee->fonds_propres) * 100
                    : 0,
                'kpi' => $maDonnee->kpi,
                'statut' => $maDonnee->statut,
            ];
        }

        return Inertia::render('succursale/dashboard', array_merge($data, [
            'succursale' => [
                'id' => $succursale->id,
                'nom' => $succursale->nom,
                'code' => $succursale->code,
                'ville' => $succursale->ville,
            ],
            'mesDonnees' => $mesDonnees,
            'historique' => $historique,
            'attentions' => $this->getAttentionsSuccursale($succursale->id, $moisActuel),
        ]));
    }

    private function dashboardSiege(Request $request, array $data, string $moisActuel, string $moisPrecedent)
    {
        // Vue consolidée pour le siège
        $succursales = Succursale::where('active', true)
            ->with(['kpis' => function ($query) use ($moisActuel) {
                $query->where('periode', $moisActuel);
            }])
            ->get()
            ->map(function ($succursale) {
                $kpi = $succursale->kpis->first();
                return [
                    'id' => $succursale->id,
                    'nom' => $succursale->nom,
                    'code' => $succursale->code,
                    'ville' => $succursale->ville,
                    'score' => $kpi?->score_performance ?? 0,
                    'alertes' => $kpi?->alertes ?? [],
                    'statut' => $this->getStatutFromScore($kpi?->score_performance ?? 0),
                ];
            })
            ->sortByDesc('score')
            ->values();

        // Rapports en attente de validation
        $rapportsEnAttente = DonneeFinanciere::with(['succursale', 'user'])
            ->where('statut', 'soumis')
            ->orderBy('updated_at', 'desc')
            ->take(10)
            ->get()
            ->map(function ($donnee) {
                return [
                    'id' => $donnee->id,
                    'succursale' => $donnee->succursale->nom,
                    'periode' => Carbon::parse($donnee->periode)->format('F Y'),
                    'date' => $donnee->updated_at->format('d/m/Y'),
                    'statut' => $donnee->statut,
                ];
            });

        // Statistiques globales
        $statsGlobales = $this->getStatsGlobales($moisActuel);

        return Inertia::render('siege/dashboard', array_merge($data, [
            'succursales' => $succursales,
            'rapportsEnAttente' => $rapportsEnAttente,
            'statsGlobales' => $statsGlobales,
            'comparatifMensuel' => $this->getComparatifMensuel($moisActuel, $moisPrecedent),
        ]));
    }

    private function dashboardAdmin(Request $request, array $data, string $moisActuel)
    {
        // Supervision complète pour l'admin
        $statsSysteme = [
            'total_succursales' => Succursale::count(),
            'succursales_actives' => Succursale::where('active', true)->count(),
            'total_utilisateurs' => User::count(),
            'donnees_mois' => DonneeFinanciere::where('periode', $moisActuel)->count(),
            'donnees_validees' => DonneeFinanciere::where('periode', $moisActuel)->where('statut', 'valide')->count(),
        ];

        $derniersUtilisateurs = User::with('succursale')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'succursale' => $user->succursale?->nom,
                ];
            });

        $activitesRecentes = DonneeFinanciere::with(['succursale', 'user'])
            ->orderBy('updated_at', 'desc')
            ->take(10)
            ->get()
            ->map(function ($donnee) {
                return [
                    'type' => 'donnee_' . $donnee->statut,
                    'succursale' => $donnee->succursale->nom,
                    'utilisateur' => $donnee->user->name,
                    'date' => $donnee->updated_at->format('d/m/Y H:i'),
                ];
            });

        return Inertia::render('admin/dashboard', array_merge($data, [
            'statsSysteme' => $statsSysteme,
            'derniersUtilisateurs' => $derniersUtilisateurs,
            'activitesRecentes' => $activitesRecentes,
            'alertesCritiques' => $this->getAlertesCritiques($moisActuel),
        ]));
    }

    private function getAttentionsSuccursale(int $succursaleId, string $mois): array
    {
        $kpi = Kpi::where('succursale_id', $succursaleId)
            ->where('periode', $mois)
            ->first();

        $attentions = [];

        if (!$kpi) {
            return [['type' => 'info', 'message' => 'Aucune donnée saisie pour ce mois']];
        }

        if ($kpi->alertes && count($kpi->alertes) > 0) {
            foreach ($kpi->alertes as $alerte) {
                $attentions[] = [
                    'type' => 'warning',
                    'message' => $this->getMessageAlerte($alerte),
                ];
            }
        }

        if ($kpi->score_performance < 70) {
            $attentions[] = [
                'type' => 'danger',
                'message' => 'Score de performance faible (' . round($kpi->score_performance, 1) . '%)',
            ];
        }

        return $attentions;
    }

    private function getMessageAlerte(string $alerte): string
    {
        return match($alerte) {
            'risque_eleve' => 'Risque élevé : créances douteuses importantes',
            'liquidite_faible' => 'Liquidité faible : besoin de surveillance',
            'rentabilite_negative' => 'Rentabilité négative ce mois',
            'cout_exploitation_eleve' => 'Coût d\'exploitation élevé',
            default => 'Alerte : ' . $alerte,
        };
    }

    private function getStatsGlobales(string $mois): array
    {
        $donnees = DonneeFinanciere::where('periode', $mois)
            ->whereIn('statut', ['soumis', 'valide'])
            ->get();

        return [
            'resultat_net_total' => $donnees->sum('resultat_net'),
            'depots_total' => $donnees->sum('depots_collectes'),
            'credits_total' => $donnees->sum('credits_accordes'),
            'nombre_succursales' => $donnees->unique('succursale_id')->count(),
        ];
    }

    private function getComparatifMensuel(string $moisActuel, string $moisPrecedent): array
    {
        $kpisActuels = Kpi::where('periode', $moisActuel)->get();
        $kpisPrecedents = Kpi::where('periode', $moisPrecedent)->get();

        return [
            'score_moyen_actuel' => $kpisActuels->avg('score_performance') ?? 0,
            'score_moyen_precedent' => $kpisPrecedents->avg('score_performance') ?? 0,
            'nb_alertes_actuel' => $kpisActuels->filter(fn($k) => !empty($k->alertes))->count(),
            'nb_alertes_precedent' => $kpisPrecedents->filter(fn($k) => !empty($k->alertes))->count(),
        ];
    }

    private function getAlertesCritiques(string $mois): array
    {
        return Kpi::where('periode', $mois)
            ->where('score_performance', '<', 50)
            ->with('succursale')
            ->get()
            ->map(function ($kpi) {
                return [
                    'succursale' => $kpi->succursale->nom,
                    'score' => $kpi->score_performance,
                    'alertes' => $kpi->alertes ?? [],
                ];
            })
            ->toArray();
    }

    private function getKpisGlobaux(string $mois): array
    {
        $donnees = DonneeFinanciere::where('periode', $mois)
            ->whereIn('statut', ['soumis', 'valide'])
            ->get();

        if ($donnees->isEmpty()) {
            return [
                'resultat_net' => 0,
                'depots_clients' => 0,
                'credits_accordes' => 0,
                'taux_recouvrement' => 0,
            ];
        }

        $resultatNet = $donnees->sum('resultat_net');
        $depots = $donnees->sum('depots_collectes');
        $credits = $donnees->sum('credits_accordes');
        $creditsDouteux = $donnees->sum('credits_douteux');
        $totalCredits = $donnees->sum('total_credits');

        $tauxRecouvrement = $totalCredits > 0
            ? (1 - ($creditsDouteux / $totalCredits)) * 100
            : 0;

        return [
            'resultat_net' => $resultatNet,
            'depots_clients' => $depots,
            'credits_accordes' => $credits,
            'taux_recouvrement' => round($tauxRecouvrement, 1),
        ];
    }

    private function getEvolution(string $moisActuel, string $moisPrecedent): array
    {
        $donneesActuel = DonneeFinanciere::where('periode', $moisActuel)
            ->whereIn('statut', ['soumis', 'valide'])
            ->get();

        $donneesPrecedent = DonneeFinanciere::where('periode', $moisPrecedent)
            ->whereIn('statut', ['soumis', 'valide'])
            ->get();

        $resultatActuel = $donneesActuel->sum('resultat_net');
        $resultatPrecedent = $donneesPrecedent->sum('resultat_net');
        $evolutionResultat = $resultatPrecedent > 0
            ? (($resultatActuel - $resultatPrecedent) / $resultatPrecedent) * 100
            : 0;

        $depotsActuel = $donneesActuel->sum('depots_collectes');
        $depotsPrecedent = $donneesPrecedent->sum('depots_collectes');
        $evolutionDepots = $depotsPrecedent > 0
            ? (($depotsActuel - $depotsPrecedent) / $depotsPrecedent) * 100
            : 0;

        $creditsActuel = $donneesActuel->sum('credits_accordes');
        $creditsPrecedent = $donneesPrecedent->sum('credits_accordes');
        $evolutionCredits = $creditsPrecedent > 0
            ? (($creditsActuel - $creditsPrecedent) / $creditsPrecedent) * 100
            : 0;

        $creditsDouteuxActuel = $donneesActuel->sum('credits_douteux');
        $totalCreditsActuel = $donneesActuel->sum('total_credits');
        $tauxActuel = $totalCreditsActuel > 0 ? ($creditsDouteuxActuel / $totalCreditsActuel) * 100 : 0;

        $creditsDouteuxPrecedent = $donneesPrecedent->sum('credits_douteux');
        $totalCreditsPrecedent = $donneesPrecedent->sum('total_credits');
        $tauxPrecedent = $totalCreditsPrecedent > 0 ? ($creditsDouteuxPrecedent / $totalCreditsPrecedent) * 100 : 0;

        $evolutionRecouvrement = $tauxPrecedent > 0
            ? ((100 - $tauxActuel) - (100 - $tauxPrecedent))
            : 0;

        return [
            'resultat_net' => round($evolutionResultat, 1),
            'depots' => round($evolutionDepots, 1),
            'credits' => round($evolutionCredits, 1),
            'recouvrement' => round($evolutionRecouvrement, 1),
        ];
    }

    private function getAlertes(string $mois): array
    {
        return Kpi::where('periode', $mois)
            ->whereNotNull('alertes')
            ->where('alertes', '!=', '[]')
            ->with('succursale')
            ->get()
            ->flatMap(function ($kpi) {
                return collect($kpi->alertes)->map(function ($alerte) use ($kpi) {
                    return [
                        'type' => $alerte,
                        'succursale' => $kpi->succursale->nom,
                        'score' => $kpi->score_performance,
                    ];
                });
            })
            ->take(5)
            ->toArray();
    }

    private function getStatutFromScore(float $score): string
    {
        if ($score >= 85) return 'Conforme';
        if ($score >= 70) return 'En attente';
        return 'Non conforme';
    }

    public function succursaleSaisie() { return app(DonneeFinanciereController::class)->saisie(request()); }
    public function succursaleRapports() { return Inertia::render('succursale/rapports'); }
    public function succursaleHistorique() { return app(DonneeFinanciereController::class)->historique(request()); }

    public function siegeAnalyse(Request $request)
    {
        $moisActuel = Carbon::now()->format('Y-m-01');
        $periodes = [];
        for ($i = 5; $i >= 0; $i--) {
            $periodes[] = Carbon::now()->subMonths($i)->format('Y-m-01');
        }

        // Évolution des KPIs sur 6 mois
        $evolutionKpis = [];
        foreach ($periodes as $periode) {
            $kpis = Kpi::where('periode', $periode)->get();
            $evolutionKpis[] = [
                'periode' => Carbon::parse($periode)->format('F Y'),
                'score_moyen' => $kpis->avg('score_performance') ?? 0,
                'roe_moyen' => $kpis->avg('roe') ?? 0,
                'nombre_succursales' => $kpis->count(),
            ];
        }

        // Distribution des scores
        $scoresDistribution = [
            'excellent' => Kpi::where('periode', $moisActuel)->where('score_performance', '>=', 85)->count(),
            'bon' => Kpi::where('periode', $moisActuel)->whereBetween('score_performance', [70, 84.99])->count(),
            'a_surveiller' => Kpi::where('periode', $moisActuel)->whereBetween('score_performance', [50, 69.99])->count(),
            'critique' => Kpi::where('periode', $moisActuel)->where('score_performance', '<', 50)->count(),
        ];

        // Top 5 et Flop 5
        $allKpis = Kpi::where('periode', $moisActuel)->with('succursale')->get()->sortByDesc('score_performance');
        $top5 = $allKpis->take(5)->map(fn($k) => ['nom' => $k->succursale->nom, 'score' => $k->score_performance]);
        $flop5 = $allKpis->sortBy('score_performance')->take(5)->map(fn($k) => ['nom' => $k->succursale->nom, 'score' => $k->score_performance]);

        return Inertia::render('siege/analyse', [
            'evolutionKpis' => $evolutionKpis,
            'scoresDistribution' => $scoresDistribution,
            'top5' => $top5,
            'flop5' => $flop5,
            'moisActuel' => Carbon::now()->format('F Y'),
        ]);
    }

    public function siegeSuccursales(Request $request)
    {
        $moisActuel = Carbon::now()->format('Y-m-01');

        $succursales = Succursale::where('active', true)
            ->with(['kpis' => fn($q) => $q->where('periode', $moisActuel)])
            ->withCount(['donneesFinancieres as donnees_count'])
            ->get()
            ->map(function ($s) use ($moisActuel) {
                $kpi = $s->kpis->first();
                $derniereDonnee = $s->donneesFinancieres()->orderBy('periode', 'desc')->first();

                return [
                    'id' => $s->id,
                    'nom' => $s->nom,
                    'code' => $s->code,
                    'ville' => $s->ville,
                    'adresse' => $s->adresse,
                    'telephone' => $s->telephone,
                    'email' => $s->email,
                    'score' => $kpi?->score_performance ?? 0,
                    'alertes' => $kpi?->alertes ?? [],
                    'statut' => $this->getStatutFromScore($kpi?->score_performance ?? 0),
                    'derniere_saisie' => $derniereDonnee?->periode ? Carbon::parse($derniereDonnee->periode)->format('F Y') : null,
                    'total_donnees' => $s->donnees_count ?? 0,
                ];
            });

        return Inertia::render('siege/succursales', [
            'succursales' => $succursales,
            'moisActuel' => Carbon::now()->format('F Y'),
        ]);
    }

    public function siegeComparatif(Request $request)
    {
        $periode = $request->input('periode', Carbon::now()->format('Y-m-01'));

        $succursales = Succursale::where('active', true)
            ->with(['kpis' => fn($q) => $q->where('periode', $periode)])
            ->get()
            ->map(function ($s) {
                $kpi = $s->kpis->first();
                return [
                    'id' => $s->id,
                    'nom' => $s->nom,
                    'code' => $s->code,
                    'score' => $kpi?->score_performance ?? 0,
                    'roe' => $kpi?->roe ?? 0,
                    'ratio_credits_depots' => $kpi?->ratio_credits_depots ?? 0,
                    'ratio_creances_douteuses' => $kpi?->ratio_creances_douteuses ?? 0,
                    'ratio_produit_total' => $kpi?->ratio_produit_total_actif ?? 0,
                    'ratio_fonds_propres' => $kpi?->ratio_fonds_propres_actifs ?? 0,
                    'alertes' => $kpi?->alertes ?? [],
                ];
            })
            ->sortByDesc('score')
            ->values();

        // Moyennes globales
        $moyennes = [
            'score' => $succursales->avg('score'),
            'roe' => $succursales->avg('roe'),
            'ratio_credits_depots' => $succursales->avg('ratio_credits_depots'),
            'ratio_creances_douteuses' => $succursales->avg('ratio_creances_douteuses'),
        ];

        return Inertia::render('siege/comparatif', [
            'succursales' => $succursales,
            'moyennes' => $moyennes,
            'periode' => Carbon::parse($periode)->format('F Y'),
            'periodesDisponibles' => DonneeFinanciere::distinct('periode')->orderBy('periode', 'desc')->pluck('periode')->map(fn($p) => ['value' => $p, 'label' => Carbon::parse($p)->format('F Y')]),
        ]);
    }

    public function siegeRapports() { return Inertia::render('siege/rapports'); }
    public function adminSupervision() { return Inertia::render('admin/supervision'); }
    public function adminUtilisateurs() { return Inertia::render('admin/utilisateurs'); }
    public function adminParametres() { return Inertia::render('admin/parametres'); }
}
