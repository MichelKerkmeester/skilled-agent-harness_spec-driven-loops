// ───────────────────────────────────────────────────────────────
// MODULE: Track Access Default Contract Tests
// ───────────────────────────────────────────────────────────────

import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import * as core from '../core/index.js';
import { handleMemorySearch } from '../handlers/memory-search.js';
import * as toolCache from '../lib/cache/tool-cache.js';
import * as vectorIndex from '../lib/search/vector-index.js';
import * as accessTracker from '../lib/storage/access-tracker.js';
import { TOOL_DEFINITIONS } from '../tool-schemas.js';

const FEEDBACK_FLAG = 'SPECKIT_IMPLICIT_FEEDBACK_LOG';
const EXISTENCE_FLAG = 'SPECKIT_QUERY_TIME_EXISTENCE_FILTER';
const originalFeedbackFlag = process.env[FEEDBACK_FLAG];
const originalExistenceFlag = process.env[EXISTENCE_FLAG];

beforeAll(() => {
  vectorIndex.closeDb();
  vectorIndex.initializeDb(':memory:');
});

afterAll(() => {
  vectorIndex.closeDb();
});

beforeEach(() => {
  process.env[FEEDBACK_FLAG] = 'false';
  delete process.env[EXISTENCE_FLAG];
  vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
  vi.spyOn(toolCache, 'isEnabled').mockReturnValue(true);
  vi.spyOn(toolCache, 'generateCacheKey').mockReturnValue('track-access-default');
  vi.spyOn(toolCache, 'get').mockReturnValue({
    summary: 'Found one memory',
    data: { count: 1, results: [{ id: 701, title: 'Tracked result' }] },
    hints: [],
  });
  vi.spyOn(accessTracker, 'init').mockImplementation(() => undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
  if (originalFeedbackFlag === undefined) {
    delete process.env[FEEDBACK_FLAG];
  } else {
    process.env[FEEDBACK_FLAG] = originalFeedbackFlag;
  }
  if (originalExistenceFlag === undefined) {
    delete process.env[EXISTENCE_FLAG];
  } else {
    process.env[EXISTENCE_FLAG] = originalExistenceFlag;
  }
});

describe('memory_search trackAccess contract', () => {
  it('advertises and applies default-on tracking while honoring explicit false', async () => {
    const memorySearch = TOOL_DEFINITIONS.find((definition) => definition.name === 'memory_search');
    const properties = memorySearch?.inputSchema.properties as Record<string, Record<string, unknown>>;
    expect(properties.trackAccess).toMatchObject({
      type: 'boolean',
      default: true,
    });

    const trackSpy = vi.spyOn(accessTracker, 'trackMultipleAccesses').mockImplementation(() => undefined);
    await handleMemorySearch({ query: 'default tracking query' });
    expect(trackSpy).toHaveBeenCalledWith([701]);

    trackSpy.mockClear();
    await handleMemorySearch({ query: 'disabled tracking query', trackAccess: false });
    expect(trackSpy).not.toHaveBeenCalled();
  });
});
