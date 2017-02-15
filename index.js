"use strict";

var log = require( './log.js' );


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

// Class for journald stuff
function Journald( defaultFields ) {

	// Keep the default fields in an instance
	if( typeof defaultFields != 'object' ) defaultFields = {};
	this._defaultFields = defaultFields;

}

// Create logging methods
for( var l in levels ) { ( function( prio, name ) {

	// The static method is available for users without the need for default fields
	Journald[ name ] = function( message, fields ) {
		log( prio, message, fields );
	};

	// And the class method includes the default fields
	Journald.prototype[ name ] = function( message, fields ) {
		log( prio, message, fields, this._defaultFields );
	};

} )( l, levels[ l ] ); }


module.exports = Journald;
