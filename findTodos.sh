#!/bin/bash

type aha >/dev/null 2>&1 || { echo >&2 "I require aha to highlight matches, but cannot find it. Please run 'brew install aha' before continuing."; return; }

#/**
# *  Lists all the places that we reference @TODO, and include line contexts around it     
# *                                                                                        
# *  Supports the following flags:                                                         
# *   -m (the message text to search for) - supports egrep. ex: US129, defaults to @TODO   
# *   -c - flag - if set, will list all the commits and messages that match                
# *   -o (file/to/save) - where to store the results. defaults to show to screen   
# *   -r - flag - ignores resource files                                                   
# *   -h - shows this help                                                                 
# *  Lists all the places that we reference @TODO, and include line contexts around it     
# *                                                                                        
#**/

messageSearch="@TODO"
outParam=""
contextSize=0;
excludeResources=''

showHelp(){
	echo "Lists all the places that we reference @TODO, and include line contexts around it     "   
	echo "                                                                                      "
	echo "Supports the following flags:                                                         "
	echo " -m (the message text to search for) - supports egrep. ex: US129, defaults to @TODO   "
	echo " -c - flag - if set, will list all the commits and messages that match                "
	echo " -o (file/to/save) - where to store the results. defaults to show to screen           "
	echo " -r - flag - ignores resource files                                                   "
	echo " -h - shows this help                                                                 "
}

OPTIND=1
while getopts "rm:c:o:h" opt; do
	#echo "opt[${opt}]"
	case $opt in
		r)
			excludeResources=' --exclude *.resource'
			;;
		m)
			messageSearch="${OPTARG}"
			;;
		c)
			contextSize="${OPTARG}"
			;;
		o)
			outParam="${OPTARG}"
			;;
		h)
			showHelp
			return;
			;;
		\?)
			echo "Invalid option: -$OPTARG" >&2
			showHelp
			return;
			;;
	esac
done

#echo "messageSearch[${messageSearch}]"
#echo "outParam[${outParam}]"
#echo "contextSize[${contextSize}]"

#use as an example to ask for more
if [ -z "${messageSearch}" ]; then
	#- should never get here, the default will take hold
	echo "What should we search for in the messages?"
	read messageSearch
fi


if [ -z "${outParam}" ]; then	
	grep -r -n -i -C "${contextSize}" --color=always -I -H --exclude \*.permissionset ${excludeResources} "${messageSearch}" src
else
	grep -r -n -i -C "${contextSize}" --color=always -I -H --exclude \*.permissionset ${excludeResources} "${messageSearch}" src | aha --title "${messageSearch} used" --line-fix --black > "${outParam}"
	open "${outParam}"
fi

