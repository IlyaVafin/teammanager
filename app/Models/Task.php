<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasUuids; 
    protected $fillable = [
        "title",
        "description",
        "position",
        "column_id",
        "deadline", 
    ];
}
