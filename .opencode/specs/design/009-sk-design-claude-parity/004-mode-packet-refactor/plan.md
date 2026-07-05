---
title: "Implementation Plan: Phase 004 - Mode Packet Refactor"
description: "Plan for refactoring the five existing sk-design mode packets to use the Claude-like parent/procedure operating model."
trigger_phrases:
  - "phase 004 plan"
  - "mode packet refactor plan"
  - "sk-design procedure integration"
  - "five mode packet verification"
importance_tier: "high"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "design/009-sk-design-claude-parity/004-mode-packet-refactor"
    last_updated_at: "2026-07-05T00:00:00.000Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Created Phase 004 plan."
    next_safe_action: "Read current sk-design mode packets before future implementation."
---
# Implementation Plan: Phase 004 - Mode Packet Refactor

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill packets, JSON mode registry, md-generator backend assets |
| **Framework** | Existing `sk-design` parent hub with five mode packets |
| **Storage** | File-based OpenCode skills and spec metadata |
| **Testing** | Spec strict validation, link checks, routing checks, mode proof review, md-generator backend verification |

### Overview

This phase plans a future refactor of the five public `sk-design` mode packets so each mode can use internal procedure support from the Claude-like parent/procedure operating model. The implementation must preserve public routing while adding mode-local procedure selection, context/proof expectations, verifier cadence, direct fallback behavior, and maintainer documentation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] Phase 003 private procedure-card layer is complete enough to define mode-local integration points.
- [ ] Current `sk-design` hub, `mode-registry`, and five mode packet files have been read before editing.
- [ ] `design-md-generator` backend boundary and verification command are identified.
- [ ] The implementation scope explicitly permits edits to `.opencode/skills/sk-design/**`.
- [ ] Direct execution is required even if subagents are unavailable or disallowed.

### Definition of Done

- [ ] All five public mode packets integrate procedure selection without adding public modes.
- [ ] Context/proof card expectations are documented for each mode.
- [ ] Verifier cadence is documented and runnable.
- [ ] No-subagent fallback is documented for each mode.
- [ ] README and changelog updates explain the maintainer impact without exposing private procedure taxonomy.
- [ ] Link, routing, registry, shared reference, and md-generator backend checks pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Public mode packets as execution lanes, private procedure cards as internal support, and mode-specific proof gates before completion claims.

### Key Components

- **`sk-design` parent hub**: Keeps the single advisor-routable identity and routes to existing modes.
- **`mode-registry`**: Remains the canonical public mode list and mode packet locator.
- **Hub-router**: Continues selecting public modes before any private procedure is considered.
- **Mode packets**: Own their procedure integration, context card, proof card, verifier cadence, and direct fallback path.
- **Shared reference base**: Provides common design standards without duplicating large guidance blocks in each mode.
- **`design-md-generator` backend**: Remains a mutating extraction backend with its own verification path.

### Data Flow

```text
User request -> sk-design advisor identity -> hub-router -> existing public mode -> mode-local procedure selection -> context/proof expectations -> mode output and verification
```

`design-md-generator` follows the same public routing path, then preserves its extraction backend call path and backend-specific verification before claiming generated style-reference output is safe.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Planned Action | Verification |
|---------|--------------|----------------|--------------|
| `sk-design/SKILL.md` | Parent hub entry and public advisor identity | Preserve identity and update only if needed for operating model explanation | Advisor identity and public mode list remain stable |
| `mode-registry` | Public mode routing map | Preserve existing five modes and update only compatible metadata | Registry resolves all five mode packets |
| Hub-router references | Mode selection contract | Preserve public route shape | Routing checks confirm mode selection still works |
| `design-interface` | Interface design execution lane | Add procedure selection, context/proof expectations, fallback | Mode proof review and link checks |
| `design-foundations` | Visual-system execution lane | Add procedure selection, context/proof expectations, fallback | Mode proof review and link checks |
| `design-motion` | Motion execution lane | Add procedure selection, context/proof expectations, fallback | Mode proof review and link checks |
| `design-audit` | QA and hardening execution lane | Add procedure selection, context/proof expectations, fallback | Mode proof review and link checks |
| `design-md-generator` | Live CSS extraction and style-reference generation lane | Add procedure support while preserving backend boundary | Backend extraction verification plus link checks |
| Shared references | Cross-mode design standards | Reuse instead of duplicating large base guidance | Shared reference links resolve |
| README/changelog | Maintainer-facing context | Update after implementation | Docs mention operating model without public procedure taxonomy |

Required inventories:
- Same-class producers: List the five mode packets and the procedure category each will own.
- Consumers of changed symbols: Review parent hub, registry, and README/changelog references before edits.
- Matrix axes: Mode, procedure category, context input, proof output, fallback, verifier, and backend risk.
- Algorithm invariant: Public route selection stops at the existing mode layer; private procedure selection happens inside the selected mode.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Read and Freeze Public Contracts

- [ ] Read the `sk-design` parent hub, mode-registry, hub-router references, and five mode packet files.
- [ ] Record current public mode names and route shape.
- [ ] Identify the md-generator extraction backend boundary and verification command.

### Phase 2: Mode-Local Procedure Integration

- [ ] Add procedure selection language to `design-interface`.
- [ ] Add procedure selection language to `design-foundations`.
- [ ] Add procedure selection language to `design-motion`.
- [ ] Add procedure selection language to `design-audit`.
- [ ] Add procedure selection language to `design-md-generator` without weakening backend-specific requirements.

### Phase 3: Context Cards, Proof Cards, and Fallback

- [ ] Add context/proof expectations per mode.
- [ ] Add no-subagent fallback instructions per mode.
- [ ] Add verifier cadence for procedure selection, output proof, link checks, and routing checks.
- [ ] Keep shared references linked instead of duplicating the base.

### Phase 4: Maintainer Docs and Verification

- [ ] Update README and changelog where scoped and required.
- [ ] Run link and routing checks.
- [ ] Run md-generator backend verification.
- [ ] Update this packet's implementation summary and checklist with evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Spec validation | Phase 004 packet docs and metadata | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <phase-root> --strict` |
| Public route check | Single advisor identity, five public modes, registry, hub-router | Existing sk-design routing scripts or manual link/registry inspection |
| Mode proof review | Context/proof expectations and fallback in all five modes | Manual review against `checklist.md` |
| Link check | Hub, mode packets, shared references, README/changelog | Markdown link checker or targeted path inspection |
| md-generator backend check | Extraction backend path and generated output verification | Existing md-generator verification command confirmed during implementation |
| Boundary audit | No public procedure taxonomy or private source leakage | Diff review and source-adaptation review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 003 private procedure-card layer | Internal phase | Depends on Task 20 | Blocks concrete procedure integration details |
| Existing five-mode `sk-design` architecture | Internal contract | Preserved | Blocks public mode stability if changed first |
| `mode-registry` and hub-router | Internal routing | Must be read before edits | Breaks advisor and mode selection if refactored incorrectly |
| Shared reference base | Internal docs | Must remain linkable | Causes duplicated or stale design guidance if ignored |
| md-generator backend | Internal backend | Must remain intact | Breaks live CSS extraction and DESIGN.md generation if flattened |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Future implementation breaks public mode routing, exposes private procedure cards as public modes, or regresses md-generator extraction behavior.
- **Procedure**: Revert only the future mode-packet, registry, README, changelog, or md-generator references changed by Phase 004, then re-run routing, link, and backend checks.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L2: PHASE DEPENDENCIES

```text
Phase 003 private procedure cards -> Phase 004 public mode packet integration -> verification and maintainer docs
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Read and Freeze Public Contracts | Phase 003 outputs and current sk-design files | Mode-Local Procedure Integration |
| Mode-Local Procedure Integration | Contract inventory | Context Cards, Proof Cards, and Fallback |
| Context Cards, Proof Cards, and Fallback | Mode integration | Maintainer Docs and Verification |
| Maintainer Docs and Verification | All implementation edits | Phase completion |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Read and Freeze Public Contracts | Medium | 1-2 hours |
| Mode-Local Procedure Integration | High | 4-7 hours |
| Context Cards, Proof Cards, and Fallback | High | 3-5 hours |
| Maintainer Docs and Verification | Medium | 2-4 hours |
| **Total** | | **10-18 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [ ] Confirm future implementation scope permits edits to `.opencode/skills/sk-design/**`.
- [ ] Capture current public mode list and registry entries before editing.
- [ ] Capture md-generator backend verification command before editing.

### Rollback Procedure

1. Stop if a procedure card becomes a public mode or public advisor route.
2. Revert the affected mode-packet edits.
3. Restore registry and hub-router references to the pre-refactor state.
4. Restore md-generator backend references if extraction behavior changed.
5. Re-run routing, link, and backend verification.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Revert markdown, JSON, and backend reference changes only; no persisted user data is involved.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

```text
Read current contracts -> preserve public routes -> refactor all five modes -> verify fallbacks and proof -> verify md-generator backend -> update maintainer docs
```

Critical path risk sits in the transition between shared procedure model and mode-local execution. The refactor must not start from README or changelog edits; it must start from current mode files and route contracts so documentation updates describe verified behavior.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Entry Criteria | Exit Criteria |
|-----------|----------------|---------------|
| M1 Contract Freeze | Implementation scope approved | Public mode list, registry, hub-router, and backend boundary recorded |
| M2 Mode Integration | M1 complete | All five modes have procedure selection and fallback language |
| M3 Proof Integration | M2 complete | Context/proof expectations and verifier cadence documented per mode |
| M4 Verification | M3 complete | Link, routing, shared reference, and md-generator checks pass |
| M5 Handoff | M4 complete | README/changelog and implementation summary reflect verified state |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:adrs -->
## L3: ARCHITECTURE DECISIONS

| Decision | Record | Impact |
|----------|--------|--------|
| Mode packets remain public execution lanes | `decision-record.md` | Keeps public mode taxonomy stable |
| Procedures remain internal support cards | `decision-record.md` | Prevents procedure-card public sprawl |
| md-generator keeps mutating backend boundary | `decision-record.md` | Protects extraction backend from generic guidance refactor |
<!-- /ANCHOR:adrs -->

---

## L3: AI Execution Protocol

### Pre-Task Checklist

- [ ] Read `spec.md`, `tasks.md`, `checklist.md`, and `decision-record.md` before future implementation.
- [ ] Read the current `sk-design` parent hub, `mode-registry`, hub-router references, and five mode packets before editing.
- [ ] Confirm `.opencode/skills/sk-design/**` is explicitly in scope before future implementation writes.
- [ ] Capture md-generator backend boundary and verification command before changing md-generator mode guidance.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| Scope lock | During packet creation, write only inside the Phase 004 root; during future implementation, edit only approved `sk-design` files. |
| Public route preservation | Do not add public modes, public procedure skills, or a new advisor identity. |
| Direct execution | Maintain a no-subagent fallback for every mode because leaf execution may prohibit Task dispatch. |
| Proof gate | Do not mark mode procedure work complete until context/proof expectations and verification evidence exist. |
| Backend boundary | Treat md-generator extraction as a mutating backend path with dedicated verification, not generic read-only guidance. |

### Status Reporting Format

Use this format for implementation handoff updates:

```text
phase: 004
status: planned | in-progress | blocked | verified
completed_tasks: T### list
next_task: T###
verification: command -> result
blockers: blocker list or none
```

### Blocked Task Protocol

If a task is blocked, leave it unchecked, add `[B]` in `tasks.md`, record the blocker in `_memory.continuity.blockers` if continuity is updated, and state the next safe action. Do not convert a blocked item into a completed checklist item without direct evidence or explicit user-approved deferral.
