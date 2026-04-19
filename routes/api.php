<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ColumnController;
use App\Http\Controllers\InviteController;
use App\Http\Controllers\TeamController;
use App\Http\Middleware\CheckUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware(CheckUser::class)->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/teams/invites', [InviteController::class, 'index']);
    Route::post('/teams/{team}/invite', [InviteController::class, 'store']);
    Route::patch('/teams/invites/{invite}', [InviteController::class, 'update']);

    Route::get('/teams/{team}/members', [TeamController::class, 'getMembers']);

    Route::post("/column/{teamId}", [ColumnController::class, 'store']);
    Route::get("/columns/{teamId}", [ColumnController::class, 'show']);
    Route::patch("/column/{columnId}", [ColumnController::class, 'update']);
    Route::delete("/column/{columnId}", [ColumnController::class, 'destroy']);

    Route::get('/teams', [TeamController::class, 'index']);
    Route::get('/teams/{team}', [TeamController::class, 'show']);
    Route::post('/teams', [TeamController::class, 'store']);
    Route::patch('/teams/{team}', [TeamController::class, 'update']);
    Route::patch('/teams/{team}/data', [TeamController::class, 'updateData']);
    Route::delete('/teams/{team}', [TeamController::class, 'destroy']);
});
