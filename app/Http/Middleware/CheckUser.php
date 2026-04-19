<?php

namespace App\Http\Middleware;

use App\Exceptions\UnauthorizedException;
use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckUser
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();

        if(!$token) throw new UnauthorizedException();

        $user = User::where('token', $token)->first();

        if(!$user) throw new UnauthorizedException();

        auth()->login($user);

        return $next($request);
    }
}
