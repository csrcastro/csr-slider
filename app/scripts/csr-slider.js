/*global clearTimeout, clearInterval */
(function(w, d) {
    "use strict";
    var v = w.getComputedStyle && (function() {
            var s = w.getComputedStyle(d.documentElement, ''),
                pre = ([].slice.call(s).join('').match(/-(moz|webkit|ms)-/) || (s.OLink === '' && ['', 'o']))[1];
            return ['-' + pre + '-', ''];
        }()) || [''],
        lastTime = 0,
        x = 0,
        vL = v.length,
        xl = vL - 1;
    for (null; x < xl && !w.requestAnimationFrame; x += 1) {
        w.requestAnimationFrame = w[v[x] + 'RequestAnimationFrame'];
        w.cancelAnimationFrame = w[v[x] + 'CancelAnimationFrame'] || w[v[x] + 'CancelRequestAnimationFrame'];
    }
    if (!w.requestAnimationFrame) {
        /**
         * requestAnimationFrame fallback for non supporting browsers 
         * @param  {Function} cb Callback to be fired at each interval
         * @return {Number}     Interval ID
         */
        w.requestAnimationFrame = function(cb) {
            /**
             * Current Time
             * @type {Date}
             */
            var c = new Date().getTime(),
                /**
                 * Last time
                 * @type {Number}
                 */
                l = 0,
                /**
                 * Interval until next call 
                 * @type {Number}
                 */
                n = Math.max(0, 16 - (c - l)),
                /**
                 * Interval ID
                 * @type {Number}
                 */
                id = w.setTimeout(function() {
                    cb(c + n);
                }, n);

            l = c + n;

            return id;
        };

    }
    if (!w.cancelAnimationFrame) {

        w.cancelAnimationFrame = function(id) {

            clearTimeout(id);

        };
    }
    /**
     * [requestInterval description]

     * @param  {Function} fn    [description]
     * @param  {[type]}   delay [description]
     * @return {[type]}         [description]
     */
    w.requestInterval = function reqInt(fn, delay) {

        var getNow = Date.now || function() {
                return new Date().getTime();
            },
            start = getNow(),
            handle = {};

        function loop() {

            if (getNow() - start < delay) {

                handle.value = w.requestAnimationFrame(loop);
                return;
            }

            fn.call();
            start = getNow();
            handle.value = w.requestAnimationFrame(loop);
            return;
        }
        handle.value = w.requestAnimationFrame(loop);
        return handle;
    };
    /**
     * [clearRequestInterval description]
     * @param  {Object} h requestAnimationFrame request object
     * @return {[type]}        [description]
     */
    w.clearRequestInterval = function(h) {
        w.cancelAnimationFrame(h.value) || clearInterval(h);
        return;
    };
    /**
     * String.trim() polyfill for IE8 using the replace method
     *
     * @return {String}
     */
    !''.trim && (function() {
        String.prototype.trim = function() {
            return this.replace(/^\s+|\s+$/g, '');
        };
    }());
    /**
     * Construct a new Slider instance, passing an optional configuration object.
     * @param {String} selector [description]
     * @param {Object} opt      [description]
     */
    var CsrSlider = function CsrSlider(selector, opt) {
            !selector && (function() {
                throw new Error('CsrSlider says: selector missing, eg: new Slider(".selector")');
            }());
            var t = this;
            /**
             * Current Index
             * @type {Number}
             */
            t.ci = 0;
            /**
             * Last Index
             * @type {Number}
             */
            t.li = 0;
            /**
             * Selector Class
             * @type {String}
             */
            t.sCl = selector.substring(1, selector.length);
            /**
             * [s description]
             * @type {[type]}
             */
            t.s = d.querySelector(selector);
            /**
             * Slider default options Object
             * @type {Object}
             */
            t.o = {
                iCl: ' ___',
                aCl: ' _-_',
                niCl: ' _-___',
                noCl: ' _-__',
                piCl: ' ___-_',
                poCl: ' __-_',
                previousButtonClass: t.sCl + '-p',
                nextButtonClass: t.sCl + '-n',
                interval: 5000,
                animation: 'horizontal',
                animationSpeed: 618,
                animationEasing: 'linear',
                animationDirection: 1,
                carousel: false,
                navigation: false,
                first: 0,
                pagination: true,
                ratio: '2:1',
                /**
                 * Function triggerd after each animation is fired in the context of the pane
                 * @param  {Number} i Index corresponding to the triggered pane
                 * @return {undefined}
                 */
                transitionCallback: 0,
                /**
                 * Function triggerd after clicking one of the pagination buttons in the contect of the button
                 * @param  {Number} i Index corresponding to the triggered pane
                 * @param  {Array} a Array of all pagination buttons
                 * @return {undefined}
                 */
                paginationCallback: null,
                touch: false,
                loop: false,
                animations: {
                    prevOut: {
                        '0%': {
                            transform: {
                                translate3d: ['0', '0', '0']
                            },
                            opacity: 1,
                            'transform-origin': ['50%', '50%', '0']
                        },
                        '100%': {
                            transform: {
                                translate3d: ['100%', '0', '0']
                            },
                            opacity: 1,
                            'transform-origin': ['50%', '50%', '0']
                        }
                    },
                    prevIn: {
                        '0%': {
                            transform: {
                                translate3d: ['-100%', '0', '0']
                            },
                            opacity: 1,
                            'transform-origin': ['50%', '50%', '0']
                        },
                        '100%': {
                            transform: {
                                translate3d: ['0', '0', '0']
                            },
                            opacity: 1,
                            'transform-origin': ['50%', '50%', '0']
                        }
                    },
                    nextOut: {
                        '0%': {
                            transform: {
                                translate3d: ['0', '0', '0']
                            },
                            opacity: 1,
                            'transform-origin': ['50%', '50%', '0']
                        },
                        '100%': {
                            transform: {
                                translate3d: ['-100%', '0', '0']
                            },
                            opacity: 1,
                            'transform-origin': ['50%', '50%', '0']
                        }
                    },
                    nextIn: {
                        '0%': {
                            transform: {
                                translate3d: ['100%', '0', '0']
                            },
                            opacity: 1,
                            'transform-origin': ['50%', '50%', '0']
                        },
                        '100%': {
                            transform: {
                                translate3d: ['0', '0', '0']
                            },
                            opacity: 1,
                            'transform-origin': ['50%', '50%', '0']
                        }
                    }
                },
                transition: {
                    /**
                     * Trandform translates are not supported  <IE10
                     * @type {Object}
                     */
                    active: {
                        transform: {
                            scale: 1
                        },
                        opacity: 1
                            //'transform-origin': ['50%', '50%']
                    },
                    prevOut: {
                        transform: {
                            scale: 1.6
                        }
                        //'transform-origin': ['50%', '50%']
                    },
                    prevIn: {
                        transform: {
                            scale: 1.6
                        },
                        opacity: 0
                            // 'transform-origin': ['50%', '50%']
                    },
                    nextOut: {
                        transform: {
                            scale: 1.6
                        }
                        // 'transform-origin': ['50%', '50%']
                    },
                    nextIn: {
                        transform: {
                            scale: 1.6
                        },
                        opacity: 0
                            // 'transform-origin': ['50%', '50%']
                    }
                },
                cssanimation: opt.cssanimation || (function(d) {
                    var animation = false,
                        animationstring = 'animation',
                        keyframeprefix = '',
                        domPrefixes = ['Webkit', 'Moz', 'O', 'ms', 'Khtml'],
                        pfx = '',
                        elm = d.createElement('fake'),
                        i;


                    if (elm.style.animationName !== undefined) {
                        animation = true;
                    }


                    if (animation === false) {
                        for (i = 0; i < domPrefixes.length; i += 1) {
                            if (elm.style[domPrefixes[i] + 'AnimationName'] !== undefined) {
                                pfx = domPrefixes[i];
                                animationstring = pfx + 'Animation';
                                keyframeprefix = '-' + pfx.toLowerCase() + '-';
                                animation = true;
                                break;
                            }
                        }
                    }
                    return animation;
                }(d))
            };
            /**
             * Slider options Object after being extended with provided options
             * @type {Object}
             */
            t.o = t.x(opt, t.o);
            /**
             * Slider items array
             * @type {Array}
             */
            t.iArr = t.getChildren(t.s);
            /**
             * Slider items array length
             * @type {Number}
             */
            t.iArrL = t.iArr.length;
            t.buttonPrevious = t.s.querySelector('.' + t.o.previousButtonClass);
            t.buttonNext = t.s.querySelector('.' + t.o.nextButtonClass);
            /**
             * Global Events Object
             * @type {Object}
             */
            t.e = {};
            t.e[''] = function() {
                // alert('this element has no id');
            };
            t.e[this.sCl + '-previous'] = function() {
                t.onPreviousButtonClicked(true);
                t.o.loop && t.restartCarousel();
                return;
            };
            t.e[this.sCl + '-next'] = function() {
                t.onNextButtonClicked(1);
                t.o.loop && t.restartCarousel();
                return;
            };
            t.addEvL('mousedown', t.e);
            t.init();
        },
        p = CsrSlider.prototype;
    p.initialized = 0;
    /**
     * Initialization method
     * @return {undefined} [description]
     */
    p.init = function() {
        var t = this,
            i;
        for (i = 0; i < t.iArrL; i += 1) {
            (function(i) {
                i === t.o.first ? (t.iArr[i].className += (t.o.iCl + t.o.aCl)) : (t.iArr[i].className += t.o.iCl);
            }(i));
        }

        if (!t.initialized) {

            t.goTo();
            t.initialized = false;

        }

        if (t.o.pagination) {

            t.addPagination();

        }

        t.initCss();

        if (t.o.cssanimation) {

            t.initKeyframes(t.o.animation);

        }

        t.initTransition();

        if (t.o.touch) {

            t.touch();

        }

        if (t.o.carousel) {

            t.startCarousel();

        }

        if (t.o.navigation) {

            t.addNav();

        }

        return;
    };
    /**
     * Simple extend method that allows us to overide our modules default configuration
     * @param  {object} extension Object containing the properties to be replaced or added in the original object
     * @param  {object} obj       Original object to be extended
     * @return {object}           Resulting object
     */
    p.x = function(e, o) {
        var a;

        for (a in e) {
            o[a] = e[a];
        }
        return o;
    };
    /**
     * Method to retrieve all of a nodes children without traversing the DOM
     * @param  {[type]} e Parent Node
     * @return {Array}   Array of children
     */
    p.getChildren = function(e) {
        var i,
            n = e.childNodes,
            r = [];
        for (i = 0; i < n.length; i++) {
            n[i].nodeType === 1 && (r.push(n[i]));
        }
        return r;
    };
    /**
     * Simple method that allows adding a class to an elemen
     * @param {HTMLElement} el element where you want the class to be added
     * @param {string} cl class name to be added
     * @return {undefined}  always returns undefined
     */
    p.aC = function(el, cl) {
        el && (el.className += ' ' + cl);
        return;
    };
    /**
     * Simple method that allows removing a class from an element if it exists
     * @param {HTMLElement} el element where you want the class to be removed
     * @param {string} cl class name to be removed
     * @return {undefined}  always returns undefined
     */
    p.rC = function(el, cl) {
        el && (el.className = el.className.replace(' ' + cl, ''));
        return;
    };
    /**
     *
     */
    p.addEvL = function() {
        if (document.addEventListener) {
            /**
             * add Standard Event listener for modern browsers
             * @param  {String} eN Event Name
             * @param  {Object} eO Events Object
             * @return {Function}    Native addEventListener
             */
            return function(eN, eO) {
                var t = this;
                return d.addEventListener(eN, function(e) {
                    if (e.button > 0) {
                        return;
                    }
                    e.target.getAttribute('data-' + t.sCl + '-ev') && eO[e.target.getAttribute('data-' + t.sCl + '-ev')]();
                    return;
                }, false);
            }
        } else {
            /**
             * add IE Event Listener for IE8
             * @param  {String} eN Event Name
             * @param  {Object} eO Events Object
             * @return {Function}    Native attachEvent
             */
            return function(eN, eO) {
                var t = this;
                return d.attachEvent('on' + eN, function(e) {
                    if (e.button > 0) {
                        return;
                    }
                    e.srcElement.getAttribute('data-' + t.sCl + '-ev') && eO[e.srcElement.getAttribute('data-' + t.sCl + '-ev')].call(this.s, eO, e.srcElement.id);
                    return;
                });
            }
        }
    }();
    /**
     * Method reponsible for initializing the touch event
     * @return {undefined}
     */
    p.touch = function() {
        var t = this;
        /**
         * Touch Events Object
         * @type {Object}
         */
        t.tEv = {
            START: 'touchstart',
            MOVE: 'touchmove',
            END: 'touchend'
        };
        /**
         * Pointer Type
         * @type {String}
         */
        t.pT = 'touch';
        /**
         * Touch Start
         * @type {Object}
         */
        t.st = {};
        /**
         * Touch Delta
         * @type {Object}
         */
        t.d = {};
        /**
         * Touch Fired
         * @type {Boolean}
         */
        t.tF = false;
        w.navigator.pointerEnabled && (t.tEv.START = "pointerdown", t.tEv.MOVE = "pointermove", t.tEv.END = "pointerup");
        w.navigator.msPointerEnabled && (t.tEv.START = "MSPointerDown", t.tEv.MOVE = "MSPointerMove", t.tEv.END = "MSPointerUp", t.pT = 2);
        /**
         * Touch Handler
         * @type {Object}
         */
        t.th = {
            hE: function(e) {
                switch (e.type) {
                    case t.tEv.START:
                        t.th.s(e);
                        break;
                    case t.tEv.MOVE:
                        t.th.m(e);
                        break;
                    case t.tEv.END:
                        t.th.e(e);
                        break;
                }
            },
            s: function(e) {
                t.st = {
                    x: e.touches[0].pageX,
                    y: e.touches[0].pageY,
                    t: +new Date
                }
                t.iS = false;
                t.d = {};
                t.s.addEventListener(t.tEv.MOVE, t.th.hE, false);
                t.s.addEventListener(t.tEv.END, t.th.hE, false);
                return;
            },
            m: function(e) {
                var d = +new Date - t.st.t;
                t.s.removeEventListener(t.tEv.MOVE, t.th.hE, false);
                if (e.touches.length > 1 || e.scale && e.scale !== 1) return;
                t.d = {
                    x: e.touches[0].pageX - t.st.x,
                    y: e.touches[0].pageY - t.st.y
                };
                !t.iS && (t.iS = !!(t.iS || Math.abs(t.d.x) < Math.abs(t.d.y)));
                if (t.iS || Number(d) === 0) return;
                e.preventDefault();
                t.d.x < 0 ? (t.onNextButtonClicked()) : (t.onPreviousButtonClicked());
                return;
            },
            e: function(e) {
                t.s.removeEventListener(t.tEv.END, t.th.hE, false);
                return;
            }
        };
        t.s.addEventListener(t.tEv.START, t.th.hE, false);
        return;
    };
    p.debounce = function(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this,
                args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };
    /**
     * Method to find an array key by matching all the values in the array
     * @param  {Array} a Array where
     * @param  {[type]} v Value to be matched
     * @return {Number}   Matched key
     */
    p.findInArray = function(a, v) {
        var k = 0,
            l = a.length;
        for (; k < l; k++) {
            if (a[k] === v) return k;
        }
        return;
    };
    p.onNextButtonClicked = function() {
        switch (this.ci) {
            case this.iArrL - 1:
                this.goTo(0, !0);
                break;
            default:
                this.goTo(this.ci + 1, !0);
                break;
        }
        return;
    };
    p.onPreviousButtonClicked = function() {
        switch (this.ci) {
            case 0:
                this.goTo(this.iArrL - 1, 0);
                break;
            default:
                this.goTo(this.ci - 1, 0)
                break;
        }
        return;
    };
    p.goTo = function(i, d) {
        var t = this,
            u = undefined;
        if (t.o.cssanimation) {
            t.goTo = t.debounce(function(i, d) {
                t.iArr[t.ci].className = t.iArr[t.ci].className.replace(t.o.piCl, '').replace(t.o.niCl, '').replace(t.o.aCl, '');
                t.iArr[t.li].className = t.iArr[t.li].className.replace(t.o.poCl, '').replace(t.o.noCl, '');
                t.iArr[i].className += d && t.o.niCl || t.o.piCl;
                t.iArr[i].className += t.o.aCl;
                t.iArr[t.ci].className += d && t.o.noCl || t.o.poCl;
                t.li = t.ci;
                t.ci = i;
                setTimeout(function() {
                    typeof t.o.transitionCallback === 'function' && t.o.transitionCallback.call(t.iArr[i], i);
                }, 32);
                return u;
            }, t.o.animationSpeed, 1);
        } else {
            t.goTo = t.debounce(function(i, d) {
                t.iArr[t.ci].className = t.iArr[t.ci].className.replace(t.o.aCl, '').replace(t.o.piCl, '').replace(t.o.niCl, '');
                t.iArr[t.li].className = t.iArr[t.li].className.replace(t.o.poCl, '').replace(t.o.noCl, '');
                d && (t.iArr[i].className += t.o.niCl) || (t.iArr[i].className += t.o.piCl);

                setTimeout(function() {
                    t.iArr[i].className += t.o.aCl;
                    t.iArr[i].className = d && (t.iArr[i].className.replace(t.o.niCl, '')) || (t.iArr[i].className.replace(t.o.piCl, ''));
                    d && (t.iArr[t.ci].className += t.o.noCl) || (t.iArr[t.ci].className += t.o.poCl);
                    t.li = t.ci;
                    t.ci = i;
                }, 0);

                setTimeout(function() {
                    typeof t.o.transitionCallback === 'function' && t.o.transitionCallback.call(t.iArr[i], i);
                }, 32);
                return u;
            }, t.o.animationSpeed, 1);
        }
        return u;
    };
    p.addNav = function() {
        var t = this,
            p = d.createElement('button'),
            n = d.createElement('button'),
            s = '.';
        s += t.sCl;
        s += ' .nav{position: absolute; z-index:12345; top: 50%;} .';
        s += t.sCl;
        s += ' .next{right: 1%} .';
        s += t.sCl;
        s += ' .previous{left: 1%}';
        t.addCss(s);
        p.className = 'nav previous';
        n.className = 'nav next';
        p.setAttribute('data-' + t.sCl + '-ev', t.sCl + '-previous');
        n.setAttribute('data-' + t.sCl + '-ev', t.sCl + '-next');
        p.innerHTML = 'previous';
        n.innerHTML = 'next';
        t.s.appendChild(p);
        t.s.appendChild(n);
        return;
    };
    p.addPagination = function() {
        var t = this,
            p = d.createElement('div'),
            f = d.createDocumentFragment(),
            s = '.',
            build = function(i) {
                var b = d.createElement("button");
                b.setAttribute('data-' + t.sCl + '-ev', t.sCl + '-pagination' + '-' + i);
                f.appendChild(b);
                t.e[t.sCl + '-pagination' + '-' + i] = function() {
                    i !== t.ci && (t.goTo(i, (i > t.ci)), t.o.loop && t.restartCarousel());
                    t.o.paginationCallback && t.o.paginationCallback.call(b, i, t.getChildren(p));
                    return;
                };
            };
        p.className = 'pagination';
        for (var i = 0, l = t.iArr.length; i < l; i++) {
            build(i);
        }
        s += t.sCl;
        s += ' .pagination';
        s += '{bottom: 1%; left:0; position:absolute; text-align:center; width:100%; z-index: 12345;}';
        t.addCss(s);
        p.appendChild(f);
        t.s.appendChild(p);
        return;
    };
    p.startCarousel = function() {
        var t = this;
        t.o.loop = window.requestInterval(function() {
            t.goTo(t.iArrL - 1 === t.ci ? 0 : t.ci + 1, !0);
        }, t.o.interval);
        return;
    };
    p.restartCarousel = function() {
        w.clearRequestInterval(this.o.loop);
        this.startCarousel();
        return;
    };
    p.initCss = function() {
        var css = '.',
            ratio = this.o.ratio.split(':'),
            height = parseInt(ratio[1]) * 100 / parseInt(ratio[0]),
            i = 0;
        css += this.sCl;
        css += '{overflow:hidden;padding-bottom:';
        css += height;
        css += '%;'
        for (; i < vL; i++) {
            css += v[i];
            css += 'transform:translateZ(0);'
        }
        css += 'position:relative;width:100%;}';
        // css += '.';
        // css += this.sCl;
        // css += ' .';
        // css += this.o.iCl.trim();
        // css += '{position: absolute;top: 0;left: 0; width: 100%;}';
        this.addCss(css);
    }
    p.initTransition = function() {
        var t = this,
            css = '.',
            arr = [
                ['active', t.o.aCl.trim()],
                ['nextOut', t.o.noCl.trim()],
                ['prevOut', t.o.poCl.trim()],
                ['nextIn', t.o.niCl.trim()],
                ['prevIn', t.o.piCl.trim()]
            ];
        css += t.sCl;
        css += ' .';
        css += t.o.iCl.trim();
        css += '{';
        t.o.cssanimation && (css += t.addCssOpacity(0));
        css += 'height:100%;position:absolute;top:0;left:0;width:100%;}';
        /**
         * Active Item Styles
         */
        css += '.'
        css += t.sCl;
        css += ' .';
        css += t.o.aCl.trim();
        css += '{';
        css += t.addCssOpacity(1);
        css += 'z-index:123;}';
        !t.o.cssanimation && (css += function() {
            var css = '';
            /**
             * Active Item Styles
             */
            css += '.'
            css += t.sCl;
            css += ' .';
            css += t.o.poCl.trim();
            css += '{';
            css += 'z-index:12;}';
            css += '.'
            css += t.sCl;
            css += ' .';
            css += t.o.noCl.trim();
            css += '{';
            css += 'z-index:12;}';
            return css;
        }());
        /**
         * [for description]
         * @param  {Number} var arri          [description]
         * @param  {[type]} l   [description]
         * @return {[type]}     [description]
         */
        for (var arri = 0, l = arr.length; arri < l; arri++) {
            css += function(a, c, h) {
                var css = '',
                    pro = '';
                switch (h) {
                    case false:
                        css += '.';
                        css += t.sCl;
                        a.match('In') && (css += ' .');
                        a.match('In') && (css += t.o.iCl.trim());
                        css += a.match('In') && '.' || ' .';
                        css += c;
                        css += '{';
                        for (var c in t.o.transition[a]) {
                            /**
                             * [description]
                             * @param  {[type]} p [description]
                             * @param  {[type]} n [description]
                             * @return {[type]}   [description]
                             */
                            css += function(p, n) {
                                css = '';
                                switch ({}.toString.call(p)) {
                                    case '[object Object]':
                                        for (var m = 0; m < vL; m++) {
                                            /**
                                             * [description]
                                             * @param  {[type]} v value
                                             * @return {string}   [description]
                                             */
                                            css += function(v) {
                                                var s = '';
                                                s += v;
                                                s += n;
                                                s += ':';
                                                for (var prpNm in p) {
                                                    /**
                                                     * [description]
                                                     * @param  {[type]} v value
                                                     * @param  {string} n name
                                                     * @return {string}
                                                     */
                                                    s += function(v, n) {
                                                        var s = '';
                                                        switch ({}.toString.call(v)) {
                                                            case '[object Array]':
                                                                s += n;
                                                                s += '(';
                                                                for (var i = 0, val = v.length; i < val; i++) {
                                                                    /**
                                                                     * [description]
                                                                     * @param  {[type]} v [description]
                                                                     * @return {[type]}   [description]
                                                                     */
                                                                    s += function(v) {
                                                                        return v += ',';
                                                                    }(v[i]);
                                                                    // console.log(s)
                                                                }
                                                                s = s.substring(s.length - 1, 0);
                                                                s += ') ';
                                                                break;
                                                            case '[object Object]':
                                                                alert('message', v);
                                                                break
                                                            default:
                                                                s += n;
                                                                s += '(';
                                                                s += v;
                                                                s += ') ';
                                                                break
                                                        }
                                                        return s;
                                                    }(p[prpNm], prpNm);

                                                    // console.log(s)
                                                }
                                                s = s.substring(s.length - 1, 0);
                                                return s;
                                            }(v[m]);
                                            css += ';';
                                        }
                                        break;
                                    case '[object Array]':
                                        for (var m = 0; m < vL; m++) {
                                            /**
                                             * [description]
                                             * @param  {[type]} v [description]
                                             * @return {[type]}   [description]
                                             */
                                            css += function(v) {
                                                var s = '';
                                                s += v;
                                                s += n;
                                                s += ':('
                                                for (var ap = 0, al = p.length; ap < al; ap++) {
                                                    s += function(value) {
                                                        return value += ',';
                                                    }(p[ap]);
                                                }
                                                s = s.substring(s.length - 1, 0);
                                                // console.log(s)
                                                return s;
                                            }(v[m]);
                                            css += ');';
                                        }
                                        break;
                                    default:
                                        css += t.addCssOpacity(p);
                                        break;
                                }
                                /**
                                 * [description]
                                 * @param  {[type]} e [description]
                                 * @return {[type]}   [description]
                                 */
                                pro += function(e) {
                                    var s = ' '
                                    s += e;
                                    s += ',';
                                    return s;
                                }(c)
                                return css
                            }(t.o.transition[a][c], c, t.o.cssanimation)
                        };
                        !a.match('In') && (css += t.addCssTransition(pro = pro.substring(pro.length - 1, 0), t.o.animationSpeed + 'ms', t.o.animationEasing += '', '0'));
                        css += '}';
                        // console.log(css);
                        break;
                    default:
                        if (!t.o.animations[a]) break;
                        css += '.';
                        css += t.sCl;
                        css += ' .';
                        css += c;
                        css += '{';
                        css += t.addCssAnimation(a, t.o.animationSpeed + 'ms', t.o.animationEasing += '', '0', '1', 'normal', 'both', 'running');
                        css += '}';
                        break;
                }
                return css;
            }(arr[arri][0], arr[arri][1], t.o.cssanimation);
        }
        this.addCss(css);
    }
    p.initKeyframes = function(animation) {
        var t = this,
            i = 0,
            css = '',
            arr = [
                ['active', t.o.aCl.trim()],
                ['nextIn', t.o.niCl.trim()],
                ['nextOut', t.o.noCl.trim()],
                ['prevIn', t.o.piCl.trim()],
                ['prevOut', t.o.poCl.trim()]
            ];
        for (var a = 0, l = arr.length; a < l; a++) {
            css += function(f) {
                if (!f) return '';
                var animationString = '';
                for (var b = 0; b < vL; b++) {
                    animationString += (function(animation) {
                        var vendorString = '@';
                        vendorString += v[b];
                        vendorString += 'keyframes ';
                        vendorString += arr[a][0];
                        vendorString += ' { ';
                        for (var frame in animation) {
                            vendorString += function(frame, frameName) {
                                var animString = '';
                                animString += frameName;
                                animString += ' {';
                                for (var prop in frame) {
                                    animString += function(property, propertyname) {
                                        var venPropString = '';
                                        switch ({}.toString.call(property)) {
                                            case '[object Object]':
                                                for (var m = 0; m < vL; m++) {
                                                    /**
                                                     * Vendor prefixed CSS transform string builder
                                                     * @param  {[type]} vendor [description]
                                                     * @return {[type]}        Return a vendor prefixed transform string ex: -webkit-transform:translate3d(0,0,0)
                                                     */
                                                    venPropString += function(vendor) {
                                                        /**
                                                         *  Vendor prefixed CSS property string intialization to an empty string
                                                         * @type {String}
                                                         */
                                                        var s = '';
                                                        s += vendor;
                                                        s += propertyname;
                                                        s += ':';
                                                        for (var propertyName in property) {
                                                            /**
                                                             * CSS property string builder
                                                             * 
                                                             * @param  {[type]} v [description]
                                                             * @param  {string} n CSS property name
                                                             * @return {string}   Returns the property string ex: translate3d(100%,0,0)
                                                             */
                                                            s += function(v, n) {
                                                                /**
                                                                 * CSS property string initialization as literal empty string
                                                                 * @type {String}
                                                                 */
                                                                var s = '';

                                                                switch ({}.toString.call(v)) {
                                                                    case '[object Array]':
                                                                        s += n;
                                                                        s += '(';
                                                                        /**
                                                                         * [for description]
                                                                         * @param  {Number} var vaa           [description]
                                                                         * @param  {[type]} val [description]
                                                                         * @return {[type]}     [description]
                                                                         */
                                                                        for (var i = 0, l = v.length; i < l; ++i) {
                                                                            /**
                                                                             * 
                                                                             * @param  {String} v Value belonging to the CSS property
                                                                             * @return {String}   CSS values string with new value and comma added concatenated
                                                                             */
                                                                            s += function(v) {
                                                                                return v += ',';
                                                                            }(v[i]);
                                                                        }
                                                                        /**
                                                                         * Removing last comma resulting from adding in the property values 
                                                                         *
                                                                         */
                                                                        s = s.substring(s.length - 1, 0);
                                                                        s += ') ';
                                                                        break;
                                                                    case '[object Object]':
                                                                        alert('message', v);
                                                                        break
                                                                    default:
                                                                        s += n;
                                                                        s += '(';
                                                                        s += v;
                                                                        s += ') ';
                                                                        break
                                                                }
                                                                return s;
                                                            }(property[propertyName], propertyName);

                                                            // console.log(s)
                                                        }
                                                        s = s.substring(s.length - 1, 0);
                                                        return s;
                                                    }(v[m]);
                                                    venPropString += ';';
                                                }
                                                break;
                                            case '[object Array]':
                                                for (var m = 0; m < vL; m++) {
                                                    venPropString += function(vendor) {
                                                        var propString = '';
                                                        propString += vendor;
                                                        propString += propertyname;
                                                        propString += ':('
                                                        for (var ap = 0, al = property.length; ap < al; ap++) {
                                                            propString += function(value) {
                                                                return value += ',';
                                                            }(property[ap]);
                                                        }
                                                        propString = propString.substring(propString.length - 1, 0);
                                                        return propString;
                                                    }(v[m]);
                                                    venPropString += ');';
                                                }
                                                break;
                                            default:
                                                venPropString += t.addCssOpacity(property);
                                                break;
                                        }
                                        return venPropString
                                    }(frame[prop], prop);
                                }
                                animString += '}'
                                return animString
                            }(animation[frame], frame);
                        };
                        vendorString += '}';
                        return vendorString;
                    }(t.o.animations[arr[a][0]]));
                };
                return animationString;
            }(t.o.animations[arr[a][0]]);
        };
        t.addCss(css);
    }
    p.addCssTransform = function(transform) {
        var i = 0,
            css = '';
        for (; i < vL; i++) {
            css += v[i];
            css += 'transform:';
            css += transform;
            css += '; ';
        }
        return css;
    };
    p.addCssOpacity = function(opacity) {
        return '-ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=' + opacity * 100 + ')"; opacity: ' + opacity + '; ';
    }
    p.addCssAnimation = function(name, duration, timingFunction, delay, iterationCount, direction, fillMode, playState) {
        var i = 0,
            css = '';
        for (; i < vL; i++) {
            css += v[i];
            css += 'animation-name: ';
            css += name;
            css += '; ';
            css += v[i];
            css += 'animation-duration: ';
            css += duration;
            css += '; ';
            css += v[i];
            css += 'animation-timing-function: ';
            css += timingFunction;
            css += '; ';
            css += v[i];
            css += 'animation-delay: ';
            css += delay;
            css += '; ';
            css += v[i];
            css += 'animation-iteration-count: ';
            css += iterationCount;
            css += '; ';
            css += v[i];
            css += 'animation-direction: ';
            css += direction;
            css += '; ';
            css += v[i];
            css += 'animation-fill-mode: ';
            css += fillMode;
            css += '; ';
            css += v[i];
            css += 'animation-play-state: ';
            css += playState;
            css += ';';
        }
        return css
    }
    p.addCssTransition = function(property, duration, easing, delay) {
        var css = '',
            i;
        for (i = 0; i < vL; i += 1) {
            css += v[i];
            css += 'transition-property:';
            css += property;
            css += ';';
            css += v[i];
            css += 'transition-duration:';
            css += duration;
            css += ';';
            css += v[i];
            css += 'transition-timing-function:';
            css += easing;
            css += ';';
            css += v[i];
            css += 'transition-delay:';
            css += delay;
            css += ';';
        }
        return css
    };
    p.addCss = function(s) {
        var sE = d.createElement("style");
        sE.type = "text/css";
        if (sE.styleSheet) {
            sE.styleSheet.cssText = s;
        } else {
            sE.appendChild(d.createTextNode(s));
        }
        d.getElementsByTagName("head")[0].appendChild(sE);
    }
    w.CsrSlider = CsrSlider;
}(window, document));


var vertical= {
        prevOut: {
            '0%': {
                transform: {
                    translate3d: ['0', '0', '0']
                },
                opacity: 1,
                'transform-origin': ['50%', '50%', '0']
            },
            '100%': {
                transform: {
                    translate3d: ['0', '-100%', '0']
                },
                opacity: 1,
                'transform-origin': ['50%', '50%', '0']
            }
        },
        prevIn: {
            '0%': {
                transform: {
                    translate3d: ['0', '100%', '0']
                },
                opacity: 1,
                'transform-origin': ['50%', '50%', '0']
            },
            '100%': {
                transform: {
                    translate3d: ['0', '0', '0']
                },
                opacity: 1,
                'transform-origin': ['50%', '50%', '0']
            }
        },
        nextOut: {
            '0%': {
                transform: {
                    translate3d: ['0', '0', '0']
                },
                opacity: 1,
                'transform-origin': ['50%', '50%', '0']
            },
            '100%': {
                transform: {
                    translate3d: ['0', '100%', '0']
                },
                opacity: 1,
                'transform-origin': ['50%', '50%', '0']
            }
        },
        nextIn: {
            '0%': {
                transform: {
                    translate3d: ['0', '-100%', '0']
                },
                opacity: 1,
                'transform-origin': ['50%', '50%', '0']
            },
            '100%': {
                transform: {
                    translate3d: ['0', '0', '0']
                },
                opacity: 1,
                'transform-origin': ['50%', '50%', '0']
            }
        }
    };
var lol = new CsrSlider('.js-csr-slider', {
    carousel: true,
    loop: true,
    interval: 5000,
    navigation: true,
    modernizr: window.Modernizr,
    touch: false,
    animations: vertical,
    animationDirection: 1,
    transitionCallback: function(i, id) {
        //console.log('fired')
    }
});