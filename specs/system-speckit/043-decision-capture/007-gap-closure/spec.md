---
title: "Feature Specification: Phase 7: gap-closure"
description: "The 2026-11-02 research ranked the decision-capture gaps still open after 006. Codex and Pi sweeps hide an unreadable transcript, answers from a session that never saved are never offered, Pi shows no pending-answer nudge, and two mappings and two consumed-log readers are kept as copies. This phase closes the gaps worth closing with the smallest change each, and records why the rest stay open."
trigger_phrases:
  - "gap closure"
  - "phase 7 gap closure"
  - "decision capture gap closure"
  - "decision capture orphaned answers"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 7: gap-closure

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-02 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 7 |
| **Predecessor** | 006-live-conversation-test |
| **Successor** | None |
| **Handoff Criteria** | Every acceptance criterion is Met, the decision-capture suites pass, and the parent's second live pass runs on this code. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the decision-capture series. It acts on the ranked findings in `../research/research.md`.

**Scope Boundary**: The decision-capture hook files, the OpenCode plugin, the matcher CLI and the writer's consumed-log reader, `save.md`'s decision step, the hooks coverage docs, and 003's NFR-R02. No new adapter, no new file kind, no new runtime.

**Dependencies**:
- `../research/research.md`, the ranked gaps and the verification addendum.
- 003's spec, whose NFR-R02 this phase amends.

**Deliverables**:
- Six code and doc changes (section 3), each with its test or check.
- A decision record for the three gaps that stay open on purpose.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Codex and Pi sweeps exit 0 with no output when a named transcript cannot be read, so a save cannot tell a failed read from an empty one. A session that ends without a save leaves its answers queued where no later save offers them. Pi shows no pending-answer nudge, and the OpenCode plugin and the matcher CLI each keep a private copy of logic another module owns, so a fix to one copy misses the other.

### Purpose
Every answer the queue holds is either offered at the next save or reported missing, through the smallest change each gap allows.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node .skilled/hooks/decision-capture/bin/sweep-codex.mjs --transcript missing.jsonl
exit=0
$ node .skilled/hooks/decision-capture/bin/sweep-pi.mjs --transcript missing.jsonl
exit=0
$ node .skilled/hooks/decision-capture/bin/sweep-transcript.mjs --transcript missing.jsonl
{"error":"ENOENT:nosuchfileordirectory,open'missing.jsonl'"} exit=1
$ bun -e "import('./.skilled/hooks/decision-capture/bin/sweep-opencode.mjs')"
No such built-in module: node:sqlite
$ rg -c 'takeNudge' .skilled/hooks/decision-capture/pi/decision-capture.ts
exit=1
$ rg -l 'scan-orphans' .skilled/commands
exit=1
$ rg -c 'CONSUMED_FILENAME|readConsumedLines' .skilled/skills/system-spec-kit/runtime/cli/continuity/match-decision-table.ts
5
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Make the Codex and Pi sweeps print an `error` and exit 1 when a transcript they were pointed at cannot be read, and amend 003 NFR-R02 to match.
- Make the save step list answers that other sessions left pending, through the matcher's existing `--scan-orphans`.
- Show the pending-answer count in Pi through the existing `takeNudge` at the end of a turn.
- Load `node:sqlite` lazily in the OpenCode sweep so the plugin can import the sweep's `openCodeAnswerRecords` and drop its own `answerMap`.
- Have the matcher CLI read `consumed.jsonl` through one reader exported by the decision-record writer, and delete its own.
- Delete the prose restatement of the process-question filter in `save.md`, and write the decision-capture section of `coverage-rationale.md`.
- Read answers from pi-plan-build's `question` tool on Pi, found missing by the second live pass.

### Out of Scope
- A Codex live hook - the rollout sweep already finds every answer; see the decision record.
- A Devin nudge - Devin discards Stop-hook output, as 004 recorded.
- Auto-accepting a lone chat candidate - a probe shows an off-topic reply still yields one; see the decision record.
- A Hermes column - Hermes has no adapter or probe to report.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/decision-capture/bin/sweep-codex.mjs` | Modify | Report an unreadable transcript |
| `.skilled/hooks/decision-capture/bin/sweep-pi.mjs` | Modify | Report an unreadable transcript |
| `.skilled/hooks/decision-capture/bin/sweep-codex.test.mjs` | Modify | Expect exit 1 and `error` for a missing transcript |
| `.skilled/hooks/decision-capture/bin/sweep-pi.test.mjs` | Modify | Expect exit 1 and `error` for a missing transcript |
| `.skilled/hooks/decision-capture/pi/decision-capture.ts` | Modify | Nudge on `turn_end` |
| `.skilled/hooks/decision-capture/pi/decision-capture.test.ts` | Modify | Nudge shown once, not on a second turn |
| `.skilled/hooks/decision-capture/bin/sweep-opencode.mjs` | Modify | Lazy `node:sqlite` load |
| `.opencode/plugins/decision-capture.js` | Modify | Import `openCodeAnswerRecords`, delete `answerMap` |
| `.skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts` | Modify | Export one consumed-log row reader |
| `.skilled/skills/system-spec-kit/runtime/cli/continuity/match-decision-table.ts` | Modify | Use the writer's reader |
| `.skilled/commands/speckit/save.md` | Modify | Orphan listing; drop the filter restatement |
| `.skilled/hooks/coverage-rationale.md` | Modify | Decision-capture section |
| `../003-codex-and-pi-capture/spec.md` | Modify | Amend NFR-R02 |
| `.skilled/hooks/decision-capture/bin/sweep-pi.mjs`, `pi/decision-capture.ts` and their tests | Modify | Read pi-plan-build's `question` tool too |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-live-conversation.md` | Modify | Expect the new Pi nudge |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `sweep-codex.mjs --transcript missing.jsonl` and `sweep-pi.mjs --transcript missing.jsonl` each print JSON with an `error` field and exit 1; `--transcript /dev/null` still prints nothing and exits 0. |
| REQ-002 | `save.md` runs `match-decision-table.js --scan-orphans` and tells the operator about pending answers held by other sessions. |
| REQ-003 | The decision-capture suites pass: `node --test` over `lib`, `bin`, `claude` and `devin` tests, the Pi vitest, the OpenCode plugin test and the runtime CLI suites. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The Pi extension shows the pending count once through `ctx.ui.notify` at `turn_end`, using `takeNudge`. |
| REQ-005 | `bun -e "import('./.opencode/plugins/decision-capture.js')"` loads, the plugin imports `openCodeAnswerRecords`, and `answerMap` is gone. |
| REQ-006 | `match-decision-table.ts` has no `CONSUMED_FILENAME` or `readConsumedLines`; it reads the log through the writer's exported reader. |
| REQ-007 | `save.md` no longer restates the process-question list, and `coverage-rationale.md` has a decision-capture section for the Codex and Cursor cells. |
| REQ-008 | Both Pi readers, the live extension and `sweep-pi.mjs`, queue an answer given through pi-plan-build's `question` tool as well as `ask_user_question`, under the same key. Added after the second live pass, where a Pi session answered through `question` and nothing was queued. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The four Measured Behavior commands that showed a gap now show it closed: the two sweeps exit 1 with `error`, the plugin loads under Bun, and `rg -c 'CONSUMED_FILENAME|readConsumedLines'` on the matcher prints nothing.
- **SC-002**: `validate.sh specs/system-speckit/043-decision-capture --strict --recursive` prints RESULT: PASSED for every folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | OpenCode loads plugins under Bun, which has no `node:sqlite` | A top-level SQLite import would stop the plugin loading and end live capture on OpenCode | The sweep loads SQLite only inside its database functions; a Bun import of the plugin proves it |
| Risk | A save on Codex or Pi now sees exit 1 where it saw silence | Med: a save could stop on a sweep error | Only a transcript that exists in the arguments or was discovered and cannot be read errors; no transcript found stays silent, as `save.md` says |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A: every change is a branch or an import on paths that already run once per save or per turn.

### Security
- **NFR-S01**: The orphan listing prints session ids and counts only, never answer text.

### Reliability
- **NFR-R01**: A Pi nudge failure never changes a turn: the call stays inside the extension's existing catch.
- **NFR-R02**: Moved code keeps its checks: `openCodeAnswerRecords` keeps the completed-status, answers-array and string-label checks the plugin's copy had.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a readable empty transcript prints nothing and exits 0 on Codex and Pi.
- Maximum input: `--scan-orphans` lists one line per session with pending answers; a project with none prints nothing.
- Failure path: an unreadable named transcript prints `{"error": ...}` and exits 1.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | 16 files, about 300 lines changed, no new file |
| Risk | 10/25 | Two CLI exit codes change; one plugin import path changes |
| Research | 4/20 | Done in `../research/research.md` |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The three gaps left open are decisions recorded in `decision-record.md`, not questions.
<!-- /ANCHOR:questions -->

---
