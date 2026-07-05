---
title: "Deep-Improvement Candidate Accepted vs Canonical Shipped Split"
description: "The deep-improvement promote-candidate.cjs collapses candidate-accepted and canonical-shipped into one step; a gate failure leaves the canonical tree in an ambiguous state. Splitting these into two distinct steps with branch-preserved clean-failure semantics and rollback-candidate.cjs is needed."
trigger_phrases:
  - "accepted vs shipped deep improvement"
  - "promotion_blocked_branch_preserved"
  - "rollback candidate deep improvement"
  - "two-step promotion gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-improved/003-deep-loop-workflows/010-deep-improvement-accepted-vs-shipped"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Authored spec.md from research.md §5.2 (iter 46)"
    next_safe_action: "Split promote-candidate.cjs into accept and ship phases; create rollback-candidate.cjs"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/promote-candidate.cjs"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/references/shared/promotion_gate_contract.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-authoring-003-deep-loop-workflows"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Deep-Improvement Candidate Accepted vs Canonical Shipped Split

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 12 |
| **Predecessor** | 009-loop-quality-benchmark |
| **Successor** | 011-meta-loop-lane-d-packaging |
| **Handoff Criteria** | `promote-candidate.cjs` has two separately callable phases (accept, ship); gate failure emits `promotion_blocked_branch_preserved`; `rollback-candidate.cjs` restores canonical tree to pre-acceptance state |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the deep-loop-workflows recommendations.

**Scope Boundary**: Splitting accept from ship in the promotion flow; creating `rollback-candidate.cjs`. Full autopilot lifecycle (`:autopilot`/`--unattended` for speckit commands) belongs to the §5.3 system-spec-kit item.

**Dependencies**:
- 009-loop-quality-benchmark should be complete first so the `outcomeScoreDelta >= 0` gate from 009 can be wired into the accept phase

**Deliverables**:
- `promote-candidate.cjs`: explicit accept phase (verify + preserve in branch) and ship phase (clean-tree finalization + merge); phases are separately callable
- `rollback-candidate.cjs` (new): restores canonical tree to pre-acceptance state; scoped to candidate-queuing only
- `promotion_gate_contract.md` and `promotion_rules.md` updated with two-phase model
- `improvement_config.json` updated with branch-preservation policy fields
- `promotion_blocked_branch_preserved` event emitted on gate failure in either phase

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep-improvement `promote-candidate.cjs` collapses candidate acceptance (verified + preserved) and canonical shipping (overwrite/merge to canonical tree) into a single step. A gate failure in any part of that step leaves the canonical tree in an ambiguous state — partially overwritten with no rollback path, no `promotion_blocked_branch_preserved` event, and no preserved branch for post-mortem. Kasper-style auto-apply is not scoped to isolated worktrees.

### Purpose
Split candidate acceptance (verify + preserve in branch/worktree) from canonical shipping (clean-tree finalization + merge); gate failure in either phase emits `promotion_blocked_branch_preserved` and preserves the branch; `rollback-candidate.cjs` restores the canonical tree to the pre-acceptance state.

> **Reference evidence**: `external/loop-cli-main/.opencode/commands/ob-autopilot.md:13,54,74` (accepted vs shipped distinction); `external/kasper/src/agents-md.ts:51,128` (branch-preserved failure semantics); `external/kasper/src/agent-prompts.ts:194-216` (scoped rollback to candidate-queuing only). Research.md §5.2 + (iter 46).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `promote-candidate.cjs`: explicit accept phase (verify + preserve in branch) and ship phase (clean-tree finalization + merge); both phases are separately callable via a phase argument
- `rollback-candidate.cjs` (new): restores canonical tree to pre-acceptance state; scoped to candidate-queuing and isolated worktree only
- `promotion_gate_contract.md` and `promotion_rules.md` updated with two-phase model
- `improvement_config.json` updated: `branchPreservationPolicy` field (default: `preserve-on-failure`)
- `promotion_blocked_branch_preserved` JSONL event emitted on gate failure in either phase

### Out of Scope
- Full `:autopilot`/`--unattended` lifecycle for speckit commands — belongs to §5.3 system-spec-kit item
- Branch cleanup policy and auto-pruning of preserved branches (operational concern; separate follow-up)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/promote-candidate.cjs` | Modify | Split into accept phase + ship phase; both separately callable; `promotion_blocked_branch_preserved` on failure |
| `.opencode/skills/deep-loop-workflows/deep-improvement/references/shared/promotion_gate_contract.md` | Modify | Document two-phase model: accept = verify + preserve; ship = clean-tree finalization |
| `.opencode/skills/deep-loop-workflows/deep-improvement/references/shared/promotion_rules.md` | Modify | Update promotion rules for two-phase flow and branch-preservation policy |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/rollback-candidate.cjs` | Create | Restore canonical tree to pre-acceptance state; scoped to candidate-queuing |
| `.opencode/skills/deep-loop-workflows/deep-improvement/assets/improvement_config.json` | Modify | Add `branchPreservationPolicy` field (default: `preserve-on-failure`) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `promote-candidate.cjs` has two separately callable phases: accept (verify + preserve in branch) and ship (clean-tree finalization); gate failure in either phase emits `promotion_blocked_branch_preserved` and preserves the branch | Gate failure in the ship phase emits `promotion_blocked_branch_preserved` in JSONL; branch is preserved (not deleted); canonical tree is not left in a partially-overwritten state |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | `rollback-candidate.cjs` restores canonical tree to pre-acceptance state without losing the preserved branch; kasper auto-apply scoped to candidate-queuing/isolated-worktree only (not default) | `rollback-candidate.cjs` restores the canonical tree; the preserved branch remains accessible after rollback |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A gate failure in the ship phase emits `promotion_blocked_branch_preserved` in JSONL; the branch is preserved and the canonical tree is restored to its pre-acceptance state
- **SC-002**: `rollback-candidate.cjs` restores the canonical tree to the pre-acceptance state; the preserved branch is still accessible and contains the candidate changes
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Branch proliferation if rollback is not called and preserved branches accumulate | Med | Document a manual cleanup policy; auto-cleanup is a separate follow-up |
| Risk | Accept phase creating a branch without a corresponding ship phase could leave orphaned branches | Med | `improvement_config.json` cleanup TTL field (informational; not enforced in this phase) |
| Dependency | 009-loop-quality-benchmark `outcomeScoreDelta >= 0` gate should be wired into the accept phase | Low | Accept phase calls 009's gate check as a prerequisite; sequencing is by convention, not a hard blocker |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- How long should a preserved branch be kept before auto-cleanup is triggered (TTL)? Should this be in `improvement_config.json` or a separate cleanup policy doc?
- Should the accept phase require a worktree (full isolation) or is a branch sufficient? Kasper's scoped-to-worktree model vs. branch-only are both valid depending on conflict risk.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
