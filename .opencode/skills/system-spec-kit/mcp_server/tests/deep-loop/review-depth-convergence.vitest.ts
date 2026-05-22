import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

type HandlerResponse = { content: Array<{ type: string; text: string }> };

type CoverageModules = {
  closeDb: () => void;
  handleCoverageGraphConvergence: (args: Record<string, unknown>) => Promise<HandlerResponse>;
};

const originalDbDir = process.env.SPEC_KIT_DB_DIR;
const tempDirs: string[] = [];
let activeCloseDb: (() => void) | null = null;

function parseResponse(response: HandlerResponse): Record<string, unknown> {
  return JSON.parse(response.content[0]?.text ?? '{}') as Record<string, unknown>;
}

async function loadCoverageModules(): Promise<CoverageModules> {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'review-depth-convergence-'));
  tempDirs.push(tempDir);
  process.env.SPEC_KIT_DB_DIR = tempDir;
  vi.resetModules();

  const dbModule = await import('../../lib/coverage-graph/coverage-graph-db.js');
  const convergenceModule = await import('../../handlers/coverage-graph/convergence.js');

  activeCloseDb = dbModule.closeDb;

  return {
    closeDb: dbModule.closeDb,
    handleCoverageGraphConvergence: convergenceModule.handleCoverageGraphConvergence,
  };
}

afterEach(() => {
  activeCloseDb?.();
  activeCloseDb = null;
  vi.resetModules();
  if (originalDbDir === undefined) {
    delete process.env.SPEC_KIT_DB_DIR;
  } else {
    process.env.SPEC_KIT_DB_DIR = originalDbDir;
  }

  while (tempDirs.length > 0) {
    const tempDir = tempDirs.pop();
    if (tempDir) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
});

describe('review-depth convergence v2 fixtures', () => {
  // TODO(116/008): Convert this to a workflow-runner integration fixture that
  // executes step_check_convergence YAML with reducer registry state. The graph
  // handler alone must keep graph-empty CONTINUE behavior for Phase F.
  it.todo('blocks graphless standard-scope STOP when fallback ledger rows are missing');
});
