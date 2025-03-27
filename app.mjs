import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.get('/', async (req, res, next) => {
  const sessions = await prisma.session.findMany();
  res.send(sessions);
});

app.listen(8080, () => console.log('Listening on port', 8080));
