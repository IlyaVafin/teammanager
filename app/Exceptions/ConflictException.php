<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\Request;

class ConflictException extends Exception
{
    public function __construct(string $message = "Conflict", int $code = 0, \Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }

    public function render(Request $request)
    {
        return response()->json([
            "message" => $this->getMessage(),
        ], 409);
    }
}
