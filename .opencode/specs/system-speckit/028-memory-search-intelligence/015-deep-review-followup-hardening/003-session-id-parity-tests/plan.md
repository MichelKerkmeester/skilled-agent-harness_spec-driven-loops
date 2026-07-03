---
title: "Implementation Plan: Session-Id Parity Tests"
description: "Plan for the structural cross-mode parity vitest suite covering the session-id resolve contract."
trigger_phrases:
  - "parity tests plan"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/015-deep-review-followup-hardening/003-session-id-parity-tests"
    last_updated_at: "2026-07-03T10:01:10Z"
    last_updated_by: "opencode-gpt-5.5"
    recent_action: "Implemented parity tests"
    next_safe_action: "Use parity suite during future YAML edits"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/tests/unit/workflow-session-id-parity.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fable-032-003-parity-tests"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Session-Id Parity Tests

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript vitest in deep-loop-runtime |
| **Framework** | Structural YAML assertions + pure prompt-builder assertions |
| **Testing** | vitest (this child IS tests) |

### Overview
One new vitest file with two assertion groups: (a) per-mode structural checks over the three workflow YAML assets pinning the resolve-step contract and each mode's fallback; (b) prompt-emission checks that the fan-out builder includes the session_id line for all three loop types. Zero production changes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Contract shape fixed and live in all three YAMLs (verified 2026-07-02).

### Definition of Done
- [x] Suite green on current state.
- [x] Each injected drift class fails with a mode-naming message (verified via temporary mutations, restored).
- [x] Full deep-loop-runtime suite: 0 new failures.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Contract tests over configuration: parse the YAMLs structurally, walk to the init steps, assert the contract nodes; assert the runtime half through the exported prompt builder.

### Key Components
- **YAML loader**: package's existing YAML dependency (or minimal parse) reading the three assets from repo paths.
- **Contract walker**: locates `step_resolve_session_id` and the config-creation sessionId consumption per mode.
- **Prompt assertions**: `buildLoopPrompt` (exported from fanout-run.cjs or its lib) rendered per loop type.

### Data Flow
Repo YAML assets -> parse -> walk -> assertions. Loop-type params -> prompt builder -> string assertions.
<!-- /ANCHOR:architecture -->

---

## L3: AI Execution Protocol

### Pre-Task Checklist

- Read `spec.md`, `plan.md`, `tasks.md`, `decision-record.md`, and `checklist.md` before implementation.
- Load `sk-code` for OPENCODE TypeScript vitest standards.
- Keep writes inside the one test file and this child spec folder, except temporary drift-injection mutations that must be restored byte-clean.

### Execution Rules

| Rule | Handling |
|------|----------|
| Test-only scope | Do not modify production files permanently; use the YAML assets only as read targets and temporary negative-test fixtures. |
| Structural parsing | Prefer parsed or indentation-scoped structural reads; literal string checks are allowed only for contract tokens. |
| Failure messages | Every assertion that can fail on drift must name the mode and missing piece. |
| Verification | Run targeted parity tests, drift-red checks, restoration diff, full runtime suite, comment hygiene, alignment drift, and strict spec validation. |

### Status Reporting Format

Report completion with suite counts, drift-injection outcomes, final baseline failures, and the exact shipped file set.

### Blocked Task Protocol

If a production file cannot be restored cleanly, stop immediately and report the dirty path and last mutation. If the runtime suite has failures beyond the known two-file baseline after rerun, report BLOCKED rather than claiming completion.

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Locate the resolve step + config consumption in each of the three YAMLs; note structural paths.
- [x] Check how `buildLoopPrompt` is exported/importable for tests; note the three loop-type call shapes.

### Phase 2: Implementation
- [x] Write the per-mode structural assertions (step present; if_present bind; if_absent fallback per mode; session_id_init consumption).
- [x] Write the prompt-emission assertions for review/context/research.

### Phase 3: Verification
- [x] Green on current state; temporary drift injections (one per class, per mode sample) each fail with naming messages; restore.
- [x] Full suite verified against known baseline; docs + checklist evidence; implementation-summary.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Contract | Three YAMLs × four contract pieces | vitest |
| Unit | Prompt emission × three loop types | vitest |
| Meta | Drift-injection spot checks (temporary, restored) | manual during verification |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| None | — | — | Independent of all siblings |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Assertions prove too brittle in practice.
- **Procedure**: Delete the test file; no production surface touched.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Reason |
|-------|------------|--------|
| Phase 1 | None | Entry point |
| Phase 2 | Phase 1 | Structural paths inform assertions |
| Phase 3 | Phase 2 | Drift injection tests the tests |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Estimate | Basis |
|-------|----------|-------|
| Phase 1 | Small | Locations already known from the 2026-07-02 fix |
| Phase 2 | Small | One file, two assertion groups |
| Phase 3 | Small | Injection spot checks are mechanical |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

| Scenario | Detection | Action |
|----------|-----------|--------|
| YAML dependency unavailable in test env | Import failure | Fall back to targeted structural regex over raw text for the contract tokens only |
| Prompt builder not importable | Import failure | Test the builder through a thin require of the script module; if impossible, scope prompt assertions out with a documented reason |
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
three YAML assets --> parser --> contract walker --> per-mode assertions
fanout-run buildLoopPrompt --> rendered prompts --> emission assertions
```
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. Structural assertions (the core deliverable).
2. Drift-injection verification (proves the tests can fail).
3. Prompt-emission assertions.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Definition |
|-----------|------------|
| M1: Green on truth | Suite passes on the aligned current state |
| M2: Red on drift | Each injected drift class fails with a naming message |
| M3: Runtime half pinned | Prompt emission asserted for all three loop types |
<!-- /ANCHOR:milestones -->
