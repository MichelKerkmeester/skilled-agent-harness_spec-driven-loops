---
title: "Feature Specification: Phase 11: opencode-pi-handover-parity"
description: "A Pi hop on DeepSeek left its note claimed and lost a detail the History Lookup held, because the sender wrote that the detail could not be recovered and the receiver asked the operator instead of running the lookup."
trigger_phrases:
  - "opencode pi handover parity"
  - "phase 11 opencode pi handover parity"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 11: opencode-pi-handover-parity

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
| **Created** | 2026-11-16 |
| **Branch** | `worktrees/422-opencode-pi-handover-parity` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 of 11 |
| **Predecessor** | 010-history-secret-redaction |
| **Successor** | None |
| **Handoff Criteria** | Every completion criterion in `goal.md` holds |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the history lookup hand-over integration.

**Scope Boundary**: Real hand-over hops on OpenCode and Pi, from prepare through claim, the History Lookup and close of the note.

**Dependencies**:
- Phase 010 intake redaction and the cross-runtime parity work already on main

**Deliverables**:
- The fixes the research names, proven by the live-hop harness in `scratch/harness/`
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
On a live Pi hop with DeepSeek V4.1 Flash at max thinking, the sender kept the side word out of its note as told and then wrote that a fresh session could not recover it. The receiver was offered a working History Lookup, did not run it, asked the operator for the side word and left the note `claimed`. The same task on OpenCode passed, so the hop is not yet reliable on both runtimes.

### Purpose
A hand-over hop on OpenCode or Pi finishes the sender's task, and the new session recovers any detail the note left out through the History Lookup.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ bash scratch/harness/live-hop.sh opencode base1 600 && node scratch/harness/score.cjs runs/base1-opencode
"noteClosed": true, "receiverAnswered": true, "sideWordStated": true, "sideWordInNote": false, "score": "5/5"

$ PI_ROUTE=deepseek bash scratch/harness/live-hop.sh pi base1 600 && node scratch/harness/score.cjs runs/base1-pi
"noteClosed": false, "receiverAnswered": true, "sideWordStated": true, "sideWordInNote": false, "score": "4/5"
Pi receiver reply: "The side word I cannot recover ... not through the note, not through history lookup, since it was never written."

$ SPECKIT_RUNTIME=pi node .skilled/hooks/session-handover/bin/history-lookup.mjs --session 01a1e2d7-... --handle hl1_... search '{"query":"side word"}'
returns the sender's first user turn (historyId 06f365f0), whose text holds the side word
```
The Pi scorer's `sideWordStated: true` counts the sender's own prompt in the pane, so the pane text, not the score, records the miss.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Find every gap between a Claude hop and an OpenCode or Pi hop through `/deep:research`, starting from the Pi miss above
- Fix each gap in the hand-over or history code, or in the text the sender and receiver read
- Prove each fix with live hops from this packet's harness on both runtimes

### Out of Scope
- Claude, Codex and Vibe hops - they already pass and are not the target here
- Model choice for the receiver - D2 in `goal.md` pins DeepSeek Flash at max so a pass does not depend on a stronger model

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| UNKNOWN until the research synthesis | Modify | The synthesis in `research/research.md` names the files |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A Pi receiver on DeepSeek Flash at max recovers a detail the note left out through the History Lookup and closes the note | Three consecutive `PI_ROUTE=deepseek live-hop.sh pi` runs score 5/5, and each receiver reply states the side word |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | An OpenCode hop keeps passing, and a planted fake token reaches either receiver only as a redaction marker | Three consecutive `live-hop.sh opencode` runs score 5/5; one planted-token hop per runtime shows `[REDACTED:` and never the token |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: Six consecutive live hops, three per runtime, score 5/5 with the side word stated by the receiver and absent from the note.
- **SC-002**: The history engine, hooks vitest, session readers and handover suites, run with `env -u AI_SESSION_CHILD`, exit 0 with no fewer passing tests than their baseline.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | LLM Gateway and OpenCode Go reachable for live hops and research | A hop cannot run | Retry later; record the outage in `goal.md` instead of counting the run |
| Risk | Model behavior varies run to run, so one passing hop can be luck | High | Require three consecutive passes per runtime |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Why did the Pi sender write that the side word could not be recovered, when the OpenCode sender pointed its receiver at the History Lookup? Answered: nothing tells a sender the lookup exists, so each model guesses. See `research/research.md` section 6.
- How should OpenCode 2 carry model and effort across a relaunch, when its root command takes no model flag? Deferred to a later phase.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
Research findings, abridged from `research/research.md`:
- The hop's machinery works on both runtimes. What fails is what the two models are told.
- The sender's prepare text never names the History Lookup, so a sender can write that a detail kept out of the note is lost.
- The receiver's seed steps never name the lookup, and the claim prints the offer after the note with a weaker instruction, so a note that says "ask the operator" wins.
- Redaction misses credentials under prefixed or plural keys and inside arrays.
- The harness scorer can count the sender's echoed prompt as recall, and it plants no secret.
- Browse previews stop at 160 characters with no sign that they stop.
- OpenCode 2 carries neither model nor effort on relaunch. Deferred.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---


