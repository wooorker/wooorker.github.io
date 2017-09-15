(function($){
	$.fn.edslider = function(settings){
		var defaults = {
			//width     : 960,
			//height    : 400,
			position  : 1,
			interval  : 5000,
			duration  : 500,
			animation : true,
			//paginator : true,
			navigator : true,
			progress  : true,
			nodeFind  : 'li',
			sonNode   : 'li',
			snodeFind : 'li',
			//loadImgSrc: 'images/load.gif',
			//skin      : 'edslider'
		};

		var options = $.extend({}, defaults, settings);

		this.each(function(){

			//Building (wrapping, validating, setting up)
			var slider = $(this),
				sliderLi  = slider.find(options.nodeFind),
				sonNodeLi = $(options.sonNode).find(options.snodeFind);

			sliderLi.length == 0 && console.error('error: empty slider!');

			var startPosition = options.position;

			if(options.position == 0 || options.position > sliderLi.length){
				console.error('error: start position value must be between 1 and ' + sliderLi.length + '!');
				startPosition = 1;
			}

			slider
				.on('mouseenter', function(){
					$(this).addClass('hover');
					hoverControl();
				})
				.on('mouseleave', function(){
					$(this).removeClass('hover');
					hoverControl();
				})
				.add(sliderLi);

			sliderLi
				.filter(':nth-child(' + startPosition + ')')
				.addClass('active');

			//Controls (navigation, pagination and progress bar)
			var position, controls, progress, progressWidth, progressElapsed, interact = false;

			sliderLi.on('click', function(){
				sliderLi.removeClass('active');
				$(this).addClass('active');
				play();
			});

			progress = sliderLi
				.find('span')
				.prepend('<i class="s-progress"/>')
				.find('.s-progress').width(0);

			!options.progress && progress.height(0);

			//Functions (init, play, next, prev, pause, resume)
			var timeLeft = options.interval, current, index, paused;

			function init(){				
				//progressResize();
				sliderLi.length > 1 ? play() : sliderLi.fadeIn(options.duration);
			}

			function play(){
				progressReset();
				interact = false;
				current = sliderLi
					.filter('.active');

				progressWidth = current.find('span b').width();

				sonNodeLi.removeClass('current');
				sonNodeLi.eq(sliderLi.index(current)).addClass('current');
				
				sonNodeLi.filter('.current').siblings()
				.fadeOut(options.animation && options.duration || 0)
				.end()
				.fadeIn(options.animation && options.duration || 0, function(){
					interval();
				});

				index = sliderLi.index(current) + 1;


				sliderLi.filter('.active').find('i.border-bg').attr({'style': 'width:'+ (progressWidth - 8) + 'px'});
			}

			function next(){
				sliderLi.removeClass('active');
				if(++index <= sliderLi.length){
					current
						.next()
						.addClass('active')
				} else {
					sliderLi
						.filter(':first-child')
						.addClass('active');
				}
				play();
			}

			function prev(){
				sliderLi.removeClass('current');
				if(--index >= 1){
					current
						.prev()
						.addClass('current')
				} else {
					sliderLi
						.filter(':last-child')
						.addClass('current');
				}
				play();
			}

			function pause(){
				paused = true;
				progress.stop();
				progressElapsed = sliderLi.filter('.active').find('i.s-progress').width();
				console.log(progressElapsed);
				timeLeft = (progressWidth - progressElapsed) * (options.interval / progressWidth);
			}

			function interval(){
				paused = false;
				interact = true;
				progress.stop();
				sliderLi.filter('.active').find('i.s-progress')
					.show()
					.animate({
						width: '+=' + (progressWidth - progressElapsed - 4)
					}, timeLeft, 'linear', function(){
						progressReset();
						next();
					});
				hoverControl();
			}

			function progressReset(){
				progress.stop().width(0);				
				sliderLi.find('i.border-bg').width(0);				
				progressElapsed = 0;
				timeLeft = options.interval;
			}

			function progressResize(){
				return;
				$(window)
					.resize(function(){
						progressWidth = sliderLi.filter('.active').find('span').width();
						pause(); 
						interval();
					}).resize();
			}

			function hoverControl(){
				if(interact){
					if(slider.hasClass('hover')){
						pause();
					} else if(paused){
						interval();
					}
				}
			}

			init();
			
		});
	}
})(jQuery);