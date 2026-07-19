---
title: "232 -- Adaptive-fusion mode flag"
description: "This scenario validates Adaptive-fusion mode flag for `232`. It focuses on confirming live hybrid search honors `SPECKIT_ADAPTIVE_FUSION` while the install guide documents the operator-facing disable switch."
audited_post_018: true
phase_018_change: "Validated against phase-018 canonical continuity refactor; adaptive fusion stays live and the install-guide disable switch remains aligned with the runtime flag gate."
version: 3.6.0.14
id: implement-and-remove-deprecated-features-adaptive-fusion-flag-drift
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 232 -- Adaptive-fusion mode flag

## 1. OVERVIEW

This scenario validates Adaptive-fusion mode flag for `232`. It focuses on confirming live hybrid search honors `SPECKIT_ADAPTIVE_FUSION` while the install guide documents the operator-facing disable switch.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm live hybrid search honors `SPECKIT_ADAPTIVE_FUSION` while the install guide documents the operator-facing disable switch.
- Real user request: `` Please validate Adaptive-fusion mode flag against cd .opencode/skills/system-spec-kit/mcp_server and tell me whether the expected signals are present: The targeted adaptive-fusion and hybrid-search tests pass, the live fusion path checks `isAdaptiveFusionEnabled()` before choosing adaptive weights vs fixed `fuseResultsMulti(...)`, and `INSTALL-GUIDE.md` documents `SPECKIT_ADAPTIVE_FUSION` as an operator-facing disable switch. ``
- Prompt: `Validate adaptive-fusion mode flag against the targeted adaptive-fusion and hybrid-search checks.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: The targeted adaptive-fusion and hybrid-search tests pass, the live fusion path checks `isAdaptiveFusionEnabled()` before choosing adaptive weights vs fixed `fuseResultsMulti(...)`, and `INSTALL-GUIDE.md` documents `SPECKIT_ADAPTIVE_FUSION` as an operator-facing disable switch
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the targeted checks prove adaptive fusion stays flag-gated in the live runtime path and the install guide reflects the same flag-toggle guidance

---

## 3. TEST EXECUTION

### Prompt

```
As a canonical-continuity validation operator, confirm live hybrid search honors SPECKIT_ADAPTIVE_FUSION while the install guide documents the disable switch against cd .opencode/skills/system-spec-kit/mcp_server. Verify the targeted adaptive-fusion and hybrid-search tests pass, the live fusion path checks isAdaptiveFusionEnabled() before choosing adaptive weights vs fixed fuseResultsMulti(...), and INSTALL-GUIDE.md documents SPECKIT_ADAPTIVE_FUSION as an operator-facing disable switch. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `cd .opencode/skills/system-spec-kit/mcp_server`
2. `npx vitest run tests/adaptive-fusion.vitest.ts tests/hybrid-search.vitest.ts`
3. `sed -n '1248,1312p' lib/search/hybrid-search.ts`
4. `rg -n "SPECKIT_ADAPTIVE_FUSION" INSTALL-GUIDE.md`
5. `rg -n "isAdaptiveFusionEnabled|adaptiveEnabled|adaptiveFuse|fuseResultsMulti" lib/search/hybrid-search.ts tests/adaptive-fusion.vitest.ts tests/hybrid-search.vitest.ts`

### Expected

The targeted adaptive-fusion and hybrid-search tests pass, the live fusion path checks `isAdaptiveFusionEnabled()` before choosing adaptive weights vs fixed `fuseResultsMulti(...)`, and `INSTALL-GUIDE.md` documents `SPECKIT_ADAPTIVE_FUSION` as an operator-facing disable switch

### Evidence

Command 1:

```bash
cd .opencode/skills/system-spec-kit/mcp_server
```

Output:

```text
(no output)
```

Command 2:

```bash
npx vitest run tests/adaptive-fusion.vitest.ts tests/hybrid-search.vitest.ts
```

Output:

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit

(node:68135) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)

 Test Files  2 passed (2)
      Tests  127 passed (127)
   Start at  01:55:00
   Duration  1.60s (transform 388ms, setup 22ms, import 499ms, tests 963ms, environment 0ms)
```

Command 3:

```bash
sed -n '1248,1312p' lib/search/hybrid-search.ts
```

Output:

```text
          source: 'graph',
        });
      }
      if (graphResults.length > 0) {
        graphMetrics.graphHits++;
        graphMetrics.graphResultCount += graphResults.length;
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      console.warn(`[hybrid-search] Graph search failed: ${msg}`);
    }
  }

  // Normalize scores per source before merging so one method's raw scale
  // Does not dominate others during final ranking.
  const bySource = new Map<string, HybridSearchResult[]>();
  for (const r of results) {
    const src = r.source || 'unknown';
    if (!bySource.has(src)) bySource.set(src, []);
    bySource.get(src)!.push(r); // non-null safe: has() guard above guarantees entry exists
  }

  const normalized: HybridSearchResult[] = [];
  for (const [, group] of bySource) {
    if (group.length === 0) continue;
    const scores = group.map(r => r.score);
    let min = Infinity;
    let max = -Infinity;
    for (const s of scores) {
      if (s < min) min = s;
      if (s > max) max = s;
    }
    const range = max - min;
    for (const r of group) {
      normalized.push({
        ...r,
        score: range > 0 ? (r.score - min) / range : (r.score > 0 ? 1.0 : 0),
      });
    }
  }

  // Deduplicate by ID (keep highest normalized score)
  // LIMITATION: When a result appears in multiple sources (e.g., vector + fts),
  // Only the highest-scoring entry's `source` is preserved. Multi-source provenance
  // Is lost here. To fix properly, HybridSearchResult would need a `sources: string[]`
  // Field and downstream consumers would need to be updated accordingly.
  const deduped = new Map<string, HybridSearchResult>();
  for (const r of normalized) {
    const canonicalId = canonicalResultId(r.id);
    const existing = deduped.get(canonicalId);
    if (!existing || r.score > existing.score) {
      deduped.set(canonicalId, r);
    }
  }

  return Array.from(deduped.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Enhanced hybrid search with RRF fusion.
 * All search channels use synchronous better-sqlite3; sequential execution
 * is correct — Promise.all would add overhead without achieving parallelism.
 */
```

Command 4:

```bash
rg -n "SPECKIT_ADAPTIVE_FUSION" INSTALL-GUIDE.md
```

Output:

```text
387:| `SPECKIT_ADAPTIVE_FUSION` | `true` | Controls adaptive intent-based fusion weights. Set to `false` to disable (7 task types). |
414:        "SPECKIT_ADAPTIVE_FUSION": "true",
763:**Flag:** `SPECKIT_ADAPTIVE_FUSION` (default: on)
885:  "SPECKIT_ADAPTIVE_FUSION": "true"
1231:  SPECKIT_ADAPTIVE_FUSION    default: true     (false = disable intent-based fusion)
```

Command 5:

```bash
rg -n "isAdaptiveFusionEnabled|adaptiveEnabled|adaptiveFuse|fuseResultsMulti" lib/search/hybrid-search.ts tests/adaptive-fusion.vitest.ts tests/hybrid-search.vitest.ts
```

Output:

```text
tests/adaptive-fusion.vitest.ts:7:  adaptiveFuse,
tests/adaptive-fusion.vitest.ts:10:  isAdaptiveFusionEnabled,
tests/adaptive-fusion.vitest.ts:143:  it('T8: adaptiveFuse produces deterministic output for same inputs', () => {
tests/adaptive-fusion.vitest.ts:148:    const run1 = adaptiveFuse(semantic, keyword, weights);
tests/adaptive-fusion.vitest.ts:149:    const run2 = adaptiveFuse(semantic, keyword, weights);
tests/adaptive-fusion.vitest.ts:179:    const adaptive = adaptiveFuse(semantic, keyword, getAdaptiveWeights('understand'));
tests/adaptive-fusion.vitest.ts:191:    expect(isAdaptiveFusionEnabled()).toBe(false);
tests/adaptive-fusion.vitest.ts:192:    expect(isAdaptiveFusionEnabled('   ')).toBe(false);
tests/adaptive-fusion.vitest.ts:206:    expect(isAdaptiveFusionEnabled('session-0')).toBe(false);
tests/adaptive-fusion.vitest.ts:207:    expect(isAdaptiveFusionEnabled('session-3')).toBe(true);
tests/adaptive-fusion.vitest.ts:249:        fuseResultsMulti: vi.fn((lists) => {
tests/adaptive-fusion.vitest.ts:254:          return actual.fuseResultsMulti(lists);
tests/hybrid-search.vitest.ts:1071:    const fused = rrfFusion.fuseResultsMulti([
lib/search/hybrid-search.ts:8:import { adaptiveFuse, getAdaptiveWeights, isAdaptiveFusionEnabled } from '@spec-kit/shared/algorithms/adaptive-fusion';
lib/search/hybrid-search.ts:10:import { fuseResultsMulti } from '@spec-kit/shared/algorithms/rrf-fusion';
lib/search/hybrid-search.ts:1584:    const adaptiveEnabled = isAdaptiveFusionEnabled();
lib/search/hybrid-search.ts:1588:    const fusionWeights = adaptiveEnabled
lib/search/hybrid-search.ts:1655:    const fused = adaptiveEnabled
lib/search/hybrid-search.ts:1656:      ? (adaptiveFuse as unknown as (
lib/search/hybrid-search.ts:1673:      : fuseResultsMulti(fusionLists, { bonusOverChannels: 'active' });
```

### Pass / Fail

- **PASS**: the targeted checks prove adaptive fusion stays flag-gated in the live runtime path while the install guide reflects matching flag-toggle guidance.

### Failure Triage

Inspect `lib/search/hybrid-search.ts`, `shared/algorithms/adaptive-fusion.ts`, and `INSTALL-GUIDE.md`; confirm the checked-in docs match the tested source tree and that the live pipeline still falls back to fixed fusion when `SPECKIT_ADAPTIVE_FUSION=false`

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [implement_and_remove_deprecated_features/adaptive_fusion_flag_drift.md](../../feature_catalog/implement_and_remove_deprecated_features/adaptive_fusion_flag_drift.md)

---

## 5. SOURCE METADATA

- Group: Implement and Remove Deprecated Features
- Playbook ID: 232
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `implement_and_remove_deprecated_features/adaptive_fusion_flag_drift.md`
