/* fadeVisible
 * ====================== */
ko.bindingHandlers.fadeVisible = {
	init : function(element, valueAccessor) {
		var shouldDisplay = ko.utils.unwrapObservable(valueAccessor());
		$(element).toggle(shouldDisplay);
	},
	update : function(element, valueAccessor) {
		var shouldDisplay = ko.utils.unwrapObservable(valueAccessor());
		shouldDisplay ? $(element).fadeIn() : $(element).fadeOut();
	}
};

/*
 * ui-popover ======================
 */
ko.bindingHandlers['ui-popover'] = {
	init : function(element, valueAccessor) {
		var $element = $(element), options = valueAccessor() || {}, mergedOptions = $.extend({}, {}, options);
		$element.popover(mergedOptions);
		$element.on('click', function(e) {
			UI.setFocusOnFirstValidElement(undefined, $element.next());
		});

		// Revisar: utilizado para ocultar o popover quando clica fora dela.
		// (por padrão a popover só fecha quando clica no link que foi utilizado
		// para abrir)
		$('body').on('click', function(e) {
			if (!$element.is(e.target) && $element.has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
				$element.popover('hide');
			}
		});

	}
};

/*
 * ui-combobox ======================
 */
var chosenDefaults = {
	width : '100%',
	allow_single_deselect : true,
	no_results_text : Messages['selectNoResults'],
	placeholder_text_multiple : Messages['selectText'],
	placeholder_text_single : Messages['selectText']
};


ko.bindingHandlers['ui-combobox'] = {
	init : function(element, valueAccessor, allBindingsAccessor) {
		var $element = $(element), chosenOptions = valueAccessor().chosen || {}, mergedChosenOptions = $.extend({}, chosenDefaults, chosenOptions);
		var valueUnwrapped = ko.utils.unwrapObservable(valueAccessor())

		$element.prepend('<option></option>');
		$element.chosen(mergedChosenOptions);
	},
	update : function(element, valueAccessor, allBindingsAccessor) {
		var valueUnwrapped = ko.utils.unwrapObservable(valueAccessor());
		valueUnwrapped = ko.utils.unwrapObservable(allBindingsAccessor());
		
		var $element = $(element);
		$element.prepend('<option></option>');
		$element.trigger('liszt:updated');
		if ($element.attr('multiple')) {
			var $drop = $element.next('.chzn-container').find('.chzn-drop');
			var options = ko.utils.unwrapObservable(allBindingsAccessor().options) || [];
			var selectedOptions = ko.utils.unwrapObservable(allBindingsAccessor().selectedOptions) || [];
			$drop.toggleClass('borderless', options.length === selectedOptions.length);
		}
	}
};

/*
 * ui-table ======================
 */
var tableDefaults = {
	sDom : "<'row-fluid'<'offset6 span4'f><'span2'l>r><'table-overflow't><'row-fluid'<'span6'i><'span6'p>>",
	sPaginationType : "bootstrap",
	bAutoWidth : false,
	bSort : true,
	oLanguage : {
		sProcessing : Messages['tableProcessing'],
		sLengthMenu : Messages['tableLengthMenu'],
		sZeroRecords : Messages['tableZeroRecords'],
		sInfo : Messages['tableInfo'],
		sInfoEmpty : Messages['tableInfoEmpty'],
		sInfoFiltered : Messages['tableInfoFiltered'],
		sInfoPostFix : Messages['tableInfoPostFix'],
		sSearch : Messages['tableSearch'],
		sUrl : Messages['tableUrl'],
		oPaginate : {
			sFirst : Messages['tablePaginateFirst'],
			sPrevious : Messages['tablePaginatePrevious'],
			sNext : Messages['tablePaginateNext'],
			sLast : Messages['tablePaginateLast']
		}
	}
};

var tableColumnDefaults = {
	sType : 'string',
	sDefaultContent : ''
};

var tableClasses = 'table dataTable table-bordered table-striped table-condensed bootstrap-datatable text-small';

ko.bindingHandlers['ui-table'] = {
	init : function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
		var $element = $(element), options = valueAccessor().dataTable, mergedOptions = $.extend({}, tableDefaults, options), $filter, $lengthMenu;
		if (typeof mergedOptions.aoColumns === "undefined" || !mergedOptions.aoColumns || mergedOptions.aoColumns.length == 0) {
			throw new Error('Uma ou mais colunas devem ser informadas para a tabela. Utilize a propriedade dataTable.aoColumns!');
		}

		for ( var index = 0, size = mergedOptions.aoColumns.length; index < size; index++) {
			mergedOptions.aoColumns[index] = $.extend({}, tableColumnDefaults, mergedOptions.aoColumns[index]);
		}

		if (window.localStorage) {
			var val = localStorage.getItem('table_lengthMenu_default');
			if (val) {
				mergedOptions.iDisplayLength = parseInt(val, 10);
			}
		}
		
		$element.dataTable(mergedOptions);

		$element.addClass(tableClasses).addClass('table-hover');

		if (valueAccessor().click) {
			$element.delegate('tbody tr', 'click', function() {
				var rowData = $element.fnGetData(this);
				valueAccessor().click(rowData, this);
			});
		}

		$filter = $element.closest('.dataTables_wrapper').find('.dataTables_filter input');
		$lengthMenu = $element.closest('.dataTables_wrapper').find('.dataTables_length select');

		$filter.addClass('input span12');
		$lengthMenu.chosen(chosenDefaults);
		$lengthMenu.bind('change', function() {
			if (window.localStorage) {
				localStorage.setItem('table_lengthMenu_default', $lengthMenu.val());
			}
			$lengthMenu.trigger('liszt:updated');

		});

		$element.find('th.sorting_disabled').attr('tabindex', '-1');
	},
	update : function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
		var options = valueAccessor(), $element = $(element), $table = $element.dataTable({
			bRetrieve : true
		});
		$table.fnClearTable();
		$table.fnAddData(ko.utils.unwrapObservable(options.data));
	}
};

/*
 * tableClasses ======================
 */
ko.bindingHandlers['tableClasses'] = {
	init : function(element, valueAccessor) {
		var $element = $(element);
		$element.addClass(tableClasses);
	}
};

/*
 * ui-tooltip ======================
 */
ko.bindingHandlers['ui-tooltip'] = {
	init : function(element, valueAccessor) {
		var $element = $(element), value = valueAccessor();

		$element.tooltip(value);
	}
};

/*
 * ui-wizard ======================
 */
ko.bindingHandlers['ui-wizard'] = {
	init : function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
		var $element = $(element);
		var value = valueAccessor();
		var control = value.control || {};
		var navbar = (value.navbar !== undefined) ? value.navbar : false;
		var showTabNumber = (value.showTabNumber !== undefined) ? value.showTabNumber : true;
		var showPagination = (value.showPagination !== undefined) ? value.showPagination : true;

		// Atualiza o bind dos filhos
		ko.applyBindingsToDescendants(bindingContext.extend(valueAccessor()), element);

		control.firstTab = function() {
			control.selectedIndex(firstTabIndex());
			if (!navigationTab(control.selectedIndex())) {
				control.nextTab();
			}
		};

		control.lastTab = function() {
			control.selectedIndex(lastTabIndex());
			if (!navigationTab(control.selectedIndex())) {
				control.previousTab();
			}
		};

		control.nextTab = function() {
			do {
				control.selectedIndex(control.selectedIndex() + 1);
			} while (!navigationTab(control.selectedIndex()));
		};

		control.previousTab = function() {
			do {
				control.selectedIndex(control.selectedIndex() - 1);
			} while (!navigationTab(control.selectedIndex()));
		};

		control.selectedIndex = ko.observable();
		control.selectedIndex.subscribe(function(selectedIndex) {
			var index = selectedIndex;
			var firstIndex = firstTabIndex();
			var lastIndex = lastTabIndex();

			if (index < firstIndex) {
				index = firstIndex;
			} else if (index > lastIndex) {
				index = lastIndex;
			}

			if (index != selectedIndex) {
				control.selectedIndex(index);
			} else {
				tab().removeClass('active');
				tab(index).addClass('active');

				panel().addClass('hide');
				panel(index).removeClass('hide');

				updatePagination();
			}
		});

		control.update = function() {
			setTimeout(function() {
				updatePagination();
				updateTabLabel();
			}, 0);
		};

		var updatePagination = function() {
			buttonNext().toggleClass('disabled', control.selectedIndex() === lastTabIndex());
			buttonPrevious().toggleClass('disabled', control.selectedIndex() === firstTabIndex());
		};

		var updateTabLabel = function() {
			tabs().find('[role="tab"]:visible .label').each(function(index) {
				$(this).text(index + 1);
			});
		};

		var lastTabIndex = function() {
			var lastTabIndex = -1;
			$element.find('> :first-child [role="tab"]').each(function(index) {
				if (navigationTab(index)) {
					lastTabIndex = index;
				}
			});
			if (lastTabIndex === -1) {
				throw new Error('Deve existir pelo menos uma etapa visível!');
			}
			return lastTabIndex;
		};

		var firstTabIndex = function() {
			var firstTabIndex = -1;
			$element.find('> :first-child [role="tab"]').each(function(index) {
				if (navigationTab(index)) {
					firstTabIndex = index;
					return false;
				}
			});
			if (firstTabIndex === -1) {
				throw new Error('Deve existir pelo menos uma etapa visível!');
			}
			return firstTabIndex;
		};

		var navigationTab = function(index) {
			var $tab = tab(index);
			return !$tab.hasClass('skip-nav') && $tab.filter(':visible').length > 0;
		};

		var tab = function(index) {
			if (index === undefined) {
				return $element.find('> :first-child .active[role="tab"]');
			} else {
				return $element.find('> :first-child [role="tab"]:eq(' + index + ')');
			}
		};

		var tabs = function() {
			return $element.children().first();
		};

		var panel = function(index) {
			if (index === undefined) {
				return $element.find('> [role="panels"] > [role="panel"]:visible');
			} else {
				return $element.find('> [role="panels"] > [role="panel"]:eq(' + index + ')');
			}
		};

		var buttonNext = function() {
			return $element.find('> [role="pagination-buttons"] > [role="next-button"]');
		};

		var buttonPrevious = function() {
			return $element.find('> [role="pagination-buttons"] > [role="previous-button"]');
		};

		var initTab = function() {
			var $tabs = tabs();
			$tabs.attr('role', 'tabs');
			if (navbar) {
				$tabs.wrap('<div class="navbar navbar-wizard"></div>');
				$tabs.addClass('nav');
			} else {
				$tabs.addClass('ui-wizard-steps');
			}
			$tabs.addClass('clickable');
			var $children = $tabs.children();
			$children.each(function(index) {
				var $tab = $(this);
				$tab.attr('role', 'tab');
				$tab.css('z-index', $children.length - index);
				$tab.bind('click', function() {
					if ($tab.hasClass('skip-nav')) {
						return false;
					} else {
						control.selectedIndex(index);
					}
				});
				if (showTabNumber) {
					var $label = $('<span class="label badge-inverse"></span>');
					$tab.prepend($label);
				}
			});
		};

		var panels = function() {
			var $panels = $('<div role="panels"></div>');
			$element.children().each(function(index) {
				if (index > 0) {
					var $panel = $(this);
					$panel.wrap('<div role="panel" class="row-fluid hide"></div>');
					$panel.parent().appendTo($panels);
				}
			});
			return $panels;
		};

		var pagination = function() {
			var $pagination = $('<ul class="pager" role="pagination-buttons"></ul>');

			var $previous = $('<li role="previous-button"></li>');
			var $buttonPrevious = $('<a href="#">&larr; ' + Messages['wizardBack'] + '</a>');
			$previous.append($buttonPrevious);
			$previous.on('click', $buttonPrevious, function() {
				if (!$(this).hasClass('disabled')) {
					control.previousTab();
				}
				return false;
			});

			var $next = $('<li role="next-button"></li>');
			var $buttonNext = $('<a href="#">' + Messages['wizardNext'] + ' &rarr;</a>');
			$next.append($buttonNext);
			$next.on('click', $buttonNext, function() {
				if (!$(this).hasClass('disabled')) {
					control.nextTab();
				}
				return false;
			});

			$pagination.append($previous);
			$pagination.append($next);

			return $pagination;
		};

		initTab();
		updateTabLabel();
		$element.append(panels());
		if (showPagination) {
			$element.append(pagination());
		}
		$element.addClass('ui-wizard');

		control.selectedIndex(0);

		return {
			controlsDescendantBindings : true
		};
	}
};

/*
 * ui-calendar ======================
 */
ko.bindingHandlers['ui-calendar'] = {
	init : function(element, valueAccessor) {
		var value = valueAccessor();
		var defaultOptions = {
			contentHeight : 450,
			header : {
				left : 'prev,next today',
				center : 'title',
				right : 'basicWeek,month'
			},
			eventRender : function(event, element) {
				$(element).attr('title', event.description);
				$(element).attr('data-event-date', $.datepicker.formatDate('yy-mm-dd', event.start));
			},
			columnFormat : {
				week : 'ddd d/M'
			},
			events : [],
			editable : true,
			draggable : true,
			defaultView : 'basicWeek',
			disableResizing : true,
			monthNames : Messages.dates.months,
			monthNamesShort : Messages.dates.monthsShort,
			dayNames : Messages.dates.days,
			dayNamesShort : Messages.dates.daysShort,
			buttonText : {
				today : Messages.dates.today,
				month : Messages.dates.month,
				week : Messages.dates.week,
				day : Messages.dates.day
			}
		};

		var options = $.extend({}, defaultOptions, value);

		$(element).fullCalendar(options);
	}
};

/*
 * ui-modal ======================
 */
ko.bindingHandlers['ui-modal'] = {
	init : function(element, valueAccessor) {
		var $element = $(element);
		var value = valueAccessor();
		var control = value.control || {};
		var size = value.size;
		var forceHide = false;

		control.visible = ko.observable(false);

		control.show = function() {
			control.visible(true);
		};

		control.hide = function() {
			control.visible(false);
		};

		control.visible.subscribe(function(visible) {
			forceHide = !visible;
			$element.modal(visible ? 'show' : 'hide');
			forceHide = false;
		});

		$element.on('shown', function() {
			control.visible(true);
			UI.setFocusOnFirstValidElement(undefined, element);
		});

		$element.on('hidden', function() {
			control.visible(false);
			UI.setFocusOnFirstValidElement();
		});

		$element.on('hide', function() {
			var activeRequests = $('body').attr('activeRequests') || '0';
			return forceHide || activeRequests === '0';
		});

		var header = function() {
			var $header = $('<div class="modal-header"></div>');
			var $title = $('<div class="modal-title"><h2><strong></strong></h2></div>');
			var $close = $('<button type="button" class="close" data-dismiss="modal"></button>');
			$close.append('<i class="fa-icon-remove"></i>');
			$header.append($close);
			$header.append($title);
			return $header;
		};

		$element.addClass('modal');
		if (size === 'small') {
			$element.addClass('modal-small');
		} else if (size === 'large') {
			$element.addClass('modal-large');
		}

		var $content = $element;
		var $firstChild = $content.find('> :first-child');
		if ($firstChild.is('form')) {
			$content = $firstChild;
		}
		$content.find('> :first-child').addClass('modal-body');
		$content.find('> :last-child:not(.modal-body)').addClass('modal-footer');

		$element.attr('tabindex', '-1');

		$element.prepend(header());
	},
	update : function(element, valueAccessor) {
		var $element = $(element);
		var value = valueAccessor();
		var title = value.title || '';
		$element.find('.modal-header .modal-title h2').html(title);
	}
};

/*
 * ui-messages ======================
 */
ko.bindingHandlers['ui-messages'] = {
	init : function(element) {
		$.pnotify.defaults.history = false;
	},
	update : function(element, valueAccessor) {
		var value = ko.utils.unwrapObservable(valueAccessor()) || {}, hasMessages = (value.length);

		if (!hasMessages) {
			return;
		}

		var notificationsFor = function(messageType) {
			var messages, result = [];

			messages = ko.utils.arrayFilter(value, function(e) {
				return e.type === messageType;
			});

			var fieldNames = [];

			for ( var i = 0, size = messages.length; i < size; i++) {
				var fieldName = (messages[i].field || '');
				var fieldSelector = fieldName.replace('.', '\\.');
				if (fieldSelector) {
					fieldNames.push('#' + fieldSelector);
				}
				var label = $('label[for="' + fieldSelector + '"]').text() || fieldName;
				label = $.trim(label.replace('*', ''));
				result.push('<strong>' + label + '</strong> ' + messages[i].message);
			}

			UI.setFocusOnFirstValidElement(fieldNames);
			displayNotifications(result, messageType);
		};

		var titleFor = function(type) {
			var titleMap = {
				'ERROR' : Messages.notificationsTitle.ERROR,
				'WARNING' : Messages.notificationsTitle.WARNING,
				'SUCCESS' : Messages.notificationsTitle.SUCCESS
			};
			return titleMap[type];
		};
		var displayNotifications = function(messages, type) {
			if (messages.length > 0) {
				$.pnotify({
					title : titleFor(type),
					text : '<ul style="margin-top: 5px"><li>' + messages.join('</li><li>') + '</li></ul>',
					type : type.toLowerCase()
				});
			}
		};

		notificationsFor('ERROR');
		notificationsFor('WARNING');
		notificationsFor('SUCCESS');
	}
};

/*
 * ui-mask ======================
 */
ko.bindingHandlers['ui-mask'] = {
	init : function(element, valueAccessor) {
		var $element = $(element);

		var control = {};
		control.clearChange = false;
		control.mask = ko.observable();

		control.mask.subscribe(function(mask) {
			if (mask) {
				$element.inputmask(mask, $element.data('maskOptions'));
			} else {
				$element.inputmask('remove');
			}
			if (control.clearChange) {
				$element.val(undefined);
			} else {
				control.clearChange = true;
			}
			$element.trigger('change');
		});

		$element.data('updateMask', control.mask);
	},
	update : function(element, valueAccessor) {
		var $element = $(element), value = valueAccessor();

		var options = $.extend({}, value);
		delete options['mask'];

		if (options.clearIncomplete) {
			// Limpa o campo caso o valor seja inválido
			options.onincomplete = function() {
				$element.val(undefined);
				$element.trigger('change');
			};
		}

		$element.data('maskOptions', options);
		$element.data('updateMask')(value.mask);

		// Utilizado para atualizar o valor com a máscara
		$element.val($element.val());
		$element.trigger('blur.inputmask');
	}
};

/*
 * FILEUPLOAD PUBLIC CLASS DEFINITION =================================
 */

var Fileupload = function(element, options) {
	this.$element = $(element);
	this.type = this.$element.data('uploadtype') || (this.$element.find('.thumbnail').length > 0 ? "image" : "file");

	this.$input = this.$element.find(':file');
	if (this.$input.length === 0)
		return;

	this.name = this.$input.attr('name') || options.name;

	this.$hidden = this.$element.find('input[type=hidden][name="' + this.name + '"]');
	if (this.$hidden.length === 0) {
		this.$hidden = $('<input type="hidden" />');
		this.$element.prepend(this.$hidden);
	}

	this.$preview = this.$element.find('.fileupload-preview');
	var height = this.$preview.css('height');
	if (this.$preview.css('display') != 'inline' && height != '0px' && height != 'none')
		this.$preview.css('line-height', height);

	this.original = {
		'exists' : this.$element.hasClass('fileupload-exists'),
		'preview' : this.$preview.html(),
		'hiddenVal' : this.$hidden.val()
	};

	this.$remove = this.$element.find('[data-dismiss="fileupload"]');

	this.$element.find('[data-trigger="fileupload"]').on('click.fileupload', $.proxy(this.trigger, this));

	this.listen();
};

Fileupload.prototype = {

	listen : function() {
		this.$input.on('change.fileupload', $.proxy(this.change, this));
		$(this.$input[0].form).on('reset.fileupload', $.proxy(this.reset, this));
		if (this.$remove)
			this.$remove.on('click.fileupload', $.proxy(this.clear, this));
	},

	change : function(e, invoked) {
		if (invoked === 'clear')
			return;

		var file = e.target.files !== undefined ? e.target.files[0] : (e.target.value ? {
			name : e.target.value.replace(/^.+\\/, '')
		} : null);

		if (!file) {
			this.clear();
			return;
		}

		this.$hidden.val('');
		this.$hidden.attr('name', '');
		this.$input.attr('name', this.name);

		if (this.type === "image" && this.$preview.length > 0 && (typeof file.type !== "undefined" ? file.type.match('image.*') : file.name.match(/\.(gif|png|jpe?g)$/i))
				&& typeof FileReader !== "undefined") {
			var reader = new FileReader();
			var preview = this.$preview;
			var element = this.$element;

			reader.onload = function(e) {
				preview.html('<img src="' + e.target.result + '" ' + (preview.css('max-height') != 'none' ? 'style="max-height: ' + preview.css('max-height') + ';"' : '') + ' />');
				element.addClass('fileupload-exists').removeClass('fileupload-new');
			};

			reader.readAsDataURL(file);
		} else {
			this.$preview.text(file.name);
			this.$element.addClass('fileupload-exists').removeClass('fileupload-new');
		}
	},

	clear : function(e) {
		this.$hidden.val('');
		this.$hidden.attr('name', this.name);
		this.$input.attr('name', '');

		// ie8+ doesn't support changing the value of input with type=file so
		// clone instead
		if (navigator.userAgent.match(/msie/i)) {
			var inputClone = this.$input.clone(true);
			this.$input.after(inputClone);
			this.$input.remove();
			this.$input = inputClone;
		} else {
			this.$input.val('');
		}

		this.$preview.html('');
		this.$element.addClass('fileupload-new').removeClass('fileupload-exists');

		if (e) {
			this.$input.trigger('change', [ 'clear' ]);
			e.preventDefault();
		}
	},

	reset : function(e) {
		this.clear();

		this.$hidden.val(this.original.hiddenVal);
		this.$preview.html(this.original.preview);

		if (this.original.exists)
			this.$element.addClass('fileupload-exists').removeClass('fileupload-new');
		else
			this.$element.addClass('fileupload-new').removeClass('fileupload-exists');
	},

	trigger : function(e) {
		this.$input.trigger('click');
		e.preventDefault();
	}
};

/*
 * FILEUPLOAD PLUGIN DEFINITION ===========================
 */

$.fn.fileupload = function(options) {
	return this.each(function() {
		var $this = $(this), data = $this.data('fileupload');
		if (!data)
			$this.data('fileupload', (data = new Fileupload(this, options)));
		if (typeof options == 'string')
			data[options]();
	});
};

$.fn.fileupload.Constructor = Fileupload;

/*
 * FILEUPLOAD DATA-API ==================
 */

$(document).on('click.fileupload.data-api', '[data-provides="fileupload"]', function(e) {
	var $this = $(this);
	if ($this.data('fileupload'))
		return;
	$this.fileupload($this.data());

	var $target = $(e.target).closest('[data-dismiss="fileupload"],[data-trigger="fileupload"]');
	if ($target.length > 0) {
		$target.trigger('click.fileupload');
		e.preventDefault();
	}
});

/*
 * ui-upload ======================
 */
ko.bindingHandlers['ui-upload'] = {
	init : function(element, valueAccessor) {
		var $element = $(element), value = valueAccessor();
		$element.fileupload();
	}
};

/*
 * ui-box ======================
 */
ko.bindingHandlers['ui-box'] = {
	init : function(element, valueAccessor) {		
		var $element = $(element);
		$element.box();
	},
	update : function(element, valueAccessor) {
		var $element = $(element), value = valueAccessor(), icon = $('.ui-box-icon', $element), title = $('.ui-box-title', $element);

		icon.removeClass().addClass('ui-box-icon').addClass(ko.utils.unwrapObservable(value.icon));
		title.html(ko.utils.unwrapObservable(value.title));
	}
};

/*
 * ui-chart ======================
 */
ko.bindingHandlers['ui-chart'] = {
	init : function(element, valueAccessor) {
	},
	update : function(element, valueAccessor) {
		var $element = $(element), highchartsOptions = valueAccessor().highcharts;
		if (!highchartsOptions) {
			throw new Error("Highcharts não foi configurado corretamente.")
		}
		$(element).highcharts(highchartsOptions);
	}
};

/*
 * ui-scroll ======================
 */
ko.bindingHandlers['ui-scroll'] = {
	init : function(element, valueAccessor) {
		var $element = $(element);
		$element.wrap('<div class="nano"/>');
		$element.wrap('<div class="nanoScroll"/>');
	},
	update : function(element, valueAccessor) {
		var value = valueAccessor(), height = ko.utils.unwrapObservable(value.height), $element = $(element);
		$element.closest('.nano').css({
			height : height
		});
		value.ref();
		$element.closest('.nano').nanoScroller({
			contentClass : 'nanoScroll'
		});
	}
};

/*
 * ui-date ======================
 */
$.datepicker.setDefaults({
	closeText : Messages['dates'].closeText,
	prevText : Messages['dates'].prevText,
	nextText : Messages['dates'].nextText,
	currentText : Messages['dates'].currentText,
	monthNames : Messages['dates'].months,
	monthNamesShort : Messages['dates'].monthsShort,
	dayNames : Messages['dates'].days,
	dayNamesShort : Messages['dates'].daysShort,
	dayNamesMin : Messages['dates'].daysMin,
	weekHeader : Messages['dates'].week,
	dateFormat : Messages['dateFormat'].date,
	firstDay : 1,
	isRTL : false,
	showMonthAfterYear : false,
	yearSuffix : ''
});

ko.bindingHandlers['ui-date'] = {
	init : function(element, valueAccessor) {
		var $element = $(element), properties = valueAccessor();
		$element.wrap('<div class="input-append input-date"></div>');
		$element.parent().toggleClass('span12', !$element.hasClass('input-small'));
		$element.datepicker({
			showOn : 'both',
			buttonImageOnly : false,
			buttonText : '<span class="btn add-on"><i class="fa-icon-calendar"></i></span>',
			dateFormat : Messages['dateFormat']['date'],
			firstDay : 0,
			showOtherMonths : true,
			onSelect : function() {
				// Quando seleciona uma data através do calendário
				properties.value($element.datepicker('getDate'));
			}
		});

		ko.utils.registerEventHandler($element[0], "change", function(event) {
			// Quando digita uma data direto no input
			try {
				var date = $.datepicker.parseDate(Messages['dateFormat']['date'], $element.val());
				properties.value(date ? date : undefined);
			} catch (e) {
				// data inválida
				$element.val('');
			}
		});

		// Seta a máscara de acordo com o que foi definido no arquivo de
		// internacionalização (ex.: de 'dd/mm/yy' para 99/99/9999 ou )
		// de yy-mm-dd para 9999-99-99
		var i18nFormat = Messages['dateFormat']['date'].replace('dd', '99').replace('mm', '99').replace('yy', '9999');
		$element.inputmask(i18nFormat);
	},
	update : function(element, valueAccessor) {
		var $element = $(element), disabled = $element.attr('disabled') !== undefined, properties = valueAccessor(), sDate;

		if (properties.value()) {
			sDate = $.datepicker.formatDate(Messages['dateFormat']['date'], new Date(properties.value()));
			$element.val(sDate);
		} else {
			$element.val('');
		}
		;
		$element.datepicker(disabled ? 'disable' : 'enable');
		$element.next('button').find('.btn.add-on').toggleClass('disabled', disabled);
	}
};

/*
 * ui-label ======================
 */
var labelDefaults = {
	requiredClass : 'required',
	requiredIcon : '<span>*</span>'
};

ko.bindingHandlers['ui-label'] = {
	init : function(element, valueAccessor) {
		var $element = $(element), $requiredIcon = $(labelDefaults.requiredIcon);

		$requiredIcon.addClass(labelDefaults.requiredClass);
		$element.append($requiredIcon);
	},
	update : function(element, valueAccessor) {
		var $element = $(element), $requiredIcon = $element.find('.' + labelDefaults.requiredClass), required = ko.utils.unwrapObservable(valueAccessor().required);
		$requiredIcon.toggleClass('hide', !required);
	}
};

/*
 * ui-page ======================
 */
ko.bindingHandlers['ui-page'] = {
	update : function(element, valueAccessor) {
		var $element = $(element), value = valueAccessor(), showHelpIcon = value.help, title = value.title || '';
		document.getElementById('title').innerHTML = title;
		$('#help').toggleClass('hide', !showHelpIcon);
	}
};

/*
 * ui-radio ======================
 */
ko.bindingHandlers['ui-radio'] = {
	init : function(element, valueAccessor) {
		var $element = $(element);
		var $parent = $element.parent();
		var value = valueAccessor();
		if (!$element.is('input') || $element.attr('type').toLowerCase() !== 'radio') {
			throw new Error('Elemento deve ser um input do tipo radio!');
		}
		if ($parent.is('label')) {
			$parent.addClass('radio');
			$parent.toggleClass('inline', value.inline);
		}
		$element.uniform();
	},
	update : function(element, valueAccessor) {
		var $element = $(element);
		$.uniform.update($element);
	}
};

/*
 * ui-checkbox ======================
 */
ko.bindingHandlers['ui-checkbox'] = {
	init : function(element, valueAccessor) {
		var $element = $(element);
		var $parent = $element.parent();
		var value = valueAccessor();
		if (!$element.is('input') || $element.attr('type').toLowerCase() !== 'checkbox') {
			throw new Error('Elemento deve ser um input do tipo checkbox!');
		}
		if ($parent.is('label')) {
			$parent.addClass('checkbox');
			$parent.toggleClass('inline', value.inline);
		}
		$element.uniform();
	},
	update : function(element, valueAccessor) {
		var $element = $(element);
		$.uniform.update($element);
	}
};

/*
 * stopBinding ======================
 */
ko.bindingHandlers['stopBinding'] = {
	init : function(element, valueAccessor) {
		return {
			controlsDescendantBindings : true
		};
	}
};