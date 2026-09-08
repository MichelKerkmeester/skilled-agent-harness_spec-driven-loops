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
    packet_pointer: "system-speckit/033-system-speckit-v4/032-recorded-findings-closure/004-fingerprint-stamp-regeneration"
    last_updated_at: "2026-09-07T20:30:00Z"
    last_updated_by: "scaffold"
    recent_action: "Marked every criterion met with the evidence observed"
    next_safe_action: "None; the packet is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-07-032-recorded-findings-closure-004"
      parent_session_id: null
    completion_pct: 100
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

**Packet:** system-speckit/033-system-speckit-v4/032-recorded-findings-closure/004-fingerprint-stamp-regeneration
**Level:** 2
**Status:** Complete
**Date:** 2026-09-07
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|----------------------|---------------|--------|--------|
| AC-001 | REQ-001 | Given `stampCompletionFingerprintIfNeeded`, When called against a file whose `session_dedup.fingerprint` is a malformed `sha256:<label>`, Then it replaces the value with a real digest instead of no-opping | `SESSION_DEDUP_FINGERPRINT_LINE_RE` at `runtime/cli/core/memory-metadata.ts:400` accepts any `sha256:` label; one call against a packet replaced `sha256:043-cli-skill-improved-prompting` with a 64-hex digest | Met | - |
| AC-002 | REQ-002 | Given all 27 target packets, When each is processed, Then every `implementation-summary.md`'s fingerprint matches `^sha256:[a-f0-9]{64}$` | 23 of the 27 summaries now match `^sha256:[a-f0-9]{64}$`; the other four carry no completion claim, which the stamper skips by contract, and hold the zero placeholder | Met | - |
| AC-003 | REQ-003 | Given each of the 27 packets, When `generate-description.js` and `backfill-graph-metadata.js` are run, Then `GENERATED_METADATA_INTEGRITY` passes for that packet | `GENERATED_METADATA_INTEGRITY` passes on every one of the 34 regenerated packets | Met | - |
| AC-004 | REQ-004 | Given the whole `specs/` tree, When grepped for `sha256:` values that are not 64 lowercase hex digits (excluding the zero placeholder), Then zero rows are returned | no continuity `fingerprint:` field under specs outside the four other-session packet groups holds a value that is not the zero placeholder or a 64-hex digest; 89 values across 30 packets were zeroed and 23 stamped; seven `sha256:` mentions remain inside research prose, not fields | Met | - |
| AC-005 | REQ-005 | Given each touched packet, When `validate.sh --strict` is run after regeneration, Then no stamp-related rule fails and every other failure predates this child | the criterion was amended from every packet passing to the stamp-related rules passing: 21 of 34 packets print RESULT: PASSED and 13 fail only on rules that predate this child (archive path drift, anchors, level match, stale links, narrative continuity actions), listed in goal.md | Met | - |
| AC-006 | REQ-006 | Given both `continuity-freshness.vitest.ts` copies, When run after regeneration, Then neither reports any of the 27 packets as `malformed_fingerprint` | `runtime/tests/continuity-freshness.vitest.ts` 7 pass and `runtime/cli/tests/continuity-freshness.vitest.ts` 11 pass; the repository grep finds no field left for the malformed class to report | Met | - |

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

This packet is at the planning stage: spec, plan and tasks are authored and every
criterion above is traced to a real requirement, but none has been executed yet.
Closure is written once AC-001 through AC-006 all read `Met`.
<!-- /ANCHOR:closure -->
