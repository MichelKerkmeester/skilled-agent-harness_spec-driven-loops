---
title: "Acceptance Criteria: Phase 5: resume-detection-and-single-workflow"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "resume detection and single workflow acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift/005-resume-detection-and-single-workflow"
    last_updated_at: "2026-11-14T11:33:22Z"
    last_updated_by: "scaffold"
    recent_action: "Every criterion verified at 2e1e9c973d"
    next_safe_action: "None. The packet is closeable"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-resume-detection-and-single-workflow"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 5: resume-detection-and-single-workflow

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `005-resume-detection-and-single-workflow`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a session whose id matches a claimed note under `.skilled/skills/.state/session-relaunch/handoffs/` or a packet's `session_ref.sessionId`, When an agent runs `/speckit:resume` with no argument, Then the workflow tells it to open that note's `spec_folder` or that packet before any other tier | `rg -n -e 'session-relaunch/handoffs' -e 'claimed_by' -e 'session_ref.sessionId' .skilled/commands/speckit/assets/speckit-resume.yaml` prints lines inside `session_detection` that come before every other tier. Observed at `2e1e9c973d`: lines 87, 88 and 93, inside `session_detection` and above `tier_4_no_session_owned_source`. Evidence: .skilled/commands/speckit/assets/speckit-resume.yaml:87 | Met | - |
| AC-002 | REQ-002 | Given no argument and no session-owned source, When resume runs under auto, Then it prints the No Session result and opens no packet. Under confirm it lists candidates labelled as not matched to this session and waits | `rg -n 'by mtime' .skilled/commands/speckit/assets/speckit-resume.yaml` prints only lines inside a confirm-only block, and `rg -n -B6 'not matched to this session' .skilled/commands/speckit/assets/speckit-resume.yaml` shows `applies_to: confirm`. Observed at `2e1e9c973d`: `by mtime` prints line 99 only, inside `confirm_candidates`, and the context shows `applies_to: confirm` at line 98. Evidence: .skilled/commands/speckit/assets/speckit-resume.yaml:98 | Met | - |
| AC-003 | REQ-003 | Given the merged workflow, When an agent reads `session_detection`, Then no tier looks up a fixed trigger phrase | `rg -n -e 'resume work session context' -e 'tier_3_triggers' -e 'Trigger phrase matching' .skilled/commands/speckit/assets/speckit-resume.yaml` prints nothing. Observed at `2e1e9c973d`: the search prints nothing. Evidence: .skilled/commands/speckit/assets/speckit-resume.yaml:77 | Met | - |
| AC-004 | REQ-004 | Given the merged workflow and the presentation file, When an agent reads them, Then neither names a semantic or MCP source and the brief Source values equal the dashboard values | `rg -n -i -e 'mcp' -e 'semantic/' .skilled/commands/speckit/assets/speckit-resume.yaml .skilled/commands/speckit/assets/speckit-resume-presentation.txt` prints nothing. Observed at `2e1e9c973d`: the search prints nothing. Evidence: .skilled/commands/speckit/assets/speckit-resume-presentation.txt:119 | Met | - |
| AC-005 | REQ-005 | Given the merged workflow, When detection builds candidates, Then it searches `specs/` only | `rg -n '\.opencode/' .skilled/commands/speckit/assets/speckit-resume.yaml` prints nothing. Observed at `2e1e9c973d`: the search prints nothing. Evidence: .skilled/commands/speckit/assets/speckit-resume.yaml:80 | Met | - |
| AC-006 | REQ-006 | Given the assets folder, When an agent loads the resume workflow in either mode, Then one file serves both modes through `execution_mode`, `checkpoints`, `applies_to: confirm` and `mode_overrides.confirm` | `ls .skilled/commands/speckit/assets/speckit-resume*.yaml` prints only `speckit-resume.yaml`, and `rg -c -e '^execution_mode:' -e '^mode_overrides:' -e '^checkpoints:' -e 'after_step:' .skilled/commands/speckit/assets/speckit-resume.yaml` prints 4. Observed at `2e1e9c973d`: `ls` prints only `speckit-resume.yaml` and the count prints 4. Evidence: .skilled/commands/speckit/assets/speckit-resume.yaml:11 | Met | - |
| AC-007 | REQ-007 | Given the old files are deleted, When any router, metadata file, catalog or test resolves the resume workflow, Then it names `speckit-resume.yaml` | `rg -l 'speckit-resume-[a-z]+\.yaml' .skilled .opencode` prints nothing. `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js` prints `failed=0` with a PASS line for `speckit-resume.yaml keeps the shared purpose label shape in purpose_row`. `node --test .opencode/plugins/tests/speckit-goal-offer-contract.test.cjs` prints `fail 0`. Observed at `2e1e9c973d`: `rg -l` prints nothing, the test prints `Result: passed=151 failed=0` with the PASS line, and the goal test prints `fail 0`. Evidence: .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js:121 | Met | - |
| AC-008 | REQ-008 | Given a phase parent with a pointer in the access-telemetry store, When the phase redirect runs, Then the workflow names the store file, its key and the `graph-metadata.json` fallback in the order `resolvePhaseParentPointerHop` uses | `rg -n 'access-telemetry.json' .skilled/commands/speckit/assets/speckit-resume.yaml` prints one line and `rg -n 'the telemetry store' .skilled/commands/speckit/assets/speckit-resume.yaml` prints nothing. Observed at `2e1e9c973d`: one line, and `the telemetry store` prints nothing. Evidence: .skilled/commands/speckit/assets/speckit-resume.yaml:104 | Met | - |
| AC-009 | REQ-009 | Given no session is found, When the presentation or the workflow suggests new work, Then it names `/speckit:plan` | `rg -n 'speckit:complete' .skilled/commands/speckit/assets/speckit-resume.yaml .skilled/commands/speckit/assets/speckit-resume-presentation.txt` prints nothing, and `rg -n 'speckit:plan' .skilled/commands/speckit/assets/speckit-resume-presentation.txt` prints the Q0 and No Session lines. Observed at `2e1e9c973d`: `speckit:complete` prints nothing, and `speckit:plan` prints lines 47 and 134. Evidence: .skilled/commands/speckit/assets/speckit-resume.yaml:111 | Met | - |
| AC-010 | REQ-010 | Given a packet whose only continuity source is a `handover.md` older than 24 hours, When resume loads context, Then it reads that handover and reports its age | `rg -n '<24h' .skilled/commands/speckit/assets/speckit-resume.yaml` prints nothing, and `rg -n 'unbound handover' .skilled/commands/speckit/assets/speckit-resume.yaml` prints the ranking line. Observed at `2e1e9c973d`: `<24h` prints nothing and `unbound handover` prints line 119. Evidence: .skilled/commands/speckit/assets/speckit-resume.yaml:119 | Met | - |
| AC-011 | REQ-011 | Given the resume router, When an agent parses `$ARGUMENTS`, Then a flag table names `<spec-folder>`, `--phase-folder` and `--no-redirect` and the argument hint names `--no-redirect` | `rg -n -e '^\x7c .--no-redirect. \x7c' -e '^\x7c .--phase-folder. \x7c' .skilled/commands/speckit/resume.md` prints two lines, and `rg -n '^argument-hint:.*--no-redirect' .skilled/commands/speckit/resume.md` prints one line. Observed at `2e1e9c973d`: lines 44 and 45, and argument-hint line 3. Evidence: .skilled/commands/speckit/resume.md:45 | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** Yes

Yes. Every criterion is Met with output observed at commit `2e1e9c973d`.
<!-- /ANCHOR:closure -->
