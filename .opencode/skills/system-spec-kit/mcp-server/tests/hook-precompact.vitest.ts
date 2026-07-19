// ───────────────────────────────────────────────────────────────
// TEST: PreCompact Hook
// ───────────────────────────────────────────────────────────────
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { mergeCompactBrief, type MergeInput } from '@spec-kit/shared/compact-merger';
import { buildCompactContext, detectSpecFolder, tailFile } from '../hooks/claude/compact-inject.js';
import { ensureStateDir, loadState, updateState, getStatePath, type PersistedHookState } from '../hooks/claude/hook-state.js';
import { truncateToTokenBudget, COMPACTION_TOKEN_BUDGET } from '../hooks/claude/shared.js';

function loadPersistedState(sessionId: string): PersistedHookState | null {
  const result = loadState(sessionId);
  return result.ok ? result.state : null;
}

describe('precompact hook', () => {
  const testSessionId = 'test-precompact';

  beforeEach(() => {
    ensureStateDir();
  });

  afterEach(() => {
    try { rmSync(getStatePath(testSessionId)); } catch { /* ok */ }
  });

  describe('context caching', () => {
    it('caches payload in hook state', () => {
      const payload = '## Active Files\n- /src/main.ts\n- /src/utils.ts';
      const cachedAt = '2026-04-17T11:00:00.000Z';
      updateState(testSessionId, {
        pendingCompactPrime: {
          payload,
          cachedAt,
        },
      });

      const state = loadPersistedState(testSessionId);
      expect(state).not.toBeNull();
      expect(state!.pendingCompactPrime).not.toBeNull();
      expect(state!.pendingCompactPrime!.payload).toBe(payload);
      expect(state!.pendingCompactPrime!.cachedAt).toBe(cachedAt);
    });

    it('overwrites previous cached payload', () => {
      updateState(testSessionId, {
        pendingCompactPrime: { payload: 'old', cachedAt: new Date().toISOString() },
      });
      updateState(testSessionId, {
        pendingCompactPrime: { payload: 'new', cachedAt: new Date().toISOString() },
      });

      const state = loadPersistedState(testSessionId);
      expect(state!.pendingCompactPrime!.payload).toBe('new');
    });
  });

  describe('token budget enforcement', () => {
    it('truncates payload exceeding budget', () => {
      const largePayload = 'a'.repeat(20000);
      const truncated = truncateToTokenBudget(largePayload, COMPACTION_TOKEN_BUDGET);
      expect(truncated.length).toBeLessThan(largePayload.length);
      expect(truncated).toContain('[...truncated');
    });

    it('keeps payload within budget', () => {
      const smallPayload = '## Context\n- file.ts';
      const result = truncateToTokenBudget(smallPayload, COMPACTION_TOKEN_BUDGET);
      expect(result).toBe(smallPayload);
    });
  });

  describe('transcript extraction', () => {
    it('tails only the most recent transcript lines', () => {
      const root = mkdtempSync(join(tmpdir(), 'precompact-hook-'));
      const transcriptPath = join(root, 'transcript.jsonl');

      try {
        mkdirSync(root, { recursive: true });
        writeFileSync(
          transcriptPath,
          Array.from({ length: 75 }, (_, index) => `line-${index + 1}`).join('\n'),
        );

        expect(tailFile(transcriptPath, 3)).toEqual(['line-73', 'line-74', 'line-75']);
      } finally {
        rmSync(root, { recursive: true, force: true });
      }
    });

    it('extracts file paths from transcript lines', () => {
      const lines = [
        '{"message":{"content":"Reading /src/hooks/shared.ts"}}',
        '{"message":{"content":"Editing /src/lib/code-graph/indexer.ts"}}',
        'plain text with /some/path.js reference',
      ];
      const pathRegex = /(?:\/[\w.-]+){2,}(?:\.\w+)/g;
      const paths = new Set<string>();
      for (const line of lines) {
        const matches = line.match(pathRegex);
        if (matches) matches.forEach(m => paths.add(m));
      }
      expect(paths.size).toBeGreaterThan(0);
      expect([...paths]).toContain('/src/hooks/shared.ts');
    });

    it('surfaces recent topics from transcript lines', () => {
      const context = buildCompactContext([
        'Using memory_search before compaction',
        'Checking code_graph_query output for specs/system-speckit',
        'Dispatching task_context for next-step context',
      ]);

      expect(context).toContain('## Recent Topics');
      expect(context).toContain('- memory_search');
      expect(context).toContain('- code_graph_query');
      expect(context).toContain('- specs/system-speckit');
      expect(context).toContain('- task_context');
    });

    it('detects spec folders from file paths and bare folder mentions', () => {
      const folder = '.opencode/specs/x/y';

      expect(detectSpecFolder([
        `Read ${folder}/implementation-summary.md during compaction`,
      ])).toBe(folder);
      expect(detectSpecFolder([
        `Continue in ${folder}`,
      ])).toBe(folder);
    });
  });

  describe('merge pipeline', () => {
    it('creates a compact payload contract from merged precompact signals', () => {
      const input: MergeInput = {
        constitutional: '',
        codeGraph: 'Active files:\n- /src/hooks/shared.ts',
        triggered: '',
        sessionState: 'Recent topics:\n- memory_search\n- code_graph_query',
      };

      const brief = mergeCompactBrief(input, COMPACTION_TOKEN_BUDGET, undefined, {
        strategy: 'pre-merge',
        selectedFrom: ['transcript-tail', 'active-files', 'recent-topics'],
        fileCount: 1,
        topicCount: 2,
        attentionSignalCount: 0,
        notes: ['No recovered compact transcript lines detected in the current tail.'],
        antiFeedbackGuards: ['Strip recovered hook-cache source markers before transcript summarization.'],
      });

      expect(brief.text).toContain('## Active Files & Structural Context');
      expect(brief.text).toContain('## Session State / Next Steps');
      expect(brief.payloadContract.kind).toBe('compaction');
      expect(brief.payloadContract.provenance.producer).toBe('compact_merger');
      expect(brief.payloadContract.provenance.sourceRefs).toContain('compact-merger');
      expect(brief.payloadContract.selection?.topicCount).toBe(2);
      expect(brief.payloadContract.sections.map((section) => section.source)).toEqual(['code-graph', 'session']);
    });
  });
});
