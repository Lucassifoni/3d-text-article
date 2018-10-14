<template lang=pug>
  section
    pre
      code |
        | &lt;path style="stroke:#130000;stroke-opacity:1;stroke-width:4.42498882;stroke-miterlimit:4;stroke-dasharray:none;paint-order:markers stroke fill;fill:#ff0000;fill-opacity:1"
        | d="m 205.47289,169.14572 c -1.08,0 -1.56,-0.6 -1.56,-1.64 0,-3.4 4.68,-7.48 4.68,-12.04 0,-3 -1.88,-4.52 -4.84,-4.52 -3.52,0 -6.96,1.48 -10.4,7.2 h -0.56 c 2.08,-4.8 3.48,-8.48 3.48,-11.48 0,-2.24 -1.28,-3.36 -3.52,-3.36 -1.52,0 -3.12,0.44 -4.8,1.12 0.36,0.68 0.64,1.44 0.84,2.08 1.48,-0.68 2.48,-1.04 3.64,-1.04 1.28,0 1.84,0.6 1.84,1.76 0,2.92 -3.32,10.88 -8,23.16 0.8,0.12 1.44,0.24 2,0.48 l 0.12,0.04 c 5.68,-15.48 11.24,-18 14.92,-18 1.88,0 3.04,0.8 3.04,2.72 0,3.52 -4.68,7.64 -4.68,11.96 0,2.44 1.64,3.52 3.48,3.52 2.48,0 4.04,-1.56 6.08,-4.2 -0.72,-0.48 -1.12,-0.8 -1.68,-1.28 -1.4,2.28 -2.52,3.52 -4.08,3.52 z"
        | id="path1702" /&gt;
    p We'll also keep the SVG Stroke spec in a tab, because an implementation of a stroke algorithm is outlined. <a href="https://www.w3.org/TR/svg-strokes/#SpecifyingStrokePaint">W3 SVG spec</a>
    p According to <a href="http://svgpocketguide.com/book/#section-2">the SVG Pocket Guide</a>, the "d" attribute contains instructions with mnemonics and values, respectively :
    table(class="table striped")
      thead
        th mnemonic
        th meaning
        th observations
      tbody
        tr
          td m or M
          td move to
          td akin to a pen lift. a path must start with a M command.
        tr
          td z or Z
          td close path
          td closes the current subpath. draws a straight line between that point and the initial point of the subpath. If a M instruction follows, the next subpath starts at the newly-defined coordinate. Else, the next subpath starts at the same point.
        tr
          td L or l
          td draw
          td draws a line from the current point to the next point. The new point becomes the current point. <strong>L</strong> means that following positions are absolute, <strong>l</strong> means relative.
        tr
          td H or h
          td draw an horizontal line
          td Akin to L,l H and h denote absolute and relative positioning.
        tr
          td V or v
          td draw a vertical line
          td Akin to L,l and H,h, V and v denote absolute and relative positioning.
        tr
          td C or c
          td Draw a cubic Bézier curve
          td Draw a curve from the current point, using (x1,y1) as the first control point, and (x2, y2) as the second control point. The same uppercase/lowercase to absolute/relative mapping is effective.
        tr
          td S or s
          td Draw a cubic Bézier curve, with reflection
          td Draw a curve following a C statement, with tensor points mirrored.
        tr
          td Q or q
          td Draw a quadratic Bézier curve
          td Quadratic Bézier curves have a single (x1, y1) tensor.
        tr
          td T and t
          td Draw a quadratic Bézier curve
          td Akin to S and s following a cubic Bézier curve, T and t are mirroring statements for a quadratic Bézier curve.
        tr
          td A and a
          td Draw a segment of an ellipse.
          td A statements draw a segment of an ellipse, given a start point, end point, x radius, y radius, rotation of the ellipse, and direction. Two additional parameters, large-arc and sweep, are flags giving directions on which part of the ellipse should be drawn.

    p With those elements in mind, we can decipher the above svg path, and annotate it :
    pre
      code
        | m 205.47289,169.14572 // Move to (205.47289, 169.14572)
        | c -1.08,0 -1.56,-0.6 -1.56,-1.64 // Cubic Bézier (relative, from last point, first tensor at (-1.08, 0), second tensor at (-1.56, -0.9), end point at (-1.56, -1.64))
    p This notation is a bit long, so we'll introduce "functions", that return the current point. Points will be a kind of tuples (x, y).</p>
    pre
      code
        | m 205.47289,169.14572 // move((205.47289, 169.14572))
        | c -1.08,0 -1.56,-0.6 -1.56,-1.64 // cubicRel(lp, (-1.08,0), (-1.56,-0.6), (-1.56,-1.64))
  
    p We can see a pattern emerging : a dependency on a global "current point" state. To write a parser/an interpreter, this isn't too uncommon. We could also think of this in a functional way, and use referential transparency at our advantage :
    pre
      code
        | m 205.47289,169.14572 // move((205.47289, 169.14572)) -> returns ((205.47289, 169.14572))
    p The last sample with two instructions becomes : 
    pre
      code
        | cubicRel((-1.08,0), (-1.56,-0.6), (-1.56,-1.64))
    p If we introduce the following instruction in the original path, another cubic Bézier curve, our path now looks like :
    pre
      code
        | cubicRel(
        | cubicRel(
        |   move((205.47289, 169.14572)),
        |   (-1.08,0), (-1.56,-0.6), (-1.56,-1.64))
        |  , (0,-3.4), (4.68,-7.48), (4.68,-12.04))
    p Well. As much as I like lisps, maybe a parser with a global state will be enough. I only aim to parse svg paths, so the table defined earlier on will be enough to guide us. Maybe, even, we could just avoid a global state and produce a list of instructions taking the last point as an argument, and reevaluating everything to absolute coordinates.
    pre
      code
        | move((205.47289, 169.14572)) // -> (205.47289, 169.14572)
        | cubicRel((205.47289, 169.14572),
        |  (204,39289, 169.14572),
        |  (203,91289, 168,54572),
        |  (203,91289, 167,50572)) // -> (203,91289, 167,50572)
    p This seems quite easy to generate ! Let's write the minimal amount of code to parse those two declarations to an AST, and produce this kind of pseudo-instruction list. I'm writing all of this in a html document, so I'll write in JS to get live examples quick and running.
    p Let's start by drafting a grammar allowing those two instructions to exist
    pre
      code
        | path = instructions*
        | instruction = move point | cubic point point point point
        | point = '('number','number')'
        | number = '-'?digit+'.'?digit+
        | digit = [0-9]
    <parser-first-step></parser-first-step>
    p This live example uses this code : 
    pre
      code
        | const Point = function(x, y) { this.x = x; this.y = y; };
        | const pointR = '(?:([-]*\\d+\\.?(?:\\d+)?),([-]*\\d+\\.?(?:\\d+)?))';
        | const moveRegex = new RegExp(`m\\s*${pointR}`, 'i');
        | const cubicRegex = new RegExp(`c\\s*${pointR}\\s${pointR}\\s${pointR}`, 'i');
        | const matchesToPoints = (token, matches) => {
        |   if (!matches) throw new Error(`Couldn't parse token ${token}`);
        |   const points = matches.slice(1);
        |   if (points.length % 2 !== 0) throw new Error(`Instruction contains an uneven number of coordinates.`);
        |   const out = [];
        |   for (let i = 0; i < points.length; i += 2) {
        |     out.push(new Point(points[i], points[i + 1]));
        |   }
        |   return out;
        | };
        | const move = token => matchesToPoints(token, token.match(moveRegex));
        | const cubic = token => matchesToPoints(token, token.match(cubicRegex));
        | const lex = (tokens) => {
        |   return tokens.map(t => {
        |     switch (t.charAt(0).toLowerCase()) {
        |       case "m":
        |         return {type: 'Move', params: move(t) };
        |       break;
        |       case "c":
        |         return {type: 'Cubic', params: cubic(t) };
        |       break;
        |       default:
        |         return;
        |       break;
        |     }
        |   });
        | };
        | const tokenize = text => text.split('\n').map(a => a.trim()).filter(a => a);
        | export const parse = text => lex(tokenize(text));
    p Still, we're assuming many things here. We need a list of newline-separated instructions, starting with their mnemonic. 
      | The input format is a list of instructions, without newlines, and mnemonics are only present at an instruction change.
      | That means <code>m point \n c point point point \n c point point point</code> won't ever be present.
      | We need a way to keep track of the current type of instruction, and take points accordingly.
      | <br>Let's do this !
    <parser-second-step></parser-second-step>

    p Well, it seems to work for those two instructions ! The current point is carried on, and we have independent instructions that are sufficient to render something.
    p We can try to render it to a list of expressions, akin to an example shown higher, then to a canvas.

    <parser-third-step></parser-third-step>

    p Nice ! We're now able to transform raw SVG path data to an abstract syntax tree, and transform it back to a list of absolute-positioned subpaths, or draw it to a canvas. But many instructions are missing, and the examples to this point just silence errors.
    p Let's implement h, l, and v instructions. H and V are just special cases of L where the current point Y or X coordinate is carried on.
    <parser-fourth-step></parser-fourth-step>

</template>

<script>
  import ParserFirstStep from './live/ParserFirstStep';
  import ParserSecondStep from './live/ParserSecondStep';
  import ParserThirdStep from './live/ParserThirdStep';
  import ParserFourthStep from './live/ParserFourthStep';

  export default {
    name: 'Programmatically',
    components: {
      ParserFirstStep,
      ParserSecondStep,
      ParserThirdStep,
      ParserFourthStep,
    },
  };
</script>

<style>
  
</style>