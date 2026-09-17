import { describe, expect, it, afterEach, vi } from 'vitest';
import {
  DEFAULT_PER_TOKEN_SIMILARITY_THRESHOLD,
  findRelevantFolders,
  getPerTokenSimilarityThreshold,
  passesPerTokenSimilarityGate,
  tokenSimilarity,
  type DescriptionCache,
} from '../lib/search/folder-discovery';

describe('folder discovery per-token threshold', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  const cache: DescriptionCache = {
    version: 1,
    generated: '2026-05-08T00:00:00.000Z',
    folders: [
      {
        specFolder: 'skilled-agent-orchestration/023-sk-deep-research-creation',
        description: 'Deep research creation workflow and orchestration',
        keywords: ['deep', 'research', 'creation', 'workflow', 'orchestration'],
        lastUpdated: '2026-05-08T00:00:00.000Z',
      },
      {
        specFolder: 'system-spec-kit/022-semantic-search',
        description: 'Semantic search retrieval and vector routing',
        keywords: ['semantic', 'search', 'retrieval', 'vector', 'routing'],
        lastUpdated: '2026-05-08T00:00:00.000Z',
      },
    ],
  };

  it('uses 0.45 as the default per-token similarity threshold', () => {
    expect(DEFAULT_PER_TOKEN_SIMILARITY_THRESHOLD).toBe(0.45);
    expect(getPerTokenSimilarityThreshold()).toBe(0.45);
  });

  it('allows the threshold to be configured via env', () => {
    vi.stubEnv('SPECKIT_FOLDER_DISCOVERY_TOKEN_THRESHOLD', '0.62');
    expect(getPerTokenSimilarityThreshold()).toBe(0.62);
  });

  it('does not treat a single shared generic token as a strong folder signal', () => {
    const weakFolder = cache.folders[0];
    const queryTerms = ['semantic', 'search'];

    expect(findRelevantFolders('Semantic Search', cache, 2).length).toBeGreaterThan(0);
    expect(passesPerTokenSimilarityGate(queryTerms, weakFolder)).toBe(false);
  });

  it('accepts a folder only when every query token clears the threshold', () => {
    const strongFolder = cache.folders[1];
    expect(passesPerTokenSimilarityGate(['semantic', 'search'], strongFolder)).toBe(true);
    expect(tokenSimilarity('semantic', 'semantic')).toBe(1);
  });
});
