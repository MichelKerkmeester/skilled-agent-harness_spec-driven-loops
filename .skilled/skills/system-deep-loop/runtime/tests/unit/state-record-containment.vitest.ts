// ───────────────────────────────────────────────────────────────
// MODULE: State record append containment
// ───────────────────────────────────────────────────────────────
//
// The append helper writes to whatever path its caller names. A path that
// resolves outside the working directory, directly or through a symlink, would
// let a malformed or hostile interpolation append to an arbitrary file, so the
// helper refuses it before any byte is written.

import { describe, it, expect, afterAll } from 'vitest';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const RUNTIME = path.resolve(__dirname, '..', '..');
const APPENDER = path.join(RUNTIME, 'scripts', 'append-state-record.cjs');
const RECORD = JSON.stringify({ type: 'event', event: 'probe' });

const temps: string[] = [];
function tempDir(prefix: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  temps.push(dir);
  return dir;
}
afterAll(() => { for (const d of temps) fs.rmSync(d, { recursive: true, force: true }); });

function appendFrom(cwd: string, target: string) {
  return spawnSync('node', [APPENDER, target], { cwd, input: RECORD, encoding: 'utf8' });
}

describe('the append target must stay inside the working directory', () => {
  it('appends to a relative target inside the working directory', () => {
    const root = tempDir('contain-root-');
    fs.mkdirSync(path.join(root, 'review'));
    const result = appendFrom(root, 'review/state.jsonl');

    expect(result.status).toBe(0);
    expect(fs.readFileSync(path.join(root, 'review', 'state.jsonl'), 'utf8')).toContain('"probe"');
  });

  it('refuses an absolute target outside the working directory and creates nothing', () => {
    const root = tempDir('contain-root-');
    const outside = tempDir('contain-outside-');
    const target = path.join(outside, 'state.jsonl');
    const result = appendFrom(root, target);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain('outside the working directory');
    expect(fs.existsSync(target)).toBe(false);
  });

  it('refuses a dot-dot target that climbs out of the working directory', () => {
    const parent = tempDir('contain-parent-');
    const root = path.join(parent, 'root');
    fs.mkdirSync(root);
    const result = appendFrom(root, '../escaped.jsonl');

    expect(result.status).toBe(1);
    expect(fs.existsSync(path.join(parent, 'escaped.jsonl'))).toBe(false);
  });

  it('refuses a target reached through a symlinked directory that points outside', () => {
    const root = tempDir('contain-root-');
    const outside = tempDir('contain-outside-');
    fs.symlinkSync(outside, path.join(root, 'link'));
    const result = appendFrom(root, 'link/state.jsonl');

    expect(result.status).toBe(1);
    expect(fs.existsSync(path.join(outside, 'state.jsonl'))).toBe(false);
  });

  it('refuses a dangling symlink leaf whose target lies outside', () => {
    const root = tempDir('contain-root-');
    const outside = tempDir('contain-outside-');
    const escapeTarget = path.join(outside, 'created-later.jsonl');
    fs.symlinkSync(escapeTarget, path.join(root, 'state.jsonl'));
    const result = appendFrom(root, 'state.jsonl');

    expect(result.status).toBe(1);
    expect(fs.existsSync(escapeTarget)).toBe(false);
  });
});
