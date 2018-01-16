require('babelify-es6-polyfill')
const $ = require('jquery')

/*------- Llamado a  Funciones Generales -----------*/

const base_Function = require('./base.js')
const volantes = require('./volantes/volantes')
const diversos = require('./volantes/volantesDiversos')
const iracs = require('./documentos/irac')
const turnos = require('./documentos/turnos')
/*------- llamada a las funciones -----------------*/

const base = new base_Function()
const volante = new volantes()
const diverso = new diversos()
const irac = new iracs()
const turno = new turnos()


/*---------- Funciones ----------------------------*/

$('input.fechaInput').datepicker({ dateFormat: "yy-mm-dd" });

base.cancel()
volante.load_subDocumentos()
volante.load_opciones()
volante.load_modal_auditoria()

diverso.load_subDocumentos()
diverso.load_remitentes()

irac.load_turnados()
irac.load_documentos()

turno.table()