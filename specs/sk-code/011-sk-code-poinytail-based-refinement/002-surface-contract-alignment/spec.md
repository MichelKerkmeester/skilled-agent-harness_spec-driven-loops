---
title: "Feature Specification: Phase 2: surface-contract-alignment"
description: "Two files that load on every sk-code route state different surface precedence orders, and the Obsidian surface is missing from several hub documents, the advisor probes and the routing fixture's bundle cases."
trigger_phrases:
  - "surface contract alignment"
  - "phase 2 surface contract alignment"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: surface-contract-alignment

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-09 |
| **Branch** | `scaffold/002-surface-contract-alignment` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 6 |
| **Predecessor** | 001-ponytail-deep-research |
| **Successor** | 003-doctrine-pass |
| **Handoff Criteria** | Precedence stated once, matching `stack-detection.md`; strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the sk-code Ponytail 5 refinement specification.

**Scope Boundary**: Surface precedence, Obsidian coverage, the stale stack-folder scenario and one routing canary case. No doctrine or review-output change.

**Dependencies**:
- 001 research synthesis, Sections 7, 8 and 11 of `../001-ponytail-deep-research/research/research.md`
- The hub-routing rule, since this edits hub routing documents

**Deliverables**:
- One precedence order across the hub
- Obsidian present wherever the other surfaces are listed
- A corrected stack-folder scenario
- A workflow-plus-Obsidian surface bundle canary case

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The universal standard says OPENCODE > WEBFLOW > UNKNOWN while the detection reference says OPENCODE > OBSIDIAN > WEBFLOW > UNKNOWN, and both load on every route. The hub `SKILL.md` and `ROUTER.md` still describe detection without Obsidian and list Motion.dev as a surface. The stack-folder scenario's index row and expected output no longer match the validator, which is correct.

### Purpose
Every sk-code document states the same surface precedence, and Obsidian appears wherever the other surfaces do.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Correct the precedence line in `shared/references/universal/code-quality-standards.md:53` to match `shared/references/stack-detection.md:40`
- Fix the hub `SKILL.md` precedence, `MOTION_DEV` wording, mode keys, clarifying question, surface packet list and the blank line breaking the OBSIDIAN table row
- Fix `ROUTER.md:300` and the other ROUTER.md lines that leave out Obsidian (`:26`, `:30`, `:37`, `:45`, `:260`, `:265`, `:271`), and the matching blank line and Motion.dev note in `stack-detection.md`
- Fix the stale surface list at `shared/README.md:31`
- Add Obsidian to the advisor probe battery and an Obsidian scenario to `manual-testing-playbook/surface-detection/`
- Correct the DR-004 index row and the stack-folder scenario expected output to match the validator
- Add a workflow-plus-Obsidian surface bundle case to the compiled-routing canary fixture, and mirror it into the byte-identical authored copy
- Re-mint the sk-code routing manifest after the `SKILL.md` edit changes the policy hash, copy it over the authored manifest, and prove compiled routing serves sk-code again before closing

### Out of Scope
- The restraint ladder and doctrine text - phase 003
- Changing the stack-folder validator - re-review found it correct

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` | Modify | Precedence line |
| `.skilled/skills/sk-code/SKILL.md` | Modify | Precedence, surfaces, Obsidian |
| `.skilled/skills/sk-code/ROUTER.md` | Modify | Detection description and Obsidian in surface lists |
| `.skilled/skills/sk-code/shared/README.md` | Modify | Surface list |
| `.skilled/skills/sk-code/shared/references/stack-detection.md` | Modify | Table break, Motion.dev note |
| `.skilled/skills/sk-code/manual-testing-playbook/` | Modify | DR-004 row, scenario output, Obsidian detection scenario |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json` | Modify | New surface bundle case |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json` | Modify | Authored copy of the fixture, kept byte-identical |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` | Regenerate | Re-mint with `compiled-route-manifest.cjs refresh` |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json` | Regenerate | Authored copy of the re-minted manifest |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | One precedence order | Every live sk-code document states OPENCODE > OBSIDIAN > WEBFLOW > UNKNOWN; frozen benchmark reports and changelog entries are excluded from the search |
| REQ-002 | Routing still passes | All canary cases, including the new one, give their expected route; after the re-mint, `compiled-route.cjs --hub sk-code` serves compiled routing, not the legacy fallback, and the route guard reports sk-code fresh |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Obsidian coverage | Obsidian is named in the hub mode keys, clarifying question, surface packet list, probe battery and surface-detection playbook |
| REQ-004 | Scenario matches validator | DR-004 row and expected output match a fresh `verify_stack_folders.py` run |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No two sk-code documents state different precedence orders
- **SC-002**: No advisor probe result gets worse than its before-edit baseline, and the new Obsidian probes pass. The battery already fails before this phase (11 of 15 positives, 2 of 5 negatives won by sk-code); fixing that is a separate advisor-accuracy issue, not this phase
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Advisor scoring shifts when probes change | Med | Run the advisor probe battery before and after and report the delta |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. Motion.dev stays a peer resource category loaded after surface detection, as `shared/references/stack-detection.md:34` already says, and is removed from every surface list.
<!-- /ANCHOR:questions -->

---


