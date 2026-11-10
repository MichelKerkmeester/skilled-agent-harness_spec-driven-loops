---
title: "Acceptance Criteria: Phase 6: deep-loop-executor-kind"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "deep loop executor kind acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/006-deep-loop-executor-kind"
    last_updated_at: "2026-11-06T08:02:05Z"
    last_updated_by: "codex"
    recent_action: "Recorded final AC status and evidence citations"
    next_safe_action: "Resolve the remaining verification gaps"
    blockers: ["AC-005: default-table search is unverified"]
    key_files: ["evidence/focused-suites-after.txt", "evidence/full-unit-current.txt", "evidence/task-verify-outputs.txt"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-085-006-deep-loop-executor-kind"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 6: deep-loop-executor-kind

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/006-deep-loop-executor-kind
**Level:** 2
**Status:** In Progress
**Date:** 2026-11-06
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a unit baseline captured before the edit, When the four named suites and then the full unit directory run, Then the suites pass and the full run adds no failure | Baseline: 139 files and 2503 tests passed (`evidence/baseline-unit.txt:46`). The four named suites passed 356 tests (`evidence/focused-suites-after.txt:19`). The later full run passed 139 files and 2524 tests with exit 0 after the latest code mtime (`evidence/full-unit-current.txt:49`, `evidence/full-unit-current.txt:54`) | Met | - |
| AC-002 | REQ-002 | Given the builder, When its test builds a lineage command, Then argv equals `dsh --profile headless --patch <route> --patch <lineage> --patch <guards> --json --permission-mode <preset> --approval-policy never -`, stdin is the prompt and cwd is the lineage directory | The four named suites pass 356 tests. The capture includes the recursion assertions and exit 0 (`evidence/focused-suites-after.txt:19`, `evidence/focused-suites-after.txt:24`) | Met | - |
| AC-003 | REQ-003 | Given an env with `LLMGATEWAY_API_KEY`, `OPENCODE_API_KEY`, inherited `DSH_HOME`, `DEEPSEEK_API_KEY`, `DSH_TELEMETRY_OTLP_URL` and `OPENCODE_FOO`, When the audit filters it, Then only the reviewed keys pass. The runner creates a fresh `DSH_HOME` under system temp and removes it after the lineage | The env test drops inherited `DSH_HOME` and the other unapproved keys (`evidence/task-verify-outputs.txt:41`). The focused suite covers the temporary-home lifecycle (`evidence/focused-suites-after.txt:19`) | Met | - |
| AC-004 | REQ-004 | Given a non-zero exit, a missing `final`, an `error` event or a `final.reason.kind` other than `completed`, When the validator judges the run, Then each is a failure and a nested `dsh` dispatch is refused | The focused run records nested-dispatch refusals and passes 356 tests with exit 0 (`evidence/focused-suites-after.txt:13`, `evidence/focused-suites-after.txt:19`, `evidence/focused-suites-after.txt:24`) | Met | - |
| AC-005 | REQ-005 | Given the edited config, When `rg` checks every default table in `executor-config.ts`, Then no `cli-deepseek-harness` appears in them | The saved grep shows matches in the config registry and capability maps but does not isolate every default table (`evidence/task-verify-outputs.txt:9`, `evidence/task-verify-outputs.txt:18`) | Unmet | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names observed evidence. |
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

AC-005 lacks a search that isolates every default table.
<!-- /ANCHOR:closure -->
