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

module.exports = class Turnos {

	table(){
		$('table#main-table-turnados tbody tr ').click(function(){
			let id = $(this).children().first().text()
			location.href = `/SIA/juridico/turnos/${id}`
		})
	}

	upload_files(){
		$('button#add_document').click(function(e){
			e.preventDefault()
			let id = $(this).data('id')
			let volante = $(this).data('volante')
			let puesto = $(this).data('puesto')
			let html = require('./upload-form.html')
			html = html.replace(':idTurnado:',id)
					.replace(':idVolante:',volante)
					.replace(':puesto:',puesto)
			modal.upload_files(html,id)
		})
	}

}