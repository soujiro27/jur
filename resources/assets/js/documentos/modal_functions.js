const $ = require('jquery')
var validator = require('validator');
const apis = require('./../api')
const co = require('co')
const Promise = require('bluebird')


const api = new apis()



module.exports = class iracFunciones {

	save_turnado_irac(id,idPuesto,coment,prioridad) {
		let self = this
		$.post({
			url:'/SIA/juridico/Irac/turno',
			data:{
				idVolante: id,
				idPuestoJuridico: idPuesto,
				comentario: coment,
				prioridad: prioridad
			},
			success:function(json){
				let datos = JSON.parse(json)
				if(datos.errors) {
					self.get_errors(datos)
				} else{
					let body = self.construc_table_turnados(datos)
					$('table#turnadoJuridico tbody').html(body)
				}	
				
			}
		})
	}

	get_errors(json) {

		let error = `<p>${json.errors}</p>`
		let container = $('div#errors')
		container.show()
		container.html(error)
	}

	construc_table_turnados(datos){
		
		let tr = ''
		for(let x in datos) {
			tr += `<tr data-id="${datos[x].idTurnadoJuridico}">
						<td>${datos[x].saludo} ${datos[x].nombre}  ${datos[x].paterno} ${datos[x].materno}</td>
						<td>${datos[x].idEstadoTurnado}</td>
						<td>${datos[x].idTipoPrioridad}</td>
						<td>${datos[x].fAlta}</td>
					</tr>`
		}
		return tr
	}

	upload_files(id) {
		let self = this
		var formData = new FormData(document.getElementById("formuploadajax"));
		$.ajax({
			url: '/SIA/juridico/api/upload',
			type: "post",
			dataType: "html",
			data: formData,
			cache: false,
			contentType: false,
			processData: false,
			success:function(json) {
				let res = JSON.parse(json)
				if(res.errors){
					self.get_errors(res)
				} else { 
					self.carga_documentos(res)
				}
			}
		})
		
	}

	carga_documentos(json){
		let self = this
		let promesa = co(function*(){
			let datos = yield api.load_documentos_turnados(json.idVolante,json.idPuestoJuridico)
			let tabla = self.construct_tables_documentos(datos,json.idVolante)
			$('table#documentos tbody').html(tabla)
			
			
		})
	}

		construct_tables_documentos(datos,id) {
		let tr = ''
		for(let x in datos) {
			tr += `<tr><td>${datos[x].archivoFinal}</td><td>${datos[x].fAlta}</td><td>${datos[x].comentario}</td></tr>`
		}
		return tr
	}

	

}