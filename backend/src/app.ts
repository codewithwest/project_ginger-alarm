import express from 'express';
import cors from 'cors';
import syncRoutes from './routes/sync.routes';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', syncRoutes);

app.get('/', (req, res) => {
   res.send('Ginger Alarm Backend API is running');
});

export default app;
