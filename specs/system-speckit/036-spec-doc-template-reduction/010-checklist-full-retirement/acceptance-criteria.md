---
title: "Acceptance Criteria: Checklist Full Retirement"
description: "Retire the standalone verification checklist across producers, contract, read-paths, templates and packets, with a fingerprint generation marker so no repository needs a repair to pull it."
trigger_phrases:
  - "ac coverage acceptance criteria"
  - "checklist deprecation closure criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement"
    last_updated_at: "2026-08-30T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the closure criteria for the coverage-source fix"
    next_safe_action: "Verify each criterion against the unit suite and the live packets"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/tests/check-ac-coverage.sh"
    session_dedup:
      fingerprint: "sha256:48b1104e947c15f7a3ca9c159e451a4db397df81961ad53f1dd05b10eda45d51"
      session_id: "2026-08-30-036-010-checklist-full-retirement"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "A retired criterion is exempt from citation; its decision record is the evidence"
---

# Acceptance Criteria: Checklist Full Retirement

<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement
**Level:** 3
**Status:** Complete
**Date:** 2026-08-29
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a Level 1 to Level 2 upgrade, When it runs, Then no verification checklist is produced | Live upgrade on a probe packet reported `Created: acceptance-criteria.md` and no checklist (`scripts/spec/upgrade-level.sh:798`) | Met | - |
| AC-002 | REQ-001 | Given the level contract, When it is read, Then the document appears in no bucket at any level | `scripts/tests/scaffold-golden-snapshots.vitest.ts:136` asserts absence from all four buckets; 9/9 pass | Met | - |
| AC-003 | REQ-002 | Given a packet whose digest predates this change, When it is validated, Then it reports no drift and needs no repair | 12-packet baseline sample identical to pre-change with no repair run; generation gate at `mcp-server/lib/validation/generated-metadata-integrity.ts:168` | Met | - |
| AC-004 | REQ-002 | Given a packet whose documents genuinely changed, When it is validated, Then drift is still reported | Editing spec.md on a current-generation packet reports 1 mismatch; restoring returns 0 | Met | - |
| AC-005 | REQ-003 | Given a verification item with no evidence, When the evidence rule runs, Then it is reported | `scripts/rules/check-evidence.sh:89` holds both id shapes; three fixtures report warn/pass/warn | Met | - |
| AC-006 | REQ-004 | Given the staged change, When it is inspected, Then no path inside a symlinked repository is touched | 0 staged paths under the four symlinked trees; all 2,270 deletions git-tracked in-repo | Met | - |
| AC-007 | REQ-005 | Given the rules, server modules and scripts, When searched, Then no read-path remains | 0 matching files across rules, live templates and `templates/spec-kit-docs.json` | Met | - |
| AC-008 | REQ-006 | Given the fixture suite, When it runs, Then it fails no more than before | HEAD 16 failed / 23 passed; now 13 failed / 22 passed | Met | - |

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

All eight criteria met. Two defects the retirement would otherwise have introduced - a fleet-wide fingerprint invalidation and a blanket evidence exemption - were found and closed before the change landed.
<!-- /ANCHOR:closure -->
