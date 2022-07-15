const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const productRouter = require('./routes/produtos');
const requestRouter = require('./routes/pedidos');
const userRouter = require('./routes/usuarios');

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Header', 
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
    return res.status(200).send({});
  }
  next();
});

app.use('/produtos', productRouter);
app.use('/pedidos', requestRouter);
app.use('/usuarios', userRouter);
app.use((req, res, next) => {
  const erro = new Error('não encontrado');
  erro.status = 404;
  next(erro)
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  return res.send({
    erro: {
      mensagem: error.message
    }
  })
});



module.exports = app;