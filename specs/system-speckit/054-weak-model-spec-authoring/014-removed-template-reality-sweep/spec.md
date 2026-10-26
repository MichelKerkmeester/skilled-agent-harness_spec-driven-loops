---
title: "Feature Specification: Phase 14: removed-template-reality-sweep"
description: "Phase 013 deleted three add-on templates and changed how the card validates, how the repair hint reads and how ids are numbered. This phase checks every README, skill doc and command for a leftover mention of the deleted templates and for any description that no longer matches the shipped code, and fixes what it finds."
trigger_phrases:
  - "removed template reality sweep"
  - "phase 14 removed template reality sweep"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.3 -->
# Feature Specification: Phase 14: removed-template-reality-sweep

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/recommend-level-quiet`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-26 |
| **Branch** | `worktrees/217-weak-model-spec-authoring` |
| **Parent Spec** | ../spec.md |
| **Phase** | 14 of 14 |
| **Predecessor** | 013-addon-removal-and-speed-refinements |
| **Successor** | 015-template-example-neutralization |
| **Handoff Criteria** | Both sweeps report zero stale hits from the final tree |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 14** of packet 054. Phase 013 removed the before-after, roadmap and resource-map add-on templates and shipped the six speed refinements as system-spec-kit 2.11.0.0. The operator asked on 2026-10-26 for a separate phase that makes sure no README, skill doc or command still mentions the removed templates, and that those docs match the updated behavior.

**Scope Boundary**: docs, commands, agents and code comments outside `specs/`. Spec packets, changelogs and generated indexes are records and stay as written.

**Dependencies**:
- Phase 013's changes in the working tree

**Deliverables**:
- A mention sweep and a reality sweep, each with its result table in `scratch/`
- A fix for every stale hit, and a clean rerun of both sweeps

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The recommend-level script prints a 17-line report, so a caller that needs only the level cannot parse the answer. WEAK: The script has issues with output. -->

### Problem Statement
Phase 013 checked its removal with name sweeps over the template file names, which miss prose that still calls a deleted template an add-on, add-on lists and counts, and runtime mirrors outside `.skilled/`. A model that reads a stale line asks for a template that no longer exists, or follows a validate or repair step the code no longer matches.

### Purpose
Every README, skill doc, command and agent describes seven add-ons and the shipped validate, repair and id rules, with no mention of a deleted template.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. GOOD: Add a `--quiet` flag that prints only the recommended-level line. WEAK: Update the script and docs. -->

### In Scope
- Sweep root and nested READMEs, skill docs, commands, agents and the runtime mirrors for mentions of the deleted templates.
- Check each doc that describes the add-on set, the card's validate step, the repair hint or id numbering against the code.
- Fix every stale hit, then sync the Hermes copies.
- Rerun both sweeps from the final tree.

### Out of Scope
- `specs/**` and `changelog/` folders - they record what was true when written.
- The generated trigger index and retrieval fixtures - CI rebuilds them on push.
- The deep loops' own `resource-map.md` output - it still ships, so its docs stay.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Docs, commands and comments the sweeps name | Modify | Remove or correct the stale line |
| `scratch/audit-mentions.md`, `scratch/audit-reality.md` | Create | Sweep result tables |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With `--quiet`, stdout holds exactly one line that starts with `Recommended Level:`. WEAK: The flag should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No README, skill doc, command, agent or mirror outside `specs/` and `changelog/` presents before-after, roadmap or resource-map as a spec-kit template or add-on |
| REQ-002 | Every doc that states the add-on set, the template total or what `--with-lazy-addons` adds matches `templates/addons/` and `create.sh` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Every doc that describes the validate step, the repair hint or id numbering matches the card, `orchestrator.ts` and the templates |
| REQ-004 | The Hermes copies match their sources after the fixes |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: `recommend-level.sh --quiet --loc 500 --files 15` prints one line and exits 0. WEAK: The feature is successful. -->

- **SC-001**: The mention sweep, rerun from the final tree, lists no stale hit.
- **SC-002**: The reality sweep, rerun from the final tree, lists no contradiction.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A caller parses the level line and breaks when the label changes. Mitigation: keep the label stable and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 013's uncommitted tree | The sweep checks a moving target | Sweep after 013's edits are final; rerun from the final tree |
| Risk | A fix rewrites a correct line about the deep loops' own map | Med | Each hit records why it is stale; a reviewer checks the diff |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The flag adds no measurable time: the same 40 ms run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

N/A: this phase edits docs and comments, and runs no service.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: the script exits 2 with usage. Maximum: 10,000 files scores in under one second. WEAK: Handle edge cases. -->
<!-- /ANCHOR:edge-cases -->

- A word that is not the template: "before/after" as a review style, or a product roadmap, is not stale.
- A deep-loop doc that calls the map's built-in layout a template: stale only if it points at the deleted spec-kit file.
- A sweep that finds nothing: record the commands and the empty result.

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 4/25: one file and 12 lines. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Doc and comment lines across a few skills |
| Risk | 4/25 | No code path changes |
| Research | 8/20 | Two sweeps over the whole repo |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does `--quiet` suppress warnings? No, stderr is unchanged. WEAK: Edge cases are unclear. -->

- None.
<!-- /ANCHOR:questions -->

---


