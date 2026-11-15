---
title: "Feature Specification: Phase 2: skilled-release-line"
description: "The 62 Skilled release entries had long sentences, and 626 ran past 22 words. This phase rewrites them with the phase 001 driver and syncs the 52 published GitHub release bodies."
trigger_phrases:
  - "skilled release line"
  - "phase 2 skilled release line"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 2: skilled-release-line

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
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/401-changelog-voice-rewrite` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 12 |
| **Predecessor** | 001-voice-rule-tooling-and-pilot |
| **Successor** | 003-sk-doc-changelogs |
| **Handoff Criteria** | Each of the 62 files is kept with every gate passed, or restored with its last finding recorded |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Rewrite every skill and release changelog to the Human Voice Rules with shorter sentences specification.

**Scope Boundary**: 62 Skilled release entries under `.skilled/changelog/skilled/`, including the `v1+/`, `v2+/` and `v3+/` folders, then the 52 published GitHub release bodies (v1.0.0.0 has no release), listed in `../scratch/lists/002.txt`. Only the files on that list change in this phase.

**Dependencies**:
- Phase 001: the amended voice rule, the briefs and the driver in `../scratch/`.
- The previous phase passing `validate.sh --strict`.

**Deliverables**:
- Rewrite the 62 release entries and sync the 52 published release bodies with `gh release edit`. Tags do not move.
- One `state.jsonl` row per file, kept or restored, and `measure-voice.py` numbers before and after.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
The Skilled release entries under `.skilled/changelog/skilled/` hold long sentences. Across the 60 entries this phase queues, 626 sentences run past 22 words and 50 files have at least one. One file also holds a hard blocker under the voice rules.

### Purpose
Every entry on the list reads in short plain sentences with every fact kept, and each published release body shows the same text.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ python3 ../scratch/measure-voice.py <the 60 queued files at HEAD>
files=60 sentences=5001 avg_words=13.7
sentences_over_15=1731 sentences_over_22=626
files_with_a_sentence_over_22=50 files_with_hvr_hard_blockers=1
```

The list holds 62 files. The pilot already rewrote `v4.0.0.0.md` and `v4.0.0.12.md` and committed them in `e673c77ba93`, so the driver queued 60.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Rewrite the 60 queued entries in `../scratch/lists/002.txt` with `../scratch/rewrite-driver.cjs`.
- Retry the files the first wave restored, once, with `--retry-failed`.
- Check the wave with `../scratch/wave-verify.cjs` and measure it with `../scratch/measure-voice.py`.
- Sync the GitHub release body of each changed entry that has a published release, after saving the old body.

### Out of Scope
- Any file outside `../scratch/lists/002.txt` - the later phases own them.
- Moving a release tag - only the release bodies change.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/changelog/skilled/**/v*.md` (51 files) | Modify | Rewritten entries that passed every gate |
| `../scratch/state.jsonl` | Modify | One record per dispatch with its tokens and verdict |
| `../scratch/wave-002.log`, `../scratch/wave-002-retry.log` | Create | Driver logs for the two waves |
| `scratch/release-bodies-before/`, `scratch/release-bodies-after/` | Create | 52 saved bodies and the 52 bodies sent |
| `scratch/evidence.txt` | Create | Measure, wave-verify and sync results |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Each of the 62 files on the list ends with a `pass` or `unchanged` record in `../scratch/state.jsonl`, or is restored to HEAD with its last finding recorded. |
| REQ-002 | `wave-verify.cjs` reports no problem for a file this phase rewrote, and no missing file. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | `measure-voice.py` on the 60 queued files after the waves prints `sentences_over_22=0` and `files_with_hvr_hard_blockers=0`. |
| REQ-004 | Each changed entry with a published release gets its body replaced by the new entry text, and each old body is saved first. Tags do not move. |
| REQ-005 | The run state records tokens for every dispatch, so the phase total can be reported. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: `measure-voice.py` prints `avg_words` of 10 or less and `sentences_over_22=0` on the 60 queued files.
- **SC-002**: Each synced release body read back with `gh release view` equals the text sent.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Vibe quota for the worker and Codex quota for the fact check | The wave stalls | The driver stops on a usage limit and restores in-flight files. The run then asks the operator and never moves the fact check to another provider |
| Risk | A split sentence changes a fact, such as a "could" made definite | High | The fact check rejects it, and a file that fails three attempts is restored to HEAD |
| Risk | A synced release body loses text the operator wants | Med | Each old body is saved in `scratch/release-bodies-before/` and can be restored with `gh release edit <tag> --notes-file` |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: A file finishes all gates within 15 minutes. The slowest kept file took 252 seconds.
- **NFR-P02**: N/A: throughput is set by the two driver slots.

### Security
- **NFR-S01**: The fact check runs in a read-only sandbox. The worker gets no tools.
- **NFR-S02**: N/A: no credential or personal data is read.

### Reliability
- **NFR-R01**: A failed or interrupted run leaves every file either rewritten and gated, or byte-identical to HEAD.
- **NFR-R02**: `wave-verify.cjs` checks each kept file and each unchanged file against HEAD before the commit.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: an entry that already passes both sentence rules is recorded `unchanged` and not dispatched. Nine were.
- Maximum input: a file already rewritten in the pilot is skipped, so the list's 62 files queue 60.
- Failure path: a file that fails three attempts is restored to HEAD with its last finding. Five were, and the retry wave kept all five.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | 60 entries and 52 release bodies |
| Risk | 14/25 | A rewrite can change a fact, and the release bodies are public |
| Research | 3/20 | Phase 001 settled the method and the cost |
| **Total** | **27/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Sync the release bodies now or after the last phase? Decision: the operator chose to sync now, through AskUserQuestion on 2026-11-15.
- None of the others blocks this phase.
<!-- /ANCHOR:questions -->

---


