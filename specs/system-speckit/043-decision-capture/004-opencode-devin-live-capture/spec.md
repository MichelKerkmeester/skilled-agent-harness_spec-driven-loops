---
title: "Feature Specification: Phase 4: opencode-devin-live-capture"
description: "OpenCode and Devin operator answers reach the decision queue only when a save runs the two save-time readers, so nothing captures them during the session and no pending-answer nudge reaches either runtime. OpenCode's newest storage layout is read by a shape inferred from older parts, because no real sample of it exists."
trigger_phrases:
  - "opencode devin live capture"
  - "phase 4 opencode devin live capture"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 4: opencode-devin-live-capture

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
| **Phase** | 4 of 6 |
| **Predecessor** | 003-codex-and-pi-capture |
| **Successor** | 005-chat-question-detection |
| **Handoff Criteria** | Both probe files record an observed live payload or a recorded UNKNOWN, a real `session_message` fixture test passes and `validate.sh --strict` prints `RESULT: PASSED` for this folder. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the decision-capture series. The parent `specs/system-speckit/043-decision-capture` is a series parent: each child is a separate change to the same capture system. Its child `001-decision-capture-build` is the finished build that shipped the capture core, the Claude live adapter and the OpenCode and Devin save-time readers.

**Scope Boundary**: Live or near-live capture of OpenCode and Devin question answers, a real-sample test of OpenCode's `session_message` layout and a pending-answer nudge for both runtimes. Codex and Pi belong to `003-codex-and-pi-capture`. Plain chat questions belong to `005-chat-question-detection`.

**Dependencies**:
- The capture core `.skilled/hooks/decision-capture/lib/capture-core.mjs` and its queue key `toolSourceKey` (capture-core.mjs:56-58), shipped by 001.
- The operator's consent to run one harmless question in a live OpenCode session and one in a live Devin session.
- The live-conversation harness in `../006-live-conversation-test/` for the final re-proof.

**Deliverables**:
- Updated probe records for OpenCode and Devin that state what each live surface carries.
- A live adapter for each surface the probe proves, or a recorded reason to keep the save-time reader.
- A redacted real `session_message` fixture with a test that failed first.
- A pending-answer nudge path for each runtime, or a recorded reason it cannot exist.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
An operator who answers a question in OpenCode or Devin has that answer queued only when a later save runs `bin/sweep-opencode.mjs` or `bin/sweep-devin.mjs` (001 implementation-summary.md, Known Limitations item 3). Both live hook payloads are still UNKNOWN in the probe records, so no live adapter exists and the Claude-only Stop nudge never tells these sessions that answers wait for a save. The OpenCode reader also handles the newer `session_message` layout by converting its items into the older part shape (sweep-opencode.mjs:145-165), and the only test of that path uses a hand-built row, not a real one (sweep-opencode.test.mjs:145-192).

### Purpose
Every OpenCode and Devin answer is queued once, during the session where a live surface allows it, and the newest OpenCode layout is tested against a real stored call.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ node --test .skilled/hooks/decision-capture/bin/sweep-opencode.test.mjs .skilled/hooks/decision-capture/bin/sweep-devin.test.mjs; echo "exit=$?"
✔ the fixture yields its two answered decisions and nothing else (2.979125ms)
✔ a second sweep appends nothing and leaves the queue intact (1.720875ms)
✔ a skipped answer is dropped and the typed answer still lands (1.77825ms)
✔ the CLI prints the sweep result for the given transcript (28.092334ms)
✔ the CLI resolves the newest session for the working directory (29.945833ms)
✔ the fixture yields its four answered decisions and nothing else (1.167916ms)
✔ a part database recovers its answered decisions once (5.312792ms)
✔ the message layout recovers a question stored as a content item (2.459208ms)
✔ the newest session for the directory wins across both session tables (1.774625ms)
✔ the CLI resolves the newest session under the XDG data home (29.510417ms)
✔ the CLI reports a missing database as JSON and fails (24.899959ms)
ℹ tests 11
ℹ suites 0
ℹ pass 11
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 100.111542
exit=0
```
All 11 save-time reader tests pass. One of them, "the message layout recovers a question stored as a content item", is the only coverage of `session_message`, and its row is synthetic.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Probe OpenCode `tool.execute.after`, the OpenCode `question.replied` event and Devin `PostToolUse` with one harmless question each, after the operator consents, and record what each payload carries. Outcome, 2026-11-02: OpenCode `tool.execute.after` and Devin `PostToolUse` both carry the answer under the reader's ids, so both capture live. No `question.replied` event reached a plugin, the near-live path was not needed, and Devin does not display Stop context, so it gets no nudge.
- Add a live adapter only for a surface the probe proves carries the answer, keyed so the core dedupes it against the save-time reader.
- Where no hook payload carries the answer but the probe shows the stored answer is already written when OpenCode's `session.idle` or Devin's `Stop` fires, run the existing reader for that one session at that moment instead, for near-live capture.
- Capture one real `session_message` question call, redact it into a fixture and add a test that fails before any reader change.
- Deliver a pending-answer nudge to OpenCode and Devin sessions, or record why a runtime cannot show one.
- Re-prove the result with the series' live-conversation harness in `../006-live-conversation-test/`.

### Out of Scope
- Codex and Pi capture - they belong to sibling `003-codex-and-pi-capture`.
- Plain chat questions in OpenCode and Devin - they belong to sibling `005-chat-question-detection`.
- Removing the save-time readers - they stay as the backstop even where a live adapter lands.
- Writing to OpenCode's or Devin's own databases - the readers open them read-only and the adapters only append to the gitignored queue.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .skilled/skills/.state/decision-capture/probe/opencode.json and probe/devin.json | Modify | Record the observed live payload or keep UNKNOWN with the reason. Gitignored state. |
| .skilled/hooks/decision-capture/bin/fixtures/opencode-session-message.json | Create | One real `session_message` row holding a question call, ids and paths redacted. |
| .skilled/hooks/decision-capture/bin/sweep-opencode.test.mjs | Modify | Add the real-row test that fails first. |
| .skilled/hooks/decision-capture/bin/sweep-opencode.mjs | Modify if the test fails on shape | Fix the `session_message` conversion only where the real row differs. |
| .opencode/plugins/decision-capture.js | Create if the probe proves a live or near-live surface | Queue answers from the proven surface, or run the reader for this session on `session.idle`, and push the pending-answer nudge through `experimental.chat.system.transform`. |
| .opencode/plugins/tests/decision-capture.test.cjs and .opencode/plugins/tests/plugin-inventory.json | Create and Modify, with the plugin | Cover the plugin and declare its hooks to the inventory test. |
| .skilled/hooks/decision-capture/devin/ask-capture-posttooluse.mjs, with a test and a redacted payload fixture | Create if the probe proves it | Queue Devin answers from `PostToolUse` with the reader's key. |
| .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json and .devin/hooks.v1.json | Modify and Regenerate, with the Devin adapter | Add a Devin binding to the `decision-capture` entry and regenerate through `sync-hook-registrations.cjs`. |
| .skilled/hooks/shared/hook-stdin-deadline.test.mjs and .skilled/skills/system-spec-kit/runtime/cli/tests/hook-registration-sync.vitest.ts | Modify, with the Devin adapter | Add the adapter's stdin-deadline entry and move the pinned binding count, as 001 did for the Claude adapter. |
| .skilled/skills/system-spec-kit/runtime/hooks/devin/session-stop.ts | Modify if Devin shows Stop context | Forward the pending-answer nudge the delegated Claude Stop hook computes, and run the Devin reader for this session first when the near-live path applies. |
| .skilled/hooks/README.md | Modify | Update the decision-capture coverage rows for OpenCode and Devin. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Before any adapter code, a live OpenCode session asks one harmless question with the operator's consent, and `probe/opencode.json` records what `tool.execute.after` and `question.replied` each carried, or UNKNOWN with the reason. |
| REQ-002 | Before any adapter code, a live Devin session asks one harmless question with the operator's consent, and `probe/devin.json` records what `PostToolUse` carried for `ask_user_question`, or UNKNOWN with the reason. |
| REQ-003 | A redacted real `session_message` row holding a question call is a fixture. The test on it was seen to fail first, either against the shipped reader when the real shape differs or with the reader's `session_message` branch removed when it does not, and it passes against the final reader. The fixture is an artifact of REQ-001's live probe, copied from the session that probe created, because 001's live store yielded 0 records. When the probe yields no such row, `probe/opencode.json` records `UNKNOWN` with the reason, under REQ-005, and no fixture is invented. |
| REQ-004 | A live adapter exists only for a surface REQ-001 or REQ-002 proved carries the answer, and for the same answered call it writes the same `toolSourceKey` as the save-time reader, so adapter then sweep, and sweep then adapter, each leave one queue record. A near-live reader run counts as the reader, so it shares the key by construction. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | A runtime whose probe proved neither a hook payload nor a near-live store keeps its save-time reader only, and the probe file plus `implementation-summary.md` state why no adapter was added. |
| REQ-006 | A pending-answer nudge reaches OpenCode sessions and Devin sessions, or `implementation-summary.md` names the missing surface that stops it for that runtime. |
| REQ-007 | Each new adapter honors the `decision-capture` kill switch, fails open with no output on a bad payload and keeps any Devin binding passing `sync-hook-registrations.cjs --check`. |
| REQ-008 | The series' live-conversation harness in `../006-live-conversation-test/` re-proves the change: an orchestrator drives a real multi-turn OpenCode and Devin test-subject session in a scratch project and answers the subject's questions as the human, and the 006 results matrix shows each answer queued live or near-live during the conversation, once, with the save-time reader adding no duplicate. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: In a live OpenCode or Devin session whose surface was proven, one answered question adds one queue line before any save runs, and a following sweep reports `recovered: 0` for that session.
- **SC-002**: `node --test .skilled/hooks/decision-capture/bin/sweep-opencode.test.mjs` passes with the real `session_message` fixture case included.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Operator consent and an interactive session in each runtime for the probes | Without a probe no adapter may be written, so the runtime stays save-time only | Keep the reader, record UNKNOWN with the reason under REQ-005 and close the rest of the packet. |
| Risk | The live payload names the session or call with an id the stored session does not use, such as a Devin hook `session_id` that differs from the transcript `session_id` or file name (sweep-devin.mjs:156-161) | High: one answer would queue twice under two keys | The probe records both ids, and a test feeds the adapter payload and the stored record for the same call and asserts one queue line. |
| Risk | OpenCode's `question.*` events are listed as not observed on OpenCode 2 (`.opencode/plugins/tests/plugin-inventory.json:23-25`) | Med: that surface may never fire | Probe `tool.execute.after` as well and adopt whichever surface carries the answer. |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: A live adapter returns within its hook timeout of 5 seconds, the same budget as the Claude binding in `hook-registry.json`.
- **NFR-P02**: The OpenCode plugin does no database read on `tool.execute.after`. It normalizes the payload it was handed and appends.

### Security
- **NFR-S01**: The `session_message` fixture holds no real path, session id, call id or operator text beyond the harmless probe question.
- **NFR-S02**: No adapter or reader opens OpenCode's or Devin's database for writing.

### Reliability
- **NFR-R01**: An adapter that hits a missing payload, a parse error or a queue write failure ends with no output and exit 0, or returns without throwing in the plugin.
- **NFR-R02**: Running the save-time reader after a live capture never adds a second record for the same call.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: a dismissed or skipped question carries no answer, so the adapter appends nothing, as the reader already does for an empty answer entry.
- Maximum input: one call with several questions writes one record per answered question, keyed by its index, the same as the reader.
- Failure path: a payload with no recognizable answer field writes nothing and exits 0, leaving the save-time reader to recover the answer.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Up to two adapters, one fixture, one Stop-hook change, the registry and the plugin inventory, across two runtimes. |
| Risk | 9/25 | Hooks on live tool calls. Both adapters fail open and the reader stays as the backstop. |
| Research | 14/20 | Both live payloads are unprobed and the `session_message` layout has no real sample. |
| **Total** | **35/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Does OpenCode's `tool.execute.after` output carry the answers in `output.metadata`, as the stored part suggests (probe/opencode.json:6), and is its `input.callID` the same id the stored part keeps as `callID`? The probe answers it.
- Does Devin show a Stop hook's `additionalContext` to the operator or the model? `devin/session-stop.ts:32` discards the delegated Claude Stop output today, so the nudge never reaches Devin. The probe answers it.
<!-- /ANCHOR:questions -->

---


