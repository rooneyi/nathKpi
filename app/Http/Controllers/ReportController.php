<?php

namespace App\Http\Controllers;

use App\Models\Succursale;
use App\Models\Kpi;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class ReportController extends Controller
{
    /**
     * Génère un rapport KPI au format PDF.
     */
    public function generateKpiPdf(Request $request)
    {
        // Période sélectionnée (format attendu: YYYY-MM-01, comme dans les dashboards)
        $periodParam = $request->get('period');
        $periode = $periodParam ?: Carbon::now()->format('Y-m-01');

        // Libellé humain (ex: Mars 2026)
        $periodeLabel = Carbon::parse($periode)->translatedFormat('F Y');

        // Récupération des KPI par succursale pour la période
        $succursales = Succursale::where('active', true)
            ->with(['kpis' => function ($query) use ($periode) {
                $query->where('periode', $periode);
            }])
            ->get()
            ->map(function ($succursale) {
                $kpi = $succursale->kpis->first();

                return [
                    'nom' => $succursale->nom,
                    'ville' => $succursale->ville,
                    'code' => $succursale->code,
                    'score' => (float) ($kpi->score_performance ?? 0),
                    'roe' => (float) ($kpi->roe ?? 0),
                    'ratio_credits_depots' => (float) ($kpi->ratio_credits_depots ?? 0),
                    'ratio_creances_douteuses' => (float) ($kpi->ratio_creances_douteuses ?? 0),
                    'alertes' => $kpi->alertes ?? [],
                ];
            })
            ->sortByDesc('score')
            ->values();

        // Synthèse globale simple
        $scoreMoyen = $succursales->avg('score') ?? 0;

        $data = [
            'periode' => $periodeLabel,
            'dateGeneration' => Carbon::now()->format('d/m/Y'),
            'type' => $request->get('type', 'synthese'),
            'succursales' => $succursales,
            'scoreMoyen' => round($scoreMoyen, 1),
        ];

        $pdf = Pdf::loadView('reports.kpi', $data);

        $filename = 'Rapport_KPI_Reseau_' . Carbon::now()->format('Ymd') . '.pdf';

        return $pdf->download($filename);
    }
}
