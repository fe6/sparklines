/** @format */

import { createCanvas, getContext } from './share/canvas';
import sparklines from './core';

export { createCanvas, getContext };

if (typeof window !== 'undefined' && !(window as any).sparklines) {
  (window as any).sparklines = sparklines;
}

export default sparklines;
