/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./node_modules/swiper/shared/ssr-window.esm.mjs
/**
 * SSR Window 4.0.2
 * Better handling for window object in SSR environment
 * https://github.com/nolimits4web/ssr-window
 *
 * Copyright 2021, Vladimir Kharlampidi
 *
 * Licensed under MIT
 *
 * Released on: December 13, 2021
 */
/* eslint-disable no-param-reassign */
function isObject(obj) {
  return obj !== null && typeof obj === 'object' && 'constructor' in obj && obj.constructor === Object;
}
function extend(target, src) {
  if (target === void 0) {
    target = {};
  }
  if (src === void 0) {
    src = {};
  }
  Object.keys(src).forEach(key => {
    if (typeof target[key] === 'undefined') target[key] = src[key];else if (isObject(src[key]) && isObject(target[key]) && Object.keys(src[key]).length > 0) {
      extend(target[key], src[key]);
    }
  });
}
const ssrDocument = {
  body: {},
  addEventListener() {},
  removeEventListener() {},
  activeElement: {
    blur() {},
    nodeName: ''
  },
  querySelector() {
    return null;
  },
  querySelectorAll() {
    return [];
  },
  getElementById() {
    return null;
  },
  createEvent() {
    return {
      initEvent() {}
    };
  },
  createElement() {
    return {
      children: [],
      childNodes: [],
      style: {},
      setAttribute() {},
      getElementsByTagName() {
        return [];
      }
    };
  },
  createElementNS() {
    return {};
  },
  importNode() {
    return null;
  },
  location: {
    hash: '',
    host: '',
    hostname: '',
    href: '',
    origin: '',
    pathname: '',
    protocol: '',
    search: ''
  }
};
function getDocument() {
  const doc = typeof document !== 'undefined' ? document : {};
  extend(doc, ssrDocument);
  return doc;
}
const ssrWindow = {
  document: ssrDocument,
  navigator: {
    userAgent: ''
  },
  location: {
    hash: '',
    host: '',
    hostname: '',
    href: '',
    origin: '',
    pathname: '',
    protocol: '',
    search: ''
  },
  history: {
    replaceState() {},
    pushState() {},
    go() {},
    back() {}
  },
  CustomEvent: function CustomEvent() {
    return this;
  },
  addEventListener() {},
  removeEventListener() {},
  getComputedStyle() {
    return {
      getPropertyValue() {
        return '';
      }
    };
  },
  Image() {},
  Date() {},
  screen: {},
  setTimeout() {},
  clearTimeout() {},
  matchMedia() {
    return {};
  },
  requestAnimationFrame(callback) {
    if (typeof setTimeout === 'undefined') {
      callback();
      return null;
    }
    return setTimeout(callback, 0);
  },
  cancelAnimationFrame(id) {
    if (typeof setTimeout === 'undefined') {
      return;
    }
    clearTimeout(id);
  }
};
function getWindow() {
  const win = typeof window !== 'undefined' ? window : {};
  extend(win, ssrWindow);
  return win;
}



;// CONCATENATED MODULE: ./node_modules/swiper/shared/utils.mjs


function classesToTokens(classes) {
  if (classes === void 0) {
    classes = '';
  }
  return classes.trim().split(' ').filter(c => !!c.trim());
}

function deleteProps(obj) {
  const object = obj;
  Object.keys(object).forEach(key => {
    try {
      object[key] = null;
    } catch (e) {
      // no getter for object
    }
    try {
      delete object[key];
    } catch (e) {
      // something got wrong
    }
  });
}
function nextTick(callback, delay) {
  if (delay === void 0) {
    delay = 0;
  }
  return setTimeout(callback, delay);
}
function now() {
  return Date.now();
}
function utils_getComputedStyle(el) {
  const window = getWindow();
  let style;
  if (window.getComputedStyle) {
    style = window.getComputedStyle(el, null);
  }
  if (!style && el.currentStyle) {
    style = el.currentStyle;
  }
  if (!style) {
    style = el.style;
  }
  return style;
}
function getTranslate(el, axis) {
  if (axis === void 0) {
    axis = 'x';
  }
  const window = getWindow();
  let matrix;
  let curTransform;
  let transformMatrix;
  const curStyle = utils_getComputedStyle(el);
  if (window.WebKitCSSMatrix) {
    curTransform = curStyle.transform || curStyle.webkitTransform;
    if (curTransform.split(',').length > 6) {
      curTransform = curTransform.split(', ').map(a => a.replace(',', '.')).join(', ');
    }
    // Some old versions of Webkit choke when 'none' is passed; pass
    // empty string instead in this case
    transformMatrix = new window.WebKitCSSMatrix(curTransform === 'none' ? '' : curTransform);
  } else {
    transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
    matrix = transformMatrix.toString().split(',');
  }
  if (axis === 'x') {
    // Latest Chrome and webkits Fix
    if (window.WebKitCSSMatrix) curTransform = transformMatrix.m41;
    // Crazy IE10 Matrix
    else if (matrix.length === 16) curTransform = parseFloat(matrix[12]);
    // Normal Browsers
    else curTransform = parseFloat(matrix[4]);
  }
  if (axis === 'y') {
    // Latest Chrome and webkits Fix
    if (window.WebKitCSSMatrix) curTransform = transformMatrix.m42;
    // Crazy IE10 Matrix
    else if (matrix.length === 16) curTransform = parseFloat(matrix[13]);
    // Normal Browsers
    else curTransform = parseFloat(matrix[5]);
  }
  return curTransform || 0;
}
function utils_isObject(o) {
  return typeof o === 'object' && o !== null && o.constructor && Object.prototype.toString.call(o).slice(8, -1) === 'Object';
}
function isNode(node) {
  // eslint-disable-next-line
  if (typeof window !== 'undefined' && typeof window.HTMLElement !== 'undefined') {
    return node instanceof HTMLElement;
  }
  return node && (node.nodeType === 1 || node.nodeType === 11);
}
function utils_extend() {
  const to = Object(arguments.length <= 0 ? undefined : arguments[0]);
  const noExtend = ['__proto__', 'constructor', 'prototype'];
  for (let i = 1; i < arguments.length; i += 1) {
    const nextSource = i < 0 || arguments.length <= i ? undefined : arguments[i];
    if (nextSource !== undefined && nextSource !== null && !isNode(nextSource)) {
      const keysArray = Object.keys(Object(nextSource)).filter(key => noExtend.indexOf(key) < 0);
      for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
        const nextKey = keysArray[nextIndex];
        const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
        if (desc !== undefined && desc.enumerable) {
          if (utils_isObject(to[nextKey]) && utils_isObject(nextSource[nextKey])) {
            if (nextSource[nextKey].__swiper__) {
              to[nextKey] = nextSource[nextKey];
            } else {
              utils_extend(to[nextKey], nextSource[nextKey]);
            }
          } else if (!utils_isObject(to[nextKey]) && utils_isObject(nextSource[nextKey])) {
            to[nextKey] = {};
            if (nextSource[nextKey].__swiper__) {
              to[nextKey] = nextSource[nextKey];
            } else {
              utils_extend(to[nextKey], nextSource[nextKey]);
            }
          } else {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
  }
  return to;
}
function setCSSProperty(el, varName, varValue) {
  el.style.setProperty(varName, varValue);
}
function animateCSSModeScroll(_ref) {
  let {
    swiper,
    targetPosition,
    side
  } = _ref;
  const window = getWindow();
  const startPosition = -swiper.translate;
  let startTime = null;
  let time;
  const duration = swiper.params.speed;
  swiper.wrapperEl.style.scrollSnapType = 'none';
  window.cancelAnimationFrame(swiper.cssModeFrameID);
  const dir = targetPosition > startPosition ? 'next' : 'prev';
  const isOutOfBound = (current, target) => {
    return dir === 'next' && current >= target || dir === 'prev' && current <= target;
  };
  const animate = () => {
    time = new Date().getTime();
    if (startTime === null) {
      startTime = time;
    }
    const progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
    const easeProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
    let currentPosition = startPosition + easeProgress * (targetPosition - startPosition);
    if (isOutOfBound(currentPosition, targetPosition)) {
      currentPosition = targetPosition;
    }
    swiper.wrapperEl.scrollTo({
      [side]: currentPosition
    });
    if (isOutOfBound(currentPosition, targetPosition)) {
      swiper.wrapperEl.style.overflow = 'hidden';
      swiper.wrapperEl.style.scrollSnapType = '';
      setTimeout(() => {
        swiper.wrapperEl.style.overflow = '';
        swiper.wrapperEl.scrollTo({
          [side]: currentPosition
        });
      });
      window.cancelAnimationFrame(swiper.cssModeFrameID);
      return;
    }
    swiper.cssModeFrameID = window.requestAnimationFrame(animate);
  };
  animate();
}
function getSlideTransformEl(slideEl) {
  return slideEl.querySelector('.swiper-slide-transform') || slideEl.shadowRoot && slideEl.shadowRoot.querySelector('.swiper-slide-transform') || slideEl;
}
function elementChildren(element, selector) {
  if (selector === void 0) {
    selector = '';
  }
  return [...element.children].filter(el => el.matches(selector));
}
function showWarning(text) {
  try {
    console.warn(text);
    return;
  } catch (err) {
    // err
  }
}
function createElement(tag, classes) {
  if (classes === void 0) {
    classes = [];
  }
  const el = document.createElement(tag);
  el.classList.add(...(Array.isArray(classes) ? classes : classesToTokens(classes)));
  return el;
}
function elementOffset(el) {
  const window = getWindow();
  const document = getDocument();
  const box = el.getBoundingClientRect();
  const body = document.body;
  const clientTop = el.clientTop || body.clientTop || 0;
  const clientLeft = el.clientLeft || body.clientLeft || 0;
  const scrollTop = el === window ? window.scrollY : el.scrollTop;
  const scrollLeft = el === window ? window.scrollX : el.scrollLeft;
  return {
    top: box.top + scrollTop - clientTop,
    left: box.left + scrollLeft - clientLeft
  };
}
function elementPrevAll(el, selector) {
  const prevEls = [];
  while (el.previousElementSibling) {
    const prev = el.previousElementSibling; // eslint-disable-line
    if (selector) {
      if (prev.matches(selector)) prevEls.push(prev);
    } else prevEls.push(prev);
    el = prev;
  }
  return prevEls;
}
function elementNextAll(el, selector) {
  const nextEls = [];
  while (el.nextElementSibling) {
    const next = el.nextElementSibling; // eslint-disable-line
    if (selector) {
      if (next.matches(selector)) nextEls.push(next);
    } else nextEls.push(next);
    el = next;
  }
  return nextEls;
}
function elementStyle(el, prop) {
  const window = getWindow();
  return window.getComputedStyle(el, null).getPropertyValue(prop);
}
function elementIndex(el) {
  let child = el;
  let i;
  if (child) {
    i = 0;
    // eslint-disable-next-line
    while ((child = child.previousSibling) !== null) {
      if (child.nodeType === 1) i += 1;
    }
    return i;
  }
  return undefined;
}
function elementParents(el, selector) {
  const parents = []; // eslint-disable-line
  let parent = el.parentElement; // eslint-disable-line
  while (parent) {
    if (selector) {
      if (parent.matches(selector)) parents.push(parent);
    } else {
      parents.push(parent);
    }
    parent = parent.parentElement;
  }
  return parents;
}
function elementTransitionEnd(el, callback) {
  function fireCallBack(e) {
    if (e.target !== el) return;
    callback.call(el, e);
    el.removeEventListener('transitionend', fireCallBack);
  }
  if (callback) {
    el.addEventListener('transitionend', fireCallBack);
  }
}
function elementOuterSize(el, size, includeMargins) {
  const window = getWindow();
  if (includeMargins) {
    return el[size === 'width' ? 'offsetWidth' : 'offsetHeight'] + parseFloat(window.getComputedStyle(el, null).getPropertyValue(size === 'width' ? 'margin-right' : 'margin-top')) + parseFloat(window.getComputedStyle(el, null).getPropertyValue(size === 'width' ? 'margin-left' : 'margin-bottom'));
  }
  return el.offsetWidth;
}



;// CONCATENATED MODULE: ./node_modules/swiper/shared/swiper-core.mjs



let support;
function calcSupport() {
  const window = getWindow();
  const document = getDocument();
  return {
    smoothScroll: document.documentElement && document.documentElement.style && 'scrollBehavior' in document.documentElement.style,
    touch: !!('ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch)
  };
}
function getSupport() {
  if (!support) {
    support = calcSupport();
  }
  return support;
}

let deviceCached;
function calcDevice(_temp) {
  let {
    userAgent
  } = _temp === void 0 ? {} : _temp;
  const support = getSupport();
  const window = getWindow();
  const platform = window.navigator.platform;
  const ua = userAgent || window.navigator.userAgent;
  const device = {
    ios: false,
    android: false
  };
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/); // eslint-disable-line
  let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
  const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
  const iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
  const windows = platform === 'Win32';
  let macos = platform === 'MacIntel';

  // iPadOs 13 fix
  const iPadScreens = ['1024x1366', '1366x1024', '834x1194', '1194x834', '834x1112', '1112x834', '768x1024', '1024x768', '820x1180', '1180x820', '810x1080', '1080x810'];
  if (!ipad && macos && support.touch && iPadScreens.indexOf(`${screenWidth}x${screenHeight}`) >= 0) {
    ipad = ua.match(/(Version)\/([\d.]+)/);
    if (!ipad) ipad = [0, 1, '13_0_0'];
    macos = false;
  }

  // Android
  if (android && !windows) {
    device.os = 'android';
    device.android = true;
  }
  if (ipad || iphone || ipod) {
    device.os = 'ios';
    device.ios = true;
  }

  // Export object
  return device;
}
function getDevice(overrides) {
  if (overrides === void 0) {
    overrides = {};
  }
  if (!deviceCached) {
    deviceCached = calcDevice(overrides);
  }
  return deviceCached;
}

let browser;
function calcBrowser() {
  const window = getWindow();
  let needPerspectiveFix = false;
  function isSafari() {
    const ua = window.navigator.userAgent.toLowerCase();
    return ua.indexOf('safari') >= 0 && ua.indexOf('chrome') < 0 && ua.indexOf('android') < 0;
  }
  if (isSafari()) {
    const ua = String(window.navigator.userAgent);
    if (ua.includes('Version/')) {
      const [major, minor] = ua.split('Version/')[1].split(' ')[0].split('.').map(num => Number(num));
      needPerspectiveFix = major < 16 || major === 16 && minor < 2;
    }
  }
  return {
    isSafari: needPerspectiveFix || isSafari(),
    needPerspectiveFix,
    isWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(window.navigator.userAgent)
  };
}
function getBrowser() {
  if (!browser) {
    browser = calcBrowser();
  }
  return browser;
}

function Resize(_ref) {
  let {
    swiper,
    on,
    emit
  } = _ref;
  const window = getWindow();
  let observer = null;
  let animationFrame = null;
  const resizeHandler = () => {
    if (!swiper || swiper.destroyed || !swiper.initialized) return;
    emit('beforeResize');
    emit('resize');
  };
  const createObserver = () => {
    if (!swiper || swiper.destroyed || !swiper.initialized) return;
    observer = new ResizeObserver(entries => {
      animationFrame = window.requestAnimationFrame(() => {
        const {
          width,
          height
        } = swiper;
        let newWidth = width;
        let newHeight = height;
        entries.forEach(_ref2 => {
          let {
            contentBoxSize,
            contentRect,
            target
          } = _ref2;
          if (target && target !== swiper.el) return;
          newWidth = contentRect ? contentRect.width : (contentBoxSize[0] || contentBoxSize).inlineSize;
          newHeight = contentRect ? contentRect.height : (contentBoxSize[0] || contentBoxSize).blockSize;
        });
        if (newWidth !== width || newHeight !== height) {
          resizeHandler();
        }
      });
    });
    observer.observe(swiper.el);
  };
  const removeObserver = () => {
    if (animationFrame) {
      window.cancelAnimationFrame(animationFrame);
    }
    if (observer && observer.unobserve && swiper.el) {
      observer.unobserve(swiper.el);
      observer = null;
    }
  };
  const orientationChangeHandler = () => {
    if (!swiper || swiper.destroyed || !swiper.initialized) return;
    emit('orientationchange');
  };
  on('init', () => {
    if (swiper.params.resizeObserver && typeof window.ResizeObserver !== 'undefined') {
      createObserver();
      return;
    }
    window.addEventListener('resize', resizeHandler);
    window.addEventListener('orientationchange', orientationChangeHandler);
  });
  on('destroy', () => {
    removeObserver();
    window.removeEventListener('resize', resizeHandler);
    window.removeEventListener('orientationchange', orientationChangeHandler);
  });
}

function Observer(_ref) {
  let {
    swiper,
    extendParams,
    on,
    emit
  } = _ref;
  const observers = [];
  const window = getWindow();
  const attach = function (target, options) {
    if (options === void 0) {
      options = {};
    }
    const ObserverFunc = window.MutationObserver || window.WebkitMutationObserver;
    const observer = new ObserverFunc(mutations => {
      // The observerUpdate event should only be triggered
      // once despite the number of mutations.  Additional
      // triggers are redundant and are very costly
      if (swiper.__preventObserver__) return;
      if (mutations.length === 1) {
        emit('observerUpdate', mutations[0]);
        return;
      }
      const observerUpdate = function observerUpdate() {
        emit('observerUpdate', mutations[0]);
      };
      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(observerUpdate);
      } else {
        window.setTimeout(observerUpdate, 0);
      }
    });
    observer.observe(target, {
      attributes: typeof options.attributes === 'undefined' ? true : options.attributes,
      childList: typeof options.childList === 'undefined' ? true : options.childList,
      characterData: typeof options.characterData === 'undefined' ? true : options.characterData
    });
    observers.push(observer);
  };
  const init = () => {
    if (!swiper.params.observer) return;
    if (swiper.params.observeParents) {
      const containerParents = elementParents(swiper.hostEl);
      for (let i = 0; i < containerParents.length; i += 1) {
        attach(containerParents[i]);
      }
    }
    // Observe container
    attach(swiper.hostEl, {
      childList: swiper.params.observeSlideChildren
    });

    // Observe wrapper
    attach(swiper.wrapperEl, {
      attributes: false
    });
  };
  const destroy = () => {
    observers.forEach(observer => {
      observer.disconnect();
    });
    observers.splice(0, observers.length);
  };
  extendParams({
    observer: false,
    observeParents: false,
    observeSlideChildren: false
  });
  on('init', init);
  on('destroy', destroy);
}

/* eslint-disable no-underscore-dangle */

var eventsEmitter = {
  on(events, handler, priority) {
    const self = this;
    if (!self.eventsListeners || self.destroyed) return self;
    if (typeof handler !== 'function') return self;
    const method = priority ? 'unshift' : 'push';
    events.split(' ').forEach(event => {
      if (!self.eventsListeners[event]) self.eventsListeners[event] = [];
      self.eventsListeners[event][method](handler);
    });
    return self;
  },
  once(events, handler, priority) {
    const self = this;
    if (!self.eventsListeners || self.destroyed) return self;
    if (typeof handler !== 'function') return self;
    function onceHandler() {
      self.off(events, onceHandler);
      if (onceHandler.__emitterProxy) {
        delete onceHandler.__emitterProxy;
      }
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      handler.apply(self, args);
    }
    onceHandler.__emitterProxy = handler;
    return self.on(events, onceHandler, priority);
  },
  onAny(handler, priority) {
    const self = this;
    if (!self.eventsListeners || self.destroyed) return self;
    if (typeof handler !== 'function') return self;
    const method = priority ? 'unshift' : 'push';
    if (self.eventsAnyListeners.indexOf(handler) < 0) {
      self.eventsAnyListeners[method](handler);
    }
    return self;
  },
  offAny(handler) {
    const self = this;
    if (!self.eventsListeners || self.destroyed) return self;
    if (!self.eventsAnyListeners) return self;
    const index = self.eventsAnyListeners.indexOf(handler);
    if (index >= 0) {
      self.eventsAnyListeners.splice(index, 1);
    }
    return self;
  },
  off(events, handler) {
    const self = this;
    if (!self.eventsListeners || self.destroyed) return self;
    if (!self.eventsListeners) return self;
    events.split(' ').forEach(event => {
      if (typeof handler === 'undefined') {
        self.eventsListeners[event] = [];
      } else if (self.eventsListeners[event]) {
        self.eventsListeners[event].forEach((eventHandler, index) => {
          if (eventHandler === handler || eventHandler.__emitterProxy && eventHandler.__emitterProxy === handler) {
            self.eventsListeners[event].splice(index, 1);
          }
        });
      }
    });
    return self;
  },
  emit() {
    const self = this;
    if (!self.eventsListeners || self.destroyed) return self;
    if (!self.eventsListeners) return self;
    let events;
    let data;
    let context;
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    if (typeof args[0] === 'string' || Array.isArray(args[0])) {
      events = args[0];
      data = args.slice(1, args.length);
      context = self;
    } else {
      events = args[0].events;
      data = args[0].data;
      context = args[0].context || self;
    }
    data.unshift(context);
    const eventsArray = Array.isArray(events) ? events : events.split(' ');
    eventsArray.forEach(event => {
      if (self.eventsAnyListeners && self.eventsAnyListeners.length) {
        self.eventsAnyListeners.forEach(eventHandler => {
          eventHandler.apply(context, [event, ...data]);
        });
      }
      if (self.eventsListeners && self.eventsListeners[event]) {
        self.eventsListeners[event].forEach(eventHandler => {
          eventHandler.apply(context, data);
        });
      }
    });
    return self;
  }
};

function updateSize() {
  const swiper = this;
  let width;
  let height;
  const el = swiper.el;
  if (typeof swiper.params.width !== 'undefined' && swiper.params.width !== null) {
    width = swiper.params.width;
  } else {
    width = el.clientWidth;
  }
  if (typeof swiper.params.height !== 'undefined' && swiper.params.height !== null) {
    height = swiper.params.height;
  } else {
    height = el.clientHeight;
  }
  if (width === 0 && swiper.isHorizontal() || height === 0 && swiper.isVertical()) {
    return;
  }

  // Subtract paddings
  width = width - parseInt(elementStyle(el, 'padding-left') || 0, 10) - parseInt(elementStyle(el, 'padding-right') || 0, 10);
  height = height - parseInt(elementStyle(el, 'padding-top') || 0, 10) - parseInt(elementStyle(el, 'padding-bottom') || 0, 10);
  if (Number.isNaN(width)) width = 0;
  if (Number.isNaN(height)) height = 0;
  Object.assign(swiper, {
    width,
    height,
    size: swiper.isHorizontal() ? width : height
  });
}

function updateSlides() {
  const swiper = this;
  function getDirectionPropertyValue(node, label) {
    return parseFloat(node.getPropertyValue(swiper.getDirectionLabel(label)) || 0);
  }
  const params = swiper.params;
  const {
    wrapperEl,
    slidesEl,
    size: swiperSize,
    rtlTranslate: rtl,
    wrongRTL
  } = swiper;
  const isVirtual = swiper.virtual && params.virtual.enabled;
  const previousSlidesLength = isVirtual ? swiper.virtual.slides.length : swiper.slides.length;
  const slides = elementChildren(slidesEl, `.${swiper.params.slideClass}, swiper-slide`);
  const slidesLength = isVirtual ? swiper.virtual.slides.length : slides.length;
  let snapGrid = [];
  const slidesGrid = [];
  const slidesSizesGrid = [];
  let offsetBefore = params.slidesOffsetBefore;
  if (typeof offsetBefore === 'function') {
    offsetBefore = params.slidesOffsetBefore.call(swiper);
  }
  let offsetAfter = params.slidesOffsetAfter;
  if (typeof offsetAfter === 'function') {
    offsetAfter = params.slidesOffsetAfter.call(swiper);
  }
  const previousSnapGridLength = swiper.snapGrid.length;
  const previousSlidesGridLength = swiper.slidesGrid.length;
  let spaceBetween = params.spaceBetween;
  let slidePosition = -offsetBefore;
  let prevSlideSize = 0;
  let index = 0;
  if (typeof swiperSize === 'undefined') {
    return;
  }
  if (typeof spaceBetween === 'string' && spaceBetween.indexOf('%') >= 0) {
    spaceBetween = parseFloat(spaceBetween.replace('%', '')) / 100 * swiperSize;
  } else if (typeof spaceBetween === 'string') {
    spaceBetween = parseFloat(spaceBetween);
  }
  swiper.virtualSize = -spaceBetween;

  // reset margins
  slides.forEach(slideEl => {
    if (rtl) {
      slideEl.style.marginLeft = '';
    } else {
      slideEl.style.marginRight = '';
    }
    slideEl.style.marginBottom = '';
    slideEl.style.marginTop = '';
  });

  // reset cssMode offsets
  if (params.centeredSlides && params.cssMode) {
    setCSSProperty(wrapperEl, '--swiper-centered-offset-before', '');
    setCSSProperty(wrapperEl, '--swiper-centered-offset-after', '');
  }
  const gridEnabled = params.grid && params.grid.rows > 1 && swiper.grid;
  if (gridEnabled) {
    swiper.grid.initSlides(slides);
  } else if (swiper.grid) {
    swiper.grid.unsetSlides();
  }

  // Calc slides
  let slideSize;
  const shouldResetSlideSize = params.slidesPerView === 'auto' && params.breakpoints && Object.keys(params.breakpoints).filter(key => {
    return typeof params.breakpoints[key].slidesPerView !== 'undefined';
  }).length > 0;
  for (let i = 0; i < slidesLength; i += 1) {
    slideSize = 0;
    let slide;
    if (slides[i]) slide = slides[i];
    if (gridEnabled) {
      swiper.grid.updateSlide(i, slide, slides);
    }
    if (slides[i] && elementStyle(slide, 'display') === 'none') continue; // eslint-disable-line

    if (params.slidesPerView === 'auto') {
      if (shouldResetSlideSize) {
        slides[i].style[swiper.getDirectionLabel('width')] = ``;
      }
      const slideStyles = getComputedStyle(slide);
      const currentTransform = slide.style.transform;
      const currentWebKitTransform = slide.style.webkitTransform;
      if (currentTransform) {
        slide.style.transform = 'none';
      }
      if (currentWebKitTransform) {
        slide.style.webkitTransform = 'none';
      }
      if (params.roundLengths) {
        slideSize = swiper.isHorizontal() ? elementOuterSize(slide, 'width', true) : elementOuterSize(slide, 'height', true);
      } else {
        // eslint-disable-next-line
        const width = getDirectionPropertyValue(slideStyles, 'width');
        const paddingLeft = getDirectionPropertyValue(slideStyles, 'padding-left');
        const paddingRight = getDirectionPropertyValue(slideStyles, 'padding-right');
        const marginLeft = getDirectionPropertyValue(slideStyles, 'margin-left');
        const marginRight = getDirectionPropertyValue(slideStyles, 'margin-right');
        const boxSizing = slideStyles.getPropertyValue('box-sizing');
        if (boxSizing && boxSizing === 'border-box') {
          slideSize = width + marginLeft + marginRight;
        } else {
          const {
            clientWidth,
            offsetWidth
          } = slide;
          slideSize = width + paddingLeft + paddingRight + marginLeft + marginRight + (offsetWidth - clientWidth);
        }
      }
      if (currentTransform) {
        slide.style.transform = currentTransform;
      }
      if (currentWebKitTransform) {
        slide.style.webkitTransform = currentWebKitTransform;
      }
      if (params.roundLengths) slideSize = Math.floor(slideSize);
    } else {
      slideSize = (swiperSize - (params.slidesPerView - 1) * spaceBetween) / params.slidesPerView;
      if (params.roundLengths) slideSize = Math.floor(slideSize);
      if (slides[i]) {
        slides[i].style[swiper.getDirectionLabel('width')] = `${slideSize}px`;
      }
    }
    if (slides[i]) {
      slides[i].swiperSlideSize = slideSize;
    }
    slidesSizesGrid.push(slideSize);
    if (params.centeredSlides) {
      slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
      if (prevSlideSize === 0 && i !== 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
      if (i === 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
      if (Math.abs(slidePosition) < 1 / 1000) slidePosition = 0;
      if (params.roundLengths) slidePosition = Math.floor(slidePosition);
      if (index % params.slidesPerGroup === 0) snapGrid.push(slidePosition);
      slidesGrid.push(slidePosition);
    } else {
      if (params.roundLengths) slidePosition = Math.floor(slidePosition);
      if ((index - Math.min(swiper.params.slidesPerGroupSkip, index)) % swiper.params.slidesPerGroup === 0) snapGrid.push(slidePosition);
      slidesGrid.push(slidePosition);
      slidePosition = slidePosition + slideSize + spaceBetween;
    }
    swiper.virtualSize += slideSize + spaceBetween;
    prevSlideSize = slideSize;
    index += 1;
  }
  swiper.virtualSize = Math.max(swiper.virtualSize, swiperSize) + offsetAfter;
  if (rtl && wrongRTL && (params.effect === 'slide' || params.effect === 'coverflow')) {
    wrapperEl.style.width = `${swiper.virtualSize + spaceBetween}px`;
  }
  if (params.setWrapperSize) {
    wrapperEl.style[swiper.getDirectionLabel('width')] = `${swiper.virtualSize + spaceBetween}px`;
  }
  if (gridEnabled) {
    swiper.grid.updateWrapperSize(slideSize, snapGrid);
  }

  // Remove last grid elements depending on width
  if (!params.centeredSlides) {
    const newSlidesGrid = [];
    for (let i = 0; i < snapGrid.length; i += 1) {
      let slidesGridItem = snapGrid[i];
      if (params.roundLengths) slidesGridItem = Math.floor(slidesGridItem);
      if (snapGrid[i] <= swiper.virtualSize - swiperSize) {
        newSlidesGrid.push(slidesGridItem);
      }
    }
    snapGrid = newSlidesGrid;
    if (Math.floor(swiper.virtualSize - swiperSize) - Math.floor(snapGrid[snapGrid.length - 1]) > 1) {
      snapGrid.push(swiper.virtualSize - swiperSize);
    }
  }
  if (isVirtual && params.loop) {
    const size = slidesSizesGrid[0] + spaceBetween;
    if (params.slidesPerGroup > 1) {
      const groups = Math.ceil((swiper.virtual.slidesBefore + swiper.virtual.slidesAfter) / params.slidesPerGroup);
      const groupSize = size * params.slidesPerGroup;
      for (let i = 0; i < groups; i += 1) {
        snapGrid.push(snapGrid[snapGrid.length - 1] + groupSize);
      }
    }
    for (let i = 0; i < swiper.virtual.slidesBefore + swiper.virtual.slidesAfter; i += 1) {
      if (params.slidesPerGroup === 1) {
        snapGrid.push(snapGrid[snapGrid.length - 1] + size);
      }
      slidesGrid.push(slidesGrid[slidesGrid.length - 1] + size);
      swiper.virtualSize += size;
    }
  }
  if (snapGrid.length === 0) snapGrid = [0];
  if (spaceBetween !== 0) {
    const key = swiper.isHorizontal() && rtl ? 'marginLeft' : swiper.getDirectionLabel('marginRight');
    slides.filter((_, slideIndex) => {
      if (!params.cssMode || params.loop) return true;
      if (slideIndex === slides.length - 1) {
        return false;
      }
      return true;
    }).forEach(slideEl => {
      slideEl.style[key] = `${spaceBetween}px`;
    });
  }
  if (params.centeredSlides && params.centeredSlidesBounds) {
    let allSlidesSize = 0;
    slidesSizesGrid.forEach(slideSizeValue => {
      allSlidesSize += slideSizeValue + (spaceBetween || 0);
    });
    allSlidesSize -= spaceBetween;
    const maxSnap = allSlidesSize - swiperSize;
    snapGrid = snapGrid.map(snap => {
      if (snap <= 0) return -offsetBefore;
      if (snap > maxSnap) return maxSnap + offsetAfter;
      return snap;
    });
  }
  if (params.centerInsufficientSlides) {
    let allSlidesSize = 0;
    slidesSizesGrid.forEach(slideSizeValue => {
      allSlidesSize += slideSizeValue + (spaceBetween || 0);
    });
    allSlidesSize -= spaceBetween;
    if (allSlidesSize < swiperSize) {
      const allSlidesOffset = (swiperSize - allSlidesSize) / 2;
      snapGrid.forEach((snap, snapIndex) => {
        snapGrid[snapIndex] = snap - allSlidesOffset;
      });
      slidesGrid.forEach((snap, snapIndex) => {
        slidesGrid[snapIndex] = snap + allSlidesOffset;
      });
    }
  }
  Object.assign(swiper, {
    slides,
    snapGrid,
    slidesGrid,
    slidesSizesGrid
  });
  if (params.centeredSlides && params.cssMode && !params.centeredSlidesBounds) {
    setCSSProperty(wrapperEl, '--swiper-centered-offset-before', `${-snapGrid[0]}px`);
    setCSSProperty(wrapperEl, '--swiper-centered-offset-after', `${swiper.size / 2 - slidesSizesGrid[slidesSizesGrid.length - 1] / 2}px`);
    const addToSnapGrid = -swiper.snapGrid[0];
    const addToSlidesGrid = -swiper.slidesGrid[0];
    swiper.snapGrid = swiper.snapGrid.map(v => v + addToSnapGrid);
    swiper.slidesGrid = swiper.slidesGrid.map(v => v + addToSlidesGrid);
  }
  if (slidesLength !== previousSlidesLength) {
    swiper.emit('slidesLengthChange');
  }
  if (snapGrid.length !== previousSnapGridLength) {
    if (swiper.params.watchOverflow) swiper.checkOverflow();
    swiper.emit('snapGridLengthChange');
  }
  if (slidesGrid.length !== previousSlidesGridLength) {
    swiper.emit('slidesGridLengthChange');
  }
  if (params.watchSlidesProgress) {
    swiper.updateSlidesOffset();
  }
  swiper.emit('slidesUpdated');
  if (!isVirtual && !params.cssMode && (params.effect === 'slide' || params.effect === 'fade')) {
    const backFaceHiddenClass = `${params.containerModifierClass}backface-hidden`;
    const hasClassBackfaceClassAdded = swiper.el.classList.contains(backFaceHiddenClass);
    if (slidesLength <= params.maxBackfaceHiddenSlides) {
      if (!hasClassBackfaceClassAdded) swiper.el.classList.add(backFaceHiddenClass);
    } else if (hasClassBackfaceClassAdded) {
      swiper.el.classList.remove(backFaceHiddenClass);
    }
  }
}

function updateAutoHeight(speed) {
  const swiper = this;
  const activeSlides = [];
  const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
  let newHeight = 0;
  let i;
  if (typeof speed === 'number') {
    swiper.setTransition(speed);
  } else if (speed === true) {
    swiper.setTransition(swiper.params.speed);
  }
  const getSlideByIndex = index => {
    if (isVirtual) {
      return swiper.slides[swiper.getSlideIndexByData(index)];
    }
    return swiper.slides[index];
  };
  // Find slides currently in view
  if (swiper.params.slidesPerView !== 'auto' && swiper.params.slidesPerView > 1) {
    if (swiper.params.centeredSlides) {
      (swiper.visibleSlides || []).forEach(slide => {
        activeSlides.push(slide);
      });
    } else {
      for (i = 0; i < Math.ceil(swiper.params.slidesPerView); i += 1) {
        const index = swiper.activeIndex + i;
        if (index > swiper.slides.length && !isVirtual) break;
        activeSlides.push(getSlideByIndex(index));
      }
    }
  } else {
    activeSlides.push(getSlideByIndex(swiper.activeIndex));
  }

  // Find new height from highest slide in view
  for (i = 0; i < activeSlides.length; i += 1) {
    if (typeof activeSlides[i] !== 'undefined') {
      const height = activeSlides[i].offsetHeight;
      newHeight = height > newHeight ? height : newHeight;
    }
  }

  // Update Height
  if (newHeight || newHeight === 0) swiper.wrapperEl.style.height = `${newHeight}px`;
}

function updateSlidesOffset() {
  const swiper = this;
  const slides = swiper.slides;
  // eslint-disable-next-line
  const minusOffset = swiper.isElement ? swiper.isHorizontal() ? swiper.wrapperEl.offsetLeft : swiper.wrapperEl.offsetTop : 0;
  for (let i = 0; i < slides.length; i += 1) {
    slides[i].swiperSlideOffset = (swiper.isHorizontal() ? slides[i].offsetLeft : slides[i].offsetTop) - minusOffset - swiper.cssOverflowAdjustment();
  }
}

function updateSlidesProgress(translate) {
  if (translate === void 0) {
    translate = this && this.translate || 0;
  }
  const swiper = this;
  const params = swiper.params;
  const {
    slides,
    rtlTranslate: rtl,
    snapGrid
  } = swiper;
  if (slides.length === 0) return;
  if (typeof slides[0].swiperSlideOffset === 'undefined') swiper.updateSlidesOffset();
  let offsetCenter = -translate;
  if (rtl) offsetCenter = translate;

  // Visible Slides
  slides.forEach(slideEl => {
    slideEl.classList.remove(params.slideVisibleClass, params.slideFullyVisibleClass);
  });
  swiper.visibleSlidesIndexes = [];
  swiper.visibleSlides = [];
  let spaceBetween = params.spaceBetween;
  if (typeof spaceBetween === 'string' && spaceBetween.indexOf('%') >= 0) {
    spaceBetween = parseFloat(spaceBetween.replace('%', '')) / 100 * swiper.size;
  } else if (typeof spaceBetween === 'string') {
    spaceBetween = parseFloat(spaceBetween);
  }
  for (let i = 0; i < slides.length; i += 1) {
    const slide = slides[i];
    let slideOffset = slide.swiperSlideOffset;
    if (params.cssMode && params.centeredSlides) {
      slideOffset -= slides[0].swiperSlideOffset;
    }
    const slideProgress = (offsetCenter + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + spaceBetween);
    const originalSlideProgress = (offsetCenter - snapGrid[0] + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + spaceBetween);
    const slideBefore = -(offsetCenter - slideOffset);
    const slideAfter = slideBefore + swiper.slidesSizesGrid[i];
    const isFullyVisible = slideBefore >= 0 && slideBefore <= swiper.size - swiper.slidesSizesGrid[i];
    const isVisible = slideBefore >= 0 && slideBefore < swiper.size - 1 || slideAfter > 1 && slideAfter <= swiper.size || slideBefore <= 0 && slideAfter >= swiper.size;
    if (isVisible) {
      swiper.visibleSlides.push(slide);
      swiper.visibleSlidesIndexes.push(i);
      slides[i].classList.add(params.slideVisibleClass);
    }
    if (isFullyVisible) {
      slides[i].classList.add(params.slideFullyVisibleClass);
    }
    slide.progress = rtl ? -slideProgress : slideProgress;
    slide.originalProgress = rtl ? -originalSlideProgress : originalSlideProgress;
  }
}

function updateProgress(translate) {
  const swiper = this;
  if (typeof translate === 'undefined') {
    const multiplier = swiper.rtlTranslate ? -1 : 1;
    // eslint-disable-next-line
    translate = swiper && swiper.translate && swiper.translate * multiplier || 0;
  }
  const params = swiper.params;
  const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
  let {
    progress,
    isBeginning,
    isEnd,
    progressLoop
  } = swiper;
  const wasBeginning = isBeginning;
  const wasEnd = isEnd;
  if (translatesDiff === 0) {
    progress = 0;
    isBeginning = true;
    isEnd = true;
  } else {
    progress = (translate - swiper.minTranslate()) / translatesDiff;
    const isBeginningRounded = Math.abs(translate - swiper.minTranslate()) < 1;
    const isEndRounded = Math.abs(translate - swiper.maxTranslate()) < 1;
    isBeginning = isBeginningRounded || progress <= 0;
    isEnd = isEndRounded || progress >= 1;
    if (isBeginningRounded) progress = 0;
    if (isEndRounded) progress = 1;
  }
  if (params.loop) {
    const firstSlideIndex = swiper.getSlideIndexByData(0);
    const lastSlideIndex = swiper.getSlideIndexByData(swiper.slides.length - 1);
    const firstSlideTranslate = swiper.slidesGrid[firstSlideIndex];
    const lastSlideTranslate = swiper.slidesGrid[lastSlideIndex];
    const translateMax = swiper.slidesGrid[swiper.slidesGrid.length - 1];
    const translateAbs = Math.abs(translate);
    if (translateAbs >= firstSlideTranslate) {
      progressLoop = (translateAbs - firstSlideTranslate) / translateMax;
    } else {
      progressLoop = (translateAbs + translateMax - lastSlideTranslate) / translateMax;
    }
    if (progressLoop > 1) progressLoop -= 1;
  }
  Object.assign(swiper, {
    progress,
    progressLoop,
    isBeginning,
    isEnd
  });
  if (params.watchSlidesProgress || params.centeredSlides && params.autoHeight) swiper.updateSlidesProgress(translate);
  if (isBeginning && !wasBeginning) {
    swiper.emit('reachBeginning toEdge');
  }
  if (isEnd && !wasEnd) {
    swiper.emit('reachEnd toEdge');
  }
  if (wasBeginning && !isBeginning || wasEnd && !isEnd) {
    swiper.emit('fromEdge');
  }
  swiper.emit('progress', progress);
}

function updateSlidesClasses() {
  const swiper = this;
  const {
    slides,
    params,
    slidesEl,
    activeIndex
  } = swiper;
  const isVirtual = swiper.virtual && params.virtual.enabled;
  const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
  const getFilteredSlide = selector => {
    return elementChildren(slidesEl, `.${params.slideClass}${selector}, swiper-slide${selector}`)[0];
  };
  slides.forEach(slideEl => {
    slideEl.classList.remove(params.slideActiveClass, params.slideNextClass, params.slidePrevClass);
  });
  let activeSlide;
  let prevSlide;
  let nextSlide;
  if (isVirtual) {
    if (params.loop) {
      let slideIndex = activeIndex - swiper.virtual.slidesBefore;
      if (slideIndex < 0) slideIndex = swiper.virtual.slides.length + slideIndex;
      if (slideIndex >= swiper.virtual.slides.length) slideIndex -= swiper.virtual.slides.length;
      activeSlide = getFilteredSlide(`[data-swiper-slide-index="${slideIndex}"]`);
    } else {
      activeSlide = getFilteredSlide(`[data-swiper-slide-index="${activeIndex}"]`);
    }
  } else {
    if (gridEnabled) {
      activeSlide = slides.filter(slideEl => slideEl.column === activeIndex)[0];
      nextSlide = slides.filter(slideEl => slideEl.column === activeIndex + 1)[0];
      prevSlide = slides.filter(slideEl => slideEl.column === activeIndex - 1)[0];
    } else {
      activeSlide = slides[activeIndex];
    }
  }
  if (activeSlide) {
    // Active classes
    activeSlide.classList.add(params.slideActiveClass);
    if (gridEnabled) {
      if (nextSlide) {
        nextSlide.classList.add(params.slideNextClass);
      }
      if (prevSlide) {
        prevSlide.classList.add(params.slidePrevClass);
      }
    } else {
      // Next Slide
      nextSlide = elementNextAll(activeSlide, `.${params.slideClass}, swiper-slide`)[0];
      if (params.loop && !nextSlide) {
        nextSlide = slides[0];
      }
      if (nextSlide) {
        nextSlide.classList.add(params.slideNextClass);
      }

      // Prev Slide
      prevSlide = elementPrevAll(activeSlide, `.${params.slideClass}, swiper-slide`)[0];
      if (params.loop && !prevSlide === 0) {
        prevSlide = slides[slides.length - 1];
      }
      if (prevSlide) {
        prevSlide.classList.add(params.slidePrevClass);
      }
    }
  }
  swiper.emitSlidesClasses();
}

const processLazyPreloader = (swiper, imageEl) => {
  if (!swiper || swiper.destroyed || !swiper.params) return;
  const slideSelector = () => swiper.isElement ? `swiper-slide` : `.${swiper.params.slideClass}`;
  const slideEl = imageEl.closest(slideSelector());
  if (slideEl) {
    let lazyEl = slideEl.querySelector(`.${swiper.params.lazyPreloaderClass}`);
    if (!lazyEl && swiper.isElement) {
      if (slideEl.shadowRoot) {
        lazyEl = slideEl.shadowRoot.querySelector(`.${swiper.params.lazyPreloaderClass}`);
      } else {
        // init later
        requestAnimationFrame(() => {
          if (slideEl.shadowRoot) {
            lazyEl = slideEl.shadowRoot.querySelector(`.${swiper.params.lazyPreloaderClass}`);
            if (lazyEl) lazyEl.remove();
          }
        });
      }
    }
    if (lazyEl) lazyEl.remove();
  }
};
const unlazy = (swiper, index) => {
  if (!swiper.slides[index]) return;
  const imageEl = swiper.slides[index].querySelector('[loading="lazy"]');
  if (imageEl) imageEl.removeAttribute('loading');
};
const preload = swiper => {
  if (!swiper || swiper.destroyed || !swiper.params) return;
  let amount = swiper.params.lazyPreloadPrevNext;
  const len = swiper.slides.length;
  if (!len || !amount || amount < 0) return;
  amount = Math.min(amount, len);
  const slidesPerView = swiper.params.slidesPerView === 'auto' ? swiper.slidesPerViewDynamic() : Math.ceil(swiper.params.slidesPerView);
  const activeIndex = swiper.activeIndex;
  if (swiper.params.grid && swiper.params.grid.rows > 1) {
    const activeColumn = activeIndex;
    const preloadColumns = [activeColumn - amount];
    preloadColumns.push(...Array.from({
      length: amount
    }).map((_, i) => {
      return activeColumn + slidesPerView + i;
    }));
    swiper.slides.forEach((slideEl, i) => {
      if (preloadColumns.includes(slideEl.column)) unlazy(swiper, i);
    });
    return;
  }
  const slideIndexLastInView = activeIndex + slidesPerView - 1;
  if (swiper.params.rewind || swiper.params.loop) {
    for (let i = activeIndex - amount; i <= slideIndexLastInView + amount; i += 1) {
      const realIndex = (i % len + len) % len;
      if (realIndex < activeIndex || realIndex > slideIndexLastInView) unlazy(swiper, realIndex);
    }
  } else {
    for (let i = Math.max(activeIndex - amount, 0); i <= Math.min(slideIndexLastInView + amount, len - 1); i += 1) {
      if (i !== activeIndex && (i > slideIndexLastInView || i < activeIndex)) {
        unlazy(swiper, i);
      }
    }
  }
};

function getActiveIndexByTranslate(swiper) {
  const {
    slidesGrid,
    params
  } = swiper;
  const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
  let activeIndex;
  for (let i = 0; i < slidesGrid.length; i += 1) {
    if (typeof slidesGrid[i + 1] !== 'undefined') {
      if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1] - (slidesGrid[i + 1] - slidesGrid[i]) / 2) {
        activeIndex = i;
      } else if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1]) {
        activeIndex = i + 1;
      }
    } else if (translate >= slidesGrid[i]) {
      activeIndex = i;
    }
  }
  // Normalize slideIndex
  if (params.normalizeSlideIndex) {
    if (activeIndex < 0 || typeof activeIndex === 'undefined') activeIndex = 0;
  }
  return activeIndex;
}
function updateActiveIndex(newActiveIndex) {
  const swiper = this;
  const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
  const {
    snapGrid,
    params,
    activeIndex: previousIndex,
    realIndex: previousRealIndex,
    snapIndex: previousSnapIndex
  } = swiper;
  let activeIndex = newActiveIndex;
  let snapIndex;
  const getVirtualRealIndex = aIndex => {
    let realIndex = aIndex - swiper.virtual.slidesBefore;
    if (realIndex < 0) {
      realIndex = swiper.virtual.slides.length + realIndex;
    }
    if (realIndex >= swiper.virtual.slides.length) {
      realIndex -= swiper.virtual.slides.length;
    }
    return realIndex;
  };
  if (typeof activeIndex === 'undefined') {
    activeIndex = getActiveIndexByTranslate(swiper);
  }
  if (snapGrid.indexOf(translate) >= 0) {
    snapIndex = snapGrid.indexOf(translate);
  } else {
    const skip = Math.min(params.slidesPerGroupSkip, activeIndex);
    snapIndex = skip + Math.floor((activeIndex - skip) / params.slidesPerGroup);
  }
  if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
  if (activeIndex === previousIndex && !swiper.params.loop) {
    if (snapIndex !== previousSnapIndex) {
      swiper.snapIndex = snapIndex;
      swiper.emit('snapIndexChange');
    }
    return;
  }
  if (activeIndex === previousIndex && swiper.params.loop && swiper.virtual && swiper.params.virtual.enabled) {
    swiper.realIndex = getVirtualRealIndex(activeIndex);
    return;
  }
  const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;

  // Get real index
  let realIndex;
  if (swiper.virtual && params.virtual.enabled && params.loop) {
    realIndex = getVirtualRealIndex(activeIndex);
  } else if (gridEnabled) {
    const firstSlideInColumn = swiper.slides.filter(slideEl => slideEl.column === activeIndex)[0];
    let activeSlideIndex = parseInt(firstSlideInColumn.getAttribute('data-swiper-slide-index'), 10);
    if (Number.isNaN(activeSlideIndex)) {
      activeSlideIndex = Math.max(swiper.slides.indexOf(firstSlideInColumn), 0);
    }
    realIndex = Math.floor(activeSlideIndex / params.grid.rows);
  } else if (swiper.slides[activeIndex]) {
    const slideIndex = swiper.slides[activeIndex].getAttribute('data-swiper-slide-index');
    if (slideIndex) {
      realIndex = parseInt(slideIndex, 10);
    } else {
      realIndex = activeIndex;
    }
  } else {
    realIndex = activeIndex;
  }
  Object.assign(swiper, {
    previousSnapIndex,
    snapIndex,
    previousRealIndex,
    realIndex,
    previousIndex,
    activeIndex
  });
  if (swiper.initialized) {
    preload(swiper);
  }
  swiper.emit('activeIndexChange');
  swiper.emit('snapIndexChange');
  if (swiper.initialized || swiper.params.runCallbacksOnInit) {
    if (previousRealIndex !== realIndex) {
      swiper.emit('realIndexChange');
    }
    swiper.emit('slideChange');
  }
}

function updateClickedSlide(el, path) {
  const swiper = this;
  const params = swiper.params;
  let slide = el.closest(`.${params.slideClass}, swiper-slide`);
  if (!slide && swiper.isElement && path && path.length > 1 && path.includes(el)) {
    [...path.slice(path.indexOf(el) + 1, path.length)].forEach(pathEl => {
      if (!slide && pathEl.matches && pathEl.matches(`.${params.slideClass}, swiper-slide`)) {
        slide = pathEl;
      }
    });
  }
  let slideFound = false;
  let slideIndex;
  if (slide) {
    for (let i = 0; i < swiper.slides.length; i += 1) {
      if (swiper.slides[i] === slide) {
        slideFound = true;
        slideIndex = i;
        break;
      }
    }
  }
  if (slide && slideFound) {
    swiper.clickedSlide = slide;
    if (swiper.virtual && swiper.params.virtual.enabled) {
      swiper.clickedIndex = parseInt(slide.getAttribute('data-swiper-slide-index'), 10);
    } else {
      swiper.clickedIndex = slideIndex;
    }
  } else {
    swiper.clickedSlide = undefined;
    swiper.clickedIndex = undefined;
    return;
  }
  if (params.slideToClickedSlide && swiper.clickedIndex !== undefined && swiper.clickedIndex !== swiper.activeIndex) {
    swiper.slideToClickedSlide();
  }
}

var update = {
  updateSize,
  updateSlides,
  updateAutoHeight,
  updateSlidesOffset,
  updateSlidesProgress,
  updateProgress,
  updateSlidesClasses,
  updateActiveIndex,
  updateClickedSlide
};

function getSwiperTranslate(axis) {
  if (axis === void 0) {
    axis = this.isHorizontal() ? 'x' : 'y';
  }
  const swiper = this;
  const {
    params,
    rtlTranslate: rtl,
    translate,
    wrapperEl
  } = swiper;
  if (params.virtualTranslate) {
    return rtl ? -translate : translate;
  }
  if (params.cssMode) {
    return translate;
  }
  let currentTranslate = getTranslate(wrapperEl, axis);
  currentTranslate += swiper.cssOverflowAdjustment();
  if (rtl) currentTranslate = -currentTranslate;
  return currentTranslate || 0;
}

function setTranslate(translate, byController) {
  const swiper = this;
  const {
    rtlTranslate: rtl,
    params,
    wrapperEl,
    progress
  } = swiper;
  let x = 0;
  let y = 0;
  const z = 0;
  if (swiper.isHorizontal()) {
    x = rtl ? -translate : translate;
  } else {
    y = translate;
  }
  if (params.roundLengths) {
    x = Math.floor(x);
    y = Math.floor(y);
  }
  swiper.previousTranslate = swiper.translate;
  swiper.translate = swiper.isHorizontal() ? x : y;
  if (params.cssMode) {
    wrapperEl[swiper.isHorizontal() ? 'scrollLeft' : 'scrollTop'] = swiper.isHorizontal() ? -x : -y;
  } else if (!params.virtualTranslate) {
    if (swiper.isHorizontal()) {
      x -= swiper.cssOverflowAdjustment();
    } else {
      y -= swiper.cssOverflowAdjustment();
    }
    wrapperEl.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
  }

  // Check if we need to update progress
  let newProgress;
  const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
  if (translatesDiff === 0) {
    newProgress = 0;
  } else {
    newProgress = (translate - swiper.minTranslate()) / translatesDiff;
  }
  if (newProgress !== progress) {
    swiper.updateProgress(translate);
  }
  swiper.emit('setTranslate', swiper.translate, byController);
}

function minTranslate() {
  return -this.snapGrid[0];
}

function maxTranslate() {
  return -this.snapGrid[this.snapGrid.length - 1];
}

function translateTo(translate, speed, runCallbacks, translateBounds, internal) {
  if (translate === void 0) {
    translate = 0;
  }
  if (speed === void 0) {
    speed = this.params.speed;
  }
  if (runCallbacks === void 0) {
    runCallbacks = true;
  }
  if (translateBounds === void 0) {
    translateBounds = true;
  }
  const swiper = this;
  const {
    params,
    wrapperEl
  } = swiper;
  if (swiper.animating && params.preventInteractionOnTransition) {
    return false;
  }
  const minTranslate = swiper.minTranslate();
  const maxTranslate = swiper.maxTranslate();
  let newTranslate;
  if (translateBounds && translate > minTranslate) newTranslate = minTranslate;else if (translateBounds && translate < maxTranslate) newTranslate = maxTranslate;else newTranslate = translate;

  // Update progress
  swiper.updateProgress(newTranslate);
  if (params.cssMode) {
    const isH = swiper.isHorizontal();
    if (speed === 0) {
      wrapperEl[isH ? 'scrollLeft' : 'scrollTop'] = -newTranslate;
    } else {
      if (!swiper.support.smoothScroll) {
        animateCSSModeScroll({
          swiper,
          targetPosition: -newTranslate,
          side: isH ? 'left' : 'top'
        });
        return true;
      }
      wrapperEl.scrollTo({
        [isH ? 'left' : 'top']: -newTranslate,
        behavior: 'smooth'
      });
    }
    return true;
  }
  if (speed === 0) {
    swiper.setTransition(0);
    swiper.setTranslate(newTranslate);
    if (runCallbacks) {
      swiper.emit('beforeTransitionStart', speed, internal);
      swiper.emit('transitionEnd');
    }
  } else {
    swiper.setTransition(speed);
    swiper.setTranslate(newTranslate);
    if (runCallbacks) {
      swiper.emit('beforeTransitionStart', speed, internal);
      swiper.emit('transitionStart');
    }
    if (!swiper.animating) {
      swiper.animating = true;
      if (!swiper.onTranslateToWrapperTransitionEnd) {
        swiper.onTranslateToWrapperTransitionEnd = function transitionEnd(e) {
          if (!swiper || swiper.destroyed) return;
          if (e.target !== this) return;
          swiper.wrapperEl.removeEventListener('transitionend', swiper.onTranslateToWrapperTransitionEnd);
          swiper.onTranslateToWrapperTransitionEnd = null;
          delete swiper.onTranslateToWrapperTransitionEnd;
          if (runCallbacks) {
            swiper.emit('transitionEnd');
          }
        };
      }
      swiper.wrapperEl.addEventListener('transitionend', swiper.onTranslateToWrapperTransitionEnd);
    }
  }
  return true;
}

var translate = {
  getTranslate: getSwiperTranslate,
  setTranslate,
  minTranslate,
  maxTranslate,
  translateTo
};

function setTransition(duration, byController) {
  const swiper = this;
  if (!swiper.params.cssMode) {
    swiper.wrapperEl.style.transitionDuration = `${duration}ms`;
    swiper.wrapperEl.style.transitionDelay = duration === 0 ? `0ms` : '';
  }
  swiper.emit('setTransition', duration, byController);
}

function transitionEmit(_ref) {
  let {
    swiper,
    runCallbacks,
    direction,
    step
  } = _ref;
  const {
    activeIndex,
    previousIndex
  } = swiper;
  let dir = direction;
  if (!dir) {
    if (activeIndex > previousIndex) dir = 'next';else if (activeIndex < previousIndex) dir = 'prev';else dir = 'reset';
  }
  swiper.emit(`transition${step}`);
  if (runCallbacks && activeIndex !== previousIndex) {
    if (dir === 'reset') {
      swiper.emit(`slideResetTransition${step}`);
      return;
    }
    swiper.emit(`slideChangeTransition${step}`);
    if (dir === 'next') {
      swiper.emit(`slideNextTransition${step}`);
    } else {
      swiper.emit(`slidePrevTransition${step}`);
    }
  }
}

function transitionStart(runCallbacks, direction) {
  if (runCallbacks === void 0) {
    runCallbacks = true;
  }
  const swiper = this;
  const {
    params
  } = swiper;
  if (params.cssMode) return;
  if (params.autoHeight) {
    swiper.updateAutoHeight();
  }
  transitionEmit({
    swiper,
    runCallbacks,
    direction,
    step: 'Start'
  });
}

function transitionEnd(runCallbacks, direction) {
  if (runCallbacks === void 0) {
    runCallbacks = true;
  }
  const swiper = this;
  const {
    params
  } = swiper;
  swiper.animating = false;
  if (params.cssMode) return;
  swiper.setTransition(0);
  transitionEmit({
    swiper,
    runCallbacks,
    direction,
    step: 'End'
  });
}

var transition = {
  setTransition,
  transitionStart,
  transitionEnd
};

function slideTo(index, speed, runCallbacks, internal, initial) {
  if (index === void 0) {
    index = 0;
  }
  if (speed === void 0) {
    speed = this.params.speed;
  }
  if (runCallbacks === void 0) {
    runCallbacks = true;
  }
  if (typeof index === 'string') {
    index = parseInt(index, 10);
  }
  const swiper = this;
  let slideIndex = index;
  if (slideIndex < 0) slideIndex = 0;
  const {
    params,
    snapGrid,
    slidesGrid,
    previousIndex,
    activeIndex,
    rtlTranslate: rtl,
    wrapperEl,
    enabled
  } = swiper;
  if (swiper.animating && params.preventInteractionOnTransition || !enabled && !internal && !initial) {
    return false;
  }
  const skip = Math.min(swiper.params.slidesPerGroupSkip, slideIndex);
  let snapIndex = skip + Math.floor((slideIndex - skip) / swiper.params.slidesPerGroup);
  if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
  const translate = -snapGrid[snapIndex];
  // Normalize slideIndex
  if (params.normalizeSlideIndex) {
    for (let i = 0; i < slidesGrid.length; i += 1) {
      const normalizedTranslate = -Math.floor(translate * 100);
      const normalizedGrid = Math.floor(slidesGrid[i] * 100);
      const normalizedGridNext = Math.floor(slidesGrid[i + 1] * 100);
      if (typeof slidesGrid[i + 1] !== 'undefined') {
        if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext - (normalizedGridNext - normalizedGrid) / 2) {
          slideIndex = i;
        } else if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext) {
          slideIndex = i + 1;
        }
      } else if (normalizedTranslate >= normalizedGrid) {
        slideIndex = i;
      }
    }
  }
  // Directions locks
  if (swiper.initialized && slideIndex !== activeIndex) {
    if (!swiper.allowSlideNext && (rtl ? translate > swiper.translate && translate > swiper.minTranslate() : translate < swiper.translate && translate < swiper.minTranslate())) {
      return false;
    }
    if (!swiper.allowSlidePrev && translate > swiper.translate && translate > swiper.maxTranslate()) {
      if ((activeIndex || 0) !== slideIndex) {
        return false;
      }
    }
  }
  if (slideIndex !== (previousIndex || 0) && runCallbacks) {
    swiper.emit('beforeSlideChangeStart');
  }

  // Update progress
  swiper.updateProgress(translate);
  let direction;
  if (slideIndex > activeIndex) direction = 'next';else if (slideIndex < activeIndex) direction = 'prev';else direction = 'reset';

  // Update Index
  if (rtl && -translate === swiper.translate || !rtl && translate === swiper.translate) {
    swiper.updateActiveIndex(slideIndex);
    // Update Height
    if (params.autoHeight) {
      swiper.updateAutoHeight();
    }
    swiper.updateSlidesClasses();
    if (params.effect !== 'slide') {
      swiper.setTranslate(translate);
    }
    if (direction !== 'reset') {
      swiper.transitionStart(runCallbacks, direction);
      swiper.transitionEnd(runCallbacks, direction);
    }
    return false;
  }
  if (params.cssMode) {
    const isH = swiper.isHorizontal();
    const t = rtl ? translate : -translate;
    if (speed === 0) {
      const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
      if (isVirtual) {
        swiper.wrapperEl.style.scrollSnapType = 'none';
        swiper._immediateVirtual = true;
      }
      if (isVirtual && !swiper._cssModeVirtualInitialSet && swiper.params.initialSlide > 0) {
        swiper._cssModeVirtualInitialSet = true;
        requestAnimationFrame(() => {
          wrapperEl[isH ? 'scrollLeft' : 'scrollTop'] = t;
        });
      } else {
        wrapperEl[isH ? 'scrollLeft' : 'scrollTop'] = t;
      }
      if (isVirtual) {
        requestAnimationFrame(() => {
          swiper.wrapperEl.style.scrollSnapType = '';
          swiper._immediateVirtual = false;
        });
      }
    } else {
      if (!swiper.support.smoothScroll) {
        animateCSSModeScroll({
          swiper,
          targetPosition: t,
          side: isH ? 'left' : 'top'
        });
        return true;
      }
      wrapperEl.scrollTo({
        [isH ? 'left' : 'top']: t,
        behavior: 'smooth'
      });
    }
    return true;
  }
  swiper.setTransition(speed);
  swiper.setTranslate(translate);
  swiper.updateActiveIndex(slideIndex);
  swiper.updateSlidesClasses();
  swiper.emit('beforeTransitionStart', speed, internal);
  swiper.transitionStart(runCallbacks, direction);
  if (speed === 0) {
    swiper.transitionEnd(runCallbacks, direction);
  } else if (!swiper.animating) {
    swiper.animating = true;
    if (!swiper.onSlideToWrapperTransitionEnd) {
      swiper.onSlideToWrapperTransitionEnd = function transitionEnd(e) {
        if (!swiper || swiper.destroyed) return;
        if (e.target !== this) return;
        swiper.wrapperEl.removeEventListener('transitionend', swiper.onSlideToWrapperTransitionEnd);
        swiper.onSlideToWrapperTransitionEnd = null;
        delete swiper.onSlideToWrapperTransitionEnd;
        swiper.transitionEnd(runCallbacks, direction);
      };
    }
    swiper.wrapperEl.addEventListener('transitionend', swiper.onSlideToWrapperTransitionEnd);
  }
  return true;
}

function slideToLoop(index, speed, runCallbacks, internal) {
  if (index === void 0) {
    index = 0;
  }
  if (speed === void 0) {
    speed = this.params.speed;
  }
  if (runCallbacks === void 0) {
    runCallbacks = true;
  }
  if (typeof index === 'string') {
    const indexAsNumber = parseInt(index, 10);
    index = indexAsNumber;
  }
  const swiper = this;
  const gridEnabled = swiper.grid && swiper.params.grid && swiper.params.grid.rows > 1;
  let newIndex = index;
  if (swiper.params.loop) {
    if (swiper.virtual && swiper.params.virtual.enabled) {
      // eslint-disable-next-line
      newIndex = newIndex + swiper.virtual.slidesBefore;
    } else {
      let targetSlideIndex;
      if (gridEnabled) {
        const slideIndex = newIndex * swiper.params.grid.rows;
        targetSlideIndex = swiper.slides.filter(slideEl => slideEl.getAttribute('data-swiper-slide-index') * 1 === slideIndex)[0].column;
      } else {
        targetSlideIndex = swiper.getSlideIndexByData(newIndex);
      }
      const cols = gridEnabled ? Math.ceil(swiper.slides.length / swiper.params.grid.rows) : swiper.slides.length;
      const {
        centeredSlides
      } = swiper.params;
      let slidesPerView = swiper.params.slidesPerView;
      if (slidesPerView === 'auto') {
        slidesPerView = swiper.slidesPerViewDynamic();
      } else {
        slidesPerView = Math.ceil(parseFloat(swiper.params.slidesPerView, 10));
        if (centeredSlides && slidesPerView % 2 === 0) {
          slidesPerView = slidesPerView + 1;
        }
      }
      let needLoopFix = cols - targetSlideIndex < slidesPerView;
      if (centeredSlides) {
        needLoopFix = needLoopFix || targetSlideIndex < Math.ceil(slidesPerView / 2);
      }
      if (needLoopFix) {
        const direction = centeredSlides ? targetSlideIndex < swiper.activeIndex ? 'prev' : 'next' : targetSlideIndex - swiper.activeIndex - 1 < swiper.params.slidesPerView ? 'next' : 'prev';
        swiper.loopFix({
          direction,
          slideTo: true,
          activeSlideIndex: direction === 'next' ? targetSlideIndex + 1 : targetSlideIndex - cols + 1,
          slideRealIndex: direction === 'next' ? swiper.realIndex : undefined
        });
      }
      if (gridEnabled) {
        const slideIndex = newIndex * swiper.params.grid.rows;
        newIndex = swiper.slides.filter(slideEl => slideEl.getAttribute('data-swiper-slide-index') * 1 === slideIndex)[0].column;
      } else {
        newIndex = swiper.getSlideIndexByData(newIndex);
      }
    }
  }
  requestAnimationFrame(() => {
    swiper.slideTo(newIndex, speed, runCallbacks, internal);
  });
  return swiper;
}

/* eslint no-unused-vars: "off" */
function slideNext(speed, runCallbacks, internal) {
  if (speed === void 0) {
    speed = this.params.speed;
  }
  if (runCallbacks === void 0) {
    runCallbacks = true;
  }
  const swiper = this;
  const {
    enabled,
    params,
    animating
  } = swiper;
  if (!enabled) return swiper;
  let perGroup = params.slidesPerGroup;
  if (params.slidesPerView === 'auto' && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
    perGroup = Math.max(swiper.slidesPerViewDynamic('current', true), 1);
  }
  const increment = swiper.activeIndex < params.slidesPerGroupSkip ? 1 : perGroup;
  const isVirtual = swiper.virtual && params.virtual.enabled;
  if (params.loop) {
    if (animating && !isVirtual && params.loopPreventsSliding) return false;
    swiper.loopFix({
      direction: 'next'
    });
    // eslint-disable-next-line
    swiper._clientLeft = swiper.wrapperEl.clientLeft;
    if (swiper.activeIndex === swiper.slides.length - 1 && params.cssMode) {
      requestAnimationFrame(() => {
        swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
      });
      return true;
    }
  }
  if (params.rewind && swiper.isEnd) {
    return swiper.slideTo(0, speed, runCallbacks, internal);
  }
  return swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
}

/* eslint no-unused-vars: "off" */
function slidePrev(speed, runCallbacks, internal) {
  if (speed === void 0) {
    speed = this.params.speed;
  }
  if (runCallbacks === void 0) {
    runCallbacks = true;
  }
  const swiper = this;
  const {
    params,
    snapGrid,
    slidesGrid,
    rtlTranslate,
    enabled,
    animating
  } = swiper;
  if (!enabled) return swiper;
  const isVirtual = swiper.virtual && params.virtual.enabled;
  if (params.loop) {
    if (animating && !isVirtual && params.loopPreventsSliding) return false;
    swiper.loopFix({
      direction: 'prev'
    });
    // eslint-disable-next-line
    swiper._clientLeft = swiper.wrapperEl.clientLeft;
  }
  const translate = rtlTranslate ? swiper.translate : -swiper.translate;
  function normalize(val) {
    if (val < 0) return -Math.floor(Math.abs(val));
    return Math.floor(val);
  }
  const normalizedTranslate = normalize(translate);
  const normalizedSnapGrid = snapGrid.map(val => normalize(val));
  let prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];
  if (typeof prevSnap === 'undefined' && params.cssMode) {
    let prevSnapIndex;
    snapGrid.forEach((snap, snapIndex) => {
      if (normalizedTranslate >= snap) {
        // prevSnap = snap;
        prevSnapIndex = snapIndex;
      }
    });
    if (typeof prevSnapIndex !== 'undefined') {
      prevSnap = snapGrid[prevSnapIndex > 0 ? prevSnapIndex - 1 : prevSnapIndex];
    }
  }
  let prevIndex = 0;
  if (typeof prevSnap !== 'undefined') {
    prevIndex = slidesGrid.indexOf(prevSnap);
    if (prevIndex < 0) prevIndex = swiper.activeIndex - 1;
    if (params.slidesPerView === 'auto' && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
      prevIndex = prevIndex - swiper.slidesPerViewDynamic('previous', true) + 1;
      prevIndex = Math.max(prevIndex, 0);
    }
  }
  if (params.rewind && swiper.isBeginning) {
    const lastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
    return swiper.slideTo(lastIndex, speed, runCallbacks, internal);
  } else if (params.loop && swiper.activeIndex === 0 && params.cssMode) {
    requestAnimationFrame(() => {
      swiper.slideTo(prevIndex, speed, runCallbacks, internal);
    });
    return true;
  }
  return swiper.slideTo(prevIndex, speed, runCallbacks, internal);
}

/* eslint no-unused-vars: "off" */
function slideReset(speed, runCallbacks, internal) {
  if (speed === void 0) {
    speed = this.params.speed;
  }
  if (runCallbacks === void 0) {
    runCallbacks = true;
  }
  const swiper = this;
  return swiper.slideTo(swiper.activeIndex, speed, runCallbacks, internal);
}

/* eslint no-unused-vars: "off" */
function slideToClosest(speed, runCallbacks, internal, threshold) {
  if (speed === void 0) {
    speed = this.params.speed;
  }
  if (runCallbacks === void 0) {
    runCallbacks = true;
  }
  if (threshold === void 0) {
    threshold = 0.5;
  }
  const swiper = this;
  let index = swiper.activeIndex;
  const skip = Math.min(swiper.params.slidesPerGroupSkip, index);
  const snapIndex = skip + Math.floor((index - skip) / swiper.params.slidesPerGroup);
  const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
  if (translate >= swiper.snapGrid[snapIndex]) {
    // The current translate is on or after the current snap index, so the choice
    // is between the current index and the one after it.
    const currentSnap = swiper.snapGrid[snapIndex];
    const nextSnap = swiper.snapGrid[snapIndex + 1];
    if (translate - currentSnap > (nextSnap - currentSnap) * threshold) {
      index += swiper.params.slidesPerGroup;
    }
  } else {
    // The current translate is before the current snap index, so the choice
    // is between the current index and the one before it.
    const prevSnap = swiper.snapGrid[snapIndex - 1];
    const currentSnap = swiper.snapGrid[snapIndex];
    if (translate - prevSnap <= (currentSnap - prevSnap) * threshold) {
      index -= swiper.params.slidesPerGroup;
    }
  }
  index = Math.max(index, 0);
  index = Math.min(index, swiper.slidesGrid.length - 1);
  return swiper.slideTo(index, speed, runCallbacks, internal);
}

function slideToClickedSlide() {
  const swiper = this;
  const {
    params,
    slidesEl
  } = swiper;
  const slidesPerView = params.slidesPerView === 'auto' ? swiper.slidesPerViewDynamic() : params.slidesPerView;
  let slideToIndex = swiper.clickedIndex;
  let realIndex;
  const slideSelector = swiper.isElement ? `swiper-slide` : `.${params.slideClass}`;
  if (params.loop) {
    if (swiper.animating) return;
    realIndex = parseInt(swiper.clickedSlide.getAttribute('data-swiper-slide-index'), 10);
    if (params.centeredSlides) {
      if (slideToIndex < swiper.loopedSlides - slidesPerView / 2 || slideToIndex > swiper.slides.length - swiper.loopedSlides + slidesPerView / 2) {
        swiper.loopFix();
        slideToIndex = swiper.getSlideIndex(elementChildren(slidesEl, `${slideSelector}[data-swiper-slide-index="${realIndex}"]`)[0]);
        nextTick(() => {
          swiper.slideTo(slideToIndex);
        });
      } else {
        swiper.slideTo(slideToIndex);
      }
    } else if (slideToIndex > swiper.slides.length - slidesPerView) {
      swiper.loopFix();
      slideToIndex = swiper.getSlideIndex(elementChildren(slidesEl, `${slideSelector}[data-swiper-slide-index="${realIndex}"]`)[0]);
      nextTick(() => {
        swiper.slideTo(slideToIndex);
      });
    } else {
      swiper.slideTo(slideToIndex);
    }
  } else {
    swiper.slideTo(slideToIndex);
  }
}

var slide = {
  slideTo,
  slideToLoop,
  slideNext,
  slidePrev,
  slideReset,
  slideToClosest,
  slideToClickedSlide
};

function loopCreate(slideRealIndex) {
  const swiper = this;
  const {
    params,
    slidesEl
  } = swiper;
  if (!params.loop || swiper.virtual && swiper.params.virtual.enabled) return;
  const initSlides = () => {
    const slides = elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`);
    slides.forEach((el, index) => {
      el.setAttribute('data-swiper-slide-index', index);
    });
  };
  const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
  const slidesPerGroup = params.slidesPerGroup * (gridEnabled ? params.grid.rows : 1);
  const shouldFillGroup = swiper.slides.length % slidesPerGroup !== 0;
  const shouldFillGrid = gridEnabled && swiper.slides.length % params.grid.rows !== 0;
  const addBlankSlides = amountOfSlides => {
    for (let i = 0; i < amountOfSlides; i += 1) {
      const slideEl = swiper.isElement ? createElement('swiper-slide', [params.slideBlankClass]) : createElement('div', [params.slideClass, params.slideBlankClass]);
      swiper.slidesEl.append(slideEl);
    }
  };
  if (shouldFillGroup) {
    if (params.loopAddBlankSlides) {
      const slidesToAdd = slidesPerGroup - swiper.slides.length % slidesPerGroup;
      addBlankSlides(slidesToAdd);
      swiper.recalcSlides();
      swiper.updateSlides();
    } else {
      showWarning('Swiper Loop Warning: The number of slides is not even to slidesPerGroup, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)');
    }
    initSlides();
  } else if (shouldFillGrid) {
    if (params.loopAddBlankSlides) {
      const slidesToAdd = params.grid.rows - swiper.slides.length % params.grid.rows;
      addBlankSlides(slidesToAdd);
      swiper.recalcSlides();
      swiper.updateSlides();
    } else {
      showWarning('Swiper Loop Warning: The number of slides is not even to grid.rows, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)');
    }
    initSlides();
  } else {
    initSlides();
  }
  swiper.loopFix({
    slideRealIndex,
    direction: params.centeredSlides ? undefined : 'next'
  });
}

function loopFix(_temp) {
  let {
    slideRealIndex,
    slideTo = true,
    direction,
    setTranslate,
    activeSlideIndex,
    byController,
    byMousewheel
  } = _temp === void 0 ? {} : _temp;
  const swiper = this;
  if (!swiper.params.loop) return;
  swiper.emit('beforeLoopFix');
  const {
    slides,
    allowSlidePrev,
    allowSlideNext,
    slidesEl,
    params
  } = swiper;
  const {
    centeredSlides
  } = params;
  swiper.allowSlidePrev = true;
  swiper.allowSlideNext = true;
  if (swiper.virtual && params.virtual.enabled) {
    if (slideTo) {
      if (!params.centeredSlides && swiper.snapIndex === 0) {
        swiper.slideTo(swiper.virtual.slides.length, 0, false, true);
      } else if (params.centeredSlides && swiper.snapIndex < params.slidesPerView) {
        swiper.slideTo(swiper.virtual.slides.length + swiper.snapIndex, 0, false, true);
      } else if (swiper.snapIndex === swiper.snapGrid.length - 1) {
        swiper.slideTo(swiper.virtual.slidesBefore, 0, false, true);
      }
    }
    swiper.allowSlidePrev = allowSlidePrev;
    swiper.allowSlideNext = allowSlideNext;
    swiper.emit('loopFix');
    return;
  }
  let slidesPerView = params.slidesPerView;
  if (slidesPerView === 'auto') {
    slidesPerView = swiper.slidesPerViewDynamic();
  } else {
    slidesPerView = Math.ceil(parseFloat(params.slidesPerView, 10));
    if (centeredSlides && slidesPerView % 2 === 0) {
      slidesPerView = slidesPerView + 1;
    }
  }
  const slidesPerGroup = params.slidesPerGroupAuto ? slidesPerView : params.slidesPerGroup;
  let loopedSlides = slidesPerGroup;
  if (loopedSlides % slidesPerGroup !== 0) {
    loopedSlides += slidesPerGroup - loopedSlides % slidesPerGroup;
  }
  loopedSlides += params.loopAdditionalSlides;
  swiper.loopedSlides = loopedSlides;
  const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
  if (slides.length < slidesPerView + loopedSlides) {
    showWarning('Swiper Loop Warning: The number of slides is not enough for loop mode, it will be disabled and not function properly. You need to add more slides (or make duplicates) or lower the values of slidesPerView and slidesPerGroup parameters');
  } else if (gridEnabled && params.grid.fill === 'row') {
    showWarning('Swiper Loop Warning: Loop mode is not compatible with grid.fill = `row`');
  }
  const prependSlidesIndexes = [];
  const appendSlidesIndexes = [];
  let activeIndex = swiper.activeIndex;
  if (typeof activeSlideIndex === 'undefined') {
    activeSlideIndex = swiper.getSlideIndex(slides.filter(el => el.classList.contains(params.slideActiveClass))[0]);
  } else {
    activeIndex = activeSlideIndex;
  }
  const isNext = direction === 'next' || !direction;
  const isPrev = direction === 'prev' || !direction;
  let slidesPrepended = 0;
  let slidesAppended = 0;
  const cols = gridEnabled ? Math.ceil(slides.length / params.grid.rows) : slides.length;
  const activeColIndex = gridEnabled ? slides[activeSlideIndex].column : activeSlideIndex;
  const activeColIndexWithShift = activeColIndex + (centeredSlides && typeof setTranslate === 'undefined' ? -slidesPerView / 2 + 0.5 : 0);
  // prepend last slides before start
  if (activeColIndexWithShift < loopedSlides) {
    slidesPrepended = Math.max(loopedSlides - activeColIndexWithShift, slidesPerGroup);
    for (let i = 0; i < loopedSlides - activeColIndexWithShift; i += 1) {
      const index = i - Math.floor(i / cols) * cols;
      if (gridEnabled) {
        const colIndexToPrepend = cols - index - 1;
        for (let i = slides.length - 1; i >= 0; i -= 1) {
          if (slides[i].column === colIndexToPrepend) prependSlidesIndexes.push(i);
        }
        // slides.forEach((slide, slideIndex) => {
        //   if (slide.column === colIndexToPrepend) prependSlidesIndexes.push(slideIndex);
        // });
      } else {
        prependSlidesIndexes.push(cols - index - 1);
      }
    }
  } else if (activeColIndexWithShift + slidesPerView > cols - loopedSlides) {
    slidesAppended = Math.max(activeColIndexWithShift - (cols - loopedSlides * 2), slidesPerGroup);
    for (let i = 0; i < slidesAppended; i += 1) {
      const index = i - Math.floor(i / cols) * cols;
      if (gridEnabled) {
        slides.forEach((slide, slideIndex) => {
          if (slide.column === index) appendSlidesIndexes.push(slideIndex);
        });
      } else {
        appendSlidesIndexes.push(index);
      }
    }
  }
  swiper.__preventObserver__ = true;
  requestAnimationFrame(() => {
    swiper.__preventObserver__ = false;
  });
  if (isPrev) {
    prependSlidesIndexes.forEach(index => {
      slides[index].swiperLoopMoveDOM = true;
      slidesEl.prepend(slides[index]);
      slides[index].swiperLoopMoveDOM = false;
    });
  }
  if (isNext) {
    appendSlidesIndexes.forEach(index => {
      slides[index].swiperLoopMoveDOM = true;
      slidesEl.append(slides[index]);
      slides[index].swiperLoopMoveDOM = false;
    });
  }
  swiper.recalcSlides();
  if (params.slidesPerView === 'auto') {
    swiper.updateSlides();
  } else if (gridEnabled && (prependSlidesIndexes.length > 0 && isPrev || appendSlidesIndexes.length > 0 && isNext)) {
    swiper.slides.forEach((slide, slideIndex) => {
      swiper.grid.updateSlide(slideIndex, slide, swiper.slides);
    });
  }
  if (params.watchSlidesProgress) {
    swiper.updateSlidesOffset();
  }
  if (slideTo) {
    if (prependSlidesIndexes.length > 0 && isPrev) {
      if (typeof slideRealIndex === 'undefined') {
        const currentSlideTranslate = swiper.slidesGrid[activeIndex];
        const newSlideTranslate = swiper.slidesGrid[activeIndex + slidesPrepended];
        const diff = newSlideTranslate - currentSlideTranslate;
        if (byMousewheel) {
          swiper.setTranslate(swiper.translate - diff);
        } else {
          swiper.slideTo(activeIndex + slidesPrepended, 0, false, true);
          if (setTranslate) {
            swiper.touchEventsData.startTranslate = swiper.touchEventsData.startTranslate - diff;
            swiper.touchEventsData.currentTranslate = swiper.touchEventsData.currentTranslate - diff;
          }
        }
      } else {
        if (setTranslate) {
          const shift = gridEnabled ? prependSlidesIndexes.length / params.grid.rows : prependSlidesIndexes.length;
          swiper.slideTo(swiper.activeIndex + shift, 0, false, true);
          swiper.touchEventsData.currentTranslate = swiper.translate;
        }
      }
    } else if (appendSlidesIndexes.length > 0 && isNext) {
      if (typeof slideRealIndex === 'undefined') {
        const currentSlideTranslate = swiper.slidesGrid[activeIndex];
        const newSlideTranslate = swiper.slidesGrid[activeIndex - slidesAppended];
        const diff = newSlideTranslate - currentSlideTranslate;
        if (byMousewheel) {
          swiper.setTranslate(swiper.translate - diff);
        } else {
          swiper.slideTo(activeIndex - slidesAppended, 0, false, true);
          if (setTranslate) {
            swiper.touchEventsData.startTranslate = swiper.touchEventsData.startTranslate - diff;
            swiper.touchEventsData.currentTranslate = swiper.touchEventsData.currentTranslate - diff;
          }
        }
      } else {
        const shift = gridEnabled ? appendSlidesIndexes.length / params.grid.rows : appendSlidesIndexes.length;
        swiper.slideTo(swiper.activeIndex - shift, 0, false, true);
      }
    }
  }
  swiper.allowSlidePrev = allowSlidePrev;
  swiper.allowSlideNext = allowSlideNext;
  if (swiper.controller && swiper.controller.control && !byController) {
    const loopParams = {
      slideRealIndex,
      direction,
      setTranslate,
      activeSlideIndex,
      byController: true
    };
    if (Array.isArray(swiper.controller.control)) {
      swiper.controller.control.forEach(c => {
        if (!c.destroyed && c.params.loop) c.loopFix({
          ...loopParams,
          slideTo: c.params.slidesPerView === params.slidesPerView ? slideTo : false
        });
      });
    } else if (swiper.controller.control instanceof swiper.constructor && swiper.controller.control.params.loop) {
      swiper.controller.control.loopFix({
        ...loopParams,
        slideTo: swiper.controller.control.params.slidesPerView === params.slidesPerView ? slideTo : false
      });
    }
  }
  swiper.emit('loopFix');
}

function loopDestroy() {
  const swiper = this;
  const {
    params,
    slidesEl
  } = swiper;
  if (!params.loop || swiper.virtual && swiper.params.virtual.enabled) return;
  swiper.recalcSlides();
  const newSlidesOrder = [];
  swiper.slides.forEach(slideEl => {
    const index = typeof slideEl.swiperSlideIndex === 'undefined' ? slideEl.getAttribute('data-swiper-slide-index') * 1 : slideEl.swiperSlideIndex;
    newSlidesOrder[index] = slideEl;
  });
  swiper.slides.forEach(slideEl => {
    slideEl.removeAttribute('data-swiper-slide-index');
  });
  newSlidesOrder.forEach(slideEl => {
    slidesEl.append(slideEl);
  });
  swiper.recalcSlides();
  swiper.slideTo(swiper.realIndex, 0);
}

var loop = {
  loopCreate,
  loopFix,
  loopDestroy
};

function setGrabCursor(moving) {
  const swiper = this;
  if (!swiper.params.simulateTouch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
  const el = swiper.params.touchEventsTarget === 'container' ? swiper.el : swiper.wrapperEl;
  if (swiper.isElement) {
    swiper.__preventObserver__ = true;
  }
  el.style.cursor = 'move';
  el.style.cursor = moving ? 'grabbing' : 'grab';
  if (swiper.isElement) {
    requestAnimationFrame(() => {
      swiper.__preventObserver__ = false;
    });
  }
}

function unsetGrabCursor() {
  const swiper = this;
  if (swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) {
    return;
  }
  if (swiper.isElement) {
    swiper.__preventObserver__ = true;
  }
  swiper[swiper.params.touchEventsTarget === 'container' ? 'el' : 'wrapperEl'].style.cursor = '';
  if (swiper.isElement) {
    requestAnimationFrame(() => {
      swiper.__preventObserver__ = false;
    });
  }
}

var grabCursor = {
  setGrabCursor,
  unsetGrabCursor
};

// Modified from https://stackoverflow.com/questions/54520554/custom-element-getrootnode-closest-function-crossing-multiple-parent-shadowd
function closestElement(selector, base) {
  if (base === void 0) {
    base = this;
  }
  function __closestFrom(el) {
    if (!el || el === getDocument() || el === getWindow()) return null;
    if (el.assignedSlot) el = el.assignedSlot;
    const found = el.closest(selector);
    if (!found && !el.getRootNode) {
      return null;
    }
    return found || __closestFrom(el.getRootNode().host);
  }
  return __closestFrom(base);
}
function preventEdgeSwipe(swiper, event, startX) {
  const window = getWindow();
  const {
    params
  } = swiper;
  const edgeSwipeDetection = params.edgeSwipeDetection;
  const edgeSwipeThreshold = params.edgeSwipeThreshold;
  if (edgeSwipeDetection && (startX <= edgeSwipeThreshold || startX >= window.innerWidth - edgeSwipeThreshold)) {
    if (edgeSwipeDetection === 'prevent') {
      event.preventDefault();
      return true;
    }
    return false;
  }
  return true;
}
function onTouchStart(event) {
  const swiper = this;
  const document = getDocument();
  let e = event;
  if (e.originalEvent) e = e.originalEvent;
  const data = swiper.touchEventsData;
  if (e.type === 'pointerdown') {
    if (data.pointerId !== null && data.pointerId !== e.pointerId) {
      return;
    }
    data.pointerId = e.pointerId;
  } else if (e.type === 'touchstart' && e.targetTouches.length === 1) {
    data.touchId = e.targetTouches[0].identifier;
  }
  if (e.type === 'touchstart') {
    // don't proceed touch event
    preventEdgeSwipe(swiper, e, e.targetTouches[0].pageX);
    return;
  }
  const {
    params,
    touches,
    enabled
  } = swiper;
  if (!enabled) return;
  if (!params.simulateTouch && e.pointerType === 'mouse') return;
  if (swiper.animating && params.preventInteractionOnTransition) {
    return;
  }
  if (!swiper.animating && params.cssMode && params.loop) {
    swiper.loopFix();
  }
  let targetEl = e.target;
  if (params.touchEventsTarget === 'wrapper') {
    if (!swiper.wrapperEl.contains(targetEl)) return;
  }
  if ('which' in e && e.which === 3) return;
  if ('button' in e && e.button > 0) return;
  if (data.isTouched && data.isMoved) return;

  // change target el for shadow root component
  const swipingClassHasValue = !!params.noSwipingClass && params.noSwipingClass !== '';
  // eslint-disable-next-line
  const eventPath = e.composedPath ? e.composedPath() : e.path;
  if (swipingClassHasValue && e.target && e.target.shadowRoot && eventPath) {
    targetEl = eventPath[0];
  }
  const noSwipingSelector = params.noSwipingSelector ? params.noSwipingSelector : `.${params.noSwipingClass}`;
  const isTargetShadow = !!(e.target && e.target.shadowRoot);

  // use closestElement for shadow root element to get the actual closest for nested shadow root element
  if (params.noSwiping && (isTargetShadow ? closestElement(noSwipingSelector, targetEl) : targetEl.closest(noSwipingSelector))) {
    swiper.allowClick = true;
    return;
  }
  if (params.swipeHandler) {
    if (!targetEl.closest(params.swipeHandler)) return;
  }
  touches.currentX = e.pageX;
  touches.currentY = e.pageY;
  const startX = touches.currentX;
  const startY = touches.currentY;

  // Do NOT start if iOS edge swipe is detected. Otherwise iOS app cannot swipe-to-go-back anymore

  if (!preventEdgeSwipe(swiper, e, startX)) {
    return;
  }
  Object.assign(data, {
    isTouched: true,
    isMoved: false,
    allowTouchCallbacks: true,
    isScrolling: undefined,
    startMoving: undefined
  });
  touches.startX = startX;
  touches.startY = startY;
  data.touchStartTime = now();
  swiper.allowClick = true;
  swiper.updateSize();
  swiper.swipeDirection = undefined;
  if (params.threshold > 0) data.allowThresholdMove = false;
  let preventDefault = true;
  if (targetEl.matches(data.focusableElements)) {
    preventDefault = false;
    if (targetEl.nodeName === 'SELECT') {
      data.isTouched = false;
    }
  }
  if (document.activeElement && document.activeElement.matches(data.focusableElements) && document.activeElement !== targetEl) {
    document.activeElement.blur();
  }
  const shouldPreventDefault = preventDefault && swiper.allowTouchMove && params.touchStartPreventDefault;
  if ((params.touchStartForcePreventDefault || shouldPreventDefault) && !targetEl.isContentEditable) {
    e.preventDefault();
  }
  if (params.freeMode && params.freeMode.enabled && swiper.freeMode && swiper.animating && !params.cssMode) {
    swiper.freeMode.onTouchStart();
  }
  swiper.emit('touchStart', e);
}

function onTouchMove(event) {
  const document = getDocument();
  const swiper = this;
  const data = swiper.touchEventsData;
  const {
    params,
    touches,
    rtlTranslate: rtl,
    enabled
  } = swiper;
  if (!enabled) return;
  if (!params.simulateTouch && event.pointerType === 'mouse') return;
  let e = event;
  if (e.originalEvent) e = e.originalEvent;
  if (e.type === 'pointermove') {
    if (data.touchId !== null) return; // return from pointer if we use touch
    const id = e.pointerId;
    if (id !== data.pointerId) return;
  }
  let targetTouch;
  if (e.type === 'touchmove') {
    targetTouch = [...e.changedTouches].filter(t => t.identifier === data.touchId)[0];
    if (!targetTouch || targetTouch.identifier !== data.touchId) return;
  } else {
    targetTouch = e;
  }
  if (!data.isTouched) {
    if (data.startMoving && data.isScrolling) {
      swiper.emit('touchMoveOpposite', e);
    }
    return;
  }
  const pageX = targetTouch.pageX;
  const pageY = targetTouch.pageY;
  if (e.preventedByNestedSwiper) {
    touches.startX = pageX;
    touches.startY = pageY;
    return;
  }
  if (!swiper.allowTouchMove) {
    if (!e.target.matches(data.focusableElements)) {
      swiper.allowClick = false;
    }
    if (data.isTouched) {
      Object.assign(touches, {
        startX: pageX,
        startY: pageY,
        currentX: pageX,
        currentY: pageY
      });
      data.touchStartTime = now();
    }
    return;
  }
  if (params.touchReleaseOnEdges && !params.loop) {
    if (swiper.isVertical()) {
      // Vertical
      if (pageY < touches.startY && swiper.translate <= swiper.maxTranslate() || pageY > touches.startY && swiper.translate >= swiper.minTranslate()) {
        data.isTouched = false;
        data.isMoved = false;
        return;
      }
    } else if (pageX < touches.startX && swiper.translate <= swiper.maxTranslate() || pageX > touches.startX && swiper.translate >= swiper.minTranslate()) {
      return;
    }
  }
  if (document.activeElement) {
    if (e.target === document.activeElement && e.target.matches(data.focusableElements)) {
      data.isMoved = true;
      swiper.allowClick = false;
      return;
    }
  }
  if (data.allowTouchCallbacks) {
    swiper.emit('touchMove', e);
  }
  touches.previousX = touches.currentX;
  touches.previousY = touches.currentY;
  touches.currentX = pageX;
  touches.currentY = pageY;
  const diffX = touches.currentX - touches.startX;
  const diffY = touches.currentY - touches.startY;
  if (swiper.params.threshold && Math.sqrt(diffX ** 2 + diffY ** 2) < swiper.params.threshold) return;
  if (typeof data.isScrolling === 'undefined') {
    let touchAngle;
    if (swiper.isHorizontal() && touches.currentY === touches.startY || swiper.isVertical() && touches.currentX === touches.startX) {
      data.isScrolling = false;
    } else {
      // eslint-disable-next-line
      if (diffX * diffX + diffY * diffY >= 25) {
        touchAngle = Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180 / Math.PI;
        data.isScrolling = swiper.isHorizontal() ? touchAngle > params.touchAngle : 90 - touchAngle > params.touchAngle;
      }
    }
  }
  if (data.isScrolling) {
    swiper.emit('touchMoveOpposite', e);
  }
  if (typeof data.startMoving === 'undefined') {
    if (touches.currentX !== touches.startX || touches.currentY !== touches.startY) {
      data.startMoving = true;
    }
  }
  if (data.isScrolling) {
    data.isTouched = false;
    return;
  }
  if (!data.startMoving) {
    return;
  }
  swiper.allowClick = false;
  if (!params.cssMode && e.cancelable) {
    e.preventDefault();
  }
  if (params.touchMoveStopPropagation && !params.nested) {
    e.stopPropagation();
  }
  let diff = swiper.isHorizontal() ? diffX : diffY;
  let touchesDiff = swiper.isHorizontal() ? touches.currentX - touches.previousX : touches.currentY - touches.previousY;
  if (params.oneWayMovement) {
    diff = Math.abs(diff) * (rtl ? 1 : -1);
    touchesDiff = Math.abs(touchesDiff) * (rtl ? 1 : -1);
  }
  touches.diff = diff;
  diff *= params.touchRatio;
  if (rtl) {
    diff = -diff;
    touchesDiff = -touchesDiff;
  }
  const prevTouchesDirection = swiper.touchesDirection;
  swiper.swipeDirection = diff > 0 ? 'prev' : 'next';
  swiper.touchesDirection = touchesDiff > 0 ? 'prev' : 'next';
  const isLoop = swiper.params.loop && !params.cssMode;
  const allowLoopFix = swiper.touchesDirection === 'next' && swiper.allowSlideNext || swiper.touchesDirection === 'prev' && swiper.allowSlidePrev;
  if (!data.isMoved) {
    if (isLoop && allowLoopFix) {
      swiper.loopFix({
        direction: swiper.swipeDirection
      });
    }
    data.startTranslate = swiper.getTranslate();
    swiper.setTransition(0);
    if (swiper.animating) {
      const evt = new window.CustomEvent('transitionend', {
        bubbles: true,
        cancelable: true
      });
      swiper.wrapperEl.dispatchEvent(evt);
    }
    data.allowMomentumBounce = false;
    // Grab Cursor
    if (params.grabCursor && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
      swiper.setGrabCursor(true);
    }
    swiper.emit('sliderFirstMove', e);
  }
  let loopFixed;
  new Date().getTime();
  if (data.isMoved && data.allowThresholdMove && prevTouchesDirection !== swiper.touchesDirection && isLoop && allowLoopFix && Math.abs(diff) >= 1) {
    Object.assign(touches, {
      startX: pageX,
      startY: pageY,
      currentX: pageX,
      currentY: pageY,
      startTranslate: data.currentTranslate
    });
    data.loopSwapReset = true;
    data.startTranslate = data.currentTranslate;
    return;
  }
  swiper.emit('sliderMove', e);
  data.isMoved = true;
  data.currentTranslate = diff + data.startTranslate;
  let disableParentSwiper = true;
  let resistanceRatio = params.resistanceRatio;
  if (params.touchReleaseOnEdges) {
    resistanceRatio = 0;
  }
  if (diff > 0) {
    if (isLoop && allowLoopFix && !loopFixed && data.allowThresholdMove && data.currentTranslate > (params.centeredSlides ? swiper.minTranslate() - swiper.slidesSizesGrid[swiper.activeIndex + 1] : swiper.minTranslate())) {
      swiper.loopFix({
        direction: 'prev',
        setTranslate: true,
        activeSlideIndex: 0
      });
    }
    if (data.currentTranslate > swiper.minTranslate()) {
      disableParentSwiper = false;
      if (params.resistance) {
        data.currentTranslate = swiper.minTranslate() - 1 + (-swiper.minTranslate() + data.startTranslate + diff) ** resistanceRatio;
      }
    }
  } else if (diff < 0) {
    if (isLoop && allowLoopFix && !loopFixed && data.allowThresholdMove && data.currentTranslate < (params.centeredSlides ? swiper.maxTranslate() + swiper.slidesSizesGrid[swiper.slidesSizesGrid.length - 1] : swiper.maxTranslate())) {
      swiper.loopFix({
        direction: 'next',
        setTranslate: true,
        activeSlideIndex: swiper.slides.length - (params.slidesPerView === 'auto' ? swiper.slidesPerViewDynamic() : Math.ceil(parseFloat(params.slidesPerView, 10)))
      });
    }
    if (data.currentTranslate < swiper.maxTranslate()) {
      disableParentSwiper = false;
      if (params.resistance) {
        data.currentTranslate = swiper.maxTranslate() + 1 - (swiper.maxTranslate() - data.startTranslate - diff) ** resistanceRatio;
      }
    }
  }
  if (disableParentSwiper) {
    e.preventedByNestedSwiper = true;
  }

  // Directions locks
  if (!swiper.allowSlideNext && swiper.swipeDirection === 'next' && data.currentTranslate < data.startTranslate) {
    data.currentTranslate = data.startTranslate;
  }
  if (!swiper.allowSlidePrev && swiper.swipeDirection === 'prev' && data.currentTranslate > data.startTranslate) {
    data.currentTranslate = data.startTranslate;
  }
  if (!swiper.allowSlidePrev && !swiper.allowSlideNext) {
    data.currentTranslate = data.startTranslate;
  }

  // Threshold
  if (params.threshold > 0) {
    if (Math.abs(diff) > params.threshold || data.allowThresholdMove) {
      if (!data.allowThresholdMove) {
        data.allowThresholdMove = true;
        touches.startX = touches.currentX;
        touches.startY = touches.currentY;
        data.currentTranslate = data.startTranslate;
        touches.diff = swiper.isHorizontal() ? touches.currentX - touches.startX : touches.currentY - touches.startY;
        return;
      }
    } else {
      data.currentTranslate = data.startTranslate;
      return;
    }
  }
  if (!params.followFinger || params.cssMode) return;

  // Update active index in free mode
  if (params.freeMode && params.freeMode.enabled && swiper.freeMode || params.watchSlidesProgress) {
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();
  }
  if (params.freeMode && params.freeMode.enabled && swiper.freeMode) {
    swiper.freeMode.onTouchMove();
  }
  // Update progress
  swiper.updateProgress(data.currentTranslate);
  // Update translate
  swiper.setTranslate(data.currentTranslate);
}

function onTouchEnd(event) {
  const swiper = this;
  const data = swiper.touchEventsData;
  let e = event;
  if (e.originalEvent) e = e.originalEvent;
  let targetTouch;
  const isTouchEvent = e.type === 'touchend' || e.type === 'touchcancel';
  if (!isTouchEvent) {
    if (data.touchId !== null) return; // return from pointer if we use touch
    if (e.pointerId !== data.pointerId) return;
    targetTouch = e;
  } else {
    targetTouch = [...e.changedTouches].filter(t => t.identifier === data.touchId)[0];
    if (!targetTouch || targetTouch.identifier !== data.touchId) return;
  }
  if (['pointercancel', 'pointerout', 'pointerleave', 'contextmenu'].includes(e.type)) {
    const proceed = ['pointercancel', 'contextmenu'].includes(e.type) && (swiper.browser.isSafari || swiper.browser.isWebView);
    if (!proceed) {
      return;
    }
  }
  data.pointerId = null;
  data.touchId = null;
  const {
    params,
    touches,
    rtlTranslate: rtl,
    slidesGrid,
    enabled
  } = swiper;
  if (!enabled) return;
  if (!params.simulateTouch && e.pointerType === 'mouse') return;
  if (data.allowTouchCallbacks) {
    swiper.emit('touchEnd', e);
  }
  data.allowTouchCallbacks = false;
  if (!data.isTouched) {
    if (data.isMoved && params.grabCursor) {
      swiper.setGrabCursor(false);
    }
    data.isMoved = false;
    data.startMoving = false;
    return;
  }

  // Return Grab Cursor
  if (params.grabCursor && data.isMoved && data.isTouched && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
    swiper.setGrabCursor(false);
  }

  // Time diff
  const touchEndTime = now();
  const timeDiff = touchEndTime - data.touchStartTime;

  // Tap, doubleTap, Click
  if (swiper.allowClick) {
    const pathTree = e.path || e.composedPath && e.composedPath();
    swiper.updateClickedSlide(pathTree && pathTree[0] || e.target, pathTree);
    swiper.emit('tap click', e);
    if (timeDiff < 300 && touchEndTime - data.lastClickTime < 300) {
      swiper.emit('doubleTap doubleClick', e);
    }
  }
  data.lastClickTime = now();
  nextTick(() => {
    if (!swiper.destroyed) swiper.allowClick = true;
  });
  if (!data.isTouched || !data.isMoved || !swiper.swipeDirection || touches.diff === 0 && !data.loopSwapReset || data.currentTranslate === data.startTranslate && !data.loopSwapReset) {
    data.isTouched = false;
    data.isMoved = false;
    data.startMoving = false;
    return;
  }
  data.isTouched = false;
  data.isMoved = false;
  data.startMoving = false;
  let currentPos;
  if (params.followFinger) {
    currentPos = rtl ? swiper.translate : -swiper.translate;
  } else {
    currentPos = -data.currentTranslate;
  }
  if (params.cssMode) {
    return;
  }
  if (params.freeMode && params.freeMode.enabled) {
    swiper.freeMode.onTouchEnd({
      currentPos
    });
    return;
  }

  // Find current slide
  const swipeToLast = currentPos >= -swiper.maxTranslate() && !swiper.params.loop;
  let stopIndex = 0;
  let groupSize = swiper.slidesSizesGrid[0];
  for (let i = 0; i < slidesGrid.length; i += i < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup) {
    const increment = i < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
    if (typeof slidesGrid[i + increment] !== 'undefined') {
      if (swipeToLast || currentPos >= slidesGrid[i] && currentPos < slidesGrid[i + increment]) {
        stopIndex = i;
        groupSize = slidesGrid[i + increment] - slidesGrid[i];
      }
    } else if (swipeToLast || currentPos >= slidesGrid[i]) {
      stopIndex = i;
      groupSize = slidesGrid[slidesGrid.length - 1] - slidesGrid[slidesGrid.length - 2];
    }
  }
  let rewindFirstIndex = null;
  let rewindLastIndex = null;
  if (params.rewind) {
    if (swiper.isBeginning) {
      rewindLastIndex = params.virtual && params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
    } else if (swiper.isEnd) {
      rewindFirstIndex = 0;
    }
  }
  // Find current slide size
  const ratio = (currentPos - slidesGrid[stopIndex]) / groupSize;
  const increment = stopIndex < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
  if (timeDiff > params.longSwipesMs) {
    // Long touches
    if (!params.longSwipes) {
      swiper.slideTo(swiper.activeIndex);
      return;
    }
    if (swiper.swipeDirection === 'next') {
      if (ratio >= params.longSwipesRatio) swiper.slideTo(params.rewind && swiper.isEnd ? rewindFirstIndex : stopIndex + increment);else swiper.slideTo(stopIndex);
    }
    if (swiper.swipeDirection === 'prev') {
      if (ratio > 1 - params.longSwipesRatio) {
        swiper.slideTo(stopIndex + increment);
      } else if (rewindLastIndex !== null && ratio < 0 && Math.abs(ratio) > params.longSwipesRatio) {
        swiper.slideTo(rewindLastIndex);
      } else {
        swiper.slideTo(stopIndex);
      }
    }
  } else {
    // Short swipes
    if (!params.shortSwipes) {
      swiper.slideTo(swiper.activeIndex);
      return;
    }
    const isNavButtonTarget = swiper.navigation && (e.target === swiper.navigation.nextEl || e.target === swiper.navigation.prevEl);
    if (!isNavButtonTarget) {
      if (swiper.swipeDirection === 'next') {
        swiper.slideTo(rewindFirstIndex !== null ? rewindFirstIndex : stopIndex + increment);
      }
      if (swiper.swipeDirection === 'prev') {
        swiper.slideTo(rewindLastIndex !== null ? rewindLastIndex : stopIndex);
      }
    } else if (e.target === swiper.navigation.nextEl) {
      swiper.slideTo(stopIndex + increment);
    } else {
      swiper.slideTo(stopIndex);
    }
  }
}

function onResize() {
  const swiper = this;
  const {
    params,
    el
  } = swiper;
  if (el && el.offsetWidth === 0) return;

  // Breakpoints
  if (params.breakpoints) {
    swiper.setBreakpoint();
  }

  // Save locks
  const {
    allowSlideNext,
    allowSlidePrev,
    snapGrid
  } = swiper;
  const isVirtual = swiper.virtual && swiper.params.virtual.enabled;

  // Disable locks on resize
  swiper.allowSlideNext = true;
  swiper.allowSlidePrev = true;
  swiper.updateSize();
  swiper.updateSlides();
  swiper.updateSlidesClasses();
  const isVirtualLoop = isVirtual && params.loop;
  if ((params.slidesPerView === 'auto' || params.slidesPerView > 1) && swiper.isEnd && !swiper.isBeginning && !swiper.params.centeredSlides && !isVirtualLoop) {
    swiper.slideTo(swiper.slides.length - 1, 0, false, true);
  } else {
    if (swiper.params.loop && !isVirtual) {
      swiper.slideToLoop(swiper.realIndex, 0, false, true);
    } else {
      swiper.slideTo(swiper.activeIndex, 0, false, true);
    }
  }
  if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) {
    clearTimeout(swiper.autoplay.resizeTimeout);
    swiper.autoplay.resizeTimeout = setTimeout(() => {
      if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) {
        swiper.autoplay.resume();
      }
    }, 500);
  }
  // Return locks after resize
  swiper.allowSlidePrev = allowSlidePrev;
  swiper.allowSlideNext = allowSlideNext;
  if (swiper.params.watchOverflow && snapGrid !== swiper.snapGrid) {
    swiper.checkOverflow();
  }
}

function onClick(e) {
  const swiper = this;
  if (!swiper.enabled) return;
  if (!swiper.allowClick) {
    if (swiper.params.preventClicks) e.preventDefault();
    if (swiper.params.preventClicksPropagation && swiper.animating) {
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }
}

function onScroll() {
  const swiper = this;
  const {
    wrapperEl,
    rtlTranslate,
    enabled
  } = swiper;
  if (!enabled) return;
  swiper.previousTranslate = swiper.translate;
  if (swiper.isHorizontal()) {
    swiper.translate = -wrapperEl.scrollLeft;
  } else {
    swiper.translate = -wrapperEl.scrollTop;
  }
  // eslint-disable-next-line
  if (swiper.translate === 0) swiper.translate = 0;
  swiper.updateActiveIndex();
  swiper.updateSlidesClasses();
  let newProgress;
  const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
  if (translatesDiff === 0) {
    newProgress = 0;
  } else {
    newProgress = (swiper.translate - swiper.minTranslate()) / translatesDiff;
  }
  if (newProgress !== swiper.progress) {
    swiper.updateProgress(rtlTranslate ? -swiper.translate : swiper.translate);
  }
  swiper.emit('setTranslate', swiper.translate, false);
}

function onLoad(e) {
  const swiper = this;
  processLazyPreloader(swiper, e.target);
  if (swiper.params.cssMode || swiper.params.slidesPerView !== 'auto' && !swiper.params.autoHeight) {
    return;
  }
  swiper.update();
}

function onDocumentTouchStart() {
  const swiper = this;
  if (swiper.documentTouchHandlerProceeded) return;
  swiper.documentTouchHandlerProceeded = true;
  if (swiper.params.touchReleaseOnEdges) {
    swiper.el.style.touchAction = 'auto';
  }
}

const events = (swiper, method) => {
  const document = getDocument();
  const {
    params,
    el,
    wrapperEl,
    device
  } = swiper;
  const capture = !!params.nested;
  const domMethod = method === 'on' ? 'addEventListener' : 'removeEventListener';
  const swiperMethod = method;

  // Touch Events
  document[domMethod]('touchstart', swiper.onDocumentTouchStart, {
    passive: false,
    capture
  });
  el[domMethod]('touchstart', swiper.onTouchStart, {
    passive: false
  });
  el[domMethod]('pointerdown', swiper.onTouchStart, {
    passive: false
  });
  document[domMethod]('touchmove', swiper.onTouchMove, {
    passive: false,
    capture
  });
  document[domMethod]('pointermove', swiper.onTouchMove, {
    passive: false,
    capture
  });
  document[domMethod]('touchend', swiper.onTouchEnd, {
    passive: true
  });
  document[domMethod]('pointerup', swiper.onTouchEnd, {
    passive: true
  });
  document[domMethod]('pointercancel', swiper.onTouchEnd, {
    passive: true
  });
  document[domMethod]('touchcancel', swiper.onTouchEnd, {
    passive: true
  });
  document[domMethod]('pointerout', swiper.onTouchEnd, {
    passive: true
  });
  document[domMethod]('pointerleave', swiper.onTouchEnd, {
    passive: true
  });
  document[domMethod]('contextmenu', swiper.onTouchEnd, {
    passive: true
  });

  // Prevent Links Clicks
  if (params.preventClicks || params.preventClicksPropagation) {
    el[domMethod]('click', swiper.onClick, true);
  }
  if (params.cssMode) {
    wrapperEl[domMethod]('scroll', swiper.onScroll);
  }

  // Resize handler
  if (params.updateOnWindowResize) {
    swiper[swiperMethod](device.ios || device.android ? 'resize orientationchange observerUpdate' : 'resize observerUpdate', onResize, true);
  } else {
    swiper[swiperMethod]('observerUpdate', onResize, true);
  }

  // Images loader
  el[domMethod]('load', swiper.onLoad, {
    capture: true
  });
};
function attachEvents() {
  const swiper = this;
  const {
    params
  } = swiper;
  swiper.onTouchStart = onTouchStart.bind(swiper);
  swiper.onTouchMove = onTouchMove.bind(swiper);
  swiper.onTouchEnd = onTouchEnd.bind(swiper);
  swiper.onDocumentTouchStart = onDocumentTouchStart.bind(swiper);
  if (params.cssMode) {
    swiper.onScroll = onScroll.bind(swiper);
  }
  swiper.onClick = onClick.bind(swiper);
  swiper.onLoad = onLoad.bind(swiper);
  events(swiper, 'on');
}
function detachEvents() {
  const swiper = this;
  events(swiper, 'off');
}
var events$1 = {
  attachEvents,
  detachEvents
};

const isGridEnabled = (swiper, params) => {
  return swiper.grid && params.grid && params.grid.rows > 1;
};
function setBreakpoint() {
  const swiper = this;
  const {
    realIndex,
    initialized,
    params,
    el
  } = swiper;
  const breakpoints = params.breakpoints;
  if (!breakpoints || breakpoints && Object.keys(breakpoints).length === 0) return;

  // Get breakpoint for window width and update parameters
  const breakpoint = swiper.getBreakpoint(breakpoints, swiper.params.breakpointsBase, swiper.el);
  if (!breakpoint || swiper.currentBreakpoint === breakpoint) return;
  const breakpointOnlyParams = breakpoint in breakpoints ? breakpoints[breakpoint] : undefined;
  const breakpointParams = breakpointOnlyParams || swiper.originalParams;
  const wasMultiRow = isGridEnabled(swiper, params);
  const isMultiRow = isGridEnabled(swiper, breakpointParams);
  const wasEnabled = params.enabled;
  if (wasMultiRow && !isMultiRow) {
    el.classList.remove(`${params.containerModifierClass}grid`, `${params.containerModifierClass}grid-column`);
    swiper.emitContainerClasses();
  } else if (!wasMultiRow && isMultiRow) {
    el.classList.add(`${params.containerModifierClass}grid`);
    if (breakpointParams.grid.fill && breakpointParams.grid.fill === 'column' || !breakpointParams.grid.fill && params.grid.fill === 'column') {
      el.classList.add(`${params.containerModifierClass}grid-column`);
    }
    swiper.emitContainerClasses();
  }

  // Toggle navigation, pagination, scrollbar
  ['navigation', 'pagination', 'scrollbar'].forEach(prop => {
    if (typeof breakpointParams[prop] === 'undefined') return;
    const wasModuleEnabled = params[prop] && params[prop].enabled;
    const isModuleEnabled = breakpointParams[prop] && breakpointParams[prop].enabled;
    if (wasModuleEnabled && !isModuleEnabled) {
      swiper[prop].disable();
    }
    if (!wasModuleEnabled && isModuleEnabled) {
      swiper[prop].enable();
    }
  });
  const directionChanged = breakpointParams.direction && breakpointParams.direction !== params.direction;
  const needsReLoop = params.loop && (breakpointParams.slidesPerView !== params.slidesPerView || directionChanged);
  const wasLoop = params.loop;
  if (directionChanged && initialized) {
    swiper.changeDirection();
  }
  utils_extend(swiper.params, breakpointParams);
  const isEnabled = swiper.params.enabled;
  const hasLoop = swiper.params.loop;
  Object.assign(swiper, {
    allowTouchMove: swiper.params.allowTouchMove,
    allowSlideNext: swiper.params.allowSlideNext,
    allowSlidePrev: swiper.params.allowSlidePrev
  });
  if (wasEnabled && !isEnabled) {
    swiper.disable();
  } else if (!wasEnabled && isEnabled) {
    swiper.enable();
  }
  swiper.currentBreakpoint = breakpoint;
  swiper.emit('_beforeBreakpoint', breakpointParams);
  if (initialized) {
    if (needsReLoop) {
      swiper.loopDestroy();
      swiper.loopCreate(realIndex);
      swiper.updateSlides();
    } else if (!wasLoop && hasLoop) {
      swiper.loopCreate(realIndex);
      swiper.updateSlides();
    } else if (wasLoop && !hasLoop) {
      swiper.loopDestroy();
    }
  }
  swiper.emit('breakpoint', breakpointParams);
}

function getBreakpoint(breakpoints, base, containerEl) {
  if (base === void 0) {
    base = 'window';
  }
  if (!breakpoints || base === 'container' && !containerEl) return undefined;
  let breakpoint = false;
  const window = getWindow();
  const currentHeight = base === 'window' ? window.innerHeight : containerEl.clientHeight;
  const points = Object.keys(breakpoints).map(point => {
    if (typeof point === 'string' && point.indexOf('@') === 0) {
      const minRatio = parseFloat(point.substr(1));
      const value = currentHeight * minRatio;
      return {
        value,
        point
      };
    }
    return {
      value: point,
      point
    };
  });
  points.sort((a, b) => parseInt(a.value, 10) - parseInt(b.value, 10));
  for (let i = 0; i < points.length; i += 1) {
    const {
      point,
      value
    } = points[i];
    if (base === 'window') {
      if (window.matchMedia(`(min-width: ${value}px)`).matches) {
        breakpoint = point;
      }
    } else if (value <= containerEl.clientWidth) {
      breakpoint = point;
    }
  }
  return breakpoint || 'max';
}

var breakpoints = {
  setBreakpoint,
  getBreakpoint
};

function prepareClasses(entries, prefix) {
  const resultClasses = [];
  entries.forEach(item => {
    if (typeof item === 'object') {
      Object.keys(item).forEach(classNames => {
        if (item[classNames]) {
          resultClasses.push(prefix + classNames);
        }
      });
    } else if (typeof item === 'string') {
      resultClasses.push(prefix + item);
    }
  });
  return resultClasses;
}
function addClasses() {
  const swiper = this;
  const {
    classNames,
    params,
    rtl,
    el,
    device
  } = swiper;
  // prettier-ignore
  const suffixes = prepareClasses(['initialized', params.direction, {
    'free-mode': swiper.params.freeMode && params.freeMode.enabled
  }, {
    'autoheight': params.autoHeight
  }, {
    'rtl': rtl
  }, {
    'grid': params.grid && params.grid.rows > 1
  }, {
    'grid-column': params.grid && params.grid.rows > 1 && params.grid.fill === 'column'
  }, {
    'android': device.android
  }, {
    'ios': device.ios
  }, {
    'css-mode': params.cssMode
  }, {
    'centered': params.cssMode && params.centeredSlides
  }, {
    'watch-progress': params.watchSlidesProgress
  }], params.containerModifierClass);
  classNames.push(...suffixes);
  el.classList.add(...classNames);
  swiper.emitContainerClasses();
}

function removeClasses() {
  const swiper = this;
  const {
    el,
    classNames
  } = swiper;
  el.classList.remove(...classNames);
  swiper.emitContainerClasses();
}

var classes = {
  addClasses,
  removeClasses
};

function checkOverflow() {
  const swiper = this;
  const {
    isLocked: wasLocked,
    params
  } = swiper;
  const {
    slidesOffsetBefore
  } = params;
  if (slidesOffsetBefore) {
    const lastSlideIndex = swiper.slides.length - 1;
    const lastSlideRightEdge = swiper.slidesGrid[lastSlideIndex] + swiper.slidesSizesGrid[lastSlideIndex] + slidesOffsetBefore * 2;
    swiper.isLocked = swiper.size > lastSlideRightEdge;
  } else {
    swiper.isLocked = swiper.snapGrid.length === 1;
  }
  if (params.allowSlideNext === true) {
    swiper.allowSlideNext = !swiper.isLocked;
  }
  if (params.allowSlidePrev === true) {
    swiper.allowSlidePrev = !swiper.isLocked;
  }
  if (wasLocked && wasLocked !== swiper.isLocked) {
    swiper.isEnd = false;
  }
  if (wasLocked !== swiper.isLocked) {
    swiper.emit(swiper.isLocked ? 'lock' : 'unlock');
  }
}
var checkOverflow$1 = {
  checkOverflow
};

var defaults = {
  init: true,
  direction: 'horizontal',
  oneWayMovement: false,
  touchEventsTarget: 'wrapper',
  initialSlide: 0,
  speed: 300,
  cssMode: false,
  updateOnWindowResize: true,
  resizeObserver: true,
  nested: false,
  createElements: false,
  eventsPrefix: 'swiper',
  enabled: true,
  focusableElements: 'input, select, option, textarea, button, video, label',
  // Overrides
  width: null,
  height: null,
  //
  preventInteractionOnTransition: false,
  // ssr
  userAgent: null,
  url: null,
  // To support iOS's swipe-to-go-back gesture (when being used in-app).
  edgeSwipeDetection: false,
  edgeSwipeThreshold: 20,
  // Autoheight
  autoHeight: false,
  // Set wrapper width
  setWrapperSize: false,
  // Virtual Translate
  virtualTranslate: false,
  // Effects
  effect: 'slide',
  // 'slide' or 'fade' or 'cube' or 'coverflow' or 'flip'

  // Breakpoints
  breakpoints: undefined,
  breakpointsBase: 'window',
  // Slides grid
  spaceBetween: 0,
  slidesPerView: 1,
  slidesPerGroup: 1,
  slidesPerGroupSkip: 0,
  slidesPerGroupAuto: false,
  centeredSlides: false,
  centeredSlidesBounds: false,
  slidesOffsetBefore: 0,
  // in px
  slidesOffsetAfter: 0,
  // in px
  normalizeSlideIndex: true,
  centerInsufficientSlides: false,
  // Disable swiper and hide navigation when container not overflow
  watchOverflow: true,
  // Round length
  roundLengths: false,
  // Touches
  touchRatio: 1,
  touchAngle: 45,
  simulateTouch: true,
  shortSwipes: true,
  longSwipes: true,
  longSwipesRatio: 0.5,
  longSwipesMs: 300,
  followFinger: true,
  allowTouchMove: true,
  threshold: 5,
  touchMoveStopPropagation: false,
  touchStartPreventDefault: true,
  touchStartForcePreventDefault: false,
  touchReleaseOnEdges: false,
  // Unique Navigation Elements
  uniqueNavElements: true,
  // Resistance
  resistance: true,
  resistanceRatio: 0.85,
  // Progress
  watchSlidesProgress: false,
  // Cursor
  grabCursor: false,
  // Clicks
  preventClicks: true,
  preventClicksPropagation: true,
  slideToClickedSlide: false,
  // loop
  loop: false,
  loopAddBlankSlides: true,
  loopAdditionalSlides: 0,
  loopPreventsSliding: true,
  // rewind
  rewind: false,
  // Swiping/no swiping
  allowSlidePrev: true,
  allowSlideNext: true,
  swipeHandler: null,
  // '.swipe-handler',
  noSwiping: true,
  noSwipingClass: 'swiper-no-swiping',
  noSwipingSelector: null,
  // Passive Listeners
  passiveListeners: true,
  maxBackfaceHiddenSlides: 10,
  // NS
  containerModifierClass: 'swiper-',
  // NEW
  slideClass: 'swiper-slide',
  slideBlankClass: 'swiper-slide-blank',
  slideActiveClass: 'swiper-slide-active',
  slideVisibleClass: 'swiper-slide-visible',
  slideFullyVisibleClass: 'swiper-slide-fully-visible',
  slideNextClass: 'swiper-slide-next',
  slidePrevClass: 'swiper-slide-prev',
  wrapperClass: 'swiper-wrapper',
  lazyPreloaderClass: 'swiper-lazy-preloader',
  lazyPreloadPrevNext: 0,
  // Callbacks
  runCallbacksOnInit: true,
  // Internals
  _emitClasses: false
};

function moduleExtendParams(params, allModulesParams) {
  return function extendParams(obj) {
    if (obj === void 0) {
      obj = {};
    }
    const moduleParamName = Object.keys(obj)[0];
    const moduleParams = obj[moduleParamName];
    if (typeof moduleParams !== 'object' || moduleParams === null) {
      utils_extend(allModulesParams, obj);
      return;
    }
    if (params[moduleParamName] === true) {
      params[moduleParamName] = {
        enabled: true
      };
    }
    if (moduleParamName === 'navigation' && params[moduleParamName] && params[moduleParamName].enabled && !params[moduleParamName].prevEl && !params[moduleParamName].nextEl) {
      params[moduleParamName].auto = true;
    }
    if (['pagination', 'scrollbar'].indexOf(moduleParamName) >= 0 && params[moduleParamName] && params[moduleParamName].enabled && !params[moduleParamName].el) {
      params[moduleParamName].auto = true;
    }
    if (!(moduleParamName in params && 'enabled' in moduleParams)) {
      utils_extend(allModulesParams, obj);
      return;
    }
    if (typeof params[moduleParamName] === 'object' && !('enabled' in params[moduleParamName])) {
      params[moduleParamName].enabled = true;
    }
    if (!params[moduleParamName]) params[moduleParamName] = {
      enabled: false
    };
    utils_extend(allModulesParams, obj);
  };
}

/* eslint no-param-reassign: "off" */
const prototypes = {
  eventsEmitter,
  update,
  translate,
  transition,
  slide,
  loop,
  grabCursor,
  events: events$1,
  breakpoints,
  checkOverflow: checkOverflow$1,
  classes
};
const extendedDefaults = {};
class Swiper {
  constructor() {
    let el;
    let params;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    if (args.length === 1 && args[0].constructor && Object.prototype.toString.call(args[0]).slice(8, -1) === 'Object') {
      params = args[0];
    } else {
      [el, params] = args;
    }
    if (!params) params = {};
    params = utils_extend({}, params);
    if (el && !params.el) params.el = el;
    const document = getDocument();
    if (params.el && typeof params.el === 'string' && document.querySelectorAll(params.el).length > 1) {
      const swipers = [];
      document.querySelectorAll(params.el).forEach(containerEl => {
        const newParams = utils_extend({}, params, {
          el: containerEl
        });
        swipers.push(new Swiper(newParams));
      });
      // eslint-disable-next-line no-constructor-return
      return swipers;
    }

    // Swiper Instance
    const swiper = this;
    swiper.__swiper__ = true;
    swiper.support = getSupport();
    swiper.device = getDevice({
      userAgent: params.userAgent
    });
    swiper.browser = getBrowser();
    swiper.eventsListeners = {};
    swiper.eventsAnyListeners = [];
    swiper.modules = [...swiper.__modules__];
    if (params.modules && Array.isArray(params.modules)) {
      swiper.modules.push(...params.modules);
    }
    const allModulesParams = {};
    swiper.modules.forEach(mod => {
      mod({
        params,
        swiper,
        extendParams: moduleExtendParams(params, allModulesParams),
        on: swiper.on.bind(swiper),
        once: swiper.once.bind(swiper),
        off: swiper.off.bind(swiper),
        emit: swiper.emit.bind(swiper)
      });
    });

    // Extend defaults with modules params
    const swiperParams = utils_extend({}, defaults, allModulesParams);

    // Extend defaults with passed params
    swiper.params = utils_extend({}, swiperParams, extendedDefaults, params);
    swiper.originalParams = utils_extend({}, swiper.params);
    swiper.passedParams = utils_extend({}, params);

    // add event listeners
    if (swiper.params && swiper.params.on) {
      Object.keys(swiper.params.on).forEach(eventName => {
        swiper.on(eventName, swiper.params.on[eventName]);
      });
    }
    if (swiper.params && swiper.params.onAny) {
      swiper.onAny(swiper.params.onAny);
    }

    // Extend Swiper
    Object.assign(swiper, {
      enabled: swiper.params.enabled,
      el,
      // Classes
      classNames: [],
      // Slides
      slides: [],
      slidesGrid: [],
      snapGrid: [],
      slidesSizesGrid: [],
      // isDirection
      isHorizontal() {
        return swiper.params.direction === 'horizontal';
      },
      isVertical() {
        return swiper.params.direction === 'vertical';
      },
      // Indexes
      activeIndex: 0,
      realIndex: 0,
      //
      isBeginning: true,
      isEnd: false,
      // Props
      translate: 0,
      previousTranslate: 0,
      progress: 0,
      velocity: 0,
      animating: false,
      cssOverflowAdjustment() {
        // Returns 0 unless `translate` is > 2**23
        // Should be subtracted from css values to prevent overflow
        return Math.trunc(this.translate / 2 ** 23) * 2 ** 23;
      },
      // Locks
      allowSlideNext: swiper.params.allowSlideNext,
      allowSlidePrev: swiper.params.allowSlidePrev,
      // Touch Events
      touchEventsData: {
        isTouched: undefined,
        isMoved: undefined,
        allowTouchCallbacks: undefined,
        touchStartTime: undefined,
        isScrolling: undefined,
        currentTranslate: undefined,
        startTranslate: undefined,
        allowThresholdMove: undefined,
        // Form elements to match
        focusableElements: swiper.params.focusableElements,
        // Last click time
        lastClickTime: 0,
        clickTimeout: undefined,
        // Velocities
        velocities: [],
        allowMomentumBounce: undefined,
        startMoving: undefined,
        pointerId: null,
        touchId: null
      },
      // Clicks
      allowClick: true,
      // Touches
      allowTouchMove: swiper.params.allowTouchMove,
      touches: {
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        diff: 0
      },
      // Images
      imagesToLoad: [],
      imagesLoaded: 0
    });
    swiper.emit('_swiper');

    // Init
    if (swiper.params.init) {
      swiper.init();
    }

    // Return app instance
    // eslint-disable-next-line no-constructor-return
    return swiper;
  }
  getDirectionLabel(property) {
    if (this.isHorizontal()) {
      return property;
    }
    // prettier-ignore
    return {
      'width': 'height',
      'margin-top': 'margin-left',
      'margin-bottom ': 'margin-right',
      'margin-left': 'margin-top',
      'margin-right': 'margin-bottom',
      'padding-left': 'padding-top',
      'padding-right': 'padding-bottom',
      'marginRight': 'marginBottom'
    }[property];
  }
  getSlideIndex(slideEl) {
    const {
      slidesEl,
      params
    } = this;
    const slides = elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`);
    const firstSlideIndex = elementIndex(slides[0]);
    return elementIndex(slideEl) - firstSlideIndex;
  }
  getSlideIndexByData(index) {
    return this.getSlideIndex(this.slides.filter(slideEl => slideEl.getAttribute('data-swiper-slide-index') * 1 === index)[0]);
  }
  recalcSlides() {
    const swiper = this;
    const {
      slidesEl,
      params
    } = swiper;
    swiper.slides = elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`);
  }
  enable() {
    const swiper = this;
    if (swiper.enabled) return;
    swiper.enabled = true;
    if (swiper.params.grabCursor) {
      swiper.setGrabCursor();
    }
    swiper.emit('enable');
  }
  disable() {
    const swiper = this;
    if (!swiper.enabled) return;
    swiper.enabled = false;
    if (swiper.params.grabCursor) {
      swiper.unsetGrabCursor();
    }
    swiper.emit('disable');
  }
  setProgress(progress, speed) {
    const swiper = this;
    progress = Math.min(Math.max(progress, 0), 1);
    const min = swiper.minTranslate();
    const max = swiper.maxTranslate();
    const current = (max - min) * progress + min;
    swiper.translateTo(current, typeof speed === 'undefined' ? 0 : speed);
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();
  }
  emitContainerClasses() {
    const swiper = this;
    if (!swiper.params._emitClasses || !swiper.el) return;
    const cls = swiper.el.className.split(' ').filter(className => {
      return className.indexOf('swiper') === 0 || className.indexOf(swiper.params.containerModifierClass) === 0;
    });
    swiper.emit('_containerClasses', cls.join(' '));
  }
  getSlideClasses(slideEl) {
    const swiper = this;
    if (swiper.destroyed) return '';
    return slideEl.className.split(' ').filter(className => {
      return className.indexOf('swiper-slide') === 0 || className.indexOf(swiper.params.slideClass) === 0;
    }).join(' ');
  }
  emitSlidesClasses() {
    const swiper = this;
    if (!swiper.params._emitClasses || !swiper.el) return;
    const updates = [];
    swiper.slides.forEach(slideEl => {
      const classNames = swiper.getSlideClasses(slideEl);
      updates.push({
        slideEl,
        classNames
      });
      swiper.emit('_slideClass', slideEl, classNames);
    });
    swiper.emit('_slideClasses', updates);
  }
  slidesPerViewDynamic(view, exact) {
    if (view === void 0) {
      view = 'current';
    }
    if (exact === void 0) {
      exact = false;
    }
    const swiper = this;
    const {
      params,
      slides,
      slidesGrid,
      slidesSizesGrid,
      size: swiperSize,
      activeIndex
    } = swiper;
    let spv = 1;
    if (typeof params.slidesPerView === 'number') return params.slidesPerView;
    if (params.centeredSlides) {
      let slideSize = slides[activeIndex] ? slides[activeIndex].swiperSlideSize : 0;
      let breakLoop;
      for (let i = activeIndex + 1; i < slides.length; i += 1) {
        if (slides[i] && !breakLoop) {
          slideSize += slides[i].swiperSlideSize;
          spv += 1;
          if (slideSize > swiperSize) breakLoop = true;
        }
      }
      for (let i = activeIndex - 1; i >= 0; i -= 1) {
        if (slides[i] && !breakLoop) {
          slideSize += slides[i].swiperSlideSize;
          spv += 1;
          if (slideSize > swiperSize) breakLoop = true;
        }
      }
    } else {
      // eslint-disable-next-line
      if (view === 'current') {
        for (let i = activeIndex + 1; i < slides.length; i += 1) {
          const slideInView = exact ? slidesGrid[i] + slidesSizesGrid[i] - slidesGrid[activeIndex] < swiperSize : slidesGrid[i] - slidesGrid[activeIndex] < swiperSize;
          if (slideInView) {
            spv += 1;
          }
        }
      } else {
        // previous
        for (let i = activeIndex - 1; i >= 0; i -= 1) {
          const slideInView = slidesGrid[activeIndex] - slidesGrid[i] < swiperSize;
          if (slideInView) {
            spv += 1;
          }
        }
      }
    }
    return spv;
  }
  update() {
    const swiper = this;
    if (!swiper || swiper.destroyed) return;
    const {
      snapGrid,
      params
    } = swiper;
    // Breakpoints
    if (params.breakpoints) {
      swiper.setBreakpoint();
    }
    [...swiper.el.querySelectorAll('[loading="lazy"]')].forEach(imageEl => {
      if (imageEl.complete) {
        processLazyPreloader(swiper, imageEl);
      }
    });
    swiper.updateSize();
    swiper.updateSlides();
    swiper.updateProgress();
    swiper.updateSlidesClasses();
    function setTranslate() {
      const translateValue = swiper.rtlTranslate ? swiper.translate * -1 : swiper.translate;
      const newTranslate = Math.min(Math.max(translateValue, swiper.maxTranslate()), swiper.minTranslate());
      swiper.setTranslate(newTranslate);
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
    }
    let translated;
    if (params.freeMode && params.freeMode.enabled && !params.cssMode) {
      setTranslate();
      if (params.autoHeight) {
        swiper.updateAutoHeight();
      }
    } else {
      if ((params.slidesPerView === 'auto' || params.slidesPerView > 1) && swiper.isEnd && !params.centeredSlides) {
        const slides = swiper.virtual && params.virtual.enabled ? swiper.virtual.slides : swiper.slides;
        translated = swiper.slideTo(slides.length - 1, 0, false, true);
      } else {
        translated = swiper.slideTo(swiper.activeIndex, 0, false, true);
      }
      if (!translated) {
        setTranslate();
      }
    }
    if (params.watchOverflow && snapGrid !== swiper.snapGrid) {
      swiper.checkOverflow();
    }
    swiper.emit('update');
  }
  changeDirection(newDirection, needUpdate) {
    if (needUpdate === void 0) {
      needUpdate = true;
    }
    const swiper = this;
    const currentDirection = swiper.params.direction;
    if (!newDirection) {
      // eslint-disable-next-line
      newDirection = currentDirection === 'horizontal' ? 'vertical' : 'horizontal';
    }
    if (newDirection === currentDirection || newDirection !== 'horizontal' && newDirection !== 'vertical') {
      return swiper;
    }
    swiper.el.classList.remove(`${swiper.params.containerModifierClass}${currentDirection}`);
    swiper.el.classList.add(`${swiper.params.containerModifierClass}${newDirection}`);
    swiper.emitContainerClasses();
    swiper.params.direction = newDirection;
    swiper.slides.forEach(slideEl => {
      if (newDirection === 'vertical') {
        slideEl.style.width = '';
      } else {
        slideEl.style.height = '';
      }
    });
    swiper.emit('changeDirection');
    if (needUpdate) swiper.update();
    return swiper;
  }
  changeLanguageDirection(direction) {
    const swiper = this;
    if (swiper.rtl && direction === 'rtl' || !swiper.rtl && direction === 'ltr') return;
    swiper.rtl = direction === 'rtl';
    swiper.rtlTranslate = swiper.params.direction === 'horizontal' && swiper.rtl;
    if (swiper.rtl) {
      swiper.el.classList.add(`${swiper.params.containerModifierClass}rtl`);
      swiper.el.dir = 'rtl';
    } else {
      swiper.el.classList.remove(`${swiper.params.containerModifierClass}rtl`);
      swiper.el.dir = 'ltr';
    }
    swiper.update();
  }
  mount(element) {
    const swiper = this;
    if (swiper.mounted) return true;

    // Find el
    let el = element || swiper.params.el;
    if (typeof el === 'string') {
      el = document.querySelector(el);
    }
    if (!el) {
      return false;
    }
    el.swiper = swiper;
    if (el.parentNode && el.parentNode.host && el.parentNode.host.nodeName === 'SWIPER-CONTAINER') {
      swiper.isElement = true;
    }
    const getWrapperSelector = () => {
      return `.${(swiper.params.wrapperClass || '').trim().split(' ').join('.')}`;
    };
    const getWrapper = () => {
      if (el && el.shadowRoot && el.shadowRoot.querySelector) {
        const res = el.shadowRoot.querySelector(getWrapperSelector());
        // Children needs to return slot items
        return res;
      }
      return elementChildren(el, getWrapperSelector())[0];
    };
    // Find Wrapper
    let wrapperEl = getWrapper();
    if (!wrapperEl && swiper.params.createElements) {
      wrapperEl = createElement('div', swiper.params.wrapperClass);
      el.append(wrapperEl);
      elementChildren(el, `.${swiper.params.slideClass}`).forEach(slideEl => {
        wrapperEl.append(slideEl);
      });
    }
    Object.assign(swiper, {
      el,
      wrapperEl,
      slidesEl: swiper.isElement && !el.parentNode.host.slideSlots ? el.parentNode.host : wrapperEl,
      hostEl: swiper.isElement ? el.parentNode.host : el,
      mounted: true,
      // RTL
      rtl: el.dir.toLowerCase() === 'rtl' || elementStyle(el, 'direction') === 'rtl',
      rtlTranslate: swiper.params.direction === 'horizontal' && (el.dir.toLowerCase() === 'rtl' || elementStyle(el, 'direction') === 'rtl'),
      wrongRTL: elementStyle(wrapperEl, 'display') === '-webkit-box'
    });
    return true;
  }
  init(el) {
    const swiper = this;
    if (swiper.initialized) return swiper;
    const mounted = swiper.mount(el);
    if (mounted === false) return swiper;
    swiper.emit('beforeInit');

    // Set breakpoint
    if (swiper.params.breakpoints) {
      swiper.setBreakpoint();
    }

    // Add Classes
    swiper.addClasses();

    // Update size
    swiper.updateSize();

    // Update slides
    swiper.updateSlides();
    if (swiper.params.watchOverflow) {
      swiper.checkOverflow();
    }

    // Set Grab Cursor
    if (swiper.params.grabCursor && swiper.enabled) {
      swiper.setGrabCursor();
    }

    // Slide To Initial Slide
    if (swiper.params.loop && swiper.virtual && swiper.params.virtual.enabled) {
      swiper.slideTo(swiper.params.initialSlide + swiper.virtual.slidesBefore, 0, swiper.params.runCallbacksOnInit, false, true);
    } else {
      swiper.slideTo(swiper.params.initialSlide, 0, swiper.params.runCallbacksOnInit, false, true);
    }

    // Create loop
    if (swiper.params.loop) {
      swiper.loopCreate();
    }

    // Attach events
    swiper.attachEvents();
    const lazyElements = [...swiper.el.querySelectorAll('[loading="lazy"]')];
    if (swiper.isElement) {
      lazyElements.push(...swiper.hostEl.querySelectorAll('[loading="lazy"]'));
    }
    lazyElements.forEach(imageEl => {
      if (imageEl.complete) {
        processLazyPreloader(swiper, imageEl);
      } else {
        imageEl.addEventListener('load', e => {
          processLazyPreloader(swiper, e.target);
        });
      }
    });
    preload(swiper);

    // Init Flag
    swiper.initialized = true;
    preload(swiper);

    // Emit
    swiper.emit('init');
    swiper.emit('afterInit');
    return swiper;
  }
  destroy(deleteInstance, cleanStyles) {
    if (deleteInstance === void 0) {
      deleteInstance = true;
    }
    if (cleanStyles === void 0) {
      cleanStyles = true;
    }
    const swiper = this;
    const {
      params,
      el,
      wrapperEl,
      slides
    } = swiper;
    if (typeof swiper.params === 'undefined' || swiper.destroyed) {
      return null;
    }
    swiper.emit('beforeDestroy');

    // Init Flag
    swiper.initialized = false;

    // Detach events
    swiper.detachEvents();

    // Destroy loop
    if (params.loop) {
      swiper.loopDestroy();
    }

    // Cleanup styles
    if (cleanStyles) {
      swiper.removeClasses();
      el.removeAttribute('style');
      wrapperEl.removeAttribute('style');
      if (slides && slides.length) {
        slides.forEach(slideEl => {
          slideEl.classList.remove(params.slideVisibleClass, params.slideFullyVisibleClass, params.slideActiveClass, params.slideNextClass, params.slidePrevClass);
          slideEl.removeAttribute('style');
          slideEl.removeAttribute('data-swiper-slide-index');
        });
      }
    }
    swiper.emit('destroy');

    // Detach emitter events
    Object.keys(swiper.eventsListeners).forEach(eventName => {
      swiper.off(eventName);
    });
    if (deleteInstance !== false) {
      swiper.el.swiper = null;
      deleteProps(swiper);
    }
    swiper.destroyed = true;
    return null;
  }
  static extendDefaults(newDefaults) {
    utils_extend(extendedDefaults, newDefaults);
  }
  static get extendedDefaults() {
    return extendedDefaults;
  }
  static get defaults() {
    return defaults;
  }
  static installModule(mod) {
    if (!Swiper.prototype.__modules__) Swiper.prototype.__modules__ = [];
    const modules = Swiper.prototype.__modules__;
    if (typeof mod === 'function' && modules.indexOf(mod) < 0) {
      modules.push(mod);
    }
  }
  static use(module) {
    if (Array.isArray(module)) {
      module.forEach(m => Swiper.installModule(m));
      return Swiper;
    }
    Swiper.installModule(module);
    return Swiper;
  }
}
Object.keys(prototypes).forEach(prototypeGroup => {
  Object.keys(prototypes[prototypeGroup]).forEach(protoMethod => {
    Swiper.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
  });
});
Swiper.use([Resize, Observer]);



;// CONCATENATED MODULE: ./node_modules/swiper/modules/virtual.mjs



function Virtual(_ref) {
  let {
    swiper,
    extendParams,
    on,
    emit
  } = _ref;
  extendParams({
    virtual: {
      enabled: false,
      slides: [],
      cache: true,
      renderSlide: null,
      renderExternal: null,
      renderExternalUpdate: true,
      addSlidesBefore: 0,
      addSlidesAfter: 0
    }
  });
  let cssModeTimeout;
  const document = getDocument();
  swiper.virtual = {
    cache: {},
    from: undefined,
    to: undefined,
    slides: [],
    offset: 0,
    slidesGrid: []
  };
  const tempDOM = document.createElement('div');
  function renderSlide(slide, index) {
    const params = swiper.params.virtual;
    if (params.cache && swiper.virtual.cache[index]) {
      return swiper.virtual.cache[index];
    }
    // eslint-disable-next-line
    let slideEl;
    if (params.renderSlide) {
      slideEl = params.renderSlide.call(swiper, slide, index);
      if (typeof slideEl === 'string') {
        tempDOM.innerHTML = slideEl;
        slideEl = tempDOM.children[0];
      }
    } else if (swiper.isElement) {
      slideEl = createElement('swiper-slide');
    } else {
      slideEl = createElement('div', swiper.params.slideClass);
    }
    slideEl.setAttribute('data-swiper-slide-index', index);
    if (!params.renderSlide) {
      slideEl.innerHTML = slide;
    }
    if (params.cache) {
      swiper.virtual.cache[index] = slideEl;
    }
    return slideEl;
  }
  function update(force) {
    const {
      slidesPerView,
      slidesPerGroup,
      centeredSlides,
      loop: isLoop
    } = swiper.params;
    const {
      addSlidesBefore,
      addSlidesAfter
    } = swiper.params.virtual;
    const {
      from: previousFrom,
      to: previousTo,
      slides,
      slidesGrid: previousSlidesGrid,
      offset: previousOffset
    } = swiper.virtual;
    if (!swiper.params.cssMode) {
      swiper.updateActiveIndex();
    }
    const activeIndex = swiper.activeIndex || 0;
    let offsetProp;
    if (swiper.rtlTranslate) offsetProp = 'right';else offsetProp = swiper.isHorizontal() ? 'left' : 'top';
    let slidesAfter;
    let slidesBefore;
    if (centeredSlides) {
      slidesAfter = Math.floor(slidesPerView / 2) + slidesPerGroup + addSlidesAfter;
      slidesBefore = Math.floor(slidesPerView / 2) + slidesPerGroup + addSlidesBefore;
    } else {
      slidesAfter = slidesPerView + (slidesPerGroup - 1) + addSlidesAfter;
      slidesBefore = (isLoop ? slidesPerView : slidesPerGroup) + addSlidesBefore;
    }
    let from = activeIndex - slidesBefore;
    let to = activeIndex + slidesAfter;
    if (!isLoop) {
      from = Math.max(from, 0);
      to = Math.min(to, slides.length - 1);
    }
    let offset = (swiper.slidesGrid[from] || 0) - (swiper.slidesGrid[0] || 0);
    if (isLoop && activeIndex >= slidesBefore) {
      from -= slidesBefore;
      if (!centeredSlides) offset += swiper.slidesGrid[0];
    } else if (isLoop && activeIndex < slidesBefore) {
      from = -slidesBefore;
      if (centeredSlides) offset += swiper.slidesGrid[0];
    }
    Object.assign(swiper.virtual, {
      from,
      to,
      offset,
      slidesGrid: swiper.slidesGrid,
      slidesBefore,
      slidesAfter
    });
    function onRendered() {
      swiper.updateSlides();
      swiper.updateProgress();
      swiper.updateSlidesClasses();
      emit('virtualUpdate');
    }
    if (previousFrom === from && previousTo === to && !force) {
      if (swiper.slidesGrid !== previousSlidesGrid && offset !== previousOffset) {
        swiper.slides.forEach(slideEl => {
          slideEl.style[offsetProp] = `${offset - Math.abs(swiper.cssOverflowAdjustment())}px`;
        });
      }
      swiper.updateProgress();
      emit('virtualUpdate');
      return;
    }
    if (swiper.params.virtual.renderExternal) {
      swiper.params.virtual.renderExternal.call(swiper, {
        offset,
        from,
        to,
        slides: function getSlides() {
          const slidesToRender = [];
          for (let i = from; i <= to; i += 1) {
            slidesToRender.push(slides[i]);
          }
          return slidesToRender;
        }()
      });
      if (swiper.params.virtual.renderExternalUpdate) {
        onRendered();
      } else {
        emit('virtualUpdate');
      }
      return;
    }
    const prependIndexes = [];
    const appendIndexes = [];
    const getSlideIndex = index => {
      let slideIndex = index;
      if (index < 0) {
        slideIndex = slides.length + index;
      } else if (slideIndex >= slides.length) {
        // eslint-disable-next-line
        slideIndex = slideIndex - slides.length;
      }
      return slideIndex;
    };
    if (force) {
      swiper.slides.filter(el => el.matches(`.${swiper.params.slideClass}, swiper-slide`)).forEach(slideEl => {
        slideEl.remove();
      });
    } else {
      for (let i = previousFrom; i <= previousTo; i += 1) {
        if (i < from || i > to) {
          const slideIndex = getSlideIndex(i);
          swiper.slides.filter(el => el.matches(`.${swiper.params.slideClass}[data-swiper-slide-index="${slideIndex}"], swiper-slide[data-swiper-slide-index="${slideIndex}"]`)).forEach(slideEl => {
            slideEl.remove();
          });
        }
      }
    }
    const loopFrom = isLoop ? -slides.length : 0;
    const loopTo = isLoop ? slides.length * 2 : slides.length;
    for (let i = loopFrom; i < loopTo; i += 1) {
      if (i >= from && i <= to) {
        const slideIndex = getSlideIndex(i);
        if (typeof previousTo === 'undefined' || force) {
          appendIndexes.push(slideIndex);
        } else {
          if (i > previousTo) appendIndexes.push(slideIndex);
          if (i < previousFrom) prependIndexes.push(slideIndex);
        }
      }
    }
    appendIndexes.forEach(index => {
      swiper.slidesEl.append(renderSlide(slides[index], index));
    });
    if (isLoop) {
      for (let i = prependIndexes.length - 1; i >= 0; i -= 1) {
        const index = prependIndexes[i];
        swiper.slidesEl.prepend(renderSlide(slides[index], index));
      }
    } else {
      prependIndexes.sort((a, b) => b - a);
      prependIndexes.forEach(index => {
        swiper.slidesEl.prepend(renderSlide(slides[index], index));
      });
    }
    elementChildren(swiper.slidesEl, '.swiper-slide, swiper-slide').forEach(slideEl => {
      slideEl.style[offsetProp] = `${offset - Math.abs(swiper.cssOverflowAdjustment())}px`;
    });
    onRendered();
  }
  function appendSlide(slides) {
    if (typeof slides === 'object' && 'length' in slides) {
      for (let i = 0; i < slides.length; i += 1) {
        if (slides[i]) swiper.virtual.slides.push(slides[i]);
      }
    } else {
      swiper.virtual.slides.push(slides);
    }
    update(true);
  }
  function prependSlide(slides) {
    const activeIndex = swiper.activeIndex;
    let newActiveIndex = activeIndex + 1;
    let numberOfNewSlides = 1;
    if (Array.isArray(slides)) {
      for (let i = 0; i < slides.length; i += 1) {
        if (slides[i]) swiper.virtual.slides.unshift(slides[i]);
      }
      newActiveIndex = activeIndex + slides.length;
      numberOfNewSlides = slides.length;
    } else {
      swiper.virtual.slides.unshift(slides);
    }
    if (swiper.params.virtual.cache) {
      const cache = swiper.virtual.cache;
      const newCache = {};
      Object.keys(cache).forEach(cachedIndex => {
        const cachedEl = cache[cachedIndex];
        const cachedElIndex = cachedEl.getAttribute('data-swiper-slide-index');
        if (cachedElIndex) {
          cachedEl.setAttribute('data-swiper-slide-index', parseInt(cachedElIndex, 10) + numberOfNewSlides);
        }
        newCache[parseInt(cachedIndex, 10) + numberOfNewSlides] = cachedEl;
      });
      swiper.virtual.cache = newCache;
    }
    update(true);
    swiper.slideTo(newActiveIndex, 0);
  }
  function removeSlide(slidesIndexes) {
    if (typeof slidesIndexes === 'undefined' || slidesIndexes === null) return;
    let activeIndex = swiper.activeIndex;
    if (Array.isArray(slidesIndexes)) {
      for (let i = slidesIndexes.length - 1; i >= 0; i -= 1) {
        if (swiper.params.virtual.cache) {
          delete swiper.virtual.cache[slidesIndexes[i]];
          // shift cache indexes
          Object.keys(swiper.virtual.cache).forEach(key => {
            if (key > slidesIndexes) {
              swiper.virtual.cache[key - 1] = swiper.virtual.cache[key];
              swiper.virtual.cache[key - 1].setAttribute('data-swiper-slide-index', key - 1);
              delete swiper.virtual.cache[key];
            }
          });
        }
        swiper.virtual.slides.splice(slidesIndexes[i], 1);
        if (slidesIndexes[i] < activeIndex) activeIndex -= 1;
        activeIndex = Math.max(activeIndex, 0);
      }
    } else {
      if (swiper.params.virtual.cache) {
        delete swiper.virtual.cache[slidesIndexes];
        // shift cache indexes
        Object.keys(swiper.virtual.cache).forEach(key => {
          if (key > slidesIndexes) {
            swiper.virtual.cache[key - 1] = swiper.virtual.cache[key];
            swiper.virtual.cache[key - 1].setAttribute('data-swiper-slide-index', key - 1);
            delete swiper.virtual.cache[key];
          }
        });
      }
      swiper.virtual.slides.splice(slidesIndexes, 1);
      if (slidesIndexes < activeIndex) activeIndex -= 1;
      activeIndex = Math.max(activeIndex, 0);
    }
    update(true);
    swiper.slideTo(activeIndex, 0);
  }
  function removeAllSlides() {
    swiper.virtual.slides = [];
    if (swiper.params.virtual.cache) {
      swiper.virtual.cache = {};
    }
    update(true);
    swiper.slideTo(0, 0);
  }
  on('beforeInit', () => {
    if (!swiper.params.virtual.enabled) return;
    let domSlidesAssigned;
    if (typeof swiper.passedParams.virtual.slides === 'undefined') {
      const slides = [...swiper.slidesEl.children].filter(el => el.matches(`.${swiper.params.slideClass}, swiper-slide`));
      if (slides && slides.length) {
        swiper.virtual.slides = [...slides];
        domSlidesAssigned = true;
        slides.forEach((slideEl, slideIndex) => {
          slideEl.setAttribute('data-swiper-slide-index', slideIndex);
          swiper.virtual.cache[slideIndex] = slideEl;
          slideEl.remove();
        });
      }
    }
    if (!domSlidesAssigned) {
      swiper.virtual.slides = swiper.params.virtual.slides;
    }
    swiper.classNames.push(`${swiper.params.containerModifierClass}virtual`);
    swiper.params.watchSlidesProgress = true;
    swiper.originalParams.watchSlidesProgress = true;
    update();
  });
  on('setTranslate', () => {
    if (!swiper.params.virtual.enabled) return;
    if (swiper.params.cssMode && !swiper._immediateVirtual) {
      clearTimeout(cssModeTimeout);
      cssModeTimeout = setTimeout(() => {
        update();
      }, 100);
    } else {
      update();
    }
  });
  on('init update resize', () => {
    if (!swiper.params.virtual.enabled) return;
    if (swiper.params.cssMode) {
      setCSSProperty(swiper.wrapperEl, '--swiper-virtual-size', `${swiper.virtualSize}px`);
    }
  });
  Object.assign(swiper.virtual, {
    appendSlide,
    prependSlide,
    removeSlide,
    removeAllSlides,
    update
  });
}



;// CONCATENATED MODULE: ./node_modules/swiper/modules/keyboard.mjs



/* eslint-disable consistent-return */
function Keyboard(_ref) {
  let {
    swiper,
    extendParams,
    on,
    emit
  } = _ref;
  const document = getDocument();
  const window = getWindow();
  swiper.keyboard = {
    enabled: false
  };
  extendParams({
    keyboard: {
      enabled: false,
      onlyInViewport: true,
      pageUpDown: true
    }
  });
  function handle(event) {
    if (!swiper.enabled) return;
    const {
      rtlTranslate: rtl
    } = swiper;
    let e = event;
    if (e.originalEvent) e = e.originalEvent; // jquery fix
    const kc = e.keyCode || e.charCode;
    const pageUpDown = swiper.params.keyboard.pageUpDown;
    const isPageUp = pageUpDown && kc === 33;
    const isPageDown = pageUpDown && kc === 34;
    const isArrowLeft = kc === 37;
    const isArrowRight = kc === 39;
    const isArrowUp = kc === 38;
    const isArrowDown = kc === 40;
    // Directions locks
    if (!swiper.allowSlideNext && (swiper.isHorizontal() && isArrowRight || swiper.isVertical() && isArrowDown || isPageDown)) {
      return false;
    }
    if (!swiper.allowSlidePrev && (swiper.isHorizontal() && isArrowLeft || swiper.isVertical() && isArrowUp || isPageUp)) {
      return false;
    }
    if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) {
      return undefined;
    }
    if (document.activeElement && document.activeElement.nodeName && (document.activeElement.nodeName.toLowerCase() === 'input' || document.activeElement.nodeName.toLowerCase() === 'textarea')) {
      return undefined;
    }
    if (swiper.params.keyboard.onlyInViewport && (isPageUp || isPageDown || isArrowLeft || isArrowRight || isArrowUp || isArrowDown)) {
      let inView = false;
      // Check that swiper should be inside of visible area of window
      if (elementParents(swiper.el, `.${swiper.params.slideClass}, swiper-slide`).length > 0 && elementParents(swiper.el, `.${swiper.params.slideActiveClass}`).length === 0) {
        return undefined;
      }
      const el = swiper.el;
      const swiperWidth = el.clientWidth;
      const swiperHeight = el.clientHeight;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const swiperOffset = elementOffset(el);
      if (rtl) swiperOffset.left -= el.scrollLeft;
      const swiperCoord = [[swiperOffset.left, swiperOffset.top], [swiperOffset.left + swiperWidth, swiperOffset.top], [swiperOffset.left, swiperOffset.top + swiperHeight], [swiperOffset.left + swiperWidth, swiperOffset.top + swiperHeight]];
      for (let i = 0; i < swiperCoord.length; i += 1) {
        const point = swiperCoord[i];
        if (point[0] >= 0 && point[0] <= windowWidth && point[1] >= 0 && point[1] <= windowHeight) {
          if (point[0] === 0 && point[1] === 0) continue; // eslint-disable-line
          inView = true;
        }
      }
      if (!inView) return undefined;
    }
    if (swiper.isHorizontal()) {
      if (isPageUp || isPageDown || isArrowLeft || isArrowRight) {
        if (e.preventDefault) e.preventDefault();else e.returnValue = false;
      }
      if ((isPageDown || isArrowRight) && !rtl || (isPageUp || isArrowLeft) && rtl) swiper.slideNext();
      if ((isPageUp || isArrowLeft) && !rtl || (isPageDown || isArrowRight) && rtl) swiper.slidePrev();
    } else {
      if (isPageUp || isPageDown || isArrowUp || isArrowDown) {
        if (e.preventDefault) e.preventDefault();else e.returnValue = false;
      }
      if (isPageDown || isArrowDown) swiper.slideNext();
      if (isPageUp || isArrowUp) swiper.slidePrev();
    }
    emit('keyPress', kc);
    return undefined;
  }
  function enable() {
    if (swiper.keyboard.enabled) return;
    document.addEventListener('keydown', handle);
    swiper.keyboard.enabled = true;
  }
  function disable() {
    if (!swiper.keyboard.enabled) return;
    document.removeEventListener('keydown', handle);
    swiper.keyboard.enabled = false;
  }
  on('init', () => {
    if (swiper.params.keyboard.enabled) {
      enable();
    }
  });
  on('destroy', () => {
    if (swiper.keyboard.enabled) {
      disable();
    }
  });
  Object.assign(swiper.keyboard, {
    enable,
    disable
  });
}



;// CONCATENATED MODULE: ./node_modules/swiper/modules/mousewheel.mjs



/* eslint-disable consistent-return */
function Mousewheel(_ref) {
  let {
    swiper,
    extendParams,
    on,
    emit
  } = _ref;
  const window = getWindow();
  extendParams({
    mousewheel: {
      enabled: false,
      releaseOnEdges: false,
      invert: false,
      forceToAxis: false,
      sensitivity: 1,
      eventsTarget: 'container',
      thresholdDelta: null,
      thresholdTime: null,
      noMousewheelClass: 'swiper-no-mousewheel'
    }
  });
  swiper.mousewheel = {
    enabled: false
  };
  let timeout;
  let lastScrollTime = now();
  let lastEventBeforeSnap;
  const recentWheelEvents = [];
  function normalize(e) {
    // Reasonable defaults
    const PIXEL_STEP = 10;
    const LINE_HEIGHT = 40;
    const PAGE_HEIGHT = 800;
    let sX = 0;
    let sY = 0; // spinX, spinY
    let pX = 0;
    let pY = 0; // pixelX, pixelY

    // Legacy
    if ('detail' in e) {
      sY = e.detail;
    }
    if ('wheelDelta' in e) {
      sY = -e.wheelDelta / 120;
    }
    if ('wheelDeltaY' in e) {
      sY = -e.wheelDeltaY / 120;
    }
    if ('wheelDeltaX' in e) {
      sX = -e.wheelDeltaX / 120;
    }

    // side scrolling on FF with DOMMouseScroll
    if ('axis' in e && e.axis === e.HORIZONTAL_AXIS) {
      sX = sY;
      sY = 0;
    }
    pX = sX * PIXEL_STEP;
    pY = sY * PIXEL_STEP;
    if ('deltaY' in e) {
      pY = e.deltaY;
    }
    if ('deltaX' in e) {
      pX = e.deltaX;
    }
    if (e.shiftKey && !pX) {
      // if user scrolls with shift he wants horizontal scroll
      pX = pY;
      pY = 0;
    }
    if ((pX || pY) && e.deltaMode) {
      if (e.deltaMode === 1) {
        // delta in LINE units
        pX *= LINE_HEIGHT;
        pY *= LINE_HEIGHT;
      } else {
        // delta in PAGE units
        pX *= PAGE_HEIGHT;
        pY *= PAGE_HEIGHT;
      }
    }

    // Fall-back if spin cannot be determined
    if (pX && !sX) {
      sX = pX < 1 ? -1 : 1;
    }
    if (pY && !sY) {
      sY = pY < 1 ? -1 : 1;
    }
    return {
      spinX: sX,
      spinY: sY,
      pixelX: pX,
      pixelY: pY
    };
  }
  function handleMouseEnter() {
    if (!swiper.enabled) return;
    swiper.mouseEntered = true;
  }
  function handleMouseLeave() {
    if (!swiper.enabled) return;
    swiper.mouseEntered = false;
  }
  function animateSlider(newEvent) {
    if (swiper.params.mousewheel.thresholdDelta && newEvent.delta < swiper.params.mousewheel.thresholdDelta) {
      // Prevent if delta of wheel scroll delta is below configured threshold
      return false;
    }
    if (swiper.params.mousewheel.thresholdTime && now() - lastScrollTime < swiper.params.mousewheel.thresholdTime) {
      // Prevent if time between scrolls is below configured threshold
      return false;
    }

    // If the movement is NOT big enough and
    // if the last time the user scrolled was too close to the current one (avoid continuously triggering the slider):
    //   Don't go any further (avoid insignificant scroll movement).
    if (newEvent.delta >= 6 && now() - lastScrollTime < 60) {
      // Return false as a default
      return true;
    }
    // If user is scrolling towards the end:
    //   If the slider hasn't hit the latest slide or
    //   if the slider is a loop and
    //   if the slider isn't moving right now:
    //     Go to next slide and
    //     emit a scroll event.
    // Else (the user is scrolling towards the beginning) and
    // if the slider hasn't hit the first slide or
    // if the slider is a loop and
    // if the slider isn't moving right now:
    //   Go to prev slide and
    //   emit a scroll event.
    if (newEvent.direction < 0) {
      if ((!swiper.isEnd || swiper.params.loop) && !swiper.animating) {
        swiper.slideNext();
        emit('scroll', newEvent.raw);
      }
    } else if ((!swiper.isBeginning || swiper.params.loop) && !swiper.animating) {
      swiper.slidePrev();
      emit('scroll', newEvent.raw);
    }
    // If you got here is because an animation has been triggered so store the current time
    lastScrollTime = new window.Date().getTime();
    // Return false as a default
    return false;
  }
  function releaseScroll(newEvent) {
    const params = swiper.params.mousewheel;
    if (newEvent.direction < 0) {
      if (swiper.isEnd && !swiper.params.loop && params.releaseOnEdges) {
        // Return true to animate scroll on edges
        return true;
      }
    } else if (swiper.isBeginning && !swiper.params.loop && params.releaseOnEdges) {
      // Return true to animate scroll on edges
      return true;
    }
    return false;
  }
  function handle(event) {
    let e = event;
    let disableParentSwiper = true;
    if (!swiper.enabled) return;

    // Ignore event if the target or its parents have the swiper-no-mousewheel class
    if (event.target.closest(`.${swiper.params.mousewheel.noMousewheelClass}`)) return;
    const params = swiper.params.mousewheel;
    if (swiper.params.cssMode) {
      e.preventDefault();
    }
    let targetEl = swiper.el;
    if (swiper.params.mousewheel.eventsTarget !== 'container') {
      targetEl = document.querySelector(swiper.params.mousewheel.eventsTarget);
    }
    const targetElContainsTarget = targetEl && targetEl.contains(e.target);
    if (!swiper.mouseEntered && !targetElContainsTarget && !params.releaseOnEdges) return true;
    if (e.originalEvent) e = e.originalEvent; // jquery fix
    let delta = 0;
    const rtlFactor = swiper.rtlTranslate ? -1 : 1;
    const data = normalize(e);
    if (params.forceToAxis) {
      if (swiper.isHorizontal()) {
        if (Math.abs(data.pixelX) > Math.abs(data.pixelY)) delta = -data.pixelX * rtlFactor;else return true;
      } else if (Math.abs(data.pixelY) > Math.abs(data.pixelX)) delta = -data.pixelY;else return true;
    } else {
      delta = Math.abs(data.pixelX) > Math.abs(data.pixelY) ? -data.pixelX * rtlFactor : -data.pixelY;
    }
    if (delta === 0) return true;
    if (params.invert) delta = -delta;

    // Get the scroll positions
    let positions = swiper.getTranslate() + delta * params.sensitivity;
    if (positions >= swiper.minTranslate()) positions = swiper.minTranslate();
    if (positions <= swiper.maxTranslate()) positions = swiper.maxTranslate();

    // When loop is true:
    //     the disableParentSwiper will be true.
    // When loop is false:
    //     if the scroll positions is not on edge,
    //     then the disableParentSwiper will be true.
    //     if the scroll on edge positions,
    //     then the disableParentSwiper will be false.
    disableParentSwiper = swiper.params.loop ? true : !(positions === swiper.minTranslate() || positions === swiper.maxTranslate());
    if (disableParentSwiper && swiper.params.nested) e.stopPropagation();
    if (!swiper.params.freeMode || !swiper.params.freeMode.enabled) {
      // Register the new event in a variable which stores the relevant data
      const newEvent = {
        time: now(),
        delta: Math.abs(delta),
        direction: Math.sign(delta),
        raw: event
      };

      // Keep the most recent events
      if (recentWheelEvents.length >= 2) {
        recentWheelEvents.shift(); // only store the last N events
      }

      const prevEvent = recentWheelEvents.length ? recentWheelEvents[recentWheelEvents.length - 1] : undefined;
      recentWheelEvents.push(newEvent);

      // If there is at least one previous recorded event:
      //   If direction has changed or
      //   if the scroll is quicker than the previous one:
      //     Animate the slider.
      // Else (this is the first time the wheel is moved):
      //     Animate the slider.
      if (prevEvent) {
        if (newEvent.direction !== prevEvent.direction || newEvent.delta > prevEvent.delta || newEvent.time > prevEvent.time + 150) {
          animateSlider(newEvent);
        }
      } else {
        animateSlider(newEvent);
      }

      // If it's time to release the scroll:
      //   Return now so you don't hit the preventDefault.
      if (releaseScroll(newEvent)) {
        return true;
      }
    } else {
      // Freemode or scrollContainer:

      // If we recently snapped after a momentum scroll, then ignore wheel events
      // to give time for the deceleration to finish. Stop ignoring after 500 msecs
      // or if it's a new scroll (larger delta or inverse sign as last event before
      // an end-of-momentum snap).
      const newEvent = {
        time: now(),
        delta: Math.abs(delta),
        direction: Math.sign(delta)
      };
      const ignoreWheelEvents = lastEventBeforeSnap && newEvent.time < lastEventBeforeSnap.time + 500 && newEvent.delta <= lastEventBeforeSnap.delta && newEvent.direction === lastEventBeforeSnap.direction;
      if (!ignoreWheelEvents) {
        lastEventBeforeSnap = undefined;
        let position = swiper.getTranslate() + delta * params.sensitivity;
        const wasBeginning = swiper.isBeginning;
        const wasEnd = swiper.isEnd;
        if (position >= swiper.minTranslate()) position = swiper.minTranslate();
        if (position <= swiper.maxTranslate()) position = swiper.maxTranslate();
        swiper.setTransition(0);
        swiper.setTranslate(position);
        swiper.updateProgress();
        swiper.updateActiveIndex();
        swiper.updateSlidesClasses();
        if (!wasBeginning && swiper.isBeginning || !wasEnd && swiper.isEnd) {
          swiper.updateSlidesClasses();
        }
        if (swiper.params.loop) {
          swiper.loopFix({
            direction: newEvent.direction < 0 ? 'next' : 'prev',
            byMousewheel: true
          });
        }
        if (swiper.params.freeMode.sticky) {
          // When wheel scrolling starts with sticky (aka snap) enabled, then detect
          // the end of a momentum scroll by storing recent (N=15?) wheel events.
          // 1. do all N events have decreasing or same (absolute value) delta?
          // 2. did all N events arrive in the last M (M=500?) msecs?
          // 3. does the earliest event have an (absolute value) delta that's
          //    at least P (P=1?) larger than the most recent event's delta?
          // 4. does the latest event have a delta that's smaller than Q (Q=6?) pixels?
          // If 1-4 are "yes" then we're near the end of a momentum scroll deceleration.
          // Snap immediately and ignore remaining wheel events in this scroll.
          // See comment above for "remaining wheel events in this scroll" determination.
          // If 1-4 aren't satisfied, then wait to snap until 500ms after the last event.
          clearTimeout(timeout);
          timeout = undefined;
          if (recentWheelEvents.length >= 15) {
            recentWheelEvents.shift(); // only store the last N events
          }

          const prevEvent = recentWheelEvents.length ? recentWheelEvents[recentWheelEvents.length - 1] : undefined;
          const firstEvent = recentWheelEvents[0];
          recentWheelEvents.push(newEvent);
          if (prevEvent && (newEvent.delta > prevEvent.delta || newEvent.direction !== prevEvent.direction)) {
            // Increasing or reverse-sign delta means the user started scrolling again. Clear the wheel event log.
            recentWheelEvents.splice(0);
          } else if (recentWheelEvents.length >= 15 && newEvent.time - firstEvent.time < 500 && firstEvent.delta - newEvent.delta >= 1 && newEvent.delta <= 6) {
            // We're at the end of the deceleration of a momentum scroll, so there's no need
            // to wait for more events. Snap ASAP on the next tick.
            // Also, because there's some remaining momentum we'll bias the snap in the
            // direction of the ongoing scroll because it's better UX for the scroll to snap
            // in the same direction as the scroll instead of reversing to snap.  Therefore,
            // if it's already scrolled more than 20% in the current direction, keep going.
            const snapToThreshold = delta > 0 ? 0.8 : 0.2;
            lastEventBeforeSnap = newEvent;
            recentWheelEvents.splice(0);
            timeout = nextTick(() => {
              swiper.slideToClosest(swiper.params.speed, true, undefined, snapToThreshold);
            }, 0); // no delay; move on next tick
          }

          if (!timeout) {
            // if we get here, then we haven't detected the end of a momentum scroll, so
            // we'll consider a scroll "complete" when there haven't been any wheel events
            // for 500ms.
            timeout = nextTick(() => {
              const snapToThreshold = 0.5;
              lastEventBeforeSnap = newEvent;
              recentWheelEvents.splice(0);
              swiper.slideToClosest(swiper.params.speed, true, undefined, snapToThreshold);
            }, 500);
          }
        }

        // Emit event
        if (!ignoreWheelEvents) emit('scroll', e);

        // Stop autoplay
        if (swiper.params.autoplay && swiper.params.autoplayDisableOnInteraction) swiper.autoplay.stop();
        // Return page scroll on edge positions
        if (params.releaseOnEdges && (position === swiper.minTranslate() || position === swiper.maxTranslate())) {
          return true;
        }
      }
    }
    if (e.preventDefault) e.preventDefault();else e.returnValue = false;
    return false;
  }
  function events(method) {
    let targetEl = swiper.el;
    if (swiper.params.mousewheel.eventsTarget !== 'container') {
      targetEl = document.querySelector(swiper.params.mousewheel.eventsTarget);
    }
    targetEl[method]('mouseenter', handleMouseEnter);
    targetEl[method]('mouseleave', handleMouseLeave);
    targetEl[method]('wheel', handle);
  }
  function enable() {
    if (swiper.params.cssMode) {
      swiper.wrapperEl.removeEventListener('wheel', handle);
      return true;
    }
    if (swiper.mousewheel.enabled) return false;
    events('addEventListener');
    swiper.mousewheel.enabled = true;
    return true;
  }
  function disable() {
    if (swiper.params.cssMode) {
      swiper.wrapperEl.addEventListener(event, handle);
      return true;
    }
    if (!swiper.mousewheel.enabled) return false;
    events('removeEventListener');
    swiper.mousewheel.enabled = false;
    return true;
  }
  on('init', () => {
    if (!swiper.params.mousewheel.enabled && swiper.params.cssMode) {
      disable();
    }
    if (swiper.params.mousewheel.enabled) enable();
  });
  on('destroy', () => {
    if (swiper.params.cssMode) {
      enable();
    }
    if (swiper.mousewheel.enabled) disable();
  });
  Object.assign(swiper.mousewheel, {
    enable,
    disable
  });
}



;// CONCATENATED MODULE: ./node_modules/swiper/shared/create-element-if-not-defined.mjs


function createElementIfNotDefined(swiper, originalParams, params, checkProps) {
  if (swiper.params.createElements) {
    Object.keys(checkProps).forEach(key => {
      if (!params[key] && params.auto === true) {
        let element = elementChildren(swiper.el, `.${checkProps[key]}`)[0];
        if (!element) {
          element = createElement('div', checkProps[key]);
          element.className = checkProps[key];
          swiper.el.append(element);
        }
        params[key] = element;
        originalParams[key] = element;
      }
    });
  }
  return params;
}



;// CONCATENATED MODULE: ./node_modules/swiper/modules/navigation.mjs


function Navigation(_ref) {
  let {
    swiper,
    extendParams,
    on,
    emit
  } = _ref;
  extendParams({
    navigation: {
      nextEl: null,
      prevEl: null,
      hideOnClick: false,
      disabledClass: 'swiper-button-disabled',
      hiddenClass: 'swiper-button-hidden',
      lockClass: 'swiper-button-lock',
      navigationDisabledClass: 'swiper-navigation-disabled'
    }
  });
  swiper.navigation = {
    nextEl: null,
    prevEl: null
  };
  const makeElementsArray = el => (Array.isArray(el) ? el : [el]).filter(e => !!e);
  function getEl(el) {
    let res;
    if (el && typeof el === 'string' && swiper.isElement) {
      res = swiper.el.querySelector(el);
      if (res) return res;
    }
    if (el) {
      if (typeof el === 'string') res = [...document.querySelectorAll(el)];
      if (swiper.params.uniqueNavElements && typeof el === 'string' && res.length > 1 && swiper.el.querySelectorAll(el).length === 1) {
        res = swiper.el.querySelector(el);
      }
    }
    if (el && !res) return el;
    // if (Array.isArray(res) && res.length === 1) res = res[0];
    return res;
  }
  function toggleEl(el, disabled) {
    const params = swiper.params.navigation;
    el = makeElementsArray(el);
    el.forEach(subEl => {
      if (subEl) {
        subEl.classList[disabled ? 'add' : 'remove'](...params.disabledClass.split(' '));
        if (subEl.tagName === 'BUTTON') subEl.disabled = disabled;
        if (swiper.params.watchOverflow && swiper.enabled) {
          subEl.classList[swiper.isLocked ? 'add' : 'remove'](params.lockClass);
        }
      }
    });
  }
  function update() {
    // Update Navigation Buttons
    const {
      nextEl,
      prevEl
    } = swiper.navigation;
    if (swiper.params.loop) {
      toggleEl(prevEl, false);
      toggleEl(nextEl, false);
      return;
    }
    toggleEl(prevEl, swiper.isBeginning && !swiper.params.rewind);
    toggleEl(nextEl, swiper.isEnd && !swiper.params.rewind);
  }
  function onPrevClick(e) {
    e.preventDefault();
    if (swiper.isBeginning && !swiper.params.loop && !swiper.params.rewind) return;
    swiper.slidePrev();
    emit('navigationPrev');
  }
  function onNextClick(e) {
    e.preventDefault();
    if (swiper.isEnd && !swiper.params.loop && !swiper.params.rewind) return;
    swiper.slideNext();
    emit('navigationNext');
  }
  function init() {
    const params = swiper.params.navigation;
    swiper.params.navigation = createElementIfNotDefined(swiper, swiper.originalParams.navigation, swiper.params.navigation, {
      nextEl: 'swiper-button-next',
      prevEl: 'swiper-button-prev'
    });
    if (!(params.nextEl || params.prevEl)) return;
    let nextEl = getEl(params.nextEl);
    let prevEl = getEl(params.prevEl);
    Object.assign(swiper.navigation, {
      nextEl,
      prevEl
    });
    nextEl = makeElementsArray(nextEl);
    prevEl = makeElementsArray(prevEl);
    const initButton = (el, dir) => {
      if (el) {
        el.addEventListener('click', dir === 'next' ? onNextClick : onPrevClick);
      }
      if (!swiper.enabled && el) {
        el.classList.add(...params.lockClass.split(' '));
      }
    };
    nextEl.forEach(el => initButton(el, 'next'));
    prevEl.forEach(el => initButton(el, 'prev'));
  }
  function destroy() {
    let {
      nextEl,
      prevEl
    } = swiper.navigation;
    nextEl = makeElementsArray(nextEl);
    prevEl = makeElementsArray(prevEl);
    const destroyButton = (el, dir) => {
      el.removeEventListener('click', dir === 'next' ? onNextClick : onPrevClick);
      el.classList.remove(...swiper.params.navigation.disabledClass.split(' '));
    };
    nextEl.forEach(el => destroyButton(el, 'next'));
    prevEl.forEach(el => destroyButton(el, 'prev'));
  }
  on('init', () => {
    if (swiper.params.navigation.enabled === false) {
      // eslint-disable-next-line
      disable();
    } else {
      init();
      update();
    }
  });
  on('toEdge fromEdge lock unlock', () => {
    update();
  });
  on('destroy', () => {
    destroy();
  });
  on('enable disable', () => {
    let {
      nextEl,
      prevEl
    } = swiper.navigation;
    nextEl = makeElementsArray(nextEl);
    prevEl = makeElementsArray(prevEl);
    if (swiper.enabled) {
      update();
      return;
    }
    [...nextEl, ...prevEl].filter(el => !!el).forEach(el => el.classList.add(swiper.params.navigation.lockClass));
  });
  on('click', (_s, e) => {
    let {
      nextEl,
      prevEl
    } = swiper.navigation;
    nextEl = makeElementsArray(nextEl);
    prevEl = makeElementsArray(prevEl);
    const targetEl = e.target;
    if (swiper.params.navigation.hideOnClick && !prevEl.includes(targetEl) && !nextEl.includes(targetEl)) {
      if (swiper.pagination && swiper.params.pagination && swiper.params.pagination.clickable && (swiper.pagination.el === targetEl || swiper.pagination.el.contains(targetEl))) return;
      let isHidden;
      if (nextEl.length) {
        isHidden = nextEl[0].classList.contains(swiper.params.navigation.hiddenClass);
      } else if (prevEl.length) {
        isHidden = prevEl[0].classList.contains(swiper.params.navigation.hiddenClass);
      }
      if (isHidden === true) {
        emit('navigationShow');
      } else {
        emit('navigationHide');
      }
      [...nextEl, ...prevEl].filter(el => !!el).forEach(el => el.classList.toggle(swiper.params.navigation.hiddenClass));
    }
  });
  const enable = () => {
    swiper.el.classList.remove(...swiper.params.navigation.navigationDisabledClass.split(' '));
    init();
    update();
  };
  const disable = () => {
    swiper.el.classList.add(...swiper.params.navigation.navigationDisabledClass.split(' '));
    destroy();
  };
  Object.assign(swiper.navigation, {
    enable,
    disable,
    update,
    init,
    destroy
  });
}



;// CONCATENATED MODULE: ./node_modules/swiper/shared/classes-to-selector.mjs
function classesToSelector(classes) {
  if (classes === void 0) {
    classes = '';
  }
  return `.${classes.trim().replace(/([\.:!+\/])/g, '\\$1') // eslint-disable-line
  .replace(/ /g, '.')}`;
}



;// CONCATENATED MODULE: ./node_modules/swiper/modules/pagination.mjs




function Pagination(_ref) {
  let {
    swiper,
    extendParams,
    on,
    emit
  } = _ref;
  const pfx = 'swiper-pagination';
  extendParams({
    pagination: {
      el: null,
      bulletElement: 'span',
      clickable: false,
      hideOnClick: false,
      renderBullet: null,
      renderProgressbar: null,
      renderFraction: null,
      renderCustom: null,
      progressbarOpposite: false,
      type: 'bullets',
      // 'bullets' or 'progressbar' or 'fraction' or 'custom'
      dynamicBullets: false,
      dynamicMainBullets: 1,
      formatFractionCurrent: number => number,
      formatFractionTotal: number => number,
      bulletClass: `${pfx}-bullet`,
      bulletActiveClass: `${pfx}-bullet-active`,
      modifierClass: `${pfx}-`,
      currentClass: `${pfx}-current`,
      totalClass: `${pfx}-total`,
      hiddenClass: `${pfx}-hidden`,
      progressbarFillClass: `${pfx}-progressbar-fill`,
      progressbarOppositeClass: `${pfx}-progressbar-opposite`,
      clickableClass: `${pfx}-clickable`,
      lockClass: `${pfx}-lock`,
      horizontalClass: `${pfx}-horizontal`,
      verticalClass: `${pfx}-vertical`,
      paginationDisabledClass: `${pfx}-disabled`
    }
  });
  swiper.pagination = {
    el: null,
    bullets: []
  };
  let bulletSize;
  let dynamicBulletIndex = 0;
  const makeElementsArray = el => (Array.isArray(el) ? el : [el]).filter(e => !!e);
  function isPaginationDisabled() {
    return !swiper.params.pagination.el || !swiper.pagination.el || Array.isArray(swiper.pagination.el) && swiper.pagination.el.length === 0;
  }
  function setSideBullets(bulletEl, position) {
    const {
      bulletActiveClass
    } = swiper.params.pagination;
    if (!bulletEl) return;
    bulletEl = bulletEl[`${position === 'prev' ? 'previous' : 'next'}ElementSibling`];
    if (bulletEl) {
      bulletEl.classList.add(`${bulletActiveClass}-${position}`);
      bulletEl = bulletEl[`${position === 'prev' ? 'previous' : 'next'}ElementSibling`];
      if (bulletEl) {
        bulletEl.classList.add(`${bulletActiveClass}-${position}-${position}`);
      }
    }
  }
  function onBulletClick(e) {
    const bulletEl = e.target.closest(classesToSelector(swiper.params.pagination.bulletClass));
    if (!bulletEl) {
      return;
    }
    e.preventDefault();
    const index = elementIndex(bulletEl) * swiper.params.slidesPerGroup;
    if (swiper.params.loop) {
      if (swiper.realIndex === index) return;
      swiper.slideToLoop(index);
    } else {
      swiper.slideTo(index);
    }
  }
  function update() {
    // Render || Update Pagination bullets/items
    const rtl = swiper.rtl;
    const params = swiper.params.pagination;
    if (isPaginationDisabled()) return;
    let el = swiper.pagination.el;
    el = makeElementsArray(el);
    // Current/Total
    let current;
    let previousIndex;
    const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;
    const total = swiper.params.loop ? Math.ceil(slidesLength / swiper.params.slidesPerGroup) : swiper.snapGrid.length;
    if (swiper.params.loop) {
      previousIndex = swiper.previousRealIndex || 0;
      current = swiper.params.slidesPerGroup > 1 ? Math.floor(swiper.realIndex / swiper.params.slidesPerGroup) : swiper.realIndex;
    } else if (typeof swiper.snapIndex !== 'undefined') {
      current = swiper.snapIndex;
      previousIndex = swiper.previousSnapIndex;
    } else {
      previousIndex = swiper.previousIndex || 0;
      current = swiper.activeIndex || 0;
    }
    // Types
    if (params.type === 'bullets' && swiper.pagination.bullets && swiper.pagination.bullets.length > 0) {
      const bullets = swiper.pagination.bullets;
      let firstIndex;
      let lastIndex;
      let midIndex;
      if (params.dynamicBullets) {
        bulletSize = elementOuterSize(bullets[0], swiper.isHorizontal() ? 'width' : 'height', true);
        el.forEach(subEl => {
          subEl.style[swiper.isHorizontal() ? 'width' : 'height'] = `${bulletSize * (params.dynamicMainBullets + 4)}px`;
        });
        if (params.dynamicMainBullets > 1 && previousIndex !== undefined) {
          dynamicBulletIndex += current - (previousIndex || 0);
          if (dynamicBulletIndex > params.dynamicMainBullets - 1) {
            dynamicBulletIndex = params.dynamicMainBullets - 1;
          } else if (dynamicBulletIndex < 0) {
            dynamicBulletIndex = 0;
          }
        }
        firstIndex = Math.max(current - dynamicBulletIndex, 0);
        lastIndex = firstIndex + (Math.min(bullets.length, params.dynamicMainBullets) - 1);
        midIndex = (lastIndex + firstIndex) / 2;
      }
      bullets.forEach(bulletEl => {
        const classesToRemove = [...['', '-next', '-next-next', '-prev', '-prev-prev', '-main'].map(suffix => `${params.bulletActiveClass}${suffix}`)].map(s => typeof s === 'string' && s.includes(' ') ? s.split(' ') : s).flat();
        bulletEl.classList.remove(...classesToRemove);
      });
      if (el.length > 1) {
        bullets.forEach(bullet => {
          const bulletIndex = elementIndex(bullet);
          if (bulletIndex === current) {
            bullet.classList.add(...params.bulletActiveClass.split(' '));
          } else if (swiper.isElement) {
            bullet.setAttribute('part', 'bullet');
          }
          if (params.dynamicBullets) {
            if (bulletIndex >= firstIndex && bulletIndex <= lastIndex) {
              bullet.classList.add(...`${params.bulletActiveClass}-main`.split(' '));
            }
            if (bulletIndex === firstIndex) {
              setSideBullets(bullet, 'prev');
            }
            if (bulletIndex === lastIndex) {
              setSideBullets(bullet, 'next');
            }
          }
        });
      } else {
        const bullet = bullets[current];
        if (bullet) {
          bullet.classList.add(...params.bulletActiveClass.split(' '));
        }
        if (swiper.isElement) {
          bullets.forEach((bulletEl, bulletIndex) => {
            bulletEl.setAttribute('part', bulletIndex === current ? 'bullet-active' : 'bullet');
          });
        }
        if (params.dynamicBullets) {
          const firstDisplayedBullet = bullets[firstIndex];
          const lastDisplayedBullet = bullets[lastIndex];
          for (let i = firstIndex; i <= lastIndex; i += 1) {
            if (bullets[i]) {
              bullets[i].classList.add(...`${params.bulletActiveClass}-main`.split(' '));
            }
          }
          setSideBullets(firstDisplayedBullet, 'prev');
          setSideBullets(lastDisplayedBullet, 'next');
        }
      }
      if (params.dynamicBullets) {
        const dynamicBulletsLength = Math.min(bullets.length, params.dynamicMainBullets + 4);
        const bulletsOffset = (bulletSize * dynamicBulletsLength - bulletSize) / 2 - midIndex * bulletSize;
        const offsetProp = rtl ? 'right' : 'left';
        bullets.forEach(bullet => {
          bullet.style[swiper.isHorizontal() ? offsetProp : 'top'] = `${bulletsOffset}px`;
        });
      }
    }
    el.forEach((subEl, subElIndex) => {
      if (params.type === 'fraction') {
        subEl.querySelectorAll(classesToSelector(params.currentClass)).forEach(fractionEl => {
          fractionEl.textContent = params.formatFractionCurrent(current + 1);
        });
        subEl.querySelectorAll(classesToSelector(params.totalClass)).forEach(totalEl => {
          totalEl.textContent = params.formatFractionTotal(total);
        });
      }
      if (params.type === 'progressbar') {
        let progressbarDirection;
        if (params.progressbarOpposite) {
          progressbarDirection = swiper.isHorizontal() ? 'vertical' : 'horizontal';
        } else {
          progressbarDirection = swiper.isHorizontal() ? 'horizontal' : 'vertical';
        }
        const scale = (current + 1) / total;
        let scaleX = 1;
        let scaleY = 1;
        if (progressbarDirection === 'horizontal') {
          scaleX = scale;
        } else {
          scaleY = scale;
        }
        subEl.querySelectorAll(classesToSelector(params.progressbarFillClass)).forEach(progressEl => {
          progressEl.style.transform = `translate3d(0,0,0) scaleX(${scaleX}) scaleY(${scaleY})`;
          progressEl.style.transitionDuration = `${swiper.params.speed}ms`;
        });
      }
      if (params.type === 'custom' && params.renderCustom) {
        subEl.innerHTML = params.renderCustom(swiper, current + 1, total);
        if (subElIndex === 0) emit('paginationRender', subEl);
      } else {
        if (subElIndex === 0) emit('paginationRender', subEl);
        emit('paginationUpdate', subEl);
      }
      if (swiper.params.watchOverflow && swiper.enabled) {
        subEl.classList[swiper.isLocked ? 'add' : 'remove'](params.lockClass);
      }
    });
  }
  function render() {
    // Render Container
    const params = swiper.params.pagination;
    if (isPaginationDisabled()) return;
    const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.grid && swiper.params.grid.rows > 1 ? swiper.slides.length / Math.ceil(swiper.params.grid.rows) : swiper.slides.length;
    let el = swiper.pagination.el;
    el = makeElementsArray(el);
    let paginationHTML = '';
    if (params.type === 'bullets') {
      let numberOfBullets = swiper.params.loop ? Math.ceil(slidesLength / swiper.params.slidesPerGroup) : swiper.snapGrid.length;
      if (swiper.params.freeMode && swiper.params.freeMode.enabled && numberOfBullets > slidesLength) {
        numberOfBullets = slidesLength;
      }
      for (let i = 0; i < numberOfBullets; i += 1) {
        if (params.renderBullet) {
          paginationHTML += params.renderBullet.call(swiper, i, params.bulletClass);
        } else {
          // prettier-ignore
          paginationHTML += `<${params.bulletElement} ${swiper.isElement ? 'part="bullet"' : ''} class="${params.bulletClass}"></${params.bulletElement}>`;
        }
      }
    }
    if (params.type === 'fraction') {
      if (params.renderFraction) {
        paginationHTML = params.renderFraction.call(swiper, params.currentClass, params.totalClass);
      } else {
        paginationHTML = `<span class="${params.currentClass}"></span>` + ' / ' + `<span class="${params.totalClass}"></span>`;
      }
    }
    if (params.type === 'progressbar') {
      if (params.renderProgressbar) {
        paginationHTML = params.renderProgressbar.call(swiper, params.progressbarFillClass);
      } else {
        paginationHTML = `<span class="${params.progressbarFillClass}"></span>`;
      }
    }
    swiper.pagination.bullets = [];
    el.forEach(subEl => {
      if (params.type !== 'custom') {
        subEl.innerHTML = paginationHTML || '';
      }
      if (params.type === 'bullets') {
        swiper.pagination.bullets.push(...subEl.querySelectorAll(classesToSelector(params.bulletClass)));
      }
    });
    if (params.type !== 'custom') {
      emit('paginationRender', el[0]);
    }
  }
  function init() {
    swiper.params.pagination = createElementIfNotDefined(swiper, swiper.originalParams.pagination, swiper.params.pagination, {
      el: 'swiper-pagination'
    });
    const params = swiper.params.pagination;
    if (!params.el) return;
    let el;
    if (typeof params.el === 'string' && swiper.isElement) {
      el = swiper.el.querySelector(params.el);
    }
    if (!el && typeof params.el === 'string') {
      el = [...document.querySelectorAll(params.el)];
    }
    if (!el) {
      el = params.el;
    }
    if (!el || el.length === 0) return;
    if (swiper.params.uniqueNavElements && typeof params.el === 'string' && Array.isArray(el) && el.length > 1) {
      el = [...swiper.el.querySelectorAll(params.el)];
      // check if it belongs to another nested Swiper
      if (el.length > 1) {
        el = el.filter(subEl => {
          if (elementParents(subEl, '.swiper')[0] !== swiper.el) return false;
          return true;
        })[0];
      }
    }
    if (Array.isArray(el) && el.length === 1) el = el[0];
    Object.assign(swiper.pagination, {
      el
    });
    el = makeElementsArray(el);
    el.forEach(subEl => {
      if (params.type === 'bullets' && params.clickable) {
        subEl.classList.add(...(params.clickableClass || '').split(' '));
      }
      subEl.classList.add(params.modifierClass + params.type);
      subEl.classList.add(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
      if (params.type === 'bullets' && params.dynamicBullets) {
        subEl.classList.add(`${params.modifierClass}${params.type}-dynamic`);
        dynamicBulletIndex = 0;
        if (params.dynamicMainBullets < 1) {
          params.dynamicMainBullets = 1;
        }
      }
      if (params.type === 'progressbar' && params.progressbarOpposite) {
        subEl.classList.add(params.progressbarOppositeClass);
      }
      if (params.clickable) {
        subEl.addEventListener('click', onBulletClick);
      }
      if (!swiper.enabled) {
        subEl.classList.add(params.lockClass);
      }
    });
  }
  function destroy() {
    const params = swiper.params.pagination;
    if (isPaginationDisabled()) return;
    let el = swiper.pagination.el;
    if (el) {
      el = makeElementsArray(el);
      el.forEach(subEl => {
        subEl.classList.remove(params.hiddenClass);
        subEl.classList.remove(params.modifierClass + params.type);
        subEl.classList.remove(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
        if (params.clickable) {
          subEl.classList.remove(...(params.clickableClass || '').split(' '));
          subEl.removeEventListener('click', onBulletClick);
        }
      });
    }
    if (swiper.pagination.bullets) swiper.pagination.bullets.forEach(subEl => subEl.classList.remove(...params.bulletActiveClass.split(' ')));
  }
  on('changeDirection', () => {
    if (!swiper.pagination || !swiper.pagination.el) return;
    const params = swiper.params.pagination;
    let {
      el
    } = swiper.pagination;
    el = makeElementsArray(el);
    el.forEach(subEl => {
      subEl.classList.remove(params.horizontalClass, params.verticalClass);
      subEl.classList.add(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
    });
  });
  on('init', () => {
    if (swiper.params.pagination.enabled === false) {
      // eslint-disable-next-line
      disable();
    } else {
      init();
      render();
      update();
    }
  });
  on('activeIndexChange', () => {
    if (typeof swiper.snapIndex === 'undefined') {
      update();
    }
  });
  on('snapIndexChange', () => {
    update();
  });
  on('snapGridLengthChange', () => {
    render();
    update();
  });
  on('destroy', () => {
    destroy();
  });
  on('enable disable', () => {
    let {
      el
    } = swiper.pagination;
    if (el) {
      el = makeElementsArray(el);
      el.forEach(subEl => subEl.classList[swiper.enabled ? 'remove' : 'add'](swiper.params.pagination.lockClass));
    }
  });
  on('lock unlock', () => {
    update();
  });
  on('click', (_s, e) => {
    const targetEl = e.target;
    const el = makeElementsArray(swiper.pagination.el);
    if (swiper.params.pagination.el && swiper.params.pagination.hideOnClick && el && el.length > 0 && !targetEl.classList.contains(swiper.params.pagination.bulletClass)) {
      if (swiper.navigation && (swiper.navigation.nextEl && targetEl === swiper.navigation.nextEl || swiper.navigation.prevEl && targetEl === swiper.navigation.prevEl)) return;
      const isHidden = el[0].classList.contains(swiper.params.pagination.hiddenClass);
      if (isHidden === true) {
        emit('paginationShow');
      } else {
        emit('paginationHide');
      }
      el.forEach(subEl => subEl.classList.toggle(swiper.params.pagination.hiddenClass));
    }
  });
  const enable = () => {
    swiper.el.classList.remove(swiper.params.pagination.paginationDisabledClass);
    let {
      el
    } = swiper.pagination;
    if (el) {
      el = makeElementsArray(el);
      el.forEach(subEl => subEl.classList.remove(swiper.params.pagination.paginationDisabledClass));
    }
    init();
    render();
    update();
  };
  const disable = () => {
    swiper.el.classList.add(swiper.params.pagination.paginationDisabledClass);
    let {
      el
    } = swiper.pagination;
    if (el) {
      el = makeElementsArray(el);
      el.forEach(subEl => subEl.classList.add(swiper.params.pagination.paginationDisabledClass));
    }
    destroy();
  };
  Object.assign(swiper.pagination, {
    enable,
    disable,
    render,
    update,
    init,
    destroy
  });
}



;// CONCATENATED MODULE: ./node_modules/swiper/modules/scrollbar.mjs





function Scrollbar(_ref) {
  let {
    swiper,
    extendParams,
    on,
    emit
  } = _ref;
  const document = getDocument();
  let isTouched = false;
  let timeout = null;
  let dragTimeout = null;
  let dragStartPos;
  let dragSize;
  let trackSize;
  let divider;
  extendParams({
    scrollbar: {
      el: null,
      dragSize: 'auto',
      hide: false,
      draggable: false,
      snapOnRelease: true,
      lockClass: 'swiper-scrollbar-lock',
      dragClass: 'swiper-scrollbar-drag',
      scrollbarDisabledClass: 'swiper-scrollbar-disabled',
      horizontalClass: `swiper-scrollbar-horizontal`,
      verticalClass: `swiper-scrollbar-vertical`
    }
  });
  swiper.scrollbar = {
    el: null,
    dragEl: null
  };
  function setTranslate() {
    if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
    const {
      scrollbar,
      rtlTranslate: rtl
    } = swiper;
    const {
      dragEl,
      el
    } = scrollbar;
    const params = swiper.params.scrollbar;
    const progress = swiper.params.loop ? swiper.progressLoop : swiper.progress;
    let newSize = dragSize;
    let newPos = (trackSize - dragSize) * progress;
    if (rtl) {
      newPos = -newPos;
      if (newPos > 0) {
        newSize = dragSize - newPos;
        newPos = 0;
      } else if (-newPos + dragSize > trackSize) {
        newSize = trackSize + newPos;
      }
    } else if (newPos < 0) {
      newSize = dragSize + newPos;
      newPos = 0;
    } else if (newPos + dragSize > trackSize) {
      newSize = trackSize - newPos;
    }
    if (swiper.isHorizontal()) {
      dragEl.style.transform = `translate3d(${newPos}px, 0, 0)`;
      dragEl.style.width = `${newSize}px`;
    } else {
      dragEl.style.transform = `translate3d(0px, ${newPos}px, 0)`;
      dragEl.style.height = `${newSize}px`;
    }
    if (params.hide) {
      clearTimeout(timeout);
      el.style.opacity = 1;
      timeout = setTimeout(() => {
        el.style.opacity = 0;
        el.style.transitionDuration = '400ms';
      }, 1000);
    }
  }
  function setTransition(duration) {
    if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
    swiper.scrollbar.dragEl.style.transitionDuration = `${duration}ms`;
  }
  function updateSize() {
    if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
    const {
      scrollbar
    } = swiper;
    const {
      dragEl,
      el
    } = scrollbar;
    dragEl.style.width = '';
    dragEl.style.height = '';
    trackSize = swiper.isHorizontal() ? el.offsetWidth : el.offsetHeight;
    divider = swiper.size / (swiper.virtualSize + swiper.params.slidesOffsetBefore - (swiper.params.centeredSlides ? swiper.snapGrid[0] : 0));
    if (swiper.params.scrollbar.dragSize === 'auto') {
      dragSize = trackSize * divider;
    } else {
      dragSize = parseInt(swiper.params.scrollbar.dragSize, 10);
    }
    if (swiper.isHorizontal()) {
      dragEl.style.width = `${dragSize}px`;
    } else {
      dragEl.style.height = `${dragSize}px`;
    }
    if (divider >= 1) {
      el.style.display = 'none';
    } else {
      el.style.display = '';
    }
    if (swiper.params.scrollbar.hide) {
      el.style.opacity = 0;
    }
    if (swiper.params.watchOverflow && swiper.enabled) {
      scrollbar.el.classList[swiper.isLocked ? 'add' : 'remove'](swiper.params.scrollbar.lockClass);
    }
  }
  function getPointerPosition(e) {
    return swiper.isHorizontal() ? e.clientX : e.clientY;
  }
  function setDragPosition(e) {
    const {
      scrollbar,
      rtlTranslate: rtl
    } = swiper;
    const {
      el
    } = scrollbar;
    let positionRatio;
    positionRatio = (getPointerPosition(e) - elementOffset(el)[swiper.isHorizontal() ? 'left' : 'top'] - (dragStartPos !== null ? dragStartPos : dragSize / 2)) / (trackSize - dragSize);
    positionRatio = Math.max(Math.min(positionRatio, 1), 0);
    if (rtl) {
      positionRatio = 1 - positionRatio;
    }
    const position = swiper.minTranslate() + (swiper.maxTranslate() - swiper.minTranslate()) * positionRatio;
    swiper.updateProgress(position);
    swiper.setTranslate(position);
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();
  }
  function onDragStart(e) {
    const params = swiper.params.scrollbar;
    const {
      scrollbar,
      wrapperEl
    } = swiper;
    const {
      el,
      dragEl
    } = scrollbar;
    isTouched = true;
    dragStartPos = e.target === dragEl ? getPointerPosition(e) - e.target.getBoundingClientRect()[swiper.isHorizontal() ? 'left' : 'top'] : null;
    e.preventDefault();
    e.stopPropagation();
    wrapperEl.style.transitionDuration = '100ms';
    dragEl.style.transitionDuration = '100ms';
    setDragPosition(e);
    clearTimeout(dragTimeout);
    el.style.transitionDuration = '0ms';
    if (params.hide) {
      el.style.opacity = 1;
    }
    if (swiper.params.cssMode) {
      swiper.wrapperEl.style['scroll-snap-type'] = 'none';
    }
    emit('scrollbarDragStart', e);
  }
  function onDragMove(e) {
    const {
      scrollbar,
      wrapperEl
    } = swiper;
    const {
      el,
      dragEl
    } = scrollbar;
    if (!isTouched) return;
    if (e.preventDefault) e.preventDefault();else e.returnValue = false;
    setDragPosition(e);
    wrapperEl.style.transitionDuration = '0ms';
    el.style.transitionDuration = '0ms';
    dragEl.style.transitionDuration = '0ms';
    emit('scrollbarDragMove', e);
  }
  function onDragEnd(e) {
    const params = swiper.params.scrollbar;
    const {
      scrollbar,
      wrapperEl
    } = swiper;
    const {
      el
    } = scrollbar;
    if (!isTouched) return;
    isTouched = false;
    if (swiper.params.cssMode) {
      swiper.wrapperEl.style['scroll-snap-type'] = '';
      wrapperEl.style.transitionDuration = '';
    }
    if (params.hide) {
      clearTimeout(dragTimeout);
      dragTimeout = nextTick(() => {
        el.style.opacity = 0;
        el.style.transitionDuration = '400ms';
      }, 1000);
    }
    emit('scrollbarDragEnd', e);
    if (params.snapOnRelease) {
      swiper.slideToClosest();
    }
  }
  function events(method) {
    const {
      scrollbar,
      params
    } = swiper;
    const el = scrollbar.el;
    if (!el) return;
    const target = el;
    const activeListener = params.passiveListeners ? {
      passive: false,
      capture: false
    } : false;
    const passiveListener = params.passiveListeners ? {
      passive: true,
      capture: false
    } : false;
    if (!target) return;
    const eventMethod = method === 'on' ? 'addEventListener' : 'removeEventListener';
    target[eventMethod]('pointerdown', onDragStart, activeListener);
    document[eventMethod]('pointermove', onDragMove, activeListener);
    document[eventMethod]('pointerup', onDragEnd, passiveListener);
  }
  function enableDraggable() {
    if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
    events('on');
  }
  function disableDraggable() {
    if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
    events('off');
  }
  function init() {
    const {
      scrollbar,
      el: swiperEl
    } = swiper;
    swiper.params.scrollbar = createElementIfNotDefined(swiper, swiper.originalParams.scrollbar, swiper.params.scrollbar, {
      el: 'swiper-scrollbar'
    });
    const params = swiper.params.scrollbar;
    if (!params.el) return;
    let el;
    if (typeof params.el === 'string' && swiper.isElement) {
      el = swiper.el.querySelector(params.el);
    }
    if (!el && typeof params.el === 'string') {
      el = document.querySelectorAll(params.el);
      if (!el.length) return;
    } else if (!el) {
      el = params.el;
    }
    if (swiper.params.uniqueNavElements && typeof params.el === 'string' && el.length > 1 && swiperEl.querySelectorAll(params.el).length === 1) {
      el = swiperEl.querySelector(params.el);
    }
    if (el.length > 0) el = el[0];
    el.classList.add(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
    let dragEl;
    if (el) {
      dragEl = el.querySelector(classesToSelector(swiper.params.scrollbar.dragClass));
      if (!dragEl) {
        dragEl = createElement('div', swiper.params.scrollbar.dragClass);
        el.append(dragEl);
      }
    }
    Object.assign(scrollbar, {
      el,
      dragEl
    });
    if (params.draggable) {
      enableDraggable();
    }
    if (el) {
      el.classList[swiper.enabled ? 'remove' : 'add'](...classesToTokens(swiper.params.scrollbar.lockClass));
    }
  }
  function destroy() {
    const params = swiper.params.scrollbar;
    const el = swiper.scrollbar.el;
    if (el) {
      el.classList.remove(...classesToTokens(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass));
    }
    disableDraggable();
  }
  on('init', () => {
    if (swiper.params.scrollbar.enabled === false) {
      // eslint-disable-next-line
      disable();
    } else {
      init();
      updateSize();
      setTranslate();
    }
  });
  on('update resize observerUpdate lock unlock', () => {
    updateSize();
  });
  on('setTranslate', () => {
    setTranslate();
  });
  on('setTransition', (_s, duration) => {
    setTransition(duration);
  });
  on('enable disable', () => {
    const {
      el
    } = swiper.scrollbar;
    if (el) {
      el.classList[swiper.enabled ? 'remove' : 'add'](...classesToTokens(swiper.params.scrollbar.lockClass));
    }
  });
  on('destroy', () => {
    destroy();
  });
  const enable = () => {
    swiper.el.classList.remove(...classesToTokens(swiper.params.scrollbar.scrollbarDisabledClass));
    if (swiper.scrollbar.el) {
      swiper.scrollbar.el.classList.remove(...classesToTokens(swiper.params.scrollbar.scrollbarDisabledClass));
    }
    init();
    updateSize();
    setTranslate();
  };
  const disable = () => {
    swiper.el.classList.add(...classesToTokens(swiper.params.scrollbar.scrollbarDisabledClass));
    if (swiper.scrollbar.el) {
      swiper.scrollbar.el.classList.add(...classesToTokens(swiper.params.scrollbar.scrollbarDisabledClass));
    }
    destroy();
  };
  Object.assign(swiper.scrollbar, {
    enable,
    disable,
    updateSize,
    setTranslate,
    init,
    destroy
  });
}



;// CONCATENATED MODULE: ./node_modules/swiper/modules/parallax.mjs


function Parallax(_ref) {
  let {
    swiper,
    extendParams,
    on
  } = _ref;
  extendParams({
    parallax: {
      enabled: false
    }
  });
  const elementsSelector = '[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]';
  const setTransform = (el, progress) => {
    const {
      rtl
    } = swiper;
    const rtlFactor = rtl ? -1 : 1;
    const p = el.getAttribute('data-swiper-parallax') || '0';
    let x = el.getAttribute('data-swiper-parallax-x');
    let y = el.getAttribute('data-swiper-parallax-y');
    const scale = el.getAttribute('data-swiper-parallax-scale');
    const opacity = el.getAttribute('data-swiper-parallax-opacity');
    const rotate = el.getAttribute('data-swiper-parallax-rotate');
    if (x || y) {
      x = x || '0';
      y = y || '0';
    } else if (swiper.isHorizontal()) {
      x = p;
      y = '0';
    } else {
      y = p;
      x = '0';
    }
    if (x.indexOf('%') >= 0) {
      x = `${parseInt(x, 10) * progress * rtlFactor}%`;
    } else {
      x = `${x * progress * rtlFactor}px`;
    }
    if (y.indexOf('%') >= 0) {
      y = `${parseInt(y, 10) * progress}%`;
    } else {
      y = `${y * progress}px`;
    }
    if (typeof opacity !== 'undefined' && opacity !== null) {
      const currentOpacity = opacity - (opacity - 1) * (1 - Math.abs(progress));
      el.style.opacity = currentOpacity;
    }
    let transform = `translate3d(${x}, ${y}, 0px)`;
    if (typeof scale !== 'undefined' && scale !== null) {
      const currentScale = scale - (scale - 1) * (1 - Math.abs(progress));
      transform += ` scale(${currentScale})`;
    }
    if (rotate && typeof rotate !== 'undefined' && rotate !== null) {
      const currentRotate = rotate * progress * -1;
      transform += ` rotate(${currentRotate}deg)`;
    }
    el.style.transform = transform;
  };
  const setTranslate = () => {
    const {
      el,
      slides,
      progress,
      snapGrid,
      isElement
    } = swiper;
    const elements = elementChildren(el, elementsSelector);
    if (swiper.isElement) {
      elements.push(...elementChildren(swiper.hostEl, elementsSelector));
    }
    elements.forEach(subEl => {
      setTransform(subEl, progress);
    });
    slides.forEach((slideEl, slideIndex) => {
      let slideProgress = slideEl.progress;
      if (swiper.params.slidesPerGroup > 1 && swiper.params.slidesPerView !== 'auto') {
        slideProgress += Math.ceil(slideIndex / 2) - progress * (snapGrid.length - 1);
      }
      slideProgress = Math.min(Math.max(slideProgress, -1), 1);
      slideEl.querySelectorAll(`${elementsSelector}, [data-swiper-parallax-rotate]`).forEach(subEl => {
        setTransform(subEl, slideProgress);
      });
    });
  };
  const setTransition = function (duration) {
    if (duration === void 0) {
      duration = swiper.params.speed;
    }
    const {
      el,
      hostEl
    } = swiper;
    const elements = [...el.querySelectorAll(elementsSelector)];
    if (swiper.isElement) {
      elements.push(...hostEl.querySelectorAll(elementsSelector));
    }
    elements.forEach(parallaxEl => {
      let parallaxDuration = parseInt(parallaxEl.getAttribute('data-swiper-parallax-duration'), 10) || duration;
      if (duration === 0) parallaxDuration = 0;
      parallaxEl.style.transitionDuration = `${parallaxDuration}ms`;
    });
  };
  on('beforeInit', () => {
    if (!swiper.params.parallax.enabled) return;
    swiper.params.watchSlidesProgress = true;
    swiper.originalParams.watchSlidesProgress = true;
  });
  on('init', () => {
    if (!swiper.params.parallax.enabled) return;
    setTranslate();
  });
  on('setTranslate', () => {
    if (!swiper.params.parallax.enabled) return;
    setTranslate();
  });
  on('setTransition', (_swiper, duration) => {
    if (!swiper.params.parallax.enabled) return;
    setTransition(duration);
  });
}



;// CONCATENATED MODULE: ./node_modules/swiper/modules/zoom.mjs



function Zoom(_ref) {
  let {
    swiper,
    extendParams,
    on,
    emit
  } = _ref;
  const window = getWindow();
  extendParams({
    zoom: {
      enabled: false,
      maxRatio: 3,
      minRatio: 1,
      toggle: true,
      containerClass: 'swiper-zoom-container',
      zoomedSlideClass: 'swiper-slide-zoomed'
    }
  });
  swiper.zoom = {
    enabled: false
  };
  let currentScale = 1;
  let isScaling = false;
  let fakeGestureTouched;
  let fakeGestureMoved;
  const evCache = [];
  const gesture = {
    originX: 0,
    originY: 0,
    slideEl: undefined,
    slideWidth: undefined,
    slideHeight: undefined,
    imageEl: undefined,
    imageWrapEl: undefined,
    maxRatio: 3
  };
  const image = {
    isTouched: undefined,
    isMoved: undefined,
    currentX: undefined,
    currentY: undefined,
    minX: undefined,
    minY: undefined,
    maxX: undefined,
    maxY: undefined,
    width: undefined,
    height: undefined,
    startX: undefined,
    startY: undefined,
    touchesStart: {},
    touchesCurrent: {}
  };
  const velocity = {
    x: undefined,
    y: undefined,
    prevPositionX: undefined,
    prevPositionY: undefined,
    prevTime: undefined
  };
  let scale = 1;
  Object.defineProperty(swiper.zoom, 'scale', {
    get() {
      return scale;
    },
    set(value) {
      if (scale !== value) {
        const imageEl = gesture.imageEl;
        const slideEl = gesture.slideEl;
        emit('zoomChange', value, imageEl, slideEl);
      }
      scale = value;
    }
  });
  function getDistanceBetweenTouches() {
    if (evCache.length < 2) return 1;
    const x1 = evCache[0].pageX;
    const y1 = evCache[0].pageY;
    const x2 = evCache[1].pageX;
    const y2 = evCache[1].pageY;
    const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    return distance;
  }
  function getScaleOrigin() {
    if (evCache.length < 2) return {
      x: null,
      y: null
    };
    const box = gesture.imageEl.getBoundingClientRect();
    return [(evCache[0].pageX + (evCache[1].pageX - evCache[0].pageX) / 2 - box.x - window.scrollX) / currentScale, (evCache[0].pageY + (evCache[1].pageY - evCache[0].pageY) / 2 - box.y - window.scrollY) / currentScale];
  }
  function getSlideSelector() {
    return swiper.isElement ? `swiper-slide` : `.${swiper.params.slideClass}`;
  }
  function eventWithinSlide(e) {
    const slideSelector = getSlideSelector();
    if (e.target.matches(slideSelector)) return true;
    if (swiper.slides.filter(slideEl => slideEl.contains(e.target)).length > 0) return true;
    return false;
  }
  function eventWithinZoomContainer(e) {
    const selector = `.${swiper.params.zoom.containerClass}`;
    if (e.target.matches(selector)) return true;
    if ([...swiper.hostEl.querySelectorAll(selector)].filter(containerEl => containerEl.contains(e.target)).length > 0) return true;
    return false;
  }

  // Events
  function onGestureStart(e) {
    if (e.pointerType === 'mouse') {
      evCache.splice(0, evCache.length);
    }
    if (!eventWithinSlide(e)) return;
    const params = swiper.params.zoom;
    fakeGestureTouched = false;
    fakeGestureMoved = false;
    evCache.push(e);
    if (evCache.length < 2) {
      return;
    }
    fakeGestureTouched = true;
    gesture.scaleStart = getDistanceBetweenTouches();
    if (!gesture.slideEl) {
      gesture.slideEl = e.target.closest(`.${swiper.params.slideClass}, swiper-slide`);
      if (!gesture.slideEl) gesture.slideEl = swiper.slides[swiper.activeIndex];
      let imageEl = gesture.slideEl.querySelector(`.${params.containerClass}`);
      if (imageEl) {
        imageEl = imageEl.querySelectorAll('picture, img, svg, canvas, .swiper-zoom-target')[0];
      }
      gesture.imageEl = imageEl;
      if (imageEl) {
        gesture.imageWrapEl = elementParents(gesture.imageEl, `.${params.containerClass}`)[0];
      } else {
        gesture.imageWrapEl = undefined;
      }
      if (!gesture.imageWrapEl) {
        gesture.imageEl = undefined;
        return;
      }
      gesture.maxRatio = gesture.imageWrapEl.getAttribute('data-swiper-zoom') || params.maxRatio;
    }
    if (gesture.imageEl) {
      const [originX, originY] = getScaleOrigin();
      gesture.originX = originX;
      gesture.originY = originY;
      gesture.imageEl.style.transitionDuration = '0ms';
    }
    isScaling = true;
  }
  function onGestureChange(e) {
    if (!eventWithinSlide(e)) return;
    const params = swiper.params.zoom;
    const zoom = swiper.zoom;
    const pointerIndex = evCache.findIndex(cachedEv => cachedEv.pointerId === e.pointerId);
    if (pointerIndex >= 0) evCache[pointerIndex] = e;
    if (evCache.length < 2) {
      return;
    }
    fakeGestureMoved = true;
    gesture.scaleMove = getDistanceBetweenTouches();
    if (!gesture.imageEl) {
      return;
    }
    zoom.scale = gesture.scaleMove / gesture.scaleStart * currentScale;
    if (zoom.scale > gesture.maxRatio) {
      zoom.scale = gesture.maxRatio - 1 + (zoom.scale - gesture.maxRatio + 1) ** 0.5;
    }
    if (zoom.scale < params.minRatio) {
      zoom.scale = params.minRatio + 1 - (params.minRatio - zoom.scale + 1) ** 0.5;
    }
    gesture.imageEl.style.transform = `translate3d(0,0,0) scale(${zoom.scale})`;
  }
  function onGestureEnd(e) {
    if (!eventWithinSlide(e)) return;
    if (e.pointerType === 'mouse' && e.type === 'pointerout') return;
    const params = swiper.params.zoom;
    const zoom = swiper.zoom;
    const pointerIndex = evCache.findIndex(cachedEv => cachedEv.pointerId === e.pointerId);
    if (pointerIndex >= 0) evCache.splice(pointerIndex, 1);
    if (!fakeGestureTouched || !fakeGestureMoved) {
      return;
    }
    fakeGestureTouched = false;
    fakeGestureMoved = false;
    if (!gesture.imageEl) return;
    zoom.scale = Math.max(Math.min(zoom.scale, gesture.maxRatio), params.minRatio);
    gesture.imageEl.style.transitionDuration = `${swiper.params.speed}ms`;
    gesture.imageEl.style.transform = `translate3d(0,0,0) scale(${zoom.scale})`;
    currentScale = zoom.scale;
    isScaling = false;
    if (zoom.scale > 1 && gesture.slideEl) {
      gesture.slideEl.classList.add(`${params.zoomedSlideClass}`);
    } else if (zoom.scale <= 1 && gesture.slideEl) {
      gesture.slideEl.classList.remove(`${params.zoomedSlideClass}`);
    }
    if (zoom.scale === 1) {
      gesture.originX = 0;
      gesture.originY = 0;
      gesture.slideEl = undefined;
    }
  }
  function onTouchStart(e) {
    const device = swiper.device;
    if (!gesture.imageEl) return;
    if (image.isTouched) return;
    if (device.android && e.cancelable) e.preventDefault();
    image.isTouched = true;
    const event = evCache.length > 0 ? evCache[0] : e;
    image.touchesStart.x = event.pageX;
    image.touchesStart.y = event.pageY;
  }
  function onTouchMove(e) {
    if (!eventWithinSlide(e) || !eventWithinZoomContainer(e)) return;
    const zoom = swiper.zoom;
    if (!gesture.imageEl) return;
    if (!image.isTouched || !gesture.slideEl) return;
    if (!image.isMoved) {
      image.width = gesture.imageEl.offsetWidth;
      image.height = gesture.imageEl.offsetHeight;
      image.startX = getTranslate(gesture.imageWrapEl, 'x') || 0;
      image.startY = getTranslate(gesture.imageWrapEl, 'y') || 0;
      gesture.slideWidth = gesture.slideEl.offsetWidth;
      gesture.slideHeight = gesture.slideEl.offsetHeight;
      gesture.imageWrapEl.style.transitionDuration = '0ms';
    }
    // Define if we need image drag
    const scaledWidth = image.width * zoom.scale;
    const scaledHeight = image.height * zoom.scale;
    if (scaledWidth < gesture.slideWidth && scaledHeight < gesture.slideHeight) return;
    image.minX = Math.min(gesture.slideWidth / 2 - scaledWidth / 2, 0);
    image.maxX = -image.minX;
    image.minY = Math.min(gesture.slideHeight / 2 - scaledHeight / 2, 0);
    image.maxY = -image.minY;
    image.touchesCurrent.x = evCache.length > 0 ? evCache[0].pageX : e.pageX;
    image.touchesCurrent.y = evCache.length > 0 ? evCache[0].pageY : e.pageY;
    const touchesDiff = Math.max(Math.abs(image.touchesCurrent.x - image.touchesStart.x), Math.abs(image.touchesCurrent.y - image.touchesStart.y));
    if (touchesDiff > 5) {
      swiper.allowClick = false;
    }
    if (!image.isMoved && !isScaling) {
      if (swiper.isHorizontal() && (Math.floor(image.minX) === Math.floor(image.startX) && image.touchesCurrent.x < image.touchesStart.x || Math.floor(image.maxX) === Math.floor(image.startX) && image.touchesCurrent.x > image.touchesStart.x)) {
        image.isTouched = false;
        return;
      }
      if (!swiper.isHorizontal() && (Math.floor(image.minY) === Math.floor(image.startY) && image.touchesCurrent.y < image.touchesStart.y || Math.floor(image.maxY) === Math.floor(image.startY) && image.touchesCurrent.y > image.touchesStart.y)) {
        image.isTouched = false;
        return;
      }
    }
    if (e.cancelable) {
      e.preventDefault();
    }
    e.stopPropagation();
    image.isMoved = true;
    const scaleRatio = (zoom.scale - currentScale) / (gesture.maxRatio - swiper.params.zoom.minRatio);
    const {
      originX,
      originY
    } = gesture;
    image.currentX = image.touchesCurrent.x - image.touchesStart.x + image.startX + scaleRatio * (image.width - originX * 2);
    image.currentY = image.touchesCurrent.y - image.touchesStart.y + image.startY + scaleRatio * (image.height - originY * 2);
    if (image.currentX < image.minX) {
      image.currentX = image.minX + 1 - (image.minX - image.currentX + 1) ** 0.8;
    }
    if (image.currentX > image.maxX) {
      image.currentX = image.maxX - 1 + (image.currentX - image.maxX + 1) ** 0.8;
    }
    if (image.currentY < image.minY) {
      image.currentY = image.minY + 1 - (image.minY - image.currentY + 1) ** 0.8;
    }
    if (image.currentY > image.maxY) {
      image.currentY = image.maxY - 1 + (image.currentY - image.maxY + 1) ** 0.8;
    }

    // Velocity
    if (!velocity.prevPositionX) velocity.prevPositionX = image.touchesCurrent.x;
    if (!velocity.prevPositionY) velocity.prevPositionY = image.touchesCurrent.y;
    if (!velocity.prevTime) velocity.prevTime = Date.now();
    velocity.x = (image.touchesCurrent.x - velocity.prevPositionX) / (Date.now() - velocity.prevTime) / 2;
    velocity.y = (image.touchesCurrent.y - velocity.prevPositionY) / (Date.now() - velocity.prevTime) / 2;
    if (Math.abs(image.touchesCurrent.x - velocity.prevPositionX) < 2) velocity.x = 0;
    if (Math.abs(image.touchesCurrent.y - velocity.prevPositionY) < 2) velocity.y = 0;
    velocity.prevPositionX = image.touchesCurrent.x;
    velocity.prevPositionY = image.touchesCurrent.y;
    velocity.prevTime = Date.now();
    gesture.imageWrapEl.style.transform = `translate3d(${image.currentX}px, ${image.currentY}px,0)`;
  }
  function onTouchEnd() {
    const zoom = swiper.zoom;
    if (!gesture.imageEl) return;
    if (!image.isTouched || !image.isMoved) {
      image.isTouched = false;
      image.isMoved = false;
      return;
    }
    image.isTouched = false;
    image.isMoved = false;
    let momentumDurationX = 300;
    let momentumDurationY = 300;
    const momentumDistanceX = velocity.x * momentumDurationX;
    const newPositionX = image.currentX + momentumDistanceX;
    const momentumDistanceY = velocity.y * momentumDurationY;
    const newPositionY = image.currentY + momentumDistanceY;

    // Fix duration
    if (velocity.x !== 0) momentumDurationX = Math.abs((newPositionX - image.currentX) / velocity.x);
    if (velocity.y !== 0) momentumDurationY = Math.abs((newPositionY - image.currentY) / velocity.y);
    const momentumDuration = Math.max(momentumDurationX, momentumDurationY);
    image.currentX = newPositionX;
    image.currentY = newPositionY;
    // Define if we need image drag
    const scaledWidth = image.width * zoom.scale;
    const scaledHeight = image.height * zoom.scale;
    image.minX = Math.min(gesture.slideWidth / 2 - scaledWidth / 2, 0);
    image.maxX = -image.minX;
    image.minY = Math.min(gesture.slideHeight / 2 - scaledHeight / 2, 0);
    image.maxY = -image.minY;
    image.currentX = Math.max(Math.min(image.currentX, image.maxX), image.minX);
    image.currentY = Math.max(Math.min(image.currentY, image.maxY), image.minY);
    gesture.imageWrapEl.style.transitionDuration = `${momentumDuration}ms`;
    gesture.imageWrapEl.style.transform = `translate3d(${image.currentX}px, ${image.currentY}px,0)`;
  }
  function onTransitionEnd() {
    const zoom = swiper.zoom;
    if (gesture.slideEl && swiper.activeIndex !== swiper.slides.indexOf(gesture.slideEl)) {
      if (gesture.imageEl) {
        gesture.imageEl.style.transform = 'translate3d(0,0,0) scale(1)';
      }
      if (gesture.imageWrapEl) {
        gesture.imageWrapEl.style.transform = 'translate3d(0,0,0)';
      }
      gesture.slideEl.classList.remove(`${swiper.params.zoom.zoomedSlideClass}`);
      zoom.scale = 1;
      currentScale = 1;
      gesture.slideEl = undefined;
      gesture.imageEl = undefined;
      gesture.imageWrapEl = undefined;
      gesture.originX = 0;
      gesture.originY = 0;
    }
  }
  function zoomIn(e) {
    const zoom = swiper.zoom;
    const params = swiper.params.zoom;
    if (!gesture.slideEl) {
      if (e && e.target) {
        gesture.slideEl = e.target.closest(`.${swiper.params.slideClass}, swiper-slide`);
      }
      if (!gesture.slideEl) {
        if (swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual) {
          gesture.slideEl = elementChildren(swiper.slidesEl, `.${swiper.params.slideActiveClass}`)[0];
        } else {
          gesture.slideEl = swiper.slides[swiper.activeIndex];
        }
      }
      let imageEl = gesture.slideEl.querySelector(`.${params.containerClass}`);
      if (imageEl) {
        imageEl = imageEl.querySelectorAll('picture, img, svg, canvas, .swiper-zoom-target')[0];
      }
      gesture.imageEl = imageEl;
      if (imageEl) {
        gesture.imageWrapEl = elementParents(gesture.imageEl, `.${params.containerClass}`)[0];
      } else {
        gesture.imageWrapEl = undefined;
      }
    }
    if (!gesture.imageEl || !gesture.imageWrapEl) return;
    if (swiper.params.cssMode) {
      swiper.wrapperEl.style.overflow = 'hidden';
      swiper.wrapperEl.style.touchAction = 'none';
    }
    gesture.slideEl.classList.add(`${params.zoomedSlideClass}`);
    let touchX;
    let touchY;
    let offsetX;
    let offsetY;
    let diffX;
    let diffY;
    let translateX;
    let translateY;
    let imageWidth;
    let imageHeight;
    let scaledWidth;
    let scaledHeight;
    let translateMinX;
    let translateMinY;
    let translateMaxX;
    let translateMaxY;
    let slideWidth;
    let slideHeight;
    if (typeof image.touchesStart.x === 'undefined' && e) {
      touchX = e.pageX;
      touchY = e.pageY;
    } else {
      touchX = image.touchesStart.x;
      touchY = image.touchesStart.y;
    }
    const forceZoomRatio = typeof e === 'number' ? e : null;
    if (currentScale === 1 && forceZoomRatio) {
      touchX = undefined;
      touchY = undefined;
    }
    zoom.scale = forceZoomRatio || gesture.imageWrapEl.getAttribute('data-swiper-zoom') || params.maxRatio;
    currentScale = forceZoomRatio || gesture.imageWrapEl.getAttribute('data-swiper-zoom') || params.maxRatio;
    if (e && !(currentScale === 1 && forceZoomRatio)) {
      slideWidth = gesture.slideEl.offsetWidth;
      slideHeight = gesture.slideEl.offsetHeight;
      offsetX = elementOffset(gesture.slideEl).left + window.scrollX;
      offsetY = elementOffset(gesture.slideEl).top + window.scrollY;
      diffX = offsetX + slideWidth / 2 - touchX;
      diffY = offsetY + slideHeight / 2 - touchY;
      imageWidth = gesture.imageEl.offsetWidth;
      imageHeight = gesture.imageEl.offsetHeight;
      scaledWidth = imageWidth * zoom.scale;
      scaledHeight = imageHeight * zoom.scale;
      translateMinX = Math.min(slideWidth / 2 - scaledWidth / 2, 0);
      translateMinY = Math.min(slideHeight / 2 - scaledHeight / 2, 0);
      translateMaxX = -translateMinX;
      translateMaxY = -translateMinY;
      translateX = diffX * zoom.scale;
      translateY = diffY * zoom.scale;
      if (translateX < translateMinX) {
        translateX = translateMinX;
      }
      if (translateX > translateMaxX) {
        translateX = translateMaxX;
      }
      if (translateY < translateMinY) {
        translateY = translateMinY;
      }
      if (translateY > translateMaxY) {
        translateY = translateMaxY;
      }
    } else {
      translateX = 0;
      translateY = 0;
    }
    if (forceZoomRatio && zoom.scale === 1) {
      gesture.originX = 0;
      gesture.originY = 0;
    }
    gesture.imageWrapEl.style.transitionDuration = '300ms';
    gesture.imageWrapEl.style.transform = `translate3d(${translateX}px, ${translateY}px,0)`;
    gesture.imageEl.style.transitionDuration = '300ms';
    gesture.imageEl.style.transform = `translate3d(0,0,0) scale(${zoom.scale})`;
  }
  function zoomOut() {
    const zoom = swiper.zoom;
    const params = swiper.params.zoom;
    if (!gesture.slideEl) {
      if (swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual) {
        gesture.slideEl = elementChildren(swiper.slidesEl, `.${swiper.params.slideActiveClass}`)[0];
      } else {
        gesture.slideEl = swiper.slides[swiper.activeIndex];
      }
      let imageEl = gesture.slideEl.querySelector(`.${params.containerClass}`);
      if (imageEl) {
        imageEl = imageEl.querySelectorAll('picture, img, svg, canvas, .swiper-zoom-target')[0];
      }
      gesture.imageEl = imageEl;
      if (imageEl) {
        gesture.imageWrapEl = elementParents(gesture.imageEl, `.${params.containerClass}`)[0];
      } else {
        gesture.imageWrapEl = undefined;
      }
    }
    if (!gesture.imageEl || !gesture.imageWrapEl) return;
    if (swiper.params.cssMode) {
      swiper.wrapperEl.style.overflow = '';
      swiper.wrapperEl.style.touchAction = '';
    }
    zoom.scale = 1;
    currentScale = 1;
    gesture.imageWrapEl.style.transitionDuration = '300ms';
    gesture.imageWrapEl.style.transform = 'translate3d(0,0,0)';
    gesture.imageEl.style.transitionDuration = '300ms';
    gesture.imageEl.style.transform = 'translate3d(0,0,0) scale(1)';
    gesture.slideEl.classList.remove(`${params.zoomedSlideClass}`);
    gesture.slideEl = undefined;
    gesture.originX = 0;
    gesture.originY = 0;
  }

  // Toggle Zoom
  function zoomToggle(e) {
    const zoom = swiper.zoom;
    if (zoom.scale && zoom.scale !== 1) {
      // Zoom Out
      zoomOut();
    } else {
      // Zoom In
      zoomIn(e);
    }
  }
  function getListeners() {
    const passiveListener = swiper.params.passiveListeners ? {
      passive: true,
      capture: false
    } : false;
    const activeListenerWithCapture = swiper.params.passiveListeners ? {
      passive: false,
      capture: true
    } : true;
    return {
      passiveListener,
      activeListenerWithCapture
    };
  }

  // Attach/Detach Events
  function enable() {
    const zoom = swiper.zoom;
    if (zoom.enabled) return;
    zoom.enabled = true;
    const {
      passiveListener,
      activeListenerWithCapture
    } = getListeners();

    // Scale image
    swiper.wrapperEl.addEventListener('pointerdown', onGestureStart, passiveListener);
    swiper.wrapperEl.addEventListener('pointermove', onGestureChange, activeListenerWithCapture);
    ['pointerup', 'pointercancel', 'pointerout'].forEach(eventName => {
      swiper.wrapperEl.addEventListener(eventName, onGestureEnd, passiveListener);
    });

    // Move image
    swiper.wrapperEl.addEventListener('pointermove', onTouchMove, activeListenerWithCapture);
  }
  function disable() {
    const zoom = swiper.zoom;
    if (!zoom.enabled) return;
    zoom.enabled = false;
    const {
      passiveListener,
      activeListenerWithCapture
    } = getListeners();

    // Scale image
    swiper.wrapperEl.removeEventListener('pointerdown', onGestureStart, passiveListener);
    swiper.wrapperEl.removeEventListener('pointermove', onGestureChange, activeListenerWithCapture);
    ['pointerup', 'pointercancel', 'pointerout'].forEach(eventName => {
      swiper.wrapperEl.removeEventListener(eventName, onGestureEnd, passiveListener);
    });

    // Move image
    swiper.wrapperEl.removeEventListener('pointermove', onTouchMove, activeListenerWithCapture);
  }
  on('init', () => {
    if (swiper.params.zoom.enabled) {
      enable();
    }
  });
  on('destroy', () => {
    disable();
  });
  on('touchStart', (_s, e) => {
    if (!swiper.zoom.enabled) return;
    onTouchStart(e);
  });
  on('touchEnd', (_s, e) => {
    if (!swiper.zoom.enabled) return;
    onTouchEnd();
  });
  on('doubleTap', (_s, e) => {
    if (!swiper.animating && swiper.params.zoom.enabled && swiper.zoom.enabled && swiper.params.zoom.toggle) {
      zoomToggle(e);
    }
  });
  on('transitionEnd', () => {
    if (swiper.zoom.enabled && swiper.params.zoom.enabled) {
      onTransitionEnd();
    }
  });
  on('slideChange', () => {
    if (swiper.zoom.enabled && swiper.params.zoom.enabled && swiper.params.cssMode) {
      onTransitionEnd();
    }
  });
  Object.assign(swiper.zoom, {
    enable,
    disable,
    in: zoomIn,
    out: zoomOut,
    toggle: zoomToggle
  });
}



;// CONCATENATED MODULE: ./node_modules/swiper/modules/controller.mjs


/* eslint no-bitwise: ["error", { "allow": [">>"] }] */
function Controller(_ref) {
  let {
    swiper,
    extendParams,
    on
  } = _ref;
  extendParams({
    controller: {
      control: undefined,
      inverse: false,
      by: 'slide' // or 'container'
    }
  });

  swiper.controller = {
    control: undefined
  };
  function LinearSpline(x, y) {
    const binarySearch = function search() {
      let maxIndex;
      let minIndex;
      let guess;
      return (array, val) => {
        minIndex = -1;
        maxIndex = array.length;
        while (maxIndex - minIndex > 1) {
          guess = maxIndex + minIndex >> 1;
          if (array[guess] <= val) {
            minIndex = guess;
          } else {
            maxIndex = guess;
          }
        }
        return maxIndex;
      };
    }();
    this.x = x;
    this.y = y;
    this.lastIndex = x.length - 1;
    // Given an x value (x2), return the expected y2 value:
    // (x1,y1) is the known point before given value,
    // (x3,y3) is the known point after given value.
    let i1;
    let i3;
    this.interpolate = function interpolate(x2) {
      if (!x2) return 0;

      // Get the indexes of x1 and x3 (the array indexes before and after given x2):
      i3 = binarySearch(this.x, x2);
      i1 = i3 - 1;

      // We have our indexes i1 & i3, so we can calculate already:
      // y2 := ((x2−x1) × (y3−y1)) ÷ (x3−x1) + y1
      return (x2 - this.x[i1]) * (this.y[i3] - this.y[i1]) / (this.x[i3] - this.x[i1]) + this.y[i1];
    };
    return this;
  }
  function getInterpolateFunction(c) {
    swiper.controller.spline = swiper.params.loop ? new LinearSpline(swiper.slidesGrid, c.slidesGrid) : new LinearSpline(swiper.snapGrid, c.snapGrid);
  }
  function setTranslate(_t, byController) {
    const controlled = swiper.controller.control;
    let multiplier;
    let controlledTranslate;
    const Swiper = swiper.constructor;
    function setControlledTranslate(c) {
      if (c.destroyed) return;

      // this will create an Interpolate function based on the snapGrids
      // x is the Grid of the scrolled scroller and y will be the controlled scroller
      // it makes sense to create this only once and recall it for the interpolation
      // the function does a lot of value caching for performance
      const translate = swiper.rtlTranslate ? -swiper.translate : swiper.translate;
      if (swiper.params.controller.by === 'slide') {
        getInterpolateFunction(c);
        // i am not sure why the values have to be multiplicated this way, tried to invert the snapGrid
        // but it did not work out
        controlledTranslate = -swiper.controller.spline.interpolate(-translate);
      }
      if (!controlledTranslate || swiper.params.controller.by === 'container') {
        multiplier = (c.maxTranslate() - c.minTranslate()) / (swiper.maxTranslate() - swiper.minTranslate());
        if (Number.isNaN(multiplier) || !Number.isFinite(multiplier)) {
          multiplier = 1;
        }
        controlledTranslate = (translate - swiper.minTranslate()) * multiplier + c.minTranslate();
      }
      if (swiper.params.controller.inverse) {
        controlledTranslate = c.maxTranslate() - controlledTranslate;
      }
      c.updateProgress(controlledTranslate);
      c.setTranslate(controlledTranslate, swiper);
      c.updateActiveIndex();
      c.updateSlidesClasses();
    }
    if (Array.isArray(controlled)) {
      for (let i = 0; i < controlled.length; i += 1) {
        if (controlled[i] !== byController && controlled[i] instanceof Swiper) {
          setControlledTranslate(controlled[i]);
        }
      }
    } else if (controlled instanceof Swiper && byController !== controlled) {
      setControlledTranslate(controlled);
    }
  }
  function setTransition(duration, byController) {
    const Swiper = swiper.constructor;
    const controlled = swiper.controller.control;
    let i;
    function setControlledTransition(c) {
      if (c.destroyed) return;
      c.setTransition(duration, swiper);
      if (duration !== 0) {
        c.transitionStart();
        if (c.params.autoHeight) {
          nextTick(() => {
            c.updateAutoHeight();
          });
        }
        elementTransitionEnd(c.wrapperEl, () => {
          if (!controlled) return;
          c.transitionEnd();
        });
      }
    }
    if (Array.isArray(controlled)) {
      for (i = 0; i < controlled.length; i += 1) {
        if (controlled[i] !== byController && controlled[i] instanceof Swiper) {
          setControlledTransition(controlled[i]);
        }
      }
    } else if (controlled instanceof Swiper && byController !== controlled) {
      setControlledTransition(controlled);
    }
  }
  function removeSpline() {
    if (!swiper.controller.control) return;
    if (swiper.controller.spline) {
      swiper.controller.spline = undefined;
      delete swiper.controller.spline;
    }
  }
  on('beforeInit', () => {
    if (typeof window !== 'undefined' && (
    // eslint-disable-line
    typeof swiper.params.controller.control === 'string' || swiper.params.controller.control instanceof HTMLElement)) {
      const controlElement = document.querySelector(swiper.params.controller.control);
      if (controlElement && controlElement.swiper) {
        swiper.controller.control = controlElement.swiper;
      } else if (controlElement) {
        const onControllerSwiper = e => {
          swiper.controller.control = e.detail[0];
          swiper.update();
          controlElement.removeEventListener('init', onControllerSwiper);
        };
        controlElement.addEventListener('init', onControllerSwiper);
      }
      return;
    }
    swiper.controller.control = swiper.params.controller.control;
  });
  on('update', () => {
    removeSpline();
  });
  on('resize', () => {
    removeSpline();
  });
  on('observerUpdate', () => {
    removeSpline();
  });
  on('setTranslate', (_s, translate, byController) => {
    if (!swiper.controller.control || swiper.controller.control.destroyed) return;
    swiper.controller.setTranslate(translate, byController);
  });
  on('setTransition', (_s, duration, byController) => {
    if (!swiper.controller.control || swiper.controller.control.destroyed) return;
    swiper.controller.setTransition(duration, byController);
  });
  Object.assign(swiper.controller, {
    setTranslate,
    setTransition
  });
}



;// CONCATENATED MODULE: ./node_modules/swiper/modules/a11y.mjs



function A11y(_ref) {
  let {
    swiper,
    extendParams,
    on
  } = _ref;
  extendParams({
    a11y: {
      enabled: true,
      notificationClass: 'swiper-notification',
      prevSlideMessage: 'Previous slide',
      nextSlideMessage: 'Next slide',
      firstSlideMessage: 'This is the first slide',
      lastSlideMessage: 'This is the last slide',
      paginationBulletMessage: 'Go to slide {{index}}',
      slideLabelMessage: '{{index}} / {{slidesLength}}',
      containerMessage: null,
      containerRoleDescriptionMessage: null,
      itemRoleDescriptionMessage: null,
      slideRole: 'group',
      id: null
    }
  });
  swiper.a11y = {
    clicked: false
  };
  let liveRegion = null;
  function notify(message) {
    const notification = liveRegion;
    if (notification.length === 0) return;
    notification.innerHTML = '';
    notification.innerHTML = message;
  }
  const makeElementsArray = el => (Array.isArray(el) ? el : [el]).filter(e => !!e);
  function getRandomNumber(size) {
    if (size === void 0) {
      size = 16;
    }
    const randomChar = () => Math.round(16 * Math.random()).toString(16);
    return 'x'.repeat(size).replace(/x/g, randomChar);
  }
  function makeElFocusable(el) {
    el = makeElementsArray(el);
    el.forEach(subEl => {
      subEl.setAttribute('tabIndex', '0');
    });
  }
  function makeElNotFocusable(el) {
    el = makeElementsArray(el);
    el.forEach(subEl => {
      subEl.setAttribute('tabIndex', '-1');
    });
  }
  function addElRole(el, role) {
    el = makeElementsArray(el);
    el.forEach(subEl => {
      subEl.setAttribute('role', role);
    });
  }
  function addElRoleDescription(el, description) {
    el = makeElementsArray(el);
    el.forEach(subEl => {
      subEl.setAttribute('aria-roledescription', description);
    });
  }
  function addElControls(el, controls) {
    el = makeElementsArray(el);
    el.forEach(subEl => {
      subEl.setAttribute('aria-controls', controls);
    });
  }
  function addElLabel(el, label) {
    el = makeElementsArray(el);
    el.forEach(subEl => {
      subEl.setAttribute('aria-label', label);
    });
  }
  function addElId(el, id) {
    el = makeElementsArray(el);
    el.forEach(subEl => {
      subEl.setAttribute('id', id);
    });
  }
  function addElLive(el, live) {
    el = makeElementsArray(el);
    el.forEach(subEl => {
      subEl.setAttribute('aria-live', live);
    });
  }
  function disableEl(el) {
    el = makeElementsArray(el);
    el.forEach(subEl => {
      subEl.setAttribute('aria-disabled', true);
    });
  }
  function enableEl(el) {
    el = makeElementsArray(el);
    el.forEach(subEl => {
      subEl.setAttribute('aria-disabled', false);
    });
  }
  function onEnterOrSpaceKey(e) {
    if (e.keyCode !== 13 && e.keyCode !== 32) return;
    const params = swiper.params.a11y;
    const targetEl = e.target;
    if (swiper.pagination && swiper.pagination.el && (targetEl === swiper.pagination.el || swiper.pagination.el.contains(e.target))) {
      if (!e.target.matches(classesToSelector(swiper.params.pagination.bulletClass))) return;
    }
    if (swiper.navigation && swiper.navigation.nextEl && targetEl === swiper.navigation.nextEl) {
      if (!(swiper.isEnd && !swiper.params.loop)) {
        swiper.slideNext();
      }
      if (swiper.isEnd) {
        notify(params.lastSlideMessage);
      } else {
        notify(params.nextSlideMessage);
      }
    }
    if (swiper.navigation && swiper.navigation.prevEl && targetEl === swiper.navigation.prevEl) {
      if (!(swiper.isBeginning && !swiper.params.loop)) {
        swiper.slidePrev();
      }
      if (swiper.isBeginning) {
        notify(params.firstSlideMessage);
      } else {
        notify(params.prevSlideMessage);
      }
    }
    if (swiper.pagination && targetEl.matches(classesToSelector(swiper.params.pagination.bulletClass))) {
      targetEl.click();
    }
  }
  function updateNavigation() {
    if (swiper.params.loop || swiper.params.rewind || !swiper.navigation) return;
    const {
      nextEl,
      prevEl
    } = swiper.navigation;
    if (prevEl) {
      if (swiper.isBeginning) {
        disableEl(prevEl);
        makeElNotFocusable(prevEl);
      } else {
        enableEl(prevEl);
        makeElFocusable(prevEl);
      }
    }
    if (nextEl) {
      if (swiper.isEnd) {
        disableEl(nextEl);
        makeElNotFocusable(nextEl);
      } else {
        enableEl(nextEl);
        makeElFocusable(nextEl);
      }
    }
  }
  function hasPagination() {
    return swiper.pagination && swiper.pagination.bullets && swiper.pagination.bullets.length;
  }
  function hasClickablePagination() {
    return hasPagination() && swiper.params.pagination.clickable;
  }
  function updatePagination() {
    const params = swiper.params.a11y;
    if (!hasPagination()) return;
    swiper.pagination.bullets.forEach(bulletEl => {
      if (swiper.params.pagination.clickable) {
        makeElFocusable(bulletEl);
        if (!swiper.params.pagination.renderBullet) {
          addElRole(bulletEl, 'button');
          addElLabel(bulletEl, params.paginationBulletMessage.replace(/\{\{index\}\}/, elementIndex(bulletEl) + 1));
        }
      }
      if (bulletEl.matches(classesToSelector(swiper.params.pagination.bulletActiveClass))) {
        bulletEl.setAttribute('aria-current', 'true');
      } else {
        bulletEl.removeAttribute('aria-current');
      }
    });
  }
  const initNavEl = (el, wrapperId, message) => {
    makeElFocusable(el);
    if (el.tagName !== 'BUTTON') {
      addElRole(el, 'button');
      el.addEventListener('keydown', onEnterOrSpaceKey);
    }
    addElLabel(el, message);
    addElControls(el, wrapperId);
  };
  const handlePointerDown = () => {
    swiper.a11y.clicked = true;
  };
  const handlePointerUp = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!swiper.destroyed) {
          swiper.a11y.clicked = false;
        }
      });
    });
  };
  const handleFocus = e => {
    if (swiper.a11y.clicked) return;
    const slideEl = e.target.closest(`.${swiper.params.slideClass}, swiper-slide`);
    if (!slideEl || !swiper.slides.includes(slideEl)) return;
    const isActive = swiper.slides.indexOf(slideEl) === swiper.activeIndex;
    const isVisible = swiper.params.watchSlidesProgress && swiper.visibleSlides && swiper.visibleSlides.includes(slideEl);
    if (isActive || isVisible) return;
    if (e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents) return;
    if (swiper.isHorizontal()) {
      swiper.el.scrollLeft = 0;
    } else {
      swiper.el.scrollTop = 0;
    }
    swiper.slideTo(swiper.slides.indexOf(slideEl), 0);
  };
  const initSlides = () => {
    const params = swiper.params.a11y;
    if (params.itemRoleDescriptionMessage) {
      addElRoleDescription(swiper.slides, params.itemRoleDescriptionMessage);
    }
    if (params.slideRole) {
      addElRole(swiper.slides, params.slideRole);
    }
    const slidesLength = swiper.slides.length;
    if (params.slideLabelMessage) {
      swiper.slides.forEach((slideEl, index) => {
        const slideIndex = swiper.params.loop ? parseInt(slideEl.getAttribute('data-swiper-slide-index'), 10) : index;
        const ariaLabelMessage = params.slideLabelMessage.replace(/\{\{index\}\}/, slideIndex + 1).replace(/\{\{slidesLength\}\}/, slidesLength);
        addElLabel(slideEl, ariaLabelMessage);
      });
    }
  };
  const init = () => {
    const params = swiper.params.a11y;
    swiper.el.append(liveRegion);

    // Container
    const containerEl = swiper.el;
    if (params.containerRoleDescriptionMessage) {
      addElRoleDescription(containerEl, params.containerRoleDescriptionMessage);
    }
    if (params.containerMessage) {
      addElLabel(containerEl, params.containerMessage);
    }

    // Wrapper
    const wrapperEl = swiper.wrapperEl;
    const wrapperId = params.id || wrapperEl.getAttribute('id') || `swiper-wrapper-${getRandomNumber(16)}`;
    const live = swiper.params.autoplay && swiper.params.autoplay.enabled ? 'off' : 'polite';
    addElId(wrapperEl, wrapperId);
    addElLive(wrapperEl, live);

    // Slide
    initSlides();

    // Navigation
    let {
      nextEl,
      prevEl
    } = swiper.navigation ? swiper.navigation : {};
    nextEl = makeElementsArray(nextEl);
    prevEl = makeElementsArray(prevEl);
    if (nextEl) {
      nextEl.forEach(el => initNavEl(el, wrapperId, params.nextSlideMessage));
    }
    if (prevEl) {
      prevEl.forEach(el => initNavEl(el, wrapperId, params.prevSlideMessage));
    }

    // Pagination
    if (hasClickablePagination()) {
      const paginationEl = makeElementsArray(swiper.pagination.el);
      paginationEl.forEach(el => {
        el.addEventListener('keydown', onEnterOrSpaceKey);
      });
    }

    // Tab focus
    swiper.el.addEventListener('focus', handleFocus, true);
    swiper.el.addEventListener('pointerdown', handlePointerDown, true);
    swiper.el.addEventListener('pointerup', handlePointerUp, true);
  };
  function destroy() {
    if (liveRegion) liveRegion.remove();
    let {
      nextEl,
      prevEl
    } = swiper.navigation ? swiper.navigation : {};
    nextEl = makeElementsArray(nextEl);
    prevEl = makeElementsArray(prevEl);
    if (nextEl) {
      nextEl.forEach(el => el.removeEventListener('keydown', onEnterOrSpaceKey));
    }
    if (prevEl) {
      prevEl.forEach(el => el.removeEventListener('keydown', onEnterOrSpaceKey));
    }

    // Pagination
    if (hasClickablePagination()) {
      const paginationEl = makeElementsArray(swiper.pagination.el);
      paginationEl.forEach(el => {
        el.removeEventListener('keydown', onEnterOrSpaceKey);
      });
    }

    // Tab focus
    swiper.el.removeEventListener('focus', handleFocus, true);
    swiper.el.removeEventListener('pointerdown', handlePointerDown, true);
    swiper.el.removeEventListener('pointerup', handlePointerUp, true);
  }
  on('beforeInit', () => {
    liveRegion = createElement('span', swiper.params.a11y.notificationClass);
    liveRegion.setAttribute('aria-live', 'assertive');
    liveRegion.setAttribute('aria-atomic', 'true');
  });
  on('afterInit', () => {
    if (!swiper.params.a11y.enabled) return;
    init();
  });
  on('slidesLengthChange snapGridLengthChange slidesGridLengthChange', () => {
    if (!swiper.params.a11y.enabled) return;
    initSlides();
  });
  on('fromEdge toEdge afterInit lock unlock', () => {
    if (!swiper.params.a11y.enabled) return;
    updateNavigation();
  });
  on('paginationUpdate', () => {
    if (!swiper.params.a11y.enabled) return;
    updatePagination();
  });
  on('destroy', () => {
    if (!swiper.params.a11y.enabled) return;
    destroy();
  });
}



;// CONCATENATED MODULE: ./node_modules/swiper/modules/history.mjs


function History(_ref) {
  let {
    swiper,
    extendParams,
    on
  } = _ref;
  extendParams({
    history: {
      enabled: false,
      root: '',
      replaceState: false,
      key: 'slides',
      keepQuery: false
    }
  });
  let initialized = false;
  let paths = {};
  const slugify = text => {
    return text.toString().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
  };
  const getPathValues = urlOverride => {
    const window = getWindow();
    let location;
    if (urlOverride) {
      location = new URL(urlOverride);
    } else {
      location = window.location;
    }
    const pathArray = location.pathname.slice(1).split('/').filter(part => part !== '');
    const total = pathArray.length;
    const key = pathArray[total - 2];
    const value = pathArray[total - 1];
    return {
      key,
      value
    };
  };
  const setHistory = (key, index) => {
    const window = getWindow();
    if (!initialized || !swiper.params.history.enabled) return;
    let location;
    if (swiper.params.url) {
      location = new URL(swiper.params.url);
    } else {
      location = window.location;
    }
    const slide = swiper.slides[index];
    let value = slugify(slide.getAttribute('data-history'));
    if (swiper.params.history.root.length > 0) {
      let root = swiper.params.history.root;
      if (root[root.length - 1] === '/') root = root.slice(0, root.length - 1);
      value = `${root}/${key ? `${key}/` : ''}${value}`;
    } else if (!location.pathname.includes(key)) {
      value = `${key ? `${key}/` : ''}${value}`;
    }
    if (swiper.params.history.keepQuery) {
      value += location.search;
    }
    const currentState = window.history.state;
    if (currentState && currentState.value === value) {
      return;
    }
    if (swiper.params.history.replaceState) {
      window.history.replaceState({
        value
      }, null, value);
    } else {
      window.history.pushState({
        value
      }, null, value);
    }
  };
  const scrollToSlide = (speed, value, runCallbacks) => {
    if (value) {
      for (let i = 0, length = swiper.slides.length; i < length; i += 1) {
        const slide = swiper.slides[i];
        const slideHistory = slugify(slide.getAttribute('data-history'));
        if (slideHistory === value) {
          const index = swiper.getSlideIndex(slide);
          swiper.slideTo(index, speed, runCallbacks);
        }
      }
    } else {
      swiper.slideTo(0, speed, runCallbacks);
    }
  };
  const setHistoryPopState = () => {
    paths = getPathValues(swiper.params.url);
    scrollToSlide(swiper.params.speed, paths.value, false);
  };
  const init = () => {
    const window = getWindow();
    if (!swiper.params.history) return;
    if (!window.history || !window.history.pushState) {
      swiper.params.history.enabled = false;
      swiper.params.hashNavigation.enabled = true;
      return;
    }
    initialized = true;
    paths = getPathValues(swiper.params.url);
    if (!paths.key && !paths.value) {
      if (!swiper.params.history.replaceState) {
        window.addEventListener('popstate', setHistoryPopState);
      }
      return;
    }
    scrollToSlide(0, paths.value, swiper.params.runCallbacksOnInit);
    if (!swiper.params.history.replaceState) {
      window.addEventListener('popstate', setHistoryPopState);
    }
  };
  const destroy = () => {
    const window = getWindow();
    if (!swiper.params.history.replaceState) {
      window.removeEventListener('popstate', setHistoryPopState);
    }
  };
  on('init', () => {
    if (swiper.params.history.enabled) {
      init();
    }
  });
  on('destroy', () => {
    if (swiper.params.history.enabled) {
      destroy();
    }
  });
  on('transitionEnd _freeModeNoMomentumRelease', () => {
    if (initialized) {
      setHistory(swiper.params.history.key, swiper.activeIndex);
    }
  });
  on('slideChange', () => {
    if (initialized && swiper.params.cssMode) {
      setHistory(swiper.params.history.key, swiper.activeIndex);
    }
  });
}



;// CONCATENATED MODULE: ./node_modules/swiper/modules/hash-navigation.mjs



function HashNavigation(_ref) {
  let {
    swiper,
    extendParams,
    emit,
    on
  } = _ref;
  let initialized = false;
  const document = getDocument();
  const window = getWindow();
  extendParams({
    hashNavigation: {
      enabled: false,
      replaceState: false,
      watchState: false,
      getSlideIndex(_s, hash) {
        if (swiper.virtual && swiper.params.virtual.enabled) {
          const slideWithHash = swiper.slides.filter(slideEl => slideEl.getAttribute('data-hash') === hash)[0];
          if (!slideWithHash) return 0;
          const index = parseInt(slideWithHash.getAttribute('data-swiper-slide-index'), 10);
          return index;
        }
        return swiper.getSlideIndex(elementChildren(swiper.slidesEl, `.${swiper.params.slideClass}[data-hash="${hash}"], swiper-slide[data-hash="${hash}"]`)[0]);
      }
    }
  });
  const onHashChange = () => {
    emit('hashChange');
    const newHash = document.location.hash.replace('#', '');
    const activeSlideEl = swiper.virtual && swiper.params.virtual.enabled ? swiper.slidesEl.querySelector(`[data-swiper-slide-index="${swiper.activeIndex}"]`) : swiper.slides[swiper.activeIndex];
    const activeSlideHash = activeSlideEl ? activeSlideEl.getAttribute('data-hash') : '';
    if (newHash !== activeSlideHash) {
      const newIndex = swiper.params.hashNavigation.getSlideIndex(swiper, newHash);
      if (typeof newIndex === 'undefined' || Number.isNaN(newIndex)) return;
      swiper.slideTo(newIndex);
    }
  };
  const setHash = () => {
    if (!initialized || !swiper.params.hashNavigation.enabled) return;
    const activeSlideEl = swiper.virtual && swiper.params.virtual.enabled ? swiper.slidesEl.querySelector(`[data-swiper-slide-index="${swiper.activeIndex}"]`) : swiper.slides[swiper.activeIndex];
    const activeSlideHash = activeSlideEl ? activeSlideEl.getAttribute('data-hash') || activeSlideEl.getAttribute('data-history') : '';
    if (swiper.params.hashNavigation.replaceState && window.history && window.history.replaceState) {
      window.history.replaceState(null, null, `#${activeSlideHash}` || '');
      emit('hashSet');
    } else {
      document.location.hash = activeSlideHash || '';
      emit('hashSet');
    }
  };
  const init = () => {
    if (!swiper.params.hashNavigation.enabled || swiper.params.history && swiper.params.history.enabled) return;
    initialized = true;
    const hash = document.location.hash.replace('#', '');
    if (hash) {
      const speed = 0;
      const index = swiper.params.hashNavigation.getSlideIndex(swiper, hash);
      swiper.slideTo(index || 0, speed, swiper.params.runCallbacksOnInit, true);
    }
    if (swiper.params.hashNavigation.watchState) {
      window.addEventListener('hashchange', onHashChange);
    }
  };
  const destroy = () => {
    if (swiper.params.hashNavigation.watchState) {
      window.removeEventListener('hashchange', onHashChange);
    }
  };
  on('init', () => {
    if (swiper.params.hashNavigation.enabled) {
      init();
    }
  });
  on('destroy', () => {
    if (swiper.params.hashNavigation.enabled) {
      destroy();
    }
  });
  on('transitionEnd _freeModeNoMomentumRelease', () => {
    if (initialized) {
      setHash();
    }
  });
  on('slideChange', () => {
    if (initialized && swiper.params.cssMode) {
      setHash();
    }
  });
}



;// CONCATENATED MODULE: ./node_modules/swiper/modules/autoplay.mjs


/* eslint no-underscore-dangle: "off" */
/* eslint no-use-before-define: "off" */
function Autoplay(_ref) {
  let {
    swiper,
    extendParams,
    on,
    emit,
    params
  } = _ref;
  swiper.autoplay = {
    running: false,
    paused: false,
    timeLeft: 0
  };
  extendParams({
    autoplay: {
      enabled: false,
      delay: 3000,
      waitForTransition: true,
      disableOnInteraction: false,
      stopOnLastSlide: false,
      reverseDirection: false,
      pauseOnMouseEnter: false
    }
  });
  let timeout;
  let raf;
  let autoplayDelayTotal = params && params.autoplay ? params.autoplay.delay : 3000;
  let autoplayDelayCurrent = params && params.autoplay ? params.autoplay.delay : 3000;
  let autoplayTimeLeft;
  let autoplayStartTime = new Date().getTime();
  let wasPaused;
  let isTouched;
  let pausedByTouch;
  let touchStartTimeout;
  let slideChanged;
  let pausedByInteraction;
  let pausedByPointerEnter;
  function onTransitionEnd(e) {
    if (!swiper || swiper.destroyed || !swiper.wrapperEl) return;
    if (e.target !== swiper.wrapperEl) return;
    swiper.wrapperEl.removeEventListener('transitionend', onTransitionEnd);
    if (pausedByPointerEnter) {
      return;
    }
    resume();
  }
  const calcTimeLeft = () => {
    if (swiper.destroyed || !swiper.autoplay.running) return;
    if (swiper.autoplay.paused) {
      wasPaused = true;
    } else if (wasPaused) {
      autoplayDelayCurrent = autoplayTimeLeft;
      wasPaused = false;
    }
    const timeLeft = swiper.autoplay.paused ? autoplayTimeLeft : autoplayStartTime + autoplayDelayCurrent - new Date().getTime();
    swiper.autoplay.timeLeft = timeLeft;
    emit('autoplayTimeLeft', timeLeft, timeLeft / autoplayDelayTotal);
    raf = requestAnimationFrame(() => {
      calcTimeLeft();
    });
  };
  const getSlideDelay = () => {
    let activeSlideEl;
    if (swiper.virtual && swiper.params.virtual.enabled) {
      activeSlideEl = swiper.slides.filter(slideEl => slideEl.classList.contains('swiper-slide-active'))[0];
    } else {
      activeSlideEl = swiper.slides[swiper.activeIndex];
    }
    if (!activeSlideEl) return undefined;
    const currentSlideDelay = parseInt(activeSlideEl.getAttribute('data-swiper-autoplay'), 10);
    return currentSlideDelay;
  };
  const run = delayForce => {
    if (swiper.destroyed || !swiper.autoplay.running) return;
    cancelAnimationFrame(raf);
    calcTimeLeft();
    let delay = typeof delayForce === 'undefined' ? swiper.params.autoplay.delay : delayForce;
    autoplayDelayTotal = swiper.params.autoplay.delay;
    autoplayDelayCurrent = swiper.params.autoplay.delay;
    const currentSlideDelay = getSlideDelay();
    if (!Number.isNaN(currentSlideDelay) && currentSlideDelay > 0 && typeof delayForce === 'undefined') {
      delay = currentSlideDelay;
      autoplayDelayTotal = currentSlideDelay;
      autoplayDelayCurrent = currentSlideDelay;
    }
    autoplayTimeLeft = delay;
    const speed = swiper.params.speed;
    const proceed = () => {
      if (!swiper || swiper.destroyed) return;
      if (swiper.params.autoplay.reverseDirection) {
        if (!swiper.isBeginning || swiper.params.loop || swiper.params.rewind) {
          swiper.slidePrev(speed, true, true);
          emit('autoplay');
        } else if (!swiper.params.autoplay.stopOnLastSlide) {
          swiper.slideTo(swiper.slides.length - 1, speed, true, true);
          emit('autoplay');
        }
      } else {
        if (!swiper.isEnd || swiper.params.loop || swiper.params.rewind) {
          swiper.slideNext(speed, true, true);
          emit('autoplay');
        } else if (!swiper.params.autoplay.stopOnLastSlide) {
          swiper.slideTo(0, speed, true, true);
          emit('autoplay');
        }
      }
      if (swiper.params.cssMode) {
        autoplayStartTime = new Date().getTime();
        requestAnimationFrame(() => {
          run();
        });
      }
    };
    if (delay > 0) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        proceed();
      }, delay);
    } else {
      requestAnimationFrame(() => {
        proceed();
      });
    }

    // eslint-disable-next-line
    return delay;
  };
  const start = () => {
    autoplayStartTime = new Date().getTime();
    swiper.autoplay.running = true;
    run();
    emit('autoplayStart');
  };
  const stop = () => {
    swiper.autoplay.running = false;
    clearTimeout(timeout);
    cancelAnimationFrame(raf);
    emit('autoplayStop');
  };
  const pause = (internal, reset) => {
    if (swiper.destroyed || !swiper.autoplay.running) return;
    clearTimeout(timeout);
    if (!internal) {
      pausedByInteraction = true;
    }
    const proceed = () => {
      emit('autoplayPause');
      if (swiper.params.autoplay.waitForTransition) {
        swiper.wrapperEl.addEventListener('transitionend', onTransitionEnd);
      } else {
        resume();
      }
    };
    swiper.autoplay.paused = true;
    if (reset) {
      if (slideChanged) {
        autoplayTimeLeft = swiper.params.autoplay.delay;
      }
      slideChanged = false;
      proceed();
      return;
    }
    const delay = autoplayTimeLeft || swiper.params.autoplay.delay;
    autoplayTimeLeft = delay - (new Date().getTime() - autoplayStartTime);
    if (swiper.isEnd && autoplayTimeLeft < 0 && !swiper.params.loop) return;
    if (autoplayTimeLeft < 0) autoplayTimeLeft = 0;
    proceed();
  };
  const resume = () => {
    if (swiper.isEnd && autoplayTimeLeft < 0 && !swiper.params.loop || swiper.destroyed || !swiper.autoplay.running) return;
    autoplayStartTime = new Date().getTime();
    if (pausedByInteraction) {
      pausedByInteraction = false;
      run(autoplayTimeLeft);
    } else {
      run();
    }
    swiper.autoplay.paused = false;
    emit('autoplayResume');
  };
  const onVisibilityChange = () => {
    if (swiper.destroyed || !swiper.autoplay.running) return;
    const document = getDocument();
    if (document.visibilityState === 'hidden') {
      pausedByInteraction = true;
      pause(true);
    }
    if (document.visibilityState === 'visible') {
      resume();
    }
  };
  const onPointerEnter = e => {
    if (e.pointerType !== 'mouse') return;
    pausedByInteraction = true;
    pausedByPointerEnter = true;
    if (swiper.animating || swiper.autoplay.paused) return;
    pause(true);
  };
  const onPointerLeave = e => {
    if (e.pointerType !== 'mouse') return;
    pausedByPointerEnter = false;
    if (swiper.autoplay.paused) {
      resume();
    }
  };
  const attachMouseEvents = () => {
    if (swiper.params.autoplay.pauseOnMouseEnter) {
      swiper.el.addEventListener('pointerenter', onPointerEnter);
      swiper.el.addEventListener('pointerleave', onPointerLeave);
    }
  };
  const detachMouseEvents = () => {
    swiper.el.removeEventListener('pointerenter', onPointerEnter);
    swiper.el.removeEventListener('pointerleave', onPointerLeave);
  };
  const attachDocumentEvents = () => {
    const document = getDocument();
    document.addEventListener('visibilitychange', onVisibilityChange);
  };
  const detachDocumentEvents = () => {
    const document = getDocument();
    document.removeEventListener('visibilitychange', onVisibilityChange);
  };
  on('init', () => {
    if (swiper.params.autoplay.enabled) {
      attachMouseEvents();
      attachDocumentEvents();
      start();
    }
  });
  on('destroy', () => {
    detachMouseEvents();
    detachDocumentEvents();
    if (swiper.autoplay.running) {
      stop();
    }
  });
  on('_freeModeStaticRelease', () => {
    if (pausedByTouch || pausedByInteraction) {
      resume();
    }
  });
  on('_freeModeNoMomentumRelease', () => {
    if (!swiper.params.autoplay.disableOnInteraction) {
      pause(true, true);
    } else {
      stop();
    }
  });
  on('beforeTransitionStart', (_s, speed, internal) => {
    if (swiper.destroyed || !swiper.autoplay.running) return;
    if (internal || !swiper.params.autoplay.disableOnInteraction) {
      pause(true, true);
    } else {
      stop();
    }
  });
  on('sliderFirstMove', () => {
    if (swiper.destroyed || !swiper.autoplay.running) return;
    if (swiper.params.autoplay.disableOnInteraction) {
      stop();
      return;
    }
    isTouched = true;
    pausedByTouch = false;
    pausedByInteraction = false;
    touchStartTimeout = setTimeout(() => {
      pausedByInteraction = true;
      pausedByTouch = true;
      pause(true);
    }, 200);
  });
  on('touchEnd', () => {
    if (swiper.destroyed || !swiper.autoplay.running || !isTouched) return;
    clearTimeout(touchStartTimeout);
    clearTimeout(timeout);
    if (swiper.params.autoplay.disableOnInteraction) {
      pausedByTouch = false;
      isTouched = false;
      return;
    }
    if (pausedByTouch && swiper.params.cssMode) resume();
    pausedByTouch = false;
    isTouched = false;
  });
  on('slideChange', () => {
    if (swiper.destroyed || !swiper.autoplay.running) return;
    slideChanged = true;
  });
  Object.assign(swiper.autoplay, {
    start,
    stop,
    pause,
    resume
  });
}



;// CONCATENATED MODULE: ./node_modules/swiper/modules/thumbs.mjs



function Thumb(_ref) {
  let {
    swiper,
    extendParams,
    on
  } = _ref;
  extendParams({
    thumbs: {
      swiper: null,
      multipleActiveThumbs: true,
      autoScrollOffset: 0,
      slideThumbActiveClass: 'swiper-slide-thumb-active',
      thumbsContainerClass: 'swiper-thumbs'
    }
  });
  let initialized = false;
  let swiperCreated = false;
  swiper.thumbs = {
    swiper: null
  };
  function onThumbClick() {
    const thumbsSwiper = swiper.thumbs.swiper;
    if (!thumbsSwiper || thumbsSwiper.destroyed) return;
    const clickedIndex = thumbsSwiper.clickedIndex;
    const clickedSlide = thumbsSwiper.clickedSlide;
    if (clickedSlide && clickedSlide.classList.contains(swiper.params.thumbs.slideThumbActiveClass)) return;
    if (typeof clickedIndex === 'undefined' || clickedIndex === null) return;
    let slideToIndex;
    if (thumbsSwiper.params.loop) {
      slideToIndex = parseInt(thumbsSwiper.clickedSlide.getAttribute('data-swiper-slide-index'), 10);
    } else {
      slideToIndex = clickedIndex;
    }
    if (swiper.params.loop) {
      swiper.slideToLoop(slideToIndex);
    } else {
      swiper.slideTo(slideToIndex);
    }
  }
  function init() {
    const {
      thumbs: thumbsParams
    } = swiper.params;
    if (initialized) return false;
    initialized = true;
    const SwiperClass = swiper.constructor;
    if (thumbsParams.swiper instanceof SwiperClass) {
      swiper.thumbs.swiper = thumbsParams.swiper;
      Object.assign(swiper.thumbs.swiper.originalParams, {
        watchSlidesProgress: true,
        slideToClickedSlide: false
      });
      Object.assign(swiper.thumbs.swiper.params, {
        watchSlidesProgress: true,
        slideToClickedSlide: false
      });
      swiper.thumbs.swiper.update();
    } else if (utils_isObject(thumbsParams.swiper)) {
      const thumbsSwiperParams = Object.assign({}, thumbsParams.swiper);
      Object.assign(thumbsSwiperParams, {
        watchSlidesProgress: true,
        slideToClickedSlide: false
      });
      swiper.thumbs.swiper = new SwiperClass(thumbsSwiperParams);
      swiperCreated = true;
    }
    swiper.thumbs.swiper.el.classList.add(swiper.params.thumbs.thumbsContainerClass);
    swiper.thumbs.swiper.on('tap', onThumbClick);
    return true;
  }
  function update(initial) {
    const thumbsSwiper = swiper.thumbs.swiper;
    if (!thumbsSwiper || thumbsSwiper.destroyed) return;
    const slidesPerView = thumbsSwiper.params.slidesPerView === 'auto' ? thumbsSwiper.slidesPerViewDynamic() : thumbsSwiper.params.slidesPerView;

    // Activate thumbs
    let thumbsToActivate = 1;
    const thumbActiveClass = swiper.params.thumbs.slideThumbActiveClass;
    if (swiper.params.slidesPerView > 1 && !swiper.params.centeredSlides) {
      thumbsToActivate = swiper.params.slidesPerView;
    }
    if (!swiper.params.thumbs.multipleActiveThumbs) {
      thumbsToActivate = 1;
    }
    thumbsToActivate = Math.floor(thumbsToActivate);
    thumbsSwiper.slides.forEach(slideEl => slideEl.classList.remove(thumbActiveClass));
    if (thumbsSwiper.params.loop || thumbsSwiper.params.virtual && thumbsSwiper.params.virtual.enabled) {
      for (let i = 0; i < thumbsToActivate; i += 1) {
        elementChildren(thumbsSwiper.slidesEl, `[data-swiper-slide-index="${swiper.realIndex + i}"]`).forEach(slideEl => {
          slideEl.classList.add(thumbActiveClass);
        });
      }
    } else {
      for (let i = 0; i < thumbsToActivate; i += 1) {
        if (thumbsSwiper.slides[swiper.realIndex + i]) {
          thumbsSwiper.slides[swiper.realIndex + i].classList.add(thumbActiveClass);
        }
      }
    }
    const autoScrollOffset = swiper.params.thumbs.autoScrollOffset;
    const useOffset = autoScrollOffset && !thumbsSwiper.params.loop;
    if (swiper.realIndex !== thumbsSwiper.realIndex || useOffset) {
      const currentThumbsIndex = thumbsSwiper.activeIndex;
      let newThumbsIndex;
      let direction;
      if (thumbsSwiper.params.loop) {
        const newThumbsSlide = thumbsSwiper.slides.filter(slideEl => slideEl.getAttribute('data-swiper-slide-index') === `${swiper.realIndex}`)[0];
        newThumbsIndex = thumbsSwiper.slides.indexOf(newThumbsSlide);
        direction = swiper.activeIndex > swiper.previousIndex ? 'next' : 'prev';
      } else {
        newThumbsIndex = swiper.realIndex;
        direction = newThumbsIndex > swiper.previousIndex ? 'next' : 'prev';
      }
      if (useOffset) {
        newThumbsIndex += direction === 'next' ? autoScrollOffset : -1 * autoScrollOffset;
      }
      if (thumbsSwiper.visibleSlidesIndexes && thumbsSwiper.visibleSlidesIndexes.indexOf(newThumbsIndex) < 0) {
        if (thumbsSwiper.params.centeredSlides) {
          if (newThumbsIndex > currentThumbsIndex) {
            newThumbsIndex = newThumbsIndex - Math.floor(slidesPerView / 2) + 1;
          } else {
            newThumbsIndex = newThumbsIndex + Math.floor(slidesPerView / 2) - 1;
          }
        } else if (newThumbsIndex > currentThumbsIndex && thumbsSwiper.params.slidesPerGroup === 1) ;
        thumbsSwiper.slideTo(newThumbsIndex, initial ? 0 : undefined);
      }
    }
  }
  on('beforeInit', () => {
    const {
      thumbs
    } = swiper.params;
    if (!thumbs || !thumbs.swiper) return;
    if (typeof thumbs.swiper === 'string' || thumbs.swiper instanceof HTMLElement) {
      const document = getDocument();
      const getThumbsElementAndInit = () => {
        const thumbsElement = typeof thumbs.swiper === 'string' ? document.querySelector(thumbs.swiper) : thumbs.swiper;
        if (thumbsElement && thumbsElement.swiper) {
          thumbs.swiper = thumbsElement.swiper;
          init();
          update(true);
        } else if (thumbsElement) {
          const onThumbsSwiper = e => {
            thumbs.swiper = e.detail[0];
            thumbsElement.removeEventListener('init', onThumbsSwiper);
            init();
            update(true);
            thumbs.swiper.update();
            swiper.update();
          };
          thumbsElement.addEventListener('init', onThumbsSwiper);
        }
        return thumbsElement;
      };
      const watchForThumbsToAppear = () => {
        if (swiper.destroyed) return;
        const thumbsElement = getThumbsElementAndInit();
        if (!thumbsElement) {
          requestAnimationFrame(watchForThumbsToAppear);
        }
      };
      requestAnimationFrame(watchForThumbsToAppear);
    } else {
      init();
      update(true);
    }
  });
  on('slideChange update resize observerUpdate', () => {
    update();
  });
  on('setTransition', (_s, duration) => {
    const thumbsSwiper = swiper.thumbs.swiper;
    if (!thumbsSwiper || thumbsSwiper.destroyed) return;
    thumbsSwiper.setTransition(duration);
  });
  on('beforeDestroy', () => {
    const thumbsSwiper = swiper.thumbs.swiper;
    if (!thumbsSwiper || thumbsSwiper.destroyed) return;
    if (swiperCreated) {
      thumbsSwiper.destroy();
    }
  });
  Object.assign(swiper.thumbs, {
    init,
    update
  });
}



;// CONCATENATED MODULE: ./node_modules/swiper/modules/free-mode.mjs


function freeMode(_ref) {
  let {
    swiper,
    extendParams,
    emit,
    once
  } = _ref;
  extendParams({
    freeMode: {
      enabled: false,
      momentum: true,
      momentumRatio: 1,
      momentumBounce: true,
      momentumBounceRatio: 1,
      momentumVelocityRatio: 1,
      sticky: false,
      minimumVelocity: 0.02
    }
  });
  function onTouchStart() {
    if (swiper.params.cssMode) return;
    const translate = swiper.getTranslate();
    swiper.setTranslate(translate);
    swiper.setTransition(0);
    swiper.touchEventsData.velocities.length = 0;
    swiper.freeMode.onTouchEnd({
      currentPos: swiper.rtl ? swiper.translate : -swiper.translate
    });
  }
  function onTouchMove() {
    if (swiper.params.cssMode) return;
    const {
      touchEventsData: data,
      touches
    } = swiper;
    // Velocity
    if (data.velocities.length === 0) {
      data.velocities.push({
        position: touches[swiper.isHorizontal() ? 'startX' : 'startY'],
        time: data.touchStartTime
      });
    }
    data.velocities.push({
      position: touches[swiper.isHorizontal() ? 'currentX' : 'currentY'],
      time: now()
    });
  }
  function onTouchEnd(_ref2) {
    let {
      currentPos
    } = _ref2;
    if (swiper.params.cssMode) return;
    const {
      params,
      wrapperEl,
      rtlTranslate: rtl,
      snapGrid,
      touchEventsData: data
    } = swiper;
    // Time diff
    const touchEndTime = now();
    const timeDiff = touchEndTime - data.touchStartTime;
    if (currentPos < -swiper.minTranslate()) {
      swiper.slideTo(swiper.activeIndex);
      return;
    }
    if (currentPos > -swiper.maxTranslate()) {
      if (swiper.slides.length < snapGrid.length) {
        swiper.slideTo(snapGrid.length - 1);
      } else {
        swiper.slideTo(swiper.slides.length - 1);
      }
      return;
    }
    if (params.freeMode.momentum) {
      if (data.velocities.length > 1) {
        const lastMoveEvent = data.velocities.pop();
        const velocityEvent = data.velocities.pop();
        const distance = lastMoveEvent.position - velocityEvent.position;
        const time = lastMoveEvent.time - velocityEvent.time;
        swiper.velocity = distance / time;
        swiper.velocity /= 2;
        if (Math.abs(swiper.velocity) < params.freeMode.minimumVelocity) {
          swiper.velocity = 0;
        }
        // this implies that the user stopped moving a finger then released.
        // There would be no events with distance zero, so the last event is stale.
        if (time > 150 || now() - lastMoveEvent.time > 300) {
          swiper.velocity = 0;
        }
      } else {
        swiper.velocity = 0;
      }
      swiper.velocity *= params.freeMode.momentumVelocityRatio;
      data.velocities.length = 0;
      let momentumDuration = 1000 * params.freeMode.momentumRatio;
      const momentumDistance = swiper.velocity * momentumDuration;
      let newPosition = swiper.translate + momentumDistance;
      if (rtl) newPosition = -newPosition;
      let doBounce = false;
      let afterBouncePosition;
      const bounceAmount = Math.abs(swiper.velocity) * 20 * params.freeMode.momentumBounceRatio;
      let needsLoopFix;
      if (newPosition < swiper.maxTranslate()) {
        if (params.freeMode.momentumBounce) {
          if (newPosition + swiper.maxTranslate() < -bounceAmount) {
            newPosition = swiper.maxTranslate() - bounceAmount;
          }
          afterBouncePosition = swiper.maxTranslate();
          doBounce = true;
          data.allowMomentumBounce = true;
        } else {
          newPosition = swiper.maxTranslate();
        }
        if (params.loop && params.centeredSlides) needsLoopFix = true;
      } else if (newPosition > swiper.minTranslate()) {
        if (params.freeMode.momentumBounce) {
          if (newPosition - swiper.minTranslate() > bounceAmount) {
            newPosition = swiper.minTranslate() + bounceAmount;
          }
          afterBouncePosition = swiper.minTranslate();
          doBounce = true;
          data.allowMomentumBounce = true;
        } else {
          newPosition = swiper.minTranslate();
        }
        if (params.loop && params.centeredSlides) needsLoopFix = true;
      } else if (params.freeMode.sticky) {
        let nextSlide;
        for (let j = 0; j < snapGrid.length; j += 1) {
          if (snapGrid[j] > -newPosition) {
            nextSlide = j;
            break;
          }
        }
        if (Math.abs(snapGrid[nextSlide] - newPosition) < Math.abs(snapGrid[nextSlide - 1] - newPosition) || swiper.swipeDirection === 'next') {
          newPosition = snapGrid[nextSlide];
        } else {
          newPosition = snapGrid[nextSlide - 1];
        }
        newPosition = -newPosition;
      }
      if (needsLoopFix) {
        once('transitionEnd', () => {
          swiper.loopFix();
        });
      }
      // Fix duration
      if (swiper.velocity !== 0) {
        if (rtl) {
          momentumDuration = Math.abs((-newPosition - swiper.translate) / swiper.velocity);
        } else {
          momentumDuration = Math.abs((newPosition - swiper.translate) / swiper.velocity);
        }
        if (params.freeMode.sticky) {
          // If freeMode.sticky is active and the user ends a swipe with a slow-velocity
          // event, then durations can be 20+ seconds to slide one (or zero!) slides.
          // It's easy to see this when simulating touch with mouse events. To fix this,
          // limit single-slide swipes to the default slide duration. This also has the
          // nice side effect of matching slide speed if the user stopped moving before
          // lifting finger or mouse vs. moving slowly before lifting the finger/mouse.
          // For faster swipes, also apply limits (albeit higher ones).
          const moveDistance = Math.abs((rtl ? -newPosition : newPosition) - swiper.translate);
          const currentSlideSize = swiper.slidesSizesGrid[swiper.activeIndex];
          if (moveDistance < currentSlideSize) {
            momentumDuration = params.speed;
          } else if (moveDistance < 2 * currentSlideSize) {
            momentumDuration = params.speed * 1.5;
          } else {
            momentumDuration = params.speed * 2.5;
          }
        }
      } else if (params.freeMode.sticky) {
        swiper.slideToClosest();
        return;
      }
      if (params.freeMode.momentumBounce && doBounce) {
        swiper.updateProgress(afterBouncePosition);
        swiper.setTransition(momentumDuration);
        swiper.setTranslate(newPosition);
        swiper.transitionStart(true, swiper.swipeDirection);
        swiper.animating = true;
        elementTransitionEnd(wrapperEl, () => {
          if (!swiper || swiper.destroyed || !data.allowMomentumBounce) return;
          emit('momentumBounce');
          swiper.setTransition(params.speed);
          setTimeout(() => {
            swiper.setTranslate(afterBouncePosition);
            elementTransitionEnd(wrapperEl, () => {
              if (!swiper || swiper.destroyed) return;
              swiper.transitionEnd();
            });
          }, 0);
        });
      } else if (swiper.velocity) {
        emit('_freeModeNoMomentumRelease');
        swiper.updateProgress(newPosition);
        swiper.setTransition(momentumDuration);
        swiper.setTranslate(newPosition);
        swiper.transitionStart(true, swiper.swipeDirection);
        if (!swiper.animating) {
          swiper.animating = true;
          elementTransitionEnd(wrapperEl, () => {
            if (!swiper || swiper.destroyed) return;
            swiper.transitionEnd();
          });
        }
      } else {
        swiper.updateProgress(newPosition);
      }
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
    } else if (params.freeMode.sticky) {
      swiper.slideToClosest();
      return;
    } else if (params.freeMode) {
      emit('_freeModeNoMomentumRelease');
    }
    if (!params.freeMode.momentum || timeDiff >= params.longSwipesMs) {
      emit('_freeModeStaticRelease');
      swiper.updateProgress();
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
    }
  }
  Object.assign(swiper, {
    freeMode: {
      onTouchStart,
      onTouchMove,
      onTouchEnd
    }
  });
}



;// CONCATENATED MODULE: ./node_modules/swiper/modules/grid.mjs
function Grid(_ref) {
  let {
    swiper,
    extendParams,
    on
  } = _ref;
  extendParams({
    grid: {
      rows: 1,
      fill: 'column'
    }
  });
  let slidesNumberEvenToRows;
  let slidesPerRow;
  let numFullColumns;
  let wasMultiRow;
  const getSpaceBetween = () => {
    let spaceBetween = swiper.params.spaceBetween;
    if (typeof spaceBetween === 'string' && spaceBetween.indexOf('%') >= 0) {
      spaceBetween = parseFloat(spaceBetween.replace('%', '')) / 100 * swiper.size;
    } else if (typeof spaceBetween === 'string') {
      spaceBetween = parseFloat(spaceBetween);
    }
    return spaceBetween;
  };
  const initSlides = slides => {
    const {
      slidesPerView
    } = swiper.params;
    const {
      rows,
      fill
    } = swiper.params.grid;
    const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : slides.length;
    numFullColumns = Math.floor(slidesLength / rows);
    if (Math.floor(slidesLength / rows) === slidesLength / rows) {
      slidesNumberEvenToRows = slidesLength;
    } else {
      slidesNumberEvenToRows = Math.ceil(slidesLength / rows) * rows;
    }
    if (slidesPerView !== 'auto' && fill === 'row') {
      slidesNumberEvenToRows = Math.max(slidesNumberEvenToRows, slidesPerView * rows);
    }
    slidesPerRow = slidesNumberEvenToRows / rows;
  };
  const unsetSlides = () => {
    if (swiper.slides) {
      swiper.slides.forEach(slide => {
        if (slide.swiperSlideGridSet) {
          slide.style.height = '';
          slide.style[swiper.getDirectionLabel('margin-top')] = '';
        }
      });
    }
  };
  const updateSlide = (i, slide, slides) => {
    const {
      slidesPerGroup
    } = swiper.params;
    const spaceBetween = getSpaceBetween();
    const {
      rows,
      fill
    } = swiper.params.grid;
    const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : slides.length;
    // Set slides order
    let newSlideOrderIndex;
    let column;
    let row;
    if (fill === 'row' && slidesPerGroup > 1) {
      const groupIndex = Math.floor(i / (slidesPerGroup * rows));
      const slideIndexInGroup = i - rows * slidesPerGroup * groupIndex;
      const columnsInGroup = groupIndex === 0 ? slidesPerGroup : Math.min(Math.ceil((slidesLength - groupIndex * rows * slidesPerGroup) / rows), slidesPerGroup);
      row = Math.floor(slideIndexInGroup / columnsInGroup);
      column = slideIndexInGroup - row * columnsInGroup + groupIndex * slidesPerGroup;
      newSlideOrderIndex = column + row * slidesNumberEvenToRows / rows;
      slide.style.order = newSlideOrderIndex;
    } else if (fill === 'column') {
      column = Math.floor(i / rows);
      row = i - column * rows;
      if (column > numFullColumns || column === numFullColumns && row === rows - 1) {
        row += 1;
        if (row >= rows) {
          row = 0;
          column += 1;
        }
      }
    } else {
      row = Math.floor(i / slidesPerRow);
      column = i - row * slidesPerRow;
    }
    slide.row = row;
    slide.column = column;
    slide.style.height = `calc((100% - ${(rows - 1) * spaceBetween}px) / ${rows})`;
    slide.style[swiper.getDirectionLabel('margin-top')] = row !== 0 ? spaceBetween && `${spaceBetween}px` : '';
    slide.swiperSlideGridSet = true;
  };
  const updateWrapperSize = (slideSize, snapGrid) => {
    const {
      centeredSlides,
      roundLengths
    } = swiper.params;
    const spaceBetween = getSpaceBetween();
    const {
      rows
    } = swiper.params.grid;
    swiper.virtualSize = (slideSize + spaceBetween) * slidesNumberEvenToRows;
    swiper.virtualSize = Math.ceil(swiper.virtualSize / rows) - spaceBetween;
    if (!swiper.params.cssMode) {
      swiper.wrapperEl.style[swiper.getDirectionLabel('width')] = `${swiper.virtualSize + spaceBetween}px`;
    }
    if (centeredSlides) {
      const newSlidesGrid = [];
      for (let i = 0; i < snapGrid.length; i += 1) {
        let slidesGridItem = snapGrid[i];
        if (roundLengths) slidesGridItem = Math.floor(slidesGridItem);
        if (snapGrid[i] < swiper.virtualSize + snapGrid[0]) newSlidesGrid.push(slidesGridItem);
      }
      snapGrid.splice(0, snapGrid.length);
      snapGrid.push(...newSlidesGrid);
    }
  };
  const onInit = () => {
    wasMultiRow = swiper.params.grid && swiper.params.grid.rows > 1;
  };
  const onUpdate = () => {
    const {
      params,
      el
    } = swiper;
    const isMultiRow = params.grid && params.grid.rows > 1;
    if (wasMultiRow && !isMultiRow) {
      el.classList.remove(`${params.containerModifierClass}grid`, `${params.containerModifierClass}grid-column`);
      numFullColumns = 1;
      swiper.emitContainerClasses();
    } else if (!wasMultiRow && isMultiRow) {
      el.classList.add(`${params.containerModifierClass}grid`);
      if (params.grid.fill === 'column') {
        el.classList.add(`${params.containerModifierClass}grid-column`);
      }
      swiper.emitContainerClasses();
    }
    wasMultiRow = isMultiRow;
  };
  on('init', onInit);
  on('update', onUpdate);
  swiper.grid = {
    initSlides,
    unsetSlides,
    updateSlide,
    updateWrapperSize
  };
}



;// CONCATENATED MODULE: ./node_modules/swiper/modules/manipulation.mjs
function appendSlide(slides) {
  const swiper = this;
  const {
    params,
    slidesEl
  } = swiper;
  if (params.loop) {
    swiper.loopDestroy();
  }
  const appendElement = slideEl => {
    if (typeof slideEl === 'string') {
      const tempDOM = document.createElement('div');
      tempDOM.innerHTML = slideEl;
      slidesEl.append(tempDOM.children[0]);
      tempDOM.innerHTML = '';
    } else {
      slidesEl.append(slideEl);
    }
  };
  if (typeof slides === 'object' && 'length' in slides) {
    for (let i = 0; i < slides.length; i += 1) {
      if (slides[i]) appendElement(slides[i]);
    }
  } else {
    appendElement(slides);
  }
  swiper.recalcSlides();
  if (params.loop) {
    swiper.loopCreate();
  }
  if (!params.observer || swiper.isElement) {
    swiper.update();
  }
}

function prependSlide(slides) {
  const swiper = this;
  const {
    params,
    activeIndex,
    slidesEl
  } = swiper;
  if (params.loop) {
    swiper.loopDestroy();
  }
  let newActiveIndex = activeIndex + 1;
  const prependElement = slideEl => {
    if (typeof slideEl === 'string') {
      const tempDOM = document.createElement('div');
      tempDOM.innerHTML = slideEl;
      slidesEl.prepend(tempDOM.children[0]);
      tempDOM.innerHTML = '';
    } else {
      slidesEl.prepend(slideEl);
    }
  };
  if (typeof slides === 'object' && 'length' in slides) {
    for (let i = 0; i < slides.length; i += 1) {
      if (slides[i]) prependElement(slides[i]);
    }
    newActiveIndex = activeIndex + slides.length;
  } else {
    prependElement(slides);
  }
  swiper.recalcSlides();
  if (params.loop) {
    swiper.loopCreate();
  }
  if (!params.observer || swiper.isElement) {
    swiper.update();
  }
  swiper.slideTo(newActiveIndex, 0, false);
}

function addSlide(index, slides) {
  const swiper = this;
  const {
    params,
    activeIndex,
    slidesEl
  } = swiper;
  let activeIndexBuffer = activeIndex;
  if (params.loop) {
    activeIndexBuffer -= swiper.loopedSlides;
    swiper.loopDestroy();
    swiper.recalcSlides();
  }
  const baseLength = swiper.slides.length;
  if (index <= 0) {
    swiper.prependSlide(slides);
    return;
  }
  if (index >= baseLength) {
    swiper.appendSlide(slides);
    return;
  }
  let newActiveIndex = activeIndexBuffer > index ? activeIndexBuffer + 1 : activeIndexBuffer;
  const slidesBuffer = [];
  for (let i = baseLength - 1; i >= index; i -= 1) {
    const currentSlide = swiper.slides[i];
    currentSlide.remove();
    slidesBuffer.unshift(currentSlide);
  }
  if (typeof slides === 'object' && 'length' in slides) {
    for (let i = 0; i < slides.length; i += 1) {
      if (slides[i]) slidesEl.append(slides[i]);
    }
    newActiveIndex = activeIndexBuffer > index ? activeIndexBuffer + slides.length : activeIndexBuffer;
  } else {
    slidesEl.append(slides);
  }
  for (let i = 0; i < slidesBuffer.length; i += 1) {
    slidesEl.append(slidesBuffer[i]);
  }
  swiper.recalcSlides();
  if (params.loop) {
    swiper.loopCreate();
  }
  if (!params.observer || swiper.isElement) {
    swiper.update();
  }
  if (params.loop) {
    swiper.slideTo(newActiveIndex + swiper.loopedSlides, 0, false);
  } else {
    swiper.slideTo(newActiveIndex, 0, false);
  }
}

function removeSlide(slidesIndexes) {
  const swiper = this;
  const {
    params,
    activeIndex
  } = swiper;
  let activeIndexBuffer = activeIndex;
  if (params.loop) {
    activeIndexBuffer -= swiper.loopedSlides;
    swiper.loopDestroy();
  }
  let newActiveIndex = activeIndexBuffer;
  let indexToRemove;
  if (typeof slidesIndexes === 'object' && 'length' in slidesIndexes) {
    for (let i = 0; i < slidesIndexes.length; i += 1) {
      indexToRemove = slidesIndexes[i];
      if (swiper.slides[indexToRemove]) swiper.slides[indexToRemove].remove();
      if (indexToRemove < newActiveIndex) newActiveIndex -= 1;
    }
    newActiveIndex = Math.max(newActiveIndex, 0);
  } else {
    indexToRemove = slidesIndexes;
    if (swiper.slides[indexToRemove]) swiper.slides[indexToRemove].remove();
    if (indexToRemove < newActiveIndex) newActiveIndex -= 1;
    newActiveIndex = Math.max(newActiveIndex, 0);
  }
  swiper.recalcSlides();
  if (params.loop) {
    swiper.loopCreate();
  }
  if (!params.observer || swiper.isElement) {
    swiper.update();
  }
  if (params.loop) {
    swiper.slideTo(newActiveIndex + swiper.loopedSlides, 0, false);
  } else {
    swiper.slideTo(newActiveIndex, 0, false);
  }
}

function removeAllSlides() {
  const swiper = this;
  const slidesIndexes = [];
  for (let i = 0; i < swiper.slides.length; i += 1) {
    slidesIndexes.push(i);
  }
  swiper.removeSlide(slidesIndexes);
}

function Manipulation(_ref) {
  let {
    swiper
  } = _ref;
  Object.assign(swiper, {
    appendSlide: appendSlide.bind(swiper),
    prependSlide: prependSlide.bind(swiper),
    addSlide: addSlide.bind(swiper),
    removeSlide: removeSlide.bind(swiper),
    removeAllSlides: removeAllSlides.bind(swiper)
  });
}



;// CONCATENATED MODULE: ./node_modules/swiper/shared/effect-init.mjs
function effectInit(params) {
  const {
    effect,
    swiper,
    on,
    setTranslate,
    setTransition,
    overwriteParams,
    perspective,
    recreateShadows,
    getEffectParams
  } = params;
  on('beforeInit', () => {
    if (swiper.params.effect !== effect) return;
    swiper.classNames.push(`${swiper.params.containerModifierClass}${effect}`);
    if (perspective && perspective()) {
      swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);
    }
    const overwriteParamsResult = overwriteParams ? overwriteParams() : {};
    Object.assign(swiper.params, overwriteParamsResult);
    Object.assign(swiper.originalParams, overwriteParamsResult);
  });
  on('setTranslate', () => {
    if (swiper.params.effect !== effect) return;
    setTranslate();
  });
  on('setTransition', (_s, duration) => {
    if (swiper.params.effect !== effect) return;
    setTransition(duration);
  });
  on('transitionEnd', () => {
    if (swiper.params.effect !== effect) return;
    if (recreateShadows) {
      if (!getEffectParams || !getEffectParams().slideShadows) return;
      // remove shadows
      swiper.slides.forEach(slideEl => {
        slideEl.querySelectorAll('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').forEach(shadowEl => shadowEl.remove());
      });
      // create new one
      recreateShadows();
    }
  });
  let requireUpdateOnVirtual;
  on('virtualUpdate', () => {
    if (swiper.params.effect !== effect) return;
    if (!swiper.slides.length) {
      requireUpdateOnVirtual = true;
    }
    requestAnimationFrame(() => {
      if (requireUpdateOnVirtual && swiper.slides && swiper.slides.length) {
        setTranslate();
        requireUpdateOnVirtual = false;
      }
    });
  });
}



;// CONCATENATED MODULE: ./node_modules/swiper/shared/effect-target.mjs


function effectTarget(effectParams, slideEl) {
  const transformEl = getSlideTransformEl(slideEl);
  if (transformEl !== slideEl) {
    transformEl.style.backfaceVisibility = 'hidden';
    transformEl.style['-webkit-backface-visibility'] = 'hidden';
  }
  return transformEl;
}



;// CONCATENATED MODULE: ./node_modules/swiper/shared/effect-virtual-transition-end.mjs


function effectVirtualTransitionEnd(_ref) {
  let {
    swiper,
    duration,
    transformElements,
    allSlides
  } = _ref;
  const {
    activeIndex
  } = swiper;
  const getSlide = el => {
    if (!el.parentElement) {
      // assume shadow root
      const slide = swiper.slides.filter(slideEl => slideEl.shadowRoot && slideEl.shadowRoot === el.parentNode)[0];
      return slide;
    }
    return el.parentElement;
  };
  if (swiper.params.virtualTranslate && duration !== 0) {
    let eventTriggered = false;
    let transitionEndTarget;
    if (allSlides) {
      transitionEndTarget = transformElements;
    } else {
      transitionEndTarget = transformElements.filter(transformEl => {
        const el = transformEl.classList.contains('swiper-slide-transform') ? getSlide(transformEl) : transformEl;
        return swiper.getSlideIndex(el) === activeIndex;
      });
    }
    transitionEndTarget.forEach(el => {
      elementTransitionEnd(el, () => {
        if (eventTriggered) return;
        if (!swiper || swiper.destroyed) return;
        eventTriggered = true;
        swiper.animating = false;
        const evt = new window.CustomEvent('transitionend', {
          bubbles: true,
          cancelable: true
        });
        swiper.wrapperEl.dispatchEvent(evt);
      });
    });
  }
}



;// CONCATENATED MODULE: ./node_modules/swiper/modules/effect-fade.mjs





function EffectFade(_ref) {
  let {
    swiper,
    extendParams,
    on
  } = _ref;
  extendParams({
    fadeEffect: {
      crossFade: false
    }
  });
  const setTranslate = () => {
    const {
      slides
    } = swiper;
    const params = swiper.params.fadeEffect;
    for (let i = 0; i < slides.length; i += 1) {
      const slideEl = swiper.slides[i];
      const offset = slideEl.swiperSlideOffset;
      let tx = -offset;
      if (!swiper.params.virtualTranslate) tx -= swiper.translate;
      let ty = 0;
      if (!swiper.isHorizontal()) {
        ty = tx;
        tx = 0;
      }
      const slideOpacity = swiper.params.fadeEffect.crossFade ? Math.max(1 - Math.abs(slideEl.progress), 0) : 1 + Math.min(Math.max(slideEl.progress, -1), 0);
      const targetEl = effectTarget(params, slideEl);
      targetEl.style.opacity = slideOpacity;
      targetEl.style.transform = `translate3d(${tx}px, ${ty}px, 0px)`;
    }
  };
  const setTransition = duration => {
    const transformElements = swiper.slides.map(slideEl => getSlideTransformEl(slideEl));
    transformElements.forEach(el => {
      el.style.transitionDuration = `${duration}ms`;
    });
    effectVirtualTransitionEnd({
      swiper,
      duration,
      transformElements,
      allSlides: true
    });
  };
  effectInit({
    effect: 'fade',
    swiper,
    on,
    setTranslate,
    setTransition,
    overwriteParams: () => ({
      slidesPerView: 1,
      slidesPerGroup: 1,
      watchSlidesProgress: true,
      spaceBetween: 0,
      virtualTranslate: !swiper.params.cssMode
    })
  });
}



;// CONCATENATED MODULE: ./node_modules/swiper/modules/effect-cube.mjs



function EffectCube(_ref) {
  let {
    swiper,
    extendParams,
    on
  } = _ref;
  extendParams({
    cubeEffect: {
      slideShadows: true,
      shadow: true,
      shadowOffset: 20,
      shadowScale: 0.94
    }
  });
  const createSlideShadows = (slideEl, progress, isHorizontal) => {
    let shadowBefore = isHorizontal ? slideEl.querySelector('.swiper-slide-shadow-left') : slideEl.querySelector('.swiper-slide-shadow-top');
    let shadowAfter = isHorizontal ? slideEl.querySelector('.swiper-slide-shadow-right') : slideEl.querySelector('.swiper-slide-shadow-bottom');
    if (!shadowBefore) {
      shadowBefore = createElement('div', `swiper-slide-shadow-cube swiper-slide-shadow-${isHorizontal ? 'left' : 'top'}`.split(' '));
      slideEl.append(shadowBefore);
    }
    if (!shadowAfter) {
      shadowAfter = createElement('div', `swiper-slide-shadow-cube swiper-slide-shadow-${isHorizontal ? 'right' : 'bottom'}`.split(' '));
      slideEl.append(shadowAfter);
    }
    if (shadowBefore) shadowBefore.style.opacity = Math.max(-progress, 0);
    if (shadowAfter) shadowAfter.style.opacity = Math.max(progress, 0);
  };
  const recreateShadows = () => {
    // create new ones
    const isHorizontal = swiper.isHorizontal();
    swiper.slides.forEach(slideEl => {
      const progress = Math.max(Math.min(slideEl.progress, 1), -1);
      createSlideShadows(slideEl, progress, isHorizontal);
    });
  };
  const setTranslate = () => {
    const {
      el,
      wrapperEl,
      slides,
      width: swiperWidth,
      height: swiperHeight,
      rtlTranslate: rtl,
      size: swiperSize,
      browser
    } = swiper;
    const params = swiper.params.cubeEffect;
    const isHorizontal = swiper.isHorizontal();
    const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
    let wrapperRotate = 0;
    let cubeShadowEl;
    if (params.shadow) {
      if (isHorizontal) {
        cubeShadowEl = swiper.wrapperEl.querySelector('.swiper-cube-shadow');
        if (!cubeShadowEl) {
          cubeShadowEl = createElement('div', 'swiper-cube-shadow');
          swiper.wrapperEl.append(cubeShadowEl);
        }
        cubeShadowEl.style.height = `${swiperWidth}px`;
      } else {
        cubeShadowEl = el.querySelector('.swiper-cube-shadow');
        if (!cubeShadowEl) {
          cubeShadowEl = createElement('div', 'swiper-cube-shadow');
          el.append(cubeShadowEl);
        }
      }
    }
    for (let i = 0; i < slides.length; i += 1) {
      const slideEl = slides[i];
      let slideIndex = i;
      if (isVirtual) {
        slideIndex = parseInt(slideEl.getAttribute('data-swiper-slide-index'), 10);
      }
      let slideAngle = slideIndex * 90;
      let round = Math.floor(slideAngle / 360);
      if (rtl) {
        slideAngle = -slideAngle;
        round = Math.floor(-slideAngle / 360);
      }
      const progress = Math.max(Math.min(slideEl.progress, 1), -1);
      let tx = 0;
      let ty = 0;
      let tz = 0;
      if (slideIndex % 4 === 0) {
        tx = -round * 4 * swiperSize;
        tz = 0;
      } else if ((slideIndex - 1) % 4 === 0) {
        tx = 0;
        tz = -round * 4 * swiperSize;
      } else if ((slideIndex - 2) % 4 === 0) {
        tx = swiperSize + round * 4 * swiperSize;
        tz = swiperSize;
      } else if ((slideIndex - 3) % 4 === 0) {
        tx = -swiperSize;
        tz = 3 * swiperSize + swiperSize * 4 * round;
      }
      if (rtl) {
        tx = -tx;
      }
      if (!isHorizontal) {
        ty = tx;
        tx = 0;
      }
      const transform = `rotateX(${isHorizontal ? 0 : -slideAngle}deg) rotateY(${isHorizontal ? slideAngle : 0}deg) translate3d(${tx}px, ${ty}px, ${tz}px)`;
      if (progress <= 1 && progress > -1) {
        wrapperRotate = slideIndex * 90 + progress * 90;
        if (rtl) wrapperRotate = -slideIndex * 90 - progress * 90;
        if (swiper.browser && swiper.browser.isSafari && Math.abs(wrapperRotate) / 90 % 2 === 1) {
          wrapperRotate += 0.001;
        }
      }
      slideEl.style.transform = transform;
      if (params.slideShadows) {
        createSlideShadows(slideEl, progress, isHorizontal);
      }
    }
    wrapperEl.style.transformOrigin = `50% 50% -${swiperSize / 2}px`;
    wrapperEl.style['-webkit-transform-origin'] = `50% 50% -${swiperSize / 2}px`;
    if (params.shadow) {
      if (isHorizontal) {
        cubeShadowEl.style.transform = `translate3d(0px, ${swiperWidth / 2 + params.shadowOffset}px, ${-swiperWidth / 2}px) rotateX(89.99deg) rotateZ(0deg) scale(${params.shadowScale})`;
      } else {
        const shadowAngle = Math.abs(wrapperRotate) - Math.floor(Math.abs(wrapperRotate) / 90) * 90;
        const multiplier = 1.5 - (Math.sin(shadowAngle * 2 * Math.PI / 360) / 2 + Math.cos(shadowAngle * 2 * Math.PI / 360) / 2);
        const scale1 = params.shadowScale;
        const scale2 = params.shadowScale / multiplier;
        const offset = params.shadowOffset;
        cubeShadowEl.style.transform = `scale3d(${scale1}, 1, ${scale2}) translate3d(0px, ${swiperHeight / 2 + offset}px, ${-swiperHeight / 2 / scale2}px) rotateX(-89.99deg)`;
      }
    }
    const zFactor = (browser.isSafari || browser.isWebView) && browser.needPerspectiveFix ? -swiperSize / 2 : 0;
    wrapperEl.style.transform = `translate3d(0px,0,${zFactor}px) rotateX(${swiper.isHorizontal() ? 0 : wrapperRotate}deg) rotateY(${swiper.isHorizontal() ? -wrapperRotate : 0}deg)`;
    wrapperEl.style.setProperty('--swiper-cube-translate-z', `${zFactor}px`);
  };
  const setTransition = duration => {
    const {
      el,
      slides
    } = swiper;
    slides.forEach(slideEl => {
      slideEl.style.transitionDuration = `${duration}ms`;
      slideEl.querySelectorAll('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').forEach(subEl => {
        subEl.style.transitionDuration = `${duration}ms`;
      });
    });
    if (swiper.params.cubeEffect.shadow && !swiper.isHorizontal()) {
      const shadowEl = el.querySelector('.swiper-cube-shadow');
      if (shadowEl) shadowEl.style.transitionDuration = `${duration}ms`;
    }
  };
  effectInit({
    effect: 'cube',
    swiper,
    on,
    setTranslate,
    setTransition,
    recreateShadows,
    getEffectParams: () => swiper.params.cubeEffect,
    perspective: () => true,
    overwriteParams: () => ({
      slidesPerView: 1,
      slidesPerGroup: 1,
      watchSlidesProgress: true,
      resistanceRatio: 0,
      spaceBetween: 0,
      centeredSlides: false,
      virtualTranslate: true
    })
  });
}



;// CONCATENATED MODULE: ./node_modules/swiper/shared/create-shadow.mjs


function createShadow(suffix, slideEl, side) {
  const shadowClass = `swiper-slide-shadow${side ? `-${side}` : ''}${suffix ? ` swiper-slide-shadow-${suffix}` : ''}`;
  const shadowContainer = getSlideTransformEl(slideEl);
  let shadowEl = shadowContainer.querySelector(`.${shadowClass.split(' ').join('.')}`);
  if (!shadowEl) {
    shadowEl = createElement('div', shadowClass.split(' '));
    shadowContainer.append(shadowEl);
  }
  return shadowEl;
}



;// CONCATENATED MODULE: ./node_modules/swiper/modules/effect-flip.mjs






function EffectFlip(_ref) {
  let {
    swiper,
    extendParams,
    on
  } = _ref;
  extendParams({
    flipEffect: {
      slideShadows: true,
      limitRotation: true
    }
  });
  const createSlideShadows = (slideEl, progress) => {
    let shadowBefore = swiper.isHorizontal() ? slideEl.querySelector('.swiper-slide-shadow-left') : slideEl.querySelector('.swiper-slide-shadow-top');
    let shadowAfter = swiper.isHorizontal() ? slideEl.querySelector('.swiper-slide-shadow-right') : slideEl.querySelector('.swiper-slide-shadow-bottom');
    if (!shadowBefore) {
      shadowBefore = createShadow('flip', slideEl, swiper.isHorizontal() ? 'left' : 'top');
    }
    if (!shadowAfter) {
      shadowAfter = createShadow('flip', slideEl, swiper.isHorizontal() ? 'right' : 'bottom');
    }
    if (shadowBefore) shadowBefore.style.opacity = Math.max(-progress, 0);
    if (shadowAfter) shadowAfter.style.opacity = Math.max(progress, 0);
  };
  const recreateShadows = () => {
    // Set shadows
    swiper.params.flipEffect;
    swiper.slides.forEach(slideEl => {
      let progress = slideEl.progress;
      if (swiper.params.flipEffect.limitRotation) {
        progress = Math.max(Math.min(slideEl.progress, 1), -1);
      }
      createSlideShadows(slideEl, progress);
    });
  };
  const setTranslate = () => {
    const {
      slides,
      rtlTranslate: rtl
    } = swiper;
    const params = swiper.params.flipEffect;
    for (let i = 0; i < slides.length; i += 1) {
      const slideEl = slides[i];
      let progress = slideEl.progress;
      if (swiper.params.flipEffect.limitRotation) {
        progress = Math.max(Math.min(slideEl.progress, 1), -1);
      }
      const offset = slideEl.swiperSlideOffset;
      const rotate = -180 * progress;
      let rotateY = rotate;
      let rotateX = 0;
      let tx = swiper.params.cssMode ? -offset - swiper.translate : -offset;
      let ty = 0;
      if (!swiper.isHorizontal()) {
        ty = tx;
        tx = 0;
        rotateX = -rotateY;
        rotateY = 0;
      } else if (rtl) {
        rotateY = -rotateY;
      }
      if (swiper.browser && swiper.browser.isSafari) {
        if (Math.abs(rotateY) / 90 % 2 === 1) {
          rotateY += 0.001;
        }
        if (Math.abs(rotateX) / 90 % 2 === 1) {
          rotateX += 0.001;
        }
      }
      slideEl.style.zIndex = -Math.abs(Math.round(progress)) + slides.length;
      if (params.slideShadows) {
        createSlideShadows(slideEl, progress);
      }
      const transform = `translate3d(${tx}px, ${ty}px, 0px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      const targetEl = effectTarget(params, slideEl);
      targetEl.style.transform = transform;
    }
  };
  const setTransition = duration => {
    const transformElements = swiper.slides.map(slideEl => getSlideTransformEl(slideEl));
    transformElements.forEach(el => {
      el.style.transitionDuration = `${duration}ms`;
      el.querySelectorAll('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').forEach(shadowEl => {
        shadowEl.style.transitionDuration = `${duration}ms`;
      });
    });
    effectVirtualTransitionEnd({
      swiper,
      duration,
      transformElements
    });
  };
  effectInit({
    effect: 'flip',
    swiper,
    on,
    setTranslate,
    setTransition,
    recreateShadows,
    getEffectParams: () => swiper.params.flipEffect,
    perspective: () => true,
    overwriteParams: () => ({
      slidesPerView: 1,
      slidesPerGroup: 1,
      watchSlidesProgress: true,
      spaceBetween: 0,
      virtualTranslate: !swiper.params.cssMode
    })
  });
}



;// CONCATENATED MODULE: ./node_modules/swiper/modules/effect-coverflow.mjs





function EffectCoverflow(_ref) {
  let {
    swiper,
    extendParams,
    on
  } = _ref;
  extendParams({
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      scale: 1,
      modifier: 1,
      slideShadows: true
    }
  });
  const setTranslate = () => {
    const {
      width: swiperWidth,
      height: swiperHeight,
      slides,
      slidesSizesGrid
    } = swiper;
    const params = swiper.params.coverflowEffect;
    const isHorizontal = swiper.isHorizontal();
    const transform = swiper.translate;
    const center = isHorizontal ? -transform + swiperWidth / 2 : -transform + swiperHeight / 2;
    const rotate = isHorizontal ? params.rotate : -params.rotate;
    const translate = params.depth;
    // Each slide offset from center
    for (let i = 0, length = slides.length; i < length; i += 1) {
      const slideEl = slides[i];
      const slideSize = slidesSizesGrid[i];
      const slideOffset = slideEl.swiperSlideOffset;
      const centerOffset = (center - slideOffset - slideSize / 2) / slideSize;
      const offsetMultiplier = typeof params.modifier === 'function' ? params.modifier(centerOffset) : centerOffset * params.modifier;
      let rotateY = isHorizontal ? rotate * offsetMultiplier : 0;
      let rotateX = isHorizontal ? 0 : rotate * offsetMultiplier;
      // var rotateZ = 0
      let translateZ = -translate * Math.abs(offsetMultiplier);
      let stretch = params.stretch;
      // Allow percentage to make a relative stretch for responsive sliders
      if (typeof stretch === 'string' && stretch.indexOf('%') !== -1) {
        stretch = parseFloat(params.stretch) / 100 * slideSize;
      }
      let translateY = isHorizontal ? 0 : stretch * offsetMultiplier;
      let translateX = isHorizontal ? stretch * offsetMultiplier : 0;
      let scale = 1 - (1 - params.scale) * Math.abs(offsetMultiplier);

      // Fix for ultra small values
      if (Math.abs(translateX) < 0.001) translateX = 0;
      if (Math.abs(translateY) < 0.001) translateY = 0;
      if (Math.abs(translateZ) < 0.001) translateZ = 0;
      if (Math.abs(rotateY) < 0.001) rotateY = 0;
      if (Math.abs(rotateX) < 0.001) rotateX = 0;
      if (Math.abs(scale) < 0.001) scale = 0;
      if (swiper.browser && swiper.browser.isSafari) {
        if (Math.abs(rotateY) / 90 % 2 === 1) {
          rotateY += 0.001;
        }
        if (Math.abs(rotateX) / 90 % 2 === 1) {
          rotateX += 0.001;
        }
      }
      const slideTransform = `translate3d(${translateX}px,${translateY}px,${translateZ}px)  rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
      const targetEl = effectTarget(params, slideEl);
      targetEl.style.transform = slideTransform;
      slideEl.style.zIndex = -Math.abs(Math.round(offsetMultiplier)) + 1;
      if (params.slideShadows) {
        // Set shadows
        let shadowBeforeEl = isHorizontal ? slideEl.querySelector('.swiper-slide-shadow-left') : slideEl.querySelector('.swiper-slide-shadow-top');
        let shadowAfterEl = isHorizontal ? slideEl.querySelector('.swiper-slide-shadow-right') : slideEl.querySelector('.swiper-slide-shadow-bottom');
        if (!shadowBeforeEl) {
          shadowBeforeEl = createShadow('coverflow', slideEl, isHorizontal ? 'left' : 'top');
        }
        if (!shadowAfterEl) {
          shadowAfterEl = createShadow('coverflow', slideEl, isHorizontal ? 'right' : 'bottom');
        }
        if (shadowBeforeEl) shadowBeforeEl.style.opacity = offsetMultiplier > 0 ? offsetMultiplier : 0;
        if (shadowAfterEl) shadowAfterEl.style.opacity = -offsetMultiplier > 0 ? -offsetMultiplier : 0;
      }
    }
  };
  const setTransition = duration => {
    const transformElements = swiper.slides.map(slideEl => getSlideTransformEl(slideEl));
    transformElements.forEach(el => {
      el.style.transitionDuration = `${duration}ms`;
      el.querySelectorAll('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').forEach(shadowEl => {
        shadowEl.style.transitionDuration = `${duration}ms`;
      });
    });
  };
  effectInit({
    effect: 'coverflow',
    swiper,
    on,
    setTranslate,
    setTransition,
    perspective: () => true,
    overwriteParams: () => ({
      watchSlidesProgress: true
    })
  });
}



;// CONCATENATED MODULE: ./node_modules/swiper/modules/effect-creative.mjs






function EffectCreative(_ref) {
  let {
    swiper,
    extendParams,
    on
  } = _ref;
  extendParams({
    creativeEffect: {
      limitProgress: 1,
      shadowPerProgress: false,
      progressMultiplier: 1,
      perspective: true,
      prev: {
        translate: [0, 0, 0],
        rotate: [0, 0, 0],
        opacity: 1,
        scale: 1
      },
      next: {
        translate: [0, 0, 0],
        rotate: [0, 0, 0],
        opacity: 1,
        scale: 1
      }
    }
  });
  const getTranslateValue = value => {
    if (typeof value === 'string') return value;
    return `${value}px`;
  };
  const setTranslate = () => {
    const {
      slides,
      wrapperEl,
      slidesSizesGrid
    } = swiper;
    const params = swiper.params.creativeEffect;
    const {
      progressMultiplier: multiplier
    } = params;
    const isCenteredSlides = swiper.params.centeredSlides;
    if (isCenteredSlides) {
      const margin = slidesSizesGrid[0] / 2 - swiper.params.slidesOffsetBefore || 0;
      wrapperEl.style.transform = `translateX(calc(50% - ${margin}px))`;
    }
    for (let i = 0; i < slides.length; i += 1) {
      const slideEl = slides[i];
      const slideProgress = slideEl.progress;
      const progress = Math.min(Math.max(slideEl.progress, -params.limitProgress), params.limitProgress);
      let originalProgress = progress;
      if (!isCenteredSlides) {
        originalProgress = Math.min(Math.max(slideEl.originalProgress, -params.limitProgress), params.limitProgress);
      }
      const offset = slideEl.swiperSlideOffset;
      const t = [swiper.params.cssMode ? -offset - swiper.translate : -offset, 0, 0];
      const r = [0, 0, 0];
      let custom = false;
      if (!swiper.isHorizontal()) {
        t[1] = t[0];
        t[0] = 0;
      }
      let data = {
        translate: [0, 0, 0],
        rotate: [0, 0, 0],
        scale: 1,
        opacity: 1
      };
      if (progress < 0) {
        data = params.next;
        custom = true;
      } else if (progress > 0) {
        data = params.prev;
        custom = true;
      }
      // set translate
      t.forEach((value, index) => {
        t[index] = `calc(${value}px + (${getTranslateValue(data.translate[index])} * ${Math.abs(progress * multiplier)}))`;
      });
      // set rotates
      r.forEach((value, index) => {
        let val = data.rotate[index] * Math.abs(progress * multiplier);
        if (swiper.browser && swiper.browser.isSafari && Math.abs(val) / 90 % 2 === 1) {
          val += 0.001;
        }
        r[index] = val;
      });
      slideEl.style.zIndex = -Math.abs(Math.round(slideProgress)) + slides.length;
      const translateString = t.join(', ');
      const rotateString = `rotateX(${r[0]}deg) rotateY(${r[1]}deg) rotateZ(${r[2]}deg)`;
      const scaleString = originalProgress < 0 ? `scale(${1 + (1 - data.scale) * originalProgress * multiplier})` : `scale(${1 - (1 - data.scale) * originalProgress * multiplier})`;
      const opacityString = originalProgress < 0 ? 1 + (1 - data.opacity) * originalProgress * multiplier : 1 - (1 - data.opacity) * originalProgress * multiplier;
      const transform = `translate3d(${translateString}) ${rotateString} ${scaleString}`;

      // Set shadows
      if (custom && data.shadow || !custom) {
        let shadowEl = slideEl.querySelector('.swiper-slide-shadow');
        if (!shadowEl && data.shadow) {
          shadowEl = createShadow('creative', slideEl);
        }
        if (shadowEl) {
          const shadowOpacity = params.shadowPerProgress ? progress * (1 / params.limitProgress) : progress;
          shadowEl.style.opacity = Math.min(Math.max(Math.abs(shadowOpacity), 0), 1);
        }
      }
      const targetEl = effectTarget(params, slideEl);
      targetEl.style.transform = transform;
      targetEl.style.opacity = opacityString;
      if (data.origin) {
        targetEl.style.transformOrigin = data.origin;
      }
    }
  };
  const setTransition = duration => {
    const transformElements = swiper.slides.map(slideEl => getSlideTransformEl(slideEl));
    transformElements.forEach(el => {
      el.style.transitionDuration = `${duration}ms`;
      el.querySelectorAll('.swiper-slide-shadow').forEach(shadowEl => {
        shadowEl.style.transitionDuration = `${duration}ms`;
      });
    });
    effectVirtualTransitionEnd({
      swiper,
      duration,
      transformElements,
      allSlides: true
    });
  };
  effectInit({
    effect: 'creative',
    swiper,
    on,
    setTranslate,
    setTransition,
    perspective: () => swiper.params.creativeEffect.perspective,
    overwriteParams: () => ({
      watchSlidesProgress: true,
      virtualTranslate: !swiper.params.cssMode
    })
  });
}



;// CONCATENATED MODULE: ./node_modules/swiper/modules/effect-cards.mjs






function EffectCards(_ref) {
  let {
    swiper,
    extendParams,
    on
  } = _ref;
  extendParams({
    cardsEffect: {
      slideShadows: true,
      rotate: true,
      perSlideRotate: 2,
      perSlideOffset: 8
    }
  });
  const setTranslate = () => {
    const {
      slides,
      activeIndex,
      rtlTranslate: rtl
    } = swiper;
    const params = swiper.params.cardsEffect;
    const {
      startTranslate,
      isTouched
    } = swiper.touchEventsData;
    const currentTranslate = rtl ? -swiper.translate : swiper.translate;
    for (let i = 0; i < slides.length; i += 1) {
      const slideEl = slides[i];
      const slideProgress = slideEl.progress;
      const progress = Math.min(Math.max(slideProgress, -4), 4);
      let offset = slideEl.swiperSlideOffset;
      if (swiper.params.centeredSlides && !swiper.params.cssMode) {
        swiper.wrapperEl.style.transform = `translateX(${swiper.minTranslate()}px)`;
      }
      if (swiper.params.centeredSlides && swiper.params.cssMode) {
        offset -= slides[0].swiperSlideOffset;
      }
      let tX = swiper.params.cssMode ? -offset - swiper.translate : -offset;
      let tY = 0;
      const tZ = -100 * Math.abs(progress);
      let scale = 1;
      let rotate = -params.perSlideRotate * progress;
      let tXAdd = params.perSlideOffset - Math.abs(progress) * 0.75;
      const slideIndex = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.from + i : i;
      const isSwipeToNext = (slideIndex === activeIndex || slideIndex === activeIndex - 1) && progress > 0 && progress < 1 && (isTouched || swiper.params.cssMode) && currentTranslate < startTranslate;
      const isSwipeToPrev = (slideIndex === activeIndex || slideIndex === activeIndex + 1) && progress < 0 && progress > -1 && (isTouched || swiper.params.cssMode) && currentTranslate > startTranslate;
      if (isSwipeToNext || isSwipeToPrev) {
        const subProgress = (1 - Math.abs((Math.abs(progress) - 0.5) / 0.5)) ** 0.5;
        rotate += -28 * progress * subProgress;
        scale += -0.5 * subProgress;
        tXAdd += 96 * subProgress;
        tY = `${-25 * subProgress * Math.abs(progress)}%`;
      }
      if (progress < 0) {
        // next
        tX = `calc(${tX}px ${rtl ? '-' : '+'} (${tXAdd * Math.abs(progress)}%))`;
      } else if (progress > 0) {
        // prev
        tX = `calc(${tX}px ${rtl ? '-' : '+'} (-${tXAdd * Math.abs(progress)}%))`;
      } else {
        tX = `${tX}px`;
      }
      if (!swiper.isHorizontal()) {
        const prevY = tY;
        tY = tX;
        tX = prevY;
      }
      const scaleString = progress < 0 ? `${1 + (1 - scale) * progress}` : `${1 - (1 - scale) * progress}`;

      /* eslint-disable */
      const transform = `
        translate3d(${tX}, ${tY}, ${tZ}px)
        rotateZ(${params.rotate ? rtl ? -rotate : rotate : 0}deg)
        scale(${scaleString})
      `;
      /* eslint-enable */

      if (params.slideShadows) {
        // Set shadows
        let shadowEl = slideEl.querySelector('.swiper-slide-shadow');
        if (!shadowEl) {
          shadowEl = createShadow('cards', slideEl);
        }
        if (shadowEl) shadowEl.style.opacity = Math.min(Math.max((Math.abs(progress) - 0.5) / 0.5, 0), 1);
      }
      slideEl.style.zIndex = -Math.abs(Math.round(slideProgress)) + slides.length;
      const targetEl = effectTarget(params, slideEl);
      targetEl.style.transform = transform;
    }
  };
  const setTransition = duration => {
    const transformElements = swiper.slides.map(slideEl => getSlideTransformEl(slideEl));
    transformElements.forEach(el => {
      el.style.transitionDuration = `${duration}ms`;
      el.querySelectorAll('.swiper-slide-shadow').forEach(shadowEl => {
        shadowEl.style.transitionDuration = `${duration}ms`;
      });
    });
    effectVirtualTransitionEnd({
      swiper,
      duration,
      transformElements
    });
  };
  effectInit({
    effect: 'cards',
    swiper,
    on,
    setTranslate,
    setTransition,
    perspective: () => true,
    overwriteParams: () => ({
      watchSlidesProgress: true,
      virtualTranslate: !swiper.params.cssMode
    })
  });
}



;// CONCATENATED MODULE: ./node_modules/swiper/swiper-bundle.mjs
/**
 * Swiper 11.0.5
 * Most modern mobile touch slider and framework with hardware accelerated transitions
 * https://swiperjs.com
 *
 * Copyright 2014-2023 Vladimir Kharlampidi
 *
 * Released under the MIT License
 *
 * Released on: November 22, 2023
 */


























// Swiper Class
const modules = [Virtual, Keyboard, Mousewheel, Navigation, Pagination, Scrollbar, Parallax, Zoom, Controller, A11y, History, HashNavigation, Autoplay, Thumb, freeMode, Grid, Manipulation, EffectFade, EffectCube, EffectFlip, EffectCoverflow, EffectCreative, EffectCards];
Swiper.use(modules);



;// CONCATENATED MODULE: ./src/js/components/aboutSwiper.js


const aboutSwiper = () => {
  const swiper = new Swiper('.about__swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    // loop: true,
    navigation: {
      nextEl: '.about__swiper-btn-next',
      prevEl: '.about__swiper-btn-prev'
    }
  });
};
/* harmony default export */ var components_aboutSwiper = (aboutSwiper);
;// CONCATENATED MODULE: ./src/js/components/artistsSwiper.js


const artistsSwiper = () => {
  const swiper_text = new Swiper('.artists__swiper-title', {
    allowTouchMove: false,
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    }
  });
  const swiper_main = new Swiper('.artists__swiper-photo', {
    slidesPerView: 'auto',
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    coverflowEffect: {
      rotate: 0,
      stretch: 50,
      depth: 600,
      modifier: 1.5,
      slideShadows: false
    },
    navigation: {
      nextEl: ".artistis__swiper-nav-btn--next",
      prevEl: ".artistis__swiper-nav-btn--prev"
    },
    thumbs: {
      swiper: swiper_text
    },
    breakpoints: {
      // when window width is >= 320px
      768: {
        coverflowEffect: {
          rotate: 0,
          stretch: 45,
          depth: 500,
          modifier: 1.5,
          slideShadows: false
        }
      }
    }
  });
};
/* harmony default export */ var components_artistsSwiper = (artistsSwiper);
;// CONCATENATED MODULE: ./src/js/components/releaseSwiper.js


const releaseSwiper = () => {
  const swiper = new Swiper('.release__swiper', {
    slidesPerView: 'auto',
    // loop: true,

    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    coverflowEffect: {
      rotate: 0,
      stretch: 45,
      depth: 330,
      modifier: 1.5,
      slideShadows: false
    },
    navigation: {
      nextEl: '.release__swiper-nav-btn--next',
      prevEl: '.release__swiper-nav-btn--prev'
    }
  });
};
/* harmony default export */ var components_releaseSwiper = (releaseSwiper);
;// CONCATENATED MODULE: ./src/js/components/burger.js
const burger = () => {
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.header__nav-wrapper');
  const overlay = document.querySelector('.overlay');
  const getScrollbarWidth = () => window.innerWidth - document.documentElement.clientWidth;
  function openBurger() {
    let scrollWith = getScrollbarWidth();
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollWith}px`;
    burger.classList.add('active');
    burger.style.paddingRight = `${scrollWith}px`;
    nav.classList.add('active');
    overlay.classList.add('active');
  }
  function closeBurger() {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    burger.classList.remove('active');
    burger.style.paddingRight = ``;
    nav.classList.remove('active');
    overlay.classList.remove('active');
  }
  burger.addEventListener('click', () => {
    burger.classList.contains('active') ? closeBurger() : openBurger();
  });
  overlay.addEventListener('click', e => {
    if (e.target === overlay) {
      closeBurger();
    }
  });
  nav.addEventListener('click', e => {
    if (e.target.classList.contains('header-top__nav-link')) {
      closeBurger();
    }
  });
};
/* harmony default export */ var components_burger = (burger);
;// CONCATENATED MODULE: ./src/js/components/scroll.js
const scroll_scroll = () => {
  const anchors = document.querySelectorAll(`.nav-link`);
  for (let anchor of anchors) {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const blockId = anchor.getAttribute('href');
      document.querySelector('' + blockId).scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  }
};
/* harmony default export */ var components_scroll = (scroll_scroll);
;// CONCATENATED MODULE: ./src/js/components/faq.js
const faq = () => {
  const accordionItemHeaders = document.querySelectorAll('.faq__accordion-item-header');
  accordionItemHeaders.forEach(accordionItemHeader => {
    accordionItemHeader.addEventListener('click', () => {
      const currentlyActiveAccordionItemHeader = document.querySelector('.faq__accordion-item-header.active');
      if (currentlyActiveAccordionItemHeader && currentlyActiveAccordionItemHeader !== accordionItemHeader) {
        currentlyActiveAccordionItemHeader.classList.toggle('active');
        currentlyActiveAccordionItemHeader.nextElementSibling.style.maxHeight = 0;
      }
      accordionItemHeader.classList.toggle('active');
      const accordionItemBody = accordionItemHeader.nextElementSibling;
      if (accordionItemHeader.classList.contains('active')) {
        accordionItemBody.style.maxHeight = accordionItemBody.scrollHeight + 'px';
      } else {
        accordionItemBody.style.maxHeight = 0;
      }
    });
  });
};
/* harmony default export */ var components_faq = (faq);
;// CONCATENATED MODULE: ./src/js/components/header.js
const header = () => {
  const nav = document.querySelector('.header');
  const navOffsetTop = nav.offsetTop;
  function handleScroll() {
    if (window.innerWidth > 768) {
      if (window.scrollY > navOffsetTop) {
        nav.classList.add('fixed-nav');
      } else {
        nav.classList.remove('fixed-nav');
      }
    }
  }
  window.addEventListener('scroll', handleScroll);
  // Инициализируем обработчик скролла при загрузке страницы
  handleScroll();
};
/* harmony default export */ var components_header = (header);
;// CONCATENATED MODULE: ./src/index.js








window.addEventListener('DOMContentLoaded', () => {
  try {
    components_header();
  } catch {}
  try {
    components_faq();
  } catch {}
  try {
    components_aboutSwiper();
  } catch {}
  try {
    components_artistsSwiper();
  } catch {}
  try {
    components_releaseSwiper();
  } catch {}
  try {
    components_burger();
  } catch {}
  try {
    components_scroll();
  } catch {}
});
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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O0FBQ1QsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULE9BQU87QUFDUCxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsV0FBVyxhQUFhLFNBQVM7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsU0FBUztBQUMxQjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLFdBQVc7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNGQUFzRixzQkFBc0I7QUFDNUc7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0Esd0JBQXdCLEdBQUc7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG1CQUFtQixXQUFXO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsNEJBQTRCLEdBQUc7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QztBQUN2QztBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHVCQUF1QixHQUFHO0FBQzFCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixHQUFHO0FBQzFCLEVBQUUsUUFBUTtBQUNWO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsdUJBQXVCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvSUFBb0k7QUFDcEk7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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O0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLFlBQU07QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSxZQUFNO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksWUFBTTtB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Q0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLHlCQUF5QjtBQUN4RDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFaUM7OztBQzFMMEM7QUFDQzs7QUFFNUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDLE9BQU87QUFDckQsNEJBQTRCLFFBQVEsSUFBSSxjQUFjO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIs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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVxQzs7O0FDNUYyQjs7QUFFaEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxNQUFNO0FBQ047QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsV0FBVztBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsV0FBVztBQUNoQztBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsV0FBVztBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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LENBQUNjLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLE1BQU07RUFDOUMsSUFBSTtJQUNBd0IsaUJBQU0sQ0FBQyxDQUFDO0VBQ1osQ0FBQyxDQUFDLE1BQU0sQ0FBQztFQUNULElBQUk7SUFDQVYsY0FBRyxDQUFDLENBQUM7RUFDVCxDQUFDLENBQUMsTUFBTSxDQUFDO0VBQ1QsSUFBSTtJQUNBM0Qsc0JBQVcsQ0FBQyxDQUFDO0VBQ2pCLENBQUMsQ0FBQyxNQUFNLENBQUM7RUFDVCxJQUFJO0lBQ0FPLHdCQUFhLENBQUMsQ0FBQztFQUNuQixDQUFDLENBQUMsTUFBTSxDQUFDO0VBQ1QsSUFBSTtJQUNBaUIsd0JBQWEsQ0FBQyxDQUFDO0VBQ25CLENBQUMsQ0FBQyxNQUFNLENBQUM7RUFDVCxJQUFJO0lBQ0FDLGlCQUFNLENBQUMsQ0FBQztFQUNaLENBQUMsQ0FBQyxNQUFNLENBQUM7RUFDVCxJQUFJO0lBQ0F3QixpQkFBTSxDQUFDLENBQUM7RUFDWixDQUFDLENBQUMsTUFBTSxDQUFDO0FBQ2IsQ0FBQyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9ub2RlX21vZHVsZXMvc3dpcGVyL3NoYXJlZC9zc3Itd2luZG93LmVzbS5tanMiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlLy4vbm9kZV9tb2R1bGVzL3N3aXBlci9zaGFyZWQvdXRpbHMubWpzIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL25vZGVfbW9kdWxlcy9zd2lwZXIvc2hhcmVkL3N3aXBlci1jb3JlLm1qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9ub2RlX21vZHVsZXMvc3dpcGVyL21vZHVsZXMvdmlydHVhbC5tanMiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlLy4vbm9kZV9tb2R1bGVzL3N3aXBlci9tb2R1bGVzL2tleWJvYXJkLm1qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9ub2RlX21vZHVsZXMvc3dpcGVyL21vZHVsZXMvbW91c2V3aGVlbC5tanMiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlLy4vbm9kZV9tb2R1bGVzL3N3aXBlci9zaGFyZWQvY3JlYXRlLWVsZW1lbnQtaWYtbm90LWRlZmluZWQubWpzIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL25vZGVfbW9kdWxlcy9zd2lwZXIvbW9kdWxlcy9uYXZpZ2F0aW9uLm1qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9ub2RlX21vZHVsZXMvc3dpcGVyL3NoYXJlZC9jbGFzc2VzLXRvLXNlbGVjdG9yLm1qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9ub2RlX21vZHVsZXMvc3dpcGVyL21vZHVsZXMvcGFnaW5hdGlvbi5tanMiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlLy4vbm9kZV9tb2R1bGVzL3N3aXBlci9tb2R1bGVzL3Njcm9sbGJhci5tanMiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlLy4vbm9kZV9tb2R1bGVzL3N3aXBlci9tb2R1bGVzL3BhcmFsbGF4Lm1qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9ub2RlX21vZHVsZXMvc3dpcGVyL21vZHVsZXMvem9vbS5tanMiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlLy4vbm9kZV9tb2R1bGVzL3N3aXBlci9tb2R1bGVzL2NvbnRyb2xsZXIubWpzIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL25vZGVfbW9kdWxlcy9zd2lwZXIvbW9kdWxlcy9hMTF5Lm1qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9ub2RlX21vZHVsZXMvc3dpcGVyL21vZHVsZXMvaGlzdG9yeS5tanMiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlLy4vbm9kZV9tb2R1bGVzL3N3aXBlci9tb2R1bGVzL2hhc2gtbmF2aWdhdGlvbi5tanMiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlLy4vbm9kZV9tb2R1bGVzL3N3aXBlci9tb2R1bGVzL2F1dG9wbGF5Lm1qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9ub2RlX21vZHVsZXMvc3dpcGVyL21vZHVsZXMvdGh1bWJzLm1qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9ub2RlX21vZHVsZXMvc3dpcGVyL21vZHVsZXMvZnJlZS1tb2RlLm1qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9ub2RlX21vZHVsZXMvc3dpcGVyL21vZHVsZXMvZ3JpZC5tanMiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlLy4vbm9kZV9tb2R1bGVzL3N3aXBlci9tb2R1bGVzL21hbmlwdWxhdGlvbi5tanMiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlLy4vbm9kZV9tb2R1bGVzL3N3aXBlci9zaGFyZWQvZWZmZWN0LWluaXQubWpzIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL25vZGVfbW9kdWxlcy9zd2lwZXIvc2hhcmVkL2VmZmVjdC10YXJnZXQubWpzIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL25vZGVfbW9kdWxlcy9zd2lwZXIvc2hhcmVkL2VmZmVjdC12aXJ0dWFsLXRyYW5zaXRpb24tZW5kLm1qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9ub2RlX21vZHVsZXMvc3dpcGVyL21vZHVsZXMvZWZmZWN0LWZhZGUubWpzIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL25vZGVfbW9kdWxlcy9zd2lwZXIvbW9kdWxlcy9lZmZlY3QtY3ViZS5tanMiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlLy4vbm9kZV9tb2R1bGVzL3N3aXBlci9zaGFyZWQvY3JlYXRlLXNoYWRvdy5tanMiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlLy4vbm9kZV9tb2R1bGVzL3N3aXBlci9tb2R1bGVzL2VmZmVjdC1mbGlwLm1qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9ub2RlX21vZHVsZXMvc3dpcGVyL21vZHVsZXMvZWZmZWN0LWNvdmVyZmxvdy5tanMiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlLy4vbm9kZV9tb2R1bGVzL3N3aXBlci9tb2R1bGVzL2VmZmVjdC1jcmVhdGl2ZS5tanMiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlLy4vbm9kZV9tb2R1bGVzL3N3aXBlci9tb2R1bGVzL2VmZmVjdC1jYXJkcy5tanMiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlLy4vbm9kZV9tb2R1bGVzL3N3aXBlci9zd2lwZXItYnVuZGxlLm1qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9zcmMvanMvY29tcG9uZW50cy9hYm91dFN3aXBlci5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9zcmMvanMvY29tcG9uZW50cy9hcnRpc3RzU3dpcGVyLmpzIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL3NyYy9qcy9jb21wb25lbnRzL3JlbGVhc2VTd2lwZXIuanMiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlLy4vc3JjL2pzL2NvbXBvbmVudHMvYnVyZ2VyLmpzIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL3NyYy9qcy9jb21wb25lbnRzL3Njcm9sbC5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9zcmMvanMvY29tcG9uZW50cy9mYXEuanMiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlLy4vc3JjL2pzL2NvbXBvbmVudHMvaGVhZGVyLmpzIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFNTUiBXaW5kb3cgNC4wLjJcbiAqIEJldHRlciBoYW5kbGluZyBmb3Igd2luZG93IG9iamVjdCBpbiBTU1IgZW52aXJvbm1lbnRcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9ub2xpbWl0czR3ZWIvc3NyLXdpbmRvd1xuICpcbiAqIENvcHlyaWdodCAyMDIxLCBWbGFkaW1pciBLaGFybGFtcGlkaVxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIE1JVFxuICpcbiAqIFJlbGVhc2VkIG9uOiBEZWNlbWJlciAxMywgMjAyMVxuICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1wYXJhbS1yZWFzc2lnbiAqL1xuZnVuY3Rpb24gaXNPYmplY3Qob2JqKSB7XG4gIHJldHVybiBvYmogIT09IG51bGwgJiYgdHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgJiYgJ2NvbnN0cnVjdG9yJyBpbiBvYmogJiYgb2JqLmNvbnN0cnVjdG9yID09PSBPYmplY3Q7XG59XG5mdW5jdGlvbiBleHRlbmQodGFyZ2V0LCBzcmMpIHtcbiAgaWYgKHRhcmdldCA9PT0gdm9pZCAwKSB7XG4gICAgdGFyZ2V0ID0ge307XG4gIH1cbiAgaWYgKHNyYyA9PT0gdm9pZCAwKSB7XG4gICAgc3JjID0ge307XG4gIH1cbiAgT2JqZWN0LmtleXMoc3JjKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgaWYgKHR5cGVvZiB0YXJnZXRba2V5XSA9PT0gJ3VuZGVmaW5lZCcpIHRhcmdldFtrZXldID0gc3JjW2tleV07ZWxzZSBpZiAoaXNPYmplY3Qoc3JjW2tleV0pICYmIGlzT2JqZWN0KHRhcmdldFtrZXldKSAmJiBPYmplY3Qua2V5cyhzcmNba2V5XSkubGVuZ3RoID4gMCkge1xuICAgICAgZXh0ZW5kKHRhcmdldFtrZXldLCBzcmNba2V5XSk7XG4gICAgfVxuICB9KTtcbn1cbmNvbnN0IHNzckRvY3VtZW50ID0ge1xuICBib2R5OiB7fSxcbiAgYWRkRXZlbnRMaXN0ZW5lcigpIHt9LFxuICByZW1vdmVFdmVudExpc3RlbmVyKCkge30sXG4gIGFjdGl2ZUVsZW1lbnQ6IHtcbiAgICBibHVyKCkge30sXG4gICAgbm9kZU5hbWU6ICcnXG4gIH0sXG4gIHF1ZXJ5U2VsZWN0b3IoKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH0sXG4gIHF1ZXJ5U2VsZWN0b3JBbGwoKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9LFxuICBnZXRFbGVtZW50QnlJZCgpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcbiAgY3JlYXRlRXZlbnQoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGluaXRFdmVudCgpIHt9XG4gICAgfTtcbiAgfSxcbiAgY3JlYXRlRWxlbWVudCgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY2hpbGRyZW46IFtdLFxuICAgICAgY2hpbGROb2RlczogW10sXG4gICAgICBzdHlsZToge30sXG4gICAgICBzZXRBdHRyaWJ1dGUoKSB7fSxcbiAgICAgIGdldEVsZW1lbnRzQnlUYWdOYW1lKCkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9XG4gICAgfTtcbiAgfSxcbiAgY3JlYXRlRWxlbWVudE5TKCkge1xuICAgIHJldHVybiB7fTtcbiAgfSxcbiAgaW1wb3J0Tm9kZSgpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcbiAgbG9jYXRpb246IHtcbiAgICBoYXNoOiAnJyxcbiAgICBob3N0OiAnJyxcbiAgICBob3N0bmFtZTogJycsXG4gICAgaHJlZjogJycsXG4gICAgb3JpZ2luOiAnJyxcbiAgICBwYXRobmFtZTogJycsXG4gICAgcHJvdG9jb2w6ICcnLFxuICAgIHNlYXJjaDogJydcbiAgfVxufTtcbmZ1bmN0aW9uIGdldERvY3VtZW50KCkge1xuICBjb25zdCBkb2MgPSB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnID8gZG9jdW1lbnQgOiB7fTtcbiAgZXh0ZW5kKGRvYywgc3NyRG9jdW1lbnQpO1xuICByZXR1cm4gZG9jO1xufVxuY29uc3Qgc3NyV2luZG93ID0ge1xuICBkb2N1bWVudDogc3NyRG9jdW1lbnQsXG4gIG5hdmlnYXRvcjoge1xuICAgIHVzZXJBZ2VudDogJydcbiAgfSxcbiAgbG9jYXRpb246IHtcbiAgICBoYXNoOiAnJyxcbiAgICBob3N0OiAnJyxcbiAgICBob3N0bmFtZTogJycsXG4gICAgaHJlZjogJycsXG4gICAgb3JpZ2luOiAnJyxcbiAgICBwYXRobmFtZTogJycsXG4gICAgcHJvdG9jb2w6ICcnLFxuICAgIHNlYXJjaDogJydcbiAgfSxcbiAgaGlzdG9yeToge1xuICAgIHJlcGxhY2VTdGF0ZSgpIHt9LFxuICAgIHB1c2hTdGF0ZSgpIHt9LFxuICAgIGdvKCkge30sXG4gICAgYmFjaygpIHt9XG4gIH0sXG4gIEN1c3RvbUV2ZW50OiBmdW5jdGlvbiBDdXN0b21FdmVudCgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgYWRkRXZlbnRMaXN0ZW5lcigpIHt9LFxuICByZW1vdmVFdmVudExpc3RlbmVyKCkge30sXG4gIGdldENvbXB1dGVkU3R5bGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGdldFByb3BlcnR5VmFsdWUoKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuICBJbWFnZSgpIHt9LFxuICBEYXRlKCkge30sXG4gIHNjcmVlbjoge30sXG4gIHNldFRpbWVvdXQoKSB7fSxcbiAgY2xlYXJUaW1lb3V0KCkge30sXG4gIG1hdGNoTWVkaWEoKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9LFxuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoY2FsbGJhY2spIHtcbiAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjYWxsYmFjaygpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBzZXRUaW1lb3V0KGNhbGxiYWNrLCAwKTtcbiAgfSxcbiAgY2FuY2VsQW5pbWF0aW9uRnJhbWUoaWQpIHtcbiAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNsZWFyVGltZW91dChpZCk7XG4gIH1cbn07XG5mdW5jdGlvbiBnZXRXaW5kb3coKSB7XG4gIGNvbnN0IHdpbiA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gd2luZG93IDoge307XG4gIGV4dGVuZCh3aW4sIHNzcldpbmRvdyk7XG4gIHJldHVybiB3aW47XG59XG5cbmV4cG9ydCB7IGdldFdpbmRvdyBhcyBhLCBnZXREb2N1bWVudCBhcyBnIH07XG4iLCJpbXBvcnQgeyBhIGFzIGdldFdpbmRvdywgZyBhcyBnZXREb2N1bWVudCB9IGZyb20gJy4vc3NyLXdpbmRvdy5lc20ubWpzJztcblxuZnVuY3Rpb24gY2xhc3Nlc1RvVG9rZW5zKGNsYXNzZXMpIHtcbiAgaWYgKGNsYXNzZXMgPT09IHZvaWQgMCkge1xuICAgIGNsYXNzZXMgPSAnJztcbiAgfVxuICByZXR1cm4gY2xhc3Nlcy50cmltKCkuc3BsaXQoJyAnKS5maWx0ZXIoYyA9PiAhIWMudHJpbSgpKTtcbn1cblxuZnVuY3Rpb24gZGVsZXRlUHJvcHMob2JqKSB7XG4gIGNvbnN0IG9iamVjdCA9IG9iajtcbiAgT2JqZWN0LmtleXMob2JqZWN0KS5mb3JFYWNoKGtleSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIG9iamVjdFtrZXldID0gbnVsbDtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyBubyBnZXR0ZXIgZm9yIG9iamVjdFxuICAgIH1cbiAgICB0cnkge1xuICAgICAgZGVsZXRlIG9iamVjdFtrZXldO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vIHNvbWV0aGluZyBnb3Qgd3JvbmdcbiAgICB9XG4gIH0pO1xufVxuZnVuY3Rpb24gbmV4dFRpY2soY2FsbGJhY2ssIGRlbGF5KSB7XG4gIGlmIChkZWxheSA9PT0gdm9pZCAwKSB7XG4gICAgZGVsYXkgPSAwO1xuICB9XG4gIHJldHVybiBzZXRUaW1lb3V0KGNhbGxiYWNrLCBkZWxheSk7XG59XG5mdW5jdGlvbiBub3coKSB7XG4gIHJldHVybiBEYXRlLm5vdygpO1xufVxuZnVuY3Rpb24gZ2V0Q29tcHV0ZWRTdHlsZShlbCkge1xuICBjb25zdCB3aW5kb3cgPSBnZXRXaW5kb3coKTtcbiAgbGV0IHN0eWxlO1xuICBpZiAod2luZG93LmdldENvbXB1dGVkU3R5bGUpIHtcbiAgICBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsLCBudWxsKTtcbiAgfVxuICBpZiAoIXN0eWxlICYmIGVsLmN1cnJlbnRTdHlsZSkge1xuICAgIHN0eWxlID0gZWwuY3VycmVudFN0eWxlO1xuICB9XG4gIGlmICghc3R5bGUpIHtcbiAgICBzdHlsZSA9IGVsLnN0eWxlO1xuICB9XG4gIHJldHVybiBzdHlsZTtcbn1cbmZ1bmN0aW9uIGdldFRyYW5zbGF0ZShlbCwgYXhpcykge1xuICBpZiAoYXhpcyA9PT0gdm9pZCAwKSB7XG4gICAgYXhpcyA9ICd4JztcbiAgfVxuICBjb25zdCB3aW5kb3cgPSBnZXRXaW5kb3coKTtcbiAgbGV0IG1hdHJpeDtcbiAgbGV0IGN1clRyYW5zZm9ybTtcbiAgbGV0IHRyYW5zZm9ybU1hdHJpeDtcbiAgY29uc3QgY3VyU3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKGVsKTtcbiAgaWYgKHdpbmRvdy5XZWJLaXRDU1NNYXRyaXgpIHtcbiAgICBjdXJUcmFuc2Zvcm0gPSBjdXJTdHlsZS50cmFuc2Zvcm0gfHwgY3VyU3R5bGUud2Via2l0VHJhbnNmb3JtO1xuICAgIGlmIChjdXJUcmFuc2Zvcm0uc3BsaXQoJywnKS5sZW5ndGggPiA2KSB7XG4gICAgICBjdXJUcmFuc2Zvcm0gPSBjdXJUcmFuc2Zvcm0uc3BsaXQoJywgJykubWFwKGEgPT4gYS5yZXBsYWNlKCcsJywgJy4nKSkuam9pbignLCAnKTtcbiAgICB9XG4gICAgLy8gU29tZSBvbGQgdmVyc2lvbnMgb2YgV2Via2l0IGNob2tlIHdoZW4gJ25vbmUnIGlzIHBhc3NlZDsgcGFzc1xuICAgIC8vIGVtcHR5IHN0cmluZyBpbnN0ZWFkIGluIHRoaXMgY2FzZVxuICAgIHRyYW5zZm9ybU1hdHJpeCA9IG5ldyB3aW5kb3cuV2ViS2l0Q1NTTWF0cml4KGN1clRyYW5zZm9ybSA9PT0gJ25vbmUnID8gJycgOiBjdXJUcmFuc2Zvcm0pO1xuICB9IGVsc2Uge1xuICAgIHRyYW5zZm9ybU1hdHJpeCA9IGN1clN0eWxlLk1velRyYW5zZm9ybSB8fCBjdXJTdHlsZS5PVHJhbnNmb3JtIHx8IGN1clN0eWxlLk1zVHJhbnNmb3JtIHx8IGN1clN0eWxlLm1zVHJhbnNmb3JtIHx8IGN1clN0eWxlLnRyYW5zZm9ybSB8fCBjdXJTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCd0cmFuc2Zvcm0nKS5yZXBsYWNlKCd0cmFuc2xhdGUoJywgJ21hdHJpeCgxLCAwLCAwLCAxLCcpO1xuICAgIG1hdHJpeCA9IHRyYW5zZm9ybU1hdHJpeC50b1N0cmluZygpLnNwbGl0KCcsJyk7XG4gIH1cbiAgaWYgKGF4aXMgPT09ICd4Jykge1xuICAgIC8vIExhdGVzdCBDaHJvbWUgYW5kIHdlYmtpdHMgRml4XG4gICAgaWYgKHdpbmRvdy5XZWJLaXRDU1NNYXRyaXgpIGN1clRyYW5zZm9ybSA9IHRyYW5zZm9ybU1hdHJpeC5tNDE7XG4gICAgLy8gQ3JhenkgSUUxMCBNYXRyaXhcbiAgICBlbHNlIGlmIChtYXRyaXgubGVuZ3RoID09PSAxNikgY3VyVHJhbnNmb3JtID0gcGFyc2VGbG9hdChtYXRyaXhbMTJdKTtcbiAgICAvLyBOb3JtYWwgQnJvd3NlcnNcbiAgICBlbHNlIGN1clRyYW5zZm9ybSA9IHBhcnNlRmxvYXQobWF0cml4WzRdKTtcbiAgfVxuICBpZiAoYXhpcyA9PT0gJ3knKSB7XG4gICAgLy8gTGF0ZXN0IENocm9tZSBhbmQgd2Via2l0cyBGaXhcbiAgICBpZiAod2luZG93LldlYktpdENTU01hdHJpeCkgY3VyVHJhbnNmb3JtID0gdHJhbnNmb3JtTWF0cml4Lm00MjtcbiAgICAvLyBDcmF6eSBJRTEwIE1hdHJpeFxuICAgIGVsc2UgaWYgKG1hdHJpeC5sZW5ndGggPT09IDE2KSBjdXJUcmFuc2Zvcm0gPSBwYXJzZUZsb2F0KG1hdHJpeFsxM10pO1xuICAgIC8vIE5vcm1hbCBCcm93c2Vyc1xuICAgIGVsc2UgY3VyVHJhbnNmb3JtID0gcGFyc2VGbG9hdChtYXRyaXhbNV0pO1xuICB9XG4gIHJldHVybiBjdXJUcmFuc2Zvcm0gfHwgMDtcbn1cbmZ1bmN0aW9uIGlzT2JqZWN0KG8pIHtcbiAgcmV0dXJuIHR5cGVvZiBvID09PSAnb2JqZWN0JyAmJiBvICE9PSBudWxsICYmIG8uY29uc3RydWN0b3IgJiYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pLnNsaWNlKDgsIC0xKSA9PT0gJ09iamVjdCc7XG59XG5mdW5jdGlvbiBpc05vZGUobm9kZSkge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiB3aW5kb3cuSFRNTEVsZW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIG5vZGUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudDtcbiAgfVxuICByZXR1cm4gbm9kZSAmJiAobm9kZS5ub2RlVHlwZSA9PT0gMSB8fCBub2RlLm5vZGVUeXBlID09PSAxMSk7XG59XG5mdW5jdGlvbiBleHRlbmQoKSB7XG4gIGNvbnN0IHRvID0gT2JqZWN0KGFyZ3VtZW50cy5sZW5ndGggPD0gMCA/IHVuZGVmaW5lZCA6IGFyZ3VtZW50c1swXSk7XG4gIGNvbnN0IG5vRXh0ZW5kID0gWydfX3Byb3RvX18nLCAnY29uc3RydWN0b3InLCAncHJvdG90eXBlJ107XG4gIGZvciAobGV0IGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgY29uc3QgbmV4dFNvdXJjZSA9IGkgPCAwIHx8IGFyZ3VtZW50cy5sZW5ndGggPD0gaSA/IHVuZGVmaW5lZCA6IGFyZ3VtZW50c1tpXTtcbiAgICBpZiAobmV4dFNvdXJjZSAhPT0gdW5kZWZpbmVkICYmIG5leHRTb3VyY2UgIT09IG51bGwgJiYgIWlzTm9kZShuZXh0U291cmNlKSkge1xuICAgICAgY29uc3Qga2V5c0FycmF5ID0gT2JqZWN0LmtleXMoT2JqZWN0KG5leHRTb3VyY2UpKS5maWx0ZXIoa2V5ID0+IG5vRXh0ZW5kLmluZGV4T2Yoa2V5KSA8IDApO1xuICAgICAgZm9yIChsZXQgbmV4dEluZGV4ID0gMCwgbGVuID0ga2V5c0FycmF5Lmxlbmd0aDsgbmV4dEluZGV4IDwgbGVuOyBuZXh0SW5kZXggKz0gMSkge1xuICAgICAgICBjb25zdCBuZXh0S2V5ID0ga2V5c0FycmF5W25leHRJbmRleF07XG4gICAgICAgIGNvbnN0IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG5leHRTb3VyY2UsIG5leHRLZXkpO1xuICAgICAgICBpZiAoZGVzYyAhPT0gdW5kZWZpbmVkICYmIGRlc2MuZW51bWVyYWJsZSkge1xuICAgICAgICAgIGlmIChpc09iamVjdCh0b1tuZXh0S2V5XSkgJiYgaXNPYmplY3QobmV4dFNvdXJjZVtuZXh0S2V5XSkpIHtcbiAgICAgICAgICAgIGlmIChuZXh0U291cmNlW25leHRLZXldLl9fc3dpcGVyX18pIHtcbiAgICAgICAgICAgICAgdG9bbmV4dEtleV0gPSBuZXh0U291cmNlW25leHRLZXldO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZXh0ZW5kKHRvW25leHRLZXldLCBuZXh0U291cmNlW25leHRLZXldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKCFpc09iamVjdCh0b1tuZXh0S2V5XSkgJiYgaXNPYmplY3QobmV4dFNvdXJjZVtuZXh0S2V5XSkpIHtcbiAgICAgICAgICAgIHRvW25leHRLZXldID0ge307XG4gICAgICAgICAgICBpZiAobmV4dFNvdXJjZVtuZXh0S2V5XS5fX3N3aXBlcl9fKSB7XG4gICAgICAgICAgICAgIHRvW25leHRLZXldID0gbmV4dFNvdXJjZVtuZXh0S2V5XTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGV4dGVuZCh0b1tuZXh0S2V5XSwgbmV4dFNvdXJjZVtuZXh0S2V5XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRvW25leHRLZXldID0gbmV4dFNvdXJjZVtuZXh0S2V5XTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRvO1xufVxuZnVuY3Rpb24gc2V0Q1NTUHJvcGVydHkoZWwsIHZhck5hbWUsIHZhclZhbHVlKSB7XG4gIGVsLnN0eWxlLnNldFByb3BlcnR5KHZhck5hbWUsIHZhclZhbHVlKTtcbn1cbmZ1bmN0aW9uIGFuaW1hdGVDU1NNb2RlU2Nyb2xsKF9yZWYpIHtcbiAgbGV0IHtcbiAgICBzd2lwZXIsXG4gICAgdGFyZ2V0UG9zaXRpb24sXG4gICAgc2lkZVxuICB9ID0gX3JlZjtcbiAgY29uc3Qgd2luZG93ID0gZ2V0V2luZG93KCk7XG4gIGNvbnN0IHN0YXJ0UG9zaXRpb24gPSAtc3dpcGVyLnRyYW5zbGF0ZTtcbiAgbGV0IHN0YXJ0VGltZSA9IG51bGw7XG4gIGxldCB0aW1lO1xuICBjb25zdCBkdXJhdGlvbiA9IHN3aXBlci5wYXJhbXMuc3BlZWQ7XG4gIHN3aXBlci53cmFwcGVyRWwuc3R5bGUuc2Nyb2xsU25hcFR5cGUgPSAnbm9uZSc7XG4gIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZShzd2lwZXIuY3NzTW9kZUZyYW1lSUQpO1xuICBjb25zdCBkaXIgPSB0YXJnZXRQb3NpdGlvbiA+IHN0YXJ0UG9zaXRpb24gPyAnbmV4dCcgOiAncHJldic7XG4gIGNvbnN0IGlzT3V0T2ZCb3VuZCA9IChjdXJyZW50LCB0YXJnZXQpID0+IHtcbiAgICByZXR1cm4gZGlyID09PSAnbmV4dCcgJiYgY3VycmVudCA+PSB0YXJnZXQgfHwgZGlyID09PSAncHJldicgJiYgY3VycmVudCA8PSB0YXJnZXQ7XG4gIH07XG4gIGNvbnN0IGFuaW1hdGUgPSAoKSA9PiB7XG4gICAgdGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIGlmIChzdGFydFRpbWUgPT09IG51bGwpIHtcbiAgICAgIHN0YXJ0VGltZSA9IHRpbWU7XG4gICAgfVxuICAgIGNvbnN0IHByb2dyZXNzID0gTWF0aC5tYXgoTWF0aC5taW4oKHRpbWUgLSBzdGFydFRpbWUpIC8gZHVyYXRpb24sIDEpLCAwKTtcbiAgICBjb25zdCBlYXNlUHJvZ3Jlc3MgPSAwLjUgLSBNYXRoLmNvcyhwcm9ncmVzcyAqIE1hdGguUEkpIC8gMjtcbiAgICBsZXQgY3VycmVudFBvc2l0aW9uID0gc3RhcnRQb3NpdGlvbiArIGVhc2VQcm9ncmVzcyAqICh0YXJnZXRQb3NpdGlvbiAtIHN0YXJ0UG9zaXRpb24pO1xuICAgIGlmIChpc091dE9mQm91bmQoY3VycmVudFBvc2l0aW9uLCB0YXJnZXRQb3NpdGlvbikpIHtcbiAgICAgIGN1cnJlbnRQb3NpdGlvbiA9IHRhcmdldFBvc2l0aW9uO1xuICAgIH1cbiAgICBzd2lwZXIud3JhcHBlckVsLnNjcm9sbFRvKHtcbiAgICAgIFtzaWRlXTogY3VycmVudFBvc2l0aW9uXG4gICAgfSk7XG4gICAgaWYgKGlzT3V0T2ZCb3VuZChjdXJyZW50UG9zaXRpb24sIHRhcmdldFBvc2l0aW9uKSkge1xuICAgICAgc3dpcGVyLndyYXBwZXJFbC5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xuICAgICAgc3dpcGVyLndyYXBwZXJFbC5zdHlsZS5zY3JvbGxTbmFwVHlwZSA9ICcnO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHN3aXBlci53cmFwcGVyRWwuc3R5bGUub3ZlcmZsb3cgPSAnJztcbiAgICAgICAgc3dpcGVyLndyYXBwZXJFbC5zY3JvbGxUbyh7XG4gICAgICAgICAgW3NpZGVdOiBjdXJyZW50UG9zaXRpb25cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZShzd2lwZXIuY3NzTW9kZUZyYW1lSUQpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzd2lwZXIuY3NzTW9kZUZyYW1lSUQgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xuICB9O1xuICBhbmltYXRlKCk7XG59XG5mdW5jdGlvbiBnZXRTbGlkZVRyYW5zZm9ybUVsKHNsaWRlRWwpIHtcbiAgcmV0dXJuIHNsaWRlRWwucXVlcnlTZWxlY3RvcignLnN3aXBlci1zbGlkZS10cmFuc2Zvcm0nKSB8fCBzbGlkZUVsLnNoYWRvd1Jvb3QgJiYgc2xpZGVFbC5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3IoJy5zd2lwZXItc2xpZGUtdHJhbnNmb3JtJykgfHwgc2xpZGVFbDtcbn1cbmZ1bmN0aW9uIGVsZW1lbnRDaGlsZHJlbihlbGVtZW50LCBzZWxlY3Rvcikge1xuICBpZiAoc2VsZWN0b3IgPT09IHZvaWQgMCkge1xuICAgIHNlbGVjdG9yID0gJyc7XG4gIH1cbiAgcmV0dXJuIFsuLi5lbGVtZW50LmNoaWxkcmVuXS5maWx0ZXIoZWwgPT4gZWwubWF0Y2hlcyhzZWxlY3RvcikpO1xufVxuZnVuY3Rpb24gc2hvd1dhcm5pbmcodGV4dCkge1xuICB0cnkge1xuICAgIGNvbnNvbGUud2Fybih0ZXh0KTtcbiAgICByZXR1cm47XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIC8vIGVyclxuICB9XG59XG5mdW5jdGlvbiBjcmVhdGVFbGVtZW50KHRhZywgY2xhc3Nlcykge1xuICBpZiAoY2xhc3NlcyA9PT0gdm9pZCAwKSB7XG4gICAgY2xhc3NlcyA9IFtdO1xuICB9XG4gIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpO1xuICBlbC5jbGFzc0xpc3QuYWRkKC4uLihBcnJheS5pc0FycmF5KGNsYXNzZXMpID8gY2xhc3NlcyA6IGNsYXNzZXNUb1Rva2VucyhjbGFzc2VzKSkpO1xuICByZXR1cm4gZWw7XG59XG5mdW5jdGlvbiBlbGVtZW50T2Zmc2V0KGVsKSB7XG4gIGNvbnN0IHdpbmRvdyA9IGdldFdpbmRvdygpO1xuICBjb25zdCBkb2N1bWVudCA9IGdldERvY3VtZW50KCk7XG4gIGNvbnN0IGJveCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICBjb25zdCBib2R5ID0gZG9jdW1lbnQuYm9keTtcbiAgY29uc3QgY2xpZW50VG9wID0gZWwuY2xpZW50VG9wIHx8IGJvZHkuY2xpZW50VG9wIHx8IDA7XG4gIGNvbnN0IGNsaWVudExlZnQgPSBlbC5jbGllbnRMZWZ0IHx8IGJvZHkuY2xpZW50TGVmdCB8fCAwO1xuICBjb25zdCBzY3JvbGxUb3AgPSBlbCA9PT0gd2luZG93ID8gd2luZG93LnNjcm9sbFkgOiBlbC5zY3JvbGxUb3A7XG4gIGNvbnN0IHNjcm9sbExlZnQgPSBlbCA9PT0gd2luZG93ID8gd2luZG93LnNjcm9sbFggOiBlbC5zY3JvbGxMZWZ0O1xuICByZXR1cm4ge1xuICAgIHRvcDogYm94LnRvcCArIHNjcm9sbFRvcCAtIGNsaWVudFRvcCxcbiAgICBsZWZ0OiBib3gubGVmdCArIHNjcm9sbExlZnQgLSBjbGllbnRMZWZ0XG4gIH07XG59XG5mdW5jdGlvbiBlbGVtZW50UHJldkFsbChlbCwgc2VsZWN0b3IpIHtcbiAgY29uc3QgcHJldkVscyA9IFtdO1xuICB3aGlsZSAoZWwucHJldmlvdXNFbGVtZW50U2libGluZykge1xuICAgIGNvbnN0IHByZXYgPSBlbC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgaWYgKHNlbGVjdG9yKSB7XG4gICAgICBpZiAocHJldi5tYXRjaGVzKHNlbGVjdG9yKSkgcHJldkVscy5wdXNoKHByZXYpO1xuICAgIH0gZWxzZSBwcmV2RWxzLnB1c2gocHJldik7XG4gICAgZWwgPSBwcmV2O1xuICB9XG4gIHJldHVybiBwcmV2RWxzO1xufVxuZnVuY3Rpb24gZWxlbWVudE5leHRBbGwoZWwsIHNlbGVjdG9yKSB7XG4gIGNvbnN0IG5leHRFbHMgPSBbXTtcbiAgd2hpbGUgKGVsLm5leHRFbGVtZW50U2libGluZykge1xuICAgIGNvbnN0IG5leHQgPSBlbC5uZXh0RWxlbWVudFNpYmxpbmc7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICBpZiAoc2VsZWN0b3IpIHtcbiAgICAgIGlmIChuZXh0Lm1hdGNoZXMoc2VsZWN0b3IpKSBuZXh0RWxzLnB1c2gobmV4dCk7XG4gICAgfSBlbHNlIG5leHRFbHMucHVzaChuZXh0KTtcbiAgICBlbCA9IG5leHQ7XG4gIH1cbiAgcmV0dXJuIG5leHRFbHM7XG59XG5mdW5jdGlvbiBlbGVtZW50U3R5bGUoZWwsIHByb3ApIHtcbiAgY29uc3Qgd2luZG93ID0gZ2V0V2luZG93KCk7XG4gIHJldHVybiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZShwcm9wKTtcbn1cbmZ1bmN0aW9uIGVsZW1lbnRJbmRleChlbCkge1xuICBsZXQgY2hpbGQgPSBlbDtcbiAgbGV0IGk7XG4gIGlmIChjaGlsZCkge1xuICAgIGkgPSAwO1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgIHdoaWxlICgoY2hpbGQgPSBjaGlsZC5wcmV2aW91c1NpYmxpbmcpICE9PSBudWxsKSB7XG4gICAgICBpZiAoY2hpbGQubm9kZVR5cGUgPT09IDEpIGkgKz0gMTtcbiAgICB9XG4gICAgcmV0dXJuIGk7XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cbmZ1bmN0aW9uIGVsZW1lbnRQYXJlbnRzKGVsLCBzZWxlY3Rvcikge1xuICBjb25zdCBwYXJlbnRzID0gW107IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgbGV0IHBhcmVudCA9IGVsLnBhcmVudEVsZW1lbnQ7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgd2hpbGUgKHBhcmVudCkge1xuICAgIGlmIChzZWxlY3Rvcikge1xuICAgICAgaWYgKHBhcmVudC5tYXRjaGVzKHNlbGVjdG9yKSkgcGFyZW50cy5wdXNoKHBhcmVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcmVudHMucHVzaChwYXJlbnQpO1xuICAgIH1cbiAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50RWxlbWVudDtcbiAgfVxuICByZXR1cm4gcGFyZW50cztcbn1cbmZ1bmN0aW9uIGVsZW1lbnRUcmFuc2l0aW9uRW5kKGVsLCBjYWxsYmFjaykge1xuICBmdW5jdGlvbiBmaXJlQ2FsbEJhY2soZSkge1xuICAgIGlmIChlLnRhcmdldCAhPT0gZWwpIHJldHVybjtcbiAgICBjYWxsYmFjay5jYWxsKGVsLCBlKTtcbiAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgZmlyZUNhbGxCYWNrKTtcbiAgfVxuICBpZiAoY2FsbGJhY2spIHtcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgZmlyZUNhbGxCYWNrKTtcbiAgfVxufVxuZnVuY3Rpb24gZWxlbWVudE91dGVyU2l6ZShlbCwgc2l6ZSwgaW5jbHVkZU1hcmdpbnMpIHtcbiAgY29uc3Qgd2luZG93ID0gZ2V0V2luZG93KCk7XG4gIGlmIChpbmNsdWRlTWFyZ2lucykge1xuICAgIHJldHVybiBlbFtzaXplID09PSAnd2lkdGgnID8gJ29mZnNldFdpZHRoJyA6ICdvZmZzZXRIZWlnaHQnXSArIHBhcnNlRmxvYXQod2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwsIG51bGwpLmdldFByb3BlcnR5VmFsdWUoc2l6ZSA9PT0gJ3dpZHRoJyA/ICdtYXJnaW4tcmlnaHQnIDogJ21hcmdpbi10b3AnKSkgKyBwYXJzZUZsb2F0KHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsLCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKHNpemUgPT09ICd3aWR0aCcgPyAnbWFyZ2luLWxlZnQnIDogJ21hcmdpbi1ib3R0b20nKSk7XG4gIH1cbiAgcmV0dXJuIGVsLm9mZnNldFdpZHRoO1xufVxuXG5leHBvcnQgeyBlbGVtZW50UGFyZW50cyBhcyBhLCBlbGVtZW50T2Zmc2V0IGFzIGIsIGNyZWF0ZUVsZW1lbnQgYXMgYywgbm93IGFzIGQsIGVsZW1lbnRDaGlsZHJlbiBhcyBlLCBlbGVtZW50T3V0ZXJTaXplIGFzIGYsIGVsZW1lbnRJbmRleCBhcyBnLCBjbGFzc2VzVG9Ub2tlbnMgYXMgaCwgZ2V0VHJhbnNsYXRlIGFzIGksIGVsZW1lbnRUcmFuc2l0aW9uRW5kIGFzIGosIGlzT2JqZWN0IGFzIGssIGdldFNsaWRlVHJhbnNmb3JtRWwgYXMgbCwgZWxlbWVudFN0eWxlIGFzIG0sIG5leHRUaWNrIGFzIG4sIGVsZW1lbnROZXh0QWxsIGFzIG8sIGVsZW1lbnRQcmV2QWxsIGFzIHAsIGFuaW1hdGVDU1NNb2RlU2Nyb2xsIGFzIHEsIHNob3dXYXJuaW5nIGFzIHIsIHNldENTU1Byb3BlcnR5IGFzIHMsIGV4dGVuZCBhcyB0LCBkZWxldGVQcm9wcyBhcyB1IH07XG4iLCJpbXBvcnQgeyBhIGFzIGdldFdpbmRvdywgZyBhcyBnZXREb2N1bWVudCB9IGZyb20gJy4vc3NyLXdpbmRvdy5lc20ubWpzJztcbmltcG9ydCB7IGEgYXMgZWxlbWVudFBhcmVudHMsIG0gYXMgZWxlbWVudFN0eWxlLCBlIGFzIGVsZW1lbnRDaGlsZHJlbiwgcyBhcyBzZXRDU1NQcm9wZXJ0eSwgZiBhcyBlbGVtZW50T3V0ZXJTaXplLCBvIGFzIGVsZW1lbnROZXh0QWxsLCBwIGFzIGVsZW1lbnRQcmV2QWxsLCBpIGFzIGdldFRyYW5zbGF0ZSwgcSBhcyBhbmltYXRlQ1NTTW9kZVNjcm9sbCwgbiBhcyBuZXh0VGljaywgciBhcyBzaG93V2FybmluZywgYyBhcyBjcmVhdGVFbGVtZW50LCBkIGFzIG5vdywgdCBhcyBleHRlbmQsIGcgYXMgZWxlbWVudEluZGV4LCB1IGFzIGRlbGV0ZVByb3BzIH0gZnJvbSAnLi91dGlscy5tanMnO1xuXG5sZXQgc3VwcG9ydDtcbmZ1bmN0aW9uIGNhbGNTdXBwb3J0KCkge1xuICBjb25zdCB3aW5kb3cgPSBnZXRXaW5kb3coKTtcbiAgY29uc3QgZG9jdW1lbnQgPSBnZXREb2N1bWVudCgpO1xuICByZXR1cm4ge1xuICAgIHNtb290aFNjcm9sbDogZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZSAmJiAnc2Nyb2xsQmVoYXZpb3InIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZSxcbiAgICB0b3VjaDogISEoJ29udG91Y2hzdGFydCcgaW4gd2luZG93IHx8IHdpbmRvdy5Eb2N1bWVudFRvdWNoICYmIGRvY3VtZW50IGluc3RhbmNlb2Ygd2luZG93LkRvY3VtZW50VG91Y2gpXG4gIH07XG59XG5mdW5jdGlvbiBnZXRTdXBwb3J0KCkge1xuICBpZiAoIXN1cHBvcnQpIHtcbiAgICBzdXBwb3J0ID0gY2FsY1N1cHBvcnQoKTtcbiAgfVxuICByZXR1cm4gc3VwcG9ydDtcbn1cblxubGV0IGRldmljZUNhY2hlZDtcbmZ1bmN0aW9uIGNhbGNEZXZpY2UoX3RlbXApIHtcbiAgbGV0IHtcbiAgICB1c2VyQWdlbnRcbiAgfSA9IF90ZW1wID09PSB2b2lkIDAgPyB7fSA6IF90ZW1wO1xuICBjb25zdCBzdXBwb3J0ID0gZ2V0U3VwcG9ydCgpO1xuICBjb25zdCB3aW5kb3cgPSBnZXRXaW5kb3coKTtcbiAgY29uc3QgcGxhdGZvcm0gPSB3aW5kb3cubmF2aWdhdG9yLnBsYXRmb3JtO1xuICBjb25zdCB1YSA9IHVzZXJBZ2VudCB8fCB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudDtcbiAgY29uc3QgZGV2aWNlID0ge1xuICAgIGlvczogZmFsc2UsXG4gICAgYW5kcm9pZDogZmFsc2VcbiAgfTtcbiAgY29uc3Qgc2NyZWVuV2lkdGggPSB3aW5kb3cuc2NyZWVuLndpZHRoO1xuICBjb25zdCBzY3JlZW5IZWlnaHQgPSB3aW5kb3cuc2NyZWVuLmhlaWdodDtcbiAgY29uc3QgYW5kcm9pZCA9IHVhLm1hdGNoKC8oQW5kcm9pZCk7P1tcXHNcXC9dKyhbXFxkLl0rKT8vKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICBsZXQgaXBhZCA9IHVhLm1hdGNoKC8oaVBhZCkuKk9TXFxzKFtcXGRfXSspLyk7XG4gIGNvbnN0IGlwb2QgPSB1YS5tYXRjaCgvKGlQb2QpKC4qT1NcXHMoW1xcZF9dKykpPy8pO1xuICBjb25zdCBpcGhvbmUgPSAhaXBhZCAmJiB1YS5tYXRjaCgvKGlQaG9uZVxcc09TfGlPUylcXHMoW1xcZF9dKykvKTtcbiAgY29uc3Qgd2luZG93cyA9IHBsYXRmb3JtID09PSAnV2luMzInO1xuICBsZXQgbWFjb3MgPSBwbGF0Zm9ybSA9PT0gJ01hY0ludGVsJztcblxuICAvLyBpUGFkT3MgMTMgZml4XG4gIGNvbnN0IGlQYWRTY3JlZW5zID0gWycxMDI0eDEzNjYnLCAnMTM2NngxMDI0JywgJzgzNHgxMTk0JywgJzExOTR4ODM0JywgJzgzNHgxMTEyJywgJzExMTJ4ODM0JywgJzc2OHgxMDI0JywgJzEwMjR4NzY4JywgJzgyMHgxMTgwJywgJzExODB4ODIwJywgJzgxMHgxMDgwJywgJzEwODB4ODEwJ107XG4gIGlmICghaXBhZCAmJiBtYWNvcyAmJiBzdXBwb3J0LnRvdWNoICYmIGlQYWRTY3JlZW5zLmluZGV4T2YoYCR7c2NyZWVuV2lkdGh9eCR7c2NyZWVuSGVpZ2h0fWApID49IDApIHtcbiAgICBpcGFkID0gdWEubWF0Y2goLyhWZXJzaW9uKVxcLyhbXFxkLl0rKS8pO1xuICAgIGlmICghaXBhZCkgaXBhZCA9IFswLCAxLCAnMTNfMF8wJ107XG4gICAgbWFjb3MgPSBmYWxzZTtcbiAgfVxuXG4gIC8vIEFuZHJvaWRcbiAgaWYgKGFuZHJvaWQgJiYgIXdpbmRvd3MpIHtcbiAgICBkZXZpY2Uub3MgPSAnYW5kcm9pZCc7XG4gICAgZGV2aWNlLmFuZHJvaWQgPSB0cnVlO1xuICB9XG4gIGlmIChpcGFkIHx8IGlwaG9uZSB8fCBpcG9kKSB7XG4gICAgZGV2aWNlLm9zID0gJ2lvcyc7XG4gICAgZGV2aWNlLmlvcyA9IHRydWU7XG4gIH1cblxuICAvLyBFeHBvcnQgb2JqZWN0XG4gIHJldHVybiBkZXZpY2U7XG59XG5mdW5jdGlvbiBnZXREZXZpY2Uob3ZlcnJpZGVzKSB7XG4gIGlmIChvdmVycmlkZXMgPT09IHZvaWQgMCkge1xuICAgIG92ZXJyaWRlcyA9IHt9O1xuICB9XG4gIGlmICghZGV2aWNlQ2FjaGVkKSB7XG4gICAgZGV2aWNlQ2FjaGVkID0gY2FsY0RldmljZShvdmVycmlkZXMpO1xuICB9XG4gIHJldHVybiBkZXZpY2VDYWNoZWQ7XG59XG5cbmxldCBicm93c2VyO1xuZnVuY3Rpb24gY2FsY0Jyb3dzZXIoKSB7XG4gIGNvbnN0IHdpbmRvdyA9IGdldFdpbmRvdygpO1xuICBsZXQgbmVlZFBlcnNwZWN0aXZlRml4ID0gZmFsc2U7XG4gIGZ1bmN0aW9uIGlzU2FmYXJpKCkge1xuICAgIGNvbnN0IHVhID0gd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKTtcbiAgICByZXR1cm4gdWEuaW5kZXhPZignc2FmYXJpJykgPj0gMCAmJiB1YS5pbmRleE9mKCdjaHJvbWUnKSA8IDAgJiYgdWEuaW5kZXhPZignYW5kcm9pZCcpIDwgMDtcbiAgfVxuICBpZiAoaXNTYWZhcmkoKSkge1xuICAgIGNvbnN0IHVhID0gU3RyaW5nKHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KTtcbiAgICBpZiAodWEuaW5jbHVkZXMoJ1ZlcnNpb24vJykpIHtcbiAgICAgIGNvbnN0IFttYWpvciwgbWlub3JdID0gdWEuc3BsaXQoJ1ZlcnNpb24vJylbMV0uc3BsaXQoJyAnKVswXS5zcGxpdCgnLicpLm1hcChudW0gPT4gTnVtYmVyKG51bSkpO1xuICAgICAgbmVlZFBlcnNwZWN0aXZlRml4ID0gbWFqb3IgPCAxNiB8fCBtYWpvciA9PT0gMTYgJiYgbWlub3IgPCAyO1xuICAgIH1cbiAgfVxuICByZXR1cm4ge1xuICAgIGlzU2FmYXJpOiBuZWVkUGVyc3BlY3RpdmVGaXggfHwgaXNTYWZhcmkoKSxcbiAgICBuZWVkUGVyc3BlY3RpdmVGaXgsXG4gICAgaXNXZWJWaWV3OiAvKGlQaG9uZXxpUG9kfGlQYWQpLipBcHBsZVdlYktpdCg/IS4qU2FmYXJpKS9pLnRlc3Qod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpXG4gIH07XG59XG5mdW5jdGlvbiBnZXRCcm93c2VyKCkge1xuICBpZiAoIWJyb3dzZXIpIHtcbiAgICBicm93c2VyID0gY2FsY0Jyb3dzZXIoKTtcbiAgfVxuICByZXR1cm4gYnJvd3Nlcjtcbn1cblxuZnVuY3Rpb24gUmVzaXplKF9yZWYpIHtcbiAgbGV0IHtcbiAgICBzd2lwZXIsXG4gICAgb24sXG4gICAgZW1pdFxuICB9ID0gX3JlZjtcbiAgY29uc3Qgd2luZG93ID0gZ2V0V2luZG93KCk7XG4gIGxldCBvYnNlcnZlciA9IG51bGw7XG4gIGxldCBhbmltYXRpb25GcmFtZSA9IG51bGw7XG4gIGNvbnN0IHJlc2l6ZUhhbmRsZXIgPSAoKSA9PiB7XG4gICAgaWYgKCFzd2lwZXIgfHwgc3dpcGVyLmRlc3Ryb3llZCB8fCAhc3dpcGVyLmluaXRpYWxpemVkKSByZXR1cm47XG4gICAgZW1pdCgnYmVmb3JlUmVzaXplJyk7XG4gICAgZW1pdCgncmVzaXplJyk7XG4gIH07XG4gIGNvbnN0IGNyZWF0ZU9ic2VydmVyID0gKCkgPT4ge1xuICAgIGlmICghc3dpcGVyIHx8IHN3aXBlci5kZXN0cm95ZWQgfHwgIXN3aXBlci5pbml0aWFsaXplZCkgcmV0dXJuO1xuICAgIG9ic2VydmVyID0gbmV3IFJlc2l6ZU9ic2VydmVyKGVudHJpZXMgPT4ge1xuICAgICAgYW5pbWF0aW9uRnJhbWUgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgY29uc3Qge1xuICAgICAgICAgIHdpZHRoLFxuICAgICAgICAgIGhlaWdodFxuICAgICAgICB9ID0gc3dpcGVyO1xuICAgICAgICBsZXQgbmV3V2lkdGggPSB3aWR0aDtcbiAgICAgICAgbGV0IG5ld0hlaWdodCA9IGhlaWdodDtcbiAgICAgICAgZW50cmllcy5mb3JFYWNoKF9yZWYyID0+IHtcbiAgICAgICAgICBsZXQge1xuICAgICAgICAgICAgY29udGVudEJveFNpemUsXG4gICAgICAgICAgICBjb250ZW50UmVjdCxcbiAgICAgICAgICAgIHRhcmdldFxuICAgICAgICAgIH0gPSBfcmVmMjtcbiAgICAgICAgICBpZiAodGFyZ2V0ICYmIHRhcmdldCAhPT0gc3dpcGVyLmVsKSByZXR1cm47XG4gICAgICAgICAgbmV3V2lkdGggPSBjb250ZW50UmVjdCA/IGNvbnRlbnRSZWN0LndpZHRoIDogKGNvbnRlbnRCb3hTaXplWzBdIHx8IGNvbnRlbnRCb3hTaXplKS5pbmxpbmVTaXplO1xuICAgICAgICAgIG5ld0hlaWdodCA9IGNvbnRlbnRSZWN0ID8gY29udGVudFJlY3QuaGVpZ2h0IDogKGNvbnRlbnRCb3hTaXplWzBdIHx8IGNvbnRlbnRCb3hTaXplKS5ibG9ja1NpemU7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAobmV3V2lkdGggIT09IHdpZHRoIHx8IG5ld0hlaWdodCAhPT0gaGVpZ2h0KSB7XG4gICAgICAgICAgcmVzaXplSGFuZGxlcigpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBvYnNlcnZlci5vYnNlcnZlKHN3aXBlci5lbCk7XG4gIH07XG4gIGNvbnN0IHJlbW92ZU9ic2VydmVyID0gKCkgPT4ge1xuICAgIGlmIChhbmltYXRpb25GcmFtZSkge1xuICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKGFuaW1hdGlvbkZyYW1lKTtcbiAgICB9XG4gICAgaWYgKG9ic2VydmVyICYmIG9ic2VydmVyLnVub2JzZXJ2ZSAmJiBzd2lwZXIuZWwpIHtcbiAgICAgIG9ic2VydmVyLnVub2JzZXJ2ZShzd2lwZXIuZWwpO1xuICAgICAgb2JzZXJ2ZXIgPSBudWxsO1xuICAgIH1cbiAgfTtcbiAgY29uc3Qgb3JpZW50YXRpb25DaGFuZ2VIYW5kbGVyID0gKCkgPT4ge1xuICAgIGlmICghc3dpcGVyIHx8IHN3aXBlci5kZXN0cm95ZWQgfHwgIXN3aXBlci5pbml0aWFsaXplZCkgcmV0dXJuO1xuICAgIGVtaXQoJ29yaWVudGF0aW9uY2hhbmdlJyk7XG4gIH07XG4gIG9uKCdpbml0JywgKCkgPT4ge1xuICAgIGlmIChzd2lwZXIucGFyYW1zLnJlc2l6ZU9ic2VydmVyICYmIHR5cGVvZiB3aW5kb3cuUmVzaXplT2JzZXJ2ZXIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjcmVhdGVPYnNlcnZlcigpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgcmVzaXplSGFuZGxlcik7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29yaWVudGF0aW9uY2hhbmdlJywgb3JpZW50YXRpb25DaGFuZ2VIYW5kbGVyKTtcbiAgfSk7XG4gIG9uKCdkZXN0cm95JywgKCkgPT4ge1xuICAgIHJlbW92ZU9ic2VydmVyKCk7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2l6ZUhhbmRsZXIpO1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdvcmllbnRhdGlvbmNoYW5nZScsIG9yaWVudGF0aW9uQ2hhbmdlSGFuZGxlcik7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBPYnNlcnZlcihfcmVmKSB7XG4gIGxldCB7XG4gICAgc3dpcGVyLFxuICAgIGV4dGVuZFBhcmFtcyxcbiAgICBvbixcbiAgICBlbWl0XG4gIH0gPSBfcmVmO1xuICBjb25zdCBvYnNlcnZlcnMgPSBbXTtcbiAgY29uc3Qgd2luZG93ID0gZ2V0V2luZG93KCk7XG4gIGNvbnN0IGF0dGFjaCA9IGZ1bmN0aW9uICh0YXJnZXQsIG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuICAgIGNvbnN0IE9ic2VydmVyRnVuYyA9IHdpbmRvdy5NdXRhdGlvbk9ic2VydmVyIHx8IHdpbmRvdy5XZWJraXRNdXRhdGlvbk9ic2VydmVyO1xuICAgIGNvbnN0IG9ic2VydmVyID0gbmV3IE9ic2VydmVyRnVuYyhtdXRhdGlvbnMgPT4ge1xuICAgICAgLy8gVGhlIG9ic2VydmVyVXBkYXRlIGV2ZW50IHNob3VsZCBvbmx5IGJlIHRyaWdnZXJlZFxuICAgICAgLy8gb25jZSBkZXNwaXRlIHRoZSBudW1iZXIgb2YgbXV0YXRpb25zLiAgQWRkaXRpb25hbFxuICAgICAgLy8gdHJpZ2dlcnMgYXJlIHJlZHVuZGFudCBhbmQgYXJlIHZlcnkgY29zdGx5XG4gICAgICBpZiAoc3dpcGVyLl9fcHJldmVudE9ic2VydmVyX18pIHJldHVybjtcbiAgICAgIGlmIChtdXRhdGlvbnMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGVtaXQoJ29ic2VydmVyVXBkYXRlJywgbXV0YXRpb25zWzBdKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3Qgb2JzZXJ2ZXJVcGRhdGUgPSBmdW5jdGlvbiBvYnNlcnZlclVwZGF0ZSgpIHtcbiAgICAgICAgZW1pdCgnb2JzZXJ2ZXJVcGRhdGUnLCBtdXRhdGlvbnNbMF0pO1xuICAgICAgfTtcbiAgICAgIGlmICh3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKSB7XG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUob2JzZXJ2ZXJVcGRhdGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2luZG93LnNldFRpbWVvdXQob2JzZXJ2ZXJVcGRhdGUsIDApO1xuICAgICAgfVxuICAgIH0pO1xuICAgIG9ic2VydmVyLm9ic2VydmUodGFyZ2V0LCB7XG4gICAgICBhdHRyaWJ1dGVzOiB0eXBlb2Ygb3B0aW9ucy5hdHRyaWJ1dGVzID09PSAndW5kZWZpbmVkJyA/IHRydWUgOiBvcHRpb25zLmF0dHJpYnV0ZXMsXG4gICAgICBjaGlsZExpc3Q6IHR5cGVvZiBvcHRpb25zLmNoaWxkTGlzdCA9PT0gJ3VuZGVmaW5lZCcgPyB0cnVlIDogb3B0aW9ucy5jaGlsZExpc3QsXG4gICAgICBjaGFyYWN0ZXJEYXRhOiB0eXBlb2Ygb3B0aW9ucy5jaGFyYWN0ZXJEYXRhID09PSAndW5kZWZpbmVkJyA/IHRydWUgOiBvcHRpb25zLmNoYXJhY3RlckRhdGFcbiAgICB9KTtcbiAgICBvYnNlcnZlcnMucHVzaChvYnNlcnZlcik7XG4gIH07XG4gIGNvbnN0IGluaXQgPSAoKSA9PiB7XG4gICAgaWYgKCFzd2lwZXIucGFyYW1zLm9ic2VydmVyKSByZXR1cm47XG4gICAgaWYgKHN3aXBlci5wYXJhbXMub2JzZXJ2ZVBhcmVudHMpIHtcbiAgICAgIGNvbnN0IGNvbnRhaW5lclBhcmVudHMgPSBlbGVtZW50UGFyZW50cyhzd2lwZXIuaG9zdEVsKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29udGFpbmVyUGFyZW50cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBhdHRhY2goY29udGFpbmVyUGFyZW50c1tpXSk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIE9ic2VydmUgY29udGFpbmVyXG4gICAgYXR0YWNoKHN3aXBlci5ob3N0RWwsIHtcbiAgICAgIGNoaWxkTGlzdDogc3dpcGVyLnBhcmFtcy5vYnNlcnZlU2xpZGVDaGlsZHJlblxuICAgIH0pO1xuXG4gICAgLy8gT2JzZXJ2ZSB3cmFwcGVyXG4gICAgYXR0YWNoKHN3aXBlci53cmFwcGVyRWwsIHtcbiAgICAgIGF0dHJpYnV0ZXM6IGZhbHNlXG4gICAgfSk7XG4gIH07XG4gIGNvbnN0IGRlc3Ryb3kgPSAoKSA9PiB7XG4gICAgb2JzZXJ2ZXJzLmZvckVhY2gob2JzZXJ2ZXIgPT4ge1xuICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgIH0pO1xuICAgIG9ic2VydmVycy5zcGxpY2UoMCwgb2JzZXJ2ZXJzLmxlbmd0aCk7XG4gIH07XG4gIGV4dGVuZFBhcmFtcyh7XG4gICAgb2JzZXJ2ZXI6IGZhbHNlLFxuICAgIG9ic2VydmVQYXJlbnRzOiBmYWxzZSxcbiAgICBvYnNlcnZlU2xpZGVDaGlsZHJlbjogZmFsc2VcbiAgfSk7XG4gIG9uKCdpbml0JywgaW5pdCk7XG4gIG9uKCdkZXN0cm95JywgZGVzdHJveSk7XG59XG5cbi8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVyc2NvcmUtZGFuZ2xlICovXG5cbnZhciBldmVudHNFbWl0dGVyID0ge1xuICBvbihldmVudHMsIGhhbmRsZXIsIHByaW9yaXR5KSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgaWYgKCFzZWxmLmV2ZW50c0xpc3RlbmVycyB8fCBzZWxmLmRlc3Ryb3llZCkgcmV0dXJuIHNlbGY7XG4gICAgaWYgKHR5cGVvZiBoYW5kbGVyICE9PSAnZnVuY3Rpb24nKSByZXR1cm4gc2VsZjtcbiAgICBjb25zdCBtZXRob2QgPSBwcmlvcml0eSA/ICd1bnNoaWZ0JyA6ICdwdXNoJztcbiAgICBldmVudHMuc3BsaXQoJyAnKS5mb3JFYWNoKGV2ZW50ID0+IHtcbiAgICAgIGlmICghc2VsZi5ldmVudHNMaXN0ZW5lcnNbZXZlbnRdKSBzZWxmLmV2ZW50c0xpc3RlbmVyc1tldmVudF0gPSBbXTtcbiAgICAgIHNlbGYuZXZlbnRzTGlzdGVuZXJzW2V2ZW50XVttZXRob2RdKGhhbmRsZXIpO1xuICAgIH0pO1xuICAgIHJldHVybiBzZWxmO1xuICB9LFxuICBvbmNlKGV2ZW50cywgaGFuZGxlciwgcHJpb3JpdHkpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBpZiAoIXNlbGYuZXZlbnRzTGlzdGVuZXJzIHx8IHNlbGYuZGVzdHJveWVkKSByZXR1cm4gc2VsZjtcbiAgICBpZiAodHlwZW9mIGhhbmRsZXIgIT09ICdmdW5jdGlvbicpIHJldHVybiBzZWxmO1xuICAgIGZ1bmN0aW9uIG9uY2VIYW5kbGVyKCkge1xuICAgICAgc2VsZi5vZmYoZXZlbnRzLCBvbmNlSGFuZGxlcik7XG4gICAgICBpZiAob25jZUhhbmRsZXIuX19lbWl0dGVyUHJveHkpIHtcbiAgICAgICAgZGVsZXRlIG9uY2VIYW5kbGVyLl9fZW1pdHRlclByb3h5O1xuICAgICAgfVxuICAgICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICAgIGFyZ3NbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgICB9XG4gICAgICBoYW5kbGVyLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgIH1cbiAgICBvbmNlSGFuZGxlci5fX2VtaXR0ZXJQcm94eSA9IGhhbmRsZXI7XG4gICAgcmV0dXJuIHNlbGYub24oZXZlbnRzLCBvbmNlSGFuZGxlciwgcHJpb3JpdHkpO1xuICB9LFxuICBvbkFueShoYW5kbGVyLCBwcmlvcml0eSkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGlmICghc2VsZi5ldmVudHNMaXN0ZW5lcnMgfHwgc2VsZi5kZXN0cm95ZWQpIHJldHVybiBzZWxmO1xuICAgIGlmICh0eXBlb2YgaGFuZGxlciAhPT0gJ2Z1bmN0aW9uJykgcmV0dXJuIHNlbGY7XG4gICAgY29uc3QgbWV0aG9kID0gcHJpb3JpdHkgPyAndW5zaGlmdCcgOiAncHVzaCc7XG4gICAgaWYgKHNlbGYuZXZlbnRzQW55TGlzdGVuZXJzLmluZGV4T2YoaGFuZGxlcikgPCAwKSB7XG4gICAgICBzZWxmLmV2ZW50c0FueUxpc3RlbmVyc1ttZXRob2RdKGhhbmRsZXIpO1xuICAgIH1cbiAgICByZXR1cm4gc2VsZjtcbiAgfSxcbiAgb2ZmQW55KGhhbmRsZXIpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBpZiAoIXNlbGYuZXZlbnRzTGlzdGVuZXJzIHx8IHNlbGYuZGVzdHJveWVkKSByZXR1cm4gc2VsZjtcbiAgICBpZiAoIXNlbGYuZXZlbnRzQW55TGlzdGVuZXJzKSByZXR1cm4gc2VsZjtcbiAgICBjb25zdCBpbmRleCA9IHNlbGYuZXZlbnRzQW55TGlzdGVuZXJzLmluZGV4T2YoaGFuZGxlcik7XG4gICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgIHNlbGYuZXZlbnRzQW55TGlzdGVuZXJzLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxuICAgIHJldHVybiBzZWxmO1xuICB9LFxuICBvZmYoZXZlbnRzLCBoYW5kbGVyKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgaWYgKCFzZWxmLmV2ZW50c0xpc3RlbmVycyB8fCBzZWxmLmRlc3Ryb3llZCkgcmV0dXJuIHNlbGY7XG4gICAgaWYgKCFzZWxmLmV2ZW50c0xpc3RlbmVycykgcmV0dXJuIHNlbGY7XG4gICAgZXZlbnRzLnNwbGl0KCcgJykuZm9yRWFjaChldmVudCA9PiB7XG4gICAgICBpZiAodHlwZW9mIGhhbmRsZXIgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHNlbGYuZXZlbnRzTGlzdGVuZXJzW2V2ZW50XSA9IFtdO1xuICAgICAgfSBlbHNlIGlmIChzZWxmLmV2ZW50c0xpc3RlbmVyc1tldmVudF0pIHtcbiAgICAgICAgc2VsZi5ldmVudHNMaXN0ZW5lcnNbZXZlbnRdLmZvckVhY2goKGV2ZW50SGFuZGxlciwgaW5kZXgpID0+IHtcbiAgICAgICAgICBpZiAoZXZlbnRIYW5kbGVyID09PSBoYW5kbGVyIHx8IGV2ZW50SGFuZGxlci5fX2VtaXR0ZXJQcm94eSAmJiBldmVudEhhbmRsZXIuX19lbWl0dGVyUHJveHkgPT09IGhhbmRsZXIpIHtcbiAgICAgICAgICAgIHNlbGYuZXZlbnRzTGlzdGVuZXJzW2V2ZW50XS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHNlbGY7XG4gIH0sXG4gIGVtaXQoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgaWYgKCFzZWxmLmV2ZW50c0xpc3RlbmVycyB8fCBzZWxmLmRlc3Ryb3llZCkgcmV0dXJuIHNlbGY7XG4gICAgaWYgKCFzZWxmLmV2ZW50c0xpc3RlbmVycykgcmV0dXJuIHNlbGY7XG4gICAgbGV0IGV2ZW50cztcbiAgICBsZXQgZGF0YTtcbiAgICBsZXQgY29udGV4dDtcbiAgICBmb3IgKHZhciBfbGVuMiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbjIpLCBfa2V5MiA9IDA7IF9rZXkyIDwgX2xlbjI7IF9rZXkyKyspIHtcbiAgICAgIGFyZ3NbX2tleTJdID0gYXJndW1lbnRzW19rZXkyXTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBhcmdzWzBdID09PSAnc3RyaW5nJyB8fCBBcnJheS5pc0FycmF5KGFyZ3NbMF0pKSB7XG4gICAgICBldmVudHMgPSBhcmdzWzBdO1xuICAgICAgZGF0YSA9IGFyZ3Muc2xpY2UoMSwgYXJncy5sZW5ndGgpO1xuICAgICAgY29udGV4dCA9IHNlbGY7XG4gICAgfSBlbHNlIHtcbiAgICAgIGV2ZW50cyA9IGFyZ3NbMF0uZXZlbnRzO1xuICAgICAgZGF0YSA9IGFyZ3NbMF0uZGF0YTtcbiAgICAgIGNvbnRleHQgPSBhcmdzWzBdLmNvbnRleHQgfHwgc2VsZjtcbiAgICB9XG4gICAgZGF0YS51bnNoaWZ0KGNvbnRleHQpO1xuICAgIGNvbnN0IGV2ZW50c0FycmF5ID0gQXJyYXkuaXNBcnJheShldmVudHMpID8gZXZlbnRzIDogZXZlbnRzLnNwbGl0KCcgJyk7XG4gICAgZXZlbnRzQXJyYXkuZm9yRWFjaChldmVudCA9PiB7XG4gICAgICBpZiAoc2VsZi5ldmVudHNBbnlMaXN0ZW5lcnMgJiYgc2VsZi5ldmVudHNBbnlMaXN0ZW5lcnMubGVuZ3RoKSB7XG4gICAgICAgIHNlbGYuZXZlbnRzQW55TGlzdGVuZXJzLmZvckVhY2goZXZlbnRIYW5kbGVyID0+IHtcbiAgICAgICAgICBldmVudEhhbmRsZXIuYXBwbHkoY29udGV4dCwgW2V2ZW50LCAuLi5kYXRhXSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKHNlbGYuZXZlbnRzTGlzdGVuZXJzICYmIHNlbGYuZXZlbnRzTGlzdGVuZXJzW2V2ZW50XSkge1xuICAgICAgICBzZWxmLmV2ZW50c0xpc3RlbmVyc1tldmVudF0uZm9yRWFjaChldmVudEhhbmRsZXIgPT4ge1xuICAgICAgICAgIGV2ZW50SGFuZGxlci5hcHBseShjb250ZXh0LCBkYXRhKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHNlbGY7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHVwZGF0ZVNpemUoKSB7XG4gIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gIGxldCB3aWR0aDtcbiAgbGV0IGhlaWdodDtcbiAgY29uc3QgZWwgPSBzd2lwZXIuZWw7XG4gIGlmICh0eXBlb2Ygc3dpcGVyLnBhcmFtcy53aWR0aCAhPT0gJ3VuZGVmaW5lZCcgJiYgc3dpcGVyLnBhcmFtcy53aWR0aCAhPT0gbnVsbCkge1xuICAgIHdpZHRoID0gc3dpcGVyLnBhcmFtcy53aWR0aDtcbiAgfSBlbHNlIHtcbiAgICB3aWR0aCA9IGVsLmNsaWVudFdpZHRoO1xuICB9XG4gIGlmICh0eXBlb2Ygc3dpcGVyLnBhcmFtcy5oZWlnaHQgIT09ICd1bmRlZmluZWQnICYmIHN3aXBlci5wYXJhbXMuaGVpZ2h0ICE9PSBudWxsKSB7XG4gICAgaGVpZ2h0ID0gc3dpcGVyLnBhcmFtcy5oZWlnaHQ7XG4gIH0gZWxzZSB7XG4gICAgaGVpZ2h0ID0gZWwuY2xpZW50SGVpZ2h0O1xuICB9XG4gIGlmICh3aWR0aCA9PT0gMCAmJiBzd2lwZXIuaXNIb3Jpem9udGFsKCkgfHwgaGVpZ2h0ID09PSAwICYmIHN3aXBlci5pc1ZlcnRpY2FsKCkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBTdWJ0cmFjdCBwYWRkaW5nc1xuICB3aWR0aCA9IHdpZHRoIC0gcGFyc2VJbnQoZWxlbWVudFN0eWxlKGVsLCAncGFkZGluZy1sZWZ0JykgfHwgMCwgMTApIC0gcGFyc2VJbnQoZWxlbWVudFN0eWxlKGVsLCAncGFkZGluZy1yaWdodCcpIHx8IDAsIDEwKTtcbiAgaGVpZ2h0ID0gaGVpZ2h0IC0gcGFyc2VJbnQoZWxlbWVudFN0eWxlKGVsLCAncGFkZGluZy10b3AnKSB8fCAwLCAxMCkgLSBwYXJzZUludChlbGVtZW50U3R5bGUoZWwsICdwYWRkaW5nLWJvdHRvbScpIHx8IDAsIDEwKTtcbiAgaWYgKE51bWJlci5pc05hTih3aWR0aCkpIHdpZHRoID0gMDtcbiAgaWYgKE51bWJlci5pc05hTihoZWlnaHQpKSBoZWlnaHQgPSAwO1xuICBPYmplY3QuYXNzaWduKHN3aXBlciwge1xuICAgIHdpZHRoLFxuICAgIGhlaWdodCxcbiAgICBzaXplOiBzd2lwZXIuaXNIb3Jpem9udGFsKCkgPyB3aWR0aCA6IGhlaWdodFxuICB9KTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlU2xpZGVzKCkge1xuICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICBmdW5jdGlvbiBnZXREaXJlY3Rpb25Qcm9wZXJ0eVZhbHVlKG5vZGUsIGxhYmVsKSB7XG4gICAgcmV0dXJuIHBhcnNlRmxvYXQobm9kZS5nZXRQcm9wZXJ0eVZhbHVlKHN3aXBlci5nZXREaXJlY3Rpb25MYWJlbChsYWJlbCkpIHx8IDApO1xuICB9XG4gIGNvbnN0IHBhcmFtcyA9IHN3aXBlci5wYXJhbXM7XG4gIGNvbnN0IHtcbiAgICB3cmFwcGVyRWwsXG4gICAgc2xpZGVzRWwsXG4gICAgc2l6ZTogc3dpcGVyU2l6ZSxcbiAgICBydGxUcmFuc2xhdGU6IHJ0bCxcbiAgICB3cm9uZ1JUTFxuICB9ID0gc3dpcGVyO1xuICBjb25zdCBpc1ZpcnR1YWwgPSBzd2lwZXIudmlydHVhbCAmJiBwYXJhbXMudmlydHVhbC5lbmFibGVkO1xuICBjb25zdCBwcmV2aW91c1NsaWRlc0xlbmd0aCA9IGlzVmlydHVhbCA/IHN3aXBlci52aXJ0dWFsLnNsaWRlcy5sZW5ndGggOiBzd2lwZXIuc2xpZGVzLmxlbmd0aDtcbiAgY29uc3Qgc2xpZGVzID0gZWxlbWVudENoaWxkcmVuKHNsaWRlc0VsLCBgLiR7c3dpcGVyLnBhcmFtcy5zbGlkZUNsYXNzfSwgc3dpcGVyLXNsaWRlYCk7XG4gIGNvbnN0IHNsaWRlc0xlbmd0aCA9IGlzVmlydHVhbCA/IHN3aXBlci52aXJ0dWFsLnNsaWRlcy5sZW5ndGggOiBzbGlkZXMubGVuZ3RoO1xuICBsZXQgc25hcEdyaWQgPSBbXTtcbiAgY29uc3Qgc2xpZGVzR3JpZCA9IFtdO1xuICBjb25zdCBzbGlkZXNTaXplc0dyaWQgPSBbXTtcbiAgbGV0IG9mZnNldEJlZm9yZSA9IHBhcmFtcy5zbGlkZXNPZmZzZXRCZWZvcmU7XG4gIGlmICh0eXBlb2Ygb2Zmc2V0QmVmb3JlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgb2Zmc2V0QmVmb3JlID0gcGFyYW1zLnNsaWRlc09mZnNldEJlZm9yZS5jYWxsKHN3aXBlcik7XG4gIH1cbiAgbGV0IG9mZnNldEFmdGVyID0gcGFyYW1zLnNsaWRlc09mZnNldEFmdGVyO1xuICBpZiAodHlwZW9mIG9mZnNldEFmdGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgb2Zmc2V0QWZ0ZXIgPSBwYXJhbXMuc2xpZGVzT2Zmc2V0QWZ0ZXIuY2FsbChzd2lwZXIpO1xuICB9XG4gIGNvbnN0IHByZXZpb3VzU25hcEdyaWRMZW5ndGggPSBzd2lwZXIuc25hcEdyaWQubGVuZ3RoO1xuICBjb25zdCBwcmV2aW91c1NsaWRlc0dyaWRMZW5ndGggPSBzd2lwZXIuc2xpZGVzR3JpZC5sZW5ndGg7XG4gIGxldCBzcGFjZUJldHdlZW4gPSBwYXJhbXMuc3BhY2VCZXR3ZWVuO1xuICBsZXQgc2xpZGVQb3NpdGlvbiA9IC1vZmZzZXRCZWZvcmU7XG4gIGxldCBwcmV2U2xpZGVTaXplID0gMDtcbiAgbGV0IGluZGV4ID0gMDtcbiAgaWYgKHR5cGVvZiBzd2lwZXJTaXplID09PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAodHlwZW9mIHNwYWNlQmV0d2VlbiA9PT0gJ3N0cmluZycgJiYgc3BhY2VCZXR3ZWVuLmluZGV4T2YoJyUnKSA+PSAwKSB7XG4gICAgc3BhY2VCZXR3ZWVuID0gcGFyc2VGbG9hdChzcGFjZUJldHdlZW4ucmVwbGFjZSgnJScsICcnKSkgLyAxMDAgKiBzd2lwZXJTaXplO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBzcGFjZUJldHdlZW4gPT09ICdzdHJpbmcnKSB7XG4gICAgc3BhY2VCZXR3ZWVuID0gcGFyc2VGbG9hdChzcGFjZUJldHdlZW4pO1xuICB9XG4gIHN3aXBlci52aXJ0dWFsU2l6ZSA9IC1zcGFjZUJldHdlZW47XG5cbiAgLy8gcmVzZXQgbWFyZ2luc1xuICBzbGlkZXMuZm9yRWFjaChzbGlkZUVsID0+IHtcbiAgICBpZiAocnRsKSB7XG4gICAgICBzbGlkZUVsLnN0eWxlLm1hcmdpbkxlZnQgPSAnJztcbiAgICB9IGVsc2Uge1xuICAgICAgc2xpZGVFbC5zdHlsZS5tYXJnaW5SaWdodCA9ICcnO1xuICAgIH1cbiAgICBzbGlkZUVsLnN0eWxlLm1hcmdpbkJvdHRvbSA9ICcnO1xuICAgIHNsaWRlRWwuc3R5bGUubWFyZ2luVG9wID0gJyc7XG4gIH0pO1xuXG4gIC8vIHJlc2V0IGNzc01vZGUgb2Zmc2V0c1xuICBpZiAocGFyYW1zLmNlbnRlcmVkU2xpZGVzICYmIHBhcmFtcy5jc3NNb2RlKSB7XG4gICAgc2V0Q1NTUHJvcGVydHkod3JhcHBlckVsLCAnLS1zd2lwZXItY2VudGVyZWQtb2Zmc2V0LWJlZm9yZScsICcnKTtcbiAgICBzZXRDU1NQcm9wZXJ0eSh3cmFwcGVyRWwsICctLXN3aXBlci1jZW50ZXJlZC1vZmZzZXQtYWZ0ZXInLCAnJyk7XG4gIH1cbiAgY29uc3QgZ3JpZEVuYWJsZWQgPSBwYXJhbXMuZ3JpZCAmJiBwYXJhbXMuZ3JpZC5yb3dzID4gMSAmJiBzd2lwZXIuZ3JpZDtcbiAgaWYgKGdyaWRFbmFibGVkKSB7XG4gICAgc3dpcGVyLmdyaWQuaW5pdFNsaWRlcyhzbGlkZXMpO1xuICB9IGVsc2UgaWYgKHN3aXBlci5ncmlkKSB7XG4gICAgc3dpcGVyLmdyaWQudW5zZXRTbGlkZXMoKTtcbiAgfVxuXG4gIC8vIENhbGMgc2xpZGVzXG4gIGxldCBzbGlkZVNpemU7XG4gIGNvbnN0IHNob3VsZFJlc2V0U2xpZGVTaXplID0gcGFyYW1zLnNsaWRlc1BlclZpZXcgPT09ICdhdXRvJyAmJiBwYXJhbXMuYnJlYWtwb2ludHMgJiYgT2JqZWN0LmtleXMocGFyYW1zLmJyZWFrcG9pbnRzKS5maWx0ZXIoa2V5ID0+IHtcbiAgICByZXR1cm4gdHlwZW9mIHBhcmFtcy5icmVha3BvaW50c1trZXldLnNsaWRlc1BlclZpZXcgIT09ICd1bmRlZmluZWQnO1xuICB9KS5sZW5ndGggPiAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHNsaWRlc0xlbmd0aDsgaSArPSAxKSB7XG4gICAgc2xpZGVTaXplID0gMDtcbiAgICBsZXQgc2xpZGU7XG4gICAgaWYgKHNsaWRlc1tpXSkgc2xpZGUgPSBzbGlkZXNbaV07XG4gICAgaWYgKGdyaWRFbmFibGVkKSB7XG4gICAgICBzd2lwZXIuZ3JpZC51cGRhdGVTbGlkZShpLCBzbGlkZSwgc2xpZGVzKTtcbiAgICB9XG4gICAgaWYgKHNsaWRlc1tpXSAmJiBlbGVtZW50U3R5bGUoc2xpZGUsICdkaXNwbGF5JykgPT09ICdub25lJykgY29udGludWU7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcblxuICAgIGlmIChwYXJhbXMuc2xpZGVzUGVyVmlldyA9PT0gJ2F1dG8nKSB7XG4gICAgICBpZiAoc2hvdWxkUmVzZXRTbGlkZVNpemUpIHtcbiAgICAgICAgc2xpZGVzW2ldLnN0eWxlW3N3aXBlci5nZXREaXJlY3Rpb25MYWJlbCgnd2lkdGgnKV0gPSBgYDtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHNsaWRlU3R5bGVzID0gZ2V0Q29tcHV0ZWRTdHlsZShzbGlkZSk7XG4gICAgICBjb25zdCBjdXJyZW50VHJhbnNmb3JtID0gc2xpZGUuc3R5bGUudHJhbnNmb3JtO1xuICAgICAgY29uc3QgY3VycmVudFdlYktpdFRyYW5zZm9ybSA9IHNsaWRlLnN0eWxlLndlYmtpdFRyYW5zZm9ybTtcbiAgICAgIGlmIChjdXJyZW50VHJhbnNmb3JtKSB7XG4gICAgICAgIHNsaWRlLnN0eWxlLnRyYW5zZm9ybSA9ICdub25lJztcbiAgICAgIH1cbiAgICAgIGlmIChjdXJyZW50V2ViS2l0VHJhbnNmb3JtKSB7XG4gICAgICAgIHNsaWRlLnN0eWxlLndlYmtpdFRyYW5zZm9ybSA9ICdub25lJztcbiAgICAgIH1cbiAgICAgIGlmIChwYXJhbXMucm91bmRMZW5ndGhzKSB7XG4gICAgICAgIHNsaWRlU2l6ZSA9IHN3aXBlci5pc0hvcml6b250YWwoKSA/IGVsZW1lbnRPdXRlclNpemUoc2xpZGUsICd3aWR0aCcsIHRydWUpIDogZWxlbWVudE91dGVyU2l6ZShzbGlkZSwgJ2hlaWdodCcsIHRydWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgICAgIGNvbnN0IHdpZHRoID0gZ2V0RGlyZWN0aW9uUHJvcGVydHlWYWx1ZShzbGlkZVN0eWxlcywgJ3dpZHRoJyk7XG4gICAgICAgIGNvbnN0IHBhZGRpbmdMZWZ0ID0gZ2V0RGlyZWN0aW9uUHJvcGVydHlWYWx1ZShzbGlkZVN0eWxlcywgJ3BhZGRpbmctbGVmdCcpO1xuICAgICAgICBjb25zdCBwYWRkaW5nUmlnaHQgPSBnZXREaXJlY3Rpb25Qcm9wZXJ0eVZhbHVlKHNsaWRlU3R5bGVzLCAncGFkZGluZy1yaWdodCcpO1xuICAgICAgICBjb25zdCBtYXJnaW5MZWZ0ID0gZ2V0RGlyZWN0aW9uUHJvcGVydHlWYWx1ZShzbGlkZVN0eWxlcywgJ21hcmdpbi1sZWZ0Jyk7XG4gICAgICAgIGNvbnN0IG1hcmdpblJpZ2h0ID0gZ2V0RGlyZWN0aW9uUHJvcGVydHlWYWx1ZShzbGlkZVN0eWxlcywgJ21hcmdpbi1yaWdodCcpO1xuICAgICAgICBjb25zdCBib3hTaXppbmcgPSBzbGlkZVN0eWxlcy5nZXRQcm9wZXJ0eVZhbHVlKCdib3gtc2l6aW5nJyk7XG4gICAgICAgIGlmIChib3hTaXppbmcgJiYgYm94U2l6aW5nID09PSAnYm9yZGVyLWJveCcpIHtcbiAgICAgICAgICBzbGlkZVNpemUgPSB3aWR0aCArIG1hcmdpbkxlZnQgKyBtYXJnaW5SaWdodDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCB7XG4gICAgICAgICAgICBjbGllbnRXaWR0aCxcbiAgICAgICAgICAgIG9mZnNldFdpZHRoXG4gICAgICAgICAgfSA9IHNsaWRlO1xuICAgICAgICAgIHNsaWRlU2l6ZSA9IHdpZHRoICsgcGFkZGluZ0xlZnQgKyBwYWRkaW5nUmlnaHQgKyBtYXJnaW5MZWZ0ICsgbWFyZ2luUmlnaHQgKyAob2Zmc2V0V2lkdGggLSBjbGllbnRXaWR0aCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChjdXJyZW50VHJhbnNmb3JtKSB7XG4gICAgICAgIHNsaWRlLnN0eWxlLnRyYW5zZm9ybSA9IGN1cnJlbnRUcmFuc2Zvcm07XG4gICAgICB9XG4gICAgICBpZiAoY3VycmVudFdlYktpdFRyYW5zZm9ybSkge1xuICAgICAgICBzbGlkZS5zdHlsZS53ZWJraXRUcmFuc2Zvcm0gPSBjdXJyZW50V2ViS2l0VHJhbnNmb3JtO1xuICAgICAgfVxuICAgICAgaWYgKHBhcmFtcy5yb3VuZExlbmd0aHMpIHNsaWRlU2l6ZSA9IE1hdGguZmxvb3Ioc2xpZGVTaXplKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2xpZGVTaXplID0gKHN3aXBlclNpemUgLSAocGFyYW1zLnNsaWRlc1BlclZpZXcgLSAxKSAqIHNwYWNlQmV0d2VlbikgLyBwYXJhbXMuc2xpZGVzUGVyVmlldztcbiAgICAgIGlmIChwYXJhbXMucm91bmRMZW5ndGhzKSBzbGlkZVNpemUgPSBNYXRoLmZsb29yKHNsaWRlU2l6ZSk7XG4gICAgICBpZiAoc2xpZGVzW2ldKSB7XG4gICAgICAgIHNsaWRlc1tpXS5zdHlsZVtzd2lwZXIuZ2V0RGlyZWN0aW9uTGFiZWwoJ3dpZHRoJyldID0gYCR7c2xpZGVTaXplfXB4YDtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHNsaWRlc1tpXSkge1xuICAgICAgc2xpZGVzW2ldLnN3aXBlclNsaWRlU2l6ZSA9IHNsaWRlU2l6ZTtcbiAgICB9XG4gICAgc2xpZGVzU2l6ZXNHcmlkLnB1c2goc2xpZGVTaXplKTtcbiAgICBpZiAocGFyYW1zLmNlbnRlcmVkU2xpZGVzKSB7XG4gICAgICBzbGlkZVBvc2l0aW9uID0gc2xpZGVQb3NpdGlvbiArIHNsaWRlU2l6ZSAvIDIgKyBwcmV2U2xpZGVTaXplIC8gMiArIHNwYWNlQmV0d2VlbjtcbiAgICAgIGlmIChwcmV2U2xpZGVTaXplID09PSAwICYmIGkgIT09IDApIHNsaWRlUG9zaXRpb24gPSBzbGlkZVBvc2l0aW9uIC0gc3dpcGVyU2l6ZSAvIDIgLSBzcGFjZUJldHdlZW47XG4gICAgICBpZiAoaSA9PT0gMCkgc2xpZGVQb3NpdGlvbiA9IHNsaWRlUG9zaXRpb24gLSBzd2lwZXJTaXplIC8gMiAtIHNwYWNlQmV0d2VlbjtcbiAgICAgIGlmIChNYXRoLmFicyhzbGlkZVBvc2l0aW9uKSA8IDEgLyAxMDAwKSBzbGlkZVBvc2l0aW9uID0gMDtcbiAgICAgIGlmIChwYXJhbXMucm91bmRMZW5ndGhzKSBzbGlkZVBvc2l0aW9uID0gTWF0aC5mbG9vcihzbGlkZVBvc2l0aW9uKTtcbiAgICAgIGlmIChpbmRleCAlIHBhcmFtcy5zbGlkZXNQZXJHcm91cCA9PT0gMCkgc25hcEdyaWQucHVzaChzbGlkZVBvc2l0aW9uKTtcbiAgICAgIHNsaWRlc0dyaWQucHVzaChzbGlkZVBvc2l0aW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHBhcmFtcy5yb3VuZExlbmd0aHMpIHNsaWRlUG9zaXRpb24gPSBNYXRoLmZsb29yKHNsaWRlUG9zaXRpb24pO1xuICAgICAgaWYgKChpbmRleCAtIE1hdGgubWluKHN3aXBlci5wYXJhbXMuc2xpZGVzUGVyR3JvdXBTa2lwLCBpbmRleCkpICUgc3dpcGVyLnBhcmFtcy5zbGlkZXNQZXJHcm91cCA9PT0gMCkgc25hcEdyaWQucHVzaChzbGlkZVBvc2l0aW9uKTtcbiAgICAgIHNsaWRlc0dyaWQucHVzaChzbGlkZVBvc2l0aW9uKTtcbiAgICAgIHNsaWRlUG9zaXRpb24gPSBzbGlkZVBvc2l0aW9uICsgc2xpZGVTaXplICsgc3BhY2VCZXR3ZWVuO1xuICAgIH1cbiAgICBzd2lwZXIudmlydHVhbFNpemUgKz0gc2xpZGVTaXplICsgc3BhY2VCZXR3ZWVuO1xuICAgIHByZXZTbGlkZVNpemUgPSBzbGlkZVNpemU7XG4gICAgaW5kZXggKz0gMTtcbiAgfVxuICBzd2lwZXIudmlydHVhbFNpemUgPSBNYXRoLm1heChzd2lwZXIudmlydHVhbFNpemUsIHN3aXBlclNpemUpICsgb2Zmc2V0QWZ0ZXI7XG4gIGlmIChydGwgJiYgd3JvbmdSVEwgJiYgKHBhcmFtcy5lZmZlY3QgPT09ICdzbGlkZScgfHwgcGFyYW1zLmVmZmVjdCA9PT0gJ2NvdmVyZmxvdycpKSB7XG4gICAgd3JhcHBlckVsLnN0eWxlLndpZHRoID0gYCR7c3dpcGVyLnZpcnR1YWxTaXplICsgc3BhY2VCZXR3ZWVufXB4YDtcbiAgfVxuICBpZiAocGFyYW1zLnNldFdyYXBwZXJTaXplKSB7XG4gICAgd3JhcHBlckVsLnN0eWxlW3N3aXBlci5nZXREaXJlY3Rpb25MYWJlbCgnd2lkdGgnKV0gPSBgJHtzd2lwZXIudmlydHVhbFNpemUgKyBzcGFjZUJldHdlZW59cHhgO1xuICB9XG4gIGlmIChncmlkRW5hYmxlZCkge1xuICAgIHN3aXBlci5ncmlkLnVwZGF0ZVdyYXBwZXJTaXplKHNsaWRlU2l6ZSwgc25hcEdyaWQpO1xuICB9XG5cbiAgLy8gUmVtb3ZlIGxhc3QgZ3JpZCBlbGVtZW50cyBkZXBlbmRpbmcgb24gd2lkdGhcbiAgaWYgKCFwYXJhbXMuY2VudGVyZWRTbGlkZXMpIHtcbiAgICBjb25zdCBuZXdTbGlkZXNHcmlkID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzbmFwR3JpZC5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgbGV0IHNsaWRlc0dyaWRJdGVtID0gc25hcEdyaWRbaV07XG4gICAgICBpZiAocGFyYW1zLnJvdW5kTGVuZ3Rocykgc2xpZGVzR3JpZEl0ZW0gPSBNYXRoLmZsb29yKHNsaWRlc0dyaWRJdGVtKTtcbiAgICAgIGlmIChzbmFwR3JpZFtpXSA8PSBzd2lwZXIudmlydHVhbFNpemUgLSBzd2lwZXJTaXplKSB7XG4gICAgICAgIG5ld1NsaWRlc0dyaWQucHVzaChzbGlkZXNHcmlkSXRlbSk7XG4gICAgICB9XG4gICAgfVxuICAgIHNuYXBHcmlkID0gbmV3U2xpZGVzR3JpZDtcbiAgICBpZiAoTWF0aC5mbG9vcihzd2lwZXIudmlydHVhbFNpemUgLSBzd2lwZXJTaXplKSAtIE1hdGguZmxvb3Ioc25hcEdyaWRbc25hcEdyaWQubGVuZ3RoIC0gMV0pID4gMSkge1xuICAgICAgc25hcEdyaWQucHVzaChzd2lwZXIudmlydHVhbFNpemUgLSBzd2lwZXJTaXplKTtcbiAgICB9XG4gIH1cbiAgaWYgKGlzVmlydHVhbCAmJiBwYXJhbXMubG9vcCkge1xuICAgIGNvbnN0IHNpemUgPSBzbGlkZXNTaXplc0dyaWRbMF0gKyBzcGFjZUJldHdlZW47XG4gICAgaWYgKHBhcmFtcy5zbGlkZXNQZXJHcm91cCA+IDEpIHtcbiAgICAgIGNvbnN0IGdyb3VwcyA9IE1hdGguY2VpbCgoc3dpcGVyLnZpcnR1YWwuc2xpZGVzQmVmb3JlICsgc3dpcGVyLnZpcnR1YWwuc2xpZGVzQWZ0ZXIpIC8gcGFyYW1zLnNsaWRlc1Blckdyb3VwKTtcbiAgICAgIGNvbnN0IGdyb3VwU2l6ZSA9IHNpemUgKiBwYXJhbXMuc2xpZGVzUGVyR3JvdXA7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdyb3VwczsgaSArPSAxKSB7XG4gICAgICAgIHNuYXBHcmlkLnB1c2goc25hcEdyaWRbc25hcEdyaWQubGVuZ3RoIC0gMV0gKyBncm91cFNpemUpO1xuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN3aXBlci52aXJ0dWFsLnNsaWRlc0JlZm9yZSArIHN3aXBlci52aXJ0dWFsLnNsaWRlc0FmdGVyOyBpICs9IDEpIHtcbiAgICAgIGlmIChwYXJhbXMuc2xpZGVzUGVyR3JvdXAgPT09IDEpIHtcbiAgICAgICAgc25hcEdyaWQucHVzaChzbmFwR3JpZFtzbmFwR3JpZC5sZW5ndGggLSAxXSArIHNpemUpO1xuICAgICAgfVxuICAgICAgc2xpZGVzR3JpZC5wdXNoKHNsaWRlc0dyaWRbc2xpZGVzR3JpZC5sZW5ndGggLSAxXSArIHNpemUpO1xuICAgICAgc3dpcGVyLnZpcnR1YWxTaXplICs9IHNpemU7XG4gICAgfVxuICB9XG4gIGlmIChzbmFwR3JpZC5sZW5ndGggPT09IDApIHNuYXBHcmlkID0gWzBdO1xuICBpZiAoc3BhY2VCZXR3ZWVuICE9PSAwKSB7XG4gICAgY29uc3Qga2V5ID0gc3dpcGVyLmlzSG9yaXpvbnRhbCgpICYmIHJ0bCA/ICdtYXJnaW5MZWZ0JyA6IHN3aXBlci5nZXREaXJlY3Rpb25MYWJlbCgnbWFyZ2luUmlnaHQnKTtcbiAgICBzbGlkZXMuZmlsdGVyKChfLCBzbGlkZUluZGV4KSA9PiB7XG4gICAgICBpZiAoIXBhcmFtcy5jc3NNb2RlIHx8IHBhcmFtcy5sb29wKSByZXR1cm4gdHJ1ZTtcbiAgICAgIGlmIChzbGlkZUluZGV4ID09PSBzbGlkZXMubGVuZ3RoIC0gMSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KS5mb3JFYWNoKHNsaWRlRWwgPT4ge1xuICAgICAgc2xpZGVFbC5zdHlsZVtrZXldID0gYCR7c3BhY2VCZXR3ZWVufXB4YDtcbiAgICB9KTtcbiAgfVxuICBpZiAocGFyYW1zLmNlbnRlcmVkU2xpZGVzICYmIHBhcmFtcy5jZW50ZXJlZFNsaWRlc0JvdW5kcykge1xuICAgIGxldCBhbGxTbGlkZXNTaXplID0gMDtcbiAgICBzbGlkZXNTaXplc0dyaWQuZm9yRWFjaChzbGlkZVNpemVWYWx1ZSA9PiB7XG4gICAgICBhbGxTbGlkZXNTaXplICs9IHNsaWRlU2l6ZVZhbHVlICsgKHNwYWNlQmV0d2VlbiB8fCAwKTtcbiAgICB9KTtcbiAgICBhbGxTbGlkZXNTaXplIC09IHNwYWNlQmV0d2VlbjtcbiAgICBjb25zdCBtYXhTbmFwID0gYWxsU2xpZGVzU2l6ZSAtIHN3aXBlclNpemU7XG4gICAgc25hcEdyaWQgPSBzbmFwR3JpZC5tYXAoc25hcCA9PiB7XG4gICAgICBpZiAoc25hcCA8PSAwKSByZXR1cm4gLW9mZnNldEJlZm9yZTtcbiAgICAgIGlmIChzbmFwID4gbWF4U25hcCkgcmV0dXJuIG1heFNuYXAgKyBvZmZzZXRBZnRlcjtcbiAgICAgIHJldHVybiBzbmFwO1xuICAgIH0pO1xuICB9XG4gIGlmIChwYXJhbXMuY2VudGVySW5zdWZmaWNpZW50U2xpZGVzKSB7XG4gICAgbGV0IGFsbFNsaWRlc1NpemUgPSAwO1xuICAgIHNsaWRlc1NpemVzR3JpZC5mb3JFYWNoKHNsaWRlU2l6ZVZhbHVlID0+IHtcbiAgICAgIGFsbFNsaWRlc1NpemUgKz0gc2xpZGVTaXplVmFsdWUgKyAoc3BhY2VCZXR3ZWVuIHx8IDApO1xuICAgIH0pO1xuICAgIGFsbFNsaWRlc1NpemUgLT0gc3BhY2VCZXR3ZWVuO1xuICAgIGlmIChhbGxTbGlkZXNTaXplIDwgc3dpcGVyU2l6ZSkge1xuICAgICAgY29uc3QgYWxsU2xpZGVzT2Zmc2V0ID0gKHN3aXBlclNpemUgLSBhbGxTbGlkZXNTaXplKSAvIDI7XG4gICAgICBzbmFwR3JpZC5mb3JFYWNoKChzbmFwLCBzbmFwSW5kZXgpID0+IHtcbiAgICAgICAgc25hcEdyaWRbc25hcEluZGV4XSA9IHNuYXAgLSBhbGxTbGlkZXNPZmZzZXQ7XG4gICAgICB9KTtcbiAgICAgIHNsaWRlc0dyaWQuZm9yRWFjaCgoc25hcCwgc25hcEluZGV4KSA9PiB7XG4gICAgICAgIHNsaWRlc0dyaWRbc25hcEluZGV4XSA9IHNuYXAgKyBhbGxTbGlkZXNPZmZzZXQ7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgT2JqZWN0LmFzc2lnbihzd2lwZXIsIHtcbiAgICBzbGlkZXMsXG4gICAgc25hcEdyaWQsXG4gICAgc2xpZGVzR3JpZCxcbiAgICBzbGlkZXNTaXplc0dyaWRcbiAgfSk7XG4gIGlmIChwYXJhbXMuY2VudGVyZWRTbGlkZXMgJiYgcGFyYW1zLmNzc01vZGUgJiYgIXBhcmFtcy5jZW50ZXJlZFNsaWRlc0JvdW5kcykge1xuICAgIHNldENTU1Byb3BlcnR5KHdyYXBwZXJFbCwgJy0tc3dpcGVyLWNlbnRlcmVkLW9mZnNldC1iZWZvcmUnLCBgJHstc25hcEdyaWRbMF19cHhgKTtcbiAgICBzZXRDU1NQcm9wZXJ0eSh3cmFwcGVyRWwsICctLXN3aXBlci1jZW50ZXJlZC1vZmZzZXQtYWZ0ZXInLCBgJHtzd2lwZXIuc2l6ZSAvIDIgLSBzbGlkZXNTaXplc0dyaWRbc2xpZGVzU2l6ZXNHcmlkLmxlbmd0aCAtIDFdIC8gMn1weGApO1xuICAgIGNvbnN0IGFkZFRvU25hcEdyaWQgPSAtc3dpcGVyLnNuYXBHcmlkWzBdO1xuICAgIGNvbnN0IGFkZFRvU2xpZGVzR3JpZCA9IC1zd2lwZXIuc2xpZGVzR3JpZFswXTtcbiAgICBzd2lwZXIuc25hcEdyaWQgPSBzd2lwZXIuc25hcEdyaWQubWFwKHYgPT4gdiArIGFkZFRvU25hcEdyaWQpO1xuICAgIHN3aXBlci5zbGlkZXNHcmlkID0gc3dpcGVyLnNsaWRlc0dyaWQubWFwKHYgPT4gdiArIGFkZFRvU2xpZGVzR3JpZCk7XG4gIH1cbiAgaWYgKHNsaWRlc0xlbmd0aCAhPT0gcHJldmlvdXNTbGlkZXNMZW5ndGgpIHtcbiAgICBzd2lwZXIuZW1pdCgnc2xpZGVzTGVuZ3RoQ2hhbmdlJyk7XG4gIH1cbiAgaWYgKHNuYXBHcmlkLmxlbmd0aCAhPT0gcHJldmlvdXNTbmFwR3JpZExlbmd0aCkge1xuICAgIGlmIChzd2lwZXIucGFyYW1zLndhdGNoT3ZlcmZsb3cpIHN3aXBlci5jaGVja092ZXJmbG93KCk7XG4gICAgc3dpcGVyLmVtaXQoJ3NuYXBHcmlkTGVuZ3RoQ2hhbmdlJyk7XG4gIH1cbiAgaWYgKHNsaWRlc0dyaWQubGVuZ3RoICE9PSBwcmV2aW91c1NsaWRlc0dyaWRMZW5ndGgpIHtcbiAgICBzd2lwZXIuZW1pdCgnc2xpZGVzR3JpZExlbmd0aENoYW5nZScpO1xuICB9XG4gIGlmIChwYXJhbXMud2F0Y2hTbGlkZXNQcm9ncmVzcykge1xuICAgIHN3aXBlci51cGRhdGVTbGlkZXNPZmZzZXQoKTtcbiAgfVxuICBzd2lwZXIuZW1pdCgnc2xpZGVzVXBkYXRlZCcpO1xuICBpZiAoIWlzVmlydHVhbCAmJiAhcGFyYW1zLmNzc01vZGUgJiYgKHBhcmFtcy5lZmZlY3QgPT09ICdzbGlkZScgfHwgcGFyYW1zLmVmZmVjdCA9PT0gJ2ZhZGUnKSkge1xuICAgIGNvbnN0IGJhY2tGYWNlSGlkZGVuQ2xhc3MgPSBgJHtwYXJhbXMuY29udGFpbmVyTW9kaWZpZXJDbGFzc31iYWNrZmFjZS1oaWRkZW5gO1xuICAgIGNvbnN0IGhhc0NsYXNzQmFja2ZhY2VDbGFzc0FkZGVkID0gc3dpcGVyLmVsLmNsYXNzTGlzdC5jb250YWlucyhiYWNrRmFjZUhpZGRlbkNsYXNzKTtcbiAgICBpZiAoc2xpZGVzTGVuZ3RoIDw9IHBhcmFtcy5tYXhCYWNrZmFjZUhpZGRlblNsaWRlcykge1xuICAgICAgaWYgKCFoYXNDbGFzc0JhY2tmYWNlQ2xhc3NBZGRlZCkgc3dpcGVyLmVsLmNsYXNzTGlzdC5hZGQoYmFja0ZhY2VIaWRkZW5DbGFzcyk7XG4gICAgfSBlbHNlIGlmIChoYXNDbGFzc0JhY2tmYWNlQ2xhc3NBZGRlZCkge1xuICAgICAgc3dpcGVyLmVsLmNsYXNzTGlzdC5yZW1vdmUoYmFja0ZhY2VIaWRkZW5DbGFzcyk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUF1dG9IZWlnaHQoc3BlZWQpIHtcbiAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgY29uc3QgYWN0aXZlU2xpZGVzID0gW107XG4gIGNvbnN0IGlzVmlydHVhbCA9IHN3aXBlci52aXJ0dWFsICYmIHN3aXBlci5wYXJhbXMudmlydHVhbC5lbmFibGVkO1xuICBsZXQgbmV3SGVpZ2h0ID0gMDtcbiAgbGV0IGk7XG4gIGlmICh0eXBlb2Ygc3BlZWQgPT09ICdudW1iZXInKSB7XG4gICAgc3dpcGVyLnNldFRyYW5zaXRpb24oc3BlZWQpO1xuICB9IGVsc2UgaWYgKHNwZWVkID09PSB0cnVlKSB7XG4gICAgc3dpcGVyLnNldFRyYW5zaXRpb24oc3dpcGVyLnBhcmFtcy5zcGVlZCk7XG4gIH1cbiAgY29uc3QgZ2V0U2xpZGVCeUluZGV4ID0gaW5kZXggPT4ge1xuICAgIGlmIChpc1ZpcnR1YWwpIHtcbiAgICAgIHJldHVybiBzd2lwZXIuc2xpZGVzW3N3aXBlci5nZXRTbGlkZUluZGV4QnlEYXRhKGluZGV4KV07XG4gICAgfVxuICAgIHJldHVybiBzd2lwZXIuc2xpZGVzW2luZGV4XTtcbiAgfTtcbiAgLy8gRmluZCBzbGlkZXMgY3VycmVudGx5IGluIHZpZXdcbiAgaWYgKHN3aXBlci5wYXJhbXMuc2xpZGVzUGVyVmlldyAhPT0gJ2F1dG8nICYmIHN3aXBlci5wYXJhbXMuc2xpZGVzUGVyVmlldyA+IDEpIHtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5jZW50ZXJlZFNsaWRlcykge1xuICAgICAgKHN3aXBlci52aXNpYmxlU2xpZGVzIHx8IFtdKS5mb3JFYWNoKHNsaWRlID0+IHtcbiAgICAgICAgYWN0aXZlU2xpZGVzLnB1c2goc2xpZGUpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBNYXRoLmNlaWwoc3dpcGVyLnBhcmFtcy5zbGlkZXNQZXJWaWV3KTsgaSArPSAxKSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gc3dpcGVyLmFjdGl2ZUluZGV4ICsgaTtcbiAgICAgICAgaWYgKGluZGV4ID4gc3dpcGVyLnNsaWRlcy5sZW5ndGggJiYgIWlzVmlydHVhbCkgYnJlYWs7XG4gICAgICAgIGFjdGl2ZVNsaWRlcy5wdXNoKGdldFNsaWRlQnlJbmRleChpbmRleCkpO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBhY3RpdmVTbGlkZXMucHVzaChnZXRTbGlkZUJ5SW5kZXgoc3dpcGVyLmFjdGl2ZUluZGV4KSk7XG4gIH1cblxuICAvLyBGaW5kIG5ldyBoZWlnaHQgZnJvbSBoaWdoZXN0IHNsaWRlIGluIHZpZXdcbiAgZm9yIChpID0gMDsgaSA8IGFjdGl2ZVNsaWRlcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgIGlmICh0eXBlb2YgYWN0aXZlU2xpZGVzW2ldICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc3QgaGVpZ2h0ID0gYWN0aXZlU2xpZGVzW2ldLm9mZnNldEhlaWdodDtcbiAgICAgIG5ld0hlaWdodCA9IGhlaWdodCA+IG5ld0hlaWdodCA/IGhlaWdodCA6IG5ld0hlaWdodDtcbiAgICB9XG4gIH1cblxuICAvLyBVcGRhdGUgSGVpZ2h0XG4gIGlmIChuZXdIZWlnaHQgfHwgbmV3SGVpZ2h0ID09PSAwKSBzd2lwZXIud3JhcHBlckVsLnN0eWxlLmhlaWdodCA9IGAke25ld0hlaWdodH1weGA7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVNsaWRlc09mZnNldCgpIHtcbiAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgY29uc3Qgc2xpZGVzID0gc3dpcGVyLnNsaWRlcztcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gIGNvbnN0IG1pbnVzT2Zmc2V0ID0gc3dpcGVyLmlzRWxlbWVudCA/IHN3aXBlci5pc0hvcml6b250YWwoKSA/IHN3aXBlci53cmFwcGVyRWwub2Zmc2V0TGVmdCA6IHN3aXBlci53cmFwcGVyRWwub2Zmc2V0VG9wIDogMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzbGlkZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICBzbGlkZXNbaV0uc3dpcGVyU2xpZGVPZmZzZXQgPSAoc3dpcGVyLmlzSG9yaXpvbnRhbCgpID8gc2xpZGVzW2ldLm9mZnNldExlZnQgOiBzbGlkZXNbaV0ub2Zmc2V0VG9wKSAtIG1pbnVzT2Zmc2V0IC0gc3dpcGVyLmNzc092ZXJmbG93QWRqdXN0bWVudCgpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVNsaWRlc1Byb2dyZXNzKHRyYW5zbGF0ZSkge1xuICBpZiAodHJhbnNsYXRlID09PSB2b2lkIDApIHtcbiAgICB0cmFuc2xhdGUgPSB0aGlzICYmIHRoaXMudHJhbnNsYXRlIHx8IDA7XG4gIH1cbiAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgY29uc3QgcGFyYW1zID0gc3dpcGVyLnBhcmFtcztcbiAgY29uc3Qge1xuICAgIHNsaWRlcyxcbiAgICBydGxUcmFuc2xhdGU6IHJ0bCxcbiAgICBzbmFwR3JpZFxuICB9ID0gc3dpcGVyO1xuICBpZiAoc2xpZGVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICBpZiAodHlwZW9mIHNsaWRlc1swXS5zd2lwZXJTbGlkZU9mZnNldCA9PT0gJ3VuZGVmaW5lZCcpIHN3aXBlci51cGRhdGVTbGlkZXNPZmZzZXQoKTtcbiAgbGV0IG9mZnNldENlbnRlciA9IC10cmFuc2xhdGU7XG4gIGlmIChydGwpIG9mZnNldENlbnRlciA9IHRyYW5zbGF0ZTtcblxuICAvLyBWaXNpYmxlIFNsaWRlc1xuICBzbGlkZXMuZm9yRWFjaChzbGlkZUVsID0+IHtcbiAgICBzbGlkZUVsLmNsYXNzTGlzdC5yZW1vdmUocGFyYW1zLnNsaWRlVmlzaWJsZUNsYXNzLCBwYXJhbXMuc2xpZGVGdWxseVZpc2libGVDbGFzcyk7XG4gIH0pO1xuICBzd2lwZXIudmlzaWJsZVNsaWRlc0luZGV4ZXMgPSBbXTtcbiAgc3dpcGVyLnZpc2libGVTbGlkZXMgPSBbXTtcbiAgbGV0IHNwYWNlQmV0d2VlbiA9IHBhcmFtcy5zcGFjZUJldHdlZW47XG4gIGlmICh0eXBlb2Ygc3BhY2VCZXR3ZWVuID09PSAnc3RyaW5nJyAmJiBzcGFjZUJldHdlZW4uaW5kZXhPZignJScpID49IDApIHtcbiAgICBzcGFjZUJldHdlZW4gPSBwYXJzZUZsb2F0KHNwYWNlQmV0d2Vlbi5yZXBsYWNlKCclJywgJycpKSAvIDEwMCAqIHN3aXBlci5zaXplO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBzcGFjZUJldHdlZW4gPT09ICdzdHJpbmcnKSB7XG4gICAgc3BhY2VCZXR3ZWVuID0gcGFyc2VGbG9hdChzcGFjZUJldHdlZW4pO1xuICB9XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc2xpZGVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgY29uc3Qgc2xpZGUgPSBzbGlkZXNbaV07XG4gICAgbGV0IHNsaWRlT2Zmc2V0ID0gc2xpZGUuc3dpcGVyU2xpZGVPZmZzZXQ7XG4gICAgaWYgKHBhcmFtcy5jc3NNb2RlICYmIHBhcmFtcy5jZW50ZXJlZFNsaWRlcykge1xuICAgICAgc2xpZGVPZmZzZXQgLT0gc2xpZGVzWzBdLnN3aXBlclNsaWRlT2Zmc2V0O1xuICAgIH1cbiAgICBjb25zdCBzbGlkZVByb2dyZXNzID0gKG9mZnNldENlbnRlciArIChwYXJhbXMuY2VudGVyZWRTbGlkZXMgPyBzd2lwZXIubWluVHJhbnNsYXRlKCkgOiAwKSAtIHNsaWRlT2Zmc2V0KSAvIChzbGlkZS5zd2lwZXJTbGlkZVNpemUgKyBzcGFjZUJldHdlZW4pO1xuICAgIGNvbnN0IG9yaWdpbmFsU2xpZGVQcm9ncmVzcyA9IChvZmZzZXRDZW50ZXIgLSBzbmFwR3JpZFswXSArIChwYXJhbXMuY2VudGVyZWRTbGlkZXMgPyBzd2lwZXIubWluVHJhbnNsYXRlKCkgOiAwKSAtIHNsaWRlT2Zmc2V0KSAvIChzbGlkZS5zd2lwZXJTbGlkZVNpemUgKyBzcGFjZUJldHdlZW4pO1xuICAgIGNvbnN0IHNsaWRlQmVmb3JlID0gLShvZmZzZXRDZW50ZXIgLSBzbGlkZU9mZnNldCk7XG4gICAgY29uc3Qgc2xpZGVBZnRlciA9IHNsaWRlQmVmb3JlICsgc3dpcGVyLnNsaWRlc1NpemVzR3JpZFtpXTtcbiAgICBjb25zdCBpc0Z1bGx5VmlzaWJsZSA9IHNsaWRlQmVmb3JlID49IDAgJiYgc2xpZGVCZWZvcmUgPD0gc3dpcGVyLnNpemUgLSBzd2lwZXIuc2xpZGVzU2l6ZXNHcmlkW2ldO1xuICAgIGNvbnN0IGlzVmlzaWJsZSA9IHNsaWRlQmVmb3JlID49IDAgJiYgc2xpZGVCZWZvcmUgPCBzd2lwZXIuc2l6ZSAtIDEgfHwgc2xpZGVBZnRlciA+IDEgJiYgc2xpZGVBZnRlciA8PSBzd2lwZXIuc2l6ZSB8fCBzbGlkZUJlZm9yZSA8PSAwICYmIHNsaWRlQWZ0ZXIgPj0gc3dpcGVyLnNpemU7XG4gICAgaWYgKGlzVmlzaWJsZSkge1xuICAgICAgc3dpcGVyLnZpc2libGVTbGlkZXMucHVzaChzbGlkZSk7XG4gICAgICBzd2lwZXIudmlzaWJsZVNsaWRlc0luZGV4ZXMucHVzaChpKTtcbiAgICAgIHNsaWRlc1tpXS5jbGFzc0xpc3QuYWRkKHBhcmFtcy5zbGlkZVZpc2libGVDbGFzcyk7XG4gICAgfVxuICAgIGlmIChpc0Z1bGx5VmlzaWJsZSkge1xuICAgICAgc2xpZGVzW2ldLmNsYXNzTGlzdC5hZGQocGFyYW1zLnNsaWRlRnVsbHlWaXNpYmxlQ2xhc3MpO1xuICAgIH1cbiAgICBzbGlkZS5wcm9ncmVzcyA9IHJ0bCA/IC1zbGlkZVByb2dyZXNzIDogc2xpZGVQcm9ncmVzcztcbiAgICBzbGlkZS5vcmlnaW5hbFByb2dyZXNzID0gcnRsID8gLW9yaWdpbmFsU2xpZGVQcm9ncmVzcyA6IG9yaWdpbmFsU2xpZGVQcm9ncmVzcztcbiAgfVxufVxuXG5mdW5jdGlvbiB1cGRhdGVQcm9ncmVzcyh0cmFuc2xhdGUpIHtcbiAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgaWYgKHR5cGVvZiB0cmFuc2xhdGUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgY29uc3QgbXVsdGlwbGllciA9IHN3aXBlci5ydGxUcmFuc2xhdGUgPyAtMSA6IDE7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgdHJhbnNsYXRlID0gc3dpcGVyICYmIHN3aXBlci50cmFuc2xhdGUgJiYgc3dpcGVyLnRyYW5zbGF0ZSAqIG11bHRpcGxpZXIgfHwgMDtcbiAgfVxuICBjb25zdCBwYXJhbXMgPSBzd2lwZXIucGFyYW1zO1xuICBjb25zdCB0cmFuc2xhdGVzRGlmZiA9IHN3aXBlci5tYXhUcmFuc2xhdGUoKSAtIHN3aXBlci5taW5UcmFuc2xhdGUoKTtcbiAgbGV0IHtcbiAgICBwcm9ncmVzcyxcbiAgICBpc0JlZ2lubmluZyxcbiAgICBpc0VuZCxcbiAgICBwcm9ncmVzc0xvb3BcbiAgfSA9IHN3aXBlcjtcbiAgY29uc3Qgd2FzQmVnaW5uaW5nID0gaXNCZWdpbm5pbmc7XG4gIGNvbnN0IHdhc0VuZCA9IGlzRW5kO1xuICBpZiAodHJhbnNsYXRlc0RpZmYgPT09IDApIHtcbiAgICBwcm9ncmVzcyA9IDA7XG4gICAgaXNCZWdpbm5pbmcgPSB0cnVlO1xuICAgIGlzRW5kID0gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICBwcm9ncmVzcyA9ICh0cmFuc2xhdGUgLSBzd2lwZXIubWluVHJhbnNsYXRlKCkpIC8gdHJhbnNsYXRlc0RpZmY7XG4gICAgY29uc3QgaXNCZWdpbm5pbmdSb3VuZGVkID0gTWF0aC5hYnModHJhbnNsYXRlIC0gc3dpcGVyLm1pblRyYW5zbGF0ZSgpKSA8IDE7XG4gICAgY29uc3QgaXNFbmRSb3VuZGVkID0gTWF0aC5hYnModHJhbnNsYXRlIC0gc3dpcGVyLm1heFRyYW5zbGF0ZSgpKSA8IDE7XG4gICAgaXNCZWdpbm5pbmcgPSBpc0JlZ2lubmluZ1JvdW5kZWQgfHwgcHJvZ3Jlc3MgPD0gMDtcbiAgICBpc0VuZCA9IGlzRW5kUm91bmRlZCB8fCBwcm9ncmVzcyA+PSAxO1xuICAgIGlmIChpc0JlZ2lubmluZ1JvdW5kZWQpIHByb2dyZXNzID0gMDtcbiAgICBpZiAoaXNFbmRSb3VuZGVkKSBwcm9ncmVzcyA9IDE7XG4gIH1cbiAgaWYgKHBhcmFtcy5sb29wKSB7XG4gICAgY29uc3QgZmlyc3RTbGlkZUluZGV4ID0gc3dpcGVyLmdldFNsaWRlSW5kZXhCeURhdGEoMCk7XG4gICAgY29uc3QgbGFzdFNsaWRlSW5kZXggPSBzd2lwZXIuZ2V0U2xpZGVJbmRleEJ5RGF0YShzd2lwZXIuc2xpZGVzLmxlbmd0aCAtIDEpO1xuICAgIGNvbnN0IGZpcnN0U2xpZGVUcmFuc2xhdGUgPSBzd2lwZXIuc2xpZGVzR3JpZFtmaXJzdFNsaWRlSW5kZXhdO1xuICAgIGNvbnN0IGxhc3RTbGlkZVRyYW5zbGF0ZSA9IHN3aXBlci5zbGlkZXNHcmlkW2xhc3RTbGlkZUluZGV4XTtcbiAgICBjb25zdCB0cmFuc2xhdGVNYXggPSBzd2lwZXIuc2xpZGVzR3JpZFtzd2lwZXIuc2xpZGVzR3JpZC5sZW5ndGggLSAxXTtcbiAgICBjb25zdCB0cmFuc2xhdGVBYnMgPSBNYXRoLmFicyh0cmFuc2xhdGUpO1xuICAgIGlmICh0cmFuc2xhdGVBYnMgPj0gZmlyc3RTbGlkZVRyYW5zbGF0ZSkge1xuICAgICAgcHJvZ3Jlc3NMb29wID0gKHRyYW5zbGF0ZUFicyAtIGZpcnN0U2xpZGVUcmFuc2xhdGUpIC8gdHJhbnNsYXRlTWF4O1xuICAgIH0gZWxzZSB7XG4gICAgICBwcm9ncmVzc0xvb3AgPSAodHJhbnNsYXRlQWJzICsgdHJhbnNsYXRlTWF4IC0gbGFzdFNsaWRlVHJhbnNsYXRlKSAvIHRyYW5zbGF0ZU1heDtcbiAgICB9XG4gICAgaWYgKHByb2dyZXNzTG9vcCA+IDEpIHByb2dyZXNzTG9vcCAtPSAxO1xuICB9XG4gIE9iamVjdC5hc3NpZ24oc3dpcGVyLCB7XG4gICAgcHJvZ3Jlc3MsXG4gICAgcHJvZ3Jlc3NMb29wLFxuICAgIGlzQmVnaW5uaW5nLFxuICAgIGlzRW5kXG4gIH0pO1xuICBpZiAocGFyYW1zLndhdGNoU2xpZGVzUHJvZ3Jlc3MgfHwgcGFyYW1zLmNlbnRlcmVkU2xpZGVzICYmIHBhcmFtcy5hdXRvSGVpZ2h0KSBzd2lwZXIudXBkYXRlU2xpZGVzUHJvZ3Jlc3ModHJhbnNsYXRlKTtcbiAgaWYgKGlzQmVnaW5uaW5nICYmICF3YXNCZWdpbm5pbmcpIHtcbiAgICBzd2lwZXIuZW1pdCgncmVhY2hCZWdpbm5pbmcgdG9FZGdlJyk7XG4gIH1cbiAgaWYgKGlzRW5kICYmICF3YXNFbmQpIHtcbiAgICBzd2lwZXIuZW1pdCgncmVhY2hFbmQgdG9FZGdlJyk7XG4gIH1cbiAgaWYgKHdhc0JlZ2lubmluZyAmJiAhaXNCZWdpbm5pbmcgfHwgd2FzRW5kICYmICFpc0VuZCkge1xuICAgIHN3aXBlci5lbWl0KCdmcm9tRWRnZScpO1xuICB9XG4gIHN3aXBlci5lbWl0KCdwcm9ncmVzcycsIHByb2dyZXNzKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlU2xpZGVzQ2xhc3NlcygpIHtcbiAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgY29uc3Qge1xuICAgIHNsaWRlcyxcbiAgICBwYXJhbXMsXG4gICAgc2xpZGVzRWwsXG4gICAgYWN0aXZlSW5kZXhcbiAgfSA9IHN3aXBlcjtcbiAgY29uc3QgaXNWaXJ0dWFsID0gc3dpcGVyLnZpcnR1YWwgJiYgcGFyYW1zLnZpcnR1YWwuZW5hYmxlZDtcbiAgY29uc3QgZ3JpZEVuYWJsZWQgPSBzd2lwZXIuZ3JpZCAmJiBwYXJhbXMuZ3JpZCAmJiBwYXJhbXMuZ3JpZC5yb3dzID4gMTtcbiAgY29uc3QgZ2V0RmlsdGVyZWRTbGlkZSA9IHNlbGVjdG9yID0+IHtcbiAgICByZXR1cm4gZWxlbWVudENoaWxkcmVuKHNsaWRlc0VsLCBgLiR7cGFyYW1zLnNsaWRlQ2xhc3N9JHtzZWxlY3Rvcn0sIHN3aXBlci1zbGlkZSR7c2VsZWN0b3J9YClbMF07XG4gIH07XG4gIHNsaWRlcy5mb3JFYWNoKHNsaWRlRWwgPT4ge1xuICAgIHNsaWRlRWwuY2xhc3NMaXN0LnJlbW92ZShwYXJhbXMuc2xpZGVBY3RpdmVDbGFzcywgcGFyYW1zLnNsaWRlTmV4dENsYXNzLCBwYXJhbXMuc2xpZGVQcmV2Q2xhc3MpO1xuICB9KTtcbiAgbGV0IGFjdGl2ZVNsaWRlO1xuICBsZXQgcHJldlNsaWRlO1xuICBsZXQgbmV4dFNsaWRlO1xuICBpZiAoaXNWaXJ0dWFsKSB7XG4gICAgaWYgKHBhcmFtcy5sb29wKSB7XG4gICAgICBsZXQgc2xpZGVJbmRleCA9IGFjdGl2ZUluZGV4IC0gc3dpcGVyLnZpcnR1YWwuc2xpZGVzQmVmb3JlO1xuICAgICAgaWYgKHNsaWRlSW5kZXggPCAwKSBzbGlkZUluZGV4ID0gc3dpcGVyLnZpcnR1YWwuc2xpZGVzLmxlbmd0aCArIHNsaWRlSW5kZXg7XG4gICAgICBpZiAoc2xpZGVJbmRleCA+PSBzd2lwZXIudmlydHVhbC5zbGlkZXMubGVuZ3RoKSBzbGlkZUluZGV4IC09IHN3aXBlci52aXJ0dWFsLnNsaWRlcy5sZW5ndGg7XG4gICAgICBhY3RpdmVTbGlkZSA9IGdldEZpbHRlcmVkU2xpZGUoYFtkYXRhLXN3aXBlci1zbGlkZS1pbmRleD1cIiR7c2xpZGVJbmRleH1cIl1gKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYWN0aXZlU2xpZGUgPSBnZXRGaWx0ZXJlZFNsaWRlKGBbZGF0YS1zd2lwZXItc2xpZGUtaW5kZXg9XCIke2FjdGl2ZUluZGV4fVwiXWApO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoZ3JpZEVuYWJsZWQpIHtcbiAgICAgIGFjdGl2ZVNsaWRlID0gc2xpZGVzLmZpbHRlcihzbGlkZUVsID0+IHNsaWRlRWwuY29sdW1uID09PSBhY3RpdmVJbmRleClbMF07XG4gICAgICBuZXh0U2xpZGUgPSBzbGlkZXMuZmlsdGVyKHNsaWRlRWwgPT4gc2xpZGVFbC5jb2x1bW4gPT09IGFjdGl2ZUluZGV4ICsgMSlbMF07XG4gICAgICBwcmV2U2xpZGUgPSBzbGlkZXMuZmlsdGVyKHNsaWRlRWwgPT4gc2xpZGVFbC5jb2x1bW4gPT09IGFjdGl2ZUluZGV4IC0gMSlbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGFjdGl2ZVNsaWRlID0gc2xpZGVzW2FjdGl2ZUluZGV4XTtcbiAgICB9XG4gIH1cbiAgaWYgKGFjdGl2ZVNsaWRlKSB7XG4gICAgLy8gQWN0aXZlIGNsYXNzZXNcbiAgICBhY3RpdmVTbGlkZS5jbGFzc0xpc3QuYWRkKHBhcmFtcy5zbGlkZUFjdGl2ZUNsYXNzKTtcbiAgICBpZiAoZ3JpZEVuYWJsZWQpIHtcbiAgICAgIGlmIChuZXh0U2xpZGUpIHtcbiAgICAgICAgbmV4dFNsaWRlLmNsYXNzTGlzdC5hZGQocGFyYW1zLnNsaWRlTmV4dENsYXNzKTtcbiAgICAgIH1cbiAgICAgIGlmIChwcmV2U2xpZGUpIHtcbiAgICAgICAgcHJldlNsaWRlLmNsYXNzTGlzdC5hZGQocGFyYW1zLnNsaWRlUHJldkNsYXNzKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gTmV4dCBTbGlkZVxuICAgICAgbmV4dFNsaWRlID0gZWxlbWVudE5leHRBbGwoYWN0aXZlU2xpZGUsIGAuJHtwYXJhbXMuc2xpZGVDbGFzc30sIHN3aXBlci1zbGlkZWApWzBdO1xuICAgICAgaWYgKHBhcmFtcy5sb29wICYmICFuZXh0U2xpZGUpIHtcbiAgICAgICAgbmV4dFNsaWRlID0gc2xpZGVzWzBdO1xuICAgICAgfVxuICAgICAgaWYgKG5leHRTbGlkZSkge1xuICAgICAgICBuZXh0U2xpZGUuY2xhc3NMaXN0LmFkZChwYXJhbXMuc2xpZGVOZXh0Q2xhc3MpO1xuICAgICAgfVxuXG4gICAgICAvLyBQcmV2IFNsaWRlXG4gICAgICBwcmV2U2xpZGUgPSBlbGVtZW50UHJldkFsbChhY3RpdmVTbGlkZSwgYC4ke3BhcmFtcy5zbGlkZUNsYXNzfSwgc3dpcGVyLXNsaWRlYClbMF07XG4gICAgICBpZiAocGFyYW1zLmxvb3AgJiYgIXByZXZTbGlkZSA9PT0gMCkge1xuICAgICAgICBwcmV2U2xpZGUgPSBzbGlkZXNbc2xpZGVzLmxlbmd0aCAtIDFdO1xuICAgICAgfVxuICAgICAgaWYgKHByZXZTbGlkZSkge1xuICAgICAgICBwcmV2U2xpZGUuY2xhc3NMaXN0LmFkZChwYXJhbXMuc2xpZGVQcmV2Q2xhc3MpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBzd2lwZXIuZW1pdFNsaWRlc0NsYXNzZXMoKTtcbn1cblxuY29uc3QgcHJvY2Vzc0xhenlQcmVsb2FkZXIgPSAoc3dpcGVyLCBpbWFnZUVsKSA9PiB7XG4gIGlmICghc3dpcGVyIHx8IHN3aXBlci5kZXN0cm95ZWQgfHwgIXN3aXBlci5wYXJhbXMpIHJldHVybjtcbiAgY29uc3Qgc2xpZGVTZWxlY3RvciA9ICgpID0+IHN3aXBlci5pc0VsZW1lbnQgPyBgc3dpcGVyLXNsaWRlYCA6IGAuJHtzd2lwZXIucGFyYW1zLnNsaWRlQ2xhc3N9YDtcbiAgY29uc3Qgc2xpZGVFbCA9IGltYWdlRWwuY2xvc2VzdChzbGlkZVNlbGVjdG9yKCkpO1xuICBpZiAoc2xpZGVFbCkge1xuICAgIGxldCBsYXp5RWwgPSBzbGlkZUVsLnF1ZXJ5U2VsZWN0b3IoYC4ke3N3aXBlci5wYXJhbXMubGF6eVByZWxvYWRlckNsYXNzfWApO1xuICAgIGlmICghbGF6eUVsICYmIHN3aXBlci5pc0VsZW1lbnQpIHtcbiAgICAgIGlmIChzbGlkZUVsLnNoYWRvd1Jvb3QpIHtcbiAgICAgICAgbGF6eUVsID0gc2xpZGVFbC5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3IoYC4ke3N3aXBlci5wYXJhbXMubGF6eVByZWxvYWRlckNsYXNzfWApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gaW5pdCBsYXRlclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgIGlmIChzbGlkZUVsLnNoYWRvd1Jvb3QpIHtcbiAgICAgICAgICAgIGxhenlFbCA9IHNsaWRlRWwuc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yKGAuJHtzd2lwZXIucGFyYW1zLmxhenlQcmVsb2FkZXJDbGFzc31gKTtcbiAgICAgICAgICAgIGlmIChsYXp5RWwpIGxhenlFbC5yZW1vdmUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAobGF6eUVsKSBsYXp5RWwucmVtb3ZlKCk7XG4gIH1cbn07XG5jb25zdCB1bmxhenkgPSAoc3dpcGVyLCBpbmRleCkgPT4ge1xuICBpZiAoIXN3aXBlci5zbGlkZXNbaW5kZXhdKSByZXR1cm47XG4gIGNvbnN0IGltYWdlRWwgPSBzd2lwZXIuc2xpZGVzW2luZGV4XS5xdWVyeVNlbGVjdG9yKCdbbG9hZGluZz1cImxhenlcIl0nKTtcbiAgaWYgKGltYWdlRWwpIGltYWdlRWwucmVtb3ZlQXR0cmlidXRlKCdsb2FkaW5nJyk7XG59O1xuY29uc3QgcHJlbG9hZCA9IHN3aXBlciA9PiB7XG4gIGlmICghc3dpcGVyIHx8IHN3aXBlci5kZXN0cm95ZWQgfHwgIXN3aXBlci5wYXJhbXMpIHJldHVybjtcbiAgbGV0IGFtb3VudCA9IHN3aXBlci5wYXJhbXMubGF6eVByZWxvYWRQcmV2TmV4dDtcbiAgY29uc3QgbGVuID0gc3dpcGVyLnNsaWRlcy5sZW5ndGg7XG4gIGlmICghbGVuIHx8ICFhbW91bnQgfHwgYW1vdW50IDwgMCkgcmV0dXJuO1xuICBhbW91bnQgPSBNYXRoLm1pbihhbW91bnQsIGxlbik7XG4gIGNvbnN0IHNsaWRlc1BlclZpZXcgPSBzd2lwZXIucGFyYW1zLnNsaWRlc1BlclZpZXcgPT09ICdhdXRvJyA/IHN3aXBlci5zbGlkZXNQZXJWaWV3RHluYW1pYygpIDogTWF0aC5jZWlsKHN3aXBlci5wYXJhbXMuc2xpZGVzUGVyVmlldyk7XG4gIGNvbnN0IGFjdGl2ZUluZGV4ID0gc3dpcGVyLmFjdGl2ZUluZGV4O1xuICBpZiAoc3dpcGVyLnBhcmFtcy5ncmlkICYmIHN3aXBlci5wYXJhbXMuZ3JpZC5yb3dzID4gMSkge1xuICAgIGNvbnN0IGFjdGl2ZUNvbHVtbiA9IGFjdGl2ZUluZGV4O1xuICAgIGNvbnN0IHByZWxvYWRDb2x1bW5zID0gW2FjdGl2ZUNvbHVtbiAtIGFtb3VudF07XG4gICAgcHJlbG9hZENvbHVtbnMucHVzaCguLi5BcnJheS5mcm9tKHtcbiAgICAgIGxlbmd0aDogYW1vdW50XG4gICAgfSkubWFwKChfLCBpKSA9PiB7XG4gICAgICByZXR1cm4gYWN0aXZlQ29sdW1uICsgc2xpZGVzUGVyVmlldyArIGk7XG4gICAgfSkpO1xuICAgIHN3aXBlci5zbGlkZXMuZm9yRWFjaCgoc2xpZGVFbCwgaSkgPT4ge1xuICAgICAgaWYgKHByZWxvYWRDb2x1bW5zLmluY2x1ZGVzKHNsaWRlRWwuY29sdW1uKSkgdW5sYXp5KHN3aXBlciwgaSk7XG4gICAgfSk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IHNsaWRlSW5kZXhMYXN0SW5WaWV3ID0gYWN0aXZlSW5kZXggKyBzbGlkZXNQZXJWaWV3IC0gMTtcbiAgaWYgKHN3aXBlci5wYXJhbXMucmV3aW5kIHx8IHN3aXBlci5wYXJhbXMubG9vcCkge1xuICAgIGZvciAobGV0IGkgPSBhY3RpdmVJbmRleCAtIGFtb3VudDsgaSA8PSBzbGlkZUluZGV4TGFzdEluVmlldyArIGFtb3VudDsgaSArPSAxKSB7XG4gICAgICBjb25zdCByZWFsSW5kZXggPSAoaSAlIGxlbiArIGxlbikgJSBsZW47XG4gICAgICBpZiAocmVhbEluZGV4IDwgYWN0aXZlSW5kZXggfHwgcmVhbEluZGV4ID4gc2xpZGVJbmRleExhc3RJblZpZXcpIHVubGF6eShzd2lwZXIsIHJlYWxJbmRleCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGZvciAobGV0IGkgPSBNYXRoLm1heChhY3RpdmVJbmRleCAtIGFtb3VudCwgMCk7IGkgPD0gTWF0aC5taW4oc2xpZGVJbmRleExhc3RJblZpZXcgKyBhbW91bnQsIGxlbiAtIDEpOyBpICs9IDEpIHtcbiAgICAgIGlmIChpICE9PSBhY3RpdmVJbmRleCAmJiAoaSA+IHNsaWRlSW5kZXhMYXN0SW5WaWV3IHx8IGkgPCBhY3RpdmVJbmRleCkpIHtcbiAgICAgICAgdW5sYXp5KHN3aXBlciwgaSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5mdW5jdGlvbiBnZXRBY3RpdmVJbmRleEJ5VHJhbnNsYXRlKHN3aXBlcikge1xuICBjb25zdCB7XG4gICAgc2xpZGVzR3JpZCxcbiAgICBwYXJhbXNcbiAgfSA9IHN3aXBlcjtcbiAgY29uc3QgdHJhbnNsYXRlID0gc3dpcGVyLnJ0bFRyYW5zbGF0ZSA/IHN3aXBlci50cmFuc2xhdGUgOiAtc3dpcGVyLnRyYW5zbGF0ZTtcbiAgbGV0IGFjdGl2ZUluZGV4O1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHNsaWRlc0dyaWQubGVuZ3RoOyBpICs9IDEpIHtcbiAgICBpZiAodHlwZW9mIHNsaWRlc0dyaWRbaSArIDFdICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgaWYgKHRyYW5zbGF0ZSA+PSBzbGlkZXNHcmlkW2ldICYmIHRyYW5zbGF0ZSA8IHNsaWRlc0dyaWRbaSArIDFdIC0gKHNsaWRlc0dyaWRbaSArIDFdIC0gc2xpZGVzR3JpZFtpXSkgLyAyKSB7XG4gICAgICAgIGFjdGl2ZUluZGV4ID0gaTtcbiAgICAgIH0gZWxzZSBpZiAodHJhbnNsYXRlID49IHNsaWRlc0dyaWRbaV0gJiYgdHJhbnNsYXRlIDwgc2xpZGVzR3JpZFtpICsgMV0pIHtcbiAgICAgICAgYWN0aXZlSW5kZXggPSBpICsgMTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRyYW5zbGF0ZSA+PSBzbGlkZXNHcmlkW2ldKSB7XG4gICAgICBhY3RpdmVJbmRleCA9IGk7XG4gICAgfVxuICB9XG4gIC8vIE5vcm1hbGl6ZSBzbGlkZUluZGV4XG4gIGlmIChwYXJhbXMubm9ybWFsaXplU2xpZGVJbmRleCkge1xuICAgIGlmIChhY3RpdmVJbmRleCA8IDAgfHwgdHlwZW9mIGFjdGl2ZUluZGV4ID09PSAndW5kZWZpbmVkJykgYWN0aXZlSW5kZXggPSAwO1xuICB9XG4gIHJldHVybiBhY3RpdmVJbmRleDtcbn1cbmZ1bmN0aW9uIHVwZGF0ZUFjdGl2ZUluZGV4KG5ld0FjdGl2ZUluZGV4KSB7XG4gIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gIGNvbnN0IHRyYW5zbGF0ZSA9IHN3aXBlci5ydGxUcmFuc2xhdGUgPyBzd2lwZXIudHJhbnNsYXRlIDogLXN3aXBlci50cmFuc2xhdGU7XG4gIGNvbnN0IHtcbiAgICBzbmFwR3JpZCxcbiAgICBwYXJhbXMsXG4gICAgYWN0aXZlSW5kZXg6IHByZXZpb3VzSW5kZXgsXG4gICAgcmVhbEluZGV4OiBwcmV2aW91c1JlYWxJbmRleCxcbiAgICBzbmFwSW5kZXg6IHByZXZpb3VzU25hcEluZGV4XG4gIH0gPSBzd2lwZXI7XG4gIGxldCBhY3RpdmVJbmRleCA9IG5ld0FjdGl2ZUluZGV4O1xuICBsZXQgc25hcEluZGV4O1xuICBjb25zdCBnZXRWaXJ0dWFsUmVhbEluZGV4ID0gYUluZGV4ID0+IHtcbiAgICBsZXQgcmVhbEluZGV4ID0gYUluZGV4IC0gc3dpcGVyLnZpcnR1YWwuc2xpZGVzQmVmb3JlO1xuICAgIGlmIChyZWFsSW5kZXggPCAwKSB7XG4gICAgICByZWFsSW5kZXggPSBzd2lwZXIudmlydHVhbC5zbGlkZXMubGVuZ3RoICsgcmVhbEluZGV4O1xuICAgIH1cbiAgICBpZiAocmVhbEluZGV4ID49IHN3aXBlci52aXJ0dWFsLnNsaWRlcy5sZW5ndGgpIHtcbiAgICAgIHJlYWxJbmRleCAtPSBzd2lwZXIudmlydHVhbC5zbGlkZXMubGVuZ3RoO1xuICAgIH1cbiAgICByZXR1cm4gcmVhbEluZGV4O1xuICB9O1xuICBpZiAodHlwZW9mIGFjdGl2ZUluZGV4ID09PSAndW5kZWZpbmVkJykge1xuICAgIGFjdGl2ZUluZGV4ID0gZ2V0QWN0aXZlSW5kZXhCeVRyYW5zbGF0ZShzd2lwZXIpO1xuICB9XG4gIGlmIChzbmFwR3JpZC5pbmRleE9mKHRyYW5zbGF0ZSkgPj0gMCkge1xuICAgIHNuYXBJbmRleCA9IHNuYXBHcmlkLmluZGV4T2YodHJhbnNsYXRlKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBza2lwID0gTWF0aC5taW4ocGFyYW1zLnNsaWRlc1Blckdyb3VwU2tpcCwgYWN0aXZlSW5kZXgpO1xuICAgIHNuYXBJbmRleCA9IHNraXAgKyBNYXRoLmZsb29yKChhY3RpdmVJbmRleCAtIHNraXApIC8gcGFyYW1zLnNsaWRlc1Blckdyb3VwKTtcbiAgfVxuICBpZiAoc25hcEluZGV4ID49IHNuYXBHcmlkLmxlbmd0aCkgc25hcEluZGV4ID0gc25hcEdyaWQubGVuZ3RoIC0gMTtcbiAgaWYgKGFjdGl2ZUluZGV4ID09PSBwcmV2aW91c0luZGV4ICYmICFzd2lwZXIucGFyYW1zLmxvb3ApIHtcbiAgICBpZiAoc25hcEluZGV4ICE9PSBwcmV2aW91c1NuYXBJbmRleCkge1xuICAgICAgc3dpcGVyLnNuYXBJbmRleCA9IHNuYXBJbmRleDtcbiAgICAgIHN3aXBlci5lbWl0KCdzbmFwSW5kZXhDaGFuZ2UnKTtcbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChhY3RpdmVJbmRleCA9PT0gcHJldmlvdXNJbmRleCAmJiBzd2lwZXIucGFyYW1zLmxvb3AgJiYgc3dpcGVyLnZpcnR1YWwgJiYgc3dpcGVyLnBhcmFtcy52aXJ0dWFsLmVuYWJsZWQpIHtcbiAgICBzd2lwZXIucmVhbEluZGV4ID0gZ2V0VmlydHVhbFJlYWxJbmRleChhY3RpdmVJbmRleCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IGdyaWRFbmFibGVkID0gc3dpcGVyLmdyaWQgJiYgcGFyYW1zLmdyaWQgJiYgcGFyYW1zLmdyaWQucm93cyA+IDE7XG5cbiAgLy8gR2V0IHJlYWwgaW5kZXhcbiAgbGV0IHJlYWxJbmRleDtcbiAgaWYgKHN3aXBlci52aXJ0dWFsICYmIHBhcmFtcy52aXJ0dWFsLmVuYWJsZWQgJiYgcGFyYW1zLmxvb3ApIHtcbiAgICByZWFsSW5kZXggPSBnZXRWaXJ0dWFsUmVhbEluZGV4KGFjdGl2ZUluZGV4KTtcbiAgfSBlbHNlIGlmIChncmlkRW5hYmxlZCkge1xuICAgIGNvbnN0IGZpcnN0U2xpZGVJbkNvbHVtbiA9IHN3aXBlci5zbGlkZXMuZmlsdGVyKHNsaWRlRWwgPT4gc2xpZGVFbC5jb2x1bW4gPT09IGFjdGl2ZUluZGV4KVswXTtcbiAgICBsZXQgYWN0aXZlU2xpZGVJbmRleCA9IHBhcnNlSW50KGZpcnN0U2xpZGVJbkNvbHVtbi5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3dpcGVyLXNsaWRlLWluZGV4JyksIDEwKTtcbiAgICBpZiAoTnVtYmVyLmlzTmFOKGFjdGl2ZVNsaWRlSW5kZXgpKSB7XG4gICAgICBhY3RpdmVTbGlkZUluZGV4ID0gTWF0aC5tYXgoc3dpcGVyLnNsaWRlcy5pbmRleE9mKGZpcnN0U2xpZGVJbkNvbHVtbiksIDApO1xuICAgIH1cbiAgICByZWFsSW5kZXggPSBNYXRoLmZsb29yKGFjdGl2ZVNsaWRlSW5kZXggLyBwYXJhbXMuZ3JpZC5yb3dzKTtcbiAgfSBlbHNlIGlmIChzd2lwZXIuc2xpZGVzW2FjdGl2ZUluZGV4XSkge1xuICAgIGNvbnN0IHNsaWRlSW5kZXggPSBzd2lwZXIuc2xpZGVzW2FjdGl2ZUluZGV4XS5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3dpcGVyLXNsaWRlLWluZGV4Jyk7XG4gICAgaWYgKHNsaWRlSW5kZXgpIHtcbiAgICAgIHJlYWxJbmRleCA9IHBhcnNlSW50KHNsaWRlSW5kZXgsIDEwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVhbEluZGV4ID0gYWN0aXZlSW5kZXg7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJlYWxJbmRleCA9IGFjdGl2ZUluZGV4O1xuICB9XG4gIE9iamVjdC5hc3NpZ24oc3dpcGVyLCB7XG4gICAgcHJldmlvdXNTbmFwSW5kZXgsXG4gICAgc25hcEluZGV4LFxuICAgIHByZXZpb3VzUmVhbEluZGV4LFxuICAgIHJlYWxJbmRleCxcbiAgICBwcmV2aW91c0luZGV4LFxuICAgIGFjdGl2ZUluZGV4XG4gIH0pO1xuICBpZiAoc3dpcGVyLmluaXRpYWxpemVkKSB7XG4gICAgcHJlbG9hZChzd2lwZXIpO1xuICB9XG4gIHN3aXBlci5lbWl0KCdhY3RpdmVJbmRleENoYW5nZScpO1xuICBzd2lwZXIuZW1pdCgnc25hcEluZGV4Q2hhbmdlJyk7XG4gIGlmIChzd2lwZXIuaW5pdGlhbGl6ZWQgfHwgc3dpcGVyLnBhcmFtcy5ydW5DYWxsYmFja3NPbkluaXQpIHtcbiAgICBpZiAocHJldmlvdXNSZWFsSW5kZXggIT09IHJlYWxJbmRleCkge1xuICAgICAgc3dpcGVyLmVtaXQoJ3JlYWxJbmRleENoYW5nZScpO1xuICAgIH1cbiAgICBzd2lwZXIuZW1pdCgnc2xpZGVDaGFuZ2UnKTtcbiAgfVxufVxuXG5mdW5jdGlvbiB1cGRhdGVDbGlja2VkU2xpZGUoZWwsIHBhdGgpIHtcbiAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgY29uc3QgcGFyYW1zID0gc3dpcGVyLnBhcmFtcztcbiAgbGV0IHNsaWRlID0gZWwuY2xvc2VzdChgLiR7cGFyYW1zLnNsaWRlQ2xhc3N9LCBzd2lwZXItc2xpZGVgKTtcbiAgaWYgKCFzbGlkZSAmJiBzd2lwZXIuaXNFbGVtZW50ICYmIHBhdGggJiYgcGF0aC5sZW5ndGggPiAxICYmIHBhdGguaW5jbHVkZXMoZWwpKSB7XG4gICAgWy4uLnBhdGguc2xpY2UocGF0aC5pbmRleE9mKGVsKSArIDEsIHBhdGgubGVuZ3RoKV0uZm9yRWFjaChwYXRoRWwgPT4ge1xuICAgICAgaWYgKCFzbGlkZSAmJiBwYXRoRWwubWF0Y2hlcyAmJiBwYXRoRWwubWF0Y2hlcyhgLiR7cGFyYW1zLnNsaWRlQ2xhc3N9LCBzd2lwZXItc2xpZGVgKSkge1xuICAgICAgICBzbGlkZSA9IHBhdGhFbDtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBsZXQgc2xpZGVGb3VuZCA9IGZhbHNlO1xuICBsZXQgc2xpZGVJbmRleDtcbiAgaWYgKHNsaWRlKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzd2lwZXIuc2xpZGVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBpZiAoc3dpcGVyLnNsaWRlc1tpXSA9PT0gc2xpZGUpIHtcbiAgICAgICAgc2xpZGVGb3VuZCA9IHRydWU7XG4gICAgICAgIHNsaWRlSW5kZXggPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKHNsaWRlICYmIHNsaWRlRm91bmQpIHtcbiAgICBzd2lwZXIuY2xpY2tlZFNsaWRlID0gc2xpZGU7XG4gICAgaWYgKHN3aXBlci52aXJ0dWFsICYmIHN3aXBlci5wYXJhbXMudmlydHVhbC5lbmFibGVkKSB7XG4gICAgICBzd2lwZXIuY2xpY2tlZEluZGV4ID0gcGFyc2VJbnQoc2xpZGUuZ2V0QXR0cmlidXRlKCdkYXRhLXN3aXBlci1zbGlkZS1pbmRleCcpLCAxMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN3aXBlci5jbGlja2VkSW5kZXggPSBzbGlkZUluZGV4O1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBzd2lwZXIuY2xpY2tlZFNsaWRlID0gdW5kZWZpbmVkO1xuICAgIHN3aXBlci5jbGlja2VkSW5kZXggPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChwYXJhbXMuc2xpZGVUb0NsaWNrZWRTbGlkZSAmJiBzd2lwZXIuY2xpY2tlZEluZGV4ICE9PSB1bmRlZmluZWQgJiYgc3dpcGVyLmNsaWNrZWRJbmRleCAhPT0gc3dpcGVyLmFjdGl2ZUluZGV4KSB7XG4gICAgc3dpcGVyLnNsaWRlVG9DbGlja2VkU2xpZGUoKTtcbiAgfVxufVxuXG52YXIgdXBkYXRlID0ge1xuICB1cGRhdGVTaXplLFxuICB1cGRhdGVTbGlkZXMsXG4gIHVwZGF0ZUF1dG9IZWlnaHQsXG4gIHVwZGF0ZVNsaWRlc09mZnNldCxcbiAgdXBkYXRlU2xpZGVzUHJvZ3Jlc3MsXG4gIHVwZGF0ZVByb2dyZXNzLFxuICB1cGRhdGVTbGlkZXNDbGFzc2VzLFxuICB1cGRhdGVBY3RpdmVJbmRleCxcbiAgdXBkYXRlQ2xpY2tlZFNsaWRlXG59O1xuXG5mdW5jdGlvbiBnZXRTd2lwZXJUcmFuc2xhdGUoYXhpcykge1xuICBpZiAoYXhpcyA9PT0gdm9pZCAwKSB7XG4gICAgYXhpcyA9IHRoaXMuaXNIb3Jpem9udGFsKCkgPyAneCcgOiAneSc7XG4gIH1cbiAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgY29uc3Qge1xuICAgIHBhcmFtcyxcbiAgICBydGxUcmFuc2xhdGU6IHJ0bCxcbiAgICB0cmFuc2xhdGUsXG4gICAgd3JhcHBlckVsXG4gIH0gPSBzd2lwZXI7XG4gIGlmIChwYXJhbXMudmlydHVhbFRyYW5zbGF0ZSkge1xuICAgIHJldHVybiBydGwgPyAtdHJhbnNsYXRlIDogdHJhbnNsYXRlO1xuICB9XG4gIGlmIChwYXJhbXMuY3NzTW9kZSkge1xuICAgIHJldHVybiB0cmFuc2xhdGU7XG4gIH1cbiAgbGV0IGN1cnJlbnRUcmFuc2xhdGUgPSBnZXRUcmFuc2xhdGUod3JhcHBlckVsLCBheGlzKTtcbiAgY3VycmVudFRyYW5zbGF0ZSArPSBzd2lwZXIuY3NzT3ZlcmZsb3dBZGp1c3RtZW50KCk7XG4gIGlmIChydGwpIGN1cnJlbnRUcmFuc2xhdGUgPSAtY3VycmVudFRyYW5zbGF0ZTtcbiAgcmV0dXJuIGN1cnJlbnRUcmFuc2xhdGUgfHwgMDtcbn1cblxuZnVuY3Rpb24gc2V0VHJhbnNsYXRlKHRyYW5zbGF0ZSwgYnlDb250cm9sbGVyKSB7XG4gIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gIGNvbnN0IHtcbiAgICBydGxUcmFuc2xhdGU6IHJ0bCxcbiAgICBwYXJhbXMsXG4gICAgd3JhcHBlckVsLFxuICAgIHByb2dyZXNzXG4gIH0gPSBzd2lwZXI7XG4gIGxldCB4ID0gMDtcbiAgbGV0IHkgPSAwO1xuICBjb25zdCB6ID0gMDtcbiAgaWYgKHN3aXBlci5pc0hvcml6b250YWwoKSkge1xuICAgIHggPSBydGwgPyAtdHJhbnNsYXRlIDogdHJhbnNsYXRlO1xuICB9IGVsc2Uge1xuICAgIHkgPSB0cmFuc2xhdGU7XG4gIH1cbiAgaWYgKHBhcmFtcy5yb3VuZExlbmd0aHMpIHtcbiAgICB4ID0gTWF0aC5mbG9vcih4KTtcbiAgICB5ID0gTWF0aC5mbG9vcih5KTtcbiAgfVxuICBzd2lwZXIucHJldmlvdXNUcmFuc2xhdGUgPSBzd2lwZXIudHJhbnNsYXRlO1xuICBzd2lwZXIudHJhbnNsYXRlID0gc3dpcGVyLmlzSG9yaXpvbnRhbCgpID8geCA6IHk7XG4gIGlmIChwYXJhbXMuY3NzTW9kZSkge1xuICAgIHdyYXBwZXJFbFtzd2lwZXIuaXNIb3Jpem9udGFsKCkgPyAnc2Nyb2xsTGVmdCcgOiAnc2Nyb2xsVG9wJ10gPSBzd2lwZXIuaXNIb3Jpem9udGFsKCkgPyAteCA6IC15O1xuICB9IGVsc2UgaWYgKCFwYXJhbXMudmlydHVhbFRyYW5zbGF0ZSkge1xuICAgIGlmIChzd2lwZXIuaXNIb3Jpem9udGFsKCkpIHtcbiAgICAgIHggLT0gc3dpcGVyLmNzc092ZXJmbG93QWRqdXN0bWVudCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB5IC09IHN3aXBlci5jc3NPdmVyZmxvd0FkanVzdG1lbnQoKTtcbiAgICB9XG4gICAgd3JhcHBlckVsLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUzZCgke3h9cHgsICR7eX1weCwgJHt6fXB4KWA7XG4gIH1cblxuICAvLyBDaGVjayBpZiB3ZSBuZWVkIHRvIHVwZGF0ZSBwcm9ncmVzc1xuICBsZXQgbmV3UHJvZ3Jlc3M7XG4gIGNvbnN0IHRyYW5zbGF0ZXNEaWZmID0gc3dpcGVyLm1heFRyYW5zbGF0ZSgpIC0gc3dpcGVyLm1pblRyYW5zbGF0ZSgpO1xuICBpZiAodHJhbnNsYXRlc0RpZmYgPT09IDApIHtcbiAgICBuZXdQcm9ncmVzcyA9IDA7XG4gIH0gZWxzZSB7XG4gICAgbmV3UHJvZ3Jlc3MgPSAodHJhbnNsYXRlIC0gc3dpcGVyLm1pblRyYW5zbGF0ZSgpKSAvIHRyYW5zbGF0ZXNEaWZmO1xuICB9XG4gIGlmIChuZXdQcm9ncmVzcyAhPT0gcHJvZ3Jlc3MpIHtcbiAgICBzd2lwZXIudXBkYXRlUHJvZ3Jlc3ModHJhbnNsYXRlKTtcbiAgfVxuICBzd2lwZXIuZW1pdCgnc2V0VHJhbnNsYXRlJywgc3dpcGVyLnRyYW5zbGF0ZSwgYnlDb250cm9sbGVyKTtcbn1cblxuZnVuY3Rpb24gbWluVHJhbnNsYXRlKCkge1xuICByZXR1cm4gLXRoaXMuc25hcEdyaWRbMF07XG59XG5cbmZ1bmN0aW9uIG1heFRyYW5zbGF0ZSgpIHtcbiAgcmV0dXJuIC10aGlzLnNuYXBHcmlkW3RoaXMuc25hcEdyaWQubGVuZ3RoIC0gMV07XG59XG5cbmZ1bmN0aW9uIHRyYW5zbGF0ZVRvKHRyYW5zbGF0ZSwgc3BlZWQsIHJ1bkNhbGxiYWNrcywgdHJhbnNsYXRlQm91bmRzLCBpbnRlcm5hbCkge1xuICBpZiAodHJhbnNsYXRlID09PSB2b2lkIDApIHtcbiAgICB0cmFuc2xhdGUgPSAwO1xuICB9XG4gIGlmIChzcGVlZCA9PT0gdm9pZCAwKSB7XG4gICAgc3BlZWQgPSB0aGlzLnBhcmFtcy5zcGVlZDtcbiAgfVxuICBpZiAocnVuQ2FsbGJhY2tzID09PSB2b2lkIDApIHtcbiAgICBydW5DYWxsYmFja3MgPSB0cnVlO1xuICB9XG4gIGlmICh0cmFuc2xhdGVCb3VuZHMgPT09IHZvaWQgMCkge1xuICAgIHRyYW5zbGF0ZUJvdW5kcyA9IHRydWU7XG4gIH1cbiAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgY29uc3Qge1xuICAgIHBhcmFtcyxcbiAgICB3cmFwcGVyRWxcbiAgfSA9IHN3aXBlcjtcbiAgaWYgKHN3aXBlci5hbmltYXRpbmcgJiYgcGFyYW1zLnByZXZlbnRJbnRlcmFjdGlvbk9uVHJhbnNpdGlvbikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBjb25zdCBtaW5UcmFuc2xhdGUgPSBzd2lwZXIubWluVHJhbnNsYXRlKCk7XG4gIGNvbnN0IG1heFRyYW5zbGF0ZSA9IHN3aXBlci5tYXhUcmFuc2xhdGUoKTtcbiAgbGV0IG5ld1RyYW5zbGF0ZTtcbiAgaWYgKHRyYW5zbGF0ZUJvdW5kcyAmJiB0cmFuc2xhdGUgPiBtaW5UcmFuc2xhdGUpIG5ld1RyYW5zbGF0ZSA9IG1pblRyYW5zbGF0ZTtlbHNlIGlmICh0cmFuc2xhdGVCb3VuZHMgJiYgdHJhbnNsYXRlIDwgbWF4VHJhbnNsYXRlKSBuZXdUcmFuc2xhdGUgPSBtYXhUcmFuc2xhdGU7ZWxzZSBuZXdUcmFuc2xhdGUgPSB0cmFuc2xhdGU7XG5cbiAgLy8gVXBkYXRlIHByb2dyZXNzXG4gIHN3aXBlci51cGRhdGVQcm9ncmVzcyhuZXdUcmFuc2xhdGUpO1xuICBpZiAocGFyYW1zLmNzc01vZGUpIHtcbiAgICBjb25zdCBpc0ggPSBzd2lwZXIuaXNIb3Jpem9udGFsKCk7XG4gICAgaWYgKHNwZWVkID09PSAwKSB7XG4gICAgICB3cmFwcGVyRWxbaXNIID8gJ3Njcm9sbExlZnQnIDogJ3Njcm9sbFRvcCddID0gLW5ld1RyYW5zbGF0ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFzd2lwZXIuc3VwcG9ydC5zbW9vdGhTY3JvbGwpIHtcbiAgICAgICAgYW5pbWF0ZUNTU01vZGVTY3JvbGwoe1xuICAgICAgICAgIHN3aXBlcixcbiAgICAgICAgICB0YXJnZXRQb3NpdGlvbjogLW5ld1RyYW5zbGF0ZSxcbiAgICAgICAgICBzaWRlOiBpc0ggPyAnbGVmdCcgOiAndG9wJ1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICB3cmFwcGVyRWwuc2Nyb2xsVG8oe1xuICAgICAgICBbaXNIID8gJ2xlZnQnIDogJ3RvcCddOiAtbmV3VHJhbnNsYXRlLFxuICAgICAgICBiZWhhdmlvcjogJ3Ntb290aCdcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAoc3BlZWQgPT09IDApIHtcbiAgICBzd2lwZXIuc2V0VHJhbnNpdGlvbigwKTtcbiAgICBzd2lwZXIuc2V0VHJhbnNsYXRlKG5ld1RyYW5zbGF0ZSk7XG4gICAgaWYgKHJ1bkNhbGxiYWNrcykge1xuICAgICAgc3dpcGVyLmVtaXQoJ2JlZm9yZVRyYW5zaXRpb25TdGFydCcsIHNwZWVkLCBpbnRlcm5hbCk7XG4gICAgICBzd2lwZXIuZW1pdCgndHJhbnNpdGlvbkVuZCcpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBzd2lwZXIuc2V0VHJhbnNpdGlvbihzcGVlZCk7XG4gICAgc3dpcGVyLnNldFRyYW5zbGF0ZShuZXdUcmFuc2xhdGUpO1xuICAgIGlmIChydW5DYWxsYmFja3MpIHtcbiAgICAgIHN3aXBlci5lbWl0KCdiZWZvcmVUcmFuc2l0aW9uU3RhcnQnLCBzcGVlZCwgaW50ZXJuYWwpO1xuICAgICAgc3dpcGVyLmVtaXQoJ3RyYW5zaXRpb25TdGFydCcpO1xuICAgIH1cbiAgICBpZiAoIXN3aXBlci5hbmltYXRpbmcpIHtcbiAgICAgIHN3aXBlci5hbmltYXRpbmcgPSB0cnVlO1xuICAgICAgaWYgKCFzd2lwZXIub25UcmFuc2xhdGVUb1dyYXBwZXJUcmFuc2l0aW9uRW5kKSB7XG4gICAgICAgIHN3aXBlci5vblRyYW5zbGF0ZVRvV3JhcHBlclRyYW5zaXRpb25FbmQgPSBmdW5jdGlvbiB0cmFuc2l0aW9uRW5kKGUpIHtcbiAgICAgICAgICBpZiAoIXN3aXBlciB8fCBzd2lwZXIuZGVzdHJveWVkKSByZXR1cm47XG4gICAgICAgICAgaWYgKGUudGFyZ2V0ICE9PSB0aGlzKSByZXR1cm47XG4gICAgICAgICAgc3dpcGVyLndyYXBwZXJFbC5yZW1vdmVFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgc3dpcGVyLm9uVHJhbnNsYXRlVG9XcmFwcGVyVHJhbnNpdGlvbkVuZCk7XG4gICAgICAgICAgc3dpcGVyLm9uVHJhbnNsYXRlVG9XcmFwcGVyVHJhbnNpdGlvbkVuZCA9IG51bGw7XG4gICAgICAgICAgZGVsZXRlIHN3aXBlci5vblRyYW5zbGF0ZVRvV3JhcHBlclRyYW5zaXRpb25FbmQ7XG4gICAgICAgICAgaWYgKHJ1bkNhbGxiYWNrcykge1xuICAgICAgICAgICAgc3dpcGVyLmVtaXQoJ3RyYW5zaXRpb25FbmQnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBzd2lwZXIud3JhcHBlckVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCBzd2lwZXIub25UcmFuc2xhdGVUb1dyYXBwZXJUcmFuc2l0aW9uRW5kKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbnZhciB0cmFuc2xhdGUgPSB7XG4gIGdldFRyYW5zbGF0ZTogZ2V0U3dpcGVyVHJhbnNsYXRlLFxuICBzZXRUcmFuc2xhdGUsXG4gIG1pblRyYW5zbGF0ZSxcbiAgbWF4VHJhbnNsYXRlLFxuICB0cmFuc2xhdGVUb1xufTtcblxuZnVuY3Rpb24gc2V0VHJhbnNpdGlvbihkdXJhdGlvbiwgYnlDb250cm9sbGVyKSB7XG4gIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gIGlmICghc3dpcGVyLnBhcmFtcy5jc3NNb2RlKSB7XG4gICAgc3dpcGVyLndyYXBwZXJFbC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSBgJHtkdXJhdGlvbn1tc2A7XG4gICAgc3dpcGVyLndyYXBwZXJFbC5zdHlsZS50cmFuc2l0aW9uRGVsYXkgPSBkdXJhdGlvbiA9PT0gMCA/IGAwbXNgIDogJyc7XG4gIH1cbiAgc3dpcGVyLmVtaXQoJ3NldFRyYW5zaXRpb24nLCBkdXJhdGlvbiwgYnlDb250cm9sbGVyKTtcbn1cblxuZnVuY3Rpb24gdHJhbnNpdGlvbkVtaXQoX3JlZikge1xuICBsZXQge1xuICAgIHN3aXBlcixcbiAgICBydW5DYWxsYmFja3MsXG4gICAgZGlyZWN0aW9uLFxuICAgIHN0ZXBcbiAgfSA9IF9yZWY7XG4gIGNvbnN0IHtcbiAgICBhY3RpdmVJbmRleCxcbiAgICBwcmV2aW91c0luZGV4XG4gIH0gPSBzd2lwZXI7XG4gIGxldCBkaXIgPSBkaXJlY3Rpb247XG4gIGlmICghZGlyKSB7XG4gICAgaWYgKGFjdGl2ZUluZGV4ID4gcHJldmlvdXNJbmRleCkgZGlyID0gJ25leHQnO2Vsc2UgaWYgKGFjdGl2ZUluZGV4IDwgcHJldmlvdXNJbmRleCkgZGlyID0gJ3ByZXYnO2Vsc2UgZGlyID0gJ3Jlc2V0JztcbiAgfVxuICBzd2lwZXIuZW1pdChgdHJhbnNpdGlvbiR7c3RlcH1gKTtcbiAgaWYgKHJ1bkNhbGxiYWNrcyAmJiBhY3RpdmVJbmRleCAhPT0gcHJldmlvdXNJbmRleCkge1xuICAgIGlmIChkaXIgPT09ICdyZXNldCcpIHtcbiAgICAgIHN3aXBlci5lbWl0KGBzbGlkZVJlc2V0VHJhbnNpdGlvbiR7c3RlcH1gKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc3dpcGVyLmVtaXQoYHNsaWRlQ2hhbmdlVHJhbnNpdGlvbiR7c3RlcH1gKTtcbiAgICBpZiAoZGlyID09PSAnbmV4dCcpIHtcbiAgICAgIHN3aXBlci5lbWl0KGBzbGlkZU5leHRUcmFuc2l0aW9uJHtzdGVwfWApO1xuICAgIH0gZWxzZSB7XG4gICAgICBzd2lwZXIuZW1pdChgc2xpZGVQcmV2VHJhbnNpdGlvbiR7c3RlcH1gKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gdHJhbnNpdGlvblN0YXJ0KHJ1bkNhbGxiYWNrcywgZGlyZWN0aW9uKSB7XG4gIGlmIChydW5DYWxsYmFja3MgPT09IHZvaWQgMCkge1xuICAgIHJ1bkNhbGxiYWNrcyA9IHRydWU7XG4gIH1cbiAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgY29uc3Qge1xuICAgIHBhcmFtc1xuICB9ID0gc3dpcGVyO1xuICBpZiAocGFyYW1zLmNzc01vZGUpIHJldHVybjtcbiAgaWYgKHBhcmFtcy5hdXRvSGVpZ2h0KSB7XG4gICAgc3dpcGVyLnVwZGF0ZUF1dG9IZWlnaHQoKTtcbiAgfVxuICB0cmFuc2l0aW9uRW1pdCh7XG4gICAgc3dpcGVyLFxuICAgIHJ1bkNhbGxiYWNrcyxcbiAgICBkaXJlY3Rpb24sXG4gICAgc3RlcDogJ1N0YXJ0J1xuICB9KTtcbn1cblxuZnVuY3Rpb24gdHJhbnNpdGlvbkVuZChydW5DYWxsYmFja3MsIGRpcmVjdGlvbikge1xuICBpZiAocnVuQ2FsbGJhY2tzID09PSB2b2lkIDApIHtcbiAgICBydW5DYWxsYmFja3MgPSB0cnVlO1xuICB9XG4gIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gIGNvbnN0IHtcbiAgICBwYXJhbXNcbiAgfSA9IHN3aXBlcjtcbiAgc3dpcGVyLmFuaW1hdGluZyA9IGZhbHNlO1xuICBpZiAocGFyYW1zLmNzc01vZGUpIHJldHVybjtcbiAgc3dpcGVyLnNldFRyYW5zaXRpb24oMCk7XG4gIHRyYW5zaXRpb25FbWl0KHtcbiAgICBzd2lwZXIsXG4gICAgcnVuQ2FsbGJhY2tzLFxuICAgIGRpcmVjdGlvbixcbiAgICBzdGVwOiAnRW5kJ1xuICB9KTtcbn1cblxudmFyIHRyYW5zaXRpb24gPSB7XG4gIHNldFRyYW5zaXRpb24sXG4gIHRyYW5zaXRpb25TdGFydCxcbiAgdHJhbnNpdGlvbkVuZFxufTtcblxuZnVuY3Rpb24gc2xpZGVUbyhpbmRleCwgc3BlZWQsIHJ1bkNhbGxiYWNrcywgaW50ZXJuYWwsIGluaXRpYWwpIHtcbiAgaWYgKGluZGV4ID09PSB2b2lkIDApIHtcbiAgICBpbmRleCA9IDA7XG4gIH1cbiAgaWYgKHNwZWVkID09PSB2b2lkIDApIHtcbiAgICBzcGVlZCA9IHRoaXMucGFyYW1zLnNwZWVkO1xuICB9XG4gIGlmIChydW5DYWxsYmFja3MgPT09IHZvaWQgMCkge1xuICAgIHJ1bkNhbGxiYWNrcyA9IHRydWU7XG4gIH1cbiAgaWYgKHR5cGVvZiBpbmRleCA9PT0gJ3N0cmluZycpIHtcbiAgICBpbmRleCA9IHBhcnNlSW50KGluZGV4LCAxMCk7XG4gIH1cbiAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgbGV0IHNsaWRlSW5kZXggPSBpbmRleDtcbiAgaWYgKHNsaWRlSW5kZXggPCAwKSBzbGlkZUluZGV4ID0gMDtcbiAgY29uc3Qge1xuICAgIHBhcmFtcyxcbiAgICBzbmFwR3JpZCxcbiAgICBzbGlkZXNHcmlkLFxuICAgIHByZXZpb3VzSW5kZXgsXG4gICAgYWN0aXZlSW5kZXgsXG4gICAgcnRsVHJhbnNsYXRlOiBydGwsXG4gICAgd3JhcHBlckVsLFxuICAgIGVuYWJsZWRcbiAgfSA9IHN3aXBlcjtcbiAgaWYgKHN3aXBlci5hbmltYXRpbmcgJiYgcGFyYW1zLnByZXZlbnRJbnRlcmFjdGlvbk9uVHJhbnNpdGlvbiB8fCAhZW5hYmxlZCAmJiAhaW50ZXJuYWwgJiYgIWluaXRpYWwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgY29uc3Qgc2tpcCA9IE1hdGgubWluKHN3aXBlci5wYXJhbXMuc2xpZGVzUGVyR3JvdXBTa2lwLCBzbGlkZUluZGV4KTtcbiAgbGV0IHNuYXBJbmRleCA9IHNraXAgKyBNYXRoLmZsb29yKChzbGlkZUluZGV4IC0gc2tpcCkgLyBzd2lwZXIucGFyYW1zLnNsaWRlc1Blckdyb3VwKTtcbiAgaWYgKHNuYXBJbmRleCA+PSBzbmFwR3JpZC5sZW5ndGgpIHNuYXBJbmRleCA9IHNuYXBHcmlkLmxlbmd0aCAtIDE7XG4gIGNvbnN0IHRyYW5zbGF0ZSA9IC1zbmFwR3JpZFtzbmFwSW5kZXhdO1xuICAvLyBOb3JtYWxpemUgc2xpZGVJbmRleFxuICBpZiAocGFyYW1zLm5vcm1hbGl6ZVNsaWRlSW5kZXgpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNsaWRlc0dyaWQubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGNvbnN0IG5vcm1hbGl6ZWRUcmFuc2xhdGUgPSAtTWF0aC5mbG9vcih0cmFuc2xhdGUgKiAxMDApO1xuICAgICAgY29uc3Qgbm9ybWFsaXplZEdyaWQgPSBNYXRoLmZsb29yKHNsaWRlc0dyaWRbaV0gKiAxMDApO1xuICAgICAgY29uc3Qgbm9ybWFsaXplZEdyaWROZXh0ID0gTWF0aC5mbG9vcihzbGlkZXNHcmlkW2kgKyAxXSAqIDEwMCk7XG4gICAgICBpZiAodHlwZW9mIHNsaWRlc0dyaWRbaSArIDFdICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBpZiAobm9ybWFsaXplZFRyYW5zbGF0ZSA+PSBub3JtYWxpemVkR3JpZCAmJiBub3JtYWxpemVkVHJhbnNsYXRlIDwgbm9ybWFsaXplZEdyaWROZXh0IC0gKG5vcm1hbGl6ZWRHcmlkTmV4dCAtIG5vcm1hbGl6ZWRHcmlkKSAvIDIpIHtcbiAgICAgICAgICBzbGlkZUluZGV4ID0gaTtcbiAgICAgICAgfSBlbHNlIGlmIChub3JtYWxpemVkVHJhbnNsYXRlID49IG5vcm1hbGl6ZWRHcmlkICYmIG5vcm1hbGl6ZWRUcmFuc2xhdGUgPCBub3JtYWxpemVkR3JpZE5leHQpIHtcbiAgICAgICAgICBzbGlkZUluZGV4ID0gaSArIDE7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAobm9ybWFsaXplZFRyYW5zbGF0ZSA+PSBub3JtYWxpemVkR3JpZCkge1xuICAgICAgICBzbGlkZUluZGV4ID0gaTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLy8gRGlyZWN0aW9ucyBsb2Nrc1xuICBpZiAoc3dpcGVyLmluaXRpYWxpemVkICYmIHNsaWRlSW5kZXggIT09IGFjdGl2ZUluZGV4KSB7XG4gICAgaWYgKCFzd2lwZXIuYWxsb3dTbGlkZU5leHQgJiYgKHJ0bCA/IHRyYW5zbGF0ZSA+IHN3aXBlci50cmFuc2xhdGUgJiYgdHJhbnNsYXRlID4gc3dpcGVyLm1pblRyYW5zbGF0ZSgpIDogdHJhbnNsYXRlIDwgc3dpcGVyLnRyYW5zbGF0ZSAmJiB0cmFuc2xhdGUgPCBzd2lwZXIubWluVHJhbnNsYXRlKCkpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICghc3dpcGVyLmFsbG93U2xpZGVQcmV2ICYmIHRyYW5zbGF0ZSA+IHN3aXBlci50cmFuc2xhdGUgJiYgdHJhbnNsYXRlID4gc3dpcGVyLm1heFRyYW5zbGF0ZSgpKSB7XG4gICAgICBpZiAoKGFjdGl2ZUluZGV4IHx8IDApICE9PSBzbGlkZUluZGV4KSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKHNsaWRlSW5kZXggIT09IChwcmV2aW91c0luZGV4IHx8IDApICYmIHJ1bkNhbGxiYWNrcykge1xuICAgIHN3aXBlci5lbWl0KCdiZWZvcmVTbGlkZUNoYW5nZVN0YXJ0Jyk7XG4gIH1cblxuICAvLyBVcGRhdGUgcHJvZ3Jlc3NcbiAgc3dpcGVyLnVwZGF0ZVByb2dyZXNzKHRyYW5zbGF0ZSk7XG4gIGxldCBkaXJlY3Rpb247XG4gIGlmIChzbGlkZUluZGV4ID4gYWN0aXZlSW5kZXgpIGRpcmVjdGlvbiA9ICduZXh0JztlbHNlIGlmIChzbGlkZUluZGV4IDwgYWN0aXZlSW5kZXgpIGRpcmVjdGlvbiA9ICdwcmV2JztlbHNlIGRpcmVjdGlvbiA9ICdyZXNldCc7XG5cbiAgLy8gVXBkYXRlIEluZGV4XG4gIGlmIChydGwgJiYgLXRyYW5zbGF0ZSA9PT0gc3dpcGVyLnRyYW5zbGF0ZSB8fCAhcnRsICYmIHRyYW5zbGF0ZSA9PT0gc3dpcGVyLnRyYW5zbGF0ZSkge1xuICAgIHN3aXBlci51cGRhdGVBY3RpdmVJbmRleChzbGlkZUluZGV4KTtcbiAgICAvLyBVcGRhdGUgSGVpZ2h0XG4gICAgaWYgKHBhcmFtcy5hdXRvSGVpZ2h0KSB7XG4gICAgICBzd2lwZXIudXBkYXRlQXV0b0hlaWdodCgpO1xuICAgIH1cbiAgICBzd2lwZXIudXBkYXRlU2xpZGVzQ2xhc3NlcygpO1xuICAgIGlmIChwYXJhbXMuZWZmZWN0ICE9PSAnc2xpZGUnKSB7XG4gICAgICBzd2lwZXIuc2V0VHJhbnNsYXRlKHRyYW5zbGF0ZSk7XG4gICAgfVxuICAgIGlmIChkaXJlY3Rpb24gIT09ICdyZXNldCcpIHtcbiAgICAgIHN3aXBlci50cmFuc2l0aW9uU3RhcnQocnVuQ2FsbGJhY2tzLCBkaXJlY3Rpb24pO1xuICAgICAgc3dpcGVyLnRyYW5zaXRpb25FbmQocnVuQ2FsbGJhY2tzLCBkaXJlY3Rpb24pO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKHBhcmFtcy5jc3NNb2RlKSB7XG4gICAgY29uc3QgaXNIID0gc3dpcGVyLmlzSG9yaXpvbnRhbCgpO1xuICAgIGNvbnN0IHQgPSBydGwgPyB0cmFuc2xhdGUgOiAtdHJhbnNsYXRlO1xuICAgIGlmIChzcGVlZCA9PT0gMCkge1xuICAgICAgY29uc3QgaXNWaXJ0dWFsID0gc3dpcGVyLnZpcnR1YWwgJiYgc3dpcGVyLnBhcmFtcy52aXJ0dWFsLmVuYWJsZWQ7XG4gICAgICBpZiAoaXNWaXJ0dWFsKSB7XG4gICAgICAgIHN3aXBlci53cmFwcGVyRWwuc3R5bGUuc2Nyb2xsU25hcFR5cGUgPSAnbm9uZSc7XG4gICAgICAgIHN3aXBlci5faW1tZWRpYXRlVmlydHVhbCA9IHRydWU7XG4gICAgICB9XG4gICAgICBpZiAoaXNWaXJ0dWFsICYmICFzd2lwZXIuX2Nzc01vZGVWaXJ0dWFsSW5pdGlhbFNldCAmJiBzd2lwZXIucGFyYW1zLmluaXRpYWxTbGlkZSA+IDApIHtcbiAgICAgICAgc3dpcGVyLl9jc3NNb2RlVmlydHVhbEluaXRpYWxTZXQgPSB0cnVlO1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgIHdyYXBwZXJFbFtpc0ggPyAnc2Nyb2xsTGVmdCcgOiAnc2Nyb2xsVG9wJ10gPSB0O1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdyYXBwZXJFbFtpc0ggPyAnc2Nyb2xsTGVmdCcgOiAnc2Nyb2xsVG9wJ10gPSB0O1xuICAgICAgfVxuICAgICAgaWYgKGlzVmlydHVhbCkge1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgIHN3aXBlci53cmFwcGVyRWwuc3R5bGUuc2Nyb2xsU25hcFR5cGUgPSAnJztcbiAgICAgICAgICBzd2lwZXIuX2ltbWVkaWF0ZVZpcnR1YWwgPSBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghc3dpcGVyLnN1cHBvcnQuc21vb3RoU2Nyb2xsKSB7XG4gICAgICAgIGFuaW1hdGVDU1NNb2RlU2Nyb2xsKHtcbiAgICAgICAgICBzd2lwZXIsXG4gICAgICAgICAgdGFyZ2V0UG9zaXRpb246IHQsXG4gICAgICAgICAgc2lkZTogaXNIID8gJ2xlZnQnIDogJ3RvcCdcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgd3JhcHBlckVsLnNjcm9sbFRvKHtcbiAgICAgICAgW2lzSCA/ICdsZWZ0JyA6ICd0b3AnXTogdCxcbiAgICAgICAgYmVoYXZpb3I6ICdzbW9vdGgnXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgc3dpcGVyLnNldFRyYW5zaXRpb24oc3BlZWQpO1xuICBzd2lwZXIuc2V0VHJhbnNsYXRlKHRyYW5zbGF0ZSk7XG4gIHN3aXBlci51cGRhdGVBY3RpdmVJbmRleChzbGlkZUluZGV4KTtcbiAgc3dpcGVyLnVwZGF0ZVNsaWRlc0NsYXNzZXMoKTtcbiAgc3dpcGVyLmVtaXQoJ2JlZm9yZVRyYW5zaXRpb25TdGFydCcsIHNwZWVkLCBpbnRlcm5hbCk7XG4gIHN3aXBlci50cmFuc2l0aW9uU3RhcnQocnVuQ2FsbGJhY2tzLCBkaXJlY3Rpb24pO1xuICBpZiAoc3BlZWQgPT09IDApIHtcbiAgICBzd2lwZXIudHJhbnNpdGlvbkVuZChydW5DYWxsYmFja3MsIGRpcmVjdGlvbik7XG4gIH0gZWxzZSBpZiAoIXN3aXBlci5hbmltYXRpbmcpIHtcbiAgICBzd2lwZXIuYW5pbWF0aW5nID0gdHJ1ZTtcbiAgICBpZiAoIXN3aXBlci5vblNsaWRlVG9XcmFwcGVyVHJhbnNpdGlvbkVuZCkge1xuICAgICAgc3dpcGVyLm9uU2xpZGVUb1dyYXBwZXJUcmFuc2l0aW9uRW5kID0gZnVuY3Rpb24gdHJhbnNpdGlvbkVuZChlKSB7XG4gICAgICAgIGlmICghc3dpcGVyIHx8IHN3aXBlci5kZXN0cm95ZWQpIHJldHVybjtcbiAgICAgICAgaWYgKGUudGFyZ2V0ICE9PSB0aGlzKSByZXR1cm47XG4gICAgICAgIHN3aXBlci53cmFwcGVyRWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIHN3aXBlci5vblNsaWRlVG9XcmFwcGVyVHJhbnNpdGlvbkVuZCk7XG4gICAgICAgIHN3aXBlci5vblNsaWRlVG9XcmFwcGVyVHJhbnNpdGlvbkVuZCA9IG51bGw7XG4gICAgICAgIGRlbGV0ZSBzd2lwZXIub25TbGlkZVRvV3JhcHBlclRyYW5zaXRpb25FbmQ7XG4gICAgICAgIHN3aXBlci50cmFuc2l0aW9uRW5kKHJ1bkNhbGxiYWNrcywgZGlyZWN0aW9uKTtcbiAgICAgIH07XG4gICAgfVxuICAgIHN3aXBlci53cmFwcGVyRWwuYWRkRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIHN3aXBlci5vblNsaWRlVG9XcmFwcGVyVHJhbnNpdGlvbkVuZCk7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIHNsaWRlVG9Mb29wKGluZGV4LCBzcGVlZCwgcnVuQ2FsbGJhY2tzLCBpbnRlcm5hbCkge1xuICBpZiAoaW5kZXggPT09IHZvaWQgMCkge1xuICAgIGluZGV4ID0gMDtcbiAgfVxuICBpZiAoc3BlZWQgPT09IHZvaWQgMCkge1xuICAgIHNwZWVkID0gdGhpcy5wYXJhbXMuc3BlZWQ7XG4gIH1cbiAgaWYgKHJ1bkNhbGxiYWNrcyA9PT0gdm9pZCAwKSB7XG4gICAgcnVuQ2FsbGJhY2tzID0gdHJ1ZTtcbiAgfVxuICBpZiAodHlwZW9mIGluZGV4ID09PSAnc3RyaW5nJykge1xuICAgIGNvbnN0IGluZGV4QXNOdW1iZXIgPSBwYXJzZUludChpbmRleCwgMTApO1xuICAgIGluZGV4ID0gaW5kZXhBc051bWJlcjtcbiAgfVxuICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICBjb25zdCBncmlkRW5hYmxlZCA9IHN3aXBlci5ncmlkICYmIHN3aXBlci5wYXJhbXMuZ3JpZCAmJiBzd2lwZXIucGFyYW1zLmdyaWQucm93cyA+IDE7XG4gIGxldCBuZXdJbmRleCA9IGluZGV4O1xuICBpZiAoc3dpcGVyLnBhcmFtcy5sb29wKSB7XG4gICAgaWYgKHN3aXBlci52aXJ0dWFsICYmIHN3aXBlci5wYXJhbXMudmlydHVhbC5lbmFibGVkKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICAgIG5ld0luZGV4ID0gbmV3SW5kZXggKyBzd2lwZXIudmlydHVhbC5zbGlkZXNCZWZvcmU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCB0YXJnZXRTbGlkZUluZGV4O1xuICAgICAgaWYgKGdyaWRFbmFibGVkKSB7XG4gICAgICAgIGNvbnN0IHNsaWRlSW5kZXggPSBuZXdJbmRleCAqIHN3aXBlci5wYXJhbXMuZ3JpZC5yb3dzO1xuICAgICAgICB0YXJnZXRTbGlkZUluZGV4ID0gc3dpcGVyLnNsaWRlcy5maWx0ZXIoc2xpZGVFbCA9PiBzbGlkZUVsLmdldEF0dHJpYnV0ZSgnZGF0YS1zd2lwZXItc2xpZGUtaW5kZXgnKSAqIDEgPT09IHNsaWRlSW5kZXgpWzBdLmNvbHVtbjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRhcmdldFNsaWRlSW5kZXggPSBzd2lwZXIuZ2V0U2xpZGVJbmRleEJ5RGF0YShuZXdJbmRleCk7XG4gICAgICB9XG4gICAgICBjb25zdCBjb2xzID0gZ3JpZEVuYWJsZWQgPyBNYXRoLmNlaWwoc3dpcGVyLnNsaWRlcy5sZW5ndGggLyBzd2lwZXIucGFyYW1zLmdyaWQucm93cykgOiBzd2lwZXIuc2xpZGVzLmxlbmd0aDtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgY2VudGVyZWRTbGlkZXNcbiAgICAgIH0gPSBzd2lwZXIucGFyYW1zO1xuICAgICAgbGV0IHNsaWRlc1BlclZpZXcgPSBzd2lwZXIucGFyYW1zLnNsaWRlc1BlclZpZXc7XG4gICAgICBpZiAoc2xpZGVzUGVyVmlldyA9PT0gJ2F1dG8nKSB7XG4gICAgICAgIHNsaWRlc1BlclZpZXcgPSBzd2lwZXIuc2xpZGVzUGVyVmlld0R5bmFtaWMoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNsaWRlc1BlclZpZXcgPSBNYXRoLmNlaWwocGFyc2VGbG9hdChzd2lwZXIucGFyYW1zLnNsaWRlc1BlclZpZXcsIDEwKSk7XG4gICAgICAgIGlmIChjZW50ZXJlZFNsaWRlcyAmJiBzbGlkZXNQZXJWaWV3ICUgMiA9PT0gMCkge1xuICAgICAgICAgIHNsaWRlc1BlclZpZXcgPSBzbGlkZXNQZXJWaWV3ICsgMTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGV0IG5lZWRMb29wRml4ID0gY29scyAtIHRhcmdldFNsaWRlSW5kZXggPCBzbGlkZXNQZXJWaWV3O1xuICAgICAgaWYgKGNlbnRlcmVkU2xpZGVzKSB7XG4gICAgICAgIG5lZWRMb29wRml4ID0gbmVlZExvb3BGaXggfHwgdGFyZ2V0U2xpZGVJbmRleCA8IE1hdGguY2VpbChzbGlkZXNQZXJWaWV3IC8gMik7XG4gICAgICB9XG4gICAgICBpZiAobmVlZExvb3BGaXgpIHtcbiAgICAgICAgY29uc3QgZGlyZWN0aW9uID0gY2VudGVyZWRTbGlkZXMgPyB0YXJnZXRTbGlkZUluZGV4IDwgc3dpcGVyLmFjdGl2ZUluZGV4ID8gJ3ByZXYnIDogJ25leHQnIDogdGFyZ2V0U2xpZGVJbmRleCAtIHN3aXBlci5hY3RpdmVJbmRleCAtIDEgPCBzd2lwZXIucGFyYW1zLnNsaWRlc1BlclZpZXcgPyAnbmV4dCcgOiAncHJldic7XG4gICAgICAgIHN3aXBlci5sb29wRml4KHtcbiAgICAgICAgICBkaXJlY3Rpb24sXG4gICAgICAgICAgc2xpZGVUbzogdHJ1ZSxcbiAgICAgICAgICBhY3RpdmVTbGlkZUluZGV4OiBkaXJlY3Rpb24gPT09ICduZXh0JyA/IHRhcmdldFNsaWRlSW5kZXggKyAxIDogdGFyZ2V0U2xpZGVJbmRleCAtIGNvbHMgKyAxLFxuICAgICAgICAgIHNsaWRlUmVhbEluZGV4OiBkaXJlY3Rpb24gPT09ICduZXh0JyA/IHN3aXBlci5yZWFsSW5kZXggOiB1bmRlZmluZWRcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoZ3JpZEVuYWJsZWQpIHtcbiAgICAgICAgY29uc3Qgc2xpZGVJbmRleCA9IG5ld0luZGV4ICogc3dpcGVyLnBhcmFtcy5ncmlkLnJvd3M7XG4gICAgICAgIG5ld0luZGV4ID0gc3dpcGVyLnNsaWRlcy5maWx0ZXIoc2xpZGVFbCA9PiBzbGlkZUVsLmdldEF0dHJpYnV0ZSgnZGF0YS1zd2lwZXItc2xpZGUtaW5kZXgnKSAqIDEgPT09IHNsaWRlSW5kZXgpWzBdLmNvbHVtbjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld0luZGV4ID0gc3dpcGVyLmdldFNsaWRlSW5kZXhCeURhdGEobmV3SW5kZXgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgIHN3aXBlci5zbGlkZVRvKG5ld0luZGV4LCBzcGVlZCwgcnVuQ2FsbGJhY2tzLCBpbnRlcm5hbCk7XG4gIH0pO1xuICByZXR1cm4gc3dpcGVyO1xufVxuXG4vKiBlc2xpbnQgbm8tdW51c2VkLXZhcnM6IFwib2ZmXCIgKi9cbmZ1bmN0aW9uIHNsaWRlTmV4dChzcGVlZCwgcnVuQ2FsbGJhY2tzLCBpbnRlcm5hbCkge1xuICBpZiAoc3BlZWQgPT09IHZvaWQgMCkge1xuICAgIHNwZWVkID0gdGhpcy5wYXJhbXMuc3BlZWQ7XG4gIH1cbiAgaWYgKHJ1bkNhbGxiYWNrcyA9PT0gdm9pZCAwKSB7XG4gICAgcnVuQ2FsbGJhY2tzID0gdHJ1ZTtcbiAgfVxuICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICBjb25zdCB7XG4gICAgZW5hYmxlZCxcbiAgICBwYXJhbXMsXG4gICAgYW5pbWF0aW5nXG4gIH0gPSBzd2lwZXI7XG4gIGlmICghZW5hYmxlZCkgcmV0dXJuIHN3aXBlcjtcbiAgbGV0IHBlckdyb3VwID0gcGFyYW1zLnNsaWRlc1Blckdyb3VwO1xuICBpZiAocGFyYW1zLnNsaWRlc1BlclZpZXcgPT09ICdhdXRvJyAmJiBwYXJhbXMuc2xpZGVzUGVyR3JvdXAgPT09IDEgJiYgcGFyYW1zLnNsaWRlc1Blckdyb3VwQXV0bykge1xuICAgIHBlckdyb3VwID0gTWF0aC5tYXgoc3dpcGVyLnNsaWRlc1BlclZpZXdEeW5hbWljKCdjdXJyZW50JywgdHJ1ZSksIDEpO1xuICB9XG4gIGNvbnN0IGluY3JlbWVudCA9IHN3aXBlci5hY3RpdmVJbmRleCA8IHBhcmFtcy5zbGlkZXNQZXJHcm91cFNraXAgPyAxIDogcGVyR3JvdXA7XG4gIGNvbnN0IGlzVmlydHVhbCA9IHN3aXBlci52aXJ0dWFsICYmIHBhcmFtcy52aXJ0dWFsLmVuYWJsZWQ7XG4gIGlmIChwYXJhbXMubG9vcCkge1xuICAgIGlmIChhbmltYXRpbmcgJiYgIWlzVmlydHVhbCAmJiBwYXJhbXMubG9vcFByZXZlbnRzU2xpZGluZykgcmV0dXJuIGZhbHNlO1xuICAgIHN3aXBlci5sb29wRml4KHtcbiAgICAgIGRpcmVjdGlvbjogJ25leHQnXG4gICAgfSk7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgc3dpcGVyLl9jbGllbnRMZWZ0ID0gc3dpcGVyLndyYXBwZXJFbC5jbGllbnRMZWZ0O1xuICAgIGlmIChzd2lwZXIuYWN0aXZlSW5kZXggPT09IHN3aXBlci5zbGlkZXMubGVuZ3RoIC0gMSAmJiBwYXJhbXMuY3NzTW9kZSkge1xuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgc3dpcGVyLnNsaWRlVG8oc3dpcGVyLmFjdGl2ZUluZGV4ICsgaW5jcmVtZW50LCBzcGVlZCwgcnVuQ2FsbGJhY2tzLCBpbnRlcm5hbCk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICBpZiAocGFyYW1zLnJld2luZCAmJiBzd2lwZXIuaXNFbmQpIHtcbiAgICByZXR1cm4gc3dpcGVyLnNsaWRlVG8oMCwgc3BlZWQsIHJ1bkNhbGxiYWNrcywgaW50ZXJuYWwpO1xuICB9XG4gIHJldHVybiBzd2lwZXIuc2xpZGVUbyhzd2lwZXIuYWN0aXZlSW5kZXggKyBpbmNyZW1lbnQsIHNwZWVkLCBydW5DYWxsYmFja3MsIGludGVybmFsKTtcbn1cblxuLyogZXNsaW50IG5vLXVudXNlZC12YXJzOiBcIm9mZlwiICovXG5mdW5jdGlvbiBzbGlkZVByZXYoc3BlZWQsIHJ1bkNhbGxiYWNrcywgaW50ZXJuYWwpIHtcbiAgaWYgKHNwZWVkID09PSB2b2lkIDApIHtcbiAgICBzcGVlZCA9IHRoaXMucGFyYW1zLnNwZWVkO1xuICB9XG4gIGlmIChydW5DYWxsYmFja3MgPT09IHZvaWQgMCkge1xuICAgIHJ1bkNhbGxiYWNrcyA9IHRydWU7XG4gIH1cbiAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgY29uc3Qge1xuICAgIHBhcmFtcyxcbiAgICBzbmFwR3JpZCxcbiAgICBzbGlkZXNHcmlkLFxuICAgIHJ0bFRyYW5zbGF0ZSxcbiAgICBlbmFibGVkLFxuICAgIGFuaW1hdGluZ1xuICB9ID0gc3dpcGVyO1xuICBpZiAoIWVuYWJsZWQpIHJldHVybiBzd2lwZXI7XG4gIGNvbnN0IGlzVmlydHVhbCA9IHN3aXBlci52aXJ0dWFsICYmIHBhcmFtcy52aXJ0dWFsLmVuYWJsZWQ7XG4gIGlmIChwYXJhbXMubG9vcCkge1xuICAgIGlmIChhbmltYXRpbmcgJiYgIWlzVmlydHVhbCAmJiBwYXJhbXMubG9vcFByZXZlbnRzU2xpZGluZykgcmV0dXJuIGZhbHNlO1xuICAgIHN3aXBlci5sb29wRml4KHtcbiAgICAgIGRpcmVjdGlvbjogJ3ByZXYnXG4gICAgfSk7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgc3dpcGVyLl9jbGllbnRMZWZ0ID0gc3dpcGVyLndyYXBwZXJFbC5jbGllbnRMZWZ0O1xuICB9XG4gIGNvbnN0IHRyYW5zbGF0ZSA9IHJ0bFRyYW5zbGF0ZSA/IHN3aXBlci50cmFuc2xhdGUgOiAtc3dpcGVyLnRyYW5zbGF0ZTtcbiAgZnVuY3Rpb24gbm9ybWFsaXplKHZhbCkge1xuICAgIGlmICh2YWwgPCAwKSByZXR1cm4gLU1hdGguZmxvb3IoTWF0aC5hYnModmFsKSk7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IodmFsKTtcbiAgfVxuICBjb25zdCBub3JtYWxpemVkVHJhbnNsYXRlID0gbm9ybWFsaXplKHRyYW5zbGF0ZSk7XG4gIGNvbnN0IG5vcm1hbGl6ZWRTbmFwR3JpZCA9IHNuYXBHcmlkLm1hcCh2YWwgPT4gbm9ybWFsaXplKHZhbCkpO1xuICBsZXQgcHJldlNuYXAgPSBzbmFwR3JpZFtub3JtYWxpemVkU25hcEdyaWQuaW5kZXhPZihub3JtYWxpemVkVHJhbnNsYXRlKSAtIDFdO1xuICBpZiAodHlwZW9mIHByZXZTbmFwID09PSAndW5kZWZpbmVkJyAmJiBwYXJhbXMuY3NzTW9kZSkge1xuICAgIGxldCBwcmV2U25hcEluZGV4O1xuICAgIHNuYXBHcmlkLmZvckVhY2goKHNuYXAsIHNuYXBJbmRleCkgPT4ge1xuICAgICAgaWYgKG5vcm1hbGl6ZWRUcmFuc2xhdGUgPj0gc25hcCkge1xuICAgICAgICAvLyBwcmV2U25hcCA9IHNuYXA7XG4gICAgICAgIHByZXZTbmFwSW5kZXggPSBzbmFwSW5kZXg7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHR5cGVvZiBwcmV2U25hcEluZGV4ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgcHJldlNuYXAgPSBzbmFwR3JpZFtwcmV2U25hcEluZGV4ID4gMCA/IHByZXZTbmFwSW5kZXggLSAxIDogcHJldlNuYXBJbmRleF07XG4gICAgfVxuICB9XG4gIGxldCBwcmV2SW5kZXggPSAwO1xuICBpZiAodHlwZW9mIHByZXZTbmFwICE9PSAndW5kZWZpbmVkJykge1xuICAgIHByZXZJbmRleCA9IHNsaWRlc0dyaWQuaW5kZXhPZihwcmV2U25hcCk7XG4gICAgaWYgKHByZXZJbmRleCA8IDApIHByZXZJbmRleCA9IHN3aXBlci5hY3RpdmVJbmRleCAtIDE7XG4gICAgaWYgKHBhcmFtcy5zbGlkZXNQZXJWaWV3ID09PSAnYXV0bycgJiYgcGFyYW1zLnNsaWRlc1Blckdyb3VwID09PSAxICYmIHBhcmFtcy5zbGlkZXNQZXJHcm91cEF1dG8pIHtcbiAgICAgIHByZXZJbmRleCA9IHByZXZJbmRleCAtIHN3aXBlci5zbGlkZXNQZXJWaWV3RHluYW1pYygncHJldmlvdXMnLCB0cnVlKSArIDE7XG4gICAgICBwcmV2SW5kZXggPSBNYXRoLm1heChwcmV2SW5kZXgsIDApO1xuICAgIH1cbiAgfVxuICBpZiAocGFyYW1zLnJld2luZCAmJiBzd2lwZXIuaXNCZWdpbm5pbmcpIHtcbiAgICBjb25zdCBsYXN0SW5kZXggPSBzd2lwZXIucGFyYW1zLnZpcnR1YWwgJiYgc3dpcGVyLnBhcmFtcy52aXJ0dWFsLmVuYWJsZWQgJiYgc3dpcGVyLnZpcnR1YWwgPyBzd2lwZXIudmlydHVhbC5zbGlkZXMubGVuZ3RoIC0gMSA6IHN3aXBlci5zbGlkZXMubGVuZ3RoIC0gMTtcbiAgICByZXR1cm4gc3dpcGVyLnNsaWRlVG8obGFzdEluZGV4LCBzcGVlZCwgcnVuQ2FsbGJhY2tzLCBpbnRlcm5hbCk7XG4gIH0gZWxzZSBpZiAocGFyYW1zLmxvb3AgJiYgc3dpcGVyLmFjdGl2ZUluZGV4ID09PSAwICYmIHBhcmFtcy5jc3NNb2RlKSB7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIHN3aXBlci5zbGlkZVRvKHByZXZJbmRleCwgc3BlZWQsIHJ1bkNhbGxiYWNrcywgaW50ZXJuYWwpO1xuICAgIH0pO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBzd2lwZXIuc2xpZGVUbyhwcmV2SW5kZXgsIHNwZWVkLCBydW5DYWxsYmFja3MsIGludGVybmFsKTtcbn1cblxuLyogZXNsaW50IG5vLXVudXNlZC12YXJzOiBcIm9mZlwiICovXG5mdW5jdGlvbiBzbGlkZVJlc2V0KHNwZWVkLCBydW5DYWxsYmFja3MsIGludGVybmFsKSB7XG4gIGlmIChzcGVlZCA9PT0gdm9pZCAwKSB7XG4gICAgc3BlZWQgPSB0aGlzLnBhcmFtcy5zcGVlZDtcbiAgfVxuICBpZiAocnVuQ2FsbGJhY2tzID09PSB2b2lkIDApIHtcbiAgICBydW5DYWxsYmFja3MgPSB0cnVlO1xuICB9XG4gIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gIHJldHVybiBzd2lwZXIuc2xpZGVUbyhzd2lwZXIuYWN0aXZlSW5kZXgsIHNwZWVkLCBydW5DYWxsYmFja3MsIGludGVybmFsKTtcbn1cblxuLyogZXNsaW50IG5vLXVudXNlZC12YXJzOiBcIm9mZlwiICovXG5mdW5jdGlvbiBzbGlkZVRvQ2xvc2VzdChzcGVlZCwgcnVuQ2FsbGJhY2tzLCBpbnRlcm5hbCwgdGhyZXNob2xkKSB7XG4gIGlmIChzcGVlZCA9PT0gdm9pZCAwKSB7XG4gICAgc3BlZWQgPSB0aGlzLnBhcmFtcy5zcGVlZDtcbiAgfVxuICBpZiAocnVuQ2FsbGJhY2tzID09PSB2b2lkIDApIHtcbiAgICBydW5DYWxsYmFja3MgPSB0cnVlO1xuICB9XG4gIGlmICh0aHJlc2hvbGQgPT09IHZvaWQgMCkge1xuICAgIHRocmVzaG9sZCA9IDAuNTtcbiAgfVxuICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICBsZXQgaW5kZXggPSBzd2lwZXIuYWN0aXZlSW5kZXg7XG4gIGNvbnN0IHNraXAgPSBNYXRoLm1pbihzd2lwZXIucGFyYW1zLnNsaWRlc1Blckdyb3VwU2tpcCwgaW5kZXgpO1xuICBjb25zdCBzbmFwSW5kZXggPSBza2lwICsgTWF0aC5mbG9vcigoaW5kZXggLSBza2lwKSAvIHN3aXBlci5wYXJhbXMuc2xpZGVzUGVyR3JvdXApO1xuICBjb25zdCB0cmFuc2xhdGUgPSBzd2lwZXIucnRsVHJhbnNsYXRlID8gc3dpcGVyLnRyYW5zbGF0ZSA6IC1zd2lwZXIudHJhbnNsYXRlO1xuICBpZiAodHJhbnNsYXRlID49IHN3aXBlci5zbmFwR3JpZFtzbmFwSW5kZXhdKSB7XG4gICAgLy8gVGhlIGN1cnJlbnQgdHJhbnNsYXRlIGlzIG9uIG9yIGFmdGVyIHRoZSBjdXJyZW50IHNuYXAgaW5kZXgsIHNvIHRoZSBjaG9pY2VcbiAgICAvLyBpcyBiZXR3ZWVuIHRoZSBjdXJyZW50IGluZGV4IGFuZCB0aGUgb25lIGFmdGVyIGl0LlxuICAgIGNvbnN0IGN1cnJlbnRTbmFwID0gc3dpcGVyLnNuYXBHcmlkW3NuYXBJbmRleF07XG4gICAgY29uc3QgbmV4dFNuYXAgPSBzd2lwZXIuc25hcEdyaWRbc25hcEluZGV4ICsgMV07XG4gICAgaWYgKHRyYW5zbGF0ZSAtIGN1cnJlbnRTbmFwID4gKG5leHRTbmFwIC0gY3VycmVudFNuYXApICogdGhyZXNob2xkKSB7XG4gICAgICBpbmRleCArPSBzd2lwZXIucGFyYW1zLnNsaWRlc1Blckdyb3VwO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBUaGUgY3VycmVudCB0cmFuc2xhdGUgaXMgYmVmb3JlIHRoZSBjdXJyZW50IHNuYXAgaW5kZXgsIHNvIHRoZSBjaG9pY2VcbiAgICAvLyBpcyBiZXR3ZWVuIHRoZSBjdXJyZW50IGluZGV4IGFuZCB0aGUgb25lIGJlZm9yZSBpdC5cbiAgICBjb25zdCBwcmV2U25hcCA9IHN3aXBlci5zbmFwR3JpZFtzbmFwSW5kZXggLSAxXTtcbiAgICBjb25zdCBjdXJyZW50U25hcCA9IHN3aXBlci5zbmFwR3JpZFtzbmFwSW5kZXhdO1xuICAgIGlmICh0cmFuc2xhdGUgLSBwcmV2U25hcCA8PSAoY3VycmVudFNuYXAgLSBwcmV2U25hcCkgKiB0aHJlc2hvbGQpIHtcbiAgICAgIGluZGV4IC09IHN3aXBlci5wYXJhbXMuc2xpZGVzUGVyR3JvdXA7XG4gICAgfVxuICB9XG4gIGluZGV4ID0gTWF0aC5tYXgoaW5kZXgsIDApO1xuICBpbmRleCA9IE1hdGgubWluKGluZGV4LCBzd2lwZXIuc2xpZGVzR3JpZC5sZW5ndGggLSAxKTtcbiAgcmV0dXJuIHN3aXBlci5zbGlkZVRvKGluZGV4LCBzcGVlZCwgcnVuQ2FsbGJhY2tzLCBpbnRlcm5hbCk7XG59XG5cbmZ1bmN0aW9uIHNsaWRlVG9DbGlja2VkU2xpZGUoKSB7XG4gIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gIGNvbnN0IHtcbiAgICBwYXJhbXMsXG4gICAgc2xpZGVzRWxcbiAgfSA9IHN3aXBlcjtcbiAgY29uc3Qgc2xpZGVzUGVyVmlldyA9IHBhcmFtcy5zbGlkZXNQZXJWaWV3ID09PSAnYXV0bycgPyBzd2lwZXIuc2xpZGVzUGVyVmlld0R5bmFtaWMoKSA6IHBhcmFtcy5zbGlkZXNQZXJWaWV3O1xuICBsZXQgc2xpZGVUb0luZGV4ID0gc3dpcGVyLmNsaWNrZWRJbmRleDtcbiAgbGV0IHJlYWxJbmRleDtcbiAgY29uc3Qgc2xpZGVTZWxlY3RvciA9IHN3aXBlci5pc0VsZW1lbnQgPyBgc3dpcGVyLXNsaWRlYCA6IGAuJHtwYXJhbXMuc2xpZGVDbGFzc31gO1xuICBpZiAocGFyYW1zLmxvb3ApIHtcbiAgICBpZiAoc3dpcGVyLmFuaW1hdGluZykgcmV0dXJuO1xuICAgIHJlYWxJbmRleCA9IHBhcnNlSW50KHN3aXBlci5jbGlja2VkU2xpZGUuZ2V0QXR0cmlidXRlKCdkYXRhLXN3aXBlci1zbGlkZS1pbmRleCcpLCAxMCk7XG4gICAgaWYgKHBhcmFtcy5jZW50ZXJlZFNsaWRlcykge1xuICAgICAgaWYgKHNsaWRlVG9JbmRleCA8IHN3aXBlci5sb29wZWRTbGlkZXMgLSBzbGlkZXNQZXJWaWV3IC8gMiB8fCBzbGlkZVRvSW5kZXggPiBzd2lwZXIuc2xpZGVzLmxlbmd0aCAtIHN3aXBlci5sb29wZWRTbGlkZXMgKyBzbGlkZXNQZXJWaWV3IC8gMikge1xuICAgICAgICBzd2lwZXIubG9vcEZpeCgpO1xuICAgICAgICBzbGlkZVRvSW5kZXggPSBzd2lwZXIuZ2V0U2xpZGVJbmRleChlbGVtZW50Q2hpbGRyZW4oc2xpZGVzRWwsIGAke3NsaWRlU2VsZWN0b3J9W2RhdGEtc3dpcGVyLXNsaWRlLWluZGV4PVwiJHtyZWFsSW5kZXh9XCJdYClbMF0pO1xuICAgICAgICBuZXh0VGljaygoKSA9PiB7XG4gICAgICAgICAgc3dpcGVyLnNsaWRlVG8oc2xpZGVUb0luZGV4KTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzd2lwZXIuc2xpZGVUbyhzbGlkZVRvSW5kZXgpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoc2xpZGVUb0luZGV4ID4gc3dpcGVyLnNsaWRlcy5sZW5ndGggLSBzbGlkZXNQZXJWaWV3KSB7XG4gICAgICBzd2lwZXIubG9vcEZpeCgpO1xuICAgICAgc2xpZGVUb0luZGV4ID0gc3dpcGVyLmdldFNsaWRlSW5kZXgoZWxlbWVudENoaWxkcmVuKHNsaWRlc0VsLCBgJHtzbGlkZVNlbGVjdG9yfVtkYXRhLXN3aXBlci1zbGlkZS1pbmRleD1cIiR7cmVhbEluZGV4fVwiXWApWzBdKTtcbiAgICAgIG5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgc3dpcGVyLnNsaWRlVG8oc2xpZGVUb0luZGV4KTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBzd2lwZXIuc2xpZGVUbyhzbGlkZVRvSW5kZXgpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBzd2lwZXIuc2xpZGVUbyhzbGlkZVRvSW5kZXgpO1xuICB9XG59XG5cbnZhciBzbGlkZSA9IHtcbiAgc2xpZGVUbyxcbiAgc2xpZGVUb0xvb3AsXG4gIHNsaWRlTmV4dCxcbiAgc2xpZGVQcmV2LFxuICBzbGlkZVJlc2V0LFxuICBzbGlkZVRvQ2xvc2VzdCxcbiAgc2xpZGVUb0NsaWNrZWRTbGlkZVxufTtcblxuZnVuY3Rpb24gbG9vcENyZWF0ZShzbGlkZVJlYWxJbmRleCkge1xuICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICBjb25zdCB7XG4gICAgcGFyYW1zLFxuICAgIHNsaWRlc0VsXG4gIH0gPSBzd2lwZXI7XG4gIGlmICghcGFyYW1zLmxvb3AgfHwgc3dpcGVyLnZpcnR1YWwgJiYgc3dpcGVyLnBhcmFtcy52aXJ0dWFsLmVuYWJsZWQpIHJldHVybjtcbiAgY29uc3QgaW5pdFNsaWRlcyA9ICgpID0+IHtcbiAgICBjb25zdCBzbGlkZXMgPSBlbGVtZW50Q2hpbGRyZW4oc2xpZGVzRWwsIGAuJHtwYXJhbXMuc2xpZGVDbGFzc30sIHN3aXBlci1zbGlkZWApO1xuICAgIHNsaWRlcy5mb3JFYWNoKChlbCwgaW5kZXgpID0+IHtcbiAgICAgIGVsLnNldEF0dHJpYnV0ZSgnZGF0YS1zd2lwZXItc2xpZGUtaW5kZXgnLCBpbmRleCk7XG4gICAgfSk7XG4gIH07XG4gIGNvbnN0IGdyaWRFbmFibGVkID0gc3dpcGVyLmdyaWQgJiYgcGFyYW1zLmdyaWQgJiYgcGFyYW1zLmdyaWQucm93cyA+IDE7XG4gIGNvbnN0IHNsaWRlc1Blckdyb3VwID0gcGFyYW1zLnNsaWRlc1Blckdyb3VwICogKGdyaWRFbmFibGVkID8gcGFyYW1zLmdyaWQucm93cyA6IDEpO1xuICBjb25zdCBzaG91bGRGaWxsR3JvdXAgPSBzd2lwZXIuc2xpZGVzLmxlbmd0aCAlIHNsaWRlc1Blckdyb3VwICE9PSAwO1xuICBjb25zdCBzaG91bGRGaWxsR3JpZCA9IGdyaWRFbmFibGVkICYmIHN3aXBlci5zbGlkZXMubGVuZ3RoICUgcGFyYW1zLmdyaWQucm93cyAhPT0gMDtcbiAgY29uc3QgYWRkQmxhbmtTbGlkZXMgPSBhbW91bnRPZlNsaWRlcyA9PiB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhbW91bnRPZlNsaWRlczsgaSArPSAxKSB7XG4gICAgICBjb25zdCBzbGlkZUVsID0gc3dpcGVyLmlzRWxlbWVudCA/IGNyZWF0ZUVsZW1lbnQoJ3N3aXBlci1zbGlkZScsIFtwYXJhbXMuc2xpZGVCbGFua0NsYXNzXSkgOiBjcmVhdGVFbGVtZW50KCdkaXYnLCBbcGFyYW1zLnNsaWRlQ2xhc3MsIHBhcmFtcy5zbGlkZUJsYW5rQ2xhc3NdKTtcbiAgICAgIHN3aXBlci5zbGlkZXNFbC5hcHBlbmQoc2xpZGVFbCk7XG4gICAgfVxuICB9O1xuICBpZiAoc2hvdWxkRmlsbEdyb3VwKSB7XG4gICAgaWYgKHBhcmFtcy5sb29wQWRkQmxhbmtTbGlkZXMpIHtcbiAgICAgIGNvbnN0IHNsaWRlc1RvQWRkID0gc2xpZGVzUGVyR3JvdXAgLSBzd2lwZXIuc2xpZGVzLmxlbmd0aCAlIHNsaWRlc1Blckdyb3VwO1xuICAgICAgYWRkQmxhbmtTbGlkZXMoc2xpZGVzVG9BZGQpO1xuICAgICAgc3dpcGVyLnJlY2FsY1NsaWRlcygpO1xuICAgICAgc3dpcGVyLnVwZGF0ZVNsaWRlcygpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzaG93V2FybmluZygnU3dpcGVyIExvb3AgV2FybmluZzogVGhlIG51bWJlciBvZiBzbGlkZXMgaXMgbm90IGV2ZW4gdG8gc2xpZGVzUGVyR3JvdXAsIGxvb3AgbW9kZSBtYXkgbm90IGZ1bmN0aW9uIHByb3Blcmx5LiBZb3UgbmVlZCB0byBhZGQgbW9yZSBzbGlkZXMgKG9yIG1ha2UgZHVwbGljYXRlcywgb3IgZW1wdHkgc2xpZGVzKScpO1xuICAgIH1cbiAgICBpbml0U2xpZGVzKCk7XG4gIH0gZWxzZSBpZiAoc2hvdWxkRmlsbEdyaWQpIHtcbiAgICBpZiAocGFyYW1zLmxvb3BBZGRCbGFua1NsaWRlcykge1xuICAgICAgY29uc3Qgc2xpZGVzVG9BZGQgPSBwYXJhbXMuZ3JpZC5yb3dzIC0gc3dpcGVyLnNsaWRlcy5sZW5ndGggJSBwYXJhbXMuZ3JpZC5yb3dzO1xuICAgICAgYWRkQmxhbmtTbGlkZXMoc2xpZGVzVG9BZGQpO1xuICAgICAgc3dpcGVyLnJlY2FsY1NsaWRlcygpO1xuICAgICAgc3dpcGVyLnVwZGF0ZVNsaWRlcygpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzaG93V2FybmluZygnU3dpcGVyIExvb3AgV2FybmluZzogVGhlIG51bWJlciBvZiBzbGlkZXMgaXMgbm90IGV2ZW4gdG8gZ3JpZC5yb3dzLCBsb29wIG1vZGUgbWF5IG5vdCBmdW5jdGlvbiBwcm9wZXJseS4gWW91IG5lZWQgdG8gYWRkIG1vcmUgc2xpZGVzIChvciBtYWtlIGR1cGxpY2F0ZXMsIG9yIGVtcHR5IHNsaWRlcyknKTtcbiAgICB9XG4gICAgaW5pdFNsaWRlcygpO1xuICB9IGVsc2Uge1xuICAgIGluaXRTbGlkZXMoKTtcbiAgfVxuICBzd2lwZXIubG9vcEZpeCh7XG4gICAgc2xpZGVSZWFsSW5kZXgsXG4gICAgZGlyZWN0aW9uOiBwYXJhbXMuY2VudGVyZWRTbGlkZXMgPyB1bmRlZmluZWQgOiAnbmV4dCdcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGxvb3BGaXgoX3RlbXApIHtcbiAgbGV0IHtcbiAgICBzbGlkZVJlYWxJbmRleCxcbiAgICBzbGlkZVRvID0gdHJ1ZSxcbiAgICBkaXJlY3Rpb24sXG4gICAgc2V0VHJhbnNsYXRlLFxuICAgIGFjdGl2ZVNsaWRlSW5kZXgsXG4gICAgYnlDb250cm9sbGVyLFxuICAgIGJ5TW91c2V3aGVlbFxuICB9ID0gX3RlbXAgPT09IHZvaWQgMCA/IHt9IDogX3RlbXA7XG4gIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gIGlmICghc3dpcGVyLnBhcmFtcy5sb29wKSByZXR1cm47XG4gIHN3aXBlci5lbWl0KCdiZWZvcmVMb29wRml4Jyk7XG4gIGNvbnN0IHtcbiAgICBzbGlkZXMsXG4gICAgYWxsb3dTbGlkZVByZXYsXG4gICAgYWxsb3dTbGlkZU5leHQsXG4gICAgc2xpZGVzRWwsXG4gICAgcGFyYW1zXG4gIH0gPSBzd2lwZXI7XG4gIGNvbnN0IHtcbiAgICBjZW50ZXJlZFNsaWRlc1xuICB9ID0gcGFyYW1zO1xuICBzd2lwZXIuYWxsb3dTbGlkZVByZXYgPSB0cnVlO1xuICBzd2lwZXIuYWxsb3dTbGlkZU5leHQgPSB0cnVlO1xuICBpZiAoc3dpcGVyLnZpcnR1YWwgJiYgcGFyYW1zLnZpcnR1YWwuZW5hYmxlZCkge1xuICAgIGlmIChzbGlkZVRvKSB7XG4gICAgICBpZiAoIXBhcmFtcy5jZW50ZXJlZFNsaWRlcyAmJiBzd2lwZXIuc25hcEluZGV4ID09PSAwKSB7XG4gICAgICAgIHN3aXBlci5zbGlkZVRvKHN3aXBlci52aXJ0dWFsLnNsaWRlcy5sZW5ndGgsIDAsIGZhbHNlLCB0cnVlKTtcbiAgICAgIH0gZWxzZSBpZiAocGFyYW1zLmNlbnRlcmVkU2xpZGVzICYmIHN3aXBlci5zbmFwSW5kZXggPCBwYXJhbXMuc2xpZGVzUGVyVmlldykge1xuICAgICAgICBzd2lwZXIuc2xpZGVUbyhzd2lwZXIudmlydHVhbC5zbGlkZXMubGVuZ3RoICsgc3dpcGVyLnNuYXBJbmRleCwgMCwgZmFsc2UsIHRydWUpO1xuICAgICAgfSBlbHNlIGlmIChzd2lwZXIuc25hcEluZGV4ID09PSBzd2lwZXIuc25hcEdyaWQubGVuZ3RoIC0gMSkge1xuICAgICAgICBzd2lwZXIuc2xpZGVUbyhzd2lwZXIudmlydHVhbC5zbGlkZXNCZWZvcmUsIDAsIGZhbHNlLCB0cnVlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgc3dpcGVyLmFsbG93U2xpZGVQcmV2ID0gYWxsb3dTbGlkZVByZXY7XG4gICAgc3dpcGVyLmFsbG93U2xpZGVOZXh0ID0gYWxsb3dTbGlkZU5leHQ7XG4gICAgc3dpcGVyLmVtaXQoJ2xvb3BGaXgnKTtcbiAgICByZXR1cm47XG4gIH1cbiAgbGV0IHNsaWRlc1BlclZpZXcgPSBwYXJhbXMuc2xpZGVzUGVyVmlldztcbiAgaWYgKHNsaWRlc1BlclZpZXcgPT09ICdhdXRvJykge1xuICAgIHNsaWRlc1BlclZpZXcgPSBzd2lwZXIuc2xpZGVzUGVyVmlld0R5bmFtaWMoKTtcbiAgfSBlbHNlIHtcbiAgICBzbGlkZXNQZXJWaWV3ID0gTWF0aC5jZWlsKHBhcnNlRmxvYXQocGFyYW1zLnNsaWRlc1BlclZpZXcsIDEwKSk7XG4gICAgaWYgKGNlbnRlcmVkU2xpZGVzICYmIHNsaWRlc1BlclZpZXcgJSAyID09PSAwKSB7XG4gICAgICBzbGlkZXNQZXJWaWV3ID0gc2xpZGVzUGVyVmlldyArIDE7XG4gICAgfVxuICB9XG4gIGNvbnN0IHNsaWRlc1Blckdyb3VwID0gcGFyYW1zLnNsaWRlc1Blckdyb3VwQXV0byA/IHNsaWRlc1BlclZpZXcgOiBwYXJhbXMuc2xpZGVzUGVyR3JvdXA7XG4gIGxldCBsb29wZWRTbGlkZXMgPSBzbGlkZXNQZXJHcm91cDtcbiAgaWYgKGxvb3BlZFNsaWRlcyAlIHNsaWRlc1Blckdyb3VwICE9PSAwKSB7XG4gICAgbG9vcGVkU2xpZGVzICs9IHNsaWRlc1Blckdyb3VwIC0gbG9vcGVkU2xpZGVzICUgc2xpZGVzUGVyR3JvdXA7XG4gIH1cbiAgbG9vcGVkU2xpZGVzICs9IHBhcmFtcy5sb29wQWRkaXRpb25hbFNsaWRlcztcbiAgc3dpcGVyLmxvb3BlZFNsaWRlcyA9IGxvb3BlZFNsaWRlcztcbiAgY29uc3QgZ3JpZEVuYWJsZWQgPSBzd2lwZXIuZ3JpZCAmJiBwYXJhbXMuZ3JpZCAmJiBwYXJhbXMuZ3JpZC5yb3dzID4gMTtcbiAgaWYgKHNsaWRlcy5sZW5ndGggPCBzbGlkZXNQZXJWaWV3ICsgbG9vcGVkU2xpZGVzKSB7XG4gICAgc2hvd1dhcm5pbmcoJ1N3aXBlciBMb29wIFdhcm5pbmc6IFRoZSBudW1iZXIgb2Ygc2xpZGVzIGlzIG5vdCBlbm91Z2ggZm9yIGxvb3AgbW9kZSwgaXQgd2lsbCBiZSBkaXNhYmxlZCBhbmQgbm90IGZ1bmN0aW9uIHByb3Blcmx5LiBZb3UgbmVlZCB0byBhZGQgbW9yZSBzbGlkZXMgKG9yIG1ha2UgZHVwbGljYXRlcykgb3IgbG93ZXIgdGhlIHZhbHVlcyBvZiBzbGlkZXNQZXJWaWV3IGFuZCBzbGlkZXNQZXJHcm91cCBwYXJhbWV0ZXJzJyk7XG4gIH0gZWxzZSBpZiAoZ3JpZEVuYWJsZWQgJiYgcGFyYW1zLmdyaWQuZmlsbCA9PT0gJ3JvdycpIHtcbiAgICBzaG93V2FybmluZygnU3dpcGVyIExvb3AgV2FybmluZzogTG9vcCBtb2RlIGlzIG5vdCBjb21wYXRpYmxlIHdpdGggZ3JpZC5maWxsID0gYHJvd2AnKTtcbiAgfVxuICBjb25zdCBwcmVwZW5kU2xpZGVzSW5kZXhlcyA9IFtdO1xuICBjb25zdCBhcHBlbmRTbGlkZXNJbmRleGVzID0gW107XG4gIGxldCBhY3RpdmVJbmRleCA9IHN3aXBlci5hY3RpdmVJbmRleDtcbiAgaWYgKHR5cGVvZiBhY3RpdmVTbGlkZUluZGV4ID09PSAndW5kZWZpbmVkJykge1xuICAgIGFjdGl2ZVNsaWRlSW5kZXggPSBzd2lwZXIuZ2V0U2xpZGVJbmRleChzbGlkZXMuZmlsdGVyKGVsID0+IGVsLmNsYXNzTGlzdC5jb250YWlucyhwYXJhbXMuc2xpZGVBY3RpdmVDbGFzcykpWzBdKTtcbiAgfSBlbHNlIHtcbiAgICBhY3RpdmVJbmRleCA9IGFjdGl2ZVNsaWRlSW5kZXg7XG4gIH1cbiAgY29uc3QgaXNOZXh0ID0gZGlyZWN0aW9uID09PSAnbmV4dCcgfHwgIWRpcmVjdGlvbjtcbiAgY29uc3QgaXNQcmV2ID0gZGlyZWN0aW9uID09PSAncHJldicgfHwgIWRpcmVjdGlvbjtcbiAgbGV0IHNsaWRlc1ByZXBlbmRlZCA9IDA7XG4gIGxldCBzbGlkZXNBcHBlbmRlZCA9IDA7XG4gIGNvbnN0IGNvbHMgPSBncmlkRW5hYmxlZCA/IE1hdGguY2VpbChzbGlkZXMubGVuZ3RoIC8gcGFyYW1zLmdyaWQucm93cykgOiBzbGlkZXMubGVuZ3RoO1xuICBjb25zdCBhY3RpdmVDb2xJbmRleCA9IGdyaWRFbmFibGVkID8gc2xpZGVzW2FjdGl2ZVNsaWRlSW5kZXhdLmNvbHVtbiA6IGFjdGl2ZVNsaWRlSW5kZXg7XG4gIGNvbnN0IGFjdGl2ZUNvbEluZGV4V2l0aFNoaWZ0ID0gYWN0aXZlQ29sSW5kZXggKyAoY2VudGVyZWRTbGlkZXMgJiYgdHlwZW9mIHNldFRyYW5zbGF0ZSA9PT0gJ3VuZGVmaW5lZCcgPyAtc2xpZGVzUGVyVmlldyAvIDIgKyAwLjUgOiAwKTtcbiAgLy8gcHJlcGVuZCBsYXN0IHNsaWRlcyBiZWZvcmUgc3RhcnRcbiAgaWYgKGFjdGl2ZUNvbEluZGV4V2l0aFNoaWZ0IDwgbG9vcGVkU2xpZGVzKSB7XG4gICAgc2xpZGVzUHJlcGVuZGVkID0gTWF0aC5tYXgobG9vcGVkU2xpZGVzIC0gYWN0aXZlQ29sSW5kZXhXaXRoU2hpZnQsIHNsaWRlc1Blckdyb3VwKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxvb3BlZFNsaWRlcyAtIGFjdGl2ZUNvbEluZGV4V2l0aFNoaWZ0OyBpICs9IDEpIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gaSAtIE1hdGguZmxvb3IoaSAvIGNvbHMpICogY29scztcbiAgICAgIGlmIChncmlkRW5hYmxlZCkge1xuICAgICAgICBjb25zdCBjb2xJbmRleFRvUHJlcGVuZCA9IGNvbHMgLSBpbmRleCAtIDE7XG4gICAgICAgIGZvciAobGV0IGkgPSBzbGlkZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpIC09IDEpIHtcbiAgICAgICAgICBpZiAoc2xpZGVzW2ldLmNvbHVtbiA9PT0gY29sSW5kZXhUb1ByZXBlbmQpIHByZXBlbmRTbGlkZXNJbmRleGVzLnB1c2goaSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gc2xpZGVzLmZvckVhY2goKHNsaWRlLCBzbGlkZUluZGV4KSA9PiB7XG4gICAgICAgIC8vICAgaWYgKHNsaWRlLmNvbHVtbiA9PT0gY29sSW5kZXhUb1ByZXBlbmQpIHByZXBlbmRTbGlkZXNJbmRleGVzLnB1c2goc2xpZGVJbmRleCk7XG4gICAgICAgIC8vIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcHJlcGVuZFNsaWRlc0luZGV4ZXMucHVzaChjb2xzIC0gaW5kZXggLSAxKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAoYWN0aXZlQ29sSW5kZXhXaXRoU2hpZnQgKyBzbGlkZXNQZXJWaWV3ID4gY29scyAtIGxvb3BlZFNsaWRlcykge1xuICAgIHNsaWRlc0FwcGVuZGVkID0gTWF0aC5tYXgoYWN0aXZlQ29sSW5kZXhXaXRoU2hpZnQgLSAoY29scyAtIGxvb3BlZFNsaWRlcyAqIDIpLCBzbGlkZXNQZXJHcm91cCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzbGlkZXNBcHBlbmRlZDsgaSArPSAxKSB7XG4gICAgICBjb25zdCBpbmRleCA9IGkgLSBNYXRoLmZsb29yKGkgLyBjb2xzKSAqIGNvbHM7XG4gICAgICBpZiAoZ3JpZEVuYWJsZWQpIHtcbiAgICAgICAgc2xpZGVzLmZvckVhY2goKHNsaWRlLCBzbGlkZUluZGV4KSA9PiB7XG4gICAgICAgICAgaWYgKHNsaWRlLmNvbHVtbiA9PT0gaW5kZXgpIGFwcGVuZFNsaWRlc0luZGV4ZXMucHVzaChzbGlkZUluZGV4KTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhcHBlbmRTbGlkZXNJbmRleGVzLnB1c2goaW5kZXgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBzd2lwZXIuX19wcmV2ZW50T2JzZXJ2ZXJfXyA9IHRydWU7XG4gIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgc3dpcGVyLl9fcHJldmVudE9ic2VydmVyX18gPSBmYWxzZTtcbiAgfSk7XG4gIGlmIChpc1ByZXYpIHtcbiAgICBwcmVwZW5kU2xpZGVzSW5kZXhlcy5mb3JFYWNoKGluZGV4ID0+IHtcbiAgICAgIHNsaWRlc1tpbmRleF0uc3dpcGVyTG9vcE1vdmVET00gPSB0cnVlO1xuICAgICAgc2xpZGVzRWwucHJlcGVuZChzbGlkZXNbaW5kZXhdKTtcbiAgICAgIHNsaWRlc1tpbmRleF0uc3dpcGVyTG9vcE1vdmVET00gPSBmYWxzZTtcbiAgICB9KTtcbiAgfVxuICBpZiAoaXNOZXh0KSB7XG4gICAgYXBwZW5kU2xpZGVzSW5kZXhlcy5mb3JFYWNoKGluZGV4ID0+IHtcbiAgICAgIHNsaWRlc1tpbmRleF0uc3dpcGVyTG9vcE1vdmVET00gPSB0cnVlO1xuICAgICAgc2xpZGVzRWwuYXBwZW5kKHNsaWRlc1tpbmRleF0pO1xuICAgICAgc2xpZGVzW2luZGV4XS5zd2lwZXJMb29wTW92ZURPTSA9IGZhbHNlO1xuICAgIH0pO1xuICB9XG4gIHN3aXBlci5yZWNhbGNTbGlkZXMoKTtcbiAgaWYgKHBhcmFtcy5zbGlkZXNQZXJWaWV3ID09PSAnYXV0bycpIHtcbiAgICBzd2lwZXIudXBkYXRlU2xpZGVzKCk7XG4gIH0gZWxzZSBpZiAoZ3JpZEVuYWJsZWQgJiYgKHByZXBlbmRTbGlkZXNJbmRleGVzLmxlbmd0aCA+IDAgJiYgaXNQcmV2IHx8IGFwcGVuZFNsaWRlc0luZGV4ZXMubGVuZ3RoID4gMCAmJiBpc05leHQpKSB7XG4gICAgc3dpcGVyLnNsaWRlcy5mb3JFYWNoKChzbGlkZSwgc2xpZGVJbmRleCkgPT4ge1xuICAgICAgc3dpcGVyLmdyaWQudXBkYXRlU2xpZGUoc2xpZGVJbmRleCwgc2xpZGUsIHN3aXBlci5zbGlkZXMpO1xuICAgIH0pO1xuICB9XG4gIGlmIChwYXJhbXMud2F0Y2hTbGlkZXNQcm9ncmVzcykge1xuICAgIHN3aXBlci51cGRhdGVTbGlkZXNPZmZzZXQoKTtcbiAgfVxuICBpZiAoc2xpZGVUbykge1xuICAgIGlmIChwcmVwZW5kU2xpZGVzSW5kZXhlcy5sZW5ndGggPiAwICYmIGlzUHJldikge1xuICAgICAgaWYgKHR5cGVvZiBzbGlkZVJlYWxJbmRleCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgY29uc3QgY3VycmVudFNsaWRlVHJhbnNsYXRlID0gc3dpcGVyLnNsaWRlc0dyaWRbYWN0aXZlSW5kZXhdO1xuICAgICAgICBjb25zdCBuZXdTbGlkZVRyYW5zbGF0ZSA9IHN3aXBlci5zbGlkZXNHcmlkW2FjdGl2ZUluZGV4ICsgc2xpZGVzUHJlcGVuZGVkXTtcbiAgICAgICAgY29uc3QgZGlmZiA9IG5ld1NsaWRlVHJhbnNsYXRlIC0gY3VycmVudFNsaWRlVHJhbnNsYXRlO1xuICAgICAgICBpZiAoYnlNb3VzZXdoZWVsKSB7XG4gICAgICAgICAgc3dpcGVyLnNldFRyYW5zbGF0ZShzd2lwZXIudHJhbnNsYXRlIC0gZGlmZik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3dpcGVyLnNsaWRlVG8oYWN0aXZlSW5kZXggKyBzbGlkZXNQcmVwZW5kZWQsIDAsIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgICBpZiAoc2V0VHJhbnNsYXRlKSB7XG4gICAgICAgICAgICBzd2lwZXIudG91Y2hFdmVudHNEYXRhLnN0YXJ0VHJhbnNsYXRlID0gc3dpcGVyLnRvdWNoRXZlbnRzRGF0YS5zdGFydFRyYW5zbGF0ZSAtIGRpZmY7XG4gICAgICAgICAgICBzd2lwZXIudG91Y2hFdmVudHNEYXRhLmN1cnJlbnRUcmFuc2xhdGUgPSBzd2lwZXIudG91Y2hFdmVudHNEYXRhLmN1cnJlbnRUcmFuc2xhdGUgLSBkaWZmO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHNldFRyYW5zbGF0ZSkge1xuICAgICAgICAgIGNvbnN0IHNoaWZ0ID0gZ3JpZEVuYWJsZWQgPyBwcmVwZW5kU2xpZGVzSW5kZXhlcy5sZW5ndGggLyBwYXJhbXMuZ3JpZC5yb3dzIDogcHJlcGVuZFNsaWRlc0luZGV4ZXMubGVuZ3RoO1xuICAgICAgICAgIHN3aXBlci5zbGlkZVRvKHN3aXBlci5hY3RpdmVJbmRleCArIHNoaWZ0LCAwLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgICAgc3dpcGVyLnRvdWNoRXZlbnRzRGF0YS5jdXJyZW50VHJhbnNsYXRlID0gc3dpcGVyLnRyYW5zbGF0ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoYXBwZW5kU2xpZGVzSW5kZXhlcy5sZW5ndGggPiAwICYmIGlzTmV4dCkge1xuICAgICAgaWYgKHR5cGVvZiBzbGlkZVJlYWxJbmRleCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgY29uc3QgY3VycmVudFNsaWRlVHJhbnNsYXRlID0gc3dpcGVyLnNsaWRlc0dyaWRbYWN0aXZlSW5kZXhdO1xuICAgICAgICBjb25zdCBuZXdTbGlkZVRyYW5zbGF0ZSA9IHN3aXBlci5zbGlkZXNHcmlkW2FjdGl2ZUluZGV4IC0gc2xpZGVzQXBwZW5kZWRdO1xuICAgICAgICBjb25zdCBkaWZmID0gbmV3U2xpZGVUcmFuc2xhdGUgLSBjdXJyZW50U2xpZGVUcmFuc2xhdGU7XG4gICAgICAgIGlmIChieU1vdXNld2hlZWwpIHtcbiAgICAgICAgICBzd2lwZXIuc2V0VHJhbnNsYXRlKHN3aXBlci50cmFuc2xhdGUgLSBkaWZmKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzd2lwZXIuc2xpZGVUbyhhY3RpdmVJbmRleCAtIHNsaWRlc0FwcGVuZGVkLCAwLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgICAgaWYgKHNldFRyYW5zbGF0ZSkge1xuICAgICAgICAgICAgc3dpcGVyLnRvdWNoRXZlbnRzRGF0YS5zdGFydFRyYW5zbGF0ZSA9IHN3aXBlci50b3VjaEV2ZW50c0RhdGEuc3RhcnRUcmFuc2xhdGUgLSBkaWZmO1xuICAgICAgICAgICAgc3dpcGVyLnRvdWNoRXZlbnRzRGF0YS5jdXJyZW50VHJhbnNsYXRlID0gc3dpcGVyLnRvdWNoRXZlbnRzRGF0YS5jdXJyZW50VHJhbnNsYXRlIC0gZGlmZjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHNoaWZ0ID0gZ3JpZEVuYWJsZWQgPyBhcHBlbmRTbGlkZXNJbmRleGVzLmxlbmd0aCAvIHBhcmFtcy5ncmlkLnJvd3MgOiBhcHBlbmRTbGlkZXNJbmRleGVzLmxlbmd0aDtcbiAgICAgICAgc3dpcGVyLnNsaWRlVG8oc3dpcGVyLmFjdGl2ZUluZGV4IC0gc2hpZnQsIDAsIGZhbHNlLCB0cnVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgc3dpcGVyLmFsbG93U2xpZGVQcmV2ID0gYWxsb3dTbGlkZVByZXY7XG4gIHN3aXBlci5hbGxvd1NsaWRlTmV4dCA9IGFsbG93U2xpZGVOZXh0O1xuICBpZiAoc3dpcGVyLmNvbnRyb2xsZXIgJiYgc3dpcGVyLmNvbnRyb2xsZXIuY29udHJvbCAmJiAhYnlDb250cm9sbGVyKSB7XG4gICAgY29uc3QgbG9vcFBhcmFtcyA9IHtcbiAgICAgIHNsaWRlUmVhbEluZGV4LFxuICAgICAgZGlyZWN0aW9uLFxuICAgICAgc2V0VHJhbnNsYXRlLFxuICAgICAgYWN0aXZlU2xpZGVJbmRleCxcbiAgICAgIGJ5Q29udHJvbGxlcjogdHJ1ZVxuICAgIH07XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoc3dpcGVyLmNvbnRyb2xsZXIuY29udHJvbCkpIHtcbiAgICAgIHN3aXBlci5jb250cm9sbGVyLmNvbnRyb2wuZm9yRWFjaChjID0+IHtcbiAgICAgICAgaWYgKCFjLmRlc3Ryb3llZCAmJiBjLnBhcmFtcy5sb29wKSBjLmxvb3BGaXgoe1xuICAgICAgICAgIC4uLmxvb3BQYXJhbXMsXG4gICAgICAgICAgc2xpZGVUbzogYy5wYXJhbXMuc2xpZGVzUGVyVmlldyA9PT0gcGFyYW1zLnNsaWRlc1BlclZpZXcgPyBzbGlkZVRvIDogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHN3aXBlci5jb250cm9sbGVyLmNvbnRyb2wgaW5zdGFuY2VvZiBzd2lwZXIuY29uc3RydWN0b3IgJiYgc3dpcGVyLmNvbnRyb2xsZXIuY29udHJvbC5wYXJhbXMubG9vcCkge1xuICAgICAgc3dpcGVyLmNvbnRyb2xsZXIuY29udHJvbC5sb29wRml4KHtcbiAgICAgICAgLi4ubG9vcFBhcmFtcyxcbiAgICAgICAgc2xpZGVUbzogc3dpcGVyLmNvbnRyb2xsZXIuY29udHJvbC5wYXJhbXMuc2xpZGVzUGVyVmlldyA9PT0gcGFyYW1zLnNsaWRlc1BlclZpZXcgPyBzbGlkZVRvIDogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBzd2lwZXIuZW1pdCgnbG9vcEZpeCcpO1xufVxuXG5mdW5jdGlvbiBsb29wRGVzdHJveSgpIHtcbiAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgY29uc3Qge1xuICAgIHBhcmFtcyxcbiAgICBzbGlkZXNFbFxuICB9ID0gc3dpcGVyO1xuICBpZiAoIXBhcmFtcy5sb29wIHx8IHN3aXBlci52aXJ0dWFsICYmIHN3aXBlci5wYXJhbXMudmlydHVhbC5lbmFibGVkKSByZXR1cm47XG4gIHN3aXBlci5yZWNhbGNTbGlkZXMoKTtcbiAgY29uc3QgbmV3U2xpZGVzT3JkZXIgPSBbXTtcbiAgc3dpcGVyLnNsaWRlcy5mb3JFYWNoKHNsaWRlRWwgPT4ge1xuICAgIGNvbnN0IGluZGV4ID0gdHlwZW9mIHNsaWRlRWwuc3dpcGVyU2xpZGVJbmRleCA9PT0gJ3VuZGVmaW5lZCcgPyBzbGlkZUVsLmdldEF0dHJpYnV0ZSgnZGF0YS1zd2lwZXItc2xpZGUtaW5kZXgnKSAqIDEgOiBzbGlkZUVsLnN3aXBlclNsaWRlSW5kZXg7XG4gICAgbmV3U2xpZGVzT3JkZXJbaW5kZXhdID0gc2xpZGVFbDtcbiAgfSk7XG4gIHN3aXBlci5zbGlkZXMuZm9yRWFjaChzbGlkZUVsID0+IHtcbiAgICBzbGlkZUVsLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1zd2lwZXItc2xpZGUtaW5kZXgnKTtcbiAgfSk7XG4gIG5ld1NsaWRlc09yZGVyLmZvckVhY2goc2xpZGVFbCA9PiB7XG4gICAgc2xpZGVzRWwuYXBwZW5kKHNsaWRlRWwpO1xuICB9KTtcbiAgc3dpcGVyLnJlY2FsY1NsaWRlcygpO1xuICBzd2lwZXIuc2xpZGVUbyhzd2lwZXIucmVhbEluZGV4LCAwKTtcbn1cblxudmFyIGxvb3AgPSB7XG4gIGxvb3BDcmVhdGUsXG4gIGxvb3BGaXgsXG4gIGxvb3BEZXN0cm95XG59O1xuXG5mdW5jdGlvbiBzZXRHcmFiQ3Vyc29yKG1vdmluZykge1xuICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICBpZiAoIXN3aXBlci5wYXJhbXMuc2ltdWxhdGVUb3VjaCB8fCBzd2lwZXIucGFyYW1zLndhdGNoT3ZlcmZsb3cgJiYgc3dpcGVyLmlzTG9ja2VkIHx8IHN3aXBlci5wYXJhbXMuY3NzTW9kZSkgcmV0dXJuO1xuICBjb25zdCBlbCA9IHN3aXBlci5wYXJhbXMudG91Y2hFdmVudHNUYXJnZXQgPT09ICdjb250YWluZXInID8gc3dpcGVyLmVsIDogc3dpcGVyLndyYXBwZXJFbDtcbiAgaWYgKHN3aXBlci5pc0VsZW1lbnQpIHtcbiAgICBzd2lwZXIuX19wcmV2ZW50T2JzZXJ2ZXJfXyA9IHRydWU7XG4gIH1cbiAgZWwuc3R5bGUuY3Vyc29yID0gJ21vdmUnO1xuICBlbC5zdHlsZS5jdXJzb3IgPSBtb3ZpbmcgPyAnZ3JhYmJpbmcnIDogJ2dyYWInO1xuICBpZiAoc3dpcGVyLmlzRWxlbWVudCkge1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICBzd2lwZXIuX19wcmV2ZW50T2JzZXJ2ZXJfXyA9IGZhbHNlO1xuICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIHVuc2V0R3JhYkN1cnNvcigpIHtcbiAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgaWYgKHN3aXBlci5wYXJhbXMud2F0Y2hPdmVyZmxvdyAmJiBzd2lwZXIuaXNMb2NrZWQgfHwgc3dpcGVyLnBhcmFtcy5jc3NNb2RlKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChzd2lwZXIuaXNFbGVtZW50KSB7XG4gICAgc3dpcGVyLl9fcHJldmVudE9ic2VydmVyX18gPSB0cnVlO1xuICB9XG4gIHN3aXBlcltzd2lwZXIucGFyYW1zLnRvdWNoRXZlbnRzVGFyZ2V0ID09PSAnY29udGFpbmVyJyA/ICdlbCcgOiAnd3JhcHBlckVsJ10uc3R5bGUuY3Vyc29yID0gJyc7XG4gIGlmIChzd2lwZXIuaXNFbGVtZW50KSB7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIHN3aXBlci5fX3ByZXZlbnRPYnNlcnZlcl9fID0gZmFsc2U7XG4gICAgfSk7XG4gIH1cbn1cblxudmFyIGdyYWJDdXJzb3IgPSB7XG4gIHNldEdyYWJDdXJzb3IsXG4gIHVuc2V0R3JhYkN1cnNvclxufTtcblxuLy8gTW9kaWZpZWQgZnJvbSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81NDUyMDU1NC9jdXN0b20tZWxlbWVudC1nZXRyb290bm9kZS1jbG9zZXN0LWZ1bmN0aW9uLWNyb3NzaW5nLW11bHRpcGxlLXBhcmVudC1zaGFkb3dkXG5mdW5jdGlvbiBjbG9zZXN0RWxlbWVudChzZWxlY3RvciwgYmFzZSkge1xuICBpZiAoYmFzZSA9PT0gdm9pZCAwKSB7XG4gICAgYmFzZSA9IHRoaXM7XG4gIH1cbiAgZnVuY3Rpb24gX19jbG9zZXN0RnJvbShlbCkge1xuICAgIGlmICghZWwgfHwgZWwgPT09IGdldERvY3VtZW50KCkgfHwgZWwgPT09IGdldFdpbmRvdygpKSByZXR1cm4gbnVsbDtcbiAgICBpZiAoZWwuYXNzaWduZWRTbG90KSBlbCA9IGVsLmFzc2lnbmVkU2xvdDtcbiAgICBjb25zdCBmb3VuZCA9IGVsLmNsb3Nlc3Qoc2VsZWN0b3IpO1xuICAgIGlmICghZm91bmQgJiYgIWVsLmdldFJvb3ROb2RlKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGZvdW5kIHx8IF9fY2xvc2VzdEZyb20oZWwuZ2V0Um9vdE5vZGUoKS5ob3N0KTtcbiAgfVxuICByZXR1cm4gX19jbG9zZXN0RnJvbShiYXNlKTtcbn1cbmZ1bmN0aW9uIHByZXZlbnRFZGdlU3dpcGUoc3dpcGVyLCBldmVudCwgc3RhcnRYKSB7XG4gIGNvbnN0IHdpbmRvdyA9IGdldFdpbmRvdygpO1xuICBjb25zdCB7XG4gICAgcGFyYW1zXG4gIH0gPSBzd2lwZXI7XG4gIGNvbnN0IGVkZ2VTd2lwZURldGVjdGlvbiA9IHBhcmFtcy5lZGdlU3dpcGVEZXRlY3Rpb247XG4gIGNvbnN0IGVkZ2VTd2lwZVRocmVzaG9sZCA9IHBhcmFtcy5lZGdlU3dpcGVUaHJlc2hvbGQ7XG4gIGlmIChlZGdlU3dpcGVEZXRlY3Rpb24gJiYgKHN0YXJ0WCA8PSBlZGdlU3dpcGVUaHJlc2hvbGQgfHwgc3RhcnRYID49IHdpbmRvdy5pbm5lcldpZHRoIC0gZWRnZVN3aXBlVGhyZXNob2xkKSkge1xuICAgIGlmIChlZGdlU3dpcGVEZXRlY3Rpb24gPT09ICdwcmV2ZW50Jykge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5mdW5jdGlvbiBvblRvdWNoU3RhcnQoZXZlbnQpIHtcbiAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgY29uc3QgZG9jdW1lbnQgPSBnZXREb2N1bWVudCgpO1xuICBsZXQgZSA9IGV2ZW50O1xuICBpZiAoZS5vcmlnaW5hbEV2ZW50KSBlID0gZS5vcmlnaW5hbEV2ZW50O1xuICBjb25zdCBkYXRhID0gc3dpcGVyLnRvdWNoRXZlbnRzRGF0YTtcbiAgaWYgKGUudHlwZSA9PT0gJ3BvaW50ZXJkb3duJykge1xuICAgIGlmIChkYXRhLnBvaW50ZXJJZCAhPT0gbnVsbCAmJiBkYXRhLnBvaW50ZXJJZCAhPT0gZS5wb2ludGVySWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZGF0YS5wb2ludGVySWQgPSBlLnBvaW50ZXJJZDtcbiAgfSBlbHNlIGlmIChlLnR5cGUgPT09ICd0b3VjaHN0YXJ0JyAmJiBlLnRhcmdldFRvdWNoZXMubGVuZ3RoID09PSAxKSB7XG4gICAgZGF0YS50b3VjaElkID0gZS50YXJnZXRUb3VjaGVzWzBdLmlkZW50aWZpZXI7XG4gIH1cbiAgaWYgKGUudHlwZSA9PT0gJ3RvdWNoc3RhcnQnKSB7XG4gICAgLy8gZG9uJ3QgcHJvY2VlZCB0b3VjaCBldmVudFxuICAgIHByZXZlbnRFZGdlU3dpcGUoc3dpcGVyLCBlLCBlLnRhcmdldFRvdWNoZXNbMF0ucGFnZVgpO1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCB7XG4gICAgcGFyYW1zLFxuICAgIHRvdWNoZXMsXG4gICAgZW5hYmxlZFxuICB9ID0gc3dpcGVyO1xuICBpZiAoIWVuYWJsZWQpIHJldHVybjtcbiAgaWYgKCFwYXJhbXMuc2ltdWxhdGVUb3VjaCAmJiBlLnBvaW50ZXJUeXBlID09PSAnbW91c2UnKSByZXR1cm47XG4gIGlmIChzd2lwZXIuYW5pbWF0aW5nICYmIHBhcmFtcy5wcmV2ZW50SW50ZXJhY3Rpb25PblRyYW5zaXRpb24pIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKCFzd2lwZXIuYW5pbWF0aW5nICYmIHBhcmFtcy5jc3NNb2RlICYmIHBhcmFtcy5sb29wKSB7XG4gICAgc3dpcGVyLmxvb3BGaXgoKTtcbiAgfVxuICBsZXQgdGFyZ2V0RWwgPSBlLnRhcmdldDtcbiAgaWYgKHBhcmFtcy50b3VjaEV2ZW50c1RhcmdldCA9PT0gJ3dyYXBwZXInKSB7XG4gICAgaWYgKCFzd2lwZXIud3JhcHBlckVsLmNvbnRhaW5zKHRhcmdldEVsKSkgcmV0dXJuO1xuICB9XG4gIGlmICgnd2hpY2gnIGluIGUgJiYgZS53aGljaCA9PT0gMykgcmV0dXJuO1xuICBpZiAoJ2J1dHRvbicgaW4gZSAmJiBlLmJ1dHRvbiA+IDApIHJldHVybjtcbiAgaWYgKGRhdGEuaXNUb3VjaGVkICYmIGRhdGEuaXNNb3ZlZCkgcmV0dXJuO1xuXG4gIC8vIGNoYW5nZSB0YXJnZXQgZWwgZm9yIHNoYWRvdyByb290IGNvbXBvbmVudFxuICBjb25zdCBzd2lwaW5nQ2xhc3NIYXNWYWx1ZSA9ICEhcGFyYW1zLm5vU3dpcGluZ0NsYXNzICYmIHBhcmFtcy5ub1N3aXBpbmdDbGFzcyAhPT0gJyc7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICBjb25zdCBldmVudFBhdGggPSBlLmNvbXBvc2VkUGF0aCA/IGUuY29tcG9zZWRQYXRoKCkgOiBlLnBhdGg7XG4gIGlmIChzd2lwaW5nQ2xhc3NIYXNWYWx1ZSAmJiBlLnRhcmdldCAmJiBlLnRhcmdldC5zaGFkb3dSb290ICYmIGV2ZW50UGF0aCkge1xuICAgIHRhcmdldEVsID0gZXZlbnRQYXRoWzBdO1xuICB9XG4gIGNvbnN0IG5vU3dpcGluZ1NlbGVjdG9yID0gcGFyYW1zLm5vU3dpcGluZ1NlbGVjdG9yID8gcGFyYW1zLm5vU3dpcGluZ1NlbGVjdG9yIDogYC4ke3BhcmFtcy5ub1N3aXBpbmdDbGFzc31gO1xuICBjb25zdCBpc1RhcmdldFNoYWRvdyA9ICEhKGUudGFyZ2V0ICYmIGUudGFyZ2V0LnNoYWRvd1Jvb3QpO1xuXG4gIC8vIHVzZSBjbG9zZXN0RWxlbWVudCBmb3Igc2hhZG93IHJvb3QgZWxlbWVudCB0byBnZXQgdGhlIGFjdHVhbCBjbG9zZXN0IGZvciBuZXN0ZWQgc2hhZG93IHJvb3QgZWxlbWVudFxuICBpZiAocGFyYW1zLm5vU3dpcGluZyAmJiAoaXNUYXJnZXRTaGFkb3cgPyBjbG9zZXN0RWxlbWVudChub1N3aXBpbmdTZWxlY3RvciwgdGFyZ2V0RWwpIDogdGFyZ2V0RWwuY2xvc2VzdChub1N3aXBpbmdTZWxlY3RvcikpKSB7XG4gICAgc3dpcGVyLmFsbG93Q2xpY2sgPSB0cnVlO1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAocGFyYW1zLnN3aXBlSGFuZGxlcikge1xuICAgIGlmICghdGFyZ2V0RWwuY2xvc2VzdChwYXJhbXMuc3dpcGVIYW5kbGVyKSkgcmV0dXJuO1xuICB9XG4gIHRvdWNoZXMuY3VycmVudFggPSBlLnBhZ2VYO1xuICB0b3VjaGVzLmN1cnJlbnRZID0gZS5wYWdlWTtcbiAgY29uc3Qgc3RhcnRYID0gdG91Y2hlcy5jdXJyZW50WDtcbiAgY29uc3Qgc3RhcnRZID0gdG91Y2hlcy5jdXJyZW50WTtcblxuICAvLyBEbyBOT1Qgc3RhcnQgaWYgaU9TIGVkZ2Ugc3dpcGUgaXMgZGV0ZWN0ZWQuIE90aGVyd2lzZSBpT1MgYXBwIGNhbm5vdCBzd2lwZS10by1nby1iYWNrIGFueW1vcmVcblxuICBpZiAoIXByZXZlbnRFZGdlU3dpcGUoc3dpcGVyLCBlLCBzdGFydFgpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIE9iamVjdC5hc3NpZ24oZGF0YSwge1xuICAgIGlzVG91Y2hlZDogdHJ1ZSxcbiAgICBpc01vdmVkOiBmYWxzZSxcbiAgICBhbGxvd1RvdWNoQ2FsbGJhY2tzOiB0cnVlLFxuICAgIGlzU2Nyb2xsaW5nOiB1bmRlZmluZWQsXG4gICAgc3RhcnRNb3Zpbmc6IHVuZGVmaW5lZFxuICB9KTtcbiAgdG91Y2hlcy5zdGFydFggPSBzdGFydFg7XG4gIHRvdWNoZXMuc3RhcnRZID0gc3RhcnRZO1xuICBkYXRhLnRvdWNoU3RhcnRUaW1lID0gbm93KCk7XG4gIHN3aXBlci5hbGxvd0NsaWNrID0gdHJ1ZTtcbiAgc3dpcGVyLnVwZGF0ZVNpemUoKTtcbiAgc3dpcGVyLnN3aXBlRGlyZWN0aW9uID0gdW5kZWZpbmVkO1xuICBpZiAocGFyYW1zLnRocmVzaG9sZCA+IDApIGRhdGEuYWxsb3dUaHJlc2hvbGRNb3ZlID0gZmFsc2U7XG4gIGxldCBwcmV2ZW50RGVmYXVsdCA9IHRydWU7XG4gIGlmICh0YXJnZXRFbC5tYXRjaGVzKGRhdGEuZm9jdXNhYmxlRWxlbWVudHMpKSB7XG4gICAgcHJldmVudERlZmF1bHQgPSBmYWxzZTtcbiAgICBpZiAodGFyZ2V0RWwubm9kZU5hbWUgPT09ICdTRUxFQ1QnKSB7XG4gICAgICBkYXRhLmlzVG91Y2hlZCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50Lm1hdGNoZXMoZGF0YS5mb2N1c2FibGVFbGVtZW50cykgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAhPT0gdGFyZ2V0RWwpIHtcbiAgICBkb2N1bWVudC5hY3RpdmVFbGVtZW50LmJsdXIoKTtcbiAgfVxuICBjb25zdCBzaG91bGRQcmV2ZW50RGVmYXVsdCA9IHByZXZlbnREZWZhdWx0ICYmIHN3aXBlci5hbGxvd1RvdWNoTW92ZSAmJiBwYXJhbXMudG91Y2hTdGFydFByZXZlbnREZWZhdWx0O1xuICBpZiAoKHBhcmFtcy50b3VjaFN0YXJ0Rm9yY2VQcmV2ZW50RGVmYXVsdCB8fCBzaG91bGRQcmV2ZW50RGVmYXVsdCkgJiYgIXRhcmdldEVsLmlzQ29udGVudEVkaXRhYmxlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG4gIGlmIChwYXJhbXMuZnJlZU1vZGUgJiYgcGFyYW1zLmZyZWVNb2RlLmVuYWJsZWQgJiYgc3dpcGVyLmZyZWVNb2RlICYmIHN3aXBlci5hbmltYXRpbmcgJiYgIXBhcmFtcy5jc3NNb2RlKSB7XG4gICAgc3dpcGVyLmZyZWVNb2RlLm9uVG91Y2hTdGFydCgpO1xuICB9XG4gIHN3aXBlci5lbWl0KCd0b3VjaFN0YXJ0JywgZSk7XG59XG5cbmZ1bmN0aW9uIG9uVG91Y2hNb3ZlKGV2ZW50KSB7XG4gIGNvbnN0IGRvY3VtZW50ID0gZ2V0RG9jdW1lbnQoKTtcbiAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgY29uc3QgZGF0YSA9IHN3aXBlci50b3VjaEV2ZW50c0RhdGE7XG4gIGNvbnN0IHtcbiAgICBwYXJhbXMsXG4gICAgdG91Y2hlcyxcbiAgICBydGxUcmFuc2xhdGU6IHJ0bCxcbiAgICBlbmFibGVkXG4gIH0gPSBzd2lwZXI7XG4gIGlmICghZW5hYmxlZCkgcmV0dXJuO1xuICBpZiAoIXBhcmFtcy5zaW11bGF0ZVRvdWNoICYmIGV2ZW50LnBvaW50ZXJUeXBlID09PSAnbW91c2UnKSByZXR1cm47XG4gIGxldCBlID0gZXZlbnQ7XG4gIGlmIChlLm9yaWdpbmFsRXZlbnQpIGUgPSBlLm9yaWdpbmFsRXZlbnQ7XG4gIGlmIChlLnR5cGUgPT09ICdwb2ludGVybW92ZScpIHtcbiAgICBpZiAoZGF0YS50b3VjaElkICE9PSBudWxsKSByZXR1cm47IC8vIHJldHVybiBmcm9tIHBvaW50ZXIgaWYgd2UgdXNlIHRvdWNoXG4gICAgY29uc3QgaWQgPSBlLnBvaW50ZXJJZDtcbiAgICBpZiAoaWQgIT09IGRhdGEucG9pbnRlcklkKSByZXR1cm47XG4gIH1cbiAgbGV0IHRhcmdldFRvdWNoO1xuICBpZiAoZS50eXBlID09PSAndG91Y2htb3ZlJykge1xuICAgIHRhcmdldFRvdWNoID0gWy4uLmUuY2hhbmdlZFRvdWNoZXNdLmZpbHRlcih0ID0+IHQuaWRlbnRpZmllciA9PT0gZGF0YS50b3VjaElkKVswXTtcbiAgICBpZiAoIXRhcmdldFRvdWNoIHx8IHRhcmdldFRvdWNoLmlkZW50aWZpZXIgIT09IGRhdGEudG91Y2hJZCkgcmV0dXJuO1xuICB9IGVsc2Uge1xuICAgIHRhcmdldFRvdWNoID0gZTtcbiAgfVxuICBpZiAoIWRhdGEuaXNUb3VjaGVkKSB7XG4gICAgaWYgKGRhdGEuc3RhcnRNb3ZpbmcgJiYgZGF0YS5pc1Njcm9sbGluZykge1xuICAgICAgc3dpcGVyLmVtaXQoJ3RvdWNoTW92ZU9wcG9zaXRlJywgZSk7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBwYWdlWCA9IHRhcmdldFRvdWNoLnBhZ2VYO1xuICBjb25zdCBwYWdlWSA9IHRhcmdldFRvdWNoLnBhZ2VZO1xuICBpZiAoZS5wcmV2ZW50ZWRCeU5lc3RlZFN3aXBlcikge1xuICAgIHRvdWNoZXMuc3RhcnRYID0gcGFnZVg7XG4gICAgdG91Y2hlcy5zdGFydFkgPSBwYWdlWTtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKCFzd2lwZXIuYWxsb3dUb3VjaE1vdmUpIHtcbiAgICBpZiAoIWUudGFyZ2V0Lm1hdGNoZXMoZGF0YS5mb2N1c2FibGVFbGVtZW50cykpIHtcbiAgICAgIHN3aXBlci5hbGxvd0NsaWNrID0gZmFsc2U7XG4gICAgfVxuICAgIGlmIChkYXRhLmlzVG91Y2hlZCkge1xuICAgICAgT2JqZWN0LmFzc2lnbih0b3VjaGVzLCB7XG4gICAgICAgIHN0YXJ0WDogcGFnZVgsXG4gICAgICAgIHN0YXJ0WTogcGFnZVksXG4gICAgICAgIGN1cnJlbnRYOiBwYWdlWCxcbiAgICAgICAgY3VycmVudFk6IHBhZ2VZXG4gICAgICB9KTtcbiAgICAgIGRhdGEudG91Y2hTdGFydFRpbWUgPSBub3coKTtcbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChwYXJhbXMudG91Y2hSZWxlYXNlT25FZGdlcyAmJiAhcGFyYW1zLmxvb3ApIHtcbiAgICBpZiAoc3dpcGVyLmlzVmVydGljYWwoKSkge1xuICAgICAgLy8gVmVydGljYWxcbiAgICAgIGlmIChwYWdlWSA8IHRvdWNoZXMuc3RhcnRZICYmIHN3aXBlci50cmFuc2xhdGUgPD0gc3dpcGVyLm1heFRyYW5zbGF0ZSgpIHx8IHBhZ2VZID4gdG91Y2hlcy5zdGFydFkgJiYgc3dpcGVyLnRyYW5zbGF0ZSA+PSBzd2lwZXIubWluVHJhbnNsYXRlKCkpIHtcbiAgICAgICAgZGF0YS5pc1RvdWNoZWQgPSBmYWxzZTtcbiAgICAgICAgZGF0YS5pc01vdmVkID0gZmFsc2U7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHBhZ2VYIDwgdG91Y2hlcy5zdGFydFggJiYgc3dpcGVyLnRyYW5zbGF0ZSA8PSBzd2lwZXIubWF4VHJhbnNsYXRlKCkgfHwgcGFnZVggPiB0b3VjaGVzLnN0YXJ0WCAmJiBzd2lwZXIudHJhbnNsYXRlID49IHN3aXBlci5taW5UcmFuc2xhdGUoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkge1xuICAgIGlmIChlLnRhcmdldCA9PT0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAmJiBlLnRhcmdldC5tYXRjaGVzKGRhdGEuZm9jdXNhYmxlRWxlbWVudHMpKSB7XG4gICAgICBkYXRhLmlzTW92ZWQgPSB0cnVlO1xuICAgICAgc3dpcGVyLmFsbG93Q2xpY2sgPSBmYWxzZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cbiAgaWYgKGRhdGEuYWxsb3dUb3VjaENhbGxiYWNrcykge1xuICAgIHN3aXBlci5lbWl0KCd0b3VjaE1vdmUnLCBlKTtcbiAgfVxuICB0b3VjaGVzLnByZXZpb3VzWCA9IHRvdWNoZXMuY3VycmVudFg7XG4gIHRvdWNoZXMucHJldmlvdXNZID0gdG91Y2hlcy5jdXJyZW50WTtcbiAgdG91Y2hlcy5jdXJyZW50WCA9IHBhZ2VYO1xuICB0b3VjaGVzLmN1cnJlbnRZID0gcGFnZVk7XG4gIGNvbnN0IGRpZmZYID0gdG91Y2hlcy5jdXJyZW50WCAtIHRvdWNoZXMuc3RhcnRYO1xuICBjb25zdCBkaWZmWSA9IHRvdWNoZXMuY3VycmVudFkgLSB0b3VjaGVzLnN0YXJ0WTtcbiAgaWYgKHN3aXBlci5wYXJhbXMudGhyZXNob2xkICYmIE1hdGguc3FydChkaWZmWCAqKiAyICsgZGlmZlkgKiogMikgPCBzd2lwZXIucGFyYW1zLnRocmVzaG9sZCkgcmV0dXJuO1xuICBpZiAodHlwZW9mIGRhdGEuaXNTY3JvbGxpbmcgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgbGV0IHRvdWNoQW5nbGU7XG4gICAgaWYgKHN3aXBlci5pc0hvcml6b250YWwoKSAmJiB0b3VjaGVzLmN1cnJlbnRZID09PSB0b3VjaGVzLnN0YXJ0WSB8fCBzd2lwZXIuaXNWZXJ0aWNhbCgpICYmIHRvdWNoZXMuY3VycmVudFggPT09IHRvdWNoZXMuc3RhcnRYKSB7XG4gICAgICBkYXRhLmlzU2Nyb2xsaW5nID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgICAgaWYgKGRpZmZYICogZGlmZlggKyBkaWZmWSAqIGRpZmZZID49IDI1KSB7XG4gICAgICAgIHRvdWNoQW5nbGUgPSBNYXRoLmF0YW4yKE1hdGguYWJzKGRpZmZZKSwgTWF0aC5hYnMoZGlmZlgpKSAqIDE4MCAvIE1hdGguUEk7XG4gICAgICAgIGRhdGEuaXNTY3JvbGxpbmcgPSBzd2lwZXIuaXNIb3Jpem9udGFsKCkgPyB0b3VjaEFuZ2xlID4gcGFyYW1zLnRvdWNoQW5nbGUgOiA5MCAtIHRvdWNoQW5nbGUgPiBwYXJhbXMudG91Y2hBbmdsZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKGRhdGEuaXNTY3JvbGxpbmcpIHtcbiAgICBzd2lwZXIuZW1pdCgndG91Y2hNb3ZlT3Bwb3NpdGUnLCBlKTtcbiAgfVxuICBpZiAodHlwZW9mIGRhdGEuc3RhcnRNb3ZpbmcgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgaWYgKHRvdWNoZXMuY3VycmVudFggIT09IHRvdWNoZXMuc3RhcnRYIHx8IHRvdWNoZXMuY3VycmVudFkgIT09IHRvdWNoZXMuc3RhcnRZKSB7XG4gICAgICBkYXRhLnN0YXJ0TW92aW5nID0gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgaWYgKGRhdGEuaXNTY3JvbGxpbmcpIHtcbiAgICBkYXRhLmlzVG91Y2hlZCA9IGZhbHNlO1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoIWRhdGEuc3RhcnRNb3ZpbmcpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgc3dpcGVyLmFsbG93Q2xpY2sgPSBmYWxzZTtcbiAgaWYgKCFwYXJhbXMuY3NzTW9kZSAmJiBlLmNhbmNlbGFibGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIH1cbiAgaWYgKHBhcmFtcy50b3VjaE1vdmVTdG9wUHJvcGFnYXRpb24gJiYgIXBhcmFtcy5uZXN0ZWQpIHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICB9XG4gIGxldCBkaWZmID0gc3dpcGVyLmlzSG9yaXpvbnRhbCgpID8gZGlmZlggOiBkaWZmWTtcbiAgbGV0IHRvdWNoZXNEaWZmID0gc3dpcGVyLmlzSG9yaXpvbnRhbCgpID8gdG91Y2hlcy5jdXJyZW50WCAtIHRvdWNoZXMucHJldmlvdXNYIDogdG91Y2hlcy5jdXJyZW50WSAtIHRvdWNoZXMucHJldmlvdXNZO1xuICBpZiAocGFyYW1zLm9uZVdheU1vdmVtZW50KSB7XG4gICAgZGlmZiA9IE1hdGguYWJzKGRpZmYpICogKHJ0bCA/IDEgOiAtMSk7XG4gICAgdG91Y2hlc0RpZmYgPSBNYXRoLmFicyh0b3VjaGVzRGlmZikgKiAocnRsID8gMSA6IC0xKTtcbiAgfVxuICB0b3VjaGVzLmRpZmYgPSBkaWZmO1xuICBkaWZmICo9IHBhcmFtcy50b3VjaFJhdGlvO1xuICBpZiAocnRsKSB7XG4gICAgZGlmZiA9IC1kaWZmO1xuICAgIHRvdWNoZXNEaWZmID0gLXRvdWNoZXNEaWZmO1xuICB9XG4gIGNvbnN0IHByZXZUb3VjaGVzRGlyZWN0aW9uID0gc3dpcGVyLnRvdWNoZXNEaXJlY3Rpb247XG4gIHN3aXBlci5zd2lwZURpcmVjdGlvbiA9IGRpZmYgPiAwID8gJ3ByZXYnIDogJ25leHQnO1xuICBzd2lwZXIudG91Y2hlc0RpcmVjdGlvbiA9IHRvdWNoZXNEaWZmID4gMCA/ICdwcmV2JyA6ICduZXh0JztcbiAgY29uc3QgaXNMb29wID0gc3dpcGVyLnBhcmFtcy5sb29wICYmICFwYXJhbXMuY3NzTW9kZTtcbiAgY29uc3QgYWxsb3dMb29wRml4ID0gc3dpcGVyLnRvdWNoZXNEaXJlY3Rpb24gPT09ICduZXh0JyAmJiBzd2lwZXIuYWxsb3dTbGlkZU5leHQgfHwgc3dpcGVyLnRvdWNoZXNEaXJlY3Rpb24gPT09ICdwcmV2JyAmJiBzd2lwZXIuYWxsb3dTbGlkZVByZXY7XG4gIGlmICghZGF0YS5pc01vdmVkKSB7XG4gICAgaWYgKGlzTG9vcCAmJiBhbGxvd0xvb3BGaXgpIHtcbiAgICAgIHN3aXBlci5sb29wRml4KHtcbiAgICAgICAgZGlyZWN0aW9uOiBzd2lwZXIuc3dpcGVEaXJlY3Rpb25cbiAgICAgIH0pO1xuICAgIH1cbiAgICBkYXRhLnN0YXJ0VHJhbnNsYXRlID0gc3dpcGVyLmdldFRyYW5zbGF0ZSgpO1xuICAgIHN3aXBlci5zZXRUcmFuc2l0aW9uKDApO1xuICAgIGlmIChzd2lwZXIuYW5pbWF0aW5nKSB7XG4gICAgICBjb25zdCBldnQgPSBuZXcgd2luZG93LkN1c3RvbUV2ZW50KCd0cmFuc2l0aW9uZW5kJywge1xuICAgICAgICBidWJibGVzOiB0cnVlLFxuICAgICAgICBjYW5jZWxhYmxlOiB0cnVlXG4gICAgICB9KTtcbiAgICAgIHN3aXBlci53cmFwcGVyRWwuZGlzcGF0Y2hFdmVudChldnQpO1xuICAgIH1cbiAgICBkYXRhLmFsbG93TW9tZW50dW1Cb3VuY2UgPSBmYWxzZTtcbiAgICAvLyBHcmFiIEN1cnNvclxuICAgIGlmIChwYXJhbXMuZ3JhYkN1cnNvciAmJiAoc3dpcGVyLmFsbG93U2xpZGVOZXh0ID09PSB0cnVlIHx8IHN3aXBlci5hbGxvd1NsaWRlUHJldiA9PT0gdHJ1ZSkpIHtcbiAgICAgIHN3aXBlci5zZXRHcmFiQ3Vyc29yKHRydWUpO1xuICAgIH1cbiAgICBzd2lwZXIuZW1pdCgnc2xpZGVyRmlyc3RNb3ZlJywgZSk7XG4gIH1cbiAgbGV0IGxvb3BGaXhlZDtcbiAgbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gIGlmIChkYXRhLmlzTW92ZWQgJiYgZGF0YS5hbGxvd1RocmVzaG9sZE1vdmUgJiYgcHJldlRvdWNoZXNEaXJlY3Rpb24gIT09IHN3aXBlci50b3VjaGVzRGlyZWN0aW9uICYmIGlzTG9vcCAmJiBhbGxvd0xvb3BGaXggJiYgTWF0aC5hYnMoZGlmZikgPj0gMSkge1xuICAgIE9iamVjdC5hc3NpZ24odG91Y2hlcywge1xuICAgICAgc3RhcnRYOiBwYWdlWCxcbiAgICAgIHN0YXJ0WTogcGFnZVksXG4gICAgICBjdXJyZW50WDogcGFnZVgsXG4gICAgICBjdXJyZW50WTogcGFnZVksXG4gICAgICBzdGFydFRyYW5zbGF0ZTogZGF0YS5jdXJyZW50VHJhbnNsYXRlXG4gICAgfSk7XG4gICAgZGF0YS5sb29wU3dhcFJlc2V0ID0gdHJ1ZTtcbiAgICBkYXRhLnN0YXJ0VHJhbnNsYXRlID0gZGF0YS5jdXJyZW50VHJhbnNsYXRlO1xuICAgIHJldHVybjtcbiAgfVxuICBzd2lwZXIuZW1pdCgnc2xpZGVyTW92ZScsIGUpO1xuICBkYXRhLmlzTW92ZWQgPSB0cnVlO1xuICBkYXRhLmN1cnJlbnRUcmFuc2xhdGUgPSBkaWZmICsgZGF0YS5zdGFydFRyYW5zbGF0ZTtcbiAgbGV0IGRpc2FibGVQYXJlbnRTd2lwZXIgPSB0cnVlO1xuICBsZXQgcmVzaXN0YW5jZVJhdGlvID0gcGFyYW1zLnJlc2lzdGFuY2VSYXRpbztcbiAgaWYgKHBhcmFtcy50b3VjaFJlbGVhc2VPbkVkZ2VzKSB7XG4gICAgcmVzaXN0YW5jZVJhdGlvID0gMDtcbiAgfVxuICBpZiAoZGlmZiA+IDApIHtcbiAgICBpZiAoaXNMb29wICYmIGFsbG93TG9vcEZpeCAmJiAhbG9vcEZpeGVkICYmIGRhdGEuYWxsb3dUaHJlc2hvbGRNb3ZlICYmIGRhdGEuY3VycmVudFRyYW5zbGF0ZSA+IChwYXJhbXMuY2VudGVyZWRTbGlkZXMgPyBzd2lwZXIubWluVHJhbnNsYXRlKCkgLSBzd2lwZXIuc2xpZGVzU2l6ZXNHcmlkW3N3aXBlci5hY3RpdmVJbmRleCArIDFdIDogc3dpcGVyLm1pblRyYW5zbGF0ZSgpKSkge1xuICAgICAgc3dpcGVyLmxvb3BGaXgoe1xuICAgICAgICBkaXJlY3Rpb246ICdwcmV2JyxcbiAgICAgICAgc2V0VHJhbnNsYXRlOiB0cnVlLFxuICAgICAgICBhY3RpdmVTbGlkZUluZGV4OiAwXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKGRhdGEuY3VycmVudFRyYW5zbGF0ZSA+IHN3aXBlci5taW5UcmFuc2xhdGUoKSkge1xuICAgICAgZGlzYWJsZVBhcmVudFN3aXBlciA9IGZhbHNlO1xuICAgICAgaWYgKHBhcmFtcy5yZXNpc3RhbmNlKSB7XG4gICAgICAgIGRhdGEuY3VycmVudFRyYW5zbGF0ZSA9IHN3aXBlci5taW5UcmFuc2xhdGUoKSAtIDEgKyAoLXN3aXBlci5taW5UcmFuc2xhdGUoKSArIGRhdGEuc3RhcnRUcmFuc2xhdGUgKyBkaWZmKSAqKiByZXNpc3RhbmNlUmF0aW87XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKGRpZmYgPCAwKSB7XG4gICAgaWYgKGlzTG9vcCAmJiBhbGxvd0xvb3BGaXggJiYgIWxvb3BGaXhlZCAmJiBkYXRhLmFsbG93VGhyZXNob2xkTW92ZSAmJiBkYXRhLmN1cnJlbnRUcmFuc2xhdGUgPCAocGFyYW1zLmNlbnRlcmVkU2xpZGVzID8gc3dpcGVyLm1heFRyYW5zbGF0ZSgpICsgc3dpcGVyLnNsaWRlc1NpemVzR3JpZFtzd2lwZXIuc2xpZGVzU2l6ZXNHcmlkLmxlbmd0aCAtIDFdIDogc3dpcGVyLm1heFRyYW5zbGF0ZSgpKSkge1xuICAgICAgc3dpcGVyLmxvb3BGaXgoe1xuICAgICAgICBkaXJlY3Rpb246ICduZXh0JyxcbiAgICAgICAgc2V0VHJhbnNsYXRlOiB0cnVlLFxuICAgICAgICBhY3RpdmVTbGlkZUluZGV4OiBzd2lwZXIuc2xpZGVzLmxlbmd0aCAtIChwYXJhbXMuc2xpZGVzUGVyVmlldyA9PT0gJ2F1dG8nID8gc3dpcGVyLnNsaWRlc1BlclZpZXdEeW5hbWljKCkgOiBNYXRoLmNlaWwocGFyc2VGbG9hdChwYXJhbXMuc2xpZGVzUGVyVmlldywgMTApKSlcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoZGF0YS5jdXJyZW50VHJhbnNsYXRlIDwgc3dpcGVyLm1heFRyYW5zbGF0ZSgpKSB7XG4gICAgICBkaXNhYmxlUGFyZW50U3dpcGVyID0gZmFsc2U7XG4gICAgICBpZiAocGFyYW1zLnJlc2lzdGFuY2UpIHtcbiAgICAgICAgZGF0YS5jdXJyZW50VHJhbnNsYXRlID0gc3dpcGVyLm1heFRyYW5zbGF0ZSgpICsgMSAtIChzd2lwZXIubWF4VHJhbnNsYXRlKCkgLSBkYXRhLnN0YXJ0VHJhbnNsYXRlIC0gZGlmZikgKiogcmVzaXN0YW5jZVJhdGlvO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAoZGlzYWJsZVBhcmVudFN3aXBlcikge1xuICAgIGUucHJldmVudGVkQnlOZXN0ZWRTd2lwZXIgPSB0cnVlO1xuICB9XG5cbiAgLy8gRGlyZWN0aW9ucyBsb2Nrc1xuICBpZiAoIXN3aXBlci5hbGxvd1NsaWRlTmV4dCAmJiBzd2lwZXIuc3dpcGVEaXJlY3Rpb24gPT09ICduZXh0JyAmJiBkYXRhLmN1cnJlbnRUcmFuc2xhdGUgPCBkYXRhLnN0YXJ0VHJhbnNsYXRlKSB7XG4gICAgZGF0YS5jdXJyZW50VHJhbnNsYXRlID0gZGF0YS5zdGFydFRyYW5zbGF0ZTtcbiAgfVxuICBpZiAoIXN3aXBlci5hbGxvd1NsaWRlUHJldiAmJiBzd2lwZXIuc3dpcGVEaXJlY3Rpb24gPT09ICdwcmV2JyAmJiBkYXRhLmN1cnJlbnRUcmFuc2xhdGUgPiBkYXRhLnN0YXJ0VHJhbnNsYXRlKSB7XG4gICAgZGF0YS5jdXJyZW50VHJhbnNsYXRlID0gZGF0YS5zdGFydFRyYW5zbGF0ZTtcbiAgfVxuICBpZiAoIXN3aXBlci5hbGxvd1NsaWRlUHJldiAmJiAhc3dpcGVyLmFsbG93U2xpZGVOZXh0KSB7XG4gICAgZGF0YS5jdXJyZW50VHJhbnNsYXRlID0gZGF0YS5zdGFydFRyYW5zbGF0ZTtcbiAgfVxuXG4gIC8vIFRocmVzaG9sZFxuICBpZiAocGFyYW1zLnRocmVzaG9sZCA+IDApIHtcbiAgICBpZiAoTWF0aC5hYnMoZGlmZikgPiBwYXJhbXMudGhyZXNob2xkIHx8IGRhdGEuYWxsb3dUaHJlc2hvbGRNb3ZlKSB7XG4gICAgICBpZiAoIWRhdGEuYWxsb3dUaHJlc2hvbGRNb3ZlKSB7XG4gICAgICAgIGRhdGEuYWxsb3dUaHJlc2hvbGRNb3ZlID0gdHJ1ZTtcbiAgICAgICAgdG91Y2hlcy5zdGFydFggPSB0b3VjaGVzLmN1cnJlbnRYO1xuICAgICAgICB0b3VjaGVzLnN0YXJ0WSA9IHRvdWNoZXMuY3VycmVudFk7XG4gICAgICAgIGRhdGEuY3VycmVudFRyYW5zbGF0ZSA9IGRhdGEuc3RhcnRUcmFuc2xhdGU7XG4gICAgICAgIHRvdWNoZXMuZGlmZiA9IHN3aXBlci5pc0hvcml6b250YWwoKSA/IHRvdWNoZXMuY3VycmVudFggLSB0b3VjaGVzLnN0YXJ0WCA6IHRvdWNoZXMuY3VycmVudFkgLSB0b3VjaGVzLnN0YXJ0WTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBkYXRhLmN1cnJlbnRUcmFuc2xhdGUgPSBkYXRhLnN0YXJ0VHJhbnNsYXRlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuICBpZiAoIXBhcmFtcy5mb2xsb3dGaW5nZXIgfHwgcGFyYW1zLmNzc01vZGUpIHJldHVybjtcblxuICAvLyBVcGRhdGUgYWN0aXZlIGluZGV4IGluIGZyZWUgbW9kZVxuICBpZiAocGFyYW1zLmZyZWVNb2RlICYmIHBhcmFtcy5mcmVlTW9kZS5lbmFibGVkICYmIHN3aXBlci5mcmVlTW9kZSB8fCBwYXJhbXMud2F0Y2hTbGlkZXNQcm9ncmVzcykge1xuICAgIHN3aXBlci51cGRhdGVBY3RpdmVJbmRleCgpO1xuICAgIHN3aXBlci51cGRhdGVTbGlkZXNDbGFzc2VzKCk7XG4gIH1cbiAgaWYgKHBhcmFtcy5mcmVlTW9kZSAmJiBwYXJhbXMuZnJlZU1vZGUuZW5hYmxlZCAmJiBzd2lwZXIuZnJlZU1vZGUpIHtcbiAgICBzd2lwZXIuZnJlZU1vZGUub25Ub3VjaE1vdmUoKTtcbiAgfVxuICAvLyBVcGRhdGUgcHJvZ3Jlc3NcbiAgc3dpcGVyLnVwZGF0ZVByb2dyZXNzKGRhdGEuY3VycmVudFRyYW5zbGF0ZSk7XG4gIC8vIFVwZGF0ZSB0cmFuc2xhdGVcbiAgc3dpcGVyLnNldFRyYW5zbGF0ZShkYXRhLmN1cnJlbnRUcmFuc2xhdGUpO1xufVxuXG5mdW5jdGlvbiBvblRvdWNoRW5kKGV2ZW50KSB7XG4gIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gIGNvbnN0IGRhdGEgPSBzd2lwZXIudG91Y2hFdmVudHNEYXRhO1xuICBsZXQgZSA9IGV2ZW50O1xuICBpZiAoZS5vcmlnaW5hbEV2ZW50KSBlID0gZS5vcmlnaW5hbEV2ZW50O1xuICBsZXQgdGFyZ2V0VG91Y2g7XG4gIGNvbnN0IGlzVG91Y2hFdmVudCA9IGUudHlwZSA9PT0gJ3RvdWNoZW5kJyB8fCBlLnR5cGUgPT09ICd0b3VjaGNhbmNlbCc7XG4gIGlmICghaXNUb3VjaEV2ZW50KSB7XG4gICAgaWYgKGRhdGEudG91Y2hJZCAhPT0gbnVsbCkgcmV0dXJuOyAvLyByZXR1cm4gZnJvbSBwb2ludGVyIGlmIHdlIHVzZSB0b3VjaFxuICAgIGlmIChlLnBvaW50ZXJJZCAhPT0gZGF0YS5wb2ludGVySWQpIHJldHVybjtcbiAgICB0YXJnZXRUb3VjaCA9IGU7XG4gIH0gZWxzZSB7XG4gICAgdGFyZ2V0VG91Y2ggPSBbLi4uZS5jaGFuZ2VkVG91Y2hlc10uZmlsdGVyKHQgPT4gdC5pZGVudGlmaWVyID09PSBkYXRhLnRvdWNoSWQpWzBdO1xuICAgIGlmICghdGFyZ2V0VG91Y2ggfHwgdGFyZ2V0VG91Y2guaWRlbnRpZmllciAhPT0gZGF0YS50b3VjaElkKSByZXR1cm47XG4gIH1cbiAgaWYgKFsncG9pbnRlcmNhbmNlbCcsICdwb2ludGVyb3V0JywgJ3BvaW50ZXJsZWF2ZScsICdjb250ZXh0bWVudSddLmluY2x1ZGVzKGUudHlwZSkpIHtcbiAgICBjb25zdCBwcm9jZWVkID0gWydwb2ludGVyY2FuY2VsJywgJ2NvbnRleHRtZW51J10uaW5jbHVkZXMoZS50eXBlKSAmJiAoc3dpcGVyLmJyb3dzZXIuaXNTYWZhcmkgfHwgc3dpcGVyLmJyb3dzZXIuaXNXZWJWaWV3KTtcbiAgICBpZiAoIXByb2NlZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cbiAgZGF0YS5wb2ludGVySWQgPSBudWxsO1xuICBkYXRhLnRvdWNoSWQgPSBudWxsO1xuICBjb25zdCB7XG4gICAgcGFyYW1zLFxuICAgIHRvdWNoZXMsXG4gICAgcnRsVHJhbnNsYXRlOiBydGwsXG4gICAgc2xpZGVzR3JpZCxcbiAgICBlbmFibGVkXG4gIH0gPSBzd2lwZXI7XG4gIGlmICghZW5hYmxlZCkgcmV0dXJuO1xuICBpZiAoIXBhcmFtcy5zaW11bGF0ZVRvdWNoICYmIGUucG9pbnRlclR5cGUgPT09ICdtb3VzZScpIHJldHVybjtcbiAgaWYgKGRhdGEuYWxsb3dUb3VjaENhbGxiYWNrcykge1xuICAgIHN3aXBlci5lbWl0KCd0b3VjaEVuZCcsIGUpO1xuICB9XG4gIGRhdGEuYWxsb3dUb3VjaENhbGxiYWNrcyA9IGZhbHNlO1xuICBpZiAoIWRhdGEuaXNUb3VjaGVkKSB7XG4gICAgaWYgKGRhdGEuaXNNb3ZlZCAmJiBwYXJhbXMuZ3JhYkN1cnNvcikge1xuICAgICAgc3dpcGVyLnNldEdyYWJDdXJzb3IoZmFsc2UpO1xuICAgIH1cbiAgICBkYXRhLmlzTW92ZWQgPSBmYWxzZTtcbiAgICBkYXRhLnN0YXJ0TW92aW5nID0gZmFsc2U7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gUmV0dXJuIEdyYWIgQ3Vyc29yXG4gIGlmIChwYXJhbXMuZ3JhYkN1cnNvciAmJiBkYXRhLmlzTW92ZWQgJiYgZGF0YS5pc1RvdWNoZWQgJiYgKHN3aXBlci5hbGxvd1NsaWRlTmV4dCA9PT0gdHJ1ZSB8fCBzd2lwZXIuYWxsb3dTbGlkZVByZXYgPT09IHRydWUpKSB7XG4gICAgc3dpcGVyLnNldEdyYWJDdXJzb3IoZmFsc2UpO1xuICB9XG5cbiAgLy8gVGltZSBkaWZmXG4gIGNvbnN0IHRvdWNoRW5kVGltZSA9IG5vdygpO1xuICBjb25zdCB0aW1lRGlmZiA9IHRvdWNoRW5kVGltZSAtIGRhdGEudG91Y2hTdGFydFRpbWU7XG5cbiAgLy8gVGFwLCBkb3VibGVUYXAsIENsaWNrXG4gIGlmIChzd2lwZXIuYWxsb3dDbGljaykge1xuICAgIGNvbnN0IHBhdGhUcmVlID0gZS5wYXRoIHx8IGUuY29tcG9zZWRQYXRoICYmIGUuY29tcG9zZWRQYXRoKCk7XG4gICAgc3dpcGVyLnVwZGF0ZUNsaWNrZWRTbGlkZShwYXRoVHJlZSAmJiBwYXRoVHJlZVswXSB8fCBlLnRhcmdldCwgcGF0aFRyZWUpO1xuICAgIHN3aXBlci5lbWl0KCd0YXAgY2xpY2snLCBlKTtcbiAgICBpZiAodGltZURpZmYgPCAzMDAgJiYgdG91Y2hFbmRUaW1lIC0gZGF0YS5sYXN0Q2xpY2tUaW1lIDwgMzAwKSB7XG4gICAgICBzd2lwZXIuZW1pdCgnZG91YmxlVGFwIGRvdWJsZUNsaWNrJywgZSk7XG4gICAgfVxuICB9XG4gIGRhdGEubGFzdENsaWNrVGltZSA9IG5vdygpO1xuICBuZXh0VGljaygoKSA9PiB7XG4gICAgaWYgKCFzd2lwZXIuZGVzdHJveWVkKSBzd2lwZXIuYWxsb3dDbGljayA9IHRydWU7XG4gIH0pO1xuICBpZiAoIWRhdGEuaXNUb3VjaGVkIHx8ICFkYXRhLmlzTW92ZWQgfHwgIXN3aXBlci5zd2lwZURpcmVjdGlvbiB8fCB0b3VjaGVzLmRpZmYgPT09IDAgJiYgIWRhdGEubG9vcFN3YXBSZXNldCB8fCBkYXRhLmN1cnJlbnRUcmFuc2xhdGUgPT09IGRhdGEuc3RhcnRUcmFuc2xhdGUgJiYgIWRhdGEubG9vcFN3YXBSZXNldCkge1xuICAgIGRhdGEuaXNUb3VjaGVkID0gZmFsc2U7XG4gICAgZGF0YS5pc01vdmVkID0gZmFsc2U7XG4gICAgZGF0YS5zdGFydE1vdmluZyA9IGZhbHNlO1xuICAgIHJldHVybjtcbiAgfVxuICBkYXRhLmlzVG91Y2hlZCA9IGZhbHNlO1xuICBkYXRhLmlzTW92ZWQgPSBmYWxzZTtcbiAgZGF0YS5zdGFydE1vdmluZyA9IGZhbHNlO1xuICBsZXQgY3VycmVudFBvcztcbiAgaWYgKHBhcmFtcy5mb2xsb3dGaW5nZXIpIHtcbiAgICBjdXJyZW50UG9zID0gcnRsID8gc3dpcGVyLnRyYW5zbGF0ZSA6IC1zd2lwZXIudHJhbnNsYXRlO1xuICB9IGVsc2Uge1xuICAgIGN1cnJlbnRQb3MgPSAtZGF0YS5jdXJyZW50VHJhbnNsYXRlO1xuICB9XG4gIGlmIChwYXJhbXMuY3NzTW9kZSkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAocGFyYW1zLmZyZWVNb2RlICYmIHBhcmFtcy5mcmVlTW9kZS5lbmFibGVkKSB7XG4gICAgc3dpcGVyLmZyZWVNb2RlLm9uVG91Y2hFbmQoe1xuICAgICAgY3VycmVudFBvc1xuICAgIH0pO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIEZpbmQgY3VycmVudCBzbGlkZVxuICBjb25zdCBzd2lwZVRvTGFzdCA9IGN1cnJlbnRQb3MgPj0gLXN3aXBlci5tYXhUcmFuc2xhdGUoKSAmJiAhc3dpcGVyLnBhcmFtcy5sb29wO1xuICBsZXQgc3RvcEluZGV4ID0gMDtcbiAgbGV0IGdyb3VwU2l6ZSA9IHN3aXBlci5zbGlkZXNTaXplc0dyaWRbMF07XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc2xpZGVzR3JpZC5sZW5ndGg7IGkgKz0gaSA8IHBhcmFtcy5zbGlkZXNQZXJHcm91cFNraXAgPyAxIDogcGFyYW1zLnNsaWRlc1Blckdyb3VwKSB7XG4gICAgY29uc3QgaW5jcmVtZW50ID0gaSA8IHBhcmFtcy5zbGlkZXNQZXJHcm91cFNraXAgLSAxID8gMSA6IHBhcmFtcy5zbGlkZXNQZXJHcm91cDtcbiAgICBpZiAodHlwZW9mIHNsaWRlc0dyaWRbaSArIGluY3JlbWVudF0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBpZiAoc3dpcGVUb0xhc3QgfHwgY3VycmVudFBvcyA+PSBzbGlkZXNHcmlkW2ldICYmIGN1cnJlbnRQb3MgPCBzbGlkZXNHcmlkW2kgKyBpbmNyZW1lbnRdKSB7XG4gICAgICAgIHN0b3BJbmRleCA9IGk7XG4gICAgICAgIGdyb3VwU2l6ZSA9IHNsaWRlc0dyaWRbaSArIGluY3JlbWVudF0gLSBzbGlkZXNHcmlkW2ldO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoc3dpcGVUb0xhc3QgfHwgY3VycmVudFBvcyA+PSBzbGlkZXNHcmlkW2ldKSB7XG4gICAgICBzdG9wSW5kZXggPSBpO1xuICAgICAgZ3JvdXBTaXplID0gc2xpZGVzR3JpZFtzbGlkZXNHcmlkLmxlbmd0aCAtIDFdIC0gc2xpZGVzR3JpZFtzbGlkZXNHcmlkLmxlbmd0aCAtIDJdO1xuICAgIH1cbiAgfVxuICBsZXQgcmV3aW5kRmlyc3RJbmRleCA9IG51bGw7XG4gIGxldCByZXdpbmRMYXN0SW5kZXggPSBudWxsO1xuICBpZiAocGFyYW1zLnJld2luZCkge1xuICAgIGlmIChzd2lwZXIuaXNCZWdpbm5pbmcpIHtcbiAgICAgIHJld2luZExhc3RJbmRleCA9IHBhcmFtcy52aXJ0dWFsICYmIHBhcmFtcy52aXJ0dWFsLmVuYWJsZWQgJiYgc3dpcGVyLnZpcnR1YWwgPyBzd2lwZXIudmlydHVhbC5zbGlkZXMubGVuZ3RoIC0gMSA6IHN3aXBlci5zbGlkZXMubGVuZ3RoIC0gMTtcbiAgICB9IGVsc2UgaWYgKHN3aXBlci5pc0VuZCkge1xuICAgICAgcmV3aW5kRmlyc3RJbmRleCA9IDA7XG4gICAgfVxuICB9XG4gIC8vIEZpbmQgY3VycmVudCBzbGlkZSBzaXplXG4gIGNvbnN0IHJhdGlvID0gKGN1cnJlbnRQb3MgLSBzbGlkZXNHcmlkW3N0b3BJbmRleF0pIC8gZ3JvdXBTaXplO1xuICBjb25zdCBpbmNyZW1lbnQgPSBzdG9wSW5kZXggPCBwYXJhbXMuc2xpZGVzUGVyR3JvdXBTa2lwIC0gMSA/IDEgOiBwYXJhbXMuc2xpZGVzUGVyR3JvdXA7XG4gIGlmICh0aW1lRGlmZiA+IHBhcmFtcy5sb25nU3dpcGVzTXMpIHtcbiAgICAvLyBMb25nIHRvdWNoZXNcbiAgICBpZiAoIXBhcmFtcy5sb25nU3dpcGVzKSB7XG4gICAgICBzd2lwZXIuc2xpZGVUbyhzd2lwZXIuYWN0aXZlSW5kZXgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoc3dpcGVyLnN3aXBlRGlyZWN0aW9uID09PSAnbmV4dCcpIHtcbiAgICAgIGlmIChyYXRpbyA+PSBwYXJhbXMubG9uZ1N3aXBlc1JhdGlvKSBzd2lwZXIuc2xpZGVUbyhwYXJhbXMucmV3aW5kICYmIHN3aXBlci5pc0VuZCA/IHJld2luZEZpcnN0SW5kZXggOiBzdG9wSW5kZXggKyBpbmNyZW1lbnQpO2Vsc2Ugc3dpcGVyLnNsaWRlVG8oc3RvcEluZGV4KTtcbiAgICB9XG4gICAgaWYgKHN3aXBlci5zd2lwZURpcmVjdGlvbiA9PT0gJ3ByZXYnKSB7XG4gICAgICBpZiAocmF0aW8gPiAxIC0gcGFyYW1zLmxvbmdTd2lwZXNSYXRpbykge1xuICAgICAgICBzd2lwZXIuc2xpZGVUbyhzdG9wSW5kZXggKyBpbmNyZW1lbnQpO1xuICAgICAgfSBlbHNlIGlmIChyZXdpbmRMYXN0SW5kZXggIT09IG51bGwgJiYgcmF0aW8gPCAwICYmIE1hdGguYWJzKHJhdGlvKSA+IHBhcmFtcy5sb25nU3dpcGVzUmF0aW8pIHtcbiAgICAgICAgc3dpcGVyLnNsaWRlVG8ocmV3aW5kTGFzdEluZGV4KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN3aXBlci5zbGlkZVRvKHN0b3BJbmRleCk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIFNob3J0IHN3aXBlc1xuICAgIGlmICghcGFyYW1zLnNob3J0U3dpcGVzKSB7XG4gICAgICBzd2lwZXIuc2xpZGVUbyhzd2lwZXIuYWN0aXZlSW5kZXgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBpc05hdkJ1dHRvblRhcmdldCA9IHN3aXBlci5uYXZpZ2F0aW9uICYmIChlLnRhcmdldCA9PT0gc3dpcGVyLm5hdmlnYXRpb24ubmV4dEVsIHx8IGUudGFyZ2V0ID09PSBzd2lwZXIubmF2aWdhdGlvbi5wcmV2RWwpO1xuICAgIGlmICghaXNOYXZCdXR0b25UYXJnZXQpIHtcbiAgICAgIGlmIChzd2lwZXIuc3dpcGVEaXJlY3Rpb24gPT09ICduZXh0Jykge1xuICAgICAgICBzd2lwZXIuc2xpZGVUbyhyZXdpbmRGaXJzdEluZGV4ICE9PSBudWxsID8gcmV3aW5kRmlyc3RJbmRleCA6IHN0b3BJbmRleCArIGluY3JlbWVudCk7XG4gICAgICB9XG4gICAgICBpZiAoc3dpcGVyLnN3aXBlRGlyZWN0aW9uID09PSAncHJldicpIHtcbiAgICAgICAgc3dpcGVyLnNsaWRlVG8ocmV3aW5kTGFzdEluZGV4ICE9PSBudWxsID8gcmV3aW5kTGFzdEluZGV4IDogc3RvcEluZGV4KTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGUudGFyZ2V0ID09PSBzd2lwZXIubmF2aWdhdGlvbi5uZXh0RWwpIHtcbiAgICAgIHN3aXBlci5zbGlkZVRvKHN0b3BJbmRleCArIGluY3JlbWVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN3aXBlci5zbGlkZVRvKHN0b3BJbmRleCk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIG9uUmVzaXplKCkge1xuICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICBjb25zdCB7XG4gICAgcGFyYW1zLFxuICAgIGVsXG4gIH0gPSBzd2lwZXI7XG4gIGlmIChlbCAmJiBlbC5vZmZzZXRXaWR0aCA9PT0gMCkgcmV0dXJuO1xuXG4gIC8vIEJyZWFrcG9pbnRzXG4gIGlmIChwYXJhbXMuYnJlYWtwb2ludHMpIHtcbiAgICBzd2lwZXIuc2V0QnJlYWtwb2ludCgpO1xuICB9XG5cbiAgLy8gU2F2ZSBsb2Nrc1xuICBjb25zdCB7XG4gICAgYWxsb3dTbGlkZU5leHQsXG4gICAgYWxsb3dTbGlkZVByZXYsXG4gICAgc25hcEdyaWRcbiAgfSA9IHN3aXBlcjtcbiAgY29uc3QgaXNWaXJ0dWFsID0gc3dpcGVyLnZpcnR1YWwgJiYgc3dpcGVyLnBhcmFtcy52aXJ0dWFsLmVuYWJsZWQ7XG5cbiAgLy8gRGlzYWJsZSBsb2NrcyBvbiByZXNpemVcbiAgc3dpcGVyLmFsbG93U2xpZGVOZXh0ID0gdHJ1ZTtcbiAgc3dpcGVyLmFsbG93U2xpZGVQcmV2ID0gdHJ1ZTtcbiAgc3dpcGVyLnVwZGF0ZVNpemUoKTtcbiAgc3dpcGVyLnVwZGF0ZVNsaWRlcygpO1xuICBzd2lwZXIudXBkYXRlU2xpZGVzQ2xhc3NlcygpO1xuICBjb25zdCBpc1ZpcnR1YWxMb29wID0gaXNWaXJ0dWFsICYmIHBhcmFtcy5sb29wO1xuICBpZiAoKHBhcmFtcy5zbGlkZXNQZXJWaWV3ID09PSAnYXV0bycgfHwgcGFyYW1zLnNsaWRlc1BlclZpZXcgPiAxKSAmJiBzd2lwZXIuaXNFbmQgJiYgIXN3aXBlci5pc0JlZ2lubmluZyAmJiAhc3dpcGVyLnBhcmFtcy5jZW50ZXJlZFNsaWRlcyAmJiAhaXNWaXJ0dWFsTG9vcCkge1xuICAgIHN3aXBlci5zbGlkZVRvKHN3aXBlci5zbGlkZXMubGVuZ3RoIC0gMSwgMCwgZmFsc2UsIHRydWUpO1xuICB9IGVsc2Uge1xuICAgIGlmIChzd2lwZXIucGFyYW1zLmxvb3AgJiYgIWlzVmlydHVhbCkge1xuICAgICAgc3dpcGVyLnNsaWRlVG9Mb29wKHN3aXBlci5yZWFsSW5kZXgsIDAsIGZhbHNlLCB0cnVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3dpcGVyLnNsaWRlVG8oc3dpcGVyLmFjdGl2ZUluZGV4LCAwLCBmYWxzZSwgdHJ1ZSk7XG4gICAgfVxuICB9XG4gIGlmIChzd2lwZXIuYXV0b3BsYXkgJiYgc3dpcGVyLmF1dG9wbGF5LnJ1bm5pbmcgJiYgc3dpcGVyLmF1dG9wbGF5LnBhdXNlZCkge1xuICAgIGNsZWFyVGltZW91dChzd2lwZXIuYXV0b3BsYXkucmVzaXplVGltZW91dCk7XG4gICAgc3dpcGVyLmF1dG9wbGF5LnJlc2l6ZVRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmIChzd2lwZXIuYXV0b3BsYXkgJiYgc3dpcGVyLmF1dG9wbGF5LnJ1bm5pbmcgJiYgc3dpcGVyLmF1dG9wbGF5LnBhdXNlZCkge1xuICAgICAgICBzd2lwZXIuYXV0b3BsYXkucmVzdW1lKCk7XG4gICAgICB9XG4gICAgfSwgNTAwKTtcbiAgfVxuICAvLyBSZXR1cm4gbG9ja3MgYWZ0ZXIgcmVzaXplXG4gIHN3aXBlci5hbGxvd1NsaWRlUHJldiA9IGFsbG93U2xpZGVQcmV2O1xuICBzd2lwZXIuYWxsb3dTbGlkZU5leHQgPSBhbGxvd1NsaWRlTmV4dDtcbiAgaWYgKHN3aXBlci5wYXJhbXMud2F0Y2hPdmVyZmxvdyAmJiBzbmFwR3JpZCAhPT0gc3dpcGVyLnNuYXBHcmlkKSB7XG4gICAgc3dpcGVyLmNoZWNrT3ZlcmZsb3coKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBvbkNsaWNrKGUpIHtcbiAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgaWYgKCFzd2lwZXIuZW5hYmxlZCkgcmV0dXJuO1xuICBpZiAoIXN3aXBlci5hbGxvd0NsaWNrKSB7XG4gICAgaWYgKHN3aXBlci5wYXJhbXMucHJldmVudENsaWNrcykgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGlmIChzd2lwZXIucGFyYW1zLnByZXZlbnRDbGlja3NQcm9wYWdhdGlvbiAmJiBzd2lwZXIuYW5pbWF0aW5nKSB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gb25TY3JvbGwoKSB7XG4gIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gIGNvbnN0IHtcbiAgICB3cmFwcGVyRWwsXG4gICAgcnRsVHJhbnNsYXRlLFxuICAgIGVuYWJsZWRcbiAgfSA9IHN3aXBlcjtcbiAgaWYgKCFlbmFibGVkKSByZXR1cm47XG4gIHN3aXBlci5wcmV2aW91c1RyYW5zbGF0ZSA9IHN3aXBlci50cmFuc2xhdGU7XG4gIGlmIChzd2lwZXIuaXNIb3Jpem9udGFsKCkpIHtcbiAgICBzd2lwZXIudHJhbnNsYXRlID0gLXdyYXBwZXJFbC5zY3JvbGxMZWZ0O1xuICB9IGVsc2Uge1xuICAgIHN3aXBlci50cmFuc2xhdGUgPSAtd3JhcHBlckVsLnNjcm9sbFRvcDtcbiAgfVxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgaWYgKHN3aXBlci50cmFuc2xhdGUgPT09IDApIHN3aXBlci50cmFuc2xhdGUgPSAwO1xuICBzd2lwZXIudXBkYXRlQWN0aXZlSW5kZXgoKTtcbiAgc3dpcGVyLnVwZGF0ZVNsaWRlc0NsYXNzZXMoKTtcbiAgbGV0IG5ld1Byb2dyZXNzO1xuICBjb25zdCB0cmFuc2xhdGVzRGlmZiA9IHN3aXBlci5tYXhUcmFuc2xhdGUoKSAtIHN3aXBlci5taW5UcmFuc2xhdGUoKTtcbiAgaWYgKHRyYW5zbGF0ZXNEaWZmID09PSAwKSB7XG4gICAgbmV3UHJvZ3Jlc3MgPSAwO1xuICB9IGVsc2Uge1xuICAgIG5ld1Byb2dyZXNzID0gKHN3aXBlci50cmFuc2xhdGUgLSBzd2lwZXIubWluVHJhbnNsYXRlKCkpIC8gdHJhbnNsYXRlc0RpZmY7XG4gIH1cbiAgaWYgKG5ld1Byb2dyZXNzICE9PSBzd2lwZXIucHJvZ3Jlc3MpIHtcbiAgICBzd2lwZXIudXBkYXRlUHJvZ3Jlc3MocnRsVHJhbnNsYXRlID8gLXN3aXBlci50cmFuc2xhdGUgOiBzd2lwZXIudHJhbnNsYXRlKTtcbiAgfVxuICBzd2lwZXIuZW1pdCgnc2V0VHJhbnNsYXRlJywgc3dpcGVyLnRyYW5zbGF0ZSwgZmFsc2UpO1xufVxuXG5mdW5jdGlvbiBvbkxvYWQoZSkge1xuICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICBwcm9jZXNzTGF6eVByZWxvYWRlcihzd2lwZXIsIGUudGFyZ2V0KTtcbiAgaWYgKHN3aXBlci5wYXJhbXMuY3NzTW9kZSB8fCBzd2lwZXIucGFyYW1zLnNsaWRlc1BlclZpZXcgIT09ICdhdXRvJyAmJiAhc3dpcGVyLnBhcmFtcy5hdXRvSGVpZ2h0KSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHN3aXBlci51cGRhdGUoKTtcbn1cblxuZnVuY3Rpb24gb25Eb2N1bWVudFRvdWNoU3RhcnQoKSB7XG4gIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gIGlmIChzd2lwZXIuZG9jdW1lbnRUb3VjaEhhbmRsZXJQcm9jZWVkZWQpIHJldHVybjtcbiAgc3dpcGVyLmRvY3VtZW50VG91Y2hIYW5kbGVyUHJvY2VlZGVkID0gdHJ1ZTtcbiAgaWYgKHN3aXBlci5wYXJhbXMudG91Y2hSZWxlYXNlT25FZGdlcykge1xuICAgIHN3aXBlci5lbC5zdHlsZS50b3VjaEFjdGlvbiA9ICdhdXRvJztcbiAgfVxufVxuXG5jb25zdCBldmVudHMgPSAoc3dpcGVyLCBtZXRob2QpID0+IHtcbiAgY29uc3QgZG9jdW1lbnQgPSBnZXREb2N1bWVudCgpO1xuICBjb25zdCB7XG4gICAgcGFyYW1zLFxuICAgIGVsLFxuICAgIHdyYXBwZXJFbCxcbiAgICBkZXZpY2VcbiAgfSA9IHN3aXBlcjtcbiAgY29uc3QgY2FwdHVyZSA9ICEhcGFyYW1zLm5lc3RlZDtcbiAgY29uc3QgZG9tTWV0aG9kID0gbWV0aG9kID09PSAnb24nID8gJ2FkZEV2ZW50TGlzdGVuZXInIDogJ3JlbW92ZUV2ZW50TGlzdGVuZXInO1xuICBjb25zdCBzd2lwZXJNZXRob2QgPSBtZXRob2Q7XG5cbiAgLy8gVG91Y2ggRXZlbnRzXG4gIGRvY3VtZW50W2RvbU1ldGhvZF0oJ3RvdWNoc3RhcnQnLCBzd2lwZXIub25Eb2N1bWVudFRvdWNoU3RhcnQsIHtcbiAgICBwYXNzaXZlOiBmYWxzZSxcbiAgICBjYXB0dXJlXG4gIH0pO1xuICBlbFtkb21NZXRob2RdKCd0b3VjaHN0YXJ0Jywgc3dpcGVyLm9uVG91Y2hTdGFydCwge1xuICAgIHBhc3NpdmU6IGZhbHNlXG4gIH0pO1xuICBlbFtkb21NZXRob2RdKCdwb2ludGVyZG93bicsIHN3aXBlci5vblRvdWNoU3RhcnQsIHtcbiAgICBwYXNzaXZlOiBmYWxzZVxuICB9KTtcbiAgZG9jdW1lbnRbZG9tTWV0aG9kXSgndG91Y2htb3ZlJywgc3dpcGVyLm9uVG91Y2hNb3ZlLCB7XG4gICAgcGFzc2l2ZTogZmFsc2UsXG4gICAgY2FwdHVyZVxuICB9KTtcbiAgZG9jdW1lbnRbZG9tTWV0aG9kXSgncG9pbnRlcm1vdmUnLCBzd2lwZXIub25Ub3VjaE1vdmUsIHtcbiAgICBwYXNzaXZlOiBmYWxzZSxcbiAgICBjYXB0dXJlXG4gIH0pO1xuICBkb2N1bWVudFtkb21NZXRob2RdKCd0b3VjaGVuZCcsIHN3aXBlci5vblRvdWNoRW5kLCB7XG4gICAgcGFzc2l2ZTogdHJ1ZVxuICB9KTtcbiAgZG9jdW1lbnRbZG9tTWV0aG9kXSgncG9pbnRlcnVwJywgc3dpcGVyLm9uVG91Y2hFbmQsIHtcbiAgICBwYXNzaXZlOiB0cnVlXG4gIH0pO1xuICBkb2N1bWVudFtkb21NZXRob2RdKCdwb2ludGVyY2FuY2VsJywgc3dpcGVyLm9uVG91Y2hFbmQsIHtcbiAgICBwYXNzaXZlOiB0cnVlXG4gIH0pO1xuICBkb2N1bWVudFtkb21NZXRob2RdKCd0b3VjaGNhbmNlbCcsIHN3aXBlci5vblRvdWNoRW5kLCB7XG4gICAgcGFzc2l2ZTogdHJ1ZVxuICB9KTtcbiAgZG9jdW1lbnRbZG9tTWV0aG9kXSgncG9pbnRlcm91dCcsIHN3aXBlci5vblRvdWNoRW5kLCB7XG4gICAgcGFzc2l2ZTogdHJ1ZVxuICB9KTtcbiAgZG9jdW1lbnRbZG9tTWV0aG9kXSgncG9pbnRlcmxlYXZlJywgc3dpcGVyLm9uVG91Y2hFbmQsIHtcbiAgICBwYXNzaXZlOiB0cnVlXG4gIH0pO1xuICBkb2N1bWVudFtkb21NZXRob2RdKCdjb250ZXh0bWVudScsIHN3aXBlci5vblRvdWNoRW5kLCB7XG4gICAgcGFzc2l2ZTogdHJ1ZVxuICB9KTtcblxuICAvLyBQcmV2ZW50IExpbmtzIENsaWNrc1xuICBpZiAocGFyYW1zLnByZXZlbnRDbGlja3MgfHwgcGFyYW1zLnByZXZlbnRDbGlja3NQcm9wYWdhdGlvbikge1xuICAgIGVsW2RvbU1ldGhvZF0oJ2NsaWNrJywgc3dpcGVyLm9uQ2xpY2ssIHRydWUpO1xuICB9XG4gIGlmIChwYXJhbXMuY3NzTW9kZSkge1xuICAgIHdyYXBwZXJFbFtkb21NZXRob2RdKCdzY3JvbGwnLCBzd2lwZXIub25TY3JvbGwpO1xuICB9XG5cbiAgLy8gUmVzaXplIGhhbmRsZXJcbiAgaWYgKHBhcmFtcy51cGRhdGVPbldpbmRvd1Jlc2l6ZSkge1xuICAgIHN3aXBlcltzd2lwZXJNZXRob2RdKGRldmljZS5pb3MgfHwgZGV2aWNlLmFuZHJvaWQgPyAncmVzaXplIG9yaWVudGF0aW9uY2hhbmdlIG9ic2VydmVyVXBkYXRlJyA6ICdyZXNpemUgb2JzZXJ2ZXJVcGRhdGUnLCBvblJlc2l6ZSwgdHJ1ZSk7XG4gIH0gZWxzZSB7XG4gICAgc3dpcGVyW3N3aXBlck1ldGhvZF0oJ29ic2VydmVyVXBkYXRlJywgb25SZXNpemUsIHRydWUpO1xuICB9XG5cbiAgLy8gSW1hZ2VzIGxvYWRlclxuICBlbFtkb21NZXRob2RdKCdsb2FkJywgc3dpcGVyLm9uTG9hZCwge1xuICAgIGNhcHR1cmU6IHRydWVcbiAgfSk7XG59O1xuZnVuY3Rpb24gYXR0YWNoRXZlbnRzKCkge1xuICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICBjb25zdCB7XG4gICAgcGFyYW1zXG4gIH0gPSBzd2lwZXI7XG4gIHN3aXBlci5vblRvdWNoU3RhcnQgPSBvblRvdWNoU3RhcnQuYmluZChzd2lwZXIpO1xuICBzd2lwZXIub25Ub3VjaE1vdmUgPSBvblRvdWNoTW92ZS5iaW5kKHN3aXBlcik7XG4gIHN3aXBlci5vblRvdWNoRW5kID0gb25Ub3VjaEVuZC5iaW5kKHN3aXBlcik7XG4gIHN3aXBlci5vbkRvY3VtZW50VG91Y2hTdGFydCA9IG9uRG9jdW1lbnRUb3VjaFN0YXJ0LmJpbmQoc3dpcGVyKTtcbiAgaWYgKHBhcmFtcy5jc3NNb2RlKSB7XG4gICAgc3dpcGVyLm9uU2Nyb2xsID0gb25TY3JvbGwuYmluZChzd2lwZXIpO1xuICB9XG4gIHN3aXBlci5vbkNsaWNrID0gb25DbGljay5iaW5kKHN3aXBlcik7XG4gIHN3aXBlci5vbkxvYWQgPSBvbkxvYWQuYmluZChzd2lwZXIpO1xuICBldmVudHMoc3dpcGVyLCAnb24nKTtcbn1cbmZ1bmN0aW9uIGRldGFjaEV2ZW50cygpIHtcbiAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgZXZlbnRzKHN3aXBlciwgJ29mZicpO1xufVxudmFyIGV2ZW50cyQxID0ge1xuICBhdHRhY2hFdmVudHMsXG4gIGRldGFjaEV2ZW50c1xufTtcblxuY29uc3QgaXNHcmlkRW5hYmxlZCA9IChzd2lwZXIsIHBhcmFtcykgPT4ge1xuICByZXR1cm4gc3dpcGVyLmdyaWQgJiYgcGFyYW1zLmdyaWQgJiYgcGFyYW1zLmdyaWQucm93cyA+IDE7XG59O1xuZnVuY3Rpb24gc2V0QnJlYWtwb2ludCgpIHtcbiAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgY29uc3Qge1xuICAgIHJlYWxJbmRleCxcbiAgICBpbml0aWFsaXplZCxcbiAgICBwYXJhbXMsXG4gICAgZWxcbiAgfSA9IHN3aXBlcjtcbiAgY29uc3QgYnJlYWtwb2ludHMgPSBwYXJhbXMuYnJlYWtwb2ludHM7XG4gIGlmICghYnJlYWtwb2ludHMgfHwgYnJlYWtwb2ludHMgJiYgT2JqZWN0LmtleXMoYnJlYWtwb2ludHMpLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuXG4gIC8vIEdldCBicmVha3BvaW50IGZvciB3aW5kb3cgd2lkdGggYW5kIHVwZGF0ZSBwYXJhbWV0ZXJzXG4gIGNvbnN0IGJyZWFrcG9pbnQgPSBzd2lwZXIuZ2V0QnJlYWtwb2ludChicmVha3BvaW50cywgc3dpcGVyLnBhcmFtcy5icmVha3BvaW50c0Jhc2UsIHN3aXBlci5lbCk7XG4gIGlmICghYnJlYWtwb2ludCB8fCBzd2lwZXIuY3VycmVudEJyZWFrcG9pbnQgPT09IGJyZWFrcG9pbnQpIHJldHVybjtcbiAgY29uc3QgYnJlYWtwb2ludE9ubHlQYXJhbXMgPSBicmVha3BvaW50IGluIGJyZWFrcG9pbnRzID8gYnJlYWtwb2ludHNbYnJlYWtwb2ludF0gOiB1bmRlZmluZWQ7XG4gIGNvbnN0IGJyZWFrcG9pbnRQYXJhbXMgPSBicmVha3BvaW50T25seVBhcmFtcyB8fCBzd2lwZXIub3JpZ2luYWxQYXJhbXM7XG4gIGNvbnN0IHdhc011bHRpUm93ID0gaXNHcmlkRW5hYmxlZChzd2lwZXIsIHBhcmFtcyk7XG4gIGNvbnN0IGlzTXVsdGlSb3cgPSBpc0dyaWRFbmFibGVkKHN3aXBlciwgYnJlYWtwb2ludFBhcmFtcyk7XG4gIGNvbnN0IHdhc0VuYWJsZWQgPSBwYXJhbXMuZW5hYmxlZDtcbiAgaWYgKHdhc011bHRpUm93ICYmICFpc011bHRpUm93KSB7XG4gICAgZWwuY2xhc3NMaXN0LnJlbW92ZShgJHtwYXJhbXMuY29udGFpbmVyTW9kaWZpZXJDbGFzc31ncmlkYCwgYCR7cGFyYW1zLmNvbnRhaW5lck1vZGlmaWVyQ2xhc3N9Z3JpZC1jb2x1bW5gKTtcbiAgICBzd2lwZXIuZW1pdENvbnRhaW5lckNsYXNzZXMoKTtcbiAgfSBlbHNlIGlmICghd2FzTXVsdGlSb3cgJiYgaXNNdWx0aVJvdykge1xuICAgIGVsLmNsYXNzTGlzdC5hZGQoYCR7cGFyYW1zLmNvbnRhaW5lck1vZGlmaWVyQ2xhc3N9Z3JpZGApO1xuICAgIGlmIChicmVha3BvaW50UGFyYW1zLmdyaWQuZmlsbCAmJiBicmVha3BvaW50UGFyYW1zLmdyaWQuZmlsbCA9PT0gJ2NvbHVtbicgfHwgIWJyZWFrcG9pbnRQYXJhbXMuZ3JpZC5maWxsICYmIHBhcmFtcy5ncmlkLmZpbGwgPT09ICdjb2x1bW4nKSB7XG4gICAgICBlbC5jbGFzc0xpc3QuYWRkKGAke3BhcmFtcy5jb250YWluZXJNb2RpZmllckNsYXNzfWdyaWQtY29sdW1uYCk7XG4gICAgfVxuICAgIHN3aXBlci5lbWl0Q29udGFpbmVyQ2xhc3NlcygpO1xuICB9XG5cbiAgLy8gVG9nZ2xlIG5hdmlnYXRpb24sIHBhZ2luYXRpb24sIHNjcm9sbGJhclxuICBbJ25hdmlnYXRpb24nLCAncGFnaW5hdGlvbicsICdzY3JvbGxiYXInXS5mb3JFYWNoKHByb3AgPT4ge1xuICAgIGlmICh0eXBlb2YgYnJlYWtwb2ludFBhcmFtc1twcm9wXSA9PT0gJ3VuZGVmaW5lZCcpIHJldHVybjtcbiAgICBjb25zdCB3YXNNb2R1bGVFbmFibGVkID0gcGFyYW1zW3Byb3BdICYmIHBhcmFtc1twcm9wXS5lbmFibGVkO1xuICAgIGNvbnN0IGlzTW9kdWxlRW5hYmxlZCA9IGJyZWFrcG9pbnRQYXJhbXNbcHJvcF0gJiYgYnJlYWtwb2ludFBhcmFtc1twcm9wXS5lbmFibGVkO1xuICAgIGlmICh3YXNNb2R1bGVFbmFibGVkICYmICFpc01vZHVsZUVuYWJsZWQpIHtcbiAgICAgIHN3aXBlcltwcm9wXS5kaXNhYmxlKCk7XG4gICAgfVxuICAgIGlmICghd2FzTW9kdWxlRW5hYmxlZCAmJiBpc01vZHVsZUVuYWJsZWQpIHtcbiAgICAgIHN3aXBlcltwcm9wXS5lbmFibGUoKTtcbiAgICB9XG4gIH0pO1xuICBjb25zdCBkaXJlY3Rpb25DaGFuZ2VkID0gYnJlYWtwb2ludFBhcmFtcy5kaXJlY3Rpb24gJiYgYnJlYWtwb2ludFBhcmFtcy5kaXJlY3Rpb24gIT09IHBhcmFtcy5kaXJlY3Rpb247XG4gIGNvbnN0IG5lZWRzUmVMb29wID0gcGFyYW1zLmxvb3AgJiYgKGJyZWFrcG9pbnRQYXJhbXMuc2xpZGVzUGVyVmlldyAhPT0gcGFyYW1zLnNsaWRlc1BlclZpZXcgfHwgZGlyZWN0aW9uQ2hhbmdlZCk7XG4gIGNvbnN0IHdhc0xvb3AgPSBwYXJhbXMubG9vcDtcbiAgaWYgKGRpcmVjdGlvbkNoYW5nZWQgJiYgaW5pdGlhbGl6ZWQpIHtcbiAgICBzd2lwZXIuY2hhbmdlRGlyZWN0aW9uKCk7XG4gIH1cbiAgZXh0ZW5kKHN3aXBlci5wYXJhbXMsIGJyZWFrcG9pbnRQYXJhbXMpO1xuICBjb25zdCBpc0VuYWJsZWQgPSBzd2lwZXIucGFyYW1zLmVuYWJsZWQ7XG4gIGNvbnN0IGhhc0xvb3AgPSBzd2lwZXIucGFyYW1zLmxvb3A7XG4gIE9iamVjdC5hc3NpZ24oc3dpcGVyLCB7XG4gICAgYWxsb3dUb3VjaE1vdmU6IHN3aXBlci5wYXJhbXMuYWxsb3dUb3VjaE1vdmUsXG4gICAgYWxsb3dTbGlkZU5leHQ6IHN3aXBlci5wYXJhbXMuYWxsb3dTbGlkZU5leHQsXG4gICAgYWxsb3dTbGlkZVByZXY6IHN3aXBlci5wYXJhbXMuYWxsb3dTbGlkZVByZXZcbiAgfSk7XG4gIGlmICh3YXNFbmFibGVkICYmICFpc0VuYWJsZWQpIHtcbiAgICBzd2lwZXIuZGlzYWJsZSgpO1xuICB9IGVsc2UgaWYgKCF3YXNFbmFibGVkICYmIGlzRW5hYmxlZCkge1xuICAgIHN3aXBlci5lbmFibGUoKTtcbiAgfVxuICBzd2lwZXIuY3VycmVudEJyZWFrcG9pbnQgPSBicmVha3BvaW50O1xuICBzd2lwZXIuZW1pdCgnX2JlZm9yZUJyZWFrcG9pbnQnLCBicmVha3BvaW50UGFyYW1zKTtcbiAgaWYgKGluaXRpYWxpemVkKSB7XG4gICAgaWYgKG5lZWRzUmVMb29wKSB7XG4gICAgICBzd2lwZXIubG9vcERlc3Ryb3koKTtcbiAgICAgIHN3aXBlci5sb29wQ3JlYXRlKHJlYWxJbmRleCk7XG4gICAgICBzd2lwZXIudXBkYXRlU2xpZGVzKCk7XG4gICAgfSBlbHNlIGlmICghd2FzTG9vcCAmJiBoYXNMb29wKSB7XG4gICAgICBzd2lwZXIubG9vcENyZWF0ZShyZWFsSW5kZXgpO1xuICAgICAgc3dpcGVyLnVwZGF0ZVNsaWRlcygpO1xuICAgIH0gZWxzZSBpZiAod2FzTG9vcCAmJiAhaGFzTG9vcCkge1xuICAgICAgc3dpcGVyLmxvb3BEZXN0cm95KCk7XG4gICAgfVxuICB9XG4gIHN3aXBlci5lbWl0KCdicmVha3BvaW50JywgYnJlYWtwb2ludFBhcmFtcyk7XG59XG5cbmZ1bmN0aW9uIGdldEJyZWFrcG9pbnQoYnJlYWtwb2ludHMsIGJhc2UsIGNvbnRhaW5lckVsKSB7XG4gIGlmIChiYXNlID09PSB2b2lkIDApIHtcbiAgICBiYXNlID0gJ3dpbmRvdyc7XG4gIH1cbiAgaWYgKCFicmVha3BvaW50cyB8fCBiYXNlID09PSAnY29udGFpbmVyJyAmJiAhY29udGFpbmVyRWwpIHJldHVybiB1bmRlZmluZWQ7XG4gIGxldCBicmVha3BvaW50ID0gZmFsc2U7XG4gIGNvbnN0IHdpbmRvdyA9IGdldFdpbmRvdygpO1xuICBjb25zdCBjdXJyZW50SGVpZ2h0ID0gYmFzZSA9PT0gJ3dpbmRvdycgPyB3aW5kb3cuaW5uZXJIZWlnaHQgOiBjb250YWluZXJFbC5jbGllbnRIZWlnaHQ7XG4gIGNvbnN0IHBvaW50cyA9IE9iamVjdC5rZXlzKGJyZWFrcG9pbnRzKS5tYXAocG9pbnQgPT4ge1xuICAgIGlmICh0eXBlb2YgcG9pbnQgPT09ICdzdHJpbmcnICYmIHBvaW50LmluZGV4T2YoJ0AnKSA9PT0gMCkge1xuICAgICAgY29uc3QgbWluUmF0aW8gPSBwYXJzZUZsb2F0KHBvaW50LnN1YnN0cigxKSk7XG4gICAgICBjb25zdCB2YWx1ZSA9IGN1cnJlbnRIZWlnaHQgKiBtaW5SYXRpbztcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHZhbHVlLFxuICAgICAgICBwb2ludFxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIHZhbHVlOiBwb2ludCxcbiAgICAgIHBvaW50XG4gICAgfTtcbiAgfSk7XG4gIHBvaW50cy5zb3J0KChhLCBiKSA9PiBwYXJzZUludChhLnZhbHVlLCAxMCkgLSBwYXJzZUludChiLnZhbHVlLCAxMCkpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHBvaW50cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgIGNvbnN0IHtcbiAgICAgIHBvaW50LFxuICAgICAgdmFsdWVcbiAgICB9ID0gcG9pbnRzW2ldO1xuICAgIGlmIChiYXNlID09PSAnd2luZG93Jykge1xuICAgICAgaWYgKHdpbmRvdy5tYXRjaE1lZGlhKGAobWluLXdpZHRoOiAke3ZhbHVlfXB4KWApLm1hdGNoZXMpIHtcbiAgICAgICAgYnJlYWtwb2ludCA9IHBvaW50O1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodmFsdWUgPD0gY29udGFpbmVyRWwuY2xpZW50V2lkdGgpIHtcbiAgICAgIGJyZWFrcG9pbnQgPSBwb2ludDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGJyZWFrcG9pbnQgfHwgJ21heCc7XG59XG5cbnZhciBicmVha3BvaW50cyA9IHtcbiAgc2V0QnJlYWtwb2ludCxcbiAgZ2V0QnJlYWtwb2ludFxufTtcblxuZnVuY3Rpb24gcHJlcGFyZUNsYXNzZXMoZW50cmllcywgcHJlZml4KSB7XG4gIGNvbnN0IHJlc3VsdENsYXNzZXMgPSBbXTtcbiAgZW50cmllcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgIGlmICh0eXBlb2YgaXRlbSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIE9iamVjdC5rZXlzKGl0ZW0pLmZvckVhY2goY2xhc3NOYW1lcyA9PiB7XG4gICAgICAgIGlmIChpdGVtW2NsYXNzTmFtZXNdKSB7XG4gICAgICAgICAgcmVzdWx0Q2xhc3Nlcy5wdXNoKHByZWZpeCArIGNsYXNzTmFtZXMpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJykge1xuICAgICAgcmVzdWx0Q2xhc3Nlcy5wdXNoKHByZWZpeCArIGl0ZW0pO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiByZXN1bHRDbGFzc2VzO1xufVxuZnVuY3Rpb24gYWRkQ2xhc3NlcygpIHtcbiAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgY29uc3Qge1xuICAgIGNsYXNzTmFtZXMsXG4gICAgcGFyYW1zLFxuICAgIHJ0bCxcbiAgICBlbCxcbiAgICBkZXZpY2VcbiAgfSA9IHN3aXBlcjtcbiAgLy8gcHJldHRpZXItaWdub3JlXG4gIGNvbnN0IHN1ZmZpeGVzID0gcHJlcGFyZUNsYXNzZXMoWydpbml0aWFsaXplZCcsIHBhcmFtcy5kaXJlY3Rpb24sIHtcbiAgICAnZnJlZS1tb2RlJzogc3dpcGVyLnBhcmFtcy5mcmVlTW9kZSAmJiBwYXJhbXMuZnJlZU1vZGUuZW5hYmxlZFxuICB9LCB7XG4gICAgJ2F1dG9oZWlnaHQnOiBwYXJhbXMuYXV0b0hlaWdodFxuICB9LCB7XG4gICAgJ3J0bCc6IHJ0bFxuICB9LCB7XG4gICAgJ2dyaWQnOiBwYXJhbXMuZ3JpZCAmJiBwYXJhbXMuZ3JpZC5yb3dzID4gMVxuICB9LCB7XG4gICAgJ2dyaWQtY29sdW1uJzogcGFyYW1zLmdyaWQgJiYgcGFyYW1zLmdyaWQucm93cyA+IDEgJiYgcGFyYW1zLmdyaWQuZmlsbCA9PT0gJ2NvbHVtbidcbiAgfSwge1xuICAgICdhbmRyb2lkJzogZGV2aWNlLmFuZHJvaWRcbiAgfSwge1xuICAgICdpb3MnOiBkZXZpY2UuaW9zXG4gIH0sIHtcbiAgICAnY3NzLW1vZGUnOiBwYXJhbXMuY3NzTW9kZVxuICB9LCB7XG4gICAgJ2NlbnRlcmVkJzogcGFyYW1zLmNzc01vZGUgJiYgcGFyYW1zLmNlbnRlcmVkU2xpZGVzXG4gIH0sIHtcbiAgICAnd2F0Y2gtcHJvZ3Jlc3MnOiBwYXJhbXMud2F0Y2hTbGlkZXNQcm9ncmVzc1xuICB9XSwgcGFyYW1zLmNvbnRhaW5lck1vZGlmaWVyQ2xhc3MpO1xuICBjbGFzc05hbWVzLnB1c2goLi4uc3VmZml4ZXMpO1xuICBlbC5jbGFzc0xpc3QuYWRkKC4uLmNsYXNzTmFtZXMpO1xuICBzd2lwZXIuZW1pdENvbnRhaW5lckNsYXNzZXMoKTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlQ2xhc3NlcygpIHtcbiAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgY29uc3Qge1xuICAgIGVsLFxuICAgIGNsYXNzTmFtZXNcbiAgfSA9IHN3aXBlcjtcbiAgZWwuY2xhc3NMaXN0LnJlbW92ZSguLi5jbGFzc05hbWVzKTtcbiAgc3dpcGVyLmVtaXRDb250YWluZXJDbGFzc2VzKCk7XG59XG5cbnZhciBjbGFzc2VzID0ge1xuICBhZGRDbGFzc2VzLFxuICByZW1vdmVDbGFzc2VzXG59O1xuXG5mdW5jdGlvbiBjaGVja092ZXJmbG93KCkge1xuICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICBjb25zdCB7XG4gICAgaXNMb2NrZWQ6IHdhc0xvY2tlZCxcbiAgICBwYXJhbXNcbiAgfSA9IHN3aXBlcjtcbiAgY29uc3Qge1xuICAgIHNsaWRlc09mZnNldEJlZm9yZVxuICB9ID0gcGFyYW1zO1xuICBpZiAoc2xpZGVzT2Zmc2V0QmVmb3JlKSB7XG4gICAgY29uc3QgbGFzdFNsaWRlSW5kZXggPSBzd2lwZXIuc2xpZGVzLmxlbmd0aCAtIDE7XG4gICAgY29uc3QgbGFzdFNsaWRlUmlnaHRFZGdlID0gc3dpcGVyLnNsaWRlc0dyaWRbbGFzdFNsaWRlSW5kZXhdICsgc3dpcGVyLnNsaWRlc1NpemVzR3JpZFtsYXN0U2xpZGVJbmRleF0gKyBzbGlkZXNPZmZzZXRCZWZvcmUgKiAyO1xuICAgIHN3aXBlci5pc0xvY2tlZCA9IHN3aXBlci5zaXplID4gbGFzdFNsaWRlUmlnaHRFZGdlO1xuICB9IGVsc2Uge1xuICAgIHN3aXBlci5pc0xvY2tlZCA9IHN3aXBlci5zbmFwR3JpZC5sZW5ndGggPT09IDE7XG4gIH1cbiAgaWYgKHBhcmFtcy5hbGxvd1NsaWRlTmV4dCA9PT0gdHJ1ZSkge1xuICAgIHN3aXBlci5hbGxvd1NsaWRlTmV4dCA9ICFzd2lwZXIuaXNMb2NrZWQ7XG4gIH1cbiAgaWYgKHBhcmFtcy5hbGxvd1NsaWRlUHJldiA9PT0gdHJ1ZSkge1xuICAgIHN3aXBlci5hbGxvd1NsaWRlUHJldiA9ICFzd2lwZXIuaXNMb2NrZWQ7XG4gIH1cbiAgaWYgKHdhc0xvY2tlZCAmJiB3YXNMb2NrZWQgIT09IHN3aXBlci5pc0xvY2tlZCkge1xuICAgIHN3aXBlci5pc0VuZCA9IGZhbHNlO1xuICB9XG4gIGlmICh3YXNMb2NrZWQgIT09IHN3aXBlci5pc0xvY2tlZCkge1xuICAgIHN3aXBlci5lbWl0KHN3aXBlci5pc0xvY2tlZCA/ICdsb2NrJyA6ICd1bmxvY2snKTtcbiAgfVxufVxudmFyIGNoZWNrT3ZlcmZsb3ckMSA9IHtcbiAgY2hlY2tPdmVyZmxvd1xufTtcblxudmFyIGRlZmF1bHRzID0ge1xuICBpbml0OiB0cnVlLFxuICBkaXJlY3Rpb246ICdob3Jpem9udGFsJyxcbiAgb25lV2F5TW92ZW1lbnQ6IGZhbHNlLFxuICB0b3VjaEV2ZW50c1RhcmdldDogJ3dyYXBwZXInLFxuICBpbml0aWFsU2xpZGU6IDAsXG4gIHNwZWVkOiAzMDAsXG4gIGNzc01vZGU6IGZhbHNlLFxuICB1cGRhdGVPbldpbmRvd1Jlc2l6ZTogdHJ1ZSxcbiAgcmVzaXplT2JzZXJ2ZXI6IHRydWUsXG4gIG5lc3RlZDogZmFsc2UsXG4gIGNyZWF0ZUVsZW1lbnRzOiBmYWxzZSxcbiAgZXZlbnRzUHJlZml4OiAnc3dpcGVyJyxcbiAgZW5hYmxlZDogdHJ1ZSxcbiAgZm9jdXNhYmxlRWxlbWVudHM6ICdpbnB1dCwgc2VsZWN0LCBvcHRpb24sIHRleHRhcmVhLCBidXR0b24sIHZpZGVvLCBsYWJlbCcsXG4gIC8vIE92ZXJyaWRlc1xuICB3aWR0aDogbnVsbCxcbiAgaGVpZ2h0OiBudWxsLFxuICAvL1xuICBwcmV2ZW50SW50ZXJhY3Rpb25PblRyYW5zaXRpb246IGZhbHNlLFxuICAvLyBzc3JcbiAgdXNlckFnZW50OiBudWxsLFxuICB1cmw6IG51bGwsXG4gIC8vIFRvIHN1cHBvcnQgaU9TJ3Mgc3dpcGUtdG8tZ28tYmFjayBnZXN0dXJlICh3aGVuIGJlaW5nIHVzZWQgaW4tYXBwKS5cbiAgZWRnZVN3aXBlRGV0ZWN0aW9uOiBmYWxzZSxcbiAgZWRnZVN3aXBlVGhyZXNob2xkOiAyMCxcbiAgLy8gQXV0b2hlaWdodFxuICBhdXRvSGVpZ2h0OiBmYWxzZSxcbiAgLy8gU2V0IHdyYXBwZXIgd2lkdGhcbiAgc2V0V3JhcHBlclNpemU6IGZhbHNlLFxuICAvLyBWaXJ0dWFsIFRyYW5zbGF0ZVxuICB2aXJ0dWFsVHJhbnNsYXRlOiBmYWxzZSxcbiAgLy8gRWZmZWN0c1xuICBlZmZlY3Q6ICdzbGlkZScsXG4gIC8vICdzbGlkZScgb3IgJ2ZhZGUnIG9yICdjdWJlJyBvciAnY292ZXJmbG93JyBvciAnZmxpcCdcblxuICAvLyBCcmVha3BvaW50c1xuICBicmVha3BvaW50czogdW5kZWZpbmVkLFxuICBicmVha3BvaW50c0Jhc2U6ICd3aW5kb3cnLFxuICAvLyBTbGlkZXMgZ3JpZFxuICBzcGFjZUJldHdlZW46IDAsXG4gIHNsaWRlc1BlclZpZXc6IDEsXG4gIHNsaWRlc1Blckdyb3VwOiAxLFxuICBzbGlkZXNQZXJHcm91cFNraXA6IDAsXG4gIHNsaWRlc1Blckdyb3VwQXV0bzogZmFsc2UsXG4gIGNlbnRlcmVkU2xpZGVzOiBmYWxzZSxcbiAgY2VudGVyZWRTbGlkZXNCb3VuZHM6IGZhbHNlLFxuICBzbGlkZXNPZmZzZXRCZWZvcmU6IDAsXG4gIC8vIGluIHB4XG4gIHNsaWRlc09mZnNldEFmdGVyOiAwLFxuICAvLyBpbiBweFxuICBub3JtYWxpemVTbGlkZUluZGV4OiB0cnVlLFxuICBjZW50ZXJJbnN1ZmZpY2llbnRTbGlkZXM6IGZhbHNlLFxuICAvLyBEaXNhYmxlIHN3aXBlciBhbmQgaGlkZSBuYXZpZ2F0aW9uIHdoZW4gY29udGFpbmVyIG5vdCBvdmVyZmxvd1xuICB3YXRjaE92ZXJmbG93OiB0cnVlLFxuICAvLyBSb3VuZCBsZW5ndGhcbiAgcm91bmRMZW5ndGhzOiBmYWxzZSxcbiAgLy8gVG91Y2hlc1xuICB0b3VjaFJhdGlvOiAxLFxuICB0b3VjaEFuZ2xlOiA0NSxcbiAgc2ltdWxhdGVUb3VjaDogdHJ1ZSxcbiAgc2hvcnRTd2lwZXM6IHRydWUsXG4gIGxvbmdTd2lwZXM6IHRydWUsXG4gIGxvbmdTd2lwZXNSYXRpbzogMC41LFxuICBsb25nU3dpcGVzTXM6IDMwMCxcbiAgZm9sbG93RmluZ2VyOiB0cnVlLFxuICBhbGxvd1RvdWNoTW92ZTogdHJ1ZSxcbiAgdGhyZXNob2xkOiA1LFxuICB0b3VjaE1vdmVTdG9wUHJvcGFnYXRpb246IGZhbHNlLFxuICB0b3VjaFN0YXJ0UHJldmVudERlZmF1bHQ6IHRydWUsXG4gIHRvdWNoU3RhcnRGb3JjZVByZXZlbnREZWZhdWx0OiBmYWxzZSxcbiAgdG91Y2hSZWxlYXNlT25FZGdlczogZmFsc2UsXG4gIC8vIFVuaXF1ZSBOYXZpZ2F0aW9uIEVsZW1lbnRzXG4gIHVuaXF1ZU5hdkVsZW1lbnRzOiB0cnVlLFxuICAvLyBSZXNpc3RhbmNlXG4gIHJlc2lzdGFuY2U6IHRydWUsXG4gIHJlc2lzdGFuY2VSYXRpbzogMC44NSxcbiAgLy8gUHJvZ3Jlc3NcbiAgd2F0Y2hTbGlkZXNQcm9ncmVzczogZmFsc2UsXG4gIC8vIEN1cnNvclxuICBncmFiQ3Vyc29yOiBmYWxzZSxcbiAgLy8gQ2xpY2tzXG4gIHByZXZlbnRDbGlja3M6IHRydWUsXG4gIHByZXZlbnRDbGlja3NQcm9wYWdhdGlvbjogdHJ1ZSxcbiAgc2xpZGVUb0NsaWNrZWRTbGlkZTogZmFsc2UsXG4gIC8vIGxvb3BcbiAgbG9vcDogZmFsc2UsXG4gIGxvb3BBZGRCbGFua1NsaWRlczogdHJ1ZSxcbiAgbG9vcEFkZGl0aW9uYWxTbGlkZXM6IDAsXG4gIGxvb3BQcmV2ZW50c1NsaWRpbmc6IHRydWUsXG4gIC8vIHJld2luZFxuICByZXdpbmQ6IGZhbHNlLFxuICAvLyBTd2lwaW5nL25vIHN3aXBpbmdcbiAgYWxsb3dTbGlkZVByZXY6IHRydWUsXG4gIGFsbG93U2xpZGVOZXh0OiB0cnVlLFxuICBzd2lwZUhhbmRsZXI6IG51bGwsXG4gIC8vICcuc3dpcGUtaGFuZGxlcicsXG4gIG5vU3dpcGluZzogdHJ1ZSxcbiAgbm9Td2lwaW5nQ2xhc3M6ICdzd2lwZXItbm8tc3dpcGluZycsXG4gIG5vU3dpcGluZ1NlbGVjdG9yOiBudWxsLFxuICAvLyBQYXNzaXZlIExpc3RlbmVyc1xuICBwYXNzaXZlTGlzdGVuZXJzOiB0cnVlLFxuICBtYXhCYWNrZmFjZUhpZGRlblNsaWRlczogMTAsXG4gIC8vIE5TXG4gIGNvbnRhaW5lck1vZGlmaWVyQ2xhc3M6ICdzd2lwZXItJyxcbiAgLy8gTkVXXG4gIHNsaWRlQ2xhc3M6ICdzd2lwZXItc2xpZGUnLFxuICBzbGlkZUJsYW5rQ2xhc3M6ICdzd2lwZXItc2xpZGUtYmxhbmsnLFxuICBzbGlkZUFjdGl2ZUNsYXNzOiAnc3dpcGVyLXNsaWRlLWFjdGl2ZScsXG4gIHNsaWRlVmlzaWJsZUNsYXNzOiAnc3dpcGVyLXNsaWRlLXZpc2libGUnLFxuICBzbGlkZUZ1bGx5VmlzaWJsZUNsYXNzOiAnc3dpcGVyLXNsaWRlLWZ1bGx5LXZpc2libGUnLFxuICBzbGlkZU5leHRDbGFzczogJ3N3aXBlci1zbGlkZS1uZXh0JyxcbiAgc2xpZGVQcmV2Q2xhc3M6ICdzd2lwZXItc2xpZGUtcHJldicsXG4gIHdyYXBwZXJDbGFzczogJ3N3aXBlci13cmFwcGVyJyxcbiAgbGF6eVByZWxvYWRlckNsYXNzOiAnc3dpcGVyLWxhenktcHJlbG9hZGVyJyxcbiAgbGF6eVByZWxvYWRQcmV2TmV4dDogMCxcbiAgLy8gQ2FsbGJhY2tzXG4gIHJ1bkNhbGxiYWNrc09uSW5pdDogdHJ1ZSxcbiAgLy8gSW50ZXJuYWxzXG4gIF9lbWl0Q2xhc3NlczogZmFsc2Vcbn07XG5cbmZ1bmN0aW9uIG1vZHVsZUV4dGVuZFBhcmFtcyhwYXJhbXMsIGFsbE1vZHVsZXNQYXJhbXMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGV4dGVuZFBhcmFtcyhvYmopIHtcbiAgICBpZiAob2JqID09PSB2b2lkIDApIHtcbiAgICAgIG9iaiA9IHt9O1xuICAgIH1cbiAgICBjb25zdCBtb2R1bGVQYXJhbU5hbWUgPSBPYmplY3Qua2V5cyhvYmopWzBdO1xuICAgIGNvbnN0IG1vZHVsZVBhcmFtcyA9IG9ialttb2R1bGVQYXJhbU5hbWVdO1xuICAgIGlmICh0eXBlb2YgbW9kdWxlUGFyYW1zICE9PSAnb2JqZWN0JyB8fCBtb2R1bGVQYXJhbXMgPT09IG51bGwpIHtcbiAgICAgIGV4dGVuZChhbGxNb2R1bGVzUGFyYW1zLCBvYmopO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAocGFyYW1zW21vZHVsZVBhcmFtTmFtZV0gPT09IHRydWUpIHtcbiAgICAgIHBhcmFtc1ttb2R1bGVQYXJhbU5hbWVdID0ge1xuICAgICAgICBlbmFibGVkOiB0cnVlXG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAobW9kdWxlUGFyYW1OYW1lID09PSAnbmF2aWdhdGlvbicgJiYgcGFyYW1zW21vZHVsZVBhcmFtTmFtZV0gJiYgcGFyYW1zW21vZHVsZVBhcmFtTmFtZV0uZW5hYmxlZCAmJiAhcGFyYW1zW21vZHVsZVBhcmFtTmFtZV0ucHJldkVsICYmICFwYXJhbXNbbW9kdWxlUGFyYW1OYW1lXS5uZXh0RWwpIHtcbiAgICAgIHBhcmFtc1ttb2R1bGVQYXJhbU5hbWVdLmF1dG8gPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoWydwYWdpbmF0aW9uJywgJ3Njcm9sbGJhciddLmluZGV4T2YobW9kdWxlUGFyYW1OYW1lKSA+PSAwICYmIHBhcmFtc1ttb2R1bGVQYXJhbU5hbWVdICYmIHBhcmFtc1ttb2R1bGVQYXJhbU5hbWVdLmVuYWJsZWQgJiYgIXBhcmFtc1ttb2R1bGVQYXJhbU5hbWVdLmVsKSB7XG4gICAgICBwYXJhbXNbbW9kdWxlUGFyYW1OYW1lXS5hdXRvID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKCEobW9kdWxlUGFyYW1OYW1lIGluIHBhcmFtcyAmJiAnZW5hYmxlZCcgaW4gbW9kdWxlUGFyYW1zKSkge1xuICAgICAgZXh0ZW5kKGFsbE1vZHVsZXNQYXJhbXMsIG9iaik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0eXBlb2YgcGFyYW1zW21vZHVsZVBhcmFtTmFtZV0gPT09ICdvYmplY3QnICYmICEoJ2VuYWJsZWQnIGluIHBhcmFtc1ttb2R1bGVQYXJhbU5hbWVdKSkge1xuICAgICAgcGFyYW1zW21vZHVsZVBhcmFtTmFtZV0uZW5hYmxlZCA9IHRydWU7XG4gICAgfVxuICAgIGlmICghcGFyYW1zW21vZHVsZVBhcmFtTmFtZV0pIHBhcmFtc1ttb2R1bGVQYXJhbU5hbWVdID0ge1xuICAgICAgZW5hYmxlZDogZmFsc2VcbiAgICB9O1xuICAgIGV4dGVuZChhbGxNb2R1bGVzUGFyYW1zLCBvYmopO1xuICB9O1xufVxuXG4vKiBlc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246IFwib2ZmXCIgKi9cbmNvbnN0IHByb3RvdHlwZXMgPSB7XG4gIGV2ZW50c0VtaXR0ZXIsXG4gIHVwZGF0ZSxcbiAgdHJhbnNsYXRlLFxuICB0cmFuc2l0aW9uLFxuICBzbGlkZSxcbiAgbG9vcCxcbiAgZ3JhYkN1cnNvcixcbiAgZXZlbnRzOiBldmVudHMkMSxcbiAgYnJlYWtwb2ludHMsXG4gIGNoZWNrT3ZlcmZsb3c6IGNoZWNrT3ZlcmZsb3ckMSxcbiAgY2xhc3Nlc1xufTtcbmNvbnN0IGV4dGVuZGVkRGVmYXVsdHMgPSB7fTtcbmNsYXNzIFN3aXBlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGxldCBlbDtcbiAgICBsZXQgcGFyYW1zO1xuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgYXJnc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG4gICAgaWYgKGFyZ3MubGVuZ3RoID09PSAxICYmIGFyZ3NbMF0uY29uc3RydWN0b3IgJiYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGFyZ3NbMF0pLnNsaWNlKDgsIC0xKSA9PT0gJ09iamVjdCcpIHtcbiAgICAgIHBhcmFtcyA9IGFyZ3NbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIFtlbCwgcGFyYW1zXSA9IGFyZ3M7XG4gICAgfVxuICAgIGlmICghcGFyYW1zKSBwYXJhbXMgPSB7fTtcbiAgICBwYXJhbXMgPSBleHRlbmQoe30sIHBhcmFtcyk7XG4gICAgaWYgKGVsICYmICFwYXJhbXMuZWwpIHBhcmFtcy5lbCA9IGVsO1xuICAgIGNvbnN0IGRvY3VtZW50ID0gZ2V0RG9jdW1lbnQoKTtcbiAgICBpZiAocGFyYW1zLmVsICYmIHR5cGVvZiBwYXJhbXMuZWwgPT09ICdzdHJpbmcnICYmIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwocGFyYW1zLmVsKS5sZW5ndGggPiAxKSB7XG4gICAgICBjb25zdCBzd2lwZXJzID0gW107XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHBhcmFtcy5lbCkuZm9yRWFjaChjb250YWluZXJFbCA9PiB7XG4gICAgICAgIGNvbnN0IG5ld1BhcmFtcyA9IGV4dGVuZCh7fSwgcGFyYW1zLCB7XG4gICAgICAgICAgZWw6IGNvbnRhaW5lckVsXG4gICAgICAgIH0pO1xuICAgICAgICBzd2lwZXJzLnB1c2gobmV3IFN3aXBlcihuZXdQYXJhbXMpKTtcbiAgICAgIH0pO1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0cnVjdG9yLXJldHVyblxuICAgICAgcmV0dXJuIHN3aXBlcnM7XG4gICAgfVxuXG4gICAgLy8gU3dpcGVyIEluc3RhbmNlXG4gICAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgICBzd2lwZXIuX19zd2lwZXJfXyA9IHRydWU7XG4gICAgc3dpcGVyLnN1cHBvcnQgPSBnZXRTdXBwb3J0KCk7XG4gICAgc3dpcGVyLmRldmljZSA9IGdldERldmljZSh7XG4gICAgICB1c2VyQWdlbnQ6IHBhcmFtcy51c2VyQWdlbnRcbiAgICB9KTtcbiAgICBzd2lwZXIuYnJvd3NlciA9IGdldEJyb3dzZXIoKTtcbiAgICBzd2lwZXIuZXZlbnRzTGlzdGVuZXJzID0ge307XG4gICAgc3dpcGVyLmV2ZW50c0FueUxpc3RlbmVycyA9IFtdO1xuICAgIHN3aXBlci5tb2R1bGVzID0gWy4uLnN3aXBlci5fX21vZHVsZXNfX107XG4gICAgaWYgKHBhcmFtcy5tb2R1bGVzICYmIEFycmF5LmlzQXJyYXkocGFyYW1zLm1vZHVsZXMpKSB7XG4gICAgICBzd2lwZXIubW9kdWxlcy5wdXNoKC4uLnBhcmFtcy5tb2R1bGVzKTtcbiAgICB9XG4gICAgY29uc3QgYWxsTW9kdWxlc1BhcmFtcyA9IHt9O1xuICAgIHN3aXBlci5tb2R1bGVzLmZvckVhY2gobW9kID0+IHtcbiAgICAgIG1vZCh7XG4gICAgICAgIHBhcmFtcyxcbiAgICAgICAgc3dpcGVyLFxuICAgICAgICBleHRlbmRQYXJhbXM6IG1vZHVsZUV4dGVuZFBhcmFtcyhwYXJhbXMsIGFsbE1vZHVsZXNQYXJhbXMpLFxuICAgICAgICBvbjogc3dpcGVyLm9uLmJpbmQoc3dpcGVyKSxcbiAgICAgICAgb25jZTogc3dpcGVyLm9uY2UuYmluZChzd2lwZXIpLFxuICAgICAgICBvZmY6IHN3aXBlci5vZmYuYmluZChzd2lwZXIpLFxuICAgICAgICBlbWl0OiBzd2lwZXIuZW1pdC5iaW5kKHN3aXBlcilcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gRXh0ZW5kIGRlZmF1bHRzIHdpdGggbW9kdWxlcyBwYXJhbXNcbiAgICBjb25zdCBzd2lwZXJQYXJhbXMgPSBleHRlbmQoe30sIGRlZmF1bHRzLCBhbGxNb2R1bGVzUGFyYW1zKTtcblxuICAgIC8vIEV4dGVuZCBkZWZhdWx0cyB3aXRoIHBhc3NlZCBwYXJhbXNcbiAgICBzd2lwZXIucGFyYW1zID0gZXh0ZW5kKHt9LCBzd2lwZXJQYXJhbXMsIGV4dGVuZGVkRGVmYXVsdHMsIHBhcmFtcyk7XG4gICAgc3dpcGVyLm9yaWdpbmFsUGFyYW1zID0gZXh0ZW5kKHt9LCBzd2lwZXIucGFyYW1zKTtcbiAgICBzd2lwZXIucGFzc2VkUGFyYW1zID0gZXh0ZW5kKHt9LCBwYXJhbXMpO1xuXG4gICAgLy8gYWRkIGV2ZW50IGxpc3RlbmVyc1xuICAgIGlmIChzd2lwZXIucGFyYW1zICYmIHN3aXBlci5wYXJhbXMub24pIHtcbiAgICAgIE9iamVjdC5rZXlzKHN3aXBlci5wYXJhbXMub24pLmZvckVhY2goZXZlbnROYW1lID0+IHtcbiAgICAgICAgc3dpcGVyLm9uKGV2ZW50TmFtZSwgc3dpcGVyLnBhcmFtcy5vbltldmVudE5hbWVdKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoc3dpcGVyLnBhcmFtcyAmJiBzd2lwZXIucGFyYW1zLm9uQW55KSB7XG4gICAgICBzd2lwZXIub25Bbnkoc3dpcGVyLnBhcmFtcy5vbkFueSk7XG4gICAgfVxuXG4gICAgLy8gRXh0ZW5kIFN3aXBlclxuICAgIE9iamVjdC5hc3NpZ24oc3dpcGVyLCB7XG4gICAgICBlbmFibGVkOiBzd2lwZXIucGFyYW1zLmVuYWJsZWQsXG4gICAgICBlbCxcbiAgICAgIC8vIENsYXNzZXNcbiAgICAgIGNsYXNzTmFtZXM6IFtdLFxuICAgICAgLy8gU2xpZGVzXG4gICAgICBzbGlkZXM6IFtdLFxuICAgICAgc2xpZGVzR3JpZDogW10sXG4gICAgICBzbmFwR3JpZDogW10sXG4gICAgICBzbGlkZXNTaXplc0dyaWQ6IFtdLFxuICAgICAgLy8gaXNEaXJlY3Rpb25cbiAgICAgIGlzSG9yaXpvbnRhbCgpIHtcbiAgICAgICAgcmV0dXJuIHN3aXBlci5wYXJhbXMuZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCc7XG4gICAgICB9LFxuICAgICAgaXNWZXJ0aWNhbCgpIHtcbiAgICAgICAgcmV0dXJuIHN3aXBlci5wYXJhbXMuZGlyZWN0aW9uID09PSAndmVydGljYWwnO1xuICAgICAgfSxcbiAgICAgIC8vIEluZGV4ZXNcbiAgICAgIGFjdGl2ZUluZGV4OiAwLFxuICAgICAgcmVhbEluZGV4OiAwLFxuICAgICAgLy9cbiAgICAgIGlzQmVnaW5uaW5nOiB0cnVlLFxuICAgICAgaXNFbmQ6IGZhbHNlLFxuICAgICAgLy8gUHJvcHNcbiAgICAgIHRyYW5zbGF0ZTogMCxcbiAgICAgIHByZXZpb3VzVHJhbnNsYXRlOiAwLFxuICAgICAgcHJvZ3Jlc3M6IDAsXG4gICAgICB2ZWxvY2l0eTogMCxcbiAgICAgIGFuaW1hdGluZzogZmFsc2UsXG4gICAgICBjc3NPdmVyZmxvd0FkanVzdG1lbnQoKSB7XG4gICAgICAgIC8vIFJldHVybnMgMCB1bmxlc3MgYHRyYW5zbGF0ZWAgaXMgPiAyKioyM1xuICAgICAgICAvLyBTaG91bGQgYmUgc3VidHJhY3RlZCBmcm9tIGNzcyB2YWx1ZXMgdG8gcHJldmVudCBvdmVyZmxvd1xuICAgICAgICByZXR1cm4gTWF0aC50cnVuYyh0aGlzLnRyYW5zbGF0ZSAvIDIgKiogMjMpICogMiAqKiAyMztcbiAgICAgIH0sXG4gICAgICAvLyBMb2Nrc1xuICAgICAgYWxsb3dTbGlkZU5leHQ6IHN3aXBlci5wYXJhbXMuYWxsb3dTbGlkZU5leHQsXG4gICAgICBhbGxvd1NsaWRlUHJldjogc3dpcGVyLnBhcmFtcy5hbGxvd1NsaWRlUHJldixcbiAgICAgIC8vIFRvdWNoIEV2ZW50c1xuICAgICAgdG91Y2hFdmVudHNEYXRhOiB7XG4gICAgICAgIGlzVG91Y2hlZDogdW5kZWZpbmVkLFxuICAgICAgICBpc01vdmVkOiB1bmRlZmluZWQsXG4gICAgICAgIGFsbG93VG91Y2hDYWxsYmFja3M6IHVuZGVmaW5lZCxcbiAgICAgICAgdG91Y2hTdGFydFRpbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgaXNTY3JvbGxpbmc6IHVuZGVmaW5lZCxcbiAgICAgICAgY3VycmVudFRyYW5zbGF0ZTogdW5kZWZpbmVkLFxuICAgICAgICBzdGFydFRyYW5zbGF0ZTogdW5kZWZpbmVkLFxuICAgICAgICBhbGxvd1RocmVzaG9sZE1vdmU6IHVuZGVmaW5lZCxcbiAgICAgICAgLy8gRm9ybSBlbGVtZW50cyB0byBtYXRjaFxuICAgICAgICBmb2N1c2FibGVFbGVtZW50czogc3dpcGVyLnBhcmFtcy5mb2N1c2FibGVFbGVtZW50cyxcbiAgICAgICAgLy8gTGFzdCBjbGljayB0aW1lXG4gICAgICAgIGxhc3RDbGlja1RpbWU6IDAsXG4gICAgICAgIGNsaWNrVGltZW91dDogdW5kZWZpbmVkLFxuICAgICAgICAvLyBWZWxvY2l0aWVzXG4gICAgICAgIHZlbG9jaXRpZXM6IFtdLFxuICAgICAgICBhbGxvd01vbWVudHVtQm91bmNlOiB1bmRlZmluZWQsXG4gICAgICAgIHN0YXJ0TW92aW5nOiB1bmRlZmluZWQsXG4gICAgICAgIHBvaW50ZXJJZDogbnVsbCxcbiAgICAgICAgdG91Y2hJZDogbnVsbFxuICAgICAgfSxcbiAgICAgIC8vIENsaWNrc1xuICAgICAgYWxsb3dDbGljazogdHJ1ZSxcbiAgICAgIC8vIFRvdWNoZXNcbiAgICAgIGFsbG93VG91Y2hNb3ZlOiBzd2lwZXIucGFyYW1zLmFsbG93VG91Y2hNb3ZlLFxuICAgICAgdG91Y2hlczoge1xuICAgICAgICBzdGFydFg6IDAsXG4gICAgICAgIHN0YXJ0WTogMCxcbiAgICAgICAgY3VycmVudFg6IDAsXG4gICAgICAgIGN1cnJlbnRZOiAwLFxuICAgICAgICBkaWZmOiAwXG4gICAgICB9LFxuICAgICAgLy8gSW1hZ2VzXG4gICAgICBpbWFnZXNUb0xvYWQ6IFtdLFxuICAgICAgaW1hZ2VzTG9hZGVkOiAwXG4gICAgfSk7XG4gICAgc3dpcGVyLmVtaXQoJ19zd2lwZXInKTtcblxuICAgIC8vIEluaXRcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5pbml0KSB7XG4gICAgICBzd2lwZXIuaW5pdCgpO1xuICAgIH1cblxuICAgIC8vIFJldHVybiBhcHAgaW5zdGFuY2VcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc3RydWN0b3ItcmV0dXJuXG4gICAgcmV0dXJuIHN3aXBlcjtcbiAgfVxuICBnZXREaXJlY3Rpb25MYWJlbChwcm9wZXJ0eSkge1xuICAgIGlmICh0aGlzLmlzSG9yaXpvbnRhbCgpKSB7XG4gICAgICByZXR1cm4gcHJvcGVydHk7XG4gICAgfVxuICAgIC8vIHByZXR0aWVyLWlnbm9yZVxuICAgIHJldHVybiB7XG4gICAgICAnd2lkdGgnOiAnaGVpZ2h0JyxcbiAgICAgICdtYXJnaW4tdG9wJzogJ21hcmdpbi1sZWZ0JyxcbiAgICAgICdtYXJnaW4tYm90dG9tICc6ICdtYXJnaW4tcmlnaHQnLFxuICAgICAgJ21hcmdpbi1sZWZ0JzogJ21hcmdpbi10b3AnLFxuICAgICAgJ21hcmdpbi1yaWdodCc6ICdtYXJnaW4tYm90dG9tJyxcbiAgICAgICdwYWRkaW5nLWxlZnQnOiAncGFkZGluZy10b3AnLFxuICAgICAgJ3BhZGRpbmctcmlnaHQnOiAncGFkZGluZy1ib3R0b20nLFxuICAgICAgJ21hcmdpblJpZ2h0JzogJ21hcmdpbkJvdHRvbSdcbiAgICB9W3Byb3BlcnR5XTtcbiAgfVxuICBnZXRTbGlkZUluZGV4KHNsaWRlRWwpIHtcbiAgICBjb25zdCB7XG4gICAgICBzbGlkZXNFbCxcbiAgICAgIHBhcmFtc1xuICAgIH0gPSB0aGlzO1xuICAgIGNvbnN0IHNsaWRlcyA9IGVsZW1lbnRDaGlsZHJlbihzbGlkZXNFbCwgYC4ke3BhcmFtcy5zbGlkZUNsYXNzfSwgc3dpcGVyLXNsaWRlYCk7XG4gICAgY29uc3QgZmlyc3RTbGlkZUluZGV4ID0gZWxlbWVudEluZGV4KHNsaWRlc1swXSk7XG4gICAgcmV0dXJuIGVsZW1lbnRJbmRleChzbGlkZUVsKSAtIGZpcnN0U2xpZGVJbmRleDtcbiAgfVxuICBnZXRTbGlkZUluZGV4QnlEYXRhKGluZGV4KSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0U2xpZGVJbmRleCh0aGlzLnNsaWRlcy5maWx0ZXIoc2xpZGVFbCA9PiBzbGlkZUVsLmdldEF0dHJpYnV0ZSgnZGF0YS1zd2lwZXItc2xpZGUtaW5kZXgnKSAqIDEgPT09IGluZGV4KVswXSk7XG4gIH1cbiAgcmVjYWxjU2xpZGVzKCkge1xuICAgIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gICAgY29uc3Qge1xuICAgICAgc2xpZGVzRWwsXG4gICAgICBwYXJhbXNcbiAgICB9ID0gc3dpcGVyO1xuICAgIHN3aXBlci5zbGlkZXMgPSBlbGVtZW50Q2hpbGRyZW4oc2xpZGVzRWwsIGAuJHtwYXJhbXMuc2xpZGVDbGFzc30sIHN3aXBlci1zbGlkZWApO1xuICB9XG4gIGVuYWJsZSgpIHtcbiAgICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICAgIGlmIChzd2lwZXIuZW5hYmxlZCkgcmV0dXJuO1xuICAgIHN3aXBlci5lbmFibGVkID0gdHJ1ZTtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5ncmFiQ3Vyc29yKSB7XG4gICAgICBzd2lwZXIuc2V0R3JhYkN1cnNvcigpO1xuICAgIH1cbiAgICBzd2lwZXIuZW1pdCgnZW5hYmxlJyk7XG4gIH1cbiAgZGlzYWJsZSgpIHtcbiAgICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICAgIGlmICghc3dpcGVyLmVuYWJsZWQpIHJldHVybjtcbiAgICBzd2lwZXIuZW5hYmxlZCA9IGZhbHNlO1xuICAgIGlmIChzd2lwZXIucGFyYW1zLmdyYWJDdXJzb3IpIHtcbiAgICAgIHN3aXBlci51bnNldEdyYWJDdXJzb3IoKTtcbiAgICB9XG4gICAgc3dpcGVyLmVtaXQoJ2Rpc2FibGUnKTtcbiAgfVxuICBzZXRQcm9ncmVzcyhwcm9ncmVzcywgc3BlZWQpIHtcbiAgICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICAgIHByb2dyZXNzID0gTWF0aC5taW4oTWF0aC5tYXgocHJvZ3Jlc3MsIDApLCAxKTtcbiAgICBjb25zdCBtaW4gPSBzd2lwZXIubWluVHJhbnNsYXRlKCk7XG4gICAgY29uc3QgbWF4ID0gc3dpcGVyLm1heFRyYW5zbGF0ZSgpO1xuICAgIGNvbnN0IGN1cnJlbnQgPSAobWF4IC0gbWluKSAqIHByb2dyZXNzICsgbWluO1xuICAgIHN3aXBlci50cmFuc2xhdGVUbyhjdXJyZW50LCB0eXBlb2Ygc3BlZWQgPT09ICd1bmRlZmluZWQnID8gMCA6IHNwZWVkKTtcbiAgICBzd2lwZXIudXBkYXRlQWN0aXZlSW5kZXgoKTtcbiAgICBzd2lwZXIudXBkYXRlU2xpZGVzQ2xhc3NlcygpO1xuICB9XG4gIGVtaXRDb250YWluZXJDbGFzc2VzKCkge1xuICAgIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gICAgaWYgKCFzd2lwZXIucGFyYW1zLl9lbWl0Q2xhc3NlcyB8fCAhc3dpcGVyLmVsKSByZXR1cm47XG4gICAgY29uc3QgY2xzID0gc3dpcGVyLmVsLmNsYXNzTmFtZS5zcGxpdCgnICcpLmZpbHRlcihjbGFzc05hbWUgPT4ge1xuICAgICAgcmV0dXJuIGNsYXNzTmFtZS5pbmRleE9mKCdzd2lwZXInKSA9PT0gMCB8fCBjbGFzc05hbWUuaW5kZXhPZihzd2lwZXIucGFyYW1zLmNvbnRhaW5lck1vZGlmaWVyQ2xhc3MpID09PSAwO1xuICAgIH0pO1xuICAgIHN3aXBlci5lbWl0KCdfY29udGFpbmVyQ2xhc3NlcycsIGNscy5qb2luKCcgJykpO1xuICB9XG4gIGdldFNsaWRlQ2xhc3NlcyhzbGlkZUVsKSB7XG4gICAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgICBpZiAoc3dpcGVyLmRlc3Ryb3llZCkgcmV0dXJuICcnO1xuICAgIHJldHVybiBzbGlkZUVsLmNsYXNzTmFtZS5zcGxpdCgnICcpLmZpbHRlcihjbGFzc05hbWUgPT4ge1xuICAgICAgcmV0dXJuIGNsYXNzTmFtZS5pbmRleE9mKCdzd2lwZXItc2xpZGUnKSA9PT0gMCB8fCBjbGFzc05hbWUuaW5kZXhPZihzd2lwZXIucGFyYW1zLnNsaWRlQ2xhc3MpID09PSAwO1xuICAgIH0pLmpvaW4oJyAnKTtcbiAgfVxuICBlbWl0U2xpZGVzQ2xhc3NlcygpIHtcbiAgICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICAgIGlmICghc3dpcGVyLnBhcmFtcy5fZW1pdENsYXNzZXMgfHwgIXN3aXBlci5lbCkgcmV0dXJuO1xuICAgIGNvbnN0IHVwZGF0ZXMgPSBbXTtcbiAgICBzd2lwZXIuc2xpZGVzLmZvckVhY2goc2xpZGVFbCA9PiB7XG4gICAgICBjb25zdCBjbGFzc05hbWVzID0gc3dpcGVyLmdldFNsaWRlQ2xhc3NlcyhzbGlkZUVsKTtcbiAgICAgIHVwZGF0ZXMucHVzaCh7XG4gICAgICAgIHNsaWRlRWwsXG4gICAgICAgIGNsYXNzTmFtZXNcbiAgICAgIH0pO1xuICAgICAgc3dpcGVyLmVtaXQoJ19zbGlkZUNsYXNzJywgc2xpZGVFbCwgY2xhc3NOYW1lcyk7XG4gICAgfSk7XG4gICAgc3dpcGVyLmVtaXQoJ19zbGlkZUNsYXNzZXMnLCB1cGRhdGVzKTtcbiAgfVxuICBzbGlkZXNQZXJWaWV3RHluYW1pYyh2aWV3LCBleGFjdCkge1xuICAgIGlmICh2aWV3ID09PSB2b2lkIDApIHtcbiAgICAgIHZpZXcgPSAnY3VycmVudCc7XG4gICAgfVxuICAgIGlmIChleGFjdCA9PT0gdm9pZCAwKSB7XG4gICAgICBleGFjdCA9IGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICAgIGNvbnN0IHtcbiAgICAgIHBhcmFtcyxcbiAgICAgIHNsaWRlcyxcbiAgICAgIHNsaWRlc0dyaWQsXG4gICAgICBzbGlkZXNTaXplc0dyaWQsXG4gICAgICBzaXplOiBzd2lwZXJTaXplLFxuICAgICAgYWN0aXZlSW5kZXhcbiAgICB9ID0gc3dpcGVyO1xuICAgIGxldCBzcHYgPSAxO1xuICAgIGlmICh0eXBlb2YgcGFyYW1zLnNsaWRlc1BlclZpZXcgPT09ICdudW1iZXInKSByZXR1cm4gcGFyYW1zLnNsaWRlc1BlclZpZXc7XG4gICAgaWYgKHBhcmFtcy5jZW50ZXJlZFNsaWRlcykge1xuICAgICAgbGV0IHNsaWRlU2l6ZSA9IHNsaWRlc1thY3RpdmVJbmRleF0gPyBzbGlkZXNbYWN0aXZlSW5kZXhdLnN3aXBlclNsaWRlU2l6ZSA6IDA7XG4gICAgICBsZXQgYnJlYWtMb29wO1xuICAgICAgZm9yIChsZXQgaSA9IGFjdGl2ZUluZGV4ICsgMTsgaSA8IHNsaWRlcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBpZiAoc2xpZGVzW2ldICYmICFicmVha0xvb3ApIHtcbiAgICAgICAgICBzbGlkZVNpemUgKz0gc2xpZGVzW2ldLnN3aXBlclNsaWRlU2l6ZTtcbiAgICAgICAgICBzcHYgKz0gMTtcbiAgICAgICAgICBpZiAoc2xpZGVTaXplID4gc3dpcGVyU2l6ZSkgYnJlYWtMb29wID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZm9yIChsZXQgaSA9IGFjdGl2ZUluZGV4IC0gMTsgaSA+PSAwOyBpIC09IDEpIHtcbiAgICAgICAgaWYgKHNsaWRlc1tpXSAmJiAhYnJlYWtMb29wKSB7XG4gICAgICAgICAgc2xpZGVTaXplICs9IHNsaWRlc1tpXS5zd2lwZXJTbGlkZVNpemU7XG4gICAgICAgICAgc3B2ICs9IDE7XG4gICAgICAgICAgaWYgKHNsaWRlU2l6ZSA+IHN3aXBlclNpemUpIGJyZWFrTG9vcCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgICBpZiAodmlldyA9PT0gJ2N1cnJlbnQnKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSBhY3RpdmVJbmRleCArIDE7IGkgPCBzbGlkZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICBjb25zdCBzbGlkZUluVmlldyA9IGV4YWN0ID8gc2xpZGVzR3JpZFtpXSArIHNsaWRlc1NpemVzR3JpZFtpXSAtIHNsaWRlc0dyaWRbYWN0aXZlSW5kZXhdIDwgc3dpcGVyU2l6ZSA6IHNsaWRlc0dyaWRbaV0gLSBzbGlkZXNHcmlkW2FjdGl2ZUluZGV4XSA8IHN3aXBlclNpemU7XG4gICAgICAgICAgaWYgKHNsaWRlSW5WaWV3KSB7XG4gICAgICAgICAgICBzcHYgKz0gMTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHByZXZpb3VzXG4gICAgICAgIGZvciAobGV0IGkgPSBhY3RpdmVJbmRleCAtIDE7IGkgPj0gMDsgaSAtPSAxKSB7XG4gICAgICAgICAgY29uc3Qgc2xpZGVJblZpZXcgPSBzbGlkZXNHcmlkW2FjdGl2ZUluZGV4XSAtIHNsaWRlc0dyaWRbaV0gPCBzd2lwZXJTaXplO1xuICAgICAgICAgIGlmIChzbGlkZUluVmlldykge1xuICAgICAgICAgICAgc3B2ICs9IDE7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzcHY7XG4gIH1cbiAgdXBkYXRlKCkge1xuICAgIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gICAgaWYgKCFzd2lwZXIgfHwgc3dpcGVyLmRlc3Ryb3llZCkgcmV0dXJuO1xuICAgIGNvbnN0IHtcbiAgICAgIHNuYXBHcmlkLFxuICAgICAgcGFyYW1zXG4gICAgfSA9IHN3aXBlcjtcbiAgICAvLyBCcmVha3BvaW50c1xuICAgIGlmIChwYXJhbXMuYnJlYWtwb2ludHMpIHtcbiAgICAgIHN3aXBlci5zZXRCcmVha3BvaW50KCk7XG4gICAgfVxuICAgIFsuLi5zd2lwZXIuZWwucXVlcnlTZWxlY3RvckFsbCgnW2xvYWRpbmc9XCJsYXp5XCJdJyldLmZvckVhY2goaW1hZ2VFbCA9PiB7XG4gICAgICBpZiAoaW1hZ2VFbC5jb21wbGV0ZSkge1xuICAgICAgICBwcm9jZXNzTGF6eVByZWxvYWRlcihzd2lwZXIsIGltYWdlRWwpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHN3aXBlci51cGRhdGVTaXplKCk7XG4gICAgc3dpcGVyLnVwZGF0ZVNsaWRlcygpO1xuICAgIHN3aXBlci51cGRhdGVQcm9ncmVzcygpO1xuICAgIHN3aXBlci51cGRhdGVTbGlkZXNDbGFzc2VzKCk7XG4gICAgZnVuY3Rpb24gc2V0VHJhbnNsYXRlKCkge1xuICAgICAgY29uc3QgdHJhbnNsYXRlVmFsdWUgPSBzd2lwZXIucnRsVHJhbnNsYXRlID8gc3dpcGVyLnRyYW5zbGF0ZSAqIC0xIDogc3dpcGVyLnRyYW5zbGF0ZTtcbiAgICAgIGNvbnN0IG5ld1RyYW5zbGF0ZSA9IE1hdGgubWluKE1hdGgubWF4KHRyYW5zbGF0ZVZhbHVlLCBzd2lwZXIubWF4VHJhbnNsYXRlKCkpLCBzd2lwZXIubWluVHJhbnNsYXRlKCkpO1xuICAgICAgc3dpcGVyLnNldFRyYW5zbGF0ZShuZXdUcmFuc2xhdGUpO1xuICAgICAgc3dpcGVyLnVwZGF0ZUFjdGl2ZUluZGV4KCk7XG4gICAgICBzd2lwZXIudXBkYXRlU2xpZGVzQ2xhc3NlcygpO1xuICAgIH1cbiAgICBsZXQgdHJhbnNsYXRlZDtcbiAgICBpZiAocGFyYW1zLmZyZWVNb2RlICYmIHBhcmFtcy5mcmVlTW9kZS5lbmFibGVkICYmICFwYXJhbXMuY3NzTW9kZSkge1xuICAgICAgc2V0VHJhbnNsYXRlKCk7XG4gICAgICBpZiAocGFyYW1zLmF1dG9IZWlnaHQpIHtcbiAgICAgICAgc3dpcGVyLnVwZGF0ZUF1dG9IZWlnaHQoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKChwYXJhbXMuc2xpZGVzUGVyVmlldyA9PT0gJ2F1dG8nIHx8IHBhcmFtcy5zbGlkZXNQZXJWaWV3ID4gMSkgJiYgc3dpcGVyLmlzRW5kICYmICFwYXJhbXMuY2VudGVyZWRTbGlkZXMpIHtcbiAgICAgICAgY29uc3Qgc2xpZGVzID0gc3dpcGVyLnZpcnR1YWwgJiYgcGFyYW1zLnZpcnR1YWwuZW5hYmxlZCA/IHN3aXBlci52aXJ0dWFsLnNsaWRlcyA6IHN3aXBlci5zbGlkZXM7XG4gICAgICAgIHRyYW5zbGF0ZWQgPSBzd2lwZXIuc2xpZGVUbyhzbGlkZXMubGVuZ3RoIC0gMSwgMCwgZmFsc2UsIHRydWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHJhbnNsYXRlZCA9IHN3aXBlci5zbGlkZVRvKHN3aXBlci5hY3RpdmVJbmRleCwgMCwgZmFsc2UsIHRydWUpO1xuICAgICAgfVxuICAgICAgaWYgKCF0cmFuc2xhdGVkKSB7XG4gICAgICAgIHNldFRyYW5zbGF0ZSgpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAocGFyYW1zLndhdGNoT3ZlcmZsb3cgJiYgc25hcEdyaWQgIT09IHN3aXBlci5zbmFwR3JpZCkge1xuICAgICAgc3dpcGVyLmNoZWNrT3ZlcmZsb3coKTtcbiAgICB9XG4gICAgc3dpcGVyLmVtaXQoJ3VwZGF0ZScpO1xuICB9XG4gIGNoYW5nZURpcmVjdGlvbihuZXdEaXJlY3Rpb24sIG5lZWRVcGRhdGUpIHtcbiAgICBpZiAobmVlZFVwZGF0ZSA9PT0gdm9pZCAwKSB7XG4gICAgICBuZWVkVXBkYXRlID0gdHJ1ZTtcbiAgICB9XG4gICAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgICBjb25zdCBjdXJyZW50RGlyZWN0aW9uID0gc3dpcGVyLnBhcmFtcy5kaXJlY3Rpb247XG4gICAgaWYgKCFuZXdEaXJlY3Rpb24pIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgICAgbmV3RGlyZWN0aW9uID0gY3VycmVudERpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnID8gJ3ZlcnRpY2FsJyA6ICdob3Jpem9udGFsJztcbiAgICB9XG4gICAgaWYgKG5ld0RpcmVjdGlvbiA9PT0gY3VycmVudERpcmVjdGlvbiB8fCBuZXdEaXJlY3Rpb24gIT09ICdob3Jpem9udGFsJyAmJiBuZXdEaXJlY3Rpb24gIT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgIHJldHVybiBzd2lwZXI7XG4gICAgfVxuICAgIHN3aXBlci5lbC5jbGFzc0xpc3QucmVtb3ZlKGAke3N3aXBlci5wYXJhbXMuY29udGFpbmVyTW9kaWZpZXJDbGFzc30ke2N1cnJlbnREaXJlY3Rpb259YCk7XG4gICAgc3dpcGVyLmVsLmNsYXNzTGlzdC5hZGQoYCR7c3dpcGVyLnBhcmFtcy5jb250YWluZXJNb2RpZmllckNsYXNzfSR7bmV3RGlyZWN0aW9ufWApO1xuICAgIHN3aXBlci5lbWl0Q29udGFpbmVyQ2xhc3NlcygpO1xuICAgIHN3aXBlci5wYXJhbXMuZGlyZWN0aW9uID0gbmV3RGlyZWN0aW9uO1xuICAgIHN3aXBlci5zbGlkZXMuZm9yRWFjaChzbGlkZUVsID0+IHtcbiAgICAgIGlmIChuZXdEaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgICAgc2xpZGVFbC5zdHlsZS53aWR0aCA9ICcnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2xpZGVFbC5zdHlsZS5oZWlnaHQgPSAnJztcbiAgICAgIH1cbiAgICB9KTtcbiAgICBzd2lwZXIuZW1pdCgnY2hhbmdlRGlyZWN0aW9uJyk7XG4gICAgaWYgKG5lZWRVcGRhdGUpIHN3aXBlci51cGRhdGUoKTtcbiAgICByZXR1cm4gc3dpcGVyO1xuICB9XG4gIGNoYW5nZUxhbmd1YWdlRGlyZWN0aW9uKGRpcmVjdGlvbikge1xuICAgIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gICAgaWYgKHN3aXBlci5ydGwgJiYgZGlyZWN0aW9uID09PSAncnRsJyB8fCAhc3dpcGVyLnJ0bCAmJiBkaXJlY3Rpb24gPT09ICdsdHInKSByZXR1cm47XG4gICAgc3dpcGVyLnJ0bCA9IGRpcmVjdGlvbiA9PT0gJ3J0bCc7XG4gICAgc3dpcGVyLnJ0bFRyYW5zbGF0ZSA9IHN3aXBlci5wYXJhbXMuZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcgJiYgc3dpcGVyLnJ0bDtcbiAgICBpZiAoc3dpcGVyLnJ0bCkge1xuICAgICAgc3dpcGVyLmVsLmNsYXNzTGlzdC5hZGQoYCR7c3dpcGVyLnBhcmFtcy5jb250YWluZXJNb2RpZmllckNsYXNzfXJ0bGApO1xuICAgICAgc3dpcGVyLmVsLmRpciA9ICdydGwnO1xuICAgIH0gZWxzZSB7XG4gICAgICBzd2lwZXIuZWwuY2xhc3NMaXN0LnJlbW92ZShgJHtzd2lwZXIucGFyYW1zLmNvbnRhaW5lck1vZGlmaWVyQ2xhc3N9cnRsYCk7XG4gICAgICBzd2lwZXIuZWwuZGlyID0gJ2x0cic7XG4gICAgfVxuICAgIHN3aXBlci51cGRhdGUoKTtcbiAgfVxuICBtb3VudChlbGVtZW50KSB7XG4gICAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgICBpZiAoc3dpcGVyLm1vdW50ZWQpIHJldHVybiB0cnVlO1xuXG4gICAgLy8gRmluZCBlbFxuICAgIGxldCBlbCA9IGVsZW1lbnQgfHwgc3dpcGVyLnBhcmFtcy5lbDtcbiAgICBpZiAodHlwZW9mIGVsID09PSAnc3RyaW5nJykge1xuICAgICAgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsKTtcbiAgICB9XG4gICAgaWYgKCFlbCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBlbC5zd2lwZXIgPSBzd2lwZXI7XG4gICAgaWYgKGVsLnBhcmVudE5vZGUgJiYgZWwucGFyZW50Tm9kZS5ob3N0ICYmIGVsLnBhcmVudE5vZGUuaG9zdC5ub2RlTmFtZSA9PT0gJ1NXSVBFUi1DT05UQUlORVInKSB7XG4gICAgICBzd2lwZXIuaXNFbGVtZW50ID0gdHJ1ZTtcbiAgICB9XG4gICAgY29uc3QgZ2V0V3JhcHBlclNlbGVjdG9yID0gKCkgPT4ge1xuICAgICAgcmV0dXJuIGAuJHsoc3dpcGVyLnBhcmFtcy53cmFwcGVyQ2xhc3MgfHwgJycpLnRyaW0oKS5zcGxpdCgnICcpLmpvaW4oJy4nKX1gO1xuICAgIH07XG4gICAgY29uc3QgZ2V0V3JhcHBlciA9ICgpID0+IHtcbiAgICAgIGlmIChlbCAmJiBlbC5zaGFkb3dSb290ICYmIGVsLnNoYWRvd1Jvb3QucXVlcnlTZWxlY3Rvcikge1xuICAgICAgICBjb25zdCByZXMgPSBlbC5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3IoZ2V0V3JhcHBlclNlbGVjdG9yKCkpO1xuICAgICAgICAvLyBDaGlsZHJlbiBuZWVkcyB0byByZXR1cm4gc2xvdCBpdGVtc1xuICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGVsZW1lbnRDaGlsZHJlbihlbCwgZ2V0V3JhcHBlclNlbGVjdG9yKCkpWzBdO1xuICAgIH07XG4gICAgLy8gRmluZCBXcmFwcGVyXG4gICAgbGV0IHdyYXBwZXJFbCA9IGdldFdyYXBwZXIoKTtcbiAgICBpZiAoIXdyYXBwZXJFbCAmJiBzd2lwZXIucGFyYW1zLmNyZWF0ZUVsZW1lbnRzKSB7XG4gICAgICB3cmFwcGVyRWwgPSBjcmVhdGVFbGVtZW50KCdkaXYnLCBzd2lwZXIucGFyYW1zLndyYXBwZXJDbGFzcyk7XG4gICAgICBlbC5hcHBlbmQod3JhcHBlckVsKTtcbiAgICAgIGVsZW1lbnRDaGlsZHJlbihlbCwgYC4ke3N3aXBlci5wYXJhbXMuc2xpZGVDbGFzc31gKS5mb3JFYWNoKHNsaWRlRWwgPT4ge1xuICAgICAgICB3cmFwcGVyRWwuYXBwZW5kKHNsaWRlRWwpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIE9iamVjdC5hc3NpZ24oc3dpcGVyLCB7XG4gICAgICBlbCxcbiAgICAgIHdyYXBwZXJFbCxcbiAgICAgIHNsaWRlc0VsOiBzd2lwZXIuaXNFbGVtZW50ICYmICFlbC5wYXJlbnROb2RlLmhvc3Quc2xpZGVTbG90cyA/IGVsLnBhcmVudE5vZGUuaG9zdCA6IHdyYXBwZXJFbCxcbiAgICAgIGhvc3RFbDogc3dpcGVyLmlzRWxlbWVudCA/IGVsLnBhcmVudE5vZGUuaG9zdCA6IGVsLFxuICAgICAgbW91bnRlZDogdHJ1ZSxcbiAgICAgIC8vIFJUTFxuICAgICAgcnRsOiBlbC5kaXIudG9Mb3dlckNhc2UoKSA9PT0gJ3J0bCcgfHwgZWxlbWVudFN0eWxlKGVsLCAnZGlyZWN0aW9uJykgPT09ICdydGwnLFxuICAgICAgcnRsVHJhbnNsYXRlOiBzd2lwZXIucGFyYW1zLmRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnICYmIChlbC5kaXIudG9Mb3dlckNhc2UoKSA9PT0gJ3J0bCcgfHwgZWxlbWVudFN0eWxlKGVsLCAnZGlyZWN0aW9uJykgPT09ICdydGwnKSxcbiAgICAgIHdyb25nUlRMOiBlbGVtZW50U3R5bGUod3JhcHBlckVsLCAnZGlzcGxheScpID09PSAnLXdlYmtpdC1ib3gnXG4gICAgfSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaW5pdChlbCkge1xuICAgIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gICAgaWYgKHN3aXBlci5pbml0aWFsaXplZCkgcmV0dXJuIHN3aXBlcjtcbiAgICBjb25zdCBtb3VudGVkID0gc3dpcGVyLm1vdW50KGVsKTtcbiAgICBpZiAobW91bnRlZCA9PT0gZmFsc2UpIHJldHVybiBzd2lwZXI7XG4gICAgc3dpcGVyLmVtaXQoJ2JlZm9yZUluaXQnKTtcblxuICAgIC8vIFNldCBicmVha3BvaW50XG4gICAgaWYgKHN3aXBlci5wYXJhbXMuYnJlYWtwb2ludHMpIHtcbiAgICAgIHN3aXBlci5zZXRCcmVha3BvaW50KCk7XG4gICAgfVxuXG4gICAgLy8gQWRkIENsYXNzZXNcbiAgICBzd2lwZXIuYWRkQ2xhc3NlcygpO1xuXG4gICAgLy8gVXBkYXRlIHNpemVcbiAgICBzd2lwZXIudXBkYXRlU2l6ZSgpO1xuXG4gICAgLy8gVXBkYXRlIHNsaWRlc1xuICAgIHN3aXBlci51cGRhdGVTbGlkZXMoKTtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy53YXRjaE92ZXJmbG93KSB7XG4gICAgICBzd2lwZXIuY2hlY2tPdmVyZmxvdygpO1xuICAgIH1cblxuICAgIC8vIFNldCBHcmFiIEN1cnNvclxuICAgIGlmIChzd2lwZXIucGFyYW1zLmdyYWJDdXJzb3IgJiYgc3dpcGVyLmVuYWJsZWQpIHtcbiAgICAgIHN3aXBlci5zZXRHcmFiQ3Vyc29yKCk7XG4gICAgfVxuXG4gICAgLy8gU2xpZGUgVG8gSW5pdGlhbCBTbGlkZVxuICAgIGlmIChzd2lwZXIucGFyYW1zLmxvb3AgJiYgc3dpcGVyLnZpcnR1YWwgJiYgc3dpcGVyLnBhcmFtcy52aXJ0dWFsLmVuYWJsZWQpIHtcbiAgICAgIHN3aXBlci5zbGlkZVRvKHN3aXBlci5wYXJhbXMuaW5pdGlhbFNsaWRlICsgc3dpcGVyLnZpcnR1YWwuc2xpZGVzQmVmb3JlLCAwLCBzd2lwZXIucGFyYW1zLnJ1bkNhbGxiYWNrc09uSW5pdCwgZmFsc2UsIHRydWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzd2lwZXIuc2xpZGVUbyhzd2lwZXIucGFyYW1zLmluaXRpYWxTbGlkZSwgMCwgc3dpcGVyLnBhcmFtcy5ydW5DYWxsYmFja3NPbkluaXQsIGZhbHNlLCB0cnVlKTtcbiAgICB9XG5cbiAgICAvLyBDcmVhdGUgbG9vcFxuICAgIGlmIChzd2lwZXIucGFyYW1zLmxvb3ApIHtcbiAgICAgIHN3aXBlci5sb29wQ3JlYXRlKCk7XG4gICAgfVxuXG4gICAgLy8gQXR0YWNoIGV2ZW50c1xuICAgIHN3aXBlci5hdHRhY2hFdmVudHMoKTtcbiAgICBjb25zdCBsYXp5RWxlbWVudHMgPSBbLi4uc3dpcGVyLmVsLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tsb2FkaW5nPVwibGF6eVwiXScpXTtcbiAgICBpZiAoc3dpcGVyLmlzRWxlbWVudCkge1xuICAgICAgbGF6eUVsZW1lbnRzLnB1c2goLi4uc3dpcGVyLmhvc3RFbC5xdWVyeVNlbGVjdG9yQWxsKCdbbG9hZGluZz1cImxhenlcIl0nKSk7XG4gICAgfVxuICAgIGxhenlFbGVtZW50cy5mb3JFYWNoKGltYWdlRWwgPT4ge1xuICAgICAgaWYgKGltYWdlRWwuY29tcGxldGUpIHtcbiAgICAgICAgcHJvY2Vzc0xhenlQcmVsb2FkZXIoc3dpcGVyLCBpbWFnZUVsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGltYWdlRWwuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGUgPT4ge1xuICAgICAgICAgIHByb2Nlc3NMYXp5UHJlbG9hZGVyKHN3aXBlciwgZS50YXJnZXQpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwcmVsb2FkKHN3aXBlcik7XG5cbiAgICAvLyBJbml0IEZsYWdcbiAgICBzd2lwZXIuaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgIHByZWxvYWQoc3dpcGVyKTtcblxuICAgIC8vIEVtaXRcbiAgICBzd2lwZXIuZW1pdCgnaW5pdCcpO1xuICAgIHN3aXBlci5lbWl0KCdhZnRlckluaXQnKTtcbiAgICByZXR1cm4gc3dpcGVyO1xuICB9XG4gIGRlc3Ryb3koZGVsZXRlSW5zdGFuY2UsIGNsZWFuU3R5bGVzKSB7XG4gICAgaWYgKGRlbGV0ZUluc3RhbmNlID09PSB2b2lkIDApIHtcbiAgICAgIGRlbGV0ZUluc3RhbmNlID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGNsZWFuU3R5bGVzID09PSB2b2lkIDApIHtcbiAgICAgIGNsZWFuU3R5bGVzID0gdHJ1ZTtcbiAgICB9XG4gICAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgICBjb25zdCB7XG4gICAgICBwYXJhbXMsXG4gICAgICBlbCxcbiAgICAgIHdyYXBwZXJFbCxcbiAgICAgIHNsaWRlc1xuICAgIH0gPSBzd2lwZXI7XG4gICAgaWYgKHR5cGVvZiBzd2lwZXIucGFyYW1zID09PSAndW5kZWZpbmVkJyB8fCBzd2lwZXIuZGVzdHJveWVkKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgc3dpcGVyLmVtaXQoJ2JlZm9yZURlc3Ryb3knKTtcblxuICAgIC8vIEluaXQgRmxhZ1xuICAgIHN3aXBlci5pbml0aWFsaXplZCA9IGZhbHNlO1xuXG4gICAgLy8gRGV0YWNoIGV2ZW50c1xuICAgIHN3aXBlci5kZXRhY2hFdmVudHMoKTtcblxuICAgIC8vIERlc3Ryb3kgbG9vcFxuICAgIGlmIChwYXJhbXMubG9vcCkge1xuICAgICAgc3dpcGVyLmxvb3BEZXN0cm95KCk7XG4gICAgfVxuXG4gICAgLy8gQ2xlYW51cCBzdHlsZXNcbiAgICBpZiAoY2xlYW5TdHlsZXMpIHtcbiAgICAgIHN3aXBlci5yZW1vdmVDbGFzc2VzKCk7XG4gICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoJ3N0eWxlJyk7XG4gICAgICB3cmFwcGVyRWwucmVtb3ZlQXR0cmlidXRlKCdzdHlsZScpO1xuICAgICAgaWYgKHNsaWRlcyAmJiBzbGlkZXMubGVuZ3RoKSB7XG4gICAgICAgIHNsaWRlcy5mb3JFYWNoKHNsaWRlRWwgPT4ge1xuICAgICAgICAgIHNsaWRlRWwuY2xhc3NMaXN0LnJlbW92ZShwYXJhbXMuc2xpZGVWaXNpYmxlQ2xhc3MsIHBhcmFtcy5zbGlkZUZ1bGx5VmlzaWJsZUNsYXNzLCBwYXJhbXMuc2xpZGVBY3RpdmVDbGFzcywgcGFyYW1zLnNsaWRlTmV4dENsYXNzLCBwYXJhbXMuc2xpZGVQcmV2Q2xhc3MpO1xuICAgICAgICAgIHNsaWRlRWwucmVtb3ZlQXR0cmlidXRlKCdzdHlsZScpO1xuICAgICAgICAgIHNsaWRlRWwucmVtb3ZlQXR0cmlidXRlKCdkYXRhLXN3aXBlci1zbGlkZS1pbmRleCcpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgc3dpcGVyLmVtaXQoJ2Rlc3Ryb3knKTtcblxuICAgIC8vIERldGFjaCBlbWl0dGVyIGV2ZW50c1xuICAgIE9iamVjdC5rZXlzKHN3aXBlci5ldmVudHNMaXN0ZW5lcnMpLmZvckVhY2goZXZlbnROYW1lID0+IHtcbiAgICAgIHN3aXBlci5vZmYoZXZlbnROYW1lKTtcbiAgICB9KTtcbiAgICBpZiAoZGVsZXRlSW5zdGFuY2UgIT09IGZhbHNlKSB7XG4gICAgICBzd2lwZXIuZWwuc3dpcGVyID0gbnVsbDtcbiAgICAgIGRlbGV0ZVByb3BzKHN3aXBlcik7XG4gICAgfVxuICAgIHN3aXBlci5kZXN0cm95ZWQgPSB0cnVlO1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHN0YXRpYyBleHRlbmREZWZhdWx0cyhuZXdEZWZhdWx0cykge1xuICAgIGV4dGVuZChleHRlbmRlZERlZmF1bHRzLCBuZXdEZWZhdWx0cyk7XG4gIH1cbiAgc3RhdGljIGdldCBleHRlbmRlZERlZmF1bHRzKCkge1xuICAgIHJldHVybiBleHRlbmRlZERlZmF1bHRzO1xuICB9XG4gIHN0YXRpYyBnZXQgZGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIGRlZmF1bHRzO1xuICB9XG4gIHN0YXRpYyBpbnN0YWxsTW9kdWxlKG1vZCkge1xuICAgIGlmICghU3dpcGVyLnByb3RvdHlwZS5fX21vZHVsZXNfXykgU3dpcGVyLnByb3RvdHlwZS5fX21vZHVsZXNfXyA9IFtdO1xuICAgIGNvbnN0IG1vZHVsZXMgPSBTd2lwZXIucHJvdG90eXBlLl9fbW9kdWxlc19fO1xuICAgIGlmICh0eXBlb2YgbW9kID09PSAnZnVuY3Rpb24nICYmIG1vZHVsZXMuaW5kZXhPZihtb2QpIDwgMCkge1xuICAgICAgbW9kdWxlcy5wdXNoKG1vZCk7XG4gICAgfVxuICB9XG4gIHN0YXRpYyB1c2UobW9kdWxlKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkobW9kdWxlKSkge1xuICAgICAgbW9kdWxlLmZvckVhY2gobSA9PiBTd2lwZXIuaW5zdGFsbE1vZHVsZShtKSk7XG4gICAgICByZXR1cm4gU3dpcGVyO1xuICAgIH1cbiAgICBTd2lwZXIuaW5zdGFsbE1vZHVsZShtb2R1bGUpO1xuICAgIHJldHVybiBTd2lwZXI7XG4gIH1cbn1cbk9iamVjdC5rZXlzKHByb3RvdHlwZXMpLmZvckVhY2gocHJvdG90eXBlR3JvdXAgPT4ge1xuICBPYmplY3Qua2V5cyhwcm90b3R5cGVzW3Byb3RvdHlwZUdyb3VwXSkuZm9yRWFjaChwcm90b01ldGhvZCA9PiB7XG4gICAgU3dpcGVyLnByb3RvdHlwZVtwcm90b01ldGhvZF0gPSBwcm90b3R5cGVzW3Byb3RvdHlwZUdyb3VwXVtwcm90b01ldGhvZF07XG4gIH0pO1xufSk7XG5Td2lwZXIudXNlKFtSZXNpemUsIE9ic2VydmVyXSk7XG5cbmV4cG9ydCB7IFN3aXBlciBhcyBTLCBkZWZhdWx0cyBhcyBkIH07XG4iLCJpbXBvcnQgeyBnIGFzIGdldERvY3VtZW50IH0gZnJvbSAnLi4vc2hhcmVkL3Nzci13aW5kb3cuZXNtLm1qcyc7XG5pbXBvcnQgeyBzIGFzIHNldENTU1Byb3BlcnR5LCBlIGFzIGVsZW1lbnRDaGlsZHJlbiwgYyBhcyBjcmVhdGVFbGVtZW50IH0gZnJvbSAnLi4vc2hhcmVkL3V0aWxzLm1qcyc7XG5cbmZ1bmN0aW9uIFZpcnR1YWwoX3JlZikge1xuICBsZXQge1xuICAgIHN3aXBlcixcbiAgICBleHRlbmRQYXJhbXMsXG4gICAgb24sXG4gICAgZW1pdFxuICB9ID0gX3JlZjtcbiAgZXh0ZW5kUGFyYW1zKHtcbiAgICB2aXJ0dWFsOiB7XG4gICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgIHNsaWRlczogW10sXG4gICAgICBjYWNoZTogdHJ1ZSxcbiAgICAgIHJlbmRlclNsaWRlOiBudWxsLFxuICAgICAgcmVuZGVyRXh0ZXJuYWw6IG51bGwsXG4gICAgICByZW5kZXJFeHRlcm5hbFVwZGF0ZTogdHJ1ZSxcbiAgICAgIGFkZFNsaWRlc0JlZm9yZTogMCxcbiAgICAgIGFkZFNsaWRlc0FmdGVyOiAwXG4gICAgfVxuICB9KTtcbiAgbGV0IGNzc01vZGVUaW1lb3V0O1xuICBjb25zdCBkb2N1bWVudCA9IGdldERvY3VtZW50KCk7XG4gIHN3aXBlci52aXJ0dWFsID0ge1xuICAgIGNhY2hlOiB7fSxcbiAgICBmcm9tOiB1bmRlZmluZWQsXG4gICAgdG86IHVuZGVmaW5lZCxcbiAgICBzbGlkZXM6IFtdLFxuICAgIG9mZnNldDogMCxcbiAgICBzbGlkZXNHcmlkOiBbXVxuICB9O1xuICBjb25zdCB0ZW1wRE9NID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGZ1bmN0aW9uIHJlbmRlclNsaWRlKHNsaWRlLCBpbmRleCkge1xuICAgIGNvbnN0IHBhcmFtcyA9IHN3aXBlci5wYXJhbXMudmlydHVhbDtcbiAgICBpZiAocGFyYW1zLmNhY2hlICYmIHN3aXBlci52aXJ0dWFsLmNhY2hlW2luZGV4XSkge1xuICAgICAgcmV0dXJuIHN3aXBlci52aXJ0dWFsLmNhY2hlW2luZGV4XTtcbiAgICB9XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgbGV0IHNsaWRlRWw7XG4gICAgaWYgKHBhcmFtcy5yZW5kZXJTbGlkZSkge1xuICAgICAgc2xpZGVFbCA9IHBhcmFtcy5yZW5kZXJTbGlkZS5jYWxsKHN3aXBlciwgc2xpZGUsIGluZGV4KTtcbiAgICAgIGlmICh0eXBlb2Ygc2xpZGVFbCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGVtcERPTS5pbm5lckhUTUwgPSBzbGlkZUVsO1xuICAgICAgICBzbGlkZUVsID0gdGVtcERPTS5jaGlsZHJlblswXTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHN3aXBlci5pc0VsZW1lbnQpIHtcbiAgICAgIHNsaWRlRWwgPSBjcmVhdGVFbGVtZW50KCdzd2lwZXItc2xpZGUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2xpZGVFbCA9IGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHN3aXBlci5wYXJhbXMuc2xpZGVDbGFzcyk7XG4gICAgfVxuICAgIHNsaWRlRWwuc2V0QXR0cmlidXRlKCdkYXRhLXN3aXBlci1zbGlkZS1pbmRleCcsIGluZGV4KTtcbiAgICBpZiAoIXBhcmFtcy5yZW5kZXJTbGlkZSkge1xuICAgICAgc2xpZGVFbC5pbm5lckhUTUwgPSBzbGlkZTtcbiAgICB9XG4gICAgaWYgKHBhcmFtcy5jYWNoZSkge1xuICAgICAgc3dpcGVyLnZpcnR1YWwuY2FjaGVbaW5kZXhdID0gc2xpZGVFbDtcbiAgICB9XG4gICAgcmV0dXJuIHNsaWRlRWw7XG4gIH1cbiAgZnVuY3Rpb24gdXBkYXRlKGZvcmNlKSB7XG4gICAgY29uc3Qge1xuICAgICAgc2xpZGVzUGVyVmlldyxcbiAgICAgIHNsaWRlc1Blckdyb3VwLFxuICAgICAgY2VudGVyZWRTbGlkZXMsXG4gICAgICBsb29wOiBpc0xvb3BcbiAgICB9ID0gc3dpcGVyLnBhcmFtcztcbiAgICBjb25zdCB7XG4gICAgICBhZGRTbGlkZXNCZWZvcmUsXG4gICAgICBhZGRTbGlkZXNBZnRlclxuICAgIH0gPSBzd2lwZXIucGFyYW1zLnZpcnR1YWw7XG4gICAgY29uc3Qge1xuICAgICAgZnJvbTogcHJldmlvdXNGcm9tLFxuICAgICAgdG86IHByZXZpb3VzVG8sXG4gICAgICBzbGlkZXMsXG4gICAgICBzbGlkZXNHcmlkOiBwcmV2aW91c1NsaWRlc0dyaWQsXG4gICAgICBvZmZzZXQ6IHByZXZpb3VzT2Zmc2V0XG4gICAgfSA9IHN3aXBlci52aXJ0dWFsO1xuICAgIGlmICghc3dpcGVyLnBhcmFtcy5jc3NNb2RlKSB7XG4gICAgICBzd2lwZXIudXBkYXRlQWN0aXZlSW5kZXgoKTtcbiAgICB9XG4gICAgY29uc3QgYWN0aXZlSW5kZXggPSBzd2lwZXIuYWN0aXZlSW5kZXggfHwgMDtcbiAgICBsZXQgb2Zmc2V0UHJvcDtcbiAgICBpZiAoc3dpcGVyLnJ0bFRyYW5zbGF0ZSkgb2Zmc2V0UHJvcCA9ICdyaWdodCc7ZWxzZSBvZmZzZXRQcm9wID0gc3dpcGVyLmlzSG9yaXpvbnRhbCgpID8gJ2xlZnQnIDogJ3RvcCc7XG4gICAgbGV0IHNsaWRlc0FmdGVyO1xuICAgIGxldCBzbGlkZXNCZWZvcmU7XG4gICAgaWYgKGNlbnRlcmVkU2xpZGVzKSB7XG4gICAgICBzbGlkZXNBZnRlciA9IE1hdGguZmxvb3Ioc2xpZGVzUGVyVmlldyAvIDIpICsgc2xpZGVzUGVyR3JvdXAgKyBhZGRTbGlkZXNBZnRlcjtcbiAgICAgIHNsaWRlc0JlZm9yZSA9IE1hdGguZmxvb3Ioc2xpZGVzUGVyVmlldyAvIDIpICsgc2xpZGVzUGVyR3JvdXAgKyBhZGRTbGlkZXNCZWZvcmU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNsaWRlc0FmdGVyID0gc2xpZGVzUGVyVmlldyArIChzbGlkZXNQZXJHcm91cCAtIDEpICsgYWRkU2xpZGVzQWZ0ZXI7XG4gICAgICBzbGlkZXNCZWZvcmUgPSAoaXNMb29wID8gc2xpZGVzUGVyVmlldyA6IHNsaWRlc1Blckdyb3VwKSArIGFkZFNsaWRlc0JlZm9yZTtcbiAgICB9XG4gICAgbGV0IGZyb20gPSBhY3RpdmVJbmRleCAtIHNsaWRlc0JlZm9yZTtcbiAgICBsZXQgdG8gPSBhY3RpdmVJbmRleCArIHNsaWRlc0FmdGVyO1xuICAgIGlmICghaXNMb29wKSB7XG4gICAgICBmcm9tID0gTWF0aC5tYXgoZnJvbSwgMCk7XG4gICAgICB0byA9IE1hdGgubWluKHRvLCBzbGlkZXMubGVuZ3RoIC0gMSk7XG4gICAgfVxuICAgIGxldCBvZmZzZXQgPSAoc3dpcGVyLnNsaWRlc0dyaWRbZnJvbV0gfHwgMCkgLSAoc3dpcGVyLnNsaWRlc0dyaWRbMF0gfHwgMCk7XG4gICAgaWYgKGlzTG9vcCAmJiBhY3RpdmVJbmRleCA+PSBzbGlkZXNCZWZvcmUpIHtcbiAgICAgIGZyb20gLT0gc2xpZGVzQmVmb3JlO1xuICAgICAgaWYgKCFjZW50ZXJlZFNsaWRlcykgb2Zmc2V0ICs9IHN3aXBlci5zbGlkZXNHcmlkWzBdO1xuICAgIH0gZWxzZSBpZiAoaXNMb29wICYmIGFjdGl2ZUluZGV4IDwgc2xpZGVzQmVmb3JlKSB7XG4gICAgICBmcm9tID0gLXNsaWRlc0JlZm9yZTtcbiAgICAgIGlmIChjZW50ZXJlZFNsaWRlcykgb2Zmc2V0ICs9IHN3aXBlci5zbGlkZXNHcmlkWzBdO1xuICAgIH1cbiAgICBPYmplY3QuYXNzaWduKHN3aXBlci52aXJ0dWFsLCB7XG4gICAgICBmcm9tLFxuICAgICAgdG8sXG4gICAgICBvZmZzZXQsXG4gICAgICBzbGlkZXNHcmlkOiBzd2lwZXIuc2xpZGVzR3JpZCxcbiAgICAgIHNsaWRlc0JlZm9yZSxcbiAgICAgIHNsaWRlc0FmdGVyXG4gICAgfSk7XG4gICAgZnVuY3Rpb24gb25SZW5kZXJlZCgpIHtcbiAgICAgIHN3aXBlci51cGRhdGVTbGlkZXMoKTtcbiAgICAgIHN3aXBlci51cGRhdGVQcm9ncmVzcygpO1xuICAgICAgc3dpcGVyLnVwZGF0ZVNsaWRlc0NsYXNzZXMoKTtcbiAgICAgIGVtaXQoJ3ZpcnR1YWxVcGRhdGUnKTtcbiAgICB9XG4gICAgaWYgKHByZXZpb3VzRnJvbSA9PT0gZnJvbSAmJiBwcmV2aW91c1RvID09PSB0byAmJiAhZm9yY2UpIHtcbiAgICAgIGlmIChzd2lwZXIuc2xpZGVzR3JpZCAhPT0gcHJldmlvdXNTbGlkZXNHcmlkICYmIG9mZnNldCAhPT0gcHJldmlvdXNPZmZzZXQpIHtcbiAgICAgICAgc3dpcGVyLnNsaWRlcy5mb3JFYWNoKHNsaWRlRWwgPT4ge1xuICAgICAgICAgIHNsaWRlRWwuc3R5bGVbb2Zmc2V0UHJvcF0gPSBgJHtvZmZzZXQgLSBNYXRoLmFicyhzd2lwZXIuY3NzT3ZlcmZsb3dBZGp1c3RtZW50KCkpfXB4YDtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBzd2lwZXIudXBkYXRlUHJvZ3Jlc3MoKTtcbiAgICAgIGVtaXQoJ3ZpcnR1YWxVcGRhdGUnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHN3aXBlci5wYXJhbXMudmlydHVhbC5yZW5kZXJFeHRlcm5hbCkge1xuICAgICAgc3dpcGVyLnBhcmFtcy52aXJ0dWFsLnJlbmRlckV4dGVybmFsLmNhbGwoc3dpcGVyLCB7XG4gICAgICAgIG9mZnNldCxcbiAgICAgICAgZnJvbSxcbiAgICAgICAgdG8sXG4gICAgICAgIHNsaWRlczogZnVuY3Rpb24gZ2V0U2xpZGVzKCkge1xuICAgICAgICAgIGNvbnN0IHNsaWRlc1RvUmVuZGVyID0gW107XG4gICAgICAgICAgZm9yIChsZXQgaSA9IGZyb207IGkgPD0gdG87IGkgKz0gMSkge1xuICAgICAgICAgICAgc2xpZGVzVG9SZW5kZXIucHVzaChzbGlkZXNbaV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gc2xpZGVzVG9SZW5kZXI7XG4gICAgICAgIH0oKVxuICAgICAgfSk7XG4gICAgICBpZiAoc3dpcGVyLnBhcmFtcy52aXJ0dWFsLnJlbmRlckV4dGVybmFsVXBkYXRlKSB7XG4gICAgICAgIG9uUmVuZGVyZWQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVtaXQoJ3ZpcnR1YWxVcGRhdGUnKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgcHJlcGVuZEluZGV4ZXMgPSBbXTtcbiAgICBjb25zdCBhcHBlbmRJbmRleGVzID0gW107XG4gICAgY29uc3QgZ2V0U2xpZGVJbmRleCA9IGluZGV4ID0+IHtcbiAgICAgIGxldCBzbGlkZUluZGV4ID0gaW5kZXg7XG4gICAgICBpZiAoaW5kZXggPCAwKSB7XG4gICAgICAgIHNsaWRlSW5kZXggPSBzbGlkZXMubGVuZ3RoICsgaW5kZXg7XG4gICAgICB9IGVsc2UgaWYgKHNsaWRlSW5kZXggPj0gc2xpZGVzLmxlbmd0aCkge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICAgICAgc2xpZGVJbmRleCA9IHNsaWRlSW5kZXggLSBzbGlkZXMubGVuZ3RoO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNsaWRlSW5kZXg7XG4gICAgfTtcbiAgICBpZiAoZm9yY2UpIHtcbiAgICAgIHN3aXBlci5zbGlkZXMuZmlsdGVyKGVsID0+IGVsLm1hdGNoZXMoYC4ke3N3aXBlci5wYXJhbXMuc2xpZGVDbGFzc30sIHN3aXBlci1zbGlkZWApKS5mb3JFYWNoKHNsaWRlRWwgPT4ge1xuICAgICAgICBzbGlkZUVsLnJlbW92ZSgpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGkgPSBwcmV2aW91c0Zyb207IGkgPD0gcHJldmlvdXNUbzsgaSArPSAxKSB7XG4gICAgICAgIGlmIChpIDwgZnJvbSB8fCBpID4gdG8pIHtcbiAgICAgICAgICBjb25zdCBzbGlkZUluZGV4ID0gZ2V0U2xpZGVJbmRleChpKTtcbiAgICAgICAgICBzd2lwZXIuc2xpZGVzLmZpbHRlcihlbCA9PiBlbC5tYXRjaGVzKGAuJHtzd2lwZXIucGFyYW1zLnNsaWRlQ2xhc3N9W2RhdGEtc3dpcGVyLXNsaWRlLWluZGV4PVwiJHtzbGlkZUluZGV4fVwiXSwgc3dpcGVyLXNsaWRlW2RhdGEtc3dpcGVyLXNsaWRlLWluZGV4PVwiJHtzbGlkZUluZGV4fVwiXWApKS5mb3JFYWNoKHNsaWRlRWwgPT4ge1xuICAgICAgICAgICAgc2xpZGVFbC5yZW1vdmUoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBsb29wRnJvbSA9IGlzTG9vcCA/IC1zbGlkZXMubGVuZ3RoIDogMDtcbiAgICBjb25zdCBsb29wVG8gPSBpc0xvb3AgPyBzbGlkZXMubGVuZ3RoICogMiA6IHNsaWRlcy5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IGxvb3BGcm9tOyBpIDwgbG9vcFRvOyBpICs9IDEpIHtcbiAgICAgIGlmIChpID49IGZyb20gJiYgaSA8PSB0bykge1xuICAgICAgICBjb25zdCBzbGlkZUluZGV4ID0gZ2V0U2xpZGVJbmRleChpKTtcbiAgICAgICAgaWYgKHR5cGVvZiBwcmV2aW91c1RvID09PSAndW5kZWZpbmVkJyB8fCBmb3JjZSkge1xuICAgICAgICAgIGFwcGVuZEluZGV4ZXMucHVzaChzbGlkZUluZGV4KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoaSA+IHByZXZpb3VzVG8pIGFwcGVuZEluZGV4ZXMucHVzaChzbGlkZUluZGV4KTtcbiAgICAgICAgICBpZiAoaSA8IHByZXZpb3VzRnJvbSkgcHJlcGVuZEluZGV4ZXMucHVzaChzbGlkZUluZGV4KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBhcHBlbmRJbmRleGVzLmZvckVhY2goaW5kZXggPT4ge1xuICAgICAgc3dpcGVyLnNsaWRlc0VsLmFwcGVuZChyZW5kZXJTbGlkZShzbGlkZXNbaW5kZXhdLCBpbmRleCkpO1xuICAgIH0pO1xuICAgIGlmIChpc0xvb3ApIHtcbiAgICAgIGZvciAobGV0IGkgPSBwcmVwZW5kSW5kZXhlcy5sZW5ndGggLSAxOyBpID49IDA7IGkgLT0gMSkge1xuICAgICAgICBjb25zdCBpbmRleCA9IHByZXBlbmRJbmRleGVzW2ldO1xuICAgICAgICBzd2lwZXIuc2xpZGVzRWwucHJlcGVuZChyZW5kZXJTbGlkZShzbGlkZXNbaW5kZXhdLCBpbmRleCkpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBwcmVwZW5kSW5kZXhlcy5zb3J0KChhLCBiKSA9PiBiIC0gYSk7XG4gICAgICBwcmVwZW5kSW5kZXhlcy5mb3JFYWNoKGluZGV4ID0+IHtcbiAgICAgICAgc3dpcGVyLnNsaWRlc0VsLnByZXBlbmQocmVuZGVyU2xpZGUoc2xpZGVzW2luZGV4XSwgaW5kZXgpKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBlbGVtZW50Q2hpbGRyZW4oc3dpcGVyLnNsaWRlc0VsLCAnLnN3aXBlci1zbGlkZSwgc3dpcGVyLXNsaWRlJykuZm9yRWFjaChzbGlkZUVsID0+IHtcbiAgICAgIHNsaWRlRWwuc3R5bGVbb2Zmc2V0UHJvcF0gPSBgJHtvZmZzZXQgLSBNYXRoLmFicyhzd2lwZXIuY3NzT3ZlcmZsb3dBZGp1c3RtZW50KCkpfXB4YDtcbiAgICB9KTtcbiAgICBvblJlbmRlcmVkKCk7XG4gIH1cbiAgZnVuY3Rpb24gYXBwZW5kU2xpZGUoc2xpZGVzKSB7XG4gICAgaWYgKHR5cGVvZiBzbGlkZXMgPT09ICdvYmplY3QnICYmICdsZW5ndGgnIGluIHNsaWRlcykge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzbGlkZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgaWYgKHNsaWRlc1tpXSkgc3dpcGVyLnZpcnR1YWwuc2xpZGVzLnB1c2goc2xpZGVzW2ldKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3dpcGVyLnZpcnR1YWwuc2xpZGVzLnB1c2goc2xpZGVzKTtcbiAgICB9XG4gICAgdXBkYXRlKHRydWUpO1xuICB9XG4gIGZ1bmN0aW9uIHByZXBlbmRTbGlkZShzbGlkZXMpIHtcbiAgICBjb25zdCBhY3RpdmVJbmRleCA9IHN3aXBlci5hY3RpdmVJbmRleDtcbiAgICBsZXQgbmV3QWN0aXZlSW5kZXggPSBhY3RpdmVJbmRleCArIDE7XG4gICAgbGV0IG51bWJlck9mTmV3U2xpZGVzID0gMTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShzbGlkZXMpKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNsaWRlcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBpZiAoc2xpZGVzW2ldKSBzd2lwZXIudmlydHVhbC5zbGlkZXMudW5zaGlmdChzbGlkZXNbaV0pO1xuICAgICAgfVxuICAgICAgbmV3QWN0aXZlSW5kZXggPSBhY3RpdmVJbmRleCArIHNsaWRlcy5sZW5ndGg7XG4gICAgICBudW1iZXJPZk5ld1NsaWRlcyA9IHNsaWRlcy5sZW5ndGg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN3aXBlci52aXJ0dWFsLnNsaWRlcy51bnNoaWZ0KHNsaWRlcyk7XG4gICAgfVxuICAgIGlmIChzd2lwZXIucGFyYW1zLnZpcnR1YWwuY2FjaGUpIHtcbiAgICAgIGNvbnN0IGNhY2hlID0gc3dpcGVyLnZpcnR1YWwuY2FjaGU7XG4gICAgICBjb25zdCBuZXdDYWNoZSA9IHt9O1xuICAgICAgT2JqZWN0LmtleXMoY2FjaGUpLmZvckVhY2goY2FjaGVkSW5kZXggPT4ge1xuICAgICAgICBjb25zdCBjYWNoZWRFbCA9IGNhY2hlW2NhY2hlZEluZGV4XTtcbiAgICAgICAgY29uc3QgY2FjaGVkRWxJbmRleCA9IGNhY2hlZEVsLmdldEF0dHJpYnV0ZSgnZGF0YS1zd2lwZXItc2xpZGUtaW5kZXgnKTtcbiAgICAgICAgaWYgKGNhY2hlZEVsSW5kZXgpIHtcbiAgICAgICAgICBjYWNoZWRFbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtc3dpcGVyLXNsaWRlLWluZGV4JywgcGFyc2VJbnQoY2FjaGVkRWxJbmRleCwgMTApICsgbnVtYmVyT2ZOZXdTbGlkZXMpO1xuICAgICAgICB9XG4gICAgICAgIG5ld0NhY2hlW3BhcnNlSW50KGNhY2hlZEluZGV4LCAxMCkgKyBudW1iZXJPZk5ld1NsaWRlc10gPSBjYWNoZWRFbDtcbiAgICAgIH0pO1xuICAgICAgc3dpcGVyLnZpcnR1YWwuY2FjaGUgPSBuZXdDYWNoZTtcbiAgICB9XG4gICAgdXBkYXRlKHRydWUpO1xuICAgIHN3aXBlci5zbGlkZVRvKG5ld0FjdGl2ZUluZGV4LCAwKTtcbiAgfVxuICBmdW5jdGlvbiByZW1vdmVTbGlkZShzbGlkZXNJbmRleGVzKSB7XG4gICAgaWYgKHR5cGVvZiBzbGlkZXNJbmRleGVzID09PSAndW5kZWZpbmVkJyB8fCBzbGlkZXNJbmRleGVzID09PSBudWxsKSByZXR1cm47XG4gICAgbGV0IGFjdGl2ZUluZGV4ID0gc3dpcGVyLmFjdGl2ZUluZGV4O1xuICAgIGlmIChBcnJheS5pc0FycmF5KHNsaWRlc0luZGV4ZXMpKSB7XG4gICAgICBmb3IgKGxldCBpID0gc2xpZGVzSW5kZXhlcy5sZW5ndGggLSAxOyBpID49IDA7IGkgLT0gMSkge1xuICAgICAgICBpZiAoc3dpcGVyLnBhcmFtcy52aXJ0dWFsLmNhY2hlKSB7XG4gICAgICAgICAgZGVsZXRlIHN3aXBlci52aXJ0dWFsLmNhY2hlW3NsaWRlc0luZGV4ZXNbaV1dO1xuICAgICAgICAgIC8vIHNoaWZ0IGNhY2hlIGluZGV4ZXNcbiAgICAgICAgICBPYmplY3Qua2V5cyhzd2lwZXIudmlydHVhbC5jYWNoZSkuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgaWYgKGtleSA+IHNsaWRlc0luZGV4ZXMpIHtcbiAgICAgICAgICAgICAgc3dpcGVyLnZpcnR1YWwuY2FjaGVba2V5IC0gMV0gPSBzd2lwZXIudmlydHVhbC5jYWNoZVtrZXldO1xuICAgICAgICAgICAgICBzd2lwZXIudmlydHVhbC5jYWNoZVtrZXkgLSAxXS5zZXRBdHRyaWJ1dGUoJ2RhdGEtc3dpcGVyLXNsaWRlLWluZGV4Jywga2V5IC0gMSk7XG4gICAgICAgICAgICAgIGRlbGV0ZSBzd2lwZXIudmlydHVhbC5jYWNoZVtrZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHN3aXBlci52aXJ0dWFsLnNsaWRlcy5zcGxpY2Uoc2xpZGVzSW5kZXhlc1tpXSwgMSk7XG4gICAgICAgIGlmIChzbGlkZXNJbmRleGVzW2ldIDwgYWN0aXZlSW5kZXgpIGFjdGl2ZUluZGV4IC09IDE7XG4gICAgICAgIGFjdGl2ZUluZGV4ID0gTWF0aC5tYXgoYWN0aXZlSW5kZXgsIDApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoc3dpcGVyLnBhcmFtcy52aXJ0dWFsLmNhY2hlKSB7XG4gICAgICAgIGRlbGV0ZSBzd2lwZXIudmlydHVhbC5jYWNoZVtzbGlkZXNJbmRleGVzXTtcbiAgICAgICAgLy8gc2hpZnQgY2FjaGUgaW5kZXhlc1xuICAgICAgICBPYmplY3Qua2V5cyhzd2lwZXIudmlydHVhbC5jYWNoZSkuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgIGlmIChrZXkgPiBzbGlkZXNJbmRleGVzKSB7XG4gICAgICAgICAgICBzd2lwZXIudmlydHVhbC5jYWNoZVtrZXkgLSAxXSA9IHN3aXBlci52aXJ0dWFsLmNhY2hlW2tleV07XG4gICAgICAgICAgICBzd2lwZXIudmlydHVhbC5jYWNoZVtrZXkgLSAxXS5zZXRBdHRyaWJ1dGUoJ2RhdGEtc3dpcGVyLXNsaWRlLWluZGV4Jywga2V5IC0gMSk7XG4gICAgICAgICAgICBkZWxldGUgc3dpcGVyLnZpcnR1YWwuY2FjaGVba2V5XTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgc3dpcGVyLnZpcnR1YWwuc2xpZGVzLnNwbGljZShzbGlkZXNJbmRleGVzLCAxKTtcbiAgICAgIGlmIChzbGlkZXNJbmRleGVzIDwgYWN0aXZlSW5kZXgpIGFjdGl2ZUluZGV4IC09IDE7XG4gICAgICBhY3RpdmVJbmRleCA9IE1hdGgubWF4KGFjdGl2ZUluZGV4LCAwKTtcbiAgICB9XG4gICAgdXBkYXRlKHRydWUpO1xuICAgIHN3aXBlci5zbGlkZVRvKGFjdGl2ZUluZGV4LCAwKTtcbiAgfVxuICBmdW5jdGlvbiByZW1vdmVBbGxTbGlkZXMoKSB7XG4gICAgc3dpcGVyLnZpcnR1YWwuc2xpZGVzID0gW107XG4gICAgaWYgKHN3aXBlci5wYXJhbXMudmlydHVhbC5jYWNoZSkge1xuICAgICAgc3dpcGVyLnZpcnR1YWwuY2FjaGUgPSB7fTtcbiAgICB9XG4gICAgdXBkYXRlKHRydWUpO1xuICAgIHN3aXBlci5zbGlkZVRvKDAsIDApO1xuICB9XG4gIG9uKCdiZWZvcmVJbml0JywgKCkgPT4ge1xuICAgIGlmICghc3dpcGVyLnBhcmFtcy52aXJ0dWFsLmVuYWJsZWQpIHJldHVybjtcbiAgICBsZXQgZG9tU2xpZGVzQXNzaWduZWQ7XG4gICAgaWYgKHR5cGVvZiBzd2lwZXIucGFzc2VkUGFyYW1zLnZpcnR1YWwuc2xpZGVzID09PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc3Qgc2xpZGVzID0gWy4uLnN3aXBlci5zbGlkZXNFbC5jaGlsZHJlbl0uZmlsdGVyKGVsID0+IGVsLm1hdGNoZXMoYC4ke3N3aXBlci5wYXJhbXMuc2xpZGVDbGFzc30sIHN3aXBlci1zbGlkZWApKTtcbiAgICAgIGlmIChzbGlkZXMgJiYgc2xpZGVzLmxlbmd0aCkge1xuICAgICAgICBzd2lwZXIudmlydHVhbC5zbGlkZXMgPSBbLi4uc2xpZGVzXTtcbiAgICAgICAgZG9tU2xpZGVzQXNzaWduZWQgPSB0cnVlO1xuICAgICAgICBzbGlkZXMuZm9yRWFjaCgoc2xpZGVFbCwgc2xpZGVJbmRleCkgPT4ge1xuICAgICAgICAgIHNsaWRlRWwuc2V0QXR0cmlidXRlKCdkYXRhLXN3aXBlci1zbGlkZS1pbmRleCcsIHNsaWRlSW5kZXgpO1xuICAgICAgICAgIHN3aXBlci52aXJ0dWFsLmNhY2hlW3NsaWRlSW5kZXhdID0gc2xpZGVFbDtcbiAgICAgICAgICBzbGlkZUVsLnJlbW92ZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFkb21TbGlkZXNBc3NpZ25lZCkge1xuICAgICAgc3dpcGVyLnZpcnR1YWwuc2xpZGVzID0gc3dpcGVyLnBhcmFtcy52aXJ0dWFsLnNsaWRlcztcbiAgICB9XG4gICAgc3dpcGVyLmNsYXNzTmFtZXMucHVzaChgJHtzd2lwZXIucGFyYW1zLmNvbnRhaW5lck1vZGlmaWVyQ2xhc3N9dmlydHVhbGApO1xuICAgIHN3aXBlci5wYXJhbXMud2F0Y2hTbGlkZXNQcm9ncmVzcyA9IHRydWU7XG4gICAgc3dpcGVyLm9yaWdpbmFsUGFyYW1zLndhdGNoU2xpZGVzUHJvZ3Jlc3MgPSB0cnVlO1xuICAgIHVwZGF0ZSgpO1xuICB9KTtcbiAgb24oJ3NldFRyYW5zbGF0ZScsICgpID0+IHtcbiAgICBpZiAoIXN3aXBlci5wYXJhbXMudmlydHVhbC5lbmFibGVkKSByZXR1cm47XG4gICAgaWYgKHN3aXBlci5wYXJhbXMuY3NzTW9kZSAmJiAhc3dpcGVyLl9pbW1lZGlhdGVWaXJ0dWFsKSB7XG4gICAgICBjbGVhclRpbWVvdXQoY3NzTW9kZVRpbWVvdXQpO1xuICAgICAgY3NzTW9kZVRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdXBkYXRlKCk7XG4gICAgICB9LCAxMDApO1xuICAgIH0gZWxzZSB7XG4gICAgICB1cGRhdGUoKTtcbiAgICB9XG4gIH0pO1xuICBvbignaW5pdCB1cGRhdGUgcmVzaXplJywgKCkgPT4ge1xuICAgIGlmICghc3dpcGVyLnBhcmFtcy52aXJ0dWFsLmVuYWJsZWQpIHJldHVybjtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5jc3NNb2RlKSB7XG4gICAgICBzZXRDU1NQcm9wZXJ0eShzd2lwZXIud3JhcHBlckVsLCAnLS1zd2lwZXItdmlydHVhbC1zaXplJywgYCR7c3dpcGVyLnZpcnR1YWxTaXplfXB4YCk7XG4gICAgfVxuICB9KTtcbiAgT2JqZWN0LmFzc2lnbihzd2lwZXIudmlydHVhbCwge1xuICAgIGFwcGVuZFNsaWRlLFxuICAgIHByZXBlbmRTbGlkZSxcbiAgICByZW1vdmVTbGlkZSxcbiAgICByZW1vdmVBbGxTbGlkZXMsXG4gICAgdXBkYXRlXG4gIH0pO1xufVxuXG5leHBvcnQgeyBWaXJ0dWFsIGFzIGRlZmF1bHQgfTtcbiIsImltcG9ydCB7IGcgYXMgZ2V0RG9jdW1lbnQsIGEgYXMgZ2V0V2luZG93IH0gZnJvbSAnLi4vc2hhcmVkL3Nzci13aW5kb3cuZXNtLm1qcyc7XG5pbXBvcnQgeyBhIGFzIGVsZW1lbnRQYXJlbnRzLCBiIGFzIGVsZW1lbnRPZmZzZXQgfSBmcm9tICcuLi9zaGFyZWQvdXRpbHMubWpzJztcblxuLyogZXNsaW50LWRpc2FibGUgY29uc2lzdGVudC1yZXR1cm4gKi9cbmZ1bmN0aW9uIEtleWJvYXJkKF9yZWYpIHtcbiAgbGV0IHtcbiAgICBzd2lwZXIsXG4gICAgZXh0ZW5kUGFyYW1zLFxuICAgIG9uLFxuICAgIGVtaXRcbiAgfSA9IF9yZWY7XG4gIGNvbnN0IGRvY3VtZW50ID0gZ2V0RG9jdW1lbnQoKTtcbiAgY29uc3Qgd2luZG93ID0gZ2V0V2luZG93KCk7XG4gIHN3aXBlci5rZXlib2FyZCA9IHtcbiAgICBlbmFibGVkOiBmYWxzZVxuICB9O1xuICBleHRlbmRQYXJhbXMoe1xuICAgIGtleWJvYXJkOiB7XG4gICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgIG9ubHlJblZpZXdwb3J0OiB0cnVlLFxuICAgICAgcGFnZVVwRG93bjogdHJ1ZVxuICAgIH1cbiAgfSk7XG4gIGZ1bmN0aW9uIGhhbmRsZShldmVudCkge1xuICAgIGlmICghc3dpcGVyLmVuYWJsZWQpIHJldHVybjtcbiAgICBjb25zdCB7XG4gICAgICBydGxUcmFuc2xhdGU6IHJ0bFxuICAgIH0gPSBzd2lwZXI7XG4gICAgbGV0IGUgPSBldmVudDtcbiAgICBpZiAoZS5vcmlnaW5hbEV2ZW50KSBlID0gZS5vcmlnaW5hbEV2ZW50OyAvLyBqcXVlcnkgZml4XG4gICAgY29uc3Qga2MgPSBlLmtleUNvZGUgfHwgZS5jaGFyQ29kZTtcbiAgICBjb25zdCBwYWdlVXBEb3duID0gc3dpcGVyLnBhcmFtcy5rZXlib2FyZC5wYWdlVXBEb3duO1xuICAgIGNvbnN0IGlzUGFnZVVwID0gcGFnZVVwRG93biAmJiBrYyA9PT0gMzM7XG4gICAgY29uc3QgaXNQYWdlRG93biA9IHBhZ2VVcERvd24gJiYga2MgPT09IDM0O1xuICAgIGNvbnN0IGlzQXJyb3dMZWZ0ID0ga2MgPT09IDM3O1xuICAgIGNvbnN0IGlzQXJyb3dSaWdodCA9IGtjID09PSAzOTtcbiAgICBjb25zdCBpc0Fycm93VXAgPSBrYyA9PT0gMzg7XG4gICAgY29uc3QgaXNBcnJvd0Rvd24gPSBrYyA9PT0gNDA7XG4gICAgLy8gRGlyZWN0aW9ucyBsb2Nrc1xuICAgIGlmICghc3dpcGVyLmFsbG93U2xpZGVOZXh0ICYmIChzd2lwZXIuaXNIb3Jpem9udGFsKCkgJiYgaXNBcnJvd1JpZ2h0IHx8IHN3aXBlci5pc1ZlcnRpY2FsKCkgJiYgaXNBcnJvd0Rvd24gfHwgaXNQYWdlRG93bikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKCFzd2lwZXIuYWxsb3dTbGlkZVByZXYgJiYgKHN3aXBlci5pc0hvcml6b250YWwoKSAmJiBpc0Fycm93TGVmdCB8fCBzd2lwZXIuaXNWZXJ0aWNhbCgpICYmIGlzQXJyb3dVcCB8fCBpc1BhZ2VVcCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKGUuc2hpZnRLZXkgfHwgZS5hbHRLZXkgfHwgZS5jdHJsS2V5IHx8IGUubWV0YUtleSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5ub2RlTmFtZSAmJiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnaW5wdXQnIHx8IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3RleHRhcmVhJykpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGlmIChzd2lwZXIucGFyYW1zLmtleWJvYXJkLm9ubHlJblZpZXdwb3J0ICYmIChpc1BhZ2VVcCB8fCBpc1BhZ2VEb3duIHx8IGlzQXJyb3dMZWZ0IHx8IGlzQXJyb3dSaWdodCB8fCBpc0Fycm93VXAgfHwgaXNBcnJvd0Rvd24pKSB7XG4gICAgICBsZXQgaW5WaWV3ID0gZmFsc2U7XG4gICAgICAvLyBDaGVjayB0aGF0IHN3aXBlciBzaG91bGQgYmUgaW5zaWRlIG9mIHZpc2libGUgYXJlYSBvZiB3aW5kb3dcbiAgICAgIGlmIChlbGVtZW50UGFyZW50cyhzd2lwZXIuZWwsIGAuJHtzd2lwZXIucGFyYW1zLnNsaWRlQ2xhc3N9LCBzd2lwZXItc2xpZGVgKS5sZW5ndGggPiAwICYmIGVsZW1lbnRQYXJlbnRzKHN3aXBlci5lbCwgYC4ke3N3aXBlci5wYXJhbXMuc2xpZGVBY3RpdmVDbGFzc31gKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGVsID0gc3dpcGVyLmVsO1xuICAgICAgY29uc3Qgc3dpcGVyV2lkdGggPSBlbC5jbGllbnRXaWR0aDtcbiAgICAgIGNvbnN0IHN3aXBlckhlaWdodCA9IGVsLmNsaWVudEhlaWdodDtcbiAgICAgIGNvbnN0IHdpbmRvd1dpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICBjb25zdCB3aW5kb3dIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICBjb25zdCBzd2lwZXJPZmZzZXQgPSBlbGVtZW50T2Zmc2V0KGVsKTtcbiAgICAgIGlmIChydGwpIHN3aXBlck9mZnNldC5sZWZ0IC09IGVsLnNjcm9sbExlZnQ7XG4gICAgICBjb25zdCBzd2lwZXJDb29yZCA9IFtbc3dpcGVyT2Zmc2V0LmxlZnQsIHN3aXBlck9mZnNldC50b3BdLCBbc3dpcGVyT2Zmc2V0LmxlZnQgKyBzd2lwZXJXaWR0aCwgc3dpcGVyT2Zmc2V0LnRvcF0sIFtzd2lwZXJPZmZzZXQubGVmdCwgc3dpcGVyT2Zmc2V0LnRvcCArIHN3aXBlckhlaWdodF0sIFtzd2lwZXJPZmZzZXQubGVmdCArIHN3aXBlcldpZHRoLCBzd2lwZXJPZmZzZXQudG9wICsgc3dpcGVySGVpZ2h0XV07XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN3aXBlckNvb3JkLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNvbnN0IHBvaW50ID0gc3dpcGVyQ29vcmRbaV07XG4gICAgICAgIGlmIChwb2ludFswXSA+PSAwICYmIHBvaW50WzBdIDw9IHdpbmRvd1dpZHRoICYmIHBvaW50WzFdID49IDAgJiYgcG9pbnRbMV0gPD0gd2luZG93SGVpZ2h0KSB7XG4gICAgICAgICAgaWYgKHBvaW50WzBdID09PSAwICYmIHBvaW50WzFdID09PSAwKSBjb250aW51ZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgICAgICAgIGluVmlldyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICghaW5WaWV3KSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBpZiAoc3dpcGVyLmlzSG9yaXpvbnRhbCgpKSB7XG4gICAgICBpZiAoaXNQYWdlVXAgfHwgaXNQYWdlRG93biB8fCBpc0Fycm93TGVmdCB8fCBpc0Fycm93UmlnaHQpIHtcbiAgICAgICAgaWYgKGUucHJldmVudERlZmF1bHQpIGUucHJldmVudERlZmF1bHQoKTtlbHNlIGUucmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmICgoaXNQYWdlRG93biB8fCBpc0Fycm93UmlnaHQpICYmICFydGwgfHwgKGlzUGFnZVVwIHx8IGlzQXJyb3dMZWZ0KSAmJiBydGwpIHN3aXBlci5zbGlkZU5leHQoKTtcbiAgICAgIGlmICgoaXNQYWdlVXAgfHwgaXNBcnJvd0xlZnQpICYmICFydGwgfHwgKGlzUGFnZURvd24gfHwgaXNBcnJvd1JpZ2h0KSAmJiBydGwpIHN3aXBlci5zbGlkZVByZXYoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGlzUGFnZVVwIHx8IGlzUGFnZURvd24gfHwgaXNBcnJvd1VwIHx8IGlzQXJyb3dEb3duKSB7XG4gICAgICAgIGlmIChlLnByZXZlbnREZWZhdWx0KSBlLnByZXZlbnREZWZhdWx0KCk7ZWxzZSBlLnJldHVyblZhbHVlID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoaXNQYWdlRG93biB8fCBpc0Fycm93RG93bikgc3dpcGVyLnNsaWRlTmV4dCgpO1xuICAgICAgaWYgKGlzUGFnZVVwIHx8IGlzQXJyb3dVcCkgc3dpcGVyLnNsaWRlUHJldigpO1xuICAgIH1cbiAgICBlbWl0KCdrZXlQcmVzcycsIGtjKTtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIGZ1bmN0aW9uIGVuYWJsZSgpIHtcbiAgICBpZiAoc3dpcGVyLmtleWJvYXJkLmVuYWJsZWQpIHJldHVybjtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlKTtcbiAgICBzd2lwZXIua2V5Ym9hcmQuZW5hYmxlZCA9IHRydWU7XG4gIH1cbiAgZnVuY3Rpb24gZGlzYWJsZSgpIHtcbiAgICBpZiAoIXN3aXBlci5rZXlib2FyZC5lbmFibGVkKSByZXR1cm47XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZSk7XG4gICAgc3dpcGVyLmtleWJvYXJkLmVuYWJsZWQgPSBmYWxzZTtcbiAgfVxuICBvbignaW5pdCcsICgpID0+IHtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5rZXlib2FyZC5lbmFibGVkKSB7XG4gICAgICBlbmFibGUoKTtcbiAgICB9XG4gIH0pO1xuICBvbignZGVzdHJveScsICgpID0+IHtcbiAgICBpZiAoc3dpcGVyLmtleWJvYXJkLmVuYWJsZWQpIHtcbiAgICAgIGRpc2FibGUoKTtcbiAgICB9XG4gIH0pO1xuICBPYmplY3QuYXNzaWduKHN3aXBlci5rZXlib2FyZCwge1xuICAgIGVuYWJsZSxcbiAgICBkaXNhYmxlXG4gIH0pO1xufVxuXG5leHBvcnQgeyBLZXlib2FyZCBhcyBkZWZhdWx0IH07XG4iLCJpbXBvcnQgeyBhIGFzIGdldFdpbmRvdyB9IGZyb20gJy4uL3NoYXJlZC9zc3Itd2luZG93LmVzbS5tanMnO1xuaW1wb3J0IHsgbiBhcyBuZXh0VGljaywgZCBhcyBub3cgfSBmcm9tICcuLi9zaGFyZWQvdXRpbHMubWpzJztcblxuLyogZXNsaW50LWRpc2FibGUgY29uc2lzdGVudC1yZXR1cm4gKi9cbmZ1bmN0aW9uIE1vdXNld2hlZWwoX3JlZikge1xuICBsZXQge1xuICAgIHN3aXBlcixcbiAgICBleHRlbmRQYXJhbXMsXG4gICAgb24sXG4gICAgZW1pdFxuICB9ID0gX3JlZjtcbiAgY29uc3Qgd2luZG93ID0gZ2V0V2luZG93KCk7XG4gIGV4dGVuZFBhcmFtcyh7XG4gICAgbW91c2V3aGVlbDoge1xuICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICByZWxlYXNlT25FZGdlczogZmFsc2UsXG4gICAgICBpbnZlcnQ6IGZhbHNlLFxuICAgICAgZm9yY2VUb0F4aXM6IGZhbHNlLFxuICAgICAgc2Vuc2l0aXZpdHk6IDEsXG4gICAgICBldmVudHNUYXJnZXQ6ICdjb250YWluZXInLFxuICAgICAgdGhyZXNob2xkRGVsdGE6IG51bGwsXG4gICAgICB0aHJlc2hvbGRUaW1lOiBudWxsLFxuICAgICAgbm9Nb3VzZXdoZWVsQ2xhc3M6ICdzd2lwZXItbm8tbW91c2V3aGVlbCdcbiAgICB9XG4gIH0pO1xuICBzd2lwZXIubW91c2V3aGVlbCA9IHtcbiAgICBlbmFibGVkOiBmYWxzZVxuICB9O1xuICBsZXQgdGltZW91dDtcbiAgbGV0IGxhc3RTY3JvbGxUaW1lID0gbm93KCk7XG4gIGxldCBsYXN0RXZlbnRCZWZvcmVTbmFwO1xuICBjb25zdCByZWNlbnRXaGVlbEV2ZW50cyA9IFtdO1xuICBmdW5jdGlvbiBub3JtYWxpemUoZSkge1xuICAgIC8vIFJlYXNvbmFibGUgZGVmYXVsdHNcbiAgICBjb25zdCBQSVhFTF9TVEVQID0gMTA7XG4gICAgY29uc3QgTElORV9IRUlHSFQgPSA0MDtcbiAgICBjb25zdCBQQUdFX0hFSUdIVCA9IDgwMDtcbiAgICBsZXQgc1ggPSAwO1xuICAgIGxldCBzWSA9IDA7IC8vIHNwaW5YLCBzcGluWVxuICAgIGxldCBwWCA9IDA7XG4gICAgbGV0IHBZID0gMDsgLy8gcGl4ZWxYLCBwaXhlbFlcblxuICAgIC8vIExlZ2FjeVxuICAgIGlmICgnZGV0YWlsJyBpbiBlKSB7XG4gICAgICBzWSA9IGUuZGV0YWlsO1xuICAgIH1cbiAgICBpZiAoJ3doZWVsRGVsdGEnIGluIGUpIHtcbiAgICAgIHNZID0gLWUud2hlZWxEZWx0YSAvIDEyMDtcbiAgICB9XG4gICAgaWYgKCd3aGVlbERlbHRhWScgaW4gZSkge1xuICAgICAgc1kgPSAtZS53aGVlbERlbHRhWSAvIDEyMDtcbiAgICB9XG4gICAgaWYgKCd3aGVlbERlbHRhWCcgaW4gZSkge1xuICAgICAgc1ggPSAtZS53aGVlbERlbHRhWCAvIDEyMDtcbiAgICB9XG5cbiAgICAvLyBzaWRlIHNjcm9sbGluZyBvbiBGRiB3aXRoIERPTU1vdXNlU2Nyb2xsXG4gICAgaWYgKCdheGlzJyBpbiBlICYmIGUuYXhpcyA9PT0gZS5IT1JJWk9OVEFMX0FYSVMpIHtcbiAgICAgIHNYID0gc1k7XG4gICAgICBzWSA9IDA7XG4gICAgfVxuICAgIHBYID0gc1ggKiBQSVhFTF9TVEVQO1xuICAgIHBZID0gc1kgKiBQSVhFTF9TVEVQO1xuICAgIGlmICgnZGVsdGFZJyBpbiBlKSB7XG4gICAgICBwWSA9IGUuZGVsdGFZO1xuICAgIH1cbiAgICBpZiAoJ2RlbHRhWCcgaW4gZSkge1xuICAgICAgcFggPSBlLmRlbHRhWDtcbiAgICB9XG4gICAgaWYgKGUuc2hpZnRLZXkgJiYgIXBYKSB7XG4gICAgICAvLyBpZiB1c2VyIHNjcm9sbHMgd2l0aCBzaGlmdCBoZSB3YW50cyBob3Jpem9udGFsIHNjcm9sbFxuICAgICAgcFggPSBwWTtcbiAgICAgIHBZID0gMDtcbiAgICB9XG4gICAgaWYgKChwWCB8fCBwWSkgJiYgZS5kZWx0YU1vZGUpIHtcbiAgICAgIGlmIChlLmRlbHRhTW9kZSA9PT0gMSkge1xuICAgICAgICAvLyBkZWx0YSBpbiBMSU5FIHVuaXRzXG4gICAgICAgIHBYICo9IExJTkVfSEVJR0hUO1xuICAgICAgICBwWSAqPSBMSU5FX0hFSUdIVDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGRlbHRhIGluIFBBR0UgdW5pdHNcbiAgICAgICAgcFggKj0gUEFHRV9IRUlHSFQ7XG4gICAgICAgIHBZICo9IFBBR0VfSEVJR0hUO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEZhbGwtYmFjayBpZiBzcGluIGNhbm5vdCBiZSBkZXRlcm1pbmVkXG4gICAgaWYgKHBYICYmICFzWCkge1xuICAgICAgc1ggPSBwWCA8IDEgPyAtMSA6IDE7XG4gICAgfVxuICAgIGlmIChwWSAmJiAhc1kpIHtcbiAgICAgIHNZID0gcFkgPCAxID8gLTEgOiAxO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgc3Bpblg6IHNYLFxuICAgICAgc3Bpblk6IHNZLFxuICAgICAgcGl4ZWxYOiBwWCxcbiAgICAgIHBpeGVsWTogcFlcbiAgICB9O1xuICB9XG4gIGZ1bmN0aW9uIGhhbmRsZU1vdXNlRW50ZXIoKSB7XG4gICAgaWYgKCFzd2lwZXIuZW5hYmxlZCkgcmV0dXJuO1xuICAgIHN3aXBlci5tb3VzZUVudGVyZWQgPSB0cnVlO1xuICB9XG4gIGZ1bmN0aW9uIGhhbmRsZU1vdXNlTGVhdmUoKSB7XG4gICAgaWYgKCFzd2lwZXIuZW5hYmxlZCkgcmV0dXJuO1xuICAgIHN3aXBlci5tb3VzZUVudGVyZWQgPSBmYWxzZTtcbiAgfVxuICBmdW5jdGlvbiBhbmltYXRlU2xpZGVyKG5ld0V2ZW50KSB7XG4gICAgaWYgKHN3aXBlci5wYXJhbXMubW91c2V3aGVlbC50aHJlc2hvbGREZWx0YSAmJiBuZXdFdmVudC5kZWx0YSA8IHN3aXBlci5wYXJhbXMubW91c2V3aGVlbC50aHJlc2hvbGREZWx0YSkge1xuICAgICAgLy8gUHJldmVudCBpZiBkZWx0YSBvZiB3aGVlbCBzY3JvbGwgZGVsdGEgaXMgYmVsb3cgY29uZmlndXJlZCB0aHJlc2hvbGRcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHN3aXBlci5wYXJhbXMubW91c2V3aGVlbC50aHJlc2hvbGRUaW1lICYmIG5vdygpIC0gbGFzdFNjcm9sbFRpbWUgPCBzd2lwZXIucGFyYW1zLm1vdXNld2hlZWwudGhyZXNob2xkVGltZSkge1xuICAgICAgLy8gUHJldmVudCBpZiB0aW1lIGJldHdlZW4gc2Nyb2xscyBpcyBiZWxvdyBjb25maWd1cmVkIHRocmVzaG9sZFxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIElmIHRoZSBtb3ZlbWVudCBpcyBOT1QgYmlnIGVub3VnaCBhbmRcbiAgICAvLyBpZiB0aGUgbGFzdCB0aW1lIHRoZSB1c2VyIHNjcm9sbGVkIHdhcyB0b28gY2xvc2UgdG8gdGhlIGN1cnJlbnQgb25lIChhdm9pZCBjb250aW51b3VzbHkgdHJpZ2dlcmluZyB0aGUgc2xpZGVyKTpcbiAgICAvLyAgIERvbid0IGdvIGFueSBmdXJ0aGVyIChhdm9pZCBpbnNpZ25pZmljYW50IHNjcm9sbCBtb3ZlbWVudCkuXG4gICAgaWYgKG5ld0V2ZW50LmRlbHRhID49IDYgJiYgbm93KCkgLSBsYXN0U2Nyb2xsVGltZSA8IDYwKSB7XG4gICAgICAvLyBSZXR1cm4gZmFsc2UgYXMgYSBkZWZhdWx0XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgLy8gSWYgdXNlciBpcyBzY3JvbGxpbmcgdG93YXJkcyB0aGUgZW5kOlxuICAgIC8vICAgSWYgdGhlIHNsaWRlciBoYXNuJ3QgaGl0IHRoZSBsYXRlc3Qgc2xpZGUgb3JcbiAgICAvLyAgIGlmIHRoZSBzbGlkZXIgaXMgYSBsb29wIGFuZFxuICAgIC8vICAgaWYgdGhlIHNsaWRlciBpc24ndCBtb3ZpbmcgcmlnaHQgbm93OlxuICAgIC8vICAgICBHbyB0byBuZXh0IHNsaWRlIGFuZFxuICAgIC8vICAgICBlbWl0IGEgc2Nyb2xsIGV2ZW50LlxuICAgIC8vIEVsc2UgKHRoZSB1c2VyIGlzIHNjcm9sbGluZyB0b3dhcmRzIHRoZSBiZWdpbm5pbmcpIGFuZFxuICAgIC8vIGlmIHRoZSBzbGlkZXIgaGFzbid0IGhpdCB0aGUgZmlyc3Qgc2xpZGUgb3JcbiAgICAvLyBpZiB0aGUgc2xpZGVyIGlzIGEgbG9vcCBhbmRcbiAgICAvLyBpZiB0aGUgc2xpZGVyIGlzbid0IG1vdmluZyByaWdodCBub3c6XG4gICAgLy8gICBHbyB0byBwcmV2IHNsaWRlIGFuZFxuICAgIC8vICAgZW1pdCBhIHNjcm9sbCBldmVudC5cbiAgICBpZiAobmV3RXZlbnQuZGlyZWN0aW9uIDwgMCkge1xuICAgICAgaWYgKCghc3dpcGVyLmlzRW5kIHx8IHN3aXBlci5wYXJhbXMubG9vcCkgJiYgIXN3aXBlci5hbmltYXRpbmcpIHtcbiAgICAgICAgc3dpcGVyLnNsaWRlTmV4dCgpO1xuICAgICAgICBlbWl0KCdzY3JvbGwnLCBuZXdFdmVudC5yYXcpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoKCFzd2lwZXIuaXNCZWdpbm5pbmcgfHwgc3dpcGVyLnBhcmFtcy5sb29wKSAmJiAhc3dpcGVyLmFuaW1hdGluZykge1xuICAgICAgc3dpcGVyLnNsaWRlUHJldigpO1xuICAgICAgZW1pdCgnc2Nyb2xsJywgbmV3RXZlbnQucmF3KTtcbiAgICB9XG4gICAgLy8gSWYgeW91IGdvdCBoZXJlIGlzIGJlY2F1c2UgYW4gYW5pbWF0aW9uIGhhcyBiZWVuIHRyaWdnZXJlZCBzbyBzdG9yZSB0aGUgY3VycmVudCB0aW1lXG4gICAgbGFzdFNjcm9sbFRpbWUgPSBuZXcgd2luZG93LkRhdGUoKS5nZXRUaW1lKCk7XG4gICAgLy8gUmV0dXJuIGZhbHNlIGFzIGEgZGVmYXVsdFxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBmdW5jdGlvbiByZWxlYXNlU2Nyb2xsKG5ld0V2ZW50KSB7XG4gICAgY29uc3QgcGFyYW1zID0gc3dpcGVyLnBhcmFtcy5tb3VzZXdoZWVsO1xuICAgIGlmIChuZXdFdmVudC5kaXJlY3Rpb24gPCAwKSB7XG4gICAgICBpZiAoc3dpcGVyLmlzRW5kICYmICFzd2lwZXIucGFyYW1zLmxvb3AgJiYgcGFyYW1zLnJlbGVhc2VPbkVkZ2VzKSB7XG4gICAgICAgIC8vIFJldHVybiB0cnVlIHRvIGFuaW1hdGUgc2Nyb2xsIG9uIGVkZ2VzXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoc3dpcGVyLmlzQmVnaW5uaW5nICYmICFzd2lwZXIucGFyYW1zLmxvb3AgJiYgcGFyYW1zLnJlbGVhc2VPbkVkZ2VzKSB7XG4gICAgICAvLyBSZXR1cm4gdHJ1ZSB0byBhbmltYXRlIHNjcm9sbCBvbiBlZGdlc1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBmdW5jdGlvbiBoYW5kbGUoZXZlbnQpIHtcbiAgICBsZXQgZSA9IGV2ZW50O1xuICAgIGxldCBkaXNhYmxlUGFyZW50U3dpcGVyID0gdHJ1ZTtcbiAgICBpZiAoIXN3aXBlci5lbmFibGVkKSByZXR1cm47XG5cbiAgICAvLyBJZ25vcmUgZXZlbnQgaWYgdGhlIHRhcmdldCBvciBpdHMgcGFyZW50cyBoYXZlIHRoZSBzd2lwZXItbm8tbW91c2V3aGVlbCBjbGFzc1xuICAgIGlmIChldmVudC50YXJnZXQuY2xvc2VzdChgLiR7c3dpcGVyLnBhcmFtcy5tb3VzZXdoZWVsLm5vTW91c2V3aGVlbENsYXNzfWApKSByZXR1cm47XG4gICAgY29uc3QgcGFyYW1zID0gc3dpcGVyLnBhcmFtcy5tb3VzZXdoZWVsO1xuICAgIGlmIChzd2lwZXIucGFyYW1zLmNzc01vZGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gICAgbGV0IHRhcmdldEVsID0gc3dpcGVyLmVsO1xuICAgIGlmIChzd2lwZXIucGFyYW1zLm1vdXNld2hlZWwuZXZlbnRzVGFyZ2V0ICE9PSAnY29udGFpbmVyJykge1xuICAgICAgdGFyZ2V0RWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHN3aXBlci5wYXJhbXMubW91c2V3aGVlbC5ldmVudHNUYXJnZXQpO1xuICAgIH1cbiAgICBjb25zdCB0YXJnZXRFbENvbnRhaW5zVGFyZ2V0ID0gdGFyZ2V0RWwgJiYgdGFyZ2V0RWwuY29udGFpbnMoZS50YXJnZXQpO1xuICAgIGlmICghc3dpcGVyLm1vdXNlRW50ZXJlZCAmJiAhdGFyZ2V0RWxDb250YWluc1RhcmdldCAmJiAhcGFyYW1zLnJlbGVhc2VPbkVkZ2VzKSByZXR1cm4gdHJ1ZTtcbiAgICBpZiAoZS5vcmlnaW5hbEV2ZW50KSBlID0gZS5vcmlnaW5hbEV2ZW50OyAvLyBqcXVlcnkgZml4XG4gICAgbGV0IGRlbHRhID0gMDtcbiAgICBjb25zdCBydGxGYWN0b3IgPSBzd2lwZXIucnRsVHJhbnNsYXRlID8gLTEgOiAxO1xuICAgIGNvbnN0IGRhdGEgPSBub3JtYWxpemUoZSk7XG4gICAgaWYgKHBhcmFtcy5mb3JjZVRvQXhpcykge1xuICAgICAgaWYgKHN3aXBlci5pc0hvcml6b250YWwoKSkge1xuICAgICAgICBpZiAoTWF0aC5hYnMoZGF0YS5waXhlbFgpID4gTWF0aC5hYnMoZGF0YS5waXhlbFkpKSBkZWx0YSA9IC1kYXRhLnBpeGVsWCAqIHJ0bEZhY3RvcjtlbHNlIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIGlmIChNYXRoLmFicyhkYXRhLnBpeGVsWSkgPiBNYXRoLmFicyhkYXRhLnBpeGVsWCkpIGRlbHRhID0gLWRhdGEucGl4ZWxZO2Vsc2UgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbHRhID0gTWF0aC5hYnMoZGF0YS5waXhlbFgpID4gTWF0aC5hYnMoZGF0YS5waXhlbFkpID8gLWRhdGEucGl4ZWxYICogcnRsRmFjdG9yIDogLWRhdGEucGl4ZWxZO1xuICAgIH1cbiAgICBpZiAoZGVsdGEgPT09IDApIHJldHVybiB0cnVlO1xuICAgIGlmIChwYXJhbXMuaW52ZXJ0KSBkZWx0YSA9IC1kZWx0YTtcblxuICAgIC8vIEdldCB0aGUgc2Nyb2xsIHBvc2l0aW9uc1xuICAgIGxldCBwb3NpdGlvbnMgPSBzd2lwZXIuZ2V0VHJhbnNsYXRlKCkgKyBkZWx0YSAqIHBhcmFtcy5zZW5zaXRpdml0eTtcbiAgICBpZiAocG9zaXRpb25zID49IHN3aXBlci5taW5UcmFuc2xhdGUoKSkgcG9zaXRpb25zID0gc3dpcGVyLm1pblRyYW5zbGF0ZSgpO1xuICAgIGlmIChwb3NpdGlvbnMgPD0gc3dpcGVyLm1heFRyYW5zbGF0ZSgpKSBwb3NpdGlvbnMgPSBzd2lwZXIubWF4VHJhbnNsYXRlKCk7XG5cbiAgICAvLyBXaGVuIGxvb3AgaXMgdHJ1ZTpcbiAgICAvLyAgICAgdGhlIGRpc2FibGVQYXJlbnRTd2lwZXIgd2lsbCBiZSB0cnVlLlxuICAgIC8vIFdoZW4gbG9vcCBpcyBmYWxzZTpcbiAgICAvLyAgICAgaWYgdGhlIHNjcm9sbCBwb3NpdGlvbnMgaXMgbm90IG9uIGVkZ2UsXG4gICAgLy8gICAgIHRoZW4gdGhlIGRpc2FibGVQYXJlbnRTd2lwZXIgd2lsbCBiZSB0cnVlLlxuICAgIC8vICAgICBpZiB0aGUgc2Nyb2xsIG9uIGVkZ2UgcG9zaXRpb25zLFxuICAgIC8vICAgICB0aGVuIHRoZSBkaXNhYmxlUGFyZW50U3dpcGVyIHdpbGwgYmUgZmFsc2UuXG4gICAgZGlzYWJsZVBhcmVudFN3aXBlciA9IHN3aXBlci5wYXJhbXMubG9vcCA/IHRydWUgOiAhKHBvc2l0aW9ucyA9PT0gc3dpcGVyLm1pblRyYW5zbGF0ZSgpIHx8IHBvc2l0aW9ucyA9PT0gc3dpcGVyLm1heFRyYW5zbGF0ZSgpKTtcbiAgICBpZiAoZGlzYWJsZVBhcmVudFN3aXBlciAmJiBzd2lwZXIucGFyYW1zLm5lc3RlZCkgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBpZiAoIXN3aXBlci5wYXJhbXMuZnJlZU1vZGUgfHwgIXN3aXBlci5wYXJhbXMuZnJlZU1vZGUuZW5hYmxlZCkge1xuICAgICAgLy8gUmVnaXN0ZXIgdGhlIG5ldyBldmVudCBpbiBhIHZhcmlhYmxlIHdoaWNoIHN0b3JlcyB0aGUgcmVsZXZhbnQgZGF0YVxuICAgICAgY29uc3QgbmV3RXZlbnQgPSB7XG4gICAgICAgIHRpbWU6IG5vdygpLFxuICAgICAgICBkZWx0YTogTWF0aC5hYnMoZGVsdGEpLFxuICAgICAgICBkaXJlY3Rpb246IE1hdGguc2lnbihkZWx0YSksXG4gICAgICAgIHJhdzogZXZlbnRcbiAgICAgIH07XG5cbiAgICAgIC8vIEtlZXAgdGhlIG1vc3QgcmVjZW50IGV2ZW50c1xuICAgICAgaWYgKHJlY2VudFdoZWVsRXZlbnRzLmxlbmd0aCA+PSAyKSB7XG4gICAgICAgIHJlY2VudFdoZWVsRXZlbnRzLnNoaWZ0KCk7IC8vIG9ubHkgc3RvcmUgdGhlIGxhc3QgTiBldmVudHNcbiAgICAgIH1cblxuICAgICAgY29uc3QgcHJldkV2ZW50ID0gcmVjZW50V2hlZWxFdmVudHMubGVuZ3RoID8gcmVjZW50V2hlZWxFdmVudHNbcmVjZW50V2hlZWxFdmVudHMubGVuZ3RoIC0gMV0gOiB1bmRlZmluZWQ7XG4gICAgICByZWNlbnRXaGVlbEV2ZW50cy5wdXNoKG5ld0V2ZW50KTtcblxuICAgICAgLy8gSWYgdGhlcmUgaXMgYXQgbGVhc3Qgb25lIHByZXZpb3VzIHJlY29yZGVkIGV2ZW50OlxuICAgICAgLy8gICBJZiBkaXJlY3Rpb24gaGFzIGNoYW5nZWQgb3JcbiAgICAgIC8vICAgaWYgdGhlIHNjcm9sbCBpcyBxdWlja2VyIHRoYW4gdGhlIHByZXZpb3VzIG9uZTpcbiAgICAgIC8vICAgICBBbmltYXRlIHRoZSBzbGlkZXIuXG4gICAgICAvLyBFbHNlICh0aGlzIGlzIHRoZSBmaXJzdCB0aW1lIHRoZSB3aGVlbCBpcyBtb3ZlZCk6XG4gICAgICAvLyAgICAgQW5pbWF0ZSB0aGUgc2xpZGVyLlxuICAgICAgaWYgKHByZXZFdmVudCkge1xuICAgICAgICBpZiAobmV3RXZlbnQuZGlyZWN0aW9uICE9PSBwcmV2RXZlbnQuZGlyZWN0aW9uIHx8IG5ld0V2ZW50LmRlbHRhID4gcHJldkV2ZW50LmRlbHRhIHx8IG5ld0V2ZW50LnRpbWUgPiBwcmV2RXZlbnQudGltZSArIDE1MCkge1xuICAgICAgICAgIGFuaW1hdGVTbGlkZXIobmV3RXZlbnQpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhbmltYXRlU2xpZGVyKG5ld0V2ZW50KTtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgaXQncyB0aW1lIHRvIHJlbGVhc2UgdGhlIHNjcm9sbDpcbiAgICAgIC8vICAgUmV0dXJuIG5vdyBzbyB5b3UgZG9uJ3QgaGl0IHRoZSBwcmV2ZW50RGVmYXVsdC5cbiAgICAgIGlmIChyZWxlYXNlU2Nyb2xsKG5ld0V2ZW50KSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRnJlZW1vZGUgb3Igc2Nyb2xsQ29udGFpbmVyOlxuXG4gICAgICAvLyBJZiB3ZSByZWNlbnRseSBzbmFwcGVkIGFmdGVyIGEgbW9tZW50dW0gc2Nyb2xsLCB0aGVuIGlnbm9yZSB3aGVlbCBldmVudHNcbiAgICAgIC8vIHRvIGdpdmUgdGltZSBmb3IgdGhlIGRlY2VsZXJhdGlvbiB0byBmaW5pc2guIFN0b3AgaWdub3JpbmcgYWZ0ZXIgNTAwIG1zZWNzXG4gICAgICAvLyBvciBpZiBpdCdzIGEgbmV3IHNjcm9sbCAobGFyZ2VyIGRlbHRhIG9yIGludmVyc2Ugc2lnbiBhcyBsYXN0IGV2ZW50IGJlZm9yZVxuICAgICAgLy8gYW4gZW5kLW9mLW1vbWVudHVtIHNuYXApLlxuICAgICAgY29uc3QgbmV3RXZlbnQgPSB7XG4gICAgICAgIHRpbWU6IG5vdygpLFxuICAgICAgICBkZWx0YTogTWF0aC5hYnMoZGVsdGEpLFxuICAgICAgICBkaXJlY3Rpb246IE1hdGguc2lnbihkZWx0YSlcbiAgICAgIH07XG4gICAgICBjb25zdCBpZ25vcmVXaGVlbEV2ZW50cyA9IGxhc3RFdmVudEJlZm9yZVNuYXAgJiYgbmV3RXZlbnQudGltZSA8IGxhc3RFdmVudEJlZm9yZVNuYXAudGltZSArIDUwMCAmJiBuZXdFdmVudC5kZWx0YSA8PSBsYXN0RXZlbnRCZWZvcmVTbmFwLmRlbHRhICYmIG5ld0V2ZW50LmRpcmVjdGlvbiA9PT0gbGFzdEV2ZW50QmVmb3JlU25hcC5kaXJlY3Rpb247XG4gICAgICBpZiAoIWlnbm9yZVdoZWVsRXZlbnRzKSB7XG4gICAgICAgIGxhc3RFdmVudEJlZm9yZVNuYXAgPSB1bmRlZmluZWQ7XG4gICAgICAgIGxldCBwb3NpdGlvbiA9IHN3aXBlci5nZXRUcmFuc2xhdGUoKSArIGRlbHRhICogcGFyYW1zLnNlbnNpdGl2aXR5O1xuICAgICAgICBjb25zdCB3YXNCZWdpbm5pbmcgPSBzd2lwZXIuaXNCZWdpbm5pbmc7XG4gICAgICAgIGNvbnN0IHdhc0VuZCA9IHN3aXBlci5pc0VuZDtcbiAgICAgICAgaWYgKHBvc2l0aW9uID49IHN3aXBlci5taW5UcmFuc2xhdGUoKSkgcG9zaXRpb24gPSBzd2lwZXIubWluVHJhbnNsYXRlKCk7XG4gICAgICAgIGlmIChwb3NpdGlvbiA8PSBzd2lwZXIubWF4VHJhbnNsYXRlKCkpIHBvc2l0aW9uID0gc3dpcGVyLm1heFRyYW5zbGF0ZSgpO1xuICAgICAgICBzd2lwZXIuc2V0VHJhbnNpdGlvbigwKTtcbiAgICAgICAgc3dpcGVyLnNldFRyYW5zbGF0ZShwb3NpdGlvbik7XG4gICAgICAgIHN3aXBlci51cGRhdGVQcm9ncmVzcygpO1xuICAgICAgICBzd2lwZXIudXBkYXRlQWN0aXZlSW5kZXgoKTtcbiAgICAgICAgc3dpcGVyLnVwZGF0ZVNsaWRlc0NsYXNzZXMoKTtcbiAgICAgICAgaWYgKCF3YXNCZWdpbm5pbmcgJiYgc3dpcGVyLmlzQmVnaW5uaW5nIHx8ICF3YXNFbmQgJiYgc3dpcGVyLmlzRW5kKSB7XG4gICAgICAgICAgc3dpcGVyLnVwZGF0ZVNsaWRlc0NsYXNzZXMoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3dpcGVyLnBhcmFtcy5sb29wKSB7XG4gICAgICAgICAgc3dpcGVyLmxvb3BGaXgoe1xuICAgICAgICAgICAgZGlyZWN0aW9uOiBuZXdFdmVudC5kaXJlY3Rpb24gPCAwID8gJ25leHQnIDogJ3ByZXYnLFxuICAgICAgICAgICAgYnlNb3VzZXdoZWVsOiB0cnVlXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN3aXBlci5wYXJhbXMuZnJlZU1vZGUuc3RpY2t5KSB7XG4gICAgICAgICAgLy8gV2hlbiB3aGVlbCBzY3JvbGxpbmcgc3RhcnRzIHdpdGggc3RpY2t5IChha2Egc25hcCkgZW5hYmxlZCwgdGhlbiBkZXRlY3RcbiAgICAgICAgICAvLyB0aGUgZW5kIG9mIGEgbW9tZW50dW0gc2Nyb2xsIGJ5IHN0b3JpbmcgcmVjZW50IChOPTE1Pykgd2hlZWwgZXZlbnRzLlxuICAgICAgICAgIC8vIDEuIGRvIGFsbCBOIGV2ZW50cyBoYXZlIGRlY3JlYXNpbmcgb3Igc2FtZSAoYWJzb2x1dGUgdmFsdWUpIGRlbHRhP1xuICAgICAgICAgIC8vIDIuIGRpZCBhbGwgTiBldmVudHMgYXJyaXZlIGluIHRoZSBsYXN0IE0gKE09NTAwPykgbXNlY3M/XG4gICAgICAgICAgLy8gMy4gZG9lcyB0aGUgZWFybGllc3QgZXZlbnQgaGF2ZSBhbiAoYWJzb2x1dGUgdmFsdWUpIGRlbHRhIHRoYXQnc1xuICAgICAgICAgIC8vICAgIGF0IGxlYXN0IFAgKFA9MT8pIGxhcmdlciB0aGFuIHRoZSBtb3N0IHJlY2VudCBldmVudCdzIGRlbHRhP1xuICAgICAgICAgIC8vIDQuIGRvZXMgdGhlIGxhdGVzdCBldmVudCBoYXZlIGEgZGVsdGEgdGhhdCdzIHNtYWxsZXIgdGhhbiBRIChRPTY/KSBwaXhlbHM/XG4gICAgICAgICAgLy8gSWYgMS00IGFyZSBcInllc1wiIHRoZW4gd2UncmUgbmVhciB0aGUgZW5kIG9mIGEgbW9tZW50dW0gc2Nyb2xsIGRlY2VsZXJhdGlvbi5cbiAgICAgICAgICAvLyBTbmFwIGltbWVkaWF0ZWx5IGFuZCBpZ25vcmUgcmVtYWluaW5nIHdoZWVsIGV2ZW50cyBpbiB0aGlzIHNjcm9sbC5cbiAgICAgICAgICAvLyBTZWUgY29tbWVudCBhYm92ZSBmb3IgXCJyZW1haW5pbmcgd2hlZWwgZXZlbnRzIGluIHRoaXMgc2Nyb2xsXCIgZGV0ZXJtaW5hdGlvbi5cbiAgICAgICAgICAvLyBJZiAxLTQgYXJlbid0IHNhdGlzZmllZCwgdGhlbiB3YWl0IHRvIHNuYXAgdW50aWwgNTAwbXMgYWZ0ZXIgdGhlIGxhc3QgZXZlbnQuXG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICAgIHRpbWVvdXQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgaWYgKHJlY2VudFdoZWVsRXZlbnRzLmxlbmd0aCA+PSAxNSkge1xuICAgICAgICAgICAgcmVjZW50V2hlZWxFdmVudHMuc2hpZnQoKTsgLy8gb25seSBzdG9yZSB0aGUgbGFzdCBOIGV2ZW50c1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IHByZXZFdmVudCA9IHJlY2VudFdoZWVsRXZlbnRzLmxlbmd0aCA/IHJlY2VudFdoZWVsRXZlbnRzW3JlY2VudFdoZWVsRXZlbnRzLmxlbmd0aCAtIDFdIDogdW5kZWZpbmVkO1xuICAgICAgICAgIGNvbnN0IGZpcnN0RXZlbnQgPSByZWNlbnRXaGVlbEV2ZW50c1swXTtcbiAgICAgICAgICByZWNlbnRXaGVlbEV2ZW50cy5wdXNoKG5ld0V2ZW50KTtcbiAgICAgICAgICBpZiAocHJldkV2ZW50ICYmIChuZXdFdmVudC5kZWx0YSA+IHByZXZFdmVudC5kZWx0YSB8fCBuZXdFdmVudC5kaXJlY3Rpb24gIT09IHByZXZFdmVudC5kaXJlY3Rpb24pKSB7XG4gICAgICAgICAgICAvLyBJbmNyZWFzaW5nIG9yIHJldmVyc2Utc2lnbiBkZWx0YSBtZWFucyB0aGUgdXNlciBzdGFydGVkIHNjcm9sbGluZyBhZ2Fpbi4gQ2xlYXIgdGhlIHdoZWVsIGV2ZW50IGxvZy5cbiAgICAgICAgICAgIHJlY2VudFdoZWVsRXZlbnRzLnNwbGljZSgwKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHJlY2VudFdoZWVsRXZlbnRzLmxlbmd0aCA+PSAxNSAmJiBuZXdFdmVudC50aW1lIC0gZmlyc3RFdmVudC50aW1lIDwgNTAwICYmIGZpcnN0RXZlbnQuZGVsdGEgLSBuZXdFdmVudC5kZWx0YSA+PSAxICYmIG5ld0V2ZW50LmRlbHRhIDw9IDYpIHtcbiAgICAgICAgICAgIC8vIFdlJ3JlIGF0IHRoZSBlbmQgb2YgdGhlIGRlY2VsZXJhdGlvbiBvZiBhIG1vbWVudHVtIHNjcm9sbCwgc28gdGhlcmUncyBubyBuZWVkXG4gICAgICAgICAgICAvLyB0byB3YWl0IGZvciBtb3JlIGV2ZW50cy4gU25hcCBBU0FQIG9uIHRoZSBuZXh0IHRpY2suXG4gICAgICAgICAgICAvLyBBbHNvLCBiZWNhdXNlIHRoZXJlJ3Mgc29tZSByZW1haW5pbmcgbW9tZW50dW0gd2UnbGwgYmlhcyB0aGUgc25hcCBpbiB0aGVcbiAgICAgICAgICAgIC8vIGRpcmVjdGlvbiBvZiB0aGUgb25nb2luZyBzY3JvbGwgYmVjYXVzZSBpdCdzIGJldHRlciBVWCBmb3IgdGhlIHNjcm9sbCB0byBzbmFwXG4gICAgICAgICAgICAvLyBpbiB0aGUgc2FtZSBkaXJlY3Rpb24gYXMgdGhlIHNjcm9sbCBpbnN0ZWFkIG9mIHJldmVyc2luZyB0byBzbmFwLiAgVGhlcmVmb3JlLFxuICAgICAgICAgICAgLy8gaWYgaXQncyBhbHJlYWR5IHNjcm9sbGVkIG1vcmUgdGhhbiAyMCUgaW4gdGhlIGN1cnJlbnQgZGlyZWN0aW9uLCBrZWVwIGdvaW5nLlxuICAgICAgICAgICAgY29uc3Qgc25hcFRvVGhyZXNob2xkID0gZGVsdGEgPiAwID8gMC44IDogMC4yO1xuICAgICAgICAgICAgbGFzdEV2ZW50QmVmb3JlU25hcCA9IG5ld0V2ZW50O1xuICAgICAgICAgICAgcmVjZW50V2hlZWxFdmVudHMuc3BsaWNlKDApO1xuICAgICAgICAgICAgdGltZW91dCA9IG5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgICAgICAgc3dpcGVyLnNsaWRlVG9DbG9zZXN0KHN3aXBlci5wYXJhbXMuc3BlZWQsIHRydWUsIHVuZGVmaW5lZCwgc25hcFRvVGhyZXNob2xkKTtcbiAgICAgICAgICAgIH0sIDApOyAvLyBubyBkZWxheTsgbW92ZSBvbiBuZXh0IHRpY2tcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIXRpbWVvdXQpIHtcbiAgICAgICAgICAgIC8vIGlmIHdlIGdldCBoZXJlLCB0aGVuIHdlIGhhdmVuJ3QgZGV0ZWN0ZWQgdGhlIGVuZCBvZiBhIG1vbWVudHVtIHNjcm9sbCwgc29cbiAgICAgICAgICAgIC8vIHdlJ2xsIGNvbnNpZGVyIGEgc2Nyb2xsIFwiY29tcGxldGVcIiB3aGVuIHRoZXJlIGhhdmVuJ3QgYmVlbiBhbnkgd2hlZWwgZXZlbnRzXG4gICAgICAgICAgICAvLyBmb3IgNTAwbXMuXG4gICAgICAgICAgICB0aW1lb3V0ID0gbmV4dFRpY2soKCkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBzbmFwVG9UaHJlc2hvbGQgPSAwLjU7XG4gICAgICAgICAgICAgIGxhc3RFdmVudEJlZm9yZVNuYXAgPSBuZXdFdmVudDtcbiAgICAgICAgICAgICAgcmVjZW50V2hlZWxFdmVudHMuc3BsaWNlKDApO1xuICAgICAgICAgICAgICBzd2lwZXIuc2xpZGVUb0Nsb3Nlc3Qoc3dpcGVyLnBhcmFtcy5zcGVlZCwgdHJ1ZSwgdW5kZWZpbmVkLCBzbmFwVG9UaHJlc2hvbGQpO1xuICAgICAgICAgICAgfSwgNTAwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBFbWl0IGV2ZW50XG4gICAgICAgIGlmICghaWdub3JlV2hlZWxFdmVudHMpIGVtaXQoJ3Njcm9sbCcsIGUpO1xuXG4gICAgICAgIC8vIFN0b3AgYXV0b3BsYXlcbiAgICAgICAgaWYgKHN3aXBlci5wYXJhbXMuYXV0b3BsYXkgJiYgc3dpcGVyLnBhcmFtcy5hdXRvcGxheURpc2FibGVPbkludGVyYWN0aW9uKSBzd2lwZXIuYXV0b3BsYXkuc3RvcCgpO1xuICAgICAgICAvLyBSZXR1cm4gcGFnZSBzY3JvbGwgb24gZWRnZSBwb3NpdGlvbnNcbiAgICAgICAgaWYgKHBhcmFtcy5yZWxlYXNlT25FZGdlcyAmJiAocG9zaXRpb24gPT09IHN3aXBlci5taW5UcmFuc2xhdGUoKSB8fCBwb3NpdGlvbiA9PT0gc3dpcGVyLm1heFRyYW5zbGF0ZSgpKSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChlLnByZXZlbnREZWZhdWx0KSBlLnByZXZlbnREZWZhdWx0KCk7ZWxzZSBlLnJldHVyblZhbHVlID0gZmFsc2U7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGZ1bmN0aW9uIGV2ZW50cyhtZXRob2QpIHtcbiAgICBsZXQgdGFyZ2V0RWwgPSBzd2lwZXIuZWw7XG4gICAgaWYgKHN3aXBlci5wYXJhbXMubW91c2V3aGVlbC5ldmVudHNUYXJnZXQgIT09ICdjb250YWluZXInKSB7XG4gICAgICB0YXJnZXRFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc3dpcGVyLnBhcmFtcy5tb3VzZXdoZWVsLmV2ZW50c1RhcmdldCk7XG4gICAgfVxuICAgIHRhcmdldEVsW21ldGhvZF0oJ21vdXNlZW50ZXInLCBoYW5kbGVNb3VzZUVudGVyKTtcbiAgICB0YXJnZXRFbFttZXRob2RdKCdtb3VzZWxlYXZlJywgaGFuZGxlTW91c2VMZWF2ZSk7XG4gICAgdGFyZ2V0RWxbbWV0aG9kXSgnd2hlZWwnLCBoYW5kbGUpO1xuICB9XG4gIGZ1bmN0aW9uIGVuYWJsZSgpIHtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5jc3NNb2RlKSB7XG4gICAgICBzd2lwZXIud3JhcHBlckVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3doZWVsJywgaGFuZGxlKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAoc3dpcGVyLm1vdXNld2hlZWwuZW5hYmxlZCkgcmV0dXJuIGZhbHNlO1xuICAgIGV2ZW50cygnYWRkRXZlbnRMaXN0ZW5lcicpO1xuICAgIHN3aXBlci5tb3VzZXdoZWVsLmVuYWJsZWQgPSB0cnVlO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGZ1bmN0aW9uIGRpc2FibGUoKSB7XG4gICAgaWYgKHN3aXBlci5wYXJhbXMuY3NzTW9kZSkge1xuICAgICAgc3dpcGVyLndyYXBwZXJFbC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGUpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmICghc3dpcGVyLm1vdXNld2hlZWwuZW5hYmxlZCkgcmV0dXJuIGZhbHNlO1xuICAgIGV2ZW50cygncmVtb3ZlRXZlbnRMaXN0ZW5lcicpO1xuICAgIHN3aXBlci5tb3VzZXdoZWVsLmVuYWJsZWQgPSBmYWxzZTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBvbignaW5pdCcsICgpID0+IHtcbiAgICBpZiAoIXN3aXBlci5wYXJhbXMubW91c2V3aGVlbC5lbmFibGVkICYmIHN3aXBlci5wYXJhbXMuY3NzTW9kZSkge1xuICAgICAgZGlzYWJsZSgpO1xuICAgIH1cbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5tb3VzZXdoZWVsLmVuYWJsZWQpIGVuYWJsZSgpO1xuICB9KTtcbiAgb24oJ2Rlc3Ryb3knLCAoKSA9PiB7XG4gICAgaWYgKHN3aXBlci5wYXJhbXMuY3NzTW9kZSkge1xuICAgICAgZW5hYmxlKCk7XG4gICAgfVxuICAgIGlmIChzd2lwZXIubW91c2V3aGVlbC5lbmFibGVkKSBkaXNhYmxlKCk7XG4gIH0pO1xuICBPYmplY3QuYXNzaWduKHN3aXBlci5tb3VzZXdoZWVsLCB7XG4gICAgZW5hYmxlLFxuICAgIGRpc2FibGVcbiAgfSk7XG59XG5cbmV4cG9ydCB7IE1vdXNld2hlZWwgYXMgZGVmYXVsdCB9O1xuIiwiaW1wb3J0IHsgZSBhcyBlbGVtZW50Q2hpbGRyZW4sIGMgYXMgY3JlYXRlRWxlbWVudCB9IGZyb20gJy4vdXRpbHMubWpzJztcblxuZnVuY3Rpb24gY3JlYXRlRWxlbWVudElmTm90RGVmaW5lZChzd2lwZXIsIG9yaWdpbmFsUGFyYW1zLCBwYXJhbXMsIGNoZWNrUHJvcHMpIHtcbiAgaWYgKHN3aXBlci5wYXJhbXMuY3JlYXRlRWxlbWVudHMpIHtcbiAgICBPYmplY3Qua2V5cyhjaGVja1Byb3BzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBpZiAoIXBhcmFtc1trZXldICYmIHBhcmFtcy5hdXRvID09PSB0cnVlKSB7XG4gICAgICAgIGxldCBlbGVtZW50ID0gZWxlbWVudENoaWxkcmVuKHN3aXBlci5lbCwgYC4ke2NoZWNrUHJvcHNba2V5XX1gKVswXTtcbiAgICAgICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICAgICAgZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQoJ2RpdicsIGNoZWNrUHJvcHNba2V5XSk7XG4gICAgICAgICAgZWxlbWVudC5jbGFzc05hbWUgPSBjaGVja1Byb3BzW2tleV07XG4gICAgICAgICAgc3dpcGVyLmVsLmFwcGVuZChlbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgICBwYXJhbXNba2V5XSA9IGVsZW1lbnQ7XG4gICAgICAgIG9yaWdpbmFsUGFyYW1zW2tleV0gPSBlbGVtZW50O1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIHJldHVybiBwYXJhbXM7XG59XG5cbmV4cG9ydCB7IGNyZWF0ZUVsZW1lbnRJZk5vdERlZmluZWQgYXMgYyB9O1xuIiwiaW1wb3J0IHsgYyBhcyBjcmVhdGVFbGVtZW50SWZOb3REZWZpbmVkIH0gZnJvbSAnLi4vc2hhcmVkL2NyZWF0ZS1lbGVtZW50LWlmLW5vdC1kZWZpbmVkLm1qcyc7XG5cbmZ1bmN0aW9uIE5hdmlnYXRpb24oX3JlZikge1xuICBsZXQge1xuICAgIHN3aXBlcixcbiAgICBleHRlbmRQYXJhbXMsXG4gICAgb24sXG4gICAgZW1pdFxuICB9ID0gX3JlZjtcbiAgZXh0ZW5kUGFyYW1zKHtcbiAgICBuYXZpZ2F0aW9uOiB7XG4gICAgICBuZXh0RWw6IG51bGwsXG4gICAgICBwcmV2RWw6IG51bGwsXG4gICAgICBoaWRlT25DbGljazogZmFsc2UsXG4gICAgICBkaXNhYmxlZENsYXNzOiAnc3dpcGVyLWJ1dHRvbi1kaXNhYmxlZCcsXG4gICAgICBoaWRkZW5DbGFzczogJ3N3aXBlci1idXR0b24taGlkZGVuJyxcbiAgICAgIGxvY2tDbGFzczogJ3N3aXBlci1idXR0b24tbG9jaycsXG4gICAgICBuYXZpZ2F0aW9uRGlzYWJsZWRDbGFzczogJ3N3aXBlci1uYXZpZ2F0aW9uLWRpc2FibGVkJ1xuICAgIH1cbiAgfSk7XG4gIHN3aXBlci5uYXZpZ2F0aW9uID0ge1xuICAgIG5leHRFbDogbnVsbCxcbiAgICBwcmV2RWw6IG51bGxcbiAgfTtcbiAgY29uc3QgbWFrZUVsZW1lbnRzQXJyYXkgPSBlbCA9PiAoQXJyYXkuaXNBcnJheShlbCkgPyBlbCA6IFtlbF0pLmZpbHRlcihlID0+ICEhZSk7XG4gIGZ1bmN0aW9uIGdldEVsKGVsKSB7XG4gICAgbGV0IHJlcztcbiAgICBpZiAoZWwgJiYgdHlwZW9mIGVsID09PSAnc3RyaW5nJyAmJiBzd2lwZXIuaXNFbGVtZW50KSB7XG4gICAgICByZXMgPSBzd2lwZXIuZWwucXVlcnlTZWxlY3RvcihlbCk7XG4gICAgICBpZiAocmVzKSByZXR1cm4gcmVzO1xuICAgIH1cbiAgICBpZiAoZWwpIHtcbiAgICAgIGlmICh0eXBlb2YgZWwgPT09ICdzdHJpbmcnKSByZXMgPSBbLi4uZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChlbCldO1xuICAgICAgaWYgKHN3aXBlci5wYXJhbXMudW5pcXVlTmF2RWxlbWVudHMgJiYgdHlwZW9mIGVsID09PSAnc3RyaW5nJyAmJiByZXMubGVuZ3RoID4gMSAmJiBzd2lwZXIuZWwucXVlcnlTZWxlY3RvckFsbChlbCkubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHJlcyA9IHN3aXBlci5lbC5xdWVyeVNlbGVjdG9yKGVsKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGVsICYmICFyZXMpIHJldHVybiBlbDtcbiAgICAvLyBpZiAoQXJyYXkuaXNBcnJheShyZXMpICYmIHJlcy5sZW5ndGggPT09IDEpIHJlcyA9IHJlc1swXTtcbiAgICByZXR1cm4gcmVzO1xuICB9XG4gIGZ1bmN0aW9uIHRvZ2dsZUVsKGVsLCBkaXNhYmxlZCkge1xuICAgIGNvbnN0IHBhcmFtcyA9IHN3aXBlci5wYXJhbXMubmF2aWdhdGlvbjtcbiAgICBlbCA9IG1ha2VFbGVtZW50c0FycmF5KGVsKTtcbiAgICBlbC5mb3JFYWNoKHN1YkVsID0+IHtcbiAgICAgIGlmIChzdWJFbCkge1xuICAgICAgICBzdWJFbC5jbGFzc0xpc3RbZGlzYWJsZWQgPyAnYWRkJyA6ICdyZW1vdmUnXSguLi5wYXJhbXMuZGlzYWJsZWRDbGFzcy5zcGxpdCgnICcpKTtcbiAgICAgICAgaWYgKHN1YkVsLnRhZ05hbWUgPT09ICdCVVRUT04nKSBzdWJFbC5kaXNhYmxlZCA9IGRpc2FibGVkO1xuICAgICAgICBpZiAoc3dpcGVyLnBhcmFtcy53YXRjaE92ZXJmbG93ICYmIHN3aXBlci5lbmFibGVkKSB7XG4gICAgICAgICAgc3ViRWwuY2xhc3NMaXN0W3N3aXBlci5pc0xvY2tlZCA/ICdhZGQnIDogJ3JlbW92ZSddKHBhcmFtcy5sb2NrQ2xhc3MpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgZnVuY3Rpb24gdXBkYXRlKCkge1xuICAgIC8vIFVwZGF0ZSBOYXZpZ2F0aW9uIEJ1dHRvbnNcbiAgICBjb25zdCB7XG4gICAgICBuZXh0RWwsXG4gICAgICBwcmV2RWxcbiAgICB9ID0gc3dpcGVyLm5hdmlnYXRpb247XG4gICAgaWYgKHN3aXBlci5wYXJhbXMubG9vcCkge1xuICAgICAgdG9nZ2xlRWwocHJldkVsLCBmYWxzZSk7XG4gICAgICB0b2dnbGVFbChuZXh0RWwsIGZhbHNlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdG9nZ2xlRWwocHJldkVsLCBzd2lwZXIuaXNCZWdpbm5pbmcgJiYgIXN3aXBlci5wYXJhbXMucmV3aW5kKTtcbiAgICB0b2dnbGVFbChuZXh0RWwsIHN3aXBlci5pc0VuZCAmJiAhc3dpcGVyLnBhcmFtcy5yZXdpbmQpO1xuICB9XG4gIGZ1bmN0aW9uIG9uUHJldkNsaWNrKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgaWYgKHN3aXBlci5pc0JlZ2lubmluZyAmJiAhc3dpcGVyLnBhcmFtcy5sb29wICYmICFzd2lwZXIucGFyYW1zLnJld2luZCkgcmV0dXJuO1xuICAgIHN3aXBlci5zbGlkZVByZXYoKTtcbiAgICBlbWl0KCduYXZpZ2F0aW9uUHJldicpO1xuICB9XG4gIGZ1bmN0aW9uIG9uTmV4dENsaWNrKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgaWYgKHN3aXBlci5pc0VuZCAmJiAhc3dpcGVyLnBhcmFtcy5sb29wICYmICFzd2lwZXIucGFyYW1zLnJld2luZCkgcmV0dXJuO1xuICAgIHN3aXBlci5zbGlkZU5leHQoKTtcbiAgICBlbWl0KCduYXZpZ2F0aW9uTmV4dCcpO1xuICB9XG4gIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgY29uc3QgcGFyYW1zID0gc3dpcGVyLnBhcmFtcy5uYXZpZ2F0aW9uO1xuICAgIHN3aXBlci5wYXJhbXMubmF2aWdhdGlvbiA9IGNyZWF0ZUVsZW1lbnRJZk5vdERlZmluZWQoc3dpcGVyLCBzd2lwZXIub3JpZ2luYWxQYXJhbXMubmF2aWdhdGlvbiwgc3dpcGVyLnBhcmFtcy5uYXZpZ2F0aW9uLCB7XG4gICAgICBuZXh0RWw6ICdzd2lwZXItYnV0dG9uLW5leHQnLFxuICAgICAgcHJldkVsOiAnc3dpcGVyLWJ1dHRvbi1wcmV2J1xuICAgIH0pO1xuICAgIGlmICghKHBhcmFtcy5uZXh0RWwgfHwgcGFyYW1zLnByZXZFbCkpIHJldHVybjtcbiAgICBsZXQgbmV4dEVsID0gZ2V0RWwocGFyYW1zLm5leHRFbCk7XG4gICAgbGV0IHByZXZFbCA9IGdldEVsKHBhcmFtcy5wcmV2RWwpO1xuICAgIE9iamVjdC5hc3NpZ24oc3dpcGVyLm5hdmlnYXRpb24sIHtcbiAgICAgIG5leHRFbCxcbiAgICAgIHByZXZFbFxuICAgIH0pO1xuICAgIG5leHRFbCA9IG1ha2VFbGVtZW50c0FycmF5KG5leHRFbCk7XG4gICAgcHJldkVsID0gbWFrZUVsZW1lbnRzQXJyYXkocHJldkVsKTtcbiAgICBjb25zdCBpbml0QnV0dG9uID0gKGVsLCBkaXIpID0+IHtcbiAgICAgIGlmIChlbCkge1xuICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGRpciA9PT0gJ25leHQnID8gb25OZXh0Q2xpY2sgOiBvblByZXZDbGljayk7XG4gICAgICB9XG4gICAgICBpZiAoIXN3aXBlci5lbmFibGVkICYmIGVsKSB7XG4gICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoLi4ucGFyYW1zLmxvY2tDbGFzcy5zcGxpdCgnICcpKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIG5leHRFbC5mb3JFYWNoKGVsID0+IGluaXRCdXR0b24oZWwsICduZXh0JykpO1xuICAgIHByZXZFbC5mb3JFYWNoKGVsID0+IGluaXRCdXR0b24oZWwsICdwcmV2JykpO1xuICB9XG4gIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgbGV0IHtcbiAgICAgIG5leHRFbCxcbiAgICAgIHByZXZFbFxuICAgIH0gPSBzd2lwZXIubmF2aWdhdGlvbjtcbiAgICBuZXh0RWwgPSBtYWtlRWxlbWVudHNBcnJheShuZXh0RWwpO1xuICAgIHByZXZFbCA9IG1ha2VFbGVtZW50c0FycmF5KHByZXZFbCk7XG4gICAgY29uc3QgZGVzdHJveUJ1dHRvbiA9IChlbCwgZGlyKSA9PiB7XG4gICAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIGRpciA9PT0gJ25leHQnID8gb25OZXh0Q2xpY2sgOiBvblByZXZDbGljayk7XG4gICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKC4uLnN3aXBlci5wYXJhbXMubmF2aWdhdGlvbi5kaXNhYmxlZENsYXNzLnNwbGl0KCcgJykpO1xuICAgIH07XG4gICAgbmV4dEVsLmZvckVhY2goZWwgPT4gZGVzdHJveUJ1dHRvbihlbCwgJ25leHQnKSk7XG4gICAgcHJldkVsLmZvckVhY2goZWwgPT4gZGVzdHJveUJ1dHRvbihlbCwgJ3ByZXYnKSk7XG4gIH1cbiAgb24oJ2luaXQnLCAoKSA9PiB7XG4gICAgaWYgKHN3aXBlci5wYXJhbXMubmF2aWdhdGlvbi5lbmFibGVkID09PSBmYWxzZSkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgICBkaXNhYmxlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGluaXQoKTtcbiAgICAgIHVwZGF0ZSgpO1xuICAgIH1cbiAgfSk7XG4gIG9uKCd0b0VkZ2UgZnJvbUVkZ2UgbG9jayB1bmxvY2snLCAoKSA9PiB7XG4gICAgdXBkYXRlKCk7XG4gIH0pO1xuICBvbignZGVzdHJveScsICgpID0+IHtcbiAgICBkZXN0cm95KCk7XG4gIH0pO1xuICBvbignZW5hYmxlIGRpc2FibGUnLCAoKSA9PiB7XG4gICAgbGV0IHtcbiAgICAgIG5leHRFbCxcbiAgICAgIHByZXZFbFxuICAgIH0gPSBzd2lwZXIubmF2aWdhdGlvbjtcbiAgICBuZXh0RWwgPSBtYWtlRWxlbWVudHNBcnJheShuZXh0RWwpO1xuICAgIHByZXZFbCA9IG1ha2VFbGVtZW50c0FycmF5KHByZXZFbCk7XG4gICAgaWYgKHN3aXBlci5lbmFibGVkKSB7XG4gICAgICB1cGRhdGUoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgWy4uLm5leHRFbCwgLi4ucHJldkVsXS5maWx0ZXIoZWwgPT4gISFlbCkuZm9yRWFjaChlbCA9PiBlbC5jbGFzc0xpc3QuYWRkKHN3aXBlci5wYXJhbXMubmF2aWdhdGlvbi5sb2NrQ2xhc3MpKTtcbiAgfSk7XG4gIG9uKCdjbGljaycsIChfcywgZSkgPT4ge1xuICAgIGxldCB7XG4gICAgICBuZXh0RWwsXG4gICAgICBwcmV2RWxcbiAgICB9ID0gc3dpcGVyLm5hdmlnYXRpb247XG4gICAgbmV4dEVsID0gbWFrZUVsZW1lbnRzQXJyYXkobmV4dEVsKTtcbiAgICBwcmV2RWwgPSBtYWtlRWxlbWVudHNBcnJheShwcmV2RWwpO1xuICAgIGNvbnN0IHRhcmdldEVsID0gZS50YXJnZXQ7XG4gICAgaWYgKHN3aXBlci5wYXJhbXMubmF2aWdhdGlvbi5oaWRlT25DbGljayAmJiAhcHJldkVsLmluY2x1ZGVzKHRhcmdldEVsKSAmJiAhbmV4dEVsLmluY2x1ZGVzKHRhcmdldEVsKSkge1xuICAgICAgaWYgKHN3aXBlci5wYWdpbmF0aW9uICYmIHN3aXBlci5wYXJhbXMucGFnaW5hdGlvbiAmJiBzd2lwZXIucGFyYW1zLnBhZ2luYXRpb24uY2xpY2thYmxlICYmIChzd2lwZXIucGFnaW5hdGlvbi5lbCA9PT0gdGFyZ2V0RWwgfHwgc3dpcGVyLnBhZ2luYXRpb24uZWwuY29udGFpbnModGFyZ2V0RWwpKSkgcmV0dXJuO1xuICAgICAgbGV0IGlzSGlkZGVuO1xuICAgICAgaWYgKG5leHRFbC5sZW5ndGgpIHtcbiAgICAgICAgaXNIaWRkZW4gPSBuZXh0RWxbMF0uY2xhc3NMaXN0LmNvbnRhaW5zKHN3aXBlci5wYXJhbXMubmF2aWdhdGlvbi5oaWRkZW5DbGFzcyk7XG4gICAgICB9IGVsc2UgaWYgKHByZXZFbC5sZW5ndGgpIHtcbiAgICAgICAgaXNIaWRkZW4gPSBwcmV2RWxbMF0uY2xhc3NMaXN0LmNvbnRhaW5zKHN3aXBlci5wYXJhbXMubmF2aWdhdGlvbi5oaWRkZW5DbGFzcyk7XG4gICAgICB9XG4gICAgICBpZiAoaXNIaWRkZW4gPT09IHRydWUpIHtcbiAgICAgICAgZW1pdCgnbmF2aWdhdGlvblNob3cnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVtaXQoJ25hdmlnYXRpb25IaWRlJyk7XG4gICAgICB9XG4gICAgICBbLi4ubmV4dEVsLCAuLi5wcmV2RWxdLmZpbHRlcihlbCA9PiAhIWVsKS5mb3JFYWNoKGVsID0+IGVsLmNsYXNzTGlzdC50b2dnbGUoc3dpcGVyLnBhcmFtcy5uYXZpZ2F0aW9uLmhpZGRlbkNsYXNzKSk7XG4gICAgfVxuICB9KTtcbiAgY29uc3QgZW5hYmxlID0gKCkgPT4ge1xuICAgIHN3aXBlci5lbC5jbGFzc0xpc3QucmVtb3ZlKC4uLnN3aXBlci5wYXJhbXMubmF2aWdhdGlvbi5uYXZpZ2F0aW9uRGlzYWJsZWRDbGFzcy5zcGxpdCgnICcpKTtcbiAgICBpbml0KCk7XG4gICAgdXBkYXRlKCk7XG4gIH07XG4gIGNvbnN0IGRpc2FibGUgPSAoKSA9PiB7XG4gICAgc3dpcGVyLmVsLmNsYXNzTGlzdC5hZGQoLi4uc3dpcGVyLnBhcmFtcy5uYXZpZ2F0aW9uLm5hdmlnYXRpb25EaXNhYmxlZENsYXNzLnNwbGl0KCcgJykpO1xuICAgIGRlc3Ryb3koKTtcbiAgfTtcbiAgT2JqZWN0LmFzc2lnbihzd2lwZXIubmF2aWdhdGlvbiwge1xuICAgIGVuYWJsZSxcbiAgICBkaXNhYmxlLFxuICAgIHVwZGF0ZSxcbiAgICBpbml0LFxuICAgIGRlc3Ryb3lcbiAgfSk7XG59XG5cbmV4cG9ydCB7IE5hdmlnYXRpb24gYXMgZGVmYXVsdCB9O1xuIiwiZnVuY3Rpb24gY2xhc3Nlc1RvU2VsZWN0b3IoY2xhc3Nlcykge1xuICBpZiAoY2xhc3NlcyA9PT0gdm9pZCAwKSB7XG4gICAgY2xhc3NlcyA9ICcnO1xuICB9XG4gIHJldHVybiBgLiR7Y2xhc3Nlcy50cmltKCkucmVwbGFjZSgvKFtcXC46IStcXC9dKS9nLCAnXFxcXCQxJykgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAucmVwbGFjZSgvIC9nLCAnLicpfWA7XG59XG5cbmV4cG9ydCB7IGNsYXNzZXNUb1NlbGVjdG9yIGFzIGMgfTtcbiIsImltcG9ydCB7IGMgYXMgY2xhc3Nlc1RvU2VsZWN0b3IgfSBmcm9tICcuLi9zaGFyZWQvY2xhc3Nlcy10by1zZWxlY3Rvci5tanMnO1xuaW1wb3J0IHsgYyBhcyBjcmVhdGVFbGVtZW50SWZOb3REZWZpbmVkIH0gZnJvbSAnLi4vc2hhcmVkL2NyZWF0ZS1lbGVtZW50LWlmLW5vdC1kZWZpbmVkLm1qcyc7XG5pbXBvcnQgeyBmIGFzIGVsZW1lbnRPdXRlclNpemUsIGcgYXMgZWxlbWVudEluZGV4LCBhIGFzIGVsZW1lbnRQYXJlbnRzIH0gZnJvbSAnLi4vc2hhcmVkL3V0aWxzLm1qcyc7XG5cbmZ1bmN0aW9uIFBhZ2luYXRpb24oX3JlZikge1xuICBsZXQge1xuICAgIHN3aXBlcixcbiAgICBleHRlbmRQYXJhbXMsXG4gICAgb24sXG4gICAgZW1pdFxuICB9ID0gX3JlZjtcbiAgY29uc3QgcGZ4ID0gJ3N3aXBlci1wYWdpbmF0aW9uJztcbiAgZXh0ZW5kUGFyYW1zKHtcbiAgICBwYWdpbmF0aW9uOiB7XG4gICAgICBlbDogbnVsbCxcbiAgICAgIGJ1bGxldEVsZW1lbnQ6ICdzcGFuJyxcbiAgICAgIGNsaWNrYWJsZTogZmFsc2UsXG4gICAgICBoaWRlT25DbGljazogZmFsc2UsXG4gICAgICByZW5kZXJCdWxsZXQ6IG51bGwsXG4gICAgICByZW5kZXJQcm9ncmVzc2JhcjogbnVsbCxcbiAgICAgIHJlbmRlckZyYWN0aW9uOiBudWxsLFxuICAgICAgcmVuZGVyQ3VzdG9tOiBudWxsLFxuICAgICAgcHJvZ3Jlc3NiYXJPcHBvc2l0ZTogZmFsc2UsXG4gICAgICB0eXBlOiAnYnVsbGV0cycsXG4gICAgICAvLyAnYnVsbGV0cycgb3IgJ3Byb2dyZXNzYmFyJyBvciAnZnJhY3Rpb24nIG9yICdjdXN0b20nXG4gICAgICBkeW5hbWljQnVsbGV0czogZmFsc2UsXG4gICAgICBkeW5hbWljTWFpbkJ1bGxldHM6IDEsXG4gICAgICBmb3JtYXRGcmFjdGlvbkN1cnJlbnQ6IG51bWJlciA9PiBudW1iZXIsXG4gICAgICBmb3JtYXRGcmFjdGlvblRvdGFsOiBudW1iZXIgPT4gbnVtYmVyLFxuICAgICAgYnVsbGV0Q2xhc3M6IGAke3BmeH0tYnVsbGV0YCxcbiAgICAgIGJ1bGxldEFjdGl2ZUNsYXNzOiBgJHtwZnh9LWJ1bGxldC1hY3RpdmVgLFxuICAgICAgbW9kaWZpZXJDbGFzczogYCR7cGZ4fS1gLFxuICAgICAgY3VycmVudENsYXNzOiBgJHtwZnh9LWN1cnJlbnRgLFxuICAgICAgdG90YWxDbGFzczogYCR7cGZ4fS10b3RhbGAsXG4gICAgICBoaWRkZW5DbGFzczogYCR7cGZ4fS1oaWRkZW5gLFxuICAgICAgcHJvZ3Jlc3NiYXJGaWxsQ2xhc3M6IGAke3BmeH0tcHJvZ3Jlc3NiYXItZmlsbGAsXG4gICAgICBwcm9ncmVzc2Jhck9wcG9zaXRlQ2xhc3M6IGAke3BmeH0tcHJvZ3Jlc3NiYXItb3Bwb3NpdGVgLFxuICAgICAgY2xpY2thYmxlQ2xhc3M6IGAke3BmeH0tY2xpY2thYmxlYCxcbiAgICAgIGxvY2tDbGFzczogYCR7cGZ4fS1sb2NrYCxcbiAgICAgIGhvcml6b250YWxDbGFzczogYCR7cGZ4fS1ob3Jpem9udGFsYCxcbiAgICAgIHZlcnRpY2FsQ2xhc3M6IGAke3BmeH0tdmVydGljYWxgLFxuICAgICAgcGFnaW5hdGlvbkRpc2FibGVkQ2xhc3M6IGAke3BmeH0tZGlzYWJsZWRgXG4gICAgfVxuICB9KTtcbiAgc3dpcGVyLnBhZ2luYXRpb24gPSB7XG4gICAgZWw6IG51bGwsXG4gICAgYnVsbGV0czogW11cbiAgfTtcbiAgbGV0IGJ1bGxldFNpemU7XG4gIGxldCBkeW5hbWljQnVsbGV0SW5kZXggPSAwO1xuICBjb25zdCBtYWtlRWxlbWVudHNBcnJheSA9IGVsID0+IChBcnJheS5pc0FycmF5KGVsKSA/IGVsIDogW2VsXSkuZmlsdGVyKGUgPT4gISFlKTtcbiAgZnVuY3Rpb24gaXNQYWdpbmF0aW9uRGlzYWJsZWQoKSB7XG4gICAgcmV0dXJuICFzd2lwZXIucGFyYW1zLnBhZ2luYXRpb24uZWwgfHwgIXN3aXBlci5wYWdpbmF0aW9uLmVsIHx8IEFycmF5LmlzQXJyYXkoc3dpcGVyLnBhZ2luYXRpb24uZWwpICYmIHN3aXBlci5wYWdpbmF0aW9uLmVsLmxlbmd0aCA9PT0gMDtcbiAgfVxuICBmdW5jdGlvbiBzZXRTaWRlQnVsbGV0cyhidWxsZXRFbCwgcG9zaXRpb24pIHtcbiAgICBjb25zdCB7XG4gICAgICBidWxsZXRBY3RpdmVDbGFzc1xuICAgIH0gPSBzd2lwZXIucGFyYW1zLnBhZ2luYXRpb247XG4gICAgaWYgKCFidWxsZXRFbCkgcmV0dXJuO1xuICAgIGJ1bGxldEVsID0gYnVsbGV0RWxbYCR7cG9zaXRpb24gPT09ICdwcmV2JyA/ICdwcmV2aW91cycgOiAnbmV4dCd9RWxlbWVudFNpYmxpbmdgXTtcbiAgICBpZiAoYnVsbGV0RWwpIHtcbiAgICAgIGJ1bGxldEVsLmNsYXNzTGlzdC5hZGQoYCR7YnVsbGV0QWN0aXZlQ2xhc3N9LSR7cG9zaXRpb259YCk7XG4gICAgICBidWxsZXRFbCA9IGJ1bGxldEVsW2Ake3Bvc2l0aW9uID09PSAncHJldicgPyAncHJldmlvdXMnIDogJ25leHQnfUVsZW1lbnRTaWJsaW5nYF07XG4gICAgICBpZiAoYnVsbGV0RWwpIHtcbiAgICAgICAgYnVsbGV0RWwuY2xhc3NMaXN0LmFkZChgJHtidWxsZXRBY3RpdmVDbGFzc30tJHtwb3NpdGlvbn0tJHtwb3NpdGlvbn1gKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gb25CdWxsZXRDbGljayhlKSB7XG4gICAgY29uc3QgYnVsbGV0RWwgPSBlLnRhcmdldC5jbG9zZXN0KGNsYXNzZXNUb1NlbGVjdG9yKHN3aXBlci5wYXJhbXMucGFnaW5hdGlvbi5idWxsZXRDbGFzcykpO1xuICAgIGlmICghYnVsbGV0RWwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0IGluZGV4ID0gZWxlbWVudEluZGV4KGJ1bGxldEVsKSAqIHN3aXBlci5wYXJhbXMuc2xpZGVzUGVyR3JvdXA7XG4gICAgaWYgKHN3aXBlci5wYXJhbXMubG9vcCkge1xuICAgICAgaWYgKHN3aXBlci5yZWFsSW5kZXggPT09IGluZGV4KSByZXR1cm47XG4gICAgICBzd2lwZXIuc2xpZGVUb0xvb3AoaW5kZXgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzd2lwZXIuc2xpZGVUbyhpbmRleCk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIHVwZGF0ZSgpIHtcbiAgICAvLyBSZW5kZXIgfHwgVXBkYXRlIFBhZ2luYXRpb24gYnVsbGV0cy9pdGVtc1xuICAgIGNvbnN0IHJ0bCA9IHN3aXBlci5ydGw7XG4gICAgY29uc3QgcGFyYW1zID0gc3dpcGVyLnBhcmFtcy5wYWdpbmF0aW9uO1xuICAgIGlmIChpc1BhZ2luYXRpb25EaXNhYmxlZCgpKSByZXR1cm47XG4gICAgbGV0IGVsID0gc3dpcGVyLnBhZ2luYXRpb24uZWw7XG4gICAgZWwgPSBtYWtlRWxlbWVudHNBcnJheShlbCk7XG4gICAgLy8gQ3VycmVudC9Ub3RhbFxuICAgIGxldCBjdXJyZW50O1xuICAgIGxldCBwcmV2aW91c0luZGV4O1xuICAgIGNvbnN0IHNsaWRlc0xlbmd0aCA9IHN3aXBlci52aXJ0dWFsICYmIHN3aXBlci5wYXJhbXMudmlydHVhbC5lbmFibGVkID8gc3dpcGVyLnZpcnR1YWwuc2xpZGVzLmxlbmd0aCA6IHN3aXBlci5zbGlkZXMubGVuZ3RoO1xuICAgIGNvbnN0IHRvdGFsID0gc3dpcGVyLnBhcmFtcy5sb29wID8gTWF0aC5jZWlsKHNsaWRlc0xlbmd0aCAvIHN3aXBlci5wYXJhbXMuc2xpZGVzUGVyR3JvdXApIDogc3dpcGVyLnNuYXBHcmlkLmxlbmd0aDtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5sb29wKSB7XG4gICAgICBwcmV2aW91c0luZGV4ID0gc3dpcGVyLnByZXZpb3VzUmVhbEluZGV4IHx8IDA7XG4gICAgICBjdXJyZW50ID0gc3dpcGVyLnBhcmFtcy5zbGlkZXNQZXJHcm91cCA+IDEgPyBNYXRoLmZsb29yKHN3aXBlci5yZWFsSW5kZXggLyBzd2lwZXIucGFyYW1zLnNsaWRlc1Blckdyb3VwKSA6IHN3aXBlci5yZWFsSW5kZXg7XG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygc3dpcGVyLnNuYXBJbmRleCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGN1cnJlbnQgPSBzd2lwZXIuc25hcEluZGV4O1xuICAgICAgcHJldmlvdXNJbmRleCA9IHN3aXBlci5wcmV2aW91c1NuYXBJbmRleDtcbiAgICB9IGVsc2Uge1xuICAgICAgcHJldmlvdXNJbmRleCA9IHN3aXBlci5wcmV2aW91c0luZGV4IHx8IDA7XG4gICAgICBjdXJyZW50ID0gc3dpcGVyLmFjdGl2ZUluZGV4IHx8IDA7XG4gICAgfVxuICAgIC8vIFR5cGVzXG4gICAgaWYgKHBhcmFtcy50eXBlID09PSAnYnVsbGV0cycgJiYgc3dpcGVyLnBhZ2luYXRpb24uYnVsbGV0cyAmJiBzd2lwZXIucGFnaW5hdGlvbi5idWxsZXRzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IGJ1bGxldHMgPSBzd2lwZXIucGFnaW5hdGlvbi5idWxsZXRzO1xuICAgICAgbGV0IGZpcnN0SW5kZXg7XG4gICAgICBsZXQgbGFzdEluZGV4O1xuICAgICAgbGV0IG1pZEluZGV4O1xuICAgICAgaWYgKHBhcmFtcy5keW5hbWljQnVsbGV0cykge1xuICAgICAgICBidWxsZXRTaXplID0gZWxlbWVudE91dGVyU2l6ZShidWxsZXRzWzBdLCBzd2lwZXIuaXNIb3Jpem9udGFsKCkgPyAnd2lkdGgnIDogJ2hlaWdodCcsIHRydWUpO1xuICAgICAgICBlbC5mb3JFYWNoKHN1YkVsID0+IHtcbiAgICAgICAgICBzdWJFbC5zdHlsZVtzd2lwZXIuaXNIb3Jpem9udGFsKCkgPyAnd2lkdGgnIDogJ2hlaWdodCddID0gYCR7YnVsbGV0U2l6ZSAqIChwYXJhbXMuZHluYW1pY01haW5CdWxsZXRzICsgNCl9cHhgO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHBhcmFtcy5keW5hbWljTWFpbkJ1bGxldHMgPiAxICYmIHByZXZpb3VzSW5kZXggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGR5bmFtaWNCdWxsZXRJbmRleCArPSBjdXJyZW50IC0gKHByZXZpb3VzSW5kZXggfHwgMCk7XG4gICAgICAgICAgaWYgKGR5bmFtaWNCdWxsZXRJbmRleCA+IHBhcmFtcy5keW5hbWljTWFpbkJ1bGxldHMgLSAxKSB7XG4gICAgICAgICAgICBkeW5hbWljQnVsbGV0SW5kZXggPSBwYXJhbXMuZHluYW1pY01haW5CdWxsZXRzIC0gMTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGR5bmFtaWNCdWxsZXRJbmRleCA8IDApIHtcbiAgICAgICAgICAgIGR5bmFtaWNCdWxsZXRJbmRleCA9IDA7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZpcnN0SW5kZXggPSBNYXRoLm1heChjdXJyZW50IC0gZHluYW1pY0J1bGxldEluZGV4LCAwKTtcbiAgICAgICAgbGFzdEluZGV4ID0gZmlyc3RJbmRleCArIChNYXRoLm1pbihidWxsZXRzLmxlbmd0aCwgcGFyYW1zLmR5bmFtaWNNYWluQnVsbGV0cykgLSAxKTtcbiAgICAgICAgbWlkSW5kZXggPSAobGFzdEluZGV4ICsgZmlyc3RJbmRleCkgLyAyO1xuICAgICAgfVxuICAgICAgYnVsbGV0cy5mb3JFYWNoKGJ1bGxldEVsID0+IHtcbiAgICAgICAgY29uc3QgY2xhc3Nlc1RvUmVtb3ZlID0gWy4uLlsnJywgJy1uZXh0JywgJy1uZXh0LW5leHQnLCAnLXByZXYnLCAnLXByZXYtcHJldicsICctbWFpbiddLm1hcChzdWZmaXggPT4gYCR7cGFyYW1zLmJ1bGxldEFjdGl2ZUNsYXNzfSR7c3VmZml4fWApXS5tYXAocyA9PiB0eXBlb2YgcyA9PT0gJ3N0cmluZycgJiYgcy5pbmNsdWRlcygnICcpID8gcy5zcGxpdCgnICcpIDogcykuZmxhdCgpO1xuICAgICAgICBidWxsZXRFbC5jbGFzc0xpc3QucmVtb3ZlKC4uLmNsYXNzZXNUb1JlbW92ZSk7XG4gICAgICB9KTtcbiAgICAgIGlmIChlbC5sZW5ndGggPiAxKSB7XG4gICAgICAgIGJ1bGxldHMuZm9yRWFjaChidWxsZXQgPT4ge1xuICAgICAgICAgIGNvbnN0IGJ1bGxldEluZGV4ID0gZWxlbWVudEluZGV4KGJ1bGxldCk7XG4gICAgICAgICAgaWYgKGJ1bGxldEluZGV4ID09PSBjdXJyZW50KSB7XG4gICAgICAgICAgICBidWxsZXQuY2xhc3NMaXN0LmFkZCguLi5wYXJhbXMuYnVsbGV0QWN0aXZlQ2xhc3Muc3BsaXQoJyAnKSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChzd2lwZXIuaXNFbGVtZW50KSB7XG4gICAgICAgICAgICBidWxsZXQuc2V0QXR0cmlidXRlKCdwYXJ0JywgJ2J1bGxldCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocGFyYW1zLmR5bmFtaWNCdWxsZXRzKSB7XG4gICAgICAgICAgICBpZiAoYnVsbGV0SW5kZXggPj0gZmlyc3RJbmRleCAmJiBidWxsZXRJbmRleCA8PSBsYXN0SW5kZXgpIHtcbiAgICAgICAgICAgICAgYnVsbGV0LmNsYXNzTGlzdC5hZGQoLi4uYCR7cGFyYW1zLmJ1bGxldEFjdGl2ZUNsYXNzfS1tYWluYC5zcGxpdCgnICcpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChidWxsZXRJbmRleCA9PT0gZmlyc3RJbmRleCkge1xuICAgICAgICAgICAgICBzZXRTaWRlQnVsbGV0cyhidWxsZXQsICdwcmV2Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYnVsbGV0SW5kZXggPT09IGxhc3RJbmRleCkge1xuICAgICAgICAgICAgICBzZXRTaWRlQnVsbGV0cyhidWxsZXQsICduZXh0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGJ1bGxldCA9IGJ1bGxldHNbY3VycmVudF07XG4gICAgICAgIGlmIChidWxsZXQpIHtcbiAgICAgICAgICBidWxsZXQuY2xhc3NMaXN0LmFkZCguLi5wYXJhbXMuYnVsbGV0QWN0aXZlQ2xhc3Muc3BsaXQoJyAnKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN3aXBlci5pc0VsZW1lbnQpIHtcbiAgICAgICAgICBidWxsZXRzLmZvckVhY2goKGJ1bGxldEVsLCBidWxsZXRJbmRleCkgPT4ge1xuICAgICAgICAgICAgYnVsbGV0RWwuc2V0QXR0cmlidXRlKCdwYXJ0JywgYnVsbGV0SW5kZXggPT09IGN1cnJlbnQgPyAnYnVsbGV0LWFjdGl2ZScgOiAnYnVsbGV0Jyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhcmFtcy5keW5hbWljQnVsbGV0cykge1xuICAgICAgICAgIGNvbnN0IGZpcnN0RGlzcGxheWVkQnVsbGV0ID0gYnVsbGV0c1tmaXJzdEluZGV4XTtcbiAgICAgICAgICBjb25zdCBsYXN0RGlzcGxheWVkQnVsbGV0ID0gYnVsbGV0c1tsYXN0SW5kZXhdO1xuICAgICAgICAgIGZvciAobGV0IGkgPSBmaXJzdEluZGV4OyBpIDw9IGxhc3RJbmRleDsgaSArPSAxKSB7XG4gICAgICAgICAgICBpZiAoYnVsbGV0c1tpXSkge1xuICAgICAgICAgICAgICBidWxsZXRzW2ldLmNsYXNzTGlzdC5hZGQoLi4uYCR7cGFyYW1zLmJ1bGxldEFjdGl2ZUNsYXNzfS1tYWluYC5zcGxpdCgnICcpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgc2V0U2lkZUJ1bGxldHMoZmlyc3REaXNwbGF5ZWRCdWxsZXQsICdwcmV2Jyk7XG4gICAgICAgICAgc2V0U2lkZUJ1bGxldHMobGFzdERpc3BsYXllZEJ1bGxldCwgJ25leHQnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHBhcmFtcy5keW5hbWljQnVsbGV0cykge1xuICAgICAgICBjb25zdCBkeW5hbWljQnVsbGV0c0xlbmd0aCA9IE1hdGgubWluKGJ1bGxldHMubGVuZ3RoLCBwYXJhbXMuZHluYW1pY01haW5CdWxsZXRzICsgNCk7XG4gICAgICAgIGNvbnN0IGJ1bGxldHNPZmZzZXQgPSAoYnVsbGV0U2l6ZSAqIGR5bmFtaWNCdWxsZXRzTGVuZ3RoIC0gYnVsbGV0U2l6ZSkgLyAyIC0gbWlkSW5kZXggKiBidWxsZXRTaXplO1xuICAgICAgICBjb25zdCBvZmZzZXRQcm9wID0gcnRsID8gJ3JpZ2h0JyA6ICdsZWZ0JztcbiAgICAgICAgYnVsbGV0cy5mb3JFYWNoKGJ1bGxldCA9PiB7XG4gICAgICAgICAgYnVsbGV0LnN0eWxlW3N3aXBlci5pc0hvcml6b250YWwoKSA/IG9mZnNldFByb3AgOiAndG9wJ10gPSBgJHtidWxsZXRzT2Zmc2V0fXB4YDtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGVsLmZvckVhY2goKHN1YkVsLCBzdWJFbEluZGV4KSA9PiB7XG4gICAgICBpZiAocGFyYW1zLnR5cGUgPT09ICdmcmFjdGlvbicpIHtcbiAgICAgICAgc3ViRWwucXVlcnlTZWxlY3RvckFsbChjbGFzc2VzVG9TZWxlY3RvcihwYXJhbXMuY3VycmVudENsYXNzKSkuZm9yRWFjaChmcmFjdGlvbkVsID0+IHtcbiAgICAgICAgICBmcmFjdGlvbkVsLnRleHRDb250ZW50ID0gcGFyYW1zLmZvcm1hdEZyYWN0aW9uQ3VycmVudChjdXJyZW50ICsgMSk7XG4gICAgICAgIH0pO1xuICAgICAgICBzdWJFbC5xdWVyeVNlbGVjdG9yQWxsKGNsYXNzZXNUb1NlbGVjdG9yKHBhcmFtcy50b3RhbENsYXNzKSkuZm9yRWFjaCh0b3RhbEVsID0+IHtcbiAgICAgICAgICB0b3RhbEVsLnRleHRDb250ZW50ID0gcGFyYW1zLmZvcm1hdEZyYWN0aW9uVG90YWwodG90YWwpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChwYXJhbXMudHlwZSA9PT0gJ3Byb2dyZXNzYmFyJykge1xuICAgICAgICBsZXQgcHJvZ3Jlc3NiYXJEaXJlY3Rpb247XG4gICAgICAgIGlmIChwYXJhbXMucHJvZ3Jlc3NiYXJPcHBvc2l0ZSkge1xuICAgICAgICAgIHByb2dyZXNzYmFyRGlyZWN0aW9uID0gc3dpcGVyLmlzSG9yaXpvbnRhbCgpID8gJ3ZlcnRpY2FsJyA6ICdob3Jpem9udGFsJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwcm9ncmVzc2JhckRpcmVjdGlvbiA9IHN3aXBlci5pc0hvcml6b250YWwoKSA/ICdob3Jpem9udGFsJyA6ICd2ZXJ0aWNhbCc7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc2NhbGUgPSAoY3VycmVudCArIDEpIC8gdG90YWw7XG4gICAgICAgIGxldCBzY2FsZVggPSAxO1xuICAgICAgICBsZXQgc2NhbGVZID0gMTtcbiAgICAgICAgaWYgKHByb2dyZXNzYmFyRGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgICAgICBzY2FsZVggPSBzY2FsZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzY2FsZVkgPSBzY2FsZTtcbiAgICAgICAgfVxuICAgICAgICBzdWJFbC5xdWVyeVNlbGVjdG9yQWxsKGNsYXNzZXNUb1NlbGVjdG9yKHBhcmFtcy5wcm9ncmVzc2JhckZpbGxDbGFzcykpLmZvckVhY2gocHJvZ3Jlc3NFbCA9PiB7XG4gICAgICAgICAgcHJvZ3Jlc3NFbC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlM2QoMCwwLDApIHNjYWxlWCgke3NjYWxlWH0pIHNjYWxlWSgke3NjYWxlWX0pYDtcbiAgICAgICAgICBwcm9ncmVzc0VsLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IGAke3N3aXBlci5wYXJhbXMuc3BlZWR9bXNgO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChwYXJhbXMudHlwZSA9PT0gJ2N1c3RvbScgJiYgcGFyYW1zLnJlbmRlckN1c3RvbSkge1xuICAgICAgICBzdWJFbC5pbm5lckhUTUwgPSBwYXJhbXMucmVuZGVyQ3VzdG9tKHN3aXBlciwgY3VycmVudCArIDEsIHRvdGFsKTtcbiAgICAgICAgaWYgKHN1YkVsSW5kZXggPT09IDApIGVtaXQoJ3BhZ2luYXRpb25SZW5kZXInLCBzdWJFbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoc3ViRWxJbmRleCA9PT0gMCkgZW1pdCgncGFnaW5hdGlvblJlbmRlcicsIHN1YkVsKTtcbiAgICAgICAgZW1pdCgncGFnaW5hdGlvblVwZGF0ZScsIHN1YkVsKTtcbiAgICAgIH1cbiAgICAgIGlmIChzd2lwZXIucGFyYW1zLndhdGNoT3ZlcmZsb3cgJiYgc3dpcGVyLmVuYWJsZWQpIHtcbiAgICAgICAgc3ViRWwuY2xhc3NMaXN0W3N3aXBlci5pc0xvY2tlZCA/ICdhZGQnIDogJ3JlbW92ZSddKHBhcmFtcy5sb2NrQ2xhc3MpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAvLyBSZW5kZXIgQ29udGFpbmVyXG4gICAgY29uc3QgcGFyYW1zID0gc3dpcGVyLnBhcmFtcy5wYWdpbmF0aW9uO1xuICAgIGlmIChpc1BhZ2luYXRpb25EaXNhYmxlZCgpKSByZXR1cm47XG4gICAgY29uc3Qgc2xpZGVzTGVuZ3RoID0gc3dpcGVyLnZpcnR1YWwgJiYgc3dpcGVyLnBhcmFtcy52aXJ0dWFsLmVuYWJsZWQgPyBzd2lwZXIudmlydHVhbC5zbGlkZXMubGVuZ3RoIDogc3dpcGVyLmdyaWQgJiYgc3dpcGVyLnBhcmFtcy5ncmlkLnJvd3MgPiAxID8gc3dpcGVyLnNsaWRlcy5sZW5ndGggLyBNYXRoLmNlaWwoc3dpcGVyLnBhcmFtcy5ncmlkLnJvd3MpIDogc3dpcGVyLnNsaWRlcy5sZW5ndGg7XG4gICAgbGV0IGVsID0gc3dpcGVyLnBhZ2luYXRpb24uZWw7XG4gICAgZWwgPSBtYWtlRWxlbWVudHNBcnJheShlbCk7XG4gICAgbGV0IHBhZ2luYXRpb25IVE1MID0gJyc7XG4gICAgaWYgKHBhcmFtcy50eXBlID09PSAnYnVsbGV0cycpIHtcbiAgICAgIGxldCBudW1iZXJPZkJ1bGxldHMgPSBzd2lwZXIucGFyYW1zLmxvb3AgPyBNYXRoLmNlaWwoc2xpZGVzTGVuZ3RoIC8gc3dpcGVyLnBhcmFtcy5zbGlkZXNQZXJHcm91cCkgOiBzd2lwZXIuc25hcEdyaWQubGVuZ3RoO1xuICAgICAgaWYgKHN3aXBlci5wYXJhbXMuZnJlZU1vZGUgJiYgc3dpcGVyLnBhcmFtcy5mcmVlTW9kZS5lbmFibGVkICYmIG51bWJlck9mQnVsbGV0cyA+IHNsaWRlc0xlbmd0aCkge1xuICAgICAgICBudW1iZXJPZkJ1bGxldHMgPSBzbGlkZXNMZW5ndGg7XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bWJlck9mQnVsbGV0czsgaSArPSAxKSB7XG4gICAgICAgIGlmIChwYXJhbXMucmVuZGVyQnVsbGV0KSB7XG4gICAgICAgICAgcGFnaW5hdGlvbkhUTUwgKz0gcGFyYW1zLnJlbmRlckJ1bGxldC5jYWxsKHN3aXBlciwgaSwgcGFyYW1zLmJ1bGxldENsYXNzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBwcmV0dGllci1pZ25vcmVcbiAgICAgICAgICBwYWdpbmF0aW9uSFRNTCArPSBgPCR7cGFyYW1zLmJ1bGxldEVsZW1lbnR9ICR7c3dpcGVyLmlzRWxlbWVudCA/ICdwYXJ0PVwiYnVsbGV0XCInIDogJyd9IGNsYXNzPVwiJHtwYXJhbXMuYnVsbGV0Q2xhc3N9XCI+PC8ke3BhcmFtcy5idWxsZXRFbGVtZW50fT5gO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwYXJhbXMudHlwZSA9PT0gJ2ZyYWN0aW9uJykge1xuICAgICAgaWYgKHBhcmFtcy5yZW5kZXJGcmFjdGlvbikge1xuICAgICAgICBwYWdpbmF0aW9uSFRNTCA9IHBhcmFtcy5yZW5kZXJGcmFjdGlvbi5jYWxsKHN3aXBlciwgcGFyYW1zLmN1cnJlbnRDbGFzcywgcGFyYW1zLnRvdGFsQ2xhc3MpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFnaW5hdGlvbkhUTUwgPSBgPHNwYW4gY2xhc3M9XCIke3BhcmFtcy5jdXJyZW50Q2xhc3N9XCI+PC9zcGFuPmAgKyAnIC8gJyArIGA8c3BhbiBjbGFzcz1cIiR7cGFyYW1zLnRvdGFsQ2xhc3N9XCI+PC9zcGFuPmA7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwYXJhbXMudHlwZSA9PT0gJ3Byb2dyZXNzYmFyJykge1xuICAgICAgaWYgKHBhcmFtcy5yZW5kZXJQcm9ncmVzc2Jhcikge1xuICAgICAgICBwYWdpbmF0aW9uSFRNTCA9IHBhcmFtcy5yZW5kZXJQcm9ncmVzc2Jhci5jYWxsKHN3aXBlciwgcGFyYW1zLnByb2dyZXNzYmFyRmlsbENsYXNzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhZ2luYXRpb25IVE1MID0gYDxzcGFuIGNsYXNzPVwiJHtwYXJhbXMucHJvZ3Jlc3NiYXJGaWxsQ2xhc3N9XCI+PC9zcGFuPmA7XG4gICAgICB9XG4gICAgfVxuICAgIHN3aXBlci5wYWdpbmF0aW9uLmJ1bGxldHMgPSBbXTtcbiAgICBlbC5mb3JFYWNoKHN1YkVsID0+IHtcbiAgICAgIGlmIChwYXJhbXMudHlwZSAhPT0gJ2N1c3RvbScpIHtcbiAgICAgICAgc3ViRWwuaW5uZXJIVE1MID0gcGFnaW5hdGlvbkhUTUwgfHwgJyc7XG4gICAgICB9XG4gICAgICBpZiAocGFyYW1zLnR5cGUgPT09ICdidWxsZXRzJykge1xuICAgICAgICBzd2lwZXIucGFnaW5hdGlvbi5idWxsZXRzLnB1c2goLi4uc3ViRWwucXVlcnlTZWxlY3RvckFsbChjbGFzc2VzVG9TZWxlY3RvcihwYXJhbXMuYnVsbGV0Q2xhc3MpKSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHBhcmFtcy50eXBlICE9PSAnY3VzdG9tJykge1xuICAgICAgZW1pdCgncGFnaW5hdGlvblJlbmRlcicsIGVsWzBdKTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBzd2lwZXIucGFyYW1zLnBhZ2luYXRpb24gPSBjcmVhdGVFbGVtZW50SWZOb3REZWZpbmVkKHN3aXBlciwgc3dpcGVyLm9yaWdpbmFsUGFyYW1zLnBhZ2luYXRpb24sIHN3aXBlci5wYXJhbXMucGFnaW5hdGlvbiwge1xuICAgICAgZWw6ICdzd2lwZXItcGFnaW5hdGlvbidcbiAgICB9KTtcbiAgICBjb25zdCBwYXJhbXMgPSBzd2lwZXIucGFyYW1zLnBhZ2luYXRpb247XG4gICAgaWYgKCFwYXJhbXMuZWwpIHJldHVybjtcbiAgICBsZXQgZWw7XG4gICAgaWYgKHR5cGVvZiBwYXJhbXMuZWwgPT09ICdzdHJpbmcnICYmIHN3aXBlci5pc0VsZW1lbnQpIHtcbiAgICAgIGVsID0gc3dpcGVyLmVsLnF1ZXJ5U2VsZWN0b3IocGFyYW1zLmVsKTtcbiAgICB9XG4gICAgaWYgKCFlbCAmJiB0eXBlb2YgcGFyYW1zLmVsID09PSAnc3RyaW5nJykge1xuICAgICAgZWwgPSBbLi4uZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChwYXJhbXMuZWwpXTtcbiAgICB9XG4gICAgaWYgKCFlbCkge1xuICAgICAgZWwgPSBwYXJhbXMuZWw7XG4gICAgfVxuICAgIGlmICghZWwgfHwgZWwubGVuZ3RoID09PSAwKSByZXR1cm47XG4gICAgaWYgKHN3aXBlci5wYXJhbXMudW5pcXVlTmF2RWxlbWVudHMgJiYgdHlwZW9mIHBhcmFtcy5lbCA9PT0gJ3N0cmluZycgJiYgQXJyYXkuaXNBcnJheShlbCkgJiYgZWwubGVuZ3RoID4gMSkge1xuICAgICAgZWwgPSBbLi4uc3dpcGVyLmVsLnF1ZXJ5U2VsZWN0b3JBbGwocGFyYW1zLmVsKV07XG4gICAgICAvLyBjaGVjayBpZiBpdCBiZWxvbmdzIHRvIGFub3RoZXIgbmVzdGVkIFN3aXBlclxuICAgICAgaWYgKGVsLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZWwgPSBlbC5maWx0ZXIoc3ViRWwgPT4ge1xuICAgICAgICAgIGlmIChlbGVtZW50UGFyZW50cyhzdWJFbCwgJy5zd2lwZXInKVswXSAhPT0gc3dpcGVyLmVsKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0pWzBdO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoQXJyYXkuaXNBcnJheShlbCkgJiYgZWwubGVuZ3RoID09PSAxKSBlbCA9IGVsWzBdO1xuICAgIE9iamVjdC5hc3NpZ24oc3dpcGVyLnBhZ2luYXRpb24sIHtcbiAgICAgIGVsXG4gICAgfSk7XG4gICAgZWwgPSBtYWtlRWxlbWVudHNBcnJheShlbCk7XG4gICAgZWwuZm9yRWFjaChzdWJFbCA9PiB7XG4gICAgICBpZiAocGFyYW1zLnR5cGUgPT09ICdidWxsZXRzJyAmJiBwYXJhbXMuY2xpY2thYmxlKSB7XG4gICAgICAgIHN1YkVsLmNsYXNzTGlzdC5hZGQoLi4uKHBhcmFtcy5jbGlja2FibGVDbGFzcyB8fCAnJykuc3BsaXQoJyAnKSk7XG4gICAgICB9XG4gICAgICBzdWJFbC5jbGFzc0xpc3QuYWRkKHBhcmFtcy5tb2RpZmllckNsYXNzICsgcGFyYW1zLnR5cGUpO1xuICAgICAgc3ViRWwuY2xhc3NMaXN0LmFkZChzd2lwZXIuaXNIb3Jpem9udGFsKCkgPyBwYXJhbXMuaG9yaXpvbnRhbENsYXNzIDogcGFyYW1zLnZlcnRpY2FsQ2xhc3MpO1xuICAgICAgaWYgKHBhcmFtcy50eXBlID09PSAnYnVsbGV0cycgJiYgcGFyYW1zLmR5bmFtaWNCdWxsZXRzKSB7XG4gICAgICAgIHN1YkVsLmNsYXNzTGlzdC5hZGQoYCR7cGFyYW1zLm1vZGlmaWVyQ2xhc3N9JHtwYXJhbXMudHlwZX0tZHluYW1pY2ApO1xuICAgICAgICBkeW5hbWljQnVsbGV0SW5kZXggPSAwO1xuICAgICAgICBpZiAocGFyYW1zLmR5bmFtaWNNYWluQnVsbGV0cyA8IDEpIHtcbiAgICAgICAgICBwYXJhbXMuZHluYW1pY01haW5CdWxsZXRzID0gMTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHBhcmFtcy50eXBlID09PSAncHJvZ3Jlc3NiYXInICYmIHBhcmFtcy5wcm9ncmVzc2Jhck9wcG9zaXRlKSB7XG4gICAgICAgIHN1YkVsLmNsYXNzTGlzdC5hZGQocGFyYW1zLnByb2dyZXNzYmFyT3Bwb3NpdGVDbGFzcyk7XG4gICAgICB9XG4gICAgICBpZiAocGFyYW1zLmNsaWNrYWJsZSkge1xuICAgICAgICBzdWJFbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uQnVsbGV0Q2xpY2spO1xuICAgICAgfVxuICAgICAgaWYgKCFzd2lwZXIuZW5hYmxlZCkge1xuICAgICAgICBzdWJFbC5jbGFzc0xpc3QuYWRkKHBhcmFtcy5sb2NrQ2xhc3MpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgY29uc3QgcGFyYW1zID0gc3dpcGVyLnBhcmFtcy5wYWdpbmF0aW9uO1xuICAgIGlmIChpc1BhZ2luYXRpb25EaXNhYmxlZCgpKSByZXR1cm47XG4gICAgbGV0IGVsID0gc3dpcGVyLnBhZ2luYXRpb24uZWw7XG4gICAgaWYgKGVsKSB7XG4gICAgICBlbCA9IG1ha2VFbGVtZW50c0FycmF5KGVsKTtcbiAgICAgIGVsLmZvckVhY2goc3ViRWwgPT4ge1xuICAgICAgICBzdWJFbC5jbGFzc0xpc3QucmVtb3ZlKHBhcmFtcy5oaWRkZW5DbGFzcyk7XG4gICAgICAgIHN1YkVsLmNsYXNzTGlzdC5yZW1vdmUocGFyYW1zLm1vZGlmaWVyQ2xhc3MgKyBwYXJhbXMudHlwZSk7XG4gICAgICAgIHN1YkVsLmNsYXNzTGlzdC5yZW1vdmUoc3dpcGVyLmlzSG9yaXpvbnRhbCgpID8gcGFyYW1zLmhvcml6b250YWxDbGFzcyA6IHBhcmFtcy52ZXJ0aWNhbENsYXNzKTtcbiAgICAgICAgaWYgKHBhcmFtcy5jbGlja2FibGUpIHtcbiAgICAgICAgICBzdWJFbC5jbGFzc0xpc3QucmVtb3ZlKC4uLihwYXJhbXMuY2xpY2thYmxlQ2xhc3MgfHwgJycpLnNwbGl0KCcgJykpO1xuICAgICAgICAgIHN1YkVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25CdWxsZXRDbGljayk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoc3dpcGVyLnBhZ2luYXRpb24uYnVsbGV0cykgc3dpcGVyLnBhZ2luYXRpb24uYnVsbGV0cy5mb3JFYWNoKHN1YkVsID0+IHN1YkVsLmNsYXNzTGlzdC5yZW1vdmUoLi4ucGFyYW1zLmJ1bGxldEFjdGl2ZUNsYXNzLnNwbGl0KCcgJykpKTtcbiAgfVxuICBvbignY2hhbmdlRGlyZWN0aW9uJywgKCkgPT4ge1xuICAgIGlmICghc3dpcGVyLnBhZ2luYXRpb24gfHwgIXN3aXBlci5wYWdpbmF0aW9uLmVsKSByZXR1cm47XG4gICAgY29uc3QgcGFyYW1zID0gc3dpcGVyLnBhcmFtcy5wYWdpbmF0aW9uO1xuICAgIGxldCB7XG4gICAgICBlbFxuICAgIH0gPSBzd2lwZXIucGFnaW5hdGlvbjtcbiAgICBlbCA9IG1ha2VFbGVtZW50c0FycmF5KGVsKTtcbiAgICBlbC5mb3JFYWNoKHN1YkVsID0+IHtcbiAgICAgIHN1YkVsLmNsYXNzTGlzdC5yZW1vdmUocGFyYW1zLmhvcml6b250YWxDbGFzcywgcGFyYW1zLnZlcnRpY2FsQ2xhc3MpO1xuICAgICAgc3ViRWwuY2xhc3NMaXN0LmFkZChzd2lwZXIuaXNIb3Jpem9udGFsKCkgPyBwYXJhbXMuaG9yaXpvbnRhbENsYXNzIDogcGFyYW1zLnZlcnRpY2FsQ2xhc3MpO1xuICAgIH0pO1xuICB9KTtcbiAgb24oJ2luaXQnLCAoKSA9PiB7XG4gICAgaWYgKHN3aXBlci5wYXJhbXMucGFnaW5hdGlvbi5lbmFibGVkID09PSBmYWxzZSkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgICBkaXNhYmxlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGluaXQoKTtcbiAgICAgIHJlbmRlcigpO1xuICAgICAgdXBkYXRlKCk7XG4gICAgfVxuICB9KTtcbiAgb24oJ2FjdGl2ZUluZGV4Q2hhbmdlJywgKCkgPT4ge1xuICAgIGlmICh0eXBlb2Ygc3dpcGVyLnNuYXBJbmRleCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHVwZGF0ZSgpO1xuICAgIH1cbiAgfSk7XG4gIG9uKCdzbmFwSW5kZXhDaGFuZ2UnLCAoKSA9PiB7XG4gICAgdXBkYXRlKCk7XG4gIH0pO1xuICBvbignc25hcEdyaWRMZW5ndGhDaGFuZ2UnLCAoKSA9PiB7XG4gICAgcmVuZGVyKCk7XG4gICAgdXBkYXRlKCk7XG4gIH0pO1xuICBvbignZGVzdHJveScsICgpID0+IHtcbiAgICBkZXN0cm95KCk7XG4gIH0pO1xuICBvbignZW5hYmxlIGRpc2FibGUnLCAoKSA9PiB7XG4gICAgbGV0IHtcbiAgICAgIGVsXG4gICAgfSA9IHN3aXBlci5wYWdpbmF0aW9uO1xuICAgIGlmIChlbCkge1xuICAgICAgZWwgPSBtYWtlRWxlbWVudHNBcnJheShlbCk7XG4gICAgICBlbC5mb3JFYWNoKHN1YkVsID0+IHN1YkVsLmNsYXNzTGlzdFtzd2lwZXIuZW5hYmxlZCA/ICdyZW1vdmUnIDogJ2FkZCddKHN3aXBlci5wYXJhbXMucGFnaW5hdGlvbi5sb2NrQ2xhc3MpKTtcbiAgICB9XG4gIH0pO1xuICBvbignbG9jayB1bmxvY2snLCAoKSA9PiB7XG4gICAgdXBkYXRlKCk7XG4gIH0pO1xuICBvbignY2xpY2snLCAoX3MsIGUpID0+IHtcbiAgICBjb25zdCB0YXJnZXRFbCA9IGUudGFyZ2V0O1xuICAgIGNvbnN0IGVsID0gbWFrZUVsZW1lbnRzQXJyYXkoc3dpcGVyLnBhZ2luYXRpb24uZWwpO1xuICAgIGlmIChzd2lwZXIucGFyYW1zLnBhZ2luYXRpb24uZWwgJiYgc3dpcGVyLnBhcmFtcy5wYWdpbmF0aW9uLmhpZGVPbkNsaWNrICYmIGVsICYmIGVsLmxlbmd0aCA+IDAgJiYgIXRhcmdldEVsLmNsYXNzTGlzdC5jb250YWlucyhzd2lwZXIucGFyYW1zLnBhZ2luYXRpb24uYnVsbGV0Q2xhc3MpKSB7XG4gICAgICBpZiAoc3dpcGVyLm5hdmlnYXRpb24gJiYgKHN3aXBlci5uYXZpZ2F0aW9uLm5leHRFbCAmJiB0YXJnZXRFbCA9PT0gc3dpcGVyLm5hdmlnYXRpb24ubmV4dEVsIHx8IHN3aXBlci5uYXZpZ2F0aW9uLnByZXZFbCAmJiB0YXJnZXRFbCA9PT0gc3dpcGVyLm5hdmlnYXRpb24ucHJldkVsKSkgcmV0dXJuO1xuICAgICAgY29uc3QgaXNIaWRkZW4gPSBlbFswXS5jbGFzc0xpc3QuY29udGFpbnMoc3dpcGVyLnBhcmFtcy5wYWdpbmF0aW9uLmhpZGRlbkNsYXNzKTtcbiAgICAgIGlmIChpc0hpZGRlbiA9PT0gdHJ1ZSkge1xuICAgICAgICBlbWl0KCdwYWdpbmF0aW9uU2hvdycpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZW1pdCgncGFnaW5hdGlvbkhpZGUnKTtcbiAgICAgIH1cbiAgICAgIGVsLmZvckVhY2goc3ViRWwgPT4gc3ViRWwuY2xhc3NMaXN0LnRvZ2dsZShzd2lwZXIucGFyYW1zLnBhZ2luYXRpb24uaGlkZGVuQ2xhc3MpKTtcbiAgICB9XG4gIH0pO1xuICBjb25zdCBlbmFibGUgPSAoKSA9PiB7XG4gICAgc3dpcGVyLmVsLmNsYXNzTGlzdC5yZW1vdmUoc3dpcGVyLnBhcmFtcy5wYWdpbmF0aW9uLnBhZ2luYXRpb25EaXNhYmxlZENsYXNzKTtcbiAgICBsZXQge1xuICAgICAgZWxcbiAgICB9ID0gc3dpcGVyLnBhZ2luYXRpb247XG4gICAgaWYgKGVsKSB7XG4gICAgICBlbCA9IG1ha2VFbGVtZW50c0FycmF5KGVsKTtcbiAgICAgIGVsLmZvckVhY2goc3ViRWwgPT4gc3ViRWwuY2xhc3NMaXN0LnJlbW92ZShzd2lwZXIucGFyYW1zLnBhZ2luYXRpb24ucGFnaW5hdGlvbkRpc2FibGVkQ2xhc3MpKTtcbiAgICB9XG4gICAgaW5pdCgpO1xuICAgIHJlbmRlcigpO1xuICAgIHVwZGF0ZSgpO1xuICB9O1xuICBjb25zdCBkaXNhYmxlID0gKCkgPT4ge1xuICAgIHN3aXBlci5lbC5jbGFzc0xpc3QuYWRkKHN3aXBlci5wYXJhbXMucGFnaW5hdGlvbi5wYWdpbmF0aW9uRGlzYWJsZWRDbGFzcyk7XG4gICAgbGV0IHtcbiAgICAgIGVsXG4gICAgfSA9IHN3aXBlci5wYWdpbmF0aW9uO1xuICAgIGlmIChlbCkge1xuICAgICAgZWwgPSBtYWtlRWxlbWVudHNBcnJheShlbCk7XG4gICAgICBlbC5mb3JFYWNoKHN1YkVsID0+IHN1YkVsLmNsYXNzTGlzdC5hZGQoc3dpcGVyLnBhcmFtcy5wYWdpbmF0aW9uLnBhZ2luYXRpb25EaXNhYmxlZENsYXNzKSk7XG4gICAgfVxuICAgIGRlc3Ryb3koKTtcbiAgfTtcbiAgT2JqZWN0LmFzc2lnbihzd2lwZXIucGFnaW5hdGlvbiwge1xuICAgIGVuYWJsZSxcbiAgICBkaXNhYmxlLFxuICAgIHJlbmRlcixcbiAgICB1cGRhdGUsXG4gICAgaW5pdCxcbiAgICBkZXN0cm95XG4gIH0pO1xufVxuXG5leHBvcnQgeyBQYWdpbmF0aW9uIGFzIGRlZmF1bHQgfTtcbiIsImltcG9ydCB7IGcgYXMgZ2V0RG9jdW1lbnQgfSBmcm9tICcuLi9zaGFyZWQvc3NyLXdpbmRvdy5lc20ubWpzJztcbmltcG9ydCB7IGggYXMgY2xhc3Nlc1RvVG9rZW5zLCBjIGFzIGNyZWF0ZUVsZW1lbnQsIG4gYXMgbmV4dFRpY2ssIGIgYXMgZWxlbWVudE9mZnNldCB9IGZyb20gJy4uL3NoYXJlZC91dGlscy5tanMnO1xuaW1wb3J0IHsgYyBhcyBjcmVhdGVFbGVtZW50SWZOb3REZWZpbmVkIH0gZnJvbSAnLi4vc2hhcmVkL2NyZWF0ZS1lbGVtZW50LWlmLW5vdC1kZWZpbmVkLm1qcyc7XG5pbXBvcnQgeyBjIGFzIGNsYXNzZXNUb1NlbGVjdG9yIH0gZnJvbSAnLi4vc2hhcmVkL2NsYXNzZXMtdG8tc2VsZWN0b3IubWpzJztcblxuZnVuY3Rpb24gU2Nyb2xsYmFyKF9yZWYpIHtcbiAgbGV0IHtcbiAgICBzd2lwZXIsXG4gICAgZXh0ZW5kUGFyYW1zLFxuICAgIG9uLFxuICAgIGVtaXRcbiAgfSA9IF9yZWY7XG4gIGNvbnN0IGRvY3VtZW50ID0gZ2V0RG9jdW1lbnQoKTtcbiAgbGV0IGlzVG91Y2hlZCA9IGZhbHNlO1xuICBsZXQgdGltZW91dCA9IG51bGw7XG4gIGxldCBkcmFnVGltZW91dCA9IG51bGw7XG4gIGxldCBkcmFnU3RhcnRQb3M7XG4gIGxldCBkcmFnU2l6ZTtcbiAgbGV0IHRyYWNrU2l6ZTtcbiAgbGV0IGRpdmlkZXI7XG4gIGV4dGVuZFBhcmFtcyh7XG4gICAgc2Nyb2xsYmFyOiB7XG4gICAgICBlbDogbnVsbCxcbiAgICAgIGRyYWdTaXplOiAnYXV0bycsXG4gICAgICBoaWRlOiBmYWxzZSxcbiAgICAgIGRyYWdnYWJsZTogZmFsc2UsXG4gICAgICBzbmFwT25SZWxlYXNlOiB0cnVlLFxuICAgICAgbG9ja0NsYXNzOiAnc3dpcGVyLXNjcm9sbGJhci1sb2NrJyxcbiAgICAgIGRyYWdDbGFzczogJ3N3aXBlci1zY3JvbGxiYXItZHJhZycsXG4gICAgICBzY3JvbGxiYXJEaXNhYmxlZENsYXNzOiAnc3dpcGVyLXNjcm9sbGJhci1kaXNhYmxlZCcsXG4gICAgICBob3Jpem9udGFsQ2xhc3M6IGBzd2lwZXItc2Nyb2xsYmFyLWhvcml6b250YWxgLFxuICAgICAgdmVydGljYWxDbGFzczogYHN3aXBlci1zY3JvbGxiYXItdmVydGljYWxgXG4gICAgfVxuICB9KTtcbiAgc3dpcGVyLnNjcm9sbGJhciA9IHtcbiAgICBlbDogbnVsbCxcbiAgICBkcmFnRWw6IG51bGxcbiAgfTtcbiAgZnVuY3Rpb24gc2V0VHJhbnNsYXRlKCkge1xuICAgIGlmICghc3dpcGVyLnBhcmFtcy5zY3JvbGxiYXIuZWwgfHwgIXN3aXBlci5zY3JvbGxiYXIuZWwpIHJldHVybjtcbiAgICBjb25zdCB7XG4gICAgICBzY3JvbGxiYXIsXG4gICAgICBydGxUcmFuc2xhdGU6IHJ0bFxuICAgIH0gPSBzd2lwZXI7XG4gICAgY29uc3Qge1xuICAgICAgZHJhZ0VsLFxuICAgICAgZWxcbiAgICB9ID0gc2Nyb2xsYmFyO1xuICAgIGNvbnN0IHBhcmFtcyA9IHN3aXBlci5wYXJhbXMuc2Nyb2xsYmFyO1xuICAgIGNvbnN0IHByb2dyZXNzID0gc3dpcGVyLnBhcmFtcy5sb29wID8gc3dpcGVyLnByb2dyZXNzTG9vcCA6IHN3aXBlci5wcm9ncmVzcztcbiAgICBsZXQgbmV3U2l6ZSA9IGRyYWdTaXplO1xuICAgIGxldCBuZXdQb3MgPSAodHJhY2tTaXplIC0gZHJhZ1NpemUpICogcHJvZ3Jlc3M7XG4gICAgaWYgKHJ0bCkge1xuICAgICAgbmV3UG9zID0gLW5ld1BvcztcbiAgICAgIGlmIChuZXdQb3MgPiAwKSB7XG4gICAgICAgIG5ld1NpemUgPSBkcmFnU2l6ZSAtIG5ld1BvcztcbiAgICAgICAgbmV3UG9zID0gMDtcbiAgICAgIH0gZWxzZSBpZiAoLW5ld1BvcyArIGRyYWdTaXplID4gdHJhY2tTaXplKSB7XG4gICAgICAgIG5ld1NpemUgPSB0cmFja1NpemUgKyBuZXdQb3M7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChuZXdQb3MgPCAwKSB7XG4gICAgICBuZXdTaXplID0gZHJhZ1NpemUgKyBuZXdQb3M7XG4gICAgICBuZXdQb3MgPSAwO1xuICAgIH0gZWxzZSBpZiAobmV3UG9zICsgZHJhZ1NpemUgPiB0cmFja1NpemUpIHtcbiAgICAgIG5ld1NpemUgPSB0cmFja1NpemUgLSBuZXdQb3M7XG4gICAgfVxuICAgIGlmIChzd2lwZXIuaXNIb3Jpem9udGFsKCkpIHtcbiAgICAgIGRyYWdFbC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlM2QoJHtuZXdQb3N9cHgsIDAsIDApYDtcbiAgICAgIGRyYWdFbC5zdHlsZS53aWR0aCA9IGAke25ld1NpemV9cHhgO1xuICAgIH0gZWxzZSB7XG4gICAgICBkcmFnRWwuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZTNkKDBweCwgJHtuZXdQb3N9cHgsIDApYDtcbiAgICAgIGRyYWdFbC5zdHlsZS5oZWlnaHQgPSBgJHtuZXdTaXplfXB4YDtcbiAgICB9XG4gICAgaWYgKHBhcmFtcy5oaWRlKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICBlbC5zdHlsZS5vcGFjaXR5ID0gMTtcbiAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgZWwuc3R5bGUub3BhY2l0eSA9IDA7XG4gICAgICAgIGVsLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9ICc0MDBtcyc7XG4gICAgICB9LCAxMDAwKTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gc2V0VHJhbnNpdGlvbihkdXJhdGlvbikge1xuICAgIGlmICghc3dpcGVyLnBhcmFtcy5zY3JvbGxiYXIuZWwgfHwgIXN3aXBlci5zY3JvbGxiYXIuZWwpIHJldHVybjtcbiAgICBzd2lwZXIuc2Nyb2xsYmFyLmRyYWdFbC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSBgJHtkdXJhdGlvbn1tc2A7XG4gIH1cbiAgZnVuY3Rpb24gdXBkYXRlU2l6ZSgpIHtcbiAgICBpZiAoIXN3aXBlci5wYXJhbXMuc2Nyb2xsYmFyLmVsIHx8ICFzd2lwZXIuc2Nyb2xsYmFyLmVsKSByZXR1cm47XG4gICAgY29uc3Qge1xuICAgICAgc2Nyb2xsYmFyXG4gICAgfSA9IHN3aXBlcjtcbiAgICBjb25zdCB7XG4gICAgICBkcmFnRWwsXG4gICAgICBlbFxuICAgIH0gPSBzY3JvbGxiYXI7XG4gICAgZHJhZ0VsLnN0eWxlLndpZHRoID0gJyc7XG4gICAgZHJhZ0VsLnN0eWxlLmhlaWdodCA9ICcnO1xuICAgIHRyYWNrU2l6ZSA9IHN3aXBlci5pc0hvcml6b250YWwoKSA/IGVsLm9mZnNldFdpZHRoIDogZWwub2Zmc2V0SGVpZ2h0O1xuICAgIGRpdmlkZXIgPSBzd2lwZXIuc2l6ZSAvIChzd2lwZXIudmlydHVhbFNpemUgKyBzd2lwZXIucGFyYW1zLnNsaWRlc09mZnNldEJlZm9yZSAtIChzd2lwZXIucGFyYW1zLmNlbnRlcmVkU2xpZGVzID8gc3dpcGVyLnNuYXBHcmlkWzBdIDogMCkpO1xuICAgIGlmIChzd2lwZXIucGFyYW1zLnNjcm9sbGJhci5kcmFnU2l6ZSA9PT0gJ2F1dG8nKSB7XG4gICAgICBkcmFnU2l6ZSA9IHRyYWNrU2l6ZSAqIGRpdmlkZXI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRyYWdTaXplID0gcGFyc2VJbnQoc3dpcGVyLnBhcmFtcy5zY3JvbGxiYXIuZHJhZ1NpemUsIDEwKTtcbiAgICB9XG4gICAgaWYgKHN3aXBlci5pc0hvcml6b250YWwoKSkge1xuICAgICAgZHJhZ0VsLnN0eWxlLndpZHRoID0gYCR7ZHJhZ1NpemV9cHhgO1xuICAgIH0gZWxzZSB7XG4gICAgICBkcmFnRWwuc3R5bGUuaGVpZ2h0ID0gYCR7ZHJhZ1NpemV9cHhgO1xuICAgIH1cbiAgICBpZiAoZGl2aWRlciA+PSAxKSB7XG4gICAgICBlbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbC5zdHlsZS5kaXNwbGF5ID0gJyc7XG4gICAgfVxuICAgIGlmIChzd2lwZXIucGFyYW1zLnNjcm9sbGJhci5oaWRlKSB7XG4gICAgICBlbC5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgICB9XG4gICAgaWYgKHN3aXBlci5wYXJhbXMud2F0Y2hPdmVyZmxvdyAmJiBzd2lwZXIuZW5hYmxlZCkge1xuICAgICAgc2Nyb2xsYmFyLmVsLmNsYXNzTGlzdFtzd2lwZXIuaXNMb2NrZWQgPyAnYWRkJyA6ICdyZW1vdmUnXShzd2lwZXIucGFyYW1zLnNjcm9sbGJhci5sb2NrQ2xhc3MpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBnZXRQb2ludGVyUG9zaXRpb24oZSkge1xuICAgIHJldHVybiBzd2lwZXIuaXNIb3Jpem9udGFsKCkgPyBlLmNsaWVudFggOiBlLmNsaWVudFk7XG4gIH1cbiAgZnVuY3Rpb24gc2V0RHJhZ1Bvc2l0aW9uKGUpIHtcbiAgICBjb25zdCB7XG4gICAgICBzY3JvbGxiYXIsXG4gICAgICBydGxUcmFuc2xhdGU6IHJ0bFxuICAgIH0gPSBzd2lwZXI7XG4gICAgY29uc3Qge1xuICAgICAgZWxcbiAgICB9ID0gc2Nyb2xsYmFyO1xuICAgIGxldCBwb3NpdGlvblJhdGlvO1xuICAgIHBvc2l0aW9uUmF0aW8gPSAoZ2V0UG9pbnRlclBvc2l0aW9uKGUpIC0gZWxlbWVudE9mZnNldChlbClbc3dpcGVyLmlzSG9yaXpvbnRhbCgpID8gJ2xlZnQnIDogJ3RvcCddIC0gKGRyYWdTdGFydFBvcyAhPT0gbnVsbCA/IGRyYWdTdGFydFBvcyA6IGRyYWdTaXplIC8gMikpIC8gKHRyYWNrU2l6ZSAtIGRyYWdTaXplKTtcbiAgICBwb3NpdGlvblJhdGlvID0gTWF0aC5tYXgoTWF0aC5taW4ocG9zaXRpb25SYXRpbywgMSksIDApO1xuICAgIGlmIChydGwpIHtcbiAgICAgIHBvc2l0aW9uUmF0aW8gPSAxIC0gcG9zaXRpb25SYXRpbztcbiAgICB9XG4gICAgY29uc3QgcG9zaXRpb24gPSBzd2lwZXIubWluVHJhbnNsYXRlKCkgKyAoc3dpcGVyLm1heFRyYW5zbGF0ZSgpIC0gc3dpcGVyLm1pblRyYW5zbGF0ZSgpKSAqIHBvc2l0aW9uUmF0aW87XG4gICAgc3dpcGVyLnVwZGF0ZVByb2dyZXNzKHBvc2l0aW9uKTtcbiAgICBzd2lwZXIuc2V0VHJhbnNsYXRlKHBvc2l0aW9uKTtcbiAgICBzd2lwZXIudXBkYXRlQWN0aXZlSW5kZXgoKTtcbiAgICBzd2lwZXIudXBkYXRlU2xpZGVzQ2xhc3NlcygpO1xuICB9XG4gIGZ1bmN0aW9uIG9uRHJhZ1N0YXJ0KGUpIHtcbiAgICBjb25zdCBwYXJhbXMgPSBzd2lwZXIucGFyYW1zLnNjcm9sbGJhcjtcbiAgICBjb25zdCB7XG4gICAgICBzY3JvbGxiYXIsXG4gICAgICB3cmFwcGVyRWxcbiAgICB9ID0gc3dpcGVyO1xuICAgIGNvbnN0IHtcbiAgICAgIGVsLFxuICAgICAgZHJhZ0VsXG4gICAgfSA9IHNjcm9sbGJhcjtcbiAgICBpc1RvdWNoZWQgPSB0cnVlO1xuICAgIGRyYWdTdGFydFBvcyA9IGUudGFyZ2V0ID09PSBkcmFnRWwgPyBnZXRQb2ludGVyUG9zaXRpb24oZSkgLSBlLnRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVtzd2lwZXIuaXNIb3Jpem9udGFsKCkgPyAnbGVmdCcgOiAndG9wJ10gOiBudWxsO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHdyYXBwZXJFbC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSAnMTAwbXMnO1xuICAgIGRyYWdFbC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSAnMTAwbXMnO1xuICAgIHNldERyYWdQb3NpdGlvbihlKTtcbiAgICBjbGVhclRpbWVvdXQoZHJhZ1RpbWVvdXQpO1xuICAgIGVsLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9ICcwbXMnO1xuICAgIGlmIChwYXJhbXMuaGlkZSkge1xuICAgICAgZWwuc3R5bGUub3BhY2l0eSA9IDE7XG4gICAgfVxuICAgIGlmIChzd2lwZXIucGFyYW1zLmNzc01vZGUpIHtcbiAgICAgIHN3aXBlci53cmFwcGVyRWwuc3R5bGVbJ3Njcm9sbC1zbmFwLXR5cGUnXSA9ICdub25lJztcbiAgICB9XG4gICAgZW1pdCgnc2Nyb2xsYmFyRHJhZ1N0YXJ0JywgZSk7XG4gIH1cbiAgZnVuY3Rpb24gb25EcmFnTW92ZShlKSB7XG4gICAgY29uc3Qge1xuICAgICAgc2Nyb2xsYmFyLFxuICAgICAgd3JhcHBlckVsXG4gICAgfSA9IHN3aXBlcjtcbiAgICBjb25zdCB7XG4gICAgICBlbCxcbiAgICAgIGRyYWdFbFxuICAgIH0gPSBzY3JvbGxiYXI7XG4gICAgaWYgKCFpc1RvdWNoZWQpIHJldHVybjtcbiAgICBpZiAoZS5wcmV2ZW50RGVmYXVsdCkgZS5wcmV2ZW50RGVmYXVsdCgpO2Vsc2UgZS5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xuICAgIHNldERyYWdQb3NpdGlvbihlKTtcbiAgICB3cmFwcGVyRWwuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gJzBtcyc7XG4gICAgZWwuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gJzBtcyc7XG4gICAgZHJhZ0VsLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9ICcwbXMnO1xuICAgIGVtaXQoJ3Njcm9sbGJhckRyYWdNb3ZlJywgZSk7XG4gIH1cbiAgZnVuY3Rpb24gb25EcmFnRW5kKGUpIHtcbiAgICBjb25zdCBwYXJhbXMgPSBzd2lwZXIucGFyYW1zLnNjcm9sbGJhcjtcbiAgICBjb25zdCB7XG4gICAgICBzY3JvbGxiYXIsXG4gICAgICB3cmFwcGVyRWxcbiAgICB9ID0gc3dpcGVyO1xuICAgIGNvbnN0IHtcbiAgICAgIGVsXG4gICAgfSA9IHNjcm9sbGJhcjtcbiAgICBpZiAoIWlzVG91Y2hlZCkgcmV0dXJuO1xuICAgIGlzVG91Y2hlZCA9IGZhbHNlO1xuICAgIGlmIChzd2lwZXIucGFyYW1zLmNzc01vZGUpIHtcbiAgICAgIHN3aXBlci53cmFwcGVyRWwuc3R5bGVbJ3Njcm9sbC1zbmFwLXR5cGUnXSA9ICcnO1xuICAgICAgd3JhcHBlckVsLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9ICcnO1xuICAgIH1cbiAgICBpZiAocGFyYW1zLmhpZGUpIHtcbiAgICAgIGNsZWFyVGltZW91dChkcmFnVGltZW91dCk7XG4gICAgICBkcmFnVGltZW91dCA9IG5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgZWwuc3R5bGUub3BhY2l0eSA9IDA7XG4gICAgICAgIGVsLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9ICc0MDBtcyc7XG4gICAgICB9LCAxMDAwKTtcbiAgICB9XG4gICAgZW1pdCgnc2Nyb2xsYmFyRHJhZ0VuZCcsIGUpO1xuICAgIGlmIChwYXJhbXMuc25hcE9uUmVsZWFzZSkge1xuICAgICAgc3dpcGVyLnNsaWRlVG9DbG9zZXN0KCk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGV2ZW50cyhtZXRob2QpIHtcbiAgICBjb25zdCB7XG4gICAgICBzY3JvbGxiYXIsXG4gICAgICBwYXJhbXNcbiAgICB9ID0gc3dpcGVyO1xuICAgIGNvbnN0IGVsID0gc2Nyb2xsYmFyLmVsO1xuICAgIGlmICghZWwpIHJldHVybjtcbiAgICBjb25zdCB0YXJnZXQgPSBlbDtcbiAgICBjb25zdCBhY3RpdmVMaXN0ZW5lciA9IHBhcmFtcy5wYXNzaXZlTGlzdGVuZXJzID8ge1xuICAgICAgcGFzc2l2ZTogZmFsc2UsXG4gICAgICBjYXB0dXJlOiBmYWxzZVxuICAgIH0gOiBmYWxzZTtcbiAgICBjb25zdCBwYXNzaXZlTGlzdGVuZXIgPSBwYXJhbXMucGFzc2l2ZUxpc3RlbmVycyA/IHtcbiAgICAgIHBhc3NpdmU6IHRydWUsXG4gICAgICBjYXB0dXJlOiBmYWxzZVxuICAgIH0gOiBmYWxzZTtcbiAgICBpZiAoIXRhcmdldCkgcmV0dXJuO1xuICAgIGNvbnN0IGV2ZW50TWV0aG9kID0gbWV0aG9kID09PSAnb24nID8gJ2FkZEV2ZW50TGlzdGVuZXInIDogJ3JlbW92ZUV2ZW50TGlzdGVuZXInO1xuICAgIHRhcmdldFtldmVudE1ldGhvZF0oJ3BvaW50ZXJkb3duJywgb25EcmFnU3RhcnQsIGFjdGl2ZUxpc3RlbmVyKTtcbiAgICBkb2N1bWVudFtldmVudE1ldGhvZF0oJ3BvaW50ZXJtb3ZlJywgb25EcmFnTW92ZSwgYWN0aXZlTGlzdGVuZXIpO1xuICAgIGRvY3VtZW50W2V2ZW50TWV0aG9kXSgncG9pbnRlcnVwJywgb25EcmFnRW5kLCBwYXNzaXZlTGlzdGVuZXIpO1xuICB9XG4gIGZ1bmN0aW9uIGVuYWJsZURyYWdnYWJsZSgpIHtcbiAgICBpZiAoIXN3aXBlci5wYXJhbXMuc2Nyb2xsYmFyLmVsIHx8ICFzd2lwZXIuc2Nyb2xsYmFyLmVsKSByZXR1cm47XG4gICAgZXZlbnRzKCdvbicpO1xuICB9XG4gIGZ1bmN0aW9uIGRpc2FibGVEcmFnZ2FibGUoKSB7XG4gICAgaWYgKCFzd2lwZXIucGFyYW1zLnNjcm9sbGJhci5lbCB8fCAhc3dpcGVyLnNjcm9sbGJhci5lbCkgcmV0dXJuO1xuICAgIGV2ZW50cygnb2ZmJyk7XG4gIH1cbiAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBjb25zdCB7XG4gICAgICBzY3JvbGxiYXIsXG4gICAgICBlbDogc3dpcGVyRWxcbiAgICB9ID0gc3dpcGVyO1xuICAgIHN3aXBlci5wYXJhbXMuc2Nyb2xsYmFyID0gY3JlYXRlRWxlbWVudElmTm90RGVmaW5lZChzd2lwZXIsIHN3aXBlci5vcmlnaW5hbFBhcmFtcy5zY3JvbGxiYXIsIHN3aXBlci5wYXJhbXMuc2Nyb2xsYmFyLCB7XG4gICAgICBlbDogJ3N3aXBlci1zY3JvbGxiYXInXG4gICAgfSk7XG4gICAgY29uc3QgcGFyYW1zID0gc3dpcGVyLnBhcmFtcy5zY3JvbGxiYXI7XG4gICAgaWYgKCFwYXJhbXMuZWwpIHJldHVybjtcbiAgICBsZXQgZWw7XG4gICAgaWYgKHR5cGVvZiBwYXJhbXMuZWwgPT09ICdzdHJpbmcnICYmIHN3aXBlci5pc0VsZW1lbnQpIHtcbiAgICAgIGVsID0gc3dpcGVyLmVsLnF1ZXJ5U2VsZWN0b3IocGFyYW1zLmVsKTtcbiAgICB9XG4gICAgaWYgKCFlbCAmJiB0eXBlb2YgcGFyYW1zLmVsID09PSAnc3RyaW5nJykge1xuICAgICAgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHBhcmFtcy5lbCk7XG4gICAgICBpZiAoIWVsLmxlbmd0aCkgcmV0dXJuO1xuICAgIH0gZWxzZSBpZiAoIWVsKSB7XG4gICAgICBlbCA9IHBhcmFtcy5lbDtcbiAgICB9XG4gICAgaWYgKHN3aXBlci5wYXJhbXMudW5pcXVlTmF2RWxlbWVudHMgJiYgdHlwZW9mIHBhcmFtcy5lbCA9PT0gJ3N0cmluZycgJiYgZWwubGVuZ3RoID4gMSAmJiBzd2lwZXJFbC5xdWVyeVNlbGVjdG9yQWxsKHBhcmFtcy5lbCkubGVuZ3RoID09PSAxKSB7XG4gICAgICBlbCA9IHN3aXBlckVsLnF1ZXJ5U2VsZWN0b3IocGFyYW1zLmVsKTtcbiAgICB9XG4gICAgaWYgKGVsLmxlbmd0aCA+IDApIGVsID0gZWxbMF07XG4gICAgZWwuY2xhc3NMaXN0LmFkZChzd2lwZXIuaXNIb3Jpem9udGFsKCkgPyBwYXJhbXMuaG9yaXpvbnRhbENsYXNzIDogcGFyYW1zLnZlcnRpY2FsQ2xhc3MpO1xuICAgIGxldCBkcmFnRWw7XG4gICAgaWYgKGVsKSB7XG4gICAgICBkcmFnRWwgPSBlbC5xdWVyeVNlbGVjdG9yKGNsYXNzZXNUb1NlbGVjdG9yKHN3aXBlci5wYXJhbXMuc2Nyb2xsYmFyLmRyYWdDbGFzcykpO1xuICAgICAgaWYgKCFkcmFnRWwpIHtcbiAgICAgICAgZHJhZ0VsID0gY3JlYXRlRWxlbWVudCgnZGl2Jywgc3dpcGVyLnBhcmFtcy5zY3JvbGxiYXIuZHJhZ0NsYXNzKTtcbiAgICAgICAgZWwuYXBwZW5kKGRyYWdFbCk7XG4gICAgICB9XG4gICAgfVxuICAgIE9iamVjdC5hc3NpZ24oc2Nyb2xsYmFyLCB7XG4gICAgICBlbCxcbiAgICAgIGRyYWdFbFxuICAgIH0pO1xuICAgIGlmIChwYXJhbXMuZHJhZ2dhYmxlKSB7XG4gICAgICBlbmFibGVEcmFnZ2FibGUoKTtcbiAgICB9XG4gICAgaWYgKGVsKSB7XG4gICAgICBlbC5jbGFzc0xpc3Rbc3dpcGVyLmVuYWJsZWQgPyAncmVtb3ZlJyA6ICdhZGQnXSguLi5jbGFzc2VzVG9Ub2tlbnMoc3dpcGVyLnBhcmFtcy5zY3JvbGxiYXIubG9ja0NsYXNzKSk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgY29uc3QgcGFyYW1zID0gc3dpcGVyLnBhcmFtcy5zY3JvbGxiYXI7XG4gICAgY29uc3QgZWwgPSBzd2lwZXIuc2Nyb2xsYmFyLmVsO1xuICAgIGlmIChlbCkge1xuICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZSguLi5jbGFzc2VzVG9Ub2tlbnMoc3dpcGVyLmlzSG9yaXpvbnRhbCgpID8gcGFyYW1zLmhvcml6b250YWxDbGFzcyA6IHBhcmFtcy52ZXJ0aWNhbENsYXNzKSk7XG4gICAgfVxuICAgIGRpc2FibGVEcmFnZ2FibGUoKTtcbiAgfVxuICBvbignaW5pdCcsICgpID0+IHtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5zY3JvbGxiYXIuZW5hYmxlZCA9PT0gZmFsc2UpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgICAgZGlzYWJsZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpbml0KCk7XG4gICAgICB1cGRhdGVTaXplKCk7XG4gICAgICBzZXRUcmFuc2xhdGUoKTtcbiAgICB9XG4gIH0pO1xuICBvbigndXBkYXRlIHJlc2l6ZSBvYnNlcnZlclVwZGF0ZSBsb2NrIHVubG9jaycsICgpID0+IHtcbiAgICB1cGRhdGVTaXplKCk7XG4gIH0pO1xuICBvbignc2V0VHJhbnNsYXRlJywgKCkgPT4ge1xuICAgIHNldFRyYW5zbGF0ZSgpO1xuICB9KTtcbiAgb24oJ3NldFRyYW5zaXRpb24nLCAoX3MsIGR1cmF0aW9uKSA9PiB7XG4gICAgc2V0VHJhbnNpdGlvbihkdXJhdGlvbik7XG4gIH0pO1xuICBvbignZW5hYmxlIGRpc2FibGUnLCAoKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgZWxcbiAgICB9ID0gc3dpcGVyLnNjcm9sbGJhcjtcbiAgICBpZiAoZWwpIHtcbiAgICAgIGVsLmNsYXNzTGlzdFtzd2lwZXIuZW5hYmxlZCA/ICdyZW1vdmUnIDogJ2FkZCddKC4uLmNsYXNzZXNUb1Rva2Vucyhzd2lwZXIucGFyYW1zLnNjcm9sbGJhci5sb2NrQ2xhc3MpKTtcbiAgICB9XG4gIH0pO1xuICBvbignZGVzdHJveScsICgpID0+IHtcbiAgICBkZXN0cm95KCk7XG4gIH0pO1xuICBjb25zdCBlbmFibGUgPSAoKSA9PiB7XG4gICAgc3dpcGVyLmVsLmNsYXNzTGlzdC5yZW1vdmUoLi4uY2xhc3Nlc1RvVG9rZW5zKHN3aXBlci5wYXJhbXMuc2Nyb2xsYmFyLnNjcm9sbGJhckRpc2FibGVkQ2xhc3MpKTtcbiAgICBpZiAoc3dpcGVyLnNjcm9sbGJhci5lbCkge1xuICAgICAgc3dpcGVyLnNjcm9sbGJhci5lbC5jbGFzc0xpc3QucmVtb3ZlKC4uLmNsYXNzZXNUb1Rva2Vucyhzd2lwZXIucGFyYW1zLnNjcm9sbGJhci5zY3JvbGxiYXJEaXNhYmxlZENsYXNzKSk7XG4gICAgfVxuICAgIGluaXQoKTtcbiAgICB1cGRhdGVTaXplKCk7XG4gICAgc2V0VHJhbnNsYXRlKCk7XG4gIH07XG4gIGNvbnN0IGRpc2FibGUgPSAoKSA9PiB7XG4gICAgc3dpcGVyLmVsLmNsYXNzTGlzdC5hZGQoLi4uY2xhc3Nlc1RvVG9rZW5zKHN3aXBlci5wYXJhbXMuc2Nyb2xsYmFyLnNjcm9sbGJhckRpc2FibGVkQ2xhc3MpKTtcbiAgICBpZiAoc3dpcGVyLnNjcm9sbGJhci5lbCkge1xuICAgICAgc3dpcGVyLnNjcm9sbGJhci5lbC5jbGFzc0xpc3QuYWRkKC4uLmNsYXNzZXNUb1Rva2Vucyhzd2lwZXIucGFyYW1zLnNjcm9sbGJhci5zY3JvbGxiYXJEaXNhYmxlZENsYXNzKSk7XG4gICAgfVxuICAgIGRlc3Ryb3koKTtcbiAgfTtcbiAgT2JqZWN0LmFzc2lnbihzd2lwZXIuc2Nyb2xsYmFyLCB7XG4gICAgZW5hYmxlLFxuICAgIGRpc2FibGUsXG4gICAgdXBkYXRlU2l6ZSxcbiAgICBzZXRUcmFuc2xhdGUsXG4gICAgaW5pdCxcbiAgICBkZXN0cm95XG4gIH0pO1xufVxuXG5leHBvcnQgeyBTY3JvbGxiYXIgYXMgZGVmYXVsdCB9O1xuIiwiaW1wb3J0IHsgZSBhcyBlbGVtZW50Q2hpbGRyZW4gfSBmcm9tICcuLi9zaGFyZWQvdXRpbHMubWpzJztcblxuZnVuY3Rpb24gUGFyYWxsYXgoX3JlZikge1xuICBsZXQge1xuICAgIHN3aXBlcixcbiAgICBleHRlbmRQYXJhbXMsXG4gICAgb25cbiAgfSA9IF9yZWY7XG4gIGV4dGVuZFBhcmFtcyh7XG4gICAgcGFyYWxsYXg6IHtcbiAgICAgIGVuYWJsZWQ6IGZhbHNlXG4gICAgfVxuICB9KTtcbiAgY29uc3QgZWxlbWVudHNTZWxlY3RvciA9ICdbZGF0YS1zd2lwZXItcGFyYWxsYXhdLCBbZGF0YS1zd2lwZXItcGFyYWxsYXgteF0sIFtkYXRhLXN3aXBlci1wYXJhbGxheC15XSwgW2RhdGEtc3dpcGVyLXBhcmFsbGF4LW9wYWNpdHldLCBbZGF0YS1zd2lwZXItcGFyYWxsYXgtc2NhbGVdJztcbiAgY29uc3Qgc2V0VHJhbnNmb3JtID0gKGVsLCBwcm9ncmVzcykgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIHJ0bFxuICAgIH0gPSBzd2lwZXI7XG4gICAgY29uc3QgcnRsRmFjdG9yID0gcnRsID8gLTEgOiAxO1xuICAgIGNvbnN0IHAgPSBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3dpcGVyLXBhcmFsbGF4JykgfHwgJzAnO1xuICAgIGxldCB4ID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXN3aXBlci1wYXJhbGxheC14Jyk7XG4gICAgbGV0IHkgPSBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3dpcGVyLXBhcmFsbGF4LXknKTtcbiAgICBjb25zdCBzY2FsZSA9IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1zd2lwZXItcGFyYWxsYXgtc2NhbGUnKTtcbiAgICBjb25zdCBvcGFjaXR5ID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXN3aXBlci1wYXJhbGxheC1vcGFjaXR5Jyk7XG4gICAgY29uc3Qgcm90YXRlID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXN3aXBlci1wYXJhbGxheC1yb3RhdGUnKTtcbiAgICBpZiAoeCB8fCB5KSB7XG4gICAgICB4ID0geCB8fCAnMCc7XG4gICAgICB5ID0geSB8fCAnMCc7XG4gICAgfSBlbHNlIGlmIChzd2lwZXIuaXNIb3Jpem9udGFsKCkpIHtcbiAgICAgIHggPSBwO1xuICAgICAgeSA9ICcwJztcbiAgICB9IGVsc2Uge1xuICAgICAgeSA9IHA7XG4gICAgICB4ID0gJzAnO1xuICAgIH1cbiAgICBpZiAoeC5pbmRleE9mKCclJykgPj0gMCkge1xuICAgICAgeCA9IGAke3BhcnNlSW50KHgsIDEwKSAqIHByb2dyZXNzICogcnRsRmFjdG9yfSVgO1xuICAgIH0gZWxzZSB7XG4gICAgICB4ID0gYCR7eCAqIHByb2dyZXNzICogcnRsRmFjdG9yfXB4YDtcbiAgICB9XG4gICAgaWYgKHkuaW5kZXhPZignJScpID49IDApIHtcbiAgICAgIHkgPSBgJHtwYXJzZUludCh5LCAxMCkgKiBwcm9ncmVzc30lYDtcbiAgICB9IGVsc2Uge1xuICAgICAgeSA9IGAke3kgKiBwcm9ncmVzc31weGA7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygb3BhY2l0eSAhPT0gJ3VuZGVmaW5lZCcgJiYgb3BhY2l0eSAhPT0gbnVsbCkge1xuICAgICAgY29uc3QgY3VycmVudE9wYWNpdHkgPSBvcGFjaXR5IC0gKG9wYWNpdHkgLSAxKSAqICgxIC0gTWF0aC5hYnMocHJvZ3Jlc3MpKTtcbiAgICAgIGVsLnN0eWxlLm9wYWNpdHkgPSBjdXJyZW50T3BhY2l0eTtcbiAgICB9XG4gICAgbGV0IHRyYW5zZm9ybSA9IGB0cmFuc2xhdGUzZCgke3h9LCAke3l9LCAwcHgpYDtcbiAgICBpZiAodHlwZW9mIHNjYWxlICE9PSAndW5kZWZpbmVkJyAmJiBzY2FsZSAhPT0gbnVsbCkge1xuICAgICAgY29uc3QgY3VycmVudFNjYWxlID0gc2NhbGUgLSAoc2NhbGUgLSAxKSAqICgxIC0gTWF0aC5hYnMocHJvZ3Jlc3MpKTtcbiAgICAgIHRyYW5zZm9ybSArPSBgIHNjYWxlKCR7Y3VycmVudFNjYWxlfSlgO1xuICAgIH1cbiAgICBpZiAocm90YXRlICYmIHR5cGVvZiByb3RhdGUgIT09ICd1bmRlZmluZWQnICYmIHJvdGF0ZSAhPT0gbnVsbCkge1xuICAgICAgY29uc3QgY3VycmVudFJvdGF0ZSA9IHJvdGF0ZSAqIHByb2dyZXNzICogLTE7XG4gICAgICB0cmFuc2Zvcm0gKz0gYCByb3RhdGUoJHtjdXJyZW50Um90YXRlfWRlZylgO1xuICAgIH1cbiAgICBlbC5zdHlsZS50cmFuc2Zvcm0gPSB0cmFuc2Zvcm07XG4gIH07XG4gIGNvbnN0IHNldFRyYW5zbGF0ZSA9ICgpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBlbCxcbiAgICAgIHNsaWRlcyxcbiAgICAgIHByb2dyZXNzLFxuICAgICAgc25hcEdyaWQsXG4gICAgICBpc0VsZW1lbnRcbiAgICB9ID0gc3dpcGVyO1xuICAgIGNvbnN0IGVsZW1lbnRzID0gZWxlbWVudENoaWxkcmVuKGVsLCBlbGVtZW50c1NlbGVjdG9yKTtcbiAgICBpZiAoc3dpcGVyLmlzRWxlbWVudCkge1xuICAgICAgZWxlbWVudHMucHVzaCguLi5lbGVtZW50Q2hpbGRyZW4oc3dpcGVyLmhvc3RFbCwgZWxlbWVudHNTZWxlY3RvcikpO1xuICAgIH1cbiAgICBlbGVtZW50cy5mb3JFYWNoKHN1YkVsID0+IHtcbiAgICAgIHNldFRyYW5zZm9ybShzdWJFbCwgcHJvZ3Jlc3MpO1xuICAgIH0pO1xuICAgIHNsaWRlcy5mb3JFYWNoKChzbGlkZUVsLCBzbGlkZUluZGV4KSA9PiB7XG4gICAgICBsZXQgc2xpZGVQcm9ncmVzcyA9IHNsaWRlRWwucHJvZ3Jlc3M7XG4gICAgICBpZiAoc3dpcGVyLnBhcmFtcy5zbGlkZXNQZXJHcm91cCA+IDEgJiYgc3dpcGVyLnBhcmFtcy5zbGlkZXNQZXJWaWV3ICE9PSAnYXV0bycpIHtcbiAgICAgICAgc2xpZGVQcm9ncmVzcyArPSBNYXRoLmNlaWwoc2xpZGVJbmRleCAvIDIpIC0gcHJvZ3Jlc3MgKiAoc25hcEdyaWQubGVuZ3RoIC0gMSk7XG4gICAgICB9XG4gICAgICBzbGlkZVByb2dyZXNzID0gTWF0aC5taW4oTWF0aC5tYXgoc2xpZGVQcm9ncmVzcywgLTEpLCAxKTtcbiAgICAgIHNsaWRlRWwucXVlcnlTZWxlY3RvckFsbChgJHtlbGVtZW50c1NlbGVjdG9yfSwgW2RhdGEtc3dpcGVyLXBhcmFsbGF4LXJvdGF0ZV1gKS5mb3JFYWNoKHN1YkVsID0+IHtcbiAgICAgICAgc2V0VHJhbnNmb3JtKHN1YkVsLCBzbGlkZVByb2dyZXNzKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuICBjb25zdCBzZXRUcmFuc2l0aW9uID0gZnVuY3Rpb24gKGR1cmF0aW9uKSB7XG4gICAgaWYgKGR1cmF0aW9uID09PSB2b2lkIDApIHtcbiAgICAgIGR1cmF0aW9uID0gc3dpcGVyLnBhcmFtcy5zcGVlZDtcbiAgICB9XG4gICAgY29uc3Qge1xuICAgICAgZWwsXG4gICAgICBob3N0RWxcbiAgICB9ID0gc3dpcGVyO1xuICAgIGNvbnN0IGVsZW1lbnRzID0gWy4uLmVsLnF1ZXJ5U2VsZWN0b3JBbGwoZWxlbWVudHNTZWxlY3RvcildO1xuICAgIGlmIChzd2lwZXIuaXNFbGVtZW50KSB7XG4gICAgICBlbGVtZW50cy5wdXNoKC4uLmhvc3RFbC5xdWVyeVNlbGVjdG9yQWxsKGVsZW1lbnRzU2VsZWN0b3IpKTtcbiAgICB9XG4gICAgZWxlbWVudHMuZm9yRWFjaChwYXJhbGxheEVsID0+IHtcbiAgICAgIGxldCBwYXJhbGxheER1cmF0aW9uID0gcGFyc2VJbnQocGFyYWxsYXhFbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3dpcGVyLXBhcmFsbGF4LWR1cmF0aW9uJyksIDEwKSB8fCBkdXJhdGlvbjtcbiAgICAgIGlmIChkdXJhdGlvbiA9PT0gMCkgcGFyYWxsYXhEdXJhdGlvbiA9IDA7XG4gICAgICBwYXJhbGxheEVsLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IGAke3BhcmFsbGF4RHVyYXRpb259bXNgO1xuICAgIH0pO1xuICB9O1xuICBvbignYmVmb3JlSW5pdCcsICgpID0+IHtcbiAgICBpZiAoIXN3aXBlci5wYXJhbXMucGFyYWxsYXguZW5hYmxlZCkgcmV0dXJuO1xuICAgIHN3aXBlci5wYXJhbXMud2F0Y2hTbGlkZXNQcm9ncmVzcyA9IHRydWU7XG4gICAgc3dpcGVyLm9yaWdpbmFsUGFyYW1zLndhdGNoU2xpZGVzUHJvZ3Jlc3MgPSB0cnVlO1xuICB9KTtcbiAgb24oJ2luaXQnLCAoKSA9PiB7XG4gICAgaWYgKCFzd2lwZXIucGFyYW1zLnBhcmFsbGF4LmVuYWJsZWQpIHJldHVybjtcbiAgICBzZXRUcmFuc2xhdGUoKTtcbiAgfSk7XG4gIG9uKCdzZXRUcmFuc2xhdGUnLCAoKSA9PiB7XG4gICAgaWYgKCFzd2lwZXIucGFyYW1zLnBhcmFsbGF4LmVuYWJsZWQpIHJldHVybjtcbiAgICBzZXRUcmFuc2xhdGUoKTtcbiAgfSk7XG4gIG9uKCdzZXRUcmFuc2l0aW9uJywgKF9zd2lwZXIsIGR1cmF0aW9uKSA9PiB7XG4gICAgaWYgKCFzd2lwZXIucGFyYW1zLnBhcmFsbGF4LmVuYWJsZWQpIHJldHVybjtcbiAgICBzZXRUcmFuc2l0aW9uKGR1cmF0aW9uKTtcbiAgfSk7XG59XG5cbmV4cG9ydCB7IFBhcmFsbGF4IGFzIGRlZmF1bHQgfTtcbiIsImltcG9ydCB7IGEgYXMgZ2V0V2luZG93IH0gZnJvbSAnLi4vc2hhcmVkL3Nzci13aW5kb3cuZXNtLm1qcyc7XG5pbXBvcnQgeyBlIGFzIGVsZW1lbnRDaGlsZHJlbiwgYSBhcyBlbGVtZW50UGFyZW50cywgYiBhcyBlbGVtZW50T2Zmc2V0LCBpIGFzIGdldFRyYW5zbGF0ZSB9IGZyb20gJy4uL3NoYXJlZC91dGlscy5tanMnO1xuXG5mdW5jdGlvbiBab29tKF9yZWYpIHtcbiAgbGV0IHtcbiAgICBzd2lwZXIsXG4gICAgZXh0ZW5kUGFyYW1zLFxuICAgIG9uLFxuICAgIGVtaXRcbiAgfSA9IF9yZWY7XG4gIGNvbnN0IHdpbmRvdyA9IGdldFdpbmRvdygpO1xuICBleHRlbmRQYXJhbXMoe1xuICAgIHpvb206IHtcbiAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgbWF4UmF0aW86IDMsXG4gICAgICBtaW5SYXRpbzogMSxcbiAgICAgIHRvZ2dsZTogdHJ1ZSxcbiAgICAgIGNvbnRhaW5lckNsYXNzOiAnc3dpcGVyLXpvb20tY29udGFpbmVyJyxcbiAgICAgIHpvb21lZFNsaWRlQ2xhc3M6ICdzd2lwZXItc2xpZGUtem9vbWVkJ1xuICAgIH1cbiAgfSk7XG4gIHN3aXBlci56b29tID0ge1xuICAgIGVuYWJsZWQ6IGZhbHNlXG4gIH07XG4gIGxldCBjdXJyZW50U2NhbGUgPSAxO1xuICBsZXQgaXNTY2FsaW5nID0gZmFsc2U7XG4gIGxldCBmYWtlR2VzdHVyZVRvdWNoZWQ7XG4gIGxldCBmYWtlR2VzdHVyZU1vdmVkO1xuICBjb25zdCBldkNhY2hlID0gW107XG4gIGNvbnN0IGdlc3R1cmUgPSB7XG4gICAgb3JpZ2luWDogMCxcbiAgICBvcmlnaW5ZOiAwLFxuICAgIHNsaWRlRWw6IHVuZGVmaW5lZCxcbiAgICBzbGlkZVdpZHRoOiB1bmRlZmluZWQsXG4gICAgc2xpZGVIZWlnaHQ6IHVuZGVmaW5lZCxcbiAgICBpbWFnZUVsOiB1bmRlZmluZWQsXG4gICAgaW1hZ2VXcmFwRWw6IHVuZGVmaW5lZCxcbiAgICBtYXhSYXRpbzogM1xuICB9O1xuICBjb25zdCBpbWFnZSA9IHtcbiAgICBpc1RvdWNoZWQ6IHVuZGVmaW5lZCxcbiAgICBpc01vdmVkOiB1bmRlZmluZWQsXG4gICAgY3VycmVudFg6IHVuZGVmaW5lZCxcbiAgICBjdXJyZW50WTogdW5kZWZpbmVkLFxuICAgIG1pblg6IHVuZGVmaW5lZCxcbiAgICBtaW5ZOiB1bmRlZmluZWQsXG4gICAgbWF4WDogdW5kZWZpbmVkLFxuICAgIG1heFk6IHVuZGVmaW5lZCxcbiAgICB3aWR0aDogdW5kZWZpbmVkLFxuICAgIGhlaWdodDogdW5kZWZpbmVkLFxuICAgIHN0YXJ0WDogdW5kZWZpbmVkLFxuICAgIHN0YXJ0WTogdW5kZWZpbmVkLFxuICAgIHRvdWNoZXNTdGFydDoge30sXG4gICAgdG91Y2hlc0N1cnJlbnQ6IHt9XG4gIH07XG4gIGNvbnN0IHZlbG9jaXR5ID0ge1xuICAgIHg6IHVuZGVmaW5lZCxcbiAgICB5OiB1bmRlZmluZWQsXG4gICAgcHJldlBvc2l0aW9uWDogdW5kZWZpbmVkLFxuICAgIHByZXZQb3NpdGlvblk6IHVuZGVmaW5lZCxcbiAgICBwcmV2VGltZTogdW5kZWZpbmVkXG4gIH07XG4gIGxldCBzY2FsZSA9IDE7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShzd2lwZXIuem9vbSwgJ3NjYWxlJywge1xuICAgIGdldCgpIHtcbiAgICAgIHJldHVybiBzY2FsZTtcbiAgICB9LFxuICAgIHNldCh2YWx1ZSkge1xuICAgICAgaWYgKHNjYWxlICE9PSB2YWx1ZSkge1xuICAgICAgICBjb25zdCBpbWFnZUVsID0gZ2VzdHVyZS5pbWFnZUVsO1xuICAgICAgICBjb25zdCBzbGlkZUVsID0gZ2VzdHVyZS5zbGlkZUVsO1xuICAgICAgICBlbWl0KCd6b29tQ2hhbmdlJywgdmFsdWUsIGltYWdlRWwsIHNsaWRlRWwpO1xuICAgICAgfVxuICAgICAgc2NhbGUgPSB2YWx1ZTtcbiAgICB9XG4gIH0pO1xuICBmdW5jdGlvbiBnZXREaXN0YW5jZUJldHdlZW5Ub3VjaGVzKCkge1xuICAgIGlmIChldkNhY2hlLmxlbmd0aCA8IDIpIHJldHVybiAxO1xuICAgIGNvbnN0IHgxID0gZXZDYWNoZVswXS5wYWdlWDtcbiAgICBjb25zdCB5MSA9IGV2Q2FjaGVbMF0ucGFnZVk7XG4gICAgY29uc3QgeDIgPSBldkNhY2hlWzFdLnBhZ2VYO1xuICAgIGNvbnN0IHkyID0gZXZDYWNoZVsxXS5wYWdlWTtcbiAgICBjb25zdCBkaXN0YW5jZSA9IE1hdGguc3FydCgoeDIgLSB4MSkgKiogMiArICh5MiAtIHkxKSAqKiAyKTtcbiAgICByZXR1cm4gZGlzdGFuY2U7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0U2NhbGVPcmlnaW4oKSB7XG4gICAgaWYgKGV2Q2FjaGUubGVuZ3RoIDwgMikgcmV0dXJuIHtcbiAgICAgIHg6IG51bGwsXG4gICAgICB5OiBudWxsXG4gICAgfTtcbiAgICBjb25zdCBib3ggPSBnZXN0dXJlLmltYWdlRWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgcmV0dXJuIFsoZXZDYWNoZVswXS5wYWdlWCArIChldkNhY2hlWzFdLnBhZ2VYIC0gZXZDYWNoZVswXS5wYWdlWCkgLyAyIC0gYm94LnggLSB3aW5kb3cuc2Nyb2xsWCkgLyBjdXJyZW50U2NhbGUsIChldkNhY2hlWzBdLnBhZ2VZICsgKGV2Q2FjaGVbMV0ucGFnZVkgLSBldkNhY2hlWzBdLnBhZ2VZKSAvIDIgLSBib3gueSAtIHdpbmRvdy5zY3JvbGxZKSAvIGN1cnJlbnRTY2FsZV07XG4gIH1cbiAgZnVuY3Rpb24gZ2V0U2xpZGVTZWxlY3RvcigpIHtcbiAgICByZXR1cm4gc3dpcGVyLmlzRWxlbWVudCA/IGBzd2lwZXItc2xpZGVgIDogYC4ke3N3aXBlci5wYXJhbXMuc2xpZGVDbGFzc31gO1xuICB9XG4gIGZ1bmN0aW9uIGV2ZW50V2l0aGluU2xpZGUoZSkge1xuICAgIGNvbnN0IHNsaWRlU2VsZWN0b3IgPSBnZXRTbGlkZVNlbGVjdG9yKCk7XG4gICAgaWYgKGUudGFyZ2V0Lm1hdGNoZXMoc2xpZGVTZWxlY3RvcikpIHJldHVybiB0cnVlO1xuICAgIGlmIChzd2lwZXIuc2xpZGVzLmZpbHRlcihzbGlkZUVsID0+IHNsaWRlRWwuY29udGFpbnMoZS50YXJnZXQpKS5sZW5ndGggPiAwKSByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgZnVuY3Rpb24gZXZlbnRXaXRoaW5ab29tQ29udGFpbmVyKGUpIHtcbiAgICBjb25zdCBzZWxlY3RvciA9IGAuJHtzd2lwZXIucGFyYW1zLnpvb20uY29udGFpbmVyQ2xhc3N9YDtcbiAgICBpZiAoZS50YXJnZXQubWF0Y2hlcyhzZWxlY3RvcikpIHJldHVybiB0cnVlO1xuICAgIGlmIChbLi4uc3dpcGVyLmhvc3RFbC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKV0uZmlsdGVyKGNvbnRhaW5lckVsID0+IGNvbnRhaW5lckVsLmNvbnRhaW5zKGUudGFyZ2V0KSkubGVuZ3RoID4gMCkgcmV0dXJuIHRydWU7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gRXZlbnRzXG4gIGZ1bmN0aW9uIG9uR2VzdHVyZVN0YXJ0KGUpIHtcbiAgICBpZiAoZS5wb2ludGVyVHlwZSA9PT0gJ21vdXNlJykge1xuICAgICAgZXZDYWNoZS5zcGxpY2UoMCwgZXZDYWNoZS5sZW5ndGgpO1xuICAgIH1cbiAgICBpZiAoIWV2ZW50V2l0aGluU2xpZGUoZSkpIHJldHVybjtcbiAgICBjb25zdCBwYXJhbXMgPSBzd2lwZXIucGFyYW1zLnpvb207XG4gICAgZmFrZUdlc3R1cmVUb3VjaGVkID0gZmFsc2U7XG4gICAgZmFrZUdlc3R1cmVNb3ZlZCA9IGZhbHNlO1xuICAgIGV2Q2FjaGUucHVzaChlKTtcbiAgICBpZiAoZXZDYWNoZS5sZW5ndGggPCAyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGZha2VHZXN0dXJlVG91Y2hlZCA9IHRydWU7XG4gICAgZ2VzdHVyZS5zY2FsZVN0YXJ0ID0gZ2V0RGlzdGFuY2VCZXR3ZWVuVG91Y2hlcygpO1xuICAgIGlmICghZ2VzdHVyZS5zbGlkZUVsKSB7XG4gICAgICBnZXN0dXJlLnNsaWRlRWwgPSBlLnRhcmdldC5jbG9zZXN0KGAuJHtzd2lwZXIucGFyYW1zLnNsaWRlQ2xhc3N9LCBzd2lwZXItc2xpZGVgKTtcbiAgICAgIGlmICghZ2VzdHVyZS5zbGlkZUVsKSBnZXN0dXJlLnNsaWRlRWwgPSBzd2lwZXIuc2xpZGVzW3N3aXBlci5hY3RpdmVJbmRleF07XG4gICAgICBsZXQgaW1hZ2VFbCA9IGdlc3R1cmUuc2xpZGVFbC5xdWVyeVNlbGVjdG9yKGAuJHtwYXJhbXMuY29udGFpbmVyQ2xhc3N9YCk7XG4gICAgICBpZiAoaW1hZ2VFbCkge1xuICAgICAgICBpbWFnZUVsID0gaW1hZ2VFbC5xdWVyeVNlbGVjdG9yQWxsKCdwaWN0dXJlLCBpbWcsIHN2ZywgY2FudmFzLCAuc3dpcGVyLXpvb20tdGFyZ2V0JylbMF07XG4gICAgICB9XG4gICAgICBnZXN0dXJlLmltYWdlRWwgPSBpbWFnZUVsO1xuICAgICAgaWYgKGltYWdlRWwpIHtcbiAgICAgICAgZ2VzdHVyZS5pbWFnZVdyYXBFbCA9IGVsZW1lbnRQYXJlbnRzKGdlc3R1cmUuaW1hZ2VFbCwgYC4ke3BhcmFtcy5jb250YWluZXJDbGFzc31gKVswXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGdlc3R1cmUuaW1hZ2VXcmFwRWwgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgICBpZiAoIWdlc3R1cmUuaW1hZ2VXcmFwRWwpIHtcbiAgICAgICAgZ2VzdHVyZS5pbWFnZUVsID0gdW5kZWZpbmVkO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBnZXN0dXJlLm1heFJhdGlvID0gZ2VzdHVyZS5pbWFnZVdyYXBFbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3dpcGVyLXpvb20nKSB8fCBwYXJhbXMubWF4UmF0aW87XG4gICAgfVxuICAgIGlmIChnZXN0dXJlLmltYWdlRWwpIHtcbiAgICAgIGNvbnN0IFtvcmlnaW5YLCBvcmlnaW5ZXSA9IGdldFNjYWxlT3JpZ2luKCk7XG4gICAgICBnZXN0dXJlLm9yaWdpblggPSBvcmlnaW5YO1xuICAgICAgZ2VzdHVyZS5vcmlnaW5ZID0gb3JpZ2luWTtcbiAgICAgIGdlc3R1cmUuaW1hZ2VFbC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSAnMG1zJztcbiAgICB9XG4gICAgaXNTY2FsaW5nID0gdHJ1ZTtcbiAgfVxuICBmdW5jdGlvbiBvbkdlc3R1cmVDaGFuZ2UoZSkge1xuICAgIGlmICghZXZlbnRXaXRoaW5TbGlkZShlKSkgcmV0dXJuO1xuICAgIGNvbnN0IHBhcmFtcyA9IHN3aXBlci5wYXJhbXMuem9vbTtcbiAgICBjb25zdCB6b29tID0gc3dpcGVyLnpvb207XG4gICAgY29uc3QgcG9pbnRlckluZGV4ID0gZXZDYWNoZS5maW5kSW5kZXgoY2FjaGVkRXYgPT4gY2FjaGVkRXYucG9pbnRlcklkID09PSBlLnBvaW50ZXJJZCk7XG4gICAgaWYgKHBvaW50ZXJJbmRleCA+PSAwKSBldkNhY2hlW3BvaW50ZXJJbmRleF0gPSBlO1xuICAgIGlmIChldkNhY2hlLmxlbmd0aCA8IDIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZmFrZUdlc3R1cmVNb3ZlZCA9IHRydWU7XG4gICAgZ2VzdHVyZS5zY2FsZU1vdmUgPSBnZXREaXN0YW5jZUJldHdlZW5Ub3VjaGVzKCk7XG4gICAgaWYgKCFnZXN0dXJlLmltYWdlRWwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgem9vbS5zY2FsZSA9IGdlc3R1cmUuc2NhbGVNb3ZlIC8gZ2VzdHVyZS5zY2FsZVN0YXJ0ICogY3VycmVudFNjYWxlO1xuICAgIGlmICh6b29tLnNjYWxlID4gZ2VzdHVyZS5tYXhSYXRpbykge1xuICAgICAgem9vbS5zY2FsZSA9IGdlc3R1cmUubWF4UmF0aW8gLSAxICsgKHpvb20uc2NhbGUgLSBnZXN0dXJlLm1heFJhdGlvICsgMSkgKiogMC41O1xuICAgIH1cbiAgICBpZiAoem9vbS5zY2FsZSA8IHBhcmFtcy5taW5SYXRpbykge1xuICAgICAgem9vbS5zY2FsZSA9IHBhcmFtcy5taW5SYXRpbyArIDEgLSAocGFyYW1zLm1pblJhdGlvIC0gem9vbS5zY2FsZSArIDEpICoqIDAuNTtcbiAgICB9XG4gICAgZ2VzdHVyZS5pbWFnZUVsLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUzZCgwLDAsMCkgc2NhbGUoJHt6b29tLnNjYWxlfSlgO1xuICB9XG4gIGZ1bmN0aW9uIG9uR2VzdHVyZUVuZChlKSB7XG4gICAgaWYgKCFldmVudFdpdGhpblNsaWRlKGUpKSByZXR1cm47XG4gICAgaWYgKGUucG9pbnRlclR5cGUgPT09ICdtb3VzZScgJiYgZS50eXBlID09PSAncG9pbnRlcm91dCcpIHJldHVybjtcbiAgICBjb25zdCBwYXJhbXMgPSBzd2lwZXIucGFyYW1zLnpvb207XG4gICAgY29uc3Qgem9vbSA9IHN3aXBlci56b29tO1xuICAgIGNvbnN0IHBvaW50ZXJJbmRleCA9IGV2Q2FjaGUuZmluZEluZGV4KGNhY2hlZEV2ID0+IGNhY2hlZEV2LnBvaW50ZXJJZCA9PT0gZS5wb2ludGVySWQpO1xuICAgIGlmIChwb2ludGVySW5kZXggPj0gMCkgZXZDYWNoZS5zcGxpY2UocG9pbnRlckluZGV4LCAxKTtcbiAgICBpZiAoIWZha2VHZXN0dXJlVG91Y2hlZCB8fCAhZmFrZUdlc3R1cmVNb3ZlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBmYWtlR2VzdHVyZVRvdWNoZWQgPSBmYWxzZTtcbiAgICBmYWtlR2VzdHVyZU1vdmVkID0gZmFsc2U7XG4gICAgaWYgKCFnZXN0dXJlLmltYWdlRWwpIHJldHVybjtcbiAgICB6b29tLnNjYWxlID0gTWF0aC5tYXgoTWF0aC5taW4oem9vbS5zY2FsZSwgZ2VzdHVyZS5tYXhSYXRpbyksIHBhcmFtcy5taW5SYXRpbyk7XG4gICAgZ2VzdHVyZS5pbWFnZUVsLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IGAke3N3aXBlci5wYXJhbXMuc3BlZWR9bXNgO1xuICAgIGdlc3R1cmUuaW1hZ2VFbC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlM2QoMCwwLDApIHNjYWxlKCR7em9vbS5zY2FsZX0pYDtcbiAgICBjdXJyZW50U2NhbGUgPSB6b29tLnNjYWxlO1xuICAgIGlzU2NhbGluZyA9IGZhbHNlO1xuICAgIGlmICh6b29tLnNjYWxlID4gMSAmJiBnZXN0dXJlLnNsaWRlRWwpIHtcbiAgICAgIGdlc3R1cmUuc2xpZGVFbC5jbGFzc0xpc3QuYWRkKGAke3BhcmFtcy56b29tZWRTbGlkZUNsYXNzfWApO1xuICAgIH0gZWxzZSBpZiAoem9vbS5zY2FsZSA8PSAxICYmIGdlc3R1cmUuc2xpZGVFbCkge1xuICAgICAgZ2VzdHVyZS5zbGlkZUVsLmNsYXNzTGlzdC5yZW1vdmUoYCR7cGFyYW1zLnpvb21lZFNsaWRlQ2xhc3N9YCk7XG4gICAgfVxuICAgIGlmICh6b29tLnNjYWxlID09PSAxKSB7XG4gICAgICBnZXN0dXJlLm9yaWdpblggPSAwO1xuICAgICAgZ2VzdHVyZS5vcmlnaW5ZID0gMDtcbiAgICAgIGdlc3R1cmUuc2xpZGVFbCA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gb25Ub3VjaFN0YXJ0KGUpIHtcbiAgICBjb25zdCBkZXZpY2UgPSBzd2lwZXIuZGV2aWNlO1xuICAgIGlmICghZ2VzdHVyZS5pbWFnZUVsKSByZXR1cm47XG4gICAgaWYgKGltYWdlLmlzVG91Y2hlZCkgcmV0dXJuO1xuICAgIGlmIChkZXZpY2UuYW5kcm9pZCAmJiBlLmNhbmNlbGFibGUpIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBpbWFnZS5pc1RvdWNoZWQgPSB0cnVlO1xuICAgIGNvbnN0IGV2ZW50ID0gZXZDYWNoZS5sZW5ndGggPiAwID8gZXZDYWNoZVswXSA6IGU7XG4gICAgaW1hZ2UudG91Y2hlc1N0YXJ0LnggPSBldmVudC5wYWdlWDtcbiAgICBpbWFnZS50b3VjaGVzU3RhcnQueSA9IGV2ZW50LnBhZ2VZO1xuICB9XG4gIGZ1bmN0aW9uIG9uVG91Y2hNb3ZlKGUpIHtcbiAgICBpZiAoIWV2ZW50V2l0aGluU2xpZGUoZSkgfHwgIWV2ZW50V2l0aGluWm9vbUNvbnRhaW5lcihlKSkgcmV0dXJuO1xuICAgIGNvbnN0IHpvb20gPSBzd2lwZXIuem9vbTtcbiAgICBpZiAoIWdlc3R1cmUuaW1hZ2VFbCkgcmV0dXJuO1xuICAgIGlmICghaW1hZ2UuaXNUb3VjaGVkIHx8ICFnZXN0dXJlLnNsaWRlRWwpIHJldHVybjtcbiAgICBpZiAoIWltYWdlLmlzTW92ZWQpIHtcbiAgICAgIGltYWdlLndpZHRoID0gZ2VzdHVyZS5pbWFnZUVsLm9mZnNldFdpZHRoO1xuICAgICAgaW1hZ2UuaGVpZ2h0ID0gZ2VzdHVyZS5pbWFnZUVsLm9mZnNldEhlaWdodDtcbiAgICAgIGltYWdlLnN0YXJ0WCA9IGdldFRyYW5zbGF0ZShnZXN0dXJlLmltYWdlV3JhcEVsLCAneCcpIHx8IDA7XG4gICAgICBpbWFnZS5zdGFydFkgPSBnZXRUcmFuc2xhdGUoZ2VzdHVyZS5pbWFnZVdyYXBFbCwgJ3knKSB8fCAwO1xuICAgICAgZ2VzdHVyZS5zbGlkZVdpZHRoID0gZ2VzdHVyZS5zbGlkZUVsLm9mZnNldFdpZHRoO1xuICAgICAgZ2VzdHVyZS5zbGlkZUhlaWdodCA9IGdlc3R1cmUuc2xpZGVFbC5vZmZzZXRIZWlnaHQ7XG4gICAgICBnZXN0dXJlLmltYWdlV3JhcEVsLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9ICcwbXMnO1xuICAgIH1cbiAgICAvLyBEZWZpbmUgaWYgd2UgbmVlZCBpbWFnZSBkcmFnXG4gICAgY29uc3Qgc2NhbGVkV2lkdGggPSBpbWFnZS53aWR0aCAqIHpvb20uc2NhbGU7XG4gICAgY29uc3Qgc2NhbGVkSGVpZ2h0ID0gaW1hZ2UuaGVpZ2h0ICogem9vbS5zY2FsZTtcbiAgICBpZiAoc2NhbGVkV2lkdGggPCBnZXN0dXJlLnNsaWRlV2lkdGggJiYgc2NhbGVkSGVpZ2h0IDwgZ2VzdHVyZS5zbGlkZUhlaWdodCkgcmV0dXJuO1xuICAgIGltYWdlLm1pblggPSBNYXRoLm1pbihnZXN0dXJlLnNsaWRlV2lkdGggLyAyIC0gc2NhbGVkV2lkdGggLyAyLCAwKTtcbiAgICBpbWFnZS5tYXhYID0gLWltYWdlLm1pblg7XG4gICAgaW1hZ2UubWluWSA9IE1hdGgubWluKGdlc3R1cmUuc2xpZGVIZWlnaHQgLyAyIC0gc2NhbGVkSGVpZ2h0IC8gMiwgMCk7XG4gICAgaW1hZ2UubWF4WSA9IC1pbWFnZS5taW5ZO1xuICAgIGltYWdlLnRvdWNoZXNDdXJyZW50LnggPSBldkNhY2hlLmxlbmd0aCA+IDAgPyBldkNhY2hlWzBdLnBhZ2VYIDogZS5wYWdlWDtcbiAgICBpbWFnZS50b3VjaGVzQ3VycmVudC55ID0gZXZDYWNoZS5sZW5ndGggPiAwID8gZXZDYWNoZVswXS5wYWdlWSA6IGUucGFnZVk7XG4gICAgY29uc3QgdG91Y2hlc0RpZmYgPSBNYXRoLm1heChNYXRoLmFicyhpbWFnZS50b3VjaGVzQ3VycmVudC54IC0gaW1hZ2UudG91Y2hlc1N0YXJ0LngpLCBNYXRoLmFicyhpbWFnZS50b3VjaGVzQ3VycmVudC55IC0gaW1hZ2UudG91Y2hlc1N0YXJ0LnkpKTtcbiAgICBpZiAodG91Y2hlc0RpZmYgPiA1KSB7XG4gICAgICBzd2lwZXIuYWxsb3dDbGljayA9IGZhbHNlO1xuICAgIH1cbiAgICBpZiAoIWltYWdlLmlzTW92ZWQgJiYgIWlzU2NhbGluZykge1xuICAgICAgaWYgKHN3aXBlci5pc0hvcml6b250YWwoKSAmJiAoTWF0aC5mbG9vcihpbWFnZS5taW5YKSA9PT0gTWF0aC5mbG9vcihpbWFnZS5zdGFydFgpICYmIGltYWdlLnRvdWNoZXNDdXJyZW50LnggPCBpbWFnZS50b3VjaGVzU3RhcnQueCB8fCBNYXRoLmZsb29yKGltYWdlLm1heFgpID09PSBNYXRoLmZsb29yKGltYWdlLnN0YXJ0WCkgJiYgaW1hZ2UudG91Y2hlc0N1cnJlbnQueCA+IGltYWdlLnRvdWNoZXNTdGFydC54KSkge1xuICAgICAgICBpbWFnZS5pc1RvdWNoZWQgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKCFzd2lwZXIuaXNIb3Jpem9udGFsKCkgJiYgKE1hdGguZmxvb3IoaW1hZ2UubWluWSkgPT09IE1hdGguZmxvb3IoaW1hZ2Uuc3RhcnRZKSAmJiBpbWFnZS50b3VjaGVzQ3VycmVudC55IDwgaW1hZ2UudG91Y2hlc1N0YXJ0LnkgfHwgTWF0aC5mbG9vcihpbWFnZS5tYXhZKSA9PT0gTWF0aC5mbG9vcihpbWFnZS5zdGFydFkpICYmIGltYWdlLnRvdWNoZXNDdXJyZW50LnkgPiBpbWFnZS50b3VjaGVzU3RhcnQueSkpIHtcbiAgICAgICAgaW1hZ2UuaXNUb3VjaGVkID0gZmFsc2U7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGUuY2FuY2VsYWJsZSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGltYWdlLmlzTW92ZWQgPSB0cnVlO1xuICAgIGNvbnN0IHNjYWxlUmF0aW8gPSAoem9vbS5zY2FsZSAtIGN1cnJlbnRTY2FsZSkgLyAoZ2VzdHVyZS5tYXhSYXRpbyAtIHN3aXBlci5wYXJhbXMuem9vbS5taW5SYXRpbyk7XG4gICAgY29uc3Qge1xuICAgICAgb3JpZ2luWCxcbiAgICAgIG9yaWdpbllcbiAgICB9ID0gZ2VzdHVyZTtcbiAgICBpbWFnZS5jdXJyZW50WCA9IGltYWdlLnRvdWNoZXNDdXJyZW50LnggLSBpbWFnZS50b3VjaGVzU3RhcnQueCArIGltYWdlLnN0YXJ0WCArIHNjYWxlUmF0aW8gKiAoaW1hZ2Uud2lkdGggLSBvcmlnaW5YICogMik7XG4gICAgaW1hZ2UuY3VycmVudFkgPSBpbWFnZS50b3VjaGVzQ3VycmVudC55IC0gaW1hZ2UudG91Y2hlc1N0YXJ0LnkgKyBpbWFnZS5zdGFydFkgKyBzY2FsZVJhdGlvICogKGltYWdlLmhlaWdodCAtIG9yaWdpblkgKiAyKTtcbiAgICBpZiAoaW1hZ2UuY3VycmVudFggPCBpbWFnZS5taW5YKSB7XG4gICAgICBpbWFnZS5jdXJyZW50WCA9IGltYWdlLm1pblggKyAxIC0gKGltYWdlLm1pblggLSBpbWFnZS5jdXJyZW50WCArIDEpICoqIDAuODtcbiAgICB9XG4gICAgaWYgKGltYWdlLmN1cnJlbnRYID4gaW1hZ2UubWF4WCkge1xuICAgICAgaW1hZ2UuY3VycmVudFggPSBpbWFnZS5tYXhYIC0gMSArIChpbWFnZS5jdXJyZW50WCAtIGltYWdlLm1heFggKyAxKSAqKiAwLjg7XG4gICAgfVxuICAgIGlmIChpbWFnZS5jdXJyZW50WSA8IGltYWdlLm1pblkpIHtcbiAgICAgIGltYWdlLmN1cnJlbnRZID0gaW1hZ2UubWluWSArIDEgLSAoaW1hZ2UubWluWSAtIGltYWdlLmN1cnJlbnRZICsgMSkgKiogMC44O1xuICAgIH1cbiAgICBpZiAoaW1hZ2UuY3VycmVudFkgPiBpbWFnZS5tYXhZKSB7XG4gICAgICBpbWFnZS5jdXJyZW50WSA9IGltYWdlLm1heFkgLSAxICsgKGltYWdlLmN1cnJlbnRZIC0gaW1hZ2UubWF4WSArIDEpICoqIDAuODtcbiAgICB9XG5cbiAgICAvLyBWZWxvY2l0eVxuICAgIGlmICghdmVsb2NpdHkucHJldlBvc2l0aW9uWCkgdmVsb2NpdHkucHJldlBvc2l0aW9uWCA9IGltYWdlLnRvdWNoZXNDdXJyZW50Lng7XG4gICAgaWYgKCF2ZWxvY2l0eS5wcmV2UG9zaXRpb25ZKSB2ZWxvY2l0eS5wcmV2UG9zaXRpb25ZID0gaW1hZ2UudG91Y2hlc0N1cnJlbnQueTtcbiAgICBpZiAoIXZlbG9jaXR5LnByZXZUaW1lKSB2ZWxvY2l0eS5wcmV2VGltZSA9IERhdGUubm93KCk7XG4gICAgdmVsb2NpdHkueCA9IChpbWFnZS50b3VjaGVzQ3VycmVudC54IC0gdmVsb2NpdHkucHJldlBvc2l0aW9uWCkgLyAoRGF0ZS5ub3coKSAtIHZlbG9jaXR5LnByZXZUaW1lKSAvIDI7XG4gICAgdmVsb2NpdHkueSA9IChpbWFnZS50b3VjaGVzQ3VycmVudC55IC0gdmVsb2NpdHkucHJldlBvc2l0aW9uWSkgLyAoRGF0ZS5ub3coKSAtIHZlbG9jaXR5LnByZXZUaW1lKSAvIDI7XG4gICAgaWYgKE1hdGguYWJzKGltYWdlLnRvdWNoZXNDdXJyZW50LnggLSB2ZWxvY2l0eS5wcmV2UG9zaXRpb25YKSA8IDIpIHZlbG9jaXR5LnggPSAwO1xuICAgIGlmIChNYXRoLmFicyhpbWFnZS50b3VjaGVzQ3VycmVudC55IC0gdmVsb2NpdHkucHJldlBvc2l0aW9uWSkgPCAyKSB2ZWxvY2l0eS55ID0gMDtcbiAgICB2ZWxvY2l0eS5wcmV2UG9zaXRpb25YID0gaW1hZ2UudG91Y2hlc0N1cnJlbnQueDtcbiAgICB2ZWxvY2l0eS5wcmV2UG9zaXRpb25ZID0gaW1hZ2UudG91Y2hlc0N1cnJlbnQueTtcbiAgICB2ZWxvY2l0eS5wcmV2VGltZSA9IERhdGUubm93KCk7XG4gICAgZ2VzdHVyZS5pbWFnZVdyYXBFbC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlM2QoJHtpbWFnZS5jdXJyZW50WH1weCwgJHtpbWFnZS5jdXJyZW50WX1weCwwKWA7XG4gIH1cbiAgZnVuY3Rpb24gb25Ub3VjaEVuZCgpIHtcbiAgICBjb25zdCB6b29tID0gc3dpcGVyLnpvb207XG4gICAgaWYgKCFnZXN0dXJlLmltYWdlRWwpIHJldHVybjtcbiAgICBpZiAoIWltYWdlLmlzVG91Y2hlZCB8fCAhaW1hZ2UuaXNNb3ZlZCkge1xuICAgICAgaW1hZ2UuaXNUb3VjaGVkID0gZmFsc2U7XG4gICAgICBpbWFnZS5pc01vdmVkID0gZmFsc2U7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGltYWdlLmlzVG91Y2hlZCA9IGZhbHNlO1xuICAgIGltYWdlLmlzTW92ZWQgPSBmYWxzZTtcbiAgICBsZXQgbW9tZW50dW1EdXJhdGlvblggPSAzMDA7XG4gICAgbGV0IG1vbWVudHVtRHVyYXRpb25ZID0gMzAwO1xuICAgIGNvbnN0IG1vbWVudHVtRGlzdGFuY2VYID0gdmVsb2NpdHkueCAqIG1vbWVudHVtRHVyYXRpb25YO1xuICAgIGNvbnN0IG5ld1Bvc2l0aW9uWCA9IGltYWdlLmN1cnJlbnRYICsgbW9tZW50dW1EaXN0YW5jZVg7XG4gICAgY29uc3QgbW9tZW50dW1EaXN0YW5jZVkgPSB2ZWxvY2l0eS55ICogbW9tZW50dW1EdXJhdGlvblk7XG4gICAgY29uc3QgbmV3UG9zaXRpb25ZID0gaW1hZ2UuY3VycmVudFkgKyBtb21lbnR1bURpc3RhbmNlWTtcblxuICAgIC8vIEZpeCBkdXJhdGlvblxuICAgIGlmICh2ZWxvY2l0eS54ICE9PSAwKSBtb21lbnR1bUR1cmF0aW9uWCA9IE1hdGguYWJzKChuZXdQb3NpdGlvblggLSBpbWFnZS5jdXJyZW50WCkgLyB2ZWxvY2l0eS54KTtcbiAgICBpZiAodmVsb2NpdHkueSAhPT0gMCkgbW9tZW50dW1EdXJhdGlvblkgPSBNYXRoLmFicygobmV3UG9zaXRpb25ZIC0gaW1hZ2UuY3VycmVudFkpIC8gdmVsb2NpdHkueSk7XG4gICAgY29uc3QgbW9tZW50dW1EdXJhdGlvbiA9IE1hdGgubWF4KG1vbWVudHVtRHVyYXRpb25YLCBtb21lbnR1bUR1cmF0aW9uWSk7XG4gICAgaW1hZ2UuY3VycmVudFggPSBuZXdQb3NpdGlvblg7XG4gICAgaW1hZ2UuY3VycmVudFkgPSBuZXdQb3NpdGlvblk7XG4gICAgLy8gRGVmaW5lIGlmIHdlIG5lZWQgaW1hZ2UgZHJhZ1xuICAgIGNvbnN0IHNjYWxlZFdpZHRoID0gaW1hZ2Uud2lkdGggKiB6b29tLnNjYWxlO1xuICAgIGNvbnN0IHNjYWxlZEhlaWdodCA9IGltYWdlLmhlaWdodCAqIHpvb20uc2NhbGU7XG4gICAgaW1hZ2UubWluWCA9IE1hdGgubWluKGdlc3R1cmUuc2xpZGVXaWR0aCAvIDIgLSBzY2FsZWRXaWR0aCAvIDIsIDApO1xuICAgIGltYWdlLm1heFggPSAtaW1hZ2UubWluWDtcbiAgICBpbWFnZS5taW5ZID0gTWF0aC5taW4oZ2VzdHVyZS5zbGlkZUhlaWdodCAvIDIgLSBzY2FsZWRIZWlnaHQgLyAyLCAwKTtcbiAgICBpbWFnZS5tYXhZID0gLWltYWdlLm1pblk7XG4gICAgaW1hZ2UuY3VycmVudFggPSBNYXRoLm1heChNYXRoLm1pbihpbWFnZS5jdXJyZW50WCwgaW1hZ2UubWF4WCksIGltYWdlLm1pblgpO1xuICAgIGltYWdlLmN1cnJlbnRZID0gTWF0aC5tYXgoTWF0aC5taW4oaW1hZ2UuY3VycmVudFksIGltYWdlLm1heFkpLCBpbWFnZS5taW5ZKTtcbiAgICBnZXN0dXJlLmltYWdlV3JhcEVsLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IGAke21vbWVudHVtRHVyYXRpb259bXNgO1xuICAgIGdlc3R1cmUuaW1hZ2VXcmFwRWwuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZTNkKCR7aW1hZ2UuY3VycmVudFh9cHgsICR7aW1hZ2UuY3VycmVudFl9cHgsMClgO1xuICB9XG4gIGZ1bmN0aW9uIG9uVHJhbnNpdGlvbkVuZCgpIHtcbiAgICBjb25zdCB6b29tID0gc3dpcGVyLnpvb207XG4gICAgaWYgKGdlc3R1cmUuc2xpZGVFbCAmJiBzd2lwZXIuYWN0aXZlSW5kZXggIT09IHN3aXBlci5zbGlkZXMuaW5kZXhPZihnZXN0dXJlLnNsaWRlRWwpKSB7XG4gICAgICBpZiAoZ2VzdHVyZS5pbWFnZUVsKSB7XG4gICAgICAgIGdlc3R1cmUuaW1hZ2VFbC5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlM2QoMCwwLDApIHNjYWxlKDEpJztcbiAgICAgIH1cbiAgICAgIGlmIChnZXN0dXJlLmltYWdlV3JhcEVsKSB7XG4gICAgICAgIGdlc3R1cmUuaW1hZ2VXcmFwRWwuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZTNkKDAsMCwwKSc7XG4gICAgICB9XG4gICAgICBnZXN0dXJlLnNsaWRlRWwuY2xhc3NMaXN0LnJlbW92ZShgJHtzd2lwZXIucGFyYW1zLnpvb20uem9vbWVkU2xpZGVDbGFzc31gKTtcbiAgICAgIHpvb20uc2NhbGUgPSAxO1xuICAgICAgY3VycmVudFNjYWxlID0gMTtcbiAgICAgIGdlc3R1cmUuc2xpZGVFbCA9IHVuZGVmaW5lZDtcbiAgICAgIGdlc3R1cmUuaW1hZ2VFbCA9IHVuZGVmaW5lZDtcbiAgICAgIGdlc3R1cmUuaW1hZ2VXcmFwRWwgPSB1bmRlZmluZWQ7XG4gICAgICBnZXN0dXJlLm9yaWdpblggPSAwO1xuICAgICAgZ2VzdHVyZS5vcmlnaW5ZID0gMDtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gem9vbUluKGUpIHtcbiAgICBjb25zdCB6b29tID0gc3dpcGVyLnpvb207XG4gICAgY29uc3QgcGFyYW1zID0gc3dpcGVyLnBhcmFtcy56b29tO1xuICAgIGlmICghZ2VzdHVyZS5zbGlkZUVsKSB7XG4gICAgICBpZiAoZSAmJiBlLnRhcmdldCkge1xuICAgICAgICBnZXN0dXJlLnNsaWRlRWwgPSBlLnRhcmdldC5jbG9zZXN0KGAuJHtzd2lwZXIucGFyYW1zLnNsaWRlQ2xhc3N9LCBzd2lwZXItc2xpZGVgKTtcbiAgICAgIH1cbiAgICAgIGlmICghZ2VzdHVyZS5zbGlkZUVsKSB7XG4gICAgICAgIGlmIChzd2lwZXIucGFyYW1zLnZpcnR1YWwgJiYgc3dpcGVyLnBhcmFtcy52aXJ0dWFsLmVuYWJsZWQgJiYgc3dpcGVyLnZpcnR1YWwpIHtcbiAgICAgICAgICBnZXN0dXJlLnNsaWRlRWwgPSBlbGVtZW50Q2hpbGRyZW4oc3dpcGVyLnNsaWRlc0VsLCBgLiR7c3dpcGVyLnBhcmFtcy5zbGlkZUFjdGl2ZUNsYXNzfWApWzBdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGdlc3R1cmUuc2xpZGVFbCA9IHN3aXBlci5zbGlkZXNbc3dpcGVyLmFjdGl2ZUluZGV4XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGV0IGltYWdlRWwgPSBnZXN0dXJlLnNsaWRlRWwucXVlcnlTZWxlY3RvcihgLiR7cGFyYW1zLmNvbnRhaW5lckNsYXNzfWApO1xuICAgICAgaWYgKGltYWdlRWwpIHtcbiAgICAgICAgaW1hZ2VFbCA9IGltYWdlRWwucXVlcnlTZWxlY3RvckFsbCgncGljdHVyZSwgaW1nLCBzdmcsIGNhbnZhcywgLnN3aXBlci16b29tLXRhcmdldCcpWzBdO1xuICAgICAgfVxuICAgICAgZ2VzdHVyZS5pbWFnZUVsID0gaW1hZ2VFbDtcbiAgICAgIGlmIChpbWFnZUVsKSB7XG4gICAgICAgIGdlc3R1cmUuaW1hZ2VXcmFwRWwgPSBlbGVtZW50UGFyZW50cyhnZXN0dXJlLmltYWdlRWwsIGAuJHtwYXJhbXMuY29udGFpbmVyQ2xhc3N9YClbMF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBnZXN0dXJlLmltYWdlV3JhcEVsID0gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIWdlc3R1cmUuaW1hZ2VFbCB8fCAhZ2VzdHVyZS5pbWFnZVdyYXBFbCkgcmV0dXJuO1xuICAgIGlmIChzd2lwZXIucGFyYW1zLmNzc01vZGUpIHtcbiAgICAgIHN3aXBlci53cmFwcGVyRWwuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcbiAgICAgIHN3aXBlci53cmFwcGVyRWwuc3R5bGUudG91Y2hBY3Rpb24gPSAnbm9uZSc7XG4gICAgfVxuICAgIGdlc3R1cmUuc2xpZGVFbC5jbGFzc0xpc3QuYWRkKGAke3BhcmFtcy56b29tZWRTbGlkZUNsYXNzfWApO1xuICAgIGxldCB0b3VjaFg7XG4gICAgbGV0IHRvdWNoWTtcbiAgICBsZXQgb2Zmc2V0WDtcbiAgICBsZXQgb2Zmc2V0WTtcbiAgICBsZXQgZGlmZlg7XG4gICAgbGV0IGRpZmZZO1xuICAgIGxldCB0cmFuc2xhdGVYO1xuICAgIGxldCB0cmFuc2xhdGVZO1xuICAgIGxldCBpbWFnZVdpZHRoO1xuICAgIGxldCBpbWFnZUhlaWdodDtcbiAgICBsZXQgc2NhbGVkV2lkdGg7XG4gICAgbGV0IHNjYWxlZEhlaWdodDtcbiAgICBsZXQgdHJhbnNsYXRlTWluWDtcbiAgICBsZXQgdHJhbnNsYXRlTWluWTtcbiAgICBsZXQgdHJhbnNsYXRlTWF4WDtcbiAgICBsZXQgdHJhbnNsYXRlTWF4WTtcbiAgICBsZXQgc2xpZGVXaWR0aDtcbiAgICBsZXQgc2xpZGVIZWlnaHQ7XG4gICAgaWYgKHR5cGVvZiBpbWFnZS50b3VjaGVzU3RhcnQueCA9PT0gJ3VuZGVmaW5lZCcgJiYgZSkge1xuICAgICAgdG91Y2hYID0gZS5wYWdlWDtcbiAgICAgIHRvdWNoWSA9IGUucGFnZVk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRvdWNoWCA9IGltYWdlLnRvdWNoZXNTdGFydC54O1xuICAgICAgdG91Y2hZID0gaW1hZ2UudG91Y2hlc1N0YXJ0Lnk7XG4gICAgfVxuICAgIGNvbnN0IGZvcmNlWm9vbVJhdGlvID0gdHlwZW9mIGUgPT09ICdudW1iZXInID8gZSA6IG51bGw7XG4gICAgaWYgKGN1cnJlbnRTY2FsZSA9PT0gMSAmJiBmb3JjZVpvb21SYXRpbykge1xuICAgICAgdG91Y2hYID0gdW5kZWZpbmVkO1xuICAgICAgdG91Y2hZID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICB6b29tLnNjYWxlID0gZm9yY2Vab29tUmF0aW8gfHwgZ2VzdHVyZS5pbWFnZVdyYXBFbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3dpcGVyLXpvb20nKSB8fCBwYXJhbXMubWF4UmF0aW87XG4gICAgY3VycmVudFNjYWxlID0gZm9yY2Vab29tUmF0aW8gfHwgZ2VzdHVyZS5pbWFnZVdyYXBFbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3dpcGVyLXpvb20nKSB8fCBwYXJhbXMubWF4UmF0aW87XG4gICAgaWYgKGUgJiYgIShjdXJyZW50U2NhbGUgPT09IDEgJiYgZm9yY2Vab29tUmF0aW8pKSB7XG4gICAgICBzbGlkZVdpZHRoID0gZ2VzdHVyZS5zbGlkZUVsLm9mZnNldFdpZHRoO1xuICAgICAgc2xpZGVIZWlnaHQgPSBnZXN0dXJlLnNsaWRlRWwub2Zmc2V0SGVpZ2h0O1xuICAgICAgb2Zmc2V0WCA9IGVsZW1lbnRPZmZzZXQoZ2VzdHVyZS5zbGlkZUVsKS5sZWZ0ICsgd2luZG93LnNjcm9sbFg7XG4gICAgICBvZmZzZXRZID0gZWxlbWVudE9mZnNldChnZXN0dXJlLnNsaWRlRWwpLnRvcCArIHdpbmRvdy5zY3JvbGxZO1xuICAgICAgZGlmZlggPSBvZmZzZXRYICsgc2xpZGVXaWR0aCAvIDIgLSB0b3VjaFg7XG4gICAgICBkaWZmWSA9IG9mZnNldFkgKyBzbGlkZUhlaWdodCAvIDIgLSB0b3VjaFk7XG4gICAgICBpbWFnZVdpZHRoID0gZ2VzdHVyZS5pbWFnZUVsLm9mZnNldFdpZHRoO1xuICAgICAgaW1hZ2VIZWlnaHQgPSBnZXN0dXJlLmltYWdlRWwub2Zmc2V0SGVpZ2h0O1xuICAgICAgc2NhbGVkV2lkdGggPSBpbWFnZVdpZHRoICogem9vbS5zY2FsZTtcbiAgICAgIHNjYWxlZEhlaWdodCA9IGltYWdlSGVpZ2h0ICogem9vbS5zY2FsZTtcbiAgICAgIHRyYW5zbGF0ZU1pblggPSBNYXRoLm1pbihzbGlkZVdpZHRoIC8gMiAtIHNjYWxlZFdpZHRoIC8gMiwgMCk7XG4gICAgICB0cmFuc2xhdGVNaW5ZID0gTWF0aC5taW4oc2xpZGVIZWlnaHQgLyAyIC0gc2NhbGVkSGVpZ2h0IC8gMiwgMCk7XG4gICAgICB0cmFuc2xhdGVNYXhYID0gLXRyYW5zbGF0ZU1pblg7XG4gICAgICB0cmFuc2xhdGVNYXhZID0gLXRyYW5zbGF0ZU1pblk7XG4gICAgICB0cmFuc2xhdGVYID0gZGlmZlggKiB6b29tLnNjYWxlO1xuICAgICAgdHJhbnNsYXRlWSA9IGRpZmZZICogem9vbS5zY2FsZTtcbiAgICAgIGlmICh0cmFuc2xhdGVYIDwgdHJhbnNsYXRlTWluWCkge1xuICAgICAgICB0cmFuc2xhdGVYID0gdHJhbnNsYXRlTWluWDtcbiAgICAgIH1cbiAgICAgIGlmICh0cmFuc2xhdGVYID4gdHJhbnNsYXRlTWF4WCkge1xuICAgICAgICB0cmFuc2xhdGVYID0gdHJhbnNsYXRlTWF4WDtcbiAgICAgIH1cbiAgICAgIGlmICh0cmFuc2xhdGVZIDwgdHJhbnNsYXRlTWluWSkge1xuICAgICAgICB0cmFuc2xhdGVZID0gdHJhbnNsYXRlTWluWTtcbiAgICAgIH1cbiAgICAgIGlmICh0cmFuc2xhdGVZID4gdHJhbnNsYXRlTWF4WSkge1xuICAgICAgICB0cmFuc2xhdGVZID0gdHJhbnNsYXRlTWF4WTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdHJhbnNsYXRlWCA9IDA7XG4gICAgICB0cmFuc2xhdGVZID0gMDtcbiAgICB9XG4gICAgaWYgKGZvcmNlWm9vbVJhdGlvICYmIHpvb20uc2NhbGUgPT09IDEpIHtcbiAgICAgIGdlc3R1cmUub3JpZ2luWCA9IDA7XG4gICAgICBnZXN0dXJlLm9yaWdpblkgPSAwO1xuICAgIH1cbiAgICBnZXN0dXJlLmltYWdlV3JhcEVsLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9ICczMDBtcyc7XG4gICAgZ2VzdHVyZS5pbWFnZVdyYXBFbC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlM2QoJHt0cmFuc2xhdGVYfXB4LCAke3RyYW5zbGF0ZVl9cHgsMClgO1xuICAgIGdlc3R1cmUuaW1hZ2VFbC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSAnMzAwbXMnO1xuICAgIGdlc3R1cmUuaW1hZ2VFbC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlM2QoMCwwLDApIHNjYWxlKCR7em9vbS5zY2FsZX0pYDtcbiAgfVxuICBmdW5jdGlvbiB6b29tT3V0KCkge1xuICAgIGNvbnN0IHpvb20gPSBzd2lwZXIuem9vbTtcbiAgICBjb25zdCBwYXJhbXMgPSBzd2lwZXIucGFyYW1zLnpvb207XG4gICAgaWYgKCFnZXN0dXJlLnNsaWRlRWwpIHtcbiAgICAgIGlmIChzd2lwZXIucGFyYW1zLnZpcnR1YWwgJiYgc3dpcGVyLnBhcmFtcy52aXJ0dWFsLmVuYWJsZWQgJiYgc3dpcGVyLnZpcnR1YWwpIHtcbiAgICAgICAgZ2VzdHVyZS5zbGlkZUVsID0gZWxlbWVudENoaWxkcmVuKHN3aXBlci5zbGlkZXNFbCwgYC4ke3N3aXBlci5wYXJhbXMuc2xpZGVBY3RpdmVDbGFzc31gKVswXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGdlc3R1cmUuc2xpZGVFbCA9IHN3aXBlci5zbGlkZXNbc3dpcGVyLmFjdGl2ZUluZGV4XTtcbiAgICAgIH1cbiAgICAgIGxldCBpbWFnZUVsID0gZ2VzdHVyZS5zbGlkZUVsLnF1ZXJ5U2VsZWN0b3IoYC4ke3BhcmFtcy5jb250YWluZXJDbGFzc31gKTtcbiAgICAgIGlmIChpbWFnZUVsKSB7XG4gICAgICAgIGltYWdlRWwgPSBpbWFnZUVsLnF1ZXJ5U2VsZWN0b3JBbGwoJ3BpY3R1cmUsIGltZywgc3ZnLCBjYW52YXMsIC5zd2lwZXItem9vbS10YXJnZXQnKVswXTtcbiAgICAgIH1cbiAgICAgIGdlc3R1cmUuaW1hZ2VFbCA9IGltYWdlRWw7XG4gICAgICBpZiAoaW1hZ2VFbCkge1xuICAgICAgICBnZXN0dXJlLmltYWdlV3JhcEVsID0gZWxlbWVudFBhcmVudHMoZ2VzdHVyZS5pbWFnZUVsLCBgLiR7cGFyYW1zLmNvbnRhaW5lckNsYXNzfWApWzBdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZ2VzdHVyZS5pbWFnZVdyYXBFbCA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFnZXN0dXJlLmltYWdlRWwgfHwgIWdlc3R1cmUuaW1hZ2VXcmFwRWwpIHJldHVybjtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5jc3NNb2RlKSB7XG4gICAgICBzd2lwZXIud3JhcHBlckVsLnN0eWxlLm92ZXJmbG93ID0gJyc7XG4gICAgICBzd2lwZXIud3JhcHBlckVsLnN0eWxlLnRvdWNoQWN0aW9uID0gJyc7XG4gICAgfVxuICAgIHpvb20uc2NhbGUgPSAxO1xuICAgIGN1cnJlbnRTY2FsZSA9IDE7XG4gICAgZ2VzdHVyZS5pbWFnZVdyYXBFbC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSAnMzAwbXMnO1xuICAgIGdlc3R1cmUuaW1hZ2VXcmFwRWwuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZTNkKDAsMCwwKSc7XG4gICAgZ2VzdHVyZS5pbWFnZUVsLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9ICczMDBtcyc7XG4gICAgZ2VzdHVyZS5pbWFnZUVsLnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGUzZCgwLDAsMCkgc2NhbGUoMSknO1xuICAgIGdlc3R1cmUuc2xpZGVFbC5jbGFzc0xpc3QucmVtb3ZlKGAke3BhcmFtcy56b29tZWRTbGlkZUNsYXNzfWApO1xuICAgIGdlc3R1cmUuc2xpZGVFbCA9IHVuZGVmaW5lZDtcbiAgICBnZXN0dXJlLm9yaWdpblggPSAwO1xuICAgIGdlc3R1cmUub3JpZ2luWSA9IDA7XG4gIH1cblxuICAvLyBUb2dnbGUgWm9vbVxuICBmdW5jdGlvbiB6b29tVG9nZ2xlKGUpIHtcbiAgICBjb25zdCB6b29tID0gc3dpcGVyLnpvb207XG4gICAgaWYgKHpvb20uc2NhbGUgJiYgem9vbS5zY2FsZSAhPT0gMSkge1xuICAgICAgLy8gWm9vbSBPdXRcbiAgICAgIHpvb21PdXQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gWm9vbSBJblxuICAgICAgem9vbUluKGUpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBnZXRMaXN0ZW5lcnMoKSB7XG4gICAgY29uc3QgcGFzc2l2ZUxpc3RlbmVyID0gc3dpcGVyLnBhcmFtcy5wYXNzaXZlTGlzdGVuZXJzID8ge1xuICAgICAgcGFzc2l2ZTogdHJ1ZSxcbiAgICAgIGNhcHR1cmU6IGZhbHNlXG4gICAgfSA6IGZhbHNlO1xuICAgIGNvbnN0IGFjdGl2ZUxpc3RlbmVyV2l0aENhcHR1cmUgPSBzd2lwZXIucGFyYW1zLnBhc3NpdmVMaXN0ZW5lcnMgPyB7XG4gICAgICBwYXNzaXZlOiBmYWxzZSxcbiAgICAgIGNhcHR1cmU6IHRydWVcbiAgICB9IDogdHJ1ZTtcbiAgICByZXR1cm4ge1xuICAgICAgcGFzc2l2ZUxpc3RlbmVyLFxuICAgICAgYWN0aXZlTGlzdGVuZXJXaXRoQ2FwdHVyZVxuICAgIH07XG4gIH1cblxuICAvLyBBdHRhY2gvRGV0YWNoIEV2ZW50c1xuICBmdW5jdGlvbiBlbmFibGUoKSB7XG4gICAgY29uc3Qgem9vbSA9IHN3aXBlci56b29tO1xuICAgIGlmICh6b29tLmVuYWJsZWQpIHJldHVybjtcbiAgICB6b29tLmVuYWJsZWQgPSB0cnVlO1xuICAgIGNvbnN0IHtcbiAgICAgIHBhc3NpdmVMaXN0ZW5lcixcbiAgICAgIGFjdGl2ZUxpc3RlbmVyV2l0aENhcHR1cmVcbiAgICB9ID0gZ2V0TGlzdGVuZXJzKCk7XG5cbiAgICAvLyBTY2FsZSBpbWFnZVxuICAgIHN3aXBlci53cmFwcGVyRWwuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcmRvd24nLCBvbkdlc3R1cmVTdGFydCwgcGFzc2l2ZUxpc3RlbmVyKTtcbiAgICBzd2lwZXIud3JhcHBlckVsLmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJtb3ZlJywgb25HZXN0dXJlQ2hhbmdlLCBhY3RpdmVMaXN0ZW5lcldpdGhDYXB0dXJlKTtcbiAgICBbJ3BvaW50ZXJ1cCcsICdwb2ludGVyY2FuY2VsJywgJ3BvaW50ZXJvdXQnXS5mb3JFYWNoKGV2ZW50TmFtZSA9PiB7XG4gICAgICBzd2lwZXIud3JhcHBlckVsLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBvbkdlc3R1cmVFbmQsIHBhc3NpdmVMaXN0ZW5lcik7XG4gICAgfSk7XG5cbiAgICAvLyBNb3ZlIGltYWdlXG4gICAgc3dpcGVyLndyYXBwZXJFbC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIG9uVG91Y2hNb3ZlLCBhY3RpdmVMaXN0ZW5lcldpdGhDYXB0dXJlKTtcbiAgfVxuICBmdW5jdGlvbiBkaXNhYmxlKCkge1xuICAgIGNvbnN0IHpvb20gPSBzd2lwZXIuem9vbTtcbiAgICBpZiAoIXpvb20uZW5hYmxlZCkgcmV0dXJuO1xuICAgIHpvb20uZW5hYmxlZCA9IGZhbHNlO1xuICAgIGNvbnN0IHtcbiAgICAgIHBhc3NpdmVMaXN0ZW5lcixcbiAgICAgIGFjdGl2ZUxpc3RlbmVyV2l0aENhcHR1cmVcbiAgICB9ID0gZ2V0TGlzdGVuZXJzKCk7XG5cbiAgICAvLyBTY2FsZSBpbWFnZVxuICAgIHN3aXBlci53cmFwcGVyRWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcmRvd24nLCBvbkdlc3R1cmVTdGFydCwgcGFzc2l2ZUxpc3RlbmVyKTtcbiAgICBzd2lwZXIud3JhcHBlckVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJtb3ZlJywgb25HZXN0dXJlQ2hhbmdlLCBhY3RpdmVMaXN0ZW5lcldpdGhDYXB0dXJlKTtcbiAgICBbJ3BvaW50ZXJ1cCcsICdwb2ludGVyY2FuY2VsJywgJ3BvaW50ZXJvdXQnXS5mb3JFYWNoKGV2ZW50TmFtZSA9PiB7XG4gICAgICBzd2lwZXIud3JhcHBlckVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBvbkdlc3R1cmVFbmQsIHBhc3NpdmVMaXN0ZW5lcik7XG4gICAgfSk7XG5cbiAgICAvLyBNb3ZlIGltYWdlXG4gICAgc3dpcGVyLndyYXBwZXJFbC5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIG9uVG91Y2hNb3ZlLCBhY3RpdmVMaXN0ZW5lcldpdGhDYXB0dXJlKTtcbiAgfVxuICBvbignaW5pdCcsICgpID0+IHtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy56b29tLmVuYWJsZWQpIHtcbiAgICAgIGVuYWJsZSgpO1xuICAgIH1cbiAgfSk7XG4gIG9uKCdkZXN0cm95JywgKCkgPT4ge1xuICAgIGRpc2FibGUoKTtcbiAgfSk7XG4gIG9uKCd0b3VjaFN0YXJ0JywgKF9zLCBlKSA9PiB7XG4gICAgaWYgKCFzd2lwZXIuem9vbS5lbmFibGVkKSByZXR1cm47XG4gICAgb25Ub3VjaFN0YXJ0KGUpO1xuICB9KTtcbiAgb24oJ3RvdWNoRW5kJywgKF9zLCBlKSA9PiB7XG4gICAgaWYgKCFzd2lwZXIuem9vbS5lbmFibGVkKSByZXR1cm47XG4gICAgb25Ub3VjaEVuZCgpO1xuICB9KTtcbiAgb24oJ2RvdWJsZVRhcCcsIChfcywgZSkgPT4ge1xuICAgIGlmICghc3dpcGVyLmFuaW1hdGluZyAmJiBzd2lwZXIucGFyYW1zLnpvb20uZW5hYmxlZCAmJiBzd2lwZXIuem9vbS5lbmFibGVkICYmIHN3aXBlci5wYXJhbXMuem9vbS50b2dnbGUpIHtcbiAgICAgIHpvb21Ub2dnbGUoZSk7XG4gICAgfVxuICB9KTtcbiAgb24oJ3RyYW5zaXRpb25FbmQnLCAoKSA9PiB7XG4gICAgaWYgKHN3aXBlci56b29tLmVuYWJsZWQgJiYgc3dpcGVyLnBhcmFtcy56b29tLmVuYWJsZWQpIHtcbiAgICAgIG9uVHJhbnNpdGlvbkVuZCgpO1xuICAgIH1cbiAgfSk7XG4gIG9uKCdzbGlkZUNoYW5nZScsICgpID0+IHtcbiAgICBpZiAoc3dpcGVyLnpvb20uZW5hYmxlZCAmJiBzd2lwZXIucGFyYW1zLnpvb20uZW5hYmxlZCAmJiBzd2lwZXIucGFyYW1zLmNzc01vZGUpIHtcbiAgICAgIG9uVHJhbnNpdGlvbkVuZCgpO1xuICAgIH1cbiAgfSk7XG4gIE9iamVjdC5hc3NpZ24oc3dpcGVyLnpvb20sIHtcbiAgICBlbmFibGUsXG4gICAgZGlzYWJsZSxcbiAgICBpbjogem9vbUluLFxuICAgIG91dDogem9vbU91dCxcbiAgICB0b2dnbGU6IHpvb21Ub2dnbGVcbiAgfSk7XG59XG5cbmV4cG9ydCB7IFpvb20gYXMgZGVmYXVsdCB9O1xuIiwiaW1wb3J0IHsgbiBhcyBuZXh0VGljaywgaiBhcyBlbGVtZW50VHJhbnNpdGlvbkVuZCB9IGZyb20gJy4uL3NoYXJlZC91dGlscy5tanMnO1xuXG4vKiBlc2xpbnQgbm8tYml0d2lzZTogW1wiZXJyb3JcIiwgeyBcImFsbG93XCI6IFtcIj4+XCJdIH1dICovXG5mdW5jdGlvbiBDb250cm9sbGVyKF9yZWYpIHtcbiAgbGV0IHtcbiAgICBzd2lwZXIsXG4gICAgZXh0ZW5kUGFyYW1zLFxuICAgIG9uXG4gIH0gPSBfcmVmO1xuICBleHRlbmRQYXJhbXMoe1xuICAgIGNvbnRyb2xsZXI6IHtcbiAgICAgIGNvbnRyb2w6IHVuZGVmaW5lZCxcbiAgICAgIGludmVyc2U6IGZhbHNlLFxuICAgICAgYnk6ICdzbGlkZScgLy8gb3IgJ2NvbnRhaW5lcidcbiAgICB9XG4gIH0pO1xuXG4gIHN3aXBlci5jb250cm9sbGVyID0ge1xuICAgIGNvbnRyb2w6IHVuZGVmaW5lZFxuICB9O1xuICBmdW5jdGlvbiBMaW5lYXJTcGxpbmUoeCwgeSkge1xuICAgIGNvbnN0IGJpbmFyeVNlYXJjaCA9IGZ1bmN0aW9uIHNlYXJjaCgpIHtcbiAgICAgIGxldCBtYXhJbmRleDtcbiAgICAgIGxldCBtaW5JbmRleDtcbiAgICAgIGxldCBndWVzcztcbiAgICAgIHJldHVybiAoYXJyYXksIHZhbCkgPT4ge1xuICAgICAgICBtaW5JbmRleCA9IC0xO1xuICAgICAgICBtYXhJbmRleCA9IGFycmF5Lmxlbmd0aDtcbiAgICAgICAgd2hpbGUgKG1heEluZGV4IC0gbWluSW5kZXggPiAxKSB7XG4gICAgICAgICAgZ3Vlc3MgPSBtYXhJbmRleCArIG1pbkluZGV4ID4+IDE7XG4gICAgICAgICAgaWYgKGFycmF5W2d1ZXNzXSA8PSB2YWwpIHtcbiAgICAgICAgICAgIG1pbkluZGV4ID0gZ3Vlc3M7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1heEluZGV4ID0gZ3Vlc3M7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtYXhJbmRleDtcbiAgICAgIH07XG4gICAgfSgpO1xuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcbiAgICB0aGlzLmxhc3RJbmRleCA9IHgubGVuZ3RoIC0gMTtcbiAgICAvLyBHaXZlbiBhbiB4IHZhbHVlICh4MiksIHJldHVybiB0aGUgZXhwZWN0ZWQgeTIgdmFsdWU6XG4gICAgLy8gKHgxLHkxKSBpcyB0aGUga25vd24gcG9pbnQgYmVmb3JlIGdpdmVuIHZhbHVlLFxuICAgIC8vICh4Myx5MykgaXMgdGhlIGtub3duIHBvaW50IGFmdGVyIGdpdmVuIHZhbHVlLlxuICAgIGxldCBpMTtcbiAgICBsZXQgaTM7XG4gICAgdGhpcy5pbnRlcnBvbGF0ZSA9IGZ1bmN0aW9uIGludGVycG9sYXRlKHgyKSB7XG4gICAgICBpZiAoIXgyKSByZXR1cm4gMDtcblxuICAgICAgLy8gR2V0IHRoZSBpbmRleGVzIG9mIHgxIGFuZCB4MyAodGhlIGFycmF5IGluZGV4ZXMgYmVmb3JlIGFuZCBhZnRlciBnaXZlbiB4Mik6XG4gICAgICBpMyA9IGJpbmFyeVNlYXJjaCh0aGlzLngsIHgyKTtcbiAgICAgIGkxID0gaTMgLSAxO1xuXG4gICAgICAvLyBXZSBoYXZlIG91ciBpbmRleGVzIGkxICYgaTMsIHNvIHdlIGNhbiBjYWxjdWxhdGUgYWxyZWFkeTpcbiAgICAgIC8vIHkyIDo9ICgoeDLiiJJ4MSkgw5cgKHkz4oiSeTEpKSDDtyAoeDPiiJJ4MSkgKyB5MVxuICAgICAgcmV0dXJuICh4MiAtIHRoaXMueFtpMV0pICogKHRoaXMueVtpM10gLSB0aGlzLnlbaTFdKSAvICh0aGlzLnhbaTNdIC0gdGhpcy54W2kxXSkgKyB0aGlzLnlbaTFdO1xuICAgIH07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0SW50ZXJwb2xhdGVGdW5jdGlvbihjKSB7XG4gICAgc3dpcGVyLmNvbnRyb2xsZXIuc3BsaW5lID0gc3dpcGVyLnBhcmFtcy5sb29wID8gbmV3IExpbmVhclNwbGluZShzd2lwZXIuc2xpZGVzR3JpZCwgYy5zbGlkZXNHcmlkKSA6IG5ldyBMaW5lYXJTcGxpbmUoc3dpcGVyLnNuYXBHcmlkLCBjLnNuYXBHcmlkKTtcbiAgfVxuICBmdW5jdGlvbiBzZXRUcmFuc2xhdGUoX3QsIGJ5Q29udHJvbGxlcikge1xuICAgIGNvbnN0IGNvbnRyb2xsZWQgPSBzd2lwZXIuY29udHJvbGxlci5jb250cm9sO1xuICAgIGxldCBtdWx0aXBsaWVyO1xuICAgIGxldCBjb250cm9sbGVkVHJhbnNsYXRlO1xuICAgIGNvbnN0IFN3aXBlciA9IHN3aXBlci5jb25zdHJ1Y3RvcjtcbiAgICBmdW5jdGlvbiBzZXRDb250cm9sbGVkVHJhbnNsYXRlKGMpIHtcbiAgICAgIGlmIChjLmRlc3Ryb3llZCkgcmV0dXJuO1xuXG4gICAgICAvLyB0aGlzIHdpbGwgY3JlYXRlIGFuIEludGVycG9sYXRlIGZ1bmN0aW9uIGJhc2VkIG9uIHRoZSBzbmFwR3JpZHNcbiAgICAgIC8vIHggaXMgdGhlIEdyaWQgb2YgdGhlIHNjcm9sbGVkIHNjcm9sbGVyIGFuZCB5IHdpbGwgYmUgdGhlIGNvbnRyb2xsZWQgc2Nyb2xsZXJcbiAgICAgIC8vIGl0IG1ha2VzIHNlbnNlIHRvIGNyZWF0ZSB0aGlzIG9ubHkgb25jZSBhbmQgcmVjYWxsIGl0IGZvciB0aGUgaW50ZXJwb2xhdGlvblxuICAgICAgLy8gdGhlIGZ1bmN0aW9uIGRvZXMgYSBsb3Qgb2YgdmFsdWUgY2FjaGluZyBmb3IgcGVyZm9ybWFuY2VcbiAgICAgIGNvbnN0IHRyYW5zbGF0ZSA9IHN3aXBlci5ydGxUcmFuc2xhdGUgPyAtc3dpcGVyLnRyYW5zbGF0ZSA6IHN3aXBlci50cmFuc2xhdGU7XG4gICAgICBpZiAoc3dpcGVyLnBhcmFtcy5jb250cm9sbGVyLmJ5ID09PSAnc2xpZGUnKSB7XG4gICAgICAgIGdldEludGVycG9sYXRlRnVuY3Rpb24oYyk7XG4gICAgICAgIC8vIGkgYW0gbm90IHN1cmUgd2h5IHRoZSB2YWx1ZXMgaGF2ZSB0byBiZSBtdWx0aXBsaWNhdGVkIHRoaXMgd2F5LCB0cmllZCB0byBpbnZlcnQgdGhlIHNuYXBHcmlkXG4gICAgICAgIC8vIGJ1dCBpdCBkaWQgbm90IHdvcmsgb3V0XG4gICAgICAgIGNvbnRyb2xsZWRUcmFuc2xhdGUgPSAtc3dpcGVyLmNvbnRyb2xsZXIuc3BsaW5lLmludGVycG9sYXRlKC10cmFuc2xhdGUpO1xuICAgICAgfVxuICAgICAgaWYgKCFjb250cm9sbGVkVHJhbnNsYXRlIHx8IHN3aXBlci5wYXJhbXMuY29udHJvbGxlci5ieSA9PT0gJ2NvbnRhaW5lcicpIHtcbiAgICAgICAgbXVsdGlwbGllciA9IChjLm1heFRyYW5zbGF0ZSgpIC0gYy5taW5UcmFuc2xhdGUoKSkgLyAoc3dpcGVyLm1heFRyYW5zbGF0ZSgpIC0gc3dpcGVyLm1pblRyYW5zbGF0ZSgpKTtcbiAgICAgICAgaWYgKE51bWJlci5pc05hTihtdWx0aXBsaWVyKSB8fCAhTnVtYmVyLmlzRmluaXRlKG11bHRpcGxpZXIpKSB7XG4gICAgICAgICAgbXVsdGlwbGllciA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgY29udHJvbGxlZFRyYW5zbGF0ZSA9ICh0cmFuc2xhdGUgLSBzd2lwZXIubWluVHJhbnNsYXRlKCkpICogbXVsdGlwbGllciArIGMubWluVHJhbnNsYXRlKCk7XG4gICAgICB9XG4gICAgICBpZiAoc3dpcGVyLnBhcmFtcy5jb250cm9sbGVyLmludmVyc2UpIHtcbiAgICAgICAgY29udHJvbGxlZFRyYW5zbGF0ZSA9IGMubWF4VHJhbnNsYXRlKCkgLSBjb250cm9sbGVkVHJhbnNsYXRlO1xuICAgICAgfVxuICAgICAgYy51cGRhdGVQcm9ncmVzcyhjb250cm9sbGVkVHJhbnNsYXRlKTtcbiAgICAgIGMuc2V0VHJhbnNsYXRlKGNvbnRyb2xsZWRUcmFuc2xhdGUsIHN3aXBlcik7XG4gICAgICBjLnVwZGF0ZUFjdGl2ZUluZGV4KCk7XG4gICAgICBjLnVwZGF0ZVNsaWRlc0NsYXNzZXMoKTtcbiAgICB9XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoY29udHJvbGxlZCkpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29udHJvbGxlZC5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBpZiAoY29udHJvbGxlZFtpXSAhPT0gYnlDb250cm9sbGVyICYmIGNvbnRyb2xsZWRbaV0gaW5zdGFuY2VvZiBTd2lwZXIpIHtcbiAgICAgICAgICBzZXRDb250cm9sbGVkVHJhbnNsYXRlKGNvbnRyb2xsZWRbaV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChjb250cm9sbGVkIGluc3RhbmNlb2YgU3dpcGVyICYmIGJ5Q29udHJvbGxlciAhPT0gY29udHJvbGxlZCkge1xuICAgICAgc2V0Q29udHJvbGxlZFRyYW5zbGF0ZShjb250cm9sbGVkKTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gc2V0VHJhbnNpdGlvbihkdXJhdGlvbiwgYnlDb250cm9sbGVyKSB7XG4gICAgY29uc3QgU3dpcGVyID0gc3dpcGVyLmNvbnN0cnVjdG9yO1xuICAgIGNvbnN0IGNvbnRyb2xsZWQgPSBzd2lwZXIuY29udHJvbGxlci5jb250cm9sO1xuICAgIGxldCBpO1xuICAgIGZ1bmN0aW9uIHNldENvbnRyb2xsZWRUcmFuc2l0aW9uKGMpIHtcbiAgICAgIGlmIChjLmRlc3Ryb3llZCkgcmV0dXJuO1xuICAgICAgYy5zZXRUcmFuc2l0aW9uKGR1cmF0aW9uLCBzd2lwZXIpO1xuICAgICAgaWYgKGR1cmF0aW9uICE9PSAwKSB7XG4gICAgICAgIGMudHJhbnNpdGlvblN0YXJ0KCk7XG4gICAgICAgIGlmIChjLnBhcmFtcy5hdXRvSGVpZ2h0KSB7XG4gICAgICAgICAgbmV4dFRpY2soKCkgPT4ge1xuICAgICAgICAgICAgYy51cGRhdGVBdXRvSGVpZ2h0KCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxlbWVudFRyYW5zaXRpb25FbmQoYy53cmFwcGVyRWwsICgpID0+IHtcbiAgICAgICAgICBpZiAoIWNvbnRyb2xsZWQpIHJldHVybjtcbiAgICAgICAgICBjLnRyYW5zaXRpb25FbmQoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChBcnJheS5pc0FycmF5KGNvbnRyb2xsZWQpKSB7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgY29udHJvbGxlZC5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBpZiAoY29udHJvbGxlZFtpXSAhPT0gYnlDb250cm9sbGVyICYmIGNvbnRyb2xsZWRbaV0gaW5zdGFuY2VvZiBTd2lwZXIpIHtcbiAgICAgICAgICBzZXRDb250cm9sbGVkVHJhbnNpdGlvbihjb250cm9sbGVkW2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoY29udHJvbGxlZCBpbnN0YW5jZW9mIFN3aXBlciAmJiBieUNvbnRyb2xsZXIgIT09IGNvbnRyb2xsZWQpIHtcbiAgICAgIHNldENvbnRyb2xsZWRUcmFuc2l0aW9uKGNvbnRyb2xsZWQpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiByZW1vdmVTcGxpbmUoKSB7XG4gICAgaWYgKCFzd2lwZXIuY29udHJvbGxlci5jb250cm9sKSByZXR1cm47XG4gICAgaWYgKHN3aXBlci5jb250cm9sbGVyLnNwbGluZSkge1xuICAgICAgc3dpcGVyLmNvbnRyb2xsZXIuc3BsaW5lID0gdW5kZWZpbmVkO1xuICAgICAgZGVsZXRlIHN3aXBlci5jb250cm9sbGVyLnNwbGluZTtcbiAgICB9XG4gIH1cbiAgb24oJ2JlZm9yZUluaXQnLCAoKSA9PiB7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIChcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgdHlwZW9mIHN3aXBlci5wYXJhbXMuY29udHJvbGxlci5jb250cm9sID09PSAnc3RyaW5nJyB8fCBzd2lwZXIucGFyYW1zLmNvbnRyb2xsZXIuY29udHJvbCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSkge1xuICAgICAgY29uc3QgY29udHJvbEVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHN3aXBlci5wYXJhbXMuY29udHJvbGxlci5jb250cm9sKTtcbiAgICAgIGlmIChjb250cm9sRWxlbWVudCAmJiBjb250cm9sRWxlbWVudC5zd2lwZXIpIHtcbiAgICAgICAgc3dpcGVyLmNvbnRyb2xsZXIuY29udHJvbCA9IGNvbnRyb2xFbGVtZW50LnN3aXBlcjtcbiAgICAgIH0gZWxzZSBpZiAoY29udHJvbEVsZW1lbnQpIHtcbiAgICAgICAgY29uc3Qgb25Db250cm9sbGVyU3dpcGVyID0gZSA9PiB7XG4gICAgICAgICAgc3dpcGVyLmNvbnRyb2xsZXIuY29udHJvbCA9IGUuZGV0YWlsWzBdO1xuICAgICAgICAgIHN3aXBlci51cGRhdGUoKTtcbiAgICAgICAgICBjb250cm9sRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdpbml0Jywgb25Db250cm9sbGVyU3dpcGVyKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29udHJvbEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignaW5pdCcsIG9uQ29udHJvbGxlclN3aXBlcik7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHN3aXBlci5jb250cm9sbGVyLmNvbnRyb2wgPSBzd2lwZXIucGFyYW1zLmNvbnRyb2xsZXIuY29udHJvbDtcbiAgfSk7XG4gIG9uKCd1cGRhdGUnLCAoKSA9PiB7XG4gICAgcmVtb3ZlU3BsaW5lKCk7XG4gIH0pO1xuICBvbigncmVzaXplJywgKCkgPT4ge1xuICAgIHJlbW92ZVNwbGluZSgpO1xuICB9KTtcbiAgb24oJ29ic2VydmVyVXBkYXRlJywgKCkgPT4ge1xuICAgIHJlbW92ZVNwbGluZSgpO1xuICB9KTtcbiAgb24oJ3NldFRyYW5zbGF0ZScsIChfcywgdHJhbnNsYXRlLCBieUNvbnRyb2xsZXIpID0+IHtcbiAgICBpZiAoIXN3aXBlci5jb250cm9sbGVyLmNvbnRyb2wgfHwgc3dpcGVyLmNvbnRyb2xsZXIuY29udHJvbC5kZXN0cm95ZWQpIHJldHVybjtcbiAgICBzd2lwZXIuY29udHJvbGxlci5zZXRUcmFuc2xhdGUodHJhbnNsYXRlLCBieUNvbnRyb2xsZXIpO1xuICB9KTtcbiAgb24oJ3NldFRyYW5zaXRpb24nLCAoX3MsIGR1cmF0aW9uLCBieUNvbnRyb2xsZXIpID0+IHtcbiAgICBpZiAoIXN3aXBlci5jb250cm9sbGVyLmNvbnRyb2wgfHwgc3dpcGVyLmNvbnRyb2xsZXIuY29udHJvbC5kZXN0cm95ZWQpIHJldHVybjtcbiAgICBzd2lwZXIuY29udHJvbGxlci5zZXRUcmFuc2l0aW9uKGR1cmF0aW9uLCBieUNvbnRyb2xsZXIpO1xuICB9KTtcbiAgT2JqZWN0LmFzc2lnbihzd2lwZXIuY29udHJvbGxlciwge1xuICAgIHNldFRyYW5zbGF0ZSxcbiAgICBzZXRUcmFuc2l0aW9uXG4gIH0pO1xufVxuXG5leHBvcnQgeyBDb250cm9sbGVyIGFzIGRlZmF1bHQgfTtcbiIsImltcG9ydCB7IGMgYXMgY2xhc3Nlc1RvU2VsZWN0b3IgfSBmcm9tICcuLi9zaGFyZWQvY2xhc3Nlcy10by1zZWxlY3Rvci5tanMnO1xuaW1wb3J0IHsgYyBhcyBjcmVhdGVFbGVtZW50LCBnIGFzIGVsZW1lbnRJbmRleCB9IGZyb20gJy4uL3NoYXJlZC91dGlscy5tanMnO1xuXG5mdW5jdGlvbiBBMTF5KF9yZWYpIHtcbiAgbGV0IHtcbiAgICBzd2lwZXIsXG4gICAgZXh0ZW5kUGFyYW1zLFxuICAgIG9uXG4gIH0gPSBfcmVmO1xuICBleHRlbmRQYXJhbXMoe1xuICAgIGExMXk6IHtcbiAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICBub3RpZmljYXRpb25DbGFzczogJ3N3aXBlci1ub3RpZmljYXRpb24nLFxuICAgICAgcHJldlNsaWRlTWVzc2FnZTogJ1ByZXZpb3VzIHNsaWRlJyxcbiAgICAgIG5leHRTbGlkZU1lc3NhZ2U6ICdOZXh0IHNsaWRlJyxcbiAgICAgIGZpcnN0U2xpZGVNZXNzYWdlOiAnVGhpcyBpcyB0aGUgZmlyc3Qgc2xpZGUnLFxuICAgICAgbGFzdFNsaWRlTWVzc2FnZTogJ1RoaXMgaXMgdGhlIGxhc3Qgc2xpZGUnLFxuICAgICAgcGFnaW5hdGlvbkJ1bGxldE1lc3NhZ2U6ICdHbyB0byBzbGlkZSB7e2luZGV4fX0nLFxuICAgICAgc2xpZGVMYWJlbE1lc3NhZ2U6ICd7e2luZGV4fX0gLyB7e3NsaWRlc0xlbmd0aH19JyxcbiAgICAgIGNvbnRhaW5lck1lc3NhZ2U6IG51bGwsXG4gICAgICBjb250YWluZXJSb2xlRGVzY3JpcHRpb25NZXNzYWdlOiBudWxsLFxuICAgICAgaXRlbVJvbGVEZXNjcmlwdGlvbk1lc3NhZ2U6IG51bGwsXG4gICAgICBzbGlkZVJvbGU6ICdncm91cCcsXG4gICAgICBpZDogbnVsbFxuICAgIH1cbiAgfSk7XG4gIHN3aXBlci5hMTF5ID0ge1xuICAgIGNsaWNrZWQ6IGZhbHNlXG4gIH07XG4gIGxldCBsaXZlUmVnaW9uID0gbnVsbDtcbiAgZnVuY3Rpb24gbm90aWZ5KG1lc3NhZ2UpIHtcbiAgICBjb25zdCBub3RpZmljYXRpb24gPSBsaXZlUmVnaW9uO1xuICAgIGlmIChub3RpZmljYXRpb24ubGVuZ3RoID09PSAwKSByZXR1cm47XG4gICAgbm90aWZpY2F0aW9uLmlubmVySFRNTCA9ICcnO1xuICAgIG5vdGlmaWNhdGlvbi5pbm5lckhUTUwgPSBtZXNzYWdlO1xuICB9XG4gIGNvbnN0IG1ha2VFbGVtZW50c0FycmF5ID0gZWwgPT4gKEFycmF5LmlzQXJyYXkoZWwpID8gZWwgOiBbZWxdKS5maWx0ZXIoZSA9PiAhIWUpO1xuICBmdW5jdGlvbiBnZXRSYW5kb21OdW1iZXIoc2l6ZSkge1xuICAgIGlmIChzaXplID09PSB2b2lkIDApIHtcbiAgICAgIHNpemUgPSAxNjtcbiAgICB9XG4gICAgY29uc3QgcmFuZG9tQ2hhciA9ICgpID0+IE1hdGgucm91bmQoMTYgKiBNYXRoLnJhbmRvbSgpKS50b1N0cmluZygxNik7XG4gICAgcmV0dXJuICd4Jy5yZXBlYXQoc2l6ZSkucmVwbGFjZSgveC9nLCByYW5kb21DaGFyKTtcbiAgfVxuICBmdW5jdGlvbiBtYWtlRWxGb2N1c2FibGUoZWwpIHtcbiAgICBlbCA9IG1ha2VFbGVtZW50c0FycmF5KGVsKTtcbiAgICBlbC5mb3JFYWNoKHN1YkVsID0+IHtcbiAgICAgIHN1YkVsLnNldEF0dHJpYnV0ZSgndGFiSW5kZXgnLCAnMCcpO1xuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIG1ha2VFbE5vdEZvY3VzYWJsZShlbCkge1xuICAgIGVsID0gbWFrZUVsZW1lbnRzQXJyYXkoZWwpO1xuICAgIGVsLmZvckVhY2goc3ViRWwgPT4ge1xuICAgICAgc3ViRWwuc2V0QXR0cmlidXRlKCd0YWJJbmRleCcsICctMScpO1xuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIGFkZEVsUm9sZShlbCwgcm9sZSkge1xuICAgIGVsID0gbWFrZUVsZW1lbnRzQXJyYXkoZWwpO1xuICAgIGVsLmZvckVhY2goc3ViRWwgPT4ge1xuICAgICAgc3ViRWwuc2V0QXR0cmlidXRlKCdyb2xlJywgcm9sZSk7XG4gICAgfSk7XG4gIH1cbiAgZnVuY3Rpb24gYWRkRWxSb2xlRGVzY3JpcHRpb24oZWwsIGRlc2NyaXB0aW9uKSB7XG4gICAgZWwgPSBtYWtlRWxlbWVudHNBcnJheShlbCk7XG4gICAgZWwuZm9yRWFjaChzdWJFbCA9PiB7XG4gICAgICBzdWJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtcm9sZWRlc2NyaXB0aW9uJywgZGVzY3JpcHRpb24pO1xuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIGFkZEVsQ29udHJvbHMoZWwsIGNvbnRyb2xzKSB7XG4gICAgZWwgPSBtYWtlRWxlbWVudHNBcnJheShlbCk7XG4gICAgZWwuZm9yRWFjaChzdWJFbCA9PiB7XG4gICAgICBzdWJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtY29udHJvbHMnLCBjb250cm9scyk7XG4gICAgfSk7XG4gIH1cbiAgZnVuY3Rpb24gYWRkRWxMYWJlbChlbCwgbGFiZWwpIHtcbiAgICBlbCA9IG1ha2VFbGVtZW50c0FycmF5KGVsKTtcbiAgICBlbC5mb3JFYWNoKHN1YkVsID0+IHtcbiAgICAgIHN1YkVsLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIGxhYmVsKTtcbiAgICB9KTtcbiAgfVxuICBmdW5jdGlvbiBhZGRFbElkKGVsLCBpZCkge1xuICAgIGVsID0gbWFrZUVsZW1lbnRzQXJyYXkoZWwpO1xuICAgIGVsLmZvckVhY2goc3ViRWwgPT4ge1xuICAgICAgc3ViRWwuc2V0QXR0cmlidXRlKCdpZCcsIGlkKTtcbiAgICB9KTtcbiAgfVxuICBmdW5jdGlvbiBhZGRFbExpdmUoZWwsIGxpdmUpIHtcbiAgICBlbCA9IG1ha2VFbGVtZW50c0FycmF5KGVsKTtcbiAgICBlbC5mb3JFYWNoKHN1YkVsID0+IHtcbiAgICAgIHN1YkVsLnNldEF0dHJpYnV0ZSgnYXJpYS1saXZlJywgbGl2ZSk7XG4gICAgfSk7XG4gIH1cbiAgZnVuY3Rpb24gZGlzYWJsZUVsKGVsKSB7XG4gICAgZWwgPSBtYWtlRWxlbWVudHNBcnJheShlbCk7XG4gICAgZWwuZm9yRWFjaChzdWJFbCA9PiB7XG4gICAgICBzdWJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZGlzYWJsZWQnLCB0cnVlKTtcbiAgICB9KTtcbiAgfVxuICBmdW5jdGlvbiBlbmFibGVFbChlbCkge1xuICAgIGVsID0gbWFrZUVsZW1lbnRzQXJyYXkoZWwpO1xuICAgIGVsLmZvckVhY2goc3ViRWwgPT4ge1xuICAgICAgc3ViRWwuc2V0QXR0cmlidXRlKCdhcmlhLWRpc2FibGVkJywgZmFsc2UpO1xuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIG9uRW50ZXJPclNwYWNlS2V5KGUpIHtcbiAgICBpZiAoZS5rZXlDb2RlICE9PSAxMyAmJiBlLmtleUNvZGUgIT09IDMyKSByZXR1cm47XG4gICAgY29uc3QgcGFyYW1zID0gc3dpcGVyLnBhcmFtcy5hMTF5O1xuICAgIGNvbnN0IHRhcmdldEVsID0gZS50YXJnZXQ7XG4gICAgaWYgKHN3aXBlci5wYWdpbmF0aW9uICYmIHN3aXBlci5wYWdpbmF0aW9uLmVsICYmICh0YXJnZXRFbCA9PT0gc3dpcGVyLnBhZ2luYXRpb24uZWwgfHwgc3dpcGVyLnBhZ2luYXRpb24uZWwuY29udGFpbnMoZS50YXJnZXQpKSkge1xuICAgICAgaWYgKCFlLnRhcmdldC5tYXRjaGVzKGNsYXNzZXNUb1NlbGVjdG9yKHN3aXBlci5wYXJhbXMucGFnaW5hdGlvbi5idWxsZXRDbGFzcykpKSByZXR1cm47XG4gICAgfVxuICAgIGlmIChzd2lwZXIubmF2aWdhdGlvbiAmJiBzd2lwZXIubmF2aWdhdGlvbi5uZXh0RWwgJiYgdGFyZ2V0RWwgPT09IHN3aXBlci5uYXZpZ2F0aW9uLm5leHRFbCkge1xuICAgICAgaWYgKCEoc3dpcGVyLmlzRW5kICYmICFzd2lwZXIucGFyYW1zLmxvb3ApKSB7XG4gICAgICAgIHN3aXBlci5zbGlkZU5leHQoKTtcbiAgICAgIH1cbiAgICAgIGlmIChzd2lwZXIuaXNFbmQpIHtcbiAgICAgICAgbm90aWZ5KHBhcmFtcy5sYXN0U2xpZGVNZXNzYWdlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5vdGlmeShwYXJhbXMubmV4dFNsaWRlTWVzc2FnZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChzd2lwZXIubmF2aWdhdGlvbiAmJiBzd2lwZXIubmF2aWdhdGlvbi5wcmV2RWwgJiYgdGFyZ2V0RWwgPT09IHN3aXBlci5uYXZpZ2F0aW9uLnByZXZFbCkge1xuICAgICAgaWYgKCEoc3dpcGVyLmlzQmVnaW5uaW5nICYmICFzd2lwZXIucGFyYW1zLmxvb3ApKSB7XG4gICAgICAgIHN3aXBlci5zbGlkZVByZXYoKTtcbiAgICAgIH1cbiAgICAgIGlmIChzd2lwZXIuaXNCZWdpbm5pbmcpIHtcbiAgICAgICAgbm90aWZ5KHBhcmFtcy5maXJzdFNsaWRlTWVzc2FnZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBub3RpZnkocGFyYW1zLnByZXZTbGlkZU1lc3NhZ2UpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoc3dpcGVyLnBhZ2luYXRpb24gJiYgdGFyZ2V0RWwubWF0Y2hlcyhjbGFzc2VzVG9TZWxlY3Rvcihzd2lwZXIucGFyYW1zLnBhZ2luYXRpb24uYnVsbGV0Q2xhc3MpKSkge1xuICAgICAgdGFyZ2V0RWwuY2xpY2soKTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gdXBkYXRlTmF2aWdhdGlvbigpIHtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5sb29wIHx8IHN3aXBlci5wYXJhbXMucmV3aW5kIHx8ICFzd2lwZXIubmF2aWdhdGlvbikgcmV0dXJuO1xuICAgIGNvbnN0IHtcbiAgICAgIG5leHRFbCxcbiAgICAgIHByZXZFbFxuICAgIH0gPSBzd2lwZXIubmF2aWdhdGlvbjtcbiAgICBpZiAocHJldkVsKSB7XG4gICAgICBpZiAoc3dpcGVyLmlzQmVnaW5uaW5nKSB7XG4gICAgICAgIGRpc2FibGVFbChwcmV2RWwpO1xuICAgICAgICBtYWtlRWxOb3RGb2N1c2FibGUocHJldkVsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVuYWJsZUVsKHByZXZFbCk7XG4gICAgICAgIG1ha2VFbEZvY3VzYWJsZShwcmV2RWwpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAobmV4dEVsKSB7XG4gICAgICBpZiAoc3dpcGVyLmlzRW5kKSB7XG4gICAgICAgIGRpc2FibGVFbChuZXh0RWwpO1xuICAgICAgICBtYWtlRWxOb3RGb2N1c2FibGUobmV4dEVsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVuYWJsZUVsKG5leHRFbCk7XG4gICAgICAgIG1ha2VFbEZvY3VzYWJsZShuZXh0RWwpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBoYXNQYWdpbmF0aW9uKCkge1xuICAgIHJldHVybiBzd2lwZXIucGFnaW5hdGlvbiAmJiBzd2lwZXIucGFnaW5hdGlvbi5idWxsZXRzICYmIHN3aXBlci5wYWdpbmF0aW9uLmJ1bGxldHMubGVuZ3RoO1xuICB9XG4gIGZ1bmN0aW9uIGhhc0NsaWNrYWJsZVBhZ2luYXRpb24oKSB7XG4gICAgcmV0dXJuIGhhc1BhZ2luYXRpb24oKSAmJiBzd2lwZXIucGFyYW1zLnBhZ2luYXRpb24uY2xpY2thYmxlO1xuICB9XG4gIGZ1bmN0aW9uIHVwZGF0ZVBhZ2luYXRpb24oKSB7XG4gICAgY29uc3QgcGFyYW1zID0gc3dpcGVyLnBhcmFtcy5hMTF5O1xuICAgIGlmICghaGFzUGFnaW5hdGlvbigpKSByZXR1cm47XG4gICAgc3dpcGVyLnBhZ2luYXRpb24uYnVsbGV0cy5mb3JFYWNoKGJ1bGxldEVsID0+IHtcbiAgICAgIGlmIChzd2lwZXIucGFyYW1zLnBhZ2luYXRpb24uY2xpY2thYmxlKSB7XG4gICAgICAgIG1ha2VFbEZvY3VzYWJsZShidWxsZXRFbCk7XG4gICAgICAgIGlmICghc3dpcGVyLnBhcmFtcy5wYWdpbmF0aW9uLnJlbmRlckJ1bGxldCkge1xuICAgICAgICAgIGFkZEVsUm9sZShidWxsZXRFbCwgJ2J1dHRvbicpO1xuICAgICAgICAgIGFkZEVsTGFiZWwoYnVsbGV0RWwsIHBhcmFtcy5wYWdpbmF0aW9uQnVsbGV0TWVzc2FnZS5yZXBsYWNlKC9cXHtcXHtpbmRleFxcfVxcfS8sIGVsZW1lbnRJbmRleChidWxsZXRFbCkgKyAxKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChidWxsZXRFbC5tYXRjaGVzKGNsYXNzZXNUb1NlbGVjdG9yKHN3aXBlci5wYXJhbXMucGFnaW5hdGlvbi5idWxsZXRBY3RpdmVDbGFzcykpKSB7XG4gICAgICAgIGJ1bGxldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1jdXJyZW50JywgJ3RydWUnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJ1bGxldEVsLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1jdXJyZW50Jyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgY29uc3QgaW5pdE5hdkVsID0gKGVsLCB3cmFwcGVySWQsIG1lc3NhZ2UpID0+IHtcbiAgICBtYWtlRWxGb2N1c2FibGUoZWwpO1xuICAgIGlmIChlbC50YWdOYW1lICE9PSAnQlVUVE9OJykge1xuICAgICAgYWRkRWxSb2xlKGVsLCAnYnV0dG9uJyk7XG4gICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25FbnRlck9yU3BhY2VLZXkpO1xuICAgIH1cbiAgICBhZGRFbExhYmVsKGVsLCBtZXNzYWdlKTtcbiAgICBhZGRFbENvbnRyb2xzKGVsLCB3cmFwcGVySWQpO1xuICB9O1xuICBjb25zdCBoYW5kbGVQb2ludGVyRG93biA9ICgpID0+IHtcbiAgICBzd2lwZXIuYTExeS5jbGlja2VkID0gdHJ1ZTtcbiAgfTtcbiAgY29uc3QgaGFuZGxlUG9pbnRlclVwID0gKCkgPT4ge1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICBpZiAoIXN3aXBlci5kZXN0cm95ZWQpIHtcbiAgICAgICAgICBzd2lwZXIuYTExeS5jbGlja2VkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuICBjb25zdCBoYW5kbGVGb2N1cyA9IGUgPT4ge1xuICAgIGlmIChzd2lwZXIuYTExeS5jbGlja2VkKSByZXR1cm47XG4gICAgY29uc3Qgc2xpZGVFbCA9IGUudGFyZ2V0LmNsb3Nlc3QoYC4ke3N3aXBlci5wYXJhbXMuc2xpZGVDbGFzc30sIHN3aXBlci1zbGlkZWApO1xuICAgIGlmICghc2xpZGVFbCB8fCAhc3dpcGVyLnNsaWRlcy5pbmNsdWRlcyhzbGlkZUVsKSkgcmV0dXJuO1xuICAgIGNvbnN0IGlzQWN0aXZlID0gc3dpcGVyLnNsaWRlcy5pbmRleE9mKHNsaWRlRWwpID09PSBzd2lwZXIuYWN0aXZlSW5kZXg7XG4gICAgY29uc3QgaXNWaXNpYmxlID0gc3dpcGVyLnBhcmFtcy53YXRjaFNsaWRlc1Byb2dyZXNzICYmIHN3aXBlci52aXNpYmxlU2xpZGVzICYmIHN3aXBlci52aXNpYmxlU2xpZGVzLmluY2x1ZGVzKHNsaWRlRWwpO1xuICAgIGlmIChpc0FjdGl2ZSB8fCBpc1Zpc2libGUpIHJldHVybjtcbiAgICBpZiAoZS5zb3VyY2VDYXBhYmlsaXRpZXMgJiYgZS5zb3VyY2VDYXBhYmlsaXRpZXMuZmlyZXNUb3VjaEV2ZW50cykgcmV0dXJuO1xuICAgIGlmIChzd2lwZXIuaXNIb3Jpem9udGFsKCkpIHtcbiAgICAgIHN3aXBlci5lbC5zY3JvbGxMZWZ0ID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgc3dpcGVyLmVsLnNjcm9sbFRvcCA9IDA7XG4gICAgfVxuICAgIHN3aXBlci5zbGlkZVRvKHN3aXBlci5zbGlkZXMuaW5kZXhPZihzbGlkZUVsKSwgMCk7XG4gIH07XG4gIGNvbnN0IGluaXRTbGlkZXMgPSAoKSA9PiB7XG4gICAgY29uc3QgcGFyYW1zID0gc3dpcGVyLnBhcmFtcy5hMTF5O1xuICAgIGlmIChwYXJhbXMuaXRlbVJvbGVEZXNjcmlwdGlvbk1lc3NhZ2UpIHtcbiAgICAgIGFkZEVsUm9sZURlc2NyaXB0aW9uKHN3aXBlci5zbGlkZXMsIHBhcmFtcy5pdGVtUm9sZURlc2NyaXB0aW9uTWVzc2FnZSk7XG4gICAgfVxuICAgIGlmIChwYXJhbXMuc2xpZGVSb2xlKSB7XG4gICAgICBhZGRFbFJvbGUoc3dpcGVyLnNsaWRlcywgcGFyYW1zLnNsaWRlUm9sZSk7XG4gICAgfVxuICAgIGNvbnN0IHNsaWRlc0xlbmd0aCA9IHN3aXBlci5zbGlkZXMubGVuZ3RoO1xuICAgIGlmIChwYXJhbXMuc2xpZGVMYWJlbE1lc3NhZ2UpIHtcbiAgICAgIHN3aXBlci5zbGlkZXMuZm9yRWFjaCgoc2xpZGVFbCwgaW5kZXgpID0+IHtcbiAgICAgICAgY29uc3Qgc2xpZGVJbmRleCA9IHN3aXBlci5wYXJhbXMubG9vcCA/IHBhcnNlSW50KHNsaWRlRWwuZ2V0QXR0cmlidXRlKCdkYXRhLXN3aXBlci1zbGlkZS1pbmRleCcpLCAxMCkgOiBpbmRleDtcbiAgICAgICAgY29uc3QgYXJpYUxhYmVsTWVzc2FnZSA9IHBhcmFtcy5zbGlkZUxhYmVsTWVzc2FnZS5yZXBsYWNlKC9cXHtcXHtpbmRleFxcfVxcfS8sIHNsaWRlSW5kZXggKyAxKS5yZXBsYWNlKC9cXHtcXHtzbGlkZXNMZW5ndGhcXH1cXH0vLCBzbGlkZXNMZW5ndGgpO1xuICAgICAgICBhZGRFbExhYmVsKHNsaWRlRWwsIGFyaWFMYWJlbE1lc3NhZ2UpO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xuICBjb25zdCBpbml0ID0gKCkgPT4ge1xuICAgIGNvbnN0IHBhcmFtcyA9IHN3aXBlci5wYXJhbXMuYTExeTtcbiAgICBzd2lwZXIuZWwuYXBwZW5kKGxpdmVSZWdpb24pO1xuXG4gICAgLy8gQ29udGFpbmVyXG4gICAgY29uc3QgY29udGFpbmVyRWwgPSBzd2lwZXIuZWw7XG4gICAgaWYgKHBhcmFtcy5jb250YWluZXJSb2xlRGVzY3JpcHRpb25NZXNzYWdlKSB7XG4gICAgICBhZGRFbFJvbGVEZXNjcmlwdGlvbihjb250YWluZXJFbCwgcGFyYW1zLmNvbnRhaW5lclJvbGVEZXNjcmlwdGlvbk1lc3NhZ2UpO1xuICAgIH1cbiAgICBpZiAocGFyYW1zLmNvbnRhaW5lck1lc3NhZ2UpIHtcbiAgICAgIGFkZEVsTGFiZWwoY29udGFpbmVyRWwsIHBhcmFtcy5jb250YWluZXJNZXNzYWdlKTtcbiAgICB9XG5cbiAgICAvLyBXcmFwcGVyXG4gICAgY29uc3Qgd3JhcHBlckVsID0gc3dpcGVyLndyYXBwZXJFbDtcbiAgICBjb25zdCB3cmFwcGVySWQgPSBwYXJhbXMuaWQgfHwgd3JhcHBlckVsLmdldEF0dHJpYnV0ZSgnaWQnKSB8fCBgc3dpcGVyLXdyYXBwZXItJHtnZXRSYW5kb21OdW1iZXIoMTYpfWA7XG4gICAgY29uc3QgbGl2ZSA9IHN3aXBlci5wYXJhbXMuYXV0b3BsYXkgJiYgc3dpcGVyLnBhcmFtcy5hdXRvcGxheS5lbmFibGVkID8gJ29mZicgOiAncG9saXRlJztcbiAgICBhZGRFbElkKHdyYXBwZXJFbCwgd3JhcHBlcklkKTtcbiAgICBhZGRFbExpdmUod3JhcHBlckVsLCBsaXZlKTtcblxuICAgIC8vIFNsaWRlXG4gICAgaW5pdFNsaWRlcygpO1xuXG4gICAgLy8gTmF2aWdhdGlvblxuICAgIGxldCB7XG4gICAgICBuZXh0RWwsXG4gICAgICBwcmV2RWxcbiAgICB9ID0gc3dpcGVyLm5hdmlnYXRpb24gPyBzd2lwZXIubmF2aWdhdGlvbiA6IHt9O1xuICAgIG5leHRFbCA9IG1ha2VFbGVtZW50c0FycmF5KG5leHRFbCk7XG4gICAgcHJldkVsID0gbWFrZUVsZW1lbnRzQXJyYXkocHJldkVsKTtcbiAgICBpZiAobmV4dEVsKSB7XG4gICAgICBuZXh0RWwuZm9yRWFjaChlbCA9PiBpbml0TmF2RWwoZWwsIHdyYXBwZXJJZCwgcGFyYW1zLm5leHRTbGlkZU1lc3NhZ2UpKTtcbiAgICB9XG4gICAgaWYgKHByZXZFbCkge1xuICAgICAgcHJldkVsLmZvckVhY2goZWwgPT4gaW5pdE5hdkVsKGVsLCB3cmFwcGVySWQsIHBhcmFtcy5wcmV2U2xpZGVNZXNzYWdlKSk7XG4gICAgfVxuXG4gICAgLy8gUGFnaW5hdGlvblxuICAgIGlmIChoYXNDbGlja2FibGVQYWdpbmF0aW9uKCkpIHtcbiAgICAgIGNvbnN0IHBhZ2luYXRpb25FbCA9IG1ha2VFbGVtZW50c0FycmF5KHN3aXBlci5wYWdpbmF0aW9uLmVsKTtcbiAgICAgIHBhZ2luYXRpb25FbC5mb3JFYWNoKGVsID0+IHtcbiAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uRW50ZXJPclNwYWNlS2V5KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFRhYiBmb2N1c1xuICAgIHN3aXBlci5lbC5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIGhhbmRsZUZvY3VzLCB0cnVlKTtcbiAgICBzd2lwZXIuZWwuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcmRvd24nLCBoYW5kbGVQb2ludGVyRG93biwgdHJ1ZSk7XG4gICAgc3dpcGVyLmVsLmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsIGhhbmRsZVBvaW50ZXJVcCwgdHJ1ZSk7XG4gIH07XG4gIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgaWYgKGxpdmVSZWdpb24pIGxpdmVSZWdpb24ucmVtb3ZlKCk7XG4gICAgbGV0IHtcbiAgICAgIG5leHRFbCxcbiAgICAgIHByZXZFbFxuICAgIH0gPSBzd2lwZXIubmF2aWdhdGlvbiA/IHN3aXBlci5uYXZpZ2F0aW9uIDoge307XG4gICAgbmV4dEVsID0gbWFrZUVsZW1lbnRzQXJyYXkobmV4dEVsKTtcbiAgICBwcmV2RWwgPSBtYWtlRWxlbWVudHNBcnJheShwcmV2RWwpO1xuICAgIGlmIChuZXh0RWwpIHtcbiAgICAgIG5leHRFbC5mb3JFYWNoKGVsID0+IGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbkVudGVyT3JTcGFjZUtleSkpO1xuICAgIH1cbiAgICBpZiAocHJldkVsKSB7XG4gICAgICBwcmV2RWwuZm9yRWFjaChlbCA9PiBlbC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25FbnRlck9yU3BhY2VLZXkpKTtcbiAgICB9XG5cbiAgICAvLyBQYWdpbmF0aW9uXG4gICAgaWYgKGhhc0NsaWNrYWJsZVBhZ2luYXRpb24oKSkge1xuICAgICAgY29uc3QgcGFnaW5hdGlvbkVsID0gbWFrZUVsZW1lbnRzQXJyYXkoc3dpcGVyLnBhZ2luYXRpb24uZWwpO1xuICAgICAgcGFnaW5hdGlvbkVsLmZvckVhY2goZWwgPT4ge1xuICAgICAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25FbnRlck9yU3BhY2VLZXkpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gVGFiIGZvY3VzXG4gICAgc3dpcGVyLmVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgaGFuZGxlRm9jdXMsIHRydWUpO1xuICAgIHN3aXBlci5lbC5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVyZG93bicsIGhhbmRsZVBvaW50ZXJEb3duLCB0cnVlKTtcbiAgICBzd2lwZXIuZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcnVwJywgaGFuZGxlUG9pbnRlclVwLCB0cnVlKTtcbiAgfVxuICBvbignYmVmb3JlSW5pdCcsICgpID0+IHtcbiAgICBsaXZlUmVnaW9uID0gY3JlYXRlRWxlbWVudCgnc3BhbicsIHN3aXBlci5wYXJhbXMuYTExeS5ub3RpZmljYXRpb25DbGFzcyk7XG4gICAgbGl2ZVJlZ2lvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGl2ZScsICdhc3NlcnRpdmUnKTtcbiAgICBsaXZlUmVnaW9uLnNldEF0dHJpYnV0ZSgnYXJpYS1hdG9taWMnLCAndHJ1ZScpO1xuICB9KTtcbiAgb24oJ2FmdGVySW5pdCcsICgpID0+IHtcbiAgICBpZiAoIXN3aXBlci5wYXJhbXMuYTExeS5lbmFibGVkKSByZXR1cm47XG4gICAgaW5pdCgpO1xuICB9KTtcbiAgb24oJ3NsaWRlc0xlbmd0aENoYW5nZSBzbmFwR3JpZExlbmd0aENoYW5nZSBzbGlkZXNHcmlkTGVuZ3RoQ2hhbmdlJywgKCkgPT4ge1xuICAgIGlmICghc3dpcGVyLnBhcmFtcy5hMTF5LmVuYWJsZWQpIHJldHVybjtcbiAgICBpbml0U2xpZGVzKCk7XG4gIH0pO1xuICBvbignZnJvbUVkZ2UgdG9FZGdlIGFmdGVySW5pdCBsb2NrIHVubG9jaycsICgpID0+IHtcbiAgICBpZiAoIXN3aXBlci5wYXJhbXMuYTExeS5lbmFibGVkKSByZXR1cm47XG4gICAgdXBkYXRlTmF2aWdhdGlvbigpO1xuICB9KTtcbiAgb24oJ3BhZ2luYXRpb25VcGRhdGUnLCAoKSA9PiB7XG4gICAgaWYgKCFzd2lwZXIucGFyYW1zLmExMXkuZW5hYmxlZCkgcmV0dXJuO1xuICAgIHVwZGF0ZVBhZ2luYXRpb24oKTtcbiAgfSk7XG4gIG9uKCdkZXN0cm95JywgKCkgPT4ge1xuICAgIGlmICghc3dpcGVyLnBhcmFtcy5hMTF5LmVuYWJsZWQpIHJldHVybjtcbiAgICBkZXN0cm95KCk7XG4gIH0pO1xufVxuXG5leHBvcnQgeyBBMTF5IGFzIGRlZmF1bHQgfTtcbiIsImltcG9ydCB7IGEgYXMgZ2V0V2luZG93IH0gZnJvbSAnLi4vc2hhcmVkL3Nzci13aW5kb3cuZXNtLm1qcyc7XG5cbmZ1bmN0aW9uIEhpc3RvcnkoX3JlZikge1xuICBsZXQge1xuICAgIHN3aXBlcixcbiAgICBleHRlbmRQYXJhbXMsXG4gICAgb25cbiAgfSA9IF9yZWY7XG4gIGV4dGVuZFBhcmFtcyh7XG4gICAgaGlzdG9yeToge1xuICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICByb290OiAnJyxcbiAgICAgIHJlcGxhY2VTdGF0ZTogZmFsc2UsXG4gICAgICBrZXk6ICdzbGlkZXMnLFxuICAgICAga2VlcFF1ZXJ5OiBmYWxzZVxuICAgIH1cbiAgfSk7XG4gIGxldCBpbml0aWFsaXplZCA9IGZhbHNlO1xuICBsZXQgcGF0aHMgPSB7fTtcbiAgY29uc3Qgc2x1Z2lmeSA9IHRleHQgPT4ge1xuICAgIHJldHVybiB0ZXh0LnRvU3RyaW5nKCkucmVwbGFjZSgvXFxzKy9nLCAnLScpLnJlcGxhY2UoL1teXFx3LV0rL2csICcnKS5yZXBsYWNlKC8tLSsvZywgJy0nKS5yZXBsYWNlKC9eLSsvLCAnJykucmVwbGFjZSgvLSskLywgJycpO1xuICB9O1xuICBjb25zdCBnZXRQYXRoVmFsdWVzID0gdXJsT3ZlcnJpZGUgPT4ge1xuICAgIGNvbnN0IHdpbmRvdyA9IGdldFdpbmRvdygpO1xuICAgIGxldCBsb2NhdGlvbjtcbiAgICBpZiAodXJsT3ZlcnJpZGUpIHtcbiAgICAgIGxvY2F0aW9uID0gbmV3IFVSTCh1cmxPdmVycmlkZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvY2F0aW9uID0gd2luZG93LmxvY2F0aW9uO1xuICAgIH1cbiAgICBjb25zdCBwYXRoQXJyYXkgPSBsb2NhdGlvbi5wYXRobmFtZS5zbGljZSgxKS5zcGxpdCgnLycpLmZpbHRlcihwYXJ0ID0+IHBhcnQgIT09ICcnKTtcbiAgICBjb25zdCB0b3RhbCA9IHBhdGhBcnJheS5sZW5ndGg7XG4gICAgY29uc3Qga2V5ID0gcGF0aEFycmF5W3RvdGFsIC0gMl07XG4gICAgY29uc3QgdmFsdWUgPSBwYXRoQXJyYXlbdG90YWwgLSAxXTtcbiAgICByZXR1cm4ge1xuICAgICAga2V5LFxuICAgICAgdmFsdWVcbiAgICB9O1xuICB9O1xuICBjb25zdCBzZXRIaXN0b3J5ID0gKGtleSwgaW5kZXgpID0+IHtcbiAgICBjb25zdCB3aW5kb3cgPSBnZXRXaW5kb3coKTtcbiAgICBpZiAoIWluaXRpYWxpemVkIHx8ICFzd2lwZXIucGFyYW1zLmhpc3RvcnkuZW5hYmxlZCkgcmV0dXJuO1xuICAgIGxldCBsb2NhdGlvbjtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy51cmwpIHtcbiAgICAgIGxvY2F0aW9uID0gbmV3IFVSTChzd2lwZXIucGFyYW1zLnVybCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvY2F0aW9uID0gd2luZG93LmxvY2F0aW9uO1xuICAgIH1cbiAgICBjb25zdCBzbGlkZSA9IHN3aXBlci5zbGlkZXNbaW5kZXhdO1xuICAgIGxldCB2YWx1ZSA9IHNsdWdpZnkoc2xpZGUuZ2V0QXR0cmlidXRlKCdkYXRhLWhpc3RvcnknKSk7XG4gICAgaWYgKHN3aXBlci5wYXJhbXMuaGlzdG9yeS5yb290Lmxlbmd0aCA+IDApIHtcbiAgICAgIGxldCByb290ID0gc3dpcGVyLnBhcmFtcy5oaXN0b3J5LnJvb3Q7XG4gICAgICBpZiAocm9vdFtyb290Lmxlbmd0aCAtIDFdID09PSAnLycpIHJvb3QgPSByb290LnNsaWNlKDAsIHJvb3QubGVuZ3RoIC0gMSk7XG4gICAgICB2YWx1ZSA9IGAke3Jvb3R9LyR7a2V5ID8gYCR7a2V5fS9gIDogJyd9JHt2YWx1ZX1gO1xuICAgIH0gZWxzZSBpZiAoIWxvY2F0aW9uLnBhdGhuYW1lLmluY2x1ZGVzKGtleSkpIHtcbiAgICAgIHZhbHVlID0gYCR7a2V5ID8gYCR7a2V5fS9gIDogJyd9JHt2YWx1ZX1gO1xuICAgIH1cbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5oaXN0b3J5LmtlZXBRdWVyeSkge1xuICAgICAgdmFsdWUgKz0gbG9jYXRpb24uc2VhcmNoO1xuICAgIH1cbiAgICBjb25zdCBjdXJyZW50U3RhdGUgPSB3aW5kb3cuaGlzdG9yeS5zdGF0ZTtcbiAgICBpZiAoY3VycmVudFN0YXRlICYmIGN1cnJlbnRTdGF0ZS52YWx1ZSA9PT0gdmFsdWUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHN3aXBlci5wYXJhbXMuaGlzdG9yeS5yZXBsYWNlU3RhdGUpIHtcbiAgICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSh7XG4gICAgICAgIHZhbHVlXG4gICAgICB9LCBudWxsLCB2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSh7XG4gICAgICAgIHZhbHVlXG4gICAgICB9LCBudWxsLCB2YWx1ZSk7XG4gICAgfVxuICB9O1xuICBjb25zdCBzY3JvbGxUb1NsaWRlID0gKHNwZWVkLCB2YWx1ZSwgcnVuQ2FsbGJhY2tzKSA9PiB7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICBmb3IgKGxldCBpID0gMCwgbGVuZ3RoID0gc3dpcGVyLnNsaWRlcy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjb25zdCBzbGlkZSA9IHN3aXBlci5zbGlkZXNbaV07XG4gICAgICAgIGNvbnN0IHNsaWRlSGlzdG9yeSA9IHNsdWdpZnkoc2xpZGUuZ2V0QXR0cmlidXRlKCdkYXRhLWhpc3RvcnknKSk7XG4gICAgICAgIGlmIChzbGlkZUhpc3RvcnkgPT09IHZhbHVlKSB7XG4gICAgICAgICAgY29uc3QgaW5kZXggPSBzd2lwZXIuZ2V0U2xpZGVJbmRleChzbGlkZSk7XG4gICAgICAgICAgc3dpcGVyLnNsaWRlVG8oaW5kZXgsIHNwZWVkLCBydW5DYWxsYmFja3MpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN3aXBlci5zbGlkZVRvKDAsIHNwZWVkLCBydW5DYWxsYmFja3MpO1xuICAgIH1cbiAgfTtcbiAgY29uc3Qgc2V0SGlzdG9yeVBvcFN0YXRlID0gKCkgPT4ge1xuICAgIHBhdGhzID0gZ2V0UGF0aFZhbHVlcyhzd2lwZXIucGFyYW1zLnVybCk7XG4gICAgc2Nyb2xsVG9TbGlkZShzd2lwZXIucGFyYW1zLnNwZWVkLCBwYXRocy52YWx1ZSwgZmFsc2UpO1xuICB9O1xuICBjb25zdCBpbml0ID0gKCkgPT4ge1xuICAgIGNvbnN0IHdpbmRvdyA9IGdldFdpbmRvdygpO1xuICAgIGlmICghc3dpcGVyLnBhcmFtcy5oaXN0b3J5KSByZXR1cm47XG4gICAgaWYgKCF3aW5kb3cuaGlzdG9yeSB8fCAhd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKSB7XG4gICAgICBzd2lwZXIucGFyYW1zLmhpc3RvcnkuZW5hYmxlZCA9IGZhbHNlO1xuICAgICAgc3dpcGVyLnBhcmFtcy5oYXNoTmF2aWdhdGlvbi5lbmFibGVkID0gdHJ1ZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgIHBhdGhzID0gZ2V0UGF0aFZhbHVlcyhzd2lwZXIucGFyYW1zLnVybCk7XG4gICAgaWYgKCFwYXRocy5rZXkgJiYgIXBhdGhzLnZhbHVlKSB7XG4gICAgICBpZiAoIXN3aXBlci5wYXJhbXMuaGlzdG9yeS5yZXBsYWNlU3RhdGUpIHtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgc2V0SGlzdG9yeVBvcFN0YXRlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc2Nyb2xsVG9TbGlkZSgwLCBwYXRocy52YWx1ZSwgc3dpcGVyLnBhcmFtcy5ydW5DYWxsYmFja3NPbkluaXQpO1xuICAgIGlmICghc3dpcGVyLnBhcmFtcy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSkge1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgc2V0SGlzdG9yeVBvcFN0YXRlKTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IGRlc3Ryb3kgPSAoKSA9PiB7XG4gICAgY29uc3Qgd2luZG93ID0gZ2V0V2luZG93KCk7XG4gICAgaWYgKCFzd2lwZXIucGFyYW1zLmhpc3RvcnkucmVwbGFjZVN0YXRlKSB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBzZXRIaXN0b3J5UG9wU3RhdGUpO1xuICAgIH1cbiAgfTtcbiAgb24oJ2luaXQnLCAoKSA9PiB7XG4gICAgaWYgKHN3aXBlci5wYXJhbXMuaGlzdG9yeS5lbmFibGVkKSB7XG4gICAgICBpbml0KCk7XG4gICAgfVxuICB9KTtcbiAgb24oJ2Rlc3Ryb3knLCAoKSA9PiB7XG4gICAgaWYgKHN3aXBlci5wYXJhbXMuaGlzdG9yeS5lbmFibGVkKSB7XG4gICAgICBkZXN0cm95KCk7XG4gICAgfVxuICB9KTtcbiAgb24oJ3RyYW5zaXRpb25FbmQgX2ZyZWVNb2RlTm9Nb21lbnR1bVJlbGVhc2UnLCAoKSA9PiB7XG4gICAgaWYgKGluaXRpYWxpemVkKSB7XG4gICAgICBzZXRIaXN0b3J5KHN3aXBlci5wYXJhbXMuaGlzdG9yeS5rZXksIHN3aXBlci5hY3RpdmVJbmRleCk7XG4gICAgfVxuICB9KTtcbiAgb24oJ3NsaWRlQ2hhbmdlJywgKCkgPT4ge1xuICAgIGlmIChpbml0aWFsaXplZCAmJiBzd2lwZXIucGFyYW1zLmNzc01vZGUpIHtcbiAgICAgIHNldEhpc3Rvcnkoc3dpcGVyLnBhcmFtcy5oaXN0b3J5LmtleSwgc3dpcGVyLmFjdGl2ZUluZGV4KTtcbiAgICB9XG4gIH0pO1xufVxuXG5leHBvcnQgeyBIaXN0b3J5IGFzIGRlZmF1bHQgfTtcbiIsImltcG9ydCB7IGcgYXMgZ2V0RG9jdW1lbnQsIGEgYXMgZ2V0V2luZG93IH0gZnJvbSAnLi4vc2hhcmVkL3Nzci13aW5kb3cuZXNtLm1qcyc7XG5pbXBvcnQgeyBlIGFzIGVsZW1lbnRDaGlsZHJlbiB9IGZyb20gJy4uL3NoYXJlZC91dGlscy5tanMnO1xuXG5mdW5jdGlvbiBIYXNoTmF2aWdhdGlvbihfcmVmKSB7XG4gIGxldCB7XG4gICAgc3dpcGVyLFxuICAgIGV4dGVuZFBhcmFtcyxcbiAgICBlbWl0LFxuICAgIG9uXG4gIH0gPSBfcmVmO1xuICBsZXQgaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgY29uc3QgZG9jdW1lbnQgPSBnZXREb2N1bWVudCgpO1xuICBjb25zdCB3aW5kb3cgPSBnZXRXaW5kb3coKTtcbiAgZXh0ZW5kUGFyYW1zKHtcbiAgICBoYXNoTmF2aWdhdGlvbjoge1xuICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICByZXBsYWNlU3RhdGU6IGZhbHNlLFxuICAgICAgd2F0Y2hTdGF0ZTogZmFsc2UsXG4gICAgICBnZXRTbGlkZUluZGV4KF9zLCBoYXNoKSB7XG4gICAgICAgIGlmIChzd2lwZXIudmlydHVhbCAmJiBzd2lwZXIucGFyYW1zLnZpcnR1YWwuZW5hYmxlZCkge1xuICAgICAgICAgIGNvbnN0IHNsaWRlV2l0aEhhc2ggPSBzd2lwZXIuc2xpZGVzLmZpbHRlcihzbGlkZUVsID0+IHNsaWRlRWwuZ2V0QXR0cmlidXRlKCdkYXRhLWhhc2gnKSA9PT0gaGFzaClbMF07XG4gICAgICAgICAgaWYgKCFzbGlkZVdpdGhIYXNoKSByZXR1cm4gMDtcbiAgICAgICAgICBjb25zdCBpbmRleCA9IHBhcnNlSW50KHNsaWRlV2l0aEhhc2guZ2V0QXR0cmlidXRlKCdkYXRhLXN3aXBlci1zbGlkZS1pbmRleCcpLCAxMCk7XG4gICAgICAgICAgcmV0dXJuIGluZGV4O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzd2lwZXIuZ2V0U2xpZGVJbmRleChlbGVtZW50Q2hpbGRyZW4oc3dpcGVyLnNsaWRlc0VsLCBgLiR7c3dpcGVyLnBhcmFtcy5zbGlkZUNsYXNzfVtkYXRhLWhhc2g9XCIke2hhc2h9XCJdLCBzd2lwZXItc2xpZGVbZGF0YS1oYXNoPVwiJHtoYXNofVwiXWApWzBdKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBjb25zdCBvbkhhc2hDaGFuZ2UgPSAoKSA9PiB7XG4gICAgZW1pdCgnaGFzaENoYW5nZScpO1xuICAgIGNvbnN0IG5ld0hhc2ggPSBkb2N1bWVudC5sb2NhdGlvbi5oYXNoLnJlcGxhY2UoJyMnLCAnJyk7XG4gICAgY29uc3QgYWN0aXZlU2xpZGVFbCA9IHN3aXBlci52aXJ0dWFsICYmIHN3aXBlci5wYXJhbXMudmlydHVhbC5lbmFibGVkID8gc3dpcGVyLnNsaWRlc0VsLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXN3aXBlci1zbGlkZS1pbmRleD1cIiR7c3dpcGVyLmFjdGl2ZUluZGV4fVwiXWApIDogc3dpcGVyLnNsaWRlc1tzd2lwZXIuYWN0aXZlSW5kZXhdO1xuICAgIGNvbnN0IGFjdGl2ZVNsaWRlSGFzaCA9IGFjdGl2ZVNsaWRlRWwgPyBhY3RpdmVTbGlkZUVsLmdldEF0dHJpYnV0ZSgnZGF0YS1oYXNoJykgOiAnJztcbiAgICBpZiAobmV3SGFzaCAhPT0gYWN0aXZlU2xpZGVIYXNoKSB7XG4gICAgICBjb25zdCBuZXdJbmRleCA9IHN3aXBlci5wYXJhbXMuaGFzaE5hdmlnYXRpb24uZ2V0U2xpZGVJbmRleChzd2lwZXIsIG5ld0hhc2gpO1xuICAgICAgaWYgKHR5cGVvZiBuZXdJbmRleCA9PT0gJ3VuZGVmaW5lZCcgfHwgTnVtYmVyLmlzTmFOKG5ld0luZGV4KSkgcmV0dXJuO1xuICAgICAgc3dpcGVyLnNsaWRlVG8obmV3SW5kZXgpO1xuICAgIH1cbiAgfTtcbiAgY29uc3Qgc2V0SGFzaCA9ICgpID0+IHtcbiAgICBpZiAoIWluaXRpYWxpemVkIHx8ICFzd2lwZXIucGFyYW1zLmhhc2hOYXZpZ2F0aW9uLmVuYWJsZWQpIHJldHVybjtcbiAgICBjb25zdCBhY3RpdmVTbGlkZUVsID0gc3dpcGVyLnZpcnR1YWwgJiYgc3dpcGVyLnBhcmFtcy52aXJ0dWFsLmVuYWJsZWQgPyBzd2lwZXIuc2xpZGVzRWwucXVlcnlTZWxlY3RvcihgW2RhdGEtc3dpcGVyLXNsaWRlLWluZGV4PVwiJHtzd2lwZXIuYWN0aXZlSW5kZXh9XCJdYCkgOiBzd2lwZXIuc2xpZGVzW3N3aXBlci5hY3RpdmVJbmRleF07XG4gICAgY29uc3QgYWN0aXZlU2xpZGVIYXNoID0gYWN0aXZlU2xpZGVFbCA/IGFjdGl2ZVNsaWRlRWwuZ2V0QXR0cmlidXRlKCdkYXRhLWhhc2gnKSB8fCBhY3RpdmVTbGlkZUVsLmdldEF0dHJpYnV0ZSgnZGF0YS1oaXN0b3J5JykgOiAnJztcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5oYXNoTmF2aWdhdGlvbi5yZXBsYWNlU3RhdGUgJiYgd2luZG93Lmhpc3RvcnkgJiYgd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKSB7XG4gICAgICB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUobnVsbCwgbnVsbCwgYCMke2FjdGl2ZVNsaWRlSGFzaH1gIHx8ICcnKTtcbiAgICAgIGVtaXQoJ2hhc2hTZXQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZG9jdW1lbnQubG9jYXRpb24uaGFzaCA9IGFjdGl2ZVNsaWRlSGFzaCB8fCAnJztcbiAgICAgIGVtaXQoJ2hhc2hTZXQnKTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IGluaXQgPSAoKSA9PiB7XG4gICAgaWYgKCFzd2lwZXIucGFyYW1zLmhhc2hOYXZpZ2F0aW9uLmVuYWJsZWQgfHwgc3dpcGVyLnBhcmFtcy5oaXN0b3J5ICYmIHN3aXBlci5wYXJhbXMuaGlzdG9yeS5lbmFibGVkKSByZXR1cm47XG4gICAgaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgIGNvbnN0IGhhc2ggPSBkb2N1bWVudC5sb2NhdGlvbi5oYXNoLnJlcGxhY2UoJyMnLCAnJyk7XG4gICAgaWYgKGhhc2gpIHtcbiAgICAgIGNvbnN0IHNwZWVkID0gMDtcbiAgICAgIGNvbnN0IGluZGV4ID0gc3dpcGVyLnBhcmFtcy5oYXNoTmF2aWdhdGlvbi5nZXRTbGlkZUluZGV4KHN3aXBlciwgaGFzaCk7XG4gICAgICBzd2lwZXIuc2xpZGVUbyhpbmRleCB8fCAwLCBzcGVlZCwgc3dpcGVyLnBhcmFtcy5ydW5DYWxsYmFja3NPbkluaXQsIHRydWUpO1xuICAgIH1cbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5oYXNoTmF2aWdhdGlvbi53YXRjaFN0YXRlKSB7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsIG9uSGFzaENoYW5nZSk7XG4gICAgfVxuICB9O1xuICBjb25zdCBkZXN0cm95ID0gKCkgPT4ge1xuICAgIGlmIChzd2lwZXIucGFyYW1zLmhhc2hOYXZpZ2F0aW9uLndhdGNoU3RhdGUpIHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdoYXNoY2hhbmdlJywgb25IYXNoQ2hhbmdlKTtcbiAgICB9XG4gIH07XG4gIG9uKCdpbml0JywgKCkgPT4ge1xuICAgIGlmIChzd2lwZXIucGFyYW1zLmhhc2hOYXZpZ2F0aW9uLmVuYWJsZWQpIHtcbiAgICAgIGluaXQoKTtcbiAgICB9XG4gIH0pO1xuICBvbignZGVzdHJveScsICgpID0+IHtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5oYXNoTmF2aWdhdGlvbi5lbmFibGVkKSB7XG4gICAgICBkZXN0cm95KCk7XG4gICAgfVxuICB9KTtcbiAgb24oJ3RyYW5zaXRpb25FbmQgX2ZyZWVNb2RlTm9Nb21lbnR1bVJlbGVhc2UnLCAoKSA9PiB7XG4gICAgaWYgKGluaXRpYWxpemVkKSB7XG4gICAgICBzZXRIYXNoKCk7XG4gICAgfVxuICB9KTtcbiAgb24oJ3NsaWRlQ2hhbmdlJywgKCkgPT4ge1xuICAgIGlmIChpbml0aWFsaXplZCAmJiBzd2lwZXIucGFyYW1zLmNzc01vZGUpIHtcbiAgICAgIHNldEhhc2goKTtcbiAgICB9XG4gIH0pO1xufVxuXG5leHBvcnQgeyBIYXNoTmF2aWdhdGlvbiBhcyBkZWZhdWx0IH07XG4iLCJpbXBvcnQgeyBnIGFzIGdldERvY3VtZW50IH0gZnJvbSAnLi4vc2hhcmVkL3Nzci13aW5kb3cuZXNtLm1qcyc7XG5cbi8qIGVzbGludCBuby11bmRlcnNjb3JlLWRhbmdsZTogXCJvZmZcIiAqL1xuLyogZXNsaW50IG5vLXVzZS1iZWZvcmUtZGVmaW5lOiBcIm9mZlwiICovXG5mdW5jdGlvbiBBdXRvcGxheShfcmVmKSB7XG4gIGxldCB7XG4gICAgc3dpcGVyLFxuICAgIGV4dGVuZFBhcmFtcyxcbiAgICBvbixcbiAgICBlbWl0LFxuICAgIHBhcmFtc1xuICB9ID0gX3JlZjtcbiAgc3dpcGVyLmF1dG9wbGF5ID0ge1xuICAgIHJ1bm5pbmc6IGZhbHNlLFxuICAgIHBhdXNlZDogZmFsc2UsXG4gICAgdGltZUxlZnQ6IDBcbiAgfTtcbiAgZXh0ZW5kUGFyYW1zKHtcbiAgICBhdXRvcGxheToge1xuICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICBkZWxheTogMzAwMCxcbiAgICAgIHdhaXRGb3JUcmFuc2l0aW9uOiB0cnVlLFxuICAgICAgZGlzYWJsZU9uSW50ZXJhY3Rpb246IGZhbHNlLFxuICAgICAgc3RvcE9uTGFzdFNsaWRlOiBmYWxzZSxcbiAgICAgIHJldmVyc2VEaXJlY3Rpb246IGZhbHNlLFxuICAgICAgcGF1c2VPbk1vdXNlRW50ZXI6IGZhbHNlXG4gICAgfVxuICB9KTtcbiAgbGV0IHRpbWVvdXQ7XG4gIGxldCByYWY7XG4gIGxldCBhdXRvcGxheURlbGF5VG90YWwgPSBwYXJhbXMgJiYgcGFyYW1zLmF1dG9wbGF5ID8gcGFyYW1zLmF1dG9wbGF5LmRlbGF5IDogMzAwMDtcbiAgbGV0IGF1dG9wbGF5RGVsYXlDdXJyZW50ID0gcGFyYW1zICYmIHBhcmFtcy5hdXRvcGxheSA/IHBhcmFtcy5hdXRvcGxheS5kZWxheSA6IDMwMDA7XG4gIGxldCBhdXRvcGxheVRpbWVMZWZ0O1xuICBsZXQgYXV0b3BsYXlTdGFydFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgbGV0IHdhc1BhdXNlZDtcbiAgbGV0IGlzVG91Y2hlZDtcbiAgbGV0IHBhdXNlZEJ5VG91Y2g7XG4gIGxldCB0b3VjaFN0YXJ0VGltZW91dDtcbiAgbGV0IHNsaWRlQ2hhbmdlZDtcbiAgbGV0IHBhdXNlZEJ5SW50ZXJhY3Rpb247XG4gIGxldCBwYXVzZWRCeVBvaW50ZXJFbnRlcjtcbiAgZnVuY3Rpb24gb25UcmFuc2l0aW9uRW5kKGUpIHtcbiAgICBpZiAoIXN3aXBlciB8fCBzd2lwZXIuZGVzdHJveWVkIHx8ICFzd2lwZXIud3JhcHBlckVsKSByZXR1cm47XG4gICAgaWYgKGUudGFyZ2V0ICE9PSBzd2lwZXIud3JhcHBlckVsKSByZXR1cm47XG4gICAgc3dpcGVyLndyYXBwZXJFbC5yZW1vdmVFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgb25UcmFuc2l0aW9uRW5kKTtcbiAgICBpZiAocGF1c2VkQnlQb2ludGVyRW50ZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmVzdW1lKCk7XG4gIH1cbiAgY29uc3QgY2FsY1RpbWVMZWZ0ID0gKCkgPT4ge1xuICAgIGlmIChzd2lwZXIuZGVzdHJveWVkIHx8ICFzd2lwZXIuYXV0b3BsYXkucnVubmluZykgcmV0dXJuO1xuICAgIGlmIChzd2lwZXIuYXV0b3BsYXkucGF1c2VkKSB7XG4gICAgICB3YXNQYXVzZWQgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAod2FzUGF1c2VkKSB7XG4gICAgICBhdXRvcGxheURlbGF5Q3VycmVudCA9IGF1dG9wbGF5VGltZUxlZnQ7XG4gICAgICB3YXNQYXVzZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgY29uc3QgdGltZUxlZnQgPSBzd2lwZXIuYXV0b3BsYXkucGF1c2VkID8gYXV0b3BsYXlUaW1lTGVmdCA6IGF1dG9wbGF5U3RhcnRUaW1lICsgYXV0b3BsYXlEZWxheUN1cnJlbnQgLSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICBzd2lwZXIuYXV0b3BsYXkudGltZUxlZnQgPSB0aW1lTGVmdDtcbiAgICBlbWl0KCdhdXRvcGxheVRpbWVMZWZ0JywgdGltZUxlZnQsIHRpbWVMZWZ0IC8gYXV0b3BsYXlEZWxheVRvdGFsKTtcbiAgICByYWYgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgY2FsY1RpbWVMZWZ0KCk7XG4gICAgfSk7XG4gIH07XG4gIGNvbnN0IGdldFNsaWRlRGVsYXkgPSAoKSA9PiB7XG4gICAgbGV0IGFjdGl2ZVNsaWRlRWw7XG4gICAgaWYgKHN3aXBlci52aXJ0dWFsICYmIHN3aXBlci5wYXJhbXMudmlydHVhbC5lbmFibGVkKSB7XG4gICAgICBhY3RpdmVTbGlkZUVsID0gc3dpcGVyLnNsaWRlcy5maWx0ZXIoc2xpZGVFbCA9PiBzbGlkZUVsLmNsYXNzTGlzdC5jb250YWlucygnc3dpcGVyLXNsaWRlLWFjdGl2ZScpKVswXTtcbiAgICB9IGVsc2Uge1xuICAgICAgYWN0aXZlU2xpZGVFbCA9IHN3aXBlci5zbGlkZXNbc3dpcGVyLmFjdGl2ZUluZGV4XTtcbiAgICB9XG4gICAgaWYgKCFhY3RpdmVTbGlkZUVsKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIGNvbnN0IGN1cnJlbnRTbGlkZURlbGF5ID0gcGFyc2VJbnQoYWN0aXZlU2xpZGVFbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3dpcGVyLWF1dG9wbGF5JyksIDEwKTtcbiAgICByZXR1cm4gY3VycmVudFNsaWRlRGVsYXk7XG4gIH07XG4gIGNvbnN0IHJ1biA9IGRlbGF5Rm9yY2UgPT4ge1xuICAgIGlmIChzd2lwZXIuZGVzdHJveWVkIHx8ICFzd2lwZXIuYXV0b3BsYXkucnVubmluZykgcmV0dXJuO1xuICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHJhZik7XG4gICAgY2FsY1RpbWVMZWZ0KCk7XG4gICAgbGV0IGRlbGF5ID0gdHlwZW9mIGRlbGF5Rm9yY2UgPT09ICd1bmRlZmluZWQnID8gc3dpcGVyLnBhcmFtcy5hdXRvcGxheS5kZWxheSA6IGRlbGF5Rm9yY2U7XG4gICAgYXV0b3BsYXlEZWxheVRvdGFsID0gc3dpcGVyLnBhcmFtcy5hdXRvcGxheS5kZWxheTtcbiAgICBhdXRvcGxheURlbGF5Q3VycmVudCA9IHN3aXBlci5wYXJhbXMuYXV0b3BsYXkuZGVsYXk7XG4gICAgY29uc3QgY3VycmVudFNsaWRlRGVsYXkgPSBnZXRTbGlkZURlbGF5KCk7XG4gICAgaWYgKCFOdW1iZXIuaXNOYU4oY3VycmVudFNsaWRlRGVsYXkpICYmIGN1cnJlbnRTbGlkZURlbGF5ID4gMCAmJiB0eXBlb2YgZGVsYXlGb3JjZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGRlbGF5ID0gY3VycmVudFNsaWRlRGVsYXk7XG4gICAgICBhdXRvcGxheURlbGF5VG90YWwgPSBjdXJyZW50U2xpZGVEZWxheTtcbiAgICAgIGF1dG9wbGF5RGVsYXlDdXJyZW50ID0gY3VycmVudFNsaWRlRGVsYXk7XG4gICAgfVxuICAgIGF1dG9wbGF5VGltZUxlZnQgPSBkZWxheTtcbiAgICBjb25zdCBzcGVlZCA9IHN3aXBlci5wYXJhbXMuc3BlZWQ7XG4gICAgY29uc3QgcHJvY2VlZCA9ICgpID0+IHtcbiAgICAgIGlmICghc3dpcGVyIHx8IHN3aXBlci5kZXN0cm95ZWQpIHJldHVybjtcbiAgICAgIGlmIChzd2lwZXIucGFyYW1zLmF1dG9wbGF5LnJldmVyc2VEaXJlY3Rpb24pIHtcbiAgICAgICAgaWYgKCFzd2lwZXIuaXNCZWdpbm5pbmcgfHwgc3dpcGVyLnBhcmFtcy5sb29wIHx8IHN3aXBlci5wYXJhbXMucmV3aW5kKSB7XG4gICAgICAgICAgc3dpcGVyLnNsaWRlUHJldihzcGVlZCwgdHJ1ZSwgdHJ1ZSk7XG4gICAgICAgICAgZW1pdCgnYXV0b3BsYXknKTtcbiAgICAgICAgfSBlbHNlIGlmICghc3dpcGVyLnBhcmFtcy5hdXRvcGxheS5zdG9wT25MYXN0U2xpZGUpIHtcbiAgICAgICAgICBzd2lwZXIuc2xpZGVUbyhzd2lwZXIuc2xpZGVzLmxlbmd0aCAtIDEsIHNwZWVkLCB0cnVlLCB0cnVlKTtcbiAgICAgICAgICBlbWl0KCdhdXRvcGxheScpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIXN3aXBlci5pc0VuZCB8fCBzd2lwZXIucGFyYW1zLmxvb3AgfHwgc3dpcGVyLnBhcmFtcy5yZXdpbmQpIHtcbiAgICAgICAgICBzd2lwZXIuc2xpZGVOZXh0KHNwZWVkLCB0cnVlLCB0cnVlKTtcbiAgICAgICAgICBlbWl0KCdhdXRvcGxheScpO1xuICAgICAgICB9IGVsc2UgaWYgKCFzd2lwZXIucGFyYW1zLmF1dG9wbGF5LnN0b3BPbkxhc3RTbGlkZSkge1xuICAgICAgICAgIHN3aXBlci5zbGlkZVRvKDAsIHNwZWVkLCB0cnVlLCB0cnVlKTtcbiAgICAgICAgICBlbWl0KCdhdXRvcGxheScpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3dpcGVyLnBhcmFtcy5jc3NNb2RlKSB7XG4gICAgICAgIGF1dG9wbGF5U3RhcnRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgcnVuKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gICAgaWYgKGRlbGF5ID4gMCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBwcm9jZWVkKCk7XG4gICAgICB9LCBkZWxheSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgIHByb2NlZWQoKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgIHJldHVybiBkZWxheTtcbiAgfTtcbiAgY29uc3Qgc3RhcnQgPSAoKSA9PiB7XG4gICAgYXV0b3BsYXlTdGFydFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICBzd2lwZXIuYXV0b3BsYXkucnVubmluZyA9IHRydWU7XG4gICAgcnVuKCk7XG4gICAgZW1pdCgnYXV0b3BsYXlTdGFydCcpO1xuICB9O1xuICBjb25zdCBzdG9wID0gKCkgPT4ge1xuICAgIHN3aXBlci5hdXRvcGxheS5ydW5uaW5nID0gZmFsc2U7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHJhZik7XG4gICAgZW1pdCgnYXV0b3BsYXlTdG9wJyk7XG4gIH07XG4gIGNvbnN0IHBhdXNlID0gKGludGVybmFsLCByZXNldCkgPT4ge1xuICAgIGlmIChzd2lwZXIuZGVzdHJveWVkIHx8ICFzd2lwZXIuYXV0b3BsYXkucnVubmluZykgcmV0dXJuO1xuICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICBpZiAoIWludGVybmFsKSB7XG4gICAgICBwYXVzZWRCeUludGVyYWN0aW9uID0gdHJ1ZTtcbiAgICB9XG4gICAgY29uc3QgcHJvY2VlZCA9ICgpID0+IHtcbiAgICAgIGVtaXQoJ2F1dG9wbGF5UGF1c2UnKTtcbiAgICAgIGlmIChzd2lwZXIucGFyYW1zLmF1dG9wbGF5LndhaXRGb3JUcmFuc2l0aW9uKSB7XG4gICAgICAgIHN3aXBlci53cmFwcGVyRWwuYWRkRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIG9uVHJhbnNpdGlvbkVuZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bWUoKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHN3aXBlci5hdXRvcGxheS5wYXVzZWQgPSB0cnVlO1xuICAgIGlmIChyZXNldCkge1xuICAgICAgaWYgKHNsaWRlQ2hhbmdlZCkge1xuICAgICAgICBhdXRvcGxheVRpbWVMZWZ0ID0gc3dpcGVyLnBhcmFtcy5hdXRvcGxheS5kZWxheTtcbiAgICAgIH1cbiAgICAgIHNsaWRlQ2hhbmdlZCA9IGZhbHNlO1xuICAgICAgcHJvY2VlZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBkZWxheSA9IGF1dG9wbGF5VGltZUxlZnQgfHwgc3dpcGVyLnBhcmFtcy5hdXRvcGxheS5kZWxheTtcbiAgICBhdXRvcGxheVRpbWVMZWZ0ID0gZGVsYXkgLSAobmV3IERhdGUoKS5nZXRUaW1lKCkgLSBhdXRvcGxheVN0YXJ0VGltZSk7XG4gICAgaWYgKHN3aXBlci5pc0VuZCAmJiBhdXRvcGxheVRpbWVMZWZ0IDwgMCAmJiAhc3dpcGVyLnBhcmFtcy5sb29wKSByZXR1cm47XG4gICAgaWYgKGF1dG9wbGF5VGltZUxlZnQgPCAwKSBhdXRvcGxheVRpbWVMZWZ0ID0gMDtcbiAgICBwcm9jZWVkKCk7XG4gIH07XG4gIGNvbnN0IHJlc3VtZSA9ICgpID0+IHtcbiAgICBpZiAoc3dpcGVyLmlzRW5kICYmIGF1dG9wbGF5VGltZUxlZnQgPCAwICYmICFzd2lwZXIucGFyYW1zLmxvb3AgfHwgc3dpcGVyLmRlc3Ryb3llZCB8fCAhc3dpcGVyLmF1dG9wbGF5LnJ1bm5pbmcpIHJldHVybjtcbiAgICBhdXRvcGxheVN0YXJ0VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIGlmIChwYXVzZWRCeUludGVyYWN0aW9uKSB7XG4gICAgICBwYXVzZWRCeUludGVyYWN0aW9uID0gZmFsc2U7XG4gICAgICBydW4oYXV0b3BsYXlUaW1lTGVmdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJ1bigpO1xuICAgIH1cbiAgICBzd2lwZXIuYXV0b3BsYXkucGF1c2VkID0gZmFsc2U7XG4gICAgZW1pdCgnYXV0b3BsYXlSZXN1bWUnKTtcbiAgfTtcbiAgY29uc3Qgb25WaXNpYmlsaXR5Q2hhbmdlID0gKCkgPT4ge1xuICAgIGlmIChzd2lwZXIuZGVzdHJveWVkIHx8ICFzd2lwZXIuYXV0b3BsYXkucnVubmluZykgcmV0dXJuO1xuICAgIGNvbnN0IGRvY3VtZW50ID0gZ2V0RG9jdW1lbnQoKTtcbiAgICBpZiAoZG9jdW1lbnQudmlzaWJpbGl0eVN0YXRlID09PSAnaGlkZGVuJykge1xuICAgICAgcGF1c2VkQnlJbnRlcmFjdGlvbiA9IHRydWU7XG4gICAgICBwYXVzZSh0cnVlKTtcbiAgICB9XG4gICAgaWYgKGRvY3VtZW50LnZpc2liaWxpdHlTdGF0ZSA9PT0gJ3Zpc2libGUnKSB7XG4gICAgICByZXN1bWUoKTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IG9uUG9pbnRlckVudGVyID0gZSA9PiB7XG4gICAgaWYgKGUucG9pbnRlclR5cGUgIT09ICdtb3VzZScpIHJldHVybjtcbiAgICBwYXVzZWRCeUludGVyYWN0aW9uID0gdHJ1ZTtcbiAgICBwYXVzZWRCeVBvaW50ZXJFbnRlciA9IHRydWU7XG4gICAgaWYgKHN3aXBlci5hbmltYXRpbmcgfHwgc3dpcGVyLmF1dG9wbGF5LnBhdXNlZCkgcmV0dXJuO1xuICAgIHBhdXNlKHRydWUpO1xuICB9O1xuICBjb25zdCBvblBvaW50ZXJMZWF2ZSA9IGUgPT4ge1xuICAgIGlmIChlLnBvaW50ZXJUeXBlICE9PSAnbW91c2UnKSByZXR1cm47XG4gICAgcGF1c2VkQnlQb2ludGVyRW50ZXIgPSBmYWxzZTtcbiAgICBpZiAoc3dpcGVyLmF1dG9wbGF5LnBhdXNlZCkge1xuICAgICAgcmVzdW1lKCk7XG4gICAgfVxuICB9O1xuICBjb25zdCBhdHRhY2hNb3VzZUV2ZW50cyA9ICgpID0+IHtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5hdXRvcGxheS5wYXVzZU9uTW91c2VFbnRlcikge1xuICAgICAgc3dpcGVyLmVsLmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJlbnRlcicsIG9uUG9pbnRlckVudGVyKTtcbiAgICAgIHN3aXBlci5lbC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVybGVhdmUnLCBvblBvaW50ZXJMZWF2ZSk7XG4gICAgfVxuICB9O1xuICBjb25zdCBkZXRhY2hNb3VzZUV2ZW50cyA9ICgpID0+IHtcbiAgICBzd2lwZXIuZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcmVudGVyJywgb25Qb2ludGVyRW50ZXIpO1xuICAgIHN3aXBlci5lbC5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVybGVhdmUnLCBvblBvaW50ZXJMZWF2ZSk7XG4gIH07XG4gIGNvbnN0IGF0dGFjaERvY3VtZW50RXZlbnRzID0gKCkgPT4ge1xuICAgIGNvbnN0IGRvY3VtZW50ID0gZ2V0RG9jdW1lbnQoKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd2aXNpYmlsaXR5Y2hhbmdlJywgb25WaXNpYmlsaXR5Q2hhbmdlKTtcbiAgfTtcbiAgY29uc3QgZGV0YWNoRG9jdW1lbnRFdmVudHMgPSAoKSA9PiB7XG4gICAgY29uc3QgZG9jdW1lbnQgPSBnZXREb2N1bWVudCgpO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Zpc2liaWxpdHljaGFuZ2UnLCBvblZpc2liaWxpdHlDaGFuZ2UpO1xuICB9O1xuICBvbignaW5pdCcsICgpID0+IHtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5hdXRvcGxheS5lbmFibGVkKSB7XG4gICAgICBhdHRhY2hNb3VzZUV2ZW50cygpO1xuICAgICAgYXR0YWNoRG9jdW1lbnRFdmVudHMoKTtcbiAgICAgIHN0YXJ0KCk7XG4gICAgfVxuICB9KTtcbiAgb24oJ2Rlc3Ryb3knLCAoKSA9PiB7XG4gICAgZGV0YWNoTW91c2VFdmVudHMoKTtcbiAgICBkZXRhY2hEb2N1bWVudEV2ZW50cygpO1xuICAgIGlmIChzd2lwZXIuYXV0b3BsYXkucnVubmluZykge1xuICAgICAgc3RvcCgpO1xuICAgIH1cbiAgfSk7XG4gIG9uKCdfZnJlZU1vZGVTdGF0aWNSZWxlYXNlJywgKCkgPT4ge1xuICAgIGlmIChwYXVzZWRCeVRvdWNoIHx8IHBhdXNlZEJ5SW50ZXJhY3Rpb24pIHtcbiAgICAgIHJlc3VtZSgpO1xuICAgIH1cbiAgfSk7XG4gIG9uKCdfZnJlZU1vZGVOb01vbWVudHVtUmVsZWFzZScsICgpID0+IHtcbiAgICBpZiAoIXN3aXBlci5wYXJhbXMuYXV0b3BsYXkuZGlzYWJsZU9uSW50ZXJhY3Rpb24pIHtcbiAgICAgIHBhdXNlKHRydWUsIHRydWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdG9wKCk7XG4gICAgfVxuICB9KTtcbiAgb24oJ2JlZm9yZVRyYW5zaXRpb25TdGFydCcsIChfcywgc3BlZWQsIGludGVybmFsKSA9PiB7XG4gICAgaWYgKHN3aXBlci5kZXN0cm95ZWQgfHwgIXN3aXBlci5hdXRvcGxheS5ydW5uaW5nKSByZXR1cm47XG4gICAgaWYgKGludGVybmFsIHx8ICFzd2lwZXIucGFyYW1zLmF1dG9wbGF5LmRpc2FibGVPbkludGVyYWN0aW9uKSB7XG4gICAgICBwYXVzZSh0cnVlLCB0cnVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RvcCgpO1xuICAgIH1cbiAgfSk7XG4gIG9uKCdzbGlkZXJGaXJzdE1vdmUnLCAoKSA9PiB7XG4gICAgaWYgKHN3aXBlci5kZXN0cm95ZWQgfHwgIXN3aXBlci5hdXRvcGxheS5ydW5uaW5nKSByZXR1cm47XG4gICAgaWYgKHN3aXBlci5wYXJhbXMuYXV0b3BsYXkuZGlzYWJsZU9uSW50ZXJhY3Rpb24pIHtcbiAgICAgIHN0b3AoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaXNUb3VjaGVkID0gdHJ1ZTtcbiAgICBwYXVzZWRCeVRvdWNoID0gZmFsc2U7XG4gICAgcGF1c2VkQnlJbnRlcmFjdGlvbiA9IGZhbHNlO1xuICAgIHRvdWNoU3RhcnRUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBwYXVzZWRCeUludGVyYWN0aW9uID0gdHJ1ZTtcbiAgICAgIHBhdXNlZEJ5VG91Y2ggPSB0cnVlO1xuICAgICAgcGF1c2UodHJ1ZSk7XG4gICAgfSwgMjAwKTtcbiAgfSk7XG4gIG9uKCd0b3VjaEVuZCcsICgpID0+IHtcbiAgICBpZiAoc3dpcGVyLmRlc3Ryb3llZCB8fCAhc3dpcGVyLmF1dG9wbGF5LnJ1bm5pbmcgfHwgIWlzVG91Y2hlZCkgcmV0dXJuO1xuICAgIGNsZWFyVGltZW91dCh0b3VjaFN0YXJ0VGltZW91dCk7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgIGlmIChzd2lwZXIucGFyYW1zLmF1dG9wbGF5LmRpc2FibGVPbkludGVyYWN0aW9uKSB7XG4gICAgICBwYXVzZWRCeVRvdWNoID0gZmFsc2U7XG4gICAgICBpc1RvdWNoZWQgPSBmYWxzZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHBhdXNlZEJ5VG91Y2ggJiYgc3dpcGVyLnBhcmFtcy5jc3NNb2RlKSByZXN1bWUoKTtcbiAgICBwYXVzZWRCeVRvdWNoID0gZmFsc2U7XG4gICAgaXNUb3VjaGVkID0gZmFsc2U7XG4gIH0pO1xuICBvbignc2xpZGVDaGFuZ2UnLCAoKSA9PiB7XG4gICAgaWYgKHN3aXBlci5kZXN0cm95ZWQgfHwgIXN3aXBlci5hdXRvcGxheS5ydW5uaW5nKSByZXR1cm47XG4gICAgc2xpZGVDaGFuZ2VkID0gdHJ1ZTtcbiAgfSk7XG4gIE9iamVjdC5hc3NpZ24oc3dpcGVyLmF1dG9wbGF5LCB7XG4gICAgc3RhcnQsXG4gICAgc3RvcCxcbiAgICBwYXVzZSxcbiAgICByZXN1bWVcbiAgfSk7XG59XG5cbmV4cG9ydCB7IEF1dG9wbGF5IGFzIGRlZmF1bHQgfTtcbiIsImltcG9ydCB7IGcgYXMgZ2V0RG9jdW1lbnQgfSBmcm9tICcuLi9zaGFyZWQvc3NyLXdpbmRvdy5lc20ubWpzJztcbmltcG9ydCB7IGsgYXMgaXNPYmplY3QsIGUgYXMgZWxlbWVudENoaWxkcmVuIH0gZnJvbSAnLi4vc2hhcmVkL3V0aWxzLm1qcyc7XG5cbmZ1bmN0aW9uIFRodW1iKF9yZWYpIHtcbiAgbGV0IHtcbiAgICBzd2lwZXIsXG4gICAgZXh0ZW5kUGFyYW1zLFxuICAgIG9uXG4gIH0gPSBfcmVmO1xuICBleHRlbmRQYXJhbXMoe1xuICAgIHRodW1iczoge1xuICAgICAgc3dpcGVyOiBudWxsLFxuICAgICAgbXVsdGlwbGVBY3RpdmVUaHVtYnM6IHRydWUsXG4gICAgICBhdXRvU2Nyb2xsT2Zmc2V0OiAwLFxuICAgICAgc2xpZGVUaHVtYkFjdGl2ZUNsYXNzOiAnc3dpcGVyLXNsaWRlLXRodW1iLWFjdGl2ZScsXG4gICAgICB0aHVtYnNDb250YWluZXJDbGFzczogJ3N3aXBlci10aHVtYnMnXG4gICAgfVxuICB9KTtcbiAgbGV0IGluaXRpYWxpemVkID0gZmFsc2U7XG4gIGxldCBzd2lwZXJDcmVhdGVkID0gZmFsc2U7XG4gIHN3aXBlci50aHVtYnMgPSB7XG4gICAgc3dpcGVyOiBudWxsXG4gIH07XG4gIGZ1bmN0aW9uIG9uVGh1bWJDbGljaygpIHtcbiAgICBjb25zdCB0aHVtYnNTd2lwZXIgPSBzd2lwZXIudGh1bWJzLnN3aXBlcjtcbiAgICBpZiAoIXRodW1ic1N3aXBlciB8fCB0aHVtYnNTd2lwZXIuZGVzdHJveWVkKSByZXR1cm47XG4gICAgY29uc3QgY2xpY2tlZEluZGV4ID0gdGh1bWJzU3dpcGVyLmNsaWNrZWRJbmRleDtcbiAgICBjb25zdCBjbGlja2VkU2xpZGUgPSB0aHVtYnNTd2lwZXIuY2xpY2tlZFNsaWRlO1xuICAgIGlmIChjbGlja2VkU2xpZGUgJiYgY2xpY2tlZFNsaWRlLmNsYXNzTGlzdC5jb250YWlucyhzd2lwZXIucGFyYW1zLnRodW1icy5zbGlkZVRodW1iQWN0aXZlQ2xhc3MpKSByZXR1cm47XG4gICAgaWYgKHR5cGVvZiBjbGlja2VkSW5kZXggPT09ICd1bmRlZmluZWQnIHx8IGNsaWNrZWRJbmRleCA9PT0gbnVsbCkgcmV0dXJuO1xuICAgIGxldCBzbGlkZVRvSW5kZXg7XG4gICAgaWYgKHRodW1ic1N3aXBlci5wYXJhbXMubG9vcCkge1xuICAgICAgc2xpZGVUb0luZGV4ID0gcGFyc2VJbnQodGh1bWJzU3dpcGVyLmNsaWNrZWRTbGlkZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3dpcGVyLXNsaWRlLWluZGV4JyksIDEwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2xpZGVUb0luZGV4ID0gY2xpY2tlZEluZGV4O1xuICAgIH1cbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5sb29wKSB7XG4gICAgICBzd2lwZXIuc2xpZGVUb0xvb3Aoc2xpZGVUb0luZGV4KTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3dpcGVyLnNsaWRlVG8oc2xpZGVUb0luZGV4KTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBjb25zdCB7XG4gICAgICB0aHVtYnM6IHRodW1ic1BhcmFtc1xuICAgIH0gPSBzd2lwZXIucGFyYW1zO1xuICAgIGlmIChpbml0aWFsaXplZCkgcmV0dXJuIGZhbHNlO1xuICAgIGluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICBjb25zdCBTd2lwZXJDbGFzcyA9IHN3aXBlci5jb25zdHJ1Y3RvcjtcbiAgICBpZiAodGh1bWJzUGFyYW1zLnN3aXBlciBpbnN0YW5jZW9mIFN3aXBlckNsYXNzKSB7XG4gICAgICBzd2lwZXIudGh1bWJzLnN3aXBlciA9IHRodW1ic1BhcmFtcy5zd2lwZXI7XG4gICAgICBPYmplY3QuYXNzaWduKHN3aXBlci50aHVtYnMuc3dpcGVyLm9yaWdpbmFsUGFyYW1zLCB7XG4gICAgICAgIHdhdGNoU2xpZGVzUHJvZ3Jlc3M6IHRydWUsXG4gICAgICAgIHNsaWRlVG9DbGlja2VkU2xpZGU6IGZhbHNlXG4gICAgICB9KTtcbiAgICAgIE9iamVjdC5hc3NpZ24oc3dpcGVyLnRodW1icy5zd2lwZXIucGFyYW1zLCB7XG4gICAgICAgIHdhdGNoU2xpZGVzUHJvZ3Jlc3M6IHRydWUsXG4gICAgICAgIHNsaWRlVG9DbGlja2VkU2xpZGU6IGZhbHNlXG4gICAgICB9KTtcbiAgICAgIHN3aXBlci50aHVtYnMuc3dpcGVyLnVwZGF0ZSgpO1xuICAgIH0gZWxzZSBpZiAoaXNPYmplY3QodGh1bWJzUGFyYW1zLnN3aXBlcikpIHtcbiAgICAgIGNvbnN0IHRodW1ic1N3aXBlclBhcmFtcyA9IE9iamVjdC5hc3NpZ24oe30sIHRodW1ic1BhcmFtcy5zd2lwZXIpO1xuICAgICAgT2JqZWN0LmFzc2lnbih0aHVtYnNTd2lwZXJQYXJhbXMsIHtcbiAgICAgICAgd2F0Y2hTbGlkZXNQcm9ncmVzczogdHJ1ZSxcbiAgICAgICAgc2xpZGVUb0NsaWNrZWRTbGlkZTogZmFsc2VcbiAgICAgIH0pO1xuICAgICAgc3dpcGVyLnRodW1icy5zd2lwZXIgPSBuZXcgU3dpcGVyQ2xhc3ModGh1bWJzU3dpcGVyUGFyYW1zKTtcbiAgICAgIHN3aXBlckNyZWF0ZWQgPSB0cnVlO1xuICAgIH1cbiAgICBzd2lwZXIudGh1bWJzLnN3aXBlci5lbC5jbGFzc0xpc3QuYWRkKHN3aXBlci5wYXJhbXMudGh1bWJzLnRodW1ic0NvbnRhaW5lckNsYXNzKTtcbiAgICBzd2lwZXIudGh1bWJzLnN3aXBlci5vbigndGFwJywgb25UaHVtYkNsaWNrKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBmdW5jdGlvbiB1cGRhdGUoaW5pdGlhbCkge1xuICAgIGNvbnN0IHRodW1ic1N3aXBlciA9IHN3aXBlci50aHVtYnMuc3dpcGVyO1xuICAgIGlmICghdGh1bWJzU3dpcGVyIHx8IHRodW1ic1N3aXBlci5kZXN0cm95ZWQpIHJldHVybjtcbiAgICBjb25zdCBzbGlkZXNQZXJWaWV3ID0gdGh1bWJzU3dpcGVyLnBhcmFtcy5zbGlkZXNQZXJWaWV3ID09PSAnYXV0bycgPyB0aHVtYnNTd2lwZXIuc2xpZGVzUGVyVmlld0R5bmFtaWMoKSA6IHRodW1ic1N3aXBlci5wYXJhbXMuc2xpZGVzUGVyVmlldztcblxuICAgIC8vIEFjdGl2YXRlIHRodW1ic1xuICAgIGxldCB0aHVtYnNUb0FjdGl2YXRlID0gMTtcbiAgICBjb25zdCB0aHVtYkFjdGl2ZUNsYXNzID0gc3dpcGVyLnBhcmFtcy50aHVtYnMuc2xpZGVUaHVtYkFjdGl2ZUNsYXNzO1xuICAgIGlmIChzd2lwZXIucGFyYW1zLnNsaWRlc1BlclZpZXcgPiAxICYmICFzd2lwZXIucGFyYW1zLmNlbnRlcmVkU2xpZGVzKSB7XG4gICAgICB0aHVtYnNUb0FjdGl2YXRlID0gc3dpcGVyLnBhcmFtcy5zbGlkZXNQZXJWaWV3O1xuICAgIH1cbiAgICBpZiAoIXN3aXBlci5wYXJhbXMudGh1bWJzLm11bHRpcGxlQWN0aXZlVGh1bWJzKSB7XG4gICAgICB0aHVtYnNUb0FjdGl2YXRlID0gMTtcbiAgICB9XG4gICAgdGh1bWJzVG9BY3RpdmF0ZSA9IE1hdGguZmxvb3IodGh1bWJzVG9BY3RpdmF0ZSk7XG4gICAgdGh1bWJzU3dpcGVyLnNsaWRlcy5mb3JFYWNoKHNsaWRlRWwgPT4gc2xpZGVFbC5jbGFzc0xpc3QucmVtb3ZlKHRodW1iQWN0aXZlQ2xhc3MpKTtcbiAgICBpZiAodGh1bWJzU3dpcGVyLnBhcmFtcy5sb29wIHx8IHRodW1ic1N3aXBlci5wYXJhbXMudmlydHVhbCAmJiB0aHVtYnNTd2lwZXIucGFyYW1zLnZpcnR1YWwuZW5hYmxlZCkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aHVtYnNUb0FjdGl2YXRlOyBpICs9IDEpIHtcbiAgICAgICAgZWxlbWVudENoaWxkcmVuKHRodW1ic1N3aXBlci5zbGlkZXNFbCwgYFtkYXRhLXN3aXBlci1zbGlkZS1pbmRleD1cIiR7c3dpcGVyLnJlYWxJbmRleCArIGl9XCJdYCkuZm9yRWFjaChzbGlkZUVsID0+IHtcbiAgICAgICAgICBzbGlkZUVsLmNsYXNzTGlzdC5hZGQodGh1bWJBY3RpdmVDbGFzcyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRodW1ic1RvQWN0aXZhdGU7IGkgKz0gMSkge1xuICAgICAgICBpZiAodGh1bWJzU3dpcGVyLnNsaWRlc1tzd2lwZXIucmVhbEluZGV4ICsgaV0pIHtcbiAgICAgICAgICB0aHVtYnNTd2lwZXIuc2xpZGVzW3N3aXBlci5yZWFsSW5kZXggKyBpXS5jbGFzc0xpc3QuYWRkKHRodW1iQWN0aXZlQ2xhc3MpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGF1dG9TY3JvbGxPZmZzZXQgPSBzd2lwZXIucGFyYW1zLnRodW1icy5hdXRvU2Nyb2xsT2Zmc2V0O1xuICAgIGNvbnN0IHVzZU9mZnNldCA9IGF1dG9TY3JvbGxPZmZzZXQgJiYgIXRodW1ic1N3aXBlci5wYXJhbXMubG9vcDtcbiAgICBpZiAoc3dpcGVyLnJlYWxJbmRleCAhPT0gdGh1bWJzU3dpcGVyLnJlYWxJbmRleCB8fCB1c2VPZmZzZXQpIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRUaHVtYnNJbmRleCA9IHRodW1ic1N3aXBlci5hY3RpdmVJbmRleDtcbiAgICAgIGxldCBuZXdUaHVtYnNJbmRleDtcbiAgICAgIGxldCBkaXJlY3Rpb247XG4gICAgICBpZiAodGh1bWJzU3dpcGVyLnBhcmFtcy5sb29wKSB7XG4gICAgICAgIGNvbnN0IG5ld1RodW1ic1NsaWRlID0gdGh1bWJzU3dpcGVyLnNsaWRlcy5maWx0ZXIoc2xpZGVFbCA9PiBzbGlkZUVsLmdldEF0dHJpYnV0ZSgnZGF0YS1zd2lwZXItc2xpZGUtaW5kZXgnKSA9PT0gYCR7c3dpcGVyLnJlYWxJbmRleH1gKVswXTtcbiAgICAgICAgbmV3VGh1bWJzSW5kZXggPSB0aHVtYnNTd2lwZXIuc2xpZGVzLmluZGV4T2YobmV3VGh1bWJzU2xpZGUpO1xuICAgICAgICBkaXJlY3Rpb24gPSBzd2lwZXIuYWN0aXZlSW5kZXggPiBzd2lwZXIucHJldmlvdXNJbmRleCA/ICduZXh0JyA6ICdwcmV2JztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld1RodW1ic0luZGV4ID0gc3dpcGVyLnJlYWxJbmRleDtcbiAgICAgICAgZGlyZWN0aW9uID0gbmV3VGh1bWJzSW5kZXggPiBzd2lwZXIucHJldmlvdXNJbmRleCA/ICduZXh0JyA6ICdwcmV2JztcbiAgICAgIH1cbiAgICAgIGlmICh1c2VPZmZzZXQpIHtcbiAgICAgICAgbmV3VGh1bWJzSW5kZXggKz0gZGlyZWN0aW9uID09PSAnbmV4dCcgPyBhdXRvU2Nyb2xsT2Zmc2V0IDogLTEgKiBhdXRvU2Nyb2xsT2Zmc2V0O1xuICAgICAgfVxuICAgICAgaWYgKHRodW1ic1N3aXBlci52aXNpYmxlU2xpZGVzSW5kZXhlcyAmJiB0aHVtYnNTd2lwZXIudmlzaWJsZVNsaWRlc0luZGV4ZXMuaW5kZXhPZihuZXdUaHVtYnNJbmRleCkgPCAwKSB7XG4gICAgICAgIGlmICh0aHVtYnNTd2lwZXIucGFyYW1zLmNlbnRlcmVkU2xpZGVzKSB7XG4gICAgICAgICAgaWYgKG5ld1RodW1ic0luZGV4ID4gY3VycmVudFRodW1ic0luZGV4KSB7XG4gICAgICAgICAgICBuZXdUaHVtYnNJbmRleCA9IG5ld1RodW1ic0luZGV4IC0gTWF0aC5mbG9vcihzbGlkZXNQZXJWaWV3IC8gMikgKyAxO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXdUaHVtYnNJbmRleCA9IG5ld1RodW1ic0luZGV4ICsgTWF0aC5mbG9vcihzbGlkZXNQZXJWaWV3IC8gMikgLSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChuZXdUaHVtYnNJbmRleCA+IGN1cnJlbnRUaHVtYnNJbmRleCAmJiB0aHVtYnNTd2lwZXIucGFyYW1zLnNsaWRlc1Blckdyb3VwID09PSAxKSA7XG4gICAgICAgIHRodW1ic1N3aXBlci5zbGlkZVRvKG5ld1RodW1ic0luZGV4LCBpbml0aWFsID8gMCA6IHVuZGVmaW5lZCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIG9uKCdiZWZvcmVJbml0JywgKCkgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIHRodW1ic1xuICAgIH0gPSBzd2lwZXIucGFyYW1zO1xuICAgIGlmICghdGh1bWJzIHx8ICF0aHVtYnMuc3dpcGVyKSByZXR1cm47XG4gICAgaWYgKHR5cGVvZiB0aHVtYnMuc3dpcGVyID09PSAnc3RyaW5nJyB8fCB0aHVtYnMuc3dpcGVyIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgIGNvbnN0IGRvY3VtZW50ID0gZ2V0RG9jdW1lbnQoKTtcbiAgICAgIGNvbnN0IGdldFRodW1ic0VsZW1lbnRBbmRJbml0ID0gKCkgPT4ge1xuICAgICAgICBjb25zdCB0aHVtYnNFbGVtZW50ID0gdHlwZW9mIHRodW1icy5zd2lwZXIgPT09ICdzdHJpbmcnID8gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aHVtYnMuc3dpcGVyKSA6IHRodW1icy5zd2lwZXI7XG4gICAgICAgIGlmICh0aHVtYnNFbGVtZW50ICYmIHRodW1ic0VsZW1lbnQuc3dpcGVyKSB7XG4gICAgICAgICAgdGh1bWJzLnN3aXBlciA9IHRodW1ic0VsZW1lbnQuc3dpcGVyO1xuICAgICAgICAgIGluaXQoKTtcbiAgICAgICAgICB1cGRhdGUodHJ1ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAodGh1bWJzRWxlbWVudCkge1xuICAgICAgICAgIGNvbnN0IG9uVGh1bWJzU3dpcGVyID0gZSA9PiB7XG4gICAgICAgICAgICB0aHVtYnMuc3dpcGVyID0gZS5kZXRhaWxbMF07XG4gICAgICAgICAgICB0aHVtYnNFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2luaXQnLCBvblRodW1ic1N3aXBlcik7XG4gICAgICAgICAgICBpbml0KCk7XG4gICAgICAgICAgICB1cGRhdGUodHJ1ZSk7XG4gICAgICAgICAgICB0aHVtYnMuc3dpcGVyLnVwZGF0ZSgpO1xuICAgICAgICAgICAgc3dpcGVyLnVwZGF0ZSgpO1xuICAgICAgICAgIH07XG4gICAgICAgICAgdGh1bWJzRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdpbml0Jywgb25UaHVtYnNTd2lwZXIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aHVtYnNFbGVtZW50O1xuICAgICAgfTtcbiAgICAgIGNvbnN0IHdhdGNoRm9yVGh1bWJzVG9BcHBlYXIgPSAoKSA9PiB7XG4gICAgICAgIGlmIChzd2lwZXIuZGVzdHJveWVkKSByZXR1cm47XG4gICAgICAgIGNvbnN0IHRodW1ic0VsZW1lbnQgPSBnZXRUaHVtYnNFbGVtZW50QW5kSW5pdCgpO1xuICAgICAgICBpZiAoIXRodW1ic0VsZW1lbnQpIHtcbiAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUod2F0Y2hGb3JUaHVtYnNUb0FwcGVhcik7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUod2F0Y2hGb3JUaHVtYnNUb0FwcGVhcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGluaXQoKTtcbiAgICAgIHVwZGF0ZSh0cnVlKTtcbiAgICB9XG4gIH0pO1xuICBvbignc2xpZGVDaGFuZ2UgdXBkYXRlIHJlc2l6ZSBvYnNlcnZlclVwZGF0ZScsICgpID0+IHtcbiAgICB1cGRhdGUoKTtcbiAgfSk7XG4gIG9uKCdzZXRUcmFuc2l0aW9uJywgKF9zLCBkdXJhdGlvbikgPT4ge1xuICAgIGNvbnN0IHRodW1ic1N3aXBlciA9IHN3aXBlci50aHVtYnMuc3dpcGVyO1xuICAgIGlmICghdGh1bWJzU3dpcGVyIHx8IHRodW1ic1N3aXBlci5kZXN0cm95ZWQpIHJldHVybjtcbiAgICB0aHVtYnNTd2lwZXIuc2V0VHJhbnNpdGlvbihkdXJhdGlvbik7XG4gIH0pO1xuICBvbignYmVmb3JlRGVzdHJveScsICgpID0+IHtcbiAgICBjb25zdCB0aHVtYnNTd2lwZXIgPSBzd2lwZXIudGh1bWJzLnN3aXBlcjtcbiAgICBpZiAoIXRodW1ic1N3aXBlciB8fCB0aHVtYnNTd2lwZXIuZGVzdHJveWVkKSByZXR1cm47XG4gICAgaWYgKHN3aXBlckNyZWF0ZWQpIHtcbiAgICAgIHRodW1ic1N3aXBlci5kZXN0cm95KCk7XG4gICAgfVxuICB9KTtcbiAgT2JqZWN0LmFzc2lnbihzd2lwZXIudGh1bWJzLCB7XG4gICAgaW5pdCxcbiAgICB1cGRhdGVcbiAgfSk7XG59XG5cbmV4cG9ydCB7IFRodW1iIGFzIGRlZmF1bHQgfTtcbiIsImltcG9ydCB7IGQgYXMgbm93LCBqIGFzIGVsZW1lbnRUcmFuc2l0aW9uRW5kIH0gZnJvbSAnLi4vc2hhcmVkL3V0aWxzLm1qcyc7XG5cbmZ1bmN0aW9uIGZyZWVNb2RlKF9yZWYpIHtcbiAgbGV0IHtcbiAgICBzd2lwZXIsXG4gICAgZXh0ZW5kUGFyYW1zLFxuICAgIGVtaXQsXG4gICAgb25jZVxuICB9ID0gX3JlZjtcbiAgZXh0ZW5kUGFyYW1zKHtcbiAgICBmcmVlTW9kZToge1xuICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICBtb21lbnR1bTogdHJ1ZSxcbiAgICAgIG1vbWVudHVtUmF0aW86IDEsXG4gICAgICBtb21lbnR1bUJvdW5jZTogdHJ1ZSxcbiAgICAgIG1vbWVudHVtQm91bmNlUmF0aW86IDEsXG4gICAgICBtb21lbnR1bVZlbG9jaXR5UmF0aW86IDEsXG4gICAgICBzdGlja3k6IGZhbHNlLFxuICAgICAgbWluaW11bVZlbG9jaXR5OiAwLjAyXG4gICAgfVxuICB9KTtcbiAgZnVuY3Rpb24gb25Ub3VjaFN0YXJ0KCkge1xuICAgIGlmIChzd2lwZXIucGFyYW1zLmNzc01vZGUpIHJldHVybjtcbiAgICBjb25zdCB0cmFuc2xhdGUgPSBzd2lwZXIuZ2V0VHJhbnNsYXRlKCk7XG4gICAgc3dpcGVyLnNldFRyYW5zbGF0ZSh0cmFuc2xhdGUpO1xuICAgIHN3aXBlci5zZXRUcmFuc2l0aW9uKDApO1xuICAgIHN3aXBlci50b3VjaEV2ZW50c0RhdGEudmVsb2NpdGllcy5sZW5ndGggPSAwO1xuICAgIHN3aXBlci5mcmVlTW9kZS5vblRvdWNoRW5kKHtcbiAgICAgIGN1cnJlbnRQb3M6IHN3aXBlci5ydGwgPyBzd2lwZXIudHJhbnNsYXRlIDogLXN3aXBlci50cmFuc2xhdGVcbiAgICB9KTtcbiAgfVxuICBmdW5jdGlvbiBvblRvdWNoTW92ZSgpIHtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5jc3NNb2RlKSByZXR1cm47XG4gICAgY29uc3Qge1xuICAgICAgdG91Y2hFdmVudHNEYXRhOiBkYXRhLFxuICAgICAgdG91Y2hlc1xuICAgIH0gPSBzd2lwZXI7XG4gICAgLy8gVmVsb2NpdHlcbiAgICBpZiAoZGF0YS52ZWxvY2l0aWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgZGF0YS52ZWxvY2l0aWVzLnB1c2goe1xuICAgICAgICBwb3NpdGlvbjogdG91Y2hlc1tzd2lwZXIuaXNIb3Jpem9udGFsKCkgPyAnc3RhcnRYJyA6ICdzdGFydFknXSxcbiAgICAgICAgdGltZTogZGF0YS50b3VjaFN0YXJ0VGltZVxuICAgICAgfSk7XG4gICAgfVxuICAgIGRhdGEudmVsb2NpdGllcy5wdXNoKHtcbiAgICAgIHBvc2l0aW9uOiB0b3VjaGVzW3N3aXBlci5pc0hvcml6b250YWwoKSA/ICdjdXJyZW50WCcgOiAnY3VycmVudFknXSxcbiAgICAgIHRpbWU6IG5vdygpXG4gICAgfSk7XG4gIH1cbiAgZnVuY3Rpb24gb25Ub3VjaEVuZChfcmVmMikge1xuICAgIGxldCB7XG4gICAgICBjdXJyZW50UG9zXG4gICAgfSA9IF9yZWYyO1xuICAgIGlmIChzd2lwZXIucGFyYW1zLmNzc01vZGUpIHJldHVybjtcbiAgICBjb25zdCB7XG4gICAgICBwYXJhbXMsXG4gICAgICB3cmFwcGVyRWwsXG4gICAgICBydGxUcmFuc2xhdGU6IHJ0bCxcbiAgICAgIHNuYXBHcmlkLFxuICAgICAgdG91Y2hFdmVudHNEYXRhOiBkYXRhXG4gICAgfSA9IHN3aXBlcjtcbiAgICAvLyBUaW1lIGRpZmZcbiAgICBjb25zdCB0b3VjaEVuZFRpbWUgPSBub3coKTtcbiAgICBjb25zdCB0aW1lRGlmZiA9IHRvdWNoRW5kVGltZSAtIGRhdGEudG91Y2hTdGFydFRpbWU7XG4gICAgaWYgKGN1cnJlbnRQb3MgPCAtc3dpcGVyLm1pblRyYW5zbGF0ZSgpKSB7XG4gICAgICBzd2lwZXIuc2xpZGVUbyhzd2lwZXIuYWN0aXZlSW5kZXgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoY3VycmVudFBvcyA+IC1zd2lwZXIubWF4VHJhbnNsYXRlKCkpIHtcbiAgICAgIGlmIChzd2lwZXIuc2xpZGVzLmxlbmd0aCA8IHNuYXBHcmlkLmxlbmd0aCkge1xuICAgICAgICBzd2lwZXIuc2xpZGVUbyhzbmFwR3JpZC5sZW5ndGggLSAxKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN3aXBlci5zbGlkZVRvKHN3aXBlci5zbGlkZXMubGVuZ3RoIC0gMSk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChwYXJhbXMuZnJlZU1vZGUubW9tZW50dW0pIHtcbiAgICAgIGlmIChkYXRhLnZlbG9jaXRpZXMubGVuZ3RoID4gMSkge1xuICAgICAgICBjb25zdCBsYXN0TW92ZUV2ZW50ID0gZGF0YS52ZWxvY2l0aWVzLnBvcCgpO1xuICAgICAgICBjb25zdCB2ZWxvY2l0eUV2ZW50ID0gZGF0YS52ZWxvY2l0aWVzLnBvcCgpO1xuICAgICAgICBjb25zdCBkaXN0YW5jZSA9IGxhc3RNb3ZlRXZlbnQucG9zaXRpb24gLSB2ZWxvY2l0eUV2ZW50LnBvc2l0aW9uO1xuICAgICAgICBjb25zdCB0aW1lID0gbGFzdE1vdmVFdmVudC50aW1lIC0gdmVsb2NpdHlFdmVudC50aW1lO1xuICAgICAgICBzd2lwZXIudmVsb2NpdHkgPSBkaXN0YW5jZSAvIHRpbWU7XG4gICAgICAgIHN3aXBlci52ZWxvY2l0eSAvPSAyO1xuICAgICAgICBpZiAoTWF0aC5hYnMoc3dpcGVyLnZlbG9jaXR5KSA8IHBhcmFtcy5mcmVlTW9kZS5taW5pbXVtVmVsb2NpdHkpIHtcbiAgICAgICAgICBzd2lwZXIudmVsb2NpdHkgPSAwO1xuICAgICAgICB9XG4gICAgICAgIC8vIHRoaXMgaW1wbGllcyB0aGF0IHRoZSB1c2VyIHN0b3BwZWQgbW92aW5nIGEgZmluZ2VyIHRoZW4gcmVsZWFzZWQuXG4gICAgICAgIC8vIFRoZXJlIHdvdWxkIGJlIG5vIGV2ZW50cyB3aXRoIGRpc3RhbmNlIHplcm8sIHNvIHRoZSBsYXN0IGV2ZW50IGlzIHN0YWxlLlxuICAgICAgICBpZiAodGltZSA+IDE1MCB8fCBub3coKSAtIGxhc3RNb3ZlRXZlbnQudGltZSA+IDMwMCkge1xuICAgICAgICAgIHN3aXBlci52ZWxvY2l0eSA9IDA7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN3aXBlci52ZWxvY2l0eSA9IDA7XG4gICAgICB9XG4gICAgICBzd2lwZXIudmVsb2NpdHkgKj0gcGFyYW1zLmZyZWVNb2RlLm1vbWVudHVtVmVsb2NpdHlSYXRpbztcbiAgICAgIGRhdGEudmVsb2NpdGllcy5sZW5ndGggPSAwO1xuICAgICAgbGV0IG1vbWVudHVtRHVyYXRpb24gPSAxMDAwICogcGFyYW1zLmZyZWVNb2RlLm1vbWVudHVtUmF0aW87XG4gICAgICBjb25zdCBtb21lbnR1bURpc3RhbmNlID0gc3dpcGVyLnZlbG9jaXR5ICogbW9tZW50dW1EdXJhdGlvbjtcbiAgICAgIGxldCBuZXdQb3NpdGlvbiA9IHN3aXBlci50cmFuc2xhdGUgKyBtb21lbnR1bURpc3RhbmNlO1xuICAgICAgaWYgKHJ0bCkgbmV3UG9zaXRpb24gPSAtbmV3UG9zaXRpb247XG4gICAgICBsZXQgZG9Cb3VuY2UgPSBmYWxzZTtcbiAgICAgIGxldCBhZnRlckJvdW5jZVBvc2l0aW9uO1xuICAgICAgY29uc3QgYm91bmNlQW1vdW50ID0gTWF0aC5hYnMoc3dpcGVyLnZlbG9jaXR5KSAqIDIwICogcGFyYW1zLmZyZWVNb2RlLm1vbWVudHVtQm91bmNlUmF0aW87XG4gICAgICBsZXQgbmVlZHNMb29wRml4O1xuICAgICAgaWYgKG5ld1Bvc2l0aW9uIDwgc3dpcGVyLm1heFRyYW5zbGF0ZSgpKSB7XG4gICAgICAgIGlmIChwYXJhbXMuZnJlZU1vZGUubW9tZW50dW1Cb3VuY2UpIHtcbiAgICAgICAgICBpZiAobmV3UG9zaXRpb24gKyBzd2lwZXIubWF4VHJhbnNsYXRlKCkgPCAtYm91bmNlQW1vdW50KSB7XG4gICAgICAgICAgICBuZXdQb3NpdGlvbiA9IHN3aXBlci5tYXhUcmFuc2xhdGUoKSAtIGJvdW5jZUFtb3VudDtcbiAgICAgICAgICB9XG4gICAgICAgICAgYWZ0ZXJCb3VuY2VQb3NpdGlvbiA9IHN3aXBlci5tYXhUcmFuc2xhdGUoKTtcbiAgICAgICAgICBkb0JvdW5jZSA9IHRydWU7XG4gICAgICAgICAgZGF0YS5hbGxvd01vbWVudHVtQm91bmNlID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXdQb3NpdGlvbiA9IHN3aXBlci5tYXhUcmFuc2xhdGUoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFyYW1zLmxvb3AgJiYgcGFyYW1zLmNlbnRlcmVkU2xpZGVzKSBuZWVkc0xvb3BGaXggPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmIChuZXdQb3NpdGlvbiA+IHN3aXBlci5taW5UcmFuc2xhdGUoKSkge1xuICAgICAgICBpZiAocGFyYW1zLmZyZWVNb2RlLm1vbWVudHVtQm91bmNlKSB7XG4gICAgICAgICAgaWYgKG5ld1Bvc2l0aW9uIC0gc3dpcGVyLm1pblRyYW5zbGF0ZSgpID4gYm91bmNlQW1vdW50KSB7XG4gICAgICAgICAgICBuZXdQb3NpdGlvbiA9IHN3aXBlci5taW5UcmFuc2xhdGUoKSArIGJvdW5jZUFtb3VudDtcbiAgICAgICAgICB9XG4gICAgICAgICAgYWZ0ZXJCb3VuY2VQb3NpdGlvbiA9IHN3aXBlci5taW5UcmFuc2xhdGUoKTtcbiAgICAgICAgICBkb0JvdW5jZSA9IHRydWU7XG4gICAgICAgICAgZGF0YS5hbGxvd01vbWVudHVtQm91bmNlID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXdQb3NpdGlvbiA9IHN3aXBlci5taW5UcmFuc2xhdGUoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFyYW1zLmxvb3AgJiYgcGFyYW1zLmNlbnRlcmVkU2xpZGVzKSBuZWVkc0xvb3BGaXggPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmIChwYXJhbXMuZnJlZU1vZGUuc3RpY2t5KSB7XG4gICAgICAgIGxldCBuZXh0U2xpZGU7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgc25hcEdyaWQubGVuZ3RoOyBqICs9IDEpIHtcbiAgICAgICAgICBpZiAoc25hcEdyaWRbal0gPiAtbmV3UG9zaXRpb24pIHtcbiAgICAgICAgICAgIG5leHRTbGlkZSA9IGo7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKE1hdGguYWJzKHNuYXBHcmlkW25leHRTbGlkZV0gLSBuZXdQb3NpdGlvbikgPCBNYXRoLmFicyhzbmFwR3JpZFtuZXh0U2xpZGUgLSAxXSAtIG5ld1Bvc2l0aW9uKSB8fCBzd2lwZXIuc3dpcGVEaXJlY3Rpb24gPT09ICduZXh0Jykge1xuICAgICAgICAgIG5ld1Bvc2l0aW9uID0gc25hcEdyaWRbbmV4dFNsaWRlXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXdQb3NpdGlvbiA9IHNuYXBHcmlkW25leHRTbGlkZSAtIDFdO1xuICAgICAgICB9XG4gICAgICAgIG5ld1Bvc2l0aW9uID0gLW5ld1Bvc2l0aW9uO1xuICAgICAgfVxuICAgICAgaWYgKG5lZWRzTG9vcEZpeCkge1xuICAgICAgICBvbmNlKCd0cmFuc2l0aW9uRW5kJywgKCkgPT4ge1xuICAgICAgICAgIHN3aXBlci5sb29wRml4KCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgLy8gRml4IGR1cmF0aW9uXG4gICAgICBpZiAoc3dpcGVyLnZlbG9jaXR5ICE9PSAwKSB7XG4gICAgICAgIGlmIChydGwpIHtcbiAgICAgICAgICBtb21lbnR1bUR1cmF0aW9uID0gTWF0aC5hYnMoKC1uZXdQb3NpdGlvbiAtIHN3aXBlci50cmFuc2xhdGUpIC8gc3dpcGVyLnZlbG9jaXR5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtb21lbnR1bUR1cmF0aW9uID0gTWF0aC5hYnMoKG5ld1Bvc2l0aW9uIC0gc3dpcGVyLnRyYW5zbGF0ZSkgLyBzd2lwZXIudmVsb2NpdHkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYXJhbXMuZnJlZU1vZGUuc3RpY2t5KSB7XG4gICAgICAgICAgLy8gSWYgZnJlZU1vZGUuc3RpY2t5IGlzIGFjdGl2ZSBhbmQgdGhlIHVzZXIgZW5kcyBhIHN3aXBlIHdpdGggYSBzbG93LXZlbG9jaXR5XG4gICAgICAgICAgLy8gZXZlbnQsIHRoZW4gZHVyYXRpb25zIGNhbiBiZSAyMCsgc2Vjb25kcyB0byBzbGlkZSBvbmUgKG9yIHplcm8hKSBzbGlkZXMuXG4gICAgICAgICAgLy8gSXQncyBlYXN5IHRvIHNlZSB0aGlzIHdoZW4gc2ltdWxhdGluZyB0b3VjaCB3aXRoIG1vdXNlIGV2ZW50cy4gVG8gZml4IHRoaXMsXG4gICAgICAgICAgLy8gbGltaXQgc2luZ2xlLXNsaWRlIHN3aXBlcyB0byB0aGUgZGVmYXVsdCBzbGlkZSBkdXJhdGlvbi4gVGhpcyBhbHNvIGhhcyB0aGVcbiAgICAgICAgICAvLyBuaWNlIHNpZGUgZWZmZWN0IG9mIG1hdGNoaW5nIHNsaWRlIHNwZWVkIGlmIHRoZSB1c2VyIHN0b3BwZWQgbW92aW5nIGJlZm9yZVxuICAgICAgICAgIC8vIGxpZnRpbmcgZmluZ2VyIG9yIG1vdXNlIHZzLiBtb3Zpbmcgc2xvd2x5IGJlZm9yZSBsaWZ0aW5nIHRoZSBmaW5nZXIvbW91c2UuXG4gICAgICAgICAgLy8gRm9yIGZhc3RlciBzd2lwZXMsIGFsc28gYXBwbHkgbGltaXRzIChhbGJlaXQgaGlnaGVyIG9uZXMpLlxuICAgICAgICAgIGNvbnN0IG1vdmVEaXN0YW5jZSA9IE1hdGguYWJzKChydGwgPyAtbmV3UG9zaXRpb24gOiBuZXdQb3NpdGlvbikgLSBzd2lwZXIudHJhbnNsYXRlKTtcbiAgICAgICAgICBjb25zdCBjdXJyZW50U2xpZGVTaXplID0gc3dpcGVyLnNsaWRlc1NpemVzR3JpZFtzd2lwZXIuYWN0aXZlSW5kZXhdO1xuICAgICAgICAgIGlmIChtb3ZlRGlzdGFuY2UgPCBjdXJyZW50U2xpZGVTaXplKSB7XG4gICAgICAgICAgICBtb21lbnR1bUR1cmF0aW9uID0gcGFyYW1zLnNwZWVkO1xuICAgICAgICAgIH0gZWxzZSBpZiAobW92ZURpc3RhbmNlIDwgMiAqIGN1cnJlbnRTbGlkZVNpemUpIHtcbiAgICAgICAgICAgIG1vbWVudHVtRHVyYXRpb24gPSBwYXJhbXMuc3BlZWQgKiAxLjU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1vbWVudHVtRHVyYXRpb24gPSBwYXJhbXMuc3BlZWQgKiAyLjU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHBhcmFtcy5mcmVlTW9kZS5zdGlja3kpIHtcbiAgICAgICAgc3dpcGVyLnNsaWRlVG9DbG9zZXN0KCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChwYXJhbXMuZnJlZU1vZGUubW9tZW50dW1Cb3VuY2UgJiYgZG9Cb3VuY2UpIHtcbiAgICAgICAgc3dpcGVyLnVwZGF0ZVByb2dyZXNzKGFmdGVyQm91bmNlUG9zaXRpb24pO1xuICAgICAgICBzd2lwZXIuc2V0VHJhbnNpdGlvbihtb21lbnR1bUR1cmF0aW9uKTtcbiAgICAgICAgc3dpcGVyLnNldFRyYW5zbGF0ZShuZXdQb3NpdGlvbik7XG4gICAgICAgIHN3aXBlci50cmFuc2l0aW9uU3RhcnQodHJ1ZSwgc3dpcGVyLnN3aXBlRGlyZWN0aW9uKTtcbiAgICAgICAgc3dpcGVyLmFuaW1hdGluZyA9IHRydWU7XG4gICAgICAgIGVsZW1lbnRUcmFuc2l0aW9uRW5kKHdyYXBwZXJFbCwgKCkgPT4ge1xuICAgICAgICAgIGlmICghc3dpcGVyIHx8IHN3aXBlci5kZXN0cm95ZWQgfHwgIWRhdGEuYWxsb3dNb21lbnR1bUJvdW5jZSkgcmV0dXJuO1xuICAgICAgICAgIGVtaXQoJ21vbWVudHVtQm91bmNlJyk7XG4gICAgICAgICAgc3dpcGVyLnNldFRyYW5zaXRpb24ocGFyYW1zLnNwZWVkKTtcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHN3aXBlci5zZXRUcmFuc2xhdGUoYWZ0ZXJCb3VuY2VQb3NpdGlvbik7XG4gICAgICAgICAgICBlbGVtZW50VHJhbnNpdGlvbkVuZCh3cmFwcGVyRWwsICgpID0+IHtcbiAgICAgICAgICAgICAgaWYgKCFzd2lwZXIgfHwgc3dpcGVyLmRlc3Ryb3llZCkgcmV0dXJuO1xuICAgICAgICAgICAgICBzd2lwZXIudHJhbnNpdGlvbkVuZCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSwgMCk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmIChzd2lwZXIudmVsb2NpdHkpIHtcbiAgICAgICAgZW1pdCgnX2ZyZWVNb2RlTm9Nb21lbnR1bVJlbGVhc2UnKTtcbiAgICAgICAgc3dpcGVyLnVwZGF0ZVByb2dyZXNzKG5ld1Bvc2l0aW9uKTtcbiAgICAgICAgc3dpcGVyLnNldFRyYW5zaXRpb24obW9tZW50dW1EdXJhdGlvbik7XG4gICAgICAgIHN3aXBlci5zZXRUcmFuc2xhdGUobmV3UG9zaXRpb24pO1xuICAgICAgICBzd2lwZXIudHJhbnNpdGlvblN0YXJ0KHRydWUsIHN3aXBlci5zd2lwZURpcmVjdGlvbik7XG4gICAgICAgIGlmICghc3dpcGVyLmFuaW1hdGluZykge1xuICAgICAgICAgIHN3aXBlci5hbmltYXRpbmcgPSB0cnVlO1xuICAgICAgICAgIGVsZW1lbnRUcmFuc2l0aW9uRW5kKHdyYXBwZXJFbCwgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKCFzd2lwZXIgfHwgc3dpcGVyLmRlc3Ryb3llZCkgcmV0dXJuO1xuICAgICAgICAgICAgc3dpcGVyLnRyYW5zaXRpb25FbmQoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3dpcGVyLnVwZGF0ZVByb2dyZXNzKG5ld1Bvc2l0aW9uKTtcbiAgICAgIH1cbiAgICAgIHN3aXBlci51cGRhdGVBY3RpdmVJbmRleCgpO1xuICAgICAgc3dpcGVyLnVwZGF0ZVNsaWRlc0NsYXNzZXMoKTtcbiAgICB9IGVsc2UgaWYgKHBhcmFtcy5mcmVlTW9kZS5zdGlja3kpIHtcbiAgICAgIHN3aXBlci5zbGlkZVRvQ2xvc2VzdCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSBpZiAocGFyYW1zLmZyZWVNb2RlKSB7XG4gICAgICBlbWl0KCdfZnJlZU1vZGVOb01vbWVudHVtUmVsZWFzZScpO1xuICAgIH1cbiAgICBpZiAoIXBhcmFtcy5mcmVlTW9kZS5tb21lbnR1bSB8fCB0aW1lRGlmZiA+PSBwYXJhbXMubG9uZ1N3aXBlc01zKSB7XG4gICAgICBlbWl0KCdfZnJlZU1vZGVTdGF0aWNSZWxlYXNlJyk7XG4gICAgICBzd2lwZXIudXBkYXRlUHJvZ3Jlc3MoKTtcbiAgICAgIHN3aXBlci51cGRhdGVBY3RpdmVJbmRleCgpO1xuICAgICAgc3dpcGVyLnVwZGF0ZVNsaWRlc0NsYXNzZXMoKTtcbiAgICB9XG4gIH1cbiAgT2JqZWN0LmFzc2lnbihzd2lwZXIsIHtcbiAgICBmcmVlTW9kZToge1xuICAgICAgb25Ub3VjaFN0YXJ0LFxuICAgICAgb25Ub3VjaE1vdmUsXG4gICAgICBvblRvdWNoRW5kXG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0IHsgZnJlZU1vZGUgYXMgZGVmYXVsdCB9O1xuIiwiZnVuY3Rpb24gR3JpZChfcmVmKSB7XG4gIGxldCB7XG4gICAgc3dpcGVyLFxuICAgIGV4dGVuZFBhcmFtcyxcbiAgICBvblxuICB9ID0gX3JlZjtcbiAgZXh0ZW5kUGFyYW1zKHtcbiAgICBncmlkOiB7XG4gICAgICByb3dzOiAxLFxuICAgICAgZmlsbDogJ2NvbHVtbidcbiAgICB9XG4gIH0pO1xuICBsZXQgc2xpZGVzTnVtYmVyRXZlblRvUm93cztcbiAgbGV0IHNsaWRlc1BlclJvdztcbiAgbGV0IG51bUZ1bGxDb2x1bW5zO1xuICBsZXQgd2FzTXVsdGlSb3c7XG4gIGNvbnN0IGdldFNwYWNlQmV0d2VlbiA9ICgpID0+IHtcbiAgICBsZXQgc3BhY2VCZXR3ZWVuID0gc3dpcGVyLnBhcmFtcy5zcGFjZUJldHdlZW47XG4gICAgaWYgKHR5cGVvZiBzcGFjZUJldHdlZW4gPT09ICdzdHJpbmcnICYmIHNwYWNlQmV0d2Vlbi5pbmRleE9mKCclJykgPj0gMCkge1xuICAgICAgc3BhY2VCZXR3ZWVuID0gcGFyc2VGbG9hdChzcGFjZUJldHdlZW4ucmVwbGFjZSgnJScsICcnKSkgLyAxMDAgKiBzd2lwZXIuc2l6ZTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBzcGFjZUJldHdlZW4gPT09ICdzdHJpbmcnKSB7XG4gICAgICBzcGFjZUJldHdlZW4gPSBwYXJzZUZsb2F0KHNwYWNlQmV0d2Vlbik7XG4gICAgfVxuICAgIHJldHVybiBzcGFjZUJldHdlZW47XG4gIH07XG4gIGNvbnN0IGluaXRTbGlkZXMgPSBzbGlkZXMgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIHNsaWRlc1BlclZpZXdcbiAgICB9ID0gc3dpcGVyLnBhcmFtcztcbiAgICBjb25zdCB7XG4gICAgICByb3dzLFxuICAgICAgZmlsbFxuICAgIH0gPSBzd2lwZXIucGFyYW1zLmdyaWQ7XG4gICAgY29uc3Qgc2xpZGVzTGVuZ3RoID0gc3dpcGVyLnZpcnR1YWwgJiYgc3dpcGVyLnBhcmFtcy52aXJ0dWFsLmVuYWJsZWQgPyBzd2lwZXIudmlydHVhbC5zbGlkZXMubGVuZ3RoIDogc2xpZGVzLmxlbmd0aDtcbiAgICBudW1GdWxsQ29sdW1ucyA9IE1hdGguZmxvb3Ioc2xpZGVzTGVuZ3RoIC8gcm93cyk7XG4gICAgaWYgKE1hdGguZmxvb3Ioc2xpZGVzTGVuZ3RoIC8gcm93cykgPT09IHNsaWRlc0xlbmd0aCAvIHJvd3MpIHtcbiAgICAgIHNsaWRlc051bWJlckV2ZW5Ub1Jvd3MgPSBzbGlkZXNMZW5ndGg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNsaWRlc051bWJlckV2ZW5Ub1Jvd3MgPSBNYXRoLmNlaWwoc2xpZGVzTGVuZ3RoIC8gcm93cykgKiByb3dzO1xuICAgIH1cbiAgICBpZiAoc2xpZGVzUGVyVmlldyAhPT0gJ2F1dG8nICYmIGZpbGwgPT09ICdyb3cnKSB7XG4gICAgICBzbGlkZXNOdW1iZXJFdmVuVG9Sb3dzID0gTWF0aC5tYXgoc2xpZGVzTnVtYmVyRXZlblRvUm93cywgc2xpZGVzUGVyVmlldyAqIHJvd3MpO1xuICAgIH1cbiAgICBzbGlkZXNQZXJSb3cgPSBzbGlkZXNOdW1iZXJFdmVuVG9Sb3dzIC8gcm93cztcbiAgfTtcbiAgY29uc3QgdW5zZXRTbGlkZXMgPSAoKSA9PiB7XG4gICAgaWYgKHN3aXBlci5zbGlkZXMpIHtcbiAgICAgIHN3aXBlci5zbGlkZXMuZm9yRWFjaChzbGlkZSA9PiB7XG4gICAgICAgIGlmIChzbGlkZS5zd2lwZXJTbGlkZUdyaWRTZXQpIHtcbiAgICAgICAgICBzbGlkZS5zdHlsZS5oZWlnaHQgPSAnJztcbiAgICAgICAgICBzbGlkZS5zdHlsZVtzd2lwZXIuZ2V0RGlyZWN0aW9uTGFiZWwoJ21hcmdpbi10b3AnKV0gPSAnJztcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuICBjb25zdCB1cGRhdGVTbGlkZSA9IChpLCBzbGlkZSwgc2xpZGVzKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgc2xpZGVzUGVyR3JvdXBcbiAgICB9ID0gc3dpcGVyLnBhcmFtcztcbiAgICBjb25zdCBzcGFjZUJldHdlZW4gPSBnZXRTcGFjZUJldHdlZW4oKTtcbiAgICBjb25zdCB7XG4gICAgICByb3dzLFxuICAgICAgZmlsbFxuICAgIH0gPSBzd2lwZXIucGFyYW1zLmdyaWQ7XG4gICAgY29uc3Qgc2xpZGVzTGVuZ3RoID0gc3dpcGVyLnZpcnR1YWwgJiYgc3dpcGVyLnBhcmFtcy52aXJ0dWFsLmVuYWJsZWQgPyBzd2lwZXIudmlydHVhbC5zbGlkZXMubGVuZ3RoIDogc2xpZGVzLmxlbmd0aDtcbiAgICAvLyBTZXQgc2xpZGVzIG9yZGVyXG4gICAgbGV0IG5ld1NsaWRlT3JkZXJJbmRleDtcbiAgICBsZXQgY29sdW1uO1xuICAgIGxldCByb3c7XG4gICAgaWYgKGZpbGwgPT09ICdyb3cnICYmIHNsaWRlc1Blckdyb3VwID4gMSkge1xuICAgICAgY29uc3QgZ3JvdXBJbmRleCA9IE1hdGguZmxvb3IoaSAvIChzbGlkZXNQZXJHcm91cCAqIHJvd3MpKTtcbiAgICAgIGNvbnN0IHNsaWRlSW5kZXhJbkdyb3VwID0gaSAtIHJvd3MgKiBzbGlkZXNQZXJHcm91cCAqIGdyb3VwSW5kZXg7XG4gICAgICBjb25zdCBjb2x1bW5zSW5Hcm91cCA9IGdyb3VwSW5kZXggPT09IDAgPyBzbGlkZXNQZXJHcm91cCA6IE1hdGgubWluKE1hdGguY2VpbCgoc2xpZGVzTGVuZ3RoIC0gZ3JvdXBJbmRleCAqIHJvd3MgKiBzbGlkZXNQZXJHcm91cCkgLyByb3dzKSwgc2xpZGVzUGVyR3JvdXApO1xuICAgICAgcm93ID0gTWF0aC5mbG9vcihzbGlkZUluZGV4SW5Hcm91cCAvIGNvbHVtbnNJbkdyb3VwKTtcbiAgICAgIGNvbHVtbiA9IHNsaWRlSW5kZXhJbkdyb3VwIC0gcm93ICogY29sdW1uc0luR3JvdXAgKyBncm91cEluZGV4ICogc2xpZGVzUGVyR3JvdXA7XG4gICAgICBuZXdTbGlkZU9yZGVySW5kZXggPSBjb2x1bW4gKyByb3cgKiBzbGlkZXNOdW1iZXJFdmVuVG9Sb3dzIC8gcm93cztcbiAgICAgIHNsaWRlLnN0eWxlLm9yZGVyID0gbmV3U2xpZGVPcmRlckluZGV4O1xuICAgIH0gZWxzZSBpZiAoZmlsbCA9PT0gJ2NvbHVtbicpIHtcbiAgICAgIGNvbHVtbiA9IE1hdGguZmxvb3IoaSAvIHJvd3MpO1xuICAgICAgcm93ID0gaSAtIGNvbHVtbiAqIHJvd3M7XG4gICAgICBpZiAoY29sdW1uID4gbnVtRnVsbENvbHVtbnMgfHwgY29sdW1uID09PSBudW1GdWxsQ29sdW1ucyAmJiByb3cgPT09IHJvd3MgLSAxKSB7XG4gICAgICAgIHJvdyArPSAxO1xuICAgICAgICBpZiAocm93ID49IHJvd3MpIHtcbiAgICAgICAgICByb3cgPSAwO1xuICAgICAgICAgIGNvbHVtbiArPSAxO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJvdyA9IE1hdGguZmxvb3IoaSAvIHNsaWRlc1BlclJvdyk7XG4gICAgICBjb2x1bW4gPSBpIC0gcm93ICogc2xpZGVzUGVyUm93O1xuICAgIH1cbiAgICBzbGlkZS5yb3cgPSByb3c7XG4gICAgc2xpZGUuY29sdW1uID0gY29sdW1uO1xuICAgIHNsaWRlLnN0eWxlLmhlaWdodCA9IGBjYWxjKCgxMDAlIC0gJHsocm93cyAtIDEpICogc3BhY2VCZXR3ZWVufXB4KSAvICR7cm93c30pYDtcbiAgICBzbGlkZS5zdHlsZVtzd2lwZXIuZ2V0RGlyZWN0aW9uTGFiZWwoJ21hcmdpbi10b3AnKV0gPSByb3cgIT09IDAgPyBzcGFjZUJldHdlZW4gJiYgYCR7c3BhY2VCZXR3ZWVufXB4YCA6ICcnO1xuICAgIHNsaWRlLnN3aXBlclNsaWRlR3JpZFNldCA9IHRydWU7XG4gIH07XG4gIGNvbnN0IHVwZGF0ZVdyYXBwZXJTaXplID0gKHNsaWRlU2l6ZSwgc25hcEdyaWQpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBjZW50ZXJlZFNsaWRlcyxcbiAgICAgIHJvdW5kTGVuZ3Roc1xuICAgIH0gPSBzd2lwZXIucGFyYW1zO1xuICAgIGNvbnN0IHNwYWNlQmV0d2VlbiA9IGdldFNwYWNlQmV0d2VlbigpO1xuICAgIGNvbnN0IHtcbiAgICAgIHJvd3NcbiAgICB9ID0gc3dpcGVyLnBhcmFtcy5ncmlkO1xuICAgIHN3aXBlci52aXJ0dWFsU2l6ZSA9IChzbGlkZVNpemUgKyBzcGFjZUJldHdlZW4pICogc2xpZGVzTnVtYmVyRXZlblRvUm93cztcbiAgICBzd2lwZXIudmlydHVhbFNpemUgPSBNYXRoLmNlaWwoc3dpcGVyLnZpcnR1YWxTaXplIC8gcm93cykgLSBzcGFjZUJldHdlZW47XG4gICAgaWYgKCFzd2lwZXIucGFyYW1zLmNzc01vZGUpIHtcbiAgICAgIHN3aXBlci53cmFwcGVyRWwuc3R5bGVbc3dpcGVyLmdldERpcmVjdGlvbkxhYmVsKCd3aWR0aCcpXSA9IGAke3N3aXBlci52aXJ0dWFsU2l6ZSArIHNwYWNlQmV0d2Vlbn1weGA7XG4gICAgfVxuICAgIGlmIChjZW50ZXJlZFNsaWRlcykge1xuICAgICAgY29uc3QgbmV3U2xpZGVzR3JpZCA9IFtdO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzbmFwR3JpZC5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBsZXQgc2xpZGVzR3JpZEl0ZW0gPSBzbmFwR3JpZFtpXTtcbiAgICAgICAgaWYgKHJvdW5kTGVuZ3Rocykgc2xpZGVzR3JpZEl0ZW0gPSBNYXRoLmZsb29yKHNsaWRlc0dyaWRJdGVtKTtcbiAgICAgICAgaWYgKHNuYXBHcmlkW2ldIDwgc3dpcGVyLnZpcnR1YWxTaXplICsgc25hcEdyaWRbMF0pIG5ld1NsaWRlc0dyaWQucHVzaChzbGlkZXNHcmlkSXRlbSk7XG4gICAgICB9XG4gICAgICBzbmFwR3JpZC5zcGxpY2UoMCwgc25hcEdyaWQubGVuZ3RoKTtcbiAgICAgIHNuYXBHcmlkLnB1c2goLi4ubmV3U2xpZGVzR3JpZCk7XG4gICAgfVxuICB9O1xuICBjb25zdCBvbkluaXQgPSAoKSA9PiB7XG4gICAgd2FzTXVsdGlSb3cgPSBzd2lwZXIucGFyYW1zLmdyaWQgJiYgc3dpcGVyLnBhcmFtcy5ncmlkLnJvd3MgPiAxO1xuICB9O1xuICBjb25zdCBvblVwZGF0ZSA9ICgpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBwYXJhbXMsXG4gICAgICBlbFxuICAgIH0gPSBzd2lwZXI7XG4gICAgY29uc3QgaXNNdWx0aVJvdyA9IHBhcmFtcy5ncmlkICYmIHBhcmFtcy5ncmlkLnJvd3MgPiAxO1xuICAgIGlmICh3YXNNdWx0aVJvdyAmJiAhaXNNdWx0aVJvdykge1xuICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZShgJHtwYXJhbXMuY29udGFpbmVyTW9kaWZpZXJDbGFzc31ncmlkYCwgYCR7cGFyYW1zLmNvbnRhaW5lck1vZGlmaWVyQ2xhc3N9Z3JpZC1jb2x1bW5gKTtcbiAgICAgIG51bUZ1bGxDb2x1bW5zID0gMTtcbiAgICAgIHN3aXBlci5lbWl0Q29udGFpbmVyQ2xhc3NlcygpO1xuICAgIH0gZWxzZSBpZiAoIXdhc011bHRpUm93ICYmIGlzTXVsdGlSb3cpIHtcbiAgICAgIGVsLmNsYXNzTGlzdC5hZGQoYCR7cGFyYW1zLmNvbnRhaW5lck1vZGlmaWVyQ2xhc3N9Z3JpZGApO1xuICAgICAgaWYgKHBhcmFtcy5ncmlkLmZpbGwgPT09ICdjb2x1bW4nKSB7XG4gICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoYCR7cGFyYW1zLmNvbnRhaW5lck1vZGlmaWVyQ2xhc3N9Z3JpZC1jb2x1bW5gKTtcbiAgICAgIH1cbiAgICAgIHN3aXBlci5lbWl0Q29udGFpbmVyQ2xhc3NlcygpO1xuICAgIH1cbiAgICB3YXNNdWx0aVJvdyA9IGlzTXVsdGlSb3c7XG4gIH07XG4gIG9uKCdpbml0Jywgb25Jbml0KTtcbiAgb24oJ3VwZGF0ZScsIG9uVXBkYXRlKTtcbiAgc3dpcGVyLmdyaWQgPSB7XG4gICAgaW5pdFNsaWRlcyxcbiAgICB1bnNldFNsaWRlcyxcbiAgICB1cGRhdGVTbGlkZSxcbiAgICB1cGRhdGVXcmFwcGVyU2l6ZVxuICB9O1xufVxuXG5leHBvcnQgeyBHcmlkIGFzIGRlZmF1bHQgfTtcbiIsImZ1bmN0aW9uIGFwcGVuZFNsaWRlKHNsaWRlcykge1xuICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICBjb25zdCB7XG4gICAgcGFyYW1zLFxuICAgIHNsaWRlc0VsXG4gIH0gPSBzd2lwZXI7XG4gIGlmIChwYXJhbXMubG9vcCkge1xuICAgIHN3aXBlci5sb29wRGVzdHJveSgpO1xuICB9XG4gIGNvbnN0IGFwcGVuZEVsZW1lbnQgPSBzbGlkZUVsID0+IHtcbiAgICBpZiAodHlwZW9mIHNsaWRlRWwgPT09ICdzdHJpbmcnKSB7XG4gICAgICBjb25zdCB0ZW1wRE9NID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICB0ZW1wRE9NLmlubmVySFRNTCA9IHNsaWRlRWw7XG4gICAgICBzbGlkZXNFbC5hcHBlbmQodGVtcERPTS5jaGlsZHJlblswXSk7XG4gICAgICB0ZW1wRE9NLmlubmVySFRNTCA9ICcnO1xuICAgIH0gZWxzZSB7XG4gICAgICBzbGlkZXNFbC5hcHBlbmQoc2xpZGVFbCk7XG4gICAgfVxuICB9O1xuICBpZiAodHlwZW9mIHNsaWRlcyA9PT0gJ29iamVjdCcgJiYgJ2xlbmd0aCcgaW4gc2xpZGVzKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzbGlkZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGlmIChzbGlkZXNbaV0pIGFwcGVuZEVsZW1lbnQoc2xpZGVzW2ldKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgYXBwZW5kRWxlbWVudChzbGlkZXMpO1xuICB9XG4gIHN3aXBlci5yZWNhbGNTbGlkZXMoKTtcbiAgaWYgKHBhcmFtcy5sb29wKSB7XG4gICAgc3dpcGVyLmxvb3BDcmVhdGUoKTtcbiAgfVxuICBpZiAoIXBhcmFtcy5vYnNlcnZlciB8fCBzd2lwZXIuaXNFbGVtZW50KSB7XG4gICAgc3dpcGVyLnVwZGF0ZSgpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHByZXBlbmRTbGlkZShzbGlkZXMpIHtcbiAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgY29uc3Qge1xuICAgIHBhcmFtcyxcbiAgICBhY3RpdmVJbmRleCxcbiAgICBzbGlkZXNFbFxuICB9ID0gc3dpcGVyO1xuICBpZiAocGFyYW1zLmxvb3ApIHtcbiAgICBzd2lwZXIubG9vcERlc3Ryb3koKTtcbiAgfVxuICBsZXQgbmV3QWN0aXZlSW5kZXggPSBhY3RpdmVJbmRleCArIDE7XG4gIGNvbnN0IHByZXBlbmRFbGVtZW50ID0gc2xpZGVFbCA9PiB7XG4gICAgaWYgKHR5cGVvZiBzbGlkZUVsID09PSAnc3RyaW5nJykge1xuICAgICAgY29uc3QgdGVtcERPTSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgdGVtcERPTS5pbm5lckhUTUwgPSBzbGlkZUVsO1xuICAgICAgc2xpZGVzRWwucHJlcGVuZCh0ZW1wRE9NLmNoaWxkcmVuWzBdKTtcbiAgICAgIHRlbXBET00uaW5uZXJIVE1MID0gJyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNsaWRlc0VsLnByZXBlbmQoc2xpZGVFbCk7XG4gICAgfVxuICB9O1xuICBpZiAodHlwZW9mIHNsaWRlcyA9PT0gJ29iamVjdCcgJiYgJ2xlbmd0aCcgaW4gc2xpZGVzKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzbGlkZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGlmIChzbGlkZXNbaV0pIHByZXBlbmRFbGVtZW50KHNsaWRlc1tpXSk7XG4gICAgfVxuICAgIG5ld0FjdGl2ZUluZGV4ID0gYWN0aXZlSW5kZXggKyBzbGlkZXMubGVuZ3RoO1xuICB9IGVsc2Uge1xuICAgIHByZXBlbmRFbGVtZW50KHNsaWRlcyk7XG4gIH1cbiAgc3dpcGVyLnJlY2FsY1NsaWRlcygpO1xuICBpZiAocGFyYW1zLmxvb3ApIHtcbiAgICBzd2lwZXIubG9vcENyZWF0ZSgpO1xuICB9XG4gIGlmICghcGFyYW1zLm9ic2VydmVyIHx8IHN3aXBlci5pc0VsZW1lbnQpIHtcbiAgICBzd2lwZXIudXBkYXRlKCk7XG4gIH1cbiAgc3dpcGVyLnNsaWRlVG8obmV3QWN0aXZlSW5kZXgsIDAsIGZhbHNlKTtcbn1cblxuZnVuY3Rpb24gYWRkU2xpZGUoaW5kZXgsIHNsaWRlcykge1xuICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICBjb25zdCB7XG4gICAgcGFyYW1zLFxuICAgIGFjdGl2ZUluZGV4LFxuICAgIHNsaWRlc0VsXG4gIH0gPSBzd2lwZXI7XG4gIGxldCBhY3RpdmVJbmRleEJ1ZmZlciA9IGFjdGl2ZUluZGV4O1xuICBpZiAocGFyYW1zLmxvb3ApIHtcbiAgICBhY3RpdmVJbmRleEJ1ZmZlciAtPSBzd2lwZXIubG9vcGVkU2xpZGVzO1xuICAgIHN3aXBlci5sb29wRGVzdHJveSgpO1xuICAgIHN3aXBlci5yZWNhbGNTbGlkZXMoKTtcbiAgfVxuICBjb25zdCBiYXNlTGVuZ3RoID0gc3dpcGVyLnNsaWRlcy5sZW5ndGg7XG4gIGlmIChpbmRleCA8PSAwKSB7XG4gICAgc3dpcGVyLnByZXBlbmRTbGlkZShzbGlkZXMpO1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoaW5kZXggPj0gYmFzZUxlbmd0aCkge1xuICAgIHN3aXBlci5hcHBlbmRTbGlkZShzbGlkZXMpO1xuICAgIHJldHVybjtcbiAgfVxuICBsZXQgbmV3QWN0aXZlSW5kZXggPSBhY3RpdmVJbmRleEJ1ZmZlciA+IGluZGV4ID8gYWN0aXZlSW5kZXhCdWZmZXIgKyAxIDogYWN0aXZlSW5kZXhCdWZmZXI7XG4gIGNvbnN0IHNsaWRlc0J1ZmZlciA9IFtdO1xuICBmb3IgKGxldCBpID0gYmFzZUxlbmd0aCAtIDE7IGkgPj0gaW5kZXg7IGkgLT0gMSkge1xuICAgIGNvbnN0IGN1cnJlbnRTbGlkZSA9IHN3aXBlci5zbGlkZXNbaV07XG4gICAgY3VycmVudFNsaWRlLnJlbW92ZSgpO1xuICAgIHNsaWRlc0J1ZmZlci51bnNoaWZ0KGN1cnJlbnRTbGlkZSk7XG4gIH1cbiAgaWYgKHR5cGVvZiBzbGlkZXMgPT09ICdvYmplY3QnICYmICdsZW5ndGgnIGluIHNsaWRlcykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2xpZGVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBpZiAoc2xpZGVzW2ldKSBzbGlkZXNFbC5hcHBlbmQoc2xpZGVzW2ldKTtcbiAgICB9XG4gICAgbmV3QWN0aXZlSW5kZXggPSBhY3RpdmVJbmRleEJ1ZmZlciA+IGluZGV4ID8gYWN0aXZlSW5kZXhCdWZmZXIgKyBzbGlkZXMubGVuZ3RoIDogYWN0aXZlSW5kZXhCdWZmZXI7XG4gIH0gZWxzZSB7XG4gICAgc2xpZGVzRWwuYXBwZW5kKHNsaWRlcyk7XG4gIH1cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzbGlkZXNCdWZmZXIubGVuZ3RoOyBpICs9IDEpIHtcbiAgICBzbGlkZXNFbC5hcHBlbmQoc2xpZGVzQnVmZmVyW2ldKTtcbiAgfVxuICBzd2lwZXIucmVjYWxjU2xpZGVzKCk7XG4gIGlmIChwYXJhbXMubG9vcCkge1xuICAgIHN3aXBlci5sb29wQ3JlYXRlKCk7XG4gIH1cbiAgaWYgKCFwYXJhbXMub2JzZXJ2ZXIgfHwgc3dpcGVyLmlzRWxlbWVudCkge1xuICAgIHN3aXBlci51cGRhdGUoKTtcbiAgfVxuICBpZiAocGFyYW1zLmxvb3ApIHtcbiAgICBzd2lwZXIuc2xpZGVUbyhuZXdBY3RpdmVJbmRleCArIHN3aXBlci5sb29wZWRTbGlkZXMsIDAsIGZhbHNlKTtcbiAgfSBlbHNlIHtcbiAgICBzd2lwZXIuc2xpZGVUbyhuZXdBY3RpdmVJbmRleCwgMCwgZmFsc2UpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZVNsaWRlKHNsaWRlc0luZGV4ZXMpIHtcbiAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgY29uc3Qge1xuICAgIHBhcmFtcyxcbiAgICBhY3RpdmVJbmRleFxuICB9ID0gc3dpcGVyO1xuICBsZXQgYWN0aXZlSW5kZXhCdWZmZXIgPSBhY3RpdmVJbmRleDtcbiAgaWYgKHBhcmFtcy5sb29wKSB7XG4gICAgYWN0aXZlSW5kZXhCdWZmZXIgLT0gc3dpcGVyLmxvb3BlZFNsaWRlcztcbiAgICBzd2lwZXIubG9vcERlc3Ryb3koKTtcbiAgfVxuICBsZXQgbmV3QWN0aXZlSW5kZXggPSBhY3RpdmVJbmRleEJ1ZmZlcjtcbiAgbGV0IGluZGV4VG9SZW1vdmU7XG4gIGlmICh0eXBlb2Ygc2xpZGVzSW5kZXhlcyA9PT0gJ29iamVjdCcgJiYgJ2xlbmd0aCcgaW4gc2xpZGVzSW5kZXhlcykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2xpZGVzSW5kZXhlcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgaW5kZXhUb1JlbW92ZSA9IHNsaWRlc0luZGV4ZXNbaV07XG4gICAgICBpZiAoc3dpcGVyLnNsaWRlc1tpbmRleFRvUmVtb3ZlXSkgc3dpcGVyLnNsaWRlc1tpbmRleFRvUmVtb3ZlXS5yZW1vdmUoKTtcbiAgICAgIGlmIChpbmRleFRvUmVtb3ZlIDwgbmV3QWN0aXZlSW5kZXgpIG5ld0FjdGl2ZUluZGV4IC09IDE7XG4gICAgfVxuICAgIG5ld0FjdGl2ZUluZGV4ID0gTWF0aC5tYXgobmV3QWN0aXZlSW5kZXgsIDApO1xuICB9IGVsc2Uge1xuICAgIGluZGV4VG9SZW1vdmUgPSBzbGlkZXNJbmRleGVzO1xuICAgIGlmIChzd2lwZXIuc2xpZGVzW2luZGV4VG9SZW1vdmVdKSBzd2lwZXIuc2xpZGVzW2luZGV4VG9SZW1vdmVdLnJlbW92ZSgpO1xuICAgIGlmIChpbmRleFRvUmVtb3ZlIDwgbmV3QWN0aXZlSW5kZXgpIG5ld0FjdGl2ZUluZGV4IC09IDE7XG4gICAgbmV3QWN0aXZlSW5kZXggPSBNYXRoLm1heChuZXdBY3RpdmVJbmRleCwgMCk7XG4gIH1cbiAgc3dpcGVyLnJlY2FsY1NsaWRlcygpO1xuICBpZiAocGFyYW1zLmxvb3ApIHtcbiAgICBzd2lwZXIubG9vcENyZWF0ZSgpO1xuICB9XG4gIGlmICghcGFyYW1zLm9ic2VydmVyIHx8IHN3aXBlci5pc0VsZW1lbnQpIHtcbiAgICBzd2lwZXIudXBkYXRlKCk7XG4gIH1cbiAgaWYgKHBhcmFtcy5sb29wKSB7XG4gICAgc3dpcGVyLnNsaWRlVG8obmV3QWN0aXZlSW5kZXggKyBzd2lwZXIubG9vcGVkU2xpZGVzLCAwLCBmYWxzZSk7XG4gIH0gZWxzZSB7XG4gICAgc3dpcGVyLnNsaWRlVG8obmV3QWN0aXZlSW5kZXgsIDAsIGZhbHNlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZW1vdmVBbGxTbGlkZXMoKSB7XG4gIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gIGNvbnN0IHNsaWRlc0luZGV4ZXMgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzd2lwZXIuc2xpZGVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgc2xpZGVzSW5kZXhlcy5wdXNoKGkpO1xuICB9XG4gIHN3aXBlci5yZW1vdmVTbGlkZShzbGlkZXNJbmRleGVzKTtcbn1cblxuZnVuY3Rpb24gTWFuaXB1bGF0aW9uKF9yZWYpIHtcbiAgbGV0IHtcbiAgICBzd2lwZXJcbiAgfSA9IF9yZWY7XG4gIE9iamVjdC5hc3NpZ24oc3dpcGVyLCB7XG4gICAgYXBwZW5kU2xpZGU6IGFwcGVuZFNsaWRlLmJpbmQoc3dpcGVyKSxcbiAgICBwcmVwZW5kU2xpZGU6IHByZXBlbmRTbGlkZS5iaW5kKHN3aXBlciksXG4gICAgYWRkU2xpZGU6IGFkZFNsaWRlLmJpbmQoc3dpcGVyKSxcbiAgICByZW1vdmVTbGlkZTogcmVtb3ZlU2xpZGUuYmluZChzd2lwZXIpLFxuICAgIHJlbW92ZUFsbFNsaWRlczogcmVtb3ZlQWxsU2xpZGVzLmJpbmQoc3dpcGVyKVxuICB9KTtcbn1cblxuZXhwb3J0IHsgTWFuaXB1bGF0aW9uIGFzIGRlZmF1bHQgfTtcbiIsImZ1bmN0aW9uIGVmZmVjdEluaXQocGFyYW1zKSB7XG4gIGNvbnN0IHtcbiAgICBlZmZlY3QsXG4gICAgc3dpcGVyLFxuICAgIG9uLFxuICAgIHNldFRyYW5zbGF0ZSxcbiAgICBzZXRUcmFuc2l0aW9uLFxuICAgIG92ZXJ3cml0ZVBhcmFtcyxcbiAgICBwZXJzcGVjdGl2ZSxcbiAgICByZWNyZWF0ZVNoYWRvd3MsXG4gICAgZ2V0RWZmZWN0UGFyYW1zXG4gIH0gPSBwYXJhbXM7XG4gIG9uKCdiZWZvcmVJbml0JywgKCkgPT4ge1xuICAgIGlmIChzd2lwZXIucGFyYW1zLmVmZmVjdCAhPT0gZWZmZWN0KSByZXR1cm47XG4gICAgc3dpcGVyLmNsYXNzTmFtZXMucHVzaChgJHtzd2lwZXIucGFyYW1zLmNvbnRhaW5lck1vZGlmaWVyQ2xhc3N9JHtlZmZlY3R9YCk7XG4gICAgaWYgKHBlcnNwZWN0aXZlICYmIHBlcnNwZWN0aXZlKCkpIHtcbiAgICAgIHN3aXBlci5jbGFzc05hbWVzLnB1c2goYCR7c3dpcGVyLnBhcmFtcy5jb250YWluZXJNb2RpZmllckNsYXNzfTNkYCk7XG4gICAgfVxuICAgIGNvbnN0IG92ZXJ3cml0ZVBhcmFtc1Jlc3VsdCA9IG92ZXJ3cml0ZVBhcmFtcyA/IG92ZXJ3cml0ZVBhcmFtcygpIDoge307XG4gICAgT2JqZWN0LmFzc2lnbihzd2lwZXIucGFyYW1zLCBvdmVyd3JpdGVQYXJhbXNSZXN1bHQpO1xuICAgIE9iamVjdC5hc3NpZ24oc3dpcGVyLm9yaWdpbmFsUGFyYW1zLCBvdmVyd3JpdGVQYXJhbXNSZXN1bHQpO1xuICB9KTtcbiAgb24oJ3NldFRyYW5zbGF0ZScsICgpID0+IHtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5lZmZlY3QgIT09IGVmZmVjdCkgcmV0dXJuO1xuICAgIHNldFRyYW5zbGF0ZSgpO1xuICB9KTtcbiAgb24oJ3NldFRyYW5zaXRpb24nLCAoX3MsIGR1cmF0aW9uKSA9PiB7XG4gICAgaWYgKHN3aXBlci5wYXJhbXMuZWZmZWN0ICE9PSBlZmZlY3QpIHJldHVybjtcbiAgICBzZXRUcmFuc2l0aW9uKGR1cmF0aW9uKTtcbiAgfSk7XG4gIG9uKCd0cmFuc2l0aW9uRW5kJywgKCkgPT4ge1xuICAgIGlmIChzd2lwZXIucGFyYW1zLmVmZmVjdCAhPT0gZWZmZWN0KSByZXR1cm47XG4gICAgaWYgKHJlY3JlYXRlU2hhZG93cykge1xuICAgICAgaWYgKCFnZXRFZmZlY3RQYXJhbXMgfHwgIWdldEVmZmVjdFBhcmFtcygpLnNsaWRlU2hhZG93cykgcmV0dXJuO1xuICAgICAgLy8gcmVtb3ZlIHNoYWRvd3NcbiAgICAgIHN3aXBlci5zbGlkZXMuZm9yRWFjaChzbGlkZUVsID0+IHtcbiAgICAgICAgc2xpZGVFbC5xdWVyeVNlbGVjdG9yQWxsKCcuc3dpcGVyLXNsaWRlLXNoYWRvdy10b3AsIC5zd2lwZXItc2xpZGUtc2hhZG93LXJpZ2h0LCAuc3dpcGVyLXNsaWRlLXNoYWRvdy1ib3R0b20sIC5zd2lwZXItc2xpZGUtc2hhZG93LWxlZnQnKS5mb3JFYWNoKHNoYWRvd0VsID0+IHNoYWRvd0VsLnJlbW92ZSgpKTtcbiAgICAgIH0pO1xuICAgICAgLy8gY3JlYXRlIG5ldyBvbmVcbiAgICAgIHJlY3JlYXRlU2hhZG93cygpO1xuICAgIH1cbiAgfSk7XG4gIGxldCByZXF1aXJlVXBkYXRlT25WaXJ0dWFsO1xuICBvbigndmlydHVhbFVwZGF0ZScsICgpID0+IHtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5lZmZlY3QgIT09IGVmZmVjdCkgcmV0dXJuO1xuICAgIGlmICghc3dpcGVyLnNsaWRlcy5sZW5ndGgpIHtcbiAgICAgIHJlcXVpcmVVcGRhdGVPblZpcnR1YWwgPSB0cnVlO1xuICAgIH1cbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgaWYgKHJlcXVpcmVVcGRhdGVPblZpcnR1YWwgJiYgc3dpcGVyLnNsaWRlcyAmJiBzd2lwZXIuc2xpZGVzLmxlbmd0aCkge1xuICAgICAgICBzZXRUcmFuc2xhdGUoKTtcbiAgICAgICAgcmVxdWlyZVVwZGF0ZU9uVmlydHVhbCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn1cblxuZXhwb3J0IHsgZWZmZWN0SW5pdCBhcyBlIH07XG4iLCJpbXBvcnQgeyBsIGFzIGdldFNsaWRlVHJhbnNmb3JtRWwgfSBmcm9tICcuL3V0aWxzLm1qcyc7XG5cbmZ1bmN0aW9uIGVmZmVjdFRhcmdldChlZmZlY3RQYXJhbXMsIHNsaWRlRWwpIHtcbiAgY29uc3QgdHJhbnNmb3JtRWwgPSBnZXRTbGlkZVRyYW5zZm9ybUVsKHNsaWRlRWwpO1xuICBpZiAodHJhbnNmb3JtRWwgIT09IHNsaWRlRWwpIHtcbiAgICB0cmFuc2Zvcm1FbC5zdHlsZS5iYWNrZmFjZVZpc2liaWxpdHkgPSAnaGlkZGVuJztcbiAgICB0cmFuc2Zvcm1FbC5zdHlsZVsnLXdlYmtpdC1iYWNrZmFjZS12aXNpYmlsaXR5J10gPSAnaGlkZGVuJztcbiAgfVxuICByZXR1cm4gdHJhbnNmb3JtRWw7XG59XG5cbmV4cG9ydCB7IGVmZmVjdFRhcmdldCBhcyBlIH07XG4iLCJpbXBvcnQgeyBqIGFzIGVsZW1lbnRUcmFuc2l0aW9uRW5kIH0gZnJvbSAnLi91dGlscy5tanMnO1xuXG5mdW5jdGlvbiBlZmZlY3RWaXJ0dWFsVHJhbnNpdGlvbkVuZChfcmVmKSB7XG4gIGxldCB7XG4gICAgc3dpcGVyLFxuICAgIGR1cmF0aW9uLFxuICAgIHRyYW5zZm9ybUVsZW1lbnRzLFxuICAgIGFsbFNsaWRlc1xuICB9ID0gX3JlZjtcbiAgY29uc3Qge1xuICAgIGFjdGl2ZUluZGV4XG4gIH0gPSBzd2lwZXI7XG4gIGNvbnN0IGdldFNsaWRlID0gZWwgPT4ge1xuICAgIGlmICghZWwucGFyZW50RWxlbWVudCkge1xuICAgICAgLy8gYXNzdW1lIHNoYWRvdyByb290XG4gICAgICBjb25zdCBzbGlkZSA9IHN3aXBlci5zbGlkZXMuZmlsdGVyKHNsaWRlRWwgPT4gc2xpZGVFbC5zaGFkb3dSb290ICYmIHNsaWRlRWwuc2hhZG93Um9vdCA9PT0gZWwucGFyZW50Tm9kZSlbMF07XG4gICAgICByZXR1cm4gc2xpZGU7XG4gICAgfVxuICAgIHJldHVybiBlbC5wYXJlbnRFbGVtZW50O1xuICB9O1xuICBpZiAoc3dpcGVyLnBhcmFtcy52aXJ0dWFsVHJhbnNsYXRlICYmIGR1cmF0aW9uICE9PSAwKSB7XG4gICAgbGV0IGV2ZW50VHJpZ2dlcmVkID0gZmFsc2U7XG4gICAgbGV0IHRyYW5zaXRpb25FbmRUYXJnZXQ7XG4gICAgaWYgKGFsbFNsaWRlcykge1xuICAgICAgdHJhbnNpdGlvbkVuZFRhcmdldCA9IHRyYW5zZm9ybUVsZW1lbnRzO1xuICAgIH0gZWxzZSB7XG4gICAgICB0cmFuc2l0aW9uRW5kVGFyZ2V0ID0gdHJhbnNmb3JtRWxlbWVudHMuZmlsdGVyKHRyYW5zZm9ybUVsID0+IHtcbiAgICAgICAgY29uc3QgZWwgPSB0cmFuc2Zvcm1FbC5jbGFzc0xpc3QuY29udGFpbnMoJ3N3aXBlci1zbGlkZS10cmFuc2Zvcm0nKSA/IGdldFNsaWRlKHRyYW5zZm9ybUVsKSA6IHRyYW5zZm9ybUVsO1xuICAgICAgICByZXR1cm4gc3dpcGVyLmdldFNsaWRlSW5kZXgoZWwpID09PSBhY3RpdmVJbmRleDtcbiAgICAgIH0pO1xuICAgIH1cbiAgICB0cmFuc2l0aW9uRW5kVGFyZ2V0LmZvckVhY2goZWwgPT4ge1xuICAgICAgZWxlbWVudFRyYW5zaXRpb25FbmQoZWwsICgpID0+IHtcbiAgICAgICAgaWYgKGV2ZW50VHJpZ2dlcmVkKSByZXR1cm47XG4gICAgICAgIGlmICghc3dpcGVyIHx8IHN3aXBlci5kZXN0cm95ZWQpIHJldHVybjtcbiAgICAgICAgZXZlbnRUcmlnZ2VyZWQgPSB0cnVlO1xuICAgICAgICBzd2lwZXIuYW5pbWF0aW5nID0gZmFsc2U7XG4gICAgICAgIGNvbnN0IGV2dCA9IG5ldyB3aW5kb3cuQ3VzdG9tRXZlbnQoJ3RyYW5zaXRpb25lbmQnLCB7XG4gICAgICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICAgICAgICBjYW5jZWxhYmxlOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgICBzd2lwZXIud3JhcHBlckVsLmRpc3BhdGNoRXZlbnQoZXZ0KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCB7IGVmZmVjdFZpcnR1YWxUcmFuc2l0aW9uRW5kIGFzIGUgfTtcbiIsImltcG9ydCB7IGUgYXMgZWZmZWN0SW5pdCB9IGZyb20gJy4uL3NoYXJlZC9lZmZlY3QtaW5pdC5tanMnO1xuaW1wb3J0IHsgZSBhcyBlZmZlY3RUYXJnZXQgfSBmcm9tICcuLi9zaGFyZWQvZWZmZWN0LXRhcmdldC5tanMnO1xuaW1wb3J0IHsgZSBhcyBlZmZlY3RWaXJ0dWFsVHJhbnNpdGlvbkVuZCB9IGZyb20gJy4uL3NoYXJlZC9lZmZlY3QtdmlydHVhbC10cmFuc2l0aW9uLWVuZC5tanMnO1xuaW1wb3J0IHsgbCBhcyBnZXRTbGlkZVRyYW5zZm9ybUVsIH0gZnJvbSAnLi4vc2hhcmVkL3V0aWxzLm1qcyc7XG5cbmZ1bmN0aW9uIEVmZmVjdEZhZGUoX3JlZikge1xuICBsZXQge1xuICAgIHN3aXBlcixcbiAgICBleHRlbmRQYXJhbXMsXG4gICAgb25cbiAgfSA9IF9yZWY7XG4gIGV4dGVuZFBhcmFtcyh7XG4gICAgZmFkZUVmZmVjdDoge1xuICAgICAgY3Jvc3NGYWRlOiBmYWxzZVxuICAgIH1cbiAgfSk7XG4gIGNvbnN0IHNldFRyYW5zbGF0ZSA9ICgpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBzbGlkZXNcbiAgICB9ID0gc3dpcGVyO1xuICAgIGNvbnN0IHBhcmFtcyA9IHN3aXBlci5wYXJhbXMuZmFkZUVmZmVjdDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNsaWRlcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgY29uc3Qgc2xpZGVFbCA9IHN3aXBlci5zbGlkZXNbaV07XG4gICAgICBjb25zdCBvZmZzZXQgPSBzbGlkZUVsLnN3aXBlclNsaWRlT2Zmc2V0O1xuICAgICAgbGV0IHR4ID0gLW9mZnNldDtcbiAgICAgIGlmICghc3dpcGVyLnBhcmFtcy52aXJ0dWFsVHJhbnNsYXRlKSB0eCAtPSBzd2lwZXIudHJhbnNsYXRlO1xuICAgICAgbGV0IHR5ID0gMDtcbiAgICAgIGlmICghc3dpcGVyLmlzSG9yaXpvbnRhbCgpKSB7XG4gICAgICAgIHR5ID0gdHg7XG4gICAgICAgIHR4ID0gMDtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHNsaWRlT3BhY2l0eSA9IHN3aXBlci5wYXJhbXMuZmFkZUVmZmVjdC5jcm9zc0ZhZGUgPyBNYXRoLm1heCgxIC0gTWF0aC5hYnMoc2xpZGVFbC5wcm9ncmVzcyksIDApIDogMSArIE1hdGgubWluKE1hdGgubWF4KHNsaWRlRWwucHJvZ3Jlc3MsIC0xKSwgMCk7XG4gICAgICBjb25zdCB0YXJnZXRFbCA9IGVmZmVjdFRhcmdldChwYXJhbXMsIHNsaWRlRWwpO1xuICAgICAgdGFyZ2V0RWwuc3R5bGUub3BhY2l0eSA9IHNsaWRlT3BhY2l0eTtcbiAgICAgIHRhcmdldEVsLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUzZCgke3R4fXB4LCAke3R5fXB4LCAwcHgpYDtcbiAgICB9XG4gIH07XG4gIGNvbnN0IHNldFRyYW5zaXRpb24gPSBkdXJhdGlvbiA9PiB7XG4gICAgY29uc3QgdHJhbnNmb3JtRWxlbWVudHMgPSBzd2lwZXIuc2xpZGVzLm1hcChzbGlkZUVsID0+IGdldFNsaWRlVHJhbnNmb3JtRWwoc2xpZGVFbCkpO1xuICAgIHRyYW5zZm9ybUVsZW1lbnRzLmZvckVhY2goZWwgPT4ge1xuICAgICAgZWwuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gYCR7ZHVyYXRpb259bXNgO1xuICAgIH0pO1xuICAgIGVmZmVjdFZpcnR1YWxUcmFuc2l0aW9uRW5kKHtcbiAgICAgIHN3aXBlcixcbiAgICAgIGR1cmF0aW9uLFxuICAgICAgdHJhbnNmb3JtRWxlbWVudHMsXG4gICAgICBhbGxTbGlkZXM6IHRydWVcbiAgICB9KTtcbiAgfTtcbiAgZWZmZWN0SW5pdCh7XG4gICAgZWZmZWN0OiAnZmFkZScsXG4gICAgc3dpcGVyLFxuICAgIG9uLFxuICAgIHNldFRyYW5zbGF0ZSxcbiAgICBzZXRUcmFuc2l0aW9uLFxuICAgIG92ZXJ3cml0ZVBhcmFtczogKCkgPT4gKHtcbiAgICAgIHNsaWRlc1BlclZpZXc6IDEsXG4gICAgICBzbGlkZXNQZXJHcm91cDogMSxcbiAgICAgIHdhdGNoU2xpZGVzUHJvZ3Jlc3M6IHRydWUsXG4gICAgICBzcGFjZUJldHdlZW46IDAsXG4gICAgICB2aXJ0dWFsVHJhbnNsYXRlOiAhc3dpcGVyLnBhcmFtcy5jc3NNb2RlXG4gICAgfSlcbiAgfSk7XG59XG5cbmV4cG9ydCB7IEVmZmVjdEZhZGUgYXMgZGVmYXVsdCB9O1xuIiwiaW1wb3J0IHsgZSBhcyBlZmZlY3RJbml0IH0gZnJvbSAnLi4vc2hhcmVkL2VmZmVjdC1pbml0Lm1qcyc7XG5pbXBvcnQgeyBjIGFzIGNyZWF0ZUVsZW1lbnQgfSBmcm9tICcuLi9zaGFyZWQvdXRpbHMubWpzJztcblxuZnVuY3Rpb24gRWZmZWN0Q3ViZShfcmVmKSB7XG4gIGxldCB7XG4gICAgc3dpcGVyLFxuICAgIGV4dGVuZFBhcmFtcyxcbiAgICBvblxuICB9ID0gX3JlZjtcbiAgZXh0ZW5kUGFyYW1zKHtcbiAgICBjdWJlRWZmZWN0OiB7XG4gICAgICBzbGlkZVNoYWRvd3M6IHRydWUsXG4gICAgICBzaGFkb3c6IHRydWUsXG4gICAgICBzaGFkb3dPZmZzZXQ6IDIwLFxuICAgICAgc2hhZG93U2NhbGU6IDAuOTRcbiAgICB9XG4gIH0pO1xuICBjb25zdCBjcmVhdGVTbGlkZVNoYWRvd3MgPSAoc2xpZGVFbCwgcHJvZ3Jlc3MsIGlzSG9yaXpvbnRhbCkgPT4ge1xuICAgIGxldCBzaGFkb3dCZWZvcmUgPSBpc0hvcml6b250YWwgPyBzbGlkZUVsLnF1ZXJ5U2VsZWN0b3IoJy5zd2lwZXItc2xpZGUtc2hhZG93LWxlZnQnKSA6IHNsaWRlRWwucXVlcnlTZWxlY3RvcignLnN3aXBlci1zbGlkZS1zaGFkb3ctdG9wJyk7XG4gICAgbGV0IHNoYWRvd0FmdGVyID0gaXNIb3Jpem9udGFsID8gc2xpZGVFbC5xdWVyeVNlbGVjdG9yKCcuc3dpcGVyLXNsaWRlLXNoYWRvdy1yaWdodCcpIDogc2xpZGVFbC5xdWVyeVNlbGVjdG9yKCcuc3dpcGVyLXNsaWRlLXNoYWRvdy1ib3R0b20nKTtcbiAgICBpZiAoIXNoYWRvd0JlZm9yZSkge1xuICAgICAgc2hhZG93QmVmb3JlID0gY3JlYXRlRWxlbWVudCgnZGl2JywgYHN3aXBlci1zbGlkZS1zaGFkb3ctY3ViZSBzd2lwZXItc2xpZGUtc2hhZG93LSR7aXNIb3Jpem9udGFsID8gJ2xlZnQnIDogJ3RvcCd9YC5zcGxpdCgnICcpKTtcbiAgICAgIHNsaWRlRWwuYXBwZW5kKHNoYWRvd0JlZm9yZSk7XG4gICAgfVxuICAgIGlmICghc2hhZG93QWZ0ZXIpIHtcbiAgICAgIHNoYWRvd0FmdGVyID0gY3JlYXRlRWxlbWVudCgnZGl2JywgYHN3aXBlci1zbGlkZS1zaGFkb3ctY3ViZSBzd2lwZXItc2xpZGUtc2hhZG93LSR7aXNIb3Jpem9udGFsID8gJ3JpZ2h0JyA6ICdib3R0b20nfWAuc3BsaXQoJyAnKSk7XG4gICAgICBzbGlkZUVsLmFwcGVuZChzaGFkb3dBZnRlcik7XG4gICAgfVxuICAgIGlmIChzaGFkb3dCZWZvcmUpIHNoYWRvd0JlZm9yZS5zdHlsZS5vcGFjaXR5ID0gTWF0aC5tYXgoLXByb2dyZXNzLCAwKTtcbiAgICBpZiAoc2hhZG93QWZ0ZXIpIHNoYWRvd0FmdGVyLnN0eWxlLm9wYWNpdHkgPSBNYXRoLm1heChwcm9ncmVzcywgMCk7XG4gIH07XG4gIGNvbnN0IHJlY3JlYXRlU2hhZG93cyA9ICgpID0+IHtcbiAgICAvLyBjcmVhdGUgbmV3IG9uZXNcbiAgICBjb25zdCBpc0hvcml6b250YWwgPSBzd2lwZXIuaXNIb3Jpem9udGFsKCk7XG4gICAgc3dpcGVyLnNsaWRlcy5mb3JFYWNoKHNsaWRlRWwgPT4ge1xuICAgICAgY29uc3QgcHJvZ3Jlc3MgPSBNYXRoLm1heChNYXRoLm1pbihzbGlkZUVsLnByb2dyZXNzLCAxKSwgLTEpO1xuICAgICAgY3JlYXRlU2xpZGVTaGFkb3dzKHNsaWRlRWwsIHByb2dyZXNzLCBpc0hvcml6b250YWwpO1xuICAgIH0pO1xuICB9O1xuICBjb25zdCBzZXRUcmFuc2xhdGUgPSAoKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgZWwsXG4gICAgICB3cmFwcGVyRWwsXG4gICAgICBzbGlkZXMsXG4gICAgICB3aWR0aDogc3dpcGVyV2lkdGgsXG4gICAgICBoZWlnaHQ6IHN3aXBlckhlaWdodCxcbiAgICAgIHJ0bFRyYW5zbGF0ZTogcnRsLFxuICAgICAgc2l6ZTogc3dpcGVyU2l6ZSxcbiAgICAgIGJyb3dzZXJcbiAgICB9ID0gc3dpcGVyO1xuICAgIGNvbnN0IHBhcmFtcyA9IHN3aXBlci5wYXJhbXMuY3ViZUVmZmVjdDtcbiAgICBjb25zdCBpc0hvcml6b250YWwgPSBzd2lwZXIuaXNIb3Jpem9udGFsKCk7XG4gICAgY29uc3QgaXNWaXJ0dWFsID0gc3dpcGVyLnZpcnR1YWwgJiYgc3dpcGVyLnBhcmFtcy52aXJ0dWFsLmVuYWJsZWQ7XG4gICAgbGV0IHdyYXBwZXJSb3RhdGUgPSAwO1xuICAgIGxldCBjdWJlU2hhZG93RWw7XG4gICAgaWYgKHBhcmFtcy5zaGFkb3cpIHtcbiAgICAgIGlmIChpc0hvcml6b250YWwpIHtcbiAgICAgICAgY3ViZVNoYWRvd0VsID0gc3dpcGVyLndyYXBwZXJFbC5xdWVyeVNlbGVjdG9yKCcuc3dpcGVyLWN1YmUtc2hhZG93Jyk7XG4gICAgICAgIGlmICghY3ViZVNoYWRvd0VsKSB7XG4gICAgICAgICAgY3ViZVNoYWRvd0VsID0gY3JlYXRlRWxlbWVudCgnZGl2JywgJ3N3aXBlci1jdWJlLXNoYWRvdycpO1xuICAgICAgICAgIHN3aXBlci53cmFwcGVyRWwuYXBwZW5kKGN1YmVTaGFkb3dFbCk7XG4gICAgICAgIH1cbiAgICAgICAgY3ViZVNoYWRvd0VsLnN0eWxlLmhlaWdodCA9IGAke3N3aXBlcldpZHRofXB4YDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGN1YmVTaGFkb3dFbCA9IGVsLnF1ZXJ5U2VsZWN0b3IoJy5zd2lwZXItY3ViZS1zaGFkb3cnKTtcbiAgICAgICAgaWYgKCFjdWJlU2hhZG93RWwpIHtcbiAgICAgICAgICBjdWJlU2hhZG93RWwgPSBjcmVhdGVFbGVtZW50KCdkaXYnLCAnc3dpcGVyLWN1YmUtc2hhZG93Jyk7XG4gICAgICAgICAgZWwuYXBwZW5kKGN1YmVTaGFkb3dFbCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzbGlkZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGNvbnN0IHNsaWRlRWwgPSBzbGlkZXNbaV07XG4gICAgICBsZXQgc2xpZGVJbmRleCA9IGk7XG4gICAgICBpZiAoaXNWaXJ0dWFsKSB7XG4gICAgICAgIHNsaWRlSW5kZXggPSBwYXJzZUludChzbGlkZUVsLmdldEF0dHJpYnV0ZSgnZGF0YS1zd2lwZXItc2xpZGUtaW5kZXgnKSwgMTApO1xuICAgICAgfVxuICAgICAgbGV0IHNsaWRlQW5nbGUgPSBzbGlkZUluZGV4ICogOTA7XG4gICAgICBsZXQgcm91bmQgPSBNYXRoLmZsb29yKHNsaWRlQW5nbGUgLyAzNjApO1xuICAgICAgaWYgKHJ0bCkge1xuICAgICAgICBzbGlkZUFuZ2xlID0gLXNsaWRlQW5nbGU7XG4gICAgICAgIHJvdW5kID0gTWF0aC5mbG9vcigtc2xpZGVBbmdsZSAvIDM2MCk7XG4gICAgICB9XG4gICAgICBjb25zdCBwcm9ncmVzcyA9IE1hdGgubWF4KE1hdGgubWluKHNsaWRlRWwucHJvZ3Jlc3MsIDEpLCAtMSk7XG4gICAgICBsZXQgdHggPSAwO1xuICAgICAgbGV0IHR5ID0gMDtcbiAgICAgIGxldCB0eiA9IDA7XG4gICAgICBpZiAoc2xpZGVJbmRleCAlIDQgPT09IDApIHtcbiAgICAgICAgdHggPSAtcm91bmQgKiA0ICogc3dpcGVyU2l6ZTtcbiAgICAgICAgdHogPSAwO1xuICAgICAgfSBlbHNlIGlmICgoc2xpZGVJbmRleCAtIDEpICUgNCA9PT0gMCkge1xuICAgICAgICB0eCA9IDA7XG4gICAgICAgIHR6ID0gLXJvdW5kICogNCAqIHN3aXBlclNpemU7XG4gICAgICB9IGVsc2UgaWYgKChzbGlkZUluZGV4IC0gMikgJSA0ID09PSAwKSB7XG4gICAgICAgIHR4ID0gc3dpcGVyU2l6ZSArIHJvdW5kICogNCAqIHN3aXBlclNpemU7XG4gICAgICAgIHR6ID0gc3dpcGVyU2l6ZTtcbiAgICAgIH0gZWxzZSBpZiAoKHNsaWRlSW5kZXggLSAzKSAlIDQgPT09IDApIHtcbiAgICAgICAgdHggPSAtc3dpcGVyU2l6ZTtcbiAgICAgICAgdHogPSAzICogc3dpcGVyU2l6ZSArIHN3aXBlclNpemUgKiA0ICogcm91bmQ7XG4gICAgICB9XG4gICAgICBpZiAocnRsKSB7XG4gICAgICAgIHR4ID0gLXR4O1xuICAgICAgfVxuICAgICAgaWYgKCFpc0hvcml6b250YWwpIHtcbiAgICAgICAgdHkgPSB0eDtcbiAgICAgICAgdHggPSAwO1xuICAgICAgfVxuICAgICAgY29uc3QgdHJhbnNmb3JtID0gYHJvdGF0ZVgoJHtpc0hvcml6b250YWwgPyAwIDogLXNsaWRlQW5nbGV9ZGVnKSByb3RhdGVZKCR7aXNIb3Jpem9udGFsID8gc2xpZGVBbmdsZSA6IDB9ZGVnKSB0cmFuc2xhdGUzZCgke3R4fXB4LCAke3R5fXB4LCAke3R6fXB4KWA7XG4gICAgICBpZiAocHJvZ3Jlc3MgPD0gMSAmJiBwcm9ncmVzcyA+IC0xKSB7XG4gICAgICAgIHdyYXBwZXJSb3RhdGUgPSBzbGlkZUluZGV4ICogOTAgKyBwcm9ncmVzcyAqIDkwO1xuICAgICAgICBpZiAocnRsKSB3cmFwcGVyUm90YXRlID0gLXNsaWRlSW5kZXggKiA5MCAtIHByb2dyZXNzICogOTA7XG4gICAgICAgIGlmIChzd2lwZXIuYnJvd3NlciAmJiBzd2lwZXIuYnJvd3Nlci5pc1NhZmFyaSAmJiBNYXRoLmFicyh3cmFwcGVyUm90YXRlKSAvIDkwICUgMiA9PT0gMSkge1xuICAgICAgICAgIHdyYXBwZXJSb3RhdGUgKz0gMC4wMDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHNsaWRlRWwuc3R5bGUudHJhbnNmb3JtID0gdHJhbnNmb3JtO1xuICAgICAgaWYgKHBhcmFtcy5zbGlkZVNoYWRvd3MpIHtcbiAgICAgICAgY3JlYXRlU2xpZGVTaGFkb3dzKHNsaWRlRWwsIHByb2dyZXNzLCBpc0hvcml6b250YWwpO1xuICAgICAgfVxuICAgIH1cbiAgICB3cmFwcGVyRWwuc3R5bGUudHJhbnNmb3JtT3JpZ2luID0gYDUwJSA1MCUgLSR7c3dpcGVyU2l6ZSAvIDJ9cHhgO1xuICAgIHdyYXBwZXJFbC5zdHlsZVsnLXdlYmtpdC10cmFuc2Zvcm0tb3JpZ2luJ10gPSBgNTAlIDUwJSAtJHtzd2lwZXJTaXplIC8gMn1weGA7XG4gICAgaWYgKHBhcmFtcy5zaGFkb3cpIHtcbiAgICAgIGlmIChpc0hvcml6b250YWwpIHtcbiAgICAgICAgY3ViZVNoYWRvd0VsLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUzZCgwcHgsICR7c3dpcGVyV2lkdGggLyAyICsgcGFyYW1zLnNoYWRvd09mZnNldH1weCwgJHstc3dpcGVyV2lkdGggLyAyfXB4KSByb3RhdGVYKDg5Ljk5ZGVnKSByb3RhdGVaKDBkZWcpIHNjYWxlKCR7cGFyYW1zLnNoYWRvd1NjYWxlfSlgO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3Qgc2hhZG93QW5nbGUgPSBNYXRoLmFicyh3cmFwcGVyUm90YXRlKSAtIE1hdGguZmxvb3IoTWF0aC5hYnMod3JhcHBlclJvdGF0ZSkgLyA5MCkgKiA5MDtcbiAgICAgICAgY29uc3QgbXVsdGlwbGllciA9IDEuNSAtIChNYXRoLnNpbihzaGFkb3dBbmdsZSAqIDIgKiBNYXRoLlBJIC8gMzYwKSAvIDIgKyBNYXRoLmNvcyhzaGFkb3dBbmdsZSAqIDIgKiBNYXRoLlBJIC8gMzYwKSAvIDIpO1xuICAgICAgICBjb25zdCBzY2FsZTEgPSBwYXJhbXMuc2hhZG93U2NhbGU7XG4gICAgICAgIGNvbnN0IHNjYWxlMiA9IHBhcmFtcy5zaGFkb3dTY2FsZSAvIG11bHRpcGxpZXI7XG4gICAgICAgIGNvbnN0IG9mZnNldCA9IHBhcmFtcy5zaGFkb3dPZmZzZXQ7XG4gICAgICAgIGN1YmVTaGFkb3dFbC5zdHlsZS50cmFuc2Zvcm0gPSBgc2NhbGUzZCgke3NjYWxlMX0sIDEsICR7c2NhbGUyfSkgdHJhbnNsYXRlM2QoMHB4LCAke3N3aXBlckhlaWdodCAvIDIgKyBvZmZzZXR9cHgsICR7LXN3aXBlckhlaWdodCAvIDIgLyBzY2FsZTJ9cHgpIHJvdGF0ZVgoLTg5Ljk5ZGVnKWA7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHpGYWN0b3IgPSAoYnJvd3Nlci5pc1NhZmFyaSB8fCBicm93c2VyLmlzV2ViVmlldykgJiYgYnJvd3Nlci5uZWVkUGVyc3BlY3RpdmVGaXggPyAtc3dpcGVyU2l6ZSAvIDIgOiAwO1xuICAgIHdyYXBwZXJFbC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlM2QoMHB4LDAsJHt6RmFjdG9yfXB4KSByb3RhdGVYKCR7c3dpcGVyLmlzSG9yaXpvbnRhbCgpID8gMCA6IHdyYXBwZXJSb3RhdGV9ZGVnKSByb3RhdGVZKCR7c3dpcGVyLmlzSG9yaXpvbnRhbCgpID8gLXdyYXBwZXJSb3RhdGUgOiAwfWRlZylgO1xuICAgIHdyYXBwZXJFbC5zdHlsZS5zZXRQcm9wZXJ0eSgnLS1zd2lwZXItY3ViZS10cmFuc2xhdGUteicsIGAke3pGYWN0b3J9cHhgKTtcbiAgfTtcbiAgY29uc3Qgc2V0VHJhbnNpdGlvbiA9IGR1cmF0aW9uID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBlbCxcbiAgICAgIHNsaWRlc1xuICAgIH0gPSBzd2lwZXI7XG4gICAgc2xpZGVzLmZvckVhY2goc2xpZGVFbCA9PiB7XG4gICAgICBzbGlkZUVsLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IGAke2R1cmF0aW9ufW1zYDtcbiAgICAgIHNsaWRlRWwucXVlcnlTZWxlY3RvckFsbCgnLnN3aXBlci1zbGlkZS1zaGFkb3ctdG9wLCAuc3dpcGVyLXNsaWRlLXNoYWRvdy1yaWdodCwgLnN3aXBlci1zbGlkZS1zaGFkb3ctYm90dG9tLCAuc3dpcGVyLXNsaWRlLXNoYWRvdy1sZWZ0JykuZm9yRWFjaChzdWJFbCA9PiB7XG4gICAgICAgIHN1YkVsLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IGAke2R1cmF0aW9ufW1zYDtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGlmIChzd2lwZXIucGFyYW1zLmN1YmVFZmZlY3Quc2hhZG93ICYmICFzd2lwZXIuaXNIb3Jpem9udGFsKCkpIHtcbiAgICAgIGNvbnN0IHNoYWRvd0VsID0gZWwucXVlcnlTZWxlY3RvcignLnN3aXBlci1jdWJlLXNoYWRvdycpO1xuICAgICAgaWYgKHNoYWRvd0VsKSBzaGFkb3dFbC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSBgJHtkdXJhdGlvbn1tc2A7XG4gICAgfVxuICB9O1xuICBlZmZlY3RJbml0KHtcbiAgICBlZmZlY3Q6ICdjdWJlJyxcbiAgICBzd2lwZXIsXG4gICAgb24sXG4gICAgc2V0VHJhbnNsYXRlLFxuICAgIHNldFRyYW5zaXRpb24sXG4gICAgcmVjcmVhdGVTaGFkb3dzLFxuICAgIGdldEVmZmVjdFBhcmFtczogKCkgPT4gc3dpcGVyLnBhcmFtcy5jdWJlRWZmZWN0LFxuICAgIHBlcnNwZWN0aXZlOiAoKSA9PiB0cnVlLFxuICAgIG92ZXJ3cml0ZVBhcmFtczogKCkgPT4gKHtcbiAgICAgIHNsaWRlc1BlclZpZXc6IDEsXG4gICAgICBzbGlkZXNQZXJHcm91cDogMSxcbiAgICAgIHdhdGNoU2xpZGVzUHJvZ3Jlc3M6IHRydWUsXG4gICAgICByZXNpc3RhbmNlUmF0aW86IDAsXG4gICAgICBzcGFjZUJldHdlZW46IDAsXG4gICAgICBjZW50ZXJlZFNsaWRlczogZmFsc2UsXG4gICAgICB2aXJ0dWFsVHJhbnNsYXRlOiB0cnVlXG4gICAgfSlcbiAgfSk7XG59XG5cbmV4cG9ydCB7IEVmZmVjdEN1YmUgYXMgZGVmYXVsdCB9O1xuIiwiaW1wb3J0IHsgbCBhcyBnZXRTbGlkZVRyYW5zZm9ybUVsLCBjIGFzIGNyZWF0ZUVsZW1lbnQgfSBmcm9tICcuL3V0aWxzLm1qcyc7XG5cbmZ1bmN0aW9uIGNyZWF0ZVNoYWRvdyhzdWZmaXgsIHNsaWRlRWwsIHNpZGUpIHtcbiAgY29uc3Qgc2hhZG93Q2xhc3MgPSBgc3dpcGVyLXNsaWRlLXNoYWRvdyR7c2lkZSA/IGAtJHtzaWRlfWAgOiAnJ30ke3N1ZmZpeCA/IGAgc3dpcGVyLXNsaWRlLXNoYWRvdy0ke3N1ZmZpeH1gIDogJyd9YDtcbiAgY29uc3Qgc2hhZG93Q29udGFpbmVyID0gZ2V0U2xpZGVUcmFuc2Zvcm1FbChzbGlkZUVsKTtcbiAgbGV0IHNoYWRvd0VsID0gc2hhZG93Q29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoYC4ke3NoYWRvd0NsYXNzLnNwbGl0KCcgJykuam9pbignLicpfWApO1xuICBpZiAoIXNoYWRvd0VsKSB7XG4gICAgc2hhZG93RWwgPSBjcmVhdGVFbGVtZW50KCdkaXYnLCBzaGFkb3dDbGFzcy5zcGxpdCgnICcpKTtcbiAgICBzaGFkb3dDb250YWluZXIuYXBwZW5kKHNoYWRvd0VsKTtcbiAgfVxuICByZXR1cm4gc2hhZG93RWw7XG59XG5cbmV4cG9ydCB7IGNyZWF0ZVNoYWRvdyBhcyBjIH07XG4iLCJpbXBvcnQgeyBjIGFzIGNyZWF0ZVNoYWRvdyB9IGZyb20gJy4uL3NoYXJlZC9jcmVhdGUtc2hhZG93Lm1qcyc7XG5pbXBvcnQgeyBlIGFzIGVmZmVjdEluaXQgfSBmcm9tICcuLi9zaGFyZWQvZWZmZWN0LWluaXQubWpzJztcbmltcG9ydCB7IGUgYXMgZWZmZWN0VGFyZ2V0IH0gZnJvbSAnLi4vc2hhcmVkL2VmZmVjdC10YXJnZXQubWpzJztcbmltcG9ydCB7IGUgYXMgZWZmZWN0VmlydHVhbFRyYW5zaXRpb25FbmQgfSBmcm9tICcuLi9zaGFyZWQvZWZmZWN0LXZpcnR1YWwtdHJhbnNpdGlvbi1lbmQubWpzJztcbmltcG9ydCB7IGwgYXMgZ2V0U2xpZGVUcmFuc2Zvcm1FbCB9IGZyb20gJy4uL3NoYXJlZC91dGlscy5tanMnO1xuXG5mdW5jdGlvbiBFZmZlY3RGbGlwKF9yZWYpIHtcbiAgbGV0IHtcbiAgICBzd2lwZXIsXG4gICAgZXh0ZW5kUGFyYW1zLFxuICAgIG9uXG4gIH0gPSBfcmVmO1xuICBleHRlbmRQYXJhbXMoe1xuICAgIGZsaXBFZmZlY3Q6IHtcbiAgICAgIHNsaWRlU2hhZG93czogdHJ1ZSxcbiAgICAgIGxpbWl0Um90YXRpb246IHRydWVcbiAgICB9XG4gIH0pO1xuICBjb25zdCBjcmVhdGVTbGlkZVNoYWRvd3MgPSAoc2xpZGVFbCwgcHJvZ3Jlc3MpID0+IHtcbiAgICBsZXQgc2hhZG93QmVmb3JlID0gc3dpcGVyLmlzSG9yaXpvbnRhbCgpID8gc2xpZGVFbC5xdWVyeVNlbGVjdG9yKCcuc3dpcGVyLXNsaWRlLXNoYWRvdy1sZWZ0JykgOiBzbGlkZUVsLnF1ZXJ5U2VsZWN0b3IoJy5zd2lwZXItc2xpZGUtc2hhZG93LXRvcCcpO1xuICAgIGxldCBzaGFkb3dBZnRlciA9IHN3aXBlci5pc0hvcml6b250YWwoKSA/IHNsaWRlRWwucXVlcnlTZWxlY3RvcignLnN3aXBlci1zbGlkZS1zaGFkb3ctcmlnaHQnKSA6IHNsaWRlRWwucXVlcnlTZWxlY3RvcignLnN3aXBlci1zbGlkZS1zaGFkb3ctYm90dG9tJyk7XG4gICAgaWYgKCFzaGFkb3dCZWZvcmUpIHtcbiAgICAgIHNoYWRvd0JlZm9yZSA9IGNyZWF0ZVNoYWRvdygnZmxpcCcsIHNsaWRlRWwsIHN3aXBlci5pc0hvcml6b250YWwoKSA/ICdsZWZ0JyA6ICd0b3AnKTtcbiAgICB9XG4gICAgaWYgKCFzaGFkb3dBZnRlcikge1xuICAgICAgc2hhZG93QWZ0ZXIgPSBjcmVhdGVTaGFkb3coJ2ZsaXAnLCBzbGlkZUVsLCBzd2lwZXIuaXNIb3Jpem9udGFsKCkgPyAncmlnaHQnIDogJ2JvdHRvbScpO1xuICAgIH1cbiAgICBpZiAoc2hhZG93QmVmb3JlKSBzaGFkb3dCZWZvcmUuc3R5bGUub3BhY2l0eSA9IE1hdGgubWF4KC1wcm9ncmVzcywgMCk7XG4gICAgaWYgKHNoYWRvd0FmdGVyKSBzaGFkb3dBZnRlci5zdHlsZS5vcGFjaXR5ID0gTWF0aC5tYXgocHJvZ3Jlc3MsIDApO1xuICB9O1xuICBjb25zdCByZWNyZWF0ZVNoYWRvd3MgPSAoKSA9PiB7XG4gICAgLy8gU2V0IHNoYWRvd3NcbiAgICBzd2lwZXIucGFyYW1zLmZsaXBFZmZlY3Q7XG4gICAgc3dpcGVyLnNsaWRlcy5mb3JFYWNoKHNsaWRlRWwgPT4ge1xuICAgICAgbGV0IHByb2dyZXNzID0gc2xpZGVFbC5wcm9ncmVzcztcbiAgICAgIGlmIChzd2lwZXIucGFyYW1zLmZsaXBFZmZlY3QubGltaXRSb3RhdGlvbikge1xuICAgICAgICBwcm9ncmVzcyA9IE1hdGgubWF4KE1hdGgubWluKHNsaWRlRWwucHJvZ3Jlc3MsIDEpLCAtMSk7XG4gICAgICB9XG4gICAgICBjcmVhdGVTbGlkZVNoYWRvd3Moc2xpZGVFbCwgcHJvZ3Jlc3MpO1xuICAgIH0pO1xuICB9O1xuICBjb25zdCBzZXRUcmFuc2xhdGUgPSAoKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgc2xpZGVzLFxuICAgICAgcnRsVHJhbnNsYXRlOiBydGxcbiAgICB9ID0gc3dpcGVyO1xuICAgIGNvbnN0IHBhcmFtcyA9IHN3aXBlci5wYXJhbXMuZmxpcEVmZmVjdDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNsaWRlcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgY29uc3Qgc2xpZGVFbCA9IHNsaWRlc1tpXTtcbiAgICAgIGxldCBwcm9ncmVzcyA9IHNsaWRlRWwucHJvZ3Jlc3M7XG4gICAgICBpZiAoc3dpcGVyLnBhcmFtcy5mbGlwRWZmZWN0LmxpbWl0Um90YXRpb24pIHtcbiAgICAgICAgcHJvZ3Jlc3MgPSBNYXRoLm1heChNYXRoLm1pbihzbGlkZUVsLnByb2dyZXNzLCAxKSwgLTEpO1xuICAgICAgfVxuICAgICAgY29uc3Qgb2Zmc2V0ID0gc2xpZGVFbC5zd2lwZXJTbGlkZU9mZnNldDtcbiAgICAgIGNvbnN0IHJvdGF0ZSA9IC0xODAgKiBwcm9ncmVzcztcbiAgICAgIGxldCByb3RhdGVZID0gcm90YXRlO1xuICAgICAgbGV0IHJvdGF0ZVggPSAwO1xuICAgICAgbGV0IHR4ID0gc3dpcGVyLnBhcmFtcy5jc3NNb2RlID8gLW9mZnNldCAtIHN3aXBlci50cmFuc2xhdGUgOiAtb2Zmc2V0O1xuICAgICAgbGV0IHR5ID0gMDtcbiAgICAgIGlmICghc3dpcGVyLmlzSG9yaXpvbnRhbCgpKSB7XG4gICAgICAgIHR5ID0gdHg7XG4gICAgICAgIHR4ID0gMDtcbiAgICAgICAgcm90YXRlWCA9IC1yb3RhdGVZO1xuICAgICAgICByb3RhdGVZID0gMDtcbiAgICAgIH0gZWxzZSBpZiAocnRsKSB7XG4gICAgICAgIHJvdGF0ZVkgPSAtcm90YXRlWTtcbiAgICAgIH1cbiAgICAgIGlmIChzd2lwZXIuYnJvd3NlciAmJiBzd2lwZXIuYnJvd3Nlci5pc1NhZmFyaSkge1xuICAgICAgICBpZiAoTWF0aC5hYnMocm90YXRlWSkgLyA5MCAlIDIgPT09IDEpIHtcbiAgICAgICAgICByb3RhdGVZICs9IDAuMDAxO1xuICAgICAgICB9XG4gICAgICAgIGlmIChNYXRoLmFicyhyb3RhdGVYKSAvIDkwICUgMiA9PT0gMSkge1xuICAgICAgICAgIHJvdGF0ZVggKz0gMC4wMDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHNsaWRlRWwuc3R5bGUuekluZGV4ID0gLU1hdGguYWJzKE1hdGgucm91bmQocHJvZ3Jlc3MpKSArIHNsaWRlcy5sZW5ndGg7XG4gICAgICBpZiAocGFyYW1zLnNsaWRlU2hhZG93cykge1xuICAgICAgICBjcmVhdGVTbGlkZVNoYWRvd3Moc2xpZGVFbCwgcHJvZ3Jlc3MpO1xuICAgICAgfVxuICAgICAgY29uc3QgdHJhbnNmb3JtID0gYHRyYW5zbGF0ZTNkKCR7dHh9cHgsICR7dHl9cHgsIDBweCkgcm90YXRlWCgke3JvdGF0ZVh9ZGVnKSByb3RhdGVZKCR7cm90YXRlWX1kZWcpYDtcbiAgICAgIGNvbnN0IHRhcmdldEVsID0gZWZmZWN0VGFyZ2V0KHBhcmFtcywgc2xpZGVFbCk7XG4gICAgICB0YXJnZXRFbC5zdHlsZS50cmFuc2Zvcm0gPSB0cmFuc2Zvcm07XG4gICAgfVxuICB9O1xuICBjb25zdCBzZXRUcmFuc2l0aW9uID0gZHVyYXRpb24gPT4ge1xuICAgIGNvbnN0IHRyYW5zZm9ybUVsZW1lbnRzID0gc3dpcGVyLnNsaWRlcy5tYXAoc2xpZGVFbCA9PiBnZXRTbGlkZVRyYW5zZm9ybUVsKHNsaWRlRWwpKTtcbiAgICB0cmFuc2Zvcm1FbGVtZW50cy5mb3JFYWNoKGVsID0+IHtcbiAgICAgIGVsLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IGAke2R1cmF0aW9ufW1zYDtcbiAgICAgIGVsLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zd2lwZXItc2xpZGUtc2hhZG93LXRvcCwgLnN3aXBlci1zbGlkZS1zaGFkb3ctcmlnaHQsIC5zd2lwZXItc2xpZGUtc2hhZG93LWJvdHRvbSwgLnN3aXBlci1zbGlkZS1zaGFkb3ctbGVmdCcpLmZvckVhY2goc2hhZG93RWwgPT4ge1xuICAgICAgICBzaGFkb3dFbC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSBgJHtkdXJhdGlvbn1tc2A7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBlZmZlY3RWaXJ0dWFsVHJhbnNpdGlvbkVuZCh7XG4gICAgICBzd2lwZXIsXG4gICAgICBkdXJhdGlvbixcbiAgICAgIHRyYW5zZm9ybUVsZW1lbnRzXG4gICAgfSk7XG4gIH07XG4gIGVmZmVjdEluaXQoe1xuICAgIGVmZmVjdDogJ2ZsaXAnLFxuICAgIHN3aXBlcixcbiAgICBvbixcbiAgICBzZXRUcmFuc2xhdGUsXG4gICAgc2V0VHJhbnNpdGlvbixcbiAgICByZWNyZWF0ZVNoYWRvd3MsXG4gICAgZ2V0RWZmZWN0UGFyYW1zOiAoKSA9PiBzd2lwZXIucGFyYW1zLmZsaXBFZmZlY3QsXG4gICAgcGVyc3BlY3RpdmU6ICgpID0+IHRydWUsXG4gICAgb3ZlcndyaXRlUGFyYW1zOiAoKSA9PiAoe1xuICAgICAgc2xpZGVzUGVyVmlldzogMSxcbiAgICAgIHNsaWRlc1Blckdyb3VwOiAxLFxuICAgICAgd2F0Y2hTbGlkZXNQcm9ncmVzczogdHJ1ZSxcbiAgICAgIHNwYWNlQmV0d2VlbjogMCxcbiAgICAgIHZpcnR1YWxUcmFuc2xhdGU6ICFzd2lwZXIucGFyYW1zLmNzc01vZGVcbiAgICB9KVxuICB9KTtcbn1cblxuZXhwb3J0IHsgRWZmZWN0RmxpcCBhcyBkZWZhdWx0IH07XG4iLCJpbXBvcnQgeyBjIGFzIGNyZWF0ZVNoYWRvdyB9IGZyb20gJy4uL3NoYXJlZC9jcmVhdGUtc2hhZG93Lm1qcyc7XG5pbXBvcnQgeyBlIGFzIGVmZmVjdEluaXQgfSBmcm9tICcuLi9zaGFyZWQvZWZmZWN0LWluaXQubWpzJztcbmltcG9ydCB7IGUgYXMgZWZmZWN0VGFyZ2V0IH0gZnJvbSAnLi4vc2hhcmVkL2VmZmVjdC10YXJnZXQubWpzJztcbmltcG9ydCB7IGwgYXMgZ2V0U2xpZGVUcmFuc2Zvcm1FbCB9IGZyb20gJy4uL3NoYXJlZC91dGlscy5tanMnO1xuXG5mdW5jdGlvbiBFZmZlY3RDb3ZlcmZsb3coX3JlZikge1xuICBsZXQge1xuICAgIHN3aXBlcixcbiAgICBleHRlbmRQYXJhbXMsXG4gICAgb25cbiAgfSA9IF9yZWY7XG4gIGV4dGVuZFBhcmFtcyh7XG4gICAgY292ZXJmbG93RWZmZWN0OiB7XG4gICAgICByb3RhdGU6IDUwLFxuICAgICAgc3RyZXRjaDogMCxcbiAgICAgIGRlcHRoOiAxMDAsXG4gICAgICBzY2FsZTogMSxcbiAgICAgIG1vZGlmaWVyOiAxLFxuICAgICAgc2xpZGVTaGFkb3dzOiB0cnVlXG4gICAgfVxuICB9KTtcbiAgY29uc3Qgc2V0VHJhbnNsYXRlID0gKCkgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIHdpZHRoOiBzd2lwZXJXaWR0aCxcbiAgICAgIGhlaWdodDogc3dpcGVySGVpZ2h0LFxuICAgICAgc2xpZGVzLFxuICAgICAgc2xpZGVzU2l6ZXNHcmlkXG4gICAgfSA9IHN3aXBlcjtcbiAgICBjb25zdCBwYXJhbXMgPSBzd2lwZXIucGFyYW1zLmNvdmVyZmxvd0VmZmVjdDtcbiAgICBjb25zdCBpc0hvcml6b250YWwgPSBzd2lwZXIuaXNIb3Jpem9udGFsKCk7XG4gICAgY29uc3QgdHJhbnNmb3JtID0gc3dpcGVyLnRyYW5zbGF0ZTtcbiAgICBjb25zdCBjZW50ZXIgPSBpc0hvcml6b250YWwgPyAtdHJhbnNmb3JtICsgc3dpcGVyV2lkdGggLyAyIDogLXRyYW5zZm9ybSArIHN3aXBlckhlaWdodCAvIDI7XG4gICAgY29uc3Qgcm90YXRlID0gaXNIb3Jpem9udGFsID8gcGFyYW1zLnJvdGF0ZSA6IC1wYXJhbXMucm90YXRlO1xuICAgIGNvbnN0IHRyYW5zbGF0ZSA9IHBhcmFtcy5kZXB0aDtcbiAgICAvLyBFYWNoIHNsaWRlIG9mZnNldCBmcm9tIGNlbnRlclxuICAgIGZvciAobGV0IGkgPSAwLCBsZW5ndGggPSBzbGlkZXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGNvbnN0IHNsaWRlRWwgPSBzbGlkZXNbaV07XG4gICAgICBjb25zdCBzbGlkZVNpemUgPSBzbGlkZXNTaXplc0dyaWRbaV07XG4gICAgICBjb25zdCBzbGlkZU9mZnNldCA9IHNsaWRlRWwuc3dpcGVyU2xpZGVPZmZzZXQ7XG4gICAgICBjb25zdCBjZW50ZXJPZmZzZXQgPSAoY2VudGVyIC0gc2xpZGVPZmZzZXQgLSBzbGlkZVNpemUgLyAyKSAvIHNsaWRlU2l6ZTtcbiAgICAgIGNvbnN0IG9mZnNldE11bHRpcGxpZXIgPSB0eXBlb2YgcGFyYW1zLm1vZGlmaWVyID09PSAnZnVuY3Rpb24nID8gcGFyYW1zLm1vZGlmaWVyKGNlbnRlck9mZnNldCkgOiBjZW50ZXJPZmZzZXQgKiBwYXJhbXMubW9kaWZpZXI7XG4gICAgICBsZXQgcm90YXRlWSA9IGlzSG9yaXpvbnRhbCA/IHJvdGF0ZSAqIG9mZnNldE11bHRpcGxpZXIgOiAwO1xuICAgICAgbGV0IHJvdGF0ZVggPSBpc0hvcml6b250YWwgPyAwIDogcm90YXRlICogb2Zmc2V0TXVsdGlwbGllcjtcbiAgICAgIC8vIHZhciByb3RhdGVaID0gMFxuICAgICAgbGV0IHRyYW5zbGF0ZVogPSAtdHJhbnNsYXRlICogTWF0aC5hYnMob2Zmc2V0TXVsdGlwbGllcik7XG4gICAgICBsZXQgc3RyZXRjaCA9IHBhcmFtcy5zdHJldGNoO1xuICAgICAgLy8gQWxsb3cgcGVyY2VudGFnZSB0byBtYWtlIGEgcmVsYXRpdmUgc3RyZXRjaCBmb3IgcmVzcG9uc2l2ZSBzbGlkZXJzXG4gICAgICBpZiAodHlwZW9mIHN0cmV0Y2ggPT09ICdzdHJpbmcnICYmIHN0cmV0Y2guaW5kZXhPZignJScpICE9PSAtMSkge1xuICAgICAgICBzdHJldGNoID0gcGFyc2VGbG9hdChwYXJhbXMuc3RyZXRjaCkgLyAxMDAgKiBzbGlkZVNpemU7XG4gICAgICB9XG4gICAgICBsZXQgdHJhbnNsYXRlWSA9IGlzSG9yaXpvbnRhbCA/IDAgOiBzdHJldGNoICogb2Zmc2V0TXVsdGlwbGllcjtcbiAgICAgIGxldCB0cmFuc2xhdGVYID0gaXNIb3Jpem9udGFsID8gc3RyZXRjaCAqIG9mZnNldE11bHRpcGxpZXIgOiAwO1xuICAgICAgbGV0IHNjYWxlID0gMSAtICgxIC0gcGFyYW1zLnNjYWxlKSAqIE1hdGguYWJzKG9mZnNldE11bHRpcGxpZXIpO1xuXG4gICAgICAvLyBGaXggZm9yIHVsdHJhIHNtYWxsIHZhbHVlc1xuICAgICAgaWYgKE1hdGguYWJzKHRyYW5zbGF0ZVgpIDwgMC4wMDEpIHRyYW5zbGF0ZVggPSAwO1xuICAgICAgaWYgKE1hdGguYWJzKHRyYW5zbGF0ZVkpIDwgMC4wMDEpIHRyYW5zbGF0ZVkgPSAwO1xuICAgICAgaWYgKE1hdGguYWJzKHRyYW5zbGF0ZVopIDwgMC4wMDEpIHRyYW5zbGF0ZVogPSAwO1xuICAgICAgaWYgKE1hdGguYWJzKHJvdGF0ZVkpIDwgMC4wMDEpIHJvdGF0ZVkgPSAwO1xuICAgICAgaWYgKE1hdGguYWJzKHJvdGF0ZVgpIDwgMC4wMDEpIHJvdGF0ZVggPSAwO1xuICAgICAgaWYgKE1hdGguYWJzKHNjYWxlKSA8IDAuMDAxKSBzY2FsZSA9IDA7XG4gICAgICBpZiAoc3dpcGVyLmJyb3dzZXIgJiYgc3dpcGVyLmJyb3dzZXIuaXNTYWZhcmkpIHtcbiAgICAgICAgaWYgKE1hdGguYWJzKHJvdGF0ZVkpIC8gOTAgJSAyID09PSAxKSB7XG4gICAgICAgICAgcm90YXRlWSArPSAwLjAwMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoTWF0aC5hYnMocm90YXRlWCkgLyA5MCAlIDIgPT09IDEpIHtcbiAgICAgICAgICByb3RhdGVYICs9IDAuMDAxO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCBzbGlkZVRyYW5zZm9ybSA9IGB0cmFuc2xhdGUzZCgke3RyYW5zbGF0ZVh9cHgsJHt0cmFuc2xhdGVZfXB4LCR7dHJhbnNsYXRlWn1weCkgIHJvdGF0ZVgoJHtyb3RhdGVYfWRlZykgcm90YXRlWSgke3JvdGF0ZVl9ZGVnKSBzY2FsZSgke3NjYWxlfSlgO1xuICAgICAgY29uc3QgdGFyZ2V0RWwgPSBlZmZlY3RUYXJnZXQocGFyYW1zLCBzbGlkZUVsKTtcbiAgICAgIHRhcmdldEVsLnN0eWxlLnRyYW5zZm9ybSA9IHNsaWRlVHJhbnNmb3JtO1xuICAgICAgc2xpZGVFbC5zdHlsZS56SW5kZXggPSAtTWF0aC5hYnMoTWF0aC5yb3VuZChvZmZzZXRNdWx0aXBsaWVyKSkgKyAxO1xuICAgICAgaWYgKHBhcmFtcy5zbGlkZVNoYWRvd3MpIHtcbiAgICAgICAgLy8gU2V0IHNoYWRvd3NcbiAgICAgICAgbGV0IHNoYWRvd0JlZm9yZUVsID0gaXNIb3Jpem9udGFsID8gc2xpZGVFbC5xdWVyeVNlbGVjdG9yKCcuc3dpcGVyLXNsaWRlLXNoYWRvdy1sZWZ0JykgOiBzbGlkZUVsLnF1ZXJ5U2VsZWN0b3IoJy5zd2lwZXItc2xpZGUtc2hhZG93LXRvcCcpO1xuICAgICAgICBsZXQgc2hhZG93QWZ0ZXJFbCA9IGlzSG9yaXpvbnRhbCA/IHNsaWRlRWwucXVlcnlTZWxlY3RvcignLnN3aXBlci1zbGlkZS1zaGFkb3ctcmlnaHQnKSA6IHNsaWRlRWwucXVlcnlTZWxlY3RvcignLnN3aXBlci1zbGlkZS1zaGFkb3ctYm90dG9tJyk7XG4gICAgICAgIGlmICghc2hhZG93QmVmb3JlRWwpIHtcbiAgICAgICAgICBzaGFkb3dCZWZvcmVFbCA9IGNyZWF0ZVNoYWRvdygnY292ZXJmbG93Jywgc2xpZGVFbCwgaXNIb3Jpem9udGFsID8gJ2xlZnQnIDogJ3RvcCcpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghc2hhZG93QWZ0ZXJFbCkge1xuICAgICAgICAgIHNoYWRvd0FmdGVyRWwgPSBjcmVhdGVTaGFkb3coJ2NvdmVyZmxvdycsIHNsaWRlRWwsIGlzSG9yaXpvbnRhbCA/ICdyaWdodCcgOiAnYm90dG9tJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNoYWRvd0JlZm9yZUVsKSBzaGFkb3dCZWZvcmVFbC5zdHlsZS5vcGFjaXR5ID0gb2Zmc2V0TXVsdGlwbGllciA+IDAgPyBvZmZzZXRNdWx0aXBsaWVyIDogMDtcbiAgICAgICAgaWYgKHNoYWRvd0FmdGVyRWwpIHNoYWRvd0FmdGVyRWwuc3R5bGUub3BhY2l0eSA9IC1vZmZzZXRNdWx0aXBsaWVyID4gMCA/IC1vZmZzZXRNdWx0aXBsaWVyIDogMDtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIGNvbnN0IHNldFRyYW5zaXRpb24gPSBkdXJhdGlvbiA9PiB7XG4gICAgY29uc3QgdHJhbnNmb3JtRWxlbWVudHMgPSBzd2lwZXIuc2xpZGVzLm1hcChzbGlkZUVsID0+IGdldFNsaWRlVHJhbnNmb3JtRWwoc2xpZGVFbCkpO1xuICAgIHRyYW5zZm9ybUVsZW1lbnRzLmZvckVhY2goZWwgPT4ge1xuICAgICAgZWwuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gYCR7ZHVyYXRpb259bXNgO1xuICAgICAgZWwucXVlcnlTZWxlY3RvckFsbCgnLnN3aXBlci1zbGlkZS1zaGFkb3ctdG9wLCAuc3dpcGVyLXNsaWRlLXNoYWRvdy1yaWdodCwgLnN3aXBlci1zbGlkZS1zaGFkb3ctYm90dG9tLCAuc3dpcGVyLXNsaWRlLXNoYWRvdy1sZWZ0JykuZm9yRWFjaChzaGFkb3dFbCA9PiB7XG4gICAgICAgIHNoYWRvd0VsLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IGAke2R1cmF0aW9ufW1zYDtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuICBlZmZlY3RJbml0KHtcbiAgICBlZmZlY3Q6ICdjb3ZlcmZsb3cnLFxuICAgIHN3aXBlcixcbiAgICBvbixcbiAgICBzZXRUcmFuc2xhdGUsXG4gICAgc2V0VHJhbnNpdGlvbixcbiAgICBwZXJzcGVjdGl2ZTogKCkgPT4gdHJ1ZSxcbiAgICBvdmVyd3JpdGVQYXJhbXM6ICgpID0+ICh7XG4gICAgICB3YXRjaFNsaWRlc1Byb2dyZXNzOiB0cnVlXG4gICAgfSlcbiAgfSk7XG59XG5cbmV4cG9ydCB7IEVmZmVjdENvdmVyZmxvdyBhcyBkZWZhdWx0IH07XG4iLCJpbXBvcnQgeyBjIGFzIGNyZWF0ZVNoYWRvdyB9IGZyb20gJy4uL3NoYXJlZC9jcmVhdGUtc2hhZG93Lm1qcyc7XG5pbXBvcnQgeyBlIGFzIGVmZmVjdEluaXQgfSBmcm9tICcuLi9zaGFyZWQvZWZmZWN0LWluaXQubWpzJztcbmltcG9ydCB7IGUgYXMgZWZmZWN0VGFyZ2V0IH0gZnJvbSAnLi4vc2hhcmVkL2VmZmVjdC10YXJnZXQubWpzJztcbmltcG9ydCB7IGUgYXMgZWZmZWN0VmlydHVhbFRyYW5zaXRpb25FbmQgfSBmcm9tICcuLi9zaGFyZWQvZWZmZWN0LXZpcnR1YWwtdHJhbnNpdGlvbi1lbmQubWpzJztcbmltcG9ydCB7IGwgYXMgZ2V0U2xpZGVUcmFuc2Zvcm1FbCB9IGZyb20gJy4uL3NoYXJlZC91dGlscy5tanMnO1xuXG5mdW5jdGlvbiBFZmZlY3RDcmVhdGl2ZShfcmVmKSB7XG4gIGxldCB7XG4gICAgc3dpcGVyLFxuICAgIGV4dGVuZFBhcmFtcyxcbiAgICBvblxuICB9ID0gX3JlZjtcbiAgZXh0ZW5kUGFyYW1zKHtcbiAgICBjcmVhdGl2ZUVmZmVjdDoge1xuICAgICAgbGltaXRQcm9ncmVzczogMSxcbiAgICAgIHNoYWRvd1BlclByb2dyZXNzOiBmYWxzZSxcbiAgICAgIHByb2dyZXNzTXVsdGlwbGllcjogMSxcbiAgICAgIHBlcnNwZWN0aXZlOiB0cnVlLFxuICAgICAgcHJldjoge1xuICAgICAgICB0cmFuc2xhdGU6IFswLCAwLCAwXSxcbiAgICAgICAgcm90YXRlOiBbMCwgMCwgMF0sXG4gICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgIHNjYWxlOiAxXG4gICAgICB9LFxuICAgICAgbmV4dDoge1xuICAgICAgICB0cmFuc2xhdGU6IFswLCAwLCAwXSxcbiAgICAgICAgcm90YXRlOiBbMCwgMCwgMF0sXG4gICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgIHNjYWxlOiAxXG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgY29uc3QgZ2V0VHJhbnNsYXRlVmFsdWUgPSB2YWx1ZSA9PiB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHJldHVybiB2YWx1ZTtcbiAgICByZXR1cm4gYCR7dmFsdWV9cHhgO1xuICB9O1xuICBjb25zdCBzZXRUcmFuc2xhdGUgPSAoKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgc2xpZGVzLFxuICAgICAgd3JhcHBlckVsLFxuICAgICAgc2xpZGVzU2l6ZXNHcmlkXG4gICAgfSA9IHN3aXBlcjtcbiAgICBjb25zdCBwYXJhbXMgPSBzd2lwZXIucGFyYW1zLmNyZWF0aXZlRWZmZWN0O1xuICAgIGNvbnN0IHtcbiAgICAgIHByb2dyZXNzTXVsdGlwbGllcjogbXVsdGlwbGllclxuICAgIH0gPSBwYXJhbXM7XG4gICAgY29uc3QgaXNDZW50ZXJlZFNsaWRlcyA9IHN3aXBlci5wYXJhbXMuY2VudGVyZWRTbGlkZXM7XG4gICAgaWYgKGlzQ2VudGVyZWRTbGlkZXMpIHtcbiAgICAgIGNvbnN0IG1hcmdpbiA9IHNsaWRlc1NpemVzR3JpZFswXSAvIDIgLSBzd2lwZXIucGFyYW1zLnNsaWRlc09mZnNldEJlZm9yZSB8fCAwO1xuICAgICAgd3JhcHBlckVsLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKGNhbGMoNTAlIC0gJHttYXJnaW59cHgpKWA7XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2xpZGVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBjb25zdCBzbGlkZUVsID0gc2xpZGVzW2ldO1xuICAgICAgY29uc3Qgc2xpZGVQcm9ncmVzcyA9IHNsaWRlRWwucHJvZ3Jlc3M7XG4gICAgICBjb25zdCBwcm9ncmVzcyA9IE1hdGgubWluKE1hdGgubWF4KHNsaWRlRWwucHJvZ3Jlc3MsIC1wYXJhbXMubGltaXRQcm9ncmVzcyksIHBhcmFtcy5saW1pdFByb2dyZXNzKTtcbiAgICAgIGxldCBvcmlnaW5hbFByb2dyZXNzID0gcHJvZ3Jlc3M7XG4gICAgICBpZiAoIWlzQ2VudGVyZWRTbGlkZXMpIHtcbiAgICAgICAgb3JpZ2luYWxQcm9ncmVzcyA9IE1hdGgubWluKE1hdGgubWF4KHNsaWRlRWwub3JpZ2luYWxQcm9ncmVzcywgLXBhcmFtcy5saW1pdFByb2dyZXNzKSwgcGFyYW1zLmxpbWl0UHJvZ3Jlc3MpO1xuICAgICAgfVxuICAgICAgY29uc3Qgb2Zmc2V0ID0gc2xpZGVFbC5zd2lwZXJTbGlkZU9mZnNldDtcbiAgICAgIGNvbnN0IHQgPSBbc3dpcGVyLnBhcmFtcy5jc3NNb2RlID8gLW9mZnNldCAtIHN3aXBlci50cmFuc2xhdGUgOiAtb2Zmc2V0LCAwLCAwXTtcbiAgICAgIGNvbnN0IHIgPSBbMCwgMCwgMF07XG4gICAgICBsZXQgY3VzdG9tID0gZmFsc2U7XG4gICAgICBpZiAoIXN3aXBlci5pc0hvcml6b250YWwoKSkge1xuICAgICAgICB0WzFdID0gdFswXTtcbiAgICAgICAgdFswXSA9IDA7XG4gICAgICB9XG4gICAgICBsZXQgZGF0YSA9IHtcbiAgICAgICAgdHJhbnNsYXRlOiBbMCwgMCwgMF0sXG4gICAgICAgIHJvdGF0ZTogWzAsIDAsIDBdLFxuICAgICAgICBzY2FsZTogMSxcbiAgICAgICAgb3BhY2l0eTogMVxuICAgICAgfTtcbiAgICAgIGlmIChwcm9ncmVzcyA8IDApIHtcbiAgICAgICAgZGF0YSA9IHBhcmFtcy5uZXh0O1xuICAgICAgICBjdXN0b20gPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmIChwcm9ncmVzcyA+IDApIHtcbiAgICAgICAgZGF0YSA9IHBhcmFtcy5wcmV2O1xuICAgICAgICBjdXN0b20gPSB0cnVlO1xuICAgICAgfVxuICAgICAgLy8gc2V0IHRyYW5zbGF0ZVxuICAgICAgdC5mb3JFYWNoKCh2YWx1ZSwgaW5kZXgpID0+IHtcbiAgICAgICAgdFtpbmRleF0gPSBgY2FsYygke3ZhbHVlfXB4ICsgKCR7Z2V0VHJhbnNsYXRlVmFsdWUoZGF0YS50cmFuc2xhdGVbaW5kZXhdKX0gKiAke01hdGguYWJzKHByb2dyZXNzICogbXVsdGlwbGllcil9KSlgO1xuICAgICAgfSk7XG4gICAgICAvLyBzZXQgcm90YXRlc1xuICAgICAgci5mb3JFYWNoKCh2YWx1ZSwgaW5kZXgpID0+IHtcbiAgICAgICAgbGV0IHZhbCA9IGRhdGEucm90YXRlW2luZGV4XSAqIE1hdGguYWJzKHByb2dyZXNzICogbXVsdGlwbGllcik7XG4gICAgICAgIGlmIChzd2lwZXIuYnJvd3NlciAmJiBzd2lwZXIuYnJvd3Nlci5pc1NhZmFyaSAmJiBNYXRoLmFicyh2YWwpIC8gOTAgJSAyID09PSAxKSB7XG4gICAgICAgICAgdmFsICs9IDAuMDAxO1xuICAgICAgICB9XG4gICAgICAgIHJbaW5kZXhdID0gdmFsO1xuICAgICAgfSk7XG4gICAgICBzbGlkZUVsLnN0eWxlLnpJbmRleCA9IC1NYXRoLmFicyhNYXRoLnJvdW5kKHNsaWRlUHJvZ3Jlc3MpKSArIHNsaWRlcy5sZW5ndGg7XG4gICAgICBjb25zdCB0cmFuc2xhdGVTdHJpbmcgPSB0LmpvaW4oJywgJyk7XG4gICAgICBjb25zdCByb3RhdGVTdHJpbmcgPSBgcm90YXRlWCgke3JbMF19ZGVnKSByb3RhdGVZKCR7clsxXX1kZWcpIHJvdGF0ZVooJHtyWzJdfWRlZylgO1xuICAgICAgY29uc3Qgc2NhbGVTdHJpbmcgPSBvcmlnaW5hbFByb2dyZXNzIDwgMCA/IGBzY2FsZSgkezEgKyAoMSAtIGRhdGEuc2NhbGUpICogb3JpZ2luYWxQcm9ncmVzcyAqIG11bHRpcGxpZXJ9KWAgOiBgc2NhbGUoJHsxIC0gKDEgLSBkYXRhLnNjYWxlKSAqIG9yaWdpbmFsUHJvZ3Jlc3MgKiBtdWx0aXBsaWVyfSlgO1xuICAgICAgY29uc3Qgb3BhY2l0eVN0cmluZyA9IG9yaWdpbmFsUHJvZ3Jlc3MgPCAwID8gMSArICgxIC0gZGF0YS5vcGFjaXR5KSAqIG9yaWdpbmFsUHJvZ3Jlc3MgKiBtdWx0aXBsaWVyIDogMSAtICgxIC0gZGF0YS5vcGFjaXR5KSAqIG9yaWdpbmFsUHJvZ3Jlc3MgKiBtdWx0aXBsaWVyO1xuICAgICAgY29uc3QgdHJhbnNmb3JtID0gYHRyYW5zbGF0ZTNkKCR7dHJhbnNsYXRlU3RyaW5nfSkgJHtyb3RhdGVTdHJpbmd9ICR7c2NhbGVTdHJpbmd9YDtcblxuICAgICAgLy8gU2V0IHNoYWRvd3NcbiAgICAgIGlmIChjdXN0b20gJiYgZGF0YS5zaGFkb3cgfHwgIWN1c3RvbSkge1xuICAgICAgICBsZXQgc2hhZG93RWwgPSBzbGlkZUVsLnF1ZXJ5U2VsZWN0b3IoJy5zd2lwZXItc2xpZGUtc2hhZG93Jyk7XG4gICAgICAgIGlmICghc2hhZG93RWwgJiYgZGF0YS5zaGFkb3cpIHtcbiAgICAgICAgICBzaGFkb3dFbCA9IGNyZWF0ZVNoYWRvdygnY3JlYXRpdmUnLCBzbGlkZUVsKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2hhZG93RWwpIHtcbiAgICAgICAgICBjb25zdCBzaGFkb3dPcGFjaXR5ID0gcGFyYW1zLnNoYWRvd1BlclByb2dyZXNzID8gcHJvZ3Jlc3MgKiAoMSAvIHBhcmFtcy5saW1pdFByb2dyZXNzKSA6IHByb2dyZXNzO1xuICAgICAgICAgIHNoYWRvd0VsLnN0eWxlLm9wYWNpdHkgPSBNYXRoLm1pbihNYXRoLm1heChNYXRoLmFicyhzaGFkb3dPcGFjaXR5KSwgMCksIDEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCB0YXJnZXRFbCA9IGVmZmVjdFRhcmdldChwYXJhbXMsIHNsaWRlRWwpO1xuICAgICAgdGFyZ2V0RWwuc3R5bGUudHJhbnNmb3JtID0gdHJhbnNmb3JtO1xuICAgICAgdGFyZ2V0RWwuc3R5bGUub3BhY2l0eSA9IG9wYWNpdHlTdHJpbmc7XG4gICAgICBpZiAoZGF0YS5vcmlnaW4pIHtcbiAgICAgICAgdGFyZ2V0RWwuc3R5bGUudHJhbnNmb3JtT3JpZ2luID0gZGF0YS5vcmlnaW47XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBjb25zdCBzZXRUcmFuc2l0aW9uID0gZHVyYXRpb24gPT4ge1xuICAgIGNvbnN0IHRyYW5zZm9ybUVsZW1lbnRzID0gc3dpcGVyLnNsaWRlcy5tYXAoc2xpZGVFbCA9PiBnZXRTbGlkZVRyYW5zZm9ybUVsKHNsaWRlRWwpKTtcbiAgICB0cmFuc2Zvcm1FbGVtZW50cy5mb3JFYWNoKGVsID0+IHtcbiAgICAgIGVsLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IGAke2R1cmF0aW9ufW1zYDtcbiAgICAgIGVsLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zd2lwZXItc2xpZGUtc2hhZG93JykuZm9yRWFjaChzaGFkb3dFbCA9PiB7XG4gICAgICAgIHNoYWRvd0VsLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IGAke2R1cmF0aW9ufW1zYDtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGVmZmVjdFZpcnR1YWxUcmFuc2l0aW9uRW5kKHtcbiAgICAgIHN3aXBlcixcbiAgICAgIGR1cmF0aW9uLFxuICAgICAgdHJhbnNmb3JtRWxlbWVudHMsXG4gICAgICBhbGxTbGlkZXM6IHRydWVcbiAgICB9KTtcbiAgfTtcbiAgZWZmZWN0SW5pdCh7XG4gICAgZWZmZWN0OiAnY3JlYXRpdmUnLFxuICAgIHN3aXBlcixcbiAgICBvbixcbiAgICBzZXRUcmFuc2xhdGUsXG4gICAgc2V0VHJhbnNpdGlvbixcbiAgICBwZXJzcGVjdGl2ZTogKCkgPT4gc3dpcGVyLnBhcmFtcy5jcmVhdGl2ZUVmZmVjdC5wZXJzcGVjdGl2ZSxcbiAgICBvdmVyd3JpdGVQYXJhbXM6ICgpID0+ICh7XG4gICAgICB3YXRjaFNsaWRlc1Byb2dyZXNzOiB0cnVlLFxuICAgICAgdmlydHVhbFRyYW5zbGF0ZTogIXN3aXBlci5wYXJhbXMuY3NzTW9kZVxuICAgIH0pXG4gIH0pO1xufVxuXG5leHBvcnQgeyBFZmZlY3RDcmVhdGl2ZSBhcyBkZWZhdWx0IH07XG4iLCJpbXBvcnQgeyBjIGFzIGNyZWF0ZVNoYWRvdyB9IGZyb20gJy4uL3NoYXJlZC9jcmVhdGUtc2hhZG93Lm1qcyc7XG5pbXBvcnQgeyBlIGFzIGVmZmVjdEluaXQgfSBmcm9tICcuLi9zaGFyZWQvZWZmZWN0LWluaXQubWpzJztcbmltcG9ydCB7IGUgYXMgZWZmZWN0VGFyZ2V0IH0gZnJvbSAnLi4vc2hhcmVkL2VmZmVjdC10YXJnZXQubWpzJztcbmltcG9ydCB7IGUgYXMgZWZmZWN0VmlydHVhbFRyYW5zaXRpb25FbmQgfSBmcm9tICcuLi9zaGFyZWQvZWZmZWN0LXZpcnR1YWwtdHJhbnNpdGlvbi1lbmQubWpzJztcbmltcG9ydCB7IGwgYXMgZ2V0U2xpZGVUcmFuc2Zvcm1FbCB9IGZyb20gJy4uL3NoYXJlZC91dGlscy5tanMnO1xuXG5mdW5jdGlvbiBFZmZlY3RDYXJkcyhfcmVmKSB7XG4gIGxldCB7XG4gICAgc3dpcGVyLFxuICAgIGV4dGVuZFBhcmFtcyxcbiAgICBvblxuICB9ID0gX3JlZjtcbiAgZXh0ZW5kUGFyYW1zKHtcbiAgICBjYXJkc0VmZmVjdDoge1xuICAgICAgc2xpZGVTaGFkb3dzOiB0cnVlLFxuICAgICAgcm90YXRlOiB0cnVlLFxuICAgICAgcGVyU2xpZGVSb3RhdGU6IDIsXG4gICAgICBwZXJTbGlkZU9mZnNldDogOFxuICAgIH1cbiAgfSk7XG4gIGNvbnN0IHNldFRyYW5zbGF0ZSA9ICgpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBzbGlkZXMsXG4gICAgICBhY3RpdmVJbmRleCxcbiAgICAgIHJ0bFRyYW5zbGF0ZTogcnRsXG4gICAgfSA9IHN3aXBlcjtcbiAgICBjb25zdCBwYXJhbXMgPSBzd2lwZXIucGFyYW1zLmNhcmRzRWZmZWN0O1xuICAgIGNvbnN0IHtcbiAgICAgIHN0YXJ0VHJhbnNsYXRlLFxuICAgICAgaXNUb3VjaGVkXG4gICAgfSA9IHN3aXBlci50b3VjaEV2ZW50c0RhdGE7XG4gICAgY29uc3QgY3VycmVudFRyYW5zbGF0ZSA9IHJ0bCA/IC1zd2lwZXIudHJhbnNsYXRlIDogc3dpcGVyLnRyYW5zbGF0ZTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNsaWRlcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgY29uc3Qgc2xpZGVFbCA9IHNsaWRlc1tpXTtcbiAgICAgIGNvbnN0IHNsaWRlUHJvZ3Jlc3MgPSBzbGlkZUVsLnByb2dyZXNzO1xuICAgICAgY29uc3QgcHJvZ3Jlc3MgPSBNYXRoLm1pbihNYXRoLm1heChzbGlkZVByb2dyZXNzLCAtNCksIDQpO1xuICAgICAgbGV0IG9mZnNldCA9IHNsaWRlRWwuc3dpcGVyU2xpZGVPZmZzZXQ7XG4gICAgICBpZiAoc3dpcGVyLnBhcmFtcy5jZW50ZXJlZFNsaWRlcyAmJiAhc3dpcGVyLnBhcmFtcy5jc3NNb2RlKSB7XG4gICAgICAgIHN3aXBlci53cmFwcGVyRWwuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHtzd2lwZXIubWluVHJhbnNsYXRlKCl9cHgpYDtcbiAgICAgIH1cbiAgICAgIGlmIChzd2lwZXIucGFyYW1zLmNlbnRlcmVkU2xpZGVzICYmIHN3aXBlci5wYXJhbXMuY3NzTW9kZSkge1xuICAgICAgICBvZmZzZXQgLT0gc2xpZGVzWzBdLnN3aXBlclNsaWRlT2Zmc2V0O1xuICAgICAgfVxuICAgICAgbGV0IHRYID0gc3dpcGVyLnBhcmFtcy5jc3NNb2RlID8gLW9mZnNldCAtIHN3aXBlci50cmFuc2xhdGUgOiAtb2Zmc2V0O1xuICAgICAgbGV0IHRZID0gMDtcbiAgICAgIGNvbnN0IHRaID0gLTEwMCAqIE1hdGguYWJzKHByb2dyZXNzKTtcbiAgICAgIGxldCBzY2FsZSA9IDE7XG4gICAgICBsZXQgcm90YXRlID0gLXBhcmFtcy5wZXJTbGlkZVJvdGF0ZSAqIHByb2dyZXNzO1xuICAgICAgbGV0IHRYQWRkID0gcGFyYW1zLnBlclNsaWRlT2Zmc2V0IC0gTWF0aC5hYnMocHJvZ3Jlc3MpICogMC43NTtcbiAgICAgIGNvbnN0IHNsaWRlSW5kZXggPSBzd2lwZXIudmlydHVhbCAmJiBzd2lwZXIucGFyYW1zLnZpcnR1YWwuZW5hYmxlZCA/IHN3aXBlci52aXJ0dWFsLmZyb20gKyBpIDogaTtcbiAgICAgIGNvbnN0IGlzU3dpcGVUb05leHQgPSAoc2xpZGVJbmRleCA9PT0gYWN0aXZlSW5kZXggfHwgc2xpZGVJbmRleCA9PT0gYWN0aXZlSW5kZXggLSAxKSAmJiBwcm9ncmVzcyA+IDAgJiYgcHJvZ3Jlc3MgPCAxICYmIChpc1RvdWNoZWQgfHwgc3dpcGVyLnBhcmFtcy5jc3NNb2RlKSAmJiBjdXJyZW50VHJhbnNsYXRlIDwgc3RhcnRUcmFuc2xhdGU7XG4gICAgICBjb25zdCBpc1N3aXBlVG9QcmV2ID0gKHNsaWRlSW5kZXggPT09IGFjdGl2ZUluZGV4IHx8IHNsaWRlSW5kZXggPT09IGFjdGl2ZUluZGV4ICsgMSkgJiYgcHJvZ3Jlc3MgPCAwICYmIHByb2dyZXNzID4gLTEgJiYgKGlzVG91Y2hlZCB8fCBzd2lwZXIucGFyYW1zLmNzc01vZGUpICYmIGN1cnJlbnRUcmFuc2xhdGUgPiBzdGFydFRyYW5zbGF0ZTtcbiAgICAgIGlmIChpc1N3aXBlVG9OZXh0IHx8IGlzU3dpcGVUb1ByZXYpIHtcbiAgICAgICAgY29uc3Qgc3ViUHJvZ3Jlc3MgPSAoMSAtIE1hdGguYWJzKChNYXRoLmFicyhwcm9ncmVzcykgLSAwLjUpIC8gMC41KSkgKiogMC41O1xuICAgICAgICByb3RhdGUgKz0gLTI4ICogcHJvZ3Jlc3MgKiBzdWJQcm9ncmVzcztcbiAgICAgICAgc2NhbGUgKz0gLTAuNSAqIHN1YlByb2dyZXNzO1xuICAgICAgICB0WEFkZCArPSA5NiAqIHN1YlByb2dyZXNzO1xuICAgICAgICB0WSA9IGAkey0yNSAqIHN1YlByb2dyZXNzICogTWF0aC5hYnMocHJvZ3Jlc3MpfSVgO1xuICAgICAgfVxuICAgICAgaWYgKHByb2dyZXNzIDwgMCkge1xuICAgICAgICAvLyBuZXh0XG4gICAgICAgIHRYID0gYGNhbGMoJHt0WH1weCAke3J0bCA/ICctJyA6ICcrJ30gKCR7dFhBZGQgKiBNYXRoLmFicyhwcm9ncmVzcyl9JSkpYDtcbiAgICAgIH0gZWxzZSBpZiAocHJvZ3Jlc3MgPiAwKSB7XG4gICAgICAgIC8vIHByZXZcbiAgICAgICAgdFggPSBgY2FsYygke3RYfXB4ICR7cnRsID8gJy0nIDogJysnfSAoLSR7dFhBZGQgKiBNYXRoLmFicyhwcm9ncmVzcyl9JSkpYDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRYID0gYCR7dFh9cHhgO1xuICAgICAgfVxuICAgICAgaWYgKCFzd2lwZXIuaXNIb3Jpem9udGFsKCkpIHtcbiAgICAgICAgY29uc3QgcHJldlkgPSB0WTtcbiAgICAgICAgdFkgPSB0WDtcbiAgICAgICAgdFggPSBwcmV2WTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHNjYWxlU3RyaW5nID0gcHJvZ3Jlc3MgPCAwID8gYCR7MSArICgxIC0gc2NhbGUpICogcHJvZ3Jlc3N9YCA6IGAkezEgLSAoMSAtIHNjYWxlKSAqIHByb2dyZXNzfWA7XG5cbiAgICAgIC8qIGVzbGludC1kaXNhYmxlICovXG4gICAgICBjb25zdCB0cmFuc2Zvcm0gPSBgXG4gICAgICAgIHRyYW5zbGF0ZTNkKCR7dFh9LCAke3RZfSwgJHt0Wn1weClcbiAgICAgICAgcm90YXRlWigke3BhcmFtcy5yb3RhdGUgPyBydGwgPyAtcm90YXRlIDogcm90YXRlIDogMH1kZWcpXG4gICAgICAgIHNjYWxlKCR7c2NhbGVTdHJpbmd9KVxuICAgICAgYDtcbiAgICAgIC8qIGVzbGludC1lbmFibGUgKi9cblxuICAgICAgaWYgKHBhcmFtcy5zbGlkZVNoYWRvd3MpIHtcbiAgICAgICAgLy8gU2V0IHNoYWRvd3NcbiAgICAgICAgbGV0IHNoYWRvd0VsID0gc2xpZGVFbC5xdWVyeVNlbGVjdG9yKCcuc3dpcGVyLXNsaWRlLXNoYWRvdycpO1xuICAgICAgICBpZiAoIXNoYWRvd0VsKSB7XG4gICAgICAgICAgc2hhZG93RWwgPSBjcmVhdGVTaGFkb3coJ2NhcmRzJywgc2xpZGVFbCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNoYWRvd0VsKSBzaGFkb3dFbC5zdHlsZS5vcGFjaXR5ID0gTWF0aC5taW4oTWF0aC5tYXgoKE1hdGguYWJzKHByb2dyZXNzKSAtIDAuNSkgLyAwLjUsIDApLCAxKTtcbiAgICAgIH1cbiAgICAgIHNsaWRlRWwuc3R5bGUuekluZGV4ID0gLU1hdGguYWJzKE1hdGgucm91bmQoc2xpZGVQcm9ncmVzcykpICsgc2xpZGVzLmxlbmd0aDtcbiAgICAgIGNvbnN0IHRhcmdldEVsID0gZWZmZWN0VGFyZ2V0KHBhcmFtcywgc2xpZGVFbCk7XG4gICAgICB0YXJnZXRFbC5zdHlsZS50cmFuc2Zvcm0gPSB0cmFuc2Zvcm07XG4gICAgfVxuICB9O1xuICBjb25zdCBzZXRUcmFuc2l0aW9uID0gZHVyYXRpb24gPT4ge1xuICAgIGNvbnN0IHRyYW5zZm9ybUVsZW1lbnRzID0gc3dpcGVyLnNsaWRlcy5tYXAoc2xpZGVFbCA9PiBnZXRTbGlkZVRyYW5zZm9ybUVsKHNsaWRlRWwpKTtcbiAgICB0cmFuc2Zvcm1FbGVtZW50cy5mb3JFYWNoKGVsID0+IHtcbiAgICAgIGVsLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IGAke2R1cmF0aW9ufW1zYDtcbiAgICAgIGVsLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zd2lwZXItc2xpZGUtc2hhZG93JykuZm9yRWFjaChzaGFkb3dFbCA9PiB7XG4gICAgICAgIHNoYWRvd0VsLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IGAke2R1cmF0aW9ufW1zYDtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGVmZmVjdFZpcnR1YWxUcmFuc2l0aW9uRW5kKHtcbiAgICAgIHN3aXBlcixcbiAgICAgIGR1cmF0aW9uLFxuICAgICAgdHJhbnNmb3JtRWxlbWVudHNcbiAgICB9KTtcbiAgfTtcbiAgZWZmZWN0SW5pdCh7XG4gICAgZWZmZWN0OiAnY2FyZHMnLFxuICAgIHN3aXBlcixcbiAgICBvbixcbiAgICBzZXRUcmFuc2xhdGUsXG4gICAgc2V0VHJhbnNpdGlvbixcbiAgICBwZXJzcGVjdGl2ZTogKCkgPT4gdHJ1ZSxcbiAgICBvdmVyd3JpdGVQYXJhbXM6ICgpID0+ICh7XG4gICAgICB3YXRjaFNsaWRlc1Byb2dyZXNzOiB0cnVlLFxuICAgICAgdmlydHVhbFRyYW5zbGF0ZTogIXN3aXBlci5wYXJhbXMuY3NzTW9kZVxuICAgIH0pXG4gIH0pO1xufVxuXG5leHBvcnQgeyBFZmZlY3RDYXJkcyBhcyBkZWZhdWx0IH07XG4iLCIvKipcbiAqIFN3aXBlciAxMS4wLjVcbiAqIE1vc3QgbW9kZXJuIG1vYmlsZSB0b3VjaCBzbGlkZXIgYW5kIGZyYW1ld29yayB3aXRoIGhhcmR3YXJlIGFjY2VsZXJhdGVkIHRyYW5zaXRpb25zXG4gKiBodHRwczovL3N3aXBlcmpzLmNvbVxuICpcbiAqIENvcHlyaWdodCAyMDE0LTIwMjMgVmxhZGltaXIgS2hhcmxhbXBpZGlcbiAqXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2VcbiAqXG4gKiBSZWxlYXNlZCBvbjogTm92ZW1iZXIgMjIsIDIwMjNcbiAqL1xuXG5pbXBvcnQgeyBTIGFzIFN3aXBlciB9IGZyb20gJy4vc2hhcmVkL3N3aXBlci1jb3JlLm1qcyc7XG5pbXBvcnQgVmlydHVhbCBmcm9tICcuL21vZHVsZXMvdmlydHVhbC5tanMnO1xuaW1wb3J0IEtleWJvYXJkIGZyb20gJy4vbW9kdWxlcy9rZXlib2FyZC5tanMnO1xuaW1wb3J0IE1vdXNld2hlZWwgZnJvbSAnLi9tb2R1bGVzL21vdXNld2hlZWwubWpzJztcbmltcG9ydCBOYXZpZ2F0aW9uIGZyb20gJy4vbW9kdWxlcy9uYXZpZ2F0aW9uLm1qcyc7XG5pbXBvcnQgUGFnaW5hdGlvbiBmcm9tICcuL21vZHVsZXMvcGFnaW5hdGlvbi5tanMnO1xuaW1wb3J0IFNjcm9sbGJhciBmcm9tICcuL21vZHVsZXMvc2Nyb2xsYmFyLm1qcyc7XG5pbXBvcnQgUGFyYWxsYXggZnJvbSAnLi9tb2R1bGVzL3BhcmFsbGF4Lm1qcyc7XG5pbXBvcnQgWm9vbSBmcm9tICcuL21vZHVsZXMvem9vbS5tanMnO1xuaW1wb3J0IENvbnRyb2xsZXIgZnJvbSAnLi9tb2R1bGVzL2NvbnRyb2xsZXIubWpzJztcbmltcG9ydCBBMTF5IGZyb20gJy4vbW9kdWxlcy9hMTF5Lm1qcyc7XG5pbXBvcnQgSGlzdG9yeSBmcm9tICcuL21vZHVsZXMvaGlzdG9yeS5tanMnO1xuaW1wb3J0IEhhc2hOYXZpZ2F0aW9uIGZyb20gJy4vbW9kdWxlcy9oYXNoLW5hdmlnYXRpb24ubWpzJztcbmltcG9ydCBBdXRvcGxheSBmcm9tICcuL21vZHVsZXMvYXV0b3BsYXkubWpzJztcbmltcG9ydCBUaHVtYiBmcm9tICcuL21vZHVsZXMvdGh1bWJzLm1qcyc7XG5pbXBvcnQgZnJlZU1vZGUgZnJvbSAnLi9tb2R1bGVzL2ZyZWUtbW9kZS5tanMnO1xuaW1wb3J0IEdyaWQgZnJvbSAnLi9tb2R1bGVzL2dyaWQubWpzJztcbmltcG9ydCBNYW5pcHVsYXRpb24gZnJvbSAnLi9tb2R1bGVzL21hbmlwdWxhdGlvbi5tanMnO1xuaW1wb3J0IEVmZmVjdEZhZGUgZnJvbSAnLi9tb2R1bGVzL2VmZmVjdC1mYWRlLm1qcyc7XG5pbXBvcnQgRWZmZWN0Q3ViZSBmcm9tICcuL21vZHVsZXMvZWZmZWN0LWN1YmUubWpzJztcbmltcG9ydCBFZmZlY3RGbGlwIGZyb20gJy4vbW9kdWxlcy9lZmZlY3QtZmxpcC5tanMnO1xuaW1wb3J0IEVmZmVjdENvdmVyZmxvdyBmcm9tICcuL21vZHVsZXMvZWZmZWN0LWNvdmVyZmxvdy5tanMnO1xuaW1wb3J0IEVmZmVjdENyZWF0aXZlIGZyb20gJy4vbW9kdWxlcy9lZmZlY3QtY3JlYXRpdmUubWpzJztcbmltcG9ydCBFZmZlY3RDYXJkcyBmcm9tICcuL21vZHVsZXMvZWZmZWN0LWNhcmRzLm1qcyc7XG5cbi8vIFN3aXBlciBDbGFzc1xuY29uc3QgbW9kdWxlcyA9IFtWaXJ0dWFsLCBLZXlib2FyZCwgTW91c2V3aGVlbCwgTmF2aWdhdGlvbiwgUGFnaW5hdGlvbiwgU2Nyb2xsYmFyLCBQYXJhbGxheCwgWm9vbSwgQ29udHJvbGxlciwgQTExeSwgSGlzdG9yeSwgSGFzaE5hdmlnYXRpb24sIEF1dG9wbGF5LCBUaHVtYiwgZnJlZU1vZGUsIEdyaWQsIE1hbmlwdWxhdGlvbiwgRWZmZWN0RmFkZSwgRWZmZWN0Q3ViZSwgRWZmZWN0RmxpcCwgRWZmZWN0Q292ZXJmbG93LCBFZmZlY3RDcmVhdGl2ZSwgRWZmZWN0Q2FyZHNdO1xuU3dpcGVyLnVzZShtb2R1bGVzKTtcblxuZXhwb3J0IHsgU3dpcGVyLCBTd2lwZXIgYXMgZGVmYXVsdCB9O1xuIiwiaW1wb3J0IFN3aXBlciBmcm9tICdzd2lwZXIvYnVuZGxlJztcclxuaW1wb3J0ICdzd2lwZXIvY3NzL2J1bmRsZSc7XHJcblxyXG5jb25zdCBhYm91dFN3aXBlciA9ICgpID0+IHtcclxuICAgIGNvbnN0IHN3aXBlciA9IG5ldyBTd2lwZXIoJy5hYm91dF9fc3dpcGVyJywge1xyXG4gICAgICAgIHNsaWRlc1BlclZpZXc6IDEsXHJcbiAgICAgICAgc3BhY2VCZXR3ZWVuOiAzMCxcclxuICAgICAgICAvLyBsb29wOiB0cnVlLFxyXG4gICAgICAgIG5hdmlnYXRpb246IHtcclxuICAgICAgICAgICAgbmV4dEVsOiAnLmFib3V0X19zd2lwZXItYnRuLW5leHQnLFxyXG4gICAgICAgICAgICBwcmV2RWw6ICcuYWJvdXRfX3N3aXBlci1idG4tcHJldicsXHJcbiAgICAgICAgfSxcclxuICAgIH0pO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgYWJvdXRTd2lwZXI7XHJcbiIsImltcG9ydCBTd2lwZXIgZnJvbSAnc3dpcGVyL2J1bmRsZSc7XHJcbmltcG9ydCAnc3dpcGVyL2Nzcy9idW5kbGUnO1xyXG5cclxuY29uc3QgYXJ0aXN0c1N3aXBlciA9ICgpID0+IHtcclxuICAgIGNvbnN0IHN3aXBlcl90ZXh0ID0gbmV3IFN3aXBlcignLmFydGlzdHNfX3N3aXBlci10aXRsZScsIHtcclxuICAgICAgICBhbGxvd1RvdWNoTW92ZTogZmFsc2UsXHJcbiAgICAgICAgZWZmZWN0OiAnZmFkZScsXHJcbiAgICAgICAgZmFkZUVmZmVjdDoge1xyXG4gICAgICAgICAgICBjcm9zc0ZhZGU6IHRydWVcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBzd2lwZXJfbWFpbiA9IG5ldyBTd2lwZXIoJy5hcnRpc3RzX19zd2lwZXItcGhvdG8nLCB7XHJcbiAgICAgICAgc2xpZGVzUGVyVmlldzonYXV0bycsXHJcblxyXG4gICAgICAgIGVmZmVjdDogJ2NvdmVyZmxvdycsXHJcbiAgICAgICAgZ3JhYkN1cnNvcjogdHJ1ZSxcclxuICAgICAgICBjZW50ZXJlZFNsaWRlczogdHJ1ZSxcclxuICAgICAgICBjb3ZlcmZsb3dFZmZlY3Q6IHtcclxuICAgICAgICAgICAgcm90YXRlOiAwLFxyXG4gICAgICAgICAgICBzdHJldGNoOiA1MCxcclxuICAgICAgICAgICAgZGVwdGg6IDYwMCxcclxuICAgICAgICAgICAgbW9kaWZpZXI6IDEuNSxcclxuICAgICAgICAgICAgc2xpZGVTaGFkb3dzOiBmYWxzZSxcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBuYXZpZ2F0aW9uOiB7XHJcbiAgICAgICAgICAgIG5leHRFbDogXCIuYXJ0aXN0aXNfX3N3aXBlci1uYXYtYnRuLS1uZXh0XCIsXHJcbiAgICAgICAgICAgIHByZXZFbDogXCIuYXJ0aXN0aXNfX3N3aXBlci1uYXYtYnRuLS1wcmV2XCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgICB0aHVtYnM6IHtcclxuICAgICAgICAgICAgc3dpcGVyOiBzd2lwZXJfdGV4dCBcclxuICAgICAgICB9LFxyXG4gICAgICAgIGJyZWFrcG9pbnRzOiB7XHJcbiAgICAgICAgICAgIC8vIHdoZW4gd2luZG93IHdpZHRoIGlzID49IDMyMHB4XHJcbiAgICAgICAgICAgIDc2ODoge1xyXG4gICAgICAgICAgICAgICAgY292ZXJmbG93RWZmZWN0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcm90YXRlOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0cmV0Y2g6IDQ1LFxyXG4gICAgICAgICAgICAgICAgICAgIGRlcHRoOiA1MDAsXHJcbiAgICAgICAgICAgICAgICAgICAgbW9kaWZpZXI6IDEuNSxcclxuICAgICAgICAgICAgICAgICAgICBzbGlkZVNoYWRvd3M6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfX1cclxuICAgIH0pO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgYXJ0aXN0c1N3aXBlcjtcclxuIiwiaW1wb3J0IFN3aXBlciBmcm9tICdzd2lwZXIvYnVuZGxlJztcclxuaW1wb3J0ICdzd2lwZXIvY3NzL2J1bmRsZSc7XHJcblxyXG5cclxuY29uc3QgcmVsZWFzZVN3aXBlciA9ICgpID0+IHtcclxuICAgIGNvbnN0IHN3aXBlciA9IG5ldyBTd2lwZXIoJy5yZWxlYXNlX19zd2lwZXInLCB7XHJcbiAgICAgICAgc2xpZGVzUGVyVmlldzogJ2F1dG8nLFxyXG4gICAgXHJcbiAgICAgICAgLy8gbG9vcDogdHJ1ZSxcclxuXHJcbiAgICAgICAgZWZmZWN0OiAnY292ZXJmbG93JyxcclxuICAgICAgICBncmFiQ3Vyc29yOiB0cnVlLFxyXG4gICAgICAgIGNlbnRlcmVkU2xpZGVzOiB0cnVlLFxyXG4gICAgICAgIGNvdmVyZmxvd0VmZmVjdDoge1xyXG4gICAgICAgICAgICByb3RhdGU6IDAsXHJcbiAgICAgICAgICAgIHN0cmV0Y2g6IDQ1LFxyXG4gICAgICAgICAgICBkZXB0aDogMzMwLFxyXG4gICAgICAgICAgICBtb2RpZmllcjogMS41LFxyXG4gICAgICAgICAgICBzbGlkZVNoYWRvd3M6IGZhbHNlLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbmF2aWdhdGlvbjoge1xyXG4gICAgICAgICAgICBuZXh0RWw6ICcucmVsZWFzZV9fc3dpcGVyLW5hdi1idG4tLW5leHQnLFxyXG4gICAgICAgICAgICBwcmV2RWw6ICcucmVsZWFzZV9fc3dpcGVyLW5hdi1idG4tLXByZXYnLFxyXG4gICAgICAgIH0sXHJcbiAgICB9KTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHJlbGVhc2VTd2lwZXI7IiwiY29uc3QgYnVyZ2VyID0gKCkgPT4ge1xyXG4gICAgY29uc3QgYnVyZ2VyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJ1cmdlcicpO1xyXG4gICAgY29uc3QgbmF2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fbmF2LXdyYXBwZXInKTtcclxuICAgIGNvbnN0IG92ZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcub3ZlcmxheScpO1xyXG5cclxuICAgIGNvbnN0IGdldFNjcm9sbGJhcldpZHRoID0gKCkgPT4gd2luZG93LmlubmVyV2lkdGggLSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGg7XHJcblxyXG4gICAgZnVuY3Rpb24gb3BlbkJ1cmdlcigpIHtcclxuICAgICAgICBsZXQgc2Nyb2xsV2l0aCA9IGdldFNjcm9sbGJhcldpZHRoKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUucGFkZGluZ1JpZ2h0ID0gYCR7c2Nyb2xsV2l0aH1weGA7XHJcblxyXG4gICAgICAgIGJ1cmdlci5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcclxuICAgICAgICBidXJnZXIuc3R5bGUucGFkZGluZ1JpZ2h0ID0gYCR7c2Nyb2xsV2l0aH1weGA7XHJcblxyXG4gICAgICAgIG5hdi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcclxuICAgICAgICBvdmVybGF5LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNsb3NlQnVyZ2VyKCkge1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnJztcclxuICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnBhZGRpbmdSaWdodCA9ICcnO1xyXG5cclxuICAgICAgICBidXJnZXIuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcbiAgICAgICAgYnVyZ2VyLnN0eWxlLnBhZGRpbmdSaWdodCA9IGBgO1xyXG5cclxuICAgICAgICBuYXYuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcbiAgICAgICAgb3ZlcmxheS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuICAgIH1cclxuXHJcbiAgICBidXJnZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgYnVyZ2VyLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykgPyBjbG9zZUJ1cmdlcigpIDogb3BlbkJ1cmdlcigpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgb3ZlcmxheS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICAgICAgaWYgKGUudGFyZ2V0ID09PSBvdmVybGF5KSB7XHJcbiAgICAgICAgICAgIGNsb3NlQnVyZ2VyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgbmF2LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuICAgICAgICBpZiAoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdoZWFkZXItdG9wX19uYXYtbGluaycpKSB7XHJcbiAgICAgICAgICAgIGNsb3NlQnVyZ2VyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBidXJnZXI7IiwiY29uc3Qgc2Nyb2xsID0gKCkgPT4ge1xyXG4gICAgY29uc3QgYW5jaG9ycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC5uYXYtbGlua2ApO1xyXG5cclxuICAgIGZvciAobGV0IGFuY2hvciBvZiBhbmNob3JzKSB7XHJcbiAgICAgICAgYW5jaG9yLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBjb25zdCBibG9ja0lkID0gYW5jaG9yLmdldEF0dHJpYnV0ZSgnaHJlZicpO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcnICsgYmxvY2tJZCkuc2Nyb2xsSW50b1ZpZXcoe1xyXG4gICAgICAgICAgICAgICAgYmVoYXZpb3I6ICdzbW9vdGgnLFxyXG4gICAgICAgICAgICAgICAgYmxvY2s6ICdzdGFydCcsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfX1cclxuICAgIGV4cG9ydCBkZWZhdWx0IHNjcm9sbCIsIlxyXG5jb25zdCBmYXEgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBhY2NvcmRpb25JdGVtSGVhZGVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5mYXFfX2FjY29yZGlvbi1pdGVtLWhlYWRlcicpO1xyXG5cclxuICAgIGFjY29yZGlvbkl0ZW1IZWFkZXJzLmZvckVhY2goKGFjY29yZGlvbkl0ZW1IZWFkZXIpID0+IHtcclxuICAgIGFjY29yZGlvbkl0ZW1IZWFkZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgY3VycmVudGx5QWN0aXZlQWNjb3JkaW9uSXRlbUhlYWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mYXFfX2FjY29yZGlvbi1pdGVtLWhlYWRlci5hY3RpdmUnKTtcclxuICAgICAgICBpZiAoY3VycmVudGx5QWN0aXZlQWNjb3JkaW9uSXRlbUhlYWRlciAmJiBjdXJyZW50bHlBY3RpdmVBY2NvcmRpb25JdGVtSGVhZGVyICE9PSBhY2NvcmRpb25JdGVtSGVhZGVyKSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRseUFjdGl2ZUFjY29yZGlvbkl0ZW1IZWFkZXIuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIGN1cnJlbnRseUFjdGl2ZUFjY29yZGlvbkl0ZW1IZWFkZXIubmV4dEVsZW1lbnRTaWJsaW5nLnN0eWxlLm1heEhlaWdodCA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGFjY29yZGlvbkl0ZW1IZWFkZXIuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XHJcbiAgICAgICAgY29uc3QgYWNjb3JkaW9uSXRlbUJvZHkgPSBhY2NvcmRpb25JdGVtSGVhZGVyLm5leHRFbGVtZW50U2libGluZztcclxuICAgICAgICBpZiAoYWNjb3JkaW9uSXRlbUhlYWRlci5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XHJcbiAgICAgICAgICAgIGFjY29yZGlvbkl0ZW1Cb2R5LnN0eWxlLm1heEhlaWdodCA9IGFjY29yZGlvbkl0ZW1Cb2R5LnNjcm9sbEhlaWdodCArICdweCc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYWNjb3JkaW9uSXRlbUJvZHkuc3R5bGUubWF4SGVpZ2h0ID0gMDtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbn0pO1xyXG5cclxuXHJcblxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZhcTsiLCJjb25zdCBoZWFkZXIgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBuYXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyJyk7XHJcbiAgICBjb25zdCBuYXZPZmZzZXRUb3AgPSBuYXYub2Zmc2V0VG9wO1xyXG5cclxuICAgIGZ1bmN0aW9uIGhhbmRsZVNjcm9sbCgpIHtcclxuICAgICAgICBpZiAod2luZG93LmlubmVyV2lkdGggPiA3NjgpIHtcclxuICAgICAgICAgICAgaWYgKHdpbmRvdy5zY3JvbGxZID4gbmF2T2Zmc2V0VG9wKSB7XHJcbiAgICAgICAgICAgICAgICBuYXYuY2xhc3NMaXN0LmFkZCgnZml4ZWQtbmF2Jyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBuYXYuY2xhc3NMaXN0LnJlbW92ZSgnZml4ZWQtbmF2Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgaGFuZGxlU2Nyb2xsKTtcclxuICAgIC8vINCY0L3QuNGG0LjQsNC70LjQt9C40YDRg9C10Lwg0L7QsdGA0LDQsdC+0YLRh9C40Log0YHQutGA0L7Qu9C70LAg0L/RgNC4INC30LDQs9GA0YPQt9C60LUg0YHRgtGA0LDQvdC40YbRi1xyXG4gICAgaGFuZGxlU2Nyb2xsKCk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBoZWFkZXI7XHJcbiIsImltcG9ydCAnLi9pbmRleC5zY3NzJztcbmltcG9ydCBhYm91dFN3aXBlciBmcm9tICcuL2pzL2NvbXBvbmVudHMvYWJvdXRTd2lwZXInO1xuaW1wb3J0IGFydGlzdHNTd2lwZXIgZnJvbSAnLi9qcy9jb21wb25lbnRzL2FydGlzdHNTd2lwZXInO1xuaW1wb3J0IHJlbGVhc2VTd2lwZXIgZnJvbSAnLi9qcy9jb21wb25lbnRzL3JlbGVhc2VTd2lwZXInO1xuaW1wb3J0IGJ1cmdlciBmcm9tICcuL2pzL2NvbXBvbmVudHMvYnVyZ2VyJztcbmltcG9ydCBzY3JvbGwgZnJvbSAnLi9qcy9jb21wb25lbnRzL3Njcm9sbCc7XG5cbmltcG9ydCBmYXEgZnJvbSAnLi9qcy9jb21wb25lbnRzL2ZhcSc7XG5pbXBvcnQgaGVhZGVyIGZyb20gJy4vanMvY29tcG9uZW50cy9oZWFkZXInO1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcbiAgICB0cnkge1xuICAgICAgICBoZWFkZXIoKTtcbiAgICB9IGNhdGNoIHt9XG4gICAgdHJ5IHtcbiAgICAgICAgZmFxKCk7XG4gICAgfSBjYXRjaCB7fVxuICAgIHRyeSB7XG4gICAgICAgIGFib3V0U3dpcGVyKCk7XG4gICAgfSBjYXRjaCB7fVxuICAgIHRyeSB7XG4gICAgICAgIGFydGlzdHNTd2lwZXIoKTtcbiAgICB9IGNhdGNoIHt9XG4gICAgdHJ5IHtcbiAgICAgICAgcmVsZWFzZVN3aXBlcigpO1xuICAgIH0gY2F0Y2gge31cbiAgICB0cnkge1xuICAgICAgICBidXJnZXIoKTtcbiAgICB9IGNhdGNoIHt9XG4gICAgdHJ5IHtcbiAgICAgICAgc2Nyb2xsKCk7XG4gICAgfSBjYXRjaCB7fVxufSk7XG4iXSwibmFtZXMiOlsiU3dpcGVyIiwiYWJvdXRTd2lwZXIiLCJzd2lwZXIiLCJzbGlkZXNQZXJWaWV3Iiwic3BhY2VCZXR3ZWVuIiwibmF2aWdhdGlvbiIsIm5leHRFbCIsInByZXZFbCIsImFydGlzdHNTd2lwZXIiLCJzd2lwZXJfdGV4dCIsImFsbG93VG91Y2hNb3ZlIiwiZWZmZWN0IiwiZmFkZUVmZmVjdCIsImNyb3NzRmFkZSIsInN3aXBlcl9tYWluIiwiZ3JhYkN1cnNvciIsImNlbnRlcmVkU2xpZGVzIiwiY292ZXJmbG93RWZmZWN0Iiwicm90YXRlIiwic3RyZXRjaCIsImRlcHRoIiwibW9kaWZpZXIiLCJzbGlkZVNoYWRvd3MiLCJ0aHVtYnMiLCJicmVha3BvaW50cyIsInJlbGVhc2VTd2lwZXIiLCJidXJnZXIiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJuYXYiLCJvdmVybGF5IiwiZ2V0U2Nyb2xsYmFyV2lkdGgiLCJ3aW5kb3ciLCJpbm5lcldpZHRoIiwiZG9jdW1lbnRFbGVtZW50IiwiY2xpZW50V2lkdGgiLCJvcGVuQnVyZ2VyIiwic2Nyb2xsV2l0aCIsImJvZHkiLCJzdHlsZSIsIm92ZXJmbG93IiwicGFkZGluZ1JpZ2h0IiwiY2xhc3NMaXN0IiwiYWRkIiwiY2xvc2VCdXJnZXIiLCJyZW1vdmUiLCJhZGRFdmVudExpc3RlbmVyIiwiY29udGFpbnMiLCJlIiwidGFyZ2V0Iiwic2Nyb2xsIiwiYW5jaG9ycyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJhbmNob3IiLCJwcmV2ZW50RGVmYXVsdCIsImJsb2NrSWQiLCJnZXRBdHRyaWJ1dGUiLCJzY3JvbGxJbnRvVmlldyIsImJlaGF2aW9yIiwiYmxvY2siLCJmYXEiLCJhY2NvcmRpb25JdGVtSGVhZGVycyIsImZvckVhY2giLCJhY2NvcmRpb25JdGVtSGVhZGVyIiwiY3VycmVudGx5QWN0aXZlQWNjb3JkaW9uSXRlbUhlYWRlciIsInRvZ2dsZSIsIm5leHRFbGVtZW50U2libGluZyIsIm1heEhlaWdodCIsImFjY29yZGlvbkl0ZW1Cb2R5Iiwic2Nyb2xsSGVpZ2h0IiwiaGVhZGVyIiwibmF2T2Zmc2V0VG9wIiwib2Zmc2V0VG9wIiwiaGFuZGxlU2Nyb2xsIiwic2Nyb2xsWSJdLCJzb3VyY2VSb290IjoiIn0=