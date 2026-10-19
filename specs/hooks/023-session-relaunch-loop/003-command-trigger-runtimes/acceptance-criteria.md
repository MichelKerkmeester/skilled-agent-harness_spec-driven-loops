---
title: "Acceptance Criteria: Phase 3: command-trigger-runtimes"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "command trigger runtimes acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/003-command-trigger-runtimes"
    last_updated_at: "2026-10-16T20:16:22Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-command-trigger-runtimes"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 3: command-trigger-runtimes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** specs/hooks/023-session-relaunch-loop/003-command-trigger-runtimes
**Level:** 3
**Status:** Complete
**Date:** 2026-10-17
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given lane 3.1 has probed all four runtimes, when the spike verdict matrix is inspected, then the matrix has four rows, each with quoted evidence and a verdict (`AUTO`, `COMMAND-ONLY` or `BLOCKED`) (seed AC-3.1) | The published matrix at `.skilled/hooks/session-relaunch/README.md:13-21` carries the four rows: Codex AUTO and Hermes AUTO on live captures, Cursor and Devin COMMAND-ONLY. Lane 3.1 verdicts are recorded at `../scratch/run-ledger.md:195` (D57 Codex), `:196` (D58 Cursor and Hermes) and `:200` (D62 Devin), with the quoted evidence in `scratch/spike/SPIKE-codex.md`, `SPIKE-cursor-hermes.md` and `SPIKE-devin.md`. | Met | - |
| AC-002 | REQ-002 | Given the wrapper case arms exist, when the phase tests run, then per-runtime stub wrapper tests pass (seed AC-3.2) | `node --test` on the 15 concern files plus the OpenCode plugin test ended `fail 0` at 214/214 (PG1, `../scratch/run-ledger.md:291`). The stub-runtime wrapper suite asserts each runtime's relaunch argv, cwd change and absent resume flag (`skilled-loop.test.cjs:939-1011`, `RUNTIME_RELAUNCH_CASES` loop), with earlier lane results at D63 (184/184), D70 (200/200, 49/49 wrapper tests) and D81 (214/214). | Met | - |
| AC-003 | REQ-003 | Given the verdict matrix, when the adapter dirs and registry rows are inspected, then no adapter exists for any runtime without a captured firing event (seed AC-3.3) | Directory listing shows adapter dirs only for the AUTO runtimes: `.skilled/hooks/session-relaunch/codex/` (`context-nudge.mjs`, `prompt-seed.mjs`, `stop-arm.mjs`, `shared.mjs`) and `.skilled/hooks/session-relaunch/hermes/` (`context-nudge.mjs`, `session-end-arm.mjs`, bridged by `.hermes/plugins/repo-guards/`). No `cursor/` or `devin/` dir exists. The `hook-registry.json` delta is the 3 Codex rows only (PG2, `../scratch/run-ledger.md:292`); Cursor `stop` is not wired (README.md:33). | Met | - |
| AC-004 | REQ-004 | Given this phase's registry rows and mirrors landed, when the sync checks run, then `sync-hook-registrations.cjs --check` and `sync-runtime-mirrors.cjs --check` are at baseline or better, with only this phase's rows added (seed AC-3.4) | `sync-hook-registrations.cjs --check` PASS on the 32-hook registry with the delta confined to the 3 Codex rows (PG2, `../scratch/run-ledger.md:292`), and `sync-runtime-mirrors.cjs --check` PASS at 192 mirrors across 8 trees (PG3, `../scratch/run-ledger.md:293`). | Met | - |
| AC-005 | REQ-005 | Given the phase docs landed, when their validators run, then docs exist and pass their validators, and playbook scenarios for every runtime have a recorded result (seed AC-3.5) | `validate_document.py` rc=0 on 9/9 lane 3.6 docs plus the concern README (0 issues), `hvr_scan` 0 hard blockers on the new files, `validate-playbook-package.cjs` rc=0 with 1 pre-existing WARN elsewhere (PG6, `../scratch/run-ledger.md:296`; D78, D82). The playbook records a result for every runtime at `session-relaunch-command-runtimes.md:94-101`: the automatable checks pass inside PG1 and the four live checks are recorded "not run yet", with the reason that spec.md assigns final live runs to phase 004 lane 4.5 (PG7, `../scratch/run-ledger.md:297`), which the plan allows. | Met | - |

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

All five criteria are Met with observed evidence: the four-row verdict matrix (AC-001), the 214/214 stub and adapter suites (AC-002), adapters only on captured AUTO events for Codex and Hermes (AC-003), both sync checks at baseline-plus-this-phase's-rows (AC-004) and the doc set passing its validators with playbook live checks recorded not run for phase 004 lane 4.5 (AC-005). Gate PG items 1 to 10 were run from the final state at run-ledger.md:290-299.
<!-- /ANCHOR:closure -->
