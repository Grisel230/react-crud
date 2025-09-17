<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DepartamentoController;
use App\Http\Controllers\Api\PuestoController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Rutas para Departamentos
Route::apiResource('departamentos', DepartamentoController::class);

// Rutas para Puestos
Route::apiResource('puestos', PuestoController::class);
