---
title: "Acceptance Criteria: Phase 43: label-finding-fixes"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/043-label-finding-fixes"
    last_updated_at: "2026-10-01T18:41:50Z"
    last_updated_by: "orchestrating-session"
    recent_action: "Met every acceptance criterion at closure"
    next_safe_action: "None for this phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-043-label-finding-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 43: label-finding-fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-jev/003-cli-jev-workflow-integration/043-label-finding-fixes
**Level:** 2
**Status:** Complete
**Date:** 2026-10-01
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001, REQ-004 | Given delta findings that cite files through `source`, `sources` and `evidence`, and a lineage config with `antiConvergence.convergenceMode: "off"`, When `score-stop-rater.cjs` derives gold and filters lineages, Then each file counts once, a new line range of a cited file is not new, a `Glob:` entry is skipped and the off-mode lineage is forced | `npx vitest run tests/unit/score-stop-rater.vitest.ts` from `.skilled/skills/system-deep-loop/runtime`: 41 pass, 0 failing (36 before). Census: `forced 242`, `no gold 72`, `sampled 25`. Commit `55c33b363e` | Met | - |
| AC-002 | REQ-002 | Given a transcript longer than 1,200 characters, When goal-core's `verifyGoalHeuristic` judges it, Then it reads the last 1,200 characters with no added marker and never reports its own cut as truncation, while a short transcript ending in `...` still does | `node --test .skilled/hooks/goal/lib/goal-core.test.cjs`: 78 pass (74 before). goal-slice 24, score-verifier-labeled-set 12, build-verifier-fixture 5, count-pi-goal-nudges 3, goal-pi 22, 0 failing. On the real 50-row set the parity arm answers `met` on 0 rows. Commit `5543f6861e` | Met | - |
| AC-003 | REQ-003, REQ-005 | Given 006's labeled rows and a stub `jev` first on `PATH`, When `score-goal-lint.cjs` runs with and without `--jev`, Then the run without it is byte-identical to before and the stub logs no call, each gate failure prints its skip line, and a scripted run prints both rule columns, the flips line and a verdict per rule | `node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/score-goal-lint.test.cjs` with the new stub cases: 25 pass (8 before), 0 failing. lint-goal-criteria 12, check-goal 16 and template-parity 4 unchanged. The run without a switch is byte-identical to the pre-arm output. Commits `a5b3c462f3`, `0cd052bf47` | Met | - |
| AC-004 | REQ-006 | Given a stub `cli-deem` whose health check fails four ways, When `score-goal-lint.cjs` runs with `--deem`, Then it prints each `deem arm skipped:` line, keeps the lexical output unchanged and never starts the server | The same suite's Deem cases: the health-gate case prints `not reachable`, `stub backend`, `bad health response` and `model`, keeps the lexical output, and the stub logs only `health`. Commit `b511965471` | Met | - |
| AC-005 | REQ-007 | Given the 027, 003 and 006 changes, When DeepSeek V4.1 Flash reviews them, Then no P0 or P1 stays open and every P2 is recorded | Three read-only DeepSeek V4.1 Flash rounds. Each P0 and P1 was reproduced and fixed (`5a7db2f019`, `0cd052bf47`, `9bb1781175`, `2825bd105b`, `1093a8520c`, `1f5d472ef7`), and every P2 is in `goal.md`'s log. No fourth round ran after the last one-word fix, which the session reproduced and covered with tests | Met | - |
| AC-006 | REQ-001 to REQ-007 | Given the final state, When the phase closes, Then `validate.sh --strict` prints `RESULT: PASSED` and `check-goal.cjs` prints `RESULT: PASSED (5/5 checks)` for this phase and the parent | `repair-derived.cjs --apply`, then both commands on `specs/cli-jev/003-cli-jev-workflow-integration/043-label-finding-fixes` and on the parent. `repair-derived.cjs --apply` repaired the phase and the parent. `validate.sh --strict` on this phase printed `Errors: 0  Warnings: 0` and `RESULT: PASSED`, and `--recursive` on the parent printed `RESULT: PASSED` for all 44 folders. `check-goal.cjs` printed `RESULT: PASSED (5/5 checks)` on this phase, the parent and every child | Met | - |

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

Every row is `Met` with evidence observed from the final state. The recorded P2s and the OpenCode plugin's copy of the verifier stay open by scope, as `goal.md`'s log says.
<!-- /ANCHOR:closure -->
