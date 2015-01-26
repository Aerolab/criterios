// Typed.js (Santz)

	!function($){

	  "use strict";

	  var Typed = function(el, options){

	    // chosen element to manipulate text
	    this.el = $(el);
	    // options
	    this.options = $.extend({}, $.fn.typed.defaults, options);

	    // text content of element
	    this.text = this.el.text();

	    // typing speed
	    this.typeSpeed = this.options.typeSpeed;

	    // add a delay before typing starts
	    this.startDelay = this.options.startDelay;

	    // backspacing speed
	    this.backSpeed = this.options.backSpeed;

	    // amount of time to wait before backspacing
	    this.backDelay = this.options.backDelay;

	    // input strings of text
	    this.strings = this.options.strings;

	    // character number position of current string
	    this.strPos = 0;

	    // current array position
	    this.arrayPos = 0;

	    // current string based on current values[] array position
	    this.string = this.strings[this.arrayPos];

	    // number to stop backspacing on.
	    // default 0, can change depending on how many chars
	    // you want to remove at the time
	    this.stopNum = 0;

	    // Looping logic
	    this.loop = this.options.loop;
	    this.loopCount = this.options.loopCount;
	    this.curLoop = 1;
	    if (this.loop === false){
	        // number in which to stop going through array
	        // set to strings[] array (length - 1) to stop deleting after last string is typed
	        this.stopArray = this.strings.length-1;
	    }
	    else{
	        this.stopArray = this.strings.length;
	    }

	    // All systems go!
	    this.build();
	  }

	    Typed.prototype =  {

	        constructor: Typed

	        , init: function(){
	            // begin the loop w/ first current string (global self.string)
	            // current string will be passed as an argument each time after this
	            var self  = this;
	            setTimeout(function() {
	                // Start typing
	                self.typewrite(self.string, self.strPos)
	            }, self.startDelay);
	        }

	        , build: function(){
	            // Insert cursor
	            this.el.after("<span id=\"typed-cursor\">|</span>");
	            this.init();
	        }

	        // pass current string state to each function
	        , typewrite: function(curString, curStrPos){

	            // varying values for setTimeout during typing
	            // can't be global since number changes each time loop is executed
	            var humanize = Math.round(Math.random() * (100 - 30)) + this.typeSpeed;
	            var self = this;

	            // ------------- optional ------------- //
	            // backpaces a certain string faster
	            // ------------------------------------ //
	            // if (self.arrayPos == 1){
	            //  self.backDelay = 50;
	            // }
	            // else{ self.backDelay = 500; }

	            // contain typing function in a timeout
	            setTimeout(function() {

	                // make sure array position is less than array length
	                if (self.arrayPos < self.strings.length){

	                    // check for an escape character before a pause value
	                    if (curString.substr(curStrPos, 1) === "^") {
	                        var charPauseEnd = curString.substr(curStrPos + 1).indexOf(" ");
	                        var charPause = curString.substr(curStrPos + 1, charPauseEnd);
	                        // strip out the escape character and pause value so they're not printed
	                        curString = curString.replace("^" + charPause, "");
	                    }
	                    else {
	                        var charPause = 0;
	                    }

	                    // timeout for any pause after a character
	                    setTimeout(function() {

	                        // start typing each new char into existing string
	                        // curString is function arg
	                        self.el.text(self.text + curString.substr(0, curStrPos));

	                        // check if current character number is the string's length
	                        // and if the current array position is less than the stopping point
	                        // if so, backspace after backDelay setting
	                        if (curStrPos > curString.length && self.arrayPos < self.stopArray){
	                            clearTimeout(clear);
	                            self.options.onStringTyped();
	                            var clear = setTimeout(function(){
	                                self.backspace(curString, curStrPos);
	                            }, self.backDelay);
	                        }

	                        // else, keep typing
	                        else{
	                            // add characters one by one
	                            curStrPos++;
	                            // loop the function
	                            self.typewrite(curString, curStrPos);
	                            // if the array position is at the stopping position
	                            // finish code, on to next task
	                            if (self.loop === false){
	                                if (self.arrayPos === self.stopArray && curStrPos === curString.length){
	                                    // animation that occurs on the last typed string
	                                    // fires callback function
	                                    var clear = self.options.callback();
	                                    clearTimeout(clear);
	                                }
	                            }
	                        }

	                    // end of character pause
	                    }, charPause);
	                }
	                // if the array position is greater than array length
	                // and looping is active, reset array pos and start over.
	                else if (self.loop === true && self.loopCount === false){
	                    self.arrayPos = 0;
	                    self.init();
	                }
	                    else if(self.loopCount !== false && self.curLoop < self.loopCount){
	                        self.arrayPos = 0;
	                        self.curLoop = self.curLoop+1;
	                        self.init();
	                    }

	            // humanized value for typing
	            }, humanize);

	        }

	        , backspace: function(curString, curStrPos){

	            // varying values for setTimeout during typing
	            // can't be global since number changes each time loop is executed
	            var humanize = Math.round(Math.random() * (100 - 30)) + this.backSpeed;
	            var self = this;

	            setTimeout(function() {

	                // ----- this part is optional ----- //
	                // check string array position
	                // on the first string, only delete one word
	                // the stopNum actually represents the amount of chars to
	                // keep in the current string. In my case it's 14.
	                // if (self.arrayPos == 1){
	                //  self.stopNum = 14;
	                // }
	                //every other time, delete the whole typed string
	                // else{
	                //  self.stopNum = 0;
	                // }

	                // ----- continue important stuff ----- //
	                // replace text with current text + typed characters
	                self.el.text(self.text + curString.substr(0, curStrPos));

	                // if the number (id of character in current string) is
	                // less than the stop number, keep going
	                if (curStrPos > self.stopNum){
	                    // subtract characters one by one
	                    curStrPos--;
	                    // loop the function
	                    self.backspace(curString, curStrPos);
	                }
	                // if the stop number has been reached, increase
	                // array position to next string
	                else if (curStrPos <= self.stopNum){
	                    clearTimeout(clear);
	                    var clear = self.arrayPos = self.arrayPos+1;
	                    // must pass new array position in this instance
	                    // instead of using global arrayPos
	                    self.typewrite(self.strings[self.arrayPos], curStrPos);
	                }

	            // humanized value for typing
	            }, humanize);

	        }

	    }

	  $.fn.typed = function (option) {
	    return this.each(function () {
	      var $this = $(this)
	        , data = $this.data('typed')
	        , options = typeof option == 'object' && option
	      if (!data) $this.data('typed', (data = new Typed(this, options)))
	      if (typeof option == 'string') data[option]()
	    });
	  }

	  $.fn.typed.defaults = {
	    strings: ["Criterios de Calidad"],
	    // typing speed
	    typeSpeed: 30,
	    // time before typing starts
	    startDelay: 0,
	    // backspacing speed
	    backSpeed: 0,
	    // time before backspacing
	    backDelay: 500,
	    // loop
	    loop: false,
	    // false = infinite
	    loopCount: false,
	    // ending callback function
	    callback: function(){ null },
	    //callback for every typed string
	    onStringTyped: function(){ null }
	  }


	}(window.jQuery);

// Navigation (Juani)

	$(document).ready(function() {
		var navItems = $("#navigation ul li").length;
		var winWidth = $(window).width();
		var offset = 0;
		var goTo = 0;

    $('.intro').addClass('start-animation');

    $('#intro-title span').typed();

    // Skip intro button
	var skipIntro = false;
	$('#skip-intro').bind('click touchstart', function(event) {
		event.preventDefault();
		$('html, body').stop().animate({
	        'scrollTop': $("#nosotros").offset().top
		}, 500);

		skipIntro = true;
	});

	// Block Scroll
	$(window).scroll(function(){
		if (skipIntro == false) {
			$(this).scrollTop(0);
		}
	});

	// On mobile enable scroll (width < 690px)
	if ($(".intro").css("display") == "none" ){
		skipIntro = true;
	}
	
	$(window).resize(function(){	
		if ($(".intro").css("display") == "none" ){
			skipIntro = true;
		}
	});

	// Enable scroll when animation ends
	setTimeout(function() {
		skipIntro = true;
	}, 6100);

    // $("#skip-intro").on("click", function(){
    //   $('html, body').stop().animate({
    //     'scrollTop': $("#nosotros").offset().top
    //   }, 500);
    //   return false;
    // });

	$(window).scroll(function() {
		offset = $(document).scrollTop();
	});

	$("#toggle-nav").on("click", function() {
		if ($(this).hasClass("active")) {
			$("#navigation ul li").removeClass("slideInLeft").addClass("slideOutLeft");
			/*if (winWidth <= 800) { $("#navigation").css({"position": "fixed"}); }*/
			$("#content").show();
			$('html, body').stop().animate({
		        'scrollTop': goTo
		    }, 100);
			setTimeout(function(){
				$("body").toggleClass("nav-open");
			}, navItems*150);
		} else {
			$("#navigation ul li").removeClass("slideOutLeft").addClass("slideInLeft");
			$("body").toggleClass("nav-open");
			goTo = offset;

			setTimeout(function(){
				$("#content").hide();
				if (winWidth <= 800) { 
					/*$("#navigation").css({"position": "static"}); */
					$('html, body').stop().animate({
				        'scrollTop': 0
				    }, 100);
				}
			}, navItems*150);
		}

		$(this).toggleClass("active");
		return false;
	});

	$('#navigation ul li a').on('click',function (e) {
	    e.preventDefault();

	    var target = this.hash,
	    $target = $(target);

	    $("#navigation ul li").removeClass("slideInLeft").addClass("slideOutLeft");
		$("#content").show();

		$('html, body').stop().animate({
	        'scrollTop': goTo
	    }, 100);

	    setTimeout(function(){
			$("body").removeClass("nav-open");
			$("#toggle-nav").removeClass("active");
			$('html, body').stop().animate({
		        'scrollTop': $target.offset().top+2
		    }, 1000);
		}, navItems*150);
  });
});