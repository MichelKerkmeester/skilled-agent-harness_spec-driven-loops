---
title: "Acceptance Criteria: Phase 3: alignment-fixes"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "alignment fixes acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/008-own-all-doctor-commands/003-alignment-fixes"
    last_updated_at: "2026-11-24T21:45:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Marked every criterion with its evidence"
    next_safe_action: "Commit when the operator asks"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "own-all-doctor-commands"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 3: alignment-fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-skilled-doctor/008-own-all-doctor-commands/003-alignment-fixes
**Level:** 2
**Status:** Complete
**Date:** 2026-11-24
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the doctor workflows, When `skill_owner` is listed, Then every line names system-skilled-doctor | `grep -n '^skill_owner' .skilled/commands/doctor/assets/*.yaml \| grep -v system-skilled-doctor` prints nothing; recheck resolved X-S9-001 to X-S9-007 | Met | - |
| AC-002 | REQ-002 | Given the four routing scenarios, When each hook command runs, Then the brief matches the scenario | Live: `use system-skilled-doctor → /doctor:setup (run)`, `... /doctor:env list (run)`, `Also: /doctor:git setup (run)`; the DOC-406 loop prints `/doctor:helper (run)` head, `Also: /doctor:helper (run)` under `mcp-code-mode`, then no `/doctor:` | Met | - |
| AC-003 | REQ-003 | Given the phase 2 final gates, When they rerun, Then each result matches or improves | `scratch/gates/`: run-all `7 suite(s) passed, 0 failed`; spec-kit root `1365 passed \| 11 skipped`; advisor `3206 passed \| 4 skipped`; phrase reach `STATUS=OK phrases=262 bridges=35`; bridges `"changed": []`; playbook package lines identical to phase 2; advisor pytest `26 passed`, vocab reach, README parity, README validate and validate-playbook-test output identical to phase 2; README manifest fails on the same three sk-code report folders; sk-skill-check improves from `FINDINGS (2)` to `FINDINGS (1)` (C4 now PASS, C8 stale graph as before); graph-scan not rerun because it writes the advisor DB | Met | - |
| AC-004 | REQ-004 | Given the live docs, When the stale phrases are searched, Then none remain | `rg` for eleven commands, 13 scenarios, five legs, `.skilled/release/runs` and the old brief patterns hits only a validator fixture that uses the legacy path on purpose | Met | - |
| AC-005 | REQ-005 | Given the provenance test, When the index's provenance line is removed, Then it fails | Removed: `0 provenance lines` failure; restored: `3 passed (3)`; file byte-identical after restore | Met | - |
| AC-006 | REQ-006 | Given the two moved behaviors, When the pin tests run, Then both pass | `multi-typed-command-gates.vitest.ts` 10 passed; `command-attach.vitest.ts` 11 passed | Met | - |
| AC-007 | REQ-007 | Given the six skill-setup phrases, When stage two replays them, Then each reaches `DOCTOR_COMMANDS` | Replay of `INTENT_SIGNALS`: six phrases map to `DOCTOR_COMMANDS`, `write a unit test for the parser` maps to no intent | Met | - |

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

Every criterion is met with observed evidence, and the findings left open sit outside this branch.
<!-- /ANCHOR:closure -->
