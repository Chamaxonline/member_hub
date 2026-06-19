import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5161/api'
});

export const getMembers = (page = 1, pageSize = 10, search = '') => {
    const params = { page, pageSize };
    if (search.trim()) {
        params.search = search.trim();
    }
    return api.get('/members', { params });
};
export const getMember = (id) => api.get(`/members/${id}`);
export const createMember = (member) => api.post('/members', member);
export const updateMember = (id, member) => api.put(`/members/${id}`, member);
export const getMemberMonthlyRecords = (memberId, year) =>
    api.get(`/members/${memberId}/monthly-records`, { params: { year } });
export const saveMemberMonthlyRecords = (memberId, payload) =>
    api.put(`/members/${memberId}/monthly-records`, payload);

export default api;
