const Point = function(x, y) {
  this.x = x;
  this.y = y;
};

const move = (token) => {
  const reg = /m\s*(\d+\.?(?:\d+)?),(\d+\.?(?:\d+)?)/;
  const matches = token.match(reg);
  return new Point(matches[1], matches[2]);
};

const cubic = (token) => {

};

export const lex = (tokens) => {
  return tokens.map(t => {
    switch (t.charAt(0).toLowerCase()) {
      case "m":
        return {type: 'Move', content: move(t) };
      break;
      case "c":
        return {type: 'Cubic', content: cubic(t) };
      break;
      default:
        return;
      break;
    }
  });
};

export const tokenize = (text) => {
  return text.split('\n')
    .map(a => a.trim())
    .filter(a => a);
};

export const parse = (text) => {
  return lex(tokenize(text));
};