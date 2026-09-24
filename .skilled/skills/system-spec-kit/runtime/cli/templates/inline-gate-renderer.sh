#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Inline Gate Renderer Wrapper
# ───────────────────────────────────────────────────────────────
# Renders Level-gated markdown templates for shell callers.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
LOADER="$SKILL_ROOT/node_modules/tsx/dist/loader.mjs"
RENDERER="$SCRIPT_DIR/inline-gate-renderer.ts"

if [[ -f "$LOADER" && -f "$RENDERER" ]]; then
  exec node --import "$LOADER" "$RENDERER" "$@"
fi

# Without tsx, or without the TypeScript renderer beside this wrapper, the
# same renderer runs as plain JavaScript. It mirrors inline-gate-renderer.ts
# line for line, and inline-gate-renderer-fallback.vitest.ts holds the two
# to identical output on every shipped template at every level.
IFS= read -r -d '' FALLBACK_JS <<'NODE' || true
'use strict';
const fs = require('fs');

const VALID_LEVELS = new Set(['1', '2', '3', '3+', 'phase', 'review', 'research']);
const GATE_OPEN = /^\s*<!--\s*IF\s+(.+?)\s*-->\s*$/u;
const GATE_CLOSE = /^\s*<!--\s*\/IF\s*-->\s*$/u;
const GATE_EMPTY = /^\s*<!--\s*IF\s+(.+?)\s*-->\s*<!--\s*\/IF\s*-->\s*$/u;

function tokenize(expression) {
  const tokens = [];
  let position = 0;

  while (position < expression.length) {
    if (/\s/u.test(expression[position])) {
      position += 1;
      continue;
    }

    if (expression[position] === '(' || expression[position] === ')') {
      tokens.push(expression[position]);
      position += 1;
      continue;
    }

    const start = position;
    while (position < expression.length && !/\s|\(|\)/u.test(expression[position])) {
      position += 1;
    }
    let token = expression.slice(start, position);

    if (/^[a-z]+:/u.test(token)) {
      while (position < expression.length) {
        let next = position;
        while (next < expression.length && /\s/u.test(expression[next])) {
          next += 1;
        }

        if (expression[next] === ',') {
          token += ',';
          position = next + 1;
          continue;
        }

        if (token.endsWith(',') && /[A-Za-z0-9+_-]/u.test(expression[next] ?? '')) {
          const valueStart = next;
          position = next;
          while (position < expression.length && /[A-Za-z0-9+_-]/u.test(expression[position])) {
            position += 1;
          }
          token += expression.slice(valueStart, position);
          continue;
        }

        break;
      }
    }

    tokens.push(token);
  }

  return tokens;
}

function peek(state) {
  return state.tokens[state.position];
}

function consume(state) {
  const token = state.tokens[state.position];
  if (!token) {
    throw new Error('Unexpected end of inline gate expression');
  }
  state.position += 1;
  return token;
}

function parseAtom(state) {
  const token = consume(state);
  const match = /^([a-z]+):([A-Za-z0-9+,_-]+)$/u.exec(token);
  if (!match) {
    throw new Error(`Invalid inline gate atom: ${token}`);
  }
  const [, axis, valueList] = match;
  if (axis !== 'level') {
    throw new Error(`Unsupported inline gate axis: ${axis}`);
  }
  const values = valueList.split(',');
  const normalizedValues = values.map((value) => value.trim());
  normalizedValues.forEach((value, index) => {
    if (value === '' && index === normalizedValues.length - 1) {
      return;
    }
    if (!VALID_LEVELS.has(value)) {
      throw new Error(`Unsupported inline gate level: ${value || '(empty)'}`);
    }
  });
  return normalizedValues.some((value) => value === state.level);
}

function parsePrimary(state) {
  if (peek(state) === '(') {
    consume(state);
    const value = parseOr(state);
    if (consume(state) !== ')') {
      throw new Error('Unclosed inline gate expression group');
    }
    return value;
  }
  return parseAtom(state);
}

function parseUnary(state) {
  if (peek(state)?.toUpperCase() === 'NOT') {
    consume(state);
    return !parseUnary(state);
  }
  return parsePrimary(state);
}

function parseAnd(state) {
  let value = parseUnary(state);
  while (peek(state)?.toUpperCase() === 'AND') {
    consume(state);
    value = parseUnary(state) && value;
  }
  return value;
}

function parseOr(state) {
  let value = parseAnd(state);
  while (peek(state)?.toUpperCase() === 'OR') {
    consume(state);
    value = parseAnd(state) || value;
  }
  return value;
}

function evaluateGateExpression(expression, level) {
  if (!VALID_LEVELS.has(level)) {
    throw new Error(`Unsupported render level: ${level}`);
  }
  const state = { tokens: tokenize(expression), position: 0, level };
  const value = parseOr(state);
  if (state.position !== state.tokens.length) {
    throw new Error(`Unexpected inline gate token: ${state.tokens[state.position]}`);
  }
  return value;
}

function renderInlineGates(template, level) {
  const lines = template.split(/(?<=\n)/u);
  const output = [];
  const stack = [];
  let isInFence = false;
  let pendingInactiveGateBoundary = false;

  for (const line of lines) {
    if (pendingInactiveGateBoundary && stack.length === 0 && /^\s*$/u.test(line)) {
      continue;
    }

    if (/^\s*(`{3}|~~~)/u.test(line)) {
      if (stack.every((frame) => frame.parentActive && frame.conditionActive)) {
        output.push(line);
      }
      isInFence = !isInFence;
      pendingInactiveGateBoundary = false;
      continue;
    }

    if (!isInFence) {
      const emptyMatch = GATE_EMPTY.exec(line);
      if (emptyMatch) {
        evaluateGateExpression(emptyMatch[1], level);
        continue;
      }

      const openMatch = GATE_OPEN.exec(line);
      if (openMatch) {
        const parentActive = stack.every((frame) => frame.parentActive && frame.conditionActive);
        stack.push({ parentActive, conditionActive: evaluateGateExpression(openMatch[1], level) });
        continue;
      }

      if (GATE_CLOSE.test(line)) {
        if (stack.length === 0) {
          throw new Error('Unmatched inline gate close marker');
        }
        const closedFrame = stack[stack.length - 1];
        stack.pop();
        pendingInactiveGateBoundary = stack.length === 0 && !(closedFrame.parentActive && closedFrame.conditionActive);
        continue;
      }
    }

    if (stack.every((frame) => frame.parentActive && frame.conditionActive)) {
      output.push(line);
    }
    pendingInactiveGateBoundary = false;
  }

  if (stack.length > 0) {
    throw new Error('Unclosed inline gate marker');
  }

  return output.join('');
}

function parseCliArgs(args) {
  const levelIndex = args.indexOf('--level');
  if (levelIndex === -1 || !args[levelIndex + 1]) {
    return null;
  }
  const level = args[levelIndex + 1];
  const outDirIndex = args.indexOf('--out-dir');
  const outDir = outDirIndex >= 0 ? args[outDirIndex + 1] : undefined;
  if (outDirIndex >= 0 && !outDir) {
    return null;
  }
  const filePaths = args.filter((arg, index) => {
    if (index === levelIndex || index === levelIndex + 1) return false;
    if (index === outDirIndex || index === outDirIndex + 1) return false;
    return !arg.startsWith('--');
  });
  return { level, outDir, filePaths };
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString('utf8');
}

async function main() {
  const parsed = parseCliArgs(process.argv.slice(1));
  if (!parsed) {
    console.error('Usage: inline-gate-renderer.sh --level <1|2|3|3+|phase|review|research> [--out-dir DIR file...] [template-file]');
    process.exitCode = 2;
    return;
  }

  if (parsed.outDir) {
    if (parsed.filePaths.length === 0) {
      console.error('--out-dir mode requires at least one template file');
      process.exitCode = 2;
      return;
    }
    fs.mkdirSync(parsed.outDir, { recursive: true });
    for (const filePath of parsed.filePaths) {
      const rendered = renderInlineGates(fs.readFileSync(filePath, 'utf8'), parsed.level);
      const outputName = filePath.endsWith('.tmpl')
        ? filePath.split('/').pop().replace(/\.tmpl$/u, '')
        : filePath.split('/').pop();
      fs.writeFileSync(`${parsed.outDir}/${outputName}`, rendered, 'utf8');
    }
    return;
  }

  const input = parsed.filePaths[0] ? fs.readFileSync(parsed.filePaths[0], 'utf8') : await readStdin();
  process.stdout.write(renderInlineGates(input, parsed.level));
}

main().catch((error) => {
  console.error(`inline-gate-renderer: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
NODE

exec node --input-type=commonjs -e "$FALLBACK_JS" -- "$@"
