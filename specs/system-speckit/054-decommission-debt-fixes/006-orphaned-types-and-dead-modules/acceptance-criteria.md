---
title: "Acceptance Criteria: Phase 6: orphaned-types-and-dead-modules"
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
    packet_pointer: "system-speckit/054-decommission-debt-fixes/006-orphaned-types-and-dead-modules"
    last_updated_at: "2026-09-05T06:13:08Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-05-054-006-orphaned-types-and-dead-modules"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 6: orphaned-types-and-dead-modules

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/054-decommission-debt-fixes/006-orphaned-types-and-dead-modules
**Level:** 2
**Status:** Planned
**Date:** 2026-09-05
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the seven `shared/types.ts` symbols and the two runtime modules, When each is resolved (deleted or kept), Then a grep proof or a stated reason exists for every one | `rg` output per item, or the reason comment at the declaration site | Unmet | - |
| AC-002 | REQ-002 | Given `completion-state.test.mjs` and `resource-map-extractor.vitest.ts`, When `vitest run` executes, Then both appear in the executed-file list, or both are confirmed deleted | `vitest run` output / `git status` | Unmet | - |
| AC-003 | REQ-003 | Given `alignment-validator.ts`'s empty catch, When it is reviewed, Then it either logs the caught error or states in a comment why swallowing it is intentional | Code review of the diff | Unmet | - |
| AC-004 | REQ-004 | Given `check-markdown-links.cjs`'s deduplicated `ROOTS`, When the script runs, Then its printed `files`/`checked` counts match a manual count of the deduplicated file set | `node check-markdown-links.cjs` output vs. manual count | Unmet | - |
| AC-005 | REQ-005 | Given the T001 typecheck baseline, When it is re-run after all six items are resolved, Then it reports the same or fewer errors, and every touched suite passes | Typecheck output diff; test run output | Unmet | - |

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

All five criteria are Unmet; none of the six named cleanup items has been resolved yet.
<!-- /ANCHOR:closure -->
