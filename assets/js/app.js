$(function(){
	//初始化首页高度（只有首页）
	if($('.wrapper-inner').length > 0){
		$('body').css({'height': $(document.body).height(), 'overflow': 'hidden'}); 
	}

	var typeWriter = function(dom){
		
		var theater = new theaterJS();
		var advantTxt = $('#'+dom).text();
		
		theater
	        .on('type:start, erase:start', function () { 
	        	//theater.getCurrentActor().$element.style.backgroundColor = 'yellow' 
	        })
	        .on('type:end, erase:end', function () {
	        	//theater.getCurrentActor().$element.style.backgroundColor = 'transparent' 
	        })
	        .addActor(dom, { accuracy: 1 })
	        .addScene(dom + ':' + advantTxt, 500)
	        .addScene(function (done) { 
	        	//alert('OK');
	        	done(); 
	        })
	        
	};

	var setAutoFade = function(dom, type, time){
		var t = time || 1000;

		setTimeout(function(){

			$(dom).addClass(type).show();

			//执行滑动效果
			$('.cover-heading').edslider({
		        nodeFind  : 'span',
		        sonNode   : 'div.inner-slide',
		        snodeFind : 'div.item-slide'
		    });

		}, t); 
	};

	/*
	//初始第一个有点
	var advant = 'smarter';
	if($('#'+advant).length > 0){
		typeWriter(advant);
	}

	$('.cover-heading span').click(function(){
		var _this = $(this),_thisAdv = _this.attr('id');

		_this.siblings('span').removeClass('active');
		_this.addClass('active');
		$('.advant-text p').attr('data-view', _thisAdv);

		typeWriter(_thisAdv);
	});
	*/

	//500毫秒后执行动画效果
	if($('.wrapper-inner').length > 0){
		setAutoFade('.wrapper-inner', 'animated fadeInUp', 500);
	}

	//语言切换
	//加载语言包
	var loadBundles = function(lang) {
		$.i18n.properties({
		    name:'smart', 
		    path:'lang/', 
		    mode:'both',
		    language:lang,
		    callback: function() {
		        updateLang();
		    }
		});
	}
	
	//更改语言
	var updateLang = function () {
		// Accessing values through the map
		//console.log(data);
		$('[language]').each(function(){
			var _thisTag = $(this).attr('language');
			$(this).html($.i18n.prop(_thisTag));
		})
	}

	//获取语言初始化语言
	var browser = $.i18n.browserLang();
	//loadBundles(browser);
					
	//切换语言
	$('#menu li').click(function() {
		var selection = $(this).attr('data-select');
		$('#selected img').attr('src', $(this).find('img').attr('src'));
		loadBundles(selection);
	});

	//切换主题
	if($('#change-theme').length > 0){
		$('#change-theme li').click(function(){
			$(this).addClass('active');
			$(this).siblings('li').removeClass('active');
			$('.themes-picture img').attr({'src': $(this).attr('data-src'),'alt': $(this).text()});
		})
	}

});