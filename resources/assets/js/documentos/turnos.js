require("jquery-ui-browserify");
const $ = require('jquery')
const confirm = require('jquery-confirm')
const co = require('co')
const Promise = require('bluebird')
const validator = require('validator');

const apis = require('./../api')

const api = new apis()

module.exports = class Turnos {

	table(){
		$('table#main-table-turnados tbody tr ').click(function(){
			let id = $(this).children().first().text()
			location.href = `/SIA/juridico/turnos/${id}`
		})
	}

}