---
title: "Acceptance Criteria: Restore the Level-Upgrade Path and Clear the Vocabulary Invariance"
description: "The criteria this phase must satisfy before it may be closed."
trigger_phrases:
  - "restore level upgrade"
  - "upgrade-level fragments"
  - "vocabulary invariance"
  - "template addendum derivation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/008-template-contracts-and-acceptance-criteria/003-restore-level-upgrade-and-vocabulary-invariance"
    last_updated_at: "2026-08-30T04:17:55Z"
    last_updated_by: "claude-code"
    recent_action: "Restored the level-upgrade path and cleared the vocabulary invariance"
    next_safe_action: "None; both defects are fixed and verified"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/spec/upgrade-level.sh"
    session_dedup:
      fingerprint: "sha256:5b17aa0d3d539efad40bbe23b7ea5859a44ed6431b97eeb5dbb1c1a110e6e8ec"
      session_id: "2026-08-29-033-003-restore-level-upgrade"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Acceptance Criteria: Restore the Level-Upgrade Path and Clear the Vocabulary Invariance

<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/033-system-speckit-v4/008-template-contracts-and-acceptance-criteria/003-restore-level-upgrade-and-vocabulary-invariance
**Level:** 2
**Status:** Complete
**Date:** 2026-08-29
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a Level 1 packet, When it is upgraded step by step to Level 3+, Then every step exits 0 and no step rolls back | Chain run: L2, L3, L3+ each exit 0 (`scripts/spec/upgrade-level.sh:46`) | Met | - |
| AC-002 | REQ-001 | Given an upgraded document, When its headings are listed, Then no heading appears twice | Duplicate scan across spec, plan and checklist returned none (`scripts/spec/upgrade-level.sh:70`) | Met | - |
| AC-003 | REQ-001 | Given an upgrade to Level 2, When it completes, Then the packet carries the document the closure gate requires | Created: checklist.md, acceptance-criteria.md (`scripts/spec/upgrade-level.sh:722`) | Met | - |
| AC-004 | REQ-002 | Given the vocabulary invariance, When it runs, Then it passes | `workflow-invariance.vitest.ts` 2/2 pass | Met | - |
| AC-005 | REQ-002 | Given a planted leak, When the scanner runs, Then it is still reported | The sentinel test continues to pass, so the allowlist did not disable the scan | Met | - |

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

Both defects are fixed and verified, and the scanner still catches a planted leak. Nothing was waived.
<!-- /ANCHOR:closure -->
