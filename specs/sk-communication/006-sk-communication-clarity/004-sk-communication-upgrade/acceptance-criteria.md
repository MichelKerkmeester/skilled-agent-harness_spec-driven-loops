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
    next_safe_action: "None"
    blockers: []
    key_files:
      - ".opencode/skills/sk-communication/SKILL.md"
      - ".opencode/skills/sk-communication/cli-communication-projection/src/config/local-provider.ts"
      - ".opencode/skills/sk-communication/cli-communication-projection/src/fidelity/validator.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "opus-5-clarity-program"
      parent_session_id: null
    completion_pct: 100
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
**Status:** Complete
**Date:** 2026-09-12
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the skill, its commands, its assets and the package source, When searched for rubric text, Then one home is pointed at and no second copy exists | Re-run the duplication search and compare with the captured baseline, Met by T005 and T020, one home for the standard and no second instruction copy | Met | - |
| AC-002 | REQ-002 | Given the scoped diff, When each of the eight engine items and each document change is traced, Then it maps to an adopted row in phase 002's allocation table | Walk the diff against the allocation table, both directions, Met by T003, every change traces to the eight authorised items in scratch/allocated-items.md | Met | - |
| AC-003 | REQ-002 | Given the two provider profiles and the fixture, When the instruction and its temperature are read, Then all three resolve to one shared declaration | Read both profiles and the fixture, then change the declaration once and confirm nothing else carries a copy, Met by T006 and T024, both profiles and the fixture resolve to the declaration at src/config/copy-editing-instruction.ts:33 | Met | - |
| AC-004 | REQ-002 | Given the provider instruction, When its target noun is read against the profiles, Then it names the role the profiles actually declare | Read the instruction beside the copy-editing scope each profile sets, Met by T007, the framing at src/config/copy-editing-instruction.ts:35 names the assistant message, asserted at test/config/copy-editing-instruction.test.ts:37 | Met | - |
| AC-005 | REQ-002 | Given a candidate identical to its source, When the fidelity record is read, Then no pass marker appears for a comparison that did not run | Run the identical-candidate case and read the recorded checks, Met by T008 and T023, the five markers sit inside the guard at src/fidelity/validator.ts:184 | Met | - |
| AC-006 | REQ-002 | Given an accepted candidate, When the projection record is read, Then it states what kind of change the candidate made | Read the record for a rewrite and confirm the change kind is present, Met by T009, the accepted record carries the change kind at src/contracts/projection.ts:32, built at src/fidelity/validator.ts:267 | Met | - |
| AC-007 | REQ-002 | Given a candidate that changed nothing, When the record is read, Then it carries the no-op value rather than a pass | Run the unchanged-candidate case and read the outcome, Met by T010 and T023, the unchanged case records no-op at test/config/copy-editing-instruction.test.ts:59,70 | Met | - |
| AC-008 | REQ-009 | Given a candidate that drops a claim, a caveat or a requirement present in its source, When validation runs, Then the candidate is rejected inside the existing guard | Exercise the dropped-caveat case and the compressed-claims case, then read the rejection's reason code, Met by T011 and T022, the omission veto wired inside the guard at src/fidelity/validator.ts:229, reason code at src/fidelity/types.ts:49, tests at test/config/copy-editing-instruction.test.ts:89,105,133 | Met | - |
| AC-009 | REQ-002 | Given the two provider profiles, When each profile's thinking mode is read, Then both are provider-default | Read both profiles, then confirm one provider per lane still compiles a rewrite, Met by T012 and T024, provider-default at src/config/local-provider.ts:226 and src/runtime/external-cli-projection.ts:209, confirmed at test/config/copy-editing-instruction.test.ts:36,45 | Met | - |
| AC-010 | REQ-008 | Given the provider instruction, When it is resolved, Then it is the wording standard's reply base and no code path composes a private rubric onto it | Open the instruction constant, follow it to the base and search the package for a second rubric, Met by T013 and T020, the instruction resolves through the reply base at src/config/copy-editing-instruction.ts:9,35 and the duplication search returns one hit | Met | - |
| AC-011 | REQ-004 | Given either rewrite command document, When it is read, Then it names the pass it performs as rewording without reordering | Read both command documents and both runtime mirrors, Met by T014, T015 and T021, both PURPOSE sections declare the pass as rewording without reordering and both mirrors diffed clean | Met | - |
| AC-012 | REQ-005 | Given the skill's wording-standard section, When its exclusion list is counted after phase 007 lands, Then it is one row shorter and the surviving row's reason is ownership rather than documentness | Count the exclusion rows and read the surviving row's reason, Met by T017, one exclusion row shorter, the surviving row gives ownership rather than documentness as its reason | Met | - |
| AC-013 | REQ-003 | Given the changed engine, When the canonical original and the privacy order are read, Then the original is preserved and privacy still runs before ranking | Read the assembly and privacy stages, then confirm no changed file touches either order, Met by T001 and T027, the frozen invariants read at their source before the edits and the package gate passes from the final state | Met | - |
| AC-014 | REQ-003 | Given a rejected, unsupported, timed-out, cancelled or failed rewrite path, When it returns, Then the bytes are the exact original | Exercise a rejected candidate and a cancelled run, then compare bytes, Met by T025, each failed path returns the exact original bytes, tested at test/config/copy-editing-instruction.test.ts:128,166 | Met | - |
| AC-015 | REQ-006 | Given the change, When the enablement default and the advisor route exclusion are read, Then both are unchanged | Read the enablement check and the route-exclusion list, Met by T026, the default-off flag and the advisor exclusion unchanged, confirmed by search | Met | - |
| AC-016 | REQ-007 | Given the change, When the feature catalog and the changelog are read, Then both record what changed | Read both entries and confirm they describe the shipped behavior, Met by T018 and T019, the feature catalog and the v1.3.0.0 changelog record the shipped changes | Met | - |
| AC-017 | REQ-003 | Given the final state, When the package gate runs, Then it passes with its output and exit status both read | `npm run check` in the package directory, Met by T027, the output recorded at scratch/check-after.out, 82 test files, 455 tests, exit status 0 | Met | - |

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

This phase is blocked on phase 002's allocation table and on phase 007's reply base, because the
largest item resolves the provider instruction to the standard's reply base and that base is phase
007's output. The statement is written when the phase closes, naming which criteria carried it and
what was consciously left out.
<!-- /ANCHOR:closure -->
