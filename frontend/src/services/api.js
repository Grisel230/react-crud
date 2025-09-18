import axios from 'axios';

// Configuración de la API
const API_BASE_URL = 'http://localhost:8000/api';

// Configurar axios por defecto
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';

export default axios;
