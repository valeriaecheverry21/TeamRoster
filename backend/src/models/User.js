const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El nombre es obligatorio' },
      len: { args: [1, 100], msg: 'El nombre debe tener entre 1 y 100 caracteres' },
    },
  },
  apellido: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El apellido es obligatorio' },
      len: { args: [1, 100], msg: 'El apellido debe tener entre 1 y 100 caracteres' },
    },
  },
  documento: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: { msg: 'El documento ya está registrado' },
    validate: {
      notEmpty: { msg: 'El documento es obligatorio' },
      len: { args: [5, 20], msg: 'El documento debe tener entre 5 y 20 caracteres' },
    },
  },
  legajo: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: { msg: 'El legajo ya está registrado' },
    validate: {
      notEmpty: { msg: 'El legajo es obligatorio' },
      len: { args: [1, 20], msg: 'El legajo debe tener entre 1 y 20 caracteres' },
    },
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: { msg: 'El email ya está registrado' },
    validate: {
      notEmpty: { msg: 'El email es obligatorio' },
      isEmail: { msg: 'Debe ser un email válido' },
    },
  },
  domicilio: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El domicilio es obligatorio' },
      len: { args: [5, 255], msg: 'El domicilio debe tener entre 5 y 255 caracteres' },
    },
  },
}, {
  tableName: 'users',
  timestamps: true,
});

module.exports = User;