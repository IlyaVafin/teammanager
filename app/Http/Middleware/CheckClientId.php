<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckClientId
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $clientId = $request->header('clientId');

        if(!$clientId){
            return response()->json([
               "message" => "ClientId has not been set"
            ], 400);
        }

        $request->merge(['client_id' => $clientId]);
        $request->attributes->set('client_id', $clientId);

        return $next($request);
    }
}
