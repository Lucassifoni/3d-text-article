const Point = function(x, y) { this.x = x; this.y = y; };
const pointReg = /(?:([-]*\d+\.?(?:\d+)?),([-]*\d+\.?(?:\d+)?))/;

const fakeEnum = (...arr) => arr.reduce((b,a) => { b[a] = Object.keys(b).length; return b; }, {});
export const STATES = fakeEnum('Undefined', 'Move', 'Cubic', 'End');
const POSITIONS = fakeEnum('Absolute', 'Relative');

export const tokenize = a => a.trim().split(' ');

const strToPt = (str, curr, pos) => {
  const c = curr ? curr : { x:0, y:0 };
  if (!pointReg.test(str)) throw new Error();
  let [expr, x, y] = str.match(pointReg);
  if (pos === POSITIONS.Relative) { x = Number(x) + c.x; y = Number(y) + c.y; };
  return new Point(Number(x), Number(y));
}

const move = (tokens, index, currentPoint, pos) => {
  const [p1] = [tokens[index]]
    .map(t => strToPt(t, null, pos));
  const instr = { type: 'Move', points: [p1] };
  return { instr, current: instr.points[0] };
};

const cubic = (tokens, index, currentPoint, pos) => {
  const [p1, p2, p3] = tokens.slice(index, index + 3)
    .map(t => strToPt(t, currentPoint, pos));
  const instr = { type: 'Cubic', points: [currentPoint, p1, p2, p3] };
  return { instr, current: instr.points[3] };
};

const isUpperCase = a => a === a.toUpperCase();

const lex = function(tokens) {
  let state = STATES.Undefined;
  let pos = POSITIONS.Absolute;
  let currentPoint = null;
  let instrs = [];
  let i = 0;
  const setPos = (token) => { pos = isUpperCase(token) ? POSITIONS.Absolute : POSITIONS.Relative; };
  while (state !== STATES.End) {
    const token = tokens[i];
    if (state === STATES.Undefined) {
      switch(token.toLowerCase()) {
        case "m":
          state = STATES.Move;
          i += 1;
        break;
        case "c":
          state = STATES.Cubic;
          i += 1;
        break;
      }
      setPos(token);
    } else if (state === STATES.Move) {
      switch(token.toLowerCase()) {
        case "c":
          setPos(token);
          state = STATES.Cubic;
          i += 1;
        break;
        default:
          try {
          let { instr, current } = move(tokens, i, currentPoint, pos);
          instrs.push(instr);
          currentPoint = current;
          } catch(e) {}
          i += 1;
        break;
      }
    } else if (state === STATES.Cubic) {
      switch(token.toLowerCase()) {
        case "m":
          setPos(token);
          state = STATES.Move;
          i += 1;
        break;
        default:
          try {
            let { instr, current } = cubic(tokens, i, currentPoint, pos);
            instrs.push(instr);
            currentPoint = current;
          } catch(e) {}
          i += 3;
        break;
      }
    }
    if (i >= tokens.length -1) state = STATES.End;
  }
  return instrs;
};

export const parse = text => lex(tokenize(text));
