$(function () {
	window.createWebSocket = function (path) {
		return new WebSocket((location.protocol === 'https:' ? 'wss://' : 'ws://') + location.host + path);
	}

	$('.navbar-default').find('li').each(function (index, el) {
		var $a = $(el).children('a')
		if ($a && $a.length === 1 && $a.attr('href') === location.pathname) {
			var $li = $(el);
			while ($li.length > 0) {
				$li.addClass('active');
				$li = $li.parent().closest('li');
			}
		}
	});


	/* Инициализация библиотеки всплывающего окна */
	$('select').select2();
	$.wbox.init({
		parent: 'body',
		blures: '#all',
		afterOpen: function () {
			// Кастомные чекбоксы в окне
			$('.w-box input.switch:checkbox').switchCheckbox();
			// Кастомный выпадающий список
			$('.w-box select:not(.custom)').select2({
				language: "ru"
			});
			// Redactor
			$('.w-box textarea.htmlText').redactor();
		},
		beforeClose: function () {
			$('.w-box select.select2-hidden-accessible').select2('close');
		}
	});

	var contentSize = $('#content').outerHeight()

	function updatePage() {
		if ($(document).scrollTop() < 10) {
			$('.back-to-top').fadeOut();
		} else {
			$('.back-to-top').fadeIn();
		}

		$('#content').outerHeight(contentSize);
		var contentSpace = $('footer').offset().top - $('#content').offset().top - 20;
		if (contentSize < contentSpace) {
			$('#content').outerHeight(contentSpace);
		}
	}

	$(window).scroll(updatePage);
	$(window).resize(updatePage);
	updatePage();

	$('.timepicker').each(function (index, el) {
		$(el).datetimepicker(timepk);
	});
	$('.datepicker').each(function (index, el) {
		$(el).datetimepicker({
			lang: 'ru',
			timepicker: false,
			format: $(el).data("format") || 'd.m.Y',
			formatDate: $(el).data("format") || 'd.m.Y',
			onChangeDateTime: function () {
				$(this).datetimepicker('hide');
			}
		});
	});


	Number.prototype.formatMoney = function (c, d, t) {
		var n = this,
			c = isNaN(c = Math.abs(c)) ? 2 : c,
			d = d == undefined ? "." : d,
			t = t == undefined ? "&nbsp;" : t,
			s = n < 0 ? "-" : "",
			i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
			j = (j = i.length) > 3 ? j % 3 : 0;
		return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
	};

	// выделение текста при клике
	$('body').on('click', '.clickselect', function (event) {
		var e = this;
		if (window.getSelection) {
			var s = window.getSelection();
			if (s.setBaseAndExtent) {
				s.setBaseAndExtent(e, 0, e, e.innerText.length - 1);
			} else {
				var r = document.createRange();
				r.selectNodeContents(e);
				s.removeAllRanges();
				s.addRange(r);
			}
		} else if (document.getSelection) {
			var s = document.getSelection();
			var r = document.createRange();
			r.selectNodeContents(e);
			s.removeAllRanges();
			s.addRange(r);
		} else if (document.selection) {
			var r = document.body.createTextRange();
			r.moveToElementText(e);
			r.select();
		}
	});

	$(".li-search").click(function () {
		$(this).children(".allsearch").focus();
	});
	$(".allsearch").focus(function () {
		$(this).parent(".li-search").addClass('focus')
	}).blur(function () {
		$(this).parent(".li-search").removeClass('focus')
	});

});
