<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Succursale extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'code',
        'ville',
        'adresse',
        'telephone',
        'email',
        'active',
    ];

    protected $casts = [
        'active' => 'boolean',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function donneesFinancieres(): HasMany
    {
        return $this->hasMany(DonneeFinanciere::class);
    }

    public function kpis(): HasMany
    {
        return $this->hasMany(Kpi::class);
    }

    public function rapports(): HasMany
    {
        return $this->hasMany(Rapport::class);
    }

    public function donneeFinanciereMois(string $mois): ?DonneeFinanciere
    {
        return $this->donneesFinancieres()
            ->where('periode', $mois)
            ->first();
    }
}
