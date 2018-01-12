const $ = require('jquery')
var validator = require('validator');
const apis = require('./../api')
const co = require('co')
const Promise = require('bluebird')
const api = new apis()


module.exports = class modal_function {

	load_cuenta_publica(cuenta){
		if(!validator.isEmpty(cuenta)){
			$('input#cta-publica').val(cuenta)
		}
	}

	load_datos_auditoria(cuenta){
		let self = this
		let digito = cuenta.substring(2)
		$('input#numero-auditoria').keyup(function(event) {
			let numero = $(this).val()
			if(numero.length>0){

				$('span#numero-auditoria').text(`ASCM/${numero}/${digito}`)
				let promesa = co(function *(){
					let datos = yield api.load_auditorias_volantes(numero,digito)
					if(datos.error){
						$('div#errors-auditoria').html(datos.error)
						self.hide_datos_auditoria()
						
					}else{

						let table  = self.construct_table_datos_auditoria(datos)
						$('table#datos-auditoria').show()
						$('table#datos-auditoria tbody').html(table)

						let turnos = yield api.load_turnos_volantes(numero,digito)
						let tableT = self.construct_table_turnados_auditoria(turnos)
						$('table#turnados-auditoria').show()
						$('table#turnados-auditoria tbody').html(tableT)
						$('input#clave-auditoria').val(`${numero}`)
						$('input#ano-auditoria').val(`${digito}`)
						$('input#id-auditoria').val(datos.id)
						$('input#remitente').val(datos.idArea)
					}

				})
			}else{
				self.hide_datos_auditoria()
			}
		});
	}


	hide_datos_auditoria(){
		$('table#datos-auditoria').hide()
		$('table#turnados-auditoria').hide()
		$('input#clave-auditoria').val('0')
		$('input#ano-auditoria').val('0')
		$('input#id-auditoria').val('0')
		$('input#remitente').val('0')

	}

	construct_table_datos_auditoria(data){
		let td = `<tr>
			<td>${data.sujeto}</td>
			<td>${data.rubro}</td>
			<td>${data.tipo}</td>
			</tr>`
		return td
	}

	construct_table_turnados_auditoria(data){
		let td = ''
		for(let x in data){
			td +=`<tr><td>${data[x].nombre}</td><td>${data[x].idTurnado}</td></tr>`
		}
		return td
	}


	construct_tabla_turnado_volantes_diversos(data){
    	let table = '<table class="table"><thead><th>Seleccionar</th><th>Nombre</th><th>Puesto</th></thead><tbody>'
    	$.each(data,function(index,el){
    		table += `<tr><td><input type="radio" name="remitente" value="${el.idRemitenteJuridico}" data-siglas="${el.siglasArea}"></td>
						<td>${el.saludo} ${el.nombre} </td>
						<td>${el.puesto}</td>
					</tr>`	
    	})
    	table += `</tbody></table>`
    	return table
    }

}

