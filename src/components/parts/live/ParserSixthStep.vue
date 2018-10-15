<template>
  <div>
      <textarea class="textarea" v-model="input" @change="parseAndDisplay"></textarea>
      <foldable-pre>{{ result }}</foldable-pre>
      <canvas id="parserthirdstep-canvas" width="100" height="100"></canvas>
  </div>
</template>

<script>
  import { parse, tokenize, STATES, remapInstrs, convertToPoints } from './parserSixthStep';
  import { render as renderToString } from './renderToString2';
  import { render as renderToCanvas } from './renderToCanvas3';
  import FoldablePre from './../FoldablePre';

  export default {
    name: 'ParserSixthStep',
    components: {
      FoldablePre,
    },
    data() {
      return {
        input: `m 50,50 c -1.08,0 -1.56,-0.6 -1.56,-1.64 0,-3.4 4.68,-7.48 4.68,-12.04 0,-3 -1.88,-4.52 -4.84,-4.52 -3.52,0 -6.96,1.48 -10.4,7.2 h -0.56 c 2.08,-4.8 3.48,-8.48 3.48,-11.48 0,-2.24 -1.28,-3.36 -3.52,-3.36 -1.52,0 -3.12,0.44 -4.8,1.12 0.36,0.68 0.64,1.44 0.84,2.08 1.48,-0.68 2.48,-1.04 3.64,-1.04 1.28,0 1.84,0.6 1.84,1.76 0,2.92 -3.32,10.88 -8,23.16 0.8,0.12 1.44,0.24 2,0.48 l 0.12,0.04 c 5.68,-15.48 11.24,-18 14.92,-18 1.88,0 3.04,0.8 3.04,2.72 0,3.52 -4.68,7.64 -4.68,11.96 0,2.44 1.64,3.52 3.48,3.52 2.48,0 4.04,-1.56 6.08,-4.2 -0.72,-0.48 -1.12,-0.8 -1.68,-1.28 -1.4,2.28 -2.52,3.52 -4.08,3.52`,
        result: '',
      };
    },
    methods: {
      parseAndDisplay() {
        this.result = convertToPoints(remapInstrs(parse(this.input)));
        this.draw();
      },
      draw() {
        const c = this.$options.$context;
        c.fillStyle = 'lightblue';
        c.strokeStyle = 'black';
        c.fillRect(0,0, 100, 100);
        renderToCanvas(convertToPoints(remapInstrs(parse(this.input))), c);
      },
    },
    mounted() {
      this.$options.$canvas = this.$el.getElementsByTagName('canvas')[0];
      this.$options.$context = this.$options.$canvas.getContext('2d');
      this.parseAndDisplay();
    },
  };
</script>

<style>

</style>
