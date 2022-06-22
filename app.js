const express = require('express');
const mongoose = require('mongoose');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const { PORT = 3000 } = process.env;
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

// подключаем мидлвары, роуты и всё остальное...

app.use((req, res, next) => {
  req.user = {
    _id: '62b2034c0fd31ff0f944ead1'  // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});

app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);

app.use((req, res, next) => {
  res.status(404).send("Страница не найдена");
})

app.get((req, res, next) => {
  res.status(404).send({ message: 'Страница не найдена'});
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})