<template>
  <section>
    <pre>
      <code>&lt;path style="stroke:#130000;stroke-opacity:1;stroke-width:4.42498882;stroke-miterlimit:4;stroke-dasharray:none;paint-order:markers stroke fill;fill:#ff0000;fill-opacity:1"
d="m 205.47289,169.14572 c -1.08,0 -1.56,-0.6 -1.56,-1.64 0,-3.4 4.68,-7.48 4.68,-12.04 0,-3 -1.88,-4.52 -4.84,-4.52 -3.52,0 -6.96,1.48 -10.4,7.2 h -0.56 c 2.08,-4.8 3.48,-8.48 3.48,-11.48 0,-2.24 -1.28,-3.36 -3.52,-3.36 -1.52,0 -3.12,0.44 -4.8,1.12 0.36,0.68 0.64,1.44 0.84,2.08 1.48,-0.68 2.48,-1.04 3.64,-1.04 1.28,0 1.84,0.6 1.84,1.76 0,2.92 -3.32,10.88 -8,23.16 0.8,0.12 1.44,0.24 2,0.48 l 0.12,0.04 c 5.68,-15.48 11.24,-18 14.92,-18 1.88,0 3.04,0.8 3.04,2.72 0,3.52 -4.68,7.64 -4.68,11.96 0,2.44 1.64,3.52 3.48,3.52 2.48,0 4.04,-1.56 6.08,-4.2 -0.72,-0.48 -1.12,-0.8 -1.68,-1.28 -1.4,2.28 -2.52,3.52 -4.08,3.52 z"
id="path1702" /&gt;
</code>
</pre>
<p>We'll also keep the SVG Stroke spec in a tab, because an implementation of a stroke algorithm is outlined. <a href="https://www.w3.org/TR/svg-strokes/#SpecifyingStrokePaint">W3 SVG spec</a></p>
<p>
  According to <a href="http://svgpocketguide.com/book/#section-2">the SVG Pocket Guide</a>, the "d" attribute contains instructions with mnemonics and values, respectively :
</p>
<table class="table striped">
  <thead>
    <th>mne</th><th>meaning</th><th>observations</th>
  </thead>
  <tbody>
    <tr>
      <td>m or M</td><td>move to</td><td>akin to a pen lift. a path must start with a M command.</td>
    </tr>
    <tr>
      <td>z or Z</td><td>close path</td><td>closes the current subpath. draws a straight line between that point and the initial point of the subpath. If a M instruction follows, the next subpath starts at the newly-defined coordinate. Else, the next subpath starts at the same point.</td>
    </tr>
    <tr>
      <td>L or l</td><td>draw</td><td>draws a line from the current point to the next point. The new point becomes the current point. <strong>L</strong> means that following positions are absolute, <strong>l</strong> means relative.</td>
    </tr>
    <tr>
      <td>H or h</td><td>draw an horizontal line</td><td>Akin to L,l H and h denote absolute and relative positioning.</td>
    </tr>
    <tr>
      <td>V or v</td><td>draw a vertical line</td><td>Akin to L,l and H,h, V and v denote absolute and relative positioning.</td>
    </tr>
    <tr>
      <td>C or c</td><td>Draw a cubic Bézier curve</td><td>Draw a curve from the current point, using (x1,y1) as the first control point, and (x2, y2) as the second control point. The same uppercase/lowercase to absolute/relative mapping is effective.</td>
    </tr>
    <tr>
      <td>S or s</td><td>Draw a cubic Bézier curve, with reflection</td><td>Draw a curve following a C statement, with tensor points mirrored.</td>
    </tr>
    <tr>
      <td>Q or q</td><td>Draw a quadratic Bézier curve</td><td>Quadratic Bézier curves have a single (x1, y1) tensor.</td>
    </tr>
    <tr>
      <td>T and t</td><td>Draw a quadratic Bézier curve</td><td>Akin to S and s following a cubic Bézier curve, T and t are mirroring statements for a quadratic Bézier curve.</td>
    </tr>
    <tr>
      <td>A and a</td><td>Draw a segment of an ellipse.</td><td>A statements draw a segment of an ellipse, given a start point, end point, x radius, y radius, rotation of the ellipse, and direction. Two additional parameters, large-arc and sweep, are flags giving directions on which part of the ellipse should be drawn.</td>
    </tr>
  </tbody>
</table>
<p>With those elements in mind, we can decipher the above svg path, and annotate it :</p>
<pre>
  <code>
m 205.47289,169.14572 // Move to (205.47289, 169.14572)
c -1.08,0 -1.56,-0.6 -1.56,-1.64 // Cubic Bézier (relative, from last point, first tensor at (-1.08, 0), second tensor at (-1.56, -0.9), end point at (-1.56, -1.64))
  </code>
</pre>
<p>This notation is a bit long, so we'll introduce "functions", that return the current point. Points will be a kind of tuples (x, y).</p>
<pre>
  <code>
m 205.47289,169.14572 // move((205.47289, 169.14572))
c -1.08,0 -1.56,-0.6 -1.56,-1.64 // cubicRel(lp, (-1.08,0), (-1.56,-0.6), (-1.56,-1.64))
</code>
</pre>
<p>We can see a pattern emerging : a dependency on a global "current point" state. To write a parser/an interpreter, this isn't too uncommon. We could also think of this in a functional way, and use referential transparency at our advantage :</p>
<pre>
  <code>
m 205.47289,169.14572 // move((205.47289, 169.14572)) -> returns ((205.47289, 169.14572))
</code>
</pre>
<p>
  The last sample with two instructions becomes : 
</p>
<pre>
  <code>
cubicRel((-1.08,0), (-1.56,-0.6), (-1.56,-1.64))
  </code>
</pre>
<p>
  If we introduce the following instruction in the original path, another cubic Bézier curve, our path now looks like :
</p>
<pre>
  <code>
cubicRel(
  cubicRel(
    move((205.47289, 169.14572)),
    (-1.08,0), (-1.56,-0.6), (-1.56,-1.64))
  , (0,-3.4), (4.68,-7.48), (4.68,-12.04))
  </code>
</pre>
<p>
  Well. Maybe a parser with a global state will be enough. I only aim to parse svg paths, so the table defined earlier on will be enough to guide us. Maybe, even, we could just avoid a global state and produce a list of instructions taking the last point as an argument, and reevaluating everything to absolute coordinates.
</p>
<pre>
  <code>
move((205.47289, 169.14572)) // -> (205.47289, 169.14572)
cubicRel((205.47289, 169.14572),
  (204,39289, 169.14572),
  (203,91289, 168,54572),
  (203,91289, 167,50572)) // -> (203,91289, 167,50572)
  </code>
</pre>
<p>
  This seems quite easy to generate ! Let's write the minimal amount of code to parse those two declarations to an AST, and produce this kind of pseudo-instruction list. I'm writing all of this in a html document, so I'll write in JS to get live examples quick and running.
</p>
<p>Let's start by drafting a grammar allowing those two instructions to exist</p>
<pre>
  <code>
    path = instructions*
    instruction = move point | cubic point point point point
    point = (number, number)
  </code>
</pre>
<parser-first-step></parser-first-step>
  </section>
</template>

<script>
  import ParserFirstStep from './live/ParserFirstStep';

  export default {
    name: 'Programmatically',
    components: {
      ParserFirstStep,
    },
  };
</script>

<style>
  
</style>