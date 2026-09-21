const User = require('../models/User');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ order: [['createdAt', 'DESC']] });
    res.json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const createUser = async (req, res) => {
  try {
    const { nombre, apellido, documento, legajo, email, domicilio } = req.body;

    if (!nombre || !apellido || !documento || !legajo || !email || !domicilio) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Check for duplicates manually (SQLite doesn't enforce unique constraints)
    const existingDoc = await User.findOne({ where: { documento } });
    if (existingDoc) {
      return res.status(400).json({ error: 'El documento ya está registrado' });
    }

    const existingLegajo = await User.findOne({ where: { legajo } });
    if (existingLegajo) {
      return res.status(400).json({ error: 'El legajo ya está registrado' });
    }

    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const user = await User.create({ nombre, apellido, documento, legajo, email, domicilio });
    res.status(201).json(user);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(e => e.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(e => e.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, domicilio } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Check for duplicate email (excluding current user)
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }
    }

    if (email) user.email = email;
    if (domicilio) user.domicilio = domicilio;

    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(e => e.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(e => e.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    await user.destroy();
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};