<?php

namespace App\DTOs;

class DepartamentoDTO
{
    public function __construct(
        public int $id,
        public string $nombre,
        public ?string $descripcion,
        public string $subcuenta,
        public string $created_at,
        public string $updated_at
    ) {}

    public static function fromModel($departamento): self
    {
        return new self(
            id: $departamento->id,
            nombre: $departamento->nombre,
            descripcion: $departamento->descripcion,
            subcuenta: $departamento->subcuenta,
            created_at: $departamento->created_at->toISOString(),
            updated_at: $departamento->updated_at->toISOString()
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'descripcion' => $this->descripcion,
            'subcuenta' => $this->subcuenta,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at
        ];
    }
}
