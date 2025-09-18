import React from 'react';

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

export default SuccessModal;
