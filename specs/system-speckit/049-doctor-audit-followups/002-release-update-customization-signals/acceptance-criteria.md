---
title: "Acceptance Criteria: Phase 2: release-update-customization-signals"
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
    packet_pointer: "system-speckit/049-doctor-audit-followups/002-release-update-customization-signals"
    last_updated_at: "2026-10-03T05:27:41Z"
    last_updated_by: "build-orchestrator"
    recent_action: "Closed every criterion with evidence"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-002-release-update-customization-signals"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 2: release-update-customization-signals

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/049-doctor-audit-followups/002-release-update-customization-signals
**Level:** 3
**Status:** Complete
**Date:** 2026-10-03
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a disposable repository whose generated artifact was regenerated locally, When `check --json` runs, Then the owning unit reports an update status rather than a customized one, and the report names the file as regenerated. | `node --test .skilled/commands/doctor/scripts/tests/release-update.test.cjs` passes with the generated-class case, and its captured output shows the unit status; the inventory the case uses is `scratch/generated-inventory.md`. Observed: the generated-class case passes; hub-a reports `update`, its leaf manifest and graph metadata report class `generated` and appear in `unit.regenerate`. Cited: scratch/engine-tests.log:9 | Met | - |
| AC-002 | REQ-002 | Given a copied `.skilled/` tree with no shared release history, When the base-recording action runs and `check --json` follows, Then every recorded unit reports `baseSource: recorded` and no unit needs the inference pass. | The engine test's copied-tree case passes and its captured `check --json` output shows `baseSource: recorded`; the run output is saved to `scratch/`. Observed: the copied-tree case passes, every recorded unit reports `baseSource: recorded`. Cited: scratch/fixture-demo.log:7 | Met | - |
| AC-003 | REQ-003 | Given `provenance.ts:95-116`, When the evaluation closes, Then ADR-003 names the exact hash payload (normalized buckets plus dependencies sorted by path) and states adopted or rejected with the fixture that justified it. | `plan.md` ADR-003 carries a status of Accepted or Rejected and quotes the payload; when adopted, the engine case that consumes the fingerprint passes under `node --test .skilled/commands/doctor/scripts/tests/release-update.test.cjs`. Observed: ADR-003 is Rejected and quotes the payload; no engine case consumes the fingerprint. Cited: plan.md:296 | Met | - |
| AC-004 | REQ-004 | Given a fixture upstream whose newest tag is a prerelease, When `check` runs without the opt-in and then with it, Then the default resolves the newest stable tag and the opt-in resolves the prerelease, both by numeric segment order. | `node .skilled/commands/doctor/scripts/release-update.cjs --help` lists the opt-in flag, and the engine test's prerelease case passes with both resolutions recorded in `scratch/`. Observed: `--help` lists `--include-prerelease`; default resolves v1.10.0.0, opted in resolves v1.11.0.0-beta.1, where string order would pick v1.9.x. Cited: scratch/fixture-demo.log:3 | Met | - |
| AC-005 | REQ-005 | Given an update-only fixture with no decisions, When `apply --dry-run` runs without a run directory, Then it prints the full write plan and exits 0; when a decision file is supplied without a run, it still refuses with exit 1. | The engine test's no-run apply case passes and its output shows both behaviors; the refusal names the missing alignment run. Observed: the no-run case passes: dry-run exit 0 with the full write plan and no run directory created; a decisions file with no plan exits 1 naming the missing alignment run. Cited: scratch/engine-tests.log:15 | Met | - |
| AC-006 | REQ-006 | Given the 54 local units the read-only check reports, When the measurement runs, Then `scratch/` records the generated-only count, the exact command, and the classifier rule that decided each file. | `node .skilled/commands/doctor/scripts/release-update.cjs check --json` output and the classification script's result are saved under `scratch/`, with the count and rule stated. Observed: 0 of 54 local units are generated-only; 8 generated files across 5 units, with the command and rule stated. Cited: scratch/measurement.md:10 | Met | - |

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

All six criteria are Met with the observed evidence cited in each row.
<!-- /ANCHOR:closure -->
