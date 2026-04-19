<?php

namespace App\Broadcasting;

use App\Models\Team;

class TeamChannel
{
    /**
     * Create a new channel instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Authenticate the user's access to the channel.
     */
    public function join($user, Team $team): array|bool
    {
        $isMember = $team->members()
            ->where('user_id', $user->id)
            ->exists();

        if(!$isMember) return false;

        return [
            'id' => $user->id,
            'name' => $user->name,
        ];
    }
}
