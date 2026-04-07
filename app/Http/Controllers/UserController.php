<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Succursale;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    /**
     * Liste des utilisateurs (admin uniquement).
     */
    public function index(Request $request)
    {
        $users = User::with('succursale')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        $succursales = Succursale::where('active', true)->get();

        $preselectedSuccursaleId = $request->query('succursale_id');

        return Inertia::render('admin/utilisateurs', [
            'users' => $users,
            'succursales' => $succursales,
            'preselectedSuccursaleId' => $preselectedSuccursaleId ? (int) $preselectedSuccursaleId : null,
        ]);
    }

    /**
     * Créer un nouvel utilisateur (admin uniquement).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', Password::defaults()],
            'role' => 'required|string|in:succursale,siege,admin',
            'succursale_id' => 'nullable|exists:succursales,id',
        ]);

        // Vérifier cohérence rôle/succursale
        if ($validated['role'] === 'succursale' && empty($validated['succursale_id'])) {
            return redirect()->back()->with('error', 'Une succursale est requise pour un utilisateur de type succursale.');
        }

        if ($validated['role'] !== 'succursale') {
            $validated['succursale_id'] = null;
        }

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'succursale_id' => $validated['succursale_id'] ?? null,
            'email_verified_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Utilisateur créé avec succès.');
    }

    /**
     * Mettre à jour un utilisateur (admin uniquement).
     */
    public function update(Request $request, int $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'role' => 'required|string|in:succursale,siege,admin',
            'succursale_id' => 'nullable|exists:succursales,id',
            'password' => ['nullable', Password::defaults()],
        ]);

        // Vérifier cohérence rôle/succursale
        if ($validated['role'] === 'succursale' && empty($validated['succursale_id'])) {
            return redirect()->back()->with('error', 'Une succursale est requise pour un utilisateur de type succursale.');
        }

        if ($validated['role'] !== 'succursale') {
            $validated['succursale_id'] = null;
        }

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'succursale_id' => $validated['succursale_id'] ?? null,
        ];

        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $user->update($updateData);

        return redirect()->back()->with('success', 'Utilisateur mis à jour avec succès.');
    }

    /**
     * Supprimer un utilisateur (admin uniquement).
     */
    public function destroy(Request $request, int $id)
    {
        $user = User::findOrFail($id);

        // Empêcher la suppression de son propre compte
        if ($user->id === $request->user()->id) {
            return redirect()->back()->with('error', 'Vous ne pouvez pas supprimer votre propre compte.');
        }

        $user->delete();

        return redirect()->back()->with('success', 'Utilisateur supprimé avec succès.');
    }

    /**
     * Activer/Désactiver un utilisateur (admin uniquement).
     */
    public function toggleActive(Request $request, int $id)
    {
        $user = User::findOrFail($id);

        if ($user->id === $request->user()->id) {
            return redirect()->back()->with('error', 'Vous ne pouvez pas désactiver votre propre compte.');
        }

        $user->update(['active' => !$user->active]);

        $status = $user->active ? 'activé' : 'désactivé';
        return redirect()->back()->with('success', "Utilisateur {$status} avec succès.");
    }
}
