import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

export default function UserForm({ onSubmit, initialData, loading, title, submitLabel }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    documento: '',
    legajo: '',
    email: '',
    domicilio: '',
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || '',
        apellido: initialData.apellido || '',
        documento: initialData.documento || '',
        legajo: initialData.legajo || '',
        email: initialData.email || '',
        domicilio: initialData.domicilio || '',
      });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es obligatorio';
    if (!formData.documento.trim()) newErrors.documento = 'El documento es obligatorio';
    if (!formData.legajo.trim()) newErrors.legajo = 'El legajo es obligatorio';
    if (!formData.email.trim()) newErrors.email = 'El email es obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email inválido';
    if (!formData.domicilio.trim()) newErrors.domicilio = 'El domicilio es obligatorio';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validate()) return;

    try {
      await onSubmit(formData);
      navigate('/');
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  const renderField = (name, label, type = 'text', disabled = false) => (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className={errors[name] ? 'error' : ''}
        disabled={disabled || loading}
        autoComplete={name === 'email' ? 'email' : 'off'}
      />
      {errors[name] && <span className="error-message">{errors[name]}</span>}
    </div>
  );

  return (
    <div className="form-container">
      <div className="page-header">
        <h2>{title}</h2>
        <Link to="/" className="btn btn-secondary">Volver</Link>
      </div>

      {submitError && <div className="alert alert-error">{submitError}</div>}

      <form onSubmit={handleSubmit}>
        {renderField('nombre', 'Nombre *', 'text', isEditing)}
        {renderField('apellido', 'Apellido *', 'text', isEditing)}
        {renderField('documento', 'Documento (DNI/Pasaporte) *', 'text', isEditing)}
        {renderField('legajo', 'Legajo *', 'text', isEditing)}
        {renderField('email', 'Email *', 'email')}
        {renderField('domicilio', 'Domicilio *', 'text')}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Guardando...' : submitLabel}
          </button>
          <Link to="/" className="btn btn-secondary">Cancelar</Link>
        </div>
      </form>
    </div>
  );
}