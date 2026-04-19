<?php

namespace App\Exceptions;

use Exception;

class UnauthorizedException extends Exception
{
    public function render()
    {
        return response()->json([
           "message" => "Unauthorized"
        ], 401);
    }
}
