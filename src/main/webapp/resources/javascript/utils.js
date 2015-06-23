  var Utils = {}
  /**
   * Formata uma string no formato ISO 8601
   * para o formato padrão utilizado pelo sistema.
   */
  Utils.formatISODate = function(sDate) {
    return Utils.formatDate(Utils.parseISODate(sDate));
  };

  Utils.formatDate = function(oDate) {
    return oDate ? $.datepicker.formatDate(Messages.dateFormat.date, oDate) : null;
  };

  Utils.getDateFormatRegex = function() {
    var format = Messages.dateFormat.date;
    return format.replace(/d|m/g, '\\d').replace(/y/g, '\\d\\d');
  };

  /**
   * Converte uma string no formato ISO 8601
   * para um objeto do tipo Date.
   */
  Utils.parseISODate = function(sDate) {
    if (typeof sDate !== "string") throw new Error('data deve ser uma string');
    var millis = Date.parse(sDate);
    return !isNaN(millis) ? new Date(millis) : null;
  };

  Utils.parseDate = function(sDate) {
    if (sDate && typeof sDate !== "string") throw new Error('data deve ser uma string');
    return sDate ? $.datepicker.parseDate(Messages.dateFormat.date, sDate) : null;
  };

  Utils.concat = function(separator) {
    var validArguments = [];
    var optionalArguments = Array.prototype.slice.call(arguments, 1);
    var argument;
    for (var index = 0, size = optionalArguments.length; index < size; index++) {
      argument = $.trim(optionalArguments[index]);
      if (argument) {
        validArguments.push(argument);
      }
    }
    return validArguments.join(separator);
  };

  Utils.getNumberText = function(text) {
    return $.trim(text).replace(/[^0-9]/g, '');
  };

  Utils.getNumberValue = function(text) {
    var numberText = Utils.getNumberText(text);
    return numberText ? parseInt(numberText, 10) : 0;
  };

  Utils.removeEmptyObjectsFromJSON = function(data) {
    for (var property in data) {
      if (typeof data[property] === 'object') {
        if ($.isEmptyObject(data[property])) {
          delete data[property];
        }
      }
    }
  };

  Utils.isMobile = function() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
  };

  Utils.isCurrentPage = function(page) {
    if (page) {
      return getFormattedUrl(window.location.href).indexOf(getFormattedUrl(page)) != -1;
    }
    return false;
  };

  Utils.isHomePage = function() {
    if (typeof(CONTEXT_PATH) === "undefined") {
      return true;
    } else {
      return getFormattedUrl(window.location.href).endsWith(CONTEXT_PATH);
    }
  };

  Utils.getBrowserName = function() {
    var browserName = undefined;
    if ($.browser.msie) {
      browserName = 'ie';
    } else if ($.browser.mozilla) {
      browserName = 'mozilla';
    } else if ($.browser.webkit) {
      browserName = 'chrome';
    } else if ($.browser.safari) {
      browserName = 'safari';
    } else if ($.browser.opera) {
      browserName = 'opera';
    }
    return browserName;
  };

  Utils.getBrowserVersion = function() {
    var browserVersion = $.browser.version;
    var indexOf = browserVersion.indexOf('.');
    if (indexOf != -1) {
      return browserVersion.substring(0, indexOf);
    }
    return browserVersion;
  };

  Utils.updateBrowserVersion = function() {
    var $body = $('body');
    var browserName = Utils.getBrowserName();
    var browserVersion = Utils.getBrowserVersion();
    $body.addClass(browserName);
    $body.addClass(browserName + browserVersion);
  };

  if (!String.prototype.endsWith) {
    String.prototype.endsWith = function(suffix) {
      return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
  }

  function getFormattedUrl(url) {
    url = $.trim(url);
    var indexOf = url.indexOf(';jsessionid');
    if (indexOf !== -1) {
      url = url.substring(0, indexOf);
    }
    if (url.endsWith('/')) {
      url = url.substring(0, url.length - 1);
    }
    return url;
  }
