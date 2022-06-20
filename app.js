const express = require('express');
const mongoose = require('mongoose');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const { PORT = 3000 } = process.env;
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get((req, res, next) => {
  res.status(404).send({ message: 'Страница не найдена'});
});

mongoose.connect('mongodb://localhost:27017/mydb', {
  useNewUrlParser: true,
  useCreateIndex: true,
    useFindAndModify: false
});

// подключаем мидлвары, роуты и всё остальное...

app.use((req, res, next) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});

app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})