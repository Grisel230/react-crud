<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Puesto;
use Illuminate\Http\Request;

class PuestoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $puestos = Puesto::all();
        return response()->json($puestos);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'nombre' => 'required|string|max:100'
            ]);

            $puesto = Puesto::create($request->all());
            return response()->json($puesto, 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al crear puesto',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $puesto = Puesto::findOrFail($id);
        return response()->json($puesto);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'nombre' => 'required|string|max:100'
        ]);

        $puesto = Puesto::findOrFail($id);
        $puesto->update($request->all());
        return response()->json($puesto);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $puesto = Puesto::findOrFail($id);
        $puesto->delete();
        return response()->json(null, 204);
    }
}
