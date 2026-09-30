// ───────────────────────────────────────────────────────────────────
// MODULE: Track Narrowing Measurement Tests
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  buildTestSet,
  classifyDescription,
  testSetLines,
} from '../retrieval/score-track-narrowing.mjs';

// ───────────────────────────────────────────────────────────────────
// 2. HELPERS
// ───────────────────────────────────────────────────────────────────

const tempDirs: string[] = [];

function tempDir(prefix: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) fs.rmSync(dir, { recursive: true, force: true });
  }
});

function write(root: string, rel: string, text: string): void {
  const abs = path.join(root, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, text);
}

function track(root: string, name: string, description: string): void {
  write(root, path.join('specs', name, 'description.json'), JSON.stringify({ description }));
}

function packet(root: string, folder: string, description: string): void {
  write(root, path.join(folder, 'description.json'), JSON.stringify({ description }));
}

function sha256(folder: string): string {
  return createHash('sha256').update(folder).digest('hex');
}

// ───────────────────────────────────────────────────────────────────
// 3. TEST SET
// ───────────────────────────────────────────────────────────────────

describe('score-track-narrowing test set', () => {
  it('keeps at most 20 rows per track, first by SHA-256 of the folder path', () => {
    const root = tempDir('score-track-narrowing-');
    track(root, 'alpha-track', 'Owned sample questions live at this root');
    track(root, 'beta', 'Owned sample questions live at this root');

    const folders: string[] = [];
    for (let number = 1; number <= 22; number += 1) {
      const nn = String(number).padStart(2, '0');
      const folder = `specs/alpha-track/0${nn}-p`;
      folders.push(folder);
      packet(root, folder, `quartz lantern sample number ${nn} here`);
    }
    packet(root, 'specs/beta/001-x', 'ember harbor lamp stone river');

    const set = buildTestSet(root, { hubNames: [] });
    const expectedIds = folders
      .slice()
      .sort((left, right) => {
        const leftDigest = sha256(left);
        const rightDigest = sha256(right);
        if (leftDigest < rightDigest) return -1;
        if (leftDigest > rightDigest) return 1;
        return 0;
      })
      .slice(0, 20);

    expect(set.counts['alpha-track']).toEqual({
      kept: 20,
      usable: 22,
      placeholder: 0,
      leak: 0,
      residual: 0,
    });
    const alphaIds = set.rows
      .filter((row) => row.track === 'alpha-track')
      .map((row) => row.id);
    expect(alphaIds).toEqual(expectedIds);
    expect(set.rows).toHaveLength(21);
    expect(testSetLines(set)[0]).toBe(
      'test set: tracks=2 kept=21 usable=23 placeholder=0 leak=0 residual=0',
    );
  });

  it('drops a description that names a track or a hub and counts it', () => {
    const root = tempDir('score-track-narrowing-');
    track(root, 'alpha-track', 'Owned sample questions live at this root');
    track(root, 'beta', 'Owned sample questions live at this root');
    packet(root, 'specs/beta/001-a', 'this one fixes the alpha track loader cache');
    packet(root, 'specs/beta/002-b', 'moves the demo hub router into place');
    packet(root, 'specs/beta/003-c', 'beta lantern quartz ember harbor stone');

    const set = buildTestSet(root, { hubNames: ['demo-hub'] });
    expect(set.counts.beta).toEqual({
      kept: 1,
      usable: 1,
      placeholder: 0,
      leak: 2,
      residual: 1,
    });
  });

  it('counts placeholders by each rule', () => {
    expect(classifyDescription('', 'x', [])).toBe('placeholder');
    expect(classifyDescription('[TODO] fill this in later', 'x', [])).toBe('placeholder');
    expect(classifyDescription('Phase 3: build the thing now', 'x', [])).toBe('placeholder');
    expect(classifyDescription(
      'Deem search narrowing arm build',
      '017-deem-search-narrowing-arm-build',
      [],
    )).toBe('placeholder');
    expect(classifyDescription('four tokens only here', 'x', [])).toBe('placeholder');
    expect(classifyDescription('five clean tokens are here', 'x', [])).toBe('kept');

    const root = tempDir('score-track-narrowing-');
    track(root, 'beta', 'Owned sample questions live at this root');
    packet(root, 'specs/beta/001-x', 'ember harbor lamp stone river');
    packet(root, 'specs/beta/001-x/scratch/sub', 'clean quartz lantern sample here');

    const set = buildTestSet(root, { hubNames: [] });
    expect(set.counts.beta.usable).toBe(1);
  });
});
