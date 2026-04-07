<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rapports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('succursale_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('periode_debut');
            $table->date('periode_fin');
            $table->enum('type', ['mensuel', 'annuel', 'trimestriel'])->default('mensuel');
            $table->string('titre');
            $table->text('contenu')->nullable();
            $table->string('fichier_path')->nullable(); // PDF généré
            $table->enum('statut', ['brouillon', 'genere', 'envoye', 'valide'])->default('brouillon');
            $table->timestamp('date_envoi')->nullable();
            $table->timestamps();

            $table->index(['succursale_id', 'type', 'periode_debut']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rapports');
    }
};
