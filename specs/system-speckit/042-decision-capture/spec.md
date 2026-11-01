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

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
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
| .skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs | Create | Capture Claude AskUserQuestion events when the live probe confirms useful payload fields. |
| .skilled/hooks/decision-capture/bin/sweep-transcript.mjs | Create | Recover missed tool answers and identify candidate plain-chat exchanges. |
| .skilled/skills/.state/decision-capture/README.md | Create | Explain the gitignored queue and retention boundary. |
| .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts | Create | Route and upsert decision entries and their verbatim appendix by stable question id. |
| .skilled/skills/system-spec-kit/runtime/cli/utils/input-normalizer.ts | Modify | Accept the operatorDecisions save payload. |
| .skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts | Modify | Pass confirmed decisions to the writer during full-auto save. |
| .skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts | Modify | Document the new save payload and its target rules. |
| .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts | Modify | Nudge when eligible queued decisions remain unconsumed. |
| .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json | Modify | Register only runtime adapters with confirmed answer delivery. |
| .claude/settings.json | Regenerate | Mirror the confirmed Claude hook registration. |
| .codex/hooks.json and .devin/hooks.v1.json | Conditional regeneration | Add registrations only after each runtime probe confirms the answer surface. |
| .opencode/plugins/decision-capture.js and .pi/extensions/decision-capture.ts | Conditional create | Add adapters only after each runtime probe confirms the answer surface. |
| .skilled/skills/system-spec-kit/templates/addons/decision-record.md.tmpl | Modify | Add the operator-decisions and operator-answers-verbatim anchors. |
| .skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts | Modify | Keep the new anchors separate from ADR sufficiency checks. |
| .skilled/commands/speckit/save.md and .skilled/skills/system-spec-kit/references/memory/save-workflow.md | Modify | Read, filter, rewrite and consume eligible queued exchanges during save. |
| .skilled/skills/system-spec-kit/references/structure/phase-definitions.md | Modify | Document the optional parent record for cross-phase decisions. |
| .skilled/hooks/decision-capture/lib/capture-core.test.mjs and .skilled/hooks/decision-capture/bin/sweep-transcript.test.mjs | Create | Cover capture, filtering, transcript recovery and chat confirmation. |
| .skilled/skills/system-spec-kit/runtime/cli/tests/decision-record-writer.vitest.ts | Create | Cover record writes, routing, idempotence, appendix and level guard. |
| .skilled/skills/system-spec-kit/runtime/cli/tests/save-continuity-write.vitest.ts | Modify | Cover the full-auto save payload and queue consumption. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement |
|----|-------------|
| REQ-001 | Claude capture normalizes every question and answer from an AskUserQuestion result. T001 must establish whether PostToolUse tool_response carries answers. |
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
## L2: NON-FUNCTIONAL REQUIREMENTS

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
## L2: EDGE CASES

- Empty input: an event with no questions creates no queue entry and no decision-record section.
- Maximum input: no product count limit is defined. The parser handles every question in one tool result and tests a multi-question result.
- Failure path: malformed input, an unreadable transcript or an unresolved packet target does not consume the source event or create a tracked record.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 22/25 | Capture, transcript, save, writer, validation, runtime probes and their tests. |
| Risk | 21/25 | Tracked user answers, concurrent appends, cross-phase routing and level inference. |
| Research | 18/20 | The live Claude payload probe and four runtime answer-surface probes. |
| **Total** | **61/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- UNKNOWN: Does Claude PostToolUse tool_response include AskUserQuestion answers? T001 records the observed result. The transcript sweep stays on in either case.
- UNKNOWN: Can Codex expose the answer to its PostToolUse hook or transcript? T016 resolves this. Keep its adapter disabled until confirmed.
- UNKNOWN: Can OpenCode expose the answer through tool.execute.after or its transcript? T017 resolves this. Keep its adapter disabled until confirmed.
- UNKNOWN: Can Pi expose the answer through tool_result or its transcript? T018 resolves this. Keep its adapter disabled until confirmed.
- UNKNOWN: Can Devin expose the answer through PostToolUse or its transcript? T019 resolves this. Keep its adapter disabled until confirmed.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See plan.md
- **Task Breakdown**: See tasks.md
- **Acceptance Criteria**: See acceptance-criteria.md
- **Decision Record**: See decision-record.md
- **Timeline**: See timeline.md


