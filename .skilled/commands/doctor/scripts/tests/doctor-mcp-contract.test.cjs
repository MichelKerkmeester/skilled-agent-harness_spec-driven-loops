#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Doctor MCP Contract Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');

// ─────────────────────────────────────────────────────────────────────────────
// 2. PATHS
// ─────────────────────────────────────────────────────────────────────────────

const COMMAND_ROOT = path.resolve(__dirname, '../..');
const ROUTER = fs.readFileSync(path.join(COMMAND_ROOT, 'mcp.md'), 'utf8');
const PRESENTATION = fs.readFileSync(path.join(COMMAND_ROOT, 'assets', 'doctor-mcp-presentation.txt'), 'utf8');

function errorBlocks(code) {
  return [...PRESENTATION.matchAll(/```text\n((?:(?!```)[\s\S])*?)\nSTATUS=FAIL ERROR="([a-z_]+)"\n```/g)]
    .filter((match) => match[2] === code)
    .map((match) => match[1]);
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. FLAG ERRORS
// ─────────────────────────────────────────────────────────────────────────────

test('a flag neither sub-action accepts has an unknown-flag error naming the valid flags', () => {
  const blocks = errorBlocks('unknown_flag');
  assert.equal(blocks.length, 2);
  assert.ok(blocks.some((text) => text.includes('`install`') && text.includes('--runtime <name>')));
  assert.ok(blocks.some((text) => text.includes('`debug`') && text.includes('--fix')));
  assert.match(ROUTER, /a flag neither sub-action accepts with its unknown-flag error/);
});

test('a flag owned by the other sub-action keeps the cross-sub-action error', () => {
  const blocks = errorBlocks('cross_sub_action_flag_injection');
  assert.equal(blocks.length, 2);
  assert.ok(blocks.some((text) => text.startsWith("Flag '--fix' is only valid for `debug`")));
  assert.ok(blocks.some((text) => text.startsWith("Flag '--runtime' is only valid for `install`")));
});
