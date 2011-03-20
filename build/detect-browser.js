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
