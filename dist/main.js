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
          depth: 300,
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
});
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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O0FBQ1QsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULE9BQU87QUFDUCxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsV0FBVyxhQUFhLFNBQVM7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsU0FBUztBQUMxQjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLFdBQVc7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNGQUFzRixzQkFBc0I7QUFDNUc7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0Esd0JBQXdCLEdBQUc7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG1CQUFtQixXQUFXO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsNEJBQTRCLEdBQUc7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QztBQUN2QztBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHVCQUF1QixHQUFHO0FBQzFCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixHQUFHO0FBQzFCLEVBQUUsUUFBUTtBQUNWO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsdUJBQXVCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvSUFBb0k7QUFDcEk7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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O0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLFlBQU07QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSxZQUFNO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksWUFBTTtB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Q0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLHlCQUF5QjtBQUN4RDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFaUM7OztBQzFMMEM7QUFDQzs7QUFFNUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDLE9BQU87QUFDckQsNEJBQTRCLFFBQVEsSUFBSSxjQUFjO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIs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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVxQzs7O0FDNUYyQjs7QUFFaEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxNQUFNO0FBQ047QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsV0FBVztBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsV0FBVztBQUNoQztBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsV0FBVztBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRStCOzs7QUM3U2lDO0FBQ1U7O0FBRTFFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsTUFBTSxTQUFTLGNBQVE7QUFDdkIsaURBQWlEO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixzQkFBc0I7QUFDNUMsUUFBUSxlQUFlLHFEQUFxRCxxQkFBcUI7QUFDakc7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxNQUFNO0FBQ04sc0JBQXNCLHNCQUFzQjtBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0SEFBNEgsaUJBQWlCO0FBQzdJO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsdUJBQXVCLFdBQVc7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFNEI7OztBQy9MOEM7O0FBRTFFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsWUFBWSxHQUFHO0FBQ2YsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EseUJBQXlCLEdBQUc7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLEdBQUc7QUFDN0I7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQSx3QkFBd0IscUJBQXFCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSxvQkFBb0I7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksb0JBQW9CO0FBQ2hDO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsV0FBVztBQUNYLFNBQVM7QUFDVCxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVLG9CQUFvQjtBQUM5QjtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUUrQjs7O0FDNU8vQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUNBQXlDLDBCQUEwQixRQUFRLEtBQUs7QUFDaEYseUZBQXlGLGFBQWE7QUFDdEc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQSxxRUFBcUUsa0NBQWtDO0FBQ3ZHO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixxQkFBcUI7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSw2QkFBNkIsOEJBQThCLFVBQVUsOEJBQThCO0FBQ25HO0FBQ0E7QUFDQSxNQUFNO0FBQ04sMEJBQTBCLDhCQUE4QjtBQUN4RDtBQUNBLDRCQUE0Qiw4QkFBOEI7QUFDMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFMkI7OztBQzFKM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsbUJBQW1CO0FBQ3ZDO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLG1CQUFtQjtBQUN2QztBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixZQUFZO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsbUJBQW1CO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0Esa0JBQWtCLHlCQUF5QjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsMEJBQTBCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLDBCQUEwQjtBQUM1QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVtQzs7O0FDOUxuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSw4QkFBOEIscUNBQXFDLEVBQUUsT0FBTztBQUM1RTtBQUNBLGdDQUFnQyxxQ0FBcUM7QUFDckU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7O0FBRTJCOzs7QUN6RDRCOztBQUV2RDtBQUNBLHNCQUFzQixtQkFBbUI7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUU2Qjs7O0FDWDJCOztBQUV4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE1BQU0sb0JBQW9CO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTDtBQUNBOztBQUUyQzs7O0FDL0NpQjtBQUNJO0FBQzhCO0FBQy9COztBQUUvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLG9CQUFvQixtQkFBbUI7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsWUFBWTtBQUNuQztBQUNBLGdEQUFnRCxHQUFHLE1BQU0sR0FBRztBQUM1RDtBQUNBO0FBQ0E7QUFDQSwyREFBMkQsbUJBQW1CO0FBQzlFO0FBQ0EsdUNBQXVDLFNBQVM7QUFDaEQsS0FBSztBQUNMLElBQUksMEJBQTBCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsRUFBRSxVQUFVO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7O0FBRWlDOzs7QUNqRTJCO0FBQ0g7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsYUFBYSx3REFBd0QsOEJBQThCO0FBQ3hIO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixhQUFhLHdEQUF3RCxrQ0FBa0M7QUFDM0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixhQUFhO0FBQ3RDO0FBQ0E7QUFDQSx1Q0FBdUMsWUFBWTtBQUNuRCxRQUFRO0FBQ1I7QUFDQTtBQUNBLHlCQUF5QixhQUFhO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLG1CQUFtQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLCtCQUErQixlQUFlLDhCQUE4QixtQkFBbUIsR0FBRyxNQUFNLEdBQUcsTUFBTSxHQUFHO0FBQ3ZKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtEQUFrRCxlQUFlO0FBQ2pFLDhEQUE4RCxlQUFlO0FBQzdFO0FBQ0E7QUFDQSwyREFBMkQsc0NBQXNDLE1BQU0saUJBQWlCLDRDQUE0QyxtQkFBbUI7QUFDdkwsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBa0QsT0FBTyxPQUFPLE9BQU8scUJBQXFCLDBCQUEwQixNQUFNLDJCQUEyQjtBQUN2SjtBQUNBO0FBQ0E7QUFDQSxxREFBcUQsUUFBUSxjQUFjLDBDQUEwQyxlQUFlLDJDQUEyQztBQUMvSyxnRUFBZ0UsUUFBUTtBQUN4RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsNENBQTRDLFNBQVM7QUFDckQ7QUFDQSw0Q0FBNEMsU0FBUztBQUNyRCxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7QUFDQSwyREFBMkQsU0FBUztBQUNwRTtBQUNBO0FBQ0EsRUFBRSxVQUFVO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIOztBQUVpQzs7O0FDL0swQzs7QUFFM0U7QUFDQSw0Q0FBNEMsV0FBVyxLQUFLLE9BQU8sRUFBRSxpQ0FBaUMsT0FBTyxPQUFPO0FBQ3BILDBCQUEwQixtQkFBbUI7QUFDN0MsbURBQW1ELGlDQUFpQztBQUNwRjtBQUNBLGVBQWUsYUFBYTtBQUM1QjtBQUNBO0FBQ0E7QUFDQTs7QUFFNkI7OztBQ2JtQztBQUNKO0FBQ0k7QUFDOEI7QUFDL0I7O0FBRS9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixZQUFZO0FBQ2pDO0FBQ0E7QUFDQSxvQkFBb0IsWUFBWTtBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0Esb0JBQW9CLG1CQUFtQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDLEdBQUcsTUFBTSxHQUFHLG1CQUFtQixRQUFRLGVBQWUsUUFBUTtBQUNyRyx1QkFBdUIsWUFBWTtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBLDJEQUEyRCxtQkFBbUI7QUFDOUU7QUFDQSx1Q0FBdUMsU0FBUztBQUNoRDtBQUNBLCtDQUErQyxTQUFTO0FBQ3hELE9BQU87QUFDUCxLQUFLO0FBQ0wsSUFBSSwwQkFBMEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsRUFBRSxVQUFVO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7O0FBRWlDOzs7QUNySCtCO0FBQ0o7QUFDSTtBQUNEOztBQUUvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0Q0FBNEMsWUFBWTtBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRDQUE0QyxXQUFXLEtBQUssV0FBVyxLQUFLLFdBQVcsZUFBZSxRQUFRLGVBQWUsUUFBUSxhQUFhLE1BQU07QUFDeEosdUJBQXVCLFlBQVk7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsWUFBWTtBQUN2QztBQUNBO0FBQ0EsMEJBQTBCLFlBQVk7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyREFBMkQsbUJBQW1CO0FBQzlFO0FBQ0EsdUNBQXVDLFNBQVM7QUFDaEQ7QUFDQSwrQ0FBK0MsU0FBUztBQUN4RCxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0EsRUFBRSxVQUFVO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7O0FBRXNDOzs7QUM5RzBCO0FBQ0o7QUFDSTtBQUM4QjtBQUMvQjs7QUFFL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxjQUFjLE1BQU07QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQSwyREFBMkQsT0FBTztBQUNsRTtBQUNBLG9CQUFvQixtQkFBbUI7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsTUFBTSxRQUFRLDBDQUEwQyxJQUFJLGdDQUFnQztBQUN2SCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLHNDQUFzQyxLQUFLLGVBQWUsS0FBSyxlQUFlLEtBQUs7QUFDbkYsMERBQTBELHFEQUFxRCxjQUFjLHFEQUFxRDtBQUNsTDtBQUNBLHVDQUF1QyxnQkFBZ0IsSUFBSSxjQUFjLEVBQUUsWUFBWTs7QUFFdkY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsWUFBWTtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsWUFBWTtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkRBQTJELG1CQUFtQjtBQUM5RTtBQUNBLHVDQUF1QyxTQUFTO0FBQ2hEO0FBQ0EsK0NBQStDLFNBQVM7QUFDeEQsT0FBTztBQUNQLEtBQUs7QUFDTCxJQUFJLDBCQUEwQjtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEVBQUUsVUFBVTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7O0FBRXFDOzs7QUNuSjJCO0FBQ0o7QUFDSTtBQUM4QjtBQUMvQjs7QUFFL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0Esb0JBQW9CLG1CQUFtQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseURBQXlELHNCQUFzQjtBQUMvRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsdUNBQXVDO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixHQUFHLEtBQUssaUJBQWlCLEdBQUcsMkJBQTJCO0FBQzVFLFFBQVE7QUFDUjtBQUNBLHFCQUFxQixHQUFHLEtBQUssaUJBQWlCLElBQUksMkJBQTJCO0FBQzdFLFFBQVE7QUFDUixnQkFBZ0IsR0FBRztBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0Q0FBNEMsMkJBQTJCLE9BQU8sMkJBQTJCOztBQUV6RztBQUNBO0FBQ0Esc0JBQXNCLEdBQUcsSUFBSSxHQUFHLElBQUksR0FBRztBQUN2QyxrQkFBa0IsMkNBQTJDO0FBQzdELGdCQUFnQixZQUFZO0FBQzVCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsWUFBWTtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixZQUFZO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkRBQTJELG1CQUFtQjtBQUM5RTtBQUNBLHVDQUF1QyxTQUFTO0FBQ2hEO0FBQ0EsK0NBQStDLFNBQVM7QUFDeEQsT0FBTztBQUNQLEtBQUs7QUFDTCxJQUFJLDBCQUEwQjtBQUM5QjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxFQUFFLFVBQVU7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIOztBQUVrQzs7O0FDNUhsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUV1RDtBQUNYO0FBQ0U7QUFDSTtBQUNBO0FBQ0E7QUFDRjtBQUNGO0FBQ1I7QUFDWTtBQUNaO0FBQ007QUFDZTtBQUNiO0FBQ0w7QUFDTTtBQUNUO0FBQ2dCO0FBQ0g7QUFDQTtBQUNBO0FBQ1U7QUFDRjtBQUNOOztBQUVyRDtBQUNBLGlCQUFpQixPQUFPLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLGVBQWUsRUFBRSxjQUFjLEVBQUUsV0FBVztBQUM3USxNQUFNOztBQUUrQjs7O0FDekNGO0FBQ1I7QUFFM0IsTUFBTUMsV0FBVyxHQUFHQSxDQUFBLEtBQU07RUFDdEIsTUFBTUMsTUFBTSxHQUFHLElBQUlGLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRTtJQUN4Q0csYUFBYSxFQUFFLENBQUM7SUFDaEJDLFlBQVksRUFBRSxFQUFFO0lBQ2hCO0lBQ0FDLFVBQVUsRUFBRTtNQUNSQyxNQUFNLEVBQUUseUJBQXlCO01BQ2pDQyxNQUFNLEVBQUU7SUFDWjtFQUNKLENBQUMsQ0FBQztBQUNOLENBQUM7QUFFRCwyREFBZU4sV0FBVzs7QUNmUztBQUNSO0FBRTNCLE1BQU1PLGFBQWEsR0FBR0EsQ0FBQSxLQUFNO0VBQ3hCLE1BQU1DLFdBQVcsR0FBRyxJQUFJVCxNQUFNLENBQUMsd0JBQXdCLEVBQUU7SUFDckRVLGNBQWMsRUFBRSxLQUFLO0lBQ3JCQyxNQUFNLEVBQUUsTUFBTTtJQUNkQyxVQUFVLEVBQUU7TUFDUkMsU0FBUyxFQUFFO0lBQ2Y7RUFDSixDQUFDLENBQUM7RUFFRixNQUFNQyxXQUFXLEdBQUcsSUFBSWQsTUFBTSxDQUFDLHdCQUF3QixFQUFFO0lBQ3JERyxhQUFhLEVBQUMsTUFBTTtJQUVwQlEsTUFBTSxFQUFFLFdBQVc7SUFDbkJJLFVBQVUsRUFBRSxJQUFJO0lBQ2hCQyxjQUFjLEVBQUUsSUFBSTtJQUNwQkMsZUFBZSxFQUFFO01BQ2JDLE1BQU0sRUFBRSxDQUFDO01BQ1RDLE9BQU8sRUFBRSxFQUFFO01BQ1hDLEtBQUssRUFBRSxHQUFHO01BQ1ZDLFFBQVEsRUFBRSxHQUFHO01BQ2JDLFlBQVksRUFBRTtJQUNsQixDQUFDO0lBRURqQixVQUFVLEVBQUU7TUFDUkMsTUFBTSxFQUFFLGlDQUFpQztNQUN6Q0MsTUFBTSxFQUFFO0lBQ1osQ0FBQztJQUNEZ0IsTUFBTSxFQUFFO01BQ0pyQixNQUFNLEVBQUVPO0lBQ1osQ0FBQztJQUNEZSxXQUFXLEVBQUU7TUFDVDtNQUNBLEdBQUcsRUFBRTtRQUNEUCxlQUFlLEVBQUU7VUFDYkMsTUFBTSxFQUFFLENBQUM7VUFDVEMsT0FBTyxFQUFFLEVBQUU7VUFDWEMsS0FBSyxFQUFFLEdBQUc7VUFDVkMsUUFBUSxFQUFFLEdBQUc7VUFDYkMsWUFBWSxFQUFFO1FBQ2xCO01BQ0o7SUFBQztFQUNULENBQUMsQ0FBQztBQUNOLENBQUM7QUFFRCw2REFBZWQsYUFBYTs7QUMvQ087QUFDUjtBQUczQixNQUFNaUIsYUFBYSxHQUFHQSxDQUFBLEtBQU07RUFDeEIsTUFBTXZCLE1BQU0sR0FBRyxJQUFJRixNQUFNLENBQUMsa0JBQWtCLEVBQUU7SUFDMUNHLGFBQWEsRUFBRSxNQUFNO0lBRXJCOztJQUVBUSxNQUFNLEVBQUUsV0FBVztJQUNuQkksVUFBVSxFQUFFLElBQUk7SUFDaEJDLGNBQWMsRUFBRSxJQUFJO0lBQ3BCQyxlQUFlLEVBQUU7TUFDYkMsTUFBTSxFQUFFLENBQUM7TUFDVEMsT0FBTyxFQUFFLEVBQUU7TUFDWEMsS0FBSyxFQUFFLEdBQUc7TUFDVkMsUUFBUSxFQUFFLEdBQUc7TUFDYkMsWUFBWSxFQUFFO0lBQ2xCLENBQUM7SUFDRGpCLFVBQVUsRUFBRTtNQUNSQyxNQUFNLEVBQUUsZ0NBQWdDO01BQ3hDQyxNQUFNLEVBQUU7SUFDWjtFQUNKLENBQUMsQ0FBQztBQUNOLENBQUM7QUFFRCw2REFBZWtCLGFBQWE7O0FDM0I1QixNQUFNQyxNQUFNLEdBQUdBLENBQUEsS0FBTTtFQUNqQixNQUFNQSxNQUFNLEdBQUdDLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLFNBQVMsQ0FBQztFQUNoRCxNQUFNQyxHQUFHLEdBQUdGLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLHNCQUFzQixDQUFDO0VBQzFELE1BQU1FLE9BQU8sR0FBR0gsUUFBUSxDQUFDQyxhQUFhLENBQUMsVUFBVSxDQUFDO0VBRWxELE1BQU1HLGlCQUFpQixHQUFHQSxDQUFBLEtBQU1DLE1BQU0sQ0FBQ0MsVUFBVSxHQUFHTixRQUFRLENBQUNPLGVBQWUsQ0FBQ0MsV0FBVztFQUV4RixTQUFTQyxVQUFVQSxDQUFBLEVBQUc7SUFDbEIsSUFBSUMsVUFBVSxHQUFHTixpQkFBaUIsQ0FBQyxDQUFDO0lBRXBDSixRQUFRLENBQUNXLElBQUksQ0FBQ0MsS0FBSyxDQUFDQyxRQUFRLEdBQUcsUUFBUTtJQUN2Q2IsUUFBUSxDQUFDVyxJQUFJLENBQUNDLEtBQUssQ0FBQ0UsWUFBWSxHQUFJLEdBQUVKLFVBQVcsSUFBRztJQUVwRFgsTUFBTSxDQUFDZ0IsU0FBUyxDQUFDQyxHQUFHLENBQUMsUUFBUSxDQUFDO0lBQzlCakIsTUFBTSxDQUFDYSxLQUFLLENBQUNFLFlBQVksR0FBSSxHQUFFSixVQUFXLElBQUc7SUFFN0NSLEdBQUcsQ0FBQ2EsU0FBUyxDQUFDQyxHQUFHLENBQUMsUUFBUSxDQUFDO0lBQzNCYixPQUFPLENBQUNZLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLFFBQVEsQ0FBQztFQUNuQztFQUVBLFNBQVNDLFdBQVdBLENBQUEsRUFBRztJQUNuQmpCLFFBQVEsQ0FBQ1csSUFBSSxDQUFDQyxLQUFLLENBQUNDLFFBQVEsR0FBRyxFQUFFO0lBQ2pDYixRQUFRLENBQUNXLElBQUksQ0FBQ0MsS0FBSyxDQUFDRSxZQUFZLEdBQUcsRUFBRTtJQUVyQ2YsTUFBTSxDQUFDZ0IsU0FBUyxDQUFDRyxNQUFNLENBQUMsUUFBUSxDQUFDO0lBQ2pDbkIsTUFBTSxDQUFDYSxLQUFLLENBQUNFLFlBQVksR0FBSSxFQUFDO0lBRTlCWixHQUFHLENBQUNhLFNBQVMsQ0FBQ0csTUFBTSxDQUFDLFFBQVEsQ0FBQztJQUM5QmYsT0FBTyxDQUFDWSxTQUFTLENBQUNHLE1BQU0sQ0FBQyxRQUFRLENBQUM7RUFDdEM7RUFFQW5CLE1BQU0sQ0FBQ29CLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxNQUFNO0lBQ25DcEIsTUFBTSxDQUFDZ0IsU0FBUyxDQUFDSyxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUdILFdBQVcsQ0FBQyxDQUFDLEdBQUdSLFVBQVUsQ0FBQyxDQUFDO0VBQ3RFLENBQUMsQ0FBQztFQUVGTixPQUFPLENBQUNnQixnQkFBZ0IsQ0FBQyxPQUFPLEVBQUdFLENBQUMsSUFBSztJQUNyQyxJQUFJQSxDQUFDLENBQUNDLE1BQU0sS0FBS25CLE9BQU8sRUFBRTtNQUN0QmMsV0FBVyxDQUFDLENBQUM7SUFDakI7RUFDSixDQUFDLENBQUM7RUFFRmYsR0FBRyxDQUFDaUIsZ0JBQWdCLENBQUMsT0FBTyxFQUFHRSxDQUFDLElBQUs7SUFDakMsSUFBSUEsQ0FBQyxDQUFDQyxNQUFNLENBQUNQLFNBQVMsQ0FBQ0ssUUFBUSxDQUFDLHNCQUFzQixDQUFDLEVBQUU7TUFDckRILFdBQVcsQ0FBQyxDQUFDO0lBQ2pCO0VBQ0osQ0FBQyxDQUFDO0FBQ04sQ0FBQztBQUVELHNEQUFlbEIsTUFBTTs7QUMvQ3JCLE1BQU13QixHQUFHLEdBQUdBLENBQUEsS0FBTTtFQUNkLE1BQU1DLG9CQUFvQixHQUFHeEIsUUFBUSxDQUFDeUIsZ0JBQWdCLENBQUMsNkJBQTZCLENBQUM7RUFFckZELG9CQUFvQixDQUFDRSxPQUFPLENBQUVDLG1CQUFtQixJQUFLO0lBQ3REQSxtQkFBbUIsQ0FBQ1IsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLE1BQU07TUFDaEQsTUFBTVMsa0NBQWtDLEdBQUc1QixRQUFRLENBQUNDLGFBQWEsQ0FBQyxvQ0FBb0MsQ0FBQztNQUN2RyxJQUFJMkIsa0NBQWtDLElBQUlBLGtDQUFrQyxLQUFLRCxtQkFBbUIsRUFBRTtRQUNsR0Msa0NBQWtDLENBQUNiLFNBQVMsQ0FBQ2MsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUM3REQsa0NBQWtDLENBQUNFLGtCQUFrQixDQUFDbEIsS0FBSyxDQUFDbUIsU0FBUyxHQUFHLENBQUM7TUFDN0U7TUFDQUosbUJBQW1CLENBQUNaLFNBQVMsQ0FBQ2MsTUFBTSxDQUFDLFFBQVEsQ0FBQztNQUM5QyxNQUFNRyxpQkFBaUIsR0FBR0wsbUJBQW1CLENBQUNHLGtCQUFrQjtNQUNoRSxJQUFJSCxtQkFBbUIsQ0FBQ1osU0FBUyxDQUFDSyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUU7UUFDbERZLGlCQUFpQixDQUFDcEIsS0FBSyxDQUFDbUIsU0FBUyxHQUFHQyxpQkFBaUIsQ0FBQ0MsWUFBWSxHQUFHLElBQUk7TUFDN0UsQ0FBQyxNQUFNO1FBQ0hELGlCQUFpQixDQUFDcEIsS0FBSyxDQUFDbUIsU0FBUyxHQUFHLENBQUM7TUFDekM7SUFDSixDQUFDLENBQUM7RUFFTixDQUFDLENBQUM7QUFJRixDQUFDO0FBTUQsbURBQWVSLEdBQUc7O0FDOUJsQixNQUFNVyxNQUFNLEdBQUdBLENBQUEsS0FBTTtFQUNqQixNQUFNaEMsR0FBRyxHQUFHRixRQUFRLENBQUNDLGFBQWEsQ0FBQyxTQUFTLENBQUM7RUFDN0MsTUFBTWtDLFlBQVksR0FBR2pDLEdBQUcsQ0FBQ2tDLFNBQVM7RUFFbEMsU0FBU0MsWUFBWUEsQ0FBQSxFQUFHO0lBQ3BCLElBQUloQyxNQUFNLENBQUNDLFVBQVUsR0FBRyxHQUFHLEVBQUU7TUFDekIsSUFBSUQsTUFBTSxDQUFDaUMsT0FBTyxHQUFHSCxZQUFZLEVBQUU7UUFDL0JqQyxHQUFHLENBQUNhLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLFdBQVcsQ0FBQztNQUNsQyxDQUFDLE1BQU07UUFDSGQsR0FBRyxDQUFDYSxTQUFTLENBQUNHLE1BQU0sQ0FBQyxXQUFXLENBQUM7TUFDckM7SUFDSjtFQUNKO0VBQ0FiLE1BQU0sQ0FBQ2MsZ0JBQWdCLENBQUMsUUFBUSxFQUFFa0IsWUFBWSxDQUFDO0VBQy9DO0VBQ0FBLFlBQVksQ0FBQyxDQUFDO0FBQ2xCLENBQUM7QUFFRCxzREFBZUgsTUFBTTs7QUNsQkM7QUFDZ0M7QUFDSTtBQUNBO0FBQ2Q7QUFFTjtBQUNNO0FBRTVDN0IsTUFBTSxDQUFDYyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxNQUFNO0VBQzlDLElBQUk7SUFDQWUsaUJBQU0sQ0FBQyxDQUFDO0VBQ1osQ0FBQyxDQUFDLE1BQU0sQ0FBQztFQUNULElBQUk7SUFDQVgsY0FBRyxDQUFDLENBQUM7RUFDVCxDQUFDLENBQUMsTUFBTSxDQUFDO0VBQ1QsSUFBSTtJQUNBakQsc0JBQVcsQ0FBQyxDQUFDO0VBQ2pCLENBQUMsQ0FBQyxNQUFNLENBQUM7RUFDVCxJQUFJO0lBQ0FPLHdCQUFhLENBQUMsQ0FBQztFQUNuQixDQUFDLENBQUMsTUFBTSxDQUFDO0VBQ1QsSUFBSTtJQUNBaUIsd0JBQWEsQ0FBQyxDQUFDO0VBQ25CLENBQUMsQ0FBQyxNQUFNLENBQUM7RUFDVCxJQUFJO0lBQ0FDLGlCQUFNLENBQUMsQ0FBQztFQUNaLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFDYixDQUFDLENBQUMsQyIsInNvdXJjZXMiOlsid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL25vZGVfbW9kdWxlcy9zd2lwZXIvc2hhcmVkL3Nzci13aW5kb3cuZXNtLm1qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9ub2RlX21vZHVsZXMvc3dpcGVyL3NoYXJlZC91dGlscy5tanMiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlLy4vbm9kZV9tb2R1bGVzL3N3aXBlci9zaGFyZWQvc3dpcGVyLWNvcmUubWpzIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL25vZGVfbW9kdWxlcy9zd2lwZXIvbW9kdWxlcy92aXJ0dWFsLm1qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9ub2RlX21vZHVsZXMvc3dpcGVyL21vZHVsZXMva2V5Ym9hcmQubWpzIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL25vZGVfbW9kdWxlcy9zd2lwZXIvbW9kdWxlcy9tb3VzZXdoZWVsLm1qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9ub2RlX21vZHVsZXMvc3dpcGVyL3NoYXJlZC9jcmVhdGUtZWxlbWVudC1pZi1ub3QtZGVmaW5lZC5tanMiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlLy4vbm9kZV9tb2R1bGVzL3N3aXBlci9tb2R1bGVzL25hdmlnYXRpb24ubWpzIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL25vZGVfbW9kdWxlcy9zd2lwZXIvc2hhcmVkL2NsYXNzZXMtdG8tc2VsZWN0b3IubWpzIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL25vZGVfbW9kdWxlcy9zd2lwZXIvbW9kdWxlcy9wYWdpbmF0aW9uLm1qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9ub2RlX21vZHVsZXMvc3dpcGVyL21vZHVsZXMvc2Nyb2xsYmFyLm1qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9ub2RlX21vZHVsZXMvc3dpcGVyL21vZHVsZXMvcGFyYWxsYXgubWpzIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL25vZGVfbW9kdWxlcy9zd2lwZXIvbW9kdWxlcy96b29tLm1qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9ub2RlX21vZHVsZXMvc3dpcGVyL21vZHVsZXMvY29udHJvbGxlci5tanMiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlLy4vbm9kZV9tb2R1bGVzL3N3aXBlci9tb2R1bGVzL2ExMXkubWpzIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL25vZGVfbW9kdWxlcy9zd2lwZXIvbW9kdWxlcy9oaXN0b3J5Lm1qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9ub2RlX21vZHVsZXMvc3dpcGVyL21vZHVsZXMvaGFzaC1uYXZpZ2F0aW9uLm1qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9ub2RlX21vZHVsZXMvc3dpcGVyL21vZHVsZXMvYXV0b3BsYXkubWpzIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL25vZGVfbW9kdWxlcy9zd2lwZXIvbW9kdWxlcy90aHVtYnMubWpzIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL25vZGVfbW9kdWxlcy9zd2lwZXIvbW9kdWxlcy9mcmVlLW1vZGUubWpzIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL25vZGVfbW9kdWxlcy9zd2lwZXIvbW9kdWxlcy9ncmlkLm1qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9ub2RlX21vZHVsZXMvc3dpcGVyL21vZHVsZXMvbWFuaXB1bGF0aW9uLm1qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9ub2RlX21vZHVsZXMvc3dpcGVyL3NoYXJlZC9lZmZlY3QtaW5pdC5tanMiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlLy4vbm9kZV9tb2R1bGVzL3N3aXBlci9zaGFyZWQvZWZmZWN0LXRhcmdldC5tanMiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlLy4vbm9kZV9tb2R1bGVzL3N3aXBlci9zaGFyZWQvZWZmZWN0LXZpcnR1YWwtdHJhbnNpdGlvbi1lbmQubWpzIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL25vZGVfbW9kdWxlcy9zd2lwZXIvbW9kdWxlcy9lZmZlY3QtZmFkZS5tanMiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlLy4vbm9kZV9tb2R1bGVzL3N3aXBlci9tb2R1bGVzL2VmZmVjdC1jdWJlLm1qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9ub2RlX21vZHVsZXMvc3dpcGVyL3NoYXJlZC9jcmVhdGUtc2hhZG93Lm1qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9ub2RlX21vZHVsZXMvc3dpcGVyL21vZHVsZXMvZWZmZWN0LWZsaXAubWpzIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL25vZGVfbW9kdWxlcy9zd2lwZXIvbW9kdWxlcy9lZmZlY3QtY292ZXJmbG93Lm1qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9ub2RlX21vZHVsZXMvc3dpcGVyL21vZHVsZXMvZWZmZWN0LWNyZWF0aXZlLm1qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9ub2RlX21vZHVsZXMvc3dpcGVyL21vZHVsZXMvZWZmZWN0LWNhcmRzLm1qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9ub2RlX21vZHVsZXMvc3dpcGVyL3N3aXBlci1idW5kbGUubWpzIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL3NyYy9qcy9jb21wb25lbnRzL2Fib3V0U3dpcGVyLmpzIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL3NyYy9qcy9jb21wb25lbnRzL2FydGlzdHNTd2lwZXIuanMiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlLy4vc3JjL2pzL2NvbXBvbmVudHMvcmVsZWFzZVN3aXBlci5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9zcmMvanMvY29tcG9uZW50cy9idXJnZXIuanMiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlLy4vc3JjL2pzL2NvbXBvbmVudHMvZmFxLmpzIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL3NyYy9qcy9jb21wb25lbnRzL2hlYWRlci5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTU1IgV2luZG93IDQuMC4yXG4gKiBCZXR0ZXIgaGFuZGxpbmcgZm9yIHdpbmRvdyBvYmplY3QgaW4gU1NSIGVudmlyb25tZW50XG4gKiBodHRwczovL2dpdGh1Yi5jb20vbm9saW1pdHM0d2ViL3Nzci13aW5kb3dcbiAqXG4gKiBDb3B5cmlnaHQgMjAyMSwgVmxhZGltaXIgS2hhcmxhbXBpZGlcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciBNSVRcbiAqXG4gKiBSZWxlYXNlZCBvbjogRGVjZW1iZXIgMTMsIDIwMjFcbiAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tcGFyYW0tcmVhc3NpZ24gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KG9iaikge1xuICByZXR1cm4gb2JqICE9PSBudWxsICYmIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmICdjb25zdHJ1Y3RvcicgaW4gb2JqICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0O1xufVxuZnVuY3Rpb24gZXh0ZW5kKHRhcmdldCwgc3JjKSB7XG4gIGlmICh0YXJnZXQgPT09IHZvaWQgMCkge1xuICAgIHRhcmdldCA9IHt9O1xuICB9XG4gIGlmIChzcmMgPT09IHZvaWQgMCkge1xuICAgIHNyYyA9IHt9O1xuICB9XG4gIE9iamVjdC5rZXlzKHNyYykuZm9yRWFjaChrZXkgPT4ge1xuICAgIGlmICh0eXBlb2YgdGFyZ2V0W2tleV0gPT09ICd1bmRlZmluZWQnKSB0YXJnZXRba2V5XSA9IHNyY1trZXldO2Vsc2UgaWYgKGlzT2JqZWN0KHNyY1trZXldKSAmJiBpc09iamVjdCh0YXJnZXRba2V5XSkgJiYgT2JqZWN0LmtleXMoc3JjW2tleV0pLmxlbmd0aCA+IDApIHtcbiAgICAgIGV4dGVuZCh0YXJnZXRba2V5XSwgc3JjW2tleV0pO1xuICAgIH1cbiAgfSk7XG59XG5jb25zdCBzc3JEb2N1bWVudCA9IHtcbiAgYm9keToge30sXG4gIGFkZEV2ZW50TGlzdGVuZXIoKSB7fSxcbiAgcmVtb3ZlRXZlbnRMaXN0ZW5lcigpIHt9LFxuICBhY3RpdmVFbGVtZW50OiB7XG4gICAgYmx1cigpIHt9LFxuICAgIG5vZGVOYW1lOiAnJ1xuICB9LFxuICBxdWVyeVNlbGVjdG9yKCkge1xuICAgIHJldHVybiBudWxsO1xuICB9LFxuICBxdWVyeVNlbGVjdG9yQWxsKCkge1xuICAgIHJldHVybiBbXTtcbiAgfSxcbiAgZ2V0RWxlbWVudEJ5SWQoKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH0sXG4gIGNyZWF0ZUV2ZW50KCkge1xuICAgIHJldHVybiB7XG4gICAgICBpbml0RXZlbnQoKSB7fVxuICAgIH07XG4gIH0sXG4gIGNyZWF0ZUVsZW1lbnQoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNoaWxkcmVuOiBbXSxcbiAgICAgIGNoaWxkTm9kZXM6IFtdLFxuICAgICAgc3R5bGU6IHt9LFxuICAgICAgc2V0QXR0cmlidXRlKCkge30sXG4gICAgICBnZXRFbGVtZW50c0J5VGFnTmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfVxuICAgIH07XG4gIH0sXG4gIGNyZWF0ZUVsZW1lbnROUygpIHtcbiAgICByZXR1cm4ge307XG4gIH0sXG4gIGltcG9ydE5vZGUoKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH0sXG4gIGxvY2F0aW9uOiB7XG4gICAgaGFzaDogJycsXG4gICAgaG9zdDogJycsXG4gICAgaG9zdG5hbWU6ICcnLFxuICAgIGhyZWY6ICcnLFxuICAgIG9yaWdpbjogJycsXG4gICAgcGF0aG5hbWU6ICcnLFxuICAgIHByb3RvY29sOiAnJyxcbiAgICBzZWFyY2g6ICcnXG4gIH1cbn07XG5mdW5jdGlvbiBnZXREb2N1bWVudCgpIHtcbiAgY29uc3QgZG9jID0gdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyA/IGRvY3VtZW50IDoge307XG4gIGV4dGVuZChkb2MsIHNzckRvY3VtZW50KTtcbiAgcmV0dXJuIGRvYztcbn1cbmNvbnN0IHNzcldpbmRvdyA9IHtcbiAgZG9jdW1lbnQ6IHNzckRvY3VtZW50LFxuICBuYXZpZ2F0b3I6IHtcbiAgICB1c2VyQWdlbnQ6ICcnXG4gIH0sXG4gIGxvY2F0aW9uOiB7XG4gICAgaGFzaDogJycsXG4gICAgaG9zdDogJycsXG4gICAgaG9zdG5hbWU6ICcnLFxuICAgIGhyZWY6ICcnLFxuICAgIG9yaWdpbjogJycsXG4gICAgcGF0aG5hbWU6ICcnLFxuICAgIHByb3RvY29sOiAnJyxcbiAgICBzZWFyY2g6ICcnXG4gIH0sXG4gIGhpc3Rvcnk6IHtcbiAgICByZXBsYWNlU3RhdGUoKSB7fSxcbiAgICBwdXNoU3RhdGUoKSB7fSxcbiAgICBnbygpIHt9LFxuICAgIGJhY2soKSB7fVxuICB9LFxuICBDdXN0b21FdmVudDogZnVuY3Rpb24gQ3VzdG9tRXZlbnQoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIGFkZEV2ZW50TGlzdGVuZXIoKSB7fSxcbiAgcmVtb3ZlRXZlbnRMaXN0ZW5lcigpIHt9LFxuICBnZXRDb21wdXRlZFN0eWxlKCkge1xuICAgIHJldHVybiB7XG4gICAgICBnZXRQcm9wZXJ0eVZhbHVlKCkge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgICB9XG4gICAgfTtcbiAgfSxcbiAgSW1hZ2UoKSB7fSxcbiAgRGF0ZSgpIHt9LFxuICBzY3JlZW46IHt9LFxuICBzZXRUaW1lb3V0KCkge30sXG4gIGNsZWFyVGltZW91dCgpIHt9LFxuICBtYXRjaE1lZGlhKCkge1xuICAgIHJldHVybiB7fTtcbiAgfSxcbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGNhbGxiYWNrKSB7XG4gICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgY2FsbGJhY2soKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gc2V0VGltZW91dChjYWxsYmFjaywgMCk7XG4gIH0sXG4gIGNhbmNlbEFuaW1hdGlvbkZyYW1lKGlkKSB7XG4gICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjbGVhclRpbWVvdXQoaWQpO1xuICB9XG59O1xuZnVuY3Rpb24gZ2V0V2luZG93KCkge1xuICBjb25zdCB3aW4gPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6IHt9O1xuICBleHRlbmQod2luLCBzc3JXaW5kb3cpO1xuICByZXR1cm4gd2luO1xufVxuXG5leHBvcnQgeyBnZXRXaW5kb3cgYXMgYSwgZ2V0RG9jdW1lbnQgYXMgZyB9O1xuIiwiaW1wb3J0IHsgYSBhcyBnZXRXaW5kb3csIGcgYXMgZ2V0RG9jdW1lbnQgfSBmcm9tICcuL3Nzci13aW5kb3cuZXNtLm1qcyc7XG5cbmZ1bmN0aW9uIGNsYXNzZXNUb1Rva2VucyhjbGFzc2VzKSB7XG4gIGlmIChjbGFzc2VzID09PSB2b2lkIDApIHtcbiAgICBjbGFzc2VzID0gJyc7XG4gIH1cbiAgcmV0dXJuIGNsYXNzZXMudHJpbSgpLnNwbGl0KCcgJykuZmlsdGVyKGMgPT4gISFjLnRyaW0oKSk7XG59XG5cbmZ1bmN0aW9uIGRlbGV0ZVByb3BzKG9iaikge1xuICBjb25zdCBvYmplY3QgPSBvYmo7XG4gIE9iamVjdC5rZXlzKG9iamVjdCkuZm9yRWFjaChrZXkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBvYmplY3Rba2V5XSA9IG51bGw7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gbm8gZ2V0dGVyIGZvciBvYmplY3RcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGRlbGV0ZSBvYmplY3Rba2V5XTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyBzb21ldGhpbmcgZ290IHdyb25nXG4gICAgfVxuICB9KTtcbn1cbmZ1bmN0aW9uIG5leHRUaWNrKGNhbGxiYWNrLCBkZWxheSkge1xuICBpZiAoZGVsYXkgPT09IHZvaWQgMCkge1xuICAgIGRlbGF5ID0gMDtcbiAgfVxuICByZXR1cm4gc2V0VGltZW91dChjYWxsYmFjaywgZGVsYXkpO1xufVxuZnVuY3Rpb24gbm93KCkge1xuICByZXR1cm4gRGF0ZS5ub3coKTtcbn1cbmZ1bmN0aW9uIGdldENvbXB1dGVkU3R5bGUoZWwpIHtcbiAgY29uc3Qgd2luZG93ID0gZ2V0V2luZG93KCk7XG4gIGxldCBzdHlsZTtcbiAgaWYgKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKSB7XG4gICAgc3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCwgbnVsbCk7XG4gIH1cbiAgaWYgKCFzdHlsZSAmJiBlbC5jdXJyZW50U3R5bGUpIHtcbiAgICBzdHlsZSA9IGVsLmN1cnJlbnRTdHlsZTtcbiAgfVxuICBpZiAoIXN0eWxlKSB7XG4gICAgc3R5bGUgPSBlbC5zdHlsZTtcbiAgfVxuICByZXR1cm4gc3R5bGU7XG59XG5mdW5jdGlvbiBnZXRUcmFuc2xhdGUoZWwsIGF4aXMpIHtcbiAgaWYgKGF4aXMgPT09IHZvaWQgMCkge1xuICAgIGF4aXMgPSAneCc7XG4gIH1cbiAgY29uc3Qgd2luZG93ID0gZ2V0V2luZG93KCk7XG4gIGxldCBtYXRyaXg7XG4gIGxldCBjdXJUcmFuc2Zvcm07XG4gIGxldCB0cmFuc2Zvcm1NYXRyaXg7XG4gIGNvbnN0IGN1clN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG4gIGlmICh3aW5kb3cuV2ViS2l0Q1NTTWF0cml4KSB7XG4gICAgY3VyVHJhbnNmb3JtID0gY3VyU3R5bGUudHJhbnNmb3JtIHx8IGN1clN0eWxlLndlYmtpdFRyYW5zZm9ybTtcbiAgICBpZiAoY3VyVHJhbnNmb3JtLnNwbGl0KCcsJykubGVuZ3RoID4gNikge1xuICAgICAgY3VyVHJhbnNmb3JtID0gY3VyVHJhbnNmb3JtLnNwbGl0KCcsICcpLm1hcChhID0+IGEucmVwbGFjZSgnLCcsICcuJykpLmpvaW4oJywgJyk7XG4gICAgfVxuICAgIC8vIFNvbWUgb2xkIHZlcnNpb25zIG9mIFdlYmtpdCBjaG9rZSB3aGVuICdub25lJyBpcyBwYXNzZWQ7IHBhc3NcbiAgICAvLyBlbXB0eSBzdHJpbmcgaW5zdGVhZCBpbiB0aGlzIGNhc2VcbiAgICB0cmFuc2Zvcm1NYXRyaXggPSBuZXcgd2luZG93LldlYktpdENTU01hdHJpeChjdXJUcmFuc2Zvcm0gPT09ICdub25lJyA/ICcnIDogY3VyVHJhbnNmb3JtKTtcbiAgfSBlbHNlIHtcbiAgICB0cmFuc2Zvcm1NYXRyaXggPSBjdXJTdHlsZS5Nb3pUcmFuc2Zvcm0gfHwgY3VyU3R5bGUuT1RyYW5zZm9ybSB8fCBjdXJTdHlsZS5Nc1RyYW5zZm9ybSB8fCBjdXJTdHlsZS5tc1RyYW5zZm9ybSB8fCBjdXJTdHlsZS50cmFuc2Zvcm0gfHwgY3VyU3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgndHJhbnNmb3JtJykucmVwbGFjZSgndHJhbnNsYXRlKCcsICdtYXRyaXgoMSwgMCwgMCwgMSwnKTtcbiAgICBtYXRyaXggPSB0cmFuc2Zvcm1NYXRyaXgudG9TdHJpbmcoKS5zcGxpdCgnLCcpO1xuICB9XG4gIGlmIChheGlzID09PSAneCcpIHtcbiAgICAvLyBMYXRlc3QgQ2hyb21lIGFuZCB3ZWJraXRzIEZpeFxuICAgIGlmICh3aW5kb3cuV2ViS2l0Q1NTTWF0cml4KSBjdXJUcmFuc2Zvcm0gPSB0cmFuc2Zvcm1NYXRyaXgubTQxO1xuICAgIC8vIENyYXp5IElFMTAgTWF0cml4XG4gICAgZWxzZSBpZiAobWF0cml4Lmxlbmd0aCA9PT0gMTYpIGN1clRyYW5zZm9ybSA9IHBhcnNlRmxvYXQobWF0cml4WzEyXSk7XG4gICAgLy8gTm9ybWFsIEJyb3dzZXJzXG4gICAgZWxzZSBjdXJUcmFuc2Zvcm0gPSBwYXJzZUZsb2F0KG1hdHJpeFs0XSk7XG4gIH1cbiAgaWYgKGF4aXMgPT09ICd5Jykge1xuICAgIC8vIExhdGVzdCBDaHJvbWUgYW5kIHdlYmtpdHMgRml4XG4gICAgaWYgKHdpbmRvdy5XZWJLaXRDU1NNYXRyaXgpIGN1clRyYW5zZm9ybSA9IHRyYW5zZm9ybU1hdHJpeC5tNDI7XG4gICAgLy8gQ3JhenkgSUUxMCBNYXRyaXhcbiAgICBlbHNlIGlmIChtYXRyaXgubGVuZ3RoID09PSAxNikgY3VyVHJhbnNmb3JtID0gcGFyc2VGbG9hdChtYXRyaXhbMTNdKTtcbiAgICAvLyBOb3JtYWwgQnJvd3NlcnNcbiAgICBlbHNlIGN1clRyYW5zZm9ybSA9IHBhcnNlRmxvYXQobWF0cml4WzVdKTtcbiAgfVxuICByZXR1cm4gY3VyVHJhbnNmb3JtIHx8IDA7XG59XG5mdW5jdGlvbiBpc09iamVjdChvKSB7XG4gIHJldHVybiB0eXBlb2YgbyA9PT0gJ29iamVjdCcgJiYgbyAhPT0gbnVsbCAmJiBvLmNvbnN0cnVjdG9yICYmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKS5zbGljZSg4LCAtMSkgPT09ICdPYmplY3QnO1xufVxuZnVuY3Rpb24gaXNOb2RlKG5vZGUpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2Ygd2luZG93LkhUTUxFbGVtZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBub2RlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQ7XG4gIH1cbiAgcmV0dXJuIG5vZGUgJiYgKG5vZGUubm9kZVR5cGUgPT09IDEgfHwgbm9kZS5ub2RlVHlwZSA9PT0gMTEpO1xufVxuZnVuY3Rpb24gZXh0ZW5kKCkge1xuICBjb25zdCB0byA9IE9iamVjdChhcmd1bWVudHMubGVuZ3RoIDw9IDAgPyB1bmRlZmluZWQgOiBhcmd1bWVudHNbMF0pO1xuICBjb25zdCBub0V4dGVuZCA9IFsnX19wcm90b19fJywgJ2NvbnN0cnVjdG9yJywgJ3Byb3RvdHlwZSddO1xuICBmb3IgKGxldCBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgIGNvbnN0IG5leHRTb3VyY2UgPSBpIDwgMCB8fCBhcmd1bWVudHMubGVuZ3RoIDw9IGkgPyB1bmRlZmluZWQgOiBhcmd1bWVudHNbaV07XG4gICAgaWYgKG5leHRTb3VyY2UgIT09IHVuZGVmaW5lZCAmJiBuZXh0U291cmNlICE9PSBudWxsICYmICFpc05vZGUobmV4dFNvdXJjZSkpIHtcbiAgICAgIGNvbnN0IGtleXNBcnJheSA9IE9iamVjdC5rZXlzKE9iamVjdChuZXh0U291cmNlKSkuZmlsdGVyKGtleSA9PiBub0V4dGVuZC5pbmRleE9mKGtleSkgPCAwKTtcbiAgICAgIGZvciAobGV0IG5leHRJbmRleCA9IDAsIGxlbiA9IGtleXNBcnJheS5sZW5ndGg7IG5leHRJbmRleCA8IGxlbjsgbmV4dEluZGV4ICs9IDEpIHtcbiAgICAgICAgY29uc3QgbmV4dEtleSA9IGtleXNBcnJheVtuZXh0SW5kZXhdO1xuICAgICAgICBjb25zdCBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihuZXh0U291cmNlLCBuZXh0S2V5KTtcbiAgICAgICAgaWYgKGRlc2MgIT09IHVuZGVmaW5lZCAmJiBkZXNjLmVudW1lcmFibGUpIHtcbiAgICAgICAgICBpZiAoaXNPYmplY3QodG9bbmV4dEtleV0pICYmIGlzT2JqZWN0KG5leHRTb3VyY2VbbmV4dEtleV0pKSB7XG4gICAgICAgICAgICBpZiAobmV4dFNvdXJjZVtuZXh0S2V5XS5fX3N3aXBlcl9fKSB7XG4gICAgICAgICAgICAgIHRvW25leHRLZXldID0gbmV4dFNvdXJjZVtuZXh0S2V5XTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGV4dGVuZCh0b1tuZXh0S2V5XSwgbmV4dFNvdXJjZVtuZXh0S2V5XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmICghaXNPYmplY3QodG9bbmV4dEtleV0pICYmIGlzT2JqZWN0KG5leHRTb3VyY2VbbmV4dEtleV0pKSB7XG4gICAgICAgICAgICB0b1tuZXh0S2V5XSA9IHt9O1xuICAgICAgICAgICAgaWYgKG5leHRTb3VyY2VbbmV4dEtleV0uX19zd2lwZXJfXykge1xuICAgICAgICAgICAgICB0b1tuZXh0S2V5XSA9IG5leHRTb3VyY2VbbmV4dEtleV07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBleHRlbmQodG9bbmV4dEtleV0sIG5leHRTb3VyY2VbbmV4dEtleV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0b1tuZXh0S2V5XSA9IG5leHRTb3VyY2VbbmV4dEtleV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB0bztcbn1cbmZ1bmN0aW9uIHNldENTU1Byb3BlcnR5KGVsLCB2YXJOYW1lLCB2YXJWYWx1ZSkge1xuICBlbC5zdHlsZS5zZXRQcm9wZXJ0eSh2YXJOYW1lLCB2YXJWYWx1ZSk7XG59XG5mdW5jdGlvbiBhbmltYXRlQ1NTTW9kZVNjcm9sbChfcmVmKSB7XG4gIGxldCB7XG4gICAgc3dpcGVyLFxuICAgIHRhcmdldFBvc2l0aW9uLFxuICAgIHNpZGVcbiAgfSA9IF9yZWY7XG4gIGNvbnN0IHdpbmRvdyA9IGdldFdpbmRvdygpO1xuICBjb25zdCBzdGFydFBvc2l0aW9uID0gLXN3aXBlci50cmFuc2xhdGU7XG4gIGxldCBzdGFydFRpbWUgPSBudWxsO1xuICBsZXQgdGltZTtcbiAgY29uc3QgZHVyYXRpb24gPSBzd2lwZXIucGFyYW1zLnNwZWVkO1xuICBzd2lwZXIud3JhcHBlckVsLnN0eWxlLnNjcm9sbFNuYXBUeXBlID0gJ25vbmUnO1xuICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUoc3dpcGVyLmNzc01vZGVGcmFtZUlEKTtcbiAgY29uc3QgZGlyID0gdGFyZ2V0UG9zaXRpb24gPiBzdGFydFBvc2l0aW9uID8gJ25leHQnIDogJ3ByZXYnO1xuICBjb25zdCBpc091dE9mQm91bmQgPSAoY3VycmVudCwgdGFyZ2V0KSA9PiB7XG4gICAgcmV0dXJuIGRpciA9PT0gJ25leHQnICYmIGN1cnJlbnQgPj0gdGFyZ2V0IHx8IGRpciA9PT0gJ3ByZXYnICYmIGN1cnJlbnQgPD0gdGFyZ2V0O1xuICB9O1xuICBjb25zdCBhbmltYXRlID0gKCkgPT4ge1xuICAgIHRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICBpZiAoc3RhcnRUaW1lID09PSBudWxsKSB7XG4gICAgICBzdGFydFRpbWUgPSB0aW1lO1xuICAgIH1cbiAgICBjb25zdCBwcm9ncmVzcyA9IE1hdGgubWF4KE1hdGgubWluKCh0aW1lIC0gc3RhcnRUaW1lKSAvIGR1cmF0aW9uLCAxKSwgMCk7XG4gICAgY29uc3QgZWFzZVByb2dyZXNzID0gMC41IC0gTWF0aC5jb3MocHJvZ3Jlc3MgKiBNYXRoLlBJKSAvIDI7XG4gICAgbGV0IGN1cnJlbnRQb3NpdGlvbiA9IHN0YXJ0UG9zaXRpb24gKyBlYXNlUHJvZ3Jlc3MgKiAodGFyZ2V0UG9zaXRpb24gLSBzdGFydFBvc2l0aW9uKTtcbiAgICBpZiAoaXNPdXRPZkJvdW5kKGN1cnJlbnRQb3NpdGlvbiwgdGFyZ2V0UG9zaXRpb24pKSB7XG4gICAgICBjdXJyZW50UG9zaXRpb24gPSB0YXJnZXRQb3NpdGlvbjtcbiAgICB9XG4gICAgc3dpcGVyLndyYXBwZXJFbC5zY3JvbGxUbyh7XG4gICAgICBbc2lkZV06IGN1cnJlbnRQb3NpdGlvblxuICAgIH0pO1xuICAgIGlmIChpc091dE9mQm91bmQoY3VycmVudFBvc2l0aW9uLCB0YXJnZXRQb3NpdGlvbikpIHtcbiAgICAgIHN3aXBlci53cmFwcGVyRWwuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcbiAgICAgIHN3aXBlci53cmFwcGVyRWwuc3R5bGUuc2Nyb2xsU25hcFR5cGUgPSAnJztcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBzd2lwZXIud3JhcHBlckVsLnN0eWxlLm92ZXJmbG93ID0gJyc7XG4gICAgICAgIHN3aXBlci53cmFwcGVyRWwuc2Nyb2xsVG8oe1xuICAgICAgICAgIFtzaWRlXTogY3VycmVudFBvc2l0aW9uXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUoc3dpcGVyLmNzc01vZGVGcmFtZUlEKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc3dpcGVyLmNzc01vZGVGcmFtZUlEID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKTtcbiAgfTtcbiAgYW5pbWF0ZSgpO1xufVxuZnVuY3Rpb24gZ2V0U2xpZGVUcmFuc2Zvcm1FbChzbGlkZUVsKSB7XG4gIHJldHVybiBzbGlkZUVsLnF1ZXJ5U2VsZWN0b3IoJy5zd2lwZXItc2xpZGUtdHJhbnNmb3JtJykgfHwgc2xpZGVFbC5zaGFkb3dSb290ICYmIHNsaWRlRWwuc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yKCcuc3dpcGVyLXNsaWRlLXRyYW5zZm9ybScpIHx8IHNsaWRlRWw7XG59XG5mdW5jdGlvbiBlbGVtZW50Q2hpbGRyZW4oZWxlbWVudCwgc2VsZWN0b3IpIHtcbiAgaWYgKHNlbGVjdG9yID09PSB2b2lkIDApIHtcbiAgICBzZWxlY3RvciA9ICcnO1xuICB9XG4gIHJldHVybiBbLi4uZWxlbWVudC5jaGlsZHJlbl0uZmlsdGVyKGVsID0+IGVsLm1hdGNoZXMoc2VsZWN0b3IpKTtcbn1cbmZ1bmN0aW9uIHNob3dXYXJuaW5nKHRleHQpIHtcbiAgdHJ5IHtcbiAgICBjb25zb2xlLndhcm4odGV4dCk7XG4gICAgcmV0dXJuO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICAvLyBlcnJcbiAgfVxufVxuZnVuY3Rpb24gY3JlYXRlRWxlbWVudCh0YWcsIGNsYXNzZXMpIHtcbiAgaWYgKGNsYXNzZXMgPT09IHZvaWQgMCkge1xuICAgIGNsYXNzZXMgPSBbXTtcbiAgfVxuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKTtcbiAgZWwuY2xhc3NMaXN0LmFkZCguLi4oQXJyYXkuaXNBcnJheShjbGFzc2VzKSA/IGNsYXNzZXMgOiBjbGFzc2VzVG9Ub2tlbnMoY2xhc3NlcykpKTtcbiAgcmV0dXJuIGVsO1xufVxuZnVuY3Rpb24gZWxlbWVudE9mZnNldChlbCkge1xuICBjb25zdCB3aW5kb3cgPSBnZXRXaW5kb3coKTtcbiAgY29uc3QgZG9jdW1lbnQgPSBnZXREb2N1bWVudCgpO1xuICBjb25zdCBib3ggPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgY29uc3QgYm9keSA9IGRvY3VtZW50LmJvZHk7XG4gIGNvbnN0IGNsaWVudFRvcCA9IGVsLmNsaWVudFRvcCB8fCBib2R5LmNsaWVudFRvcCB8fCAwO1xuICBjb25zdCBjbGllbnRMZWZ0ID0gZWwuY2xpZW50TGVmdCB8fCBib2R5LmNsaWVudExlZnQgfHwgMDtcbiAgY29uc3Qgc2Nyb2xsVG9wID0gZWwgPT09IHdpbmRvdyA/IHdpbmRvdy5zY3JvbGxZIDogZWwuc2Nyb2xsVG9wO1xuICBjb25zdCBzY3JvbGxMZWZ0ID0gZWwgPT09IHdpbmRvdyA/IHdpbmRvdy5zY3JvbGxYIDogZWwuc2Nyb2xsTGVmdDtcbiAgcmV0dXJuIHtcbiAgICB0b3A6IGJveC50b3AgKyBzY3JvbGxUb3AgLSBjbGllbnRUb3AsXG4gICAgbGVmdDogYm94LmxlZnQgKyBzY3JvbGxMZWZ0IC0gY2xpZW50TGVmdFxuICB9O1xufVxuZnVuY3Rpb24gZWxlbWVudFByZXZBbGwoZWwsIHNlbGVjdG9yKSB7XG4gIGNvbnN0IHByZXZFbHMgPSBbXTtcbiAgd2hpbGUgKGVsLnByZXZpb3VzRWxlbWVudFNpYmxpbmcpIHtcbiAgICBjb25zdCBwcmV2ID0gZWwucHJldmlvdXNFbGVtZW50U2libGluZzsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgIGlmIChzZWxlY3Rvcikge1xuICAgICAgaWYgKHByZXYubWF0Y2hlcyhzZWxlY3RvcikpIHByZXZFbHMucHVzaChwcmV2KTtcbiAgICB9IGVsc2UgcHJldkVscy5wdXNoKHByZXYpO1xuICAgIGVsID0gcHJldjtcbiAgfVxuICByZXR1cm4gcHJldkVscztcbn1cbmZ1bmN0aW9uIGVsZW1lbnROZXh0QWxsKGVsLCBzZWxlY3Rvcikge1xuICBjb25zdCBuZXh0RWxzID0gW107XG4gIHdoaWxlIChlbC5uZXh0RWxlbWVudFNpYmxpbmcpIHtcbiAgICBjb25zdCBuZXh0ID0gZWwubmV4dEVsZW1lbnRTaWJsaW5nOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgaWYgKHNlbGVjdG9yKSB7XG4gICAgICBpZiAobmV4dC5tYXRjaGVzKHNlbGVjdG9yKSkgbmV4dEVscy5wdXNoKG5leHQpO1xuICAgIH0gZWxzZSBuZXh0RWxzLnB1c2gobmV4dCk7XG4gICAgZWwgPSBuZXh0O1xuICB9XG4gIHJldHVybiBuZXh0RWxzO1xufVxuZnVuY3Rpb24gZWxlbWVudFN0eWxlKGVsLCBwcm9wKSB7XG4gIGNvbnN0IHdpbmRvdyA9IGdldFdpbmRvdygpO1xuICByZXR1cm4gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwsIG51bGwpLmdldFByb3BlcnR5VmFsdWUocHJvcCk7XG59XG5mdW5jdGlvbiBlbGVtZW50SW5kZXgoZWwpIHtcbiAgbGV0IGNoaWxkID0gZWw7XG4gIGxldCBpO1xuICBpZiAoY2hpbGQpIHtcbiAgICBpID0gMDtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICB3aGlsZSAoKGNoaWxkID0gY2hpbGQucHJldmlvdXNTaWJsaW5nKSAhPT0gbnVsbCkge1xuICAgICAgaWYgKGNoaWxkLm5vZGVUeXBlID09PSAxKSBpICs9IDE7XG4gICAgfVxuICAgIHJldHVybiBpO1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5mdW5jdGlvbiBlbGVtZW50UGFyZW50cyhlbCwgc2VsZWN0b3IpIHtcbiAgY29uc3QgcGFyZW50cyA9IFtdOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIGxldCBwYXJlbnQgPSBlbC5wYXJlbnRFbGVtZW50OyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIHdoaWxlIChwYXJlbnQpIHtcbiAgICBpZiAoc2VsZWN0b3IpIHtcbiAgICAgIGlmIChwYXJlbnQubWF0Y2hlcyhzZWxlY3RvcikpIHBhcmVudHMucHVzaChwYXJlbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJlbnRzLnB1c2gocGFyZW50KTtcbiAgICB9XG4gICAgcGFyZW50ID0gcGFyZW50LnBhcmVudEVsZW1lbnQ7XG4gIH1cbiAgcmV0dXJuIHBhcmVudHM7XG59XG5mdW5jdGlvbiBlbGVtZW50VHJhbnNpdGlvbkVuZChlbCwgY2FsbGJhY2spIHtcbiAgZnVuY3Rpb24gZmlyZUNhbGxCYWNrKGUpIHtcbiAgICBpZiAoZS50YXJnZXQgIT09IGVsKSByZXR1cm47XG4gICAgY2FsbGJhY2suY2FsbChlbCwgZSk7XG4gICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIGZpcmVDYWxsQmFjayk7XG4gIH1cbiAgaWYgKGNhbGxiYWNrKSB7XG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIGZpcmVDYWxsQmFjayk7XG4gIH1cbn1cbmZ1bmN0aW9uIGVsZW1lbnRPdXRlclNpemUoZWwsIHNpemUsIGluY2x1ZGVNYXJnaW5zKSB7XG4gIGNvbnN0IHdpbmRvdyA9IGdldFdpbmRvdygpO1xuICBpZiAoaW5jbHVkZU1hcmdpbnMpIHtcbiAgICByZXR1cm4gZWxbc2l6ZSA9PT0gJ3dpZHRoJyA/ICdvZmZzZXRXaWR0aCcgOiAnb2Zmc2V0SGVpZ2h0J10gKyBwYXJzZUZsb2F0KHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsLCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKHNpemUgPT09ICd3aWR0aCcgPyAnbWFyZ2luLXJpZ2h0JyA6ICdtYXJnaW4tdG9wJykpICsgcGFyc2VGbG9hdCh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZShzaXplID09PSAnd2lkdGgnID8gJ21hcmdpbi1sZWZ0JyA6ICdtYXJnaW4tYm90dG9tJykpO1xuICB9XG4gIHJldHVybiBlbC5vZmZzZXRXaWR0aDtcbn1cblxuZXhwb3J0IHsgZWxlbWVudFBhcmVudHMgYXMgYSwgZWxlbWVudE9mZnNldCBhcyBiLCBjcmVhdGVFbGVtZW50IGFzIGMsIG5vdyBhcyBkLCBlbGVtZW50Q2hpbGRyZW4gYXMgZSwgZWxlbWVudE91dGVyU2l6ZSBhcyBmLCBlbGVtZW50SW5kZXggYXMgZywgY2xhc3Nlc1RvVG9rZW5zIGFzIGgsIGdldFRyYW5zbGF0ZSBhcyBpLCBlbGVtZW50VHJhbnNpdGlvbkVuZCBhcyBqLCBpc09iamVjdCBhcyBrLCBnZXRTbGlkZVRyYW5zZm9ybUVsIGFzIGwsIGVsZW1lbnRTdHlsZSBhcyBtLCBuZXh0VGljayBhcyBuLCBlbGVtZW50TmV4dEFsbCBhcyBvLCBlbGVtZW50UHJldkFsbCBhcyBwLCBhbmltYXRlQ1NTTW9kZVNjcm9sbCBhcyBxLCBzaG93V2FybmluZyBhcyByLCBzZXRDU1NQcm9wZXJ0eSBhcyBzLCBleHRlbmQgYXMgdCwgZGVsZXRlUHJvcHMgYXMgdSB9O1xuIiwiaW1wb3J0IHsgYSBhcyBnZXRXaW5kb3csIGcgYXMgZ2V0RG9jdW1lbnQgfSBmcm9tICcuL3Nzci13aW5kb3cuZXNtLm1qcyc7XG5pbXBvcnQgeyBhIGFzIGVsZW1lbnRQYXJlbnRzLCBtIGFzIGVsZW1lbnRTdHlsZSwgZSBhcyBlbGVtZW50Q2hpbGRyZW4sIHMgYXMgc2V0Q1NTUHJvcGVydHksIGYgYXMgZWxlbWVudE91dGVyU2l6ZSwgbyBhcyBlbGVtZW50TmV4dEFsbCwgcCBhcyBlbGVtZW50UHJldkFsbCwgaSBhcyBnZXRUcmFuc2xhdGUsIHEgYXMgYW5pbWF0ZUNTU01vZGVTY3JvbGwsIG4gYXMgbmV4dFRpY2ssIHIgYXMgc2hvd1dhcm5pbmcsIGMgYXMgY3JlYXRlRWxlbWVudCwgZCBhcyBub3csIHQgYXMgZXh0ZW5kLCBnIGFzIGVsZW1lbnRJbmRleCwgdSBhcyBkZWxldGVQcm9wcyB9IGZyb20gJy4vdXRpbHMubWpzJztcblxubGV0IHN1cHBvcnQ7XG5mdW5jdGlvbiBjYWxjU3VwcG9ydCgpIHtcbiAgY29uc3Qgd2luZG93ID0gZ2V0V2luZG93KCk7XG4gIGNvbnN0IGRvY3VtZW50ID0gZ2V0RG9jdW1lbnQoKTtcbiAgcmV0dXJuIHtcbiAgICBzbW9vdGhTY3JvbGw6IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUgJiYgJ3Njcm9sbEJlaGF2aW9yJyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUsXG4gICAgdG91Y2g6ICEhKCdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdyB8fCB3aW5kb3cuRG9jdW1lbnRUb3VjaCAmJiBkb2N1bWVudCBpbnN0YW5jZW9mIHdpbmRvdy5Eb2N1bWVudFRvdWNoKVxuICB9O1xufVxuZnVuY3Rpb24gZ2V0U3VwcG9ydCgpIHtcbiAgaWYgKCFzdXBwb3J0KSB7XG4gICAgc3VwcG9ydCA9IGNhbGNTdXBwb3J0KCk7XG4gIH1cbiAgcmV0dXJuIHN1cHBvcnQ7XG59XG5cbmxldCBkZXZpY2VDYWNoZWQ7XG5mdW5jdGlvbiBjYWxjRGV2aWNlKF90ZW1wKSB7XG4gIGxldCB7XG4gICAgdXNlckFnZW50XG4gIH0gPSBfdGVtcCA9PT0gdm9pZCAwID8ge30gOiBfdGVtcDtcbiAgY29uc3Qgc3VwcG9ydCA9IGdldFN1cHBvcnQoKTtcbiAgY29uc3Qgd2luZG93ID0gZ2V0V2luZG93KCk7XG4gIGNvbnN0IHBsYXRmb3JtID0gd2luZG93Lm5hdmlnYXRvci5wbGF0Zm9ybTtcbiAgY29uc3QgdWEgPSB1c2VyQWdlbnQgfHwgd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQ7XG4gIGNvbnN0IGRldmljZSA9IHtcbiAgICBpb3M6IGZhbHNlLFxuICAgIGFuZHJvaWQ6IGZhbHNlXG4gIH07XG4gIGNvbnN0IHNjcmVlbldpZHRoID0gd2luZG93LnNjcmVlbi53aWR0aDtcbiAgY29uc3Qgc2NyZWVuSGVpZ2h0ID0gd2luZG93LnNjcmVlbi5oZWlnaHQ7XG4gIGNvbnN0IGFuZHJvaWQgPSB1YS5tYXRjaCgvKEFuZHJvaWQpOz9bXFxzXFwvXSsoW1xcZC5dKyk/Lyk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgbGV0IGlwYWQgPSB1YS5tYXRjaCgvKGlQYWQpLipPU1xccyhbXFxkX10rKS8pO1xuICBjb25zdCBpcG9kID0gdWEubWF0Y2goLyhpUG9kKSguKk9TXFxzKFtcXGRfXSspKT8vKTtcbiAgY29uc3QgaXBob25lID0gIWlwYWQgJiYgdWEubWF0Y2goLyhpUGhvbmVcXHNPU3xpT1MpXFxzKFtcXGRfXSspLyk7XG4gIGNvbnN0IHdpbmRvd3MgPSBwbGF0Zm9ybSA9PT0gJ1dpbjMyJztcbiAgbGV0IG1hY29zID0gcGxhdGZvcm0gPT09ICdNYWNJbnRlbCc7XG5cbiAgLy8gaVBhZE9zIDEzIGZpeFxuICBjb25zdCBpUGFkU2NyZWVucyA9IFsnMTAyNHgxMzY2JywgJzEzNjZ4MTAyNCcsICc4MzR4MTE5NCcsICcxMTk0eDgzNCcsICc4MzR4MTExMicsICcxMTEyeDgzNCcsICc3Njh4MTAyNCcsICcxMDI0eDc2OCcsICc4MjB4MTE4MCcsICcxMTgweDgyMCcsICc4MTB4MTA4MCcsICcxMDgweDgxMCddO1xuICBpZiAoIWlwYWQgJiYgbWFjb3MgJiYgc3VwcG9ydC50b3VjaCAmJiBpUGFkU2NyZWVucy5pbmRleE9mKGAke3NjcmVlbldpZHRofXgke3NjcmVlbkhlaWdodH1gKSA+PSAwKSB7XG4gICAgaXBhZCA9IHVhLm1hdGNoKC8oVmVyc2lvbilcXC8oW1xcZC5dKykvKTtcbiAgICBpZiAoIWlwYWQpIGlwYWQgPSBbMCwgMSwgJzEzXzBfMCddO1xuICAgIG1hY29zID0gZmFsc2U7XG4gIH1cblxuICAvLyBBbmRyb2lkXG4gIGlmIChhbmRyb2lkICYmICF3aW5kb3dzKSB7XG4gICAgZGV2aWNlLm9zID0gJ2FuZHJvaWQnO1xuICAgIGRldmljZS5hbmRyb2lkID0gdHJ1ZTtcbiAgfVxuICBpZiAoaXBhZCB8fCBpcGhvbmUgfHwgaXBvZCkge1xuICAgIGRldmljZS5vcyA9ICdpb3MnO1xuICAgIGRldmljZS5pb3MgPSB0cnVlO1xuICB9XG5cbiAgLy8gRXhwb3J0IG9iamVjdFxuICByZXR1cm4gZGV2aWNlO1xufVxuZnVuY3Rpb24gZ2V0RGV2aWNlKG92ZXJyaWRlcykge1xuICBpZiAob3ZlcnJpZGVzID09PSB2b2lkIDApIHtcbiAgICBvdmVycmlkZXMgPSB7fTtcbiAgfVxuICBpZiAoIWRldmljZUNhY2hlZCkge1xuICAgIGRldmljZUNhY2hlZCA9IGNhbGNEZXZpY2Uob3ZlcnJpZGVzKTtcbiAgfVxuICByZXR1cm4gZGV2aWNlQ2FjaGVkO1xufVxuXG5sZXQgYnJvd3NlcjtcbmZ1bmN0aW9uIGNhbGNCcm93c2VyKCkge1xuICBjb25zdCB3aW5kb3cgPSBnZXRXaW5kb3coKTtcbiAgbGV0IG5lZWRQZXJzcGVjdGl2ZUZpeCA9IGZhbHNlO1xuICBmdW5jdGlvbiBpc1NhZmFyaSgpIHtcbiAgICBjb25zdCB1YSA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCk7XG4gICAgcmV0dXJuIHVhLmluZGV4T2YoJ3NhZmFyaScpID49IDAgJiYgdWEuaW5kZXhPZignY2hyb21lJykgPCAwICYmIHVhLmluZGV4T2YoJ2FuZHJvaWQnKSA8IDA7XG4gIH1cbiAgaWYgKGlzU2FmYXJpKCkpIHtcbiAgICBjb25zdCB1YSA9IFN0cmluZyh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCk7XG4gICAgaWYgKHVhLmluY2x1ZGVzKCdWZXJzaW9uLycpKSB7XG4gICAgICBjb25zdCBbbWFqb3IsIG1pbm9yXSA9IHVhLnNwbGl0KCdWZXJzaW9uLycpWzFdLnNwbGl0KCcgJylbMF0uc3BsaXQoJy4nKS5tYXAobnVtID0+IE51bWJlcihudW0pKTtcbiAgICAgIG5lZWRQZXJzcGVjdGl2ZUZpeCA9IG1ham9yIDwgMTYgfHwgbWFqb3IgPT09IDE2ICYmIG1pbm9yIDwgMjtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBpc1NhZmFyaTogbmVlZFBlcnNwZWN0aXZlRml4IHx8IGlzU2FmYXJpKCksXG4gICAgbmVlZFBlcnNwZWN0aXZlRml4LFxuICAgIGlzV2ViVmlldzogLyhpUGhvbmV8aVBvZHxpUGFkKS4qQXBwbGVXZWJLaXQoPyEuKlNhZmFyaSkvaS50ZXN0KHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KVxuICB9O1xufVxuZnVuY3Rpb24gZ2V0QnJvd3NlcigpIHtcbiAgaWYgKCFicm93c2VyKSB7XG4gICAgYnJvd3NlciA9IGNhbGNCcm93c2VyKCk7XG4gIH1cbiAgcmV0dXJuIGJyb3dzZXI7XG59XG5cbmZ1bmN0aW9uIFJlc2l6ZShfcmVmKSB7XG4gIGxldCB7XG4gICAgc3dpcGVyLFxuICAgIG9uLFxuICAgIGVtaXRcbiAgfSA9IF9yZWY7XG4gIGNvbnN0IHdpbmRvdyA9IGdldFdpbmRvdygpO1xuICBsZXQgb2JzZXJ2ZXIgPSBudWxsO1xuICBsZXQgYW5pbWF0aW9uRnJhbWUgPSBudWxsO1xuICBjb25zdCByZXNpemVIYW5kbGVyID0gKCkgPT4ge1xuICAgIGlmICghc3dpcGVyIHx8IHN3aXBlci5kZXN0cm95ZWQgfHwgIXN3aXBlci5pbml0aWFsaXplZCkgcmV0dXJuO1xuICAgIGVtaXQoJ2JlZm9yZVJlc2l6ZScpO1xuICAgIGVtaXQoJ3Jlc2l6ZScpO1xuICB9O1xuICBjb25zdCBjcmVhdGVPYnNlcnZlciA9ICgpID0+IHtcbiAgICBpZiAoIXN3aXBlciB8fCBzd2lwZXIuZGVzdHJveWVkIHx8ICFzd2lwZXIuaW5pdGlhbGl6ZWQpIHJldHVybjtcbiAgICBvYnNlcnZlciA9IG5ldyBSZXNpemVPYnNlcnZlcihlbnRyaWVzID0+IHtcbiAgICAgIGFuaW1hdGlvbkZyYW1lID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgIGNvbnN0IHtcbiAgICAgICAgICB3aWR0aCxcbiAgICAgICAgICBoZWlnaHRcbiAgICAgICAgfSA9IHN3aXBlcjtcbiAgICAgICAgbGV0IG5ld1dpZHRoID0gd2lkdGg7XG4gICAgICAgIGxldCBuZXdIZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgIGVudHJpZXMuZm9yRWFjaChfcmVmMiA9PiB7XG4gICAgICAgICAgbGV0IHtcbiAgICAgICAgICAgIGNvbnRlbnRCb3hTaXplLFxuICAgICAgICAgICAgY29udGVudFJlY3QsXG4gICAgICAgICAgICB0YXJnZXRcbiAgICAgICAgICB9ID0gX3JlZjI7XG4gICAgICAgICAgaWYgKHRhcmdldCAmJiB0YXJnZXQgIT09IHN3aXBlci5lbCkgcmV0dXJuO1xuICAgICAgICAgIG5ld1dpZHRoID0gY29udGVudFJlY3QgPyBjb250ZW50UmVjdC53aWR0aCA6IChjb250ZW50Qm94U2l6ZVswXSB8fCBjb250ZW50Qm94U2l6ZSkuaW5saW5lU2l6ZTtcbiAgICAgICAgICBuZXdIZWlnaHQgPSBjb250ZW50UmVjdCA/IGNvbnRlbnRSZWN0LmhlaWdodCA6IChjb250ZW50Qm94U2l6ZVswXSB8fCBjb250ZW50Qm94U2l6ZSkuYmxvY2tTaXplO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKG5ld1dpZHRoICE9PSB3aWR0aCB8fCBuZXdIZWlnaHQgIT09IGhlaWdodCkge1xuICAgICAgICAgIHJlc2l6ZUhhbmRsZXIoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZShzd2lwZXIuZWwpO1xuICB9O1xuICBjb25zdCByZW1vdmVPYnNlcnZlciA9ICgpID0+IHtcbiAgICBpZiAoYW5pbWF0aW9uRnJhbWUpIHtcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZShhbmltYXRpb25GcmFtZSk7XG4gICAgfVxuICAgIGlmIChvYnNlcnZlciAmJiBvYnNlcnZlci51bm9ic2VydmUgJiYgc3dpcGVyLmVsKSB7XG4gICAgICBvYnNlcnZlci51bm9ic2VydmUoc3dpcGVyLmVsKTtcbiAgICAgIG9ic2VydmVyID0gbnVsbDtcbiAgICB9XG4gIH07XG4gIGNvbnN0IG9yaWVudGF0aW9uQ2hhbmdlSGFuZGxlciA9ICgpID0+IHtcbiAgICBpZiAoIXN3aXBlciB8fCBzd2lwZXIuZGVzdHJveWVkIHx8ICFzd2lwZXIuaW5pdGlhbGl6ZWQpIHJldHVybjtcbiAgICBlbWl0KCdvcmllbnRhdGlvbmNoYW5nZScpO1xuICB9O1xuICBvbignaW5pdCcsICgpID0+IHtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5yZXNpemVPYnNlcnZlciAmJiB0eXBlb2Ygd2luZG93LlJlc2l6ZU9ic2VydmVyICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY3JlYXRlT2JzZXJ2ZXIoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2l6ZUhhbmRsZXIpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvcmllbnRhdGlvbmNoYW5nZScsIG9yaWVudGF0aW9uQ2hhbmdlSGFuZGxlcik7XG4gIH0pO1xuICBvbignZGVzdHJveScsICgpID0+IHtcbiAgICByZW1vdmVPYnNlcnZlcigpO1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZXNpemVIYW5kbGVyKTtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignb3JpZW50YXRpb25jaGFuZ2UnLCBvcmllbnRhdGlvbkNoYW5nZUhhbmRsZXIpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gT2JzZXJ2ZXIoX3JlZikge1xuICBsZXQge1xuICAgIHN3aXBlcixcbiAgICBleHRlbmRQYXJhbXMsXG4gICAgb24sXG4gICAgZW1pdFxuICB9ID0gX3JlZjtcbiAgY29uc3Qgb2JzZXJ2ZXJzID0gW107XG4gIGNvbnN0IHdpbmRvdyA9IGdldFdpbmRvdygpO1xuICBjb25zdCBhdHRhY2ggPSBmdW5jdGlvbiAodGFyZ2V0LCBvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkge1xuICAgICAgb3B0aW9ucyA9IHt9O1xuICAgIH1cbiAgICBjb25zdCBPYnNlcnZlckZ1bmMgPSB3aW5kb3cuTXV0YXRpb25PYnNlcnZlciB8fCB3aW5kb3cuV2Via2l0TXV0YXRpb25PYnNlcnZlcjtcbiAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBPYnNlcnZlckZ1bmMobXV0YXRpb25zID0+IHtcbiAgICAgIC8vIFRoZSBvYnNlcnZlclVwZGF0ZSBldmVudCBzaG91bGQgb25seSBiZSB0cmlnZ2VyZWRcbiAgICAgIC8vIG9uY2UgZGVzcGl0ZSB0aGUgbnVtYmVyIG9mIG11dGF0aW9ucy4gIEFkZGl0aW9uYWxcbiAgICAgIC8vIHRyaWdnZXJzIGFyZSByZWR1bmRhbnQgYW5kIGFyZSB2ZXJ5IGNvc3RseVxuICAgICAgaWYgKHN3aXBlci5fX3ByZXZlbnRPYnNlcnZlcl9fKSByZXR1cm47XG4gICAgICBpZiAobXV0YXRpb25zLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBlbWl0KCdvYnNlcnZlclVwZGF0ZScsIG11dGF0aW9uc1swXSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG9ic2VydmVyVXBkYXRlID0gZnVuY3Rpb24gb2JzZXJ2ZXJVcGRhdGUoKSB7XG4gICAgICAgIGVtaXQoJ29ic2VydmVyVXBkYXRlJywgbXV0YXRpb25zWzBdKTtcbiAgICAgIH07XG4gICAgICBpZiAod2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSkge1xuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKG9ic2VydmVyVXBkYXRlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KG9ic2VydmVyVXBkYXRlLCAwKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBvYnNlcnZlci5vYnNlcnZlKHRhcmdldCwge1xuICAgICAgYXR0cmlidXRlczogdHlwZW9mIG9wdGlvbnMuYXR0cmlidXRlcyA9PT0gJ3VuZGVmaW5lZCcgPyB0cnVlIDogb3B0aW9ucy5hdHRyaWJ1dGVzLFxuICAgICAgY2hpbGRMaXN0OiB0eXBlb2Ygb3B0aW9ucy5jaGlsZExpc3QgPT09ICd1bmRlZmluZWQnID8gdHJ1ZSA6IG9wdGlvbnMuY2hpbGRMaXN0LFxuICAgICAgY2hhcmFjdGVyRGF0YTogdHlwZW9mIG9wdGlvbnMuY2hhcmFjdGVyRGF0YSA9PT0gJ3VuZGVmaW5lZCcgPyB0cnVlIDogb3B0aW9ucy5jaGFyYWN0ZXJEYXRhXG4gICAgfSk7XG4gICAgb2JzZXJ2ZXJzLnB1c2gob2JzZXJ2ZXIpO1xuICB9O1xuICBjb25zdCBpbml0ID0gKCkgPT4ge1xuICAgIGlmICghc3dpcGVyLnBhcmFtcy5vYnNlcnZlcikgcmV0dXJuO1xuICAgIGlmIChzd2lwZXIucGFyYW1zLm9ic2VydmVQYXJlbnRzKSB7XG4gICAgICBjb25zdCBjb250YWluZXJQYXJlbnRzID0gZWxlbWVudFBhcmVudHMoc3dpcGVyLmhvc3RFbCk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbnRhaW5lclBhcmVudHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgYXR0YWNoKGNvbnRhaW5lclBhcmVudHNbaV0pO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBPYnNlcnZlIGNvbnRhaW5lclxuICAgIGF0dGFjaChzd2lwZXIuaG9zdEVsLCB7XG4gICAgICBjaGlsZExpc3Q6IHN3aXBlci5wYXJhbXMub2JzZXJ2ZVNsaWRlQ2hpbGRyZW5cbiAgICB9KTtcblxuICAgIC8vIE9ic2VydmUgd3JhcHBlclxuICAgIGF0dGFjaChzd2lwZXIud3JhcHBlckVsLCB7XG4gICAgICBhdHRyaWJ1dGVzOiBmYWxzZVxuICAgIH0pO1xuICB9O1xuICBjb25zdCBkZXN0cm95ID0gKCkgPT4ge1xuICAgIG9ic2VydmVycy5mb3JFYWNoKG9ic2VydmVyID0+IHtcbiAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICB9KTtcbiAgICBvYnNlcnZlcnMuc3BsaWNlKDAsIG9ic2VydmVycy5sZW5ndGgpO1xuICB9O1xuICBleHRlbmRQYXJhbXMoe1xuICAgIG9ic2VydmVyOiBmYWxzZSxcbiAgICBvYnNlcnZlUGFyZW50czogZmFsc2UsXG4gICAgb2JzZXJ2ZVNsaWRlQ2hpbGRyZW46IGZhbHNlXG4gIH0pO1xuICBvbignaW5pdCcsIGluaXQpO1xuICBvbignZGVzdHJveScsIGRlc3Ryb3kpO1xufVxuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlcnNjb3JlLWRhbmdsZSAqL1xuXG52YXIgZXZlbnRzRW1pdHRlciA9IHtcbiAgb24oZXZlbnRzLCBoYW5kbGVyLCBwcmlvcml0eSkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGlmICghc2VsZi5ldmVudHNMaXN0ZW5lcnMgfHwgc2VsZi5kZXN0cm95ZWQpIHJldHVybiBzZWxmO1xuICAgIGlmICh0eXBlb2YgaGFuZGxlciAhPT0gJ2Z1bmN0aW9uJykgcmV0dXJuIHNlbGY7XG4gICAgY29uc3QgbWV0aG9kID0gcHJpb3JpdHkgPyAndW5zaGlmdCcgOiAncHVzaCc7XG4gICAgZXZlbnRzLnNwbGl0KCcgJykuZm9yRWFjaChldmVudCA9PiB7XG4gICAgICBpZiAoIXNlbGYuZXZlbnRzTGlzdGVuZXJzW2V2ZW50XSkgc2VsZi5ldmVudHNMaXN0ZW5lcnNbZXZlbnRdID0gW107XG4gICAgICBzZWxmLmV2ZW50c0xpc3RlbmVyc1tldmVudF1bbWV0aG9kXShoYW5kbGVyKTtcbiAgICB9KTtcbiAgICByZXR1cm4gc2VsZjtcbiAgfSxcbiAgb25jZShldmVudHMsIGhhbmRsZXIsIHByaW9yaXR5KSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgaWYgKCFzZWxmLmV2ZW50c0xpc3RlbmVycyB8fCBzZWxmLmRlc3Ryb3llZCkgcmV0dXJuIHNlbGY7XG4gICAgaWYgKHR5cGVvZiBoYW5kbGVyICE9PSAnZnVuY3Rpb24nKSByZXR1cm4gc2VsZjtcbiAgICBmdW5jdGlvbiBvbmNlSGFuZGxlcigpIHtcbiAgICAgIHNlbGYub2ZmKGV2ZW50cywgb25jZUhhbmRsZXIpO1xuICAgICAgaWYgKG9uY2VIYW5kbGVyLl9fZW1pdHRlclByb3h5KSB7XG4gICAgICAgIGRlbGV0ZSBvbmNlSGFuZGxlci5fX2VtaXR0ZXJQcm94eTtcbiAgICAgIH1cbiAgICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgICBhcmdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICAgICAgfVxuICAgICAgaGFuZGxlci5hcHBseShzZWxmLCBhcmdzKTtcbiAgICB9XG4gICAgb25jZUhhbmRsZXIuX19lbWl0dGVyUHJveHkgPSBoYW5kbGVyO1xuICAgIHJldHVybiBzZWxmLm9uKGV2ZW50cywgb25jZUhhbmRsZXIsIHByaW9yaXR5KTtcbiAgfSxcbiAgb25BbnkoaGFuZGxlciwgcHJpb3JpdHkpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBpZiAoIXNlbGYuZXZlbnRzTGlzdGVuZXJzIHx8IHNlbGYuZGVzdHJveWVkKSByZXR1cm4gc2VsZjtcbiAgICBpZiAodHlwZW9mIGhhbmRsZXIgIT09ICdmdW5jdGlvbicpIHJldHVybiBzZWxmO1xuICAgIGNvbnN0IG1ldGhvZCA9IHByaW9yaXR5ID8gJ3Vuc2hpZnQnIDogJ3B1c2gnO1xuICAgIGlmIChzZWxmLmV2ZW50c0FueUxpc3RlbmVycy5pbmRleE9mKGhhbmRsZXIpIDwgMCkge1xuICAgICAgc2VsZi5ldmVudHNBbnlMaXN0ZW5lcnNbbWV0aG9kXShoYW5kbGVyKTtcbiAgICB9XG4gICAgcmV0dXJuIHNlbGY7XG4gIH0sXG4gIG9mZkFueShoYW5kbGVyKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgaWYgKCFzZWxmLmV2ZW50c0xpc3RlbmVycyB8fCBzZWxmLmRlc3Ryb3llZCkgcmV0dXJuIHNlbGY7XG4gICAgaWYgKCFzZWxmLmV2ZW50c0FueUxpc3RlbmVycykgcmV0dXJuIHNlbGY7XG4gICAgY29uc3QgaW5kZXggPSBzZWxmLmV2ZW50c0FueUxpc3RlbmVycy5pbmRleE9mKGhhbmRsZXIpO1xuICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICBzZWxmLmV2ZW50c0FueUxpc3RlbmVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cbiAgICByZXR1cm4gc2VsZjtcbiAgfSxcbiAgb2ZmKGV2ZW50cywgaGFuZGxlcikge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGlmICghc2VsZi5ldmVudHNMaXN0ZW5lcnMgfHwgc2VsZi5kZXN0cm95ZWQpIHJldHVybiBzZWxmO1xuICAgIGlmICghc2VsZi5ldmVudHNMaXN0ZW5lcnMpIHJldHVybiBzZWxmO1xuICAgIGV2ZW50cy5zcGxpdCgnICcpLmZvckVhY2goZXZlbnQgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBoYW5kbGVyID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBzZWxmLmV2ZW50c0xpc3RlbmVyc1tldmVudF0gPSBbXTtcbiAgICAgIH0gZWxzZSBpZiAoc2VsZi5ldmVudHNMaXN0ZW5lcnNbZXZlbnRdKSB7XG4gICAgICAgIHNlbGYuZXZlbnRzTGlzdGVuZXJzW2V2ZW50XS5mb3JFYWNoKChldmVudEhhbmRsZXIsIGluZGV4KSA9PiB7XG4gICAgICAgICAgaWYgKGV2ZW50SGFuZGxlciA9PT0gaGFuZGxlciB8fCBldmVudEhhbmRsZXIuX19lbWl0dGVyUHJveHkgJiYgZXZlbnRIYW5kbGVyLl9fZW1pdHRlclByb3h5ID09PSBoYW5kbGVyKSB7XG4gICAgICAgICAgICBzZWxmLmV2ZW50c0xpc3RlbmVyc1tldmVudF0uc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBzZWxmO1xuICB9LFxuICBlbWl0KCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGlmICghc2VsZi5ldmVudHNMaXN0ZW5lcnMgfHwgc2VsZi5kZXN0cm95ZWQpIHJldHVybiBzZWxmO1xuICAgIGlmICghc2VsZi5ldmVudHNMaXN0ZW5lcnMpIHJldHVybiBzZWxmO1xuICAgIGxldCBldmVudHM7XG4gICAgbGV0IGRhdGE7XG4gICAgbGV0IGNvbnRleHQ7XG4gICAgZm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW4yKSwgX2tleTIgPSAwOyBfa2V5MiA8IF9sZW4yOyBfa2V5MisrKSB7XG4gICAgICBhcmdzW19rZXkyXSA9IGFyZ3VtZW50c1tfa2V5Ml07XG4gICAgfVxuICAgIGlmICh0eXBlb2YgYXJnc1swXSA9PT0gJ3N0cmluZycgfHwgQXJyYXkuaXNBcnJheShhcmdzWzBdKSkge1xuICAgICAgZXZlbnRzID0gYXJnc1swXTtcbiAgICAgIGRhdGEgPSBhcmdzLnNsaWNlKDEsIGFyZ3MubGVuZ3RoKTtcbiAgICAgIGNvbnRleHQgPSBzZWxmO1xuICAgIH0gZWxzZSB7XG4gICAgICBldmVudHMgPSBhcmdzWzBdLmV2ZW50cztcbiAgICAgIGRhdGEgPSBhcmdzWzBdLmRhdGE7XG4gICAgICBjb250ZXh0ID0gYXJnc1swXS5jb250ZXh0IHx8IHNlbGY7XG4gICAgfVxuICAgIGRhdGEudW5zaGlmdChjb250ZXh0KTtcbiAgICBjb25zdCBldmVudHNBcnJheSA9IEFycmF5LmlzQXJyYXkoZXZlbnRzKSA/IGV2ZW50cyA6IGV2ZW50cy5zcGxpdCgnICcpO1xuICAgIGV2ZW50c0FycmF5LmZvckVhY2goZXZlbnQgPT4ge1xuICAgICAgaWYgKHNlbGYuZXZlbnRzQW55TGlzdGVuZXJzICYmIHNlbGYuZXZlbnRzQW55TGlzdGVuZXJzLmxlbmd0aCkge1xuICAgICAgICBzZWxmLmV2ZW50c0FueUxpc3RlbmVycy5mb3JFYWNoKGV2ZW50SGFuZGxlciA9PiB7XG4gICAgICAgICAgZXZlbnRIYW5kbGVyLmFwcGx5KGNvbnRleHQsIFtldmVudCwgLi4uZGF0YV0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChzZWxmLmV2ZW50c0xpc3RlbmVycyAmJiBzZWxmLmV2ZW50c0xpc3RlbmVyc1tldmVudF0pIHtcbiAgICAgICAgc2VsZi5ldmVudHNMaXN0ZW5lcnNbZXZlbnRdLmZvckVhY2goZXZlbnRIYW5kbGVyID0+IHtcbiAgICAgICAgICBldmVudEhhbmRsZXIuYXBwbHkoY29udGV4dCwgZGF0YSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBzZWxmO1xuICB9XG59O1xuXG5mdW5jdGlvbiB1cGRhdGVTaXplKCkge1xuICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICBsZXQgd2lkdGg7XG4gIGxldCBoZWlnaHQ7XG4gIGNvbnN0IGVsID0gc3dpcGVyLmVsO1xuICBpZiAodHlwZW9mIHN3aXBlci5wYXJhbXMud2lkdGggIT09ICd1bmRlZmluZWQnICYmIHN3aXBlci5wYXJhbXMud2lkdGggIT09IG51bGwpIHtcbiAgICB3aWR0aCA9IHN3aXBlci5wYXJhbXMud2lkdGg7XG4gIH0gZWxzZSB7XG4gICAgd2lkdGggPSBlbC5jbGllbnRXaWR0aDtcbiAgfVxuICBpZiAodHlwZW9mIHN3aXBlci5wYXJhbXMuaGVpZ2h0ICE9PSAndW5kZWZpbmVkJyAmJiBzd2lwZXIucGFyYW1zLmhlaWdodCAhPT0gbnVsbCkge1xuICAgIGhlaWdodCA9IHN3aXBlci5wYXJhbXMuaGVpZ2h0O1xuICB9IGVsc2Uge1xuICAgIGhlaWdodCA9IGVsLmNsaWVudEhlaWdodDtcbiAgfVxuICBpZiAod2lkdGggPT09IDAgJiYgc3dpcGVyLmlzSG9yaXpvbnRhbCgpIHx8IGhlaWdodCA9PT0gMCAmJiBzd2lwZXIuaXNWZXJ0aWNhbCgpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gU3VidHJhY3QgcGFkZGluZ3NcbiAgd2lkdGggPSB3aWR0aCAtIHBhcnNlSW50KGVsZW1lbnRTdHlsZShlbCwgJ3BhZGRpbmctbGVmdCcpIHx8IDAsIDEwKSAtIHBhcnNlSW50KGVsZW1lbnRTdHlsZShlbCwgJ3BhZGRpbmctcmlnaHQnKSB8fCAwLCAxMCk7XG4gIGhlaWdodCA9IGhlaWdodCAtIHBhcnNlSW50KGVsZW1lbnRTdHlsZShlbCwgJ3BhZGRpbmctdG9wJykgfHwgMCwgMTApIC0gcGFyc2VJbnQoZWxlbWVudFN0eWxlKGVsLCAncGFkZGluZy1ib3R0b20nKSB8fCAwLCAxMCk7XG4gIGlmIChOdW1iZXIuaXNOYU4od2lkdGgpKSB3aWR0aCA9IDA7XG4gIGlmIChOdW1iZXIuaXNOYU4oaGVpZ2h0KSkgaGVpZ2h0ID0gMDtcbiAgT2JqZWN0LmFzc2lnbihzd2lwZXIsIHtcbiAgICB3aWR0aCxcbiAgICBoZWlnaHQsXG4gICAgc2l6ZTogc3dpcGVyLmlzSG9yaXpvbnRhbCgpID8gd2lkdGggOiBoZWlnaHRcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVNsaWRlcygpIHtcbiAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgZnVuY3Rpb24gZ2V0RGlyZWN0aW9uUHJvcGVydHlWYWx1ZShub2RlLCBsYWJlbCkge1xuICAgIHJldHVybiBwYXJzZUZsb2F0KG5vZGUuZ2V0UHJvcGVydHlWYWx1ZShzd2lwZXIuZ2V0RGlyZWN0aW9uTGFiZWwobGFiZWwpKSB8fCAwKTtcbiAgfVxuICBjb25zdCBwYXJhbXMgPSBzd2lwZXIucGFyYW1zO1xuICBjb25zdCB7XG4gICAgd3JhcHBlckVsLFxuICAgIHNsaWRlc0VsLFxuICAgIHNpemU6IHN3aXBlclNpemUsXG4gICAgcnRsVHJhbnNsYXRlOiBydGwsXG4gICAgd3JvbmdSVExcbiAgfSA9IHN3aXBlcjtcbiAgY29uc3QgaXNWaXJ0dWFsID0gc3dpcGVyLnZpcnR1YWwgJiYgcGFyYW1zLnZpcnR1YWwuZW5hYmxlZDtcbiAgY29uc3QgcHJldmlvdXNTbGlkZXNMZW5ndGggPSBpc1ZpcnR1YWwgPyBzd2lwZXIudmlydHVhbC5zbGlkZXMubGVuZ3RoIDogc3dpcGVyLnNsaWRlcy5sZW5ndGg7XG4gIGNvbnN0IHNsaWRlcyA9IGVsZW1lbnRDaGlsZHJlbihzbGlkZXNFbCwgYC4ke3N3aXBlci5wYXJhbXMuc2xpZGVDbGFzc30sIHN3aXBlci1zbGlkZWApO1xuICBjb25zdCBzbGlkZXNMZW5ndGggPSBpc1ZpcnR1YWwgPyBzd2lwZXIudmlydHVhbC5zbGlkZXMubGVuZ3RoIDogc2xpZGVzLmxlbmd0aDtcbiAgbGV0IHNuYXBHcmlkID0gW107XG4gIGNvbnN0IHNsaWRlc0dyaWQgPSBbXTtcbiAgY29uc3Qgc2xpZGVzU2l6ZXNHcmlkID0gW107XG4gIGxldCBvZmZzZXRCZWZvcmUgPSBwYXJhbXMuc2xpZGVzT2Zmc2V0QmVmb3JlO1xuICBpZiAodHlwZW9mIG9mZnNldEJlZm9yZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIG9mZnNldEJlZm9yZSA9IHBhcmFtcy5zbGlkZXNPZmZzZXRCZWZvcmUuY2FsbChzd2lwZXIpO1xuICB9XG4gIGxldCBvZmZzZXRBZnRlciA9IHBhcmFtcy5zbGlkZXNPZmZzZXRBZnRlcjtcbiAgaWYgKHR5cGVvZiBvZmZzZXRBZnRlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIG9mZnNldEFmdGVyID0gcGFyYW1zLnNsaWRlc09mZnNldEFmdGVyLmNhbGwoc3dpcGVyKTtcbiAgfVxuICBjb25zdCBwcmV2aW91c1NuYXBHcmlkTGVuZ3RoID0gc3dpcGVyLnNuYXBHcmlkLmxlbmd0aDtcbiAgY29uc3QgcHJldmlvdXNTbGlkZXNHcmlkTGVuZ3RoID0gc3dpcGVyLnNsaWRlc0dyaWQubGVuZ3RoO1xuICBsZXQgc3BhY2VCZXR3ZWVuID0gcGFyYW1zLnNwYWNlQmV0d2VlbjtcbiAgbGV0IHNsaWRlUG9zaXRpb24gPSAtb2Zmc2V0QmVmb3JlO1xuICBsZXQgcHJldlNsaWRlU2l6ZSA9IDA7XG4gIGxldCBpbmRleCA9IDA7XG4gIGlmICh0eXBlb2Ygc3dpcGVyU2l6ZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKHR5cGVvZiBzcGFjZUJldHdlZW4gPT09ICdzdHJpbmcnICYmIHNwYWNlQmV0d2Vlbi5pbmRleE9mKCclJykgPj0gMCkge1xuICAgIHNwYWNlQmV0d2VlbiA9IHBhcnNlRmxvYXQoc3BhY2VCZXR3ZWVuLnJlcGxhY2UoJyUnLCAnJykpIC8gMTAwICogc3dpcGVyU2l6ZTtcbiAgfSBlbHNlIGlmICh0eXBlb2Ygc3BhY2VCZXR3ZWVuID09PSAnc3RyaW5nJykge1xuICAgIHNwYWNlQmV0d2VlbiA9IHBhcnNlRmxvYXQoc3BhY2VCZXR3ZWVuKTtcbiAgfVxuICBzd2lwZXIudmlydHVhbFNpemUgPSAtc3BhY2VCZXR3ZWVuO1xuXG4gIC8vIHJlc2V0IG1hcmdpbnNcbiAgc2xpZGVzLmZvckVhY2goc2xpZGVFbCA9PiB7XG4gICAgaWYgKHJ0bCkge1xuICAgICAgc2xpZGVFbC5zdHlsZS5tYXJnaW5MZWZ0ID0gJyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNsaWRlRWwuc3R5bGUubWFyZ2luUmlnaHQgPSAnJztcbiAgICB9XG4gICAgc2xpZGVFbC5zdHlsZS5tYXJnaW5Cb3R0b20gPSAnJztcbiAgICBzbGlkZUVsLnN0eWxlLm1hcmdpblRvcCA9ICcnO1xuICB9KTtcblxuICAvLyByZXNldCBjc3NNb2RlIG9mZnNldHNcbiAgaWYgKHBhcmFtcy5jZW50ZXJlZFNsaWRlcyAmJiBwYXJhbXMuY3NzTW9kZSkge1xuICAgIHNldENTU1Byb3BlcnR5KHdyYXBwZXJFbCwgJy0tc3dpcGVyLWNlbnRlcmVkLW9mZnNldC1iZWZvcmUnLCAnJyk7XG4gICAgc2V0Q1NTUHJvcGVydHkod3JhcHBlckVsLCAnLS1zd2lwZXItY2VudGVyZWQtb2Zmc2V0LWFmdGVyJywgJycpO1xuICB9XG4gIGNvbnN0IGdyaWRFbmFibGVkID0gcGFyYW1zLmdyaWQgJiYgcGFyYW1zLmdyaWQucm93cyA+IDEgJiYgc3dpcGVyLmdyaWQ7XG4gIGlmIChncmlkRW5hYmxlZCkge1xuICAgIHN3aXBlci5ncmlkLmluaXRTbGlkZXMoc2xpZGVzKTtcbiAgfSBlbHNlIGlmIChzd2lwZXIuZ3JpZCkge1xuICAgIHN3aXBlci5ncmlkLnVuc2V0U2xpZGVzKCk7XG4gIH1cblxuICAvLyBDYWxjIHNsaWRlc1xuICBsZXQgc2xpZGVTaXplO1xuICBjb25zdCBzaG91bGRSZXNldFNsaWRlU2l6ZSA9IHBhcmFtcy5zbGlkZXNQZXJWaWV3ID09PSAnYXV0bycgJiYgcGFyYW1zLmJyZWFrcG9pbnRzICYmIE9iamVjdC5rZXlzKHBhcmFtcy5icmVha3BvaW50cykuZmlsdGVyKGtleSA9PiB7XG4gICAgcmV0dXJuIHR5cGVvZiBwYXJhbXMuYnJlYWtwb2ludHNba2V5XS5zbGlkZXNQZXJWaWV3ICE9PSAndW5kZWZpbmVkJztcbiAgfSkubGVuZ3RoID4gMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzbGlkZXNMZW5ndGg7IGkgKz0gMSkge1xuICAgIHNsaWRlU2l6ZSA9IDA7XG4gICAgbGV0IHNsaWRlO1xuICAgIGlmIChzbGlkZXNbaV0pIHNsaWRlID0gc2xpZGVzW2ldO1xuICAgIGlmIChncmlkRW5hYmxlZCkge1xuICAgICAgc3dpcGVyLmdyaWQudXBkYXRlU2xpZGUoaSwgc2xpZGUsIHNsaWRlcyk7XG4gICAgfVxuICAgIGlmIChzbGlkZXNbaV0gJiYgZWxlbWVudFN0eWxlKHNsaWRlLCAnZGlzcGxheScpID09PSAnbm9uZScpIGNvbnRpbnVlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG5cbiAgICBpZiAocGFyYW1zLnNsaWRlc1BlclZpZXcgPT09ICdhdXRvJykge1xuICAgICAgaWYgKHNob3VsZFJlc2V0U2xpZGVTaXplKSB7XG4gICAgICAgIHNsaWRlc1tpXS5zdHlsZVtzd2lwZXIuZ2V0RGlyZWN0aW9uTGFiZWwoJ3dpZHRoJyldID0gYGA7XG4gICAgICB9XG4gICAgICBjb25zdCBzbGlkZVN0eWxlcyA9IGdldENvbXB1dGVkU3R5bGUoc2xpZGUpO1xuICAgICAgY29uc3QgY3VycmVudFRyYW5zZm9ybSA9IHNsaWRlLnN0eWxlLnRyYW5zZm9ybTtcbiAgICAgIGNvbnN0IGN1cnJlbnRXZWJLaXRUcmFuc2Zvcm0gPSBzbGlkZS5zdHlsZS53ZWJraXRUcmFuc2Zvcm07XG4gICAgICBpZiAoY3VycmVudFRyYW5zZm9ybSkge1xuICAgICAgICBzbGlkZS5zdHlsZS50cmFuc2Zvcm0gPSAnbm9uZSc7XG4gICAgICB9XG4gICAgICBpZiAoY3VycmVudFdlYktpdFRyYW5zZm9ybSkge1xuICAgICAgICBzbGlkZS5zdHlsZS53ZWJraXRUcmFuc2Zvcm0gPSAnbm9uZSc7XG4gICAgICB9XG4gICAgICBpZiAocGFyYW1zLnJvdW5kTGVuZ3Rocykge1xuICAgICAgICBzbGlkZVNpemUgPSBzd2lwZXIuaXNIb3Jpem9udGFsKCkgPyBlbGVtZW50T3V0ZXJTaXplKHNsaWRlLCAnd2lkdGgnLCB0cnVlKSA6IGVsZW1lbnRPdXRlclNpemUoc2xpZGUsICdoZWlnaHQnLCB0cnVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgICAgICBjb25zdCB3aWR0aCA9IGdldERpcmVjdGlvblByb3BlcnR5VmFsdWUoc2xpZGVTdHlsZXMsICd3aWR0aCcpO1xuICAgICAgICBjb25zdCBwYWRkaW5nTGVmdCA9IGdldERpcmVjdGlvblByb3BlcnR5VmFsdWUoc2xpZGVTdHlsZXMsICdwYWRkaW5nLWxlZnQnKTtcbiAgICAgICAgY29uc3QgcGFkZGluZ1JpZ2h0ID0gZ2V0RGlyZWN0aW9uUHJvcGVydHlWYWx1ZShzbGlkZVN0eWxlcywgJ3BhZGRpbmctcmlnaHQnKTtcbiAgICAgICAgY29uc3QgbWFyZ2luTGVmdCA9IGdldERpcmVjdGlvblByb3BlcnR5VmFsdWUoc2xpZGVTdHlsZXMsICdtYXJnaW4tbGVmdCcpO1xuICAgICAgICBjb25zdCBtYXJnaW5SaWdodCA9IGdldERpcmVjdGlvblByb3BlcnR5VmFsdWUoc2xpZGVTdHlsZXMsICdtYXJnaW4tcmlnaHQnKTtcbiAgICAgICAgY29uc3QgYm94U2l6aW5nID0gc2xpZGVTdHlsZXMuZ2V0UHJvcGVydHlWYWx1ZSgnYm94LXNpemluZycpO1xuICAgICAgICBpZiAoYm94U2l6aW5nICYmIGJveFNpemluZyA9PT0gJ2JvcmRlci1ib3gnKSB7XG4gICAgICAgICAgc2xpZGVTaXplID0gd2lkdGggKyBtYXJnaW5MZWZ0ICsgbWFyZ2luUmlnaHQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3Qge1xuICAgICAgICAgICAgY2xpZW50V2lkdGgsXG4gICAgICAgICAgICBvZmZzZXRXaWR0aFxuICAgICAgICAgIH0gPSBzbGlkZTtcbiAgICAgICAgICBzbGlkZVNpemUgPSB3aWR0aCArIHBhZGRpbmdMZWZ0ICsgcGFkZGluZ1JpZ2h0ICsgbWFyZ2luTGVmdCArIG1hcmdpblJpZ2h0ICsgKG9mZnNldFdpZHRoIC0gY2xpZW50V2lkdGgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoY3VycmVudFRyYW5zZm9ybSkge1xuICAgICAgICBzbGlkZS5zdHlsZS50cmFuc2Zvcm0gPSBjdXJyZW50VHJhbnNmb3JtO1xuICAgICAgfVxuICAgICAgaWYgKGN1cnJlbnRXZWJLaXRUcmFuc2Zvcm0pIHtcbiAgICAgICAgc2xpZGUuc3R5bGUud2Via2l0VHJhbnNmb3JtID0gY3VycmVudFdlYktpdFRyYW5zZm9ybTtcbiAgICAgIH1cbiAgICAgIGlmIChwYXJhbXMucm91bmRMZW5ndGhzKSBzbGlkZVNpemUgPSBNYXRoLmZsb29yKHNsaWRlU2l6ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNsaWRlU2l6ZSA9IChzd2lwZXJTaXplIC0gKHBhcmFtcy5zbGlkZXNQZXJWaWV3IC0gMSkgKiBzcGFjZUJldHdlZW4pIC8gcGFyYW1zLnNsaWRlc1BlclZpZXc7XG4gICAgICBpZiAocGFyYW1zLnJvdW5kTGVuZ3Rocykgc2xpZGVTaXplID0gTWF0aC5mbG9vcihzbGlkZVNpemUpO1xuICAgICAgaWYgKHNsaWRlc1tpXSkge1xuICAgICAgICBzbGlkZXNbaV0uc3R5bGVbc3dpcGVyLmdldERpcmVjdGlvbkxhYmVsKCd3aWR0aCcpXSA9IGAke3NsaWRlU2l6ZX1weGA7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChzbGlkZXNbaV0pIHtcbiAgICAgIHNsaWRlc1tpXS5zd2lwZXJTbGlkZVNpemUgPSBzbGlkZVNpemU7XG4gICAgfVxuICAgIHNsaWRlc1NpemVzR3JpZC5wdXNoKHNsaWRlU2l6ZSk7XG4gICAgaWYgKHBhcmFtcy5jZW50ZXJlZFNsaWRlcykge1xuICAgICAgc2xpZGVQb3NpdGlvbiA9IHNsaWRlUG9zaXRpb24gKyBzbGlkZVNpemUgLyAyICsgcHJldlNsaWRlU2l6ZSAvIDIgKyBzcGFjZUJldHdlZW47XG4gICAgICBpZiAocHJldlNsaWRlU2l6ZSA9PT0gMCAmJiBpICE9PSAwKSBzbGlkZVBvc2l0aW9uID0gc2xpZGVQb3NpdGlvbiAtIHN3aXBlclNpemUgLyAyIC0gc3BhY2VCZXR3ZWVuO1xuICAgICAgaWYgKGkgPT09IDApIHNsaWRlUG9zaXRpb24gPSBzbGlkZVBvc2l0aW9uIC0gc3dpcGVyU2l6ZSAvIDIgLSBzcGFjZUJldHdlZW47XG4gICAgICBpZiAoTWF0aC5hYnMoc2xpZGVQb3NpdGlvbikgPCAxIC8gMTAwMCkgc2xpZGVQb3NpdGlvbiA9IDA7XG4gICAgICBpZiAocGFyYW1zLnJvdW5kTGVuZ3Rocykgc2xpZGVQb3NpdGlvbiA9IE1hdGguZmxvb3Ioc2xpZGVQb3NpdGlvbik7XG4gICAgICBpZiAoaW5kZXggJSBwYXJhbXMuc2xpZGVzUGVyR3JvdXAgPT09IDApIHNuYXBHcmlkLnB1c2goc2xpZGVQb3NpdGlvbik7XG4gICAgICBzbGlkZXNHcmlkLnB1c2goc2xpZGVQb3NpdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChwYXJhbXMucm91bmRMZW5ndGhzKSBzbGlkZVBvc2l0aW9uID0gTWF0aC5mbG9vcihzbGlkZVBvc2l0aW9uKTtcbiAgICAgIGlmICgoaW5kZXggLSBNYXRoLm1pbihzd2lwZXIucGFyYW1zLnNsaWRlc1Blckdyb3VwU2tpcCwgaW5kZXgpKSAlIHN3aXBlci5wYXJhbXMuc2xpZGVzUGVyR3JvdXAgPT09IDApIHNuYXBHcmlkLnB1c2goc2xpZGVQb3NpdGlvbik7XG4gICAgICBzbGlkZXNHcmlkLnB1c2goc2xpZGVQb3NpdGlvbik7XG4gICAgICBzbGlkZVBvc2l0aW9uID0gc2xpZGVQb3NpdGlvbiArIHNsaWRlU2l6ZSArIHNwYWNlQmV0d2VlbjtcbiAgICB9XG4gICAgc3dpcGVyLnZpcnR1YWxTaXplICs9IHNsaWRlU2l6ZSArIHNwYWNlQmV0d2VlbjtcbiAgICBwcmV2U2xpZGVTaXplID0gc2xpZGVTaXplO1xuICAgIGluZGV4ICs9IDE7XG4gIH1cbiAgc3dpcGVyLnZpcnR1YWxTaXplID0gTWF0aC5tYXgoc3dpcGVyLnZpcnR1YWxTaXplLCBzd2lwZXJTaXplKSArIG9mZnNldEFmdGVyO1xuICBpZiAocnRsICYmIHdyb25nUlRMICYmIChwYXJhbXMuZWZmZWN0ID09PSAnc2xpZGUnIHx8IHBhcmFtcy5lZmZlY3QgPT09ICdjb3ZlcmZsb3cnKSkge1xuICAgIHdyYXBwZXJFbC5zdHlsZS53aWR0aCA9IGAke3N3aXBlci52aXJ0dWFsU2l6ZSArIHNwYWNlQmV0d2Vlbn1weGA7XG4gIH1cbiAgaWYgKHBhcmFtcy5zZXRXcmFwcGVyU2l6ZSkge1xuICAgIHdyYXBwZXJFbC5zdHlsZVtzd2lwZXIuZ2V0RGlyZWN0aW9uTGFiZWwoJ3dpZHRoJyldID0gYCR7c3dpcGVyLnZpcnR1YWxTaXplICsgc3BhY2VCZXR3ZWVufXB4YDtcbiAgfVxuICBpZiAoZ3JpZEVuYWJsZWQpIHtcbiAgICBzd2lwZXIuZ3JpZC51cGRhdGVXcmFwcGVyU2l6ZShzbGlkZVNpemUsIHNuYXBHcmlkKTtcbiAgfVxuXG4gIC8vIFJlbW92ZSBsYXN0IGdyaWQgZWxlbWVudHMgZGVwZW5kaW5nIG9uIHdpZHRoXG4gIGlmICghcGFyYW1zLmNlbnRlcmVkU2xpZGVzKSB7XG4gICAgY29uc3QgbmV3U2xpZGVzR3JpZCA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc25hcEdyaWQubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGxldCBzbGlkZXNHcmlkSXRlbSA9IHNuYXBHcmlkW2ldO1xuICAgICAgaWYgKHBhcmFtcy5yb3VuZExlbmd0aHMpIHNsaWRlc0dyaWRJdGVtID0gTWF0aC5mbG9vcihzbGlkZXNHcmlkSXRlbSk7XG4gICAgICBpZiAoc25hcEdyaWRbaV0gPD0gc3dpcGVyLnZpcnR1YWxTaXplIC0gc3dpcGVyU2l6ZSkge1xuICAgICAgICBuZXdTbGlkZXNHcmlkLnB1c2goc2xpZGVzR3JpZEl0ZW0pO1xuICAgICAgfVxuICAgIH1cbiAgICBzbmFwR3JpZCA9IG5ld1NsaWRlc0dyaWQ7XG4gICAgaWYgKE1hdGguZmxvb3Ioc3dpcGVyLnZpcnR1YWxTaXplIC0gc3dpcGVyU2l6ZSkgLSBNYXRoLmZsb29yKHNuYXBHcmlkW3NuYXBHcmlkLmxlbmd0aCAtIDFdKSA+IDEpIHtcbiAgICAgIHNuYXBHcmlkLnB1c2goc3dpcGVyLnZpcnR1YWxTaXplIC0gc3dpcGVyU2l6ZSk7XG4gICAgfVxuICB9XG4gIGlmIChpc1ZpcnR1YWwgJiYgcGFyYW1zLmxvb3ApIHtcbiAgICBjb25zdCBzaXplID0gc2xpZGVzU2l6ZXNHcmlkWzBdICsgc3BhY2VCZXR3ZWVuO1xuICAgIGlmIChwYXJhbXMuc2xpZGVzUGVyR3JvdXAgPiAxKSB7XG4gICAgICBjb25zdCBncm91cHMgPSBNYXRoLmNlaWwoKHN3aXBlci52aXJ0dWFsLnNsaWRlc0JlZm9yZSArIHN3aXBlci52aXJ0dWFsLnNsaWRlc0FmdGVyKSAvIHBhcmFtcy5zbGlkZXNQZXJHcm91cCk7XG4gICAgICBjb25zdCBncm91cFNpemUgPSBzaXplICogcGFyYW1zLnNsaWRlc1Blckdyb3VwO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncm91cHM7IGkgKz0gMSkge1xuICAgICAgICBzbmFwR3JpZC5wdXNoKHNuYXBHcmlkW3NuYXBHcmlkLmxlbmd0aCAtIDFdICsgZ3JvdXBTaXplKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzd2lwZXIudmlydHVhbC5zbGlkZXNCZWZvcmUgKyBzd2lwZXIudmlydHVhbC5zbGlkZXNBZnRlcjsgaSArPSAxKSB7XG4gICAgICBpZiAocGFyYW1zLnNsaWRlc1Blckdyb3VwID09PSAxKSB7XG4gICAgICAgIHNuYXBHcmlkLnB1c2goc25hcEdyaWRbc25hcEdyaWQubGVuZ3RoIC0gMV0gKyBzaXplKTtcbiAgICAgIH1cbiAgICAgIHNsaWRlc0dyaWQucHVzaChzbGlkZXNHcmlkW3NsaWRlc0dyaWQubGVuZ3RoIC0gMV0gKyBzaXplKTtcbiAgICAgIHN3aXBlci52aXJ0dWFsU2l6ZSArPSBzaXplO1xuICAgIH1cbiAgfVxuICBpZiAoc25hcEdyaWQubGVuZ3RoID09PSAwKSBzbmFwR3JpZCA9IFswXTtcbiAgaWYgKHNwYWNlQmV0d2VlbiAhPT0gMCkge1xuICAgIGNvbnN0IGtleSA9IHN3aXBlci5pc0hvcml6b250YWwoKSAmJiBydGwgPyAnbWFyZ2luTGVmdCcgOiBzd2lwZXIuZ2V0RGlyZWN0aW9uTGFiZWwoJ21hcmdpblJpZ2h0Jyk7XG4gICAgc2xpZGVzLmZpbHRlcigoXywgc2xpZGVJbmRleCkgPT4ge1xuICAgICAgaWYgKCFwYXJhbXMuY3NzTW9kZSB8fCBwYXJhbXMubG9vcCkgcmV0dXJuIHRydWU7XG4gICAgICBpZiAoc2xpZGVJbmRleCA9PT0gc2xpZGVzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSkuZm9yRWFjaChzbGlkZUVsID0+IHtcbiAgICAgIHNsaWRlRWwuc3R5bGVba2V5XSA9IGAke3NwYWNlQmV0d2Vlbn1weGA7XG4gICAgfSk7XG4gIH1cbiAgaWYgKHBhcmFtcy5jZW50ZXJlZFNsaWRlcyAmJiBwYXJhbXMuY2VudGVyZWRTbGlkZXNCb3VuZHMpIHtcbiAgICBsZXQgYWxsU2xpZGVzU2l6ZSA9IDA7XG4gICAgc2xpZGVzU2l6ZXNHcmlkLmZvckVhY2goc2xpZGVTaXplVmFsdWUgPT4ge1xuICAgICAgYWxsU2xpZGVzU2l6ZSArPSBzbGlkZVNpemVWYWx1ZSArIChzcGFjZUJldHdlZW4gfHwgMCk7XG4gICAgfSk7XG4gICAgYWxsU2xpZGVzU2l6ZSAtPSBzcGFjZUJldHdlZW47XG4gICAgY29uc3QgbWF4U25hcCA9IGFsbFNsaWRlc1NpemUgLSBzd2lwZXJTaXplO1xuICAgIHNuYXBHcmlkID0gc25hcEdyaWQubWFwKHNuYXAgPT4ge1xuICAgICAgaWYgKHNuYXAgPD0gMCkgcmV0dXJuIC1vZmZzZXRCZWZvcmU7XG4gICAgICBpZiAoc25hcCA+IG1heFNuYXApIHJldHVybiBtYXhTbmFwICsgb2Zmc2V0QWZ0ZXI7XG4gICAgICByZXR1cm4gc25hcDtcbiAgICB9KTtcbiAgfVxuICBpZiAocGFyYW1zLmNlbnRlckluc3VmZmljaWVudFNsaWRlcykge1xuICAgIGxldCBhbGxTbGlkZXNTaXplID0gMDtcbiAgICBzbGlkZXNTaXplc0dyaWQuZm9yRWFjaChzbGlkZVNpemVWYWx1ZSA9PiB7XG4gICAgICBhbGxTbGlkZXNTaXplICs9IHNsaWRlU2l6ZVZhbHVlICsgKHNwYWNlQmV0d2VlbiB8fCAwKTtcbiAgICB9KTtcbiAgICBhbGxTbGlkZXNTaXplIC09IHNwYWNlQmV0d2VlbjtcbiAgICBpZiAoYWxsU2xpZGVzU2l6ZSA8IHN3aXBlclNpemUpIHtcbiAgICAgIGNvbnN0IGFsbFNsaWRlc09mZnNldCA9IChzd2lwZXJTaXplIC0gYWxsU2xpZGVzU2l6ZSkgLyAyO1xuICAgICAgc25hcEdyaWQuZm9yRWFjaCgoc25hcCwgc25hcEluZGV4KSA9PiB7XG4gICAgICAgIHNuYXBHcmlkW3NuYXBJbmRleF0gPSBzbmFwIC0gYWxsU2xpZGVzT2Zmc2V0O1xuICAgICAgfSk7XG4gICAgICBzbGlkZXNHcmlkLmZvckVhY2goKHNuYXAsIHNuYXBJbmRleCkgPT4ge1xuICAgICAgICBzbGlkZXNHcmlkW3NuYXBJbmRleF0gPSBzbmFwICsgYWxsU2xpZGVzT2Zmc2V0O1xuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIE9iamVjdC5hc3NpZ24oc3dpcGVyLCB7XG4gICAgc2xpZGVzLFxuICAgIHNuYXBHcmlkLFxuICAgIHNsaWRlc0dyaWQsXG4gICAgc2xpZGVzU2l6ZXNHcmlkXG4gIH0pO1xuICBpZiAocGFyYW1zLmNlbnRlcmVkU2xpZGVzICYmIHBhcmFtcy5jc3NNb2RlICYmICFwYXJhbXMuY2VudGVyZWRTbGlkZXNCb3VuZHMpIHtcbiAgICBzZXRDU1NQcm9wZXJ0eSh3cmFwcGVyRWwsICctLXN3aXBlci1jZW50ZXJlZC1vZmZzZXQtYmVmb3JlJywgYCR7LXNuYXBHcmlkWzBdfXB4YCk7XG4gICAgc2V0Q1NTUHJvcGVydHkod3JhcHBlckVsLCAnLS1zd2lwZXItY2VudGVyZWQtb2Zmc2V0LWFmdGVyJywgYCR7c3dpcGVyLnNpemUgLyAyIC0gc2xpZGVzU2l6ZXNHcmlkW3NsaWRlc1NpemVzR3JpZC5sZW5ndGggLSAxXSAvIDJ9cHhgKTtcbiAgICBjb25zdCBhZGRUb1NuYXBHcmlkID0gLXN3aXBlci5zbmFwR3JpZFswXTtcbiAgICBjb25zdCBhZGRUb1NsaWRlc0dyaWQgPSAtc3dpcGVyLnNsaWRlc0dyaWRbMF07XG4gICAgc3dpcGVyLnNuYXBHcmlkID0gc3dpcGVyLnNuYXBHcmlkLm1hcCh2ID0+IHYgKyBhZGRUb1NuYXBHcmlkKTtcbiAgICBzd2lwZXIuc2xpZGVzR3JpZCA9IHN3aXBlci5zbGlkZXNHcmlkLm1hcCh2ID0+IHYgKyBhZGRUb1NsaWRlc0dyaWQpO1xuICB9XG4gIGlmIChzbGlkZXNMZW5ndGggIT09IHByZXZpb3VzU2xpZGVzTGVuZ3RoKSB7XG4gICAgc3dpcGVyLmVtaXQoJ3NsaWRlc0xlbmd0aENoYW5nZScpO1xuICB9XG4gIGlmIChzbmFwR3JpZC5sZW5ndGggIT09IHByZXZpb3VzU25hcEdyaWRMZW5ndGgpIHtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy53YXRjaE92ZXJmbG93KSBzd2lwZXIuY2hlY2tPdmVyZmxvdygpO1xuICAgIHN3aXBlci5lbWl0KCdzbmFwR3JpZExlbmd0aENoYW5nZScpO1xuICB9XG4gIGlmIChzbGlkZXNHcmlkLmxlbmd0aCAhPT0gcHJldmlvdXNTbGlkZXNHcmlkTGVuZ3RoKSB7XG4gICAgc3dpcGVyLmVtaXQoJ3NsaWRlc0dyaWRMZW5ndGhDaGFuZ2UnKTtcbiAgfVxuICBpZiAocGFyYW1zLndhdGNoU2xpZGVzUHJvZ3Jlc3MpIHtcbiAgICBzd2lwZXIudXBkYXRlU2xpZGVzT2Zmc2V0KCk7XG4gIH1cbiAgc3dpcGVyLmVtaXQoJ3NsaWRlc1VwZGF0ZWQnKTtcbiAgaWYgKCFpc1ZpcnR1YWwgJiYgIXBhcmFtcy5jc3NNb2RlICYmIChwYXJhbXMuZWZmZWN0ID09PSAnc2xpZGUnIHx8IHBhcmFtcy5lZmZlY3QgPT09ICdmYWRlJykpIHtcbiAgICBjb25zdCBiYWNrRmFjZUhpZGRlbkNsYXNzID0gYCR7cGFyYW1zLmNvbnRhaW5lck1vZGlmaWVyQ2xhc3N9YmFja2ZhY2UtaGlkZGVuYDtcbiAgICBjb25zdCBoYXNDbGFzc0JhY2tmYWNlQ2xhc3NBZGRlZCA9IHN3aXBlci5lbC5jbGFzc0xpc3QuY29udGFpbnMoYmFja0ZhY2VIaWRkZW5DbGFzcyk7XG4gICAgaWYgKHNsaWRlc0xlbmd0aCA8PSBwYXJhbXMubWF4QmFja2ZhY2VIaWRkZW5TbGlkZXMpIHtcbiAgICAgIGlmICghaGFzQ2xhc3NCYWNrZmFjZUNsYXNzQWRkZWQpIHN3aXBlci5lbC5jbGFzc0xpc3QuYWRkKGJhY2tGYWNlSGlkZGVuQ2xhc3MpO1xuICAgIH0gZWxzZSBpZiAoaGFzQ2xhc3NCYWNrZmFjZUNsYXNzQWRkZWQpIHtcbiAgICAgIHN3aXBlci5lbC5jbGFzc0xpc3QucmVtb3ZlKGJhY2tGYWNlSGlkZGVuQ2xhc3MpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiB1cGRhdGVBdXRvSGVpZ2h0KHNwZWVkKSB7XG4gIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gIGNvbnN0IGFjdGl2ZVNsaWRlcyA9IFtdO1xuICBjb25zdCBpc1ZpcnR1YWwgPSBzd2lwZXIudmlydHVhbCAmJiBzd2lwZXIucGFyYW1zLnZpcnR1YWwuZW5hYmxlZDtcbiAgbGV0IG5ld0hlaWdodCA9IDA7XG4gIGxldCBpO1xuICBpZiAodHlwZW9mIHNwZWVkID09PSAnbnVtYmVyJykge1xuICAgIHN3aXBlci5zZXRUcmFuc2l0aW9uKHNwZWVkKTtcbiAgfSBlbHNlIGlmIChzcGVlZCA9PT0gdHJ1ZSkge1xuICAgIHN3aXBlci5zZXRUcmFuc2l0aW9uKHN3aXBlci5wYXJhbXMuc3BlZWQpO1xuICB9XG4gIGNvbnN0IGdldFNsaWRlQnlJbmRleCA9IGluZGV4ID0+IHtcbiAgICBpZiAoaXNWaXJ0dWFsKSB7XG4gICAgICByZXR1cm4gc3dpcGVyLnNsaWRlc1tzd2lwZXIuZ2V0U2xpZGVJbmRleEJ5RGF0YShpbmRleCldO1xuICAgIH1cbiAgICByZXR1cm4gc3dpcGVyLnNsaWRlc1tpbmRleF07XG4gIH07XG4gIC8vIEZpbmQgc2xpZGVzIGN1cnJlbnRseSBpbiB2aWV3XG4gIGlmIChzd2lwZXIucGFyYW1zLnNsaWRlc1BlclZpZXcgIT09ICdhdXRvJyAmJiBzd2lwZXIucGFyYW1zLnNsaWRlc1BlclZpZXcgPiAxKSB7XG4gICAgaWYgKHN3aXBlci5wYXJhbXMuY2VudGVyZWRTbGlkZXMpIHtcbiAgICAgIChzd2lwZXIudmlzaWJsZVNsaWRlcyB8fCBbXSkuZm9yRWFjaChzbGlkZSA9PiB7XG4gICAgICAgIGFjdGl2ZVNsaWRlcy5wdXNoKHNsaWRlKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgTWF0aC5jZWlsKHN3aXBlci5wYXJhbXMuc2xpZGVzUGVyVmlldyk7IGkgKz0gMSkge1xuICAgICAgICBjb25zdCBpbmRleCA9IHN3aXBlci5hY3RpdmVJbmRleCArIGk7XG4gICAgICAgIGlmIChpbmRleCA+IHN3aXBlci5zbGlkZXMubGVuZ3RoICYmICFpc1ZpcnR1YWwpIGJyZWFrO1xuICAgICAgICBhY3RpdmVTbGlkZXMucHVzaChnZXRTbGlkZUJ5SW5kZXgoaW5kZXgpKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgYWN0aXZlU2xpZGVzLnB1c2goZ2V0U2xpZGVCeUluZGV4KHN3aXBlci5hY3RpdmVJbmRleCkpO1xuICB9XG5cbiAgLy8gRmluZCBuZXcgaGVpZ2h0IGZyb20gaGlnaGVzdCBzbGlkZSBpbiB2aWV3XG4gIGZvciAoaSA9IDA7IGkgPCBhY3RpdmVTbGlkZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICBpZiAodHlwZW9mIGFjdGl2ZVNsaWRlc1tpXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbnN0IGhlaWdodCA9IGFjdGl2ZVNsaWRlc1tpXS5vZmZzZXRIZWlnaHQ7XG4gICAgICBuZXdIZWlnaHQgPSBoZWlnaHQgPiBuZXdIZWlnaHQgPyBoZWlnaHQgOiBuZXdIZWlnaHQ7XG4gICAgfVxuICB9XG5cbiAgLy8gVXBkYXRlIEhlaWdodFxuICBpZiAobmV3SGVpZ2h0IHx8IG5ld0hlaWdodCA9PT0gMCkgc3dpcGVyLndyYXBwZXJFbC5zdHlsZS5oZWlnaHQgPSBgJHtuZXdIZWlnaHR9cHhgO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVTbGlkZXNPZmZzZXQoKSB7XG4gIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gIGNvbnN0IHNsaWRlcyA9IHN3aXBlci5zbGlkZXM7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICBjb25zdCBtaW51c09mZnNldCA9IHN3aXBlci5pc0VsZW1lbnQgPyBzd2lwZXIuaXNIb3Jpem9udGFsKCkgPyBzd2lwZXIud3JhcHBlckVsLm9mZnNldExlZnQgOiBzd2lwZXIud3JhcHBlckVsLm9mZnNldFRvcCA6IDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc2xpZGVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgc2xpZGVzW2ldLnN3aXBlclNsaWRlT2Zmc2V0ID0gKHN3aXBlci5pc0hvcml6b250YWwoKSA/IHNsaWRlc1tpXS5vZmZzZXRMZWZ0IDogc2xpZGVzW2ldLm9mZnNldFRvcCkgLSBtaW51c09mZnNldCAtIHN3aXBlci5jc3NPdmVyZmxvd0FkanVzdG1lbnQoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiB1cGRhdGVTbGlkZXNQcm9ncmVzcyh0cmFuc2xhdGUpIHtcbiAgaWYgKHRyYW5zbGF0ZSA9PT0gdm9pZCAwKSB7XG4gICAgdHJhbnNsYXRlID0gdGhpcyAmJiB0aGlzLnRyYW5zbGF0ZSB8fCAwO1xuICB9XG4gIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gIGNvbnN0IHBhcmFtcyA9IHN3aXBlci5wYXJhbXM7XG4gIGNvbnN0IHtcbiAgICBzbGlkZXMsXG4gICAgcnRsVHJhbnNsYXRlOiBydGwsXG4gICAgc25hcEdyaWRcbiAgfSA9IHN3aXBlcjtcbiAgaWYgKHNsaWRlcy5sZW5ndGggPT09IDApIHJldHVybjtcbiAgaWYgKHR5cGVvZiBzbGlkZXNbMF0uc3dpcGVyU2xpZGVPZmZzZXQgPT09ICd1bmRlZmluZWQnKSBzd2lwZXIudXBkYXRlU2xpZGVzT2Zmc2V0KCk7XG4gIGxldCBvZmZzZXRDZW50ZXIgPSAtdHJhbnNsYXRlO1xuICBpZiAocnRsKSBvZmZzZXRDZW50ZXIgPSB0cmFuc2xhdGU7XG5cbiAgLy8gVmlzaWJsZSBTbGlkZXNcbiAgc2xpZGVzLmZvckVhY2goc2xpZGVFbCA9PiB7XG4gICAgc2xpZGVFbC5jbGFzc0xpc3QucmVtb3ZlKHBhcmFtcy5zbGlkZVZpc2libGVDbGFzcywgcGFyYW1zLnNsaWRlRnVsbHlWaXNpYmxlQ2xhc3MpO1xuICB9KTtcbiAgc3dpcGVyLnZpc2libGVTbGlkZXNJbmRleGVzID0gW107XG4gIHN3aXBlci52aXNpYmxlU2xpZGVzID0gW107XG4gIGxldCBzcGFjZUJldHdlZW4gPSBwYXJhbXMuc3BhY2VCZXR3ZWVuO1xuICBpZiAodHlwZW9mIHNwYWNlQmV0d2VlbiA9PT0gJ3N0cmluZycgJiYgc3BhY2VCZXR3ZWVuLmluZGV4T2YoJyUnKSA+PSAwKSB7XG4gICAgc3BhY2VCZXR3ZWVuID0gcGFyc2VGbG9hdChzcGFjZUJldHdlZW4ucmVwbGFjZSgnJScsICcnKSkgLyAxMDAgKiBzd2lwZXIuc2l6ZTtcbiAgfSBlbHNlIGlmICh0eXBlb2Ygc3BhY2VCZXR3ZWVuID09PSAnc3RyaW5nJykge1xuICAgIHNwYWNlQmV0d2VlbiA9IHBhcnNlRmxvYXQoc3BhY2VCZXR3ZWVuKTtcbiAgfVxuICBmb3IgKGxldCBpID0gMDsgaSA8IHNsaWRlcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgIGNvbnN0IHNsaWRlID0gc2xpZGVzW2ldO1xuICAgIGxldCBzbGlkZU9mZnNldCA9IHNsaWRlLnN3aXBlclNsaWRlT2Zmc2V0O1xuICAgIGlmIChwYXJhbXMuY3NzTW9kZSAmJiBwYXJhbXMuY2VudGVyZWRTbGlkZXMpIHtcbiAgICAgIHNsaWRlT2Zmc2V0IC09IHNsaWRlc1swXS5zd2lwZXJTbGlkZU9mZnNldDtcbiAgICB9XG4gICAgY29uc3Qgc2xpZGVQcm9ncmVzcyA9IChvZmZzZXRDZW50ZXIgKyAocGFyYW1zLmNlbnRlcmVkU2xpZGVzID8gc3dpcGVyLm1pblRyYW5zbGF0ZSgpIDogMCkgLSBzbGlkZU9mZnNldCkgLyAoc2xpZGUuc3dpcGVyU2xpZGVTaXplICsgc3BhY2VCZXR3ZWVuKTtcbiAgICBjb25zdCBvcmlnaW5hbFNsaWRlUHJvZ3Jlc3MgPSAob2Zmc2V0Q2VudGVyIC0gc25hcEdyaWRbMF0gKyAocGFyYW1zLmNlbnRlcmVkU2xpZGVzID8gc3dpcGVyLm1pblRyYW5zbGF0ZSgpIDogMCkgLSBzbGlkZU9mZnNldCkgLyAoc2xpZGUuc3dpcGVyU2xpZGVTaXplICsgc3BhY2VCZXR3ZWVuKTtcbiAgICBjb25zdCBzbGlkZUJlZm9yZSA9IC0ob2Zmc2V0Q2VudGVyIC0gc2xpZGVPZmZzZXQpO1xuICAgIGNvbnN0IHNsaWRlQWZ0ZXIgPSBzbGlkZUJlZm9yZSArIHN3aXBlci5zbGlkZXNTaXplc0dyaWRbaV07XG4gICAgY29uc3QgaXNGdWxseVZpc2libGUgPSBzbGlkZUJlZm9yZSA+PSAwICYmIHNsaWRlQmVmb3JlIDw9IHN3aXBlci5zaXplIC0gc3dpcGVyLnNsaWRlc1NpemVzR3JpZFtpXTtcbiAgICBjb25zdCBpc1Zpc2libGUgPSBzbGlkZUJlZm9yZSA+PSAwICYmIHNsaWRlQmVmb3JlIDwgc3dpcGVyLnNpemUgLSAxIHx8IHNsaWRlQWZ0ZXIgPiAxICYmIHNsaWRlQWZ0ZXIgPD0gc3dpcGVyLnNpemUgfHwgc2xpZGVCZWZvcmUgPD0gMCAmJiBzbGlkZUFmdGVyID49IHN3aXBlci5zaXplO1xuICAgIGlmIChpc1Zpc2libGUpIHtcbiAgICAgIHN3aXBlci52aXNpYmxlU2xpZGVzLnB1c2goc2xpZGUpO1xuICAgICAgc3dpcGVyLnZpc2libGVTbGlkZXNJbmRleGVzLnB1c2goaSk7XG4gICAgICBzbGlkZXNbaV0uY2xhc3NMaXN0LmFkZChwYXJhbXMuc2xpZGVWaXNpYmxlQ2xhc3MpO1xuICAgIH1cbiAgICBpZiAoaXNGdWxseVZpc2libGUpIHtcbiAgICAgIHNsaWRlc1tpXS5jbGFzc0xpc3QuYWRkKHBhcmFtcy5zbGlkZUZ1bGx5VmlzaWJsZUNsYXNzKTtcbiAgICB9XG4gICAgc2xpZGUucHJvZ3Jlc3MgPSBydGwgPyAtc2xpZGVQcm9ncmVzcyA6IHNsaWRlUHJvZ3Jlc3M7XG4gICAgc2xpZGUub3JpZ2luYWxQcm9ncmVzcyA9IHJ0bCA/IC1vcmlnaW5hbFNsaWRlUHJvZ3Jlc3MgOiBvcmlnaW5hbFNsaWRlUHJvZ3Jlc3M7XG4gIH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlUHJvZ3Jlc3ModHJhbnNsYXRlKSB7XG4gIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gIGlmICh0eXBlb2YgdHJhbnNsYXRlID09PSAndW5kZWZpbmVkJykge1xuICAgIGNvbnN0IG11bHRpcGxpZXIgPSBzd2lwZXIucnRsVHJhbnNsYXRlID8gLTEgOiAxO1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgIHRyYW5zbGF0ZSA9IHN3aXBlciAmJiBzd2lwZXIudHJhbnNsYXRlICYmIHN3aXBlci50cmFuc2xhdGUgKiBtdWx0aXBsaWVyIHx8IDA7XG4gIH1cbiAgY29uc3QgcGFyYW1zID0gc3dpcGVyLnBhcmFtcztcbiAgY29uc3QgdHJhbnNsYXRlc0RpZmYgPSBzd2lwZXIubWF4VHJhbnNsYXRlKCkgLSBzd2lwZXIubWluVHJhbnNsYXRlKCk7XG4gIGxldCB7XG4gICAgcHJvZ3Jlc3MsXG4gICAgaXNCZWdpbm5pbmcsXG4gICAgaXNFbmQsXG4gICAgcHJvZ3Jlc3NMb29wXG4gIH0gPSBzd2lwZXI7XG4gIGNvbnN0IHdhc0JlZ2lubmluZyA9IGlzQmVnaW5uaW5nO1xuICBjb25zdCB3YXNFbmQgPSBpc0VuZDtcbiAgaWYgKHRyYW5zbGF0ZXNEaWZmID09PSAwKSB7XG4gICAgcHJvZ3Jlc3MgPSAwO1xuICAgIGlzQmVnaW5uaW5nID0gdHJ1ZTtcbiAgICBpc0VuZCA9IHRydWU7XG4gIH0gZWxzZSB7XG4gICAgcHJvZ3Jlc3MgPSAodHJhbnNsYXRlIC0gc3dpcGVyLm1pblRyYW5zbGF0ZSgpKSAvIHRyYW5zbGF0ZXNEaWZmO1xuICAgIGNvbnN0IGlzQmVnaW5uaW5nUm91bmRlZCA9IE1hdGguYWJzKHRyYW5zbGF0ZSAtIHN3aXBlci5taW5UcmFuc2xhdGUoKSkgPCAxO1xuICAgIGNvbnN0IGlzRW5kUm91bmRlZCA9IE1hdGguYWJzKHRyYW5zbGF0ZSAtIHN3aXBlci5tYXhUcmFuc2xhdGUoKSkgPCAxO1xuICAgIGlzQmVnaW5uaW5nID0gaXNCZWdpbm5pbmdSb3VuZGVkIHx8IHByb2dyZXNzIDw9IDA7XG4gICAgaXNFbmQgPSBpc0VuZFJvdW5kZWQgfHwgcHJvZ3Jlc3MgPj0gMTtcbiAgICBpZiAoaXNCZWdpbm5pbmdSb3VuZGVkKSBwcm9ncmVzcyA9IDA7XG4gICAgaWYgKGlzRW5kUm91bmRlZCkgcHJvZ3Jlc3MgPSAxO1xuICB9XG4gIGlmIChwYXJhbXMubG9vcCkge1xuICAgIGNvbnN0IGZpcnN0U2xpZGVJbmRleCA9IHN3aXBlci5nZXRTbGlkZUluZGV4QnlEYXRhKDApO1xuICAgIGNvbnN0IGxhc3RTbGlkZUluZGV4ID0gc3dpcGVyLmdldFNsaWRlSW5kZXhCeURhdGEoc3dpcGVyLnNsaWRlcy5sZW5ndGggLSAxKTtcbiAgICBjb25zdCBmaXJzdFNsaWRlVHJhbnNsYXRlID0gc3dpcGVyLnNsaWRlc0dyaWRbZmlyc3RTbGlkZUluZGV4XTtcbiAgICBjb25zdCBsYXN0U2xpZGVUcmFuc2xhdGUgPSBzd2lwZXIuc2xpZGVzR3JpZFtsYXN0U2xpZGVJbmRleF07XG4gICAgY29uc3QgdHJhbnNsYXRlTWF4ID0gc3dpcGVyLnNsaWRlc0dyaWRbc3dpcGVyLnNsaWRlc0dyaWQubGVuZ3RoIC0gMV07XG4gICAgY29uc3QgdHJhbnNsYXRlQWJzID0gTWF0aC5hYnModHJhbnNsYXRlKTtcbiAgICBpZiAodHJhbnNsYXRlQWJzID49IGZpcnN0U2xpZGVUcmFuc2xhdGUpIHtcbiAgICAgIHByb2dyZXNzTG9vcCA9ICh0cmFuc2xhdGVBYnMgLSBmaXJzdFNsaWRlVHJhbnNsYXRlKSAvIHRyYW5zbGF0ZU1heDtcbiAgICB9IGVsc2Uge1xuICAgICAgcHJvZ3Jlc3NMb29wID0gKHRyYW5zbGF0ZUFicyArIHRyYW5zbGF0ZU1heCAtIGxhc3RTbGlkZVRyYW5zbGF0ZSkgLyB0cmFuc2xhdGVNYXg7XG4gICAgfVxuICAgIGlmIChwcm9ncmVzc0xvb3AgPiAxKSBwcm9ncmVzc0xvb3AgLT0gMTtcbiAgfVxuICBPYmplY3QuYXNzaWduKHN3aXBlciwge1xuICAgIHByb2dyZXNzLFxuICAgIHByb2dyZXNzTG9vcCxcbiAgICBpc0JlZ2lubmluZyxcbiAgICBpc0VuZFxuICB9KTtcbiAgaWYgKHBhcmFtcy53YXRjaFNsaWRlc1Byb2dyZXNzIHx8IHBhcmFtcy5jZW50ZXJlZFNsaWRlcyAmJiBwYXJhbXMuYXV0b0hlaWdodCkgc3dpcGVyLnVwZGF0ZVNsaWRlc1Byb2dyZXNzKHRyYW5zbGF0ZSk7XG4gIGlmIChpc0JlZ2lubmluZyAmJiAhd2FzQmVnaW5uaW5nKSB7XG4gICAgc3dpcGVyLmVtaXQoJ3JlYWNoQmVnaW5uaW5nIHRvRWRnZScpO1xuICB9XG4gIGlmIChpc0VuZCAmJiAhd2FzRW5kKSB7XG4gICAgc3dpcGVyLmVtaXQoJ3JlYWNoRW5kIHRvRWRnZScpO1xuICB9XG4gIGlmICh3YXNCZWdpbm5pbmcgJiYgIWlzQmVnaW5uaW5nIHx8IHdhc0VuZCAmJiAhaXNFbmQpIHtcbiAgICBzd2lwZXIuZW1pdCgnZnJvbUVkZ2UnKTtcbiAgfVxuICBzd2lwZXIuZW1pdCgncHJvZ3Jlc3MnLCBwcm9ncmVzcyk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVNsaWRlc0NsYXNzZXMoKSB7XG4gIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gIGNvbnN0IHtcbiAgICBzbGlkZXMsXG4gICAgcGFyYW1zLFxuICAgIHNsaWRlc0VsLFxuICAgIGFjdGl2ZUluZGV4XG4gIH0gPSBzd2lwZXI7XG4gIGNvbnN0IGlzVmlydHVhbCA9IHN3aXBlci52aXJ0dWFsICYmIHBhcmFtcy52aXJ0dWFsLmVuYWJsZWQ7XG4gIGNvbnN0IGdyaWRFbmFibGVkID0gc3dpcGVyLmdyaWQgJiYgcGFyYW1zLmdyaWQgJiYgcGFyYW1zLmdyaWQucm93cyA+IDE7XG4gIGNvbnN0IGdldEZpbHRlcmVkU2xpZGUgPSBzZWxlY3RvciA9PiB7XG4gICAgcmV0dXJuIGVsZW1lbnRDaGlsZHJlbihzbGlkZXNFbCwgYC4ke3BhcmFtcy5zbGlkZUNsYXNzfSR7c2VsZWN0b3J9LCBzd2lwZXItc2xpZGUke3NlbGVjdG9yfWApWzBdO1xuICB9O1xuICBzbGlkZXMuZm9yRWFjaChzbGlkZUVsID0+IHtcbiAgICBzbGlkZUVsLmNsYXNzTGlzdC5yZW1vdmUocGFyYW1zLnNsaWRlQWN0aXZlQ2xhc3MsIHBhcmFtcy5zbGlkZU5leHRDbGFzcywgcGFyYW1zLnNsaWRlUHJldkNsYXNzKTtcbiAgfSk7XG4gIGxldCBhY3RpdmVTbGlkZTtcbiAgbGV0IHByZXZTbGlkZTtcbiAgbGV0IG5leHRTbGlkZTtcbiAgaWYgKGlzVmlydHVhbCkge1xuICAgIGlmIChwYXJhbXMubG9vcCkge1xuICAgICAgbGV0IHNsaWRlSW5kZXggPSBhY3RpdmVJbmRleCAtIHN3aXBlci52aXJ0dWFsLnNsaWRlc0JlZm9yZTtcbiAgICAgIGlmIChzbGlkZUluZGV4IDwgMCkgc2xpZGVJbmRleCA9IHN3aXBlci52aXJ0dWFsLnNsaWRlcy5sZW5ndGggKyBzbGlkZUluZGV4O1xuICAgICAgaWYgKHNsaWRlSW5kZXggPj0gc3dpcGVyLnZpcnR1YWwuc2xpZGVzLmxlbmd0aCkgc2xpZGVJbmRleCAtPSBzd2lwZXIudmlydHVhbC5zbGlkZXMubGVuZ3RoO1xuICAgICAgYWN0aXZlU2xpZGUgPSBnZXRGaWx0ZXJlZFNsaWRlKGBbZGF0YS1zd2lwZXItc2xpZGUtaW5kZXg9XCIke3NsaWRlSW5kZXh9XCJdYCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFjdGl2ZVNsaWRlID0gZ2V0RmlsdGVyZWRTbGlkZShgW2RhdGEtc3dpcGVyLXNsaWRlLWluZGV4PVwiJHthY3RpdmVJbmRleH1cIl1gKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGdyaWRFbmFibGVkKSB7XG4gICAgICBhY3RpdmVTbGlkZSA9IHNsaWRlcy5maWx0ZXIoc2xpZGVFbCA9PiBzbGlkZUVsLmNvbHVtbiA9PT0gYWN0aXZlSW5kZXgpWzBdO1xuICAgICAgbmV4dFNsaWRlID0gc2xpZGVzLmZpbHRlcihzbGlkZUVsID0+IHNsaWRlRWwuY29sdW1uID09PSBhY3RpdmVJbmRleCArIDEpWzBdO1xuICAgICAgcHJldlNsaWRlID0gc2xpZGVzLmZpbHRlcihzbGlkZUVsID0+IHNsaWRlRWwuY29sdW1uID09PSBhY3RpdmVJbmRleCAtIDEpWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICBhY3RpdmVTbGlkZSA9IHNsaWRlc1thY3RpdmVJbmRleF07XG4gICAgfVxuICB9XG4gIGlmIChhY3RpdmVTbGlkZSkge1xuICAgIC8vIEFjdGl2ZSBjbGFzc2VzXG4gICAgYWN0aXZlU2xpZGUuY2xhc3NMaXN0LmFkZChwYXJhbXMuc2xpZGVBY3RpdmVDbGFzcyk7XG4gICAgaWYgKGdyaWRFbmFibGVkKSB7XG4gICAgICBpZiAobmV4dFNsaWRlKSB7XG4gICAgICAgIG5leHRTbGlkZS5jbGFzc0xpc3QuYWRkKHBhcmFtcy5zbGlkZU5leHRDbGFzcyk7XG4gICAgICB9XG4gICAgICBpZiAocHJldlNsaWRlKSB7XG4gICAgICAgIHByZXZTbGlkZS5jbGFzc0xpc3QuYWRkKHBhcmFtcy5zbGlkZVByZXZDbGFzcyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIE5leHQgU2xpZGVcbiAgICAgIG5leHRTbGlkZSA9IGVsZW1lbnROZXh0QWxsKGFjdGl2ZVNsaWRlLCBgLiR7cGFyYW1zLnNsaWRlQ2xhc3N9LCBzd2lwZXItc2xpZGVgKVswXTtcbiAgICAgIGlmIChwYXJhbXMubG9vcCAmJiAhbmV4dFNsaWRlKSB7XG4gICAgICAgIG5leHRTbGlkZSA9IHNsaWRlc1swXTtcbiAgICAgIH1cbiAgICAgIGlmIChuZXh0U2xpZGUpIHtcbiAgICAgICAgbmV4dFNsaWRlLmNsYXNzTGlzdC5hZGQocGFyYW1zLnNsaWRlTmV4dENsYXNzKTtcbiAgICAgIH1cblxuICAgICAgLy8gUHJldiBTbGlkZVxuICAgICAgcHJldlNsaWRlID0gZWxlbWVudFByZXZBbGwoYWN0aXZlU2xpZGUsIGAuJHtwYXJhbXMuc2xpZGVDbGFzc30sIHN3aXBlci1zbGlkZWApWzBdO1xuICAgICAgaWYgKHBhcmFtcy5sb29wICYmICFwcmV2U2xpZGUgPT09IDApIHtcbiAgICAgICAgcHJldlNsaWRlID0gc2xpZGVzW3NsaWRlcy5sZW5ndGggLSAxXTtcbiAgICAgIH1cbiAgICAgIGlmIChwcmV2U2xpZGUpIHtcbiAgICAgICAgcHJldlNsaWRlLmNsYXNzTGlzdC5hZGQocGFyYW1zLnNsaWRlUHJldkNsYXNzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgc3dpcGVyLmVtaXRTbGlkZXNDbGFzc2VzKCk7XG59XG5cbmNvbnN0IHByb2Nlc3NMYXp5UHJlbG9hZGVyID0gKHN3aXBlciwgaW1hZ2VFbCkgPT4ge1xuICBpZiAoIXN3aXBlciB8fCBzd2lwZXIuZGVzdHJveWVkIHx8ICFzd2lwZXIucGFyYW1zKSByZXR1cm47XG4gIGNvbnN0IHNsaWRlU2VsZWN0b3IgPSAoKSA9PiBzd2lwZXIuaXNFbGVtZW50ID8gYHN3aXBlci1zbGlkZWAgOiBgLiR7c3dpcGVyLnBhcmFtcy5zbGlkZUNsYXNzfWA7XG4gIGNvbnN0IHNsaWRlRWwgPSBpbWFnZUVsLmNsb3Nlc3Qoc2xpZGVTZWxlY3RvcigpKTtcbiAgaWYgKHNsaWRlRWwpIHtcbiAgICBsZXQgbGF6eUVsID0gc2xpZGVFbC5xdWVyeVNlbGVjdG9yKGAuJHtzd2lwZXIucGFyYW1zLmxhenlQcmVsb2FkZXJDbGFzc31gKTtcbiAgICBpZiAoIWxhenlFbCAmJiBzd2lwZXIuaXNFbGVtZW50KSB7XG4gICAgICBpZiAoc2xpZGVFbC5zaGFkb3dSb290KSB7XG4gICAgICAgIGxhenlFbCA9IHNsaWRlRWwuc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yKGAuJHtzd2lwZXIucGFyYW1zLmxhenlQcmVsb2FkZXJDbGFzc31gKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGluaXQgbGF0ZXJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICBpZiAoc2xpZGVFbC5zaGFkb3dSb290KSB7XG4gICAgICAgICAgICBsYXp5RWwgPSBzbGlkZUVsLnNoYWRvd1Jvb3QucXVlcnlTZWxlY3RvcihgLiR7c3dpcGVyLnBhcmFtcy5sYXp5UHJlbG9hZGVyQ2xhc3N9YCk7XG4gICAgICAgICAgICBpZiAobGF6eUVsKSBsYXp5RWwucmVtb3ZlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGxhenlFbCkgbGF6eUVsLnJlbW92ZSgpO1xuICB9XG59O1xuY29uc3QgdW5sYXp5ID0gKHN3aXBlciwgaW5kZXgpID0+IHtcbiAgaWYgKCFzd2lwZXIuc2xpZGVzW2luZGV4XSkgcmV0dXJuO1xuICBjb25zdCBpbWFnZUVsID0gc3dpcGVyLnNsaWRlc1tpbmRleF0ucXVlcnlTZWxlY3RvcignW2xvYWRpbmc9XCJsYXp5XCJdJyk7XG4gIGlmIChpbWFnZUVsKSBpbWFnZUVsLnJlbW92ZUF0dHJpYnV0ZSgnbG9hZGluZycpO1xufTtcbmNvbnN0IHByZWxvYWQgPSBzd2lwZXIgPT4ge1xuICBpZiAoIXN3aXBlciB8fCBzd2lwZXIuZGVzdHJveWVkIHx8ICFzd2lwZXIucGFyYW1zKSByZXR1cm47XG4gIGxldCBhbW91bnQgPSBzd2lwZXIucGFyYW1zLmxhenlQcmVsb2FkUHJldk5leHQ7XG4gIGNvbnN0IGxlbiA9IHN3aXBlci5zbGlkZXMubGVuZ3RoO1xuICBpZiAoIWxlbiB8fCAhYW1vdW50IHx8IGFtb3VudCA8IDApIHJldHVybjtcbiAgYW1vdW50ID0gTWF0aC5taW4oYW1vdW50LCBsZW4pO1xuICBjb25zdCBzbGlkZXNQZXJWaWV3ID0gc3dpcGVyLnBhcmFtcy5zbGlkZXNQZXJWaWV3ID09PSAnYXV0bycgPyBzd2lwZXIuc2xpZGVzUGVyVmlld0R5bmFtaWMoKSA6IE1hdGguY2VpbChzd2lwZXIucGFyYW1zLnNsaWRlc1BlclZpZXcpO1xuICBjb25zdCBhY3RpdmVJbmRleCA9IHN3aXBlci5hY3RpdmVJbmRleDtcbiAgaWYgKHN3aXBlci5wYXJhbXMuZ3JpZCAmJiBzd2lwZXIucGFyYW1zLmdyaWQucm93cyA+IDEpIHtcbiAgICBjb25zdCBhY3RpdmVDb2x1bW4gPSBhY3RpdmVJbmRleDtcbiAgICBjb25zdCBwcmVsb2FkQ29sdW1ucyA9IFthY3RpdmVDb2x1bW4gLSBhbW91bnRdO1xuICAgIHByZWxvYWRDb2x1bW5zLnB1c2goLi4uQXJyYXkuZnJvbSh7XG4gICAgICBsZW5ndGg6IGFtb3VudFxuICAgIH0pLm1hcCgoXywgaSkgPT4ge1xuICAgICAgcmV0dXJuIGFjdGl2ZUNvbHVtbiArIHNsaWRlc1BlclZpZXcgKyBpO1xuICAgIH0pKTtcbiAgICBzd2lwZXIuc2xpZGVzLmZvckVhY2goKHNsaWRlRWwsIGkpID0+IHtcbiAgICAgIGlmIChwcmVsb2FkQ29sdW1ucy5pbmNsdWRlcyhzbGlkZUVsLmNvbHVtbikpIHVubGF6eShzd2lwZXIsIGkpO1xuICAgIH0pO1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBzbGlkZUluZGV4TGFzdEluVmlldyA9IGFjdGl2ZUluZGV4ICsgc2xpZGVzUGVyVmlldyAtIDE7XG4gIGlmIChzd2lwZXIucGFyYW1zLnJld2luZCB8fCBzd2lwZXIucGFyYW1zLmxvb3ApIHtcbiAgICBmb3IgKGxldCBpID0gYWN0aXZlSW5kZXggLSBhbW91bnQ7IGkgPD0gc2xpZGVJbmRleExhc3RJblZpZXcgKyBhbW91bnQ7IGkgKz0gMSkge1xuICAgICAgY29uc3QgcmVhbEluZGV4ID0gKGkgJSBsZW4gKyBsZW4pICUgbGVuO1xuICAgICAgaWYgKHJlYWxJbmRleCA8IGFjdGl2ZUluZGV4IHx8IHJlYWxJbmRleCA+IHNsaWRlSW5kZXhMYXN0SW5WaWV3KSB1bmxhenkoc3dpcGVyLCByZWFsSW5kZXgpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBmb3IgKGxldCBpID0gTWF0aC5tYXgoYWN0aXZlSW5kZXggLSBhbW91bnQsIDApOyBpIDw9IE1hdGgubWluKHNsaWRlSW5kZXhMYXN0SW5WaWV3ICsgYW1vdW50LCBsZW4gLSAxKTsgaSArPSAxKSB7XG4gICAgICBpZiAoaSAhPT0gYWN0aXZlSW5kZXggJiYgKGkgPiBzbGlkZUluZGV4TGFzdEluVmlldyB8fCBpIDwgYWN0aXZlSW5kZXgpKSB7XG4gICAgICAgIHVubGF6eShzd2lwZXIsIGkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuZnVuY3Rpb24gZ2V0QWN0aXZlSW5kZXhCeVRyYW5zbGF0ZShzd2lwZXIpIHtcbiAgY29uc3Qge1xuICAgIHNsaWRlc0dyaWQsXG4gICAgcGFyYW1zXG4gIH0gPSBzd2lwZXI7XG4gIGNvbnN0IHRyYW5zbGF0ZSA9IHN3aXBlci5ydGxUcmFuc2xhdGUgPyBzd2lwZXIudHJhbnNsYXRlIDogLXN3aXBlci50cmFuc2xhdGU7XG4gIGxldCBhY3RpdmVJbmRleDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzbGlkZXNHcmlkLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgaWYgKHR5cGVvZiBzbGlkZXNHcmlkW2kgKyAxXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGlmICh0cmFuc2xhdGUgPj0gc2xpZGVzR3JpZFtpXSAmJiB0cmFuc2xhdGUgPCBzbGlkZXNHcmlkW2kgKyAxXSAtIChzbGlkZXNHcmlkW2kgKyAxXSAtIHNsaWRlc0dyaWRbaV0pIC8gMikge1xuICAgICAgICBhY3RpdmVJbmRleCA9IGk7XG4gICAgICB9IGVsc2UgaWYgKHRyYW5zbGF0ZSA+PSBzbGlkZXNHcmlkW2ldICYmIHRyYW5zbGF0ZSA8IHNsaWRlc0dyaWRbaSArIDFdKSB7XG4gICAgICAgIGFjdGl2ZUluZGV4ID0gaSArIDE7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0cmFuc2xhdGUgPj0gc2xpZGVzR3JpZFtpXSkge1xuICAgICAgYWN0aXZlSW5kZXggPSBpO1xuICAgIH1cbiAgfVxuICAvLyBOb3JtYWxpemUgc2xpZGVJbmRleFxuICBpZiAocGFyYW1zLm5vcm1hbGl6ZVNsaWRlSW5kZXgpIHtcbiAgICBpZiAoYWN0aXZlSW5kZXggPCAwIHx8IHR5cGVvZiBhY3RpdmVJbmRleCA9PT0gJ3VuZGVmaW5lZCcpIGFjdGl2ZUluZGV4ID0gMDtcbiAgfVxuICByZXR1cm4gYWN0aXZlSW5kZXg7XG59XG5mdW5jdGlvbiB1cGRhdGVBY3RpdmVJbmRleChuZXdBY3RpdmVJbmRleCkge1xuICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICBjb25zdCB0cmFuc2xhdGUgPSBzd2lwZXIucnRsVHJhbnNsYXRlID8gc3dpcGVyLnRyYW5zbGF0ZSA6IC1zd2lwZXIudHJhbnNsYXRlO1xuICBjb25zdCB7XG4gICAgc25hcEdyaWQsXG4gICAgcGFyYW1zLFxuICAgIGFjdGl2ZUluZGV4OiBwcmV2aW91c0luZGV4LFxuICAgIHJlYWxJbmRleDogcHJldmlvdXNSZWFsSW5kZXgsXG4gICAgc25hcEluZGV4OiBwcmV2aW91c1NuYXBJbmRleFxuICB9ID0gc3dpcGVyO1xuICBsZXQgYWN0aXZlSW5kZXggPSBuZXdBY3RpdmVJbmRleDtcbiAgbGV0IHNuYXBJbmRleDtcbiAgY29uc3QgZ2V0VmlydHVhbFJlYWxJbmRleCA9IGFJbmRleCA9PiB7XG4gICAgbGV0IHJlYWxJbmRleCA9IGFJbmRleCAtIHN3aXBlci52aXJ0dWFsLnNsaWRlc0JlZm9yZTtcbiAgICBpZiAocmVhbEluZGV4IDwgMCkge1xuICAgICAgcmVhbEluZGV4ID0gc3dpcGVyLnZpcnR1YWwuc2xpZGVzLmxlbmd0aCArIHJlYWxJbmRleDtcbiAgICB9XG4gICAgaWYgKHJlYWxJbmRleCA+PSBzd2lwZXIudmlydHVhbC5zbGlkZXMubGVuZ3RoKSB7XG4gICAgICByZWFsSW5kZXggLT0gc3dpcGVyLnZpcnR1YWwuc2xpZGVzLmxlbmd0aDtcbiAgICB9XG4gICAgcmV0dXJuIHJlYWxJbmRleDtcbiAgfTtcbiAgaWYgKHR5cGVvZiBhY3RpdmVJbmRleCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBhY3RpdmVJbmRleCA9IGdldEFjdGl2ZUluZGV4QnlUcmFuc2xhdGUoc3dpcGVyKTtcbiAgfVxuICBpZiAoc25hcEdyaWQuaW5kZXhPZih0cmFuc2xhdGUpID49IDApIHtcbiAgICBzbmFwSW5kZXggPSBzbmFwR3JpZC5pbmRleE9mKHRyYW5zbGF0ZSk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3Qgc2tpcCA9IE1hdGgubWluKHBhcmFtcy5zbGlkZXNQZXJHcm91cFNraXAsIGFjdGl2ZUluZGV4KTtcbiAgICBzbmFwSW5kZXggPSBza2lwICsgTWF0aC5mbG9vcigoYWN0aXZlSW5kZXggLSBza2lwKSAvIHBhcmFtcy5zbGlkZXNQZXJHcm91cCk7XG4gIH1cbiAgaWYgKHNuYXBJbmRleCA+PSBzbmFwR3JpZC5sZW5ndGgpIHNuYXBJbmRleCA9IHNuYXBHcmlkLmxlbmd0aCAtIDE7XG4gIGlmIChhY3RpdmVJbmRleCA9PT0gcHJldmlvdXNJbmRleCAmJiAhc3dpcGVyLnBhcmFtcy5sb29wKSB7XG4gICAgaWYgKHNuYXBJbmRleCAhPT0gcHJldmlvdXNTbmFwSW5kZXgpIHtcbiAgICAgIHN3aXBlci5zbmFwSW5kZXggPSBzbmFwSW5kZXg7XG4gICAgICBzd2lwZXIuZW1pdCgnc25hcEluZGV4Q2hhbmdlJyk7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuICBpZiAoYWN0aXZlSW5kZXggPT09IHByZXZpb3VzSW5kZXggJiYgc3dpcGVyLnBhcmFtcy5sb29wICYmIHN3aXBlci52aXJ0dWFsICYmIHN3aXBlci5wYXJhbXMudmlydHVhbC5lbmFibGVkKSB7XG4gICAgc3dpcGVyLnJlYWxJbmRleCA9IGdldFZpcnR1YWxSZWFsSW5kZXgoYWN0aXZlSW5kZXgpO1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBncmlkRW5hYmxlZCA9IHN3aXBlci5ncmlkICYmIHBhcmFtcy5ncmlkICYmIHBhcmFtcy5ncmlkLnJvd3MgPiAxO1xuXG4gIC8vIEdldCByZWFsIGluZGV4XG4gIGxldCByZWFsSW5kZXg7XG4gIGlmIChzd2lwZXIudmlydHVhbCAmJiBwYXJhbXMudmlydHVhbC5lbmFibGVkICYmIHBhcmFtcy5sb29wKSB7XG4gICAgcmVhbEluZGV4ID0gZ2V0VmlydHVhbFJlYWxJbmRleChhY3RpdmVJbmRleCk7XG4gIH0gZWxzZSBpZiAoZ3JpZEVuYWJsZWQpIHtcbiAgICBjb25zdCBmaXJzdFNsaWRlSW5Db2x1bW4gPSBzd2lwZXIuc2xpZGVzLmZpbHRlcihzbGlkZUVsID0+IHNsaWRlRWwuY29sdW1uID09PSBhY3RpdmVJbmRleClbMF07XG4gICAgbGV0IGFjdGl2ZVNsaWRlSW5kZXggPSBwYXJzZUludChmaXJzdFNsaWRlSW5Db2x1bW4uZ2V0QXR0cmlidXRlKCdkYXRhLXN3aXBlci1zbGlkZS1pbmRleCcpLCAxMCk7XG4gICAgaWYgKE51bWJlci5pc05hTihhY3RpdmVTbGlkZUluZGV4KSkge1xuICAgICAgYWN0aXZlU2xpZGVJbmRleCA9IE1hdGgubWF4KHN3aXBlci5zbGlkZXMuaW5kZXhPZihmaXJzdFNsaWRlSW5Db2x1bW4pLCAwKTtcbiAgICB9XG4gICAgcmVhbEluZGV4ID0gTWF0aC5mbG9vcihhY3RpdmVTbGlkZUluZGV4IC8gcGFyYW1zLmdyaWQucm93cyk7XG4gIH0gZWxzZSBpZiAoc3dpcGVyLnNsaWRlc1thY3RpdmVJbmRleF0pIHtcbiAgICBjb25zdCBzbGlkZUluZGV4ID0gc3dpcGVyLnNsaWRlc1thY3RpdmVJbmRleF0uZ2V0QXR0cmlidXRlKCdkYXRhLXN3aXBlci1zbGlkZS1pbmRleCcpO1xuICAgIGlmIChzbGlkZUluZGV4KSB7XG4gICAgICByZWFsSW5kZXggPSBwYXJzZUludChzbGlkZUluZGV4LCAxMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlYWxJbmRleCA9IGFjdGl2ZUluZGV4O1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZWFsSW5kZXggPSBhY3RpdmVJbmRleDtcbiAgfVxuICBPYmplY3QuYXNzaWduKHN3aXBlciwge1xuICAgIHByZXZpb3VzU25hcEluZGV4LFxuICAgIHNuYXBJbmRleCxcbiAgICBwcmV2aW91c1JlYWxJbmRleCxcbiAgICByZWFsSW5kZXgsXG4gICAgcHJldmlvdXNJbmRleCxcbiAgICBhY3RpdmVJbmRleFxuICB9KTtcbiAgaWYgKHN3aXBlci5pbml0aWFsaXplZCkge1xuICAgIHByZWxvYWQoc3dpcGVyKTtcbiAgfVxuICBzd2lwZXIuZW1pdCgnYWN0aXZlSW5kZXhDaGFuZ2UnKTtcbiAgc3dpcGVyLmVtaXQoJ3NuYXBJbmRleENoYW5nZScpO1xuICBpZiAoc3dpcGVyLmluaXRpYWxpemVkIHx8IHN3aXBlci5wYXJhbXMucnVuQ2FsbGJhY2tzT25Jbml0KSB7XG4gICAgaWYgKHByZXZpb3VzUmVhbEluZGV4ICE9PSByZWFsSW5kZXgpIHtcbiAgICAgIHN3aXBlci5lbWl0KCdyZWFsSW5kZXhDaGFuZ2UnKTtcbiAgICB9XG4gICAgc3dpcGVyLmVtaXQoJ3NsaWRlQ2hhbmdlJyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlQ2xpY2tlZFNsaWRlKGVsLCBwYXRoKSB7XG4gIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gIGNvbnN0IHBhcmFtcyA9IHN3aXBlci5wYXJhbXM7XG4gIGxldCBzbGlkZSA9IGVsLmNsb3Nlc3QoYC4ke3BhcmFtcy5zbGlkZUNsYXNzfSwgc3dpcGVyLXNsaWRlYCk7XG4gIGlmICghc2xpZGUgJiYgc3dpcGVyLmlzRWxlbWVudCAmJiBwYXRoICYmIHBhdGgubGVuZ3RoID4gMSAmJiBwYXRoLmluY2x1ZGVzKGVsKSkge1xuICAgIFsuLi5wYXRoLnNsaWNlKHBhdGguaW5kZXhPZihlbCkgKyAxLCBwYXRoLmxlbmd0aCldLmZvckVhY2gocGF0aEVsID0+IHtcbiAgICAgIGlmICghc2xpZGUgJiYgcGF0aEVsLm1hdGNoZXMgJiYgcGF0aEVsLm1hdGNoZXMoYC4ke3BhcmFtcy5zbGlkZUNsYXNzfSwgc3dpcGVyLXNsaWRlYCkpIHtcbiAgICAgICAgc2xpZGUgPSBwYXRoRWw7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgbGV0IHNsaWRlRm91bmQgPSBmYWxzZTtcbiAgbGV0IHNsaWRlSW5kZXg7XG4gIGlmIChzbGlkZSkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3dpcGVyLnNsaWRlcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgaWYgKHN3aXBlci5zbGlkZXNbaV0gPT09IHNsaWRlKSB7XG4gICAgICAgIHNsaWRlRm91bmQgPSB0cnVlO1xuICAgICAgICBzbGlkZUluZGV4ID0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmIChzbGlkZSAmJiBzbGlkZUZvdW5kKSB7XG4gICAgc3dpcGVyLmNsaWNrZWRTbGlkZSA9IHNsaWRlO1xuICAgIGlmIChzd2lwZXIudmlydHVhbCAmJiBzd2lwZXIucGFyYW1zLnZpcnR1YWwuZW5hYmxlZCkge1xuICAgICAgc3dpcGVyLmNsaWNrZWRJbmRleCA9IHBhcnNlSW50KHNsaWRlLmdldEF0dHJpYnV0ZSgnZGF0YS1zd2lwZXItc2xpZGUtaW5kZXgnKSwgMTApO1xuICAgIH0gZWxzZSB7XG4gICAgICBzd2lwZXIuY2xpY2tlZEluZGV4ID0gc2xpZGVJbmRleDtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgc3dpcGVyLmNsaWNrZWRTbGlkZSA9IHVuZGVmaW5lZDtcbiAgICBzd2lwZXIuY2xpY2tlZEluZGV4ID0gdW5kZWZpbmVkO1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAocGFyYW1zLnNsaWRlVG9DbGlja2VkU2xpZGUgJiYgc3dpcGVyLmNsaWNrZWRJbmRleCAhPT0gdW5kZWZpbmVkICYmIHN3aXBlci5jbGlja2VkSW5kZXggIT09IHN3aXBlci5hY3RpdmVJbmRleCkge1xuICAgIHN3aXBlci5zbGlkZVRvQ2xpY2tlZFNsaWRlKCk7XG4gIH1cbn1cblxudmFyIHVwZGF0ZSA9IHtcbiAgdXBkYXRlU2l6ZSxcbiAgdXBkYXRlU2xpZGVzLFxuICB1cGRhdGVBdXRvSGVpZ2h0LFxuICB1cGRhdGVTbGlkZXNPZmZzZXQsXG4gIHVwZGF0ZVNsaWRlc1Byb2dyZXNzLFxuICB1cGRhdGVQcm9ncmVzcyxcbiAgdXBkYXRlU2xpZGVzQ2xhc3NlcyxcbiAgdXBkYXRlQWN0aXZlSW5kZXgsXG4gIHVwZGF0ZUNsaWNrZWRTbGlkZVxufTtcblxuZnVuY3Rpb24gZ2V0U3dpcGVyVHJhbnNsYXRlKGF4aXMpIHtcbiAgaWYgKGF4aXMgPT09IHZvaWQgMCkge1xuICAgIGF4aXMgPSB0aGlzLmlzSG9yaXpvbnRhbCgpID8gJ3gnIDogJ3knO1xuICB9XG4gIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gIGNvbnN0IHtcbiAgICBwYXJhbXMsXG4gICAgcnRsVHJhbnNsYXRlOiBydGwsXG4gICAgdHJhbnNsYXRlLFxuICAgIHdyYXBwZXJFbFxuICB9ID0gc3dpcGVyO1xuICBpZiAocGFyYW1zLnZpcnR1YWxUcmFuc2xhdGUpIHtcbiAgICByZXR1cm4gcnRsID8gLXRyYW5zbGF0ZSA6IHRyYW5zbGF0ZTtcbiAgfVxuICBpZiAocGFyYW1zLmNzc01vZGUpIHtcbiAgICByZXR1cm4gdHJhbnNsYXRlO1xuICB9XG4gIGxldCBjdXJyZW50VHJhbnNsYXRlID0gZ2V0VHJhbnNsYXRlKHdyYXBwZXJFbCwgYXhpcyk7XG4gIGN1cnJlbnRUcmFuc2xhdGUgKz0gc3dpcGVyLmNzc092ZXJmbG93QWRqdXN0bWVudCgpO1xuICBpZiAocnRsKSBjdXJyZW50VHJhbnNsYXRlID0gLWN1cnJlbnRUcmFuc2xhdGU7XG4gIHJldHVybiBjdXJyZW50VHJhbnNsYXRlIHx8IDA7XG59XG5cbmZ1bmN0aW9uIHNldFRyYW5zbGF0ZSh0cmFuc2xhdGUsIGJ5Q29udHJvbGxlcikge1xuICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICBjb25zdCB7XG4gICAgcnRsVHJhbnNsYXRlOiBydGwsXG4gICAgcGFyYW1zLFxuICAgIHdyYXBwZXJFbCxcbiAgICBwcm9ncmVzc1xuICB9ID0gc3dpcGVyO1xuICBsZXQgeCA9IDA7XG4gIGxldCB5ID0gMDtcbiAgY29uc3QgeiA9IDA7XG4gIGlmIChzd2lwZXIuaXNIb3Jpem9udGFsKCkpIHtcbiAgICB4ID0gcnRsID8gLXRyYW5zbGF0ZSA6IHRyYW5zbGF0ZTtcbiAgfSBlbHNlIHtcbiAgICB5ID0gdHJhbnNsYXRlO1xuICB9XG4gIGlmIChwYXJhbXMucm91bmRMZW5ndGhzKSB7XG4gICAgeCA9IE1hdGguZmxvb3IoeCk7XG4gICAgeSA9IE1hdGguZmxvb3IoeSk7XG4gIH1cbiAgc3dpcGVyLnByZXZpb3VzVHJhbnNsYXRlID0gc3dpcGVyLnRyYW5zbGF0ZTtcbiAgc3dpcGVyLnRyYW5zbGF0ZSA9IHN3aXBlci5pc0hvcml6b250YWwoKSA/IHggOiB5O1xuICBpZiAocGFyYW1zLmNzc01vZGUpIHtcbiAgICB3cmFwcGVyRWxbc3dpcGVyLmlzSG9yaXpvbnRhbCgpID8gJ3Njcm9sbExlZnQnIDogJ3Njcm9sbFRvcCddID0gc3dpcGVyLmlzSG9yaXpvbnRhbCgpID8gLXggOiAteTtcbiAgfSBlbHNlIGlmICghcGFyYW1zLnZpcnR1YWxUcmFuc2xhdGUpIHtcbiAgICBpZiAoc3dpcGVyLmlzSG9yaXpvbnRhbCgpKSB7XG4gICAgICB4IC09IHN3aXBlci5jc3NPdmVyZmxvd0FkanVzdG1lbnQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgeSAtPSBzd2lwZXIuY3NzT3ZlcmZsb3dBZGp1c3RtZW50KCk7XG4gICAgfVxuICAgIHdyYXBwZXJFbC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlM2QoJHt4fXB4LCAke3l9cHgsICR7en1weClgO1xuICB9XG5cbiAgLy8gQ2hlY2sgaWYgd2UgbmVlZCB0byB1cGRhdGUgcHJvZ3Jlc3NcbiAgbGV0IG5ld1Byb2dyZXNzO1xuICBjb25zdCB0cmFuc2xhdGVzRGlmZiA9IHN3aXBlci5tYXhUcmFuc2xhdGUoKSAtIHN3aXBlci5taW5UcmFuc2xhdGUoKTtcbiAgaWYgKHRyYW5zbGF0ZXNEaWZmID09PSAwKSB7XG4gICAgbmV3UHJvZ3Jlc3MgPSAwO1xuICB9IGVsc2Uge1xuICAgIG5ld1Byb2dyZXNzID0gKHRyYW5zbGF0ZSAtIHN3aXBlci5taW5UcmFuc2xhdGUoKSkgLyB0cmFuc2xhdGVzRGlmZjtcbiAgfVxuICBpZiAobmV3UHJvZ3Jlc3MgIT09IHByb2dyZXNzKSB7XG4gICAgc3dpcGVyLnVwZGF0ZVByb2dyZXNzKHRyYW5zbGF0ZSk7XG4gIH1cbiAgc3dpcGVyLmVtaXQoJ3NldFRyYW5zbGF0ZScsIHN3aXBlci50cmFuc2xhdGUsIGJ5Q29udHJvbGxlcik7XG59XG5cbmZ1bmN0aW9uIG1pblRyYW5zbGF0ZSgpIHtcbiAgcmV0dXJuIC10aGlzLnNuYXBHcmlkWzBdO1xufVxuXG5mdW5jdGlvbiBtYXhUcmFuc2xhdGUoKSB7XG4gIHJldHVybiAtdGhpcy5zbmFwR3JpZFt0aGlzLnNuYXBHcmlkLmxlbmd0aCAtIDFdO1xufVxuXG5mdW5jdGlvbiB0cmFuc2xhdGVUbyh0cmFuc2xhdGUsIHNwZWVkLCBydW5DYWxsYmFja3MsIHRyYW5zbGF0ZUJvdW5kcywgaW50ZXJuYWwpIHtcbiAgaWYgKHRyYW5zbGF0ZSA9PT0gdm9pZCAwKSB7XG4gICAgdHJhbnNsYXRlID0gMDtcbiAgfVxuICBpZiAoc3BlZWQgPT09IHZvaWQgMCkge1xuICAgIHNwZWVkID0gdGhpcy5wYXJhbXMuc3BlZWQ7XG4gIH1cbiAgaWYgKHJ1bkNhbGxiYWNrcyA9PT0gdm9pZCAwKSB7XG4gICAgcnVuQ2FsbGJhY2tzID0gdHJ1ZTtcbiAgfVxuICBpZiAodHJhbnNsYXRlQm91bmRzID09PSB2b2lkIDApIHtcbiAgICB0cmFuc2xhdGVCb3VuZHMgPSB0cnVlO1xuICB9XG4gIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gIGNvbnN0IHtcbiAgICBwYXJhbXMsXG4gICAgd3JhcHBlckVsXG4gIH0gPSBzd2lwZXI7XG4gIGlmIChzd2lwZXIuYW5pbWF0aW5nICYmIHBhcmFtcy5wcmV2ZW50SW50ZXJhY3Rpb25PblRyYW5zaXRpb24pIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgY29uc3QgbWluVHJhbnNsYXRlID0gc3dpcGVyLm1pblRyYW5zbGF0ZSgpO1xuICBjb25zdCBtYXhUcmFuc2xhdGUgPSBzd2lwZXIubWF4VHJhbnNsYXRlKCk7XG4gIGxldCBuZXdUcmFuc2xhdGU7XG4gIGlmICh0cmFuc2xhdGVCb3VuZHMgJiYgdHJhbnNsYXRlID4gbWluVHJhbnNsYXRlKSBuZXdUcmFuc2xhdGUgPSBtaW5UcmFuc2xhdGU7ZWxzZSBpZiAodHJhbnNsYXRlQm91bmRzICYmIHRyYW5zbGF0ZSA8IG1heFRyYW5zbGF0ZSkgbmV3VHJhbnNsYXRlID0gbWF4VHJhbnNsYXRlO2Vsc2UgbmV3VHJhbnNsYXRlID0gdHJhbnNsYXRlO1xuXG4gIC8vIFVwZGF0ZSBwcm9ncmVzc1xuICBzd2lwZXIudXBkYXRlUHJvZ3Jlc3MobmV3VHJhbnNsYXRlKTtcbiAgaWYgKHBhcmFtcy5jc3NNb2RlKSB7XG4gICAgY29uc3QgaXNIID0gc3dpcGVyLmlzSG9yaXpvbnRhbCgpO1xuICAgIGlmIChzcGVlZCA9PT0gMCkge1xuICAgICAgd3JhcHBlckVsW2lzSCA/ICdzY3JvbGxMZWZ0JyA6ICdzY3JvbGxUb3AnXSA9IC1uZXdUcmFuc2xhdGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghc3dpcGVyLnN1cHBvcnQuc21vb3RoU2Nyb2xsKSB7XG4gICAgICAgIGFuaW1hdGVDU1NNb2RlU2Nyb2xsKHtcbiAgICAgICAgICBzd2lwZXIsXG4gICAgICAgICAgdGFyZ2V0UG9zaXRpb246IC1uZXdUcmFuc2xhdGUsXG4gICAgICAgICAgc2lkZTogaXNIID8gJ2xlZnQnIDogJ3RvcCdcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgd3JhcHBlckVsLnNjcm9sbFRvKHtcbiAgICAgICAgW2lzSCA/ICdsZWZ0JyA6ICd0b3AnXTogLW5ld1RyYW5zbGF0ZSxcbiAgICAgICAgYmVoYXZpb3I6ICdzbW9vdGgnXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKHNwZWVkID09PSAwKSB7XG4gICAgc3dpcGVyLnNldFRyYW5zaXRpb24oMCk7XG4gICAgc3dpcGVyLnNldFRyYW5zbGF0ZShuZXdUcmFuc2xhdGUpO1xuICAgIGlmIChydW5DYWxsYmFja3MpIHtcbiAgICAgIHN3aXBlci5lbWl0KCdiZWZvcmVUcmFuc2l0aW9uU3RhcnQnLCBzcGVlZCwgaW50ZXJuYWwpO1xuICAgICAgc3dpcGVyLmVtaXQoJ3RyYW5zaXRpb25FbmQnKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgc3dpcGVyLnNldFRyYW5zaXRpb24oc3BlZWQpO1xuICAgIHN3aXBlci5zZXRUcmFuc2xhdGUobmV3VHJhbnNsYXRlKTtcbiAgICBpZiAocnVuQ2FsbGJhY2tzKSB7XG4gICAgICBzd2lwZXIuZW1pdCgnYmVmb3JlVHJhbnNpdGlvblN0YXJ0Jywgc3BlZWQsIGludGVybmFsKTtcbiAgICAgIHN3aXBlci5lbWl0KCd0cmFuc2l0aW9uU3RhcnQnKTtcbiAgICB9XG4gICAgaWYgKCFzd2lwZXIuYW5pbWF0aW5nKSB7XG4gICAgICBzd2lwZXIuYW5pbWF0aW5nID0gdHJ1ZTtcbiAgICAgIGlmICghc3dpcGVyLm9uVHJhbnNsYXRlVG9XcmFwcGVyVHJhbnNpdGlvbkVuZCkge1xuICAgICAgICBzd2lwZXIub25UcmFuc2xhdGVUb1dyYXBwZXJUcmFuc2l0aW9uRW5kID0gZnVuY3Rpb24gdHJhbnNpdGlvbkVuZChlKSB7XG4gICAgICAgICAgaWYgKCFzd2lwZXIgfHwgc3dpcGVyLmRlc3Ryb3llZCkgcmV0dXJuO1xuICAgICAgICAgIGlmIChlLnRhcmdldCAhPT0gdGhpcykgcmV0dXJuO1xuICAgICAgICAgIHN3aXBlci53cmFwcGVyRWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIHN3aXBlci5vblRyYW5zbGF0ZVRvV3JhcHBlclRyYW5zaXRpb25FbmQpO1xuICAgICAgICAgIHN3aXBlci5vblRyYW5zbGF0ZVRvV3JhcHBlclRyYW5zaXRpb25FbmQgPSBudWxsO1xuICAgICAgICAgIGRlbGV0ZSBzd2lwZXIub25UcmFuc2xhdGVUb1dyYXBwZXJUcmFuc2l0aW9uRW5kO1xuICAgICAgICAgIGlmIChydW5DYWxsYmFja3MpIHtcbiAgICAgICAgICAgIHN3aXBlci5lbWl0KCd0cmFuc2l0aW9uRW5kJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgc3dpcGVyLndyYXBwZXJFbC5hZGRFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgc3dpcGVyLm9uVHJhbnNsYXRlVG9XcmFwcGVyVHJhbnNpdGlvbkVuZCk7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG52YXIgdHJhbnNsYXRlID0ge1xuICBnZXRUcmFuc2xhdGU6IGdldFN3aXBlclRyYW5zbGF0ZSxcbiAgc2V0VHJhbnNsYXRlLFxuICBtaW5UcmFuc2xhdGUsXG4gIG1heFRyYW5zbGF0ZSxcbiAgdHJhbnNsYXRlVG9cbn07XG5cbmZ1bmN0aW9uIHNldFRyYW5zaXRpb24oZHVyYXRpb24sIGJ5Q29udHJvbGxlcikge1xuICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICBpZiAoIXN3aXBlci5wYXJhbXMuY3NzTW9kZSkge1xuICAgIHN3aXBlci53cmFwcGVyRWwuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gYCR7ZHVyYXRpb259bXNgO1xuICAgIHN3aXBlci53cmFwcGVyRWwuc3R5bGUudHJhbnNpdGlvbkRlbGF5ID0gZHVyYXRpb24gPT09IDAgPyBgMG1zYCA6ICcnO1xuICB9XG4gIHN3aXBlci5lbWl0KCdzZXRUcmFuc2l0aW9uJywgZHVyYXRpb24sIGJ5Q29udHJvbGxlcik7XG59XG5cbmZ1bmN0aW9uIHRyYW5zaXRpb25FbWl0KF9yZWYpIHtcbiAgbGV0IHtcbiAgICBzd2lwZXIsXG4gICAgcnVuQ2FsbGJhY2tzLFxuICAgIGRpcmVjdGlvbixcbiAgICBzdGVwXG4gIH0gPSBfcmVmO1xuICBjb25zdCB7XG4gICAgYWN0aXZlSW5kZXgsXG4gICAgcHJldmlvdXNJbmRleFxuICB9ID0gc3dpcGVyO1xuICBsZXQgZGlyID0gZGlyZWN0aW9uO1xuICBpZiAoIWRpcikge1xuICAgIGlmIChhY3RpdmVJbmRleCA+IHByZXZpb3VzSW5kZXgpIGRpciA9ICduZXh0JztlbHNlIGlmIChhY3RpdmVJbmRleCA8IHByZXZpb3VzSW5kZXgpIGRpciA9ICdwcmV2JztlbHNlIGRpciA9ICdyZXNldCc7XG4gIH1cbiAgc3dpcGVyLmVtaXQoYHRyYW5zaXRpb24ke3N0ZXB9YCk7XG4gIGlmIChydW5DYWxsYmFja3MgJiYgYWN0aXZlSW5kZXggIT09IHByZXZpb3VzSW5kZXgpIHtcbiAgICBpZiAoZGlyID09PSAncmVzZXQnKSB7XG4gICAgICBzd2lwZXIuZW1pdChgc2xpZGVSZXNldFRyYW5zaXRpb24ke3N0ZXB9YCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHN3aXBlci5lbWl0KGBzbGlkZUNoYW5nZVRyYW5zaXRpb24ke3N0ZXB9YCk7XG4gICAgaWYgKGRpciA9PT0gJ25leHQnKSB7XG4gICAgICBzd2lwZXIuZW1pdChgc2xpZGVOZXh0VHJhbnNpdGlvbiR7c3RlcH1gKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3dpcGVyLmVtaXQoYHNsaWRlUHJldlRyYW5zaXRpb24ke3N0ZXB9YCk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHRyYW5zaXRpb25TdGFydChydW5DYWxsYmFja3MsIGRpcmVjdGlvbikge1xuICBpZiAocnVuQ2FsbGJhY2tzID09PSB2b2lkIDApIHtcbiAgICBydW5DYWxsYmFja3MgPSB0cnVlO1xuICB9XG4gIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gIGNvbnN0IHtcbiAgICBwYXJhbXNcbiAgfSA9IHN3aXBlcjtcbiAgaWYgKHBhcmFtcy5jc3NNb2RlKSByZXR1cm47XG4gIGlmIChwYXJhbXMuYXV0b0hlaWdodCkge1xuICAgIHN3aXBlci51cGRhdGVBdXRvSGVpZ2h0KCk7XG4gIH1cbiAgdHJhbnNpdGlvbkVtaXQoe1xuICAgIHN3aXBlcixcbiAgICBydW5DYWxsYmFja3MsXG4gICAgZGlyZWN0aW9uLFxuICAgIHN0ZXA6ICdTdGFydCdcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHRyYW5zaXRpb25FbmQocnVuQ2FsbGJhY2tzLCBkaXJlY3Rpb24pIHtcbiAgaWYgKHJ1bkNhbGxiYWNrcyA9PT0gdm9pZCAwKSB7XG4gICAgcnVuQ2FsbGJhY2tzID0gdHJ1ZTtcbiAgfVxuICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICBjb25zdCB7XG4gICAgcGFyYW1zXG4gIH0gPSBzd2lwZXI7XG4gIHN3aXBlci5hbmltYXRpbmcgPSBmYWxzZTtcbiAgaWYgKHBhcmFtcy5jc3NNb2RlKSByZXR1cm47XG4gIHN3aXBlci5zZXRUcmFuc2l0aW9uKDApO1xuICB0cmFuc2l0aW9uRW1pdCh7XG4gICAgc3dpcGVyLFxuICAgIHJ1bkNhbGxiYWNrcyxcbiAgICBkaXJlY3Rpb24sXG4gICAgc3RlcDogJ0VuZCdcbiAgfSk7XG59XG5cbnZhciB0cmFuc2l0aW9uID0ge1xuICBzZXRUcmFuc2l0aW9uLFxuICB0cmFuc2l0aW9uU3RhcnQsXG4gIHRyYW5zaXRpb25FbmRcbn07XG5cbmZ1bmN0aW9uIHNsaWRlVG8oaW5kZXgsIHNwZWVkLCBydW5DYWxsYmFja3MsIGludGVybmFsLCBpbml0aWFsKSB7XG4gIGlmIChpbmRleCA9PT0gdm9pZCAwKSB7XG4gICAgaW5kZXggPSAwO1xuICB9XG4gIGlmIChzcGVlZCA9PT0gdm9pZCAwKSB7XG4gICAgc3BlZWQgPSB0aGlzLnBhcmFtcy5zcGVlZDtcbiAgfVxuICBpZiAocnVuQ2FsbGJhY2tzID09PSB2b2lkIDApIHtcbiAgICBydW5DYWxsYmFja3MgPSB0cnVlO1xuICB9XG4gIGlmICh0eXBlb2YgaW5kZXggPT09ICdzdHJpbmcnKSB7XG4gICAgaW5kZXggPSBwYXJzZUludChpbmRleCwgMTApO1xuICB9XG4gIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gIGxldCBzbGlkZUluZGV4ID0gaW5kZXg7XG4gIGlmIChzbGlkZUluZGV4IDwgMCkgc2xpZGVJbmRleCA9IDA7XG4gIGNvbnN0IHtcbiAgICBwYXJhbXMsXG4gICAgc25hcEdyaWQsXG4gICAgc2xpZGVzR3JpZCxcbiAgICBwcmV2aW91c0luZGV4LFxuICAgIGFjdGl2ZUluZGV4LFxuICAgIHJ0bFRyYW5zbGF0ZTogcnRsLFxuICAgIHdyYXBwZXJFbCxcbiAgICBlbmFibGVkXG4gIH0gPSBzd2lwZXI7XG4gIGlmIChzd2lwZXIuYW5pbWF0aW5nICYmIHBhcmFtcy5wcmV2ZW50SW50ZXJhY3Rpb25PblRyYW5zaXRpb24gfHwgIWVuYWJsZWQgJiYgIWludGVybmFsICYmICFpbml0aWFsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGNvbnN0IHNraXAgPSBNYXRoLm1pbihzd2lwZXIucGFyYW1zLnNsaWRlc1Blckdyb3VwU2tpcCwgc2xpZGVJbmRleCk7XG4gIGxldCBzbmFwSW5kZXggPSBza2lwICsgTWF0aC5mbG9vcigoc2xpZGVJbmRleCAtIHNraXApIC8gc3dpcGVyLnBhcmFtcy5zbGlkZXNQZXJHcm91cCk7XG4gIGlmIChzbmFwSW5kZXggPj0gc25hcEdyaWQubGVuZ3RoKSBzbmFwSW5kZXggPSBzbmFwR3JpZC5sZW5ndGggLSAxO1xuICBjb25zdCB0cmFuc2xhdGUgPSAtc25hcEdyaWRbc25hcEluZGV4XTtcbiAgLy8gTm9ybWFsaXplIHNsaWRlSW5kZXhcbiAgaWYgKHBhcmFtcy5ub3JtYWxpemVTbGlkZUluZGV4KSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzbGlkZXNHcmlkLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBjb25zdCBub3JtYWxpemVkVHJhbnNsYXRlID0gLU1hdGguZmxvb3IodHJhbnNsYXRlICogMTAwKTtcbiAgICAgIGNvbnN0IG5vcm1hbGl6ZWRHcmlkID0gTWF0aC5mbG9vcihzbGlkZXNHcmlkW2ldICogMTAwKTtcbiAgICAgIGNvbnN0IG5vcm1hbGl6ZWRHcmlkTmV4dCA9IE1hdGguZmxvb3Ioc2xpZGVzR3JpZFtpICsgMV0gKiAxMDApO1xuICAgICAgaWYgKHR5cGVvZiBzbGlkZXNHcmlkW2kgKyAxXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgaWYgKG5vcm1hbGl6ZWRUcmFuc2xhdGUgPj0gbm9ybWFsaXplZEdyaWQgJiYgbm9ybWFsaXplZFRyYW5zbGF0ZSA8IG5vcm1hbGl6ZWRHcmlkTmV4dCAtIChub3JtYWxpemVkR3JpZE5leHQgLSBub3JtYWxpemVkR3JpZCkgLyAyKSB7XG4gICAgICAgICAgc2xpZGVJbmRleCA9IGk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9ybWFsaXplZFRyYW5zbGF0ZSA+PSBub3JtYWxpemVkR3JpZCAmJiBub3JtYWxpemVkVHJhbnNsYXRlIDwgbm9ybWFsaXplZEdyaWROZXh0KSB7XG4gICAgICAgICAgc2xpZGVJbmRleCA9IGkgKyAxO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKG5vcm1hbGl6ZWRUcmFuc2xhdGUgPj0gbm9ybWFsaXplZEdyaWQpIHtcbiAgICAgICAgc2xpZGVJbmRleCA9IGk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIC8vIERpcmVjdGlvbnMgbG9ja3NcbiAgaWYgKHN3aXBlci5pbml0aWFsaXplZCAmJiBzbGlkZUluZGV4ICE9PSBhY3RpdmVJbmRleCkge1xuICAgIGlmICghc3dpcGVyLmFsbG93U2xpZGVOZXh0ICYmIChydGwgPyB0cmFuc2xhdGUgPiBzd2lwZXIudHJhbnNsYXRlICYmIHRyYW5zbGF0ZSA+IHN3aXBlci5taW5UcmFuc2xhdGUoKSA6IHRyYW5zbGF0ZSA8IHN3aXBlci50cmFuc2xhdGUgJiYgdHJhbnNsYXRlIDwgc3dpcGVyLm1pblRyYW5zbGF0ZSgpKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoIXN3aXBlci5hbGxvd1NsaWRlUHJldiAmJiB0cmFuc2xhdGUgPiBzd2lwZXIudHJhbnNsYXRlICYmIHRyYW5zbGF0ZSA+IHN3aXBlci5tYXhUcmFuc2xhdGUoKSkge1xuICAgICAgaWYgKChhY3RpdmVJbmRleCB8fCAwKSAhPT0gc2xpZGVJbmRleCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmIChzbGlkZUluZGV4ICE9PSAocHJldmlvdXNJbmRleCB8fCAwKSAmJiBydW5DYWxsYmFja3MpIHtcbiAgICBzd2lwZXIuZW1pdCgnYmVmb3JlU2xpZGVDaGFuZ2VTdGFydCcpO1xuICB9XG5cbiAgLy8gVXBkYXRlIHByb2dyZXNzXG4gIHN3aXBlci51cGRhdGVQcm9ncmVzcyh0cmFuc2xhdGUpO1xuICBsZXQgZGlyZWN0aW9uO1xuICBpZiAoc2xpZGVJbmRleCA+IGFjdGl2ZUluZGV4KSBkaXJlY3Rpb24gPSAnbmV4dCc7ZWxzZSBpZiAoc2xpZGVJbmRleCA8IGFjdGl2ZUluZGV4KSBkaXJlY3Rpb24gPSAncHJldic7ZWxzZSBkaXJlY3Rpb24gPSAncmVzZXQnO1xuXG4gIC8vIFVwZGF0ZSBJbmRleFxuICBpZiAocnRsICYmIC10cmFuc2xhdGUgPT09IHN3aXBlci50cmFuc2xhdGUgfHwgIXJ0bCAmJiB0cmFuc2xhdGUgPT09IHN3aXBlci50cmFuc2xhdGUpIHtcbiAgICBzd2lwZXIudXBkYXRlQWN0aXZlSW5kZXgoc2xpZGVJbmRleCk7XG4gICAgLy8gVXBkYXRlIEhlaWdodFxuICAgIGlmIChwYXJhbXMuYXV0b0hlaWdodCkge1xuICAgICAgc3dpcGVyLnVwZGF0ZUF1dG9IZWlnaHQoKTtcbiAgICB9XG4gICAgc3dpcGVyLnVwZGF0ZVNsaWRlc0NsYXNzZXMoKTtcbiAgICBpZiAocGFyYW1zLmVmZmVjdCAhPT0gJ3NsaWRlJykge1xuICAgICAgc3dpcGVyLnNldFRyYW5zbGF0ZSh0cmFuc2xhdGUpO1xuICAgIH1cbiAgICBpZiAoZGlyZWN0aW9uICE9PSAncmVzZXQnKSB7XG4gICAgICBzd2lwZXIudHJhbnNpdGlvblN0YXJ0KHJ1bkNhbGxiYWNrcywgZGlyZWN0aW9uKTtcbiAgICAgIHN3aXBlci50cmFuc2l0aW9uRW5kKHJ1bkNhbGxiYWNrcywgZGlyZWN0aW9uKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChwYXJhbXMuY3NzTW9kZSkge1xuICAgIGNvbnN0IGlzSCA9IHN3aXBlci5pc0hvcml6b250YWwoKTtcbiAgICBjb25zdCB0ID0gcnRsID8gdHJhbnNsYXRlIDogLXRyYW5zbGF0ZTtcbiAgICBpZiAoc3BlZWQgPT09IDApIHtcbiAgICAgIGNvbnN0IGlzVmlydHVhbCA9IHN3aXBlci52aXJ0dWFsICYmIHN3aXBlci5wYXJhbXMudmlydHVhbC5lbmFibGVkO1xuICAgICAgaWYgKGlzVmlydHVhbCkge1xuICAgICAgICBzd2lwZXIud3JhcHBlckVsLnN0eWxlLnNjcm9sbFNuYXBUeXBlID0gJ25vbmUnO1xuICAgICAgICBzd2lwZXIuX2ltbWVkaWF0ZVZpcnR1YWwgPSB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKGlzVmlydHVhbCAmJiAhc3dpcGVyLl9jc3NNb2RlVmlydHVhbEluaXRpYWxTZXQgJiYgc3dpcGVyLnBhcmFtcy5pbml0aWFsU2xpZGUgPiAwKSB7XG4gICAgICAgIHN3aXBlci5fY3NzTW9kZVZpcnR1YWxJbml0aWFsU2V0ID0gdHJ1ZTtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICB3cmFwcGVyRWxbaXNIID8gJ3Njcm9sbExlZnQnIDogJ3Njcm9sbFRvcCddID0gdDtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3cmFwcGVyRWxbaXNIID8gJ3Njcm9sbExlZnQnIDogJ3Njcm9sbFRvcCddID0gdDtcbiAgICAgIH1cbiAgICAgIGlmIChpc1ZpcnR1YWwpIHtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICBzd2lwZXIud3JhcHBlckVsLnN0eWxlLnNjcm9sbFNuYXBUeXBlID0gJyc7XG4gICAgICAgICAgc3dpcGVyLl9pbW1lZGlhdGVWaXJ0dWFsID0gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIXN3aXBlci5zdXBwb3J0LnNtb290aFNjcm9sbCkge1xuICAgICAgICBhbmltYXRlQ1NTTW9kZVNjcm9sbCh7XG4gICAgICAgICAgc3dpcGVyLFxuICAgICAgICAgIHRhcmdldFBvc2l0aW9uOiB0LFxuICAgICAgICAgIHNpZGU6IGlzSCA/ICdsZWZ0JyA6ICd0b3AnXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHdyYXBwZXJFbC5zY3JvbGxUbyh7XG4gICAgICAgIFtpc0ggPyAnbGVmdCcgOiAndG9wJ106IHQsXG4gICAgICAgIGJlaGF2aW9yOiAnc21vb3RoJ1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHN3aXBlci5zZXRUcmFuc2l0aW9uKHNwZWVkKTtcbiAgc3dpcGVyLnNldFRyYW5zbGF0ZSh0cmFuc2xhdGUpO1xuICBzd2lwZXIudXBkYXRlQWN0aXZlSW5kZXgoc2xpZGVJbmRleCk7XG4gIHN3aXBlci51cGRhdGVTbGlkZXNDbGFzc2VzKCk7XG4gIHN3aXBlci5lbWl0KCdiZWZvcmVUcmFuc2l0aW9uU3RhcnQnLCBzcGVlZCwgaW50ZXJuYWwpO1xuICBzd2lwZXIudHJhbnNpdGlvblN0YXJ0KHJ1bkNhbGxiYWNrcywgZGlyZWN0aW9uKTtcbiAgaWYgKHNwZWVkID09PSAwKSB7XG4gICAgc3dpcGVyLnRyYW5zaXRpb25FbmQocnVuQ2FsbGJhY2tzLCBkaXJlY3Rpb24pO1xuICB9IGVsc2UgaWYgKCFzd2lwZXIuYW5pbWF0aW5nKSB7XG4gICAgc3dpcGVyLmFuaW1hdGluZyA9IHRydWU7XG4gICAgaWYgKCFzd2lwZXIub25TbGlkZVRvV3JhcHBlclRyYW5zaXRpb25FbmQpIHtcbiAgICAgIHN3aXBlci5vblNsaWRlVG9XcmFwcGVyVHJhbnNpdGlvbkVuZCA9IGZ1bmN0aW9uIHRyYW5zaXRpb25FbmQoZSkge1xuICAgICAgICBpZiAoIXN3aXBlciB8fCBzd2lwZXIuZGVzdHJveWVkKSByZXR1cm47XG4gICAgICAgIGlmIChlLnRhcmdldCAhPT0gdGhpcykgcmV0dXJuO1xuICAgICAgICBzd2lwZXIud3JhcHBlckVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCBzd2lwZXIub25TbGlkZVRvV3JhcHBlclRyYW5zaXRpb25FbmQpO1xuICAgICAgICBzd2lwZXIub25TbGlkZVRvV3JhcHBlclRyYW5zaXRpb25FbmQgPSBudWxsO1xuICAgICAgICBkZWxldGUgc3dpcGVyLm9uU2xpZGVUb1dyYXBwZXJUcmFuc2l0aW9uRW5kO1xuICAgICAgICBzd2lwZXIudHJhbnNpdGlvbkVuZChydW5DYWxsYmFja3MsIGRpcmVjdGlvbik7XG4gICAgICB9O1xuICAgIH1cbiAgICBzd2lwZXIud3JhcHBlckVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCBzd2lwZXIub25TbGlkZVRvV3JhcHBlclRyYW5zaXRpb25FbmQpO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBzbGlkZVRvTG9vcChpbmRleCwgc3BlZWQsIHJ1bkNhbGxiYWNrcywgaW50ZXJuYWwpIHtcbiAgaWYgKGluZGV4ID09PSB2b2lkIDApIHtcbiAgICBpbmRleCA9IDA7XG4gIH1cbiAgaWYgKHNwZWVkID09PSB2b2lkIDApIHtcbiAgICBzcGVlZCA9IHRoaXMucGFyYW1zLnNwZWVkO1xuICB9XG4gIGlmIChydW5DYWxsYmFja3MgPT09IHZvaWQgMCkge1xuICAgIHJ1bkNhbGxiYWNrcyA9IHRydWU7XG4gIH1cbiAgaWYgKHR5cGVvZiBpbmRleCA9PT0gJ3N0cmluZycpIHtcbiAgICBjb25zdCBpbmRleEFzTnVtYmVyID0gcGFyc2VJbnQoaW5kZXgsIDEwKTtcbiAgICBpbmRleCA9IGluZGV4QXNOdW1iZXI7XG4gIH1cbiAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgY29uc3QgZ3JpZEVuYWJsZWQgPSBzd2lwZXIuZ3JpZCAmJiBzd2lwZXIucGFyYW1zLmdyaWQgJiYgc3dpcGVyLnBhcmFtcy5ncmlkLnJvd3MgPiAxO1xuICBsZXQgbmV3SW5kZXggPSBpbmRleDtcbiAgaWYgKHN3aXBlci5wYXJhbXMubG9vcCkge1xuICAgIGlmIChzd2lwZXIudmlydHVhbCAmJiBzd2lwZXIucGFyYW1zLnZpcnR1YWwuZW5hYmxlZCkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgICBuZXdJbmRleCA9IG5ld0luZGV4ICsgc3dpcGVyLnZpcnR1YWwuc2xpZGVzQmVmb3JlO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgdGFyZ2V0U2xpZGVJbmRleDtcbiAgICAgIGlmIChncmlkRW5hYmxlZCkge1xuICAgICAgICBjb25zdCBzbGlkZUluZGV4ID0gbmV3SW5kZXggKiBzd2lwZXIucGFyYW1zLmdyaWQucm93cztcbiAgICAgICAgdGFyZ2V0U2xpZGVJbmRleCA9IHN3aXBlci5zbGlkZXMuZmlsdGVyKHNsaWRlRWwgPT4gc2xpZGVFbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3dpcGVyLXNsaWRlLWluZGV4JykgKiAxID09PSBzbGlkZUluZGV4KVswXS5jb2x1bW47XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0YXJnZXRTbGlkZUluZGV4ID0gc3dpcGVyLmdldFNsaWRlSW5kZXhCeURhdGEobmV3SW5kZXgpO1xuICAgICAgfVxuICAgICAgY29uc3QgY29scyA9IGdyaWRFbmFibGVkID8gTWF0aC5jZWlsKHN3aXBlci5zbGlkZXMubGVuZ3RoIC8gc3dpcGVyLnBhcmFtcy5ncmlkLnJvd3MpIDogc3dpcGVyLnNsaWRlcy5sZW5ndGg7XG4gICAgICBjb25zdCB7XG4gICAgICAgIGNlbnRlcmVkU2xpZGVzXG4gICAgICB9ID0gc3dpcGVyLnBhcmFtcztcbiAgICAgIGxldCBzbGlkZXNQZXJWaWV3ID0gc3dpcGVyLnBhcmFtcy5zbGlkZXNQZXJWaWV3O1xuICAgICAgaWYgKHNsaWRlc1BlclZpZXcgPT09ICdhdXRvJykge1xuICAgICAgICBzbGlkZXNQZXJWaWV3ID0gc3dpcGVyLnNsaWRlc1BlclZpZXdEeW5hbWljKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzbGlkZXNQZXJWaWV3ID0gTWF0aC5jZWlsKHBhcnNlRmxvYXQoc3dpcGVyLnBhcmFtcy5zbGlkZXNQZXJWaWV3LCAxMCkpO1xuICAgICAgICBpZiAoY2VudGVyZWRTbGlkZXMgJiYgc2xpZGVzUGVyVmlldyAlIDIgPT09IDApIHtcbiAgICAgICAgICBzbGlkZXNQZXJWaWV3ID0gc2xpZGVzUGVyVmlldyArIDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxldCBuZWVkTG9vcEZpeCA9IGNvbHMgLSB0YXJnZXRTbGlkZUluZGV4IDwgc2xpZGVzUGVyVmlldztcbiAgICAgIGlmIChjZW50ZXJlZFNsaWRlcykge1xuICAgICAgICBuZWVkTG9vcEZpeCA9IG5lZWRMb29wRml4IHx8IHRhcmdldFNsaWRlSW5kZXggPCBNYXRoLmNlaWwoc2xpZGVzUGVyVmlldyAvIDIpO1xuICAgICAgfVxuICAgICAgaWYgKG5lZWRMb29wRml4KSB7XG4gICAgICAgIGNvbnN0IGRpcmVjdGlvbiA9IGNlbnRlcmVkU2xpZGVzID8gdGFyZ2V0U2xpZGVJbmRleCA8IHN3aXBlci5hY3RpdmVJbmRleCA/ICdwcmV2JyA6ICduZXh0JyA6IHRhcmdldFNsaWRlSW5kZXggLSBzd2lwZXIuYWN0aXZlSW5kZXggLSAxIDwgc3dpcGVyLnBhcmFtcy5zbGlkZXNQZXJWaWV3ID8gJ25leHQnIDogJ3ByZXYnO1xuICAgICAgICBzd2lwZXIubG9vcEZpeCh7XG4gICAgICAgICAgZGlyZWN0aW9uLFxuICAgICAgICAgIHNsaWRlVG86IHRydWUsXG4gICAgICAgICAgYWN0aXZlU2xpZGVJbmRleDogZGlyZWN0aW9uID09PSAnbmV4dCcgPyB0YXJnZXRTbGlkZUluZGV4ICsgMSA6IHRhcmdldFNsaWRlSW5kZXggLSBjb2xzICsgMSxcbiAgICAgICAgICBzbGlkZVJlYWxJbmRleDogZGlyZWN0aW9uID09PSAnbmV4dCcgPyBzd2lwZXIucmVhbEluZGV4IDogdW5kZWZpbmVkXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKGdyaWRFbmFibGVkKSB7XG4gICAgICAgIGNvbnN0IHNsaWRlSW5kZXggPSBuZXdJbmRleCAqIHN3aXBlci5wYXJhbXMuZ3JpZC5yb3dzO1xuICAgICAgICBuZXdJbmRleCA9IHN3aXBlci5zbGlkZXMuZmlsdGVyKHNsaWRlRWwgPT4gc2xpZGVFbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3dpcGVyLXNsaWRlLWluZGV4JykgKiAxID09PSBzbGlkZUluZGV4KVswXS5jb2x1bW47XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdJbmRleCA9IHN3aXBlci5nZXRTbGlkZUluZGV4QnlEYXRhKG5ld0luZGV4KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICBzd2lwZXIuc2xpZGVUbyhuZXdJbmRleCwgc3BlZWQsIHJ1bkNhbGxiYWNrcywgaW50ZXJuYWwpO1xuICB9KTtcbiAgcmV0dXJuIHN3aXBlcjtcbn1cblxuLyogZXNsaW50IG5vLXVudXNlZC12YXJzOiBcIm9mZlwiICovXG5mdW5jdGlvbiBzbGlkZU5leHQoc3BlZWQsIHJ1bkNhbGxiYWNrcywgaW50ZXJuYWwpIHtcbiAgaWYgKHNwZWVkID09PSB2b2lkIDApIHtcbiAgICBzcGVlZCA9IHRoaXMucGFyYW1zLnNwZWVkO1xuICB9XG4gIGlmIChydW5DYWxsYmFja3MgPT09IHZvaWQgMCkge1xuICAgIHJ1bkNhbGxiYWNrcyA9IHRydWU7XG4gIH1cbiAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgY29uc3Qge1xuICAgIGVuYWJsZWQsXG4gICAgcGFyYW1zLFxuICAgIGFuaW1hdGluZ1xuICB9ID0gc3dpcGVyO1xuICBpZiAoIWVuYWJsZWQpIHJldHVybiBzd2lwZXI7XG4gIGxldCBwZXJHcm91cCA9IHBhcmFtcy5zbGlkZXNQZXJHcm91cDtcbiAgaWYgKHBhcmFtcy5zbGlkZXNQZXJWaWV3ID09PSAnYXV0bycgJiYgcGFyYW1zLnNsaWRlc1Blckdyb3VwID09PSAxICYmIHBhcmFtcy5zbGlkZXNQZXJHcm91cEF1dG8pIHtcbiAgICBwZXJHcm91cCA9IE1hdGgubWF4KHN3aXBlci5zbGlkZXNQZXJWaWV3RHluYW1pYygnY3VycmVudCcsIHRydWUpLCAxKTtcbiAgfVxuICBjb25zdCBpbmNyZW1lbnQgPSBzd2lwZXIuYWN0aXZlSW5kZXggPCBwYXJhbXMuc2xpZGVzUGVyR3JvdXBTa2lwID8gMSA6IHBlckdyb3VwO1xuICBjb25zdCBpc1ZpcnR1YWwgPSBzd2lwZXIudmlydHVhbCAmJiBwYXJhbXMudmlydHVhbC5lbmFibGVkO1xuICBpZiAocGFyYW1zLmxvb3ApIHtcbiAgICBpZiAoYW5pbWF0aW5nICYmICFpc1ZpcnR1YWwgJiYgcGFyYW1zLmxvb3BQcmV2ZW50c1NsaWRpbmcpIHJldHVybiBmYWxzZTtcbiAgICBzd2lwZXIubG9vcEZpeCh7XG4gICAgICBkaXJlY3Rpb246ICduZXh0J1xuICAgIH0pO1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgIHN3aXBlci5fY2xpZW50TGVmdCA9IHN3aXBlci53cmFwcGVyRWwuY2xpZW50TGVmdDtcbiAgICBpZiAoc3dpcGVyLmFjdGl2ZUluZGV4ID09PSBzd2lwZXIuc2xpZGVzLmxlbmd0aCAtIDEgJiYgcGFyYW1zLmNzc01vZGUpIHtcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgIHN3aXBlci5zbGlkZVRvKHN3aXBlci5hY3RpdmVJbmRleCArIGluY3JlbWVudCwgc3BlZWQsIHJ1bkNhbGxiYWNrcywgaW50ZXJuYWwpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgaWYgKHBhcmFtcy5yZXdpbmQgJiYgc3dpcGVyLmlzRW5kKSB7XG4gICAgcmV0dXJuIHN3aXBlci5zbGlkZVRvKDAsIHNwZWVkLCBydW5DYWxsYmFja3MsIGludGVybmFsKTtcbiAgfVxuICByZXR1cm4gc3dpcGVyLnNsaWRlVG8oc3dpcGVyLmFjdGl2ZUluZGV4ICsgaW5jcmVtZW50LCBzcGVlZCwgcnVuQ2FsbGJhY2tzLCBpbnRlcm5hbCk7XG59XG5cbi8qIGVzbGludCBuby11bnVzZWQtdmFyczogXCJvZmZcIiAqL1xuZnVuY3Rpb24gc2xpZGVQcmV2KHNwZWVkLCBydW5DYWxsYmFja3MsIGludGVybmFsKSB7XG4gIGlmIChzcGVlZCA9PT0gdm9pZCAwKSB7XG4gICAgc3BlZWQgPSB0aGlzLnBhcmFtcy5zcGVlZDtcbiAgfVxuICBpZiAocnVuQ2FsbGJhY2tzID09PSB2b2lkIDApIHtcbiAgICBydW5DYWxsYmFja3MgPSB0cnVlO1xuICB9XG4gIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gIGNvbnN0IHtcbiAgICBwYXJhbXMsXG4gICAgc25hcEdyaWQsXG4gICAgc2xpZGVzR3JpZCxcbiAgICBydGxUcmFuc2xhdGUsXG4gICAgZW5hYmxlZCxcbiAgICBhbmltYXRpbmdcbiAgfSA9IHN3aXBlcjtcbiAgaWYgKCFlbmFibGVkKSByZXR1cm4gc3dpcGVyO1xuICBjb25zdCBpc1ZpcnR1YWwgPSBzd2lwZXIudmlydHVhbCAmJiBwYXJhbXMudmlydHVhbC5lbmFibGVkO1xuICBpZiAocGFyYW1zLmxvb3ApIHtcbiAgICBpZiAoYW5pbWF0aW5nICYmICFpc1ZpcnR1YWwgJiYgcGFyYW1zLmxvb3BQcmV2ZW50c1NsaWRpbmcpIHJldHVybiBmYWxzZTtcbiAgICBzd2lwZXIubG9vcEZpeCh7XG4gICAgICBkaXJlY3Rpb246ICdwcmV2J1xuICAgIH0pO1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgIHN3aXBlci5fY2xpZW50TGVmdCA9IHN3aXBlci53cmFwcGVyRWwuY2xpZW50TGVmdDtcbiAgfVxuICBjb25zdCB0cmFuc2xhdGUgPSBydGxUcmFuc2xhdGUgPyBzd2lwZXIudHJhbnNsYXRlIDogLXN3aXBlci50cmFuc2xhdGU7XG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZSh2YWwpIHtcbiAgICBpZiAodmFsIDwgMCkgcmV0dXJuIC1NYXRoLmZsb29yKE1hdGguYWJzKHZhbCkpO1xuICAgIHJldHVybiBNYXRoLmZsb29yKHZhbCk7XG4gIH1cbiAgY29uc3Qgbm9ybWFsaXplZFRyYW5zbGF0ZSA9IG5vcm1hbGl6ZSh0cmFuc2xhdGUpO1xuICBjb25zdCBub3JtYWxpemVkU25hcEdyaWQgPSBzbmFwR3JpZC5tYXAodmFsID0+IG5vcm1hbGl6ZSh2YWwpKTtcbiAgbGV0IHByZXZTbmFwID0gc25hcEdyaWRbbm9ybWFsaXplZFNuYXBHcmlkLmluZGV4T2Yobm9ybWFsaXplZFRyYW5zbGF0ZSkgLSAxXTtcbiAgaWYgKHR5cGVvZiBwcmV2U25hcCA9PT0gJ3VuZGVmaW5lZCcgJiYgcGFyYW1zLmNzc01vZGUpIHtcbiAgICBsZXQgcHJldlNuYXBJbmRleDtcbiAgICBzbmFwR3JpZC5mb3JFYWNoKChzbmFwLCBzbmFwSW5kZXgpID0+IHtcbiAgICAgIGlmIChub3JtYWxpemVkVHJhbnNsYXRlID49IHNuYXApIHtcbiAgICAgICAgLy8gcHJldlNuYXAgPSBzbmFwO1xuICAgICAgICBwcmV2U25hcEluZGV4ID0gc25hcEluZGV4O1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICh0eXBlb2YgcHJldlNuYXBJbmRleCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHByZXZTbmFwID0gc25hcEdyaWRbcHJldlNuYXBJbmRleCA+IDAgPyBwcmV2U25hcEluZGV4IC0gMSA6IHByZXZTbmFwSW5kZXhdO1xuICAgIH1cbiAgfVxuICBsZXQgcHJldkluZGV4ID0gMDtcbiAgaWYgKHR5cGVvZiBwcmV2U25hcCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBwcmV2SW5kZXggPSBzbGlkZXNHcmlkLmluZGV4T2YocHJldlNuYXApO1xuICAgIGlmIChwcmV2SW5kZXggPCAwKSBwcmV2SW5kZXggPSBzd2lwZXIuYWN0aXZlSW5kZXggLSAxO1xuICAgIGlmIChwYXJhbXMuc2xpZGVzUGVyVmlldyA9PT0gJ2F1dG8nICYmIHBhcmFtcy5zbGlkZXNQZXJHcm91cCA9PT0gMSAmJiBwYXJhbXMuc2xpZGVzUGVyR3JvdXBBdXRvKSB7XG4gICAgICBwcmV2SW5kZXggPSBwcmV2SW5kZXggLSBzd2lwZXIuc2xpZGVzUGVyVmlld0R5bmFtaWMoJ3ByZXZpb3VzJywgdHJ1ZSkgKyAxO1xuICAgICAgcHJldkluZGV4ID0gTWF0aC5tYXgocHJldkluZGV4LCAwKTtcbiAgICB9XG4gIH1cbiAgaWYgKHBhcmFtcy5yZXdpbmQgJiYgc3dpcGVyLmlzQmVnaW5uaW5nKSB7XG4gICAgY29uc3QgbGFzdEluZGV4ID0gc3dpcGVyLnBhcmFtcy52aXJ0dWFsICYmIHN3aXBlci5wYXJhbXMudmlydHVhbC5lbmFibGVkICYmIHN3aXBlci52aXJ0dWFsID8gc3dpcGVyLnZpcnR1YWwuc2xpZGVzLmxlbmd0aCAtIDEgOiBzd2lwZXIuc2xpZGVzLmxlbmd0aCAtIDE7XG4gICAgcmV0dXJuIHN3aXBlci5zbGlkZVRvKGxhc3RJbmRleCwgc3BlZWQsIHJ1bkNhbGxiYWNrcywgaW50ZXJuYWwpO1xuICB9IGVsc2UgaWYgKHBhcmFtcy5sb29wICYmIHN3aXBlci5hY3RpdmVJbmRleCA9PT0gMCAmJiBwYXJhbXMuY3NzTW9kZSkge1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICBzd2lwZXIuc2xpZGVUbyhwcmV2SW5kZXgsIHNwZWVkLCBydW5DYWxsYmFja3MsIGludGVybmFsKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gc3dpcGVyLnNsaWRlVG8ocHJldkluZGV4LCBzcGVlZCwgcnVuQ2FsbGJhY2tzLCBpbnRlcm5hbCk7XG59XG5cbi8qIGVzbGludCBuby11bnVzZWQtdmFyczogXCJvZmZcIiAqL1xuZnVuY3Rpb24gc2xpZGVSZXNldChzcGVlZCwgcnVuQ2FsbGJhY2tzLCBpbnRlcm5hbCkge1xuICBpZiAoc3BlZWQgPT09IHZvaWQgMCkge1xuICAgIHNwZWVkID0gdGhpcy5wYXJhbXMuc3BlZWQ7XG4gIH1cbiAgaWYgKHJ1bkNhbGxiYWNrcyA9PT0gdm9pZCAwKSB7XG4gICAgcnVuQ2FsbGJhY2tzID0gdHJ1ZTtcbiAgfVxuICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICByZXR1cm4gc3dpcGVyLnNsaWRlVG8oc3dpcGVyLmFjdGl2ZUluZGV4LCBzcGVlZCwgcnVuQ2FsbGJhY2tzLCBpbnRlcm5hbCk7XG59XG5cbi8qIGVzbGludCBuby11bnVzZWQtdmFyczogXCJvZmZcIiAqL1xuZnVuY3Rpb24gc2xpZGVUb0Nsb3Nlc3Qoc3BlZWQsIHJ1bkNhbGxiYWNrcywgaW50ZXJuYWwsIHRocmVzaG9sZCkge1xuICBpZiAoc3BlZWQgPT09IHZvaWQgMCkge1xuICAgIHNwZWVkID0gdGhpcy5wYXJhbXMuc3BlZWQ7XG4gIH1cbiAgaWYgKHJ1bkNhbGxiYWNrcyA9PT0gdm9pZCAwKSB7XG4gICAgcnVuQ2FsbGJhY2tzID0gdHJ1ZTtcbiAgfVxuICBpZiAodGhyZXNob2xkID09PSB2b2lkIDApIHtcbiAgICB0aHJlc2hvbGQgPSAwLjU7XG4gIH1cbiAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgbGV0IGluZGV4ID0gc3dpcGVyLmFjdGl2ZUluZGV4O1xuICBjb25zdCBza2lwID0gTWF0aC5taW4oc3dpcGVyLnBhcmFtcy5zbGlkZXNQZXJHcm91cFNraXAsIGluZGV4KTtcbiAgY29uc3Qgc25hcEluZGV4ID0gc2tpcCArIE1hdGguZmxvb3IoKGluZGV4IC0gc2tpcCkgLyBzd2lwZXIucGFyYW1zLnNsaWRlc1Blckdyb3VwKTtcbiAgY29uc3QgdHJhbnNsYXRlID0gc3dpcGVyLnJ0bFRyYW5zbGF0ZSA/IHN3aXBlci50cmFuc2xhdGUgOiAtc3dpcGVyLnRyYW5zbGF0ZTtcbiAgaWYgKHRyYW5zbGF0ZSA+PSBzd2lwZXIuc25hcEdyaWRbc25hcEluZGV4XSkge1xuICAgIC8vIFRoZSBjdXJyZW50IHRyYW5zbGF0ZSBpcyBvbiBvciBhZnRlciB0aGUgY3VycmVudCBzbmFwIGluZGV4LCBzbyB0aGUgY2hvaWNlXG4gICAgLy8gaXMgYmV0d2VlbiB0aGUgY3VycmVudCBpbmRleCBhbmQgdGhlIG9uZSBhZnRlciBpdC5cbiAgICBjb25zdCBjdXJyZW50U25hcCA9IHN3aXBlci5zbmFwR3JpZFtzbmFwSW5kZXhdO1xuICAgIGNvbnN0IG5leHRTbmFwID0gc3dpcGVyLnNuYXBHcmlkW3NuYXBJbmRleCArIDFdO1xuICAgIGlmICh0cmFuc2xhdGUgLSBjdXJyZW50U25hcCA+IChuZXh0U25hcCAtIGN1cnJlbnRTbmFwKSAqIHRocmVzaG9sZCkge1xuICAgICAgaW5kZXggKz0gc3dpcGVyLnBhcmFtcy5zbGlkZXNQZXJHcm91cDtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gVGhlIGN1cnJlbnQgdHJhbnNsYXRlIGlzIGJlZm9yZSB0aGUgY3VycmVudCBzbmFwIGluZGV4LCBzbyB0aGUgY2hvaWNlXG4gICAgLy8gaXMgYmV0d2VlbiB0aGUgY3VycmVudCBpbmRleCBhbmQgdGhlIG9uZSBiZWZvcmUgaXQuXG4gICAgY29uc3QgcHJldlNuYXAgPSBzd2lwZXIuc25hcEdyaWRbc25hcEluZGV4IC0gMV07XG4gICAgY29uc3QgY3VycmVudFNuYXAgPSBzd2lwZXIuc25hcEdyaWRbc25hcEluZGV4XTtcbiAgICBpZiAodHJhbnNsYXRlIC0gcHJldlNuYXAgPD0gKGN1cnJlbnRTbmFwIC0gcHJldlNuYXApICogdGhyZXNob2xkKSB7XG4gICAgICBpbmRleCAtPSBzd2lwZXIucGFyYW1zLnNsaWRlc1Blckdyb3VwO1xuICAgIH1cbiAgfVxuICBpbmRleCA9IE1hdGgubWF4KGluZGV4LCAwKTtcbiAgaW5kZXggPSBNYXRoLm1pbihpbmRleCwgc3dpcGVyLnNsaWRlc0dyaWQubGVuZ3RoIC0gMSk7XG4gIHJldHVybiBzd2lwZXIuc2xpZGVUbyhpbmRleCwgc3BlZWQsIHJ1bkNhbGxiYWNrcywgaW50ZXJuYWwpO1xufVxuXG5mdW5jdGlvbiBzbGlkZVRvQ2xpY2tlZFNsaWRlKCkge1xuICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICBjb25zdCB7XG4gICAgcGFyYW1zLFxuICAgIHNsaWRlc0VsXG4gIH0gPSBzd2lwZXI7XG4gIGNvbnN0IHNsaWRlc1BlclZpZXcgPSBwYXJhbXMuc2xpZGVzUGVyVmlldyA9PT0gJ2F1dG8nID8gc3dpcGVyLnNsaWRlc1BlclZpZXdEeW5hbWljKCkgOiBwYXJhbXMuc2xpZGVzUGVyVmlldztcbiAgbGV0IHNsaWRlVG9JbmRleCA9IHN3aXBlci5jbGlja2VkSW5kZXg7XG4gIGxldCByZWFsSW5kZXg7XG4gIGNvbnN0IHNsaWRlU2VsZWN0b3IgPSBzd2lwZXIuaXNFbGVtZW50ID8gYHN3aXBlci1zbGlkZWAgOiBgLiR7cGFyYW1zLnNsaWRlQ2xhc3N9YDtcbiAgaWYgKHBhcmFtcy5sb29wKSB7XG4gICAgaWYgKHN3aXBlci5hbmltYXRpbmcpIHJldHVybjtcbiAgICByZWFsSW5kZXggPSBwYXJzZUludChzd2lwZXIuY2xpY2tlZFNsaWRlLmdldEF0dHJpYnV0ZSgnZGF0YS1zd2lwZXItc2xpZGUtaW5kZXgnKSwgMTApO1xuICAgIGlmIChwYXJhbXMuY2VudGVyZWRTbGlkZXMpIHtcbiAgICAgIGlmIChzbGlkZVRvSW5kZXggPCBzd2lwZXIubG9vcGVkU2xpZGVzIC0gc2xpZGVzUGVyVmlldyAvIDIgfHwgc2xpZGVUb0luZGV4ID4gc3dpcGVyLnNsaWRlcy5sZW5ndGggLSBzd2lwZXIubG9vcGVkU2xpZGVzICsgc2xpZGVzUGVyVmlldyAvIDIpIHtcbiAgICAgICAgc3dpcGVyLmxvb3BGaXgoKTtcbiAgICAgICAgc2xpZGVUb0luZGV4ID0gc3dpcGVyLmdldFNsaWRlSW5kZXgoZWxlbWVudENoaWxkcmVuKHNsaWRlc0VsLCBgJHtzbGlkZVNlbGVjdG9yfVtkYXRhLXN3aXBlci1zbGlkZS1pbmRleD1cIiR7cmVhbEluZGV4fVwiXWApWzBdKTtcbiAgICAgICAgbmV4dFRpY2soKCkgPT4ge1xuICAgICAgICAgIHN3aXBlci5zbGlkZVRvKHNsaWRlVG9JbmRleCk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3dpcGVyLnNsaWRlVG8oc2xpZGVUb0luZGV4KTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHNsaWRlVG9JbmRleCA+IHN3aXBlci5zbGlkZXMubGVuZ3RoIC0gc2xpZGVzUGVyVmlldykge1xuICAgICAgc3dpcGVyLmxvb3BGaXgoKTtcbiAgICAgIHNsaWRlVG9JbmRleCA9IHN3aXBlci5nZXRTbGlkZUluZGV4KGVsZW1lbnRDaGlsZHJlbihzbGlkZXNFbCwgYCR7c2xpZGVTZWxlY3Rvcn1bZGF0YS1zd2lwZXItc2xpZGUtaW5kZXg9XCIke3JlYWxJbmRleH1cIl1gKVswXSk7XG4gICAgICBuZXh0VGljaygoKSA9PiB7XG4gICAgICAgIHN3aXBlci5zbGlkZVRvKHNsaWRlVG9JbmRleCk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3dpcGVyLnNsaWRlVG8oc2xpZGVUb0luZGV4KTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgc3dpcGVyLnNsaWRlVG8oc2xpZGVUb0luZGV4KTtcbiAgfVxufVxuXG52YXIgc2xpZGUgPSB7XG4gIHNsaWRlVG8sXG4gIHNsaWRlVG9Mb29wLFxuICBzbGlkZU5leHQsXG4gIHNsaWRlUHJldixcbiAgc2xpZGVSZXNldCxcbiAgc2xpZGVUb0Nsb3Nlc3QsXG4gIHNsaWRlVG9DbGlja2VkU2xpZGVcbn07XG5cbmZ1bmN0aW9uIGxvb3BDcmVhdGUoc2xpZGVSZWFsSW5kZXgpIHtcbiAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgY29uc3Qge1xuICAgIHBhcmFtcyxcbiAgICBzbGlkZXNFbFxuICB9ID0gc3dpcGVyO1xuICBpZiAoIXBhcmFtcy5sb29wIHx8IHN3aXBlci52aXJ0dWFsICYmIHN3aXBlci5wYXJhbXMudmlydHVhbC5lbmFibGVkKSByZXR1cm47XG4gIGNvbnN0IGluaXRTbGlkZXMgPSAoKSA9PiB7XG4gICAgY29uc3Qgc2xpZGVzID0gZWxlbWVudENoaWxkcmVuKHNsaWRlc0VsLCBgLiR7cGFyYW1zLnNsaWRlQ2xhc3N9LCBzd2lwZXItc2xpZGVgKTtcbiAgICBzbGlkZXMuZm9yRWFjaCgoZWwsIGluZGV4KSA9PiB7XG4gICAgICBlbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtc3dpcGVyLXNsaWRlLWluZGV4JywgaW5kZXgpO1xuICAgIH0pO1xuICB9O1xuICBjb25zdCBncmlkRW5hYmxlZCA9IHN3aXBlci5ncmlkICYmIHBhcmFtcy5ncmlkICYmIHBhcmFtcy5ncmlkLnJvd3MgPiAxO1xuICBjb25zdCBzbGlkZXNQZXJHcm91cCA9IHBhcmFtcy5zbGlkZXNQZXJHcm91cCAqIChncmlkRW5hYmxlZCA/IHBhcmFtcy5ncmlkLnJvd3MgOiAxKTtcbiAgY29uc3Qgc2hvdWxkRmlsbEdyb3VwID0gc3dpcGVyLnNsaWRlcy5sZW5ndGggJSBzbGlkZXNQZXJHcm91cCAhPT0gMDtcbiAgY29uc3Qgc2hvdWxkRmlsbEdyaWQgPSBncmlkRW5hYmxlZCAmJiBzd2lwZXIuc2xpZGVzLmxlbmd0aCAlIHBhcmFtcy5ncmlkLnJvd3MgIT09IDA7XG4gIGNvbnN0IGFkZEJsYW5rU2xpZGVzID0gYW1vdW50T2ZTbGlkZXMgPT4ge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYW1vdW50T2ZTbGlkZXM7IGkgKz0gMSkge1xuICAgICAgY29uc3Qgc2xpZGVFbCA9IHN3aXBlci5pc0VsZW1lbnQgPyBjcmVhdGVFbGVtZW50KCdzd2lwZXItc2xpZGUnLCBbcGFyYW1zLnNsaWRlQmxhbmtDbGFzc10pIDogY3JlYXRlRWxlbWVudCgnZGl2JywgW3BhcmFtcy5zbGlkZUNsYXNzLCBwYXJhbXMuc2xpZGVCbGFua0NsYXNzXSk7XG4gICAgICBzd2lwZXIuc2xpZGVzRWwuYXBwZW5kKHNsaWRlRWwpO1xuICAgIH1cbiAgfTtcbiAgaWYgKHNob3VsZEZpbGxHcm91cCkge1xuICAgIGlmIChwYXJhbXMubG9vcEFkZEJsYW5rU2xpZGVzKSB7XG4gICAgICBjb25zdCBzbGlkZXNUb0FkZCA9IHNsaWRlc1Blckdyb3VwIC0gc3dpcGVyLnNsaWRlcy5sZW5ndGggJSBzbGlkZXNQZXJHcm91cDtcbiAgICAgIGFkZEJsYW5rU2xpZGVzKHNsaWRlc1RvQWRkKTtcbiAgICAgIHN3aXBlci5yZWNhbGNTbGlkZXMoKTtcbiAgICAgIHN3aXBlci51cGRhdGVTbGlkZXMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2hvd1dhcm5pbmcoJ1N3aXBlciBMb29wIFdhcm5pbmc6IFRoZSBudW1iZXIgb2Ygc2xpZGVzIGlzIG5vdCBldmVuIHRvIHNsaWRlc1Blckdyb3VwLCBsb29wIG1vZGUgbWF5IG5vdCBmdW5jdGlvbiBwcm9wZXJseS4gWW91IG5lZWQgdG8gYWRkIG1vcmUgc2xpZGVzIChvciBtYWtlIGR1cGxpY2F0ZXMsIG9yIGVtcHR5IHNsaWRlcyknKTtcbiAgICB9XG4gICAgaW5pdFNsaWRlcygpO1xuICB9IGVsc2UgaWYgKHNob3VsZEZpbGxHcmlkKSB7XG4gICAgaWYgKHBhcmFtcy5sb29wQWRkQmxhbmtTbGlkZXMpIHtcbiAgICAgIGNvbnN0IHNsaWRlc1RvQWRkID0gcGFyYW1zLmdyaWQucm93cyAtIHN3aXBlci5zbGlkZXMubGVuZ3RoICUgcGFyYW1zLmdyaWQucm93cztcbiAgICAgIGFkZEJsYW5rU2xpZGVzKHNsaWRlc1RvQWRkKTtcbiAgICAgIHN3aXBlci5yZWNhbGNTbGlkZXMoKTtcbiAgICAgIHN3aXBlci51cGRhdGVTbGlkZXMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2hvd1dhcm5pbmcoJ1N3aXBlciBMb29wIFdhcm5pbmc6IFRoZSBudW1iZXIgb2Ygc2xpZGVzIGlzIG5vdCBldmVuIHRvIGdyaWQucm93cywgbG9vcCBtb2RlIG1heSBub3QgZnVuY3Rpb24gcHJvcGVybHkuIFlvdSBuZWVkIHRvIGFkZCBtb3JlIHNsaWRlcyAob3IgbWFrZSBkdXBsaWNhdGVzLCBvciBlbXB0eSBzbGlkZXMpJyk7XG4gICAgfVxuICAgIGluaXRTbGlkZXMoKTtcbiAgfSBlbHNlIHtcbiAgICBpbml0U2xpZGVzKCk7XG4gIH1cbiAgc3dpcGVyLmxvb3BGaXgoe1xuICAgIHNsaWRlUmVhbEluZGV4LFxuICAgIGRpcmVjdGlvbjogcGFyYW1zLmNlbnRlcmVkU2xpZGVzID8gdW5kZWZpbmVkIDogJ25leHQnXG4gIH0pO1xufVxuXG5mdW5jdGlvbiBsb29wRml4KF90ZW1wKSB7XG4gIGxldCB7XG4gICAgc2xpZGVSZWFsSW5kZXgsXG4gICAgc2xpZGVUbyA9IHRydWUsXG4gICAgZGlyZWN0aW9uLFxuICAgIHNldFRyYW5zbGF0ZSxcbiAgICBhY3RpdmVTbGlkZUluZGV4LFxuICAgIGJ5Q29udHJvbGxlcixcbiAgICBieU1vdXNld2hlZWxcbiAgfSA9IF90ZW1wID09PSB2b2lkIDAgPyB7fSA6IF90ZW1wO1xuICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICBpZiAoIXN3aXBlci5wYXJhbXMubG9vcCkgcmV0dXJuO1xuICBzd2lwZXIuZW1pdCgnYmVmb3JlTG9vcEZpeCcpO1xuICBjb25zdCB7XG4gICAgc2xpZGVzLFxuICAgIGFsbG93U2xpZGVQcmV2LFxuICAgIGFsbG93U2xpZGVOZXh0LFxuICAgIHNsaWRlc0VsLFxuICAgIHBhcmFtc1xuICB9ID0gc3dpcGVyO1xuICBjb25zdCB7XG4gICAgY2VudGVyZWRTbGlkZXNcbiAgfSA9IHBhcmFtcztcbiAgc3dpcGVyLmFsbG93U2xpZGVQcmV2ID0gdHJ1ZTtcbiAgc3dpcGVyLmFsbG93U2xpZGVOZXh0ID0gdHJ1ZTtcbiAgaWYgKHN3aXBlci52aXJ0dWFsICYmIHBhcmFtcy52aXJ0dWFsLmVuYWJsZWQpIHtcbiAgICBpZiAoc2xpZGVUbykge1xuICAgICAgaWYgKCFwYXJhbXMuY2VudGVyZWRTbGlkZXMgJiYgc3dpcGVyLnNuYXBJbmRleCA9PT0gMCkge1xuICAgICAgICBzd2lwZXIuc2xpZGVUbyhzd2lwZXIudmlydHVhbC5zbGlkZXMubGVuZ3RoLCAwLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICB9IGVsc2UgaWYgKHBhcmFtcy5jZW50ZXJlZFNsaWRlcyAmJiBzd2lwZXIuc25hcEluZGV4IDwgcGFyYW1zLnNsaWRlc1BlclZpZXcpIHtcbiAgICAgICAgc3dpcGVyLnNsaWRlVG8oc3dpcGVyLnZpcnR1YWwuc2xpZGVzLmxlbmd0aCArIHN3aXBlci5zbmFwSW5kZXgsIDAsIGZhbHNlLCB0cnVlKTtcbiAgICAgIH0gZWxzZSBpZiAoc3dpcGVyLnNuYXBJbmRleCA9PT0gc3dpcGVyLnNuYXBHcmlkLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgc3dpcGVyLnNsaWRlVG8oc3dpcGVyLnZpcnR1YWwuc2xpZGVzQmVmb3JlLCAwLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHN3aXBlci5hbGxvd1NsaWRlUHJldiA9IGFsbG93U2xpZGVQcmV2O1xuICAgIHN3aXBlci5hbGxvd1NsaWRlTmV4dCA9IGFsbG93U2xpZGVOZXh0O1xuICAgIHN3aXBlci5lbWl0KCdsb29wRml4Jyk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxldCBzbGlkZXNQZXJWaWV3ID0gcGFyYW1zLnNsaWRlc1BlclZpZXc7XG4gIGlmIChzbGlkZXNQZXJWaWV3ID09PSAnYXV0bycpIHtcbiAgICBzbGlkZXNQZXJWaWV3ID0gc3dpcGVyLnNsaWRlc1BlclZpZXdEeW5hbWljKCk7XG4gIH0gZWxzZSB7XG4gICAgc2xpZGVzUGVyVmlldyA9IE1hdGguY2VpbChwYXJzZUZsb2F0KHBhcmFtcy5zbGlkZXNQZXJWaWV3LCAxMCkpO1xuICAgIGlmIChjZW50ZXJlZFNsaWRlcyAmJiBzbGlkZXNQZXJWaWV3ICUgMiA9PT0gMCkge1xuICAgICAgc2xpZGVzUGVyVmlldyA9IHNsaWRlc1BlclZpZXcgKyAxO1xuICAgIH1cbiAgfVxuICBjb25zdCBzbGlkZXNQZXJHcm91cCA9IHBhcmFtcy5zbGlkZXNQZXJHcm91cEF1dG8gPyBzbGlkZXNQZXJWaWV3IDogcGFyYW1zLnNsaWRlc1Blckdyb3VwO1xuICBsZXQgbG9vcGVkU2xpZGVzID0gc2xpZGVzUGVyR3JvdXA7XG4gIGlmIChsb29wZWRTbGlkZXMgJSBzbGlkZXNQZXJHcm91cCAhPT0gMCkge1xuICAgIGxvb3BlZFNsaWRlcyArPSBzbGlkZXNQZXJHcm91cCAtIGxvb3BlZFNsaWRlcyAlIHNsaWRlc1Blckdyb3VwO1xuICB9XG4gIGxvb3BlZFNsaWRlcyArPSBwYXJhbXMubG9vcEFkZGl0aW9uYWxTbGlkZXM7XG4gIHN3aXBlci5sb29wZWRTbGlkZXMgPSBsb29wZWRTbGlkZXM7XG4gIGNvbnN0IGdyaWRFbmFibGVkID0gc3dpcGVyLmdyaWQgJiYgcGFyYW1zLmdyaWQgJiYgcGFyYW1zLmdyaWQucm93cyA+IDE7XG4gIGlmIChzbGlkZXMubGVuZ3RoIDwgc2xpZGVzUGVyVmlldyArIGxvb3BlZFNsaWRlcykge1xuICAgIHNob3dXYXJuaW5nKCdTd2lwZXIgTG9vcCBXYXJuaW5nOiBUaGUgbnVtYmVyIG9mIHNsaWRlcyBpcyBub3QgZW5vdWdoIGZvciBsb29wIG1vZGUsIGl0IHdpbGwgYmUgZGlzYWJsZWQgYW5kIG5vdCBmdW5jdGlvbiBwcm9wZXJseS4gWW91IG5lZWQgdG8gYWRkIG1vcmUgc2xpZGVzIChvciBtYWtlIGR1cGxpY2F0ZXMpIG9yIGxvd2VyIHRoZSB2YWx1ZXMgb2Ygc2xpZGVzUGVyVmlldyBhbmQgc2xpZGVzUGVyR3JvdXAgcGFyYW1ldGVycycpO1xuICB9IGVsc2UgaWYgKGdyaWRFbmFibGVkICYmIHBhcmFtcy5ncmlkLmZpbGwgPT09ICdyb3cnKSB7XG4gICAgc2hvd1dhcm5pbmcoJ1N3aXBlciBMb29wIFdhcm5pbmc6IExvb3AgbW9kZSBpcyBub3QgY29tcGF0aWJsZSB3aXRoIGdyaWQuZmlsbCA9IGByb3dgJyk7XG4gIH1cbiAgY29uc3QgcHJlcGVuZFNsaWRlc0luZGV4ZXMgPSBbXTtcbiAgY29uc3QgYXBwZW5kU2xpZGVzSW5kZXhlcyA9IFtdO1xuICBsZXQgYWN0aXZlSW5kZXggPSBzd2lwZXIuYWN0aXZlSW5kZXg7XG4gIGlmICh0eXBlb2YgYWN0aXZlU2xpZGVJbmRleCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBhY3RpdmVTbGlkZUluZGV4ID0gc3dpcGVyLmdldFNsaWRlSW5kZXgoc2xpZGVzLmZpbHRlcihlbCA9PiBlbC5jbGFzc0xpc3QuY29udGFpbnMocGFyYW1zLnNsaWRlQWN0aXZlQ2xhc3MpKVswXSk7XG4gIH0gZWxzZSB7XG4gICAgYWN0aXZlSW5kZXggPSBhY3RpdmVTbGlkZUluZGV4O1xuICB9XG4gIGNvbnN0IGlzTmV4dCA9IGRpcmVjdGlvbiA9PT0gJ25leHQnIHx8ICFkaXJlY3Rpb247XG4gIGNvbnN0IGlzUHJldiA9IGRpcmVjdGlvbiA9PT0gJ3ByZXYnIHx8ICFkaXJlY3Rpb247XG4gIGxldCBzbGlkZXNQcmVwZW5kZWQgPSAwO1xuICBsZXQgc2xpZGVzQXBwZW5kZWQgPSAwO1xuICBjb25zdCBjb2xzID0gZ3JpZEVuYWJsZWQgPyBNYXRoLmNlaWwoc2xpZGVzLmxlbmd0aCAvIHBhcmFtcy5ncmlkLnJvd3MpIDogc2xpZGVzLmxlbmd0aDtcbiAgY29uc3QgYWN0aXZlQ29sSW5kZXggPSBncmlkRW5hYmxlZCA/IHNsaWRlc1thY3RpdmVTbGlkZUluZGV4XS5jb2x1bW4gOiBhY3RpdmVTbGlkZUluZGV4O1xuICBjb25zdCBhY3RpdmVDb2xJbmRleFdpdGhTaGlmdCA9IGFjdGl2ZUNvbEluZGV4ICsgKGNlbnRlcmVkU2xpZGVzICYmIHR5cGVvZiBzZXRUcmFuc2xhdGUgPT09ICd1bmRlZmluZWQnID8gLXNsaWRlc1BlclZpZXcgLyAyICsgMC41IDogMCk7XG4gIC8vIHByZXBlbmQgbGFzdCBzbGlkZXMgYmVmb3JlIHN0YXJ0XG4gIGlmIChhY3RpdmVDb2xJbmRleFdpdGhTaGlmdCA8IGxvb3BlZFNsaWRlcykge1xuICAgIHNsaWRlc1ByZXBlbmRlZCA9IE1hdGgubWF4KGxvb3BlZFNsaWRlcyAtIGFjdGl2ZUNvbEluZGV4V2l0aFNoaWZ0LCBzbGlkZXNQZXJHcm91cCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsb29wZWRTbGlkZXMgLSBhY3RpdmVDb2xJbmRleFdpdGhTaGlmdDsgaSArPSAxKSB7XG4gICAgICBjb25zdCBpbmRleCA9IGkgLSBNYXRoLmZsb29yKGkgLyBjb2xzKSAqIGNvbHM7XG4gICAgICBpZiAoZ3JpZEVuYWJsZWQpIHtcbiAgICAgICAgY29uc3QgY29sSW5kZXhUb1ByZXBlbmQgPSBjb2xzIC0gaW5kZXggLSAxO1xuICAgICAgICBmb3IgKGxldCBpID0gc2xpZGVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaSAtPSAxKSB7XG4gICAgICAgICAgaWYgKHNsaWRlc1tpXS5jb2x1bW4gPT09IGNvbEluZGV4VG9QcmVwZW5kKSBwcmVwZW5kU2xpZGVzSW5kZXhlcy5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICAgIC8vIHNsaWRlcy5mb3JFYWNoKChzbGlkZSwgc2xpZGVJbmRleCkgPT4ge1xuICAgICAgICAvLyAgIGlmIChzbGlkZS5jb2x1bW4gPT09IGNvbEluZGV4VG9QcmVwZW5kKSBwcmVwZW5kU2xpZGVzSW5kZXhlcy5wdXNoKHNsaWRlSW5kZXgpO1xuICAgICAgICAvLyB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHByZXBlbmRTbGlkZXNJbmRleGVzLnB1c2goY29scyAtIGluZGV4IC0gMSk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKGFjdGl2ZUNvbEluZGV4V2l0aFNoaWZ0ICsgc2xpZGVzUGVyVmlldyA+IGNvbHMgLSBsb29wZWRTbGlkZXMpIHtcbiAgICBzbGlkZXNBcHBlbmRlZCA9IE1hdGgubWF4KGFjdGl2ZUNvbEluZGV4V2l0aFNoaWZ0IC0gKGNvbHMgLSBsb29wZWRTbGlkZXMgKiAyKSwgc2xpZGVzUGVyR3JvdXApO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2xpZGVzQXBwZW5kZWQ7IGkgKz0gMSkge1xuICAgICAgY29uc3QgaW5kZXggPSBpIC0gTWF0aC5mbG9vcihpIC8gY29scykgKiBjb2xzO1xuICAgICAgaWYgKGdyaWRFbmFibGVkKSB7XG4gICAgICAgIHNsaWRlcy5mb3JFYWNoKChzbGlkZSwgc2xpZGVJbmRleCkgPT4ge1xuICAgICAgICAgIGlmIChzbGlkZS5jb2x1bW4gPT09IGluZGV4KSBhcHBlbmRTbGlkZXNJbmRleGVzLnB1c2goc2xpZGVJbmRleCk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXBwZW5kU2xpZGVzSW5kZXhlcy5wdXNoKGluZGV4KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgc3dpcGVyLl9fcHJldmVudE9ic2VydmVyX18gPSB0cnVlO1xuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgIHN3aXBlci5fX3ByZXZlbnRPYnNlcnZlcl9fID0gZmFsc2U7XG4gIH0pO1xuICBpZiAoaXNQcmV2KSB7XG4gICAgcHJlcGVuZFNsaWRlc0luZGV4ZXMuZm9yRWFjaChpbmRleCA9PiB7XG4gICAgICBzbGlkZXNbaW5kZXhdLnN3aXBlckxvb3BNb3ZlRE9NID0gdHJ1ZTtcbiAgICAgIHNsaWRlc0VsLnByZXBlbmQoc2xpZGVzW2luZGV4XSk7XG4gICAgICBzbGlkZXNbaW5kZXhdLnN3aXBlckxvb3BNb3ZlRE9NID0gZmFsc2U7XG4gICAgfSk7XG4gIH1cbiAgaWYgKGlzTmV4dCkge1xuICAgIGFwcGVuZFNsaWRlc0luZGV4ZXMuZm9yRWFjaChpbmRleCA9PiB7XG4gICAgICBzbGlkZXNbaW5kZXhdLnN3aXBlckxvb3BNb3ZlRE9NID0gdHJ1ZTtcbiAgICAgIHNsaWRlc0VsLmFwcGVuZChzbGlkZXNbaW5kZXhdKTtcbiAgICAgIHNsaWRlc1tpbmRleF0uc3dpcGVyTG9vcE1vdmVET00gPSBmYWxzZTtcbiAgICB9KTtcbiAgfVxuICBzd2lwZXIucmVjYWxjU2xpZGVzKCk7XG4gIGlmIChwYXJhbXMuc2xpZGVzUGVyVmlldyA9PT0gJ2F1dG8nKSB7XG4gICAgc3dpcGVyLnVwZGF0ZVNsaWRlcygpO1xuICB9IGVsc2UgaWYgKGdyaWRFbmFibGVkICYmIChwcmVwZW5kU2xpZGVzSW5kZXhlcy5sZW5ndGggPiAwICYmIGlzUHJldiB8fCBhcHBlbmRTbGlkZXNJbmRleGVzLmxlbmd0aCA+IDAgJiYgaXNOZXh0KSkge1xuICAgIHN3aXBlci5zbGlkZXMuZm9yRWFjaCgoc2xpZGUsIHNsaWRlSW5kZXgpID0+IHtcbiAgICAgIHN3aXBlci5ncmlkLnVwZGF0ZVNsaWRlKHNsaWRlSW5kZXgsIHNsaWRlLCBzd2lwZXIuc2xpZGVzKTtcbiAgICB9KTtcbiAgfVxuICBpZiAocGFyYW1zLndhdGNoU2xpZGVzUHJvZ3Jlc3MpIHtcbiAgICBzd2lwZXIudXBkYXRlU2xpZGVzT2Zmc2V0KCk7XG4gIH1cbiAgaWYgKHNsaWRlVG8pIHtcbiAgICBpZiAocHJlcGVuZFNsaWRlc0luZGV4ZXMubGVuZ3RoID4gMCAmJiBpc1ByZXYpIHtcbiAgICAgIGlmICh0eXBlb2Ygc2xpZGVSZWFsSW5kZXggPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRTbGlkZVRyYW5zbGF0ZSA9IHN3aXBlci5zbGlkZXNHcmlkW2FjdGl2ZUluZGV4XTtcbiAgICAgICAgY29uc3QgbmV3U2xpZGVUcmFuc2xhdGUgPSBzd2lwZXIuc2xpZGVzR3JpZFthY3RpdmVJbmRleCArIHNsaWRlc1ByZXBlbmRlZF07XG4gICAgICAgIGNvbnN0IGRpZmYgPSBuZXdTbGlkZVRyYW5zbGF0ZSAtIGN1cnJlbnRTbGlkZVRyYW5zbGF0ZTtcbiAgICAgICAgaWYgKGJ5TW91c2V3aGVlbCkge1xuICAgICAgICAgIHN3aXBlci5zZXRUcmFuc2xhdGUoc3dpcGVyLnRyYW5zbGF0ZSAtIGRpZmYpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN3aXBlci5zbGlkZVRvKGFjdGl2ZUluZGV4ICsgc2xpZGVzUHJlcGVuZGVkLCAwLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgICAgaWYgKHNldFRyYW5zbGF0ZSkge1xuICAgICAgICAgICAgc3dpcGVyLnRvdWNoRXZlbnRzRGF0YS5zdGFydFRyYW5zbGF0ZSA9IHN3aXBlci50b3VjaEV2ZW50c0RhdGEuc3RhcnRUcmFuc2xhdGUgLSBkaWZmO1xuICAgICAgICAgICAgc3dpcGVyLnRvdWNoRXZlbnRzRGF0YS5jdXJyZW50VHJhbnNsYXRlID0gc3dpcGVyLnRvdWNoRXZlbnRzRGF0YS5jdXJyZW50VHJhbnNsYXRlIC0gZGlmZjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChzZXRUcmFuc2xhdGUpIHtcbiAgICAgICAgICBjb25zdCBzaGlmdCA9IGdyaWRFbmFibGVkID8gcHJlcGVuZFNsaWRlc0luZGV4ZXMubGVuZ3RoIC8gcGFyYW1zLmdyaWQucm93cyA6IHByZXBlbmRTbGlkZXNJbmRleGVzLmxlbmd0aDtcbiAgICAgICAgICBzd2lwZXIuc2xpZGVUbyhzd2lwZXIuYWN0aXZlSW5kZXggKyBzaGlmdCwgMCwgZmFsc2UsIHRydWUpO1xuICAgICAgICAgIHN3aXBlci50b3VjaEV2ZW50c0RhdGEuY3VycmVudFRyYW5zbGF0ZSA9IHN3aXBlci50cmFuc2xhdGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGFwcGVuZFNsaWRlc0luZGV4ZXMubGVuZ3RoID4gMCAmJiBpc05leHQpIHtcbiAgICAgIGlmICh0eXBlb2Ygc2xpZGVSZWFsSW5kZXggPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRTbGlkZVRyYW5zbGF0ZSA9IHN3aXBlci5zbGlkZXNHcmlkW2FjdGl2ZUluZGV4XTtcbiAgICAgICAgY29uc3QgbmV3U2xpZGVUcmFuc2xhdGUgPSBzd2lwZXIuc2xpZGVzR3JpZFthY3RpdmVJbmRleCAtIHNsaWRlc0FwcGVuZGVkXTtcbiAgICAgICAgY29uc3QgZGlmZiA9IG5ld1NsaWRlVHJhbnNsYXRlIC0gY3VycmVudFNsaWRlVHJhbnNsYXRlO1xuICAgICAgICBpZiAoYnlNb3VzZXdoZWVsKSB7XG4gICAgICAgICAgc3dpcGVyLnNldFRyYW5zbGF0ZShzd2lwZXIudHJhbnNsYXRlIC0gZGlmZik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3dpcGVyLnNsaWRlVG8oYWN0aXZlSW5kZXggLSBzbGlkZXNBcHBlbmRlZCwgMCwgZmFsc2UsIHRydWUpO1xuICAgICAgICAgIGlmIChzZXRUcmFuc2xhdGUpIHtcbiAgICAgICAgICAgIHN3aXBlci50b3VjaEV2ZW50c0RhdGEuc3RhcnRUcmFuc2xhdGUgPSBzd2lwZXIudG91Y2hFdmVudHNEYXRhLnN0YXJ0VHJhbnNsYXRlIC0gZGlmZjtcbiAgICAgICAgICAgIHN3aXBlci50b3VjaEV2ZW50c0RhdGEuY3VycmVudFRyYW5zbGF0ZSA9IHN3aXBlci50b3VjaEV2ZW50c0RhdGEuY3VycmVudFRyYW5zbGF0ZSAtIGRpZmY7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBzaGlmdCA9IGdyaWRFbmFibGVkID8gYXBwZW5kU2xpZGVzSW5kZXhlcy5sZW5ndGggLyBwYXJhbXMuZ3JpZC5yb3dzIDogYXBwZW5kU2xpZGVzSW5kZXhlcy5sZW5ndGg7XG4gICAgICAgIHN3aXBlci5zbGlkZVRvKHN3aXBlci5hY3RpdmVJbmRleCAtIHNoaWZ0LCAwLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHN3aXBlci5hbGxvd1NsaWRlUHJldiA9IGFsbG93U2xpZGVQcmV2O1xuICBzd2lwZXIuYWxsb3dTbGlkZU5leHQgPSBhbGxvd1NsaWRlTmV4dDtcbiAgaWYgKHN3aXBlci5jb250cm9sbGVyICYmIHN3aXBlci5jb250cm9sbGVyLmNvbnRyb2wgJiYgIWJ5Q29udHJvbGxlcikge1xuICAgIGNvbnN0IGxvb3BQYXJhbXMgPSB7XG4gICAgICBzbGlkZVJlYWxJbmRleCxcbiAgICAgIGRpcmVjdGlvbixcbiAgICAgIHNldFRyYW5zbGF0ZSxcbiAgICAgIGFjdGl2ZVNsaWRlSW5kZXgsXG4gICAgICBieUNvbnRyb2xsZXI6IHRydWVcbiAgICB9O1xuICAgIGlmIChBcnJheS5pc0FycmF5KHN3aXBlci5jb250cm9sbGVyLmNvbnRyb2wpKSB7XG4gICAgICBzd2lwZXIuY29udHJvbGxlci5jb250cm9sLmZvckVhY2goYyA9PiB7XG4gICAgICAgIGlmICghYy5kZXN0cm95ZWQgJiYgYy5wYXJhbXMubG9vcCkgYy5sb29wRml4KHtcbiAgICAgICAgICAuLi5sb29wUGFyYW1zLFxuICAgICAgICAgIHNsaWRlVG86IGMucGFyYW1zLnNsaWRlc1BlclZpZXcgPT09IHBhcmFtcy5zbGlkZXNQZXJWaWV3ID8gc2xpZGVUbyA6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChzd2lwZXIuY29udHJvbGxlci5jb250cm9sIGluc3RhbmNlb2Ygc3dpcGVyLmNvbnN0cnVjdG9yICYmIHN3aXBlci5jb250cm9sbGVyLmNvbnRyb2wucGFyYW1zLmxvb3ApIHtcbiAgICAgIHN3aXBlci5jb250cm9sbGVyLmNvbnRyb2wubG9vcEZpeCh7XG4gICAgICAgIC4uLmxvb3BQYXJhbXMsXG4gICAgICAgIHNsaWRlVG86IHN3aXBlci5jb250cm9sbGVyLmNvbnRyb2wucGFyYW1zLnNsaWRlc1BlclZpZXcgPT09IHBhcmFtcy5zbGlkZXNQZXJWaWV3ID8gc2xpZGVUbyA6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgc3dpcGVyLmVtaXQoJ2xvb3BGaXgnKTtcbn1cblxuZnVuY3Rpb24gbG9vcERlc3Ryb3koKSB7XG4gIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gIGNvbnN0IHtcbiAgICBwYXJhbXMsXG4gICAgc2xpZGVzRWxcbiAgfSA9IHN3aXBlcjtcbiAgaWYgKCFwYXJhbXMubG9vcCB8fCBzd2lwZXIudmlydHVhbCAmJiBzd2lwZXIucGFyYW1zLnZpcnR1YWwuZW5hYmxlZCkgcmV0dXJuO1xuICBzd2lwZXIucmVjYWxjU2xpZGVzKCk7XG4gIGNvbnN0IG5ld1NsaWRlc09yZGVyID0gW107XG4gIHN3aXBlci5zbGlkZXMuZm9yRWFjaChzbGlkZUVsID0+IHtcbiAgICBjb25zdCBpbmRleCA9IHR5cGVvZiBzbGlkZUVsLnN3aXBlclNsaWRlSW5kZXggPT09ICd1bmRlZmluZWQnID8gc2xpZGVFbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3dpcGVyLXNsaWRlLWluZGV4JykgKiAxIDogc2xpZGVFbC5zd2lwZXJTbGlkZUluZGV4O1xuICAgIG5ld1NsaWRlc09yZGVyW2luZGV4XSA9IHNsaWRlRWw7XG4gIH0pO1xuICBzd2lwZXIuc2xpZGVzLmZvckVhY2goc2xpZGVFbCA9PiB7XG4gICAgc2xpZGVFbC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtc3dpcGVyLXNsaWRlLWluZGV4Jyk7XG4gIH0pO1xuICBuZXdTbGlkZXNPcmRlci5mb3JFYWNoKHNsaWRlRWwgPT4ge1xuICAgIHNsaWRlc0VsLmFwcGVuZChzbGlkZUVsKTtcbiAgfSk7XG4gIHN3aXBlci5yZWNhbGNTbGlkZXMoKTtcbiAgc3dpcGVyLnNsaWRlVG8oc3dpcGVyLnJlYWxJbmRleCwgMCk7XG59XG5cbnZhciBsb29wID0ge1xuICBsb29wQ3JlYXRlLFxuICBsb29wRml4LFxuICBsb29wRGVzdHJveVxufTtcblxuZnVuY3Rpb24gc2V0R3JhYkN1cnNvcihtb3ZpbmcpIHtcbiAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgaWYgKCFzd2lwZXIucGFyYW1zLnNpbXVsYXRlVG91Y2ggfHwgc3dpcGVyLnBhcmFtcy53YXRjaE92ZXJmbG93ICYmIHN3aXBlci5pc0xvY2tlZCB8fCBzd2lwZXIucGFyYW1zLmNzc01vZGUpIHJldHVybjtcbiAgY29uc3QgZWwgPSBzd2lwZXIucGFyYW1zLnRvdWNoRXZlbnRzVGFyZ2V0ID09PSAnY29udGFpbmVyJyA/IHN3aXBlci5lbCA6IHN3aXBlci53cmFwcGVyRWw7XG4gIGlmIChzd2lwZXIuaXNFbGVtZW50KSB7XG4gICAgc3dpcGVyLl9fcHJldmVudE9ic2VydmVyX18gPSB0cnVlO1xuICB9XG4gIGVsLnN0eWxlLmN1cnNvciA9ICdtb3ZlJztcbiAgZWwuc3R5bGUuY3Vyc29yID0gbW92aW5nID8gJ2dyYWJiaW5nJyA6ICdncmFiJztcbiAgaWYgKHN3aXBlci5pc0VsZW1lbnQpIHtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgc3dpcGVyLl9fcHJldmVudE9ic2VydmVyX18gPSBmYWxzZTtcbiAgICB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiB1bnNldEdyYWJDdXJzb3IoKSB7XG4gIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gIGlmIChzd2lwZXIucGFyYW1zLndhdGNoT3ZlcmZsb3cgJiYgc3dpcGVyLmlzTG9ja2VkIHx8IHN3aXBlci5wYXJhbXMuY3NzTW9kZSkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoc3dpcGVyLmlzRWxlbWVudCkge1xuICAgIHN3aXBlci5fX3ByZXZlbnRPYnNlcnZlcl9fID0gdHJ1ZTtcbiAgfVxuICBzd2lwZXJbc3dpcGVyLnBhcmFtcy50b3VjaEV2ZW50c1RhcmdldCA9PT0gJ2NvbnRhaW5lcicgPyAnZWwnIDogJ3dyYXBwZXJFbCddLnN0eWxlLmN1cnNvciA9ICcnO1xuICBpZiAoc3dpcGVyLmlzRWxlbWVudCkge1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICBzd2lwZXIuX19wcmV2ZW50T2JzZXJ2ZXJfXyA9IGZhbHNlO1xuICAgIH0pO1xuICB9XG59XG5cbnZhciBncmFiQ3Vyc29yID0ge1xuICBzZXRHcmFiQ3Vyc29yLFxuICB1bnNldEdyYWJDdXJzb3Jcbn07XG5cbi8vIE1vZGlmaWVkIGZyb20gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTQ1MjA1NTQvY3VzdG9tLWVsZW1lbnQtZ2V0cm9vdG5vZGUtY2xvc2VzdC1mdW5jdGlvbi1jcm9zc2luZy1tdWx0aXBsZS1wYXJlbnQtc2hhZG93ZFxuZnVuY3Rpb24gY2xvc2VzdEVsZW1lbnQoc2VsZWN0b3IsIGJhc2UpIHtcbiAgaWYgKGJhc2UgPT09IHZvaWQgMCkge1xuICAgIGJhc2UgPSB0aGlzO1xuICB9XG4gIGZ1bmN0aW9uIF9fY2xvc2VzdEZyb20oZWwpIHtcbiAgICBpZiAoIWVsIHx8IGVsID09PSBnZXREb2N1bWVudCgpIHx8IGVsID09PSBnZXRXaW5kb3coKSkgcmV0dXJuIG51bGw7XG4gICAgaWYgKGVsLmFzc2lnbmVkU2xvdCkgZWwgPSBlbC5hc3NpZ25lZFNsb3Q7XG4gICAgY29uc3QgZm91bmQgPSBlbC5jbG9zZXN0KHNlbGVjdG9yKTtcbiAgICBpZiAoIWZvdW5kICYmICFlbC5nZXRSb290Tm9kZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBmb3VuZCB8fCBfX2Nsb3Nlc3RGcm9tKGVsLmdldFJvb3ROb2RlKCkuaG9zdCk7XG4gIH1cbiAgcmV0dXJuIF9fY2xvc2VzdEZyb20oYmFzZSk7XG59XG5mdW5jdGlvbiBwcmV2ZW50RWRnZVN3aXBlKHN3aXBlciwgZXZlbnQsIHN0YXJ0WCkge1xuICBjb25zdCB3aW5kb3cgPSBnZXRXaW5kb3coKTtcbiAgY29uc3Qge1xuICAgIHBhcmFtc1xuICB9ID0gc3dpcGVyO1xuICBjb25zdCBlZGdlU3dpcGVEZXRlY3Rpb24gPSBwYXJhbXMuZWRnZVN3aXBlRGV0ZWN0aW9uO1xuICBjb25zdCBlZGdlU3dpcGVUaHJlc2hvbGQgPSBwYXJhbXMuZWRnZVN3aXBlVGhyZXNob2xkO1xuICBpZiAoZWRnZVN3aXBlRGV0ZWN0aW9uICYmIChzdGFydFggPD0gZWRnZVN3aXBlVGhyZXNob2xkIHx8IHN0YXJ0WCA+PSB3aW5kb3cuaW5uZXJXaWR0aCAtIGVkZ2VTd2lwZVRocmVzaG9sZCkpIHtcbiAgICBpZiAoZWRnZVN3aXBlRGV0ZWN0aW9uID09PSAncHJldmVudCcpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuZnVuY3Rpb24gb25Ub3VjaFN0YXJ0KGV2ZW50KSB7XG4gIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gIGNvbnN0IGRvY3VtZW50ID0gZ2V0RG9jdW1lbnQoKTtcbiAgbGV0IGUgPSBldmVudDtcbiAgaWYgKGUub3JpZ2luYWxFdmVudCkgZSA9IGUub3JpZ2luYWxFdmVudDtcbiAgY29uc3QgZGF0YSA9IHN3aXBlci50b3VjaEV2ZW50c0RhdGE7XG4gIGlmIChlLnR5cGUgPT09ICdwb2ludGVyZG93bicpIHtcbiAgICBpZiAoZGF0YS5wb2ludGVySWQgIT09IG51bGwgJiYgZGF0YS5wb2ludGVySWQgIT09IGUucG9pbnRlcklkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGRhdGEucG9pbnRlcklkID0gZS5wb2ludGVySWQ7XG4gIH0gZWxzZSBpZiAoZS50eXBlID09PSAndG91Y2hzdGFydCcgJiYgZS50YXJnZXRUb3VjaGVzLmxlbmd0aCA9PT0gMSkge1xuICAgIGRhdGEudG91Y2hJZCA9IGUudGFyZ2V0VG91Y2hlc1swXS5pZGVudGlmaWVyO1xuICB9XG4gIGlmIChlLnR5cGUgPT09ICd0b3VjaHN0YXJ0Jykge1xuICAgIC8vIGRvbid0IHByb2NlZWQgdG91Y2ggZXZlbnRcbiAgICBwcmV2ZW50RWRnZVN3aXBlKHN3aXBlciwgZSwgZS50YXJnZXRUb3VjaGVzWzBdLnBhZ2VYKTtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3Qge1xuICAgIHBhcmFtcyxcbiAgICB0b3VjaGVzLFxuICAgIGVuYWJsZWRcbiAgfSA9IHN3aXBlcjtcbiAgaWYgKCFlbmFibGVkKSByZXR1cm47XG4gIGlmICghcGFyYW1zLnNpbXVsYXRlVG91Y2ggJiYgZS5wb2ludGVyVHlwZSA9PT0gJ21vdXNlJykgcmV0dXJuO1xuICBpZiAoc3dpcGVyLmFuaW1hdGluZyAmJiBwYXJhbXMucHJldmVudEludGVyYWN0aW9uT25UcmFuc2l0aW9uKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmICghc3dpcGVyLmFuaW1hdGluZyAmJiBwYXJhbXMuY3NzTW9kZSAmJiBwYXJhbXMubG9vcCkge1xuICAgIHN3aXBlci5sb29wRml4KCk7XG4gIH1cbiAgbGV0IHRhcmdldEVsID0gZS50YXJnZXQ7XG4gIGlmIChwYXJhbXMudG91Y2hFdmVudHNUYXJnZXQgPT09ICd3cmFwcGVyJykge1xuICAgIGlmICghc3dpcGVyLndyYXBwZXJFbC5jb250YWlucyh0YXJnZXRFbCkpIHJldHVybjtcbiAgfVxuICBpZiAoJ3doaWNoJyBpbiBlICYmIGUud2hpY2ggPT09IDMpIHJldHVybjtcbiAgaWYgKCdidXR0b24nIGluIGUgJiYgZS5idXR0b24gPiAwKSByZXR1cm47XG4gIGlmIChkYXRhLmlzVG91Y2hlZCAmJiBkYXRhLmlzTW92ZWQpIHJldHVybjtcblxuICAvLyBjaGFuZ2UgdGFyZ2V0IGVsIGZvciBzaGFkb3cgcm9vdCBjb21wb25lbnRcbiAgY29uc3Qgc3dpcGluZ0NsYXNzSGFzVmFsdWUgPSAhIXBhcmFtcy5ub1N3aXBpbmdDbGFzcyAmJiBwYXJhbXMubm9Td2lwaW5nQ2xhc3MgIT09ICcnO1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgY29uc3QgZXZlbnRQYXRoID0gZS5jb21wb3NlZFBhdGggPyBlLmNvbXBvc2VkUGF0aCgpIDogZS5wYXRoO1xuICBpZiAoc3dpcGluZ0NsYXNzSGFzVmFsdWUgJiYgZS50YXJnZXQgJiYgZS50YXJnZXQuc2hhZG93Um9vdCAmJiBldmVudFBhdGgpIHtcbiAgICB0YXJnZXRFbCA9IGV2ZW50UGF0aFswXTtcbiAgfVxuICBjb25zdCBub1N3aXBpbmdTZWxlY3RvciA9IHBhcmFtcy5ub1N3aXBpbmdTZWxlY3RvciA/IHBhcmFtcy5ub1N3aXBpbmdTZWxlY3RvciA6IGAuJHtwYXJhbXMubm9Td2lwaW5nQ2xhc3N9YDtcbiAgY29uc3QgaXNUYXJnZXRTaGFkb3cgPSAhIShlLnRhcmdldCAmJiBlLnRhcmdldC5zaGFkb3dSb290KTtcblxuICAvLyB1c2UgY2xvc2VzdEVsZW1lbnQgZm9yIHNoYWRvdyByb290IGVsZW1lbnQgdG8gZ2V0IHRoZSBhY3R1YWwgY2xvc2VzdCBmb3IgbmVzdGVkIHNoYWRvdyByb290IGVsZW1lbnRcbiAgaWYgKHBhcmFtcy5ub1N3aXBpbmcgJiYgKGlzVGFyZ2V0U2hhZG93ID8gY2xvc2VzdEVsZW1lbnQobm9Td2lwaW5nU2VsZWN0b3IsIHRhcmdldEVsKSA6IHRhcmdldEVsLmNsb3Nlc3Qobm9Td2lwaW5nU2VsZWN0b3IpKSkge1xuICAgIHN3aXBlci5hbGxvd0NsaWNrID0gdHJ1ZTtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKHBhcmFtcy5zd2lwZUhhbmRsZXIpIHtcbiAgICBpZiAoIXRhcmdldEVsLmNsb3Nlc3QocGFyYW1zLnN3aXBlSGFuZGxlcikpIHJldHVybjtcbiAgfVxuICB0b3VjaGVzLmN1cnJlbnRYID0gZS5wYWdlWDtcbiAgdG91Y2hlcy5jdXJyZW50WSA9IGUucGFnZVk7XG4gIGNvbnN0IHN0YXJ0WCA9IHRvdWNoZXMuY3VycmVudFg7XG4gIGNvbnN0IHN0YXJ0WSA9IHRvdWNoZXMuY3VycmVudFk7XG5cbiAgLy8gRG8gTk9UIHN0YXJ0IGlmIGlPUyBlZGdlIHN3aXBlIGlzIGRldGVjdGVkLiBPdGhlcndpc2UgaU9TIGFwcCBjYW5ub3Qgc3dpcGUtdG8tZ28tYmFjayBhbnltb3JlXG5cbiAgaWYgKCFwcmV2ZW50RWRnZVN3aXBlKHN3aXBlciwgZSwgc3RhcnRYKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBPYmplY3QuYXNzaWduKGRhdGEsIHtcbiAgICBpc1RvdWNoZWQ6IHRydWUsXG4gICAgaXNNb3ZlZDogZmFsc2UsXG4gICAgYWxsb3dUb3VjaENhbGxiYWNrczogdHJ1ZSxcbiAgICBpc1Njcm9sbGluZzogdW5kZWZpbmVkLFxuICAgIHN0YXJ0TW92aW5nOiB1bmRlZmluZWRcbiAgfSk7XG4gIHRvdWNoZXMuc3RhcnRYID0gc3RhcnRYO1xuICB0b3VjaGVzLnN0YXJ0WSA9IHN0YXJ0WTtcbiAgZGF0YS50b3VjaFN0YXJ0VGltZSA9IG5vdygpO1xuICBzd2lwZXIuYWxsb3dDbGljayA9IHRydWU7XG4gIHN3aXBlci51cGRhdGVTaXplKCk7XG4gIHN3aXBlci5zd2lwZURpcmVjdGlvbiA9IHVuZGVmaW5lZDtcbiAgaWYgKHBhcmFtcy50aHJlc2hvbGQgPiAwKSBkYXRhLmFsbG93VGhyZXNob2xkTW92ZSA9IGZhbHNlO1xuICBsZXQgcHJldmVudERlZmF1bHQgPSB0cnVlO1xuICBpZiAodGFyZ2V0RWwubWF0Y2hlcyhkYXRhLmZvY3VzYWJsZUVsZW1lbnRzKSkge1xuICAgIHByZXZlbnREZWZhdWx0ID0gZmFsc2U7XG4gICAgaWYgKHRhcmdldEVsLm5vZGVOYW1lID09PSAnU0VMRUNUJykge1xuICAgICAgZGF0YS5pc1RvdWNoZWQgPSBmYWxzZTtcbiAgICB9XG4gIH1cbiAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5tYXRjaGVzKGRhdGEuZm9jdXNhYmxlRWxlbWVudHMpICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgIT09IHRhcmdldEVsKSB7XG4gICAgZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5ibHVyKCk7XG4gIH1cbiAgY29uc3Qgc2hvdWxkUHJldmVudERlZmF1bHQgPSBwcmV2ZW50RGVmYXVsdCAmJiBzd2lwZXIuYWxsb3dUb3VjaE1vdmUgJiYgcGFyYW1zLnRvdWNoU3RhcnRQcmV2ZW50RGVmYXVsdDtcbiAgaWYgKChwYXJhbXMudG91Y2hTdGFydEZvcmNlUHJldmVudERlZmF1bHQgfHwgc2hvdWxkUHJldmVudERlZmF1bHQpICYmICF0YXJnZXRFbC5pc0NvbnRlbnRFZGl0YWJsZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgfVxuICBpZiAocGFyYW1zLmZyZWVNb2RlICYmIHBhcmFtcy5mcmVlTW9kZS5lbmFibGVkICYmIHN3aXBlci5mcmVlTW9kZSAmJiBzd2lwZXIuYW5pbWF0aW5nICYmICFwYXJhbXMuY3NzTW9kZSkge1xuICAgIHN3aXBlci5mcmVlTW9kZS5vblRvdWNoU3RhcnQoKTtcbiAgfVxuICBzd2lwZXIuZW1pdCgndG91Y2hTdGFydCcsIGUpO1xufVxuXG5mdW5jdGlvbiBvblRvdWNoTW92ZShldmVudCkge1xuICBjb25zdCBkb2N1bWVudCA9IGdldERvY3VtZW50KCk7XG4gIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gIGNvbnN0IGRhdGEgPSBzd2lwZXIudG91Y2hFdmVudHNEYXRhO1xuICBjb25zdCB7XG4gICAgcGFyYW1zLFxuICAgIHRvdWNoZXMsXG4gICAgcnRsVHJhbnNsYXRlOiBydGwsXG4gICAgZW5hYmxlZFxuICB9ID0gc3dpcGVyO1xuICBpZiAoIWVuYWJsZWQpIHJldHVybjtcbiAgaWYgKCFwYXJhbXMuc2ltdWxhdGVUb3VjaCAmJiBldmVudC5wb2ludGVyVHlwZSA9PT0gJ21vdXNlJykgcmV0dXJuO1xuICBsZXQgZSA9IGV2ZW50O1xuICBpZiAoZS5vcmlnaW5hbEV2ZW50KSBlID0gZS5vcmlnaW5hbEV2ZW50O1xuICBpZiAoZS50eXBlID09PSAncG9pbnRlcm1vdmUnKSB7XG4gICAgaWYgKGRhdGEudG91Y2hJZCAhPT0gbnVsbCkgcmV0dXJuOyAvLyByZXR1cm4gZnJvbSBwb2ludGVyIGlmIHdlIHVzZSB0b3VjaFxuICAgIGNvbnN0IGlkID0gZS5wb2ludGVySWQ7XG4gICAgaWYgKGlkICE9PSBkYXRhLnBvaW50ZXJJZCkgcmV0dXJuO1xuICB9XG4gIGxldCB0YXJnZXRUb3VjaDtcbiAgaWYgKGUudHlwZSA9PT0gJ3RvdWNobW92ZScpIHtcbiAgICB0YXJnZXRUb3VjaCA9IFsuLi5lLmNoYW5nZWRUb3VjaGVzXS5maWx0ZXIodCA9PiB0LmlkZW50aWZpZXIgPT09IGRhdGEudG91Y2hJZClbMF07XG4gICAgaWYgKCF0YXJnZXRUb3VjaCB8fCB0YXJnZXRUb3VjaC5pZGVudGlmaWVyICE9PSBkYXRhLnRvdWNoSWQpIHJldHVybjtcbiAgfSBlbHNlIHtcbiAgICB0YXJnZXRUb3VjaCA9IGU7XG4gIH1cbiAgaWYgKCFkYXRhLmlzVG91Y2hlZCkge1xuICAgIGlmIChkYXRhLnN0YXJ0TW92aW5nICYmIGRhdGEuaXNTY3JvbGxpbmcpIHtcbiAgICAgIHN3aXBlci5lbWl0KCd0b3VjaE1vdmVPcHBvc2l0ZScsIGUpO1xuICAgIH1cbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgcGFnZVggPSB0YXJnZXRUb3VjaC5wYWdlWDtcbiAgY29uc3QgcGFnZVkgPSB0YXJnZXRUb3VjaC5wYWdlWTtcbiAgaWYgKGUucHJldmVudGVkQnlOZXN0ZWRTd2lwZXIpIHtcbiAgICB0b3VjaGVzLnN0YXJ0WCA9IHBhZ2VYO1xuICAgIHRvdWNoZXMuc3RhcnRZID0gcGFnZVk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmICghc3dpcGVyLmFsbG93VG91Y2hNb3ZlKSB7XG4gICAgaWYgKCFlLnRhcmdldC5tYXRjaGVzKGRhdGEuZm9jdXNhYmxlRWxlbWVudHMpKSB7XG4gICAgICBzd2lwZXIuYWxsb3dDbGljayA9IGZhbHNlO1xuICAgIH1cbiAgICBpZiAoZGF0YS5pc1RvdWNoZWQpIHtcbiAgICAgIE9iamVjdC5hc3NpZ24odG91Y2hlcywge1xuICAgICAgICBzdGFydFg6IHBhZ2VYLFxuICAgICAgICBzdGFydFk6IHBhZ2VZLFxuICAgICAgICBjdXJyZW50WDogcGFnZVgsXG4gICAgICAgIGN1cnJlbnRZOiBwYWdlWVxuICAgICAgfSk7XG4gICAgICBkYXRhLnRvdWNoU3RhcnRUaW1lID0gbm93KCk7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuICBpZiAocGFyYW1zLnRvdWNoUmVsZWFzZU9uRWRnZXMgJiYgIXBhcmFtcy5sb29wKSB7XG4gICAgaWYgKHN3aXBlci5pc1ZlcnRpY2FsKCkpIHtcbiAgICAgIC8vIFZlcnRpY2FsXG4gICAgICBpZiAocGFnZVkgPCB0b3VjaGVzLnN0YXJ0WSAmJiBzd2lwZXIudHJhbnNsYXRlIDw9IHN3aXBlci5tYXhUcmFuc2xhdGUoKSB8fCBwYWdlWSA+IHRvdWNoZXMuc3RhcnRZICYmIHN3aXBlci50cmFuc2xhdGUgPj0gc3dpcGVyLm1pblRyYW5zbGF0ZSgpKSB7XG4gICAgICAgIGRhdGEuaXNUb3VjaGVkID0gZmFsc2U7XG4gICAgICAgIGRhdGEuaXNNb3ZlZCA9IGZhbHNlO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChwYWdlWCA8IHRvdWNoZXMuc3RhcnRYICYmIHN3aXBlci50cmFuc2xhdGUgPD0gc3dpcGVyLm1heFRyYW5zbGF0ZSgpIHx8IHBhZ2VYID4gdG91Y2hlcy5zdGFydFggJiYgc3dpcGVyLnRyYW5zbGF0ZSA+PSBzd2lwZXIubWluVHJhbnNsYXRlKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cbiAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpIHtcbiAgICBpZiAoZS50YXJnZXQgPT09IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgJiYgZS50YXJnZXQubWF0Y2hlcyhkYXRhLmZvY3VzYWJsZUVsZW1lbnRzKSkge1xuICAgICAgZGF0YS5pc01vdmVkID0gdHJ1ZTtcbiAgICAgIHN3aXBlci5hbGxvd0NsaWNrID0gZmFsc2U7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG4gIGlmIChkYXRhLmFsbG93VG91Y2hDYWxsYmFja3MpIHtcbiAgICBzd2lwZXIuZW1pdCgndG91Y2hNb3ZlJywgZSk7XG4gIH1cbiAgdG91Y2hlcy5wcmV2aW91c1ggPSB0b3VjaGVzLmN1cnJlbnRYO1xuICB0b3VjaGVzLnByZXZpb3VzWSA9IHRvdWNoZXMuY3VycmVudFk7XG4gIHRvdWNoZXMuY3VycmVudFggPSBwYWdlWDtcbiAgdG91Y2hlcy5jdXJyZW50WSA9IHBhZ2VZO1xuICBjb25zdCBkaWZmWCA9IHRvdWNoZXMuY3VycmVudFggLSB0b3VjaGVzLnN0YXJ0WDtcbiAgY29uc3QgZGlmZlkgPSB0b3VjaGVzLmN1cnJlbnRZIC0gdG91Y2hlcy5zdGFydFk7XG4gIGlmIChzd2lwZXIucGFyYW1zLnRocmVzaG9sZCAmJiBNYXRoLnNxcnQoZGlmZlggKiogMiArIGRpZmZZICoqIDIpIDwgc3dpcGVyLnBhcmFtcy50aHJlc2hvbGQpIHJldHVybjtcbiAgaWYgKHR5cGVvZiBkYXRhLmlzU2Nyb2xsaW5nID09PSAndW5kZWZpbmVkJykge1xuICAgIGxldCB0b3VjaEFuZ2xlO1xuICAgIGlmIChzd2lwZXIuaXNIb3Jpem9udGFsKCkgJiYgdG91Y2hlcy5jdXJyZW50WSA9PT0gdG91Y2hlcy5zdGFydFkgfHwgc3dpcGVyLmlzVmVydGljYWwoKSAmJiB0b3VjaGVzLmN1cnJlbnRYID09PSB0b3VjaGVzLnN0YXJ0WCkge1xuICAgICAgZGF0YS5pc1Njcm9sbGluZyA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICAgIGlmIChkaWZmWCAqIGRpZmZYICsgZGlmZlkgKiBkaWZmWSA+PSAyNSkge1xuICAgICAgICB0b3VjaEFuZ2xlID0gTWF0aC5hdGFuMihNYXRoLmFicyhkaWZmWSksIE1hdGguYWJzKGRpZmZYKSkgKiAxODAgLyBNYXRoLlBJO1xuICAgICAgICBkYXRhLmlzU2Nyb2xsaW5nID0gc3dpcGVyLmlzSG9yaXpvbnRhbCgpID8gdG91Y2hBbmdsZSA+IHBhcmFtcy50b3VjaEFuZ2xlIDogOTAgLSB0b3VjaEFuZ2xlID4gcGFyYW1zLnRvdWNoQW5nbGU7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmIChkYXRhLmlzU2Nyb2xsaW5nKSB7XG4gICAgc3dpcGVyLmVtaXQoJ3RvdWNoTW92ZU9wcG9zaXRlJywgZSk7XG4gIH1cbiAgaWYgKHR5cGVvZiBkYXRhLnN0YXJ0TW92aW5nID09PSAndW5kZWZpbmVkJykge1xuICAgIGlmICh0b3VjaGVzLmN1cnJlbnRYICE9PSB0b3VjaGVzLnN0YXJ0WCB8fCB0b3VjaGVzLmN1cnJlbnRZICE9PSB0b3VjaGVzLnN0YXJ0WSkge1xuICAgICAgZGF0YS5zdGFydE1vdmluZyA9IHRydWU7XG4gICAgfVxuICB9XG4gIGlmIChkYXRhLmlzU2Nyb2xsaW5nKSB7XG4gICAgZGF0YS5pc1RvdWNoZWQgPSBmYWxzZTtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKCFkYXRhLnN0YXJ0TW92aW5nKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHN3aXBlci5hbGxvd0NsaWNrID0gZmFsc2U7XG4gIGlmICghcGFyYW1zLmNzc01vZGUgJiYgZS5jYW5jZWxhYmxlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG4gIGlmIChwYXJhbXMudG91Y2hNb3ZlU3RvcFByb3BhZ2F0aW9uICYmICFwYXJhbXMubmVzdGVkKSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgfVxuICBsZXQgZGlmZiA9IHN3aXBlci5pc0hvcml6b250YWwoKSA/IGRpZmZYIDogZGlmZlk7XG4gIGxldCB0b3VjaGVzRGlmZiA9IHN3aXBlci5pc0hvcml6b250YWwoKSA/IHRvdWNoZXMuY3VycmVudFggLSB0b3VjaGVzLnByZXZpb3VzWCA6IHRvdWNoZXMuY3VycmVudFkgLSB0b3VjaGVzLnByZXZpb3VzWTtcbiAgaWYgKHBhcmFtcy5vbmVXYXlNb3ZlbWVudCkge1xuICAgIGRpZmYgPSBNYXRoLmFicyhkaWZmKSAqIChydGwgPyAxIDogLTEpO1xuICAgIHRvdWNoZXNEaWZmID0gTWF0aC5hYnModG91Y2hlc0RpZmYpICogKHJ0bCA/IDEgOiAtMSk7XG4gIH1cbiAgdG91Y2hlcy5kaWZmID0gZGlmZjtcbiAgZGlmZiAqPSBwYXJhbXMudG91Y2hSYXRpbztcbiAgaWYgKHJ0bCkge1xuICAgIGRpZmYgPSAtZGlmZjtcbiAgICB0b3VjaGVzRGlmZiA9IC10b3VjaGVzRGlmZjtcbiAgfVxuICBjb25zdCBwcmV2VG91Y2hlc0RpcmVjdGlvbiA9IHN3aXBlci50b3VjaGVzRGlyZWN0aW9uO1xuICBzd2lwZXIuc3dpcGVEaXJlY3Rpb24gPSBkaWZmID4gMCA/ICdwcmV2JyA6ICduZXh0JztcbiAgc3dpcGVyLnRvdWNoZXNEaXJlY3Rpb24gPSB0b3VjaGVzRGlmZiA+IDAgPyAncHJldicgOiAnbmV4dCc7XG4gIGNvbnN0IGlzTG9vcCA9IHN3aXBlci5wYXJhbXMubG9vcCAmJiAhcGFyYW1zLmNzc01vZGU7XG4gIGNvbnN0IGFsbG93TG9vcEZpeCA9IHN3aXBlci50b3VjaGVzRGlyZWN0aW9uID09PSAnbmV4dCcgJiYgc3dpcGVyLmFsbG93U2xpZGVOZXh0IHx8IHN3aXBlci50b3VjaGVzRGlyZWN0aW9uID09PSAncHJldicgJiYgc3dpcGVyLmFsbG93U2xpZGVQcmV2O1xuICBpZiAoIWRhdGEuaXNNb3ZlZCkge1xuICAgIGlmIChpc0xvb3AgJiYgYWxsb3dMb29wRml4KSB7XG4gICAgICBzd2lwZXIubG9vcEZpeCh7XG4gICAgICAgIGRpcmVjdGlvbjogc3dpcGVyLnN3aXBlRGlyZWN0aW9uXG4gICAgICB9KTtcbiAgICB9XG4gICAgZGF0YS5zdGFydFRyYW5zbGF0ZSA9IHN3aXBlci5nZXRUcmFuc2xhdGUoKTtcbiAgICBzd2lwZXIuc2V0VHJhbnNpdGlvbigwKTtcbiAgICBpZiAoc3dpcGVyLmFuaW1hdGluZykge1xuICAgICAgY29uc3QgZXZ0ID0gbmV3IHdpbmRvdy5DdXN0b21FdmVudCgndHJhbnNpdGlvbmVuZCcsIHtcbiAgICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICAgICAgY2FuY2VsYWJsZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgICBzd2lwZXIud3JhcHBlckVsLmRpc3BhdGNoRXZlbnQoZXZ0KTtcbiAgICB9XG4gICAgZGF0YS5hbGxvd01vbWVudHVtQm91bmNlID0gZmFsc2U7XG4gICAgLy8gR3JhYiBDdXJzb3JcbiAgICBpZiAocGFyYW1zLmdyYWJDdXJzb3IgJiYgKHN3aXBlci5hbGxvd1NsaWRlTmV4dCA9PT0gdHJ1ZSB8fCBzd2lwZXIuYWxsb3dTbGlkZVByZXYgPT09IHRydWUpKSB7XG4gICAgICBzd2lwZXIuc2V0R3JhYkN1cnNvcih0cnVlKTtcbiAgICB9XG4gICAgc3dpcGVyLmVtaXQoJ3NsaWRlckZpcnN0TW92ZScsIGUpO1xuICB9XG4gIGxldCBsb29wRml4ZWQ7XG4gIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICBpZiAoZGF0YS5pc01vdmVkICYmIGRhdGEuYWxsb3dUaHJlc2hvbGRNb3ZlICYmIHByZXZUb3VjaGVzRGlyZWN0aW9uICE9PSBzd2lwZXIudG91Y2hlc0RpcmVjdGlvbiAmJiBpc0xvb3AgJiYgYWxsb3dMb29wRml4ICYmIE1hdGguYWJzKGRpZmYpID49IDEpIHtcbiAgICBPYmplY3QuYXNzaWduKHRvdWNoZXMsIHtcbiAgICAgIHN0YXJ0WDogcGFnZVgsXG4gICAgICBzdGFydFk6IHBhZ2VZLFxuICAgICAgY3VycmVudFg6IHBhZ2VYLFxuICAgICAgY3VycmVudFk6IHBhZ2VZLFxuICAgICAgc3RhcnRUcmFuc2xhdGU6IGRhdGEuY3VycmVudFRyYW5zbGF0ZVxuICAgIH0pO1xuICAgIGRhdGEubG9vcFN3YXBSZXNldCA9IHRydWU7XG4gICAgZGF0YS5zdGFydFRyYW5zbGF0ZSA9IGRhdGEuY3VycmVudFRyYW5zbGF0ZTtcbiAgICByZXR1cm47XG4gIH1cbiAgc3dpcGVyLmVtaXQoJ3NsaWRlck1vdmUnLCBlKTtcbiAgZGF0YS5pc01vdmVkID0gdHJ1ZTtcbiAgZGF0YS5jdXJyZW50VHJhbnNsYXRlID0gZGlmZiArIGRhdGEuc3RhcnRUcmFuc2xhdGU7XG4gIGxldCBkaXNhYmxlUGFyZW50U3dpcGVyID0gdHJ1ZTtcbiAgbGV0IHJlc2lzdGFuY2VSYXRpbyA9IHBhcmFtcy5yZXNpc3RhbmNlUmF0aW87XG4gIGlmIChwYXJhbXMudG91Y2hSZWxlYXNlT25FZGdlcykge1xuICAgIHJlc2lzdGFuY2VSYXRpbyA9IDA7XG4gIH1cbiAgaWYgKGRpZmYgPiAwKSB7XG4gICAgaWYgKGlzTG9vcCAmJiBhbGxvd0xvb3BGaXggJiYgIWxvb3BGaXhlZCAmJiBkYXRhLmFsbG93VGhyZXNob2xkTW92ZSAmJiBkYXRhLmN1cnJlbnRUcmFuc2xhdGUgPiAocGFyYW1zLmNlbnRlcmVkU2xpZGVzID8gc3dpcGVyLm1pblRyYW5zbGF0ZSgpIC0gc3dpcGVyLnNsaWRlc1NpemVzR3JpZFtzd2lwZXIuYWN0aXZlSW5kZXggKyAxXSA6IHN3aXBlci5taW5UcmFuc2xhdGUoKSkpIHtcbiAgICAgIHN3aXBlci5sb29wRml4KHtcbiAgICAgICAgZGlyZWN0aW9uOiAncHJldicsXG4gICAgICAgIHNldFRyYW5zbGF0ZTogdHJ1ZSxcbiAgICAgICAgYWN0aXZlU2xpZGVJbmRleDogMFxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChkYXRhLmN1cnJlbnRUcmFuc2xhdGUgPiBzd2lwZXIubWluVHJhbnNsYXRlKCkpIHtcbiAgICAgIGRpc2FibGVQYXJlbnRTd2lwZXIgPSBmYWxzZTtcbiAgICAgIGlmIChwYXJhbXMucmVzaXN0YW5jZSkge1xuICAgICAgICBkYXRhLmN1cnJlbnRUcmFuc2xhdGUgPSBzd2lwZXIubWluVHJhbnNsYXRlKCkgLSAxICsgKC1zd2lwZXIubWluVHJhbnNsYXRlKCkgKyBkYXRhLnN0YXJ0VHJhbnNsYXRlICsgZGlmZikgKiogcmVzaXN0YW5jZVJhdGlvO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmIChkaWZmIDwgMCkge1xuICAgIGlmIChpc0xvb3AgJiYgYWxsb3dMb29wRml4ICYmICFsb29wRml4ZWQgJiYgZGF0YS5hbGxvd1RocmVzaG9sZE1vdmUgJiYgZGF0YS5jdXJyZW50VHJhbnNsYXRlIDwgKHBhcmFtcy5jZW50ZXJlZFNsaWRlcyA/IHN3aXBlci5tYXhUcmFuc2xhdGUoKSArIHN3aXBlci5zbGlkZXNTaXplc0dyaWRbc3dpcGVyLnNsaWRlc1NpemVzR3JpZC5sZW5ndGggLSAxXSA6IHN3aXBlci5tYXhUcmFuc2xhdGUoKSkpIHtcbiAgICAgIHN3aXBlci5sb29wRml4KHtcbiAgICAgICAgZGlyZWN0aW9uOiAnbmV4dCcsXG4gICAgICAgIHNldFRyYW5zbGF0ZTogdHJ1ZSxcbiAgICAgICAgYWN0aXZlU2xpZGVJbmRleDogc3dpcGVyLnNsaWRlcy5sZW5ndGggLSAocGFyYW1zLnNsaWRlc1BlclZpZXcgPT09ICdhdXRvJyA/IHN3aXBlci5zbGlkZXNQZXJWaWV3RHluYW1pYygpIDogTWF0aC5jZWlsKHBhcnNlRmxvYXQocGFyYW1zLnNsaWRlc1BlclZpZXcsIDEwKSkpXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKGRhdGEuY3VycmVudFRyYW5zbGF0ZSA8IHN3aXBlci5tYXhUcmFuc2xhdGUoKSkge1xuICAgICAgZGlzYWJsZVBhcmVudFN3aXBlciA9IGZhbHNlO1xuICAgICAgaWYgKHBhcmFtcy5yZXNpc3RhbmNlKSB7XG4gICAgICAgIGRhdGEuY3VycmVudFRyYW5zbGF0ZSA9IHN3aXBlci5tYXhUcmFuc2xhdGUoKSArIDEgLSAoc3dpcGVyLm1heFRyYW5zbGF0ZSgpIC0gZGF0YS5zdGFydFRyYW5zbGF0ZSAtIGRpZmYpICoqIHJlc2lzdGFuY2VSYXRpbztcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKGRpc2FibGVQYXJlbnRTd2lwZXIpIHtcbiAgICBlLnByZXZlbnRlZEJ5TmVzdGVkU3dpcGVyID0gdHJ1ZTtcbiAgfVxuXG4gIC8vIERpcmVjdGlvbnMgbG9ja3NcbiAgaWYgKCFzd2lwZXIuYWxsb3dTbGlkZU5leHQgJiYgc3dpcGVyLnN3aXBlRGlyZWN0aW9uID09PSAnbmV4dCcgJiYgZGF0YS5jdXJyZW50VHJhbnNsYXRlIDwgZGF0YS5zdGFydFRyYW5zbGF0ZSkge1xuICAgIGRhdGEuY3VycmVudFRyYW5zbGF0ZSA9IGRhdGEuc3RhcnRUcmFuc2xhdGU7XG4gIH1cbiAgaWYgKCFzd2lwZXIuYWxsb3dTbGlkZVByZXYgJiYgc3dpcGVyLnN3aXBlRGlyZWN0aW9uID09PSAncHJldicgJiYgZGF0YS5jdXJyZW50VHJhbnNsYXRlID4gZGF0YS5zdGFydFRyYW5zbGF0ZSkge1xuICAgIGRhdGEuY3VycmVudFRyYW5zbGF0ZSA9IGRhdGEuc3RhcnRUcmFuc2xhdGU7XG4gIH1cbiAgaWYgKCFzd2lwZXIuYWxsb3dTbGlkZVByZXYgJiYgIXN3aXBlci5hbGxvd1NsaWRlTmV4dCkge1xuICAgIGRhdGEuY3VycmVudFRyYW5zbGF0ZSA9IGRhdGEuc3RhcnRUcmFuc2xhdGU7XG4gIH1cblxuICAvLyBUaHJlc2hvbGRcbiAgaWYgKHBhcmFtcy50aHJlc2hvbGQgPiAwKSB7XG4gICAgaWYgKE1hdGguYWJzKGRpZmYpID4gcGFyYW1zLnRocmVzaG9sZCB8fCBkYXRhLmFsbG93VGhyZXNob2xkTW92ZSkge1xuICAgICAgaWYgKCFkYXRhLmFsbG93VGhyZXNob2xkTW92ZSkge1xuICAgICAgICBkYXRhLmFsbG93VGhyZXNob2xkTW92ZSA9IHRydWU7XG4gICAgICAgIHRvdWNoZXMuc3RhcnRYID0gdG91Y2hlcy5jdXJyZW50WDtcbiAgICAgICAgdG91Y2hlcy5zdGFydFkgPSB0b3VjaGVzLmN1cnJlbnRZO1xuICAgICAgICBkYXRhLmN1cnJlbnRUcmFuc2xhdGUgPSBkYXRhLnN0YXJ0VHJhbnNsYXRlO1xuICAgICAgICB0b3VjaGVzLmRpZmYgPSBzd2lwZXIuaXNIb3Jpem9udGFsKCkgPyB0b3VjaGVzLmN1cnJlbnRYIC0gdG91Y2hlcy5zdGFydFggOiB0b3VjaGVzLmN1cnJlbnRZIC0gdG91Y2hlcy5zdGFydFk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZGF0YS5jdXJyZW50VHJhbnNsYXRlID0gZGF0YS5zdGFydFRyYW5zbGF0ZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cbiAgaWYgKCFwYXJhbXMuZm9sbG93RmluZ2VyIHx8IHBhcmFtcy5jc3NNb2RlKSByZXR1cm47XG5cbiAgLy8gVXBkYXRlIGFjdGl2ZSBpbmRleCBpbiBmcmVlIG1vZGVcbiAgaWYgKHBhcmFtcy5mcmVlTW9kZSAmJiBwYXJhbXMuZnJlZU1vZGUuZW5hYmxlZCAmJiBzd2lwZXIuZnJlZU1vZGUgfHwgcGFyYW1zLndhdGNoU2xpZGVzUHJvZ3Jlc3MpIHtcbiAgICBzd2lwZXIudXBkYXRlQWN0aXZlSW5kZXgoKTtcbiAgICBzd2lwZXIudXBkYXRlU2xpZGVzQ2xhc3NlcygpO1xuICB9XG4gIGlmIChwYXJhbXMuZnJlZU1vZGUgJiYgcGFyYW1zLmZyZWVNb2RlLmVuYWJsZWQgJiYgc3dpcGVyLmZyZWVNb2RlKSB7XG4gICAgc3dpcGVyLmZyZWVNb2RlLm9uVG91Y2hNb3ZlKCk7XG4gIH1cbiAgLy8gVXBkYXRlIHByb2dyZXNzXG4gIHN3aXBlci51cGRhdGVQcm9ncmVzcyhkYXRhLmN1cnJlbnRUcmFuc2xhdGUpO1xuICAvLyBVcGRhdGUgdHJhbnNsYXRlXG4gIHN3aXBlci5zZXRUcmFuc2xhdGUoZGF0YS5jdXJyZW50VHJhbnNsYXRlKTtcbn1cblxuZnVuY3Rpb24gb25Ub3VjaEVuZChldmVudCkge1xuICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICBjb25zdCBkYXRhID0gc3dpcGVyLnRvdWNoRXZlbnRzRGF0YTtcbiAgbGV0IGUgPSBldmVudDtcbiAgaWYgKGUub3JpZ2luYWxFdmVudCkgZSA9IGUub3JpZ2luYWxFdmVudDtcbiAgbGV0IHRhcmdldFRvdWNoO1xuICBjb25zdCBpc1RvdWNoRXZlbnQgPSBlLnR5cGUgPT09ICd0b3VjaGVuZCcgfHwgZS50eXBlID09PSAndG91Y2hjYW5jZWwnO1xuICBpZiAoIWlzVG91Y2hFdmVudCkge1xuICAgIGlmIChkYXRhLnRvdWNoSWQgIT09IG51bGwpIHJldHVybjsgLy8gcmV0dXJuIGZyb20gcG9pbnRlciBpZiB3ZSB1c2UgdG91Y2hcbiAgICBpZiAoZS5wb2ludGVySWQgIT09IGRhdGEucG9pbnRlcklkKSByZXR1cm47XG4gICAgdGFyZ2V0VG91Y2ggPSBlO1xuICB9IGVsc2Uge1xuICAgIHRhcmdldFRvdWNoID0gWy4uLmUuY2hhbmdlZFRvdWNoZXNdLmZpbHRlcih0ID0+IHQuaWRlbnRpZmllciA9PT0gZGF0YS50b3VjaElkKVswXTtcbiAgICBpZiAoIXRhcmdldFRvdWNoIHx8IHRhcmdldFRvdWNoLmlkZW50aWZpZXIgIT09IGRhdGEudG91Y2hJZCkgcmV0dXJuO1xuICB9XG4gIGlmIChbJ3BvaW50ZXJjYW5jZWwnLCAncG9pbnRlcm91dCcsICdwb2ludGVybGVhdmUnLCAnY29udGV4dG1lbnUnXS5pbmNsdWRlcyhlLnR5cGUpKSB7XG4gICAgY29uc3QgcHJvY2VlZCA9IFsncG9pbnRlcmNhbmNlbCcsICdjb250ZXh0bWVudSddLmluY2x1ZGVzKGUudHlwZSkgJiYgKHN3aXBlci5icm93c2VyLmlzU2FmYXJpIHx8IHN3aXBlci5icm93c2VyLmlzV2ViVmlldyk7XG4gICAgaWYgKCFwcm9jZWVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG4gIGRhdGEucG9pbnRlcklkID0gbnVsbDtcbiAgZGF0YS50b3VjaElkID0gbnVsbDtcbiAgY29uc3Qge1xuICAgIHBhcmFtcyxcbiAgICB0b3VjaGVzLFxuICAgIHJ0bFRyYW5zbGF0ZTogcnRsLFxuICAgIHNsaWRlc0dyaWQsXG4gICAgZW5hYmxlZFxuICB9ID0gc3dpcGVyO1xuICBpZiAoIWVuYWJsZWQpIHJldHVybjtcbiAgaWYgKCFwYXJhbXMuc2ltdWxhdGVUb3VjaCAmJiBlLnBvaW50ZXJUeXBlID09PSAnbW91c2UnKSByZXR1cm47XG4gIGlmIChkYXRhLmFsbG93VG91Y2hDYWxsYmFja3MpIHtcbiAgICBzd2lwZXIuZW1pdCgndG91Y2hFbmQnLCBlKTtcbiAgfVxuICBkYXRhLmFsbG93VG91Y2hDYWxsYmFja3MgPSBmYWxzZTtcbiAgaWYgKCFkYXRhLmlzVG91Y2hlZCkge1xuICAgIGlmIChkYXRhLmlzTW92ZWQgJiYgcGFyYW1zLmdyYWJDdXJzb3IpIHtcbiAgICAgIHN3aXBlci5zZXRHcmFiQ3Vyc29yKGZhbHNlKTtcbiAgICB9XG4gICAgZGF0YS5pc01vdmVkID0gZmFsc2U7XG4gICAgZGF0YS5zdGFydE1vdmluZyA9IGZhbHNlO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIFJldHVybiBHcmFiIEN1cnNvclxuICBpZiAocGFyYW1zLmdyYWJDdXJzb3IgJiYgZGF0YS5pc01vdmVkICYmIGRhdGEuaXNUb3VjaGVkICYmIChzd2lwZXIuYWxsb3dTbGlkZU5leHQgPT09IHRydWUgfHwgc3dpcGVyLmFsbG93U2xpZGVQcmV2ID09PSB0cnVlKSkge1xuICAgIHN3aXBlci5zZXRHcmFiQ3Vyc29yKGZhbHNlKTtcbiAgfVxuXG4gIC8vIFRpbWUgZGlmZlxuICBjb25zdCB0b3VjaEVuZFRpbWUgPSBub3coKTtcbiAgY29uc3QgdGltZURpZmYgPSB0b3VjaEVuZFRpbWUgLSBkYXRhLnRvdWNoU3RhcnRUaW1lO1xuXG4gIC8vIFRhcCwgZG91YmxlVGFwLCBDbGlja1xuICBpZiAoc3dpcGVyLmFsbG93Q2xpY2spIHtcbiAgICBjb25zdCBwYXRoVHJlZSA9IGUucGF0aCB8fCBlLmNvbXBvc2VkUGF0aCAmJiBlLmNvbXBvc2VkUGF0aCgpO1xuICAgIHN3aXBlci51cGRhdGVDbGlja2VkU2xpZGUocGF0aFRyZWUgJiYgcGF0aFRyZWVbMF0gfHwgZS50YXJnZXQsIHBhdGhUcmVlKTtcbiAgICBzd2lwZXIuZW1pdCgndGFwIGNsaWNrJywgZSk7XG4gICAgaWYgKHRpbWVEaWZmIDwgMzAwICYmIHRvdWNoRW5kVGltZSAtIGRhdGEubGFzdENsaWNrVGltZSA8IDMwMCkge1xuICAgICAgc3dpcGVyLmVtaXQoJ2RvdWJsZVRhcCBkb3VibGVDbGljaycsIGUpO1xuICAgIH1cbiAgfVxuICBkYXRhLmxhc3RDbGlja1RpbWUgPSBub3coKTtcbiAgbmV4dFRpY2soKCkgPT4ge1xuICAgIGlmICghc3dpcGVyLmRlc3Ryb3llZCkgc3dpcGVyLmFsbG93Q2xpY2sgPSB0cnVlO1xuICB9KTtcbiAgaWYgKCFkYXRhLmlzVG91Y2hlZCB8fCAhZGF0YS5pc01vdmVkIHx8ICFzd2lwZXIuc3dpcGVEaXJlY3Rpb24gfHwgdG91Y2hlcy5kaWZmID09PSAwICYmICFkYXRhLmxvb3BTd2FwUmVzZXQgfHwgZGF0YS5jdXJyZW50VHJhbnNsYXRlID09PSBkYXRhLnN0YXJ0VHJhbnNsYXRlICYmICFkYXRhLmxvb3BTd2FwUmVzZXQpIHtcbiAgICBkYXRhLmlzVG91Y2hlZCA9IGZhbHNlO1xuICAgIGRhdGEuaXNNb3ZlZCA9IGZhbHNlO1xuICAgIGRhdGEuc3RhcnRNb3ZpbmcgPSBmYWxzZTtcbiAgICByZXR1cm47XG4gIH1cbiAgZGF0YS5pc1RvdWNoZWQgPSBmYWxzZTtcbiAgZGF0YS5pc01vdmVkID0gZmFsc2U7XG4gIGRhdGEuc3RhcnRNb3ZpbmcgPSBmYWxzZTtcbiAgbGV0IGN1cnJlbnRQb3M7XG4gIGlmIChwYXJhbXMuZm9sbG93RmluZ2VyKSB7XG4gICAgY3VycmVudFBvcyA9IHJ0bCA/IHN3aXBlci50cmFuc2xhdGUgOiAtc3dpcGVyLnRyYW5zbGF0ZTtcbiAgfSBlbHNlIHtcbiAgICBjdXJyZW50UG9zID0gLWRhdGEuY3VycmVudFRyYW5zbGF0ZTtcbiAgfVxuICBpZiAocGFyYW1zLmNzc01vZGUpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKHBhcmFtcy5mcmVlTW9kZSAmJiBwYXJhbXMuZnJlZU1vZGUuZW5hYmxlZCkge1xuICAgIHN3aXBlci5mcmVlTW9kZS5vblRvdWNoRW5kKHtcbiAgICAgIGN1cnJlbnRQb3NcbiAgICB9KTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBGaW5kIGN1cnJlbnQgc2xpZGVcbiAgY29uc3Qgc3dpcGVUb0xhc3QgPSBjdXJyZW50UG9zID49IC1zd2lwZXIubWF4VHJhbnNsYXRlKCkgJiYgIXN3aXBlci5wYXJhbXMubG9vcDtcbiAgbGV0IHN0b3BJbmRleCA9IDA7XG4gIGxldCBncm91cFNpemUgPSBzd2lwZXIuc2xpZGVzU2l6ZXNHcmlkWzBdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHNsaWRlc0dyaWQubGVuZ3RoOyBpICs9IGkgPCBwYXJhbXMuc2xpZGVzUGVyR3JvdXBTa2lwID8gMSA6IHBhcmFtcy5zbGlkZXNQZXJHcm91cCkge1xuICAgIGNvbnN0IGluY3JlbWVudCA9IGkgPCBwYXJhbXMuc2xpZGVzUGVyR3JvdXBTa2lwIC0gMSA/IDEgOiBwYXJhbXMuc2xpZGVzUGVyR3JvdXA7XG4gICAgaWYgKHR5cGVvZiBzbGlkZXNHcmlkW2kgKyBpbmNyZW1lbnRdICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgaWYgKHN3aXBlVG9MYXN0IHx8IGN1cnJlbnRQb3MgPj0gc2xpZGVzR3JpZFtpXSAmJiBjdXJyZW50UG9zIDwgc2xpZGVzR3JpZFtpICsgaW5jcmVtZW50XSkge1xuICAgICAgICBzdG9wSW5kZXggPSBpO1xuICAgICAgICBncm91cFNpemUgPSBzbGlkZXNHcmlkW2kgKyBpbmNyZW1lbnRdIC0gc2xpZGVzR3JpZFtpXTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHN3aXBlVG9MYXN0IHx8IGN1cnJlbnRQb3MgPj0gc2xpZGVzR3JpZFtpXSkge1xuICAgICAgc3RvcEluZGV4ID0gaTtcbiAgICAgIGdyb3VwU2l6ZSA9IHNsaWRlc0dyaWRbc2xpZGVzR3JpZC5sZW5ndGggLSAxXSAtIHNsaWRlc0dyaWRbc2xpZGVzR3JpZC5sZW5ndGggLSAyXTtcbiAgICB9XG4gIH1cbiAgbGV0IHJld2luZEZpcnN0SW5kZXggPSBudWxsO1xuICBsZXQgcmV3aW5kTGFzdEluZGV4ID0gbnVsbDtcbiAgaWYgKHBhcmFtcy5yZXdpbmQpIHtcbiAgICBpZiAoc3dpcGVyLmlzQmVnaW5uaW5nKSB7XG4gICAgICByZXdpbmRMYXN0SW5kZXggPSBwYXJhbXMudmlydHVhbCAmJiBwYXJhbXMudmlydHVhbC5lbmFibGVkICYmIHN3aXBlci52aXJ0dWFsID8gc3dpcGVyLnZpcnR1YWwuc2xpZGVzLmxlbmd0aCAtIDEgOiBzd2lwZXIuc2xpZGVzLmxlbmd0aCAtIDE7XG4gICAgfSBlbHNlIGlmIChzd2lwZXIuaXNFbmQpIHtcbiAgICAgIHJld2luZEZpcnN0SW5kZXggPSAwO1xuICAgIH1cbiAgfVxuICAvLyBGaW5kIGN1cnJlbnQgc2xpZGUgc2l6ZVxuICBjb25zdCByYXRpbyA9IChjdXJyZW50UG9zIC0gc2xpZGVzR3JpZFtzdG9wSW5kZXhdKSAvIGdyb3VwU2l6ZTtcbiAgY29uc3QgaW5jcmVtZW50ID0gc3RvcEluZGV4IDwgcGFyYW1zLnNsaWRlc1Blckdyb3VwU2tpcCAtIDEgPyAxIDogcGFyYW1zLnNsaWRlc1Blckdyb3VwO1xuICBpZiAodGltZURpZmYgPiBwYXJhbXMubG9uZ1N3aXBlc01zKSB7XG4gICAgLy8gTG9uZyB0b3VjaGVzXG4gICAgaWYgKCFwYXJhbXMubG9uZ1N3aXBlcykge1xuICAgICAgc3dpcGVyLnNsaWRlVG8oc3dpcGVyLmFjdGl2ZUluZGV4KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHN3aXBlci5zd2lwZURpcmVjdGlvbiA9PT0gJ25leHQnKSB7XG4gICAgICBpZiAocmF0aW8gPj0gcGFyYW1zLmxvbmdTd2lwZXNSYXRpbykgc3dpcGVyLnNsaWRlVG8ocGFyYW1zLnJld2luZCAmJiBzd2lwZXIuaXNFbmQgPyByZXdpbmRGaXJzdEluZGV4IDogc3RvcEluZGV4ICsgaW5jcmVtZW50KTtlbHNlIHN3aXBlci5zbGlkZVRvKHN0b3BJbmRleCk7XG4gICAgfVxuICAgIGlmIChzd2lwZXIuc3dpcGVEaXJlY3Rpb24gPT09ICdwcmV2Jykge1xuICAgICAgaWYgKHJhdGlvID4gMSAtIHBhcmFtcy5sb25nU3dpcGVzUmF0aW8pIHtcbiAgICAgICAgc3dpcGVyLnNsaWRlVG8oc3RvcEluZGV4ICsgaW5jcmVtZW50KTtcbiAgICAgIH0gZWxzZSBpZiAocmV3aW5kTGFzdEluZGV4ICE9PSBudWxsICYmIHJhdGlvIDwgMCAmJiBNYXRoLmFicyhyYXRpbykgPiBwYXJhbXMubG9uZ1N3aXBlc1JhdGlvKSB7XG4gICAgICAgIHN3aXBlci5zbGlkZVRvKHJld2luZExhc3RJbmRleCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzd2lwZXIuc2xpZGVUbyhzdG9wSW5kZXgpO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBTaG9ydCBzd2lwZXNcbiAgICBpZiAoIXBhcmFtcy5zaG9ydFN3aXBlcykge1xuICAgICAgc3dpcGVyLnNsaWRlVG8oc3dpcGVyLmFjdGl2ZUluZGV4KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgaXNOYXZCdXR0b25UYXJnZXQgPSBzd2lwZXIubmF2aWdhdGlvbiAmJiAoZS50YXJnZXQgPT09IHN3aXBlci5uYXZpZ2F0aW9uLm5leHRFbCB8fCBlLnRhcmdldCA9PT0gc3dpcGVyLm5hdmlnYXRpb24ucHJldkVsKTtcbiAgICBpZiAoIWlzTmF2QnV0dG9uVGFyZ2V0KSB7XG4gICAgICBpZiAoc3dpcGVyLnN3aXBlRGlyZWN0aW9uID09PSAnbmV4dCcpIHtcbiAgICAgICAgc3dpcGVyLnNsaWRlVG8ocmV3aW5kRmlyc3RJbmRleCAhPT0gbnVsbCA/IHJld2luZEZpcnN0SW5kZXggOiBzdG9wSW5kZXggKyBpbmNyZW1lbnQpO1xuICAgICAgfVxuICAgICAgaWYgKHN3aXBlci5zd2lwZURpcmVjdGlvbiA9PT0gJ3ByZXYnKSB7XG4gICAgICAgIHN3aXBlci5zbGlkZVRvKHJld2luZExhc3RJbmRleCAhPT0gbnVsbCA/IHJld2luZExhc3RJbmRleCA6IHN0b3BJbmRleCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChlLnRhcmdldCA9PT0gc3dpcGVyLm5hdmlnYXRpb24ubmV4dEVsKSB7XG4gICAgICBzd2lwZXIuc2xpZGVUbyhzdG9wSW5kZXggKyBpbmNyZW1lbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzd2lwZXIuc2xpZGVUbyhzdG9wSW5kZXgpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBvblJlc2l6ZSgpIHtcbiAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgY29uc3Qge1xuICAgIHBhcmFtcyxcbiAgICBlbFxuICB9ID0gc3dpcGVyO1xuICBpZiAoZWwgJiYgZWwub2Zmc2V0V2lkdGggPT09IDApIHJldHVybjtcblxuICAvLyBCcmVha3BvaW50c1xuICBpZiAocGFyYW1zLmJyZWFrcG9pbnRzKSB7XG4gICAgc3dpcGVyLnNldEJyZWFrcG9pbnQoKTtcbiAgfVxuXG4gIC8vIFNhdmUgbG9ja3NcbiAgY29uc3Qge1xuICAgIGFsbG93U2xpZGVOZXh0LFxuICAgIGFsbG93U2xpZGVQcmV2LFxuICAgIHNuYXBHcmlkXG4gIH0gPSBzd2lwZXI7XG4gIGNvbnN0IGlzVmlydHVhbCA9IHN3aXBlci52aXJ0dWFsICYmIHN3aXBlci5wYXJhbXMudmlydHVhbC5lbmFibGVkO1xuXG4gIC8vIERpc2FibGUgbG9ja3Mgb24gcmVzaXplXG4gIHN3aXBlci5hbGxvd1NsaWRlTmV4dCA9IHRydWU7XG4gIHN3aXBlci5hbGxvd1NsaWRlUHJldiA9IHRydWU7XG4gIHN3aXBlci51cGRhdGVTaXplKCk7XG4gIHN3aXBlci51cGRhdGVTbGlkZXMoKTtcbiAgc3dpcGVyLnVwZGF0ZVNsaWRlc0NsYXNzZXMoKTtcbiAgY29uc3QgaXNWaXJ0dWFsTG9vcCA9IGlzVmlydHVhbCAmJiBwYXJhbXMubG9vcDtcbiAgaWYgKChwYXJhbXMuc2xpZGVzUGVyVmlldyA9PT0gJ2F1dG8nIHx8IHBhcmFtcy5zbGlkZXNQZXJWaWV3ID4gMSkgJiYgc3dpcGVyLmlzRW5kICYmICFzd2lwZXIuaXNCZWdpbm5pbmcgJiYgIXN3aXBlci5wYXJhbXMuY2VudGVyZWRTbGlkZXMgJiYgIWlzVmlydHVhbExvb3ApIHtcbiAgICBzd2lwZXIuc2xpZGVUbyhzd2lwZXIuc2xpZGVzLmxlbmd0aCAtIDEsIDAsIGZhbHNlLCB0cnVlKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5sb29wICYmICFpc1ZpcnR1YWwpIHtcbiAgICAgIHN3aXBlci5zbGlkZVRvTG9vcChzd2lwZXIucmVhbEluZGV4LCAwLCBmYWxzZSwgdHJ1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN3aXBlci5zbGlkZVRvKHN3aXBlci5hY3RpdmVJbmRleCwgMCwgZmFsc2UsIHRydWUpO1xuICAgIH1cbiAgfVxuICBpZiAoc3dpcGVyLmF1dG9wbGF5ICYmIHN3aXBlci5hdXRvcGxheS5ydW5uaW5nICYmIHN3aXBlci5hdXRvcGxheS5wYXVzZWQpIHtcbiAgICBjbGVhclRpbWVvdXQoc3dpcGVyLmF1dG9wbGF5LnJlc2l6ZVRpbWVvdXQpO1xuICAgIHN3aXBlci5hdXRvcGxheS5yZXNpemVUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZiAoc3dpcGVyLmF1dG9wbGF5ICYmIHN3aXBlci5hdXRvcGxheS5ydW5uaW5nICYmIHN3aXBlci5hdXRvcGxheS5wYXVzZWQpIHtcbiAgICAgICAgc3dpcGVyLmF1dG9wbGF5LnJlc3VtZSgpO1xuICAgICAgfVxuICAgIH0sIDUwMCk7XG4gIH1cbiAgLy8gUmV0dXJuIGxvY2tzIGFmdGVyIHJlc2l6ZVxuICBzd2lwZXIuYWxsb3dTbGlkZVByZXYgPSBhbGxvd1NsaWRlUHJldjtcbiAgc3dpcGVyLmFsbG93U2xpZGVOZXh0ID0gYWxsb3dTbGlkZU5leHQ7XG4gIGlmIChzd2lwZXIucGFyYW1zLndhdGNoT3ZlcmZsb3cgJiYgc25hcEdyaWQgIT09IHN3aXBlci5zbmFwR3JpZCkge1xuICAgIHN3aXBlci5jaGVja092ZXJmbG93KCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gb25DbGljayhlKSB7XG4gIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gIGlmICghc3dpcGVyLmVuYWJsZWQpIHJldHVybjtcbiAgaWYgKCFzd2lwZXIuYWxsb3dDbGljaykge1xuICAgIGlmIChzd2lwZXIucGFyYW1zLnByZXZlbnRDbGlja3MpIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5wcmV2ZW50Q2xpY2tzUHJvcGFnYXRpb24gJiYgc3dpcGVyLmFuaW1hdGluZykge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIG9uU2Nyb2xsKCkge1xuICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICBjb25zdCB7XG4gICAgd3JhcHBlckVsLFxuICAgIHJ0bFRyYW5zbGF0ZSxcbiAgICBlbmFibGVkXG4gIH0gPSBzd2lwZXI7XG4gIGlmICghZW5hYmxlZCkgcmV0dXJuO1xuICBzd2lwZXIucHJldmlvdXNUcmFuc2xhdGUgPSBzd2lwZXIudHJhbnNsYXRlO1xuICBpZiAoc3dpcGVyLmlzSG9yaXpvbnRhbCgpKSB7XG4gICAgc3dpcGVyLnRyYW5zbGF0ZSA9IC13cmFwcGVyRWwuc2Nyb2xsTGVmdDtcbiAgfSBlbHNlIHtcbiAgICBzd2lwZXIudHJhbnNsYXRlID0gLXdyYXBwZXJFbC5zY3JvbGxUb3A7XG4gIH1cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gIGlmIChzd2lwZXIudHJhbnNsYXRlID09PSAwKSBzd2lwZXIudHJhbnNsYXRlID0gMDtcbiAgc3dpcGVyLnVwZGF0ZUFjdGl2ZUluZGV4KCk7XG4gIHN3aXBlci51cGRhdGVTbGlkZXNDbGFzc2VzKCk7XG4gIGxldCBuZXdQcm9ncmVzcztcbiAgY29uc3QgdHJhbnNsYXRlc0RpZmYgPSBzd2lwZXIubWF4VHJhbnNsYXRlKCkgLSBzd2lwZXIubWluVHJhbnNsYXRlKCk7XG4gIGlmICh0cmFuc2xhdGVzRGlmZiA9PT0gMCkge1xuICAgIG5ld1Byb2dyZXNzID0gMDtcbiAgfSBlbHNlIHtcbiAgICBuZXdQcm9ncmVzcyA9IChzd2lwZXIudHJhbnNsYXRlIC0gc3dpcGVyLm1pblRyYW5zbGF0ZSgpKSAvIHRyYW5zbGF0ZXNEaWZmO1xuICB9XG4gIGlmIChuZXdQcm9ncmVzcyAhPT0gc3dpcGVyLnByb2dyZXNzKSB7XG4gICAgc3dpcGVyLnVwZGF0ZVByb2dyZXNzKHJ0bFRyYW5zbGF0ZSA/IC1zd2lwZXIudHJhbnNsYXRlIDogc3dpcGVyLnRyYW5zbGF0ZSk7XG4gIH1cbiAgc3dpcGVyLmVtaXQoJ3NldFRyYW5zbGF0ZScsIHN3aXBlci50cmFuc2xhdGUsIGZhbHNlKTtcbn1cblxuZnVuY3Rpb24gb25Mb2FkKGUpIHtcbiAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgcHJvY2Vzc0xhenlQcmVsb2FkZXIoc3dpcGVyLCBlLnRhcmdldCk7XG4gIGlmIChzd2lwZXIucGFyYW1zLmNzc01vZGUgfHwgc3dpcGVyLnBhcmFtcy5zbGlkZXNQZXJWaWV3ICE9PSAnYXV0bycgJiYgIXN3aXBlci5wYXJhbXMuYXV0b0hlaWdodCkge1xuICAgIHJldHVybjtcbiAgfVxuICBzd2lwZXIudXBkYXRlKCk7XG59XG5cbmZ1bmN0aW9uIG9uRG9jdW1lbnRUb3VjaFN0YXJ0KCkge1xuICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICBpZiAoc3dpcGVyLmRvY3VtZW50VG91Y2hIYW5kbGVyUHJvY2VlZGVkKSByZXR1cm47XG4gIHN3aXBlci5kb2N1bWVudFRvdWNoSGFuZGxlclByb2NlZWRlZCA9IHRydWU7XG4gIGlmIChzd2lwZXIucGFyYW1zLnRvdWNoUmVsZWFzZU9uRWRnZXMpIHtcbiAgICBzd2lwZXIuZWwuc3R5bGUudG91Y2hBY3Rpb24gPSAnYXV0byc7XG4gIH1cbn1cblxuY29uc3QgZXZlbnRzID0gKHN3aXBlciwgbWV0aG9kKSA9PiB7XG4gIGNvbnN0IGRvY3VtZW50ID0gZ2V0RG9jdW1lbnQoKTtcbiAgY29uc3Qge1xuICAgIHBhcmFtcyxcbiAgICBlbCxcbiAgICB3cmFwcGVyRWwsXG4gICAgZGV2aWNlXG4gIH0gPSBzd2lwZXI7XG4gIGNvbnN0IGNhcHR1cmUgPSAhIXBhcmFtcy5uZXN0ZWQ7XG4gIGNvbnN0IGRvbU1ldGhvZCA9IG1ldGhvZCA9PT0gJ29uJyA/ICdhZGRFdmVudExpc3RlbmVyJyA6ICdyZW1vdmVFdmVudExpc3RlbmVyJztcbiAgY29uc3Qgc3dpcGVyTWV0aG9kID0gbWV0aG9kO1xuXG4gIC8vIFRvdWNoIEV2ZW50c1xuICBkb2N1bWVudFtkb21NZXRob2RdKCd0b3VjaHN0YXJ0Jywgc3dpcGVyLm9uRG9jdW1lbnRUb3VjaFN0YXJ0LCB7XG4gICAgcGFzc2l2ZTogZmFsc2UsXG4gICAgY2FwdHVyZVxuICB9KTtcbiAgZWxbZG9tTWV0aG9kXSgndG91Y2hzdGFydCcsIHN3aXBlci5vblRvdWNoU3RhcnQsIHtcbiAgICBwYXNzaXZlOiBmYWxzZVxuICB9KTtcbiAgZWxbZG9tTWV0aG9kXSgncG9pbnRlcmRvd24nLCBzd2lwZXIub25Ub3VjaFN0YXJ0LCB7XG4gICAgcGFzc2l2ZTogZmFsc2VcbiAgfSk7XG4gIGRvY3VtZW50W2RvbU1ldGhvZF0oJ3RvdWNobW92ZScsIHN3aXBlci5vblRvdWNoTW92ZSwge1xuICAgIHBhc3NpdmU6IGZhbHNlLFxuICAgIGNhcHR1cmVcbiAgfSk7XG4gIGRvY3VtZW50W2RvbU1ldGhvZF0oJ3BvaW50ZXJtb3ZlJywgc3dpcGVyLm9uVG91Y2hNb3ZlLCB7XG4gICAgcGFzc2l2ZTogZmFsc2UsXG4gICAgY2FwdHVyZVxuICB9KTtcbiAgZG9jdW1lbnRbZG9tTWV0aG9kXSgndG91Y2hlbmQnLCBzd2lwZXIub25Ub3VjaEVuZCwge1xuICAgIHBhc3NpdmU6IHRydWVcbiAgfSk7XG4gIGRvY3VtZW50W2RvbU1ldGhvZF0oJ3BvaW50ZXJ1cCcsIHN3aXBlci5vblRvdWNoRW5kLCB7XG4gICAgcGFzc2l2ZTogdHJ1ZVxuICB9KTtcbiAgZG9jdW1lbnRbZG9tTWV0aG9kXSgncG9pbnRlcmNhbmNlbCcsIHN3aXBlci5vblRvdWNoRW5kLCB7XG4gICAgcGFzc2l2ZTogdHJ1ZVxuICB9KTtcbiAgZG9jdW1lbnRbZG9tTWV0aG9kXSgndG91Y2hjYW5jZWwnLCBzd2lwZXIub25Ub3VjaEVuZCwge1xuICAgIHBhc3NpdmU6IHRydWVcbiAgfSk7XG4gIGRvY3VtZW50W2RvbU1ldGhvZF0oJ3BvaW50ZXJvdXQnLCBzd2lwZXIub25Ub3VjaEVuZCwge1xuICAgIHBhc3NpdmU6IHRydWVcbiAgfSk7XG4gIGRvY3VtZW50W2RvbU1ldGhvZF0oJ3BvaW50ZXJsZWF2ZScsIHN3aXBlci5vblRvdWNoRW5kLCB7XG4gICAgcGFzc2l2ZTogdHJ1ZVxuICB9KTtcbiAgZG9jdW1lbnRbZG9tTWV0aG9kXSgnY29udGV4dG1lbnUnLCBzd2lwZXIub25Ub3VjaEVuZCwge1xuICAgIHBhc3NpdmU6IHRydWVcbiAgfSk7XG5cbiAgLy8gUHJldmVudCBMaW5rcyBDbGlja3NcbiAgaWYgKHBhcmFtcy5wcmV2ZW50Q2xpY2tzIHx8IHBhcmFtcy5wcmV2ZW50Q2xpY2tzUHJvcGFnYXRpb24pIHtcbiAgICBlbFtkb21NZXRob2RdKCdjbGljaycsIHN3aXBlci5vbkNsaWNrLCB0cnVlKTtcbiAgfVxuICBpZiAocGFyYW1zLmNzc01vZGUpIHtcbiAgICB3cmFwcGVyRWxbZG9tTWV0aG9kXSgnc2Nyb2xsJywgc3dpcGVyLm9uU2Nyb2xsKTtcbiAgfVxuXG4gIC8vIFJlc2l6ZSBoYW5kbGVyXG4gIGlmIChwYXJhbXMudXBkYXRlT25XaW5kb3dSZXNpemUpIHtcbiAgICBzd2lwZXJbc3dpcGVyTWV0aG9kXShkZXZpY2UuaW9zIHx8IGRldmljZS5hbmRyb2lkID8gJ3Jlc2l6ZSBvcmllbnRhdGlvbmNoYW5nZSBvYnNlcnZlclVwZGF0ZScgOiAncmVzaXplIG9ic2VydmVyVXBkYXRlJywgb25SZXNpemUsIHRydWUpO1xuICB9IGVsc2Uge1xuICAgIHN3aXBlcltzd2lwZXJNZXRob2RdKCdvYnNlcnZlclVwZGF0ZScsIG9uUmVzaXplLCB0cnVlKTtcbiAgfVxuXG4gIC8vIEltYWdlcyBsb2FkZXJcbiAgZWxbZG9tTWV0aG9kXSgnbG9hZCcsIHN3aXBlci5vbkxvYWQsIHtcbiAgICBjYXB0dXJlOiB0cnVlXG4gIH0pO1xufTtcbmZ1bmN0aW9uIGF0dGFjaEV2ZW50cygpIHtcbiAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgY29uc3Qge1xuICAgIHBhcmFtc1xuICB9ID0gc3dpcGVyO1xuICBzd2lwZXIub25Ub3VjaFN0YXJ0ID0gb25Ub3VjaFN0YXJ0LmJpbmQoc3dpcGVyKTtcbiAgc3dpcGVyLm9uVG91Y2hNb3ZlID0gb25Ub3VjaE1vdmUuYmluZChzd2lwZXIpO1xuICBzd2lwZXIub25Ub3VjaEVuZCA9IG9uVG91Y2hFbmQuYmluZChzd2lwZXIpO1xuICBzd2lwZXIub25Eb2N1bWVudFRvdWNoU3RhcnQgPSBvbkRvY3VtZW50VG91Y2hTdGFydC5iaW5kKHN3aXBlcik7XG4gIGlmIChwYXJhbXMuY3NzTW9kZSkge1xuICAgIHN3aXBlci5vblNjcm9sbCA9IG9uU2Nyb2xsLmJpbmQoc3dpcGVyKTtcbiAgfVxuICBzd2lwZXIub25DbGljayA9IG9uQ2xpY2suYmluZChzd2lwZXIpO1xuICBzd2lwZXIub25Mb2FkID0gb25Mb2FkLmJpbmQoc3dpcGVyKTtcbiAgZXZlbnRzKHN3aXBlciwgJ29uJyk7XG59XG5mdW5jdGlvbiBkZXRhY2hFdmVudHMoKSB7XG4gIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gIGV2ZW50cyhzd2lwZXIsICdvZmYnKTtcbn1cbnZhciBldmVudHMkMSA9IHtcbiAgYXR0YWNoRXZlbnRzLFxuICBkZXRhY2hFdmVudHNcbn07XG5cbmNvbnN0IGlzR3JpZEVuYWJsZWQgPSAoc3dpcGVyLCBwYXJhbXMpID0+IHtcbiAgcmV0dXJuIHN3aXBlci5ncmlkICYmIHBhcmFtcy5ncmlkICYmIHBhcmFtcy5ncmlkLnJvd3MgPiAxO1xufTtcbmZ1bmN0aW9uIHNldEJyZWFrcG9pbnQoKSB7XG4gIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gIGNvbnN0IHtcbiAgICByZWFsSW5kZXgsXG4gICAgaW5pdGlhbGl6ZWQsXG4gICAgcGFyYW1zLFxuICAgIGVsXG4gIH0gPSBzd2lwZXI7XG4gIGNvbnN0IGJyZWFrcG9pbnRzID0gcGFyYW1zLmJyZWFrcG9pbnRzO1xuICBpZiAoIWJyZWFrcG9pbnRzIHx8IGJyZWFrcG9pbnRzICYmIE9iamVjdC5rZXlzKGJyZWFrcG9pbnRzKS5sZW5ndGggPT09IDApIHJldHVybjtcblxuICAvLyBHZXQgYnJlYWtwb2ludCBmb3Igd2luZG93IHdpZHRoIGFuZCB1cGRhdGUgcGFyYW1ldGVyc1xuICBjb25zdCBicmVha3BvaW50ID0gc3dpcGVyLmdldEJyZWFrcG9pbnQoYnJlYWtwb2ludHMsIHN3aXBlci5wYXJhbXMuYnJlYWtwb2ludHNCYXNlLCBzd2lwZXIuZWwpO1xuICBpZiAoIWJyZWFrcG9pbnQgfHwgc3dpcGVyLmN1cnJlbnRCcmVha3BvaW50ID09PSBicmVha3BvaW50KSByZXR1cm47XG4gIGNvbnN0IGJyZWFrcG9pbnRPbmx5UGFyYW1zID0gYnJlYWtwb2ludCBpbiBicmVha3BvaW50cyA/IGJyZWFrcG9pbnRzW2JyZWFrcG9pbnRdIDogdW5kZWZpbmVkO1xuICBjb25zdCBicmVha3BvaW50UGFyYW1zID0gYnJlYWtwb2ludE9ubHlQYXJhbXMgfHwgc3dpcGVyLm9yaWdpbmFsUGFyYW1zO1xuICBjb25zdCB3YXNNdWx0aVJvdyA9IGlzR3JpZEVuYWJsZWQoc3dpcGVyLCBwYXJhbXMpO1xuICBjb25zdCBpc011bHRpUm93ID0gaXNHcmlkRW5hYmxlZChzd2lwZXIsIGJyZWFrcG9pbnRQYXJhbXMpO1xuICBjb25zdCB3YXNFbmFibGVkID0gcGFyYW1zLmVuYWJsZWQ7XG4gIGlmICh3YXNNdWx0aVJvdyAmJiAhaXNNdWx0aVJvdykge1xuICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoYCR7cGFyYW1zLmNvbnRhaW5lck1vZGlmaWVyQ2xhc3N9Z3JpZGAsIGAke3BhcmFtcy5jb250YWluZXJNb2RpZmllckNsYXNzfWdyaWQtY29sdW1uYCk7XG4gICAgc3dpcGVyLmVtaXRDb250YWluZXJDbGFzc2VzKCk7XG4gIH0gZWxzZSBpZiAoIXdhc011bHRpUm93ICYmIGlzTXVsdGlSb3cpIHtcbiAgICBlbC5jbGFzc0xpc3QuYWRkKGAke3BhcmFtcy5jb250YWluZXJNb2RpZmllckNsYXNzfWdyaWRgKTtcbiAgICBpZiAoYnJlYWtwb2ludFBhcmFtcy5ncmlkLmZpbGwgJiYgYnJlYWtwb2ludFBhcmFtcy5ncmlkLmZpbGwgPT09ICdjb2x1bW4nIHx8ICFicmVha3BvaW50UGFyYW1zLmdyaWQuZmlsbCAmJiBwYXJhbXMuZ3JpZC5maWxsID09PSAnY29sdW1uJykge1xuICAgICAgZWwuY2xhc3NMaXN0LmFkZChgJHtwYXJhbXMuY29udGFpbmVyTW9kaWZpZXJDbGFzc31ncmlkLWNvbHVtbmApO1xuICAgIH1cbiAgICBzd2lwZXIuZW1pdENvbnRhaW5lckNsYXNzZXMoKTtcbiAgfVxuXG4gIC8vIFRvZ2dsZSBuYXZpZ2F0aW9uLCBwYWdpbmF0aW9uLCBzY3JvbGxiYXJcbiAgWyduYXZpZ2F0aW9uJywgJ3BhZ2luYXRpb24nLCAnc2Nyb2xsYmFyJ10uZm9yRWFjaChwcm9wID0+IHtcbiAgICBpZiAodHlwZW9mIGJyZWFrcG9pbnRQYXJhbXNbcHJvcF0gPT09ICd1bmRlZmluZWQnKSByZXR1cm47XG4gICAgY29uc3Qgd2FzTW9kdWxlRW5hYmxlZCA9IHBhcmFtc1twcm9wXSAmJiBwYXJhbXNbcHJvcF0uZW5hYmxlZDtcbiAgICBjb25zdCBpc01vZHVsZUVuYWJsZWQgPSBicmVha3BvaW50UGFyYW1zW3Byb3BdICYmIGJyZWFrcG9pbnRQYXJhbXNbcHJvcF0uZW5hYmxlZDtcbiAgICBpZiAod2FzTW9kdWxlRW5hYmxlZCAmJiAhaXNNb2R1bGVFbmFibGVkKSB7XG4gICAgICBzd2lwZXJbcHJvcF0uZGlzYWJsZSgpO1xuICAgIH1cbiAgICBpZiAoIXdhc01vZHVsZUVuYWJsZWQgJiYgaXNNb2R1bGVFbmFibGVkKSB7XG4gICAgICBzd2lwZXJbcHJvcF0uZW5hYmxlKCk7XG4gICAgfVxuICB9KTtcbiAgY29uc3QgZGlyZWN0aW9uQ2hhbmdlZCA9IGJyZWFrcG9pbnRQYXJhbXMuZGlyZWN0aW9uICYmIGJyZWFrcG9pbnRQYXJhbXMuZGlyZWN0aW9uICE9PSBwYXJhbXMuZGlyZWN0aW9uO1xuICBjb25zdCBuZWVkc1JlTG9vcCA9IHBhcmFtcy5sb29wICYmIChicmVha3BvaW50UGFyYW1zLnNsaWRlc1BlclZpZXcgIT09IHBhcmFtcy5zbGlkZXNQZXJWaWV3IHx8IGRpcmVjdGlvbkNoYW5nZWQpO1xuICBjb25zdCB3YXNMb29wID0gcGFyYW1zLmxvb3A7XG4gIGlmIChkaXJlY3Rpb25DaGFuZ2VkICYmIGluaXRpYWxpemVkKSB7XG4gICAgc3dpcGVyLmNoYW5nZURpcmVjdGlvbigpO1xuICB9XG4gIGV4dGVuZChzd2lwZXIucGFyYW1zLCBicmVha3BvaW50UGFyYW1zKTtcbiAgY29uc3QgaXNFbmFibGVkID0gc3dpcGVyLnBhcmFtcy5lbmFibGVkO1xuICBjb25zdCBoYXNMb29wID0gc3dpcGVyLnBhcmFtcy5sb29wO1xuICBPYmplY3QuYXNzaWduKHN3aXBlciwge1xuICAgIGFsbG93VG91Y2hNb3ZlOiBzd2lwZXIucGFyYW1zLmFsbG93VG91Y2hNb3ZlLFxuICAgIGFsbG93U2xpZGVOZXh0OiBzd2lwZXIucGFyYW1zLmFsbG93U2xpZGVOZXh0LFxuICAgIGFsbG93U2xpZGVQcmV2OiBzd2lwZXIucGFyYW1zLmFsbG93U2xpZGVQcmV2XG4gIH0pO1xuICBpZiAod2FzRW5hYmxlZCAmJiAhaXNFbmFibGVkKSB7XG4gICAgc3dpcGVyLmRpc2FibGUoKTtcbiAgfSBlbHNlIGlmICghd2FzRW5hYmxlZCAmJiBpc0VuYWJsZWQpIHtcbiAgICBzd2lwZXIuZW5hYmxlKCk7XG4gIH1cbiAgc3dpcGVyLmN1cnJlbnRCcmVha3BvaW50ID0gYnJlYWtwb2ludDtcbiAgc3dpcGVyLmVtaXQoJ19iZWZvcmVCcmVha3BvaW50JywgYnJlYWtwb2ludFBhcmFtcyk7XG4gIGlmIChpbml0aWFsaXplZCkge1xuICAgIGlmIChuZWVkc1JlTG9vcCkge1xuICAgICAgc3dpcGVyLmxvb3BEZXN0cm95KCk7XG4gICAgICBzd2lwZXIubG9vcENyZWF0ZShyZWFsSW5kZXgpO1xuICAgICAgc3dpcGVyLnVwZGF0ZVNsaWRlcygpO1xuICAgIH0gZWxzZSBpZiAoIXdhc0xvb3AgJiYgaGFzTG9vcCkge1xuICAgICAgc3dpcGVyLmxvb3BDcmVhdGUocmVhbEluZGV4KTtcbiAgICAgIHN3aXBlci51cGRhdGVTbGlkZXMoKTtcbiAgICB9IGVsc2UgaWYgKHdhc0xvb3AgJiYgIWhhc0xvb3ApIHtcbiAgICAgIHN3aXBlci5sb29wRGVzdHJveSgpO1xuICAgIH1cbiAgfVxuICBzd2lwZXIuZW1pdCgnYnJlYWtwb2ludCcsIGJyZWFrcG9pbnRQYXJhbXMpO1xufVxuXG5mdW5jdGlvbiBnZXRCcmVha3BvaW50KGJyZWFrcG9pbnRzLCBiYXNlLCBjb250YWluZXJFbCkge1xuICBpZiAoYmFzZSA9PT0gdm9pZCAwKSB7XG4gICAgYmFzZSA9ICd3aW5kb3cnO1xuICB9XG4gIGlmICghYnJlYWtwb2ludHMgfHwgYmFzZSA9PT0gJ2NvbnRhaW5lcicgJiYgIWNvbnRhaW5lckVsKSByZXR1cm4gdW5kZWZpbmVkO1xuICBsZXQgYnJlYWtwb2ludCA9IGZhbHNlO1xuICBjb25zdCB3aW5kb3cgPSBnZXRXaW5kb3coKTtcbiAgY29uc3QgY3VycmVudEhlaWdodCA9IGJhc2UgPT09ICd3aW5kb3cnID8gd2luZG93LmlubmVySGVpZ2h0IDogY29udGFpbmVyRWwuY2xpZW50SGVpZ2h0O1xuICBjb25zdCBwb2ludHMgPSBPYmplY3Qua2V5cyhicmVha3BvaW50cykubWFwKHBvaW50ID0+IHtcbiAgICBpZiAodHlwZW9mIHBvaW50ID09PSAnc3RyaW5nJyAmJiBwb2ludC5pbmRleE9mKCdAJykgPT09IDApIHtcbiAgICAgIGNvbnN0IG1pblJhdGlvID0gcGFyc2VGbG9hdChwb2ludC5zdWJzdHIoMSkpO1xuICAgICAgY29uc3QgdmFsdWUgPSBjdXJyZW50SGVpZ2h0ICogbWluUmF0aW87XG4gICAgICByZXR1cm4ge1xuICAgICAgICB2YWx1ZSxcbiAgICAgICAgcG9pbnRcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICB2YWx1ZTogcG9pbnQsXG4gICAgICBwb2ludFxuICAgIH07XG4gIH0pO1xuICBwb2ludHMuc29ydCgoYSwgYikgPT4gcGFyc2VJbnQoYS52YWx1ZSwgMTApIC0gcGFyc2VJbnQoYi52YWx1ZSwgMTApKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb2ludHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICBjb25zdCB7XG4gICAgICBwb2ludCxcbiAgICAgIHZhbHVlXG4gICAgfSA9IHBvaW50c1tpXTtcbiAgICBpZiAoYmFzZSA9PT0gJ3dpbmRvdycpIHtcbiAgICAgIGlmICh3aW5kb3cubWF0Y2hNZWRpYShgKG1pbi13aWR0aDogJHt2YWx1ZX1weClgKS5tYXRjaGVzKSB7XG4gICAgICAgIGJyZWFrcG9pbnQgPSBwb2ludDtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHZhbHVlIDw9IGNvbnRhaW5lckVsLmNsaWVudFdpZHRoKSB7XG4gICAgICBicmVha3BvaW50ID0gcG9pbnQ7XG4gICAgfVxuICB9XG4gIHJldHVybiBicmVha3BvaW50IHx8ICdtYXgnO1xufVxuXG52YXIgYnJlYWtwb2ludHMgPSB7XG4gIHNldEJyZWFrcG9pbnQsXG4gIGdldEJyZWFrcG9pbnRcbn07XG5cbmZ1bmN0aW9uIHByZXBhcmVDbGFzc2VzKGVudHJpZXMsIHByZWZpeCkge1xuICBjb25zdCByZXN1bHRDbGFzc2VzID0gW107XG4gIGVudHJpZXMuZm9yRWFjaChpdGVtID0+IHtcbiAgICBpZiAodHlwZW9mIGl0ZW0gPT09ICdvYmplY3QnKSB7XG4gICAgICBPYmplY3Qua2V5cyhpdGVtKS5mb3JFYWNoKGNsYXNzTmFtZXMgPT4ge1xuICAgICAgICBpZiAoaXRlbVtjbGFzc05hbWVzXSkge1xuICAgICAgICAgIHJlc3VsdENsYXNzZXMucHVzaChwcmVmaXggKyBjbGFzc05hbWVzKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgaXRlbSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJlc3VsdENsYXNzZXMucHVzaChwcmVmaXggKyBpdGVtKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0Q2xhc3Nlcztcbn1cbmZ1bmN0aW9uIGFkZENsYXNzZXMoKSB7XG4gIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gIGNvbnN0IHtcbiAgICBjbGFzc05hbWVzLFxuICAgIHBhcmFtcyxcbiAgICBydGwsXG4gICAgZWwsXG4gICAgZGV2aWNlXG4gIH0gPSBzd2lwZXI7XG4gIC8vIHByZXR0aWVyLWlnbm9yZVxuICBjb25zdCBzdWZmaXhlcyA9IHByZXBhcmVDbGFzc2VzKFsnaW5pdGlhbGl6ZWQnLCBwYXJhbXMuZGlyZWN0aW9uLCB7XG4gICAgJ2ZyZWUtbW9kZSc6IHN3aXBlci5wYXJhbXMuZnJlZU1vZGUgJiYgcGFyYW1zLmZyZWVNb2RlLmVuYWJsZWRcbiAgfSwge1xuICAgICdhdXRvaGVpZ2h0JzogcGFyYW1zLmF1dG9IZWlnaHRcbiAgfSwge1xuICAgICdydGwnOiBydGxcbiAgfSwge1xuICAgICdncmlkJzogcGFyYW1zLmdyaWQgJiYgcGFyYW1zLmdyaWQucm93cyA+IDFcbiAgfSwge1xuICAgICdncmlkLWNvbHVtbic6IHBhcmFtcy5ncmlkICYmIHBhcmFtcy5ncmlkLnJvd3MgPiAxICYmIHBhcmFtcy5ncmlkLmZpbGwgPT09ICdjb2x1bW4nXG4gIH0sIHtcbiAgICAnYW5kcm9pZCc6IGRldmljZS5hbmRyb2lkXG4gIH0sIHtcbiAgICAnaW9zJzogZGV2aWNlLmlvc1xuICB9LCB7XG4gICAgJ2Nzcy1tb2RlJzogcGFyYW1zLmNzc01vZGVcbiAgfSwge1xuICAgICdjZW50ZXJlZCc6IHBhcmFtcy5jc3NNb2RlICYmIHBhcmFtcy5jZW50ZXJlZFNsaWRlc1xuICB9LCB7XG4gICAgJ3dhdGNoLXByb2dyZXNzJzogcGFyYW1zLndhdGNoU2xpZGVzUHJvZ3Jlc3NcbiAgfV0sIHBhcmFtcy5jb250YWluZXJNb2RpZmllckNsYXNzKTtcbiAgY2xhc3NOYW1lcy5wdXNoKC4uLnN1ZmZpeGVzKTtcbiAgZWwuY2xhc3NMaXN0LmFkZCguLi5jbGFzc05hbWVzKTtcbiAgc3dpcGVyLmVtaXRDb250YWluZXJDbGFzc2VzKCk7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUNsYXNzZXMoKSB7XG4gIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gIGNvbnN0IHtcbiAgICBlbCxcbiAgICBjbGFzc05hbWVzXG4gIH0gPSBzd2lwZXI7XG4gIGVsLmNsYXNzTGlzdC5yZW1vdmUoLi4uY2xhc3NOYW1lcyk7XG4gIHN3aXBlci5lbWl0Q29udGFpbmVyQ2xhc3NlcygpO1xufVxuXG52YXIgY2xhc3NlcyA9IHtcbiAgYWRkQ2xhc3NlcyxcbiAgcmVtb3ZlQ2xhc3Nlc1xufTtcblxuZnVuY3Rpb24gY2hlY2tPdmVyZmxvdygpIHtcbiAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgY29uc3Qge1xuICAgIGlzTG9ja2VkOiB3YXNMb2NrZWQsXG4gICAgcGFyYW1zXG4gIH0gPSBzd2lwZXI7XG4gIGNvbnN0IHtcbiAgICBzbGlkZXNPZmZzZXRCZWZvcmVcbiAgfSA9IHBhcmFtcztcbiAgaWYgKHNsaWRlc09mZnNldEJlZm9yZSkge1xuICAgIGNvbnN0IGxhc3RTbGlkZUluZGV4ID0gc3dpcGVyLnNsaWRlcy5sZW5ndGggLSAxO1xuICAgIGNvbnN0IGxhc3RTbGlkZVJpZ2h0RWRnZSA9IHN3aXBlci5zbGlkZXNHcmlkW2xhc3RTbGlkZUluZGV4XSArIHN3aXBlci5zbGlkZXNTaXplc0dyaWRbbGFzdFNsaWRlSW5kZXhdICsgc2xpZGVzT2Zmc2V0QmVmb3JlICogMjtcbiAgICBzd2lwZXIuaXNMb2NrZWQgPSBzd2lwZXIuc2l6ZSA+IGxhc3RTbGlkZVJpZ2h0RWRnZTtcbiAgfSBlbHNlIHtcbiAgICBzd2lwZXIuaXNMb2NrZWQgPSBzd2lwZXIuc25hcEdyaWQubGVuZ3RoID09PSAxO1xuICB9XG4gIGlmIChwYXJhbXMuYWxsb3dTbGlkZU5leHQgPT09IHRydWUpIHtcbiAgICBzd2lwZXIuYWxsb3dTbGlkZU5leHQgPSAhc3dpcGVyLmlzTG9ja2VkO1xuICB9XG4gIGlmIChwYXJhbXMuYWxsb3dTbGlkZVByZXYgPT09IHRydWUpIHtcbiAgICBzd2lwZXIuYWxsb3dTbGlkZVByZXYgPSAhc3dpcGVyLmlzTG9ja2VkO1xuICB9XG4gIGlmICh3YXNMb2NrZWQgJiYgd2FzTG9ja2VkICE9PSBzd2lwZXIuaXNMb2NrZWQpIHtcbiAgICBzd2lwZXIuaXNFbmQgPSBmYWxzZTtcbiAgfVxuICBpZiAod2FzTG9ja2VkICE9PSBzd2lwZXIuaXNMb2NrZWQpIHtcbiAgICBzd2lwZXIuZW1pdChzd2lwZXIuaXNMb2NrZWQgPyAnbG9jaycgOiAndW5sb2NrJyk7XG4gIH1cbn1cbnZhciBjaGVja092ZXJmbG93JDEgPSB7XG4gIGNoZWNrT3ZlcmZsb3dcbn07XG5cbnZhciBkZWZhdWx0cyA9IHtcbiAgaW5pdDogdHJ1ZSxcbiAgZGlyZWN0aW9uOiAnaG9yaXpvbnRhbCcsXG4gIG9uZVdheU1vdmVtZW50OiBmYWxzZSxcbiAgdG91Y2hFdmVudHNUYXJnZXQ6ICd3cmFwcGVyJyxcbiAgaW5pdGlhbFNsaWRlOiAwLFxuICBzcGVlZDogMzAwLFxuICBjc3NNb2RlOiBmYWxzZSxcbiAgdXBkYXRlT25XaW5kb3dSZXNpemU6IHRydWUsXG4gIHJlc2l6ZU9ic2VydmVyOiB0cnVlLFxuICBuZXN0ZWQ6IGZhbHNlLFxuICBjcmVhdGVFbGVtZW50czogZmFsc2UsXG4gIGV2ZW50c1ByZWZpeDogJ3N3aXBlcicsXG4gIGVuYWJsZWQ6IHRydWUsXG4gIGZvY3VzYWJsZUVsZW1lbnRzOiAnaW5wdXQsIHNlbGVjdCwgb3B0aW9uLCB0ZXh0YXJlYSwgYnV0dG9uLCB2aWRlbywgbGFiZWwnLFxuICAvLyBPdmVycmlkZXNcbiAgd2lkdGg6IG51bGwsXG4gIGhlaWdodDogbnVsbCxcbiAgLy9cbiAgcHJldmVudEludGVyYWN0aW9uT25UcmFuc2l0aW9uOiBmYWxzZSxcbiAgLy8gc3NyXG4gIHVzZXJBZ2VudDogbnVsbCxcbiAgdXJsOiBudWxsLFxuICAvLyBUbyBzdXBwb3J0IGlPUydzIHN3aXBlLXRvLWdvLWJhY2sgZ2VzdHVyZSAod2hlbiBiZWluZyB1c2VkIGluLWFwcCkuXG4gIGVkZ2VTd2lwZURldGVjdGlvbjogZmFsc2UsXG4gIGVkZ2VTd2lwZVRocmVzaG9sZDogMjAsXG4gIC8vIEF1dG9oZWlnaHRcbiAgYXV0b0hlaWdodDogZmFsc2UsXG4gIC8vIFNldCB3cmFwcGVyIHdpZHRoXG4gIHNldFdyYXBwZXJTaXplOiBmYWxzZSxcbiAgLy8gVmlydHVhbCBUcmFuc2xhdGVcbiAgdmlydHVhbFRyYW5zbGF0ZTogZmFsc2UsXG4gIC8vIEVmZmVjdHNcbiAgZWZmZWN0OiAnc2xpZGUnLFxuICAvLyAnc2xpZGUnIG9yICdmYWRlJyBvciAnY3ViZScgb3IgJ2NvdmVyZmxvdycgb3IgJ2ZsaXAnXG5cbiAgLy8gQnJlYWtwb2ludHNcbiAgYnJlYWtwb2ludHM6IHVuZGVmaW5lZCxcbiAgYnJlYWtwb2ludHNCYXNlOiAnd2luZG93JyxcbiAgLy8gU2xpZGVzIGdyaWRcbiAgc3BhY2VCZXR3ZWVuOiAwLFxuICBzbGlkZXNQZXJWaWV3OiAxLFxuICBzbGlkZXNQZXJHcm91cDogMSxcbiAgc2xpZGVzUGVyR3JvdXBTa2lwOiAwLFxuICBzbGlkZXNQZXJHcm91cEF1dG86IGZhbHNlLFxuICBjZW50ZXJlZFNsaWRlczogZmFsc2UsXG4gIGNlbnRlcmVkU2xpZGVzQm91bmRzOiBmYWxzZSxcbiAgc2xpZGVzT2Zmc2V0QmVmb3JlOiAwLFxuICAvLyBpbiBweFxuICBzbGlkZXNPZmZzZXRBZnRlcjogMCxcbiAgLy8gaW4gcHhcbiAgbm9ybWFsaXplU2xpZGVJbmRleDogdHJ1ZSxcbiAgY2VudGVySW5zdWZmaWNpZW50U2xpZGVzOiBmYWxzZSxcbiAgLy8gRGlzYWJsZSBzd2lwZXIgYW5kIGhpZGUgbmF2aWdhdGlvbiB3aGVuIGNvbnRhaW5lciBub3Qgb3ZlcmZsb3dcbiAgd2F0Y2hPdmVyZmxvdzogdHJ1ZSxcbiAgLy8gUm91bmQgbGVuZ3RoXG4gIHJvdW5kTGVuZ3RoczogZmFsc2UsXG4gIC8vIFRvdWNoZXNcbiAgdG91Y2hSYXRpbzogMSxcbiAgdG91Y2hBbmdsZTogNDUsXG4gIHNpbXVsYXRlVG91Y2g6IHRydWUsXG4gIHNob3J0U3dpcGVzOiB0cnVlLFxuICBsb25nU3dpcGVzOiB0cnVlLFxuICBsb25nU3dpcGVzUmF0aW86IDAuNSxcbiAgbG9uZ1N3aXBlc01zOiAzMDAsXG4gIGZvbGxvd0ZpbmdlcjogdHJ1ZSxcbiAgYWxsb3dUb3VjaE1vdmU6IHRydWUsXG4gIHRocmVzaG9sZDogNSxcbiAgdG91Y2hNb3ZlU3RvcFByb3BhZ2F0aW9uOiBmYWxzZSxcbiAgdG91Y2hTdGFydFByZXZlbnREZWZhdWx0OiB0cnVlLFxuICB0b3VjaFN0YXJ0Rm9yY2VQcmV2ZW50RGVmYXVsdDogZmFsc2UsXG4gIHRvdWNoUmVsZWFzZU9uRWRnZXM6IGZhbHNlLFxuICAvLyBVbmlxdWUgTmF2aWdhdGlvbiBFbGVtZW50c1xuICB1bmlxdWVOYXZFbGVtZW50czogdHJ1ZSxcbiAgLy8gUmVzaXN0YW5jZVxuICByZXNpc3RhbmNlOiB0cnVlLFxuICByZXNpc3RhbmNlUmF0aW86IDAuODUsXG4gIC8vIFByb2dyZXNzXG4gIHdhdGNoU2xpZGVzUHJvZ3Jlc3M6IGZhbHNlLFxuICAvLyBDdXJzb3JcbiAgZ3JhYkN1cnNvcjogZmFsc2UsXG4gIC8vIENsaWNrc1xuICBwcmV2ZW50Q2xpY2tzOiB0cnVlLFxuICBwcmV2ZW50Q2xpY2tzUHJvcGFnYXRpb246IHRydWUsXG4gIHNsaWRlVG9DbGlja2VkU2xpZGU6IGZhbHNlLFxuICAvLyBsb29wXG4gIGxvb3A6IGZhbHNlLFxuICBsb29wQWRkQmxhbmtTbGlkZXM6IHRydWUsXG4gIGxvb3BBZGRpdGlvbmFsU2xpZGVzOiAwLFxuICBsb29wUHJldmVudHNTbGlkaW5nOiB0cnVlLFxuICAvLyByZXdpbmRcbiAgcmV3aW5kOiBmYWxzZSxcbiAgLy8gU3dpcGluZy9ubyBzd2lwaW5nXG4gIGFsbG93U2xpZGVQcmV2OiB0cnVlLFxuICBhbGxvd1NsaWRlTmV4dDogdHJ1ZSxcbiAgc3dpcGVIYW5kbGVyOiBudWxsLFxuICAvLyAnLnN3aXBlLWhhbmRsZXInLFxuICBub1N3aXBpbmc6IHRydWUsXG4gIG5vU3dpcGluZ0NsYXNzOiAnc3dpcGVyLW5vLXN3aXBpbmcnLFxuICBub1N3aXBpbmdTZWxlY3RvcjogbnVsbCxcbiAgLy8gUGFzc2l2ZSBMaXN0ZW5lcnNcbiAgcGFzc2l2ZUxpc3RlbmVyczogdHJ1ZSxcbiAgbWF4QmFja2ZhY2VIaWRkZW5TbGlkZXM6IDEwLFxuICAvLyBOU1xuICBjb250YWluZXJNb2RpZmllckNsYXNzOiAnc3dpcGVyLScsXG4gIC8vIE5FV1xuICBzbGlkZUNsYXNzOiAnc3dpcGVyLXNsaWRlJyxcbiAgc2xpZGVCbGFua0NsYXNzOiAnc3dpcGVyLXNsaWRlLWJsYW5rJyxcbiAgc2xpZGVBY3RpdmVDbGFzczogJ3N3aXBlci1zbGlkZS1hY3RpdmUnLFxuICBzbGlkZVZpc2libGVDbGFzczogJ3N3aXBlci1zbGlkZS12aXNpYmxlJyxcbiAgc2xpZGVGdWxseVZpc2libGVDbGFzczogJ3N3aXBlci1zbGlkZS1mdWxseS12aXNpYmxlJyxcbiAgc2xpZGVOZXh0Q2xhc3M6ICdzd2lwZXItc2xpZGUtbmV4dCcsXG4gIHNsaWRlUHJldkNsYXNzOiAnc3dpcGVyLXNsaWRlLXByZXYnLFxuICB3cmFwcGVyQ2xhc3M6ICdzd2lwZXItd3JhcHBlcicsXG4gIGxhenlQcmVsb2FkZXJDbGFzczogJ3N3aXBlci1sYXp5LXByZWxvYWRlcicsXG4gIGxhenlQcmVsb2FkUHJldk5leHQ6IDAsXG4gIC8vIENhbGxiYWNrc1xuICBydW5DYWxsYmFja3NPbkluaXQ6IHRydWUsXG4gIC8vIEludGVybmFsc1xuICBfZW1pdENsYXNzZXM6IGZhbHNlXG59O1xuXG5mdW5jdGlvbiBtb2R1bGVFeHRlbmRQYXJhbXMocGFyYW1zLCBhbGxNb2R1bGVzUGFyYW1zKSB7XG4gIHJldHVybiBmdW5jdGlvbiBleHRlbmRQYXJhbXMob2JqKSB7XG4gICAgaWYgKG9iaiA9PT0gdm9pZCAwKSB7XG4gICAgICBvYmogPSB7fTtcbiAgICB9XG4gICAgY29uc3QgbW9kdWxlUGFyYW1OYW1lID0gT2JqZWN0LmtleXMob2JqKVswXTtcbiAgICBjb25zdCBtb2R1bGVQYXJhbXMgPSBvYmpbbW9kdWxlUGFyYW1OYW1lXTtcbiAgICBpZiAodHlwZW9mIG1vZHVsZVBhcmFtcyAhPT0gJ29iamVjdCcgfHwgbW9kdWxlUGFyYW1zID09PSBudWxsKSB7XG4gICAgICBleHRlbmQoYWxsTW9kdWxlc1BhcmFtcywgb2JqKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHBhcmFtc1ttb2R1bGVQYXJhbU5hbWVdID09PSB0cnVlKSB7XG4gICAgICBwYXJhbXNbbW9kdWxlUGFyYW1OYW1lXSA9IHtcbiAgICAgICAgZW5hYmxlZDogdHJ1ZVxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKG1vZHVsZVBhcmFtTmFtZSA9PT0gJ25hdmlnYXRpb24nICYmIHBhcmFtc1ttb2R1bGVQYXJhbU5hbWVdICYmIHBhcmFtc1ttb2R1bGVQYXJhbU5hbWVdLmVuYWJsZWQgJiYgIXBhcmFtc1ttb2R1bGVQYXJhbU5hbWVdLnByZXZFbCAmJiAhcGFyYW1zW21vZHVsZVBhcmFtTmFtZV0ubmV4dEVsKSB7XG4gICAgICBwYXJhbXNbbW9kdWxlUGFyYW1OYW1lXS5hdXRvID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKFsncGFnaW5hdGlvbicsICdzY3JvbGxiYXInXS5pbmRleE9mKG1vZHVsZVBhcmFtTmFtZSkgPj0gMCAmJiBwYXJhbXNbbW9kdWxlUGFyYW1OYW1lXSAmJiBwYXJhbXNbbW9kdWxlUGFyYW1OYW1lXS5lbmFibGVkICYmICFwYXJhbXNbbW9kdWxlUGFyYW1OYW1lXS5lbCkge1xuICAgICAgcGFyYW1zW21vZHVsZVBhcmFtTmFtZV0uYXV0byA9IHRydWU7XG4gICAgfVxuICAgIGlmICghKG1vZHVsZVBhcmFtTmFtZSBpbiBwYXJhbXMgJiYgJ2VuYWJsZWQnIGluIG1vZHVsZVBhcmFtcykpIHtcbiAgICAgIGV4dGVuZChhbGxNb2R1bGVzUGFyYW1zLCBvYmopO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHBhcmFtc1ttb2R1bGVQYXJhbU5hbWVdID09PSAnb2JqZWN0JyAmJiAhKCdlbmFibGVkJyBpbiBwYXJhbXNbbW9kdWxlUGFyYW1OYW1lXSkpIHtcbiAgICAgIHBhcmFtc1ttb2R1bGVQYXJhbU5hbWVdLmVuYWJsZWQgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoIXBhcmFtc1ttb2R1bGVQYXJhbU5hbWVdKSBwYXJhbXNbbW9kdWxlUGFyYW1OYW1lXSA9IHtcbiAgICAgIGVuYWJsZWQ6IGZhbHNlXG4gICAgfTtcbiAgICBleHRlbmQoYWxsTW9kdWxlc1BhcmFtcywgb2JqKTtcbiAgfTtcbn1cblxuLyogZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOiBcIm9mZlwiICovXG5jb25zdCBwcm90b3R5cGVzID0ge1xuICBldmVudHNFbWl0dGVyLFxuICB1cGRhdGUsXG4gIHRyYW5zbGF0ZSxcbiAgdHJhbnNpdGlvbixcbiAgc2xpZGUsXG4gIGxvb3AsXG4gIGdyYWJDdXJzb3IsXG4gIGV2ZW50czogZXZlbnRzJDEsXG4gIGJyZWFrcG9pbnRzLFxuICBjaGVja092ZXJmbG93OiBjaGVja092ZXJmbG93JDEsXG4gIGNsYXNzZXNcbn07XG5jb25zdCBleHRlbmRlZERlZmF1bHRzID0ge307XG5jbGFzcyBTd2lwZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBsZXQgZWw7XG4gICAgbGV0IHBhcmFtcztcbiAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgIGFyZ3NbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgfVxuICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMSAmJiBhcmdzWzBdLmNvbnN0cnVjdG9yICYmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcmdzWzBdKS5zbGljZSg4LCAtMSkgPT09ICdPYmplY3QnKSB7XG4gICAgICBwYXJhbXMgPSBhcmdzWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICBbZWwsIHBhcmFtc10gPSBhcmdzO1xuICAgIH1cbiAgICBpZiAoIXBhcmFtcykgcGFyYW1zID0ge307XG4gICAgcGFyYW1zID0gZXh0ZW5kKHt9LCBwYXJhbXMpO1xuICAgIGlmIChlbCAmJiAhcGFyYW1zLmVsKSBwYXJhbXMuZWwgPSBlbDtcbiAgICBjb25zdCBkb2N1bWVudCA9IGdldERvY3VtZW50KCk7XG4gICAgaWYgKHBhcmFtcy5lbCAmJiB0eXBlb2YgcGFyYW1zLmVsID09PSAnc3RyaW5nJyAmJiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHBhcmFtcy5lbCkubGVuZ3RoID4gMSkge1xuICAgICAgY29uc3Qgc3dpcGVycyA9IFtdO1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChwYXJhbXMuZWwpLmZvckVhY2goY29udGFpbmVyRWwgPT4ge1xuICAgICAgICBjb25zdCBuZXdQYXJhbXMgPSBleHRlbmQoe30sIHBhcmFtcywge1xuICAgICAgICAgIGVsOiBjb250YWluZXJFbFxuICAgICAgICB9KTtcbiAgICAgICAgc3dpcGVycy5wdXNoKG5ldyBTd2lwZXIobmV3UGFyYW1zKSk7XG4gICAgICB9KTtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zdHJ1Y3Rvci1yZXR1cm5cbiAgICAgIHJldHVybiBzd2lwZXJzO1xuICAgIH1cblxuICAgIC8vIFN3aXBlciBJbnN0YW5jZVxuICAgIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gICAgc3dpcGVyLl9fc3dpcGVyX18gPSB0cnVlO1xuICAgIHN3aXBlci5zdXBwb3J0ID0gZ2V0U3VwcG9ydCgpO1xuICAgIHN3aXBlci5kZXZpY2UgPSBnZXREZXZpY2Uoe1xuICAgICAgdXNlckFnZW50OiBwYXJhbXMudXNlckFnZW50XG4gICAgfSk7XG4gICAgc3dpcGVyLmJyb3dzZXIgPSBnZXRCcm93c2VyKCk7XG4gICAgc3dpcGVyLmV2ZW50c0xpc3RlbmVycyA9IHt9O1xuICAgIHN3aXBlci5ldmVudHNBbnlMaXN0ZW5lcnMgPSBbXTtcbiAgICBzd2lwZXIubW9kdWxlcyA9IFsuLi5zd2lwZXIuX19tb2R1bGVzX19dO1xuICAgIGlmIChwYXJhbXMubW9kdWxlcyAmJiBBcnJheS5pc0FycmF5KHBhcmFtcy5tb2R1bGVzKSkge1xuICAgICAgc3dpcGVyLm1vZHVsZXMucHVzaCguLi5wYXJhbXMubW9kdWxlcyk7XG4gICAgfVxuICAgIGNvbnN0IGFsbE1vZHVsZXNQYXJhbXMgPSB7fTtcbiAgICBzd2lwZXIubW9kdWxlcy5mb3JFYWNoKG1vZCA9PiB7XG4gICAgICBtb2Qoe1xuICAgICAgICBwYXJhbXMsXG4gICAgICAgIHN3aXBlcixcbiAgICAgICAgZXh0ZW5kUGFyYW1zOiBtb2R1bGVFeHRlbmRQYXJhbXMocGFyYW1zLCBhbGxNb2R1bGVzUGFyYW1zKSxcbiAgICAgICAgb246IHN3aXBlci5vbi5iaW5kKHN3aXBlciksXG4gICAgICAgIG9uY2U6IHN3aXBlci5vbmNlLmJpbmQoc3dpcGVyKSxcbiAgICAgICAgb2ZmOiBzd2lwZXIub2ZmLmJpbmQoc3dpcGVyKSxcbiAgICAgICAgZW1pdDogc3dpcGVyLmVtaXQuYmluZChzd2lwZXIpXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vIEV4dGVuZCBkZWZhdWx0cyB3aXRoIG1vZHVsZXMgcGFyYW1zXG4gICAgY29uc3Qgc3dpcGVyUGFyYW1zID0gZXh0ZW5kKHt9LCBkZWZhdWx0cywgYWxsTW9kdWxlc1BhcmFtcyk7XG5cbiAgICAvLyBFeHRlbmQgZGVmYXVsdHMgd2l0aCBwYXNzZWQgcGFyYW1zXG4gICAgc3dpcGVyLnBhcmFtcyA9IGV4dGVuZCh7fSwgc3dpcGVyUGFyYW1zLCBleHRlbmRlZERlZmF1bHRzLCBwYXJhbXMpO1xuICAgIHN3aXBlci5vcmlnaW5hbFBhcmFtcyA9IGV4dGVuZCh7fSwgc3dpcGVyLnBhcmFtcyk7XG4gICAgc3dpcGVyLnBhc3NlZFBhcmFtcyA9IGV4dGVuZCh7fSwgcGFyYW1zKTtcblxuICAgIC8vIGFkZCBldmVudCBsaXN0ZW5lcnNcbiAgICBpZiAoc3dpcGVyLnBhcmFtcyAmJiBzd2lwZXIucGFyYW1zLm9uKSB7XG4gICAgICBPYmplY3Qua2V5cyhzd2lwZXIucGFyYW1zLm9uKS5mb3JFYWNoKGV2ZW50TmFtZSA9PiB7XG4gICAgICAgIHN3aXBlci5vbihldmVudE5hbWUsIHN3aXBlci5wYXJhbXMub25bZXZlbnROYW1lXSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKHN3aXBlci5wYXJhbXMgJiYgc3dpcGVyLnBhcmFtcy5vbkFueSkge1xuICAgICAgc3dpcGVyLm9uQW55KHN3aXBlci5wYXJhbXMub25BbnkpO1xuICAgIH1cblxuICAgIC8vIEV4dGVuZCBTd2lwZXJcbiAgICBPYmplY3QuYXNzaWduKHN3aXBlciwge1xuICAgICAgZW5hYmxlZDogc3dpcGVyLnBhcmFtcy5lbmFibGVkLFxuICAgICAgZWwsXG4gICAgICAvLyBDbGFzc2VzXG4gICAgICBjbGFzc05hbWVzOiBbXSxcbiAgICAgIC8vIFNsaWRlc1xuICAgICAgc2xpZGVzOiBbXSxcbiAgICAgIHNsaWRlc0dyaWQ6IFtdLFxuICAgICAgc25hcEdyaWQ6IFtdLFxuICAgICAgc2xpZGVzU2l6ZXNHcmlkOiBbXSxcbiAgICAgIC8vIGlzRGlyZWN0aW9uXG4gICAgICBpc0hvcml6b250YWwoKSB7XG4gICAgICAgIHJldHVybiBzd2lwZXIucGFyYW1zLmRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnO1xuICAgICAgfSxcbiAgICAgIGlzVmVydGljYWwoKSB7XG4gICAgICAgIHJldHVybiBzd2lwZXIucGFyYW1zLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJztcbiAgICAgIH0sXG4gICAgICAvLyBJbmRleGVzXG4gICAgICBhY3RpdmVJbmRleDogMCxcbiAgICAgIHJlYWxJbmRleDogMCxcbiAgICAgIC8vXG4gICAgICBpc0JlZ2lubmluZzogdHJ1ZSxcbiAgICAgIGlzRW5kOiBmYWxzZSxcbiAgICAgIC8vIFByb3BzXG4gICAgICB0cmFuc2xhdGU6IDAsXG4gICAgICBwcmV2aW91c1RyYW5zbGF0ZTogMCxcbiAgICAgIHByb2dyZXNzOiAwLFxuICAgICAgdmVsb2NpdHk6IDAsXG4gICAgICBhbmltYXRpbmc6IGZhbHNlLFxuICAgICAgY3NzT3ZlcmZsb3dBZGp1c3RtZW50KCkge1xuICAgICAgICAvLyBSZXR1cm5zIDAgdW5sZXNzIGB0cmFuc2xhdGVgIGlzID4gMioqMjNcbiAgICAgICAgLy8gU2hvdWxkIGJlIHN1YnRyYWN0ZWQgZnJvbSBjc3MgdmFsdWVzIHRvIHByZXZlbnQgb3ZlcmZsb3dcbiAgICAgICAgcmV0dXJuIE1hdGgudHJ1bmModGhpcy50cmFuc2xhdGUgLyAyICoqIDIzKSAqIDIgKiogMjM7XG4gICAgICB9LFxuICAgICAgLy8gTG9ja3NcbiAgICAgIGFsbG93U2xpZGVOZXh0OiBzd2lwZXIucGFyYW1zLmFsbG93U2xpZGVOZXh0LFxuICAgICAgYWxsb3dTbGlkZVByZXY6IHN3aXBlci5wYXJhbXMuYWxsb3dTbGlkZVByZXYsXG4gICAgICAvLyBUb3VjaCBFdmVudHNcbiAgICAgIHRvdWNoRXZlbnRzRGF0YToge1xuICAgICAgICBpc1RvdWNoZWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgaXNNb3ZlZDogdW5kZWZpbmVkLFxuICAgICAgICBhbGxvd1RvdWNoQ2FsbGJhY2tzOiB1bmRlZmluZWQsXG4gICAgICAgIHRvdWNoU3RhcnRUaW1lOiB1bmRlZmluZWQsXG4gICAgICAgIGlzU2Nyb2xsaW5nOiB1bmRlZmluZWQsXG4gICAgICAgIGN1cnJlbnRUcmFuc2xhdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgc3RhcnRUcmFuc2xhdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgYWxsb3dUaHJlc2hvbGRNb3ZlOiB1bmRlZmluZWQsXG4gICAgICAgIC8vIEZvcm0gZWxlbWVudHMgdG8gbWF0Y2hcbiAgICAgICAgZm9jdXNhYmxlRWxlbWVudHM6IHN3aXBlci5wYXJhbXMuZm9jdXNhYmxlRWxlbWVudHMsXG4gICAgICAgIC8vIExhc3QgY2xpY2sgdGltZVxuICAgICAgICBsYXN0Q2xpY2tUaW1lOiAwLFxuICAgICAgICBjbGlja1RpbWVvdXQ6IHVuZGVmaW5lZCxcbiAgICAgICAgLy8gVmVsb2NpdGllc1xuICAgICAgICB2ZWxvY2l0aWVzOiBbXSxcbiAgICAgICAgYWxsb3dNb21lbnR1bUJvdW5jZTogdW5kZWZpbmVkLFxuICAgICAgICBzdGFydE1vdmluZzogdW5kZWZpbmVkLFxuICAgICAgICBwb2ludGVySWQ6IG51bGwsXG4gICAgICAgIHRvdWNoSWQ6IG51bGxcbiAgICAgIH0sXG4gICAgICAvLyBDbGlja3NcbiAgICAgIGFsbG93Q2xpY2s6IHRydWUsXG4gICAgICAvLyBUb3VjaGVzXG4gICAgICBhbGxvd1RvdWNoTW92ZTogc3dpcGVyLnBhcmFtcy5hbGxvd1RvdWNoTW92ZSxcbiAgICAgIHRvdWNoZXM6IHtcbiAgICAgICAgc3RhcnRYOiAwLFxuICAgICAgICBzdGFydFk6IDAsXG4gICAgICAgIGN1cnJlbnRYOiAwLFxuICAgICAgICBjdXJyZW50WTogMCxcbiAgICAgICAgZGlmZjogMFxuICAgICAgfSxcbiAgICAgIC8vIEltYWdlc1xuICAgICAgaW1hZ2VzVG9Mb2FkOiBbXSxcbiAgICAgIGltYWdlc0xvYWRlZDogMFxuICAgIH0pO1xuICAgIHN3aXBlci5lbWl0KCdfc3dpcGVyJyk7XG5cbiAgICAvLyBJbml0XG4gICAgaWYgKHN3aXBlci5wYXJhbXMuaW5pdCkge1xuICAgICAgc3dpcGVyLmluaXQoKTtcbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYXBwIGluc3RhbmNlXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0cnVjdG9yLXJldHVyblxuICAgIHJldHVybiBzd2lwZXI7XG4gIH1cbiAgZ2V0RGlyZWN0aW9uTGFiZWwocHJvcGVydHkpIHtcbiAgICBpZiAodGhpcy5pc0hvcml6b250YWwoKSkge1xuICAgICAgcmV0dXJuIHByb3BlcnR5O1xuICAgIH1cbiAgICAvLyBwcmV0dGllci1pZ25vcmVcbiAgICByZXR1cm4ge1xuICAgICAgJ3dpZHRoJzogJ2hlaWdodCcsXG4gICAgICAnbWFyZ2luLXRvcCc6ICdtYXJnaW4tbGVmdCcsXG4gICAgICAnbWFyZ2luLWJvdHRvbSAnOiAnbWFyZ2luLXJpZ2h0JyxcbiAgICAgICdtYXJnaW4tbGVmdCc6ICdtYXJnaW4tdG9wJyxcbiAgICAgICdtYXJnaW4tcmlnaHQnOiAnbWFyZ2luLWJvdHRvbScsXG4gICAgICAncGFkZGluZy1sZWZ0JzogJ3BhZGRpbmctdG9wJyxcbiAgICAgICdwYWRkaW5nLXJpZ2h0JzogJ3BhZGRpbmctYm90dG9tJyxcbiAgICAgICdtYXJnaW5SaWdodCc6ICdtYXJnaW5Cb3R0b20nXG4gICAgfVtwcm9wZXJ0eV07XG4gIH1cbiAgZ2V0U2xpZGVJbmRleChzbGlkZUVsKSB7XG4gICAgY29uc3Qge1xuICAgICAgc2xpZGVzRWwsXG4gICAgICBwYXJhbXNcbiAgICB9ID0gdGhpcztcbiAgICBjb25zdCBzbGlkZXMgPSBlbGVtZW50Q2hpbGRyZW4oc2xpZGVzRWwsIGAuJHtwYXJhbXMuc2xpZGVDbGFzc30sIHN3aXBlci1zbGlkZWApO1xuICAgIGNvbnN0IGZpcnN0U2xpZGVJbmRleCA9IGVsZW1lbnRJbmRleChzbGlkZXNbMF0pO1xuICAgIHJldHVybiBlbGVtZW50SW5kZXgoc2xpZGVFbCkgLSBmaXJzdFNsaWRlSW5kZXg7XG4gIH1cbiAgZ2V0U2xpZGVJbmRleEJ5RGF0YShpbmRleCkge1xuICAgIHJldHVybiB0aGlzLmdldFNsaWRlSW5kZXgodGhpcy5zbGlkZXMuZmlsdGVyKHNsaWRlRWwgPT4gc2xpZGVFbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3dpcGVyLXNsaWRlLWluZGV4JykgKiAxID09PSBpbmRleClbMF0pO1xuICB9XG4gIHJlY2FsY1NsaWRlcygpIHtcbiAgICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICAgIGNvbnN0IHtcbiAgICAgIHNsaWRlc0VsLFxuICAgICAgcGFyYW1zXG4gICAgfSA9IHN3aXBlcjtcbiAgICBzd2lwZXIuc2xpZGVzID0gZWxlbWVudENoaWxkcmVuKHNsaWRlc0VsLCBgLiR7cGFyYW1zLnNsaWRlQ2xhc3N9LCBzd2lwZXItc2xpZGVgKTtcbiAgfVxuICBlbmFibGUoKSB7XG4gICAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgICBpZiAoc3dpcGVyLmVuYWJsZWQpIHJldHVybjtcbiAgICBzd2lwZXIuZW5hYmxlZCA9IHRydWU7XG4gICAgaWYgKHN3aXBlci5wYXJhbXMuZ3JhYkN1cnNvcikge1xuICAgICAgc3dpcGVyLnNldEdyYWJDdXJzb3IoKTtcbiAgICB9XG4gICAgc3dpcGVyLmVtaXQoJ2VuYWJsZScpO1xuICB9XG4gIGRpc2FibGUoKSB7XG4gICAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgICBpZiAoIXN3aXBlci5lbmFibGVkKSByZXR1cm47XG4gICAgc3dpcGVyLmVuYWJsZWQgPSBmYWxzZTtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5ncmFiQ3Vyc29yKSB7XG4gICAgICBzd2lwZXIudW5zZXRHcmFiQ3Vyc29yKCk7XG4gICAgfVxuICAgIHN3aXBlci5lbWl0KCdkaXNhYmxlJyk7XG4gIH1cbiAgc2V0UHJvZ3Jlc3MocHJvZ3Jlc3MsIHNwZWVkKSB7XG4gICAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgICBwcm9ncmVzcyA9IE1hdGgubWluKE1hdGgubWF4KHByb2dyZXNzLCAwKSwgMSk7XG4gICAgY29uc3QgbWluID0gc3dpcGVyLm1pblRyYW5zbGF0ZSgpO1xuICAgIGNvbnN0IG1heCA9IHN3aXBlci5tYXhUcmFuc2xhdGUoKTtcbiAgICBjb25zdCBjdXJyZW50ID0gKG1heCAtIG1pbikgKiBwcm9ncmVzcyArIG1pbjtcbiAgICBzd2lwZXIudHJhbnNsYXRlVG8oY3VycmVudCwgdHlwZW9mIHNwZWVkID09PSAndW5kZWZpbmVkJyA/IDAgOiBzcGVlZCk7XG4gICAgc3dpcGVyLnVwZGF0ZUFjdGl2ZUluZGV4KCk7XG4gICAgc3dpcGVyLnVwZGF0ZVNsaWRlc0NsYXNzZXMoKTtcbiAgfVxuICBlbWl0Q29udGFpbmVyQ2xhc3NlcygpIHtcbiAgICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICAgIGlmICghc3dpcGVyLnBhcmFtcy5fZW1pdENsYXNzZXMgfHwgIXN3aXBlci5lbCkgcmV0dXJuO1xuICAgIGNvbnN0IGNscyA9IHN3aXBlci5lbC5jbGFzc05hbWUuc3BsaXQoJyAnKS5maWx0ZXIoY2xhc3NOYW1lID0+IHtcbiAgICAgIHJldHVybiBjbGFzc05hbWUuaW5kZXhPZignc3dpcGVyJykgPT09IDAgfHwgY2xhc3NOYW1lLmluZGV4T2Yoc3dpcGVyLnBhcmFtcy5jb250YWluZXJNb2RpZmllckNsYXNzKSA9PT0gMDtcbiAgICB9KTtcbiAgICBzd2lwZXIuZW1pdCgnX2NvbnRhaW5lckNsYXNzZXMnLCBjbHMuam9pbignICcpKTtcbiAgfVxuICBnZXRTbGlkZUNsYXNzZXMoc2xpZGVFbCkge1xuICAgIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gICAgaWYgKHN3aXBlci5kZXN0cm95ZWQpIHJldHVybiAnJztcbiAgICByZXR1cm4gc2xpZGVFbC5jbGFzc05hbWUuc3BsaXQoJyAnKS5maWx0ZXIoY2xhc3NOYW1lID0+IHtcbiAgICAgIHJldHVybiBjbGFzc05hbWUuaW5kZXhPZignc3dpcGVyLXNsaWRlJykgPT09IDAgfHwgY2xhc3NOYW1lLmluZGV4T2Yoc3dpcGVyLnBhcmFtcy5zbGlkZUNsYXNzKSA9PT0gMDtcbiAgICB9KS5qb2luKCcgJyk7XG4gIH1cbiAgZW1pdFNsaWRlc0NsYXNzZXMoKSB7XG4gICAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgICBpZiAoIXN3aXBlci5wYXJhbXMuX2VtaXRDbGFzc2VzIHx8ICFzd2lwZXIuZWwpIHJldHVybjtcbiAgICBjb25zdCB1cGRhdGVzID0gW107XG4gICAgc3dpcGVyLnNsaWRlcy5mb3JFYWNoKHNsaWRlRWwgPT4ge1xuICAgICAgY29uc3QgY2xhc3NOYW1lcyA9IHN3aXBlci5nZXRTbGlkZUNsYXNzZXMoc2xpZGVFbCk7XG4gICAgICB1cGRhdGVzLnB1c2goe1xuICAgICAgICBzbGlkZUVsLFxuICAgICAgICBjbGFzc05hbWVzXG4gICAgICB9KTtcbiAgICAgIHN3aXBlci5lbWl0KCdfc2xpZGVDbGFzcycsIHNsaWRlRWwsIGNsYXNzTmFtZXMpO1xuICAgIH0pO1xuICAgIHN3aXBlci5lbWl0KCdfc2xpZGVDbGFzc2VzJywgdXBkYXRlcyk7XG4gIH1cbiAgc2xpZGVzUGVyVmlld0R5bmFtaWModmlldywgZXhhY3QpIHtcbiAgICBpZiAodmlldyA9PT0gdm9pZCAwKSB7XG4gICAgICB2aWV3ID0gJ2N1cnJlbnQnO1xuICAgIH1cbiAgICBpZiAoZXhhY3QgPT09IHZvaWQgMCkge1xuICAgICAgZXhhY3QgPSBmYWxzZTtcbiAgICB9XG4gICAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgICBjb25zdCB7XG4gICAgICBwYXJhbXMsXG4gICAgICBzbGlkZXMsXG4gICAgICBzbGlkZXNHcmlkLFxuICAgICAgc2xpZGVzU2l6ZXNHcmlkLFxuICAgICAgc2l6ZTogc3dpcGVyU2l6ZSxcbiAgICAgIGFjdGl2ZUluZGV4XG4gICAgfSA9IHN3aXBlcjtcbiAgICBsZXQgc3B2ID0gMTtcbiAgICBpZiAodHlwZW9mIHBhcmFtcy5zbGlkZXNQZXJWaWV3ID09PSAnbnVtYmVyJykgcmV0dXJuIHBhcmFtcy5zbGlkZXNQZXJWaWV3O1xuICAgIGlmIChwYXJhbXMuY2VudGVyZWRTbGlkZXMpIHtcbiAgICAgIGxldCBzbGlkZVNpemUgPSBzbGlkZXNbYWN0aXZlSW5kZXhdID8gc2xpZGVzW2FjdGl2ZUluZGV4XS5zd2lwZXJTbGlkZVNpemUgOiAwO1xuICAgICAgbGV0IGJyZWFrTG9vcDtcbiAgICAgIGZvciAobGV0IGkgPSBhY3RpdmVJbmRleCArIDE7IGkgPCBzbGlkZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgaWYgKHNsaWRlc1tpXSAmJiAhYnJlYWtMb29wKSB7XG4gICAgICAgICAgc2xpZGVTaXplICs9IHNsaWRlc1tpXS5zd2lwZXJTbGlkZVNpemU7XG4gICAgICAgICAgc3B2ICs9IDE7XG4gICAgICAgICAgaWYgKHNsaWRlU2l6ZSA+IHN3aXBlclNpemUpIGJyZWFrTG9vcCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZvciAobGV0IGkgPSBhY3RpdmVJbmRleCAtIDE7IGkgPj0gMDsgaSAtPSAxKSB7XG4gICAgICAgIGlmIChzbGlkZXNbaV0gJiYgIWJyZWFrTG9vcCkge1xuICAgICAgICAgIHNsaWRlU2l6ZSArPSBzbGlkZXNbaV0uc3dpcGVyU2xpZGVTaXplO1xuICAgICAgICAgIHNwdiArPSAxO1xuICAgICAgICAgIGlmIChzbGlkZVNpemUgPiBzd2lwZXJTaXplKSBicmVha0xvb3AgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgICAgaWYgKHZpZXcgPT09ICdjdXJyZW50Jykge1xuICAgICAgICBmb3IgKGxldCBpID0gYWN0aXZlSW5kZXggKyAxOyBpIDwgc2xpZGVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgY29uc3Qgc2xpZGVJblZpZXcgPSBleGFjdCA/IHNsaWRlc0dyaWRbaV0gKyBzbGlkZXNTaXplc0dyaWRbaV0gLSBzbGlkZXNHcmlkW2FjdGl2ZUluZGV4XSA8IHN3aXBlclNpemUgOiBzbGlkZXNHcmlkW2ldIC0gc2xpZGVzR3JpZFthY3RpdmVJbmRleF0gPCBzd2lwZXJTaXplO1xuICAgICAgICAgIGlmIChzbGlkZUluVmlldykge1xuICAgICAgICAgICAgc3B2ICs9IDE7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBwcmV2aW91c1xuICAgICAgICBmb3IgKGxldCBpID0gYWN0aXZlSW5kZXggLSAxOyBpID49IDA7IGkgLT0gMSkge1xuICAgICAgICAgIGNvbnN0IHNsaWRlSW5WaWV3ID0gc2xpZGVzR3JpZFthY3RpdmVJbmRleF0gLSBzbGlkZXNHcmlkW2ldIDwgc3dpcGVyU2l6ZTtcbiAgICAgICAgICBpZiAoc2xpZGVJblZpZXcpIHtcbiAgICAgICAgICAgIHNwdiArPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc3B2O1xuICB9XG4gIHVwZGF0ZSgpIHtcbiAgICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICAgIGlmICghc3dpcGVyIHx8IHN3aXBlci5kZXN0cm95ZWQpIHJldHVybjtcbiAgICBjb25zdCB7XG4gICAgICBzbmFwR3JpZCxcbiAgICAgIHBhcmFtc1xuICAgIH0gPSBzd2lwZXI7XG4gICAgLy8gQnJlYWtwb2ludHNcbiAgICBpZiAocGFyYW1zLmJyZWFrcG9pbnRzKSB7XG4gICAgICBzd2lwZXIuc2V0QnJlYWtwb2ludCgpO1xuICAgIH1cbiAgICBbLi4uc3dpcGVyLmVsLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tsb2FkaW5nPVwibGF6eVwiXScpXS5mb3JFYWNoKGltYWdlRWwgPT4ge1xuICAgICAgaWYgKGltYWdlRWwuY29tcGxldGUpIHtcbiAgICAgICAgcHJvY2Vzc0xhenlQcmVsb2FkZXIoc3dpcGVyLCBpbWFnZUVsKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBzd2lwZXIudXBkYXRlU2l6ZSgpO1xuICAgIHN3aXBlci51cGRhdGVTbGlkZXMoKTtcbiAgICBzd2lwZXIudXBkYXRlUHJvZ3Jlc3MoKTtcbiAgICBzd2lwZXIudXBkYXRlU2xpZGVzQ2xhc3NlcygpO1xuICAgIGZ1bmN0aW9uIHNldFRyYW5zbGF0ZSgpIHtcbiAgICAgIGNvbnN0IHRyYW5zbGF0ZVZhbHVlID0gc3dpcGVyLnJ0bFRyYW5zbGF0ZSA/IHN3aXBlci50cmFuc2xhdGUgKiAtMSA6IHN3aXBlci50cmFuc2xhdGU7XG4gICAgICBjb25zdCBuZXdUcmFuc2xhdGUgPSBNYXRoLm1pbihNYXRoLm1heCh0cmFuc2xhdGVWYWx1ZSwgc3dpcGVyLm1heFRyYW5zbGF0ZSgpKSwgc3dpcGVyLm1pblRyYW5zbGF0ZSgpKTtcbiAgICAgIHN3aXBlci5zZXRUcmFuc2xhdGUobmV3VHJhbnNsYXRlKTtcbiAgICAgIHN3aXBlci51cGRhdGVBY3RpdmVJbmRleCgpO1xuICAgICAgc3dpcGVyLnVwZGF0ZVNsaWRlc0NsYXNzZXMoKTtcbiAgICB9XG4gICAgbGV0IHRyYW5zbGF0ZWQ7XG4gICAgaWYgKHBhcmFtcy5mcmVlTW9kZSAmJiBwYXJhbXMuZnJlZU1vZGUuZW5hYmxlZCAmJiAhcGFyYW1zLmNzc01vZGUpIHtcbiAgICAgIHNldFRyYW5zbGF0ZSgpO1xuICAgICAgaWYgKHBhcmFtcy5hdXRvSGVpZ2h0KSB7XG4gICAgICAgIHN3aXBlci51cGRhdGVBdXRvSGVpZ2h0KCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICgocGFyYW1zLnNsaWRlc1BlclZpZXcgPT09ICdhdXRvJyB8fCBwYXJhbXMuc2xpZGVzUGVyVmlldyA+IDEpICYmIHN3aXBlci5pc0VuZCAmJiAhcGFyYW1zLmNlbnRlcmVkU2xpZGVzKSB7XG4gICAgICAgIGNvbnN0IHNsaWRlcyA9IHN3aXBlci52aXJ0dWFsICYmIHBhcmFtcy52aXJ0dWFsLmVuYWJsZWQgPyBzd2lwZXIudmlydHVhbC5zbGlkZXMgOiBzd2lwZXIuc2xpZGVzO1xuICAgICAgICB0cmFuc2xhdGVkID0gc3dpcGVyLnNsaWRlVG8oc2xpZGVzLmxlbmd0aCAtIDEsIDAsIGZhbHNlLCB0cnVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRyYW5zbGF0ZWQgPSBzd2lwZXIuc2xpZGVUbyhzd2lwZXIuYWN0aXZlSW5kZXgsIDAsIGZhbHNlLCB0cnVlKTtcbiAgICAgIH1cbiAgICAgIGlmICghdHJhbnNsYXRlZCkge1xuICAgICAgICBzZXRUcmFuc2xhdGUoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHBhcmFtcy53YXRjaE92ZXJmbG93ICYmIHNuYXBHcmlkICE9PSBzd2lwZXIuc25hcEdyaWQpIHtcbiAgICAgIHN3aXBlci5jaGVja092ZXJmbG93KCk7XG4gICAgfVxuICAgIHN3aXBlci5lbWl0KCd1cGRhdGUnKTtcbiAgfVxuICBjaGFuZ2VEaXJlY3Rpb24obmV3RGlyZWN0aW9uLCBuZWVkVXBkYXRlKSB7XG4gICAgaWYgKG5lZWRVcGRhdGUgPT09IHZvaWQgMCkge1xuICAgICAgbmVlZFVwZGF0ZSA9IHRydWU7XG4gICAgfVxuICAgIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gICAgY29uc3QgY3VycmVudERpcmVjdGlvbiA9IHN3aXBlci5wYXJhbXMuZGlyZWN0aW9uO1xuICAgIGlmICghbmV3RGlyZWN0aW9uKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICAgIG5ld0RpcmVjdGlvbiA9IGN1cnJlbnREaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJyA/ICd2ZXJ0aWNhbCcgOiAnaG9yaXpvbnRhbCc7XG4gICAgfVxuICAgIGlmIChuZXdEaXJlY3Rpb24gPT09IGN1cnJlbnREaXJlY3Rpb24gfHwgbmV3RGlyZWN0aW9uICE9PSAnaG9yaXpvbnRhbCcgJiYgbmV3RGlyZWN0aW9uICE9PSAndmVydGljYWwnKSB7XG4gICAgICByZXR1cm4gc3dpcGVyO1xuICAgIH1cbiAgICBzd2lwZXIuZWwuY2xhc3NMaXN0LnJlbW92ZShgJHtzd2lwZXIucGFyYW1zLmNvbnRhaW5lck1vZGlmaWVyQ2xhc3N9JHtjdXJyZW50RGlyZWN0aW9ufWApO1xuICAgIHN3aXBlci5lbC5jbGFzc0xpc3QuYWRkKGAke3N3aXBlci5wYXJhbXMuY29udGFpbmVyTW9kaWZpZXJDbGFzc30ke25ld0RpcmVjdGlvbn1gKTtcbiAgICBzd2lwZXIuZW1pdENvbnRhaW5lckNsYXNzZXMoKTtcbiAgICBzd2lwZXIucGFyYW1zLmRpcmVjdGlvbiA9IG5ld0RpcmVjdGlvbjtcbiAgICBzd2lwZXIuc2xpZGVzLmZvckVhY2goc2xpZGVFbCA9PiB7XG4gICAgICBpZiAobmV3RGlyZWN0aW9uID09PSAndmVydGljYWwnKSB7XG4gICAgICAgIHNsaWRlRWwuc3R5bGUud2lkdGggPSAnJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNsaWRlRWwuc3R5bGUuaGVpZ2h0ID0gJyc7XG4gICAgICB9XG4gICAgfSk7XG4gICAgc3dpcGVyLmVtaXQoJ2NoYW5nZURpcmVjdGlvbicpO1xuICAgIGlmIChuZWVkVXBkYXRlKSBzd2lwZXIudXBkYXRlKCk7XG4gICAgcmV0dXJuIHN3aXBlcjtcbiAgfVxuICBjaGFuZ2VMYW5ndWFnZURpcmVjdGlvbihkaXJlY3Rpb24pIHtcbiAgICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICAgIGlmIChzd2lwZXIucnRsICYmIGRpcmVjdGlvbiA9PT0gJ3J0bCcgfHwgIXN3aXBlci5ydGwgJiYgZGlyZWN0aW9uID09PSAnbHRyJykgcmV0dXJuO1xuICAgIHN3aXBlci5ydGwgPSBkaXJlY3Rpb24gPT09ICdydGwnO1xuICAgIHN3aXBlci5ydGxUcmFuc2xhdGUgPSBzd2lwZXIucGFyYW1zLmRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnICYmIHN3aXBlci5ydGw7XG4gICAgaWYgKHN3aXBlci5ydGwpIHtcbiAgICAgIHN3aXBlci5lbC5jbGFzc0xpc3QuYWRkKGAke3N3aXBlci5wYXJhbXMuY29udGFpbmVyTW9kaWZpZXJDbGFzc31ydGxgKTtcbiAgICAgIHN3aXBlci5lbC5kaXIgPSAncnRsJztcbiAgICB9IGVsc2Uge1xuICAgICAgc3dpcGVyLmVsLmNsYXNzTGlzdC5yZW1vdmUoYCR7c3dpcGVyLnBhcmFtcy5jb250YWluZXJNb2RpZmllckNsYXNzfXJ0bGApO1xuICAgICAgc3dpcGVyLmVsLmRpciA9ICdsdHInO1xuICAgIH1cbiAgICBzd2lwZXIudXBkYXRlKCk7XG4gIH1cbiAgbW91bnQoZWxlbWVudCkge1xuICAgIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gICAgaWYgKHN3aXBlci5tb3VudGVkKSByZXR1cm4gdHJ1ZTtcblxuICAgIC8vIEZpbmQgZWxcbiAgICBsZXQgZWwgPSBlbGVtZW50IHx8IHN3aXBlci5wYXJhbXMuZWw7XG4gICAgaWYgKHR5cGVvZiBlbCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbCk7XG4gICAgfVxuICAgIGlmICghZWwpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgZWwuc3dpcGVyID0gc3dpcGVyO1xuICAgIGlmIChlbC5wYXJlbnROb2RlICYmIGVsLnBhcmVudE5vZGUuaG9zdCAmJiBlbC5wYXJlbnROb2RlLmhvc3Qubm9kZU5hbWUgPT09ICdTV0lQRVItQ09OVEFJTkVSJykge1xuICAgICAgc3dpcGVyLmlzRWxlbWVudCA9IHRydWU7XG4gICAgfVxuICAgIGNvbnN0IGdldFdyYXBwZXJTZWxlY3RvciA9ICgpID0+IHtcbiAgICAgIHJldHVybiBgLiR7KHN3aXBlci5wYXJhbXMud3JhcHBlckNsYXNzIHx8ICcnKS50cmltKCkuc3BsaXQoJyAnKS5qb2luKCcuJyl9YDtcbiAgICB9O1xuICAgIGNvbnN0IGdldFdyYXBwZXIgPSAoKSA9PiB7XG4gICAgICBpZiAoZWwgJiYgZWwuc2hhZG93Um9vdCAmJiBlbC5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3IpIHtcbiAgICAgICAgY29uc3QgcmVzID0gZWwuc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yKGdldFdyYXBwZXJTZWxlY3RvcigpKTtcbiAgICAgICAgLy8gQ2hpbGRyZW4gbmVlZHMgdG8gcmV0dXJuIHNsb3QgaXRlbXNcbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgIH1cbiAgICAgIHJldHVybiBlbGVtZW50Q2hpbGRyZW4oZWwsIGdldFdyYXBwZXJTZWxlY3RvcigpKVswXTtcbiAgICB9O1xuICAgIC8vIEZpbmQgV3JhcHBlclxuICAgIGxldCB3cmFwcGVyRWwgPSBnZXRXcmFwcGVyKCk7XG4gICAgaWYgKCF3cmFwcGVyRWwgJiYgc3dpcGVyLnBhcmFtcy5jcmVhdGVFbGVtZW50cykge1xuICAgICAgd3JhcHBlckVsID0gY3JlYXRlRWxlbWVudCgnZGl2Jywgc3dpcGVyLnBhcmFtcy53cmFwcGVyQ2xhc3MpO1xuICAgICAgZWwuYXBwZW5kKHdyYXBwZXJFbCk7XG4gICAgICBlbGVtZW50Q2hpbGRyZW4oZWwsIGAuJHtzd2lwZXIucGFyYW1zLnNsaWRlQ2xhc3N9YCkuZm9yRWFjaChzbGlkZUVsID0+IHtcbiAgICAgICAgd3JhcHBlckVsLmFwcGVuZChzbGlkZUVsKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBPYmplY3QuYXNzaWduKHN3aXBlciwge1xuICAgICAgZWwsXG4gICAgICB3cmFwcGVyRWwsXG4gICAgICBzbGlkZXNFbDogc3dpcGVyLmlzRWxlbWVudCAmJiAhZWwucGFyZW50Tm9kZS5ob3N0LnNsaWRlU2xvdHMgPyBlbC5wYXJlbnROb2RlLmhvc3QgOiB3cmFwcGVyRWwsXG4gICAgICBob3N0RWw6IHN3aXBlci5pc0VsZW1lbnQgPyBlbC5wYXJlbnROb2RlLmhvc3QgOiBlbCxcbiAgICAgIG1vdW50ZWQ6IHRydWUsXG4gICAgICAvLyBSVExcbiAgICAgIHJ0bDogZWwuZGlyLnRvTG93ZXJDYXNlKCkgPT09ICdydGwnIHx8IGVsZW1lbnRTdHlsZShlbCwgJ2RpcmVjdGlvbicpID09PSAncnRsJyxcbiAgICAgIHJ0bFRyYW5zbGF0ZTogc3dpcGVyLnBhcmFtcy5kaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJyAmJiAoZWwuZGlyLnRvTG93ZXJDYXNlKCkgPT09ICdydGwnIHx8IGVsZW1lbnRTdHlsZShlbCwgJ2RpcmVjdGlvbicpID09PSAncnRsJyksXG4gICAgICB3cm9uZ1JUTDogZWxlbWVudFN0eWxlKHdyYXBwZXJFbCwgJ2Rpc3BsYXknKSA9PT0gJy13ZWJraXQtYm94J1xuICAgIH0pO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGluaXQoZWwpIHtcbiAgICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICAgIGlmIChzd2lwZXIuaW5pdGlhbGl6ZWQpIHJldHVybiBzd2lwZXI7XG4gICAgY29uc3QgbW91bnRlZCA9IHN3aXBlci5tb3VudChlbCk7XG4gICAgaWYgKG1vdW50ZWQgPT09IGZhbHNlKSByZXR1cm4gc3dpcGVyO1xuICAgIHN3aXBlci5lbWl0KCdiZWZvcmVJbml0Jyk7XG5cbiAgICAvLyBTZXQgYnJlYWtwb2ludFxuICAgIGlmIChzd2lwZXIucGFyYW1zLmJyZWFrcG9pbnRzKSB7XG4gICAgICBzd2lwZXIuc2V0QnJlYWtwb2ludCgpO1xuICAgIH1cblxuICAgIC8vIEFkZCBDbGFzc2VzXG4gICAgc3dpcGVyLmFkZENsYXNzZXMoKTtcblxuICAgIC8vIFVwZGF0ZSBzaXplXG4gICAgc3dpcGVyLnVwZGF0ZVNpemUoKTtcblxuICAgIC8vIFVwZGF0ZSBzbGlkZXNcbiAgICBzd2lwZXIudXBkYXRlU2xpZGVzKCk7XG4gICAgaWYgKHN3aXBlci5wYXJhbXMud2F0Y2hPdmVyZmxvdykge1xuICAgICAgc3dpcGVyLmNoZWNrT3ZlcmZsb3coKTtcbiAgICB9XG5cbiAgICAvLyBTZXQgR3JhYiBDdXJzb3JcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5ncmFiQ3Vyc29yICYmIHN3aXBlci5lbmFibGVkKSB7XG4gICAgICBzd2lwZXIuc2V0R3JhYkN1cnNvcigpO1xuICAgIH1cblxuICAgIC8vIFNsaWRlIFRvIEluaXRpYWwgU2xpZGVcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5sb29wICYmIHN3aXBlci52aXJ0dWFsICYmIHN3aXBlci5wYXJhbXMudmlydHVhbC5lbmFibGVkKSB7XG4gICAgICBzd2lwZXIuc2xpZGVUbyhzd2lwZXIucGFyYW1zLmluaXRpYWxTbGlkZSArIHN3aXBlci52aXJ0dWFsLnNsaWRlc0JlZm9yZSwgMCwgc3dpcGVyLnBhcmFtcy5ydW5DYWxsYmFja3NPbkluaXQsIGZhbHNlLCB0cnVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3dpcGVyLnNsaWRlVG8oc3dpcGVyLnBhcmFtcy5pbml0aWFsU2xpZGUsIDAsIHN3aXBlci5wYXJhbXMucnVuQ2FsbGJhY2tzT25Jbml0LCBmYWxzZSwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgLy8gQ3JlYXRlIGxvb3BcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5sb29wKSB7XG4gICAgICBzd2lwZXIubG9vcENyZWF0ZSgpO1xuICAgIH1cblxuICAgIC8vIEF0dGFjaCBldmVudHNcbiAgICBzd2lwZXIuYXR0YWNoRXZlbnRzKCk7XG4gICAgY29uc3QgbGF6eUVsZW1lbnRzID0gWy4uLnN3aXBlci5lbC5xdWVyeVNlbGVjdG9yQWxsKCdbbG9hZGluZz1cImxhenlcIl0nKV07XG4gICAgaWYgKHN3aXBlci5pc0VsZW1lbnQpIHtcbiAgICAgIGxhenlFbGVtZW50cy5wdXNoKC4uLnN3aXBlci5ob3N0RWwucXVlcnlTZWxlY3RvckFsbCgnW2xvYWRpbmc9XCJsYXp5XCJdJykpO1xuICAgIH1cbiAgICBsYXp5RWxlbWVudHMuZm9yRWFjaChpbWFnZUVsID0+IHtcbiAgICAgIGlmIChpbWFnZUVsLmNvbXBsZXRlKSB7XG4gICAgICAgIHByb2Nlc3NMYXp5UHJlbG9hZGVyKHN3aXBlciwgaW1hZ2VFbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbWFnZUVsLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBlID0+IHtcbiAgICAgICAgICBwcm9jZXNzTGF6eVByZWxvYWRlcihzd2lwZXIsIGUudGFyZ2V0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcHJlbG9hZChzd2lwZXIpO1xuXG4gICAgLy8gSW5pdCBGbGFnXG4gICAgc3dpcGVyLmluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICBwcmVsb2FkKHN3aXBlcik7XG5cbiAgICAvLyBFbWl0XG4gICAgc3dpcGVyLmVtaXQoJ2luaXQnKTtcbiAgICBzd2lwZXIuZW1pdCgnYWZ0ZXJJbml0Jyk7XG4gICAgcmV0dXJuIHN3aXBlcjtcbiAgfVxuICBkZXN0cm95KGRlbGV0ZUluc3RhbmNlLCBjbGVhblN0eWxlcykge1xuICAgIGlmIChkZWxldGVJbnN0YW5jZSA9PT0gdm9pZCAwKSB7XG4gICAgICBkZWxldGVJbnN0YW5jZSA9IHRydWU7XG4gICAgfVxuICAgIGlmIChjbGVhblN0eWxlcyA9PT0gdm9pZCAwKSB7XG4gICAgICBjbGVhblN0eWxlcyA9IHRydWU7XG4gICAgfVxuICAgIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gICAgY29uc3Qge1xuICAgICAgcGFyYW1zLFxuICAgICAgZWwsXG4gICAgICB3cmFwcGVyRWwsXG4gICAgICBzbGlkZXNcbiAgICB9ID0gc3dpcGVyO1xuICAgIGlmICh0eXBlb2Ygc3dpcGVyLnBhcmFtcyA9PT0gJ3VuZGVmaW5lZCcgfHwgc3dpcGVyLmRlc3Ryb3llZCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHN3aXBlci5lbWl0KCdiZWZvcmVEZXN0cm95Jyk7XG5cbiAgICAvLyBJbml0IEZsYWdcbiAgICBzd2lwZXIuaW5pdGlhbGl6ZWQgPSBmYWxzZTtcblxuICAgIC8vIERldGFjaCBldmVudHNcbiAgICBzd2lwZXIuZGV0YWNoRXZlbnRzKCk7XG5cbiAgICAvLyBEZXN0cm95IGxvb3BcbiAgICBpZiAocGFyYW1zLmxvb3ApIHtcbiAgICAgIHN3aXBlci5sb29wRGVzdHJveSgpO1xuICAgIH1cblxuICAgIC8vIENsZWFudXAgc3R5bGVzXG4gICAgaWYgKGNsZWFuU3R5bGVzKSB7XG4gICAgICBzd2lwZXIucmVtb3ZlQ2xhc3NlcygpO1xuICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKCdzdHlsZScpO1xuICAgICAgd3JhcHBlckVsLnJlbW92ZUF0dHJpYnV0ZSgnc3R5bGUnKTtcbiAgICAgIGlmIChzbGlkZXMgJiYgc2xpZGVzLmxlbmd0aCkge1xuICAgICAgICBzbGlkZXMuZm9yRWFjaChzbGlkZUVsID0+IHtcbiAgICAgICAgICBzbGlkZUVsLmNsYXNzTGlzdC5yZW1vdmUocGFyYW1zLnNsaWRlVmlzaWJsZUNsYXNzLCBwYXJhbXMuc2xpZGVGdWxseVZpc2libGVDbGFzcywgcGFyYW1zLnNsaWRlQWN0aXZlQ2xhc3MsIHBhcmFtcy5zbGlkZU5leHRDbGFzcywgcGFyYW1zLnNsaWRlUHJldkNsYXNzKTtcbiAgICAgICAgICBzbGlkZUVsLnJlbW92ZUF0dHJpYnV0ZSgnc3R5bGUnKTtcbiAgICAgICAgICBzbGlkZUVsLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1zd2lwZXItc2xpZGUtaW5kZXgnKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHN3aXBlci5lbWl0KCdkZXN0cm95Jyk7XG5cbiAgICAvLyBEZXRhY2ggZW1pdHRlciBldmVudHNcbiAgICBPYmplY3Qua2V5cyhzd2lwZXIuZXZlbnRzTGlzdGVuZXJzKS5mb3JFYWNoKGV2ZW50TmFtZSA9PiB7XG4gICAgICBzd2lwZXIub2ZmKGV2ZW50TmFtZSk7XG4gICAgfSk7XG4gICAgaWYgKGRlbGV0ZUluc3RhbmNlICE9PSBmYWxzZSkge1xuICAgICAgc3dpcGVyLmVsLnN3aXBlciA9IG51bGw7XG4gICAgICBkZWxldGVQcm9wcyhzd2lwZXIpO1xuICAgIH1cbiAgICBzd2lwZXIuZGVzdHJveWVkID0gdHJ1ZTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBzdGF0aWMgZXh0ZW5kRGVmYXVsdHMobmV3RGVmYXVsdHMpIHtcbiAgICBleHRlbmQoZXh0ZW5kZWREZWZhdWx0cywgbmV3RGVmYXVsdHMpO1xuICB9XG4gIHN0YXRpYyBnZXQgZXh0ZW5kZWREZWZhdWx0cygpIHtcbiAgICByZXR1cm4gZXh0ZW5kZWREZWZhdWx0cztcbiAgfVxuICBzdGF0aWMgZ2V0IGRlZmF1bHRzKCkge1xuICAgIHJldHVybiBkZWZhdWx0cztcbiAgfVxuICBzdGF0aWMgaW5zdGFsbE1vZHVsZShtb2QpIHtcbiAgICBpZiAoIVN3aXBlci5wcm90b3R5cGUuX19tb2R1bGVzX18pIFN3aXBlci5wcm90b3R5cGUuX19tb2R1bGVzX18gPSBbXTtcbiAgICBjb25zdCBtb2R1bGVzID0gU3dpcGVyLnByb3RvdHlwZS5fX21vZHVsZXNfXztcbiAgICBpZiAodHlwZW9mIG1vZCA9PT0gJ2Z1bmN0aW9uJyAmJiBtb2R1bGVzLmluZGV4T2YobW9kKSA8IDApIHtcbiAgICAgIG1vZHVsZXMucHVzaChtb2QpO1xuICAgIH1cbiAgfVxuICBzdGF0aWMgdXNlKG1vZHVsZSkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KG1vZHVsZSkpIHtcbiAgICAgIG1vZHVsZS5mb3JFYWNoKG0gPT4gU3dpcGVyLmluc3RhbGxNb2R1bGUobSkpO1xuICAgICAgcmV0dXJuIFN3aXBlcjtcbiAgICB9XG4gICAgU3dpcGVyLmluc3RhbGxNb2R1bGUobW9kdWxlKTtcbiAgICByZXR1cm4gU3dpcGVyO1xuICB9XG59XG5PYmplY3Qua2V5cyhwcm90b3R5cGVzKS5mb3JFYWNoKHByb3RvdHlwZUdyb3VwID0+IHtcbiAgT2JqZWN0LmtleXMocHJvdG90eXBlc1twcm90b3R5cGVHcm91cF0pLmZvckVhY2gocHJvdG9NZXRob2QgPT4ge1xuICAgIFN3aXBlci5wcm90b3R5cGVbcHJvdG9NZXRob2RdID0gcHJvdG90eXBlc1twcm90b3R5cGVHcm91cF1bcHJvdG9NZXRob2RdO1xuICB9KTtcbn0pO1xuU3dpcGVyLnVzZShbUmVzaXplLCBPYnNlcnZlcl0pO1xuXG5leHBvcnQgeyBTd2lwZXIgYXMgUywgZGVmYXVsdHMgYXMgZCB9O1xuIiwiaW1wb3J0IHsgZyBhcyBnZXREb2N1bWVudCB9IGZyb20gJy4uL3NoYXJlZC9zc3Itd2luZG93LmVzbS5tanMnO1xuaW1wb3J0IHsgcyBhcyBzZXRDU1NQcm9wZXJ0eSwgZSBhcyBlbGVtZW50Q2hpbGRyZW4sIGMgYXMgY3JlYXRlRWxlbWVudCB9IGZyb20gJy4uL3NoYXJlZC91dGlscy5tanMnO1xuXG5mdW5jdGlvbiBWaXJ0dWFsKF9yZWYpIHtcbiAgbGV0IHtcbiAgICBzd2lwZXIsXG4gICAgZXh0ZW5kUGFyYW1zLFxuICAgIG9uLFxuICAgIGVtaXRcbiAgfSA9IF9yZWY7XG4gIGV4dGVuZFBhcmFtcyh7XG4gICAgdmlydHVhbDoge1xuICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICBzbGlkZXM6IFtdLFxuICAgICAgY2FjaGU6IHRydWUsXG4gICAgICByZW5kZXJTbGlkZTogbnVsbCxcbiAgICAgIHJlbmRlckV4dGVybmFsOiBudWxsLFxuICAgICAgcmVuZGVyRXh0ZXJuYWxVcGRhdGU6IHRydWUsXG4gICAgICBhZGRTbGlkZXNCZWZvcmU6IDAsXG4gICAgICBhZGRTbGlkZXNBZnRlcjogMFxuICAgIH1cbiAgfSk7XG4gIGxldCBjc3NNb2RlVGltZW91dDtcbiAgY29uc3QgZG9jdW1lbnQgPSBnZXREb2N1bWVudCgpO1xuICBzd2lwZXIudmlydHVhbCA9IHtcbiAgICBjYWNoZToge30sXG4gICAgZnJvbTogdW5kZWZpbmVkLFxuICAgIHRvOiB1bmRlZmluZWQsXG4gICAgc2xpZGVzOiBbXSxcbiAgICBvZmZzZXQ6IDAsXG4gICAgc2xpZGVzR3JpZDogW11cbiAgfTtcbiAgY29uc3QgdGVtcERPTSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBmdW5jdGlvbiByZW5kZXJTbGlkZShzbGlkZSwgaW5kZXgpIHtcbiAgICBjb25zdCBwYXJhbXMgPSBzd2lwZXIucGFyYW1zLnZpcnR1YWw7XG4gICAgaWYgKHBhcmFtcy5jYWNoZSAmJiBzd2lwZXIudmlydHVhbC5jYWNoZVtpbmRleF0pIHtcbiAgICAgIHJldHVybiBzd2lwZXIudmlydHVhbC5jYWNoZVtpbmRleF07XG4gICAgfVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgIGxldCBzbGlkZUVsO1xuICAgIGlmIChwYXJhbXMucmVuZGVyU2xpZGUpIHtcbiAgICAgIHNsaWRlRWwgPSBwYXJhbXMucmVuZGVyU2xpZGUuY2FsbChzd2lwZXIsIHNsaWRlLCBpbmRleCk7XG4gICAgICBpZiAodHlwZW9mIHNsaWRlRWwgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRlbXBET00uaW5uZXJIVE1MID0gc2xpZGVFbDtcbiAgICAgICAgc2xpZGVFbCA9IHRlbXBET00uY2hpbGRyZW5bMF07XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChzd2lwZXIuaXNFbGVtZW50KSB7XG4gICAgICBzbGlkZUVsID0gY3JlYXRlRWxlbWVudCgnc3dpcGVyLXNsaWRlJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNsaWRlRWwgPSBjcmVhdGVFbGVtZW50KCdkaXYnLCBzd2lwZXIucGFyYW1zLnNsaWRlQ2xhc3MpO1xuICAgIH1cbiAgICBzbGlkZUVsLnNldEF0dHJpYnV0ZSgnZGF0YS1zd2lwZXItc2xpZGUtaW5kZXgnLCBpbmRleCk7XG4gICAgaWYgKCFwYXJhbXMucmVuZGVyU2xpZGUpIHtcbiAgICAgIHNsaWRlRWwuaW5uZXJIVE1MID0gc2xpZGU7XG4gICAgfVxuICAgIGlmIChwYXJhbXMuY2FjaGUpIHtcbiAgICAgIHN3aXBlci52aXJ0dWFsLmNhY2hlW2luZGV4XSA9IHNsaWRlRWw7XG4gICAgfVxuICAgIHJldHVybiBzbGlkZUVsO1xuICB9XG4gIGZ1bmN0aW9uIHVwZGF0ZShmb3JjZSkge1xuICAgIGNvbnN0IHtcbiAgICAgIHNsaWRlc1BlclZpZXcsXG4gICAgICBzbGlkZXNQZXJHcm91cCxcbiAgICAgIGNlbnRlcmVkU2xpZGVzLFxuICAgICAgbG9vcDogaXNMb29wXG4gICAgfSA9IHN3aXBlci5wYXJhbXM7XG4gICAgY29uc3Qge1xuICAgICAgYWRkU2xpZGVzQmVmb3JlLFxuICAgICAgYWRkU2xpZGVzQWZ0ZXJcbiAgICB9ID0gc3dpcGVyLnBhcmFtcy52aXJ0dWFsO1xuICAgIGNvbnN0IHtcbiAgICAgIGZyb206IHByZXZpb3VzRnJvbSxcbiAgICAgIHRvOiBwcmV2aW91c1RvLFxuICAgICAgc2xpZGVzLFxuICAgICAgc2xpZGVzR3JpZDogcHJldmlvdXNTbGlkZXNHcmlkLFxuICAgICAgb2Zmc2V0OiBwcmV2aW91c09mZnNldFxuICAgIH0gPSBzd2lwZXIudmlydHVhbDtcbiAgICBpZiAoIXN3aXBlci5wYXJhbXMuY3NzTW9kZSkge1xuICAgICAgc3dpcGVyLnVwZGF0ZUFjdGl2ZUluZGV4KCk7XG4gICAgfVxuICAgIGNvbnN0IGFjdGl2ZUluZGV4ID0gc3dpcGVyLmFjdGl2ZUluZGV4IHx8IDA7XG4gICAgbGV0IG9mZnNldFByb3A7XG4gICAgaWYgKHN3aXBlci5ydGxUcmFuc2xhdGUpIG9mZnNldFByb3AgPSAncmlnaHQnO2Vsc2Ugb2Zmc2V0UHJvcCA9IHN3aXBlci5pc0hvcml6b250YWwoKSA/ICdsZWZ0JyA6ICd0b3AnO1xuICAgIGxldCBzbGlkZXNBZnRlcjtcbiAgICBsZXQgc2xpZGVzQmVmb3JlO1xuICAgIGlmIChjZW50ZXJlZFNsaWRlcykge1xuICAgICAgc2xpZGVzQWZ0ZXIgPSBNYXRoLmZsb29yKHNsaWRlc1BlclZpZXcgLyAyKSArIHNsaWRlc1Blckdyb3VwICsgYWRkU2xpZGVzQWZ0ZXI7XG4gICAgICBzbGlkZXNCZWZvcmUgPSBNYXRoLmZsb29yKHNsaWRlc1BlclZpZXcgLyAyKSArIHNsaWRlc1Blckdyb3VwICsgYWRkU2xpZGVzQmVmb3JlO1xuICAgIH0gZWxzZSB7XG4gICAgICBzbGlkZXNBZnRlciA9IHNsaWRlc1BlclZpZXcgKyAoc2xpZGVzUGVyR3JvdXAgLSAxKSArIGFkZFNsaWRlc0FmdGVyO1xuICAgICAgc2xpZGVzQmVmb3JlID0gKGlzTG9vcCA/IHNsaWRlc1BlclZpZXcgOiBzbGlkZXNQZXJHcm91cCkgKyBhZGRTbGlkZXNCZWZvcmU7XG4gICAgfVxuICAgIGxldCBmcm9tID0gYWN0aXZlSW5kZXggLSBzbGlkZXNCZWZvcmU7XG4gICAgbGV0IHRvID0gYWN0aXZlSW5kZXggKyBzbGlkZXNBZnRlcjtcbiAgICBpZiAoIWlzTG9vcCkge1xuICAgICAgZnJvbSA9IE1hdGgubWF4KGZyb20sIDApO1xuICAgICAgdG8gPSBNYXRoLm1pbih0bywgc2xpZGVzLmxlbmd0aCAtIDEpO1xuICAgIH1cbiAgICBsZXQgb2Zmc2V0ID0gKHN3aXBlci5zbGlkZXNHcmlkW2Zyb21dIHx8IDApIC0gKHN3aXBlci5zbGlkZXNHcmlkWzBdIHx8IDApO1xuICAgIGlmIChpc0xvb3AgJiYgYWN0aXZlSW5kZXggPj0gc2xpZGVzQmVmb3JlKSB7XG4gICAgICBmcm9tIC09IHNsaWRlc0JlZm9yZTtcbiAgICAgIGlmICghY2VudGVyZWRTbGlkZXMpIG9mZnNldCArPSBzd2lwZXIuc2xpZGVzR3JpZFswXTtcbiAgICB9IGVsc2UgaWYgKGlzTG9vcCAmJiBhY3RpdmVJbmRleCA8IHNsaWRlc0JlZm9yZSkge1xuICAgICAgZnJvbSA9IC1zbGlkZXNCZWZvcmU7XG4gICAgICBpZiAoY2VudGVyZWRTbGlkZXMpIG9mZnNldCArPSBzd2lwZXIuc2xpZGVzR3JpZFswXTtcbiAgICB9XG4gICAgT2JqZWN0LmFzc2lnbihzd2lwZXIudmlydHVhbCwge1xuICAgICAgZnJvbSxcbiAgICAgIHRvLFxuICAgICAgb2Zmc2V0LFxuICAgICAgc2xpZGVzR3JpZDogc3dpcGVyLnNsaWRlc0dyaWQsXG4gICAgICBzbGlkZXNCZWZvcmUsXG4gICAgICBzbGlkZXNBZnRlclxuICAgIH0pO1xuICAgIGZ1bmN0aW9uIG9uUmVuZGVyZWQoKSB7XG4gICAgICBzd2lwZXIudXBkYXRlU2xpZGVzKCk7XG4gICAgICBzd2lwZXIudXBkYXRlUHJvZ3Jlc3MoKTtcbiAgICAgIHN3aXBlci51cGRhdGVTbGlkZXNDbGFzc2VzKCk7XG4gICAgICBlbWl0KCd2aXJ0dWFsVXBkYXRlJyk7XG4gICAgfVxuICAgIGlmIChwcmV2aW91c0Zyb20gPT09IGZyb20gJiYgcHJldmlvdXNUbyA9PT0gdG8gJiYgIWZvcmNlKSB7XG4gICAgICBpZiAoc3dpcGVyLnNsaWRlc0dyaWQgIT09IHByZXZpb3VzU2xpZGVzR3JpZCAmJiBvZmZzZXQgIT09IHByZXZpb3VzT2Zmc2V0KSB7XG4gICAgICAgIHN3aXBlci5zbGlkZXMuZm9yRWFjaChzbGlkZUVsID0+IHtcbiAgICAgICAgICBzbGlkZUVsLnN0eWxlW29mZnNldFByb3BdID0gYCR7b2Zmc2V0IC0gTWF0aC5hYnMoc3dpcGVyLmNzc092ZXJmbG93QWRqdXN0bWVudCgpKX1weGA7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgc3dpcGVyLnVwZGF0ZVByb2dyZXNzKCk7XG4gICAgICBlbWl0KCd2aXJ0dWFsVXBkYXRlJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChzd2lwZXIucGFyYW1zLnZpcnR1YWwucmVuZGVyRXh0ZXJuYWwpIHtcbiAgICAgIHN3aXBlci5wYXJhbXMudmlydHVhbC5yZW5kZXJFeHRlcm5hbC5jYWxsKHN3aXBlciwge1xuICAgICAgICBvZmZzZXQsXG4gICAgICAgIGZyb20sXG4gICAgICAgIHRvLFxuICAgICAgICBzbGlkZXM6IGZ1bmN0aW9uIGdldFNsaWRlcygpIHtcbiAgICAgICAgICBjb25zdCBzbGlkZXNUb1JlbmRlciA9IFtdO1xuICAgICAgICAgIGZvciAobGV0IGkgPSBmcm9tOyBpIDw9IHRvOyBpICs9IDEpIHtcbiAgICAgICAgICAgIHNsaWRlc1RvUmVuZGVyLnB1c2goc2xpZGVzW2ldKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHNsaWRlc1RvUmVuZGVyO1xuICAgICAgICB9KClcbiAgICAgIH0pO1xuICAgICAgaWYgKHN3aXBlci5wYXJhbXMudmlydHVhbC5yZW5kZXJFeHRlcm5hbFVwZGF0ZSkge1xuICAgICAgICBvblJlbmRlcmVkKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbWl0KCd2aXJ0dWFsVXBkYXRlJyk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHByZXBlbmRJbmRleGVzID0gW107XG4gICAgY29uc3QgYXBwZW5kSW5kZXhlcyA9IFtdO1xuICAgIGNvbnN0IGdldFNsaWRlSW5kZXggPSBpbmRleCA9PiB7XG4gICAgICBsZXQgc2xpZGVJbmRleCA9IGluZGV4O1xuICAgICAgaWYgKGluZGV4IDwgMCkge1xuICAgICAgICBzbGlkZUluZGV4ID0gc2xpZGVzLmxlbmd0aCArIGluZGV4O1xuICAgICAgfSBlbHNlIGlmIChzbGlkZUluZGV4ID49IHNsaWRlcy5sZW5ndGgpIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgICAgIHNsaWRlSW5kZXggPSBzbGlkZUluZGV4IC0gc2xpZGVzLmxlbmd0aDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzbGlkZUluZGV4O1xuICAgIH07XG4gICAgaWYgKGZvcmNlKSB7XG4gICAgICBzd2lwZXIuc2xpZGVzLmZpbHRlcihlbCA9PiBlbC5tYXRjaGVzKGAuJHtzd2lwZXIucGFyYW1zLnNsaWRlQ2xhc3N9LCBzd2lwZXItc2xpZGVgKSkuZm9yRWFjaChzbGlkZUVsID0+IHtcbiAgICAgICAgc2xpZGVFbC5yZW1vdmUoKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGxldCBpID0gcHJldmlvdXNGcm9tOyBpIDw9IHByZXZpb3VzVG87IGkgKz0gMSkge1xuICAgICAgICBpZiAoaSA8IGZyb20gfHwgaSA+IHRvKSB7XG4gICAgICAgICAgY29uc3Qgc2xpZGVJbmRleCA9IGdldFNsaWRlSW5kZXgoaSk7XG4gICAgICAgICAgc3dpcGVyLnNsaWRlcy5maWx0ZXIoZWwgPT4gZWwubWF0Y2hlcyhgLiR7c3dpcGVyLnBhcmFtcy5zbGlkZUNsYXNzfVtkYXRhLXN3aXBlci1zbGlkZS1pbmRleD1cIiR7c2xpZGVJbmRleH1cIl0sIHN3aXBlci1zbGlkZVtkYXRhLXN3aXBlci1zbGlkZS1pbmRleD1cIiR7c2xpZGVJbmRleH1cIl1gKSkuZm9yRWFjaChzbGlkZUVsID0+IHtcbiAgICAgICAgICAgIHNsaWRlRWwucmVtb3ZlKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgbG9vcEZyb20gPSBpc0xvb3AgPyAtc2xpZGVzLmxlbmd0aCA6IDA7XG4gICAgY29uc3QgbG9vcFRvID0gaXNMb29wID8gc2xpZGVzLmxlbmd0aCAqIDIgOiBzbGlkZXMubGVuZ3RoO1xuICAgIGZvciAobGV0IGkgPSBsb29wRnJvbTsgaSA8IGxvb3BUbzsgaSArPSAxKSB7XG4gICAgICBpZiAoaSA+PSBmcm9tICYmIGkgPD0gdG8pIHtcbiAgICAgICAgY29uc3Qgc2xpZGVJbmRleCA9IGdldFNsaWRlSW5kZXgoaSk7XG4gICAgICAgIGlmICh0eXBlb2YgcHJldmlvdXNUbyA9PT0gJ3VuZGVmaW5lZCcgfHwgZm9yY2UpIHtcbiAgICAgICAgICBhcHBlbmRJbmRleGVzLnB1c2goc2xpZGVJbmRleCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGkgPiBwcmV2aW91c1RvKSBhcHBlbmRJbmRleGVzLnB1c2goc2xpZGVJbmRleCk7XG4gICAgICAgICAgaWYgKGkgPCBwcmV2aW91c0Zyb20pIHByZXBlbmRJbmRleGVzLnB1c2goc2xpZGVJbmRleCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgYXBwZW5kSW5kZXhlcy5mb3JFYWNoKGluZGV4ID0+IHtcbiAgICAgIHN3aXBlci5zbGlkZXNFbC5hcHBlbmQocmVuZGVyU2xpZGUoc2xpZGVzW2luZGV4XSwgaW5kZXgpKTtcbiAgICB9KTtcbiAgICBpZiAoaXNMb29wKSB7XG4gICAgICBmb3IgKGxldCBpID0gcHJlcGVuZEluZGV4ZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpIC09IDEpIHtcbiAgICAgICAgY29uc3QgaW5kZXggPSBwcmVwZW5kSW5kZXhlc1tpXTtcbiAgICAgICAgc3dpcGVyLnNsaWRlc0VsLnByZXBlbmQocmVuZGVyU2xpZGUoc2xpZGVzW2luZGV4XSwgaW5kZXgpKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcHJlcGVuZEluZGV4ZXMuc29ydCgoYSwgYikgPT4gYiAtIGEpO1xuICAgICAgcHJlcGVuZEluZGV4ZXMuZm9yRWFjaChpbmRleCA9PiB7XG4gICAgICAgIHN3aXBlci5zbGlkZXNFbC5wcmVwZW5kKHJlbmRlclNsaWRlKHNsaWRlc1tpbmRleF0sIGluZGV4KSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgZWxlbWVudENoaWxkcmVuKHN3aXBlci5zbGlkZXNFbCwgJy5zd2lwZXItc2xpZGUsIHN3aXBlci1zbGlkZScpLmZvckVhY2goc2xpZGVFbCA9PiB7XG4gICAgICBzbGlkZUVsLnN0eWxlW29mZnNldFByb3BdID0gYCR7b2Zmc2V0IC0gTWF0aC5hYnMoc3dpcGVyLmNzc092ZXJmbG93QWRqdXN0bWVudCgpKX1weGA7XG4gICAgfSk7XG4gICAgb25SZW5kZXJlZCgpO1xuICB9XG4gIGZ1bmN0aW9uIGFwcGVuZFNsaWRlKHNsaWRlcykge1xuICAgIGlmICh0eXBlb2Ygc2xpZGVzID09PSAnb2JqZWN0JyAmJiAnbGVuZ3RoJyBpbiBzbGlkZXMpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2xpZGVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGlmIChzbGlkZXNbaV0pIHN3aXBlci52aXJ0dWFsLnNsaWRlcy5wdXNoKHNsaWRlc1tpXSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN3aXBlci52aXJ0dWFsLnNsaWRlcy5wdXNoKHNsaWRlcyk7XG4gICAgfVxuICAgIHVwZGF0ZSh0cnVlKTtcbiAgfVxuICBmdW5jdGlvbiBwcmVwZW5kU2xpZGUoc2xpZGVzKSB7XG4gICAgY29uc3QgYWN0aXZlSW5kZXggPSBzd2lwZXIuYWN0aXZlSW5kZXg7XG4gICAgbGV0IG5ld0FjdGl2ZUluZGV4ID0gYWN0aXZlSW5kZXggKyAxO1xuICAgIGxldCBudW1iZXJPZk5ld1NsaWRlcyA9IDE7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoc2xpZGVzKSkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzbGlkZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgaWYgKHNsaWRlc1tpXSkgc3dpcGVyLnZpcnR1YWwuc2xpZGVzLnVuc2hpZnQoc2xpZGVzW2ldKTtcbiAgICAgIH1cbiAgICAgIG5ld0FjdGl2ZUluZGV4ID0gYWN0aXZlSW5kZXggKyBzbGlkZXMubGVuZ3RoO1xuICAgICAgbnVtYmVyT2ZOZXdTbGlkZXMgPSBzbGlkZXMubGVuZ3RoO1xuICAgIH0gZWxzZSB7XG4gICAgICBzd2lwZXIudmlydHVhbC5zbGlkZXMudW5zaGlmdChzbGlkZXMpO1xuICAgIH1cbiAgICBpZiAoc3dpcGVyLnBhcmFtcy52aXJ0dWFsLmNhY2hlKSB7XG4gICAgICBjb25zdCBjYWNoZSA9IHN3aXBlci52aXJ0dWFsLmNhY2hlO1xuICAgICAgY29uc3QgbmV3Q2FjaGUgPSB7fTtcbiAgICAgIE9iamVjdC5rZXlzKGNhY2hlKS5mb3JFYWNoKGNhY2hlZEluZGV4ID0+IHtcbiAgICAgICAgY29uc3QgY2FjaGVkRWwgPSBjYWNoZVtjYWNoZWRJbmRleF07XG4gICAgICAgIGNvbnN0IGNhY2hlZEVsSW5kZXggPSBjYWNoZWRFbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3dpcGVyLXNsaWRlLWluZGV4Jyk7XG4gICAgICAgIGlmIChjYWNoZWRFbEluZGV4KSB7XG4gICAgICAgICAgY2FjaGVkRWwuc2V0QXR0cmlidXRlKCdkYXRhLXN3aXBlci1zbGlkZS1pbmRleCcsIHBhcnNlSW50KGNhY2hlZEVsSW5kZXgsIDEwKSArIG51bWJlck9mTmV3U2xpZGVzKTtcbiAgICAgICAgfVxuICAgICAgICBuZXdDYWNoZVtwYXJzZUludChjYWNoZWRJbmRleCwgMTApICsgbnVtYmVyT2ZOZXdTbGlkZXNdID0gY2FjaGVkRWw7XG4gICAgICB9KTtcbiAgICAgIHN3aXBlci52aXJ0dWFsLmNhY2hlID0gbmV3Q2FjaGU7XG4gICAgfVxuICAgIHVwZGF0ZSh0cnVlKTtcbiAgICBzd2lwZXIuc2xpZGVUbyhuZXdBY3RpdmVJbmRleCwgMCk7XG4gIH1cbiAgZnVuY3Rpb24gcmVtb3ZlU2xpZGUoc2xpZGVzSW5kZXhlcykge1xuICAgIGlmICh0eXBlb2Ygc2xpZGVzSW5kZXhlcyA9PT0gJ3VuZGVmaW5lZCcgfHwgc2xpZGVzSW5kZXhlcyA9PT0gbnVsbCkgcmV0dXJuO1xuICAgIGxldCBhY3RpdmVJbmRleCA9IHN3aXBlci5hY3RpdmVJbmRleDtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShzbGlkZXNJbmRleGVzKSkge1xuICAgICAgZm9yIChsZXQgaSA9IHNsaWRlc0luZGV4ZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpIC09IDEpIHtcbiAgICAgICAgaWYgKHN3aXBlci5wYXJhbXMudmlydHVhbC5jYWNoZSkge1xuICAgICAgICAgIGRlbGV0ZSBzd2lwZXIudmlydHVhbC5jYWNoZVtzbGlkZXNJbmRleGVzW2ldXTtcbiAgICAgICAgICAvLyBzaGlmdCBjYWNoZSBpbmRleGVzXG4gICAgICAgICAgT2JqZWN0LmtleXMoc3dpcGVyLnZpcnR1YWwuY2FjaGUpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgIGlmIChrZXkgPiBzbGlkZXNJbmRleGVzKSB7XG4gICAgICAgICAgICAgIHN3aXBlci52aXJ0dWFsLmNhY2hlW2tleSAtIDFdID0gc3dpcGVyLnZpcnR1YWwuY2FjaGVba2V5XTtcbiAgICAgICAgICAgICAgc3dpcGVyLnZpcnR1YWwuY2FjaGVba2V5IC0gMV0uc2V0QXR0cmlidXRlKCdkYXRhLXN3aXBlci1zbGlkZS1pbmRleCcsIGtleSAtIDEpO1xuICAgICAgICAgICAgICBkZWxldGUgc3dpcGVyLnZpcnR1YWwuY2FjaGVba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBzd2lwZXIudmlydHVhbC5zbGlkZXMuc3BsaWNlKHNsaWRlc0luZGV4ZXNbaV0sIDEpO1xuICAgICAgICBpZiAoc2xpZGVzSW5kZXhlc1tpXSA8IGFjdGl2ZUluZGV4KSBhY3RpdmVJbmRleCAtPSAxO1xuICAgICAgICBhY3RpdmVJbmRleCA9IE1hdGgubWF4KGFjdGl2ZUluZGV4LCAwKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHN3aXBlci5wYXJhbXMudmlydHVhbC5jYWNoZSkge1xuICAgICAgICBkZWxldGUgc3dpcGVyLnZpcnR1YWwuY2FjaGVbc2xpZGVzSW5kZXhlc107XG4gICAgICAgIC8vIHNoaWZ0IGNhY2hlIGluZGV4ZXNcbiAgICAgICAgT2JqZWN0LmtleXMoc3dpcGVyLnZpcnR1YWwuY2FjaGUpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICBpZiAoa2V5ID4gc2xpZGVzSW5kZXhlcykge1xuICAgICAgICAgICAgc3dpcGVyLnZpcnR1YWwuY2FjaGVba2V5IC0gMV0gPSBzd2lwZXIudmlydHVhbC5jYWNoZVtrZXldO1xuICAgICAgICAgICAgc3dpcGVyLnZpcnR1YWwuY2FjaGVba2V5IC0gMV0uc2V0QXR0cmlidXRlKCdkYXRhLXN3aXBlci1zbGlkZS1pbmRleCcsIGtleSAtIDEpO1xuICAgICAgICAgICAgZGVsZXRlIHN3aXBlci52aXJ0dWFsLmNhY2hlW2tleV07XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHN3aXBlci52aXJ0dWFsLnNsaWRlcy5zcGxpY2Uoc2xpZGVzSW5kZXhlcywgMSk7XG4gICAgICBpZiAoc2xpZGVzSW5kZXhlcyA8IGFjdGl2ZUluZGV4KSBhY3RpdmVJbmRleCAtPSAxO1xuICAgICAgYWN0aXZlSW5kZXggPSBNYXRoLm1heChhY3RpdmVJbmRleCwgMCk7XG4gICAgfVxuICAgIHVwZGF0ZSh0cnVlKTtcbiAgICBzd2lwZXIuc2xpZGVUbyhhY3RpdmVJbmRleCwgMCk7XG4gIH1cbiAgZnVuY3Rpb24gcmVtb3ZlQWxsU2xpZGVzKCkge1xuICAgIHN3aXBlci52aXJ0dWFsLnNsaWRlcyA9IFtdO1xuICAgIGlmIChzd2lwZXIucGFyYW1zLnZpcnR1YWwuY2FjaGUpIHtcbiAgICAgIHN3aXBlci52aXJ0dWFsLmNhY2hlID0ge307XG4gICAgfVxuICAgIHVwZGF0ZSh0cnVlKTtcbiAgICBzd2lwZXIuc2xpZGVUbygwLCAwKTtcbiAgfVxuICBvbignYmVmb3JlSW5pdCcsICgpID0+IHtcbiAgICBpZiAoIXN3aXBlci5wYXJhbXMudmlydHVhbC5lbmFibGVkKSByZXR1cm47XG4gICAgbGV0IGRvbVNsaWRlc0Fzc2lnbmVkO1xuICAgIGlmICh0eXBlb2Ygc3dpcGVyLnBhc3NlZFBhcmFtcy52aXJ0dWFsLnNsaWRlcyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbnN0IHNsaWRlcyA9IFsuLi5zd2lwZXIuc2xpZGVzRWwuY2hpbGRyZW5dLmZpbHRlcihlbCA9PiBlbC5tYXRjaGVzKGAuJHtzd2lwZXIucGFyYW1zLnNsaWRlQ2xhc3N9LCBzd2lwZXItc2xpZGVgKSk7XG4gICAgICBpZiAoc2xpZGVzICYmIHNsaWRlcy5sZW5ndGgpIHtcbiAgICAgICAgc3dpcGVyLnZpcnR1YWwuc2xpZGVzID0gWy4uLnNsaWRlc107XG4gICAgICAgIGRvbVNsaWRlc0Fzc2lnbmVkID0gdHJ1ZTtcbiAgICAgICAgc2xpZGVzLmZvckVhY2goKHNsaWRlRWwsIHNsaWRlSW5kZXgpID0+IHtcbiAgICAgICAgICBzbGlkZUVsLnNldEF0dHJpYnV0ZSgnZGF0YS1zd2lwZXItc2xpZGUtaW5kZXgnLCBzbGlkZUluZGV4KTtcbiAgICAgICAgICBzd2lwZXIudmlydHVhbC5jYWNoZVtzbGlkZUluZGV4XSA9IHNsaWRlRWw7XG4gICAgICAgICAgc2xpZGVFbC5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghZG9tU2xpZGVzQXNzaWduZWQpIHtcbiAgICAgIHN3aXBlci52aXJ0dWFsLnNsaWRlcyA9IHN3aXBlci5wYXJhbXMudmlydHVhbC5zbGlkZXM7XG4gICAgfVxuICAgIHN3aXBlci5jbGFzc05hbWVzLnB1c2goYCR7c3dpcGVyLnBhcmFtcy5jb250YWluZXJNb2RpZmllckNsYXNzfXZpcnR1YWxgKTtcbiAgICBzd2lwZXIucGFyYW1zLndhdGNoU2xpZGVzUHJvZ3Jlc3MgPSB0cnVlO1xuICAgIHN3aXBlci5vcmlnaW5hbFBhcmFtcy53YXRjaFNsaWRlc1Byb2dyZXNzID0gdHJ1ZTtcbiAgICB1cGRhdGUoKTtcbiAgfSk7XG4gIG9uKCdzZXRUcmFuc2xhdGUnLCAoKSA9PiB7XG4gICAgaWYgKCFzd2lwZXIucGFyYW1zLnZpcnR1YWwuZW5hYmxlZCkgcmV0dXJuO1xuICAgIGlmIChzd2lwZXIucGFyYW1zLmNzc01vZGUgJiYgIXN3aXBlci5faW1tZWRpYXRlVmlydHVhbCkge1xuICAgICAgY2xlYXJUaW1lb3V0KGNzc01vZGVUaW1lb3V0KTtcbiAgICAgIGNzc01vZGVUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHVwZGF0ZSgpO1xuICAgICAgfSwgMTAwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdXBkYXRlKCk7XG4gICAgfVxuICB9KTtcbiAgb24oJ2luaXQgdXBkYXRlIHJlc2l6ZScsICgpID0+IHtcbiAgICBpZiAoIXN3aXBlci5wYXJhbXMudmlydHVhbC5lbmFibGVkKSByZXR1cm47XG4gICAgaWYgKHN3aXBlci5wYXJhbXMuY3NzTW9kZSkge1xuICAgICAgc2V0Q1NTUHJvcGVydHkoc3dpcGVyLndyYXBwZXJFbCwgJy0tc3dpcGVyLXZpcnR1YWwtc2l6ZScsIGAke3N3aXBlci52aXJ0dWFsU2l6ZX1weGApO1xuICAgIH1cbiAgfSk7XG4gIE9iamVjdC5hc3NpZ24oc3dpcGVyLnZpcnR1YWwsIHtcbiAgICBhcHBlbmRTbGlkZSxcbiAgICBwcmVwZW5kU2xpZGUsXG4gICAgcmVtb3ZlU2xpZGUsXG4gICAgcmVtb3ZlQWxsU2xpZGVzLFxuICAgIHVwZGF0ZVxuICB9KTtcbn1cblxuZXhwb3J0IHsgVmlydHVhbCBhcyBkZWZhdWx0IH07XG4iLCJpbXBvcnQgeyBnIGFzIGdldERvY3VtZW50LCBhIGFzIGdldFdpbmRvdyB9IGZyb20gJy4uL3NoYXJlZC9zc3Itd2luZG93LmVzbS5tanMnO1xuaW1wb3J0IHsgYSBhcyBlbGVtZW50UGFyZW50cywgYiBhcyBlbGVtZW50T2Zmc2V0IH0gZnJvbSAnLi4vc2hhcmVkL3V0aWxzLm1qcyc7XG5cbi8qIGVzbGludC1kaXNhYmxlIGNvbnNpc3RlbnQtcmV0dXJuICovXG5mdW5jdGlvbiBLZXlib2FyZChfcmVmKSB7XG4gIGxldCB7XG4gICAgc3dpcGVyLFxuICAgIGV4dGVuZFBhcmFtcyxcbiAgICBvbixcbiAgICBlbWl0XG4gIH0gPSBfcmVmO1xuICBjb25zdCBkb2N1bWVudCA9IGdldERvY3VtZW50KCk7XG4gIGNvbnN0IHdpbmRvdyA9IGdldFdpbmRvdygpO1xuICBzd2lwZXIua2V5Ym9hcmQgPSB7XG4gICAgZW5hYmxlZDogZmFsc2VcbiAgfTtcbiAgZXh0ZW5kUGFyYW1zKHtcbiAgICBrZXlib2FyZDoge1xuICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICBvbmx5SW5WaWV3cG9ydDogdHJ1ZSxcbiAgICAgIHBhZ2VVcERvd246IHRydWVcbiAgICB9XG4gIH0pO1xuICBmdW5jdGlvbiBoYW5kbGUoZXZlbnQpIHtcbiAgICBpZiAoIXN3aXBlci5lbmFibGVkKSByZXR1cm47XG4gICAgY29uc3Qge1xuICAgICAgcnRsVHJhbnNsYXRlOiBydGxcbiAgICB9ID0gc3dpcGVyO1xuICAgIGxldCBlID0gZXZlbnQ7XG4gICAgaWYgKGUub3JpZ2luYWxFdmVudCkgZSA9IGUub3JpZ2luYWxFdmVudDsgLy8ganF1ZXJ5IGZpeFxuICAgIGNvbnN0IGtjID0gZS5rZXlDb2RlIHx8IGUuY2hhckNvZGU7XG4gICAgY29uc3QgcGFnZVVwRG93biA9IHN3aXBlci5wYXJhbXMua2V5Ym9hcmQucGFnZVVwRG93bjtcbiAgICBjb25zdCBpc1BhZ2VVcCA9IHBhZ2VVcERvd24gJiYga2MgPT09IDMzO1xuICAgIGNvbnN0IGlzUGFnZURvd24gPSBwYWdlVXBEb3duICYmIGtjID09PSAzNDtcbiAgICBjb25zdCBpc0Fycm93TGVmdCA9IGtjID09PSAzNztcbiAgICBjb25zdCBpc0Fycm93UmlnaHQgPSBrYyA9PT0gMzk7XG4gICAgY29uc3QgaXNBcnJvd1VwID0ga2MgPT09IDM4O1xuICAgIGNvbnN0IGlzQXJyb3dEb3duID0ga2MgPT09IDQwO1xuICAgIC8vIERpcmVjdGlvbnMgbG9ja3NcbiAgICBpZiAoIXN3aXBlci5hbGxvd1NsaWRlTmV4dCAmJiAoc3dpcGVyLmlzSG9yaXpvbnRhbCgpICYmIGlzQXJyb3dSaWdodCB8fCBzd2lwZXIuaXNWZXJ0aWNhbCgpICYmIGlzQXJyb3dEb3duIHx8IGlzUGFnZURvd24pKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICghc3dpcGVyLmFsbG93U2xpZGVQcmV2ICYmIChzd2lwZXIuaXNIb3Jpem9udGFsKCkgJiYgaXNBcnJvd0xlZnQgfHwgc3dpcGVyLmlzVmVydGljYWwoKSAmJiBpc0Fycm93VXAgfHwgaXNQYWdlVXApKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChlLnNoaWZ0S2V5IHx8IGUuYWx0S2V5IHx8IGUuY3RybEtleSB8fCBlLm1ldGFLZXkpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQubm9kZU5hbWUgJiYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ2lucHV0JyB8fCBkb2N1bWVudC5hY3RpdmVFbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICd0ZXh0YXJlYScpKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5rZXlib2FyZC5vbmx5SW5WaWV3cG9ydCAmJiAoaXNQYWdlVXAgfHwgaXNQYWdlRG93biB8fCBpc0Fycm93TGVmdCB8fCBpc0Fycm93UmlnaHQgfHwgaXNBcnJvd1VwIHx8IGlzQXJyb3dEb3duKSkge1xuICAgICAgbGV0IGluVmlldyA9IGZhbHNlO1xuICAgICAgLy8gQ2hlY2sgdGhhdCBzd2lwZXIgc2hvdWxkIGJlIGluc2lkZSBvZiB2aXNpYmxlIGFyZWEgb2Ygd2luZG93XG4gICAgICBpZiAoZWxlbWVudFBhcmVudHMoc3dpcGVyLmVsLCBgLiR7c3dpcGVyLnBhcmFtcy5zbGlkZUNsYXNzfSwgc3dpcGVyLXNsaWRlYCkubGVuZ3RoID4gMCAmJiBlbGVtZW50UGFyZW50cyhzd2lwZXIuZWwsIGAuJHtzd2lwZXIucGFyYW1zLnNsaWRlQWN0aXZlQ2xhc3N9YCkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgICBjb25zdCBlbCA9IHN3aXBlci5lbDtcbiAgICAgIGNvbnN0IHN3aXBlcldpZHRoID0gZWwuY2xpZW50V2lkdGg7XG4gICAgICBjb25zdCBzd2lwZXJIZWlnaHQgPSBlbC5jbGllbnRIZWlnaHQ7XG4gICAgICBjb25zdCB3aW5kb3dXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgY29uc3Qgd2luZG93SGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgICAgY29uc3Qgc3dpcGVyT2Zmc2V0ID0gZWxlbWVudE9mZnNldChlbCk7XG4gICAgICBpZiAocnRsKSBzd2lwZXJPZmZzZXQubGVmdCAtPSBlbC5zY3JvbGxMZWZ0O1xuICAgICAgY29uc3Qgc3dpcGVyQ29vcmQgPSBbW3N3aXBlck9mZnNldC5sZWZ0LCBzd2lwZXJPZmZzZXQudG9wXSwgW3N3aXBlck9mZnNldC5sZWZ0ICsgc3dpcGVyV2lkdGgsIHN3aXBlck9mZnNldC50b3BdLCBbc3dpcGVyT2Zmc2V0LmxlZnQsIHN3aXBlck9mZnNldC50b3AgKyBzd2lwZXJIZWlnaHRdLCBbc3dpcGVyT2Zmc2V0LmxlZnQgKyBzd2lwZXJXaWR0aCwgc3dpcGVyT2Zmc2V0LnRvcCArIHN3aXBlckhlaWdodF1dO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzd2lwZXJDb29yZC5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjb25zdCBwb2ludCA9IHN3aXBlckNvb3JkW2ldO1xuICAgICAgICBpZiAocG9pbnRbMF0gPj0gMCAmJiBwb2ludFswXSA8PSB3aW5kb3dXaWR0aCAmJiBwb2ludFsxXSA+PSAwICYmIHBvaW50WzFdIDw9IHdpbmRvd0hlaWdodCkge1xuICAgICAgICAgIGlmIChwb2ludFswXSA9PT0gMCAmJiBwb2ludFsxXSA9PT0gMCkgY29udGludWU7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICAgICAgICBpblZpZXcgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoIWluVmlldykgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgaWYgKHN3aXBlci5pc0hvcml6b250YWwoKSkge1xuICAgICAgaWYgKGlzUGFnZVVwIHx8IGlzUGFnZURvd24gfHwgaXNBcnJvd0xlZnQgfHwgaXNBcnJvd1JpZ2h0KSB7XG4gICAgICAgIGlmIChlLnByZXZlbnREZWZhdWx0KSBlLnByZXZlbnREZWZhdWx0KCk7ZWxzZSBlLnJldHVyblZhbHVlID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoKGlzUGFnZURvd24gfHwgaXNBcnJvd1JpZ2h0KSAmJiAhcnRsIHx8IChpc1BhZ2VVcCB8fCBpc0Fycm93TGVmdCkgJiYgcnRsKSBzd2lwZXIuc2xpZGVOZXh0KCk7XG4gICAgICBpZiAoKGlzUGFnZVVwIHx8IGlzQXJyb3dMZWZ0KSAmJiAhcnRsIHx8IChpc1BhZ2VEb3duIHx8IGlzQXJyb3dSaWdodCkgJiYgcnRsKSBzd2lwZXIuc2xpZGVQcmV2KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpc1BhZ2VVcCB8fCBpc1BhZ2VEb3duIHx8IGlzQXJyb3dVcCB8fCBpc0Fycm93RG93bikge1xuICAgICAgICBpZiAoZS5wcmV2ZW50RGVmYXVsdCkgZS5wcmV2ZW50RGVmYXVsdCgpO2Vsc2UgZS5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKGlzUGFnZURvd24gfHwgaXNBcnJvd0Rvd24pIHN3aXBlci5zbGlkZU5leHQoKTtcbiAgICAgIGlmIChpc1BhZ2VVcCB8fCBpc0Fycm93VXApIHN3aXBlci5zbGlkZVByZXYoKTtcbiAgICB9XG4gICAgZW1pdCgna2V5UHJlc3MnLCBrYyk7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICBmdW5jdGlvbiBlbmFibGUoKSB7XG4gICAgaWYgKHN3aXBlci5rZXlib2FyZC5lbmFibGVkKSByZXR1cm47XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZSk7XG4gICAgc3dpcGVyLmtleWJvYXJkLmVuYWJsZWQgPSB0cnVlO1xuICB9XG4gIGZ1bmN0aW9uIGRpc2FibGUoKSB7XG4gICAgaWYgKCFzd2lwZXIua2V5Ym9hcmQuZW5hYmxlZCkgcmV0dXJuO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGUpO1xuICAgIHN3aXBlci5rZXlib2FyZC5lbmFibGVkID0gZmFsc2U7XG4gIH1cbiAgb24oJ2luaXQnLCAoKSA9PiB7XG4gICAgaWYgKHN3aXBlci5wYXJhbXMua2V5Ym9hcmQuZW5hYmxlZCkge1xuICAgICAgZW5hYmxlKCk7XG4gICAgfVxuICB9KTtcbiAgb24oJ2Rlc3Ryb3knLCAoKSA9PiB7XG4gICAgaWYgKHN3aXBlci5rZXlib2FyZC5lbmFibGVkKSB7XG4gICAgICBkaXNhYmxlKCk7XG4gICAgfVxuICB9KTtcbiAgT2JqZWN0LmFzc2lnbihzd2lwZXIua2V5Ym9hcmQsIHtcbiAgICBlbmFibGUsXG4gICAgZGlzYWJsZVxuICB9KTtcbn1cblxuZXhwb3J0IHsgS2V5Ym9hcmQgYXMgZGVmYXVsdCB9O1xuIiwiaW1wb3J0IHsgYSBhcyBnZXRXaW5kb3cgfSBmcm9tICcuLi9zaGFyZWQvc3NyLXdpbmRvdy5lc20ubWpzJztcbmltcG9ydCB7IG4gYXMgbmV4dFRpY2ssIGQgYXMgbm93IH0gZnJvbSAnLi4vc2hhcmVkL3V0aWxzLm1qcyc7XG5cbi8qIGVzbGludC1kaXNhYmxlIGNvbnNpc3RlbnQtcmV0dXJuICovXG5mdW5jdGlvbiBNb3VzZXdoZWVsKF9yZWYpIHtcbiAgbGV0IHtcbiAgICBzd2lwZXIsXG4gICAgZXh0ZW5kUGFyYW1zLFxuICAgIG9uLFxuICAgIGVtaXRcbiAgfSA9IF9yZWY7XG4gIGNvbnN0IHdpbmRvdyA9IGdldFdpbmRvdygpO1xuICBleHRlbmRQYXJhbXMoe1xuICAgIG1vdXNld2hlZWw6IHtcbiAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgcmVsZWFzZU9uRWRnZXM6IGZhbHNlLFxuICAgICAgaW52ZXJ0OiBmYWxzZSxcbiAgICAgIGZvcmNlVG9BeGlzOiBmYWxzZSxcbiAgICAgIHNlbnNpdGl2aXR5OiAxLFxuICAgICAgZXZlbnRzVGFyZ2V0OiAnY29udGFpbmVyJyxcbiAgICAgIHRocmVzaG9sZERlbHRhOiBudWxsLFxuICAgICAgdGhyZXNob2xkVGltZTogbnVsbCxcbiAgICAgIG5vTW91c2V3aGVlbENsYXNzOiAnc3dpcGVyLW5vLW1vdXNld2hlZWwnXG4gICAgfVxuICB9KTtcbiAgc3dpcGVyLm1vdXNld2hlZWwgPSB7XG4gICAgZW5hYmxlZDogZmFsc2VcbiAgfTtcbiAgbGV0IHRpbWVvdXQ7XG4gIGxldCBsYXN0U2Nyb2xsVGltZSA9IG5vdygpO1xuICBsZXQgbGFzdEV2ZW50QmVmb3JlU25hcDtcbiAgY29uc3QgcmVjZW50V2hlZWxFdmVudHMgPSBbXTtcbiAgZnVuY3Rpb24gbm9ybWFsaXplKGUpIHtcbiAgICAvLyBSZWFzb25hYmxlIGRlZmF1bHRzXG4gICAgY29uc3QgUElYRUxfU1RFUCA9IDEwO1xuICAgIGNvbnN0IExJTkVfSEVJR0hUID0gNDA7XG4gICAgY29uc3QgUEFHRV9IRUlHSFQgPSA4MDA7XG4gICAgbGV0IHNYID0gMDtcbiAgICBsZXQgc1kgPSAwOyAvLyBzcGluWCwgc3BpbllcbiAgICBsZXQgcFggPSAwO1xuICAgIGxldCBwWSA9IDA7IC8vIHBpeGVsWCwgcGl4ZWxZXG5cbiAgICAvLyBMZWdhY3lcbiAgICBpZiAoJ2RldGFpbCcgaW4gZSkge1xuICAgICAgc1kgPSBlLmRldGFpbDtcbiAgICB9XG4gICAgaWYgKCd3aGVlbERlbHRhJyBpbiBlKSB7XG4gICAgICBzWSA9IC1lLndoZWVsRGVsdGEgLyAxMjA7XG4gICAgfVxuICAgIGlmICgnd2hlZWxEZWx0YVknIGluIGUpIHtcbiAgICAgIHNZID0gLWUud2hlZWxEZWx0YVkgLyAxMjA7XG4gICAgfVxuICAgIGlmICgnd2hlZWxEZWx0YVgnIGluIGUpIHtcbiAgICAgIHNYID0gLWUud2hlZWxEZWx0YVggLyAxMjA7XG4gICAgfVxuXG4gICAgLy8gc2lkZSBzY3JvbGxpbmcgb24gRkYgd2l0aCBET01Nb3VzZVNjcm9sbFxuICAgIGlmICgnYXhpcycgaW4gZSAmJiBlLmF4aXMgPT09IGUuSE9SSVpPTlRBTF9BWElTKSB7XG4gICAgICBzWCA9IHNZO1xuICAgICAgc1kgPSAwO1xuICAgIH1cbiAgICBwWCA9IHNYICogUElYRUxfU1RFUDtcbiAgICBwWSA9IHNZICogUElYRUxfU1RFUDtcbiAgICBpZiAoJ2RlbHRhWScgaW4gZSkge1xuICAgICAgcFkgPSBlLmRlbHRhWTtcbiAgICB9XG4gICAgaWYgKCdkZWx0YVgnIGluIGUpIHtcbiAgICAgIHBYID0gZS5kZWx0YVg7XG4gICAgfVxuICAgIGlmIChlLnNoaWZ0S2V5ICYmICFwWCkge1xuICAgICAgLy8gaWYgdXNlciBzY3JvbGxzIHdpdGggc2hpZnQgaGUgd2FudHMgaG9yaXpvbnRhbCBzY3JvbGxcbiAgICAgIHBYID0gcFk7XG4gICAgICBwWSA9IDA7XG4gICAgfVxuICAgIGlmICgocFggfHwgcFkpICYmIGUuZGVsdGFNb2RlKSB7XG4gICAgICBpZiAoZS5kZWx0YU1vZGUgPT09IDEpIHtcbiAgICAgICAgLy8gZGVsdGEgaW4gTElORSB1bml0c1xuICAgICAgICBwWCAqPSBMSU5FX0hFSUdIVDtcbiAgICAgICAgcFkgKj0gTElORV9IRUlHSFQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBkZWx0YSBpbiBQQUdFIHVuaXRzXG4gICAgICAgIHBYICo9IFBBR0VfSEVJR0hUO1xuICAgICAgICBwWSAqPSBQQUdFX0hFSUdIVDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBGYWxsLWJhY2sgaWYgc3BpbiBjYW5ub3QgYmUgZGV0ZXJtaW5lZFxuICAgIGlmIChwWCAmJiAhc1gpIHtcbiAgICAgIHNYID0gcFggPCAxID8gLTEgOiAxO1xuICAgIH1cbiAgICBpZiAocFkgJiYgIXNZKSB7XG4gICAgICBzWSA9IHBZIDwgMSA/IC0xIDogMTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIHNwaW5YOiBzWCxcbiAgICAgIHNwaW5ZOiBzWSxcbiAgICAgIHBpeGVsWDogcFgsXG4gICAgICBwaXhlbFk6IHBZXG4gICAgfTtcbiAgfVxuICBmdW5jdGlvbiBoYW5kbGVNb3VzZUVudGVyKCkge1xuICAgIGlmICghc3dpcGVyLmVuYWJsZWQpIHJldHVybjtcbiAgICBzd2lwZXIubW91c2VFbnRlcmVkID0gdHJ1ZTtcbiAgfVxuICBmdW5jdGlvbiBoYW5kbGVNb3VzZUxlYXZlKCkge1xuICAgIGlmICghc3dpcGVyLmVuYWJsZWQpIHJldHVybjtcbiAgICBzd2lwZXIubW91c2VFbnRlcmVkID0gZmFsc2U7XG4gIH1cbiAgZnVuY3Rpb24gYW5pbWF0ZVNsaWRlcihuZXdFdmVudCkge1xuICAgIGlmIChzd2lwZXIucGFyYW1zLm1vdXNld2hlZWwudGhyZXNob2xkRGVsdGEgJiYgbmV3RXZlbnQuZGVsdGEgPCBzd2lwZXIucGFyYW1zLm1vdXNld2hlZWwudGhyZXNob2xkRGVsdGEpIHtcbiAgICAgIC8vIFByZXZlbnQgaWYgZGVsdGEgb2Ygd2hlZWwgc2Nyb2xsIGRlbHRhIGlzIGJlbG93IGNvbmZpZ3VyZWQgdGhyZXNob2xkXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChzd2lwZXIucGFyYW1zLm1vdXNld2hlZWwudGhyZXNob2xkVGltZSAmJiBub3coKSAtIGxhc3RTY3JvbGxUaW1lIDwgc3dpcGVyLnBhcmFtcy5tb3VzZXdoZWVsLnRocmVzaG9sZFRpbWUpIHtcbiAgICAgIC8vIFByZXZlbnQgaWYgdGltZSBiZXR3ZWVuIHNjcm9sbHMgaXMgYmVsb3cgY29uZmlndXJlZCB0aHJlc2hvbGRcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgbW92ZW1lbnQgaXMgTk9UIGJpZyBlbm91Z2ggYW5kXG4gICAgLy8gaWYgdGhlIGxhc3QgdGltZSB0aGUgdXNlciBzY3JvbGxlZCB3YXMgdG9vIGNsb3NlIHRvIHRoZSBjdXJyZW50IG9uZSAoYXZvaWQgY29udGludW91c2x5IHRyaWdnZXJpbmcgdGhlIHNsaWRlcik6XG4gICAgLy8gICBEb24ndCBnbyBhbnkgZnVydGhlciAoYXZvaWQgaW5zaWduaWZpY2FudCBzY3JvbGwgbW92ZW1lbnQpLlxuICAgIGlmIChuZXdFdmVudC5kZWx0YSA+PSA2ICYmIG5vdygpIC0gbGFzdFNjcm9sbFRpbWUgPCA2MCkge1xuICAgICAgLy8gUmV0dXJuIGZhbHNlIGFzIGEgZGVmYXVsdFxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIC8vIElmIHVzZXIgaXMgc2Nyb2xsaW5nIHRvd2FyZHMgdGhlIGVuZDpcbiAgICAvLyAgIElmIHRoZSBzbGlkZXIgaGFzbid0IGhpdCB0aGUgbGF0ZXN0IHNsaWRlIG9yXG4gICAgLy8gICBpZiB0aGUgc2xpZGVyIGlzIGEgbG9vcCBhbmRcbiAgICAvLyAgIGlmIHRoZSBzbGlkZXIgaXNuJ3QgbW92aW5nIHJpZ2h0IG5vdzpcbiAgICAvLyAgICAgR28gdG8gbmV4dCBzbGlkZSBhbmRcbiAgICAvLyAgICAgZW1pdCBhIHNjcm9sbCBldmVudC5cbiAgICAvLyBFbHNlICh0aGUgdXNlciBpcyBzY3JvbGxpbmcgdG93YXJkcyB0aGUgYmVnaW5uaW5nKSBhbmRcbiAgICAvLyBpZiB0aGUgc2xpZGVyIGhhc24ndCBoaXQgdGhlIGZpcnN0IHNsaWRlIG9yXG4gICAgLy8gaWYgdGhlIHNsaWRlciBpcyBhIGxvb3AgYW5kXG4gICAgLy8gaWYgdGhlIHNsaWRlciBpc24ndCBtb3ZpbmcgcmlnaHQgbm93OlxuICAgIC8vICAgR28gdG8gcHJldiBzbGlkZSBhbmRcbiAgICAvLyAgIGVtaXQgYSBzY3JvbGwgZXZlbnQuXG4gICAgaWYgKG5ld0V2ZW50LmRpcmVjdGlvbiA8IDApIHtcbiAgICAgIGlmICgoIXN3aXBlci5pc0VuZCB8fCBzd2lwZXIucGFyYW1zLmxvb3ApICYmICFzd2lwZXIuYW5pbWF0aW5nKSB7XG4gICAgICAgIHN3aXBlci5zbGlkZU5leHQoKTtcbiAgICAgICAgZW1pdCgnc2Nyb2xsJywgbmV3RXZlbnQucmF3KTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCghc3dpcGVyLmlzQmVnaW5uaW5nIHx8IHN3aXBlci5wYXJhbXMubG9vcCkgJiYgIXN3aXBlci5hbmltYXRpbmcpIHtcbiAgICAgIHN3aXBlci5zbGlkZVByZXYoKTtcbiAgICAgIGVtaXQoJ3Njcm9sbCcsIG5ld0V2ZW50LnJhdyk7XG4gICAgfVxuICAgIC8vIElmIHlvdSBnb3QgaGVyZSBpcyBiZWNhdXNlIGFuIGFuaW1hdGlvbiBoYXMgYmVlbiB0cmlnZ2VyZWQgc28gc3RvcmUgdGhlIGN1cnJlbnQgdGltZVxuICAgIGxhc3RTY3JvbGxUaW1lID0gbmV3IHdpbmRvdy5EYXRlKCkuZ2V0VGltZSgpO1xuICAgIC8vIFJldHVybiBmYWxzZSBhcyBhIGRlZmF1bHRcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgZnVuY3Rpb24gcmVsZWFzZVNjcm9sbChuZXdFdmVudCkge1xuICAgIGNvbnN0IHBhcmFtcyA9IHN3aXBlci5wYXJhbXMubW91c2V3aGVlbDtcbiAgICBpZiAobmV3RXZlbnQuZGlyZWN0aW9uIDwgMCkge1xuICAgICAgaWYgKHN3aXBlci5pc0VuZCAmJiAhc3dpcGVyLnBhcmFtcy5sb29wICYmIHBhcmFtcy5yZWxlYXNlT25FZGdlcykge1xuICAgICAgICAvLyBSZXR1cm4gdHJ1ZSB0byBhbmltYXRlIHNjcm9sbCBvbiBlZGdlc1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHN3aXBlci5pc0JlZ2lubmluZyAmJiAhc3dpcGVyLnBhcmFtcy5sb29wICYmIHBhcmFtcy5yZWxlYXNlT25FZGdlcykge1xuICAgICAgLy8gUmV0dXJuIHRydWUgdG8gYW5pbWF0ZSBzY3JvbGwgb24gZWRnZXNcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgZnVuY3Rpb24gaGFuZGxlKGV2ZW50KSB7XG4gICAgbGV0IGUgPSBldmVudDtcbiAgICBsZXQgZGlzYWJsZVBhcmVudFN3aXBlciA9IHRydWU7XG4gICAgaWYgKCFzd2lwZXIuZW5hYmxlZCkgcmV0dXJuO1xuXG4gICAgLy8gSWdub3JlIGV2ZW50IGlmIHRoZSB0YXJnZXQgb3IgaXRzIHBhcmVudHMgaGF2ZSB0aGUgc3dpcGVyLW5vLW1vdXNld2hlZWwgY2xhc3NcbiAgICBpZiAoZXZlbnQudGFyZ2V0LmNsb3Nlc3QoYC4ke3N3aXBlci5wYXJhbXMubW91c2V3aGVlbC5ub01vdXNld2hlZWxDbGFzc31gKSkgcmV0dXJuO1xuICAgIGNvbnN0IHBhcmFtcyA9IHN3aXBlci5wYXJhbXMubW91c2V3aGVlbDtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5jc3NNb2RlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICAgIGxldCB0YXJnZXRFbCA9IHN3aXBlci5lbDtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5tb3VzZXdoZWVsLmV2ZW50c1RhcmdldCAhPT0gJ2NvbnRhaW5lcicpIHtcbiAgICAgIHRhcmdldEVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihzd2lwZXIucGFyYW1zLm1vdXNld2hlZWwuZXZlbnRzVGFyZ2V0KTtcbiAgICB9XG4gICAgY29uc3QgdGFyZ2V0RWxDb250YWluc1RhcmdldCA9IHRhcmdldEVsICYmIHRhcmdldEVsLmNvbnRhaW5zKGUudGFyZ2V0KTtcbiAgICBpZiAoIXN3aXBlci5tb3VzZUVudGVyZWQgJiYgIXRhcmdldEVsQ29udGFpbnNUYXJnZXQgJiYgIXBhcmFtcy5yZWxlYXNlT25FZGdlcykgcmV0dXJuIHRydWU7XG4gICAgaWYgKGUub3JpZ2luYWxFdmVudCkgZSA9IGUub3JpZ2luYWxFdmVudDsgLy8ganF1ZXJ5IGZpeFxuICAgIGxldCBkZWx0YSA9IDA7XG4gICAgY29uc3QgcnRsRmFjdG9yID0gc3dpcGVyLnJ0bFRyYW5zbGF0ZSA/IC0xIDogMTtcbiAgICBjb25zdCBkYXRhID0gbm9ybWFsaXplKGUpO1xuICAgIGlmIChwYXJhbXMuZm9yY2VUb0F4aXMpIHtcbiAgICAgIGlmIChzd2lwZXIuaXNIb3Jpem9udGFsKCkpIHtcbiAgICAgICAgaWYgKE1hdGguYWJzKGRhdGEucGl4ZWxYKSA+IE1hdGguYWJzKGRhdGEucGl4ZWxZKSkgZGVsdGEgPSAtZGF0YS5waXhlbFggKiBydGxGYWN0b3I7ZWxzZSByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAoTWF0aC5hYnMoZGF0YS5waXhlbFkpID4gTWF0aC5hYnMoZGF0YS5waXhlbFgpKSBkZWx0YSA9IC1kYXRhLnBpeGVsWTtlbHNlIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWx0YSA9IE1hdGguYWJzKGRhdGEucGl4ZWxYKSA+IE1hdGguYWJzKGRhdGEucGl4ZWxZKSA/IC1kYXRhLnBpeGVsWCAqIHJ0bEZhY3RvciA6IC1kYXRhLnBpeGVsWTtcbiAgICB9XG4gICAgaWYgKGRlbHRhID09PSAwKSByZXR1cm4gdHJ1ZTtcbiAgICBpZiAocGFyYW1zLmludmVydCkgZGVsdGEgPSAtZGVsdGE7XG5cbiAgICAvLyBHZXQgdGhlIHNjcm9sbCBwb3NpdGlvbnNcbiAgICBsZXQgcG9zaXRpb25zID0gc3dpcGVyLmdldFRyYW5zbGF0ZSgpICsgZGVsdGEgKiBwYXJhbXMuc2Vuc2l0aXZpdHk7XG4gICAgaWYgKHBvc2l0aW9ucyA+PSBzd2lwZXIubWluVHJhbnNsYXRlKCkpIHBvc2l0aW9ucyA9IHN3aXBlci5taW5UcmFuc2xhdGUoKTtcbiAgICBpZiAocG9zaXRpb25zIDw9IHN3aXBlci5tYXhUcmFuc2xhdGUoKSkgcG9zaXRpb25zID0gc3dpcGVyLm1heFRyYW5zbGF0ZSgpO1xuXG4gICAgLy8gV2hlbiBsb29wIGlzIHRydWU6XG4gICAgLy8gICAgIHRoZSBkaXNhYmxlUGFyZW50U3dpcGVyIHdpbGwgYmUgdHJ1ZS5cbiAgICAvLyBXaGVuIGxvb3AgaXMgZmFsc2U6XG4gICAgLy8gICAgIGlmIHRoZSBzY3JvbGwgcG9zaXRpb25zIGlzIG5vdCBvbiBlZGdlLFxuICAgIC8vICAgICB0aGVuIHRoZSBkaXNhYmxlUGFyZW50U3dpcGVyIHdpbGwgYmUgdHJ1ZS5cbiAgICAvLyAgICAgaWYgdGhlIHNjcm9sbCBvbiBlZGdlIHBvc2l0aW9ucyxcbiAgICAvLyAgICAgdGhlbiB0aGUgZGlzYWJsZVBhcmVudFN3aXBlciB3aWxsIGJlIGZhbHNlLlxuICAgIGRpc2FibGVQYXJlbnRTd2lwZXIgPSBzd2lwZXIucGFyYW1zLmxvb3AgPyB0cnVlIDogIShwb3NpdGlvbnMgPT09IHN3aXBlci5taW5UcmFuc2xhdGUoKSB8fCBwb3NpdGlvbnMgPT09IHN3aXBlci5tYXhUcmFuc2xhdGUoKSk7XG4gICAgaWYgKGRpc2FibGVQYXJlbnRTd2lwZXIgJiYgc3dpcGVyLnBhcmFtcy5uZXN0ZWQpIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgaWYgKCFzd2lwZXIucGFyYW1zLmZyZWVNb2RlIHx8ICFzd2lwZXIucGFyYW1zLmZyZWVNb2RlLmVuYWJsZWQpIHtcbiAgICAgIC8vIFJlZ2lzdGVyIHRoZSBuZXcgZXZlbnQgaW4gYSB2YXJpYWJsZSB3aGljaCBzdG9yZXMgdGhlIHJlbGV2YW50IGRhdGFcbiAgICAgIGNvbnN0IG5ld0V2ZW50ID0ge1xuICAgICAgICB0aW1lOiBub3coKSxcbiAgICAgICAgZGVsdGE6IE1hdGguYWJzKGRlbHRhKSxcbiAgICAgICAgZGlyZWN0aW9uOiBNYXRoLnNpZ24oZGVsdGEpLFxuICAgICAgICByYXc6IGV2ZW50XG4gICAgICB9O1xuXG4gICAgICAvLyBLZWVwIHRoZSBtb3N0IHJlY2VudCBldmVudHNcbiAgICAgIGlmIChyZWNlbnRXaGVlbEV2ZW50cy5sZW5ndGggPj0gMikge1xuICAgICAgICByZWNlbnRXaGVlbEV2ZW50cy5zaGlmdCgpOyAvLyBvbmx5IHN0b3JlIHRoZSBsYXN0IE4gZXZlbnRzXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHByZXZFdmVudCA9IHJlY2VudFdoZWVsRXZlbnRzLmxlbmd0aCA/IHJlY2VudFdoZWVsRXZlbnRzW3JlY2VudFdoZWVsRXZlbnRzLmxlbmd0aCAtIDFdIDogdW5kZWZpbmVkO1xuICAgICAgcmVjZW50V2hlZWxFdmVudHMucHVzaChuZXdFdmVudCk7XG5cbiAgICAgIC8vIElmIHRoZXJlIGlzIGF0IGxlYXN0IG9uZSBwcmV2aW91cyByZWNvcmRlZCBldmVudDpcbiAgICAgIC8vICAgSWYgZGlyZWN0aW9uIGhhcyBjaGFuZ2VkIG9yXG4gICAgICAvLyAgIGlmIHRoZSBzY3JvbGwgaXMgcXVpY2tlciB0aGFuIHRoZSBwcmV2aW91cyBvbmU6XG4gICAgICAvLyAgICAgQW5pbWF0ZSB0aGUgc2xpZGVyLlxuICAgICAgLy8gRWxzZSAodGhpcyBpcyB0aGUgZmlyc3QgdGltZSB0aGUgd2hlZWwgaXMgbW92ZWQpOlxuICAgICAgLy8gICAgIEFuaW1hdGUgdGhlIHNsaWRlci5cbiAgICAgIGlmIChwcmV2RXZlbnQpIHtcbiAgICAgICAgaWYgKG5ld0V2ZW50LmRpcmVjdGlvbiAhPT0gcHJldkV2ZW50LmRpcmVjdGlvbiB8fCBuZXdFdmVudC5kZWx0YSA+IHByZXZFdmVudC5kZWx0YSB8fCBuZXdFdmVudC50aW1lID4gcHJldkV2ZW50LnRpbWUgKyAxNTApIHtcbiAgICAgICAgICBhbmltYXRlU2xpZGVyKG5ld0V2ZW50KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYW5pbWF0ZVNsaWRlcihuZXdFdmVudCk7XG4gICAgICB9XG5cbiAgICAgIC8vIElmIGl0J3MgdGltZSB0byByZWxlYXNlIHRoZSBzY3JvbGw6XG4gICAgICAvLyAgIFJldHVybiBub3cgc28geW91IGRvbid0IGhpdCB0aGUgcHJldmVudERlZmF1bHQuXG4gICAgICBpZiAocmVsZWFzZVNjcm9sbChuZXdFdmVudCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEZyZWVtb2RlIG9yIHNjcm9sbENvbnRhaW5lcjpcblxuICAgICAgLy8gSWYgd2UgcmVjZW50bHkgc25hcHBlZCBhZnRlciBhIG1vbWVudHVtIHNjcm9sbCwgdGhlbiBpZ25vcmUgd2hlZWwgZXZlbnRzXG4gICAgICAvLyB0byBnaXZlIHRpbWUgZm9yIHRoZSBkZWNlbGVyYXRpb24gdG8gZmluaXNoLiBTdG9wIGlnbm9yaW5nIGFmdGVyIDUwMCBtc2Vjc1xuICAgICAgLy8gb3IgaWYgaXQncyBhIG5ldyBzY3JvbGwgKGxhcmdlciBkZWx0YSBvciBpbnZlcnNlIHNpZ24gYXMgbGFzdCBldmVudCBiZWZvcmVcbiAgICAgIC8vIGFuIGVuZC1vZi1tb21lbnR1bSBzbmFwKS5cbiAgICAgIGNvbnN0IG5ld0V2ZW50ID0ge1xuICAgICAgICB0aW1lOiBub3coKSxcbiAgICAgICAgZGVsdGE6IE1hdGguYWJzKGRlbHRhKSxcbiAgICAgICAgZGlyZWN0aW9uOiBNYXRoLnNpZ24oZGVsdGEpXG4gICAgICB9O1xuICAgICAgY29uc3QgaWdub3JlV2hlZWxFdmVudHMgPSBsYXN0RXZlbnRCZWZvcmVTbmFwICYmIG5ld0V2ZW50LnRpbWUgPCBsYXN0RXZlbnRCZWZvcmVTbmFwLnRpbWUgKyA1MDAgJiYgbmV3RXZlbnQuZGVsdGEgPD0gbGFzdEV2ZW50QmVmb3JlU25hcC5kZWx0YSAmJiBuZXdFdmVudC5kaXJlY3Rpb24gPT09IGxhc3RFdmVudEJlZm9yZVNuYXAuZGlyZWN0aW9uO1xuICAgICAgaWYgKCFpZ25vcmVXaGVlbEV2ZW50cykge1xuICAgICAgICBsYXN0RXZlbnRCZWZvcmVTbmFwID0gdW5kZWZpbmVkO1xuICAgICAgICBsZXQgcG9zaXRpb24gPSBzd2lwZXIuZ2V0VHJhbnNsYXRlKCkgKyBkZWx0YSAqIHBhcmFtcy5zZW5zaXRpdml0eTtcbiAgICAgICAgY29uc3Qgd2FzQmVnaW5uaW5nID0gc3dpcGVyLmlzQmVnaW5uaW5nO1xuICAgICAgICBjb25zdCB3YXNFbmQgPSBzd2lwZXIuaXNFbmQ7XG4gICAgICAgIGlmIChwb3NpdGlvbiA+PSBzd2lwZXIubWluVHJhbnNsYXRlKCkpIHBvc2l0aW9uID0gc3dpcGVyLm1pblRyYW5zbGF0ZSgpO1xuICAgICAgICBpZiAocG9zaXRpb24gPD0gc3dpcGVyLm1heFRyYW5zbGF0ZSgpKSBwb3NpdGlvbiA9IHN3aXBlci5tYXhUcmFuc2xhdGUoKTtcbiAgICAgICAgc3dpcGVyLnNldFRyYW5zaXRpb24oMCk7XG4gICAgICAgIHN3aXBlci5zZXRUcmFuc2xhdGUocG9zaXRpb24pO1xuICAgICAgICBzd2lwZXIudXBkYXRlUHJvZ3Jlc3MoKTtcbiAgICAgICAgc3dpcGVyLnVwZGF0ZUFjdGl2ZUluZGV4KCk7XG4gICAgICAgIHN3aXBlci51cGRhdGVTbGlkZXNDbGFzc2VzKCk7XG4gICAgICAgIGlmICghd2FzQmVnaW5uaW5nICYmIHN3aXBlci5pc0JlZ2lubmluZyB8fCAhd2FzRW5kICYmIHN3aXBlci5pc0VuZCkge1xuICAgICAgICAgIHN3aXBlci51cGRhdGVTbGlkZXNDbGFzc2VzKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN3aXBlci5wYXJhbXMubG9vcCkge1xuICAgICAgICAgIHN3aXBlci5sb29wRml4KHtcbiAgICAgICAgICAgIGRpcmVjdGlvbjogbmV3RXZlbnQuZGlyZWN0aW9uIDwgMCA/ICduZXh0JyA6ICdwcmV2JyxcbiAgICAgICAgICAgIGJ5TW91c2V3aGVlbDogdHJ1ZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzd2lwZXIucGFyYW1zLmZyZWVNb2RlLnN0aWNreSkge1xuICAgICAgICAgIC8vIFdoZW4gd2hlZWwgc2Nyb2xsaW5nIHN0YXJ0cyB3aXRoIHN0aWNreSAoYWthIHNuYXApIGVuYWJsZWQsIHRoZW4gZGV0ZWN0XG4gICAgICAgICAgLy8gdGhlIGVuZCBvZiBhIG1vbWVudHVtIHNjcm9sbCBieSBzdG9yaW5nIHJlY2VudCAoTj0xNT8pIHdoZWVsIGV2ZW50cy5cbiAgICAgICAgICAvLyAxLiBkbyBhbGwgTiBldmVudHMgaGF2ZSBkZWNyZWFzaW5nIG9yIHNhbWUgKGFic29sdXRlIHZhbHVlKSBkZWx0YT9cbiAgICAgICAgICAvLyAyLiBkaWQgYWxsIE4gZXZlbnRzIGFycml2ZSBpbiB0aGUgbGFzdCBNIChNPTUwMD8pIG1zZWNzP1xuICAgICAgICAgIC8vIDMuIGRvZXMgdGhlIGVhcmxpZXN0IGV2ZW50IGhhdmUgYW4gKGFic29sdXRlIHZhbHVlKSBkZWx0YSB0aGF0J3NcbiAgICAgICAgICAvLyAgICBhdCBsZWFzdCBQIChQPTE/KSBsYXJnZXIgdGhhbiB0aGUgbW9zdCByZWNlbnQgZXZlbnQncyBkZWx0YT9cbiAgICAgICAgICAvLyA0LiBkb2VzIHRoZSBsYXRlc3QgZXZlbnQgaGF2ZSBhIGRlbHRhIHRoYXQncyBzbWFsbGVyIHRoYW4gUSAoUT02PykgcGl4ZWxzP1xuICAgICAgICAgIC8vIElmIDEtNCBhcmUgXCJ5ZXNcIiB0aGVuIHdlJ3JlIG5lYXIgdGhlIGVuZCBvZiBhIG1vbWVudHVtIHNjcm9sbCBkZWNlbGVyYXRpb24uXG4gICAgICAgICAgLy8gU25hcCBpbW1lZGlhdGVseSBhbmQgaWdub3JlIHJlbWFpbmluZyB3aGVlbCBldmVudHMgaW4gdGhpcyBzY3JvbGwuXG4gICAgICAgICAgLy8gU2VlIGNvbW1lbnQgYWJvdmUgZm9yIFwicmVtYWluaW5nIHdoZWVsIGV2ZW50cyBpbiB0aGlzIHNjcm9sbFwiIGRldGVybWluYXRpb24uXG4gICAgICAgICAgLy8gSWYgMS00IGFyZW4ndCBzYXRpc2ZpZWQsIHRoZW4gd2FpdCB0byBzbmFwIHVudGlsIDUwMG1zIGFmdGVyIHRoZSBsYXN0IGV2ZW50LlxuICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgICB0aW1lb3V0ID0gdW5kZWZpbmVkO1xuICAgICAgICAgIGlmIChyZWNlbnRXaGVlbEV2ZW50cy5sZW5ndGggPj0gMTUpIHtcbiAgICAgICAgICAgIHJlY2VudFdoZWVsRXZlbnRzLnNoaWZ0KCk7IC8vIG9ubHkgc3RvcmUgdGhlIGxhc3QgTiBldmVudHNcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBwcmV2RXZlbnQgPSByZWNlbnRXaGVlbEV2ZW50cy5sZW5ndGggPyByZWNlbnRXaGVlbEV2ZW50c1tyZWNlbnRXaGVlbEV2ZW50cy5sZW5ndGggLSAxXSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICBjb25zdCBmaXJzdEV2ZW50ID0gcmVjZW50V2hlZWxFdmVudHNbMF07XG4gICAgICAgICAgcmVjZW50V2hlZWxFdmVudHMucHVzaChuZXdFdmVudCk7XG4gICAgICAgICAgaWYgKHByZXZFdmVudCAmJiAobmV3RXZlbnQuZGVsdGEgPiBwcmV2RXZlbnQuZGVsdGEgfHwgbmV3RXZlbnQuZGlyZWN0aW9uICE9PSBwcmV2RXZlbnQuZGlyZWN0aW9uKSkge1xuICAgICAgICAgICAgLy8gSW5jcmVhc2luZyBvciByZXZlcnNlLXNpZ24gZGVsdGEgbWVhbnMgdGhlIHVzZXIgc3RhcnRlZCBzY3JvbGxpbmcgYWdhaW4uIENsZWFyIHRoZSB3aGVlbCBldmVudCBsb2cuXG4gICAgICAgICAgICByZWNlbnRXaGVlbEV2ZW50cy5zcGxpY2UoMCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChyZWNlbnRXaGVlbEV2ZW50cy5sZW5ndGggPj0gMTUgJiYgbmV3RXZlbnQudGltZSAtIGZpcnN0RXZlbnQudGltZSA8IDUwMCAmJiBmaXJzdEV2ZW50LmRlbHRhIC0gbmV3RXZlbnQuZGVsdGEgPj0gMSAmJiBuZXdFdmVudC5kZWx0YSA8PSA2KSB7XG4gICAgICAgICAgICAvLyBXZSdyZSBhdCB0aGUgZW5kIG9mIHRoZSBkZWNlbGVyYXRpb24gb2YgYSBtb21lbnR1bSBzY3JvbGwsIHNvIHRoZXJlJ3Mgbm8gbmVlZFxuICAgICAgICAgICAgLy8gdG8gd2FpdCBmb3IgbW9yZSBldmVudHMuIFNuYXAgQVNBUCBvbiB0aGUgbmV4dCB0aWNrLlxuICAgICAgICAgICAgLy8gQWxzbywgYmVjYXVzZSB0aGVyZSdzIHNvbWUgcmVtYWluaW5nIG1vbWVudHVtIHdlJ2xsIGJpYXMgdGhlIHNuYXAgaW4gdGhlXG4gICAgICAgICAgICAvLyBkaXJlY3Rpb24gb2YgdGhlIG9uZ29pbmcgc2Nyb2xsIGJlY2F1c2UgaXQncyBiZXR0ZXIgVVggZm9yIHRoZSBzY3JvbGwgdG8gc25hcFxuICAgICAgICAgICAgLy8gaW4gdGhlIHNhbWUgZGlyZWN0aW9uIGFzIHRoZSBzY3JvbGwgaW5zdGVhZCBvZiByZXZlcnNpbmcgdG8gc25hcC4gIFRoZXJlZm9yZSxcbiAgICAgICAgICAgIC8vIGlmIGl0J3MgYWxyZWFkeSBzY3JvbGxlZCBtb3JlIHRoYW4gMjAlIGluIHRoZSBjdXJyZW50IGRpcmVjdGlvbiwga2VlcCBnb2luZy5cbiAgICAgICAgICAgIGNvbnN0IHNuYXBUb1RocmVzaG9sZCA9IGRlbHRhID4gMCA/IDAuOCA6IDAuMjtcbiAgICAgICAgICAgIGxhc3RFdmVudEJlZm9yZVNuYXAgPSBuZXdFdmVudDtcbiAgICAgICAgICAgIHJlY2VudFdoZWVsRXZlbnRzLnNwbGljZSgwKTtcbiAgICAgICAgICAgIHRpbWVvdXQgPSBuZXh0VGljaygoKSA9PiB7XG4gICAgICAgICAgICAgIHN3aXBlci5zbGlkZVRvQ2xvc2VzdChzd2lwZXIucGFyYW1zLnNwZWVkLCB0cnVlLCB1bmRlZmluZWQsIHNuYXBUb1RocmVzaG9sZCk7XG4gICAgICAgICAgICB9LCAwKTsgLy8gbm8gZGVsYXk7IG1vdmUgb24gbmV4dCB0aWNrXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCF0aW1lb3V0KSB7XG4gICAgICAgICAgICAvLyBpZiB3ZSBnZXQgaGVyZSwgdGhlbiB3ZSBoYXZlbid0IGRldGVjdGVkIHRoZSBlbmQgb2YgYSBtb21lbnR1bSBzY3JvbGwsIHNvXG4gICAgICAgICAgICAvLyB3ZSdsbCBjb25zaWRlciBhIHNjcm9sbCBcImNvbXBsZXRlXCIgd2hlbiB0aGVyZSBoYXZlbid0IGJlZW4gYW55IHdoZWVsIGV2ZW50c1xuICAgICAgICAgICAgLy8gZm9yIDUwMG1zLlxuICAgICAgICAgICAgdGltZW91dCA9IG5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgICAgICAgY29uc3Qgc25hcFRvVGhyZXNob2xkID0gMC41O1xuICAgICAgICAgICAgICBsYXN0RXZlbnRCZWZvcmVTbmFwID0gbmV3RXZlbnQ7XG4gICAgICAgICAgICAgIHJlY2VudFdoZWVsRXZlbnRzLnNwbGljZSgwKTtcbiAgICAgICAgICAgICAgc3dpcGVyLnNsaWRlVG9DbG9zZXN0KHN3aXBlci5wYXJhbXMuc3BlZWQsIHRydWUsIHVuZGVmaW5lZCwgc25hcFRvVGhyZXNob2xkKTtcbiAgICAgICAgICAgIH0sIDUwMCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gRW1pdCBldmVudFxuICAgICAgICBpZiAoIWlnbm9yZVdoZWVsRXZlbnRzKSBlbWl0KCdzY3JvbGwnLCBlKTtcblxuICAgICAgICAvLyBTdG9wIGF1dG9wbGF5XG4gICAgICAgIGlmIChzd2lwZXIucGFyYW1zLmF1dG9wbGF5ICYmIHN3aXBlci5wYXJhbXMuYXV0b3BsYXlEaXNhYmxlT25JbnRlcmFjdGlvbikgc3dpcGVyLmF1dG9wbGF5LnN0b3AoKTtcbiAgICAgICAgLy8gUmV0dXJuIHBhZ2Ugc2Nyb2xsIG9uIGVkZ2UgcG9zaXRpb25zXG4gICAgICAgIGlmIChwYXJhbXMucmVsZWFzZU9uRWRnZXMgJiYgKHBvc2l0aW9uID09PSBzd2lwZXIubWluVHJhbnNsYXRlKCkgfHwgcG9zaXRpb24gPT09IHN3aXBlci5tYXhUcmFuc2xhdGUoKSkpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZS5wcmV2ZW50RGVmYXVsdCkgZS5wcmV2ZW50RGVmYXVsdCgpO2Vsc2UgZS5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBmdW5jdGlvbiBldmVudHMobWV0aG9kKSB7XG4gICAgbGV0IHRhcmdldEVsID0gc3dpcGVyLmVsO1xuICAgIGlmIChzd2lwZXIucGFyYW1zLm1vdXNld2hlZWwuZXZlbnRzVGFyZ2V0ICE9PSAnY29udGFpbmVyJykge1xuICAgICAgdGFyZ2V0RWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHN3aXBlci5wYXJhbXMubW91c2V3aGVlbC5ldmVudHNUYXJnZXQpO1xuICAgIH1cbiAgICB0YXJnZXRFbFttZXRob2RdKCdtb3VzZWVudGVyJywgaGFuZGxlTW91c2VFbnRlcik7XG4gICAgdGFyZ2V0RWxbbWV0aG9kXSgnbW91c2VsZWF2ZScsIGhhbmRsZU1vdXNlTGVhdmUpO1xuICAgIHRhcmdldEVsW21ldGhvZF0oJ3doZWVsJywgaGFuZGxlKTtcbiAgfVxuICBmdW5jdGlvbiBlbmFibGUoKSB7XG4gICAgaWYgKHN3aXBlci5wYXJhbXMuY3NzTW9kZSkge1xuICAgICAgc3dpcGVyLndyYXBwZXJFbC5yZW1vdmVFdmVudExpc3RlbmVyKCd3aGVlbCcsIGhhbmRsZSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKHN3aXBlci5tb3VzZXdoZWVsLmVuYWJsZWQpIHJldHVybiBmYWxzZTtcbiAgICBldmVudHMoJ2FkZEV2ZW50TGlzdGVuZXInKTtcbiAgICBzd2lwZXIubW91c2V3aGVlbC5lbmFibGVkID0gdHJ1ZTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBmdW5jdGlvbiBkaXNhYmxlKCkge1xuICAgIGlmIChzd2lwZXIucGFyYW1zLmNzc01vZGUpIHtcbiAgICAgIHN3aXBlci53cmFwcGVyRWwuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAoIXN3aXBlci5tb3VzZXdoZWVsLmVuYWJsZWQpIHJldHVybiBmYWxzZTtcbiAgICBldmVudHMoJ3JlbW92ZUV2ZW50TGlzdGVuZXInKTtcbiAgICBzd2lwZXIubW91c2V3aGVlbC5lbmFibGVkID0gZmFsc2U7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgb24oJ2luaXQnLCAoKSA9PiB7XG4gICAgaWYgKCFzd2lwZXIucGFyYW1zLm1vdXNld2hlZWwuZW5hYmxlZCAmJiBzd2lwZXIucGFyYW1zLmNzc01vZGUpIHtcbiAgICAgIGRpc2FibGUoKTtcbiAgICB9XG4gICAgaWYgKHN3aXBlci5wYXJhbXMubW91c2V3aGVlbC5lbmFibGVkKSBlbmFibGUoKTtcbiAgfSk7XG4gIG9uKCdkZXN0cm95JywgKCkgPT4ge1xuICAgIGlmIChzd2lwZXIucGFyYW1zLmNzc01vZGUpIHtcbiAgICAgIGVuYWJsZSgpO1xuICAgIH1cbiAgICBpZiAoc3dpcGVyLm1vdXNld2hlZWwuZW5hYmxlZCkgZGlzYWJsZSgpO1xuICB9KTtcbiAgT2JqZWN0LmFzc2lnbihzd2lwZXIubW91c2V3aGVlbCwge1xuICAgIGVuYWJsZSxcbiAgICBkaXNhYmxlXG4gIH0pO1xufVxuXG5leHBvcnQgeyBNb3VzZXdoZWVsIGFzIGRlZmF1bHQgfTtcbiIsImltcG9ydCB7IGUgYXMgZWxlbWVudENoaWxkcmVuLCBjIGFzIGNyZWF0ZUVsZW1lbnQgfSBmcm9tICcuL3V0aWxzLm1qcyc7XG5cbmZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnRJZk5vdERlZmluZWQoc3dpcGVyLCBvcmlnaW5hbFBhcmFtcywgcGFyYW1zLCBjaGVja1Byb3BzKSB7XG4gIGlmIChzd2lwZXIucGFyYW1zLmNyZWF0ZUVsZW1lbnRzKSB7XG4gICAgT2JqZWN0LmtleXMoY2hlY2tQcm9wcykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgaWYgKCFwYXJhbXNba2V5XSAmJiBwYXJhbXMuYXV0byA9PT0gdHJ1ZSkge1xuICAgICAgICBsZXQgZWxlbWVudCA9IGVsZW1lbnRDaGlsZHJlbihzd2lwZXIuZWwsIGAuJHtjaGVja1Byb3BzW2tleV19YClbMF07XG4gICAgICAgIGlmICghZWxlbWVudCkge1xuICAgICAgICAgIGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KCdkaXYnLCBjaGVja1Byb3BzW2tleV0pO1xuICAgICAgICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gY2hlY2tQcm9wc1trZXldO1xuICAgICAgICAgIHN3aXBlci5lbC5hcHBlbmQoZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgICAgcGFyYW1zW2tleV0gPSBlbGVtZW50O1xuICAgICAgICBvcmlnaW5hbFBhcmFtc1trZXldID0gZWxlbWVudDtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICByZXR1cm4gcGFyYW1zO1xufVxuXG5leHBvcnQgeyBjcmVhdGVFbGVtZW50SWZOb3REZWZpbmVkIGFzIGMgfTtcbiIsImltcG9ydCB7IGMgYXMgY3JlYXRlRWxlbWVudElmTm90RGVmaW5lZCB9IGZyb20gJy4uL3NoYXJlZC9jcmVhdGUtZWxlbWVudC1pZi1ub3QtZGVmaW5lZC5tanMnO1xuXG5mdW5jdGlvbiBOYXZpZ2F0aW9uKF9yZWYpIHtcbiAgbGV0IHtcbiAgICBzd2lwZXIsXG4gICAgZXh0ZW5kUGFyYW1zLFxuICAgIG9uLFxuICAgIGVtaXRcbiAgfSA9IF9yZWY7XG4gIGV4dGVuZFBhcmFtcyh7XG4gICAgbmF2aWdhdGlvbjoge1xuICAgICAgbmV4dEVsOiBudWxsLFxuICAgICAgcHJldkVsOiBudWxsLFxuICAgICAgaGlkZU9uQ2xpY2s6IGZhbHNlLFxuICAgICAgZGlzYWJsZWRDbGFzczogJ3N3aXBlci1idXR0b24tZGlzYWJsZWQnLFxuICAgICAgaGlkZGVuQ2xhc3M6ICdzd2lwZXItYnV0dG9uLWhpZGRlbicsXG4gICAgICBsb2NrQ2xhc3M6ICdzd2lwZXItYnV0dG9uLWxvY2snLFxuICAgICAgbmF2aWdhdGlvbkRpc2FibGVkQ2xhc3M6ICdzd2lwZXItbmF2aWdhdGlvbi1kaXNhYmxlZCdcbiAgICB9XG4gIH0pO1xuICBzd2lwZXIubmF2aWdhdGlvbiA9IHtcbiAgICBuZXh0RWw6IG51bGwsXG4gICAgcHJldkVsOiBudWxsXG4gIH07XG4gIGNvbnN0IG1ha2VFbGVtZW50c0FycmF5ID0gZWwgPT4gKEFycmF5LmlzQXJyYXkoZWwpID8gZWwgOiBbZWxdKS5maWx0ZXIoZSA9PiAhIWUpO1xuICBmdW5jdGlvbiBnZXRFbChlbCkge1xuICAgIGxldCByZXM7XG4gICAgaWYgKGVsICYmIHR5cGVvZiBlbCA9PT0gJ3N0cmluZycgJiYgc3dpcGVyLmlzRWxlbWVudCkge1xuICAgICAgcmVzID0gc3dpcGVyLmVsLnF1ZXJ5U2VsZWN0b3IoZWwpO1xuICAgICAgaWYgKHJlcykgcmV0dXJuIHJlcztcbiAgICB9XG4gICAgaWYgKGVsKSB7XG4gICAgICBpZiAodHlwZW9mIGVsID09PSAnc3RyaW5nJykgcmVzID0gWy4uLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoZWwpXTtcbiAgICAgIGlmIChzd2lwZXIucGFyYW1zLnVuaXF1ZU5hdkVsZW1lbnRzICYmIHR5cGVvZiBlbCA9PT0gJ3N0cmluZycgJiYgcmVzLmxlbmd0aCA+IDEgJiYgc3dpcGVyLmVsLnF1ZXJ5U2VsZWN0b3JBbGwoZWwpLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICByZXMgPSBzd2lwZXIuZWwucXVlcnlTZWxlY3RvcihlbCk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChlbCAmJiAhcmVzKSByZXR1cm4gZWw7XG4gICAgLy8gaWYgKEFycmF5LmlzQXJyYXkocmVzKSAmJiByZXMubGVuZ3RoID09PSAxKSByZXMgPSByZXNbMF07XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuICBmdW5jdGlvbiB0b2dnbGVFbChlbCwgZGlzYWJsZWQpIHtcbiAgICBjb25zdCBwYXJhbXMgPSBzd2lwZXIucGFyYW1zLm5hdmlnYXRpb247XG4gICAgZWwgPSBtYWtlRWxlbWVudHNBcnJheShlbCk7XG4gICAgZWwuZm9yRWFjaChzdWJFbCA9PiB7XG4gICAgICBpZiAoc3ViRWwpIHtcbiAgICAgICAgc3ViRWwuY2xhc3NMaXN0W2Rpc2FibGVkID8gJ2FkZCcgOiAncmVtb3ZlJ10oLi4ucGFyYW1zLmRpc2FibGVkQ2xhc3Muc3BsaXQoJyAnKSk7XG4gICAgICAgIGlmIChzdWJFbC50YWdOYW1lID09PSAnQlVUVE9OJykgc3ViRWwuZGlzYWJsZWQgPSBkaXNhYmxlZDtcbiAgICAgICAgaWYgKHN3aXBlci5wYXJhbXMud2F0Y2hPdmVyZmxvdyAmJiBzd2lwZXIuZW5hYmxlZCkge1xuICAgICAgICAgIHN1YkVsLmNsYXNzTGlzdFtzd2lwZXIuaXNMb2NrZWQgPyAnYWRkJyA6ICdyZW1vdmUnXShwYXJhbXMubG9ja0NsYXNzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIHVwZGF0ZSgpIHtcbiAgICAvLyBVcGRhdGUgTmF2aWdhdGlvbiBCdXR0b25zXG4gICAgY29uc3Qge1xuICAgICAgbmV4dEVsLFxuICAgICAgcHJldkVsXG4gICAgfSA9IHN3aXBlci5uYXZpZ2F0aW9uO1xuICAgIGlmIChzd2lwZXIucGFyYW1zLmxvb3ApIHtcbiAgICAgIHRvZ2dsZUVsKHByZXZFbCwgZmFsc2UpO1xuICAgICAgdG9nZ2xlRWwobmV4dEVsLCBmYWxzZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRvZ2dsZUVsKHByZXZFbCwgc3dpcGVyLmlzQmVnaW5uaW5nICYmICFzd2lwZXIucGFyYW1zLnJld2luZCk7XG4gICAgdG9nZ2xlRWwobmV4dEVsLCBzd2lwZXIuaXNFbmQgJiYgIXN3aXBlci5wYXJhbXMucmV3aW5kKTtcbiAgfVxuICBmdW5jdGlvbiBvblByZXZDbGljayhlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGlmIChzd2lwZXIuaXNCZWdpbm5pbmcgJiYgIXN3aXBlci5wYXJhbXMubG9vcCAmJiAhc3dpcGVyLnBhcmFtcy5yZXdpbmQpIHJldHVybjtcbiAgICBzd2lwZXIuc2xpZGVQcmV2KCk7XG4gICAgZW1pdCgnbmF2aWdhdGlvblByZXYnKTtcbiAgfVxuICBmdW5jdGlvbiBvbk5leHRDbGljayhlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGlmIChzd2lwZXIuaXNFbmQgJiYgIXN3aXBlci5wYXJhbXMubG9vcCAmJiAhc3dpcGVyLnBhcmFtcy5yZXdpbmQpIHJldHVybjtcbiAgICBzd2lwZXIuc2xpZGVOZXh0KCk7XG4gICAgZW1pdCgnbmF2aWdhdGlvbk5leHQnKTtcbiAgfVxuICBmdW5jdGlvbiBpbml0KCkge1xuICAgIGNvbnN0IHBhcmFtcyA9IHN3aXBlci5wYXJhbXMubmF2aWdhdGlvbjtcbiAgICBzd2lwZXIucGFyYW1zLm5hdmlnYXRpb24gPSBjcmVhdGVFbGVtZW50SWZOb3REZWZpbmVkKHN3aXBlciwgc3dpcGVyLm9yaWdpbmFsUGFyYW1zLm5hdmlnYXRpb24sIHN3aXBlci5wYXJhbXMubmF2aWdhdGlvbiwge1xuICAgICAgbmV4dEVsOiAnc3dpcGVyLWJ1dHRvbi1uZXh0JyxcbiAgICAgIHByZXZFbDogJ3N3aXBlci1idXR0b24tcHJldidcbiAgICB9KTtcbiAgICBpZiAoIShwYXJhbXMubmV4dEVsIHx8IHBhcmFtcy5wcmV2RWwpKSByZXR1cm47XG4gICAgbGV0IG5leHRFbCA9IGdldEVsKHBhcmFtcy5uZXh0RWwpO1xuICAgIGxldCBwcmV2RWwgPSBnZXRFbChwYXJhbXMucHJldkVsKTtcbiAgICBPYmplY3QuYXNzaWduKHN3aXBlci5uYXZpZ2F0aW9uLCB7XG4gICAgICBuZXh0RWwsXG4gICAgICBwcmV2RWxcbiAgICB9KTtcbiAgICBuZXh0RWwgPSBtYWtlRWxlbWVudHNBcnJheShuZXh0RWwpO1xuICAgIHByZXZFbCA9IG1ha2VFbGVtZW50c0FycmF5KHByZXZFbCk7XG4gICAgY29uc3QgaW5pdEJ1dHRvbiA9IChlbCwgZGlyKSA9PiB7XG4gICAgICBpZiAoZWwpIHtcbiAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBkaXIgPT09ICduZXh0JyA/IG9uTmV4dENsaWNrIDogb25QcmV2Q2xpY2spO1xuICAgICAgfVxuICAgICAgaWYgKCFzd2lwZXIuZW5hYmxlZCAmJiBlbCkge1xuICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKC4uLnBhcmFtcy5sb2NrQ2xhc3Muc3BsaXQoJyAnKSk7XG4gICAgICB9XG4gICAgfTtcbiAgICBuZXh0RWwuZm9yRWFjaChlbCA9PiBpbml0QnV0dG9uKGVsLCAnbmV4dCcpKTtcbiAgICBwcmV2RWwuZm9yRWFjaChlbCA9PiBpbml0QnV0dG9uKGVsLCAncHJldicpKTtcbiAgfVxuICBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgIGxldCB7XG4gICAgICBuZXh0RWwsXG4gICAgICBwcmV2RWxcbiAgICB9ID0gc3dpcGVyLm5hdmlnYXRpb247XG4gICAgbmV4dEVsID0gbWFrZUVsZW1lbnRzQXJyYXkobmV4dEVsKTtcbiAgICBwcmV2RWwgPSBtYWtlRWxlbWVudHNBcnJheShwcmV2RWwpO1xuICAgIGNvbnN0IGRlc3Ryb3lCdXR0b24gPSAoZWwsIGRpcikgPT4ge1xuICAgICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBkaXIgPT09ICduZXh0JyA/IG9uTmV4dENsaWNrIDogb25QcmV2Q2xpY2spO1xuICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZSguLi5zd2lwZXIucGFyYW1zLm5hdmlnYXRpb24uZGlzYWJsZWRDbGFzcy5zcGxpdCgnICcpKTtcbiAgICB9O1xuICAgIG5leHRFbC5mb3JFYWNoKGVsID0+IGRlc3Ryb3lCdXR0b24oZWwsICduZXh0JykpO1xuICAgIHByZXZFbC5mb3JFYWNoKGVsID0+IGRlc3Ryb3lCdXR0b24oZWwsICdwcmV2JykpO1xuICB9XG4gIG9uKCdpbml0JywgKCkgPT4ge1xuICAgIGlmIChzd2lwZXIucGFyYW1zLm5hdmlnYXRpb24uZW5hYmxlZCA9PT0gZmFsc2UpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgICAgZGlzYWJsZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpbml0KCk7XG4gICAgICB1cGRhdGUoKTtcbiAgICB9XG4gIH0pO1xuICBvbigndG9FZGdlIGZyb21FZGdlIGxvY2sgdW5sb2NrJywgKCkgPT4ge1xuICAgIHVwZGF0ZSgpO1xuICB9KTtcbiAgb24oJ2Rlc3Ryb3knLCAoKSA9PiB7XG4gICAgZGVzdHJveSgpO1xuICB9KTtcbiAgb24oJ2VuYWJsZSBkaXNhYmxlJywgKCkgPT4ge1xuICAgIGxldCB7XG4gICAgICBuZXh0RWwsXG4gICAgICBwcmV2RWxcbiAgICB9ID0gc3dpcGVyLm5hdmlnYXRpb247XG4gICAgbmV4dEVsID0gbWFrZUVsZW1lbnRzQXJyYXkobmV4dEVsKTtcbiAgICBwcmV2RWwgPSBtYWtlRWxlbWVudHNBcnJheShwcmV2RWwpO1xuICAgIGlmIChzd2lwZXIuZW5hYmxlZCkge1xuICAgICAgdXBkYXRlKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIFsuLi5uZXh0RWwsIC4uLnByZXZFbF0uZmlsdGVyKGVsID0+ICEhZWwpLmZvckVhY2goZWwgPT4gZWwuY2xhc3NMaXN0LmFkZChzd2lwZXIucGFyYW1zLm5hdmlnYXRpb24ubG9ja0NsYXNzKSk7XG4gIH0pO1xuICBvbignY2xpY2snLCAoX3MsIGUpID0+IHtcbiAgICBsZXQge1xuICAgICAgbmV4dEVsLFxuICAgICAgcHJldkVsXG4gICAgfSA9IHN3aXBlci5uYXZpZ2F0aW9uO1xuICAgIG5leHRFbCA9IG1ha2VFbGVtZW50c0FycmF5KG5leHRFbCk7XG4gICAgcHJldkVsID0gbWFrZUVsZW1lbnRzQXJyYXkocHJldkVsKTtcbiAgICBjb25zdCB0YXJnZXRFbCA9IGUudGFyZ2V0O1xuICAgIGlmIChzd2lwZXIucGFyYW1zLm5hdmlnYXRpb24uaGlkZU9uQ2xpY2sgJiYgIXByZXZFbC5pbmNsdWRlcyh0YXJnZXRFbCkgJiYgIW5leHRFbC5pbmNsdWRlcyh0YXJnZXRFbCkpIHtcbiAgICAgIGlmIChzd2lwZXIucGFnaW5hdGlvbiAmJiBzd2lwZXIucGFyYW1zLnBhZ2luYXRpb24gJiYgc3dpcGVyLnBhcmFtcy5wYWdpbmF0aW9uLmNsaWNrYWJsZSAmJiAoc3dpcGVyLnBhZ2luYXRpb24uZWwgPT09IHRhcmdldEVsIHx8IHN3aXBlci5wYWdpbmF0aW9uLmVsLmNvbnRhaW5zKHRhcmdldEVsKSkpIHJldHVybjtcbiAgICAgIGxldCBpc0hpZGRlbjtcbiAgICAgIGlmIChuZXh0RWwubGVuZ3RoKSB7XG4gICAgICAgIGlzSGlkZGVuID0gbmV4dEVsWzBdLmNsYXNzTGlzdC5jb250YWlucyhzd2lwZXIucGFyYW1zLm5hdmlnYXRpb24uaGlkZGVuQ2xhc3MpO1xuICAgICAgfSBlbHNlIGlmIChwcmV2RWwubGVuZ3RoKSB7XG4gICAgICAgIGlzSGlkZGVuID0gcHJldkVsWzBdLmNsYXNzTGlzdC5jb250YWlucyhzd2lwZXIucGFyYW1zLm5hdmlnYXRpb24uaGlkZGVuQ2xhc3MpO1xuICAgICAgfVxuICAgICAgaWYgKGlzSGlkZGVuID09PSB0cnVlKSB7XG4gICAgICAgIGVtaXQoJ25hdmlnYXRpb25TaG93Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbWl0KCduYXZpZ2F0aW9uSGlkZScpO1xuICAgICAgfVxuICAgICAgWy4uLm5leHRFbCwgLi4ucHJldkVsXS5maWx0ZXIoZWwgPT4gISFlbCkuZm9yRWFjaChlbCA9PiBlbC5jbGFzc0xpc3QudG9nZ2xlKHN3aXBlci5wYXJhbXMubmF2aWdhdGlvbi5oaWRkZW5DbGFzcykpO1xuICAgIH1cbiAgfSk7XG4gIGNvbnN0IGVuYWJsZSA9ICgpID0+IHtcbiAgICBzd2lwZXIuZWwuY2xhc3NMaXN0LnJlbW92ZSguLi5zd2lwZXIucGFyYW1zLm5hdmlnYXRpb24ubmF2aWdhdGlvbkRpc2FibGVkQ2xhc3Muc3BsaXQoJyAnKSk7XG4gICAgaW5pdCgpO1xuICAgIHVwZGF0ZSgpO1xuICB9O1xuICBjb25zdCBkaXNhYmxlID0gKCkgPT4ge1xuICAgIHN3aXBlci5lbC5jbGFzc0xpc3QuYWRkKC4uLnN3aXBlci5wYXJhbXMubmF2aWdhdGlvbi5uYXZpZ2F0aW9uRGlzYWJsZWRDbGFzcy5zcGxpdCgnICcpKTtcbiAgICBkZXN0cm95KCk7XG4gIH07XG4gIE9iamVjdC5hc3NpZ24oc3dpcGVyLm5hdmlnYXRpb24sIHtcbiAgICBlbmFibGUsXG4gICAgZGlzYWJsZSxcbiAgICB1cGRhdGUsXG4gICAgaW5pdCxcbiAgICBkZXN0cm95XG4gIH0pO1xufVxuXG5leHBvcnQgeyBOYXZpZ2F0aW9uIGFzIGRlZmF1bHQgfTtcbiIsImZ1bmN0aW9uIGNsYXNzZXNUb1NlbGVjdG9yKGNsYXNzZXMpIHtcbiAgaWYgKGNsYXNzZXMgPT09IHZvaWQgMCkge1xuICAgIGNsYXNzZXMgPSAnJztcbiAgfVxuICByZXR1cm4gYC4ke2NsYXNzZXMudHJpbSgpLnJlcGxhY2UoLyhbXFwuOiErXFwvXSkvZywgJ1xcXFwkMScpIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgLnJlcGxhY2UoLyAvZywgJy4nKX1gO1xufVxuXG5leHBvcnQgeyBjbGFzc2VzVG9TZWxlY3RvciBhcyBjIH07XG4iLCJpbXBvcnQgeyBjIGFzIGNsYXNzZXNUb1NlbGVjdG9yIH0gZnJvbSAnLi4vc2hhcmVkL2NsYXNzZXMtdG8tc2VsZWN0b3IubWpzJztcbmltcG9ydCB7IGMgYXMgY3JlYXRlRWxlbWVudElmTm90RGVmaW5lZCB9IGZyb20gJy4uL3NoYXJlZC9jcmVhdGUtZWxlbWVudC1pZi1ub3QtZGVmaW5lZC5tanMnO1xuaW1wb3J0IHsgZiBhcyBlbGVtZW50T3V0ZXJTaXplLCBnIGFzIGVsZW1lbnRJbmRleCwgYSBhcyBlbGVtZW50UGFyZW50cyB9IGZyb20gJy4uL3NoYXJlZC91dGlscy5tanMnO1xuXG5mdW5jdGlvbiBQYWdpbmF0aW9uKF9yZWYpIHtcbiAgbGV0IHtcbiAgICBzd2lwZXIsXG4gICAgZXh0ZW5kUGFyYW1zLFxuICAgIG9uLFxuICAgIGVtaXRcbiAgfSA9IF9yZWY7XG4gIGNvbnN0IHBmeCA9ICdzd2lwZXItcGFnaW5hdGlvbic7XG4gIGV4dGVuZFBhcmFtcyh7XG4gICAgcGFnaW5hdGlvbjoge1xuICAgICAgZWw6IG51bGwsXG4gICAgICBidWxsZXRFbGVtZW50OiAnc3BhbicsXG4gICAgICBjbGlja2FibGU6IGZhbHNlLFxuICAgICAgaGlkZU9uQ2xpY2s6IGZhbHNlLFxuICAgICAgcmVuZGVyQnVsbGV0OiBudWxsLFxuICAgICAgcmVuZGVyUHJvZ3Jlc3NiYXI6IG51bGwsXG4gICAgICByZW5kZXJGcmFjdGlvbjogbnVsbCxcbiAgICAgIHJlbmRlckN1c3RvbTogbnVsbCxcbiAgICAgIHByb2dyZXNzYmFyT3Bwb3NpdGU6IGZhbHNlLFxuICAgICAgdHlwZTogJ2J1bGxldHMnLFxuICAgICAgLy8gJ2J1bGxldHMnIG9yICdwcm9ncmVzc2Jhcicgb3IgJ2ZyYWN0aW9uJyBvciAnY3VzdG9tJ1xuICAgICAgZHluYW1pY0J1bGxldHM6IGZhbHNlLFxuICAgICAgZHluYW1pY01haW5CdWxsZXRzOiAxLFxuICAgICAgZm9ybWF0RnJhY3Rpb25DdXJyZW50OiBudW1iZXIgPT4gbnVtYmVyLFxuICAgICAgZm9ybWF0RnJhY3Rpb25Ub3RhbDogbnVtYmVyID0+IG51bWJlcixcbiAgICAgIGJ1bGxldENsYXNzOiBgJHtwZnh9LWJ1bGxldGAsXG4gICAgICBidWxsZXRBY3RpdmVDbGFzczogYCR7cGZ4fS1idWxsZXQtYWN0aXZlYCxcbiAgICAgIG1vZGlmaWVyQ2xhc3M6IGAke3BmeH0tYCxcbiAgICAgIGN1cnJlbnRDbGFzczogYCR7cGZ4fS1jdXJyZW50YCxcbiAgICAgIHRvdGFsQ2xhc3M6IGAke3BmeH0tdG90YWxgLFxuICAgICAgaGlkZGVuQ2xhc3M6IGAke3BmeH0taGlkZGVuYCxcbiAgICAgIHByb2dyZXNzYmFyRmlsbENsYXNzOiBgJHtwZnh9LXByb2dyZXNzYmFyLWZpbGxgLFxuICAgICAgcHJvZ3Jlc3NiYXJPcHBvc2l0ZUNsYXNzOiBgJHtwZnh9LXByb2dyZXNzYmFyLW9wcG9zaXRlYCxcbiAgICAgIGNsaWNrYWJsZUNsYXNzOiBgJHtwZnh9LWNsaWNrYWJsZWAsXG4gICAgICBsb2NrQ2xhc3M6IGAke3BmeH0tbG9ja2AsXG4gICAgICBob3Jpem9udGFsQ2xhc3M6IGAke3BmeH0taG9yaXpvbnRhbGAsXG4gICAgICB2ZXJ0aWNhbENsYXNzOiBgJHtwZnh9LXZlcnRpY2FsYCxcbiAgICAgIHBhZ2luYXRpb25EaXNhYmxlZENsYXNzOiBgJHtwZnh9LWRpc2FibGVkYFxuICAgIH1cbiAgfSk7XG4gIHN3aXBlci5wYWdpbmF0aW9uID0ge1xuICAgIGVsOiBudWxsLFxuICAgIGJ1bGxldHM6IFtdXG4gIH07XG4gIGxldCBidWxsZXRTaXplO1xuICBsZXQgZHluYW1pY0J1bGxldEluZGV4ID0gMDtcbiAgY29uc3QgbWFrZUVsZW1lbnRzQXJyYXkgPSBlbCA9PiAoQXJyYXkuaXNBcnJheShlbCkgPyBlbCA6IFtlbF0pLmZpbHRlcihlID0+ICEhZSk7XG4gIGZ1bmN0aW9uIGlzUGFnaW5hdGlvbkRpc2FibGVkKCkge1xuICAgIHJldHVybiAhc3dpcGVyLnBhcmFtcy5wYWdpbmF0aW9uLmVsIHx8ICFzd2lwZXIucGFnaW5hdGlvbi5lbCB8fCBBcnJheS5pc0FycmF5KHN3aXBlci5wYWdpbmF0aW9uLmVsKSAmJiBzd2lwZXIucGFnaW5hdGlvbi5lbC5sZW5ndGggPT09IDA7XG4gIH1cbiAgZnVuY3Rpb24gc2V0U2lkZUJ1bGxldHMoYnVsbGV0RWwsIHBvc2l0aW9uKSB7XG4gICAgY29uc3Qge1xuICAgICAgYnVsbGV0QWN0aXZlQ2xhc3NcbiAgICB9ID0gc3dpcGVyLnBhcmFtcy5wYWdpbmF0aW9uO1xuICAgIGlmICghYnVsbGV0RWwpIHJldHVybjtcbiAgICBidWxsZXRFbCA9IGJ1bGxldEVsW2Ake3Bvc2l0aW9uID09PSAncHJldicgPyAncHJldmlvdXMnIDogJ25leHQnfUVsZW1lbnRTaWJsaW5nYF07XG4gICAgaWYgKGJ1bGxldEVsKSB7XG4gICAgICBidWxsZXRFbC5jbGFzc0xpc3QuYWRkKGAke2J1bGxldEFjdGl2ZUNsYXNzfS0ke3Bvc2l0aW9ufWApO1xuICAgICAgYnVsbGV0RWwgPSBidWxsZXRFbFtgJHtwb3NpdGlvbiA9PT0gJ3ByZXYnID8gJ3ByZXZpb3VzJyA6ICduZXh0J31FbGVtZW50U2libGluZ2BdO1xuICAgICAgaWYgKGJ1bGxldEVsKSB7XG4gICAgICAgIGJ1bGxldEVsLmNsYXNzTGlzdC5hZGQoYCR7YnVsbGV0QWN0aXZlQ2xhc3N9LSR7cG9zaXRpb259LSR7cG9zaXRpb259YCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIG9uQnVsbGV0Q2xpY2soZSkge1xuICAgIGNvbnN0IGJ1bGxldEVsID0gZS50YXJnZXQuY2xvc2VzdChjbGFzc2VzVG9TZWxlY3Rvcihzd2lwZXIucGFyYW1zLnBhZ2luYXRpb24uYnVsbGV0Q2xhc3MpKTtcbiAgICBpZiAoIWJ1bGxldEVsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zdCBpbmRleCA9IGVsZW1lbnRJbmRleChidWxsZXRFbCkgKiBzd2lwZXIucGFyYW1zLnNsaWRlc1Blckdyb3VwO1xuICAgIGlmIChzd2lwZXIucGFyYW1zLmxvb3ApIHtcbiAgICAgIGlmIChzd2lwZXIucmVhbEluZGV4ID09PSBpbmRleCkgcmV0dXJuO1xuICAgICAgc3dpcGVyLnNsaWRlVG9Mb29wKGluZGV4KTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3dpcGVyLnNsaWRlVG8oaW5kZXgpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiB1cGRhdGUoKSB7XG4gICAgLy8gUmVuZGVyIHx8IFVwZGF0ZSBQYWdpbmF0aW9uIGJ1bGxldHMvaXRlbXNcbiAgICBjb25zdCBydGwgPSBzd2lwZXIucnRsO1xuICAgIGNvbnN0IHBhcmFtcyA9IHN3aXBlci5wYXJhbXMucGFnaW5hdGlvbjtcbiAgICBpZiAoaXNQYWdpbmF0aW9uRGlzYWJsZWQoKSkgcmV0dXJuO1xuICAgIGxldCBlbCA9IHN3aXBlci5wYWdpbmF0aW9uLmVsO1xuICAgIGVsID0gbWFrZUVsZW1lbnRzQXJyYXkoZWwpO1xuICAgIC8vIEN1cnJlbnQvVG90YWxcbiAgICBsZXQgY3VycmVudDtcbiAgICBsZXQgcHJldmlvdXNJbmRleDtcbiAgICBjb25zdCBzbGlkZXNMZW5ndGggPSBzd2lwZXIudmlydHVhbCAmJiBzd2lwZXIucGFyYW1zLnZpcnR1YWwuZW5hYmxlZCA/IHN3aXBlci52aXJ0dWFsLnNsaWRlcy5sZW5ndGggOiBzd2lwZXIuc2xpZGVzLmxlbmd0aDtcbiAgICBjb25zdCB0b3RhbCA9IHN3aXBlci5wYXJhbXMubG9vcCA/IE1hdGguY2VpbChzbGlkZXNMZW5ndGggLyBzd2lwZXIucGFyYW1zLnNsaWRlc1Blckdyb3VwKSA6IHN3aXBlci5zbmFwR3JpZC5sZW5ndGg7XG4gICAgaWYgKHN3aXBlci5wYXJhbXMubG9vcCkge1xuICAgICAgcHJldmlvdXNJbmRleCA9IHN3aXBlci5wcmV2aW91c1JlYWxJbmRleCB8fCAwO1xuICAgICAgY3VycmVudCA9IHN3aXBlci5wYXJhbXMuc2xpZGVzUGVyR3JvdXAgPiAxID8gTWF0aC5mbG9vcihzd2lwZXIucmVhbEluZGV4IC8gc3dpcGVyLnBhcmFtcy5zbGlkZXNQZXJHcm91cCkgOiBzd2lwZXIucmVhbEluZGV4O1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHN3aXBlci5zbmFwSW5kZXggIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjdXJyZW50ID0gc3dpcGVyLnNuYXBJbmRleDtcbiAgICAgIHByZXZpb3VzSW5kZXggPSBzd2lwZXIucHJldmlvdXNTbmFwSW5kZXg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHByZXZpb3VzSW5kZXggPSBzd2lwZXIucHJldmlvdXNJbmRleCB8fCAwO1xuICAgICAgY3VycmVudCA9IHN3aXBlci5hY3RpdmVJbmRleCB8fCAwO1xuICAgIH1cbiAgICAvLyBUeXBlc1xuICAgIGlmIChwYXJhbXMudHlwZSA9PT0gJ2J1bGxldHMnICYmIHN3aXBlci5wYWdpbmF0aW9uLmJ1bGxldHMgJiYgc3dpcGVyLnBhZ2luYXRpb24uYnVsbGV0cy5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBidWxsZXRzID0gc3dpcGVyLnBhZ2luYXRpb24uYnVsbGV0cztcbiAgICAgIGxldCBmaXJzdEluZGV4O1xuICAgICAgbGV0IGxhc3RJbmRleDtcbiAgICAgIGxldCBtaWRJbmRleDtcbiAgICAgIGlmIChwYXJhbXMuZHluYW1pY0J1bGxldHMpIHtcbiAgICAgICAgYnVsbGV0U2l6ZSA9IGVsZW1lbnRPdXRlclNpemUoYnVsbGV0c1swXSwgc3dpcGVyLmlzSG9yaXpvbnRhbCgpID8gJ3dpZHRoJyA6ICdoZWlnaHQnLCB0cnVlKTtcbiAgICAgICAgZWwuZm9yRWFjaChzdWJFbCA9PiB7XG4gICAgICAgICAgc3ViRWwuc3R5bGVbc3dpcGVyLmlzSG9yaXpvbnRhbCgpID8gJ3dpZHRoJyA6ICdoZWlnaHQnXSA9IGAke2J1bGxldFNpemUgKiAocGFyYW1zLmR5bmFtaWNNYWluQnVsbGV0cyArIDQpfXB4YDtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChwYXJhbXMuZHluYW1pY01haW5CdWxsZXRzID4gMSAmJiBwcmV2aW91c0luZGV4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBkeW5hbWljQnVsbGV0SW5kZXggKz0gY3VycmVudCAtIChwcmV2aW91c0luZGV4IHx8IDApO1xuICAgICAgICAgIGlmIChkeW5hbWljQnVsbGV0SW5kZXggPiBwYXJhbXMuZHluYW1pY01haW5CdWxsZXRzIC0gMSkge1xuICAgICAgICAgICAgZHluYW1pY0J1bGxldEluZGV4ID0gcGFyYW1zLmR5bmFtaWNNYWluQnVsbGV0cyAtIDE7XG4gICAgICAgICAgfSBlbHNlIGlmIChkeW5hbWljQnVsbGV0SW5kZXggPCAwKSB7XG4gICAgICAgICAgICBkeW5hbWljQnVsbGV0SW5kZXggPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmaXJzdEluZGV4ID0gTWF0aC5tYXgoY3VycmVudCAtIGR5bmFtaWNCdWxsZXRJbmRleCwgMCk7XG4gICAgICAgIGxhc3RJbmRleCA9IGZpcnN0SW5kZXggKyAoTWF0aC5taW4oYnVsbGV0cy5sZW5ndGgsIHBhcmFtcy5keW5hbWljTWFpbkJ1bGxldHMpIC0gMSk7XG4gICAgICAgIG1pZEluZGV4ID0gKGxhc3RJbmRleCArIGZpcnN0SW5kZXgpIC8gMjtcbiAgICAgIH1cbiAgICAgIGJ1bGxldHMuZm9yRWFjaChidWxsZXRFbCA9PiB7XG4gICAgICAgIGNvbnN0IGNsYXNzZXNUb1JlbW92ZSA9IFsuLi5bJycsICctbmV4dCcsICctbmV4dC1uZXh0JywgJy1wcmV2JywgJy1wcmV2LXByZXYnLCAnLW1haW4nXS5tYXAoc3VmZml4ID0+IGAke3BhcmFtcy5idWxsZXRBY3RpdmVDbGFzc30ke3N1ZmZpeH1gKV0ubWFwKHMgPT4gdHlwZW9mIHMgPT09ICdzdHJpbmcnICYmIHMuaW5jbHVkZXMoJyAnKSA/IHMuc3BsaXQoJyAnKSA6IHMpLmZsYXQoKTtcbiAgICAgICAgYnVsbGV0RWwuY2xhc3NMaXN0LnJlbW92ZSguLi5jbGFzc2VzVG9SZW1vdmUpO1xuICAgICAgfSk7XG4gICAgICBpZiAoZWwubGVuZ3RoID4gMSkge1xuICAgICAgICBidWxsZXRzLmZvckVhY2goYnVsbGV0ID0+IHtcbiAgICAgICAgICBjb25zdCBidWxsZXRJbmRleCA9IGVsZW1lbnRJbmRleChidWxsZXQpO1xuICAgICAgICAgIGlmIChidWxsZXRJbmRleCA9PT0gY3VycmVudCkge1xuICAgICAgICAgICAgYnVsbGV0LmNsYXNzTGlzdC5hZGQoLi4ucGFyYW1zLmJ1bGxldEFjdGl2ZUNsYXNzLnNwbGl0KCcgJykpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoc3dpcGVyLmlzRWxlbWVudCkge1xuICAgICAgICAgICAgYnVsbGV0LnNldEF0dHJpYnV0ZSgncGFydCcsICdidWxsZXQnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHBhcmFtcy5keW5hbWljQnVsbGV0cykge1xuICAgICAgICAgICAgaWYgKGJ1bGxldEluZGV4ID49IGZpcnN0SW5kZXggJiYgYnVsbGV0SW5kZXggPD0gbGFzdEluZGV4KSB7XG4gICAgICAgICAgICAgIGJ1bGxldC5jbGFzc0xpc3QuYWRkKC4uLmAke3BhcmFtcy5idWxsZXRBY3RpdmVDbGFzc30tbWFpbmAuc3BsaXQoJyAnKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYnVsbGV0SW5kZXggPT09IGZpcnN0SW5kZXgpIHtcbiAgICAgICAgICAgICAgc2V0U2lkZUJ1bGxldHMoYnVsbGV0LCAncHJldicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGJ1bGxldEluZGV4ID09PSBsYXN0SW5kZXgpIHtcbiAgICAgICAgICAgICAgc2V0U2lkZUJ1bGxldHMoYnVsbGV0LCAnbmV4dCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBidWxsZXQgPSBidWxsZXRzW2N1cnJlbnRdO1xuICAgICAgICBpZiAoYnVsbGV0KSB7XG4gICAgICAgICAgYnVsbGV0LmNsYXNzTGlzdC5hZGQoLi4ucGFyYW1zLmJ1bGxldEFjdGl2ZUNsYXNzLnNwbGl0KCcgJykpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzd2lwZXIuaXNFbGVtZW50KSB7XG4gICAgICAgICAgYnVsbGV0cy5mb3JFYWNoKChidWxsZXRFbCwgYnVsbGV0SW5kZXgpID0+IHtcbiAgICAgICAgICAgIGJ1bGxldEVsLnNldEF0dHJpYnV0ZSgncGFydCcsIGJ1bGxldEluZGV4ID09PSBjdXJyZW50ID8gJ2J1bGxldC1hY3RpdmUnIDogJ2J1bGxldCcpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYXJhbXMuZHluYW1pY0J1bGxldHMpIHtcbiAgICAgICAgICBjb25zdCBmaXJzdERpc3BsYXllZEJ1bGxldCA9IGJ1bGxldHNbZmlyc3RJbmRleF07XG4gICAgICAgICAgY29uc3QgbGFzdERpc3BsYXllZEJ1bGxldCA9IGJ1bGxldHNbbGFzdEluZGV4XTtcbiAgICAgICAgICBmb3IgKGxldCBpID0gZmlyc3RJbmRleDsgaSA8PSBsYXN0SW5kZXg7IGkgKz0gMSkge1xuICAgICAgICAgICAgaWYgKGJ1bGxldHNbaV0pIHtcbiAgICAgICAgICAgICAgYnVsbGV0c1tpXS5jbGFzc0xpc3QuYWRkKC4uLmAke3BhcmFtcy5idWxsZXRBY3RpdmVDbGFzc30tbWFpbmAuc3BsaXQoJyAnKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHNldFNpZGVCdWxsZXRzKGZpcnN0RGlzcGxheWVkQnVsbGV0LCAncHJldicpO1xuICAgICAgICAgIHNldFNpZGVCdWxsZXRzKGxhc3REaXNwbGF5ZWRCdWxsZXQsICduZXh0Jyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChwYXJhbXMuZHluYW1pY0J1bGxldHMpIHtcbiAgICAgICAgY29uc3QgZHluYW1pY0J1bGxldHNMZW5ndGggPSBNYXRoLm1pbihidWxsZXRzLmxlbmd0aCwgcGFyYW1zLmR5bmFtaWNNYWluQnVsbGV0cyArIDQpO1xuICAgICAgICBjb25zdCBidWxsZXRzT2Zmc2V0ID0gKGJ1bGxldFNpemUgKiBkeW5hbWljQnVsbGV0c0xlbmd0aCAtIGJ1bGxldFNpemUpIC8gMiAtIG1pZEluZGV4ICogYnVsbGV0U2l6ZTtcbiAgICAgICAgY29uc3Qgb2Zmc2V0UHJvcCA9IHJ0bCA/ICdyaWdodCcgOiAnbGVmdCc7XG4gICAgICAgIGJ1bGxldHMuZm9yRWFjaChidWxsZXQgPT4ge1xuICAgICAgICAgIGJ1bGxldC5zdHlsZVtzd2lwZXIuaXNIb3Jpem9udGFsKCkgPyBvZmZzZXRQcm9wIDogJ3RvcCddID0gYCR7YnVsbGV0c09mZnNldH1weGA7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBlbC5mb3JFYWNoKChzdWJFbCwgc3ViRWxJbmRleCkgPT4ge1xuICAgICAgaWYgKHBhcmFtcy50eXBlID09PSAnZnJhY3Rpb24nKSB7XG4gICAgICAgIHN1YkVsLnF1ZXJ5U2VsZWN0b3JBbGwoY2xhc3Nlc1RvU2VsZWN0b3IocGFyYW1zLmN1cnJlbnRDbGFzcykpLmZvckVhY2goZnJhY3Rpb25FbCA9PiB7XG4gICAgICAgICAgZnJhY3Rpb25FbC50ZXh0Q29udGVudCA9IHBhcmFtcy5mb3JtYXRGcmFjdGlvbkN1cnJlbnQoY3VycmVudCArIDEpO1xuICAgICAgICB9KTtcbiAgICAgICAgc3ViRWwucXVlcnlTZWxlY3RvckFsbChjbGFzc2VzVG9TZWxlY3RvcihwYXJhbXMudG90YWxDbGFzcykpLmZvckVhY2godG90YWxFbCA9PiB7XG4gICAgICAgICAgdG90YWxFbC50ZXh0Q29udGVudCA9IHBhcmFtcy5mb3JtYXRGcmFjdGlvblRvdGFsKHRvdGFsKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAocGFyYW1zLnR5cGUgPT09ICdwcm9ncmVzc2JhcicpIHtcbiAgICAgICAgbGV0IHByb2dyZXNzYmFyRGlyZWN0aW9uO1xuICAgICAgICBpZiAocGFyYW1zLnByb2dyZXNzYmFyT3Bwb3NpdGUpIHtcbiAgICAgICAgICBwcm9ncmVzc2JhckRpcmVjdGlvbiA9IHN3aXBlci5pc0hvcml6b250YWwoKSA/ICd2ZXJ0aWNhbCcgOiAnaG9yaXpvbnRhbCc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcHJvZ3Jlc3NiYXJEaXJlY3Rpb24gPSBzd2lwZXIuaXNIb3Jpem9udGFsKCkgPyAnaG9yaXpvbnRhbCcgOiAndmVydGljYWwnO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNjYWxlID0gKGN1cnJlbnQgKyAxKSAvIHRvdGFsO1xuICAgICAgICBsZXQgc2NhbGVYID0gMTtcbiAgICAgICAgbGV0IHNjYWxlWSA9IDE7XG4gICAgICAgIGlmIChwcm9ncmVzc2JhckRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICAgICAgc2NhbGVYID0gc2NhbGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2NhbGVZID0gc2NhbGU7XG4gICAgICAgIH1cbiAgICAgICAgc3ViRWwucXVlcnlTZWxlY3RvckFsbChjbGFzc2VzVG9TZWxlY3RvcihwYXJhbXMucHJvZ3Jlc3NiYXJGaWxsQ2xhc3MpKS5mb3JFYWNoKHByb2dyZXNzRWwgPT4ge1xuICAgICAgICAgIHByb2dyZXNzRWwuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZTNkKDAsMCwwKSBzY2FsZVgoJHtzY2FsZVh9KSBzY2FsZVkoJHtzY2FsZVl9KWA7XG4gICAgICAgICAgcHJvZ3Jlc3NFbC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSBgJHtzd2lwZXIucGFyYW1zLnNwZWVkfW1zYDtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAocGFyYW1zLnR5cGUgPT09ICdjdXN0b20nICYmIHBhcmFtcy5yZW5kZXJDdXN0b20pIHtcbiAgICAgICAgc3ViRWwuaW5uZXJIVE1MID0gcGFyYW1zLnJlbmRlckN1c3RvbShzd2lwZXIsIGN1cnJlbnQgKyAxLCB0b3RhbCk7XG4gICAgICAgIGlmIChzdWJFbEluZGV4ID09PSAwKSBlbWl0KCdwYWdpbmF0aW9uUmVuZGVyJywgc3ViRWwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHN1YkVsSW5kZXggPT09IDApIGVtaXQoJ3BhZ2luYXRpb25SZW5kZXInLCBzdWJFbCk7XG4gICAgICAgIGVtaXQoJ3BhZ2luYXRpb25VcGRhdGUnLCBzdWJFbCk7XG4gICAgICB9XG4gICAgICBpZiAoc3dpcGVyLnBhcmFtcy53YXRjaE92ZXJmbG93ICYmIHN3aXBlci5lbmFibGVkKSB7XG4gICAgICAgIHN1YkVsLmNsYXNzTGlzdFtzd2lwZXIuaXNMb2NrZWQgPyAnYWRkJyA6ICdyZW1vdmUnXShwYXJhbXMubG9ja0NsYXNzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgLy8gUmVuZGVyIENvbnRhaW5lclxuICAgIGNvbnN0IHBhcmFtcyA9IHN3aXBlci5wYXJhbXMucGFnaW5hdGlvbjtcbiAgICBpZiAoaXNQYWdpbmF0aW9uRGlzYWJsZWQoKSkgcmV0dXJuO1xuICAgIGNvbnN0IHNsaWRlc0xlbmd0aCA9IHN3aXBlci52aXJ0dWFsICYmIHN3aXBlci5wYXJhbXMudmlydHVhbC5lbmFibGVkID8gc3dpcGVyLnZpcnR1YWwuc2xpZGVzLmxlbmd0aCA6IHN3aXBlci5ncmlkICYmIHN3aXBlci5wYXJhbXMuZ3JpZC5yb3dzID4gMSA/IHN3aXBlci5zbGlkZXMubGVuZ3RoIC8gTWF0aC5jZWlsKHN3aXBlci5wYXJhbXMuZ3JpZC5yb3dzKSA6IHN3aXBlci5zbGlkZXMubGVuZ3RoO1xuICAgIGxldCBlbCA9IHN3aXBlci5wYWdpbmF0aW9uLmVsO1xuICAgIGVsID0gbWFrZUVsZW1lbnRzQXJyYXkoZWwpO1xuICAgIGxldCBwYWdpbmF0aW9uSFRNTCA9ICcnO1xuICAgIGlmIChwYXJhbXMudHlwZSA9PT0gJ2J1bGxldHMnKSB7XG4gICAgICBsZXQgbnVtYmVyT2ZCdWxsZXRzID0gc3dpcGVyLnBhcmFtcy5sb29wID8gTWF0aC5jZWlsKHNsaWRlc0xlbmd0aCAvIHN3aXBlci5wYXJhbXMuc2xpZGVzUGVyR3JvdXApIDogc3dpcGVyLnNuYXBHcmlkLmxlbmd0aDtcbiAgICAgIGlmIChzd2lwZXIucGFyYW1zLmZyZWVNb2RlICYmIHN3aXBlci5wYXJhbXMuZnJlZU1vZGUuZW5hYmxlZCAmJiBudW1iZXJPZkJ1bGxldHMgPiBzbGlkZXNMZW5ndGgpIHtcbiAgICAgICAgbnVtYmVyT2ZCdWxsZXRzID0gc2xpZGVzTGVuZ3RoO1xuICAgICAgfVxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1iZXJPZkJ1bGxldHM7IGkgKz0gMSkge1xuICAgICAgICBpZiAocGFyYW1zLnJlbmRlckJ1bGxldCkge1xuICAgICAgICAgIHBhZ2luYXRpb25IVE1MICs9IHBhcmFtcy5yZW5kZXJCdWxsZXQuY2FsbChzd2lwZXIsIGksIHBhcmFtcy5idWxsZXRDbGFzcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gcHJldHRpZXItaWdub3JlXG4gICAgICAgICAgcGFnaW5hdGlvbkhUTUwgKz0gYDwke3BhcmFtcy5idWxsZXRFbGVtZW50fSAke3N3aXBlci5pc0VsZW1lbnQgPyAncGFydD1cImJ1bGxldFwiJyA6ICcnfSBjbGFzcz1cIiR7cGFyYW1zLmJ1bGxldENsYXNzfVwiPjwvJHtwYXJhbXMuYnVsbGV0RWxlbWVudH0+YDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAocGFyYW1zLnR5cGUgPT09ICdmcmFjdGlvbicpIHtcbiAgICAgIGlmIChwYXJhbXMucmVuZGVyRnJhY3Rpb24pIHtcbiAgICAgICAgcGFnaW5hdGlvbkhUTUwgPSBwYXJhbXMucmVuZGVyRnJhY3Rpb24uY2FsbChzd2lwZXIsIHBhcmFtcy5jdXJyZW50Q2xhc3MsIHBhcmFtcy50b3RhbENsYXNzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhZ2luYXRpb25IVE1MID0gYDxzcGFuIGNsYXNzPVwiJHtwYXJhbXMuY3VycmVudENsYXNzfVwiPjwvc3Bhbj5gICsgJyAvICcgKyBgPHNwYW4gY2xhc3M9XCIke3BhcmFtcy50b3RhbENsYXNzfVwiPjwvc3Bhbj5gO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAocGFyYW1zLnR5cGUgPT09ICdwcm9ncmVzc2JhcicpIHtcbiAgICAgIGlmIChwYXJhbXMucmVuZGVyUHJvZ3Jlc3NiYXIpIHtcbiAgICAgICAgcGFnaW5hdGlvbkhUTUwgPSBwYXJhbXMucmVuZGVyUHJvZ3Jlc3NiYXIuY2FsbChzd2lwZXIsIHBhcmFtcy5wcm9ncmVzc2JhckZpbGxDbGFzcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYWdpbmF0aW9uSFRNTCA9IGA8c3BhbiBjbGFzcz1cIiR7cGFyYW1zLnByb2dyZXNzYmFyRmlsbENsYXNzfVwiPjwvc3Bhbj5gO1xuICAgICAgfVxuICAgIH1cbiAgICBzd2lwZXIucGFnaW5hdGlvbi5idWxsZXRzID0gW107XG4gICAgZWwuZm9yRWFjaChzdWJFbCA9PiB7XG4gICAgICBpZiAocGFyYW1zLnR5cGUgIT09ICdjdXN0b20nKSB7XG4gICAgICAgIHN1YkVsLmlubmVySFRNTCA9IHBhZ2luYXRpb25IVE1MIHx8ICcnO1xuICAgICAgfVxuICAgICAgaWYgKHBhcmFtcy50eXBlID09PSAnYnVsbGV0cycpIHtcbiAgICAgICAgc3dpcGVyLnBhZ2luYXRpb24uYnVsbGV0cy5wdXNoKC4uLnN1YkVsLnF1ZXJ5U2VsZWN0b3JBbGwoY2xhc3Nlc1RvU2VsZWN0b3IocGFyYW1zLmJ1bGxldENsYXNzKSkpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChwYXJhbXMudHlwZSAhPT0gJ2N1c3RvbScpIHtcbiAgICAgIGVtaXQoJ3BhZ2luYXRpb25SZW5kZXInLCBlbFswXSk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgc3dpcGVyLnBhcmFtcy5wYWdpbmF0aW9uID0gY3JlYXRlRWxlbWVudElmTm90RGVmaW5lZChzd2lwZXIsIHN3aXBlci5vcmlnaW5hbFBhcmFtcy5wYWdpbmF0aW9uLCBzd2lwZXIucGFyYW1zLnBhZ2luYXRpb24sIHtcbiAgICAgIGVsOiAnc3dpcGVyLXBhZ2luYXRpb24nXG4gICAgfSk7XG4gICAgY29uc3QgcGFyYW1zID0gc3dpcGVyLnBhcmFtcy5wYWdpbmF0aW9uO1xuICAgIGlmICghcGFyYW1zLmVsKSByZXR1cm47XG4gICAgbGV0IGVsO1xuICAgIGlmICh0eXBlb2YgcGFyYW1zLmVsID09PSAnc3RyaW5nJyAmJiBzd2lwZXIuaXNFbGVtZW50KSB7XG4gICAgICBlbCA9IHN3aXBlci5lbC5xdWVyeVNlbGVjdG9yKHBhcmFtcy5lbCk7XG4gICAgfVxuICAgIGlmICghZWwgJiYgdHlwZW9mIHBhcmFtcy5lbCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGVsID0gWy4uLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwocGFyYW1zLmVsKV07XG4gICAgfVxuICAgIGlmICghZWwpIHtcbiAgICAgIGVsID0gcGFyYW1zLmVsO1xuICAgIH1cbiAgICBpZiAoIWVsIHx8IGVsLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgIGlmIChzd2lwZXIucGFyYW1zLnVuaXF1ZU5hdkVsZW1lbnRzICYmIHR5cGVvZiBwYXJhbXMuZWwgPT09ICdzdHJpbmcnICYmIEFycmF5LmlzQXJyYXkoZWwpICYmIGVsLmxlbmd0aCA+IDEpIHtcbiAgICAgIGVsID0gWy4uLnN3aXBlci5lbC5xdWVyeVNlbGVjdG9yQWxsKHBhcmFtcy5lbCldO1xuICAgICAgLy8gY2hlY2sgaWYgaXQgYmVsb25ncyB0byBhbm90aGVyIG5lc3RlZCBTd2lwZXJcbiAgICAgIGlmIChlbC5sZW5ndGggPiAxKSB7XG4gICAgICAgIGVsID0gZWwuZmlsdGVyKHN1YkVsID0+IHtcbiAgICAgICAgICBpZiAoZWxlbWVudFBhcmVudHMoc3ViRWwsICcuc3dpcGVyJylbMF0gIT09IHN3aXBlci5lbCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9KVswXTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZWwpICYmIGVsLmxlbmd0aCA9PT0gMSkgZWwgPSBlbFswXTtcbiAgICBPYmplY3QuYXNzaWduKHN3aXBlci5wYWdpbmF0aW9uLCB7XG4gICAgICBlbFxuICAgIH0pO1xuICAgIGVsID0gbWFrZUVsZW1lbnRzQXJyYXkoZWwpO1xuICAgIGVsLmZvckVhY2goc3ViRWwgPT4ge1xuICAgICAgaWYgKHBhcmFtcy50eXBlID09PSAnYnVsbGV0cycgJiYgcGFyYW1zLmNsaWNrYWJsZSkge1xuICAgICAgICBzdWJFbC5jbGFzc0xpc3QuYWRkKC4uLihwYXJhbXMuY2xpY2thYmxlQ2xhc3MgfHwgJycpLnNwbGl0KCcgJykpO1xuICAgICAgfVxuICAgICAgc3ViRWwuY2xhc3NMaXN0LmFkZChwYXJhbXMubW9kaWZpZXJDbGFzcyArIHBhcmFtcy50eXBlKTtcbiAgICAgIHN1YkVsLmNsYXNzTGlzdC5hZGQoc3dpcGVyLmlzSG9yaXpvbnRhbCgpID8gcGFyYW1zLmhvcml6b250YWxDbGFzcyA6IHBhcmFtcy52ZXJ0aWNhbENsYXNzKTtcbiAgICAgIGlmIChwYXJhbXMudHlwZSA9PT0gJ2J1bGxldHMnICYmIHBhcmFtcy5keW5hbWljQnVsbGV0cykge1xuICAgICAgICBzdWJFbC5jbGFzc0xpc3QuYWRkKGAke3BhcmFtcy5tb2RpZmllckNsYXNzfSR7cGFyYW1zLnR5cGV9LWR5bmFtaWNgKTtcbiAgICAgICAgZHluYW1pY0J1bGxldEluZGV4ID0gMDtcbiAgICAgICAgaWYgKHBhcmFtcy5keW5hbWljTWFpbkJ1bGxldHMgPCAxKSB7XG4gICAgICAgICAgcGFyYW1zLmR5bmFtaWNNYWluQnVsbGV0cyA9IDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChwYXJhbXMudHlwZSA9PT0gJ3Byb2dyZXNzYmFyJyAmJiBwYXJhbXMucHJvZ3Jlc3NiYXJPcHBvc2l0ZSkge1xuICAgICAgICBzdWJFbC5jbGFzc0xpc3QuYWRkKHBhcmFtcy5wcm9ncmVzc2Jhck9wcG9zaXRlQ2xhc3MpO1xuICAgICAgfVxuICAgICAgaWYgKHBhcmFtcy5jbGlja2FibGUpIHtcbiAgICAgICAgc3ViRWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbkJ1bGxldENsaWNrKTtcbiAgICAgIH1cbiAgICAgIGlmICghc3dpcGVyLmVuYWJsZWQpIHtcbiAgICAgICAgc3ViRWwuY2xhc3NMaXN0LmFkZChwYXJhbXMubG9ja0NsYXNzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgIGNvbnN0IHBhcmFtcyA9IHN3aXBlci5wYXJhbXMucGFnaW5hdGlvbjtcbiAgICBpZiAoaXNQYWdpbmF0aW9uRGlzYWJsZWQoKSkgcmV0dXJuO1xuICAgIGxldCBlbCA9IHN3aXBlci5wYWdpbmF0aW9uLmVsO1xuICAgIGlmIChlbCkge1xuICAgICAgZWwgPSBtYWtlRWxlbWVudHNBcnJheShlbCk7XG4gICAgICBlbC5mb3JFYWNoKHN1YkVsID0+IHtcbiAgICAgICAgc3ViRWwuY2xhc3NMaXN0LnJlbW92ZShwYXJhbXMuaGlkZGVuQ2xhc3MpO1xuICAgICAgICBzdWJFbC5jbGFzc0xpc3QucmVtb3ZlKHBhcmFtcy5tb2RpZmllckNsYXNzICsgcGFyYW1zLnR5cGUpO1xuICAgICAgICBzdWJFbC5jbGFzc0xpc3QucmVtb3ZlKHN3aXBlci5pc0hvcml6b250YWwoKSA/IHBhcmFtcy5ob3Jpem9udGFsQ2xhc3MgOiBwYXJhbXMudmVydGljYWxDbGFzcyk7XG4gICAgICAgIGlmIChwYXJhbXMuY2xpY2thYmxlKSB7XG4gICAgICAgICAgc3ViRWwuY2xhc3NMaXN0LnJlbW92ZSguLi4ocGFyYW1zLmNsaWNrYWJsZUNsYXNzIHx8ICcnKS5zcGxpdCgnICcpKTtcbiAgICAgICAgICBzdWJFbC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG9uQnVsbGV0Q2xpY2spO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKHN3aXBlci5wYWdpbmF0aW9uLmJ1bGxldHMpIHN3aXBlci5wYWdpbmF0aW9uLmJ1bGxldHMuZm9yRWFjaChzdWJFbCA9PiBzdWJFbC5jbGFzc0xpc3QucmVtb3ZlKC4uLnBhcmFtcy5idWxsZXRBY3RpdmVDbGFzcy5zcGxpdCgnICcpKSk7XG4gIH1cbiAgb24oJ2NoYW5nZURpcmVjdGlvbicsICgpID0+IHtcbiAgICBpZiAoIXN3aXBlci5wYWdpbmF0aW9uIHx8ICFzd2lwZXIucGFnaW5hdGlvbi5lbCkgcmV0dXJuO1xuICAgIGNvbnN0IHBhcmFtcyA9IHN3aXBlci5wYXJhbXMucGFnaW5hdGlvbjtcbiAgICBsZXQge1xuICAgICAgZWxcbiAgICB9ID0gc3dpcGVyLnBhZ2luYXRpb247XG4gICAgZWwgPSBtYWtlRWxlbWVudHNBcnJheShlbCk7XG4gICAgZWwuZm9yRWFjaChzdWJFbCA9PiB7XG4gICAgICBzdWJFbC5jbGFzc0xpc3QucmVtb3ZlKHBhcmFtcy5ob3Jpem9udGFsQ2xhc3MsIHBhcmFtcy52ZXJ0aWNhbENsYXNzKTtcbiAgICAgIHN1YkVsLmNsYXNzTGlzdC5hZGQoc3dpcGVyLmlzSG9yaXpvbnRhbCgpID8gcGFyYW1zLmhvcml6b250YWxDbGFzcyA6IHBhcmFtcy52ZXJ0aWNhbENsYXNzKTtcbiAgICB9KTtcbiAgfSk7XG4gIG9uKCdpbml0JywgKCkgPT4ge1xuICAgIGlmIChzd2lwZXIucGFyYW1zLnBhZ2luYXRpb24uZW5hYmxlZCA9PT0gZmFsc2UpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgICAgZGlzYWJsZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpbml0KCk7XG4gICAgICByZW5kZXIoKTtcbiAgICAgIHVwZGF0ZSgpO1xuICAgIH1cbiAgfSk7XG4gIG9uKCdhY3RpdmVJbmRleENoYW5nZScsICgpID0+IHtcbiAgICBpZiAodHlwZW9mIHN3aXBlci5zbmFwSW5kZXggPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB1cGRhdGUoKTtcbiAgICB9XG4gIH0pO1xuICBvbignc25hcEluZGV4Q2hhbmdlJywgKCkgPT4ge1xuICAgIHVwZGF0ZSgpO1xuICB9KTtcbiAgb24oJ3NuYXBHcmlkTGVuZ3RoQ2hhbmdlJywgKCkgPT4ge1xuICAgIHJlbmRlcigpO1xuICAgIHVwZGF0ZSgpO1xuICB9KTtcbiAgb24oJ2Rlc3Ryb3knLCAoKSA9PiB7XG4gICAgZGVzdHJveSgpO1xuICB9KTtcbiAgb24oJ2VuYWJsZSBkaXNhYmxlJywgKCkgPT4ge1xuICAgIGxldCB7XG4gICAgICBlbFxuICAgIH0gPSBzd2lwZXIucGFnaW5hdGlvbjtcbiAgICBpZiAoZWwpIHtcbiAgICAgIGVsID0gbWFrZUVsZW1lbnRzQXJyYXkoZWwpO1xuICAgICAgZWwuZm9yRWFjaChzdWJFbCA9PiBzdWJFbC5jbGFzc0xpc3Rbc3dpcGVyLmVuYWJsZWQgPyAncmVtb3ZlJyA6ICdhZGQnXShzd2lwZXIucGFyYW1zLnBhZ2luYXRpb24ubG9ja0NsYXNzKSk7XG4gICAgfVxuICB9KTtcbiAgb24oJ2xvY2sgdW5sb2NrJywgKCkgPT4ge1xuICAgIHVwZGF0ZSgpO1xuICB9KTtcbiAgb24oJ2NsaWNrJywgKF9zLCBlKSA9PiB7XG4gICAgY29uc3QgdGFyZ2V0RWwgPSBlLnRhcmdldDtcbiAgICBjb25zdCBlbCA9IG1ha2VFbGVtZW50c0FycmF5KHN3aXBlci5wYWdpbmF0aW9uLmVsKTtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5wYWdpbmF0aW9uLmVsICYmIHN3aXBlci5wYXJhbXMucGFnaW5hdGlvbi5oaWRlT25DbGljayAmJiBlbCAmJiBlbC5sZW5ndGggPiAwICYmICF0YXJnZXRFbC5jbGFzc0xpc3QuY29udGFpbnMoc3dpcGVyLnBhcmFtcy5wYWdpbmF0aW9uLmJ1bGxldENsYXNzKSkge1xuICAgICAgaWYgKHN3aXBlci5uYXZpZ2F0aW9uICYmIChzd2lwZXIubmF2aWdhdGlvbi5uZXh0RWwgJiYgdGFyZ2V0RWwgPT09IHN3aXBlci5uYXZpZ2F0aW9uLm5leHRFbCB8fCBzd2lwZXIubmF2aWdhdGlvbi5wcmV2RWwgJiYgdGFyZ2V0RWwgPT09IHN3aXBlci5uYXZpZ2F0aW9uLnByZXZFbCkpIHJldHVybjtcbiAgICAgIGNvbnN0IGlzSGlkZGVuID0gZWxbMF0uY2xhc3NMaXN0LmNvbnRhaW5zKHN3aXBlci5wYXJhbXMucGFnaW5hdGlvbi5oaWRkZW5DbGFzcyk7XG4gICAgICBpZiAoaXNIaWRkZW4gPT09IHRydWUpIHtcbiAgICAgICAgZW1pdCgncGFnaW5hdGlvblNob3cnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVtaXQoJ3BhZ2luYXRpb25IaWRlJyk7XG4gICAgICB9XG4gICAgICBlbC5mb3JFYWNoKHN1YkVsID0+IHN1YkVsLmNsYXNzTGlzdC50b2dnbGUoc3dpcGVyLnBhcmFtcy5wYWdpbmF0aW9uLmhpZGRlbkNsYXNzKSk7XG4gICAgfVxuICB9KTtcbiAgY29uc3QgZW5hYmxlID0gKCkgPT4ge1xuICAgIHN3aXBlci5lbC5jbGFzc0xpc3QucmVtb3ZlKHN3aXBlci5wYXJhbXMucGFnaW5hdGlvbi5wYWdpbmF0aW9uRGlzYWJsZWRDbGFzcyk7XG4gICAgbGV0IHtcbiAgICAgIGVsXG4gICAgfSA9IHN3aXBlci5wYWdpbmF0aW9uO1xuICAgIGlmIChlbCkge1xuICAgICAgZWwgPSBtYWtlRWxlbWVudHNBcnJheShlbCk7XG4gICAgICBlbC5mb3JFYWNoKHN1YkVsID0+IHN1YkVsLmNsYXNzTGlzdC5yZW1vdmUoc3dpcGVyLnBhcmFtcy5wYWdpbmF0aW9uLnBhZ2luYXRpb25EaXNhYmxlZENsYXNzKSk7XG4gICAgfVxuICAgIGluaXQoKTtcbiAgICByZW5kZXIoKTtcbiAgICB1cGRhdGUoKTtcbiAgfTtcbiAgY29uc3QgZGlzYWJsZSA9ICgpID0+IHtcbiAgICBzd2lwZXIuZWwuY2xhc3NMaXN0LmFkZChzd2lwZXIucGFyYW1zLnBhZ2luYXRpb24ucGFnaW5hdGlvbkRpc2FibGVkQ2xhc3MpO1xuICAgIGxldCB7XG4gICAgICBlbFxuICAgIH0gPSBzd2lwZXIucGFnaW5hdGlvbjtcbiAgICBpZiAoZWwpIHtcbiAgICAgIGVsID0gbWFrZUVsZW1lbnRzQXJyYXkoZWwpO1xuICAgICAgZWwuZm9yRWFjaChzdWJFbCA9PiBzdWJFbC5jbGFzc0xpc3QuYWRkKHN3aXBlci5wYXJhbXMucGFnaW5hdGlvbi5wYWdpbmF0aW9uRGlzYWJsZWRDbGFzcykpO1xuICAgIH1cbiAgICBkZXN0cm95KCk7XG4gIH07XG4gIE9iamVjdC5hc3NpZ24oc3dpcGVyLnBhZ2luYXRpb24sIHtcbiAgICBlbmFibGUsXG4gICAgZGlzYWJsZSxcbiAgICByZW5kZXIsXG4gICAgdXBkYXRlLFxuICAgIGluaXQsXG4gICAgZGVzdHJveVxuICB9KTtcbn1cblxuZXhwb3J0IHsgUGFnaW5hdGlvbiBhcyBkZWZhdWx0IH07XG4iLCJpbXBvcnQgeyBnIGFzIGdldERvY3VtZW50IH0gZnJvbSAnLi4vc2hhcmVkL3Nzci13aW5kb3cuZXNtLm1qcyc7XG5pbXBvcnQgeyBoIGFzIGNsYXNzZXNUb1Rva2VucywgYyBhcyBjcmVhdGVFbGVtZW50LCBuIGFzIG5leHRUaWNrLCBiIGFzIGVsZW1lbnRPZmZzZXQgfSBmcm9tICcuLi9zaGFyZWQvdXRpbHMubWpzJztcbmltcG9ydCB7IGMgYXMgY3JlYXRlRWxlbWVudElmTm90RGVmaW5lZCB9IGZyb20gJy4uL3NoYXJlZC9jcmVhdGUtZWxlbWVudC1pZi1ub3QtZGVmaW5lZC5tanMnO1xuaW1wb3J0IHsgYyBhcyBjbGFzc2VzVG9TZWxlY3RvciB9IGZyb20gJy4uL3NoYXJlZC9jbGFzc2VzLXRvLXNlbGVjdG9yLm1qcyc7XG5cbmZ1bmN0aW9uIFNjcm9sbGJhcihfcmVmKSB7XG4gIGxldCB7XG4gICAgc3dpcGVyLFxuICAgIGV4dGVuZFBhcmFtcyxcbiAgICBvbixcbiAgICBlbWl0XG4gIH0gPSBfcmVmO1xuICBjb25zdCBkb2N1bWVudCA9IGdldERvY3VtZW50KCk7XG4gIGxldCBpc1RvdWNoZWQgPSBmYWxzZTtcbiAgbGV0IHRpbWVvdXQgPSBudWxsO1xuICBsZXQgZHJhZ1RpbWVvdXQgPSBudWxsO1xuICBsZXQgZHJhZ1N0YXJ0UG9zO1xuICBsZXQgZHJhZ1NpemU7XG4gIGxldCB0cmFja1NpemU7XG4gIGxldCBkaXZpZGVyO1xuICBleHRlbmRQYXJhbXMoe1xuICAgIHNjcm9sbGJhcjoge1xuICAgICAgZWw6IG51bGwsXG4gICAgICBkcmFnU2l6ZTogJ2F1dG8nLFxuICAgICAgaGlkZTogZmFsc2UsXG4gICAgICBkcmFnZ2FibGU6IGZhbHNlLFxuICAgICAgc25hcE9uUmVsZWFzZTogdHJ1ZSxcbiAgICAgIGxvY2tDbGFzczogJ3N3aXBlci1zY3JvbGxiYXItbG9jaycsXG4gICAgICBkcmFnQ2xhc3M6ICdzd2lwZXItc2Nyb2xsYmFyLWRyYWcnLFxuICAgICAgc2Nyb2xsYmFyRGlzYWJsZWRDbGFzczogJ3N3aXBlci1zY3JvbGxiYXItZGlzYWJsZWQnLFxuICAgICAgaG9yaXpvbnRhbENsYXNzOiBgc3dpcGVyLXNjcm9sbGJhci1ob3Jpem9udGFsYCxcbiAgICAgIHZlcnRpY2FsQ2xhc3M6IGBzd2lwZXItc2Nyb2xsYmFyLXZlcnRpY2FsYFxuICAgIH1cbiAgfSk7XG4gIHN3aXBlci5zY3JvbGxiYXIgPSB7XG4gICAgZWw6IG51bGwsXG4gICAgZHJhZ0VsOiBudWxsXG4gIH07XG4gIGZ1bmN0aW9uIHNldFRyYW5zbGF0ZSgpIHtcbiAgICBpZiAoIXN3aXBlci5wYXJhbXMuc2Nyb2xsYmFyLmVsIHx8ICFzd2lwZXIuc2Nyb2xsYmFyLmVsKSByZXR1cm47XG4gICAgY29uc3Qge1xuICAgICAgc2Nyb2xsYmFyLFxuICAgICAgcnRsVHJhbnNsYXRlOiBydGxcbiAgICB9ID0gc3dpcGVyO1xuICAgIGNvbnN0IHtcbiAgICAgIGRyYWdFbCxcbiAgICAgIGVsXG4gICAgfSA9IHNjcm9sbGJhcjtcbiAgICBjb25zdCBwYXJhbXMgPSBzd2lwZXIucGFyYW1zLnNjcm9sbGJhcjtcbiAgICBjb25zdCBwcm9ncmVzcyA9IHN3aXBlci5wYXJhbXMubG9vcCA/IHN3aXBlci5wcm9ncmVzc0xvb3AgOiBzd2lwZXIucHJvZ3Jlc3M7XG4gICAgbGV0IG5ld1NpemUgPSBkcmFnU2l6ZTtcbiAgICBsZXQgbmV3UG9zID0gKHRyYWNrU2l6ZSAtIGRyYWdTaXplKSAqIHByb2dyZXNzO1xuICAgIGlmIChydGwpIHtcbiAgICAgIG5ld1BvcyA9IC1uZXdQb3M7XG4gICAgICBpZiAobmV3UG9zID4gMCkge1xuICAgICAgICBuZXdTaXplID0gZHJhZ1NpemUgLSBuZXdQb3M7XG4gICAgICAgIG5ld1BvcyA9IDA7XG4gICAgICB9IGVsc2UgaWYgKC1uZXdQb3MgKyBkcmFnU2l6ZSA+IHRyYWNrU2l6ZSkge1xuICAgICAgICBuZXdTaXplID0gdHJhY2tTaXplICsgbmV3UG9zO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAobmV3UG9zIDwgMCkge1xuICAgICAgbmV3U2l6ZSA9IGRyYWdTaXplICsgbmV3UG9zO1xuICAgICAgbmV3UG9zID0gMDtcbiAgICB9IGVsc2UgaWYgKG5ld1BvcyArIGRyYWdTaXplID4gdHJhY2tTaXplKSB7XG4gICAgICBuZXdTaXplID0gdHJhY2tTaXplIC0gbmV3UG9zO1xuICAgIH1cbiAgICBpZiAoc3dpcGVyLmlzSG9yaXpvbnRhbCgpKSB7XG4gICAgICBkcmFnRWwuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZTNkKCR7bmV3UG9zfXB4LCAwLCAwKWA7XG4gICAgICBkcmFnRWwuc3R5bGUud2lkdGggPSBgJHtuZXdTaXplfXB4YDtcbiAgICB9IGVsc2Uge1xuICAgICAgZHJhZ0VsLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUzZCgwcHgsICR7bmV3UG9zfXB4LCAwKWA7XG4gICAgICBkcmFnRWwuc3R5bGUuaGVpZ2h0ID0gYCR7bmV3U2l6ZX1weGA7XG4gICAgfVxuICAgIGlmIChwYXJhbXMuaGlkZSkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgZWwuc3R5bGUub3BhY2l0eSA9IDE7XG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGVsLnN0eWxlLm9wYWNpdHkgPSAwO1xuICAgICAgICBlbC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSAnNDAwbXMnO1xuICAgICAgfSwgMTAwMCk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIHNldFRyYW5zaXRpb24oZHVyYXRpb24pIHtcbiAgICBpZiAoIXN3aXBlci5wYXJhbXMuc2Nyb2xsYmFyLmVsIHx8ICFzd2lwZXIuc2Nyb2xsYmFyLmVsKSByZXR1cm47XG4gICAgc3dpcGVyLnNjcm9sbGJhci5kcmFnRWwuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gYCR7ZHVyYXRpb259bXNgO1xuICB9XG4gIGZ1bmN0aW9uIHVwZGF0ZVNpemUoKSB7XG4gICAgaWYgKCFzd2lwZXIucGFyYW1zLnNjcm9sbGJhci5lbCB8fCAhc3dpcGVyLnNjcm9sbGJhci5lbCkgcmV0dXJuO1xuICAgIGNvbnN0IHtcbiAgICAgIHNjcm9sbGJhclxuICAgIH0gPSBzd2lwZXI7XG4gICAgY29uc3Qge1xuICAgICAgZHJhZ0VsLFxuICAgICAgZWxcbiAgICB9ID0gc2Nyb2xsYmFyO1xuICAgIGRyYWdFbC5zdHlsZS53aWR0aCA9ICcnO1xuICAgIGRyYWdFbC5zdHlsZS5oZWlnaHQgPSAnJztcbiAgICB0cmFja1NpemUgPSBzd2lwZXIuaXNIb3Jpem9udGFsKCkgPyBlbC5vZmZzZXRXaWR0aCA6IGVsLm9mZnNldEhlaWdodDtcbiAgICBkaXZpZGVyID0gc3dpcGVyLnNpemUgLyAoc3dpcGVyLnZpcnR1YWxTaXplICsgc3dpcGVyLnBhcmFtcy5zbGlkZXNPZmZzZXRCZWZvcmUgLSAoc3dpcGVyLnBhcmFtcy5jZW50ZXJlZFNsaWRlcyA/IHN3aXBlci5zbmFwR3JpZFswXSA6IDApKTtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5zY3JvbGxiYXIuZHJhZ1NpemUgPT09ICdhdXRvJykge1xuICAgICAgZHJhZ1NpemUgPSB0cmFja1NpemUgKiBkaXZpZGVyO1xuICAgIH0gZWxzZSB7XG4gICAgICBkcmFnU2l6ZSA9IHBhcnNlSW50KHN3aXBlci5wYXJhbXMuc2Nyb2xsYmFyLmRyYWdTaXplLCAxMCk7XG4gICAgfVxuICAgIGlmIChzd2lwZXIuaXNIb3Jpem9udGFsKCkpIHtcbiAgICAgIGRyYWdFbC5zdHlsZS53aWR0aCA9IGAke2RyYWdTaXplfXB4YDtcbiAgICB9IGVsc2Uge1xuICAgICAgZHJhZ0VsLnN0eWxlLmhlaWdodCA9IGAke2RyYWdTaXplfXB4YDtcbiAgICB9XG4gICAgaWYgKGRpdmlkZXIgPj0gMSkge1xuICAgICAgZWwuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICB9IGVsc2Uge1xuICAgICAgZWwuc3R5bGUuZGlzcGxheSA9ICcnO1xuICAgIH1cbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5zY3JvbGxiYXIuaGlkZSkge1xuICAgICAgZWwuc3R5bGUub3BhY2l0eSA9IDA7XG4gICAgfVxuICAgIGlmIChzd2lwZXIucGFyYW1zLndhdGNoT3ZlcmZsb3cgJiYgc3dpcGVyLmVuYWJsZWQpIHtcbiAgICAgIHNjcm9sbGJhci5lbC5jbGFzc0xpc3Rbc3dpcGVyLmlzTG9ja2VkID8gJ2FkZCcgOiAncmVtb3ZlJ10oc3dpcGVyLnBhcmFtcy5zY3JvbGxiYXIubG9ja0NsYXNzKTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gZ2V0UG9pbnRlclBvc2l0aW9uKGUpIHtcbiAgICByZXR1cm4gc3dpcGVyLmlzSG9yaXpvbnRhbCgpID8gZS5jbGllbnRYIDogZS5jbGllbnRZO1xuICB9XG4gIGZ1bmN0aW9uIHNldERyYWdQb3NpdGlvbihlKSB7XG4gICAgY29uc3Qge1xuICAgICAgc2Nyb2xsYmFyLFxuICAgICAgcnRsVHJhbnNsYXRlOiBydGxcbiAgICB9ID0gc3dpcGVyO1xuICAgIGNvbnN0IHtcbiAgICAgIGVsXG4gICAgfSA9IHNjcm9sbGJhcjtcbiAgICBsZXQgcG9zaXRpb25SYXRpbztcbiAgICBwb3NpdGlvblJhdGlvID0gKGdldFBvaW50ZXJQb3NpdGlvbihlKSAtIGVsZW1lbnRPZmZzZXQoZWwpW3N3aXBlci5pc0hvcml6b250YWwoKSA/ICdsZWZ0JyA6ICd0b3AnXSAtIChkcmFnU3RhcnRQb3MgIT09IG51bGwgPyBkcmFnU3RhcnRQb3MgOiBkcmFnU2l6ZSAvIDIpKSAvICh0cmFja1NpemUgLSBkcmFnU2l6ZSk7XG4gICAgcG9zaXRpb25SYXRpbyA9IE1hdGgubWF4KE1hdGgubWluKHBvc2l0aW9uUmF0aW8sIDEpLCAwKTtcbiAgICBpZiAocnRsKSB7XG4gICAgICBwb3NpdGlvblJhdGlvID0gMSAtIHBvc2l0aW9uUmF0aW87XG4gICAgfVxuICAgIGNvbnN0IHBvc2l0aW9uID0gc3dpcGVyLm1pblRyYW5zbGF0ZSgpICsgKHN3aXBlci5tYXhUcmFuc2xhdGUoKSAtIHN3aXBlci5taW5UcmFuc2xhdGUoKSkgKiBwb3NpdGlvblJhdGlvO1xuICAgIHN3aXBlci51cGRhdGVQcm9ncmVzcyhwb3NpdGlvbik7XG4gICAgc3dpcGVyLnNldFRyYW5zbGF0ZShwb3NpdGlvbik7XG4gICAgc3dpcGVyLnVwZGF0ZUFjdGl2ZUluZGV4KCk7XG4gICAgc3dpcGVyLnVwZGF0ZVNsaWRlc0NsYXNzZXMoKTtcbiAgfVxuICBmdW5jdGlvbiBvbkRyYWdTdGFydChlKSB7XG4gICAgY29uc3QgcGFyYW1zID0gc3dpcGVyLnBhcmFtcy5zY3JvbGxiYXI7XG4gICAgY29uc3Qge1xuICAgICAgc2Nyb2xsYmFyLFxuICAgICAgd3JhcHBlckVsXG4gICAgfSA9IHN3aXBlcjtcbiAgICBjb25zdCB7XG4gICAgICBlbCxcbiAgICAgIGRyYWdFbFxuICAgIH0gPSBzY3JvbGxiYXI7XG4gICAgaXNUb3VjaGVkID0gdHJ1ZTtcbiAgICBkcmFnU3RhcnRQb3MgPSBlLnRhcmdldCA9PT0gZHJhZ0VsID8gZ2V0UG9pbnRlclBvc2l0aW9uKGUpIC0gZS50YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClbc3dpcGVyLmlzSG9yaXpvbnRhbCgpID8gJ2xlZnQnIDogJ3RvcCddIDogbnVsbDtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB3cmFwcGVyRWwuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gJzEwMG1zJztcbiAgICBkcmFnRWwuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gJzEwMG1zJztcbiAgICBzZXREcmFnUG9zaXRpb24oZSk7XG4gICAgY2xlYXJUaW1lb3V0KGRyYWdUaW1lb3V0KTtcbiAgICBlbC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSAnMG1zJztcbiAgICBpZiAocGFyYW1zLmhpZGUpIHtcbiAgICAgIGVsLnN0eWxlLm9wYWNpdHkgPSAxO1xuICAgIH1cbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5jc3NNb2RlKSB7XG4gICAgICBzd2lwZXIud3JhcHBlckVsLnN0eWxlWydzY3JvbGwtc25hcC10eXBlJ10gPSAnbm9uZSc7XG4gICAgfVxuICAgIGVtaXQoJ3Njcm9sbGJhckRyYWdTdGFydCcsIGUpO1xuICB9XG4gIGZ1bmN0aW9uIG9uRHJhZ01vdmUoZSkge1xuICAgIGNvbnN0IHtcbiAgICAgIHNjcm9sbGJhcixcbiAgICAgIHdyYXBwZXJFbFxuICAgIH0gPSBzd2lwZXI7XG4gICAgY29uc3Qge1xuICAgICAgZWwsXG4gICAgICBkcmFnRWxcbiAgICB9ID0gc2Nyb2xsYmFyO1xuICAgIGlmICghaXNUb3VjaGVkKSByZXR1cm47XG4gICAgaWYgKGUucHJldmVudERlZmF1bHQpIGUucHJldmVudERlZmF1bHQoKTtlbHNlIGUucmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgICBzZXREcmFnUG9zaXRpb24oZSk7XG4gICAgd3JhcHBlckVsLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9ICcwbXMnO1xuICAgIGVsLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9ICcwbXMnO1xuICAgIGRyYWdFbC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSAnMG1zJztcbiAgICBlbWl0KCdzY3JvbGxiYXJEcmFnTW92ZScsIGUpO1xuICB9XG4gIGZ1bmN0aW9uIG9uRHJhZ0VuZChlKSB7XG4gICAgY29uc3QgcGFyYW1zID0gc3dpcGVyLnBhcmFtcy5zY3JvbGxiYXI7XG4gICAgY29uc3Qge1xuICAgICAgc2Nyb2xsYmFyLFxuICAgICAgd3JhcHBlckVsXG4gICAgfSA9IHN3aXBlcjtcbiAgICBjb25zdCB7XG4gICAgICBlbFxuICAgIH0gPSBzY3JvbGxiYXI7XG4gICAgaWYgKCFpc1RvdWNoZWQpIHJldHVybjtcbiAgICBpc1RvdWNoZWQgPSBmYWxzZTtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5jc3NNb2RlKSB7XG4gICAgICBzd2lwZXIud3JhcHBlckVsLnN0eWxlWydzY3JvbGwtc25hcC10eXBlJ10gPSAnJztcbiAgICAgIHdyYXBwZXJFbC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSAnJztcbiAgICB9XG4gICAgaWYgKHBhcmFtcy5oaWRlKSB7XG4gICAgICBjbGVhclRpbWVvdXQoZHJhZ1RpbWVvdXQpO1xuICAgICAgZHJhZ1RpbWVvdXQgPSBuZXh0VGljaygoKSA9PiB7XG4gICAgICAgIGVsLnN0eWxlLm9wYWNpdHkgPSAwO1xuICAgICAgICBlbC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSAnNDAwbXMnO1xuICAgICAgfSwgMTAwMCk7XG4gICAgfVxuICAgIGVtaXQoJ3Njcm9sbGJhckRyYWdFbmQnLCBlKTtcbiAgICBpZiAocGFyYW1zLnNuYXBPblJlbGVhc2UpIHtcbiAgICAgIHN3aXBlci5zbGlkZVRvQ2xvc2VzdCgpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBldmVudHMobWV0aG9kKSB7XG4gICAgY29uc3Qge1xuICAgICAgc2Nyb2xsYmFyLFxuICAgICAgcGFyYW1zXG4gICAgfSA9IHN3aXBlcjtcbiAgICBjb25zdCBlbCA9IHNjcm9sbGJhci5lbDtcbiAgICBpZiAoIWVsKSByZXR1cm47XG4gICAgY29uc3QgdGFyZ2V0ID0gZWw7XG4gICAgY29uc3QgYWN0aXZlTGlzdGVuZXIgPSBwYXJhbXMucGFzc2l2ZUxpc3RlbmVycyA/IHtcbiAgICAgIHBhc3NpdmU6IGZhbHNlLFxuICAgICAgY2FwdHVyZTogZmFsc2VcbiAgICB9IDogZmFsc2U7XG4gICAgY29uc3QgcGFzc2l2ZUxpc3RlbmVyID0gcGFyYW1zLnBhc3NpdmVMaXN0ZW5lcnMgPyB7XG4gICAgICBwYXNzaXZlOiB0cnVlLFxuICAgICAgY2FwdHVyZTogZmFsc2VcbiAgICB9IDogZmFsc2U7XG4gICAgaWYgKCF0YXJnZXQpIHJldHVybjtcbiAgICBjb25zdCBldmVudE1ldGhvZCA9IG1ldGhvZCA9PT0gJ29uJyA/ICdhZGRFdmVudExpc3RlbmVyJyA6ICdyZW1vdmVFdmVudExpc3RlbmVyJztcbiAgICB0YXJnZXRbZXZlbnRNZXRob2RdKCdwb2ludGVyZG93bicsIG9uRHJhZ1N0YXJ0LCBhY3RpdmVMaXN0ZW5lcik7XG4gICAgZG9jdW1lbnRbZXZlbnRNZXRob2RdKCdwb2ludGVybW92ZScsIG9uRHJhZ01vdmUsIGFjdGl2ZUxpc3RlbmVyKTtcbiAgICBkb2N1bWVudFtldmVudE1ldGhvZF0oJ3BvaW50ZXJ1cCcsIG9uRHJhZ0VuZCwgcGFzc2l2ZUxpc3RlbmVyKTtcbiAgfVxuICBmdW5jdGlvbiBlbmFibGVEcmFnZ2FibGUoKSB7XG4gICAgaWYgKCFzd2lwZXIucGFyYW1zLnNjcm9sbGJhci5lbCB8fCAhc3dpcGVyLnNjcm9sbGJhci5lbCkgcmV0dXJuO1xuICAgIGV2ZW50cygnb24nKTtcbiAgfVxuICBmdW5jdGlvbiBkaXNhYmxlRHJhZ2dhYmxlKCkge1xuICAgIGlmICghc3dpcGVyLnBhcmFtcy5zY3JvbGxiYXIuZWwgfHwgIXN3aXBlci5zY3JvbGxiYXIuZWwpIHJldHVybjtcbiAgICBldmVudHMoJ29mZicpO1xuICB9XG4gIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgY29uc3Qge1xuICAgICAgc2Nyb2xsYmFyLFxuICAgICAgZWw6IHN3aXBlckVsXG4gICAgfSA9IHN3aXBlcjtcbiAgICBzd2lwZXIucGFyYW1zLnNjcm9sbGJhciA9IGNyZWF0ZUVsZW1lbnRJZk5vdERlZmluZWQoc3dpcGVyLCBzd2lwZXIub3JpZ2luYWxQYXJhbXMuc2Nyb2xsYmFyLCBzd2lwZXIucGFyYW1zLnNjcm9sbGJhciwge1xuICAgICAgZWw6ICdzd2lwZXItc2Nyb2xsYmFyJ1xuICAgIH0pO1xuICAgIGNvbnN0IHBhcmFtcyA9IHN3aXBlci5wYXJhbXMuc2Nyb2xsYmFyO1xuICAgIGlmICghcGFyYW1zLmVsKSByZXR1cm47XG4gICAgbGV0IGVsO1xuICAgIGlmICh0eXBlb2YgcGFyYW1zLmVsID09PSAnc3RyaW5nJyAmJiBzd2lwZXIuaXNFbGVtZW50KSB7XG4gICAgICBlbCA9IHN3aXBlci5lbC5xdWVyeVNlbGVjdG9yKHBhcmFtcy5lbCk7XG4gICAgfVxuICAgIGlmICghZWwgJiYgdHlwZW9mIHBhcmFtcy5lbCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChwYXJhbXMuZWwpO1xuICAgICAgaWYgKCFlbC5sZW5ndGgpIHJldHVybjtcbiAgICB9IGVsc2UgaWYgKCFlbCkge1xuICAgICAgZWwgPSBwYXJhbXMuZWw7XG4gICAgfVxuICAgIGlmIChzd2lwZXIucGFyYW1zLnVuaXF1ZU5hdkVsZW1lbnRzICYmIHR5cGVvZiBwYXJhbXMuZWwgPT09ICdzdHJpbmcnICYmIGVsLmxlbmd0aCA+IDEgJiYgc3dpcGVyRWwucXVlcnlTZWxlY3RvckFsbChwYXJhbXMuZWwpLmxlbmd0aCA9PT0gMSkge1xuICAgICAgZWwgPSBzd2lwZXJFbC5xdWVyeVNlbGVjdG9yKHBhcmFtcy5lbCk7XG4gICAgfVxuICAgIGlmIChlbC5sZW5ndGggPiAwKSBlbCA9IGVsWzBdO1xuICAgIGVsLmNsYXNzTGlzdC5hZGQoc3dpcGVyLmlzSG9yaXpvbnRhbCgpID8gcGFyYW1zLmhvcml6b250YWxDbGFzcyA6IHBhcmFtcy52ZXJ0aWNhbENsYXNzKTtcbiAgICBsZXQgZHJhZ0VsO1xuICAgIGlmIChlbCkge1xuICAgICAgZHJhZ0VsID0gZWwucXVlcnlTZWxlY3RvcihjbGFzc2VzVG9TZWxlY3Rvcihzd2lwZXIucGFyYW1zLnNjcm9sbGJhci5kcmFnQ2xhc3MpKTtcbiAgICAgIGlmICghZHJhZ0VsKSB7XG4gICAgICAgIGRyYWdFbCA9IGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHN3aXBlci5wYXJhbXMuc2Nyb2xsYmFyLmRyYWdDbGFzcyk7XG4gICAgICAgIGVsLmFwcGVuZChkcmFnRWwpO1xuICAgICAgfVxuICAgIH1cbiAgICBPYmplY3QuYXNzaWduKHNjcm9sbGJhciwge1xuICAgICAgZWwsXG4gICAgICBkcmFnRWxcbiAgICB9KTtcbiAgICBpZiAocGFyYW1zLmRyYWdnYWJsZSkge1xuICAgICAgZW5hYmxlRHJhZ2dhYmxlKCk7XG4gICAgfVxuICAgIGlmIChlbCkge1xuICAgICAgZWwuY2xhc3NMaXN0W3N3aXBlci5lbmFibGVkID8gJ3JlbW92ZScgOiAnYWRkJ10oLi4uY2xhc3Nlc1RvVG9rZW5zKHN3aXBlci5wYXJhbXMuc2Nyb2xsYmFyLmxvY2tDbGFzcykpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgIGNvbnN0IHBhcmFtcyA9IHN3aXBlci5wYXJhbXMuc2Nyb2xsYmFyO1xuICAgIGNvbnN0IGVsID0gc3dpcGVyLnNjcm9sbGJhci5lbDtcbiAgICBpZiAoZWwpIHtcbiAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoLi4uY2xhc3Nlc1RvVG9rZW5zKHN3aXBlci5pc0hvcml6b250YWwoKSA/IHBhcmFtcy5ob3Jpem9udGFsQ2xhc3MgOiBwYXJhbXMudmVydGljYWxDbGFzcykpO1xuICAgIH1cbiAgICBkaXNhYmxlRHJhZ2dhYmxlKCk7XG4gIH1cbiAgb24oJ2luaXQnLCAoKSA9PiB7XG4gICAgaWYgKHN3aXBlci5wYXJhbXMuc2Nyb2xsYmFyLmVuYWJsZWQgPT09IGZhbHNlKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICAgIGRpc2FibGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaW5pdCgpO1xuICAgICAgdXBkYXRlU2l6ZSgpO1xuICAgICAgc2V0VHJhbnNsYXRlKCk7XG4gICAgfVxuICB9KTtcbiAgb24oJ3VwZGF0ZSByZXNpemUgb2JzZXJ2ZXJVcGRhdGUgbG9jayB1bmxvY2snLCAoKSA9PiB7XG4gICAgdXBkYXRlU2l6ZSgpO1xuICB9KTtcbiAgb24oJ3NldFRyYW5zbGF0ZScsICgpID0+IHtcbiAgICBzZXRUcmFuc2xhdGUoKTtcbiAgfSk7XG4gIG9uKCdzZXRUcmFuc2l0aW9uJywgKF9zLCBkdXJhdGlvbikgPT4ge1xuICAgIHNldFRyYW5zaXRpb24oZHVyYXRpb24pO1xuICB9KTtcbiAgb24oJ2VuYWJsZSBkaXNhYmxlJywgKCkgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIGVsXG4gICAgfSA9IHN3aXBlci5zY3JvbGxiYXI7XG4gICAgaWYgKGVsKSB7XG4gICAgICBlbC5jbGFzc0xpc3Rbc3dpcGVyLmVuYWJsZWQgPyAncmVtb3ZlJyA6ICdhZGQnXSguLi5jbGFzc2VzVG9Ub2tlbnMoc3dpcGVyLnBhcmFtcy5zY3JvbGxiYXIubG9ja0NsYXNzKSk7XG4gICAgfVxuICB9KTtcbiAgb24oJ2Rlc3Ryb3knLCAoKSA9PiB7XG4gICAgZGVzdHJveSgpO1xuICB9KTtcbiAgY29uc3QgZW5hYmxlID0gKCkgPT4ge1xuICAgIHN3aXBlci5lbC5jbGFzc0xpc3QucmVtb3ZlKC4uLmNsYXNzZXNUb1Rva2Vucyhzd2lwZXIucGFyYW1zLnNjcm9sbGJhci5zY3JvbGxiYXJEaXNhYmxlZENsYXNzKSk7XG4gICAgaWYgKHN3aXBlci5zY3JvbGxiYXIuZWwpIHtcbiAgICAgIHN3aXBlci5zY3JvbGxiYXIuZWwuY2xhc3NMaXN0LnJlbW92ZSguLi5jbGFzc2VzVG9Ub2tlbnMoc3dpcGVyLnBhcmFtcy5zY3JvbGxiYXIuc2Nyb2xsYmFyRGlzYWJsZWRDbGFzcykpO1xuICAgIH1cbiAgICBpbml0KCk7XG4gICAgdXBkYXRlU2l6ZSgpO1xuICAgIHNldFRyYW5zbGF0ZSgpO1xuICB9O1xuICBjb25zdCBkaXNhYmxlID0gKCkgPT4ge1xuICAgIHN3aXBlci5lbC5jbGFzc0xpc3QuYWRkKC4uLmNsYXNzZXNUb1Rva2Vucyhzd2lwZXIucGFyYW1zLnNjcm9sbGJhci5zY3JvbGxiYXJEaXNhYmxlZENsYXNzKSk7XG4gICAgaWYgKHN3aXBlci5zY3JvbGxiYXIuZWwpIHtcbiAgICAgIHN3aXBlci5zY3JvbGxiYXIuZWwuY2xhc3NMaXN0LmFkZCguLi5jbGFzc2VzVG9Ub2tlbnMoc3dpcGVyLnBhcmFtcy5zY3JvbGxiYXIuc2Nyb2xsYmFyRGlzYWJsZWRDbGFzcykpO1xuICAgIH1cbiAgICBkZXN0cm95KCk7XG4gIH07XG4gIE9iamVjdC5hc3NpZ24oc3dpcGVyLnNjcm9sbGJhciwge1xuICAgIGVuYWJsZSxcbiAgICBkaXNhYmxlLFxuICAgIHVwZGF0ZVNpemUsXG4gICAgc2V0VHJhbnNsYXRlLFxuICAgIGluaXQsXG4gICAgZGVzdHJveVxuICB9KTtcbn1cblxuZXhwb3J0IHsgU2Nyb2xsYmFyIGFzIGRlZmF1bHQgfTtcbiIsImltcG9ydCB7IGUgYXMgZWxlbWVudENoaWxkcmVuIH0gZnJvbSAnLi4vc2hhcmVkL3V0aWxzLm1qcyc7XG5cbmZ1bmN0aW9uIFBhcmFsbGF4KF9yZWYpIHtcbiAgbGV0IHtcbiAgICBzd2lwZXIsXG4gICAgZXh0ZW5kUGFyYW1zLFxuICAgIG9uXG4gIH0gPSBfcmVmO1xuICBleHRlbmRQYXJhbXMoe1xuICAgIHBhcmFsbGF4OiB7XG4gICAgICBlbmFibGVkOiBmYWxzZVxuICAgIH1cbiAgfSk7XG4gIGNvbnN0IGVsZW1lbnRzU2VsZWN0b3IgPSAnW2RhdGEtc3dpcGVyLXBhcmFsbGF4XSwgW2RhdGEtc3dpcGVyLXBhcmFsbGF4LXhdLCBbZGF0YS1zd2lwZXItcGFyYWxsYXgteV0sIFtkYXRhLXN3aXBlci1wYXJhbGxheC1vcGFjaXR5XSwgW2RhdGEtc3dpcGVyLXBhcmFsbGF4LXNjYWxlXSc7XG4gIGNvbnN0IHNldFRyYW5zZm9ybSA9IChlbCwgcHJvZ3Jlc3MpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBydGxcbiAgICB9ID0gc3dpcGVyO1xuICAgIGNvbnN0IHJ0bEZhY3RvciA9IHJ0bCA/IC0xIDogMTtcbiAgICBjb25zdCBwID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXN3aXBlci1wYXJhbGxheCcpIHx8ICcwJztcbiAgICBsZXQgeCA9IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1zd2lwZXItcGFyYWxsYXgteCcpO1xuICAgIGxldCB5ID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXN3aXBlci1wYXJhbGxheC15Jyk7XG4gICAgY29uc3Qgc2NhbGUgPSBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3dpcGVyLXBhcmFsbGF4LXNjYWxlJyk7XG4gICAgY29uc3Qgb3BhY2l0eSA9IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1zd2lwZXItcGFyYWxsYXgtb3BhY2l0eScpO1xuICAgIGNvbnN0IHJvdGF0ZSA9IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1zd2lwZXItcGFyYWxsYXgtcm90YXRlJyk7XG4gICAgaWYgKHggfHwgeSkge1xuICAgICAgeCA9IHggfHwgJzAnO1xuICAgICAgeSA9IHkgfHwgJzAnO1xuICAgIH0gZWxzZSBpZiAoc3dpcGVyLmlzSG9yaXpvbnRhbCgpKSB7XG4gICAgICB4ID0gcDtcbiAgICAgIHkgPSAnMCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHkgPSBwO1xuICAgICAgeCA9ICcwJztcbiAgICB9XG4gICAgaWYgKHguaW5kZXhPZignJScpID49IDApIHtcbiAgICAgIHggPSBgJHtwYXJzZUludCh4LCAxMCkgKiBwcm9ncmVzcyAqIHJ0bEZhY3Rvcn0lYDtcbiAgICB9IGVsc2Uge1xuICAgICAgeCA9IGAke3ggKiBwcm9ncmVzcyAqIHJ0bEZhY3Rvcn1weGA7XG4gICAgfVxuICAgIGlmICh5LmluZGV4T2YoJyUnKSA+PSAwKSB7XG4gICAgICB5ID0gYCR7cGFyc2VJbnQoeSwgMTApICogcHJvZ3Jlc3N9JWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHkgPSBgJHt5ICogcHJvZ3Jlc3N9cHhgO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIG9wYWNpdHkgIT09ICd1bmRlZmluZWQnICYmIG9wYWNpdHkgIT09IG51bGwpIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRPcGFjaXR5ID0gb3BhY2l0eSAtIChvcGFjaXR5IC0gMSkgKiAoMSAtIE1hdGguYWJzKHByb2dyZXNzKSk7XG4gICAgICBlbC5zdHlsZS5vcGFjaXR5ID0gY3VycmVudE9wYWNpdHk7XG4gICAgfVxuICAgIGxldCB0cmFuc2Zvcm0gPSBgdHJhbnNsYXRlM2QoJHt4fSwgJHt5fSwgMHB4KWA7XG4gICAgaWYgKHR5cGVvZiBzY2FsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgc2NhbGUgIT09IG51bGwpIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRTY2FsZSA9IHNjYWxlIC0gKHNjYWxlIC0gMSkgKiAoMSAtIE1hdGguYWJzKHByb2dyZXNzKSk7XG4gICAgICB0cmFuc2Zvcm0gKz0gYCBzY2FsZSgke2N1cnJlbnRTY2FsZX0pYDtcbiAgICB9XG4gICAgaWYgKHJvdGF0ZSAmJiB0eXBlb2Ygcm90YXRlICE9PSAndW5kZWZpbmVkJyAmJiByb3RhdGUgIT09IG51bGwpIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRSb3RhdGUgPSByb3RhdGUgKiBwcm9ncmVzcyAqIC0xO1xuICAgICAgdHJhbnNmb3JtICs9IGAgcm90YXRlKCR7Y3VycmVudFJvdGF0ZX1kZWcpYDtcbiAgICB9XG4gICAgZWwuc3R5bGUudHJhbnNmb3JtID0gdHJhbnNmb3JtO1xuICB9O1xuICBjb25zdCBzZXRUcmFuc2xhdGUgPSAoKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgZWwsXG4gICAgICBzbGlkZXMsXG4gICAgICBwcm9ncmVzcyxcbiAgICAgIHNuYXBHcmlkLFxuICAgICAgaXNFbGVtZW50XG4gICAgfSA9IHN3aXBlcjtcbiAgICBjb25zdCBlbGVtZW50cyA9IGVsZW1lbnRDaGlsZHJlbihlbCwgZWxlbWVudHNTZWxlY3Rvcik7XG4gICAgaWYgKHN3aXBlci5pc0VsZW1lbnQpIHtcbiAgICAgIGVsZW1lbnRzLnB1c2goLi4uZWxlbWVudENoaWxkcmVuKHN3aXBlci5ob3N0RWwsIGVsZW1lbnRzU2VsZWN0b3IpKTtcbiAgICB9XG4gICAgZWxlbWVudHMuZm9yRWFjaChzdWJFbCA9PiB7XG4gICAgICBzZXRUcmFuc2Zvcm0oc3ViRWwsIHByb2dyZXNzKTtcbiAgICB9KTtcbiAgICBzbGlkZXMuZm9yRWFjaCgoc2xpZGVFbCwgc2xpZGVJbmRleCkgPT4ge1xuICAgICAgbGV0IHNsaWRlUHJvZ3Jlc3MgPSBzbGlkZUVsLnByb2dyZXNzO1xuICAgICAgaWYgKHN3aXBlci5wYXJhbXMuc2xpZGVzUGVyR3JvdXAgPiAxICYmIHN3aXBlci5wYXJhbXMuc2xpZGVzUGVyVmlldyAhPT0gJ2F1dG8nKSB7XG4gICAgICAgIHNsaWRlUHJvZ3Jlc3MgKz0gTWF0aC5jZWlsKHNsaWRlSW5kZXggLyAyKSAtIHByb2dyZXNzICogKHNuYXBHcmlkLmxlbmd0aCAtIDEpO1xuICAgICAgfVxuICAgICAgc2xpZGVQcm9ncmVzcyA9IE1hdGgubWluKE1hdGgubWF4KHNsaWRlUHJvZ3Jlc3MsIC0xKSwgMSk7XG4gICAgICBzbGlkZUVsLnF1ZXJ5U2VsZWN0b3JBbGwoYCR7ZWxlbWVudHNTZWxlY3Rvcn0sIFtkYXRhLXN3aXBlci1wYXJhbGxheC1yb3RhdGVdYCkuZm9yRWFjaChzdWJFbCA9PiB7XG4gICAgICAgIHNldFRyYW5zZm9ybShzdWJFbCwgc2xpZGVQcm9ncmVzcyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcbiAgY29uc3Qgc2V0VHJhbnNpdGlvbiA9IGZ1bmN0aW9uIChkdXJhdGlvbikge1xuICAgIGlmIChkdXJhdGlvbiA9PT0gdm9pZCAwKSB7XG4gICAgICBkdXJhdGlvbiA9IHN3aXBlci5wYXJhbXMuc3BlZWQ7XG4gICAgfVxuICAgIGNvbnN0IHtcbiAgICAgIGVsLFxuICAgICAgaG9zdEVsXG4gICAgfSA9IHN3aXBlcjtcbiAgICBjb25zdCBlbGVtZW50cyA9IFsuLi5lbC5xdWVyeVNlbGVjdG9yQWxsKGVsZW1lbnRzU2VsZWN0b3IpXTtcbiAgICBpZiAoc3dpcGVyLmlzRWxlbWVudCkge1xuICAgICAgZWxlbWVudHMucHVzaCguLi5ob3N0RWwucXVlcnlTZWxlY3RvckFsbChlbGVtZW50c1NlbGVjdG9yKSk7XG4gICAgfVxuICAgIGVsZW1lbnRzLmZvckVhY2gocGFyYWxsYXhFbCA9PiB7XG4gICAgICBsZXQgcGFyYWxsYXhEdXJhdGlvbiA9IHBhcnNlSW50KHBhcmFsbGF4RWwuZ2V0QXR0cmlidXRlKCdkYXRhLXN3aXBlci1wYXJhbGxheC1kdXJhdGlvbicpLCAxMCkgfHwgZHVyYXRpb247XG4gICAgICBpZiAoZHVyYXRpb24gPT09IDApIHBhcmFsbGF4RHVyYXRpb24gPSAwO1xuICAgICAgcGFyYWxsYXhFbC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSBgJHtwYXJhbGxheER1cmF0aW9ufW1zYDtcbiAgICB9KTtcbiAgfTtcbiAgb24oJ2JlZm9yZUluaXQnLCAoKSA9PiB7XG4gICAgaWYgKCFzd2lwZXIucGFyYW1zLnBhcmFsbGF4LmVuYWJsZWQpIHJldHVybjtcbiAgICBzd2lwZXIucGFyYW1zLndhdGNoU2xpZGVzUHJvZ3Jlc3MgPSB0cnVlO1xuICAgIHN3aXBlci5vcmlnaW5hbFBhcmFtcy53YXRjaFNsaWRlc1Byb2dyZXNzID0gdHJ1ZTtcbiAgfSk7XG4gIG9uKCdpbml0JywgKCkgPT4ge1xuICAgIGlmICghc3dpcGVyLnBhcmFtcy5wYXJhbGxheC5lbmFibGVkKSByZXR1cm47XG4gICAgc2V0VHJhbnNsYXRlKCk7XG4gIH0pO1xuICBvbignc2V0VHJhbnNsYXRlJywgKCkgPT4ge1xuICAgIGlmICghc3dpcGVyLnBhcmFtcy5wYXJhbGxheC5lbmFibGVkKSByZXR1cm47XG4gICAgc2V0VHJhbnNsYXRlKCk7XG4gIH0pO1xuICBvbignc2V0VHJhbnNpdGlvbicsIChfc3dpcGVyLCBkdXJhdGlvbikgPT4ge1xuICAgIGlmICghc3dpcGVyLnBhcmFtcy5wYXJhbGxheC5lbmFibGVkKSByZXR1cm47XG4gICAgc2V0VHJhbnNpdGlvbihkdXJhdGlvbik7XG4gIH0pO1xufVxuXG5leHBvcnQgeyBQYXJhbGxheCBhcyBkZWZhdWx0IH07XG4iLCJpbXBvcnQgeyBhIGFzIGdldFdpbmRvdyB9IGZyb20gJy4uL3NoYXJlZC9zc3Itd2luZG93LmVzbS5tanMnO1xuaW1wb3J0IHsgZSBhcyBlbGVtZW50Q2hpbGRyZW4sIGEgYXMgZWxlbWVudFBhcmVudHMsIGIgYXMgZWxlbWVudE9mZnNldCwgaSBhcyBnZXRUcmFuc2xhdGUgfSBmcm9tICcuLi9zaGFyZWQvdXRpbHMubWpzJztcblxuZnVuY3Rpb24gWm9vbShfcmVmKSB7XG4gIGxldCB7XG4gICAgc3dpcGVyLFxuICAgIGV4dGVuZFBhcmFtcyxcbiAgICBvbixcbiAgICBlbWl0XG4gIH0gPSBfcmVmO1xuICBjb25zdCB3aW5kb3cgPSBnZXRXaW5kb3coKTtcbiAgZXh0ZW5kUGFyYW1zKHtcbiAgICB6b29tOiB7XG4gICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgIG1heFJhdGlvOiAzLFxuICAgICAgbWluUmF0aW86IDEsXG4gICAgICB0b2dnbGU6IHRydWUsXG4gICAgICBjb250YWluZXJDbGFzczogJ3N3aXBlci16b29tLWNvbnRhaW5lcicsXG4gICAgICB6b29tZWRTbGlkZUNsYXNzOiAnc3dpcGVyLXNsaWRlLXpvb21lZCdcbiAgICB9XG4gIH0pO1xuICBzd2lwZXIuem9vbSA9IHtcbiAgICBlbmFibGVkOiBmYWxzZVxuICB9O1xuICBsZXQgY3VycmVudFNjYWxlID0gMTtcbiAgbGV0IGlzU2NhbGluZyA9IGZhbHNlO1xuICBsZXQgZmFrZUdlc3R1cmVUb3VjaGVkO1xuICBsZXQgZmFrZUdlc3R1cmVNb3ZlZDtcbiAgY29uc3QgZXZDYWNoZSA9IFtdO1xuICBjb25zdCBnZXN0dXJlID0ge1xuICAgIG9yaWdpblg6IDAsXG4gICAgb3JpZ2luWTogMCxcbiAgICBzbGlkZUVsOiB1bmRlZmluZWQsXG4gICAgc2xpZGVXaWR0aDogdW5kZWZpbmVkLFxuICAgIHNsaWRlSGVpZ2h0OiB1bmRlZmluZWQsXG4gICAgaW1hZ2VFbDogdW5kZWZpbmVkLFxuICAgIGltYWdlV3JhcEVsOiB1bmRlZmluZWQsXG4gICAgbWF4UmF0aW86IDNcbiAgfTtcbiAgY29uc3QgaW1hZ2UgPSB7XG4gICAgaXNUb3VjaGVkOiB1bmRlZmluZWQsXG4gICAgaXNNb3ZlZDogdW5kZWZpbmVkLFxuICAgIGN1cnJlbnRYOiB1bmRlZmluZWQsXG4gICAgY3VycmVudFk6IHVuZGVmaW5lZCxcbiAgICBtaW5YOiB1bmRlZmluZWQsXG4gICAgbWluWTogdW5kZWZpbmVkLFxuICAgIG1heFg6IHVuZGVmaW5lZCxcbiAgICBtYXhZOiB1bmRlZmluZWQsXG4gICAgd2lkdGg6IHVuZGVmaW5lZCxcbiAgICBoZWlnaHQ6IHVuZGVmaW5lZCxcbiAgICBzdGFydFg6IHVuZGVmaW5lZCxcbiAgICBzdGFydFk6IHVuZGVmaW5lZCxcbiAgICB0b3VjaGVzU3RhcnQ6IHt9LFxuICAgIHRvdWNoZXNDdXJyZW50OiB7fVxuICB9O1xuICBjb25zdCB2ZWxvY2l0eSA9IHtcbiAgICB4OiB1bmRlZmluZWQsXG4gICAgeTogdW5kZWZpbmVkLFxuICAgIHByZXZQb3NpdGlvblg6IHVuZGVmaW5lZCxcbiAgICBwcmV2UG9zaXRpb25ZOiB1bmRlZmluZWQsXG4gICAgcHJldlRpbWU6IHVuZGVmaW5lZFxuICB9O1xuICBsZXQgc2NhbGUgPSAxO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoc3dpcGVyLnpvb20sICdzY2FsZScsIHtcbiAgICBnZXQoKSB7XG4gICAgICByZXR1cm4gc2NhbGU7XG4gICAgfSxcbiAgICBzZXQodmFsdWUpIHtcbiAgICAgIGlmIChzY2FsZSAhPT0gdmFsdWUpIHtcbiAgICAgICAgY29uc3QgaW1hZ2VFbCA9IGdlc3R1cmUuaW1hZ2VFbDtcbiAgICAgICAgY29uc3Qgc2xpZGVFbCA9IGdlc3R1cmUuc2xpZGVFbDtcbiAgICAgICAgZW1pdCgnem9vbUNoYW5nZScsIHZhbHVlLCBpbWFnZUVsLCBzbGlkZUVsKTtcbiAgICAgIH1cbiAgICAgIHNjYWxlID0gdmFsdWU7XG4gICAgfVxuICB9KTtcbiAgZnVuY3Rpb24gZ2V0RGlzdGFuY2VCZXR3ZWVuVG91Y2hlcygpIHtcbiAgICBpZiAoZXZDYWNoZS5sZW5ndGggPCAyKSByZXR1cm4gMTtcbiAgICBjb25zdCB4MSA9IGV2Q2FjaGVbMF0ucGFnZVg7XG4gICAgY29uc3QgeTEgPSBldkNhY2hlWzBdLnBhZ2VZO1xuICAgIGNvbnN0IHgyID0gZXZDYWNoZVsxXS5wYWdlWDtcbiAgICBjb25zdCB5MiA9IGV2Q2FjaGVbMV0ucGFnZVk7XG4gICAgY29uc3QgZGlzdGFuY2UgPSBNYXRoLnNxcnQoKHgyIC0geDEpICoqIDIgKyAoeTIgLSB5MSkgKiogMik7XG4gICAgcmV0dXJuIGRpc3RhbmNlO1xuICB9XG4gIGZ1bmN0aW9uIGdldFNjYWxlT3JpZ2luKCkge1xuICAgIGlmIChldkNhY2hlLmxlbmd0aCA8IDIpIHJldHVybiB7XG4gICAgICB4OiBudWxsLFxuICAgICAgeTogbnVsbFxuICAgIH07XG4gICAgY29uc3QgYm94ID0gZ2VzdHVyZS5pbWFnZUVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIHJldHVybiBbKGV2Q2FjaGVbMF0ucGFnZVggKyAoZXZDYWNoZVsxXS5wYWdlWCAtIGV2Q2FjaGVbMF0ucGFnZVgpIC8gMiAtIGJveC54IC0gd2luZG93LnNjcm9sbFgpIC8gY3VycmVudFNjYWxlLCAoZXZDYWNoZVswXS5wYWdlWSArIChldkNhY2hlWzFdLnBhZ2VZIC0gZXZDYWNoZVswXS5wYWdlWSkgLyAyIC0gYm94LnkgLSB3aW5kb3cuc2Nyb2xsWSkgLyBjdXJyZW50U2NhbGVdO1xuICB9XG4gIGZ1bmN0aW9uIGdldFNsaWRlU2VsZWN0b3IoKSB7XG4gICAgcmV0dXJuIHN3aXBlci5pc0VsZW1lbnQgPyBgc3dpcGVyLXNsaWRlYCA6IGAuJHtzd2lwZXIucGFyYW1zLnNsaWRlQ2xhc3N9YDtcbiAgfVxuICBmdW5jdGlvbiBldmVudFdpdGhpblNsaWRlKGUpIHtcbiAgICBjb25zdCBzbGlkZVNlbGVjdG9yID0gZ2V0U2xpZGVTZWxlY3RvcigpO1xuICAgIGlmIChlLnRhcmdldC5tYXRjaGVzKHNsaWRlU2VsZWN0b3IpKSByZXR1cm4gdHJ1ZTtcbiAgICBpZiAoc3dpcGVyLnNsaWRlcy5maWx0ZXIoc2xpZGVFbCA9PiBzbGlkZUVsLmNvbnRhaW5zKGUudGFyZ2V0KSkubGVuZ3RoID4gMCkgcmV0dXJuIHRydWU7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGZ1bmN0aW9uIGV2ZW50V2l0aGluWm9vbUNvbnRhaW5lcihlKSB7XG4gICAgY29uc3Qgc2VsZWN0b3IgPSBgLiR7c3dpcGVyLnBhcmFtcy56b29tLmNvbnRhaW5lckNsYXNzfWA7XG4gICAgaWYgKGUudGFyZ2V0Lm1hdGNoZXMoc2VsZWN0b3IpKSByZXR1cm4gdHJ1ZTtcbiAgICBpZiAoWy4uLnN3aXBlci5ob3N0RWwucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcildLmZpbHRlcihjb250YWluZXJFbCA9PiBjb250YWluZXJFbC5jb250YWlucyhlLnRhcmdldCkpLmxlbmd0aCA+IDApIHJldHVybiB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIEV2ZW50c1xuICBmdW5jdGlvbiBvbkdlc3R1cmVTdGFydChlKSB7XG4gICAgaWYgKGUucG9pbnRlclR5cGUgPT09ICdtb3VzZScpIHtcbiAgICAgIGV2Q2FjaGUuc3BsaWNlKDAsIGV2Q2FjaGUubGVuZ3RoKTtcbiAgICB9XG4gICAgaWYgKCFldmVudFdpdGhpblNsaWRlKGUpKSByZXR1cm47XG4gICAgY29uc3QgcGFyYW1zID0gc3dpcGVyLnBhcmFtcy56b29tO1xuICAgIGZha2VHZXN0dXJlVG91Y2hlZCA9IGZhbHNlO1xuICAgIGZha2VHZXN0dXJlTW92ZWQgPSBmYWxzZTtcbiAgICBldkNhY2hlLnB1c2goZSk7XG4gICAgaWYgKGV2Q2FjaGUubGVuZ3RoIDwgMikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBmYWtlR2VzdHVyZVRvdWNoZWQgPSB0cnVlO1xuICAgIGdlc3R1cmUuc2NhbGVTdGFydCA9IGdldERpc3RhbmNlQmV0d2VlblRvdWNoZXMoKTtcbiAgICBpZiAoIWdlc3R1cmUuc2xpZGVFbCkge1xuICAgICAgZ2VzdHVyZS5zbGlkZUVsID0gZS50YXJnZXQuY2xvc2VzdChgLiR7c3dpcGVyLnBhcmFtcy5zbGlkZUNsYXNzfSwgc3dpcGVyLXNsaWRlYCk7XG4gICAgICBpZiAoIWdlc3R1cmUuc2xpZGVFbCkgZ2VzdHVyZS5zbGlkZUVsID0gc3dpcGVyLnNsaWRlc1tzd2lwZXIuYWN0aXZlSW5kZXhdO1xuICAgICAgbGV0IGltYWdlRWwgPSBnZXN0dXJlLnNsaWRlRWwucXVlcnlTZWxlY3RvcihgLiR7cGFyYW1zLmNvbnRhaW5lckNsYXNzfWApO1xuICAgICAgaWYgKGltYWdlRWwpIHtcbiAgICAgICAgaW1hZ2VFbCA9IGltYWdlRWwucXVlcnlTZWxlY3RvckFsbCgncGljdHVyZSwgaW1nLCBzdmcsIGNhbnZhcywgLnN3aXBlci16b29tLXRhcmdldCcpWzBdO1xuICAgICAgfVxuICAgICAgZ2VzdHVyZS5pbWFnZUVsID0gaW1hZ2VFbDtcbiAgICAgIGlmIChpbWFnZUVsKSB7XG4gICAgICAgIGdlc3R1cmUuaW1hZ2VXcmFwRWwgPSBlbGVtZW50UGFyZW50cyhnZXN0dXJlLmltYWdlRWwsIGAuJHtwYXJhbXMuY29udGFpbmVyQ2xhc3N9YClbMF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBnZXN0dXJlLmltYWdlV3JhcEVsID0gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgICAgaWYgKCFnZXN0dXJlLmltYWdlV3JhcEVsKSB7XG4gICAgICAgIGdlc3R1cmUuaW1hZ2VFbCA9IHVuZGVmaW5lZDtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgZ2VzdHVyZS5tYXhSYXRpbyA9IGdlc3R1cmUuaW1hZ2VXcmFwRWwuZ2V0QXR0cmlidXRlKCdkYXRhLXN3aXBlci16b29tJykgfHwgcGFyYW1zLm1heFJhdGlvO1xuICAgIH1cbiAgICBpZiAoZ2VzdHVyZS5pbWFnZUVsKSB7XG4gICAgICBjb25zdCBbb3JpZ2luWCwgb3JpZ2luWV0gPSBnZXRTY2FsZU9yaWdpbigpO1xuICAgICAgZ2VzdHVyZS5vcmlnaW5YID0gb3JpZ2luWDtcbiAgICAgIGdlc3R1cmUub3JpZ2luWSA9IG9yaWdpblk7XG4gICAgICBnZXN0dXJlLmltYWdlRWwuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gJzBtcyc7XG4gICAgfVxuICAgIGlzU2NhbGluZyA9IHRydWU7XG4gIH1cbiAgZnVuY3Rpb24gb25HZXN0dXJlQ2hhbmdlKGUpIHtcbiAgICBpZiAoIWV2ZW50V2l0aGluU2xpZGUoZSkpIHJldHVybjtcbiAgICBjb25zdCBwYXJhbXMgPSBzd2lwZXIucGFyYW1zLnpvb207XG4gICAgY29uc3Qgem9vbSA9IHN3aXBlci56b29tO1xuICAgIGNvbnN0IHBvaW50ZXJJbmRleCA9IGV2Q2FjaGUuZmluZEluZGV4KGNhY2hlZEV2ID0+IGNhY2hlZEV2LnBvaW50ZXJJZCA9PT0gZS5wb2ludGVySWQpO1xuICAgIGlmIChwb2ludGVySW5kZXggPj0gMCkgZXZDYWNoZVtwb2ludGVySW5kZXhdID0gZTtcbiAgICBpZiAoZXZDYWNoZS5sZW5ndGggPCAyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGZha2VHZXN0dXJlTW92ZWQgPSB0cnVlO1xuICAgIGdlc3R1cmUuc2NhbGVNb3ZlID0gZ2V0RGlzdGFuY2VCZXR3ZWVuVG91Y2hlcygpO1xuICAgIGlmICghZ2VzdHVyZS5pbWFnZUVsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHpvb20uc2NhbGUgPSBnZXN0dXJlLnNjYWxlTW92ZSAvIGdlc3R1cmUuc2NhbGVTdGFydCAqIGN1cnJlbnRTY2FsZTtcbiAgICBpZiAoem9vbS5zY2FsZSA+IGdlc3R1cmUubWF4UmF0aW8pIHtcbiAgICAgIHpvb20uc2NhbGUgPSBnZXN0dXJlLm1heFJhdGlvIC0gMSArICh6b29tLnNjYWxlIC0gZ2VzdHVyZS5tYXhSYXRpbyArIDEpICoqIDAuNTtcbiAgICB9XG4gICAgaWYgKHpvb20uc2NhbGUgPCBwYXJhbXMubWluUmF0aW8pIHtcbiAgICAgIHpvb20uc2NhbGUgPSBwYXJhbXMubWluUmF0aW8gKyAxIC0gKHBhcmFtcy5taW5SYXRpbyAtIHpvb20uc2NhbGUgKyAxKSAqKiAwLjU7XG4gICAgfVxuICAgIGdlc3R1cmUuaW1hZ2VFbC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlM2QoMCwwLDApIHNjYWxlKCR7em9vbS5zY2FsZX0pYDtcbiAgfVxuICBmdW5jdGlvbiBvbkdlc3R1cmVFbmQoZSkge1xuICAgIGlmICghZXZlbnRXaXRoaW5TbGlkZShlKSkgcmV0dXJuO1xuICAgIGlmIChlLnBvaW50ZXJUeXBlID09PSAnbW91c2UnICYmIGUudHlwZSA9PT0gJ3BvaW50ZXJvdXQnKSByZXR1cm47XG4gICAgY29uc3QgcGFyYW1zID0gc3dpcGVyLnBhcmFtcy56b29tO1xuICAgIGNvbnN0IHpvb20gPSBzd2lwZXIuem9vbTtcbiAgICBjb25zdCBwb2ludGVySW5kZXggPSBldkNhY2hlLmZpbmRJbmRleChjYWNoZWRFdiA9PiBjYWNoZWRFdi5wb2ludGVySWQgPT09IGUucG9pbnRlcklkKTtcbiAgICBpZiAocG9pbnRlckluZGV4ID49IDApIGV2Q2FjaGUuc3BsaWNlKHBvaW50ZXJJbmRleCwgMSk7XG4gICAgaWYgKCFmYWtlR2VzdHVyZVRvdWNoZWQgfHwgIWZha2VHZXN0dXJlTW92ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZmFrZUdlc3R1cmVUb3VjaGVkID0gZmFsc2U7XG4gICAgZmFrZUdlc3R1cmVNb3ZlZCA9IGZhbHNlO1xuICAgIGlmICghZ2VzdHVyZS5pbWFnZUVsKSByZXR1cm47XG4gICAgem9vbS5zY2FsZSA9IE1hdGgubWF4KE1hdGgubWluKHpvb20uc2NhbGUsIGdlc3R1cmUubWF4UmF0aW8pLCBwYXJhbXMubWluUmF0aW8pO1xuICAgIGdlc3R1cmUuaW1hZ2VFbC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSBgJHtzd2lwZXIucGFyYW1zLnNwZWVkfW1zYDtcbiAgICBnZXN0dXJlLmltYWdlRWwuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZTNkKDAsMCwwKSBzY2FsZSgke3pvb20uc2NhbGV9KWA7XG4gICAgY3VycmVudFNjYWxlID0gem9vbS5zY2FsZTtcbiAgICBpc1NjYWxpbmcgPSBmYWxzZTtcbiAgICBpZiAoem9vbS5zY2FsZSA+IDEgJiYgZ2VzdHVyZS5zbGlkZUVsKSB7XG4gICAgICBnZXN0dXJlLnNsaWRlRWwuY2xhc3NMaXN0LmFkZChgJHtwYXJhbXMuem9vbWVkU2xpZGVDbGFzc31gKTtcbiAgICB9IGVsc2UgaWYgKHpvb20uc2NhbGUgPD0gMSAmJiBnZXN0dXJlLnNsaWRlRWwpIHtcbiAgICAgIGdlc3R1cmUuc2xpZGVFbC5jbGFzc0xpc3QucmVtb3ZlKGAke3BhcmFtcy56b29tZWRTbGlkZUNsYXNzfWApO1xuICAgIH1cbiAgICBpZiAoem9vbS5zY2FsZSA9PT0gMSkge1xuICAgICAgZ2VzdHVyZS5vcmlnaW5YID0gMDtcbiAgICAgIGdlc3R1cmUub3JpZ2luWSA9IDA7XG4gICAgICBnZXN0dXJlLnNsaWRlRWwgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIG9uVG91Y2hTdGFydChlKSB7XG4gICAgY29uc3QgZGV2aWNlID0gc3dpcGVyLmRldmljZTtcbiAgICBpZiAoIWdlc3R1cmUuaW1hZ2VFbCkgcmV0dXJuO1xuICAgIGlmIChpbWFnZS5pc1RvdWNoZWQpIHJldHVybjtcbiAgICBpZiAoZGV2aWNlLmFuZHJvaWQgJiYgZS5jYW5jZWxhYmxlKSBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgaW1hZ2UuaXNUb3VjaGVkID0gdHJ1ZTtcbiAgICBjb25zdCBldmVudCA9IGV2Q2FjaGUubGVuZ3RoID4gMCA/IGV2Q2FjaGVbMF0gOiBlO1xuICAgIGltYWdlLnRvdWNoZXNTdGFydC54ID0gZXZlbnQucGFnZVg7XG4gICAgaW1hZ2UudG91Y2hlc1N0YXJ0LnkgPSBldmVudC5wYWdlWTtcbiAgfVxuICBmdW5jdGlvbiBvblRvdWNoTW92ZShlKSB7XG4gICAgaWYgKCFldmVudFdpdGhpblNsaWRlKGUpIHx8ICFldmVudFdpdGhpblpvb21Db250YWluZXIoZSkpIHJldHVybjtcbiAgICBjb25zdCB6b29tID0gc3dpcGVyLnpvb207XG4gICAgaWYgKCFnZXN0dXJlLmltYWdlRWwpIHJldHVybjtcbiAgICBpZiAoIWltYWdlLmlzVG91Y2hlZCB8fCAhZ2VzdHVyZS5zbGlkZUVsKSByZXR1cm47XG4gICAgaWYgKCFpbWFnZS5pc01vdmVkKSB7XG4gICAgICBpbWFnZS53aWR0aCA9IGdlc3R1cmUuaW1hZ2VFbC5vZmZzZXRXaWR0aDtcbiAgICAgIGltYWdlLmhlaWdodCA9IGdlc3R1cmUuaW1hZ2VFbC5vZmZzZXRIZWlnaHQ7XG4gICAgICBpbWFnZS5zdGFydFggPSBnZXRUcmFuc2xhdGUoZ2VzdHVyZS5pbWFnZVdyYXBFbCwgJ3gnKSB8fCAwO1xuICAgICAgaW1hZ2Uuc3RhcnRZID0gZ2V0VHJhbnNsYXRlKGdlc3R1cmUuaW1hZ2VXcmFwRWwsICd5JykgfHwgMDtcbiAgICAgIGdlc3R1cmUuc2xpZGVXaWR0aCA9IGdlc3R1cmUuc2xpZGVFbC5vZmZzZXRXaWR0aDtcbiAgICAgIGdlc3R1cmUuc2xpZGVIZWlnaHQgPSBnZXN0dXJlLnNsaWRlRWwub2Zmc2V0SGVpZ2h0O1xuICAgICAgZ2VzdHVyZS5pbWFnZVdyYXBFbC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSAnMG1zJztcbiAgICB9XG4gICAgLy8gRGVmaW5lIGlmIHdlIG5lZWQgaW1hZ2UgZHJhZ1xuICAgIGNvbnN0IHNjYWxlZFdpZHRoID0gaW1hZ2Uud2lkdGggKiB6b29tLnNjYWxlO1xuICAgIGNvbnN0IHNjYWxlZEhlaWdodCA9IGltYWdlLmhlaWdodCAqIHpvb20uc2NhbGU7XG4gICAgaWYgKHNjYWxlZFdpZHRoIDwgZ2VzdHVyZS5zbGlkZVdpZHRoICYmIHNjYWxlZEhlaWdodCA8IGdlc3R1cmUuc2xpZGVIZWlnaHQpIHJldHVybjtcbiAgICBpbWFnZS5taW5YID0gTWF0aC5taW4oZ2VzdHVyZS5zbGlkZVdpZHRoIC8gMiAtIHNjYWxlZFdpZHRoIC8gMiwgMCk7XG4gICAgaW1hZ2UubWF4WCA9IC1pbWFnZS5taW5YO1xuICAgIGltYWdlLm1pblkgPSBNYXRoLm1pbihnZXN0dXJlLnNsaWRlSGVpZ2h0IC8gMiAtIHNjYWxlZEhlaWdodCAvIDIsIDApO1xuICAgIGltYWdlLm1heFkgPSAtaW1hZ2UubWluWTtcbiAgICBpbWFnZS50b3VjaGVzQ3VycmVudC54ID0gZXZDYWNoZS5sZW5ndGggPiAwID8gZXZDYWNoZVswXS5wYWdlWCA6IGUucGFnZVg7XG4gICAgaW1hZ2UudG91Y2hlc0N1cnJlbnQueSA9IGV2Q2FjaGUubGVuZ3RoID4gMCA/IGV2Q2FjaGVbMF0ucGFnZVkgOiBlLnBhZ2VZO1xuICAgIGNvbnN0IHRvdWNoZXNEaWZmID0gTWF0aC5tYXgoTWF0aC5hYnMoaW1hZ2UudG91Y2hlc0N1cnJlbnQueCAtIGltYWdlLnRvdWNoZXNTdGFydC54KSwgTWF0aC5hYnMoaW1hZ2UudG91Y2hlc0N1cnJlbnQueSAtIGltYWdlLnRvdWNoZXNTdGFydC55KSk7XG4gICAgaWYgKHRvdWNoZXNEaWZmID4gNSkge1xuICAgICAgc3dpcGVyLmFsbG93Q2xpY2sgPSBmYWxzZTtcbiAgICB9XG4gICAgaWYgKCFpbWFnZS5pc01vdmVkICYmICFpc1NjYWxpbmcpIHtcbiAgICAgIGlmIChzd2lwZXIuaXNIb3Jpem9udGFsKCkgJiYgKE1hdGguZmxvb3IoaW1hZ2UubWluWCkgPT09IE1hdGguZmxvb3IoaW1hZ2Uuc3RhcnRYKSAmJiBpbWFnZS50b3VjaGVzQ3VycmVudC54IDwgaW1hZ2UudG91Y2hlc1N0YXJ0LnggfHwgTWF0aC5mbG9vcihpbWFnZS5tYXhYKSA9PT0gTWF0aC5mbG9vcihpbWFnZS5zdGFydFgpICYmIGltYWdlLnRvdWNoZXNDdXJyZW50LnggPiBpbWFnZS50b3VjaGVzU3RhcnQueCkpIHtcbiAgICAgICAgaW1hZ2UuaXNUb3VjaGVkID0gZmFsc2U7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICghc3dpcGVyLmlzSG9yaXpvbnRhbCgpICYmIChNYXRoLmZsb29yKGltYWdlLm1pblkpID09PSBNYXRoLmZsb29yKGltYWdlLnN0YXJ0WSkgJiYgaW1hZ2UudG91Y2hlc0N1cnJlbnQueSA8IGltYWdlLnRvdWNoZXNTdGFydC55IHx8IE1hdGguZmxvb3IoaW1hZ2UubWF4WSkgPT09IE1hdGguZmxvb3IoaW1hZ2Uuc3RhcnRZKSAmJiBpbWFnZS50b3VjaGVzQ3VycmVudC55ID4gaW1hZ2UudG91Y2hlc1N0YXJ0LnkpKSB7XG4gICAgICAgIGltYWdlLmlzVG91Y2hlZCA9IGZhbHNlO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChlLmNhbmNlbGFibGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBpbWFnZS5pc01vdmVkID0gdHJ1ZTtcbiAgICBjb25zdCBzY2FsZVJhdGlvID0gKHpvb20uc2NhbGUgLSBjdXJyZW50U2NhbGUpIC8gKGdlc3R1cmUubWF4UmF0aW8gLSBzd2lwZXIucGFyYW1zLnpvb20ubWluUmF0aW8pO1xuICAgIGNvbnN0IHtcbiAgICAgIG9yaWdpblgsXG4gICAgICBvcmlnaW5ZXG4gICAgfSA9IGdlc3R1cmU7XG4gICAgaW1hZ2UuY3VycmVudFggPSBpbWFnZS50b3VjaGVzQ3VycmVudC54IC0gaW1hZ2UudG91Y2hlc1N0YXJ0LnggKyBpbWFnZS5zdGFydFggKyBzY2FsZVJhdGlvICogKGltYWdlLndpZHRoIC0gb3JpZ2luWCAqIDIpO1xuICAgIGltYWdlLmN1cnJlbnRZID0gaW1hZ2UudG91Y2hlc0N1cnJlbnQueSAtIGltYWdlLnRvdWNoZXNTdGFydC55ICsgaW1hZ2Uuc3RhcnRZICsgc2NhbGVSYXRpbyAqIChpbWFnZS5oZWlnaHQgLSBvcmlnaW5ZICogMik7XG4gICAgaWYgKGltYWdlLmN1cnJlbnRYIDwgaW1hZ2UubWluWCkge1xuICAgICAgaW1hZ2UuY3VycmVudFggPSBpbWFnZS5taW5YICsgMSAtIChpbWFnZS5taW5YIC0gaW1hZ2UuY3VycmVudFggKyAxKSAqKiAwLjg7XG4gICAgfVxuICAgIGlmIChpbWFnZS5jdXJyZW50WCA+IGltYWdlLm1heFgpIHtcbiAgICAgIGltYWdlLmN1cnJlbnRYID0gaW1hZ2UubWF4WCAtIDEgKyAoaW1hZ2UuY3VycmVudFggLSBpbWFnZS5tYXhYICsgMSkgKiogMC44O1xuICAgIH1cbiAgICBpZiAoaW1hZ2UuY3VycmVudFkgPCBpbWFnZS5taW5ZKSB7XG4gICAgICBpbWFnZS5jdXJyZW50WSA9IGltYWdlLm1pblkgKyAxIC0gKGltYWdlLm1pblkgLSBpbWFnZS5jdXJyZW50WSArIDEpICoqIDAuODtcbiAgICB9XG4gICAgaWYgKGltYWdlLmN1cnJlbnRZID4gaW1hZ2UubWF4WSkge1xuICAgICAgaW1hZ2UuY3VycmVudFkgPSBpbWFnZS5tYXhZIC0gMSArIChpbWFnZS5jdXJyZW50WSAtIGltYWdlLm1heFkgKyAxKSAqKiAwLjg7XG4gICAgfVxuXG4gICAgLy8gVmVsb2NpdHlcbiAgICBpZiAoIXZlbG9jaXR5LnByZXZQb3NpdGlvblgpIHZlbG9jaXR5LnByZXZQb3NpdGlvblggPSBpbWFnZS50b3VjaGVzQ3VycmVudC54O1xuICAgIGlmICghdmVsb2NpdHkucHJldlBvc2l0aW9uWSkgdmVsb2NpdHkucHJldlBvc2l0aW9uWSA9IGltYWdlLnRvdWNoZXNDdXJyZW50Lnk7XG4gICAgaWYgKCF2ZWxvY2l0eS5wcmV2VGltZSkgdmVsb2NpdHkucHJldlRpbWUgPSBEYXRlLm5vdygpO1xuICAgIHZlbG9jaXR5LnggPSAoaW1hZ2UudG91Y2hlc0N1cnJlbnQueCAtIHZlbG9jaXR5LnByZXZQb3NpdGlvblgpIC8gKERhdGUubm93KCkgLSB2ZWxvY2l0eS5wcmV2VGltZSkgLyAyO1xuICAgIHZlbG9jaXR5LnkgPSAoaW1hZ2UudG91Y2hlc0N1cnJlbnQueSAtIHZlbG9jaXR5LnByZXZQb3NpdGlvblkpIC8gKERhdGUubm93KCkgLSB2ZWxvY2l0eS5wcmV2VGltZSkgLyAyO1xuICAgIGlmIChNYXRoLmFicyhpbWFnZS50b3VjaGVzQ3VycmVudC54IC0gdmVsb2NpdHkucHJldlBvc2l0aW9uWCkgPCAyKSB2ZWxvY2l0eS54ID0gMDtcbiAgICBpZiAoTWF0aC5hYnMoaW1hZ2UudG91Y2hlc0N1cnJlbnQueSAtIHZlbG9jaXR5LnByZXZQb3NpdGlvblkpIDwgMikgdmVsb2NpdHkueSA9IDA7XG4gICAgdmVsb2NpdHkucHJldlBvc2l0aW9uWCA9IGltYWdlLnRvdWNoZXNDdXJyZW50Lng7XG4gICAgdmVsb2NpdHkucHJldlBvc2l0aW9uWSA9IGltYWdlLnRvdWNoZXNDdXJyZW50Lnk7XG4gICAgdmVsb2NpdHkucHJldlRpbWUgPSBEYXRlLm5vdygpO1xuICAgIGdlc3R1cmUuaW1hZ2VXcmFwRWwuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZTNkKCR7aW1hZ2UuY3VycmVudFh9cHgsICR7aW1hZ2UuY3VycmVudFl9cHgsMClgO1xuICB9XG4gIGZ1bmN0aW9uIG9uVG91Y2hFbmQoKSB7XG4gICAgY29uc3Qgem9vbSA9IHN3aXBlci56b29tO1xuICAgIGlmICghZ2VzdHVyZS5pbWFnZUVsKSByZXR1cm47XG4gICAgaWYgKCFpbWFnZS5pc1RvdWNoZWQgfHwgIWltYWdlLmlzTW92ZWQpIHtcbiAgICAgIGltYWdlLmlzVG91Y2hlZCA9IGZhbHNlO1xuICAgICAgaW1hZ2UuaXNNb3ZlZCA9IGZhbHNlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpbWFnZS5pc1RvdWNoZWQgPSBmYWxzZTtcbiAgICBpbWFnZS5pc01vdmVkID0gZmFsc2U7XG4gICAgbGV0IG1vbWVudHVtRHVyYXRpb25YID0gMzAwO1xuICAgIGxldCBtb21lbnR1bUR1cmF0aW9uWSA9IDMwMDtcbiAgICBjb25zdCBtb21lbnR1bURpc3RhbmNlWCA9IHZlbG9jaXR5LnggKiBtb21lbnR1bUR1cmF0aW9uWDtcbiAgICBjb25zdCBuZXdQb3NpdGlvblggPSBpbWFnZS5jdXJyZW50WCArIG1vbWVudHVtRGlzdGFuY2VYO1xuICAgIGNvbnN0IG1vbWVudHVtRGlzdGFuY2VZID0gdmVsb2NpdHkueSAqIG1vbWVudHVtRHVyYXRpb25ZO1xuICAgIGNvbnN0IG5ld1Bvc2l0aW9uWSA9IGltYWdlLmN1cnJlbnRZICsgbW9tZW50dW1EaXN0YW5jZVk7XG5cbiAgICAvLyBGaXggZHVyYXRpb25cbiAgICBpZiAodmVsb2NpdHkueCAhPT0gMCkgbW9tZW50dW1EdXJhdGlvblggPSBNYXRoLmFicygobmV3UG9zaXRpb25YIC0gaW1hZ2UuY3VycmVudFgpIC8gdmVsb2NpdHkueCk7XG4gICAgaWYgKHZlbG9jaXR5LnkgIT09IDApIG1vbWVudHVtRHVyYXRpb25ZID0gTWF0aC5hYnMoKG5ld1Bvc2l0aW9uWSAtIGltYWdlLmN1cnJlbnRZKSAvIHZlbG9jaXR5LnkpO1xuICAgIGNvbnN0IG1vbWVudHVtRHVyYXRpb24gPSBNYXRoLm1heChtb21lbnR1bUR1cmF0aW9uWCwgbW9tZW50dW1EdXJhdGlvblkpO1xuICAgIGltYWdlLmN1cnJlbnRYID0gbmV3UG9zaXRpb25YO1xuICAgIGltYWdlLmN1cnJlbnRZID0gbmV3UG9zaXRpb25ZO1xuICAgIC8vIERlZmluZSBpZiB3ZSBuZWVkIGltYWdlIGRyYWdcbiAgICBjb25zdCBzY2FsZWRXaWR0aCA9IGltYWdlLndpZHRoICogem9vbS5zY2FsZTtcbiAgICBjb25zdCBzY2FsZWRIZWlnaHQgPSBpbWFnZS5oZWlnaHQgKiB6b29tLnNjYWxlO1xuICAgIGltYWdlLm1pblggPSBNYXRoLm1pbihnZXN0dXJlLnNsaWRlV2lkdGggLyAyIC0gc2NhbGVkV2lkdGggLyAyLCAwKTtcbiAgICBpbWFnZS5tYXhYID0gLWltYWdlLm1pblg7XG4gICAgaW1hZ2UubWluWSA9IE1hdGgubWluKGdlc3R1cmUuc2xpZGVIZWlnaHQgLyAyIC0gc2NhbGVkSGVpZ2h0IC8gMiwgMCk7XG4gICAgaW1hZ2UubWF4WSA9IC1pbWFnZS5taW5ZO1xuICAgIGltYWdlLmN1cnJlbnRYID0gTWF0aC5tYXgoTWF0aC5taW4oaW1hZ2UuY3VycmVudFgsIGltYWdlLm1heFgpLCBpbWFnZS5taW5YKTtcbiAgICBpbWFnZS5jdXJyZW50WSA9IE1hdGgubWF4KE1hdGgubWluKGltYWdlLmN1cnJlbnRZLCBpbWFnZS5tYXhZKSwgaW1hZ2UubWluWSk7XG4gICAgZ2VzdHVyZS5pbWFnZVdyYXBFbC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSBgJHttb21lbnR1bUR1cmF0aW9ufW1zYDtcbiAgICBnZXN0dXJlLmltYWdlV3JhcEVsLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUzZCgke2ltYWdlLmN1cnJlbnRYfXB4LCAke2ltYWdlLmN1cnJlbnRZfXB4LDApYDtcbiAgfVxuICBmdW5jdGlvbiBvblRyYW5zaXRpb25FbmQoKSB7XG4gICAgY29uc3Qgem9vbSA9IHN3aXBlci56b29tO1xuICAgIGlmIChnZXN0dXJlLnNsaWRlRWwgJiYgc3dpcGVyLmFjdGl2ZUluZGV4ICE9PSBzd2lwZXIuc2xpZGVzLmluZGV4T2YoZ2VzdHVyZS5zbGlkZUVsKSkge1xuICAgICAgaWYgKGdlc3R1cmUuaW1hZ2VFbCkge1xuICAgICAgICBnZXN0dXJlLmltYWdlRWwuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZTNkKDAsMCwwKSBzY2FsZSgxKSc7XG4gICAgICB9XG4gICAgICBpZiAoZ2VzdHVyZS5pbWFnZVdyYXBFbCkge1xuICAgICAgICBnZXN0dXJlLmltYWdlV3JhcEVsLnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGUzZCgwLDAsMCknO1xuICAgICAgfVxuICAgICAgZ2VzdHVyZS5zbGlkZUVsLmNsYXNzTGlzdC5yZW1vdmUoYCR7c3dpcGVyLnBhcmFtcy56b29tLnpvb21lZFNsaWRlQ2xhc3N9YCk7XG4gICAgICB6b29tLnNjYWxlID0gMTtcbiAgICAgIGN1cnJlbnRTY2FsZSA9IDE7XG4gICAgICBnZXN0dXJlLnNsaWRlRWwgPSB1bmRlZmluZWQ7XG4gICAgICBnZXN0dXJlLmltYWdlRWwgPSB1bmRlZmluZWQ7XG4gICAgICBnZXN0dXJlLmltYWdlV3JhcEVsID0gdW5kZWZpbmVkO1xuICAgICAgZ2VzdHVyZS5vcmlnaW5YID0gMDtcbiAgICAgIGdlc3R1cmUub3JpZ2luWSA9IDA7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIHpvb21JbihlKSB7XG4gICAgY29uc3Qgem9vbSA9IHN3aXBlci56b29tO1xuICAgIGNvbnN0IHBhcmFtcyA9IHN3aXBlci5wYXJhbXMuem9vbTtcbiAgICBpZiAoIWdlc3R1cmUuc2xpZGVFbCkge1xuICAgICAgaWYgKGUgJiYgZS50YXJnZXQpIHtcbiAgICAgICAgZ2VzdHVyZS5zbGlkZUVsID0gZS50YXJnZXQuY2xvc2VzdChgLiR7c3dpcGVyLnBhcmFtcy5zbGlkZUNsYXNzfSwgc3dpcGVyLXNsaWRlYCk7XG4gICAgICB9XG4gICAgICBpZiAoIWdlc3R1cmUuc2xpZGVFbCkge1xuICAgICAgICBpZiAoc3dpcGVyLnBhcmFtcy52aXJ0dWFsICYmIHN3aXBlci5wYXJhbXMudmlydHVhbC5lbmFibGVkICYmIHN3aXBlci52aXJ0dWFsKSB7XG4gICAgICAgICAgZ2VzdHVyZS5zbGlkZUVsID0gZWxlbWVudENoaWxkcmVuKHN3aXBlci5zbGlkZXNFbCwgYC4ke3N3aXBlci5wYXJhbXMuc2xpZGVBY3RpdmVDbGFzc31gKVswXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBnZXN0dXJlLnNsaWRlRWwgPSBzd2lwZXIuc2xpZGVzW3N3aXBlci5hY3RpdmVJbmRleF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxldCBpbWFnZUVsID0gZ2VzdHVyZS5zbGlkZUVsLnF1ZXJ5U2VsZWN0b3IoYC4ke3BhcmFtcy5jb250YWluZXJDbGFzc31gKTtcbiAgICAgIGlmIChpbWFnZUVsKSB7XG4gICAgICAgIGltYWdlRWwgPSBpbWFnZUVsLnF1ZXJ5U2VsZWN0b3JBbGwoJ3BpY3R1cmUsIGltZywgc3ZnLCBjYW52YXMsIC5zd2lwZXItem9vbS10YXJnZXQnKVswXTtcbiAgICAgIH1cbiAgICAgIGdlc3R1cmUuaW1hZ2VFbCA9IGltYWdlRWw7XG4gICAgICBpZiAoaW1hZ2VFbCkge1xuICAgICAgICBnZXN0dXJlLmltYWdlV3JhcEVsID0gZWxlbWVudFBhcmVudHMoZ2VzdHVyZS5pbWFnZUVsLCBgLiR7cGFyYW1zLmNvbnRhaW5lckNsYXNzfWApWzBdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZ2VzdHVyZS5pbWFnZVdyYXBFbCA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFnZXN0dXJlLmltYWdlRWwgfHwgIWdlc3R1cmUuaW1hZ2VXcmFwRWwpIHJldHVybjtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5jc3NNb2RlKSB7XG4gICAgICBzd2lwZXIud3JhcHBlckVsLnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XG4gICAgICBzd2lwZXIud3JhcHBlckVsLnN0eWxlLnRvdWNoQWN0aW9uID0gJ25vbmUnO1xuICAgIH1cbiAgICBnZXN0dXJlLnNsaWRlRWwuY2xhc3NMaXN0LmFkZChgJHtwYXJhbXMuem9vbWVkU2xpZGVDbGFzc31gKTtcbiAgICBsZXQgdG91Y2hYO1xuICAgIGxldCB0b3VjaFk7XG4gICAgbGV0IG9mZnNldFg7XG4gICAgbGV0IG9mZnNldFk7XG4gICAgbGV0IGRpZmZYO1xuICAgIGxldCBkaWZmWTtcbiAgICBsZXQgdHJhbnNsYXRlWDtcbiAgICBsZXQgdHJhbnNsYXRlWTtcbiAgICBsZXQgaW1hZ2VXaWR0aDtcbiAgICBsZXQgaW1hZ2VIZWlnaHQ7XG4gICAgbGV0IHNjYWxlZFdpZHRoO1xuICAgIGxldCBzY2FsZWRIZWlnaHQ7XG4gICAgbGV0IHRyYW5zbGF0ZU1pblg7XG4gICAgbGV0IHRyYW5zbGF0ZU1pblk7XG4gICAgbGV0IHRyYW5zbGF0ZU1heFg7XG4gICAgbGV0IHRyYW5zbGF0ZU1heFk7XG4gICAgbGV0IHNsaWRlV2lkdGg7XG4gICAgbGV0IHNsaWRlSGVpZ2h0O1xuICAgIGlmICh0eXBlb2YgaW1hZ2UudG91Y2hlc1N0YXJ0LnggPT09ICd1bmRlZmluZWQnICYmIGUpIHtcbiAgICAgIHRvdWNoWCA9IGUucGFnZVg7XG4gICAgICB0b3VjaFkgPSBlLnBhZ2VZO1xuICAgIH0gZWxzZSB7XG4gICAgICB0b3VjaFggPSBpbWFnZS50b3VjaGVzU3RhcnQueDtcbiAgICAgIHRvdWNoWSA9IGltYWdlLnRvdWNoZXNTdGFydC55O1xuICAgIH1cbiAgICBjb25zdCBmb3JjZVpvb21SYXRpbyA9IHR5cGVvZiBlID09PSAnbnVtYmVyJyA/IGUgOiBudWxsO1xuICAgIGlmIChjdXJyZW50U2NhbGUgPT09IDEgJiYgZm9yY2Vab29tUmF0aW8pIHtcbiAgICAgIHRvdWNoWCA9IHVuZGVmaW5lZDtcbiAgICAgIHRvdWNoWSA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgem9vbS5zY2FsZSA9IGZvcmNlWm9vbVJhdGlvIHx8IGdlc3R1cmUuaW1hZ2VXcmFwRWwuZ2V0QXR0cmlidXRlKCdkYXRhLXN3aXBlci16b29tJykgfHwgcGFyYW1zLm1heFJhdGlvO1xuICAgIGN1cnJlbnRTY2FsZSA9IGZvcmNlWm9vbVJhdGlvIHx8IGdlc3R1cmUuaW1hZ2VXcmFwRWwuZ2V0QXR0cmlidXRlKCdkYXRhLXN3aXBlci16b29tJykgfHwgcGFyYW1zLm1heFJhdGlvO1xuICAgIGlmIChlICYmICEoY3VycmVudFNjYWxlID09PSAxICYmIGZvcmNlWm9vbVJhdGlvKSkge1xuICAgICAgc2xpZGVXaWR0aCA9IGdlc3R1cmUuc2xpZGVFbC5vZmZzZXRXaWR0aDtcbiAgICAgIHNsaWRlSGVpZ2h0ID0gZ2VzdHVyZS5zbGlkZUVsLm9mZnNldEhlaWdodDtcbiAgICAgIG9mZnNldFggPSBlbGVtZW50T2Zmc2V0KGdlc3R1cmUuc2xpZGVFbCkubGVmdCArIHdpbmRvdy5zY3JvbGxYO1xuICAgICAgb2Zmc2V0WSA9IGVsZW1lbnRPZmZzZXQoZ2VzdHVyZS5zbGlkZUVsKS50b3AgKyB3aW5kb3cuc2Nyb2xsWTtcbiAgICAgIGRpZmZYID0gb2Zmc2V0WCArIHNsaWRlV2lkdGggLyAyIC0gdG91Y2hYO1xuICAgICAgZGlmZlkgPSBvZmZzZXRZICsgc2xpZGVIZWlnaHQgLyAyIC0gdG91Y2hZO1xuICAgICAgaW1hZ2VXaWR0aCA9IGdlc3R1cmUuaW1hZ2VFbC5vZmZzZXRXaWR0aDtcbiAgICAgIGltYWdlSGVpZ2h0ID0gZ2VzdHVyZS5pbWFnZUVsLm9mZnNldEhlaWdodDtcbiAgICAgIHNjYWxlZFdpZHRoID0gaW1hZ2VXaWR0aCAqIHpvb20uc2NhbGU7XG4gICAgICBzY2FsZWRIZWlnaHQgPSBpbWFnZUhlaWdodCAqIHpvb20uc2NhbGU7XG4gICAgICB0cmFuc2xhdGVNaW5YID0gTWF0aC5taW4oc2xpZGVXaWR0aCAvIDIgLSBzY2FsZWRXaWR0aCAvIDIsIDApO1xuICAgICAgdHJhbnNsYXRlTWluWSA9IE1hdGgubWluKHNsaWRlSGVpZ2h0IC8gMiAtIHNjYWxlZEhlaWdodCAvIDIsIDApO1xuICAgICAgdHJhbnNsYXRlTWF4WCA9IC10cmFuc2xhdGVNaW5YO1xuICAgICAgdHJhbnNsYXRlTWF4WSA9IC10cmFuc2xhdGVNaW5ZO1xuICAgICAgdHJhbnNsYXRlWCA9IGRpZmZYICogem9vbS5zY2FsZTtcbiAgICAgIHRyYW5zbGF0ZVkgPSBkaWZmWSAqIHpvb20uc2NhbGU7XG4gICAgICBpZiAodHJhbnNsYXRlWCA8IHRyYW5zbGF0ZU1pblgpIHtcbiAgICAgICAgdHJhbnNsYXRlWCA9IHRyYW5zbGF0ZU1pblg7XG4gICAgICB9XG4gICAgICBpZiAodHJhbnNsYXRlWCA+IHRyYW5zbGF0ZU1heFgpIHtcbiAgICAgICAgdHJhbnNsYXRlWCA9IHRyYW5zbGF0ZU1heFg7XG4gICAgICB9XG4gICAgICBpZiAodHJhbnNsYXRlWSA8IHRyYW5zbGF0ZU1pblkpIHtcbiAgICAgICAgdHJhbnNsYXRlWSA9IHRyYW5zbGF0ZU1pblk7XG4gICAgICB9XG4gICAgICBpZiAodHJhbnNsYXRlWSA+IHRyYW5zbGF0ZU1heFkpIHtcbiAgICAgICAgdHJhbnNsYXRlWSA9IHRyYW5zbGF0ZU1heFk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyYW5zbGF0ZVggPSAwO1xuICAgICAgdHJhbnNsYXRlWSA9IDA7XG4gICAgfVxuICAgIGlmIChmb3JjZVpvb21SYXRpbyAmJiB6b29tLnNjYWxlID09PSAxKSB7XG4gICAgICBnZXN0dXJlLm9yaWdpblggPSAwO1xuICAgICAgZ2VzdHVyZS5vcmlnaW5ZID0gMDtcbiAgICB9XG4gICAgZ2VzdHVyZS5pbWFnZVdyYXBFbC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSAnMzAwbXMnO1xuICAgIGdlc3R1cmUuaW1hZ2VXcmFwRWwuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZTNkKCR7dHJhbnNsYXRlWH1weCwgJHt0cmFuc2xhdGVZfXB4LDApYDtcbiAgICBnZXN0dXJlLmltYWdlRWwuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gJzMwMG1zJztcbiAgICBnZXN0dXJlLmltYWdlRWwuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZTNkKDAsMCwwKSBzY2FsZSgke3pvb20uc2NhbGV9KWA7XG4gIH1cbiAgZnVuY3Rpb24gem9vbU91dCgpIHtcbiAgICBjb25zdCB6b29tID0gc3dpcGVyLnpvb207XG4gICAgY29uc3QgcGFyYW1zID0gc3dpcGVyLnBhcmFtcy56b29tO1xuICAgIGlmICghZ2VzdHVyZS5zbGlkZUVsKSB7XG4gICAgICBpZiAoc3dpcGVyLnBhcmFtcy52aXJ0dWFsICYmIHN3aXBlci5wYXJhbXMudmlydHVhbC5lbmFibGVkICYmIHN3aXBlci52aXJ0dWFsKSB7XG4gICAgICAgIGdlc3R1cmUuc2xpZGVFbCA9IGVsZW1lbnRDaGlsZHJlbihzd2lwZXIuc2xpZGVzRWwsIGAuJHtzd2lwZXIucGFyYW1zLnNsaWRlQWN0aXZlQ2xhc3N9YClbMF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBnZXN0dXJlLnNsaWRlRWwgPSBzd2lwZXIuc2xpZGVzW3N3aXBlci5hY3RpdmVJbmRleF07XG4gICAgICB9XG4gICAgICBsZXQgaW1hZ2VFbCA9IGdlc3R1cmUuc2xpZGVFbC5xdWVyeVNlbGVjdG9yKGAuJHtwYXJhbXMuY29udGFpbmVyQ2xhc3N9YCk7XG4gICAgICBpZiAoaW1hZ2VFbCkge1xuICAgICAgICBpbWFnZUVsID0gaW1hZ2VFbC5xdWVyeVNlbGVjdG9yQWxsKCdwaWN0dXJlLCBpbWcsIHN2ZywgY2FudmFzLCAuc3dpcGVyLXpvb20tdGFyZ2V0JylbMF07XG4gICAgICB9XG4gICAgICBnZXN0dXJlLmltYWdlRWwgPSBpbWFnZUVsO1xuICAgICAgaWYgKGltYWdlRWwpIHtcbiAgICAgICAgZ2VzdHVyZS5pbWFnZVdyYXBFbCA9IGVsZW1lbnRQYXJlbnRzKGdlc3R1cmUuaW1hZ2VFbCwgYC4ke3BhcmFtcy5jb250YWluZXJDbGFzc31gKVswXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGdlc3R1cmUuaW1hZ2VXcmFwRWwgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghZ2VzdHVyZS5pbWFnZUVsIHx8ICFnZXN0dXJlLmltYWdlV3JhcEVsKSByZXR1cm47XG4gICAgaWYgKHN3aXBlci5wYXJhbXMuY3NzTW9kZSkge1xuICAgICAgc3dpcGVyLndyYXBwZXJFbC5zdHlsZS5vdmVyZmxvdyA9ICcnO1xuICAgICAgc3dpcGVyLndyYXBwZXJFbC5zdHlsZS50b3VjaEFjdGlvbiA9ICcnO1xuICAgIH1cbiAgICB6b29tLnNjYWxlID0gMTtcbiAgICBjdXJyZW50U2NhbGUgPSAxO1xuICAgIGdlc3R1cmUuaW1hZ2VXcmFwRWwuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gJzMwMG1zJztcbiAgICBnZXN0dXJlLmltYWdlV3JhcEVsLnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGUzZCgwLDAsMCknO1xuICAgIGdlc3R1cmUuaW1hZ2VFbC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSAnMzAwbXMnO1xuICAgIGdlc3R1cmUuaW1hZ2VFbC5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlM2QoMCwwLDApIHNjYWxlKDEpJztcbiAgICBnZXN0dXJlLnNsaWRlRWwuY2xhc3NMaXN0LnJlbW92ZShgJHtwYXJhbXMuem9vbWVkU2xpZGVDbGFzc31gKTtcbiAgICBnZXN0dXJlLnNsaWRlRWwgPSB1bmRlZmluZWQ7XG4gICAgZ2VzdHVyZS5vcmlnaW5YID0gMDtcbiAgICBnZXN0dXJlLm9yaWdpblkgPSAwO1xuICB9XG5cbiAgLy8gVG9nZ2xlIFpvb21cbiAgZnVuY3Rpb24gem9vbVRvZ2dsZShlKSB7XG4gICAgY29uc3Qgem9vbSA9IHN3aXBlci56b29tO1xuICAgIGlmICh6b29tLnNjYWxlICYmIHpvb20uc2NhbGUgIT09IDEpIHtcbiAgICAgIC8vIFpvb20gT3V0XG4gICAgICB6b29tT3V0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFpvb20gSW5cbiAgICAgIHpvb21JbihlKTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gZ2V0TGlzdGVuZXJzKCkge1xuICAgIGNvbnN0IHBhc3NpdmVMaXN0ZW5lciA9IHN3aXBlci5wYXJhbXMucGFzc2l2ZUxpc3RlbmVycyA/IHtcbiAgICAgIHBhc3NpdmU6IHRydWUsXG4gICAgICBjYXB0dXJlOiBmYWxzZVxuICAgIH0gOiBmYWxzZTtcbiAgICBjb25zdCBhY3RpdmVMaXN0ZW5lcldpdGhDYXB0dXJlID0gc3dpcGVyLnBhcmFtcy5wYXNzaXZlTGlzdGVuZXJzID8ge1xuICAgICAgcGFzc2l2ZTogZmFsc2UsXG4gICAgICBjYXB0dXJlOiB0cnVlXG4gICAgfSA6IHRydWU7XG4gICAgcmV0dXJuIHtcbiAgICAgIHBhc3NpdmVMaXN0ZW5lcixcbiAgICAgIGFjdGl2ZUxpc3RlbmVyV2l0aENhcHR1cmVcbiAgICB9O1xuICB9XG5cbiAgLy8gQXR0YWNoL0RldGFjaCBFdmVudHNcbiAgZnVuY3Rpb24gZW5hYmxlKCkge1xuICAgIGNvbnN0IHpvb20gPSBzd2lwZXIuem9vbTtcbiAgICBpZiAoem9vbS5lbmFibGVkKSByZXR1cm47XG4gICAgem9vbS5lbmFibGVkID0gdHJ1ZTtcbiAgICBjb25zdCB7XG4gICAgICBwYXNzaXZlTGlzdGVuZXIsXG4gICAgICBhY3RpdmVMaXN0ZW5lcldpdGhDYXB0dXJlXG4gICAgfSA9IGdldExpc3RlbmVycygpO1xuXG4gICAgLy8gU2NhbGUgaW1hZ2VcbiAgICBzd2lwZXIud3JhcHBlckVsLmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJkb3duJywgb25HZXN0dXJlU3RhcnQsIHBhc3NpdmVMaXN0ZW5lcik7XG4gICAgc3dpcGVyLndyYXBwZXJFbC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIG9uR2VzdHVyZUNoYW5nZSwgYWN0aXZlTGlzdGVuZXJXaXRoQ2FwdHVyZSk7XG4gICAgWydwb2ludGVydXAnLCAncG9pbnRlcmNhbmNlbCcsICdwb2ludGVyb3V0J10uZm9yRWFjaChldmVudE5hbWUgPT4ge1xuICAgICAgc3dpcGVyLndyYXBwZXJFbC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgb25HZXN0dXJlRW5kLCBwYXNzaXZlTGlzdGVuZXIpO1xuICAgIH0pO1xuXG4gICAgLy8gTW92ZSBpbWFnZVxuICAgIHN3aXBlci53cmFwcGVyRWwuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcm1vdmUnLCBvblRvdWNoTW92ZSwgYWN0aXZlTGlzdGVuZXJXaXRoQ2FwdHVyZSk7XG4gIH1cbiAgZnVuY3Rpb24gZGlzYWJsZSgpIHtcbiAgICBjb25zdCB6b29tID0gc3dpcGVyLnpvb207XG4gICAgaWYgKCF6b29tLmVuYWJsZWQpIHJldHVybjtcbiAgICB6b29tLmVuYWJsZWQgPSBmYWxzZTtcbiAgICBjb25zdCB7XG4gICAgICBwYXNzaXZlTGlzdGVuZXIsXG4gICAgICBhY3RpdmVMaXN0ZW5lcldpdGhDYXB0dXJlXG4gICAgfSA9IGdldExpc3RlbmVycygpO1xuXG4gICAgLy8gU2NhbGUgaW1hZ2VcbiAgICBzd2lwZXIud3JhcHBlckVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJkb3duJywgb25HZXN0dXJlU3RhcnQsIHBhc3NpdmVMaXN0ZW5lcik7XG4gICAgc3dpcGVyLndyYXBwZXJFbC5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIG9uR2VzdHVyZUNoYW5nZSwgYWN0aXZlTGlzdGVuZXJXaXRoQ2FwdHVyZSk7XG4gICAgWydwb2ludGVydXAnLCAncG9pbnRlcmNhbmNlbCcsICdwb2ludGVyb3V0J10uZm9yRWFjaChldmVudE5hbWUgPT4ge1xuICAgICAgc3dpcGVyLndyYXBwZXJFbC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgb25HZXN0dXJlRW5kLCBwYXNzaXZlTGlzdGVuZXIpO1xuICAgIH0pO1xuXG4gICAgLy8gTW92ZSBpbWFnZVxuICAgIHN3aXBlci53cmFwcGVyRWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcm1vdmUnLCBvblRvdWNoTW92ZSwgYWN0aXZlTGlzdGVuZXJXaXRoQ2FwdHVyZSk7XG4gIH1cbiAgb24oJ2luaXQnLCAoKSA9PiB7XG4gICAgaWYgKHN3aXBlci5wYXJhbXMuem9vbS5lbmFibGVkKSB7XG4gICAgICBlbmFibGUoKTtcbiAgICB9XG4gIH0pO1xuICBvbignZGVzdHJveScsICgpID0+IHtcbiAgICBkaXNhYmxlKCk7XG4gIH0pO1xuICBvbigndG91Y2hTdGFydCcsIChfcywgZSkgPT4ge1xuICAgIGlmICghc3dpcGVyLnpvb20uZW5hYmxlZCkgcmV0dXJuO1xuICAgIG9uVG91Y2hTdGFydChlKTtcbiAgfSk7XG4gIG9uKCd0b3VjaEVuZCcsIChfcywgZSkgPT4ge1xuICAgIGlmICghc3dpcGVyLnpvb20uZW5hYmxlZCkgcmV0dXJuO1xuICAgIG9uVG91Y2hFbmQoKTtcbiAgfSk7XG4gIG9uKCdkb3VibGVUYXAnLCAoX3MsIGUpID0+IHtcbiAgICBpZiAoIXN3aXBlci5hbmltYXRpbmcgJiYgc3dpcGVyLnBhcmFtcy56b29tLmVuYWJsZWQgJiYgc3dpcGVyLnpvb20uZW5hYmxlZCAmJiBzd2lwZXIucGFyYW1zLnpvb20udG9nZ2xlKSB7XG4gICAgICB6b29tVG9nZ2xlKGUpO1xuICAgIH1cbiAgfSk7XG4gIG9uKCd0cmFuc2l0aW9uRW5kJywgKCkgPT4ge1xuICAgIGlmIChzd2lwZXIuem9vbS5lbmFibGVkICYmIHN3aXBlci5wYXJhbXMuem9vbS5lbmFibGVkKSB7XG4gICAgICBvblRyYW5zaXRpb25FbmQoKTtcbiAgICB9XG4gIH0pO1xuICBvbignc2xpZGVDaGFuZ2UnLCAoKSA9PiB7XG4gICAgaWYgKHN3aXBlci56b29tLmVuYWJsZWQgJiYgc3dpcGVyLnBhcmFtcy56b29tLmVuYWJsZWQgJiYgc3dpcGVyLnBhcmFtcy5jc3NNb2RlKSB7XG4gICAgICBvblRyYW5zaXRpb25FbmQoKTtcbiAgICB9XG4gIH0pO1xuICBPYmplY3QuYXNzaWduKHN3aXBlci56b29tLCB7XG4gICAgZW5hYmxlLFxuICAgIGRpc2FibGUsXG4gICAgaW46IHpvb21JbixcbiAgICBvdXQ6IHpvb21PdXQsXG4gICAgdG9nZ2xlOiB6b29tVG9nZ2xlXG4gIH0pO1xufVxuXG5leHBvcnQgeyBab29tIGFzIGRlZmF1bHQgfTtcbiIsImltcG9ydCB7IG4gYXMgbmV4dFRpY2ssIGogYXMgZWxlbWVudFRyYW5zaXRpb25FbmQgfSBmcm9tICcuLi9zaGFyZWQvdXRpbHMubWpzJztcblxuLyogZXNsaW50IG5vLWJpdHdpc2U6IFtcImVycm9yXCIsIHsgXCJhbGxvd1wiOiBbXCI+PlwiXSB9XSAqL1xuZnVuY3Rpb24gQ29udHJvbGxlcihfcmVmKSB7XG4gIGxldCB7XG4gICAgc3dpcGVyLFxuICAgIGV4dGVuZFBhcmFtcyxcbiAgICBvblxuICB9ID0gX3JlZjtcbiAgZXh0ZW5kUGFyYW1zKHtcbiAgICBjb250cm9sbGVyOiB7XG4gICAgICBjb250cm9sOiB1bmRlZmluZWQsXG4gICAgICBpbnZlcnNlOiBmYWxzZSxcbiAgICAgIGJ5OiAnc2xpZGUnIC8vIG9yICdjb250YWluZXInXG4gICAgfVxuICB9KTtcblxuICBzd2lwZXIuY29udHJvbGxlciA9IHtcbiAgICBjb250cm9sOiB1bmRlZmluZWRcbiAgfTtcbiAgZnVuY3Rpb24gTGluZWFyU3BsaW5lKHgsIHkpIHtcbiAgICBjb25zdCBiaW5hcnlTZWFyY2ggPSBmdW5jdGlvbiBzZWFyY2goKSB7XG4gICAgICBsZXQgbWF4SW5kZXg7XG4gICAgICBsZXQgbWluSW5kZXg7XG4gICAgICBsZXQgZ3Vlc3M7XG4gICAgICByZXR1cm4gKGFycmF5LCB2YWwpID0+IHtcbiAgICAgICAgbWluSW5kZXggPSAtMTtcbiAgICAgICAgbWF4SW5kZXggPSBhcnJheS5sZW5ndGg7XG4gICAgICAgIHdoaWxlIChtYXhJbmRleCAtIG1pbkluZGV4ID4gMSkge1xuICAgICAgICAgIGd1ZXNzID0gbWF4SW5kZXggKyBtaW5JbmRleCA+PiAxO1xuICAgICAgICAgIGlmIChhcnJheVtndWVzc10gPD0gdmFsKSB7XG4gICAgICAgICAgICBtaW5JbmRleCA9IGd1ZXNzO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtYXhJbmRleCA9IGd1ZXNzO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWF4SW5kZXg7XG4gICAgICB9O1xuICAgIH0oKTtcbiAgICB0aGlzLnggPSB4O1xuICAgIHRoaXMueSA9IHk7XG4gICAgdGhpcy5sYXN0SW5kZXggPSB4Lmxlbmd0aCAtIDE7XG4gICAgLy8gR2l2ZW4gYW4geCB2YWx1ZSAoeDIpLCByZXR1cm4gdGhlIGV4cGVjdGVkIHkyIHZhbHVlOlxuICAgIC8vICh4MSx5MSkgaXMgdGhlIGtub3duIHBvaW50IGJlZm9yZSBnaXZlbiB2YWx1ZSxcbiAgICAvLyAoeDMseTMpIGlzIHRoZSBrbm93biBwb2ludCBhZnRlciBnaXZlbiB2YWx1ZS5cbiAgICBsZXQgaTE7XG4gICAgbGV0IGkzO1xuICAgIHRoaXMuaW50ZXJwb2xhdGUgPSBmdW5jdGlvbiBpbnRlcnBvbGF0ZSh4Mikge1xuICAgICAgaWYgKCF4MikgcmV0dXJuIDA7XG5cbiAgICAgIC8vIEdldCB0aGUgaW5kZXhlcyBvZiB4MSBhbmQgeDMgKHRoZSBhcnJheSBpbmRleGVzIGJlZm9yZSBhbmQgYWZ0ZXIgZ2l2ZW4geDIpOlxuICAgICAgaTMgPSBiaW5hcnlTZWFyY2godGhpcy54LCB4Mik7XG4gICAgICBpMSA9IGkzIC0gMTtcblxuICAgICAgLy8gV2UgaGF2ZSBvdXIgaW5kZXhlcyBpMSAmIGkzLCBzbyB3ZSBjYW4gY2FsY3VsYXRlIGFscmVhZHk6XG4gICAgICAvLyB5MiA6PSAoKHgy4oiSeDEpIMOXICh5M+KIknkxKSkgw7cgKHgz4oiSeDEpICsgeTFcbiAgICAgIHJldHVybiAoeDIgLSB0aGlzLnhbaTFdKSAqICh0aGlzLnlbaTNdIC0gdGhpcy55W2kxXSkgLyAodGhpcy54W2kzXSAtIHRoaXMueFtpMV0pICsgdGhpcy55W2kxXTtcbiAgICB9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIGZ1bmN0aW9uIGdldEludGVycG9sYXRlRnVuY3Rpb24oYykge1xuICAgIHN3aXBlci5jb250cm9sbGVyLnNwbGluZSA9IHN3aXBlci5wYXJhbXMubG9vcCA/IG5ldyBMaW5lYXJTcGxpbmUoc3dpcGVyLnNsaWRlc0dyaWQsIGMuc2xpZGVzR3JpZCkgOiBuZXcgTGluZWFyU3BsaW5lKHN3aXBlci5zbmFwR3JpZCwgYy5zbmFwR3JpZCk7XG4gIH1cbiAgZnVuY3Rpb24gc2V0VHJhbnNsYXRlKF90LCBieUNvbnRyb2xsZXIpIHtcbiAgICBjb25zdCBjb250cm9sbGVkID0gc3dpcGVyLmNvbnRyb2xsZXIuY29udHJvbDtcbiAgICBsZXQgbXVsdGlwbGllcjtcbiAgICBsZXQgY29udHJvbGxlZFRyYW5zbGF0ZTtcbiAgICBjb25zdCBTd2lwZXIgPSBzd2lwZXIuY29uc3RydWN0b3I7XG4gICAgZnVuY3Rpb24gc2V0Q29udHJvbGxlZFRyYW5zbGF0ZShjKSB7XG4gICAgICBpZiAoYy5kZXN0cm95ZWQpIHJldHVybjtcblxuICAgICAgLy8gdGhpcyB3aWxsIGNyZWF0ZSBhbiBJbnRlcnBvbGF0ZSBmdW5jdGlvbiBiYXNlZCBvbiB0aGUgc25hcEdyaWRzXG4gICAgICAvLyB4IGlzIHRoZSBHcmlkIG9mIHRoZSBzY3JvbGxlZCBzY3JvbGxlciBhbmQgeSB3aWxsIGJlIHRoZSBjb250cm9sbGVkIHNjcm9sbGVyXG4gICAgICAvLyBpdCBtYWtlcyBzZW5zZSB0byBjcmVhdGUgdGhpcyBvbmx5IG9uY2UgYW5kIHJlY2FsbCBpdCBmb3IgdGhlIGludGVycG9sYXRpb25cbiAgICAgIC8vIHRoZSBmdW5jdGlvbiBkb2VzIGEgbG90IG9mIHZhbHVlIGNhY2hpbmcgZm9yIHBlcmZvcm1hbmNlXG4gICAgICBjb25zdCB0cmFuc2xhdGUgPSBzd2lwZXIucnRsVHJhbnNsYXRlID8gLXN3aXBlci50cmFuc2xhdGUgOiBzd2lwZXIudHJhbnNsYXRlO1xuICAgICAgaWYgKHN3aXBlci5wYXJhbXMuY29udHJvbGxlci5ieSA9PT0gJ3NsaWRlJykge1xuICAgICAgICBnZXRJbnRlcnBvbGF0ZUZ1bmN0aW9uKGMpO1xuICAgICAgICAvLyBpIGFtIG5vdCBzdXJlIHdoeSB0aGUgdmFsdWVzIGhhdmUgdG8gYmUgbXVsdGlwbGljYXRlZCB0aGlzIHdheSwgdHJpZWQgdG8gaW52ZXJ0IHRoZSBzbmFwR3JpZFxuICAgICAgICAvLyBidXQgaXQgZGlkIG5vdCB3b3JrIG91dFxuICAgICAgICBjb250cm9sbGVkVHJhbnNsYXRlID0gLXN3aXBlci5jb250cm9sbGVyLnNwbGluZS5pbnRlcnBvbGF0ZSgtdHJhbnNsYXRlKTtcbiAgICAgIH1cbiAgICAgIGlmICghY29udHJvbGxlZFRyYW5zbGF0ZSB8fCBzd2lwZXIucGFyYW1zLmNvbnRyb2xsZXIuYnkgPT09ICdjb250YWluZXInKSB7XG4gICAgICAgIG11bHRpcGxpZXIgPSAoYy5tYXhUcmFuc2xhdGUoKSAtIGMubWluVHJhbnNsYXRlKCkpIC8gKHN3aXBlci5tYXhUcmFuc2xhdGUoKSAtIHN3aXBlci5taW5UcmFuc2xhdGUoKSk7XG4gICAgICAgIGlmIChOdW1iZXIuaXNOYU4obXVsdGlwbGllcikgfHwgIU51bWJlci5pc0Zpbml0ZShtdWx0aXBsaWVyKSkge1xuICAgICAgICAgIG11bHRpcGxpZXIgPSAxO1xuICAgICAgICB9XG4gICAgICAgIGNvbnRyb2xsZWRUcmFuc2xhdGUgPSAodHJhbnNsYXRlIC0gc3dpcGVyLm1pblRyYW5zbGF0ZSgpKSAqIG11bHRpcGxpZXIgKyBjLm1pblRyYW5zbGF0ZSgpO1xuICAgICAgfVxuICAgICAgaWYgKHN3aXBlci5wYXJhbXMuY29udHJvbGxlci5pbnZlcnNlKSB7XG4gICAgICAgIGNvbnRyb2xsZWRUcmFuc2xhdGUgPSBjLm1heFRyYW5zbGF0ZSgpIC0gY29udHJvbGxlZFRyYW5zbGF0ZTtcbiAgICAgIH1cbiAgICAgIGMudXBkYXRlUHJvZ3Jlc3MoY29udHJvbGxlZFRyYW5zbGF0ZSk7XG4gICAgICBjLnNldFRyYW5zbGF0ZShjb250cm9sbGVkVHJhbnNsYXRlLCBzd2lwZXIpO1xuICAgICAgYy51cGRhdGVBY3RpdmVJbmRleCgpO1xuICAgICAgYy51cGRhdGVTbGlkZXNDbGFzc2VzKCk7XG4gICAgfVxuICAgIGlmIChBcnJheS5pc0FycmF5KGNvbnRyb2xsZWQpKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbnRyb2xsZWQubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgaWYgKGNvbnRyb2xsZWRbaV0gIT09IGJ5Q29udHJvbGxlciAmJiBjb250cm9sbGVkW2ldIGluc3RhbmNlb2YgU3dpcGVyKSB7XG4gICAgICAgICAgc2V0Q29udHJvbGxlZFRyYW5zbGF0ZShjb250cm9sbGVkW2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoY29udHJvbGxlZCBpbnN0YW5jZW9mIFN3aXBlciAmJiBieUNvbnRyb2xsZXIgIT09IGNvbnRyb2xsZWQpIHtcbiAgICAgIHNldENvbnRyb2xsZWRUcmFuc2xhdGUoY29udHJvbGxlZCk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIHNldFRyYW5zaXRpb24oZHVyYXRpb24sIGJ5Q29udHJvbGxlcikge1xuICAgIGNvbnN0IFN3aXBlciA9IHN3aXBlci5jb25zdHJ1Y3RvcjtcbiAgICBjb25zdCBjb250cm9sbGVkID0gc3dpcGVyLmNvbnRyb2xsZXIuY29udHJvbDtcbiAgICBsZXQgaTtcbiAgICBmdW5jdGlvbiBzZXRDb250cm9sbGVkVHJhbnNpdGlvbihjKSB7XG4gICAgICBpZiAoYy5kZXN0cm95ZWQpIHJldHVybjtcbiAgICAgIGMuc2V0VHJhbnNpdGlvbihkdXJhdGlvbiwgc3dpcGVyKTtcbiAgICAgIGlmIChkdXJhdGlvbiAhPT0gMCkge1xuICAgICAgICBjLnRyYW5zaXRpb25TdGFydCgpO1xuICAgICAgICBpZiAoYy5wYXJhbXMuYXV0b0hlaWdodCkge1xuICAgICAgICAgIG5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgICAgIGMudXBkYXRlQXV0b0hlaWdodCgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsZW1lbnRUcmFuc2l0aW9uRW5kKGMud3JhcHBlckVsLCAoKSA9PiB7XG4gICAgICAgICAgaWYgKCFjb250cm9sbGVkKSByZXR1cm47XG4gICAgICAgICAgYy50cmFuc2l0aW9uRW5kKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoQXJyYXkuaXNBcnJheShjb250cm9sbGVkKSkge1xuICAgICAgZm9yIChpID0gMDsgaSA8IGNvbnRyb2xsZWQubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgaWYgKGNvbnRyb2xsZWRbaV0gIT09IGJ5Q29udHJvbGxlciAmJiBjb250cm9sbGVkW2ldIGluc3RhbmNlb2YgU3dpcGVyKSB7XG4gICAgICAgICAgc2V0Q29udHJvbGxlZFRyYW5zaXRpb24oY29udHJvbGxlZFtpXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGNvbnRyb2xsZWQgaW5zdGFuY2VvZiBTd2lwZXIgJiYgYnlDb250cm9sbGVyICE9PSBjb250cm9sbGVkKSB7XG4gICAgICBzZXRDb250cm9sbGVkVHJhbnNpdGlvbihjb250cm9sbGVkKTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gcmVtb3ZlU3BsaW5lKCkge1xuICAgIGlmICghc3dpcGVyLmNvbnRyb2xsZXIuY29udHJvbCkgcmV0dXJuO1xuICAgIGlmIChzd2lwZXIuY29udHJvbGxlci5zcGxpbmUpIHtcbiAgICAgIHN3aXBlci5jb250cm9sbGVyLnNwbGluZSA9IHVuZGVmaW5lZDtcbiAgICAgIGRlbGV0ZSBzd2lwZXIuY29udHJvbGxlci5zcGxpbmU7XG4gICAgfVxuICB9XG4gIG9uKCdiZWZvcmVJbml0JywgKCkgPT4ge1xuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiAoXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgIHR5cGVvZiBzd2lwZXIucGFyYW1zLmNvbnRyb2xsZXIuY29udHJvbCA9PT0gJ3N0cmluZycgfHwgc3dpcGVyLnBhcmFtcy5jb250cm9sbGVyLmNvbnRyb2wgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkpIHtcbiAgICAgIGNvbnN0IGNvbnRyb2xFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihzd2lwZXIucGFyYW1zLmNvbnRyb2xsZXIuY29udHJvbCk7XG4gICAgICBpZiAoY29udHJvbEVsZW1lbnQgJiYgY29udHJvbEVsZW1lbnQuc3dpcGVyKSB7XG4gICAgICAgIHN3aXBlci5jb250cm9sbGVyLmNvbnRyb2wgPSBjb250cm9sRWxlbWVudC5zd2lwZXI7XG4gICAgICB9IGVsc2UgaWYgKGNvbnRyb2xFbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IG9uQ29udHJvbGxlclN3aXBlciA9IGUgPT4ge1xuICAgICAgICAgIHN3aXBlci5jb250cm9sbGVyLmNvbnRyb2wgPSBlLmRldGFpbFswXTtcbiAgICAgICAgICBzd2lwZXIudXBkYXRlKCk7XG4gICAgICAgICAgY29udHJvbEVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignaW5pdCcsIG9uQ29udHJvbGxlclN3aXBlcik7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnRyb2xFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2luaXQnLCBvbkNvbnRyb2xsZXJTd2lwZXIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzd2lwZXIuY29udHJvbGxlci5jb250cm9sID0gc3dpcGVyLnBhcmFtcy5jb250cm9sbGVyLmNvbnRyb2w7XG4gIH0pO1xuICBvbigndXBkYXRlJywgKCkgPT4ge1xuICAgIHJlbW92ZVNwbGluZSgpO1xuICB9KTtcbiAgb24oJ3Jlc2l6ZScsICgpID0+IHtcbiAgICByZW1vdmVTcGxpbmUoKTtcbiAgfSk7XG4gIG9uKCdvYnNlcnZlclVwZGF0ZScsICgpID0+IHtcbiAgICByZW1vdmVTcGxpbmUoKTtcbiAgfSk7XG4gIG9uKCdzZXRUcmFuc2xhdGUnLCAoX3MsIHRyYW5zbGF0ZSwgYnlDb250cm9sbGVyKSA9PiB7XG4gICAgaWYgKCFzd2lwZXIuY29udHJvbGxlci5jb250cm9sIHx8IHN3aXBlci5jb250cm9sbGVyLmNvbnRyb2wuZGVzdHJveWVkKSByZXR1cm47XG4gICAgc3dpcGVyLmNvbnRyb2xsZXIuc2V0VHJhbnNsYXRlKHRyYW5zbGF0ZSwgYnlDb250cm9sbGVyKTtcbiAgfSk7XG4gIG9uKCdzZXRUcmFuc2l0aW9uJywgKF9zLCBkdXJhdGlvbiwgYnlDb250cm9sbGVyKSA9PiB7XG4gICAgaWYgKCFzd2lwZXIuY29udHJvbGxlci5jb250cm9sIHx8IHN3aXBlci5jb250cm9sbGVyLmNvbnRyb2wuZGVzdHJveWVkKSByZXR1cm47XG4gICAgc3dpcGVyLmNvbnRyb2xsZXIuc2V0VHJhbnNpdGlvbihkdXJhdGlvbiwgYnlDb250cm9sbGVyKTtcbiAgfSk7XG4gIE9iamVjdC5hc3NpZ24oc3dpcGVyLmNvbnRyb2xsZXIsIHtcbiAgICBzZXRUcmFuc2xhdGUsXG4gICAgc2V0VHJhbnNpdGlvblxuICB9KTtcbn1cblxuZXhwb3J0IHsgQ29udHJvbGxlciBhcyBkZWZhdWx0IH07XG4iLCJpbXBvcnQgeyBjIGFzIGNsYXNzZXNUb1NlbGVjdG9yIH0gZnJvbSAnLi4vc2hhcmVkL2NsYXNzZXMtdG8tc2VsZWN0b3IubWpzJztcbmltcG9ydCB7IGMgYXMgY3JlYXRlRWxlbWVudCwgZyBhcyBlbGVtZW50SW5kZXggfSBmcm9tICcuLi9zaGFyZWQvdXRpbHMubWpzJztcblxuZnVuY3Rpb24gQTExeShfcmVmKSB7XG4gIGxldCB7XG4gICAgc3dpcGVyLFxuICAgIGV4dGVuZFBhcmFtcyxcbiAgICBvblxuICB9ID0gX3JlZjtcbiAgZXh0ZW5kUGFyYW1zKHtcbiAgICBhMTF5OiB7XG4gICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgbm90aWZpY2F0aW9uQ2xhc3M6ICdzd2lwZXItbm90aWZpY2F0aW9uJyxcbiAgICAgIHByZXZTbGlkZU1lc3NhZ2U6ICdQcmV2aW91cyBzbGlkZScsXG4gICAgICBuZXh0U2xpZGVNZXNzYWdlOiAnTmV4dCBzbGlkZScsXG4gICAgICBmaXJzdFNsaWRlTWVzc2FnZTogJ1RoaXMgaXMgdGhlIGZpcnN0IHNsaWRlJyxcbiAgICAgIGxhc3RTbGlkZU1lc3NhZ2U6ICdUaGlzIGlzIHRoZSBsYXN0IHNsaWRlJyxcbiAgICAgIHBhZ2luYXRpb25CdWxsZXRNZXNzYWdlOiAnR28gdG8gc2xpZGUge3tpbmRleH19JyxcbiAgICAgIHNsaWRlTGFiZWxNZXNzYWdlOiAne3tpbmRleH19IC8ge3tzbGlkZXNMZW5ndGh9fScsXG4gICAgICBjb250YWluZXJNZXNzYWdlOiBudWxsLFxuICAgICAgY29udGFpbmVyUm9sZURlc2NyaXB0aW9uTWVzc2FnZTogbnVsbCxcbiAgICAgIGl0ZW1Sb2xlRGVzY3JpcHRpb25NZXNzYWdlOiBudWxsLFxuICAgICAgc2xpZGVSb2xlOiAnZ3JvdXAnLFxuICAgICAgaWQ6IG51bGxcbiAgICB9XG4gIH0pO1xuICBzd2lwZXIuYTExeSA9IHtcbiAgICBjbGlja2VkOiBmYWxzZVxuICB9O1xuICBsZXQgbGl2ZVJlZ2lvbiA9IG51bGw7XG4gIGZ1bmN0aW9uIG5vdGlmeShtZXNzYWdlKSB7XG4gICAgY29uc3Qgbm90aWZpY2F0aW9uID0gbGl2ZVJlZ2lvbjtcbiAgICBpZiAobm90aWZpY2F0aW9uLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgIG5vdGlmaWNhdGlvbi5pbm5lckhUTUwgPSAnJztcbiAgICBub3RpZmljYXRpb24uaW5uZXJIVE1MID0gbWVzc2FnZTtcbiAgfVxuICBjb25zdCBtYWtlRWxlbWVudHNBcnJheSA9IGVsID0+IChBcnJheS5pc0FycmF5KGVsKSA/IGVsIDogW2VsXSkuZmlsdGVyKGUgPT4gISFlKTtcbiAgZnVuY3Rpb24gZ2V0UmFuZG9tTnVtYmVyKHNpemUpIHtcbiAgICBpZiAoc2l6ZSA9PT0gdm9pZCAwKSB7XG4gICAgICBzaXplID0gMTY7XG4gICAgfVxuICAgIGNvbnN0IHJhbmRvbUNoYXIgPSAoKSA9PiBNYXRoLnJvdW5kKDE2ICogTWF0aC5yYW5kb20oKSkudG9TdHJpbmcoMTYpO1xuICAgIHJldHVybiAneCcucmVwZWF0KHNpemUpLnJlcGxhY2UoL3gvZywgcmFuZG9tQ2hhcik7XG4gIH1cbiAgZnVuY3Rpb24gbWFrZUVsRm9jdXNhYmxlKGVsKSB7XG4gICAgZWwgPSBtYWtlRWxlbWVudHNBcnJheShlbCk7XG4gICAgZWwuZm9yRWFjaChzdWJFbCA9PiB7XG4gICAgICBzdWJFbC5zZXRBdHRyaWJ1dGUoJ3RhYkluZGV4JywgJzAnKTtcbiAgICB9KTtcbiAgfVxuICBmdW5jdGlvbiBtYWtlRWxOb3RGb2N1c2FibGUoZWwpIHtcbiAgICBlbCA9IG1ha2VFbGVtZW50c0FycmF5KGVsKTtcbiAgICBlbC5mb3JFYWNoKHN1YkVsID0+IHtcbiAgICAgIHN1YkVsLnNldEF0dHJpYnV0ZSgndGFiSW5kZXgnLCAnLTEnKTtcbiAgICB9KTtcbiAgfVxuICBmdW5jdGlvbiBhZGRFbFJvbGUoZWwsIHJvbGUpIHtcbiAgICBlbCA9IG1ha2VFbGVtZW50c0FycmF5KGVsKTtcbiAgICBlbC5mb3JFYWNoKHN1YkVsID0+IHtcbiAgICAgIHN1YkVsLnNldEF0dHJpYnV0ZSgncm9sZScsIHJvbGUpO1xuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIGFkZEVsUm9sZURlc2NyaXB0aW9uKGVsLCBkZXNjcmlwdGlvbikge1xuICAgIGVsID0gbWFrZUVsZW1lbnRzQXJyYXkoZWwpO1xuICAgIGVsLmZvckVhY2goc3ViRWwgPT4ge1xuICAgICAgc3ViRWwuc2V0QXR0cmlidXRlKCdhcmlhLXJvbGVkZXNjcmlwdGlvbicsIGRlc2NyaXB0aW9uKTtcbiAgICB9KTtcbiAgfVxuICBmdW5jdGlvbiBhZGRFbENvbnRyb2xzKGVsLCBjb250cm9scykge1xuICAgIGVsID0gbWFrZUVsZW1lbnRzQXJyYXkoZWwpO1xuICAgIGVsLmZvckVhY2goc3ViRWwgPT4ge1xuICAgICAgc3ViRWwuc2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJywgY29udHJvbHMpO1xuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIGFkZEVsTGFiZWwoZWwsIGxhYmVsKSB7XG4gICAgZWwgPSBtYWtlRWxlbWVudHNBcnJheShlbCk7XG4gICAgZWwuZm9yRWFjaChzdWJFbCA9PiB7XG4gICAgICBzdWJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBsYWJlbCk7XG4gICAgfSk7XG4gIH1cbiAgZnVuY3Rpb24gYWRkRWxJZChlbCwgaWQpIHtcbiAgICBlbCA9IG1ha2VFbGVtZW50c0FycmF5KGVsKTtcbiAgICBlbC5mb3JFYWNoKHN1YkVsID0+IHtcbiAgICAgIHN1YkVsLnNldEF0dHJpYnV0ZSgnaWQnLCBpZCk7XG4gICAgfSk7XG4gIH1cbiAgZnVuY3Rpb24gYWRkRWxMaXZlKGVsLCBsaXZlKSB7XG4gICAgZWwgPSBtYWtlRWxlbWVudHNBcnJheShlbCk7XG4gICAgZWwuZm9yRWFjaChzdWJFbCA9PiB7XG4gICAgICBzdWJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGl2ZScsIGxpdmUpO1xuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIGRpc2FibGVFbChlbCkge1xuICAgIGVsID0gbWFrZUVsZW1lbnRzQXJyYXkoZWwpO1xuICAgIGVsLmZvckVhY2goc3ViRWwgPT4ge1xuICAgICAgc3ViRWwuc2V0QXR0cmlidXRlKCdhcmlhLWRpc2FibGVkJywgdHJ1ZSk7XG4gICAgfSk7XG4gIH1cbiAgZnVuY3Rpb24gZW5hYmxlRWwoZWwpIHtcbiAgICBlbCA9IG1ha2VFbGVtZW50c0FycmF5KGVsKTtcbiAgICBlbC5mb3JFYWNoKHN1YkVsID0+IHtcbiAgICAgIHN1YkVsLnNldEF0dHJpYnV0ZSgnYXJpYS1kaXNhYmxlZCcsIGZhbHNlKTtcbiAgICB9KTtcbiAgfVxuICBmdW5jdGlvbiBvbkVudGVyT3JTcGFjZUtleShlKSB7XG4gICAgaWYgKGUua2V5Q29kZSAhPT0gMTMgJiYgZS5rZXlDb2RlICE9PSAzMikgcmV0dXJuO1xuICAgIGNvbnN0IHBhcmFtcyA9IHN3aXBlci5wYXJhbXMuYTExeTtcbiAgICBjb25zdCB0YXJnZXRFbCA9IGUudGFyZ2V0O1xuICAgIGlmIChzd2lwZXIucGFnaW5hdGlvbiAmJiBzd2lwZXIucGFnaW5hdGlvbi5lbCAmJiAodGFyZ2V0RWwgPT09IHN3aXBlci5wYWdpbmF0aW9uLmVsIHx8IHN3aXBlci5wYWdpbmF0aW9uLmVsLmNvbnRhaW5zKGUudGFyZ2V0KSkpIHtcbiAgICAgIGlmICghZS50YXJnZXQubWF0Y2hlcyhjbGFzc2VzVG9TZWxlY3Rvcihzd2lwZXIucGFyYW1zLnBhZ2luYXRpb24uYnVsbGV0Q2xhc3MpKSkgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoc3dpcGVyLm5hdmlnYXRpb24gJiYgc3dpcGVyLm5hdmlnYXRpb24ubmV4dEVsICYmIHRhcmdldEVsID09PSBzd2lwZXIubmF2aWdhdGlvbi5uZXh0RWwpIHtcbiAgICAgIGlmICghKHN3aXBlci5pc0VuZCAmJiAhc3dpcGVyLnBhcmFtcy5sb29wKSkge1xuICAgICAgICBzd2lwZXIuc2xpZGVOZXh0KCk7XG4gICAgICB9XG4gICAgICBpZiAoc3dpcGVyLmlzRW5kKSB7XG4gICAgICAgIG5vdGlmeShwYXJhbXMubGFzdFNsaWRlTWVzc2FnZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBub3RpZnkocGFyYW1zLm5leHRTbGlkZU1lc3NhZ2UpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoc3dpcGVyLm5hdmlnYXRpb24gJiYgc3dpcGVyLm5hdmlnYXRpb24ucHJldkVsICYmIHRhcmdldEVsID09PSBzd2lwZXIubmF2aWdhdGlvbi5wcmV2RWwpIHtcbiAgICAgIGlmICghKHN3aXBlci5pc0JlZ2lubmluZyAmJiAhc3dpcGVyLnBhcmFtcy5sb29wKSkge1xuICAgICAgICBzd2lwZXIuc2xpZGVQcmV2KCk7XG4gICAgICB9XG4gICAgICBpZiAoc3dpcGVyLmlzQmVnaW5uaW5nKSB7XG4gICAgICAgIG5vdGlmeShwYXJhbXMuZmlyc3RTbGlkZU1lc3NhZ2UpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbm90aWZ5KHBhcmFtcy5wcmV2U2xpZGVNZXNzYWdlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHN3aXBlci5wYWdpbmF0aW9uICYmIHRhcmdldEVsLm1hdGNoZXMoY2xhc3Nlc1RvU2VsZWN0b3Ioc3dpcGVyLnBhcmFtcy5wYWdpbmF0aW9uLmJ1bGxldENsYXNzKSkpIHtcbiAgICAgIHRhcmdldEVsLmNsaWNrKCk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIHVwZGF0ZU5hdmlnYXRpb24oKSB7XG4gICAgaWYgKHN3aXBlci5wYXJhbXMubG9vcCB8fCBzd2lwZXIucGFyYW1zLnJld2luZCB8fCAhc3dpcGVyLm5hdmlnYXRpb24pIHJldHVybjtcbiAgICBjb25zdCB7XG4gICAgICBuZXh0RWwsXG4gICAgICBwcmV2RWxcbiAgICB9ID0gc3dpcGVyLm5hdmlnYXRpb247XG4gICAgaWYgKHByZXZFbCkge1xuICAgICAgaWYgKHN3aXBlci5pc0JlZ2lubmluZykge1xuICAgICAgICBkaXNhYmxlRWwocHJldkVsKTtcbiAgICAgICAgbWFrZUVsTm90Rm9jdXNhYmxlKHByZXZFbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbmFibGVFbChwcmV2RWwpO1xuICAgICAgICBtYWtlRWxGb2N1c2FibGUocHJldkVsKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG5leHRFbCkge1xuICAgICAgaWYgKHN3aXBlci5pc0VuZCkge1xuICAgICAgICBkaXNhYmxlRWwobmV4dEVsKTtcbiAgICAgICAgbWFrZUVsTm90Rm9jdXNhYmxlKG5leHRFbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbmFibGVFbChuZXh0RWwpO1xuICAgICAgICBtYWtlRWxGb2N1c2FibGUobmV4dEVsKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gaGFzUGFnaW5hdGlvbigpIHtcbiAgICByZXR1cm4gc3dpcGVyLnBhZ2luYXRpb24gJiYgc3dpcGVyLnBhZ2luYXRpb24uYnVsbGV0cyAmJiBzd2lwZXIucGFnaW5hdGlvbi5idWxsZXRzLmxlbmd0aDtcbiAgfVxuICBmdW5jdGlvbiBoYXNDbGlja2FibGVQYWdpbmF0aW9uKCkge1xuICAgIHJldHVybiBoYXNQYWdpbmF0aW9uKCkgJiYgc3dpcGVyLnBhcmFtcy5wYWdpbmF0aW9uLmNsaWNrYWJsZTtcbiAgfVxuICBmdW5jdGlvbiB1cGRhdGVQYWdpbmF0aW9uKCkge1xuICAgIGNvbnN0IHBhcmFtcyA9IHN3aXBlci5wYXJhbXMuYTExeTtcbiAgICBpZiAoIWhhc1BhZ2luYXRpb24oKSkgcmV0dXJuO1xuICAgIHN3aXBlci5wYWdpbmF0aW9uLmJ1bGxldHMuZm9yRWFjaChidWxsZXRFbCA9PiB7XG4gICAgICBpZiAoc3dpcGVyLnBhcmFtcy5wYWdpbmF0aW9uLmNsaWNrYWJsZSkge1xuICAgICAgICBtYWtlRWxGb2N1c2FibGUoYnVsbGV0RWwpO1xuICAgICAgICBpZiAoIXN3aXBlci5wYXJhbXMucGFnaW5hdGlvbi5yZW5kZXJCdWxsZXQpIHtcbiAgICAgICAgICBhZGRFbFJvbGUoYnVsbGV0RWwsICdidXR0b24nKTtcbiAgICAgICAgICBhZGRFbExhYmVsKGJ1bGxldEVsLCBwYXJhbXMucGFnaW5hdGlvbkJ1bGxldE1lc3NhZ2UucmVwbGFjZSgvXFx7XFx7aW5kZXhcXH1cXH0vLCBlbGVtZW50SW5kZXgoYnVsbGV0RWwpICsgMSkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoYnVsbGV0RWwubWF0Y2hlcyhjbGFzc2VzVG9TZWxlY3Rvcihzd2lwZXIucGFyYW1zLnBhZ2luYXRpb24uYnVsbGV0QWN0aXZlQ2xhc3MpKSkge1xuICAgICAgICBidWxsZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtY3VycmVudCcsICd0cnVlJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBidWxsZXRFbC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtY3VycmVudCcpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGNvbnN0IGluaXROYXZFbCA9IChlbCwgd3JhcHBlcklkLCBtZXNzYWdlKSA9PiB7XG4gICAgbWFrZUVsRm9jdXNhYmxlKGVsKTtcbiAgICBpZiAoZWwudGFnTmFtZSAhPT0gJ0JVVFRPTicpIHtcbiAgICAgIGFkZEVsUm9sZShlbCwgJ2J1dHRvbicpO1xuICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uRW50ZXJPclNwYWNlS2V5KTtcbiAgICB9XG4gICAgYWRkRWxMYWJlbChlbCwgbWVzc2FnZSk7XG4gICAgYWRkRWxDb250cm9scyhlbCwgd3JhcHBlcklkKTtcbiAgfTtcbiAgY29uc3QgaGFuZGxlUG9pbnRlckRvd24gPSAoKSA9PiB7XG4gICAgc3dpcGVyLmExMXkuY2xpY2tlZCA9IHRydWU7XG4gIH07XG4gIGNvbnN0IGhhbmRsZVBvaW50ZXJVcCA9ICgpID0+IHtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgaWYgKCFzd2lwZXIuZGVzdHJveWVkKSB7XG4gICAgICAgICAgc3dpcGVyLmExMXkuY2xpY2tlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcbiAgY29uc3QgaGFuZGxlRm9jdXMgPSBlID0+IHtcbiAgICBpZiAoc3dpcGVyLmExMXkuY2xpY2tlZCkgcmV0dXJuO1xuICAgIGNvbnN0IHNsaWRlRWwgPSBlLnRhcmdldC5jbG9zZXN0KGAuJHtzd2lwZXIucGFyYW1zLnNsaWRlQ2xhc3N9LCBzd2lwZXItc2xpZGVgKTtcbiAgICBpZiAoIXNsaWRlRWwgfHwgIXN3aXBlci5zbGlkZXMuaW5jbHVkZXMoc2xpZGVFbCkpIHJldHVybjtcbiAgICBjb25zdCBpc0FjdGl2ZSA9IHN3aXBlci5zbGlkZXMuaW5kZXhPZihzbGlkZUVsKSA9PT0gc3dpcGVyLmFjdGl2ZUluZGV4O1xuICAgIGNvbnN0IGlzVmlzaWJsZSA9IHN3aXBlci5wYXJhbXMud2F0Y2hTbGlkZXNQcm9ncmVzcyAmJiBzd2lwZXIudmlzaWJsZVNsaWRlcyAmJiBzd2lwZXIudmlzaWJsZVNsaWRlcy5pbmNsdWRlcyhzbGlkZUVsKTtcbiAgICBpZiAoaXNBY3RpdmUgfHwgaXNWaXNpYmxlKSByZXR1cm47XG4gICAgaWYgKGUuc291cmNlQ2FwYWJpbGl0aWVzICYmIGUuc291cmNlQ2FwYWJpbGl0aWVzLmZpcmVzVG91Y2hFdmVudHMpIHJldHVybjtcbiAgICBpZiAoc3dpcGVyLmlzSG9yaXpvbnRhbCgpKSB7XG4gICAgICBzd2lwZXIuZWwuc2Nyb2xsTGVmdCA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN3aXBlci5lbC5zY3JvbGxUb3AgPSAwO1xuICAgIH1cbiAgICBzd2lwZXIuc2xpZGVUbyhzd2lwZXIuc2xpZGVzLmluZGV4T2Yoc2xpZGVFbCksIDApO1xuICB9O1xuICBjb25zdCBpbml0U2xpZGVzID0gKCkgPT4ge1xuICAgIGNvbnN0IHBhcmFtcyA9IHN3aXBlci5wYXJhbXMuYTExeTtcbiAgICBpZiAocGFyYW1zLml0ZW1Sb2xlRGVzY3JpcHRpb25NZXNzYWdlKSB7XG4gICAgICBhZGRFbFJvbGVEZXNjcmlwdGlvbihzd2lwZXIuc2xpZGVzLCBwYXJhbXMuaXRlbVJvbGVEZXNjcmlwdGlvbk1lc3NhZ2UpO1xuICAgIH1cbiAgICBpZiAocGFyYW1zLnNsaWRlUm9sZSkge1xuICAgICAgYWRkRWxSb2xlKHN3aXBlci5zbGlkZXMsIHBhcmFtcy5zbGlkZVJvbGUpO1xuICAgIH1cbiAgICBjb25zdCBzbGlkZXNMZW5ndGggPSBzd2lwZXIuc2xpZGVzLmxlbmd0aDtcbiAgICBpZiAocGFyYW1zLnNsaWRlTGFiZWxNZXNzYWdlKSB7XG4gICAgICBzd2lwZXIuc2xpZGVzLmZvckVhY2goKHNsaWRlRWwsIGluZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IHNsaWRlSW5kZXggPSBzd2lwZXIucGFyYW1zLmxvb3AgPyBwYXJzZUludChzbGlkZUVsLmdldEF0dHJpYnV0ZSgnZGF0YS1zd2lwZXItc2xpZGUtaW5kZXgnKSwgMTApIDogaW5kZXg7XG4gICAgICAgIGNvbnN0IGFyaWFMYWJlbE1lc3NhZ2UgPSBwYXJhbXMuc2xpZGVMYWJlbE1lc3NhZ2UucmVwbGFjZSgvXFx7XFx7aW5kZXhcXH1cXH0vLCBzbGlkZUluZGV4ICsgMSkucmVwbGFjZSgvXFx7XFx7c2xpZGVzTGVuZ3RoXFx9XFx9Lywgc2xpZGVzTGVuZ3RoKTtcbiAgICAgICAgYWRkRWxMYWJlbChzbGlkZUVsLCBhcmlhTGFiZWxNZXNzYWdlKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgaW5pdCA9ICgpID0+IHtcbiAgICBjb25zdCBwYXJhbXMgPSBzd2lwZXIucGFyYW1zLmExMXk7XG4gICAgc3dpcGVyLmVsLmFwcGVuZChsaXZlUmVnaW9uKTtcblxuICAgIC8vIENvbnRhaW5lclxuICAgIGNvbnN0IGNvbnRhaW5lckVsID0gc3dpcGVyLmVsO1xuICAgIGlmIChwYXJhbXMuY29udGFpbmVyUm9sZURlc2NyaXB0aW9uTWVzc2FnZSkge1xuICAgICAgYWRkRWxSb2xlRGVzY3JpcHRpb24oY29udGFpbmVyRWwsIHBhcmFtcy5jb250YWluZXJSb2xlRGVzY3JpcHRpb25NZXNzYWdlKTtcbiAgICB9XG4gICAgaWYgKHBhcmFtcy5jb250YWluZXJNZXNzYWdlKSB7XG4gICAgICBhZGRFbExhYmVsKGNvbnRhaW5lckVsLCBwYXJhbXMuY29udGFpbmVyTWVzc2FnZSk7XG4gICAgfVxuXG4gICAgLy8gV3JhcHBlclxuICAgIGNvbnN0IHdyYXBwZXJFbCA9IHN3aXBlci53cmFwcGVyRWw7XG4gICAgY29uc3Qgd3JhcHBlcklkID0gcGFyYW1zLmlkIHx8IHdyYXBwZXJFbC5nZXRBdHRyaWJ1dGUoJ2lkJykgfHwgYHN3aXBlci13cmFwcGVyLSR7Z2V0UmFuZG9tTnVtYmVyKDE2KX1gO1xuICAgIGNvbnN0IGxpdmUgPSBzd2lwZXIucGFyYW1zLmF1dG9wbGF5ICYmIHN3aXBlci5wYXJhbXMuYXV0b3BsYXkuZW5hYmxlZCA/ICdvZmYnIDogJ3BvbGl0ZSc7XG4gICAgYWRkRWxJZCh3cmFwcGVyRWwsIHdyYXBwZXJJZCk7XG4gICAgYWRkRWxMaXZlKHdyYXBwZXJFbCwgbGl2ZSk7XG5cbiAgICAvLyBTbGlkZVxuICAgIGluaXRTbGlkZXMoKTtcblxuICAgIC8vIE5hdmlnYXRpb25cbiAgICBsZXQge1xuICAgICAgbmV4dEVsLFxuICAgICAgcHJldkVsXG4gICAgfSA9IHN3aXBlci5uYXZpZ2F0aW9uID8gc3dpcGVyLm5hdmlnYXRpb24gOiB7fTtcbiAgICBuZXh0RWwgPSBtYWtlRWxlbWVudHNBcnJheShuZXh0RWwpO1xuICAgIHByZXZFbCA9IG1ha2VFbGVtZW50c0FycmF5KHByZXZFbCk7XG4gICAgaWYgKG5leHRFbCkge1xuICAgICAgbmV4dEVsLmZvckVhY2goZWwgPT4gaW5pdE5hdkVsKGVsLCB3cmFwcGVySWQsIHBhcmFtcy5uZXh0U2xpZGVNZXNzYWdlKSk7XG4gICAgfVxuICAgIGlmIChwcmV2RWwpIHtcbiAgICAgIHByZXZFbC5mb3JFYWNoKGVsID0+IGluaXROYXZFbChlbCwgd3JhcHBlcklkLCBwYXJhbXMucHJldlNsaWRlTWVzc2FnZSkpO1xuICAgIH1cblxuICAgIC8vIFBhZ2luYXRpb25cbiAgICBpZiAoaGFzQ2xpY2thYmxlUGFnaW5hdGlvbigpKSB7XG4gICAgICBjb25zdCBwYWdpbmF0aW9uRWwgPSBtYWtlRWxlbWVudHNBcnJheShzd2lwZXIucGFnaW5hdGlvbi5lbCk7XG4gICAgICBwYWdpbmF0aW9uRWwuZm9yRWFjaChlbCA9PiB7XG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbkVudGVyT3JTcGFjZUtleSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBUYWIgZm9jdXNcbiAgICBzd2lwZXIuZWwuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCBoYW5kbGVGb2N1cywgdHJ1ZSk7XG4gICAgc3dpcGVyLmVsLmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJkb3duJywgaGFuZGxlUG9pbnRlckRvd24sIHRydWUpO1xuICAgIHN3aXBlci5lbC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVydXAnLCBoYW5kbGVQb2ludGVyVXAsIHRydWUpO1xuICB9O1xuICBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgIGlmIChsaXZlUmVnaW9uKSBsaXZlUmVnaW9uLnJlbW92ZSgpO1xuICAgIGxldCB7XG4gICAgICBuZXh0RWwsXG4gICAgICBwcmV2RWxcbiAgICB9ID0gc3dpcGVyLm5hdmlnYXRpb24gPyBzd2lwZXIubmF2aWdhdGlvbiA6IHt9O1xuICAgIG5leHRFbCA9IG1ha2VFbGVtZW50c0FycmF5KG5leHRFbCk7XG4gICAgcHJldkVsID0gbWFrZUVsZW1lbnRzQXJyYXkocHJldkVsKTtcbiAgICBpZiAobmV4dEVsKSB7XG4gICAgICBuZXh0RWwuZm9yRWFjaChlbCA9PiBlbC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25FbnRlck9yU3BhY2VLZXkpKTtcbiAgICB9XG4gICAgaWYgKHByZXZFbCkge1xuICAgICAgcHJldkVsLmZvckVhY2goZWwgPT4gZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uRW50ZXJPclNwYWNlS2V5KSk7XG4gICAgfVxuXG4gICAgLy8gUGFnaW5hdGlvblxuICAgIGlmIChoYXNDbGlja2FibGVQYWdpbmF0aW9uKCkpIHtcbiAgICAgIGNvbnN0IHBhZ2luYXRpb25FbCA9IG1ha2VFbGVtZW50c0FycmF5KHN3aXBlci5wYWdpbmF0aW9uLmVsKTtcbiAgICAgIHBhZ2luYXRpb25FbC5mb3JFYWNoKGVsID0+IHtcbiAgICAgICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uRW50ZXJPclNwYWNlS2V5KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFRhYiBmb2N1c1xuICAgIHN3aXBlci5lbC5yZW1vdmVFdmVudExpc3RlbmVyKCdmb2N1cycsIGhhbmRsZUZvY3VzLCB0cnVlKTtcbiAgICBzd2lwZXIuZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcmRvd24nLCBoYW5kbGVQb2ludGVyRG93biwgdHJ1ZSk7XG4gICAgc3dpcGVyLmVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsIGhhbmRsZVBvaW50ZXJVcCwgdHJ1ZSk7XG4gIH1cbiAgb24oJ2JlZm9yZUluaXQnLCAoKSA9PiB7XG4gICAgbGl2ZVJlZ2lvbiA9IGNyZWF0ZUVsZW1lbnQoJ3NwYW4nLCBzd2lwZXIucGFyYW1zLmExMXkubm90aWZpY2F0aW9uQ2xhc3MpO1xuICAgIGxpdmVSZWdpb24uc2V0QXR0cmlidXRlKCdhcmlhLWxpdmUnLCAnYXNzZXJ0aXZlJyk7XG4gICAgbGl2ZVJlZ2lvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtYXRvbWljJywgJ3RydWUnKTtcbiAgfSk7XG4gIG9uKCdhZnRlckluaXQnLCAoKSA9PiB7XG4gICAgaWYgKCFzd2lwZXIucGFyYW1zLmExMXkuZW5hYmxlZCkgcmV0dXJuO1xuICAgIGluaXQoKTtcbiAgfSk7XG4gIG9uKCdzbGlkZXNMZW5ndGhDaGFuZ2Ugc25hcEdyaWRMZW5ndGhDaGFuZ2Ugc2xpZGVzR3JpZExlbmd0aENoYW5nZScsICgpID0+IHtcbiAgICBpZiAoIXN3aXBlci5wYXJhbXMuYTExeS5lbmFibGVkKSByZXR1cm47XG4gICAgaW5pdFNsaWRlcygpO1xuICB9KTtcbiAgb24oJ2Zyb21FZGdlIHRvRWRnZSBhZnRlckluaXQgbG9jayB1bmxvY2snLCAoKSA9PiB7XG4gICAgaWYgKCFzd2lwZXIucGFyYW1zLmExMXkuZW5hYmxlZCkgcmV0dXJuO1xuICAgIHVwZGF0ZU5hdmlnYXRpb24oKTtcbiAgfSk7XG4gIG9uKCdwYWdpbmF0aW9uVXBkYXRlJywgKCkgPT4ge1xuICAgIGlmICghc3dpcGVyLnBhcmFtcy5hMTF5LmVuYWJsZWQpIHJldHVybjtcbiAgICB1cGRhdGVQYWdpbmF0aW9uKCk7XG4gIH0pO1xuICBvbignZGVzdHJveScsICgpID0+IHtcbiAgICBpZiAoIXN3aXBlci5wYXJhbXMuYTExeS5lbmFibGVkKSByZXR1cm47XG4gICAgZGVzdHJveSgpO1xuICB9KTtcbn1cblxuZXhwb3J0IHsgQTExeSBhcyBkZWZhdWx0IH07XG4iLCJpbXBvcnQgeyBhIGFzIGdldFdpbmRvdyB9IGZyb20gJy4uL3NoYXJlZC9zc3Itd2luZG93LmVzbS5tanMnO1xuXG5mdW5jdGlvbiBIaXN0b3J5KF9yZWYpIHtcbiAgbGV0IHtcbiAgICBzd2lwZXIsXG4gICAgZXh0ZW5kUGFyYW1zLFxuICAgIG9uXG4gIH0gPSBfcmVmO1xuICBleHRlbmRQYXJhbXMoe1xuICAgIGhpc3Rvcnk6IHtcbiAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgcm9vdDogJycsXG4gICAgICByZXBsYWNlU3RhdGU6IGZhbHNlLFxuICAgICAga2V5OiAnc2xpZGVzJyxcbiAgICAgIGtlZXBRdWVyeTogZmFsc2VcbiAgICB9XG4gIH0pO1xuICBsZXQgaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgbGV0IHBhdGhzID0ge307XG4gIGNvbnN0IHNsdWdpZnkgPSB0ZXh0ID0+IHtcbiAgICByZXR1cm4gdGV4dC50b1N0cmluZygpLnJlcGxhY2UoL1xccysvZywgJy0nKS5yZXBsYWNlKC9bXlxcdy1dKy9nLCAnJykucmVwbGFjZSgvLS0rL2csICctJykucmVwbGFjZSgvXi0rLywgJycpLnJlcGxhY2UoLy0rJC8sICcnKTtcbiAgfTtcbiAgY29uc3QgZ2V0UGF0aFZhbHVlcyA9IHVybE92ZXJyaWRlID0+IHtcbiAgICBjb25zdCB3aW5kb3cgPSBnZXRXaW5kb3coKTtcbiAgICBsZXQgbG9jYXRpb247XG4gICAgaWYgKHVybE92ZXJyaWRlKSB7XG4gICAgICBsb2NhdGlvbiA9IG5ldyBVUkwodXJsT3ZlcnJpZGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsb2NhdGlvbiA9IHdpbmRvdy5sb2NhdGlvbjtcbiAgICB9XG4gICAgY29uc3QgcGF0aEFycmF5ID0gbG9jYXRpb24ucGF0aG5hbWUuc2xpY2UoMSkuc3BsaXQoJy8nKS5maWx0ZXIocGFydCA9PiBwYXJ0ICE9PSAnJyk7XG4gICAgY29uc3QgdG90YWwgPSBwYXRoQXJyYXkubGVuZ3RoO1xuICAgIGNvbnN0IGtleSA9IHBhdGhBcnJheVt0b3RhbCAtIDJdO1xuICAgIGNvbnN0IHZhbHVlID0gcGF0aEFycmF5W3RvdGFsIC0gMV07XG4gICAgcmV0dXJuIHtcbiAgICAgIGtleSxcbiAgICAgIHZhbHVlXG4gICAgfTtcbiAgfTtcbiAgY29uc3Qgc2V0SGlzdG9yeSA9IChrZXksIGluZGV4KSA9PiB7XG4gICAgY29uc3Qgd2luZG93ID0gZ2V0V2luZG93KCk7XG4gICAgaWYgKCFpbml0aWFsaXplZCB8fCAhc3dpcGVyLnBhcmFtcy5oaXN0b3J5LmVuYWJsZWQpIHJldHVybjtcbiAgICBsZXQgbG9jYXRpb247XG4gICAgaWYgKHN3aXBlci5wYXJhbXMudXJsKSB7XG4gICAgICBsb2NhdGlvbiA9IG5ldyBVUkwoc3dpcGVyLnBhcmFtcy51cmwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsb2NhdGlvbiA9IHdpbmRvdy5sb2NhdGlvbjtcbiAgICB9XG4gICAgY29uc3Qgc2xpZGUgPSBzd2lwZXIuc2xpZGVzW2luZGV4XTtcbiAgICBsZXQgdmFsdWUgPSBzbHVnaWZ5KHNsaWRlLmdldEF0dHJpYnV0ZSgnZGF0YS1oaXN0b3J5JykpO1xuICAgIGlmIChzd2lwZXIucGFyYW1zLmhpc3Rvcnkucm9vdC5sZW5ndGggPiAwKSB7XG4gICAgICBsZXQgcm9vdCA9IHN3aXBlci5wYXJhbXMuaGlzdG9yeS5yb290O1xuICAgICAgaWYgKHJvb3Rbcm9vdC5sZW5ndGggLSAxXSA9PT0gJy8nKSByb290ID0gcm9vdC5zbGljZSgwLCByb290Lmxlbmd0aCAtIDEpO1xuICAgICAgdmFsdWUgPSBgJHtyb290fS8ke2tleSA/IGAke2tleX0vYCA6ICcnfSR7dmFsdWV9YDtcbiAgICB9IGVsc2UgaWYgKCFsb2NhdGlvbi5wYXRobmFtZS5pbmNsdWRlcyhrZXkpKSB7XG4gICAgICB2YWx1ZSA9IGAke2tleSA/IGAke2tleX0vYCA6ICcnfSR7dmFsdWV9YDtcbiAgICB9XG4gICAgaWYgKHN3aXBlci5wYXJhbXMuaGlzdG9yeS5rZWVwUXVlcnkpIHtcbiAgICAgIHZhbHVlICs9IGxvY2F0aW9uLnNlYXJjaDtcbiAgICB9XG4gICAgY29uc3QgY3VycmVudFN0YXRlID0gd2luZG93Lmhpc3Rvcnkuc3RhdGU7XG4gICAgaWYgKGN1cnJlbnRTdGF0ZSAmJiBjdXJyZW50U3RhdGUudmFsdWUgPT09IHZhbHVlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChzd2lwZXIucGFyYW1zLmhpc3RvcnkucmVwbGFjZVN0YXRlKSB7XG4gICAgICB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUoe1xuICAgICAgICB2YWx1ZVxuICAgICAgfSwgbnVsbCwgdmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoe1xuICAgICAgICB2YWx1ZVxuICAgICAgfSwgbnVsbCwgdmFsdWUpO1xuICAgIH1cbiAgfTtcbiAgY29uc3Qgc2Nyb2xsVG9TbGlkZSA9IChzcGVlZCwgdmFsdWUsIHJ1bkNhbGxiYWNrcykgPT4ge1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbmd0aCA9IHN3aXBlci5zbGlkZXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY29uc3Qgc2xpZGUgPSBzd2lwZXIuc2xpZGVzW2ldO1xuICAgICAgICBjb25zdCBzbGlkZUhpc3RvcnkgPSBzbHVnaWZ5KHNsaWRlLmdldEF0dHJpYnV0ZSgnZGF0YS1oaXN0b3J5JykpO1xuICAgICAgICBpZiAoc2xpZGVIaXN0b3J5ID09PSB2YWx1ZSkge1xuICAgICAgICAgIGNvbnN0IGluZGV4ID0gc3dpcGVyLmdldFNsaWRlSW5kZXgoc2xpZGUpO1xuICAgICAgICAgIHN3aXBlci5zbGlkZVRvKGluZGV4LCBzcGVlZCwgcnVuQ2FsbGJhY2tzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzd2lwZXIuc2xpZGVUbygwLCBzcGVlZCwgcnVuQ2FsbGJhY2tzKTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IHNldEhpc3RvcnlQb3BTdGF0ZSA9ICgpID0+IHtcbiAgICBwYXRocyA9IGdldFBhdGhWYWx1ZXMoc3dpcGVyLnBhcmFtcy51cmwpO1xuICAgIHNjcm9sbFRvU2xpZGUoc3dpcGVyLnBhcmFtcy5zcGVlZCwgcGF0aHMudmFsdWUsIGZhbHNlKTtcbiAgfTtcbiAgY29uc3QgaW5pdCA9ICgpID0+IHtcbiAgICBjb25zdCB3aW5kb3cgPSBnZXRXaW5kb3coKTtcbiAgICBpZiAoIXN3aXBlci5wYXJhbXMuaGlzdG9yeSkgcmV0dXJuO1xuICAgIGlmICghd2luZG93Lmhpc3RvcnkgfHwgIXdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSkge1xuICAgICAgc3dpcGVyLnBhcmFtcy5oaXN0b3J5LmVuYWJsZWQgPSBmYWxzZTtcbiAgICAgIHN3aXBlci5wYXJhbXMuaGFzaE5hdmlnYXRpb24uZW5hYmxlZCA9IHRydWU7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICBwYXRocyA9IGdldFBhdGhWYWx1ZXMoc3dpcGVyLnBhcmFtcy51cmwpO1xuICAgIGlmICghcGF0aHMua2V5ICYmICFwYXRocy52YWx1ZSkge1xuICAgICAgaWYgKCFzd2lwZXIucGFyYW1zLmhpc3RvcnkucmVwbGFjZVN0YXRlKSB7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIHNldEhpc3RvcnlQb3BTdGF0ZSk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHNjcm9sbFRvU2xpZGUoMCwgcGF0aHMudmFsdWUsIHN3aXBlci5wYXJhbXMucnVuQ2FsbGJhY2tzT25Jbml0KTtcbiAgICBpZiAoIXN3aXBlci5wYXJhbXMuaGlzdG9yeS5yZXBsYWNlU3RhdGUpIHtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIHNldEhpc3RvcnlQb3BTdGF0ZSk7XG4gICAgfVxuICB9O1xuICBjb25zdCBkZXN0cm95ID0gKCkgPT4ge1xuICAgIGNvbnN0IHdpbmRvdyA9IGdldFdpbmRvdygpO1xuICAgIGlmICghc3dpcGVyLnBhcmFtcy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSkge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgc2V0SGlzdG9yeVBvcFN0YXRlKTtcbiAgICB9XG4gIH07XG4gIG9uKCdpbml0JywgKCkgPT4ge1xuICAgIGlmIChzd2lwZXIucGFyYW1zLmhpc3RvcnkuZW5hYmxlZCkge1xuICAgICAgaW5pdCgpO1xuICAgIH1cbiAgfSk7XG4gIG9uKCdkZXN0cm95JywgKCkgPT4ge1xuICAgIGlmIChzd2lwZXIucGFyYW1zLmhpc3RvcnkuZW5hYmxlZCkge1xuICAgICAgZGVzdHJveSgpO1xuICAgIH1cbiAgfSk7XG4gIG9uKCd0cmFuc2l0aW9uRW5kIF9mcmVlTW9kZU5vTW9tZW50dW1SZWxlYXNlJywgKCkgPT4ge1xuICAgIGlmIChpbml0aWFsaXplZCkge1xuICAgICAgc2V0SGlzdG9yeShzd2lwZXIucGFyYW1zLmhpc3Rvcnkua2V5LCBzd2lwZXIuYWN0aXZlSW5kZXgpO1xuICAgIH1cbiAgfSk7XG4gIG9uKCdzbGlkZUNoYW5nZScsICgpID0+IHtcbiAgICBpZiAoaW5pdGlhbGl6ZWQgJiYgc3dpcGVyLnBhcmFtcy5jc3NNb2RlKSB7XG4gICAgICBzZXRIaXN0b3J5KHN3aXBlci5wYXJhbXMuaGlzdG9yeS5rZXksIHN3aXBlci5hY3RpdmVJbmRleCk7XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0IHsgSGlzdG9yeSBhcyBkZWZhdWx0IH07XG4iLCJpbXBvcnQgeyBnIGFzIGdldERvY3VtZW50LCBhIGFzIGdldFdpbmRvdyB9IGZyb20gJy4uL3NoYXJlZC9zc3Itd2luZG93LmVzbS5tanMnO1xuaW1wb3J0IHsgZSBhcyBlbGVtZW50Q2hpbGRyZW4gfSBmcm9tICcuLi9zaGFyZWQvdXRpbHMubWpzJztcblxuZnVuY3Rpb24gSGFzaE5hdmlnYXRpb24oX3JlZikge1xuICBsZXQge1xuICAgIHN3aXBlcixcbiAgICBleHRlbmRQYXJhbXMsXG4gICAgZW1pdCxcbiAgICBvblxuICB9ID0gX3JlZjtcbiAgbGV0IGluaXRpYWxpemVkID0gZmFsc2U7XG4gIGNvbnN0IGRvY3VtZW50ID0gZ2V0RG9jdW1lbnQoKTtcbiAgY29uc3Qgd2luZG93ID0gZ2V0V2luZG93KCk7XG4gIGV4dGVuZFBhcmFtcyh7XG4gICAgaGFzaE5hdmlnYXRpb246IHtcbiAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgcmVwbGFjZVN0YXRlOiBmYWxzZSxcbiAgICAgIHdhdGNoU3RhdGU6IGZhbHNlLFxuICAgICAgZ2V0U2xpZGVJbmRleChfcywgaGFzaCkge1xuICAgICAgICBpZiAoc3dpcGVyLnZpcnR1YWwgJiYgc3dpcGVyLnBhcmFtcy52aXJ0dWFsLmVuYWJsZWQpIHtcbiAgICAgICAgICBjb25zdCBzbGlkZVdpdGhIYXNoID0gc3dpcGVyLnNsaWRlcy5maWx0ZXIoc2xpZGVFbCA9PiBzbGlkZUVsLmdldEF0dHJpYnV0ZSgnZGF0YS1oYXNoJykgPT09IGhhc2gpWzBdO1xuICAgICAgICAgIGlmICghc2xpZGVXaXRoSGFzaCkgcmV0dXJuIDA7XG4gICAgICAgICAgY29uc3QgaW5kZXggPSBwYXJzZUludChzbGlkZVdpdGhIYXNoLmdldEF0dHJpYnV0ZSgnZGF0YS1zd2lwZXItc2xpZGUtaW5kZXgnKSwgMTApO1xuICAgICAgICAgIHJldHVybiBpbmRleDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3dpcGVyLmdldFNsaWRlSW5kZXgoZWxlbWVudENoaWxkcmVuKHN3aXBlci5zbGlkZXNFbCwgYC4ke3N3aXBlci5wYXJhbXMuc2xpZGVDbGFzc31bZGF0YS1oYXNoPVwiJHtoYXNofVwiXSwgc3dpcGVyLXNsaWRlW2RhdGEtaGFzaD1cIiR7aGFzaH1cIl1gKVswXSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgY29uc3Qgb25IYXNoQ2hhbmdlID0gKCkgPT4ge1xuICAgIGVtaXQoJ2hhc2hDaGFuZ2UnKTtcbiAgICBjb25zdCBuZXdIYXNoID0gZG9jdW1lbnQubG9jYXRpb24uaGFzaC5yZXBsYWNlKCcjJywgJycpO1xuICAgIGNvbnN0IGFjdGl2ZVNsaWRlRWwgPSBzd2lwZXIudmlydHVhbCAmJiBzd2lwZXIucGFyYW1zLnZpcnR1YWwuZW5hYmxlZCA/IHN3aXBlci5zbGlkZXNFbC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1zd2lwZXItc2xpZGUtaW5kZXg9XCIke3N3aXBlci5hY3RpdmVJbmRleH1cIl1gKSA6IHN3aXBlci5zbGlkZXNbc3dpcGVyLmFjdGl2ZUluZGV4XTtcbiAgICBjb25zdCBhY3RpdmVTbGlkZUhhc2ggPSBhY3RpdmVTbGlkZUVsID8gYWN0aXZlU2xpZGVFbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaGFzaCcpIDogJyc7XG4gICAgaWYgKG5ld0hhc2ggIT09IGFjdGl2ZVNsaWRlSGFzaCkge1xuICAgICAgY29uc3QgbmV3SW5kZXggPSBzd2lwZXIucGFyYW1zLmhhc2hOYXZpZ2F0aW9uLmdldFNsaWRlSW5kZXgoc3dpcGVyLCBuZXdIYXNoKTtcbiAgICAgIGlmICh0eXBlb2YgbmV3SW5kZXggPT09ICd1bmRlZmluZWQnIHx8IE51bWJlci5pc05hTihuZXdJbmRleCkpIHJldHVybjtcbiAgICAgIHN3aXBlci5zbGlkZVRvKG5ld0luZGV4KTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IHNldEhhc2ggPSAoKSA9PiB7XG4gICAgaWYgKCFpbml0aWFsaXplZCB8fCAhc3dpcGVyLnBhcmFtcy5oYXNoTmF2aWdhdGlvbi5lbmFibGVkKSByZXR1cm47XG4gICAgY29uc3QgYWN0aXZlU2xpZGVFbCA9IHN3aXBlci52aXJ0dWFsICYmIHN3aXBlci5wYXJhbXMudmlydHVhbC5lbmFibGVkID8gc3dpcGVyLnNsaWRlc0VsLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXN3aXBlci1zbGlkZS1pbmRleD1cIiR7c3dpcGVyLmFjdGl2ZUluZGV4fVwiXWApIDogc3dpcGVyLnNsaWRlc1tzd2lwZXIuYWN0aXZlSW5kZXhdO1xuICAgIGNvbnN0IGFjdGl2ZVNsaWRlSGFzaCA9IGFjdGl2ZVNsaWRlRWwgPyBhY3RpdmVTbGlkZUVsLmdldEF0dHJpYnV0ZSgnZGF0YS1oYXNoJykgfHwgYWN0aXZlU2xpZGVFbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaGlzdG9yeScpIDogJyc7XG4gICAgaWYgKHN3aXBlci5wYXJhbXMuaGFzaE5hdmlnYXRpb24ucmVwbGFjZVN0YXRlICYmIHdpbmRvdy5oaXN0b3J5ICYmIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSkge1xuICAgICAgd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKG51bGwsIG51bGwsIGAjJHthY3RpdmVTbGlkZUhhc2h9YCB8fCAnJyk7XG4gICAgICBlbWl0KCdoYXNoU2V0Jyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvY3VtZW50LmxvY2F0aW9uLmhhc2ggPSBhY3RpdmVTbGlkZUhhc2ggfHwgJyc7XG4gICAgICBlbWl0KCdoYXNoU2V0Jyk7XG4gICAgfVxuICB9O1xuICBjb25zdCBpbml0ID0gKCkgPT4ge1xuICAgIGlmICghc3dpcGVyLnBhcmFtcy5oYXNoTmF2aWdhdGlvbi5lbmFibGVkIHx8IHN3aXBlci5wYXJhbXMuaGlzdG9yeSAmJiBzd2lwZXIucGFyYW1zLmhpc3RvcnkuZW5hYmxlZCkgcmV0dXJuO1xuICAgIGluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICBjb25zdCBoYXNoID0gZG9jdW1lbnQubG9jYXRpb24uaGFzaC5yZXBsYWNlKCcjJywgJycpO1xuICAgIGlmIChoYXNoKSB7XG4gICAgICBjb25zdCBzcGVlZCA9IDA7XG4gICAgICBjb25zdCBpbmRleCA9IHN3aXBlci5wYXJhbXMuaGFzaE5hdmlnYXRpb24uZ2V0U2xpZGVJbmRleChzd2lwZXIsIGhhc2gpO1xuICAgICAgc3dpcGVyLnNsaWRlVG8oaW5kZXggfHwgMCwgc3BlZWQsIHN3aXBlci5wYXJhbXMucnVuQ2FsbGJhY2tzT25Jbml0LCB0cnVlKTtcbiAgICB9XG4gICAgaWYgKHN3aXBlci5wYXJhbXMuaGFzaE5hdmlnYXRpb24ud2F0Y2hTdGF0ZSkge1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2hhc2hjaGFuZ2UnLCBvbkhhc2hDaGFuZ2UpO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgZGVzdHJveSA9ICgpID0+IHtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5oYXNoTmF2aWdhdGlvbi53YXRjaFN0YXRlKSB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsIG9uSGFzaENoYW5nZSk7XG4gICAgfVxuICB9O1xuICBvbignaW5pdCcsICgpID0+IHtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5oYXNoTmF2aWdhdGlvbi5lbmFibGVkKSB7XG4gICAgICBpbml0KCk7XG4gICAgfVxuICB9KTtcbiAgb24oJ2Rlc3Ryb3knLCAoKSA9PiB7XG4gICAgaWYgKHN3aXBlci5wYXJhbXMuaGFzaE5hdmlnYXRpb24uZW5hYmxlZCkge1xuICAgICAgZGVzdHJveSgpO1xuICAgIH1cbiAgfSk7XG4gIG9uKCd0cmFuc2l0aW9uRW5kIF9mcmVlTW9kZU5vTW9tZW50dW1SZWxlYXNlJywgKCkgPT4ge1xuICAgIGlmIChpbml0aWFsaXplZCkge1xuICAgICAgc2V0SGFzaCgpO1xuICAgIH1cbiAgfSk7XG4gIG9uKCdzbGlkZUNoYW5nZScsICgpID0+IHtcbiAgICBpZiAoaW5pdGlhbGl6ZWQgJiYgc3dpcGVyLnBhcmFtcy5jc3NNb2RlKSB7XG4gICAgICBzZXRIYXNoKCk7XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0IHsgSGFzaE5hdmlnYXRpb24gYXMgZGVmYXVsdCB9O1xuIiwiaW1wb3J0IHsgZyBhcyBnZXREb2N1bWVudCB9IGZyb20gJy4uL3NoYXJlZC9zc3Itd2luZG93LmVzbS5tanMnO1xuXG4vKiBlc2xpbnQgbm8tdW5kZXJzY29yZS1kYW5nbGU6IFwib2ZmXCIgKi9cbi8qIGVzbGludCBuby11c2UtYmVmb3JlLWRlZmluZTogXCJvZmZcIiAqL1xuZnVuY3Rpb24gQXV0b3BsYXkoX3JlZikge1xuICBsZXQge1xuICAgIHN3aXBlcixcbiAgICBleHRlbmRQYXJhbXMsXG4gICAgb24sXG4gICAgZW1pdCxcbiAgICBwYXJhbXNcbiAgfSA9IF9yZWY7XG4gIHN3aXBlci5hdXRvcGxheSA9IHtcbiAgICBydW5uaW5nOiBmYWxzZSxcbiAgICBwYXVzZWQ6IGZhbHNlLFxuICAgIHRpbWVMZWZ0OiAwXG4gIH07XG4gIGV4dGVuZFBhcmFtcyh7XG4gICAgYXV0b3BsYXk6IHtcbiAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgZGVsYXk6IDMwMDAsXG4gICAgICB3YWl0Rm9yVHJhbnNpdGlvbjogdHJ1ZSxcbiAgICAgIGRpc2FibGVPbkludGVyYWN0aW9uOiBmYWxzZSxcbiAgICAgIHN0b3BPbkxhc3RTbGlkZTogZmFsc2UsXG4gICAgICByZXZlcnNlRGlyZWN0aW9uOiBmYWxzZSxcbiAgICAgIHBhdXNlT25Nb3VzZUVudGVyOiBmYWxzZVxuICAgIH1cbiAgfSk7XG4gIGxldCB0aW1lb3V0O1xuICBsZXQgcmFmO1xuICBsZXQgYXV0b3BsYXlEZWxheVRvdGFsID0gcGFyYW1zICYmIHBhcmFtcy5hdXRvcGxheSA/IHBhcmFtcy5hdXRvcGxheS5kZWxheSA6IDMwMDA7XG4gIGxldCBhdXRvcGxheURlbGF5Q3VycmVudCA9IHBhcmFtcyAmJiBwYXJhbXMuYXV0b3BsYXkgPyBwYXJhbXMuYXV0b3BsYXkuZGVsYXkgOiAzMDAwO1xuICBsZXQgYXV0b3BsYXlUaW1lTGVmdDtcbiAgbGV0IGF1dG9wbGF5U3RhcnRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gIGxldCB3YXNQYXVzZWQ7XG4gIGxldCBpc1RvdWNoZWQ7XG4gIGxldCBwYXVzZWRCeVRvdWNoO1xuICBsZXQgdG91Y2hTdGFydFRpbWVvdXQ7XG4gIGxldCBzbGlkZUNoYW5nZWQ7XG4gIGxldCBwYXVzZWRCeUludGVyYWN0aW9uO1xuICBsZXQgcGF1c2VkQnlQb2ludGVyRW50ZXI7XG4gIGZ1bmN0aW9uIG9uVHJhbnNpdGlvbkVuZChlKSB7XG4gICAgaWYgKCFzd2lwZXIgfHwgc3dpcGVyLmRlc3Ryb3llZCB8fCAhc3dpcGVyLndyYXBwZXJFbCkgcmV0dXJuO1xuICAgIGlmIChlLnRhcmdldCAhPT0gc3dpcGVyLndyYXBwZXJFbCkgcmV0dXJuO1xuICAgIHN3aXBlci53cmFwcGVyRWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIG9uVHJhbnNpdGlvbkVuZCk7XG4gICAgaWYgKHBhdXNlZEJ5UG9pbnRlckVudGVyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJlc3VtZSgpO1xuICB9XG4gIGNvbnN0IGNhbGNUaW1lTGVmdCA9ICgpID0+IHtcbiAgICBpZiAoc3dpcGVyLmRlc3Ryb3llZCB8fCAhc3dpcGVyLmF1dG9wbGF5LnJ1bm5pbmcpIHJldHVybjtcbiAgICBpZiAoc3dpcGVyLmF1dG9wbGF5LnBhdXNlZCkge1xuICAgICAgd2FzUGF1c2VkID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHdhc1BhdXNlZCkge1xuICAgICAgYXV0b3BsYXlEZWxheUN1cnJlbnQgPSBhdXRvcGxheVRpbWVMZWZ0O1xuICAgICAgd2FzUGF1c2VkID0gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IHRpbWVMZWZ0ID0gc3dpcGVyLmF1dG9wbGF5LnBhdXNlZCA/IGF1dG9wbGF5VGltZUxlZnQgOiBhdXRvcGxheVN0YXJ0VGltZSArIGF1dG9wbGF5RGVsYXlDdXJyZW50IC0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgc3dpcGVyLmF1dG9wbGF5LnRpbWVMZWZ0ID0gdGltZUxlZnQ7XG4gICAgZW1pdCgnYXV0b3BsYXlUaW1lTGVmdCcsIHRpbWVMZWZ0LCB0aW1lTGVmdCAvIGF1dG9wbGF5RGVsYXlUb3RhbCk7XG4gICAgcmFmID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIGNhbGNUaW1lTGVmdCgpO1xuICAgIH0pO1xuICB9O1xuICBjb25zdCBnZXRTbGlkZURlbGF5ID0gKCkgPT4ge1xuICAgIGxldCBhY3RpdmVTbGlkZUVsO1xuICAgIGlmIChzd2lwZXIudmlydHVhbCAmJiBzd2lwZXIucGFyYW1zLnZpcnR1YWwuZW5hYmxlZCkge1xuICAgICAgYWN0aXZlU2xpZGVFbCA9IHN3aXBlci5zbGlkZXMuZmlsdGVyKHNsaWRlRWwgPT4gc2xpZGVFbC5jbGFzc0xpc3QuY29udGFpbnMoJ3N3aXBlci1zbGlkZS1hY3RpdmUnKSlbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGFjdGl2ZVNsaWRlRWwgPSBzd2lwZXIuc2xpZGVzW3N3aXBlci5hY3RpdmVJbmRleF07XG4gICAgfVxuICAgIGlmICghYWN0aXZlU2xpZGVFbCkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICBjb25zdCBjdXJyZW50U2xpZGVEZWxheSA9IHBhcnNlSW50KGFjdGl2ZVNsaWRlRWwuZ2V0QXR0cmlidXRlKCdkYXRhLXN3aXBlci1hdXRvcGxheScpLCAxMCk7XG4gICAgcmV0dXJuIGN1cnJlbnRTbGlkZURlbGF5O1xuICB9O1xuICBjb25zdCBydW4gPSBkZWxheUZvcmNlID0+IHtcbiAgICBpZiAoc3dpcGVyLmRlc3Ryb3llZCB8fCAhc3dpcGVyLmF1dG9wbGF5LnJ1bm5pbmcpIHJldHVybjtcbiAgICBjYW5jZWxBbmltYXRpb25GcmFtZShyYWYpO1xuICAgIGNhbGNUaW1lTGVmdCgpO1xuICAgIGxldCBkZWxheSA9IHR5cGVvZiBkZWxheUZvcmNlID09PSAndW5kZWZpbmVkJyA/IHN3aXBlci5wYXJhbXMuYXV0b3BsYXkuZGVsYXkgOiBkZWxheUZvcmNlO1xuICAgIGF1dG9wbGF5RGVsYXlUb3RhbCA9IHN3aXBlci5wYXJhbXMuYXV0b3BsYXkuZGVsYXk7XG4gICAgYXV0b3BsYXlEZWxheUN1cnJlbnQgPSBzd2lwZXIucGFyYW1zLmF1dG9wbGF5LmRlbGF5O1xuICAgIGNvbnN0IGN1cnJlbnRTbGlkZURlbGF5ID0gZ2V0U2xpZGVEZWxheSgpO1xuICAgIGlmICghTnVtYmVyLmlzTmFOKGN1cnJlbnRTbGlkZURlbGF5KSAmJiBjdXJyZW50U2xpZGVEZWxheSA+IDAgJiYgdHlwZW9mIGRlbGF5Rm9yY2UgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBkZWxheSA9IGN1cnJlbnRTbGlkZURlbGF5O1xuICAgICAgYXV0b3BsYXlEZWxheVRvdGFsID0gY3VycmVudFNsaWRlRGVsYXk7XG4gICAgICBhdXRvcGxheURlbGF5Q3VycmVudCA9IGN1cnJlbnRTbGlkZURlbGF5O1xuICAgIH1cbiAgICBhdXRvcGxheVRpbWVMZWZ0ID0gZGVsYXk7XG4gICAgY29uc3Qgc3BlZWQgPSBzd2lwZXIucGFyYW1zLnNwZWVkO1xuICAgIGNvbnN0IHByb2NlZWQgPSAoKSA9PiB7XG4gICAgICBpZiAoIXN3aXBlciB8fCBzd2lwZXIuZGVzdHJveWVkKSByZXR1cm47XG4gICAgICBpZiAoc3dpcGVyLnBhcmFtcy5hdXRvcGxheS5yZXZlcnNlRGlyZWN0aW9uKSB7XG4gICAgICAgIGlmICghc3dpcGVyLmlzQmVnaW5uaW5nIHx8IHN3aXBlci5wYXJhbXMubG9vcCB8fCBzd2lwZXIucGFyYW1zLnJld2luZCkge1xuICAgICAgICAgIHN3aXBlci5zbGlkZVByZXYoc3BlZWQsIHRydWUsIHRydWUpO1xuICAgICAgICAgIGVtaXQoJ2F1dG9wbGF5Jyk7XG4gICAgICAgIH0gZWxzZSBpZiAoIXN3aXBlci5wYXJhbXMuYXV0b3BsYXkuc3RvcE9uTGFzdFNsaWRlKSB7XG4gICAgICAgICAgc3dpcGVyLnNsaWRlVG8oc3dpcGVyLnNsaWRlcy5sZW5ndGggLSAxLCBzcGVlZCwgdHJ1ZSwgdHJ1ZSk7XG4gICAgICAgICAgZW1pdCgnYXV0b3BsYXknKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCFzd2lwZXIuaXNFbmQgfHwgc3dpcGVyLnBhcmFtcy5sb29wIHx8IHN3aXBlci5wYXJhbXMucmV3aW5kKSB7XG4gICAgICAgICAgc3dpcGVyLnNsaWRlTmV4dChzcGVlZCwgdHJ1ZSwgdHJ1ZSk7XG4gICAgICAgICAgZW1pdCgnYXV0b3BsYXknKTtcbiAgICAgICAgfSBlbHNlIGlmICghc3dpcGVyLnBhcmFtcy5hdXRvcGxheS5zdG9wT25MYXN0U2xpZGUpIHtcbiAgICAgICAgICBzd2lwZXIuc2xpZGVUbygwLCBzcGVlZCwgdHJ1ZSwgdHJ1ZSk7XG4gICAgICAgICAgZW1pdCgnYXV0b3BsYXknKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHN3aXBlci5wYXJhbXMuY3NzTW9kZSkge1xuICAgICAgICBhdXRvcGxheVN0YXJ0VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgIHJ1bigpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGlmIChkZWxheSA+IDApIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgcHJvY2VlZCgpO1xuICAgICAgfSwgZGVsYXkpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICBwcm9jZWVkKCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICByZXR1cm4gZGVsYXk7XG4gIH07XG4gIGNvbnN0IHN0YXJ0ID0gKCkgPT4ge1xuICAgIGF1dG9wbGF5U3RhcnRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgc3dpcGVyLmF1dG9wbGF5LnJ1bm5pbmcgPSB0cnVlO1xuICAgIHJ1bigpO1xuICAgIGVtaXQoJ2F1dG9wbGF5U3RhcnQnKTtcbiAgfTtcbiAgY29uc3Qgc3RvcCA9ICgpID0+IHtcbiAgICBzd2lwZXIuYXV0b3BsYXkucnVubmluZyA9IGZhbHNlO1xuICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICBjYW5jZWxBbmltYXRpb25GcmFtZShyYWYpO1xuICAgIGVtaXQoJ2F1dG9wbGF5U3RvcCcpO1xuICB9O1xuICBjb25zdCBwYXVzZSA9IChpbnRlcm5hbCwgcmVzZXQpID0+IHtcbiAgICBpZiAoc3dpcGVyLmRlc3Ryb3llZCB8fCAhc3dpcGVyLmF1dG9wbGF5LnJ1bm5pbmcpIHJldHVybjtcbiAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgaWYgKCFpbnRlcm5hbCkge1xuICAgICAgcGF1c2VkQnlJbnRlcmFjdGlvbiA9IHRydWU7XG4gICAgfVxuICAgIGNvbnN0IHByb2NlZWQgPSAoKSA9PiB7XG4gICAgICBlbWl0KCdhdXRvcGxheVBhdXNlJyk7XG4gICAgICBpZiAoc3dpcGVyLnBhcmFtcy5hdXRvcGxheS53YWl0Rm9yVHJhbnNpdGlvbikge1xuICAgICAgICBzd2lwZXIud3JhcHBlckVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCBvblRyYW5zaXRpb25FbmQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdW1lKCk7XG4gICAgICB9XG4gICAgfTtcbiAgICBzd2lwZXIuYXV0b3BsYXkucGF1c2VkID0gdHJ1ZTtcbiAgICBpZiAocmVzZXQpIHtcbiAgICAgIGlmIChzbGlkZUNoYW5nZWQpIHtcbiAgICAgICAgYXV0b3BsYXlUaW1lTGVmdCA9IHN3aXBlci5wYXJhbXMuYXV0b3BsYXkuZGVsYXk7XG4gICAgICB9XG4gICAgICBzbGlkZUNoYW5nZWQgPSBmYWxzZTtcbiAgICAgIHByb2NlZWQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgZGVsYXkgPSBhdXRvcGxheVRpbWVMZWZ0IHx8IHN3aXBlci5wYXJhbXMuYXV0b3BsYXkuZGVsYXk7XG4gICAgYXV0b3BsYXlUaW1lTGVmdCA9IGRlbGF5IC0gKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gYXV0b3BsYXlTdGFydFRpbWUpO1xuICAgIGlmIChzd2lwZXIuaXNFbmQgJiYgYXV0b3BsYXlUaW1lTGVmdCA8IDAgJiYgIXN3aXBlci5wYXJhbXMubG9vcCkgcmV0dXJuO1xuICAgIGlmIChhdXRvcGxheVRpbWVMZWZ0IDwgMCkgYXV0b3BsYXlUaW1lTGVmdCA9IDA7XG4gICAgcHJvY2VlZCgpO1xuICB9O1xuICBjb25zdCByZXN1bWUgPSAoKSA9PiB7XG4gICAgaWYgKHN3aXBlci5pc0VuZCAmJiBhdXRvcGxheVRpbWVMZWZ0IDwgMCAmJiAhc3dpcGVyLnBhcmFtcy5sb29wIHx8IHN3aXBlci5kZXN0cm95ZWQgfHwgIXN3aXBlci5hdXRvcGxheS5ydW5uaW5nKSByZXR1cm47XG4gICAgYXV0b3BsYXlTdGFydFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICBpZiAocGF1c2VkQnlJbnRlcmFjdGlvbikge1xuICAgICAgcGF1c2VkQnlJbnRlcmFjdGlvbiA9IGZhbHNlO1xuICAgICAgcnVuKGF1dG9wbGF5VGltZUxlZnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBydW4oKTtcbiAgICB9XG4gICAgc3dpcGVyLmF1dG9wbGF5LnBhdXNlZCA9IGZhbHNlO1xuICAgIGVtaXQoJ2F1dG9wbGF5UmVzdW1lJyk7XG4gIH07XG4gIGNvbnN0IG9uVmlzaWJpbGl0eUNoYW5nZSA9ICgpID0+IHtcbiAgICBpZiAoc3dpcGVyLmRlc3Ryb3llZCB8fCAhc3dpcGVyLmF1dG9wbGF5LnJ1bm5pbmcpIHJldHVybjtcbiAgICBjb25zdCBkb2N1bWVudCA9IGdldERvY3VtZW50KCk7XG4gICAgaWYgKGRvY3VtZW50LnZpc2liaWxpdHlTdGF0ZSA9PT0gJ2hpZGRlbicpIHtcbiAgICAgIHBhdXNlZEJ5SW50ZXJhY3Rpb24gPSB0cnVlO1xuICAgICAgcGF1c2UodHJ1ZSk7XG4gICAgfVxuICAgIGlmIChkb2N1bWVudC52aXNpYmlsaXR5U3RhdGUgPT09ICd2aXNpYmxlJykge1xuICAgICAgcmVzdW1lKCk7XG4gICAgfVxuICB9O1xuICBjb25zdCBvblBvaW50ZXJFbnRlciA9IGUgPT4ge1xuICAgIGlmIChlLnBvaW50ZXJUeXBlICE9PSAnbW91c2UnKSByZXR1cm47XG4gICAgcGF1c2VkQnlJbnRlcmFjdGlvbiA9IHRydWU7XG4gICAgcGF1c2VkQnlQb2ludGVyRW50ZXIgPSB0cnVlO1xuICAgIGlmIChzd2lwZXIuYW5pbWF0aW5nIHx8IHN3aXBlci5hdXRvcGxheS5wYXVzZWQpIHJldHVybjtcbiAgICBwYXVzZSh0cnVlKTtcbiAgfTtcbiAgY29uc3Qgb25Qb2ludGVyTGVhdmUgPSBlID0+IHtcbiAgICBpZiAoZS5wb2ludGVyVHlwZSAhPT0gJ21vdXNlJykgcmV0dXJuO1xuICAgIHBhdXNlZEJ5UG9pbnRlckVudGVyID0gZmFsc2U7XG4gICAgaWYgKHN3aXBlci5hdXRvcGxheS5wYXVzZWQpIHtcbiAgICAgIHJlc3VtZSgpO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgYXR0YWNoTW91c2VFdmVudHMgPSAoKSA9PiB7XG4gICAgaWYgKHN3aXBlci5wYXJhbXMuYXV0b3BsYXkucGF1c2VPbk1vdXNlRW50ZXIpIHtcbiAgICAgIHN3aXBlci5lbC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVyZW50ZXInLCBvblBvaW50ZXJFbnRlcik7XG4gICAgICBzd2lwZXIuZWwuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcmxlYXZlJywgb25Qb2ludGVyTGVhdmUpO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgZGV0YWNoTW91c2VFdmVudHMgPSAoKSA9PiB7XG4gICAgc3dpcGVyLmVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJlbnRlcicsIG9uUG9pbnRlckVudGVyKTtcbiAgICBzd2lwZXIuZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcmxlYXZlJywgb25Qb2ludGVyTGVhdmUpO1xuICB9O1xuICBjb25zdCBhdHRhY2hEb2N1bWVudEV2ZW50cyA9ICgpID0+IHtcbiAgICBjb25zdCBkb2N1bWVudCA9IGdldERvY3VtZW50KCk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndmlzaWJpbGl0eWNoYW5nZScsIG9uVmlzaWJpbGl0eUNoYW5nZSk7XG4gIH07XG4gIGNvbnN0IGRldGFjaERvY3VtZW50RXZlbnRzID0gKCkgPT4ge1xuICAgIGNvbnN0IGRvY3VtZW50ID0gZ2V0RG9jdW1lbnQoKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd2aXNpYmlsaXR5Y2hhbmdlJywgb25WaXNpYmlsaXR5Q2hhbmdlKTtcbiAgfTtcbiAgb24oJ2luaXQnLCAoKSA9PiB7XG4gICAgaWYgKHN3aXBlci5wYXJhbXMuYXV0b3BsYXkuZW5hYmxlZCkge1xuICAgICAgYXR0YWNoTW91c2VFdmVudHMoKTtcbiAgICAgIGF0dGFjaERvY3VtZW50RXZlbnRzKCk7XG4gICAgICBzdGFydCgpO1xuICAgIH1cbiAgfSk7XG4gIG9uKCdkZXN0cm95JywgKCkgPT4ge1xuICAgIGRldGFjaE1vdXNlRXZlbnRzKCk7XG4gICAgZGV0YWNoRG9jdW1lbnRFdmVudHMoKTtcbiAgICBpZiAoc3dpcGVyLmF1dG9wbGF5LnJ1bm5pbmcpIHtcbiAgICAgIHN0b3AoKTtcbiAgICB9XG4gIH0pO1xuICBvbignX2ZyZWVNb2RlU3RhdGljUmVsZWFzZScsICgpID0+IHtcbiAgICBpZiAocGF1c2VkQnlUb3VjaCB8fCBwYXVzZWRCeUludGVyYWN0aW9uKSB7XG4gICAgICByZXN1bWUoKTtcbiAgICB9XG4gIH0pO1xuICBvbignX2ZyZWVNb2RlTm9Nb21lbnR1bVJlbGVhc2UnLCAoKSA9PiB7XG4gICAgaWYgKCFzd2lwZXIucGFyYW1zLmF1dG9wbGF5LmRpc2FibGVPbkludGVyYWN0aW9uKSB7XG4gICAgICBwYXVzZSh0cnVlLCB0cnVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RvcCgpO1xuICAgIH1cbiAgfSk7XG4gIG9uKCdiZWZvcmVUcmFuc2l0aW9uU3RhcnQnLCAoX3MsIHNwZWVkLCBpbnRlcm5hbCkgPT4ge1xuICAgIGlmIChzd2lwZXIuZGVzdHJveWVkIHx8ICFzd2lwZXIuYXV0b3BsYXkucnVubmluZykgcmV0dXJuO1xuICAgIGlmIChpbnRlcm5hbCB8fCAhc3dpcGVyLnBhcmFtcy5hdXRvcGxheS5kaXNhYmxlT25JbnRlcmFjdGlvbikge1xuICAgICAgcGF1c2UodHJ1ZSwgdHJ1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0b3AoKTtcbiAgICB9XG4gIH0pO1xuICBvbignc2xpZGVyRmlyc3RNb3ZlJywgKCkgPT4ge1xuICAgIGlmIChzd2lwZXIuZGVzdHJveWVkIHx8ICFzd2lwZXIuYXV0b3BsYXkucnVubmluZykgcmV0dXJuO1xuICAgIGlmIChzd2lwZXIucGFyYW1zLmF1dG9wbGF5LmRpc2FibGVPbkludGVyYWN0aW9uKSB7XG4gICAgICBzdG9wKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlzVG91Y2hlZCA9IHRydWU7XG4gICAgcGF1c2VkQnlUb3VjaCA9IGZhbHNlO1xuICAgIHBhdXNlZEJ5SW50ZXJhY3Rpb24gPSBmYWxzZTtcbiAgICB0b3VjaFN0YXJ0VGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgcGF1c2VkQnlJbnRlcmFjdGlvbiA9IHRydWU7XG4gICAgICBwYXVzZWRCeVRvdWNoID0gdHJ1ZTtcbiAgICAgIHBhdXNlKHRydWUpO1xuICAgIH0sIDIwMCk7XG4gIH0pO1xuICBvbigndG91Y2hFbmQnLCAoKSA9PiB7XG4gICAgaWYgKHN3aXBlci5kZXN0cm95ZWQgfHwgIXN3aXBlci5hdXRvcGxheS5ydW5uaW5nIHx8ICFpc1RvdWNoZWQpIHJldHVybjtcbiAgICBjbGVhclRpbWVvdXQodG91Y2hTdGFydFRpbWVvdXQpO1xuICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5hdXRvcGxheS5kaXNhYmxlT25JbnRlcmFjdGlvbikge1xuICAgICAgcGF1c2VkQnlUb3VjaCA9IGZhbHNlO1xuICAgICAgaXNUb3VjaGVkID0gZmFsc2U7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChwYXVzZWRCeVRvdWNoICYmIHN3aXBlci5wYXJhbXMuY3NzTW9kZSkgcmVzdW1lKCk7XG4gICAgcGF1c2VkQnlUb3VjaCA9IGZhbHNlO1xuICAgIGlzVG91Y2hlZCA9IGZhbHNlO1xuICB9KTtcbiAgb24oJ3NsaWRlQ2hhbmdlJywgKCkgPT4ge1xuICAgIGlmIChzd2lwZXIuZGVzdHJveWVkIHx8ICFzd2lwZXIuYXV0b3BsYXkucnVubmluZykgcmV0dXJuO1xuICAgIHNsaWRlQ2hhbmdlZCA9IHRydWU7XG4gIH0pO1xuICBPYmplY3QuYXNzaWduKHN3aXBlci5hdXRvcGxheSwge1xuICAgIHN0YXJ0LFxuICAgIHN0b3AsXG4gICAgcGF1c2UsXG4gICAgcmVzdW1lXG4gIH0pO1xufVxuXG5leHBvcnQgeyBBdXRvcGxheSBhcyBkZWZhdWx0IH07XG4iLCJpbXBvcnQgeyBnIGFzIGdldERvY3VtZW50IH0gZnJvbSAnLi4vc2hhcmVkL3Nzci13aW5kb3cuZXNtLm1qcyc7XG5pbXBvcnQgeyBrIGFzIGlzT2JqZWN0LCBlIGFzIGVsZW1lbnRDaGlsZHJlbiB9IGZyb20gJy4uL3NoYXJlZC91dGlscy5tanMnO1xuXG5mdW5jdGlvbiBUaHVtYihfcmVmKSB7XG4gIGxldCB7XG4gICAgc3dpcGVyLFxuICAgIGV4dGVuZFBhcmFtcyxcbiAgICBvblxuICB9ID0gX3JlZjtcbiAgZXh0ZW5kUGFyYW1zKHtcbiAgICB0aHVtYnM6IHtcbiAgICAgIHN3aXBlcjogbnVsbCxcbiAgICAgIG11bHRpcGxlQWN0aXZlVGh1bWJzOiB0cnVlLFxuICAgICAgYXV0b1Njcm9sbE9mZnNldDogMCxcbiAgICAgIHNsaWRlVGh1bWJBY3RpdmVDbGFzczogJ3N3aXBlci1zbGlkZS10aHVtYi1hY3RpdmUnLFxuICAgICAgdGh1bWJzQ29udGFpbmVyQ2xhc3M6ICdzd2lwZXItdGh1bWJzJ1xuICAgIH1cbiAgfSk7XG4gIGxldCBpbml0aWFsaXplZCA9IGZhbHNlO1xuICBsZXQgc3dpcGVyQ3JlYXRlZCA9IGZhbHNlO1xuICBzd2lwZXIudGh1bWJzID0ge1xuICAgIHN3aXBlcjogbnVsbFxuICB9O1xuICBmdW5jdGlvbiBvblRodW1iQ2xpY2soKSB7XG4gICAgY29uc3QgdGh1bWJzU3dpcGVyID0gc3dpcGVyLnRodW1icy5zd2lwZXI7XG4gICAgaWYgKCF0aHVtYnNTd2lwZXIgfHwgdGh1bWJzU3dpcGVyLmRlc3Ryb3llZCkgcmV0dXJuO1xuICAgIGNvbnN0IGNsaWNrZWRJbmRleCA9IHRodW1ic1N3aXBlci5jbGlja2VkSW5kZXg7XG4gICAgY29uc3QgY2xpY2tlZFNsaWRlID0gdGh1bWJzU3dpcGVyLmNsaWNrZWRTbGlkZTtcbiAgICBpZiAoY2xpY2tlZFNsaWRlICYmIGNsaWNrZWRTbGlkZS5jbGFzc0xpc3QuY29udGFpbnMoc3dpcGVyLnBhcmFtcy50aHVtYnMuc2xpZGVUaHVtYkFjdGl2ZUNsYXNzKSkgcmV0dXJuO1xuICAgIGlmICh0eXBlb2YgY2xpY2tlZEluZGV4ID09PSAndW5kZWZpbmVkJyB8fCBjbGlja2VkSW5kZXggPT09IG51bGwpIHJldHVybjtcbiAgICBsZXQgc2xpZGVUb0luZGV4O1xuICAgIGlmICh0aHVtYnNTd2lwZXIucGFyYW1zLmxvb3ApIHtcbiAgICAgIHNsaWRlVG9JbmRleCA9IHBhcnNlSW50KHRodW1ic1N3aXBlci5jbGlja2VkU2xpZGUuZ2V0QXR0cmlidXRlKCdkYXRhLXN3aXBlci1zbGlkZS1pbmRleCcpLCAxMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNsaWRlVG9JbmRleCA9IGNsaWNrZWRJbmRleDtcbiAgICB9XG4gICAgaWYgKHN3aXBlci5wYXJhbXMubG9vcCkge1xuICAgICAgc3dpcGVyLnNsaWRlVG9Mb29wKHNsaWRlVG9JbmRleCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN3aXBlci5zbGlkZVRvKHNsaWRlVG9JbmRleCk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgY29uc3Qge1xuICAgICAgdGh1bWJzOiB0aHVtYnNQYXJhbXNcbiAgICB9ID0gc3dpcGVyLnBhcmFtcztcbiAgICBpZiAoaW5pdGlhbGl6ZWQpIHJldHVybiBmYWxzZTtcbiAgICBpbml0aWFsaXplZCA9IHRydWU7XG4gICAgY29uc3QgU3dpcGVyQ2xhc3MgPSBzd2lwZXIuY29uc3RydWN0b3I7XG4gICAgaWYgKHRodW1ic1BhcmFtcy5zd2lwZXIgaW5zdGFuY2VvZiBTd2lwZXJDbGFzcykge1xuICAgICAgc3dpcGVyLnRodW1icy5zd2lwZXIgPSB0aHVtYnNQYXJhbXMuc3dpcGVyO1xuICAgICAgT2JqZWN0LmFzc2lnbihzd2lwZXIudGh1bWJzLnN3aXBlci5vcmlnaW5hbFBhcmFtcywge1xuICAgICAgICB3YXRjaFNsaWRlc1Byb2dyZXNzOiB0cnVlLFxuICAgICAgICBzbGlkZVRvQ2xpY2tlZFNsaWRlOiBmYWxzZVxuICAgICAgfSk7XG4gICAgICBPYmplY3QuYXNzaWduKHN3aXBlci50aHVtYnMuc3dpcGVyLnBhcmFtcywge1xuICAgICAgICB3YXRjaFNsaWRlc1Byb2dyZXNzOiB0cnVlLFxuICAgICAgICBzbGlkZVRvQ2xpY2tlZFNsaWRlOiBmYWxzZVxuICAgICAgfSk7XG4gICAgICBzd2lwZXIudGh1bWJzLnN3aXBlci51cGRhdGUoKTtcbiAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KHRodW1ic1BhcmFtcy5zd2lwZXIpKSB7XG4gICAgICBjb25zdCB0aHVtYnNTd2lwZXJQYXJhbXMgPSBPYmplY3QuYXNzaWduKHt9LCB0aHVtYnNQYXJhbXMuc3dpcGVyKTtcbiAgICAgIE9iamVjdC5hc3NpZ24odGh1bWJzU3dpcGVyUGFyYW1zLCB7XG4gICAgICAgIHdhdGNoU2xpZGVzUHJvZ3Jlc3M6IHRydWUsXG4gICAgICAgIHNsaWRlVG9DbGlja2VkU2xpZGU6IGZhbHNlXG4gICAgICB9KTtcbiAgICAgIHN3aXBlci50aHVtYnMuc3dpcGVyID0gbmV3IFN3aXBlckNsYXNzKHRodW1ic1N3aXBlclBhcmFtcyk7XG4gICAgICBzd2lwZXJDcmVhdGVkID0gdHJ1ZTtcbiAgICB9XG4gICAgc3dpcGVyLnRodW1icy5zd2lwZXIuZWwuY2xhc3NMaXN0LmFkZChzd2lwZXIucGFyYW1zLnRodW1icy50aHVtYnNDb250YWluZXJDbGFzcyk7XG4gICAgc3dpcGVyLnRodW1icy5zd2lwZXIub24oJ3RhcCcsIG9uVGh1bWJDbGljayk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgZnVuY3Rpb24gdXBkYXRlKGluaXRpYWwpIHtcbiAgICBjb25zdCB0aHVtYnNTd2lwZXIgPSBzd2lwZXIudGh1bWJzLnN3aXBlcjtcbiAgICBpZiAoIXRodW1ic1N3aXBlciB8fCB0aHVtYnNTd2lwZXIuZGVzdHJveWVkKSByZXR1cm47XG4gICAgY29uc3Qgc2xpZGVzUGVyVmlldyA9IHRodW1ic1N3aXBlci5wYXJhbXMuc2xpZGVzUGVyVmlldyA9PT0gJ2F1dG8nID8gdGh1bWJzU3dpcGVyLnNsaWRlc1BlclZpZXdEeW5hbWljKCkgOiB0aHVtYnNTd2lwZXIucGFyYW1zLnNsaWRlc1BlclZpZXc7XG5cbiAgICAvLyBBY3RpdmF0ZSB0aHVtYnNcbiAgICBsZXQgdGh1bWJzVG9BY3RpdmF0ZSA9IDE7XG4gICAgY29uc3QgdGh1bWJBY3RpdmVDbGFzcyA9IHN3aXBlci5wYXJhbXMudGh1bWJzLnNsaWRlVGh1bWJBY3RpdmVDbGFzcztcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5zbGlkZXNQZXJWaWV3ID4gMSAmJiAhc3dpcGVyLnBhcmFtcy5jZW50ZXJlZFNsaWRlcykge1xuICAgICAgdGh1bWJzVG9BY3RpdmF0ZSA9IHN3aXBlci5wYXJhbXMuc2xpZGVzUGVyVmlldztcbiAgICB9XG4gICAgaWYgKCFzd2lwZXIucGFyYW1zLnRodW1icy5tdWx0aXBsZUFjdGl2ZVRodW1icykge1xuICAgICAgdGh1bWJzVG9BY3RpdmF0ZSA9IDE7XG4gICAgfVxuICAgIHRodW1ic1RvQWN0aXZhdGUgPSBNYXRoLmZsb29yKHRodW1ic1RvQWN0aXZhdGUpO1xuICAgIHRodW1ic1N3aXBlci5zbGlkZXMuZm9yRWFjaChzbGlkZUVsID0+IHNsaWRlRWwuY2xhc3NMaXN0LnJlbW92ZSh0aHVtYkFjdGl2ZUNsYXNzKSk7XG4gICAgaWYgKHRodW1ic1N3aXBlci5wYXJhbXMubG9vcCB8fCB0aHVtYnNTd2lwZXIucGFyYW1zLnZpcnR1YWwgJiYgdGh1bWJzU3dpcGVyLnBhcmFtcy52aXJ0dWFsLmVuYWJsZWQpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGh1bWJzVG9BY3RpdmF0ZTsgaSArPSAxKSB7XG4gICAgICAgIGVsZW1lbnRDaGlsZHJlbih0aHVtYnNTd2lwZXIuc2xpZGVzRWwsIGBbZGF0YS1zd2lwZXItc2xpZGUtaW5kZXg9XCIke3N3aXBlci5yZWFsSW5kZXggKyBpfVwiXWApLmZvckVhY2goc2xpZGVFbCA9PiB7XG4gICAgICAgICAgc2xpZGVFbC5jbGFzc0xpc3QuYWRkKHRodW1iQWN0aXZlQ2xhc3MpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aHVtYnNUb0FjdGl2YXRlOyBpICs9IDEpIHtcbiAgICAgICAgaWYgKHRodW1ic1N3aXBlci5zbGlkZXNbc3dpcGVyLnJlYWxJbmRleCArIGldKSB7XG4gICAgICAgICAgdGh1bWJzU3dpcGVyLnNsaWRlc1tzd2lwZXIucmVhbEluZGV4ICsgaV0uY2xhc3NMaXN0LmFkZCh0aHVtYkFjdGl2ZUNsYXNzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBhdXRvU2Nyb2xsT2Zmc2V0ID0gc3dpcGVyLnBhcmFtcy50aHVtYnMuYXV0b1Njcm9sbE9mZnNldDtcbiAgICBjb25zdCB1c2VPZmZzZXQgPSBhdXRvU2Nyb2xsT2Zmc2V0ICYmICF0aHVtYnNTd2lwZXIucGFyYW1zLmxvb3A7XG4gICAgaWYgKHN3aXBlci5yZWFsSW5kZXggIT09IHRodW1ic1N3aXBlci5yZWFsSW5kZXggfHwgdXNlT2Zmc2V0KSB7XG4gICAgICBjb25zdCBjdXJyZW50VGh1bWJzSW5kZXggPSB0aHVtYnNTd2lwZXIuYWN0aXZlSW5kZXg7XG4gICAgICBsZXQgbmV3VGh1bWJzSW5kZXg7XG4gICAgICBsZXQgZGlyZWN0aW9uO1xuICAgICAgaWYgKHRodW1ic1N3aXBlci5wYXJhbXMubG9vcCkge1xuICAgICAgICBjb25zdCBuZXdUaHVtYnNTbGlkZSA9IHRodW1ic1N3aXBlci5zbGlkZXMuZmlsdGVyKHNsaWRlRWwgPT4gc2xpZGVFbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3dpcGVyLXNsaWRlLWluZGV4JykgPT09IGAke3N3aXBlci5yZWFsSW5kZXh9YClbMF07XG4gICAgICAgIG5ld1RodW1ic0luZGV4ID0gdGh1bWJzU3dpcGVyLnNsaWRlcy5pbmRleE9mKG5ld1RodW1ic1NsaWRlKTtcbiAgICAgICAgZGlyZWN0aW9uID0gc3dpcGVyLmFjdGl2ZUluZGV4ID4gc3dpcGVyLnByZXZpb3VzSW5kZXggPyAnbmV4dCcgOiAncHJldic7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdUaHVtYnNJbmRleCA9IHN3aXBlci5yZWFsSW5kZXg7XG4gICAgICAgIGRpcmVjdGlvbiA9IG5ld1RodW1ic0luZGV4ID4gc3dpcGVyLnByZXZpb3VzSW5kZXggPyAnbmV4dCcgOiAncHJldic7XG4gICAgICB9XG4gICAgICBpZiAodXNlT2Zmc2V0KSB7XG4gICAgICAgIG5ld1RodW1ic0luZGV4ICs9IGRpcmVjdGlvbiA9PT0gJ25leHQnID8gYXV0b1Njcm9sbE9mZnNldCA6IC0xICogYXV0b1Njcm9sbE9mZnNldDtcbiAgICAgIH1cbiAgICAgIGlmICh0aHVtYnNTd2lwZXIudmlzaWJsZVNsaWRlc0luZGV4ZXMgJiYgdGh1bWJzU3dpcGVyLnZpc2libGVTbGlkZXNJbmRleGVzLmluZGV4T2YobmV3VGh1bWJzSW5kZXgpIDwgMCkge1xuICAgICAgICBpZiAodGh1bWJzU3dpcGVyLnBhcmFtcy5jZW50ZXJlZFNsaWRlcykge1xuICAgICAgICAgIGlmIChuZXdUaHVtYnNJbmRleCA+IGN1cnJlbnRUaHVtYnNJbmRleCkge1xuICAgICAgICAgICAgbmV3VGh1bWJzSW5kZXggPSBuZXdUaHVtYnNJbmRleCAtIE1hdGguZmxvb3Ioc2xpZGVzUGVyVmlldyAvIDIpICsgMTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3VGh1bWJzSW5kZXggPSBuZXdUaHVtYnNJbmRleCArIE1hdGguZmxvb3Ioc2xpZGVzUGVyVmlldyAvIDIpIC0gMTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAobmV3VGh1bWJzSW5kZXggPiBjdXJyZW50VGh1bWJzSW5kZXggJiYgdGh1bWJzU3dpcGVyLnBhcmFtcy5zbGlkZXNQZXJHcm91cCA9PT0gMSkgO1xuICAgICAgICB0aHVtYnNTd2lwZXIuc2xpZGVUbyhuZXdUaHVtYnNJbmRleCwgaW5pdGlhbCA/IDAgOiB1bmRlZmluZWQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBvbignYmVmb3JlSW5pdCcsICgpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICB0aHVtYnNcbiAgICB9ID0gc3dpcGVyLnBhcmFtcztcbiAgICBpZiAoIXRodW1icyB8fCAhdGh1bWJzLnN3aXBlcikgcmV0dXJuO1xuICAgIGlmICh0eXBlb2YgdGh1bWJzLnN3aXBlciA9PT0gJ3N0cmluZycgfHwgdGh1bWJzLnN3aXBlciBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICBjb25zdCBkb2N1bWVudCA9IGdldERvY3VtZW50KCk7XG4gICAgICBjb25zdCBnZXRUaHVtYnNFbGVtZW50QW5kSW5pdCA9ICgpID0+IHtcbiAgICAgICAgY29uc3QgdGh1bWJzRWxlbWVudCA9IHR5cGVvZiB0aHVtYnMuc3dpcGVyID09PSAnc3RyaW5nJyA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGh1bWJzLnN3aXBlcikgOiB0aHVtYnMuc3dpcGVyO1xuICAgICAgICBpZiAodGh1bWJzRWxlbWVudCAmJiB0aHVtYnNFbGVtZW50LnN3aXBlcikge1xuICAgICAgICAgIHRodW1icy5zd2lwZXIgPSB0aHVtYnNFbGVtZW50LnN3aXBlcjtcbiAgICAgICAgICBpbml0KCk7XG4gICAgICAgICAgdXBkYXRlKHRydWUpO1xuICAgICAgICB9IGVsc2UgaWYgKHRodW1ic0VsZW1lbnQpIHtcbiAgICAgICAgICBjb25zdCBvblRodW1ic1N3aXBlciA9IGUgPT4ge1xuICAgICAgICAgICAgdGh1bWJzLnN3aXBlciA9IGUuZGV0YWlsWzBdO1xuICAgICAgICAgICAgdGh1bWJzRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdpbml0Jywgb25UaHVtYnNTd2lwZXIpO1xuICAgICAgICAgICAgaW5pdCgpO1xuICAgICAgICAgICAgdXBkYXRlKHRydWUpO1xuICAgICAgICAgICAgdGh1bWJzLnN3aXBlci51cGRhdGUoKTtcbiAgICAgICAgICAgIHN3aXBlci51cGRhdGUoKTtcbiAgICAgICAgICB9O1xuICAgICAgICAgIHRodW1ic0VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignaW5pdCcsIG9uVGh1bWJzU3dpcGVyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGh1bWJzRWxlbWVudDtcbiAgICAgIH07XG4gICAgICBjb25zdCB3YXRjaEZvclRodW1ic1RvQXBwZWFyID0gKCkgPT4ge1xuICAgICAgICBpZiAoc3dpcGVyLmRlc3Ryb3llZCkgcmV0dXJuO1xuICAgICAgICBjb25zdCB0aHVtYnNFbGVtZW50ID0gZ2V0VGh1bWJzRWxlbWVudEFuZEluaXQoKTtcbiAgICAgICAgaWYgKCF0aHVtYnNFbGVtZW50KSB7XG4gICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHdhdGNoRm9yVGh1bWJzVG9BcHBlYXIpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHdhdGNoRm9yVGh1bWJzVG9BcHBlYXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpbml0KCk7XG4gICAgICB1cGRhdGUodHJ1ZSk7XG4gICAgfVxuICB9KTtcbiAgb24oJ3NsaWRlQ2hhbmdlIHVwZGF0ZSByZXNpemUgb2JzZXJ2ZXJVcGRhdGUnLCAoKSA9PiB7XG4gICAgdXBkYXRlKCk7XG4gIH0pO1xuICBvbignc2V0VHJhbnNpdGlvbicsIChfcywgZHVyYXRpb24pID0+IHtcbiAgICBjb25zdCB0aHVtYnNTd2lwZXIgPSBzd2lwZXIudGh1bWJzLnN3aXBlcjtcbiAgICBpZiAoIXRodW1ic1N3aXBlciB8fCB0aHVtYnNTd2lwZXIuZGVzdHJveWVkKSByZXR1cm47XG4gICAgdGh1bWJzU3dpcGVyLnNldFRyYW5zaXRpb24oZHVyYXRpb24pO1xuICB9KTtcbiAgb24oJ2JlZm9yZURlc3Ryb3knLCAoKSA9PiB7XG4gICAgY29uc3QgdGh1bWJzU3dpcGVyID0gc3dpcGVyLnRodW1icy5zd2lwZXI7XG4gICAgaWYgKCF0aHVtYnNTd2lwZXIgfHwgdGh1bWJzU3dpcGVyLmRlc3Ryb3llZCkgcmV0dXJuO1xuICAgIGlmIChzd2lwZXJDcmVhdGVkKSB7XG4gICAgICB0aHVtYnNTd2lwZXIuZGVzdHJveSgpO1xuICAgIH1cbiAgfSk7XG4gIE9iamVjdC5hc3NpZ24oc3dpcGVyLnRodW1icywge1xuICAgIGluaXQsXG4gICAgdXBkYXRlXG4gIH0pO1xufVxuXG5leHBvcnQgeyBUaHVtYiBhcyBkZWZhdWx0IH07XG4iLCJpbXBvcnQgeyBkIGFzIG5vdywgaiBhcyBlbGVtZW50VHJhbnNpdGlvbkVuZCB9IGZyb20gJy4uL3NoYXJlZC91dGlscy5tanMnO1xuXG5mdW5jdGlvbiBmcmVlTW9kZShfcmVmKSB7XG4gIGxldCB7XG4gICAgc3dpcGVyLFxuICAgIGV4dGVuZFBhcmFtcyxcbiAgICBlbWl0LFxuICAgIG9uY2VcbiAgfSA9IF9yZWY7XG4gIGV4dGVuZFBhcmFtcyh7XG4gICAgZnJlZU1vZGU6IHtcbiAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgbW9tZW50dW06IHRydWUsXG4gICAgICBtb21lbnR1bVJhdGlvOiAxLFxuICAgICAgbW9tZW50dW1Cb3VuY2U6IHRydWUsXG4gICAgICBtb21lbnR1bUJvdW5jZVJhdGlvOiAxLFxuICAgICAgbW9tZW50dW1WZWxvY2l0eVJhdGlvOiAxLFxuICAgICAgc3RpY2t5OiBmYWxzZSxcbiAgICAgIG1pbmltdW1WZWxvY2l0eTogMC4wMlxuICAgIH1cbiAgfSk7XG4gIGZ1bmN0aW9uIG9uVG91Y2hTdGFydCgpIHtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5jc3NNb2RlKSByZXR1cm47XG4gICAgY29uc3QgdHJhbnNsYXRlID0gc3dpcGVyLmdldFRyYW5zbGF0ZSgpO1xuICAgIHN3aXBlci5zZXRUcmFuc2xhdGUodHJhbnNsYXRlKTtcbiAgICBzd2lwZXIuc2V0VHJhbnNpdGlvbigwKTtcbiAgICBzd2lwZXIudG91Y2hFdmVudHNEYXRhLnZlbG9jaXRpZXMubGVuZ3RoID0gMDtcbiAgICBzd2lwZXIuZnJlZU1vZGUub25Ub3VjaEVuZCh7XG4gICAgICBjdXJyZW50UG9zOiBzd2lwZXIucnRsID8gc3dpcGVyLnRyYW5zbGF0ZSA6IC1zd2lwZXIudHJhbnNsYXRlXG4gICAgfSk7XG4gIH1cbiAgZnVuY3Rpb24gb25Ub3VjaE1vdmUoKSB7XG4gICAgaWYgKHN3aXBlci5wYXJhbXMuY3NzTW9kZSkgcmV0dXJuO1xuICAgIGNvbnN0IHtcbiAgICAgIHRvdWNoRXZlbnRzRGF0YTogZGF0YSxcbiAgICAgIHRvdWNoZXNcbiAgICB9ID0gc3dpcGVyO1xuICAgIC8vIFZlbG9jaXR5XG4gICAgaWYgKGRhdGEudmVsb2NpdGllcy5sZW5ndGggPT09IDApIHtcbiAgICAgIGRhdGEudmVsb2NpdGllcy5wdXNoKHtcbiAgICAgICAgcG9zaXRpb246IHRvdWNoZXNbc3dpcGVyLmlzSG9yaXpvbnRhbCgpID8gJ3N0YXJ0WCcgOiAnc3RhcnRZJ10sXG4gICAgICAgIHRpbWU6IGRhdGEudG91Y2hTdGFydFRpbWVcbiAgICAgIH0pO1xuICAgIH1cbiAgICBkYXRhLnZlbG9jaXRpZXMucHVzaCh7XG4gICAgICBwb3NpdGlvbjogdG91Y2hlc1tzd2lwZXIuaXNIb3Jpem9udGFsKCkgPyAnY3VycmVudFgnIDogJ2N1cnJlbnRZJ10sXG4gICAgICB0aW1lOiBub3coKVxuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIG9uVG91Y2hFbmQoX3JlZjIpIHtcbiAgICBsZXQge1xuICAgICAgY3VycmVudFBvc1xuICAgIH0gPSBfcmVmMjtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5jc3NNb2RlKSByZXR1cm47XG4gICAgY29uc3Qge1xuICAgICAgcGFyYW1zLFxuICAgICAgd3JhcHBlckVsLFxuICAgICAgcnRsVHJhbnNsYXRlOiBydGwsXG4gICAgICBzbmFwR3JpZCxcbiAgICAgIHRvdWNoRXZlbnRzRGF0YTogZGF0YVxuICAgIH0gPSBzd2lwZXI7XG4gICAgLy8gVGltZSBkaWZmXG4gICAgY29uc3QgdG91Y2hFbmRUaW1lID0gbm93KCk7XG4gICAgY29uc3QgdGltZURpZmYgPSB0b3VjaEVuZFRpbWUgLSBkYXRhLnRvdWNoU3RhcnRUaW1lO1xuICAgIGlmIChjdXJyZW50UG9zIDwgLXN3aXBlci5taW5UcmFuc2xhdGUoKSkge1xuICAgICAgc3dpcGVyLnNsaWRlVG8oc3dpcGVyLmFjdGl2ZUluZGV4KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGN1cnJlbnRQb3MgPiAtc3dpcGVyLm1heFRyYW5zbGF0ZSgpKSB7XG4gICAgICBpZiAoc3dpcGVyLnNsaWRlcy5sZW5ndGggPCBzbmFwR3JpZC5sZW5ndGgpIHtcbiAgICAgICAgc3dpcGVyLnNsaWRlVG8oc25hcEdyaWQubGVuZ3RoIC0gMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzd2lwZXIuc2xpZGVUbyhzd2lwZXIuc2xpZGVzLmxlbmd0aCAtIDEpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAocGFyYW1zLmZyZWVNb2RlLm1vbWVudHVtKSB7XG4gICAgICBpZiAoZGF0YS52ZWxvY2l0aWVzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgY29uc3QgbGFzdE1vdmVFdmVudCA9IGRhdGEudmVsb2NpdGllcy5wb3AoKTtcbiAgICAgICAgY29uc3QgdmVsb2NpdHlFdmVudCA9IGRhdGEudmVsb2NpdGllcy5wb3AoKTtcbiAgICAgICAgY29uc3QgZGlzdGFuY2UgPSBsYXN0TW92ZUV2ZW50LnBvc2l0aW9uIC0gdmVsb2NpdHlFdmVudC5wb3NpdGlvbjtcbiAgICAgICAgY29uc3QgdGltZSA9IGxhc3RNb3ZlRXZlbnQudGltZSAtIHZlbG9jaXR5RXZlbnQudGltZTtcbiAgICAgICAgc3dpcGVyLnZlbG9jaXR5ID0gZGlzdGFuY2UgLyB0aW1lO1xuICAgICAgICBzd2lwZXIudmVsb2NpdHkgLz0gMjtcbiAgICAgICAgaWYgKE1hdGguYWJzKHN3aXBlci52ZWxvY2l0eSkgPCBwYXJhbXMuZnJlZU1vZGUubWluaW11bVZlbG9jaXR5KSB7XG4gICAgICAgICAgc3dpcGVyLnZlbG9jaXR5ID0gMDtcbiAgICAgICAgfVxuICAgICAgICAvLyB0aGlzIGltcGxpZXMgdGhhdCB0aGUgdXNlciBzdG9wcGVkIG1vdmluZyBhIGZpbmdlciB0aGVuIHJlbGVhc2VkLlxuICAgICAgICAvLyBUaGVyZSB3b3VsZCBiZSBubyBldmVudHMgd2l0aCBkaXN0YW5jZSB6ZXJvLCBzbyB0aGUgbGFzdCBldmVudCBpcyBzdGFsZS5cbiAgICAgICAgaWYgKHRpbWUgPiAxNTAgfHwgbm93KCkgLSBsYXN0TW92ZUV2ZW50LnRpbWUgPiAzMDApIHtcbiAgICAgICAgICBzd2lwZXIudmVsb2NpdHkgPSAwO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzd2lwZXIudmVsb2NpdHkgPSAwO1xuICAgICAgfVxuICAgICAgc3dpcGVyLnZlbG9jaXR5ICo9IHBhcmFtcy5mcmVlTW9kZS5tb21lbnR1bVZlbG9jaXR5UmF0aW87XG4gICAgICBkYXRhLnZlbG9jaXRpZXMubGVuZ3RoID0gMDtcbiAgICAgIGxldCBtb21lbnR1bUR1cmF0aW9uID0gMTAwMCAqIHBhcmFtcy5mcmVlTW9kZS5tb21lbnR1bVJhdGlvO1xuICAgICAgY29uc3QgbW9tZW50dW1EaXN0YW5jZSA9IHN3aXBlci52ZWxvY2l0eSAqIG1vbWVudHVtRHVyYXRpb247XG4gICAgICBsZXQgbmV3UG9zaXRpb24gPSBzd2lwZXIudHJhbnNsYXRlICsgbW9tZW50dW1EaXN0YW5jZTtcbiAgICAgIGlmIChydGwpIG5ld1Bvc2l0aW9uID0gLW5ld1Bvc2l0aW9uO1xuICAgICAgbGV0IGRvQm91bmNlID0gZmFsc2U7XG4gICAgICBsZXQgYWZ0ZXJCb3VuY2VQb3NpdGlvbjtcbiAgICAgIGNvbnN0IGJvdW5jZUFtb3VudCA9IE1hdGguYWJzKHN3aXBlci52ZWxvY2l0eSkgKiAyMCAqIHBhcmFtcy5mcmVlTW9kZS5tb21lbnR1bUJvdW5jZVJhdGlvO1xuICAgICAgbGV0IG5lZWRzTG9vcEZpeDtcbiAgICAgIGlmIChuZXdQb3NpdGlvbiA8IHN3aXBlci5tYXhUcmFuc2xhdGUoKSkge1xuICAgICAgICBpZiAocGFyYW1zLmZyZWVNb2RlLm1vbWVudHVtQm91bmNlKSB7XG4gICAgICAgICAgaWYgKG5ld1Bvc2l0aW9uICsgc3dpcGVyLm1heFRyYW5zbGF0ZSgpIDwgLWJvdW5jZUFtb3VudCkge1xuICAgICAgICAgICAgbmV3UG9zaXRpb24gPSBzd2lwZXIubWF4VHJhbnNsYXRlKCkgLSBib3VuY2VBbW91bnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGFmdGVyQm91bmNlUG9zaXRpb24gPSBzd2lwZXIubWF4VHJhbnNsYXRlKCk7XG4gICAgICAgICAgZG9Cb3VuY2UgPSB0cnVlO1xuICAgICAgICAgIGRhdGEuYWxsb3dNb21lbnR1bUJvdW5jZSA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV3UG9zaXRpb24gPSBzd2lwZXIubWF4VHJhbnNsYXRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhcmFtcy5sb29wICYmIHBhcmFtcy5jZW50ZXJlZFNsaWRlcykgbmVlZHNMb29wRml4ID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAobmV3UG9zaXRpb24gPiBzd2lwZXIubWluVHJhbnNsYXRlKCkpIHtcbiAgICAgICAgaWYgKHBhcmFtcy5mcmVlTW9kZS5tb21lbnR1bUJvdW5jZSkge1xuICAgICAgICAgIGlmIChuZXdQb3NpdGlvbiAtIHN3aXBlci5taW5UcmFuc2xhdGUoKSA+IGJvdW5jZUFtb3VudCkge1xuICAgICAgICAgICAgbmV3UG9zaXRpb24gPSBzd2lwZXIubWluVHJhbnNsYXRlKCkgKyBib3VuY2VBbW91bnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGFmdGVyQm91bmNlUG9zaXRpb24gPSBzd2lwZXIubWluVHJhbnNsYXRlKCk7XG4gICAgICAgICAgZG9Cb3VuY2UgPSB0cnVlO1xuICAgICAgICAgIGRhdGEuYWxsb3dNb21lbnR1bUJvdW5jZSA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV3UG9zaXRpb24gPSBzd2lwZXIubWluVHJhbnNsYXRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhcmFtcy5sb29wICYmIHBhcmFtcy5jZW50ZXJlZFNsaWRlcykgbmVlZHNMb29wRml4ID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAocGFyYW1zLmZyZWVNb2RlLnN0aWNreSkge1xuICAgICAgICBsZXQgbmV4dFNsaWRlO1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNuYXBHcmlkLmxlbmd0aDsgaiArPSAxKSB7XG4gICAgICAgICAgaWYgKHNuYXBHcmlkW2pdID4gLW5ld1Bvc2l0aW9uKSB7XG4gICAgICAgICAgICBuZXh0U2xpZGUgPSBqO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChNYXRoLmFicyhzbmFwR3JpZFtuZXh0U2xpZGVdIC0gbmV3UG9zaXRpb24pIDwgTWF0aC5hYnMoc25hcEdyaWRbbmV4dFNsaWRlIC0gMV0gLSBuZXdQb3NpdGlvbikgfHwgc3dpcGVyLnN3aXBlRGlyZWN0aW9uID09PSAnbmV4dCcpIHtcbiAgICAgICAgICBuZXdQb3NpdGlvbiA9IHNuYXBHcmlkW25leHRTbGlkZV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV3UG9zaXRpb24gPSBzbmFwR3JpZFtuZXh0U2xpZGUgLSAxXTtcbiAgICAgICAgfVxuICAgICAgICBuZXdQb3NpdGlvbiA9IC1uZXdQb3NpdGlvbjtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkc0xvb3BGaXgpIHtcbiAgICAgICAgb25jZSgndHJhbnNpdGlvbkVuZCcsICgpID0+IHtcbiAgICAgICAgICBzd2lwZXIubG9vcEZpeCgpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIC8vIEZpeCBkdXJhdGlvblxuICAgICAgaWYgKHN3aXBlci52ZWxvY2l0eSAhPT0gMCkge1xuICAgICAgICBpZiAocnRsKSB7XG4gICAgICAgICAgbW9tZW50dW1EdXJhdGlvbiA9IE1hdGguYWJzKCgtbmV3UG9zaXRpb24gLSBzd2lwZXIudHJhbnNsYXRlKSAvIHN3aXBlci52ZWxvY2l0eSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbW9tZW50dW1EdXJhdGlvbiA9IE1hdGguYWJzKChuZXdQb3NpdGlvbiAtIHN3aXBlci50cmFuc2xhdGUpIC8gc3dpcGVyLnZlbG9jaXR5KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFyYW1zLmZyZWVNb2RlLnN0aWNreSkge1xuICAgICAgICAgIC8vIElmIGZyZWVNb2RlLnN0aWNreSBpcyBhY3RpdmUgYW5kIHRoZSB1c2VyIGVuZHMgYSBzd2lwZSB3aXRoIGEgc2xvdy12ZWxvY2l0eVxuICAgICAgICAgIC8vIGV2ZW50LCB0aGVuIGR1cmF0aW9ucyBjYW4gYmUgMjArIHNlY29uZHMgdG8gc2xpZGUgb25lIChvciB6ZXJvISkgc2xpZGVzLlxuICAgICAgICAgIC8vIEl0J3MgZWFzeSB0byBzZWUgdGhpcyB3aGVuIHNpbXVsYXRpbmcgdG91Y2ggd2l0aCBtb3VzZSBldmVudHMuIFRvIGZpeCB0aGlzLFxuICAgICAgICAgIC8vIGxpbWl0IHNpbmdsZS1zbGlkZSBzd2lwZXMgdG8gdGhlIGRlZmF1bHQgc2xpZGUgZHVyYXRpb24uIFRoaXMgYWxzbyBoYXMgdGhlXG4gICAgICAgICAgLy8gbmljZSBzaWRlIGVmZmVjdCBvZiBtYXRjaGluZyBzbGlkZSBzcGVlZCBpZiB0aGUgdXNlciBzdG9wcGVkIG1vdmluZyBiZWZvcmVcbiAgICAgICAgICAvLyBsaWZ0aW5nIGZpbmdlciBvciBtb3VzZSB2cy4gbW92aW5nIHNsb3dseSBiZWZvcmUgbGlmdGluZyB0aGUgZmluZ2VyL21vdXNlLlxuICAgICAgICAgIC8vIEZvciBmYXN0ZXIgc3dpcGVzLCBhbHNvIGFwcGx5IGxpbWl0cyAoYWxiZWl0IGhpZ2hlciBvbmVzKS5cbiAgICAgICAgICBjb25zdCBtb3ZlRGlzdGFuY2UgPSBNYXRoLmFicygocnRsID8gLW5ld1Bvc2l0aW9uIDogbmV3UG9zaXRpb24pIC0gc3dpcGVyLnRyYW5zbGF0ZSk7XG4gICAgICAgICAgY29uc3QgY3VycmVudFNsaWRlU2l6ZSA9IHN3aXBlci5zbGlkZXNTaXplc0dyaWRbc3dpcGVyLmFjdGl2ZUluZGV4XTtcbiAgICAgICAgICBpZiAobW92ZURpc3RhbmNlIDwgY3VycmVudFNsaWRlU2l6ZSkge1xuICAgICAgICAgICAgbW9tZW50dW1EdXJhdGlvbiA9IHBhcmFtcy5zcGVlZDtcbiAgICAgICAgICB9IGVsc2UgaWYgKG1vdmVEaXN0YW5jZSA8IDIgKiBjdXJyZW50U2xpZGVTaXplKSB7XG4gICAgICAgICAgICBtb21lbnR1bUR1cmF0aW9uID0gcGFyYW1zLnNwZWVkICogMS41O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtb21lbnR1bUR1cmF0aW9uID0gcGFyYW1zLnNwZWVkICogMi41O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChwYXJhbXMuZnJlZU1vZGUuc3RpY2t5KSB7XG4gICAgICAgIHN3aXBlci5zbGlkZVRvQ2xvc2VzdCgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAocGFyYW1zLmZyZWVNb2RlLm1vbWVudHVtQm91bmNlICYmIGRvQm91bmNlKSB7XG4gICAgICAgIHN3aXBlci51cGRhdGVQcm9ncmVzcyhhZnRlckJvdW5jZVBvc2l0aW9uKTtcbiAgICAgICAgc3dpcGVyLnNldFRyYW5zaXRpb24obW9tZW50dW1EdXJhdGlvbik7XG4gICAgICAgIHN3aXBlci5zZXRUcmFuc2xhdGUobmV3UG9zaXRpb24pO1xuICAgICAgICBzd2lwZXIudHJhbnNpdGlvblN0YXJ0KHRydWUsIHN3aXBlci5zd2lwZURpcmVjdGlvbik7XG4gICAgICAgIHN3aXBlci5hbmltYXRpbmcgPSB0cnVlO1xuICAgICAgICBlbGVtZW50VHJhbnNpdGlvbkVuZCh3cmFwcGVyRWwsICgpID0+IHtcbiAgICAgICAgICBpZiAoIXN3aXBlciB8fCBzd2lwZXIuZGVzdHJveWVkIHx8ICFkYXRhLmFsbG93TW9tZW50dW1Cb3VuY2UpIHJldHVybjtcbiAgICAgICAgICBlbWl0KCdtb21lbnR1bUJvdW5jZScpO1xuICAgICAgICAgIHN3aXBlci5zZXRUcmFuc2l0aW9uKHBhcmFtcy5zcGVlZCk7XG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBzd2lwZXIuc2V0VHJhbnNsYXRlKGFmdGVyQm91bmNlUG9zaXRpb24pO1xuICAgICAgICAgICAgZWxlbWVudFRyYW5zaXRpb25FbmQod3JhcHBlckVsLCAoKSA9PiB7XG4gICAgICAgICAgICAgIGlmICghc3dpcGVyIHx8IHN3aXBlci5kZXN0cm95ZWQpIHJldHVybjtcbiAgICAgICAgICAgICAgc3dpcGVyLnRyYW5zaXRpb25FbmQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0sIDApO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAoc3dpcGVyLnZlbG9jaXR5KSB7XG4gICAgICAgIGVtaXQoJ19mcmVlTW9kZU5vTW9tZW50dW1SZWxlYXNlJyk7XG4gICAgICAgIHN3aXBlci51cGRhdGVQcm9ncmVzcyhuZXdQb3NpdGlvbik7XG4gICAgICAgIHN3aXBlci5zZXRUcmFuc2l0aW9uKG1vbWVudHVtRHVyYXRpb24pO1xuICAgICAgICBzd2lwZXIuc2V0VHJhbnNsYXRlKG5ld1Bvc2l0aW9uKTtcbiAgICAgICAgc3dpcGVyLnRyYW5zaXRpb25TdGFydCh0cnVlLCBzd2lwZXIuc3dpcGVEaXJlY3Rpb24pO1xuICAgICAgICBpZiAoIXN3aXBlci5hbmltYXRpbmcpIHtcbiAgICAgICAgICBzd2lwZXIuYW5pbWF0aW5nID0gdHJ1ZTtcbiAgICAgICAgICBlbGVtZW50VHJhbnNpdGlvbkVuZCh3cmFwcGVyRWwsICgpID0+IHtcbiAgICAgICAgICAgIGlmICghc3dpcGVyIHx8IHN3aXBlci5kZXN0cm95ZWQpIHJldHVybjtcbiAgICAgICAgICAgIHN3aXBlci50cmFuc2l0aW9uRW5kKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN3aXBlci51cGRhdGVQcm9ncmVzcyhuZXdQb3NpdGlvbik7XG4gICAgICB9XG4gICAgICBzd2lwZXIudXBkYXRlQWN0aXZlSW5kZXgoKTtcbiAgICAgIHN3aXBlci51cGRhdGVTbGlkZXNDbGFzc2VzKCk7XG4gICAgfSBlbHNlIGlmIChwYXJhbXMuZnJlZU1vZGUuc3RpY2t5KSB7XG4gICAgICBzd2lwZXIuc2xpZGVUb0Nsb3Nlc3QoKTtcbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2UgaWYgKHBhcmFtcy5mcmVlTW9kZSkge1xuICAgICAgZW1pdCgnX2ZyZWVNb2RlTm9Nb21lbnR1bVJlbGVhc2UnKTtcbiAgICB9XG4gICAgaWYgKCFwYXJhbXMuZnJlZU1vZGUubW9tZW50dW0gfHwgdGltZURpZmYgPj0gcGFyYW1zLmxvbmdTd2lwZXNNcykge1xuICAgICAgZW1pdCgnX2ZyZWVNb2RlU3RhdGljUmVsZWFzZScpO1xuICAgICAgc3dpcGVyLnVwZGF0ZVByb2dyZXNzKCk7XG4gICAgICBzd2lwZXIudXBkYXRlQWN0aXZlSW5kZXgoKTtcbiAgICAgIHN3aXBlci51cGRhdGVTbGlkZXNDbGFzc2VzKCk7XG4gICAgfVxuICB9XG4gIE9iamVjdC5hc3NpZ24oc3dpcGVyLCB7XG4gICAgZnJlZU1vZGU6IHtcbiAgICAgIG9uVG91Y2hTdGFydCxcbiAgICAgIG9uVG91Y2hNb3ZlLFxuICAgICAgb25Ub3VjaEVuZFxuICAgIH1cbiAgfSk7XG59XG5cbmV4cG9ydCB7IGZyZWVNb2RlIGFzIGRlZmF1bHQgfTtcbiIsImZ1bmN0aW9uIEdyaWQoX3JlZikge1xuICBsZXQge1xuICAgIHN3aXBlcixcbiAgICBleHRlbmRQYXJhbXMsXG4gICAgb25cbiAgfSA9IF9yZWY7XG4gIGV4dGVuZFBhcmFtcyh7XG4gICAgZ3JpZDoge1xuICAgICAgcm93czogMSxcbiAgICAgIGZpbGw6ICdjb2x1bW4nXG4gICAgfVxuICB9KTtcbiAgbGV0IHNsaWRlc051bWJlckV2ZW5Ub1Jvd3M7XG4gIGxldCBzbGlkZXNQZXJSb3c7XG4gIGxldCBudW1GdWxsQ29sdW1ucztcbiAgbGV0IHdhc011bHRpUm93O1xuICBjb25zdCBnZXRTcGFjZUJldHdlZW4gPSAoKSA9PiB7XG4gICAgbGV0IHNwYWNlQmV0d2VlbiA9IHN3aXBlci5wYXJhbXMuc3BhY2VCZXR3ZWVuO1xuICAgIGlmICh0eXBlb2Ygc3BhY2VCZXR3ZWVuID09PSAnc3RyaW5nJyAmJiBzcGFjZUJldHdlZW4uaW5kZXhPZignJScpID49IDApIHtcbiAgICAgIHNwYWNlQmV0d2VlbiA9IHBhcnNlRmxvYXQoc3BhY2VCZXR3ZWVuLnJlcGxhY2UoJyUnLCAnJykpIC8gMTAwICogc3dpcGVyLnNpemU7XG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygc3BhY2VCZXR3ZWVuID09PSAnc3RyaW5nJykge1xuICAgICAgc3BhY2VCZXR3ZWVuID0gcGFyc2VGbG9hdChzcGFjZUJldHdlZW4pO1xuICAgIH1cbiAgICByZXR1cm4gc3BhY2VCZXR3ZWVuO1xuICB9O1xuICBjb25zdCBpbml0U2xpZGVzID0gc2xpZGVzID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBzbGlkZXNQZXJWaWV3XG4gICAgfSA9IHN3aXBlci5wYXJhbXM7XG4gICAgY29uc3Qge1xuICAgICAgcm93cyxcbiAgICAgIGZpbGxcbiAgICB9ID0gc3dpcGVyLnBhcmFtcy5ncmlkO1xuICAgIGNvbnN0IHNsaWRlc0xlbmd0aCA9IHN3aXBlci52aXJ0dWFsICYmIHN3aXBlci5wYXJhbXMudmlydHVhbC5lbmFibGVkID8gc3dpcGVyLnZpcnR1YWwuc2xpZGVzLmxlbmd0aCA6IHNsaWRlcy5sZW5ndGg7XG4gICAgbnVtRnVsbENvbHVtbnMgPSBNYXRoLmZsb29yKHNsaWRlc0xlbmd0aCAvIHJvd3MpO1xuICAgIGlmIChNYXRoLmZsb29yKHNsaWRlc0xlbmd0aCAvIHJvd3MpID09PSBzbGlkZXNMZW5ndGggLyByb3dzKSB7XG4gICAgICBzbGlkZXNOdW1iZXJFdmVuVG9Sb3dzID0gc2xpZGVzTGVuZ3RoO1xuICAgIH0gZWxzZSB7XG4gICAgICBzbGlkZXNOdW1iZXJFdmVuVG9Sb3dzID0gTWF0aC5jZWlsKHNsaWRlc0xlbmd0aCAvIHJvd3MpICogcm93cztcbiAgICB9XG4gICAgaWYgKHNsaWRlc1BlclZpZXcgIT09ICdhdXRvJyAmJiBmaWxsID09PSAncm93Jykge1xuICAgICAgc2xpZGVzTnVtYmVyRXZlblRvUm93cyA9IE1hdGgubWF4KHNsaWRlc051bWJlckV2ZW5Ub1Jvd3MsIHNsaWRlc1BlclZpZXcgKiByb3dzKTtcbiAgICB9XG4gICAgc2xpZGVzUGVyUm93ID0gc2xpZGVzTnVtYmVyRXZlblRvUm93cyAvIHJvd3M7XG4gIH07XG4gIGNvbnN0IHVuc2V0U2xpZGVzID0gKCkgPT4ge1xuICAgIGlmIChzd2lwZXIuc2xpZGVzKSB7XG4gICAgICBzd2lwZXIuc2xpZGVzLmZvckVhY2goc2xpZGUgPT4ge1xuICAgICAgICBpZiAoc2xpZGUuc3dpcGVyU2xpZGVHcmlkU2V0KSB7XG4gICAgICAgICAgc2xpZGUuc3R5bGUuaGVpZ2h0ID0gJyc7XG4gICAgICAgICAgc2xpZGUuc3R5bGVbc3dpcGVyLmdldERpcmVjdGlvbkxhYmVsKCdtYXJnaW4tdG9wJyldID0gJyc7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgdXBkYXRlU2xpZGUgPSAoaSwgc2xpZGUsIHNsaWRlcykgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIHNsaWRlc1Blckdyb3VwXG4gICAgfSA9IHN3aXBlci5wYXJhbXM7XG4gICAgY29uc3Qgc3BhY2VCZXR3ZWVuID0gZ2V0U3BhY2VCZXR3ZWVuKCk7XG4gICAgY29uc3Qge1xuICAgICAgcm93cyxcbiAgICAgIGZpbGxcbiAgICB9ID0gc3dpcGVyLnBhcmFtcy5ncmlkO1xuICAgIGNvbnN0IHNsaWRlc0xlbmd0aCA9IHN3aXBlci52aXJ0dWFsICYmIHN3aXBlci5wYXJhbXMudmlydHVhbC5lbmFibGVkID8gc3dpcGVyLnZpcnR1YWwuc2xpZGVzLmxlbmd0aCA6IHNsaWRlcy5sZW5ndGg7XG4gICAgLy8gU2V0IHNsaWRlcyBvcmRlclxuICAgIGxldCBuZXdTbGlkZU9yZGVySW5kZXg7XG4gICAgbGV0IGNvbHVtbjtcbiAgICBsZXQgcm93O1xuICAgIGlmIChmaWxsID09PSAncm93JyAmJiBzbGlkZXNQZXJHcm91cCA+IDEpIHtcbiAgICAgIGNvbnN0IGdyb3VwSW5kZXggPSBNYXRoLmZsb29yKGkgLyAoc2xpZGVzUGVyR3JvdXAgKiByb3dzKSk7XG4gICAgICBjb25zdCBzbGlkZUluZGV4SW5Hcm91cCA9IGkgLSByb3dzICogc2xpZGVzUGVyR3JvdXAgKiBncm91cEluZGV4O1xuICAgICAgY29uc3QgY29sdW1uc0luR3JvdXAgPSBncm91cEluZGV4ID09PSAwID8gc2xpZGVzUGVyR3JvdXAgOiBNYXRoLm1pbihNYXRoLmNlaWwoKHNsaWRlc0xlbmd0aCAtIGdyb3VwSW5kZXggKiByb3dzICogc2xpZGVzUGVyR3JvdXApIC8gcm93cyksIHNsaWRlc1Blckdyb3VwKTtcbiAgICAgIHJvdyA9IE1hdGguZmxvb3Ioc2xpZGVJbmRleEluR3JvdXAgLyBjb2x1bW5zSW5Hcm91cCk7XG4gICAgICBjb2x1bW4gPSBzbGlkZUluZGV4SW5Hcm91cCAtIHJvdyAqIGNvbHVtbnNJbkdyb3VwICsgZ3JvdXBJbmRleCAqIHNsaWRlc1Blckdyb3VwO1xuICAgICAgbmV3U2xpZGVPcmRlckluZGV4ID0gY29sdW1uICsgcm93ICogc2xpZGVzTnVtYmVyRXZlblRvUm93cyAvIHJvd3M7XG4gICAgICBzbGlkZS5zdHlsZS5vcmRlciA9IG5ld1NsaWRlT3JkZXJJbmRleDtcbiAgICB9IGVsc2UgaWYgKGZpbGwgPT09ICdjb2x1bW4nKSB7XG4gICAgICBjb2x1bW4gPSBNYXRoLmZsb29yKGkgLyByb3dzKTtcbiAgICAgIHJvdyA9IGkgLSBjb2x1bW4gKiByb3dzO1xuICAgICAgaWYgKGNvbHVtbiA+IG51bUZ1bGxDb2x1bW5zIHx8IGNvbHVtbiA9PT0gbnVtRnVsbENvbHVtbnMgJiYgcm93ID09PSByb3dzIC0gMSkge1xuICAgICAgICByb3cgKz0gMTtcbiAgICAgICAgaWYgKHJvdyA+PSByb3dzKSB7XG4gICAgICAgICAgcm93ID0gMDtcbiAgICAgICAgICBjb2x1bW4gKz0gMTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByb3cgPSBNYXRoLmZsb29yKGkgLyBzbGlkZXNQZXJSb3cpO1xuICAgICAgY29sdW1uID0gaSAtIHJvdyAqIHNsaWRlc1BlclJvdztcbiAgICB9XG4gICAgc2xpZGUucm93ID0gcm93O1xuICAgIHNsaWRlLmNvbHVtbiA9IGNvbHVtbjtcbiAgICBzbGlkZS5zdHlsZS5oZWlnaHQgPSBgY2FsYygoMTAwJSAtICR7KHJvd3MgLSAxKSAqIHNwYWNlQmV0d2Vlbn1weCkgLyAke3Jvd3N9KWA7XG4gICAgc2xpZGUuc3R5bGVbc3dpcGVyLmdldERpcmVjdGlvbkxhYmVsKCdtYXJnaW4tdG9wJyldID0gcm93ICE9PSAwID8gc3BhY2VCZXR3ZWVuICYmIGAke3NwYWNlQmV0d2Vlbn1weGAgOiAnJztcbiAgICBzbGlkZS5zd2lwZXJTbGlkZUdyaWRTZXQgPSB0cnVlO1xuICB9O1xuICBjb25zdCB1cGRhdGVXcmFwcGVyU2l6ZSA9IChzbGlkZVNpemUsIHNuYXBHcmlkKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgY2VudGVyZWRTbGlkZXMsXG4gICAgICByb3VuZExlbmd0aHNcbiAgICB9ID0gc3dpcGVyLnBhcmFtcztcbiAgICBjb25zdCBzcGFjZUJldHdlZW4gPSBnZXRTcGFjZUJldHdlZW4oKTtcbiAgICBjb25zdCB7XG4gICAgICByb3dzXG4gICAgfSA9IHN3aXBlci5wYXJhbXMuZ3JpZDtcbiAgICBzd2lwZXIudmlydHVhbFNpemUgPSAoc2xpZGVTaXplICsgc3BhY2VCZXR3ZWVuKSAqIHNsaWRlc051bWJlckV2ZW5Ub1Jvd3M7XG4gICAgc3dpcGVyLnZpcnR1YWxTaXplID0gTWF0aC5jZWlsKHN3aXBlci52aXJ0dWFsU2l6ZSAvIHJvd3MpIC0gc3BhY2VCZXR3ZWVuO1xuICAgIGlmICghc3dpcGVyLnBhcmFtcy5jc3NNb2RlKSB7XG4gICAgICBzd2lwZXIud3JhcHBlckVsLnN0eWxlW3N3aXBlci5nZXREaXJlY3Rpb25MYWJlbCgnd2lkdGgnKV0gPSBgJHtzd2lwZXIudmlydHVhbFNpemUgKyBzcGFjZUJldHdlZW59cHhgO1xuICAgIH1cbiAgICBpZiAoY2VudGVyZWRTbGlkZXMpIHtcbiAgICAgIGNvbnN0IG5ld1NsaWRlc0dyaWQgPSBbXTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc25hcEdyaWQubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgbGV0IHNsaWRlc0dyaWRJdGVtID0gc25hcEdyaWRbaV07XG4gICAgICAgIGlmIChyb3VuZExlbmd0aHMpIHNsaWRlc0dyaWRJdGVtID0gTWF0aC5mbG9vcihzbGlkZXNHcmlkSXRlbSk7XG4gICAgICAgIGlmIChzbmFwR3JpZFtpXSA8IHN3aXBlci52aXJ0dWFsU2l6ZSArIHNuYXBHcmlkWzBdKSBuZXdTbGlkZXNHcmlkLnB1c2goc2xpZGVzR3JpZEl0ZW0pO1xuICAgICAgfVxuICAgICAgc25hcEdyaWQuc3BsaWNlKDAsIHNuYXBHcmlkLmxlbmd0aCk7XG4gICAgICBzbmFwR3JpZC5wdXNoKC4uLm5ld1NsaWRlc0dyaWQpO1xuICAgIH1cbiAgfTtcbiAgY29uc3Qgb25Jbml0ID0gKCkgPT4ge1xuICAgIHdhc011bHRpUm93ID0gc3dpcGVyLnBhcmFtcy5ncmlkICYmIHN3aXBlci5wYXJhbXMuZ3JpZC5yb3dzID4gMTtcbiAgfTtcbiAgY29uc3Qgb25VcGRhdGUgPSAoKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgcGFyYW1zLFxuICAgICAgZWxcbiAgICB9ID0gc3dpcGVyO1xuICAgIGNvbnN0IGlzTXVsdGlSb3cgPSBwYXJhbXMuZ3JpZCAmJiBwYXJhbXMuZ3JpZC5yb3dzID4gMTtcbiAgICBpZiAod2FzTXVsdGlSb3cgJiYgIWlzTXVsdGlSb3cpIHtcbiAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoYCR7cGFyYW1zLmNvbnRhaW5lck1vZGlmaWVyQ2xhc3N9Z3JpZGAsIGAke3BhcmFtcy5jb250YWluZXJNb2RpZmllckNsYXNzfWdyaWQtY29sdW1uYCk7XG4gICAgICBudW1GdWxsQ29sdW1ucyA9IDE7XG4gICAgICBzd2lwZXIuZW1pdENvbnRhaW5lckNsYXNzZXMoKTtcbiAgICB9IGVsc2UgaWYgKCF3YXNNdWx0aVJvdyAmJiBpc011bHRpUm93KSB7XG4gICAgICBlbC5jbGFzc0xpc3QuYWRkKGAke3BhcmFtcy5jb250YWluZXJNb2RpZmllckNsYXNzfWdyaWRgKTtcbiAgICAgIGlmIChwYXJhbXMuZ3JpZC5maWxsID09PSAnY29sdW1uJykge1xuICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKGAke3BhcmFtcy5jb250YWluZXJNb2RpZmllckNsYXNzfWdyaWQtY29sdW1uYCk7XG4gICAgICB9XG4gICAgICBzd2lwZXIuZW1pdENvbnRhaW5lckNsYXNzZXMoKTtcbiAgICB9XG4gICAgd2FzTXVsdGlSb3cgPSBpc011bHRpUm93O1xuICB9O1xuICBvbignaW5pdCcsIG9uSW5pdCk7XG4gIG9uKCd1cGRhdGUnLCBvblVwZGF0ZSk7XG4gIHN3aXBlci5ncmlkID0ge1xuICAgIGluaXRTbGlkZXMsXG4gICAgdW5zZXRTbGlkZXMsXG4gICAgdXBkYXRlU2xpZGUsXG4gICAgdXBkYXRlV3JhcHBlclNpemVcbiAgfTtcbn1cblxuZXhwb3J0IHsgR3JpZCBhcyBkZWZhdWx0IH07XG4iLCJmdW5jdGlvbiBhcHBlbmRTbGlkZShzbGlkZXMpIHtcbiAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgY29uc3Qge1xuICAgIHBhcmFtcyxcbiAgICBzbGlkZXNFbFxuICB9ID0gc3dpcGVyO1xuICBpZiAocGFyYW1zLmxvb3ApIHtcbiAgICBzd2lwZXIubG9vcERlc3Ryb3koKTtcbiAgfVxuICBjb25zdCBhcHBlbmRFbGVtZW50ID0gc2xpZGVFbCA9PiB7XG4gICAgaWYgKHR5cGVvZiBzbGlkZUVsID09PSAnc3RyaW5nJykge1xuICAgICAgY29uc3QgdGVtcERPTSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgdGVtcERPTS5pbm5lckhUTUwgPSBzbGlkZUVsO1xuICAgICAgc2xpZGVzRWwuYXBwZW5kKHRlbXBET00uY2hpbGRyZW5bMF0pO1xuICAgICAgdGVtcERPTS5pbm5lckhUTUwgPSAnJztcbiAgICB9IGVsc2Uge1xuICAgICAgc2xpZGVzRWwuYXBwZW5kKHNsaWRlRWwpO1xuICAgIH1cbiAgfTtcbiAgaWYgKHR5cGVvZiBzbGlkZXMgPT09ICdvYmplY3QnICYmICdsZW5ndGgnIGluIHNsaWRlcykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2xpZGVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBpZiAoc2xpZGVzW2ldKSBhcHBlbmRFbGVtZW50KHNsaWRlc1tpXSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGFwcGVuZEVsZW1lbnQoc2xpZGVzKTtcbiAgfVxuICBzd2lwZXIucmVjYWxjU2xpZGVzKCk7XG4gIGlmIChwYXJhbXMubG9vcCkge1xuICAgIHN3aXBlci5sb29wQ3JlYXRlKCk7XG4gIH1cbiAgaWYgKCFwYXJhbXMub2JzZXJ2ZXIgfHwgc3dpcGVyLmlzRWxlbWVudCkge1xuICAgIHN3aXBlci51cGRhdGUoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwcmVwZW5kU2xpZGUoc2xpZGVzKSB7XG4gIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gIGNvbnN0IHtcbiAgICBwYXJhbXMsXG4gICAgYWN0aXZlSW5kZXgsXG4gICAgc2xpZGVzRWxcbiAgfSA9IHN3aXBlcjtcbiAgaWYgKHBhcmFtcy5sb29wKSB7XG4gICAgc3dpcGVyLmxvb3BEZXN0cm95KCk7XG4gIH1cbiAgbGV0IG5ld0FjdGl2ZUluZGV4ID0gYWN0aXZlSW5kZXggKyAxO1xuICBjb25zdCBwcmVwZW5kRWxlbWVudCA9IHNsaWRlRWwgPT4ge1xuICAgIGlmICh0eXBlb2Ygc2xpZGVFbCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbnN0IHRlbXBET00gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIHRlbXBET00uaW5uZXJIVE1MID0gc2xpZGVFbDtcbiAgICAgIHNsaWRlc0VsLnByZXBlbmQodGVtcERPTS5jaGlsZHJlblswXSk7XG4gICAgICB0ZW1wRE9NLmlubmVySFRNTCA9ICcnO1xuICAgIH0gZWxzZSB7XG4gICAgICBzbGlkZXNFbC5wcmVwZW5kKHNsaWRlRWwpO1xuICAgIH1cbiAgfTtcbiAgaWYgKHR5cGVvZiBzbGlkZXMgPT09ICdvYmplY3QnICYmICdsZW5ndGgnIGluIHNsaWRlcykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2xpZGVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBpZiAoc2xpZGVzW2ldKSBwcmVwZW5kRWxlbWVudChzbGlkZXNbaV0pO1xuICAgIH1cbiAgICBuZXdBY3RpdmVJbmRleCA9IGFjdGl2ZUluZGV4ICsgc2xpZGVzLmxlbmd0aDtcbiAgfSBlbHNlIHtcbiAgICBwcmVwZW5kRWxlbWVudChzbGlkZXMpO1xuICB9XG4gIHN3aXBlci5yZWNhbGNTbGlkZXMoKTtcbiAgaWYgKHBhcmFtcy5sb29wKSB7XG4gICAgc3dpcGVyLmxvb3BDcmVhdGUoKTtcbiAgfVxuICBpZiAoIXBhcmFtcy5vYnNlcnZlciB8fCBzd2lwZXIuaXNFbGVtZW50KSB7XG4gICAgc3dpcGVyLnVwZGF0ZSgpO1xuICB9XG4gIHN3aXBlci5zbGlkZVRvKG5ld0FjdGl2ZUluZGV4LCAwLCBmYWxzZSk7XG59XG5cbmZ1bmN0aW9uIGFkZFNsaWRlKGluZGV4LCBzbGlkZXMpIHtcbiAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgY29uc3Qge1xuICAgIHBhcmFtcyxcbiAgICBhY3RpdmVJbmRleCxcbiAgICBzbGlkZXNFbFxuICB9ID0gc3dpcGVyO1xuICBsZXQgYWN0aXZlSW5kZXhCdWZmZXIgPSBhY3RpdmVJbmRleDtcbiAgaWYgKHBhcmFtcy5sb29wKSB7XG4gICAgYWN0aXZlSW5kZXhCdWZmZXIgLT0gc3dpcGVyLmxvb3BlZFNsaWRlcztcbiAgICBzd2lwZXIubG9vcERlc3Ryb3koKTtcbiAgICBzd2lwZXIucmVjYWxjU2xpZGVzKCk7XG4gIH1cbiAgY29uc3QgYmFzZUxlbmd0aCA9IHN3aXBlci5zbGlkZXMubGVuZ3RoO1xuICBpZiAoaW5kZXggPD0gMCkge1xuICAgIHN3aXBlci5wcmVwZW5kU2xpZGUoc2xpZGVzKTtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGluZGV4ID49IGJhc2VMZW5ndGgpIHtcbiAgICBzd2lwZXIuYXBwZW5kU2xpZGUoc2xpZGVzKTtcbiAgICByZXR1cm47XG4gIH1cbiAgbGV0IG5ld0FjdGl2ZUluZGV4ID0gYWN0aXZlSW5kZXhCdWZmZXIgPiBpbmRleCA/IGFjdGl2ZUluZGV4QnVmZmVyICsgMSA6IGFjdGl2ZUluZGV4QnVmZmVyO1xuICBjb25zdCBzbGlkZXNCdWZmZXIgPSBbXTtcbiAgZm9yIChsZXQgaSA9IGJhc2VMZW5ndGggLSAxOyBpID49IGluZGV4OyBpIC09IDEpIHtcbiAgICBjb25zdCBjdXJyZW50U2xpZGUgPSBzd2lwZXIuc2xpZGVzW2ldO1xuICAgIGN1cnJlbnRTbGlkZS5yZW1vdmUoKTtcbiAgICBzbGlkZXNCdWZmZXIudW5zaGlmdChjdXJyZW50U2xpZGUpO1xuICB9XG4gIGlmICh0eXBlb2Ygc2xpZGVzID09PSAnb2JqZWN0JyAmJiAnbGVuZ3RoJyBpbiBzbGlkZXMpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNsaWRlcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgaWYgKHNsaWRlc1tpXSkgc2xpZGVzRWwuYXBwZW5kKHNsaWRlc1tpXSk7XG4gICAgfVxuICAgIG5ld0FjdGl2ZUluZGV4ID0gYWN0aXZlSW5kZXhCdWZmZXIgPiBpbmRleCA/IGFjdGl2ZUluZGV4QnVmZmVyICsgc2xpZGVzLmxlbmd0aCA6IGFjdGl2ZUluZGV4QnVmZmVyO1xuICB9IGVsc2Uge1xuICAgIHNsaWRlc0VsLmFwcGVuZChzbGlkZXMpO1xuICB9XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc2xpZGVzQnVmZmVyLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgc2xpZGVzRWwuYXBwZW5kKHNsaWRlc0J1ZmZlcltpXSk7XG4gIH1cbiAgc3dpcGVyLnJlY2FsY1NsaWRlcygpO1xuICBpZiAocGFyYW1zLmxvb3ApIHtcbiAgICBzd2lwZXIubG9vcENyZWF0ZSgpO1xuICB9XG4gIGlmICghcGFyYW1zLm9ic2VydmVyIHx8IHN3aXBlci5pc0VsZW1lbnQpIHtcbiAgICBzd2lwZXIudXBkYXRlKCk7XG4gIH1cbiAgaWYgKHBhcmFtcy5sb29wKSB7XG4gICAgc3dpcGVyLnNsaWRlVG8obmV3QWN0aXZlSW5kZXggKyBzd2lwZXIubG9vcGVkU2xpZGVzLCAwLCBmYWxzZSk7XG4gIH0gZWxzZSB7XG4gICAgc3dpcGVyLnNsaWRlVG8obmV3QWN0aXZlSW5kZXgsIDAsIGZhbHNlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZW1vdmVTbGlkZShzbGlkZXNJbmRleGVzKSB7XG4gIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gIGNvbnN0IHtcbiAgICBwYXJhbXMsXG4gICAgYWN0aXZlSW5kZXhcbiAgfSA9IHN3aXBlcjtcbiAgbGV0IGFjdGl2ZUluZGV4QnVmZmVyID0gYWN0aXZlSW5kZXg7XG4gIGlmIChwYXJhbXMubG9vcCkge1xuICAgIGFjdGl2ZUluZGV4QnVmZmVyIC09IHN3aXBlci5sb29wZWRTbGlkZXM7XG4gICAgc3dpcGVyLmxvb3BEZXN0cm95KCk7XG4gIH1cbiAgbGV0IG5ld0FjdGl2ZUluZGV4ID0gYWN0aXZlSW5kZXhCdWZmZXI7XG4gIGxldCBpbmRleFRvUmVtb3ZlO1xuICBpZiAodHlwZW9mIHNsaWRlc0luZGV4ZXMgPT09ICdvYmplY3QnICYmICdsZW5ndGgnIGluIHNsaWRlc0luZGV4ZXMpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNsaWRlc0luZGV4ZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGluZGV4VG9SZW1vdmUgPSBzbGlkZXNJbmRleGVzW2ldO1xuICAgICAgaWYgKHN3aXBlci5zbGlkZXNbaW5kZXhUb1JlbW92ZV0pIHN3aXBlci5zbGlkZXNbaW5kZXhUb1JlbW92ZV0ucmVtb3ZlKCk7XG4gICAgICBpZiAoaW5kZXhUb1JlbW92ZSA8IG5ld0FjdGl2ZUluZGV4KSBuZXdBY3RpdmVJbmRleCAtPSAxO1xuICAgIH1cbiAgICBuZXdBY3RpdmVJbmRleCA9IE1hdGgubWF4KG5ld0FjdGl2ZUluZGV4LCAwKTtcbiAgfSBlbHNlIHtcbiAgICBpbmRleFRvUmVtb3ZlID0gc2xpZGVzSW5kZXhlcztcbiAgICBpZiAoc3dpcGVyLnNsaWRlc1tpbmRleFRvUmVtb3ZlXSkgc3dpcGVyLnNsaWRlc1tpbmRleFRvUmVtb3ZlXS5yZW1vdmUoKTtcbiAgICBpZiAoaW5kZXhUb1JlbW92ZSA8IG5ld0FjdGl2ZUluZGV4KSBuZXdBY3RpdmVJbmRleCAtPSAxO1xuICAgIG5ld0FjdGl2ZUluZGV4ID0gTWF0aC5tYXgobmV3QWN0aXZlSW5kZXgsIDApO1xuICB9XG4gIHN3aXBlci5yZWNhbGNTbGlkZXMoKTtcbiAgaWYgKHBhcmFtcy5sb29wKSB7XG4gICAgc3dpcGVyLmxvb3BDcmVhdGUoKTtcbiAgfVxuICBpZiAoIXBhcmFtcy5vYnNlcnZlciB8fCBzd2lwZXIuaXNFbGVtZW50KSB7XG4gICAgc3dpcGVyLnVwZGF0ZSgpO1xuICB9XG4gIGlmIChwYXJhbXMubG9vcCkge1xuICAgIHN3aXBlci5zbGlkZVRvKG5ld0FjdGl2ZUluZGV4ICsgc3dpcGVyLmxvb3BlZFNsaWRlcywgMCwgZmFsc2UpO1xuICB9IGVsc2Uge1xuICAgIHN3aXBlci5zbGlkZVRvKG5ld0FjdGl2ZUluZGV4LCAwLCBmYWxzZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlQWxsU2xpZGVzKCkge1xuICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICBjb25zdCBzbGlkZXNJbmRleGVzID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc3dpcGVyLnNsaWRlcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgIHNsaWRlc0luZGV4ZXMucHVzaChpKTtcbiAgfVxuICBzd2lwZXIucmVtb3ZlU2xpZGUoc2xpZGVzSW5kZXhlcyk7XG59XG5cbmZ1bmN0aW9uIE1hbmlwdWxhdGlvbihfcmVmKSB7XG4gIGxldCB7XG4gICAgc3dpcGVyXG4gIH0gPSBfcmVmO1xuICBPYmplY3QuYXNzaWduKHN3aXBlciwge1xuICAgIGFwcGVuZFNsaWRlOiBhcHBlbmRTbGlkZS5iaW5kKHN3aXBlciksXG4gICAgcHJlcGVuZFNsaWRlOiBwcmVwZW5kU2xpZGUuYmluZChzd2lwZXIpLFxuICAgIGFkZFNsaWRlOiBhZGRTbGlkZS5iaW5kKHN3aXBlciksXG4gICAgcmVtb3ZlU2xpZGU6IHJlbW92ZVNsaWRlLmJpbmQoc3dpcGVyKSxcbiAgICByZW1vdmVBbGxTbGlkZXM6IHJlbW92ZUFsbFNsaWRlcy5iaW5kKHN3aXBlcilcbiAgfSk7XG59XG5cbmV4cG9ydCB7IE1hbmlwdWxhdGlvbiBhcyBkZWZhdWx0IH07XG4iLCJmdW5jdGlvbiBlZmZlY3RJbml0KHBhcmFtcykge1xuICBjb25zdCB7XG4gICAgZWZmZWN0LFxuICAgIHN3aXBlcixcbiAgICBvbixcbiAgICBzZXRUcmFuc2xhdGUsXG4gICAgc2V0VHJhbnNpdGlvbixcbiAgICBvdmVyd3JpdGVQYXJhbXMsXG4gICAgcGVyc3BlY3RpdmUsXG4gICAgcmVjcmVhdGVTaGFkb3dzLFxuICAgIGdldEVmZmVjdFBhcmFtc1xuICB9ID0gcGFyYW1zO1xuICBvbignYmVmb3JlSW5pdCcsICgpID0+IHtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5lZmZlY3QgIT09IGVmZmVjdCkgcmV0dXJuO1xuICAgIHN3aXBlci5jbGFzc05hbWVzLnB1c2goYCR7c3dpcGVyLnBhcmFtcy5jb250YWluZXJNb2RpZmllckNsYXNzfSR7ZWZmZWN0fWApO1xuICAgIGlmIChwZXJzcGVjdGl2ZSAmJiBwZXJzcGVjdGl2ZSgpKSB7XG4gICAgICBzd2lwZXIuY2xhc3NOYW1lcy5wdXNoKGAke3N3aXBlci5wYXJhbXMuY29udGFpbmVyTW9kaWZpZXJDbGFzc30zZGApO1xuICAgIH1cbiAgICBjb25zdCBvdmVyd3JpdGVQYXJhbXNSZXN1bHQgPSBvdmVyd3JpdGVQYXJhbXMgPyBvdmVyd3JpdGVQYXJhbXMoKSA6IHt9O1xuICAgIE9iamVjdC5hc3NpZ24oc3dpcGVyLnBhcmFtcywgb3ZlcndyaXRlUGFyYW1zUmVzdWx0KTtcbiAgICBPYmplY3QuYXNzaWduKHN3aXBlci5vcmlnaW5hbFBhcmFtcywgb3ZlcndyaXRlUGFyYW1zUmVzdWx0KTtcbiAgfSk7XG4gIG9uKCdzZXRUcmFuc2xhdGUnLCAoKSA9PiB7XG4gICAgaWYgKHN3aXBlci5wYXJhbXMuZWZmZWN0ICE9PSBlZmZlY3QpIHJldHVybjtcbiAgICBzZXRUcmFuc2xhdGUoKTtcbiAgfSk7XG4gIG9uKCdzZXRUcmFuc2l0aW9uJywgKF9zLCBkdXJhdGlvbikgPT4ge1xuICAgIGlmIChzd2lwZXIucGFyYW1zLmVmZmVjdCAhPT0gZWZmZWN0KSByZXR1cm47XG4gICAgc2V0VHJhbnNpdGlvbihkdXJhdGlvbik7XG4gIH0pO1xuICBvbigndHJhbnNpdGlvbkVuZCcsICgpID0+IHtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5lZmZlY3QgIT09IGVmZmVjdCkgcmV0dXJuO1xuICAgIGlmIChyZWNyZWF0ZVNoYWRvd3MpIHtcbiAgICAgIGlmICghZ2V0RWZmZWN0UGFyYW1zIHx8ICFnZXRFZmZlY3RQYXJhbXMoKS5zbGlkZVNoYWRvd3MpIHJldHVybjtcbiAgICAgIC8vIHJlbW92ZSBzaGFkb3dzXG4gICAgICBzd2lwZXIuc2xpZGVzLmZvckVhY2goc2xpZGVFbCA9PiB7XG4gICAgICAgIHNsaWRlRWwucXVlcnlTZWxlY3RvckFsbCgnLnN3aXBlci1zbGlkZS1zaGFkb3ctdG9wLCAuc3dpcGVyLXNsaWRlLXNoYWRvdy1yaWdodCwgLnN3aXBlci1zbGlkZS1zaGFkb3ctYm90dG9tLCAuc3dpcGVyLXNsaWRlLXNoYWRvdy1sZWZ0JykuZm9yRWFjaChzaGFkb3dFbCA9PiBzaGFkb3dFbC5yZW1vdmUoKSk7XG4gICAgICB9KTtcbiAgICAgIC8vIGNyZWF0ZSBuZXcgb25lXG4gICAgICByZWNyZWF0ZVNoYWRvd3MoKTtcbiAgICB9XG4gIH0pO1xuICBsZXQgcmVxdWlyZVVwZGF0ZU9uVmlydHVhbDtcbiAgb24oJ3ZpcnR1YWxVcGRhdGUnLCAoKSA9PiB7XG4gICAgaWYgKHN3aXBlci5wYXJhbXMuZWZmZWN0ICE9PSBlZmZlY3QpIHJldHVybjtcbiAgICBpZiAoIXN3aXBlci5zbGlkZXMubGVuZ3RoKSB7XG4gICAgICByZXF1aXJlVXBkYXRlT25WaXJ0dWFsID0gdHJ1ZTtcbiAgICB9XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIGlmIChyZXF1aXJlVXBkYXRlT25WaXJ0dWFsICYmIHN3aXBlci5zbGlkZXMgJiYgc3dpcGVyLnNsaWRlcy5sZW5ndGgpIHtcbiAgICAgICAgc2V0VHJhbnNsYXRlKCk7XG4gICAgICAgIHJlcXVpcmVVcGRhdGVPblZpcnR1YWwgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG5cbmV4cG9ydCB7IGVmZmVjdEluaXQgYXMgZSB9O1xuIiwiaW1wb3J0IHsgbCBhcyBnZXRTbGlkZVRyYW5zZm9ybUVsIH0gZnJvbSAnLi91dGlscy5tanMnO1xuXG5mdW5jdGlvbiBlZmZlY3RUYXJnZXQoZWZmZWN0UGFyYW1zLCBzbGlkZUVsKSB7XG4gIGNvbnN0IHRyYW5zZm9ybUVsID0gZ2V0U2xpZGVUcmFuc2Zvcm1FbChzbGlkZUVsKTtcbiAgaWYgKHRyYW5zZm9ybUVsICE9PSBzbGlkZUVsKSB7XG4gICAgdHJhbnNmb3JtRWwuc3R5bGUuYmFja2ZhY2VWaXNpYmlsaXR5ID0gJ2hpZGRlbic7XG4gICAgdHJhbnNmb3JtRWwuc3R5bGVbJy13ZWJraXQtYmFja2ZhY2UtdmlzaWJpbGl0eSddID0gJ2hpZGRlbic7XG4gIH1cbiAgcmV0dXJuIHRyYW5zZm9ybUVsO1xufVxuXG5leHBvcnQgeyBlZmZlY3RUYXJnZXQgYXMgZSB9O1xuIiwiaW1wb3J0IHsgaiBhcyBlbGVtZW50VHJhbnNpdGlvbkVuZCB9IGZyb20gJy4vdXRpbHMubWpzJztcblxuZnVuY3Rpb24gZWZmZWN0VmlydHVhbFRyYW5zaXRpb25FbmQoX3JlZikge1xuICBsZXQge1xuICAgIHN3aXBlcixcbiAgICBkdXJhdGlvbixcbiAgICB0cmFuc2Zvcm1FbGVtZW50cyxcbiAgICBhbGxTbGlkZXNcbiAgfSA9IF9yZWY7XG4gIGNvbnN0IHtcbiAgICBhY3RpdmVJbmRleFxuICB9ID0gc3dpcGVyO1xuICBjb25zdCBnZXRTbGlkZSA9IGVsID0+IHtcbiAgICBpZiAoIWVsLnBhcmVudEVsZW1lbnQpIHtcbiAgICAgIC8vIGFzc3VtZSBzaGFkb3cgcm9vdFxuICAgICAgY29uc3Qgc2xpZGUgPSBzd2lwZXIuc2xpZGVzLmZpbHRlcihzbGlkZUVsID0+IHNsaWRlRWwuc2hhZG93Um9vdCAmJiBzbGlkZUVsLnNoYWRvd1Jvb3QgPT09IGVsLnBhcmVudE5vZGUpWzBdO1xuICAgICAgcmV0dXJuIHNsaWRlO1xuICAgIH1cbiAgICByZXR1cm4gZWwucGFyZW50RWxlbWVudDtcbiAgfTtcbiAgaWYgKHN3aXBlci5wYXJhbXMudmlydHVhbFRyYW5zbGF0ZSAmJiBkdXJhdGlvbiAhPT0gMCkge1xuICAgIGxldCBldmVudFRyaWdnZXJlZCA9IGZhbHNlO1xuICAgIGxldCB0cmFuc2l0aW9uRW5kVGFyZ2V0O1xuICAgIGlmIChhbGxTbGlkZXMpIHtcbiAgICAgIHRyYW5zaXRpb25FbmRUYXJnZXQgPSB0cmFuc2Zvcm1FbGVtZW50cztcbiAgICB9IGVsc2Uge1xuICAgICAgdHJhbnNpdGlvbkVuZFRhcmdldCA9IHRyYW5zZm9ybUVsZW1lbnRzLmZpbHRlcih0cmFuc2Zvcm1FbCA9PiB7XG4gICAgICAgIGNvbnN0IGVsID0gdHJhbnNmb3JtRWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdzd2lwZXItc2xpZGUtdHJhbnNmb3JtJykgPyBnZXRTbGlkZSh0cmFuc2Zvcm1FbCkgOiB0cmFuc2Zvcm1FbDtcbiAgICAgICAgcmV0dXJuIHN3aXBlci5nZXRTbGlkZUluZGV4KGVsKSA9PT0gYWN0aXZlSW5kZXg7XG4gICAgICB9KTtcbiAgICB9XG4gICAgdHJhbnNpdGlvbkVuZFRhcmdldC5mb3JFYWNoKGVsID0+IHtcbiAgICAgIGVsZW1lbnRUcmFuc2l0aW9uRW5kKGVsLCAoKSA9PiB7XG4gICAgICAgIGlmIChldmVudFRyaWdnZXJlZCkgcmV0dXJuO1xuICAgICAgICBpZiAoIXN3aXBlciB8fCBzd2lwZXIuZGVzdHJveWVkKSByZXR1cm47XG4gICAgICAgIGV2ZW50VHJpZ2dlcmVkID0gdHJ1ZTtcbiAgICAgICAgc3dpcGVyLmFuaW1hdGluZyA9IGZhbHNlO1xuICAgICAgICBjb25zdCBldnQgPSBuZXcgd2luZG93LkN1c3RvbUV2ZW50KCd0cmFuc2l0aW9uZW5kJywge1xuICAgICAgICAgIGJ1YmJsZXM6IHRydWUsXG4gICAgICAgICAgY2FuY2VsYWJsZTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgICAgc3dpcGVyLndyYXBwZXJFbC5kaXNwYXRjaEV2ZW50KGV2dCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgeyBlZmZlY3RWaXJ0dWFsVHJhbnNpdGlvbkVuZCBhcyBlIH07XG4iLCJpbXBvcnQgeyBlIGFzIGVmZmVjdEluaXQgfSBmcm9tICcuLi9zaGFyZWQvZWZmZWN0LWluaXQubWpzJztcbmltcG9ydCB7IGUgYXMgZWZmZWN0VGFyZ2V0IH0gZnJvbSAnLi4vc2hhcmVkL2VmZmVjdC10YXJnZXQubWpzJztcbmltcG9ydCB7IGUgYXMgZWZmZWN0VmlydHVhbFRyYW5zaXRpb25FbmQgfSBmcm9tICcuLi9zaGFyZWQvZWZmZWN0LXZpcnR1YWwtdHJhbnNpdGlvbi1lbmQubWpzJztcbmltcG9ydCB7IGwgYXMgZ2V0U2xpZGVUcmFuc2Zvcm1FbCB9IGZyb20gJy4uL3NoYXJlZC91dGlscy5tanMnO1xuXG5mdW5jdGlvbiBFZmZlY3RGYWRlKF9yZWYpIHtcbiAgbGV0IHtcbiAgICBzd2lwZXIsXG4gICAgZXh0ZW5kUGFyYW1zLFxuICAgIG9uXG4gIH0gPSBfcmVmO1xuICBleHRlbmRQYXJhbXMoe1xuICAgIGZhZGVFZmZlY3Q6IHtcbiAgICAgIGNyb3NzRmFkZTogZmFsc2VcbiAgICB9XG4gIH0pO1xuICBjb25zdCBzZXRUcmFuc2xhdGUgPSAoKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgc2xpZGVzXG4gICAgfSA9IHN3aXBlcjtcbiAgICBjb25zdCBwYXJhbXMgPSBzd2lwZXIucGFyYW1zLmZhZGVFZmZlY3Q7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzbGlkZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGNvbnN0IHNsaWRlRWwgPSBzd2lwZXIuc2xpZGVzW2ldO1xuICAgICAgY29uc3Qgb2Zmc2V0ID0gc2xpZGVFbC5zd2lwZXJTbGlkZU9mZnNldDtcbiAgICAgIGxldCB0eCA9IC1vZmZzZXQ7XG4gICAgICBpZiAoIXN3aXBlci5wYXJhbXMudmlydHVhbFRyYW5zbGF0ZSkgdHggLT0gc3dpcGVyLnRyYW5zbGF0ZTtcbiAgICAgIGxldCB0eSA9IDA7XG4gICAgICBpZiAoIXN3aXBlci5pc0hvcml6b250YWwoKSkge1xuICAgICAgICB0eSA9IHR4O1xuICAgICAgICB0eCA9IDA7XG4gICAgICB9XG4gICAgICBjb25zdCBzbGlkZU9wYWNpdHkgPSBzd2lwZXIucGFyYW1zLmZhZGVFZmZlY3QuY3Jvc3NGYWRlID8gTWF0aC5tYXgoMSAtIE1hdGguYWJzKHNsaWRlRWwucHJvZ3Jlc3MpLCAwKSA6IDEgKyBNYXRoLm1pbihNYXRoLm1heChzbGlkZUVsLnByb2dyZXNzLCAtMSksIDApO1xuICAgICAgY29uc3QgdGFyZ2V0RWwgPSBlZmZlY3RUYXJnZXQocGFyYW1zLCBzbGlkZUVsKTtcbiAgICAgIHRhcmdldEVsLnN0eWxlLm9wYWNpdHkgPSBzbGlkZU9wYWNpdHk7XG4gICAgICB0YXJnZXRFbC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlM2QoJHt0eH1weCwgJHt0eX1weCwgMHB4KWA7XG4gICAgfVxuICB9O1xuICBjb25zdCBzZXRUcmFuc2l0aW9uID0gZHVyYXRpb24gPT4ge1xuICAgIGNvbnN0IHRyYW5zZm9ybUVsZW1lbnRzID0gc3dpcGVyLnNsaWRlcy5tYXAoc2xpZGVFbCA9PiBnZXRTbGlkZVRyYW5zZm9ybUVsKHNsaWRlRWwpKTtcbiAgICB0cmFuc2Zvcm1FbGVtZW50cy5mb3JFYWNoKGVsID0+IHtcbiAgICAgIGVsLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IGAke2R1cmF0aW9ufW1zYDtcbiAgICB9KTtcbiAgICBlZmZlY3RWaXJ0dWFsVHJhbnNpdGlvbkVuZCh7XG4gICAgICBzd2lwZXIsXG4gICAgICBkdXJhdGlvbixcbiAgICAgIHRyYW5zZm9ybUVsZW1lbnRzLFxuICAgICAgYWxsU2xpZGVzOiB0cnVlXG4gICAgfSk7XG4gIH07XG4gIGVmZmVjdEluaXQoe1xuICAgIGVmZmVjdDogJ2ZhZGUnLFxuICAgIHN3aXBlcixcbiAgICBvbixcbiAgICBzZXRUcmFuc2xhdGUsXG4gICAgc2V0VHJhbnNpdGlvbixcbiAgICBvdmVyd3JpdGVQYXJhbXM6ICgpID0+ICh7XG4gICAgICBzbGlkZXNQZXJWaWV3OiAxLFxuICAgICAgc2xpZGVzUGVyR3JvdXA6IDEsXG4gICAgICB3YXRjaFNsaWRlc1Byb2dyZXNzOiB0cnVlLFxuICAgICAgc3BhY2VCZXR3ZWVuOiAwLFxuICAgICAgdmlydHVhbFRyYW5zbGF0ZTogIXN3aXBlci5wYXJhbXMuY3NzTW9kZVxuICAgIH0pXG4gIH0pO1xufVxuXG5leHBvcnQgeyBFZmZlY3RGYWRlIGFzIGRlZmF1bHQgfTtcbiIsImltcG9ydCB7IGUgYXMgZWZmZWN0SW5pdCB9IGZyb20gJy4uL3NoYXJlZC9lZmZlY3QtaW5pdC5tanMnO1xuaW1wb3J0IHsgYyBhcyBjcmVhdGVFbGVtZW50IH0gZnJvbSAnLi4vc2hhcmVkL3V0aWxzLm1qcyc7XG5cbmZ1bmN0aW9uIEVmZmVjdEN1YmUoX3JlZikge1xuICBsZXQge1xuICAgIHN3aXBlcixcbiAgICBleHRlbmRQYXJhbXMsXG4gICAgb25cbiAgfSA9IF9yZWY7XG4gIGV4dGVuZFBhcmFtcyh7XG4gICAgY3ViZUVmZmVjdDoge1xuICAgICAgc2xpZGVTaGFkb3dzOiB0cnVlLFxuICAgICAgc2hhZG93OiB0cnVlLFxuICAgICAgc2hhZG93T2Zmc2V0OiAyMCxcbiAgICAgIHNoYWRvd1NjYWxlOiAwLjk0XG4gICAgfVxuICB9KTtcbiAgY29uc3QgY3JlYXRlU2xpZGVTaGFkb3dzID0gKHNsaWRlRWwsIHByb2dyZXNzLCBpc0hvcml6b250YWwpID0+IHtcbiAgICBsZXQgc2hhZG93QmVmb3JlID0gaXNIb3Jpem9udGFsID8gc2xpZGVFbC5xdWVyeVNlbGVjdG9yKCcuc3dpcGVyLXNsaWRlLXNoYWRvdy1sZWZ0JykgOiBzbGlkZUVsLnF1ZXJ5U2VsZWN0b3IoJy5zd2lwZXItc2xpZGUtc2hhZG93LXRvcCcpO1xuICAgIGxldCBzaGFkb3dBZnRlciA9IGlzSG9yaXpvbnRhbCA/IHNsaWRlRWwucXVlcnlTZWxlY3RvcignLnN3aXBlci1zbGlkZS1zaGFkb3ctcmlnaHQnKSA6IHNsaWRlRWwucXVlcnlTZWxlY3RvcignLnN3aXBlci1zbGlkZS1zaGFkb3ctYm90dG9tJyk7XG4gICAgaWYgKCFzaGFkb3dCZWZvcmUpIHtcbiAgICAgIHNoYWRvd0JlZm9yZSA9IGNyZWF0ZUVsZW1lbnQoJ2RpdicsIGBzd2lwZXItc2xpZGUtc2hhZG93LWN1YmUgc3dpcGVyLXNsaWRlLXNoYWRvdy0ke2lzSG9yaXpvbnRhbCA/ICdsZWZ0JyA6ICd0b3AnfWAuc3BsaXQoJyAnKSk7XG4gICAgICBzbGlkZUVsLmFwcGVuZChzaGFkb3dCZWZvcmUpO1xuICAgIH1cbiAgICBpZiAoIXNoYWRvd0FmdGVyKSB7XG4gICAgICBzaGFkb3dBZnRlciA9IGNyZWF0ZUVsZW1lbnQoJ2RpdicsIGBzd2lwZXItc2xpZGUtc2hhZG93LWN1YmUgc3dpcGVyLXNsaWRlLXNoYWRvdy0ke2lzSG9yaXpvbnRhbCA/ICdyaWdodCcgOiAnYm90dG9tJ31gLnNwbGl0KCcgJykpO1xuICAgICAgc2xpZGVFbC5hcHBlbmQoc2hhZG93QWZ0ZXIpO1xuICAgIH1cbiAgICBpZiAoc2hhZG93QmVmb3JlKSBzaGFkb3dCZWZvcmUuc3R5bGUub3BhY2l0eSA9IE1hdGgubWF4KC1wcm9ncmVzcywgMCk7XG4gICAgaWYgKHNoYWRvd0FmdGVyKSBzaGFkb3dBZnRlci5zdHlsZS5vcGFjaXR5ID0gTWF0aC5tYXgocHJvZ3Jlc3MsIDApO1xuICB9O1xuICBjb25zdCByZWNyZWF0ZVNoYWRvd3MgPSAoKSA9PiB7XG4gICAgLy8gY3JlYXRlIG5ldyBvbmVzXG4gICAgY29uc3QgaXNIb3Jpem9udGFsID0gc3dpcGVyLmlzSG9yaXpvbnRhbCgpO1xuICAgIHN3aXBlci5zbGlkZXMuZm9yRWFjaChzbGlkZUVsID0+IHtcbiAgICAgIGNvbnN0IHByb2dyZXNzID0gTWF0aC5tYXgoTWF0aC5taW4oc2xpZGVFbC5wcm9ncmVzcywgMSksIC0xKTtcbiAgICAgIGNyZWF0ZVNsaWRlU2hhZG93cyhzbGlkZUVsLCBwcm9ncmVzcywgaXNIb3Jpem9udGFsKTtcbiAgICB9KTtcbiAgfTtcbiAgY29uc3Qgc2V0VHJhbnNsYXRlID0gKCkgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIGVsLFxuICAgICAgd3JhcHBlckVsLFxuICAgICAgc2xpZGVzLFxuICAgICAgd2lkdGg6IHN3aXBlcldpZHRoLFxuICAgICAgaGVpZ2h0OiBzd2lwZXJIZWlnaHQsXG4gICAgICBydGxUcmFuc2xhdGU6IHJ0bCxcbiAgICAgIHNpemU6IHN3aXBlclNpemUsXG4gICAgICBicm93c2VyXG4gICAgfSA9IHN3aXBlcjtcbiAgICBjb25zdCBwYXJhbXMgPSBzd2lwZXIucGFyYW1zLmN1YmVFZmZlY3Q7XG4gICAgY29uc3QgaXNIb3Jpem9udGFsID0gc3dpcGVyLmlzSG9yaXpvbnRhbCgpO1xuICAgIGNvbnN0IGlzVmlydHVhbCA9IHN3aXBlci52aXJ0dWFsICYmIHN3aXBlci5wYXJhbXMudmlydHVhbC5lbmFibGVkO1xuICAgIGxldCB3cmFwcGVyUm90YXRlID0gMDtcbiAgICBsZXQgY3ViZVNoYWRvd0VsO1xuICAgIGlmIChwYXJhbXMuc2hhZG93KSB7XG4gICAgICBpZiAoaXNIb3Jpem9udGFsKSB7XG4gICAgICAgIGN1YmVTaGFkb3dFbCA9IHN3aXBlci53cmFwcGVyRWwucXVlcnlTZWxlY3RvcignLnN3aXBlci1jdWJlLXNoYWRvdycpO1xuICAgICAgICBpZiAoIWN1YmVTaGFkb3dFbCkge1xuICAgICAgICAgIGN1YmVTaGFkb3dFbCA9IGNyZWF0ZUVsZW1lbnQoJ2RpdicsICdzd2lwZXItY3ViZS1zaGFkb3cnKTtcbiAgICAgICAgICBzd2lwZXIud3JhcHBlckVsLmFwcGVuZChjdWJlU2hhZG93RWwpO1xuICAgICAgICB9XG4gICAgICAgIGN1YmVTaGFkb3dFbC5zdHlsZS5oZWlnaHQgPSBgJHtzd2lwZXJXaWR0aH1weGA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjdWJlU2hhZG93RWwgPSBlbC5xdWVyeVNlbGVjdG9yKCcuc3dpcGVyLWN1YmUtc2hhZG93Jyk7XG4gICAgICAgIGlmICghY3ViZVNoYWRvd0VsKSB7XG4gICAgICAgICAgY3ViZVNoYWRvd0VsID0gY3JlYXRlRWxlbWVudCgnZGl2JywgJ3N3aXBlci1jdWJlLXNoYWRvdycpO1xuICAgICAgICAgIGVsLmFwcGVuZChjdWJlU2hhZG93RWwpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2xpZGVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBjb25zdCBzbGlkZUVsID0gc2xpZGVzW2ldO1xuICAgICAgbGV0IHNsaWRlSW5kZXggPSBpO1xuICAgICAgaWYgKGlzVmlydHVhbCkge1xuICAgICAgICBzbGlkZUluZGV4ID0gcGFyc2VJbnQoc2xpZGVFbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3dpcGVyLXNsaWRlLWluZGV4JyksIDEwKTtcbiAgICAgIH1cbiAgICAgIGxldCBzbGlkZUFuZ2xlID0gc2xpZGVJbmRleCAqIDkwO1xuICAgICAgbGV0IHJvdW5kID0gTWF0aC5mbG9vcihzbGlkZUFuZ2xlIC8gMzYwKTtcbiAgICAgIGlmIChydGwpIHtcbiAgICAgICAgc2xpZGVBbmdsZSA9IC1zbGlkZUFuZ2xlO1xuICAgICAgICByb3VuZCA9IE1hdGguZmxvb3IoLXNsaWRlQW5nbGUgLyAzNjApO1xuICAgICAgfVxuICAgICAgY29uc3QgcHJvZ3Jlc3MgPSBNYXRoLm1heChNYXRoLm1pbihzbGlkZUVsLnByb2dyZXNzLCAxKSwgLTEpO1xuICAgICAgbGV0IHR4ID0gMDtcbiAgICAgIGxldCB0eSA9IDA7XG4gICAgICBsZXQgdHogPSAwO1xuICAgICAgaWYgKHNsaWRlSW5kZXggJSA0ID09PSAwKSB7XG4gICAgICAgIHR4ID0gLXJvdW5kICogNCAqIHN3aXBlclNpemU7XG4gICAgICAgIHR6ID0gMDtcbiAgICAgIH0gZWxzZSBpZiAoKHNsaWRlSW5kZXggLSAxKSAlIDQgPT09IDApIHtcbiAgICAgICAgdHggPSAwO1xuICAgICAgICB0eiA9IC1yb3VuZCAqIDQgKiBzd2lwZXJTaXplO1xuICAgICAgfSBlbHNlIGlmICgoc2xpZGVJbmRleCAtIDIpICUgNCA9PT0gMCkge1xuICAgICAgICB0eCA9IHN3aXBlclNpemUgKyByb3VuZCAqIDQgKiBzd2lwZXJTaXplO1xuICAgICAgICB0eiA9IHN3aXBlclNpemU7XG4gICAgICB9IGVsc2UgaWYgKChzbGlkZUluZGV4IC0gMykgJSA0ID09PSAwKSB7XG4gICAgICAgIHR4ID0gLXN3aXBlclNpemU7XG4gICAgICAgIHR6ID0gMyAqIHN3aXBlclNpemUgKyBzd2lwZXJTaXplICogNCAqIHJvdW5kO1xuICAgICAgfVxuICAgICAgaWYgKHJ0bCkge1xuICAgICAgICB0eCA9IC10eDtcbiAgICAgIH1cbiAgICAgIGlmICghaXNIb3Jpem9udGFsKSB7XG4gICAgICAgIHR5ID0gdHg7XG4gICAgICAgIHR4ID0gMDtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHRyYW5zZm9ybSA9IGByb3RhdGVYKCR7aXNIb3Jpem9udGFsID8gMCA6IC1zbGlkZUFuZ2xlfWRlZykgcm90YXRlWSgke2lzSG9yaXpvbnRhbCA/IHNsaWRlQW5nbGUgOiAwfWRlZykgdHJhbnNsYXRlM2QoJHt0eH1weCwgJHt0eX1weCwgJHt0en1weClgO1xuICAgICAgaWYgKHByb2dyZXNzIDw9IDEgJiYgcHJvZ3Jlc3MgPiAtMSkge1xuICAgICAgICB3cmFwcGVyUm90YXRlID0gc2xpZGVJbmRleCAqIDkwICsgcHJvZ3Jlc3MgKiA5MDtcbiAgICAgICAgaWYgKHJ0bCkgd3JhcHBlclJvdGF0ZSA9IC1zbGlkZUluZGV4ICogOTAgLSBwcm9ncmVzcyAqIDkwO1xuICAgICAgICBpZiAoc3dpcGVyLmJyb3dzZXIgJiYgc3dpcGVyLmJyb3dzZXIuaXNTYWZhcmkgJiYgTWF0aC5hYnMod3JhcHBlclJvdGF0ZSkgLyA5MCAlIDIgPT09IDEpIHtcbiAgICAgICAgICB3cmFwcGVyUm90YXRlICs9IDAuMDAxO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBzbGlkZUVsLnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybTtcbiAgICAgIGlmIChwYXJhbXMuc2xpZGVTaGFkb3dzKSB7XG4gICAgICAgIGNyZWF0ZVNsaWRlU2hhZG93cyhzbGlkZUVsLCBwcm9ncmVzcywgaXNIb3Jpem9udGFsKTtcbiAgICAgIH1cbiAgICB9XG4gICAgd3JhcHBlckVsLnN0eWxlLnRyYW5zZm9ybU9yaWdpbiA9IGA1MCUgNTAlIC0ke3N3aXBlclNpemUgLyAyfXB4YDtcbiAgICB3cmFwcGVyRWwuc3R5bGVbJy13ZWJraXQtdHJhbnNmb3JtLW9yaWdpbiddID0gYDUwJSA1MCUgLSR7c3dpcGVyU2l6ZSAvIDJ9cHhgO1xuICAgIGlmIChwYXJhbXMuc2hhZG93KSB7XG4gICAgICBpZiAoaXNIb3Jpem9udGFsKSB7XG4gICAgICAgIGN1YmVTaGFkb3dFbC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlM2QoMHB4LCAke3N3aXBlcldpZHRoIC8gMiArIHBhcmFtcy5zaGFkb3dPZmZzZXR9cHgsICR7LXN3aXBlcldpZHRoIC8gMn1weCkgcm90YXRlWCg4OS45OWRlZykgcm90YXRlWigwZGVnKSBzY2FsZSgke3BhcmFtcy5zaGFkb3dTY2FsZX0pYDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHNoYWRvd0FuZ2xlID0gTWF0aC5hYnMod3JhcHBlclJvdGF0ZSkgLSBNYXRoLmZsb29yKE1hdGguYWJzKHdyYXBwZXJSb3RhdGUpIC8gOTApICogOTA7XG4gICAgICAgIGNvbnN0IG11bHRpcGxpZXIgPSAxLjUgLSAoTWF0aC5zaW4oc2hhZG93QW5nbGUgKiAyICogTWF0aC5QSSAvIDM2MCkgLyAyICsgTWF0aC5jb3Moc2hhZG93QW5nbGUgKiAyICogTWF0aC5QSSAvIDM2MCkgLyAyKTtcbiAgICAgICAgY29uc3Qgc2NhbGUxID0gcGFyYW1zLnNoYWRvd1NjYWxlO1xuICAgICAgICBjb25zdCBzY2FsZTIgPSBwYXJhbXMuc2hhZG93U2NhbGUgLyBtdWx0aXBsaWVyO1xuICAgICAgICBjb25zdCBvZmZzZXQgPSBwYXJhbXMuc2hhZG93T2Zmc2V0O1xuICAgICAgICBjdWJlU2hhZG93RWwuc3R5bGUudHJhbnNmb3JtID0gYHNjYWxlM2QoJHtzY2FsZTF9LCAxLCAke3NjYWxlMn0pIHRyYW5zbGF0ZTNkKDBweCwgJHtzd2lwZXJIZWlnaHQgLyAyICsgb2Zmc2V0fXB4LCAkey1zd2lwZXJIZWlnaHQgLyAyIC8gc2NhbGUyfXB4KSByb3RhdGVYKC04OS45OWRlZylgO1xuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCB6RmFjdG9yID0gKGJyb3dzZXIuaXNTYWZhcmkgfHwgYnJvd3Nlci5pc1dlYlZpZXcpICYmIGJyb3dzZXIubmVlZFBlcnNwZWN0aXZlRml4ID8gLXN3aXBlclNpemUgLyAyIDogMDtcbiAgICB3cmFwcGVyRWwuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZTNkKDBweCwwLCR7ekZhY3Rvcn1weCkgcm90YXRlWCgke3N3aXBlci5pc0hvcml6b250YWwoKSA/IDAgOiB3cmFwcGVyUm90YXRlfWRlZykgcm90YXRlWSgke3N3aXBlci5pc0hvcml6b250YWwoKSA/IC13cmFwcGVyUm90YXRlIDogMH1kZWcpYDtcbiAgICB3cmFwcGVyRWwuc3R5bGUuc2V0UHJvcGVydHkoJy0tc3dpcGVyLWN1YmUtdHJhbnNsYXRlLXonLCBgJHt6RmFjdG9yfXB4YCk7XG4gIH07XG4gIGNvbnN0IHNldFRyYW5zaXRpb24gPSBkdXJhdGlvbiA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgZWwsXG4gICAgICBzbGlkZXNcbiAgICB9ID0gc3dpcGVyO1xuICAgIHNsaWRlcy5mb3JFYWNoKHNsaWRlRWwgPT4ge1xuICAgICAgc2xpZGVFbC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSBgJHtkdXJhdGlvbn1tc2A7XG4gICAgICBzbGlkZUVsLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zd2lwZXItc2xpZGUtc2hhZG93LXRvcCwgLnN3aXBlci1zbGlkZS1zaGFkb3ctcmlnaHQsIC5zd2lwZXItc2xpZGUtc2hhZG93LWJvdHRvbSwgLnN3aXBlci1zbGlkZS1zaGFkb3ctbGVmdCcpLmZvckVhY2goc3ViRWwgPT4ge1xuICAgICAgICBzdWJFbC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSBgJHtkdXJhdGlvbn1tc2A7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5jdWJlRWZmZWN0LnNoYWRvdyAmJiAhc3dpcGVyLmlzSG9yaXpvbnRhbCgpKSB7XG4gICAgICBjb25zdCBzaGFkb3dFbCA9IGVsLnF1ZXJ5U2VsZWN0b3IoJy5zd2lwZXItY3ViZS1zaGFkb3cnKTtcbiAgICAgIGlmIChzaGFkb3dFbCkgc2hhZG93RWwuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gYCR7ZHVyYXRpb259bXNgO1xuICAgIH1cbiAgfTtcbiAgZWZmZWN0SW5pdCh7XG4gICAgZWZmZWN0OiAnY3ViZScsXG4gICAgc3dpcGVyLFxuICAgIG9uLFxuICAgIHNldFRyYW5zbGF0ZSxcbiAgICBzZXRUcmFuc2l0aW9uLFxuICAgIHJlY3JlYXRlU2hhZG93cyxcbiAgICBnZXRFZmZlY3RQYXJhbXM6ICgpID0+IHN3aXBlci5wYXJhbXMuY3ViZUVmZmVjdCxcbiAgICBwZXJzcGVjdGl2ZTogKCkgPT4gdHJ1ZSxcbiAgICBvdmVyd3JpdGVQYXJhbXM6ICgpID0+ICh7XG4gICAgICBzbGlkZXNQZXJWaWV3OiAxLFxuICAgICAgc2xpZGVzUGVyR3JvdXA6IDEsXG4gICAgICB3YXRjaFNsaWRlc1Byb2dyZXNzOiB0cnVlLFxuICAgICAgcmVzaXN0YW5jZVJhdGlvOiAwLFxuICAgICAgc3BhY2VCZXR3ZWVuOiAwLFxuICAgICAgY2VudGVyZWRTbGlkZXM6IGZhbHNlLFxuICAgICAgdmlydHVhbFRyYW5zbGF0ZTogdHJ1ZVxuICAgIH0pXG4gIH0pO1xufVxuXG5leHBvcnQgeyBFZmZlY3RDdWJlIGFzIGRlZmF1bHQgfTtcbiIsImltcG9ydCB7IGwgYXMgZ2V0U2xpZGVUcmFuc2Zvcm1FbCwgYyBhcyBjcmVhdGVFbGVtZW50IH0gZnJvbSAnLi91dGlscy5tanMnO1xuXG5mdW5jdGlvbiBjcmVhdGVTaGFkb3coc3VmZml4LCBzbGlkZUVsLCBzaWRlKSB7XG4gIGNvbnN0IHNoYWRvd0NsYXNzID0gYHN3aXBlci1zbGlkZS1zaGFkb3cke3NpZGUgPyBgLSR7c2lkZX1gIDogJyd9JHtzdWZmaXggPyBgIHN3aXBlci1zbGlkZS1zaGFkb3ctJHtzdWZmaXh9YCA6ICcnfWA7XG4gIGNvbnN0IHNoYWRvd0NvbnRhaW5lciA9IGdldFNsaWRlVHJhbnNmb3JtRWwoc2xpZGVFbCk7XG4gIGxldCBzaGFkb3dFbCA9IHNoYWRvd0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yKGAuJHtzaGFkb3dDbGFzcy5zcGxpdCgnICcpLmpvaW4oJy4nKX1gKTtcbiAgaWYgKCFzaGFkb3dFbCkge1xuICAgIHNoYWRvd0VsID0gY3JlYXRlRWxlbWVudCgnZGl2Jywgc2hhZG93Q2xhc3Muc3BsaXQoJyAnKSk7XG4gICAgc2hhZG93Q29udGFpbmVyLmFwcGVuZChzaGFkb3dFbCk7XG4gIH1cbiAgcmV0dXJuIHNoYWRvd0VsO1xufVxuXG5leHBvcnQgeyBjcmVhdGVTaGFkb3cgYXMgYyB9O1xuIiwiaW1wb3J0IHsgYyBhcyBjcmVhdGVTaGFkb3cgfSBmcm9tICcuLi9zaGFyZWQvY3JlYXRlLXNoYWRvdy5tanMnO1xuaW1wb3J0IHsgZSBhcyBlZmZlY3RJbml0IH0gZnJvbSAnLi4vc2hhcmVkL2VmZmVjdC1pbml0Lm1qcyc7XG5pbXBvcnQgeyBlIGFzIGVmZmVjdFRhcmdldCB9IGZyb20gJy4uL3NoYXJlZC9lZmZlY3QtdGFyZ2V0Lm1qcyc7XG5pbXBvcnQgeyBlIGFzIGVmZmVjdFZpcnR1YWxUcmFuc2l0aW9uRW5kIH0gZnJvbSAnLi4vc2hhcmVkL2VmZmVjdC12aXJ0dWFsLXRyYW5zaXRpb24tZW5kLm1qcyc7XG5pbXBvcnQgeyBsIGFzIGdldFNsaWRlVHJhbnNmb3JtRWwgfSBmcm9tICcuLi9zaGFyZWQvdXRpbHMubWpzJztcblxuZnVuY3Rpb24gRWZmZWN0RmxpcChfcmVmKSB7XG4gIGxldCB7XG4gICAgc3dpcGVyLFxuICAgIGV4dGVuZFBhcmFtcyxcbiAgICBvblxuICB9ID0gX3JlZjtcbiAgZXh0ZW5kUGFyYW1zKHtcbiAgICBmbGlwRWZmZWN0OiB7XG4gICAgICBzbGlkZVNoYWRvd3M6IHRydWUsXG4gICAgICBsaW1pdFJvdGF0aW9uOiB0cnVlXG4gICAgfVxuICB9KTtcbiAgY29uc3QgY3JlYXRlU2xpZGVTaGFkb3dzID0gKHNsaWRlRWwsIHByb2dyZXNzKSA9PiB7XG4gICAgbGV0IHNoYWRvd0JlZm9yZSA9IHN3aXBlci5pc0hvcml6b250YWwoKSA/IHNsaWRlRWwucXVlcnlTZWxlY3RvcignLnN3aXBlci1zbGlkZS1zaGFkb3ctbGVmdCcpIDogc2xpZGVFbC5xdWVyeVNlbGVjdG9yKCcuc3dpcGVyLXNsaWRlLXNoYWRvdy10b3AnKTtcbiAgICBsZXQgc2hhZG93QWZ0ZXIgPSBzd2lwZXIuaXNIb3Jpem9udGFsKCkgPyBzbGlkZUVsLnF1ZXJ5U2VsZWN0b3IoJy5zd2lwZXItc2xpZGUtc2hhZG93LXJpZ2h0JykgOiBzbGlkZUVsLnF1ZXJ5U2VsZWN0b3IoJy5zd2lwZXItc2xpZGUtc2hhZG93LWJvdHRvbScpO1xuICAgIGlmICghc2hhZG93QmVmb3JlKSB7XG4gICAgICBzaGFkb3dCZWZvcmUgPSBjcmVhdGVTaGFkb3coJ2ZsaXAnLCBzbGlkZUVsLCBzd2lwZXIuaXNIb3Jpem9udGFsKCkgPyAnbGVmdCcgOiAndG9wJyk7XG4gICAgfVxuICAgIGlmICghc2hhZG93QWZ0ZXIpIHtcbiAgICAgIHNoYWRvd0FmdGVyID0gY3JlYXRlU2hhZG93KCdmbGlwJywgc2xpZGVFbCwgc3dpcGVyLmlzSG9yaXpvbnRhbCgpID8gJ3JpZ2h0JyA6ICdib3R0b20nKTtcbiAgICB9XG4gICAgaWYgKHNoYWRvd0JlZm9yZSkgc2hhZG93QmVmb3JlLnN0eWxlLm9wYWNpdHkgPSBNYXRoLm1heCgtcHJvZ3Jlc3MsIDApO1xuICAgIGlmIChzaGFkb3dBZnRlcikgc2hhZG93QWZ0ZXIuc3R5bGUub3BhY2l0eSA9IE1hdGgubWF4KHByb2dyZXNzLCAwKTtcbiAgfTtcbiAgY29uc3QgcmVjcmVhdGVTaGFkb3dzID0gKCkgPT4ge1xuICAgIC8vIFNldCBzaGFkb3dzXG4gICAgc3dpcGVyLnBhcmFtcy5mbGlwRWZmZWN0O1xuICAgIHN3aXBlci5zbGlkZXMuZm9yRWFjaChzbGlkZUVsID0+IHtcbiAgICAgIGxldCBwcm9ncmVzcyA9IHNsaWRlRWwucHJvZ3Jlc3M7XG4gICAgICBpZiAoc3dpcGVyLnBhcmFtcy5mbGlwRWZmZWN0LmxpbWl0Um90YXRpb24pIHtcbiAgICAgICAgcHJvZ3Jlc3MgPSBNYXRoLm1heChNYXRoLm1pbihzbGlkZUVsLnByb2dyZXNzLCAxKSwgLTEpO1xuICAgICAgfVxuICAgICAgY3JlYXRlU2xpZGVTaGFkb3dzKHNsaWRlRWwsIHByb2dyZXNzKTtcbiAgICB9KTtcbiAgfTtcbiAgY29uc3Qgc2V0VHJhbnNsYXRlID0gKCkgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIHNsaWRlcyxcbiAgICAgIHJ0bFRyYW5zbGF0ZTogcnRsXG4gICAgfSA9IHN3aXBlcjtcbiAgICBjb25zdCBwYXJhbXMgPSBzd2lwZXIucGFyYW1zLmZsaXBFZmZlY3Q7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzbGlkZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGNvbnN0IHNsaWRlRWwgPSBzbGlkZXNbaV07XG4gICAgICBsZXQgcHJvZ3Jlc3MgPSBzbGlkZUVsLnByb2dyZXNzO1xuICAgICAgaWYgKHN3aXBlci5wYXJhbXMuZmxpcEVmZmVjdC5saW1pdFJvdGF0aW9uKSB7XG4gICAgICAgIHByb2dyZXNzID0gTWF0aC5tYXgoTWF0aC5taW4oc2xpZGVFbC5wcm9ncmVzcywgMSksIC0xKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG9mZnNldCA9IHNsaWRlRWwuc3dpcGVyU2xpZGVPZmZzZXQ7XG4gICAgICBjb25zdCByb3RhdGUgPSAtMTgwICogcHJvZ3Jlc3M7XG4gICAgICBsZXQgcm90YXRlWSA9IHJvdGF0ZTtcbiAgICAgIGxldCByb3RhdGVYID0gMDtcbiAgICAgIGxldCB0eCA9IHN3aXBlci5wYXJhbXMuY3NzTW9kZSA/IC1vZmZzZXQgLSBzd2lwZXIudHJhbnNsYXRlIDogLW9mZnNldDtcbiAgICAgIGxldCB0eSA9IDA7XG4gICAgICBpZiAoIXN3aXBlci5pc0hvcml6b250YWwoKSkge1xuICAgICAgICB0eSA9IHR4O1xuICAgICAgICB0eCA9IDA7XG4gICAgICAgIHJvdGF0ZVggPSAtcm90YXRlWTtcbiAgICAgICAgcm90YXRlWSA9IDA7XG4gICAgICB9IGVsc2UgaWYgKHJ0bCkge1xuICAgICAgICByb3RhdGVZID0gLXJvdGF0ZVk7XG4gICAgICB9XG4gICAgICBpZiAoc3dpcGVyLmJyb3dzZXIgJiYgc3dpcGVyLmJyb3dzZXIuaXNTYWZhcmkpIHtcbiAgICAgICAgaWYgKE1hdGguYWJzKHJvdGF0ZVkpIC8gOTAgJSAyID09PSAxKSB7XG4gICAgICAgICAgcm90YXRlWSArPSAwLjAwMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoTWF0aC5hYnMocm90YXRlWCkgLyA5MCAlIDIgPT09IDEpIHtcbiAgICAgICAgICByb3RhdGVYICs9IDAuMDAxO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBzbGlkZUVsLnN0eWxlLnpJbmRleCA9IC1NYXRoLmFicyhNYXRoLnJvdW5kKHByb2dyZXNzKSkgKyBzbGlkZXMubGVuZ3RoO1xuICAgICAgaWYgKHBhcmFtcy5zbGlkZVNoYWRvd3MpIHtcbiAgICAgICAgY3JlYXRlU2xpZGVTaGFkb3dzKHNsaWRlRWwsIHByb2dyZXNzKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHRyYW5zZm9ybSA9IGB0cmFuc2xhdGUzZCgke3R4fXB4LCAke3R5fXB4LCAwcHgpIHJvdGF0ZVgoJHtyb3RhdGVYfWRlZykgcm90YXRlWSgke3JvdGF0ZVl9ZGVnKWA7XG4gICAgICBjb25zdCB0YXJnZXRFbCA9IGVmZmVjdFRhcmdldChwYXJhbXMsIHNsaWRlRWwpO1xuICAgICAgdGFyZ2V0RWwuc3R5bGUudHJhbnNmb3JtID0gdHJhbnNmb3JtO1xuICAgIH1cbiAgfTtcbiAgY29uc3Qgc2V0VHJhbnNpdGlvbiA9IGR1cmF0aW9uID0+IHtcbiAgICBjb25zdCB0cmFuc2Zvcm1FbGVtZW50cyA9IHN3aXBlci5zbGlkZXMubWFwKHNsaWRlRWwgPT4gZ2V0U2xpZGVUcmFuc2Zvcm1FbChzbGlkZUVsKSk7XG4gICAgdHJhbnNmb3JtRWxlbWVudHMuZm9yRWFjaChlbCA9PiB7XG4gICAgICBlbC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSBgJHtkdXJhdGlvbn1tc2A7XG4gICAgICBlbC5xdWVyeVNlbGVjdG9yQWxsKCcuc3dpcGVyLXNsaWRlLXNoYWRvdy10b3AsIC5zd2lwZXItc2xpZGUtc2hhZG93LXJpZ2h0LCAuc3dpcGVyLXNsaWRlLXNoYWRvdy1ib3R0b20sIC5zd2lwZXItc2xpZGUtc2hhZG93LWxlZnQnKS5mb3JFYWNoKHNoYWRvd0VsID0+IHtcbiAgICAgICAgc2hhZG93RWwuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gYCR7ZHVyYXRpb259bXNgO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgZWZmZWN0VmlydHVhbFRyYW5zaXRpb25FbmQoe1xuICAgICAgc3dpcGVyLFxuICAgICAgZHVyYXRpb24sXG4gICAgICB0cmFuc2Zvcm1FbGVtZW50c1xuICAgIH0pO1xuICB9O1xuICBlZmZlY3RJbml0KHtcbiAgICBlZmZlY3Q6ICdmbGlwJyxcbiAgICBzd2lwZXIsXG4gICAgb24sXG4gICAgc2V0VHJhbnNsYXRlLFxuICAgIHNldFRyYW5zaXRpb24sXG4gICAgcmVjcmVhdGVTaGFkb3dzLFxuICAgIGdldEVmZmVjdFBhcmFtczogKCkgPT4gc3dpcGVyLnBhcmFtcy5mbGlwRWZmZWN0LFxuICAgIHBlcnNwZWN0aXZlOiAoKSA9PiB0cnVlLFxuICAgIG92ZXJ3cml0ZVBhcmFtczogKCkgPT4gKHtcbiAgICAgIHNsaWRlc1BlclZpZXc6IDEsXG4gICAgICBzbGlkZXNQZXJHcm91cDogMSxcbiAgICAgIHdhdGNoU2xpZGVzUHJvZ3Jlc3M6IHRydWUsXG4gICAgICBzcGFjZUJldHdlZW46IDAsXG4gICAgICB2aXJ0dWFsVHJhbnNsYXRlOiAhc3dpcGVyLnBhcmFtcy5jc3NNb2RlXG4gICAgfSlcbiAgfSk7XG59XG5cbmV4cG9ydCB7IEVmZmVjdEZsaXAgYXMgZGVmYXVsdCB9O1xuIiwiaW1wb3J0IHsgYyBhcyBjcmVhdGVTaGFkb3cgfSBmcm9tICcuLi9zaGFyZWQvY3JlYXRlLXNoYWRvdy5tanMnO1xuaW1wb3J0IHsgZSBhcyBlZmZlY3RJbml0IH0gZnJvbSAnLi4vc2hhcmVkL2VmZmVjdC1pbml0Lm1qcyc7XG5pbXBvcnQgeyBlIGFzIGVmZmVjdFRhcmdldCB9IGZyb20gJy4uL3NoYXJlZC9lZmZlY3QtdGFyZ2V0Lm1qcyc7XG5pbXBvcnQgeyBsIGFzIGdldFNsaWRlVHJhbnNmb3JtRWwgfSBmcm9tICcuLi9zaGFyZWQvdXRpbHMubWpzJztcblxuZnVuY3Rpb24gRWZmZWN0Q292ZXJmbG93KF9yZWYpIHtcbiAgbGV0IHtcbiAgICBzd2lwZXIsXG4gICAgZXh0ZW5kUGFyYW1zLFxuICAgIG9uXG4gIH0gPSBfcmVmO1xuICBleHRlbmRQYXJhbXMoe1xuICAgIGNvdmVyZmxvd0VmZmVjdDoge1xuICAgICAgcm90YXRlOiA1MCxcbiAgICAgIHN0cmV0Y2g6IDAsXG4gICAgICBkZXB0aDogMTAwLFxuICAgICAgc2NhbGU6IDEsXG4gICAgICBtb2RpZmllcjogMSxcbiAgICAgIHNsaWRlU2hhZG93czogdHJ1ZVxuICAgIH1cbiAgfSk7XG4gIGNvbnN0IHNldFRyYW5zbGF0ZSA9ICgpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICB3aWR0aDogc3dpcGVyV2lkdGgsXG4gICAgICBoZWlnaHQ6IHN3aXBlckhlaWdodCxcbiAgICAgIHNsaWRlcyxcbiAgICAgIHNsaWRlc1NpemVzR3JpZFxuICAgIH0gPSBzd2lwZXI7XG4gICAgY29uc3QgcGFyYW1zID0gc3dpcGVyLnBhcmFtcy5jb3ZlcmZsb3dFZmZlY3Q7XG4gICAgY29uc3QgaXNIb3Jpem9udGFsID0gc3dpcGVyLmlzSG9yaXpvbnRhbCgpO1xuICAgIGNvbnN0IHRyYW5zZm9ybSA9IHN3aXBlci50cmFuc2xhdGU7XG4gICAgY29uc3QgY2VudGVyID0gaXNIb3Jpem9udGFsID8gLXRyYW5zZm9ybSArIHN3aXBlcldpZHRoIC8gMiA6IC10cmFuc2Zvcm0gKyBzd2lwZXJIZWlnaHQgLyAyO1xuICAgIGNvbnN0IHJvdGF0ZSA9IGlzSG9yaXpvbnRhbCA/IHBhcmFtcy5yb3RhdGUgOiAtcGFyYW1zLnJvdGF0ZTtcbiAgICBjb25zdCB0cmFuc2xhdGUgPSBwYXJhbXMuZGVwdGg7XG4gICAgLy8gRWFjaCBzbGlkZSBvZmZzZXQgZnJvbSBjZW50ZXJcbiAgICBmb3IgKGxldCBpID0gMCwgbGVuZ3RoID0gc2xpZGVzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBjb25zdCBzbGlkZUVsID0gc2xpZGVzW2ldO1xuICAgICAgY29uc3Qgc2xpZGVTaXplID0gc2xpZGVzU2l6ZXNHcmlkW2ldO1xuICAgICAgY29uc3Qgc2xpZGVPZmZzZXQgPSBzbGlkZUVsLnN3aXBlclNsaWRlT2Zmc2V0O1xuICAgICAgY29uc3QgY2VudGVyT2Zmc2V0ID0gKGNlbnRlciAtIHNsaWRlT2Zmc2V0IC0gc2xpZGVTaXplIC8gMikgLyBzbGlkZVNpemU7XG4gICAgICBjb25zdCBvZmZzZXRNdWx0aXBsaWVyID0gdHlwZW9mIHBhcmFtcy5tb2RpZmllciA9PT0gJ2Z1bmN0aW9uJyA/IHBhcmFtcy5tb2RpZmllcihjZW50ZXJPZmZzZXQpIDogY2VudGVyT2Zmc2V0ICogcGFyYW1zLm1vZGlmaWVyO1xuICAgICAgbGV0IHJvdGF0ZVkgPSBpc0hvcml6b250YWwgPyByb3RhdGUgKiBvZmZzZXRNdWx0aXBsaWVyIDogMDtcbiAgICAgIGxldCByb3RhdGVYID0gaXNIb3Jpem9udGFsID8gMCA6IHJvdGF0ZSAqIG9mZnNldE11bHRpcGxpZXI7XG4gICAgICAvLyB2YXIgcm90YXRlWiA9IDBcbiAgICAgIGxldCB0cmFuc2xhdGVaID0gLXRyYW5zbGF0ZSAqIE1hdGguYWJzKG9mZnNldE11bHRpcGxpZXIpO1xuICAgICAgbGV0IHN0cmV0Y2ggPSBwYXJhbXMuc3RyZXRjaDtcbiAgICAgIC8vIEFsbG93IHBlcmNlbnRhZ2UgdG8gbWFrZSBhIHJlbGF0aXZlIHN0cmV0Y2ggZm9yIHJlc3BvbnNpdmUgc2xpZGVyc1xuICAgICAgaWYgKHR5cGVvZiBzdHJldGNoID09PSAnc3RyaW5nJyAmJiBzdHJldGNoLmluZGV4T2YoJyUnKSAhPT0gLTEpIHtcbiAgICAgICAgc3RyZXRjaCA9IHBhcnNlRmxvYXQocGFyYW1zLnN0cmV0Y2gpIC8gMTAwICogc2xpZGVTaXplO1xuICAgICAgfVxuICAgICAgbGV0IHRyYW5zbGF0ZVkgPSBpc0hvcml6b250YWwgPyAwIDogc3RyZXRjaCAqIG9mZnNldE11bHRpcGxpZXI7XG4gICAgICBsZXQgdHJhbnNsYXRlWCA9IGlzSG9yaXpvbnRhbCA/IHN0cmV0Y2ggKiBvZmZzZXRNdWx0aXBsaWVyIDogMDtcbiAgICAgIGxldCBzY2FsZSA9IDEgLSAoMSAtIHBhcmFtcy5zY2FsZSkgKiBNYXRoLmFicyhvZmZzZXRNdWx0aXBsaWVyKTtcblxuICAgICAgLy8gRml4IGZvciB1bHRyYSBzbWFsbCB2YWx1ZXNcbiAgICAgIGlmIChNYXRoLmFicyh0cmFuc2xhdGVYKSA8IDAuMDAxKSB0cmFuc2xhdGVYID0gMDtcbiAgICAgIGlmIChNYXRoLmFicyh0cmFuc2xhdGVZKSA8IDAuMDAxKSB0cmFuc2xhdGVZID0gMDtcbiAgICAgIGlmIChNYXRoLmFicyh0cmFuc2xhdGVaKSA8IDAuMDAxKSB0cmFuc2xhdGVaID0gMDtcbiAgICAgIGlmIChNYXRoLmFicyhyb3RhdGVZKSA8IDAuMDAxKSByb3RhdGVZID0gMDtcbiAgICAgIGlmIChNYXRoLmFicyhyb3RhdGVYKSA8IDAuMDAxKSByb3RhdGVYID0gMDtcbiAgICAgIGlmIChNYXRoLmFicyhzY2FsZSkgPCAwLjAwMSkgc2NhbGUgPSAwO1xuICAgICAgaWYgKHN3aXBlci5icm93c2VyICYmIHN3aXBlci5icm93c2VyLmlzU2FmYXJpKSB7XG4gICAgICAgIGlmIChNYXRoLmFicyhyb3RhdGVZKSAvIDkwICUgMiA9PT0gMSkge1xuICAgICAgICAgIHJvdGF0ZVkgKz0gMC4wMDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKE1hdGguYWJzKHJvdGF0ZVgpIC8gOTAgJSAyID09PSAxKSB7XG4gICAgICAgICAgcm90YXRlWCArPSAwLjAwMTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3Qgc2xpZGVUcmFuc2Zvcm0gPSBgdHJhbnNsYXRlM2QoJHt0cmFuc2xhdGVYfXB4LCR7dHJhbnNsYXRlWX1weCwke3RyYW5zbGF0ZVp9cHgpICByb3RhdGVYKCR7cm90YXRlWH1kZWcpIHJvdGF0ZVkoJHtyb3RhdGVZfWRlZykgc2NhbGUoJHtzY2FsZX0pYDtcbiAgICAgIGNvbnN0IHRhcmdldEVsID0gZWZmZWN0VGFyZ2V0KHBhcmFtcywgc2xpZGVFbCk7XG4gICAgICB0YXJnZXRFbC5zdHlsZS50cmFuc2Zvcm0gPSBzbGlkZVRyYW5zZm9ybTtcbiAgICAgIHNsaWRlRWwuc3R5bGUuekluZGV4ID0gLU1hdGguYWJzKE1hdGgucm91bmQob2Zmc2V0TXVsdGlwbGllcikpICsgMTtcbiAgICAgIGlmIChwYXJhbXMuc2xpZGVTaGFkb3dzKSB7XG4gICAgICAgIC8vIFNldCBzaGFkb3dzXG4gICAgICAgIGxldCBzaGFkb3dCZWZvcmVFbCA9IGlzSG9yaXpvbnRhbCA/IHNsaWRlRWwucXVlcnlTZWxlY3RvcignLnN3aXBlci1zbGlkZS1zaGFkb3ctbGVmdCcpIDogc2xpZGVFbC5xdWVyeVNlbGVjdG9yKCcuc3dpcGVyLXNsaWRlLXNoYWRvdy10b3AnKTtcbiAgICAgICAgbGV0IHNoYWRvd0FmdGVyRWwgPSBpc0hvcml6b250YWwgPyBzbGlkZUVsLnF1ZXJ5U2VsZWN0b3IoJy5zd2lwZXItc2xpZGUtc2hhZG93LXJpZ2h0JykgOiBzbGlkZUVsLnF1ZXJ5U2VsZWN0b3IoJy5zd2lwZXItc2xpZGUtc2hhZG93LWJvdHRvbScpO1xuICAgICAgICBpZiAoIXNoYWRvd0JlZm9yZUVsKSB7XG4gICAgICAgICAgc2hhZG93QmVmb3JlRWwgPSBjcmVhdGVTaGFkb3coJ2NvdmVyZmxvdycsIHNsaWRlRWwsIGlzSG9yaXpvbnRhbCA/ICdsZWZ0JyA6ICd0b3AnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXNoYWRvd0FmdGVyRWwpIHtcbiAgICAgICAgICBzaGFkb3dBZnRlckVsID0gY3JlYXRlU2hhZG93KCdjb3ZlcmZsb3cnLCBzbGlkZUVsLCBpc0hvcml6b250YWwgPyAncmlnaHQnIDogJ2JvdHRvbScpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzaGFkb3dCZWZvcmVFbCkgc2hhZG93QmVmb3JlRWwuc3R5bGUub3BhY2l0eSA9IG9mZnNldE11bHRpcGxpZXIgPiAwID8gb2Zmc2V0TXVsdGlwbGllciA6IDA7XG4gICAgICAgIGlmIChzaGFkb3dBZnRlckVsKSBzaGFkb3dBZnRlckVsLnN0eWxlLm9wYWNpdHkgPSAtb2Zmc2V0TXVsdGlwbGllciA+IDAgPyAtb2Zmc2V0TXVsdGlwbGllciA6IDA7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBjb25zdCBzZXRUcmFuc2l0aW9uID0gZHVyYXRpb24gPT4ge1xuICAgIGNvbnN0IHRyYW5zZm9ybUVsZW1lbnRzID0gc3dpcGVyLnNsaWRlcy5tYXAoc2xpZGVFbCA9PiBnZXRTbGlkZVRyYW5zZm9ybUVsKHNsaWRlRWwpKTtcbiAgICB0cmFuc2Zvcm1FbGVtZW50cy5mb3JFYWNoKGVsID0+IHtcbiAgICAgIGVsLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IGAke2R1cmF0aW9ufW1zYDtcbiAgICAgIGVsLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zd2lwZXItc2xpZGUtc2hhZG93LXRvcCwgLnN3aXBlci1zbGlkZS1zaGFkb3ctcmlnaHQsIC5zd2lwZXItc2xpZGUtc2hhZG93LWJvdHRvbSwgLnN3aXBlci1zbGlkZS1zaGFkb3ctbGVmdCcpLmZvckVhY2goc2hhZG93RWwgPT4ge1xuICAgICAgICBzaGFkb3dFbC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSBgJHtkdXJhdGlvbn1tc2A7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcbiAgZWZmZWN0SW5pdCh7XG4gICAgZWZmZWN0OiAnY292ZXJmbG93JyxcbiAgICBzd2lwZXIsXG4gICAgb24sXG4gICAgc2V0VHJhbnNsYXRlLFxuICAgIHNldFRyYW5zaXRpb24sXG4gICAgcGVyc3BlY3RpdmU6ICgpID0+IHRydWUsXG4gICAgb3ZlcndyaXRlUGFyYW1zOiAoKSA9PiAoe1xuICAgICAgd2F0Y2hTbGlkZXNQcm9ncmVzczogdHJ1ZVxuICAgIH0pXG4gIH0pO1xufVxuXG5leHBvcnQgeyBFZmZlY3RDb3ZlcmZsb3cgYXMgZGVmYXVsdCB9O1xuIiwiaW1wb3J0IHsgYyBhcyBjcmVhdGVTaGFkb3cgfSBmcm9tICcuLi9zaGFyZWQvY3JlYXRlLXNoYWRvdy5tanMnO1xuaW1wb3J0IHsgZSBhcyBlZmZlY3RJbml0IH0gZnJvbSAnLi4vc2hhcmVkL2VmZmVjdC1pbml0Lm1qcyc7XG5pbXBvcnQgeyBlIGFzIGVmZmVjdFRhcmdldCB9IGZyb20gJy4uL3NoYXJlZC9lZmZlY3QtdGFyZ2V0Lm1qcyc7XG5pbXBvcnQgeyBlIGFzIGVmZmVjdFZpcnR1YWxUcmFuc2l0aW9uRW5kIH0gZnJvbSAnLi4vc2hhcmVkL2VmZmVjdC12aXJ0dWFsLXRyYW5zaXRpb24tZW5kLm1qcyc7XG5pbXBvcnQgeyBsIGFzIGdldFNsaWRlVHJhbnNmb3JtRWwgfSBmcm9tICcuLi9zaGFyZWQvdXRpbHMubWpzJztcblxuZnVuY3Rpb24gRWZmZWN0Q3JlYXRpdmUoX3JlZikge1xuICBsZXQge1xuICAgIHN3aXBlcixcbiAgICBleHRlbmRQYXJhbXMsXG4gICAgb25cbiAgfSA9IF9yZWY7XG4gIGV4dGVuZFBhcmFtcyh7XG4gICAgY3JlYXRpdmVFZmZlY3Q6IHtcbiAgICAgIGxpbWl0UHJvZ3Jlc3M6IDEsXG4gICAgICBzaGFkb3dQZXJQcm9ncmVzczogZmFsc2UsXG4gICAgICBwcm9ncmVzc011bHRpcGxpZXI6IDEsXG4gICAgICBwZXJzcGVjdGl2ZTogdHJ1ZSxcbiAgICAgIHByZXY6IHtcbiAgICAgICAgdHJhbnNsYXRlOiBbMCwgMCwgMF0sXG4gICAgICAgIHJvdGF0ZTogWzAsIDAsIDBdLFxuICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICBzY2FsZTogMVxuICAgICAgfSxcbiAgICAgIG5leHQ6IHtcbiAgICAgICAgdHJhbnNsYXRlOiBbMCwgMCwgMF0sXG4gICAgICAgIHJvdGF0ZTogWzAsIDAsIDBdLFxuICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICBzY2FsZTogMVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIGNvbnN0IGdldFRyYW5zbGF0ZVZhbHVlID0gdmFsdWUgPT4ge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSByZXR1cm4gdmFsdWU7XG4gICAgcmV0dXJuIGAke3ZhbHVlfXB4YDtcbiAgfTtcbiAgY29uc3Qgc2V0VHJhbnNsYXRlID0gKCkgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIHNsaWRlcyxcbiAgICAgIHdyYXBwZXJFbCxcbiAgICAgIHNsaWRlc1NpemVzR3JpZFxuICAgIH0gPSBzd2lwZXI7XG4gICAgY29uc3QgcGFyYW1zID0gc3dpcGVyLnBhcmFtcy5jcmVhdGl2ZUVmZmVjdDtcbiAgICBjb25zdCB7XG4gICAgICBwcm9ncmVzc011bHRpcGxpZXI6IG11bHRpcGxpZXJcbiAgICB9ID0gcGFyYW1zO1xuICAgIGNvbnN0IGlzQ2VudGVyZWRTbGlkZXMgPSBzd2lwZXIucGFyYW1zLmNlbnRlcmVkU2xpZGVzO1xuICAgIGlmIChpc0NlbnRlcmVkU2xpZGVzKSB7XG4gICAgICBjb25zdCBtYXJnaW4gPSBzbGlkZXNTaXplc0dyaWRbMF0gLyAyIC0gc3dpcGVyLnBhcmFtcy5zbGlkZXNPZmZzZXRCZWZvcmUgfHwgMDtcbiAgICAgIHdyYXBwZXJFbC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWChjYWxjKDUwJSAtICR7bWFyZ2lufXB4KSlgO1xuICAgIH1cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNsaWRlcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgY29uc3Qgc2xpZGVFbCA9IHNsaWRlc1tpXTtcbiAgICAgIGNvbnN0IHNsaWRlUHJvZ3Jlc3MgPSBzbGlkZUVsLnByb2dyZXNzO1xuICAgICAgY29uc3QgcHJvZ3Jlc3MgPSBNYXRoLm1pbihNYXRoLm1heChzbGlkZUVsLnByb2dyZXNzLCAtcGFyYW1zLmxpbWl0UHJvZ3Jlc3MpLCBwYXJhbXMubGltaXRQcm9ncmVzcyk7XG4gICAgICBsZXQgb3JpZ2luYWxQcm9ncmVzcyA9IHByb2dyZXNzO1xuICAgICAgaWYgKCFpc0NlbnRlcmVkU2xpZGVzKSB7XG4gICAgICAgIG9yaWdpbmFsUHJvZ3Jlc3MgPSBNYXRoLm1pbihNYXRoLm1heChzbGlkZUVsLm9yaWdpbmFsUHJvZ3Jlc3MsIC1wYXJhbXMubGltaXRQcm9ncmVzcyksIHBhcmFtcy5saW1pdFByb2dyZXNzKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG9mZnNldCA9IHNsaWRlRWwuc3dpcGVyU2xpZGVPZmZzZXQ7XG4gICAgICBjb25zdCB0ID0gW3N3aXBlci5wYXJhbXMuY3NzTW9kZSA/IC1vZmZzZXQgLSBzd2lwZXIudHJhbnNsYXRlIDogLW9mZnNldCwgMCwgMF07XG4gICAgICBjb25zdCByID0gWzAsIDAsIDBdO1xuICAgICAgbGV0IGN1c3RvbSA9IGZhbHNlO1xuICAgICAgaWYgKCFzd2lwZXIuaXNIb3Jpem9udGFsKCkpIHtcbiAgICAgICAgdFsxXSA9IHRbMF07XG4gICAgICAgIHRbMF0gPSAwO1xuICAgICAgfVxuICAgICAgbGV0IGRhdGEgPSB7XG4gICAgICAgIHRyYW5zbGF0ZTogWzAsIDAsIDBdLFxuICAgICAgICByb3RhdGU6IFswLCAwLCAwXSxcbiAgICAgICAgc2NhbGU6IDEsXG4gICAgICAgIG9wYWNpdHk6IDFcbiAgICAgIH07XG4gICAgICBpZiAocHJvZ3Jlc3MgPCAwKSB7XG4gICAgICAgIGRhdGEgPSBwYXJhbXMubmV4dDtcbiAgICAgICAgY3VzdG9tID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAocHJvZ3Jlc3MgPiAwKSB7XG4gICAgICAgIGRhdGEgPSBwYXJhbXMucHJldjtcbiAgICAgICAgY3VzdG9tID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIC8vIHNldCB0cmFuc2xhdGVcbiAgICAgIHQuZm9yRWFjaCgodmFsdWUsIGluZGV4KSA9PiB7XG4gICAgICAgIHRbaW5kZXhdID0gYGNhbGMoJHt2YWx1ZX1weCArICgke2dldFRyYW5zbGF0ZVZhbHVlKGRhdGEudHJhbnNsYXRlW2luZGV4XSl9ICogJHtNYXRoLmFicyhwcm9ncmVzcyAqIG11bHRpcGxpZXIpfSkpYDtcbiAgICAgIH0pO1xuICAgICAgLy8gc2V0IHJvdGF0ZXNcbiAgICAgIHIuZm9yRWFjaCgodmFsdWUsIGluZGV4KSA9PiB7XG4gICAgICAgIGxldCB2YWwgPSBkYXRhLnJvdGF0ZVtpbmRleF0gKiBNYXRoLmFicyhwcm9ncmVzcyAqIG11bHRpcGxpZXIpO1xuICAgICAgICBpZiAoc3dpcGVyLmJyb3dzZXIgJiYgc3dpcGVyLmJyb3dzZXIuaXNTYWZhcmkgJiYgTWF0aC5hYnModmFsKSAvIDkwICUgMiA9PT0gMSkge1xuICAgICAgICAgIHZhbCArPSAwLjAwMTtcbiAgICAgICAgfVxuICAgICAgICByW2luZGV4XSA9IHZhbDtcbiAgICAgIH0pO1xuICAgICAgc2xpZGVFbC5zdHlsZS56SW5kZXggPSAtTWF0aC5hYnMoTWF0aC5yb3VuZChzbGlkZVByb2dyZXNzKSkgKyBzbGlkZXMubGVuZ3RoO1xuICAgICAgY29uc3QgdHJhbnNsYXRlU3RyaW5nID0gdC5qb2luKCcsICcpO1xuICAgICAgY29uc3Qgcm90YXRlU3RyaW5nID0gYHJvdGF0ZVgoJHtyWzBdfWRlZykgcm90YXRlWSgke3JbMV19ZGVnKSByb3RhdGVaKCR7clsyXX1kZWcpYDtcbiAgICAgIGNvbnN0IHNjYWxlU3RyaW5nID0gb3JpZ2luYWxQcm9ncmVzcyA8IDAgPyBgc2NhbGUoJHsxICsgKDEgLSBkYXRhLnNjYWxlKSAqIG9yaWdpbmFsUHJvZ3Jlc3MgKiBtdWx0aXBsaWVyfSlgIDogYHNjYWxlKCR7MSAtICgxIC0gZGF0YS5zY2FsZSkgKiBvcmlnaW5hbFByb2dyZXNzICogbXVsdGlwbGllcn0pYDtcbiAgICAgIGNvbnN0IG9wYWNpdHlTdHJpbmcgPSBvcmlnaW5hbFByb2dyZXNzIDwgMCA/IDEgKyAoMSAtIGRhdGEub3BhY2l0eSkgKiBvcmlnaW5hbFByb2dyZXNzICogbXVsdGlwbGllciA6IDEgLSAoMSAtIGRhdGEub3BhY2l0eSkgKiBvcmlnaW5hbFByb2dyZXNzICogbXVsdGlwbGllcjtcbiAgICAgIGNvbnN0IHRyYW5zZm9ybSA9IGB0cmFuc2xhdGUzZCgke3RyYW5zbGF0ZVN0cmluZ30pICR7cm90YXRlU3RyaW5nfSAke3NjYWxlU3RyaW5nfWA7XG5cbiAgICAgIC8vIFNldCBzaGFkb3dzXG4gICAgICBpZiAoY3VzdG9tICYmIGRhdGEuc2hhZG93IHx8ICFjdXN0b20pIHtcbiAgICAgICAgbGV0IHNoYWRvd0VsID0gc2xpZGVFbC5xdWVyeVNlbGVjdG9yKCcuc3dpcGVyLXNsaWRlLXNoYWRvdycpO1xuICAgICAgICBpZiAoIXNoYWRvd0VsICYmIGRhdGEuc2hhZG93KSB7XG4gICAgICAgICAgc2hhZG93RWwgPSBjcmVhdGVTaGFkb3coJ2NyZWF0aXZlJywgc2xpZGVFbCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNoYWRvd0VsKSB7XG4gICAgICAgICAgY29uc3Qgc2hhZG93T3BhY2l0eSA9IHBhcmFtcy5zaGFkb3dQZXJQcm9ncmVzcyA/IHByb2dyZXNzICogKDEgLyBwYXJhbXMubGltaXRQcm9ncmVzcykgOiBwcm9ncmVzcztcbiAgICAgICAgICBzaGFkb3dFbC5zdHlsZS5vcGFjaXR5ID0gTWF0aC5taW4oTWF0aC5tYXgoTWF0aC5hYnMoc2hhZG93T3BhY2l0eSksIDApLCAxKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3QgdGFyZ2V0RWwgPSBlZmZlY3RUYXJnZXQocGFyYW1zLCBzbGlkZUVsKTtcbiAgICAgIHRhcmdldEVsLnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybTtcbiAgICAgIHRhcmdldEVsLnN0eWxlLm9wYWNpdHkgPSBvcGFjaXR5U3RyaW5nO1xuICAgICAgaWYgKGRhdGEub3JpZ2luKSB7XG4gICAgICAgIHRhcmdldEVsLnN0eWxlLnRyYW5zZm9ybU9yaWdpbiA9IGRhdGEub3JpZ2luO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgY29uc3Qgc2V0VHJhbnNpdGlvbiA9IGR1cmF0aW9uID0+IHtcbiAgICBjb25zdCB0cmFuc2Zvcm1FbGVtZW50cyA9IHN3aXBlci5zbGlkZXMubWFwKHNsaWRlRWwgPT4gZ2V0U2xpZGVUcmFuc2Zvcm1FbChzbGlkZUVsKSk7XG4gICAgdHJhbnNmb3JtRWxlbWVudHMuZm9yRWFjaChlbCA9PiB7XG4gICAgICBlbC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSBgJHtkdXJhdGlvbn1tc2A7XG4gICAgICBlbC5xdWVyeVNlbGVjdG9yQWxsKCcuc3dpcGVyLXNsaWRlLXNoYWRvdycpLmZvckVhY2goc2hhZG93RWwgPT4ge1xuICAgICAgICBzaGFkb3dFbC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSBgJHtkdXJhdGlvbn1tc2A7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBlZmZlY3RWaXJ0dWFsVHJhbnNpdGlvbkVuZCh7XG4gICAgICBzd2lwZXIsXG4gICAgICBkdXJhdGlvbixcbiAgICAgIHRyYW5zZm9ybUVsZW1lbnRzLFxuICAgICAgYWxsU2xpZGVzOiB0cnVlXG4gICAgfSk7XG4gIH07XG4gIGVmZmVjdEluaXQoe1xuICAgIGVmZmVjdDogJ2NyZWF0aXZlJyxcbiAgICBzd2lwZXIsXG4gICAgb24sXG4gICAgc2V0VHJhbnNsYXRlLFxuICAgIHNldFRyYW5zaXRpb24sXG4gICAgcGVyc3BlY3RpdmU6ICgpID0+IHN3aXBlci5wYXJhbXMuY3JlYXRpdmVFZmZlY3QucGVyc3BlY3RpdmUsXG4gICAgb3ZlcndyaXRlUGFyYW1zOiAoKSA9PiAoe1xuICAgICAgd2F0Y2hTbGlkZXNQcm9ncmVzczogdHJ1ZSxcbiAgICAgIHZpcnR1YWxUcmFuc2xhdGU6ICFzd2lwZXIucGFyYW1zLmNzc01vZGVcbiAgICB9KVxuICB9KTtcbn1cblxuZXhwb3J0IHsgRWZmZWN0Q3JlYXRpdmUgYXMgZGVmYXVsdCB9O1xuIiwiaW1wb3J0IHsgYyBhcyBjcmVhdGVTaGFkb3cgfSBmcm9tICcuLi9zaGFyZWQvY3JlYXRlLXNoYWRvdy5tanMnO1xuaW1wb3J0IHsgZSBhcyBlZmZlY3RJbml0IH0gZnJvbSAnLi4vc2hhcmVkL2VmZmVjdC1pbml0Lm1qcyc7XG5pbXBvcnQgeyBlIGFzIGVmZmVjdFRhcmdldCB9IGZyb20gJy4uL3NoYXJlZC9lZmZlY3QtdGFyZ2V0Lm1qcyc7XG5pbXBvcnQgeyBlIGFzIGVmZmVjdFZpcnR1YWxUcmFuc2l0aW9uRW5kIH0gZnJvbSAnLi4vc2hhcmVkL2VmZmVjdC12aXJ0dWFsLXRyYW5zaXRpb24tZW5kLm1qcyc7XG5pbXBvcnQgeyBsIGFzIGdldFNsaWRlVHJhbnNmb3JtRWwgfSBmcm9tICcuLi9zaGFyZWQvdXRpbHMubWpzJztcblxuZnVuY3Rpb24gRWZmZWN0Q2FyZHMoX3JlZikge1xuICBsZXQge1xuICAgIHN3aXBlcixcbiAgICBleHRlbmRQYXJhbXMsXG4gICAgb25cbiAgfSA9IF9yZWY7XG4gIGV4dGVuZFBhcmFtcyh7XG4gICAgY2FyZHNFZmZlY3Q6IHtcbiAgICAgIHNsaWRlU2hhZG93czogdHJ1ZSxcbiAgICAgIHJvdGF0ZTogdHJ1ZSxcbiAgICAgIHBlclNsaWRlUm90YXRlOiAyLFxuICAgICAgcGVyU2xpZGVPZmZzZXQ6IDhcbiAgICB9XG4gIH0pO1xuICBjb25zdCBzZXRUcmFuc2xhdGUgPSAoKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgc2xpZGVzLFxuICAgICAgYWN0aXZlSW5kZXgsXG4gICAgICBydGxUcmFuc2xhdGU6IHJ0bFxuICAgIH0gPSBzd2lwZXI7XG4gICAgY29uc3QgcGFyYW1zID0gc3dpcGVyLnBhcmFtcy5jYXJkc0VmZmVjdDtcbiAgICBjb25zdCB7XG4gICAgICBzdGFydFRyYW5zbGF0ZSxcbiAgICAgIGlzVG91Y2hlZFxuICAgIH0gPSBzd2lwZXIudG91Y2hFdmVudHNEYXRhO1xuICAgIGNvbnN0IGN1cnJlbnRUcmFuc2xhdGUgPSBydGwgPyAtc3dpcGVyLnRyYW5zbGF0ZSA6IHN3aXBlci50cmFuc2xhdGU7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzbGlkZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGNvbnN0IHNsaWRlRWwgPSBzbGlkZXNbaV07XG4gICAgICBjb25zdCBzbGlkZVByb2dyZXNzID0gc2xpZGVFbC5wcm9ncmVzcztcbiAgICAgIGNvbnN0IHByb2dyZXNzID0gTWF0aC5taW4oTWF0aC5tYXgoc2xpZGVQcm9ncmVzcywgLTQpLCA0KTtcbiAgICAgIGxldCBvZmZzZXQgPSBzbGlkZUVsLnN3aXBlclNsaWRlT2Zmc2V0O1xuICAgICAgaWYgKHN3aXBlci5wYXJhbXMuY2VudGVyZWRTbGlkZXMgJiYgIXN3aXBlci5wYXJhbXMuY3NzTW9kZSkge1xuICAgICAgICBzd2lwZXIud3JhcHBlckVsLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKCR7c3dpcGVyLm1pblRyYW5zbGF0ZSgpfXB4KWA7XG4gICAgICB9XG4gICAgICBpZiAoc3dpcGVyLnBhcmFtcy5jZW50ZXJlZFNsaWRlcyAmJiBzd2lwZXIucGFyYW1zLmNzc01vZGUpIHtcbiAgICAgICAgb2Zmc2V0IC09IHNsaWRlc1swXS5zd2lwZXJTbGlkZU9mZnNldDtcbiAgICAgIH1cbiAgICAgIGxldCB0WCA9IHN3aXBlci5wYXJhbXMuY3NzTW9kZSA/IC1vZmZzZXQgLSBzd2lwZXIudHJhbnNsYXRlIDogLW9mZnNldDtcbiAgICAgIGxldCB0WSA9IDA7XG4gICAgICBjb25zdCB0WiA9IC0xMDAgKiBNYXRoLmFicyhwcm9ncmVzcyk7XG4gICAgICBsZXQgc2NhbGUgPSAxO1xuICAgICAgbGV0IHJvdGF0ZSA9IC1wYXJhbXMucGVyU2xpZGVSb3RhdGUgKiBwcm9ncmVzcztcbiAgICAgIGxldCB0WEFkZCA9IHBhcmFtcy5wZXJTbGlkZU9mZnNldCAtIE1hdGguYWJzKHByb2dyZXNzKSAqIDAuNzU7XG4gICAgICBjb25zdCBzbGlkZUluZGV4ID0gc3dpcGVyLnZpcnR1YWwgJiYgc3dpcGVyLnBhcmFtcy52aXJ0dWFsLmVuYWJsZWQgPyBzd2lwZXIudmlydHVhbC5mcm9tICsgaSA6IGk7XG4gICAgICBjb25zdCBpc1N3aXBlVG9OZXh0ID0gKHNsaWRlSW5kZXggPT09IGFjdGl2ZUluZGV4IHx8IHNsaWRlSW5kZXggPT09IGFjdGl2ZUluZGV4IC0gMSkgJiYgcHJvZ3Jlc3MgPiAwICYmIHByb2dyZXNzIDwgMSAmJiAoaXNUb3VjaGVkIHx8IHN3aXBlci5wYXJhbXMuY3NzTW9kZSkgJiYgY3VycmVudFRyYW5zbGF0ZSA8IHN0YXJ0VHJhbnNsYXRlO1xuICAgICAgY29uc3QgaXNTd2lwZVRvUHJldiA9IChzbGlkZUluZGV4ID09PSBhY3RpdmVJbmRleCB8fCBzbGlkZUluZGV4ID09PSBhY3RpdmVJbmRleCArIDEpICYmIHByb2dyZXNzIDwgMCAmJiBwcm9ncmVzcyA+IC0xICYmIChpc1RvdWNoZWQgfHwgc3dpcGVyLnBhcmFtcy5jc3NNb2RlKSAmJiBjdXJyZW50VHJhbnNsYXRlID4gc3RhcnRUcmFuc2xhdGU7XG4gICAgICBpZiAoaXNTd2lwZVRvTmV4dCB8fCBpc1N3aXBlVG9QcmV2KSB7XG4gICAgICAgIGNvbnN0IHN1YlByb2dyZXNzID0gKDEgLSBNYXRoLmFicygoTWF0aC5hYnMocHJvZ3Jlc3MpIC0gMC41KSAvIDAuNSkpICoqIDAuNTtcbiAgICAgICAgcm90YXRlICs9IC0yOCAqIHByb2dyZXNzICogc3ViUHJvZ3Jlc3M7XG4gICAgICAgIHNjYWxlICs9IC0wLjUgKiBzdWJQcm9ncmVzcztcbiAgICAgICAgdFhBZGQgKz0gOTYgKiBzdWJQcm9ncmVzcztcbiAgICAgICAgdFkgPSBgJHstMjUgKiBzdWJQcm9ncmVzcyAqIE1hdGguYWJzKHByb2dyZXNzKX0lYDtcbiAgICAgIH1cbiAgICAgIGlmIChwcm9ncmVzcyA8IDApIHtcbiAgICAgICAgLy8gbmV4dFxuICAgICAgICB0WCA9IGBjYWxjKCR7dFh9cHggJHtydGwgPyAnLScgOiAnKyd9ICgke3RYQWRkICogTWF0aC5hYnMocHJvZ3Jlc3MpfSUpKWA7XG4gICAgICB9IGVsc2UgaWYgKHByb2dyZXNzID4gMCkge1xuICAgICAgICAvLyBwcmV2XG4gICAgICAgIHRYID0gYGNhbGMoJHt0WH1weCAke3J0bCA/ICctJyA6ICcrJ30gKC0ke3RYQWRkICogTWF0aC5hYnMocHJvZ3Jlc3MpfSUpKWA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0WCA9IGAke3RYfXB4YDtcbiAgICAgIH1cbiAgICAgIGlmICghc3dpcGVyLmlzSG9yaXpvbnRhbCgpKSB7XG4gICAgICAgIGNvbnN0IHByZXZZID0gdFk7XG4gICAgICAgIHRZID0gdFg7XG4gICAgICAgIHRYID0gcHJldlk7XG4gICAgICB9XG4gICAgICBjb25zdCBzY2FsZVN0cmluZyA9IHByb2dyZXNzIDwgMCA/IGAkezEgKyAoMSAtIHNjYWxlKSAqIHByb2dyZXNzfWAgOiBgJHsxIC0gKDEgLSBzY2FsZSkgKiBwcm9ncmVzc31gO1xuXG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZSAqL1xuICAgICAgY29uc3QgdHJhbnNmb3JtID0gYFxuICAgICAgICB0cmFuc2xhdGUzZCgke3RYfSwgJHt0WX0sICR7dFp9cHgpXG4gICAgICAgIHJvdGF0ZVooJHtwYXJhbXMucm90YXRlID8gcnRsID8gLXJvdGF0ZSA6IHJvdGF0ZSA6IDB9ZGVnKVxuICAgICAgICBzY2FsZSgke3NjYWxlU3RyaW5nfSlcbiAgICAgIGA7XG4gICAgICAvKiBlc2xpbnQtZW5hYmxlICovXG5cbiAgICAgIGlmIChwYXJhbXMuc2xpZGVTaGFkb3dzKSB7XG4gICAgICAgIC8vIFNldCBzaGFkb3dzXG4gICAgICAgIGxldCBzaGFkb3dFbCA9IHNsaWRlRWwucXVlcnlTZWxlY3RvcignLnN3aXBlci1zbGlkZS1zaGFkb3cnKTtcbiAgICAgICAgaWYgKCFzaGFkb3dFbCkge1xuICAgICAgICAgIHNoYWRvd0VsID0gY3JlYXRlU2hhZG93KCdjYXJkcycsIHNsaWRlRWwpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzaGFkb3dFbCkgc2hhZG93RWwuc3R5bGUub3BhY2l0eSA9IE1hdGgubWluKE1hdGgubWF4KChNYXRoLmFicyhwcm9ncmVzcykgLSAwLjUpIC8gMC41LCAwKSwgMSk7XG4gICAgICB9XG4gICAgICBzbGlkZUVsLnN0eWxlLnpJbmRleCA9IC1NYXRoLmFicyhNYXRoLnJvdW5kKHNsaWRlUHJvZ3Jlc3MpKSArIHNsaWRlcy5sZW5ndGg7XG4gICAgICBjb25zdCB0YXJnZXRFbCA9IGVmZmVjdFRhcmdldChwYXJhbXMsIHNsaWRlRWwpO1xuICAgICAgdGFyZ2V0RWwuc3R5bGUudHJhbnNmb3JtID0gdHJhbnNmb3JtO1xuICAgIH1cbiAgfTtcbiAgY29uc3Qgc2V0VHJhbnNpdGlvbiA9IGR1cmF0aW9uID0+IHtcbiAgICBjb25zdCB0cmFuc2Zvcm1FbGVtZW50cyA9IHN3aXBlci5zbGlkZXMubWFwKHNsaWRlRWwgPT4gZ2V0U2xpZGVUcmFuc2Zvcm1FbChzbGlkZUVsKSk7XG4gICAgdHJhbnNmb3JtRWxlbWVudHMuZm9yRWFjaChlbCA9PiB7XG4gICAgICBlbC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSBgJHtkdXJhdGlvbn1tc2A7XG4gICAgICBlbC5xdWVyeVNlbGVjdG9yQWxsKCcuc3dpcGVyLXNsaWRlLXNoYWRvdycpLmZvckVhY2goc2hhZG93RWwgPT4ge1xuICAgICAgICBzaGFkb3dFbC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSBgJHtkdXJhdGlvbn1tc2A7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBlZmZlY3RWaXJ0dWFsVHJhbnNpdGlvbkVuZCh7XG4gICAgICBzd2lwZXIsXG4gICAgICBkdXJhdGlvbixcbiAgICAgIHRyYW5zZm9ybUVsZW1lbnRzXG4gICAgfSk7XG4gIH07XG4gIGVmZmVjdEluaXQoe1xuICAgIGVmZmVjdDogJ2NhcmRzJyxcbiAgICBzd2lwZXIsXG4gICAgb24sXG4gICAgc2V0VHJhbnNsYXRlLFxuICAgIHNldFRyYW5zaXRpb24sXG4gICAgcGVyc3BlY3RpdmU6ICgpID0+IHRydWUsXG4gICAgb3ZlcndyaXRlUGFyYW1zOiAoKSA9PiAoe1xuICAgICAgd2F0Y2hTbGlkZXNQcm9ncmVzczogdHJ1ZSxcbiAgICAgIHZpcnR1YWxUcmFuc2xhdGU6ICFzd2lwZXIucGFyYW1zLmNzc01vZGVcbiAgICB9KVxuICB9KTtcbn1cblxuZXhwb3J0IHsgRWZmZWN0Q2FyZHMgYXMgZGVmYXVsdCB9O1xuIiwiLyoqXG4gKiBTd2lwZXIgMTEuMC41XG4gKiBNb3N0IG1vZGVybiBtb2JpbGUgdG91Y2ggc2xpZGVyIGFuZCBmcmFtZXdvcmsgd2l0aCBoYXJkd2FyZSBhY2NlbGVyYXRlZCB0cmFuc2l0aW9uc1xuICogaHR0cHM6Ly9zd2lwZXJqcy5jb21cbiAqXG4gKiBDb3B5cmlnaHQgMjAxNC0yMDIzIFZsYWRpbWlyIEtoYXJsYW1waWRpXG4gKlxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlXG4gKlxuICogUmVsZWFzZWQgb246IE5vdmVtYmVyIDIyLCAyMDIzXG4gKi9cblxuaW1wb3J0IHsgUyBhcyBTd2lwZXIgfSBmcm9tICcuL3NoYXJlZC9zd2lwZXItY29yZS5tanMnO1xuaW1wb3J0IFZpcnR1YWwgZnJvbSAnLi9tb2R1bGVzL3ZpcnR1YWwubWpzJztcbmltcG9ydCBLZXlib2FyZCBmcm9tICcuL21vZHVsZXMva2V5Ym9hcmQubWpzJztcbmltcG9ydCBNb3VzZXdoZWVsIGZyb20gJy4vbW9kdWxlcy9tb3VzZXdoZWVsLm1qcyc7XG5pbXBvcnQgTmF2aWdhdGlvbiBmcm9tICcuL21vZHVsZXMvbmF2aWdhdGlvbi5tanMnO1xuaW1wb3J0IFBhZ2luYXRpb24gZnJvbSAnLi9tb2R1bGVzL3BhZ2luYXRpb24ubWpzJztcbmltcG9ydCBTY3JvbGxiYXIgZnJvbSAnLi9tb2R1bGVzL3Njcm9sbGJhci5tanMnO1xuaW1wb3J0IFBhcmFsbGF4IGZyb20gJy4vbW9kdWxlcy9wYXJhbGxheC5tanMnO1xuaW1wb3J0IFpvb20gZnJvbSAnLi9tb2R1bGVzL3pvb20ubWpzJztcbmltcG9ydCBDb250cm9sbGVyIGZyb20gJy4vbW9kdWxlcy9jb250cm9sbGVyLm1qcyc7XG5pbXBvcnQgQTExeSBmcm9tICcuL21vZHVsZXMvYTExeS5tanMnO1xuaW1wb3J0IEhpc3RvcnkgZnJvbSAnLi9tb2R1bGVzL2hpc3RvcnkubWpzJztcbmltcG9ydCBIYXNoTmF2aWdhdGlvbiBmcm9tICcuL21vZHVsZXMvaGFzaC1uYXZpZ2F0aW9uLm1qcyc7XG5pbXBvcnQgQXV0b3BsYXkgZnJvbSAnLi9tb2R1bGVzL2F1dG9wbGF5Lm1qcyc7XG5pbXBvcnQgVGh1bWIgZnJvbSAnLi9tb2R1bGVzL3RodW1icy5tanMnO1xuaW1wb3J0IGZyZWVNb2RlIGZyb20gJy4vbW9kdWxlcy9mcmVlLW1vZGUubWpzJztcbmltcG9ydCBHcmlkIGZyb20gJy4vbW9kdWxlcy9ncmlkLm1qcyc7XG5pbXBvcnQgTWFuaXB1bGF0aW9uIGZyb20gJy4vbW9kdWxlcy9tYW5pcHVsYXRpb24ubWpzJztcbmltcG9ydCBFZmZlY3RGYWRlIGZyb20gJy4vbW9kdWxlcy9lZmZlY3QtZmFkZS5tanMnO1xuaW1wb3J0IEVmZmVjdEN1YmUgZnJvbSAnLi9tb2R1bGVzL2VmZmVjdC1jdWJlLm1qcyc7XG5pbXBvcnQgRWZmZWN0RmxpcCBmcm9tICcuL21vZHVsZXMvZWZmZWN0LWZsaXAubWpzJztcbmltcG9ydCBFZmZlY3RDb3ZlcmZsb3cgZnJvbSAnLi9tb2R1bGVzL2VmZmVjdC1jb3ZlcmZsb3cubWpzJztcbmltcG9ydCBFZmZlY3RDcmVhdGl2ZSBmcm9tICcuL21vZHVsZXMvZWZmZWN0LWNyZWF0aXZlLm1qcyc7XG5pbXBvcnQgRWZmZWN0Q2FyZHMgZnJvbSAnLi9tb2R1bGVzL2VmZmVjdC1jYXJkcy5tanMnO1xuXG4vLyBTd2lwZXIgQ2xhc3NcbmNvbnN0IG1vZHVsZXMgPSBbVmlydHVhbCwgS2V5Ym9hcmQsIE1vdXNld2hlZWwsIE5hdmlnYXRpb24sIFBhZ2luYXRpb24sIFNjcm9sbGJhciwgUGFyYWxsYXgsIFpvb20sIENvbnRyb2xsZXIsIEExMXksIEhpc3RvcnksIEhhc2hOYXZpZ2F0aW9uLCBBdXRvcGxheSwgVGh1bWIsIGZyZWVNb2RlLCBHcmlkLCBNYW5pcHVsYXRpb24sIEVmZmVjdEZhZGUsIEVmZmVjdEN1YmUsIEVmZmVjdEZsaXAsIEVmZmVjdENvdmVyZmxvdywgRWZmZWN0Q3JlYXRpdmUsIEVmZmVjdENhcmRzXTtcblN3aXBlci51c2UobW9kdWxlcyk7XG5cbmV4cG9ydCB7IFN3aXBlciwgU3dpcGVyIGFzIGRlZmF1bHQgfTtcbiIsImltcG9ydCBTd2lwZXIgZnJvbSAnc3dpcGVyL2J1bmRsZSc7XHJcbmltcG9ydCAnc3dpcGVyL2Nzcy9idW5kbGUnO1xyXG5cclxuY29uc3QgYWJvdXRTd2lwZXIgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBzd2lwZXIgPSBuZXcgU3dpcGVyKCcuYWJvdXRfX3N3aXBlcicsIHtcclxuICAgICAgICBzbGlkZXNQZXJWaWV3OiAxLFxyXG4gICAgICAgIHNwYWNlQmV0d2VlbjogMzAsXHJcbiAgICAgICAgLy8gbG9vcDogdHJ1ZSxcclxuICAgICAgICBuYXZpZ2F0aW9uOiB7XHJcbiAgICAgICAgICAgIG5leHRFbDogJy5hYm91dF9fc3dpcGVyLWJ0bi1uZXh0JyxcclxuICAgICAgICAgICAgcHJldkVsOiAnLmFib3V0X19zd2lwZXItYnRuLXByZXYnLFxyXG4gICAgICAgIH0sXHJcbiAgICB9KTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGFib3V0U3dpcGVyO1xyXG4iLCJpbXBvcnQgU3dpcGVyIGZyb20gJ3N3aXBlci9idW5kbGUnO1xyXG5pbXBvcnQgJ3N3aXBlci9jc3MvYnVuZGxlJztcclxuXHJcbmNvbnN0IGFydGlzdHNTd2lwZXIgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBzd2lwZXJfdGV4dCA9IG5ldyBTd2lwZXIoJy5hcnRpc3RzX19zd2lwZXItdGl0bGUnLCB7XHJcbiAgICAgICAgYWxsb3dUb3VjaE1vdmU6IGZhbHNlLFxyXG4gICAgICAgIGVmZmVjdDogJ2ZhZGUnLFxyXG4gICAgICAgIGZhZGVFZmZlY3Q6IHtcclxuICAgICAgICAgICAgY3Jvc3NGYWRlOiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3Qgc3dpcGVyX21haW4gPSBuZXcgU3dpcGVyKCcuYXJ0aXN0c19fc3dpcGVyLXBob3RvJywge1xyXG4gICAgICAgIHNsaWRlc1BlclZpZXc6J2F1dG8nLFxyXG5cclxuICAgICAgICBlZmZlY3Q6ICdjb3ZlcmZsb3cnLFxyXG4gICAgICAgIGdyYWJDdXJzb3I6IHRydWUsXHJcbiAgICAgICAgY2VudGVyZWRTbGlkZXM6IHRydWUsXHJcbiAgICAgICAgY292ZXJmbG93RWZmZWN0OiB7XHJcbiAgICAgICAgICAgIHJvdGF0ZTogMCxcclxuICAgICAgICAgICAgc3RyZXRjaDogNTAsXHJcbiAgICAgICAgICAgIGRlcHRoOiA2MDAsXHJcbiAgICAgICAgICAgIG1vZGlmaWVyOiAxLjUsXHJcbiAgICAgICAgICAgIHNsaWRlU2hhZG93czogZmFsc2UsXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgbmF2aWdhdGlvbjoge1xyXG4gICAgICAgICAgICBuZXh0RWw6IFwiLmFydGlzdGlzX19zd2lwZXItbmF2LWJ0bi0tbmV4dFwiLFxyXG4gICAgICAgICAgICBwcmV2RWw6IFwiLmFydGlzdGlzX19zd2lwZXItbmF2LWJ0bi0tcHJldlwiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdGh1bWJzOiB7XHJcbiAgICAgICAgICAgIHN3aXBlcjogc3dpcGVyX3RleHQgXHJcbiAgICAgICAgfSxcclxuICAgICAgICBicmVha3BvaW50czoge1xyXG4gICAgICAgICAgICAvLyB3aGVuIHdpbmRvdyB3aWR0aCBpcyA+PSAzMjBweFxyXG4gICAgICAgICAgICA3Njg6IHtcclxuICAgICAgICAgICAgICAgIGNvdmVyZmxvd0VmZmVjdDoge1xyXG4gICAgICAgICAgICAgICAgICAgIHJvdGF0ZTogMCxcclxuICAgICAgICAgICAgICAgICAgICBzdHJldGNoOiA0NSxcclxuICAgICAgICAgICAgICAgICAgICBkZXB0aDogMzAwLFxyXG4gICAgICAgICAgICAgICAgICAgIG1vZGlmaWVyOiAxLjUsXHJcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVTaGFkb3dzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH19XHJcbiAgICB9KTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGFydGlzdHNTd2lwZXI7XHJcbiIsImltcG9ydCBTd2lwZXIgZnJvbSAnc3dpcGVyL2J1bmRsZSc7XHJcbmltcG9ydCAnc3dpcGVyL2Nzcy9idW5kbGUnO1xyXG5cclxuXHJcbmNvbnN0IHJlbGVhc2VTd2lwZXIgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBzd2lwZXIgPSBuZXcgU3dpcGVyKCcucmVsZWFzZV9fc3dpcGVyJywge1xyXG4gICAgICAgIHNsaWRlc1BlclZpZXc6ICdhdXRvJyxcclxuICAgIFxyXG4gICAgICAgIC8vIGxvb3A6IHRydWUsXHJcblxyXG4gICAgICAgIGVmZmVjdDogJ2NvdmVyZmxvdycsXHJcbiAgICAgICAgZ3JhYkN1cnNvcjogdHJ1ZSxcclxuICAgICAgICBjZW50ZXJlZFNsaWRlczogdHJ1ZSxcclxuICAgICAgICBjb3ZlcmZsb3dFZmZlY3Q6IHtcclxuICAgICAgICAgICAgcm90YXRlOiAwLFxyXG4gICAgICAgICAgICBzdHJldGNoOiA0NSxcclxuICAgICAgICAgICAgZGVwdGg6IDMzMCxcclxuICAgICAgICAgICAgbW9kaWZpZXI6IDEuNSxcclxuICAgICAgICAgICAgc2xpZGVTaGFkb3dzOiBmYWxzZSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIG5hdmlnYXRpb246IHtcclxuICAgICAgICAgICAgbmV4dEVsOiAnLnJlbGVhc2VfX3N3aXBlci1uYXYtYnRuLS1uZXh0JyxcclxuICAgICAgICAgICAgcHJldkVsOiAnLnJlbGVhc2VfX3N3aXBlci1uYXYtYnRuLS1wcmV2JyxcclxuICAgICAgICB9LFxyXG4gICAgfSk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCByZWxlYXNlU3dpcGVyOyIsImNvbnN0IGJ1cmdlciA9ICgpID0+IHtcclxuICAgIGNvbnN0IGJ1cmdlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idXJnZXInKTtcclxuICAgIGNvbnN0IG5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX25hdi13cmFwcGVyJyk7XHJcbiAgICBjb25zdCBvdmVybGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm92ZXJsYXknKTtcclxuXHJcbiAgICBjb25zdCBnZXRTY3JvbGxiYXJXaWR0aCA9ICgpID0+IHdpbmRvdy5pbm5lcldpZHRoIC0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoO1xyXG5cclxuICAgIGZ1bmN0aW9uIG9wZW5CdXJnZXIoKSB7XHJcbiAgICAgICAgbGV0IHNjcm9sbFdpdGggPSBnZXRTY3JvbGxiYXJXaWR0aCgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcclxuICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnBhZGRpbmdSaWdodCA9IGAke3Njcm9sbFdpdGh9cHhgO1xyXG5cclxuICAgICAgICBidXJnZXIuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcbiAgICAgICAgYnVyZ2VyLnN0eWxlLnBhZGRpbmdSaWdodCA9IGAke3Njcm9sbFdpdGh9cHhgO1xyXG5cclxuICAgICAgICBuYXYuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcbiAgICAgICAgb3ZlcmxheS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjbG9zZUJ1cmdlcigpIHtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJyc7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5wYWRkaW5nUmlnaHQgPSAnJztcclxuXHJcbiAgICAgICAgYnVyZ2VyLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG4gICAgICAgIGJ1cmdlci5zdHlsZS5wYWRkaW5nUmlnaHQgPSBgYDtcclxuXHJcbiAgICAgICAgbmF2LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG4gICAgICAgIG92ZXJsYXkuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcbiAgICB9XHJcblxyXG4gICAgYnVyZ2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgIGJ1cmdlci5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpID8gY2xvc2VCdXJnZXIoKSA6IG9wZW5CdXJnZXIoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIG92ZXJsYXkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG4gICAgICAgIGlmIChlLnRhcmdldCA9PT0gb3ZlcmxheSkge1xyXG4gICAgICAgICAgICBjbG9zZUJ1cmdlcigpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIG5hdi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICAgICAgaWYgKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnaGVhZGVyLXRvcF9fbmF2LWxpbmsnKSkge1xyXG4gICAgICAgICAgICBjbG9zZUJ1cmdlcigpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgYnVyZ2VyOyIsIlxyXG5jb25zdCBmYXEgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBhY2NvcmRpb25JdGVtSGVhZGVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5mYXFfX2FjY29yZGlvbi1pdGVtLWhlYWRlcicpO1xyXG5cclxuICAgIGFjY29yZGlvbkl0ZW1IZWFkZXJzLmZvckVhY2goKGFjY29yZGlvbkl0ZW1IZWFkZXIpID0+IHtcclxuICAgIGFjY29yZGlvbkl0ZW1IZWFkZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgY3VycmVudGx5QWN0aXZlQWNjb3JkaW9uSXRlbUhlYWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mYXFfX2FjY29yZGlvbi1pdGVtLWhlYWRlci5hY3RpdmUnKTtcclxuICAgICAgICBpZiAoY3VycmVudGx5QWN0aXZlQWNjb3JkaW9uSXRlbUhlYWRlciAmJiBjdXJyZW50bHlBY3RpdmVBY2NvcmRpb25JdGVtSGVhZGVyICE9PSBhY2NvcmRpb25JdGVtSGVhZGVyKSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRseUFjdGl2ZUFjY29yZGlvbkl0ZW1IZWFkZXIuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIGN1cnJlbnRseUFjdGl2ZUFjY29yZGlvbkl0ZW1IZWFkZXIubmV4dEVsZW1lbnRTaWJsaW5nLnN0eWxlLm1heEhlaWdodCA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGFjY29yZGlvbkl0ZW1IZWFkZXIuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XHJcbiAgICAgICAgY29uc3QgYWNjb3JkaW9uSXRlbUJvZHkgPSBhY2NvcmRpb25JdGVtSGVhZGVyLm5leHRFbGVtZW50U2libGluZztcclxuICAgICAgICBpZiAoYWNjb3JkaW9uSXRlbUhlYWRlci5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XHJcbiAgICAgICAgICAgIGFjY29yZGlvbkl0ZW1Cb2R5LnN0eWxlLm1heEhlaWdodCA9IGFjY29yZGlvbkl0ZW1Cb2R5LnNjcm9sbEhlaWdodCArICdweCc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYWNjb3JkaW9uSXRlbUJvZHkuc3R5bGUubWF4SGVpZ2h0ID0gMDtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbn0pO1xyXG5cclxuXHJcblxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZhcTsiLCJjb25zdCBoZWFkZXIgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBuYXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyJyk7XHJcbiAgICBjb25zdCBuYXZPZmZzZXRUb3AgPSBuYXYub2Zmc2V0VG9wO1xyXG5cclxuICAgIGZ1bmN0aW9uIGhhbmRsZVNjcm9sbCgpIHtcclxuICAgICAgICBpZiAod2luZG93LmlubmVyV2lkdGggPiA3NjgpIHtcclxuICAgICAgICAgICAgaWYgKHdpbmRvdy5zY3JvbGxZID4gbmF2T2Zmc2V0VG9wKSB7XHJcbiAgICAgICAgICAgICAgICBuYXYuY2xhc3NMaXN0LmFkZCgnZml4ZWQtbmF2Jyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBuYXYuY2xhc3NMaXN0LnJlbW92ZSgnZml4ZWQtbmF2Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgaGFuZGxlU2Nyb2xsKTtcclxuICAgIC8vINCY0L3QuNGG0LjQsNC70LjQt9C40YDRg9C10Lwg0L7QsdGA0LDQsdC+0YLRh9C40Log0YHQutGA0L7Qu9C70LAg0L/RgNC4INC30LDQs9GA0YPQt9C60LUg0YHRgtGA0LDQvdC40YbRi1xyXG4gICAgaGFuZGxlU2Nyb2xsKCk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBoZWFkZXI7XHJcbiIsImltcG9ydCAnLi9pbmRleC5zY3NzJztcbmltcG9ydCBhYm91dFN3aXBlciBmcm9tICcuL2pzL2NvbXBvbmVudHMvYWJvdXRTd2lwZXInO1xuaW1wb3J0IGFydGlzdHNTd2lwZXIgZnJvbSAnLi9qcy9jb21wb25lbnRzL2FydGlzdHNTd2lwZXInO1xuaW1wb3J0IHJlbGVhc2VTd2lwZXIgZnJvbSAnLi9qcy9jb21wb25lbnRzL3JlbGVhc2VTd2lwZXInO1xuaW1wb3J0IGJ1cmdlciBmcm9tICcuL2pzL2NvbXBvbmVudHMvYnVyZ2VyJztcblxuaW1wb3J0IGZhcSBmcm9tICcuL2pzL2NvbXBvbmVudHMvZmFxJztcbmltcG9ydCBoZWFkZXIgZnJvbSAnLi9qcy9jb21wb25lbnRzL2hlYWRlcic7XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICAgIGhlYWRlcigpO1xuICAgIH0gY2F0Y2gge31cbiAgICB0cnkge1xuICAgICAgICBmYXEoKTtcbiAgICB9IGNhdGNoIHt9XG4gICAgdHJ5IHtcbiAgICAgICAgYWJvdXRTd2lwZXIoKTtcbiAgICB9IGNhdGNoIHt9XG4gICAgdHJ5IHtcbiAgICAgICAgYXJ0aXN0c1N3aXBlcigpO1xuICAgIH0gY2F0Y2gge31cbiAgICB0cnkge1xuICAgICAgICByZWxlYXNlU3dpcGVyKCk7XG4gICAgfSBjYXRjaCB7fVxuICAgIHRyeSB7XG4gICAgICAgIGJ1cmdlcigpO1xuICAgIH0gY2F0Y2gge31cbn0pO1xuIl0sIm5hbWVzIjpbIlN3aXBlciIsImFib3V0U3dpcGVyIiwic3dpcGVyIiwic2xpZGVzUGVyVmlldyIsInNwYWNlQmV0d2VlbiIsIm5hdmlnYXRpb24iLCJuZXh0RWwiLCJwcmV2RWwiLCJhcnRpc3RzU3dpcGVyIiwic3dpcGVyX3RleHQiLCJhbGxvd1RvdWNoTW92ZSIsImVmZmVjdCIsImZhZGVFZmZlY3QiLCJjcm9zc0ZhZGUiLCJzd2lwZXJfbWFpbiIsImdyYWJDdXJzb3IiLCJjZW50ZXJlZFNsaWRlcyIsImNvdmVyZmxvd0VmZmVjdCIsInJvdGF0ZSIsInN0cmV0Y2giLCJkZXB0aCIsIm1vZGlmaWVyIiwic2xpZGVTaGFkb3dzIiwidGh1bWJzIiwiYnJlYWtwb2ludHMiLCJyZWxlYXNlU3dpcGVyIiwiYnVyZ2VyIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwibmF2Iiwib3ZlcmxheSIsImdldFNjcm9sbGJhcldpZHRoIiwid2luZG93IiwiaW5uZXJXaWR0aCIsImRvY3VtZW50RWxlbWVudCIsImNsaWVudFdpZHRoIiwib3BlbkJ1cmdlciIsInNjcm9sbFdpdGgiLCJib2R5Iiwic3R5bGUiLCJvdmVyZmxvdyIsInBhZGRpbmdSaWdodCIsImNsYXNzTGlzdCIsImFkZCIsImNsb3NlQnVyZ2VyIiwicmVtb3ZlIiwiYWRkRXZlbnRMaXN0ZW5lciIsImNvbnRhaW5zIiwiZSIsInRhcmdldCIsImZhcSIsImFjY29yZGlvbkl0ZW1IZWFkZXJzIiwicXVlcnlTZWxlY3RvckFsbCIsImZvckVhY2giLCJhY2NvcmRpb25JdGVtSGVhZGVyIiwiY3VycmVudGx5QWN0aXZlQWNjb3JkaW9uSXRlbUhlYWRlciIsInRvZ2dsZSIsIm5leHRFbGVtZW50U2libGluZyIsIm1heEhlaWdodCIsImFjY29yZGlvbkl0ZW1Cb2R5Iiwic2Nyb2xsSGVpZ2h0IiwiaGVhZGVyIiwibmF2T2Zmc2V0VG9wIiwib2Zmc2V0VG9wIiwiaGFuZGxlU2Nyb2xsIiwic2Nyb2xsWSJdLCJzb3VyY2VSb290IjoiIn0=