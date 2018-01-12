<?php 
namespace Routes\Catalogos;
use App\Controllers\Catalogos\AccionesController;

$controller = new AccionesController();

$auth = function(){
	//echo "yes";
};



$app->group('/juridico',$auth,function() use($app,$controller){

	$app->get('/Acciones',function() use ($controller){
		$controller->index();
	});

	$app->get('/Acciones/create',function() use ($controller){
		$message = false;
		$errors = false;
		$controller->create($message,$errors);
	});

	$app->get('/Acciones/:id',function($id) use ($controller,$app){
		$message = false;
		$errors = false;
		$controller->createUpdate($id, $app, $message, $errors);
	})->conditions(array('id' => '[0-9]{1,2}'));

	$app->post('/Acciones/create',function() use ($app,$controller){
		$controller->save($app->request->post(), $app);
	});

	$app->post('/Acciones/update',function() use($app,$controller) {
		$controller->update($app->request->post(),$app);
	});

});



?>