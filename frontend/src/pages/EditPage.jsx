import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserForm from '../components/UserForm';
import { fetchUserById } from '../services/api';

export default function EditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await fetchUserById(id);
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [id]);

  const handleSubmit = async (formData) => {
    await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    navigate('/');
  };

  if (loading) {
    return <div className="loading">Cargando usuario...</div>;
  }

  if (error) {
    return (
      <div className="alert alert-error">
        Error al cargar usuario: {error}
      </div>
    );
  }

  if (!user) {
    return <div className="alert alert-error">Usuario no encontrado</div>;
  }

  return (
    <UserForm
      title="Editar Empleado"
      submitLabel="Actualizar"
      onSubmit={handleSubmit}
      initialData={user}
    />
  );
}