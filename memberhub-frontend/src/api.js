import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5161/api'
});

export const getMembers = () => api.get('/members');
export const getMember = (id) => api.get(`/members/${id}`);
export const createMember = (member) => api.post('/members', member);
export const updateMember = (id, member) => api.put(`/members/${id}`, member);

export default api;
