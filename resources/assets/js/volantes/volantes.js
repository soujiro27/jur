/*---------- carga de libnrerias y archivos externos ----------------*/
const $ = require('jquery')
const co = require('co')
const Promise = require('bluebird')
const apis = require('./../api')
const validator = require('validator')
const modals = require('./modal')
/*------------------- Constructor de las funciones ------------------*/

const api = new apis()
const modal = new modals()


/*-------------------- Clase ---------------------------------------*/

module.exports = class Volantes {
	
	load_subDocumentos(){
		let self = this
		$('select#idDocumentoAuditoria').change(function(){
			let val = $(this).val()
			let promesa = co (function*(){
				let sub = yield api.load_subDocumentos_volantes(val)
				
				if(sub.error){
					$('div#error-frontend').show().html(`<p>${sub.error}</p>`)
					$('select#subDocumento').html('<option value="">Sin Datos</option>')
				}else{
					$('div#error-frontend').hide()
					let opt = self.construct_option_subDocumentos(sub)
					$('select#subDocumento').html(opt)
				}
			})
		})
	}

	construct_option_subDocumentos(data){
		console.log(data)
		let opt = '<option value="">Escoga una Opcion</option>'
		for(let x in data){
			opt += `<option value="${data[x].valor}">${data[x].nombre}</option>`
		}

		return opt
	}

	load_opciones(){
		$('select#subDocumento').change(function(){
			let sub = $('select#subDocumento :selected').text()
			let doc = $('select#idDocumentoAuditoria :selected').val()
			if( doc==='OFICIO' && sub==='CONFRONTA' ){
				modal.nota_informativa()
			}else if( doc==='OFICIO' && sub==='DICTAMEN'){
				modal.select_cuenta_publica()
			}
		})
	}

	load_modal_auditoria(){
		$('button#modalAuditoria').click(function(event){
			event.preventDefault()
			modal.load_select_auditoria()
		})
	}



	
}

