require("jquery-ui-browserify");
const $ = require('jquery')
const confirm = require('jquery-confirm')
const co = require('co')
const Promise = require('bluebird')
const funciones = require('./modal_functions')

const funcion = new funciones()

module.exports = class modalsIrac {

	load_select_turnado(html,id){
		$.confirm({
			title: 'Selecciona a quien se turnara el Documento',
			content : html,
			icon:'fa fa-question-circle',
			type:'blue',
			columnClass: 'col-md-11 col-md-offset-1',
			draggable:false,
			buttons:{
				confirm:{
					btnClass:'btn-primary',
					text:'Guardar',
					action:function(){
						
						let idPuesto = $('input:radio[name=personal]:checked').val()
						let coment = $('textarea#comentario').val()
						let prioridad = $('select#prioridad :checked').val();
						funcion.save_turnado_irac(id,idPuesto,coment,prioridad)
					}
				},
				cancel:{
					btnClass:'btn-red',
					text:'Cancelar'
				}
			},
			onOpenBefore:function(){
				$('input#personal').click(function(){

					$('table#table-personal').hide()
					$('div#observaciones').show()
					$('span.jconfirm-title').text('Añadir Una Observacion')
				})
			}
		})
	}

	upload_files(html) {
		$.confirm({
			title: 'Anexar Documento',
			content : html,
			icon:'fa fa-question-circle',
			type:'blue',
			columnClass: 'col-md-11 col-md-offset-1',
			draggable:false,
			buttons:{
				confirm:{
					text:'Guardar',
					btnClass:'btn-primary',
					action:function(){
						var inputFileImage = document.getElementById("uploadFile");
        				var file = inputFileImage.files[0];
						var data = new FormData()
						data.append('archivo',file)
						$.post({
							url:'/SIA/juridico/api/upload',
							contentType:false,
							data:data,
							processData:false,
							cache:false,
							success:function(res) {
								console.log(res)
							}
						})
					}
				},
				cancel:{
					text:'Cancelar',
					btnClass:'btn-red'
				}
			}
		})
	}
}