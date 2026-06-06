---
title: "Tasks: 003 — Planner Reviewer-Focus & Spec-Drift Hint"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "027 phase 006/003"
  - "reviewer focus advisory field"
  - "spec drift write-back"
  - "self_assessed_quality hint"
  - "planner review focus drift"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/006-gem-team-adoption/003-planner-review-focus-and-drift-hint"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded 003 advisory fields from 007 P3 + 009"
    next_safe_action: "Land 001 envelope, then add reviewer_focus + spec_drift"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-027-003-planner-focus-drift-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: 003 — Planner Reviewer-Focus & Spec-Drift Hint

<!-- SPECKIT_LEVEL: 1 -->
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

- [ ] T001 [B] Confirm child 001's agent-IO envelope is landed; read its `advisory` field group.
- [ ] T002 Re-read the five target surfaces (`orchestrate.md`, `review.md`, `code.md`, `commands/memory/save.md`, `generate-context.ts`) and the current Logic-Sync wording.
- [ ] T003 Confirm the existing `quality_score` usage in the save path to lock the `self_assessed_quality` name (no collision).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add optional `reviewer_focus` (+ `self_assessed_quality`) dispatch field and consume it on output review (`.opencode/agents/orchestrate.md`).
- [ ] T005 Accept `reviewer_focus` to prioritize reads/evidence; keep threshold and evidence requirement intact (`.opencode/agents/review.md`).
- [ ] T006 Add optional `spec_drift` / `update_recommended` block in the §8 RETURN body, not the first-line escalation enum (`.opencode/agents/code.md`).
- [ ] T007 Document the drift destination = `handover.md` (`.opencode/commands/memory/save.md`).
- [ ] T008 Add optional `specDrift` / `reviewerFocus` JSON keys; tolerate absence (`.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Verify no `reviewer_focus` ⇒ `@review` derives scope from target/files (SC-001); no `spec_drift` ⇒ save records `spec_drift: none` (SC-002).
- [ ] T010 Verify a spec/code contradiction still halts via Logic-Sync, unsoftened by `spec_drift` (SC-003); confirm continuity schema unchanged.
- [ ] T011 Verify a supplied `reviewer_focus` steers attention without threshold change or evidence-free finding (SC-004), and a supplied `spec_drift` rationale lands in `handover.md` (SC-005).
- [ ] T012 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/system-spec-kit/027-xce-research-based-refinement/006-gem-team-adoption/003-planner-review-focus-and-drift-hint --strict`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source Proposal**: `../research/007-gem-team-adoption-matrix/sub-packet-proposals.md` (P3)
- **Integration Impact**: `../research/009-gem-team-integration-impact/research.md` (§2 matrix, iter 003)
- **Dependency**: `../001-typed-agent-io-adapter/spec.md`
<!-- /ANCHOR:cross-refs -->
