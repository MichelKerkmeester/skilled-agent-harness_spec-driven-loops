---
title: "Feature Specification: The mcp-magicpath mode packet"
description: "Author the mode packet that describes the MagicPath surface, following the create-skill contract and the hub-member shape its siblings already use."
trigger_phrases:
  - "mcp-magicpath packet"
  - "magicpath skill authoring"
  - "hub member packet shape"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: The mcp-magicpath mode packet

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-08-29 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 6 |
| **Predecessor** | 002-manual-and-auth |
| **Successor** | 004-hub-integration |
| **Handoff Criteria** | The packet exists in the hub-member shape, describes only the surface phase 002 registered, and passes the create-skill packaging gate |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the MagicPath tool bridge specification.

**Scope Boundary**: One packet directory and its documents. No hub metadata changes; the mode is not yet routable when this phase closes, and that is deliberate.

**Dependencies**:
- The registered surface from 002-manual-and-auth, which this packet documents
- The create-skill contract and the skill-root metadata contract it defers to

**Deliverables**:
- The packet's entry contract, readme, references, assets and first changelog entry
- A feature catalog covering the registered tools

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

A registered manual is reachable but not discoverable. An agent that does not already know MagicPath exists will not search for it, and one that finds the tools has no statement of when they are the right choice, what they cost, or where the mutation boundary sits.

Every other tool bridge in this hub answers that through a packet: an entry contract, a readme, references, assets, a changelog, and a catalog of what the surface can do. The sibling packet for the closest analogue carries exactly that shape, including an asset documenting its registered manual.

The shape has a constraint worth stating before authoring rather than discovering during validation. A mode packet under a hub is not a standalone skill. The metadata files that identify a skill root - the description, the mode registry, the hub router - belong to the hub, and are forbidden at a mode sublevel. The sibling packets carry none of them. Authoring this packet as though it were standalone would produce files the fleet audit rejects and a second, competing routing surface inside a hub that already has one.

### Purpose

Give MagicPath the same describable presence every other bridge in this hub has, in the shape a hub member is allowed to take.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The packet's entry contract, stating when MagicPath is the right route and when it is not
- A readme, references covering the command surface and its credential, and the registered manual as an asset
- A feature catalog of the registered tools
- The first changelog entry

### Out of Scope

- Hub metadata. The registry, router and manifest are phase 004, and editing them here would make the mode routable before it is described.
- Root-level skill metadata. Those files are hub-only and forbidden at a mode sublevel.
- Documenting any tool phase 002 did not register.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mcp-magicpath/SKILL.md` | Create | Entry contract, routing statement and rules |
| `.opencode/skills/mcp-tooling/mcp-magicpath/README.md` | Create | Packet readme |
| `.opencode/skills/mcp-tooling/mcp-magicpath/references/` | Create | Command surface, credential setup, mutation boundary |
| `.opencode/skills/mcp-tooling/mcp-magicpath/assets/` | Create | The registered manual, documented |
| `.opencode/skills/mcp-tooling/mcp-magicpath/feature-catalog/` | Create | Catalog of the registered tools |
| `.opencode/skills/mcp-tooling/mcp-magicpath/changelog/` | Create | First entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The packet takes the hub-member shape | Its file set matches what sibling packets carry, and it contains none of the root-level metadata files reserved for the hub |
| REQ-002 | The packet documents only what is registered | Every tool named in the catalog exists in the phase 002 registration; no aspirational capability appears |
| REQ-003 | The entry contract states when NOT to route here | The document names the cases MagicPath does not serve, not only the ones it does |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The credential path is documented where an operator will meet it | A reader learns how to authenticate and what an unauthenticated failure looks like |
| REQ-005 | The mutation boundary is restated in the packet | The document distinguishes reading from writing, matching what the registration expresses |
| REQ-006 | The packaging gate passes | The create-skill validation gate reports the packet clean |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reader who has never used MagicPath can tell from the packet whether it is the right tool for a task and how to authenticate.
- **SC-002**: The packet names no capability the registration does not provide.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The packet is authored as a standalone skill | High | The hub-member shape is confirmed against a sibling packet's actual file set before authoring, not after |
| Risk | The catalog documents the published readme rather than the registration | High | Every catalog entry is checked against the registered tools from phase 002 |
| Risk | The packet duplicates the vendor's own instruction files | Medium | The vendor's output is out of scope for the packet; this document routes through the hub instead |
| Dependency | The registered surface from 002 | Low | That phase closes first, and its output is this phase's subject |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether the packet carries an install guide, as the closest sibling does, or whether credential setup in the references is enough given there is no server to install.
- Whether examples earn their place before the surface has been used in anger, or are better added once real usage exists to draw from.
<!-- /ANCHOR:questions -->

---
