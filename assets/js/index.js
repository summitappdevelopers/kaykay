const insert_html = '<div class="task-card">' +
					'	<input class="input-box" type="text" placeholder="Title"/>' +
					'	<textarea class="input-text" type="text" placeholder="Description"/></textarea>' +
					'	<br>' +
					'	<p class="time-text">3 Days</p>' +
					'</div>';

var kaykay = {
	__data: {
		should_push: 'right',
		min_size: 200,
		grid_size: 180,
		margin: 25,
		top_margin: 90,
		timeline_element: $('#timeline'),
		cards: 0
	},
	utils: {
		random_color_class: function random_color_class() {
			return 'color' + (Math.floor(Math.random() * 9) + 1);
		}
	},
	timeline: {
		add_card: function add_card(left, width, top) {
			var new_card = $(insert_html).draggable({
				obstacle: '.task-card:not(.ui-draggable-dragging)',
				// axis: 'x',
				grid: [1, kaykay.__data.grid_size]
			}).resizable({
				handles: 'e,w',
				minWidth: kaykay.__data.min_size
			}).css({
				top: top || '',
				left: left + 'px',
				position: 'absolute',
				width: (width || kaykay.__data.min_size) + 'px'
			});

			new_card.find('.input-text').height('0px');

			++kaykay.__data.cards;

			kaykay.__data.timeline_element.append(new_card);

			$(window).scrollLeft(new_card.offset().left);
		},

		import_json: function import_data(cards) {
			console.warn('%ckaykay.timeline.import_json: Deprecation warning!', 'color:orange');

			cards.forEach(function(card) {
				kaykay.timeline.add_card(data.left, data.width);
			});
		}
	},
	api: {
		serialize: function serialize() {
			console.warn('%ckaykay.api.serialize: Deprecation warning!', 'color:orange');

			var json_output = [];

			kaykay.__data.timeline_element.children().toArray().forEach(function(card) {
				card = $(card);

				json_output.push({
					data: {},
					color_class: Number.parseInt(card.attr('class').replace(/(\s|task\-card|color)/g, ''), 10),
					left: Number.parseFloat(card.css('left').replace('px', ''), 10),
					width: Number.parseFloat(card.css('width').replace('px', ''), 10)
				});
			});

			return json_output;
		}
	}
};

$('.add').draggable({
	helper: function() {
		return $('<div class="u_drh"></div>');
	},
	start: function() {
		$('.u_drh').fadeOut(0).append(insert_html).fadeIn(500);
	},
	stop: function() {
		var left = Number.parseFloat($('.u_drh').css('left').replace('px', ''), 10);
		var top = Number.parseFloat($('.u_drh').css('top').replace('px', ''), 10);
		top -= top % kaykay.__data.grid_size;
		top = top < 0 ? 0 : top;
		top += kaykay.__data.top_margin;

		kaykay.timeline.add_card(left, kaykay.__data.min_size, top);
	}
});

$(document).on('mouseleave', '.task-card', function() {
	var inputText = $(this).find('.input-text');

	if (inputText.val().length === 0) {
		inputText.height('0px');
		inputText.blur();
	} else {
		inputText.trigger('autosize.resize');
	}
});

$(document).on('mouseover', '.task-card', function() {
	var inputText = $(this).find('.input-text');

	if (inputText.val().length === 0) {
		inputText.height('auto');
		inputText.trigger('autosize.resize')
	} else {
		inputText.trigger('autosize.resize');
	}
});

// $(document).on('collision', '.task-card', function(event, ui) {
// 	if (kaykay.__data.should_push === 'down') {
// 		$(event.obstacle.context).css('top', (Number.parseFloat($(this).css('margin').replace('px', ''), 10) * 2 + Number.parseFloat($(this).css('height').replace('px', ''), 10) + Number.parseFloat($(this).css('top').replace('px'), 10)) + 'px');
// 	} else if (kaykay.__data.should_push === 'right') {
// 		$(event.obstacle.context).css('left', (Number.parseFloat($(this).css('left').replace('px', ''), 10) + Number.parseFloat($(this).css('margin').replace('px', ''), 10) * 2 + Number.parseFloat($(this).css('width').replace('px', ''), 10)) + 'px');
// 	}
// });
