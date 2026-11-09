---
title: "Acceptance Criteria: Phase 6: deep-loop-single-executor-dispatch"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "deep loop single executor dispatch acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/047-v4-release-line-research/006-deep-loop-single-executor-dispatch"
    last_updated_at: "2026-11-08T23:38:59Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-deep-loop-single-executor-dispatch"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 6: deep-loop-single-executor-dispatch

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 006-deep-loop-single-executor-dispatch
**Level:** 2
**Status:** Complete
**Date:** 2026-11-08
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the four deep YAMLs, When a single-executor run selects `cli-opencode`, Then the branch takes command, args and input from `buildLineageCommand` and the argv carries no `--pure` | `rg -n -- "--pure" .skilled/commands/deep/assets/*.yaml` prints nothing; builder argv probe shows no `Unrecognized flag` | Met | - |
| AC-002 | REQ-002 | Given executor kind `cli-deepseek-harness` in single-executor mode, When the dispatch step runs, Then it exits non-zero naming fan-out, and no note claims single-executor dsh support | `rg -n "if_cli_deepseek_harness" -A12` in both auto YAMLs | Met | - |
| AC-003 | REQ-003 | Given the research YAMLs, When their executor references are listed, Then every one reads `config.executor.kind` | `rg -n "config\.executor\.type" .skilled/commands/deep/assets/deep-research-*.yaml` prints nothing | Met | - |
| AC-004 | REQ-004 | Given a new research lineage, When a dispatch id is built, Then it reads `config.lineage.generation` | `rg -n "g\{generation\}" .skilled/commands/deep/assets/deep-research-*.yaml` prints nothing | Met | - |
| AC-005 | REQ-005 | Given a CLI lineage or CLI single-executor iteration, When its prompt is composed, Then the agent persona is inline between persona markers | `rg -n "BEGIN AGENT PERSONA"` in `fanout-run.cjs` and the auto YAML CLI branches; fan-out unit tests | Met | - |
| AC-006 | REQ-006 | Given the research config sets `maxToolCallsPerIteration`, When the prompt pack renders, Then the cap printed is that value | `rg -n "Max 12" .skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl` prints nothing; every render step binds the variable | Met | - |
| AC-007 | REQ-007 | Given the deep YAMLs, When branches are listed, Then none is `if_cli_copilot` | `rg -n "if_cli_copilot" .skilled/commands/deep/assets/` prints nothing | Met | - |
| AC-008 | REQ-008 | Given the new contract test, When run, Then it passes on the fixed YAMLs and its assertions name the drift classes | `npx vitest run tests/unit/executor-branch-contract.vitest.ts` | Met | - |
| AC-009 | REQ-001 | Given the baseline suites, When rerun after the change, Then no previously passing test fails | runtime vitest and the four spec-kit YAML contract tests, counts in `implementation-summary.md` | Met | - |

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

Every criterion is Met with the evidence named in its row and in `implementation-summary.md`.
<!-- /ANCHOR:closure -->
