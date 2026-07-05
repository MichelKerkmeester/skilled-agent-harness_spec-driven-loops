---
title: "Implementation Plan: Deep-Improvement Candidate Accepted vs Canonical Shipped Split"
description: "Documents the completed two-phase candidate promotion and rollback work for deep improvement."
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
    last_updated_at: "2026-07-01T22:20:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold content with spec-grounded complete info"
    next_safe_action: "Regenerate metadata and run recursive strict validation"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/promote-candidate.cjs"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/references/shared/promotion_gate_contract.md"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/references/shared/promotion_rules.md"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/rollback-candidate.cjs"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/assets/improvement_config.json"
    session_dedup:
      fingerprint: "sha256:1111111111111111111111111111111111111111111111111111111111111111"
      session_id: "scaffold-content-remediation-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Deep-Improvement Candidate Accepted vs Canonical Shipped Split

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | OpenCode deep-improvement JavaScript promotion scripts, JSON config, markdown contracts |
| **Framework** | `deep-loop-workflows` deep-improvement candidate promotion lifecycle |
| **Storage** | Candidate branch/worktree state, promotion JSONL events, rollback script state |
| **Testing** | Gate-failure preservation checks and rollback restoration checks |

### Overview
This completed work split candidate acceptance from canonical shipping in the deep-improvement promotion flow. Gate failures preserve the candidate branch, emit `promotion_blocked_branch_preserved`, and leave the canonical tree recoverable through `rollback-candidate.cjs`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Score-delta gate from leaf 009 is available for acceptance checks.
- [x] Single-step promotion risk is documented.
- [x] Full speckit unattended autopilot lifecycle remains out of scope.

### Definition of Done
- [x] `promote-candidate.cjs` exposes separate accept and ship phases.
- [x] Gate failures emit `promotion_blocked_branch_preserved`.
- [x] Candidate branch is preserved on failure.
- [x] `rollback-candidate.cjs` restores the canonical tree without losing the preserved branch.
- [x] Promotion contracts and config document branch preservation policy.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two-phase promotion with clean failure semantics: accept verifies and preserves, ship finalizes only from a clean tree, and rollback restores canonical state when promotion cannot complete.

### Key Components
- **`promote-candidate.cjs`**: Implements separately callable accept and ship phases.
- **`rollback-candidate.cjs`**: Restores canonical tree to pre-acceptance state.
- **`promotion_gate_contract.md` and `promotion_rules.md`**: Document the two-phase contract.
- **`improvement_config.json`**: Records `branchPreservationPolicy` defaulting to preserve-on-failure.

### Data Flow
Candidate changes enter the accept phase for verification and branch preservation, the ship phase finalizes only when gates pass, and any failure emits a preservation event. Rollback operates on the canonical tree while keeping the preserved branch available for post-mortem or retry.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Promotion script | Accepts and ships candidates | Split accept and ship phases | Each phase is separately callable |
| Rollback script | Restores canonical state | Add scoped rollback command | Canonical tree returns to pre-acceptance state |
| Promotion docs | Define gate contract | Document two-phase model | Contract names accept and ship responsibilities |
| Config | Controls preservation policy | Add branch preservation policy | Default is preserve-on-failure |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the completed spec and capture promotion split requirements.
- [x] Confirm dependency on leaf 009 score-delta gate.
- [x] Identify promotion script, rollback script, docs, and config surfaces.

### Phase 2: Core Implementation
- [x] Split `promote-candidate.cjs` into accept and ship phases.
- [x] Emit `promotion_blocked_branch_preserved` on phase gate failures.
- [x] Preserve the candidate branch on failure.
- [x] Create `rollback-candidate.cjs` for canonical tree restoration.
- [x] Update promotion contract and rules docs.
- [x] Add `branchPreservationPolicy` to improvement config.

### Phase 3: Verification
- [x] Verify ship-phase gate failure preserves branch and emits event.
- [x] Verify rollback restores canonical tree.
- [x] Verify the preserved branch remains accessible after rollback.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Phase invocation | Accept and ship phases callable separately | Promotion script test |
| Failure semantics | Branch preservation and JSONL event | Gate-failure fixture |
| Rollback | Canonical tree restoration | Rollback script test |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `009-loop-quality-benchmark` | Internal predecessor | Complete | Accept phase should use the score-delta gate |
| Speckit unattended lifecycle | Follow-up | Out of scope | Does not block promotion split work |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Promotion phases leave the canonical tree ambiguous, branch preservation fails, or rollback loses candidate state.
- **Procedure**: Revert promotion split, rollback script, docs, and config policy, then restore the prior single-step promotion command while blocking live shipping until the failure semantics are corrected.
<!-- /ANCHOR:rollback -->
