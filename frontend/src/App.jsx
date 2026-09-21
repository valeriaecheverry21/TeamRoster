import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import EditPage from './pages/EditPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="nuevo" element={<CreatePage />} />
        <Route path="editar/:id" element={<EditPage />} />
      </Route>
    </Routes>
  );
}