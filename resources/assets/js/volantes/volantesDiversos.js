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

module.exports = class VolantesDiversos {

    load_subDocumentos(){
		let self = this
		$('select#volantesDiversos').change(function(){
			let val = $(this).val()
			let promesa = co (function*(){
				let sub = yield api.load_subDocumentos_volantesDiversos(val)
				
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
    
    load_remitentes(){
        $('select#tipoRemitente').change(function(){
            let val = $(this).val()
                modal.turnados_volates_diversos(val)
        })
    }

    
}