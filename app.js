const express = require('express');
const systemRoutes = require('./routes/systemRoutes');
const logsRoutes = require('./routes/logsRoutes');
const errorHandler = require('./middleware/errorHandler');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        app.set('view engine', 'ejs');
        app.use(express.static('public'));
        app.use(express.urlencoded({ extended: true }));
        app.use(express.json());

        app.get('/', (req, res) => {
            res.redirect('/dashboard');
        });

        app.use('/dashboard', systemRoutes);
        app.use('/logs', logsRoutes);

        app.use(errorHandler);

        app.use('*', (req, res) => {
            res.status(404).render('error', { 
                message: 'Page not found',
                error: { status: 404 }
            });
        });

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
    process.exit(1);
});

startServer();