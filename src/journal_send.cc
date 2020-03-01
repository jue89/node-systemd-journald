// Down below you will find the most intuitive code you probably ever saw on the
// Internet. It just copies an ordinary JavaScript string array into an iovec
// and then finally calls sd_journal_sendv. Rocket science included!


#include <nan.h>

#include <v8.h>
// Instead of the locations being this file, let the user define their own
// CODE_FILE, CODE_LINE and CODE_FUNC, via stack trace (ex: npm callsite)
#define SD_JOURNAL_SUPPRESS_LOCATION 1
#include <systemd/sd-journal.h>

// Priority is a special case as it needs to be taken from the syslog.h
// preprocessor definitions, which aren't available from JavaScript.
#include <syslog.h>

// Macros for int to string conversion
#define TO_STR_H(x) "" #x
#define TO_STR(x) TO_STR_H(x)

// Create an array of all Syslog priority numbers
#define SYSLOG_PRIO_CNT 8
const char *const syslogPrio[] = {
	TO_STR( LOG_EMERG ),   // jsPrio: 0
	TO_STR( LOG_ALERT ),   // jsPrio: 1
	TO_STR( LOG_CRIT ),    // jsPrio: 2
	TO_STR( LOG_ERR ),     // jsPrio: 3
	TO_STR( LOG_WARNING ), // jsPrio: 4
	TO_STR( LOG_NOTICE ),  // jsPrio: 5
	TO_STR( LOG_INFO ),    // jsPrio: 6
	TO_STR( LOG_DEBUG )    // jsPrio: 7
};

#define PRIO_FIELD_NAME "PRIORITY="
#define PRIO_FIELD_NAME_LEN 9

NAN_METHOD( send ) {
	int argc = info.Length();
	struct iovec iov[ argc ];

	// Make sure nobody forgot the arguments
	if( argc < 2 ) {
		Nan::ThrowTypeError( "Not enough arguments" );
		return;
	}

	Nan::MaybeLocal<v8::Integer> priorityArg = Nan::To<v8::Integer>(info[0]);

	// Make sure first argument is a number
	if( priorityArg.IsEmpty() ) {
		Nan::ThrowTypeError( "First argument must be a number" );
		return;
	}

	// Get the priority
	int64_t jsPrio = priorityArg.ToLocalChecked()->Value();
	if( jsPrio < 0 || jsPrio >= SYSLOG_PRIO_CNT ) {
		Nan::ThrowTypeError( "Unknown priority" );
		return;
	}

	// Convert JavaScript priority to Syslog priority
	size_t strLen = PRIO_FIELD_NAME_LEN + strlen( syslogPrio[jsPrio] );
	iov[0].iov_len = strLen;
	iov[0].iov_base = (char*) malloc( strLen + 1 );
	snprintf( (char*) iov[0].iov_base, strLen + 1,
	          "%s%s", PRIO_FIELD_NAME, syslogPrio[jsPrio] );


	// Copy all remaining arguments to the iovec
	for( int i = 1; i < argc; i++ ) {
		Nan::MaybeLocal<v8::String> strArg = Nan::To<v8::String>(info[i]);
		// First ensure that the argument is a string
		if( strArg.IsEmpty() ) {
			Nan::ThrowTypeError( "Arguments must be strings" );
			return;
		}

		// Put string into the iovec
		v8::Local<v8::String> arg = strArg.ToLocalChecked();
		Nan::Utf8String charVal(arg);
		iov[i].iov_len = charVal.length();
		iov[i].iov_base = strdup( *charVal );
	}

	// Send to journald
	int ret = sd_journal_sendv( iov, argc );

	// Free the memory again
	for( int i = 0; i < argc; i++ ) {
		free( iov[i].iov_base );
	}

	v8::Local<v8::Number> returnValue = Nan::New( ret );
	info.GetReturnValue().Set( returnValue );
}

NAN_MODULE_INIT( init ) {
	NAN_EXPORT(target, send);
}

NODE_MODULE( journal_send, init )
