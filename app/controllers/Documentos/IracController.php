<?php 
namespace App\Controllers\Documentos;

use App\Controllers\Template;
use Sirius\Validation\Validator;
use Carbon\Carbon;

use App\Models\Volantes\Volantes;
use App\Models\Catalogos\PuestosJuridico;
use App\Models\Documentos\TurnadosJuridico;

class IracController extends Template {

	private $modulo = 'Irac';

	public function index() {
		$id = $_SESSION['idEmpleado'];
        $areas = PuestosJuridico::where('rpe','=',"$id")->get();
        $area = $areas[0]['idArea'];

         $iracs = Volantes::select('sia_Volantes.idVolante','sia_Volantes.folio',
            'sia_Volantes.numDocumento','sia_Volantes.idRemitente','sia_Volantes.fRecepcion','sia_Volantes.asunto'
        ,'c.nombre as caracter','a.nombre as accion','audi.clave','sia_Volantes.extemporaneo','t.estadoProceso')
            ->join('sia_catCaracteres as c','c.idCaracter','=','sia_Volantes.idCaracter')
            ->join('sia_CatAcciones as a','a.idAccion','=','sia_Volantes.idAccion')
            ->join('sia_VolantesDocumentos as vd','vd.idVolante','=','sia_Volantes.idVolante')
            ->join('sia_auditorias as audi','audi.idAuditoria','=','vd.cveAuditoria')
            ->join( 'sia_catSubTiposDocumentos as sub','sub.idSubTipoDocumento','=','vd.idSubTipoDocumento')
            ->join('sia_turnosJuridico as t','t.idVolante','=','sia_Volantes.idVolante')
            ->where('sub.nombre','=','IRAC')
            ->where('sia_volantes.idTurnado','=',"$area")
            ->get();

        	echo $this->render('/documentos/Irac/index.twig',[
            'iracs' => $iracs,
            'sesiones'=> $_SESSION,
            'modulo' => 'Irac',
            ]);

	}

	public function create($id,$message, $errors) {
		
        $turnos = $this->load_turnos($id);
        echo $this->render('documentos/Irac/create.twig',[
			'sesiones' => $_SESSION,
			'modulo' => $this->modulo,
            'turnos' => $turnos,
			'mensaje' => $message,
			'errors' => $errors,
			'id' => $id
		]);

	}

    public function saveTurno(array $data, $app) {
            $id = $data['idVolante'];
            $area = $this->Area($id);
            if($this->duplicate($data)){

                if(empty($this->validate($data))){
                    $turno = new TurnadosJuridico([
                        'idVolante' => $data['idVolante'],
                        'idAreaRemitente' => $area,
                        'idAreaRecepcion' => $area,
                        'idUsrReceptor' => $data['idPuestoJuridico'],
                        'idEstadoTurnado' => 'En Atencion',
                        'idTipoTurnado' => 'Salida',
                        'idTipoPrioridad' =>$data['prioridad'],
                        'comentario' => $data['comentario'],
                        'usrAlta' => $_SESSION['idUsuario'],
                        'estatus' => 'ACTIVO',
                        'fAlta' => Carbon::now('America/Mexico_City')->format('Y-d-m H:i:s')
                    ]);

                    if($turno->save()) { 
                        $res = $this->load_turnos($id);
                    } 
                   
                }else{
                    $this->create($id,$message = false,$this->validate($data));
                }

            } else {
               $res = array('errors' => 'No se puede Asignar el Documento' );
            }

            echo json_encode($res);
    }



    public function createDocumentos($id,$message, $errors) {

        $turnados = TurnadosJuridico::select('p.idPuestoJuridico','p.saludo','p.nombre','p.paterno','p.materno','sia_TurnadosJuridico.idTurnadoJuridico')
                                    ->join('sia_puestosJuridico as p','idPuestoJuridico','=','sia_TurnadosJuridico.idUsrReceptor')->get();


         echo $this->render('documentos/Irac/documentos.twig',[
            'sesiones' => $_SESSION,
            'modulo' => $this->modulo,
            'mensaje' => $message,
            'errors' => $errors,
            'id' => $id,
            'turnados' => $turnados,
        ]);
    }


    public function validate($data){
        $errors = [];
        $validator = new \Sirius\Validation\Validator;
        $validator->add(
            array(
            'idVolante' => 'required | Number | MaxLength(4)',
            'idPuestoJuridico' => 'required | Number | MaxLength(3)',
            'comentario' => 'MaxLength(350)',
            'prioridad' => 'required | Alpha | MaxLength(20)'
        ));

        if(!$validator->validate($data)){
            $errors = $validator->getMessages();
            return $errors;
        }else{

            return $errors;
        }   
    }

    public function duplicate(array $data){
        $idVolante = $data['idVolante'];
        $idPuesto = $data['idPuestoJuridico'];
        $turnos = TurnadosJuridico::where('idVolante',"$idVolante")
                                    ->where('idUsrReceptor',"$idPuesto")
                                    ->count();
        if($turnos == 0){
            return true;
        }else{
            return false;
        }

    }

    public function Area($id){
        
        $volante = Volantes::where('idVolante',"$id")->get();

        return $volante[0]['idTurnado'];

    }

    public function load_turnos($id){

        $turnos = TurnadosJuridico::select('sia_TurnadosJuridico.*','p.saludo','p.nombre','p.paterno','p.materno')
                                    ->join('sia_puestosJuridico as p','p.idPuestoJuridico','=','sia_TurnadosJuridico.idUsrReceptor')
                                    ->where('sia_TurnadosJuridico.idVolante',"$id")->get();
        return $turnos;
    }

}