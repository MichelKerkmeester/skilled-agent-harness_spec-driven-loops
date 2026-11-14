// ───────────────────────────────────────────────────────────────────
// MODULE: Authored Continuity Snapshot Tests
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterAll, describe, expect, it } from 'vitest';

import { refreshAuthoredContinuitySnapshot } from '../lib/continuity/authored-continuity-snapshot.js';

const WORKSPACE = fs.mkdtempSync(path.join(os.tmpdir(), 'authored-snapshot-'));
afterAll(() => fs.rmSync(WORKSPACE, { recursive: true, force: true }));

describe('authored continuity snapshot', () => {
  it('keeps the stored purpose copy and leads the Goal facet with it', () => {
    const folder = path.join(WORKSPACE, 'specs', 'demo', '001-snapshot');
    fs.mkdirSync(folder, { recursive: true });
    const purpose = 'Purpose: Keep the snapshot purpose in view.';
    fs.writeFileSync(path.join(folder, 'implementation-summary.md'), [
      '---',
      'title: "Implementation Summary"',
      '_memory:',
      '  continuity:',
      '    packet_pointer: "demo/001-snapshot"',
      '    last_updated_at: "2026-11-13T00:00:00Z"',
      '    last_updated_by: "tester"',
      '    recent_action: "Recorded the snapshot fixture"',
      '    next_safe_action: "Verify the snapshot fixture"',
      `    packet_purpose: "${purpose}"`,
      '---',
      '# Implementation Summary',
      '',
    ].join('\n'));

    const result = refreshAuthoredContinuitySnapshot({
      enabled: true,
      specFolder: 'demo/001-snapshot',
      workspacePath: WORKSPACE,
    });

    expect(result.status).toBe('updated');
    expect(result.facets?.goal[0]).toBe(purpose);
    expect(fs.readFileSync(path.join(folder, 'implementation-summary.md'), 'utf8')).toContain(`packet_purpose: "${purpose}"`);
  });
});
