/** @format */

import { OptionsFace, optionsDefault, TypeEnum } from './share/ast';
import line from './chart/line';
import bar from './chart/bar';
import pie from './chart/pie';

const sparklines = (
  $el: Element,
  options: OptionsFace = optionsDefault,
): void => {
  const opts: OptionsFace = Object.assign(optionsDefault, options);

  const { type } = opts;

  if (type === TypeEnum.LINE) {
    line($el, opts);
  }

  if (type === TypeEnum.BAR) {
    bar($el, opts);
  }

  if (type === TypeEnum.PIE) {
    pie($el, opts);
  }
};

export default sparklines;
