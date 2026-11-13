'use strict';

// A host repository vendors Skilled under `.skilled` and holds none of its spec
// tree, so the route sync check skips there. Skilled's own checkout with the
// authored folder missing still fails.

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { authoredRootState } = require('../compiled-route-sync.cjs');

function tempDir(t, prefix) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}

test('a host whose .skilled points outside it skips the missing authored folder', (t) => {
  const vendor = tempDir(t, 'route-sync-vendor-');
  const host = tempDir(t, 'route-sync-host-');
  fs.mkdirSync(path.join(vendor, '.skilled'));
  fs.symlinkSync(path.join(vendor, '.skilled'), path.join(host, '.skilled'));
  assert.equal(authoredRootState(vendor, host), 'host-skip');
});

test('an own checkout with a real .skilled still reports the folder missing', (t) => {
  const own = tempDir(t, 'route-sync-own-');
  fs.mkdirSync(path.join(own, '.skilled'));
  assert.equal(authoredRootState(own, own), 'missing');
});
