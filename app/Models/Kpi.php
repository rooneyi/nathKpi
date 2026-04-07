<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Kpi extends Model
{
    use HasFactory;

    protected $fillable = [
        'donnee_financiere_id',
        'succursale_id',
        'periode',
        'roe',
        'ratio_credits_depots',
        'marge_nette_interet',
        'coefficient_exploitation',
        'ratio_creances_douteuses',
        'ratio_liquidite',
        'score_performance',
        'classement',
        'alertes',
    ];

    protected $casts = [
        'periode' => 'date:Y-m-d',
        'roe' => 'decimal:4',
        'ratio_credits_depots' => 'decimal:4',
        'marge_nette_interet' => 'decimal:4',
        'coefficient_exploitation' => 'decimal:4',
        'ratio_creances_douteuses' => 'decimal:4',
        'ratio_liquidite' => 'decimal:4',
        'score_performance' => 'decimal:2',
        'classement' => 'integer',
        'alertes' => 'array',
    ];

    public function donneeFinanciere(): BelongsTo
    {
        return $this->belongsTo(DonneeFinanciere::class);
    }

    public function succursale(): BelongsTo
    {
        return $this->belongsTo(Succursale::class);
    }

    public static function calculerPourDonnee(DonneeFinanciere $donnee): self
    {
        $fondsPropres = $donnee->fonds_propres > 0 ? $donnee->fonds_propres : 1;
        $depots = $donnee->depots_collectes > 0 ? $donnee->depots_collectes : 1;
        $totalCredits = $donnee->total_credits > 0 ? $donnee->total_credits : 1;
        $produits = $donnee->produits > 0 ? $donnee->produits : 1;

        // Calculs des KPIs
        $roe = $donnee->resultat_net / $fondsPropres;
        $ratioCreditsDepots = $donnee->credits_accordes / $depots;
        $coefficientExploitation = $donnee->cout_exploitation / $produits;
        $ratioCreancesDouteuses = $donnee->credits_douteux / $totalCredits;
        $ratioLiquidite = $donnee->liquidites_disponibles / $depots;

        // Score de performance (0-100)
        $score = self::calculerScore($roe, $ratioCreditsDepots, $ratioCreancesDouteuses, $ratioLiquidite, $coefficientExploitation);

        // Détection des alertes
        $alertes = self::detecterAlertes($ratioCreancesDouteuses, $ratioLiquidite, $roe, $coefficientExploitation);

        return self::updateOrCreate(
            [
                'succursale_id' => $donnee->succursale_id,
                'periode' => $donnee->periode,
            ],
            [
                'donnee_financiere_id' => $donnee->id,
                'roe' => $roe,
                'ratio_credits_depots' => $ratioCreditsDepots,
                'marge_nette_interet' => $donnee->produit_net_bancaire / ($depots + $totalCredits),
                'coefficient_exploitation' => $coefficientExploitation,
                'ratio_creances_douteuses' => $ratioCreancesDouteuses,
                'ratio_liquidite' => $ratioLiquidite,
                'score_performance' => $score,
                'alertes' => $alertes,
            ]
        );
    }

    private static function calculerScore(float $roe, float $ratioCreditsDepots, float $ratioCreancesDouteuses, float $ratioLiquidite, float $coefficientExploitation): float
    {
        $score = 50; // Base

        // ROE positif = bonus
        if ($roe > 0.1) $score += 15;
        elseif ($roe > 0.05) $score += 10;
        elseif ($roe > 0) $score += 5;
        else $score -= 10;

        // Ratio crédits/dépôts optimal entre 0.6 et 0.8
        if ($ratioCreditsDepots >= 0.6 && $ratioCreditsDepots <= 0.8) $score += 10;
        elseif ($ratioCreditsDepots > 0.8) $score += 5;
        elseif ($ratioCreditsDepots < 0.5) $score -= 5;

        // Ratio créances douteuses < 5% = bon
        if ($ratioCreancesDouteuses < 0.05) $score += 15;
        elseif ($ratioCreancesDouteuses < 0.1) $score += 5;
        else $score -= 15;

        // Ratio liquidité > 20% = bon
        if ($ratioLiquidite > 0.2) $score += 10;
        elseif ($ratioLiquidite > 0.1) $score += 5;
        else $score -= 10;

        // Coefficient d'exploitation < 60% = bon
        if ($coefficientExploitation < 0.6) $score += 10;
        elseif ($coefficientExploitation > 0.8) $score -= 5;

        return max(0, min(100, $score));
    }

    private static function detecterAlertes(float $ratioCreancesDouteuses, float $ratioLiquidite, float $roe, float $coefficientExploitation): array
    {
        $alertes = [];

        if ($ratioCreancesDouteuses > 0.1) {
            $alertes[] = 'risque_eleve';
        }

        if ($ratioLiquidite < 0.1) {
            $alertes[] = 'liquidite_faible';
        }

        if ($roe < 0) {
            $alertes[] = 'rentabilite_negative';
        }

        if ($coefficientExploitation > 0.9) {
            $alertes[] = 'cout_exploitation_eleve';
        }

        return $alertes;
    }

    public function scopeMois($query, string $mois)
    {
        return $query->where('periode', $mois);
    }

    public function scopeAlertes($query)
    {
        return $query->whereNotNull('alertes')->where('alertes', '!=', '[]');
    }
}
