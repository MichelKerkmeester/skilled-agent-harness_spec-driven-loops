---
title: "Feature Specification: Phase 18: test-architecture-restructure"
description: "All 6 goal-plugin test files are monolithic single-main() node:test scripts, so node --test reports 1 test per file and the first assertion failure masks roughly 50 downstream scenarios; the export-contract test also needs its seam-count narrative reconciled to 16 (phase 016 added fsyncDirectory, growing it from 15), correcting stale claims of 14 or 15."
trigger_phrases:
  - "goal plugin test architecture restructure"
  - "node test subtests conversion"
  - "export contract seam count reconciliation"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/032-goal-opencode-plugin/018-test-architecture-restructure"
    last_updated_at: "2026-07-03T07:30:49Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored spec from four-reviewer audit dossier TEST-1/TEST-2/e-2.10/e-2.11 items"
    next_safe_action: "Await phases 016 and 017 to land, then author plan.md phase sequencing detail"
    blockers: []
    key_files:
      - ".opencode/plugins/tests/mk-goal-continuation.test.cjs"
      - ".opencode/plugins/tests/mk-goal-lifecycle.test.cjs"
      - ".opencode/plugins/tests/mk-goal-state.test.cjs"
      - ".opencode/plugins/tests/mk-goal-tool-path.test.cjs"
      - ".opencode/plugins/tests/mk-goal-supervisor.test.cjs"
      - ".opencode/plugins/tests/mk-goal-export-contract.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "032-phase-018-test-architecture-restructure-20260703"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 18: test-architecture-restructure

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-03 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Phase** | 18 |
| **Predecessor** | 017-hot-path-optimization |
| **Successor** | 019-code-refinements |
| **Handoff Criteria** | All 6 goal-plugin test files converted to `node:test` subtests with `node --test` reporting per-scenario pass/fail counts; shared continuation/lifecycle test helpers extracted; export-contract test's seam-count narrative reconciled to 16 (post-phase-016, was 14/15 in stale docs); full suite green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 18** of the Goal plugin review remediation: behavior-preserving test-architecture restructuring for `.opencode/plugins/tests/`, sourced from the four-reviewer audit dossier (`../scratch/2026-07-03-four-reviewer-audit-findings.md`, sections A "Test-architecture findings" and B "e-2 Refinements" items 10-11).

**Scope Boundary**: Test files only (`.opencode/plugins/tests/mk-goal-*.test.cjs`) plus a new shared test-helpers module. No `mk-goal.js` production-code behavior changes except exposing a `__test` seam if one is genuinely missing (none identified so far). Runs after phases 016 and 017 land, so the new regression tests those phases add get restructured into subtests exactly once instead of twice.

**Dependencies**:
- Phases 016 (plugin-correctness-fixes) and 017 (hot-path-optimization) must both be complete and green before this phase starts.

**Deliverables**:
- All 6 goal-plugin test files (`mk-goal-continuation`, `mk-goal-export-contract`, `mk-goal-lifecycle`, `mk-goal-state`, `mk-goal-supervisor`, `mk-goal-tool-path`) converted from single-`main()` scripts to `node:test` `describe`/`test` subtests, one subtest per scenario (TEST-1)
- A shared `tests/helpers` module holding `readContinuationEntries`/`restoreEnv`, deduplicating the copies in `mk-goal-continuation.test.cjs:14-30` and `mk-goal-lifecycle.test.cjs:23-59` (e-2.11)
- `mk-goal-export-contract.test.cjs`'s `deepEqual` pin reconciled: confirm it already asserts all 16 live `__test` seam names (grew from 15 to 16 when phase 016 added `fsyncDirectory`), and correct any packet-narrative doc still carrying stale lower seam-count wording (TEST-2)
- (e-2.10 is this phase's overall subtest-conversion deliverable, not a separate item)

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
All 6 goal-plugin test files under `.opencode/plugins/tests/` are monolithic single-`async function main()` scripts (confirmed: `mk-goal-continuation.test.cjs:42`, `mk-goal-export-contract.test.cjs:12`, `mk-goal-lifecycle.test.cjs:14`, `mk-goal-state.test.cjs:14`, `mk-goal-supervisor.test.cjs:26`, `mk-goal-tool-path.test.cjs:18`), so `node --test` reports exactly 1 test per file; the first `assert` failure inside `main()` throws and aborts the whole file, masking roughly 50 downstream scenarios per file. Separately, `mk-goal-continuation.test.cjs` and `mk-goal-lifecycle.test.cjs` each define their own copy of `readContinuationEntries`/`restoreEnv` (e-2.11), and the export-contract test's `deepEqual` pin (already listing all 16 live `__test` seam names as of phase 016's `fsyncDirectory` addition, confirmed at `mk-goal-export-contract.test.cjs:18-35` against `mk-goal.js:2198-2214`) needs its packet-narrative cross-references reconciled where they still carry stale lower seam-count wording (TEST-2).

### Purpose
Every scenario in the 6 goal-plugin test files reports as its own `node:test` subtest, so a single broken scenario fails only that subtest while every other scenario in the file still runs and reports; shared test helpers live in one place; and the export-contract's seam count is correctly and consistently documented at 16 everywhere.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Convert `mk-goal-continuation.test.cjs` to `node:test` subtests (TEST-1)
- Convert `mk-goal-export-contract.test.cjs` to `node:test` subtests (TEST-1)
- Convert `mk-goal-lifecycle.test.cjs` to `node:test` subtests (TEST-1)
- Convert `mk-goal-state.test.cjs` to `node:test` subtests (TEST-1)
- Convert `mk-goal-supervisor.test.cjs` to `node:test` subtests (TEST-1)
- Convert `mk-goal-tool-path.test.cjs` to `node:test` subtests (TEST-1)
- Extract shared `readContinuationEntries`/`restoreEnv` helpers into one `tests/helpers` module (e-2.11)
- Reconcile the export-contract's 16-seam `deepEqual` pin against any stale lower seam-count narrative reference (TEST-2)

### Out of Scope
- `mk-deep-loop-guard.test.cjs` and `mk-dist-freshness-guard.test.cjs` - not goal-plugin tests, not part of this dossier's TEST-1/TEST-2 findings
- Any `mk-goal.js` production-code behavior change - this phase touches test files and a shared test-helper module only
- New test scenarios beyond what already exists (that is phases 016/017/019's job, landing before this phase runs) - this phase restructures existing scenarios, it does not add new coverage
- Performance optimization of `mk-goal.js` - owned by phase 017
- Code refinements inside `mk-goal.js` - owned by phase 019

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/plugins/tests/mk-goal-continuation.test.cjs` | Modify | Convert to `node:test` subtests; use shared helpers module |
| `.opencode/plugins/tests/mk-goal-export-contract.test.cjs` | Modify | Convert to `node:test` subtests; confirm/keep the 16-name `deepEqual` pin |
| `.opencode/plugins/tests/mk-goal-lifecycle.test.cjs` | Modify | Convert to `node:test` subtests; use shared helpers module |
| `.opencode/plugins/tests/mk-goal-state.test.cjs` | Modify | Convert to `node:test` subtests |
| `.opencode/plugins/tests/mk-goal-supervisor.test.cjs` | Modify | Convert to `node:test` subtests |
| `.opencode/plugins/tests/mk-goal-tool-path.test.cjs` | Modify | Convert to `node:test` subtests |
| `.opencode/plugins/tests/helpers/` (new module) | Create | Shared `readContinuationEntries`/`restoreEnv` used by continuation and lifecycle tests |
| Packet doc(s) carrying stale lower seam-count wording | Modify | Correct to 16, matching the live `__test` export and the existing test pin |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | TEST-1: All 6 goal-plugin test files run as `node:test` subtests, one subtest per existing scenario, behavior-preserving | `node --test .opencode/plugins/tests/mk-goal-*.test.cjs` reports a subtest count per file greater than 1 (matching the number of distinct scenarios previously sequential inside `main()`); every previously-passing assertion still passes |
| REQ-002 | TEST-1: A single intentionally-broken scenario fails only its own subtest, not the whole file | Introducing one deliberate assertion failure in one scenario (verified during implementation, then reverted) causes `node --test` to report exactly that one subtest as failed while every other subtest in the same file still reports pass |
| REQ-003 | TEST-2: The export-contract test's `deepEqual` pin lists all 16 live `__test` seam names, and no packet doc contradicts this with a stale lower seam-count claim | `mk-goal-export-contract.test.cjs`'s pinned array matches `Object.keys(pluginModule.default.__test).sort()` from the live `mk-goal.js:2198-2214` (16 names); `rg -n "[0-9]+ seams"` across the packet's spec docs shows only "16 seams" after the fix |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | e-2.11: `readContinuationEntries`/`restoreEnv` are defined once in a shared helpers module, not duplicated in `mk-goal-continuation.test.cjs:14-30` and `mk-goal-lifecycle.test.cjs:23-59` | `rg -n "function readContinuationEntries|function restoreEnv" .opencode/plugins/tests/` shows each function defined exactly once (in the shared module), with both test files importing it |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .opencode/plugins/tests/mk-goal-*.test.cjs` reports subtest-level pass/fail counts for all 6 goal-plugin files, not 1 test per file
- **SC-002**: A deliberately broken single scenario (tested during implementation, then reverted) fails only that subtest; all other scenarios in the same file still report and pass
- **SC-003**: `readContinuationEntries`/`restoreEnv` exist in exactly one shared location; the export-contract's 16-seam pin is correct and consistently referenced across packet docs
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 016 and 017 must both land first (shared-file sequencing) | High - restructuring test files while new tests are still being added in 016/017 means redoing the conversion | Do not start until both 016 and 017 tasks.md show all tasks `[x]` and a fresh full-suite run is green |
| Risk | Subtest conversion accidentally changes evaluation order and exposes a latent test interdependency (e.g. shared `tmpdir` state, `process.env` mutation leaking between subtests) | Medium - flaky or falsely-passing subtests | Each subtest gets its own `mkdtemp` state dir and its own `restoreEnv` cleanup in a `finally`/`afterEach`, matching the isolation the monolithic scripts already relied on |
| Risk | Extracting shared helpers introduces a subtle behavior difference between the two prior copies (e.g. different error handling on ENOENT) | Low - dossier confirms both copies are structurally identical | Diff the two existing implementations before extracting; keep the union of any differing error handling, verified by both call sites' existing tests staying green |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. TEST-1, TEST-2, e-2.10, and e-2.11 are all restructuring/reconciliation work with clear remedy shapes; no design decision is required.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Finding source**: `../scratch/2026-07-03-four-reviewer-audit-findings.md`, section A "Test-architecture findings" (TEST-1, TEST-2) and section B "e-2 Refinements" (items 10, 11)
- **Predecessors**: `../016-plugin-correctness-fixes/`, `../017-hot-path-optimization/` (both land before this phase)
<!-- /ANCHOR:cross-refs -->
