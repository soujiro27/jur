<?php 
namespace App\Controllers;
use App\Models\Catalogos\SubTiposDocumentos;
use App\Models\Api\Auditorias;
use App\Models\Api\AuditoriasUnidades;
use App\Models\Api\Unidades;
use App\Models\Volantes\Volantes;
use App\Models\Volantes\VolantesDocumentos;
use App\Models\Volantes\Remitentes;
use App\Models\Catalogos\PuestosJuridico;
use App\Models\Documentos\TurnadosJuridico;

class ApiController {

	#trae los subdocumentos que concuerden con el documento (idTipoDocto) de la tabla de sia_catSubTiposDocumentos
	public function load_subDocumentos_volantes(array $dato){
		$tipo = $dato['dato'];
		$res = SubTiposDocumentos::select('idSubTipoDocumento as valor','nombre')
				->where('idTipoDocto',"$tipo")
				->where('auditoria','SI')
				->where('estatus','ACTIVO')
				->get();
		if($res->isEmpty()){
			$res = array('error' => 'No hay ningun Sub-Documento Asignado', );
		}
		echo json_encode($res);
	}

	public function load_subDocumentos_volantesDiversos(array $dato){
		$tipo = $dato['dato'];
		$res = SubTiposDocumentos::select('idSubTipoDocumento as valor','nombre')
				->where('idTipoDocto',"$tipo")
				->where('auditoria','NO')
				->where('estatus','ACTIVO')
				->get();
		if($res->isEmpty()){
			$res = array('error' => 'No hay ningun Sub-Documento Asignado', );
		}
		echo json_encode($res);
	}

	#trae los datos de la auditoria mediante el numero 
	public function load_datos_auditoria(array $dato){

		if(empty($dato['clave'])){
			$datosAuditoria = array('error' => 'La Auditoria NO existe', );
		}else{
			$cveAuditoria = 'ASCM/'.$dato['clave'].'/'.$dato['cuenta'];
			
			$datos = Auditorias::select('idAuditoria', 'tipoAuditoria','rubros','idArea')
			->where('clave',"$cveAuditoria")
			->get();

			if($datos->isEmpty()){
				$datosAuditoria = array('error' => 'La Auditoria NO existe', );
			}else{
				$idAuditoria = $datos[0]['idAuditoria'];

				$unidades = AuditoriasUnidades::select('idCuenta','idSector','idSubsector','idUnidad')
				->where('idAuditoria',"$idAuditoria")
				->get();

				$sector = $unidades[0]['idSector'];
				$subSector = $unidades[0]['idSubsector'];
				$unidad = $unidades[0]['idUnidad'];
				$cuenta = $unidades[0]['idCuenta'];

				$unidades = Unidades::select('nombre')
				->where('idSector',"$sector")
				->where('idSubsector',"$subSector")
				->where('idUnidad',"$unidad")
				->where('idCuenta',"$cuenta")
				->get();

				
				$datosAuditoria = array(
					'sujeto' => $unidades[0]['nombre'],
					'tipo' => $datos[0]['tipoAuditoria'],
					'rubro' => $datos[0]['rubros'],
					'id' => $datos[0]['idAuditoria'],
					'idArea' => $datos[0]['idArea']
				);		
			}
		}

		
		echo json_encode($datosAuditoria);
	} 

	#trae los datos de aquien fue turnado el ifa, el irac y la confronta por numero de auditoria 
	public function load_turnado_auditoria(array $dato) {

		if(empty($dato['clave']))
		{
			$turnos  = array('error' => 'No Hay Datos', );
		}else{

			$clave = 'ASCM/'.$dato['clave'].'/'.$dato['cuenta'];

			$datos = Auditorias::select('idAuditoria', 'tipoAuditoria','rubros')
			->where('clave',"$clave")
			->get();
			
			$idAuditoria = $datos[0]['idAuditoria'];		

			$turnos = VolantesDocumentos::select('sub.nombre','v.idTurnado')
			->join('sia_volantes as v','v.idVolante','sia_volantesDocumentos.idVolante')
			->join('sia_catSubTiposDocumentos as sub','sub.idSubTipoDocumento','sia_volantesDocumentos.idSubTipoDocumento')
			->where('sia_volantesDocumentos.cveAuditoria',"$idAuditoria")
			->get();
		}
		echo json_encode($turnos);
	
	}

	public function load_turnado_volantes(array $data) {
		$tipo = $data['tipo'];
		$sigla = $data['siglas'];
         $remitentes  = Remitentes::where('estatus','=','ACTIVO')
        ->where('tipoRemitente','=',"$tipo")
        ->where('siglasArea','like',"%".$sigla)
        ->get();
        echo json_encode($remitentes);
	}

	public function load_puestos_juridico(array $data) {
		$idVolante = $data['idVolante'];
		$volantes = Volantes::select('idTurnado')->where('idVolante',"$idVolante")->get();
		$area = $volantes[0]['idTurnado'];

		$personal = PuestosJuridico::where('idArea',"$area")
									->where('titular','No')
									->where('estatus','ACTIVO')
									->get();
		echo json_encode($personal);
	}

	public function load_documentos_turnados(array $data) {
		$idVolante = $data['idVolante'];
		$idPuesto = $data['idPuesto'];

		$documentos = TurnadosJuridico::select('sia_TurnadosJuridico.idTurnadoJuridico',
			'a.archivoOriginal', 'a.archivoFinal', 'a.idTipoArchivo', 'a.fAlta' ,'a.comentario',
			'p.saludo','p.nombre', 'p.paterno','p.materno')
			->leftJoin('sia_AnexosJuridico as a','a.idTurnadoJuridico','=','sia_TurnadosJuridico.idTurnadoJuridico')
			->join('sia_PuestosJuridico as p','p.idPuestoJuridico','=','sia_TurnadosJuridico.idUsrReceptor')
			->where('sia_TurnadosJuridico.idUSrReceptor',"$idPuesto")
			->where('sia_TurnadosJuridico.idVolante',"$idVolante")
			->get();

        echo json_encode($documentos);
	}

	public function upload_files($data,$file) {
		var_dump($data);
		var_dump($file);
	}
}