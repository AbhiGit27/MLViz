import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const trainModel = async (algorithm, points, params) => {
  const response = await client.post('/train', {
    algorithm,
    points,
    params,
  });
  return response.data;
};

export const getDecisionBoundary = async (algorithm, points, params) => {
  const response = await client.post('/decision-boundary', {
    algorithm,
    points,
    params,
  });
  return response.data;
};

export const getKnnNeighbors = async (queryPoint, points, k, metric) => {
  const response = await client.post('/knn-neighbors', {
    query: queryPoint,
    points,
    k,
    metric,
  });
  return response.data;
};

export const checkHealth = async () => {
  const response = await client.get('/health');
  return response.data;
};

export default client;
