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

function isEventType(node, context) {
  if (node === null || node === undefined) return false;

  // The parser wraps an optional chain around its member expression, which is still the field.
  if (node.type === 'ChainExpression') return isEventType(node.expression, context);

  if (node.type === 'Identifier') {
    if (node.name === 'type' || node.name.endsWith('Type')) return true;
    const binding = context.resolve(node);
    return binding !== null && context.aliases.has(binding);
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

// Every pattern form hides its names at a different depth, so one walk flattens them all.
function forEachPatternName(pattern, visit) {
  if (pattern === null || pattern === undefined) return;

  if (pattern.type === 'Identifier') {
    visit(pattern);
    return;
  }
  if (pattern.type === 'ObjectPattern') {
    for (const property of pattern.properties) {
      if (property.type === 'RestElement') forEachPatternName(property.argument, visit);
      else forEachPatternName(property.value, visit);
    }
    return;
  }
  if (pattern.type === 'ArrayPattern') {
    for (const element of pattern.elements) forEachPatternName(element, visit);
    return;
  }
  if (pattern.type === 'AssignmentPattern') {
    forEachPatternName(pattern.left, visit);
    return;
  }
  if (pattern.type === 'RestElement') forEachPatternName(pattern.argument, visit);
}

// The tree has no parent links, so the scope builder walks it once and records which scope holds
// each node before any name is resolved.
function childNodes(node) {
  const children = [];

  for (const key of Object.keys(node)) {
    const value = node[key];
    if (Array.isArray(value)) {
      for (const child of value) {
        if (child !== null && typeof child === 'object' && typeof child.type === 'string') {
          children.push(child);
        }
      }
    } else if (value !== null && typeof value === 'object' && typeof value.type === 'string') {
      children.push(value);
    }
  }

  return children;
}

const FUNCTION_SCOPE_TYPES = new Set([
  'Program',
  'FunctionDeclaration',
  'FunctionExpression',
  'ArrowFunctionExpression',
]);
const FUNCTION_TYPES = new Set([
  'FunctionDeclaration',
  'FunctionExpression',
  'ArrowFunctionExpression',
]);
const BLOCK_SCOPE_TYPES = new Set([
  'BlockStatement',
  'ForStatement',
  'ForInStatement',
  'ForOfStatement',
  'SwitchStatement',
  'CatchClause',
]);

function isScopeNode(node) {
  return FUNCTION_SCOPE_TYPES.has(node.type) || BLOCK_SCOPE_TYPES.has(node.type);
}

// A var or a function declaration belongs to the function, so the walk skips every block above.
function nearestFunctionScope(scope) {
  let current = scope;
  while (current !== null && !FUNCTION_SCOPE_TYPES.has(current.node.type)) {
    current = current.parent;
  }
  return current;
}

// A name means whatever its own scope says it means, so every identifier is resolved against the
// scope that contains it instead of being compared by spelling across the whole file.
function buildScopes(program, parents) {
  const scopeOf = new Map();
  const bindings = [];
  const typeBindings = new Set();
  const root = { node: program, parent: null, names: new Map() };
  const pending = [program];
  scopeOf.set(program, root);

  while (pending.length > 0) {
    const node = pending.pop();
    const scope = scopeOf.get(node);

    for (const child of childNodes(node)) {
      let childScope = scope;
      if (isScopeNode(child)) {
        const owner = parents.get(child);
        // A function body block is the function's own scope, not a second one below it.
        const sharesFunctionBody =
          child.type === 'BlockStatement' &&
          owner !== undefined &&
          FUNCTION_TYPES.has(owner.type) &&
          owner.body === child;
        if (!sharesFunctionBody) {
          childScope = { node: child, parent: scope, names: new Map() };
        }
      }
      scopeOf.set(child, childScope);
      pending.push(child);
    }
  }

  const addBinding = (scope, identifier, kind, declarator, fromTypeProperty) => {
    const binding = { name: identifier.name, kind, declarator, node: identifier };
    scope.names.set(identifier.name, binding);
    bindings.push(binding);
    if (fromTypeProperty) typeBindings.add(binding);
  };

  // Every pattern form hides its names at a different depth, so one walk binds them all.
  const bindPattern = (pattern, scope, kind, declarator, fromTypeProperty) => {
    if (pattern === null || pattern === undefined) return;

    if (pattern.type === 'Identifier') {
      addBinding(scope, pattern, kind, declarator, fromTypeProperty);
      return;
    }
    if (pattern.type === 'ObjectPattern') {
      for (const property of pattern.properties) {
        if (property.type === 'RestElement') {
          bindPattern(property.argument, scope, kind, declarator, false);
          continue;
        }
        const namesType =
          !property.computed &&
          ((property.key.type === 'Identifier' && property.key.name === 'type') ||
            (property.key.type === 'Literal' && property.key.value === 'type'));
        // The value of a `type` property carries the type field, including a defaulted binding.
        bindPattern(property.value, scope, kind, declarator, namesType);
      }
      return;
    }
    if (pattern.type === 'ArrayPattern') {
      for (const element of pattern.elements) {
        bindPattern(element, scope, kind, declarator, false);
      }
      return;
    }
    if (pattern.type === 'AssignmentPattern') {
      bindPattern(pattern.left, scope, kind, declarator, fromTypeProperty);
      return;
    }
    if (pattern.type === 'RestElement') {
      bindPattern(pattern.argument, scope, kind, declarator, false);
    }
  };

  for (const node of scopeOf.keys()) {
    const scope = scopeOf.get(node);

    if (node.type === 'VariableDeclaration') {
      const target = node.kind === 'var' ? nearestFunctionScope(scope) : scope;
      for (const declarator of node.declarations) {
        bindPattern(declarator.id, target, node.kind, declarator, false);
      }
    } else if (node.type === 'FunctionDeclaration') {
      if (node.id !== null) {
        addBinding(nearestFunctionScope(scope.parent), node.id, 'function', null, false);
      }
      for (const param of node.params) bindPattern(param, scope, 'param', null, false);
    } else if (
      node.type === 'FunctionExpression' ||
      node.type === 'ArrowFunctionExpression'
    ) {
      if (node.id !== null) addBinding(scope, node.id, 'function', null, false);
      for (const param of node.params) bindPattern(param, scope, 'param', null, false);
    } else if (node.type === 'ClassDeclaration') {
      if (node.id !== null) addBinding(scope, node.id, 'class', null, false);
    } else if (node.type === 'ClassExpression') {
      // A class expression has no scope of its own here, so its name binds beside it where its
      // own methods can still resolve it.
      if (node.id !== null) addBinding(scope, node.id, 'class', null, false);
    } else if (node.type === 'CatchClause') {
      bindPattern(node.param, scope, 'catch', null, false);
    } else if (
      node.type === 'ImportSpecifier' ||
      node.type === 'ImportDefaultSpecifier' ||
      node.type === 'ImportNamespaceSpecifier'
    ) {
      addBinding(root, node.local, 'import', null, false);
    }
  }

  // Outward from the innermost scope is the language's own lookup order.
  const resolve = (identifier) => {
    if (identifier === null || identifier === undefined || identifier.type !== 'Identifier') {
      return null;
    }

    let scope = scopeOf.get(identifier);
    while (scope !== null && scope !== undefined) {
      const binding = scope.names.get(identifier.name);
      if (binding !== undefined) return binding;
      scope = scope.parent;
    }
    return null;
  };

  return { resolve, bindings, typeBindings };
}

// A binding written after it is declared no longer holds the value the check was written for.
function collectWrittenBindings(context) {
  const written = new Set();
  const mark = (identifier) => {
    const binding = context.resolve(identifier);
    if (binding !== null) written.add(binding);
  };

  for (const { node } of context.nodes) {
    if (node.type === 'AssignmentExpression') {
      forEachPatternName(node.left, mark);
    } else if (node.type === 'UpdateExpression') {
      forEachPatternName(node.argument, mark);
    } else if (
      (node.type === 'ForInStatement' || node.type === 'ForOfStatement') &&
      node.left.type !== 'VariableDeclaration'
    ) {
      // A loop that assigns an existing binding rewrites it on every pass.
      forEachPatternName(node.left, mark);
    }
  }

  return written;
}

// A local binding can carry the type field too, including one destructured out of it, but only
// while that binding is never rewritten; an alias can also be built from another alias.
function collectEventTypeAliases(context) {
  const aliases = new Set();
  context.aliases = aliases;
  let changed = true;

  while (changed) {
    changed = false;
    for (const binding of context.bindings) {
      if (aliases.has(binding) || context.written.has(binding)) continue;

      const declarator = binding.declarator;
      const fromInit =
        declarator !== null &&
        binding.node === declarator.id &&
        isEventType(declarator.init, context);
      if (!fromInit && !context.typeBindings.has(binding)) continue;

      aliases.add(binding);
      changed = true;
    }
  }

  return aliases;
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

// A collection whose binding is read any other way can be changed or exported, which makes its
// literal contents unable to describe what the check actually sees.
function isCollectionReferenceOnly(binding, context) {
  for (const { node, parent } of context.nodes) {
    if (node.type !== 'Identifier') continue;
    if (node === binding.node) continue;
    // A same-named identifier that resolves elsewhere is a different variable, not a use.
    if (context.resolve(node) !== binding) continue;
    if (isBindingIdentifier(node, parent)) continue;
    if (
      parent !== null &&
      parent.type === 'MemberExpression' &&
      parent.object === node &&
      !parent.computed &&
      parent.property.type === 'Identifier' &&
      COLLECTION_MEMBERS.has(parent.property.name)
    ) {
      // Assigning through, updating or deleting a member changes the collection, so it is not a read.
      const memberParent = context.nodeParents.get(parent);
      const writesMember =
        memberParent !== undefined &&
        ((memberParent.type === 'AssignmentExpression' && memberParent.left === parent) ||
          (memberParent.type === 'UpdateExpression' && memberParent.argument === parent) ||
          (memberParent.type === 'UnaryExpression' &&
            memberParent.operator === 'delete' &&
            memberParent.argument === parent));
      if (!writesMember) continue;
    }
    return false;
  }

  return true;
}

// A receiver resolves only when its whole contents are literal event names and its binding never
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
    return { kind: 'array', names };
  }

  if (node.type === 'NewExpression') {
    // A local Set shadows the built-in, so its constructor cannot build a trusted literal collection.
    if (node.callee.type !== 'Identifier' || node.callee.name !== 'Set') return null;
    if (context.resolve(node.callee) !== null) return null;
    if (node.arguments.length !== 1 || node.arguments[0].type !== 'ArrayExpression') return null;
    const inner = resolveCollection(node.arguments[0], context, resolving);
    return inner === null ? null : { kind: 'set', names: inner.names };
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
      // A local Object shadows the built-in, so freeze cannot make a trusted literal collection.
      if (context.resolve(callee.object) !== null) return null;
      return resolveCollection(node.arguments[0], context, resolving);
    }
    return null;
  }

  if (node.type !== 'Identifier') return null;

  const binding = context.resolve(node);
  if (binding === null || binding.kind !== 'const' || binding.declarator === null) return null;
  // Only the declared name receives the whole initial value; a destructured name receives a part.
  if (binding.node !== binding.declarator.id) return null;
  // A cycle never settles on a value, so it stays unresolved rather than recursing forever.
  if (resolving.has(binding)) return null;

  resolving.add(binding);
  try {
    const resolved = resolveCollection(binding.declarator.init, context, resolving);
    if (resolved === null) return null;
    return isCollectionReferenceOnly(binding, context) ? resolved : null;
  } finally {
    resolving.delete(binding);
  }
}

// Only a literal on the other side names an event; every other operand is reported because it
// could select any event at runtime.
function readComparison(node, source, context, handled, unscanned) {
  const leftIsType = isEventType(node.left, context);
  const rightIsType = isEventType(node.right, context);

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
function readSwitch(node, source, context, handled, unscanned) {
  if (!isEventType(node.discriminant, context)) return;

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

// The type only matters in a branch condition, so a call is followed upward through the
// operators that only reshape a condition until it either feeds a test or does not.
function isInTestPosition(node, parents) {
  let current = node;

  while (true) {
    const parent = parents.get(current);
    if (parent === null || parent === undefined) return false;

    if (
      parent.type === 'LogicalExpression' ||
      (parent.type === 'UnaryExpression' && parent.operator === '!') ||
      parent.type === 'ChainExpression' ||
      parent.type === 'AwaitExpression' ||
      parent.type === 'ParenthesizedExpression'
    ) {
      current = parent;
      continue;
    }

    if (
      parent.type === 'IfStatement' ||
      parent.type === 'ConditionalExpression' ||
      parent.type === 'WhileStatement' ||
      parent.type === 'DoWhileStatement' ||
      parent.type === 'ForStatement'
    ) {
      return parent.test === current;
    }

    return false;
  }
}

// A membership call on the type reads the receiver's contents; an unresolved receiver or a member
// the collection kind does not have is reported because those events are otherwise invisible. A
// helper handed the type inside a test decides a branch the scan cannot follow, so that is reported
// too, while a call elsewhere is only logging or passing the value along.
function readCall(node, parent, source, context, handled, unscanned) {
  const callee = node.callee;

  if (callee.type === 'MemberExpression') {
    const property =
      !callee.computed && callee.property.type === 'Identifier' ? callee.property.name : null;
    const firstArgument = node.arguments[0];

    if (
      (property === 'has' || property === 'includes') &&
      firstArgument !== undefined &&
      isEventType(firstArgument, context)
    ) {
      const collection = resolveCollection(callee.object, context);
      const expectedKind = property === 'has' ? 'set' : 'array';
      if (collection === null || collection.kind !== expectedKind) {
        unscanned.add(text(source, node));
      } else {
        for (const name of collection.names) handled.add(name);
      }
      return;
    }

    // A method on the type can select events the scan cannot read, so a comparison is reported
    // with its method call and a bare call is reported alone.
    if (isEventType(callee.object, context)) {
      const parentIsComparison =
        parent !== null &&
        parent.type === 'BinaryExpression' &&
        COMPARISON_OPERATORS.has(parent.operator);
      unscanned.add(text(source, parentIsComparison ? parent : node));
      return;
    }
  }

  if (!node.arguments.some((argument) => isEventType(argument, context))) return;
  if (!isInTestPosition(node, context.nodeParents)) return;
  unscanned.add(text(source, node));
}

function scanEvents(source) {
  const program = parseAst(source, { lang: 'js' });
  const nodes = walkAst(program);
  // Member parent links let a read be told apart from a write through the same member.
  const nodeParents = new Map(nodes.map(({ node, parent }) => [node, parent]));
  const scopes = buildScopes(program, nodeParents);
  const context = {
    nodes,
    nodeParents,
    resolve: scopes.resolve,
    bindings: scopes.bindings,
    typeBindings: scopes.typeBindings,
    aliases: new Set(),
  };
  context.written = collectWrittenBindings(context);
  const aliases = collectEventTypeAliases(context);
  const handled = new Set();
  const unscanned = new Set();

  for (const { node, parent } of nodes) {
    if (node.type === 'BinaryExpression') {
      if (COMPARISON_OPERATORS.has(node.operator)) {
        readComparison(node, source, context, handled, unscanned);
      } else if (node.operator === 'in' && isEventType(node.left, context)) {
        unscanned.add(text(source, node));
      }
      continue;
    }

    if (node.type === 'SwitchStatement') {
      readSwitch(node, source, context, handled, unscanned);
      continue;
    }

    if (node.type === 'CallExpression') {
      readCall(node, parent, source, context, handled, unscanned);
      continue;
    }

    if (node.type === 'MemberExpression' && node.computed && isEventType(node.property, context)) {
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
