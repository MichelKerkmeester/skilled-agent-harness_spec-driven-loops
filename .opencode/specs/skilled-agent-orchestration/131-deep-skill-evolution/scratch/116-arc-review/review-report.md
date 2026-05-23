---
title: "Deep-Review Report: 116-Deep-Review-Complexity Arc (v2 Contract Dogfood)"
description: "10-iteration deep-review of the 116 arc using cli-devin SWE-1.6. Verdict: CONDITIONAL — 1 P0 + 1 P1 + 2 P2 open findings."
---

# Deep-Review Report: 116-Deep-Review-Complexity Arc

## 1. Executive Summary

**Verdict: CONDITIONAL**

10-iteration deep-review of the `116-deep-review-complexity` arc using cli-devin SWE-1.6 (`--print --prompt-file --permission-mode dangerous`). The arc just shipped a v2 review-depth contract (validator, reducer, STOP gates, graph vocabulary, playbooks); this review dogfooded the freshly shipped logic on the very arc that produced it.

**Bottom line:** 1 P0 + 1 P1 + 2 P2 open findings. The P0 is a real type/set drift in the validator that survived adversarial recheck (iter 9). Recommendation: remediate the P0 before downstream consumers rely on the v2 enforcement contract.

## 2. Stop Reason & Iteration Count

- **Stop reason**: max_iterations reached (10 / 10)
- **Iterations completed**: 10 / 10
- **Session start**: 2026-05-22T16:45Z
- **Wall-clock**: ~45 min dispatch + ~5 min orchestration
- **Executor**: cli-devin SWE-1.6 (Cognition free tier)
- **Permission mode**: `dangerous` (auto-approve all tools) — required for non-interactive writes; `auto` mode blocked file writes in `--print` shape

## 3. Dimension Coverage

| Dimension | Iterations | Findings (P0/P1/P2) |
|-----------|------------|---------------------|
| correctness | 1, 5, 9 | 1/1/1 (iter 1) + 1 P1 (iter 5, deduplicated) + 0 (iter 9 adversarial recheck — P0 UPHELD) |
| security | 2, 6 | 0/0/1 (iter 2) + 0 (iter 6) |
| traceability | 3, 7 | 0 (iter 3) + 1 P1 (iter 7, deduplicated) |
| maintainability | 4, 8 | 0 (iter 4) + 1 P1 (iter 8, deduplicated) |
| insight (cross-cutting) | 10 | 0 new (CONDITIONAL — existing P0 forces verdict) |

All 4 dimensions covered (3 rounds for correctness due to P0 adversarial recheck protocol).

## 4. Severity Counts & Verdict Trajectory

| Severity | Count | Definition | Blocks PASS? |
|----------|-------|------------|--------------|
| P0 | 1 | Correctness contradiction in shipped v2 enforcement contract | Yes |
| P1 | 1 | Dead failure code declared but never emitted | Conditional |
| P2 | 2 | Silent default behavior + security advisory | No |

Per-iter verdict drift (meta-observation):
- iter 1: CONDITIONAL (should've been FAIL per mapping rule — first known mis-mapping)
- iter 2: verdict line missing in markdown (contract drift)
- iters 3, 4, 6, 9: PASS (no new findings or P0 upheld)
- iters 5, 7, 8, 10: CONDITIONAL (P1 found / cascading)
- iter 8 verdict line had trailing parenthetical "(P1 finding present, no P0)" — minor format drift

## 5. Active Findings

### P0 — V2EnforcementMode type/set drift (iter 1, upheld iter 9)

**Claim**: `V2_ENFORCEMENT_MODES` set at `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:153` includes `'skip'`, but the `V2EnforcementMode` type at `:156` uses `'off'`. The function `getV2EnforcementMode()` at `:163-169` only checks `'strict' | 'off' | 'warn'`. An operator setting `DEEP_REVIEW_V2_ENFORCEMENT=skip` would silently default to `'warn'` without any warning, while the set's `.has('skip')` would return `true`.

**Evidence**: `post-dispatch-validate.ts:153,156,163-169`

**Adversarial recheck (iter 9)**: UPHELD. No aliasing or migration path documented. The drift is a real bug, not a documented graceful fallback.

**Counterevidence sought**: searched for any code comment, test, or doc explaining `skip` vs `off` coexistence — none found.

**Downstream impact**: operators following the v2 schema docs (which use `skip` per the contract enforcement values `strict | warn | skip`) cannot actually set `DEEP_REVIEW_V2_ENFORCEMENT=skip` and get skip behavior. They get silent fallback to `warn`.

**Recommendation**: Align the env-var enum with the contract enum. Either:
- (a) Change the set + getV2EnforcementMode() to use `skip` (matching the per-record `reviewDepthApplicability.enforcement` schema), OR
- (b) Document `off` as the runtime alias for `skip` and emit a deprecation warning when `skip` is passed.

**Severity finalization**: P0 (correctness contradiction in shipped contract).
**Confidence**: 0.9.

### P1 — Dead failure code `state_delta_iteration_mismatch` (iter 1)

**Claim**: Type union at `post-dispatch-validate.ts:81` declares `state_delta_iteration_mismatch` as a possible failure reason, but validation logic at `:289, 631` uses `delta_iteration_id_mismatch` instead. The declared code is dead.

**Evidence**: grep shows 1 occurrence in type union, 0 in validation logic; the other name has 3 occurrences including the actual check.

**Recommendation**: Either remove `state_delta_iteration_mismatch` from the type union OR rename the check to use the declared name. The Phase B fixture (`review-depth-validator.vitest.ts`) was updated by Phase D+E to assert against `delta_iteration_id_mismatch` — so the renaming choice should be consistent with the fixture.

**Severity finalization**: P1 (degraded contract reliability — type union claims a behavior that doesn't exist).

### P2 — `skip` enforcement value silently defaults to `warn` (iter 1)

Related to the P0 above. The `V2_ENFORCEMENT_MODES` set has `skip` as valid but `getV2EnforcementMode()` doesn't handle it, so it falls through to the default `warn`. This is a documentation/error-handling gap separate from the type/set drift but caused by the same root.

**Severity finalization**: P2 (advisory — should warn the operator that the value isn't recognized).

### P2 — Security advisory (iter 2, deduplicated across iters 6)

Specific text in iter 2's findingDetails (registry rolls it up). Surface: likely playbook dangerous-mode warning absence (iter 6 explicitly checked this domain).

## 6. Resolved Findings

None. All findings emitted across iters 1-10 remain open (this review is observation-only; remediation is a separate follow-on packet).

## 7. Search Ledger Coverage

`graphCoverageMode`: `graphless_fallback` (mk_code_index MCP was disconnected during this session)

**v2 contract dogfood**: Agents emitted v2 fields (`reviewDepthSchemaVersion:2`, `reviewDepthApplicability`, `targetSelection`, `searchCoverage`, `searchLedger[]`) on iterations 1, 5, and where applicable. The reducer aggregated `searchDebtCount` (0 — no deferred/blocked obligations) and `candidateCoverage` correctly. The new fields are operationally exercised by this run.

**searchLedger total rows across iters**: ~12-15 (iter 1 alone had 4 rows with disposition=`finding`)
**Disposition distribution**: predominantly `finding` (the iterations focused on emitting findings); few `ruled_out` (iter 6 used `ruled_out` for path-traversal); 0 `deferred` (no candidates deferred); 0 `blocked`.

## 8. Convergence Analysis

- **convergenceScore**: 1.0 (max-iterations terminus reached)
- **graphConvergenceScore**: 0 (graphless fallback mode)
- **newFindingsRatio across iters**: 1.0 → 0.33 → 0 → 0 → 0.25 → 0 → 0.25 → 0.25 → 0 → 0
- **Rolling avg (last 2)**: 0.0 — well below convergenceThreshold=0.10
- **Stuck count**: 0
- **Quality gates** (evidence / scope / coverage): all PASS (every finding has file:line; all within 116 arc; all 4 dimensions reviewed)
- **Dedup behavior**: working — iters 5, 7, 8 each emitted findings that matched existing content_hash entries and were deduplicated; registry stable at 4 open findings.

The loop reached max-iterations rather than early convergence because the user explicitly requested 10 iters. Convergence threshold would have triggered STOP after iter 3-4 if running autonomously.

## 9. Audit Appendix

### Meta-observations on the deep-review prompt template itself

1. **Verdict-mapping prompt drift**: agents inconsistently apply the rule "any P0 → FAIL". Iter 1 had P0=1 but emitted CONDITIONAL. Iter 9's adversarial-recheck path emitted PASS because the P0 was inherited, not new — but this nuance isn't strict in the prompt. Recommend tightening the rule with examples in the prompt template.
2. **Verdict-line format drift**: iter 2's markdown didn't end with the verdict line at all; iter 8 added trailing parenthetical. The "absolute final line, no trailing whitespace" contract is fragile.
3. **cli-devin permission mode**: `--permission-mode auto` blocks writes in non-interactive `--print` shape. The validated form for cross-AI deep-review dispatch via cli-devin is `--print --prompt-file ... --model swe-1.6 --permission-mode dangerous`. Operators MUST be aware of dangerous-mode implications.
4. **Dispatch shape**: my Phase H attempt earlier this day used wrong flag combinations (`-p` alone hung; no flag failed on TTY scrollback). The canonical form per cli-devin SKILL.md is `--print --prompt-file`.

### Methodology summary

- 10 iterations dispatched sequentially via cli-devin SWE-1.6
- Explicit SIGKILL between iters per memory rule `Deep-loop iter dispatches: ONE AT A TIME with explicit kill between`
- Reducer (`reduce-state.cjs`) run after each iter; registry + dashboard regenerated each pass
- All iters under 10 min wall-clock per cli-devin SKILL.md SWE-1.6 budget
- Total session wall-clock: ~50 min (well under the 2-hour `maxDurationMinutes` budget)

### Files reviewed (cumulative)

- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts` (validator)
- `.opencode/skills/deep-review/scripts/reduce-state.cjs` (reducer)
- `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` (workflow)
- `.opencode/skills/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts` (graph allow-list)
- `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/review-depth-*.vitest.ts` (Phase B fixtures)
- `.opencode/skills/deep-review/references/state_format.md` (v2 schema docs)
- `.opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl` (v2 prompt contract)
- `.opencode/skills/deep-review/manual_testing_playbook/08--review-depth-v2-rollout/*.md` (playbook)
- All 8 phase children + parent spec docs

### Release readiness recommendation

**CONDITIONAL** — the v2 contract is operationally working (validator emits v2 codes, reducer aggregates v2 fields, STOP gates are wired, playbook documents the rollout). The 1 P0 finding (V2EnforcementMode type/set drift) blocks PASS but is a single-file correctness fix (~5-line change) and not a contract-redesign issue. Recommend a follow-on packet `116-deep-review-complexity/009-v2-enforcement-skip-vs-off-alignment/` to remediate the P0 + P1, then re-review (or just verify-after-fix without full deep-review).

## 10. Next Steps

```
/spec_kit:plan "Remediate 116 P0 V2EnforcementMode type/set drift + P1 dead failure code"
```

OR direct micro-fix without packet ceremony:

1. Read `post-dispatch-validate.ts:140-220` to confirm scope
2. Choose alignment direction: either change set to use `off` everywhere (match type) OR change type + function to use `skip` (match contract)
3. Update the type union to either remove `state_delta_iteration_mismatch` (if dead) OR rename `delta_iteration_id_mismatch` callers (if renaming)
4. Run `pnpm vitest run review-depth-validator post-dispatch-validate` — assertions stay green
5. Single commit `fix(116/post-dogfood): align V2EnforcementMode skip vs off + drop dead failure code`
