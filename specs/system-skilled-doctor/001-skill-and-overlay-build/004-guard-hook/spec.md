---
title: "Feature Specification: Phase 4: guard-hook"
description: "A live edit to a file an overlay owns is lost at the next re-pin, and Barter's guard hooks also apply overlays after each edit outside any lock. This phase registers one pre-write guard hook that asks the engine whether a path is owned and refuses the edit, naming the overlay file, and never applies anything."
trigger_phrases:
  - "overlay guard hook"
  - "phase 4 guard hook"
  - "pre write overlay guard"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.4 -->
# Feature Specification: Phase 4: guard-hook

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

An edit made directly to a file an overlay owns survives only until the next re-pin, and Barter's post-edit hooks apply overlays outside any lock. This phase registers one pre-write hook in `hook-registry.json` whose runtime adapters call `overlay-engine.cjs --guard` and refuse an edit to an owned path, naming the overlay file to edit instead. The hook exits at once in a project with no overlay manifest, and no adapter applies overlays.

**Key Decisions**: pre-write refusal only, with no post-edit apply, by the operator's ruling.

**Critical Dependencies**: the engine's `--guard` query from phase 002.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-06 |
| **Branch** | `worktrees/320-system-skilled-doctor` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 4 |
| **Predecessor** | 003-repin |
| **Successor** | None |
| **Handoff Criteria** | The hook is registered and mirrored, refuses an owned path, passes everything in a project with no manifest, and applies nothing |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Build system-skilled-doctor and the doctor overlay command specification.

**Scope Boundary**: `.skilled/hooks/overlay-guard/`, one entry in `hook-registry.json`, the regenerated hook registrations and their tests.

**Dependencies**:
- Phase 002's `overlay-engine.cjs --guard`.

**Deliverables**:
- The guard hook and its adapters for each runtime the registry serves.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Barter's rule says a file an overlay owns is edited in its overlay, but only Barter's private hooks enforce that, and they find the overlay folder by the hard-coded name `barter-overlays`. Their post-edit half applies overlays after an edit, writing the live tree outside the build lock (`overlay-sync-core.cjs:193`).

### Purpose
In any project that vendors Skilled with overlays, an agent that tries to edit an owned file is refused before the write and told which overlay file to edit.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
From `../research/research.md`:

```text
overlay-sync-core.cjs:55-80   finds the overlay folder by the name barter-overlays
overlay-sync-core.cjs:193     the post-edit path applies overlays outside the lock
barter-overlay-first.md:33-37 a live edit to an owned file is lost at the next re-pin
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `.skilled/hooks/overlay-guard/`: one core that calls `overlay-engine.cjs --guard`, and one pre-write adapter per runtime the registry serves.
- Register one entry in `hook-registry.json` and regenerate the runtime registrations.
- Test that the hook passes without a manifest, refuses an owned path naming its overlay, and applies nothing.

### Out of Scope
- A post-edit apply - dropped by the operator's ruling.
- Barter's repository rule file - it stays Barter-local by the operator's ruling.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/overlay-guard/` | Create | The guard core, its adapters and tests |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` | Modify | One pre-write entry |
| The generated hook registrations | Generate | Written by `sync-hook-registrations.cjs` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids follow the design packet's numbering.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-013 | No hook applies overlays after an edit |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-015 | The guard hook exits at once, allowing the edit, when no overlay manifest is found |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg -n "post-edit|--apply" .skilled/hooks/overlay-guard` finds no apply call.
- **SC-002**: an edit to an owned path in a fixture tree is refused, and the refusal names the overlay file.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The engine's `--guard` exit contract | The hook misreads an answer | A test drives the hook against a fixture with a real manifest |
| Risk | The hook fires in projects with no overlays | Low | It exits at once when no manifest is found, and a test pins that |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: With no manifest, the hook returns without starting the engine.

### Security
- **NFR-S01**: The hook never writes a file.

### Reliability
- **NFR-R01**: An engine error is reported, and the hook does not refuse an edit it could not judge unless the engine said the path is owned.

---

## 8. EDGE CASES

- Empty input: a tool call with no file path passes.
- Maximum input: an edit tool call naming several paths is refused when any of them is owned.
- Failure path: an unreadable manifest is reported in the hook's message.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 10/25 | Files: about 10, LOC: about 400, Systems: hooks and mirrors |
| Risk | 8/25 | Auth: N, API: N, Breaking: a refused edit |
| Research | 4/20 | Done in the design packet |
| Multi-Agent | 0/15 | Workstreams: 1 |
| Coordination | 6/15 | Dependencies: the registry and its generators |
| **Total** | **28/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | An adapter applies overlays | M | L | The `rg` check and a test that the tree is unchanged after a hook call |
| R-002 | A registration mirror drifts | M | L | The hook-registration `--check` runs in the gate |

---

## 11. USER STORIES

### US-001: Be told where to edit (Priority: P0)

**As an** agent editing a vendored file, **I want** a refusal that names the overlay file, **so that** my edit survives the next re-pin.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Pay nothing without overlays (Priority: P1)

**As a** project with no overlays, **I want** the hook to do nothing, **so that** it never slows or blocks my edits.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decisions**: See `decision-record.md`

---
