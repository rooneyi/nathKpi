<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('donnees_financieres', function (Blueprint $table) {
            $table->foreignId('validated_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('validated_at')->nullable();
            $table->text('rejet_motif')->nullable();
            $table->foreignId('rejet_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('rejet_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('donnees_financieres', function (Blueprint $table) {
            $table->dropForeign(['validated_by']);
            $table->dropForeign(['rejet_by']);
            $table->dropColumn(['validated_by', 'validated_at', 'rejet_motif', 'rejet_by', 'rejet_at']);
        });
    }
};
