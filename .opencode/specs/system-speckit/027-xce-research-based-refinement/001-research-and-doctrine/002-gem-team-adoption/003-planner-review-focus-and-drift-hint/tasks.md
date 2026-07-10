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
    packet_pointer: "system-speckit/027-xce-research-based-refinement/001-research-and-doctrine/002-gem-team-adoption/003-planner-review-focus-and-drift-hint"
    last_updated_at: "2026-06-10T06:30:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Added advisory focus and drift fields"
    next_safe_action: "Use hints only when useful; keep them optional"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-027-003-planner-focus-drift-scaffold"
      parent_session_id: null
    completion_pct: 100
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

- [x] T001 Confirm child 001's agent-IO envelope is landed; read its `advisory` field group. Evidence: contract advisory placeholder and child 001 scope reviewed.
- [x] T002 Re-read the five target surfaces (`orchestrate.md`, `review.md`, `code.md`, `commands/memory/save.md`, `generate-context.ts`) and the current Logic-Sync wording. Evidence: target reads plus AGENTS.md Logic-Sync check.
- [x] T003 Confirm the existing `quality_score` usage in the save path to lock the `self_assessed_quality` name (no collision). Evidence: repository search found existing `quality_score` memory-save/index usage; new field uses `self_assessed_quality` only.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add optional `reviewer_focus` (+ `self_assessed_quality`) dispatch field and consume it on output review (`.opencode/agents/orchestrate.md`). Evidence: mirrored orchestrator dispatch header and output-review checklist updated.
- [x] T005 Accept `reviewer_focus` to prioritize reads/evidence; keep threshold and evidence requirement intact (`.opencode/agents/review.md`). Evidence: mirrored review agents state focus is attention-ordering only and never evidence or threshold.
- [x] T006 Add optional `spec_drift` / `update_recommended` block in the §8 RETURN body, not the first-line escalation enum (`.opencode/agents/code.md`). Evidence: mirrored code agents add the block after native RETURN body fields; first-line enum unchanged.
- [x] T007 Document the drift destination = `handover.md` (`.opencode/commands/memory/save.md`). Evidence: `/memory:save` JSON guidance routes `specDrift` to handover planning context without auto-mutation.
- [x] T008 Add optional `specDrift` / `reviewerFocus` JSON keys; tolerate absence (`.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts`). Evidence: help text documents optional keys; structured JSON parser remains open and absence-tolerant.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Verify no `reviewer_focus` ⇒ `@review` derives scope from target/files (SC-001); no `spec_drift` ⇒ save records `spec_drift: none` (SC-002). Evidence: review and contract rules explicitly define missing hints as current behavior / none.
- [x] T010 Verify a spec/code contradiction still halts via Logic-Sync, unsoftened by `spec_drift` (SC-003); confirm continuity schema unchanged. Evidence: AGENTS.md and @code LOGIC_SYNC lines retained; no continuity schema files changed.
- [x] T011 Verify a supplied `reviewer_focus` steers attention without threshold change or evidence-free finding (SC-004), and a supplied `spec_drift` rationale lands in `handover.md` (SC-005). Evidence: @review advisory rule and `/memory:save` handover routing text updated.
- [x] T012 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/002-gem-team-adoption/003-planner-review-focus-and-drift-hint --strict`. Evidence: final validation passed with exit 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
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
