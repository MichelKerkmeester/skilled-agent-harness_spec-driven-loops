---
title: "Tasks: sk-code compliance and code README coverage audit"
description: "Task checklist for packet 026 README coverage and sk-code audit."
trigger_phrases:
  - "026 sk-code audit"
  - "code README coverage"
importance_tier: "high"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-extraction/026-sk-code-and-code-readme-audit"
    last_updated_at: "2026-05-15T11:40:19Z"
    last_updated_by: "codex"
    recent_action: "Task checklist aligned to manifest anchors"
    next_safe_action: "Run validation, commit, and push"
    blockers: []
    key_files:
      - "audit-report.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0260000000000000000000000000000000000000000000000000000000000000"
      session_id: "026-sk-code-and-code-readme-audit"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: sk-code compliance and code README coverage audit

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [x] T001 Create Level 3 packet structure in `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-extraction/026-sk-code-and-code-readme-audit`.
- [x] T002 Read sk-code operating manual and OpenCode references.
- [x] T003 [P] Read sk-doc README and asset templates.
- [x] T004 [P] Read prior packet 012 implementation summary and search for packet 015.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Audit first-party code-bearing folders across 19 skills.
- [x] T006 Create 47 missing code README files.
- [x] T007 Write `audit-report.md` with coverage matrix and sk-code findings.
- [x] T008 Update spec, plan, checklist, decision record, and implementation summary.
- [x] T009 Name deferred sk-code follow-on packets.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Rerun audit and confirm 97.4% README compliance.
- [x] T011 Run strict Spec Kit validation.
- [x] T012 Run sk-code alignment drift check for changed packet scope.
- [x] T013 Run sk-code alignment drift check across `.opencode/skills` and record warnings as deferred findings.
- [ ] T014 Stage scoped files only, commit, and push to origin/main.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 verification checks marked `[x]` with evidence.
- [x] No `[B]` blocked tasks remain.
- [x] README compliance target exceeded.
- [ ] Commit pushed to origin/main after staged scope review.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Checklist**: See `checklist.md`.
- **Audit Report**: See `audit-report.md`.
<!-- /ANCHOR:cross-refs -->
