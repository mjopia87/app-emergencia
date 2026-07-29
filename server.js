/**
 * Servidor para envío de correos de verificación 2FA
 * Usa EmailJS como servicio de correo
 *
 * Instalación:
 * npm install express cors axios dotenv
 *
 * Uso:
 * node server.js
 */

const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configuración
const EMAILJS_SERVICE_ID = 'service_f6xmqoa';
const EMAILJS_TEMPLATE_ID = 'template_5itxn0q';
const EMAILJS_PUBLIC_KEY = 'tUG7Nzla7OIiwTIDZ';

// Middleware
app.use(cors());
app.use(express.json());

// Ruta de salud
app.get('/health', (req, res) => {
    res.json({ status: '✅ Servidor de verificación activo' });
});

/**
 * Endpoint para enviar código de verificación
 * POST /send-verification
 */
app.post('/send-verification', async (req, res) => {
    try {
        const { usuario, correo, codigo } = req.body;

        // Validar datos
        if (!usuario || !correo || !codigo) {
            return res.status(400).json({
                success: false,
                message: 'Faltan datos requeridos: usuario, correo, codigo'
            });
        }

        // Validar formato de correo
        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexCorreo.test(correo)) {
            return res.status(400).json({
                success: false,
                message: 'Formato de correo inválido'
            });
        }

        // Validar que código sea de 6 dígitos
        if (!/^\d{6}$/.test(codigo)) {
            return res.status(400).json({
                success: false,
                message: 'El código debe ser de 6 dígitos'
            });
        }

        console.log(`📧 Enviando código a ${correo}...`);

        // Enviar correo vía EmailJS API
        const response = await axios.post(
            'https://api.emailjs.com/api/v1.0/email/send',
            {
                service_id: EMAILJS_SERVICE_ID,
                template_id: EMAILJS_TEMPLATE_ID,
                user_id: EMAILJS_PUBLIC_KEY,
                template_params: {
                    to_email: correo,
                    to_name: usuario,
                    verification_code: codigo,
                    app_name: 'APP Emergencia Illapel'
                }
            }
        );

        if (response.status === 200) {
            console.log(`✅ Correo enviado a ${correo}`);
            return res.json({
                success: true,
                message: 'Código enviado correctamente',
                recipient: correo
            });
        } else {
            throw new Error(`Estado inesperado: ${response.status}`);
        }

    } catch (error) {
        console.error('❌ Error enviando correo:', error.message);

        return res.status(500).json({
            success: false,
            message: 'Error al enviar correo',
            error: error.message
        });
    }
});

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada',
        available: ['/health', '/send-verification']
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log('');
    console.log('╔═════════════════════════════════════════╗');
    console.log('║  🚀 Servidor de Verificación Iniciado  ║');
    console.log('╚═════════════════════════════════════════╝');
    console.log('');
    console.log(`📍 Servidor: http://localhost:${PORT}`);
    console.log(`✅ Salud: http://localhost:${PORT}/health`);
    console.log(`📧 Enviar código: POST http://localhost:${PORT}/send-verification`);
    console.log('');
    console.log('Parámetros POST:');
    console.log('  - usuario: Nombre del usuario');
    console.log('  - correo: Correo electrónico');
    console.log('  - codigo: Código de 6 dígitos');
    console.log('');
    console.log('Ejemplo:');
    console.log('  curl -X POST http://localhost:3001/send-verification \\');
    console.log('    -H "Content-Type: application/json" \\');
    console.log('    -d \'{"usuario":"Juan","correo":"juan@example.com","codigo":"123456"}\'');
    console.log('');
});

module.exports = app;
