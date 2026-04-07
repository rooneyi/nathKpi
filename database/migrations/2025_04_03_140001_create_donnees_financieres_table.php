<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('donnees_financieres', function (Blueprint $table) {
            $table->id();
            $table->foreignId('succursale_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('periode'); // Mois de référence

            // Données financières de base
            $table->decimal('total_actif', 18, 2)->default(0);
            $table->decimal('total_passif', 18, 2)->default(0);
            $table->decimal('depots_collectes', 18, 2)->default(0);
            $table->decimal('credits_accordes', 18, 2)->default(0);
            $table->decimal('liquidites_disponibles', 18, 2)->default(0);
            $table->decimal('produits', 18, 2)->default(0); // Revenus
            $table->decimal('charges', 18, 2)->default(0); // Dépenses

            // Données de performance
            $table->decimal('produit_net_bancaire', 18, 2)->default(0); // PNB
            $table->decimal('resultat_net', 18, 2)->default(0);
            $table->decimal('cout_exploitation', 18, 2)->default(0);
            $table->decimal('fonds_propres', 18, 2)->default(0);

            // Données de risque
            $table->decimal('credits_douteux', 18, 2)->default(0);
            $table->decimal('total_credits', 18, 2)->default(0);

            // Données de conformité
            $table->boolean('respect_instructions')->default(false);
            $table->string('rapport_audit_path')->nullable(); // Fichier PDF uploadé

            // Données macro-financières locales
            $table->decimal('volume_transactions', 18, 2)->default(0);
            $table->enum('situation_liquidite', ['faible', 'moyenne', 'elevee'])->default('moyenne');
            $table->text('impact_politique_monetaire')->nullable();

            $table->enum('statut', ['brouillon', 'soumis', 'valide', 'rejete'])->default('brouillon');
            $table->timestamps();

            $table->unique(['succursale_id', 'periode']);
            $table->index(['periode', 'statut']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('donnees_financieres');
    }
};
