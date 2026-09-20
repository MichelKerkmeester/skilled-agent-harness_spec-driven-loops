---
title: "Implementation Plan: catalog enforcement and coverage"
description: "The catalog validator covers 8 of 26 feature-catalog packages (66 of 804 leaves), runs four narrow check families rather than the standard's eight rules, and exits 0 on its default invocation while printing FAIL: 19 violations. This phase settles the four rulings both siblings depend on, switches discovery to feature-catalog presence, adds six unenforced checks with paired fixtures, and wires a gate that actually fails."
trigger_phrases:
  - "catalog enforcement and coverage implementation plan"
  - "feature catalog integrity implementation plan"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/023-feature-catalog-integrity/001-catalog-enforcement-and-coverage"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the implementation plan from research synthesis"
    next_safe_action: "Confirm baselines in T001 before any edit begins"
    blockers: []
    key_files:
      - "plan.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

# Implementation Plan: Catalog Enforcement and Coverage

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context
The only automated check on feature catalogs is
`.opencode/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py` (471 lines). Its covered set
comes from `expected_root_packages()`, which returns `system-skill-advisor` plus every skill directory carrying a
`hub-router.json`: 8 packages, 66 leaves, against 26 packages and 804 leaves in the repo. `run_all_checks()` runs four
check families — sk-doc workflow-mode parity, root-to-leaf bijection, SOURCE FILES path existence, and taxonomy — which
covers the standard's bijection and source-path rules but leaves title parity, description parity, dark-vs-shipped
labeling, packet-history rejection, prose-path checking, and volatile-count freshness unenforced. `--strict` already
returns exit 1; the defect is that the **default** returns 0 and that no CI job, hook, or doctor route calls it at all.

### Overview
Settle four rulings, widen and deepen the validator, wire a gate. Nothing in this phase edits catalog content.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- The T001 confirm-against-HEAD task has re-measured the 26/804/66 census, the 19-violation baseline, and the
  104-orphan / 0-dangling-link figure.
- Q1, Q2, Q3, Q4, Q6, Q8 are answered, or the affected requirement is explicitly deferred with the operator's note.

### Definition of Done
- `python3 .opencode/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py` returns non-zero on a
  tree with violations and zero on a clean tree.
- Every new check has a passing positive fixture and a failing negative fixture, both asserted by a test.
- A coverage test fails when a `feature-catalog/` directory exists outside the ruled set.
- `decision-record.md` records all four rulings with status Accepted or Deferred, never blank.
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this folder> --strict` exits 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One Python validator, discovery-driven rather than list-driven, with a per-package severity map and paired fixtures per
check. Shared derivation logic lives in `.opencode/skills/sk-doc/shared/scripts/` so the catalog validator, the
`036/032` docs-drift check, and the `sk-doc/022/001` README auditor consume one definition.

### Key Components
- `expected_root_packages()` — replaced by presence-based discovery over `.opencode/skills/**/feature-catalog/`, with a
  ruled include/exclude map and a recorded reason per exclusion. **OPERATOR-DECISION (Q8).**
- `run_all_checks()` — extended from four check families to ten, the six additions being phantom-row detection,
  prose-path checking, title parity, description parity, packet-history rejection, and dark-vs-shipped labeling.
- `main()` — exit-code contract inverted: non-zero on FAIL by default, `--report-only` for the old advisory behavior.
  `--strict` is retained as an alias so existing invocations keep working.
- Severity map — per package, `warn` or `fail`, with promotion on clean. **OPERATOR-DECISION (Q3).**
- Shared helper in `sk-doc/shared/scripts/` — derives counts and rosters from `mode-registry.json` and friends.

### Data Flow
Discovery walks `.opencode/skills` for `feature-catalog/` directories, produces the package list, each package is run
through the ten check families, violations are collected with a `type` and a package-scoped severity, the report is
formatted (text or JSON), and the process exits non-zero if any `fail`-severity violation is present.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
Confirm every measured figure against HEAD, enumerate existing callers of the validator so the exit-code inversion
cannot break one silently, then settle the four rulings and record them.

### Phase 2: Core Implementation
Switch discovery, add the six checks with paired fixtures, invert the exit-code contract, build the shared helper, add
the coverage assertion, apply the ruled template amendments, and fix the two `mcp-code-mode` README inaccuracies.

### Phase 3: Verification
Full-corpus dry run at both severities, seeded-violation and clean-tree exit-code tests, fixture assertions, the
single-definition-site test, then wire the gate and strict-validate the packet.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Fixture-driven. Each of the six new checks gets one conforming fixture that must pass and one defective fixture that
must fail, and both outcomes are asserted. Three of the negative fixtures are real defects observed in the tree, which
makes them regression tests rather than synthetic ones:

- phantom row: the advisor's literal `hooks-and-plugin/opencode-hook.md (not yet authored)` row;
- prose path: `system-spec-kit/feature-catalog/governance/feature-flag-governance.md` citing a retired
  compiled-routing directory in prose;
- packet history: any of the 22 `system-deep-loop/runtime/feature-catalog` leaves carrying `Source phase:`.

Beyond fixtures: an exit-code test (seeded violation returns non-zero, clean tree returns zero), a coverage test (a new
`feature-catalog/` directory outside the ruled set fails), a determinism test (two JSON runs are byte-identical), and a
single-definition-site test for the shared helper.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `.opencode/skills/sk-doc/shared/scripts/validate_document.py` and `naming_root_resolver.py`, already imported by the
  validator.
- The `sk-create-feature-catalog` asset templates, which the ruling amendments edit.
- Cross-track: the `036/032` count-derivation helper and the `sk-doc/022/001` manifest walker. Build once, consume
  three times.
- Operator answers to Q1, Q2, Q3, Q4, Q6, Q8.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Every change is a documentation asset, a Python validator, a fixtures tree, or CI wiring. Rollback is `git revert` of
the phase's commits. The one live-blast-radius item is the gate: if CI starts failing unexpectedly, set the affected
packages back to `warn` in the severity map (a one-line data change) rather than reverting the validator, and reopen Q3.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends on | Blocks | Note |
|-------|-----------|--------|------|
| 1 Setup | Nothing | 2, 3 | T001 must run before any edit |
| 2 Core | Phase 1 rulings | 3 | Six requirements are OPERATOR-DECISION gated |
| 3 Verification | Phase 2 | `002` Lanes B-D, all of `003` | Gate wiring is the last step |

This phase blocks `002` Lanes B-D and all of `003`. It does not block `002` Lane A, which is pure path substitution and
should start immediately.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Workstream | Relative size | Driver |
|-----------|---------------|--------|
| Rulings and decision record | Medium | Two are genuine standard ambiguities, not defects |
| Discovery plus exit-code contract | Small | Localized to two functions |
| Six checks plus twelve fixtures | Large | The bulk of the phase |
| Shared helper and coordination | Medium | Two cross-track consumers |
| Gate wiring | Small | Blocked on Q4 |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- Existing callers of the validator enumerated, so the exit-code inversion cannot break one silently.
- Full-corpus dry run captured at both `warn` and `fail` severity.
- The 104-orphan / 0-dangling-link baseline recorded before any edit.

### Rollback Procedure
1. If CI fails on an unexpected package, demote that package to `warn` in the severity map and re-run.
2. If the exit-code inversion breaks a caller, have the caller pass `--report-only` rather than reverting the contract.
3. If a check produces false positives at scale, disable that single check by name and keep the rest.
4. Full revert only if the validator itself is wrong.

### Data Reversal
None. This phase writes no persistent state outside the repository.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
  T001 confirm-at-HEAD
        |
        v
  four rulings (Q1, Q2, Q8 + feature-leaf definition)
        |
        +--> discovery switch --------+
        |                             |
        +--> six checks + fixtures ---+--> full-corpus dry run --> gate wiring (Q4)
        |                             |
        +--> exit-code contract ------+
        |
        +--> shared helper <--- 036/032 count derivation
                              <--- sk-doc/022/001 manifest walker
```

### Dependency Matrix

| Item | Needs | Needed by |
|------|-------|-----------|
| Rulings | T001 evidence, operator answers | Six checks, `002` Lane D, `003` Lane A |
| Discovery switch | Q8 | Coverage test, `003` strict-clean criterion |
| Exit-code contract | Caller enumeration | Gate wiring |
| Shared helper | Coordination with two tracks | Derived-assertion checks in `002` |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

T001 confirm-at-HEAD, then the four rulings, then the checks that depend on them (description parity depends on Q2;
the coverage assertion depends on Q8), then the full-corpus dry run, then gate wiring. The rulings are the critical
path because both siblings are blocked on them, not because they are the largest piece of work.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Evidence |
|-----------|----------|
| M1 Baselines confirmed | 26/804/66 census, 19 violations, 104 orphans / 0 dangling links, all re-measured |
| M2 Rulings recorded | `decision-record.md` ADR entries with status, cited by `002` and `003` |
| M3 Validator widened and deepened | Ten check families, presence-based discovery, coverage test green |
| M4 Fail-closed | Default invocation non-zero on violations; seeded and clean-tree tests pass |
| M5 Gated | CI on `skilled/v*` plus a `/doctor` route, at the ruled severity |
<!-- /ANCHOR:milestones -->
