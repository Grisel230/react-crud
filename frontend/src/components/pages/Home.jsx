import React from 'react';

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

export default Home;
