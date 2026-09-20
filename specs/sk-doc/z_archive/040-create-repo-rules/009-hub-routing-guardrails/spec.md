---
title: "Feature Specification: Phase 9: Hub-Routing Guardrails"
description: "A nested mode could be registered, pass every validator and still be unreachable, with nothing to say so. This phase states hub routing in the always-loaded document, enumerates the surfaces a mode must land on, and adds the gate for the surface nothing enforced."
trigger_phrases:
  - "feature"
  - "specification"
  - "name"
  - "template"
  - "spec core"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 9: Hub-Routing Guardrails

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-08-31 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 9 |
| **Predecessor** | 008-conformance-playbook-and-readme |
| **Successor** | None |
| **Handoff Criteria** | Check 6b green on all five hubs, proven by a negative control; rule counts equal at nine; advisor regression unchanged |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the create-repo-rule packet, and the only phase whose subject is not the mode itself. Reviewing phase 8 surfaced a failure class the packet had hit repeatedly and nothing guarded: a nested mode wired on one surface and reported as routed. This phase generalizes the fix to every hub.

**Scope Boundary**: The always-loaded document, the rule set, the hub doctrine reference, the per-hub gate, and the mode rows that gate proves missing. Excluded: how the advisor scores, compiled-routing activation, and the deliberately broad hub aliases.

**Dependencies**:
- Phase 8's review produced the findings this phase generalizes.
- `sk-create-repo-rule` is the mode used to author the new rule, dogfooding its own decision tests.

**Deliverables**:
- One clause in `AGENTS.md` stating the one-identity model and the two stages.
- A ten-surface checklist in `parent-skills-nested-packets.md`.
- `repo-rules/skill-hub-routing.md`, wired into the router.
- Check 6b plus a loud no-argument notice in `parent-skill-check.cjs`.
- The three mode rows that make 6b green fleet-wide.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Wiring a nested mode into a parent hub had no single description of what "done" means. The two-stage routing model was documented only for authoring a new hub, so a mode added to an existing one was wired surface by surface from memory. Three failures followed and all three happened: a mode registered in the registry alone was reported as routed; the advisor was assumed to surface nested modes by name when the architecture deliberately hides them; and a per-hub gate invoked without its hub argument returned a green result describing a hub nobody had touched.

### Purpose
Someone wiring a mode can name every surface it must land on, knows the advisor scores the hub rather than the mode, and cannot get a green gate result about the wrong subject without being told.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One clause in the always-loaded document stating the one-identity model, the two stages, and the claim it forbids.
- A surface checklist for adding a mode to an existing hub, in the document that already owns hub authoring.
- A concise repo rule that fires on the wiring action and routes to that detail.
- A gate for the one surface nothing enforced, plus a loud notice when the per-hub gate runs without its hub.
- The row additions that make the new gate green across every hub rather than warn-listed.

### Out of Scope
- Any change to how the advisor scores. The architecture is correct; only its legibility was missing.
- Narrowing the pre-existing hub aliases that are broad because they match real request shapes.
- Compiled-routing activation, which stays owned by its own contract.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `AGENTS.md` | Modify | One clause: one advisor identity per hub, two-stage routing, and the claim it forbids |
| `repo-rules/skill-hub-routing.md` | Create | The rule that fires on the wiring action and points at the detail |
| `REPO RULES.md` | Modify | Its trigger row and index row |
| `parent-skills-nested-packets.md` | Modify | Section 7: the ten-surface checklist and the verification commands |
| `parent-skill-check.cjs` | Modify | Check 6b, plus an explicit notice when no hub argument is given |
| `sk-code/SKILL.md` · `mcp-tooling/SKILL.md` | Modify | The three mode rows the new gate proved missing |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The always-loaded document states that a hub projects one advisor identity and that nested modes are not advisor-visible |
| REQ-002 | One document enumerates every surface a mode must land on, with what breaks when each is missed |
| REQ-003 | A gate fails when a registered mode is absent from its hub's SKILL.md mode table |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | A per-hub gate run without its hub argument says which hub it is reporting on |
| REQ-005 | The new gate is green on every hub on the day it lands, rather than warn-listed |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `parent-skill-check` reports 6b PASS on all five hubs.
- **SC-002**: Removing a mode row from a hub SKILL.md makes 6b FAIL, and restoring it makes 6b PASS.
- **SC-003**: The new rule lands in the preferred length band with dividers equal to numbered sections and no trigger-phrase collision.
- **SC-004**: Rule files, trigger rows and index rows stay equal at nine.
- **SC-005**: The advisor regression stays byte-identical to its baseline.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A new gate that cannot actually fail | High. It looks like enforcement and enforces nothing | Prove it with a negative control: break the thing, confirm FAIL, restore, confirm PASS |
| Risk | A fleet gate that fails hubs on landing | Med. Either it gets warn-listed and rots, or it blocks unrelated work | Measure blast radius before writing it, and fix the hubs it flags |
| Risk | An always-loaded clause that is too long | Med. Every turn pays for it | Keep it to one paragraph and route detail to the reference |
| Dependency | `parent-skill-check.cjs` | Without it there is no per-hub gate to extend | Extend the existing check rather than adding a parallel script |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The operator chose the scope explicitly, including fixing the hubs the new gate flags rather than warn-listing them.
<!-- /ANCHOR:questions -->

---



