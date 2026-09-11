---
title: "Acceptance Criteria: Phase 2: transactional re-mint"
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
    packet_pointer: "system-speckit/035-derived-artifact-registry/002-transactional-remint"
    last_updated_at: "2026-09-11T06:37:40Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files:
      - "specs/system-speckit/035-derived-artifact-registry/002-transactional-remint/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-transactional-remint"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 2: transactional re-mint

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/035-derived-artifact-registry/002-transactional-remint
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
| AC-001 | REQ-001 | Given a fixture where the stub rewrites both derived files and then exits 2, When the hook runs, Then `git status --porcelain` is byte-identical to the pre-run capture | `.opencode/scripts/git-hooks/tests/pre-commit.test.sh`, partial-failure case | Unmet | - |
| AC-002 | REQ-002 | Given a packet selected by the gate, When a failure restores the tree, Then only that packet's `graph-metadata.json` and `description.json` are written and the rest of the index is untouched | Harness case plus the scoped path list read from the hook | Unmet | - |
| AC-003 | REQ-003 | Given a successful re-mint, When the hook exits 0, Then the files the tool rewrote are staged, as they are today | Existing harness case 9, still passing | Unmet | - |
| AC-004 | REQ-004 | Given the hook file, When both auto-repair gate header blocks are read, Then each states that staging regenerated outputs widens the commit | Grep over the two header blocks in `.opencode/scripts/git-hooks/pre-commit` | Unmet | - |
| AC-005 | REQ-005 | Given a pathspec-narrowed commit, When the hook runs, Then it is refused with the existing message, and a partly staged packet is still refused before any write | Existing harness cases 10 and 15, still passing | Unmet | - |
| AC-006 | REQ-006 | Given a staged derived file whose pre-run content matches neither HEAD's copy nor the generator's output, When the hook runs, Then the file is named in a refusal and the tree is restored | `.opencode/scripts/git-hooks/tests/pre-commit.test.sh`, non-generated-history case | Unmet | - |

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

Every criterion is `Unmet` until the phase executes. AC-001 carries the packet, because the assertion that decides this phase is `git status --porcelain` equality and not a staged-file listing. No row is waived, so no ADR is referenced here.
<!-- /ANCHOR:closure -->
