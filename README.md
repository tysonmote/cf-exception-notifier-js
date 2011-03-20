cf-exception-notifier-js
========================

JavaScript exception details delivered hot and fresh to your door.

`CF.ExceptionNotifier` catches and POSTs JavaScript exception details to you so 
that you can focus on whatever else it is you focus on, you idea-trepreneur, 
you. Deploy with reckless abandon!

Keep in mind that the current landscape of browser exception handling is a
wasteland of sadness and despair. The best you can get out of most browsers is
a vague error description (e.g. "PC LOAD LETTER"). `CF.ExceptionNotifier` 
optionally makes use of [`stacktrace.js`][stacktrace-js] to conjure something 
that resembles a proper stacktrace, but it's no substitute for an in-browser 
stacktrace.

Dependencies
------------

`CF.ExceptionNotifier` currently depends on MooTools Core 1.2.x. and is not
tested with MooTools 1.3. Open a pull request if something's broken or, better
yet, if you remove the MooTools dependency in some crafty way.

Setup
-----

    new CF.StacktraceNotifier({ url: '/exceptions' });

This should be done immediately after MooTools is loaded, before any other
scripts are loaded. Any events that are attached before this line will not be
able to provide stacktraces.

Options
-------

`CF.StacktraceNotifier` accepts the following options. All options are, err,
optional.

*   `url`: URL to `POST` exceptions to. Default: `"/js_exceptions"`
*   `stacktraces`: If `true`, stacktraces are included. Default: `true`
*   `duplicates`: If `false`, duplicate errors will not be sent. Default: 
    `false`

Example post:
-------------

    {
      js_exception: {
        message: "Uncaught TypeError: undefined is not a function"
        stacktrace: "CALL_NON_FUNCTION_AS_CONSTRUCTOR (native)...",
        url: "http://example.com/foo/",
        error_source: "http://example.com/js/broken.js",
        error_line: "82",
        environment: "Mac Chrome 10",
      }
    }

*  `message`: The browser's basic error message.
*  `stacktrace`: *(optional)* An approximate stacktrace. Some browsers provide
    better stacktraces than others. Newline separated.
*  `url`: The URL of the page on which the error occurred.
*  `error_source`: The file in which the error occurred. If the error occurred
   in inline JavaScript on the page, this will be the same as `url`.
*  `error_line`: The line on which the error occurred.
*  `environment`: The OS and browser on which the error ocurred. $10 says you
   see "Win IE 7" 90% of the time until you go blind with rage and punch a wall.

Compatibility chart
-------------------

Coming soon.

Contributing
------------

Pull requests are your friend.

Contributors
------------

* Brian Hahn
* Tyson Tate

License
-------

Whatever.

[stacktrace-js]: https://github.com/emwendelin/javascript-stacktrace
