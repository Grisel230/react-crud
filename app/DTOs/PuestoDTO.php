<?php

namespace App\DTOs;

class PuestoDTO
{
    public function __construct(
        public int $id,
        public string $nombre,
        public ?int $departamento_id,
        public ?string $departamento_nombre,
        public string $created_at,
        public string $updated_at
    ) {}

    public static function fromModel($puesto): self
    {
        return new self(
            id: $puesto->id,
            nombre: $puesto->nombre,
            departamento_id: $puesto->departamento_id,
            departamento_nombre: $puesto->departamento?->nombre,
            created_at: $puesto->created_at->toISOString(),
            updated_at: $puesto->updated_at->toISOString()
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'departamento_id' => $this->departamento_id,
            'departamento_nombre' => $this->departamento_nombre,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at
        ];
    }
}
