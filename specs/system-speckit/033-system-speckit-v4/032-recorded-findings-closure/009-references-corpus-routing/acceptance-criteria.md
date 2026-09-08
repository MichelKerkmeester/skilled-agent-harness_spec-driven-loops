---
title: "Acceptance Criteria: Phase 9: references-corpus-routing"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "references corpus acceptance criteria"
  - "browse only closure gate"
  - "leaf manifest ac traceability"
  - "resource map waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/032-recorded-findings-closure/009-references-corpus-routing"
    last_updated_at: "2026-09-07T15:05:51Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-07-036-009-references-corpus-routing"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 9: references-corpus-routing

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/033-system-speckit-v4/032-recorded-findings-closure/009-references-corpus-routing
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
| AC-001 | REQ-001 | Given the 17 files named by finding F3-14, When each file's body is read and dispositioned, Then every one is either reachable through SKILL.md's RESOURCE_MAP or quick-reference.md, or removed with its manifest rows | The disposition table in goal.md's log, cross-checked against SKILL.md's RESOURCE_MAP and the remaining file listing | Met | - |
| AC-002 | REQ-002 | Given a change to the corpus or the manifest, When generate-leaf-manifest.cjs --check runs against .opencode/skills/system-spec-kit, Then it exits 0 with no diff | `node .opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check .opencode/skills/system-spec-kit` | Met | - |
| AC-003 | REQ-003 | Given the landed change, When the routing-registry-drift workflow's leaf-manifest-freshness and skill-root-metadata gates run, Then both pass for system-spec-kit | `node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs` and `node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` | Met | - |
| AC-004 | REQ-004 | Given agent-io-contract.md and folder-structure.md, When their disposition is recorded, Then both are routed, not removed | goal.md's log shows both files marked "route", and CLAUDE.md's citations of both still resolve | Met | - |

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

**Closeable:** No

Not started. This packet stays Planned until the four criteria above move from Unmet to Met, Waived or Superseded.
<!-- /ANCHOR:closure -->
