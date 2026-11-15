---
title: "Feature Specification: Phase 12: small-skill-changelogs"
description: "The 98 changelogs of five small skills had long sentences, and 139 ran past 22 words. This phase rewrites them with the phase 001 driver, keeping every fact."
trigger_phrases:
  - "small skill changelogs"
  - "phase 12 small skill changelogs"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 12: small-skill-changelogs

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
| **Phase** | 12 of 12 |
| **Predecessor** | 011-sk-git-changelogs |
| **Successor** | None |
| **Handoff Criteria** | Each of the 98 files is kept with every gate passed, or restored with its last finding recorded |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the Rewrite every skill and release changelog to the Human Voice Rules with shorter sentences specification.

**Scope Boundary**: the 98 changelogs of sk-prompt, cli-classifier, mcp-code-mode, cli-orca and system-skilled-doctor, listed in `../scratch/lists/012.txt`. Only the files on that list change in this phase.

**Dependencies**:
- Phase 001: the amended voice rule, the briefs and the driver in `../scratch/`.
- The previous phase passing `validate.sh --strict`.

**Deliverables**:
- Rewrite the 98 changelogs of the five small skills.
- One `state.jsonl` row per file, kept or restored, and `measure-voice.py` numbers before and after.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
The changelogs of the five small skills hold long sentences. Across the 95 changelogs this phase queues, 139 sentences run past 22 words and 57 files have at least one. Two files also hold a hard blocker under the voice rules.

### Purpose
Every changelog on the list reads in short plain sentences with every fact kept.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ python3 ../scratch/measure-voice.py <the 95 queued files at HEAD>
files=95 sentences=1272 avg_words=12.3
sentences_over_15=379 sentences_over_22=139
files_with_a_sentence_over_22=57 files_with_hvr_hard_blockers=2
```

The list holds 98 files. The pilot already rewrote `sk-prompt/changelog/v1.4.0.0.md`, `cli-classifier/cli-jev/changelog/v0.1.1.0.md` and `cli-classifier/cli-jev/changelog/v0.1.4.0.md` and committed them in `e673c77ba93`, so the driver queued 95.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Rewrite the 95 queued changelogs in `../scratch/lists/012.txt` with `../scratch/rewrite-driver.cjs`.
- Retry the files the first wave restored with `--retry-failed`.
- Check the wave with `../scratch/wave-verify.cjs` and measure it with `../scratch/measure-voice.py`.

### Out of Scope
- Any file outside `../scratch/lists/012.txt` - the earlier phases owned them, and this is the last phase.
- Any change to the driver or the briefs - this phase needed none.
- A GitHub release sync - skill changelogs have no published release.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Changelogs under `.skilled/skills/sk-prompt/`, `cli-classifier/`, `mcp-code-mode/`, `cli-orca/` and `system-skilled-doctor/` (69 files) | Modify | Rewritten changelogs that passed every gate |
| `../scratch/state.jsonl` | Modify | One record per dispatch with its tokens and verdict |
| `scratch/evidence.txt` | Create | Measure, wave and wave-verify results |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Each of the 98 files on the list ends with a `pass` or `unchanged` record in `../scratch/state.jsonl`, or is restored to HEAD with its last finding recorded. |
| REQ-002 | `wave-verify.cjs` reports no problem for a file this phase rewrote, and no missing file. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | `measure-voice.py` on the 95 queued files after the waves prints `files_with_hvr_hard_blockers=0`, and every sentence over 22 words it still counts sits in a file restored to HEAD. |
| REQ-004 | A file the first wave restores is retried with `--retry-failed`, and its result is recorded. |
| REQ-005 | The run state records tokens for every dispatch, so the phase total can be reported. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: `measure-voice.py` prints `avg_words` of 10 or less on the 95 queued files, with no sentence over 22 words in a kept file.
- **SC-002**: `wave-verify.cjs` keeps every rewritten file and finds no missing file.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The Vibe plan for the worker, reached through the browser-login key in the macOS Keychain, and Codex quota for the fact check | The wave stalls | The driver stops on a usage limit or a 402 budget error and restores in-flight files. The run then asks the operator and never moves the fact check to another provider |
| Risk | A split sentence changes a fact | High | The fact check rejects it, and a file that fails three attempts is restored to HEAD |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: Each worker call is capped at 15 minutes. The slowest kept file, `system-skilled-doctor/changelog/v1.0.0.0.md`, took 124 seconds over three attempts.
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

- Empty input: a changelog that already passes both sentence rules is recorded `unchanged` and not dispatched. 25 were.
- Maximum input: a file already rewritten in the pilot is skipped, so the list's 98 files queue 95.
- Failure path: a file that fails three attempts is restored to HEAD with its last finding. The first wave restored 2. One passed on retry, and `.skilled/skills/mcp-code-mode/changelog/v1.0.10.0.md` was restored again on the retry and on a second retry.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | 95 changelogs across five skills and no tool change |
| Risk | 9/25 | A rewrite can change a fact |
| Research | 3/20 | Phase 001 settled the method and the cost |
| **Total** | **21/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- None. The operator asked on 2026-11-15 for the remaining phases to run without further questions.
<!-- /ANCHOR:questions -->

---
