$.fn.top = function top(setter) {
	if (setter) {
		return this.css('top', setter);
	}

	return Number.parseFloat((this.css('top') || '0').replace('px', ''), 10);
};

$.fn.left = function left(setter) {
	if (setter) {
		return this.css('left', setter);
	}

	return Number.parseFloat((this.css('left') || '0').replace('px', ''), 10);
};

$.fn.add_data = function mData(keys) {
	if (typeof keys !== 'object') {
		throw new Error('Argument must be a dictionary.');
	}

	for (var key in keys) {
		if (keys.hasOwnProperty(key)) {
			this.data(keys[key][0], keys[key][1]);
		}
	}

	return this;
};

$.fn.remove_data = function dmData(keys) {
	if (typeof keys !== 'object') {
		throw new Error('Argument must be an array.');
	}

	for (var iter = 0; iter < keys.length; iter++) {
		$.removeData(this, keys[iter]);
	}

	return this;
};

const insert_html = '<div class="task-card">' +
					'	<input class="input-box" type="text" placeholder="Title" />' +
					'	<textarea class="input-text" type="text" placeholder="Description"></textarea>' +
					'	<br />' +
					'	<p class="time-text"></p>' +
					'</div>';

var kaykay = {
	data: {
		should_push: 'right',
		min_size: 108,
		grid_size: 180,
		margin: 25,
		top_margin: 140,
		timeline_element: $('#timeline'),
		cards: 0,
		scale: 1
	},
	init: function init() {
		var Kaycard = React.createClass({
			render: function render() {
				if (this.props.data.ok) {
					function onChange(){}; /** Useless onChange function. */

					function removeProject(id,kid){
						$.get('/api/project/'+id+'/kaycard/'+kid+'/remove', function(response){
							if(response.ok){
								$('div.task-card[data-id=\'' + kid + '\']').remove();
							}
						});
					}

					var kaycardNodes = this.props.data.data.map(function(kaycard) {
						kaykay.data.cards++;

						var cardStyle = {
							left: kaycard.left,
							top: kaycard.top,
							width: kaycard.width
						};

						return (
							<div style={cardStyle} className="task-card" key={kaycard._id} data-id={kaycard._id}>
								<input className="input-box" type="text" placeholder="Title" value={kaycard.title} onChange={onChange.bind(this)} />
								<RemoveButton removeKaycard={removeProject.bind(this, projectID, kaycard._id)} />
								<textarea className="input-text" type="text" placeholder="Description" value={kaycard.description} onChange={onChange.bind(this)}></textarea>
								<br />
								<p className="time-text"></p>
							</div>
						);
					});

					return (
						<div>
							{kaycardNodes}
						</div>
					);
				} else {
					return (
						<div></div>
					);
				}
			}
		});

		var RemoveButton = React.createClass({
    		render: function(){
        		return (
           			<img className="delete-img" src="/img/x.svg" onClick={this.props.removeKaycard}></img>
        		)
    		}
		});

		var kaycards = JSON.parse($.ajax({
			type: 'GET',
			url: '/api/project/' + projectID + '/kaycard/all',
			async: false
		}).responseText);

		React.render(
			<Kaycard data={kaycards} />,
			kaykay.data.timeline_element.get(0)
		);

		kaykay.utils.recalculate($('.task-card'));

		var children = $('.task-card').toArray();
		for (var iter = 0; iter < children.length; iter++) {
			var child = $(children[iter]);

			child.draggable({
				obstacle: '.task-card:not(.ui-draggable-dragging)',
				// axis: 'x',
				grid: [1, kaykay.data.grid_size]
			}).resizable({
				handles: 'e,w',
				minWidth: kaykay.data.min_size * kaykay.data.scale
			}).data('initial', {
				top: child.top(),
				left: child.left(),
				width: child.width(),
				title: child.find('.input-box').val(),
				description: child.find('.input-text').val()
			});
		}
	},
	utils: {
		random_color_class: function random_color_class() {
			return 'color' + (Math.floor(Math.random() * 9) + 1);
		},
		get_date: function get_date(width) {
			width /= kaykay.data.scale;

			var minuteWidth = kaykay.data.min_size;
			var minutes = Math.round((width / minuteWidth) * 100) / 100;
			var hours = Math.round((minutes / 60) * 100) / 100;
			var days = Math.round((hours / 24) * 100) / 100;
			var months = Math.round((days / 31) * 100) / 100; // rekt.. which month # do we use?
			var years = Math.round((months / 12) * 100) / 100;

			if(years > 1) {
				return years + ' years';
			} else if(months > 1) {
				return months + ' months';
			} else if (days > 1) {
				return days + ' days';
			} else if (hours > 1) {
				return hours + ' hours';
			} else {
				return minutes + ' minutes';
			}
		},
		recalculate: function recalculate(card){
			card.find('.time-text').text(kaykay.utils.get_date(card.width()));
			card.find('.input-text').trigger('autosize.resize');
		},
		save: function save(card) {
			var updated_initial = {
				top: card.top(),
				left: card.left(),
				width: card.width(),
				title: card.find('.input-box').val(),
				description: card.find('.input-text').val()
			};

			if (card.attr('data-id')) {
				$.post('/api/project/' + projectID + '/kaycard/' + card.attr('data-id') + '/edit', updated_initial);
			} else {
				$.post('/api/project/' + projectID + '/kaycard/create', updated_initial, function(response) {
					if (response.ok) {
						card.attr('data-id', response.data._id);
					} else {
						throw new Error('Response was not ok. Message: "' + response.message + '"');
					}
				});
			}

			card.data('initial', updated_initial);
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
				minWidth: kaykay.data.min_size * kaykay.data.scale
			}).css({
				top: top || '',
				left: left + 'px',
				position: 'absolute',
				width: (width || kaykay.data.min_size) + 'px'
			});

			new_card.data('initial', {
				top: new_card.top(),
				left: new_card.left(),
				width: new_card.width(),
				title: new_card.find('.input-box').val(),
				body: new_card.find('.input-text').val()
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
					width: $(card).width() / 1.5
					// left: $(card).left() / 1.5
				}, 200, 'linear');
			});

			kaykay.utils.recalculate($('.task-card'));
		},
		zoom_in: function zoom_in() {
			kaykay.data.scale *=  1.5;

			$('.task-card').toArray().forEach(function(card) {
				$(card).animate({
					width: $(card).width() * 1.5
					// left: $(card).left() * 1.5
				},200,'linear');
			});

			kaykay.utils.recalculate($('.task-card'));
		},
		zoom_scale: function zoom_scale(scale){
			if(scale!==kaykay.data.scale){
				$('.task-card').toArray().forEach(function(card) {
					$(card).data('final_width', $(card).width() / kaykay.data.scale * scale);
					// $(card).data('final_left', $(card).left() / kaykay.data.scale * scale);

					$(card).stop(true, true).animate({
						width: $(card).data('final_width')
						// left: $(card).data('final_left')
					}, 200, function(){
						$(this).width($(this).data('final_width'));
						// $(this).left($(this).data('final_left'));

						kaykay.utils.recalculate($(this));

						$.removeData($(this), 'final_width');
						// $.removeData($(this), 'final_left');
					});
				});

				kaykay.data.scale = scale;
			}
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
		},
		save: function save() {
			var cards = $('.task-card');
			cards.toArray().forEach(function(card) {
				kaykay.utils.save($(card));
			});
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
		inputText.trigger('autosize.resize');
	} else {
		inputText.trigger('autosize.resize');
	}
});

$(document).on('resize', '.task-card', function() {
	kaykay.utils.recalculate($(this));
});


$('.minute').click(function(){
	kaykay.timeline.zoom_scale(1);
});

$('.hour').click(function(){
	kaykay.timeline.zoom_scale(1/60);
});

$('.day').click(function(){
	kaykay.timeline.zoom_scale(1/(60 *24));
});

$('.month').click(function(){
	kaykay.timeline.zoom_scale(1/(60 * 24 * 31));
});

$('.year').click(function(){
	kaykay.timeline.zoom_scale(1/(60 * 24 * 31 * 12));
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

kaykay.init();
