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

function rawPacket(relativeFolder: string, spec: string): string {
  const folder = join(ROOT, relativeFolder);
  mkdirSync(folder, { recursive: true });
  writeFileSync(join(folder, 'spec.md'), spec);
  return folder;
}

const combinedHeading = rawPacket(
  'specs/demo/010-combined-heading',
  '# Spec\n\n## 2. PROBLEM & PURPOSE\n\nThe archive never shrinks, so the disk fills.\nA second line of the same paragraph.\n\nA later paragraph.\n\n## 3. SCOPE\n',
);
const labelled = rawPacket(
  'specs/demo/011-labelled',
  '# Spec\n\n## 2. PROBLEM & PURPOSE\n\nThe archive never shrinks.\n\n**Purpose:** keep three archives and delete the rest. More detail.\n\n## 3. SCOPE\n',
);
const rootPurpose = rawPacket(
  'specs/demo/012-root-purpose',
  '# Spec\n\n## ROOT PURPOSE\n\nGive every runtime one goal hook.\n',
);
const labelOutsideSection = rawPacket(
  'specs/demo/013-label-outside',
  '# Spec\n\n## 1. METADATA\n\nPurpose: a table note that is not the packet purpose.\n',
);
const numbered = packet(
  'specs/demo/014-numbered',
  '1. Measure the archive size (e.g. with du) before the cut. Then cut.',
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

  it('reads the first paragraph under a combined problem and purpose heading', () => {
    expect(resolvePacketPurpose(combinedHeading)).toEqual({
      text: 'The archive never shrinks, so the disk fills.',
      source: 'packet',
      folder: combinedHeading,
    });
  });

  it('prefers a labelled purpose paragraph inside that section and drops the label', () => {
    expect(resolvePacketPurpose(labelled)?.text).toBe('keep three archives and delete the rest.');
  });

  it('reads a root purpose heading', () => {
    expect(resolvePacketPurpose(rootPurpose)?.text).toBe('Give every runtime one goal hook.');
  });

  it('ignores a purpose label outside a purpose section', () => {
    expect(resolvePacketPurpose(labelOutsideSection)).toBeNull();
  });

  it('drops a list marker and does not end the sentence at an abbreviation', () => {
    expect(resolvePacketPurpose(numbered)?.text).toBe('Measure the archive size (e.g. with du) before the cut.');
  });
});
