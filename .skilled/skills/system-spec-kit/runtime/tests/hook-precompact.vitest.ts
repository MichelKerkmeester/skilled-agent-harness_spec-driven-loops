// ───────────────────────────────────────────────────────────────────
// MODULE: PreCompact Hook
// ───────────────────────────────────────────────────────────────────
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { mergeCompactBrief, type MergeInput } from '@spec-kit/shared/compact-merger';
import {
  buildCompactContext,
  buildMergedCompactResult,
  detectSpecFolder,
  isSubagentPayload,
  mintHistoryLocator,
  persistCompactResult,
  tailFile,
  type CompactResult,
} from '../hooks/claude/compact-inject.js';
import { ensureStateDir, loadState, updateState, getStatePath, type PersistedHookState } from '../hooks/claude/hook-state.js';
import { truncateToTokenBudget, COMPACTION_TOKEN_BUDGET } from '../hooks/claude/shared.js';
import { createSharedPayloadEnvelope } from '../lib/context/shared-payload.js';
import {
  CANONICAL_FOLD_VERSION,
  getUnicodeRuntimeFingerprint,
} from '../cli/lib/unicode-normalization';

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

  describe('history locator persistence', () => {
    function compactResult(text: string): CompactResult {
      const now = new Date().toISOString();
      return {
        text,
        payloadContract: createSharedPayloadEnvelope({
          kind: 'compaction',
          sections: [{ key: 'test', title: 'Test Compact Context', content: text, source: 'session' }],
          summary: 'Test compact payload',
          provenance: {
            producer: 'compact_merger',
            sourceSurface: 'test-compact-cache',
            trustState: 'cached',
            generatedAt: now,
            lastUpdated: null,
            sourceRefs: ['test-compact-cache', 'hook-state'],
            sanitizerVersion: CANONICAL_FOLD_VERSION,
            runtimeFingerprint: getUnicodeRuntimeFingerprint(),
          },
        }),
      };
    }

    it('persists the locator beside the compact cache in the same state write', () => {
      const root = mkdtempSync(join(tmpdir(), 'precompact-locator-'));
      const transcriptPath = join(root, `${testSessionId}.jsonl`);
      try {
        writeFileSync(transcriptPath, `${JSON.stringify({ type: 'user', message: { content: 'hello' } })}\n`);
        const timestamp = new Date().toISOString();
        const locator = mintHistoryLocator({
          sessionId: testSessionId,
          transcriptPath,
          workspace: process.cwd(),
          runtime: 'claude',
          mintedAt: timestamp,
        });

        expect(locator).not.toBeNull();
        expect(persistCompactResult(testSessionId, compactResult('## Active Files\n- /test.ts'), timestamp, locator)).toBe(true);

        const state = loadPersistedState(testSessionId);
        expect(state).not.toBeNull();
        expect(state!.pendingCompactPrime?.cachedAt).toBe(timestamp);
        expect(state!.historyLocator?.handle).toBe(locator!.handle);
      } finally {
        rmSync(root, { recursive: true, force: true });
      }
    });

    it('writes no locator when the payload has no transcript path', () => {
      const timestamp = new Date().toISOString();
      expect(persistCompactResult(testSessionId, compactResult('summary only'), timestamp, null)).toBe(true);

      const state = loadPersistedState(testSessionId);
      expect(state).not.toBeNull();
      expect(state!.pendingCompactPrime).not.toBeNull();
      expect(state!.historyLocator).toBeNull();
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
        'Reviewing specs/system-speckit before compaction',
        'Checking unrelated output that names no packet',
      ]);

      expect(context).toContain('## Recent Topics');
      expect(context).toContain('- specs/system-speckit');
      expect(context).not.toContain('- unrelated');
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

  describe('recovered context brief', () => {
    const projectRoot = resolve(import.meta.dirname, '../../../../..');
    const commentHygiene = '.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh';
    const historyFixture = '.skilled/skills/system-spec-kit/runtime/tests/_support/history-fixtures.ts';
    const transcript = [
      JSON.stringify({ message: { content: `Read ${commentHygiene}` } }),
      JSON.stringify({ message: { content: `Read ${join(projectRoot, historyFixture)}` } }),
      JSON.stringify({ message: { content: 'Read sk-code-quality/scripts/check-comment-hygiene.sh' } }),
      // Each word repeats so the pre-filter frequency floor surfaces it.
      JSON.stringify({
        message: {
          content: 'Users saw The regression. Users saw The regression. Development reviewed it. '
            + 'Development approved. Fixed the reader. Fixed the writer. RESULT: PASSED. RESULT: PASSED.',
        },
      }),
      JSON.stringify({ message: { content: 'Reference /tmp/MEGA/catalog.json and again in reference/MEGA/catalog.json' } }),
      JSON.stringify({ message: { content: 'buildMergedContext( runs twice; buildMergedContext( is hot' } }),
    ];

    it('keeps each path whole and drops a fragment of the same file', async () => {
      const result = await buildMergedCompactResult(transcript, projectRoot);
      const activeFiles = result.payloadContract.sections
        .find((section) => section.source === 'code-graph')?.content ?? '';

      expect(activeFiles).toContain(`- ${commentHygiene}`);
      expect(activeFiles).toContain(`- ${historyFixture}`);
      expect(activeFiles).not.toContain('- /skills/sk-code/');
      expect(activeFiles).not.toContain('- /_support/history-fixtures.ts');
      expect(activeFiles.match(/check-comment-hygiene\.sh/g) ?? []).toHaveLength(1);
    });

    it('keeps paths and prose out of the attention topics', async () => {
      const result = await buildMergedCompactResult(transcript, projectRoot);

      for (const topic of ['Users', 'The', 'Development', 'Fixed', 'RESULT', 'PASSED', 'MEGA', 'Read', 'Reference']) {
        expect(result.text).not.toContain(`- ${topic} (referenced`);
      }
      expect(result.text).toContain('- buildMergedContext (referenced 2x)');
    });
  });

  describe('merge pipeline', () => {
    it('creates a compact payload contract from merged precompact signals', () => {
      const input: MergeInput = {
        constitutional: '',
        codeGraph: 'Active files:\n- /src/hooks/shared.ts',
        triggered: '',
        sessionState: 'Recent topics:\n- specs/system-speckit',
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

  describe('isSubagentPayload', () => {
    it('flags a payload that carries an agent id', () => {
      expect(isSubagentPayload({
        session_id: 's',
        agent_id: 'a78dbc9773274be92',
        agent_type: 'fork',
      })).toBe(true);
    });

    it('ignores a payload with no agent id', () => {
      expect(isSubagentPayload({ session_id: 's' })).toBe(false);
    });

    it('ignores empty and whitespace-only agent ids', () => {
      expect(isSubagentPayload({ session_id: 's', agent_id: '' })).toBe(false);
      expect(isSubagentPayload({ session_id: 's', agent_id: '   ' })).toBe(false);
    });

    it('ignores a non-string agent id and null input', () => {
      expect(isSubagentPayload({ session_id: 's', agent_id: 42 })).toBe(false);
      expect(isSubagentPayload(null)).toBe(false);
    });
  });
});
