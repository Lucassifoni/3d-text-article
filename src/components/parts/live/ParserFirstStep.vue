<template>
  <div>
    <textarea class="textarea" v-model="input" @change="parseAndDisplay"></textarea>
    <foldable-pre>{{ JSON.stringify(result, null, 2) }}</foldable-pre>
  </div>
</template>

<script>
  import { parse } from './parserFirstStep';
  import FoldablePre from "../FoldablePre";

  export default {
    name: 'ParserFirstStep',
      components: {FoldablePre},
      data() {
      return {
        input: `m 205.47289,169.14572
c -1.08,0 -1.56,-0.6 -1.56,-1.64`,
        result: [],
      };
    },
    methods: {
      parseAndDisplay() {
        this.result = parse(this.input);
      },
    },
    mounted() {
      this.parseAndDisplay();
    },
  };
</script>

<style>

</style>
