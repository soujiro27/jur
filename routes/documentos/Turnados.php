<?php 
namespace Routes\Documentos;
use App\Controllers\Turnados\TurnadosController;

$controller = new TurnadosController;

$auth = function(){
	//echo "yes";
};



$app->group('/juridico',$auth,function() use($app,$controller){

	$app->get('/Irac/turnos',function() use ($controller){
		$controller->index();
	});

	$app->get('/turnos/:id',function($id) use ($controller,$app){
		$message = false;
		$errors = false;
		$controller->create($id,$message, $errors);
	})->conditions(array('id' => '[0-9]{1,4}'));

/*
	$app->get('/Irac/documentos/:id',function($id) use ($controller,$app){
		$message = false;
		$errors = false;
		$controller->createDocumentos($id,$message, $errors);
	})->conditions(array('id' => '[0-9]{1,4}'));

	


	$app->post('/Irac/turno',function() use($app,$controller) {
		$controller->saveTurno($app->request->post(),$app);
	});

*/
});





?>