---
title: "Acceptance Criteria: Phase 4: catalog and playbook"
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
    packet_pointer: "cli-jev/001-cli-jev-creation/004-catalog-and-playbook"
    last_updated_at: "2026-09-20T10:30:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Closed the catalog and playbook criteria against the authored files"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-074-004-catalog-and-playbook"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 4: catalog and playbook

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-jev/001-cli-jev-creation/004-catalog-and-playbook
**Level:** 2
**Status:** Complete
**Date:** 2026-09-20
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the catalog, When a feature is looked up, Then the entry names the file that implements it | `.skilled/skills/cli-external-orchestration/cli-jev/feature-catalog/feature-catalog.md:1` — the four category files each carry anchors | Met | - |
| AC-002 | REQ-001 | Given the catalog, When a reader asks what the mode deliberately is not, Then the absences are listed rather than implied | `.skilled/skills/cli-external-orchestration/cli-jev/feature-catalog/feature-catalog.md:1` — the "what is not here" list | Met | - |
| AC-003 | REQ-002 | Given the playbook, When a scenario is read, Then it states a command and an expected observable | `.skilled/skills/cli-external-orchestration/cli-jev/manual-testing-playbook/exit-codes/no-key-exits-3-with-structured-json.md:1` | Met | - |
| AC-004 | REQ-002 | Given the playbook package, When its validator runs, Then it reports 22 scenarios across 5 categories with 0 violations | `.skilled/skills/cli-external-orchestration/cli-jev/manual-testing-playbook/manual-testing-playbook.md:74` — index links all 22 files; `validate-playbook-package.cjs --package cli-external-orchestration/cli-jev` printed `PASS ... scenarios=22 categories=5 violations=0` | Met | - |
| AC-005 | REQ-003 | Given the run, When its tally is read, Then what executed and what was skipped are both stated | `.skilled/skills/cli-external-orchestration/cli-jev/benchmark/reports/2026-09-20-phase-004-unauthenticated-pass/skill-benchmark-report.md:1` — 20 pass, 2 skip | Met | - |
| AC-006 | REQ-003 | Given a skipped scenario, When its row is read, Then the blocker is named instead of the row being omitted | `.skilled/skills/cli-external-orchestration/cli-jev/manual-testing-playbook/providers/auth-status-reports-key-state.md:34` — `SKIP` with the missing-credential blocker | Met | - |
| AC-007 | REQ-004 | Given the guard scenarios, When they are checked, Then each names a passing suite test rather than a remembered result | `.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs:477` and `:494` — the governance test and the bijection guard | Met | - |
| AC-008 | REQ-004 | Given the exit-code scenarios, When their evidence is read, Then it is the phase 001 matrix rather than a re-run | `../001-jev-contract-research-and-pin/scratch/probe-matrix.txt:28` | Met | - |

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

AC-005 carried the packet. A playbook that reports only its successes reads as complete coverage, so the run record's honesty about what it could not run is the part that makes the rest trustworthy. The first tally in that report was wrong — it double-counted — and was reconciled against the scenario files before closure.
<!-- /ANCHOR:closure -->
