require("jquery-ui-browserify");
const $ = require('jquery')
const confirm = require('jquery-confirm')
const co = require('co')
const Promise = require('bluebird')
const funciones = require('./modal_functions')
const apis = require('./../api')

const funcion = new funciones()
const api = new apis()

module.exports = class modalsVolantes {
	
	nota_informativa(){
		$.confirm({
			title: 'Nota Informativa Confronta',
			content : '¿El Oficio Contiene Nota Informativa?',
			icon:'fa fa-question-circle',
			type:'blue',
			columnClass: 'col-md-4 col-md-offset-1',
			draggable:false,
			buttons: {
				confirm:{
					text : 'SI',
					btnClass:'btn-primary',
					action:function(){
						$('input#notaConfronta').val('SI')
					}
				},
				cancel:{
					text: 'NO',
					btnClass:'btn-red',
					action:function(){
						$('input#notaConfronta').val('NO')
					}
				}
			}
		})
	}

	select_cuenta_publica(){
		let html = require('./cuenta.html')
		$.confirm({
			title: 'Cuenta Publica',
			content : html,
			icon:'fa fa-archive',
			type:'blue',
			columnClass: 'col-md-4 col-md-offset-1',
			draggable:false,
			buttons: {
				confirm:{
					text : 'SI',
					btnClass:'btn-primary',
					action:function(){
						let cuenta = $('select#cuenta :selected').val()
						funcion.load_cuenta_publica(cuenta)
					}
				},
				cancel:{
					text: 'NO',
					btnClass:'btn-red'
				}
			}
		})	
	}


	load_select_auditoria(){
		let html = require('./select_auditoria.html')
		$.confirm({
			title: 'Auditoria',
			content : html,
			icon:'fa fa-book',
			type:'blue',
			columnClass: 'col-md-11 col-md-offset-1',
			draggable:false,
			onOpenBefore:function(){
				let cuenta = $('input#cta-publica').val()
				cuenta = cuenta.substring(4)
				$('strong#cuenta').text(cuenta)
				funcion.load_datos_auditoria(cuenta)
			},
			buttons:{
				confirm:{
					text : 'Aceptar',
					btnClass:'btn-primary',
					action:function(){
						let data = $('input#clave-auditoria').val()
						let ano = $('input#ano-auditoria').val()
						let clave = $('input#id-auditoria').val()
						let area =$('input#remitente').val()
						if(data !=0 ){
							$('input#cveAuditoria').val(clave)
							$('span#auditoria').text(`ASCM/${data}/${ano}`)
							$('input#idRemitente').val(area)
						}else{
							$('span#auditoria').text('Numero de Auditoria No valido')
							$('input#cveAuditoria').val('0')
							$('input#idRemitente').val('0')
						}
					}
				}
			}
		})
	}

	turnados_volates_diversos(tipo) {
		$.confirm({
			title: 'Seleccione el Remitente',
			content : '<input type="text" placeholder="Ingrese Siglas del Puesto" id="siglasRemitente" class="form-control"><div id="tablaRemitentes"></div>',
			icon:'fa fa-question-circle',
			type:'blue',
			columnClass: 'col-md-12 ',
			draggable:false,
			onOpenBefore:function(){
				$('input#siglasRemitente').keyup(function(){
					let val = $(this).val()
					let promesa = co(function*(){
						let datos = yield api.remitentes_volantes(tipo,val)
						let tabla = funcion.construct_tabla_turnado_volantes_diversos(datos)
						$('div#tablaRemitentes').html(tabla)
					})
				})
			},
			buttons:{
				confirm:{
					text:'Aceptar',
					btnClass:'btn-primary',
					action:function(){
						let val = $('input:radio[name=remitente]:checked').val()
						$('input#idRemitenteJuridico').val(val)

						let siglas = $('input:radio[name=remitente]:checked').data('siglas')
						$('input#idRemitente').val(siglas)

						let nombre = $('input:radio[name=remitente]:checked').parent().next().text()
						$('input#nombreRemitente').val(nombre)

						let puesto = $('input:radio[name=remitente]:checked').parent().next().next().text()
						$('input#puestoRemitente').val(puesto)
					}	
				}
			}
		})
	}

}

