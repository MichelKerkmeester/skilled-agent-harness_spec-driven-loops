---
title: "Acceptance Criteria: Phase 2: overlay-engine"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "overlay engine acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/002-overlay-engine"
    last_updated_at: "2026-11-06T07:23:10Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-overlay-engine"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 2: overlay-engine

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-skilled-doctor/001-skill-and-overlay-build/002-overlay-engine
**Level:** 3
**Status:** Complete
**Date:** 2026-11-06
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-003 | Given a re-pinned overlay whose source changed over its last applied copy, When status runs, Then it reads `overlay-edited` and no check line says `upstream changed` | `a re-pinned overlay whose source changed applies over its last applied copy with no restore step` failed on the straight port and passes on the engine | Met | - |
| AC-002 | REQ-004 | Given a path in both `replace` and `retained`, When the overlay moves, Then status reports it and the guard owns it | `a retained path that the overlay also replaces is reported, guarded and capturable` failed on the straight port and passes | Met | - |
| AC-003 | REQ-005 | Given a held lock, When apply or a capture runs, Then it refuses, names the owner line and the lock file, and writes nothing | The four lock tests failed on the straight port and pass | Met | - |
| AC-004 | REQ-009 | Given a `.skilled-overlays.json` setting, When the engine runs, Then the manifest, sources and state resolve inside the folder it names, and one function reads the setting | The four setting tests pass, and `rg -n "overlayDir" overlay-engine.cjs` prints one line inside `resolveOverlayDir` | Met | - |
| AC-005 | REQ-011 | Given a json-entry set that inserts an item and then sets a key on it, When apply runs twice, Then the first writes the result and the second prints `0 changed` | `a setKeyOnItem on an item the same entry set inserts applies in order` failed on the straight port and passes | Met | - |
| AC-006 | REQ-012 | Given a token-named file, When a manifest names it exactly or lists it in `protectedPaths`, Then it is read, and a token name met in a walk or any `.env` file is refused | The six token and `protectedPaths` tests pass, each recorded failing first except the `.env` test, which Barter already refused | Met | - |
| AC-007 | REQ-003 | Given the scratch copy of Barter's tree, When status runs, Then it exits 0 and leaves the copy unchanged | Exit 0, `in-sync=445`, `checked=118 ok=118`, and the copy's hashes matched before and after | Met | - |
| AC-008 | REQ-009 | Given the new command, When the doctor gate runs, Then `/doctor:overlay` passes its contract and the suite passes | `node --test .skilled/commands/doctor/scripts/tests/*.test.cjs` printed `pass 1051` and `fail 0`; `route-validate.sh` printed `30 routes validated` | Met | - |

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

Every criterion is `Met` with the test or command output named in its row. The red runs are in the session's red-then-green log.
<!-- /ANCHOR:closure -->
