<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Auth\RequestGuard;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->registerPolicies();

        Auth::extend('reverb', function ($app, $name, array $config) {
            return new RequestGuard(function ($request) {
                $token = $request->bearerToken();

                if (!$token) {
                    return null;
                }

                return User::where('token', $token)->first();
            }, $app['request']);
        });
    }
}
