---
title: "Implementation Plan: Phase 002 — Parent Hub Compatibility Shell"
description: "Level 2 plan for adding parent hub manager behavior while preserving sk-design routing identity, mode registry authority, proof gates, and transport-vs-taste separation."
trigger_phrases:
  - "implementation plan"
  - "parent hub compatibility shell"
  - "sk-design manager shell"
  - "mode registry"
importance_tier: "high"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/design/009-sk-design-claude-parity/002-parent-hub-compatibility-shell/"
    last_updated_at: "2026-07-05"
    last_updated_by: "markdown-leaf-agent"
    recent_action: "Created planned Level 2 parent hub compatibility shell docs."
    next_safe_action: "Wait for Phase 001 gates to pass before any sk-design hub implementation."
---
# Implementation Plan: Phase 002 — Parent Hub Compatibility Shell

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | OpenCode `sk-design` parent hub behavior |
| **Primary Area** | `.opencode/skills/sk-design/SKILL.md` and registry-adjacent hub contract after Phase 001 gates close |
| **Spec Level** | 2 |
| **Testing** | Strict spec validation, router/registry preservation, negative controls, proof-gate review |
| **Mutation Policy** | Documentation-only until Phase 001 gates pass |

### Overview
This plan defines how Phase 002 will add a Claude Design-like manager shell at the parent hub level without changing the public skill model. The shell introduces context-first intake, a visible plan, proof gates, verifier cadence, and a durable transport-vs-taste boundary while preserving the single `sk-design` advisor identity and mode-registry routing.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 002 documentation scope is explicit and confined to this folder for this authoring task.
- [x] Parent shell goal is documented in `spec.md`.
- [ ] Phase 001 gates have passed strict validation and ownership closure.
- [ ] Existing `sk-design` hub and mode registry state have been inspected after Phase 001 closure.
- [ ] Canonical router/registry verification command is named.

### Definition of Done
- [ ] Parent hub shell contract is implemented in the approved hub location.
- [ ] Single `sk-design` advisor identity is preserved.
- [ ] Existing public mode registry remains routing authority.
- [ ] Context-first intake, visible plan, proof gates, and verifier cadence are present.
- [ ] Transport-vs-taste separation is documented and enforced.
- [ ] Negative controls prove no 14 public skill mirror was introduced.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Parent hub compatibility shell: the parent hub owns manager choreography and delegates to existing mode packets through registry-backed routing. It does not become a transport layer and does not create public procedure identities.

### Key Components
- **Intake Contract**: Required user/context/design inputs before routing.
- **Visible Plan Contract**: Short user-visible plan before design, implementation, or transport work proceeds.
- **Proof Gate Contract**: Evidence fields for design judgment, accessibility, responsive behavior, and requested transport checks.
- **Verifier Cadence**: Named points where validation or review must run before release claims.
- **Registry Boundary**: The existing mode registry stays the source of public route truth.
- **Negative Controls**: Explicit checks that prevent public skill mirroring, registry bypass, and transport-owned taste.

### Data Flow
1. Confirm Phase 001 gates are closed and implementation is allowed.
2. Inspect current parent hub and mode-registry shape without mutating unrelated files.
3. Draft the parent shell contract against existing hub/router structure.
4. Add context-first intake and visible plan behavior at the hub boundary.
5. Add proof gate and verifier cadence language that routes to existing modes and verification tools.
6. Run registry preservation and negative-control checks before claiming behavior is ready.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Entry Gate and Current Hub Review
- [ ] Verify Phase 001 P0 gates are closed with evidence.
- [ ] Read the current `sk-design` parent hub and mode registry.
- [ ] Record any logic-sync conflict before writing.

### Phase 2: Compatibility Shell Contract
- [ ] Define required intake fields and visible plan behavior.
- [ ] Define proof fields and verifier cadence.
- [ ] Define negative rules for public identity and transport boundaries.

### Phase 3: Registry Preservation
- [ ] Confirm existing public modes remain the route surface.
- [ ] Preserve mode-registry as route authority.
- [ ] Avoid adding public skill identities or duplicated mode maps.

### Phase 4: Verification and Handoff
- [ ] Run strict validation for this phase docs after authored changes.
- [ ] Run later router/registry preservation checks after implementation.
- [ ] Update checklist with evidence or approved deferrals.
- [ ] Hand off private procedure-card detail to Phase 003.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Spec validation | Phase docs structure and required metadata | `validate.sh --strict` |
| Entry gate review | Phase 001 closure and go/no-go state | Phase 001 checklist and implementation-summary evidence |
| Registry preservation | Public routing remains registry-backed | Canonical router/registry check named during implementation |
| Negative controls | No 14 public skill mirror, no registry bypass, no transport-owned taste | File inventory and content review |
| Proof cadence review | Context-first intake, visible plan, proof gates, verifier cadence | Hub shell contract review |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 closure | Governance | Not passed in this packet | Implementation remains blocked |
| Current `sk-design` hub shape | Evidence | Not inspected in Phase 002 yet | Shell may target stale structure |
| Mode registry | Architecture | Must be preserved | Public routing could drift or duplicate |
| Transport skills/tools | Boundary | Must remain transport-only | Design judgment could be outsourced incorrectly |
| Phase 003 private procedure cards | Follow-on | Not started | Shell must avoid implementing private card schema prematurely |
| Strict spec validation | Documentation | Required after write | Structural errors must be fixed or reported |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Phase 001 has not passed, public identity changes are introduced, mode-registry routing is bypassed, or transport tooling starts owning design taste decisions.
- **Procedure**: Stop implementation; keep worktree state unchanged; revert or remove only Phase 002 shell changes after explicit approval; preserve unrelated user and sibling-phase work.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 001 Gate ──> Hub Review ──> Shell Contract ──> Registry Preservation ──> Verification Handoff
       │                                                                           │
       └──────────── blocks all sk-design implementation until evidenced ──────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 001 Gate | Phase 001 checklist and summary evidence | All Phase 002 implementation |
| Hub Review | Phase 001 Gate | Shell Contract |
| Shell Contract | Hub Review | Registry Preservation, verifier cadence |
| Registry Preservation | Shell Contract, current registry | Verification Handoff |
| Verification Handoff | Registry Preservation | Phase 003 procedure-card detail |

<!-- /ANCHOR:l2-phase-deps -->
---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Entry Gate and Hub Review | Low | 20-40 minutes |
| Compatibility Shell Contract | Medium | 45-90 minutes |
| Registry Preservation | Medium | 30-60 minutes |
| Verification and Handoff | Medium | 30-75 minutes |
| **Total** | | **2-4.5 hours after Phase 001 closure** |

<!-- /ANCHOR:l2-effort -->
---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-implementation Checklist
- [ ] Phase 001 P0 gates are closed.
- [ ] Current hub and registry files are read before edit.
- [ ] Public identity preservation criteria are recorded.
- [ ] Non-destructive rollback path is named.
- [ ] Negative controls are ready before implementation.

### Rollback Procedure
1. **Immediate**: Stop hub-shell implementation and preserve current worktree state.
2. **Document**: Record which invariant failed: Phase 001 gate, public identity, registry authority, proof cadence, or transport boundary.
3. **Preserve**: Avoid stash/reset/revert until unrelated work ownership is clear.
4. **Recover**: Remove or revise only the shell change after approval.
5. **Re-verify**: Re-run registry preservation and negative controls before resuming.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Documentation-only changes can be removed by deleting this phase folder; later hub edits must be reverted only after preserving unrelated user work.

<!-- /ANCHOR:l2-rollback -->
