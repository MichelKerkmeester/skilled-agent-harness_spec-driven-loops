'use strict';

const assert = require('node:assert/strict');
const { readFileSync, statSync } = require('node:fs');
const { dirname, join, resolve } = require('node:path');
const vm = require('node:vm');

const RENDER_SOURCE = join(
  '.opencode',
  'skills',
  'system-skill-advisor',
  'mcp-server',
  'lib',
  'render.ts',
);
const PI_SOURCE = join(
  '.opencode',
  'skills',
  'system-skill-advisor',
  'hooks',
  'pi',
  'prompt-advisor.ts',
);

function workspaceRoot(start) {
  let current = resolve(start);
  for (;;) {
    try {
      if (statSync(join(current, RENDER_SOURCE)).isFile()) return current;
    } catch {
      // Keep walking until the repository-owned source file is found.
    }
    const parent = dirname(current);
    if (parent === current) throw new Error(`Unable to locate ${RENDER_SOURCE}`);
    current = parent;
  }
}

function constantInitializer(source, name) {
  const declaration = new RegExp(`(?:export\\s+)?const\\s+${name}\\s*=\\s*`, 'm');
  const match = declaration.exec(source);
  assert(match, `Missing source constant: ${name}`);

  let quote = null;
  let escaped = false;
  for (let index = match.index + match[0].length; index < source.length; index += 1) {
    const character = source[index];
    if (quote !== null) {
      if (escaped) escaped = false;
      else if (character === '\\') escaped = true;
      else if (character === quote) quote = null;
      continue;
    }
    if (character === "'" || character === '"' || character === '`') {
      quote = character;
      continue;
    }
    if (character === ';') {
      return source.slice(match.index + match[0].length, index).trim();
    }
  }
  throw new Error(`Unterminated source constant: ${name}`);
}

function stringConstant(source, name) {
  const expression = constantInitializer(source, name);
  const values = [];
  let cursor = 0;
  let expectValue = true;

  while (cursor < expression.length) {
    const whitespace = /^\s+/.exec(expression.slice(cursor));
    if (whitespace) {
      cursor += whitespace[0].length;
      continue;
    }
    if (!expectValue && expression[cursor] === '+') {
      cursor += 1;
      expectValue = true;
      continue;
    }
    const literal = /^(?:'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*")/.exec(expression.slice(cursor));
    assert(expectValue && literal, `Unsupported initializer for ${name}: ${expression}`);
    values.push(vm.runInNewContext(literal[0], Object.create(null), { timeout: 50 }));
    cursor += literal[0].length;
    expectValue = false;
  }

  assert(!expectValue && values.every((value) => typeof value === 'string'), `Invalid string constant: ${name}`);
  return values.join('');
}

function byteReceipt(value) {
  return {
    utf8Bytes: Buffer.byteLength(value, 'utf8'),
    utf16Units: value.length,
    repositoryEstimate: Math.ceil(value.length / 4),
  };
}

function injectionBytes(userText, context, dispatchDirective) {
  const transformed = context
    ? `${userText}\n\n${context}\n\n${dispatchDirective}`
    : `${userText}\n\n${dispatchDirective}`;
  return Buffer.byteLength(transformed, 'utf8') - Buffer.byteLength(userText, 'utf8');
}

const root = workspaceRoot(__dirname);
const renderSource = readFileSync(join(root, RENDER_SOURCE), 'utf8');
const piSource = readFileSync(join(root, PI_SOURCE), 'utf8');

const directivesLabel = stringConstant(renderSource, 'DIRECTIVES_LABEL');
const directives = [
  stringConstant(renderSource, 'HYGIENE_DIRECTIVE'),
  stringConstant(renderSource, 'GOVERNOR_DIRECTIVE'),
  stringConstant(renderSource, 'TERMINAL_PROOF_DIRECTIVE'),
];
const dispatchDirective = stringConstant(piSource, 'PI_SUBAGENT_DISPATCH_DIRECTIVE');
const routeHead = 'Advisor: live; use sk-code 0.95/0.30 pass.';
const headlessFallback = directivesLabel.slice(1) + directives.join('');
const headedFirst = routeHead + directivesLabel + directives.join('');
const userFixture = 'measurement-fixture';

assert(renderSource.includes('DIRECTIVES_LABEL + HYGIENE_DIRECTIVE + GOVERNOR_DIRECTIVE + TERMINAL_PROOF_DIRECTIVE'));
assert(piSource.includes('${PI_SUBAGENT_DISPATCH_DIRECTIVE}'));

const scenarios = {
  headedFirst: {
    advisorContextBytes: Buffer.byteLength(headedFirst, 'utf8'),
    totalInjectionBytes: injectionBytes(userFixture, headedFirst, dispatchDirective),
  },
  headedRepeat: {
    advisorContextBytes: Buffer.byteLength(routeHead, 'utf8'),
    totalInjectionBytes: injectionBytes(userFixture, routeHead, dispatchDirective),
  },
  headlessFallbackFirst: {
    advisorContextBytes: Buffer.byteLength(headlessFallback, 'utf8'),
    totalInjectionBytes: injectionBytes(userFixture, headlessFallback, dispatchDirective),
  },
  headlessFallbackRepeat: {
    advisorContextBytes: 0,
    totalInjectionBytes: injectionBytes(userFixture, '', dispatchDirective),
  },
};

const report = {
  measurement: 'source-executed UTF-8 bytes',
  sources: [RENDER_SOURCE, PI_SOURCE],
  components: {
    threeDirectives: byteReceipt(headlessFallback),
    piDispatchDirective: byteReceipt(dispatchDirective),
  },
  scenarios,
  firstTurnVsRepeat: {
    headed: {
      firstTurnBytes: scenarios.headedFirst.totalInjectionBytes,
      repeatBytes: scenarios.headedRepeat.totalInjectionBytes,
      savedBytes: scenarios.headedFirst.totalInjectionBytes - scenarios.headedRepeat.totalInjectionBytes,
    },
    headlessFallback: {
      firstTurnBytes: scenarios.headlessFallbackFirst.totalInjectionBytes,
      repeatBytes: scenarios.headlessFallbackRepeat.totalInjectionBytes,
      savedBytes: scenarios.headlessFallbackFirst.totalInjectionBytes - scenarios.headlessFallbackRepeat.totalInjectionBytes,
    },
  },
};

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
