/**
 * @format
 */
import { isFunction, isNumber } from './type';

// 转换成数字
export const toNumber = (val: string | number): string | number => {
  const num = parseFloat(val as string);
  return Number.isNaN(num) ? val : num;
};

/**
 * 添加 px 单位
 *
 * @param {Object} value 处理的字符串
 * @returns {string} value 新字符串
 */
export const px = (value: string | number): string | number => {
  const newVal = toNumber(value);
  return isNumber(value) ||
    (isNumber(newVal) && !Number.isNaN(newVal as number))
    ? `${value}px`
    : value;
};

export interface StyleFace {
  [styleAttr: string]: string;
}

/**
 * 获取样式
 *
 * @param {Object} ele 获取样式的元素
 * @returns {Object} style 对象
 */
export const getStyle = (ele: any): StyleFace => {
  let style = null;
  const getCss = window.getComputedStyle;
  if (isFunction(getStyle)) {
    style = getCss(ele, null);
  } else {
    style = ele.currentStyle;
  }
  return style;
};
