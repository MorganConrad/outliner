import * as cheerio from 'cheerio';

const TREE_DEFAULTS = {
  minH: 2,
  maxH: 3,
}

const HTML_DEFAULTS = {
  a: "",
  li: "",
  ul: "",
  linkRoot: "#",

  createA,
  createUL,
  openLI
};

const DEFAULT_H1 = { level: 1, id: ' ', text: ' ' };

class HNode {

  constructor(el, parent) {
    this.parent = parent;
    Object.assign(this, elInfo(el));
    this.children = [];
  }

  append(node) { this.children.push(node); }
}


export function buildOutline(inhtml, options) {
  let tree = buildTree(inhtml, options);
  let html = buildHTML(tree, options);

  return { tree, html }
}


/**
 * Builds just a tree of headers, not the final HTML
 * @param html String
 * @param {*} options
 * @returns HNode
 */
export function buildTree(html, options) {
  options = Object.assign({}, TREE_DEFAULTS, options);
  let selectors = [];
  for (let h = options.minH; h <= options.maxH; h++)
    selectors.push("h" + h);

  const ch = cheerio.load(html);
  const hTags = ch(selectors.join(','));
  const hTagsReversed = Array.from(hTags).reverse();

  let rootEl = options.rootEl || {};
  rootEl.level = options.minH - 1;
  const rootNode = new HNode(rootEl);
  // console.dir(rootNode);
  let node = rootNode;

  while (node = next1(node, hTagsReversed.pop()))
    ;

  return rootNode;
}


function next1(prevNode, nextTag) {

  if (!nextTag)
    return false;

  let dl = hLevel(nextTag) - prevNode.level;
  // console.log(prevNode.level + "  " + nextTag.name + " dl=" + dl);
  while (dl < 0) {
    prevNode = prevNode.parent;
    dl++;
  }

  if (dl > 1)
    throw Error("Header tags may not skip levels");

  let parentNode = (dl > 0) ? prevNode : prevNode.parent;
  let nextNode = new HNode(nextTag, parentNode);
  parentNode.append(nextNode);

  return nextNode;
}


/**
 * Given a tree produced by buildTree, produce the outlint HTML
 * @param HNode rootNode
 * @param {} options
 * @param boolean keepRoot
 * @returns
 */
export function buildHTML(rootNode, options) {
  options = Object.assign({}, HTML_DEFAULTS, options);
  let skipFirst = !options.rootEl;
  return recur(rootNode, options, skipFirst);
}


function recur(node, options, skipFirst) {

  // unless skipFirst, create the two parts of the LI tag
  let _openLI = skipFirst ? '' : options.openLI(node, options);
  let _closeLI = skipFirst ? '' : '</li>'

  // create UL for the children
  let childrenHTML = node.children.map((n) => recur(n, options));
  let ul = options.createUL(node, childrenHTML, options);

  return `${_openLI}${ul}${_closeLI}`;
}


function createA(node, options) {
  let href = node.id.startsWith("http") ? node.id : `${options.linkRoot}${node.id}`;
  return `<a ${options.a} href="${href}">${node.text}</a>`;
}

function openLI(node, options) {
  let a = node.id ? options.createA(node, options) : node.text;
  return `<li ${options.li}>${a}`;
}

function createUL(node, children, options) {
  // note, node is unused in this implementation
  if (children.length) {
    let childrenHTML = children.join('\n');
    return `\n<ul ${options.ul}>\n${childrenHTML}\n</ul>`;
  }
  else
    return '';
}


// get inner text fro a cheerio element
function getInnerText(chel) {
  return chel.children
    .filter((c) => c.type === 'text')
    .map((c) => c.data)
    .join('');
}

// get element info from an object or cheerio element
function elInfo(el) {
  let attribs = el.attribs || {};
  let level = el.level == null ? hLevel(el) : el.level;
  return {
    attribs,
    id: el.id || attribs.id || '',
    level,
    name: el.name || "h" + level,
    text: el.text ||
          (el.children ? getInnerText(el) : '')
  }
}

function hLevel(h = {}) {
  let name = h.name || "h0";
  return parseInt(name[1]);
}
