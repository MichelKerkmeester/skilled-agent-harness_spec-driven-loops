---
title: "Feature Specification: Phase 25: release-notes-and-doc-sync"
description: "The unreleased advisor changelog v1.1.0.0 says nothing of phases 019 to 024, and six reference pages still state rules those phases changed: a case count of 17, a companion line with no policy word, a head row that loses its command and a command-attach row that names no mention reader. This phase extends the open changelog entry and corrects the six pages, with every number read from the closed phases at build time."
trigger_phrases:
  - "release notes and doc sync"
  - "phase 25 release notes and doc sync"
  - "advisor changelog v1.1.0.0 extension"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 25: release-notes-and-doc-sync

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/352-command-surfacing-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 25 of 25 |
| **Predecessor** | 024-fable-review-remediation |
| **Successor** | None |
| **Handoff Criteria** | Every task in `tasks.md` is `[x]`, the changelog shape check prints `PASS` for `v1.1.0.0.md`, the document check exits 0 on all seven files, the catalog package check exits 0, `scratch/fact-check.txt` traces every added number to a closed phase and strict validation prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 25** of the build that makes the skill advisor surface every tracked slash command with a run, start or ask policy on every supported CLI (`../spec.md`). The packet exists so an AI that works through skills stays free to choose the command path or the skill path and lands on the best correct workflow more often. The last alignment run flagged a missing changelog entry as P1 (C-01), and the entry written for it, `v1.1.0.0.md`, stops at phase 018. Phases 020 and 021 each closed with a list of pages that state a rule they changed and left those pages to the packet close.

**Scope Boundary**: seven Markdown files under `.skilled/skills/system-skill-advisor/`. No code, no test, no version carrier, no root release note, no published release, no `AGENTS.md` and no other phase folder. A sentence is written only when a closed phase's `implementation-summary.md` or the code it names backs it.

**Dependencies**:
- Phases 019 to 024 are Complete and committed, because every sentence and number comes from their closing documents (T001 checks).
- `origin/main` still ships advisor version 1.0.0.0, so `v1.1.0.0.md` is the open entry and may be extended (T001 checks).

**Deliverables**:
- `changelog/v1.1.0.0.md` with phases 019 to 024 in three new sections, inside the shape ceilings.
- Six reference pages that state the current rule.
- `scratch/release-facts.txt`, the one source every doc task quotes, and `scratch/fact-check.txt`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
A reader of the advisor's release notes learns nothing about the offer guards, the head parity, the workflow measure or the Codex fix, because the open entry covers phases 014 to 018 only. Six reference pages still describe the old behaviour, so a person who reads `advisor-recommend.md` is told only the top pick can carry a command under the top-only option, and two pages show the companion line without its policy word.

### Purpose
The open changelog entry and the six pages say what the advisor does after phases 019 to 024, with no number that a closed phase did not print.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
# wc -l .skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md, 2026-11-14.
     168 .skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md
# rg -c "section:" and rg -c "^#### " over the same file.
9
17
# git -c core.fsmonitor=false show origin/main:.skilled/skills/system-skill-advisor/SKILL.md | rg -n "^version", then the same on the working tree.
5:version: 1.0.0.0
5:version: 1.1.0.0
# rg -n "command-meaning-anchor" runtime/tests/README.md and feature-catalog/scorer-fusion/command-meaning-matching.md, cut to the count.
157:| `command-meaning-anchor.vitest.ts` | 17 cases on the meaning way in for a command row: ...
65:| `.skilled/skills/system-skill-advisor/runtime/tests/command-meaning-anchor.vitest.ts` | Vitest | 17 cases: cosine bar, margin, stand-in refusal, eligibility and ranking rule |
# rg -c "^\s*(it|it\.each)\(" runtime/tests/command-meaning-anchor.vitest.ts
28
# rg -n "command-attach" runtime/lib/README.md, the row.
132:| `command-attach.ts` | `attachCommand()` names the slash command for a hub recommendation whose compiled route picks one `workflowMode`. It reads the `MODE_COMMANDS` table that `derive-command-bridges.cjs` generates from each hub's `mode-registry.json`. A `system-deep-loop` command needs the same command typed in the prompt or a `DEPTH_WORDING` phrase, and a prompt that matches `NO_EDIT_REQUEST` gets no command. The module has no imports. |
# rg -n "compiledRouteTopOnly" feature-catalog/cli-surface/advisor-recommend.md, line 37, cut.
37:The request option `options.compiledRouteTopOnly` is an optional boolean that defaults to false. When a caller passes `true`, `enrichCompiledRoutes()` runs the route lookup for the first recommendation only and returns every later one unchanged, so only the top pick can carry `compiledRoute` or `command`. ...
# rg -n "Also:" feature-catalog/scorer-fusion/doctor-command-routing.md runtime/scripts/command-bridges/README.md README.md, cut.
doctor-command-routing.md:35: ... When a skill is first and a doctor bridge also passes, the brief adds `Also: /doctor:<command> < ...
command-bridges/README.md:68: A doctor bridge passes on its own wording (an explicit-author phrase match). ...
README.md:121: ... the brief adds `Also: /doctor:<command> <target> (<policy>)` as its second line, where the policy is run, start or ask, and leaves the line out when the head alread ...
# rg -c "mention|refus|question about" feature-catalog/cli-surface/advisor-recommend.md prints nothing.
```
<!-- /ANCHOR:measured-behavior -->

The count of 28 is lines that open a case, and an `it.each` line opens more than one, so T010 and T012 take the number the test run prints and not this one.

### What Each Page States Today

| Page | Stale statement | Source of the current rule |
|------|-----------------|----------------------------|
| `changelog/v1.1.0.0.md` | Ends at phase 018. 168 of 280 lines, 9 of 14 glance bullets, 17 of 32 items | The closing documents of phases 019 to 024 |
| `runtime/lib/README.md` | The `command-attach.ts` row names no mention reader and no small-edit gate | Phase 020, and phase 024 lane A |
| `runtime/tests/README.md` | `command-meaning-anchor.vitest.ts` has 17 cases | The test run at build time |
| `feature-catalog/cli-surface/advisor-recommend.md` | Under the top-only option only the top pick can carry a command, and nothing says when a command is withheld | Phase 021 for the head row, phase 020 for the withhold |
| `feature-catalog/scorer-fusion/command-meaning-matching.md` | 17 cases, and no word of the uncertainty bar a meaning pass must clear | Phase 020 and decision P021 |
| `feature-catalog/scorer-fusion/doctor-command-routing.md` | The companion line has no policy word | Phase 021, as `README.md` line 121 already states |
| `runtime/scripts/command-bridges/README.md` | The same companion line | Phase 021 |

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Extend the open changelog entry `v1.1.0.0.md` with phases 019 to 024, through the `sk-doc` changelog mode and inside its shape ceilings.
- Correct the `command-attach.ts` row, the two case counts, the top-only sentence, the meaning-pass bar and the two companion lines.
- Collect the facts once in `scratch/release-facts.txt`, so no doc task reads a number from memory or from this plan.
- Check every added number and claim against the closed phases and the code.

### Out of Scope
- A new changelog version - `origin/main` ships 1.0.0.0, so 1.1.0.0 is still open. When that is no longer true at build time the phase stops.
- The root Skilled release note - it is a published release the operator chose to amend once, for phases 014 to 018. Whether it gains phases 019 to 024 waits on the operator.
- The `routing-accuracy` README and the session readers README - phases 022, 023 and 024 update them in their own lanes.
- A changelog entry for another skill - phases 019 to 024 change no other skill's files. T001 checks that from the diff and stops when it finds one.
- Any claim that the brief makes a model take a correct workflow more often - the packet has not shown it, and the entry says what the measure counts.

### Files to Change

`SKA` is `.skilled/skills/system-skill-advisor` and `ADV` is `SKA/runtime`.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `SKA/changelog/v1.1.0.0.md` | Modify | Three new sections, at most five glance bullets, the check numbers |
| `ADV/lib/README.md` | Modify | The `command-attach.ts` row |
| `ADV/tests/README.md` | Modify | The case count of `command-meaning-anchor.vitest.ts` |
| `SKA/feature-catalog/cli-surface/advisor-recommend.md` | Modify | The top-only sentence and the withheld command |
| `SKA/feature-catalog/scorer-fusion/command-meaning-matching.md` | Modify | The case count and the uncertainty bar |
| `SKA/feature-catalog/scorer-fusion/doctor-command-routing.md` | Modify | The companion line with its policy word |
| `ADV/scripts/command-bridges/README.md` | Modify | The companion line with its policy word |

No new file outside this phase folder.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `changelog/v1.1.0.0.md` names what phases 019 to 024 changed, in the sections `Command Fit`, `One Head on Every Runtime` and `Workflow Measure`, and `check_changelog_shape.py` prints `PASS` for it. |
| REQ-002 | Every number in a line this phase adds to any of the seven files stands in `scratch/release-facts.txt` beside the closed-phase file and line it was copied from. |
| REQ-003 | No added sentence says or implies the brief makes a model follow a correct workflow more often. The `Workflow Measure` section states that the rates count a workflow opened, on tuned rows with one run each. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The `command-attach.ts` row of `runtime/lib/README.md` names `commandOnlyMentioned` and the small-edit gate. |
| REQ-005 | `runtime/tests/README.md` and `command-meaning-matching.md` state the case count the test run of `command-meaning-anchor.vitest.ts` prints, and neither holds `17 cases`. |
| REQ-006 | `advisor-recommend.md` states that the first recommendation gets its command under every request shape and names the three cases in which a command is withheld. |
| REQ-007 | `doctor-command-routing.md` and `command-bridges/README.md` show the companion line as `Also: /doctor:<command> <target> (<policy>)` and say it is left out when the head already names that command. |
| REQ-008 | `validate_document.py` exits 0 on each of the seven files, `validate_catalog_package.py --package system-skill-advisor` exits 0 and the phase diff names those seven files and nothing else outside `specs/`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: `python3 .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py .skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md` prints `SUMMARY files=1 pass=1 fail=0`.
- **SC-002**: `rg -c -F '17 cases'` over the two pages that held it prints nothing, and `rg -c -F '(<policy>)'` prints at least 1 for each of the two companion-line pages.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 019 to 024 closed | A sentence would describe unbuilt behaviour | T001 stops until each reads Complete |
| Dependency | `origin/main` still at advisor 1.0.0.0 | Extending a shipped entry would rewrite a release | T001 checks the version on `origin/main` and stops when it is not 1.0.0.0 |
| Risk | A changelog number is invented or carried over from this plan | High: the entry would state a result nobody printed | The plan holds no result number. Every doc task quotes `release-facts.txt`, and T016 traces each added number back |
| Risk | The entry reads as proof of the outcome | High: the packet's own log says the outcome is not shown | REQ-003, and T016 searches the added lines for gain wording |
| Risk | The entry passes the 280 line ceiling | Med: the shape check fails | Three sections with a fixed item budget, and each changelog task ends on the shape check |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A. The phase changes documents only.

### Security
- **NFR-S01**: No added line quotes a corpus prompt. An example prompt in the changelog is one a closed phase's test file or probe already holds.

### Reliability
- **NFR-R01**: The changelog stays within 280 lines, 14 glance bullets and 32 items.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: a closed phase whose summary names no user-visible change gets no changelog item, and `release-facts.txt` says so under its heading.
- Maximum input: when the three sections do not fit in the 112 lines left, items are merged, never dropped silently, and the merged phases are named in the task evidence.
- Failure path: a statement in `release-facts.txt` that the code contradicts is not written, and the task is marked `[B]` with both lines.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Seven documents, about 220 lines |
| Risk | 8/25 | Release notes for an unreleased version. A wrong number is the failure |
| Research | 8/20 | Each stale statement read from its page at planning |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Level: `recommend-level.sh --loc 220 --files 8` printed Level 1. Decision: Level 2, because the closure gate is `acceptance-criteria.md`, as in phases 020 to 024.
- Extend `v1.1.0.0.md` or write a new entry? Decision: extend. The changelog mode extends an open entry, and the version on `origin/main` shows 1.1.0.0 is not shipped.
- WAITING ON OPERATOR: the root release note. The operator chose on 2026-11-13 to amend `v4.0.2.1` on the branch for phases 014 to 018. Options for phases 019 to 024: (a) extend that amended note again before the pull request, (b) leave it and let the next Skilled release carry them, (c) a new Skilled release note. Recommendation: (a), in one task after this phase closes, because the note is already amended on this branch and unpublished in that form.
<!-- /ANCHOR:questions -->

---


