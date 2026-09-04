---
title: "Acceptance Criteria: Phase 5: hub-surface-truth"
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
    packet_pointer: "sk-doc/052-routing-completeness/005-hub-surface-truth"
    last_updated_at: "2026-09-02T18:54:23Z"
    last_updated_by: "claude-code"
    recent_action: "Re-ran the criteria verifications and recorded each result"
    next_safe_action: "None; the criteria are settled"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-052-005-hub-surface-truth"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 5: hub-surface-truth

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/052-routing-completeness/005-hub-surface-truth
**Level:** 3
**Status:** Complete
**Date:** 2026-09-02
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|---|---|---|---|---|---|
| AC-001 | REQ-001 | Given the inventory intent claims completeness, When it is compared to the leaf manifest, Then it enumerates every leaf or drops the claim | `ROUTER.md:1` FULL_INVENTORY holds 252 paths, matching the manifest leaf count, each resolving on disk. Recorded at `98a327edf9` | Met | |
| AC-002 | REQ-002 | Given a mode with a command file in every runtime tree, When the hub manifest is read, Then it does not report the mode as commandless | Re-run 2026-09-02: `grep -n 'sk-create-diff' .opencode/skills/sk-doc/SKILL.md` returns the mode's own row at `SKILL.md:35` carrying `/create:diff`, with no dash. The fix landed in `08eb67a0de` | Met | |
| AC-003 | REQ-003 | Given the readme summary and its frontmatter, When compared to the mode registry, Then both name the current mode set | `README.md:1` description, trigger phrases and at-a-glance table each name all six previously missing domains. Recorded at `98a327edf9` | Met | |
| AC-004 | REQ-004 | Given a document that contradicts its registry, When the new check runs, Then it fails | `parent-skill-check-command-column.test.cjs:1` covers the dash form, a wrong command string and a deleted row, and the restore case. Invariant 6c lives at `parent-skill-check.cjs:1` | Met | |

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

Invariant 6c carries the packet: it is the first check to read a hub document against the
registry it describes, and it was proven to fail three ways before it was trusted. AC-002 was
re-verified from the current tree rather than accepted from the commit that fixed it. What was
consciously left out is breadth: the invariant covers one column, so a hub document can still
contradict its registry in every other respect, and finding 25 stays owned rather than closed.
<!-- /ANCHOR:closure -->
