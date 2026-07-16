# Iteration 014 — Adversarial Verify of F-A6-01 (dimension: maintainability, angle: A6-verify)

## Dispatcher
- **Run:** 14 of 20 (adversarial-verify segment, iters 14-20)
- **Mode:** review (read-only — verdict only, no code modification)
- **Dimension:** maintainability
- **Angle:** A6-verify — adversarial re-verification of F-A6-01 (P1 auto-fix default-ON coverage gap from iter 7)
- **Budget profile:** adjudicate (target 8-10 tool calls; referee/skeptic pass on a single carried-forward finding)
- **Review target:** git range `a9e9bdb0a5^..HEAD` (HEAD `12de3d3a7e`)
- **Session:** `2026-06-05T11:16:17Z` (generation 1, lineageMode new)
- **Parallel-safety:** wrote ONLY `iterations/iteration-014.md` + `deltas/iter-014.jsonl`. Did NOT touch `deep-review-state.jsonl`, `deep-review-strategy.md`, findings-registry, or config (concurrent dispatch).

## Files Reviewed
- `.opencode/skills/system-spec-kit/mcp_server/handlers/quality-loop.ts:585-592` (re-confirm production OR-branch) — read-only source cross-check.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:160-185` (re-confirm `isQualityAutoFixEnabled` default-TRUE) — read-only source cross-check.
- `.opencode/skills/system-spec-kit/mcp_server/tests/search-flags.vitest.ts:189,206,250-266` (full default-ON / opt-out test bodies) — **NEW** evidence not in iter-007 target set.
- `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:615-621,748,825,1106-1125,1170-3376` (all `runQualityLoop` spy/mock call sites) — **NEW** evidence not in iter-007 target set.
- `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:267`, `memory-save-fallback-fingerprint.vitest.ts:188,222`, `memory-save-index-scope.vitest.ts:184` (runQualityLoop mocked) — **NEW**.
- `.opencode/skills/system-spec-kit/mcp_server/tests/rollout-policy.vitest.ts` (grep — zero quality/auto-fix references) — **NEW** (named downgrade candidate, ruled out as coverage source).

## Adversarial Search Method
Grepped the **entire** `*.vitest.ts` suite (repo-wide) for every surface that could exercise the production default-true auto-fix path:
- `rg -l "SPECKIT_QUALITY_AUTO_FIX" --glob '*.vitest.ts'` → 3 files: `quality-loop`, `memory-save-pipeline-enforcement`, `search-flags`.
- `rg -l "isQualityAutoFixEnabled" --glob '*.vitest.ts'` → 1 file: `search-flags`.
- `rg -l "runQualityLoop" --glob '*.vitest.ts'` → 6 files: `quality-loop`, `memory-save-pipeline-enforcement`, `handler-memory-index`, `memory-save-fallback-fingerprint`, `handler-memory-save`, `memory-save-index-scope`.
- `rg -l "autoFixEnabled" --glob '*.vitest.ts'` → 0 files (the production var is never named in any test).
- Hunted `rollout-policy` suites for the auto-fix default: `rollout-policy.vitest.ts` has **zero** quality/auto-fix references.

The iter-007 target set was `quality-loop.vitest.ts` + `memory-save-pipeline-enforcement.vitest.ts` only. This iteration extended to the **4 untouched `runQualityLoop` callers + `search-flags.vitest.ts` + `rollout-policy.vitest.ts`** — the exact "separate suite" the iter-007 `downgradeTrigger` flagged.

## Findings — New
None. This iteration produces a **verdict refinement** on the existing F-A6-01, not a new finding.

### P0 Findings
None.

### P1 Findings
None new. F-A6-01 is **downgraded P1 → P2** (see Verdict below).

### P2 Findings
1. **F-A6-01 (downgraded): the integrated production auto-fix path (`mode` advisory + `SPECKIT_QUALITY_AUTO_FIX` unset → default-true OR-branch → auto-fix engages end-to-end) is not exercised by a single test; the two OR-operands are only verified in isolation** — `tests/search-flags.vitest.ts:254` + `tests/handler-memory-save.vitest.ts:1113,1122` + `tests/quality-loop.vitest.ts` (all real auto-fix runs force `mode:'full-auto'` or env `false`) — The original P1 claim of "ZERO coverage" is **partially refuted**. The default-true half of the OR is unit-tested in isolation (`search-flags.vitest.ts:254` asserts `isQualityAutoFixEnabled() === true` with env unset) and the advisory-mode half is asserted at the production call boundary (`handler-memory-save.vitest.ts:1122` asserts the handler invokes `runQualityLoop` with `mode:'advisory'`). What remains genuinely absent: no test runs the **real** `runQualityLoop` with advisory/unset mode AND unset env and observes auto-fix actually engaging — because `handler-memory-save` (and the 3 sibling callers) **mock/spy** `runQualityLoop` (`runQualityLoopSpy`, line 1113), so the `mode === 'full-auto' || isQualityAutoFixEnabled()` resolution and the fix-execution loop never run together. A regression that breaks the `||` wiring at `quality-loop.ts:591` (e.g., silently coupling auto-fix to full-auto only) would NOT fail the suite — but a regression flipping the flag default WOULD be caught by `search-flags.vitest.ts:254`. Reduced blast radius → maintainability advisory, not a gate blocker.

```json
{
  "id": "F-A6-01",
  "type": "test-coverage-gap",
  "claim": "The integrated production auto-fix path (advisory mode + env unset → default-true OR-branch → auto-fix runs end-to-end) is never exercised in one test; the two OR-operands are each verified only in isolation, and every real runQualityLoop auto-fix execution forces mode:'full-auto' or env=false.",
  "evidenceRefs": [
    "handlers/quality-loop.ts:590 (mode = options?.mode ?? 'advisory')",
    "handlers/quality-loop.ts:591 (autoFixEnabled = mode === 'full-auto' || isQualityAutoFixEnabled())",
    "lib/search/search-flags.ts:165-172 (isQualityAutoFixEnabled Default: TRUE graduated)",
    "tests/search-flags.vitest.ts:252-254 (asserts isQualityAutoFixEnabled()===true with env UNSET — default-true operand IS unit-covered)",
    "tests/handler-memory-save.vitest.ts:1113,1122 (asserts handler calls runQualityLoop with mode:'advisory' — advisory operand covered at call boundary, but runQualityLoop is a SPY)",
    "tests/handler-memory-save.vitest.ts:615-621,748,825 + handler-memory-index.vitest.ts:267 + memory-save-fallback-fingerprint.vitest.ts:188,222 + memory-save-index-scope.vitest.ts:184 (runQualityLoop mocked/spied in every caller — real OR-resolution never executes)",
    "tests/quality-loop.vitest.ts:461,479,489,498,506,529,536,552 (real auto-fix runs force full-auto or env=false)",
    "tests/rollout-policy.vitest.ts (grep: ZERO quality/auto-fix references — named downgrade candidate ruled out as a coverage source)"
  ],
  "counterevidenceSought": "Grepped the ENTIRE *.vitest.ts suite for SPECKIT_QUALITY_AUTO_FIX (3 files), isQualityAutoFixEnabled (1 file: search-flags), runQualityLoop (6 files), autoFixEnabled (0 files), and rollout-policy/graduated. Inspected all 6 runQualityLoop callers + search-flags + rollout-policy. FOUND new isolation coverage iter-007 missed: search-flags.vitest.ts:254 (default-true operand) and handler-memory-save.vitest.ts:1122 (advisory operand). The integrated end-to-end run is still absent: all real runQualityLoop auto-fix executions force full-auto/env-false, and the handler-level callers mock runQualityLoop.",
  "alternativeExplanation": "The OR-branch could be considered adequately covered because each operand is independently verified and the production dispatch (mode:'advisory') is asserted at the call boundary. This is the basis for the downgrade — partial isolation coverage exists; only the integrated path is uncovered.",
  "finalSeverity": "P2",
  "confidence": 0.85,
  "downgradeTrigger": "Iter-007's own trigger ('downgrade to P2 if a separate suite — search-flags or rollout-policy — asserts the default-true env drives auto-fix') is partially satisfied: search-flags.vitest.ts:254 asserts default-true. Combined with the advisory-mode call-boundary assertion, blast radius is reduced. Would re-escalate to P1 only if both isolation tests were removed AND no integrated path existed."
}
```
- **Finding class:** test-coverage-gap (integrated-path hardening; advisory).
- **Scope proof:** All cited test files are in the diff range. The OR-branch is the literal production path (`quality-loop.ts:591`). The gap is the absence of an integrated test, evidenced by exhaustive grep + read of every `runQualityLoop` call site (6 files) plus `search-flags`/`rollout-policy`.
- **Affected surface hints:** `handlers/quality-loop.ts` runQualityLoop OR-resolution; `lib/search/search-flags.ts` isQualityAutoFixEnabled; a recommended fix is one `quality-loop.vitest.ts` test that calls the REAL `runQualityLoop` with low-quality content, `mode` omitted, and `SPECKIT_QUALITY_AUTO_FIX` unset, asserting auto-fix engages.

## Traceability Checks
- **Iteration number:** Parallel dispatch — explicit dispatch number 14 governs (per parallel-safety contract I do NOT append to shared `deep-review-state.jsonl`; the JSONL-derive rule is superseded by the explicit dispatch number). Recorded as edge case 1.
- **F-A6-01 lineage:** Carried forward from iter-007 §P1 Findings #1. Iter-007's `downgradeTrigger` named `search-flags`/`rollout-policy` unit suites as the unverified condition; this iteration adversarially resolved it. 1:1 mapping to strategy line 60-62 (carry-forward for adversarial-verify iters 14-20).
- **downgradeTrigger satisfied:** Partially — `search-flags.vitest.ts:254` asserts the default-true operand; `rollout-policy.vitest.ts` ruled out (zero references). Net: enough isolation coverage to drop from gate-blocking P1 to advisory P2.

## Integration Evidence
- **Cross-file source verification (read-only):** Re-confirmed the production OR-branch (`handlers/quality-loop.ts:591`) and the default-true flag (`lib/search/search-flags.ts:165-172`) before adjudicating, so the verdict rests on current HEAD code, not stale prose. Named the integration touchpoint that makes the test assertions meaningful: the `runQualityLoop` ↔ `isQualityAutoFixEnabled` ↔ planner-default `mode:'advisory'` triad. The handler-level callers (`indexMemoryFile` → `runQualityLoop`) are the real production dispatch, asserted at `handler-memory-save.vitest.ts:1122` but with a spy, which is precisely why the integrated path stays uncovered.

## Edge Cases
1. **Parallel-dispatch iteration numbering:** This run writes `deltas/iter-014.jsonl` only and must NOT touch `deep-review-state.jsonl` (concurrent agents). Explicit dispatch number 14 governs over the JSONL-derive rule. Safest in-scope interpretation; no shared-state mutation attempted.
2. **Partial refutation, not full:** The dispatch offered a binary (found → P2; absent → confirm P1). Reality is in between: the OR-operands are each covered in isolation (new evidence), but the integrated path is genuinely absent. I resolved this as P2 (downgrade) because iter-007's explicit `downgradeTrigger` is partially satisfied and the blast radius is materially reduced — not a silent pass: the residual integrated-path gap is preserved as a P2 advisory with a concrete recommended test.
3. **Mock-vs-real distinction:** The advisory-mode assertion at `handler-memory-save.vitest.ts:1122` could be mistaken for end-to-end coverage. It is NOT — `runQualityLoop` is a spy there (line 1113), so the real OR-resolution never executes. Recorded explicitly to avoid over-crediting the downgrade.

## Confirmed-Clean Surfaces
- **`search-flags.vitest.ts:252-254`:** The default-true operand of the production OR-branch IS unit-tested with env unset — a real assertion (`expect(isQualityAutoFixEnabled()).toBe(true)`), not a rubber-stamp. This is the evidence iter-007 missed (it only read `quality-loop` + `pipeline-enforcement`).
- **`handler-memory-save.vitest.ts:1106-1125`:** The production dispatch passes `mode:'advisory'` (not full-auto) to `runQualityLoop` — asserted at line 1122 — proving the non-full-auto half of the OR is the real shipped behavior.

## Ruled Out
1. **F-A6-01 "ZERO coverage" claim** — RULED OUT (partially). Evidence: `search-flags.vitest.ts:254` (default-true operand covered with env unset) + `handler-memory-save.vitest.ts:1122` (advisory-mode dispatch asserted). The two OR-operands are each verified in isolation, so the original "zero coverage" framing overstated the gap.
2. **`rollout-policy.vitest.ts` as a hidden coverage source** — RULED OUT. Grep shows zero quality/auto-fix/runQualityLoop references in that suite; it does not cover the path.
3. **A hidden integrated test in any other `*.vitest.ts`** — RULED OUT. Repo-wide grep for `runQualityLoop` (6 files) + `autoFixEnabled` (0 files) is exhaustive; all 6 callers either force full-auto/env-false or mock the function.

## Next Focus
- **Dimension:** maintainability
- **Focus area:** A6 verify segment continuation — re-assert F-002 (EPERM reclaim, A1) and F-004 (reclaim durability) under skeptic challenge per strategy carry-forward (iters 14-20), and adversarially verify any remaining open P1.
- **Reason:** F-A6-01 is now settled (P2). The strategy's adversarial-verify backlog (line 60-63) still lists F-002/F-004/F-003 for skeptic re-assertion; those are the next highest-value verify targets.
- **Rotation status:** A6 fully resolved (F-A6-01 settled P2; F-A6-02 P2 open for A3 cross-check; launcher-lease + fan-out ruled out in iter-007). Maintainability A6 verify complete.
- **Blocked/productive carry-forward:** Productive — F-A6-01 P2 feeds A2 (quality-loop is part of the memory-save pipeline); recommended one-line test fix noted in affected-surface hints. Not blocked.
- **Required evidence (next):** for F-002/F-004 re-assert — re-read `launcher-ipc-bridge.cjs`/`mk-spec-memory-launcher.cjs` reclaim path under skeptic lens; for F-003 — code-graph socket-server fork drift vs A5 TOCTOU surface.
- **Recovery note:** n/a (no recovery mode this iteration).
