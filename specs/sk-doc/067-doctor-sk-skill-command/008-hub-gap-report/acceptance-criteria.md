---
title: "Acceptance Criteria: Phase 8: hub-gap-report"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "hub gap report acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/075-doctor-sk-skill-command/008-hub-gap-report"
    last_updated_at: "2026-10-30T10:10:00Z"
    last_updated_by: "claude-opus-worker"
    recent_action: "Fixed the review findings and re-observed every criterion"
    next_safe_action: "Start phase 009, or add the option to command-contract.json when a phase owns that file"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/sk-skill-check.cjs"
      - ".skilled/commands/doctor/scripts/lib/sk-skill-surface.cjs"
      - ".skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-285-doctor-hub-gap-report"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 8: hub-gap-report

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/075-doctor-sk-skill-command/008-hub-gap-report
**Level:** 2
**Status:** Complete
**Date:** 2026-10-30
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a mode already shipped in a hub, When `sk-skill-check.cjs check <mode> --into-hub <hub>` runs, Then every applicable row prints present and it exits 0 | Command output and exit code. Observed: `node .skilled/commands/doctor/scripts/sk-skill-check.cjs check cli-jev --into-hub cli-classifier` exits 0 with all eleven rows and `Rows: 11; 9 pass, 0 finding(s), 0 unknown, 2 n/a` / `Result: PASS`; `--json` reports `mode: "hub"`, rows H1 to H11, `exitCode: 0`; `check sk-create-command --into-hub sk-doc` exits 0 with `10 pass, 1 n/a`; `check sk-create-skill-parent --into-hub sk-doc --json` exits 0 with `skill: "sk-create-skill-parent"`, `exitCode: 0`, and the mode-identifying rows name that mode rather than the one it shares a packet with (`H1 Registered as sk-create-skill-parent`, `H2 routerSignals covers sk-create-skill-parent`, `H7 … including sk-create-skill-parent`, `H8 sk-create-skill-parent appears in the description.json keywords`); `check review --into-hub system-deep-loop` exits 0 with `H10 PASS` from the live advisor. Every one of the 42 modes across the 7 shipped hubs reports `0 finding(s), 0 unknown` and names the mode that was asked for. The test `the shipped hub and its mode report every applicable row present` asserts the same for `cli-classifier` | Met | - |
| AC-002 | REQ-002 | Given the fixture hub whose mode lacks `routerSignals`, When the same command runs, Then row 2 prints missing and it exits 1 | Test case in `sk-skill-check.test.cjs`. Observed: `the hub gap report carries all eleven rows and finds the mode with no stage-one signal` asserts `H2` is `FINDING` with `routerSignals has no entry for fixture-gap-mute`, `findingCount: 1` and `exitCode: 1` against `tests/fixtures/sk-skill-check/hubs/hub-gap`. A CLI run against the same invented hub also prints the `H2  FINDING` line and exits 1, alongside the hub-contract findings an invented hub deliberately has. `a hub whose hub-router.json is gone reports H2 and H3 as findings, never a pass by absence` copies that hub, deletes `hub-router.json`, runs the real `parent-skill-check.cjs` (which stops at `FAIL: 5a` and never prints 5b, 5e or 5i) and asserts `H2` and `H3` are `FINDING` with the `5a` line, `unverified` empty and exit 1 | Met | - |
| AC-003 | REQ-003 | Given a clean tree, When the option runs, Then `git status --porcelain` is identical before and after | Two `git status` captures. Observed: 14 porcelain entries before and 14 after `node .skilled/commands/doctor/scripts/sk-skill-check.cjs check sk-create-skill-parent --into-hub sk-doc --json`; `diff` of the two captures prints nothing and the run exits 0. The same capture is unchanged after runs against `sk-doc`, `cli-classifier`, `system-deep-loop` and all 42 shipped modes | Met | - |
| AC-004 | REQ-004 | Given a hub without `FULL_INVENTORY` and a `metadata`-class mode, When the report runs, Then rows 5 and 10 print n/a | Test cases. Observed: on `hub-gap`, a hub with no `FULL_INVENTORY` block and a `metadata` mode, `H5` and `H10` both report `N/A`; on `hub-inventory`, which carries the block, `H5` reports `PASS` with `FULL_INVENTORY carries 1 fixture-inventory-mode/ path`; `a stage-two intent that reaches the mode only through FULL_INVENTORY is a finding` proves the full-toolkit intent cannot stand in for the mode's own stage-two intent, for the text map and the parsed router map alike | Met | - |
| AC-005 | REQ-005 | Given the advisor returns exit 75, When the report runs, Then row 10 prints UNKNOWN | Test case with a stubbed advisor. Observed: `advisor exit 75 leaves the projection row UNKNOWN and never a pass` asserts `H10` is `UNKNOWN` with `exit 75`, `unknownCount: 1`, `findingCount: 0`, `exitCode: 0` and an empty `unverified` list | Met | - |
| AC-006 | REQ-006 | Given the new flag, When `route-validate.sh` and `run-all.sh` run, Then both pass | Script outputs. Observed: `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0 with `OK: route-validate — 19 routes validated, 3 warnings`; `bash .skilled/commands/doctor/scripts/tests/run-all.sh` exits 0 with `[run-all] 7 suite(s) passed, 0 failed`; `node --test .skilled/commands/doctor/scripts/tests/doctor-sk-skill-contract.test.cjs` exits 0 with `tests 14 / pass 14 / fail 0`; `node --test .skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs` exits 0 with `tests 53 / pass 53 / fail 0`; `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-prompts-hermes.cjs --check` exits 0 with `PASS: 39 prompts are in sync` | Met | - |

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

Every criterion is `Met`, each with the command output that decided it. The report is read-only, so no criterion depends on a state change. The review round tightened the report without changing what it claims: a row backed by `parent-skill-check.cjs` now needs that checker's confirming PASS line, so a checker that stops early leaves the row UNKNOWN instead of green, and the text renderer prints `Result: INCOMPLETE` with every unverified entry so the text and the JSON agree. One limit carries into the next phase: the router frontmatter `argument-hint` still shows the old flag set because `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` pins that exact string and the contract test asserts containment; the option is documented in the router's argument table and the presentation, and the summary records the deviation.
<!-- /ANCHOR:closure -->
