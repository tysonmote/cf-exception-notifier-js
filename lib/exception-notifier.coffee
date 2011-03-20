window.CF = {} unless window.CF

# CF.ExceptionNotifier
# ====================

CF.ExceptionNotifier = new Class
  
  Implements: [Options],
  
  options:
    url: "/js_exceptions"
    stacktraces: true
    duplicates: false
  
  initialize: (opts) ->
    this.setOptions( opts )
    this._load()
  
  count: ->
    this._reported.count || 0
  
  # =========
  # = Setup =
  # =========
  
  _load: ->
    this._attachOnerror()
    this._wrapAddEvent()
  
  _attachOnerror: ->
    unless CF.Utils.detectBrowser().browser == "Safari"
      window.onerror = this._onerror.bind( this )
  
  _onerror: (message, source, line) ->
    if @options.duplicates or !this._reported( message, source, line )
      stacktrace = this._stack || null
      this._report( message, source, line, stacktrace )
      this._markReported( message, source, line )
    
    delete this._stack
    return
  
  _wrapAddEvent: ->
    self = this
    doStacktrace = @options.stacktraces and typeof printStackTrace == "function"
    
    [Element, Window, Document].each( (nativeType) ->
      origAddEvent = nativeType.prototype.addEvent
      origRemoveEvent = nativeType.prototype.removeEvent
      
      nativeType.implement
        addEvent: (type, fn) ->
          return unless fn
          
          unless fn.$wrapper
            fn.$wrapper = ->
              try
                return fn.apply( this, arguments )
              catch error
                if doStacktrace
                  self._stack = printStackTrace( e: error ).join( "\n" )
                
                # For browsers that don't support window.onerror
                unless window.onerror
                  self._onerror( error.message, error.sourceURL, error.line )
                
                throw error
          
          origAddEvent.call( this, type, fn.$wrapper )
        
        removeEvent: (type, fn) ->
          return unless fn
          origRemoveEvent.call( this, type, fn.$wrapper || fn )
    )
  
  # =======================
  # = Duplicate detection =
  # =======================
  
  _reported: (message, source, line) ->
    key = "#{message}_#{source}_#{line}"
    this._reported[key]
  
  _markReported: (message, source, line) ->
    key = "#{message}_#{source}_#{line}"
    this._reported[key] = true
    this._reported.count ||= 1
    this._reported.count += 1
  
  # =============
  # = Reporting =
  # =============
  
  _report: (message, source, line, stacktrace) ->
    (new Request.JSON(
      url: @options.url
      data: js_exception: this._data( message, source, line, stacktrace )
    )).post()
  
  _data:( message, source, line, stacktrace ) ->
    url: document.location.href
    error_source: source
    error_line: line
    message: message
    environment: this._environment()
    stacktrace: stacktrace
  
  _environment: ->
    if CF.Utils?.detectBrowser?
      browser = CF.Utils.detectBrowser()
      "#{browser.OS} #{browser.browser} #{browser.version}"
    else if Browser # MooTools fallback
      "#{Browser.Platform.name} #{Browser.Engine.name} #{Browser.Engine.version}"
    else
      "unknown"
