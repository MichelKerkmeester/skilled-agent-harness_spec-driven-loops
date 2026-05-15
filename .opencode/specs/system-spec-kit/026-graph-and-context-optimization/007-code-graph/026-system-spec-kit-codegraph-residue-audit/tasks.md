---
title: "Tasks: System Spec Kit Codegraph Residue Audit"
description: "Task list for auditing and cleaning stale code-graph references from system-spec-kit user-facing docs after packet 014."
trigger_phrases:
  - "012 codegraph residue audit tasks"
  - "system spec kit code graph cleanup tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/026-system-spec-kit-codegraph-residue-audit"
    last_updated_at: "2026-05-14T17:35:44Z"
    last_updated_by: "cli-codex-gpt5.5-xhigh-fast-012"
    recent_action: "Completed audit and cleanup tasks; git staging blocked by sandbox"
    next_safe_action: "Stage and commit the scoped 012 changes when git index writes are permitted"
    blockers:
      - "Sandbox denied git index lock creation during staging: .git/index.lock Operation not permitted"
    key_files:
      - ".opencode/skills/system-spec-kit/SKILL.md"
      - ".opencode/skills/system-spec-kit/README.md"
      - ".opencode/skills/system-spec-kit/ARCHITECTURE.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-14-012-system-spec-kit-codegraph-residue-audit"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: System Spec Kit Codegraph Residue Audit

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Confirm pre-check found no existing `012-*` folder.
- [x] T002 Confirm current branch is `main`.
- [x] T003 Run scoped raw grep across system-spec-kit user-facing markdown docs.
- [x] T004 Classify findings into STALE_REMOVE, STALE_REWRITE, LEGITIMATE_HISTORICAL, and LEGITIMATE_CROSS_SKILL.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Scaffold the 012 Level 1 packet.
- [x] T006 Rewrite root skill docs to describe Code Graph as sibling-skill integration.
- [x] T007 Rewrite stale feature catalog package paths to `.opencode/skills/system-code-graph/`.
- [x] T008 Rewrite stale manual testing package and DB paths to `.opencode/skills/system-code-graph/`.
- [x] T009 Preserve legitimate historical and cross-skill references.
- [x] T010 Restore unrelated Skill Advisor catalog/playbook files after self-check caught unrelated deletions.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Re-run stale-residue grep and confirm no matches in scoped markdown docs.
- [x] T012 Confirm no system-code-graph files were modified by this packet.
- [x] T013 Run strict validation on the 012 packet.
- [B] T014 Stage only the 012 packet and scoped system-spec-kit doc edits. Blocked by sandbox denial when creating `.git/index.lock`.
- [B] T015 Commit on `main` with the requested commit message. Blocked because staging failed.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [B] Git staging and commit blocked by sandbox index-lock permissions.
- [x] Stale-residue verification passed.
- [x] Strict packet validation passed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
