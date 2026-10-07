---
title: "Acceptance Criteria: Phase 9: gate-3-menu-series-parent"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "gate 3 menu series parent acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/009-gate-3-menu-series-parent"
    last_updated_at: "2026-10-07T11:03:17Z"
    last_updated_by: "deepseek-v4.1-flash"
    recent_action: "Closed the acceptance criteria after the menu change and its suites passed"
    next_safe_action: "None, the packet is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "009-gate-3-menu-series-parent-close"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 9: gate-3-menu-series-parent

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/034-spec-folder-tooling/009-gate-3-menu-series-parent
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
| AC-001 | REQ-001 | Given the runtime menu and the mutation notice, When option B and option C are read, Then option B says new or unrelated work and option C names the series parent | `spec-gate-core.mjs` `GATE_3_QUESTION` and `GATE_3_MUTATION_NOTICE`, byte pins in `spec-gate-core.test.mjs`, hook suite 169 pass, 3 skipped, 0 fail | Met | - |
| AC-002 | REQ-002 | Given the menu and the notice, When the option labels are read, Then A, B, C and D keep their letters and their order | Byte pins for the labels and the hash in `spec-gate-core.test.mjs`, hook suite 169 pass, 3 skipped, 0 fail | Met | - |
| AC-003 | REQ-003 | Given the Pi dialog, When it builds its options, Then it reads the labels from `spec-gate-core.mjs` instead of a literal of its own | `spec-gate-enforce.ts` reads the exported labels, `spec-gate-pi-extension.vitest.ts` 9/9, `tsc --noEmit -p tsconfig.pi.json` exit 0 | Met | - |
| AC-004 | REQ-004 | Given the new menu text, When the hook suite and the skill-advisor parity suite run, Then both pass | Hook suite 169 pass, 3 skipped, 0 fail, `policy-plan-serializer-parity.vitest.ts` 32/32 | Met | - |
| AC-005 | REQ-005 | Given the repository outside `specs/`, When it is searched for the two old option C phrases, Then no copy remains | Repository search for `including a phase child` and `related folder or phase child` outside `specs/` returned nothing | Met | - |

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

The runtime menu text carried this phase, with the byte pins and the repository sweep closing it out. Option B and option C now match the rule `AGENTS.md` already states, and every copy found by the second-opinion review carries the same wording. The `/speckit:plan` intake listing was left out on purpose, as spec.md records.
<!-- /ANCHOR:closure -->
