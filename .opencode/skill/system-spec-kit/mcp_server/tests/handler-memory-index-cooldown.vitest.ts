// ---------------------------------------------------------------
// MODULE: Handler Memory Index Cooldown Tests
// ---------------------------------------------------------------

import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  mockGetLastScanTime: vi.fn(),
  mockSetLastScanTime: vi.fn(),
  mockCheckDatabaseUpdated: vi.fn(),
  mockFindMemoryFiles: vi.fn(() => []),
}));

vi.mock('../core', () => ({
  getLastScanTime: mocks.mockGetLastScanTime,
  setLastScanTime: mocks.mockSetLastScanTime,
  checkDatabaseUpdated: mocks.mockCheckDatabaseUpdated,
}));

vi.mock('../core/config', () => ({
  INDEX_SCAN_COOLDOWN: 60000,
  DEFAULT_BASE_PATH: '/tmp/mock-workspace',
  BATCH_SIZE: 5,
  SERVER_DIR: '/tmp/mock-server',
}));

vi.mock('../utils', () => ({
  processBatches: async (files: string[], worker: (file: string) => Promise<unknown>) => Promise.all(files.map(worker)),
  toErrorMessage: (error: unknown) => error instanceof Error ? error.message : String(error),
}));

vi.mock('../lib/parsing/memory-parser', () => ({
  findMemoryFiles: mocks.mockFindMemoryFiles,
}));

vi.mock('../lib/providers/embeddings', () => ({
  getEmbeddingProfile: vi.fn(() => null),
}));

vi.mock('../lib/parsing/trigger-matcher', () => ({
  clearCache: vi.fn(),
}));

vi.mock('../lib/storage/incremental-index', () => ({
  categorizeFilesForIndexing: vi.fn((files: string[]) => ({
    toIndex: files,
    toUpdate: [],
    toSkip: [],
    toDelete: [],
  })),
  batchUpdateMtimes: vi.fn(() => ({ updated: 0 })),
}));

vi.mock('../lib/response/envelope', () => ({
  createMCPSuccessResponse: (payload: unknown) => ({
    content: [{ type: 'text', text: JSON.stringify(payload) }],
  }),
  createMCPErrorResponse: (payload: unknown) => ({
    content: [{ type: 'text', text: JSON.stringify(payload) }],
  }),
}));

vi.mock('../handlers/memory-save', () => ({
  indexMemoryFile: vi.fn(async () => ({ status: 'indexed', id: 1, specFolder: 'specs/test' })),
}));

import * as handler from '../handlers/memory-index';

describe('handler-memory-index cooldown behavior', () => {
  beforeEach(() => {
    mocks.mockGetLastScanTime.mockReset();
    mocks.mockSetLastScanTime.mockReset();
    mocks.mockCheckDatabaseUpdated.mockReset();
    mocks.mockFindMemoryFiles.mockReset();

    mocks.mockGetLastScanTime.mockResolvedValue(0);
    mocks.mockSetLastScanTime.mockResolvedValue(undefined);
    mocks.mockCheckDatabaseUpdated.mockResolvedValue(false);
    mocks.mockFindMemoryFiles.mockReturnValue([]);
  });

  it('does not set cooldown timestamp when request is rate-limited', async () => {
    const now = Date.now();
    mocks.mockGetLastScanTime.mockResolvedValue(now);

    const result = await handler.handleMemoryIndexScan({
      includeConstitutional: false,
      includeSpecDocs: false,
    });

    expect(mocks.mockSetLastScanTime).not.toHaveBeenCalled();

    const envelope = JSON.parse(result.content[0].text);
    expect(envelope.error).toBe('Rate limited');
  });

  it('sets cooldown timestamp after successful scan response', async () => {
    const result = await handler.handleMemoryIndexScan({
      includeConstitutional: false,
      includeSpecDocs: false,
    });

    expect(mocks.mockSetLastScanTime).toHaveBeenCalledTimes(1);
    expect(typeof mocks.mockSetLastScanTime.mock.calls[0][0]).toBe('number');

    const envelope = JSON.parse(result.content[0].text);
    expect(envelope.summary).toBe('No memory files found');
  });
});
