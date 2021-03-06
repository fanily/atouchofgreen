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
	};
	var loadImage = function (el, fn) {
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

	$.getJSON("keyword.json",function(data){
		var tabHtml = '';
		var postHtml = '';
		$.each(data, function(k,v){
			if (v.current) {
				tabHtml += '<li class="current">'+v.tab+'</li>';
				postHtml += '<div class="post-content current"></div>'
			} else {
				tabHtml += '<li>'+v.tab+'</li>';
				postHtml += '<div class="post-content"></div>';
			}
		});
		$('#post-list .tab').append(tabHtml);
		$('#post-list .post-container').append(postHtml);

		$.each(data, function(index, v){
			if (v.keyword === "眼裡的187") {
				var count = 0;
				var offset = 0;
				var getPost = function(offset, index) {
					var flag = false;
					$.ajax({
						url : "https://www.fanily.tw/group/getPostList",
						type : "post",
						async: false,
						dataType : "text",
						data : {
							slug : "aTouchofGreen",
							offset : offset
						}
					}).done(function(data){
						temp = JSON.parse(data);
						if (temp.length === 0) {
							var html = '<p class="message">目前尚無文章，敬請期待！</p>';
					 		$('#post-list .post-content:eq('+index+') .post-row').append(html);
						} else {
							if (offset === 0) {
								var layoutHtml = '<div class="grid post-row"></div>';
								layoutHtml += '<a class="more" target="_blank" href="https://www.fanily.tw/search/tag/'+v.keyword+'">看更多'+v.tab+'</a>';
								$('#post-list .post-content:eq('+index+')').append(layoutHtml);
							}
							var offical_author = ['11e5247d06a297469e58c061a61c97a3','11e524847ac4fb3a9e58c061a61c97a3'];
							for ($this in temp) {
								if (count >= 8) {
									flag = true;
									break;
								}
								var postData = temp[$this];
								if (postData.date < 1459502280) {
									flag = true;
									// 不要 1459502280 之前的文章
									break;
								}

								if (offical_author.indexOf(postData.author.id) === -1 && postData.date <= 1460304000) {
									// 非 offical account && 1460304000 之前的文章
									if (postData.image == '') {
										postData.image = 'https://www.fanily.tw/img/g_avatars.png';
									}
									var html = '<div class="post-block grid-item">';
									html += '<a href="https://www.fanily.tw/post/'+postData.id+'" target="_blank">';
									html += '<img src="'+postData.image+'">';
									html += '<span>'+postData.author.name+'@'+postData.title+'</span>';
									html += '</a></div>';
									$('#post-list .post-content:eq('+index+') .post-row').append(html);
									count++;
								}
							}
							offset += 20;
							if (count < 8 && flag === false) {
								getPost(offset, index);
							} else {
								if (v.current) {
									setTimeout(function() {
										$('#post-list .post-container .current').find('.grid').masonry({
											"itemSelector": '.grid-item'
										});
									}, 1000);
								};
							}
						}
					});
				}
				getPost(offset, index);

			} else {
				var html = '';
				get_fanily_post(v.keyword, function(data){
					temp = JSON.parse(data);
					 if (temp.length == 0) {
						html += '<p class="message">目前尚無文章，敬請期待！</p>';
					 } else {
					 	html += '<div class="grid post-row">';
						var n = 0;
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
						html += '<a class="more" target="_blank" href="https://www.fanily.tw/search/tag/'+v.keyword+'">看更多'+v.tab+'</a>';
					}
					$('#post-list .post-content:eq('+index+')').append(html);
					if (v.current) {
						setTimeout(function() {
							$('#post-list .post-container .current').find('.grid').masonry({
								"itemSelector": '.grid-item'
							});
						}, 1000);
					};
				});
			}
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
		$('#fanily-content').append(html);
		setTimeout(function() {
			$('#fanily-content').masonry({
				"itemSelector": '.post-block'
			});
		}, 1000);
	});

	if ($.browser === 'mobile') {
		$('#background-video').remove();
		$("#player").css("top" , ($(window).height() - $("#player").height())/2);

		$(window).scroll(function () {
			if ($(this).scrollTop() > 100) {
				$('.mobile-menu').fadeIn();
			} else {
				$('.mobile-menu').fadeOut();
			}
		});

	}else{
    	$.getScript("/js/jquery.tubular.min.js?t=2").done(function() {
			$('#background-video').tubular({videoId: 'odTBgVKdTto' , mute : false});
			window.addEventListener('scroll', scroll_to_mute , false);
		});
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
	}).on('click', '.menu .mobile-link', function(e){
		var toggled = $(this).data('toggled');
		$(this).data('toggled', !toggled);

		if (!toggled) {
			ga("atouchofgreen.send", "event", "menu", "click", "activity");
			$('.mobile-link-ul').addClass('show');
		} else {
			$('.mobile-link-ul').removeClass('show');
		}
	}).on('click', '.mobile-link-ul a', function(e){
		ga("atouchofgreen.send", "event", "menu", "click", "activity-"+$(this).attr('href'));

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
	}).on('click', '.menu .link', function(e){
		var toggled = $(this).data('toggled');
		$(this).data('toggled', !toggled);

		if (!toggled) {
			ga("atouchofgreen.send", "event", "menu", "click", "activity");
			$('.link-ul').addClass('show');
		} else {
			$('.link-ul').removeClass('show');
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
	}).on('click', '.link-ul a', function(e){
		ga("atouchofgreen.send", "event", "menu", "click", "activity-"+$(this).attr('href'));

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
		var index = $('.post-list .tab li').index(this);
		$(this).siblings().removeClass('current');
		$(this).addClass('current');

		$('.post-container .post-content').not(index).removeClass('current');
		$('.post-container .post-content').eq(index).addClass('current').find('.grid').masonry({
			"itemSelector": '.grid-item'
		});
	}).on('click', '.episode-section .tab li', function(e){
		var num = $(this).attr("data-value");
		$('#episode-content').empty();
		$(this).addClass('current');
		$(this).siblings().removeClass('current');

		var html = '<div class="episode" id="episodeGallery'+num+'" data-value="'+num+'">';
		$.getJSON("episode.json", function(data) {
			$.each(data[num], function(k, v){
				html += '<a href="'+v.big+'">';
				html += '<img src="'+v.thumb+'">';
				html += '</a>';
			});
			html += '</div>';
			$("#episode-content").append(html);
			$('#episodeGallery'+num).lightGallery({
				thumbnail:true,
				showThumbByDefault:true,
        		download:false
			});
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

	//get episode
	$.getJSON("episode.json", function(data) {
		var content_html = '';
		var num = 1;
		var next_num = 2;
		var total = Object.keys(data).length - 1;

		$.each(data, function(i,v) {
			tab_html = '<li data-value="'+i+'" class="episode-tab';
			if (total == i) {
				tab_html += ' current">';

				content_html += '<div class="episode" id="episodeGallery'+i+'" data-value="'+i+'">';
				$.each(v, function(key, pic){
					content_html += '<a href="'+pic.big+'">';
					content_html += '<img src="'+pic.thumb+'">';
					content_html += '</a>';
				});
				content_html += '</div>';
			} else {
				tab_html += '">';
			}

      if (num == 31) {
        tab_html += 'EP'+num+'</li>';
      }
      else {
        tab_html += 'EP'+num+'~'+next_num+'</li>';
      }
			num = num+2;
			next_num = next_num+2;

			$('#episodebody .tab').prepend(tab_html);
		});

		$("#episode-content").append(content_html);
		$('#episodeGallery'+total).lightGallery({
			thumbnail:true,
			showThumbByDefault:true,
      		download:false
		});
	});

	//get gallery
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
			showThumbByDefault:true,
     		download:false
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

  	//get video
	$.getJSON("videos.json?t=1460721762",function(data){
		var html = "";
		$.each(data, function(i,v){
			var url = "https://www.youtube.com/watch?v="+v.id;
			var post_url = "https://www.youtube.com/watch?v="+v.id;

			if (v.url !== "") {
				url = "http://live.fanily.tw/atouchofgreen-live/"+v.url;
			}
			if (v.post_id !== "") {
				post_url = "https://www.fanily.tw/post/"+v.post_id;
			}

			html += '<div class="video-item">';
			html += '<a href="'+url+'" target="_blank" class="video-pic-link">';
			html += '<i class="fa fa-play-circle"></i>';
			html += '<img class="video-pic" src="https://i.ytimg.com/vi/'+v.id+'/hqdefault.jpg">';
			html += '</a>';
			html += '<a href="'+post_url+'" target="_blank">';
			html += '<span class="caption">';
			if(v.post_id !== "") {
				html += '<i class="fa fa-paper-plane"></i>';
			}
			html += v.title+'</span>';
			html += '</a></div>';
		});
		$('.video-container').append(html);
	});
});
