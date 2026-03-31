<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ReportController;
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

    // Succursale
    Route::prefix('succursale')->name('succursale.')->group(function () {
        Route::get('saisie', [DashboardController::class, 'succursaleSaisie'])->name('saisie');
        Route::get('rapports', [DashboardController::class, 'succursaleRapports'])->name('rapports');
        Route::get('historique', [DashboardController::class, 'succursaleHistorique'])->name('historique');
    });

    // Siège Central
    Route::prefix('siege')->name('siege.')->group(function () {
        Route::get('analyse', [DashboardController::class, 'siegeAnalyse'])->name('analyse');
        Route::get('succursales', [DashboardController::class, 'siegeSuccursales'])->name('succursales');
        Route::get('comparatif', [DashboardController::class, 'siegeComparatif'])->name('comparatif');
        Route::get('rapports', [DashboardController::class, 'siegeRapports'])->name('rapports');
    });

    // Administration
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('supervision', [DashboardController::class, 'adminSupervision'])->name('supervision');
    });
});

require __DIR__.'/settings.php';
