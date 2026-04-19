<?php

use App\Broadcasting\TeamChannel;
use App\Models\Team;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('Team.{team}', TeamChannel::class, ['guards' => ['reverb']]);
