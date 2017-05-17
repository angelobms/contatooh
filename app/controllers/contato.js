var	sanitize	=	require('mongo-sanitize');

//var ID_CONTATO_INC = 3;

/*
//Lista de contatos
var contatos = [
  {_id: 1, nome: 'Contato Exemplo 1', email: 'cont1@empresa.com.br'},
  {_id: 2, nome: 'Contato Exemplo 2', email: 'cont2@empresa.com.br'},
  {_id: 3, nome: 'Contato Exemplo 3', email: 'cont3@empresa.com.br'}
];
*/

module.exports = function(app) {

  var Contato = app.models.contato;

  var controller = {};

  controller.listaContatos = function(req, res) {
    /*
    // Popula uma lista fixa com os contatos
    res.json(contatos);
    */

    // Busca documento no bando mongoDB
    Contato.find().populate("emergencia").exec()
      .then(
        function(contatos) {
          res.json(contatos);
        },
        function(erro) {
          console.error(erro);
          res.status(500).json(erro);
        }
      );
  };

  controller.obtemContato = function(req, res) {
    /*
    // Obtem contato de uma lista fixa
    var idContato = req.params.id;
    var contato = contatos.filter(function(contato) {
      return contato._id == idContato;
    })[0];
    contato ? res.json(contato) : res.status(404).send('Contato não encontrado');
    //console.log(req.params.id);
    */

    // Busca documento no banco mongoDB pelo ID
    var _id = sanitize(req.params.id);
    Contato.findById(_id).exec()
      .then(
        function(contato) {
          if (!contato) throw new Error("Contato não encontrado");
          res.json(contato);
        },
        function(erro) {
          console.error(erro);
          res.status(404).json(erro);
        }
      );
  };

  controller.removeContato = function(req, res) {
    /*
    // Remove um contato da lista fixa
    var idContato = req.params.id;

    console.log('API: removeContato:' + idContato);
    contatos = contatos.filter(function(contato) {
      return contato._id != idContato;
    });
    res.status(204).end();
    */

    // Remover documento do banco mongoDB pelo ID
    var _id = sanitize(req.params.id);
    Contato.remove({"_id" : _id}).exec()
      .then(
        function() {
          res.status(204).end();
        },
        function(erro) {
          return console.error(erro);
        }
      );
  };

  controller.salvaContato = function(req, res) {

    /*
    // Salva um contato na lista fixa (adiciona ou atualiza)
    var contato = req.body;
    contato = contato._id ? atualiza(contato) : adiciona(contato);
    res.json(contato);
    */

    // Salvar documento no banco mongoDB
    var _id = sanitize(req.body._id);

    // testando por undefined
    //req.body.emergencia = req.body.emergencia || null;
    var dados = {
      "nome" : req.body.nome,
      "email" : req.body.email,
      "emergencia" : req.body.emergencia || null
    };

    if(_id) {
      Contato.findByIdAndUpdate(_id, dados).exec()
        .then(
          function(contato) {
            res.json(contato);
          },
          function(erro) {
            console.error(erro);
            res.status(500).json(erro);
          }
        );
    } else {
      Contato.create(dados)
        .then(
          function(contato) {
            res.status(201).json(contato);
          },
          function(erro) {
            console.log(erro);
            res.status(500).json(erro);
          }
        );
    }
  };

  /*
  // Adiciona um contato em uma lista fixa
  function adiciona(contatoNovo) {
    contatoNovo._id = ++ID_CONTATO_INC;
    contatos.push(contatoNovo);
    return contatoNovo;
  }
  */

  /*
  // Atualiza um contato da lista fixa
  function atualiza(contatoAlterar) {
    contatos = contatos.map(function(contato) {
      if(contato._id == contatoAlterar._id) {
        contato = contatoAlterar;
      }
      return contato;
    });
  }
  */

  return controller;
}
