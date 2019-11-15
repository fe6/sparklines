/** @format */

import {
  OptionsFace,
  optionsDefault,
  // TypeEnum,
  CoreReturnFace,
} from './share/ast';
import { cloneDeep } from './share/util';
import line from './chart/line';
import bar from './chart/bar';
import pie from './chart/pie';

const charts: any = {
  line,
  bar,
  pie,
};

const sparklines = (
  $el: Element,
  options: OptionsFace = optionsDefault,
): CoreReturnFace => {
  const opts: OptionsFace = cloneDeep(optionsDefault, options);

  const { type } = opts;

  const { canvas } = (charts[type] as Function)($el, opts);

  return {
    canvas,
    render: (
      $renderEl: Element,
      renderOptions: OptionsFace = optionsDefault,
    ): void => {
      const optionsNew: OptionsFace = cloneDeep(optionsDefault, renderOptions);
      (charts[optionsNew.type] as Function)($renderEl, optionsNew);
    },
  };
};

export default sparklines;
