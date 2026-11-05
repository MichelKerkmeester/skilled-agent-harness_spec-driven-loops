---
title: "Feature Specification: Phase 3: chart-research-cleanup"
description: "The chart references cite a research packet and a phase that no longer explain their rules, so this phase states each rule on its own and removes every citation."
trigger_phrases:
  - "chart research cleanup"
  - "sk-design-chart reference citations"
  - "remove research citations from chart"
  - "chart references state their own rules"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 3: chart-research-cleanup

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
| **Phase** | 3 of 3 |
| **Predecessor** | 002-retire-fundamentals |
| **Successor** | None |
| **Handoff Criteria** | The four chart files carry no research citation and no phase reference, every rule they stated still reads on its own and `validate_document.py` reports VALID 0 issues on each. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Deprecate sk-design-fundamentals into sk-code-frontend and strip research references from sk-design modes specification.

**Scope Boundary**: The four `sk-design-chart` files that carried a research citation, plus the sweep that proves no other design mode leaks one. It excludes the frontend references phase 1 wrote and the hub changes phase 2 made.

**Dependencies**:
- Phase 2, because a design mode that still pointed at the retired folder would be a second leak.
- The `sk-design-chart` document set and its `validate_document.py` verdict.
- The changelog format that keeps a "Spec folder:" line in every release entry.

**Deliverables**:
- `references/color-system.md`, `references/catalog.md` and `references/template-contract.md` with every citation removed and every rule stated on its own.
- `assets/style-reference/evilcharts/origin.md` with the same cleanup.
- A sweep of every `sk-design` mode that classifies the remaining hits.
- `sk-design-chart` 0.23.7.0 and its changelog entry.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
The chart references cite a research packet a reader cannot open and name a phase that no longer explains the rule. A reader who follows a citation leaves the chart skill for a file it does not ship, and the rule it backs reads as borrowed rather than stated.

### Purpose
State every chart rule on its own so the chart references describe only the chart work and no reader needs a research packet to trust a rule.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
Recorded in `001-frontend-upgrade/scratch/facts.md`, verbatim:
```text
- sk-design-chart references/color-system.md, catalog.md, template-contract.md and assets/style-reference/evilcharts/origin.md: removed [SOURCE: specs/...research.md] citations, "Phase 13", "this phase", "from the research", "another packet's research context". Every rule they backed is kept and stated on its own.
- Sweep of all sk-design modes found no other research leak; remaining hits are changelog "Spec folder:" lines (changelog format), a dated benchmark run report, and style-library site descriptions that use the word "research" about the sites.
- validate_document.py VALID 0 issues on all four files. Version 0.23.6.0 -> 0.23.7.0, changelog written.
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Remove every research citation and phase reference from `references/color-system.md`, `references/catalog.md` and `references/template-contract.md`.
- Remove the same references from `assets/style-reference/evilcharts/origin.md`.
- Keep every rule the citations backed and state it on its own, with the figures and decisions the file already recorded.
- Sweep every `sk-design` mode and classify each remaining hit as a citation or a dated record.
- Bump `sk-design-chart` to 0.23.7.0 and write its changelog entry.

### Out of Scope
- Rewrite or re-derive the chart rules - the cleanup removes the citation and keeps the rule.
- Change the chart palette, type scale or template contract - the phase states them as they are.
- Remove the changelog "Spec folder:" lines, the dated benchmark run report or the style-library site descriptions - each names its own record and not the source of a rule.
- Change the sk-design hub or the frontend references - phases 1 and 2 own those surfaces.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-design/sk-design-chart/references/color-system.md` | Modify | Citations and phase references removed, the role split and categorical gates stated on their own |
| `.skilled/skills/sk-design/sk-design-chart/references/catalog.md` | Modify | Citations removed, the radar and pie decision and the palette rules stated on their own |
| `.skilled/skills/sk-design/sk-design-chart/references/template-contract.md` | Modify | Citations removed, the template rules and type scale stated on their own |
| `.skilled/skills/sk-design/sk-design-chart/assets/style-reference/evilcharts/origin.md` | Modify | Citations removed, the evilcharts provenance read from the measured source file |
| `.skilled/skills/sk-design/sk-design-chart/SKILL.md` | Modify | Version 0.23.7.0 |
| `.skilled/skills/sk-design/sk-design-chart/changelog/v0.23.7.0.md` | Create | Release entry for the cleanup |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `color-system.md`, `catalog.md`, `template-contract.md` and `origin.md` carry no `[SOURCE: specs/...]` citation, no "Phase 13", no "this phase", no "from the research" and no "another packet's research context", and `validate_document.py` reports VALID 0 issues on all four. |
| REQ-002 | Every rule the four files stated still reads on its own, with the measured hue and contrast figures and the radar, pie and stacked-area decisions kept. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | A sweep of every `sk-design` mode finds no other research leak, and the remaining hits are the changelog "Spec folder:" lines, a dated benchmark run report and style-library site descriptions. |
| REQ-004 | `sk-design-chart` reads version 0.23.7.0 and carries an entry at `changelog/v0.23.7.0.md`. |
| REQ-005 | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-design/021-deprecate-fundamentals/003-chart-research-cleanup --strict` prints `RESULT: PASSED`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: `validate_document.py` reports VALID 0 issues on the four cleaned files.
- **SC-002**: `rg -n 'Phase 13|this phase|from the research|another packet'` over the four files prints no line.
- **SC-003**: The leak sweep over `.skilled/skills/sk-design` leaves only the changelog lines, the benchmark report and the site descriptions as hits.
- **SC-004**: `SKILL.md` reads version 0.23.7.0 and `changelog/v0.23.7.0.md` exists.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `validate_document.py` and the `sk-design-chart` document set | The cleanup cannot prove its own result | Run the validator on each of the four files and read `VALID 0 issues` |
| Risk | A rule loses its support when the citation goes | High | Keep the rule and carry its own figures, then read each changed section against the rule it states |
| Risk | Another design mode keeps a research leak | Medium | Sweep the whole `sk-design` tree and classify every hit before close |
| Risk | A blanket "research" grep reports a correct line as a leak | Low | Classify each hit as a citation or a dated record, and name the three record classes in the summary |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A. A documentation packet runs no service, so no response time target applies.
- **NFR-P02**: N/A. No throughput path exists for skill documents.

### Security
- **NFR-S01**: N/A. The change adds no credential and no auth surface.
- **NFR-S02**: N/A. The files hold no user data.

### Reliability
- **NFR-R01**: N/A. No uptime target applies to a skill document.
- **NFR-R02**: N/A. The document validator is the only check and it reports 0 issues.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: A file with no citation and no phase reference passes unchanged, because the cleanup removes nothing.
- Maximum input: A file with many rules removes each citation in place and keeps the whole rule set.
- Failure path: A citation left in place shows in the sweep, and a rule cut with its citation shows as a document issue in `validate_document.py`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Four chart documents, one skill version line and one changelog entry |
| Risk | 5/25 | Documentation only, with no auth, data or API path |
| Research | 4/20 | The rule set was already written, and the work was to separate each rule from its citation |
| **Total** | **17/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- None. The operator fixed the folder removal, the worktree and the drop of slides and print guidance on 2026-11-05.
<!-- /ANCHOR:questions -->

---

