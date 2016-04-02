"use strict";

var last = {};

function send() {

	last = {};

	for( var i = 0; i < arguments.length; i++ ) {
		var line = arguments[i];

		var delimiterPosition = line.indexOf( '=' );
		var name = line.substr( 0, delimiterPosition );
		var value = line.substr( delimiterPosition + 1 );

		last[ name ] = value;

	}

}

function getField( name ) {

	return last[ name ];

}

module.exports = {
	send: send,
	getField: getField
};
