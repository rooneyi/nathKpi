<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Rapport extends Model
{
    use HasFactory;

    protected $fillable = [
        'succursale_id',
        'user_id',
        'periode_debut',
        'periode_fin',
        'type',
        'titre',
        'contenu',
        'fichier_path',
        'statut',
        'date_envoi',
    ];

    protected $casts = [
        'periode_debut' => 'date:Y-m-d',
        'periode_fin' => 'date:Y-m-d',
        'date_envoi' => 'datetime',
    ];

    public function succursale(): BelongsTo
    {
        return $this->belongsTo(Succursale::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeMensuel($query)
    {
        return $query->where('type', 'mensuel');
    }

    public function scopeAnnuel($query)
    {
        return $query->where('type', 'annuel');
    }

    public function scopeEnvoye($query)
    {
        return $query->where('statut', 'envoye');
    }
}
