const Point = function(x, y) { this.x = x; this.y = y; };
const pointR = '(?:([-]*\\d+\\.?(?:\\d+)?),([-]*\\d+\\.?(?:\\d+)?))';

const moveRegex = new RegExp(`m\\s*${pointR}`, 'i');
const cubicRegex = new RegExp(`c\\s*${pointR}\\s${pointR}\\s${pointR}`, 'i');

const matchesToPoints = (token, matches) => {
  if (!matches) throw new Error(`Couldn't parse token ${token}`);
  const points = matches.slice(1);
  if (points.length % 2 !== 0) throw new Error(`Instruction contains an uneven number of coordinates.`);
  const out = [];
  for (let i = 0; i < points.length; i += 2) {
    out.push(new Point(points[i], points[i + 1]));
  }
  return out;
};

const move = token => matchesToPoints(token, token.match(moveRegex));
const cubic = token => matchesToPoints(token, token.match(cubicRegex));
/* eslint-disable */
const lex = (tokens) => {
  return tokens.map(t => {
    switch (t.charAt(0).toLowerCase()) {
      case "m":
        return { type: 'Move', params: move(t) };
      break;
      case "c":
        return { type: 'Cubic', params: cubic(t) };
      break;
      default:
        return;
      break;
    }
  });
};

const tokenize = text => text.split('\n').map(a => a.trim()).filter(a => a);
export const parse = text => lex(tokenize(text));