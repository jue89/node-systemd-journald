// Down below you will find the most intuitive code you probably ever saw on the
// Internet. It just copies an ordinary JavaScript string array into an iovec
// and then finally calls sd_journal_sendv. Rocket science included!
// Priority is a special case as it needs to be taken from the syslog.h
// preprocessor definitions, which aren't available from JavaScript.

#include <nan.h>
#include <systemd/sd-journal.h>
#include <syslog.h>

#define to_str_h(x) "" #x
#define to_str(x) to_str_h(x)

void setIovec( struct iovec *iov, const char *priorityStr ) {
	size_t strLength = strlen(priorityStr) + 9;
	iov->iov_len = strLength;
	iov->iov_base = (char*) malloc( strLength + 1 );
	snprintf((char*) iov->iov_base, strLength + 1, "PRIORITY=%s", priorityStr);
}

void send( const Nan::FunctionCallbackInfo<v8::Value>& args ) {

	int argc = args.Length();
	struct iovec iov[ argc ];
	int64_t priority = ( args[0]->ToInteger() )->Value();

	// Make sure nobody forgot the arguments
	if( argc == 0 ) {
		Nan::ThrowTypeError( "Wrong number of arguments" );
		return;
	}

	// Copy all arguments to an iovec
	for( int i = 1; i < argc; i++ ) {

		// First ensure that the argument is a string
		if( ! args[i]->IsString() ) {
			Nan::ThrowTypeError( "Arguments must be strings" );
			return;
		}

		// Put string into the iovec
		v8::Local<v8::String> arg = args[i]->ToString();
		iov[i].iov_len = arg->Length();
		iov[i].iov_base = (char*) malloc( arg->Length() + 1 );
		arg->WriteUtf8( (char*) iov[i].iov_base, iov[i].iov_len );

	}

	// Add correct priority
	const char *strLogDebug = to_str(LOG_DEBUG);
	const char *strLogInfo = to_str(LOG_INFO);
	const char *strLogNotice = to_str(LOG_NOTICE);
	const char *strLogWarning = to_str(LOG_WARNING);
	const char *strLogErr = to_str(LOG_ERR);
	const char *strLogCrit = to_str(LOG_CRIT);
	const char *strLogAlert = to_str(LOG_ALERT);
	const char *strLogEmerg = to_str(LOG_EMERG);
	switch( priority ) {
		case 70:
		setIovec( &iov[0], strLogDebug );
		break;

		case 60:
		setIovec( &iov[0], strLogInfo );
		break;

		case 50:
		setIovec( &iov[0], strLogNotice );
		break;

		case 40:
		setIovec( &iov[0], strLogWarning );
		break;

		case 30:
		setIovec( &iov[0], strLogErr );
		break;

		case 20:
		setIovec( &iov[0], strLogCrit );
		break;

		case 10:
		setIovec( &iov[0], strLogAlert );
		break;

		default:
		setIovec( &iov[0], strLogEmerg );
	}

	// Send to journald
	int ret = sd_journal_sendv( iov, argc );

	// Free the memory again
	for( int i = 0; i < argc; i++ ) {
		free( iov[i].iov_base );
	}

	v8::Local<v8::Number> returnValue = Nan::New( ret );
	args.GetReturnValue().Set( returnValue );

}

void init( v8::Local<v8::Object> exports ) {

	exports->Set(
		Nan::New("send").ToLocalChecked(),
		Nan::New<v8::FunctionTemplate>( send )->GetFunction()
	);

}

NODE_MODULE( journal_send, init )
