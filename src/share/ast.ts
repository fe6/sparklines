/** @format */

export interface StyleFace {
  lineWidth: number;
  lineColor: string;
  fillColor: string;
}

export interface OptionsFace extends StyleFace {
  width: string;
  height: string;
  type: string;
  values: number[];
  defaultPixelsPerValue: number;
  spotRadius: number;
  spotColor: string;
  highlightSpotColor: string;
  highlightLineColor: string;
  minSpotColor: string;
  maxSpotColor: string;
  disableInteraction: boolean;
}

export const styleDefault: StyleFace = {
  lineColor: '#00f',
  fillColor: '#cdf',
  lineWidth: 1,
};

// 公共的参数
export const optionsDefault: OptionsFace = {
  width: 'auto',
  height: 'auto',
  type: 'line',
  defaultPixelsPerValue: 3,
  values: [],
  spotRadius: 1.5, // 线的点的半径
  spotColor: '#f80',
  highlightSpotColor: '#5f5',
  highlightLineColor: '#f22',
  disableInteraction: false,
  minSpotColor: '#f80',
  maxSpotColor: '#f80',
  ...styleDefault,
};

// 线的参数
export const lineOptionsDefault = {};

export enum PointEnum {
  START_POINT,
  END_POINT,
}
