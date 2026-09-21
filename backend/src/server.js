const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');
require('./models/User');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando correctamente' });
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');

    await sequelize.sync({ alter: true });
    console.log('Base de datos sincronizada.');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();