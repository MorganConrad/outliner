outliner
====

Convert Heading tags (h2, h3, ...) to an outline with links.  _e.g._

```html
<body>
  <h1>Top Heading</h1>
    <h2 id="1">Heading 1</h2>
    lorem ipsum
    <h2 id="2">Heading 2</h2>
    lorem ipsum
      <h3 id="2.1">Heading 2.1</h3>
      lorem ipsum
      <h3 id="2.2">Heading 2.2</h3>
      lorem ipsum
      <h3 id="2.3">Heading 2.3</h3>
      lorem ipsum
        <h4 id="2.3.1">Heading 2.3.1</h4>
          lorem ipsum
        <h4 id="2.3.2">Heading 2.3.2</h4>
          lorem ipsum

    <h2 id="3">Heading 3</h2>
</body>
```
becomes something like (spacing added for clarity):

```html
<ul class="outliner-ul">
  <li ><a class="outliner-a" href="#1">Heading 1</a></li>
  <li ><a class="outliner-a" href="#2">Heading 2</a>
    <ul class="outliner-ul">
      <li ><a class="outliner-a" href="#2.1">Heading 2.1</a></li>
      <li ><a class="outliner-a" href="#2.2">Heading 2.2</a></li>
      <li ><a class="outliner-a" href="#2.3">Heading 2.3</a></li>
    </ul>
  </li>
  <li ><a class="outliner-a" href="#3">Heading 3</a></li>
</ul>
```



## Usage

```js
import { buildOutline } from "outliner";

let inputHtml = get html from your webpage

let outline = buildOutline(inputHtml, options);

// insert outline.html into your web page somewhere
```

## Options

### minH (default = 2)

&nbsp;&nbsp;Minimum header level to use

### maxH (default = 3)

&nbsp;&nbsp;Maximum header level to use

### linkRoot (default = "#")

&nbsp;&nbsp;Preprend this to all created hrefs, _unless_ they start with "http"

### a (default = '')

&nbsp;&nbsp;Add this inside all a tags.  In the example above, `options.a = 'class="outliner-a"'`

### ul (default = '')

&nbsp;&nbsp;Add this inside all ul tags.  In the example above, `options.ul = 'class="outliner-ul"'`

### li (default = '')

&nbsp;&nbsp;Add this inside all a tags.  In the example above, `options.li = ''`

### rootEl (default = null)

&nbsp;&nbsp;A "root node" is needed to hold the headings, at least temporarily.  By default, one will be created, and then "left out" when creating the resulting outline.  However, if you want it kept, provide an object here for the rootElement.  It may contain

```
{
   id,    // the href or id
   text
}
```

## Complex Options

By passing functions for `createA`, `createUL`, or `openLI` you can take near complete control over the format of your outline.  All three take the form (e.g. createA)

```js
function createA(node, options) {
  // return a string bound by '<a ...> ... </a>
}

function createUL(node, children, options) {
  // return a string bound by '<ul ...> ... </ul>
  // (or, if you prefer order, <ol ... </ol>)
}

function openLI(node, options) {
  // return a string starting with '<li ...
  // the code will add a closing </li> when appropriate
}

```

The `node` is an instance of an HNode, with the fields

```js
{
  parent: an HNode or null,
  children: HNode[],
  attribs: {},
  id: a String, or '', used for the href link
  level: integer, for example 2 for an h2,
  name: string, for example "h2",
  text: string or ''
}
```
