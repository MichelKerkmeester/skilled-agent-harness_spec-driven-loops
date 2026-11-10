# Deep Review Report — Decision Capture

## Executive Summary

- **Verdict:** CONDITIONAL
- **hasAdvisories:** false
- **Active findings:** P0: 0 · P1: 2 · P2: 3
- **Scope:** Decision-capture queueing and sweeps, runtime adapters, matcher and consumed-log writer, save orchestration, series traceability, feature documentation, and manual-test scenarios.
- **Operator review focus:** Decision-capture series code and docs: .skilled/hooks/decision-capture (lib, bin sweeps, claude, devin, pi adapters and tests), .opencode/plugins/decision-capture.js, system-spec-kit runtime decision-table-matcher.ts, cli/continuity/match-decision-table.ts, decision-record-writer.ts consumed-log reader, cli/core/workflow.ts operator-decision path, .skilled/commands/speckit/save.md decision step, hooks README and coverage-rationale, the operator-decision-capture feature catalog entry and the decision-capture playbook scenarios. Look for correctness bugs, security and path issues, maintainability and overengineering.

The review found two P1 issues: Claude and Pi can select a transcript under a colliding project-path key, and the series phase map includes phase 007 while the parent binding and closure contract stop at 006. Three P2 issues concern symlink containment, question detection on a closing code or quote paragraph, and stale OpenCode/Devin capability wording in the transcript-sweeps playbook. No implementation or documentation files in the reviewed product scope were changed. Tests were inspected but not executed.

## Planning Trigger

`/speckit:plan` is required because the review has active P1 findings. The packet below is built from the reducer registry and canonical iteration `findingDetails`; missing structured evidence is marked `UNKNOWN`.

### Planning Packet

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {
      "id": "LUNA-R1-P1-001",
      "severity": "P1",
      "title": "Claude and Pi can select a transcript from a different project when project paths collide",
      "dimension": "correctness",
      "file": ".skilled/hooks/decision-capture/bin/sweep-transcript.mjs:244",
      "findingClass": "cross_project_transcript_contamination",
      "affectedSurfaceHints": [".skilled/hooks/decision-capture/bin/sweep-transcript.mjs", ".skilled/hooks/decision-capture/bin/sweep-pi.mjs", ".skilled/hooks/decision-capture/lib/capture-core.mjs", ".skilled/commands/speckit/save.md"],
      "evidenceRefs": [".skilled/hooks/decision-capture/bin/sweep-transcript.mjs:239", ".skilled/hooks/decision-capture/bin/sweep-transcript.mjs:254", ".skilled/hooks/decision-capture/bin/sweep-transcript.mjs:194", ".skilled/hooks/decision-capture/bin/sweep-pi.mjs:275", ".skilled/hooks/decision-capture/bin/sweep-pi.mjs:280", ".skilled/hooks/decision-capture/bin/sweep-pi.mjs:234"]
    },
    {
      "id": "LUNA-R3-P1-004",
      "severity": "P1",
      "title": "The series phase map includes phase 007 while its binding and closure contract stop at 006",
      "dimension": "traceability",
      "file": "specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/goal.md:61",
      "findingClass": "phase_closure_contract_drift",
      "affectedSurfaceHints": ["specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/spec.md", "specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/goal.md", "specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/handover.md", "specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/002-table-row-matching/acceptance-criteria.md", "specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/004-opencode-devin-live-capture/acceptance-criteria.md", "specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/005-chat-question-detection/acceptance-criteria.md", "specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/007-gap-closure/goal.md"],
      "evidenceRefs": ["specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/spec.md:109-117", "specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/goal.md:61-68", "specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/goal.md:79-86", "specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/007-gap-closure/goal.md:34-58", "specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/002-table-row-matching/acceptance-criteria.md:64-74", "specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/002-table-row-matching/acceptance-criteria.md:99-103", "specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/004-opencode-devin-live-capture/acceptance-criteria.md:89-92", "specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/005-chat-question-detection/acceptance-criteria.md:92-95"]
    },
    {
      "id": "LUNA-R1-P2-002",
      "severity": "P2",
      "title": "A closing code or quotation paragraph can be emitted as a chat question",
      "dimension": "correctness",
      "file": ".skilled/hooks/decision-capture/lib/chat-questions.mjs:90",
      "findingClass": "false_positive_chat_candidate",
      "affectedSurfaceHints": [".skilled/hooks/decision-capture/lib/chat-questions.mjs", ".skilled/hooks/decision-capture/bin", ".skilled/commands/speckit/save.md"],
      "evidenceRefs": "UNKNOWN"
    },
    {
      "id": "LUNA-R2-P2-003",
      "severity": "P2",
      "title": "The shared decision queue follows a symlink outside the project root",
      "dimension": "security",
      "file": ".skilled/hooks/decision-capture/lib/capture-core.mjs:238",
      "findingClass": "symlinked_queue_path_escape",
      "affectedSurfaceHints": [".skilled/hooks/decision-capture/lib/capture-core.mjs", ".skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs", ".skilled/hooks/decision-capture/devin/ask-capture-posttooluse.mjs", ".skilled/hooks/decision-capture/pi/decision-capture.ts", ".opencode/plugins/decision-capture.js", ".skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts", ".skilled/skills/system-spec-kit/runtime/cli/continuity/match-decision-table.ts"],
      "evidenceRefs": "UNKNOWN"
    },
    {
      "id": "LUNA-R3-P2-005",
      "severity": "P2",
      "title": "The transcript-sweeps playbook incorrectly says OpenCode and Devin have no live hook",
      "dimension": "traceability",
      "file": ".skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-transcript-sweeps.md:25",
      "findingClass": "playbook_runtime_capability_drift",
      "affectedSurfaceHints": [".skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-transcript-sweeps.md", ".opencode/plugins/decision-capture.js", ".devin/hooks.v1.json", ".skilled/hooks/coverage-rationale.md", ".skilled/skills/system-spec-kit/feature-catalog/ux-hooks/operator-decision-capture.md"],
      "evidenceRefs": "UNKNOWN"
    }
  ],
  "remediationWorkstreams": [
    {"priority": "P1", "findingIds": ["LUNA-R1-P1-001"], "title": "Make Claude and Pi transcript selection project-identity safe; cover colliding paths and explicit transcript overrides."},
    {"priority": "P1", "findingIds": ["LUNA-R3-P1-004"], "title": "Reconcile the parent phase map, phase binding, phase-007 objective, and child closure evidence."},
    {"priority": "P2", "findingIds": ["LUNA-R2-P2-003"], "title": "Enforce project-root containment for queue and consumed-log paths, including symlink cases."},
    {"priority": "P2", "findingIds": ["LUNA-R1-P2-002"], "title": "Apply the same prose/code/quotation filtering to the closing paragraph as to earlier paragraphs."},
    {"priority": "P2", "findingIds": ["LUNA-R3-P2-005"], "title": "Correct the transcript-sweeps capability explanation while retaining its recovery role."}
  ],
  "specSeed": [
    "Define a canonical project-identity invariant for transcript selection across Claude and Pi and preserve it through queue insertion.",
    "Specify containment behavior for queue and consumed-log paths when the expected state directory is a symlink.",
    "Align parent and child phase completion authority, including whether phase 007 belongs to the series and what its objective is.",
    "Keep question-candidate extraction consistent for closing and non-closing paragraphs; update the operator scenario to distinguish live capture from sweep recovery."
  ],
  "planSeed": [
    "Trace Claude and Pi default selectors from project-directory key construction through candidate selection and queue append; add collision regression cases and verify exact project identity before sweeping.",
    "Trace the shared queue and consumed-log paths from adapters through capture core, matcher, and writer; reject or safely handle symlink escapes and add path-containment regression cases.",
    "Resolve the phase-007 boundary with the series owner, then reconcile root phase map, goal binding and criteria, phase-007 goal, handover, and stale child closure statements against evidence.",
    "Apply shared prose filtering to the closing chat paragraph and add code/quotation edge cases.",
    "Update the transcript-sweeps playbook to describe OpenCode and Devin live hooks and explain that sweeps recover missed answers; review linked catalog and runtime rows for consistency."
  ],
  "findingClasses": ["cross_project_transcript_contamination", "phase_closure_contract_drift", "false_positive_chat_candidate", "symlinked_queue_path_escape", "playbook_runtime_capability_drift"],
  "affectedSurfacesSeed": [".skilled/hooks/decision-capture/bin/sweep-transcript.mjs", ".skilled/hooks/decision-capture/bin/sweep-pi.mjs", ".skilled/hooks/decision-capture/lib/capture-core.mjs", ".skilled/hooks/decision-capture/lib/chat-questions.mjs", ".skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs", ".skilled/hooks/decision-capture/devin/ask-capture-posttooluse.mjs", ".skilled/hooks/decision-capture/pi/decision-capture.ts", ".opencode/plugins/decision-capture.js", ".skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts", ".skilled/skills/system-spec-kit/runtime/cli/continuity/match-decision-table.ts", ".skilled/commands/speckit/save.md", "specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/spec.md", "specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/goal.md", "specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/handover.md", "specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/002-table-row-matching/acceptance-criteria.md", "specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/004-opencode-devin-live-capture/acceptance-criteria.md", "specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/005-chat-question-detection/acceptance-criteria.md", "specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/007-gap-closure/goal.md", ".skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-transcript-sweeps.md", ".skilled/hooks/coverage-rationale.md", ".skilled/skills/system-spec-kit/feature-catalog/ux-hooks/operator-decision-capture.md"],
  "fixCompletenessRequired": true
}
```

## Active Finding Registry

### P1 — LUNA-R1-P1-001: Claude and Pi can select a transcript from a different project when project paths collide

- **Dimension / location:** correctness · `.skilled/hooks/decision-capture/bin/sweep-transcript.mjs:244`
- **Evidence:** Claude's lossy project-directory key is formed at `sweep-transcript.mjs:239`; Pi uses a similarly lossy key at `sweep-pi.mjs:275-280`. The default selector picks the newest candidate without validating canonical project identity, then the sweep appends its extracted answers to the current project's queue (`sweep-transcript.mjs:194`, `sweep-pi.mjs:234`).
- **Impact:** A path pair such as `/work/foo-bar` and `/work/foo/bar` can share the normalized selector key. A sweep can therefore import another project's transcript and decisions into the current project queue.
- **Recommendation:** Use a collision-resistant project identity or verify the selected transcript's canonical project path before processing. Add regression coverage for colliding paths on both runtimes.
- **Disposition:** Active. **findingClass:** `cross_project_transcript_contamination`.
- **scopeProof:** Both default selectors run when `--transcript` is absent, and each sweep appends to the current `projectDir` queue.
- **affectedSurfaceHints:** `.skilled/hooks/decision-capture/bin/sweep-transcript.mjs`; `.skilled/hooks/decision-capture/bin/sweep-pi.mjs`; `.skilled/hooks/decision-capture/lib/capture-core.mjs`; `.skilled/commands/speckit/save.md`.

### P1 — LUNA-R3-P1-004: The series phase map includes phase 007 while its binding and closure contract stop at 006

- **Dimension / location:** traceability · `specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/goal.md:61`
- **Evidence:** The parent phase map lists phase 007 as Complete (`spec.md:109-117`), while the parent goal binds and defines closure only for 001–006 (`goal.md:61-86`). Phase 007's goal retains placeholders (`007-gap-closure/goal.md:34-58`); child closure language in 002, 004, and 005 also conflicts with evidence marked Met (`002-table-row-matching/acceptance-criteria.md:99-103`, `004-opencode-devin-live-capture/acceptance-criteria.md:89-92`, `005-chat-question-detection/acceptance-criteria.md:92-95`).
- **Impact:** A maintainer cannot tell whether phase 007 is inside the series completion contract or whether the phase and child packets have actually closed.
- **Recommendation:** Establish the intended series boundary, then align the parent goal and phase map, phase-007 goal, handover, and child closure statements with the recorded evidence.
- **Disposition:** Active. **findingClass:** `phase_closure_contract_drift`.
- **scopeProof:** The current phase map includes 007 as Complete, the parent goal enumerates 001–006, and the 007 goal has placeholders; stale closure text conflicts with rows marked Met.
- **affectedSurfaceHints:** the parent `spec.md`, `goal.md`, and `handover.md`; child acceptance criteria for phases 002, 004, and 005; phase-007 `goal.md`.

### P2 — LUNA-R2-P2-003: The shared decision queue follows a symlink outside the project root

- **Dimension / location:** security · `.skilled/hooks/decision-capture/lib/capture-core.mjs:238`
- **Evidence:** The shared queue path is joined beneath the project directory at `capture-core.mjs:238-247`; the save-time consumed-log paths are handled in `decision-record-writer.ts:756-803,811-838`, and the matcher reads the same state path at `match-decision-table.ts:103-112`.
- **Impact:** If the expected state directory is a symlink to a path outside the project, captured answers and consumed-key bookkeeping can be redirected outside the intended project boundary.
- **Recommendation:** Enforce real-path containment or reject symlinked state paths consistently across queue creation and save-time readers/writers. Cover symlink escape and ordinary in-root paths.
- **Disposition:** Active. **findingClass:** `symlinked_queue_path_escape`.
- **scopeProof:** Live adapters pass their runtime project directory to the shared core; writer and matcher use the same relative state directory without a real-path containment check.
- **affectedSurfaceHints:** shared capture core; Claude, Devin, and Pi adapters; OpenCode plugin; decision-record writer; continuity matcher CLI.

### P2 — LUNA-R1-P2-002: A closing code or quotation paragraph can be emitted as a chat question

- **Dimension / location:** correctness · `.skilled/hooks/decision-capture/lib/chat-questions.mjs:90`
- **Evidence:** The closing-paragraph path at `chat-questions.mjs:90` checks for a question mark, while earlier paragraphs pass through `prose()` filtering at `chat-questions.mjs:34,81`.
- **Impact:** A code or quotation paragraph ending in `?` can become a question candidate and be offered as an operator decision.
- **Recommendation:** Apply the same prose/code/quotation filtering to the closing paragraph before ranking it. Add focused code and quote cases.
- **Disposition:** Active. **findingClass:** `false_positive_chat_candidate`.
- **scopeProof:** UNKNOWN in the canonical structured record.
- **affectedSurfaceHints:** `chat-questions.mjs`; transcript sweep bin; `.skilled/commands/speckit/save.md`.

### P2 — LUNA-R3-P2-005: The transcript-sweeps playbook incorrectly says OpenCode and Devin have no live hook

- **Dimension / location:** traceability · `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-transcript-sweeps.md:25`
- **Evidence:** The playbook statement at `:19-25` conflicts with the OpenCode live plugin at `.opencode/plugins/decision-capture.js:51-79` and Devin PostToolUse configuration at `.devin/hooks.v1.json:161-166`.
- **Impact:** Operators may expect sweep-only capture and misunderstand which behavior the live-conversation scenario validates.
- **Recommendation:** Describe OpenCode and Devin live capture accurately and retain the sweeps scenario as recovery for missed answers.
- **Disposition:** Active. **findingClass:** `playbook_runtime_capability_drift`.
- **scopeProof:** The playbook conflicts with the OpenCode plugin, Devin hook configuration, coverage rationale, and runtime matrix.
- **affectedSurfaceHints:** transcript-sweeps playbook; OpenCode plugin; Devin hook config; hooks coverage rationale; operator-decision-capture feature catalog entry.

## Remediation Workstreams

1. **P1 — Project identity in Claude and Pi sweeps:** preserve a canonical project identity across key construction, transcript selection, and queue insertion; add colliding-path regression cases for each selector.
2. **P1 — Series phase closure:** decide whether phase 007 belongs to the parent series, then align the phase map, parent goal, phase-007 objective, handover, and child closure evidence. Preserve the unresolved source conflict until the owning docs agree.
3. **P2 — Queue path containment:** enforce project-root containment for queue and consumed-log paths, including symlink behavior, across adapters, matcher, and writer.
4. **P2 — Closing paragraph filtering:** reuse prose filtering for the final paragraph and cover code and quotation inputs.
5. **P2 — Capability documentation:** correct the transcript-sweeps playbook's OpenCode and Devin statements and retain its recovery purpose.

## Spec Seed

- Define the canonical project identity used by Claude and Pi selectors and its validation before transcript processing.
- Define a containment invariant for capture queue and consumed-log files, including symlink handling.
- Resolve phase 007's relationship to the parent completion contract and align the parent map, goal, child closure records, and phase-007 objective.
- Require consistent prose filtering for chat-question candidates, including the final paragraph.
- Align the transcript-sweeps playbook with live adapter availability while documenting recovery behavior.

## Plan Seed

- Trace Claude and Pi selector key generation, default candidate choice, and project queue writes; add colliding-path tests and validate selected transcript identity.
- Trace queue and consumed-log paths through the shared core, matcher CLI, decision-record writer, and adapters; cover symlink escape and normal in-root cases.
- Confirm the intended phase-007 boundary with the series owner; reconcile root and child closure claims against acceptance evidence and complete the phase-007 objective if it is in scope.
- Apply shared prose filtering to the closing question candidate and add code/quotation edge cases.
- Update the transcript-sweeps scenario and cross-check OpenCode, Devin, catalog, README, and coverage rationale descriptions.

## Traceability Status

### Core Protocols

| Protocol | Status | Evidence and unresolved drift |
|---|---|---|
| `spec_code` | **fail** | `spec.md:109-117` marks phase 007 Complete, but `goal.md:61-86` binds only phases 001–006 and `007-gap-closure/goal.md:34-58` remains a placeholder. The boundary is unresolved. |
| `checklist_evidence` | **fail** | `002-table-row-matching/acceptance-criteria.md:99-103`, `004-opencode-devin-live-capture/acceptance-criteria.md:89-92`, and `005-chat-question-detection/acceptance-criteria.md:92-95` retain closure statements that disagree with Met rows or completion evidence. |
| `AC_COVERAGE` | **exempt** | The target is a phased series parent; it has no root `acceptance-criteria.md` or root `implementation-summary.md` to count. Child acceptance criteria were reviewed under `checklist_evidence`. |

### Overlay Protocols

| Protocol | Status | Evidence and unresolved drift |
|---|---|---|
| `skill_agent` | **notApplicable** | `.skilled/commands/speckit/save.md:61-77` exposes the save behavior; no separate dispatched agent contract owns decision capture. |
| `agent_cross_runtime` | **pass** | The feature catalog, hooks README, and live-conversation scenario align on Claude, Devin, OpenCode, and Pi live capture; Codex save-time capture; and Cursor unverified. See catalog `:29-47`, README `:271-275`, and live scenario `:351-384`. |
| `feature_catalog_code` | **pass** | The operator-decision-capture catalog matches the save command and OpenCode implementation. See catalog `:29-47`, `.skilled/commands/speckit/save.md:64-77`, and `.opencode/plugins/decision-capture.js:51-79`. |
| `playbook_capability` | **fail** | The transcript-sweeps scenario says OpenCode and Devin have no live hook, contradicted by `.opencode/plugins/decision-capture.js:51-79` and `.devin/hooks.v1.json:161-166`. |

## Deferred Items

- No candidate is marked deferred or blocked by the reducer.
- The five active findings remain open for follow-up planning; this review did not modify product code, docs, or tests.
- Tests were read for coverage context but not executed.

## Dimension Expansion Map

- **Review dimensions completed:** correctness, security, traceability, maintainability; a final correctness stabilization pass followed.
- **Divergence:** no started, completed, or failed pivots; no audited overrides; no saturated directions; no Council artifact references.
- **Selected review directions:** correctness, security, traceability, maintainability, then correctness stabilization.
- **Remaining frontier:** none recorded by the reducer.

## Search Ledger

### Required Search Coverage

- **Required bug classes:** `project_path_identity`.
- **Covered:** `project_path_identity` (iterations 1 and 5).
- **Ruled out / deferred / blocked:** none for this required-class record.
- **Graph coverage mode:** `graph`.
- **Search debt:** none (`searchDebt: []`).

### Candidate Coverage

- **Covered:** `acceptance_closure_alignment`, `false_positive_question_detection`, `feature_catalog_path_alignment`, `matcher_cli_separation`, `overengineered_abstraction`, `parent_goal_phase_alignment`, `project_path_identity`, `queue_path_containment`, `runtime_adapter_duplication`, `runtime_capability_documentation`, `save_target_resolution`, `shared_core_boundary`, `source_key_path_injection`, `test_coverage_maintainability`.
- **Ruled out:** `feature_catalog_path_alignment`, `matcher_cli_separation`, `overengineered_abstraction`, `runtime_adapter_capability_alignment`, `runtime_adapter_duplication`, `save_target_resolution`, `shared_core_boundary`, `source_key_path_injection`, `test_coverage_maintainability`.
- **Deferred / blocked:** none.
- **Unclosed candidate entry:** `maintainability_and_test_coverage` is neither covered, ruled out, deferred, nor blocked in `byBugClass`; it is not in the reducer's required `searchCoverage` set and did not create search debt.

### Ruled-Out Candidates and Clean Search Proof

| ID / iteration | Candidate | Evidence or clean-search proof |
|---|---|---|
| `SL-004` / 2 | `save_target_resolution` | `workflow.ts:658,671` and `input-normalizer.ts:222`; decision payload values are not passed as destination paths. |
| `SL-005` / 2 | `source_key_path_injection` | `input-normalizer.ts:222` and `decision-record-writer.ts:80`; accepted source-key alphabet excludes slash and backslash. |
| `SL-009` / 3 | `feature_catalog_path_alignment` | Catalog `:29-47`, hooks README `:271-275`, coverage rationale `:90-92`; direct comparison found the runtime matrix consistent. |
| `SL-010` / 3 | `runtime_adapter_capability_alignment` | Live scenario `:351-384`, OpenCode plugin `:51-79`, Devin config `:161-166`, Pi adapter `:48-117`; runtime matrix matches adapter behavior apart from the separate transcript-sweeps wording finding. |
| `SL-011` / 4 | `shared_core_boundary` | `capture-core.mjs:129-165,254-329` and `chat-questions.mjs:81-158`; common queue behavior is centralized while runtime parsing remains at the edge. |
| `SL-012` / 4 | `runtime_adapter_duplication` | OpenCode `:138-212,255-279`, Pi `:234-261`, Codex `:311-349`; no shared sweep wrapper was justified by current behavior. |
| `SL-013` / 4 | `matcher_cli_separation` | Matcher `:78-213`; CLI `:22-33,255-277`; CLI delegates match decisions to the reusable matcher. |
| `SL-014` / 4 | `test_coverage_maintainability` | Shared-core, runtime sweep, plugin, matcher, and writer suites are organized around their behavior boundaries; see iteration 4 for the full reviewed test list. |
| `SL-015` / 4 | `overengineered_abstraction` | `capture-core.mjs:254-329`, matcher `:143-209`, and `workflow.ts:636-708,716-765`; reviewed abstractions have current queue, matching, or cross-packet correctness roles. |

## Audit Appendix

### Convergence Summary

- The loop stopped by legal convergence after iteration 5, before the seven-iteration limit.
- New-finding ratios were `1, 1, 1, 0, 0`; the final two-iteration mean and median absolute deviation were both 0.
- All four required dimensions were covered. The reducer reports `convergenceScore: 1`, graph score `0.96`, and graph decision `STOP_ALLOWED`, with no graph blockers.
- The iteration-5 graph event records a converged decision; its signal summary has dimension coverage 1, evidence density 1, finding stability 0.8, hotspot saturation 1, P0 resolution rate 1, and score 0.96.
- Active findings at closeout: P0 0, P1 2, P2 3; none resolved.

### Coverage Summary

- Iterations 1–5 addressed correctness, security, traceability, maintainability, and a correctness stabilization pass.
- The target review focus was included verbatim in every iteration narrative; iteration 3's focus binding is in its own section so reducer dimension parsing remains unambiguous.
- Traceability checks: 6 required and executed; 2 pass, 3 fail, 1 not applicable, 0 blocked.
- Resource-map coverage gate was skipped because `resource_map_present` was false at initialization. The lineage reducer still emitted `resource-map.md`.

### Ruled-Out Claims

- No feature-catalog or README runtime-matrix drift was found in the reviewed rows.
- The live-conversation scenario accurately distinguishes live adapters from Codex save-time capture and documents Devin nudge visibility and Codex skips.
- The matcher CLI delegates match decisions to the matcher library; no unnecessary abstraction or sweep-wrapper consolidation was supported by the reviewed code.
- Save-target resolution and source-key path injection were ruled out with the evidence listed in Search Ledger.

### Sources Reviewed

The exact file and line inventory is recorded under **Files Reviewed** in `iterations/iteration-001.md` through `iterations/iteration-005.md`. Reviewed areas included:

- `.skilled/hooks/decision-capture/lib/` shared queue and chat-question logic, with its tests.
- `.skilled/hooks/decision-capture/bin/` Claude/transcript, Codex, Devin, OpenCode, and Pi sweeps, with runtime-specific tests.
- Claude, Devin, and Pi live adapters; the OpenCode plugin and tests; Claude and Devin hook configuration.
- `decision-table-matcher.ts`, `match-decision-table.ts`, `decision-record-writer.ts`, `workflow.ts`, `input-normalizer.ts`, and `.skilled/commands/speckit/save.md`.
- The parent decision-capture spec, goal, handover, phase 002/004/005 acceptance criteria, and phase-007 goal and implementation summary.
- Decision-capture transcript-sweeps, live-conversation, save-writer, sibling-reproof, and kill-switch playbooks; hooks README; coverage rationale; and the operator-decision-capture feature catalog entry.

### Cross-Reference Appendix

#### Core Protocols

- `spec_code` — fail; phase-map and parent/child scope conflict remains active as `LUNA-R3-P1-004`.
- `checklist_evidence` — fail; stale closure statements remain active under the same P1.
- `AC_COVERAGE` — exempt for the phased root target; child checklist evidence was reviewed separately.

#### Overlay Protocols

- `skill_agent` — not applicable.
- `agent_cross_runtime` — pass.
- `feature_catalog_code` — pass.
- `playbook_capability` — fail; stale OpenCode/Devin wording remains active as `LUNA-R3-P2-005`.

## Remediation

Each finding was checked against the code before it was acted on.

| Finding | Disposition | Change | Proof |
|---------|-------------|--------|-------|
| LUNA-R1-P1-001 | Fixed | `sweep-transcript.mjs` and `sweep-pi.mjs` pick the newest transcript whose recorded `cwd` resolves to the project; Claude reads it from the first lines that carry one, Pi from the session header | New tests "the CLI skips a newer transcript recorded for another project" and "a newer session recorded for another project is skipped"; hooks suites 105 of 105 |
| LUNA-R3-P1-004 | Fixed | 002, 004 and 005 closure statements read Yes (no criterion row was left Unmet); `007-gap-closure/goal.md` filled; the parent goal binds 007; `handover.md` marked superseded | `validate.sh --strict --recursive` |
| LUNA-R2-P2-003 | Not fixed: false positive for this design | `doctor:symlink` installs Skilled by symlinking the whole `.skilled` directory into a project (`.skilled/commands/doctor/assets/symlink-manifest.json`), so the queue path resolving outside the project is the supported layout, and a real-path containment check would stop capture in every linked install. Anyone able to plant that symlink can already write the queue directly | None |
| LUNA-R1-P2-002 | Fixed | `chat-questions.mjs` checks the closing paragraph's question mark after `prose()` strips code and quotes | New test "a closing paragraph whose only question mark is in code or a quote does not ask" fails on the old line and passes on the new one; the labelled chat fixtures still pass |
| LUNA-R3-P2-005 | Fixed | The transcript-sweeps playbook says the Claude, OpenCode and Devin live hooks miss answers only while they are off or failing, and the sweeps recover them | `validate_document.py`: 0 issues |

The lineage exited 1 although its loop completed: the write-containment guard charged it with files another session wrote at the same time, all of them conversation-playbook files under `.skilled/**/manual-testing-playbook/` and `sk-create-manual-testing-playbook/`. No flagged path is a review artifact.
