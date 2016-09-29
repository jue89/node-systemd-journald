"use strict";

var lastField = {};
var lastPrio = 0;

function send( prio ) {

	lastPrio = prio;

	lastField = {};

	for( var i = 1; i < arguments.length; i++ ) {
		var line = arguments[i];

		var delimiterPosition = line.indexOf( '=' );
		var name = line.substr( 0, delimiterPosition );
		var value = line.substr( delimiterPosition + 1 );

		lastField[ name ] = value;

	}

}

function getField( name ) {
	return lastField[ name ];
}

function getPrio() {
	return lastPrio;
}

module.exports = {
	send: send,
	getField: getField,
	getPrio: getPrio
};
