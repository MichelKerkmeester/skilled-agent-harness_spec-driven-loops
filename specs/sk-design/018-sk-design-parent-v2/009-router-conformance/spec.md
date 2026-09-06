---
title: "Feature Specification: Bring the sk-design root router onto the shape every other hub uses"
description: "The `sk-design` root router passes its contract validator and still does not read like any other hub's. It has no machine-readable section, declares no `DEFAULT_RESOURCE`, numbers its closing section 3 where every peer numbers it 4, and its 'how to r"
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Bring the sk-design root router onto the shape every other hub uses

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

The router validator reports zero issues for all six hubs, so this is convention divergence rather
than a contract breach. The intent-model code block moves into its own machine-readable section with
the byte-for-byte replay note every peer carries, `DEFAULT_RESOURCE` is declared with the reason it is
empty, sections renumber, and the closing section becomes the bulleted contract covering dominant
intent, near-ties, same-mode ties and the UNKNOWN fallback.

**Key Decisions**: match the peer shape rather than invent one; declare DEFAULT_RESOURCE explicitly even though it is empty

**Critical Dependencies**: the mode rename, so the intent table and resource map name the final modes

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-06 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 10 |
| **Predecessor** | `008-fundamentals-beyond-ui` |
| **Successor** | `010-readme-human-voice` |
| **Handoff Criteria** | The router reads like its peers, every path resolves, and the replay is unchanged |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the router conformance and readme voice specification.

**Scope Boundary**: `.opencode/skills/sk-design/ROUTER.md` only. No registry, router JSON or vocabulary changes.

**Dependencies**:
- `006-design-mode-and-command-rename`: the router should name final mode names
- The root-router contract validator, which passes before and after and therefore proves nothing here
- The peer routers, which are the actual standard this conforms to

**Deliverables**:
- A machine-readable section carrying the replay note and an explicit `DEFAULT_RESOURCE`
- An intent table naming each intent, its mode and what the request is asking for
- A bulleted closing contract covering near-ties, same-mode ties and the UNKNOWN fallback
- A replay proving the rewrite moved no routing

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `sk-design` root router passes its contract validator and still does not read like any other
hub's. It has no machine-readable section, declares no `DEFAULT_RESOURCE`, numbers its closing section
3 where every peer numbers it 4, and its "how to read this" is a prose paragraph missing the ambiguity
and fallback rules the peers spell out. A mechanical gate cannot see any of this, which is why it sat
unnoticed since the hub was reinstated.

### Purpose
A reader who knows one hub's router can read this one without relearning its shape.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Splitting the code block into its own numbered machine-readable section
- Declaring `DEFAULT_RESOURCE` with the reason it is empty
- Renumbering the closing section and rewriting it as the peers' bulleted contract
- Aligning the H1 with the frontmatter title

### Out of Scope
- The other five hubs' routers - they already conform
- Any change to `INTENT_SIGNALS` keywords or `RESOURCE_MAP` paths, which would move routing
- The hub-router or mode registry, which decide the mode rather than what it loads

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/ROUTER.md` | Modify | Sections, `DEFAULT_RESOURCE`, intent table, closing contract |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The router carries a numbered machine-readable section with the replay note, as every peer does. |
| REQ-002 | `DEFAULT_RESOURCE` is declared explicitly, with the reason it is empty. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The closing section covers dominant intent, near-ties, same-mode ties and the UNKNOWN fallback. |
| REQ-004 | The rewrite moves no routing: the sixteen-phrase replay is unchanged. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The section skeleton matches the peers: OVERVIEW, INTENT MODEL, MACHINE-READABLE ROUTER, HOW TO READ THIS.
- **SC-002**: Every `RESOURCE_MAP` path resolves on disk.
- **SC-003**: The root-router contract validator reports zero issues.
- **SC-004**: The sixteen-phrase replay is byte-identical to the closing-phase capture.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The peer routers | They are the convention; no validator encodes it | Read two peers and the template before rewriting |
| Risk | Editing the router moves routing | Medium | Change no keyword and no map path; replay to confirm |
| Risk | The rewrite conforms to a template nobody follows | Low | The template and two peers agree, which is what conformance means here |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime target. The router is read, not executed.

### Security
- **NFR-S01**: No credential, dependency or network call is added.

### Reliability
- **NFR-R01**: The machine-readable block stays the byte-for-byte replay source, so a prose edit cannot silently change routing.

---

## 8. EDGE CASES

### Data Boundaries
- An intent matching nothing: the UNKNOWN fallback, reported as a gap rather than loading everything.
- Two intents resolving to one mode: not ambiguity, one mode loading both leaf sets.

### Error Scenarios
- A `RESOURCE_MAP` path that stops resolving: caught by the contract validator, which checks disk.
- A prose edit that drifts from the code block: the section note names keeping them in sync as the contract.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 4/25 | Files: 1 |
| Risk | 8/25 | Auth: N, API: N, Breaking: routing, if a keyword or path were touched |
| Research | 6/20 | Reading two peers and the template to find the actual convention |
| Multi-Agent | 1/15 | Single file |
| Coordination | 5/15 | Depends only on the rename landing first |
| **Total** | **[/100]** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | The rewrite changes routing | M | H | No keyword or path edited; replay compared byte for byte |
| R-002 | Conforming to a shape the fleet is abandoning | L | M | The template and two peers agree |

---

## 11. USER STORIES

### US-001: A reader who knows one hub's router can read this one (Priority: P0)

**As a** [user type], **I want** [needed behavior], **so that** [benefit].

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: A replay tool finds the machine-readable block where it finds every other hub's (Priority: P1)

**As a** [user type], **I want** [needed behavior], **so that** [benefit].

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- Whether the root-router contract should encode the section skeleton it currently leaves to
  convention. Six hubs pass the validator and one of them diverged for weeks without anything noticing.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`

---



<!-- SCAFFOLD_VALIDATION_COUNTS:
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
