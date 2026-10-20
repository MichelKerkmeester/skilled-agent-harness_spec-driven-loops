// ───────────────────────────────────────────────────────────────────
// MODULE: Plugin Inventory Reader
// ───────────────────────────────────────────────────────────────────
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const PLUGIN_DIR = path.resolve(__dirname, '..', '..');

// The plugin tests sit outside the dependency tree that holds the parser, so it is resolved from
// the repository root once here instead of being looked up beside this helper.
const REPO_ROOT = path.resolve(PLUGIN_DIR, '..', '..');
const { parseAst } = createRequire(path.join(REPO_ROOT, '.skilled', 'package.json'))('rolldown/parseAst');

// ─────────────────────────────────────────────────────────────────────────────
// 3. MANIFEST READERS
// ─────────────────────────────────────────────────────────────────────────────

function readManifest(pluginDir = PLUGIN_DIR) {
  const manifestPath = path.join(pluginDir, 'tests', 'plugin-inventory.json');
  return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
}

function listPluginFiles(pluginDir) {
  return fs
    .readdirSync(pluginDir, { withFileTypes: true })
    .filter((entry) => entry.name.endsWith('.js') && !entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function readInventory(pluginDir = PLUGIN_DIR, manifest = readManifest(pluginDir)) {
  const files = listPluginFiles(pluginDir);
  const existingFiles = new Set(files);
  const nativeDualFiles = new Set(manifest.nativeDual.map((entry) => entry.file));
  const bridged = [];
  const nativeDual = [];
  const problems = [];

  for (const file of files) {
    const stem = file.slice(0, -path.extname(file).length);
    let source = '';
    try {
      source = fs.readFileSync(path.join(pluginDir, file), 'utf8');
    } catch (error) {
      // A symlink whose build target is missing reads as absent; any other failure is a real error.
      if (error.code !== 'ENOENT') throw error;
    }
    const isBridged = source.includes(`dualPlugin('${stem}'`);

    if (isBridged) bridged.push(stem);
    if (nativeDualFiles.has(file)) nativeDual.push(stem);
    if (!isBridged && !nativeDualFiles.has(file)) {
      problems.push(`${file} is not bridged and not listed as a native-dual exception`);
    }
    if (isBridged && nativeDualFiles.has(file)) {
      problems.push(`${file} is bridged and also listed as native-dual`);
    }
  }

  for (const file of nativeDualFiles) {
    if (!existingFiles.has(file)) {
      problems.push(`${file} is listed as native-dual but has no file`);
    }
  }

  return {
    bridged: bridged.sort(),
    nativeDual: nativeDual.sort(),
    problems,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. EVENT READERS
// ─────────────────────────────────────────────────────────────────────────────

// An event name is a dotted lowercase path; a bare word next to a type check is not one.
const EVENT_NAME = /^[a-z]+(?:\.[a-z_]+)+$/;
const COMPARISON_OPERATORS = new Set(['===', '!==', '==', '!=']);
// A collection stays readable only while every use is a read through one of these members;
// anything else could change it or hand it to code that does.
const COLLECTION_MEMBERS = new Set([
  'has',
  'includes',
  'indexOf',
  'lastIndexOf',
  'length',
  'size',
  'at',
  'forEach',
  'some',
  'every',
  'find',
  'filter',
  'map',
  'join',
  'values',
  'keys',
  'entries',
]);

function text(source, node) {
  return source.slice(node.start, node.end);
}

// The tree has no parent links, so one generic walk records every node together with the parent
// that owns it; a method call is reported with its enclosing test, which needs that link.
function walkAst(root) {
  const nodes = [];
  const stack = [{ node: root, parent: null }];

  while (stack.length > 0) {
    const entry = stack.pop();
    nodes.push(entry);

    for (const key of Object.keys(entry.node)) {
      const value = entry.node[key];
      if (Array.isArray(value)) {
        for (let index = value.length - 1; index >= 0; index -= 1) {
          const child = value[index];
          if (child !== null && typeof child === 'object' && typeof child.type === 'string') {
            stack.push({ node: child, parent: entry.node });
          }
        }
      } else if (value !== null && typeof value === 'object' && typeof value.type === 'string') {
        stack.push({ node: value, parent: entry.node });
      }
    }
  }

  return nodes;
}

// Only a string the program cannot rebuild at runtime can name one event.
function staticString(node) {
  if (node === null || node === undefined) return undefined;
  if (node.type === 'Literal' && typeof node.value === 'string') return node.value;
  if (node.type === 'TemplateLiteral' && node.expressions.length === 0) {
    return node.quasis[0].value.cooked;
  }
  return undefined;
}

// A comparison against nothing says no event arrived, so there is no name to read or report.
function isNothing(node) {
  return (
    (node.type === 'Identifier' && node.name === 'undefined') ||
    (node.type === 'Literal' && node.value === null)
  );
}

function isEventType(node, aliases) {
  if (node === null || node === undefined) return false;

  // The parser wraps an optional chain around its member expression, which is still the field.
  if (node.type === 'ChainExpression') return isEventType(node.expression, aliases);

  if (node.type === 'Identifier') {
    return node.name === 'type' || node.name.endsWith('Type') || aliases.has(node.name);
  }

  // A bracket key reaches the same field as a dot, so both spellings count alike.
  if (node.type === 'MemberExpression') {
    if (node.computed) {
      return node.property.type === 'Literal' && node.property.value === 'type';
    }
    return node.property.type === 'Identifier' && node.property.name === 'type';
  }

  return false;
}

// A local name can carry the type field too, including one destructured out of it, so aliases are
// collected to a fixed point before the main walk reads any comparison or switch.
function collectEventTypeAliases(nodes) {
  const aliases = new Set();
  let changed = true;

  while (changed) {
    changed = false;
    for (const { node } of nodes) {
      if (node.type !== 'VariableDeclarator') continue;

      if (node.id.type === 'Identifier') {
        if (aliases.has(node.id.name) || !isEventType(node.init, aliases)) continue;
        aliases.add(node.id.name);
        changed = true;
        continue;
      }

      if (node.id.type !== 'ObjectPattern') continue;
      for (const property of node.id.properties) {
        if (property.type !== 'Property' || property.computed) continue;
        const key = property.key;
        const namesType =
          (key.type === 'Identifier' && key.name === 'type') ||
          (key.type === 'Literal' && key.value === 'type');
        if (!namesType) continue;
        if (property.value.type !== 'Identifier' || aliases.has(property.value.name)) continue;
        aliases.add(property.value.name);
        changed = true;
      }
    }
  }

  return aliases;
}

function collectDeclarators(nodes) {
  const declarators = new Map();

  for (const { node, parent } of nodes) {
    if (node.type !== 'VariableDeclarator' || node.id.type !== 'Identifier') continue;
    const entries = declarators.get(node.id.name);
    const entry = { declarator: node, declaration: parent };
    if (entries === undefined) declarators.set(node.id.name, [entry]);
    else entries.push(entry);
  }

  return declarators;
}

// Names in binding positions and object keys do not use the value, so they cannot make a
// collection escape.
function isBindingIdentifier(node, parent) {
  if (parent === null) return false;
  if (parent.type === 'VariableDeclarator') return parent.id === node;
  if (
    parent.type === 'FunctionDeclaration' ||
    parent.type === 'FunctionExpression' ||
    parent.type === 'ArrowFunctionExpression'
  ) {
    return parent.params.includes(node);
  }
  if (parent.type === 'CatchClause') return parent.param === node;
  if (parent.type === 'ClassDeclaration' || parent.type === 'ClassExpression') {
    return parent.id === node;
  }
  if (
    parent.type === 'ImportSpecifier' ||
    parent.type === 'ImportDefaultSpecifier' ||
    parent.type === 'ImportNamespaceSpecifier'
  ) {
    return parent.local === node;
  }
  if (parent.type === 'MemberExpression' && parent.property === node && !parent.computed) {
    return true;
  }
  if (
    parent.type === 'Property' &&
    parent.key === node &&
    parent.value !== node &&
    !parent.computed
  ) {
    return true;
  }
  if (
    (parent.type === 'MethodDefinition' || parent.type === 'PropertyDefinition') &&
    parent.key === node &&
    !parent.computed
  ) {
    return true;
  }
  if (
    parent.type === 'LabeledStatement' ||
    parent.type === 'BreakStatement' ||
    parent.type === 'ContinueStatement'
  ) {
    return parent.label === node;
  }
  return false;
}

// A collection whose name is read any other way can be changed or exported, which makes its
// literal contents unable to describe what the check actually sees.
function isCollectionReferenceOnly(name, declarationId, nodes) {
  for (const { node, parent } of nodes) {
    if (node.type !== 'Identifier' || node.name !== name) continue;
    if (node === declarationId || isBindingIdentifier(node, parent)) continue;
    if (
      parent !== null &&
      parent.type === 'MemberExpression' &&
      parent.object === node &&
      !parent.computed &&
      parent.property.type === 'Identifier' &&
      COLLECTION_MEMBERS.has(parent.property.name)
    ) {
      continue;
    }
    return false;
  }

  return true;
}

// A receiver resolves only when its whole contents are literal event names and its name never
// leaves the file; every other receiver is reported instead of guessed.
function resolveCollection(node, context, resolving = new Set()) {
  if (node === null || node === undefined) return null;

  if (node.type === 'ArrayExpression') {
    const names = [];
    for (const element of node.elements) {
      if (element === null) return null;
      const value = staticString(element);
      if (value === undefined || !EVENT_NAME.test(value)) return null;
      names.push(value);
    }
    return names;
  }

  if (node.type === 'NewExpression') {
    if (node.callee.type !== 'Identifier' || node.callee.name !== 'Set') return null;
    if (node.arguments.length !== 1 || node.arguments[0].type !== 'ArrayExpression') return null;
    return resolveCollection(node.arguments[0], context, resolving);
  }

  if (node.type === 'CallExpression') {
    const callee = node.callee;
    if (
      callee.type === 'MemberExpression' &&
      !callee.computed &&
      callee.object.type === 'Identifier' &&
      callee.object.name === 'Object' &&
      callee.property.type === 'Identifier' &&
      callee.property.name === 'freeze' &&
      node.arguments.length === 1 &&
      node.arguments[0].type === 'ArrayExpression'
    ) {
      return resolveCollection(node.arguments[0], context, resolving);
    }
    return null;
  }

  if (node.type !== 'Identifier') return null;

  const name = node.name;
  const entries = context.declarators.get(name);
  if (entries === undefined || entries.length !== 1) return null;

  const { declarator, declaration } = entries[0];
  if (
    declaration === null ||
    declaration === undefined ||
    declaration.type !== 'VariableDeclaration' ||
    declaration.kind !== 'const'
  ) {
    return null;
  }
  // A cycle never settles on a value, so it stays unresolved rather than recursing forever.
  if (resolving.has(name)) return null;

  resolving.add(name);
  try {
    const names = resolveCollection(declarator.init, context, resolving);
    if (names === null) return null;
    return isCollectionReferenceOnly(name, declarator.id, context.nodes) ? names : null;
  } finally {
    resolving.delete(name);
  }
}

// Only a literal on the other side names an event; every other operand is reported because it
// could select any event at runtime.
function readComparison(node, source, aliases, handled, unscanned) {
  const leftIsType = isEventType(node.left, aliases);
  const rightIsType = isEventType(node.right, aliases);

  if (leftIsType && rightIsType) {
    unscanned.add(text(source, node));
    return;
  }
  if (!leftIsType && !rightIsType) return;

  const other = leftIsType ? node.right : node.left;
  const value = staticString(other);
  if (value !== undefined) {
    if (EVENT_NAME.test(value)) handled.add(value);
    return;
  }
  if (!isNothing(other)) unscanned.add(text(source, node));
}

// A case label names an event only when it is a literal; every other label is read at runtime.
function readSwitch(node, source, aliases, handled, unscanned) {
  if (!isEventType(node.discriminant, aliases)) return;

  for (const switchCase of node.cases) {
    if (switchCase.test === null) continue;
    const value = staticString(switchCase.test);
    if (value !== undefined) {
      if (EVENT_NAME.test(value)) handled.add(value);
    } else {
      unscanned.add(`case ${text(source, switchCase.test)}:`);
    }
  }
}

// A membership call on the type reads the receiver's contents; an unresolved receiver is reported
// because the events it covers are otherwise invisible.
function readCall(node, parent, source, aliases, context, handled, unscanned) {
  const callee = node.callee;
  if (callee.type !== 'MemberExpression') return;

  const property =
    !callee.computed && callee.property.type === 'Identifier' ? callee.property.name : null;
  const firstArgument = node.arguments[0];

  if (
    (property === 'has' || property === 'includes') &&
    firstArgument !== undefined &&
    isEventType(firstArgument, aliases)
  ) {
    const names = resolveCollection(callee.object, context);
    if (names === null) unscanned.add(text(source, node));
    else for (const name of names) handled.add(name);
    return;
  }

  // A method on the type can select events the scan cannot read, so a comparison is reported with
  // its method call and a bare call is reported alone.
  if (!isEventType(callee.object, aliases)) return;

  const parentIsComparison =
    parent !== null &&
    parent.type === 'BinaryExpression' &&
    COMPARISON_OPERATORS.has(parent.operator);
  unscanned.add(text(source, parentIsComparison ? parent : node));
}

function scanEvents(source) {
  const nodes = walkAst(parseAst(source, { lang: 'js' }));
  const aliases = collectEventTypeAliases(nodes);
  const context = { nodes, declarators: collectDeclarators(nodes) };
  const handled = new Set();
  const unscanned = new Set();

  for (const { node, parent } of nodes) {
    if (node.type === 'BinaryExpression') {
      if (COMPARISON_OPERATORS.has(node.operator)) {
        readComparison(node, source, aliases, handled, unscanned);
      } else if (node.operator === 'in' && isEventType(node.left, aliases)) {
        unscanned.add(text(source, node));
      }
      continue;
    }

    if (node.type === 'SwitchStatement') {
      readSwitch(node, source, aliases, handled, unscanned);
      continue;
    }

    if (node.type === 'CallExpression') {
      readCall(node, parent, source, aliases, context, handled, unscanned);
      continue;
    }

    if (node.type === 'MemberExpression' && node.computed && isEventType(node.property, aliases)) {
      unscanned.add(text(source, node));
    }
  }

  return {
    handled: [...handled].sort(),
    unscanned: [...unscanned].sort(),
  };
}

function handledEventNames(source) {
  return scanEvents(source).handled;
}

function unscannedEventChecks(source) {
  return scanEvents(source).unscanned;
}

module.exports = {
  PLUGIN_DIR,
  handledEventNames,
  readInventory,
  readManifest,
  unscannedEventChecks,
};
