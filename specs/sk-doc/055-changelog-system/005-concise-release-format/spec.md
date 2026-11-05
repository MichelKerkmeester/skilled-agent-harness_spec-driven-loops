---
title: "Feature Specification: Phase 5: concise-release-format"
description: "sk-create-changelog took its length from the 535-line v4.0.0.0 entry and set no ceiling on the expanded format, so a release with many changes came out long. This phase bounds the expanded format, models it on v4.0.1.0 and blocks a draft that breaks the ceilings."
trigger_phrases:
  - "concise release format"
  - "phase 5 concise release format"
  - "changelog shape gate"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 5: concise-release-format

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-05 |
| **Branch** | `worktrees/317-concise-changelog-format` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 5 |
| **Predecessor** | 004-changelog-section-spacing |
| **Successor** | None |
| **Handoff Criteria** | `validate.sh --strict` passes on this folder and the shape gate passes `.skilled/changelog/skilled/v4.0.1.0.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Make sk-create-changelog prefer the concise, user-focused release format specification.

**Scope Boundary**: the `sk-create-changelog` mode (its `SKILL.md`, template, references, README and a new `scripts/` folder), the two `/create:changelog` YAMLs and their presentation file, one sk-doc test file and the version carriers that move with the mode and the hub. `validate_document.py` and every `ROUTER.md` stay untouched, because other sessions own uncommitted edits to them.

**Dependencies**:
- The five-iteration research in `research/research.md` and the replacement text in `research/iterations/iteration-005.md`.
- The operator decisions D1 to D4 recorded in section 10.

**Deliverables**:
- A bounded expanded format in `assets/changelog-template.md`, mirrored in `SKILL.md` and both YAMLs.
- `scripts/check_changelog_shape.py`, a blocking gate that `/create:changelog` runs on every draft.
- `scripts/tests/test_check_changelog_shape.py` in the sk-doc suite.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The changelog template told the writer to copy the 535-line v4.0.0.0 entry and set every ceiling at or above what that entry did, so the expanded format had no file total and no item count. A release with many changes therefore came out at the long entry's 338 lines, while the republished v4.0.1.0 entry says the same in 196.

### Purpose
`/create:changelog` writes a release with many changes in the shape of v4.0.1.0 by default, and stops a draft that runs past the template's ceilings before it is written.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Measured before any edit, from the worktree root. The long entry is `git show bc28fcbbba:.skilled/changelog/skilled/v4.0.1.0.md` saved to a scratch file, and each line is total lines, frontmatter lines, body lines, H4 count, the largest H4 count in one section and glance bullets.

```text
$ python3 - <entry> <<'EOF'   # an inline counter, run once per entry
v4.0.1.0.md total 196 fm 20 body 176 h4 22 maxper 5 glance 8 spec ['> Spec folders: `specs/sk-doc/051-hub-routing-quality/002-sk... smaller packets for the fixes']
long-v4.0.1.0.md total 338 fm 27 body 311 h4 38 maxper 7 glance 11 spec ['> Spec folders: `specs/sk-doc/072-skill-routing-and-clarity`...ements` phases (Level 2 and 3)']
v4.0.0.0.md total 536 fm 12 body 524 h4 44 maxper 8 glance 9 spec []
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Move length authority from the v4.0.0.0 entry to the template's ceilings, and name what each model entry contributes.
- Bound the expanded format at 240 lines below the frontmatter, 26 H4 items and one paragraph per item.
- Add the optional `#### Smaller Fixes` slot, section-ordered upgrade notes, glance section tags, the coverage sentence and the cut-at-H4 rule.
- Drop `(Level {N})` from the spec-folder line.
- Add a blocking shape gate with tests, and wire it into both YAMLs and `SKILL.md`.

### Out of Scope
- `validate_document.py` - another session owns uncommitted edits to it, so the shape rules live in a standalone script.
- Every `ROUTER.md` - another session is bumping them all, and the mode's router routes only markdown under `references/` and `assets/`, so the new script needs no router entry.
- A third format tier - v4.0.1.0 carries two `**Breaking:**` markers, so a tier for non-breaking releases could never produce it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md` | Modify | Two model entries, bounded expanded format, new slots and rules |
| `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md` | Modify | Format contract, selection, validation list and shape gate |
| `.skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py` | Create | The blocking shape gate |
| `.skilled/skills/sk-doc/scripts/tests/test_check_changelog_shape.py` | Create | Gate tests the sk-doc runner collects |
| `.skilled/commands/create/assets/create-changelog-auto.yaml` | Modify | Selection, body slots, upgrade notes, shape gate and item count |
| `.skilled/commands/create/assets/create-changelog-confirm.yaml` | Modify | The same changes in the checkpointed workflow |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The template and `SKILL.md` name v4.0.1.0 as the model for length, selection and shape and v4.0.0.0 as the model for voice and a major release's opening, and length comes from the template's ceilings only. |
| REQ-002 | The template's length table bounds an expanded entry at 240 lines below the frontmatter and 26 H4 items, with one paragraph per H4 item. |
| REQ-003 | `check_changelog_shape.py` exits 1 with one `[rule]` line per violation of the file total, the H4 ceiling, the glance ceiling, the glance order and the spec-line rule, and exits 0 on `.skilled/changelog/skilled/v4.0.1.0.md`. |
| REQ-004 | Both `/create:changelog` YAMLs run the gate in step 5 and never write while it exits non-zero, and `SKILL.md` section 9 lists it. |
| REQ-005 | The sk-doc suite holds a passing case and one failing case for each rule. |
| REQ-006 | No spec-folder line in the template, `SKILL.md` or the worked examples carries `(Level {N})`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | The template adds the optional `#### Smaller Fixes` slot, section-ordered upgrade notes, reader-first selection, glance section tags and the three-to-eight domain range, and the completion report counts H4 items instead of files. |
| REQ-008 | The template states the coverage sentence, the cut-at-H4 rule and drop wording for tie-break order, test and scenario lists and how the work was done. |
| REQ-009 | The mode moves to 1.4.0.0 and the hub to 2.9.5.0, each with a changelog entry, and the Hermes mirror stays in sync. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `python3 .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py .skilled/changelog/skilled/v4.0.1.0.md` prints `PASS` and exits 0, and the same run on the long `bc28fcbbba` version exits 1.
- **SC-002**: `bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` prints `all sk-doc script tests passed` with `test_check_changelog_shape.py` among the passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The ceilings in the template and the constants in the gate are two copies of one number | A change to one leaves the other wrong | The gate's docstring and the template both name the other, and the tests pin each ceiling at its boundary |
| Risk | The gate fails the v4.0.0.0 entry on file total and H4 count | High if the gate ran across the tree | It runs only on a new draft in `/create:changelog`, and the template says v4.0.0.0 is a voice model that runs past the ceilings |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

N/A for performance, security and reliability targets: the gate is a local, read-only script over one markdown file, with no service and no credential.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: no path exits 2 with usage, and an unreadable path exits 2 with the read error.
- Maximum input: an expanded entry of 240 body lines and 26 H4 items passes, and one more line or item fails.
- Failure path: a heading, bullet or spec line inside a fenced code block is never read, so a quoted template skeleton does not count.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Ten docs, two YAMLs, one script and one test file |
| Risk | 8/25 | No breaking contract. The gate runs only on new drafts |
| Research | 6/20 | Done in this packet's five research iterations |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None block this phase. The operator settled the four research decisions:

- D1: take the best from both entries. v4.0.1.0 gives length, selection, section and H4 shape, the Smaller Fixes list, section-ordered upgrade notes and the coverage sentence. v4.0.0.0 gives voice and the opening and Why framing of a major release.
- D2: the shape checks are errors, in a standalone script inside the mode, never in `validate_document.py`.
- D3: drop ` (Level {N})` from the spec-folder line.
- D4: `#### Smaller Fixes` is an optional slot that no check requires.

Research Context: `research/research.md` remains the canonical findings source for this topic.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
Deep-research findings (abridged from `research/research.md`, 5 of 5 iterations):
- The short v4.0.1.0 entry is a breaking release, so it is an Expanded entry. The fix redefines what Expanded contains instead of adding a tier.
- Length follows the exemplar through `assets/changelog-template.md:31` and `:212`. Expanded has no file or item ceiling, and an H4 may run to seven paragraphs (`:101`, `:208`, `:210`).
- Ranked edits: (1) decouple length from the exemplar, (2) bound Expanded, (3) add a `#### Smaller Fixes` slot, (4) section-ordered upgrade notes, (5) drop `(Level N)`, (6) filter-first selection in the YAMLs, (7) tag glance bullets, (8) remove the exemplar-sized domain escape, (9) `validate_changelog_shape` at warning, (10) report item count.
- Operator decisions D1 to D4 block the build. See `research/research.md` section 13.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---
