// Down below you will find the most intuitive code you probably ever saw on the
// Internet. It just copies an ordinary JavaScript string array into an iovec
// and then finally calls sd_journal_sendv. Rocket science included!

#include <nan.h>

void send( const Nan::FunctionCallbackInfo<v8::Value>& args ) {

	int argc = args.Length();
	struct iovec iov[ argc ];

	// Make sure nobody forgot the arguments
	if( argc == 0 ) {
		Nan::ThrowTypeError( "Wrong number of arguments" );
		return;
	}

	// Copy all arguments to an iovec
	for( int i = 0; i < argc; i++ ) {

		// First ensure that the argument is a string
		if( ! args[0]->IsString() ) {
			Nan::ThrowTypeError( "Arguments must be string" );
			return;
		}

		// Put string into the iovec
		v8::Local<v8::String> arg = args[i]->ToString();
		iov[i].iov_len = arg->Length();
		iov[i].iov_base = (char*) malloc( arg->Length() + 1 );
		arg->WriteUtf8( (char*) iov[i].iov_base, iov[i].iov_len );

	}

	// TODO: DUMMY
	int ret = argc;

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
