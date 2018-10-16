<template lang="pug">
#app
  header
    nav
      a(href="'https://lucassifoni.info'") &larr; back to lucassifoni.info
    h1 Explorations on creating lead type from SVG shapes
    p A notebook about trying to find a silver bullet to automate a tedious manual process.
      | <br>After a bit of manual work, I decided to automate this process.
      | It turns out that this process was absolutely non-trivial, and that I'd better develop a strict framework and guidelines around doing it manually.

  main.Content
    article
      manual
      programmatically
</template>

<script>
import Manual from './components/parts/Manual';
import Programmatically from './components/parts/Programmatically';
/* eslint-disable-next-line */
import highlight from './highlight/highlight.pack.js';

export default {
  name: 'app',
  components: {
    Manual,
    Programmatically,
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
@import './highlight/mono-blue.css';

html * {
  box-sizing: border-box;
}

body {
  width: 100%;
  max-width: 960px;
  margin: 2em auto;
  padding: 1em;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAABCCAYAAAACPxW5AAACPUlEQVRogd1bS7IDIQj0/ufMNmfgrWYqlSg00CjzepXMKKj8MRkiIu+XLKG90xCd56H3+ez6/P1ssBfF3lgWQ3t5esMM/vcGZ+KuYGgB5WGp7AVVghZD5kFUHd6oJN7BQf1I8LTdsWmbKspiZM2L2p41b+pkWNgpyVkcFCGpaIWtsQ5ndAnMpV7UYuDV+ypE+E6dTFblrBwxCw8tVybjJa6Nt+hkD+SaD4cJhCFrUUwsN1gR8D3qakkeXV840DPAkphGh+pkUOz0wi4JompTkXZFD2VrLsqagz4TATKZUyUPq/AtKZc8i2G9X0pQJ/l8TLtqGVuJ5q1V7Y+0BLsn3v9GRVe5NBzo0c4yugjWWLhlUYmTnrks0O+2TShMVLcM0eqCuY42PZkZGDYeqiZOH0q6ZVHFzCsRBm+6F2XaEyO7Odr4rcb7lbhd0tStUv0sNTdb9x5mnrFVlyvauFuC3eGp4L9xx0GNSJWNZXswSDhLSZBZw2XmaXBvMOtQdnlcuHW/KyBn6VF7MuyMpALuy5cI8dV3Bk0UbaqJqC1bjs59u7TDnpjjHxHoRfAD/0nVTgRxxniUXtqLas86APo5ZffmroYjNpjNQT3zqPVgRzV1/+L3RHc6M7dd49fqnXoP7TFxMIqtGzxho7Rqgm2brMMorQcrnQzck4kw2JWIIzStCxz4doklyWjSHAUkQbT26oiSv/agjgfpjmftEyqXOqRi0Y1S4yByEExJIWiXyWRUcjY3fX1mOZ5dOesKf2a9V39bDHoAAAAAAElFTkSuQmCC);
}

figure {
  width: 100%;
  max-width: 600px;
}

figure img {
  width: 100%;
  height: auto;
}

figure span.author {
  display: block;
  font-style: italic;
  color: darkgrey;
  font-size: 0.85em;
  margin-bottom: 1em;
}

h1, h2, h3, h4 {
  font-family: sans-serif;
  font-weight: 500;
}

section h2, section h3 {
  margin-top: 2em;
}

p {
  font-family: serif;
  max-width: 70ch;
  line-height: 1.4;
}

p code {
  display: inline-block;
  background: lightpink;
  font-size: 1em;
  padding: 1px 3px;
}

pre {
  font-family: monospace;
  font-size: 14px;
  white-space: pre-wrap;
  padding: 0;
}

p {
  margin-bottom: 1.2em;
}

textarea {
  width: 100%;
  max-width: 960px;
  min-height: 5em;
  padding: .5em;
  background: #ffffc8;
}

section {
  margin-bottom: 3em;
}

a {
  font-weight: 700;
  color: orangered;
}

table {
  padding: 5px;
}

tr {
  padding: 5px;
}

td, th {
  padding: 5px; 
  border: 1px solid lightgrey;
}

figure {
  margin-left: 0;
  padding-left: 1em;
}
</style>
