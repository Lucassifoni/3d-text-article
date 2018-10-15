<template>
  <div class="FoldablePre">
      <pre :class="open ? 'open' : ''"><code><slot></slot></code></pre>
      <small @click="open = !open" v-if="!open">Code sample is folded. Open it ?</small>
      <small @click="open = !open" v-else>Code sample is unfolded. Close it ?</small>
  </div>
</template>

<script>
  export default {
    name: 'FoldablePre',
    data() {
      return {
        open: false,
      };
    },
  };
</script>

<style>
 .FoldablePre {
    margin-bottom: 1em;
 }

 .FoldablePre code {
     display: block;
 }

 .FoldablePre code {
     max-height: 10em;
     overflow-y: scroll;
 }

 .FoldablePre small {
     color: grey;
     text-decoration: underline;
 }

 .FoldablePre pre.open code {
     max-height: 800px;
     overflow-y: scroll;
 }
</style>
