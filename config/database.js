var mongoose = require('mongoose');

module.exports = function(uri) {
  mongoose.connect(uri, { server: { poolSize: 15}});
  mongoose.set('debug', true);

  mongoose.connection.on('conncted', function() {
    console.log('Mongoose! Conectado em ' + uri);
  });

  mongoose.connection.on('disconnected', function() {
    console.log('Mongoose! Desconectado de ' + uri);
  });

  mongoose.connection.on('error', function() {
    console.log('Mongoose! Erro na conexão: ' + uri);
  });

  process.on('SIGINT', function() {
    mongoose.connection.close(function() {
      console.log('Mongoose! Desconectado pelo término da aplicação');
      // 0 indica que a finalização ocorreu sem erros
      process.exit(0);
    })
  })

}
