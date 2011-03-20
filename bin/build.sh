#!/bin/bash

# Best build script EVAR.

TMP="./tmp"
STACKTRACE="./external/javascript-stacktrace/stacktrace.js"
EXCEPTION_NOTIFIER="./tmp/detect-browser.js ./tmp/exception-notifier.js"

###

mkdir $TMP

coffee -o $TMP -c ./lib/detect-browser.coffee
coffee -o $TMP -c ./lib/exception-notifier.coffee

cat $STACKTRACE $EXCEPTION_NOTIFIER  > ./build/cf-exception-notifier-full.js
cat $EXCEPTION_NOTIFIER > ./build/cf-exception-notifier-no-stacktrace.js

rm -r $TMP
