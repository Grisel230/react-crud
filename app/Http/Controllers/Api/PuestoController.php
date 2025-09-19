<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Puesto;
use App\DTOs\PuestoDTO;
use Illuminate\Http\Request;

class PuestoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $puestos = Puesto::with('departamento')->get();
        $puestosDTO = $puestos->map(fn($puesto) => PuestoDTO::fromModel($puesto));
        return response()->json($puestosDTO->map(fn($dto) => $dto->toArray()));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'nombre' => 'required|string|max:100',
                'departamento_id' => 'required|exists:departamentos,id'
            ]);

            $puesto = Puesto::create($request->all());
            $puesto->load('departamento');
            $puestoDTO = PuestoDTO::fromModel($puesto);
            return response()->json($puestoDTO->toArray(), 201);
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
        $puesto = Puesto::with('departamento')->findOrFail($id);
        $puestoDTO = PuestoDTO::fromModel($puesto);
        return response()->json($puestoDTO->toArray());
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'nombre' => 'required|string|max:100',
            'departamento_id' => 'required|exists:departamentos,id'
        ]);

        $puesto = Puesto::findOrFail($id);
        $puesto->update($request->all());
        $puesto->load('departamento');
        $puestoDTO = PuestoDTO::fromModel($puesto);
        return response()->json($puestoDTO->toArray());
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
