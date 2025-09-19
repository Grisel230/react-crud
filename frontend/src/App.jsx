import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from './services/api';
import './styles/animations.css';

// Importar componentes
import {
  Home,
  DepartamentoList,
  DepartamentoForm,
  PuestoList,
  PuestoForm,
  SuccessModal,
  ConfirmModal
} from './components';

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
    nombre: '',
    departamento_id: ''
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
        nombre: '',
        departamento_id: ''
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
      nombre: puesto.nombre,
      departamento_id: puesto.departamento_id || ''
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
      nombre: '',
      departamento_id: ''
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
          departamentos={departamentos}
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






export default App;