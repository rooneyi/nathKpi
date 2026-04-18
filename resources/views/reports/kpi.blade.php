<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Rapport KPI - Réseau</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; }
        h1, h2, h3 { margin: 0 0 8px 0; }
        .header { text-align: center; margin-bottom: 20px; }
        .small { font-size: 11px; color: #555; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ccc; padding: 4px 6px; }
        th { background: #f3f3f3; font-weight: bold; font-size: 11px; text-transform: uppercase; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Rapport KPI - Réseau</h1>
        <div class="small">
            Période : {{ $periode ?? '-' }}<br>
            Date de génération : {{ $dateGeneration ?? now()->format('d/m/Y') }}
        </div>
    </div>

    <h2>Synthèse globale</h2>
    <table>
        <tr>
            <th class="text-left">Indicateur</th>
            <th class="text-right">Valeur</th>
        </tr>
        <tr>
            <td>Score moyen du réseau</td>
            <td class="text-right">{{ number_format($scoreMoyen ?? 0, 1, ',', ' ') }} %</td>
        </tr>
        <tr>
            <td>Nombre de succursales actives</td>
            <td class="text-right">{{ isset($succursales) ? count($succursales) : 0 }}</td>
        </tr>
    </table>

    <h2 style="margin-top:18px;">Détail par succursale</h2>
    @if(!empty($succursales) && count($succursales) > 0)
        <table>
            <thead>
                <tr>
                    <th>Succursale</th>
                    <th>Ville</th>
                    <th>Code</th>
                    <th class="text-right">Score (%)</th>
                    <th class="text-right">ROE</th>
                    <th class="text-right">Crédits/Dépôts</th>
                    <th class="text-right">Créances douteuses</th>
                    <th>Alertes</th>
                </tr>
            </thead>
            <tbody>
                @foreach($succursales as $s)
                    <tr>
                        <td>{{ $s['nom'] }}</td>
                        <td>{{ $s['ville'] }}</td>
                        <td>{{ $s['code'] }}</td>
                        <td class="text-right">{{ number_format($s['score'] ?? 0, 1, ',', ' ') }}</td>
                        <td class="text-right">{{ number_format(($s['roe'] ?? 0) * 100, 1, ',', ' ') }} %</td>
                        <td class="text-right">{{ number_format(($s['ratio_credits_depots'] ?? 0) * 100, 1, ',', ' ') }} %</td>
                        <td class="text-right">{{ number_format(($s['ratio_creances_douteuses'] ?? 0) * 100, 1, ',', ' ') }} %</td>
                        <td>
                            @if(!empty($s['alertes']))
                                {{ implode(', ', $s['alertes']) }}
                            @else
                                -
                            @endif
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p class="small">Aucune donnée disponible pour la période sélectionnée.</p>
    @endif
</body>
</html>
