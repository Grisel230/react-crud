<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Departamento extends Model
{
    protected $fillable = [
        'nombre',
        'descripcion',
        'subcuenta'
    ];

    /**
     * Get the puestos for the departamento.
     */
    public function puestos(): HasMany
    {
        return $this->hasMany(Puesto::class);
    }
}
