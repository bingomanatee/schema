import is from 'is';

export default (a, b) => {
  if (!(is.number(a) && is.number(b))) {
    throw new Error(`values must be a number: a = ${a}; b = ${b}`);
  }
  return a + b;
};
