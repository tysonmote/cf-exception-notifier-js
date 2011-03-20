window.CF = {} unless window.CF
window.CF.Utils = {} unless window.CF.Utils

# CF.Utils.detectBrowser
# ======================
#
# Adapted from http://www.quirksmode.org/js/detect.html
#
# Usage:
#
#     CF.Utils.detectBrowser()
#     
# Returns:
#
#     {
#       browser: "Chrome",
#       version: "10",
#       OS: "Mac"
#     }

CF.Utils.detectBrowser = ->
  
  data =
    
    browser: [
      {
        string: navigator.userAgent
        subString: "Chrome"
        identity: "Chrome"
      },
      {
        string: navigator.vendor
        subString: "Apple"
        identity: "Safari"
        versionSearch: "Version"
      },
      {
        prop: window.opera
        identity: "Opera"
      },
      {
        string: navigator.userAgent
        subString: "Firefox"
        identity: "Firefox"
      },
      {
        string: navigator.userAgent
        subString: "MSIE"
        identity: "Explorer"
        versionSearch: "MSIE"
      },
      {
        string: navigator.userAgent
        subString: "Gecko"
        identity: "Mozilla"
        versionSearch: "rv"
      }
    ]
    
    OS: [
      {
        string: navigator.platform
        subString: "Win"
        identity: "Windows"
      },
      {
        string: navigator.platform
        subString: "Mac"
        identity: "Mac"
      },
      {
         string: navigator.userAgent
         subString: "iPhone"
         identity: "iPhone/iPod"
      },
      {
        string: navigator.platform
        subString: "Linux"
        identity: "Linux"
      }
    ]
  
  versionSearchString = null
  
  searchString = (data) ->
    for item in data
      versionSearchString = item.versionSearch || item.identity
      
      if item.string
        if item.string.indexOf( item.subString ) != -1
          return item.identity
      else if item.prop
        return item.identity
  
  searchVersion = (dataString) ->
    start = dataString.indexOf( versionSearchString )
    return if start == -1
    end = start + versionSearchString.length + 1
    
    parseFloat( dataString.substring( end ) )
  
  # Return object
  {
    browser: searchString( data.browser ) || "unknown"
    version: searchVersion( navigator.userAgent ) || 
             searchVersion( navigator.appVersion ) ||
             "unknown"
    OS: searchString( data.OS ) || "OS"
  }
