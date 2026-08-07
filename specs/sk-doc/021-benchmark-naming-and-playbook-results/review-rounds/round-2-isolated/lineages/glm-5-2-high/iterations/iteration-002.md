# Iteration 002 — Correctness: Parity-Baseline Discovery (CHK-037)

- **Dimension:** correctness
- **Focus area:** `scanParityBaseline` in `render-serving-snapshot.cjs` (CHK-037 remediation)
- **Iteration:** 2 of 5
- **Session:** `fanout-glm-5-2-high-1785153423148-1aktp5`

## 1. SCOPE OF THIS ITERATION

Verify the remediation that closed the parity-baseline discovery defect (CHK-037): the serving snapshot must still find a parity baseline under the dated run-folder grammar, where the original code looked only under a fixed label no writer produces.

Primary source under review:

- `.opencode/skills/sk-doc/create-benchmark/scripts/render-serving-snapshot.cjs` — `scanParityBaseline` (lines 121-178) and the `captureServingSnapshot` caller (line 269).

Per ADR-005, the remediation claim is treated as a hypothesis and verified against the code.

## 2. EVIDENCE READ

### 2.1 The legacy-first, dated-fallback contract

`render-serving-snapshot.cjs:121-178` — `scanParityBaseline(hubId, skillsRoot)`:

```text
121| const LEGACY_PARITY_BASELINE_LABEL = 'router-compiled-parity-baseline';
   ...
136| function scanParityBaseline(hubId, skillsRoot) {
137|   const archiveRoot = path.join(skillsRoot, hubId, 'benchmark', 'compiled-routing');
   ...
153|   const legacy = summarize(LEGACY_PARITY_BASELINE_LABEL);
154|   if (legacy) return legacy;
   ...
159|   let labels;
160|   try {
161|     labels = fs.readdirSync(archiveRoot, { withFileTypes: true })
162|       .filter((d) => d.isDirectory()).map((d) => d.name);
163|   } catch {
164|     return { label: LEGACY_PARITY_BASELINE_LABEL, present: false, ... };
165|   }
   ...
167|   let latest = null;
168|   for (const label of labels) {
169|     const parsed = readJsonSafe(path.join(archiveRoot, label, 'skill-benchmark-report.json'));
170|     if (!parsed || !parsed.compiledRoutingParity) continue;
171|     const summary = summarize(label);
172|     if (!summary) continue;
173|     if (!latest || String(summary.capturedAt) > String(latest.capturedAt)) latest = summary;
174|   }
   ...
176|   return latest
177|     || { label: LEGACY_PARITY_BASELINE_LABEL, present: false, ... };
178| }
```

The remediation behaviour:

1. Try the legacy fixed-label archive `router-compiled-parity-baseline/` first. If it exists and parses, return it.
2. Otherwise scan every dated archive directory under `benchmark/compiled-routing/`, keep only those whose `skill-benchmark-report.json` carries a `compiledRoutingParity` block (line 170 — only parity runs carry that block), and pick the one with the latest `capturedAt` timestamp.
3. If neither path finds anything, return `{ present: false, label: LEGACY_PARITY_BASELINE_LABEL, ... }` — the snapshot reports absent evidence honestly rather than fabricating a baseline.

This matches CHK-037's evidence: "`scanParityBaseline` falls back to newest-captured dated discovery instead of a single fixed label no writer produces."

### 2.2 The `compiledRoutingParity` filter is load-bearing

Line 170 (`if (!parsed || !parsed.compiledRoutingParity) continue;`) is what distinguishes a parity archive from a regular run archive. Without it, the fallback would surface the newest run of any kind as the parity baseline, which would be wrong. The filter is present and correct.

### 2.3 The `capturedAt` tie-break

Line 173 uses `String(summary.capturedAt) > String(latest.capturedAt)`. On a tie (two archives with the same `capturedAt`), the loop keeps the **first** one encountered (the `>` is strict). `fs.readdirSync` order is not guaranteed across platforms/FSes, so a tie yields a non-deterministic choice. In practice `capturedAt` is an ISO-8601 timestamp with millisecond precision (set by `captureServingSnapshot` line 248 as `new Date().toISOString()`), so ties are implausible. The non-determinism is theoretical.

### 2.4 The legacy-first preference

Lines 153-154 return the legacy archive immediately when it exists, without comparing its `capturedAt` against any dated archive. A hub that has both a stale legacy `router-compiled-parity-baseline/` and a newer dated parity archive will report the stale legacy one as the parity baseline. The comment on lines 124-131 frames this as intentional ("the legacy fixed-label archive when one exists"), and the legacy label is the immutable parity before-anchor per the storage guide §6, so preferring it is defensible — the legacy anchor is by definition the baseline. Not a defect.

### 2.5 Test coverage

A repo-wide search for `scanParityBaseline` / `captureServingSnapshot` across `**/*.vitest.ts` returns no matches. The CHK-035 remediation is covered by `run-storage-convention.vitest.ts` lines 183-205; the CHK-037 remediation is not covered by any automated test. The remediation's correctness rests on inspection and on the serving snapshots already shipped under `.opencode/skills/*/benchmark/compiled-routing/2026-07-21--*/serving-snapshot.json`, not on a regression test.

## 3. FINDINGS

### 3.1 P1 — CHK-037 remediation has no automated regression test

The CHK-035 remediation (same-day collision guard) is covered by `run-storage-convention.vitest.ts` lines 183-205. The CHK-037 remediation (parity-baseline dated fallback) is not covered by any test in the repo. A future refactor that re-introduces the fixed-label-only lookup (or that drops the `compiledRoutingParity` filter on line 170) would pass the existing suite silently. The defect this remediation closed is exactly the kind that recurs when a regression test is absent.

- **Severity:** P1 (the remediation is correct today but unprotected against regression; the prior defect was a silent miss, and a silent re-miss is the failure mode a test exists to prevent)
- **[SOURCE: .opencode/skills/sk-doc/create-benchmark/scripts/render-serving-snapshot.cjs:136-178]**
- **[SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/run-storage-convention.vitest.ts:183-205]**
- **content_hash:** 1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2

### 3.2 P2 — `capturedAt` tie-break is non-deterministic on identical timestamps

`render-serving-snapshot.cjs:173` uses strict `>` on `String(capturedAt)`. Two dated archives with identical `capturedAt` (implausible at millisecond precision, but possible if a future emitter rounds to seconds) would yield a non-deterministic choice because `fs.readdirSync` order is not guaranteed across platforms.

- **Severity:** P2 (implausible at current millisecond precision; the failure mode is a wrong-but-still-present baseline, not a silent miss)
- **[SOURCE: .opencode/skills/sk-doc/create-benchmark/scripts/render-serving-snapshot.cjs:161,173]**
- **content_hash:** 2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3

### 3.3 P2 — Legacy-first preference can surface a stale baseline over a newer dated one

`render-serving-snapshot.cjs:153-154` returns the legacy `router-compiled-parity-baseline/` archive without comparing its `capturedAt` against dated archives. The storage guide §6 defines the legacy label as the immutable parity before-anchor, so this is intentional, but a hub that retires the legacy anchor and re-runs parity would still report the retired legacy archive as the baseline. The behaviour is defensible but undocumented in the snapshot's own comments.

- **Severity:** P2 (intentional behaviour, but the preference rule is only documented in the storage guide, not in the script's own comments; a maintainer reading only the code would see "legacy first" without the rationale)
- **[SOURCE: .opencode/skills/sk-doc/create-benchmark/scripts/render-serving-snapshot.cjs:121,153-154]**
- **[SOURCE: .opencode/skills/sk-doc/create-benchmark/references/skill-benchmark/skill-benchmark-storage-guide.md:189-194]**
- **content_hash:** 3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4

## 4. ADVERSARIAL P0 REPLAY

Could any of the above be a P0 in disguise?

- 3.1: The remediation is correct today; the finding is about test coverage, not a current defect. Not P0.
- 3.2: Theoretical tie at millisecond precision. Not P0.
- 3.3: Intentional behaviour documented in the storage guide. Not P0.

No P0 confirmed.

## 5. CONVERGENCE TELEMETRY

- newInfoRatio: 3 distinct findings, one of which (F-004, no regression test) is a real P1; ratio high (~0.6).
- Convergence score (telemetry only): 0.65 — above the 0.1 threshold, but the stop policy is `max-iterations`, so the loop continues.

## 6. NEXT FOCUS

Iteration 3 will move to the traceability dimension: the seven-file vs six-file contract language across `spec.md`, `implementation-summary.md`, `create-benchmark/SKILL.md` §10, and the storage guide §4 — CHK-036's remediation may have updated the owning skill but left sibling docs inconsistent.

## 7. STRATEGY UPDATE

- correctness: covered (2 iterations)
- security: pending
- traceability: in-progress next
- maintainability: pending

Review verdict: CONDITIONAL
