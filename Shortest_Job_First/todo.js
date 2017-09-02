
//sem nenhum processo rodando no estante x
//algoritmo para pegar a maior prioridade

var myApp = angular.module('myApp', []);

myApp.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});

myApp.controller('TodoCtrl', function($scope) {
 

 	$scope.onchange = function () {

 	    var i = $scope.nProcessos;
 		var result = document.getElementById("processosAtributos");
		var wrappedResult = angular.element(result);

		wrappedResult.empty();

		if(i <= 10 && i >= 1){
	 		while(i > 0){
	 			    wrappedResult.append("<div class='form-group' id='personal'><label class='control-label col-sm-1'>Nome:</label><div  class='col-sm-1'><input id='P"+i+"nome' readonly value='P"+i+"' type='text'  class='form-control' ></div><label class='control-label col-sm-1' >Prioridade:</label><div  class='col-sm-1'>        <input readonly id='P"+i+"prioridade' type='number' min='1' max='10' value='0' class='form-control' ></div><label class='control-label col-sm-1' >Duração:</label><div  class='col-sm-1'><input id='P"+i+"duracao' min='1' max='10' type='number' value='"+i+"'class='form-control' >           </div><label class='control-label col-sm-1' >Começo:</label><div  class='col-sm-1'><input id='P"+i+"comeco'type='number' min='0' max='10' value='0' class='form-control' ></div></div>");
				 	i--;
	 		}
	 	}



 	}



	$scope.ButtonClick = function () {
		
		
    var instanteTempo = 0;
    var processadorOcupado = false;
     
	var nProcessos = $scope.nProcessos;
	$scope.processos = [];

	while(nProcessos > 0){

		var nome = document.getElementById("P"+nProcessos+"nome").value;
		var prioridade = document.getElementById("P"+nProcessos+"prioridade").value;
		var duracao = document.getElementById("P"+nProcessos+"duracao").value;
		var start = document.getElementById("P"+nProcessos+"comeco").value;
		var naFila = false;
        var processando = false;

		$scope.processos.push({ nome,  prioridade, duracao, start, naFila, processando, totalStatus: []});
		nProcessos--;
	}

 
  
    //Fila = F
    //Ocioso = O = Não existe ainda = Acabou
    //Processando = P


    while (verificaDuracao() == true) {
       

        verificaQuemComeca(instanteTempo); //coloca na fila para quem está começando no instante corrente 
        verificaFila(instanteTempo); //coloca F para quem está na Fila
        verificaEncerrados(instanteTempo); //coloca O para quem encerrou
        
        try{
            if (processadorOcioso() == true) { //se o processador esta vazio e tem gente na fila, coloca alguem pra rodar
                escalonaProcesso();
            }else {
                   
                executaProcesso(encontraProcessoExecutando()); //se o processar ta rodando alguem, acha esse alguem pra continuar rodando

            }
        }catch(err) {
   
        }


        instanteTempo++; 



    }

    montaLinhaTempo();


//////////////////////////////////FIM////////////////////////////////////////
/////////////////////////////////COMECO FUNCOES//////////////////////////////



function encontraProcessoExecutando(){
    var y;

    for (y = 0; y < $scope.processos.length; y++) {
        if ($scope.processos[y]['processando'] == true) {
            break;
        }
    }

    return y;
}



function executaProcesso(indexProcesso){
    $scope.processos[indexProcesso]['totalStatus'][instanteTempo] = { status: 'P' }; //processo nao acabou e esta rodando 
    $scope.processos[indexProcesso]['duracao']--; 

    if($scope.processos[indexProcesso]['duracao'] == 0){
        $scope.processos[indexProcesso]['processando'] = false;
        $scope.processos[indexProcesso]['prioridade'] = -1; //deixa a batalha
        verificaEncerrados();
        processadorOcupado = false;
    }


}



function verificaDuracao(){
	var somaDuracao = 0;
	var j;

	for (j = 0; j < $scope.processos.length; j++) {
            somaDuracao = somaDuracao + $scope.processos[j]['duracao'];
     }

     if(somaDuracao == 0){
     	return false;
     }else{
     	return true;
     }

  


}




function montaLinhaTempo(){

    var totalStatus = new Array();
    var tempo = 0;
    
    while (tempo <  instanteTempo) {
        totalStatus[tempo] = { status: tempo };
        tempo++;
    }

    
   $scope.processos.push({
        nome: 'TEMPO',
        totalStatus
    });



}







function sortNumber(a,b) {
    return a - b;
}






 function EncontraMaiorPrioridadeFila() {

       
        var prioridadesFila = new Array();
        var j = 0;
        var k = 0;
        var MaiorPrioridade = 0;
        var indexProcessoMaiorPrioridade;



        for (j = 0; j < $scope.processos.length; j++) {
        	if ($scope.processos[j]['naFila'] == true){
            	prioridadesFila.push($scope.processos[j]['duracao']);
    	    }
    	}


        prioridadesFila.sort(sortNumber);

        MaiorPrioridade = prioridadesFila[0];

        for (k = 0; k < $scope.processos.length; k++) {
            if ($scope.processos[k]['duracao'] == MaiorPrioridade && $scope.processos[k]['naFila'] == true) {
                indexProcessoMaiorPrioridade = k;
            }
        }

        
        return indexProcessoMaiorPrioridade;




 }


    

    function processadorOcioso() {

    	var processosNaFila = 0;
    	var k;

    	for (k = 0; k < $scope.processos.length; k++) {
            if ($scope.processos[k]['naFila'] == true) {
                processosNaFila++;
            }
        }



        if (processadorOcupado == false && processosNaFila > 0) {
            return true;
        } else {
            return false;
        }

    }


    function escalonaProcesso() {
        MaiorPrioridade = EncontraMaiorPrioridadeFila(); //encontra quem deve processar
        $scope.processos[MaiorPrioridade]['naFila'] = false;
        $scope.processos[MaiorPrioridade]['processando'] = true;
        processadorOcupado = true;
        executaProcesso(MaiorPrioridade); 
    }


/*
    function EncontraProcessoNaFilaPorNome(nome) {
        var j;

        for (j = 0; j < fila.length; j++) {
            if (fila[j]['nome'] == nome) {
                return j;
            }
        }



    }*/


    function verificaFila(instanteTempo) {
        var j;
        var nomeProcesso;

        for (j = 0; j < $scope.processos.length; j++) {
			if ($scope.processos[j]['naFila'] == true){
				$scope.processos[j]['totalStatus'][instanteTempo] = { status: 'F' };
			}        	

    	}        
    }

    function verificaEncerrados(instanteTempo) {
        var k;

        for (k = 0; k < $scope.processos.length; k++) {
            if ($scope.processos[k]['duracao'] == 0) {
                $scope.processos[k]['totalStatus'][instanteTempo] = { status: 'O' };
            }
        }


    }

    function verificaQuemComeca(instanteTempo) {
        var k;

        for (k = 0; k < $scope.processos.length; k++) {
            if ($scope.processos[k]['start'] == instanteTempo) {
                $scope.processos[k]['naFila'] = true; 
            }
        }

    }



}
});