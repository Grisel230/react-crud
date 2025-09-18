import React from 'react';

const DepartamentoList = ({ 
  departamentos, 
  filteredDepartamentos,
  loading, 
  isSearching,
  searchId,
  setSearchId,
  setCurrentView, 
  editDepartamento, 
  deleteDepartamento,
  searchDepartamentoById,
  showAllDepartamentos,
  clearSearch
}) => {
  // Determinar qué datos mostrar
  const displayData = filteredDepartamentos.length > 0 ? filteredDepartamentos : departamentos;
  const isFiltered = filteredDepartamentos.length > 0;

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
            Departamentos
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
            onClick={() => setCurrentView('departamento-form')}
            style={{
              backgroundColor: '#3B82F6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Nuevo Departamento
          </button>
          <button
            onClick={showAllDepartamentos}
            style={{
              backgroundColor: isFiltered ? '#10B981' : '#9CA3AF',
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
            onClick={searchDepartamentoById}
            disabled={isSearching}
            style={{
              backgroundColor: '#3B82F6',
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
              borderTop: '4px solid #3B82F6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            Cargando departamentos...
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
                  backgroundColor: '#3B82F6',
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
                    SUBCUENTA
                  </th>
                  <th style={{
                    padding: '15px',
                    textAlign: 'left',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase'
                  }}>
                    DESCRIPCIÓN
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
                {displayData.map((departamento, index) => (
                  <tr key={departamento.id} style={{
                    backgroundColor: index % 2 === 0 ? 'white' : '#F9FAFB',
                    borderBottom: '1px solid #E5E7EB'
                  }}>
                    <td style={{
                      padding: '15px',
                      color: '#1F2937',
                      fontSize: '0.9rem'
                    }}>
                      {departamento.id}
                    </td>
                    <td style={{
                      padding: '15px',
                      color: '#1F2937',
                      fontSize: '0.9rem',
                      fontWeight: '500'
                    }}>
                      {departamento.nombre}
                    </td>
                    <td style={{
                      padding: '15px',
                      color: '#1F2937',
                      fontSize: '0.9rem'
                    }}>
                      {departamento.subcuenta}
                    </td>
                    <td style={{
                      padding: '15px',
                      color: '#1F2937',
                      fontSize: '0.9rem'
                    }}>
                      {departamento.descripcion || '-'}
                    </td>
                    <td style={{
                      padding: '15px'
                    }}>
                      <div style={{
                        display: 'flex',
                        gap: '8px'
                      }}>
                        <button
                          onClick={() => editDepartamento(departamento)}
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
                          onClick={() => deleteDepartamento(departamento.id)}
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

export default DepartamentoList;
