---
title: "Feature Specification: Phase 7: purpose-reader-coverage"
description: "The purpose helper reads a packet's purpose only under an exact ### Purpose heading, so 274 live packets that state their purpose another way show a parent's purpose or none after a compaction or a save. This phase widens the reader to those shapes and fixes two ways the first-sentence rule returns a broken line."
trigger_phrases:
  - "purpose reader coverage"
  - "phase 7 purpose reader coverage"
  - "problem and purpose heading without subheading"
  - "inline purpose label"
  - "packet purpose first sentence abbreviation"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 7: purpose-reader-coverage

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/374-purpose-carry-follow-ups` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 10 |
| **Predecessor** | 006-purpose-carry-follow-ups |
| **Successor** | 008-hop-purpose-rule-parity |
| **Handoff Criteria** | `packet-purpose.vitest.ts` prints `Tests  9 passed (9)` and the probe prints `001-goal-hooks-cross-runtime packet` and `001-deep-research packet` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the Carry a packet's purpose across handovers and compactions specification.

**Scope Boundary**: The two text-extraction functions in `.skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts`, its test file and the one README row that describes what the helper reads. No change to how the helper walks to a parent, to its three output labels, to the 300-character cap or to any hook that calls it.

**Dependencies**:
- None blocking. Phases 004 and 005 built the helper this phase edits. Phase 006 is independent and can land before or after.

**Deliverables**:
- `extractPurposeParagraph` reads a purpose under a level-two purpose heading and in a labelled paragraph, as well as under `### Purpose`
- `authoredSentence` drops a leading list marker and does not end a sentence at `e.g.`, `i.e.`, `vs.` or `cf.`
- Five new tests in `runtime/tests/packet-purpose.vitest.ts`
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
The operator wants the next AI to see why a packet exists after a compaction or a continuity save. The helper that supplies that line, `resolvePacketPurpose`, finds a purpose only under a heading that reads exactly `### Purpose` (`packet-purpose.ts:54`). 292 live `spec.md` files have no such heading, and 274 of them still state a purpose: under a level-two heading such as `## 2. PROBLEM & PURPOSE` with no subheading, and in 33 of those also in a paragraph that opens with `Purpose:` or `**Purpose:**`. For every one of these packets the helper returns the purpose of a parent folder, or nothing, in place of the packet's own.

The line it does return is sometimes broken. `authoredSentence` takes everything up to the first full stop, so a Purpose written as a numbered list yields `1.` and a sentence that holds `e.g.` or `vs.` is cut at the abbreviation (`packet-purpose.ts:82`).

### Purpose
Make the purpose helper return a packet's own purpose for the live packets that state it without a `### Purpose` heading, 272 of the 292 that lack the heading when this was planned, and stop it returning a list marker or a sentence cut at an abbreviation.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
All five ran from the worktree root on 2026-11-14 at `bd79708c2f`, after this phase's four sibling folders were scaffolded. They count live `spec.md` files, leaving out `z_archive`, `scratch` and `lineages` folders. The second counts the files with no exact `### Purpose` heading. The third and fourth count how many of those carry one of the four heading names this phase reads, and how many carry a purpose label. The fifth tallies the heading texts, with digits shown as `N`.
```text
$ rg --files specs -g spec.md -g '!**/z_archive/**' -g '!**/scratch/**' -g '!**/lineages/**' | wc -l
    2963

$ rg --files-without-match '^\s*###\s+Purpose\s*$' specs -g spec.md -g '!**/z_archive/**' -g '!**/scratch/**' -g '!**/lineages/**' | wc -l
     292

$ rg --files-without-match '^\s*###\s+Purpose\s*$' specs -g spec.md -g '!**/z_archive/**' -g '!**/scratch/**' -g '!**/lineages/**' | xargs rg -l -i '^\s*##\s+(?:\d+\.\s+)?(?:PROBLEM (?:&|AND) PURPOSE|ROOT PURPOSE|PURPOSE)\s*$' | wc -l
     274

$ rg --files-without-match '^\s*###\s+Purpose\s*$' specs -g spec.md -g '!**/z_archive/**' -g '!**/scratch/**' -g '!**/lineages/**' | xargs rg -l -i '^\s*(?:[-*]\s+)?\*{0,2}Purpose\*{0,2}\s*:' | wc -l
      33

$ rg --files-without-match '^\s*###\s+Purpose\s*$' specs -g spec.md -g '!**/z_archive/**' -g '!**/scratch/**' -g '!**/lineages/**' | xargs rg --no-filename -o -i '^\s*#{1,6}\s+.*purpose.*$' | sed -E 's/[0-9]+/N/g' | sort | uniq -c | sort -rn
 237 ## N. PROBLEM & PURPOSE
  19 ## N. ROOT PURPOSE
  11 ## Root Purpose
   3 ## Purpose
   2 ## N. PURPOSE
   1 ## Root purpose
   1 ## N. PROBLEM AND PURPOSE
```

What these numbers do and do not show. A count of files that name a purpose heading or a purpose label, taken together, also prints 274, so every one of the 33 labelled files is among the 274. The other 18 of the 292 hold no purpose text in either shape and stay unread after this phase. The counts show where the text sits. They do not show what the helper returns for each file, because this planning session could not run `node`. The reviewer's run of the built helper over the same tree reported that `001-goal-hooks-cross-runtime` resolves to nothing and that `001-deep-research` under `002-mode-and-lane-migrations` resolves to a purpose taken from three levels up. Task T002 reruns that check before any edit.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Extend `extractPurposeParagraph` in place so that, when no `### Purpose` heading exists, it reads the purpose section under a level-two heading named `PROBLEM & PURPOSE`, `PROBLEM AND PURPOSE`, `ROOT PURPOSE` or `PURPOSE`, with or without a leading number.
- Read the paragraph that opens with `Purpose:` or `**Purpose:**` inside that section when one exists, with the label removed, and the section's first paragraph when none does.
- Change `authoredSentence` so it drops a leading list marker and does not treat the full stop of `e.g.`, `i.e.`, `vs.` or `cf.` as the end of the sentence.
- Add five tests that each fail today for one of these shapes.
- Reword the one README row that says the helper reads only `### Purpose`.

### Out of Scope
- The 300-character cap that cuts 11.6% of first sentences, by the reviewer's count - the cap keeps the stored `packet_purpose` value under the 512-character limit of the continuity block, and a 300-character opening still states the purpose.
- Short but complete first sentences such as `Measure it.` - that is the author's wording, and joining sentences would change what a packet says.
- The 18 files with no purpose text and the files whose Purpose is still a bracket placeholder - nothing is written there to read, and the helper already falls back to a parent.
- Rewriting the 274 `spec.md` files to add a `### Purpose` heading - an edit in 274 packets across every track, where one change to the reader gives the same result.
- The `### Purpose` wording in the resume assets, `handoff.md` and `nudge.cjs` - phase 008 aligns those with this reader.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts` | Modify | Four constants, one extracted paragraph reader, a wider `extractPurposeParagraph` and two changes in `authoredSentence` |
| `.skilled/skills/system-spec-kit/runtime/tests/packet-purpose.vitest.ts` | Modify | One fixture helper, five fixtures and five tests |
| `.skilled/skills/system-spec-kit/runtime/lib/spec/README.md` | Modify | The row for `packet-purpose.ts` names the shapes the helper reads |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The helper reads a purpose under a level-two purpose heading and in a labelled paragraph, and still reads `### Purpose` first | `../node_modules/.bin/vitest run --config vitest.config.ts runtime/tests/packet-purpose.vitest.ts`, run from `.skilled/skills/system-spec-kit/runtime`, prints `Tests  9 passed (9)` |
| REQ-002 | Two real packets that resolve to a parent or to nothing today resolve to their own purpose | `node <this folder>/scratch/probe-reader.mjs`, fed the file list and the two folders named in `tasks.md`, prints `001-goal-hooks-cross-runtime packet` and `001-deep-research packet` |
| REQ-003 | A purpose label outside a purpose section is not read as the packet's purpose | The test `ignores a purpose label outside a purpose section` passes inside the REQ-001 run |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The first-sentence rule drops a list marker and keeps a sentence whole across `e.g.` | The test `drops a list marker and does not end the sentence at an abbreviation` passes inside the REQ-001 run |
| REQ-005 | The hooks and the save path that call the helper are unchanged | `hook-session-start.vitest.ts` prints `(23 tests)`, `history-locator-adapters.vitest.ts` prints `(18 tests)`, both pass, and `npm run typecheck` in the runtime folder exits 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: `packet-purpose.vitest.ts` goes from 4 passing tests to 9, and each of the five new tests fails on the code as it stands today.
- **SC-002**: The probe prints `packet` for `001-goal-hooks-cross-runtime` and for `001-deep-research`, where the reviewer's run recorded `none` and `ancestor`.
- **SC-003**: The probe's last line, `own purpose read: <n> of 292`, is recorded in `implementation-summary.md`. Today the number is 0, because the 292 files are the ones the exact-heading test at `packet-purpose.ts:54` rejects.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The runtime `dist` build. The compaction hooks and the save path load `dist/lib/spec/packet-purpose.js`, and `dist/` is git-ignored | Without a build the live hooks keep the old reader | Run `npm run build` in the runtime folder after the edit, then run the probe, which loads the built file |
| Risk | Under a combined `PROBLEM & PURPOSE` heading with no label, the first paragraph is usually the problem, so the line printed as `Purpose:` states the problem | Low. The problem is the reason the work exists, which is what the operator asked to keep | The labelled paragraph wins when the author marked one, and the test for it pins that order |
| Risk | The planned code was not run. This session could not start `node`, so the five tests and the replacement text were checked by reading only | Medium. A regex or an index can be off by one | T004 confirms each search text matches once, the five tests assert exact strings and T010 stops the phase when any of the nine fails |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Should the reader change, or the 274 documents? Decision: the reader. Extending `extractPurposeParagraph` is one function in one file. Adding a heading to 274 `spec.md` files touches every track and leaves the next old-shape packet unread again.
- Which headings count as a purpose section? Decision: the four names the tally in Measured Behavior found, and no pattern wider than that. A heading that only contains the word purpose, such as `## Purpose of the audit`, is not read.
- Is a purpose label read anywhere in the document? Decision: no, only between the purpose heading and the next level-two heading. All 33 labelled files sit inside the 274 that have such a heading, and a label in a table or a later section is not the packet's purpose.
- Should the cap rise above 300 characters so fewer sentences are cut? Decision: no. The formatted line is stored in `packet_purpose`, which the writer drops above 512 characters, and an inherited line also carries the parent folder path.
<!-- /ANCHOR:questions -->

---
