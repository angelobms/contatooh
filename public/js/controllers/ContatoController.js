angular.module('contatooh').controller('ContatoController',
  function($scope, $routeParams, Contato) {

    $scope.mensagem = {texto: ''};

    if ($routeParams.contatoId) {
      Contato.get({id: $routeParams.contatoId},
        function(contato) {
            $scope.contato = contato;
            $scope.mensagem = {};
        },
        function(erro) {
          $scope.mensagem = {
              texto: 'Não foi possível obter o contato'
          };
          console.log(erro);
        }
      );
    } else {
      $scope.contato = new Contato();
    };

    $scope.salva = function() {
      $scope.contato.$save()
        .then(function() {
          $scope.mensagem = {texto: 'Salvo com sucesso'};
          // limpa o formulário
          $scope.contato = new Contato();
          //$scope.btnBackFocus = true;
          $scope.$$broadcast('contatoSalvo');
        })
        .catch(function(erro) {
          $scope.mensagem = {texto: 'Não foi possível salvar'};
        });
    };

    Contato.query(function(contatos) {
      $scope.contatos = contatos;
    });

  });
