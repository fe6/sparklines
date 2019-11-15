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
  padding: number;
  disableInteraction: boolean;
  defaultPixelsPerValue: number;
  spotRadius: number;
  spotColor: string;
  highlightSpotColor: string;
  highlightLineColor: string;
  minSpotColor: string;
  maxSpotColor: string;
  barColor: string;
  negBarColor: string;
  barWidth: number;
  barSpacing: number;
  zeroColor: string;
  zeroAxis: boolean;
  offset: number;
  sliceColors: string[];
  borderWidth: number;
  borderColor: string;
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
  values: [],
  disableInteraction: false,
  padding: 0, // 间距
  // line params start
  defaultPixelsPerValue: 3,
  spotRadius: 1.5, // 线的点的半径
  spotColor: '#f80',
  highlightSpotColor: '#5f5',
  highlightLineColor: '#f22',
  minSpotColor: '#f80',
  maxSpotColor: '#f80',
  // line params end
  // bar params start
  barColor: '#ff4949',
  negBarColor: '#4cbd63',
  barWidth: 4,
  barSpacing: 1,
  zeroColor: '#ccc',
  zeroAxis: true,
  // bar params end
  // pie params start
  offset: 0,
  sliceColors: [
    '#3366cc',
    '#dc3912',
    '#ff9900',
    '#109618',
    '#66aa00',
    '#dd4477',
    '#0099c6',
    '#990099',
  ],
  borderWidth: 0,
  borderColor: '#000',
  // pie params end
  ...styleDefault,
};

// 线的参数
export const lineOptionsDefault = {};

// 点
export enum PointEnum {
  START_POINT,
  END_POINT,
}

export enum TypeEnum {
  LINE = 'line',
  BAR = 'bar',
  PIE = 'pie',
}
