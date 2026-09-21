import { Outlet, Link } from 'react-router-dom';

export default function Layout() {
  return (
    <>
      <header>
        <div className="container">
          <h1>Panel de Administración - RRHH</h1>
          <Link to="/" className="btn btn-primary">Ver Usuarios</Link>
        </div>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </>
  );
}