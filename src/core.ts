/** @format */

import { OptionsFace, optionsDefault } from './share/ast';
import line from './line';

const sparklines = (
  $el: Element,
  options: OptionsFace = optionsDefault,
): void => {
  const opts: OptionsFace = Object.assign(optionsDefault, options);

  const { type } = opts;

  if (type === 'line') {
    line($el, opts);
  }
};

export default sparklines;
