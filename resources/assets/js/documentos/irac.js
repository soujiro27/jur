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
			let val = $(this).val()
			let id = $(this).data('id')
			if(!validator.isEmpty(val)) {
				let promesa = co(function*(){
					let datos = yield api.load_documentos_turnados(id,val)
					let tabla = self.construct_tables_documentos(datos,id)
					$('form#irac').html(tabla)
					self.upload_files()
				})
			}
		})
	}

	construct_tables_documentos(datos,id) {
		let html = require('./table-documentos.html')
		let tr = ''
		for(let x in datos) {
			tr += `<tr><td>${datos[x].archivoFinal}</td><td>${datos[x].fAlta}</td><td>${datos[x].comentario}</td></tr>`
		}

	
		let nombre = datos[0].saludo + ' ' + datos[0].nombre + ' ' + datos[0].paterno + ' ' + datos[0].materno

		let res = html.replace(':nombre:',nombre)
				.replace(':documentos:',tr)
				.replace(':turnado:',datos[0].idTurnadoJuridico)
				.replace(':volante:',id)

		return res
	}

	upload_files(){
		$('button#add_document').click(function(e){
			e.preventDefault()
			let id = $(this).data('id')
			let volante = $(this).data('volante')
			let html = require('./upload-form.html')
			html = html.replace(':idTurnado:',id).replace(':idVolante:',volante)
			modal.upload_files(html,id)
		})
	}

}