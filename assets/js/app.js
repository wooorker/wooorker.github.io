$(function(){
	//滚动后导航变透明
	var navOffset = 30;
    $(window).scroll(function(){  
        var scrollPos = $(window).scrollTop(); 
        if(scrollPos >= navOffset){  
            $(".navbar-inverse").css({'opacity': 0.70});  
        }else{  
            $(".navbar-inverse").css({'opacity': 1});;  
        }  
    });  


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
			$('.bg-blur').addClass('bg-filter');

			$(dom).addClass(type).show();

			//执行滑动效果
			$('.cover-heading tr').edslider({
		        nodeFind  : 'td',
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
		setAutoFade('.wrapper-inner', 'showWrap', 500);
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
		        updateLang(lang);
		    }
		});
	}
	
	//更改语言
	var movePointer = ['msg_smarter','msg_simpler','msg_beautiful'];

	var updateLang = function (lang) {
		// Accessing values through the map
		//console.log(data);
		$('[language]').each(function(){
			var tag = this.tagName;
			var _thisTag = $(this).attr('language');
			$(this).attr('selectedLang', 'lang-' + lang);
			//移动版去掉点
			if($(window).width() < 640 && $.inArray(_thisTag, movePointer) >= 0){
				$(this).html($.i18n.prop(_thisTag).replace('.', ''));
			}else{
				if( tag == 'INPUT' || tag == 'TEXTAREA' ){
					$(this).attr('placeholder', $.i18n.prop(_thisTag));
				}else{
					$(this).html($.i18n.prop(_thisTag));
				}
			}
		})
	}

	//获取语言初始化语言
	//var browser = $.i18n.browserLang() || 'en_US';
	var browser = $.cookie('web_lang') || 'en';
	$('#selected img').attr('src', $('#menu li[data-select="'+ browser +'"]').find('img').attr('src'));
	loadBundles(browser);
					
	//切换语言
	$('#menu li').click(function() {
		var selection = $(this).attr('data-select');
		$.cookie('web_lang', selection, { expires: 7 });
		$('#selected img').attr('src', $(this).find('img').attr('src'));
		loadBundles(selection);
	});

	//动态滑到效果
	var slipNav = function (){
		var $liCur = $("#change-theme li.active"),  
        curP = $liCur.position().left,  
        //curW = $liCur.outerWidth(true),  
        curW = $liCur.width(),  
        $slider = $(".nav-line");
        $slider.stop(true, true).animate({  
            "left":curP,  
            "width":curW
        });
    };

    var page = 0;

	var autoPlay = function() {
		var $expert_list = $('#change-theme');   
		var len_li = $expert_list.find('li').length;      
		if (page >= len_li-1) {   
			page = 0;       
		} else {            
			page++;       
		}
		
		$expert_list.find('li').removeClass('active');
		var curLi = $expert_list.find('li').eq(page);
		curLi.addClass('active');
		$('.themes-picture img').attr({'src': curLi.attr('data-src'),'alt': curLi.text()});

		slipNav();
	}

	//切换主题
	if($('#change-theme').length > 0){
		//初始运行滑动
		slipNav();

		//轮播
    	var t = setInterval(function(){ 
			autoPlay()
		}, 3000);

  		//轮播暂停，重启
    	$('#change-theme').mouseover(function(){
      		clearInterval(t);
      	}).mouseout(function(){    
        	t = setInterval(function(){
        		autoPlay()
        	}, 3000);
        });

		//点击滑到
		$('#change-theme li').click(function(){
			$(this).addClass('active');
			$(this).siblings('li').removeClass('active');
			$('.themes-picture img').attr({'src': $(this).attr('data-src'),'alt': $(this).text()});
			page = $(this).index();
			//执行滑动效果
			slipNav();
		})
	}

});