---
title: "Feature Specification: Phase 3: codex-and-pi-capture"
description: "Codex and Pi queue no operator answers, because the decision-capture probes searched for tool names neither runtime records. Pi stores answered questions in its session files under ask_user_question, and Codex's question tool is request_user_input_async, whose answer path no interactive session has shown yet."
trigger_phrases:
  - "codex and pi capture"
  - "phase 3 codex and pi capture"
  - "pi ask_user_question capture"
  - "codex request_user_input_async capture"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 3: codex-and-pi-capture

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
| **Phase** | 3 of 6 |
| **Predecessor** | 002-table-row-matching |
| **Successor** | 004-opencode-devin-live-capture |
| **Handoff Criteria** | `probe/codex.json` and `probe/pi.json` no longer say `UNKNOWN`, and each runtime has either a tested reader that queues its answers or a tested, documented refusal. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the decision-capture series. The parent `specs/system-speckit/043-decision-capture` is a series parent: each child is a separate change to the same capture system, and child `001-decision-capture-build` is the finished build that this child extends.

**Scope Boundary**: Codex and Pi answer capture only. The capture core, the decision-record writer and the save flow from 001 are reused unchanged. OpenCode and Devin live hooks belong to 004, and plain chat questions belong to 005.

**Dependencies**:
- 001's capture core (`.skilled/hooks/decision-capture/lib/capture-core.mjs`) and its queue and dedup contract.
- Operator consent for one live Codex probe and one live Pi probe, each with a harmless question.
- Sibling `../006-live-conversation-test/` for the multi-turn re-proof in REQ-007.

**Deliverables**:
- Updated `probe/pi.json` and `probe/codex.json` with an observed status.
- A Pi save-time reader with a node:test file and a redacted real fixture.
- For Codex, a reader on the same pattern or a recorded refusal pinned by a test, depending on what the live probe shows.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
An operator who answers a question in Codex or Pi gets no decision entry at save time, because 001 left both runtimes `UNKNOWN` and disabled. Both 001 probes searched for the wrong tool name. Pi's extension registers the tool as `ask_user_question`, not `ask-user-question`, and its session files hold answered results under that name. Codex's question tool is `request_user_input_async`, which returns `{"accepted":true}` at once, and every accepted call on this machine came from a non-interactive `codex exec` run that no human answered.

### Purpose
Every answer an operator gives to a Codex or Pi question tool lands in the decision queue once, or the runtime carries a recorded, tested reason why it cannot.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ bash specs/system-speckit/043-decision-capture/003-codex-and-pi-capture/scratch/measure-answer-surfaces.sh
probe status: codex=UNKNOWN/disabled pi=UNKNOWN/disabled
cli-codex files naming request_user_input: 0
codex rollouts: 402
codex-tui rollouts: 13
codex request_user_input_async calls: 59
codex calls answered {"accepted":true}: 29
codex calls rejected for bad arguments: 30
accepted calls inside codex_exec rollouts: 29
accepted calls followed by a user message: 0
pi session files: 12952
pi files with an ask_user_question toolResult: 130
pi files with an answered one (cancelled:false): 104
exit 0
```

The script prints counts only. It reads the two probe files, the cli-codex skill, `~/.codex/sessions` and `~/.pi/agent/sessions`, and copies no session content.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Re-run the Pi probe under the registered name `ask_user_question` and record the observed result shape in `probe/pi.json`.
- Add a Pi save-time reader that queues answered `ask_user_question` results through the capture core, tested on a redacted real sample.
- Run one live Codex probe in an interactive session and record whether the operator's reply can be tied to its `request_user_input_async` call.
- Build the Codex reader when the probe ties the reply to the call, or record the refusal in the probe file and the hooks README and pin it with a test. Outcome, 2026-11-02: branch (a). With `default_mode_request_user_input` on, Codex calls the synchronous `request_user_input`, whose answer is tied to its call, so `sweep-codex.mjs` reads it from the rollout (`decision-record.md` ADR-001).
- Re-prove both runtimes with the live-conversation harness in `../006-live-conversation-test/`.

### Out of Scope
- OpenCode and Devin live hooks - child 004 owns them.
- Plain chat questions with no question tool - child 005 owns them.
- Changing the capture core, the decision-record writer or the save writer - 001 built them and this child only feeds them.
- Making `codex exec` ask questions - the Codex binary's own instructions say exec mode never offers the tool (`.skilled/repo-rules/communication-handoff.md:155`).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .skilled/skills/.state/decision-capture/probe/pi.json | Modify (gitignored) | Record the `ask_user_question` toolResult shape and an observed status. |
| .skilled/skills/.state/decision-capture/probe/codex.json | Modify (gitignored) | Record the live probe's hook payload and rollout result. |
| .skilled/hooks/decision-capture/bin/sweep-pi.mjs | Create | Read answered `ask_user_question` results from a Pi session file and queue them. |
| .skilled/hooks/decision-capture/bin/sweep-pi.test.mjs | Create | node:test cases for answered, cancelled, multi-question and rerun inputs. |
| .skilled/hooks/decision-capture/bin/fixtures/pi-ask-user-question.json | Create | Redacted real Pi toolCall and toolResult pair. |
| .skilled/hooks/decision-capture/bin/sweep-codex.mjs, sweep-codex.test.mjs and fixtures/codex-request-user-input.json | Create, branch (a) only | Codex reader, its tests and a redacted live-probe sample. |
| .skilled/hooks/decision-capture/bin/runtime-refusal.test.mjs | Create, branch (b) only | Pin each refused runtime's README cell and probe status. |
| .pi/extensions/decision-capture.ts | Create, only after a live Pi probe | Queue the answer from the `tool_result` event's `details`. |
| .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json | Modify, only after a live probe | Add the Pi extension to the `decision-capture` entry. |
| .skilled/hooks/README.md | Modify | Update the `decision-capture` coverage row for Codex and Pi, and the `bin/` tree line. |
| .skilled/commands/speckit/save.md | Modify | Name the Pi reader, and the Codex reader when one exists, beside the OpenCode and Devin ones. |
| .skilled/skills/system-spec-kit/feature-catalog/ux-hooks/operator-decision-capture.md | Modify | List the new reader and test files. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `probe/pi.json` records an offline scan under the name `ask_user_question` (registered at `.pi/npm/node_modules/@juicesharp/rpiv-ask-user-question/ask-user-question.ts:86`), the observed field path of the answer (`details.answers[]` with `question`, `answer`, `kind`, `cancelled`), and status `transcript-observed, hook UNKNOWN`. |
| REQ-002 | `node --test .skilled/hooks/decision-capture/bin/sweep-pi.test.mjs` passes. On the redacted fixture, an answered result queues one line per question, a `cancelled:true` result queues none, and a second run adds none. |
| REQ-003 | `probe/codex.json` records a live interactive Codex probe with one harmless question: the PostToolUse payload for `request_user_input_async` and how the reply appears in the rollout. Its status is no longer `UNKNOWN`. |
| REQ-004 | Codex ends on exactly one branch. Branch (a): `node --test .skilled/hooks/decision-capture/bin/sweep-codex.test.mjs` passes on a redacted live-probe sample. Branch (b): the README Codex cell for `decision-capture` starts `n/a:` with the observed reason, and `node --test .skilled/hooks/decision-capture/bin/runtime-refusal.test.mjs` passes and fails when that cell is changed. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | A live hook or extension is registered only after a live probe shows its payload carries the answer. `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs --check` prints PASS either way. |
| REQ-006 | The `decision-capture` row in `.skilled/hooks/README.md` and the reader list in `.skilled/commands/speckit/save.md` match what was built for Codex and Pi. |
| REQ-007 | The change is re-proven with the live-conversation harness in `../006-live-conversation-test/`. An orchestrator drives a real multi-turn Codex session and a real multi-turn Pi session in a scratch project and answers the subject's questions as the human. The 006 results matrix records each runtime as capturing (one queue line per answer, no duplicates) or as having no answer surface, with evidence. |
| REQ-008 | The Claude adapter never falls back to `process.cwd()`. With neither `CLAUDE_PROJECT_DIR` nor a payload `cwd`, it writes nothing and exits 0, and a test pins that no file appears outside the project. |
| REQ-009 | The `n/a:` refusal shape of REQ-004 branch (b) is the series convention: any runtime cell in `.skilled/hooks/README.md` that has no answer surface starts `n/a:` with the observed reason, and `runtime-refusal.test.mjs` pins every such cell, so 004 and 005 reuse it rather than inventing their own. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: After a Pi session where the operator answers one `ask_user_question` call with two questions, `node .skilled/hooks/decision-capture/bin/sweep-pi.mjs` adds 2 queue lines, and a second run adds 0.
- **SC-002**: `jq -r .status .skilled/skills/.state/decision-capture/probe/codex.json .skilled/skills/.state/decision-capture/probe/pi.json` prints no `UNKNOWN` line.
- **SC-003**: The 006 results matrix has one row each for Codex and Pi, each marked capturing or no answer surface, with the queue lines or the refusal test as evidence.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | An interactive Codex session in Plan mode, where the tool is offered (`.skilled/repo-rules/communication-handoff.md:155`) | Without it the Codex answer path stays unobserved and REQ-003 cannot pass. | Ask the operator for one consented probe run. If it cannot run, Codex takes branch (b) with the reason "not probed live" and stays disabled. |
| Risk | The Codex reply is a free-text user turn with no link to the call | A reader that pairs the next user message with the call could queue an unrelated message as an answer. | Pair only when the probe shows the first user message after an accepted call answers it, and test the negative case. Otherwise take branch (b). |
| Risk | The third-party Pi package changes its result shape | The Pi reader would silently queue nothing. | Its `events.ts` promises append-only payloads. The test fixture pins the shape, and the reader matches by field, not by text. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: A live Pi extension, if registered, makes no model or network call and returns within the 3000 ms stdin deadline the other adapters use.
- **NFR-P02**: N/A: the save-time readers run once per save over one session file, not as a service.

### Security
- **NFR-S01**: Fixtures hold redacted samples only: no real answer text, path, session id or call id.
- **NFR-S02**: Queue lines stay under the gitignored `.skilled/skills/.state/decision-capture/` directory.

### Reliability
- **NFR-R01**: Running a reader twice on the same session adds no queue line, because dedup uses the core's `toolSourceKey` (runtime, session, call id, question index).
- **NFR-R02**: A malformed line is skipped and the reader still exits 0. A session file that cannot be read makes the reader print JSON with an `error` field and exit 1, the way the Claude and Devin readers do, so a save can tell a failed read from an empty one. Amended 2026-11-02 by `../007-gap-closure`, on the operator's go-ahead to close the research's gaps; the original rule hid a failed read behind the same silence as "nothing pending".

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: a Pi session with no `ask_user_question` result, or a cancelled one, queues nothing and exits 0.
- Maximum input: one Pi call carries several questions, and each answered one becomes its own queue line keyed by question index.
- Failure path: a Codex call rejected for bad arguments (30 in the Measured Behavior block) asked nothing, so no reader may queue it.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | One or two readers with tests and fixtures, a possible Pi extension, and three doc rows. |
| Risk | 9/25 | Gitignored queue only; a wrong pairing puts an unrelated message in the queue, which the save step still filters. |
| Research | 14/20 | Two live probes, one of which needs an interactive Codex Plan-mode session. |
| **Total** | **35/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Does an interactive Codex session record the operator's reply to `request_user_input_async` in a form tied to the call? UNKNOWN: the Measured Behavior block shows 0 accepted calls followed by a user message, all from exec runs. The live probe in T005 decides it.
- Does Pi's `tool_result` event carry `details.answers` for this tool? Inferred yes, because `.pi/extensions/dispatch-audit.ts` already reads `event.details` and the tool returns its answers in `details`. The live probe in T009 confirms it before any extension is registered.
- Is Default-mode Codex with the question feature turned on worth probing too? UNKNOWN: the repo row says the feature ships off, and the plan probes Plan mode only.
<!-- /ANCHOR:questions -->

---

