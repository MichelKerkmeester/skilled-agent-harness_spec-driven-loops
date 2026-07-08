import { describe, expect, it } from 'vitest';

import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const require = createRequire(import.meta.url);
const {
  appendFinding,
  getCrossTopicPriors,
  loadRegistry,
  registryPath,
} = require('../lib/findings-registry.cjs') as {
  appendFinding: (packetPath: string, finding: Record<string, unknown>, options?: Record<string, unknown>) => Record<string, unknown>;
  getCrossTopicPriors: (packetPath: string, options?: Record<string, unknown>) => Array<Record<string, unknown>>;
  loadRegistry: (packetPath: string) => Array<Record<string, unknown>>;
  registryPath: (packetPath: string) => string;
};

/**
 * Creates a temporary directory and runs the callback within it, cleaning up afterwards.
 */
async function withTempPacket(run: (packetPath: string) => void | Promise<void>): Promise<void> {
  const tempDir = mkdtempSync(join(tmpdir(), 'council-findings-registry-'));
  try {
    await run(tempDir);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

/**
 * Creates a default finding object for testing with the given overrides.
 */
function finding(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    session_id: 'council-session-test',
    topic_id: 'topic-001-runtime-boundary',
    topic_slug: 'runtime-boundary',
    round_id: 'round-002',
    finding_type: 'topic-final-verdict',
    claim: 'Extend runtime with council primitives',
    stance: 'support',
    confidence: 0.82,
    source_artifacts: ['ai-council/topics/topic-001-runtime-boundary/rounds/round-002/deliberation.md'],
    ...overrides,
  };
}

describe('deep-ai-council findings registry', () => {
  it('appendFinding writes atomically and canonicalizes fingerprint schema', () => {
    return withTempPacket((packetPath) => {
      const appended = appendFinding(packetPath, finding(), { now: '2026-05-23T09:30:00.000Z' });

      expect(appended).toMatchObject({
        fingerprint: 'council:runtime-boundary:extend-runtime-with-council-primitives',
        topic_id: 'topic-001-runtime-boundary',
        finding_type: 'topic-final-verdict',
        source_iter: 'round-002',
      });
      expect(String(appended.content_hash)).toMatch(/^sha256:[a-f0-9]{64}$/);
      expect(existsSync(registryPath(packetPath))).toBe(true);

      const raw = JSON.parse(readFileSync(registryPath(packetPath), 'utf8'));
      expect(raw).toMatchObject({
        schema_version: '1.0',
        registry_name: 'deep-ai-council-findings-registry',
        session_id: 'council-session-test',
      });
      expect(raw.findings).toHaveLength(1);
    });
  });

  it('loadRegistry returns the parsed findings array', () => {
    return withTempPacket((packetPath) => {
      appendFinding(packetPath, finding({ claim: 'First verdict' }));
      appendFinding(packetPath, finding({ topic_id: 'topic-002-convergence', topic_slug: 'convergence', claim: 'Second verdict' }));

      const registry = loadRegistry(packetPath);

      expect(registry).toHaveLength(2);
      expect(registry.map((entry) => entry.claim)).toEqual(['First verdict', 'Second verdict']);
    });
  });

  it('getCrossTopicPriors returns the most recent unique verdicts across topics', () => {
    return withTempPacket((packetPath) => {
      appendFinding(packetPath, finding({
        topic_id: 'topic-001-runtime-boundary',
        topic_slug: 'runtime-boundary',
        claim: 'Older verdict',
      }), { now: '2026-05-23T09:30:00.000Z' });
      appendFinding(packetPath, finding({
        topic_id: 'topic-002-convergence',
        topic_slug: 'convergence',
        claim: 'Middle verdict',
        source_artifacts: ['ai-council/topics/topic-002-convergence/rounds/round-002/deliberation.md'],
      }), { now: '2026-05-23T09:31:00.000Z' });
      appendFinding(packetPath, finding({
        topic_id: 'topic-003-cost-guards',
        topic_slug: 'cost-guards',
        claim: 'Newest verdict',
        source_artifacts: ['ai-council/topics/topic-003-cost-guards/rounds/round-002/deliberation.md'],
      }), { now: '2026-05-23T09:32:00.000Z' });

      const priors = getCrossTopicPriors(packetPath, { limit: 2, topic_id: 'topic-004-command-wiring' });

      expect(priors.map((prior) => prior.claim)).toEqual(['Newest verdict', 'Middle verdict']);
      expect(priors[0]).toMatchObject({
        fingerprint: 'council:cost-guards:newest-verdict',
        stance: 'support',
        confidence: 0.82,
        source_artifact: 'ai-council/topics/topic-003-cost-guards/rounds/round-002/deliberation.md',
      });
    });
  });

  it('concurrent appends do not corrupt the registry document', async () => {
    await withTempPacket(async (packetPath) => {
      const writes = Array.from({ length: 25 }, (_unused, index) => Promise.resolve().then(() => {
        appendFinding(packetPath, finding({
          topic_id: `topic-${String(index + 1).padStart(3, '0')}-concurrent`,
          topic_slug: `concurrent-${index + 1}`,
          claim: `Concurrent verdict ${index + 1}`,
        }));
      }));

      await Promise.all(writes);
      const raw = JSON.parse(readFileSync(registryPath(packetPath), 'utf8'));
      expect(raw.findings).toHaveLength(25);
      expect(loadRegistry(packetPath).map((entry) => entry.fingerprint)).toHaveLength(25);
    });
  });
});
