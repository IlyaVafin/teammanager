<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateTaskRequest;
use App\Models\Column;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateTaskRequest $request, string $columnId)
    {
        $data = $request->validated();
        $column = Column::findOrFail($columnId);
        $count = $column->tasks()->count();
        $task = $column->tasks()->create([
            "title" => $data['title'],
            'description' => $data['description'],
            "position" => ($count + 1) - 1,
            "deadline" => $data['deadline']
        ]);

        return response()->json(["data" => [
            "task" => $task
        ]], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    public function updatePosition(Request $request)
    {
        $data = $request->validate([
            "id" => "required|string",
            "new_position" => "required|integer|min:0"
        ]);
        $task = Task::findOrFail($data['id']);
        $oldPosition = $task->position;
        $newPosition = $data['new_position'];
        DB::transaction(function () use ($task, $oldPosition, $newPosition) {
            if ($oldPosition > $newPosition) {
                Task::where('position', '>=', $newPosition)->where('position', '<', $oldPosition)->increment('position');
            } else {
                Task::where('position', '>', $oldPosition)->where('position', '<=', $newPosition)->decrement('position');
            }
            $task->update(['position' => $newPosition]);
        });
        return response()->json(null, 204);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CreateTaskRequest $request, string $id)
    {
        $data = $request->validated();
        $task = Task::findOrFail($id);
        $task->update($data);
        return response()->json(["data" => [
            "task" => $task
        ]]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $task = Task::findOrFail($id);
        $task->delete();
        return response()->json(null, 204);
    }
}
