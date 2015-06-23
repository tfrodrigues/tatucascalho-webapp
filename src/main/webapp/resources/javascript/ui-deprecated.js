  var UI_DEPRECATED = {};

  /* ---------- Main Menu ---------- */
  UI_DEPRECATED.refreshMenu = function() {
    var $menu = $('#sidebar-left');
    addSubMenuAction($menu);
    refreshActiveMenu($menu);
    $menu.removeClass('hide');
    addButtonNavBarAction($menu);
  };

  function addSubMenuAction($menu) {
    if ($menu) {
      var $menuItens = $menu.find('.sidebar-nav > ul > li');
      $menuItens.find('.sub.dropmenu').closest('li').click(function(e) {
        var $subMenu = $(this).find('ul');
        if (toggleSubMenu($subMenu)) {
          if (!$(this).hasClass('active')) {
            var $subMenus = $menuItens.find('ul:visible').not($subMenu);
            toggleSubMenu($subMenus);
            $menuItens.removeClass('active-nav');
            $(this).addClass('active-nav');
          }
        }
        $(window).trigger('resize');
      });
    }
  }

  function refreshActiveMenu($menu) {
    if ($menu) {
      $menu.find('.dropmenu:not(.sub), .submenu').each(function(index) {
        var href = $(this).attr('href');
        if (Utils.isCurrentPage(href)) {
          if ($(this).hasClass('submenu')) {
            var $menu = $(this).closest('ul').closest('li');
            $menu.addClass('active').trigger('click');
          }
          $(this).closest('li').addClass('active');
          return false;
        }
      });
    }
  }

  function toggleSubMenu($subMenu) {
    var toggle = $subMenu && $subMenu.find('li.active').length === 0;
    if (toggle) {
      var icon = $subMenu.closest('li').find('.sub.dropmenu > i');
      if (icon.hasClass('fa-icon-folder-open')) {
        icon.removeClass('fa-icon-folder-open').addClass('fa-icon-folder-close');
      } else if (icon.hasClass('fa-icon-folder-close')) {
        icon.removeClass('fa-icon-folder-close').addClass('fa-icon-folder-open');
      }
      $subMenu.toggle();
    }
    return toggle;
  }

  function addButtonNavBarAction($menu) {
    if ($menu) {
      var $sidebarNav = $menu.find('.nav-collapse.sidebar-nav');
      $('.navbar').find('.btn.btn-navbar').click(function(e) {
        if ($sidebarNav.css('height') === '0px') {
          $sidebarNav.css('height', 'auto');
          $(this).removeClass('collapsed');
        } else {
          $sidebarNav.css('height', '0px');
          $(this).addClass('collapsed');
        }
      });
    }
  }

  $.extend($.fn.dataTableExt.oSort, {
    "custom-date-pre": function(column) {
      var date = column.match(Utils.getDateFormatRegex())[0],
        dateFormat = Messages.dateFormat.date.split(/[^dmy]/),
        dateArray = date.split(/[^0-9]/),
        year = $.inArray('yy', dateFormat),
        month = $.inArray('mm', dateFormat),
        day = $.inArray('dd', dateFormat);
      return (dateArray[year] + dateArray[month] + dateArray[day]) * 1;
    },

    "custom-date-asc": function(a, b) {
      return ((a < b) ? -1 : ((a > b) ? 1 : 0));
    },

    "custom-date-desc": function(a, b) {
      return ((a < b) ? 1 : ((a > b) ? -1 : 0));
    }
  });

  $.extend($.fn.dataTableExt.oApi.fnPagingInfo = function(oSettings) {
    return {
      iStart: oSettings._iDisplayStart,
      iEnd: oSettings.fnDisplayEnd(),
      iLength: oSettings._iDisplayLength,
      iTotal: oSettings.fnRecordsTotal(),
      iFilteredTotal: oSettings.fnRecordsDisplay(),
      iPage: Math.ceil(oSettings._iDisplayStart / oSettings._iDisplayLength),
      iTotalPages: Math.ceil(oSettings.fnRecordsDisplay() / oSettings._iDisplayLength)
    };
  });

  $.extend($.fn.dataTableExt.oPagination, {
    bootstrap: {
      fnInit: function(oSettings, nPaging, fnDraw) {
        var oLang = oSettings.oLanguage.oPaginate;
        var fnClickHandler = function(e) {
          e.preventDefault();
          if (oSettings.oApi._fnPageChange(oSettings, e.data.action)) {
            fnDraw(oSettings);
          }
        };
        $(nPaging).addClass('pagination').append(
          '<ul>' +
          '<li class="prev disabled"><a href="#">&larr; ' + oLang.sPrevious + '</a></li>' +
          '<li class="next disabled"><a href="#">' + oLang.sNext + ' &rarr; </a></li>' +
          '</ul>'
        );
        var els = $('a', nPaging);
        $(els[0]).bind('click.DT', {
          action: "previous"
        }, fnClickHandler);
        $(els[1]).bind('click.DT', {
          action: "next"
        }, fnClickHandler);
      },
      fnUpdate: function(oSettings, fnDraw) {
        var iListLength = 5;
        var oPaging = oSettings.oInstance.fnPagingInfo();
        var an = oSettings.aanFeatures.p;
        var i, j, sClass, iStart, iEnd, iHalf = Math.floor(iListLength / 2);
        if (oPaging.iTotalPages < iListLength) {
          iStart = 1;
          iEnd = oPaging.iTotalPages;
        } else if (oPaging.iPage <= iHalf) {
          iStart = 1;
          iEnd = iListLength;
        } else if (oPaging.iPage >= (oPaging.iTotalPages - iHalf)) {
          iStart = oPaging.iTotalPages - iListLength + 1;
          iEnd = oPaging.iTotalPages;
        } else {
          iStart = oPaging.iPage - iHalf + 1;
          iEnd = iStart + iListLength - 1;
        }
        for (i = 0, iLen = an.length; i < iLen; i++) {
          // remove the middle elements
          $('li:gt(0)', an[i]).filter(':not(:last)').remove();
          // add the new list items and their event handlers
          for (j = iStart; j <= iEnd; j++) {
            sClass = (j == oPaging.iPage + 1) ? 'class="active"' : '';
            $('<li ' + sClass + '><a href="#">' + j + '</a></li>')
              .insertBefore($('li:last', an[i])[0])
              .bind('click', function(e) {
                e.preventDefault();
                oSettings._iDisplayStart = (parseInt($('a', this).text(), 10) - 1) * oPaging.iLength;
                fnDraw(oSettings);
              });
          }
          // add / remove disabled classes from the static elements
          if (oPaging.iPage === 0) {
            $('li:first', an[i]).addClass('disabled');
          } else {
            $('li:first', an[i]).removeClass('disabled');
          }
          if (oPaging.iPage === oPaging.iTotalPages - 1 || oPaging.iTotalPages === 0) {
            $('li:last', an[i]).addClass('disabled');
          } else {
            $('li:last', an[i]).removeClass('disabled');
          }
        }
      }
    }
  });
