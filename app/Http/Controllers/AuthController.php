<?php

namespace App\Http\Controllers;

use App\Exceptions\UnauthorizedException;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        $data = $request->validated();

        User::create($data);

        return response()->json([
            "message" => "success"
        ], 201);
    }

    public function login(LoginRequest $request)
    {
        $data = $request->validated();

        if (!auth()->attempt($data)) throw new UnauthorizedException();

        $token = Str::uuid();
        $user = auth()->user();
        $user->update(["token" => $token]);

        return response()->json([
            "message" => "success",
            "data" => [
                "id" => $user->id,
                "name" => $user->name,
                "email" => $user->email
            ],
            "credentials" => [
                "token" => $token,
            ]
        ]);
    }

    public function logout()
    {
        $user = auth()->user();
        $user->update(["token" => null]);
        return response()->noContent();
    }
}
