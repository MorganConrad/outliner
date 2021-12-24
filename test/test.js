import { readFileSync } from "fs";
import { test } from "tape";
import { buildTree, buildHTML } from '../outliner.js';

// setup - need to recreate these each time
function readFile(path, meta = {}) {
  // let contents = readFileSync('./data/' + path, { encoding: "utf8"} );
  let contents = readFileSync('./test/data/' + path, { encoding: "utf8"} );
  meta.contents = contents;

  return meta;
}


test('tree', function(t) {
  const file = readFile('outline1.html');
  let tree = buildTree(file.contents);

  t.false(tree.parent);
  t.equal(tree.children.length, 3);
  t.equal(tree.children[0].id, '1');
  t.equal(tree.children[0].text, 'Heading 1');
  t.equal(tree.children[0].level, 2);
  t.equal(tree.children[0].children.length, 0);

  t.end();
});

const EXPECTED_HTML = `
<ul class="ul">
<li ><a class="a" href="#1">Heading 1</a></li>
<li ><a class="a" href="#2">Heading 2</a>
<ul class="ul">
<li ><a class="a" href="#2.1">Heading 2.1</a></li>
<li ><a class="a" href="#2.2">Heading 2.2</a></li>
<li ><a class="a" href="#2.3">Heading 2.3</a></li>
</ul></li>
<li ><a class="a" href="#3">Heading 3</a></li>
</ul>`;


test('html', function(t) {
  const file = readFile('outline1.html');
  let tree = buildTree(file.contents);
  let html = buildHTML(tree, { a:'class="a"', ul: 'class="ul"' });
  // let lines = html.split('\n');

  t.equal(html, EXPECTED_HTML);
  t.end();
});


const TEST_OPTS = {
  rootEl: { level: 1, text: "Lorem Ipsum" },
  a:'class="a"',
  ul: 'class="ul"'
};

test('html with passed in H1', function(t) {
  const file = readFile('outline1.html');
  let tree = buildTree(file.contents, TEST_OPTS);
  let html = buildHTML(tree, TEST_OPTS);

  let expect = "<li >Lorem Ipsum" + EXPECTED_HTML + "</li>";

  t.equal(html, expect);
  t.end()
});
