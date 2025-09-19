import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../services/api';

// Hook para obtener departamentos
export const useDepartamentos = () => {
  return useQuery({
    queryKey: ['departamentos'],
    queryFn: async () => {
      const response = await axios.get('/departamentos');
      return response.data;
    },
  });
};

// Hook para obtener un departamento por ID
export const useDepartamento = (id) => {
  return useQuery({
    queryKey: ['departamento', id],
    queryFn: async () => {
      const response = await axios.get(`/departamentos/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

// Hook para crear departamento
export const useCreateDepartamento = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data) => {
      const response = await axios.post('/departamentos', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departamentos'] });
    },
  });
};

// Hook para actualizar departamento
export const useUpdateDepartamento = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axios.put(`/departamentos/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departamentos'] });
    },
  });
};

// Hook para eliminar departamento
export const useDeleteDepartamento = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id) => {
      await axios.delete(`/departamentos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departamentos'] });
    },
  });
};
