<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    use HasUuids;

    public function members()
    {
        return $this->hasMany(Member::class);
    }

    public function invites()
    {
        return $this->hasMany(Invite::class);
    }

    public function columns()
    {
        return $this->hasMany(Column::class);
    }
}
