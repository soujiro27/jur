const $ = require('jquery')
module.exports = class Api {
	
	// Trae los Subdocumentos dependiendo del tipo de documento
	load_subDocumentos_volantes(tipoDocumento){
		let datos =	new Promise(resolve => {
			$.get({
				url: '/SIA/juridico/api/subDocumentos',
				data:{dato:tipoDocumento},
				success:function(json){
					resolve(JSON.parse(json))
				}
			})
		})

		return datos
	}

	load_subDocumentos_volantesDiversos(tipoDocumento){
		let datos =	new Promise(resolve => {
			$.get({
				url: '/SIA/juridico/api/subDocumentos/diversos',
				data:{dato:tipoDocumento},
				success:function(json){
					resolve(JSON.parse(json))
				}
			})
		})

		return datos
	}

	// Trae los datos de las auditorias por la clave
	load_auditorias_volantes(clave,cuenta){
		let datos = new Promise(resolve=>{
			$.get({
				url: '/SIA/juridico/api/auditoria',
				data:{
					clave:clave,
					cuenta:cuenta
				},
				success:function(json){
					resolve(JSON.parse(json))
				}
			})
		})
		return datos
	}

	load_turnos_volantes(clave,cuenta){
		let datos = new Promise(resolve=>{
			$.get({
				url: '/SIA/juridico/api/auditoria/turnos',
				data:{
					clave:clave,
					cuenta:cuenta
				},
				success:function(json){
					resolve(JSON.parse(json))
				}
			})
		})
		return datos
	}

	remitentes_volantes(dato,sigla) {
		let datos = new Promise(resolve =>{
			$.get({
				url:'/SIA/juridico/api/remitentes',
				data:{
					tipo:dato,
					siglas:sigla
				},
				success:function(json){
					resolve(JSON.parse(json))
				}
			})
		})
		return datos
	}

	load_personal_juridico(idVolante) {
		let datos = new Promise(resolve=>{
			$.get({
				url:'/SIA/juridico/api/puestos',
				data:{idVolante:idVolante},
				success:function(json){
					resolve(JSON.parse(json))
				}
			})
		})

		return datos
	}

	load_documentos_turnados(idVolante,idPuesto){
		let datos = new Promise(resolve=>{
			$.get({
				url:'/SIA/juridico/api/documentosTurnados',
				data:{
					idVolante:idVolante,
					idPuesto:idPuesto
				},
				success:function(json){
					resolve(JSON.parse(json))
				}
			})
		})

		return datos
	}

}