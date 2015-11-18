var scroll_to_mute = function(){
	if( window.pageYOffset > $(window).height() ){
		player.setVolume(0);
	}else if( window.pageYOffset <= $(window).height() ){
		//根據滑動高度決定音量
		player.setVolume(parseInt(100*(($(window).height() - window.pageYOffset)/$(window).height())));
	}
}

jQuery(function($){
	if (window.matchMedia("screen and (max-width: 667px)").matches) {
		$.browser = 'mobile';
	} else if (window.matchMedia("screen and (min-width: 668px) and (max-width: 1024px)").matches) {
		$.browser = 'pad';
	} else {
		$.browser = 'desktop';
	}

	var get_fanily_post = function(keyword, callback) {
			$.ajax({
				url : "https://www.fanily.tw/search/lists/"+keyword,
				type : "get",
				dataType : "text",
			}).done(function(data){
				 callback(data);
			});
		}
		, loadImage = function (el, fn) {
			var img = new Image()
			  , src = el.getAttribute('data-src');
			fn = fn || function(){};
			img.onload = function() {
				if (!! el.parent)
					el.parent.replaceChild(img, el)
			  	else
			    	el.src = src;
			  	fn();
			}
			img.src = src;
		};

	var keywords = ['一把青專題報導','一把青人物專訪','一把青新聞花絮','一把青活動直擊','眼裡的187'];
	$.each(keywords, function(k, v){
		get_fanily_post(v, function(data){
			temp = JSON.parse(data);
			 var html = '';
			 if (temp.length == 0) {
				html += '<p class="message">目前尚無文章，敬請期待！</p>';
			 } else {
				var n = 0;
				html += '<div class="grid post-row">';
				for( $this in temp ){
					if (n >= 8) {
						break;
					}
					var data = temp[$this];
					if (data.post_image == '') {
						data.post_image = 'https://www.fanily.tw/img/g_avatars.png';
					}
					html += '<div class="post-block grid-item">';
					html += '<a href="https://www.fanily.tw/post/'+data.id+'" target="_blank">';
					html += '<img src="'+data.post_image+'">';
					html += '<span>'+data.post_title+'</span>';
					html += '</a></div>';
					n++;
				}
				html += '</div>';
			}
			$('#post-list .post-content:eq('+k+')').html(html);
		});
		$('.post-container .current').find('.grid').masonry({
			"itemSelector": '.grid-item'
		});
	});

	get_fanily_post('一把青', function(data){
		temp = JSON.parse(data);
		var n = 0
			, html = '';

		for( $this in temp ){
			if (n >= 8) {
				break;
			}
			var v = temp[$this];
			if (v.post_image == '') {
				v.post_image = 'https://www.fanily.tw/img/g_avatars.png';
			}
			if (v.author.avatar == '') {
				v.author.avatar = 'https://www.fanily.tw/img/m_avatars.png';
			}
			v.post_date = moment.unix(v.post_date).format('YYYY-MM-DD');

			html += '<div class="post-block grid-item">';
			html += '<a href="https://www.fanily.tw/post/'+v.id+'" target="_blank">';
			html += '<img class="banner" src="'+v.post_image+'">';
			html += '<div class="author"><img src="'+v.author.avatar+'"/>';
			html += '<p>'+v.author.author_name+'</p></div>';
			html += '<span class="title">'+v.post_title+'</span>';
			html += '<span class="date">'+v.post_date+'</span>';
			html += '</a></div>';

			n++;
		}
		$('#fanily-content').html(html);
	});

  setInterval(function(){
    if ($(window).scrollTop() >= $('#fanily-wall').offset().top) {
	  	$('#fanily-content').masonry({
  			"itemSelector": '.post-block'
  		});
  	}
  } , 10);


	if ($.browser === 'mobile') {
		$('#background-video').hide();
		$("#player").css("top" , ($(window).height() - $("#player").height())/2);

		$(window).scroll(function () {
			if ($(this).scrollTop() > 100) {
				$('.mobile-menu').fadeIn();
			} else {
				$('.mobile-menu').fadeOut();
			}
		});

	}else{
		$('#background-video').tubular({videoId: '4to7vr1ilcY' , mute : false});
		window.addEventListener('scroll', scroll_to_mute , false);
	}

	if ($.browser !== 'desktop') {
		$(window).scroll(function () {
			if ($(this).scrollTop() > 100) {
				$('#back-top').fadeIn();
			} else {
				$('#back-top').fadeOut();
			}
		});
	}

	$('body').on('click', '.menu .mobile-hamburger', function(e){
		var toggled = $(this).data('toggled');
		$(this).data('toggled', !toggled);

		if (!toggled) {
			$('.mobile-nav-ul').addClass('show');
		} else {
			$('.mobile-nav-ul').removeClass('show');
		}
	}).on('click', '.mobile-nav-ul a', function(e){
		$('.menu .mobile-hamburger').click();
		var target = $(this.hash);
		target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
		if (target.length) {
			$('html,body').animate({
					scrollTop: target.offset().top
			}, 1000);
			return false;
		}
	}).on('click', '.mobile-menu', function(e){
		var toggled = $(this).data('toggled');
		$(this).data('toggled', !toggled);

		if (!toggled) {
			$('.mobile-menu-ul').slideDown('normal');
		} else {
			$('.mobile-menu-ul').slideUp('fast');
		}
	}).on('click', '.mobile-menu-ul', function(e){
		$('.mobile-menu').click();
		var target = $(this.hash);
		target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
		if (target.length) {
			$('html,body').animate({
					scrollTop: target.offset().top
			}, 1000);
			return false;
		}
	}).on('click', '.menu .hamburger', function(e){
		var toggled = $(this).data('toggled');
		$(this).data('toggled', !toggled);

		if (!toggled) {
			$('.nav-ul').addClass('show');
		} else {
			$('.nav-ul').removeClass('show');
		}
	}).on('click', '.nav-ul a', function(e){
		$('.menu .hamburger').click();
		var target = $(this.hash);
		target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
		if (target.length) {
			$('html,body').animate({
					scrollTop: target.offset().top
			}, 1000);
			return false;
		}
	}).on('click', '#back-top a', function(e){
		e.preventDefault();
		$('body,html').animate({
			scrollTop: 0
		}, 800);
		return false;
	}).on('click', '.page-down .glyphicons', function(e){
		$('html,body').animate({
			scrollTop: window.innerHeight
		}, 600);
	}).on('click', '.video-list li', function(e){
		$(this).siblings().find('.glyphicons').removeClass('glyphicons-pause').addClass('glyphicons-play-button');
		$(this).find('.glyphicons').removeClass('glyphicons-play-button').addClass('glyphicons-pause');
		if(window.matchMedia("screen and (max-width: 667px)").matches){
			 $("#mobile-video-background").show();
			 $("iframe#player").attr("src","http://www.youtube.com/embed/"+$(this).attr("data-id")+"?enablejsapi=1")
			 $("span").click(function(){
				$("#mobile-video-background").hide();
				$("iframe#player").attr("src","");
			});
		}else{
			player.loadVideoById($(this).attr("data-id"));
		}
	}).on('click', '.menu .share', function(e){
		var toggled = $(this).data('toggled');
		$(this).data('toggled', !toggled);

		if (!toggled) {
			$('.share-ul').addClass('show');
		} else {
			$('.share-ul').removeClass('show');
		}
	}).on('click', '.share-ul li', function(e){
		var $self = $(this)
			, title = $('title').text()
			, url = window.location.href;

		if ($self.hasClass("fb")) {
				window.open('https://www.facebook.com/share.php?u='+encodeURI(url), '_blank');
		}
		if ($self.hasClass("plus")) {
				window.open('https://plus.google.com/share?url=' + encodeURI(url), '_blank');
		}
		if ($self.hasClass("weibo")) {
				window.open('http://v.t.sina.com.cn/share/share.php?title='+title+'&url='+url, '_blank');
		}
		if ($self.hasClass("line")) {
				window.open("http://line.naver.jp/R/msg/text/?"+url);
		}

		$('.menu .share').click();
	}).on('click', '.post-list .tab li', function(e){
		var index = $('.tab li').index(this);
		$(this).siblings().removeClass('current');
		$(this).addClass('current');

		$('.post-container .post-content').not(index).removeClass('current');
		$('.post-container .post-content').eq(index).addClass('current').find('.grid').masonry({
			"itemSelector": '.grid-item'
		});
	});

	var clip = new ZeroClipboard( $(".share-ul li.copy") );
	clip.on( 'ready', function(event) {
			clip.on( 'copy', function(event) {
				event.clipboardData.setData("text/plain", window.location.href);
			} );
			clip.on( 'aftercopy', function(event) {
				alert('複製網址成功！');
			} );
	} );

	$.getJSON("gallery.json", function(data) {
		var html = '';
		for (var i=data.length; i >= 1; i--) {
			var key = i-1;
			$.each(data[key], function(i,v) {
				html += '<a href="/img/'+key+'/'+v.name+'" data-sub-html="'+v.desc+'">';
				html += '<img src="/img/'+key+'/thumb/'+v.name+'">';
				html += '</a>';
			});
		}
		$('#imageGallery').append(html);

		$('#imageGallery').lightGallery({
			thumbnail: true,
			showThumbByDefault:true
		});

		var count = $('#imageGallery a').length;
		if (count <= 8) {
			$('#imageGallery a').addClass('show');
		} else {
			$('#imageGallery a:lt(8)').addClass('show');
			$('#imageGallery').after('<span class="show-more">更多劇照</span>');

			var $gallery = $('#imageGallery a.show:first img');
			var w = $gallery.width();
			if (w == 0) {
				w = 100;
			}
			$('#gallerybody .show-more').css({
				'display': 'inline-block',
				'width': w,
				'margin-top': (w - 50) / 2
			}).click(function(e){
				e.stopPropagation();
				var offset = $('#imageGallery a.show').length;
				offset += 8;

				$('#imageGallery a:lt('+offset+')').addClass('show');
				if (offset >= count) {
					$(this).remove();
				}
			});
		}
	});
});
