---
title: "Feature Specification: Find why a command routing baseline capture run straight after a skill graph scan reads the state from before the scan"
description: "A vendoring project saw a command routing baseline capture, run in the same command as a skill graph scan, return the value from before the scan for one row. It happened twice and no cause was found. It has not been reproduced in this repository."
trigger_phrases:
  - "baseline capture after graph scan"
  - "find why a command routing baseline capture run"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Find why a command routing baseline capture run straight after a skill graph scan reads the state from before the scan

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-11-16 |
| **Branch** | `worktrees/425-repin-engine-limits-intake` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
A vendoring project reported, as item 10 of its second handover, that `capture-command-routing-baseline.mjs` run in the same command as `skill-advisor.cjs skill_graph_scan --trusted` returned the value from before the scan for one row. It saw this twice. A capture a minute later returned the new value three times in a row. The handover is copied as `specs/system-skilled-doctor/001-skill-and-overlay-build/010-fix-barter-repin-handover-items-for-overlay-engine/handover-from-barter-024.md`.

The cause is unknown, and the code does not explain the report by reading. A default capture points `SYSTEM_SKILL_ADVISOR_DB_DIR` at a new empty folder, so the scorer builds its projection from the `graph-metadata.json` files and never reads the database the scan writes. The scan handler awaits `indexSkillMetadata` and `refreshSkillEmbeddings` before it returns. A baseline that depends on when it was captured is a ratchet nobody can trust, so the report is worth one bounded investigation.

A second item from the same project's first handover belongs to the same two files. `command-routing-baseline.json` and `tests/parity/fixtures/local-native-approved-divergences.json` hold captured values that follow from the hub vocabulary. A host with its own vocabulary gets other values, so `command-routing-slice.vitest.ts` and `local-native-divergence-ratchet.vitest.ts` fail there until the host overlays single rows of both files. That handover is copied as `specs/system-skilled-doctor/001-skill-and-overlay-build/012-fix-barter-022-handover-items-for-doctor-scripts/handover-from-barter-022.md`, item 4.

### Purpose
A host has a supported way to hold its own captured values. The capture's stale read is reproduced and its cause named with a receipt, or the packet closes as not reproduced with what was tried and what the vendoring project should record next time.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->

```text
N/A: the behavior has not been reproduced in this repository. Reproducing it runs
`skill_graph_scan --trusted`, which rewrites advisor state, and the operator chose
plan-only for this packet. T001 to T003 are the reproduction. What was read instead:

$ rg -n 'SYSTEM_SKILL_ADVISOR_DB_DIR = dbDir|mkdtempSync' .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs
353:  const dbDir = realEmbedding ? null : mkdtempSync(join(tmpdir(), 'advisor-command-routing-'));
361:      process.env.SYSTEM_SKILL_ADVISOR_DB_DIR = dbDir;
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Reproduce the report with a script that runs the scan and the capture in one command, several times, and compares each capture's rows with a capture made a minute later.
- Record what every input of the capture held at both moments: each `graph-metadata.json`, the generated command bridges, the hub closures that `compiled-route.cjs` serves and the scan's generation file.
- Name the cause with a receipt, and fix it where the stale value is produced.
- Tell the vendoring project the result, including what to record if it is not reproduced here.
- Decide and build one form for a host's captured values: its own capture file beside the upstream one, or rows the two tests skip when a host marks them. The operator chose the capture file on 2026-11-16.

### Out of Scope
- The `--real-embedding` mode of the capture - the report is about the default capture. It comes into scope only if the reproduction points there.
- A wait or a retry added to the capture before the cause is known - it would hide the producer.
- The router changes of items 8 and 9 - they are `specs/sk-code/hub-architecture/008-host-surface-hint-and-score-window`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scratch/repro-capture-after-scan.sh` in this folder | Create | The reproduction |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-routing-slice.vitest.ts` and `.skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts` | Modify | Read a host's capture when one exists |
| UNKNOWN until T004 names the cause | Modify | The fix belongs where the stale value is produced. Candidates by reading: `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs` and `.skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/scan.ts` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The report is tried in this repository at least ten times, in one command each | `scratch/repro-capture-after-scan.sh` writes one result line per run to `scratch/repro-results.txt`, ten lines or more |
| REQ-002 | The outcome is recorded either way | `goal.md` section 4 names the cause with the command that shows it, or says not reproduced and lists what was tried |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | When a cause in this repository's code is found, it is fixed at its producer with a test that failed first | The new test fails without the fix and passes with it, and the reproduction prints no differing row in ten runs |
| REQ-004 | The vendoring project is told the result | `handover-to-barter.md` exists in this folder |
| REQ-005 | A host can hold captured values that differ from upstream's without overlaying single rows | A test runs the two fixture tests against a host capture and reads 0 failed, and the same two tests still fail on a changed row with no host capture |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: `scratch/repro-results.txt` holds ten result lines or more, each `same` or `differs` with the row id that differed.
- **SC-002**: The third line of the handover's validation checklist holds, or `goal.md` says why it could not be tested here: a capture run in the same command as a scan returns the same rows as one run a minute later.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The advisor daemon and, for the scan's embedding refresh, a local embedder | Without them the scan takes a different path than the one the vendoring project ran | Record in each result line whether the daemon was running and whether the embedder answered |
| Risk | The cause is in the vendoring project's tree or overlays and cannot be reproduced here | Medium. The packet would close without a fix | REQ-002 allows that outcome, and `handover-to-barter.md` then lists what to record at the next occurrence |
| Risk | The reproduction rewrites advisor state in the checkout it runs in | Low. The state is generated | Run it in a worktree and confirm `git status --short` is clean afterwards |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Which row returned the old value, and which field? Answered by the vendoring project on 2026-11-16: the field is `top` in `command-routing-baseline.json`, both times. Its records do not name the rows. It infers `cmd-design-extract-plain-holdout-01` and `mns-d3-04`, the two rows whose `top` moved during that work.
- Which form should a host's captured values take? Decided by the operator on 2026-11-16: a host capture file beside the upstream one, which the two tests read when it exists.
- Did the vendoring project change a `graph-metadata.json` or a router file just before the scan? Answered on 2026-11-16: yes, both times. It had changed sk-code router sources and run the overlay engine's `apply`, whose regenerate step `generate-router-intent-signals.cjs --write` rewrites sk-code's `graph-metadata.json`. The scan and the capture then ran back to back in one shell command. The keyword `lcp regression` was being added to or removed from the frontend intents. Whether a daemon or launcher process was alive across the scan was not checked.
<!-- /ANCHOR:questions -->

---


