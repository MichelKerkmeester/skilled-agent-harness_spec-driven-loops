---
title: "Feature Specification: Phase 002 — Parent Hub Compatibility Shell"
description: "Level 2 specification for adding a Claude Design-like parent hub shell while preserving the single sk-design advisor identity, mode registry, and OpenCode-native skill boundaries."
trigger_phrases:
  - "parent hub compatibility shell"
  - "sk-design manager shell"
  - "context-first intake"
  - "proof gates"
  - "phase 002"
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/design/009-sk-design-claude-parity/002-parent-hub-compatibility-shell/"
    last_updated_at: "2026-07-05"
    last_updated_by: "markdown-leaf-agent"
    recent_action: "Created planned Level 2 parent hub compatibility shell docs."
    next_safe_action: "Wait for Phase 001 gates to pass before any sk-design hub implementation."
---
# Feature Specification: Phase 002 — Parent Hub Compatibility Shell

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned / not started |
| **Created** | 2026-07-05 |
| **Phase Folder** | `.opencode/specs/design/009-sk-design-claude-parity/002-parent-hub-compatibility-shell/` |
| **Parent Packet** | `.opencode/specs/design/009-sk-design-claude-parity/` |
| **Writable Scope** | Phase 002 documentation only until Phase 001 gates pass |
| **Depends On** | `001-baseline-ownership-gate/` gate closure |

<!-- /ANCHOR:metadata -->
---

## Phase Navigation

| Link | Target |
|------|--------|
| **Parent Spec** | ../spec.md |
| **Predecessor Phase** | ../001-baseline-ownership-gate/spec.md |
| **Successor Phase** | ../003-private-procedure-card-layer/spec.md |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The parent `sk-design` hub needs the feel of a design manager: it should ask for context first, make the plan visible, enforce proof gates, and run verifier cadence before handing work to mode packets. That behavior must be added without copying Claude Design's many public skill files, fragmenting the advisor identity, or bypassing the existing OpenCode mode registry.

### Purpose
Define the compatibility shell contract for the parent hub. The shell keeps `sk-design` as the single public advisor identity, uses the existing mode registry as routing authority, separates design taste from MCP transport, and adds manager-style intake, plan, proof, and verification expectations that later phases can implement safely.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Define the parent hub compatibility shell for context-first intake, visible plan, proof gates, and verifier cadence.
- Preserve the single public `sk-design` identity and existing five public mode packets.
- Preserve `mode-registry.json` as the routing source of truth.
- Document negative rules against adding a 14 public skill mirror or public micro-skill identities.
- Separate design judgment and taste from Open Design, Figma, browser, or other transport mechanics.
- Block implementation until Phase 001 gates close with evidence.

### Out of Scope
- Editing `.opencode/skills/sk-design/**` before Phase 001 closes.
- Creating private procedure cards; that belongs to Phase 003.
- Refactoring individual mode packets; that belongs to Phase 004.
- Building parity benchmark release gates; that belongs to Phase 005.
- Editing parent root files, sibling phases, `external/**`, `research/**`, or source skill files during this documentation task.
- Dispatching sub-agents or using nested Task execution.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create/update | Phase 002 scope, requirements, success criteria, and constraints |
| `plan.md` | Create/update | Compatibility shell execution plan, quality gates, dependencies, and rollback |
| `tasks.md` | Create/update | Pending work queue for hub-shell design, routing preservation, and verification |
| `checklist.md` | Create/update | P0/P1 evidence gates that block implementation until Phase 001 passes |
| `implementation-summary.md` | Create/update | Planned/not-started state and non-completion record |
| `description.json` | Create/update | Phase metadata for memory/search discovery |
| `graph-metadata.json` | Create/update | Phase graph metadata and dependency linkage |

### Compatibility Shell Capabilities

| Capability | Required Behavior | Boundary |
|------------|-------------------|----------|
| Context-first intake | Parent hub gathers goals, constraints, inputs, references, and verification expectations before mode routing | No implementation write before intake facts are clear |
| Visible plan | Parent hub exposes a concise plan before design/build work proceeds | No hidden mode handoff without plan state |
| Proof gates | Parent hub requires evidence for design judgment, accessibility, responsive behavior, and requested transport checks | Proof requirements route to existing modes and tools |
| Verifier cadence | Parent hub names when verification runs and what blocks release | Cadence must preserve Phase 001 thresholds |
| Transport-vs-taste separation | `sk-design` owns taste and design judgment; MCP skills/tools own file/app/browser transport | Transport cannot decide visual quality |
| Public identity preservation | Advisor still surfaces one `sk-design` family with five modes | No 14 public skill mirror |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Phase 001 gates pass before implementation | Phase 002 checklist records Phase 001 strict validation, ownership closure, baseline evidence, and go/no-go state before any hub edit |
| REQ-002 | Single public advisor identity preserved | No new public `sk-design` micro-skill identities are introduced by the shell |
| REQ-003 | Mode registry remains routing authority | Parent shell routes through existing registry keys and does not hard-code a replacement routing table |
| REQ-004 | Context-first intake defined | Shell contract lists required context fields before mode routing or tool transport begins |
| REQ-005 | Visible plan defined | Shell contract requires a plan visible to the user before implementation/design output proceeds |
| REQ-006 | Proof gates and verifier cadence defined | Shell contract names proof fields, cadence moments, and blocking verifier outcomes |
| REQ-007 | Transport and taste remain separated | Contract states `sk-design` owns design judgment and transport skills/tools execute only transport mechanics |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Existing five mode packets remain public surface | Shell maps behavior to interface, foundations, motion, audit, and md-generator modes without public mode proliferation |
| REQ-009 | Negative controls documented | Checklist includes no 14-skill mirror, no bypass of registry, and no transport-owned taste decisions |
| REQ-010 | Handoff to Phase 003 is explicit | Private procedure-card requirements are deferred with clear handoff criteria |
| REQ-011 | Verification commands are listed | Plan lists strict spec validation and later router/registry checks needed after implementation |
| REQ-012 | Rollback path is non-destructive first | Plan describes how to stop or revert shell changes without disturbing unrelated work |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Phase 002 docs and metadata exist and validate as a Level 2 child packet.
- **SC-002**: Implementation remains blocked until Phase 001 gates pass with evidence.
- **SC-003**: The parent shell contract supports design-manager behavior without adding public skill identities.
- **SC-004**: The mode registry remains the only routing source of truth for public modes.
- **SC-005**: Proof gates and verifier cadence are explicit enough for later implementation and benchmark phases.
- **SC-006**: Transport-vs-taste separation is documented so MCP transport cannot replace design judgment.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001 gate closure | Implementation cannot start safely | Keep Phase 002 planned/not-started until Phase 001 evidence passes |
| Dependency | Existing `sk-design` registry | Shell could bypass the current route contract | Require registry-preservation checks before and after implementation |
| Risk | Public skill mirror creep | Advisor identity fragments and OpenCode routing degrades | Add negative controls against 14 public skill mirror |
| Risk | Transport owns taste decisions | Open Design/Figma/browser mechanics could override design judgment | Keep taste rules in `sk-design`; transport only executes app/tool interaction |
| Risk | Hidden plan or proof omissions | Claude-like manager feel becomes cosmetic only | Require context fields, visible plan, proof fields, and verifier cadence |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Traceability
- **NFR-T01**: Shell requirements must map back to parent packet invariants and Phase 001 gates.
- **NFR-T02**: Every later implementation change must have an explicit shell capability or checklist row.

### Maintainability
- **NFR-M01**: Shell behavior must stay in the parent hub and existing registry structure, not in duplicated public skills.
- **NFR-M02**: Negative rules must be visible to future mode-packet authors.

### Safety
- **NFR-S01**: No `.opencode/skills/sk-design/**` implementation edit is allowed while Phase 001 is unresolved.
- **NFR-S02**: Rollback must preserve unrelated user or sibling-phase work.

### Verification
- **NFR-V01**: Strict spec validation must run for this phase packet.
- **NFR-V02**: Later implementation must include router/registry evidence and negative-control checks.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- **Phase 001 incomplete**: Keep this phase in planned/not-started state and do not edit `sk-design` files.
- **Existing registry has unexpected keys**: Record mismatch and stop for logic-sync before writing shell behavior.
- **Transport request includes design judgment**: Route judgment through `sk-design`; use transport only for external app or browser mechanics.

### Error Scenarios
- **Validator fails**: Fix docs/metadata inside this phase folder only, then re-run strict validation.
- **Router baseline unavailable**: Treat later implementation as blocked until an accepted fallback check is named.
- **Public mirror request appears**: Reject adding public micro-skill identities and document the negative-control evidence.

### Concurrent Operations
- **User changes Phase 001 during this work**: Re-read Phase 001 gate state before implementation starts.
- **Sibling phase docs appear first**: Treat them as read-only context unless this phase explicitly depends on them.
- **Unrelated worktree changes appear**: Preserve them and keep Phase 002 writes scoped to this folder.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- What exact Phase 001 evidence will be accepted as the go signal for Phase 002 implementation? **Resolution required before implementation.**
- Which router/registry command is canonical for proving the parent shell did not bypass mode-registry routing? **Resolution required before implementation.**
- Which verifier cadence should block release versus warn only? **Resolution required before implementation or Phase 005.**

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Parent Packet**: `../spec.md`
- **Predecessor Gate**: `../001-baseline-ownership-gate/`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`

<!-- /ANCHOR:related-docs -->
