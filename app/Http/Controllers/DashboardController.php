<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function dashboard() { return Inertia::render('dashboard'); }

    // Succursale
    public function succursaleSaisie() { return Inertia::render('succursale/saisie'); }
    public function succursaleRapports() { return Inertia::render('succursale/rapports'); }
    public function succursaleHistorique() { return Inertia::render('succursale/historique'); }

    // Siège Central
    public function siegeAnalyse() { return Inertia::render('siege/analyse'); }
    public function siegeSuccursales() { return Inertia::render('siege/succursales'); }
    public function siegeComparatif() { return Inertia::render('siege/comparatif'); }
    public function siegeRapports() { return Inertia::render('siege/rapports'); }

    // Administration
    public function adminSupervision() { return Inertia::render('admin/supervision'); }
}
