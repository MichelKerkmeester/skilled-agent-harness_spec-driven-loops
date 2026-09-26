// What the sweeper must never remove.
//
// It deletes build artifacts, so the cost of a wrong rule is a build that will
// not reproduce and a developer with no idea why. The rule that makes it safe
// is narrow and worth stating as a test: the newest build of a name survives
// whatever its age, several artifacts written by one build survive because
// none has superseded another yet, and a file with no build hash in its name
// is not a build artifact at all.

import { spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readdirSync, rmSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import assert from 'node:assert/strict';

const here = dirname(fileURLToPath(import.meta.url));
const root = mkdtempSync(resolve(tmpdir(), 'supercov-sweep-'));
const deps = resolve(root, 'target/debug/deps');
mkdirSync(deps, { recursive: true });
mkdirSync(resolve(root, 'scripts'), { recursive: true });
cpSync(resolve(here, 'sweep-target.mjs'), resolve(root, 'scripts/sweep-target.mjs'));

const days = (n) => (Date.now() - n * 24 * 60 * 60 * 1000) / 1000;
const artifact = (name, age) => {
  const path = resolve(deps, name);
  writeFileSync(path, name);
  utimesSync(path, days(age), days(age));
};

// Three builds of one crate, all old. Two were superseded by the third.
artifact('libengine-aaaaaaaa11.rlib', 20);
artifact('libengine-bbbbbbbb22.rlib', 15);
artifact('libengine-cccccccc33.rlib', 10);
// Two artifacts of one crate written by today's build: a different feature
// set, or a test build beside a lib one. Neither has superseded the other.
artifact('libtool-dddddddd44.rlib', 0);
artifact('libtool-eeeeeeee55.rlib', 0);
// Old, but nothing ever replaced it.
artifact('liblonely-ffffffff66.rlib', 400);
// No build hash: not something cargo names per build, so not ours to remove.
artifact('libengine.rlib', 400);
// Superseded, but only minutes ago -- inside the window that keeps one
// build's own output together.
artifact('libyoung-0000000077.rlib', 0);
artifact('libyoung-1111111188.rlib', 0.001);

const run = spawnSync(process.execPath, [resolve(root, 'scripts/sweep-target.mjs')], { encoding: 'utf8' });
assert.equal(run.status, 0, run.stderr);

const left = readdirSync(deps).sort();
assert.deepEqual(left, [
  'libengine-cccccccc33.rlib',
  'libengine.rlib',
  'liblonely-ffffffff66.rlib',
  'libtool-dddddddd44.rlib',
  'libtool-eeeeeeee55.rlib',
  'libyoung-0000000077.rlib',
  'libyoung-1111111188.rlib',
], `the sweeper removed something it should have kept:\n${run.stdout}`);
assert.match(run.stdout, /removed 2 artifact\(s\) a later build replaced/, run.stdout);
// And it says how much it freed. A sweep run because a disk filled up reports
// nothing more useful than the number of bytes it got back, and counting a
// file as zero -- which is what walking it as a directory does -- turns a
// sweep that freed gigabytes into one that appears to have done nothing.
const freed = run.stdout.match(/replaced \(([\d.]+) GB\)/);
assert.ok(freed, run.stdout);
assert.ok(Number(freed[1]) >= 0, run.stdout);
assert.match(run.stdout, /freed [\d.]+ GB/, run.stdout);

rmSync(root, { recursive: true, force: true });
console.log('[sweep-target] every artifact a build still needs survived');
