---
title: "Tasks: Dead Code, Legacy Artifact and Architecture Simplification Audit"
description: "Task breakdown for the twenty-pass research program, the verification and synthesis stage, and phase close."
trigger_phrases:
  - "dead code audit tasks"
  - "release cleanup 016 tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-release-cleanup/016-dead-code-and-architecture-audit"
    last_updated_at: "2026-07-27T05:50:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored the task breakdown"
    next_safe_action: "Execute the pre-flight tasks"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-028-016-dead-code-audit"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Dead Code, Legacy Artifact and Architecture Simplification Audit

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

> Pre-flight: executor auth, baseline, and the manual-pass focus list.

- [ ] T001 Confirm `cli-opencode` OpenAI GPT-5.6 catalog auth (`opencode providers list`)
- [ ] T002 [P] Confirm `cursor-agent` auth and that `composer-2.5-fast` is listed
- [ ] T003 [P] Confirm `command -v devin` succeeds and the self-invocation guard is clear
- [ ] T004 Record the recovery-baseline commit hash and confirm a clean or committed working tree
- [ ] T005 Declare the five distinct manual-pass focuses before any Devin dispatch
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> Twenty research passes, then verification and synthesis.

- [ ] T006 Bind the research topic and the six category prompts from `spec.md` section 3 (`research/`)
- [ ] T007 Dispatch the fan-out: L1 `cli-opencode` `openai/gpt-5.6-sol` effort high 10 passes, L2 `cli-cursor` `composer-2.5-fast` 5 passes, divergent + max-iterations
- [ ] T008 Check each lineage at its first iteration boundary for real state output rather than a stall
- [ ] T009 Run the five `cli-devin` `glm` passes one at a time, each with its pre-declared focus (`research/manual-devin/`)
- [ ] T010 Confirm no lineage exited on early convergence and no manual pass was skipped

### Verification and synthesis

- [ ] T011 Path-check every candidate finding against the working tree; drop what does not exist
- [ ] T012 Attach a reproducible verification command to every CAT-1 through CAT-4 candidate
- [ ] T013 Run the dynamic-reference check (string-literal search) for each dead-code candidate
- [ ] T014 Deduplicate across passes and record cross-pass disagreements explicitly
- [ ] T015 Rank findings by remediation value against blast radius
- [ ] T016 Write `findings-report.md` covering all six categories
- [ ] T017 Write the audit closeout and remediation handoff (`implementation-summary.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

> Containment proof and phase close.

- [ ] T018 Confirm `git status --porcelain` shows changes only under this spec folder
- [ ] T019 Run `validate.sh --strict` on this folder and record the exit code
- [ ] T020 Update the parent phase map row and mark checklist items with evidence
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Every checklist item in `checklist.md` carries evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
