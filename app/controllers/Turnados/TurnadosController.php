<?php 
namespace App\Controllers\Turnados;

use App\Controllers\Template;
use Sirius\Validation\Validator;
use Carbon\Carbon;

use App\Models\Volantes\Volantes;
use App\Models\Catalogos\PuestosJuridico;
use App\Models\Documentos\TurnadosJuridico;
use App\Models\Documentos\AnexosJuridico;


class TurnadosController extends Template {

	private $modulo = 'Documentos Turnados';

	public function index() {
        
		$id = $_SESSION['idEmpleado'];
     
        $areas = PuestosJuridico::where('rpe','=',"$id")->get();
        $idPuestoJuridico = $areas[0]['idPuestoJuridico'];
        

        $turnos = TurnadosJuridico::select('sia_TurnadosJuridico.fAlta','sia_TurnadosJuridico.idTipoPrioridad','sia_TurnadosJuridico.comentario','sia_TurnadosJuridico.idTurnadoJuridico','sub.nombre as documento','u.nombre','u.saludo','u.paterno','u.materno','v.idVolante')
            ->join('sia_VolantesDocumentos as v','v.idVolante','=','sia_TurnadosJuridico.idVolante')
            ->join('sia_catSubTiposDocumentos as sub', 'sub.idSubTipoDocumento','=','v.idSubTipoDocumento')
            ->join('sia_usuarios as u','u.idUsuario','=','sia_TurnadosJuridico.usrAlta')
            ->where('sia_TurnadosJuridico.idUsrReceptor',"$idPuestoJuridico")
            ->where('sia_TurnadosJuridico.estatus','ACTIVO')
            ->orderBy('fAlta','ASC')
            ->get();

        	echo $this->render('/documentos/turnos/index.twig',[
            'turnos' => $turnos,
            'sesiones'=> $_SESSION,
            'modulo' => $this->modulo,
            ]);
	}

	public function create($id,$message, $errors) {
		
        $anexos = $this->load_documentos_anexos($id);
        echo $this->render('documentos/turnos/create.twig',[
			'sesiones' => $_SESSION,
			'modulo' => $this->modulo,
            'anexos' => $anexos,
			'mensaje' => $message,
			'errors' => $errors,
		]);

	}

    
    public function load_documentos_anexos($idTurnadoJuridico) {
        $anexos = AnexosJuridico::select('sia_AnexosJuridico.*','tj.idVolante','p.idPuestoJuridico')
                ->join('sia_TurnadosJuridico as tj','tj.idTurnadoJuridico','=', 'sia_AnexosJuridico.idTurnadoJuridico')
                ->join('sia_usuarios as u','u.idUsuario', '=','tj.usrAlta')
                ->join('sia_PuestosJuridico as p','p.rpe', '=' ,'u.idEmpleado')
                ->where('sia_AnexosJuridico.idTurnadoJuridico',"$idTurnadoJuridico")->get();
        return $anexos;
    }


}