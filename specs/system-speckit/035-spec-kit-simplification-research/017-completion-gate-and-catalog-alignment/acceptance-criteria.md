---
title: "Acceptance Criteria: Completion gate and catalog alignment"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "completion gate criteria"
  - "malformed fingerprint criterion"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/035-spec-kit-simplification-research/017-completion-gate-and-catalog-alignment"
    last_updated_at: "2026-09-07T09:40:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Marked every criterion met with the evidence observed"
    next_safe_action: "None; the packet is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-simplification-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Completion gate and catalog alignment

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 035-spec-kit-simplification-research/017-completion-gate-and-catalog-alignment
**Level:** 2
**Status:** Complete
**Date:** 2026-09-07
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a closed checklist and an `Unmet` criterion, When the checker runs with `--json`, Then it reports `AC_UNMET` and the sentinel advises; with every row `Met` it reports `COMPLETE` | `runtime/cli/spec/check-completion.sh:327` reports the status; a temporary packet returned `unmet: 1, unbackedWaivers: 1`; `runtime/tests/completion-evidence-sentinel.vitest.ts:164` and `:177` cover both cases, 23 tests pass | Met | - |
| AC-002 | REQ-002 | Given a present non-hex stamp, When the freshness rule runs, Then it warns `malformed_fingerprint` and the hex and zero cases keep their codes | `runtime/cli/validation/continuity-freshness.ts:366` classifies it; `runtime/cli/tests/continuity-freshness.vitest.ts:261` covers it beside the existing hex and zero cases, 11 pass | Met | - |
| AC-003 | REQ-003 | Given the four lanes and the program, When they run, Then all pass | `implementation-summary.md:117` records the check: the runtime project passed 104 files and 1,260 tests, the CLI project 138 files and 1,357 tests after one catalog sentence was reworded for the vocabulary invariance, the legacy lane exit 0 and the validation lane 94 and 83 checks with 0 failures | Met | - |
| AC-004 | REQ-004 | Given the catalog and the cited documents, When the path scan and the phrase search run, Then only rows marked removed name a missing file and no cited phrase remains | the catalog path scan returns ten rows, all carrying the removed marker or re-pointed; `assets/level-decision-matrix.md:116` names the closure document; `references/workflows/quick-reference.md:581` names the recommender and the two gates | Met | - |

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

Every criterion is met by observed output. Consciously left out: the 27 hand-written stamps stay in their closed packets, now visible as their own class; the links scan stays a hand-run tool rather than a registry rule.
<!-- /ANCHOR:closure -->
