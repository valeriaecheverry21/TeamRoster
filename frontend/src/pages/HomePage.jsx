import { useState } from 'react';
import { Link } from 'react-router-dom';
import UserTable from '../components/UserTable';
import { useUsers } from '../hooks/useUsers';

export default function HomePage() {
  const { users, loading, error, removeUser, loadUsers } = useUsers();
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleDelete = (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este usuario?')) {
      removeUser(id);
    }
  };

  if (loading) {
    return <div className="loading">Cargando usuarios...</div>;
  }

  if (error) {
    return (
      <div className="alert alert-error">
        Error al cargar usuarios: {error}
        <button className="btn btn-secondary" style={{ marginLeft: '12px' }} onClick={loadUsers}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h2>Lista de Empleados</h2>
        <Link to="/nuevo" className="btn btn-success">+ Nuevo Usuario</Link>
      </div>

      <UserTable users={users} onEdit={() => {}} onDelete={handleDelete} />
    </div>
  );
}