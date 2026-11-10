---
title: "Feature Specification: Automatic operator decision capture"
description: "Capture operator questions and answers, turn confirmed product decisions into short entries at save time and retain their exact wording in the bound packet."
trigger_phrases:
  - "operator decision capture"
  - "automatic decision record"
  - "capture AskUserQuestion answers"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Automatic operator decision capture

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

Operator answers to AI questions reach a decision record only when someone retypes them, so the exact wording and the reason for a choice get lost. This packet captures each answer to a gitignored queue, recovers missed ones from the Claude transcript, and has the session model write a short decision plus the verbatim exchange into the bound packet at a full-auto save. Re-saving changes no bytes, process questions are filtered out, and the packet's validated level never moves.

**Key Decisions**: rewrite at save time rather than inside a hook (ADR-001), and reuse the existing level detection and child resolver instead of new code (ADR-002).

**Critical Dependencies**: the live Claude PostToolUse probe (T001) gates the hook registration; the transcript sweep works without it.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-01 |
| **Branch** | main |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Operator answers to AI questions are not captured in a consistent decision record. Teams either retype the exchange by hand or rely on session memory, which can lose the exact wording and the reason for the choice.

### Purpose

Capture each in-scope operator answer and write a concise, traceable decision with its verbatim question and answer into the correct packet.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

N/A: No non-mutating command can exercise the missing capture-to-save writer. T001 defines the live Claude payload probe before implementation.

<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Capture Claude AskUserQuestion exchanges into a gitignored queue and always sweep the Claude transcript as a backstop.
- Find plain chat questions in the transcript and include them only when the session model confirms a matching operator answer at save time.
- Filter process questions about Gate 3, spec-folder choice, worktree or branch choice and commit or push permission out of the tracked decision record.
- Rewrite accepted answers into a short decision entry, retain the verbatim exchange in the same file and route the entry to the bound packet or the correct phase folder.
- Probe Codex, OpenCode, Pi and Devin answer surfaces. Keep each runtime UNKNOWN and disabled until its hook or transcript proves the answer shape.

### Out of Scope
- Calling a separate model from a synchronous hook. The session model already has the conversation context at save time.
- Changing the existing open_questions and answered_questions continuity fields. They keep their current shape and purpose.
- Installing capture support into the Barter vendored copy, which lives in a separate repository.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .skilled/hooks/decision-capture/lib/capture-core.mjs | Create | Normalize events, filter process questions and append deduplicated records under a lock. |
| .skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs | Create | Capture Claude AskUserQuestion events; the live probe confirmed tool_response.answers. |
| .skilled/hooks/decision-capture/claude/fixtures/claude-posttooluse-askuserquestion.json | Create | The probe's real PostToolUse payload with paths and ids redacted. |
| .skilled/hooks/decision-capture/bin/sweep-opencode.mjs and bin/sweep-devin.mjs, with tests and bin/fixtures/ | Create | Read answered question calls from OpenCode's SQLite store and Devin's transcripts, tested on redacted real samples. |
| .skilled/hooks/decision-capture/bin/sweep-transcript.mjs | Create | Recover missed tool answers and identify candidate plain-chat exchanges, with its own JSONL reader. |
| .skilled/skills/.state/decision-capture/README.md | Create | Explain the gitignored queue and retention boundary. |
| .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts | Create | Upsert decision entries and their verbatim appendix by stable question id, guard the level and record consumed keys. |
| .skilled/skills/system-spec-kit/runtime/api/index.ts | Modify | Re-export the writer, as it already does for the continuity writer. |
| .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts | Modify | Export the existing detectLevel so the writer uses the validator's own rule. |
| .skilled/skills/system-spec-kit/runtime/cli/types/session-types.ts | Modify | Declare the carried operator-decisions field beside the continuity field. |
| .skilled/skills/system-spec-kit/runtime/cli/utils/input-normalizer.ts | Modify | Accept the operatorDecisions save payload. |
| .skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts | Modify | Resolve each entry's target with the existing child resolver and pass confirmed decisions to the writer during full-auto save. |
| .skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts | Modify | Document the new save payload and its target rules. |
| .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts | Modify | Nudge when eligible queued decisions remain unconsumed. |
| .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json | Modify | Register the Claude adapter, confirmed by the live probe. |
| .claude/settings.json | Regenerate | Mirror the Claude hook registration through sync-hook-registrations. |
| .skilled/hooks/README.md and .skilled/hooks/shared/hook-stdin-deadline.test.mjs | Modify | Kill-switch, coverage, tree and key-file rows, and the adapter's stdin-deadline entry. |
| .skilled/skills/system-spec-kit/runtime/cli/tests/hook-registration-sync.vitest.ts | Modify | Move the pinned registry binding count from 99 to 100. |
| .codex/hooks.json and .devin/hooks.v1.json | No change | No hook payload was probed; Devin answers come from the save-time sweep. |
| .opencode/plugins/decision-capture.js and .pi/extensions/decision-capture.ts | Not created | OpenCode answers come from the save-time sweep; Pi has no observed answered call. |
| .skilled/skills/system-spec-kit/templates/addons/decision-record.md.tmpl | Modify | Add the operator-decisions and operator-answers-verbatim anchors. |
| .skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts | Verify, no change | The ADR sufficiency check already reads only adr- anchors (ADR-002). |
| .skilled/commands/speckit/save.md and .skilled/skills/system-spec-kit/references/memory/save-workflow.md | Modify | Read, filter, rewrite and consume eligible queued exchanges during save. |
| .skilled/skills/system-spec-kit/references/structure/phase-definitions.md | Modify | Document the optional parent record for cross-phase decisions. |
| .skilled/hooks/decision-capture/lib/capture-core.test.mjs and .skilled/hooks/decision-capture/bin/sweep-transcript.test.mjs | Create | Cover capture, filtering, transcript recovery and chat confirmation. |
| .skilled/skills/system-spec-kit/runtime/cli/tests/decision-record-writer.vitest.ts | Create | Cover record writes, routing, idempotence, appendix and level guard. |
| .skilled/skills/system-spec-kit/runtime/cli/tests/save-continuity-write.vitest.ts | Modify | Cover the full-auto save payload and queue consumption. |
| .skilled/skills/system-spec-kit/runtime/tests/hook-session-stop.vitest.ts | Modify | Cover the pending-decision nudge. |
| .skilled/skills/system-spec-kit/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap | Regenerate | Follow the template's two new anchors. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement |
|----|-------------|
| REQ-001 | Claude capture normalizes every question and answer from an AskUserQuestion result. T001 established that PostToolUse tool_response carries answers. |
| REQ-002 | A Claude transcript sweep always runs as the backstop, regardless of the T001 result. At save time the session model includes a plain chat question only when it confirms a matching operator reply. |
| REQ-003 | Gate 3, spec-folder, worktree or branch and commit or push permission questions produce no tracked decision entry or appendix item. |
| REQ-004 | The session model emits operatorDecisions entries with one short decided statement, a why supported by session context, supersedes ids or None and a carried-by requirement, task or path. An unstated reason stays explicitly unstated. |
| REQ-005 | The writer uses the bound packet by default. A cross-phase decision goes to its phase parent. A phase-local decision goes to the child selected by the existing save rule. |
| REQ-006 | Tool events deduplicate by runtime, session, tool-use id and question index. Plain-chat pairs use their question and answer turn ids. The writer maps each source key to a stable question id and repeated saves upsert by that id without changing the record bytes. |
| REQ-007 | Each decision entry and its exact question, options and answer share one id. The verbatim appendix is in the same tracked decision-record.md. |
| REQ-008 | Before creating decision-record.md, the writer preserves the folder's existing detected level. If spec.md lacks a level marker, it writes a marker for the pre-write level first. A test proves the detected level is unchanged. |

### P1 - Required

| ID | Requirement |
|----|-------------|
| REQ-009 | Codex, OpenCode, Pi and Devin each keep an UNKNOWN probe status until an observed hook or transcript proves answer delivery. An unconfirmed adapter stays disabled. |
| REQ-010 | The Stop hook reports eligible queued decisions that remain unconsumed after a session, without writing a decision entry. |

> Acceptance criteria for these requirements live in acceptance-criteria.md, which decides whether the packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A Claude question-tool answer appears once in the queue, with the transcript sweep recovering it when the hook payload omits answers.
- **SC-002**: A full-auto save writes a concise decision and byte-preserved question, options and answer to the resolved packet.
- **SC-003**: Re-saving the same question id leaves decision-record.md byte-identical and does not change the validator's detected level.
- **SC-004**: Process questions have no row in either tracked decision anchor, and unconfirmed runtimes remain disabled.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Claude PostToolUse payload and transcript | The hook may not expose the selected answer. | T001 settles the hook shape. The transcript sweep remains enabled in either result. |
| Dependency | Bound packet state and existing phase resolver | A wrong target puts the answer in the wrong packet. | Carry boundSpecFolder and test standard, parent and child routing. |
| Risk | Runtime answer shapes differ or remain undocumented. | An adapter may silently lose answers. | Keep each unconfirmed runtime UNKNOWN and disabled until a probe creates evidence. |
| Risk | decision-record.md can change inferred level when spec.md lacks a marker. | A Level 1 or 2 packet could validate as Level 3. | Add the pre-write level marker before the record and assert the level before and after. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The capture hook makes no model call and completes its local append within the runtime's configured hook timeout.
- **NFR-P02**: N/A: the queue is a local event log, not a request-serving system. Concurrency and multi-question events are covered by tests.

### Security
- **NFR-S01**: The raw queue remains under the gitignored .skilled/skills/.state/decision-capture directory.
- **NFR-S02**: The save writer sends no content to an external service. The tracked appendix contains only exchanges routed to the bound packet.

### Reliability
- **NFR-R01**: Replaying one event or saving one question twice creates one id and leaves the record unchanged.
- **NFR-R02**: Invalid payloads and unresolved targets remain unconsumed and appear in the pending-decision nudge.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- Empty input: an event with no questions creates no queue entry and no decision-record section.
- Maximum input: no product count limit is defined. The parser handles every question in one tool result and tests a multi-question result.
- Failure path: malformed input, an unreadable transcript or an unresolved packet target does not consume the source event or create a tracked record.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 22/25 | Capture, transcript, save, writer, validation, runtime probes and their tests. |
| Risk | 21/25 | Tracked user answers, concurrent appends, cross-phase routing and level inference. |
| Research | 18/20 | The live Claude payload probe and four runtime answer-surface probes. |
| Multi-Agent | 10/15 | Workstreams: four DeepSeek workers on disjoint file sets, verified by the orchestrator. |
| Coordination | 9/15 | Dependencies: the save wiring waits on the writer, the sweep and Stop nudge on the capture core. |
| **Total** | **80/100** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Claude PostToolUse carries no AskUserQuestion answers. | M | M | The sweep reads the transcript at save, and the adapter writes nothing when answers are absent. |
| R-002 | A decision lands in the wrong packet. | H | L | Routing reuses the save's child resolver, and an unresolved target leaves the item pending. |
| R-003 | Creating decision-record.md flips a markerless packet to Level 3. | H | L | The writer stamps the pre-write level marker first and a test compares levels before and after. |
| R-004 | A process question reaches the tracked record. | M | L | The capture core filters it at capture and at sweep, and tests cover each process class. |
| R-005 | An answer containing Markdown breaks the record structure. | M | L | The writer stores each verbatim value in a fence longer than any backtick run inside it. |

---

## 11. USER STORIES

### US-001: Answers recorded without retyping (Priority: P0)

**As an** operator, **I want** each answer I give to an AI question recorded as a short decision with my exact words beside it, **so that** I never retype an exchange and the reason survives the session.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: A record that stays trustworthy (Priority: P1)

**As a** maintainer reading a packet later, **I want** the decision record free of duplicates and process noise, with the packet's level unchanged, **so that** the record can be audited without cleanup.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- ANSWERED: Claude PostToolUse tool_response carries AskUserQuestion answers. The live probe saw `tool_response.answers` map the question text to the answer (scratch/t001-probe/T001-result.md), so the adapter is registered. The transcript sweep stays on as the backstop.
- UNKNOWN: Can Codex expose the answer to its PostToolUse hook or transcript? An offline scan of stored rollouts found the tool named only in instructions, with no answered call. T016 keeps its adapter disabled.
- PARTLY ANSWERED: OpenCode's stored question tool part carries state.input.questions and state.metadata.answers, and `bin/sweep-opencode.mjs` reads it at save time (Q006). Its tool.execute.after payload is still unprobed, so no live plugin exists. The current SQLite store held no question call to sample, so its newest table layout is read by the same shape, which is inferred.
- UNKNOWN: Can Pi expose the answer through tool_result or its transcript? No answered call was found in stored sessions. T018 keeps its adapter disabled.
- PARTLY ANSWERED: Devin's stored transcript holds the answer as tool-result text that starts "User answered your questions:", and `bin/sweep-devin.mjs` reads it at save time (Q006). Its PostToolUse payload is still unprobed, so no hook is registered.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See plan.md
- **Task Breakdown**: See tasks.md
- **Acceptance Criteria**: See acceptance-criteria.md
- **Decision Record**: See decision-record.md
- **Timeline**: See timeline.md


