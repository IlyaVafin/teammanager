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
            "id" => "required|exists:tasks,id",
            "from_column_id" => "required",
            "to_column_id" => "required",
            "new_position" => "required|integer|min:0"
        ]);

        $task = Task::findOrFail($data['id']);
        $fromCol = $data['from_column_id'];
        $toCol = $data['to_column_id'];
        $oldPos = $task->position;
        $newPos = $data['new_position'];

        DB::transaction(function () use ($task, $fromCol, $toCol, $oldPos, $newPos) {

            if ($fromCol !== $toCol) {

                Task::where('column_id', $fromCol)
                    ->where('position', '>', $oldPos)
                    ->decrement('position');

                Task::where('column_id', $toCol)
                    ->increment('position');

                $task->column_id = $toCol;
                $task->position = 0;
            } else {
                if ($oldPos > $newPos) {
                    Task::where('column_id', $fromCol)
                        ->whereBetween('position', [$newPos, $oldPos - 1])
                        ->increment('position');
                } else if ($oldPos < $newPos) {
                    Task::where('column_id', $fromCol)
                        ->whereBetween('position', [$oldPos + 1, $newPos])
                        ->decrement('position');
                }
                $task->position = $newPos;
            }

            $task->save();
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
