---
title: "Acceptance Criteria: Phase 4: fingerprint-stamp-regeneration"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "fingerprint regeneration acceptance criteria"
  - "malformed stamp closure gate"
  - "writer widen proof"
  - "twenty seven packet strict proof"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/036-recorded-findings-closure/004-fingerprint-stamp-regeneration"
    last_updated_at: "2026-09-07T15:05:41Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-07-036-recorded-findings-closure-004"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 4: fingerprint-stamp-regeneration

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/036-recorded-findings-closure/004-fingerprint-stamp-regeneration
**Level:** 2
**Status:** Draft
**Date:** 2026-09-07
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|----------------------|---------------|--------|--------|
| AC-001 | REQ-001 | Given `stampCompletionFingerprintIfNeeded`, When called against a file whose `session_dedup.fingerprint` is a malformed `sha256:<label>`, Then it replaces the value with a real digest instead of no-opping | A manual call of the widened function against one of the 27 packets shows the field changed | Unmet | - |
| AC-002 | REQ-002 | Given all 27 target packets, When each is processed, Then every `implementation-summary.md`'s fingerprint matches `^sha256:[a-f0-9]{64}$` | `grep -c 'fingerprint: "sha256:[a-f0-9]\{64\}"' ` against each of the 27 files listed in `tasks.md` | Unmet | - |
| AC-003 | REQ-003 | Given each of the 27 packets, When `generate-description.js` and `backfill-graph-metadata.js` are run, Then `GENERATED_METADATA_INTEGRITY` passes for that packet | `validate.sh --strict` per packet shows `+ GENERATED_METADATA_INTEGRITY` | Unmet | - |
| AC-004 | REQ-004 | Given the whole `specs/` tree, When grepped for `sha256:` values that are not 64 lowercase hex digits (excluding the zero placeholder), Then zero rows are returned | The REQ-004 grep command run over `specs/` | Unmet | - |
| AC-005 | REQ-005 | Given each of the 27 packets, When `validate.sh --strict` is run after regeneration, Then it prints `RESULT: PASSED` | 27 individual `validate.sh --strict --no-recursive` runs | Unmet | - |
| AC-006 | REQ-006 | Given both `continuity-freshness.vitest.ts` copies, When run after regeneration, Then neither reports any of the 27 packets as `malformed_fingerprint` | `npx vitest run continuity-freshness` from both `runtime/tests/` and `runtime/cli/tests/` | Unmet | - |

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

This packet is at the planning stage: spec, plan and tasks are authored and every
criterion above is traced to a real requirement, but none has been executed yet.
Closure is written once AC-001 through AC-006 all read `Met`.
<!-- /ANCHOR:closure -->
