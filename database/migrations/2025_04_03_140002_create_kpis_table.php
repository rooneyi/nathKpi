<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kpis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('donnee_financiere_id')->nullable();
            $table->foreignId('succursale_id')->constrained()->onDelete('cascade');
            $table->date('periode');

            // KPI de performance
            $table->decimal('roe', 8, 4)->nullable(); // Résultat net / Fonds propres
            $table->decimal('ratio_credits_depots', 8, 4)->nullable(); // Crédits / Dépôts
            $table->decimal('marge_nette_interet', 8, 4)->nullable();
            $table->decimal('coefficient_exploitation', 8, 4)->nullable(); // Coût / Produit

            // KPI de risque
            $table->decimal('ratio_creances_douteuses', 8, 4)->nullable(); // Crédits douteux / Total crédits
            $table->decimal('ratio_liquidite', 8, 4)->nullable(); // Liquidités / Dépôts

            // KPI globaux
            $table->decimal('score_performance', 8, 2)->nullable(); // Score global 0-100
            $table->integer('classement')->nullable(); // Position parmi les succursales

            // Alertes
            $table->json('alertes')->nullable(); // ['risque_eleve', 'liquidite_faible', ...]

            $table->timestamps();

            $table->unique(['succursale_id', 'periode']);
            $table->index(['periode', 'score_performance']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kpis');
    }
};
