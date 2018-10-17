<template lang="pug">
  section
    h2 A first manual attempt
    h3 How does a lead character look ?
    p A bit of context is needed on what I'm trying to attain. I'd like to be able to be self-sufficient on the production of lead-like movable characters and shapes.
    figure
      img(src="pictures/lead_type.jpg")
      span.author This image was originally posted to Flickr by quinet at https://flickr.com/photos/91994044@N00/25792503796.
    p In Toulouse, the place I live in southwestern France, some workshops offer their CNC machining services and are able to produce aluminum plates at the correct height for a typographic press. But I'd like a typographic press to become an experimentable tool, rather than a final process, marked by the need to be absolutely certain of a layout before sending it to be engraved.
    p A distinct, but crucial feature of engraved aluminum plates or lead type was that the shape to be printed wasn't just extruded out of its substrate. The shape emerges of a pillar similar to an offset of its outline. On the figure below, you can see this slight offset. Extruding a shape is obviously simple, but this gives strength to the character.
    figure
      img(src="pictures/lead_type_2.jpg")
      span.author Free picture by https://fr.freeimages.com/photo/lead-type-1-1460305
    h3 How can we reproduce this slope manually ?
    p Even more crucially, if I'm headed towards lost PLA aluminum casting with 3D printed counterforms, meaning another bee's nest, I'll start by using plastic characters to print. After some failed attempts years ago, they failed under pressure if the shape of the letter wasn't strengthened by this light slope.
    p This slope is quite tedious to generate manually : I start from path data from Inkscape or Illustrator, import it into Blender, extrude it, offset it with Offset Scale (Alt + S), intersect it with a regular cube to suppress distorsion from Offset Scale, export it to a STL file, clean it in Netfabb, and then slice it in Cura.
    figure
      img(src="pictures/letter_h_svg.jpg")
      span.author "h" bold italic in Input from FontBureau, in Inkscape
      img(src="pictures/letter_h_blender.jpg")
      span.author after an import and offset extrusion in Blender
      img(src="pictures/letter_h_netfabb.jpg")
      span.author then imported into Netfabb
      img(src="pictures/letter_h_cura.jpg")
      span.author and finally sliced in Cura
    p This process is tedious. I thought I could automate it, starting from SVG path data. The rest of this page shows how this was way more complex than I thought, and, after a week of exploration, it's obvious I should have thought of intersecting paths, paths with holes, concave shapes, and a lot more traps.
    figure
      img(src="pictures/u_3d.jpg")
      img(src="pictures/u_3d_print.jpg")
</template>

<script>
  export default {
    name: 'Manual',
  };
</script>

<style>
  
</style>