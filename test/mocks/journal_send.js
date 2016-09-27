"use strict";

var last = {};

function send() {

	last = {};

	for( var i = 0; i < arguments.length; i++ ) {
		if( i === 0 ) {
			switch( arguments[i] ) {
				case 70:
				last[ 'PRIORITY' ] = '7';
				break;

				case 60:
				last[ 'PRIORITY' ] = '6';
				break;

				case 50:
				last[ 'PRIORITY' ] = '5';
				break;

				case 40:
				last[ 'PRIORITY' ] = '4';
				break;

				case 30:
				last[ 'PRIORITY' ] = '3';
				break;

				case 20:
				last[ 'PRIORITY' ] = '2';
				break;

				case 10:
				last[ 'PRIORITY' ] = '1';
				break;

				default:
				last[ 'PRIORITY' ] = '0';
				break;
			}

			continue;
		}

		var line = arguments[i];

		var delimiterPosition = line.indexOf( '=' );
		var name = line.substr( 0, delimiterPosition );
		var value = line.substr( delimiterPosition + 1 );

		if( name == 'PRIORITY' ) {
			continue;
		}
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
