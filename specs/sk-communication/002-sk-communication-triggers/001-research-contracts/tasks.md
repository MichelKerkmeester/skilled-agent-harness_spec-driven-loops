---
title: "Tasks: Phase 1: research and contracts"
description: "Task list for verifying and recording the trigger-command contracts."
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-communication/002-sk-communication-triggers/001-research-contracts"
    last_updated_at: "2026-08-19T04:41:42Z"
    last_updated_by: "claude"
    recent_action: "Executed T-001 through T-007"
    next_safe_action: "Author the commands from the contracts"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-001-research-contracts"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: research and contracts

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` complete, `[ ]` open. Each task names its verification.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 Read the sk-communication SKILL and package map. Verified the projection pipeline and invariants.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-002 Verify the activation gate and opt-in sources (`src/config/enablement.ts`).
- [x] T-003 Verify the runnable entrypoint (`cli-output-wrapper`) and provider families.
- [x] T-004 Verify the rubric source (`COPY_EDITING_INSTRUCTION`), cli roster, authoring standard, and mirror model.
- [x] T-005 Verify the dispatch contract: devin installed/authed and `gemini-3-7-flash-high` in the allowlist.
- [x] T-006 Record findings in `research/research.md`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-007 Each load-bearing claim in `research/research.md` cites a file path or command.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All facts verified and recorded; the two commands can be designed from these contracts without further discovery.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Findings: `research/research.md`
- Parent: `../spec.md`
<!-- /ANCHOR:cross-refs -->
