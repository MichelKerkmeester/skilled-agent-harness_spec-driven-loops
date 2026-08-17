---
title: "Implementation Plan: Rebuild Shadow Parity So Both Sides Derive Independently"
description: "Apply one pattern six times: ledger side from `folded.projection` only, legacy side from an independent oracle, exceptions and non-projected outcomes as parity failures, and a comparator covering the complete protected semantic surface. Each mode ships a divergence-injection test that the pre-fix harness passes and the post-fix harness fails."
trigger_phrases:
  - "shadow parity independent derivation"
  - "blocker 1 parity harness"
  - "harness adapter legacy oracle"
  - "divergence injection test parity"
  - "deep loop 022 parity"
importance_tier: "critical"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/005-blocker-closeout/002-shadow-parity-independent-derivation"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "claude"
    recent_action: "Authored the implementation plan from the WS1 phase-tree proposal"
    next_safe_action: "Enumerate the six protected semantic surfaces before any code"
    blockers: []
    key_files:
      - "plan.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

# Implementation Plan: Rebuild Shadow Parity So Both Sides Derive Independently

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (`runtime/lib`, `runtime/tests`) |
| **Framework** | vitest via `runtime/vitest.config.ts` |
| **Storage** | None — harness code and fixtures only |
| **Testing** | vitest (`npm test`), tsc (`npm run typecheck`) |

### Overview
Enumerate each mode's protected semantic surface first, because the comparator is only as good as that list. Then build one comparator core, write six independent oracles against it, and invert each adapter so the ledger side is the folded projection. Every mode closes with a divergence-injection test demonstrated against both the old and the new harness.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `021`'s hashed-child-manifest boundary has landed, so this child can be scaffolded without widening the parent recursive glob
- [ ] The `021` `runtime` baseline is captured and cited
- [ ] Per-mode protected semantic surfaces enumerated and reviewed
- [ ] File ownership with `025` agreed for `deep-ai-council-reducers/`

### Definition of Done
- [ ] Six adapters rebuilt; six divergence-injection tests demonstrated on both sides of the fix
- [ ] No adapter returns a legacy-derived value as the ledger side
- [ ] Reducer exceptions produce parity failures in every mode
- [ ] Whole gate re-run and reported as a delta against the captured baseline
- [ ] Independent adversarial verification pass complete
- [ ] `validate.sh --strict` exits 0 for this child
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two independent derivations plus a total comparator

### Key Components
- **Comparator core**: One implementation that diffs a ledger projection against a legacy projection across an enumerated surface, absorbing the existing four-digest partial oracle
- **Legacy oracles (x6)**: Independently implemented per-mode derivations that never read the folded projection
- **Adapter inversion**: Each harness adapter returns `folded.projection` as the ledger side and the oracle output as the legacy side
- **Divergence injection**: Per-mode fixtures that introduce one semantic difference the old harness could not see

### Data Flow
Input event log -> (a) reducer fold -> `folded.projection` = ledger side; (b) independent oracle -> legacy side. Comparator diffs (a) against (b) across the enumerated surface. Any exception on either path, or a non-`projected` outcome, short-circuits to FAIL.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This child plans from a deep-review CONDITIONAL verdict, so the fix addendum applies in full.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Six `*-shadow-parity/harness-adapter.ts` | Produce both sides of the parity comparison | update | Import-graph assertion; divergence-injection test per mode |
| `assertLegacyProjectionMatchesCurrentState` | Existing partial oracle, 4 digests, throws rather than diffing | absorb into the comparator | Its four digests appear in the new surface list; no duplicate implementation remains |
| Six `runtime/tests/unit/*-shadow-parity.vitest.ts` | Observe parity behavior | update | New divergence tests red pre-fix, green post-fix |
| `deep-ai-council-reducers/` | Shared with `025` | not a consumer here; do not edit | File-ownership note in `MANIFEST.md`; merge serialized |
| `014` cutover gate | Reads parity evidence | unchanged | Blocker 1 discharge recorded in the `014` unblock table |

Required inventories (run before implementation, record the output):
- Adapters discarding the fold: `rg -n "legacyProjection|folded\.projection" .opencode/skills/system-deep-loop/runtime/lib/*-shadow-parity/harness-adapter.ts`.
- Existing oracle: `rg -n "assertLegacyProjectionMatchesCurrentState" .opencode/skills/system-deep-loop/runtime`.
- Exception swallowing: `rg -n "catch" .opencode/skills/system-deep-loop/runtime/lib/*-shadow-parity/harness-adapter.ts`.
- Per-mode protected surface: enumerate from the mode contract and the reducer projection type, not from the current comparator.

**Algorithm invariant.** For any input log L and any mode M, the ledger side must be a pure function of the reducer fold of L, and the legacy side must be a pure function of L that does not read the fold. If either derivation raises, the comparison is a FAIL. Adversarial cases: an oracle that transitively imports the fold; a comparator that compares a digest of shared state; a mode where the reducer throws and the adapter recovers.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:ai-execution-protocol -->
## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Confirm every scoped finding at the frozen candidate SHA before changing an adapter.
- Capture the pre-change parity and typecheck baselines, including discovered-test counts and exit codes.
- Enumerate each mode's protected semantic surface from its contract and projection type.
- Prove the legacy oracle has no direct or transitive dependency on the folded ledger projection.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Execute confirmation and surface enumeration before comparator work; finish the shared comparator before changing per-mode adapters. |
| TASK-SCOPE | Modify only the six parity adapters, their owned oracle/comparator code, and their named tests; serialize work on shared council reducer files. |
| TASK-VERIFY | For every confirmed finding, preserve a red-before divergence case and a green-after result at the same candidate SHA; exceptions and omitted modes fail closed. |
| TASK-EVIDENCE | Record the command, suite-content digest, discovered-test count, exit code, and candidate SHA for every acceptance claim. |

### Status Reporting Format

Report the active task ID, changed files, candidate SHA, verification command and result, confirmed-versus-deferred findings, and the next unblocked task. Never report a parity pass from an exception, an unenumerated surface, or an omitted mode.

### Blocked Task Protocol

Mark the task `BLOCKED` with the exact failing command, observed output, affected finding or mode, evidence owner, and next diagnostic action. Do not continue to the next mode, reinterpret the failure as parity, or weaken the protected-surface inventory.
<!-- /ANCHOR:ai-execution-protocol -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Confirm and enumerate
- [ ] T001 classification of all 6 findings at HEAD
- [ ] Cite the `021` `runtime` baseline
- [ ] Enumerate the protected semantic surface for each of the six modes and review it

### Phase 2: Comparator core
- [ ] Build one comparator that diffs across an enumerated surface
- [ ] Absorb `assertLegacyProjectionMatchesCurrentState`, converting throw-on-mismatch into a diff result
- [ ] Add the import-graph assertion enforcing oracle independence

### Phase 3: Per-mode rebuild
- [ ] Council: return `folded.projection`; write the independent oracle (`F-006-01`)
- [ ] Alignment: derive the legacy side independently of `foldProjection` (`F-006-02`)
- [ ] Agent-improvement, model-benchmark, skill-benchmark: stop discarding the fold (`F-012-01`..`03`)
- [ ] Deep-review: propagate reducer exceptions as failures (`F-012-04`)

### Phase 4: Divergence injection
- [ ] Per mode, inject one semantic divergence the old harness passed
- [ ] Demonstrate PASS against the pre-fix adapter and FAIL against the rebuilt one
- [ ] Record both runs as the acceptance evidence

### Phase 5: Delta and gate
- [ ] Re-run `npm run typecheck && npm test`; report the delta against the `021` baseline
- [ ] Independent adversarial verification pass
- [ ] Record the Blocker 1 discharge in the `014` unblock table
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Comparator core across each enumerated surface element | vitest |
| Unit | Oracle independence (import graph, fold mutation) | vitest |
| Negative | Divergence injection per mode (the acceptance gate) | vitest |
| Negative | Reducer exception propagation per mode | vitest |
| Regression | Whole `runtime` suite as a delta against the `021` baseline | vitest, tsc |

### Named verification commands

- `cd .opencode/skills/system-deep-loop/runtime && npm run typecheck`
- `cd .opencode/skills/system-deep-loop/runtime && npm test`
- `cd .opencode/skills/system-deep-loop/runtime && npx vitest run tests/unit/deep-ai-council-shadow-parity.vitest.ts tests/unit/deep-alignment-shadow-parity.vitest.ts tests/unit/deep-review-shadow-parity.vitest.ts`
- `cd .opencode/skills/system-deep-loop/runtime && npx vitest run tests/unit/agent-improvement-shadow-parity.vitest.ts tests/unit/model-benchmark-shadow-parity.vitest.ts tests/unit/skill-benchmark-shadow-parity.vitest.ts`
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/036-deep-loop-innovation/002-shadow-parity-independent-derivation --strict`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `021` honest baselines | Internal | Red (not started) | Parity evidence issued against dishonest counts repeats Blocker 4 |
| `runtime` vitest + tsc | Internal | Green | No verification possible |
| `025` file ownership of council reducers | Internal | Yellow | Merge conflicts; serialize |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The rebuilt harness cannot be shown to fail on an injected divergence for any mode, or the whole `runtime` suite regresses beyond the divergences the rebuild is expected to surface.
- **Procedure**: Revert per mode, not wholesale: each adapter is an independent commit, so a mode whose oracle is wrong can be reverted while the other five stand. Restore the prior adapter and re-run the mode's suite to confirm the baseline returns.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Confirm + enumerate) ──► Phase 2 (Comparator core) ──► Phase 3 (Per-mode rebuild x6)
                                                                          │
                                                                          ▼
                                                        Phase 4 (Divergence injection x6)
                                                                          │
                                                                          ▼
                                                             Phase 5 (Delta + gate)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1 Confirm + enumerate | `021` | 2 |
| 2 Comparator core | 1 | 3 |
| 3 Per-mode rebuild | 2 | 4 |
| 4 Divergence injection | 3 | 5 |
| 5 Delta + gate | 4 | `014` Blocker 1 discharge |
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Confirm + enumerate | Medium | 5-8 hours |
| Comparator core | High | 8-12 hours |
| Per-mode rebuild | High | 18-30 hours |
| Divergence injection | High | 10-16 hours |
| Delta + gate | Medium | 4-6 hours |
| **Total** |  | **45-72 hours** |
<!-- /ANCHOR:l2-effort -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-implementation Checklist
- [ ] Baseline captured for every runner this child touches, at a named SHA
- [ ] Work runs in an isolated git worktree (a concurrent session moved the review target mid-run)
- [ ] Per-mode protected semantic surfaces enumerated and reviewed before any comparator code
- [ ] Pre-fix divergence-injection runs recorded, so the PASS-before contrast is available

### Rollback Procedure
1. Identify the failing mode; each adapter rebuild is an independent commit.
2. Revert that mode's adapter and oracle commits.
3. Re-run that mode's parity suite and confirm the pre-fix behavior returns.
4. Record which mode reverted and why; Blocker 1 stays open for that mode.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — harness code and test fixtures only.
<!-- /ANCHOR:l2-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────┐   ┌──────────────────┐
│ Surface lists x6 │──►│ Comparator core  │
└──────────────────┘   └────────┬─────────┘
                                │
         ┌──────────────────────┼──────────────────────┐
         ▼                      ▼                      ▼
  ┌────────────┐        ┌────────────┐         ┌────────────┐
  │ Oracles x6 │───────►│ Adapters x6│────────►│ Divergence │
  └────────────┘        └────────────┘         │ tests x6   │
                                               └────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Surface lists | Mode contracts, reducer projection types | Enumerated protected surface per mode | Comparator core |
| Comparator core | Surface lists, existing partial oracle | One diffing comparator | Oracles, adapters |
| Oracles (x6) | Comparator core | Independent legacy derivations | Adapters |
| Adapters (x6) | Oracles | Real two-sided parity result | Divergence tests, `014` Blocker 1 |
| Divergence tests (x6) | Adapters | Acceptance evidence | `014` Blocker 1 discharge |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Enumerate the six protected semantic surfaces** - 5-8 hours - CRITICAL
2. **Build the comparator core** - 8-12 hours - CRITICAL
3. **Rebuild six adapters with independent oracles** - 18-30 hours - CRITICAL
4. **Demonstrate six divergence injections on both sides of the fix** - 10-16 hours - CRITICAL

**Parallel Opportunities**:
- The three deep-improvement variants (`F-012-01`..`03`) share one mechanism and can be rebuilt together.
- Council and alignment (the two CONFIRMED findings) can be rebuilt in parallel with the improvement variants once the comparator core exists.
- This child is fully parallel with `023`; they share no files.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Surfaces enumerated | Six reviewed protected-surface lists exist | End of Phase 1 |
| M2 | Comparator core | One comparator diffs across a surface list; partial oracle absorbed | End of Phase 2 |
| M3 | Six adapters rebuilt | No adapter returns a legacy-derived ledger side | End of Phase 3 |
| M4 | Divergence proven | Six injections: PASS pre-fix, FAIL post-fix, both recorded | End of Phase 4 |
| M5 | Blocker 1 discharged | Suite delta clean; independent verification recorded | End of Phase 5 |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:l3-adr-summary -->
## L3: ARCHITECTURE DECISION SUMMARY

| ADR | Decision | Status |
|-----|----------|--------|
| ADR-001 | One comparator pattern applied six times, not six bespoke harnesses | Proposed |
| ADR-002 | Absorb the existing partial oracle instead of duplicating it | Proposed |

Full context, alternatives, and consequences: `decision-record.md`.
<!-- /ANCHOR:l3-adr-summary -->
