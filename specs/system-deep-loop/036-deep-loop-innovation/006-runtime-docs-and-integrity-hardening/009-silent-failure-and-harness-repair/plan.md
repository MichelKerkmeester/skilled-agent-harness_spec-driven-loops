---
title: "Implementation Plan: Make Invalid Input Fail Loudly and Repair the Harnesses That Produce Evidence"
description: "Three lanes with representative tasks rather than per-finding tasks: strict parse and `INPUT_VALIDATION`/exit-3 classification; harness de-duplication, timeout scoping and a settle-on-exit spawn helper; and asset, playbook and snapshot resolution repair including triage of the five pre-existing command-contract failures."
trigger_phrases:
  - "silent failure harness repair"
  - "input validation exit code deep loop"
  - "aggregate suite double registration"
  - "manual playbook dead runtime path"
  - "deep loop 031 silent failure"
importance_tier: "high"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/009-silent-failure-and-harness-repair"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "claude"
    recent_action: "Authored the implementation plan from the WS1 phase-tree proposal"
    next_safe_action: "Capture the discovered-test count baseline before any edit"
    blockers: []
    key_files:
      - "plan.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

# Implementation Plan: Make Invalid Input Fail Loudly and Repair the Harnesses That Produce Evidence

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS (`runtime/scripts`, benchmark and playbook assets), TypeScript (`runtime/lib`, `runtime/tests`) |
| **Framework** | vitest via `runtime/vitest.config.ts`; `node --test` for the script suites |
| **Storage** | JSONL state and delta logs, benchmark profiles, playbook scenario files |
| **Testing** | vitest, `node --test`, `render-contract-snapshot.cjs --check`, an all-profile asset-resolution gate |

### Overview
Capture the discovered-test count baseline first, because Lane B will legitimately reduce it and that reduction must be reported as a delta rather than discovered later as lost coverage. Then run the three lanes largely in parallel: Lane A is strict parse and exit-code classification, Lane B is harness integrity, Lane C is asset and playbook resolution plus the command-contract triage.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `021`'s hashed-child-manifest boundary has landed, so this child can be scaffolded without widening the parent recursive glob
- [ ] `026` and `028` have landed on the shared files
- [ ] The discovered-test count baseline captured and the `021` sequencing decision recorded
- [ ] Consumers of the current exit codes enumerated

### Definition of Done
- [ ] Every Lane A case returns `INPUT_VALIDATION` with a distinct exit code
- [ ] Lane B count reduction reported as a delta with unique-test evidence
- [ ] Every prescribed playbook path resolves; snapshot `--check` exits 0
- [ ] Whole gate re-run and reported as a delta against the captured baseline
- [ ] Independent adversarial verification pass complete
- [ ] `validate.sh --strict` exits 0 for this child
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Three parallel lanes over one shape: unmeasured or invalid input presenting as fine

### Key Components
- **Lane A: strict parse and classification**: Invalid input returns `INPUT_VALIDATION` with a distinct exit code, and closed-type casts are replaced with validation
- **Lane B: harness integrity**: Single registration, scoped timeouts, and a spawn helper that settles when a child ignores SIGTERM
- **Lane C: resolution repair**: Playbook paths, benchmark fixtures, the snapshot verifier, and the readiness denominator all resolve
- **Command-contract triage**: A recorded disposition for each of the five pre-existing failures `021` captured as a RED baseline

### Data Flow
Invalid input -> validation -> `INPUT_VALIDATION` classification -> distinct exit code, with no downstream record written. Separately: test file -> single registration -> unique discovered count -> the evidence `021` cites. And: playbook or profile -> path resolution check -> a runnable prescription.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This child plans from a deep-review CONDITIONAL verdict, so the fix addendum applies in full.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `reduce-state.cjs`, `verify-iteration.cjs`, `query.cjs`, `upsert.cjs`, `fanout-merge.cjs` | Silently tolerate malformed input | update (Lane A) | One classification test per case |
| `fanout-run.cjs` | Generic script error on schema failure; owned first by `028` | update (Lane A), sequenced after `028` | Classification test; ordering in `MANIFEST.md` |
| `reduce-alignment-state.cjs` | Delta-corruption handling; owned first by `026` | update (Lane A), sequenced after `026` | Strict-failure test; ordering in `MANIFEST.md` |
| `divergent-pivot.ts`, `durable-orchestrator.ts` | Cast to closed types after generic-only checks | update (Lane A) | Validation tests replacing the casts |
| Three rollback aggregates, two resume-adapter suites, `spawn-cjs.ts` | Double registration, unbounded timeout, non-settling spawn | update (Lane B) | Count delta; SIGTERM-ignoring fixture |
| `021` reconciliation | Cites counts this child changes | coordinate, do not edit | Sequencing rule in `MANIFEST.md` |
| Playbooks, benchmark profiles, snapshot verifier | Prescribe unresolvable paths; verifier cannot accept its own output | update (Lane C) | Resolution gate; `--check` exit 0 |

Required inventories (run before implementation, record the output):
- Exit-code consumers: `rg -n "exitCode|process.exit" .opencode/skills/system-deep-loop --glob "*.cjs" --glob "*.yaml"`.
- Double registration: `rg -n "^import .*\.vitest\.js" .opencode/skills/system-deep-loop/runtime/tests/unit`.
- Timeout overrides: `rg -n "vi.setConfig" .opencode/skills/system-deep-loop/runtime/tests`.
- Playbook cwd prescriptions: `rg -n "cd .opencode/skills/runtime" .opencode/skills/system-deep-loop`.

**Algorithm invariant.** For any input I to any script in scope, the script either produces the outcome I describes or fails with a classification naming why; it never succeeds silently against a substitute. For any test file T, each test in T is registered exactly once. Adversarial cases: a corrupt delta row; a malformed newest record with a valid older one; a `NaN` limit; a valueless flag; a misspelled flag; a SIGTERM-ignoring child with a descendant; an aggregate importing an independently discovered suite.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Confirm, baseline and sequence
- [ ] T001 classification of all 23 findings at HEAD
- [ ] Capture the discovered-test count baseline Lane B will reduce
- [ ] Record the `021` sequencing decision
- [ ] Enumerate consumers of the current exit codes

### Phase 2: Lane A, strict parse and classification
- [ ] Strict corruption handling in the reducers
- [ ] No completion record after a parse failure
- [ ] Verification cannot be satisfied by a stale record
- [ ] Argument and flag validation with `INPUT_VALIDATION` and a distinct exit code
- [ ] Replace closed-type casts with real validation

### Phase 3: Lane B, harness integrity
- [ ] Stop double-registering independently discovered suites
- [ ] Scope and reset the file-wide timeout override
- [ ] Make the spawn helper settle when a child ignores SIGTERM, with a test that exercises it

### Phase 4: Lane C, resolution repair
- [ ] Reject absolute probe paths outside the repo
- [ ] Fix every prescribed playbook `cwd` and test path
- [ ] Cover every scenario directory in the readiness denominator; reconcile the verdict vocabulary
- [ ] Make the snapshot verifier accept its own output
- [ ] Resolve benchmark fixture IDs and the nested fixture corpus
- [ ] Point the benchmark contract at one packet
- [ ] Triage the five pre-existing command-contract failures

### Phase 5: Delta and gate
- [ ] Re-run every suite; report the discovered-count delta with Lane B's reduction explained
- [ ] Independent adversarial verification pass
- [ ] Hand the reconciled counts back to `021`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Classification | One test per Lane A invalid-input case | vitest, `node --test` |
| Count delta | Discovered-test count before and after Lane B | vitest |
| Process | SIGTERM-ignoring fixture with a descendant | vitest |
| Resolution | Every playbook `cwd` and test path; all ten benchmark profiles | Resolution gate |
| Snapshot | `render-contract-snapshot.cjs --check` against the committed snapshot | Script run |
| Regression | Whole `runtime` suite and both `.test.cjs` suites as deltas | vitest, `node --test` |

### Named verification commands

- `cd .opencode/skills/system-deep-loop/runtime && npm run typecheck`
- `cd .opencode/skills/system-deep-loop/runtime && npm test`
- `node --test .opencode/skills/system-deep-loop/deep-alignment/scripts/tests/*.test.cjs`
- `node --test .opencode/skills/system-deep-loop/deep-review/scripts/tests/*.test.cjs`
- `node .opencode/skills/system-deep-loop/deep-review/scripts/render-contract-snapshot.cjs --check`
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/036-deep-loop-innovation/009-silent-failure-and-harness-repair --strict`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `021` count reconciliation | Internal | Red (bidirectional) | The two children invalidate each other's numbers unless sequenced |
| `026` on `reduce-alignment-state.cjs` | Internal | Red (not started) | Merge conflict and semantic ordering |
| `028` on `fanout-run.cjs` | Internal | Red (not started) | Merge conflict and semantic ordering |
| `runtime` vitest + tsc, `node --test` | Internal | Green | No verification possible |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Exit-code changes break automation that cannot be updated within this child, or the Lane B de-duplication removes a genuinely unique test.
- **Procedure**: Each lane is an independent commit set. Revert the lane that caused the failure. If Lane B reverts, the inflated counts return and `021`'s citations remain valid, which must be recorded as re-opening `F-034-01`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Confirm + baseline + sequence)
        │
   ┌────┴──────────────┬────────────────────┐
   ▼                   ▼                    ▼
Phase 2 (Lane A)   Phase 3 (Lane B)   Phase 4 (Lane C)
   └───────────────────┴────────────────────┘
                       ▼
              Phase 5 (Delta + gate)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1 Confirm + baseline + sequence | `021`, `026`, `028` | 2, 3, 4 |
| 2 Lane A | 1 | 5 |
| 3 Lane B | 1 | 5 |
| 4 Lane C | 1 | 5 |
| 5 Delta + gate | 2, 3, 4 | `021` re-reconciliation |
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Confirm + baseline + sequence | Medium | 6-10 hours |
| Lane A | High | 24-38 hours |
| Lane B | Medium | 10-16 hours |
| Lane C | High | 20-32 hours |
| Delta + gate | Medium | 6-10 hours |
| **Total** |  | **66-106 hours** |
<!-- /ANCHOR:l2-effort -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-implementation Checklist
- [ ] Baseline captured for every runner this child touches, at a named SHA
- [ ] Work runs in an isolated git worktree (a concurrent session moved the review target mid-run)
- [ ] Discovered-test count baseline captured before Lane B
- [ ] The `021` sequencing decision recorded
- [ ] Exit-code consumers enumerated

### Rollback Procedure
1. Identify the lane that caused the failure; each lane is an independent commit set.
2. Revert that lane.
3. Re-run that lane's tests and report the count delta again.
4. Record which findings re-open, and notify `021` if the counts changed back.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — script behavior, test harnesses and documentation assets only.
<!-- /ANCHOR:l2-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────────────┐
│ Count baseline + sequence│
└─────────┬────────────────┘
          │
  ┌───────┼────────┬─────────────┐
  ▼       ▼        ▼             ▼
┌──────┐┌──────┐┌──────┐   ┌──────────────┐
│Lane A││Lane B││Lane C│──►│ 021 re-recon │
└──────┘└──────┘└──────┘   └──────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Count baseline | `021` | The pre-de-duplication discovered count | Lane B, `021` re-reconciliation |
| Lane A | Baseline, `026`, `028` | Classified invalid-input failures | Delta gate |
| Lane B | Baseline | Unique test registration | `021` re-reconciliation |
| Lane C | Baseline | Resolvable playbook and benchmark prescriptions | Delta gate |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Capture the count baseline and record the `021` sequencing decision** - 6-10 hours - CRITICAL
2. **Lane A strict parse and classification** - 24-38 hours - CRITICAL
3. **Lane C resolution repair and command-contract triage** - 20-32 hours - CRITICAL
4. **Report the delta and hand reconciled counts back to `021`** - 6-10 hours - CRITICAL

**Parallel Opportunities**:
- The three lanes are independent of one another and run in parallel after Phase 1.
- Lane C's playbook work is independent of every runtime change.
- The command-contract triage can start as soon as the `021` RED baseline is available.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baseline and sequence | Count baseline captured; `021` ordering recorded | End of Phase 1 |
| M2 | Lane A loud | Every invalid-input case classified with a distinct exit code | End of Phase 2 |
| M3 | Lane B honest | Unique registration; scoped timeouts; settling spawn helper | End of Phase 3 |
| M4 | Lane C resolvable | Every prescribed path resolves; snapshot `--check` exits 0 | End of Phase 4 |
| M5 | Counts reconciled | Delta reported with the reduction explained; handed back to `021` | End of Phase 5 |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:l3-adr-summary -->
## L3: ARCHITECTURE DECISION SUMMARY

| ADR | Decision | Status |
|-----|----------|--------|
| ADR-001 | Invalid input returns INPUT_VALIDATION with a distinct exit code | Proposed |
| ADR-002 | A lower discovered-test count after de-duplication is a correction, not lost coverage | Proposed |

Full context, alternatives, and consequences: `decision-record.md`.
<!-- /ANCHOR:l3-adr-summary -->
