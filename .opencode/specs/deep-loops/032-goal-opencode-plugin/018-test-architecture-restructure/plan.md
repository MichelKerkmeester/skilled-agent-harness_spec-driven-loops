---
title: "Implementation Plan: Phase 18: test-architecture-restructure"
description: "Convert all 6 goal-plugin test files from single-main() scripts to node:test subtests, extract shared helpers, and reconcile the export-contract's seam-count narrative to 16 (post-phase-016) against stale 14/15 claims."
trigger_phrases:
  - "goal plugin test architecture restructure plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/032-goal-opencode-plugin/018-test-architecture-restructure"
    last_updated_at: "2026-07-03T07:30:49Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored plan from spec.md and audit dossier TEST-1/TEST-2/e-2.11 items"
    next_safe_action: "Wait for phases 016 and 017 to land; then start Phase 1 baseline"
    blockers: []
    key_files:
      - ".opencode/plugins/tests/mk-goal-lifecycle.test.cjs"
      - ".opencode/plugins/tests/mk-goal-continuation.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "032-phase-018-test-architecture-restructure-20260703"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 18: test-architecture-restructure

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS test scripts (`.cjs`) under `.opencode/plugins/tests/` |
| **Framework** | `node:test` (built-in), `node:assert/strict` |
| **Storage** | N/A - test files only, ephemeral `mkdtemp` state dirs |
| **Testing** | `node --test` runner; currently 1 test per file, target: N subtests per file |

### Overview
Each of the 6 goal-plugin test files currently wraps its entire scenario list in one `async function main()` invoked once at file scope, so `node --test` sees one top-level test per file and an early `assert` throw aborts everything after it. The fix wraps each existing scenario in a `test('scenario name', async () => { ... })` (or `describe`/`test` nesting where a file's `main()` already groups related scenarios) so each scenario becomes an independently reporting, independently failing subtest, with no change to what each scenario actually asserts. A new `tests/helpers/` module absorbs the two duplicated `readContinuationEntries`/`restoreEnv` helper pairs. The export-contract test's existing 16-name `deepEqual` pin is preserved as-is (it is already correct, grown from 15 to 16 when phase 016 added `fsyncDirectory`); only stale packet-doc narrative with lower seam-count wording is corrected.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Test-file-local subtest conversion; one new shared helpers module. No production-code architecture change.

### Key Components
- **`mk-goal-continuation.test.cjs`, `mk-goal-lifecycle.test.cjs`, `mk-goal-state.test.cjs`, `mk-goal-tool-path.test.cjs`, `mk-goal-supervisor.test.cjs`, `mk-goal-export-contract.test.cjs`**: each file's single `main()` body is decomposed into named `test(...)` blocks (using `node:test`'s `test`/`describe` imports), one per existing logical scenario (each already-distinct assertion group, e.g. "TOCTOU lock race", "budget_limited enforcement", "role-label neutralizer"). Shared setup (plugin import, `mkdtemp` state dir) moves into a `before`/`beforeEach` hook per file so each subtest gets isolated state.
- **`tests/helpers/continuation-log.js` (or similar, new)**: exports `readContinuationEntries(stateDir)` and `restoreEnv(name, value)`, imported by both `mk-goal-continuation.test.cjs` and `mk-goal-lifecycle.test.cjs` in place of their local copies.
- **`mk-goal-export-contract.test.cjs`**: unchanged assertion content (the 16-name `deepEqual` pin stays as-is), just wrapped in `node:test` subtest form like the others.

### Data Flow
No change to what is being tested or what state each scenario sets up/tears down. Only the reporting granularity (subtest vs monolithic file) and the location of two duplicated helper functions change.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mk-goal-continuation.test.cjs` (1 `main()`) | Monolithic autonomy-gate/continuation-cap scenarios | Convert to `node:test` subtests; use shared helpers | `node --test` reports N subtests, all pass |
| `mk-goal-lifecycle.test.cjs` (1 `main()`) | Monolithic lifecycle-event scenarios | Convert to `node:test` subtests; use shared helpers | `node --test` reports N subtests, all pass |
| `mk-goal-state.test.cjs` (1 `main()`) | Monolithic state-normalization scenarios | Convert to `node:test` subtests | `node --test` reports N subtests, all pass |
| `mk-goal-tool-path.test.cjs` (1 `main()`) | Monolithic tool-registration scenarios | Convert to `node:test` subtests | `node --test` reports N subtests, all pass |
| `mk-goal-supervisor.test.cjs` (1 `main()`) | Monolithic verifier scenarios | Convert to `node:test` subtests | `node --test` reports N subtests, all pass |
| `mk-goal-export-contract.test.cjs` (1 `main()`) | Pins `__test` seam shape, already 16 names | Convert to `node:test` subtests; pin content unchanged | `node --test` reports subtests, all pass; `deepEqual` list unchanged |
| `readContinuationEntries`/`restoreEnv` (2 copies) | Duplicated in continuation and lifecycle test files | Extract to `tests/helpers/`, both files import it | `rg` shows single definition, both files' subtests still pass |
| Packet docs carrying stale lower seam-count wording | Stale narrative claim | Correct to 16 | `rg -n "[0-9]+ seams"` shows only "16 seams" |
| `mk-goal.js` `__test` export (:2198-2214) | Live 16-name export | Not modified - no new seam needed | Re-confirm 16 names unchanged after this phase |

Required inventories:
- Same-class producers: `rg -n "^async function main" .opencode/plugins/tests/mk-goal-*.test.cjs` to confirm exactly the 6 files needing conversion before starting.
- Consumers of changed symbols: `rg -n "readContinuationEntries|restoreEnv" .opencode/plugins/tests/` to confirm both call sites are updated to the shared import and no third copy exists.
- Matrix axes: per-file scenario count before vs after conversion (subtest count must equal or exceed the number of previously-sequential assertion groups); helper-extraction correctness (both call sites behave identically post-extraction).
- Algorithm invariant: for every converted file, the exact same assertions run against the exact same setup/teardown; only the reporting boundary (subtest vs whole-file) changes. No scenario is silently dropped or merged.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Baseline
- [ ] Confirm phases 016 and 017 are both complete (tasks.md all `[x]`, fresh test run green)
- [ ] Run full plugin suite fresh, paste baseline output (6 files, 1 test each) as the pre-conversion reference
- [ ] Enumerate the distinct scenario count per file (read each `main()` body, count logical assertion groups) to know the expected post-conversion subtest count per file

### Phase 2: Core Implementation
- [ ] Create `tests/helpers/` module with `readContinuationEntries`/`restoreEnv`, sourced by diffing the two existing copies
- [ ] Convert `mk-goal-continuation.test.cjs` to subtests, using the shared helpers module
- [ ] Convert `mk-goal-lifecycle.test.cjs` to subtests, using the shared helpers module
- [ ] Convert `mk-goal-state.test.cjs` to subtests
- [ ] Convert `mk-goal-tool-path.test.cjs` to subtests
- [ ] Convert `mk-goal-supervisor.test.cjs` to subtests
- [ ] Convert `mk-goal-export-contract.test.cjs` to subtests, pin content unchanged
- [ ] Reconcile any packet doc still carrying stale lower seam-count wording to say 16

### Phase 3: Verification
- [ ] Run the fresh full plugin suite, confirm subtest counts per file match Phase 1's enumeration and all subtests pass
- [ ] Deliberately break one scenario in one file, confirm only that subtest fails and all sibling subtests in the same file still pass, then revert the deliberate break
- [ ] `rg -n "[0-9]+ seams"` across the packet shows only "16 seams"; confirm the export-contract's 16-name pin is unchanged
- [ ] Update `checklist.md` and `implementation-summary.md` with evidence citations
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Regression | All 6 converted files, subtest-by-subtest | `node --test .opencode/plugins/tests/mk-goal-*.test.cjs` |
| Fault-injection | One deliberately broken scenario, confirm isolation | Temporary local edit, reverted before commit |
| Static | Zero remaining duplicate helper definitions; zero stale seam-count doc references | `rg -n "function readContinuationEntries|function restoreEnv"`, `rg -n "[0-9]+ seams"` |
| Manual | Diff review of the two pre-extraction helper copies before merging | Direct file read |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 016 (plugin-correctness-fixes) | Internal, same-file sequencing | Must be complete before this phase starts | New regression tests from 016 must exist first, or they get restructured twice |
| Phase 017 (hot-path-optimization) | Internal, same-file sequencing | Must be complete before this phase starts | New fs-spy tests from 017 must exist first, or they get restructured twice |
| Phase 019 (code-refinements) | Internal, sequencing | Runs after this phase; not a blocker for 018 | None - 019 refactors production code against the now-restructured test suite |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any converted file's subtest count is lower than its pre-conversion scenario enumeration, or any previously-passing assertion now fails/is silently skipped
- **Procedure**: Revert the specific test file via targeted `git checkout` to its pre-conversion state; each of the 6 file conversions is independently revertible without affecting the others
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:sequencing -->
## 8. SEQUENCING

Part of the serial chain **016 → 017 → 018 (this phase) → 019**, all touching shared files under `.opencode/plugins/`. This phase specifically must run AFTER 016 and 017 land, because both of those phases add new regression tests (F1-F12 fixes in 016, fs-spy tests in 017) to the same 6 files this phase restructures — converting before they land would mean redoing the subtest conversion for their additions. Land 018 with a fresh green full-suite run before 019 begins its refactor against the now-restructured test files.
<!-- /ANCHOR:sequencing -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
