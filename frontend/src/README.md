# Estructura del Frontend

Este proyecto ha sido reorganizado para mejorar la mantenibilidad y escalabilidad del código.

## Estructura de Carpetas

```
src/
├── components/           # Componentes de React
│   ├── pages/           # Páginas principales
│   │   ├── Home.jsx
│   │   ├── DepartamentoList.jsx
│   │   └── PuestoList.jsx
│   ├── forms/           # Formularios
│   │   ├── DepartamentoForm.jsx
│   │   └── PuestoForm.jsx
│   ├── modals/          # Modales
│   │   ├── SuccessModal.jsx
│   │   └── ConfirmModal.jsx
│   └── index.js         # Exportaciones centralizadas
├── services/            # Servicios y configuración
│   └── api.js          # Configuración de Axios
├── styles/             # Estilos
│   └── animations.css  # Animaciones CSS
├── App.jsx             # Componente principal
└── main.jsx           # Punto de entrada
```

## Beneficios de la Nueva Estructura

1. **Separación de responsabilidades**: Cada componente tiene su propio archivo
2. **Reutilización**: Los componentes pueden ser fácilmente reutilizados
3. **Mantenibilidad**: Es más fácil encontrar y modificar código específico
4. **Escalabilidad**: Fácil agregar nuevos componentes sin afectar otros
5. **Organización**: Código más limpio y organizado

## Componentes

### Páginas (`components/pages/`)
- **Home**: Página de inicio con navegación
- **DepartamentoList**: Lista de departamentos con funcionalidades CRUD
- **PuestoList**: Lista de puestos con funcionalidades CRUD

### Formularios (`components/forms/`)
- **DepartamentoForm**: Formulario para crear/editar departamentos
- **PuestoForm**: Formulario para crear/editar puestos

### Modales (`components/modals/`)
- **SuccessModal**: Modal de confirmación de éxito
- **ConfirmModal**: Modal de confirmación para acciones destructivas

### Servicios (`services/`)
- **api.js**: Configuración centralizada de Axios para las llamadas a la API

### Estilos (`styles/`)
- **animations.css**: Animaciones CSS reutilizables

## Uso

Todos los componentes están exportados desde `components/index.js` para facilitar las importaciones:

```javascript
import { Home, DepartamentoList, SuccessModal } from './components';
```
