$.fn.top = function top() {
	return Number.parseFloat(($(this).css('top') || '0px').replace('px', ''), 10);
}

$.fn.left = function left() {
	return Number.parseFloat(($(this).css('left') || '0').replace('px', ''), 10);
}

const insert_html = '<div class="task-card">' +
					'	<input class="input-box" type="text" placeholder="Title"/>' +
					'	<textarea class="input-text" type="text" placeholder="Description"/></textarea>' +
					'	<br>' +
					'	<p class="time-text">3 Days</p>' +
					'</div>';

var kaykay = {
	data: {
		should_push: 'right',
		min_size: 200,
		grid_size: 180,
		margin: 25,
		top_margin: 90,
		timeline_element: $('#timeline'),
		cards: 0,
		scale: 1,
		minute_width: 72
	},
	utils: {
		random_color_class: function random_color_class() {
			return 'color' + (Math.floor(Math.random() * 9) + 1);
		},
		get_date: function get_date(width) {
			var minuteWidth = kaykay.data.minute_width * kaykay.data.scale;
			var minutes = Math.round(width / minuteWidth * 100) / 100;
			var hours = Math.round(minutes / 60 * 100) / 100;
			var days = Math.round(hours / 24 * 100) / 100;

			if (days > 1) {
				return days + ' days';
			} else if (hours > 1) {
				return hours + ' hours';
			} else {
				return minutes + ' minutes';
			}
		}
	},
	timeline: {
		add_card: function add_card(left, width, top) {
			var new_card = $(insert_html).draggable({
				obstacle: '.task-card:not(.ui-draggable-dragging)',
				// axis: 'x',
				grid: [1, kaykay.data.grid_size]
			}).resizable({
				handles: 'e,w',
				minWidth: kaykay.data.minute_width * kaykay.data.scale
			}).css({
				top: top || '',
				left: left + 'px',
				position: 'absolute',
				width: (width || kaykay.data.min_size) + 'px'
			});

			new_card.find('.input-text').height('0px');
			new_card.find('.time-text').text(kaykay.utils.get_date(new_card.width()));

			++kaykay.data.cards;

			kaykay.data.timeline_element.append(new_card);

			$(window).scrollLeft(new_card.left());
		},
		zoom_out: function zoom_out() {
			kaykay.data.scale /=  1.5;

			$('.task-card').toArray().forEach(function(card) {
				$(card).animate({
					width: $(card).width() / 1.5,
					left: $(card).left() / 1.5
				}, 200, 'linear');
			});
		},
		zoom_in: function zoom_in() {
			kaykay.data.scale *=  1.5;

			$('.task-card').toArray().forEach(function(card) {
				$(card).animate({
					width: $(card).width() * 1.5,
					left: $(card).left() * 1.5
				},200,'linear');
			});
		},
		zoom_scale: function zoom_scale(scale){
			$('.task-card').toArray().forEach(function(card) {
				$(card).animate({
					width: $(card).width()/kaykay.data.scale * scale,
					left: $(card).left()/kaykay.data.scale * scale
				},200,'linear');
			});
			kaykay.data.scale = scale;
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

			kaykay.data.timeline_element.children().toArray().forEach(function(card) {
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
		top -= top % kaykay.data.grid_size;
		top = top < 0 ? 0 : top;
		top += kaykay.data.top_margin;

		kaykay.timeline.add_card(left, kaykay.data.minute_size, top);
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
	$(this).find('.input-text').autosize();


	if (inputText.val().length === 0) {
		inputText.height('auto');
		inputText.trigger('autosize.resize')
	} else {
		inputText.trigger('autosize.resize');
	}
});

$(document).on('resize', '.task-card', function() {
	$(this).find('.time-text').text(kaykay.utils.get_date($(this).width()));

	$(this).find('.input-text').autosize();
});

$('.zoom-in').click(function(){
	kaykay.timeline.zoom_in();
});

$('.zoom-out').click(function(){
	kaykay.timeline.zoom_out();
});

// $('.zoom-button').click(function(){
// 	console.debug(kaykay.data.scale);
// });

// $(document).on('collision', '.task-card', function(event, ui) {
// 	if (kaykay.data.should_push === 'down') {
// 		$(event.obstacle.context).css('top', (Number.parseFloat($(this).css('margin').replace('px', ''), 10) * 2 + Number.parseFloat($(this).css('height').replace('px', ''), 10) + Number.parseFloat($(this).css('top').replace('px'), 10)) + 'px');
// 	} else if (kaykay.data.should_push === 'right') {
// 		$(event.obstacle.context).css('left', (Number.parseFloat($(this).css('left').replace('px', ''), 10) + Number.parseFloat($(this).css('margin').replace('px', ''), 10) * 2 + Number.parseFloat($(this).css('width').replace('px', ''), 10)) + 'px');
// 	}
// });
