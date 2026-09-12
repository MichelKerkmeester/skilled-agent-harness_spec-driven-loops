---
title: "Acceptance Criteria: Phase 4: sk-communication-upgrade"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "engine item criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/006-sk-communication-clarity/004-sk-communication-upgrade"
    last_updated_at: "2026-09-12T19:30:00Z"
    last_updated_by: "opus-5-session"
    recent_action: "Realigned the criteria with the spec, the eight engine items and the phase 007 prerequisite"
    next_safe_action: "Wait for phase 002's allocation table and phase 007's reply base, then change the package source and the skill documents"
    blockers:
      - "Phase 002's allocation table has not been built"
      - "Phase 007 has not produced the reply base"
    key_files:
      - ".opencode/skills/sk-communication/SKILL.md"
      - ".opencode/skills/sk-communication/cli-communication-projection/src/config/local-provider.ts"
      - ".opencode/skills/sk-communication/cli-communication-projection/src/fidelity/validator.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "opus-5-clarity-program"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 4: sk-communication-upgrade

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-communication/006-sk-communication-clarity/004-sk-communication-upgrade
**Level:** 2
**Status:** Draft
**Date:** 2026-09-12
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the skill, its commands, its assets and the package source, When searched for rubric text, Then one home is pointed at and no second copy exists | Re-run the duplication search and compare with the captured baseline | Unmet | - |
| AC-002 | REQ-002 | Given the scoped diff, When each of the eight engine items and each document change is traced, Then it maps to an adopted row in phase 002's allocation table | Walk the diff against the allocation table, both directions | Unmet | - |
| AC-003 | REQ-002 | Given the two provider profiles and the fixture, When the instruction and its temperature are read, Then all three resolve to one shared declaration | Read both profiles and the fixture, then change the declaration once and confirm nothing else carries a copy | Unmet | - |
| AC-004 | REQ-002 | Given the provider instruction, When its target noun is read against the profiles, Then it names the role the profiles actually declare | Read the instruction beside the copy-editing scope each profile sets | Unmet | - |
| AC-005 | REQ-002 | Given a candidate identical to its source, When the fidelity record is read, Then no pass marker appears for a comparison that did not run | Run the identical-candidate case and read the recorded checks | Unmet | - |
| AC-006 | REQ-002 | Given an accepted candidate, When the projection record is read, Then it states what kind of change the candidate made | Read the record for a rewrite and confirm the change kind is present | Unmet | - |
| AC-007 | REQ-002 | Given a candidate that changed nothing, When the record is read, Then it carries the no-op value rather than a pass | Run the unchanged-candidate case and read the outcome | Unmet | - |
| AC-008 | REQ-009 | Given a candidate that drops a claim, a caveat or a requirement present in its source, When validation runs, Then the candidate is rejected inside the existing guard | Exercise the dropped-caveat case and the compressed-claims case, then read the rejection's reason code | Unmet | - |
| AC-009 | REQ-002 | Given the two provider profiles, When each profile's thinking mode is read, Then both are provider-default | Read both profiles, then confirm one provider per lane still compiles a rewrite | Unmet | - |
| AC-010 | REQ-008 | Given the provider instruction, When it is resolved, Then it is the wording standard's reply base and no code path composes a private rubric onto it | Open the instruction constant, follow it to the base and search the package for a second rubric | Unmet | - |
| AC-011 | REQ-004 | Given either rewrite command document, When it is read, Then it names the pass it performs as rewording without reordering | Read both command documents and both runtime mirrors | Unmet | - |
| AC-012 | REQ-005 | Given the skill's wording-standard section, When its exclusion list is counted after phase 007 lands, Then it is one row shorter and the surviving row's reason is ownership rather than documentness | Count the exclusion rows and read the surviving row's reason | Unmet | - |
| AC-013 | REQ-003 | Given the changed engine, When the canonical original and the privacy order are read, Then the original is preserved and privacy still runs before ranking | Read the assembly and privacy stages, then confirm no changed file touches either order | Unmet | - |
| AC-014 | REQ-003 | Given a rejected, unsupported, timed-out, cancelled or failed rewrite path, When it returns, Then the bytes are the exact original | Exercise a rejected candidate and a cancelled run, then compare bytes | Unmet | - |
| AC-015 | REQ-006 | Given the change, When the enablement default and the advisor route exclusion are read, Then both are unchanged | Read the enablement check and the route-exclusion list | Unmet | - |
| AC-016 | REQ-007 | Given the change, When the feature catalog and the changelog are read, Then both record what changed | Read both entries and confirm they describe the shipped behavior | Unmet | - |
| AC-017 | REQ-003 | Given the final state, When the package gate runs, Then it passes with its output and exit status both read | `npm run check` in the package directory | Unmet | - |

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

This phase is blocked on phase 002's allocation table and on phase 007's reply base, because the
largest item resolves the provider instruction to the standard's reply base and that base is phase
007's output. The statement is written when the phase closes, naming which criteria carried it and
what was consciously left out.
<!-- /ANCHOR:closure -->
