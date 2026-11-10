---
title: "Acceptance Criteria: Phase 12: deep-loop-modes-and-commands"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "deep loop modes and commands acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/012-deep-loop-modes-and-commands"
    last_updated_at: "2026-11-06T08:57:12Z"
    last_updated_by: "codex-gpt-6"
    recent_action: "Cited the existing build and test evidence"
    next_safe_action: "Resolve the open P1 checks"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-085-012-deep-loop-modes-and-commands"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 12: deep-loop-modes-and-commands

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/012-deep-loop-modes-and-commands
**Level:** 2
**Status:** In Progress
**Date:** 2026-11-06
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the edited sources, When the `rg -l cli-deepseek-harness` command from `spec.md` Measured Behavior runs, Then it lists every research and review file named in `spec.md` Section 3 | Nine files listed, exit 0 (`evidence/rerun-checks.txt:6`) | Met | - |
| AC-002 | REQ-002 | Given the edited sources, When `node .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs` runs, Then the second compile reproduces both committed-source contracts | Both dry runs are byte-identical to the on-disk contracts (`evidence/compile-dry-run-compare.txt:1`) | Met | - |
| AC-003 | REQ-003 | Given research question Q13, When the phase records the council seat decision in this folder, Then the record names the chosen and rejected option, and if a seat is admitted `orchestrate-session-cli.vitest.ts` passes | ADR-001 chooses no seat and rejects admitting one now; the conditional council test does not apply (`decision-record.md:79`, `evidence/rerun-checks.txt:31`) | Met | - |
| AC-004 | REQ-004 | Given the phase 006 suite baseline, When `executor-config`, `fanout-run`, `combo-matrix` and `executor-audit` vitest suites rerun, Then they show no new failure | The saved check record reports 356/356 passing; the sandbox disposition identifies two environment-dependent assertions and records 242/242 passing in those two files outside the sandbox. These suites were not rerun in this closeout, as directed (`evidence/checks.txt:21`, `evidence/sandbox-test-disposition.txt:1`, `evidence/sandbox-test-disposition.txt:4`) | Met | - |

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

**Closeable:** Yes

All four acceptance rows are Met, so the acceptance gate is closeable. The phase remains In Progress because T002 has no saved pre-edit suite transcript and checklist items CHK-022, CHK-032, CHK-041 and CHK-050 remain open; their reasons are recorded in `tasks.md` and `implementation-summary.md`.
<!-- /ANCHOR:closure -->
