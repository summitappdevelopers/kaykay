const insert_html = '<div class="task-card">' +
					'	<input class="input-box" type="text" placeholder="Title"/>' +
					'	<textarea class="input-text" type="text" placeholder="Description"/></textarea>' +
					'	<br>' +
					'	<p class="time-text">3 Days</p>' +
					'</div>';

var kaykay = {
	__data: {
		min_size: 160,
		margin: 25,
		timeline_length: 0,
		timeline_element: $('#timeline'),
		cards: 0
	},
	utils: {
		random_color_class: function random_color_class() {
			return 'color' + (Math.floor(Math.random() * 9) + 1);
		},
		remove_px: function remove_px() {
			///////////////////////////
		}
	},
	timeline: {
		add_card: function add_card(left, width) {
			var new_card = $(insert_html).draggable({
				obstacle: '.task-card:not(.ui-draggable-dragging)',
				axis: 'x',
				constrainment: 'parent'
			}).resizable({
				handles: 'e,w',
				constrainment: 'parent',
				minWidth: kaykay.__data.min_size
			}).css({
				left: left + 'px',
				position: 'absolute',
				width: (width || kaykay.__data.min_size) + 'px'
			});

			new_card.find('.input-text').height('0px');

			++kaykay.__data.cards;

			if ((left + (width || kaykay.__data.min_size)) > kaykay.__data.timeline_length) {
				kaykay.__data.timeline_length = left + (width || kaykay.__data.min_size);
			}

			kaykay.__data.timeline_element.append(new_card).css({
				'width': kaykay.__data.timeline_length + 'px'
			});

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
		kaykay.timeline.add_card(Number.parseFloat($('.u_drh').css('left').replace('px', ''), 10));
	}
});

$(document).on('mouseleave', '.task-card', function() {
	var inputText = $(this).find('.input-text');

	if (inputText.val().length === 0) {
		inputText.height('0px');
	} else {
		inputText.autosize();
	}
});

$(document).on('mouseover', '.task-card', function() {
	var inputText = $(this).find('.input-text');

	if (inputText.val().length === 0) {
		inputText.height('auto');
		inputText.autosize();
	} else {
		inputText.autosize();
	}
});

// $(document).on('collision', '.task-card', function(event, ui) {
// 	$(event.obstacle.context).css('top', Number.parseFloat($(this).css('margin').replace('px', ''), 10) * 2 + parseFloat($(this).css('height').replace('px', ''), 10) + parseFloat($(this).css('top').replace('px'), 10));
// });

