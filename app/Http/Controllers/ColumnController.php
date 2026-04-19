<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateColumnRequest;
use App\Models\Column;
use App\Models\Team;
use Illuminate\Http\Request;

class ColumnController extends Controller
{
    public function store(CreateColumnRequest $request, string $teamId)
    {
        $data = $request->validated();
        $team = Team::findOrFail($teamId);
        $column = $team->columns()->create($data);
        return response()->json(["data" => $column]);
    }

    public function show(string $teamId)
    {
        $team = Team::findOrFail($teamId);
        $columns = $team->columns;
        return response()->json(["data" => [
            "columns" => $columns,
        ]]);
    }

    public function update(Request $request, string $columnId)
    {
        $data = $request->validate([
            'title' => "required|min:1"
        ]);

        $column = Column::findOrFail($columnId);

        $column->update($data);
        return response()->json(null, 204);
    }

    public function destroy(string $columnId)
    {
        $column = Column::findOrFail($columnId);
        $column->delete();
    }
}
