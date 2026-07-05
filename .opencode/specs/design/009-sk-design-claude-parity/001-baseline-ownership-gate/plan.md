---
title: "Implementation Plan: Phase 001 — Baseline Ownership Gate"
description: "Level 2 plan for baseline capture, touched-file inventory, ownership decisions, and rollback gating before sk-design refactor work."
trigger_phrases:
  - "implementation plan"
  - "baseline ownership"
  - "sk-design"
  - "gate"
importance_tier: "high"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/design/009-sk-design-claude-parity/001-baseline-ownership-gate/"
    last_updated_at: "2026-07-05"
    last_updated_by: "markdown-leaf-agent"
    recent_action: "Created planned Level 2 baseline ownership gate docs."
    next_safe_action: "Collect read-only sk-design status and benchmark baseline before implementation."
---
# Implementation Plan: Phase 001 — Baseline Ownership Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | OpenCode skill documentation and benchmark governance |
| **Primary Area** | `.opencode/skills/sk-design/**` baseline only; no implementation writes in this phase |
| **Spec Level** | 2 |
| **Testing** | Spec validation, baseline benchmark capture, and evidence review |
| **Mutation Policy** | Documentation-only until ownership gate closure |

### Overview
This plan freezes the current `sk-design` baseline and resolves ownership of existing or uncommitted changes before refactor work starts. The phase uses read-only status collection, benchmark evidence capture, explicit owner/disposition decisions, and a named rollback plan to prevent later phases from mixing new implementation with unresolved prior state.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase folder scope is explicit and documentation-only for this authoring task.
- [x] Baseline ownership goal is documented in `spec.md`.
- [ ] Current `sk-design` status has been inspected and recorded.
- [ ] Benchmark baseline command and artifact path are confirmed.
- [ ] Ownership authority for pending changes is identified.

### Definition of Done
- [ ] Baseline snapshot is captured with command evidence.
- [ ] Touched-file inventory is complete and reviewed.
- [ ] Every pending change has owner, disposition, and rollback impact.
- [ ] Acceptance thresholds and release authority are recorded.
- [ ] Later implementation phases are explicitly allowed or blocked.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Evidence-first governance gate: collect read-only facts, classify ownership, record decisions, then unlock or block implementation.

### Key Components
- **Baseline Snapshot**: Command output and benchmark artifacts that represent the starting state.
- **Touched-File Inventory**: File-level ledger of current `sk-design` changes and ownership status.
- **Ownership Decision**: Disposition for each pending change: preserve, revert, absorb, defer, or block.
- **Rollback Plan**: Non-destructive first step plus destructive fallback requiring confirmation.
- **Acceptance Thresholds**: Explicit criteria later phases must meet or escalate.

### Data Flow
1. Inspect status without mutating git or source files.
2. Record touched-file paths and categorize each file by owner and disposition.
3. Capture benchmark baseline and evidence paths.
4. Decide threshold and release authority.
5. Record rollback procedure and stop triggers.
6. Update checklist with evidence and state whether implementation is allowed to begin.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Status Inventory
- [ ] Collect read-only `sk-design` worktree status.
- [ ] List every touched file with current state and evidence source.
- [ ] Flag out-of-scope paths as blockers.

### Phase 2: Baseline and Benchmark Snapshot
- [ ] Record canonical benchmark command or accepted baseline source.
- [ ] Capture baseline output, timestamp, and environment notes.
- [ ] Save acceptance threshold candidates for review.

### Phase 3: Ownership and Authority Decision
- [ ] Assign owner and disposition for each pending change.
- [ ] Identify release authority and threshold authority.
- [ ] Resolve whether pending changes are preserved, reverted, absorbed, deferred, or blocked.

### Phase 4: Gate Marking and Handoff
- [ ] Record rollback path and stop triggers.
- [ ] Update checklist with evidence for P0/P1 items.
- [ ] Mark later implementation as allowed only if P0 gates are closed.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Spec validation | Phase docs structure and required sections | `validate.sh --strict` |
| Baseline capture | Current benchmark state and output reproducibility | Canonical benchmark command selected during Phase 2 |
| Inventory review | Touched-file ownership and disposition completeness | Read-only git status/diff inspection |
| Governance review | Release authority, threshold authority, rollback path | Checklist evidence review |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Current worktree status | Evidence | Not collected | Cannot know what must be owned before refactor |
| Canonical benchmark command | Evidence | Not selected | Cannot establish replayable baseline |
| User/maintainer ownership authority | Governance | Not assigned | Cannot decide preserve/revert/absorb/defer |
| Parent parity invariants | Governance | Documented in this phase | Later phases may drift from intended parity |
| Strict spec validation | Documentation | Attempt after write | Structural errors must be fixed or reported |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any implementation write begins before baseline ownership is resolved, benchmark baseline is missing, or ownership authority is unavailable.
- **Procedure**: Stop implementation; preserve current worktree state; document blockers in this phase; request explicit authority before any revert, stash, reset, or cleanup.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Status Inventory ──> Baseline Snapshot ──> Ownership Decision ──> Gate Handoff
        │                    │                    │                    │
        └──── blocks implementation until all P0 evidence is recorded ──┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Status Inventory | Phase docs exist | Baseline Snapshot, Ownership Decision |
| Baseline Snapshot | Status Inventory | Gate Handoff, later benchmark comparison |
| Ownership Decision | Status Inventory, authority | Gate Handoff, implementation start |
| Gate Handoff | Baseline Snapshot, Ownership Decision | Later refactor phases |

<!-- /ANCHOR:l2-phase-deps -->
---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Status Inventory | Low | 20-40 minutes |
| Baseline Snapshot | Medium | 30-60 minutes |
| Ownership Decision | Medium | 30-90 minutes depending on pending changes |
| Gate Handoff | Low | 20-30 minutes |
| **Total** | | **1.5-3.5 hours** |

<!-- /ANCHOR:l2-effort -->
---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-implementation Checklist
- [ ] Baseline artifact path recorded.
- [ ] Touched-file inventory reviewed.
- [ ] No unowned `sk-design` file remains unresolved.
- [ ] Non-destructive rollback path named.
- [ ] Destructive rollback requires explicit confirmation.

### Rollback Procedure
1. **Immediate**: Stop implementation work and keep the worktree unchanged.
2. **Document**: Record which gate failed and which evidence is missing.
3. **Preserve**: Avoid stash/reset/revert until user or release authority confirms ownership.
4. **Recover**: Re-run inventory after authority decision and update this phase's checklist.
5. **Resume**: Unlock later phases only after P0 gates are evidenced.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Documentation-only changes can be reverted by deleting or replacing the five Phase 001 docs; source-code rollback is outside this phase unless later authorized.

<!-- /ANCHOR:l2-rollback -->
