import { Link } from 'react-router-dom';

export default function UserTable({ users, onEdit, onDelete }) {
  if (users.length === 0) {
    return (
      <div className="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <h3>No hay usuarios registrados</h3>
        <p>Haz clic en "Nuevo Usuario" para agregar el primero</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Documento</th>
            <th>Legajo</th>
            <th>Email</th>
            <th>Domicilio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td><span className="badge badge-info">{user.id}</span></td>
              <td>{user.nombre}</td>
              <td>{user.apellido}</td>
              <td>{user.documento}</td>
              <td>{user.legajo}</td>
              <td>{user.email}</td>
              <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.domicilio}
              </td>
              <td>
                <div className="actions">
                  <Link to={`/editar/${user.id}`} className="btn btn-secondary action-btn">
                    Editar
                  </Link>
                  <button
                    className="btn btn-danger action-btn"
                    onClick={() => onDelete(user.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}