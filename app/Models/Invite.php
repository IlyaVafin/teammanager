<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Invite extends Model
{
    use HasUuids;

    public function team()
    {
        return $this->belongsTo(Team::class);
    }
}
