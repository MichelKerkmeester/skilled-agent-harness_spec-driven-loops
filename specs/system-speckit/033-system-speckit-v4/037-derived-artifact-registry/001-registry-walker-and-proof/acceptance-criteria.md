---
title: "Acceptance Criteria: Phase 1: registry, walker and proof"
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
    packet_pointer: "system-speckit/033-system-speckit-v4/037-derived-artifact-registry/001-registry-walker-and-proof"
    last_updated_at: "2026-09-11T06:37:37Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files:
      - "specs/system-speckit/033-system-speckit-v4/037-derived-artifact-registry/001-registry-walker-and-proof/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-registry-walker-and-proof"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 1: registry, walker and proof

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/033-system-speckit-v4/037-derived-artifact-registry/001-registry-walker-and-proof
**Level:** 3
**Status:** Draft
**Date:** 2026-09-11
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the registry, When each of the three artifacts is looked up, Then it carries non-empty sources, a generator command and target paths | `runtime/cli/lib/derived-artifacts.json`, one entry per artifact with every field populated | Unmet | - |
| AC-002 | REQ-002 | Given an unchanged tree, When `--check` runs twice, Then both runs report the same stale set and the same exit code | `runtime/tests/derive-artifacts.vitest.ts`, determinism case | Unmet | - |
| AC-003 | REQ-002 | Given a scratch worktree whose artifacts were regenerated, When one packet's `spec.md` is touched, Then only that packet's `graph-metadata.json` and `description.json` are named and the exit code is 1 | `runtime/tests/derive-artifacts.vitest.ts`, packet entry staling case | Unmet | - |
| AC-004 | REQ-003 | Given a staled target, When `--write` runs, Then the entry's declared generator is invoked and a second `--check` no longer names it | `runtime/tests/derive-artifacts.vitest.ts`, write round trip case | Unmet | - |
| AC-005 | REQ-004 | Given a check that cannot run, When the walker reports, Then the exit code is 2 and the failing check is named rather than reported fresh | Walker exit normalization covered by a unit case | Unmet | - |
| AC-006 | REQ-005 | Given a completed phase, When `git status --porcelain` is read, Then it shows three new paths and no modified tracked file | `git status --porcelain` from the final state | Unmet | - |
| AC-007 | REQ-006 | Given one staling case per entry, When that entry is deleted from the registry, Then its case fails | `runtime/tests/derive-artifacts.vitest.ts`, entry deletion case | Unmet | - |
| AC-008 | REQ-007 | Given the review claim about `make -q`, When the phase closes, Then plan ADR-002 records the tested observation and whether the claim was adopted | Plan ADR-002 status and its recorded observation | Unmet | - |

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

Every criterion is `Unmet` until the phase executes. AC-003 and AC-007 carry the packet, because a walker that flags stale targets without a case that fails when its mapping breaks proves nothing about the mapping. No row is waived, so no ADR is referenced here.
<!-- /ANCHOR:closure -->
