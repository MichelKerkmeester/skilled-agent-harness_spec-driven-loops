---
title: "Acceptance Criteria: Phase 1: skill-and-tag-move"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "skill and tag move acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/001-skill-and-tag-move"
    last_updated_at: "2026-11-06T07:23:08Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-skill-and-tag-move"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 1: skill-and-tag-move

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-skilled-doctor/001-skill-and-overlay-build/001-skill-and-tag-move
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
| AC-001 | REQ-008 | Given the ten moved tags, When the doctor contract tests run, Then every test passes at the baseline count | `node --test .skilled/commands/doctor/scripts/tests/*.test.cjs` printed `tests 1005`, `pass 1005`, `fail 0`, the same as before the move | Met | - |
| AC-002 | REQ-008 | Given the regenerated bridges, When each doctor bridge's owner is read, Then install, symlink, update, setup, helper, runtime-mirrors, env, speckit, mcp and agents-md name `system-skilled-doctor` | `command-bridges.generated.json` read with `node -e`, every one of the ten reads `system-skilled-doctor` | Met | - |
| AC-003 | REQ-008 | Given the bridge change, When the drift guard runs, Then it passes | `npx vitest run tests/command-bridges-drift-guard.vitest.ts` printed `Tests 5 passed (5)` | Met | - |
| AC-004 | REQ-014 | Given the new skill, When the package and graph validators run, Then both pass | `validate_skill_package.py --strict` printed `PASS (exit 0)`; `skill_graph_compiler.py --validate-only` printed `VALIDATION PASSED` | Met | - |
| AC-005 | REQ-008 | Given the request "put Skilled into my project repo", When the advisor ranks it, Then `system-skilled-doctor` is first | `advisor_recommend` printed `system-skilled-doctor:0.95` first, where the baseline printed `command-doctor-helper:0.80` | Met | - |

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

Every criterion is `Met` with the command output named in its row.
<!-- /ANCHOR:closure -->
