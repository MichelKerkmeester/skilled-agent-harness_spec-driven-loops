---
title: "Acceptance Criteria: Doctor scripts conformance"
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
    packet_pointer: "system-speckit/049-doctor-audit-followups/004-doctor-scripts-conformance"
    last_updated_at: "2026-10-03T17:24:51Z"
    last_updated_by: "scaffold"
    recent_action: "Marked every criterion Met with evidence"
    next_safe_action: "None; packet closeable"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "doctor-scripts-conformance"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Doctor scripts conformance

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/049-doctor-audit-followups/004-doctor-scripts-conformance
**Level:** 2
**Status:** Complete
**Date:** 2026-10-03
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given each verified P1 finding, When its regression test runs against the previous code and then the fixed code, Then it fails before and passes after | Worker reports with fail-before and pass-after per test; the parent session reran every suite and swapped two old scripts back in (7 and 19 failures, then all pass) | Met | - |
| AC-002 | REQ-002 | Given malformed or `null` input to any checker, When it runs, Then it prints its status line and exits with the checker-error code its workflow maps, never the drift code or a bare stack trace | Malformed-input tests: catalog `[null]` and roster crash exit 2 with `STATUS=ERROR`; hub checker `null` JSON and malformed entries fail with an exit-2 crash guard; route-validate empty manifest exits 2; guard malformed manifest exits 2 | Met | - |
| AC-003 | REQ-003 | Given the twelve scripts, When the doctor runner runs, Then every script has at least a happy-path, a drift-or-failure and an error-path test, and all pass | `run-all.sh` exit 0: node:test 183 of 183, unittest 10 of 10, bash 100 of 100, route self-test, freshness panel 11 of 11; every script listed in `tests/README.md` | Met | - |
| AC-004 | REQ-004 | Given a push that touches `.skilled/commands/**`, When CI runs, Then a job executes the doctor runner | `doctor-scripts` job in `.github/workflows/spec-kit-check.yml`; the workflow triggers on `.skilled/commands/**`; YAML parses with jobs check, mirrors, doctor-scripts | Met | - |
| AC-005 | REQ-005 | Given the scripts folder, When `verify_alignment_drift.py --fail-on-warn --check-exact-headers --check-sections --check-folders` runs over it, Then it reports zero findings | Verifier over the scripts folder: 28 files scanned, 0 findings, exit 0 | Met | - |
| AC-006 | REQ-006 | Given the scripts and tests, When shellcheck and the tsc unused-locals check run, Then neither reports an unused name, and no CLI option remains that nothing reads | shellcheck exit 0; tsc unused-locals 0; removed options rejected by tests (`mcp-doctor.sh --fix`, the dead `decide` and `rollback` options) | Met | - |
| AC-007 | REQ-007 | Given the changed flags and exit codes, When the doctor routes and workflow assets are read, Then they describe the scripts as they now behave | `route-validate.sh` and `--self-test` exit 0; workflow YAML updated for the changed codes and flags, listed in `implementation-summary.md` Files Changed | Met | - |
| AC-008 | REQ-001 | Given the real repository, When every doctor gate runs before and after the change, Then each keeps its verdict, or the change is explained as real drift that was fixed | Before-and-after gate table in `implementation-summary.md`: every gate keeps its exit code | Met | - |

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

All eight criteria are Met. The fixes, the per-script suites and the CI runner carried the packet. Lowercasing the mixed-case hub aliases was left out: that is routing data the hubs own, and the checker warns on it until it is done.
<!-- /ANCHOR:closure -->
