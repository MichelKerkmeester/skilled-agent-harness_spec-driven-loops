---
title: "Plan: system-code-graph Vitest Suite Triage"
description: "Concrete triage plan for closing the system-code-graph broader Vitest baseline."
trigger_phrases:
  - "system-code-graph-suite-triage"
  - "009 phase 011"
  - "code-graph 31 failures triage"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/011-system-code-graph-suite-triage"
    last_updated_at: "2026-05-22T15:53:50Z"
    last_updated_by: "codex"
    recent_action: "completed-arc-009-phase-011-system-code-graph-suite-triage"
    next_safe_action: "start-arc-009-phase-012-rss-benchmark"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0a01010101010101010101010101010101010101010101010101010101010101"
      session_id: "009-memory-leak-remediation-011"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Source baseline documented in arc 009 phase 007 implementation-summary.md."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: system-code-graph Vitest Suite Triage

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js, Vitest |
| **Framework** | system-code-graph MCP server verification |
| **Storage** | Spec Kit phase documentation and test evidence |
| **Testing** | `node node_modules/vitest/vitest.mjs run --config vitest.config.ts` from `.opencode/skills/system-code-graph` |

### Overview
This phase closes the arc 009 phase 007 broader-suite baseline by reproducing the current `system-code-graph` Vitest failures, classifying each pre-existing failing test, and applying the smallest acceptable outcome: fix, skip with explicit triage reason, delete obsolete assertions, or quarantine with a follow-on packet pointer.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Read the parent arc spec, child phase spec, and arc 009 phase 007 source baseline.
- [x] Read the listed failing test files that still exist in the workspace; `walker-dos-caps.vitest.ts` is absent and must be reconciled against the live baseline.
- [x] Reproduce the current failing-test inventory before implementation.
- [x] Confirm the triage output format for implementation-summary evidence.

### Definition of Done
- [x] Every listed failing test has a recorded classification.
- [x] Any skipped or quarantined test includes rationale and a follow-on pointer.
- [x] Verification evidence is recorded in `implementation-summary.md`.
- [x] The broader `system-code-graph` Vitest suite exits 0.
- [x] Typecheck exits 0.
- [x] This phase, parent arc, and source phase 007 strict validation pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Triage Contract

The source baseline is the arc 009 phase 007 Limitations entry: 12 files / 31 tests outside launcher and DB lifecycle scope. The current workspace is authoritative for execution, so the first implementation step is to capture a fresh suite baseline into `scratch/baseline-failures.md` and reconcile any stale inventory names.

Classification rules:

| Outcome | Use When | Required Action |
|---------|----------|-----------------|
| FIX | The assertion is still valid and the target behavior is wrong or mocks are stale against intended behavior. | Apply the smallest test or product-code change, then run the affected test file. |
| SKIP | The behavior legitimately changed and there is no follow-on work needed. | Use `.skip("triage: <reason> -- no follow-on planned")`; record rationale. |
| DELETE | The test asserts dead or removed behavior. | Delete the obsolete test or file; do not comment it out or archive it. |
| QUARANTINE | The failure exposes a real gap needing a separate packet. | Use `.skip("triage: <reason> -- <follow-on packet pointer>")`; record limitation. |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/system-code-graph/mcp_server/tests/` | Broader code-graph Vitest coverage | Triage failures and apply scoped fixes, documented skips, or deletes | Targeted and broader Vitest commands |
| `.opencode/skills/system-code-graph/mcp_server/` | Product code under test | Modify only when triage proves a real product bug | Focused tests for the changed surface |
| `.opencode/specs/.../001-system-code-graph-suite-triage/` | Phase evidence ledger | Record baseline, plan, task status, triage outcomes, and final validation | Strict spec validation |
| `.opencode/specs/.../009-memory-leak-remediation/007-code-graph-launcher-and-db-lifecycle/implementation-summary.md` | Source baseline closure note | Append closure note to Limitations anchor | Strict spec validation |
| `.opencode/specs/.../009-memory-leak-remediation/spec.md` | Parent phase status | Mark phase 001 completed and update completion percentage 33 -> 67 | Strict spec validation |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Baseline and Planning
- [x] Read the parent arc spec, child phase spec, and arc 009 phase 007 baseline.
- [x] Read the listed test files and identify stale/missing inventory paths.
- [x] Run the broader suite and write exact failure list to `scratch/baseline-failures.md`.
- [x] Replace scaffold placeholders in `plan.md` and `tasks.md` with this concrete triage plan.
- [x] Strict-validate the phase folder after authored plan/task writes.

### Phase 2: Per-Test Triage
- [x] For each failing test, read the assertion target source before editing.
- [x] Classify each failure as FIX, SKIP, DELETE, or QUARANTINE.
- [x] Apply scoped fixes, skips, or deletions with no unrelated cleanup.
- [x] Run the affected test file after each fix/skip/delete batch.

### Phase 3: Verification
- [x] Run the broader suite: `node node_modules/vitest/vitest.mjs run --config vitest.config.ts`.
- [x] Run typecheck: `npm run typecheck`.
- [x] Run OpenCode alignment drift verification for changed `.opencode` scope.
- [x] Update `implementation-summary.md`.
- [x] Update arc 009 phase 007 Limitations and arc 009 parent status.
- [x] Strict-validate this phase, the parent arc, and arc 009 phase 007.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Baseline | Reproduce current broader suite failures | `cd .opencode/skills/system-code-graph && node node_modules/vitest/vitest.mjs run --config vitest.config.ts 2>&1 \| tee /tmp/code-graph-suite-baseline.log` |
| Targeted | Files changed by triage | `node node_modules/vitest/vitest.mjs run <test-file> --config vitest.config.ts` |
| Regression | Broader `system-code-graph` suite | `node node_modules/vitest/vitest.mjs run --config vitest.config.ts` |
| Static | TypeScript health | `npm run typecheck` |
| Drift | OpenCode alignment | `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-code-graph` and spec-doc scope as needed |
| Documentation | Phase and parent validation | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Arc 009 phase 007 implementation summary | Source evidence | Available | Required to recover the original failure inventory. |
| Broader `system-code-graph` Vitest suite | Verification | Pending phase execution | Required to determine current failure state. |
| `walker-dos-caps.vitest.ts` source inventory entry | Baseline reconciliation | Missing from current workspace | Must be recorded as stale inventory if absent from live suite output. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Triage changes hide failures without rationale, product fixes regress targeted tests, or verification cannot reproduce the intended baseline.
- **Procedure**: Revert only this phase's code and test edits, preserve the observed test output in `implementation-summary.md`, and return to the documented baseline for replanning.
<!-- /ANCHOR:rollback -->
