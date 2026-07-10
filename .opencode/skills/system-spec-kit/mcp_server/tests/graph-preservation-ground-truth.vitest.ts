// ───────────────────────────────────────────────────────────────
// 1. TEST — GRAPH PRESERVATION GROUND TRUTH LOADER
// ───────────────────────────────────────────────────────────────
//
// Guards the fixture's anchor-resolution contract: relevance rows carry a
// stable repo-relative file-path anchor (not a raw memory_index id, which
// drifts across reindexes), and resolution must never silently drop an
// unresolvable anchor.

import Database from 'better-sqlite3';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import {
  resolveGraphPreservationRelevanceIds,
  GRAPH_PRESERVATION_QUERIES,
  GRAPH_PRESERVATION_RELEVANCES,
  type GraphPreservationRelevance,
} from '../lib/eval/graph-preservation-ground-truth-data';
import {
  extractTerms,
  hasTriggerMatch,
  calculateStopWordRatio,
  isContentRichShortQuery,
} from '../lib/search/query-classifier';
import { classifyRetrievalClass } from '../lib/search/retrieval-class-classifier';

describe('graph-preservation ground truth loader', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = new Database(':memory:');
    db.exec(`
      CREATE TABLE memory_index (
        id INTEGER PRIMARY KEY,
        parent_id INTEGER,
        file_path TEXT
      );
    `);
  });

  afterEach(() => {
    db.close();
  });

  describe('resolveGraphPreservationRelevanceIds', () => {
    it('resolves an anchor to the memory_index row whose file_path ends with it', () => {
      db.prepare('INSERT INTO memory_index (id, parent_id, file_path) VALUES (?, NULL, ?)').run(
        42,
        '/Users/someone/repo/.opencode/specs/track/900-example/spec.md',
      );

      const relevances: GraphPreservationRelevance[] = [
        { queryId: 1, anchorFilePath: '.opencode/specs/track/900-example/spec.md', relevance: 3 },
      ];

      const { resolved, unresolved } = resolveGraphPreservationRelevanceIds(db, relevances);
      expect(unresolved).toEqual([]);
      expect(resolved).toEqual([
        { queryId: 1, memoryId: 42, relevance: 3, anchorFilePath: '.opencode/specs/track/900-example/spec.md' },
      ]);
    });

    it('reports an unresolvable anchor in unresolved rather than dropping it silently', () => {
      const relevances: GraphPreservationRelevance[] = [
        { queryId: 1, anchorFilePath: '.opencode/specs/track/does-not-exist/spec.md', relevance: 2 },
      ];

      const { resolved, unresolved } = resolveGraphPreservationRelevanceIds(db, relevances);
      expect(resolved).toEqual([]);
      expect(unresolved).toEqual(relevances);
    });

    it('excludes child rows (parent_id NOT NULL) from resolution, matching only top-level memories', () => {
      db.prepare('INSERT INTO memory_index (id, parent_id, file_path) VALUES (?, ?, ?)').run(
        7,
        1,
        '/repo/.opencode/specs/track/900-example/child.md',
      );

      const relevances: GraphPreservationRelevance[] = [
        { queryId: 1, anchorFilePath: '.opencode/specs/track/900-example/child.md', relevance: 1 },
      ];

      const { resolved, unresolved } = resolveGraphPreservationRelevanceIds(db, relevances);
      expect(resolved).toEqual([]);
      expect(unresolved).toEqual(relevances);
    });

    it('prefers the highest id when multiple rows share a path suffix', () => {
      db.prepare('INSERT INTO memory_index (id, parent_id, file_path) VALUES (?, NULL, ?)').run(
        10,
        '/old-checkout/.opencode/specs/track/900-example/spec.md',
      );
      db.prepare('INSERT INTO memory_index (id, parent_id, file_path) VALUES (?, NULL, ?)').run(
        99,
        '/new-checkout/.opencode/specs/track/900-example/spec.md',
      );

      const relevances: GraphPreservationRelevance[] = [
        { queryId: 1, anchorFilePath: '.opencode/specs/track/900-example/spec.md', relevance: 3 },
      ];

      const { resolved } = resolveGraphPreservationRelevanceIds(db, relevances);
      expect(resolved[0]?.memoryId).toBe(99);
    });

    it('resolves an empty relevance list to an empty result with no errors', () => {
      const { resolved, unresolved } = resolveGraphPreservationRelevanceIds(db, []);
      expect(resolved).toEqual([]);
      expect(unresolved).toEqual([]);
    });
  });

  describe('fixture loading', () => {
    it('exports arrays even when the committed fixture is still the pre-authoring empty skeleton', () => {
      expect(Array.isArray(GRAPH_PRESERVATION_QUERIES)).toBe(true);
      expect(Array.isArray(GRAPH_PRESERVATION_RELEVANCES)).toBe(true);
    });
  });

  // The committed fixture itself, checked against the real live
  // classifiers -- not synthetic data. A query's slice label is only trusted
  // if isContentRichShortQuery()/classifyRetrievalClass() actually agree with
  // it; the benchmark driver's own no-trigger-phrases contract is mirrored
  // here (hasTriggerMatch(query, []) -- see run-graph-preservation-flag-eval.mjs's
  // header comment on why passing real trigger phrases here would mismatch
  // what the driver measures at benchmark-run time).
  describe('committed fixture (REQ-001)', () => {
    it('has at least 50 labeled queries', () => {
      expect(GRAPH_PRESERVATION_QUERIES.length).toBeGreaterThanOrEqual(50);
    });

    it('gives every query at least one relevance row', () => {
      const queryIdsWithRelevance = new Set(GRAPH_PRESERVATION_RELEVANCES.map((r) => r.queryId));
      const missing = GRAPH_PRESERVATION_QUERIES.filter((q) => !queryIdsWithRelevance.has(q.id));
      expect(missing).toEqual([]);
    });

    it("labels every query's slice membership consistently with the live classifiers", () => {
      const mismatches: string[] = [];
      for (const q of GRAPH_PRESERVATION_QUERIES) {
        const terms = extractTerms(q.query);
        const hasTrigger = hasTriggerMatch(q.query, []);
        const stopWordRatio = calculateStopWordRatio(terms);
        const contentRichShort = isContentRichShortQuery(terms.length, hasTrigger, stopWordRatio);
        const retrieval = classifyRetrievalClass(q.query);
        const singleHop = retrieval.retrievalClass === 'SingleHop';

        const matchesLabel = q.slice === 'content_rich_short'
          ? contentRichShort === true
          : q.slice === 'single_hop'
            ? singleHop === true
            : contentRichShort === false && singleHop === false;

        if (!matchesLabel) {
          mismatches.push(`id=${q.id} query=${JSON.stringify(q.query)} slice=${q.slice} contentRichShort=${contentRichShort} retrievalClass=${retrieval.retrievalClass}`);
        }
      }
      expect(mismatches).toEqual([]);
    });

    it('distributes queries across all three slices (no slice is empty)', () => {
      const bySlice = new Map<string, number>();
      for (const q of GRAPH_PRESERVATION_QUERIES) {
        bySlice.set(q.slice, (bySlice.get(q.slice) ?? 0) + 1);
      }
      expect(bySlice.get('content_rich_short') ?? 0).toBeGreaterThan(0);
      expect(bySlice.get('single_hop') ?? 0).toBeGreaterThan(0);
      expect(bySlice.get('control') ?? 0).toBeGreaterThan(0);
    });

    // Anchor resolution against the real live corpus is intentionally NOT
    // asserted here: it depends on mutable external DB state (which this
    // packet's own file-path-anchor design accepts will drift as files move)
    // and a machine-local DB path, neither of which belong in a portable,
    // deterministic CI suite. That check is the benchmark driver's own
    // pre-flight responsibility (run-graph-preservation-flag-eval.mjs fails
    // closed on any unresolved anchor before scoring) -- see
    // graph-preservation-flag-eval-driver.vitest.ts and
    // resolveGraphPreservationRelevanceIds's synthetic-DB coverage above for
    // the resolution logic itself.
  });
});
