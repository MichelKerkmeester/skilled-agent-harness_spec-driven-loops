---
iteration: 030
rq: RQ-N1
phase_target: 002-memory-write-safety
newInfoRatio: 0.72
verdict: ADOPT
---

# Iteration 030 — RQ-N1: Minimal Guard Shape for the passes_threshold Gap in render.ts

## Research Question

What is the minimal, safest guard shape for the `passes_threshold` gap in `render.ts`? Specifically:
- (A) Renderer-side uncertainty re-check vs. producer-contract invariant proving `passes_threshold` encodes dual threshold?
- (B) LOC cost of each approach?
- (C) What exact test cases are needed?

---

## Evidence Base

### The Gap: render.ts:129-138

The filter in `renderAdvisorBrief` at `render.ts:129-138` is:

```ts
const recommendations = result.recommendations.filter((recommendation) => (
  recommendation.passes_threshold === true
  || (
    recommendation.confidence >= (thresholdConfig?.confidenceThreshold ?? resolvedConfidenceThreshold())
    && (
      thresholdConfig?.confidenceOnly === true
      || recommendation.uncertainty <= (thresholdConfig?.uncertaintyThreshold ?? resolvedUncertaintyThreshold())
    )
  )
));
```

The OR-branch at `render.ts:130` short-circuits the entire numeric check when `passes_threshold === true`. A recommendation with `{ confidence: 0.95, uncertainty: 0.99, passes_threshold: true }` passes the filter and proceeds to render mandate wording ("MUST invoke") at `render.ts:160-163`. The numeric uncertainty check at `render.ts:134-137` is never reached in that case.

### The Type Definition: subprocess.ts:16-23

`passes_threshold` is typed as `readonly passes_threshold?: boolean` — it is **optional** (subprocess.ts:21). The Python scorer sets it when it evaluates the record. The field is preserved as-is from JSON parse at subprocess.ts:126. There is no TypeScript enforcement that `passes_threshold: true` was set only when both confidence AND uncertainty thresholds were satisfied. It is a plain scalar copied through without validation.

### Threshold Defaults: contract.ts:9-12

```ts
defaults: {
  confidenceThreshold: 0.8,
  uncertaintyThreshold: 0.35,
}
```

At runtime, `resolvedConfidenceThreshold()` returns 0.8 (contract.ts:25-29) and `resolvedUncertaintyThreshold()` returns 0.35 (contract.ts:31-35) unless overridden by env vars. The dual-threshold contract is a default; the renderer can be configured with `confidenceOnly: true` (render.ts:133-137), making `passes_threshold === true` the only gatekeeping for uncertainty when that option is set.

### Existing Fixture (livePassingSkill.json)

The canonical passing fixture uses `{ confidence: 0.91, uncertainty: 0.23, passes_threshold: true }`. This is safe — uncertainty is well below 0.35. But no fixture tests the exploit case: `{ confidence: 0.95, uncertainty: 0.99, passes_threshold: true }`. The `noPassingSkill.json` fixture has `passes_threshold: false` and low confidence, which correctly filters out, but that path exercises the `passes_threshold === false` branch, not the high-uncertainty bypass.

### sub-packet-amendments.md REQ-007, REQ-008, REQ-009

The amendments doc proposes three requirements:
- REQ-007: High-uncertainty guard — a recommendation with high numeric uncertainty MUST NOT render mandate wording unless the producer contract proves `passes_threshold` already encoded the uncertainty threshold.
- REQ-008: Legacy fixture migration — existing exact-string tests pinning old brief strings must be intentionally updated.
- REQ-009: Boundary fixtures at 0.79, 0.80, 0.81 confidence with uncertainty at and over threshold.

---

## Part A: Guard Shape Decision

### Option 1 — Renderer-Side Uncertainty Re-Check (~8 LOC delta)

Change the `passes_threshold === true` branch in the filter at render.ts:130 to AND an explicit numeric uncertainty re-check:

```ts
const recommendations = result.recommendations.filter((recommendation) => {
  const uncertaintyOk = thresholdConfig?.confidenceOnly === true
    || recommendation.uncertainty <= (thresholdConfig?.uncertaintyThreshold ?? resolvedUncertaintyThreshold());
  return (
    (recommendation.passes_threshold === true && uncertaintyOk)
    || (
      recommendation.confidence >= (thresholdConfig?.confidenceThreshold ?? resolvedConfidenceThreshold())
      && uncertaintyOk
    )
  );
});
```

This is a pure renderer-side change. It does not touch the Python scorer or subprocess.ts. The `uncertaintyOk` computation is extracted once and reused by both branches (deduplicated from 2 to 1 evaluation). The `confidenceOnly === true` exception is preserved for the explicitly opted-in case. LOC delta: approximately +6 to +8 LOC over the existing filter block at render.ts:129-138.

**Pros:** Hermetic — the renderer enforces the invariant regardless of what the producer says. Defense-in-depth. Requires no producer contract change. Requires no subprocess.ts or Python-scorer changes.

**Cons:** Slightly redundant — `passes_threshold: true` from the scorer should already mean "both thresholds met" by convention. Adds a redundant numeric check when the scorer is correct.

### Option 2 — Producer-Contract Invariant (~0 renderer LOC, ~30-50 test LOC)

Leave render.ts unchanged. Instead, add TypeScript assertion tests on the subprocess.ts parse path at subprocess.ts:102-130 that prove `passes_threshold: true` is only emitted by the scorer when both confidence AND uncertainty thresholds are satisfied. The invariant is documented in contract.ts as a scorer-side guarantee.

**Pros:** No render.ts change. Cleaner separation of concerns — scorer is the authority.

**Cons:** TypeScript-level tests cannot enforce Python scorer behavior. The scorer runs as a subprocess (subprocess.ts:132-); its output is JSON parsed at subprocess.ts:103 with no schema validation beyond the type checks at subprocess.ts:112-120. A scorer bug, version skew, or direct JSON injection can emit `passes_threshold: true` with high uncertainty with no renderer defense. This is not a safe invariant to rely on for a security-sensitive mandate-wording gate.

### Recommendation: Option 1 (Renderer-Side Guard)

The renderer is the prompt-boundary guard by design — this is explicitly stated in the render.ts module docstring at render.ts:110-115: "The renderer is the prompt-boundary guard: it ignores free-form reasons, descriptions, stdout/stderr, and prompt text." Mandate wording correctness belongs at this boundary. The scorer is a subprocess whose output is accepted as untrusted JSON. Defense at the boundary is the correct pattern.

The incremental cost is low (~8 LOC). The `confidenceOnly` escape hatch at render.ts:133-137 is preserved. Option 1 is the safer, hermetically correct shape.

---

## Part B: LOC Cost

| Approach | Production LOC | Test LOC | Total |
|---|---|---|---|
| Option 1: Renderer re-check | +6 to +8 LOC in render.ts:129-138 | +40 to +60 LOC (REQ-007/009 fixtures) | ~46-68 LOC |
| Option 2: Producer invariant only | 0 LOC in render.ts | +30-50 LOC (invariant assertions) | ~30-50 LOC, but provides no renderer defense |

Option 1 total fits within the sub-packet-amendments.md LOC delta estimate of +50 to +90 LOC (revised total ~80-120).

---

## Part C: Required Test Cases

### T-004A: High-uncertainty passes_threshold fixture (REQ-007)

Fixture: `{ status: 'ok', freshness: 'live', recommendations: [{ skill: 'sk-code', confidence: 0.95, uncertainty: 0.99, passes_threshold: true }], metrics: { tokenCap: 80 } }`

Expected: `renderAdvisorBrief(fixture)` returns `null`. The guard must prevent high-uncertainty records from rendering even when `passes_threshold === true`.

### T-004B: Boundary fixtures (REQ-009)

Three sub-cases with uncertainty at exactly threshold (0.35), above threshold (0.36), below threshold (0.34):

1. `{ confidence: 0.79, uncertainty: 0.34, passes_threshold: false }` → null (confidence below 0.80)
2. `{ confidence: 0.80, uncertainty: 0.35, passes_threshold: true }` → renders (at both thresholds exactly — boundary pass)
3. `{ confidence: 0.81, uncertainty: 0.36, passes_threshold: true }` → null (uncertainty above 0.35 despite confidence >= 0.80)

The boundary pass at case 2 confirms the guard uses `<=` for uncertainty (not `<`). The fail at case 3 confirms high uncertainty blocks rendering even with `passes_threshold: true` and confidence above threshold.

### T-004C: confidenceOnly override preserves escape hatch

`{ confidence: 0.85, uncertainty: 0.99, passes_threshold: true }` with `thresholdConfig: { confidenceOnly: true }` → renders. This confirms the intentional escape hatch for the opt-in `confidenceOnly` mode is not broken by the guard.

### T-004D: Legacy fixture migration (REQ-008)

The existing `livePassingSkill.json` fixture produces `'Advisor: live; use sk-code 0.91/0.23 pass.'` at advisor-renderer.vitest.ts:22-24. After mandate wording change, this test must be intentionally updated to the new wording. The iteration file should not assert the old exact string after the wording change ships.

---

## Summary

The minimal, safest guard is a renderer-side uncertainty re-check applied at render.ts:129-138 (Option 1). This is an ~8 LOC edit that extracts `uncertaintyOk` from the existing filter branches and applies it to both the `passes_threshold === true` path and the numeric path. The `confidenceOnly` escape hatch is preserved. Three test cases are required: (1) high-uncertainty with `passes_threshold: true` returns null, (2) boundary fixtures at 0.79/0.80/0.81 with uncertainty at/above/below 0.35, (3) `confidenceOnly: true` override still renders. The LOC cost is within the sub-packet-amendments.md revised estimate. Producer-contract-only (Option 2) is not safe because the renderer is the prompt-boundary guard and the scorer runs as an untrusted subprocess.
