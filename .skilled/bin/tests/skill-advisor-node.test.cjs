'use strict';

// The advisor wrapper picks the Node that starts the CLI. These cases cover the
// choice without reinstalling the runtime under another Node.

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { advisorNode } = require('../skill-advisor.cjs');

function recordFile(record) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'advisor-node-'));
  const file = path.join(dir, '.advisor-node');
  if (record !== null) fs.writeFileSync(file, JSON.stringify(record));
  return file;
}

test('keeps the session Node when no record exists', () => {
  assert.deepEqual(advisorNode(recordFile(null), '127'), { execPath: process.execPath, warning: null });
});

test('keeps the session Node when the recorded ABI matches', () => {
  const file = recordFile({ execPath: '/nonexistent/node', modules: '127' });
  assert.deepEqual(advisorNode(file, '127'), { execPath: process.execPath, warning: null });
});

test('uses the recorded Node when the ABI differs and the binary exists', () => {
  const file = recordFile({ execPath: __filename, modules: '147' });
  assert.deepEqual(advisorNode(file, '127'), { execPath: __filename, warning: null });
});

test('names both ABIs when the recorded binary is gone', () => {
  const file = recordFile({ execPath: '/nonexistent/node', modules: '147' });
  const result = advisorNode(file, '127');
  assert.equal(result.execPath, process.execPath);
  assert.match(result.warning, /147/);
  assert.match(result.warning, /127/);
});
