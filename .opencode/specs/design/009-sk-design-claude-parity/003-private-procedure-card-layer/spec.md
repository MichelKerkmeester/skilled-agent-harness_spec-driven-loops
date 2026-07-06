---
title: "Phase 003 - Private Procedure Card Layer"
description: "Level 3 phase packet for adapting external Claude design procedures into private OpenCode-native procedure cards without expanding the public sk-design taxonomy."
trigger_phrases:
  - "private procedure card layer"
  - "procedure-card schema"
  - "mode-local procedure cards"
  - "Claude procedure adaptation"
  - "sk-design procedure routing"
  - "private cards not public skills"
importance_tier: "high"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "design/009-sk-design-claude-parity/003-private-procedure-card-layer"
    last_updated_at: "2026-07-05T00:00:00.000Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Implemented and verified the private procedure-card layer."
    next_safe_action: "Use Phase 004 to wire cards into mode-packet routing without changing the Phase 003 artifacts."
---
# Feature Specification: Phase 003 - Private Procedure Card Layer

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Phase 003 translated the fourteen external Claude design procedures into private OpenCode-native procedure cards owned by the existing five `sk-design` modes. The phase protects the single public `sk-design` hub identity, avoids creating a public fourteen-skill mirror, and uses synthesized card text with source filename citations instead of copied procedure prose.

**Key Decisions**: Use private mode-local procedure cards by default, reserve `shared/procedures/` for cross-mode orchestration only, and adapt source procedures into OpenCode-native cards rather than mirroring external prompts.

**Critical Dependencies**: Phase 002 parent hub compatibility shell, the existing five-mode `sk-design` architecture, and the approved external procedure inventory.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-05 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Estimated LOC** | Documentation packet only; implementation LOC not estimated in this phase packet |
<!-- /ANCHOR:metadata -->

---

## Phase Navigation

| Link | Target |
|------|--------|
| **Parent Spec** | ../spec.md |
| **Predecessor Phase** | ../002-parent-hub-compatibility-shell/spec.md |
| **Successor Phase** | ../004-mode-packet-refactor/spec.md |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The external Claude procedure set contains useful design-manager behaviors, but exposing those procedures as fourteen public OpenCode skills would fragment the `sk-design` surface and create a taxonomy users did not ask for. Blindly copying the source procedures would also increase copyright-like prompt-copying risk and make future mode routing harder to reason about.

### Purpose

Define a private procedure-card layer that preserves one public `sk-design` identity while giving each existing mode structured, source-cited procedure guidance it can select internally.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Define a procedure-card schema for private OpenCode-native cards.
- Produce a per-mode card inventory mapped to the five existing `sk-design` modes.
- Define routing and selection rules for when a mode should load a card.
- Define source-adaptation rules that require synthesis, attribution, and no long-form prompt copying.
- Define proof requirements for cards, including verification evidence and mode-fit checks.
- Document when a card belongs in a mode-local folder versus a shared procedure folder.

### Out of Scope

- Editing `mode-registry.json`, `hub-router.json`, or any mode `SKILL.md` in this phase.
- Editing the parent root, sibling phases, `external/**`, or `research/**` except for automatic parent metadata touches from the Spec Kit save tool.
- Creating fourteen public OpenCode skills from the external procedures.
- Publishing external procedure text verbatim inside public skill docs.
- Changing the public `sk-design` hub identity or the five-mode architecture.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/shared/procedure_card_schema.md` | Create | Private card schema, selection rules, adaptation rules, and shared-placement rule |
| `.opencode/skills/sk-design/design-interface/procedures/*.md` | Create | Six private interface cards for discovery, direction, wireframe, deck, prototype, and variations |
| `.opencode/skills/sk-design/design-foundations/procedures/*.md` | Create | Three private foundations cards for components, hierarchy/rhythm, and tweakable controls |
| `.opencode/skills/sk-design/design-motion/procedures/*.md` | Create | One private motion card for interaction states |
| `.opencode/skills/sk-design/design-audit/procedures/*.md` | Create | Two private audit cards for accessibility and AI-slop review |
| `.opencode/skills/sk-design/design-md-generator/procedures/*.md` | Create | One private md-generator card for measured design-system extraction |
| `.opencode/skills/sk-design/shared/procedures/*.md` | Create | One shared private card for cross-mode polish orchestration with `design-audit` owner |
| `.opencode/specs/design/009-sk-design-claude-parity/003-private-procedure-card-layer/*.md` | Update | Phase tracking, verification evidence, decision status, and implementation summary |
| `.opencode/specs/design/009-sk-design-claude-parity/003-private-procedure-card-layer/description.json` | Regenerate | Memory discovery metadata |
| `.opencode/specs/design/009-sk-design-claude-parity/003-private-procedure-card-layer/graph-metadata.json` | Regenerate | Graph traversal metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Define private procedure-card schema | Schema covers purpose, owning mode, source reference, input conditions, output contract, proof gate, and privacy rule |
| REQ-002 | Map the fourteen source procedure themes into existing modes | Every external procedure theme is assigned to `design-interface`, `design-foundations`, `design-motion`, `design-audit`, `design-md-generator`, or a justified shared orchestration bucket |
| REQ-003 | Keep cards private by default | No card requires a new public OpenCode skill unless a later approved decision changes the architecture |
| REQ-004 | Prevent blind source mirroring | Adaptation rules require synthesis, source citation, and no long-form copied prompt text |
| REQ-005 | Preserve the five-mode architecture | Routing rules select cards inside current modes and do not add public mode names |
| REQ-006 | Define proof requirements | Each card must state what evidence confirms it worked for the selected mode |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Define mode-local versus shared placement rules | Shared cards are limited to true cross-mode orchestration and include an owning reviewer |
| REQ-008 | Include discovery and review themes | Discovery questions, aesthetic direction, variations, extraction, accessibility, slop, hierarchy, interaction, and polish review themes are represented |
| REQ-009 | Document routing conflict handling | The plan states how to choose between overlapping cards and when to fall back to the parent hub |
| REQ-010 | Keep public docs concise | Public-facing `sk-design` docs keep one hub identity and avoid a fourteen-item external taxonomy |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The implementation has one procedure-card schema that can represent all fourteen source procedure themes without copying source prompt bodies.
- **SC-002**: Each current `sk-design` mode has a private card inventory, with shared orchestration used only for the final polish gate.
- **SC-003**: The routing rules keep public skill selection at the existing `sk-design` hub and mode layer.
- **SC-004**: Shared procedure cards are reserved for cross-mode orchestration and the shared card names `design-audit` as owner.
- **SC-005**: Verification proves mode fit, source adaptation, privacy, and no public taxonomy expansion.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 002 parent hub shell | Routing assumptions depend on parent hub behavior | Keep Phase 003 implementation blocked until Phase 002 contract is available |
| Dependency | External procedure inventory | Mapping cannot be complete without source identifiers | Require source references on every planned card and avoid uncited inference |
| Risk | Public taxonomy expansion | Users see fourteen new skills instead of one design hub | Keep cards private and mode-local unless a later decision approves public exposure |
| Risk | Procedure duplication | Similar review procedures diverge across modes | Use shared placement only for true cross-mode orchestration and require owner review |
| Risk | Copyright-like prompt copying | External procedure bodies leak into OpenCode docs | Require synthesis, short source references, and no long-form copied prompt text |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Card selection must remain lightweight and should not require loading all procedure cards for a single mode request.
- **NFR-P02**: Routing should prefer deterministic mode ownership over semantic guessing when a card name and mode are known.

### Security

- **NFR-S01**: Procedure cards must not include secrets, private external notes, or copied source prompt bodies.
- **NFR-S02**: Source references must identify origin at a safe citation level without exposing restricted source text.

### Reliability

- **NFR-R01**: Each card must declare an output contract and proof gate so mode behavior remains testable.
- **NFR-R02**: Overlapping cards must have conflict rules so the same user request does not produce incompatible procedure paths.

---

## 8. EDGE CASES

### Data Boundaries

- Empty card inventory: The mode must fall back to its baseline behavior and report that no private card applies.
- Source procedure with multiple themes: Split into synthesized mode-local cards only when each card has a distinct trigger and proof gate.
- Cross-mode procedure: Place in shared procedures only when at least two modes need the same orchestration contract.

### Error Scenarios

- Missing source citation: Treat the card as invalid until the source reference is added.
- Card conflicts with mode architecture: Reject the card or re-scope it to the owning mode instead of adding a public skill.
- Card copies source wording too closely: Rewrite as synthesis before merge.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Five modes, fourteen procedure themes, private/shared placement rules |
| Risk | 23/25 | Public taxonomy, source adaptation, copyright-like copying, mode routing drift |
| Research | 17/20 | Requires mapping from external source inventory to OpenCode-native procedure contracts |
| Multi-Agent | 4/15 | Single leaf execution for packet creation, future implementation may use reviewers |
| Coordination | 12/15 | Depends on previous phases and parent hub behavior |
| **Total** | **76/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Public mirror of fourteen external procedures appears as OpenCode skills | H | M | Keep cards private and require a later approved decision for public exposure |
| R-002 | External prompts are copied instead of adapted | H | M | Require synthesis, source reference, and proof that card text is OpenCode-native |
| R-003 | Mode-local cards duplicate cross-mode logic | M | M | Use shared procedures only for common orchestration and assign an owner |
| R-004 | Routing chooses the wrong card for overlapping design requests | M | M | Add selection precedence, conflict handling, and parent hub fallback |
| R-005 | Procedure cards become untestable advice blobs | M | L | Require output contract and proof gate in the schema |

---

## 11. USER STORIES

### US-001: Mode Author Selects a Private Card (Priority: P0)

**As a** `sk-design` mode author, **I want** a private procedure card to state when it applies and what it must prove, **so that** mode behavior can gain Claude-style process without exposing new public skills.

**Acceptance Criteria**:
1. Given a mode receives a design request, When its private card inventory contains a matching card, Then the mode can load the card by trigger and follow its output contract.
2. Given a card has no proof gate, When it is reviewed, Then it is rejected until proof requirements are added.
3. Given a card maps to an external procedure, When it is documented, Then it cites the source reference and uses synthesized OpenCode-native wording.

---

### US-002: Parent Hub Preserves One Public Identity (Priority: P0)

**As a** user invoking `sk-design`, **I want** one public design hub with clear modes, **so that** I do not need to choose among fourteen implementation-detail skills.

**Acceptance Criteria**:
1. Given a procedure theme exists, When it is implemented, Then it is private to a mode or shared orchestration folder instead of registered as a public skill.
2. Given a future request asks for a new public procedure skill, When it is evaluated, Then the decision record must be amended before implementation.

---

### US-003: Reviewer Audits Source Adaptation (Priority: P1)

**As a** reviewer, **I want** each card to show safe source adaptation, **so that** the project gains procedure value without prompt copying or undocumented provenance.

**Acceptance Criteria**:
1. Given a card references an external procedure, When the reviewer checks it, Then the card has a source citation and no long-form copied source text.
2. Given a card synthesizes multiple procedure themes, When the reviewer checks it, Then the card explains the mode-fit rationale.

---

## 12. OPEN QUESTIONS

- None remain open for Phase 003.
- Source identifiers are external source filenames only.
- Shared procedure cards require an explicit owner; the implemented shared polish card names `design-audit` as owning reviewer.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
