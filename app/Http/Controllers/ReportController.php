<?php

namespace App\Http\Controllers;

use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    /**
     * Génère un rapport KPI au format PDF.
     */
    public function generateKpiPdf(Request $request)
    {
        $data = [
            'branch' => $request->get('branch', 'Kinshasa Centre'),
            'period' => $request->get('period', 'Mars 2026'),
            'date' => date('d/m/Y'),
        ];

        $pdf = Pdf::loadView('reports.kpi', $data);

        // On définit le nom du fichier
        $filename = 'Rapport_KPI_' . str_replace(' ', '_', $data['branch']) . '_' . date('Ymd') . '.pdf';

        return $pdf->download($filename);
    }
}
