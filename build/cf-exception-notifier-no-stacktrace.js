(function() {
  if (!window.CF) {
    window.CF = {};
  }
  if (!window.CF.Utils) {
    window.CF.Utils = {};
  }
  CF.Utils.detectBrowser = function() {
    var data, searchString, searchVersion, versionSearchString;
    data = {
      browser: [
        {
          string: navigator.userAgent,
          subString: "Chrome",
          identity: "Chrome"
        }, {
          string: navigator.vendor,
          subString: "Apple",
          identity: "Safari",
          versionSearch: "Version"
        }, {
          prop: window.opera,
          identity: "Opera"
        }, {
          string: navigator.userAgent,
          subString: "Firefox",
          identity: "Firefox"
        }, {
          string: navigator.userAgent,
          subString: "MSIE",
          identity: "Explorer",
          versionSearch: "MSIE"
        }, {
          string: navigator.userAgent,
          subString: "Gecko",
          identity: "Mozilla",
          versionSearch: "rv"
        }
      ],
      OS: [
        {
          string: navigator.platform,
          subString: "Win",
          identity: "Windows"
        }, {
          string: navigator.platform,
          subString: "Mac",
          identity: "Mac"
        }, {
          string: navigator.userAgent,
          subString: "iPhone",
          identity: "iPhone/iPod"
        }, {
          string: navigator.platform,
          subString: "Linux",
          identity: "Linux"
        }
      ]
    };
    versionSearchString = null;
    searchString = function(data) {
      var item, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        item = data[_i];
        versionSearchString = item.versionSearch || item.identity;
        if (item.string) {
          if (item.string.indexOf(item.subString) !== -1) {
            return item.identity;
          }
        } else if (item.prop) {
          return item.identity;
        }
      }
      return _results;
    };
    searchVersion = function(dataString) {
      var end, start;
      start = dataString.indexOf(versionSearchString);
      if (start === -1) {
        return;
      }
      end = start + versionSearchString.length + 1;
      return parseFloat(dataString.substring(end));
    };
    return {
      browser: searchString(data.browser) || "unknown",
      version: searchVersion(navigator.userAgent) || searchVersion(navigator.appVersion) || "unknown",
      OS: searchString(data.OS) || "OS"
    };
  };
}).call(this);
(function() {
  if (!window.CF) {
    window.CF = {};
  }
  CF.ExceptionNotifier = new Class({
    Implements: [Options],
    options: {
      url: "/js_exceptions",
      stacktraces: true,
      duplicates: false
    },
    initialize: function(opts) {
      this.setOptions(opts);
      return this._load();
    },
    count: function() {
      return this._reported.count || 0;
    },
    _load: function() {
      this._attachOnerror();
      return this._wrapAddEvent();
    },
    _attachOnerror: function() {
      if (CF.Utils.detectBrowser().browser !== "Safari") {
        return window.onerror = this._onerror.bind(this);
      }
    },
    _onerror: function(message, source, line) {
      var stacktrace;
      if (this.options.duplicates || !this._reported(message, source, line)) {
        stacktrace = this._stack || null;
        this._report(message, source, line, stacktrace);
        this._markReported(message, source, line);
      }
      delete this._stack;
      return;
    },
    _wrapAddEvent: function() {
      var doStacktrace, self;
      self = this;
      doStacktrace = this.options.stacktraces && typeof printStackTrace === "function";
      return [Element, Window, Document].each(function(nativeType) {
        var origAddEvent, origRemoveEvent;
        origAddEvent = nativeType.prototype.addEvent;
        origRemoveEvent = nativeType.prototype.removeEvent;
        return nativeType.implement({
          addEvent: function(type, fn) {
            if (!fn) {
              return;
            }
            if (!fn.$wrapper) {
              fn.$wrapper = function() {
                try {
                  return fn.apply(this, arguments);
                } catch (error) {
                  if (doStacktrace) {
                    self._stack = printStackTrace({
                      e: error
                    }).join("\n");
                  }
                  if (!window.onerror) {
                    self._onerror(error.message, error.sourceURL, error.line);
                  }
                  throw error;
                }
              };
            }
            return origAddEvent.call(this, type, fn.$wrapper);
          },
          removeEvent: function(type, fn) {
            if (!fn) {
              return;
            }
            return origRemoveEvent.call(this, type, fn.$wrapper || fn);
          }
        });
      });
    },
    _reported: function(message, source, line) {
      var key;
      key = "" + message + "_" + source + "_" + line;
      return this._reported[key];
    },
    _markReported: function(message, source, line) {
      var key, _base;
      key = "" + message + "_" + source + "_" + line;
      this._reported[key] = true;
      (_base = this._reported).count || (_base.count = 1);
      return this._reported.count += 1;
    },
    _report: function(message, source, line, stacktrace) {
      return (new Request.JSON({
        url: this.options.url,
        data: {
          js_exception: this._data(message, source, line, stacktrace)
        }
      })).post();
    },
    _data: function(message, source, line, stacktrace) {
      return {
        url: document.location.href,
        error_source: source,
        error_line: line,
        message: message,
        environment: this._environment(),
        stacktrace: stacktrace
      };
    },
    _environment: function() {
      var browser, _ref;
      if (((_ref = CF.Utils) != null ? _ref.detectBrowser : void 0) != null) {
        browser = CF.Utils.detectBrowser();
        return "" + browser.OS + " " + browser.browser + " " + browser.version;
      } else if (Browser) {
        return "" + Browser.Platform.name + " " + Browser.Engine.name + " " + Browser.Engine.version;
      } else {
        return "unknown";
      }
    }
  });
}).call(this);
