---
title: "Feature Specification: Phase 3: sk-doc-changelogs"
description: "The 298 sk-doc changelogs had long sentences, and 552 ran past 22 words. This phase rewrites them with the phase 001 driver, keeping every fact."
trigger_phrases:
  - "sk doc changelogs"
  - "phase 3 sk doc changelogs"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 3: sk-doc-changelogs

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
| **Phase** | 3 of 12 |
| **Predecessor** | 002-skilled-release-line |
| **Successor** | 004-system-spec-kit-changelogs |
| **Handoff Criteria** | Each of the 298 files is kept with every gate passed, or restored with its last finding recorded |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Rewrite every skill and release changelog to the Human Voice Rules with shorter sentences specification.

**Scope Boundary**: the 298 changelogs under `.skilled/skills/sk-doc/`, listed in `../scratch/lists/003.txt`. Only the files on that list change in this phase.

**Dependencies**:
- Phase 001: the amended voice rule, the briefs and the driver in `../scratch/`.
- The previous phase passing `validate.sh --strict`.

**Deliverables**:
- Rewrite the 298 sk-doc changelogs.
- One `state.jsonl` row per file, kept or restored, and `measure-voice.py` numbers before and after.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
The sk-doc changelogs under `.skilled/skills/sk-doc/` hold long sentences. Across the 296 changelogs this phase queues, 552 sentences run past 22 words and 210 files have at least one. Twelve files also hold a hard blocker under the voice rules.

### Purpose
Every changelog on the list reads in short plain sentences with every fact kept.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ python3 ../scratch/measure-voice.py <the 296 queued files at HEAD>
files=296 sentences=4169 avg_words=12.5
sentences_over_15=1280 sentences_over_22=552
files_with_a_sentence_over_22=210 files_with_hvr_hard_blockers=12
```

The list holds 298 files. The pilot already rewrote `sk-doc/changelog/v2.3.20.0.md` and `sk-create-command/changelog/v1.0.6.0.md` and committed them in `e673c77ba93`, so the driver queued 296. These numbers come from the measure tool after its span fix, described in the implementation summary.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Rewrite the 296 queued changelogs in `../scratch/lists/003.txt` with `../scratch/rewrite-driver.cjs`.
- Retry the files the first wave restored with `--retry-failed`.
- Fix the code span matcher in the driver and the measure tool when a file uses double-backtick spans.
- Check the wave with `../scratch/wave-verify.cjs` and measure it with `../scratch/measure-voice.py`.

### Out of Scope
- Any file outside `../scratch/lists/003.txt` - the later phases own them.
- A GitHub release sync - skill changelogs have no published release.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/**/changelog/v*.md` (248 files) | Modify | Rewritten changelogs that passed every gate |
| `../scratch/rewrite-driver.cjs` | Modify | The code span matcher accepts a backtick run of any length |
| `../scratch/measure-voice.py` | Modify | The same span fix in the measure tool |
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
| REQ-001 | Each of the 298 files on the list ends with a `pass` or `unchanged` record in `../scratch/state.jsonl`, or is restored to HEAD with its last finding recorded. |
| REQ-002 | `wave-verify.cjs` reports no problem for a file this phase rewrote, and no missing file. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | `measure-voice.py` on the 296 queued files after the waves prints `sentences_over_22=0` and `files_with_hvr_hard_blockers=0`. |
| REQ-004 | The span fix gives the same spans as the old pattern on every scope file without a double backtick. |
| REQ-005 | The run state records tokens for every dispatch, so the phase total can be reported. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: `measure-voice.py` prints `avg_words` of 10 or less and `sentences_over_22=0` on the 296 queued files.
- **SC-002**: `wave-verify.cjs` keeps every rewritten file and finds no missing file.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Vibe quota for the worker and Codex quota for the fact check | The wave stalls | The driver stops on a usage limit and restores in-flight files. The run then asks the operator and never moves the fact check to another provider |
| Risk | A split sentence changes a fact | High | The fact check rejects it, and a file that fails three attempts is restored to HEAD |
| Risk | A change to the span matcher loosens the structure lock | Med | The new pattern gives the same spans as the old one on every scope file without a double backtick, and the wave check still keeps all earlier passes |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: A file finishes all gates within 15 minutes. The slowest file took 111 seconds.
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

- Empty input: a changelog that already passes both sentence rules is recorded `unchanged` and not dispatched. 48 were.
- Maximum input: a file already rewritten in the pilot is skipped, so the list's 298 files queue 296.
- Failure path: a file that fails three attempts is restored to HEAD with its last finding. One was, because of a span matcher bug, and it passed once the matcher was fixed.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 296 changelogs and one matcher fix in two scratch tools |
| Risk | 10/25 | A rewrite can change a fact, and the matcher fix touches a gate |
| Research | 3/20 | Phase 001 settled the method and the cost |
| **Total** | **25/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- None. The operator asked on 2026-11-15 for the remaining phases to run without further questions.
<!-- /ANCHOR:questions -->

---
