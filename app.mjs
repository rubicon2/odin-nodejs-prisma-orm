import express, { urlencoded } from 'express';
import expressSession from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
app.use(urlencoded({ extended: false }));
app.use(
  expressSession({
    secret: 'who cares',
    resave: false,
    saveUninitialized: true,
    cookie: {
      // 7 days.
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 1000 * 60 * 2,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  }),
);

async function saveDataToSession(req, res, next) {
  req.session.routeData = req.body.text;
  return next();
}

async function clearDataFromSession(req, res, next) {
  delete req.session.routeData;
  req.session.save((error) => {
    if (error) return next(error);
  });
}

app.get('/', (req, res, next) => {
  const session = req.session;
  res.send(
    `
    <h1>session.routeData should now be undefined, if it has been cleared properly</h1>
    <ul>
      <li>session.routeData: ${session.routeData}</li>
      <li><a href="/">Index</a></li>
      <li><a href="/form">Form</a></li>
    </ul>
    `,
  );
});

app.get(
  '/form',
  (req, res, next) => {
    const session = req.session;
    res.send(
      `
      <h1>Please enter some text</h1>
      <form method="post" action="/form">
        <input type="text" name="text" required>
        <button type="submit">Submit</button>
      </form>
      <ul>
        <li>session.routeData: ${session.routeData}</li>
        <li><a href="/">Index</a></li>
      </ul>
      `,
    );
    return next();
  },
  clearDataFromSession,
);

app.get(
  '/saved',
  (req, res, next) => {
    const session = req.session;
    res.send(
      `
    <h1>The form text should be saved to session.routeData</h1>
    <ul>
      <li>session.routeData: ${session.routeData}</li>
      <li><a href="/">Index</a></li>
    </ul>
    `,
    );
    // return next();
    // Is this the answer?
    res.on('finish', () => {
      clearDataFromSession(req, res, next);
    });
  },
  // clearDataFromSession,
);

app.post('/form', saveDataToSession, (req, res) => {
  return res.redirect('/saved');
});

// eslint-disable-next-line -- stop moaning about not using next. It has to have 4 args to be an error handler.
app.use((error, req, res, next) => {
  console.log(error.stack);
  return res.send(error);
});

app.listen(8080, () => console.log('Listening on port', 8080));
