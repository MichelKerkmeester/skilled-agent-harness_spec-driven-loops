'use strict';

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const test = require('node:test');

const SCRIPT = path.resolve(__dirname, '../remediate-hook.cjs');
const { enterRemediateHook } = require(SCRIPT);

test('REMEDIATE requires confirmation at both module and CLI boundaries', () => {
  assert.throws(
    () => enterRemediateHook('/tmp/remediate-authorization-fixture'),
    /requires explicit operator confirmation/,
  );

  const cli = spawnSync('node', [SCRIPT, '--spec-folder', '/tmp/remediate-authorization-fixture', '--json'], {
    encoding: 'utf8',
  });
  assert.equal(cli.status, 3);
  assert.match(cli.stderr, /--confirm is required/);
});
