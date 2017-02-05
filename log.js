"use strict";

var journal = require( './build/Release/journal_send.node' );

var stackTraceRE = /at ([^\ ]+) \(([^:]+):([0-9]+):[0-9]+\)$/;

function obj2journalFields( journalFields, obj, prefix ) {

	if( prefix === undefined ) prefix = '';

	// Go through all fields
	for( var o in obj ) {
		var name = o.toUpperCase();
		if( typeof obj[o] == 'object' ) {
			obj2journalFields( journalFields, obj[o], prefix + name + "_" );
		} else if( obj[o] !== undefined && ( prefix.length > 0 || name != 'PRIORITY' ) ) {
			journalFields[ prefix + name ] = obj[o].toString();
		}
	}

}

function log( priority, message, fields, defaultFields ) {

	// If we haven't got a message, throw an error
	if( message === undefined ) {
		throw new Error( "Please specify a message" );
	}

	// Make sure fields is an object
	if( typeof fields != 'object' ) fields = {};
	if( typeof defaultFields != 'object' ) defaultFields = {};

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
				defaultFields.code_file = re[2];
				defaultFields.code_func = re[1];
				defaultFields.code_line = re[3];
			}

		}

	} else if( typeof message != 'string' ) {

		message = message.toString();

	}

	var journalFields = {};

	// Add default journal fields
	obj2journalFields( journalFields, defaultFields );

	// Add journal fields - they may override the default fields
	obj2journalFields( journalFields, fields );

	// Add message
	journalFields.MESSAGE = message;

	// Convert journal fields to iovec
	var iovec = [];
	for( var key in journalFields ) {
		iovec.push( key + "=" + journalFields[ key ] );
	}

	// Send it to our beloved journald
	journal.send.apply( null, [ parseInt( priority ) ].concat( iovec ) );

}

module.exports = log;
