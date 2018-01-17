require("jquery-ui-browserify");
const $ = require('jquery')
const confirm = require('jquery-confirm')
const co = require('co')
const Promise = require('bluebird')
const validator = require('validator');

const apis = require('./../api')
const modals = require('./modal')

const api = new apis()
const modal = new modals()

module.exports = class Irac {

	load_turnados(){
		let self = this
		$('button#turnar').click(function(e){
			e.preventDefault()
			let prom = co(function*(){
				let id = $('input#idVolante').val()
				let personal = yield api.load_personal_juridico(id)
				let table = self.construct_table_personal_irac(personal)
				modal.load_select_turnado(table,id)
			})
			
		})
	}

	construct_table_personal_irac(data){
		let html = require('./table.html')
		let tr = ''

		for(let x in data){
			tr += `<tr><td><input type="radio" name="personal" value="${data[x].idPuestoJuridico}" id="personal"></td>
			<td>${data[x].saludo} ${data[x].nombre} ${data[x].paterno} ${data[x].materno}</td>
			<td>${data[x].puesto}</td></tr>`
		}

		let table = html.replace(':tr:',tr)
		return table
	}

	load_documentos(){
		let self = this
		$('select#personal-turnado').change(function(){
			let idPuestoJuridico = $(this).val()
			let id = $(this).data('id')
			if(!validator.isEmpty(idPuestoJuridico)) {
				let promesa = co(function*(){
					let datos = yield api.load_documentos_turnados(id,idPuestoJuridico)
					let tabla = self.construct_tables_documentos(datos)
					$('form#irac').html(tabla)
					
				})
			}
		})
	}

	construct_tables_documentos(datos) {
		let html = require('./table-documentos.html')
		let tr = ''

		for(let x in datos) {
			let usrAlta = parseInt(datos[x].usrAlta)
			
			tr += `<tr>
					<td>${datos[x].fAlta}</td>
					<td>${datos[x].idTipoPrioridad}</td>
					<td>${datos[x].comentario}</td>
					<td>${datos[x].idTipoTurnado}</td>
					`
					if(datos[x].archivoFinal == null){
						tr += `<td>Sin Documentos</td>`
					}else{
						tr += `<td><a href="/SIA/jur/files/documentos/${datos[x].idVolante}/${datos[x].archivoFinal}">${datos[x].archivoFinal}</a></td>`
					}
					
					tr += `</tr>`
		}

		let res = html.replace(':documentos:',tr)
		return res
	}


}