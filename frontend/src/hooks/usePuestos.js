import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../services/api';

// Hook para obtener puestos
export const usePuestos = () => {
  return useQuery({
    queryKey: ['puestos'],
    queryFn: async () => {
      const response = await axios.get('/puestos');
      return response.data;
    },
  });
};

// Hook para obtener un puesto por ID
export const usePuesto = (id) => {
  return useQuery({
    queryKey: ['puesto', id],
    queryFn: async () => {
      const response = await axios.get(`/puestos/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

// Hook para crear puesto
export const useCreatePuesto = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data) => {
      const response = await axios.post('/puestos', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['puestos'] });
    },
  });
};

// Hook para actualizar puesto
export const useUpdatePuesto = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axios.put(`/puestos/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['puestos'] });
    },
  });
};

// Hook para eliminar puesto
export const useDeletePuesto = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id) => {
      await axios.delete(`/puestos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['puestos'] });
    },
  });
};
