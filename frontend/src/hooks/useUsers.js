import { useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.fetchUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const addUser = async (userData) => {
    const newUser = await api.createUser(userData);
    setUsers(prev => [newUser, ...prev]);
    return newUser;
  };

  const editUser = async (id, userData) => {
    const updatedUser = await api.updateUser(id, userData);
    setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
    return updatedUser;
  };

  const removeUser = async (id) => {
    await api.deleteUser(id);
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  return {
    users,
    loading,
    error,
    loadUsers,
    addUser,
    editUser,
    removeUser,
  };
}