const $ = require('jquery')

module.exports = class {
	
	constructor(){
		$('table#main-table tbody tr').click(function(){
			
			let id = $(this).children().first().text()
			let ruta = $(this).data('ruta')
			location.href = `/SIA/juridico/${ruta}/${id}`
		})
	}

	cancel(){
		$('button#cancelar').click(function(e){
			e.preventDefault()
			let ruta = $('form').data('ruta')	
			location.href = `/SIA/juridico/${ruta}`
		})
		
	}
}