---
title: "Feature Specification: Architecture Reference"
description: "Plans one system architecture document for Pi Remote authored to the sk-create-skill reference and system-skill architecture style."
trigger_phrases:
  - "pi remote architecture reference"
  - "pi mobile phase 11"
  - "architecture reference"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/001-pi-remote-mobile-agent-like-cc/011-architecture-reference"
    last_updated_at: "2026-08-13T17:31:20Z"
    last_updated_by: "deepseek-v4-flash"
    recent_action: "Authored the system architecture reference to the reference template"
    next_safe_action: "Proceed to phase 012 docs as skill references"
    blockers:
      - "Draft planning phase; implementation evidence pending"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    completion_pct: 100
---

# Feature Specification: Architecture Reference

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Implemented |
| **Created** | 2026-08-13 |
| **Branch** | `skilled/0147-pi-remote-experience` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 11 of 15 |
| **Predecessor** | `../010-code-readme-coverage/spec.md` |
| **Successor** | `../012-docs-as-skill-references/spec.md` |
| **Handoff Criteria** | One architecture document at `Apps/Pi Mobile/docs/architecture.md` authored to the `sk-create-skill` reference-template shape, with every claim traceable to source and the typed protocol package |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The current `Apps/Pi Mobile/docs/architecture.md` is a prose narrative with runtime-shape and protocol sections. It does not follow a repeatable reference format, so the relay, protocol, PWA, and extension data flows, the typed event envelope, the mutation authority loop, the sync/replay barrier, redaction, and containment are explained unevenly and cannot be diffed against a standard. Without a single architecture reference in a machine-checkable shape, reviewers and downstream phases 012-015 cannot anchor their documentation to one canonical system view.

### Purpose

Deliver one system architecture document, authored to the `sk-create-skill` reference and system-skill architecture style, that is the canonical system view for the app and the anchor for the other five documentation phases.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One architecture document for `Apps/Pi Mobile/docs/architecture.md` covering the relay, the `pi-rpc-protocol` package, the web PWA, and the approval extension.
- The typed event envelope, the mutation authority loop, the sync/replay barrier, redaction, containment, and data flows, expressed as decision logic, zone diagrams, and validation checkpoints in the reference-template shape.
- Frontmatter (title, description, trigger phrases) and numbered ALL-CAPS H2 sections per the `sk-create-skill` reference template (`assets/skill/skill-reference-template.md`).

### Out of Scope
- Converting the other `docs/*.md` files (owned by phase `012-docs-as-skill-references`).
- The machine-readable protocol surface itself, which remains `packages/pi-rpc-protocol/`.
- Any change to app source code, tests, or configuration.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `Apps/Pi Mobile/docs/architecture.md` | Rewritten | Single system architecture reference in `sk-create-skill` reference-template format |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | One architecture document exists in reference format. | `Apps/Pi Mobile/docs/architecture.md` carries the reference frontmatter, an H1 with a 1-2 sentence intro, and numbered ALL-CAPS H2 sections. |
| REQ-002 | Every named subsystem is covered. | Relay, `pi-rpc-protocol`, PWA, and extension each have a section with responsibilities, boundaries, and flow. |
| REQ-003 | Architecture claims match source. | Every module, function, and envelope claim is traceable to a file or export under `Apps/Pi Mobile/`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The system invariants are explicit. | The typed event envelope, mutation authority loop, sync/replay barrier, redaction, and containment each have a named invariant and decision logic. |
| REQ-005 | Data flows are shown, not only described. | Zone or arrow diagrams present the main data and control flows. |
| REQ-006 | The document feeds the later phases. | The architecture doc is the canonical anchor that phases 012-015 link to instead of duplicating. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reviewer can trace the authority loop, envelope, redaction, and containment claims to source files and to `packages/pi-rpc-protocol/`.
- **SC-002**: Phases 012-015 reference one canonical architecture document instead of maintaining parallel system narratives.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Typed protocol package stability | Envelope claims can drift | Pin envelope descriptions to `packages/pi-rpc-protocol/src/` and re-check after any change |
| Risk | Reference format over-constrains prose | Loss of operator context | Keep operator-only caveats in clearly marked scope-limitation notes |
| Risk | Duplicate ownership with phase 012 | Architecture covered twice | Phase 012 excludes `architecture.md`; it is owned here |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- The reference stays scannable: numbered sections and short sections per the template.

### Security
- No secret, enrollment payload, Serve anchor, or credential path enters the reference.

### Reliability
- The document states operator-unverified boundaries explicitly instead of implying production readiness.

---

## L2: EDGE CASES

### Data Boundaries
- Empty, oversized, malformed, stale-epoch, and retention-expired envelope classes each have an explicit outcome in the reference.

### Error Scenarios
- Authority loss: the reference names the fail-closed behavior of the mutation authority loop.
- Replay barrier breach: the sync/replay barrier section states the rejection behavior.

### State Transitions
- The document is a Draft plan; the rewritten architecture reference is the implementation deliverable.

---

## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 12/25 | One document spanning four subsystems and five invariants |
| Risk | 9/25 | Documentation-only surface |
| Research | 12/20 | Deep source reading across the relay, protocol, web, and extension |
| Multi-Agent | 5/15 | Single owner by default |
| Coordination | 8/15 | Feeds phases 012-015 |
| **Total** | **46/100** | **Level 2** |

---

## 10. OPEN QUESTIONS

- Does preflight confirm the current `docs/architecture.md` content is fully superseded by the reference rewrite?
- Which data flows need live-device evidence before they can be stated as verified in the reference?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent phase map**: [../spec.md](../spec.md)
- **Implementation plan**: [plan.md](plan.md)
- **Task ledger**: [tasks.md](tasks.md)
- **Verification checklist**: [checklist.md](checklist.md)
- **Current state**: [implementation-summary.md](implementation-summary.md)
