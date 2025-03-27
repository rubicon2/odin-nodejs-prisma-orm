import express from 'express';
import expressSession from 'express-session';
import { PrismaClient } from '@prisma/client';

const app = express();
app.use(
  expressSession({
    secret: 'who cares',
    resave: false,
    saveUninitialized: true,
    cookie: {
      // 7 days.
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  }),
);
const prisma = new PrismaClient();

app.get('/', async (req, res, next) => {
  const session = req.session;
  res.send(session);
});

app.listen(8080, () => console.log('Listening on port', 8080));
