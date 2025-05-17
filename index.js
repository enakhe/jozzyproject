import dotenv from 'dotenv';
dotenv.config();

import express, { json, urlencoded } from 'express';
import cors from 'cors';
import serverless from 'serverless-http';

import emailRoutes from './routes/emailConfig.js';
import paymentRoutes from './routes/stripePayment.js';
import retrieveStripe from './routes/retrieveStripe.js';

const app = express();
const port = 5100;

// Middlewares
app.use(cors({ origin: '*' }));
app.use(json({ limit: "25mb" }));
app.use(urlencoded({ extended: true, limit: "25mb" }));

app.get('/ready', (req, res) => {
    res.json({ message: 'Applicaton is ready' });
});

app.use('/api', emailRoutes);
app.use('api', paymentRoutes);
app.use('api', retrieveStripe);

app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});

// Export for Vercel
export default app;
export const handler = serverless(app);
