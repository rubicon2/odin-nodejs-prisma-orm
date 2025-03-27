import express from 'express';

const app = express();

app.get('/', (req, res, next) => {
  res.send('Testing!');
});

app.listen(8080, () => console.log('Listening on port', 8080));
