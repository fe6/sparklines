/** @format */
import { isString } from './share/type';
import {
  OptionsFace,
  optionsDefault,
  StyleFace,
  styleDefault,
  PointEnum,
} from './share/ast';
import { css } from './share/dom';

export interface CalculateanvasSizeFace {
  canvasWidth: number;
  canvasHeight: number;
}

// 计算尺寸
export const calculateanvasSize = (
  $el: any,
  options: OptionsFace = optionsDefault,
  isInit?: boolean,
): CalculateanvasSizeFace => {
  const {
    width,
    height,
    defaultPixelsPerValue,
    values,
    type,
    barWidth,
    barSpacing,
    padding,
  } = options;
  const isAutoWidth = width === 'auto';
  const isBar = type === 'bar';
  const stepWidth = isBar ? barWidth + barSpacing : defaultPixelsPerValue;
  let canvasWidth = isAutoWidth ? values.length * stepWidth : Number(width);
  let tmp = null;
  let canvasHeight = height;

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
    canvasHeight = css(tmp, 'height') as string;
    $el.removeChild(tmp);
    tmp = null;
  }

  return {
    canvasWidth: Number(canvasWidth),
    canvasHeight: parseFloat(canvasHeight),
  };
};

export interface CanvasSizeFace {
  pixelHeight: string;
  pixelWidth: string;
}

export enum CanvasSizeEnum {
  SIZE,
}

// 计算画布尺寸
export const calculatePixelDims = (
  canvas: any,
  width: string,
  height: string,
): CanvasSizeFace => {
  const pxregex = /(\d+)(px)?\s*$/i;
  // XXX This should probably be a configurable option
  let match = pxregex.exec(height);
  let pixelWidth = '0';
  let pixelHeight = '0';
  if (match) {
    pixelHeight = match[CanvasSizeEnum.SIZE];
  } else {
    pixelHeight = css(canvas, 'height') as string;
  }
  match = pxregex.exec(width);
  if (match) {
    pixelWidth = match[CanvasSizeEnum.SIZE];
  } else {
    pixelWidth = css(canvas, 'width') as string;
  }

  return {
    pixelWidth,
    pixelHeight,
  };
};

// 创建 canvas
export const createCanvas = (
  $el: Element,
  options: OptionsFace = optionsDefault,
): Element => {
  const canvas = document.createElement('canvas');
  const { canvasWidth, canvasHeight } = calculateanvasSize($el, options, true);

  ($el as any).appendChild(canvas);

  const canvasSize: CanvasSizeFace = calculatePixelDims(
    canvas,
    String(canvasWidth),
    String(canvasHeight),
  );

  (canvas as any).width = canvasSize.pixelWidth;
  (canvas as any).height = canvasSize.pixelHeight;

  css(canvas, {
    display: 'inline-block',
    position: 'relative',
    overflow: 'hidden',
    width: `${canvasWidth}px`,
    height: `${canvasHeight}px`,
    margin: '0px',
    padding: '0px',
    verticalAlign: 'top',
  });

  return canvas;
};

// 获取上下文
export const getContext = (
  canvas: any,
  options: StyleFace = styleDefault,
): CanvasRenderingContext2D => {
  const ctx = canvas.getContext('2d');
  const { lineColor, fillColor, lineWidth } = options;

  ctx.strokeStyle = lineColor;
  ctx.fillStyle = fillColor;
  ctx.lineWidth = lineWidth;

  return ctx;
};

// 图形的 id 累加
// const shapeCount = 0;

// 绘制形状
// vcanvase-canvas _drawShape
interface DrawShapeCoreFace {
  canvas: any;
  // shapeId: number;
  path: number[][];
  lineColor: string;
  fillColor: string;
  lineWidth: number;
}

export const drawShapeCore = ({
  canvas,
  path,
  lineColor,
  fillColor,
  lineWidth,
}: DrawShapeCoreFace): void => {
  const context = getContext(canvas, {
    lineColor,
    fillColor,
    lineWidth,
  });
  const POINT_STEP = 0.5;

  context.beginPath();
  context.moveTo(
    path[0][PointEnum.START_POINT] + POINT_STEP,
    path[0][PointEnum.END_POINT] + POINT_STEP,
  );

  path.forEach(pItem => {
    context.lineTo(
      pItem[PointEnum.START_POINT] + POINT_STEP,
      pItem[PointEnum.END_POINT] + POINT_STEP,
    ); // the 0.5 offset gives us crisp pixel-width lines
  });

  if (lineColor !== '') {
    context.stroke();
  }
  if (fillColor !== '') {
    context.fill();
  }
};

interface DrawCircleCoreFace {
  canvas: any;
  // shapeId: number,
  lineColor: string;
  fillColor: string;
  lineWidth: number;
  x: number;
  y: number;
  radius: number;
}

// 绘制圆
const drawCircleCore = ({
  canvas,
  x,
  y,
  radius,
  lineColor,
  fillColor,
  lineWidth,
}: DrawCircleCoreFace): void => {
  const context = getContext(canvas, {
    lineColor,
    fillColor,
    lineWidth,
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

// 方块的数据
export interface RectFace {
  startX: number;
  startY: number;
  height: number;
  width: number;
  color: string;
}

// let shapeCount = 0;

const genShape = (
  shapetype: string,
  params: DrawShapeCoreFace | DrawCircleCoreFace,
): void => {
  if (shapetype === 'Shape') {
    drawShapeCore(params as DrawShapeCoreFace);
  }

  if (shapetype === 'Circle') {
    drawCircleCore(params as DrawCircleCoreFace);
  }

  if (shapetype === 'Rect') {
    drawShapeCore(params as DrawShapeCoreFace);
  }
};

export const drawRect = (params: DrawShapeCoreFace): void => {
  genShape('Rect', params);
};

export const drawShape = (params: DrawShapeCoreFace): void => {
  genShape('Shape', params);
};

export const drawCircle = (params: DrawCircleCoreFace): void => {
  genShape('Circle', params);
};
