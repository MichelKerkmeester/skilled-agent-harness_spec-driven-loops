// ───────────────────────────────────────────────────────────────────
// MODULE: Packet Purpose
// ───────────────────────────────────────────────────────────────────
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterAll, describe, expect, it } from 'vitest';

import { resolvePacketPurpose } from '../lib/spec/packet-purpose.js';

const ROOT = mkdtempSync(join(tmpdir(), 'packet-purpose-'));
afterAll(() => rmSync(ROOT, { recursive: true, force: true }));

function packet(relativeFolder: string, purpose: string, objective?: string): string {
  const folder = join(ROOT, relativeFolder);
  mkdirSync(folder, { recursive: true });
  writeFileSync(
    join(folder, 'spec.md'),
    `# Spec\n\n### Problem Statement\nA problem.\n\n### Purpose\n${purpose}\n<!-- /ANCHOR:problem -->\n`,
  );
  if (objective) writeFileSync(join(folder, 'goal.md'), `# Goal\n\n**Objective:** ${objective}\n`);
  return folder;
}

const parent = packet('specs/demo/001-parent', 'Keep the parent outcome in view. This second sentence is dropped.');
const child = packet('specs/demo/001-parent/002-child', '[One-paragraph purpose, what this phase achieves]');
const scaffolded = packet(
  'specs/demo/003-scaffolded',
  'Keep parent documentation lean while child phases own detailed plans, tasks, checklists, and continuity.',
  'Ship the scaffolded packet goal.',
);

describe('resolvePacketPurpose', () => {
  it('returns the first sentence of the packet purpose', () => {
    expect(resolvePacketPurpose(parent)).toEqual({
      text: 'Keep the parent outcome in view.',
      source: 'packet',
      folder: parent,
    });
  });

  it('uses the nearest phase parent purpose when the child purpose is a placeholder', () => {
    expect(resolvePacketPurpose(child)).toEqual({
      text: 'Keep the parent outcome in view.',
      source: 'ancestor',
      folder: parent,
    });
  });

  it('skips the scaffold layout sentence and falls back to the goal objective', () => {
    expect(resolvePacketPurpose(scaffolded)).toEqual({
      text: 'Ship the scaffolded packet goal.',
      source: 'goal',
      folder: scaffolded,
    });
  });

  it('returns null for a folder that does not exist', () => {
    expect(resolvePacketPurpose(join(ROOT, 'specs/demo/404-missing'))).toBeNull();
  });
});
