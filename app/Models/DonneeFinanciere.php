<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class DonneeFinanciere extends Model
{
    use HasFactory;

    protected $table = 'donnees_financieres';

    protected $fillable = [
        'succursale_id',
        'user_id',
        'periode',
        'total_actif',
        'total_passif',
        'depots_collectes',
        'credits_accordes',
        'liquidites_disponibles',
        'produits',
        'charges',
        'produit_net_bancaire',
        'resultat_net',
        'cout_exploitation',
        'fonds_propres',
        'credits_douteux',
        'total_credits',
        'respect_instructions',
        'rapport_audit_path',
        'volume_transactions',
        'situation_liquidite',
        'impact_politique_monetaire',
        'statut',
    ];

    protected $casts = [
        'periode' => 'date:Y-m-d',
        'total_actif' => 'decimal:2',
        'total_passif' => 'decimal:2',
        'depots_collectes' => 'decimal:2',
        'credits_accordes' => 'decimal:2',
        'liquidites_disponibles' => 'decimal:2',
        'produits' => 'decimal:2',
        'charges' => 'decimal:2',
        'produit_net_bancaire' => 'decimal:2',
        'resultat_net' => 'decimal:2',
        'cout_exploitation' => 'decimal:2',
        'fonds_propres' => 'decimal:2',
        'credits_douteux' => 'decimal:2',
        'total_credits' => 'decimal:2',
        'volume_transactions' => 'decimal:2',
        'respect_instructions' => 'boolean',
        'statut' => 'string',
    ];

    public function succursale(): BelongsTo
    {
        return $this->belongsTo(Succursale::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function kpi(): HasOne
    {
        return $this->hasOne(Kpi::class, 'donnee_financiere_id');
    }

    public function calculerKpi(): Kpi
    {
        return Kpi::calculerPourDonnee($this);
    }

    public function scopeSoumis($query)
    {
        return $query->where('statut', 'soumis');
    }

    public function scopeValide($query)
    {
        return $query->where('statut', 'valide');
    }

    public function scopeMois($query, string $mois)
    {
        return $query->where('periode', $mois);
    }
}
