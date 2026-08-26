---
title: "Implementation Plan: System-Deep-Loop Runtime Latent-Issue Remediation"
description: "Plan for the verify-then-fix remediation of the 016 audit P0+P1 findings: baseline the runtime test suite, fan out eight disjoint-file Sonnet-5 workstreams that each verify their findings against source before fixing at root cause, then re-run the whole suite against the baseline and reconcile the packet before a gated push."
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/017-runtime-latent-issue-remediation"
    last_updated_at: "2026-08-26T05:25:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the verify-then-fix plan; baseline captured, fan-out launched"
    next_safe_action: "Review each workstream diff against source, then re-run the whole suite vs baseline"
---
# Implementation Plan: System-Deep-Loop Runtime Latent-Issue Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Target** | Shipped `system-deep-loop` runtime — gateway, merge, reducers, salvage/repair, pool, containment, convergence, and the deep-loop prompt-packs/agents |
| **Method** | Verify-then-fix fan-out: eight disjoint-file workstreams, Sonnet 5 at xhigh, each verifies its findings against current source before fixing |
| **Test runner** | vitest (156 files, serial); `node --check` for `.cjs` syntax |
| **Baseline** | 10 files / 14 tests failing pre-change (the regression yardstick) |

### Overview
The 016 audit produced one confirmed P0 and roughly nineteen P1 findings across the shipped runtime. This plan remediates them under strict discipline for a high-blast-radius surface: capture a full test baseline first, partition the findings into disjoint-file workstreams so parallel agents never collide, have each agent verify its findings against source before touching code, fix confirmed bugs at root cause with fail-before/pass-after tests, then re-run the whole suite from the final state and prove no new failures against the baseline. The conductor reviews every diff against source and the failing symptom before commit. Push to remotes is gated on a fresh operator go-ahead.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Findings enumerated and mapped to disjoint-file workstreams
- [x] Full vitest baseline captured (10 files / 14 tests failing pre-change)
- [x] Verify-then-fix contract + comment-hygiene rules bound into every agent
- [x] Scope frozen in spec.md; co-located P2s optional, non-co-located P2s deferred

### Definition of Done
- [ ] The P0 (gateway fail-closed) is fixed with a negative-control test
- [ ] Every in-scope P1 is fixed with a test OR recorded as a verified false positive
- [ ] Whole vitest suite re-run shows no failure that passed at baseline
- [ ] `validate.sh --strict` clean; packet docs reconciled
- [ ] Operator go-ahead obtained before any push

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Parallel verify-then-fix over disjoint file sets. Each workstream owns a distinct cluster of runtime files, so eight agents edit concurrently on one working tree with no conflicts. The conductor (Opus) is the integration and verification layer: it reviews diffs, runs the authoritative serial test suite once, and compares to the baseline.

### Key Components
- **Fan-out** — eight Sonnet-5 xhigh agents, one per workstream, each returning a structured report (per-finding verdict, action, root cause, evidence).
- **Verification** — verify-first inside each agent; independent Opus review + whole-suite re-run after.
- **Baseline** — the pre-change failing set is the yardstick for "no new regressions".

### Data Flow
1. Baseline suite runs to completion and its failing set is recorded.
2. Agents read their files, verify each finding, fix confirmed ones, write tests, `node --check`.
3. Conductor reviews every diff against source and the failing symptom.
4. The whole suite re-runs serially; the failing set is diffed against the baseline.
5. Packet docs are reconciled and validated; push is gated on operator approval.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Files | Findings |
|---------|-------|----------|
| Append gateway | `append-mode-event.ts`, `append-mode-event.cjs` | F-029 (P0), F-032, F-030/31 |
| Merge gate | `fanout-merge.cjs` | F-010, F-011, buildAttributionMd, F-009 |
| Reducers | `reduce-state.cjs`, `reduce-alignment-state.cjs` | P1-3, P1-8/F-014, F-012, F-013, F-015, F-016 |
| Salvage/repair | `fanout-salvage.cjs`, `jsonl-repair.ts` | F-001, F-003, F-034, F-038, F-039 |
| Pool | `fanout-run.cjs`, `fanout-pool.cjs`, `executor-config.ts` | P1-2, F-007, F-022 |
| Containment | `write-containment.ts` | P1-5, P1-6 |
| Convergence | `convergence.cjs`, `verify-iteration.cjs` | F-024, gateway-bypass detection |
| Docs/adherence | prompt-packs (review/research/alignment), `review.md`, `SKILL.md`, agent mirrors | P1-4, P1-7, P1-9, adherence hardening |

<!-- /ANCHOR:affected-surfaces -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Baseline
- [x] Capture the full vitest baseline (failing set recorded)
- [x] Scaffold the packet as bound write authority

### Phase 2: Verify-then-fix fan-out
- [ ] Eight workstreams verify their findings against source
- [ ] Confirmed bugs fixed at root cause with fail-before/pass-after tests
- [ ] False positives recorded, not patched

### Phase 3: Integration & verification
- [ ] Conductor reviews every diff against source
- [ ] Whole vitest suite re-run; failing set diffed against baseline (no new failures)
- [ ] Packet docs reconciled; `validate.sh --strict` clean
- [ ] Operator go-ahead → commit/push/merge

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Negative control | Each fix has a test that fails before and passes after | vitest per-area file |
| Regression | Whole runtime suite, final state vs baseline | vitest run (serial) |
| Syntax | Every changed `.cjs` parses | `node --check` |
| Review | Every diff checked against source + the failing symptom | conductor (Opus) |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Captured vitest baseline | Internal | Green | No regression yardstick |
| 016 finding registry | Internal | Green | No work list |
| Sonnet 5 (xhigh) via workflow fan-out | External | Green | No parallel fixers |
| Agent-mirror-sync hook | Internal | Green | Doc commit blocked if mirrors drift |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A fix introduces a new test failure the conductor cannot resolve, or a fix proves wrong on review.
- **Procedure**: Revert that workstream's files (`git checkout -- <files>`); the disjoint-file partition means one workstream reverts without disturbing the others. Nothing is pushed until the whole suite is green against the baseline and the operator approves.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Baseline) ──> Phase 2 (Fan-out fix) ──> Phase 3 (Integrate + verify + gated push)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Baseline | None | Fan-out |
| Fan-out fix | Baseline (clean yardstick) | Integration |
| Integration | Fan-out | Push |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Baseline | Low | ~18 min (suite runtime) |
| Fan-out fix (8 workstreams) | High | ~15-25 min wall-clock (parallel) |
| Integration + whole-suite re-run | High | ~30-40 min (review + ~18 min suite) |
| Docs + validate | Medium | ~30 min |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline captured before any edit
- [ ] Whole suite green vs baseline before commit
- [ ] Every diff reviewed against source

### Rollback Procedure
1. **Per-workstream**: `git checkout -- <workstream files>` to drop one cluster's changes.
2. **Whole packet**: `git restore` the runtime tree to origin/v4 state; the packet docs are additive and can stay or be removed.
3. **Verify**: re-run the suite; confirm the failing set matches the baseline.

### Data Reversal
- **Has data migrations?** No — code + docs only; no schema or state migration.

<!-- /ANCHOR:enhanced-rollback -->
---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
Baseline ─┬─> WS-GATEWAY ────┐
          ├─> WS-MERGE ───────┤
          ├─> WS-REDUCER ─────┤
          ├─> WS-SALVAGE ─────┼─> Integration ─> Whole-suite re-run ─> Docs+validate ─> Gated push
          ├─> WS-POOL ────────┤
          ├─> WS-CONTAINMENT ─┤
          ├─> WS-CONVERGENCE ─┤
          └─> WS-DOCS ────────┘
```

The eight workstreams are mutually independent (disjoint files) and all depend only on the baseline; the integration step depends on all eight.

<!-- /ANCHOR:dependency-graph -->
---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

The critical path is **Baseline → slowest workstream → Integration → whole-suite re-run → validate**. The slowest workstream is expected to be WS-REDUCER or WS-POOL (largest scripts, most findings). The whole-suite re-run (~18 min serial) sits on the critical path regardless of fan-out speed, so it is run once, after all fixes land.

<!-- /ANCHOR:critical-path -->
---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Definition of Done |
|-----------|--------------------|
| M1 Baseline | Full suite failing set recorded (10 files / 14 tests) |
| M2 Fixes landed | All eight workstreams returned; diffs on disk |
| M3 Verified | Every diff reviewed against source; false positives recorded |
| M4 Green | Whole suite re-run shows no new failures vs baseline |
| M5 Documented | Packet docs reconciled; `validate.sh --strict` clean |
| M6 Shipped | Operator go-ahead → committed/pushed/merged |

<!-- /ANCHOR:milestones -->
