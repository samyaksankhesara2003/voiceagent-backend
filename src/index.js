require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
require('./config/database'); // Initialize Knex + Objection binding

const express = require('express');
const cors = require('cors');

const webhookRoutes = require('./routes/webhook.routes');
const doctorRoutes = require('./routes/doctor.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const crmLeadRoutes = require('./routes/crmLead.routes');
const patientRoutes = require('./routes/patient.routes');
const callRoutes = require('./routes/call.routes');
const testRoutes = require('./routes/test.routes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/webhook', webhookRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/crm-leads', crmLeadRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/calls', callRoutes);
app.use('/api/test', testRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
