<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DonneeFinanciereController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/reports/generate-pdf', [ReportController::class, 'generateKpiPdf'])->name('reports.generate-pdf');
});

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'dashboard'])->name('dashboard');

    // Succursale - uniquement pour les utilisateurs succursale
    Route::prefix('succursale')->name('succursale.')->middleware('role:succursale')->group(function () {
        Route::get('saisie', [DonneeFinanciereController::class, 'saisie'])->name('saisie');
        Route::post('saisie', [DonneeFinanciereController::class, 'store'])->name('store');
        Route::get('saisie/{id}/edit', [DonneeFinanciereController::class, 'edit'])->name('saisie.edit');
        Route::put('saisie/{id}', [DonneeFinanciereController::class, 'update'])->name('saisie.update');
        Route::get('rapports', [DashboardController::class, 'succursaleRapports'])->name('rapports');
        Route::get('historique', [DonneeFinanciereController::class, 'historique'])->name('historique');
    });

    // Siège Central - uniquement pour le siège
    Route::prefix('siege')->name('siege.')->middleware('role:siege,admin')->group(function () {
        Route::get('analyse', [DashboardController::class, 'siegeAnalyse'])->name('analyse');
        Route::get('succursales', [DashboardController::class, 'siegeSuccursales'])->name('succursales');
        Route::get('comparatif', [DashboardController::class, 'siegeComparatif'])->name('comparatif');
        Route::get('rapports', [DashboardController::class, 'siegeRapports'])->name('rapports');
        Route::get('validation', [DonneeFinanciereController::class, 'listeSoumissions'])->name('validation');
        Route::post('valider/{id}', [DonneeFinanciereController::class, 'valider'])->name('valider');
        Route::post('rejeter/{id}', [DonneeFinanciereController::class, 'rejeter'])->name('rejeter');
    });

    // Administration - uniquement pour les admins
    Route::prefix('admin')->name('admin.')->middleware('role:admin')->group(function () {
        Route::get('supervision', [DashboardController::class, 'adminSupervision'])->name('supervision');
        Route::get('utilisateurs', [UserController::class, 'index'])->name('utilisateurs');
        Route::post('utilisateurs', [UserController::class, 'store'])->name('utilisateurs.store');
        Route::put('utilisateurs/{id}', [UserController::class, 'update'])->name('utilisateurs.update');
        Route::delete('utilisateurs/{id}', [UserController::class, 'destroy'])->name('utilisateurs.destroy');
        Route::post('utilisateurs/{id}/toggle', [UserController::class, 'toggleActive'])->name('utilisateurs.toggle');
        Route::get('parametres', [DashboardController::class, 'adminParametres'])->name('parametres');
        Route::post('parametres', [DashboardController::class, 'adminParametresUpdate'])->name('parametres.update');
    });
});

require __DIR__.'/settings.php';
