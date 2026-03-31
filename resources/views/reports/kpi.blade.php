<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Rapport KPI — KPIbank</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; color: #333; line-height: 1.6; }
        .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; color: #1a1a1a; }
        .title { font-size: 18px; color: #666; margin-top: 5px; }
        .info { margin-bottom: 20px; font-size: 12px; }
        .info table { width: 100%; }
        .kpi-section { margin-bottom: 30px; }
        .kpi-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .kpi-table th, .kpi-table td { border: 1px solid #ddd; padding: 12px 8px; text-align: left; }
        .kpi-table th { background-color: #f8f9fa; font-weight: bold; font-size: 11px; text-transform: uppercase; }
        .kpi-table td { font-size: 13px; }
        .footer { position: fixed; bottom: 0; left: 0; right: 0; text-align: center; font-size: 10px; color: #999; border-top: 1px solid #ddd; padding-top: 10px; }
        .status-badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; }
        .status-success { background-color: #d1fae5; color: #064e3b; }
        .summary-card { background-color: #f1f5f9; padding: 15px; border-radius: 8px; margin-top: 20px; }
        .summary-title { font-weight: bold; margin-bottom: 5px; font-size: 14px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">KPIbank</div>
        <div class="title">RAPPORT DE PERFORMANCE FINANCIÈRE</div>
    </div>

    <div class="info">
        <table>
            <tr>
                <td><strong>Succursale :</strong> {{ $branch ?? 'Kinshasa Centre' }}</td>
                <td style="text-align: right;"><strong>Date :</strong> {{ date('d/m/Y') }}</td>
            </tr>
            <tr>
                <td><strong>Période :</strong> {{ $period ?? 'Mars 2026' }}</td>
                <td style="text-align: right;"><strong>Statut :</strong> <span class="status-badge status-success">CONFORME</span></td>
            </tr>
        </table>
    </div>

    <div class="kpi-section">
        <h3 style="border-left: 4px solid #1a1a1a; padding-left: 10px;">Indicateurs Clés (KPIs)</h3>
        <table class="kpi-table">
            <thead>
                <tr>
                    <th>Indicateur</th>
                    <th>Valeur Actuelle</th>
                    <th>Variation</th>
                    <th>Objectif</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Dépôts Clientèle</td>
                    <td>38 200 000 USD</td>
                    <td style="color: green;">+7.1% ↑</td>
                    <td>35 000 000 USD</td>
                </tr>
                <tr>
                    <td>Crédits Nouveaux</td>
                    <td>4 150 000 USD</td>
                    <td style="color: red;">-2.4% ↓</td>
                    <td>5 000 000 USD</td>
                </tr>
                <tr>
                    <td>Résultat d'Exploitation</td>
                    <td>1 240 000 USD</td>
                    <td style="color: green;">+12.4% ↑</td>
                    <td>1 000 000 USD</td>
                </tr>
                <tr>
                    <td>Taux de Recouvrement</td>
                    <td>91.4%</td>
                    <td style="color: green;">+2.1% ↑</td>
                    <td>90%</td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="summary-card">
        <div class="summary-title">Analyse Synthétique</div>
        <p style="font-size: 12px; margin: 0;">
            Les performances de la période affichent une progression satisfaisante sur le plan des dépôts clients. Cependant, une baisse légère de l'octroi de crédits est observée, partiellement compensée par une amélioration du taux de recouvrement des créances. Le résultat net reste au-dessus des prévisions budgétaires.
        </p>
    </div>

    <div class="footer">
        © 2026 KPIbank — Rapport généré automatiquement — Document confidentiel à usage interne
    </div>
</body>
</html>
