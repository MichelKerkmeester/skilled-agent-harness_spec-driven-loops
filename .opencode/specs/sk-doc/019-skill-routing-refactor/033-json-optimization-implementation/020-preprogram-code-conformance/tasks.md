---
title: "Task Breakdown: Pre-Program Code Conformance"
description: "Tasks for pre-program code conformance."
trigger_phrases:
  - "pre-program conformance task breakdown"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/020-preprogram-code-conformance"
    last_updated_at: "2026-07-30T11:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored phase docs"
    next_safe_action: "Begin execution per plan.md"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/020-preprogram-code-conformance"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Task Breakdown: Pre-Program Code Conformance

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending, `[x]` complete with evidence; `T-nn` execution order.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T-01 Establish by line blame that all four findings predate this program's commit range
- [ ] T-02 Identify which two were already raised and closed by the earlier review
- [ ] T-03 Confirm the repository's hygiene tool currently passes the flagged comment, establishing the doctrine-versus-gate gap
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T-04 Replace the ephemeral label with the durable reason the check exists
- [ ] T-05 Move the strict-mode directive to immediately follow the boxed header
- [ ] T-06 Add the containment guard to hub manifest generation, matching the standalone path's existing semantics
- [ ] T-07 Add JSDoc to the exported functions the audit named, without expanding into a directory-wide sweep
- [ ] T-08 Record the pre-program provenance and refer the doctrine-versus-gate divergence to the gate's owner
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T-09 Run the hygiene tool and confirm it stays clean
- [ ] T-10 Run a test supplying a path that escapes the skill root and confirm it is rejected
- [ ] T-11 Run manifest generation across every hub and confirm no previously-valid path is now refused
- [ ] T-12 Confirm the module's existing suite still passes after the directive move
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The flagged comment keeps its durable reason without the ephemeral label and the hygiene tool stays clean; the strict-mode directive sits where the style guide requires with behaviour unchanged; manifest generation rejects a path escaping the skill root, proven by a test that supplies one; the named exports carry JSDoc; provenance is recorded with evidence; and the doctrine-versus-gate divergence is referred in writing.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` — requirements and acceptance criteria
- `plan.md` — architecture, sequencing and rollback
- `../spec.md` — parent program
<!-- /ANCHOR:cross-refs -->
