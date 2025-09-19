<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Departamento;
use App\DTOs\DepartamentoDTO;
use Illuminate\Http\Request;

class DepartamentoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $departamentos = Departamento::all();
        $departamentosDTO = $departamentos->map(fn($departamento) => DepartamentoDTO::fromModel($departamento));
        return response()->json($departamentosDTO->map(fn($dto) => $dto->toArray()));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'nombre' => 'required|string|max:100',
                'descripcion' => 'nullable|string|max:255',
                'subcuenta' => 'required|string|max:3'
            ]);

            $departamento = Departamento::create($request->all());
            $departamentoDTO = DepartamentoDTO::fromModel($departamento);
            return response()->json($departamentoDTO->toArray(), 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al crear departamento',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $departamento = Departamento::findOrFail($id);
        $departamentoDTO = DepartamentoDTO::fromModel($departamento);
        return response()->json($departamentoDTO->toArray());
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'nombre' => 'required|string|max:100',
            'descripcion' => 'nullable|string|max:255',
            'subcuenta' => 'required|string|max:3'
        ]);

        $departamento = Departamento::findOrFail($id);
        $departamento->update($request->all());
        $departamentoDTO = DepartamentoDTO::fromModel($departamento);
        return response()->json($departamentoDTO->toArray());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $departamento = Departamento::findOrFail($id);
        $departamento->delete();
        return response()->json(null, 204);
    }
}
