"use strict";

var log = require( './log.js' );


module.exports = {};

// Syslog log levels
var levels = [
	'emerg',
	'alert',
	'crit',
	'err',
	'warning',
	'notice',
	'info',
	'debug'
];

// Export a function for every log level
for( var l in levels ) { ( function( prio, name ) {

	module.exports[ name ] = function( message, fields ) {
		log( prio, message, fields );
	};

} )( l, levels[ l ] ); }
