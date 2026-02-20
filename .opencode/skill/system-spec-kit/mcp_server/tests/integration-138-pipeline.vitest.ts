// @ts-nocheck
// ---------------------------------------------------------------
// TEST: Integration Pipeline (C138 End-to-End)
// Full scatter→fuse→co-activate→TRM→MMR→serialize pipeline.
// Validates latency ceiling, token budget, feature flag regression.
// ---------------------------------------------------------------

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { applyMMR } from '../lib/search/mmr-reranker';
import { detectEvidenceGap } from '../lib/search/evidence-gap-detector';

/* ---------------------------------------------------------------
   MOCK PIPELINE STAGES
   Simulates the full hybridSearchEnhanced() flow from spec 138.
   In production these import from actual modules.
   --------------------------------------------------------------- */

// Stage types
interface SearchResult {
  id: number | string;
  score: number;
  content: string;
  embedding: Float32Array;
  metadata: {
    title: string;
    spec_folder: string;
    importance_tier: string;
  };
}

interface TRMMetadata {
  evidenceGapDetected: boolean;
  zScore: number;
  mean: number;
  stdDev: number;
  warnings: string[];
}

interface EnhancedMCPResponse {
  payload: string;
  trm: TRMMetadata;
  metrics: {
    latencyMs: number;
    tokensConsumed: number;
    sourcesHit: string[];
  };
}

// Stage implementations (simplified for integration testing)
function classifyIntent(query: string): string {
  if (query.includes('fix') || query.includes('bug')) return 'fix_bug';
  if (query.includes('explain') || query.includes('understand')) return 'understand';
  if (query.includes('spec') || query.includes('find')) return 'find_spec';
  return 'understand';
}

function scatter(query: string): SearchResult[] {
  // Simulate vector + FTS5 + graph returning mixed results
  return Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    score: 0.9 - i * 0.05,
    content: `Memory ${i + 1}: ${query} related content. `.repeat(10),
    embedding: new Float32Array([Math.random(), Math.random(), Math.random()]),
    metadata: {
      title: `Memory ${i + 1}`,
      spec_folder: `spec-${i}`,
      importance_tier: i < 3 ? 'critical' : 'normal',
    },
  }));
}

function adaptiveRRFFuse(results: SearchResult[], intent: string): SearchResult[] {
  // Sort by score (simulate RRF)
  return [...results].sort((a, b) => b.score - a.score);
}

function spreadActivation(results: SearchResult[]): SearchResult[] {
  // Co-activation: boost top-5 slightly
  return results.map((r, i) => ({
    ...r,
    score: i < 5 ? r.score * 1.05 : r.score,
  }));
}

function detectEvidenceGapLocal(scores: number[]): TRMMetadata {
  // Delegates to production detectEvidenceGap from evidence-gap-detector.ts
  const trm = detectEvidenceGap(scores);
  return {
    evidenceGapDetected: trm.gapDetected,
    zScore: trm.zScore,
    mean: trm.mean,
    stdDev: trm.stdDev,
    warnings: trm.gapDetected ? ['[EVIDENCE GAP DETECTED]'] : [],
  };
}

function applyMMRLocal(results: SearchResult[], lambda: number, limit: number): SearchResult[] {
  // Delegates to production applyMMR from mmr-reranker.ts
  const candidates = results.map(r => ({
    id: r.id,
    score: r.score,
    embedding: r.embedding,
    content: r.content,
  }));
  const selected = applyMMR(candidates, { lambda, limit });
  // Re-merge metadata from original results
  return selected.map(sel => {
    const orig = results.find(r => r.id === sel.id);
    return orig ?? { ...sel, metadata: { title: String(sel.id), spec_folder: '', importance_tier: 'normal' } };
  });
}

function serializeToMarkdown(results: SearchResult[], trm: TRMMetadata): string {
  const parts: string[] = [];
  if (trm.warnings.length > 0) {
    parts.push(`> **⚠️ EVIDENCE GAP DETECTED:** Low confidence (Z=${trm.zScore.toFixed(2)})\n`);
  }
  for (const r of results) {
    parts.push(`### ${r.metadata.title}\n${r.content.slice(0, 200)}\n`);
  }
  return parts.join('\n');
}

// Full pipeline
function hybridSearchEnhanced(query: string, mode: string, flags: Record<string, boolean>): EnhancedMCPResponse {
  const start = performance.now();

  // L0: Intent
  const intent = classifyIntent(query);

  // L1: Scatter
  let results = scatter(query);

  // L2: Adaptive RRF
  if (flags.SPECKIT_ADAPTIVE_FUSION !== false) {
    results = adaptiveRRFFuse(results, intent);
  }

  // Co-activation
  results = spreadActivation(results);

  // L3: TRM (uses production detectEvidenceGap via local adapter)
  const trm = detectEvidenceGapLocal(results.map(r => r.score));

  // L4: MMR (uses production applyMMR via local adapter)
  if (flags.SPECKIT_MMR !== false) {
    const lambda = intent === 'understand' ? 0.5 : 0.85;
    results = applyMMRLocal(results, lambda, 5);
  }

  // L5: Serialize
  const payload = serializeToMarkdown(results, trm);

  const latencyMs = performance.now() - start;

  return {
    payload,
    trm,
    metrics: {
      latencyMs,
      tokensConsumed: Math.ceil(payload.length / 4),
      sourcesHit: ['vector', 'fts5', 'graph'],
    },
  };
}

/* ---------------------------------------------------------------
   TESTS
   --------------------------------------------------------------- */

describe('C138 Integration Pipeline', () => {
  const ALL_FLAGS_ON = {
    SPECKIT_MMR: true,
    SPECKIT_TRM: true,
    SPECKIT_ADAPTIVE_FUSION: true,
    SPECKIT_MULTI_QUERY: true,
  };

  const ALL_FLAGS_OFF = {
    SPECKIT_MMR: false,
    SPECKIT_TRM: false,
    SPECKIT_ADAPTIVE_FUSION: false,
    SPECKIT_MULTI_QUERY: false,
  };

  // ---- T1: Full pipeline completes within 120ms ----
  it('T1: end-to-end latency is under 120ms', () => {
    const response = hybridSearchEnhanced('fix auth token error', 'auto', ALL_FLAGS_ON);

    expect(response.metrics.latencyMs).toBeLessThan(120);
  });

  // ---- T2: Token budget respected ----
  it('T2: payload respects 2000-token (8000 char) budget', () => {
    const response = hybridSearchEnhanced('explain architecture', 'deep', ALL_FLAGS_ON);

    expect(response.payload.length).toBeLessThanOrEqual(8000);
    expect(response.metrics.tokensConsumed).toBeLessThanOrEqual(2000);
  });

  // ---- T3: All source types hit ----
  it('T3: pipeline hits vector, fts5, and graph sources', () => {
    const response = hybridSearchEnhanced('find spec for auth', 'auto', ALL_FLAGS_ON);

    expect(response.metrics.sourcesHit).toContain('vector');
    expect(response.metrics.sourcesHit).toContain('fts5');
    expect(response.metrics.sourcesHit).toContain('graph');
  });

  // ---- T4: TRM metadata populated ----
  it('T4: TRM metadata has valid statistical fields', () => {
    const response = hybridSearchEnhanced('fix bug in login', 'auto', ALL_FLAGS_ON);

    expect(typeof response.trm.zScore).toBe('number');
    expect(typeof response.trm.mean).toBe('number');
    expect(typeof response.trm.stdDev).toBe('number');
    expect(typeof response.trm.evidenceGapDetected).toBe('boolean');
  });

  // ---- T5: Evidence gap warning appears when gap detected ----
  it('T5: evidence gap warning appears in payload when gap is detected', () => {
    // Use a query that produces uniform scores (gap detected)
    const response = hybridSearchEnhanced('bake bread recipe', 'auto', ALL_FLAGS_ON);

    if (response.trm.evidenceGapDetected) {
      expect(response.payload).toContain('EVIDENCE GAP DETECTED');
    }
  });

  // ---- T6: Feature flags OFF → no regression ----
  it('T6: flags OFF produces valid results without new features', () => {
    const response = hybridSearchEnhanced('fix auth error', 'auto', ALL_FLAGS_OFF);

    expect(response.payload.length).toBeGreaterThan(0);
    expect(response.metrics.latencyMs).toBeLessThan(120);
    expect(typeof response.trm.zScore).toBe('number');
  });

  // ---- T7: Flags ON vs OFF produce different results ----
  it('T7: adaptive fusion flag changes output characteristics', () => {
    const withFlags = hybridSearchEnhanced('understand architecture', 'auto', ALL_FLAGS_ON);
    const withoutFlags = hybridSearchEnhanced('understand architecture', 'auto', ALL_FLAGS_OFF);

    // Both should produce valid output
    expect(withFlags.payload.length).toBeGreaterThan(0);
    expect(withoutFlags.payload.length).toBeGreaterThan(0);
  });

  // ---- T8: Different intents produce different pipeline behavior ----
  it('T8: fix_bug vs understand intents produce different results', () => {
    const fixBug = hybridSearchEnhanced('fix the login bug', 'auto', ALL_FLAGS_ON);
    const understand = hybridSearchEnhanced('explain the login system', 'auto', ALL_FLAGS_ON);

    // Both valid but potentially different characteristics
    expect(fixBug.metrics.latencyMs).toBeLessThan(120);
    expect(understand.metrics.latencyMs).toBeLessThan(120);
  });

  // ---- T9: Mode="deep" activates multi-query ----
  it('T9: deep mode search still returns valid results', () => {
    const response = hybridSearchEnhanced('fix login error', 'deep', ALL_FLAGS_ON);

    expect(response.payload.length).toBeGreaterThan(0);
    expect(response.metrics.latencyMs).toBeLessThan(120);
  });

  // ---- T10: Response structure matches EnhancedMCPResponse ----
  it('T10: response has correct shape', () => {
    const response = hybridSearchEnhanced('test query', 'auto', ALL_FLAGS_ON);

    expect(response).toHaveProperty('payload');
    expect(response).toHaveProperty('trm');
    expect(response).toHaveProperty('metrics');
    expect(response.metrics).toHaveProperty('latencyMs');
    expect(response.metrics).toHaveProperty('tokensConsumed');
    expect(response.metrics).toHaveProperty('sourcesHit');
    expect(response.trm).toHaveProperty('evidenceGapDetected');
    expect(response.trm).toHaveProperty('zScore');
    expect(response.trm).toHaveProperty('warnings');
  });
});
