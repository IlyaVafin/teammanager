<?php

namespace App\Exceptions;

use Exception;

class ForbiddenException extends Exception
{
    public function render()
    {
        return response()->json([
           "message" => "Forbidden",
        ], 403);
    }
}
