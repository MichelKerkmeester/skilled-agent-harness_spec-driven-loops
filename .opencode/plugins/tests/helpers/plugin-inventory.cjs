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

/**
 * Read the inventory manifest that lists the plugin exceptions and known events.
 *
 * @param {string} [pluginDir] - Folder holding the plugins and their
 *   `tests/plugin-inventory.json`; defaults to this helper's plugin folder.
 * @returns {object} The parsed manifest, with `nativeDual`, `skippedHooks`,
 *   `unscannedEventChecks` and `events`.
 * @throws {Error} When the manifest file cannot be read.
 * @throws {SyntaxError} When the manifest is not valid JSON.
 */
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

/**
 * Compare the plugin folder against the manifest and report every difference.
 *
 * @param {string} [pluginDir] - Folder holding the plugin files and the manifest;
 *   defaults to this helper's plugin folder.
 * @param {object} [manifest] - Manifest to compare against; defaults to
 *   `readManifest(pluginDir)`.
 * @returns {{ bridged: string[], nativeDual: string[], problems: string[] }}
 *   Sorted stems (file names without `.js`) of the bridged plugins, sorted stems of
 *   the native-dual exceptions, and one message per mismatch found.
 * @throws {Error} When the manifest or a plugin file cannot be read.
 * @throws {SyntaxError} When the manifest is not valid JSON.
 */
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
// A collection stays readable only while every use is a read through one of these members, but the
// iteration methods are left out because each passes the collection itself to its callback, which
// could then change it.
const COLLECTION_MEMBERS = new Set([
  'has',
  'includes',
  'indexOf',
  'lastIndexOf',
  'length',
  'size',
  'at',
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
function walkAst(root, shouldDescend = () => true) {
  const nodes = [];
  const stack = [{ node: root, parent: null }];

  while (stack.length > 0) {
    const entry = stack.pop();
    nodes.push(entry);

    if (!shouldDescend(entry.node)) continue;

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

// A comparison against nothing says no event arrived, so there is no name to read or report; a
// shadowed `undefined` is an ordinary operand, not the global sentinel.
function isNothing(node, context) {
  if (node.type === 'Identifier' && node.name === 'undefined') {
    return context.resolve(node) === null;
  }
  return node.type === 'Literal' && node.value === null;
}

// Only a parameter written directly in the parameter list can be traced through calls; a name
// destructured out of a parameter receives part of the value, not the argument itself.
function directParameterOwner(identifier, context) {
  const parent = context.nodeParents.get(identifier);
  if (parent === undefined) return null;

  if (FUNCTION_TYPES.has(parent.type) && parent.params.includes(identifier)) return parent;

  if (parent.type === 'AssignmentPattern' && parent.left === identifier) {
    const owner = context.nodeParents.get(parent);
    if (
      owner !== undefined &&
      FUNCTION_TYPES.has(owner.type) &&
      owner.params.includes(parent)
    ) {
      return owner;
    }
  }

  return null;
}

// A declaration binding is found by its own identifier, which stays exact even when a parameter
// shares the function's name.
function declarationBinding(identifier, context) {
  const binding = context.bindings.find((candidate) => candidate.node === identifier);
  return binding === undefined ? null : binding;
}

// A function declaration or a variable holding a function has a name every call reaches; a method,
// a callback or an inline function has none, so its parameter cannot be traced.
function callableBindingFor(fn, context) {
  if (fn.type === 'FunctionDeclaration') {
    return fn.id === null ? null : declarationBinding(fn.id, context);
  }

  const parent = context.nodeParents.get(fn);
  if (
    parent !== undefined &&
    parent.type === 'VariableDeclarator' &&
    parent.init === fn &&
    parent.id.type === 'Identifier'
  ) {
    return declarationBinding(parent.id, context);
  }

  return null;
}

// A defaulted parameter keeps its own position in the list, so the default does not shift it.
function parameterIndex(fn, identifier) {
  const direct = fn.params.indexOf(identifier);
  if (direct !== -1) return direct;
  return fn.params.findIndex(
    (param) => param.type === 'AssignmentPattern' && param.left === identifier,
  );
}

// A literal, a template with no holes and a freshly built object or function cannot be nothing, so
// each of those rules out the default; any other expression may evaluate to nothing instead.
const DEFINED_EXPRESSION_TYPES = new Set([
  'ArrayExpression',
  'ObjectExpression',
  'FunctionExpression',
  'ArrowFunctionExpression',
  'ClassExpression',
]);

function isProvablyDefined(node) {
  if (node.type === 'Literal') return true;
  if (node.type === 'TemplateLiteral') return node.expressions.length === 0;
  return DEFINED_EXPRESSION_TYPES.has(node.type);
}

// The default expression is what the function reads when the call leaves the parameter empty.
function parameterDefault(fn, identifier) {
  const parameter = fn.params[parameterIndex(fn, identifier)];
  if (parameter === undefined || parameter.type !== 'AssignmentPattern') return null;
  return parameter.left === identifier ? parameter.right : null;
}

// A call that omits an argument or passes the global nothing leaves the parameter's default in
// place, so the default is the value the function actually reads.
function isOmittedArgument(argument, context) {
  if (argument === undefined) return true;
  if (argument.type === 'Identifier' && argument.name === 'undefined') {
    return context.resolve(argument) === null;
  }
  return (
    argument.type === 'UnaryExpression' &&
    argument.operator === 'void' &&
    argument.argument.type === 'Literal' &&
    argument.argument.value === 0
  );
}

// An exported callable can be reached from outside the file, so its parameter keeps reading as the
// type; both an exported declaration and a separate export list make that escape.
function exportedCallable(fn, callable, context) {
  const parent = context.nodeParents.get(fn);
  if (
    fn.type === 'FunctionDeclaration' &&
    parent !== undefined &&
    (parent.type === 'ExportNamedDeclaration' || parent.type === 'ExportDefaultDeclaration')
  ) {
    return true;
  }

  if (parent !== undefined && parent.type === 'VariableDeclarator' && parent.init === fn) {
    const declaration = context.nodeParents.get(parent);
    if (declaration !== undefined && declaration.type === 'ExportNamedDeclaration') return true;
  }

  return context.nodes.some(
    ({ node }) =>
      node.type === 'ExportSpecifier' &&
      node.local.type === 'Identifier' &&
      context.resolve(node.local) === callable,
  );
}

// A parameter is the event type only when every call passes one, and a function that escapes can
// be called anywhere; the resolving set keeps one parameter handed to another from looping.
function isEventTypeParameter(binding, context) {
  if (context.resolvingParams.has(binding)) return true;

  const identifier = binding.node;
  const fn = directParameterOwner(identifier, context);
  if (fn === null) return true;

  // A function that writes its parameter can hold the event type whatever the call passed.
  if (context.written.has(binding)) return true;

  const callable = callableBindingFor(fn, context);
  if (callable === null) return true;
  if (exportedCallable(fn, callable, context)) return true;

  const calls = [];
  for (const { node, parent } of context.nodes) {
    if (node.type !== 'Identifier') continue;
    if (node === callable.node) continue;
    if (context.resolve(node) !== callable) continue;
    if (isBindingIdentifier(node, parent)) continue;
    if (parent === null || parent.type !== 'CallExpression' || parent.callee !== node) return true;
    calls.push(parent);
  }

  if (calls.length === 0) return true;

  const index = parameterIndex(fn, identifier);
  const defaultExpression = parameterDefault(fn, identifier);

  context.resolvingParams.add(binding);
  try {
    for (const call of calls) {
      for (let position = 0; position <= index; position += 1) {
        const argument = call.arguments[position];
        // An explicit nothing is an argument like any other, so only a genuinely absent slot ends
        // the walk: that slot leaves this parameter and every later one with its default value.
        const absent = argument === undefined;
        if (absent || (position === index && isOmittedArgument(argument, context))) {
          if (defaultExpression !== null && containsEventType(defaultExpression, context)) {
            return true;
          }
          break;
        }
        if (argument.type === 'SpreadElement') return true;
        if (position === index && containsEventType(argument, context)) return true;
        // An argument that can be nothing leaves a default holding the event type in place, so a
        // parameter that is not provably given a value keeps reading as the type.
        if (
          position === index &&
          defaultExpression !== null &&
          containsEventType(defaultExpression, context) &&
          !isProvablyDefined(argument)
        ) {
          return true;
        }
      }
    }
    return false;
  } finally {
    context.resolvingParams.delete(binding);
  }
}

function isEventType(node, context) {
  if (node === null || node === undefined) return false;

  // The parser wraps an optional chain around its member expression, which is still the field.
  if (node.type === 'ChainExpression') return isEventType(node.expression, context);

  if (node.type === 'Identifier') {
    const binding = context.resolve(node);
    if (node.name === 'type' || node.name.endsWith('Type')) {
      if (binding === null || binding.kind !== 'param') return true;
      return isEventTypeParameter(binding, context);
    }
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

// A wrapped event type still selects events, so the operand is reported instead of dropped; a
// nested function body runs later and is not part of the expression evaluated here, and a typeof
// reads a type tag rather than the event name.
function containsEventType(node, context) {
  if (node === null || node === undefined) return false;

  return walkAst(
    node,
    (current) =>
      !FUNCTION_TYPES.has(current.type) &&
      !(current.type === 'UnaryExpression' && current.operator === 'typeof'),
  ).some(({ node: current, parent }) => {
    // A name in a binding position or an object key is not a value, so it cannot be the type.
    return !isBindingIdentifier(current, parent) && isEventType(current, context);
  });
}

// A binding declared from the type and then rewritten no longer holds it, so a comparison that
// reads that name may have selected any event. The operand is reported rather than dropped.
function containsRewrittenAlias(node, context) {
  if (node === null || node === undefined) return false;

  return walkAst(
    node,
    (current) =>
      !FUNCTION_TYPES.has(current.type) &&
      !(current.type === 'UnaryExpression' && current.operator === 'typeof'),
  ).some(({ node: current, parent }) => {
    return (
      current.type === 'Identifier' &&
      !isBindingIdentifier(current, parent) &&
      context.rewrittenAliases.has(context.resolve(current))
    );
  });
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
        const namesType = property.computed
          ? staticString(property.key) === 'type'
          : (property.key.type === 'Identifier' && property.key.name === 'type') ||
            (property.key.type === 'Literal' && property.key.value === 'type');
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
// while that binding is never rewritten; an alias can also be built from another alias. A binding
// that is rewritten cannot name an event, so it is kept apart for the comparison reader to report,
// and a binding built from a rewritten alias inherits that uncertainty.
function collectEventTypeAliases(context) {
  const aliases = new Set();
  const rewritten = new Set();
  context.aliases = aliases;
  context.rewrittenAliases = rewritten;
  let changed = true;

  while (changed) {
    changed = false;
    for (const binding of context.bindings) {
      if (aliases.has(binding) || rewritten.has(binding)) continue;

      const declarator = binding.declarator;
      const declaredName = declarator !== null && binding.node === declarator.id;
      const fromInit = declaredName && isEventType(declarator.init, context);
      const fromRewritten = declaredName && containsRewrittenAlias(declarator.init, context);
      if (!fromInit && !fromRewritten && !context.typeBindings.has(binding)) continue;

      if (context.written.has(binding) || fromRewritten) rewritten.add(binding);
      else aliases.add(binding);
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
  if (!leftIsType && !rightIsType) {
    // A type hidden inside an operand is reported rather than silently dropped, and so is a name
    // that held the type only until a later write replaced it.
    if (
      containsEventType(node.left, context) ||
      containsEventType(node.right, context) ||
      containsRewrittenAlias(node.left, context) ||
      containsRewrittenAlias(node.right, context)
    ) {
      unscanned.add(text(source, node));
    }
    return;
  }

  const other = leftIsType ? node.right : node.left;
  const value = staticString(other);
  if (value !== undefined) {
    if (EVENT_NAME.test(value)) handled.add(value);
    return;
  }
  if (!isNothing(other, context)) unscanned.add(text(source, node));
}

// A case label names an event only when it is a literal; every other label is read at runtime.
function readSwitch(node, source, context, handled, unscanned) {
  if (!isEventType(node.discriminant, context)) {
    // A wrapped type is still the switch subject, so the whole switch is reported once.
    if (containsEventType(node.discriminant, context)) {
      unscanned.add(`switch (${text(source, node.discriminant)})`);
    }
    return;
  }

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

// The generic rule reads a call that carries the type in an argument but is neither a membership
// check nor a method on the type; both of those are handled earlier in the call reader.
function reachesGenericCallRule(node, context) {
  const callee = node.callee;

  if (callee.type === 'MemberExpression') {
    const property =
      !callee.computed && callee.property.type === 'Identifier' ? callee.property.name : null;
    const firstArgument = node.arguments[0];

    if (
      (property === 'has' || property === 'includes') &&
      firstArgument !== undefined &&
      containsEventType(firstArgument, context)
    ) {
      return false;
    }

    if (isEventType(callee.object, context)) return false;
  }

  return node.arguments.some((argument) => containsEventType(argument, context));
}

// A stored call keeps its value through the operators that only reshape it, so the walk follows
// those links until the value is handed to a name, and stops anywhere else.
function storedIdentifier(node, parents) {
  let current = node;

  while (true) {
    const parent = parents.get(current);
    if (parent === null || parent === undefined) return null;

    if (
      parent.type === 'LogicalExpression' ||
      (parent.type === 'UnaryExpression' && parent.operator === '!') ||
      parent.type === 'ChainExpression' ||
      parent.type === 'AwaitExpression' ||
      parent.type === 'ParenthesizedExpression' ||
      (parent.type === 'ConditionalExpression' &&
        (parent.consequent === current || parent.alternate === current))
    ) {
      current = parent;
      continue;
    }

    if (
      parent.type === 'VariableDeclarator' &&
      parent.init === current &&
      parent.id.type === 'Identifier'
    ) {
      return parent.id;
    }

    if (
      parent.type === 'AssignmentExpression' &&
      parent.operator === '=' &&
      parent.right === current &&
      parent.left.type === 'Identifier'
    ) {
      return parent.left;
    }

    return null;
  }
}

// The source calls behind a value are the ones held by every derived binding the expression reads,
// so one walk collects them all without entering a function that runs only when called.
function collectDerivedOrigins(node, context, derived) {
  const origins = new Set();
  if (node === null || node === undefined) return origins;

  for (const { node: current, parent } of walkAst(
    node,
    (current) => !FUNCTION_TYPES.has(current.type),
  )) {
    if (current.type !== 'Identifier' || isBindingIdentifier(current, parent)) continue;
    const held = derived.get(context.resolve(current));
    if (held === undefined) continue;
    for (const call of held) origins.add(call);
  }

  return origins;
}

// A binding is derived from a helper call when the result is stored in it, and another binding
// joins when it is declared or assigned from an expression that reads a derived binding, until
// every binding holds all of the source calls whose value reached it.
function collectDerivedBindings(context) {
  const derived = new Map();

  const add = (identifier, origins) => {
    if (origins.size === 0) return false;
    const binding = context.resolve(identifier);
    if (binding === null) return false;

    let held = derived.get(binding);
    if (held === undefined) {
      held = new Set();
      derived.set(binding, held);
    }

    let changed = false;
    for (const call of origins) {
      if (held.has(call)) continue;
      held.add(call);
      changed = true;
    }
    return changed;
  };

  // A source call hands its value to the name the value is stored in, if there is one.
  for (const { node } of context.nodes) {
    if (node.type !== 'CallExpression') continue;
    if (!reachesGenericCallRule(node, context)) continue;
    if (isInTestPosition(node, context.nodeParents)) continue;
    const identifier = storedIdentifier(node, context.nodeParents);
    if (identifier !== null) add(identifier, new Set([node]));
  }

  // The spread repeats because one derived binding can hand its value to another, and the reads
  // only settle once no binding gains a source call.
  let changed = true;
  while (changed) {
    changed = false;
    for (const { node } of context.nodes) {
      if (node.type === 'VariableDeclarator' && node.id.type === 'Identifier') {
        if (add(node.id, collectDerivedOrigins(node.init, context, derived))) changed = true;
      } else if (
        node.type === 'AssignmentExpression' &&
        node.operator === '=' &&
        node.left.type === 'Identifier'
      ) {
        if (add(node.left, collectDerivedOrigins(node.right, context, derived))) changed = true;
      }
    }
  }

  return derived;
}

// A stored name decides a branch when a read of it reaches the condition of one; the walk runs
// through expression links only, so a statement or a function body ends it.
function readDecidesBranch(node, parents) {
  let current = node;

  while (true) {
    const parent = parents.get(current);
    if (parent === null || parent === undefined) return false;

    if (
      (parent.type === 'IfStatement' ||
        parent.type === 'ConditionalExpression' ||
        parent.type === 'WhileStatement' ||
        parent.type === 'DoWhileStatement' ||
        parent.type === 'ForStatement') &&
      parent.test === current
    ) {
      return true;
    }

    if (
      (parent.type === 'SwitchStatement' && parent.discriminant === current) ||
      (parent.type === 'SwitchCase' && parent.test === current)
    ) {
      return true;
    }

    if (!parent.type.endsWith('Expression') || FUNCTION_TYPES.has(parent.type)) return false;
    current = parent;
  }
}

// The stored name itself is not a read, so only the other references to its binding can reach a
// branch condition and carry the helper call into the report.
function bindingDecidesBranch(binding, context) {
  for (const { node, parent } of context.nodes) {
    if (node.type !== 'Identifier') continue;
    if (context.resolve(node) !== binding) continue;
    if (isBindingIdentifier(node, parent)) continue;
    if (readDecidesBranch(node, context.nodeParents)) return true;
  }

  return false;
}

// A source call is reported when a derived binding that carries its value decides a branch, so
// one pass over the derived bindings builds the set the call reader looks the call up in.
function collectReportedCalls(context) {
  const calls = new Set();

  for (const [binding, origins] of context.derived) {
    if (!bindingDecidesBranch(binding, context)) continue;
    for (const call of origins) calls.add(call);
  }

  return calls;
}

// A membership call on the type reads the receiver's contents; an unresolved receiver or a member
// the collection kind does not have is reported because those events are otherwise invisible. A
// helper handed the type inside a test decides a branch the scan cannot follow, so that is reported
// too, and a stored result is reported when a read of its name decides a branch later.
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

    // A wrapped type inside a membership check is reported, and its receiver is left unread.
    if (
      (property === 'has' || property === 'includes') &&
      firstArgument !== undefined &&
      containsEventType(firstArgument, context)
    ) {
      unscanned.add(text(source, node));
      return;
    }

    // A method on the type can select events the scan cannot read, so a comparison is reported
    // with its method call and a bare call is reported alone; a switch discriminant is reported
    // with its switch instead.
    if (isEventType(callee.object, context)) {
      if (parent !== null && parent.type === 'SwitchStatement' && parent.discriminant === node) {
        return;
      }
      const parentIsComparison =
        parent !== null &&
        parent.type === 'BinaryExpression' &&
        COMPARISON_OPERATORS.has(parent.operator);
      unscanned.add(text(source, parentIsComparison ? parent : node));
      return;
    }
  }

  // A call in a test receives the event type even when another call wraps it; a result stored in
  // a name is reported when a read of that name decides a branch later.
  if (!reachesGenericCallRule(node, context)) return;
  if (isInTestPosition(node, context.nodeParents) || context.reportedCalls.has(node)) {
    unscanned.add(text(source, node));
  }
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
    resolvingParams: new Set(),
  };
  context.written = collectWrittenBindings(context);
  collectEventTypeAliases(context);
  context.derived = collectDerivedBindings(context);
  context.reportedCalls = collectReportedCalls(context);
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

/**
 * Read the event names a plugin source handles in a comparison or case label.
 *
 * @param {string} source - JavaScript source to scan.
 * @returns {string[]} Sorted, de-duplicated event names the scan can read.
 * @throws {Error} When the source cannot be parsed.
 */
function handledEventNames(source) {
  return scanEvents(source).handled;
}

/**
 * Read the checks whose event the scan cannot resolve, so a caller can fail closed on them.
 *
 * @param {string} source - JavaScript source to scan.
 * @returns {string[]} Sorted, de-duplicated source text of every check the scan cannot read.
 * @throws {Error} When the source cannot be parsed.
 */
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
