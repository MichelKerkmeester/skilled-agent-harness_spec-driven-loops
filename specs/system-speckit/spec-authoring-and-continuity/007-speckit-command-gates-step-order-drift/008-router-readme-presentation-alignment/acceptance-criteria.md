---
title: "Acceptance Criteria: Phase 8: router-readme-presentation-alignment"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record or superseded by one."
trigger_phrases:
  - "router readme presentation alignment acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift/008-router-readme-presentation-alignment"
    last_updated_at: "2026-11-14T11:33:26Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-router-readme-presentation-alignment"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 8: router-readme-presentation-alignment

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 008-router-readme-presentation-alignment
**Level:** 2
**Status:** Draft
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

Each CHECK named below is the fenced block of that name in `plan.md` section 5, run with `bash` from the repository root.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the plan workflow as phase 2 leaves it, When the plan success text and dashboard name their artifacts, Then each named `.md` file appears in a step `outputs:` list of `speckit-plan.yaml` | CHECK-A10 prints nothing | Unmet | - |
| AC-002 | REQ-002 | Given the speckit command folder, When an operator or agent copies any example or next step, Then each command uses the router form with the mode as a separate argument | CHECK-A5 prints no match line and then `rg exit=1` | Unmet | - |
| AC-003 | REQ-003 | Given the plan or complete setup prompt, When the operator reads Q1 option D, Then D states its outcome and the workflow carries the same outcome under `spec_folder_skip` | CHECK-A8 prints a count of 1 for each of `speckit-plan-presentation.txt`, `speckit-complete-presentation.txt`, `speckit-plan.yaml` and `speckit-complete.yaml` | Unmet | - |
| AC-004 | REQ-004 | Given the workflows as phases 1 to 7 leave them, When the router, README or presentation file states a step count or the `termination` block states a last step, Then the count equals the number of counted step keys from step 1, half-steps included, and the last step equals the highest counted key number, with no value fixed in advance | CHECK-A1 prints nothing | Unmet | - |
| AC-005 | REQ-005 | Given the routers as phase 3 leaves them, When the README command table shows an invocation, Then its mode and flag tokens equal the router `argument-hint` tokens | CHECK-A2 prints nothing | Unmet | - |
| AC-006 | REQ-006 | Given the files in `.skilled/commands/speckit/` and `assets/`, When the README tree lists them, Then every file is listed, no listed file is missing on disk and no stale command count remains | CHECK-A3 prints nothing | Unmet | - |
| AC-007 | REQ-007 | Given the Workflow Flag Surface table in `complete.md`, When README section 7 describes the complete flags, Then every flag is listed and the lead sentence states no number of flags | CHECK-A4 prints nothing | Unmet | - |
| AC-008 | REQ-008 | Given the two unprefixed presentation assets that keep their names, When a caller under `.skilled` names either one and the README lists the assets, Then every caller resolves to a file that exists and the README states the naming rule in one sentence | CHECK-A6 lists both files, prints no `UNRESOLVED` line, prints a count of 1 for the README sentence and prints `STATUS=OK` | Unmet | - |
| AC-009 | REQ-009 | Given the lifecycle presentation files, When their failure, fail-fast, preamble and closing blocks are compared with the command name removed, Then each block has one wording and each presentation file is loaded by exactly one router | Every line CHECK-A7 prints is 1 | Unmet | - |
| AC-010 | REQ-010 | Given the canonical Gate 3 option C text, When the parity test reads every listed menu file, Then no file has drifted | CHECK-A8 prints `ℹ fail 0` | Unmet | - |
| AC-011 | REQ-011 | Given the routers in `.skilled/commands/speckit/`, When the README command table is read, Then each router has exactly one row and the handoff row is still present | CHECK-A9 prints no `README ROWS` line and prints `STATUS=OK` | Unmet | - |
| AC-012 | REQ-012 | Given the plan, implement and complete setup prompts, When the operator reads the questions, Then no Dispatch Mode question or `dispatch_mode` field remains and the questions run from Q0 with no gap to the end of the reply format range (closes X2) | CHECK-X2 prints only `rg exit=1` | Unmet | - |
| AC-013 | REQ-013 | Given the four lifecycle presentation files, When an agent reads the pre-bound marker block or the resolution table, Then the prior continuity field is named `prior_continuity_choice` and no `memory_choice` remains (closes X3) | CHECK-X3 prints `rg exit=1` and then a count of 2 for each of the four files | Unmet | - |

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

**Closeable:** No

No criterion is met yet, because this phase starts only after phase 7 closes.
<!-- /ANCHOR:closure -->
