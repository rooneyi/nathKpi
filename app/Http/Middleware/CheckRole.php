<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        // Vérifier si l'utilisateur a l'un des rôles requis
        foreach ($roles as $role) {
            if ($user->role === $role) {
                return $next($request);
            }
        }

        // Rediriger vers le dashboard approprié selon le rôle
        return $this->redirectToRoleDashboard($user);
    }

    private function redirectToRoleDashboard($user)
    {
        return match($user->role) {
            'succursale' => redirect()->route('dashboard'),
            'siege' => redirect()->route('dashboard'),
            'admin' => redirect()->route('dashboard'),
            default => redirect()->route('login'),
        };
    }
}
