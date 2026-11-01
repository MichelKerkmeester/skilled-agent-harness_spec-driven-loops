---
title: "Tasks: Automatic operator decision capture"
description: "Task Format: T### [P?] Description (file path). Verify: command and expected output."
trigger_phrases:
  - "decision capture tasks"
  - "operator decision capture tests"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Automatic operator decision capture

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| [ ] | Pending |
| [x] | Completed |
| [P] | Parallelizable |
| [B] | Blocked |

**Task Format**: T### [P?] Description (file path). Verify: command and expected output.

Task variables: P is the bound packet path. Q is a stable question id. Tool source key is runtime, session id, tool-use id and question index. Plain-chat source key is runtime, session id and matched question and answer turn ids.

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Run the live Claude AskUserQuestion PostToolUse probe with one harmless question (probe output: .skilled/skills/.state/decision-capture/probe/claude-posttooluse.json). Verify: the captured event explicitly shows whether tool_response.answers is present. Do not use a real sensitive answer.
- [ ] T002 Record the packet's detected level and confirm that spec.md already carries SPECKIT_LEVEL: 2 (specs/system-speckit/042-decision-capture/spec.md). Verify: the pre-write level is 2 and the explicit marker is present.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Add the runtime-neutral event normalizer and locked queue append (capture-core.mjs). Verify: capture tests accept a valid answer, append a duplicate tool-use id once and write nothing for malformed input.
- [ ] T004 Add the Claude AskUserQuestion PostToolUse adapter (ask-capture-posttooluse.mjs). Verify: node --check exits 0 and a fixture proves it passes every confirmed answer field to the core.
- [ ] T005 Add the transcript sweep and plain-chat candidate pairing (sweep-transcript.mjs). Verify: two tool rounds are recovered, a clearly answered chat question is offered and an unanswered candidate stays unconsumed.
- [ ] T006 Add the process-question filter (capture-core.mjs). Verify: a product question enters the queue while Gate 3, spec-folder, worktree or branch and commit or push questions create no queue event or tracked row.
- [ ] T007 Normalize and validate operatorDecisions in the save payload (input-normalizer.ts). Verify: a valid four-field entry is accepted and a missing required id or decision is rejected.
- [ ] T008 Resolve standard, phase-parent and phase-child targets (decision-record-writer.ts). Verify: a standard packet uses its bound path, a cross-phase decision uses its parent and a local decision uses the selected child.
- [ ] T009 Upsert by stable question id and consumed source key (decision-record-writer.ts). Verify: saving the same id twice leaves decision-record.md byte-identical and creates no duplicate row.
- [ ] T010 Write the verbatim appendix beside each decision entry (decision-record-writer.ts). Verify: question, options and answer values compare exactly after rendering, including Markdown fences and newlines.
- [ ] T011 Preserve the detected packet level before creating decision-record.md (decision-record-writer.ts). Verify: a markerless Level 2 fixture gets a Level 2 marker before file creation and detected level is 2 before and after; an unresolved level refuses the write.
- [ ] T012 Wire full-auto save to pass confirmed decisions to the writer (workflow.ts). Verify: plan-only save displays the proposed entries without consuming them and full-auto save writes them then marks their source keys consumed.
- [ ] T013 Add a pending-decision nudge for eligible unconsumed events (session-stop.ts). Verify: a pending count produces one nudge and an empty queue produces none.
- [ ] T014 Add the operator decision and verbatim anchors to the decision-record template (decision-record.md.tmpl). Verify: a newly scaffolded record contains both anchors and no duplicate anchor ids.
- [ ] T015 Keep operator anchors outside ADR sufficiency checks (spec-doc-structure.ts). Verify: a valid operator-only entry passes without weakening existing ADR-001 section checks.
- [ ] T016 Probe Codex PostToolUse and transcript answer visibility (.skilled/skills/.state/decision-capture/probe/codex.json). Verify: an observed answer shape is recorded or status remains UNKNOWN and its adapter stays disabled.
- [ ] T017 Probe OpenCode tool.execute.after and transcript answer visibility (.skilled/skills/.state/decision-capture/probe/opencode.json). Verify: an observed answer shape is recorded or status remains UNKNOWN and its adapter stays disabled.
- [ ] T018 Probe Pi tool_result and transcript answer visibility (.skilled/skills/.state/decision-capture/probe/pi.json). Verify: an observed answer shape is recorded or status remains UNKNOWN and its adapter stays disabled.
- [ ] T019 Probe Devin PostToolUse and transcript answer visibility (.skilled/skills/.state/decision-capture/probe/devin.json). Verify: an observed answer shape is recorded or status remains UNKNOWN and its adapter stays disabled.
- [ ] T020 Register only runtime adapters with confirmed answer delivery (hook-registry.json). Verify: node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs --check exits 0 and UNKNOWN runtimes stay disabled.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T021 Run the focused capture, transcript, filter, save-payload and writer suites (decision-capture test files). Verify: node --test reports all ESM tests passing and the CLI Vitest project reports all save and writer tests passing.
- [ ] T022 Validate the packet and reconcile acceptance evidence (specs/system-speckit/042-decision-capture/). Verify: strict validation leaves no errors outside GENERATED_METADATA_INTEGRITY and GENERATED_METADATA_DRIFT under the fixed metadata scope.

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All implementation and verification tasks marked [x] with their evidence.
- [ ] No [B] blocked tasks remain.
- [ ] Every required public surface has a passing happy path and edge case.
- [ ] Every non-Claude runtime has a confirmed payload or an explicit UNKNOWN and disabled adapter.
- [ ] Strict validation has only the metadata errors permitted by the packet scope, or no errors.

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See spec.md
- **Plan**: See plan.md
- **Acceptance criteria**: See acceptance-criteria.md
- **Decision record**: See decision-record.md
- **Timeline**: See timeline.md

<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| [P0] | HARD BLOCKER | Cannot claim done until complete. |
| [P1] | Required | Complete or record an approved deferral. |
| [P2] | Optional | Defer with a reason. |

No blocked task is planned. If a runtime probe cannot observe an answer, keep that runtime UNKNOWN and disabled and record the evidence in its probe report.

<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The actual Claude PostToolUse result is recorded by T001.
- [ ] CHK-002 [P0] The writer preserves the packet's detected level from before the record write.
- [ ] CHK-003 [P1] Codex, OpenCode, Pi and Devin have separate probe results or explicit UNKNOWN states.

<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Capture and writer code passes its focused lint and unit-test commands.
- [ ] CHK-011 [P0] No comment contains a transient packet, task, requirement or ADR identifier.
- [ ] CHK-012 [P1] Invalid payloads and unresolved targets preserve the source queue item.
- [ ] CHK-013 [P1] Concurrent appends cannot interleave or lose an event.

<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Capture happy path and duplicate or malformed edge cases pass.
- [ ] CHK-021 [P0] Process filter excludes Gate 3, workspace and permission questions before tracked write.
- [ ] CHK-022 [P0] Rewrite payload contains decided, why, supersedes and carried by fields.
- [ ] CHK-023 [P0] Target resolver routes standard, parent and child decisions correctly.
- [ ] CHK-024 [P0] Re-saving one id leaves the decision record byte-identical.
- [ ] CHK-025 [P0] Verbatim appendix preserves the original question, options and answer.
- [ ] CHK-026 [P0] Level guard inserts a missing marker before file creation and proves the detected level stays unchanged.
- [ ] CHK-027 [P1] Transcript fallback recovers a missed tool answer and plain-chat confirmation rejects an unmatched reply.
- [ ] CHK-028 [P1] Each non-Claude runtime has evidence or stays UNKNOWN and disabled.
- [ ] CHK-029 [P1] Stop nudge reports pending events without writing a decision.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] Hook code uses no model credential or external transport.
- [ ] CHK-031 [P0] Process question tests prove excluded answers do not reach either tracked anchor.
- [ ] CHK-032 [P1] The writer uses only the bound packet or its resolved phase target.

<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md, plan.md, tasks.md and acceptance-criteria.md agree on each requirement.
- [ ] CHK-041 [P1] The decision template and validator preserve existing ADR behavior while adding operator anchors.
- [ ] CHK-042 [P2] Runtime-state README explains the gitignored queue and cleanup.

<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temporary probe data stays under the gitignored .state directory.
- [ ] CHK-051 [P1] No raw probe dump or debugging output is committed.

<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 0/13 |
| P1 Items | 11 | 0/11 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-01
<!-- /ANCHOR:summary -->

