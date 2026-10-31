---
title: "Feature Specification: Phase 13: addon-removal-and-speed-refinements"
description: "Three add-on templates are rarely used and add upkeep to every template change, and the speed loop showed models spend their spare calls on validator output, the metadata repair loop and repeat validation. This phase drops the three add-ons and builds the six refinements the analysis ranked."
trigger_phrases:
  - "addon removal and speed refinements"
  - "phase 13 addon removal and speed refinements"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.3 -->
# Feature Specification: Phase 13: addon-removal-and-speed-refinements

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
| **Phase** | 13 of 14 |
| **Predecessor** | 012-authoring-speed-fixes-and-alignment |
| **Successor** | 014-removed-template-reality-sweep |
| **Handoff Criteria** | Every acceptance criterion is met and the strict and rule censuses match their baselines |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 13** of packet 054. Phase 011's speed loop ran on 2026-10-26, and a DeepSeek analysis of its 24 runs, checked by adversarial verifiers and an Opus review, ranked six refinements. The operator chose to build all six and to delete three add-on templates.

**Scope Boundary**: the add-on templates and their wiring, the authoring card, two templates and the validator's repair hint. The deep loops keep writing their own resource map.

**Dependencies**:
- The speed-loop analysis in `../011-authoring-speed-research/scratch/speed-loop/results/20261026T050500Z-67716/`

**Deliverables**:
- Seven add-ons instead of ten, with no dangling reference
- The six refinements, each with its check

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The recommend-level script prints a 17-line report, so a caller that needs only the level cannot parse the answer. WEAK: The script has issues with output. -->

### Problem Statement
The before-after, roadmap and resource-map add-ons sit in 11 and 137 packets at most, yet every template change has to carry their manifest entries, phrase maps and snapshots. In the speed loop, 84 of 120 validate calls were piped through a filter, 30 of 39 failed calls named only the generated-metadata rules, and the card asked for three validate runs where one proves the packet.

### Purpose
Fewer add-ons to maintain, and a validate and repair path that a weak model follows in fewer calls, with no existing packet changing verdict.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. GOOD: Add a `--quiet` flag that prints only the recommended-level line. WEAK: Update the script and docs. -->

### In Scope
- Delete the before-after, roadmap and resource-map add-on templates and every manifest, scaffold, phrase-tool, test and doc reference to them.
- Point the card's validate step at `--quiet` and ask for one closing run (R1, R3).
- Print the repair command first in the validator's hint and name what it rewrites (R2).
- Change the card's fix loop to fix every failing rule, then rerun once (R4).
- Add an id-numbering line to the spec and acceptance-criteria templates, and stop the closure line inviting counts (R5, R6).

### Out of Scope
- The deep loops' own `research/resource-map.md` and `review/resource-map.md`, the `--no-resource-map` flag and the coverage gate - the operator chose to drop the add-on only, and that output never reads the template.
- Existing packets' before-after, roadmap and resource-map files - they stay as records; no rule requires or removes them.
- The frozen benchmark briefs - they are benchmark input.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/templates/addons/{before-after,roadmap,resource-map}.md.tmpl` | Delete | The three add-ons |
| `.skilled/skills/system-spec-kit/templates/spec-kit-docs.json` | Modify | Drop their entries, lazy lists and section gates |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | Modify | Drop their phrases, seeds and lazy requests |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-{census,cleanup}.mjs`, `runtime/cli/utils/template-structure.js`, `runtime/lib/validation/spec-doc-structure.ts` | Modify | Drop the template maps for the two add-ons with no runtime output |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/*.vitest.ts` and the golden snapshots | Modify | Match the new add-on set |
| `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md` | Modify | R1, R3, R4 and the repair command |
| `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts` | Modify | R2 repair hint |
| `.skilled/skills/system-spec-kit/templates/core/spec.md.tmpl`, `templates/addons/acceptance-criteria.md.tmpl` | Modify | R5 and R6 |
| Spec-kit references, catalog, playbook, README and SKILL docs | Modify/Delete | Match the seven add-ons |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With `--quiet`, stdout holds exactly one line that starts with `Recommended Level:`. WEAK: The flag should work well. -->

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `ls templates/addons/` lists seven templates, and `rg 'before-after.md.tmpl|roadmap.md.tmpl|resource-map.md.tmpl' .skilled` prints nothing |
| REQ-002 | `create.sh` scaffolds Level 1, 2 and 3 packets, with and without `--with-lazy-addons`, and each passes strict validation |
| REQ-003 | The strict census and the six-rule census match their baselines when sorted: no existing packet changes verdict. Superseded in part by ADR-001: a verdict may move toward PASS when a packet-root add-on file is no longer template-checked. |
| REQ-004 | The deep-loop resource-map tests pass unchanged |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | The card asks for one validate run, with `--quiet`, and reruns without it only on FAILED |
| REQ-006 | The validator's repair hint prints the `--apply` command first and names what it rewrites; a test pins the order |
| REQ-007 | The card's fix loop fixes every failing rule, then reruns once, and stops after three rounds |
| REQ-008 | The spec and acceptance-criteria templates state how ids are numbered, and the closure line forbids counts and id ranges |
| REQ-009 | No doc names a deleted add-on as available |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: `recommend-level.sh --quiet --loc 500 --files 15` prints one line and exits 0. WEAK: The feature is successful. -->

- **SC-001**: `ls .skilled/skills/system-spec-kit/templates/addons/*.tmpl | wc -l` prints 7.
- **SC-002**: The card asks for one validate run instead of three.
- **SC-003**: The CLI test project has no failure the baseline did not have.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A caller parses the level line and breaks when the label changes. Mitigation: keep the label stable and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | LLM Gateway for the DeepSeek build dispatches | A 402 or 410 stops a lane | Rerun the same brief on cli-codex Luna |
| Risk | `create.sh` exits 3 when the manifest drops a lazy doc it still requests | High | Change the manifest and the requested list in one brief, then scaffold a throwaway packet |
| Risk | An existing packet holding a deleted add-on changes verdict | Med | Compare the strict and rule censuses with the baselines |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The flag adds no measurable time: the same 40 ms run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

N/A: this phase changes templates, a card and validator output, and runs no service.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: the script exits 2 with usage. Maximum: 10,000 files scores in under one second. WEAK: Handle edge cases. -->
<!-- /ANCHOR:edge-cases -->

- Existing packet with a deleted add-on: the file stays and validation ignores it, as before.
- `--with-lazy-addons`: scaffolds only the add-ons that remain.
- A failing validate under `--quiet`: the one-line result shows FAILED, and the card says to rerun without `--quiet` to read the rules.

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 4/25: one file and 12 lines. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | About 40 files, most of them doc mentions |
| Risk | 10/25 | Scaffolding and templates every packet uses; the censuses guard it |
| Research | 4/20 | The dependency maps are done |
| **Total** | **29/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does `--quiet` suppress warnings? No, stderr is unchanged. WEAK: Edge cases are unclear. -->

- None. The operator answered the resource-map scope and the repair-hint order on 2026-10-26.
<!-- /ANCHOR:questions -->

---


