/** @format */

import { OptionsFace, optionsDefault } from './share/ast';
import line from './line';
import bar from './bar';

const sparklines = (
  $el: Element,
  options: OptionsFace = optionsDefault,
): void => {
  const opts: OptionsFace = Object.assign(optionsDefault, options);

  const { type } = opts;

  if (type === 'line') {
    line($el, opts);
  }

  if (type === 'bar') {
    bar($el, opts);
  }
};

export default sparklines;
