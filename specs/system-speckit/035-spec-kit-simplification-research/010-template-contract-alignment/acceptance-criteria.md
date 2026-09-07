---
title: "Acceptance Criteria: Template contract alignment"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "template alignment criteria"
  - "goal flag criterion"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/035-spec-kit-simplification-research/010-template-contract-alignment"
    last_updated_at: "2026-09-07T02:20:00Z"
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
# Acceptance Criteria: Template contract alignment

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 035-spec-kit-simplification-research/010-template-contract-alignment
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
| AC-001 | REQ-001 | Given a temporary target, When `create.sh --level 1 --with-goal` and `--level 2` run, Then the first carries a `goal.md` that passes the memory-block rule and the second carries `acceptance-criteria.md` | smoke scaffolds listed `goal.md` with two directive anchors and the Level 2 set with the closure document; the memory-block rule passed on the rerun after the author slug fix | Met | - |
| AC-002 | REQ-002 | Given the validator, When it collects documents, Then it reads the contract only and every level's lazy list names `resource-map.md` | `spec-doc-structure.ts` no longer carries the hardcoded pair; the parity suite asserts the four numbered lazy lists equal and the manifest lists the resource map in all seven rows | Met | - |
| AC-003 | REQ-003 | Given the manifest and the templates, When the parity suite runs, Then every declared version equals its marker | `template-version-parity.vitest.ts` passed after the five reconciliations | Met | - |
| AC-004 | REQ-004 | Given the repository, When the staleness checker runs, Then it classifies folders | the checker reported 7,807 documents with 3,954 current, 64 at `v1.0` and 3,789 without a version, where it previously reported every folder unknown | Met | - |
| AC-005 | REQ-005 | Given `SPECKIT_AC_COVERAGE_ENFORCE=true`, When coverage is under the floor, Then the rule fails | the two under-floor branches in `check-ac-coverage.sh` set the failing status under the switch; the reference and template carry the row | Met | - |
| AC-006 | REQ-006 | Given the skill's documents and the root README, When the retired names and the old claims are searched, Then nothing presents them as current | residue search returned only historical notes, fixtures and playbooks; the sk-doc validator exited zero on the seven touched READMEs and assets | Met | - |

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

Every criterion is met by observed command output. Consciously left out: the manifest's descriptive index is declared, not wired; the closure document stays an optional add-on because the presence rule cannot see the rollout cutoff; the continuity-freshness test that edits a retired document is recorded for the lane that owns tests.
<!-- /ANCHOR:closure -->
