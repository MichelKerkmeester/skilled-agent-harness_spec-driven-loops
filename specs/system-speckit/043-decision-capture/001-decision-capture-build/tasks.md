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

<!-- SPECKIT_LEVEL: 3 -->

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

- [x] T001 Run the live Claude AskUserQuestion PostToolUse probe with one harmless question (probe output: .skilled/skills/.state/decision-capture/probe/claude-posttooluse.json). Verify: the captured event explicitly shows whether tool_response.answers is present. Do not use a real sensitive answer. Evidence: the main session ran it (scratch/t001-probe/T001-result.md); probe-capture.json shows tool_name AskUserQuestion and tool_response.answers mapping the question text to "Probe answer A", and .claude/settings.local.json was restored byte-identical. The redacted payload is now the adapter's fixture, and capture-core.test.mjs queues exactly one record from it (0 of 1 when the adapter reads a wrong key).
- [x] T002 Record the packet's detected level and confirm that spec.md carries an explicit SPECKIT_LEVEL marker after the move to Level 3 (specs/system-speckit/043-decision-capture/001-decision-capture-build/spec.md). Verify: validate.sh reports Level 3 and the explicit marker is present. Evidence: validate.sh prints `Level:  3` and `LEVEL_MATCH: Level consistent across all files (Level 3)`; spec.md:14 holds `<!-- SPECKIT_LEVEL: 3 -->`.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the runtime-neutral event normalizer and locked queue append (capture-core.mjs). Verify: capture tests accept a valid answer, append a duplicate tool-use id once and write nothing for malformed input. Evidence: `node --test .skilled/hooks/decision-capture/lib/capture-core.test.mjs` 9 pass 0 fail, including the duplicate-key and malformed-input tests.
- [x] T004 Add the Claude AskUserQuestion PostToolUse adapter (ask-capture-posttooluse.mjs). Verify: node --check exits 0 and a fixture shaped like the transcript's toolUseResult proves it passes every answer field to the core. Registration waits for T001. Evidence: `node --check` exits 0; the adapter test spawns the hook with a tool_response.answers payload, it exits 0, prints nothing and writes one queue line.
- [x] T005 Add the transcript sweep with its own JSONL reader and plain-chat candidate pairing (sweep-transcript.mjs). Verify: two tool rounds are recovered, a clearly answered chat question is offered and an unanswered candidate stays unconsumed. Evidence: sweep-transcript.test.mjs 10 pass 0 fail; a sweep of the main session transcript recovered 53 answered questions into a scratch queue.
- [x] T006 Add the process-question filter (capture-core.mjs). Verify: a product question enters the queue while Gate 3, spec-folder, worktree or branch and commit or push questions create no queue event or tracked row. Evidence: the filter test passes and the seven real questions from the main transcript classify as expected, the Q004 workspace question dropped and the Q002 meta-question kept; the old filter got both wrong.
- [x] T007 Normalize and validate operatorDecisions in the save payload (input-normalizer.ts, session-types.ts, generate-context.ts help text). Verify: a valid four-field entry is accepted and a missing required id or decision is rejected. Evidence: save-continuity-write.vitest.ts accepts a valid entry and rejects one missing `decided` before any file is written.
- [x] T008 Resolve standard, phase-parent and phase-child targets with the existing resolveContinuityLeaf (workflow.ts). Verify: a standard packet uses its bound path, a cross-phase decision uses its parent and a local decision uses the selected child. Evidence: save tests write cross-phase to the parent, local to the leaf named by filesModified, and nothing when the paths name two children.
- [x] T009 Upsert by stable question id and consumed source key (decision-record-writer.ts, re-exported from runtime/api/index.ts). Verify: saving the same id twice leaves decision-record.md byte-identical and creates no duplicate row. Evidence: writer and save tests show a second identical write returns changed=false with Buffer-equal bytes and one row per id.
- [x] T010 Write the verbatim appendix beside each decision entry (decision-record-writer.ts). Verify: question, options and answer values compare exactly after rendering, including Markdown fences and newlines. Evidence: the round-trip test reads a fenced question, a piped option and a multi-line answer back exactly; the fence test keeps a quoted `### Q999` and anchor line as text (failed before the fence mask, passes after).
- [x] T011 Preserve the detected packet level before creating decision-record.md, using the exported detectLevel (decision-record-writer.ts, orchestrator.ts). Verify: a markerless Level 2 fixture gets a Level 2 marker before file creation and detected level is 2 before and after; an unresolved level refuses the write. Evidence: the control test shows a bare record moves a markerless packet to Level 3; the guard test adds `<!-- SPECKIT_LEVEL: 2 -->` and detectLevel stays 2 before and after; a missing spec.md throws NO_SPEC.
- [x] T012 Wire full-auto save to pass confirmed decisions to the writer (workflow.ts, documented in save.md, save-workflow.md and phase-definitions.md). Verify: plan-only save displays the proposed entries without consuming them and full-auto save writes them then marks their source keys consumed. Evidence: the plan-only save test leaves no decision-record.md and no consumed.jsonl; the full-auto test writes the row and records the key.
- [x] T013 Add a pending-decision nudge for eligible unconsumed events (session-stop.ts). Verify: a pending count produces one nudge and an empty queue produces none. Evidence: hook-session-stop.vitest.ts 24 pass; the built dist session-stop.js printed one systemMessage on the first run and nothing on the second and in an empty project.
- [x] T014 Add the operator decision and verbatim anchors to the decision-record template (decision-record.md.tmpl). Verify: a newly scaffolded record contains both anchors and no duplicate anchor ids. Evidence: the rendered template holds each operator anchor once as an open and close pair; scaffold-golden-snapshots and template-fill-guidance pass after the snapshot update.
- [x] T015 Confirm operator anchors sit outside ADR sufficiency checks without a code change (spec-doc-structure.ts). Verify: an operator-only decision record passes SPEC_DOC_SUFFICIENCY while the adr- filter at spec-doc-structure.ts:1244 is unchanged. Evidence: a packet copy with only operator anchors passed SPEC_DOC_SUFFICIENCY, ANCHORS_VALID and TEMPLATE_SOURCE; `git diff` of spec-doc-structure.ts is empty.
- [x] T016 Probe Codex PostToolUse and transcript answer visibility (.skilled/skills/.state/decision-capture/probe/codex.json). Verify: an observed answer shape is recorded or status remains UNKNOWN and its adapter stays disabled. Evidence: probe/codex.json records an offline scan with no answered call; status UNKNOWN, no adapter created.
- [x] T017 Probe OpenCode tool.execute.after and transcript answer visibility (.skilled/skills/.state/decision-capture/probe/opencode.json). Verify: an observed answer shape is recorded or status remains UNKNOWN and its adapter stays disabled. Evidence: probe/opencode.json records a stored question part with state.metadata.answers; the hook payload is unprobed, status stays hook UNKNOWN, no adapter created.
- [x] T018 Probe Pi tool_result and transcript answer visibility (.skilled/skills/.state/decision-capture/probe/pi.json). Verify: an observed answer shape is recorded or status remains UNKNOWN and its adapter stays disabled. Evidence: probe/pi.json records no answered call; status UNKNOWN, no adapter created.
- [x] T019 Probe Devin PostToolUse and transcript answer visibility (.skilled/skills/.state/decision-capture/probe/devin.json). Verify: an observed answer shape is recorded or status remains UNKNOWN and its adapter stays disabled. Evidence: probe/devin.json records a stored tool result starting `User answered your questions:`; the hook payload is unprobed, status stays hook UNKNOWN, no adapter created.
- [x] T020 Register only runtime adapters with confirmed answer delivery (hook-registry.json). Verify: node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs --check exits 0, the Claude binding lands only after T001 and UNKNOWN runtimes stay disabled. Evidence: the decision-capture entry is in hook-registry.json and the sync wrote only .claude/settings.json (one PostToolUse group, matcher AskUserQuestion); `--check` prints PASS for 4 files and 32 hooks; hooks README carries the kill-switch, coverage, tree and key-file rows; hook-stdin-deadline.test.mjs 21 of 21 with the new adapter entry; hook-registration-sync.vitest.ts pins 100 bindings and passes 7 of 7. The adapter now resolves the queue from CLAUDE_PROJECT_DIR before the payload cwd, which a test proved wrong first.
- [x] T023 Read Devin's answered ask_user_question calls from its stored transcripts (bin/sweep-devin.mjs). Verify: a redacted real transcript queues each answered product question once, drops the rejected call and the Gate 3 question, and the CLI finds the newest session for the directory in sessions.db. Evidence: sweep-devin.test.mjs 5 of 5 on bin/fixtures/devin-transcript.json; a sweep of five real transcripts into a scratch queue recovered 1, 1, 1, 0 and 0: one product answer each from the three answered sessions, with the Gate 3 questions, the unlettered packet question and the rejected call left out.
- [x] T024 Read OpenCode's answered question calls from its SQLite store (bin/sweep-opencode.mjs). Verify: redacted real parts queue each answered question with multi-select answers joined, error and running parts give nothing, and the CLI finds the newest session for the directory. Evidence: sweep-opencode.test.mjs 6 of 6 on bin/fixtures/opencode-question-parts.json; 206 real stored parts gave 202 records from 167 calls; the live opencode.db opened read-only, resolved this repository's session and recovered 0 in 3 ms, with no queue written.
- [x] T025 Tighten the process filter for the shapes the Devin sessions showed (capture-core.mjs). Verify: a work menu with a "Commit ..." item stays a decision, a question about when to commit is dropped, and an unlettered "New packet" offer is dropped. Evidence: both new tests failed first; under the old filter the Devin suite fails 5 of 5; all four decision-capture suites now pass 34 of 34.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T021 Run the focused capture, transcript, filter, save-payload and writer suites (decision-capture test files). Verify: node --test reports all ESM tests passing and the CLI Vitest project reports all save and writer tests passing. Evidence: node --test over capture-core, sweep-transcript, sweep-devin and sweep-opencode 34 of 34; hook-stdin-deadline and hook-flags 49 of 49; CLI writer, save and registration-sync files 42 of 42; runtime hook-session-stop and path-parity 148 of 148; full CLI project 194 files, 2273 passed, 20 skipped, exit 0, the same counts as before the registration change.
- [x] T022 Validate the packet and reconcile acceptance evidence (specs/system-speckit/043-decision-capture/001-decision-capture-build/). Verify: validate.sh --strict prints RESULT: PASSED. Evidence: validate.sh --strict printed RESULT: PASSED with Errors 0 and Warnings 1 (AI_PROTOCOLS); all ten acceptance criteria Met.

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Follow-up Fixes

The alignment run over the build commit and the four-runtime playbook runs confirmed these defects after the build. Each code fix got a test that failed first.

- [x] T026 Import the writer and `detectLevel` in the writer test through `@spec-kit/runtime/api`, and re-export `detectLevel` there (decision-record-writer.vitest.ts, runtime/api/index.ts). Verify: `npm --prefix .skilled/skills/system-spec-kit/runtime/cli run check` exits 0. Evidence: before, it exited 1 at the import-policy step on `tests/decision-record-writer.vitest.ts:24`, so the six later steps never ran; after the runtime rebuild all eight steps pass and it exits 0. The writer file passes 11 of 11 through the API.
- [x] T027 Lower the Stop-hook cursor when a save consumes only part of the queue (capture-core.mjs). Verify: three answers report 3, a save that consumes one reports 0, a new answer reports 3. Evidence: the new capture-core test failed first at its last assertion, 0 where 3 was expected, and passes after; capture-core 14 of 14.
- [x] T028 Append a key to consumed.jsonl only when the log does not hold it yet (decision-record-writer.ts). Verify: two saves of one key leave one line. Evidence: the new writer test failed first with three lines for two keys and passes after; the save-writer playbook steps leave one consumed line after two full-auto saves.
- [x] T029 Match a captured answer to a hand-written appendix item that has no source comment by its question and answer text, ignoring case and spacing, and give this packet's Q001 the source comment its shortened question needs (decision-record-writer.ts, decision-record.md, .skilled/skills/.state/decision-capture/README.md). Verify: a re-sweep of the main transcript adds no row. Evidence: the new test failed first, Q004 where Q002 was expected, and passes after, while a question-only match still gets a new id. A re-sweep of the main transcript into a scratch queue reproduced Q001, Q005 and Q006 of the hand-written rows; written into a scratch copy of this packet they got Q001, Q005 and Q006, and the record kept 7 rows with its appendix unchanged.
- [x] T030 Bring the docs in line with the shipped behavior and catalog the feature (SKILL.md, README.md, decision-format.md, template-guide.md, folder-structure.md, save.md, both hooks READMEs, feature-catalog/ux-hooks/operator-decision-capture.md, changelog v2.12.28.0). Verify: the document, catalog, skill-package, frontmatter-version and README count and reference checks pass. Evidence: validate_document reports 0 issues on each changed doc; the catalog package, skill package, root-metadata and freshness checks pass; frontmatter-version verifies 235 of 235; the README count check passes 3 of 3, where `.claude/hooks/README.md` failed 2 claims before.
- [x] T031 Repair the decision-capture and stale playbook scenarios (the three decision-capture scenarios, scenarios 240, 153 and 155, the playbook index). Verify: the playbook package validates and each rewritten command gives the signal it states. Evidence: validate-playbook-package passes with 0 violations and the 1 warning it had before; the save-writer steps pass end to end with rsync setup; scenario 240's command passes 3 files and 24 tests; scenario 155's save prints the SKIPPED block with the directory reason and its suite passes 3 of 3; scenario 153 is marked retired in the index.
- [x] T032 Rerun the whole CLI suite against the baseline taken before the first edit. Verify: no test that passed before fails. Evidence: before, 194 files passed and 3 skipped, 2273 tests passed and 20 skipped, exit 0; after, 194 files passed and 3 skipped, 2276 tests passed and 20 skipped, exit 0, the three new writer cases being the difference.
- [x] T033 Keep the session-relaunch nudge out of dispatched children (`.skilled/hooks/session-relaunch/lib/nudge.cjs`). Verify: the new `child-session` case fails without the guard and passes with it. Evidence: 70 pass and 1 fail without it; 71 of 71 with it; every session-relaunch suite and goal-core pass.

<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All implementation and verification tasks marked [x] with their evidence.
- [x] No [B] blocked tasks remain.
- [x] Every required public surface has a passing happy path and edge case.
- [x] Every non-Claude runtime has a confirmed payload or an explicit UNKNOWN and disabled adapter.
- [x] Strict validation prints RESULT: PASSED.

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

- [x] CHK-001 [P0] The actual Claude PostToolUse result is recorded by T001. Evidence: scratch/t001-probe/T001-result.md and probe-capture.json record tool_response.answers.
- [x] CHK-002 [P0] The writer preserves the packet's detected level from before the record write. Evidence: T011 guard and control tests.
- [x] CHK-003 [P1] Codex, OpenCode, Pi and Devin have separate probe results or explicit UNKNOWN states. Evidence: scratch probe files for all four runtimes (T016-T019).

<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Capture and writer code passes its focused lint and unit-test commands. Evidence: `node --check` on the three hook files, `node --test` 10/10 core and 10/10 sweep, runtime and CLI `tsc --noEmit` exit 0.
- [x] CHK-011 [P0] No comment contains a transient packet, task, requirement or ADR identifier. Evidence: `check-comment-hygiene.sh` exits 0 on all 16 touched code files; a seeded `ADR-001` line makes it exit 1.
- [x] CHK-012 [P1] Invalid payloads and unresolved targets preserve the source queue item. Evidence: the save tests leave the key out of consumed.jsonl for an unresolved target and reject an invalid entry before any write.
- [x] CHK-013 [P1] Concurrent appends cannot interleave or lose an event. Evidence: eight processes appending the same 25 keys leave 25 lines; with the lock bypassed the same test fails 3 of 3 runs.

<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Capture happy path and duplicate or malformed edge cases pass. Evidence: T003.
- [x] CHK-021 [P0] Process filter excludes Gate 3, workspace and permission questions before tracked write. Evidence: T006.
- [x] CHK-022 [P0] Rewrite payload contains decided, why, supersedes and carried by fields. Evidence: T007 and the `Not stated.` and `None` defaults test.
- [x] CHK-023 [P0] Target resolver routes standard, parent and child decisions correctly. Evidence: T008.
- [x] CHK-024 [P0] Re-saving one id leaves the decision record byte-identical. Evidence: T009.
- [x] CHK-025 [P0] Verbatim appendix preserves the original question, options and answer. Evidence: T010.
- [x] CHK-026 [P0] Level guard inserts a missing marker before file creation and proves the detected level stays unchanged. Evidence: T011.
- [x] CHK-027 [P1] Transcript fallback recovers a missed tool answer and plain-chat confirmation rejects an unmatched reply. Evidence: T005; an unanswered chat question has a null key and answer, so it cannot be consumed.
- [x] CHK-028 [P1] Each non-Claude runtime has evidence or stays UNKNOWN and disabled. Evidence: T016-T019.
- [x] CHK-029 [P1] Stop nudge reports pending events without writing a decision. Evidence: T013; the nudge only reads the queue and writes its own counter.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Hook code uses no model credential or external transport. Evidence: `rg` finds no fetch, http, net or child_process use in the non-test hook files; the same search finds child_process in the test file.
- [x] CHK-031 [P0] Process question tests prove excluded answers do not reach either tracked anchor. Evidence: a filtered question never enters the queue (T006), and the sweep output that feeds the save payload reads only the queue and the filtered chat candidates.
- [x] CHK-032 [P1] The writer uses only the bound packet or its resolved phase target. Evidence: T008 routing tests.

<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec.md, plan.md, tasks.md and acceptance-criteria.md agree on each requirement. Evidence: REQ-001 to REQ-010 each appear in spec.md and acceptance-criteria.md, and every task names the requirement surface it builds.
- [x] CHK-041 [P1] The decision template and validator preserve existing ADR behavior while adding operator anchors. Evidence: decision records keep no required anchors (orchestrator.ts:666); spec-doc-structure.ts is unchanged; template tests pass.
- [x] CHK-042 [P2] Runtime-state README explains the gitignored queue and cleanup. Evidence: .skilled/skills/.state/decision-capture/README.md, tracked through the README negation at .gitignore:134.

<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temporary probe data stays under the gitignored .state directory. Evidence: `git check-ignore` matches the probe files through .gitignore:132.
- [x] CHK-051 [P1] No raw probe dump or debugging output is committed. Evidence: from the state folder the commits track only `.skilled/skills/.state/decision-capture/README.md` (`git ls-files`), and worker logs under scratch/runs stay ignored through `*.log` (.gitignore:297), so `git ls-files` lists no `.log` file under scratch/.

<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 14/14 |
| P1 Items | 17 | 17/17 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-11-01
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] ADR-001 and ADR-002 are recorded in decision-record.md and summarized in plan.md's ARCHITECTURE DECISION RECORD section Evidence: decision-record.md ADR-001 and ADR-002, summarized in plan.md.
- [x] CHK-101 [P1] Both ADRs carry an Accepted status Evidence: both ADR Metadata tables say Accepted.
- [x] CHK-102 [P1] Each ADR lists its rejected alternatives with a reason Evidence: each ADR has an Alternatives Considered table with reasons.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] The capture hook makes no model call and returns within its 5 second registry timeout on a multi-question fixture (NFR-P01) Evidence: five runs of the hook on a four-question payload took 55 to 68 ms, with no model call in the code.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] Security review: the queue stays gitignored, and the tracked appendix holds only exchanges routed to the bound packet (NFR-S01, NFR-S02) Evidence: CHK-050 and CHK-032.
- [x] CHK-131 [P1] No new dependency is added Evidence: no package.json or lockfile changed.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] spec.md, plan.md, tasks.md and decision-record.md agree on the refined file list. Evidence: every changed path appears in the spec.md file table and in the task that builds it; ADR-002 lists the six refinements and plan.md the shared surfaces.
- [x] CHK-142 [P2] save.md and save-workflow.md describe the operatorDecisions step the code implements. Evidence: save.md step 3 and the save-workflow.md field table name the same nine fields as OperatorDecisionPayload in input-normalizer.ts.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Approves the commit the main session proposes | [x] Approved | 2026-11-01 |
<!-- /ANCHOR:sign-off -->


