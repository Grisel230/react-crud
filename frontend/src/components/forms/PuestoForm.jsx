import React from 'react';

const PuestoForm = ({ 
  puestoForm, 
  handlePuestoInputChange, 
  savePuesto, 
  loading, 
  editingId, 
  setCurrentView 
}) => (
  <div style={{
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
    padding: '20px'
  }}>
    <div style={{
      backgroundColor: 'white',
      borderRadius: '20px',
      padding: '30px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#1F2937',
          margin: 0
        }}>
          {editingId ? 'Editar Puesto' : 'Crear Puesto'}
        </h1>
        <button 
          onClick={() => setCurrentView('puestos')}
          style={{
            backgroundColor: '#6B7280',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 20px',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <i className="fas fa-arrow-left"></i>
          Volver
        </button>
      </div>

      <form onSubmit={savePuesto}>
        <div style={{ marginBottom: '30px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            color: '#374151'
          }}>
            Nombre <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            placeholder="Nombre del puesto"
            value={puestoForm.nombre}
            onChange={handlePuestoInputChange}
            required
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #D1D5DB',
              borderRadius: '10px',
              fontSize: '0.9rem',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{
          display: 'flex',
          gap: '15px',
          justifyContent: 'flex-end'
        }}>
          <button
            type="button"
            onClick={() => setCurrentView('puestos')}
            style={{
              backgroundColor: '#6B7280',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 24px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={loading}
            style={{
              backgroundColor: '#10B981',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 24px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? (
              <>
                <span style={{
                  display: 'inline-block',
                  width: '16px',
                  height: '16px',
                  border: '2px solid #ffffff',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  marginRight: '8px'
                }}></span>
                Guardando...
              </>
            ) : (
              <>
                <i className="fas fa-save" style={{ marginRight: '8px' }}></i>
                {editingId ? 'Actualizar' : 'Guardar'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  </div>
);

export default PuestoForm;
