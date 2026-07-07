---
title: "Spec: Gate-3 Precedence and Validator"
description: "Phase 002 of packet 035 (unified command-contract architecture). The P0 fix: kill the most-replicated GPT failure — the Gate-3 spec-folder halt on autonomous command runs — with an autonomous-precedence bridge AND a concrete validateSpecFolderBinding() the satisfaction rule actually calls (plan-review GAP-16 blocker). Closes F-001/002/003/004/005/028/030/040. Absorbs plan-review gaps GAP-04/07/12/16/17/18/19/20/21/22/48/51."
trigger_phrases:
  - "035 phase 002"
  - "gate3 precedence validator"
  - "spec folder binding validator"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/031-deep-loop-gpt-reliability/006-reliability-fixes/002-gate3-precedence-and-validator"
    last_updated_at: "2026-07-03T16:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored: gate3 precedence + validator"
    next_safe_action: "Execute after 001; ship the validator with the bridge"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "035-002-restructure"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Gate-3 Precedence and Validator

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-03 |
| **Parent Packet** | ../ (035-gpt-reliability-fixes) |
| **Parent Spec** | ../spec.md |
| **Predecessor** | [../001-acceptance-and-rollout-foundation/spec.md](../001-acceptance-and-rollout-foundation/spec.md) |
| **Successor** | [../003-dispatch-receipts-and-progress/spec.md](../003-dispatch-receipts-and-progress/spec.md) |
| **Closes findings** | F-001, F-002, F-003, F-004, F-005, F-028, F-030, F-040 |
| **Effort** | L |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The Gate-3 spec-folder halt fires on autonomous command runs across every mode and both efforts — the most-replicated GPT failure. The 034 design added an autonomous-precedence bridge and a classifier `satisfiedBy`/`requiresGate3Prompt` API, but the plan-review found the whole safety guarantee rests on a `validated` boolean **no validator ever sets** (GAP-16 blocker): a literal executor passes `--spec-folder ../` with `validated:true` and skips the gate to any write. This phase ships the bridge with a concrete validator the rule calls, closes the surrounding safety holes, and migrates every existing classifier caller.

Findings closed: F-001, F-002, F-003, F-004, F-005, F-028, F-030, F-040. Absorbs plan-review GAP-04, GAP-07, GAP-12, GAP-16, GAP-17, GAP-18, GAP-19, GAP-20, GAP-21, GAP-22, GAP-48, GAP-51. The 034 iter-011 design is the reference; verify quoted current-text before applying.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:** the root policy Gate-3 + recovery sections; `gate-3-classifier.ts` + its tests; a new `validateSpecFolderBinding()`; the autonomous-execution-profile reference (delivered typed via the phase-003 contract, not as raw injected prelude); every existing `classifyPrompt` caller.

**Out of scope:** the presentation/render block and the executor-contract block (they land typed in the phase-003 compiled contract); dispatch receipts (phase 004).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001**: Add the autonomous-precedence bridge to the root policy Gate-3 section: a command declaring autonomous execution with a VALIDLY bound spec_folder has answered Gate 3; do not emit the generic A-E prompt (F-001, F-005, F-040 deliverable 1).
- **REQ-002**: Ship `validateSpecFolderBinding()` with a concrete, testable predicate the satisfaction rule CALLS (not trusts): path resolves under `.opencode/specs/` or `specs/`, exists, contains the mandatory metadata files, `spec.md` Status ≠ Deprecated/Superseded, and is a leaf — for a phase parent it resolves `last_active_child_id` or fails (GAP-16, GAP-21). Tests: out-of-tree `flags` path → not satisfied; ambiguous target-path → not satisfied.
- **REQ-003**: Extend the classifier to return `satisfiedBy`/`requiresGate3Prompt` with `executionMode`/`boundSpecFolder`/`commandContract` inputs (F-002, F-040 deliverable 2); the signature keeps `triggersGate3` and makes ctx optional, with a "ctx absent → satisfiedBy:null AND requiresGate3Prompt:true" backward-compat test.
- **REQ-004**: Enforce the write boundary (GAP-17): the rule requires a non-empty `writeBoundary`, returns it, and a runtime invariant re-opens Gate 3 on any write resolved outside it. Gate `prior_answer` satisfaction to interactive answers only, never an autonomous prebound folder re-tagged prior_answer (GAP-20). Add `:confirm` to the classifier vocabulary + an autonomous-confirm+bound test (GAP-22).
- **REQ-005**: Add a `/doctor`-style precedence line reconciling the router-commands clause with the autonomous bridge (GAP-19); add a 7th test for child-agent re-classify with `boundSpecFolder` present + `commandContract` propagated (GAP-18, GAP-12).
- **REQ-006**: Caller migration table + edits for every `classifyPrompt` caller: the 34 vitest cases, `gate3-corpus-runner.mjs`, and the two `speckit_implement_*` machine_contract refs (GAP-48).
- **REQ-007**: High reasoning effort is enforced as the dispatch-mode default (config point, not a reference), with a documented fallback where high is unavailable (F-004 note, GAP-04). Reclassify F-003 actionable: clarify the autonomous-YAML write mandate ("after Gate 3 is satisfied" / "writes go to the pre-bound spec_folder") (GAP-07).
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

1. The validator rejects out-of-tree, ambiguous, deprecated, metadata-missing, and bare-phase-parent bindings (unit-tested).
2. writeBoundary enforced; prior_answer mode-gated; `:confirm` and child-agent hand-off tested; `/doctor` precedence defined.
3. All 34+ callers migrated and green; backward-compat "ctx absent → re-halt" test passes.
4. High-effort default enforced for dispatch modes.

**Acceptance harness (033 cells):** RVB-008, RSB-008, ACB-004-med, IMB-004, IMB-005 flip from Gate-3 halt to autonomous execution (ACB-004 high-stall is phase 004). Ship behind the phase-001 feature flag.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk / Dependency | Handling |
|---|---|
| GAP-16 (blocker) — validator undefined | REQ-002 ships a concrete called predicate |
| GAP-17/20/21 — skip loopholes | writeBoundary enforced, prior_answer mode-gated, phase-parent resolved |
| GAP-48 — 34+ callers break | REQ-006 migration table + edits |
| GAP-12/18 — agent-file co-ownership / child re-halt | Gate-3 hoisted into the phase-003 contract; contract+boundSpecFolder propagated to children |
| GAP-51 — effort under-rated | Re-rated L; may split into 002a (root+bridge) / 002b (classifier+migration) at execution |
| Design drift from iter-011 | iter-011 is the reference; verify current text before applying |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether to physically split into 002a/002b is decided at execution based on the migration surface size.
<!-- /ANCHOR:questions -->
