---
title: "Feature Specification: Phase 5: chat-question-detection"
description: "The Claude transcript sweep offers a plain chat question only when it sits in the closing paragraph of an assistant message, so a question asked earlier in the message never reaches the save step. This child plans detection of a question in any paragraph, with a per-message cap, a stable per-question key and the closing-paragraph candidate left exactly as it is."
trigger_phrases:
  - "chat question detection"
  - "phase 5 chat question detection"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 5: chat-question-detection

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-01 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 6 |
| **Predecessor** | 004-opencode-devin-live-capture |
| **Successor** | 006-live-conversation-test |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met, and `node --test` on the sweep and capture-core test files prints `ℹ fail 0`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the decision-capture series. The parent, `specs/system-speckit/043-decision-capture`, is a series parent: each child is a separate change to the same capture feature. Its child `001-decision-capture-build` is the finished build that captures answers, writes them at save time and nudges at session end.

**Scope Boundary**: Only how `sweep-transcript.mjs` turns a text-only assistant message and the typed reply after it into chat candidates. Tool-answer recovery, the process filter's patterns, the writer and the other runtimes' sweeps stay as 001 shipped them.

**Dependencies**:
- The 001 build: `chatCandidate` and `lastParagraph` in `sweep-transcript.mjs`, and `chatSourceKey` and `isProcessQuestion` in `capture-core.mjs`.
- The writer's source-key pattern `^[A-Za-z0-9:._-]+$` in `decision-record-writer.ts`, which every new key must match.
- `../006-live-conversation-test/`, the series harness that re-proves this child in a real conversation.

**Deliverables**:
- A sweep that offers up to three chat candidates per message, one per asking paragraph, each with its own stable key.
- A redacted real-transcript fixture with labels, and tests that hold the caps, the keys and the unchanged closing-paragraph candidate.
- One added sentence in the save step about candidates that share one reply.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
`chatCandidate` in `sweep-transcript.mjs` reads only the last paragraph of an assistant message and returns null unless that paragraph contains `?`. A decision question asked earlier in the message, such as a numbered "Decisions for you" list followed by a status paragraph, never reaches the save step, so the operator's answer is lost unless someone adds it by hand. 001 recorded this as Known Limitation 2: "In the main session 1 of 17 typed replies qualified".

### Purpose
The save step sees a question the operator answered wherever it sat in the message. Each message yields at most three candidates, and keys stay stable from one sweep to the next.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
Run on 2026-11-01 from the repository root. The second command is read-only: it repeats the sweep's pairing without calling `sweepTranscript`, so no queue file is written. Columns: `replies` are typed replies after a text-only message, `closing` the current rule's candidates after the process filter, `earlier` the replies whose message asks only in an earlier paragraph, `units` the draft rule's candidates after the filter and a cap of 3, `max` the most asking units in one message.

```text
$ node --test .skilled/hooks/decision-capture/bin/sweep-transcript.test.mjs; echo "exit=$?"
✔ two answered question rounds are recovered and stay pending (3.453375ms)
✔ a record the hook already queued is not appended again (1.886709ms)
✔ an answered chat question is offered with its exact wording (0.546792ms)
✔ a closing question with no reply stays an unanswered candidate (0.401417ms)
✔ text followed by a tool call is not a chat question (0.367375ms)
✔ a consumed chat key is not offered again (1.0475ms)
✔ a documentation-scope question is not a chat candidate (0.582958ms)
✔ sidechain lines are ignored (0.40575ms)
✔ the CLI prints the sweep result for the given transcript (27.245833ms)
✔ the CLI reports an unreadable transcript and exits 1 (25.458541ms)
ℹ tests 10
ℹ suites 0
ℹ pass 10
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 96.374792
exit=0

$ T=~/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Skilled
$ node specs/system-speckit/043-decision-capture/005-chat-question-detection/scratch/measure-chat-questions.mjs $(ls -t $T/*.jsonl | head -10); echo "exit=$?"
file	replies	closing	earlier	units	max
fe0c9990	26	1	2	2	1
76f33f83	14	2	0	2	1
ce59ece4	3	0	0	0	0
8392e5d6	0	0	0	0	0
dc90f89a	134	6	1	7	1
866f15c8	12	5	1	5	1
0e45e7fc	1	0	0	0	0
d1e4fb9c	15	4	0	4	1
84178de4	11	1	0	1	1
62098141	35	1	3	3	1
TOTAL	251	20	7	24	1
exit=0
```

Across the ten newest transcripts, 251 typed replies follow a text-only message. The current rule offers 20 candidates, and the draft rule offers 24, the 20 plus 4 from earlier paragraphs. No message holds more than 1 asking unit, and no session yields more than 7 candidates. Reading the 7 `earlier` pairs by hand: 3 are commit, push or spec-folder questions that the process filter drops, 1 is a numbered decision list the reply answers point by point, and in 3 the reply moves on to something else. That hand count is a judgement until the labels file in the fixture task records it. 001 recorded the main-session sweep as "57 answers recovered, 1 chat candidate". `fe0c9990` is that session, now with 26 typed replies where 001 counted 17. That match is an inference from the session's age and its single closing candidate.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Detect an asking paragraph anywhere in a text-only assistant message, and keep an options-only paragraph that follows with its question.
- Cap the candidates at 3 per message and 20 per sweep, rank the cut and print how many the session cap dropped.
- Give every earlier-paragraph candidate a key that stays the same across sweeps, and keep the closing-paragraph key unchanged.
- Build a redacted real-transcript fixture with labels and measure the rule on it.
- Add one sentence to the save step about several candidates that share one reply.
- Offer chat candidates on OpenCode, Devin, Codex and Pi as well, through one runtime-neutral detector that every session reader feeds. Added 2026-11-02 by ADR-001, on the operator's decision after the 006 Pi run recorded no chat answer.

### Out of Scope
- New process-filter patterns in `isProcessQuestion` - the filter stays a heuristic, and the save step's own instruction catches what it misses (001 Known Limitation 4).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .skilled/hooks/decision-capture/bin/sweep-transcript.mjs | Modify | Replace the single closing-paragraph candidate with per-paragraph candidates, the two caps and the dropped count. |
| .skilled/hooks/decision-capture/lib/capture-core.mjs | Modify | Give `chatSourceKey` an optional fifth argument for the per-paragraph segment. |
| .skilled/hooks/decision-capture/bin/sweep-transcript.test.mjs | Modify | Add cases for earlier questions, options, quoted questions, caps and key stability. The existing ten cases are not edited. |
| .skilled/hooks/decision-capture/lib/capture-core.test.mjs | Modify | Add one case for the five-argument key. |
| .skilled/hooks/decision-capture/bin/fixtures/claude-chat-questions.jsonl | Create | Redacted transcript built from the 7 baseline `earlier` pairs. |
| .skilled/hooks/decision-capture/bin/fixtures/claude-chat-questions.labels.json | Create | One label per pair: process question or not, and whether the reply answers the earlier question. |
| .skilled/commands/speckit/save.md and .opencode/commands/speckit/save.md | Modify | One sentence: several candidates can share one reply, so write an entry only for a question that reply answers. Later, per ADR-001: every runtime's sweep prints chat candidates. |
| .skilled/hooks/decision-capture/lib/chat-questions.mjs and its test | Create | Per ADR-001: the detector moved out of the Claude sweep, fed by an ordered list of assistant, tool and typed-prompt turns. |
| .skilled/hooks/decision-capture/bin/sweep-opencode.mjs, sweep-devin.mjs, sweep-codex.mjs, sweep-pi.mjs and their tests and fixtures | Modify | Per ADR-001: each reader maps its stored session to turns and prints chat candidates. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A paragraph before the closing one becomes a candidate when, after fenced code, inline code, quoted spans, blockquote lines, table rows and headings are removed, it still holds a sentence ending in `?`. A following paragraph made only of lettered option lines is part of the same candidate, and its labels go to the process filter. |
| REQ-002 | The closing-paragraph candidate keeps its current test (any `?`), its question text, its four-part key and its object shape. The ten existing tests in `sweep-transcript.test.mjs` pass without any edit to their bodies. |
| REQ-003 | An earlier-paragraph candidate's key is `chatSourceKey(runtime, sessionId, questionTurnId, answerTurnId, "p" + the first 12 hex digits of the SHA-256 of its question text)`. A repeat of the same text in one message appends `-2`, `-3` and so on. Two sweeps of one transcript print the same keys, every key matches `^[A-Za-z0-9:._-]+$`, and a consumed key is not offered again. |
| REQ-004 | `isProcessQuestion` runs on each candidate's own text and option labels, so a commit, push or spec-folder question in any paragraph yields no candidate. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | One message yields at most 3 candidates. The closing paragraph ranks first, then paragraphs with option labels, then later paragraphs before earlier ones. The kept candidates print in message order. |
| REQ-006 | One sweep prints at most 20 chat candidates. Consumed keys are removed before the cap, the newest 20 are kept, and the result carries `chat_candidates_dropped` with the count cut. |
| REQ-007 | On the redacted fixture, the sweep CLI in a temporary project prints 4 candidates, none from the 3 labelled process pairs, and includes the 1 labelled reply that answers an earlier-in-message question. On the ten baseline transcripts, each swept into its own temporary project, the candidate total equals the scratch script's `units` total from the same run. |
| REQ-008 | Both copies of `save.md` tell the session model that several candidates can share one reply and that it writes an entry only for a question the reply answers. |
| REQ-009 | The series harness in `../006-live-conversation-test/` re-proves the change. In a real multi-turn session in a scratch project, the subject asks a plain chat question in the middle of a message, the orchestrator answers it as the human, and the 006 results matrix shows it offered as one chat candidate within the per-message cap. The same 006 stage then sends a reply that moves on without answering, and its check asserts that the save writes no decision row for that reply. |
| REQ-010 | Added by ADR-001. The OpenCode, Devin, Codex and Pi sweeps each print `chat_candidates` from the same detector as the Claude sweep, keyed by `chatSourceKey` with their own runtime name. Each reader's test runs on a redacted fixture from a real scratch session and shows one plain chat question answered by the next typed prompt as one candidate, and no candidate when a tool call comes between them. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: The labelled reply that answers a numbered decision list earlier in its message is offered as a chat candidate. Today it is not.
- **SC-002**: The ten baseline transcripts go from 20 to the scratch script's `units` total (24 on 2026-11-01), with no message above 3 and no session above 20.
- **SC-003**: `node --test` on `sweep-transcript.test.mjs` and `capture-core.test.mjs` prints `ℹ fail 0`, and the ten existing sweep cases are unchanged.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `../006-live-conversation-test/` harness | REQ-009 cannot be met until the harness runs a subject session. | Every other requirement is proven by unit tests and the fixture, so only the live re-proof waits. |
| Risk | The reply moves on, and the save step writes a decision from a reply that does not answer the earlier question. In the baseline, 3 of the 4 new candidates are like that. | Med | The save-step sentence in REQ-008, the null-answer rule the save step already applies and the per-message cap. |
| Risk | A later change to detection shifts which paragraphs ask, so a positional key would point at a different question. | Low | The key hashes the question text, not its position, so it moves only when the text does. |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: Sweeping the largest baseline transcript (`dc90f89a`) in a temporary project takes no more than 10% longer than before the change, timed with `/usr/bin/time -p` before and after.
- **NFR-P02**: The added work runs only on text-only messages followed by a typed reply, 251 in the baseline, and hashes only asking paragraphs.

### Security
- **NFR-S01**: The fixture holds no real path, user name, email or session id. `rg -n 'michelkerkmeester|/Users/|@getbarter' .skilled/hooks/decision-capture/bin/fixtures/claude-chat-questions*` prints nothing.
- **NFR-S02**: The sweep writes nowhere new. Candidates still go to stdout, and the queue stays under the gitignored `.skilled/skills/.state/`.

### Reliability
- **NFR-R01**: Two sweeps of one transcript print byte-identical `chat_candidates` arrays.
- **NFR-R02**: A torn or non-JSON transcript line is still skipped, and an unreadable transcript still exits 1 with an `error` field.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: a message with no paragraph that asks yields no candidate, as today. A message whose only `?` is inside code or quotation marks yields none either, unless the `?` sits in the closing paragraph, which keeps its current test.
- Maximum input: a message with five asking paragraphs yields 3 candidates, the closing one first. A sweep with 25 candidates prints 20 and `chat_candidates_dropped: 5`.
- Failure path: an unreadable transcript prints JSON with an `error` field and exits 1, as the existing CLI test checks. When two asking paragraphs in one message have identical text, the second key gets `-2` appended, so the two keys still differ.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Two code files, two test files, two fixture files and one sentence in two copies of `save.md`. About 150 lines of code and 150 of tests. |
| Risk | 8/25 | Keys feed the consumed log, so a key change would re-offer old answers. The closing key is frozen and tested. |
| Research | 6/20 | The baseline is measured. The fixture labels need one careful read of 7 pairs. |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Should the session cap keep the newest 20, so an old rejected candidate drops out first? Decision: yes. An old unconsumed candidate is one the save step already saw and left out.
- Should a later paragraph that answers its own question, such as "Why? Because the daemon hung.", be dropped as rhetorical? Decision: no, not in this child. A question followed by a recommendation looks the same. The one rhetorical question seen while reading the baseline pairs sat inside quotation marks, which REQ-001 already removes.
<!-- /ANCHOR:questions -->

---

