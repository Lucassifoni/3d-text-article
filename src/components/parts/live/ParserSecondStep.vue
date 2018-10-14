<template>
  <div>
    <p>We need to have a kind of state-machine, starting at an undetermined state, and chewing through text obeying rules for the current state, and a list of transitions between states. Here's some pseudo-code defining those principles. We'll write a basic parser that aims to keep track of the current point and generate a list of independent instructions.</a></p>
    <p>We'll also translate all coordinates to absolute.</p>
    <textarea class="textarea" v-model="input" @change="parseAndDisplay"></textarea>
    <pre>
<code>
States : {{ JSON.stringify(STATES) }}

Tokenizing : trim, then split at spaces.
{{ JSON.stringify(result1) }}

Lexing : transform this into a list of instructions.
{{ JSON.stringify(result2, null, 2) }}
      </code>
    </pre>
  </div>
</template>

<script>
  import { parse, tokenize, STATES } from './parserSecondStep';

  export default {
    name: 'ParserFirstStep',
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