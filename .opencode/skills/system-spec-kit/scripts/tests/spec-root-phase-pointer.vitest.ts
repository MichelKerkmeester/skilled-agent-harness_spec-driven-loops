// ───────────────────────────────────────────────────────────────────
// MODULE: Spec Root Phase Pointer Tests
// ───────────────────────────────────────────────────────────────────

import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { refreshPhaseParentPointersAfterSave } from '../core/workflow.js';
import { resolveSpecFolderCanonical } from '../core/spec-root-canonical-resolver.js';

const PACKET_ID = 'system-speckit/100-parent/001-child';

let tempDirectory: string;
let workspacePath: string;

function writeGraphMetadata(folderPath: string, packetId: string): void {
  fs.writeFileSync(
    path.join(folderPath, 'graph-metadata.json'),
    `${JSON.stringify({
      schema_version: 1,
      packet_id: packetId,
      spec_folder: packetId,
      parent_id: null,
      children_ids: [],
      manual: {
        depends_on: [],
        supersedes: [],
        related_to: [],
      },
      derived: {
        trigger_phrases: [],
        key_topics: [],
        importance_tier: 'normal',
        status: 'planned',
        key_files: [],
        entities: [],
        causal_summary: '',
        created_at: '2020-01-01T00:00:00.000Z',
        last_save_at: '2020-01-01T00:00:00.000Z',
        last_accessed_at: null,
        source_docs: [],
        last_active_child_id: null,
        last_active_at: null,
      },
    }, null, 2)}\n`,
    'utf8',
  );
}

describe('workflow phase-parent pointer refresh', () => {
  beforeEach(() => {
    tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-root-phase-pointer-'));
    workspacePath = path.join(tempDirectory, 'workspace');

    const parentPath = path.join(
      workspacePath,
      '.opencode',
      'specs',
      'system-speckit',
      '100-parent',
    );
    const childPath = path.join(parentPath, '001-child');
    fs.mkdirSync(childPath, { recursive: true });
    fs.writeFileSync(path.join(parentPath, 'spec.md'), '# Parent\n', 'utf8');
    fs.writeFileSync(path.join(childPath, 'spec.md'), '# Child\n', 'utf8');
    writeGraphMetadata(parentPath, 'system-speckit/100-parent');
    writeGraphMetadata(childPath, PACKET_ID);
  });

  afterEach(() => {
    fs.rmSync(tempDirectory, { recursive: true, force: true });
  });

  it('updates the canonical parent from the resolved absolute child path', async () => {
    const legacyQualifiedChild = path.join('specs', PACKET_ID);
    const resolvedChild = resolveSpecFolderCanonical(PACKET_ID, workspacePath);

    expect(fs.existsSync(path.join(workspacePath, legacyQualifiedChild))).toBe(false);

    await refreshPhaseParentPointersAfterSave(resolvedChild);

    const parentMetadata = JSON.parse(
      fs.readFileSync(path.join(path.dirname(resolvedChild), 'graph-metadata.json'), 'utf8'),
    ) as { children_ids: string[]; derived: { last_active_child_id: string | null } };

    expect(parentMetadata.derived.last_active_child_id).toBe(PACKET_ID);
    expect(parentMetadata.children_ids).toContain(PACKET_ID);
  });
});
