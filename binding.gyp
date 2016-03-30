{
	"targets": [ {
		"target_name":  "journal_send",
		"sources":      [ "src/journal_send.cc" ],
		"include_dirs": [ "<!(node -e \"require('nan')\")" ]
	} ]
}
