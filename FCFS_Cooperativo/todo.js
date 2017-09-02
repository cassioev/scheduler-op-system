
//sem nenhum processo rodando no estante x
//algoritmo para pegar a maior prioridade





var myApp = angular.module('myApp', []);



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
    var filaCircular = new Array();
    var copiaProcessos = new Array();
    var ultimoProcessoExecutado;

    

     
	var nProcessos = $scope.nProcessos;
	$scope.processos = [];

	while(nProcessos > 0){

		var nome = document.getElementById("P"+nProcessos+"nome").value;
		var prioridade = document.getElementById("P"+nProcessos+"prioridade").value;
		var duracao = document.getElementById("P"+nProcessos+"duracao").value;
		var start = document.getElementById("P"+nProcessos+"comeco").value;
		var naFila = false;
        var processando = false;
        var tempoExecutado = 0;


		$scope.processos.push({ nome,  prioridade, duracao, start, naFila, processando, tempoExecutado, totalStatus: []});
		nProcessos--;
	}

 
  
    //Fila = F
    //Ocioso = O = Não existe ainda = Acabou
    //Processando = P

    copiaProcessos = $scope.processos;
    //duracaoTotal = verificaDuracao();

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

    ordenaProcessos();
    montaLinhaTempo();


//////////////////////////////////FIM////////////////////////////////////////
/////////////////////////////////COMECO FUNCOES//////////////////////////////



function encontraProcessoExecutando(){
    var y = -1;

    if($scope.processos.length > 0){

        for (y = 0; y < $scope.processos.length; y++) {
            if ($scope.processos[y]['processando'] == true) {
                break;
            }
        }
    }

    return y;
}



function executaProcesso(indexProcesso){
    $scope.processos[indexProcesso]['totalStatus'][instanteTempo] = { status: 'P' }; //processo nao acabou e esta rodando 
    $scope.processos[indexProcesso]['duracao']--; 
    
    if($scope.processos[indexProcesso]['duracao'] == 0){
        $scope.processos[indexProcesso]['prioridade'] = -1; //deixa a batalha
        verificaEncerrados();
        $scope.processos[indexProcesso]['processando'] = false;
        processadorOcupado = false;
    }
    

}



function verificaDuracao(){
	var somaDuracao = 0;
	var j;

    if($scope.processos.length == $scope.nProcessos){
    	for (j = 0; j < $scope.processos.length; j++) {
                somaDuracao = parseInt(somaDuracao) + parseInt($scope.processos[j]['duracao']);
         }

         if(somaDuracao > 0){
            return true;
         }else{
            return false;
        }

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

       var indexProcessoMaiorPrioridade;

       if(filaCircular.length > 0){
            indexProcessoMaiorPrioridade = filaCircular.length-1;
       }
        
        return indexProcessoMaiorPrioridade;




 }


    

    function processadorOcioso() {
    	
    	if (processadorOcupado == false && filaCircular.length > 0) {
            return true;
        } else {
            return false;
        }

    }


    function escalonaProcesso() {
        MaiorPrioridade = EncontraMaiorPrioridadeFila(); //encontra quem deve processar
        $scope.processos.push(filaCircular[MaiorPrioridade]);
        filaCircular.splice(MaiorPrioridade,1);
        $scope.processos[$scope.processos.length-1]['processando'] = true;
        processadorOcupado = true;
        executaProcesso($scope.processos.length-1); 
        ultimoProcessoExecutado =  $scope.processos[$scope.processos.length-1]['nome'];
    }




    function verificaFila(instanteTempo) {
        var j;
        var nomeProcesso;

        if(filaCircular.length > 0){
             for (j = 0; j < filaCircular.length; j++) {
                filaCircular[j]['totalStatus'][instanteTempo] = { status: 'F' };
             }

        }
           
    }

    function verificaEncerrados(instanteTempo) {
        var k;

        if($scope.processos.length > 0){

            for (k = 0; k < $scope.processos.length; k++) {
                if ($scope.processos[k]['duracao'] == 0) {
                    $scope.processos[k]['totalStatus'][instanteTempo] = { status: 'O' };
                }
            }

        }


    }

    function verificaQuemComeca(instanteTempo) {
        var k;
        var j;
        var temp;

        //tira do array inicial e coloca na fila
        try{
            for (k = $scope.processos.length-1; k >= 0; k--) {
                if ($scope.processos[k]['start'] == instanteTempo) {
                    filaCircular.unshift($scope.processos[k]);
                    delete  $scope.processos[k];
                }
            }
            
            //ordena por prioridade, menor duracao melhor lugar na fila - bubble sort
            //filaCircular = ordenaPorDuracao(filaCircular);
          /* 
            if(filaCircular[filaCircular.length-1]['nome'] == ultimoProcessoExecutado){
                temp = filaCircular[filaCircular.length-1];
                filaCircular.pop();
                filaCircular.unshift(temp);
            }
*/
        }catch(err){}

            
        $scope.processos = $scope.processos.filter(function(n){ return n != undefined });           

    }


    function ordenaPorDuracao(fila){
        var temp;
        var j;
        var k;

        for (k = fila.length-1; k > 0; k--) {
                for (j = 0; j < k; j++) {
                    if(fila[j+1]['duracao'] > fila[j]['duracao']){
                        temp = fila[j];
                        fila[j] = fila[j+1];
                        fila[j+1] = temp;                        
                }
            }
        }

        return fila;
    }




    function ordenaProcessos(){
        var k;
        var j;
        var copiaProcessos = new Array();

        for (k = 0; k < $scope.processos.length; k++) {

              for (j = 0; j < $scope.processos.length; j++) {
                    if($scope.processos[j]['nome'] == ('P'+(k+1))){
                        copiaProcessos.unshift($scope.processos[j]);
                        break;
                    }

              }

        }

        $scope.processos = copiaProcessos;
    }




 function callClick(){
    ButtonClick();

 }



}
});