---
title: "Acceptance Criteria: Phase 7: hermes-playbook-and-catalog"
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
    packet_pointer: "scaffold/008-hermes-playbook-and-catalog"
    last_updated_at: "2026-09-14T17:24:50Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 7: hermes-playbook-and-catalog

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-external-orchestration/071-cli-hermes-creation/008-hermes-playbook-and-catalog
**Level:** 3
**Status:** Complete
**Date:** 2026-09-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the playbook package, When validated, Then the root and scenario files exist at sibling depth | `PASS package=cli-external-orchestration/cli-hermes tier=FAIL_CLOSED scenarios=36 categories=11 violations=0`; Pi has 37 | Met | - |
| AC-002 | REQ-002 | Given the live scenarios, When executed, Then at least half have recorded evidence | Third pass `benchmark/reports/2026-09-15-phase-008-third-pass/`: all 44 executed in one sitting, 43 PASS and 1 FAIL (a model disagreement), the 14 hermetic cells via the runtime suite at 18 of 18 | Met | - |
| AC-003 | REQ-003 | Given the catalog packages, When the hub checker runs, Then both validate | `validate_catalog_package.py --strict`: cli-hermes `PASS: 0 violations`; hub `0 fail, 9 warn` (pre-existing warnings) | Met | - |
| AC-004 | REQ-001 | Given the stress matrix, When its bijection validator runs, Then no cli-hermes cell is missing | `PASS: CLI adapter stress matrix bijection ... missing tests: 0, missing playbooks: 0` | Met | - |

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

The second-pass run and the two package validators carry the phase; the first pass is retained and marked superseded because its two failures drove real fixes.
<!-- /ANCHOR:closure -->
