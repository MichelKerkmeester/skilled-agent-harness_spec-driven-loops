import { execFile } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';

import { describe, expect, it } from 'vitest';

import { CODE_GRAPH_TOOL_SCHEMAS } from '../tool-schemas.js';
import { codeIndexCliPath, worktreeRoot } from './code-index-cli-harness.js';

const execFileAsync = promisify(execFile);

const expectedToolNames = [
  'code_graph_apply',
  'code_graph_classify_query_intent',
  'code_graph_context',
  'code_graph_query',
  'code_graph_scan',
  'code_graph_status',
  'code_graph_verify',
  'detect_changes',
];

describe('code-index CLI tool parity', () => {
  it('keeps the CLI schema set locked to the eight code-graph MCP tools', () => {
    const names = CODE_GRAPH_TOOL_SCHEMAS.map((schema) => schema.name).sort();

    expect(names).toHaveLength(8);
    expect(new Set(names).size).toBe(8);
    expect(names).toEqual(expectedToolNames);
  });

  it('keeps the real CLI list-tools surface in lockstep with CODE_GRAPH_TOOL_SCHEMAS (offline)', async () => {
    // list-tools renders from the bundled manifest and returns before any
    // daemon/socket interaction, so this runs fully offline. The dev override
    // tolerates a dist that is momentarily older than in-flight source edits.
    const socketDir = mkdtempSync(join(tmpdir(), 'ci-parity-'));
    try {
      const { stdout } = await execFileAsync(
        process.execPath,
        [codeIndexCliPath, 'list-tools', '--format', 'json'],
        {
          cwd: worktreeRoot,
          env: {
            ...process.env,
            SPECKIT_CODE_INDEX_CLI_DEV_ALLOW_STALE: '1',
            SPECKIT_IPC_SOCKET_DIR: socketDir,
          },
          timeout: 20_000,
        },
      );

      const envelope = JSON.parse(stdout) as {
        status?: unknown;
        data?: { count?: unknown; tools?: Array<{ name?: unknown }> };
      };
      expect(envelope.status).toBe('ok');
      expect(envelope.data?.count).toBe(8);

      const cliNames = (envelope.data?.tools ?? []).map((tool) => tool.name).sort();
      expect(cliNames).toEqual(CODE_GRAPH_TOOL_SCHEMAS.map((schema) => schema.name).sort());
      expect(cliNames).toEqual(expectedToolNames);
    } finally {
      rmSync(socketDir, { recursive: true, force: true });
    }
  });
});
