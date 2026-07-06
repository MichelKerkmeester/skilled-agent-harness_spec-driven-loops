---
title: "Phase 004 - Mode Packet Refactor"
description: "Level 3 phase packet for applying the Claude-like procedure strategy into the five existing sk-design mode packets without changing the public mode taxonomy."
trigger_phrases:
  - "mode packet refactor"
  - "sk-design mode procedures"
  - "Claude-like procedure strategy"
  - "design-interface procedure integration"
  - "design-foundations procedure integration"
  - "design-motion procedure integration"
  - "design-audit procedure integration"
  - "design-md-generator procedure integration"
importance_tier: "high"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "design/009-sk-design-claude-parity/004-mode-packet-refactor"
    last_updated_at: "2026-07-06T00:23:55.000Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Reconciled spec.md to the verified-complete state during independent verification."
    next_safe_action: "Implement scoped mode-packet refactor after approval."
---
# Feature Specification: Phase 004 - Mode Packet Refactor

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Phase 004 plans the refactor that will apply the approved Claude-like parent/procedure operating model into the five existing `sk-design` mode packets: `design-interface`, `design-foundations`, `design-motion`, `design-audit`, and `design-md-generator`. The phase preserves the single `sk-design` advisor identity, five public execution lanes, `mode-registry`, hub-router behavior, shared reference base, and the `design-md-generator` extraction backend boundary.

**Key Decisions**: Mode packets remain public execution lanes, procedure cards remain internal support cards, and `design-md-generator` keeps its mutating extraction backend boundary.

**Critical Dependencies**: Phase 003 private procedure-card layer, the existing `sk-design` five-mode architecture, current mode-registry and hub-router contracts, and the md-generator extraction backend.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete - mode-packet refactor implemented and independently verified against the live repo |
| **Created** | 2026-07-05 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Estimated LOC** | Documentation packet plus five mode-packet edits, one registry version bump, one README update, and one changelog entry |
<!-- /ANCHOR:metadata -->

---

## Phase Navigation

| Link | Target |
|------|--------|
| **Parent Spec** | ../spec.md |
| **Predecessor Phase** | ../003-private-procedure-card-layer/spec.md |
| **Successor Phase** | ../005-parity-benchmark-release-gate/spec.md |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The five `sk-design` mode packets currently provide the public execution lanes for design work, but they have not yet been refactored to consume the Claude-like private procedure strategy from the parent/procedure model. If the procedure strategy is applied inconsistently, modes may drift, duplicate guidance, bypass proof gates, or expose internal procedure details as public choices.

### Purpose

Plan a safe, staged mode-packet refactor that integrates private procedure support into each existing mode while preserving the public hub contract and keeping implementation out of this packet-creation task.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Define how each existing `sk-design` mode packet should integrate mode-local procedures.
- Preserve the five public modes, single advisor identity, `mode-registry`, hub-router, shared reference base, and md-generator backend boundary.
- Plan context card and proof card updates for each mode.
- Plan verifier cadence for procedure selection, output proof, and routing checks.
- Plan a no-subagent fallback path for mode execution.
- Plan README and changelog updates for maintainers without exposing a public procedure taxonomy.
- Plan link and routing checks across the hub and five mode packets.

### Out of Scope

- Editing `.opencode/skills/sk-design/**` during packet creation.
- Editing the parent root, sibling phases, `external/**`, or `research/**` during packet creation.
- Creating new public `sk-design` modes or new public procedure skills.
- Changing the `design-md-generator` extraction backend or moving it behind a generic procedure-only boundary.
- Dispatching Task/subagents for this leaf packet.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/design/009-sk-design-claude-parity/004-mode-packet-refactor/spec.md` | Create | Phase specification and acceptance criteria |
| `.opencode/specs/design/009-sk-design-claude-parity/004-mode-packet-refactor/plan.md` | Create | Implementation plan for the mode-packet refactor |
| `.opencode/specs/design/009-sk-design-claude-parity/004-mode-packet-refactor/tasks.md` | Create | Pending task breakdown for future implementation |
| `.opencode/specs/design/009-sk-design-claude-parity/004-mode-packet-refactor/checklist.md` | Create | Verification checklist for this phase |
| `.opencode/specs/design/009-sk-design-claude-parity/004-mode-packet-refactor/decision-record.md` | Create | Decisions for public lanes, private procedures, and md-generator boundary |
| `.opencode/specs/design/009-sk-design-claude-parity/004-mode-packet-refactor/implementation-summary.md` | Create | Planned/not-started status summary |
| `.opencode/specs/design/009-sk-design-claude-parity/004-mode-packet-refactor/description.json` | Create | Memory discovery metadata |
| `.opencode/specs/design/009-sk-design-claude-parity/004-mode-packet-refactor/graph-metadata.json` | Create | Graph traversal metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preserve five public mode packets | `design-interface`, `design-foundations`, `design-motion`, `design-audit`, and `design-md-generator` remain the public execution lanes |
| REQ-002 | Preserve single advisor identity | The advisor still routes to `sk-design`, not to individual procedure cards |
| REQ-003 | Preserve `mode-registry` and hub-router contracts | Future edits update mode behavior without replacing the registry or hub-router model |
| REQ-004 | Integrate private procedure support mode-locally | Each mode documents how it selects and applies private procedure cards after public mode selection |
| REQ-005 | Add context and proof card expectations | Each mode has planned context/proof evidence for procedure selection and completion claims |
| REQ-006 | Protect md-generator backend boundary | `design-md-generator` keeps its extraction backend as a mutating implementation boundary with dedicated verification |
| REQ-007 | Do not implement during packet creation | This phase packet writes only the Phase 004 docs and metadata |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Define verifier cadence | The plan states when mode authors must run link, routing, proof, and fallback checks |
| REQ-009 | Define no-subagent fallback | Each mode can execute its procedure path directly when subagents are unavailable or disallowed |
| REQ-010 | Plan README and changelog updates | Maintainer-facing docs explain the operating model without exposing private procedures as user-facing taxonomy |
| REQ-011 | Plan shared reference base review | Future implementation checks shared references for drift and avoids duplicating base guidance in modes |
| REQ-012 | Plan link and routing checks | Future verification covers hub links, mode-registry entries, mode packet paths, and md-generator backend references |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The future refactor can integrate procedure support into all five mode packets without adding public modes or procedure skills.
- **SC-002**: The future implementation keeps `sk-design` as the single advisor-routable identity and preserves the current hub-router and `mode-registry` contracts.
- **SC-003**: Each mode has a planned context/proof card update and a verifier cadence for procedure-backed output.
- **SC-004**: `design-md-generator` remains a mode packet with a mutating extraction backend boundary and dedicated verification.
- **SC-005**: README, changelog, link, routing, and no-subagent fallback checks are planned before any implementation claim.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 003 private procedure-card layer | Mode packets need a stable internal procedure model before integration | Treat Phase 004 implementation as dependent on Phase 003 outputs |
| Dependency | Current `sk-design` mode registry | Registry drift can break public mode routing | Verify registry before and after future implementation |
| Dependency | md-generator extraction backend | Backend has mutating behavior unlike pure guidance modes | Preserve backend boundary and run dedicated md-generator checks |
| Risk | Mode drift | Each mode invents a different procedure lifecycle | Use shared procedure language and per-mode proof cards |
| Risk | Public taxonomy expansion | Procedure cards appear as user-facing modes or skills | Keep procedures internal support cards and verify advisor identity |
| Risk | No-subagent path missing | Modes become unusable under leaf or direct-execution constraints | Require direct execution fallback in every mode |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Procedure selection must not require loading all private cards across every mode for a single request.
- **NFR-P02**: Link and routing verification should stay deterministic and scriptable where possible.

### Security

- **NFR-S01**: Mode packets must not expose private external procedure bodies or secrets.
- **NFR-S02**: `design-md-generator` must keep extraction side effects explicit and separated from read-only procedure guidance.

### Reliability

- **NFR-R01**: Every mode must define fallback behavior when procedure card selection is unavailable.
- **NFR-R02**: Proof requirements must distinguish planning evidence from implementation evidence.
- **NFR-R03**: Future implementation must be reversible to the previous mode packet behavior without changing public mode names.

---

## 8. EDGE CASES

### Data Boundaries

- Mode has no matching procedure card: The mode falls back to its baseline operating instructions and reports that no procedure support card applied.
- Procedure applies to multiple modes: Prefer a shared internal support card only when cross-mode orchestration is required; otherwise keep ownership mode-local.
- md-generator needs extraction backend access: Keep backend-specific commands and verification in the md-generator mode rather than flattening them into generic procedure prose.

### Error Scenarios

- `mode-registry` route mismatch: Stop implementation and repair routing before updating README or changelog claims.
- Broken mode link: Treat as a verification blocker until the link resolves or the reference is intentionally removed.
- Subagents unavailable or disallowed: Use the no-subagent fallback path and keep output proof requirements unchanged.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Five mode packets, hub-router, registry, shared references, README/changelog, md-generator backend |
| Risk | 23/25 | Public taxonomy drift, route breakage, mode behavior divergence, backend regression |
| Research | 16/20 | Requires Phase 003 procedure-card outputs and current mode packet inspection before implementation |
| Multi-Agent | 5/15 | Current packet is leaf-only; future review may involve separate verification but no assumption here |
| Coordination | 13/15 | Depends on previous phases and preserves multiple contracts |
| **Total** | **79/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Public `sk-design` mode taxonomy expands beyond five modes | H | M | Verify advisor identity, registry, and public docs after future implementation |
| R-002 | Procedure logic is copied into each mode inconsistently | M | M | Use shared internal procedure language and per-mode proof cards |
| R-003 | `design-md-generator` backend behavior regresses | H | M | Keep backend boundary and run md-generator-specific verification |
| R-004 | Hub-router or `mode-registry` link breaks | H | M | Run routing and link checks before completion |
| R-005 | No-subagent fallback is missing | M | M | Require direct mode execution instructions and proof path in every mode |

---

## 11. USER STORIES

### US-001: Mode Author Integrates Procedure Support (Priority: P0)

**As a** `sk-design` mode author, **I want** a clear procedure integration pattern for my mode, **so that** I can add Claude-like process without changing the public mode identity.

**Acceptance Criteria**:
1. Given a mode packet is refactored, When a user invokes the mode through `sk-design`, Then the public mode name remains unchanged.
2. Given a private procedure applies, When the mode selects it, Then the mode records the expected context and proof requirements.
3. Given no procedure applies, When the mode runs, Then it falls back to its baseline mode instructions.

### US-002: User Keeps One Design Hub (Priority: P0)

**As a** user of `sk-design`, **I want** the same five public modes, **so that** procedure internals improve output quality without increasing routing complexity.

**Acceptance Criteria**:
1. Given the refactor is implemented, When the advisor routes a request, Then it still surfaces `sk-design` and its existing modes rather than private procedure cards.
2. Given README or changelog updates are made, When a user reads them, Then they describe the operating model without requiring procedure-card selection by the user.

### US-003: Maintainer Verifies md-generator Boundary (Priority: P1)

**As a** maintainer, **I want** `design-md-generator` to keep its extraction backend boundary, **so that** procedure refactoring does not break live CSS extraction behavior.

**Acceptance Criteria**:
1. Given md-generator is refactored, When verification runs, Then extraction backend references and commands still resolve.
2. Given md-generator uses procedure guidance, When it mutates generated output, Then the backend-specific verification remains separate from read-only procedure checks.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None block packet creation.
- Future implementation should confirm the exact Phase 003 procedure-card filenames before editing mode packets.
- Future implementation should confirm the current md-generator backend verification command before claiming backend safety.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Tasks**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md`
