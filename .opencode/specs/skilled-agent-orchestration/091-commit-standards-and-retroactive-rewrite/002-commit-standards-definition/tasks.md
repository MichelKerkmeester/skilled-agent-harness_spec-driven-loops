---
title: "Phase 002 Tasks: Commit Standards Definition"
description: "Checkbox tasks for Sequential-Thinking-driven standards definition and 20-sample validation."
trigger_phrases:
  - "112-commit-standards-definition tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/091-commit-standards-and-retroactive-rewrite/002-commit-standards-definition"
    last_updated_at: "2026-05-16T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored phase 002 tasks"
    next_safe_action: "Run sampling commands then start Group A deliberation"
    blockers: []
    key_files:
      - "tasks.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-tasks-2026-05-16"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 002 — Commit Standards Definition

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`T### [P0/P1/P2] Description` — P0 = blocker, P1 = required, P2 = optional. Mark `[x]` with brief evidence inline.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T-001 [P0] Sample 20 random HEAD commits to `evidence/sample-20.txt`
- [ ] T-002 [P0] Sample 5 merge commits to `evidence/sample-merges.txt`
- [ ] T-003 [P0] Sample 5 Co-Authored-By commits to `evidence/sample-coauthor.txt`
- [ ] T-004 [P0] Sample 5 packet-ID-prefixed commits to `evidence/sample-packet-id.txt`
- [ ] T-005 [P1] Read sk-git SKILL §3, commit_message_template, commit_workflows, CONTRIBUTING.md
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Group A (Q1, Q7)
- [ ] T-010 [P0] Sequential Thinking session for Subject + Length (≥5 thoughts)
- [ ] T-011 [P0] Draft ADR-001 (subject format)
- [ ] T-012 [P0] Draft ADR-007 (length caps)

### Group B (Q2, Q3, Q4)
- [ ] T-020 [P0] Sequential Thinking session for Packet-ID + Co-Authored-By + Imperative-mood (≥7 thoughts)
- [ ] T-021 [P0] Draft ADR-002 (packet-ID prefix policy)
- [ ] T-022 [P0] Draft ADR-003 (Co-Authored-By merge rule)
- [ ] T-023 [P0] Draft ADR-004 (imperative-mood retroactive enforcement)

### Group C (Q5, Q6)
- [ ] T-030 [P0] Sequential Thinking session for Body + Special cases (≥5 thoughts)
- [ ] T-031 [P0] Draft ADR-005 (body policy when diff unrecoverable)
- [ ] T-032 [P0] Draft ADR-006 (merge / revert / fixup / release rules)

### Consolidation
- [ ] T-040 [P0] Write `commit-standards.md` with 5+ worked examples
- [ ] T-041 [P0] Write `derivation-heuristics.md` (algorithmic first-match rules)
- [ ] T-042 [P0] Cross-reference each commit-standards section to source ADR
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T-050 [P0] Rewrite each of the 20 sampled commits in `hand-sample-validation.md`
- [ ] T-051 [P0] Confirm 20/20 deterministic (zero underspecified); if any fail, iterate T-040/T-041
- [ ] T-052 [P0] Mark all 7 ADRs `Status: Accepted` with date
- [ ] T-053 [P0] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh ./002-commit-standards-definition --strict` exits 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- All P0 tasks `[x]`
- `commit-standards.md`, `derivation-heuristics.md`, `hand-sample-validation.md`, `decision-record.md` present and complete
- 20/20 sample deterministic
- `implementation-summary.md` updated with completion_pct=100
- Parent `graph-metadata.json` `derived.last_active_child_id` advanced to `003-…`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Plan: `plan.md`
- ADRs: `decision-record.md`
- Parent: `../spec.md`
- Predecessor: `../001-prerequisites-and-baseline/`
- Successor: `../003-sk-git-skill-update/`
<!-- /ANCHOR:cross-refs -->
