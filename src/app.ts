import express from 'express';
import awardRoutes from './presentation/routes/awards.routes';
import { loadCsv } from './infra/csv/loadCsv';
import { setupDatabase } from './infra/database/sqliteConnection';

const app = express();

app.use(express.json());
app.use('/awards', awardRoutes);

(async () => {
  await setupDatabase();
  await loadCsv();
})();

export default app;
