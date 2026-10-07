---
title: "Acceptance Criteria: Phase 12: template-phrase-cleanup-round-two"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "template phrase cleanup round two acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/012-template-phrase-cleanup-round-two"
    last_updated_at: "2026-10-07T16:50:00Z"
    last_updated_by: "claude-opus-5.5"
    recent_action: "Fixed the 21 failing folders and closed AC-006"
    next_safe_action: "None, the phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "012-template-phrase-cleanup-round-two-close"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 12: template-phrase-cleanup-round-two

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/034-spec-folder-tooling/012-template-phrase-cleanup-round-two
**Level:** 2
**Status:** Complete
**Date:** 2026-10-07
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the five template default sets, When the judge reads a phrase that is one of them, Then it reports `template-default` instead of an author phrase. | The three new frozen sets live at `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/phrase-judge.mjs:41`, `:49` and `:57`, and the template-default check matches any of the five sets at `:124`. `.skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts:147` rejects a phrase from each of the five templates as `template-default`. | Met | - |
| AC-002 | REQ-002 | Given a spec tree, When the cleanup runs without `--apply`, Then no file is written, and when an applied tree is cleaned again, Then nothing changes. | `.skilled/skills/system-spec-kit/runtime/cli/tests/template-phrase-cleanup.vitest.ts:240` keeps dry runs byte-identical, `:263` preserves author phrases and `:476` covers the clean second run. After the apply, a second run reported 0 files to change. | Met | - |
| AC-003 | REQ-003 | Given a new Level 2 packet, When its plan, tasks and implementation summary are scaffolded, Then each carries a slug-seeded phrase and none of its template defaults. | `.skilled/skills/system-spec-kit/runtime/cli/tests/create-root-numbering.vitest.ts:164` asserts the three seeds and the absence of every default, and `:224` pins the judge sets and the shell lists to their template files. | Met | - |
| AC-004 | REQ-004 | Given a list with one or more default rows plus at least one author phrase, When the cleanup applies, Then only the default rows go and author rows stay byte for byte, and a defaults-only list is reseeded like a full block. | `.skilled/skills/system-spec-kit/runtime/cli/tests/template-phrase-cleanup.vitest.ts:374` covers the mixed list, `:396` covers the defaults-only list, the second run in `:374` leaves the then author-only list unchanged and `:167` counts partial carriers per kind in the census. | Met | - |
| AC-005 | REQ-005 | Given a description-derived phrase, When its last word is a stop word, Then the trim drops that word in new packets and in the corpus. | `.skilled/skills/system-spec-kit/runtime/cli/tests/create-root-numbering.vitest.ts:204` scaffolds `Fix the parser so that` and asserts the seed `fix the parser`, and `:212` pins the shell list to the exported `DESCRIPTION_STOP_WORDS` list at `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs:44`. The corpus reseed trimmed 51 live `spec.md` phrases, for example `the injection screen scores only a corpus`. | Met | - |
| AC-006 | REQ-006 | Given the applied cleanup over 1,319 files in 541 folders, When strict validation runs, Then every touched packet passes. | Strict validation passed for all 541 touched folders. The first run passed 520. The other 21 failed on rules that read content the cleanup never changed, so they were failing before it. The operator chose to fix them in this phase: 43 missing `importance_tier` or `contextType` fields copied from each folder's `spec.md`, trigger phrases seeded into 4 `spec.md` files whose list was empty, one missing description, one missing continuity block, one status cell, two prose mentions of anchor markers reworded, and anchors and template headers added around the unchanged prose of four folders. Each of the 21 then reported RESULT: PASSED. | Met | - |
| AC-007 | REQ-006 | Given the final corpus state, When the freshness check runs, Then it exits 0 with nothing stale. | `generate-trigger-index.mjs --check` exits 0 after the rebuild on the final corpus. The 20 template-default phrases the index still carries belong to the template example files under `templates/examples/` and to one ClickUp catalog page, none of them a live packet. | Met | - |

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

All seven criteria are Met with recorded evidence: the judge sets and their pins, cleanup safety and idempotence, the three new seeds, partial-block handling, the stop-word trim, strict validation of all 541 touched folders and a fresh trigger index. Archived packets are consciously left out, and the census leaves their 470 carriers untouched.
<!-- /ANCHOR:closure -->

---
