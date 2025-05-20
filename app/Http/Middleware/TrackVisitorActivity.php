<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Facades\VisitorLogFacade;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class TrackVisitorActivity
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Process the request
        $response = $next($request);

        // Skip logging for certain routes (e.g., assets, api, etc.)
        if (
            $request->is('api/*') ||
            $request->is('_debugbar/*') ||
            $request->is('assets/*') ||
            $request->is('css/*') ||
            $request->is('js/*') ||
            $request->is('images/*')
        ) {
            return $response;
        }

        // Log visitor activity
        VisitorLogFacade::log([
            'user_id' => Auth::id(), // Will be null for guests
            'path' => $request->path(),
        ]);

        return $response;
    }
}