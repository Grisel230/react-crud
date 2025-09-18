import React from 'react';

const PuestoList = ({ 
  puestos, 
  filteredPuestos,
  loading, 
  isSearching,
  searchId,
  setSearchId,
  setCurrentView, 
  editPuesto, 
  deletePuesto,
  searchPuestoById,
  showAllPuestos,
  clearSearch
}) => {
  // Determinar qué datos mostrar
  const displayData = filteredPuestos.length > 0 ? filteredPuestos : puestos;
  const isFiltered = filteredPuestos.length > 0;

  return (
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
        maxWidth: '1200px',
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
            Puestos
          </h1>
          <button
            onClick={() => setCurrentView('home')}
            style={{
              backgroundColor: '#10B981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <i className="fas fa-home"></i>
            Inicio
          </button>
        </div>

        <div style={{
          display: 'flex',
          gap: '15px',
          marginBottom: '30px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setCurrentView('puesto-form')}
            style={{
              backgroundColor: '#10B981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Nuevo Puesto
          </button>
          <button
            onClick={showAllPuestos}
            style={{
              backgroundColor: isFiltered ? '#3B82F6' : '#9CA3AF',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {isFiltered ? 'Mostrar Todos' : 'Mostrar Todos'}
          </button>
        </div>

        <div style={{
          display: 'flex',
          gap: '15px',
          marginBottom: '30px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <input
            type="text"
            placeholder="Ingrese el ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            style={{
              padding: '12px 16px',
              border: '1px solid #D1D5DB',
              borderRadius: '10px',
              fontSize: '0.9rem',
              minWidth: '200px',
              outline: 'none'
            }}
          />
          <button
            onClick={searchPuestoById}
            disabled={isSearching}
            style={{
              backgroundColor: '#10B981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: isSearching ? 'not-allowed' : 'pointer',
              opacity: isSearching ? 0.7 : 1
            }}
          >
            {isSearching ? 'Buscando...' : 'Buscar por ID'}
          </button>
          {isFiltered && (
            <button
              onClick={clearSearch}
              style={{
                backgroundColor: '#EF4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Limpiar
            </button>
          )}
        </div>

        {loading ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#6B7280'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #E5E7EB',
              borderTop: '4px solid #10B981',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            Cargando puestos...
          </div>
        ) : (
          <div style={{
            overflow: 'hidden',
            borderRadius: '10px',
            border: '1px solid #E5E7EB'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{
                  backgroundColor: '#10B981',
                  color: 'white'
                }}>
                  <th style={{
                    padding: '15px',
                    textAlign: 'left',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase'
                  }}>
                    ID
                  </th>
                  <th style={{
                    padding: '15px',
                    textAlign: 'left',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase'
                  }}>
                    NOMBRE
                  </th>
                  <th style={{
                    padding: '15px',
                    textAlign: 'left',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase'
                  }}>
                    ACCIONES
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayData.map((puesto, index) => (
                  <tr key={puesto.id} style={{
                    backgroundColor: index % 2 === 0 ? 'white' : '#F9FAFB',
                    borderBottom: '1px solid #E5E7EB'
                  }}>
                    <td style={{
                      padding: '15px',
                      color: '#1F2937',
                      fontSize: '0.9rem'
                    }}>
                      {puesto.id}
                    </td>
                    <td style={{
                      padding: '15px',
                      color: '#1F2937',
                      fontSize: '0.9rem',
                      fontWeight: '500'
                    }}>
                      {puesto.nombre}
                    </td>
                    <td style={{
                      padding: '15px'
                    }}>
                      <div style={{
                        display: 'flex',
                        gap: '8px'
                      }}>
                        <button
                          onClick={() => editPuesto(puesto)}
                          style={{
                            backgroundColor: '#F59E0B',
                            color: '#1F2937',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => deletePuesto(puesto.id)}
                          style={{
                            backgroundColor: '#EF4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PuestoList;
