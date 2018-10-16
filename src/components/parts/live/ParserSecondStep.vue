<template>
  <div>
    <p>We need to have a kind of state-machine, starting at an undetermined state, and chewing through text obeying rules for the current state, and a list of transitions between states. Here's some pseudo-code defining those principles. We'll write a basic parser that aims to keep track of the current point and generate a list of independent instructions.</p>
    <p>We'll also translate all coordinates to absolute by adding the current point's absolute coordinates to every point present in a relative version of an instruction.</p>
    <textarea class="textarea" v-model="input" @change="parseAndDisplay"></textarea>
    <foldable-pre>
States : {{ JSON.stringify(STATES) }}

Tokenizing : trim, then split at spaces.
{{ JSON.stringify(result1) }}

Lexing : transform this into a list of instructions.
{{ JSON.stringify(result2, null, 2) }}
    </foldable-pre>
    <p>The JS code present in this sample, annotated :</p>
    <foldable-pre>
// "Enums" for positions and parser state
export const STATES = fakeEnum('Undefined', 'Move', 'Cubic', 'End');
const POSITIONS = fakeEnum('Absolute', 'Relative');

// Point string to absolute point, depending on
// the carried current point and positioning mode
const strToPt = (str, curr, pos) => {
  const c = curr ? curr : { x:0, y:0 };
  if (!pointReg.test(str)) throw new Error();
  let [expr, x, y] = str.match(pointReg);
  if (pos === POSITIONS.Relative) { x = Number(x) + c.x; y = Number(y) + c.y; };
  return new Point(Number(x), Number(y));
}

// Move and Cubic AST node generators
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
    </foldable-pre>
    <p>The lexing function, carrying state and switches, acts as a transition table :</p>
    <foldable-pre>
// For each token, depending on the state we're in, we'll try to parse a point or change state.
// This is naïve, and will break on invalid input.

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
    </foldable-pre>
  </div>
</template>

<script>
  import { parse, tokenize, STATES } from './parserSecondStep';
  import FoldablePre from './../FoldablePre';

  export default {
    name: 'ParserFirstStep',
    components: { FoldablePre },
    data() {
      return {
        input: `m 205.47289,169.14572 c -1.08,0 -1.56,-0.6 -1.56,-1.64 0,-3.4 4.68,-7.48 4.68,-12.04`,
        STATES,
        result1: [],
        result2: [],
      };
    },
    methods: {
      parseAndDisplay() {
        this.result1 = tokenize(this.input);
        this.result2 = parse(this.input);
      },
    },
    mounted() {
      this.parseAndDisplay();
    },
  };
</script>

<style>

</style>
