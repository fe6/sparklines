/** @format */

import { StyleFace, getStyle } from './util';
import { isString } from './type';

export const css = ($el: any, params: StyleFace | string): string | void => {
  if (isString(params)) {
    return getStyle($el)[params as string];
  }
  Object.keys(params).forEach(paramsKey => {
    $el.style[paramsKey] = (params as StyleFace)[paramsKey];
  });

  return '';
};
