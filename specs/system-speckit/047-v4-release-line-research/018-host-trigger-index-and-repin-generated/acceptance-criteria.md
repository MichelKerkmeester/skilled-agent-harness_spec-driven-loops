---
title: "Acceptance Criteria: Phase 18: host-trigger-index-and-repin-generated"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "host trigger index and repin generated acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/047-v4-release-line-research/018-host-trigger-index-and-repin-generated"
    last_updated_at: "2026-11-09T12:00:00Z"
    last_updated_by: "remediation-orchestrator-b"
    recent_action: "Recorded acceptance evidence"
    next_safe_action: "Commit the phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-09-047-remediation-b"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 18: host-trigger-index-and-repin-generated

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `018-host-trigger-index-and-repin-generated`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-09
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given Barter's root with its `.speckit-index/`, When the worktree lookup runs with no --index, Then it reads the host index and finds a host packet, and from Skilled's checkout it reads the packaged index | Barter: `source : .speckit-index/trigger-index.json`, `specs/fe-partners-app/media/003-media-player-architecture/spec.md` at 1.000, exit 0, dirty count 8590 before and after. Skilled: `source : .skilled/skills/system-spec-kit/runtime/data/trigger-index.json`, `candidates : 20 (truncated) from 1028 phrase(s)`, exit 0 | Met | - |
| AC-002 | REQ-002 | Given a host copy whose packaged retrieval files are at the old pin, When the generator runs with no flags from the host root, Then it writes `.speckit-index/` with three sidecars and the packaged hashes are unchanged | Host copy: four files written under `.speckit-index/`, packaged sha256 prefixes d30f2a79, 0a896453, 3491eb54, 95ee8519 identical before and after | Met | - |
| AC-003 | REQ-003 | Given that host copy, When `overlay-engine.cjs repin --upstream <worktree> --to a4df2f3a51 --stage <dir>` runs, Then no refuse line names the four retrieval files | 0 `refuse:` lines and `RESULT: STAGED` (negative control with regenerated packaged files: 4 `refuse:` lines, `RESULT: FAILED`); exit 1 comes from two Barter overlays blocked by an upstream move, outside this phase | Met | - |
| AC-004 | REQ-004 | Given the baselines, When the retrieval files and the cli project rerun, Then every baseline pass holds | Retrieval 157 passed and 1 skipped before, 169 passed and 1 skipped after (12 new); cli project cli project 2410 passed and 20 skipped before, 2429 passed and 20 skipped after (one run covering both 018 and 019 code; +12 and +7 new) | Met | - |

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

Every criterion is Met with observed evidence.
<!-- /ANCHOR:closure -->
