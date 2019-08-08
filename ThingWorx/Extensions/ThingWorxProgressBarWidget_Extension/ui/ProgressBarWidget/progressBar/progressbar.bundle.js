var ProgressBar =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by avaleanu on 06.01.2017.
	 */
	module.exports = {

	    Line: __webpack_require__(1),
	    Circle: __webpack_require__(3),
	    SemiCircle: __webpack_require__(4),
	    Utils: __webpack_require__(2)
	};



/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by avaleanu on 06.01.2017.
	 */

	var Utils = __webpack_require__(2);

	var Line = {
	    init:function Line(container, opts) {

	        this.pathTemplate = 'M 0,{center} L 100,{center}';
	        this.svgView = this.createSvgElement(opts);

	        this.container = container;
	        this.container.appendChild(this.svgView.svg);


	        this.opts = opts;

	        this.svg = this.svgView.svg;
	        this.path = this.svgView.path;
	        this.trail = this.svgView.trail;

	        if(opts.maxValue){
	            this.maxValue = opts.maxValue;
	        }

	        //this.path.style.transition = this.opts.transitionDuration +"s all ease-in-out";
	        //this.setText('');
	        return this;
	    }
	};

	Line.createSvgElement = function createSvgElement(opts) {
	    var svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
	    this.initializeSvg(svg, opts);

	    var trailPath = null;
	    if (opts.trailColor || opts.trailWidth) {
	        trailPath = this.createTrail(opts);
	        svg.appendChild(trailPath);
	    }

	    var path = this.createPath(opts);
	    svg.appendChild(path);

	    return {
	        svg: svg,
	        path: path,
	        trail: trailPath
	    }

	};

	Line.initializeSvg = function initializeSvg(svg, opts) {
	    svg.setAttribute('viewBox','0 0 100 ' + opts.strokeWidth);
	    svg.setAttribute('preserveAspectRatio', 'none');
	    svg.style.position = 'relative';
	    svg.style.width = '100%';
	    svg.style.left = '0';
	    svg.style.display = 'inline-block';
	};

	Line.createPath = function createPath(opts) {
	    var pathString = Utils.render(this.pathTemplate, {
	        center: opts.strokeWidth / 2
	    });

	    return this.createPathElement(pathString, opts);


	};

	Line.createPathElement = function createPathElement(pathString, opts){
	    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	    path.setAttribute('d', pathString);
	    path.setAttribute('stroke', opts.color);
	    path.setAttribute('stroke-width', opts.strokeWidth);

	    if (opts.fill) {
	        path.setAttribute('fill', opts.fill);
	    } else {
	        path.setAttribute('fill-opacity', '0');
	    }

	    return path;
	};

	Line.createTrail = function createTrail(opts) {

	    var pathString = Utils.render(this.pathTemplate, {
	        center: opts.strokeWidth / 2
	    });

	    var trail = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	    trail.setAttribute('d', pathString);
	    trail.setAttribute('stroke', opts.trailColor);
	    trail.setAttribute('stroke-width', opts.trailWidth);
	    if (opts.fill) {
	        trail.setAttribute('fill', opts.fill);
	    } else {
	        trail.setAttribute('fill-opacity', '0');
	    }

	    return trail;

	};

	Line.setValue = function setValue(value) {
	    var len = this.path.getTotalLength();

	    var offset = (this.opts.maxValue-value)/this.opts.maxValue * len;

	    this.path.style.strokeDasharray = len + ' ' + len;
	    this.path.style.strokeDashoffset = offset;
	};

	Line.createTextContainer = function createTextContainer(opts, container) {
	    var textContainer = document.createElement('div');

	    container.style.position = 'relative';
	    return textContainer;
	};

	Line.setText = function setText(newText) {

	    if (this.text === undefined) {
	        // Create new text node
	        this.text = this.createTextContainer(this.opts, this.container);
	        this.container.appendChild(this.text);
	        this.text.innerHTML = newText;
	        if(this.opts.autoStyleText === true){
	            var textStyle = this.opts.text;
	            var defaultHtmlStyle = "color:"+textStyle.color+";"+
	                "position: absolute;" +
	                "right: 0px;" +
	                "top: 20px;" +
	                "padding: 0px;" +
	                "margin: 0px;"+
	                "font-size: "+textStyle.fontSize+";";

	            this.text.style = defaultHtmlStyle;
	        }else{
	            var textStyle = this.opts.text;
	            var htmlTextStyle = "";
	            for(property in textStyle){
	                htmlTextStyle+= property +':'+textStyle[property]+'; ';
	            }

	            this.text.style = htmlTextStyle;
	        }
	    }else{
	        this.text.innerHTML = newText;
	    }



	};

	Line.setShapeStyle = function setShapeStyle(style) {
	    this.path.setAttribute('stroke', style.lineColor);
	};
	Line.setAnimationStyle = function setAnimationStyle(style) {
	    this.path.style.transition = style.transition
	};

	Line.setCustomTextDisplay = function setCustomTextDisplay(textDisplay){
	    this.container.appendChild(textDisplay);
	    this.text = textDisplay;

	};

	module.exports = Line;










/***/ },
/* 2 */
/***/ function(module, exports) {

	/**
	 * Created by avaleanu on 06.01.2017.
	 */

	function render(template, vars) {
	    var rendered = template;

	    for (var key in vars) {
	        if (vars.hasOwnProperty(key)) {
	            var val = vars[key];
	            var regExpString = '\\{' + key + '\\}';
	            var regExp = new RegExp(regExpString, 'g');

	            rendered = rendered.replace(regExp, val);
	        }
	    }

	    return rendered;
	}

	function removeChildren(el) {
	    while (el.firstChild) {
	        el.removeChild(el.firstChild);
	    }
	}

	module.exports = {
	    render: render,
	    removeChildren : removeChildren
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by avaleanu on 06.01.2017.
	 */
	var utils = __webpack_require__(2);
	var Circle = {

	    init:function Circle(container, opts) {
	        // Use two arcs to form a circle
	        // See this answer http://stackoverflow.com/a/10477334/1446092
	        this.pathTemplate =
	            'M 50,50 m 0,-{radius}' +
	            ' a {radius},{radius} 0 1 1 0,{2radius}' +
	            ' a {radius},{radius} 0 1 1 0,-{2radius}';

	        this.containerAspectRatio = 1;

	        this.opts = opts;

	        this.svgView = this.createSvgElement(opts);

	        this.container = container;
	        container.style.height = '100%';
	        this.container.appendChild(this.svgView.svg);

	        this.svg = this.svgView.svg;
	        this.path = this.svgView.path;
	        this.trail = this.svgView.trail;

	        if(opts.maxValue){
	            this.maxValue = opts.maxValue;
	        }

	        //this.path.style.transition = this.opts.transitionDuration +"s all ease-in-out";
	        //this.setText('');
	        return this;

	    }

	};

	Circle.createSvgElement = function createSvgElement(opts) {
	    var svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
	    this.initializeSvg(svg, opts);

	    var trailPath = null;
	    if (opts.trailColor || opts.trailWidth) {
	        trailPath = this.createTrail(opts);
	        svg.appendChild(trailPath);
	    }

	    var path = this.createPath(opts);
	    svg.appendChild(path);

	    return {
	        svg: svg,
	        path: path,
	        trail: trailPath
	    }

	};

	Circle.initializeSvg = function _initializeSvg(svg, opts) {
	    svg.setAttribute('viewBox', '0 0 100 100');
	    //svg.setAttribute('preserveAspectRatio', 'none');
	    svg.style.position = 'relative';
	    svg.style.width = '100%';
	    svg.style.height = '100%';
	    svg.style.left = '0';
	    svg.style.display = 'inline-block';
	};

	Circle.createPath = function createPath(opts) {
	    var pathString = this.pathString(opts);
	    return this.createPathElement(pathString, opts);

	};

	Circle.createPathElement = function createPathElement(pathString, opts){
	    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	    path.setAttribute('d', pathString);
	    path.setAttribute('stroke', opts.color);
	    path.setAttribute('stroke-width', opts.strokeWidth);

	    if (opts.fill) {
	        path.setAttribute('fill', opts.fill);
	    } else {
	        path.setAttribute('fill-opacity', '0');
	    }

	    return path;
	};

	Circle.pathString = function pathString(opts) {
	    var widthOfWider = opts.strokeWidth;
	    if (opts.trailWidth && opts.trailWidth > opts.strokeWidth) {
	        widthOfWider = opts.trailWidth;
	    }

	    var r = 50 - widthOfWider / 2;

	    return utils.render(this.pathTemplate, {
	        radius: r,
	        '2radius': r * 2
	    });
	};

	Circle.createTrail = function createTrail(opts) {

	    var pathString = this.trailString(opts);

	    var trail = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	    trail.setAttribute('d', pathString);
	    trail.setAttribute('stroke', opts.trailColor);
	    trail.setAttribute('stroke-width', opts.trailWidth);
	    if (opts.fill) {
	        trail.setAttribute('fill', opts.fill);
	    } else {
	        trail.setAttribute('fill-opacity', '0');
	    }

	    return trail;

	};

	Circle.trailString = function trailString(opts) {
	    return this.pathString(opts);
	};

	Circle.setValue = function setValue(value) {
	    var len = this.path.getTotalLength();


	    var offset = (this.opts.maxValue-value)/this.opts.maxValue * len;

	    this.path.style.strokeDasharray = len + ' ' + len;
	    this.path.style.strokeDashoffset = offset;
	};


	Circle.createTextContainer = function createTextContainer(opts, container) {
	    var textContainer = document.createElement('div');
	    // textContainer.className = opts.text.className;
	    container.style.position = 'relative';

	    return textContainer;
	};

	Circle.setText = function setText(newText) {

	    if (this.text === undefined) {
	        // Create new text node
	        this.text = this.createTextContainer(this.opts, this.container);
	        this.container.appendChild(this.text);
	        this.text.innerHTML = newText;

	        if(this.opts.autoStyleText === true){
	            var textStyle = this.opts.text;
	            var defaultHtmlStyle = "position: absolute;" +
	                "left: 50%;" +
	                "top: 50%;" +
	                "padding: 0px;" +
	                "margin: 0px;" +
	                "transform: translate(-50%, -50%);" +
	                "color:" +textStyle.color+";"+
	                "font-family: Raleway, Helvetica, sans-serif;" +
	                "font-size: "+textStyle.fontSize+";";

	            this.text.style = defaultHtmlStyle;
	        }else{
	            var textStyle = this.opts.text;
	            var htmlTextStyle = "";
	            for(property in textStyle){
	                htmlTextStyle+= property +':'+textStyle[property]+'; ';
	            }

	            this.text.style = htmlTextStyle;
	        }

	    }else{
	        this.text.innerHTML = newText;
	    }



	};

	Circle.setShapeStyle = function setShapeStyle(style) {
	    this.path.setAttribute('stroke', style.lineColor);
	};
	Circle.setAnimationStyle = function setAnimationStyle(style) {
	    this.path.style.transition = style.transition
	};


	Circle.setCustomTextDisplay = function setCustomTextDisplay(textDisplay){
	    this.container.appendChild(textDisplay);
	    this.text = textDisplay;

	};



	module.exports = Circle;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by avaleanu on 09.01.2017.
	 */
	var utils = __webpack_require__(2);
	var SemiCircle = {

	    init:function Circle(container, opts) {
	        // Use two arcs to form a circle
	        // See this answer http://stackoverflow.com/a/10477334/1446092
	        this.pathTemplate =
	            'M 50,50 m -{radius},0' +
	            ' a {radius},{radius} 0 1 1 {2radius},0';

	        this.containerAspectRatio = 2;

	        this.opts = opts;

	        this.svgView = this.createSvgElement(opts);

	        this.container = container;
	        this.container.appendChild(this.svgView.svg);

	        this.svg = this.svgView.svg;
	        this.path = this.svgView.path;
	        this.trail = this.svgView.trail;

	        if(opts.maxValue){
	            this.maxValue = opts.maxValue;
	        }

	        //this.path.style.transition = this.opts.transitionDuration +"s all ease-in-out";
	        //this.setText('');
	        return this;

	    }

	};

	SemiCircle.createSvgElement = function createSvgElement(opts) {
	    var svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
	    this.initializeSvg(svg, opts);

	    var trailPath = null;
	    if (opts.trailColor || opts.trailWidth) {
	        trailPath = this.createTrail(opts);
	        svg.appendChild(trailPath);
	    }

	    var path = this.createPath(opts);
	    svg.appendChild(path);

	    return {
	        svg: svg,
	        path: path,
	        trail: trailPath
	    }

	};

	SemiCircle.initializeSvg = function _initializeSvg(svg, opts) {
	    svg.setAttribute('viewBox', '0 0 100 50');
	    svg.style.position = 'relative';
	    svg.style.width = '100%';
	    svg.style.height = '100%';
	    svg.style.left = '0';
	    svg.style.display = 'inline-block';
	};

	SemiCircle.createPath = function createPath(opts) {
	    var pathString = this.pathString(opts);
	    return this.createPathElement(pathString, opts);

	};

	SemiCircle.createPathElement = function createPathElement(pathString, opts){
	    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	    path.setAttribute('d', pathString);
	    path.setAttribute('stroke', opts.color);
	    path.setAttribute('stroke-width', opts.strokeWidth);
	    path.style.transition = this.opts.transitionDuration +"s all ease-in-out";

	    if (opts.fill) {
	        path.setAttribute('fill', opts.fill);
	    } else {
	        path.setAttribute('fill-opacity', '0');
	    }

	    return path;
	};

	SemiCircle.pathString = function pathString(opts) {
	    var widthOfWider = opts.strokeWidth;
	    if (opts.trailWidth && opts.trailWidth > opts.strokeWidth) {
	        widthOfWider = opts.trailWidth;
	    }

	    var r = 50 - widthOfWider / 2;

	    return utils.render(this.pathTemplate, {
	        radius: r,
	        '2radius': r * 2
	    });
	};

	SemiCircle.createTrail = function createTrail(opts) {

	    var pathString = this.trailString(opts);

	    var trail = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	    trail.setAttribute('d', pathString);
	    trail.setAttribute('stroke', opts.trailColor);
	    trail.setAttribute('stroke-width', opts.trailWidth);
	    if (opts.fill) {
	        trail.setAttribute('fill', opts.fill);
	    } else {
	        trail.setAttribute('fill-opacity', '0');
	    }

	    return trail;

	};

	SemiCircle.trailString = function trailString(opts) {
	    return this.pathString(opts);
	};

	SemiCircle.setValue = function setValue(value) {
	    var len = this.path.getTotalLength();


	    var offset = (this.opts.maxValue-value)/this.opts.maxValue * len;

	    this.path.style.strokeDasharray = len + ' ' + len;
	    this.path.style.strokeDashoffset = offset;
	};


	SemiCircle.createTextContainer = function createTextContainer(opts, container) {
	    var textContainer = document.createElement('div');

	    container.style.position = 'relative';
	    return textContainer;
	};

	SemiCircle.setText = function setText(newText) {

	    if (this.text === undefined) {
	        // Create new text node
	        this.text = this.createTextContainer(this.opts, this.container);
	        this.container.appendChild(this.text);
	        this.text.innerHTML = newText;

	        if(this.opts.autoStyleText === true){
	            var textStyle = this.opts.text;
	            var defaultHtmlStyle = "position: absolute;" +
	                "left: 50%;" +
	                "top: auto;" +
	                "padding: 0px;" +
	                "margin: 0px;" +
	                "transform: translate(-50%, 40%);" +
	                "color: "+textStyle.color+";"+
	                "bottom: 14px;" +
	                "font-family: Raleway, Helvetica, sans-serif;" +
	                "font-size: "+textStyle.fontSize+";";

	            this.text.style = defaultHtmlStyle;
	        }else{
	            var textStyle = this.opts.text;
	            var htmlTextStyle = "";
	            for(property in textStyle){
	                htmlTextStyle+= property +':'+textStyle[property]+'; ';
	            }

	            this.text.style = htmlTextStyle;
	        }
	    }else{
	        this.text.innerHTML = newText;
	    }





	};

	SemiCircle.setShapeStyle = function setShapeStyle(style) {
	    this.path.setAttribute('stroke', style.lineColor);
	};
	SemiCircle.setAnimationStyle = function setAnimationStyle(style) {
	    this.path.style.transition = style.transition
	};


	SemiCircle.setCustomTextDisplay = function setCustomTextDisplay(textDisplay){
	    this.container.appendChild(textDisplay);
	    this.text = textDisplay;

	};



	module.exports = SemiCircle;

/***/ }
/******/ ]);