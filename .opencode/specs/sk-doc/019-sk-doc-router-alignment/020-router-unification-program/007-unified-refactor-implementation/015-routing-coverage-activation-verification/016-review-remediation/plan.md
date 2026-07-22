---
title: "Implementation Plan: Compiled-Routing Deep-Review Remediation"
description: "Four workstreams remediating the eight confirmed deep-review findings: routing-semantics parity (F005, F002), manifest publication plus authored closure (F001, F007), cohort single-source plus telemetry (DOC-3, F006), and packet evidence reconciliation (DOC-1, DOC-2)."
importance_tier: "critical"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/016-review-remediation"
    last_updated_at: "2026-07-22T06:39:39Z"
    last_updated_by: "claude"
    recent_action: "All four workstreams shipped and verified; conformed plan to the Level-2 template."
    next_safe_action: "Operator sign-off; merge to v4 remains operator-gated."
    blockers: []
    key_files: []
---

# Implementation Plan: Compiled-Routing Deep-Review Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS + TypeScript vitest) |
| **Subsystem** | Compiled skill-router (bin runtime + authored spec-tree twin) |
| **Testing** | node:test, vitest, the frozen skill-benchmark replay |
| **Branch** | `sk-doc/0089-default-routing-cutover` (merge to v4 operator-gated) |

### Overview

Test-first per fix; verify the release invariants (frozen scorer SHAs, compiled-equals-legacy parity, seven-hub serving, kill-switch) after each workstream and in a final full pass. The four workstreams cover the eight confirmed findings from the two GPT-5.6 deep reviews.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Every finding verified against the actual code (finding equals hypothesis)
- [x] Invariants enumerated and baselined
- [x] Frozen-file and stray boundaries identified
- [x] Approved remediation plan on record

### Definition of Done
- [x] Every finding fixed with a regression test
- [x] Frozen scorer SHAs unchanged; parity 49/49; seven hubs serving
- [x] `checklist.md` items verified with evidence
- [x] 013 docs reconciled; operator sign-off surfaced

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Two byte-faithful copies of the compiled engine: the promoted runtime under `.opencode/bin/lib/compiled-routing/` (what serves) and the authored spec-tree twin under `007-unified-refactor-implementation/` (the source of record). The frozen skill-benchmark replay is the parity oracle.

### Key Components
- **Per-hub router** (`00N-<hub>/lib/router.cjs`): matcher and scorer (F005).
- **Cutover gate** (`cutover-playbook-executor.cjs`): compiled-versus-legacy parity check (F002).
- **Manifest lifecycle** (`compiled-route-manifest.cjs`): mint and refresh, serving-authority publication (F001).
- **Authored closure** (`compiled-route-sync.cjs`): traces and resolves the authored engine (F007).
- **Cohort + telemetry** (`resolve.cjs`, `compiled-routing-flag.ts`, `compiled-routing-parity.cjs`): default-on cohort and flag-state reporting (DOC-3, F006).

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: WS-1 routing-semantics parity
- [x] F005: word-boundary-match legacy's `WORD_BOUNDARY_KEYWORDS` in `containsSignal` (bin + spec-tree twin); add the `preview-not-review` canary to both fixtures.
- [x] F002: fall back only on `defer`; compare `clarify`/`reject` against legacy; add cutover cases.

### Phase 2: WS-2 manifest publication + authored closure
- [x] F001: re-read serving fields after the compile, publish via temp-file plus rename; add a concurrent-refresh regression.
- [x] F007: reconcile the authored engine to the promoted bin twins for the four diverged hubs; `--check`/`--verify` resolve all seven.

### Phase 3: WS-3 cohort + telemetry, then WS-4 doc reconciliation
- [x] DOC-3: strengthen the cohort drift-guard across all four copies.
- [x] F006: fix `classifyFlagState` telemetry and its locking test (report-only).
- [x] DOC-1: reconcile the 013 lifecycle metadata; record deferrals; surface sign-off.
- [x] DOC-2: mark the SD-015 limitation and follow-up resolved, citing the existing tests.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit / regression | Per-fix failing-then-green regressions (router, cutover, manifest refresh) | node:test, vitest |
| Parity | Compiled equals legacy across all seven hubs | frozen skill-benchmark replay (`compiled-routing-parity.vitest.ts`) |
| Integration | Closure resolution and serving status | `compiled-route-sync.cjs --check`/`--verify`, `compiled-route-status.cjs --all` |
| Invariant | Frozen SHAs, kill-switch, no spec reads | shasum, resolver drills |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Frozen scorer trio | Internal | Green (never edited) | Parity oracle invalid |
| Verified v4 landing (`ed8f3e20d0`) | Internal | Green | Regression baseline lost |
| Promoted bin engine | Internal | Green | F007 reconcile source lost |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A parity regression, a frozen-SHA change, or a hub dropping out of compiled-serving.
- **Procedure**: `git revert` the offending commit on the worktree branch; re-run the invariant battery to confirm the fleet returns to the pre-fix baseline. No runtime data to preserve.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (WS-1) ─┐
                ├─> Phase 3 (WS-3 telemetry, then WS-4 docs)
Phase 2 (WS-2) ─┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| WS-1 | None | WS-4 (docs reflect the fixed state) |
| WS-2 | None | WS-4 |
| WS-3 | None | WS-4 |
| WS-4 | WS-1, WS-2, WS-3 | None |

<!-- /ANCHOR:l2-phase-deps -->
---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| WS-1 routing parity | Medium | 2-3 hours |
| WS-2 manifest + closure | High (F007 touches authored engine) | 3-4 hours |
| WS-3 cohort + telemetry | Low | 1 hour |
| WS-4 doc reconciliation | Medium | 1-2 hours |
| **Total** | | **7-10 hours** |

<!-- /ANCHOR:l2-effort -->
---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline captured (frozen SHAs, parity 49/49, seven-hub serving)
- [x] Kill-switch confirmed (`SPECKIT_COMPILED_ROUTING=0` falls back to legacy)
- [x] Merge to v4 held behind the operator gate

### Rollback Procedure
1. **Immediate**: set `SPECKIT_COMPILED_ROUTING=0` to serve legacy fleet-wide.
2. **Revert code**: `git revert` the offending commit on `sk-doc/0089-default-routing-cutover`.
3. **Verify**: re-run the invariant battery; confirm parity and serving return to baseline.

### Data Reversal
- **Has data migrations?** No. The changes are code, tests, and docs only.

<!-- /ANCHOR:l2-rollback -->
