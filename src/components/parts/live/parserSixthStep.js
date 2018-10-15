import { bezierInstructionToLines } from "./cubicBezierToSegments";

export const convertToPoints = function(instructions) {
    const flat = instructions.reduce((acc, i) => { acc.push(...i.points); return acc; }, []);
      return flat.reduce((acc, point) => {
        if (acc.length === 0) return [point];
        let p = acc[acc.length - 1];
        if (p.x === point.x && p.y === point.y) return acc;
        acc.push(point);
        return acc;
      }, []);
};

const Point = function(x, y) { this.x = x; this.y = y; };
const pointReg = /(?:([-]*\d+\.?(?:\d+)?),([-]*\d+\.?(?:\d+)?))/;
const coordReg = /(?:([-]*\d+\.?(?:\d+)?))/;

const fakeEnum = (...arr) => arr.reduce((b,a) => { b[a] = Object.keys(b).length; return b; }, {});
const STATES = fakeEnum('Undefined', 'Move', 'Cubic', 'End', 'Line', 'HLine', 'VLine');
const POSITIONS = fakeEnum('Absolute', 'Relative');

export const tokenize = a => a.trim().split(' ');

const strToPt = (str, curr, pos) => {
  const c = curr ? curr : { x:0, y:0 };
  if (!pointReg.test(str)) throw new Error();
  let [expr, x, y] = str.match(pointReg);
  if (pos === POSITIONS.Relative) { x = Number(x) + c.x; y = Number(y) + c.y; };
  return new Point(Number(x), Number(y));
}

const xStrToPt = (str, curr, pos) => {
  const c = curr ? curr : { x:0, y:0 };
  if (!coordReg.test(str)) throw new Error();
  let [expr, x] = str.match(coordReg);
  if (pos === POSITIONS.Relative) { x = Number(x) + c.x; };
  return new Point(Number(x), Number(curr.y));
}

const yStrToPt = (str, curr, pos) => {
  const c = curr ? curr : { x:0, y:0 };
  if (!coordReg.test(str)) throw new Error();
  let [expr, y] = str.match(coordReg);
  if (pos === POSITIONS.Relative) { y = Number(y) + c.y; };
  return new Point(Number(curr.x), Number(y));
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

const line = (tokens, index, currentPoint, pos) => {
  const [p1] = [tokens[index]]
    .map(t => strToPt(t, currentPoint, pos));
  const instr = { type: 'Line', points: [currentPoint, p1] };
  return { instr, current: instr.points[1] };
};

const vline = (tokens, index, currentPoint, pos) => {
  const [p1] = [tokens[index]]
    .map(t => yStrToPt(t, currentPoint, pos));
  const instr = { type: 'VLine', points: [currentPoint, p1] };
  return { instr, current: instr.points[1] };
};

const hline = (tokens, index, currentPoint, pos) => {
  const [p1] = [tokens[index]]
    .map(t => xStrToPt(t, currentPoint, pos));
  const instr = { type: 'HLine', points: [currentPoint, p1] };
  return { instr, current: instr.points[1] };
};

const isUpperCase = a => a === a.toUpperCase();

const map = {
  m: STATES.Move,
  M: STATES.Move,
  l: STATES.Line,
  L: STATES.Line,
  c: STATES.Cubic,
  C: STATES.Cubic,
  v: STATES.VLine,
  V: STATES.VLine,
  h: STATES.HLine,
  H: STATES.HLine,
};

const not = (char, token) => Object.keys(map).filter(a => a.toLowerCase() !== char).indexOf(token) !== -1;

const lex = function(tokens) {
  let state = STATES.Undefined;
  let pos = POSITIONS.Absolute;
  let currentPoint = null;
  let instrs = [];
  let i = 0;
  const setPos = (token) => { pos = isUpperCase(token) ? POSITIONS.Absolute : POSITIONS.Relative; };
  const changeState = (token) => { state = map[token]; i += 1; setPos(token); };

  while (state !== STATES.End) {
    const token = tokens[i];
    if (state === STATES.Undefined) {
      changeState(token);
    } else if (state === STATES.Move) {
      if (not("m", token)) {
        changeState(token);
      } else {
          let { instr, current } = move(tokens, i, currentPoint, pos);
          instrs.push(instr);
          currentPoint = current;
        i += 1;
      }
    } else if (state === STATES.Cubic) {
      if (not("c", token)) {
        changeState(token);
      } else {
          let { instr, current } = cubic(tokens, i, currentPoint, pos);
          instrs.push(instr);
          currentPoint = current;
        i += 3;
      }
    } else if (state === STATES.Line) {
      if (not("l", token)) {
        changeState(token);
      } else {
          let { instr, current } = line(tokens, i, currentPoint, pos);
          instrs.push(instr);
          currentPoint = current;
        i += 1;
      }
    } else if (state === STATES.HLine) {
      if (not("h", token)) {
        changeState(token);
      } else {
          let { instr, current } = hline(tokens, i, currentPoint, pos);
          instrs.push(instr);
          currentPoint = current;
        i += 1;
      }
    } else if (state === STATES.VLine) {
      if (not("v", token)) {
        changeState(token);
      } else {
          let { instr, current } = vline(tokens, i, currentPoint, pos);
          instrs.push(instr);
          currentPoint = current;
        i += 1;
      }
    } else {
      i += 1;
    }
    if (i >= tokens.length -1) state = STATES.End;
  }
  return instrs;
};

export const remapInstrs = (instrs) => {
  return instrs.reduce((acc, i) => {
    if (i.type === 'Cubic') {
      acc = acc.concat(bezierInstructionToLines(i));
      return acc;
    }
    acc.push(i);
    return acc;
  }, []);
};
export const parse = text => lex(tokenize(text));
