/*!
  * sparklines.js v1.0.0
  * (c) 2014 - 2019 李梦龙
  * Released under the MIT License.
*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.Sparklines = {}));
}(this, (function (exports) { 'use strict';

  /** @format */
  var type = function (thing) {
      return Object.prototype.toString.call(thing);
  };
  var isNumber = function (thing) {
      return type(thing) === '[object Number]';
  };
  var isString = function (thing) {
      return type(thing) === '[object String]';
  };
  var isArray = function (thing) {
      return type(thing) === '[object Array]';
  };
  var isFunction = function (thing) {
      return type(thing) === '[object Function]';
  };

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0

  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.

  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */

  var __assign = function() {
      __assign = Object.assign || function __assign(t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
              s = arguments[i];
              for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
      };
      return __assign.apply(this, arguments);
  };

  /** @format */
  var styleDefault = {
      lineColor: '#096dd9',
      fillColor: '#bae7ff',
      lineWidth: 1,
  };
  // 公共的参数
  var optionsDefault = __assign({ width: 'auto', height: 'auto', type: 'line', values: [], disableInteraction: false, padding: 0, 
      // line params start
      defaultPixelsPerValue: 3, spotRadius: 1, spotColor: '#f5222d', highlightSpotColor: '#5f5', highlightLineColor: '#f22', minSpotColor: '#f5222d', maxSpotColor: '#f5222d', 
      // line params end
      // bar params start
      barColor: '#f5222d', negBarColor: '#52c41a', barWidth: 4, barSpacing: 1, zeroColor: '#bfbfbf', zeroAxis: true, 
      // bar params end
      // pie params start
      offset: 0, sliceColors: [
          '#fa8c16',
          '#a0d911',
          '#eb2f96',
          '#1890ff',
          '#f5222d',
          '#faad14',
          '#52c41a',
          '#2f54eb',
          '#fa541c',
          '#fadb14',
          '#13c2c2',
          '#722ed1',
      ], borderWidth: 0, borderColor: '#000' }, styleDefault);
  // 点
  var PointEnum;
  (function (PointEnum) {
      PointEnum[PointEnum["START_POINT"] = 0] = "START_POINT";
      PointEnum[PointEnum["END_POINT"] = 1] = "END_POINT";
  })(PointEnum || (PointEnum = {}));
  var TypeEnum;
  (function (TypeEnum) {
      TypeEnum["LINE"] = "line";
      TypeEnum["BAR"] = "bar";
      TypeEnum["PIE"] = "pie";
  })(TypeEnum || (TypeEnum = {}));

  /** @format */
  var hasOwn = function (item, attr) {
      return Object.prototype.hasOwnProperty.call(item, attr);
  };
  var keys = Object.keys;

  /**
   * @format
   */
  /**
   * 获取样式
   *
   * @param {Object} ele 获取样式的元素
   * @returns {Object} style 对象
   */
  var getStyle = function (ele) {
      var style = null;
      var getCss = window.getComputedStyle;
      if (isFunction(getStyle)) {
          style = getCss(ele, null);
      }
      else {
          style = ele.currentStyle;
      }
      return style;
  };
  // 深度克隆
  var cloneDeep = function (obj1, obj2) {
      var newObj = {};
      keys(obj1).forEach(function (obj1Key) {
          if (hasOwn(obj2, obj1Key)) {
              if (isArray(obj2[obj1Key])) {
                  newObj[obj1Key] = obj2[obj1Key].slice();
              }
              else {
                  newObj[obj1Key] = obj2[obj1Key];
              }
          }
          else {
              newObj[obj1Key] = obj1[obj1Key];
          }
      });
      return newObj;
  };

  /** @format */
  var css = function ($el, params) {
      if (isString(params)) {
          return getStyle($el)[params];
      }
      Object.keys(params).forEach(function (paramsKey) {
          $el.style[paramsKey] = params[paramsKey];
      });
      return '';
  };

  /** @format */
  // 计算尺寸
  var calculateanvasSize = function ($el, options, isInit) {
      if (options === void 0) { options = optionsDefault; }
      var width = options.width, height = options.height, defaultPixelsPerValue = options.defaultPixelsPerValue, values = options.values, type = options.type, barWidth = options.barWidth, barSpacing = options.barSpacing, padding = options.padding;
      var isAutoWidth = width === 'auto';
      var isBar = type === TypeEnum.BAR;
      var isPie = type === TypeEnum.PIE;
      var stepWidth = isBar ? barWidth + barSpacing : defaultPixelsPerValue;
      var canvasWidth = isAutoWidth ? values.length * stepWidth : Number(width);
      var tmp = null;
      var canvasHeight = height;
      if (isBar) {
          canvasWidth += padding * 2;
      }
      if (isInit) {
          $el.innerHTML = '';
      }
      if (height === 'auto') {
          // must be a better way to get the line height
          tmp = document.createElement('span');
          tmp.innerHTML = 'a';
          css(tmp, {
              display: 'block',
          });
          $el.appendChild(tmp);
          canvasHeight = css(tmp, 'height');
          $el.removeChild(tmp);
          tmp = null;
      }
      if (isPie) {
          canvasWidth = parseFloat(canvasHeight);
      }
      return {
          canvasWidth: Number(canvasWidth),
          canvasHeight: parseFloat(canvasHeight),
      };
  };
  var CanvasSizeEnum;
  (function (CanvasSizeEnum) {
      CanvasSizeEnum[CanvasSizeEnum["SIZE"] = 0] = "SIZE";
  })(CanvasSizeEnum || (CanvasSizeEnum = {}));
  // 计算画布尺寸
  var calculatePixelDims = function (canvas, width, height) {
      var pxregex = /(\d+)(px)?\s*$/i;
      // XXX This should probably be a configurable option
      var match = pxregex.exec(height);
      var pixelWidth = '0';
      var pixelHeight = '0';
      if (match) {
          pixelHeight = match[CanvasSizeEnum.SIZE];
      }
      else {
          pixelHeight = css(canvas, 'height');
      }
      match = pxregex.exec(width);
      if (match) {
          pixelWidth = match[CanvasSizeEnum.SIZE];
      }
      else {
          pixelWidth = css(canvas, 'width');
      }
      return {
          pixelWidth: pixelWidth,
          pixelHeight: pixelHeight,
      };
  };
  // 创建 canvas
  var createCanvas = function ($el, options) {
      if (options === void 0) { options = optionsDefault; }
      var canvas = document.createElement('canvas');
      var _a = calculateanvasSize($el, options, true), canvasWidth = _a.canvasWidth, canvasHeight = _a.canvasHeight;
      $el.appendChild(canvas);
      var canvasSize = calculatePixelDims(canvas, String(canvasWidth), String(canvasHeight));
      canvas.width = canvasSize.pixelWidth;
      canvas.height = canvasSize.pixelHeight;
      css(canvas, {
          display: 'inline-block',
          position: 'relative',
          overflow: 'hidden',
          width: canvasWidth + "px",
          height: canvasHeight + "px",
          margin: '0px',
          padding: '0px',
          verticalAlign: 'top',
      });
      return canvas;
  };
  // 获取上下文
  var getContext = function (canvas, options) {
      if (options === void 0) { options = styleDefault; }
      var ctx = canvas.getContext('2d');
      var lineColor = options.lineColor, fillColor = options.fillColor, lineWidth = options.lineWidth;
      ctx.strokeStyle = lineColor;
      ctx.fillStyle = fillColor;
      ctx.lineWidth = lineWidth;
      return ctx;
  };
  var drawShapeCore = function (_a) {
      var canvas = _a.canvas, path = _a.path, lineColor = _a.lineColor, fillColor = _a.fillColor, lineWidth = _a.lineWidth;
      var context = getContext(canvas, {
          lineColor: lineColor,
          fillColor: fillColor,
          lineWidth: lineWidth,
      });
      var POINT_STEP = 0.5;
      context.beginPath();
      context.moveTo(path[0][PointEnum.START_POINT] + POINT_STEP, path[0][PointEnum.END_POINT] + POINT_STEP);
      path.forEach(function (pItem) {
          context.lineTo(pItem[PointEnum.START_POINT] + POINT_STEP, pItem[PointEnum.END_POINT] + POINT_STEP); // the 0.5 offset gives us crisp pixel-width lines
      });
      if (lineColor !== '') {
          context.stroke();
      }
      if (fillColor !== '') {
          context.fill();
      }
  };
  // 绘制圆
  var drawCircleCore = function (_a) {
      var canvas = _a.canvas, x = _a.x, y = _a.y, radius = _a.radius, lineColor = _a.lineColor, fillColor = _a.fillColor, lineWidth = _a.lineWidth;
      var context = getContext(canvas, {
          lineColor: lineColor,
          fillColor: fillColor,
          lineWidth: lineWidth,
      });
      context.beginPath();
      context.arc(x, y, radius, 0, 2 * Math.PI, false);
      if (isString(lineColor) && lineColor !== '') {
          context.stroke();
      }
      if (isString(fillColor) && fillColor !== '') {
          context.fill();
      }
  };
  // 饼
  var drawPieSliceCore = function (_a) {
      var canvas = _a.canvas, x = _a.x, y = _a.y, radius = _a.radius, startAngle = _a.startAngle, endAngle = _a.endAngle, lineColor = _a.lineColor, fillColor = _a.fillColor;
      var context = getContext(canvas, {
          lineColor: lineColor,
          fillColor: fillColor,
          lineWidth: 1,
      });
      context.beginPath();
      context.moveTo(x, y);
      context.arc(x, y, radius, startAngle, endAngle, false);
      context.lineTo(x, y);
      context.closePath();
      if (isString(lineColor) && lineColor !== '') {
          context.stroke();
      }
      if (isString(fillColor) && fillColor !== '') {
          context.fill();
      }
  };
  // let shapeCount = 0;
  var genShape = function (shapetype, params) {
      if (shapetype === 'Shape') {
          drawShapeCore(params);
      }
      if (shapetype === 'Circle') {
          drawCircleCore(params);
      }
      if (shapetype === 'Rect') {
          drawShapeCore(params);
      }
      if (shapetype === 'PieSlice') {
          drawPieSliceCore(params);
      }
  };
  var drawRect = function (params) {
      genShape('Rect', params);
  };
  var drawShape = function (params) {
      genShape('Shape', params);
  };
  var drawCircle = function (params) {
      genShape('Circle', params);
  };
  var drawPieSlice = function (params) {
      genShape('PieSlice', params);
  };

  /** @format */
  // 处理 values
  var scanValues = function (values) {
      var xValues = [];
      var yValues = [];
      var yminmax = [];
      values.forEach(function (val, valIdx) {
          xValues.push(valIdx);
          if (isNumber(val)) {
              yValues.push(Number(val));
              yminmax.push(Number(val));
          }
          else {
              yValues.push(0);
          }
      });
      var maxX = Math.max.apply(Math, xValues);
      var minX = Math.min.apply(Math, xValues);
      var maxYOrg = Math.max.apply(Math, yminmax);
      var maxY = maxYOrg;
      var minYOrg = Math.min.apply(Math, yminmax);
      var minY = minYOrg;
      return {
          xValues: xValues,
          yValues: yValues,
          yminmax: yminmax,
          maxX: maxX,
          minX: minX,
          maxY: maxY,
          maxYOrg: maxYOrg,
          minY: minY,
          minYOrg: minYOrg,
      };
  };
  // 获取 canvas 的大小和位置
  var getCanvas = function ($el, options, yValues, minY, maxY) {
      var _a = calculateanvasSize($el, options), canvasWidth = _a.canvasWidth, canvasHeight = _a.canvasHeight;
      var spotRadius = options.spotRadius;
      var padding = options.padding;
      var yValLast = yValues.length - 1;
      var canvasTop = 0;
      var canvasLeft = 0;
      if (spotRadius &&
          (canvasWidth < spotRadius * 4 || canvasHeight < spotRadius * 4)) {
          spotRadius = 0;
      }
      // 绘制点
      if (spotRadius) {
          // adjust the canvas size as required so that spots will fit
          var minSpotColor = options.minSpotColor, spotColor = options.spotColor, maxSpotColor = options.maxSpotColor, highlightSpotColor = options.highlightSpotColor, disableInteraction = options.disableInteraction;
          var hlSpotsEnabled = highlightSpotColor && !disableInteraction;
          if (hlSpotsEnabled ||
              minSpotColor ||
              (spotColor && yValues[yValLast] === minY)) {
              canvasHeight -= Math.ceil(spotRadius) + padding;
          }
          if (hlSpotsEnabled ||
              maxSpotColor ||
              (spotColor && yValues[yValLast] === maxY)) {
              canvasHeight -= Math.ceil(spotRadius) + padding;
              canvasTop += Math.ceil(spotRadius) + padding;
          }
          if (hlSpotsEnabled ||
              ((minSpotColor || maxSpotColor) &&
                  (yValues[0] === minY || yValues[0] === maxY))) {
              canvasLeft += padding; // 左边的间距
              canvasWidth -= Math.ceil(spotRadius) + padding;
          }
          if (hlSpotsEnabled ||
              spotColor ||
              minSpotColor ||
              (maxSpotColor &&
                  (yValues[yValLast] === minY || yValues[yValLast] === maxY))) {
              canvasWidth -= Math.ceil(spotRadius) + padding;
          }
      }
      else {
          canvasWidth -= padding * 2;
          canvasHeight -= padding * 2;
          canvasLeft += padding;
          canvasTop += padding;
      }
      return {
          canvasWidth: canvasWidth,
          canvasHeight: canvasHeight,
          canvasLeft: canvasLeft,
          canvasTop: canvasTop,
      };
  };
  // 获取路径
  var getPaths = function (xValues, yValues, canvasLeft, canvasWidth, canvasTop, canvasHeight, minX, minY, maxY, rangeX, rangeY) {
      var path = [];
      var paths = [path];
      var vertices = [];
      var regionMap = [];
      var last = 0;
      var next = 0;
      var x = 0;
      var xNext = 0;
      var y = 0;
      var xPos = 0;
      var xPosNext = 0;
      var yValcount = yValues.length;
      yValues.forEach(function (yValueItem, yValueIdx) {
          x = xValues[yValueIdx];
          xNext = xValues[yValueIdx + 1];
          y = yValueItem;
          xPos = canvasLeft + Math.round((x - minX) * (canvasWidth / rangeX));
          xPosNext =
              yValueIdx < yValcount - 1
                  ? canvasLeft + Math.round((xNext - minX) * (canvasWidth / rangeX))
                  : canvasWidth;
          next = xPos + (xPosNext - xPos) / 2;
          regionMap[yValueIdx] = [last || 0, next, yValueIdx];
          last = next;
          if (y === null) {
              if (yValueIdx) {
                  if (yValues[yValueIdx - 1] !== null) {
                      path = [];
                      paths.push(path);
                  }
                  vertices.push([]);
              }
          }
          else {
              if (y < minY) {
                  y = minY;
              }
              if (y > maxY) {
                  y = maxY;
              }
              if (!path.length) {
                  // previous value was null
                  path.push([xPos, canvasTop + canvasHeight]);
              }
              var verteX = [
                  xPos,
                  canvasTop +
                      Math.round(canvasHeight - canvasHeight * ((y - minY) / rangeY)),
              ];
              path.push(verteX);
              vertices.push(verteX);
          }
      });
      return {
          paths: paths,
          vertices: vertices,
          regionMap: regionMap,
      };
  };
  // 获取线和填充的集合
  var getShapes = function (paths, fillColor, canvasTop, canvasHeight) {
      var lineShapes = [];
      var fillShapes = [];
      paths.forEach(function (path) {
          if (path.length) {
              if (fillColor) {
                  path.push([
                      path[path.length - 1][PointEnum.START_POINT],
                      canvasTop + canvasHeight,
                  ]);
                  fillShapes.push(path.slice(0));
                  path.pop();
              }
              // if there's only a single point in this path, then we want to display it
              // as a vertical line which means we keep path[0]  as is
              if (path.length > 2) {
                  // else we want the first value
                  path[0] = [
                      path[0][PointEnum.START_POINT],
                      path[1][PointEnum.END_POINT],
                  ];
              }
              lineShapes.push(path);
          }
      });
      return {
          lineShapes: lineShapes,
          fillShapes: fillShapes,
      };
  };
  // 画线或者填充
  var drawLines = function (canvas, fillShapes, lineColor, fillColor, lineWidth) {
      fillShapes.forEach(function (fillShapeItem) {
          drawShape({
              canvas: canvas,
              path: fillShapeItem,
              lineColor: lineColor,
              fillColor: fillColor,
              lineWidth: lineWidth,
          });
      });
  };
  // 最终值标记
  var finalValueTag = function (_a) {
      var canvas = _a.canvas, xValues = _a.xValues, yValues = _a.yValues, spotRadius = _a.spotRadius, lineWidth = _a.lineWidth, canvasWidth = _a.canvasWidth, canvasHeight = _a.canvasHeight, canvasLeft = _a.canvasLeft, canvasTop = _a.canvasTop, minX = _a.minX, rangeX = _a.rangeX, minY = _a.minY, rangeY = _a.rangeY, spotColor = _a.spotColor;
      var yValLast = yValues[yValues.length - 1];
      var pointX = canvasLeft +
          Math.round((xValues[xValues.length - 1] - minX) * (canvasWidth / rangeX));
      var pointY = canvasTop +
          Math.round(canvasHeight - canvasHeight * ((yValLast - minY) / rangeY));
      if (spotRadius && spotColor && yValLast !== null) {
          drawCircle({
              canvas: canvas,
              lineColor: spotColor,
              fillColor: spotColor,
              lineWidth: lineWidth,
              x: pointX,
              y: pointY,
              radius: spotRadius,
          });
      }
  };
  // 最大最小值标记
  var minMaxValueTag = function (_a) {
      var canvas = _a.canvas, xValues = _a.xValues, yValues = _a.yValues, spotRadius = _a.spotRadius, lineWidth = _a.lineWidth, canvasWidth = _a.canvasWidth, canvasHeight = _a.canvasHeight, canvasLeft = _a.canvasLeft, canvasTop = _a.canvasTop, minX = _a.minX, rangeX = _a.rangeX, minY = _a.minY, rangeY = _a.rangeY, maxY = _a.maxY, maxSpotColor = _a.maxSpotColor, minSpotColor = _a.minSpotColor, minYOrg = _a.minYOrg, maxYOrg = _a.maxYOrg;
      if (maxY !== minYOrg) {
          if (spotRadius && minSpotColor) {
              var x = xValues[yValues.findIndex(function (yVal) { return yVal === minYOrg; })];
              drawCircle({
                  canvas: canvas,
                  lineColor: minSpotColor,
                  fillColor: minSpotColor,
                  lineWidth: lineWidth,
                  x: canvasLeft + Math.round((x - minX) * (canvasWidth / rangeX)),
                  y: canvasTop +
                      Math.round(canvasHeight - canvasHeight * ((minYOrg - minY) / rangeY)),
                  radius: spotRadius,
              });
          }
          if (spotRadius && maxSpotColor) {
              var x = xValues[yValues.findIndex(function (yVal) { return yVal === maxYOrg; })];
              drawCircle({
                  canvas: canvas,
                  lineColor: maxSpotColor,
                  fillColor: maxSpotColor,
                  lineWidth: lineWidth,
                  x: canvasLeft + Math.round((x - minX) * (canvasWidth / rangeX)),
                  y: canvasTop +
                      Math.round(canvasHeight - canvasHeight * ((maxYOrg - minY) / rangeY)),
                  radius: spotRadius,
              });
          }
      }
  };
  var render = function ($el, canvas, options) {
      var lineColor = options.lineColor, fillColor = options.fillColor, lineWidth = options.lineWidth, spotRadius = options.spotRadius, spotColor = options.spotColor, maxSpotColor = options.maxSpotColor, minSpotColor = options.minSpotColor, values = options.values;
      var _a = scanValues(values), xValues = _a.xValues, yValues = _a.yValues, yminmax = _a.yminmax, maxX = _a.maxX, minX = _a.minX, maxY = _a.maxY, minY = _a.minY, minYOrg = _a.minYOrg, maxYOrg = _a.maxYOrg;
      var rangeX = maxX - minX === 0 ? 1 : maxX - minX;
      var rangeY = maxY - minY === 0 ? 1 : maxY - minY;
      if (!yminmax.length || yValues.length < 2) {
          // empty or all null valuess
          return;
      }
      var _b = getCanvas($el, options, yValues, minY, maxY), canvasWidth = _b.canvasWidth, canvasHeight = _b.canvasHeight, canvasLeft = _b.canvasLeft, canvasTop = _b.canvasTop;
      var newCavasHeight = canvasHeight;
      newCavasHeight--;
      var paths = getPaths(xValues, yValues, canvasLeft, canvasWidth, canvasTop, newCavasHeight, minX, minY, maxY, rangeX, rangeY).paths;
      var _c = getShapes(paths, fillColor, canvasTop, newCavasHeight), lineShapes = _c.lineShapes, fillShapes = _c.fillShapes;
      drawLines(canvas, fillShapes, fillColor, fillColor, lineWidth);
      drawLines(canvas, lineShapes, lineColor, '', lineWidth);
      var valueTag = {
          canvas: canvas,
          xValues: xValues,
          yValues: yValues,
          spotRadius: spotRadius,
          lineWidth: lineWidth,
          canvasWidth: canvasWidth,
          canvasHeight: canvasHeight,
          canvasLeft: canvasLeft,
          canvasTop: canvasTop,
          minX: minX,
          rangeX: rangeX,
          minY: minY,
          rangeY: rangeY,
      };
      finalValueTag(__assign(__assign({}, valueTag), { spotColor: spotColor }));
      minMaxValueTag(__assign(__assign({}, valueTag), { maxY: maxY,
          maxSpotColor: maxSpotColor,
          minSpotColor: minSpotColor,
          minYOrg: minYOrg,
          maxYOrg: maxYOrg }));
  };
  var line = (function ($el, options) {
      if (options === void 0) { options = optionsDefault; }
      var canvas = createCanvas($el, options);
      render($el, canvas, options);
      return {
          canvas: canvas,
          render: render,
      };
  });

  /** @format */
  var scanValues$1 = function ($el, values, options) {
      var canvasHeight = calculateanvasSize($el, options).canvasHeight;
      var zeroAxis = options.zeroAxis;
      var numValues = [];
      var xAxisOffset = 0;
      values.forEach(function (val) {
          numValues.push(isNumber(val) ? val : 0);
      });
      var max = Math.max.apply(Math, numValues);
      var min = Math.min.apply(Math, numValues);
      if (min <= 0 && max >= 0 && zeroAxis) {
          xAxisOffset = 0;
      }
      else if (zeroAxis === false) {
          xAxisOffset = min;
      }
      else if (min > 0) {
          xAxisOffset = min;
      }
      else {
          xAxisOffset = max;
      }
      var range = max - min;
      var canvasHeightEf = zeroAxis && min < 0 ? canvasHeight - 2 : canvasHeight - 1;
      var yOffset = 0;
      if (min < xAxisOffset) {
          yOffset = ((max - xAxisOffset) / range) * canvasHeight;
          if (yOffset !== Math.ceil(yOffset)) {
              // canvasHeightEf -= 2;
              yOffset = Math.ceil(yOffset);
          }
      }
      else {
          yOffset = canvasHeight;
      }
      return {
          numValues: numValues,
          max: max,
          min: min,
          canvasHeightEf: canvasHeightEf,
          xAxisOffset: xAxisOffset,
          yOffset: yOffset,
          range: range,
      };
  };
  var getColor = function (value, options) {
      var barColor = options.barColor, negBarColor = options.negBarColor, zeroColor = options.zeroColor;
      var color = value < 0 ? negBarColor : barColor;
      if (value === 0) {
          color = zeroColor;
      }
      return color;
  };
  // 获取路径
  var getbars = function (options, valConf) {
      var bars = [];
      var barWidth = options.barWidth, barSpacing = options.barSpacing, padding = options.padding, zeroAxis = options.zeroAxis;
      var numValues = valConf.numValues, canvasHeightEf = valConf.canvasHeightEf, xAxisOffset = valConf.xAxisOffset, yOffset = valConf.yOffset, range = valConf.range;
      var totalBarWidth = barWidth + barSpacing;
      var yOffsetNeg = yOffset;
      var yOffsetNew = yOffset;
      numValues.forEach(function (val, valIdx) {
          var startX = valIdx * totalBarWidth;
          var height = 0;
          var startY = 0;
          var color = getColor(val, options);
          if (range > 0) {
              height =
                  Math.floor(canvasHeightEf * (Math.abs(val - xAxisOffset) / range)) + 1;
          }
          else {
              height = 1 + padding;
          }
          if (val < xAxisOffset || (val === xAxisOffset && yOffsetNew === 0)) {
              startY = yOffsetNeg;
          }
          else {
              startY = yOffsetNew - height;
          }
          var space = 0;
          if (zeroAxis) {
              if (val > 0) {
                  space = -1;
              }
              else {
                  space = 3;
              }
          }
          else if (val < 0) {
              space = 2;
          }
          else if (val === 0) {
              space = padding;
          }
          else {
              space = padding + (padding ? 1 : 0);
          }
          var startYNew = val > 0 ? startY - 1 + padding : startY + 1;
          if (!zeroAxis && padding) {
              if (val < 0) {
                  startYNew -= padding + 1;
              }
              else {
                  startYNew += 1;
              }
          }
          var bar = {
              startX: startX + padding,
              startY: startYNew,
              height: height - space - padding,
              width: barWidth - 1,
              color: color,
          };
          bars.push(bar);
      });
      return bars;
  };
  var drawBars = function (canvas, bars) {
      bars.forEach(function (bar) {
          var startX = bar.startX, startY = bar.startY, height = bar.height, width = bar.width, color = bar.color;
          drawRect({
              canvas: canvas,
              path: [
                  [startX, startY],
                  [startX + width, startY],
                  [startX + width, startY + height],
                  [startX, startY + height],
                  [startX, startY],
              ],
              lineColor: color,
              fillColor: color,
              lineWidth: 1,
          });
      });
  };
  var render$1 = function ($el, canvas, options) {
      var values = options.values;
      var valConf = scanValues$1($el, values, options);
      var bars = getbars(options, valConf);
      drawBars(canvas, bars);
  };
  var bar = (function ($el, options) {
      if (options === void 0) { options = optionsDefault; }
      var canvas = createCanvas($el, options);
      render$1($el, canvas, options);
      return {
          canvas: canvas,
          render: render$1,
      };
  });

  /** @format */
  var drawPiesSlice = function (canvas, options, valuenum, radius) {
      var values = options.values, offset = options.offset, borderWidth = options.borderWidth, sliceColors = options.sliceColors, padding = options.padding;
      var total = values.length > 0
          ? values.reduce(function (acc, val) { return acc + val; }, 0)
          : 0;
      var next = offset ? 2 * Math.PI * (offset / 360) : 0;
      var circle = 2 * Math.PI;
      var start = 0;
      var end = 0;
      var color = '';
      values.forEach(function (val, valIdx) {
          start = next;
          end = next;
          if (total > 0) {
              // avoid divide by zero
              end = next + circle * (val / total);
          }
          if (valuenum === valIdx) {
              color = sliceColors[valIdx % sliceColors.length];
              drawPieSlice({
                  canvas: canvas,
                  x: radius + padding * 2,
                  y: radius + padding * 2,
                  radius: radius - borderWidth,
                  startAngle: start,
                  endAngle: Math.ceil(end),
                  lineColor: '',
                  fillColor: color,
              });
          }
          next = end;
      });
  };
  var render$2 = function ($el, canvas, options) {
      var borderWidth = options.borderWidth, borderColor = options.borderColor, values = options.values, padding = options.padding;
      var _a = calculateanvasSize($el, options), canvasWidth = _a.canvasWidth, canvasHeight = _a.canvasHeight;
      var radius = Math.floor(Math.min(canvasWidth, canvasHeight) / 2);
      var newRadius = radius - padding * 2;
      // 画边框
      if (isNumber(borderWidth) && borderWidth > 0) {
          drawCircle({
              canvas: canvas,
              x: newRadius,
              y: newRadius,
              radius: Math.floor(newRadius - borderWidth / 2),
              lineColor: isString(borderColor) ? borderColor : '',
              fillColor: '',
              lineWidth: 1,
          });
      }
      // 画饼
      var valIdx = values.length;
      while (valIdx > -1) {
          drawPiesSlice(canvas, options, valIdx, newRadius);
          valIdx--;
      }
  };
  var pie = (function ($el, options) {
      if (options === void 0) { options = optionsDefault; }
      var canvas = createCanvas($el, options);
      render$2($el, canvas, options);
      return {
          canvas: canvas,
          render: render$2,
      };
  });

  /** @format */
  var charts = {
      line: line,
      bar: bar,
      pie: pie,
  };
  var sparklines = function ($el, options) {
      if (options === void 0) { options = optionsDefault; }
      var opts = cloneDeep(optionsDefault, options);
      var type = opts.type;
      var canvas = charts[type]($el, opts).canvas;
      return {
          canvas: canvas,
          render: function ($renderEl, renderOptions) {
              if (renderOptions === void 0) { renderOptions = optionsDefault; }
              var optionsNew = cloneDeep(optionsDefault, renderOptions);
              charts[optionsNew.type]($renderEl, optionsNew);
          },
      };
  };

  /** @format */
  if (typeof window !== 'undefined' && !window.sparklines) {
      window.sparklines = sparklines;
  }

  exports.createCanvas = createCanvas;
  exports.default = sparklines;
  exports.getContext = getContext;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
