---
title: "Feature Specification: Phase 9: chat-answer-evidence"
description: "The chat detector pairs a question with the next typed prompt by position, and the save model decides from raw text whether that prompt answered it. On the labelled fixture three of four candidates are new-task requests, and nothing in the stored record shows why a candidate was kept or left out. This phase adds one deterministic evidence object to every chat candidate and has the save copy it into the decision it writes."
trigger_phrases:
  - "chat answer evidence"
  - "phase 9 chat answer evidence"
  - "chat candidate evidence"
  - "decision capture chat evidence"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 9: chat-answer-evidence

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
| **Created** | 2026-11-03 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 10 |
| **Predecessor** | 008-project-scoped-state |
| **Successor** | 010-decision-routing-vocabulary |
| **Handoff Criteria** | Every acceptance criterion is Met, the decision-capture suites pass, and three scripted saves of the fixture in a scratch project each write exactly one chat entry, for pair 6. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the decision-capture series. It acts on gap 3 in `../research/research.md` §5, as corrected by the §13 verification addendum and `../research/synthesis-review.md` (P1-3, P1-4, P2-7 to P2-10).

**Scope Boundary**: The shared chat detector `lib/chat-questions.mjs`, its two shape-asserting tests, the labelled chat fixture, the decision step of `save.md`, and the feature catalog page that describes chat candidates. No auto-accept, no reject filter, no writer or queue change.

**Dependencies**:
- 008-project-scoped-state lands first, because it moves where queue rows live. This phase only adds a printed field, so it touches none of 008's files.
- `../007-gap-closure/decision-record.md` ADR-002, which rules out auto-accepting a lone candidate.

**Deliverables**:
- One nested `evidence` object with five deterministic fields on every chat candidate, from all five sweeps.
- A `save.md` chat rule that reads the evidence and copies a fixed-form summary into the entry's `why`.
- Unit tests per field, updated whole-object tests, an outcome check on the 7-pair fixture, and a larger labelled fixture.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
The detector turns every asking paragraph into a candidate against the next typed prompt, and the save writes an entry "for each chat candidate whose answer clearly replies to its question" (`save.md:72`). That sentence is the whole rule, so the model judges from raw text alone. On the labelled fixture three of the four candidates are new-task requests (replies on lines 2, 6 and 14) and one is a true answer (line 12). The stored record keeps no trace of why a candidate became a decision or was left out.

### Purpose
Every chat candidate carries deterministic evidence about its reply, and every chat decision the save writes shows that evidence in its `why`.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
Run read-only from the repository root on 2026-11-03. The first command feeds the fixture to the shared detector and prints, per candidate, the two turn ids, whether an `evidence` key exists, and the candidate's keys.

```text
$ node --input-type=module -e "
import { readFileSync } from 'node:fs';
import { chatCandidatesFromTurns } from './.skilled/hooks/decision-capture/lib/chat-questions.mjs';
const lines = readFileSync('.skilled/hooks/decision-capture/bin/fixtures/claude-chat-questions.jsonl', 'utf8').trim().split('\n').map((l) => JSON.parse(l));
const turns = lines.map((e) => e.type === 'assistant'
  ? { kind: 'assistant', id: e.uuid, text: e.message.content.filter((c) => c.type === 'text').map((c) => c.text).join('\n') }
  : { kind: 'prompt', id: e.uuid, text: e.message.content });
const { candidates, dropped } = chatCandidatesFromTurns({ runtime: 'claude', sessionId: 'fixture-session', turns, consumed: new Set() });
console.log('candidates', candidates.length, 'dropped', dropped);
for (const c of candidates) console.log(c.question_turn_id, c.answer_turn_id, 'evidence' in c, Object.keys(c).join(','));
"; echo "exit=$?"
candidates 4 dropped 0
fixture-a1 fixture-u1 false key,kind,question,answer,question_turn_id,answer_turn_id
fixture-a3 fixture-u3 false key,kind,question,answer,question_turn_id,answer_turn_id
fixture-a6 fixture-u6 false key,kind,question,answer,question_turn_id,answer_turn_id
fixture-a7 fixture-u7 false key,kind,question,answer,question_turn_id,answer_turn_id
exit=0
$ rg -c 'evidence' .skilled/hooks/decision-capture/lib/chat-questions.mjs; echo "exit=$?"
exit=1
$ rg -n 'clearly replies' .skilled/commands/speckit/save.md
72:   Write one `operatorDecisions` entry for each pending answer, and for each chat candidate whose answer clearly replies to its question.
$ node --test .skilled/hooks/decision-capture/lib/chat-questions.test.mjs .skilled/hooks/decision-capture/bin/sweep-transcript.test.mjs 2>&1 | tail -9
✔ candidates past the per-message cap are counted as dropped (0.451709ms)
ℹ tests 28
ℹ suites 0
ℹ pass 28
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 184.63675
$ node --test .skilled/hooks/decision-capture/{lib,bin,claude,devin}/*.test.mjs 2>&1 | tail -8 | head -4
ℹ tests 107
ℹ suites 0
ℹ pass 107
ℹ fail 0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Add one nested `evidence` object to every chat candidate in `chatCandidatesFromTurns`, with five fields: `questionType`, `optionMatch`, `contentOverlap`, `imperativeOpening` and `topicShift`, computed from the lexicons defined in `plan.md` §3.
- Rewrite the chat rule in `save.md` so the model reads the evidence before it judges a candidate, and copies a fixed-form `Evidence:` sentence into the `why` of every chat entry it writes.
- Update the two whole-object assertions (`sweep-transcript.test.mjs:183-192`, `chat-questions.test.mjs:25`), add unit cases per field, and add an outcome check on the 7-pair fixture.
- Grow the labelled chat fixture with a second fixture of labelled product pairs, including valid short answers and off-topic replies.
- Describe the evidence object in the feature catalog page `operator-decision-capture.md`.

### Out of Scope
- Auto-accepting any candidate - ADR-002 in `../007-gap-closure/decision-record.md` shows a lone candidate can be off-topic.
- A reject-only filter - deferred until a larger labelled set measures its false-reject rate. Today the set holds 4 product candidates and 1 positive.
- A new `evidence` field on `OperatorDecisionEntry` or in the verbatim appendix - it would change the writer, the input normalizer and the session types. The `why` sentence carries the evidence without a writer change.
- Any change to candidate keys, the per-message cap, the per-sweep cap or the process-question filter.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/decision-capture/lib/chat-questions.mjs` | Modify | Compute and attach the `evidence` object; define the lexicons as constants |
| `.skilled/hooks/decision-capture/lib/chat-questions.test.mjs` | Modify | Whole-object case gains `evidence`; unit cases per field |
| `.skilled/hooks/decision-capture/bin/sweep-transcript.test.mjs` | Modify | Whole-object case gains `evidence`; fixture test asserts each candidate's evidence |
| `.skilled/hooks/decision-capture/bin/fixtures/claude-chat-answers-extended.jsonl` | Create | Labelled product pairs beyond the 7-pair fixture |
| `.skilled/hooks/decision-capture/bin/fixtures/claude-chat-answers-extended.labels.json` | Create | One label per pair: `answers`, `synthetic` |
| `.skilled/commands/speckit/save.md` | Modify | Chat rule reads the evidence and writes the `Evidence:` sentence |
| `.skilled/skills/system-spec-kit/feature-catalog/ux-hooks/operator-decision-capture.md` | Modify | Name the evidence object and the `why` sentence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every answered chat candidate carries `evidence` with exactly five keys: `questionType` (`yes_no`, `alternative`, `open_value` or `numbered_list`), `optionMatch` (`true`, `false` or `not_applicable`, and `not_applicable` for every `open_value` and `numbered_list` question), `contentOverlap` (a whole number), `imperativeOpening` and `topicShift` (booleans). A candidate whose `answer` is null carries `evidence: null`. |
| REQ-002 | On the 7-pair fixture the four candidates carry the evidence in `plan.md` §3 "Expected fixture values": pairs 1, 3 and 7 have `imperativeOpening: true`, `contentOverlap: 0` and `optionMatch` not `true`; pair 6 has `questionType: numbered_list`, `optionMatch: not_applicable`, `contentOverlap: 3` and `imperativeOpening: false`. A `node --test` case asserts it. |
| REQ-003 | `save.md`'s chat rule names all five evidence fields, says the evidence informs the judgment and never replaces it, and requires every chat entry's `why` to end with one sentence of the form `Evidence: <questionType>, option <optionMatch>, overlap <n>, imperative <true/false>, shift <true/false>.` |
| REQ-004 | The decision-capture suites pass: `node --test .skilled/hooks/decision-capture/{lib,bin,claude,devin}/*.test.mjs`, the Pi vitest and the OpenCode plugin test. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | In a scratch project outside this repository (parent goal D4), three scripted full-auto saves of the 7-pair fixture each write exactly one chat entry to the scratch packet's `decision-record.md`, keyed to pair 6, with a `why` that ends in the `Evidence:` sentence. A baseline of three saves on the pre-change code is recorded first, so the summary can say whether the evidence changed the outcome or only made it visible. |
| REQ-006 | A second labelled fixture holds at least 12 product pairs with at least 5 positives, covering each `questionType`, and every pair carries a label `answers: true/false` and `synthetic: true/false`. A test prints its evidence; no threshold is asserted. |
| REQ-007 | The tests catch each field: unit cases cover the misspelt `Analyxe` opening, `First, make it blue` (no topic shift), `Push it` (no imperative), `make it blue` to an open question (`optionMatch: not_applicable`) and ADR-002's `actually first fix the login bug` (imperative and topic shift both true). |
| REQ-008 | The feature catalog page names the `evidence` object and the `why` sentence, and states that no candidate is accepted or rejected by code. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: The Measured Behavior command prints `true` in the `evidence` column for all four fixture candidates, and `rg -c 'evidence' .skilled/hooks/decision-capture/lib/chat-questions.mjs` prints a count.
- **SC-002**: Three scripted scratch saves of the fixture each write one chat row, for pair 6, and none for pairs 1, 3 and 7.
- **SC-003**: `validate.sh specs/system-speckit/043-decision-capture/009-chat-answer-evidence --strict` prints RESULT: PASSED.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 008-project-scoped-state moves the queue into a per-project folder | If 009 lands first, its scratch saves run against a queue path that is about to move | Start 009 only after 008's acceptance criteria are Met; 009 touches no 008 file |
| Risk | The model reads the evidence as a rule and drops a valid short answer such as `make it blue` | Med: a real decision goes unrecorded | `optionMatch` is `not_applicable` for open questions, "make" and "use" are not new-task verbs, and `save.md` says the evidence never replaces judgment; unit cases pin those answers |
| Risk | The evidence does not change the model's choice at all | Low: the record still shows why an entry was written | The baseline saves measure it; the summary reports the before and after counts as they are |
| Risk | The lexicons are tuned to one 4-candidate fixture | Med: values on real sessions may mislead | The second labelled fixture prints evidence for at least 12 pairs; the reject filter stays deferred until a larger set measures it |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: Evidence is computed only for candidates that survive both caps, so at most 20 per sweep. `/usr/bin/time -p node .skilled/hooks/decision-capture/bin/sweep-transcript.mjs --transcript <fixture>` in a temp folder stays within 10% of its pre-change `real` time.

### Security
- **NFR-S01**: The evidence holds an enum, two booleans, a count and an option flag. It copies no question or answer text beyond what the candidate already prints.

### Reliability
- **NFR-R01**: Candidate keys, `chat_candidates_dropped` and the process-question filter do not change: every existing assertion on keys and counts in `sweep-transcript.test.mjs` passes unedited.
- **NFR-R02**: The evidence is a pure function of the question and answer text: two sweeps of the same transcript print identical evidence.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: a candidate with no reply (`answer: null`) carries `evidence: null`, and the save already leaves it out.
- Maximum input: a 20-candidate sweep computes 20 evidence objects; a reply of only punctuation gives `contentOverlap: 0` and both booleans false.
- Failure path: no new failure path. The evidence code throws on nothing; an unreadable transcript still prints `error` and exits 1 as before.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 7 files, two of them new fixtures, about 250 lines; one module gains one function |
| Risk | 7/25 | The printed candidate shape changes on all five sweeps; nothing stored changes |
| Research | 4/20 | Done in `../research/research.md` §5 and §13; lexicons probed on the fixture during planning |
| **Total** | **19/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Where does the evidence live in the stored record? Decision: in the entry's `why`, as one fixed-form `Evidence:` sentence, after the stated reason or after `Not stated.`. An appendix field would need a writer change and is not needed to make the judgment auditable.
- Does the evidence change the model's choice or only explain it? Open until the baseline and after saves run (REQ-005); the summary reports both counts.
- When may a reject-only filter ship? Not in this phase. It waits on a labelled set large enough to measure its false-reject rate.
<!-- /ANCHOR:questions -->

---

