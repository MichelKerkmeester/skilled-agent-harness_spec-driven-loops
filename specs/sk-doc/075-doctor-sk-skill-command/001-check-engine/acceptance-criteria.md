---
title: "Acceptance Criteria: Phase 1: check-engine"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "check engine acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/075-doctor-sk-skill-command/001-check-engine"
    last_updated_at: "2026-10-30T07:00:15Z"
    last_updated_by: "codex"
    recent_action: "Recorded final interpreter-discovery evidence and phase closure"
    next_safe_action: "No further work is pending in this phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-281-doctor-skill-command"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 1: check-engine

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/075-doctor-sk-skill-command/001-check-engine
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
| AC-001 | REQ-001 | Given the checker fixture scenarios, When `node --test .skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs` runs, Then it exits 0 | 31 tests passed, 0 failed, including advisor envelopes, package failure details, C6 skip/error rows, C11 isolation, nested lookup and PATH discovery; `.skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs:493`; `tasks.md:58` | Met | - |
| AC-002 | REQ-002 | Given `scratch/baseline/`, When `sk-skill-check.cjs check` runs over the fleet, Then every shipped root reports its baseline verdict | Fleet output was `Roots: 13; result: PASS`; JSON comparison matched both 13-root baseline files with `mismatches=0`; `tasks.md:59` | Met | - |
| AC-003 | REQ-003 | Given a working tree, When a fleet `check` runs, Then `git status --porcelain` prints the same lines before and after | `git status --short` printed identical lines before and after the fleet command, which exited 0; `tasks.md:60` | Met | - |
| AC-004 | REQ-004 | Given the plain, pre-migration, canon and dual-declaration fixtures, When `check --json` runs on each, Then C2 reports plain, older Skilled (`skill-md`), canon (`router-md`) and `dual-declaration` | The classification test passed for all four resolver verdicts in the 31-test suite; `.skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs:313` | Met | - |
| AC-005 | REQ-005 | Given an advisor stub that exits 75 and no FINDING rows, When C8 runs, Then the row remains UNKNOWN, `findingCount` is 0, `unknownCount` is 1, and the command exits 0 with `Result: NO FINDINGS (1 UNKNOWN)` | The unknown-only fixture passed; the live advisor exited 75 and `check sk-git` printed C8 UNKNOWN with exit 0; `.skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs:445`; `tasks.md:61` | Met | - |
| AC-006 | REQ-006 | Given the resolver path hidden, When `check` runs, Then it exits 2 and names the missing resolver | The missing machine-router resolver test asserted exit 2 and provision guidance; it passed in the 31-test suite; `.skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs:770` | Met | - |
| AC-007 | REQ-007 | Given any fixture, When `check --json` runs, Then `JSON.parse` accepts the output and it holds rows C1 to C13 plus `findingCount` and `unknownCount` | The JSON report test parsed all 13 rows and both counters; it passed in the 31-test suite; `.skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs:411` | Met | - |
| AC-008 | REQ-004 | Given a direct hub with a nested packet, When check runs on each, Then C1/C2 are INFO with `hub` or `hub-packet`, the packet retains the `router-md` resolver verdict, and C4 states that it reports parent-hub metadata | Hub and nested packet tests passed; `check sk-code-skilled` resolved as `hub-packet`, printed C1/C2 INFO and exited 0; `.skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs:363`; `tasks.md:61` | Met | - |
| AC-009 | REQ-003 | Given a target outside the skills root, When check runs, Then each runtime mirror is INFO `not-included`, C8/C13 are INFO as not in the repository advisor or corpus, and C11 measures that copy's own description | The outside-root test passed; the C11 isolation test kept this skill PASS while another row hard-failed; `.skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs:333`, `.skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs:594` | Met | - |
| AC-010 | REQ-007 | Given report text or a fleet report, When rows render, Then text details include validator codes, fleet output includes a codes column, row ids are four characters, and the name column fits the longest name | Package codes from `message` and `warnings`, first-line fallback detail, text/JSON rendering and fleet columns passed in the 31-test suite; `.skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs:459`, `.skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs:493`, `.skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs:507` | Met | - |
| AC-011 | REQ-006 | Given a missing Python executable or a Python executable without PyYAML, When preconditions run, Then exit 2 reports `PYTHON_MISSING` or `PYYAML_MISSING` with provision guidance | The missing-interpreter and missing-import tests asserted both codes and provision lines; `.skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs:659`, `.skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs:687` | Met | - |
| AC-012 | REQ-005 | Given advisor output whose prompt echoes the target name but whose recommendation ids do not match, When C8 runs, Then the echo is not counted as a hit | The mismatch test stayed at 0 hits; the nested `data.recommendations` envelope test and top-level fallback test passed; `.skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs:564`, `.skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs:575`, `.skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs:583` | Met | - |
| AC-013 | REQ-001 | Given a fleet with one passing root and one finding root, When `runFleet`, `directSkillRoots`, and `renderFleetText` run, Then both roots and their statuses are represented correctly | The mixed-root fleet fixture passed with one PASS, one FINDING and the expected codes column in the 31-test suite; `.skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs:507` | Met | - |
| AC-014 | REQ-008 | Given two distinct `python3` executables on `PATH`, the first without PyYAML and the second with it, When `PYTHON` is unset and `check` preconditions run, Then the second is selected; when all tried interpreters lack PyYAML, exit 2 names each; when `PYTHON` is set, only that interpreter is used, and an empty value yields `PYTHON_MISSING` without PATH fallback | PATH tests confirmed second-interpreter selection, all-candidate guidance, explicit-interpreter exclusivity and empty-value behavior; `.skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs:687`, `.skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs:702`, `.skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs:719`, `.skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs:735` | Met | - |

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

**Closeable:** Yes. All fourteen acceptance rows are Met with fresh test or command evidence, and strict phase validation passed.

All fourteen acceptance criteria have fresh test or command evidence recorded above and in `tasks.md`. Strict phase validation reported `RESULT: PASSED` with 0 errors and 0 warnings.
<!-- /ANCHOR:closure -->
