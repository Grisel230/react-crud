import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Agregar estilos CSS para las animaciones
const styles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes modalSlideIn {
    0% { 
      opacity: 0;
      transform: scale(0.8) translateY(-20px);
    }
    100% { 
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
  
  @keyframes checkmarkBounce {
    0% { 
      transform: scale(0);
    }
    50% { 
      transform: scale(1.2);
    }
    100% { 
      transform: scale(1);
    }
  }
`;

// Inyectar estilos en el head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

// Configuración de la API
const API_BASE_URL = 'http://localhost:8000/api';
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [departamentos, setDepartamentos] = useState([]);
  const [puestos, setPuestos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Estados para búsqueda
  const [searchId, setSearchId] = useState('');
  const [filteredDepartamentos, setFilteredDepartamentos] = useState([]);
  const [filteredPuestos, setFilteredPuestos] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Estados para modal de éxito
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Estados para modal de confirmación
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Estados para formularios - usando estados separados para evitar problemas
  const [departamentoForm, setDepartamentoForm] = useState({
    nombre: '',
    descripcion: '',
    subcuenta: ''
  });
  const [puestoForm, setPuestoForm] = useState({
    nombre: ''
  });
  const [editingId, setEditingId] = useState(null);

  // Cargar datos
  const loadDepartamentos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/departamentos');
      setDepartamentos(response.data);
    } catch (err) {
      console.error('Error cargando departamentos:', err);
      setError(`Error al cargar departamentos: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadPuestos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/puestos');
      setPuestos(response.data);
    } catch (err) {
      console.error('Error cargando puestos:', err);
      setError(`Error al cargar puestos: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambios en formularios - usando estados separados
  const handleDepartamentoInputChange = (e) => {
    const { name, value } = e.target;
    setDepartamentoForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePuestoInputChange = (e) => {
    const { name, value } = e.target;
    setPuestoForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Guardar departamento
  const saveDepartamento = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const formData = { ...departamentoForm };
      console.log('Enviando datos:', formData);
      console.log('URL base:', axios.defaults.baseURL);
      
      if (editingId) {
        console.log('Actualizando departamento:', editingId);
        const response = await axios.put(`/departamentos/${editingId}`, formData);
        console.log('Respuesta actualización:', response);
      } else {
        console.log('Creando nuevo departamento');
        const response = await axios.post('/departamentos', formData);
        console.log('Respuesta creación:', response);
      }
      
      // Limpiar formulario
      setDepartamentoForm({
        nombre: '',
        descripcion: '',
        subcuenta: ''
      });
      setEditingId(null);
      // Recargar datos y cambiar vista
      await loadDepartamentos();
      setCurrentView('departamentos');
      showSuccess(editingId ? 'Departamento actualizado exitosamente' : 'Departamento creado exitosamente');
    } catch (err) {
      console.error('Error guardando departamento:', err);
      console.error('Error response:', err.response);
      console.error('Error request:', err.request);
      setError(`Error al guardar departamento: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Guardar puesto
  const savePuesto = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const formData = { ...puestoForm };
      console.log('Enviando datos puesto:', formData);
      
      if (editingId) {
        console.log('Actualizando puesto:', editingId);
        await axios.put(`/puestos/${editingId}`, formData);
      } else {
        console.log('Creando nuevo puesto');
        await axios.post('/puestos', formData);
      }
      
      // Limpiar formulario
      setPuestoForm({
        nombre: ''
      });
      setEditingId(null);
      // Recargar datos y cambiar vista
      await loadPuestos();
      setCurrentView('puestos');
      showSuccess(editingId ? 'Puesto actualizado exitosamente' : 'Puesto creado exitosamente');
    } catch (err) {
      console.error('Error guardando puesto:', err);
      setError(err.response?.data?.message || err.message || 'Error al guardar puesto');
    } finally {
      setLoading(false);
    }
  };

  // Eliminar departamento
  const deleteDepartamento = async (id) => {
    showConfirm('¿Estás seguro de eliminar este departamento?', async (itemId) => {
      try {
        setError(null);
        await axios.delete(`/departamentos/${itemId}`);
        await loadDepartamentos();
        showSuccess('Departamento eliminado exitosamente');
      } catch (err) {
        setError(err.response?.data?.message || 'Error al eliminar departamento');
      }
    }, id);
  };

  // Eliminar puesto
  const deletePuesto = async (id) => {
    showConfirm('¿Estás seguro de eliminar este puesto?', async (itemId) => {
      try {
        setError(null);
        await axios.delete(`/puestos/${itemId}`);
        await loadPuestos();
        showSuccess('Puesto eliminado exitosamente');
      } catch (err) {
        setError(err.response?.data?.message || 'Error al eliminar puesto');
      }
    }, id);
  };

  // Editar departamento
  const editDepartamento = (departamento) => {
    setDepartamentoForm({
      nombre: departamento.nombre,
      descripcion: departamento.descripcion || '',
      subcuenta: departamento.subcuenta
    });
    setEditingId(departamento.id);
    setCurrentView('departamento-form');
  };

  // Editar puesto
  const editPuesto = (puesto) => {
    setPuestoForm({
      nombre: puesto.nombre
    });
    setEditingId(puesto.id);
    setCurrentView('puesto-form');
  };

  // Limpiar formularios
  const clearForms = () => {
    setDepartamentoForm({
      nombre: '',
      descripcion: '',
      subcuenta: ''
    });
    setPuestoForm({
      nombre: ''
    });
    setEditingId(null);
    setError(null);
  };

  // Funciones de búsqueda
  const searchDepartamentoById = async () => {
    if (!searchId.trim()) {
      setError('Por favor ingrese un ID para buscar');
      return;
    }
    
    try {
      setIsSearching(true);
      setError(null);
      const response = await axios.get(`/departamentos/${searchId}`);
      setFilteredDepartamentos([response.data]);
    } catch (err) {
      console.error('Error buscando departamento:', err);
      setError('No se encontró un departamento con ese ID');
      setFilteredDepartamentos([]);
    } finally {
      setIsSearching(false);
    }
  };

  const searchPuestoById = async () => {
    if (!searchId.trim()) {
      setError('Por favor ingrese un ID para buscar');
      return;
    }
    
    try {
      setIsSearching(true);
      setError(null);
      const response = await axios.get(`/puestos/${searchId}`);
      setFilteredPuestos([response.data]);
    } catch (err) {
      console.error('Error buscando puesto:', err);
      setError('No se encontró un puesto con ese ID');
      setFilteredPuestos([]);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchId('');
    setFilteredDepartamentos([]);
    setFilteredPuestos([]);
    setError(null);
    setIsSearching(false);
  };

  const showAllDepartamentos = () => {
    setFilteredDepartamentos([]);
    setSearchId('');
    setError(null);
  };

  const showAllPuestos = () => {
    setFilteredPuestos([]);
    setSearchId('');
    setError(null);
  };

  // Función para mostrar modal de éxito
  const showSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccessModal(true);
    // Auto-cerrar el modal después de 3 segundos
    setTimeout(() => {
      setShowSuccessModal(false);
    }, 3000);
  };

  // Función para mostrar modal de confirmación
  const showConfirm = (message, action, item) => {
    setConfirmMessage(message);
    setConfirmAction(() => action);
    setItemToDelete(item);
    setShowConfirmModal(true);
  };

  // Función para confirmar la acción
  const handleConfirm = async () => {
    if (confirmAction) {
      await confirmAction(itemToDelete);
    }
    setShowConfirmModal(false);
    setConfirmAction(null);
    setItemToDelete(null);
  };

  // Función para cancelar la acción
  const handleCancel = () => {
    setShowConfirmModal(false);
    setConfirmAction(null);
    setItemToDelete(null);
  };

  // Cargar datos al cambiar de vista
  useEffect(() => {
    if (currentView === 'departamentos') {
      loadDepartamentos();
    } else if (currentView === 'puestos') {
      loadPuestos();
    }
  }, [currentView]);

  // Función para renderizar la vista actual
  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <Home setCurrentView={setCurrentView} />;
      case 'departamentos':
        return <DepartamentoList 
          departamentos={departamentos}
          filteredDepartamentos={filteredDepartamentos}
          loading={loading}
          isSearching={isSearching}
          searchId={searchId}
          setSearchId={setSearchId}
          setCurrentView={setCurrentView}
          editDepartamento={editDepartamento}
          deleteDepartamento={deleteDepartamento}
          searchDepartamentoById={searchDepartamentoById}
          showAllDepartamentos={showAllDepartamentos}
          clearSearch={clearSearch}
        />;
      case 'departamento-form':
        return <DepartamentoForm 
          departamentoForm={departamentoForm}
          handleDepartamentoInputChange={handleDepartamentoInputChange}
          saveDepartamento={saveDepartamento}
          loading={loading}
          editingId={editingId}
          setCurrentView={setCurrentView}
        />;
      case 'puestos':
        return <PuestoList 
          puestos={puestos}
          filteredPuestos={filteredPuestos}
          loading={loading}
          isSearching={isSearching}
          searchId={searchId}
          setSearchId={setSearchId}
          setCurrentView={setCurrentView}
          editPuesto={editPuesto}
          deletePuesto={deletePuesto}
          searchPuestoById={searchPuestoById}
          showAllPuestos={showAllPuestos}
          clearSearch={clearSearch}
        />;
      case 'puesto-form':
        return <PuestoForm 
          puestoForm={puestoForm}
          handlePuestoInputChange={handlePuestoInputChange}
          savePuesto={savePuesto}
          loading={loading}
          editingId={editingId}
          setCurrentView={setCurrentView}
        />;
      default:
        return <Home setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className="App">
      {error && (
        <div className="alert alert-danger alert-dismissible fade show mx-3 mt-3" 
             role="alert"
             style={{ borderRadius: '10px' }}>
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError(null)}
          ></button>
        </div>
      )}

      {renderCurrentView()}
      
      <SuccessModal 
        show={showSuccessModal}
        message={successMessage}
        onClose={() => setShowSuccessModal(false)}
      />
      
      <ConfirmModal 
        show={showConfirmModal}
        message={confirmMessage}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}

  // Componente Home
const Home = ({ setCurrentView }) => (
  <div style={{
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  }}>
    <div style={{
      backgroundColor: 'white',
                   borderRadius: '20px',
      padding: '60px 40px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      textAlign: 'center',
      maxWidth: '600px',
      width: '100%'
    }}>
      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: '20px'
      }}>
                  Sistema de Gestión
                </h1>
      <p style={{
        fontSize: '1.1rem',
        color: '#6B7280',
        marginBottom: '40px'
      }}>
                  Administra departamentos y puestos de manera eficiente
                </p>
      <div style={{
        display: 'flex',
        gap: '20px',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setCurrentView('departamentos')}
          style={{
            backgroundColor: '#3B82F6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#2563EB';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#3B82F6';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          Gestión de Departamentos
        </button>
        <button
          onClick={() => setCurrentView('puestos')}
          style={{
            backgroundColor: '#10B981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#059669';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#10B981';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          Gestión de Puestos
        </button>
        </div>
      </div>
    </div>
  );

  // Componente Modal de Éxito
  const SuccessModal = ({ show, message, onClose }) => {
    if (!show) return null;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          maxWidth: '400px',
          width: '90%',
          textAlign: 'center',
          animation: 'modalSlideIn 0.3s ease-out'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#10B981',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            animation: 'checkmarkBounce 0.6s ease-out'
          }}>
            <i className="fas fa-check" style={{
              color: 'white',
              fontSize: '24px'
            }}></i>
          </div>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#1F2937',
            marginBottom: '10px'
          }}>
            ¡Éxito!
          </h3>
          <p style={{
            fontSize: '1rem',
            color: '#6B7280',
            marginBottom: '25px',
            lineHeight: '1.5'
          }}>
            {message}
          </p>
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#10B981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#059669';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#10B981';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Aceptar
          </button>
        </div>
      </div>
    );
  };

  // Componente Modal de Confirmación
  const ConfirmModal = ({ show, message, onConfirm, onCancel }) => {
    if (!show) return null;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1001
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          maxWidth: '400px',
          width: '90%',
          textAlign: 'center',
          animation: 'modalSlideIn 0.3s ease-out'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#F59E0B',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            animation: 'checkmarkBounce 0.6s ease-out'
          }}>
            <i className="fas fa-exclamation-triangle" style={{
              color: 'white',
              fontSize: '24px'
            }}></i>
          </div>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#1F2937',
            marginBottom: '10px'
          }}>
            Confirmar Acción
          </h3>
          <p style={{
            fontSize: '1rem',
            color: '#6B7280',
            marginBottom: '25px',
            lineHeight: '1.5'
          }}>
            {message}
          </p>
          <div style={{
            display: 'flex',
            gap: '15px',
            justifyContent: 'center'
          }}>
            <button
              onClick={onCancel}
              style={{
                backgroundColor: '#6B7280',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#4B5563';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#6B7280';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              style={{
                backgroundColor: '#EF4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#DC2626';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#EF4444';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Componente Lista de Departamentos
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

  // Componente Formulario de Departamento
const DepartamentoForm = ({ 
  departamentoForm, 
  handleDepartamentoInputChange, 
  saveDepartamento, 
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
      maxWidth: '800px',
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
            {editingId ? 'Editar Departamento' : 'Crear Departamento'}
        </h1>
        <button 
          onClick={() => setCurrentView('departamentos')}
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

              <form onSubmit={saveDepartamento}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '20px'
        }}>
          <div>
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
                        placeholder="Nombre del departamento"
              value={departamentoForm.nombre}
              onChange={handleDepartamentoInputChange}
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
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#374151'
            }}>
              Subcuenta <span style={{ color: '#EF4444' }}>*</span>
            </label>
                      <input
                        type="text"
                        id="subcuenta"
                        name="subcuenta"
                        placeholder="Subcuenta (3 caracteres)"
              value={departamentoForm.subcuenta}
              onChange={handleDepartamentoInputChange}
                        maxLength="3"
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
                  </div>
        
        <div style={{ marginBottom: '30px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            color: '#374151'
          }}>
            Descripción
          </label>
                    <textarea
                      id="descripcion"
                      name="descripcion"
                      placeholder="Descripción del departamento"
                      rows="4"
            value={departamentoForm.descripcion}
            onChange={handleDepartamentoInputChange}
                      style={{ 
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #D1D5DB',
                        borderRadius: '10px', 
              fontSize: '0.9rem',
              outline: 'none',
              resize: 'vertical',
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
            onClick={() => setCurrentView('departamentos')}
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
              backgroundColor: '#3B82F6',
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

// Componente Lista de Puestos
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

  // Componente Formulario de Puesto
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

export default App;