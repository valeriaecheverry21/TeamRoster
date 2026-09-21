import UserForm from '../components/UserForm';
import { useUsers } from '../hooks/useUsers';

export default function CreatePage() {
  const { addUser } = useUsers();

  return (
    <UserForm
      title="Nuevo Empleado"
      submitLabel="Crear Usuario"
      onSubmit={addUser}
    />
  );
}