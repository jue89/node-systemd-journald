"use strict";

var journal = require( './build/Release/journal_send.node' );

var stackTraceRE = /at ([^\ ]+) \(([^:]+):([0-9]+):[0-9]+\)$/;

function obj2iovec( iovec, obj, prefix ) {

	if( prefix === undefined ) prefix = '';

	// Go through all fields
	for( var o in obj ) {
		var name = o.toUpperCase();
		if( typeof obj[o] == 'object' ) {
			obj2iovec( iovec, obj[o], prefix + name + "_" );
		} else if( obj[o] !== undefined && (prefix.length > 0 || (name != 'PRIORITY' && name != 'MESSAGE')) ) {
			iovec.push( prefix + name + '=' + obj[o].toString() );
		}
	}

}

function log( priority, message, fields ) {

	// If we haven't got a message, throw an error
	if( message === undefined ) {
		throw new Error( "Please specify a message" );
	}

	// Make sure fields is an object
	if( typeof fields != 'object' ) {
		fields = {};
	}

	// If the message is an instnce of Error, extract its message
	if( message instanceof Error ) {

		var stack = message.stack.toString();

		// Store stack trace and message
		fields.STACK_TRACE = stack;
		message = message.message;

		// Try to extract callee name, line and file
		var tmp = stack.split('\n');
		if( tmp.length >= 2 ) {

			// Second line knows the error source
			var errSource = tmp[1];

			// Match regular expression and add info to iovec
			var re = stackTraceRE.exec( errSource );
			if( re !== null ) {
				fields.CODE_FILE = re[2];
				fields.CODE_FUNC = re[1];
				fields.CODE_LINE = re[3];
			}

		}

	} else if( typeof message != 'string' ) {

		message = message.toString();

	}

	var iovec = [];

	// Add default fields
	iovec.push( "MESSAGE=" + message );

	// Add additional fields
	obj2iovec( iovec, fields );

	// Send it to our beloved journald
	journal.send.apply( null, [ parseInt( priority ) ].concat( iovec ) );

}


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
