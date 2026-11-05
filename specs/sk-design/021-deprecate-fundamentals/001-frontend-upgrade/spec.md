---
title: "Feature Specification: Phase 1: frontend-upgrade"
description: "The sk-code frontend surface lacks the spacing, type, colour, hierarchy and motion guidance that web UI work needs, so this phase adds three visual references, moves the token file and routes the vocabulary to sk-code-frontend."
trigger_phrases:
  - "frontend visual values upgrade"
  - "sk-code-frontend visual references"
  - "move design tokens into sk-code"
  - "screen design routing for sk-code"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 1: frontend-upgrade

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-05 |
| **Branch** | `worktrees/316-deprecate-design-fundamentals` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 3 |
| **Predecessor** | None |
| **Successor** | 002-retire-fundamentals |
| **Handoff Criteria** | Three visual references and `assets/tokens.css` live in `sk-code-frontend`, the five baseline value prompts route there, and deleting `sk-design-fundamentals` in phase 2 therefore removes no unique guidance. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Deprecate sk-design-fundamentals into sk-code-frontend and strip research references from sk-design modes specification.

**Scope Boundary**: The sk-code side only. It covers the new frontend references, the token move, the routing vocabulary and the link repoints. It excludes the removal of sk-design-fundamentals and the chart research cleanup.

**Dependencies**:
- Three DeepSeek dispatches on llmgateway.
- The existing sk-code-frontend reference set and its `ROUTER.md`.
- The parent phase order, because phase 2 can only delete the fundamentals folder after this phase carries its guidance.

**Deliverables**:
- `web-visual-values.md`, `web-visual-hierarchy.md` and `web-motion-and-interaction.md`.
- `sk-code-frontend/assets/tokens.css`.
- Routing entries in `ROUTER.md`, `hub-router.json` and `graph-metadata.json`.
- Version bumps and changelog entries.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
The sk-code frontend surface writes web UI but owns no spacing, type, colour, hierarchy or motion values. A padding prompt compiled against sk-code returns defer with no targets, and the advisor answers the same prompt through sk-design at 0.65 confidence. Deleting sk-design-fundamentals without this upgrade would remove guidance the frontend surface cannot replace.

### Purpose
Give sk-code-frontend its own visual value, hierarchy and motion guidance so a screen-design request is answered on the frontend surface before the fundamentals skill is retired.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
compiled-route --hub sk-code for five value prompts (padding, type scale, palette, looks wrong, dropdown animation) -> defer, no targets
advisor: "what padding should this card have" -> sk-design 0.65.
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Add three visual references to `sk-code-frontend/references`.
- Move `tokens.css` from `sk-design-fundamentals/assets` into `sk-code-frontend/assets`.
- Route value, hierarchy and motion intents to `sk-code-frontend` in the stage-two router, the hub vocabulary and the graph metadata.
- Repoint the five documents that cited the fundamentals assets.
- Bump sk-code to 3.11.0.0 and sk-code-frontend to 1.1.0.0, with changelog entries.

### Out of Scope
- Remove sk-design-fundamentals - phase 2 owns the deletion and its unroute.
- Strip research citations from sk-design-chart and the other design modes - phase 3 owns that cleanup.
- Copy slides or print guidance - chart owns a measured type scale and diagram owns a 4px grid, neither linked to fundamentals, so nothing was copied and the slides and print guidance was dropped.
- Add new design modes or change the design agent - outside the frontend surface.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .skilled/skills/sk-code/sk-code-frontend/references/web-visual-values.md | Create | Spacing, type, colour, elevation, radius, opacity and duration values, items V1 to V41 |
| .skilled/skills/sk-code/sk-code-frontend/references/web-visual-hierarchy.md | Create | Hierarchy method, diagnosis tables, build procedure and UX laws, items H1 to H36 and up |
| .skilled/skills/sk-code/sk-code-frontend/references/web-motion-and-interaction.md | Create | Motion rules, input and touch rules, focus and keyboard rules and feedback rules |
| .skilled/skills/sk-code/sk-code-frontend/assets/tokens.css | Move | Token file moved by git mv from sk-design-fundamentals/assets |
| .skilled/skills/sk-code/sk-code-frontend/ROUTER.md | Modify | Add WEB_VISUAL_VALUES, WEB_VISUAL_HIERARCHY and WEB_MOTION and six WEB_A11Y phrases |
| .skilled/skills/sk-code/hub-router.json | Modify | Add the code-frontend-visual vocabulary class |
| .skilled/skills/sk-code/graph-metadata.json | Modify | Add 88 screen-design intent signals moved from sk-design |
| .skilled/skills/sk-code/ROUTER.md | Modify | Mirror the three frontend intents into RESOURCE_MAP |
| .skilled/skills/sk-code/sk-code-frontend/references/frontend-practice.md | Modify | Repoint principle 11 and section 3 |
| .skilled/skills/sk-code/sk-code-frontend/references/web-markup-and-css.md | Modify | Repoint the value guidance |
| .skilled/skills/sk-code/sk-code-frontend/references/figma-to-code.md | Modify | Repoint the value guidance |
| .skilled/skills/sk-code/SKILL.md | Modify | Set version 3.11.0.0 and point the visual value guidance at sk-code-frontend |
| .skilled/skills/sk-code/README.md | Modify | Repoint the reference links |
| .skilled/skills/sk-code/changelog/v3.11.0.0.md | Create | Hub changelog for the release |
| .skilled/skills/sk-code/sk-code-frontend/changelog/v1.1.0.0.md | Create | Mode changelog for the release |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `web-visual-values.md` exists under `sk-code-frontend/references` with items V1 to V41, and `validate_document.py` reports VALID 0 issues on it. |
| REQ-002 | `web-visual-hierarchy.md` exists with items H1 to H36 and up, its diagnosis rows total 40, its review rows total 21 and its UX law rows total 21, and `validate_document.py` reports VALID 0 issues on it. |
| REQ-003 | `web-motion-and-interaction.md` exists under `sk-code-frontend/references`, and `validate_document.py` reports VALID 0 issues on it. |
| REQ-004 | `tokens.css` lives at `sk-code-frontend/assets/tokens.css` after a git mv, and its header cites no book. |
| REQ-005 | A value prompt compiled against sk-code routes to sk-code-frontend rather than defer. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | The three new references name no other skill and no research source, so the leak grep returns no hit. |
| REQ-007 | `WEB_A11Y` gains six phrases, and the new focus guidance links A5 and A8 instead of a shadow-only ring. |
| REQ-008 | `sk-code/hub-router.json` carries the `code-frontend-visual` class, and `sk-code/graph-metadata.json` carries 88 new screen-design intent signals. |
| REQ-009 | The five documents that cited the fundamentals assets point at the new locations. |
| REQ-010 | sk-code is version 3.11.0.0 and sk-code-frontend is version 1.1.0.0, each with a changelog entry. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: A value prompt compiled against sk-code routes to sk-code-frontend rather than defer.
- **SC-002**: `validate_document.py` reports VALID 0 issues on all three new references.
- **SC-003**: The leak grep returns no hit on the three new references.
- **SC-004**: The sk-code parent-skill-check reports all hard invariants passed with 0 warnings at exit 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | llmgateway DeepSeek dispatches | No authored reference to replace the retired skill | One dispatch per file with its brief in `scratch/task-N.md` and an orchestrator check per file |
| Dependency | Existing sk-code-frontend reference set | New files cannot link a stable base | Reuse the existing frontmatter and section shape, then validate each file |
| Risk | Two copies of one rule drift | High | Move `tokens.css` rather than copy it and let phase 2 delete the source |
| Risk | A shadow-only focus ring disappears in forced-colors mode | Medium | Link A5 and A8 from the new references and drop the old box-shadow advice |
| Risk | Phase 2 deletes guidance before sk-code serves it | High | Ship phase 1 first and replay the five prompts against sk-code before the deletion |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A. A documentation packet runs no service, so no response time target applies.
- **NFR-P02**: N/A. No throughput path exists for reference documents.

### Security
- **NFR-S01**: N/A. The files add no credential and no auth surface.
- **NFR-S02**: N/A. The files hold no user data.

### Reliability
- **NFR-R01**: N/A. No uptime target applies to documentation.
- **NFR-R02**: N/A. The document validator is the only check and it reports no errors.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: A prompt with no visual signal compiles to defer and selects no target, as the sk-design no-signal replay shows.
- Maximum input: A prompt with two intents, such as a screen that looks wrong plus a padding question, matches `WEB_VISUAL_HIERARCHY`, which also loads `web-visual-values.md`.
- Failure path: A link left on the deleted fundamentals path fails `check-markdown-links`, which must report 0 broken links.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Three new references of 566 and 618 lines plus the motion file, three routing surfaces and five repointed documents |
| Risk | 8/25 | No auth, no API and no data path. A wrong route sends a value prompt to the wrong surface |
| Research | 10/20 | Decide what to copy from fundamentals. Chart and diagram owned their own scales so nothing was copied |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- None. The operator fixed the spec folder, the worktree, the removal of fundamentals and the drop of slides and print guidance on 2026-11-05.
<!-- /ANCHOR:questions -->

---
