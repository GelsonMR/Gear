// GEAR UI

(function(){
	function GearLibrary(params) {
		var selector = [];
		if (params != undefined) {
			if (typeof params === 'string')
				selector = document.querySelectorAll(params);
			else {
				if (params.length != undefined)
					selector = params;
				else
					selector = [params];
			}
		}

		this.params = params;
		this.selector = selector;
		this.length = selector.length;

		i = 0;
		for (; i < this.length; i++) {
			this[i] = selector[i];
		}

		return this;
	}
	
	function Gear(selector) {
		return new GearLibrary(selector);
	}

	Gear.fn = GearLibrary.prototype = {
		modal: function(options) {
			console.log('MODAL PIORRA');
		},
		tabs: function(options) {
			console.log('TABS UHU');
		},
		tooltip: function(options) {
			var settings = $.extend({
					// Defaults
					balloon: false,
					background: false,
					color: false,
					preference: 'top',
					destroy: false,
					content: undefined,
					width: undefined,
					maxWidth: undefined
				}, options),
				len = this.length, ind = -1;
			while (ind++ < len - 1) {
				if (settings.destroy)
					removeMessage(this[ind]);
				else {
					this[ind].classList.add('pop');
					if (settings.balloon)
						this[ind].setAttribute('data-gear-pop-message-balloon', '');
					if (settings.background)
						this[ind].setAttribute('data-gear-pop-message-background', settings.background);
					if (settings.color)
						this[ind].setAttribute('data-gear-pop-message-color', settings.color);
					if (settings.content)
						this[ind].setAttribute('data-gear-pop-message-content', settings.content);
					if (settings.width)
						this[ind].setAttribute('data-gear-pop-message-width', settings.width);
					if (settings.maxWidth)
						this[ind].setAttribute('data-gear-pop-message-maxwidth', settings.maxWidth);
					this[ind].setAttribute('data-gear-pop-message-pref', settings.preference);
				}
			}

			return this;
		}
	}
	Gear.version = '0.1';
	Gear.author = 'Gelson Mariano Rodrigues';
	Gear.contact = 'GelsonMRodrigues@hotmail.com';
	Gear.info = 'Gear UI' + 
				'\nv' + Gear.version + 
				'\n' + Gear.author +
				'\n' + Gear.contact;

	Gear.randomChar = function(stringLength) {
		var text = "";
		var possible = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

		for (i = 0; i < stringLength; i++)
			text += possible.charAt(Math.floor(Math.random() * possible.length));

		return text;
	};

	Gear.button = function(options) {
		var settings = $.extend({
				id: undefined,
				material: true,
				type: undefined,
				flat: false,
				raised: false,
				willRaise: true,
				text: 'Button',
				click: undefined
			}, options);
		this.id = settings.id;
		this.material = settings.material;
		this.type = settings.type;
		this.flat = settings.flat;
		this.willRaise = settings.willRaise;
		this.raised = settings.raised;
		this.text = settings.text;
		this.click = settings.click;
		var button = $('<button/>', { class: 'gear-btn', text: settings.text });
		switch (this.type) {
			case 'primary':
				button.addClass('gear-primary');
				break;
			case 'danger':
				button.addClass('gear-danger');
				break;
			case 'warning':
				button.addClass('gear-warning');
				break;
			case 'success':
				button.addClass('gear-success');
		}
		this.flat && button.addClass('gear-flat');
		this.raised && button.addClass('gear-raised');
		this.willRaise && button.addClass('gear-will-raise');
		this.material && button.addClass('gear-mt');
		this.click && button.click(function(){ settings.click() });
		this[0] = button;
		return button;
	}
	Gear.dialog = function(options) {
		this.show = function(){ dialogShow(dialog); }
		this.hide = function(options) {
			var settings = $.extend({
				all: false,
				keepOnHTML: false
			}, options);
			settings.all ? dialogHideAll(settings.keepOnHTML) : dialogHide(dialog, settings.keepOnHTML);
		}
		this.isOpen = function(){
			if ($('html').is('.gear-dialog-open') && $(dialog).parent().is('.gear-open') && $(dialog).is('.gear-open') && $(dialog).parent().length)
				return true;
			else
				return false;
		}
		this.isFocus = function(){
			if ($('html').is('.gear-dialog-open') && $(dialog).parent().is('.gear-open.gear-focus') && $(dialog).is('.gear-open.gear-focus') && $(dialog).parent().length)
				return true;
			else
				return false;
		}
		this.isRendered = function(){
			if ($(dialog).parent().length)
				return true;
			else
				return false;
		}
		this.title = function(title){
			if (title !== undefined)
				title ? dialogTitle.html(title) : dialogTitle.html('');
			else
				return dialogTitle[0];
		}
		this.content = function(content){
			if (content !== undefined)
				content ? dialogContent.html('').append(content) : dialogContent.html('');
			else
				return dialogContent[0];
		}
		this.buttons = function(buttons){
			if (buttons !== undefined) {
				dialogButtonContainer.html('');
				for (i = 0; i < buttons.length; i++)
					dialogButtonContainer.append(buttons[i]);
			} else
				return dialogButtonContainer[0];
		}
		this.width = function(width){
			width ? dialog.css('width', width) : dialog.css('width', 'auto');
		}

		var settings = $.extend({
				material: true,
				title: 'Titulo',
				content: '',
				buttons: '',
				width: '450px',
				show: false,
				storeIndex: true,
				backgroundDismiss: true
			}, options);
		var dialog = $('<div/>', { class: 'gear-mt gear-dialog' }),
			dialogTitle = $('<h2/>', { class: 'gear-dialog-title' }),
			dialogContent = $('<div/>', { class: 'gear-dialog-content' }),
			dialogButtonContainer = $('<div/>', { class: 'gear-button-container' });

		dialog.append(dialogTitle);
		dialog.append(dialogContent);
		dialog.append(dialogButtonContainer);

		function dialogShow(element) {
			var self = $(element);
			if (!self.length) {
				console.error('Dialog não existe!');
				return;
			}
			if (!self.is('.gear-dialog')) {
				console.error('Elemento não é uma Dialog!');
				return;
			}
			if (self.is('.gear-open')) {
				console.error('Dialog já está aberta!');
				return;
			}
			if (self.parent().length === 0) {
				dialogWrap = $('<div/>', { class: 'gear-dialog-wrap' });
				dialogWrap.click(function(e){
					if ($(e.target).is('.gear-dialog-wrap'))
						dialogHide(element);
				});
				dialogWrap.append(self);
				if (!$('.gear-dialog-group').length) {
					if ($('ng-view').length)
						$('ng-view').append($('<div/>', { class: 'gear-dialog-group' }));
					else
						$('body').append($('<div/>', { class: 'gear-dialog-group' }));
				}
				$('.gear-dialog-group').append(dialogWrap);
			}
			$(element).find('.gear-dialog-close').click(function(){ dialogHide(dialog); })
			$('.gear-dialog[data-gear-order]').each(function(){
				$(this).attr('data-gear-order', ~~$(this).attr('data-gear-order') + 1);
			});
			$('.gear-dialog-wrap.gear-focus, .gear-dialog.gear-focus').removeClass('gear-focus');
			$('html').css('padding-right', (window.innerWidth - $('html').width()) + 'px');
			$('html').addClass('gear-dialog-open');
			self.attr('data-gear-order', 1).parent().addBack().addClass('gear-open gear-focus');
		};

		function dialogHide(element, keepOnHTML) {
			var self = $(element);
			if (!self.length) {
				console.error('Dialog não existe!');
				return;
			}
			if (!self.is('.gear-dialog')) {
				console.error('Elemento não é uma Dialog!');
				return;
			}
			if (!self.is('.gear-open')) {
				console.error('Dialog não está aberta!');
				return;
			}
			dialogLen = $('.gear-dialog[data-gear-order].gear-open').length;
			for (i = self.attr('data-gear-order'); i <= dialogLen; i++) {
				$('.gear-dialog[data-gear-order=' + i + ']').attr('data-gear-order', ~~$('.gear-dialog[data-gear-order=' + i + ']').attr('data-gear-order') - 1);
			}
			self.removeAttr('data-gear-order').parent().addBack().removeClass('gear-open gear-focus');
			if ($('.gear-dialog.gear-open').length)
				$('.gear-dialog[data-gear-order="1"]').parent().addBack().addClass('gear-focus');
			else
				$('html').removeClass('gear-dialog-open').css('padding-right', '0px');
			self.on('transitionend', function(e){
				if ($(e.target).is('.gear-dialog')) {
					if (!keepOnHTML) {
						if (!dialog.is('.gear-open')) {
							self.parent().remove().end().remove();
						}
					}
				}
			});
		};

		function dialogHideAll() {
			$('html').removeClass('gear-dialog-open').css('padding-right', '0px');
			$('.gear-dialog').removeAttr('data-gear-order').parent().addBack().removeClass('gear-open gear-focus');
		};

		this.title(settings.title);
		this.content(settings.content);
		this.buttons(settings.buttons);
		this.width(settings.width);
		this[0] = dialog;
		// if (settings.storeIndex) {
		// 	Gear.dialogs.push(this);
		// 	this.dialogsIndex = Gear.dialogs.length - 1;
		// }

		return this;
	};

	Gear.dialogs = [];

	Gear.alert = function(options) {
		var settings = $.extend({
				title: 'Alerta',
				content: undefined,
				confirm: undefined,
				confirmText: 'Ok',
				confirmType: 'primary',
				width: '450px'
			}, options),
			primaryButton = new Gear.button({
				text: settings.confirmText,
				type: settings.confirmType,
				click: function(){
					settings.confirm ? (settings.confirm() && alert.hide()) : alert.hide();
				}}),
			alert = new Gear.dialog({ title: settings.title, content: settings.content, buttons: [primaryButton], width: settings.width, storeIndex: false });
		alert.show();
	}

	Gear.confirm = function(options) {
		var settings = $.extend({
				title: 'Confirmação',
				content: undefined,
				confirm: undefined,
				confirmText: 'Ok',
				confirmType: 'primary',
				confirmFlat: false,
				cancel: undefined,
				cancelText: 'Cancelar',
				cancelType: 'primary',
				cancelFlat: true,
				width: '450px'
			}, options),
			primaryButton = new Gear.button({
				text: settings.confirmText,
				type: settings.confirmType,
				flat: settings.confirmFlat,
				click: function(){
					settings.confirm && settings.confirm(); confirm.hide();
				}}),
			defaultButton = new Gear.button({
				text: settings.cancelText,
				type: settings.cancelType,
				flat: settings.cancelFlat,
				click: function(){
					settings.cancel && settings.cancel(); confirm.hide();
				}}),
			confirm = new Gear.dialog({ title: settings.title, content: settings.content, buttons: [defaultButton, primaryButton], width: settings.width, storeIndex: false });
		confirm.show();
	}

	Gear.randomColor = function(options){
		var settings = options;
	}

	window.Gear = Gear;

})();

// POP MESSAGE
	function removeMessage(pop){
		if ($(pop).is('[data-gear-pop-message]')) {
			$('.message[data-gear-pop-message="' + $(pop).attr('data-gear-pop-message') + '"]').remove();
			$(pop).removeAttr('data-gear-pop-message data-gear-pop-message-pref').removeClass('pop');
		} else
			$(pop).removeClass('pop').removeAttr('data-gear-pop-message-pref').children('.message').remove();
		$(pop).removeAttr('data-gear-pop-message-balloon data-gear-pop-message-background data-gear-pop-message-color data-gear-pop-message-pref data-gear-pop-message-content');
	}

$(function(){
	function RemoveAccents(strAccents) {
		var strAccents = strAccents.split('');
		var strAccentsOut = new Array();
		var strAccentsLen = strAccents.length;
		var accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
		var accentsOut = 'AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz';
		for (var y = 0; y < strAccentsLen; y++) {
			if (accents.indexOf(strAccents[y]) != -1) {
				strAccentsOut[y] = accentsOut.substr(accents.indexOf(strAccents[y]), 1);
			} else
				strAccentsOut[y] = strAccents[y];
			}
		strAccentsOut = strAccentsOut.join('');
		return strAccentsOut;
	}

	$(document).on('keyup focusout', '#txt-gear-main-menu-search', function(){
		var textoPesquisa = RemoveAccents($(this).val().toLowerCase()),
			lista = $(this).closest('.gear-main-menu').find('> .gear-menu-list > ul');
		if (textoPesquisa === '') {
			lista.parent().removeClass('gear-search-started');
			lista.find('ul, li').removeAttr('style').removeClass('gear-active gear-result');
		} else {
			lista.parent().addClass('gear-search-started');
			lista.find('li,ul').removeAttr('style').hide().removeClass('gear-active gear-result').end().find('.submenu').end()
			     .find('li[data-search-name*="' + textoPesquisa + '"]').show().addClass('gear-result')
			     .parentsUntil('.gear-menu-list', '.submenu').show().addClass('gear-active').children('ul').show();
		}
	});

	$(document).on('click', '.gear-mt.gear-tabs .gear-tab', function(){
		var gearLine = $('<div/>', { class: 'gear-line' }),
			tabsWrap = $(this).closest('.gear-tabs-wrap'),
			tabsContentWrap = tabsWrap.next('.gear-tabs-content-wrap'),
			activeLI = $(this).closest('li'),
			tabContentActive = tabsContentWrap.children().eq(activeLI.index());
		if (tabsWrap.find('.gear-line').length)
			gearLine = tabsWrap.find('.gear-line');
		else {
			gearLine.css({ left: tabsWrap.find('.gear-active').position().left + tabsWrap[0].scrollLeft, width: tabsWrap.find('.gear-active').width() })
			tabsWrap.append(gearLine);
		}
		activeLI.addClass('gear-active').siblings().removeClass('gear-active');
		gearLine.css({	left: $(this).closest('li').position().left + $(this).closest('.gear-tabs-wrap')[0].scrollLeft,
						width: $(this).closest('li').width() })
				.one('transitionend', function(){ $(this).remove(); });
		tabContentActive.addClass('gear-active').siblings().removeClass('gear-active');
		tabsContentWrap.children(':first').css({ marginLeft: -(activeLI.index() * 100) + '%' });
	});

	$('.gear-mt.gear-tabs .gear-tabs-content-wrap').on('scroll', function(){
		var tabsLength = $(this).children('.gear-tab-content').length,
			tabWidth = $(this).innerWidth();
	});


	// POP MESSAGE
		var alreadyTouchPopMessage = false;

		function popMessageInit(pop){
			if (!(pop.is('[data-gear-pop-message]'))) {
				var gearPopMessageId, gearPopMessageIdUnique = false, gearPopMessageTry = 0;
				do {
					gearPopMessageId = Gear.randomChar(10);
					if (($('.pop[data-gear-pop-message="' + gearPopMessageId + '"]').length == 0) && ($('.message[data-gear-pop-message="' + gearPopMessageId + '"]').length == 0)) {
						gearPopMessageIdUnique = true;
					}
					gearPopMessageTry += 1;
					if (gearPopMessageTry > 250) {
						console.error('GEAR-ERROR: (Pop Message) > popMessageInit - Limite de tentativas de criação de identificador único excedidas. (250)')
						return;
					}
				}
				while (gearPopMessageIdUnique == false);
				pop.attr('data-gear-pop-message', gearPopMessageId);
				if (pop.is('[data-gear-pop-message-content]')) {
					var message = $('<div/>'),
						settings = {
							balloon: (pop.attr('data-gear-pop-message-balloon') != undefined ? true : false),
							color: pop.attr('data-gear-pop-message-color'),
							background: pop.attr('data-gear-pop-message-background'),
							preference: pop.attr('data-gear-pop-message-pref'),
							content: pop.attr('data-gear-pop-message-content'),
							width: pop.attr('data-gear-pop-message-width'),
							maxWidth: pop.attr('data-gear-pop-message-maxwidth')
						},
						classes = 'message ON' + (settings.balloon ? ' balloon' : '') + (settings.color ? ' ' + settings.color : '') + (settings.background ? ' back-' + settings.background : '');
					message.attr({
						class: classes,
						'data-gear-pop-message': gearPopMessageId
					}).html(settings.content);
					settings.width && message.css('width', settings.width);
					settings.maxWidth && message.css('max-width', settings.maxWidth);
					$('body').append(message);
				} else
					$('body').append(pop.children('.message').attr('data-gear-pop-message', gearPopMessageId).addClass('ON'));
			} else {
				if ($('.message[data-gear-pop-message="' + pop.attr('data-gear-pop-message') + '"]').length > 0) {
					if ($('.message[data-gear-pop-message="' + pop.attr('data-gear-pop-message') + '"]').length == 1) {
						$('.message[data-gear-pop-message="' + pop.attr('data-gear-pop-message') + '"]').addClass('ON');
					} else {
						console.error('GEAR-ERROR: (Pop Message) > popMessageInit - Mensagem duplicada: data-gear-pop-message(' + $('.message[data-gear-pop-message="' + pop.attr('data-gear-pop-message') + '"]').length + ') = "' + pop.attr('data-gear-pop-message') + '"');
						return;
					}
				} else {
					console.error('GEAR-ERROR: (Pop Message) > popMessageInit - Mensagem não encontrada: data-gear-pop-message = "' + pop.attr('data-gear-pop-message') + '"');
					return;
				}
			}
		}

		$(document).on('mouseover', function(){
			if ($('[data-gear-pop-message]').length == 1)
				$('.message[data-gear-pop-message]').remove();
		})

		$(document).on('touchstart', '.pop', function(e){
			if (alreadyTouchPopMessage == true)
				return;
			var self = $(this);
			popMessageInit(self);
			positionPopMessage(e.originalEvent.changedTouches[0], $('.message[data-gear-pop-message="' + self.attr('data-gear-pop-message') + '"]'));
			alreadyTouchPopMessage = true;
		});

		$(document).on('touchmove', '.pop', function(e){
			alreadyTouchPopMessage = 'move';
		});

		$(document).on('touchend', '.pop', function(e){
			if ($(this).is('[data-gear-pop-message-content]'))
				$('.message[data-gear-pop-message="' + $(this).attr('data-gear-pop-message') + '"]').remove();
			else
				$('.message[data-gear-pop-message="' + $(this).attr('data-gear-pop-message') + '"]').removeClass('ON').removeAttr('data-gear-pop-message').appendTo(this);
			$(this).removeAttr('data-gear-pop-message');
			if (alreadyTouchPopMessage == 'move')
				alreadyTouchPopMessage = false;
		});

		$(document).on('mouseover', '.pop', function(e){
			if (alreadyTouchPopMessage == true)
				return;
			var self = $(this);
			popMessageInit(self);
			positionPopMessage(e, $('.message[data-gear-pop-message="' + $(this).attr('data-gear-pop-message') + '"]'));
		});

		$(document).on('mousemove', '.pop', function(e){
			if (alreadyTouchPopMessage == true)
				return;
			if (!($(this).is('[data-gear-pop-message]')))
				$(this).mouseover();
			var message = $('.message[data-gear-pop-message="' + $(this).attr('data-gear-pop-message') + '"]');
			if ((message.length == 0) && !($(this).find('.message').length)) {
				console.error('GEAR-ERROR: (Pop Message) > mousemove - Mensagem não encontrada.');
				return;
			};
			positionPopMessage(e, message);
		});

		$(document).on('mouseleave', '.pop', function(){
			if (alreadyTouchPopMessage == true)
				return;
			if ($(this).is('[data-gear-pop-message-content]'))
				$('.message[data-gear-pop-message="' + $(this).attr('data-gear-pop-message') + '"]').remove();
			else
				$('.message[data-gear-pop-message="' + $(this).attr('data-gear-pop-message') + '"]').removeClass('ON').removeAttr('data-gear-pop-message').appendTo(this);
			$(this).removeAttr('data-gear-pop-message');
		});

		$(document).on('click', function(){
			alreadyTouchPopMessage = false;
		});

		function positionPopMessage(event, message){
			var width = message.outerWidth(),
				height = message.outerHeight(),
				offset = 10,
				compLeft, compTop, posLeft, posTop, marginLeft, marginTop, initialPos;
			message.removeClass('pos-top pos-left pos-bottom pos-right');
			initialPos = $('.pop[data-gear-pop-message="' + message.attr('data-gear-pop-message') + '"]').attr('data-gear-pop-message-pref');
			switch (initialPos) {
				case 'right':
					message.addClass('pos-right');
					compTop = event.pageY - $(window).scrollTop() - height / 2;
					compLeft = event.pageX - $(window).scrollLeft() + offset;
					break;
				case 'bottom':
					message.addClass('pos-bottom');
					compTop = event.pageY - $(window).scrollTop() + offset;
					compLeft = event.pageX - $(window).scrollLeft() - width / 2;
					break;
				case 'left':
					message.addClass('pos-left');
					compTop = event.pageY - $(window).scrollTop() - height / 2;
					compLeft = event.pageX - $(window).scrollLeft() - width - offset;
					break;
				default:
					message.addClass('pos-top');
					compTop = event.pageY - $(window).scrollTop() - height - offset;
					compLeft = event.pageX - $(window).scrollLeft() - width / 2;
			}
			posTop = compTop;
			posLeft = compLeft;
			if (compLeft < 0 && width != $(window).width()) {
				message.removeClass('pos-top pos-bottom pos-left').addClass('pos-right');
				posTop = event.pageY - $(window).scrollTop() - height / 2;
				posLeft = event.pageX - $(window).scrollLeft() + offset;
			} else if (compLeft + width > $(window).width() && width != $(window).width()) {
				message.removeClass('pos-top pos-right pos-bottom').addClass('pos-left');
				posTop = event.pageY - $(window).scrollTop() - height / 2;
				posLeft = event.pageX - $(window).scrollLeft() - width - offset;
			} else if (compTop + height > $(window).height() || width == $(window).width()) {
				message.removeClass('pos-right pos-bottom pos-left').addClass('pos-top');
				posTop = event.pageY - $(window).scrollTop() - height - offset;
				posLeft = event.pageX - $(window).scrollLeft() - width / 2;
			} else if (compTop < 0) {
				message.removeClass('pos-top pos-right pos-left').addClass('pos-bottom');
				posTop = event.pageY - $(window).scrollTop() + offset;
				posLeft = event.pageX - $(window).scrollLeft() - width / 2;
			}
			marginTop = posTop < 0 ? 0 : (posTop + height > $(window).height() ? $(window).height() - height : posTop);
			marginLeft = posLeft < 0 ? 0 : (posLeft + width > $(window).width() ? $(window).width() - width : posLeft);
			message.css({
				marginTop: marginTop,
				marginLeft: marginLeft,
				top: 0,
				left: 0
			});
		}

});