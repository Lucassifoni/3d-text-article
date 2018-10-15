<template>
  <div id="app">
    <article>
      <header>
        <div class="inner">
          <h1>{{ $options.$parts.title }}</h1>
        <p>{{ $options.$parts.description }}</p>
        </div>
      </header>
      <ab-toc>
        <ul>
          <li v-for="(part, index) in $options.$parts.parts" :key="index">
            <a :href="`#part-${index}`">#{{index}} - {{ part.title }}</a>
          </li>
        </ul>
      </ab-toc>
      <ab-content>
        <div v-for="(part, index) in $options.$parts.parts" :id="`#part-${index}`" :key="index">
          <h2>#{{ index }} - {{ part.title }}</h2>
          <h3>{{ part.description }}</h3>
          <component :is="part.component"></component>
        </div>
      </ab-content>
    </article>
  </div>
</template>

<script>
import AbContent from './components/Content';
import AbToc from './components/Toc';
import mapping from './components/mapping';
/* eslint-disable-next-line */
import highlight from './highlight/highlight.pack.js';

export default {
  name: 'app',
  $parts: mapping,
  components: {
    AbToc,
    AbContent,
  },
  mounted() {
    if (window && window.requestIdleCallback) {
      window.requestIdleCallback(() => {
        if (window.hljs) {
          window.hljs.initHighlighting();
        }
      });
    }
  }
};
</script>

<style>
@import '~bulma/css/bulma.min.css';
@import './highlight/mono-blue.css';

body {
  width: 100%;
  max-width: 1200px;
  margin: 1em auto;
}

article {
  font-family: serif;
  display: flex;
  flex-wrap: wrap;
}

pre {
  font-family: monospace;
  white-space: pre-wrap;
  padding: 0;
}

.Content, header {
  flex: 0 0 900px;
  margin-bottom: 1.6em;
}

.Toc {
  flex: 0 1 300px;
  order: -1;
  margin-bottom: 1.6em;
}

h3 {
  font-weight: bold;
  margin: 1em 0;
  font-size: 1.6em;
}

p {
  margin-bottom: 1.2em;
}

section {
  margin-bottom: 3em;
}

@media screen and (max-width: 1200px) {
  .Content, .Toc, header {
    margin-left: auto;
    margin-right: auto;
  }
  .Toc {
    flex: 0 0 900px;
  }
}
</style>
