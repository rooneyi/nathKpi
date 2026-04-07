<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Succursale;
use App\Models\DonneeFinanciere;
use App\Models\Kpi;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Créer les succursales
        $succursales = [
            ['nom' => 'Kinshasa Centre', 'code' => 'KINS-001', 'ville' => 'Kinshasa', 'active' => true],
            ['nom' => 'Gombe Succursale', 'code' => 'GOMB-001', 'ville' => 'Kinshasa', 'active' => true],
            ['nom' => 'Lubumbashi', 'code' => 'LUBU-001', 'ville' => 'Lubumbashi', 'active' => true],
            ['nom' => 'Matadi', 'code' => 'MATA-001', 'ville' => 'Matadi', 'active' => true],
            ['nom' => 'Kisangani', 'code' => 'KISA-001', 'ville' => 'Kisangani', 'active' => true],
        ];

        foreach ($succursales as $data) {
            Succursale::create($data);
        }

        // Créer les utilisateurs
        $admin = User::create([
            'name' => 'Administrateur',
            'email' => 'admin@kpibank.cd',
            'password' => Hash::make('password'),
            'role' => User::ROLE_ADMIN,
            'email_verified_at' => now(),
        ]);

        $siege = User::create([
            'name' => 'Siège Central',
            'email' => 'siege@kpibank.cd',
            'password' => Hash::make('password'),
            'role' => User::ROLE_SIEGE,
            'email_verified_at' => now(),
        ]);

        // Utilisateurs succursale
        $succursaleUsers = [
            ['name' => 'Responsable Kinshasa', 'email' => 'kinshasa@kpibank.cd', 'succursale_id' => 1],
            ['name' => 'Responsable Gombe', 'email' => 'gombe@kpibank.cd', 'succursale_id' => 2],
            ['name' => 'Responsable Lubumbashi', 'email' => 'lubumbashi@kpibank.cd', 'succursale_id' => 3],
            ['name' => 'Responsable Matadi', 'email' => 'matadi@kpibank.cd', 'succursale_id' => 4],
            ['name' => 'Responsable Kisangani', 'email' => 'kisangani@kpibank.cd', 'succursale_id' => 5],
        ];

        foreach ($succursaleUsers as $data) {
            User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make('password'),
                'role' => User::ROLE_SUCCURSALE,
                'succursale_id' => $data['succursale_id'],
                'email_verified_at' => now(),
            ]);
        }

    }
}
