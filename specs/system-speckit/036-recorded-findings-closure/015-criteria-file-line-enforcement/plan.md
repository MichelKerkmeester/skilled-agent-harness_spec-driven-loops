---
title: "Implementation Plan: Phase 15: criteria-file-line-enforcement"
description: "Mirror check-ac-closure.sh's cutoff pattern into check-ac-coverage.sh, close the lifecycle-activation gap that makes the gate a no-op for this program, then retrofit 56 rows across 15 files to clear the floor for real."
trigger_phrases:
  - "acceptance criteria file line enforcement"
  - "coverage floor cutoff rollout"
  - "lifecycle activation gap"
  - "citation retrofit coverage floor"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 15: criteria-file-line-enforcement

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash (validate.sh rule scripts), Markdown (acceptance-criteria.md content) |
| **Framework** | The existing `validate.sh` rule-sourcing convention under `runtime/cli/rules/` |
| **Storage** | None. Every state change is a checked-in file |
| **Testing** | `validate.sh <folder> --strict` run per packet, with the enforce env var set, both before (documenting the current no-op) and after (proving activation and pass) |

### Overview
Three changes land in order, because each depends on the last being correct before it means anything. First, `check-ac-coverage.sh` gains the cutoff pattern `check-ac-closure.sh` already proves out. Second, `_ac_lifecycle_active()` gains a fallback that reads `acceptance-criteria.md`'s own `**Status:**` field, since none of the 16 measured packets carry the `implementation-summary.md` Status row the function currently requires - without this, turning the switch on changes nothing observable. Third, and only once the first two are verified to actually activate the gate, the citation retrofit closes the 21-of-77 to 70-of-77 gap across 15 files.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `validate.sh --strict` with the enforce switch on passes for children 006-022, with the gate observed to have activated
- [ ] Docs updated (spec/plan/tasks, ENV-REFERENCE.md)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Direct extension of two existing, adjacent shell functions (`check-ac-closure.sh`'s cutoff pair and `check-ac-coverage.sh`'s own `_ac_lifecycle_active()`), followed by a content retrofit. No new abstraction is introduced.

### Key Components
- **Cutoff pair**: `_ac_coverage_cutoff_date()` and its creation-date reader, copied in structure from `_acc_cutoff_date()` / `_acc_created_date()` (`check-ac-closure.sh:44-71`), defaulting to the same `2026-08-30` boundary so the two gates' rollouts stay synchronized (per the open question in spec.md, subject to operator confirmation).
- **Lifecycle-activation fallback**: `_ac_lifecycle_active()` (`check-ac-coverage.sh:69-99`) gains a second read path. Today it returns active only when `implementation-summary.md`'s Metadata table has a `Status` row matching a fixed value list. The fallback reads `acceptance-criteria.md`'s `**Status:**` metadata line (present in every one of the 16 measured packets) when the primary signal is absent, using the same accepted-value list.
- **Citation retrofit**: per-packet edits to `acceptance-criteria.md`'s Verification column, resolving each of the 56 currently-uncited rows either with a real `file:line` or, where REQ-006's design decision lands on porting the Manual-infeasible exemption, an explicit non-file verification class.

### Data Flow
`validate.sh` sources `check-ac-coverage.sh` per packet as it does today. The cutoff pair decides whether the packet is in enforcement scope. The lifecycle fallback decides whether the gate evaluates at all. `_ac_analyze_canonical()` (unchanged) counts covered rows against the floor once both gates say yes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `check-ac-coverage.sh` | Owns the coverage floor, the advisory default and the currently-unused enforce switch | Update: add the cutoff pair and the lifecycle-activation fallback | `_ac_coverage_cutoff_date` and the extended `_ac_lifecycle_active` are unit-exercised by running `run_check` against a fixture packet with only `acceptance-criteria.md`'s Status field set |
| `check-ac-closure.sh` | The pattern this phase mirrors, unchanged itself | Not a consumer of this phase's writes. Read-only reference | `diff` of `check-ac-closure.sh` before and after this phase is empty |
| `runtime/ENV-REFERENCE.md:166-170` | Documents the existing `SPECKIT_AC_COVERAGE*` and `SPECKIT_AC_CLOSURE*` rows | Update: add the new cutoff variable's row | The new row matches the existing table's column shape |
| Children 006-022's `acceptance-criteria.md` (15 files) | Currently 21 of 77 rows cite `file:line`. 010 already at 6 of 6 | Update: retrofit to at least 70 of 77 program-wide | A re-run of the same measurement method (`_ac_analyze_canonical` against each file) reports the new totals |
| `validate.sh`'s existing invocation of `check-ac-coverage.sh` | Sources the rule per packet, unchanged | Not a consumer requiring edits. The rule's exported interface (`run_check`, `RULE_STATUS`, `RULE_MESSAGE`) is unchanged | `validate.sh <folder> --strict` still runs the rule the same way it does today |
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Before/after activation proof | `_ac_lifecycle_active()` against all 16 packets, before and after the fallback lands | A small harness sourcing `check-ac-coverage.sh` and calling `run_check` directly per packet, as used to produce this spec's 21-of-77 measurement |
| Cutoff boundary | The new `_ac_coverage_cutoff_date()` / creation-date pair | Fixture packets with `Created` dates before, on and after the cutoff, confirming advisory versus enforced behavior matches `check-ac-closure.sh`'s own boundary semantics |
| Per-packet `validate.sh --strict` | Each of children 006-022, with `SPECKIT_AC_COVERAGE_ENFORCE=true` | `NODE_PRESERVE_SYMLINKS=1 bash "$(realpath .opencode)/skills/system-spec-kit/runtime/cli/spec/validate.sh" <folder> --strict`, run individually per packet |
| Regression | `check-ac-closure.sh` and every other rule `validate.sh` runs | The existing `--recursive --strict` run against the whole 035 program, confirming no unrelated rule regresses |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `check-ac-closure.sh`'s cutoff pattern, as the structural model | Internal | Green | Stable, small (roughly 25 lines). Low risk of drift before this phase lands |
| REQ-006's design decision on the Manual-infeasible asymmetry | Internal, needs operator input | Yellow | Blocks a clean retrofit for any row whose true verification is aggregate command output rather than a single line. The retrofit can still proceed for rows that do have a real citable line while this decision is pending |
| The 16 packets' current `acceptance-criteria.md` content | Internal | Green | Already fully measured in this spec. No further discovery needed before retrofit work begins |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The lifecycle-activation fallback produces a false positive (activates the gate for a packet that is not actually complete) or the cutoff pair miscompares dates for an existing packet outside this program.
- **Procedure**: Revert `check-ac-coverage.sh`'s commit. The enforce switch returns to its current always-off-by-default, never-activating state for this program, with no data loss since the retrofit content in `acceptance-criteria.md` is additive and harmless to leave in place even if the gate itself is reverted.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (cutoff pair, lifecycle fallback) | Low | Direct mirror of an existing, working pattern |
| Core Implementation (citation retrofit, 56 rows across 15 files) | Medium-High | The largest single line-item. Real content-authoring work, not a mechanical edit |
| Verification | Low | Re-run of the same measurement method already used to produce this spec's numbers |
| **Total** | | Concentrated in the retrofit, not the code change |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No backup needed. Every file this phase touches is tracked in git
- [ ] No feature flag needed beyond the existing `SPECKIT_AC_COVERAGE_ENFORCE` switch, which already exists and defaults off
- [ ] No monitoring alert needed. `validate.sh --strict` is the existing verification surface

### Rollback Procedure
1. Revert `check-ac-coverage.sh`'s commit.
2. Revert `runtime/ENV-REFERENCE.md`'s new row.
3. Leave the citation retrofit in the 15 `acceptance-criteria.md` files in place, since accurate citations are a net improvement independent of whether the gate that measures them is active.
4. Re-run `validate.sh --recursive --strict` on the whole 035 program to confirm the pre-phase state.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->

---
