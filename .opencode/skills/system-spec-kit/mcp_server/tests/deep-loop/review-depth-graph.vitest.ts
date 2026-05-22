import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

type HandlerResponse = { content: Array<{ type: string; text: string }> };

type CoverageModules = {
  closeDb: () => void;
  handleCoverageGraphUpsert: (args: Record<string, unknown>) => Promise<HandlerResponse>;
};

const originalDbDir = process.env.SPEC_KIT_DB_DIR;
const tempDirs: string[] = [];
const futureReviewNodeKinds = ['BUG_CLASS', 'INVARIANT', 'PRODUCER', 'CONSUMER', 'TEST'] as const;
let activeCloseDb: (() => void) | null = null;

function parseResponse(response: HandlerResponse): Record<string, unknown> {
  return JSON.parse(response.content[0]?.text ?? '{}') as Record<string, unknown>;
}

async function loadCoverageModules(): Promise<CoverageModules> {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'review-depth-graph-'));
  tempDirs.push(tempDir);
  process.env.SPEC_KIT_DB_DIR = tempDir;
  vi.resetModules();

  const dbModule = await import('../../lib/coverage-graph/coverage-graph-db.js');
  const upsertModule = await import('../../handlers/coverage-graph/upsert.js');

  activeCloseDb = dbModule.closeDb;

  return {
    closeDb: dbModule.closeDb,
    handleCoverageGraphUpsert: upsertModule.handleCoverageGraphUpsert,
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

describe('review-depth graph vocabulary fixtures', () => {
  it('upserting BUG_CLASS node today fails with unsupported_kind', async () => {
    const { handleCoverageGraphUpsert } = await loadCoverageModules();
    const response = parseResponse(await handleCoverageGraphUpsert({
      specFolder: 'specs/review-depth-graph-fixture',
      loopType: 'review',
      sessionId: 'review-depth-graph-fixture',
      nodes: [
        { id: 'bug-class-state-transition', kind: 'BUG_CLASS', name: 'State transition bug class' },
      ],
    }));
    const data = response.data as Record<string, unknown>;
    const validationErrors = (data.validationErrors as string[] | undefined) ?? [];

    expect(response.status).toBe('ok');
    expect(data.insertedNodes).toBe(0);
    expect(validationErrors.join('\n')).toMatch(/unsupported_kind|invalid_kind|Invalid node kind "BUG_CLASS"/);
  });

  for (const kind of futureReviewNodeKinds) {
    it.skip(`upserting ${kind} node succeeds after Phase G allow-list extension`, async () => {
      // EXPECT: enable after phase G (007-ledger-led-graph-vocabulary).
      const { handleCoverageGraphUpsert } = await loadCoverageModules();
      const response = parseResponse(await handleCoverageGraphUpsert({
        specFolder: 'specs/review-depth-graph-fixture',
        loopType: 'review',
        sessionId: `review-depth-graph-${kind.toLowerCase()}`,
        nodes: [
          { id: `${kind.toLowerCase()}-1`, kind, name: `${kind} fixture` },
        ],
      }));

      expect(response.status).toBe('ok');
      expect((response.data as Record<string, unknown>).insertedNodes).toBe(1);
    });
  }
});
